// Repair routing is derived from reviewed guidance, not an AI guess about repairability.
(() => {
    const plan = getElement('repair-plan');
    const partsBox = getElement('parts-options'), partsHome = partsBox.nextElementSibling;
    const country = getElement('recycling-country');
    const decision = getElement('repair-decision'), location = getElement('recycling-location');
    const locate = getElement('recycling-locate'), status = getElement('recycling-location-status');
    const nearby = getElement('recycling-nearby');
    let request = 0, assessment = '';

    function clearLocation() {
        request++;
        location.value = '';
        nearby.replaceChildren();
        nearby.hidden = true;
        status.textContent = '';
        locate.disabled = false;
        locate.removeAttribute('aria-busy');
    }
    function search(place) {
        const url = new URL('https://www.google.com/maps/search/');
        url.searchParams.set('api', '1');
        url.searchParams.set('query', 'small appliance electronics recycling near ' + place);
        nearby.replaceChildren(sourceLink({title: 'Search Google Maps for recycling places', url: url.href}));
        nearby.hidden = false;
    }
    function parts(d) {
        const id = Object.keys(TROUBLESHOOTING_MODELS).find(id => TROUBLESHOOTING_MODELS[id] === activeModel);
        const catalog = PARTS_CATALOG[id], list = getElement('parts-list');
        list.replaceChildren();
        getElement('parts-source').replaceChildren();
        const support = getElement('parts-support');
        support.replaceChildren();
        if (activeModel.support) support.append('Confirm parts and repair options with ', sourceLink(activeModel.support), '.');
        if (d.status === 'safety') {
            getElement('parts-context').textContent = 'Get a qualified safety assessment before buying parts. A replacement filter or brush does not resolve an electrical, battery or burning-smell concern.';
            return;
        }
        if (d.kind === 'noIssue') {
            getElement('parts-context').textContent = 'No replacement part has been established as necessary from these answers. If a symptom persists, share your summary with the manufacturer before buying parts.';
            return;
        }
        const options = d.kind === 'damageReview' ? (catalog?.parts || []).filter(part => part.damageRelated) : catalog?.parts;
        getElement('parts-context').textContent = catalog
            ? 'If a part is confirmed damaged or due for replacement, use these manufacturer references to check part numbers and ordering options. This is not a list of diagnosed faults or instructions to dismantle the vacuum. ' + catalog.scope
            : 'Information still being verified: exact replacement part numbers and buying links for this model. Ask the manufacturer to confirm the failed part and compatibility using your model, type and serial number.';
        if (d.kind === 'damageReview') {
            getElement('parts-context').textContent = options?.length
                ? 'If the damaged piece is one of these components, check its manufacturer listing below. We have not identified which piece is cracked. Confirm the exact model, serial number and damaged component before ordering. These are parts references, not repair instructions.'
                : 'Information still being verified: a replacement for the damaged component. No unrelated maintenance parts are suggested. Ask the manufacturer to identify the cracked piece and confirm the correct part number.';
        }
        if (!catalog || !options?.length) return;
        for (const part of options) {
            const row = document.createElement('li');
            row.append(part.name + (part.number ? ' \u2014 ' + part.number : '') + '. ', sourceLink({title: part.linkLabel || (part.lookup ? 'Ask about ordering this part' : 'View manufacturer listing'), url: part.url}));
            const price = getPartPrice(part), priceText = document.createElement('p');
            priceText.textContent = price.text;
            if (price.source) priceText.append(' ', sourceLink(price.source));
            row.appendChild(priceText);
            if (part.note) row.append(' ', part.note);
            if (part.source) row.append(' Compatibility: ', sourceLink(part.source), '.');
            list.appendChild(row);
        }
        getElement('parts-source').append('Compatibility source: ', sourceLink(catalog.source), '. Reviewed ' + catalog.reviewed + '. Availability and prices may change.');
    }
    function recycling() {
        const box = getElement('recycling-guidance');
        box.replaceChildren();
        const p = document.createElement('p');
        const links = [];
        if (country.value === 'US') {
            p.textContent = 'Check your city or county waste program for small electrical appliances. EPA lists Earth911 as a recycling directory; enter your ZIP code there and confirm that the facility accepts your vacuum and battery before traveling. A listing is not a guarantee of acceptance.';
            links.push(['EPA electronics recycling guidance','https://www.epa.gov/recycle/electronics-donation-and-recycling'], ['Earth911 recycling search (external directory)','https://search.earth911.com/']);
        } else if (country.value === 'UK') {
            p.textContent = 'Use the Recycle Your Electricals locator and enter your postcode there. Confirm vacuum and battery acceptance, opening hours and any fees with the collection site before traveling.';
            links.push(['Recycle Your Electricals locator','https://www.recycleyourelectricals.org.uk/electrical-recycling-near-me/']);
        } else if (country.value === 'other') {
            p.textContent = 'Local options are not verified here for your country yet. Contact your municipal waste authority or the manufacturer about small-appliance and rechargeable-battery collection. Do not assume a general recycling bin accepts the vacuum.';
        } else p.textContent = 'Choose a country to see reviewed guidance. You can also prepare a nearby search below; location sharing is optional.';
        box.appendChild(p);
        links.forEach(([title,url])=>{const row=document.createElement('p');row.appendChild(sourceLink({title,url}));box.appendChild(row);});
    }
    function update() {
        const node = currentNodeId === 'manualStop' ? {type:'result',kind:'manualStop'} : tree?.nodes[currentNodeId];
        plan.hidden = questionPanel.hidden || !canDiagnose(activeModel) || node?.type !== 'result';
        const next = JSON.stringify([selectionVersion, activeModel?.name, currentNodeId, answers]);
        if (next !== assessment) {
            assessment = next;
            clearLocation();
            decision.value = '';
            country.value = '';
            getElement('repair-decision-note').textContent = '';
            getElement('recycling-options').open = false;
            getElement('parts-options').open = false;
        }
        getElement('cost-estimate').hidden = plan.hidden;
        if (plan.hidden) return;
        const d = getDiagnosis(activeModel,node.kind,answers);
        const cost = getCostEstimate(activeModel,d,answers);
        getElement('cost-estimate-summary').textContent = cost.summary;
        getElement('cost-estimate-details').replaceChildren(...cost.details.map(text => {
            const row = document.createElement('li'); row.textContent = text; return row;
        }));
        getElement('cost-estimate-reviewed').textContent = cost.notes.join(' ');
        getElement('cost-estimate-sources').replaceChildren(...cost.sources.map(source => {
            const row = document.createElement('li'); row.appendChild(sourceLink(source)); return row;
        }));
        parts(d);
        if (d.kind === 'damageReview') {
            getElement('instructions').after(partsBox);
            partsBox.querySelector('summary').textContent = 'Replacement parts to check';
            partsBox.open = true;
        } else {
            partsHome.before(partsBox);
            partsBox.querySelector('summary').textContent = 'Find replacement parts';
        }
        if (d.status === 'safety') {
            plan.hidden = true;
            return;
        }
        const maintenance = d.status === 'result' && (d.maintenance || ['fullBin','dirtyFilter','uncharged','chargeSetting','unplugged'].includes(d.kind));
        getElement('repair-route').textContent = d.status === 'safety' ? 'Stop using it. Get a qualified safety assessment.' : maintenance ? 'A supported maintenance or setup step is available.' : d.kind === 'noIssue' ? 'No repair has been established as necessary.' : 'Professional assessment is the next step.';
        getElement('repair-route-detail').textContent = d.kind === 'noIssue' ? 'These answers did not reveal a fault. This is not a safety inspection or a guarantee that the vacuum is fault-free. If the original symptom persists, record it and share this summary with the manufacturer.' : maintenance ? 'Use only the listed safe actions above. This may help the reported symptom; it does not prove that the vacuum is fixed. Stop if the action does not help or does not match your machine.' : 'A photo and these answers cannot establish whether repair is possible or economical. Use the manufacturer link above and share your summary. Do not open the motor, battery or electrical housing.';
        getElement('parts-decision').textContent = d.kind === 'noIssue' ? 'No replacement part has been established as necessary. Do not buy parts based on this result.' : maintenance ? 'No replacement part has been established as necessary. Try only the verified maintenance/setup guidance; do not buy a part based on this result.' : 'No failed part or exact replacement has been verified. Ask the manufacturer or repairer to confirm the fault and compatibility before buying parts. Similar-looking models can use different parts.';
        const note = getElement('battery-disposal-note');
        note.replaceChildren();
        if (activeModel.cordless) {
            note.append('Rechargeable batteries do not belong in household trash or curbside recycling. Do not force out an integrated battery. If it is swollen, leaking or damaged, ask the manufacturer or waste authority for handling instructions before transport. ');
            note.appendChild(sourceLink({title:'EPA battery guidance',url:'https://www.epa.gov/recycle/used-household-batteries'}));
        } else note.textContent = 'Confirm acceptance of the complete corded vacuum with the collection program. Do not cut cords or dismantle it to prepare it for collection.';
        recycling();
    }
    country.addEventListener('change',recycling);
    decision.addEventListener('change', () => {
        getElement('repair-decision-note').textContent = decision.value === 'assessed'
            ? 'You reported that a qualified repairer advised against repair. Find a collection service below and confirm what it accepts.'
            : decision.value === 'recycle' ? 'You chose to explore recycling. This does not mean the vacuum has been diagnosed as beyond repair.' : '';
        getElement('recycling-options').open = !!decision.value;
    });
    getElement('recycling-search').addEventListener('click', () => {
        const place = location.value.trim();
        clearLocation();
        location.value = place;
        if (!place) {
            status.textContent = 'Enter a city or postcode and country, or choose Use my location once.';
            location.focus();
            return;
        }
        search(place);
        status.textContent = 'Search ready. Your entered location is shared with Google Maps only when you open the link.';
    });
    location.addEventListener('input', () => {
        const value = location.value;
        clearLocation();
        location.value = value;
    });
    location.addEventListener('keydown', event => {
        if (event.key === 'Enter') { event.preventDefault(); getElement('recycling-search').click(); }
    });
    locate.addEventListener('click', () => {
        clearLocation();
        if (!navigator.geolocation) {
            status.textContent = 'Location is unavailable here. Enter a city or postcode instead.';
            return;
        }
        const current = request;
        locate.disabled = true;
        locate.setAttribute('aria-busy', 'true');
        status.textContent = 'Waiting for location permission. You can cancel with Clear location.';
        const fail = err => {
            if (current !== request) return;
            clearLocation();
            status.textContent = err?.code === 1 ? 'Location permission was not granted. Enter a city or postcode instead.' : 'Could not get your location. Enter a city or postcode instead.';
        };
        try {
            // Geolocation cannot be cancelled; ignore late callbacks after reset or manual entry.
            navigator.geolocation.getCurrentPosition(pos => {
                if (current !== request) return;
                const {latitude, longitude} = pos.coords;
                if (!Number.isFinite(latitude) || !Number.isFinite(longitude) || Math.abs(latitude) > 90 || Math.abs(longitude) > 180) return fail();
                clearLocation();
                search(latitude.toFixed(2) + ',' + longitude.toFixed(2));
                status.textContent = 'Search ready using rounded coordinates. Open the link to share this approximate location with Google Maps, or clear it.';
            }, fail, {enableHighAccuracy:false, timeout:10000, maximumAge:0});
        } catch { fail(); }
    });
    getElement('recycling-clear').addEventListener('click', () => {
        clearLocation();
        status.textContent = 'Location cleared from this page.';
    });
    getElement('problem-description').addEventListener('input', clearLocation);
    window.addEventListener('repera-state-change',()=>queueMicrotask(update));
    getElement('start-over-button').addEventListener('click',()=>{clearLocation();country.value='';getElement('recycling-options').open=false;});
})();
