// === Chapter 5 Extra Visualizations: Analytic Continuation & Functional Equation ===
window.EXTRA_VIZ = window.EXTRA_VIZ || {};
window.EXTRA_VIZ['ch05'] = {
    // ----------------------------------------------------------------
    // sec-theta: Domain coloring of theta function in the tau upper half-plane
    // ----------------------------------------------------------------
    'sec-theta': [
        {
            id: 'viz-theta-modular',
            title: 'Domain Coloring: \\(\\vartheta(\\tau)\\) in the Upper Half-Plane',
            description: 'The Jacobi theta function \\(\\vartheta(\\tau) = \\sum_{n=-\\infty}^{\\infty} e^{i\\pi n^2 \\tau}\\) for \\(\\tau\\) in the upper half-plane (\\(\\operatorname{Im}(\\tau) > 0\\)). Color encodes the argument (hue) and modulus (brightness). The modular symmetry \\(\\tau \\mapsto -1/\\tau\\) maps each point to its dual. Adjust the number of terms for convergence.',
            setup: function(body, controls) {
                var viz = new VizEngine(body, {
                    width: 560, height: 400,
                    originX: 280, originY: 380, scale: 80
                });

                var nTerms = 8;
                VizEngine.createSlider(controls, 'Terms N', 2, 20, nTerms, 1, function(v) {
                    nTerms = Math.round(v); draw();
                });

                function cMul(a, b, c, d) { return [a * c - b * d, a * d + b * c]; }
                function cExp(a, b) {
                    var r = Math.exp(a);
                    return [r * Math.cos(b), r * Math.sin(b)];
                }

                function thetaComplex(re, im, N) {
                    // theta(tau) = sum_{n=-N}^{N} exp(i*pi*n^2*tau)
                    // exp(i*pi*n^2*(re + i*im)) = exp(-pi*n^2*im) * exp(i*pi*n^2*re)
                    var sumR = 0, sumI = 0;
                    for (var n = -N; n <= N; n++) {
                        var decay = Math.exp(-Math.PI * n * n * im);
                        var phase = Math.PI * n * n * re;
                        sumR += decay * Math.cos(phase);
                        sumI += decay * Math.sin(phase);
                    }
                    return [sumR, sumI];
                }

                function draw() {
                    // Domain coloring over [xMin, xMax] x [yMin, yMax] in the tau-plane
                    var xMin = -2.5, xMax = 2.5;
                    var yMin = 0.05, yMax = 4.0;

                    viz.drawDomainColoring(function(re, im) {
                        if (im < 0.01) return [0, 0];
                        return thetaComplex(re, im, nTerms);
                    }, [xMin, xMax], [yMin, yMax]);

                    var ctx = viz.ctx;

                    // Overlay: real axis
                    var realY = viz.height; // im=0 is at bottom
                    ctx.strokeStyle = '#ffffff44';
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(0, realY);
                    ctx.lineTo(viz.width, realY);
                    ctx.stroke();

                    // Label
                    viz.screenText('\u03d1(\u03c4) = \u03a3 exp(i\u03c0n\u00b2\u03c4)', viz.width / 2, 18, '#ffffffcc', 13);
                    viz.screenText('Re(\u03c4)', viz.width - 30, viz.height - 8, '#ffffff88', 10);
                    viz.screenText('Im(\u03c4)', 16, 15, '#ffffff88', 10);

                    // Mark tau = i (the fixed point of tau -> -1/tau)
                    var fixX = viz.width * (0 - xMin) / (xMax - xMin);
                    var fixY = viz.height * (yMax - 1) / (yMax - yMin);
                    ctx.strokeStyle = '#ffffffaa';
                    ctx.lineWidth = 1.5;
                    ctx.beginPath();
                    ctx.arc(fixX, fixY, 8, 0, Math.PI * 2);
                    ctx.stroke();
                    viz.screenText('\u03c4 = i', fixX + 14, fixY, '#ffffffcc', 11, 'left');

                    // Axis ticks
                    ctx.fillStyle = '#ffffff66';
                    ctx.font = '9px -apple-system,sans-serif';
                    ctx.textAlign = 'center';
                    for (var tx = -2; tx <= 2; tx++) {
                        var px = viz.width * (tx - xMin) / (xMax - xMin);
                        ctx.fillText(tx.toString(), px, viz.height - 2);
                    }
                    ctx.textAlign = 'right';
                    for (var ty = 1; ty <= 3; ty++) {
                        var py = viz.height * (yMax - ty) / (yMax - yMin);
                        ctx.fillText(ty + 'i', 22, py + 3);
                    }

                    viz.screenText('N = ' + nTerms, viz.width - 40, 38, '#ffffffaa', 10);
                }
                draw();
                return viz;
            }
        }
    ],

    // ----------------------------------------------------------------
    // sec-hurwitz: Domain coloring of zeta(s, a) for varying a
    // ----------------------------------------------------------------
    'sec-hurwitz': [
        {
            id: 'viz-hurwitz-family',
            title: 'Domain Coloring: The Hurwitz Zeta Family \\(\\zeta(s, a)\\)',
            description: 'Domain coloring of \\(\\zeta(s, a)\\) in the complex \\(s\\)-plane for a chosen parameter \\(a\\). At \\(a = 1\\) this is the Riemann zeta function. Drag \\(a\\) to see how the zero structure evolves. The pole at \\(s = 1\\) (white spot) persists for all \\(a\\).',
            setup: function(body, controls) {
                var viz = new VizEngine(body, {
                    width: 560, height: 400,
                    originX: 380, originY: 200, scale: 30
                });

                var aVal = 1.0;
                VizEngine.createSlider(controls, 'a', 0.1, 1.0, aVal, 0.05, function(v) {
                    aVal = v; draw();
                });

                // Approximate Hurwitz zeta for real s via partial sum + Euler-Maclaurin
                // For domain coloring we need complex s; use direct partial sums
                function hurwitzComplex(sigmaVal, tVal, a, N) {
                    var sumR = 0, sumI = 0;
                    for (var n = 0; n < N; n++) {
                        var base = n + a;
                        if (base <= 0) continue;
                        // (n+a)^{-s} = exp(-s * log(n+a))
                        var logBase = Math.log(base);
                        var realPart = -sigmaVal * logBase; // real part of -s*log(base)
                        var imagPart = -tVal * logBase;     // imag part
                        var mag = Math.exp(realPart);
                        sumR += mag * Math.cos(imagPart);
                        sumI += mag * Math.sin(imagPart);
                    }
                    return [sumR, sumI];
                }

                function draw() {
                    var xMin = -6, xMax = 6;
                    var yMin = -15, yMax = 15;
                    var N = 80; // partial sum terms

                    viz.drawDomainColoring(function(sigma, t) {
                        return hurwitzComplex(sigma, t, aVal, N);
                    }, [xMin, xMax], [yMin, yMax]);

                    var ctx = viz.ctx;

                    // Mark the pole at s=1
                    var poleX = viz.width * (1 - xMin) / (xMax - xMin);
                    var poleY = viz.height * (yMax - 0) / (yMax - yMin);
                    ctx.strokeStyle = '#ffffffbb';
                    ctx.lineWidth = 1.5;
                    ctx.beginPath();
                    ctx.arc(poleX, poleY, 6, 0, Math.PI * 2);
                    ctx.stroke();
                    viz.screenText('s=1', poleX + 10, poleY - 8, '#ffffffcc', 10, 'left');

                    // Critical line at sigma=1/2
                    var halfX = viz.width * (0.5 - xMin) / (xMax - xMin);
                    ctx.strokeStyle = '#ffffff33';
                    ctx.lineWidth = 1;
                    ctx.setLineDash([4, 4]);
                    ctx.beginPath();
                    ctx.moveTo(halfX, 0);
                    ctx.lineTo(halfX, viz.height);
                    ctx.stroke();
                    ctx.setLineDash([]);

                    // Label
                    viz.screenText('\u03b6(s, ' + aVal.toFixed(2) + ')', viz.width / 2, 18, '#ffffffcc', 13);
                    viz.screenText('Re(s)', viz.width - 25, viz.height / 2 + 12, '#ffffff66', 9);
                    viz.screenText('Im(s)', viz.width / 2 + 30, 10, '#ffffff66', 9);

                    // Axis ticks
                    ctx.fillStyle = '#ffffff55';
                    ctx.font = '9px -apple-system,sans-serif';
                    ctx.textAlign = 'center';
                    for (var tx = -4; tx <= 4; tx += 2) {
                        var px = viz.width * (tx - xMin) / (xMax - xMin);
                        ctx.fillText(tx.toString(), px, poleY + 12);
                    }
                    ctx.textAlign = 'right';
                    for (var ty = -10; ty <= 10; ty += 5) {
                        if (ty === 0) continue;
                        var py = viz.height * (yMax - ty) / (yMax - yMin);
                        ctx.fillText(ty + 'i', poleX - 10, py + 3);
                    }
                }
                draw();
                return viz;
            }
        }
    ]
};
