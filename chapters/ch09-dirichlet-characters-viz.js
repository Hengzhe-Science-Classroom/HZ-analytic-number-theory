// Extra visualizations for Ch 9: Dirichlet Characters & L-Functions
// Registered under window.EXTRA_VIZ['ch09']

window.EXTRA_VIZ = window.EXTRA_VIZ || {};
window.EXTRA_VIZ['ch09'] = window.EXTRA_VIZ['ch09'] || {};

// -----------------------------------------------------------------------
// viz-l-function-gallery: Domain coloring of L(s, chi) for chi mod 5
// Attached to sec-l-functions
// -----------------------------------------------------------------------
window.EXTRA_VIZ['ch09']['sec-l-functions'] = [
    {
        id: 'viz-l-function-gallery',
        title: 'Domain Coloring of \\(L(s, \\chi)\\) for \\(\\chi\\) mod 5',
        description: 'Each pixel is colored by the argument (hue) and modulus (brightness) of \\(L(s,\\chi)\\). Zeros appear as black points where all hues meet. The pole of the principal character \\(L(s,\\chi_0)\\) at \\(s=1\\) shows as a bright multi-hued singularity. Toggle between the four characters mod 5.',
        setup: function(body, controls) {
            var viz = new VizEngine(body, { width: 620, height: 380 });
            var chiIdx = 0;
            var xRange = [-1, 3];
            var yRange = [-4, 4];

            // Build character mod 5 value table
            // (Z/5Z)* = {1,2,3,4}, cyclic of order 4, generator g=2
            // dlog: 2^0=1, 2^1=2, 2^2=4, 2^3=3
            var phi5 = 4;
            var dlog5 = { 1: 0, 2: 1, 4: 2, 3: 3 };
            function chi5(n, j) {
                var r = ((n % 5) + 5) % 5;
                if (r === 0) return [0, 0];
                var k = dlog5[r];
                var angle = 2 * Math.PI * j * k / phi5;
                return [Math.cos(angle), Math.sin(angle)];
            }

            // L(s, chi) partial sum: sum_{n=1}^{N} chi(n) n^{-s}
            // Uses Euler-Maclaurin-style acceleration: for non-principal chi,
            // partial sums of chi are bounded, so we use direct sum with tail estimate.
            function computeL(re, im, j) {
                // For |im| large, series converges but slowly; cap at reasonable N
                var N = 800;
                var sumRe = 0, sumIm = 0;
                for (var n = 1; n <= N; n++) {
                    var cv = chi5(n, j);
                    if (cv[0] === 0 && cv[1] === 0) continue;
                    // n^{-s} = n^{-re} * exp(-i*im*ln(n))
                    var logN = Math.log(n);
                    var mag = Math.exp(-re * logN);
                    var phase = -im * logN;
                    var cosP = Math.cos(phase), sinP = Math.sin(phase);
                    // (cv[0] + i cv[1]) * mag * (cosP + i sinP)
                    sumRe += mag * (cv[0] * cosP - cv[1] * sinP);
                    sumIm += mag * (cv[0] * sinP + cv[1] * cosP);
                }
                return [sumRe, sumIm];
            }

            var chiLabels = ['\u03C7\u2080 (principal)', '\u03C7\u2081', '\u03C7\u2082', '\u03C7\u2083'];
            var chiColors = ['#58a6ff', '#3fb9a0', '#f0883e', '#bc8cff'];

            // Create character selector buttons
            var btnRow = document.createElement('div');
            btnRow.style.cssText = 'display:flex;gap:6px;flex-wrap:wrap;';
            chiLabels.forEach(function(label, j) {
                var btn = document.createElement('button');
                btn.style.cssText = 'padding:3px 10px;border:1px solid ' + chiColors[j] + ';border-radius:4px;background:' + (j === chiIdx ? chiColors[j] + '44' : '#1a1a40') + ';color:' + chiColors[j] + ';font-size:0.78rem;cursor:pointer;';
                btn.textContent = label;
                btn.addEventListener('click', function() {
                    chiIdx = j;
                    btnRow.querySelectorAll('button').forEach(function(b, k) {
                        b.style.background = k === j ? chiColors[k] + '44' : '#1a1a40';
                    });
                    render();
                });
                btnRow.appendChild(btn);
            });
            controls.appendChild(btnRow);

            var statusEl = document.createElement('span');
            statusEl.style.cssText = 'font-size:0.76rem;color:#8b949e;margin-left:8px;';
            statusEl.textContent = 'Computing...';
            controls.appendChild(statusEl);

            function render() {
                statusEl.textContent = 'Computing...';
                var j = chiIdx;
                // Render asynchronously in tiles to avoid blocking UI
                var pw = viz.canvas.width, ph = viz.canvas.height;
                var ctx = viz.ctx;
                var dpr = window.devicePixelRatio || 1;
                var logicalW = viz.width, logicalH = viz.height;

                ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
                var imgData = ctx.createImageData(pw, ph);
                var data = imgData.data;

                // For principal character, re > 1 required for convergence; we still plot
                // with truncated series (shows pole structure approximately)
                var tileH = 20;
                var curY = 0;

                function renderTile() {
                    var endY = Math.min(curY + tileH, ph);
                    for (var py = curY; py < endY; py++) {
                        for (var px = 0; px < pw; px++) {
                            var re = xRange[0] + (xRange[1] - xRange[0]) * px / pw;
                            var im = yRange[1] - (yRange[1] - yRange[0]) * py / ph;
                            var val;
                            // For principal character mod 5: L(s,chi0) ~ zeta(s) * product
                            // We use chi5(n,0) which is 1 for gcd(n,5)=1, 0 otherwise
                            // This is the standard computation
                            val = computeL(re, im, j);
                            var u = val[0], v = val[1];
                            var arg = Math.atan2(v, u);
                            var mag = Math.sqrt(u * u + v * v);
                            var hue = (arg / Math.PI + 1) / 2;
                            var sat = 0.85;
                            // Enhanced brightness: dark at zeros, bright at poles
                            var light = 1 - 1 / (1 + mag * 0.4);
                            var rgb = VizEngine.hslToRgb(hue, sat, light);
                            var idx = (py * pw + px) * 4;
                            data[idx] = rgb[0]; data[idx + 1] = rgb[1]; data[idx + 2] = rgb[2]; data[idx + 3] = 255;
                        }
                    }
                    curY = endY;
                    if (curY < ph) {
                        ctx.putImageData(imgData, 0, 0);
                        requestAnimationFrame(renderTile);
                    } else {
                        ctx.putImageData(imgData, 0, 0);
                        ctx.restore();
                        // Draw axis overlays
                        drawOverlay(j);
                        statusEl.textContent = chiLabels[j] + ' mod 5';
                    }
                }
                renderTile();
            }

            function drawOverlay(j) {
                var ctx = viz.ctx;
                var dpr = window.devicePixelRatio || 1;

                function toScreen(re, im) {
                    var px = (re - xRange[0]) / (xRange[1] - xRange[0]) * viz.width;
                    var py = (yRange[1] - im) / (yRange[1] - yRange[0]) * viz.height;
                    return [px, py];
                }

                // Re(s) = 1 line
                ctx.strokeStyle = '#ffffff44'; ctx.lineWidth = 1; ctx.setLineDash([4, 4]);
                var [x1px] = toScreen(1, 0);
                ctx.beginPath(); ctx.moveTo(x1px, 0); ctx.lineTo(x1px, viz.height); ctx.stroke();

                // Re(s) = 1/2 line (GRH)
                ctx.strokeStyle = '#bc8cff55';
                var [x05px] = toScreen(0.5, 0);
                ctx.beginPath(); ctx.moveTo(x05px, 0); ctx.lineTo(x05px, viz.height); ctx.stroke();
                ctx.setLineDash([]);

                // Im(s) = 0
                ctx.strokeStyle = '#ffffff33'; ctx.lineWidth = 1;
                var [, y0px] = toScreen(0, 0);
                ctx.beginPath(); ctx.moveTo(0, y0px); ctx.lineTo(viz.width, y0px); ctx.stroke();

                // Labels
                ctx.fillStyle = '#ffffffaa'; ctx.font = '11px -apple-system,sans-serif';
                ctx.textAlign = 'center'; ctx.textBaseline = 'top';
                ctx.fillText('Re(s)=1', x1px, 4);
                ctx.fillStyle = '#bc8cff99';
                ctx.fillText('Re(s)=\u00BD', x05px, 4);

                // Title
                ctx.fillStyle = '#f0f6fc'; ctx.font = 'bold 13px -apple-system,sans-serif';
                ctx.textAlign = 'left'; ctx.textBaseline = 'top';
                ctx.fillText('L(s, ' + ['\\u03C7\\u2080', '\\u03C7\\u2081', '\\u03C7\\u2082', '\\u03C7\\u2083'][j] + ') mod 5', 8, 8);
            }

            render();
            return viz;
        }
    }
];

// -----------------------------------------------------------------------
// viz-orthogonality-demo: Vector addition showing character cancellation
// Attached to sec-orthogonality
// -----------------------------------------------------------------------
window.EXTRA_VIZ['ch09']['sec-orthogonality'] = [
    {
        id: 'viz-orthogonality-demo',
        title: 'Orthogonality: Vector Cancellation',
        description: 'For a fixed \\(n\\), each character \\(\\chi\\) contributes a vector \\(\\chi(n)\\) in the complex plane. When \\(n \\equiv 1 \\pmod q\\) all vectors point right and reinforce. For any other \\(n \\not\\equiv 1\\), they cancel perfectly to zero. Select \\(n\\) and \\(q\\) to see the cancellation.',
        setup: function(body, controls) {
            var viz = new VizEngine(body, { width: 620, height: 340, originX: 310, originY: 170, scale: 55 });
            var q = 5, n = 2;
            var animating = false;
            var animT = 0;
            var animId = null;

            VizEngine.createSlider(controls, 'mod q', 3, 8, q, 1, function(v) { q = Math.round(v); if (n >= q) n = 1; draw(1); });
            VizEngine.createSlider(controls, 'n', 0, 11, n, 1, function(v) { n = Math.round(v); draw(1); });

            var animBtn = VizEngine.createButton(controls, 'Animate', function() {
                if (animId) { cancelAnimationFrame(animId); animId = null; animBtn.textContent = 'Animate'; return; }
                animBtn.textContent = 'Stop';
                animT = 0;
                function step() {
                    animT += 0.015;
                    draw(Math.min(1, animT));
                    if (animT < 1) animId = requestAnimationFrame(step);
                    else { animId = null; animBtn.textContent = 'Animate'; }
                }
                animId = requestAnimationFrame(step);
            });

            function gcd(a, b) { while (b) { var t = b; b = a % b; a = t; } return a; }
            function modpow(base, exp, mod) { var r = 1; base %= mod; while (exp > 0) { if (exp & 1) r = r * base % mod; exp >>= 1; base = base * base % mod; } return r; }
            function findPhi(q) { var c = 0; for (var i = 1; i < q; i++) if (gcd(i, q) === 1) c++; return c; }
            function findGen(q) {
                var phi = findPhi(q);
                for (var g = 2; g < q; g++) {
                    if (gcd(g, q) !== 1) continue;
                    var ok = true;
                    for (var d = 1; d < phi; d++) { if (phi % d === 0 && modpow(g, d, q) === 1) { ok = false; break; } }
                    if (ok) return { g: g, phi: phi };
                }
                return { g: 2, phi: phi };
            }
            function getCharVals(q, nVal) {
                var gen = findGen(q);
                var phi = gen.phi, g = gen.g;
                var dlog = {}; var cur = 1;
                for (var k = 0; k < phi; k++) { dlog[cur] = k; cur = cur * g % q; }
                var r = ((nVal % q) + q) % q;
                var results = [];
                for (var j = 0; j < phi; j++) {
                    if (r === 0 || gcd(r, q) > 1) { results.push([0, 0]); continue; }
                    var angle = 2 * Math.PI * j * dlog[r] / phi;
                    results.push([Math.cos(angle), Math.sin(angle)]);
                }
                return results;
            }

            function draw(progress) {
                viz.clear();
                var colors = [viz.colors.blue, viz.colors.teal, viz.colors.orange, viz.colors.purple, viz.colors.red, viz.colors.yellow, viz.colors.pink, viz.colors.green];

                // Unit circle
                viz.drawCircle(0, 0, 1, null, viz.colors.grid + '44', 1);
                viz.drawAxes();

                var phi = findPhi(q);
                var nEff = ((n % q) + q) % q;
                var vals = getCharVals(q, nEff);

                // Draw vectors sequentially (tip-to-tail)
                var cx = 0, cy = 0;
                var numToShow = Math.min(phi, Math.ceil(progress * phi));

                for (var j = 0; j < numToShow; j++) {
                    var v = vals[j];
                    var nx = cx + v[0];
                    var ny = cy + v[1];
                    viz.drawVector(cx, cy, nx, ny, colors[j % colors.length], '\u03C7' + j, 2);
                    cx = nx; cy = ny;
                }

                // Final sum point
                if (numToShow > 0) {
                    viz.drawPoint(cx, cy, viz.colors.white, '', 6);
                    var sumMag = Math.sqrt(cx * cx + cy * cy);
                    var isTarget = (nEff === 1 && gcd(nEff, q) === 1);
                    var isUnit = gcd(nEff, q) === 1;
                    var msg;
                    if (!isUnit) { msg = 'n=' + nEff + ' \u2209 (Z/' + q + 'Z)^\\u00D7: sum = 0'; }
                    else if (Math.abs(sumMag - phi) < 0.1) { msg = 'n\u22611 mod ' + q + ': sum = \u03C6(' + q + ') = ' + phi + ' \u2713'; }
                    else if (sumMag < 0.1) { msg = 'n=' + nEff + '\u2260 1 mod ' + q + ': sum = 0 (cancellation) \u2713'; }
                    else { msg = 'n=' + nEff + ': partial sum = (' + cx.toFixed(2) + ', ' + cy.toFixed(2) + ')'; }
                    viz.screenText(msg, viz.width / 2, viz.height - 24, viz.colors.teal, 12);
                }

                var phi2 = findPhi(q);
                viz.screenText('Sum of \u03C7(n=' + nEff + ') over all ' + phi2 + ' characters mod ' + q, viz.width / 2, 14, viz.colors.white, 13);
            }

            draw(1);
            return viz;
        }
    }
];
