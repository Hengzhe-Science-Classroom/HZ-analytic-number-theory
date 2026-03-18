// ================================================================
// Chapter 16 — Zeros of L-Functions (Extra Visualizations)
// ================================================================
window.EXTRA_VIZ = window.EXTRA_VIZ || {};
window.EXTRA_VIZ['ch16'] = {
    // ================================================================
    // Pair Correlation Heatmap (sec-pair-correlation)
    // ================================================================
    'sec-pair-correlation': [
        {
            id: 'viz-pair-correlation',
            title: 'Pair Correlation Heatmap',
            description: 'A heatmap showing the pair correlation density as a function of the separation \\(u\\) between unfolded zeros. Bright regions indicate high correlation (many pairs at that spacing). The GUE "hole" near \\(u = 0\\) is clearly visible as the dark region at center.',
            setup: function(body, controls) {
                var zetaZeros = [14.134725,21.022040,25.010858,30.424876,32.935062,37.586178,40.918719,43.327073,48.005151,49.773832,52.970321,56.446248,59.347044,60.831779,65.112544,67.079811,69.546402,72.067158,75.704691,77.144840,79.337375,82.910381,84.735493,87.425275,88.809111,92.491899,94.651344,95.870634,98.831194,101.317851,103.725538,105.446623,107.168611,111.029535,111.874659,114.320221,116.226680,118.790783,121.370125,122.946829,124.256819,127.516684,129.578704,131.087689,133.497737,134.756510,138.116042,139.736209,141.123707,143.111846,146.000982,147.422765,150.053521,150.925258,153.024694,156.112909,157.597592,158.849989,161.188964,163.030709,165.537069,167.184440,169.094515,169.911977,173.411537,174.754191,176.441434,178.377407,179.916484,182.207078,184.874467,185.598783,187.228922,189.416158,192.026566,193.079726,195.265397,196.876482,198.015310,201.264752,202.493595,204.189671,205.394697,207.906259,209.576509,211.690862,213.347919,214.547044,216.169538,219.067596,220.714919,221.430703,224.007000,224.983324,227.421444,229.337413,231.250189,231.987235,233.693404,236.524230];

                var viz = new VizEngine(body, {
                    width: 560, height: 380,
                    originX: 0, originY: 0, scale: 1
                });

                // Unfold zeros
                var unfolded = [];
                for (var i = 0; i < zetaZeros.length; i++) {
                    var g = zetaZeros[i];
                    unfolded.push(g * Math.log(g / (2 * Math.PI)) / (2 * Math.PI));
                }

                // Build 2D heatmap: x = zero index (which zero), y = spacing to neighbors
                // We show a different view: for each zero i, compute distances to all other zeros
                var maxDist = 5.0;
                var nGrid = 200;

                function draw() {
                    var ctx = viz.ctx;
                    var w = viz.width, h = viz.height;
                    var padL = 50, padR = 60, padT = 30, padB = 40;
                    var plotW = w - padL - padR;
                    var plotH = h - padT - padB;

                    // Create a density field: pair correlation as a function of u
                    // We'll make a 2D display: x-axis = u (spacing), y-axis = zero index (window position)
                    // Color = local density of pair differences near that u value
                    var nZeros = unfolded.length;
                    var nBinsX = 100;
                    var nBinsY = nZeros;
                    var binWX = maxDist / nBinsX;

                    // For each zero i, histogram of distances to other zeros
                    var heatData = [];
                    for (var i = 0; i < nZeros; i++) {
                        var row = new Float64Array(nBinsX);
                        for (var j = 0; j < nZeros; j++) {
                            if (i === j) continue;
                            var d = Math.abs(unfolded[j] - unfolded[i]);
                            if (d < maxDist) {
                                var bin = Math.floor(d / binWX);
                                if (bin < nBinsX) row[bin]++;
                            }
                        }
                        heatData.push(row);
                    }

                    // Find max for color scale
                    var vMax = 0;
                    for (var i = 0; i < nZeros; i++) {
                        for (var j = 0; j < nBinsX; j++) {
                            if (heatData[i][j] > vMax) vMax = heatData[i][j];
                        }
                    }

                    // Draw heatmap
                    var cellW = plotW / nBinsX;
                    var cellH = plotH / nZeros;
                    for (var iy = 0; iy < nZeros; iy++) {
                        for (var ix = 0; ix < nBinsX; ix++) {
                            var t = heatData[iy][ix] / (vMax || 1);
                            var r = Math.round(255 * Math.min(1, 1.1 * t + 0.15 * Math.sin(t * 3.14)));
                            var g = Math.round(255 * Math.max(0, t * t));
                            var b = Math.round(255 * Math.max(0, Math.sin(t * 1.57)));
                            ctx.fillStyle = 'rgb(' + r + ',' + g + ',' + b + ')';
                            ctx.fillRect(padL + ix * cellW, padT + iy * cellH, Math.ceil(cellW) + 1, Math.ceil(cellH) + 1);
                        }
                    }

                    // Axes
                    ctx.strokeStyle = viz.colors.axis; ctx.lineWidth = 1;
                    ctx.beginPath(); ctx.moveTo(padL, padT); ctx.lineTo(padL, h - padB); ctx.lineTo(padL + plotW, h - padB); ctx.stroke();

                    // X labels
                    ctx.fillStyle = viz.colors.text; ctx.font = '10px -apple-system,sans-serif';
                    ctx.textAlign = 'center'; ctx.textBaseline = 'top';
                    for (var xl = 0; xl <= maxDist; xl += 1) {
                        var sx = padL + (xl / maxDist) * plotW;
                        ctx.fillText(xl.toFixed(0), sx, h - padB + 4);
                    }

                    // Y labels
                    ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
                    for (var yl = 0; yl < nZeros; yl += 20) {
                        var sy = padT + (yl / nZeros) * plotH;
                        ctx.fillText('\u03B3\u2080' + (yl + 1), padL - 5, sy + cellH / 2);
                    }

                    // Title
                    viz.screenText('Pair Distance Heatmap (per zero)', w / 2, 15, viz.colors.white, 14);
                    viz.screenText('Unfolded spacing u', w / 2, h - 5, viz.colors.text, 12);
                    viz.screenText('Zero index', 15, h / 2, viz.colors.text, 12);

                    // Colorbar
                    var cbX = padL + plotW + 10;
                    var cbW = 15;
                    for (var cy = 0; cy < plotH; cy++) {
                        var t = 1 - cy / plotH;
                        var r = Math.round(255 * Math.min(1, 1.1 * t + 0.15 * Math.sin(t * 3.14)));
                        var g = Math.round(255 * Math.max(0, t * t));
                        var b = Math.round(255 * Math.max(0, Math.sin(t * 1.57)));
                        ctx.fillStyle = 'rgb(' + r + ',' + g + ',' + b + ')';
                        ctx.fillRect(cbX, padT + cy, cbW, 1);
                    }
                    ctx.strokeStyle = viz.colors.axis; ctx.lineWidth = 0.5;
                    ctx.strokeRect(cbX, padT, cbW, plotH);
                    ctx.fillStyle = viz.colors.text; ctx.font = '9px -apple-system,sans-serif';
                    ctx.textAlign = 'left'; ctx.textBaseline = 'top';
                    ctx.fillText('high', cbX + cbW + 3, padT);
                    ctx.textBaseline = 'bottom';
                    ctx.fillText('low', cbX + cbW + 3, h - padB);
                }
                draw();
                return viz;
            }
        }
    ],

    // ================================================================
    // Zero-Density Heatmap (sec-zero-density)
    // ================================================================
    'sec-zero-density': [
        {
            id: 'viz-zero-density-heatmap',
            title: 'Zero-Density Bound Heatmap',
            description: 'A heatmap showing the bound \\(N(\\sigma, T) / T\\) across the \\((\\sigma, \\log T)\\) plane using Ingham\'s estimate. Brighter colors indicate regions where more zeros are permitted. The bound decays rapidly as \\(\\sigma\\) increases toward 1.',
            setup: function(body, controls) {
                var viz = new VizEngine(body, {
                    width: 560, height: 380,
                    originX: 0, originY: 0, scale: 1
                });

                var boundType = 0; // 0=Ingham, 1=DH, 2=Huxley
                VizEngine.createButton(controls, 'Ingham', function() { boundType = 0; draw(); });
                VizEngine.createButton(controls, 'DH', function() { boundType = 1; draw(); });
                VizEngine.createButton(controls, 'Huxley', function() { boundType = 2; draw(); });

                function draw() {
                    var w = viz.width, h = viz.height;
                    var padL = 50, padR = 60, padT = 30, padB = 40;
                    var plotW = w - padL - padR;
                    var plotH = h - padT - padB;

                    var sigMin = 0.5, sigMax = 1.0;
                    var logTmin = 1, logTmax = 6; // log10(T) from 10 to 10^6

                    // Use drawHeatmap
                    viz.drawHeatmap(function(x, y) {
                        // x is pixel position, we need to map to sigma and logT
                        var sigma = sigMin + (x - 0) / w * (sigMax - sigMin);
                        var logT = logTmax - (y - 0) / h * (logTmax - logTmin);
                        if (sigma <= 0.5 || sigma >= 1.0) return 0;
                        var T = Math.pow(10, logT);
                        var exponent;
                        if (boundType === 0) {
                            exponent = 3 * (1 - sigma) / (2 - sigma);
                        } else if (boundType === 1) {
                            exponent = 2 * (1 - sigma);
                        } else {
                            exponent = 12 * (1 - sigma) / 5;
                        }
                        // N(sigma, T) / N(T) ratio: T^exponent / (T*logT) = T^(exponent-1) / logT
                        var ratio = Math.pow(T, exponent - 1) / Math.log(T);
                        return Math.log10(Math.max(ratio, 1e-20));
                    }, [0, w], [0, h], 'inferno');

                    var ctx = viz.ctx;

                    // Overlay axes
                    ctx.strokeStyle = '#ffffff88'; ctx.lineWidth = 1;
                    ctx.beginPath(); ctx.moveTo(padL, padT); ctx.lineTo(padL, h - padB); ctx.lineTo(padL + plotW, h - padB); ctx.stroke();

                    // X labels (sigma)
                    ctx.fillStyle = '#ffffffcc'; ctx.font = '10px -apple-system,sans-serif';
                    ctx.textAlign = 'center'; ctx.textBaseline = 'top';
                    for (var s = 0.5; s <= 1.0; s += 0.1) {
                        var sx = padL + ((s - sigMin) / (sigMax - sigMin)) * plotW;
                        ctx.fillText(s.toFixed(1), sx, h - padB + 4);
                    }

                    // Y labels (log T)
                    ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
                    for (var lt = logTmin; lt <= logTmax; lt++) {
                        var sy = padT + ((logTmax - lt) / (logTmax - logTmin)) * plotH;
                        ctx.fillText('10^' + lt, padL - 5, sy);
                    }

                    // Critical line sigma = 1/2
                    var halfX = padL;
                    ctx.strokeStyle = '#3fb950aa'; ctx.lineWidth = 2; ctx.setLineDash([4, 4]);
                    ctx.beginPath(); ctx.moveTo(halfX, padT); ctx.lineTo(halfX, h - padB); ctx.stroke();
                    ctx.setLineDash([]);

                    // Labels
                    var names = ['Ingham: 3(1-\u03C3)/(2-\u03C3)', 'Density Hypothesis: 2(1-\u03C3)', 'Huxley: 12(1-\u03C3)/5'];
                    viz.screenText('Zero-Density Heatmap: ' + names[boundType], w / 2, 12, '#ffffffee', 13);
                    viz.screenText('\u03C3', w / 2, h - 5, '#ffffffaa', 12);
                    viz.screenText('T', 15, h / 2, '#ffffffaa', 12);
                    viz.screenText('log\u2081\u2080(N(\u03C3,T)/N(T))', w - 25, padT + 10, '#ffffffaa', 9);
                }
                draw();
                return viz;
            }
        }
    ]
};
