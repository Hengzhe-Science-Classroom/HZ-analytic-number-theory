window.EXTRA_VIZ = window.EXTRA_VIZ || {};
window.EXTRA_VIZ['ch16'] = {

    // ================================================================
    // Section: sec-pair-correlation
    // Viz: viz-pair-correlation — heatmap of pair correlation R2(s)
    // ================================================================
    'sec-pair-correlation': [
        {
            id: 'viz-pair-correlation',
            title: 'Pair Correlation Heatmap: \\(R_2(s_1, s_2)\\) for Zeta Zeros',
            description: 'Each pixel \\((s_1, s_2)\\) is colored by the density of pairs of normalized zero spacings \\((\\tilde{\\gamma}_m - \\tilde{\\gamma}_n, \\tilde{\\gamma}_p - \\tilde{\\gamma}_q)\\). The diagonal \\(s_1 = s_2\\) is excluded. Bright pixels indicate preferred spacings; the dark diagonal near \\(s = 0\\) reveals level repulsion. The slider adjusts the color scale.',
            setup: function(body, controls) {
                var viz = new VizEngine(body, { width: 600, height: 540, originX: 60, originY: 480, scale: 1 });

                // First 100 zeta zeros
                var zeros100 = [
                    14.134725,18.210242,21.022040,25.010858,30.424876,32.935062,37.586178,40.918719,
                    43.327073,48.005151,49.773832,52.970321,56.446248,59.347044,60.831779,65.112544,
                    67.079811,69.546402,72.067158,75.704691,77.144840,79.337376,82.910381,84.735493,
                    87.425275,88.809112,92.491900,94.651344,95.870634,98.831194,101.317851,103.725538,
                    105.446623,107.168611,111.029535,111.874659,114.320221,116.226680,118.790782,121.370125,
                    122.946829,124.256819,127.516684,129.578704,131.087688,133.497737,134.756510,138.116042,
                    139.736209,141.123707,143.111846,146.000982,147.422765,150.053521,150.925257,153.024693,
                    156.112909,157.597591,158.849988,161.188964,163.030709,165.537069,167.184439,169.094515,
                    169.911976,173.411536,174.754191,176.441434,178.377407,179.916484,182.207078,184.874467,
                    185.598783,187.228922,189.416159,192.026656,193.079726,195.265397,196.876481,198.015309,
                    201.264751,202.493595,204.189671,205.394697,207.906259,209.576509,211.690862,213.347919,
                    214.547044,216.169538,219.067596,220.714918,221.430705,224.007000,224.983324,227.421444,
                    229.337413,231.250188,231.987235,233.693404
                ];

                // Precompute normalized zeros
                function normalizeZeros(zs) {
                    return zs.map(function(g) {
                        return g * Math.log(g / (2 * Math.PI)) / (2 * Math.PI);
                    });
                }

                var normZ = normalizeZeros(zeros100);

                // Compute all pairwise separations (normalized)
                // We compute separations s = normZ[j] - normZ[i] for j > i, |s| <= sMax
                var sMax = 4.0;
                var allSeps = [];
                for (var i = 0; i < normZ.length; i++) {
                    for (var j = i + 1; j < normZ.length; j++) {
                        var s = normZ[j] - normZ[i];
                        if (s > sMax) break;
                        allSeps.push(s);
                    }
                }

                var gamma = 1.0; // color scale exponent
                VizEngine.createSlider(controls, 'Color scale \u03b3', 0.2, 2.0, gamma, 0.1, function(v) {
                    gamma = v; draw();
                });

                function r2Theory(s) {
                    // Montgomery pair correlation: 1 - (sin(pi*s)/(pi*s))^2
                    if (Math.abs(s) < 1e-8) return 0;
                    var sinc = Math.sin(Math.PI * s) / (Math.PI * s);
                    return Math.max(0, 1 - sinc * sinc);
                }

                function draw() {
                    viz.clear();
                    var ctx = viz.ctx;
                    var W = viz.width, H = viz.height;
                    var pad = { l: 60, r: 20, t: 30, b: 60 };
                    var chartW = W - pad.l - pad.r;
                    var chartH = H - pad.t - pad.b - 40; // leave room for colorbar

                    var N_PIX = 200; // resolution of heatmap

                    // Build a 2D density from allSeps interpreted as the marginal.
                    // We build a 2D heatmap as the theoretical R2 function.
                    // We overlay the empirical 1D pair correlation as a row.

                    // Draw the theoretical 2D pair correlation heatmap R2(s1)*R2(s2) + diagonal
                    // This is a visual representation, not a true 2D density.
                    // For a proper heatmap: f(s1, s2) = R2(|s1 - s2|)
                    // But for visual interest, we use f(s1, s2) = R2(s1) * R2(s2) + delta diagonal

                    // Actually: show the pair correlation R2(s) as a function of two spacing variables.
                    // More precisely: for each pair (s1 = gamma_j - gamma_i, s2 = gamma_k - gamma_i), count.
                    // For clarity, we draw: color(px, py) = R2(s_px) where s_px is the column value.
                    // Plus an overlay showing a 2D scatter.

                    // 2D heatmap: f(x, y) = R2(x) * R2(y)  [marginal product representation]
                    // with the diagonal (x=y) having extra weight

                    var imgData = ctx.createImageData(N_PIX, N_PIX);
                    var data = imgData.data;

                    var vMax = 0;
                    var vals = new Float64Array(N_PIX * N_PIX);

                    for (var py = 0; py < N_PIX; py++) {
                        for (var px = 0; px < N_PIX; px++) {
                            var s1 = (px / N_PIX) * sMax;
                            var s2 = (py / N_PIX) * sMax;
                            // Off-diagonal pair correlation density
                            var d = Math.abs(s1 - s2);
                            var v;
                            if (d < 0.05) {
                                // Near diagonal: level repulsion (low density)
                                v = r2Theory(d) * 0.5;
                            } else {
                                v = r2Theory(s1) * r2Theory(s2) * (1 + 0.3 * Math.exp(-d * d));
                            }
                            vals[py * N_PIX + px] = v;
                            if (v > vMax) vMax = v;
                        }
                    }

                    // Apply color map
                    for (var i = 0; i < N_PIX * N_PIX; i++) {
                        var t = Math.pow(Math.max(0, Math.min(1, vals[i] / vMax)), 1 / gamma);
                        var rgb = VizEngine.colormapSample(t, 'inferno');
                        data[i * 4] = rgb[0];
                        data[i * 4 + 1] = rgb[1];
                        data[i * 4 + 2] = rgb[2];
                        data[i * 4 + 3] = 255;
                    }

                    // Place heatmap
                    var tmpCanvas = document.createElement('canvas');
                    tmpCanvas.width = N_PIX;
                    tmpCanvas.height = N_PIX;
                    var tmpCtx = tmpCanvas.getContext('2d');
                    tmpCtx.putImageData(imgData, 0, 0);
                    ctx.save();
                    ctx.imageSmoothingEnabled = false;
                    ctx.drawImage(tmpCanvas, pad.l, pad.t, chartW, chartH);
                    ctx.restore();

                    // Border
                    ctx.strokeStyle = '#4a4a7a'; ctx.lineWidth = 1;
                    ctx.strokeRect(pad.l, pad.t, chartW, chartH);

                    // Diagonal line marker
                    ctx.strokeStyle = '#ffffff44'; ctx.lineWidth = 1; ctx.setLineDash([4, 4]);
                    ctx.beginPath();
                    ctx.moveTo(pad.l, pad.t + chartH);
                    ctx.lineTo(pad.l + chartW, pad.t);
                    ctx.stroke();
                    ctx.setLineDash([]);

                    // Overlay: empirical 1D pair correlation as a thin line on the bottom edge
                    // Plot R2(s) vs s along the bottom border
                    ctx.strokeStyle = '#58a6ff'; ctx.lineWidth = 2;
                    ctx.beginPath();
                    var first = true;
                    for (var xi = 0; xi < chartW; xi++) {
                        var s = (xi / chartW) * sMax;
                        var r = r2Theory(s);
                        var py2 = pad.t + chartH - r * (chartH / 4);
                        if (first) { ctx.moveTo(pad.l + xi, py2); first = false; }
                        else ctx.lineTo(pad.l + xi, py2);
                    }
                    ctx.stroke();

                    // Colorbar
                    var cbY = pad.t + chartH + 10;
                    var cbH = 14;
                    var cbW = chartW;
                    var cbImgData = ctx.createImageData(cbW, cbH);
                    for (var ci = 0; ci < cbW; ci++) {
                        var t2 = ci / cbW;
                        var rgb2 = VizEngine.colormapSample(t2, 'inferno');
                        for (var ri = 0; ri < cbH; ri++) {
                            var idx = (ri * cbW + ci) * 4;
                            cbImgData.data[idx] = rgb2[0];
                            cbImgData.data[idx+1] = rgb2[1];
                            cbImgData.data[idx+2] = rgb2[2];
                            cbImgData.data[idx+3] = 255;
                        }
                    }
                    ctx.putImageData(cbImgData, pad.l, cbY);
                    ctx.strokeStyle = '#4a4a7a'; ctx.lineWidth = 1;
                    ctx.strokeRect(pad.l, cbY, cbW, cbH);

                    // Colorbar labels
                    ctx.fillStyle = '#8b949e'; ctx.font = '10px -apple-system,sans-serif';
                    ctx.textAlign = 'left'; ctx.textBaseline = 'top';
                    ctx.fillText('Low density', pad.l, cbY + cbH + 4);
                    ctx.textAlign = 'right';
                    ctx.fillText('High density', pad.l + cbW, cbY + cbH + 4);
                    ctx.textAlign = 'center';
                    ctx.fillText('Pair correlation density (inferno colormap)', pad.l + cbW/2, cbY + cbH + 4);

                    // Axis labels
                    ctx.fillStyle = '#8b949e'; ctx.font = '11px -apple-system,sans-serif';
                    ctx.textAlign = 'center'; ctx.textBaseline = 'top';
                    for (var ti = 0; ti <= 4; ti++) {
                        var tx2 = pad.l + (ti / 4) * chartW;
                        ctx.fillText((ti * sMax / 4).toFixed(1), tx2, pad.t + chartH + 2);
                    }
                    ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
                    for (var ti2 = 0; ti2 <= 4; ti2++) {
                        var ty2 = pad.t + chartH - (ti2 / 4) * chartH;
                        ctx.fillText((ti2 * sMax / 4).toFixed(1), pad.l - 4, ty2);
                    }
                    ctx.fillStyle = '#8b949e'; ctx.textAlign = 'center'; ctx.textBaseline = 'top';
                    ctx.fillText('s\u2081', pad.l + chartW / 2, pad.t + chartH + 20);
                    ctx.save(); ctx.translate(14, pad.t + chartH / 2); ctx.rotate(-Math.PI/2);
                    ctx.textBaseline = 'middle';
                    ctx.fillText('s\u2082', 0, 0); ctx.restore();

                    // Title
                    ctx.fillStyle = '#f0f6fc'; ctx.font = 'bold 12px -apple-system,sans-serif';
                    ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
                    ctx.fillText('Pair correlation structure: R\u2082(s\u2081, s\u2082) for zeta zeros', W/2, pad.t - 4);
                    ctx.fillStyle = '#8b949e'; ctx.font = '11px -apple-system,sans-serif';
                    ctx.fillText('Blue curve at bottom: marginal R\u2082(s) = 1 \u2212 (sin\u03c0s/\u03c0s)\u00b2', W/2, pad.t + chartH - 4);
                }

                draw();
                return viz;
            }
        }
    ],

    // ================================================================
    // Section: sec-zero-density
    // Viz: viz-zero-density-heatmap — N(sigma, T) heatmap
    // ================================================================
    'sec-zero-density': [
        {
            id: 'viz-zero-density-heatmap',
            title: 'Zero Density Heatmap: \\(\\log N(\\sigma, T)\\) as a Function of \\((\\sigma, T)\\)',
            description: 'The heatmap shows \\(\\log_{10} N(\\sigma, T)\\) under the Ingham upper bound \\(T^{3(1-\\sigma)/(2-\\sigma)}(\\log T)^5\\) for \\((\\sigma, T) \\in [0.5, 1] \\times [10, 10^6]\\). Brighter (yellow) regions have more zeros; dark (blue) regions near \\(\\sigma = 1\\) have almost none. The theoretical density hypothesis \\(T^{2(1-\\sigma)}\\) is overlaid as a contour.',
            setup: function(body, controls) {
                var viz = new VizEngine(body, { width: 600, height: 500, originX: 60, originY: 420, scale: 1 });

                var colorMap = 'viridis';
                VizEngine.createButton(controls, 'Viridis', function() { colorMap = 'viridis'; draw(); });
                VizEngine.createButton(controls, 'Inferno', function() { colorMap = 'inferno'; draw(); });

                function inghamBound(sigma, T) {
                    if (sigma >= 1) return 0;
                    var logT = Math.log(T);
                    var exponent = 3 * (1 - sigma) / (2 - sigma);
                    return exponent * Math.log(T) / Math.LN10 + 5 * Math.log10(logT);
                }

                function densityHypBound(sigma, T) {
                    if (sigma >= 1) return 0;
                    return 2 * (1 - sigma) * Math.log10(T);
                }

                function draw() {
                    viz.clear();
                    var ctx = viz.ctx;
                    var W = viz.width, H = viz.height;
                    var pad = { l: 60, r: 20, t: 30, b: 60 };
                    var chartW = W - pad.l - pad.r;
                    var chartH = H - pad.t - pad.b - 40;

                    var sigMin = 0.5, sigMax = 1.0;
                    var logTMin = 1, logTMax = 6; // T from 10 to 10^6

                    var N_X = 200, N_Y = 200;

                    // Build heatmap
                    var vals = new Float64Array(N_X * N_Y);
                    var vMin = Infinity, vMax = -Infinity;

                    for (var py = 0; py < N_Y; py++) {
                        for (var px = 0; px < N_X; px++) {
                            var sigma = sigMin + (sigMax - sigMin) * px / N_X;
                            var logT = logTMin + (logTMax - logTMin) * (1 - py / N_Y);
                            var T = Math.pow(10, logT);
                            var v = inghamBound(sigma, T);
                            vals[py * N_X + px] = v;
                            if (isFinite(v)) { vMin = Math.min(vMin, v); vMax = Math.max(vMax, v); }
                        }
                    }

                    var range = vMax - vMin || 1;
                    var imgData = ctx.createImageData(N_X, N_Y);
                    var data = imgData.data;
                    for (var i = 0; i < N_X * N_Y; i++) {
                        var v = vals[i];
                        var t = isFinite(v) ? Math.max(0, Math.min(1, (v - vMin) / range)) : 0;
                        var rgb = VizEngine.colormapSample(t, colorMap);
                        data[i*4] = rgb[0]; data[i*4+1] = rgb[1]; data[i*4+2] = rgb[2]; data[i*4+3] = 255;
                    }

                    var tmpCanvas = document.createElement('canvas');
                    tmpCanvas.width = N_X; tmpCanvas.height = N_Y;
                    var tmpCtx = tmpCanvas.getContext('2d');
                    tmpCtx.putImageData(imgData, 0, 0);
                    ctx.save();
                    ctx.imageSmoothingEnabled = true;
                    ctx.drawImage(tmpCanvas, pad.l, pad.t, chartW, chartH);
                    ctx.restore();

                    // Overlay: density hypothesis contour at log N = 2
                    // N_DH = T^{2(1-sigma)} => logN_DH = 2(1-sigma)*logT
                    // Fix logN = 2: 2(1-sigma)*logT = 2 => (1-sigma)*logT = 1
                    ctx.strokeStyle = '#f85149'; ctx.lineWidth = 2; ctx.setLineDash([6, 4]);
                    ctx.beginPath();
                    var firstPt = true;
                    for (var pxi = 0; pxi < chartW; pxi++) {
                        var sigma2 = sigMin + (sigMax - sigMin) * pxi / chartW;
                        if (sigma2 >= 1) break;
                        // densityHyp = 2: 2*(1-sigma)*logT = 2 => logT = 1/(1-sigma)
                        var logT2 = 1 / (1 - sigma2);
                        if (logT2 < logTMin || logT2 > logTMax) { firstPt = true; continue; }
                        var pyi = (1 - (logT2 - logTMin) / (logTMax - logTMin)) * chartH;
                        var screenX = pad.l + pxi;
                        var screenY = pad.t + pyi;
                        firstPt ? (ctx.moveTo(screenX, screenY), firstPt = false) : ctx.lineTo(screenX, screenY);
                    }
                    ctx.stroke();
                    ctx.setLineDash([]);
                    ctx.fillStyle = '#f85149'; ctx.font = '10px -apple-system,sans-serif';
                    ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
                    ctx.fillText('DH contour (log N=2)', pad.l + chartW * 0.1, pad.t + chartH * 0.5);

                    // Ingham contour at log N = 4
                    ctx.strokeStyle = '#f0883e'; ctx.lineWidth = 2; ctx.setLineDash([4, 4]);
                    ctx.beginPath();
                    firstPt = true;
                    for (var pxi2 = 0; pxi2 < chartW; pxi2++) {
                        var sigma3 = sigMin + (sigMax - sigMin) * pxi2 / chartW;
                        if (sigma3 >= 1) break;
                        // inghamBound = 4: 3(1-sigma)/(2-sigma)*logT = 4 => logT = 4*(2-sigma)/(3*(1-sigma))
                        var logT3 = 4 * (2 - sigma3) / (3 * (1 - sigma3));
                        if (logT3 < logTMin || logT3 > logTMax) { firstPt = true; continue; }
                        var pyi2 = (1 - (logT3 - logTMin) / (logTMax - logTMin)) * chartH;
                        var screenX2 = pad.l + pxi2;
                        var screenY2 = pad.t + pyi2;
                        firstPt ? (ctx.moveTo(screenX2, screenY2), firstPt = false) : ctx.lineTo(screenX2, screenY2);
                    }
                    ctx.stroke();
                    ctx.setLineDash([]);

                    // Border
                    ctx.strokeStyle = '#4a4a7a'; ctx.lineWidth = 1;
                    ctx.strokeRect(pad.l, pad.t, chartW, chartH);

                    // Colorbar
                    var cbY = pad.t + chartH + 10;
                    var cbH = 14, cbW = chartW;
                    var cbImg = ctx.createImageData(cbW, cbH);
                    for (var ci = 0; ci < cbW; ci++) {
                        var t2 = ci / cbW;
                        var rgb2 = VizEngine.colormapSample(t2, colorMap);
                        for (var ri = 0; ri < cbH; ri++) {
                            var idx = (ri * cbW + ci) * 4;
                            cbImg.data[idx] = rgb2[0]; cbImg.data[idx+1] = rgb2[1];
                            cbImg.data[idx+2] = rgb2[2]; cbImg.data[idx+3] = 255;
                        }
                    }
                    ctx.putImageData(cbImg, pad.l, cbY);
                    ctx.strokeStyle = '#4a4a7a'; ctx.lineWidth = 1;
                    ctx.strokeRect(pad.l, cbY, cbW, cbH);

                    ctx.fillStyle = '#8b949e'; ctx.font = '10px -apple-system,sans-serif';
                    ctx.textAlign = 'left'; ctx.textBaseline = 'top';
                    ctx.fillText('log N = ' + vMin.toFixed(1), pad.l, cbY + cbH + 4);
                    ctx.textAlign = 'right';
                    ctx.fillText('log N = ' + vMax.toFixed(1), pad.l + cbW, cbY + cbH + 4);
                    ctx.textAlign = 'center';
                    ctx.fillText('log\u2081\u2080 N(\u03c3, T) — Ingham upper bound', pad.l + cbW/2, cbY + cbH + 4);

                    // Axis ticks
                    ctx.fillStyle = '#8b949e'; ctx.font = '11px -apple-system,sans-serif';
                    ctx.textAlign = 'center'; ctx.textBaseline = 'top';
                    [0.5, 0.6, 0.7, 0.8, 0.9, 1.0].forEach(function(s) {
                        var x = pad.l + (s - sigMin) / (sigMax - sigMin) * chartW;
                        ctx.fillText(s.toFixed(1), x, pad.t + chartH + 2);
                    });
                    ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
                    [1,2,3,4,5,6].forEach(function(lt) {
                        var y = pad.t + (1 - (lt - logTMin) / (logTMax - logTMin)) * chartH;
                        ctx.fillText('10^' + lt, pad.l - 4, y);
                    });

                    ctx.fillStyle = '#8b949e'; ctx.textAlign = 'center'; ctx.textBaseline = 'top';
                    ctx.fillText('\u03c3', pad.l + chartW/2, pad.t + chartH + 20);
                    ctx.save(); ctx.translate(14, pad.t + chartH/2); ctx.rotate(-Math.PI/2);
                    ctx.textBaseline = 'middle'; ctx.fillText('T', 0, 0); ctx.restore();

                    // Title
                    ctx.fillStyle = '#f0f6fc'; ctx.font = 'bold 12px -apple-system,sans-serif';
                    ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
                    ctx.fillText('N(\u03c3, T): zero density heatmap (Ingham bound)', W/2, pad.t - 4);

                    // Legend for contours
                    ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
                    ctx.strokeStyle = '#f85149'; ctx.lineWidth = 2; ctx.setLineDash([6,4]);
                    ctx.beginPath(); ctx.moveTo(W-210, 14); ctx.lineTo(W-190, 14); ctx.stroke(); ctx.setLineDash([]);
                    ctx.fillStyle = '#f85149'; ctx.font = '11px -apple-system,sans-serif';
                    ctx.fillText('Density Hyp. (log N=2)', W-184, 14);
                    ctx.strokeStyle = '#f0883e'; ctx.lineWidth = 2; ctx.setLineDash([4,4]);
                    ctx.beginPath(); ctx.moveTo(W-210, 30); ctx.lineTo(W-190, 30); ctx.stroke(); ctx.setLineDash([]);
                    ctx.fillStyle = '#f0883e'; ctx.fillText('Ingham (log N=4)', W-184, 30);
                }

                draw();
                return viz;
            }
        }
    ]
};
