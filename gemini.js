// Gemini generates assessment wording by default after the disclosed questionnaire flow.
(() => {
    const photoButton = getElement("gemini-photo-button");
    const explainButton = getElement("gemini-explain-button");
    const photoResult = getElement("gemini-photo-result");
    const confirmation = getElement("gemini-model-confirmation");
    const panel = getElement("gemini-explanation-panel");
    const explainStatus = getElement("gemini-explanation-status");
    const explanation = getElement("gemini-explanation-text");
    let service = null, controller = null, version = 0, lastAssessment = null;
    let checkingPhoto = false, localMatch = null, cloudMatch = null, photoAttempted = false;
    const comparison = getElement("photo-comparison");
    const description = getElement("problem-description");

    // Completed results can be explained; evidence gaps and safety instructions remain binding.
    function currentDiagnosis() {
        const node = tree?.nodes[currentNodeId];
        if (!canDiagnose(activeModel) || node?.type !== "result" || questionPanel.hidden || troubleshooting.hidden) return null;
        const diagnosis = getDiagnosis(activeModel, node.kind, answers);
        return diagnosis;
    }
    function refresh() {
        photoButton.disabled = !service || !photoReady || !!controller || checkingPhoto;
        photoButton.hidden = !photoAttempted;
        photoButton.textContent = "Retry Gemini check";
        if (checkingPhoto) { identifyButton.disabled = true; identifyButton.textContent = "Checking photo…"; }
        for (const button of [...photoConfirmations.children, ...confirmation.children]) button.disabled = checkingPhoto;
        const eligible = currentDiagnosis();
        panel.hidden = !eligible;
        getElement("gemini-photo-panel").hidden = !service;
        explainButton.disabled = !service || !eligible || !!controller;
        if (eligible && !service) explainStatus.textContent = "Gemini is unavailable. No AI response was generated. The verified guidance above remains available.";
    }
    function invalidate() {
        version++;
        lastAssessment = null;
        checkingPhoto = false; localMatch = null; cloudMatch = null; photoAttempted = false;
        comparison.textContent = ""; comparison.hidden = true;
        controller?.abort(); controller = null;
        photoResult.replaceChildren(); confirmation.replaceChildren();
        explanation.textContent = ""; explainStatus.textContent = "";
        photoButton.removeAttribute("aria-busy"); explainButton.removeAttribute("aria-busy");
        // Existing flow code completes its synchronous state change first.
        queueMicrotask(() => { refresh(); maybeAssess(); });
    }
    window.addEventListener("repera-state-change", invalidate);
    photoPreview.addEventListener("load", refresh);
    window.addEventListener("repera-view-change", refresh);
    recognitionService.then(info => {
        if (info?.gemini?.configured) {
            service = info;
            getElement("gemini-setup-status").textContent = "Photo-assisted assessment is available. Confirm the suggested model against its label.";
        }
        refresh();
        maybeAssess();
    });

    // Abort stale UI updates; aborting cannot recall data already sent to Google.
    async function request(endpoint, body, button, status, onSuccess) {
        if (!service || controller) return;
        const submitted = version;
        const requestController = new AbortController();
        controller = requestController;
        const timeout = setTimeout(() => requestController.abort(), 45000);
        button.setAttribute("aria-busy", "true");
        status.textContent = "Waiting for Gemini...";
        refresh();
        try {
            const response = await fetch(endpoint, { method: "POST", body, signal: requestController.signal,
                headers: { "X-Repera-Token": service.token, "X-Repera-Cloud-Consent": "yes",
                    "Content-Type": typeof body === "string" ? "application/json" : "application/octet-stream" } });
            const result = await response.json();
            if (submitted !== version) return;
            if (!response.ok) throw new Error(result.error || "Gemini could not finish.");
            onSuccess(result);
            return result;
        } catch (error) {
            if (submitted === version) status.textContent = error.name === "AbortError" ?
                "Gemini timed out. Use the local tools or try again later." : error.message;
        } finally {
            clearTimeout(timeout);
            if (submitted === version) { controller = null; button.removeAttribute("aria-busy"); refresh(); }
        }
    }

    // A Gemini suggestion never silently overrides the manual model or local NN.
    async function checkPhoto() {
        if (!service || controller || !photoReady || !photoInput.files[0]) return;
        const stamp = version;
        photoAttempted = true;
        comparison.hidden = true; comparison.textContent = "";
        if (photoInput.files[0].size > 8 * 1024 * 1024) { photoResult.textContent = "Choose a photo no larger than 8 MB."; return; }
        confirmation.replaceChildren();
        cloudMatch = null;
        let upload;
        try { upload = await preparePhoto(photoInput.files[0]); }
        catch (err) { if (stamp === version) photoResult.textContent = err.message; return; }
        if (stamp !== version) return;
        await request("/api/gemini/photo", upload, photoButton, photoResult, result => {
            cloudMatch = result;
            const model = TROUBLESHOOTING_MODELS[result.model_id];
            if (!model || result.evidence === "unknown") {
                photoResult.textContent = "Gemini could not suggest a supported model reliably. Read the vacuum's label and select it manually.";
                return;
            }
            photoResult.textContent = "Gemini's possible match: " + model.name + ". This is a second opinion, not verification. ";
            if (modelSelect.value && modelSelect.value !== result.model_id) {
                photoResult.append("This differs from your selection; your selected model has not been changed. ");
            }
            if (result.evidence === "visible_label" && result.observed_label) {
                photoResult.append("Gemini read the label as: " + result.observed_label + ". Check it yourself. ");
            }
            if (!canDiagnose(model)) {
                photoResult.append(model.userMessage || "Verified diagnostic guidance is unavailable for this model.");
                if (model.support) photoResult.append(" ", sourceLink(model.support));
                return;
            }
            const button = document.createElement("button");
            button.type = "button";
            button.textContent = "My vacuum's label matches " + model.name;
            button.addEventListener("click", () => { showModelIdentity(result.model_id, true); startDiagnosis(); });
            button.disabled = checkingPhoto;
            confirmation.appendChild(button);
        });
        if (stamp === version) compareMatches();
    }
    photoButton.addEventListener("click", checkPhoto);
    photoConfirmations.addEventListener("click", event => {
        if (event.target.closest("button") && service && !checkingPhoto && canDiagnose(activeModel)) startDiagnosis();
    });

    function compareMatches() {
        comparison.hidden = false;
        const localIds = localMatch?.status === "suggestion" ? (localMatch.recognized_models || localMatch.candidate_models) : [];
        const cloudId = cloudMatch?.evidence !== "unknown" && TROUBLESHOOTING_MODELS[cloudMatch?.model_id] ? cloudMatch.model_id : null;
        if (localIds?.length && cloudId) {
            comparison.textContent = localIds.includes(cloudId) ?
                "The neural network and Gemini suggested the same model family. Confirm the exact model on your vacuum's label." :
                "The neural network and Gemini disagree. Check the model number on your vacuum's label before choosing either suggestion.";
        } else if (localIds?.length) {
            comparison.textContent = "The neural network suggested a model family. Gemini has not provided a match; use the vacuum's label to confirm it or check the photo again.";
        } else if (cloudId) {
            comparison.textContent = "The neural network did not provide a usable match. Gemini's suggestion still needs confirmation against your vacuum's label.";
        } else comparison.textContent = "Neither check established a supported match. Use the vacuum's label to select a model manually.";
    }

    // One Continue action handles photo identification or the manually confirmed model.
    identifyButton.addEventListener("click", async event => {
        if (!service) return;
        if (modelSelect.value) {
            event.stopImmediatePropagation();
            showSelectedModel(false);
            startDiagnosis();
        } else if (photoReady) {
            event.stopImmediatePropagation();
            resetSelection();
            const stamp = version;
            checkingPhoto = true;
            photoAttempted = true;
            refresh();
            await Promise.allSettled([
                recognizePhoto().then(result => {
                    if (stamp !== version) return;
                    localMatch = result;
                    refresh();
                }),
                checkPhoto()
            ]);
            if (stamp !== version) return;
            checkingPhoto = false;
            identifyButton.disabled = false;
            identifyButton.textContent = "Identify vacuum";
            identifyButton.removeAttribute("aria-busy");
            compareMatches();
            refresh();
        }
    }, true);
    description.addEventListener("input", () => {
        // Description text is not part of a photo identity request.
        if (checkingPhoto) return;
        invalidate(); lastAssessment = version;
    });

    // Generate a single combined explanation after an eligible questionnaire completes.
    async function maybeAssess(force = false) {
        if (!service || !currentDiagnosis() || controller) return;
        const stamp = version;
        if (!force && lastAssessment === stamp) return;
        lastAssessment = stamp;
        const payload = {model_id:modelSelect.value, answers:answers.map(a=>a.answer), description:description.value, photo:null};
        const file = photoReady ? photoInput.files[0] : null;
        try {
            if (file) {
                const upload = await preparePhoto(file);
                payload.photo = await new Promise((resolve,reject) => {
                    const reader = new FileReader();
                    reader.onload = () => resolve(reader.result.split(",")[1]);
                    reader.onerror = () => reject(new Error("The photo could not be read. Your local result remains available."));
                    reader.readAsDataURL(upload);
                });
            }
            if (stamp !== version) return;
            explanation.textContent = "";
            await request("/api/gemini/assess", JSON.stringify(payload), explainButton, explainStatus, result => {
                if (typeof result.explanation !== "string") throw new Error("Gemini did not return an explanation.");
                explanation.textContent = result.explanation;
                explainStatus.textContent = (payload.photo ? "Photo and questionnaire assessment" : "Questionnaire assessment") + ": AI wording, not a confirmed diagnosis";
            });
        } catch (error) {
            if (stamp === version) explainStatus.textContent = error.message;
        }
    }
    explainButton.addEventListener("click", () => maybeAssess(true));
})();
