// Official references stay beside the guidance so each instruction is traceable.
// Reviewed 2026-09-21. No manuals are stored locally; these are short summaries.
const TROUBLESHOOTING_SOURCES = {
    dyson: {
        title: "Dyson V8 support: care and troubleshooting",
        url: "https://www.dyson.com/support/vacuum-cleaners/cordless/v8/pinch-pre-filter",
        scope: "V8 family guidance; confirm the filter layout matches your SV10."
    },
    dysonAnimal: {
        title: "Dyson V8 Animal troubleshooting",
        url: "https://www.dyson.com/support/journey/troubleshooting/229602-01",
        scope: "V8 Animal support and symptom selection."
    },
    dysonSafety: {
        title: "Dyson: checking V7 and V8 cord-free vacuums for blockages",
        url: "https://www.youtube.com/watch?v=v6Dc_5Da4e4",
        scope: "Official Dyson video; switch off and unplug before maintenance."
    },
    sharkUpright: {
        title: "Shark: Upright Vacuums Maintenance and Most Common Inquiries",
        url: "https://support.sharkclean.com/hc/en-us/articles/17031372468252-Upright-Vacuums-Maintenance-and-Most-Common-Inquiries",
        scope: "General Shark upright guidance, not an NV352-specific manual."
    },
    sharkNV: {
        title: "Shark NV350 Series troubleshooting index",
        url: "https://support.sharkclean.com/hc/en-us/sections/10109117873052-Troubleshooting",
        scope: "Index verified; linked detailed guide could not be retrieved."
    },
    sharkSupport: {
        title: "Shark Customer Service: Contact Us",
        url: "https://support.sharkclean.com/hc/en-us/categories/4402881201554-Contact-Us",
        scope: "Manufacturer support directory; not a repair procedure."
    },
    wandvac: {
        title: "Shark WANDVAC WV201 product and support page",
        url: "https://www.sharkninja.com/shark-wandvac-cordless-handheld-vacuum/WV201.html",
        scope: "Product identity verified; linked manual/support content was inaccessible."
    },
    blackdecker: {
        title: "BLACK+DECKER HHVI315JO / HHVI320JR / HHVI325JR instruction manual",
        url: "https://www.toolservicenet.com/i/BLACK_DECKER/GLOBALBOM/QU/HHVI315JO42/1/Instruction_Manual/EN/90632058_HHVI315JO.pdf",
        scope: "Pages 1-6 cover HHVI315JO; the manual identifies the last two catalog digits as color."
    },
    bissell: {
        title: "BISSELL PowerForce Helix 2191 product support",
        url: "https://support.bissell.com/app/products/detail/p/67489/~/powerforce%C2%AE-helix-bagless-upright-vacuum-2191",
        scope: "Exact-model page linking the Helix troubleshooting guides."
    },
    bissellSuction: {
        title: "BISSELL PowerForce Helix: No / Low Suction",
        url: "https://support.bissell.com/app/answers/detail/a_id/3443",
        scope: "Linked from 2191 support; only dirt tank and pre-motor filter guidance used."
    },
    bissellPower: {
        title: "BISSELL PowerForce Helix: No Power",
        url: "https://support.bissell.com/app/answers/detail/a_id/3544",
        scope: "Linked from 2191 support; damaged cords require support."
    },
    bissellBrush: {
        title: "BISSELL PowerForce Helix: Brush Not Turning",
        url: "https://support.bissell.com/app/answers/detail/a_id/3449",
        scope: "Explicitly includes 2191; cover and motor-shaft work is referred to support here."
    },
    bissellNoise: {
        title: "BISSELL PowerForce Helix: Unusual / Excessive Noise",
        url: "https://support.bissell.com/app/answers/detail/a_id/3542",
        scope: "Explicitly includes 2191; distinguishes a high-pitched whistle from grinding."
    },
    cleanviewPower: {
        title: "CleanView / PowerEase / PowerLifter Swivel has No Power",
        url: "https://support.bissell.com/app/answers/detail/a_id/3489",
        scope: "Explicitly includes 2252. Cord damage and unresolved power issues go to BISSELL."
    },
    cleanviewSuction: {
        title: "My CleanView / PowerEase / PowerLifter Swivel has No Suction",
        url: "https://support.bissell.com/app/answers/detail/a_id/3490/related/1",
        scope: "Explicitly includes 2252. Airway hypothesis only; powered detached-hose tests are excluded."
    },
    cleanviewBrush: {
        title: "My CleanView / PowerEase / PowerLifter Swivel Brush is not Turning or hard to push",
        url: "https://support.bissell.com/app/answers/detail/a_id/3494",
        scope: "Explicitly includes 2252. Cover, lower-hose and motor-shaft work goes to support."
    },
    cleanviewNoise: {
        title: "My CleanView / PowerEase / PowerLifter Swivel has an Unusual/Excessive Noise",
        url: "https://support.bissell.com/app/answers/detail/a_id/3497/~/my-cleanview%C2%AE%2Fpowerease%C2%AE%2Fpowerlifter%C2%AE-swivel-has-an-unusual%2Fexcessive-noise-%7C",
        scope: "Explicitly includes 2252. Whistling and grinding have different possible causes."
    },
    cleanviewFilters: {
        title: "CleanView / PowerEase / PowerLifter Swivel Cleaning Filters",
        url: "https://support.bissell.com/app/answers/detail/a_id/3495",
        scope: "Explicitly includes 2252. Only routine top-lid carbon/foam filter care is enabled."
    }
};

// Repera's safety limits apply to every model; they are not repair procedures.
const DIAGNOSIS_POLICY = {
    observation: "Answer from what you noticed during normal use. Do not turn the vacuum on, touch moving parts, or take it apart to answer. Choose Not sure if you cannot tell.",
    stop: "Stop using and charging the vacuum. Switch off and disconnect power only if safe. Do not handle damaged electrical parts or open the motor or battery housing. Contact manufacturer support or a qualified repair professional. For an active fire or immediate danger, move away and contact emergency services.",
    support: "Stop if there is heat, smoke, a burning smell, liquid exposure, damage, or any need to open the motor, battery, or electrical housing. Contact qualified support if the safe action does not help or you are unsure how to proceed.",
    pending: "Information still being verified."
};

// Verified support destinations are referrals, not evidence for a repair procedure.
const MANUFACTURER_SUPPORT = {
    dyson: { title: "Dyson V8 support and contact options", url: "https://www.dyson.com/support/vacuum-cleaners/cordless/v8/pinch-pre-filter", scope: "Use the Contact us section for manufacturer assistance." },
    blackdecker: { title: "BLACK+DECKER customer service", url: "https://www.blackanddecker.com/blogs/evergreen-faqs/how-do-i-reach-black-decker-customer-service", scope: "Official customer service options; not a repair procedure." },
    bissell: { title: "BISSELL product support", url: "https://support.bissell.com/app/home/", scope: "Select your exact model when requesting help; not a repair procedure." }
};

// Explain the evidence gap without assigning an unverified fault or repair.
const UNVERIFIED_BRANCH_DETAILS = {
    fullBin: "The exact dirt-container emptying sequence has not been verified for this model here.",
    blocked: "The visible obstruction does not establish where the restriction ends. Its model-specific removal procedure is not verified here.",
    weakPickup: "These observations do not isolate the cause of poor pickup. Further model-specific checks are not verified here.",
    brushIssue: "The brush observation does not identify a failed belt, motor or part. The required head-specific procedure is not verified here.",
    cutoff: "The shutoff cause and a model-specific recovery procedure have not been established. No cooling time or restart sequence is prescribed.",
    indicator: "The light pattern, operating state and exact model guide must be matched before assigning a meaning.",
    noiseIssue: "This sound has no verified model-specific interpretation in Repera. Do not run the vacuum again just to reproduce it.",
    uncertain: "The observations are not clear enough to rank a cause. Do not perform new powered tests just to answer the questions."
};

// Question hints clarify observations; none asks the user to perform a repair or test.
const OBSERVATION_HINTS = {
    damage: "Use damage you have already noticed, such as a damaged cord, plug or casing. Do not handle a damaged part to inspect it.",
    liquid: "This means accidental liquid entering the machine, not a removable filter washed separately and fully dried according to its guide.",
    batteryDamage: "Use only what is visible without opening or removing anything. Choose Not sure if you cannot tell.",
    filter: "Answer from earlier observations. Do not remove a filter just to answer this question.",
    brush: "Answer from the last normal use. Do not touch the brush or run the vacuum to watch it.",
    block: "Only count a blockage already visible from outside. Do not reach inside or detach parts to check.",
    cutoffBlock: "Only count a blockage already visible from outside. Do not reach inside or detach parts to check.",
    light: "Use a light you previously noticed. Its color and pattern can be added to your support notes at the end.",
    offLight: "Use a light you previously noticed. Do not turn on or charge the machine just to check.",
    noiseWhistle: "A whistle is a high-pitched sound. If you cannot distinguish it from another sound, choose Not sure.",
    noiseGrinding: "Use the sound you already heard. Do not reproduce it for this questionnaire."
};

// Each model keeps its own verified guidance and source limits, without problem menus.
const TROUBLESHOOTING_MODELS = {
    dyson_v8_animal_sv10: {
        name: "Dyson V8 Animal SV10", family: "dyson", cordless: true, brush: true,
        sources: [TROUBLESHOOTING_SOURCES.dyson, TROUBLESHOOTING_SOURCES.dysonAnimal],
        isolation: { text: "Switch off and disconnect the charger. Do not pull the trigger during maintenance.", source: TROUBLESHOOTING_SOURCES.dysonSafety },
        guidance: {
            bin: { text: "Empty the bin at the MAX line following Dyson's V8 guidance. Refit all parts before normal use.", source: TROUBLESHOOTING_SOURCES.dyson },
            filter: { text: "Follow the V8 filter guide: rinse with cold water only. Air-dry for at least 24 hours and until completely dry before refitting. Do not use heat to dry filters.", source: TROUBLESHOOTING_SOURCES.dyson },
            charge: { text: "With no damage or safety concern, charge with the machine's correct charger at the dock or socket as described by Dyson. Do not open the battery or main body.", source: TROUBLESHOOTING_SOURCES.dyson }
        },
        todo: "Verify exact SV10 cleaner-head, brush, blockage, indicator and noise procedures."
    },
    shark_nv352: {
        name: "Shark Navigator NV352", family: "sharkUpright", cordless: false, brush: true,
        sources: [TROUBLESHOOTING_SOURCES.sharkUpright, TROUBLESHOOTING_SOURCES.sharkNV, TROUBLESHOOTING_SOURCES.sharkSupport],
        note: "General Shark upright guidance is labeled as such. Exact NV352 instructions are still being verified.",
        isolation: { text: "Turn off the vacuum and unplug it before maintenance.", source: TROUBLESHOOTING_SOURCES.sharkUpright },
        guidance: {
            bin: { text: "With the vacuum off and unplugged, empty the dust cup using your own model manual. This is general Shark upright guidance; stop if the cup cannot be removed normally.", source: TROUBLESHOOTING_SOURCES.sharkUpright },
            power: { text: "Only with an undamaged cord, fully assembled vacuum and no safety concern, try a known-working outlet as Shark's general upright guide suggests. Do not repair the cord, plug or outlet.", source: TROUBLESHOOTING_SOURCES.sharkUpright }
        },
        todo: "Verify exact NV352 filters, brush, indicators, power and cooling interval."
    },
    blackdecker_hhvi315jo42: {
        name: "BLACK+DECKER HHVI315JO42", family: "blackdecker", cordless: true, brush: false,
        sources: [TROUBLESHOOTING_SOURCES.blackdecker],
        isolation: { text: "Switch off and unplug the charger before routine maintenance.", source: TROUBLESHOOTING_SOURCES.blackdecker },
        guidance: {
            // The shared manual's quick-empty nozzle sequence does not establish this model's layout.
            filter: { text: "Use the manual's bowl-removal guide. Shake or lightly brush loose dust off the filters. Refit the filter firmly and click the bowl into place. Never operate without the filter.", source: TROUBLESHOOTING_SOURCES.blackdecker },
            charge: { text: "Set the switch to OFF (O) for charging. Use only the supplied charger, correctly connected to a working outlet, with no cord damage. Follow the manual's charging guidance; do not repair the charger.", source: TROUBLESHOOTING_SOURCES.blackdecker }
        },
        todo: "Verify exact bowl-emptying layout and Type 2 applicability, plus runtime, indicator and noise guidance; battery/charger faults require authorized service."
    },
    bissell_2191: {
        name: "BISSELL PowerForce Helix 2191", family: "bissell", cordless: false, brush: true,
        sources: [TROUBLESHOOTING_SOURCES.bissell, TROUBLESHOOTING_SOURCES.bissellSuction, TROUBLESHOOTING_SOURCES.bissellPower, TROUBLESHOOTING_SOURCES.bissellBrush, TROUBLESHOOTING_SOURCES.bissellNoise],
        isolation: { text: "Turn the machine off and unplug it before checking or cleaning.", source: TROUBLESHOOTING_SOURCES.bissellPower },
        guidance: {
            bin: { text: "Hold the dirt tank over a bin and press its latch to empty it. Reinstall until it clicks.", source: TROUBLESHOOTING_SOURCES.bissellSuction },
            filter: { text: "Remove the pre-motor filter and rinse with warm water. Air-dry for at least 24 hours and until completely dry, then reinstall and close the tank lid securely. No post-motor filter is prescribed for 2191.", source: TROUBLESHOOTING_SOURCES.bissellSuction },
            power: { text: "Only if the cord is undamaged and the vacuum is fully assembled, try a working outlet in another room. Keep clear of the brush roll, which can turn while the vacuum is upright. A damaged cord requires BISSELL support.", source: TROUBLESHOOTING_SOURCES.bissellPower }
        },
        todo: "Verify shutoff guidance and other noise types. Stop before brush-cover or motor-shaft work."
    },
    shark_iz163h: {
        name: "Shark Rocket Pet Pro IZ163H", family: "unverified", cordless: true, brush: true,
        sources: [TROUBLESHOOTING_SOURCES.sharkSupport], guidance: {},
        note: "Information still being verified: exact IZ163H diagnostic and maintenance instructions were inaccessible. Observations can be recorded, but causes cannot yet be ranked reliably.",
        todo: "Verify exact IZ163H power, charging, filter, brush, blockage, shutoff, indicator and noise guidance."
    },
    shark_wv201: {
        name: "Shark WANDVAC WV201", family: "unverified", cordless: true, brush: false,
        sources: [TROUBLESHOOTING_SOURCES.wandvac, TROUBLESHOOTING_SOURCES.sharkSupport], guidance: {},
        note: "Information still being verified: the WV201 product page is available, but its detailed official guidance was inaccessible. Causes cannot yet be ranked reliably.",
        todo: "Verify exact WV201 charging, filter, dust-cup, indicator, shutoff and noise guidance."
    },
    bissell_2252: {
        name: "BISSELL CleanView Swivel Pet 2252", family: "cleanview", cordless: false, brush: true,
        sources: [TROUBLESHOOTING_SOURCES.cleanviewPower, TROUBLESHOOTING_SOURCES.cleanviewSuction, TROUBLESHOOTING_SOURCES.cleanviewBrush, TROUBLESHOOTING_SOURCES.cleanviewNoise, TROUBLESHOOTING_SOURCES.cleanviewFilters],
        note: "Power, pickup, brush movement and whistling/grinding have official guidance. Other symptoms may remain unresolved.",
        isolation: { text: "Switch off and unplug before checking or cleaning.", source: TROUBLESHOOTING_SOURCES.cleanviewBrush },
        guidance: {
            filter: { text: "Open the dirt tank's top lid and remove the carbon and foam filters. Wash with warm water and mild dish soap. Air-dry completely; BISSELL specifies 24–48 hours. Refit carbon first, then foam, and close the lid. Keep all filters and the tank securely installed before use. Stop and contact BISSELL if parts are damaged, do not fit normally, or the problem persists.", source: TROUBLESHOOTING_SOURCES.cleanviewFilters }
        },
        todo: "Verify shutoff, escaping debris, other noises and indicator applicability. No powered disassembled tests, cover removal, hose-screw or motor-shaft work.",
        claimIds: ["C-POWER", "C-SUCTION", "C-BRUSH", "C-WHISTLE", "C-GRINDING", "C-FILTER"]
    }
};

// Keep old classifier labels and research while explicitly disabling Shark diagnostics.
const SHARK_UNSUPPORTED_MESSAGE = "This model may have been identified, but verified diagnostic guidance is not currently available. Contact Shark support.";
const MVP_MODEL_IDS = ["dyson_v8_animal_sv10", "blackdecker_hhvi315jo42", "bissell_2191", "bissell_2252"];
Object.entries(TROUBLESHOOTING_MODELS).forEach(([id, model]) => {
    const archived = id.startsWith("shark_");
    model.researchStatus = archived ? "unverified" : "verified-with-gaps";
    model.diagnosticEnabled = MVP_MODEL_IDS.includes(id);
    model.supportedMvp = MVP_MODEL_IDS.includes(id);
    model.classifierLabel = id;
    model.support = MANUFACTURER_SUPPORT[model.family === "cleanview" ? "bissell" : model.family] || TROUBLESHOOTING_SOURCES.sharkSupport;
    if (archived) {
        model.userMessage = SHARK_UNSUPPORTED_MESSAGE;
        model.historicalGuidance = { diagnosticEnabled: false, guidance: model.guidance, isolation: model.isolation, note: model.note };
        model.guidance = {};
        delete model.isolation;
        model.note = model.userMessage;
        model.researchRecord = "research/PRIOR_MODEL_RESEARCH.txt";
    }
});

// Identification never grants permission to diagnose; callers must check both flags.
function canDiagnose(model) {
    return Boolean(model && model.diagnosticEnabled === true && model.supportedMvp === true);
}

const SAFETY_CLARIFICATIONS = {
    smell: "When you last used it, did you notice a new smell like burning plastic or electrical wiring?",
    damage: "From what you have already seen, is anything cracked, broken, loose or missing?",
    liquid: "",
    smoke: "Did you see smoke coming from the machine or its power equipment?",
    heat: "During normal use, did you notice melting, scorching or heat that seemed abnormal?",
    batteryDamage: "From what you have already seen, is the battery case bulging, split or leaking?",
    damageElectrical: ""
};

function addSafetyClarifications(nodes, question) {
    for (const [id, text] of Object.entries(SAFETY_CLARIFICATIONS)) {
        const original = nodes[id];
        if (!original || original.next["Not sure"] !== "safetyUncertain") continue;
        const clarificationText = id === "liquid" ? "From what you already saw, " + original.text.charAt(0).toLowerCase() + original.text.slice(1) : text || "From what you already noticed: " + original.text;
        const clarification = question(clarificationText, original.next.Yes, original.next.No, "safetyUncertain");
        clarification.clarifies = id;
        clarification.hint = "Answer from memory or what you have already seen. Do not switch it on, touch damaged parts or take it apart to check. If you cannot tell, choose Not sure.";
        nodes[id + "Clarify"] = clarification;
        original.next["Not sure"] = id + "Clarify";
    }
}

function resolveSafetyAnswers(history) {
    return history.filter(a => !Object.keys(SAFETY_CLARIFICATIONS).some(id => a.nodeId === id + "Clarify")).map(a => {
        if (a.answer !== "Not sure" || !(a.nodeId in SAFETY_CLARIFICATIONS)) return a;
        const clarification = history.find(next => next.nodeId === a.nodeId + "Clarify");
        return clarification && clarification.answer !== "Not sure" ? {...a, answer:clarification.answer} : a;
    });
}

function addDamageQuestions(nodes, question, model, clarify) {
    nodes.damage.next.Yes = "damageElectrical";
    const electrical = model.cordless
        ? "Does the damage involve a cable, plug, battery, charger" + (model.family === "robot" && model.dock !== false ? ", dock" : "") + " or electrical housing?"
        : "Does the damage involve the power cable, plug or electrical housing?";
    nodes.damageElectrical = question(electrical, "safety", "damagePart", "safetyUncertain");
    nodes.damagePart = question("Is a part cracked, broken, loose or missing?", "damageReview", "damageCosmetic", "damageReview");
    nodes.damageCosmetic = question("Is it only surface scratches or scuffs, with no cracked, loose or missing parts?", "liquid", "damageReview", "damageReview");
    nodes.damageReview = {type: "result", kind: "damageReview"};
    if (clarify) addSafetyClarifications(nodes, question);
}

// Every question has three explicit destinations. No answer is treated as a diagnosis.
function buildDiagnosisTree(model, clarify = true) {
    if (!canDiagnose(model)) return null;
    if (model.family === "robot") return robotTree(model, clarify);
    if (model.family === "miele") return mieleTree(model, clarify);
    const question = (text, yes, no, unsure) => ({ type: "question", text, next: { Yes: yes, No: no, "Not sure": unsure } });
    const result = kind => ({ type: "result", kind });
    const nextBrush = model.brush ? "brush" : "noise";
    const nodes = {
        smell: question("Is there a burning smell?", "safety", "damage", "safetyUncertain"),
        damage: question("Is anything visibly damaged?", "safety", "liquid", "safetyUncertain"),
        liquid: question("Has liquid entered the vacuum?", "safety", "smoke", "safetyUncertain"),
        // These observations stop the flow before any power or maintenance checks.
        smoke: question("Have you noticed smoke coming from the vacuum?", "safety", "heat", "safetyUncertain"),
        heat: question("Have you noticed unusual heat from the vacuum or its power equipment?", "safety", model.cordless ? "batteryDamage" : "power", "safetyUncertain"),
        batteryDamage: question("Does the battery look swollen or appear to be leaking?", "safety", "power", "safetyUncertain"),
        power: question("Does the vacuum turn on?", "shutoff", model.family === "cleanview" ? "powerSupply" : "offLight", "motor"),
        motor: question("Can you hear the motor running?", "shutoff", model.family === "cleanview" ? "powerSupply" : "offLight", "uncertain"),
        shutoff: question("Does it shut off unexpectedly?", model.family === "cleanview" ? "cutoff" : "cutoffBlock", "pickup", "pickup"),
        cutoffBlock: question("Can you see anything blocking an opening?", "blocked", "cutoff", "cutoff"),
        pickup: question("Is it picking up dirt?", "noise", "bin", "noise"),
        bin: question("Is the dirt container full?", "fullBin", "block", "block"),
        block: question("Can you see anything blocking an opening?", "blocked", model.guidance.filter ? "filter" : nextBrush, nextBrush),
        filter: question("Have you already noticed heavy dirt on the removable filter?", "dirtyFilter", nextBrush, nextBrush),
        brush: question("Was the floor head's brush roll moving when you last used it?", "noise", "brushIssue", "noise"),
        noise: question("Is there an unusual noise?", ["bissell", "cleanview"].includes(model.family) ? "noiseWhistle" : "noiseIssue", model.family === "cleanview" ? "review" : "light", model.family === "cleanview" ? "review" : "light"),
        noiseWhistle: question("Is it a high-pitched whistle?", "whistleNoise", "noiseGrinding", "noiseIssue"),
        noiseGrinding: question("Is it a grinding noise?", "grindingNoise", "noiseIssue", "noiseIssue"),
        light: question("Is an indicator light flashing?", "indicator", "review", "uncertain"),
        offLight: question("Is an indicator light flashing?", "indicator", "powerSupply", "powerIssue"),
        powerSupply: model.cordless ?
            question("Was it charged before you last tried to use it?", model.family === "blackdecker" ? "chargeSwitch" : "powerIssue", "uncharged", "powerIssue") :
            question("Was it plugged in when you tried to use it?", "powerIssue", "unplugged", "powerIssue"),
        chargeSwitch: question("Was the switch left ON while charging?", "chargeSetting", "powerIssue", "powerIssue")
    };
    ["safety", "safetyUncertain", "uncertain", "blocked", "cutoff", "fullBin", "dirtyFilter", "brushIssue", "noiseIssue", "whistleNoise", "grindingNoise", "indicator", "review", "powerIssue", "uncharged", "unplugged", "chargeSetting"].forEach(kind => { nodes[kind] = result(kind); });
    addDamageQuestions(nodes, question, model, clarify);
    Object.entries(nodes).forEach(([id, node]) => {
        if (node.type === "question") node.hint = OBSERVATION_HINTS[id] || node.hint || "";
    });
    // Remove questions that do not apply to this model (especially handheld brush rolls).
    const reachable = {};
    function visit(id) {
        if (reachable[id]) return;
        reachable[id] = nodes[id];
        if (nodes[id].next) Object.values(nodes[id].next).forEach(visit);
    }
    visit("smell");
    return { start: "smell", nodes: reachable };
}

// Conclusions explain observations and official evidence, not a trained prediction.
function getDiagnosis(model, kind, answers) {
    // Reject disabled identities even when called outside the normal button flow.
    if (!canDiagnose(model)) return {
        kind: "unsupported", status: "unsupported", likely: model?.userMessage || DIAGNOSIS_POLICY.pending,
        others: [DIAGNOSIS_POLICY.pending], reason: "This model is not enabled for diagnosis.",
        confidence: "low", confidenceReason: "Model identification is not diagnostic evidence.",
        actions: [], stop: model?.userMessage || DIAGNOSIS_POLICY.pending,
        sources: model?.sources || [], verification: DIAGNOSIS_POLICY.pending
    };
    answers = resolveSafetyAnswers(answers);
    // A result caller cannot override a safety answer still present in the history.
    const safetyIds = ["smell", "liquid", "smoke", "heat", "batteryDamage", "damageElectrical"];
    const damageAnswer = id => answers.find(a => a.nodeId === id)?.answer;
    const surfaceOnly = damageAnswer("damageElectrical") === "No" && damageAnswer("damagePart") === "No" && damageAnswer("damageCosmetic") === "Yes";
    if (answers.some(a => a.answer === "Stop")) kind = "manualStop";
    else if (answers.some(a => safetyIds.includes(a.nodeId) && a.answer === "Yes")) kind = "safety";
    else if (answers.some(a => safetyIds.includes(a.nodeId) && a.answer === "Not sure") || damageAnswer("damage") === "Not sure") kind = "safetyUncertain";
    else if (damageAnswer("damage") === "Yes" && !surfaceOnly) kind = damageAnswer("damageElectrical") === "No" ? "damageReview" : "safety";
    if (kind === "damageReview") return {
        kind, status: "pending", likely: "A visibly damaged part needs assessment; these answers do not establish the failed part or a suitable replacement.",
        others: ["Other causes have not been established."],
        reason: "You reported visible damage without identifying damage to electrical or charging components. The follow-up answers did not establish that it is only surface wear.",
        confidence: "low", confidenceReason: "The extent of damage has not been inspected.",
        actions: [{text: "Do not attempt an unverified repair. Contact the manufacturer or a qualified repair professional with a photo of the damaged area and the exact model. Ask them to assess the damage and confirm the appropriate next step before using or replacing the damaged part. Do not dismantle the vacuum to investigate.", source: model.support}],
        stop: "Do not use damaged components. If you notice exposed wiring, battery damage, unusual heat, smoke or a burning smell, stop using and charging the vacuum and seek qualified support.",
        sources: [...new Set([...model.sources, model.support])].filter(Boolean), verification: DIAGNOSIS_POLICY.pending,
        verificationDetail: "The damaged part, appropriate repair procedure and exact replacement compatibility have not been verified."
    };
    if (model.family === "robot") return robotDiagnosis(model, kind, answers);
    const answerTo = id => answers.find(answer => answer.nodeId === id)?.answer;
    const hasUnsure = answers.some(answer => answer.answer === "Not sure");
    const data = {
        kind, likely: "A cause has not been established.",
        others: ["There is not enough verified evidence to rank other causes."],
        reason: "These answers do not isolate a particular fault.",
        confidence: "low", confidenceReason: "Self-reported observations are not a physical inspection or a measured probability.",
        actions: [], stop: DIAGNOSIS_POLICY.support, sources: model.sources,
        verification: "", status: "result"
    };
    const advice = key => {
        if (model.guidance[key]) {
            data.actions = [model.isolation, model.guidance[key]].filter(Boolean);
            data.sources = [...new Set(data.actions.map(action => action.source))];
        }
    };
    const pending = () => {
        data.confidence = "low";
        data.confidenceReason = "The model-specific procedure is not verified, so confidence remains low.";
        data.verification = DIAGNOSIS_POLICY.pending;
        data.verificationDetail = UNVERIFIED_BRANCH_DETAILS[kind] || "The next model-specific procedure is not verified in Repera.";
        data.actions = [{ text: "Do not attempt an unverified repair. Contact the manufacturer with your exact model and answer summary. Keep the safety limits below.", source: model.support }];
        data.sources = [...new Set([...data.sources, model.support])];
        data.status = "pending";
    };
    // A safety concern stops all maintenance, including when the concern is uncertain.
    if (kind === "safety" || kind === "safetyUncertain" || kind === "manualStop") {
        data.likely = kind === "safetyUncertain" ? "A possible safety concern could not be ruled out. The cause is not established." : "A safety concern needs assessment; the underlying cause is not established.";
        data.reason = kind === "manualStop" ? "You chose Stop for safety." :
            kind === "safetyUncertain" ? "A safety question was answered Not sure, so maintenance is paused." :
            "You reported a safety warning sign. Your answer summary records the observation.";
        data.actions = [{ text: DIAGNOSIS_POLICY.stop }];
        data.stop = DIAGNOSIS_POLICY.stop;
        data.status = "safety";
        return data;
    }
    if (model.family === "miele") return mieleDiagnosis(model, kind, answers);
    // Keep unanswered symptoms from being misreported as normal operation.
    if (kind === "review") {
        if (answerTo("pickup") === "No") kind = "weakPickup";
        else if (hasUnsure) kind = "uncertain";
        else kind = "noIssue";
        data.kind = kind;
    }
    const reasons = {
        fullBin: "You reported poor pickup and a full dirt container.",
        dirtyFilter: "You reported poor pickup and heavy dirt on the removable filter.",
        blocked: "You reported poor pickup or unexpected shutoff and a visible obstruction.",
        cutoff: "You reported unexpected shutoff. These answers do not establish its cause.",
        brushIssue: "You reported poor pickup and a brush roll that was not moving.",
        noiseIssue: "You reported an unusual noise; sound alone does not locate the fault.",
        whistleNoise: "You reported a high-pitched whistle. BISSELL lists restricted airflow from a clog or blockage as a likely explanation for this sound.",
        grindingNoise: "You reported grinding. BISSELL says an issue in the floor-head area can cause this sound.",
        indicator: "You reported a flashing light. The exact pattern and its meaning have not been verified here.",
        powerIssue: "You reported no startup or no audible motor; the answers do not distinguish the remaining power causes.",
        uncharged: "You reported no startup or no audible motor, and no charge before the last attempt.",
        unplugged: "You reported no startup or no audible motor, and that it was not plugged in.",
        chargeSetting: "You reported no startup or no audible motor and that the switch was ON while charging.",
        weakPickup: "You reported poor pickup, but the later observations did not establish a cause.",
        noIssue: "You reported startup, normal pickup, no unexpected shutoff, no unusual noise and no safety warning signs.",
        uncertain: "One or more observations were unclear. Not sure is not treated as No or as proof of a fault."
    };
    data.reason = reasons[kind] || data.reason;
    // New MVP evidence uses its own conclusions; it cannot inherit another BISSELL's steps.
    if (model.family === "cleanview" && kind !== "noIssue") {
        const referral = "Keep the vacuum off and unplugged. Contact BISSELL with your model and answer summary. Do not remove covers or perform powered tests with parts removed.";
        const supported = {
            powerIssue: ["A supply or connection issue is possible; a specific fault is not established.", "C-POWER", TROUBLESHOOTING_SOURCES.cleanviewPower],
            unplugged: ["The disconnected power supply likely explains the failed startup.", "C-POWER", TROUBLESHOOTING_SOURCES.cleanviewPower],
            blocked: ["The visible blockage may restrict airflow and explain poor pickup.", "C-SUCTION", TROUBLESHOOTING_SOURCES.cleanviewSuction],
            weakPickup: ["An airflow restriction is one possible explanation for poor pickup; its location and cause have not been established.", "C-SUCTION", TROUBLESHOOTING_SOURCES.cleanviewSuction],
            brushIssue: ["Height setting, debris, or a brush or belt problem may explain the stopped brush.", "C-BRUSH", TROUBLESHOOTING_SOURCES.cleanviewBrush],
            whistleNoise: ["Restricted airflow from a clog or blockage is a likely cause of the whistle.", "C-WHISTLE", TROUBLESHOOTING_SOURCES.cleanviewNoise],
            grindingNoise: ["A problem in the floor-head area may explain the grinding.", "C-GRINDING", TROUBLESHOOTING_SOURCES.cleanviewNoise],
            dirtyFilter: ["Dirty filters need routine care; their contribution to this fault is not established.", "C-FILTER", TROUBLESHOOTING_SOURCES.cleanviewFilters]
        };
        const match = supported[kind];
        if (!match) { pending(); return data; }
        data.likely = match[0];
        data.claimIds = [match[1]];
        data.sources = [match[2]];
        data.actions = [model.isolation, { text: referral, source: match[2] }];
        if (["powerIssue", "unplugged"].includes(kind)) {
            data.actions = [model.isolation, { text: "Only with no cord/plug damage or other safety concern, check the outlet using a small appliance. If the outlet has no power, use a working outlet in another room with the vacuum fully assembled. Contact BISSELL if power is still absent. Do not repair the cord, plug or outlet.", source: match[2] }];
        }
        if (kind === "dirtyFilter") advice("filter");
        data.sources = [...new Set([...data.sources, model.isolation.source])];
        data.stop = "Contact BISSELL for damaged parts or an unresolved problem. " + DIAGNOSIS_POLICY.support;
        return data;
    }
    // Unknown model-specific evidence never inherits another model's cause ranking.
    if (model.family === "unverified" && kind !== "noIssue") {
        pending();
        return data;
    }
    const suctionSource = model.family === "bissell" ? TROUBLESHOOTING_SOURCES.bissellSuction : model.sources[0];
    if (["fullBin", "dirtyFilter", "blocked", "weakPickup"].includes(kind)) {
        data.likely = kind === "fullBin" ? "A full dirt container is likely contributing to poor pickup." :
            kind === "dirtyFilter" ? "A dirty filter is likely restricting airflow." :
            kind === "blocked" ? "The visible obstruction may be restricting airflow." :
            "Restricted airflow is a possible cause of the weak pickup; the location is not established.";
        data.others = model.family === "blackdecker" ? ["Dirt in the filter or bowl may also affect pickup."] :
            ["A dirty filter or another obstruction may also affect airflow."];
        data.sources = [suctionSource];
        if (kind === "fullBin") { advice("bin"); data.confidence = model.family === "sharkUpright" ? "low" : "medium"; }
        else if (kind === "dirtyFilter") { advice("filter"); data.confidence = "medium"; }
        else pending();
    } else if (["uncharged", "chargeSetting", "unplugged", "powerIssue"].includes(kind)) {
        if (kind === "uncharged" || kind === "chargeSetting") {
            data.likely = kind === "chargeSetting" ? "The ON switch setting likely prevented charging." : "Insufficient battery charge is a likely cause.";
            data.others = model.family === "dyson" ? ["A charger, battery, or main-body fault may also prevent startup."] :
                ["A charger connection or supply problem may also prevent charging."];
            advice("charge");
            data.confidence = "medium";
        } else {
            data.likely = kind === "unplugged" ? "The disconnected power supply likely explains the failed startup." : "A power or charging problem is possible; a specific fault has not been isolated.";
            data.others = ["A supply or connection problem remains possible; internal faults need qualified assessment."];
            advice(model.cordless ? "charge" : "power");
            if (kind === "unplugged" && model.family !== "sharkUpright") data.confidence = "medium";
        }
    } else if (kind === "brushIssue") {
        data.likely = model.family === "bissell" ? "A brush obstruction or drive-belt problem may be preventing rotation." : "A brush-roll problem may be contributing to poor pickup; the cause is not established.";
        data.others = model.family === "bissell" ? ["Brush damage or another obstruction is also possible."] : ["Other causes cannot be ranked without the exact floor-head guide."];
        data.sources = model.family === "bissell" ? [TROUBLESHOOTING_SOURCES.bissellBrush] : model.sources;
        pending();
    } else if (kind === "whistleNoise" && model.family === "bissell") {
        data.likely = "Restricted airflow from a clog or blockage is a likely cause of the high-pitched whistle.";
        data.others = ["The answers do not establish where the restriction is located."];
        data.actions = [model.isolation, { text: "Keep the vacuum off and unplugged. Contact BISSELL with the reported whistle and your answer summary. Repera does not guide cover removal or powered tests with parts removed.", source: TROUBLESHOOTING_SOURCES.bissellSuction }];
        data.sources = [TROUBLESHOOTING_SOURCES.bissellNoise, TROUBLESHOOTING_SOURCES.bissellSuction];
        data.confidence = "medium";
    } else if (kind === "grindingNoise" && model.family === "bissell") {
        data.likely = "A problem in the floor-head area is a likely cause of the grinding noise.";
        data.others = ["The answers do not distinguish debris, brush damage, or a belt problem."];
        data.actions = [model.isolation, { text: "Keep the vacuum unplugged and contact BISSELL about the grinding. Stop before removing the brush cover or handling the belt or motor shaft. Do not run it with covers removed.", source: TROUBLESHOOTING_SOURCES.bissellBrush }];
        data.sources = [TROUBLESHOOTING_SOURCES.bissellNoise, TROUBLESHOOTING_SOURCES.bissellBrush];
        data.confidence = "medium";
    } else if (kind === "cutoff" && model.family === "dyson") {
        data.likely = "Restricted airflow from a blockage or dirty filter may explain the cutout.";
        data.others = ["Other causes cannot be ranked without further checks."];
        pending();
    } else if (kind === "noIssue") {
        data.likely = "No likely fault was identified from the reported observations.";
        data.others = ["An intermittent or unobserved problem cannot be ruled out."];
        data.actions = [{ text: "Do not perform an unnecessary repair. If the concern returns, record what happens and contact support." }];
    } else {
        pending();
    }
    // Confidence is a conservative editorial label, never an accuracy percentage.
    if (hasUnsure || data.status === "pending") data.confidence = "low";
    if (data.confidence === "medium") data.confidenceReason = "A reported observation matches a manufacturer-listed cause, but other causes remain possible.";
    if (!data.actions.length) pending();
    // The source list must include every action's evidence, including power isolation.
    data.sources = [...new Set([...data.sources, ...data.actions.map(action => action.source).filter(Boolean)])];
    return data;
}


// Dataset names do not establish manual scope. Each robot has its own evidence gate.
const ROBOT_RESEARCH = {
    blaupunkt_bluebot: {
    "name": "Blaupunkt Bluebot XPOWER+ (BPK-VCBB1XPW+)",
    "title": "Blaupunkt Bluebot XPOWER+ manufacturer manual, April 2020 (Geizhals archive)",
    "url": "https://gzhls.at/blob/ldb/b/1/b/a/cb6c547e2aa491461bc416524fc6e3d1fdb4.pdf",
    "section": "German printed pages 35-37, 44-46 and 54-55. English summaries. Manufacturer sheet connects BPK-VCBB1XPW+ to XPOWER+; manual technical table abbreviates code as BPK-VCBB1XP+. Dataset unit 06 label reviewed.",
    "extraSources": [
        {
            "title": "Blaupunkt BPK-VCBB1XPW+ XPOWER+ manufacturer data sheet (Geizhals archive)",
            "url": "https://gzhls.at/blob/ldb/a/3/9/a/ac6bc993b0909fdffe3b5824a58d65e2498e.pdf",
            "scope": "Exact model code and XPOWER+ product name, visually reviewed. Identity only, not repair instructions."
        }
    ],
    "note": "Only XPOWER+ BPK-VCBB1XPW+ is covered. Other Bluebot variants are not included. Historical manuals do not establish current app or parts availability.",
    "guidance": {
        "uncharged": "Charge with the supplied adapter, either through the original base or directly connected to the robot. A steady blue robot light with five short beeps indicates full charge.",
        "dockIssue": "Place the base against a wall on a hard, level floor with a clear return path. Keep it at least 1.2 m from stairs.",
        "fullBin": "Set the physical main switch OFF and disconnect charging power. Release and remove the dustbin, open it, remove its filters and empty it. Refit the dry filters and bin.",
        "dirtyFilter": "Set the main switch OFF and disconnect charging power. Brush dust from the removed HEPA filter; do not wash it. Refit the dry filter assembly before use."
    }
},
    irobot_roomba_560: {
    "name": "iRobot Roomba 560",
    "classifierLabel": "irobot_roomba",
    "dockOptional": true,
    "title": "iRobot Roomba original 500 Series owner manual",
    "url": "https://prod-help-content.care.irobotapi.com/files/guide/500SeriesManual.pdf",
    "section": "Original 500 manual, pages 4, 12, 16, 21, 23 and 33. The 560 falls within the documented 550-and-above range. Home Base is optional; direct charging is also documented.",
    "extraSources": [
        {
            "title": "iRobot official legacy manual index",
            "url": "https://homesupport.irobot.com/articles/en_US/Knowledge/844",
            "scope": "Scope links for original 500, 600, 700, legacy 800 and 900 models; excludes newer Plus and Max series."
        }
    ],
    "note": "The classifier suggests the Roomba family, not 560 specifically. Confirm 560 on your robot. Filter/bin upgrades need separate compatibility checks.",
    "guidance": {
            dirtyFilter: {"text": "End cleaning, switch off and disconnect charging power. Remove the bin and its filter using the layout shown for your bin. Tap loose dust into a waste bin; do not wash the filter. Refit it and the bin before use.", "source": {"title": "iRobot original 500 Series bin and filter care", "url": "https://homesupport.irobot.com/articles/en_US/Knowledge/8241", "scope": "Includes original and AeroVac bins. No replacement-filter compatibility inferred."}},
            brushDebris: {"text": "Stop cleaning, switch off and disconnect charging power. Release both brush-guard tabs and lift out the brushes. Remove loose hair from the brushes, yellow bearings and caps. Refit all caps, bearings and brushes and close the guard. Do not run without the bearings; stop if parts are stuck or missing.", "source": {"title": "iRobot original 400 and 500 main-brush care", "url": "https://homesupport.irobot.com/articles/en_US/Knowledge/740", "scope": "Original 500 scope includes 560; removable brush care only. Missing bearings require support."}},
        "uncharged": "Charge using the original power supply or optional Home Base. The CLEAN button pulses amber while charging and becomes steady green when full.",
        "dockIssue": "If you use a Home Base, place it against a wall on a hard, level floor with a clear return path. Keep it at least 4 feet from stairs.",
        "fullBin": "End cleaning by holding CLEAN until its lights turn off, and disconnect charging power. Release and remove the bin, empty it and securely refit it.",
        "navigation": "End cleaning and disconnect charging power. Wipe the underside cliff-sensor openings with a clean, dry cloth. Persistent abnormal movement needs iRobot support."
    }
},
    irobot_roomba_600_legacy: {
    "name": "iRobot Roomba 620 / 630 / 645 / 650 / 655 / 660",
    "classifierLabel": "irobot_roomba",
    "title": "iRobot Roomba original 600 Series owner guide (French)",
    "url": "https://prod-help-content.care.irobotapi.com/files/hs/roomba/600/legacy/manual/fr-FR.pdf",
    "section": "Official legacy guide; safety pages i-ii and printed pages 3, 6-7. English summaries. Model scope is restricted to the six models named in the official manual index.",
    "extraSources": [
        {
            "title": "iRobot official legacy manual index",
            "url": "https://homesupport.irobot.com/articles/en_US/Knowledge/844",
            "scope": "Scope links for original 500, 600, 700, legacy 800 and 900 models; excludes newer Plus and Max series."
        },
        {
            "title": "iRobot original Roomba 600 care procedures",
            "url": "https://homesupport.irobot.com/articles/en_US/Knowledge/8247",
            "scope": "Confirms dry filter tapping and that filters must not be washed."
        }
    ],
    "note": "Confirm one of the listed model numbers. Newer Plus 600 and Combo models are not included.",
    "guidance": {
            brushDebris: {"text": "Stop cleaning, switch off and disconnect charging power. Lift both yellow brush-guard tabs. Lift out the brushes, remove loose hair beneath their yellow caps and around the metal shafts, then refit the caps, bearings and brushes and close the guard. Stop if anything is stuck or damaged.", "source": {"title": "iRobot original Roomba 600 and 700 brush care", "url": "https://homesupport.irobot.com/articles/en_US/Knowledge/2077", "scope": "Explicit original 600/700 scope. Removable brush care only; no side-brush, motor or internal repairs."}},
        "uncharged": "Charge on the original Home Base. Its lights can turn off after 60 seconds while charging; press CLEAN to check status. Amber means charging; steady green means charged.",
        "dockIssue": "Leave 0.5 m clear on each side of the Home Base, 1.2 m ahead and from stairs, and 2.4 m from Virtual Wall barriers.",
        "fullBin": "End cleaning, remove the robot from its base and disconnect charging power. Press the bin release, withdraw and empty the bin, then refit it securely.",
        "dirtyFilter": {
    "text": "With cleaning stopped and charging power disconnected, remove the bin filter, tap loose dust into a waste bin and refit it. Do not wash the filter.",
    "source": {
        "title": "iRobot original Roomba 600 care procedures",
        "url": "https://homesupport.irobot.com/articles/en_US/Knowledge/8247",
        "scope": "Original 600 filter removal, dry tapping and no washing; guide safety section requires disconnection before maintenance."
    }
},
        "navigation": "With cleaning stopped and charging power disconnected, wipe the cliff sensors with a clean, dry cloth. Contact iRobot if abnormal travel continues."
    }
},
    irobot_roomba_700_legacy: {
    "name": "iRobot Roomba original 700 Series (not Max 700)",
    "classifierLabel": "irobot_roomba",
    "title": "iRobot Roomba original 700 Series owner manual",
    "url": "https://prod-help-content.care.irobotapi.com/files/guide/700SeriesManual.pdf",
    "section": "Original 700 manual, printed pages 5-7, 9 and 24-26. Original dual-filter models only, not Max 700 or Combo products.",
    "extraSources": [
        {
            "title": "iRobot official legacy manual index",
            "url": "https://homesupport.irobot.com/articles/en_US/Knowledge/844",
            "scope": "Scope links for original 500, 600, 700, legacy 800 and 900 models; excludes newer Plus and Max series."
        }
    ],
    "note": "Match your original 700-series model before continuing. Max 700 and Combo models use different guidance and parts.",
    "guidance": {
            brushDebris: {"text": "Stop cleaning, switch off and disconnect charging power. Lift both yellow brush-guard tabs. Lift out the brushes, remove loose hair beneath their yellow caps and around the metal shafts, then refit the caps, bearings and brushes and close the guard. Stop if anything is stuck or damaged.", "source": {"title": "iRobot original Roomba 600 and 700 brush care", "url": "https://homesupport.irobot.com/articles/en_US/Knowledge/2077", "scope": "Explicit original 600/700 scope. Removable brush care only; no side-brush, motor or internal repairs."}},
            dirtyFilter: {"text": "Stop cleaning, switch off and disconnect charging power. Remove and empty the bin, open its filter door and release both filters using their yellow tabs. Tap loose dust into a waste bin; do not wash. Refit the rear tabs correctly, secure the filters, close the door and refit the bin.", "source": {"title": "iRobot original Roomba 700 bin and filter care", "url": "https://homesupport.irobot.com/articles/en_US/Knowledge/2069", "scope": "Original dual-filter 700 Series, not Max 700. Both filters must be refitted."}},
        "uncharged": "Charge on the original Home Base. A solid green battery indicator means the battery is charged. Contact iRobot if it does not charge.",
        "dockIssue": "Place the Home Base against a wall on a hard, level floor with a clear return path. Keep it at least 1.2 m from stairs.",
        "fullBin": "Stop the robot and disconnect charging power before care. Remove and empty the dustbin, then refit it correctly; the robot will not run without its bin.",
        "navigation": "Stop the robot and disconnect charging power. Wipe the six cliff-sensor openings with a clean, dry cloth. Persistent abnormal movement needs iRobot support."
    }
},
    irobot_roomba_800_legacy: {
    "name": "iRobot Roomba 860 / 866 / 870 / 877",
    "classifierLabel": "irobot_roomba",
    "title": "iRobot Roomba legacy 800 Series owner guide",
    "url": "https://prod-help-content.care.irobotapi.com/files/hs/roomba/800/legacy/manual/en-UK.pdf",
    "section": "Official index explicitly lists 860, 866, 870 and 877. Safety pages i-iii and printed pages 3, 7 and 9 reviewed; no scope transfer to other 800 variants.",
    "extraSources": [
        {
            "title": "iRobot official legacy manual index",
            "url": "https://homesupport.irobot.com/articles/en_US/Knowledge/844",
            "scope": "Scope links for original 500, 600, 700, legacy 800 and 900 models; excludes newer Plus and Max series."
        }
    ],
    "note": "Confirm one of the four listed model numbers; other 800 variants are not included in this flow.",
    "guidance": {
            brushDebris: {"text": "Stop cleaning, switch off and disconnect charging power. Release the yellow frame tabs and lift out the rubber brushes. Remove loose hair from their caps, axles and square/hexagonal ends. Refit the caps and brushes, matching peg shapes and colors, then close the frame. Stop if anything needs force.", "source": {"title": "iRobot original Roomba 800 and 900 extractor care", "url": "https://homesupport.irobot.com/articles/en_US/Knowledge/8996", "scope": "Explicit original 800/900 scope. Only tool-free removable brush care is summarized; no motor or cleaning-head replacement."}},
        "uncharged": "Charge on the original Home Base. Charging lights can turn off after 60 seconds; press CLEAN to check the battery indicator. Amber means charging; steady green means charged.",
        "dockIssue": "Leave 0.5 m clear on each side of the Home Base, 1.2 m ahead and from stairs, and 2.4 m from Virtual Wall barriers.",
        "fullBin": "Stop cleaning and disconnect the robot from charging power. Press the bin release, remove the bin and open its door to empty it. Refit securely.",
        "dirtyFilter": "With cleaning stopped and charging power disconnected, remove the bin filter by its tab. Tap loose debris into a waste bin. Refit the filter with its tab facing up.",
        "navigation": "With cleaning stopped and charging power disconnected, wipe the sensors with a clean, dry cloth. Do not spray cleaner into sensor openings. Contact iRobot if trouble persists."
    }
},
    irobot_roomba_900: {
    "name": "iRobot Roomba 960 / 980",
    "classifierLabel": "irobot_roomba",
    "title": "iRobot Roomba 900 Series owner guide",
    "url": "https://prod-help-content.care.irobotapi.com/files/hs/roomba/900/manual/en-UK.pdf",
    "section": "Official index explicitly includes 960 and 980. Safety page ii and printed pages 3-4, 6 and 8 reviewed.",
    "extraSources": [
        {
            "title": "iRobot official legacy manual index",
            "url": "https://homesupport.irobot.com/articles/en_US/Knowledge/844",
            "scope": "Scope links for original 500, 600, 700, legacy 800 and 900 models; excludes newer Plus and Max series."
        }
    ],
    "guidance": {
            brushDebris: {"text": "Stop cleaning, switch off and disconnect charging power. Release the yellow frame tabs and lift out the rubber brushes. Remove loose hair from their caps, axles and square/hexagonal ends. Refit the caps and brushes, matching peg shapes and colors, then close the frame. Stop if anything needs force.", "source": {"title": "iRobot original Roomba 800 and 900 extractor care", "url": "https://homesupport.irobot.com/articles/en_US/Knowledge/8996", "scope": "Explicit original 800/900 scope. Only tool-free removable brush care is summarized; no motor or cleaning-head replacement."}},
        "uncharged": "Charge on the original Home Base. Lights can turn off after 60 seconds while charging; press CLEAN to check the battery indicator. Amber means charging; steady green means charged.",
        "dockIssue": "Leave 0.5 m clear on each side of the Home Base, 1.2 m ahead and from stairs, and 2.4 m from Virtual Wall barriers.",
        "fullBin": "Stop cleaning and disconnect the robot from charging power. Press the bin release, withdraw and open the bin, empty it and refit it.",
        "dirtyFilter": "With cleaning stopped and charging power disconnected, remove the filter by its tab and tap loose debris into a waste bin. Refit it with the tab facing up.",
        "navigation": "With cleaning stopped and charging power disconnected, wipe the sensors with a clean, dry cloth. Do not spray cleaner into sensor openings. Contact iRobot if trouble persists."
    }
},
    irobot_roomba_s9: {
    "name": "iRobot Roomba s9 / s9+",
    "classifierLabel": "irobot_roomba",
    "title": "iRobot Roomba s Series owner guide (s9)",
    "url": "https://prod-help-content.care.irobotapi.com/files/hs/roomba/sseries/manual/s9/en_GB.pdf",
    "section": "Official UK index links this s9 guide. Regulatory robot RVA-Y1; safety section and printed pages 2, 4-5 and 7 reviewed. Robot care only; no internal Clean Base repair.",
    "extraSources": [
        {
            "title": "iRobot official s9 guide index",
            "url": "https://support.irobot.co.uk/articles/en_GB/Knowledge/843",
            "scope": "Explicit s9 links to robot and Clean Base guides."
        },
        {
            "title": "iRobot s Series Clean Base owner guide",
            "url": "https://prod-help-content.care.irobotapi.com/files/hs/roomba/sseries/manual/s9_cb/en_GB.pdf",
            "scope": "Printed page 2: placement clearances, including 0.3 m above the Clean Base."
        }
    ],
    "guidance": {
            brushDebris: {"text": "End cleaning, switch off and disconnect charging power. Release the brush-frame latch and lift out the rubber brushes. Remove loose hair beneath the caps and around the square/star ends. Refit the caps, match each brush peg to its corresponding frame shape and close the latch. Stop if parts are stuck or damaged.", "source": {"title": "iRobot s Series rubber brushes: care and compatibility", "url": "https://www.irobot.com/en_US/dual-multi-surface-rubber-brushes-for-roomba-s-series/4646490.html", "scope": "s Series only. Manufacturer care instructions for removable brushes; internal cleaning-head replacement excluded."}},
        "uncharged": "Charge on the original station. The light ring pulses while charging and becomes solid when full; it can turn off after one minute to save power.",
        "fullBin": "End cleaning and disconnect the robot from its station. Release the top bin lid, lift the bin by its handle and press its release to empty. Refit the bin and filter.",
        "dirtyFilter": "With cleaning stopped and the robot disconnected from its station, remove the filter by its tab. Tap loose dust into a waste bin and refit it. Do not wash the filter.",
        "navigation": "With cleaning stopped and charging power disconnected, wipe sensors and the camera window with a clean, dry cloth. Do not spray them. Persistent trouble needs iRobot support.",
        "dockIssue": {
            "text": "Leave 0.5 m clear on both sides, 1.2 m in front and from stairs. For the s9+ Clean Base, also leave 0.3 m above it. Contact iRobot if docking still fails.",
            "source": {
                "title": "iRobot s Series Clean Base owner guide",
                "url": "https://prod-help-content.care.irobotapi.com/files/hs/roomba/sseries/manual/s9_cb/en_GB.pdf",
                "scope": "Printed page 2: Clean Base placement; robot guide page 2 confirms the shared Home Base clearances."
            }
        }
    }
},
    klarstein_vc_cleanhero_w: {
        "name": "Klarstein VC-Cleanhero-W (10028520)",
        "title": "Klarstein 10028519 / 10028520 / 10028521 manufacturer manual (ManualsPlanet archive)",
        "url": "https://manualsplanet.com/manualPdf/klarstein-10028520.pdf",
        "section": "Manufacturer Chal-Tec identified on printed page 21; exact 10028520 on cover and page 12. Pages 12, 15, 18-20 reviewed. Dataset unit 14 label confirms 10028520 / VC-Cleanhero-W.",
        "guidance": {
            "uncharged": "Turn the robot on. Use its supplied adapter and base with the charging contacts aligned; the power indicator blinks while charging and stops blinking when full.",
            "dockIssue": "Place the base on a hard, level surface against a wall. Leave 0.5 m clear on each side and 3 m in front; keep its signal window unobstructed.",
            "fullBin": "Switch off and disconnect power before care. Press the bin button and slide the bin out. Open its two side clips, empty it and use the supplied cleaning brush. Reassemble before use.",
            "cutoff": "Check whether the scheduled cleaning time ended or an error appeared. Low-charge return can be normal. For unexplained stops, do not dismantle the robot; contact qualified support."
        }
    },
    neato_botvac: {
        "name": "Neato Botvac Connected",
        "title": "Neato Botvac Connected manufacturer guide 515-0041 Rev. 1 (EU9-hosted German copy)",
        "url": "https://www.eu9.com/wp-content/uploads/Neato-Botvac-Connected-Bedienungsanleitung-DE-EU9.com_.pdf",
        "section": "Original LCD-equipped Botvac Connected, not D3-D7. German PDF pages 6-8 and 15 reviewed; publisher and revision on page 18. Dataset unit 02 label reads Botvac Connected / 905-0249. English summaries.",
        "extraSources": [
            {
                "title": "Neato official cloud-service phaseout announcement",
                "url": "https://support.neatorobotics.com/support/solutions/articles/204000073686",
                "scope": "Cloud-service status only; an app outage does not establish a hardware fault."
            }
        ],
        "note": "Neato announced a cloud-service phaseout. App failure alone does not mean the vacuum is broken. This guidance covers the original LCD-equipped Botvac Connected only; D-series models are not included.",
        "guidance": {
            "uncharged": "Align the rounded rear of the robot with its original base contacts. Full charge is shown by both status lights staying white and a green battery indicator.",
            "dockIssue": "Place the base against a wall on a hard floor, with 1 m clear on both sides and in front. Check the intact power connection.",
            "fullBin": "Switch the robot off using the main switch in the bin compartment and unplug the base. Empty the dirt bin and refit it with its filter.",
            "dirtyFilter": "With the robot off and base unplugged, remove the filter using its handle and clean it with the filter comb. Refit it before use.",
            "navigation": "With the robot off and base unplugged, gently clean the two underside drop-sensor windows with a dry cotton swab. Persistent navigation problems need qualified support."
        }
    },
    tesvor_s6: {
        "name": "Tesvor S6",
        "title": "Tesvor S6 manufacturer user manual (Home Depot-hosted copy)",
        "url": "https://images.thdstatic.com/catalog/pdfImages/53/538a9da9-8040-42d5-b467-26b4fd048f4c.pdf",
        "section": "Original S6 explicitly named on cover and printed page 19; printed pages 2-4, 7, 9, 16-18 reviewed. Manufacturer-authored document hosted by Home Depot, not S6 Turbo. Conflicting sunlight instructions on page 16 are excluded.",
        "guidance": {
            "uncharged": "Turn on the side power switch and charge on the original base using the supplied adapter. Contact Tesvor if charging fails.",
            "fullBin": "Switch off and unplug charging power. Remove the dust box, empty it, and refit the complete dry filter assembly and box.",
            "dirtyFilter": "With power disconnected, brush dust from the high-performance filter; do not wash it. Refit dry filters. Ask Tesvor before following the conflicting sunlight instructions in the manual.",
            "dockIssue": "Place the base against a wall on a hard, level floor. Clear 3.3 ft on each side and 6.6 ft ahead, including reflective objects.",
            "navigation": "Switch off and disconnect charging power. Gently wipe the drop sensors with a dry cloth. Persistent abnormal travel needs Tesvor support.",
            "cutoff": "Returning to the base after cleaning or when charge is low can be normal. Record unexplained interruptions for Tesvor; this does not establish a failed battery."
        }
    },
    proscenic_coco_smart_790t: {
        "name": "Proscenic COCO Smart 790T",
        "title": "Proscenic COCO Smart 790T manufacturer manual (Amazon-hosted German copy)",
        "url": "https://m.media-amazon.com/images/I/E1iGHMEGjqS.pdf",
        "section": "Cover explicitly names COCO Smart 790T; publisher identified on final page. German printed pages 4, 6, 9 and 13 reviewed; English summaries. Historical document, not confirmation that its app or parts service remains available.",
        "guidance": {
            "uncharged": "Set the right-side main switch ON. Align the robot with its original charging base. The display reads FULL when charged.",
            "dockIssue": "Place the original base against a wall on a level floor with the surrounding area clear. Check its intact power connection.",
            "fullBin": "Switch off and disconnect charging power. Open the top lid, lift out the container, remove the filters and empty it. Refit the dry filters and container.",
            "dirtyFilter": "With power disconnected, clean loose dust from the filters using the supplied cleaning brush. Reinstall the full dry filter assembly before use. Persistent poor pickup needs Proscenic support.",
            "cutoff": "The robot can return to its base at low charge. If it stops elsewhere, record its display and ask Proscenic or qualified support to assess it."
        }
    },
    proscenic_811gb: {
        "name": "Proscenic 811GB",
        "title": "Proscenic BL828 manual explicitly applicable to 811GB (archived manufacturer copy)",
        "url": "https://immagini.qualescegliere.it/manuali/B07BNZBY1H.pdf",
        "section": "Manufacturer-authored PDF on QualeScegliere archive; cover explicitly says BL828 APPLICABLE TO 811GB. Printed English pages 2, 8 and 11 visually reviewed; publisher on final page. Conflicting HEPA washing text/diagram excluded.",
        "guidance": {
            "uncharged": "Charge using the original adapter and base, following the charging diagram on page 8. Do not substitute an unrelated charger.",
            "dockIssue": "Place the base against a wall, with 1 m clear on either side and about 2 m in front.",
            "fullBin": "Switch off and disconnect charging power. Follow page 11 to release the tank/bin assembly, lift out and open the dustbin, remove its filters and empty it. Refit the dry assembly.",
            "dirtyFilter": "With power disconnected, use the cleaning brush to remove dust from the HEPA filter. Refit dry filters. Ask Proscenic before washing the HEPA filter: the manual text and diagram conflict.",
            "cutoff": "Returning to the base after cleaning or at low charge can be normal. Persistent unexplained stops need Proscenic or qualified support."
        }
    },
    dirtdevil_spider: {
        "name": "Dirt Devil Spider M607",
        "title": "Dirt Devil M607 manufacturer manual (archived French copy)",
        "url": "https://www.aspirateur-robot.info/wp-content/uploads/2017/09/notice-dirt-devil-m607.pdf",
        "section": "Royal Appliance manufacturer manual Roya-25196, 18 June 2013; retailer-prefaced archive. Printed French pages 55, 61-66, 71-77 reviewed; exact M607 suffix scope. English summaries. Original manufacturer download now redirects.",
        "dock": false,
        "guidance": {
            "uncharged": "Set the switch to 0 and connect the supplied adapter to the robot and outlet. When the blue charging light stays on, disconnect from the outlet, then the robot, before use.",
            "fullBin": "Switch off and disconnect the charger. Follow pages 71-74 to remove the dustbin covers, lift the bin and filter together, then separate them over a bin and empty. Refit filters and covers.",
            "dirtyFilter": "With power disconnected, rinse the removed bin and filter with cool or lukewarm water. Use no detergent or hard brush. Allow at least 24 hours and complete drying before reassembly.",
            "chargeIssue": "Check that the original, undamaged adapter is correctly connected at the outlet and robot. Charge with the switch at 0. If this fails, contact qualified support."
        }
    },
    dirtdevil_tracker_m613: {
        "name": "Dirt Devil Tracker M613",
        "title": "Dirt Devil M613 manufacturer manual (Darty-hosted French copy)",
        "url": "https://fc.darty.com/notices/b/8/9/7/b8978baaf009152949e45e090e7d547198637130.pdf",
        "section": "Royal Appliance manual Roya-29879-11, 13 February 2017, hosted by retailer Darty. Printed French pages 55, 61-66, 71-77 reviewed; exact M613 suffix scope. English summaries. Original manufacturer download now redirects.",
        "dock": false,
        "guidance": {
            "uncharged": "Set the switch to 0 and connect the supplied adapter to the robot and outlet. When the green charging light stays on, disconnect from the outlet, then the robot, before use.",
            "fullBin": "Switch off and disconnect the charger. Press the two cover release points, remove the cover and lift the dustbin by its handle. Open it, remove the filter and empty. Refit everything securely.",
            "dirtyFilter": "With power disconnected, rinse the removed bin and filter with cool or lukewarm water. Use no detergent or hard brush. Allow at least 24 hours and complete drying before reassembly.",
            "chargeIssue": "Check that the original, undamaged adapter is correctly connected at the outlet and robot. Charge with the switch at 0. If this fails, contact qualified support."
        }
    },
    severin_chill: {
        name: "Severin Chill RB7025", title: "SEVERIN RB7025 / Type 7025 instruction manual",
        url: "https://severin.com/wp-content/uploads/2026/03/7025.pdf",
        section: "English pages 21-23, 26, 29-34: safety, direct charging, bin/filter care, sensors and troubleshooting; dataset unit 08 label reads RB7025 / Type 70250",
        dock: false,
        guidance: {
            uncharged: "Set the switch to 0. Connect the supplied adapter to the robot and outlet. When charging finishes, disconnect it from both before use.",
            fullBin: "Switch off and disconnect the adapter. Lift the top cover, then the container by its handle. Open the container, remove the filter and empty it. Refit everything correctly.",
            dirtyFilter: "Switch off and disconnect the adapter. Remove loose dust from the container and filter following pages 29-30. Refit the filter and covers before use.",
            navigation: "Switch off and disconnect the adapter. Wipe the three underside drop sensors with a clean, lint-free cloth. Contact SEVERIN if movement remains abnormal.",
            chargeIssue: "Check that the supplied, undamaged adapter is seated correctly at the robot and outlet. Keep the robot switched off while charging. If this fails, contact SEVERIN."
        }
    },
    tcl_sweeva1000_b100a: {
        name: "TCL Sweeva 1000 B100A", title: "TCL Sweeva 1000 user manual",
        url: "https://cdn.shopify.com/s/files/1/0687/7151/2385/files/Sweeva_1000_User_Manual_compressed.pdf?v=1766317239",
        section: "Official TCL RV1014B product page links this manual; printed English page 14 explicitly includes B100A; pages 4-9 and 11-14 establish safety, care and error scope",
        guidance: {
            uncharged: "Fully charge on the supplied base with the charging contacts aligned. Check the bottom power switch is ON.",
            fullBin: "Switch off at the bottom switch. Release the dustbin latch, withdraw and open the bin, empty it and refit the filter and bin securely.",
            dirtyFilter: "With power off, remove the bin and filter. Rinse them, then allow at least 24 hours and complete drying before refitting. Never reinstall damp components.",
            dockIssue: "Place the base on a hard, level surface against a wall, with 1 m clear on each side and 2 m in front.",
            chargeIssue: "Switch off and unplug the base. Wipe charging contacts with a dry cloth. If charging still fails after correct reconnection, contact TCL.",
            navigation: "With power off, wipe the anti-drop sensors with a soft cloth. Contact TCL if abnormal movement persists.",
            batteryLow: "Seven beeps with a steady orange light indicate low charge. Place the robot on its supplied base if there is no safety concern."
        }
    },
    robovox_zaco: {
        name: "ZACO V5x", title: "ZACO V5x Nordic user manual (Danish section)",
        url: "https://cdn.shopify.com/s/files/1/0498/8069/4942/files/ZACO_V5x_Manual_Nordics_Final_1.pdf?v=1694009550",
        section: "Manufacturer-authored manual: Danish printed pages 3, 5-6, 13, 18-21 and 24; English summaries. Dataset unit 01 label explicitly reads V5x. Manufacturer website is currently under construction",
        guidance: {
            uncharged: "Remove the water tank before charging. Set the power switch on and charge using the manufacturer-supplied adapter and station.",
            fullBin: "Switch off and disconnect charging power. Empty the dust container and refit it with the dry filter assembly, following the diagrams on page 18.",
            dirtyFilter: "Do not wash the filter. Follow the dry filter-care diagrams on page 18 and refit only dry filters. Ask ZACO or the dealer if pickup remains poor.",
            dockIssue: "Place the station against a wall, with about 1 m clear on each side and 2 m in front.",
            chargeIssue: "With the robot off and station unplugged, gently wipe charging contacts with a soft, dry cloth. If charging still fails, ask ZACO or the dealer.",
            navigation: "With the robot off, gently wipe the drop-sensor windows with a soft, dry cloth. Persistent abnormal movement needs qualified support."
        }
    },
    tesvor_x500: {
        name: "Tesvor X500", title: "Tesvor X500 English owner manual",
        url: "https://drive.google.com/file/d/1C5DWzXS9M2fVgEofBjBk58QIt9H6pPkD/view",
        section: "Official Tesvor after-sales page links this X500 folder/manual; printed pages 1-3, 5-8, 13-18",
        guidance: {
            uncharged: "Set the side power switch on and charge with the original adapter and base. Contact Tesvor if charging fails.",
            fullBin: "With power off, remove the dust box and empty it. Refit the box and complete filter assembly before use.",
            dirtyFilter: "Brush dust from the high-performance filter; do not wash it. If the dust box, pre-filter or sponge is washed, air-dry it fully before reassembly.",
            dockIssue: "Place the base on a hard, level surface against a wall. Clear 3.3 ft on each side and 6.6 ft in front, including mirrors or reflective objects.",
            navigation: "With power off, carefully clean the drop sensors with a dry cloth. Contact Tesvor if abnormal movement continues.",
            chargeIssue: "Switch off and unplug power before cleaning charging terminals with a soft, dry cloth. Contact Tesvor if charging still fails.",
            cutoff: "A return to the base after completing cleaning or at low charge can be normal. Persistent unexplained stops need Tesvor support."
        }
    },
    roborock_s502_00: {
        name: "Roborock S502-00", title: "Roborock S5 FCC English owner manual",
        url: "https://support.roborock.com/hc/en-us/article_attachments/360043366531",
        section: "Printed pages 6 and 18: S5***** suffix scope includes S502-00; pages 11 and 14-16: setup and care",
        guidance: {
            uncharged: "Low charge can prevent startup. Place the robot on its original dock to charge; remove the mopping tank before charging.",
            dirtyFilter: "Rinse the removable filter with water only. Do not use detergent, fingers or a brush to clean it. Dry it for at least 24 hours before refitting.",
            dockIssue: "Position the dock level against a wall, leaving 0.5 m clear on each side and more than 1.5 m in front.",
            chargeIssue: "With the robot off and dock unplugged, wipe the charging contacts with a soft, dry cloth. If charging still fails, contact Roborock.",
            navigation: "With the robot off, gently wipe the cliff and wall sensors with a soft, dry cloth. Persistent abnormal movement needs support."
        }
    },
    ecovacs_deebot_da60: {
        name: "ECOVACS DEEBOT DA60", title: "ECOVACS DEEBOT SLIM DA60 owner manual",
        url: "https://site-static.ecovacs.com/upload/file/support/2020/03/13/185427_7707.pdf",
        section: "Printed English pages 3-5: safety and DA60 scope; 9-10, 14-19: setup, maintenance and troubleshooting",
        guidance: {
            uncharged: "Set the bottom switch to ON and align the robot with its original charging dock. Contact ECOVACS if it will not charge.",
            fullBin: "With power off, lift the top cover, remove the dust bin, open its cover and empty it. Refit the bin and filters.",
            dirtyFilter: "Pat the high-efficiency filter clean; do not rinse it. Refit all filters. Do not run with missing or damp filters.",
            dockIssue: "Place the dock level against a wall, with 0.5 m clear on each side and 1.5 m in front, away from reflective surfaces.",
            chargeIssue: "Switch off and unplug the dock before wiping charging contacts with a dry cloth. Contact ECOVACS if charging still fails.",
            navigation: "With the robot off, wipe the anti-drop sensors with a dry cloth.",
            stuck: "Switch off before clearing loose floor obstacles. Stop if a cable or jam cannot be freed without force.",
            cutoff: "A return to the dock at low charge can be normal. Record any alarm and contact ECOVACS if interruption persists."
        }
    },
    ecovacs_deebot_dg3g: {
        name: "ECOVACS DEEBOT DG3G", title: "ECOVACS DEEBOT DG3G owner manual",
        url: "https://site-static.ecovacs.com/upload/file/support/2020/05/29/073258_6703.pdf",
        section: "Printed English page 7: DG3G scope; pages 12-13, 20-27: setup, isolation, care and troubleshooting",
        guidance: {
            uncharged: "Set the power switch to I and align the robot with its original dock. Empty the water reservoir and remove the cleaning cloth plate before charging.",
            fullBin: "With the robot off, open the top cover, remove the dust bin, release its lock and empty it. Refit the bin and filters.",
            dirtyFilter: "Pat the high-efficiency filter clean. Do not rinse that filter. Refit the complete filter assembly before use.",
            dockIssue: "Place the dock level against a wall. Clear 0.5 m on each side and 1.5 m in front, including reflective objects.",
            chargeIssue: "Switch off and unplug the dock before wiping contacts with a dry cloth. Check alignment on the original dock; contact ECOVACS if charging still fails.",
            stuck: "Switch off before removing loose floor obstacles. Stop if freeing the robot requires force or handling damaged cables.",
            cutoff: "Returning to the dock at low charge can be normal. If it stops elsewhere or repeatedly fails to finish, record the behavior for ECOVACS."
        }
    },
    samsung_sr10j503au: {
        name: "Samsung SR10J503AU", title: "Samsung SR10J503AU: official support and SR10J50 series manual",
        url: "https://www.samsung.com/uk/support/model/VR10J503AUC/EN/",
        section: "Linked 00_DJ68-00734A.pdf: English pages 12-14, 27-28, 33, 36-39; model-specific download establishes SR10J503AU scope",
        guidance: {
            uncharged: "Turn the bottom power switch on and place the robot on its original charger with the contacts aligned.",
            fullBin: "Switch off, remove the dust bin, open its cover and remove the filter. Empty the dust, then refit the filter, cover and bin.",
            dirtyFilter: "With power off, remove and clean the dust bin and filter. If washed, wipe the bin dry and let the filter dry completely in shade before refitting. Keep fingers clear of the intake.",
            dockIssue: "Keep about 0.5 m clear on each side of the charger and 1 m in front. Check its intact power connection.",
            navigation: "With power off, lightly wipe the front, rear and cliff sensor windows with a soft cloth.",
            stuck: "Switch off and move the robot away from a loose floor obstacle. Do not force jammed wheels or pull tangled cables.",
            batteryLow: "The exact display Lo indicates low charge. Place the robot on its original charger if there is no safety concern."
        }
    },
    eufy_robovac_11s: {
        name: "eufy RoboVac 11S (T2108)", title: "eufy RoboVac 11S: official troubleshooting FAQ",
        url: "https://www.eufy.com/us/products/t2108114", section: "Product FAQ: activation, charging, docking, suction, travel path",
        guidance: {
            batteryLow: "Four beeps with a flashing red light indicate low power. Charge using the original base for at least five hours, provided there is no safety concern.",
            uncharged: "Fully charge the robot using its original charging base. Check that the bottom power switch is in the I position.",
            fullBin: "Empty the dust collector. Refit it before using the robot.",
            dirtyFilter: "Clean the filters with a vacuum cleaner or cleaning brush; let any wet filters dry completely before use.",
            dockIssue: "Place the base on a hard, level surface against a wall. Clear 1 m on either side and 2 m in front.",
            chargeIssue: "If the base indicator does not light, contact eufy about the base. Dust off charging pins with a dry cloth while the robot is off and the base unplugged.",
            navigation: "With the robot off, gently clean the bumper and bottom sensors with a dry cloth. Contact eufy if abnormal movement continues."
        }
    },
    eufy_robovac_30c: {
        name: "eufy RoboVac 30C (T2118)", title: "eufy RoboVac 30C T2118 owner manual",
        url: "https://d2211byn0pk9fi.cloudfront.net/spree/accessories/attachments/73864/T2118_Manual_51005001159_20180809_148x210mm_V01_EN.pdf?1539248334=",
        section: "Printed pages 23-31: maintenance and troubleshooting; linked by official 30C product page",
        guidance: {
            batteryLow: "Four beeps with a flashing red light indicate low power. Charge on the original base for at least five hours, provided there is no safety concern.",
            uncharged: "Fully charge the robot on its original base; check that its main power switch is ON.",
            fullBin: "Press the dust collector release, pull it out, open and empty it, then refit it with its filters.",
            dirtyFilter: "Clean filters with a cleaning brush or vacuum cleaner. Do not wash the high-performance filter. Refit all filters before use.",
            dockIssue: "Clear 1 m to either side of the charging base and 2 m in front.",
            chargeIssue: "With the robot off and base unplugged, dust off charging pins with a dry cloth. If the base indicator does not light, contact eufy.",
            navigation: "With the robot off, clean sensors carefully with a dry cloth. Contact eufy if abnormal movement continues."
        }
    },
    ilife_v5s_pro: {
        name: "ILIFE V5s Pro", title: "ILIFE V5s Pro: official FAQ", url: "https://www.iliferobot.com/V5sPro/faq/",
        section: "Maintenance, activation, charging, noise, short cleaning time and missed scheduled cleaning",
        guidance: {
            scheduleIssue: "Check the saved schedule in the linked V5s Pro guide. Switching the robot off or completely draining its battery cancels that schedule. If no safety warning applies, save the schedule again using the manufacturer's instructions and keep the power switch on for scheduled cleaning. Contact ILIFE if it still misses the scheduled start; this does not establish a failed timer or battery.",
            dockIssue: {"text": "Place the original dock against a wall, with about 1 m clear on each side and 2 m in front. Check its intact power connection. Keep the robot power switch on for charging.", "source": {"title": "ILIFE V5s Pro manufacturer user manual", "url": "https://www.iliferobot.com/u_file/photo/20220406/019daf3bcb.pdf", "scope": "Exact V5s Pro cover; printed pages 4, 12, 17 and 19 visually reviewed. Isolation, docking, mopping and sensor/contact care."}},
            navigation: {"text": "Switch the robot off and disconnect charging power. Gently wipe the cliff-sensor windows with a soft, dry cloth. Contact ILIFE if abnormal travel continues.", "source": {"title": "ILIFE V5s Pro manufacturer user manual", "url": "https://www.iliferobot.com/u_file/photo/20220406/019daf3bcb.pdf", "scope": "Exact V5s Pro cover; printed pages 4, 12, 17 and 19 visually reviewed. Isolation, docking, mopping and sensor/contact care."}},
            chargeIssue: {"text": "Remove the water tank. Switch off and unplug charging power before gently wiping the robot and dock charging pins with a soft, dry cloth. Reconnect the original charger and turn the robot switch on. Contact ILIFE if charging still fails.", "source": {"title": "ILIFE V5s Pro manufacturer user manual", "url": "https://www.iliferobot.com/u_file/photo/20220406/019daf3bcb.pdf", "scope": "Exact V5s Pro cover; printed pages 4, 12, 17 and 19 visually reviewed. Isolation, docking, mopping and sensor/contact care."}},
            moppingMode: {"text": "Wet-mopping mode does not vacuum. For dry pickup, stop and switch off the robot, remove the water tank and refit the dustbin before dry cleaning. Do not vacuum wet floors. Remove the water tank before charging.", "source": {"title": "ILIFE V5s Pro manufacturer user manual", "url": "https://www.iliferobot.com/u_file/photo/20220406/019daf3bcb.pdf", "scope": "Exact V5s Pro cover; printed pages 4, 12, 17 and 19 visually reviewed. Isolation, docking, mopping and sensor/contact care."}},
            uncharged: {"text": "Remove the water tank before charging. Check the bottom power switch is on and charge using the supplied adapter and base.", "source": {"title": "ILIFE V5s Pro manufacturer user manual", "url": "https://www.iliferobot.com/u_file/photo/20220406/019daf3bcb.pdf", "scope": "Exact V5s Pro cover; printed pages 4, 12, 17 and 19 visually reviewed. Isolation, docking, mopping and sensor/contact care."}},
            fullBin: "Switch the robot off, empty the dustbin and refit it before use.",
            dirtyFilter: "Do not wash, squeeze or press the high-performance filter. Tap it gently to remove dust. If it has been washed, contact ILIFE about the correct replacement.",
            cutoff: "If it stops with an error, record the number of beeps and consult the exact manual or ILIFE support. Do not assume this means battery failure."
        }
    },
    medion_md_17225: {
        name: "MEDION MD 17225", title: "MEDION MD 17225 operating manual (German)",
        url: "https://download2.medion.com/downloads/anleitungen/bda_md17225_de.pdf",
        section: "Printed pages 19-27: cleaning, care and troubleshooting; English summaries",
        guidance: {
            batteryLow: "E003 indicates a depleted battery. Place the robot on its original station and let it charge fully if there is no safety concern.",
            uncharged: "Check the main switch is in I and charge fully on the supplied station.",
            fullBin: "Set the switch to 0 and unplug the station. Follow the illustrated dust-container release on pages 20-22, empty it, and refit the complete filter assembly.",
            dirtyFilter: "With the switch at 0 and station unplugged, clean the dust filter and EPA filter using the supplied brush. Refit the complete assembly before use.",
            dockIssue: "Check the intact power cord connects to the charging station. Keep the station unobstructed and accessible.",
            chargeIssue: "Check the main switch and original station's power connection. Do not open the adapter or battery; contact MEDION if charging still fails.",
            navigation: "With the robot switched off and station unplugged, wipe sensor surfaces with a clean, dry cloth (page 20)."
        }
    },
    vorwerk_kobold_vr100: {
        name: "Vorwerk Kobold VR100", title: "Vorwerk Kobold VR100: official product FAQ (French)",
        url: "https://www.vorwerk.com/fr/fr/c/vorwerk/aide/kobold/faq-produits/vr100",
        section: "Full bin, filter care, docking placement and repair referral; English summaries",
        guidance: {
            fullBin: "With the robot off, empty the dust container, dust its filter and refit both. Clean floor sensors with a clean, soft cloth.",
            dirtyFilter: "Dust the filter; never wash it with water. Refit it with the dust container before use.",
            dockIssue: "Keep at least 0.5 m clear in front of the station and on each side. Contact Vorwerk if docking still fails."
        }
    },
    xiaomi_s10: {
        name: "Xiaomi Robot Vacuum S10", title: "Xiaomi Robot Vacuum S10: official FAQ",
        url: "https://www.mi.com/global/support/faq/details/KA-43931/",
        section: "Product use questions 8, 17-18; common issues 8, 14-17",
        guidance: {
            uncharged: "A low battery can prevent startup. Place the robot on its original charging dock to charge.",
            chargeIssue: "Check both ends of the intact dock power cord are connected. If charging still fails, contact Xiaomi; do not open the battery or dock.",
            dockIssue: "Clear 0.5 m on either side of the dock and 1.5 m in front. Begin the next cleaning from the dock once the issue is resolved.",
            stuck: "Pause the robot and clear loose floor clutter such as slippers and plastic bags. Do not pull on trapped cables or force jammed parts."
        }
    },
    ecovacs_deebot_dx9g: {
        name: "ECOVACS DEEBOT OZMO 950 (DX9G)", title: "ECOVACS DEEBOT OZMO 950 DX9G owner manual (Lithuanian)",
        url: "https://site-static.ecovacs.com/upload/lt/file/support/2023/02/15/180740_8242-DEEBOTOZMO950-Lietuvi%C5%B3kalba-Lithuanian.pdf",
        section: "Printed pages 18, 24-25, 27: isolation, troubleshooting, exact DX9G scope; English summaries",
        guidance: {
            chargeIssue: "Check the robot is ON and its charging contacts align with the original station. Check the intact station power cord is connected. If this fails, contact ECOVACS.",
            stuck: "Switch the robot off before clearing loose floor obstacles. Do not force tangled cables or jammed parts; contact ECOVACS if it cannot be freed safely.",
            cutoff: "Returning to the station when battery power is low can be normal. If it stops elsewhere, records an error or will not charge, contact ECOVACS."
        }
    }
};

const ROBOT_PENDING = {
    irobot_roomba: ["iRobot Roomba family", "https://homesupport.irobot.com/", "The photo classifier identifies only the Roomba family. Choose a supported exact model or original series after checking your label; do not transfer instructions between series."],
    easyhome_saugroboter: ["Easyhome SR1 / 97166", null, "Dataset unit 18 label confirms SR1 / 97166 and names Tempo International. The archived Tempo SR1 manual names article 96221; applicability to 97166 remains unverified."],
    vileda_a3: ["Vileda A3", "https://www.vileda.com/product-manuals", "An original Vileda Relax manual was found, but no manufacturer source links it to A3; newer VR-series guides were not substituted."],
    vileda_m_h498: ["Vileda M-H498", "https://www.vileda.com/product-manuals", "An original Vileda Relax manual was found, but no manufacturer source links it to M-H498; M-488A and newer VR-series guides were not substituted."]
};

for (const [id, record] of Object.entries(ROBOT_RESEARCH)) {
    const source = {title: record.title, url: record.url, scope: record.section};
    const guidance = Object.fromEntries(Object.entries(record.guidance).map(([kind, value]) => [kind, typeof value === "string" ? {text: value, source} : value]));
    const sources = [...new Map([source, ...(record.extraSources || []), ...Object.values(guidance).map(action => action.source)].map(item => [item.url, item])).values()];
    TROUBLESHOOTING_MODELS[id] = {
        name: record.name, family: "robot", cordless: true, brush: true, dock: record.dock !== false, dockOptional: !!record.dockOptional, classifierLabel: record.classifierLabel || id,
        diagnosticEnabled: true, supportedMvp: true, researchStatus: "verified-with-gaps",
        support: source, sources, guidance,
        note: "Confirm this exact model on the label. Robot guidance covers verified setup and maintenance only; it does not confirm a failed part." + (record.note ? " " + record.note : "")
    };
}
for (const [id, [name, url, gap]] of Object.entries(ROBOT_PENDING)) {
    const source = url ? {title: name + ": manufacturer directory or identity source", url, scope: "Referral or identity only; no repair procedure verified."} : null;
    TROUBLESHOOTING_MODELS[id] = {
        name, family: "robot", cordless: true, brush: true, classifierLabel: id,
        diagnosticEnabled: false, supportedMvp: false, researchStatus: "unverified", guidance: {},
        support: source, sources: source ? [source] : [], note: gap,
        userMessage: "Information still being verified. " + gap + " Confirm the exact label and contact the manufacturer or qualified support before attempting repairs."
    };
}

function robotTree(model, clarify = true) {
    const q = (text, yes, no, unsure) => ({type: "question", text, hint: "Answer from what you already observed. Do not run or dismantle the robot to answer.", next: {Yes: yes, No: no, "Not sure": unsure}});
    const nodes = {
        smell: q("Is there a burning smell?", "safety", "damage", "safetyUncertain"),
        damage: q("Is the robot, dock or power cable visibly damaged?", "safety", "liquid", "safetyUncertain"),
        liquid: q("Has liquid accidentally entered the robot's electrical parts or charging dock?", "safety", "smoke", "safetyUncertain"),
        smoke: q("Have you noticed smoke?", "safety", "heat", "safetyUncertain"),
        heat: q("Have you noticed unusual heat from the robot, battery or dock?", "safety", "batteryDamage", "safetyUncertain"),
        batteryDamage: q("Does the battery appear swollen or leaking?", "safety", "power", "safetyUncertain"),
        power: q("Does the robot turn on?", "light", "charged", "uncertain"),
        charged: q("Was it charged before you last tried to use it?", "chargeIssue", "uncharged", "chargeIssue"),
        light: q("Has it reported an error with a light, beeps, voice or app message?", "indicator", "shutoff", "uncertain"),
        shutoff: q("Does it stop before finishing the cleaning?", "stuckCheck", "movement", "uncertain"),
        stuckCheck: q("Was it visibly trapped on a loose floor object?", "stuck", "cutoff", "cutoff"),
        movement: q("Does it move normally when cleaning?", "pickup", "navigation", "uncertain"),
        pickup: q("Is it picking up dirt?", model.dock === false ? "noise" : model.dockOptional ? "hasDock" : "dock", "bin", "uncertain"),
        bin: q("Is its dust container full?", "fullBin", "filter", "filter"),
        filter: q("Have you already noticed heavy dirt on its removable filter?", "dirtyFilter", "block", "block"),
        block: q("Have you noticed a visible blockage or tangled brush?", "blocked", "weakPickup", "weakPickup"),
        dock: q("Does it return to its dock normally?", "noise", "dockIssue", "uncertain"),
        noise: q("Is there an unusual noise?", "noiseIssue", "review", "uncertain")
    };
    if (model.guidance.brushDebris) {
        nodes.block.next.Yes = "mainBrush";
        nodes.mainBrush = q("Is hair or string visibly wrapped around the long brushes underneath the robot?", "brushDebris", "blocked", "blocked");
    }
    if (model.guidance.moppingMode) {
        nodes.pickup.next.No = "mopMode";
        nodes.mopMode = q("Was the water tank fitted for wet mopping when it failed to pick up dirt?", "moppingMode", "bin", "uncertain");
    }
    if (model.guidance.scheduleIssue) {
        nodes.noise.next.No = "usesSchedule";
        nodes.usesSchedule = q("Have you set this robot to clean automatically at a scheduled time?", "scheduleStarts", "review", "uncertain");
        nodes.scheduleStarts = q("Does it start cleaning at the scheduled time?", "review", "scheduleIssue", "uncertain");
    }
    if (model.dockOptional) nodes.hasDock = q("Do you use a Home Base charging dock with this robot?", "dock", "noise", "uncertain");
    if (["eufy_robovac_11s", "eufy_robovac_30c"].includes(model.classifierLabel)) {
        nodes.light.next.Yes = "lowBatteryError";
        nodes.lowBatteryError = q("Was the red light flashing with exactly four beeps?", "batteryLow", "indicator", "indicator");
    } else if (model.classifierLabel === "medion_md_17225") {
        nodes.light.next.Yes = "lowBatteryError";
        nodes.lowBatteryError = q("Did its display show the exact error E003?", "batteryLow", "indicator", "indicator");
    }
    if (model.classifierLabel === "samsung_sr10j503au") {
        nodes.light.next.Yes = "lowBatteryError";
        nodes.lowBatteryError = q("Did its display show exactly Lo?", "batteryLow", "indicator", "indicator");
    }
    if (model.classifierLabel === "tcl_sweeva1000_b100a") {
        nodes.light.next.Yes = "lowBatteryError";
        nodes.lowBatteryError = q("Was there a steady orange light with exactly seven beeps?", "batteryLow", "indicator", "indicator");
    }
    if (model.dock === false) {
        delete nodes.dock;
        nodes.damage.text = "Is the robot, charger or power cable visibly damaged?";
        nodes.liquid.text = "Has liquid accidentally entered the robot's electrical parts or charger?";
        nodes.heat.text = "Have you noticed unusual heat from the robot, battery or charger?";
    }
    nodes.liquid.hint = "Normal water in a designated mopping tank is not accidental electrical exposure. If you cannot tell, choose Not sure.";
    for (const kind of ["safety", "safetyUncertain", "uncertain", "chargeIssue", "uncharged", "indicator", "stuck", "cutoff", "navigation", "fullBin", "dirtyFilter", "blocked", "weakPickup", "dockIssue", "noiseIssue", "review", "batteryLow", "brushDebris", "moppingMode", "scheduleIssue"]) nodes[kind] = {type: "result", kind};
    addDamageQuestions(nodes, q, model, clarify);
    return {start: "smell", nodes};
}

function robotDiagnosis(model, kind, answers) {
    const unsure = answers.some(a => a.answer === "Not sure");
    const safe = ["safety", "safetyUncertain", "manualStop"].includes(kind);
    const causes = {
        scheduleIssue: "The saved schedule or power-switch state may explain the missed cleaning; an internal fault has not been established.",
        brushDebris: "The reported hair or string around the main brushes may be contributing to poor pickup; a failed brush motor has not been established.",
        moppingMode: "Wet-mopping mode may explain the lack of dry pickup; this model does not vacuum in that mode.",
        batteryLow: "The reported exact error pattern indicates low battery charge according to this model's manufacturer guide.",
        uncharged: "Insufficient charge is a possible cause of the reported startup problem.",
        fullBin: "The reported full dust container is a likely contributor to poor pickup.",
        dirtyFilter: "The reported dirty filter may be contributing to poor pickup.",
        stuck: "The reported floor obstacle may have interrupted cleaning.",
        dockIssue: "Dock placement or access may be contributing to the reported docking problem.",
        navigation: "A navigation problem is possible; your answers do not establish a sensor or wheel fault.",
        chargeIssue: "A charging or startup problem is possible; no battery, dock or electronic fault is confirmed.",
        cutoff: "Cleaning was interrupted; charge state, an obstacle or a fault still needs assessment.",
        blocked: "The reported obstruction may be affecting pickup; its safe removal is not established here.",
        indicator: "The exact error pattern needs checking; a flashing light alone does not establish a fault.",
        weakPickup: "Poor pickup was reported, but a specific cause has not been isolated.",
        noiseIssue: "An unusual noise needs assessment; the source has not been isolated."
    };
    if (model.dock === false) causes.chargeIssue = "A charging or startup problem is possible; no battery, charger or electronic fault is confirmed.";
    const d = {kind, status: "pending", likely: causes[kind] || "A cause has not been established.",
        others: ["Other causes have not been ranked; a qualified inspection may be needed."],
        reason: "Based on your answers to the questions recorded below. A photo and questionnaire cannot confirm internal damage or part failure.",
        confidence: "low", confidenceReason: "This is an observation-based assessment, not a confirmed diagnosis or measured probability.",
        actions: [], sources: model.sources, stop: "Stop if the action does not match your model, requires force or tools, or does not help. Contact the manufacturer or qualified support. Do not open the motor, battery, dock or electrical housing.",
        verification: "", verificationDetail: ""};
    if (model.dock === false) d.stop = d.stop.replace("battery, dock", "battery, charger");
    if (safe) {
        d.status = "safety"; d.likely = kind === "safetyUncertain" ? "A possible safety concern could not be ruled out. The cause is not established." : "A safety concern requires qualified assessment; its cause is not established.";
        d.reason = kind === "manualStop" ? "You chose Stop for safety." : "A safety warning was reported or could not be ruled out.";
        d.actions = [{text: DIAGNOSIS_POLICY.stop}]; d.stop = DIAGNOSIS_POLICY.stop;
        return d;
    }
    const observed = answers.filter(a => !["smell", "damage", "liquid", "smoke", "heat", "batteryDamage"].includes(a.nodeId));
    if (observed.length) d.reason = observed.map(a => `${a.question || a.nodeId} ${a.answer}.`).join(" ") + " These observations suggest a next step; they do not prove an internal fault or failed part.";
    if (kind === "review" && !unsure) {
        d.kind = "noIssue"; d.status = "result"; d.likely = "No fault was isolated from these observations.";
        d.actions = [{text: "If the original problem continues, record what happens and ask the manufacturer to assess it.", source: model.support}];
        return d;
    }
    const action = model.guidance[kind];
    if (action) {
        d.status = "result"; d.maintenance = kind !== "cutoff";
        const policy = ["uncharged", "batteryLow", "chargeIssue"].includes(kind) ?
            "Only charge when there is no safety warning and the original dock, adapter and cable are undamaged. Do not clean or handle contacts while powered, or open electrical housings. This is Repera's safety limit." :
            "Before cleaning or handling moving parts, stop the robot, switch it off and unplug the charging base if safe. Do not force anything or open electrical housings. This is Repera's safety limit.";
        const isolation = model.dock === false ? policy.replace("dock, adapter and cable", "adapter and cable").replace("unplug the charging base", "disconnect the charger") : policy;
        d.actions = d.maintenance && kind !== "scheduleIssue" ? [{text: isolation}, action] : [action];
        if (!unsure && ["fullBin", "dirtyFilter", "stuck", "batteryLow", "brushDebris", "moppingMode"].includes(kind)) d.confidence = "medium";
    } else {
        d.verification = DIAGNOSIS_POLICY.pending;
        d.verificationDetail = "The exact-model procedure for this symptom, error pattern or component is not verified in Repera. Similar-model instructions and dataset disassembly steps are not substituted.";
        d.actions = [{text: "Do not attempt an unverified repair. Contact the manufacturer with the exact model, error pattern and answer summary.", source: model.support}];
    }
    return d;
}


// SBAN0 is a bagged canister; robot and bagless maintenance must not reach this flow.
const MIELE_SOURCES = {
    manual: {title: 'Miele Classic C1 SBAN0 operating instructions, M.-Nr. 10 090 370', url: 'https://us.mieleusa.com/MieleMedia/docs/products/OpIn/manuals_pdf/Vacuums/Classic_C1_Capri_Olymus.pdf', scope: 'SBAN0 on cover; English maintenance pp. 12-16. Accessories vary by version.'},
    product: {title: 'Miele Classic C1 Turbo Team SBAN0, product 11181010', url: 'https://www.mieleusa.com/product/11181010/canister-vacuum-cleaners-classic-c1-turbo-team-powerline-sban0-tech-blue', scope: 'Exact Turbo Team identity and official matching accessories; confirm your floorhead separately.'},
    turbo: {title: 'Miele STB 305 TurboTeQ operating instructions', url: 'https://media.miele.com/downloads/48/7a/04_C7F12828660B1FD09CBB7CF230ED487A.pdf', scope: 'English-US pp. 68-71; applies only when STB 305 is confirmed on the floorhead.'},
    support: {title: 'Miele USA service contact', url: 'https://www.mieleusa.com/cs/service/contact-11', scope: 'Manufacturer assistance; give SBAN0 and the product number from your label.'}
};
TROUBLESHOOTING_MODELS.miele_classic_c1_sban0 = {
    name: 'Miele Classic C1 SBAN0 (including Turbo Team)', family: 'miele', cordless: false, brush: true,
    diagnosticEnabled: true, supportedMvp: true, researchStatus: 'verified-with-gaps', classifierLabel: 'miele_classic_c1_sban0',
    sources: [MIELE_SOURCES.manual, MIELE_SOURCES.product, MIELE_SOURCES.turbo], support: MIELE_SOURCES.support,
    note: 'Confirm SBAN0 on the vacuum label. Brush guidance requires a separately confirmed STB 305 floorhead.',
    isolation: {text: 'Switch off and unplug before maintenance.', source: MIELE_SOURCES.manual},
    guidance: {
        fullBag: {text: 'Replace the disposable GN bag using the manual bag-change guide; do not reuse it. Refit correctly without forcing the lid.', source: MIELE_SOURCES.manual},
        dirtyFilter: {text: 'Replace the affected filter following the matching filter section. Keep the bag and all filters installed.', source: MIELE_SOURCES.manual},
        cutoff: {text: 'Leave unplugged for 30 minutes to cool. Check for airflow restrictions. Contact Miele if shutdown recurs.', source: MIELE_SOURCES.manual},
        hardPush: {text: 'Reduce suction using the selector or handpiece air inlet, following the flooring care instructions.', source: MIELE_SOURCES.manual},
        brushIssue: {text: 'Only for a confirmed STB 305: hair wrapping or restricted airflow may slow the suction-driven brush. Follow its linked maintenance guide while unplugged. Stop before housing, belt or turbine work; ask Miele if unsure.', source: MIELE_SOURCES.turbo}
    },
    todo: 'Electrical/no-start faults, cord reel, unexplained noise, internal repairs and other floorhead variants require qualified support; no failed part is established.'
};

function mieleTree(model, clarify = true) {
    const q = (text, yes, no, unsure) => ({type:'question', text, hint:DIAGNOSIS_POLICY.observation, next:{Yes:yes, No:no, 'Not sure':unsure}});
    const nodes = {
        smell:q('Is there a burning smell?', 'safety', 'damage', 'safetyUncertain'),
        damage:q('Is anything visibly damaged, including the cord or plug?', 'safety', 'liquid', 'safetyUncertain'),
        liquid:q('Has liquid entered the vacuum?', 'safety', 'smoke', 'safetyUncertain'),
        smoke:q('Have you noticed smoke coming from the vacuum?', 'safety', 'heat', 'safetyUncertain'),
        heat:q('Have you noticed unusual heat from the vacuum, cord or plug?', 'safety', 'power', 'safetyUncertain'),
        power:q('Does the vacuum turn on?', 'shutoff', 'plug', 'uncertain'),
        plug:q('Was it plugged in when you last tried?', 'powerIssue', 'unplugged', 'uncertain'),
        shutoff:q('Does it shut off unexpectedly?', 'cutoff', 'pickup', 'uncertain'),
        pickup:q('Is it picking up dirt?', 'noise', 'bag', 'uncertain'),
        bag:q('Have you noticed a full dust bag or a full bag-change indicator during normal use?', 'fullBag', 'block', 'block'),
        block:q('Have you noticed anything visibly blocking the hose, wand or floorhead?', 'blocked', 'filter', 'filter'),
        filter:q('Have you already noticed heavy dirt on a filter?', 'dirtyFilter', 'turboHead', 'turboHead'),
        turboHead:q('Does the floorhead label say STB 305 or STB 305-3?', 'brush', 'review', 'review'),
        brush:q('Was the brush roll on that floorhead moving when you last used it?', 'review', 'brushIssue', 'review'),
        noise:q('Is there an unusual noise?', 'noiseIssue', 'push', 'uncertain'),
        push:q('Is the floorhead unusually difficult to push?', 'hardPush', 'review', 'uncertain')
    };
    for (const kind of ['safety','safetyUncertain','uncertain','powerIssue','unplugged','cutoff','fullBag','blocked','dirtyFilter','brushIssue','noiseIssue','hardPush','review']) nodes[kind]={type:'result',kind};
    addDamageQuestions(nodes, q, model, clarify);
    return {start:'smell',nodes};
}

function mieleDiagnosis(model, kind, answers) {
    const unsure = answers.some(a=>a.answer==='Not sure');
    const answer = id=>answers.find(a=>a.nodeId===id)?.answer;
    if (kind==='review') kind=answer('pickup')==='No' ? 'weakPickup' : unsure ? 'uncertain' : 'noIssue';
    const findings = {
        fullBag:['A loaded dust bag may be restricting airflow.', 'You reported poor pickup and a full bag or indicator.'],
        dirtyFilter:['A soiled filter may restrict airflow.', 'You reported poor pickup and visible filter dirt.'],
        blocked:['An airflow obstruction is possible.', 'You reported poor pickup and a visible blockage.'],
        cutoff:['Thermal protection may explain the shutdown.', 'You reported unexpected shutoff; its cause remains unconfirmed.'],
        hardPush:['The suction setting may be too strong for the surface.', 'You reported normal pickup but difficulty moving the floorhead.'],
        brushIssue:['Hair wrapping or restricted airflow may slow the STB 305 brush.', 'You confirmed STB 305 and reported poor pickup with a stopped brush.'],
        noIssue:['No likely fault was identified from the reported observations.', 'You reported startup, normal pickup, no shutdown, unusual noise, difficulty pushing or safety warning.']
    };
    const match=findings[kind];
    const d={kind, status:'result', likely:match?.[0] || 'A cause has not been established.',
        reason:match?.[1] || (kind==='uncertain' ? 'One or more observations were unclear.' : 'These answers do not isolate a particular fault.'),
        others:['Other causes remain possible; a qualified inspection may be needed.'], confidence:'low',
        confidenceReason:'Reported observations do not prove a failed component or establish an accuracy percentage.',
        actions:[],stop:DIAGNOSIS_POLICY.support,sources:[MIELE_SOURCES.manual],verification:''};
    if (kind==='noIssue') {
        d.others=['An intermittent or unobserved problem cannot be ruled out.'];
        d.actions=[{text:'No repair or part purchase is indicated by these answers. Contact support if the concern returns.'}];
    } else if (model.guidance[kind]) {
        d.actions=[model.isolation,model.guidance[kind]];
        d.maintenance=kind!=='cutoff';
        if (!unsure && ['fullBag','dirtyFilter','hardPush'].includes(kind)) d.confidence='medium';
    } else {
        d.status='pending';d.verification=DIAGNOSIS_POLICY.pending;
        d.verificationDetail='The exact cause and next model-specific repair for this observation have not been verified in Repera.';
        d.actions=[{text:'Do not attempt an unverified repair. Keep the vacuum off and unplugged; contact Miele with your answer summary.',source:model.support}];
    }
    if (kind==='brushIssue' && answer('turboHead')!=='Yes') {
        d.status='pending';d.confidence='low';d.verification=DIAGNOSIS_POLICY.pending;
        d.verificationDetail='The STB 305 floorhead has not been confirmed.';
        d.likely='The floorhead cause has not been established.';
        d.actions=[{text:'Do not attempt an unverified repair. Ask Miele to identify the fitted floorhead.',source:model.support}];
    }
    d.sources=[...new Set([...d.sources,...d.actions.map(a=>a.source).filter(Boolean)])];
    return d;
}
