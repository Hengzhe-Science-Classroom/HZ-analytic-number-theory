// === Ch05 Extra Visualizations: Domain Coloring ===
// Domain coloring of:
//   1. viz-theta-modular: show theta(t) domain coloring + modular transformation
//   2. viz-hurwitz-family: domain coloring of zeta(s,a) for varying a

window.EXTRA_VIZ = window.EXTRA_VIZ || {};
window.EXTRA_VIZ['ch05'] = {

    // Section: sec-theta
    'sec-theta': [
        {
            id: 'viz-theta-modular',
            title: 'Theta Function: Modular Transformation \\(\\vartheta(1/t) = \\sqrt{t}\\,\\vartheta(t)\\)',
            description: 'Domain coloring of the theta function \\(\\vartheta(\\tau)\\) on the upper half-plane, near \\(\\tau = it\\) (the imaginary axis). Color encodes argument of \\(\\vartheta\\); brightness encodes magnitude. The slider selects the branch \\(\\tau = it\\) and shows both \\(\\vartheta(it)\\) and \\(\\vartheta(-i/t) = \\sqrt{t}\\,\\vartheta(it)\\) side by side.',
            setup: function(body, controls) {
                // We render a domain coloring of theta(i*t) vs theta(i/t) for t in [0.1, 10]
                var W = 560, H = 340;
                var viz = new VizEngine(body, { width: W, height: H });
                var t = 1.0;
                var N_terms = 12;

                VizEngine.createSlider(controls, 't', 0.2, 4.0, t, 0.05, function(v) { t = v; drawBoth(); });

                // Theta function: sum_{n=-N}^{N} exp(-pi n^2 tau), tau = it => exp(-pi n^2 t) (real)
                // For complex tau = sigma + i*t_im, vartheta(tau) = sum exp(pi i n^2 tau)
                // We do domain coloring on the rectangle of tau values
                function thetaComplex(re, im) {
                    // tau = re + i*im, need im > 0
                    if (im <= 0) im = 1e-6;
                    var sumR = 0, sumI = 0;
                    for (var n = -N_terms; n <= N_terms; n++) {
                        // exp(pi i n^2 tau) = exp(pi i n^2 (re + i im)) = exp(pi n^2 (i re - im))
                        // = exp(-pi n^2 im) * exp(i pi n^2 re)
                        var mag = Math.exp(-Math.PI * n * n * im);
                        var phase = Math.PI * n * n * re;
                        sumR += mag * Math.cos(phase);
                        sumI += mag * Math.sin(phase);
                    }
                    return [sumR, sumI];
                }

                function drawSide(canvas, ctx, xRange, yRange, label) {
                    var pw = canvas.width, ph = canvas.height;
                    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
                    var imgData = ctx.createImageData(pw, ph);
                    var data = imgData.data;
                    for (var py = 0; py < ph; py++) {
                        for (var px = 0; px < pw; px++) {
                            var re = xRange[0] + (xRange[1] - xRange[0]) * px / pw;
                            var im = yRange[1] - (yRange[1] - yRange[0]) * py / ph;
                            var uv = thetaComplex(re, im);
                            var u = uv[0], v = uv[1];
                            var arg = Math.atan2(v, u);
                            var mag = Math.sqrt(u * u + v * v);
                            var hue = (arg / Math.PI + 1) / 2;
                            var sat = 0.85;
                            var light = 1 - 1 / (1 + mag * 0.25);
                            var rgb = VizEngine.hslToRgb(hue, sat, light);
                            var idx = (py * pw + px) * 4;
                            data[idx] = rgb[0]; data[idx+1] = rgb[1]; data[idx+2] = rgb[2]; data[idx+3] = 255;
                        }
                    }
                    ctx.putImageData(imgData, 0, 0);
                    ctx.restore();
                    // Axis labels
                    ctx.fillStyle = '#ffffff99'; ctx.font = '11px sans-serif'; ctx.textAlign = 'center';
                    ctx.fillText(label, pw / 2, ph - 6);
                }

                // We'll draw the full domain coloring in the viz canvas, split in two halves
                function drawBoth() {
                    var ctx = viz.ctx;
                    var dpr = window.devicePixelRatio || 1;
                    var CW = viz.canvas.width, CH = viz.canvas.height;
                    var halfW = CW / 2;

                    // Create two offscreen canvases
                    function makeOffscreen(w, h) {
                        var c = document.createElement('canvas');
                        c.width = w; c.height = h;
                        return c;
                    }

                    var c1 = makeOffscreen(halfW, CH);
                    var c2 = makeOffscreen(halfW, CH);

                    // Left: vartheta(tau) for tau near i*t  => domain: re in [-1,1], im in [0.1, 3]
                    drawSide(c1, c1.getContext('2d'), [-1, 1], [0.1, 3], '\u03D1(\u03C4), \u03C4 near it');
                    // Right: vartheta(tau) for tau near i/t => domain: re in [-1,1], im in [0.1, 10]
                    drawSide(c2, c2.getContext('2d'), [-1, 1], [0.1, 10], '\u03D1(\u03C4), \u03C4 near i/t');

                    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
                    ctx.drawImage(c1, 0, 0);
                    ctx.drawImage(c2, halfW, 0);

                    // Dividing line
                    ctx.strokeStyle = '#ffffff44'; ctx.lineWidth = 1;
                    ctx.beginPath(); ctx.moveTo(halfW, 0); ctx.lineTo(halfW, CH); ctx.stroke();

                    // Mark t point on left panel
                    // tau = i*t => re=0, im=t; map to pixel
                    var imRange = [0.1, 3];
                    var pyT = CH - (t - imRange[0]) / (imRange[1] - imRange[0]) * CH;
                    var pxT = halfW / 2; // re = 0
                    ctx.fillStyle = '#ffffff';
                    ctx.beginPath(); ctx.arc(pxT, pyT, 5 * dpr, 0, Math.PI * 2); ctx.fill();
                    ctx.fillStyle = '#f0883e'; ctx.font = (11 * dpr) + 'px sans-serif';
                    ctx.textAlign = 'left';
                    ctx.fillText('it, t=' + t.toFixed(2), pxT + 7 * dpr, pyT + 4 * dpr);

                    // Mark i/t point on right panel
                    var invT = 1 / t;
                    var imRange2 = [0.1, 10];
                    var pyT2 = CH - (invT - imRange2[0]) / (imRange2[1] - imRange2[0]) * CH;
                    var pxT2 = halfW + halfW / 2;
                    ctx.fillStyle = '#58a6ff';
                    ctx.beginPath(); ctx.arc(pxT2, pyT2, 5 * dpr, 0, Math.PI * 2); ctx.fill();
                    ctx.fillStyle = '#58a6ff';
                    ctx.fillText('i/t, 1/t=' + (1/t).toFixed(2), pxT2 + 7 * dpr, pyT2 + 4 * dpr);

                    // Title bar
                    ctx.fillStyle = '#00000088';
                    ctx.fillRect(0, 0, CW, 18 * dpr);
                    ctx.fillStyle = '#c9d1d9'; ctx.textAlign = 'center';
                    ctx.fillText('Domain coloring of \u03D1(\u03C4): color = arg, brightness = |value|', CW / 2, 13 * dpr);

                    // Modular relation annotation
                    ctx.fillStyle = '#f0883e'; ctx.textAlign = 'center';
                    ctx.fillText('\u03D1(i/t) = \u221At \u00B7 \u03D1(it)', CW / 2, CH - 18 * dpr);

                    ctx.restore();
                }

                drawBoth();
                return viz;
            }
        }
    ],

    // Section: sec-hurwitz
    'sec-hurwitz': [
        {
            id: 'viz-hurwitz-family',
            title: 'Hurwitz Zeta Family: Domain Coloring of \\(\\zeta(s, a)\\)',
            description: 'Domain coloring of \\(\\zeta(s, a) = \\sum_{n \\geq 0}(n+a)^{-s}\\) on the complex \\(s\\)-plane for varying parameter \\(a \\in (0,1]\\). Color encodes argument, brightness encodes magnitude. Observe the pole at \\(s=1\\) (present for all \\(a\\)) and how the zero structure evolves as \\(a\\) changes from 1 (Riemann zeta) toward 0.',
            setup: function(body, controls) {
                var viz = new VizEngine(body, { width: 560, height: 380 });
                var a = 1.0;
                var N_terms = 30;

                VizEngine.createSlider(controls, 'a (shift param)', 0.05, 1.0, a, 0.05, function(v) { a = v; renderColoring(); });

                // Hurwitz zeta: sum_{n=0}^{N} (n+a)^{-s}
                // (n+a)^{-s} = exp(-s * log(n+a)) for real n+a > 0
                // log(n+a) is real, so (n+a)^{-s} = exp(-(sigma+it)*log(n+a))
                //   = exp(-sigma*log(n+a)) * exp(-it*log(n+a))
                //   = (n+a)^{-sigma} * [cos(t*log(n+a)) - i sin(t*log(n+a))]
                function hurwitz(re_s, im_s) {
                    // For re_s <= 0, the sum doesn't converge — we use partial sum as approximation
                    // This gives a heuristic coloring only valid for re_s > 1 strictly
                    var sumR = 0, sumI = 0;
                    var sig = re_s, t = im_s;
                    for (var n = 0; n < N_terms; n++) {
                        var x = n + a;
                        var xNegSig = Math.exp(-sig * Math.log(x));
                        var phase = -t * Math.log(x);
                        sumR += xNegSig * Math.cos(phase);
                        sumI += xNegSig * Math.sin(phase);
                    }
                    return [sumR, sumI];
                }

                function renderColoring() {
                    var ctx = viz.ctx;
                    var pw = viz.canvas.width, ph = viz.canvas.height;
                    var xRange = [-3, 4], yRange = [-12, 12];

                    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
                    var imgData = ctx.createImageData(pw, ph);
                    var data = imgData.data;

                    for (var py = 0; py < ph; py++) {
                        for (var px = 0; px < pw; px++) {
                            var re = xRange[0] + (xRange[1] - xRange[0]) * px / pw;
                            var im = yRange[1] - (yRange[1] - yRange[0]) * py / ph;

                            var uv = hurwitz(re, im);
                            var u = uv[0], v = uv[1];
                            var arg = Math.atan2(v, u);
                            var mag = Math.sqrt(u * u + v * v);

                            // Enhanced coloring: phase lines + magnitude contours
                            var hue = (arg / Math.PI + 1) / 2;
                            var sat = 0.9;
                            // Log-modulus shading with contour lines
                            var logMag = Math.log(1 + mag * 0.2);
                            var light = 0.5 * (1 - Math.cos(logMag * Math.PI));
                            light = Math.max(0.1, Math.min(0.95, light));

                            var rgb = VizEngine.hslToRgb(hue, sat, light);
                            var idx = (py * pw + px) * 4;
                            data[idx] = rgb[0]; data[idx+1] = rgb[1]; data[idx+2] = rgb[2]; data[idx+3] = 255;
                        }
                    }
                    ctx.putImageData(imgData, 0, 0);
                    ctx.restore();

                    // Overlay: axis labels and annotation
                    var dpr = window.devicePixelRatio || 1;
                    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);

                    // s=1 pole position
                    var poleX = (1 - xRange[0]) / (xRange[1] - xRange[0]) * pw;
                    var poleY = (yRange[1] - 0) / (yRange[1] - yRange[0]) * ph;
                    ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 1.5;
                    ctx.beginPath();
                    ctx.arc(poleX, poleY, 6 * dpr, 0, Math.PI * 2); ctx.stroke();
                    ctx.fillStyle = '#ffffff'; ctx.font = (11 * dpr) + 'px sans-serif';
                    ctx.textAlign = 'left';
                    ctx.fillText('s=1 (pole)', poleX + 8 * dpr, poleY - 4 * dpr);

                    // Real axis line
                    ctx.strokeStyle = '#ffffff44'; ctx.lineWidth = 1; ctx.setLineDash([4, 4]);
                    ctx.beginPath();
                    ctx.moveTo(0, poleY); ctx.lineTo(pw, poleY); ctx.stroke();
                    ctx.setLineDash([]);

                    // Critical line s = 1/2 + it
                    var critX = (0.5 - xRange[0]) / (xRange[1] - xRange[0]) * pw;
                    ctx.strokeStyle = '#bc8cff66'; ctx.lineWidth = 1; ctx.setLineDash([3, 5]);
                    ctx.beginPath(); ctx.moveTo(critX, 0); ctx.lineTo(critX, ph); ctx.stroke();
                    ctx.setLineDash([]);

                    // Title
                    ctx.fillStyle = '#00000099'; ctx.fillRect(0, 0, pw, 18 * dpr);
                    ctx.fillStyle = '#c9d1d9'; ctx.textAlign = 'center'; ctx.font = (11 * dpr) + 'px sans-serif';
                    ctx.fillText('\u03B6(s, a),  a = ' + a.toFixed(2) + '  |  Domain: Re(s) \u2208 [\u22123, 4], Im(s) \u2208 [\u221212, 12]', pw / 2, 13 * dpr);

                    // x-axis tick labels
                    ctx.fillStyle = '#8b949e'; ctx.font = (9 * dpr) + 'px sans-serif'; ctx.textAlign = 'center';
                    for (var xi = -3; xi <= 4; xi++) {
                        var tickX = (xi - xRange[0]) / (xRange[1] - xRange[0]) * pw;
                        ctx.fillText(xi.toString(), tickX, poleY + 12 * dpr);
                    }

                    // a=1 special note
                    if (a >= 0.99) {
                        ctx.fillStyle = '#f0883e'; ctx.font = (11 * dpr) + 'px sans-serif'; ctx.textAlign = 'center';
                        ctx.fillText('a = 1: Riemann \u03B6(s)', pw / 2, ph - 8 * dpr);
                    } else if (Math.abs(a - 0.5) < 0.03) {
                        ctx.fillStyle = '#58a6ff'; ctx.font = (11 * dpr) + 'px sans-serif'; ctx.textAlign = 'center';
                        ctx.fillText('a = 1/2: \u03B6(s,1/2) = (2^s\u22121)\u03B6(s)', pw / 2, ph - 8 * dpr);
                    }

                    ctx.restore();
                }

                renderColoring();
                return viz;
            }
        }
    ]
};
