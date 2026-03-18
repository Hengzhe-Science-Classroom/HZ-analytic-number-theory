// === Ch06 Zero-Free Regions — Extra Visualizations ===
// Registered via window.EXTRA_VIZ['ch06'] for lazy loading by app.js

window.EXTRA_VIZ = window.EXTRA_VIZ || {};
window.EXTRA_VIZ['ch06'] = {
    // Section: The Classical Zero-Free Region
    'sec-classical-region': [
        {
            id: 'viz-zero-free-region',
            title: 'Zero-Free Region Heatmap',
            description: 'A heatmap of |zeta(s)| in the critical strip, with the classical and Vinogradov-Korobov zero-free region boundaries overlaid. Dark regions show where |zeta| is small (near zeros). The green curve is the classical boundary, the blue curve is Vinogradov-Korobov.',
            setup: function(body, controls) {
                var viz = new VizEngine(body, {
                    width: 560, height: 420,
                    originX: 0, originY: 0, scale: 1
                });

                // Parameters
                var xRange = [-0.5, 2.0];
                var yRange = [0, 50];
                var resolution = 2; // pixel skip for speed

                var showVK = true;
                VizEngine.createButton(controls, 'Toggle VK boundary', function() {
                    showVK = !showVK;
                    draw();
                });

                // Approximate |zeta(sigma + it)| using partial Euler product
                function zetaMag(sigma, t) {
                    if (sigma > 1.5 && Math.abs(t) < 1) return 1 / (sigma - 1);
                    // Dirichlet series approximation
                    var reS = 0, imS = 0;
                    var N = 80;
                    for (var n = 1; n <= N; n++) {
                        var mag = Math.pow(n, -sigma);
                        var angle = -t * Math.log(n);
                        reS += mag * Math.cos(angle);
                        imS += mag * Math.sin(angle);
                    }
                    return Math.sqrt(reS * reS + imS * imS);
                }

                function draw() {
                    var ctx = viz.ctx;
                    var pw = viz.width;
                    var ph = viz.height;
                    var plotL = 60;
                    var plotR = pw - 20;
                    var plotT = 30;
                    var plotB = ph - 40;
                    var plotW = plotR - plotL;
                    var plotH = plotB - plotT;

                    viz.clear();

                    // Draw heatmap in plot area
                    var imgData = ctx.createImageData(plotW, plotH);
                    var data = imgData.data;

                    for (var py = 0; py < plotH; py += resolution) {
                        for (var px = 0; px < plotW; px += resolution) {
                            var sigma = xRange[0] + (xRange[1] - xRange[0]) * px / plotW;
                            var t = yRange[1] - (yRange[1] - yRange[0]) * py / plotH;
                            var mag = zetaMag(sigma, t);
                            var logMag = Math.log(mag + 0.01);
                            var normalized = Math.max(0, Math.min(1, (logMag + 2) / 6));

                            var r, g, b;
                            // Custom colormap: dark blue (small) -> yellow (large)
                            if (normalized < 0.25) {
                                r = Math.round(10 + normalized * 4 * 30);
                                g = Math.round(10 + normalized * 4 * 20);
                                b = Math.round(40 + normalized * 4 * 100);
                            } else if (normalized < 0.5) {
                                var t2 = (normalized - 0.25) * 4;
                                r = Math.round(40 + t2 * 60);
                                g = Math.round(30 + t2 * 80);
                                b = Math.round(140 - t2 * 40);
                            } else if (normalized < 0.75) {
                                var t3 = (normalized - 0.5) * 4;
                                r = Math.round(100 + t3 * 100);
                                g = Math.round(110 + t3 * 80);
                                b = Math.round(100 - t3 * 60);
                            } else {
                                var t4 = (normalized - 0.75) * 4;
                                r = Math.round(200 + t4 * 55);
                                g = Math.round(190 + t4 * 40);
                                b = Math.round(40 + t4 * 30);
                            }

                            // Fill resolution x resolution block
                            for (var dy = 0; dy < resolution && py + dy < plotH; dy++) {
                                for (var dx = 0; dx < resolution && px + dx < plotW; dx++) {
                                    var idx = ((py + dy) * plotW + (px + dx)) * 4;
                                    data[idx] = r;
                                    data[idx + 1] = g;
                                    data[idx + 2] = b;
                                    data[idx + 3] = 255;
                                }
                            }
                        }
                    }
                    ctx.putImageData(imgData, plotL, plotT);

                    // Overlay: Re(s)=1 line
                    var oneX = plotL + (1 - xRange[0]) / (xRange[1] - xRange[0]) * plotW;
                    ctx.strokeStyle = '#f85149'; ctx.lineWidth = 1.5;
                    ctx.beginPath(); ctx.moveTo(oneX, plotT); ctx.lineTo(oneX, plotB); ctx.stroke();

                    // Overlay: Re(s)=1/2 line
                    var halfX = plotL + (0.5 - xRange[0]) / (xRange[1] - xRange[0]) * plotW;
                    ctx.strokeStyle = '#3fb9a0'; ctx.lineWidth = 1;
                    ctx.setLineDash([4, 4]);
                    ctx.beginPath(); ctx.moveTo(halfX, plotT); ctx.lineTo(halfX, plotB); ctx.stroke();
                    ctx.setLineDash([]);

                    // Classical zero-free region boundary
                    var c_classical = 0.15;
                    ctx.strokeStyle = '#3fb950'; ctx.lineWidth = 2.5;
                    ctx.beginPath();
                    for (var py2 = 0; py2 < plotH; py2++) {
                        var t5 = yRange[1] - (yRange[1] - yRange[0]) * py2 / plotH;
                        var boundary = 1 - c_classical / Math.log(Math.max(t5, 2) + 2);
                        var bx = plotL + (boundary - xRange[0]) / (xRange[1] - xRange[0]) * plotW;
                        if (py2 === 0) ctx.moveTo(bx, plotT + py2);
                        else ctx.lineTo(bx, plotT + py2);
                    }
                    ctx.stroke();

                    // VK boundary
                    if (showVK) {
                        var c_vk = 0.5;
                        ctx.strokeStyle = '#58a6ff'; ctx.lineWidth = 2;
                        ctx.setLineDash([6, 3]);
                        ctx.beginPath();
                        for (var py3 = 0; py3 < plotH; py3++) {
                            var t6 = yRange[1] - (yRange[1] - yRange[0]) * py3 / plotH;
                            var logT = Math.log(Math.max(t6, 3) + 2);
                            var loglogT = Math.log(logT + 1);
                            var boundary2 = 1 - c_vk / (Math.pow(logT, 2/3) * Math.pow(loglogT, 1/3));
                            var bx2 = plotL + (boundary2 - xRange[0]) / (xRange[1] - xRange[0]) * plotW;
                            if (py3 === 0) ctx.moveTo(bx2, plotT + py3);
                            else ctx.lineTo(bx2, plotT + py3);
                        }
                        ctx.stroke();
                        ctx.setLineDash([]);
                    }

                    // Mark known zeros
                    var knownZeros = [14.1347, 21.0220, 25.0109, 30.4249, 32.9351,
                        37.5862, 40.9187, 43.3271, 48.0052, 49.7738];
                    for (var z = 0; z < knownZeros.length; z++) {
                        if (knownZeros[z] > yRange[1]) continue;
                        var zx = halfX;
                        var zy = plotT + (yRange[1] - knownZeros[z]) / (yRange[1] - yRange[0]) * plotH;
                        ctx.fillStyle = '#d29922';
                        ctx.beginPath(); ctx.arc(zx, zy, 4, 0, Math.PI * 2); ctx.fill();
                        ctx.strokeStyle = '#0c0c20'; ctx.lineWidth = 1;
                        ctx.beginPath(); ctx.arc(zx, zy, 4, 0, Math.PI * 2); ctx.stroke();
                    }

                    // Axes labels
                    ctx.fillStyle = '#8b949e'; ctx.font = '11px -apple-system,sans-serif';
                    ctx.textAlign = 'center'; ctx.textBaseline = 'top';
                    for (var sigma2 = 0; sigma2 <= 2; sigma2 += 0.5) {
                        var lx = plotL + (sigma2 - xRange[0]) / (xRange[1] - xRange[0]) * plotW;
                        ctx.fillText(sigma2.toFixed(1), lx, plotB + 5);
                    }
                    ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
                    for (var im = 0; im <= yRange[1]; im += 10) {
                        var ly = plotT + (yRange[1] - im) / (yRange[1] - yRange[0]) * plotH;
                        ctx.fillText(im.toString(), plotL - 5, ly);
                    }

                    // Axis titles
                    viz.screenText('\u03C3 = Re(s)', plotL + plotW / 2, ph - 8, '#8b949e', 12);
                    ctx.save();
                    ctx.translate(15, plotT + plotH / 2);
                    ctx.rotate(-Math.PI / 2);
                    ctx.fillStyle = '#8b949e'; ctx.font = '12px -apple-system,sans-serif';
                    ctx.textAlign = 'center'; ctx.fillText('t = Im(s)', 0, 0);
                    ctx.restore();

                    // Title
                    viz.screenText('|\u03B6(s)| in the Critical Strip', viz.width / 2, 14, '#f0f6fc', 14);

                    // Legend
                    var legX = plotR - 150;
                    var legY = plotT + 8;
                    ctx.font = '10px -apple-system,sans-serif'; ctx.textAlign = 'left';

                    ctx.strokeStyle = '#3fb950'; ctx.lineWidth = 2; ctx.setLineDash([]);
                    ctx.beginPath(); ctx.moveTo(legX, legY); ctx.lineTo(legX + 18, legY); ctx.stroke();
                    ctx.fillStyle = '#8b949e'; ctx.fillText('Classical', legX + 22, legY + 3);

                    if (showVK) {
                        ctx.strokeStyle = '#58a6ff'; ctx.lineWidth = 2; ctx.setLineDash([6, 3]);
                        ctx.beginPath(); ctx.moveTo(legX, legY + 16); ctx.lineTo(legX + 18, legY + 16); ctx.stroke();
                        ctx.setLineDash([]);
                        ctx.fillStyle = '#8b949e'; ctx.fillText('Vinogradov-Korobov', legX + 22, legY + 19);
                    }

                    ctx.fillStyle = '#d29922';
                    ctx.beginPath(); ctx.arc(legX + 5, legY + 32, 3, 0, Math.PI * 2); ctx.fill();
                    ctx.fillStyle = '#8b949e'; ctx.fillText('Known zeros', legX + 22, legY + 35);
                }

                draw();
                return viz;
            }
        }
    ],

    // Section: The Zero Landscape
    'sec-zero-landscape': [
        {
            id: 'viz-phase-portrait',
            title: 'Phase Portrait of \u03B6(s) Near Re(s) = 1',
            description: 'A phase portrait showing the direction of zeta(s) in the complex plane near Re(s) = 1. Colors encode the argument (phase) of zeta(s). The absence of color singularities confirms: no zeros near this line.',
            setup: function(body, controls) {
                var viz = new VizEngine(body, {
                    width: 560, height: 420,
                    originX: 0, originY: 0, scale: 1
                });

                var centerT = 20;
                VizEngine.createSlider(controls, 'Center Im(s)', 5, 45, centerT, 1, function(v) {
                    centerT = Math.round(v);
                    draw();
                });

                // Compute zeta via Dirichlet series
                function zetaComplex(sigma, t) {
                    var reS = 0, imS = 0;
                    var N = 60;
                    for (var n = 1; n <= N; n++) {
                        var mag = Math.pow(n, -sigma);
                        var angle = -t * Math.log(n);
                        reS += mag * Math.cos(angle);
                        imS += mag * Math.sin(angle);
                    }
                    return [reS, imS];
                }

                function draw() {
                    var ctx = viz.ctx;
                    var plotL = 60;
                    var plotR = viz.width - 20;
                    var plotT2 = 30;
                    var plotB = viz.height - 40;
                    var plotW = plotR - plotL;
                    var plotH = plotB - plotT2;

                    var sigmaMin = 0.3;
                    var sigmaMax = 1.7;
                    var tMin = centerT - 8;
                    var tMax = centerT + 8;

                    viz.clear();

                    // Domain coloring in plot area
                    var res = 2;
                    var imgData = ctx.createImageData(plotW, plotH);
                    var data = imgData.data;

                    for (var py = 0; py < plotH; py += res) {
                        for (var px = 0; px < plotW; px += res) {
                            var sigma = sigmaMin + (sigmaMax - sigmaMin) * px / plotW;
                            var t = tMax - (tMax - tMin) * py / plotH;

                            var z = zetaComplex(sigma, t);
                            var arg = Math.atan2(z[1], z[0]);
                            var magSq = z[0] * z[0] + z[1] * z[1];
                            var logMag = Math.log(Math.sqrt(magSq) + 0.001);

                            // Phase -> hue
                            var hue = (arg / Math.PI + 1) / 2;
                            // Brightness from magnitude
                            var light = 0.15 + 0.7 / (1 + Math.exp(-logMag * 0.5));
                            var sat = 0.85;

                            var rgb = VizEngine.hslToRgb(hue, sat, light);

                            for (var dy = 0; dy < res && py + dy < plotH; dy++) {
                                for (var dx = 0; dx < res && px + dx < plotW; dx++) {
                                    var idx = ((py + dy) * plotW + (px + dx)) * 4;
                                    data[idx] = rgb[0];
                                    data[idx + 1] = rgb[1];
                                    data[idx + 2] = rgb[2];
                                    data[idx + 3] = 255;
                                }
                            }
                        }
                    }
                    ctx.putImageData(imgData, plotL, plotT2);

                    // Overlay lines
                    // Re(s) = 1
                    var oneX = plotL + (1 - sigmaMin) / (sigmaMax - sigmaMin) * plotW;
                    ctx.strokeStyle = '#f8514988'; ctx.lineWidth = 2;
                    ctx.beginPath(); ctx.moveTo(oneX, plotT2); ctx.lineTo(oneX, plotB); ctx.stroke();

                    // Re(s) = 1/2
                    var halfX = plotL + (0.5 - sigmaMin) / (sigmaMax - sigmaMin) * plotW;
                    ctx.strokeStyle = '#3fb9a066'; ctx.lineWidth = 1;
                    ctx.setLineDash([4, 4]);
                    ctx.beginPath(); ctx.moveTo(halfX, plotT2); ctx.lineTo(halfX, plotB); ctx.stroke();
                    ctx.setLineDash([]);

                    // Mark known zeros if in range
                    var knownZeros = [14.1347, 21.0220, 25.0109, 30.4249, 32.9351,
                        37.5862, 40.9187, 43.3271, 48.0052, 49.7738];
                    for (var z = 0; z < knownZeros.length; z++) {
                        if (knownZeros[z] < tMin || knownZeros[z] > tMax) continue;
                        var zy = plotT2 + (tMax - knownZeros[z]) / (tMax - tMin) * plotH;
                        ctx.strokeStyle = '#d29922'; ctx.lineWidth = 2;
                        ctx.beginPath(); ctx.arc(halfX, zy, 6, 0, Math.PI * 2); ctx.stroke();
                        ctx.fillStyle = '#d2992244';
                        ctx.beginPath(); ctx.arc(halfX, zy, 6, 0, Math.PI * 2); ctx.fill();
                    }

                    // Axes labels
                    ctx.fillStyle = '#8b949e'; ctx.font = '10px -apple-system,sans-serif';
                    ctx.textAlign = 'center'; ctx.textBaseline = 'top';
                    for (var s = 0.5; s <= 1.5; s += 0.5) {
                        var lx = plotL + (s - sigmaMin) / (sigmaMax - sigmaMin) * plotW;
                        ctx.fillText('\u03C3=' + s.toFixed(1), lx, plotB + 5);
                    }
                    ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
                    var tStep = 4;
                    for (var tt = Math.ceil(tMin / tStep) * tStep; tt <= tMax; tt += tStep) {
                        var ly = plotT2 + (tMax - tt) / (tMax - tMin) * plotH;
                        ctx.fillText('t=' + tt, plotL - 5, ly);
                    }

                    // Title
                    viz.screenText('Phase Portrait: arg \u03B6(\u03C3 + it)', viz.width / 2, 14, '#f0f6fc', 14);

                    // Phase legend (color wheel)
                    var legCX = viz.width - 45;
                    var legCY = plotT2 + 40;
                    var legR = 18;
                    for (var a = 0; a < 360; a += 5) {
                        var aRad = a * Math.PI / 180;
                        var rgb2 = VizEngine.hslToRgb(a / 360, 0.85, 0.5);
                        ctx.fillStyle = 'rgb(' + rgb2[0] + ',' + rgb2[1] + ',' + rgb2[2] + ')';
                        ctx.beginPath();
                        ctx.moveTo(legCX, legCY);
                        ctx.arc(legCX, legCY, legR, aRad, aRad + 6 * Math.PI / 180);
                        ctx.closePath();
                        ctx.fill();
                    }
                    ctx.fillStyle = '#8b949e'; ctx.font = '9px -apple-system,sans-serif';
                    ctx.textAlign = 'center'; ctx.fillText('arg \u03B6', legCX, legCY + legR + 12);

                    // Note about zeros
                    viz.screenText(
                        'Color vortices = zeros (all on Re(s) = \u00BD)',
                        viz.width / 2, viz.height - 10, '#3fb9a0', 11
                    );
                }

                draw();
                return viz;
            }
        }
    ]
};
