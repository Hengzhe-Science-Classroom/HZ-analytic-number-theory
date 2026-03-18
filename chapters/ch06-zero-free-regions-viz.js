// === Chapter 6 Extra Visualizations: Zero-Free Regions ===
// Heatmap of |zeta(s)| and phase portrait near Re(s) = 1
// Registered under window.EXTRA_VIZ['ch06']

window.EXTRA_VIZ = window.EXTRA_VIZ || {};
window.EXTRA_VIZ['ch06'] = {

    // Attached to sec-classical-region (after the main viz)
    'sec-classical-region': [
        {
            id: 'viz-zero-free-region',
            title: 'Heatmap of |\\(\\zeta(s)\\)| with Zero-Free Boundary',
            description: 'Color encodes \\(\\log|\\zeta(\\sigma+it)|\\): dark = small (near zero), bright = large. The classical zero-free boundary \\(\\sigma = 1 - c/\\log t\\) is drawn in yellow. No zeros appear to the right of it. Use the slider to adjust the constant \\(c\\).',
            setup: function(body, controls) {
                var viz = new VizEngine(body, {
                    width: 560, height: 380,
                    originX: 0, originY: 0, scale: 1
                });

                var cVal = 0.04; // zero-free region constant (scaled for display)
                var slider = VizEngine.createSlider(controls, 'Boundary constant c', 0.01, 0.15, cVal, 0.005, function(v) {
                    cVal = v; drawAll();
                });

                // Range: sigma in [0.4, 1.1], t in [5, 60]
                var sigMin = 0.4, sigMax = 1.1;
                var tMin = 5, tMax = 60;

                // Compute partial sum approximation of zeta(sigma + it)
                function zetaLogMag(sigma, t) {
                    var re = 0, im = 0;
                    var N = 100;
                    for (var n = 1; n <= N; n++) {
                        var ns = Math.pow(n, -sigma);
                        re += ns * Math.cos(t * Math.log(n));
                        im -= ns * Math.sin(t * Math.log(n));
                    }
                    var mag2 = re * re + im * im;
                    return 0.5 * Math.log(Math.max(mag2, 1e-20));
                }

                function drawAll() {
                    viz.clear();

                    var pw = viz.canvas.width;
                    var ph = viz.canvas.height;
                    var ctx = viz.ctx;
                    var dpr = window.devicePixelRatio || 1;
                    var W = viz.width, H = viz.height;

                    // Reserve margins
                    var marginL = 50, marginR = 10, marginT = 20, marginB = 30;
                    var plotW = W - marginL - marginR;
                    var plotH = H - marginT - marginB;

                    // Heatmap: render at reduced resolution for performance
                    var heatW = Math.floor(plotW / 2);
                    var heatH = Math.floor(plotH / 2);

                    // Compute values
                    var values = [];
                    var vMin = Infinity, vMax = -Infinity;
                    for (var py = 0; py < heatH; py++) {
                        for (var px = 0; px < heatW; px++) {
                            var sigma = sigMin + (sigMax - sigMin) * px / heatW;
                            var t = tMax - (tMax - tMin) * py / heatH;
                            var v = zetaLogMag(sigma, t);
                            values.push(v);
                            if (isFinite(v)) { vMin = Math.min(vMin, v); vMax = Math.max(vMax, v); }
                        }
                    }
                    var range = vMax - vMin || 1;

                    // Create offscreen canvas for heatmap
                    var offCanvas = document.createElement('canvas');
                    offCanvas.width = heatW;
                    offCanvas.height = heatH;
                    var offCtx = offCanvas.getContext('2d');
                    var imgData = offCtx.createImageData(heatW, heatH);
                    var data = imgData.data;

                    for (var i = 0; i < heatW * heatH; i++) {
                        var val = values[i];
                        var t_norm = isFinite(val) ? Math.max(0, Math.min(1, (val - vMin) / range)) : 0;
                        // Custom colormap: dark blue (near zero) -> cyan -> yellow (large)
                        var r2, g2, b2;
                        if (t_norm < 0.3) {
                            // Dark blue to blue
                            var s2 = t_norm / 0.3;
                            r2 = Math.round(10 + 20 * s2);
                            g2 = Math.round(10 + 60 * s2);
                            b2 = Math.round(40 + 120 * s2);
                        } else if (t_norm < 0.6) {
                            var s2 = (t_norm - 0.3) / 0.3;
                            r2 = Math.round(30 + 60 * s2);
                            g2 = Math.round(70 + 100 * s2);
                            b2 = Math.round(160 - 60 * s2);
                        } else {
                            var s2 = (t_norm - 0.6) / 0.4;
                            r2 = Math.round(90 + 165 * s2);
                            g2 = Math.round(170 + 40 * s2);
                            b2 = Math.round(100 - 60 * s2);
                        }
                        data[i * 4] = r2; data[i * 4 + 1] = g2; data[i * 4 + 2] = b2; data[i * 4 + 3] = 255;
                    }
                    offCtx.putImageData(imgData, 0, 0);

                    // Draw scaled up to plot area
                    ctx.save();
                    ctx.imageSmoothingEnabled = true;
                    ctx.drawImage(offCanvas, marginL, marginT, plotW, plotH);
                    ctx.restore();

                    // Draw zero-free boundary: sigma = 1 - c/log(t)
                    ctx.strokeStyle = '#ffd700'; ctx.lineWidth = 2;
                    ctx.beginPath();
                    var started = false;
                    for (var ty = 0; ty < plotH; ty += 2) {
                        var t_val = tMax - (tMax - tMin) * ty / plotH;
                        var sig_bound = 1 - cVal / Math.log(Math.max(t_val, 1.1));
                        if (sig_bound < sigMin || sig_bound > sigMax) { started = false; continue; }
                        var sx = marginL + (sig_bound - sigMin) / (sigMax - sigMin) * plotW;
                        var sy = marginT + ty;
                        if (!started) { ctx.moveTo(sx, sy); started = true; } else { ctx.lineTo(sx, sy); }
                    }
                    ctx.stroke();

                    // Draw sigma=1 line
                    var sx1 = marginL + (1 - sigMin) / (sigMax - sigMin) * plotW;
                    ctx.strokeStyle = '#ffffff88'; ctx.lineWidth = 1.5; ctx.setLineDash([5, 4]);
                    ctx.beginPath(); ctx.moveTo(sx1, marginT); ctx.lineTo(sx1, marginT + plotH); ctx.stroke();
                    ctx.setLineDash([]);

                    // Axes
                    ctx.fillStyle = '#c9d1d9'; ctx.font = '10px sans-serif';

                    // Sigma axis (bottom)
                    ctx.strokeStyle = '#4a4a7a'; ctx.lineWidth = 1;
                    ctx.beginPath(); ctx.moveTo(marginL, marginT + plotH); ctx.lineTo(marginL + plotW, marginT + plotH); ctx.stroke();
                    ctx.textAlign = 'center';
                    var sigTicks = [0.5, 0.6, 0.7, 0.8, 0.9, 1.0];
                    for (var si = 0; si < sigTicks.length; si++) {
                        var sval = sigTicks[si];
                        var stx = marginL + (sval - sigMin) / (sigMax - sigMin) * plotW;
                        ctx.fillText(sval.toFixed(1), stx, marginT + plotH + 14);
                        ctx.strokeStyle = '#4a4a7a'; ctx.lineWidth = 1;
                        ctx.beginPath(); ctx.moveTo(stx, marginT + plotH); ctx.lineTo(stx, marginT + plotH + 4); ctx.stroke();
                    }
                    ctx.fillStyle = '#c9d1d9'; ctx.fillText('\u03C3', marginL + plotW + 5, marginT + plotH + 4);

                    // T axis (left)
                    ctx.strokeStyle = '#4a4a7a'; ctx.lineWidth = 1;
                    ctx.beginPath(); ctx.moveTo(marginL, marginT); ctx.lineTo(marginL, marginT + plotH); ctx.stroke();
                    ctx.textAlign = 'right';
                    var tTicks = [10, 20, 30, 40, 50, 60];
                    for (var ti = 0; ti < tTicks.length; ti++) {
                        var tval = tTicks[ti];
                        var sty = marginT + (tMax - tval) / (tMax - tMin) * plotH;
                        ctx.fillText(tval, marginL - 4, sty + 4);
                        ctx.strokeStyle = '#4a4a7a'; ctx.lineWidth = 1;
                        ctx.beginPath(); ctx.moveTo(marginL, sty); ctx.lineTo(marginL - 4, sty); ctx.stroke();
                    }
                    ctx.textAlign = 'left';
                    ctx.fillStyle = '#c9d1d9'; ctx.fillText('t', marginL - 16, marginT + 8);

                    // Labels
                    ctx.fillStyle = '#ffd700'; ctx.font = 'bold 11px sans-serif'; ctx.textAlign = 'left';
                    ctx.fillText('Zero-free boundary: \u03C3 = 1 \u2013 c/log t', marginL + 5, marginT + 15);
                    ctx.fillStyle = '#ffffff88'; ctx.font = '10px sans-serif';
                    ctx.fillText('\u03C3=1', sx1 + 3, marginT + 25);

                    // Color scale bar
                    var barX = marginL + plotW - 20, barY = marginT + 40, barH2 = 80;
                    for (var bi = 0; bi < barH2; bi++) {
                        var tn = 1 - bi / barH2;
                        var r3, g3, b3;
                        if (tn < 0.3) { var s3=tn/0.3; r3=10+20*s3; g3=10+60*s3; b3=40+120*s3; }
                        else if (tn < 0.6) { var s3=(tn-0.3)/0.3; r3=30+60*s3; g3=70+100*s3; b3=160-60*s3; }
                        else { var s3=(tn-0.6)/0.4; r3=90+165*s3; g3=170+40*s3; b3=100-60*s3; }
                        ctx.fillStyle = 'rgb('+Math.round(r3)+','+Math.round(g3)+','+Math.round(b3)+')';
                        ctx.fillRect(barX, barY + bi, 12, 1);
                    }
                    ctx.strokeStyle = '#4a4a7a'; ctx.lineWidth = 1;
                    ctx.strokeRect(barX, barY, 12, barH2);
                    ctx.fillStyle = '#c9d1d9'; ctx.font = '9px sans-serif'; ctx.textAlign = 'left';
                    ctx.fillText('large', barX + 15, barY + 8);
                    ctx.fillText('|\u03B6(s)|', barX + 15, barY + barH2/2 + 4);
                    ctx.fillText('small', barX + 15, barY + barH2 - 2);
                }

                drawAll();
                return viz;
            }
        }
    ],

    // Attached to sec-zero-landscape
    'sec-zero-landscape': [
        {
            id: 'viz-phase-portrait',
            title: 'Phase Portrait of \\(\\zeta(s)\\) near Re(s) = 1',
            description: 'Domain coloring of \\(\\zeta(s)\\) in the critical strip. Hue encodes the argument \\(\\arg(\\zeta(s))\\); brightness encodes \\(|\\zeta(s)|\\). Zeros appear as points where all colors meet. The line Re(s)=1 is marked. Drag the t-range slider to explore different heights.',
            setup: function(body, controls) {
                var viz = new VizEngine(body, {
                    width: 560, height: 380,
                    originX: 0, originY: 0, scale: 1
                });

                var tCenter = 21.0;
                var tHalf = 12;

                var slider = VizEngine.createSlider(controls, 'Center t', 5, 80, tCenter, 0.5, function(v) {
                    tCenter = v; scheduleDraw();
                });
                var halfSlider = VizEngine.createSlider(controls, 'Range ±', 5, 25, tHalf, 0.5, function(v) {
                    tHalf = v; scheduleDraw();
                });

                var drawTimer = null;
                function scheduleDraw() {
                    if (drawTimer) clearTimeout(drawTimer);
                    drawTimer = setTimeout(drawAll, 50);
                }

                // sigma in [0.2, 1.2], t in [tCenter-tHalf, tCenter+tHalf]
                var sigMin = 0.2, sigMax = 1.2;

                function zetaComplex(sigma, t) {
                    var re = 0, im = 0;
                    var N = 80;
                    for (var n = 1; n <= N; n++) {
                        var ns = Math.pow(n, -sigma);
                        var phase = t * Math.log(n);
                        re += ns * Math.cos(phase);
                        im -= ns * Math.sin(phase);
                    }
                    return [re, im];
                }

                function drawAll() {
                    viz.clear();
                    var ctx = viz.ctx;
                    var W = viz.width, H = viz.height;

                    var marginL = 50, marginR = 10, marginT = 20, marginB = 30;
                    var plotW = W - marginL - marginR;
                    var plotH = H - marginT - marginB;

                    var tMin = tCenter - tHalf;
                    var tMaxL = tCenter + tHalf;

                    // Domain coloring at reduced resolution
                    var heatW = Math.floor(plotW / 2);
                    var heatH = Math.floor(plotH / 2);

                    var offCanvas = document.createElement('canvas');
                    offCanvas.width = heatW;
                    offCanvas.height = heatH;
                    var offCtx = offCanvas.getContext('2d');
                    var imgData = offCtx.createImageData(heatW, heatH);
                    var data = imgData.data;

                    for (var py = 0; py < heatH; py++) {
                        for (var px = 0; px < heatW; px++) {
                            var sigma = sigMin + (sigMax - sigMin) * px / heatW;
                            var t = tMaxL - (tMaxL - tMin) * py / heatH;
                            var zv = zetaComplex(sigma, t);
                            var re2 = zv[0], im2 = zv[1];
                            var arg = Math.atan2(im2, re2);
                            var mag = Math.sqrt(re2 * re2 + im2 * im2);

                            // Hue from argument
                            var hue = (arg / Math.PI + 1) / 2;
                            // Lightness: map magnitude with log scale
                            var logmag = Math.log(1 + mag);
                            // Use checkerboard for magnitude rings
                            var rings = Math.floor(logmag * 2) % 2;
                            var light = 0.35 + (rings ? 0.25 : 0) + 0.1 * (logmag - Math.floor(logmag));
                            light = Math.max(0.15, Math.min(0.85, light));

                            var rgb = VizEngine.hslToRgb(hue, 0.85, light);
                            var idx = (py * heatW + px) * 4;
                            data[idx] = rgb[0]; data[idx+1] = rgb[1]; data[idx+2] = rgb[2]; data[idx+3] = 255;
                        }
                    }
                    offCtx.putImageData(imgData, 0, 0);

                    ctx.save();
                    ctx.imageSmoothingEnabled = true;
                    ctx.drawImage(offCanvas, marginL, marginT, plotW, plotH);
                    ctx.restore();

                    // Draw Re(s)=1 line
                    var sx1 = marginL + (1.0 - sigMin) / (sigMax - sigMin) * plotW;
                    ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 2;
                    ctx.beginPath(); ctx.moveTo(sx1, marginT); ctx.lineTo(sx1, marginT + plotH); ctx.stroke();

                    // Draw Re(s)=0.5 line
                    var sx05 = marginL + (0.5 - sigMin) / (sigMax - sigMin) * plotW;
                    ctx.strokeStyle = '#ffffff88'; ctx.lineWidth = 1; ctx.setLineDash([4, 3]);
                    ctx.beginPath(); ctx.moveTo(sx05, marginT); ctx.lineTo(sx05, marginT + plotH); ctx.stroke();
                    ctx.setLineDash([]);

                    // Mark known zeros that fall in the view
                    var knownGammas = [
                        14.1347, 21.0220, 25.0109, 30.4249, 32.9351,
                        37.5862, 40.9187, 43.3271, 48.0052, 49.7738,
                        52.9703, 56.4462, 59.3470, 60.8318, 65.1125,
                        67.0798, 69.5465, 72.0672, 75.7047, 77.1448
                    ];
                    for (var zi = 0; zi < knownGammas.length; zi++) {
                        var gamma = knownGammas[zi];
                        if (gamma < tMin || gamma > tMaxL) continue;
                        var zeroSY = marginT + (tMaxL - gamma) / (tMaxL - tMin) * plotH;
                        // Zero is at sigma=0.5
                        ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 1.5;
                        ctx.beginPath(); ctx.arc(sx05, zeroSY, 6, 0, Math.PI * 2); ctx.stroke();
                        ctx.fillStyle = '#000000aa';
                        ctx.beginPath(); ctx.arc(sx05, zeroSY, 5, 0, Math.PI * 2); ctx.fill();
                        // Label
                        ctx.fillStyle = '#ffffff'; ctx.font = '9px sans-serif'; ctx.textAlign = 'left';
                        ctx.fillText('\u03B3=' + gamma.toFixed(2), sx05 + 8, zeroSY + 3);
                    }

                    // Axes
                    ctx.fillStyle = '#c9d1d9'; ctx.font = '10px sans-serif';
                    // Sigma axis
                    ctx.strokeStyle = '#4a4a7a'; ctx.lineWidth = 1;
                    ctx.beginPath(); ctx.moveTo(marginL, marginT + plotH); ctx.lineTo(marginL + plotW, marginT + plotH); ctx.stroke();
                    ctx.textAlign = 'center';
                    var sigTicksP = [0.3, 0.5, 0.7, 0.9, 1.0, 1.1];
                    for (var sti = 0; sti < sigTicksP.length; sti++) {
                        var sv = sigTicksP[sti];
                        var stx2 = marginL + (sv - sigMin) / (sigMax - sigMin) * plotW;
                        ctx.fillStyle = '#c9d1d9';
                        ctx.fillText(sv.toFixed(1), stx2, marginT + plotH + 14);
                        ctx.strokeStyle = '#4a4a7a';
                        ctx.beginPath(); ctx.moveTo(stx2, marginT + plotH); ctx.lineTo(stx2, marginT + plotH + 4); ctx.stroke();
                    }
                    ctx.fillStyle = '#c9d1d9'; ctx.fillText('\u03C3', marginL + plotW + 5, marginT + plotH + 4);

                    // T axis
                    ctx.strokeStyle = '#4a4a7a'; ctx.lineWidth = 1;
                    ctx.beginPath(); ctx.moveTo(marginL, marginT); ctx.lineTo(marginL, marginT + plotH); ctx.stroke();
                    ctx.textAlign = 'right';
                    var nTicks = 5;
                    for (var ti2 = 0; ti2 <= nTicks; ti2++) {
                        var tv = tMin + (tMaxL - tMin) * (nTicks - ti2) / nTicks;
                        var sty2 = marginT + ti2 / nTicks * plotH;
                        ctx.fillStyle = '#c9d1d9';
                        ctx.fillText(tv.toFixed(1), marginL - 4, sty2 + 4);
                        ctx.strokeStyle = '#4a4a7a';
                        ctx.beginPath(); ctx.moveTo(marginL, sty2); ctx.lineTo(marginL - 4, sty2); ctx.stroke();
                    }
                    ctx.fillStyle = '#c9d1d9'; ctx.textAlign = 'left';
                    ctx.fillText('t', marginL - 16, marginT + 8);

                    // Labels
                    ctx.fillStyle = '#ffffff'; ctx.font = 'bold 11px sans-serif';
                    ctx.textAlign = 'center';
                    ctx.fillText('\u03C3=1', sx1, marginT + 12);
                    ctx.fillStyle = '#ffffff88'; ctx.font = '10px sans-serif';
                    ctx.fillText('\u03C3=1/2', sx05, marginT + 12);
                    ctx.fillStyle = '#c9d1d9'; ctx.font = '10px sans-serif'; ctx.textAlign = 'left';
                    ctx.fillText('Zeros (RH: all on \u03C3=1/2)', marginL + 5, marginT + plotH - 8);
                }

                drawAll();
                return viz;
            }
        }
    ]
};
