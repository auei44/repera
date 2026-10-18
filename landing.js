/* Draw a local globe without a map service, cookies, or external scripts. */
(() => {
    const canvas = document.getElementById("waste-globe");
    const ctx = canvas.getContext("2d");
    const motion = document.getElementById("globe-motion");
    const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
    // These symbols illustrate a global issue. Their positions, count and size
    // do not represent verified waste sites or quantities at these coordinates.
    const regions = [
        { lon: -115, lat: 42 }, { lon: -80, lat: 32 },
        { lon: -100, lat: 20 }, { lon: -60, lat: -10 }, { lon: -65, lat: -32 },
        { lon: 10, lat: 49 }, { lon: 32, lat: 56 },
        { lon: -4, lat: 14 }, { lon: 25, lat: -8 }, { lon: 28, lat: -28 },
        { lon: 78, lat: 23 }, { lon: 110, lat: 36 }, { lon: 105, lat: 4 },
        { lon: 135, lat: -25 }
    ];
    let angle = 15, paused = reducedMotion.matches;
    let visible = true, frame = 0, previous = 0;
    const radians = Math.PI / 180;
    /* Paint a local world map once, then wrap it around the rotating sphere. */
    const texture = document.createElement("canvas");
    texture.width = 2048; texture.height = 1024;
    const map = texture.getContext("2d");
    map.fillStyle = "#237cbb"; map.fillRect(0, 0, 2048, 1024);
    for (const geometry of window.REPERA_LAND || []) {
        const polygons = geometry.type === "Polygon" ? [geometry.coordinates] : geometry.coordinates;
        for (const polygon of polygons) {
            map.beginPath();
            for (const ring of polygon) {
                ring.forEach(([lon, lat], i) => {
                    const x = (lon + 180) / 360 * 2048, y = (90 - lat) / 180 * 1024;
                    if (i === 0) map.moveTo(x, y); else map.lineTo(x, y);
                });
                map.closePath();
            }
            map.fillStyle = polygon[0].some(point => point[1] < -70) ? "#edf3ef" : "#62975b";
            map.fill("evenodd");
        }
    }
    /* Keep a geographic ocean mask before the photo replaces the simple map. */
    const baseMap = map.getImageData(0, 0, texture.width, texture.height).data;
    const oceanMask = new Uint8Array(texture.width * texture.height);
    for (let i = 0; i < oceanMask.length; i++) {
        oceanMask[i] = baseMap[i * 4 + 2] > baseMap[i * 4 + 1] + 20 ? 1 : 0;
    }
    function brightenOceans() {
        const pixels = map.getImageData(0, 0, texture.width, texture.height);
        for (let i = 0; i < oceanMask.length; i++) {
            if (!oceanMask[i]) continue;
            // Preserve ocean texture while lifting the navy water toward blue.
            pixels.data[i * 4] = pixels.data[i * 4] * .5 + 20;
            pixels.data[i * 4 + 1] = pixels.data[i * 4 + 1] * .5 + 78;
            pixels.data[i * 4 + 2] = pixels.data[i * 4 + 2] * .5 + 119;
        }
        map.putImageData(pixels, 0, 0);
    }

    /* Paint circular patches on Earth's surface, not on the screen.
       The sphere renderer then handles foreshortening and hides the far side. */
    function paintRegions() {
        for (const region of regions) {
            const lat = region.lat * radians, lon = region.lon * radians;
            const radius = 5 * radians;
            function surfaceCircle(distance, fill, outline) {
                map.beginPath();
                for (let step = 0; step <= 96; step++) {
                    const bearing = step / 96 * Math.PI * 2;
                    const latitude = Math.asin(Math.sin(lat) * Math.cos(distance) +
                        Math.cos(lat) * Math.sin(distance) * Math.cos(bearing));
                    const longitude = lon + Math.atan2(Math.sin(bearing) * Math.sin(distance) * Math.cos(lat),
                        Math.cos(distance) - Math.sin(lat) * Math.sin(latitude));
                    const x = (longitude / (2 * Math.PI) + .5) * texture.width;
                    const y = (.5 - latitude / Math.PI) * texture.height;
                    if (step === 0) map.moveTo(x, y); else map.lineTo(x, y);
                }
                map.closePath(); map.fillStyle = fill; map.fill();
                if (outline) { map.strokeStyle = outline; map.lineWidth = 2; map.stroke(); }
            }
            surfaceCircle(radius, "#ef3030b0", "#ff7777");
            surfaceCircle(3 / 290, "#ff5555");
        }
    }
    paintRegions();
    let surface = map.getImageData(0, 0, 2048, 1024).data;
    const globe = ctx ? ctx.createImageData(640, 640) : null;
    const samples = [];
    // Precompute the visible hemisphere so animation only samples colors each frame.
    const tilt = 12 * radians;
    for (let y = 29; y < 612; y++) {
        for (let x = 29; x < 612; x++) {
            const nx = (x - 320) / 290, ny = (320 - y) / 290;
            const square = nx * nx + ny * ny;
            if (square > 1) continue;
            const nz = Math.sqrt(1 - square);
            const latitude = Math.asin(ny * Math.cos(tilt) + nz * Math.sin(tilt));
            const longitude = Math.atan2(nx, nz * Math.cos(tilt) - ny * Math.sin(tilt));
            samples.push({ pixel: (y * 640 + x) * 4,
                u: (longitude / (2 * Math.PI) + .5) * 2048,
                row: Math.min(1023, Math.floor((.5 - latitude / Math.PI) * 1024)) * 2048,
                light: .62 + .38 * Math.max(0, -.35 * nx + .3 * ny + .88 * nz) });
        }
    }

    /* Load the NASA photo mosaic locally; preserve the map if decoding fails. */
    const earthImage = new Image();
    earthImage.onload = () => {
        map.drawImage(earthImage, 0, 0, texture.width, texture.height);
        brightenOceans();
        paintRegions();
        surface = map.getImageData(0, 0, texture.width, texture.height).data;
        canvas.dataset.texture = "nasa";
        draw();
    };
    earthImage.onerror = () => { canvas.dataset.texture = "fallback"; };
    if (window.REPERA_EARTH_TEXTURE) earthImage.src = window.REPERA_EARTH_TEXTURE;

    function draw() {
        if (!ctx) return;
        ctx.clearRect(0, 0, 640, 640);
        const shift = angle / 360 * 2048;
        for (const sample of samples) {
            const column = ((Math.floor(sample.u + shift) % 2048) + 2048) % 2048;
            const source = (sample.row + column) * 4;
            for (let channel = 0; channel < 3; channel++) {
                globe.data[sample.pixel + channel] = surface[source + channel] * sample.light;
            }
            globe.data[sample.pixel + 3] = 255;
        }
        ctx.putImageData(globe, 0, 0);
    }

    /* Pause when offscreen or in a background tab, and respect reduced motion. */
    function tick(time) {
        frame = 0;
        if (previous) angle = (angle + Math.min(time - previous, 60) * 0.01) % 360;
        previous = time; draw();
        frame = requestAnimationFrame(tick);
    }
    function updateMotion() {
        cancelAnimationFrame(frame); frame = 0; previous = 0;
        motion.textContent = paused ? "Resume rotation" : "Pause rotation";
        motion.setAttribute("aria-pressed", String(paused));
        if (ctx && !paused && visible && !document.hidden) frame = requestAnimationFrame(tick);
        draw();
    }
    motion.addEventListener("click", () => { paused = !paused; updateMotion(); });
    reducedMotion.addEventListener("change", () => { paused = reducedMotion.matches; updateMotion(); });
    document.addEventListener("visibilitychange", updateMotion);
    new IntersectionObserver(entries => { visible = entries[0].isIntersecting; updateMotion(); }).observe(canvas);
    updateMotion();

    /* Switch screens without saving consent or clearing an in-progress diagnosis. */
    const welcome = document.getElementById("welcome-screen");
    const app = document.getElementById("app-screen");
    let entering = false, finishTimer = null, curtainTimer = null;
    history.replaceState({ ...history.state, reperaScreen: "welcome" }, "");
    const curtain = document.querySelector(".transition-curtain");
    function enter(event, fromHistory = false) {
        if (event) event.preventDefault();
        if (entering) return;
        if (welcome.hidden) { document.getElementById("vacuum-tools").focus(); return; }
        if (!fromHistory) history.pushState({ reperaScreen: "app" }, "");
        entering = true;
        welcome.classList.add("leaving");
        if (!reducedMotion.matches) curtain.classList.add("active");
        const finish = () => {
            welcome.hidden = true;
            welcome.classList.remove("leaving");
            app.hidden = false;
            visible = false;
            updateMotion();
            document.getElementById("vacuum-tools").focus({ preventScroll: true });
            window.scrollTo(0, 0);
            if (reducedMotion.matches) entering = false;
        };
        // Skip the transition if the visitor prefers less motion.
        if (reducedMotion.matches) finish();
        else {
            finishTimer = setTimeout(finish, 520);
            curtainTimer = setTimeout(() => { curtain.classList.remove("active"); entering = false; }, 1100);
        }
    }
    document.querySelectorAll('a[href="#vacuum-tools"]').forEach(link => link.addEventListener("click", enter));
    function showWelcome(event) {
        event?.preventDefault();
        if (entering) return;
        if (event && !app.hidden) history.pushState({ reperaScreen: "welcome" }, "");
        app.hidden = true;
        welcome.hidden = false;
        window.scrollTo(0, 0);
        document.getElementById("home-link").focus();
    }
    window.addEventListener("popstate", event => {
        // Back can arrive before the transition timers finish.
        clearTimeout(finishTimer); clearTimeout(curtainTimer);
        entering = false;
        curtain.classList.remove("active");
        welcome.classList.remove("leaving");
        if (event.state?.reperaScreen === "app") enter(null, true);
        else showWelcome();
    });
    document.getElementById("home-link").addEventListener("click", showWelcome);
})();
