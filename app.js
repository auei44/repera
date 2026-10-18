// Find page controls once so the rest of the code can focus on the flow.
const getElement = id => document.getElementById(id);
const photoInput = getElement("vacuum-photo");
const photoPreview = getElement("photo-preview");
const photoError = getElement("photo-error");
const modelSelect = getElement("model-select");
const identifyButton = getElement("identify-button");
const inputError = getElement("input-error");
const result = getElement("result");
const modelResult = getElement("model-result");
const troubleshooting = getElement("troubleshooting");
const questionPanel = getElement("question-panel");
const questionProgress = getElement("question-progress");
const questionText = getElement("question-text");
const answerButtons = getElement("answer-buttons");
const answerSummary = getElement("answer-summary");
const clearPhotoButton = getElement("clear-photo-button");
const startDiagnosisButton = getElement("start-diagnosis-button");
const backButton = getElement("back-button");
const photoSuggestion = getElement("photo-suggestion");
const photoConfirmations = getElement("photo-confirmations");

// Only enabled MVP models become diagnostic choices; archived identities stay in a plain list.
Object.entries(TROUBLESHOOTING_MODELS).filter(([, model]) => model.diagnosticEnabled === true && canDiagnose(model)).forEach(([id, model]) => {
    const option = document.createElement("option");
    option.value = id;
    option.textContent = model.name;
    modelSelect.appendChild(option);
});
Object.entries(TROUBLESHOOTING_MODELS).filter(([, model]) => model.diagnosticEnabled !== true).forEach(([id, model]) => {
    const item = document.createElement("li");
    item.dataset.model = id;
    item.textContent = model.name;
    getElement("recognition-only-models").appendChild(item);
});

// Keep the selected model and answer path only in memory, never on a server.
let activeModel = null;
let tree = null;
let currentNodeId = null;
let answers = [];
let previewUrl = null;
let photoReady = false;
let predictionController = null;
let selectionVersion = 0;
let intakeOpen = true;

// Detect the local prediction service; static-file/manual use still works offline.
const recognitionService = (async function () {
    if (!/^https?:$/.test(location.protocol)) return null;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    try {
        const response = await fetch("/api/model", { signal: controller.signal, cache: "no-store" });
        if (!response.ok) return null;
        const service = await response.json();
        if (!service.available || typeof service.token !== "string") return null;
        getElement("recognition-status").textContent = "Local photo recognition is connected. Confirm your vacuum's model number before troubleshooting.";
        if (Array.isArray(service.coverage) && service.coverage.length) {
            const rows = service.coverage.filter(row => typeof row.name === "string" && Array.isArray(row.candidate_models));
            const enabled = new Set(rows.flatMap(row => row.candidate_models).filter(id => canDiagnose(TROUBLESHOOTING_MODELS[id])));
            getElement("recognition-status").textContent = "Local photo recognition is connected: " + rows.length + " recognition labels; " + enabled.size + " model/series choices with verified guidance.";
            getElement("model-coverage-note").textContent = "Photo suggestions may be wrong, especially for unfamiliar vacuums. " +
                (service.experimental ? "This experimental model has limited training photos and no independent model-level accuracy result. " : "") +
                "Confirm the model number on the vacuum before following guidance.";
            const list = getElement("model-coverage-list");
            for (const row of rows) {
                const item = document.createElement("li");
                item.textContent = row.name + (row.candidate_models.some(id => enabled.has(id)) ? " — guidance available after label confirmation" : " — recognition only; guidance still being verified");
                list.appendChild(item);
            }
            getElement("model-coverage").hidden = false;
        }
        return service;
    } catch { return null; }
    finally { clearTimeout(timeout); }
})();

// Changing either input clears old answers and updates the Continue button label.
function resetSelection() {
    intakeOpen = true;
    getElement("vacuum-selection").hidden = false;
    window.dispatchEvent(new Event("repera-state-change"));
    selectionVersion += 1;
    predictionController?.abort();
    predictionController = null;
    identifyButton.disabled = false;
    identifyButton.removeAttribute("aria-busy");
    photoSuggestion.hidden = true;
    photoConfirmations.replaceChildren();
    result.hidden = true;
    result.removeAttribute("data-kind");
    result.querySelector("h3").textContent = "Model check";
    modelResult.textContent = "";
    getElement("model-availability").textContent = "";
    getElement("unsupported-sources").replaceChildren();
    troubleshooting.hidden = true;
    questionPanel.hidden = true;
    getElement("diagnosis-result").hidden = true;
    inputError.textContent = "";
    activeModel = null;
    tree = null;
    currentNodeId = null;
    answers = [];
    clearHandoff();
    answerSummary.replaceChildren();
    getElement("summary-download-status").textContent = "";
    identifyButton.textContent = modelSelect.value ? "Continue" : "Identify vacuum";
    startDiagnosisButton.hidden = false;
}
// Release the old photo URL so replacing a photo does not waste memory.
function clearPreview() {
    photoReady = false;
    photoPreview.hidden = true;
    photoPreview.removeAttribute("src");
    clearPhotoButton.hidden = true;
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    previewUrl = null;
}

// Preview local images and clear stale results when a file changes or is removed.
photoInput.addEventListener("change", function () {
    // A replacement photo after a diagnosis belongs to a new identification.
    if (photoInput.files.length && tree && !questionPanel.hidden) modelSelect.value = "";
    resetSelection();
    clearPreview();
    photoError.textContent = "";
    photoInput.removeAttribute("aria-invalid");
    const photo = photoInput.files[0];
    if (!photo) return;
    if (photo.type && !photo.type.startsWith("image/")) {
        photoError.textContent = "Choose an image file for the photo preview.";
        photoInput.setAttribute("aria-invalid", "true");
        photoInput.value = "";
        return;
    }
    previewUrl = URL.createObjectURL(photo);
    photoPreview.src = previewUrl;
    clearPhotoButton.hidden = false;
});
photoPreview.addEventListener("load", function () {
    photoReady = true;
    photoPreview.hidden = false;
    inputError.textContent = "";
});

// Handle unreadable images without leaving a broken preview or old result.
photoPreview.addEventListener("error", function () {
    clearPreview();
    photoInput.value = "";
    resetSelection();
    photoError.textContent = "This image could not be previewed. Choose another image.";
    photoInput.setAttribute("aria-invalid", "true");
});
clearPhotoButton.addEventListener("click", function () {
    photoInput.value = "";
    clearPreview();
    photoError.textContent = "";
    resetSelection();
    photoInput.removeAttribute("aria-invalid");
    photoInput.focus();
});
modelSelect.addEventListener("change", function () {
    resetSelection();
    if (modelSelect.value) showSelectedModel(false);
});

// Create readable source links safely, without inserting HTML from the data.
function sourceLink(source) {
    const link = document.createElement("a");
    link.textContent = source.title;
    link.href = source.url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    return link;
}
function showSources(sources) {
    const list = getElement("source-list");
    list.replaceChildren();
    const seen = new Set();
    sources.forEach(function (source) {
        if (seen.has(source.url)) return;
        seen.add(source.url);
        const item = document.createElement("li");
        item.appendChild(sourceLink(source));
        const scope = document.createElement("p");
        scope.textContent = source.scope;
        item.appendChild(scope);
        list.appendChild(item);
    });
}

// A selected model exposes Start diagnosis immediately; Continue focuses that step.
function showSelectedModel(moveFocus) {
    showModelIdentity(modelSelect.value, moveFocus);
}

// Only a manual choice or explicit label confirmation opens diagnostic guidance.
function showModelIdentity(modelId, moveFocus = false) {
    resetSelection();
    activeModel = TROUBLESHOOTING_MODELS[modelId];
    if (!activeModel) {
        modelSelect.value = "";
        identifyButton.textContent = "Identify vacuum";
        modelResult.textContent = "Unrecognized model.";
        getElement("model-availability").textContent = DIAGNOSIS_POLICY.pending;
        result.hidden = false;
        startDiagnosisButton.hidden = true;
        return;
    }
    modelSelect.value = canDiagnose(activeModel) ? modelId : "";
    identifyButton.textContent = modelSelect.value ? "Continue" : "Identify vacuum";
    modelResult.textContent = "Selected model: " + activeModel.name;
    result.hidden = false;
    if (!canDiagnose(activeModel)) {
        getElement("model-availability").textContent = activeModel.userMessage;
        if (activeModel.support) getElement("unsupported-sources").appendChild(sourceLink(activeModel.support));
        startDiagnosisButton.hidden = true;
        return;
    }
    getElement("selected-model").textContent = activeModel.name;
    getElement("model-note").textContent = activeModel.note || "";
    getElement("model-note").hidden = !activeModel.note;
    result.hidden = false;
    troubleshooting.hidden = false;
    showSources(activeModel.sources);
    if (moveFocus) startDiagnosisButton.focus();
}

// Phone JPEGs can contain HDR auxiliary frames; send one frame without changing originals.
async function preparePhoto(file) {
    if (file.size > 8 * 1024 * 1024) throw new Error('Choose a photo no larger than 8 MB.');
    const bitmap = await createImageBitmap(file);
    try {
        const scale = Math.min(1, 1600 / Math.max(bitmap.width, bitmap.height)), canvas = document.createElement('canvas');
        canvas.width = Math.round(bitmap.width * scale); canvas.height = Math.round(bitmap.height * scale);
        canvas.getContext('2d').drawImage(bitmap, 0, 0, canvas.width, canvas.height);
        return await new Promise((resolve, reject) => canvas.toBlob(blob => blob ? resolve(blob) : reject(new Error('The photo could not be prepared.')), 'image/jpeg', .92));
    } finally { bitmap.close(); }
}

// Send one image to the local service; discard results if the selection has changed.
async function recognizePhoto() {
    const version = selectionVersion;
    const file = photoInput.files[0];
    const submittedWithFocus = document.activeElement === identifyButton;
    // Announce the finished result without interrupting someone who moved elsewhere.
    const focusResult = () => {
        if (submittedWithFocus && [document.body, identifyButton].includes(document.activeElement)) modelResult.focus();
    };
    identifyButton.disabled = true;
    identifyButton.setAttribute("aria-busy", "true");
    identifyButton.textContent = "Identifying...";
    result.hidden = false;
    modelResult.textContent = "Checking your photo…";
    const service = await recognitionService;
    if (version !== selectionVersion) return;
    if (!service) {
        modelResult.textContent = "Photo selected. Automatic identification is not connected yet.";
        getElement("model-availability").textContent = "Run start-repera.cmd and open the local address printed in its window to use photo recognition, or select a model manually.";
        identifyButton.disabled = false;
        identifyButton.removeAttribute("aria-busy");
        identifyButton.textContent = "Identify vacuum";
        focusResult();
        return;
    }
    const controller = new AbortController();
    predictionController = controller;
    const timeout = setTimeout(() => controller.abort(), 30000);
    try {
        if (file.size > service.max_bytes) throw new Error("Choose a photo no larger than 8 MB, or select a model manually.");
        const upload = await preparePhoto(file);
        if (version !== selectionVersion) return;
        const response = await fetch("/api/predict", {
            method: "POST", body: upload, signal: controller.signal,
            headers: { "Content-Type": "application/octet-stream", "X-Repera-Token": service.token }
        });
        const prediction = await response.json();
        if (version !== selectionVersion) return;
        if (!response.ok) throw new Error(prediction.error || "Photo recognition failed. Select your model manually.");
        showPhotoSuggestion(prediction);
        return prediction;
    } catch (error) {
        if (version !== selectionVersion) return;
        modelResult.textContent = "Photo recognition could not finish.";
        getElement("model-availability").textContent = error.name === "AbortError" ?
            "The request timed out. Try again or select a model manually." : error.message;
    } finally {
        clearTimeout(timeout);
        if (version === selectionVersion) {
            predictionController = null;
            identifyButton.disabled = false;
            identifyButton.removeAttribute("aria-busy");
            identifyButton.textContent = modelSelect.value ? "Continue" : "Retry identification";
            focusResult();
        }
    }
}

// A visual family never proves an exact model. Require a separate label confirmation.
function showPhotoSuggestion(prediction) {
    result.dataset.kind = "photo";
    result.querySelector("h3").textContent = "Model check";
    if (!["suggestion", "guess"].includes(prediction.status) || !Array.isArray(prediction.candidate_models)) {
        modelResult.textContent = "The photo did not give a reliable model suggestion.";
        getElement("model-availability").textContent = "Choose your model manually using its label. This recognizer may not know your vacuum.";
        return;
    }
    modelResult.textContent = (prediction.status === "guess" ? "Most likely guess: " : "Most likely match: ") + prediction.family;
    photoSuggestion.hidden = false;
    getElement("photo-model-notice").textContent = prediction.status === "guess" ? "Low-confidence guess. Check the model before continuing." : "";
    getElement("photo-model-notice").hidden = prediction.status !== "guess";
    const candidates = [...new Set(prediction.candidate_models)].filter(id => canDiagnose(TROUBLESHOOTING_MODELS[id]));
    candidates.forEach(function (id) {
        const button = document.createElement("button");
        button.type = "button";
        button.textContent = "Confirm";
        button.addEventListener("click", () => showModelIdentity(id, true));
        if (candidates.length > 1) {
            const row = document.createElement("div"), name = document.createElement("p");
            row.className = "model-candidate";
            name.textContent = TROUBLESHOOTING_MODELS[id].name;
            row.append(name, button);
            photoConfirmations.appendChild(row);
        } else photoConfirmations.appendChild(button);
    });
    if (!candidates.length) {
        const ids = Array.isArray(prediction.recognized_models) ? prediction.recognized_models : prediction.candidate_models;
        const model = ids.map(id => TROUBLESHOOTING_MODELS[id]).find(model => model && !canDiagnose(model));
        getElement("photo-model-notice").hidden = false;
        getElement("photo-model-notice").textContent = "Check the exact model on the vacuum's label before using model-specific guidance.";
        getElement("model-availability").textContent = model?.userMessage ||
            "Information still being verified. Verified guidance is not available for this suggestion. Contact the manufacturer with the exact model number.";
        if (model?.support) getElement("unsupported-sources").appendChild(sourceLink(model.support));
    }
}

// Manual selection takes priority; photo-only submissions use the connected service.
identifyButton.addEventListener("click", function () {
    resetSelection();
    if (!photoInput.files.length && !modelSelect.value) {
        inputError.textContent = "Choose a photo or select a vacuum model first.";
        modelSelect.focus();
        return;
    }
    if (!modelSelect.value) {
        if (!photoReady) {
            inputError.textContent = "Wait for the photo preview to load, or select a model manually.";
            return;
        }
        recognizePhoto();
        return;
    }
    showSelectedModel(true);
});

// Start a fresh tree for this model while retaining its photo preview.
function startDiagnosis() {
    if (!canDiagnose(activeModel)) return;
    intakeOpen = false;
    answers = [];
    clearHandoff();
    tree = buildDiagnosisTree(activeModel);
    if (!tree) return;
    currentNodeId = tree.start;
    startDiagnosisButton.hidden = true;
    questionPanel.hidden = false;
    showNode();
}
startDiagnosisButton.addEventListener("click", startDiagnosis);
getElement("restart-button").addEventListener("click", startDiagnosis);

// Count the longest remaining route; a different answer can shorten the diagnosis.
function remainingQuestions(id) {
    const node = tree.nodes[id];
    if (node.type === "result") return 0;
    return 1 + Math.max(...Object.values(node.next).map(remainingQuestions));
}

// Display all conclusion fields and cite the source of each model-specific action.
function showDiagnosis(diagnosis) {
    getElement("result-disposition").textContent = diagnosis.status === "safety" ? "Qualified assessment needed" :
        diagnosis.status === "pending" ? "Guidance limited: contact manufacturer support" :
        diagnosis.kind === "noIssue" ? "No fault isolated from these observations" : "A possible explanation, not a confirmed repair";
    getElement("verification-detail").hidden = !diagnosis.verificationDetail;
    getElement("verification-detail").textContent = diagnosis.verificationDetail || "";
    const contact = getElement("manufacturer-contact");
    contact.replaceChildren();
    if (activeModel.support) contact.appendChild(sourceLink(activeModel.support));
    getElement("likely-cause").textContent = diagnosis.likely;
    const others = getElement("other-causes");
    others.replaceChildren();
    diagnosis.others.forEach(function (cause) {
        const item = document.createElement("li");
        item.textContent = cause;
        others.appendChild(item);
    });
    getElement("diagnosis-reason").textContent = diagnosis.reason + " This is a tentative interpretation based on your answers.";
    getElement("confidence-level").textContent = diagnosis.confidence;
    getElement("confidence-reason").textContent = diagnosis.confidenceReason;
    getElement("verification-note").hidden = !diagnosis.verification;
    getElement("verification-note").textContent = diagnosis.verification;
    getElement("support-stop").textContent = diagnosis.stop;
    const repeatedStop = diagnosis.actions.some(action => action.text.trim() === diagnosis.stop.trim());
    getElement("support-stop").hidden = repeatedStop;
    getElement("support-stop-title").hidden = repeatedStop;
    const steps = getElement("instruction-list");
    steps.replaceChildren();
    diagnosis.actions.forEach(function (action) {
        const item = document.createElement("li");
        const text = document.createElement("p");
        text.textContent = action.text;
        item.appendChild(text);
        if (action.source) item.appendChild(sourceLink(action.source));
        steps.appendChild(item);
    });
    showSources(diagnosis.sources);
}

// Only one question is shown; the result uses the current answer path as evidence.
function showNode() {
    clearHandoff();
    window.dispatchEvent(new Event("repera-state-change"));
    getElement("summary-download-status").textContent = "";
    getElement("copy-fallback").hidden = true;
    getElement("summary-copy-text").value = "";
    const node = currentNodeId === "manualStop" ? { type: "result", kind: "manualStop" } : tree.nodes[currentNodeId];
    const finished = node.type === "result";
    questionPanel.dataset.node = currentNodeId;
    answerButtons.hidden = finished;
    const generalHint = node.hint === DIAGNOSIS_POLICY.observation ||
        node.hint === "Answer from what you already observed. Do not run or dismantle the robot to answer.";
    getElement("question-hint").hidden = finished || !node.hint || generalHint;
    getElement("question-hint").textContent = finished ? "" : (node.hint || "");
    getElement("diagnosis-result").hidden = !finished;
    getElement("summary").hidden = !finished;
    backButton.disabled = answers.length === 0;
    questionProgress.textContent = finished ? "Finished - " + answers.length + " answers recorded" :
        "Question " + (answers.length + 1) + " - up to " + remainingQuestions(currentNodeId) + " questions remaining";
    if (finished) {
        const diagnosis = getDiagnosis(activeModel, node.kind, answers);
        questionPanel.dataset.status = diagnosis.status;
        questionText.textContent = diagnosis.status === "safety" ? "Stop for safety" : "Your diagnostic summary";
        getElement("node-status").textContent = "Based on your answers";
        getElement("node-note").textContent = "This result is not certain and does not establish part compatibility.";
        showDiagnosis(diagnosis);
    } else {
        questionPanel.dataset.status = "question";
        questionText.textContent = node.text;
        getElement("node-status").textContent = "One observation at a time";
        getElement("node-note").textContent = DIAGNOSIS_POLICY.observation;
        showSources(activeModel.sources);
    }
    const review = getElement("answer-review"), assessment = getElement("assessment");
    if (finished) assessment.after(review);
    else assessment.before(review);
    renderAnswerReview();
    answerSummary.replaceChildren();
    answers.forEach(function (answer) {
        const item = document.createElement("li");
        item.textContent = answer.question + " - " + answer.answer;
        answerSummary.appendChild(item);
    });
    intakeOpen = false;
    updateStages();
    questionText.focus();
}

// Build a readable support handoff from the current answers, without including photos.
function buildSummaryText(model, diagnosis, history) {
    const lines = ["Repera troubleshooting summary", "Model: " + model.name, "",
        "This is a tentative interpretation of user-reported observations, not a confirmed diagnosis or part-compatibility check.", "",
        "Most likely cause", diagnosis.likely, "", "Other possible causes",
        ...diagnosis.others.map(cause => "- " + cause), "", "Why Repera reached this conclusion",
        diagnosis.reason, "", "Confidence: " + diagnosis.confidence, diagnosis.confidenceReason];
    if (diagnosis.verification) lines.push("", diagnosis.verification, diagnosis.verificationDetail || "");
    lines.push("", "Next safe actions");
    diagnosis.actions.forEach((action, index) => {
        lines.push((index + 1) + ". " + action.text);
        if (action.source) lines.push("Source: " + action.source.title, action.source.url);
    });
    lines.push("", "When to stop and contact qualified support", diagnosis.stop, "", "Your answers");
    history.forEach((answer, index) => lines.push((index + 1) + ". " + answer.question + " - " + answer.answer));
    lines.push("", "Official sources");
    const seen = new Set();
    diagnosis.sources.forEach(source => {
        if (seen.has(source.url)) return;
        seen.add(source.url);
        lines.push(source.title, source.url, source.scope || "", "");
    });
    if (model.support) lines.push("Manufacturer support", model.support.title, model.support.url, "");
    const cost = getCostEstimate(model, diagnosis, history);
    lines.push("Estimated cost (USD)", cost.summary, ...cost.details, ...cost.notes, "Price sources checked " + cost.reviewed);
    cost.sources.forEach(source => lines.push(source.title, source.url));
    lines.push("");
    const description = getElement("problem-description").value.trim();
    if (description) lines.push("User symptom description (unverified)", description, "");
    if (!getElement("repair-plan").hidden) {
        lines.push("Repair or recycling options", getElement("repair-route").textContent,
            getElement("repair-route-detail").textContent, getElement("parts-decision").textContent);
        lines.push("", "Parts references (not diagnosed faults)", getElement("parts-context").textContent);
        document.querySelectorAll("#parts-list li").forEach(row => {
            lines.push("- " + row.textContent);
            row.querySelectorAll("a").forEach(link => lines.push(link.textContent + ": " + link.href));
        });
        for (const id of ["parts-source", "parts-support"]) {
            const section = getElement(id);
            if (section.textContent) lines.push(section.textContent);
            section.querySelectorAll("a").forEach(link => lines.push(link.href));
        }
        if (getElement("repair-decision").value) lines.push("User-reported next step (not a diagnosis)", getElement("repair-decision-note").textContent);
        if (getElement("recycling-country").value) {
            lines.push("Recycling guidance", getElement("recycling-guidance").textContent, getElement("battery-disposal-note").textContent);
            // Nearby search URLs contain location; keep them out of shared summaries.
            document.querySelectorAll("#recycling-guidance a, #battery-disposal-note a").forEach(link => lines.push(link.href));
        }
        lines.push("");
    }
    const notes = getElement("support-notes").value.trim();
    const outcome = getElement("action-outcome").value;
    if (notes) lines.push("User notes (not verified; not used to diagnose)", notes, "");
    if (outcome) lines.push("User-reported outcome (not a confirmed repair)", outcome, getElement("outcome-note").textContent, "");
    return lines.join("\r\n") + "\r\n";
}

// Download only a completed, current result; Back, reset and model changes invalidate it.
getElement("download-summary-button").addEventListener("click", function () {
    const node = currentNodeId === "manualStop" ? { type: "result", kind: "manualStop" } : tree?.nodes[currentNodeId];
    if (!canDiagnose(activeModel) || troubleshooting.hidden || questionPanel.hidden || node?.type !== "result") return;
    const status = getElement("summary-download-status");
    let url;
    const link = document.createElement("a");
    try {
        const text = buildSummaryText(activeModel, getDiagnosis(activeModel, node.kind, answers), answers);
        url = URL.createObjectURL(new Blob([text], { type: "text/plain;charset=utf-8" }));
        link.href = url;
        link.download = "Repera-" + modelSelect.value + "-summary.txt";
        link.hidden = true;
        document.body.appendChild(link);
        link.click();
        status.textContent = "Summary download requested. Check your browser's downloads.";
    } catch {
        status.textContent = "The summary could not be downloaded. You can select and copy the summary shown here.";
    } finally {
        link.remove();
        if (url) setTimeout(() => URL.revokeObjectURL(url), 1000);
    }
});

// Follow the selected edge and keep the previous question for Back navigation.
answerButtons.querySelectorAll("button").forEach(function (button) {
    button.addEventListener("click", function () {
        if (!canDiagnose(activeModel)) return;
        const node = tree?.nodes[currentNodeId];
        if (!node || node.type !== "question") return;
        answers.push({ nodeId: currentNodeId, question: node.text, answer: button.dataset.answer });
        currentNodeId = node.next[button.dataset.answer];
        showNode();
    });
});

// Going back removes the last answer; subsequent answers are rebuilt from that point.
backButton.addEventListener("click", function () {
    const previous = answers.pop();
    if (!previous) return;
    currentNodeId = previous.nodeId;
    showNode();
});

// A safety stop is always available, including from a result. Back restores its origin.
getElement("stop-button").addEventListener("click", function () {
    if (!tree || currentNodeId === "manualStop") return;
    answers.push({ nodeId: currentNodeId, question: "You chose Stop for safety", answer: "Stop" });
    currentNodeId = "manualStop";
    showNode();
});

// Start over clears the model, photo, answers and conclusion without reloading.
getElement("start-over-button").addEventListener("click", function () {
    modelSelect.value = "";
    getElement("problem-description").value = "";
    photoInput.value = "";
    clearPreview();
    photoError.textContent = "";
    photoInput.removeAttribute("aria-invalid");
    resetSelection();
    modelSelect.focus();
});

// Browser-restored selections should use the same button label as a new selection.
identifyButton.textContent = modelSelect.value ? "Continue" : "Identify vacuum";

// Keep navigation and the three-stage indicator in sync with the current flow.
function updateStages() {
    const finished = !getElement("diagnosis-result").hidden && !questionPanel.hidden;
    const ongoing = !!tree && !questionPanel.hidden;
    getElement("vacuum-selection").hidden = ongoing && !intakeOpen;
    getElement("resume-diagnosis-button").hidden = !ongoing || !intakeOpen;
    if (ongoing) troubleshooting.hidden = intakeOpen;
    getElement("app-screen").dataset.stage = ongoing && !intakeOpen ? (finished ? "result" : "questions") : "model";
    getElement("assessment").hidden = !finished;
    const stage = intakeOpen ? "model" : (finished ? "result" : "questions");
    for (const name of ["model", "questions", "result"]) {
        const item = getElement("stage-" + name);
        if (name === stage) item.setAttribute("aria-current", "step");
        else item.removeAttribute("aria-current");
    }
}
window.addEventListener("repera-state-change", () => queueMicrotask(updateStages));
getElement("change-model-button").addEventListener("click", () => {
    intakeOpen = true;
    updateStages();
    modelSelect.scrollIntoView({block: "center"});
    modelSelect.focus({preventScroll: true});
});
getElement("resume-diagnosis-button").addEventListener("click", () => {
    intakeOpen = false;
    updateStages();
    window.dispatchEvent(new Event("repera-view-change"));
    questionText.focus();
});
updateStages();

// Show the selected file name in the upload area without changing preview behavior.
function updateUploadName() {
    getElement("upload-filename").textContent = photoInput.files[0]?.name || "Browse your files or take a photo";
}
photoInput.addEventListener("change", updateUploadName);
window.addEventListener("repera-state-change", () => queueMicrotask(updateUploadName));

// Extra observations stay local and never become manufacturer evidence or AI input.
function clearHandoff() {
    getElement("support-notes").value = "";
    getElement("action-outcome").value = "";
    getElement("outcome-note").textContent = "";
    getElement("copy-fallback").hidden = true;
    getElement("summary-copy-text").value = "";
}

// Editing an earlier observation discards the old route, including its safety/result state.
function renderAnswerReview() {
    const list = getElement("review-list");
    list.replaceChildren();
    getElement("answer-review").hidden = false;
    answers.forEach((answer, index) => {
        const item = document.createElement("li");
        const text = document.createElement("span");
        text.textContent = answer.question + " - " + answer.answer;
        const edit = document.createElement("button");
        edit.type = "button";
        edit.className = "secondary";
        edit.textContent = "Change";
        edit.setAttribute("aria-label", "Change answer " + (index + 1) + ": " + answer.question);
        edit.addEventListener("click", () => {
            if (!canDiagnose(activeModel) || !tree) return;
            currentNodeId = answer.nodeId;
            answers = answers.slice(0, index);
            clearHandoff();
            getElement("answer-review").open = false;
            showNode();
        });
        item.append(text, edit);
        list.appendChild(item);
    });
}

// Recording an outcome is a support note, never permission to resume unsafe operation.
getElement("action-outcome").addEventListener("change", () => {
    const value = getElement("action-outcome").value;
    getElement("outcome-note").textContent = !value ? "" : value === "It seems improved" ?
        "Improvement does not confirm a repair or override any safety warning above. If symptoms return, contact qualified support." :
        "Keep the stopping limits above. Contact qualified support with this summary; do not repeat tests or move to internal repairs.";
});

// Copy only the current result; a selectable text fallback also works from a local file.
getElement("copy-summary-button").addEventListener("click", async () => {
    const node = currentNodeId === "manualStop" ? { type: "result", kind: "manualStop" } : tree?.nodes[currentNodeId];
    if (!canDiagnose(activeModel) || troubleshooting.hidden || questionPanel.hidden || node?.type !== "result") return;
    const text = buildSummaryText(activeModel, getDiagnosis(activeModel, node.kind, answers), answers);
    const field = getElement("summary-copy-text");
    field.value = text;
    getElement("copy-fallback").hidden = false;
    field.focus();
    field.select();
    const status = getElement("summary-download-status");
    status.textContent = "Summary selected. Use your device's Copy command.";
    try {
        await navigator.clipboard.writeText(text);
        if (field.value === text.replace(/\r\n/g, "\n") && !getElement("copy-fallback").hidden) status.textContent = "Summary copied.";
    } catch { /* The selected text remains available if clipboard access is blocked. */ }
});

// Changes to summary inputs invalidate any previously prepared copy.
["support-notes", "action-outcome", "problem-description", "recycling-country", "repair-decision"].forEach(id => getElement(id).addEventListener("input", () => {
    getElement("copy-fallback").hidden = true;
    getElement("summary-copy-text").value = "";
    getElement("summary-download-status").textContent = "";
}));
