// === Ch09 Dirichlet Characters — Extra Visualizations ===
// Loaded automatically by app.js as companion to ch09-dirichlet-characters.js
window.EXTRA_VIZ = window.EXTRA_VIZ || {};
window.EXTRA_VIZ['ch09'] = {
    // ================================================================
    // Section: sec-l-functions — Domain coloring gallery of L(s, chi)
    // ================================================================
    'sec-l-functions': [
        {
            id: 'viz-l-function-gallery',
            title: 'L-Function Gallery: Domain Coloring',
            description: 'Domain coloring of L(s, chi) for the four characters mod 5. Color encodes the argument of L(s, chi); brightness encodes the modulus. Zeros appear as points where all colors meet. The pole of L(s, chi_0) at s=1 appears as a bright singularity.',
            setup: function(body, controls) {
                var viz = new VizEngine(body, {
                    width: 560, height: 400,
                    originX: 280, originY: 200, scale: 80
                });

                var chiIdx = 0;
                var qVal = 5;
                var xRange = [-2, 4];
                var yRange = [-3, 3];
                var resolution = 2; // pixel step for speed

                function gcd(a, b) { while (b) { var t = b; b = a % b; a = t; } return a; }

                function getChiTable(q) {
                    var coprime = [];
                    for (var i = 1; i < q; i++) if (gcd(i, q) === 1) coprime.push(i);
                    var phi = coprime.length;
                    var order = {};
                    for (var j = 0; j < phi; j++) {
                        var g = coprime[j], o = 1, v = g % q;
                        while (v !== 1) { v = (v * g) % q; o++; }
                        order[g] = o;
                    }
                    var gen = null;
                    for (var k = 0; k < phi; k++) {
                        if (order[coprime[k]] === phi) { gen = coprime[k]; break; }
                    }
                    var chars = [];
                    if (gen) {
                        var dlogs = {};
                        var pw = 1;
                        for (var m = 0; m < phi; m++) { dlogs[pw] = m; pw = (pw * gen) % q; }
                        for (var c = 0; c < phi; c++) {
                            var chiVals = new Array(q);
                            for (var n = 0; n < q; n++) {
                                if (gcd(n, q) === 1) {
                                    var angle = 2 * Math.PI * c * dlogs[n % q] / phi;
                                    chiVals[n] = [Math.cos(angle), Math.sin(angle)];
                                } else {
                                    chiVals[n] = [0, 0];
                                }
                            }
                            chars.push(chiVals);
                        }
                    } else {
                        var cv0 = new Array(q);
                        for (var n2 = 0; n2 < q; n2++) cv0[n2] = gcd(n2, q) === 1 ? [1, 0] : [0, 0];
                        chars.push(cv0);
                    }
                    return chars;
                }

                var charTable = getChiTable(qVal);

                VizEngine.createSlider(controls, 'Character \u03C7', 0, 3, chiIdx, 1, function(v) {
                    chiIdx = Math.round(v);
                    if (chiIdx >= charTable.length) chiIdx = charTable.length - 1;
                    draw();
                });

                // Compute L(s, chi) via partial sums
                function computeL(sRe, sIm, chi, N) {
                    var sumRe = 0, sumIm = 0;
                    for (var n = 1; n <= N; n++) {
                        var cv = chi[n % qVal];
                        if (cv[0] === 0 && cv[1] === 0) continue;
                        // n^(-s) = exp(-s * log n)
                        var logn = Math.log(n);
                        var mag = Math.exp(-sRe * logn);
                        var phase = -sIm * logn;
                        var nRe = mag * Math.cos(phase);
                        var nIm = mag * Math.sin(phase);
                        // chi(n) * n^(-s)
                        sumRe += cv[0] * nRe - cv[1] * nIm;
                        sumIm += cv[0] * nIm + cv[1] * nRe;
                    }
                    return [sumRe, sumIm];
                }

                function draw() {
                    var ctx = viz.ctx;
                    var pw = viz.canvas.width;
                    var ph = viz.canvas.height;
                    var dpr = window.devicePixelRatio || 1;
                    var chi = charTable[chiIdx];

                    // Use domain coloring
                    ctx.save();
                    ctx.setTransform(1, 0, 0, 1, 0, 0);
                    var imgData = ctx.createImageData(pw, ph);
                    var data = imgData.data;

                    var N = 60; // partial sum terms (balance speed vs accuracy)

                    for (var py = 0; py < ph; py += resolution) {
                        for (var px = 0; px < pw; px += resolution) {
                            var re = xRange[0] + (xRange[1] - xRange[0]) * px / pw;
                            var im = yRange[1] - (yRange[1] - yRange[0]) * py / ph;

                            var val = computeL(re, im, chi, N);
                            var arg = Math.atan2(val[1], val[0]);
                            var mag2 = Math.sqrt(val[0] * val[0] + val[1] * val[1]);
                            var hue = (arg / Math.PI + 1) / 2;
                            var sat = 0.85;
                            var light = 1 - 1 / (1 + mag2 * 0.3);
                            var rgb = VizEngine.hslToRgb(hue, sat, light);

                            for (var dy = 0; dy < resolution && py + dy < ph; dy++) {
                                for (var dx = 0; dx < resolution && px + dx < pw; dx++) {
                                    var idx = ((py + dy) * pw + (px + dx)) * 4;
                                    data[idx] = rgb[0];
                                    data[idx + 1] = rgb[1];
                                    data[idx + 2] = rgb[2];
                                    data[idx + 3] = 255;
                                }
                            }
                        }
                    }
                    ctx.putImageData(imgData, 0, 0);
                    ctx.restore();

                    // Draw axes overlay
                    var ctx2 = viz.ctx;

                    // Re(s)=1 line (critical for pole/non-vanishing)
                    var sx1 = (1 - xRange[0]) / (xRange[1] - xRange[0]) * viz.width;
                    ctx2.strokeStyle = 'rgba(255,255,255,0.3)';
                    ctx2.lineWidth = 1;
                    ctx2.setLineDash([4, 4]);
                    ctx2.beginPath();
                    ctx2.moveTo(sx1, 0);
                    ctx2.lineTo(sx1, viz.height);
                    ctx2.stroke();
                    ctx2.setLineDash([]);

                    // Re(s)=1/2 line (critical line)
                    var sxHalf = (0.5 - xRange[0]) / (xRange[1] - xRange[0]) * viz.width;
                    ctx2.strokeStyle = 'rgba(255,200,100,0.3)';
                    ctx2.setLineDash([4, 4]);
                    ctx2.beginPath();
                    ctx2.moveTo(sxHalf, 0);
                    ctx2.lineTo(sxHalf, viz.height);
                    ctx2.stroke();
                    ctx2.setLineDash([]);

                    // Real axis
                    var syAxis = (yRange[1]) / (yRange[1] - yRange[0]) * viz.height;
                    ctx2.strokeStyle = 'rgba(255,255,255,0.2)';
                    ctx2.lineWidth = 1;
                    ctx2.beginPath();
                    ctx2.moveTo(0, syAxis);
                    ctx2.lineTo(viz.width, syAxis);
                    ctx2.stroke();

                    // Labels
                    var labelColor = 'rgba(255,255,255,0.7)';
                    viz.screenText('L(s, \u03C7_' + chiIdx + ') mod ' + qVal, viz.width / 2, 16, labelColor, 14);
                    viz.screenText('Re(s)=1', sx1 + 4, 32, 'rgba(255,255,255,0.5)', 10, 'left');
                    viz.screenText('Re(s)=\u00BD', sxHalf + 4, 32, 'rgba(255,200,100,0.5)', 10, 'left');

                    if (chiIdx === 0) {
                        viz.screenText('Pole at s=1', sx1 + 4, syAxis - 10, 'rgba(255,100,100,0.8)', 10, 'left');
                    }

                    // Axis ticks
                    ctx2.fillStyle = labelColor;
                    ctx2.font = '9px -apple-system,sans-serif';
                    ctx2.textAlign = 'center';
                    ctx2.textBaseline = 'top';
                    for (var x = Math.ceil(xRange[0]); x <= Math.floor(xRange[1]); x++) {
                        var tx = (x - xRange[0]) / (xRange[1] - xRange[0]) * viz.width;
                        ctx2.fillText(x, tx, syAxis + 2);
                    }
                }
                draw();
                return viz;
            }
        }
    ],

    // ================================================================
    // Section: sec-orthogonality — Orthogonality demo
    // ================================================================
    'sec-orthogonality': [
        {
            id: 'viz-orthogonality-demo',
            title: 'Orthogonality in Action',
            description: 'Visualize the first orthogonality relation. For each character chi mod q, the sum of chi(n) over a complete period is displayed as a vector sum on the complex plane. Non-trivial characters produce perfect cancellation; the principal character sums to phi(q).',
            setup: function(body, controls) {
                var viz = new VizEngine(body, {
                    width: 560, height: 400,
                    originX: 200, originY: 200, scale: 40
                });

                var qVal = 7;
                var chiIdx = 0;

                function gcd(a, b) { while (b) { var t = b; b = a % b; a = t; } return a; }

                function getCharsModQ(q) {
                    var coprime = [];
                    for (var i = 1; i < q; i++) if (gcd(i, q) === 1) coprime.push(i);
                    var phi = coprime.length;
                    var order = {};
                    for (var j = 0; j < phi; j++) {
                        var g = coprime[j], o = 1, v = g % q;
                        while (v !== 1) { v = (v * g) % q; o++; }
                        order[g] = o;
                    }
                    var gen = null;
                    for (var k = 0; k < phi; k++) {
                        if (order[coprime[k]] === phi) { gen = coprime[k]; break; }
                    }
                    var chars = [];
                    if (gen) {
                        var dlogs = {};
                        var pw = 1;
                        for (var m = 0; m < phi; m++) { dlogs[pw] = m; pw = (pw * gen) % q; }
                        for (var c = 0; c < phi; c++) {
                            var chi = {};
                            for (var n = 0; n < q; n++) {
                                if (gcd(n, q) === 1) {
                                    var angle = 2 * Math.PI * c * dlogs[n % q] / phi;
                                    chi[n] = [Math.cos(angle), Math.sin(angle)];
                                } else {
                                    chi[n] = [0, 0];
                                }
                            }
                            chars.push(chi);
                        }
                    } else {
                        var chi0 = {};
                        for (var n2 = 0; n2 < q; n2++) chi0[n2] = gcd(n2, q) === 1 ? [1, 0] : [0, 0];
                        chars.push(chi0);
                    }
                    return chars;
                }

                var allChars = getCharsModQ(qVal);

                VizEngine.createSlider(controls, 'q', 3, 11, qVal, 1, function(v) {
                    qVal = Math.round(v);
                    allChars = getCharsModQ(qVal);
                    chiIdx = Math.min(chiIdx, allChars.length - 1);
                    draw();
                });
                VizEngine.createSlider(controls, 'Character \u03C7', 0, 10, chiIdx, 1, function(v) {
                    chiIdx = Math.min(Math.round(v), allChars.length - 1);
                    draw();
                });

                function draw() {
                    viz.clear();
                    var ctx = viz.ctx;
                    var chi = allChars[chiIdx];

                    viz.drawSegment(-6, 0, 6, 0, viz.colors.grid, 0.5);
                    viz.drawSegment(0, -6, 0, 6, viz.colors.grid, 0.5);

                    viz.screenText('Sum of \u03C7_' + chiIdx + '(n) for n = 1 to ' + qVal, viz.width / 2, 18, viz.colors.white, 14);

                    // Draw each chi(n) as a vector, head-to-tail
                    var curRe = 0, curIm = 0;
                    var colors = [viz.colors.blue, viz.colors.teal, viz.colors.orange, viz.colors.purple,
                                  viz.colors.green, viz.colors.red, viz.colors.yellow, viz.colors.pink,
                                  viz.colors.blue, viz.colors.teal, viz.colors.orange, viz.colors.purple];

                    for (var n = 1; n <= qVal; n++) {
                        var val = chi[n % qVal] || [0, 0];
                        if (val[0] === 0 && val[1] === 0) continue;
                        var nextRe = curRe + val[0];
                        var nextIm = curIm + val[1];
                        var col = colors[(n - 1) % colors.length];

                        // Draw arrow
                        var [sx1, sy1] = viz.toScreen(curRe, curIm);
                        var [sx2, sy2] = viz.toScreen(nextRe, nextIm);
                        ctx.strokeStyle = col;
                        ctx.lineWidth = 2.5;
                        ctx.beginPath();
                        ctx.moveTo(sx1, sy1);
                        ctx.lineTo(sx2, sy2);
                        ctx.stroke();

                        // Arrowhead
                        var dx = sx2 - sx1, dy = sy2 - sy1;
                        var len = Math.sqrt(dx * dx + dy * dy);
                        if (len > 5) {
                            var angle = Math.atan2(dy, dx);
                            ctx.fillStyle = col;
                            ctx.beginPath();
                            ctx.moveTo(sx2, sy2);
                            ctx.lineTo(sx2 - 8 * Math.cos(angle - 0.4), sy2 - 8 * Math.sin(angle - 0.4));
                            ctx.lineTo(sx2 - 8 * Math.cos(angle + 0.4), sy2 - 8 * Math.sin(angle + 0.4));
                            ctx.closePath();
                            ctx.fill();
                        }

                        // Label
                        var midx = (sx1 + sx2) / 2, midy = (sy1 + sy2) / 2;
                        var nx = -(sy2 - sy1), ny = sx2 - sx1;
                        var nlen = Math.sqrt(nx * nx + ny * ny) || 1;
                        ctx.fillStyle = col;
                        ctx.font = '10px -apple-system,sans-serif';
                        ctx.textAlign = 'center';
                        ctx.textBaseline = 'middle';
                        ctx.fillText(n.toString(), midx + nx / nlen * 14, midy + ny / nlen * 14);

                        curRe = nextRe;
                        curIm = nextIm;
                    }

                    // Final sum point
                    var sumMag = Math.sqrt(curRe * curRe + curIm * curIm);
                    viz.drawPoint(curRe, curIm, viz.colors.orange, null, 6);
                    viz.drawPoint(0, 0, viz.colors.white, 'O', 3);

                    // Info panel on right
                    var infoX = 400;
                    var infoY = 60;
                    ctx.fillStyle = viz.colors.white;
                    ctx.font = '12px -apple-system,sans-serif';
                    ctx.textAlign = 'left';
                    ctx.textBaseline = 'top';
                    ctx.fillText('Sum = ' + curRe.toFixed(3) + ' + ' + curIm.toFixed(3) + 'i', infoX, infoY);
                    ctx.fillText('|Sum| = ' + sumMag.toFixed(4), infoX, infoY + 18);

                    var phi = allChars.length;
                    if (chiIdx === 0) {
                        ctx.fillStyle = viz.colors.teal;
                        ctx.fillText('= \u03C6(' + qVal + ') = ' + phi, infoX, infoY + 40);
                        ctx.fillText('Principal character:', infoX, infoY + 58);
                        ctx.fillText('all arrows point right', infoX, infoY + 74);
                    } else {
                        ctx.fillStyle = sumMag < 0.01 ? viz.colors.green : viz.colors.red;
                        ctx.fillText(sumMag < 0.01 ? 'Perfect cancellation!' : 'Sum \u2260 0 (non-complete period?)', infoX, infoY + 40);
                        ctx.fillStyle = viz.colors.text;
                        ctx.fillText('Non-trivial character:', infoX, infoY + 58);
                        ctx.fillText('arrows form a closed polygon', infoX, infoY + 74);
                    }
                }
                draw();
                return viz;
            }
        }
    ]
};
