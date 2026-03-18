// ================================================================
// Chapter 8: The Explicit Formula & the Error Term
// "Each zero sings a note in the symphony of primes"
// ================================================================
window.CHAPTERS = window.CHAPTERS || [];
window.CHAPTERS.push({
    id: 'ch08',
    number: 8,
    title: 'The Explicit Formula & the Error Term',
    subtitle: 'Each zero sings a note in the symphony of primes',
    sections: [
        // ================================================================
        // SECTION 1: Zeros as Frequencies
        // ================================================================
        {
            id: 'sec-motivation',
            title: 'Zeros as Frequencies',
            content: `
<h2>Zeros as Frequencies</h2>

<div class="env-block intuition">
    <div class="env-title">The Central Metaphor</div>
    <div class="env-body">
        <p>A musical note is a single frequency. A chord is several frequencies superimposed. An orchestral performance is hundreds of frequencies, each with its own amplitude and phase, combining to produce something incomparably richer than any single tone.</p>
        <p>The distribution of prime numbers is like a symphony. The "main theme" is the smooth approximation \\(\\pi(x) \\approx \\operatorname{Li}(x)\\). But the primes do not follow this smooth curve exactly; they fluctuate around it. The <strong>explicit formula</strong> tells us that each nontrivial zero \\(\\rho\\) of the Riemann zeta function contributes one oscillatory "note" to these fluctuations. The imaginary part \\(\\gamma\\) of a zero \\(\\rho = \\beta + i\\gamma\\) determines the frequency, while the real part \\(\\beta\\) determines how fast the amplitude grows.</p>
    </div>
</div>

<p>In the preceding chapters, we proved the Prime Number Theorem:</p>
\\[
\\psi(x) = \\sum_{n \\leq x} \\Lambda(n) \\sim x,
\\]
<p>which says that the Chebyshev function \\(\\psi(x)\\) grows like \\(x\\). But <em>how close</em> is \\(\\psi(x)\\) to \\(x\\)? What is the nature of the error \\(\\psi(x) - x\\)?</p>

<p>The answer comes from one of the most beautiful formulas in all of mathematics: the <strong>explicit formula</strong>, which expresses \\(\\psi(x)\\) exactly as a sum over the zeros of \\(\\zeta(s)\\). Each zero \\(\\rho\\) contributes a term \\(x^\\rho / \\rho\\), and the totality of these terms accounts precisely for the fluctuations of primes around their average behavior.</p>

<h3>Why "Frequencies"?</h3>

<p>If \\(\\rho = \\tfrac{1}{2} + i\\gamma\\) (assuming RH), then</p>
\\[
x^\\rho = x^{1/2 + i\\gamma} = \\sqrt{x} \\cdot x^{i\\gamma} = \\sqrt{x} \\cdot e^{i\\gamma \\log x}.
\\]
<p>The factor \\(e^{i\\gamma \\log x}\\) oscillates with "frequency" \\(\\gamma\\) when we view \\(\\log x\\) as time. So each zero literally contributes a wave, and the imaginary part \\(\\gamma\\) is its frequency. The first nontrivial zero has \\(\\gamma_1 \\approx 14.13\\), giving the lowest frequency; higher zeros contribute faster oscillations.</p>

<div class="env-block remark">
    <div class="env-title">Historical Note</div>
    <div class="env-body">
        <p>Riemann himself, in his legendary 1859 paper "Ueber die Anzahl der Primzahlen unter einer gegebenen Grosse," wrote down an explicit formula for \\(\\pi(x)\\) in terms of the zeros of \\(\\zeta(s)\\). This was made rigorous by von Mangoldt in 1895. The sound-analogy was popularized by Berry and Keating in the 1990s, connecting random matrix theory to the statistics of zeta zeros.</p>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-sound-analogy"></div>
`,
            visualizations: [
                {
                    id: 'viz-sound-analogy',
                    title: 'Zeros as Sound Waves',
                    description: 'Each zero of zeta contributes a wave. Low zeros give slow oscillations (bass notes); high zeros give rapid oscillations (treble). Toggle individual zeros to hear them "sing."',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 360,
                            originX: 60, originY: 180, scale: 1
                        });
                        var gammas = [14.134725, 21.022040, 25.010858, 30.424876, 32.935062];
                        var active = [true, true, true, false, false];
                        var colors = [viz.colors.blue, viz.colors.teal, viz.colors.orange, viz.colors.purple, viz.colors.green];

                        for (var i = 0; i < 5; i++) {
                            (function(idx) {
                                var btn = VizEngine.createButton(controls, '\u03B3\u2081=' + gammas[idx].toFixed(1), function() {
                                    active[idx] = !active[idx];
                                    btn.style.borderColor = active[idx] ? colors[idx] : '#30363d';
                                    btn.style.color = active[idx] ? colors[idx] : '#555';
                                    draw();
                                });
                                btn.style.borderColor = active[idx] ? colors[idx] : '#30363d';
                                btn.style.color = active[idx] ? colors[idx] : '#555';
                                btn.style.marginRight = '4px';
                            })(i);
                        }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var W = viz.width - 80;
                            var H = 140;
                            var cx = 60;
                            var cy = 90;

                            // Draw individual waves
                            for (var k = 0; k < 5; k++) {
                                if (!active[k]) continue;
                                ctx.strokeStyle = colors[k] + '66';
                                ctx.lineWidth = 1;
                                ctx.beginPath();
                                for (var px = 0; px <= W; px++) {
                                    var t = 0.5 + px / W * 4;
                                    var logT = Math.log(t);
                                    var y = Math.cos(gammas[k] * logT) / gammas[k] * 80;
                                    if (px === 0) ctx.moveTo(cx + px, cy - y);
                                    else ctx.lineTo(cx + px, cy - y);
                                }
                                ctx.stroke();
                            }

                            // Draw superposition
                            ctx.strokeStyle = viz.colors.white;
                            ctx.lineWidth = 2;
                            ctx.beginPath();
                            var cy2 = 260;
                            for (var px2 = 0; px2 <= W; px2++) {
                                var t2 = 0.5 + px2 / W * 4;
                                var logT2 = Math.log(t2);
                                var ySum = 0;
                                for (var j = 0; j < 5; j++) {
                                    if (active[j]) ySum += Math.cos(gammas[j] * logT2) / gammas[j] * 80;
                                }
                                if (px2 === 0) ctx.moveTo(cx + px2, cy2 - ySum);
                                else ctx.lineTo(cx + px2, cy2 - ySum);
                            }
                            ctx.stroke();

                            // Labels
                            viz.screenText('Individual zero contributions', viz.width / 2, 16, viz.colors.text, 12);
                            viz.screenText('Superposition', viz.width / 2, 195, viz.colors.text, 12);

                            // Axis lines
                            ctx.strokeStyle = viz.colors.axis;
                            ctx.lineWidth = 0.5;
                            ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + W, cy); ctx.stroke();
                            ctx.beginPath(); ctx.moveTo(cx, cy2); ctx.lineTo(cx + W, cy2); ctx.stroke();
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'If \\(\\rho = \\tfrac{1}{2} + i \\cdot 14.13\\), compute \\(|x^\\rho|\\) for \\(x = 100\\). How does this compare to \\(x\\) itself?',
                    hint: '\\(|x^\\rho| = x^{\\operatorname{Re}(\\rho)}\\). What is the real part of \\(\\rho\\)?',
                    solution: '\\(|x^\\rho| = x^{1/2} = \\sqrt{100} = 10\\). Meanwhile \\(x = 100\\). So the correction from a single zero is of size \\(\\sqrt{x}\\), which is much smaller than \\(x\\). This is why \\(\\psi(x) \\sim x\\) holds: the "noise" from zeros is \\(O(\\sqrt{x})\\), vastly smaller than the "signal."'
                }
            ]
        },

        // ================================================================
        // SECTION 2: The Explicit Formula for psi(x)
        // ================================================================
        {
            id: 'sec-von-mangoldt',
            title: 'The Explicit Formula for \\(\\psi(x)\\)',
            content: `
<h2>The Explicit Formula for \\(\\psi(x)\\)</h2>

<div class="env-block intuition">
    <div class="env-title">The Grand Decomposition</div>
    <div class="env-body">
        <p>The explicit formula is the spectral decomposition of the prime counting problem. Just as Fourier analysis decomposes a signal into frequencies, the explicit formula decomposes \\(\\psi(x)\\) into contributions from the "spectrum" of the zeta function: its poles and zeros.</p>
    </div>
</div>

<h3>Statement</h3>

<div class="env-block theorem">
    <div class="env-title">Theorem 8.1 (von Mangoldt's Explicit Formula)</div>
    <div class="env-body">
        <p>For \\(x > 1\\) not a prime power,</p>
        \\[
        \\psi(x) = x - \\sum_{\\rho} \\frac{x^\\rho}{\\rho} - \\frac{\\zeta'(0)}{\\zeta(0)} - \\frac{1}{2}\\log(1 - x^{-2}),
        \\]
        <p>where the sum runs over all nontrivial zeros \\(\\rho\\) of \\(\\zeta(s)\\), arranged symmetrically (pairing \\(\\rho\\) with \\(\\bar{\\rho}\\)), and</p>
        \\[
        \\frac{\\zeta'(0)}{\\zeta(0)} = \\log 2\\pi.
        \\]
    </div>
</div>

<h3>Reading the Formula</h3>

<p>Let us parse each term:</p>

<ul>
    <li><strong>\\(x\\)</strong>: the "main term," corresponding to the pole of \\(\\zeta(s)\\) at \\(s = 1\\). This gives the Prime Number Theorem.</li>
    <li><strong>\\(-\\sum_\\rho x^\\rho / \\rho\\)</strong>: the oscillatory corrections from the nontrivial zeros. Each zero contributes one wave. This is the heart of the formula.</li>
    <li><strong>\\(-\\log 2\\pi\\)</strong>: a constant from the value \\(\\zeta'(0)/\\zeta(0)\\).</li>
    <li><strong>\\(-\\tfrac{1}{2}\\log(1 - x^{-2})\\)</strong>: the contribution of the trivial zeros \\(\\rho = -2, -4, -6, \\ldots\\). For large \\(x\\) this is negligible.</li>
</ul>

<h3>Sketch of the Proof</h3>

<p>The proof uses Perron's formula to express \\(\\psi(x)\\) as a contour integral of \\(-\\zeta'(s)/\\zeta(s) \\cdot x^s/s\\), then shifts the contour to the left, picking up residues at each pole of the integrand:</p>
<ol>
    <li>The pole of \\(x^s/s \\cdot (-\\zeta'/\\zeta)\\) at \\(s = 1\\) (from the simple pole of \\(\\zeta\\)) gives residue \\(x\\).</li>
    <li>Each nontrivial zero \\(\\rho\\) contributes residue \\(-x^\\rho/\\rho\\).</li>
    <li>The trivial zeros and the pole of \\(1/s\\) at \\(s = 0\\) give the remaining terms.</li>
</ol>

<div class="env-block remark">
    <div class="env-title">Convergence</div>
    <div class="env-body">
        <p>The sum over zeros converges only conditionally: one must pair each \\(\\rho\\) with \\(\\bar{\\rho}\\), i.e., sum over \\(|\\operatorname{Im}(\\rho)| \\leq T\\) and let \\(T \\to \\infty\\). The individual terms \\(x^\\rho / \\rho\\) do not go to zero fast enough for absolute convergence.</p>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-explicit-formula-anatomy"></div>
`,
            visualizations: [
                {
                    id: 'viz-explicit-formula-anatomy',
                    title: 'Anatomy of the Explicit Formula',
                    description: 'See how each piece of the explicit formula contributes to the final result. The main term x, the zero sum, and the constant terms combine to produce the staircase of psi(x).',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 380,
                            originX: 60, originY: 340, scale: 1
                        });
                        var GAMMAS = [14.134725, 21.022040, 25.010858, 30.424876, 32.935062,
                            37.586178, 40.918719, 43.327073, 48.005151, 49.773832];
                        var nZeros = 5;
                        var showMain = true;
                        var showZeros = true;

                        VizEngine.createSlider(controls, 'Zeros', 0, 10, nZeros, 1, function(v) {
                            nZeros = Math.round(v);
                            draw();
                        });

                        var primes = VizEngine.sievePrimes(200);
                        function vonMangoldt(n) {
                            for (var i = 0; i < primes.length; i++) {
                                var p = primes[i];
                                if (p > n) break;
                                var pk = p;
                                while (pk <= n) {
                                    if (pk === n) return Math.log(p);
                                    pk *= p;
                                }
                            }
                            return 0;
                        }

                        function psiExact(x) {
                            var s = 0;
                            for (var n = 2; n <= x; n++) s += vonMangoldt(n);
                            return s;
                        }

                        function zeroSum(x, N) {
                            var s = 0;
                            for (var k = 0; k < N && k < GAMMAS.length; k++) {
                                var g = GAMMAS[k];
                                var logx = Math.log(x);
                                // x^rho/rho + x^rhobar/rhobar, rho = 1/2 + ig
                                // = 2 Re(x^rho / rho)
                                var sqrtX = Math.sqrt(x);
                                var cosG = Math.cos(g * logx);
                                var sinG = Math.sin(g * logx);
                                var denom = 0.25 + g * g;
                                // Re(x^rho / rho) = sqrt(x) * (0.5 * cos(g logx) + g * sin(g logx)) / (0.25 + g^2)
                                var re = sqrtX * (0.5 * cosG + g * sinG) / denom;
                                s += 2 * re;
                            }
                            return s;
                        }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var W = viz.width - 80;
                            var H = 300;
                            var left = 60;
                            var bottom = 340;
                            var xMax = 100;

                            // Scale
                            var yMax = xMax * 1.1;
                            function toSx(x) { return left + (x / xMax) * W; }
                            function toSy(y) { return bottom - (y / yMax) * H; }

                            // Grid
                            ctx.strokeStyle = viz.colors.grid;
                            ctx.lineWidth = 0.5;
                            for (var gx = 20; gx <= xMax; gx += 20) {
                                ctx.beginPath(); ctx.moveTo(toSx(gx), bottom); ctx.lineTo(toSx(gx), bottom - H); ctx.stroke();
                                ctx.fillStyle = viz.colors.text; ctx.font = '10px -apple-system,sans-serif';
                                ctx.textAlign = 'center'; ctx.textBaseline = 'top';
                                ctx.fillText(gx.toString(), toSx(gx), bottom + 4);
                            }
                            for (var gy = 20; gy <= yMax; gy += 20) {
                                ctx.beginPath(); ctx.moveTo(left, toSy(gy)); ctx.lineTo(left + W, toSy(gy)); ctx.stroke();
                                ctx.fillStyle = viz.colors.text; ctx.font = '10px -apple-system,sans-serif';
                                ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
                                ctx.fillText(gy.toString(), left - 4, toSy(gy));
                            }

                            // Axes
                            ctx.strokeStyle = viz.colors.axis; ctx.lineWidth = 1;
                            ctx.beginPath(); ctx.moveTo(left, bottom); ctx.lineTo(left + W, bottom); ctx.stroke();
                            ctx.beginPath(); ctx.moveTo(left, bottom); ctx.lineTo(left, bottom - H); ctx.stroke();

                            // Main term y = x
                            if (showMain) {
                                ctx.strokeStyle = viz.colors.blue + '88';
                                ctx.lineWidth = 1.5;
                                ctx.setLineDash([6, 4]);
                                ctx.beginPath();
                                ctx.moveTo(toSx(2), toSy(2));
                                ctx.lineTo(toSx(xMax), toSy(xMax));
                                ctx.stroke();
                                ctx.setLineDash([]);
                            }

                            // Approximation: x - sum_rho - log2pi
                            if (showZeros) {
                                ctx.strokeStyle = viz.colors.teal;
                                ctx.lineWidth = 2;
                                ctx.beginPath();
                                var started = false;
                                for (var px = 0; px <= W; px++) {
                                    var xv = 2 + (px / W) * (xMax - 2);
                                    var yv = xv - zeroSum(xv, nZeros) - Math.log(2 * Math.PI);
                                    if (!isFinite(yv)) { started = false; continue; }
                                    var sx = toSx(xv);
                                    var sy = toSy(yv);
                                    if (!started) { ctx.moveTo(sx, sy); started = true; }
                                    else ctx.lineTo(sx, sy);
                                }
                                ctx.stroke();
                            }

                            // Exact psi(x) staircase
                            ctx.strokeStyle = viz.colors.white;
                            ctx.lineWidth = 1.5;
                            ctx.beginPath();
                            var prevPsi = 0;
                            for (var n = 2; n <= xMax; n++) {
                                var curPsi = psiExact(n);
                                ctx.moveTo(toSx(n - 1), toSy(prevPsi));
                                ctx.lineTo(toSx(n), toSy(prevPsi));
                                if (curPsi !== prevPsi) {
                                    ctx.lineTo(toSx(n), toSy(curPsi));
                                }
                                prevPsi = curPsi;
                            }
                            ctx.stroke();

                            // Legend
                            var legY = 18;
                            ctx.font = '11px -apple-system,sans-serif';
                            ctx.textAlign = 'left';
                            ctx.fillStyle = viz.colors.white;
                            ctx.fillRect(left + 10, legY - 5, 8, 8);
                            ctx.fillText('\u03C8(x) exact', left + 22, legY + 1);

                            ctx.fillStyle = viz.colors.blue + '88';
                            ctx.fillRect(left + 120, legY - 5, 8, 8);
                            ctx.fillText('main term x', left + 132, legY + 1);

                            ctx.fillStyle = viz.colors.teal;
                            ctx.fillRect(left + 240, legY - 5, 8, 8);
                            ctx.fillText('x \u2212 \u03A3 x\u1D68/\u03C1 (' + nZeros + ' zeros)', left + 252, legY + 1);
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Explain why the pole of \\(\\zeta(s)\\) at \\(s = 1\\) gives the main term \\(x\\) in the explicit formula, while a zero \\(\\rho\\) gives a correction \\(-x^\\rho / \\rho\\).',
                    hint: 'Think about Perron\'s formula and residue calculus. What is the residue of \\(-\\zeta\'(s)/\\zeta(s) \\cdot x^s/s\\) at \\(s = 1\\)?',
                    solution: 'The logarithmic derivative \\(-\\zeta\'(s)/\\zeta(s)\\) has a simple pole with residue \\(+1\\) at \\(s = 1\\) (since \\(\\zeta\\) has a simple pole there). So the residue of \\(-\\zeta\'(s)/\\zeta(s) \\cdot x^s/s\\) at \\(s = 1\\) is \\(x^1/1 = x\\). At a zero \\(\\rho\\), \\(-\\zeta\'/\\zeta\\) has residue \\(-1\\) (simple zero), giving residue \\(-x^\\rho / \\rho\\).'
                },
                {
                    question: 'The trivial zeros of \\(\\zeta(s)\\) are at \\(s = -2, -4, -6, \\ldots\\). What is \\(x^{-2n}\\) for large \\(x\\)? Why can we typically ignore these terms?',
                    hint: 'Compute \\(x^{-2}\\) for \\(x = 1000\\).',
                    solution: '\\(x^{-2n} = 1/x^{2n}\\), which is extremely small for large \\(x\\). For instance, \\(1000^{-2} = 10^{-6}\\). The sum \\(\\sum_{n=1}^\\infty x^{-2n}/(2n) = \\tfrac{1}{2}\\log(1 - x^{-2})\\) converges to a negligible constant. These trivial-zero contributions vanish rapidly and are typically ignored in asymptotic analysis.'
                }
            ]
        },

        // ================================================================
        // SECTION 3: Individual Zero Contributions
        // ================================================================
        {
            id: 'sec-individual-zeros',
            title: 'The Contribution of a Single Zero',
            content: `
<h2>The Contribution of a Single Zero: \\(x^\\rho / \\rho\\)</h2>

<div class="env-block intuition">
    <div class="env-title">One Note in the Symphony</div>
    <div class="env-body">
        <p>To understand the orchestra, first listen to a single instrument. A single zero \\(\\rho = \\beta + i\\gamma\\) contributes the term \\(-x^\\rho / \\rho\\) to \\(\\psi(x)\\). Since zeros come in conjugate pairs (\\(\\bar{\\rho}\\) is also a zero), we pair them to get a real-valued oscillation:</p>
        \\[
        -\\frac{x^\\rho}{\\rho} - \\frac{x^{\\bar{\\rho}}}{\\bar{\\rho}} = -2\\operatorname{Re}\\!\\left(\\frac{x^\\rho}{\\rho}\\right).
        \\]
    </div>
</div>

<h3>Unpacking the Complex Exponential</h3>

<p>Write \\(\\rho = \\beta + i\\gamma\\) and \\(\\rho = |\\rho| e^{i\\theta}\\) where \\(\\theta = \\arg(\\rho)\\). Then:</p>
\\[
\\frac{x^\\rho}{\\rho} = \\frac{x^\\beta}{|\\rho|} \\cdot e^{i(\\gamma \\log x - \\theta)}.
\\]
<p>So the paired contribution is:</p>
\\[
-2\\operatorname{Re}\\!\\left(\\frac{x^\\rho}{\\rho}\\right) = -\\frac{2 x^\\beta}{|\\rho|} \\cos(\\gamma \\log x - \\theta).
\\]

<p>This is a cosine wave in \\(\\log x\\)-space with:</p>
<ul>
    <li><strong>Amplitude envelope</strong> \\(2x^\\beta / |\\rho|\\): grows like \\(x^\\beta\\), which under RH is \\(\\sqrt{x}\\).</li>
    <li><strong>Frequency</strong> \\(\\gamma\\): higher zeros oscillate faster.</li>
    <li><strong>Phase</strong> \\(\\theta = \\arctan(\\gamma / \\beta) \\approx \\pi/2\\) for large \\(\\gamma\\).</li>
    <li><strong>Amplitude factor</strong> \\(1/|\\rho| \\approx 1/\\gamma\\): higher zeros have smaller amplitudes, so the lowest zeros dominate.</li>
</ul>

<div class="env-block definition">
    <div class="env-title">Definition (Wave from a Zero Pair)</div>
    <div class="env-body">
        <p>The <strong>wave contribution</strong> of the zero pair \\(\\{\\rho, \\bar{\\rho}\\}\\) with \\(\\rho = \\beta + i\\gamma\\) to \\(\\psi(x)\\) is</p>
        \\[
        W_\\rho(x) = -\\frac{2 x^\\beta}{|\\rho|} \\cos\\bigl(\\gamma \\log x - \\arg(\\rho)\\bigr).
        \\]
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-single-zero-wave"></div>
`,
            visualizations: [
                {
                    id: 'viz-single-zero-wave',
                    title: 'Wave from a Single Zero Pair',
                    description: 'Visualize the oscillatory contribution of a single zero pair. Drag the slider to choose which zero (by index). The wave\'s frequency increases and amplitude decreases as you go to higher zeros.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 360,
                            originX: 60, originY: 180, scale: 1
                        });
                        var GAMMAS = [14.134725, 21.022040, 25.010858, 30.424876, 32.935062,
                            37.586178, 40.918719, 43.327073, 48.005151, 49.773832,
                            52.970321, 56.446248, 59.347044, 60.831779, 65.112544,
                            67.079811, 69.546402, 72.067158, 75.704691, 77.144840];
                        var zeroIdx = 0;

                        VizEngine.createSlider(controls, 'Zero #', 1, 20, 1, 1, function(v) {
                            zeroIdx = Math.round(v) - 1;
                            draw();
                        });

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var W = viz.width - 80;
                            var H = 140;
                            var left = 60;

                            var g = GAMMAS[zeroIdx];
                            var beta = 0.5; // Assuming RH
                            var modRho = Math.sqrt(beta * beta + g * g);
                            var argRho = Math.atan2(g, beta);

                            viz.screenText('Zero #' + (zeroIdx + 1) + ':  \u03C1 = 1/2 + ' + g.toFixed(2) + 'i', viz.width / 2, 20, viz.colors.white, 14);
                            viz.screenText('Frequency \u03B3 = ' + g.toFixed(2) + ',  Amplitude factor 1/|\u03C1| = ' + (1 / modRho).toFixed(4), viz.width / 2, 40, viz.colors.text, 11);

                            // Draw the wave W_rho(x) for x in [2, 200]
                            var xMin = 2, xMax = 200;
                            var yMax = 0;
                            // Pre-scan for scale
                            for (var px = 0; px <= W; px++) {
                                var xv = xMin + (px / W) * (xMax - xMin);
                                var sqrtX = Math.sqrt(xv);
                                var val = 2 * sqrtX / modRho;
                                if (val > yMax) yMax = val;
                            }
                            yMax *= 1.2;

                            function toSx(x) { return left + ((x - xMin) / (xMax - xMin)) * W; }
                            function toSy(y) { return 200 - (y / yMax) * H; }

                            // Axis
                            ctx.strokeStyle = viz.colors.axis; ctx.lineWidth = 0.5;
                            ctx.beginPath(); ctx.moveTo(left, 200); ctx.lineTo(left + W, 200); ctx.stroke();

                            // Envelope
                            ctx.strokeStyle = viz.colors.orange + '44';
                            ctx.lineWidth = 1;
                            ctx.setLineDash([4, 3]);
                            ctx.beginPath();
                            for (var px2 = 0; px2 <= W; px2++) {
                                var xv2 = xMin + (px2 / W) * (xMax - xMin);
                                var env = 2 * Math.sqrt(xv2) / modRho;
                                if (px2 === 0) ctx.moveTo(toSx(xv2), toSy(env));
                                else ctx.lineTo(toSx(xv2), toSy(env));
                            }
                            ctx.stroke();
                            ctx.beginPath();
                            for (var px3 = 0; px3 <= W; px3++) {
                                var xv3 = xMin + (px3 / W) * (xMax - xMin);
                                var envN = -2 * Math.sqrt(xv3) / modRho;
                                if (px3 === 0) ctx.moveTo(toSx(xv3), toSy(envN));
                                else ctx.lineTo(toSx(xv3), toSy(envN));
                            }
                            ctx.stroke();
                            ctx.setLineDash([]);

                            // Wave
                            ctx.strokeStyle = viz.colors.blue;
                            ctx.lineWidth = 2;
                            ctx.beginPath();
                            for (var px4 = 0; px4 <= W; px4++) {
                                var xv4 = xMin + (px4 / W) * (xMax - xMin);
                                var sqX = Math.sqrt(xv4);
                                var wave = -2 * sqX / modRho * Math.cos(g * Math.log(xv4) - argRho);
                                if (px4 === 0) ctx.moveTo(toSx(xv4), toSy(wave));
                                else ctx.lineTo(toSx(xv4), toSy(wave));
                            }
                            ctx.stroke();

                            // x-axis labels
                            ctx.fillStyle = viz.colors.text; ctx.font = '10px -apple-system,sans-serif';
                            ctx.textAlign = 'center'; ctx.textBaseline = 'top';
                            for (var lx = 50; lx <= xMax; lx += 50) {
                                ctx.fillText(lx.toString(), toSx(lx), 204);
                            }
                            viz.screenText('x', left + W + 15, 200, viz.colors.text, 11);

                            // Legend
                            viz.screenText('\u2500 Wave W_\u03C1(x)', left + 60, 330, viz.colors.blue, 11);
                            viz.screenText('--- Envelope \u00B1 2\u221Ax/|\u03C1|', left + 220, 330, viz.colors.orange, 11);
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Show that pairing \\(\\rho\\) with \\(\\bar{\\rho}\\) in \\(-x^\\rho/\\rho - x^{\\bar{\\rho}}/\\bar{\\rho}\\) produces a real-valued expression. Write it explicitly in terms of \\(\\cos\\) and \\(\\sin\\).',
                    hint: 'Use \\(x^{\\bar{\\rho}} = \\overline{x^\\rho}\\) (since \\(x\\) is real and positive) and \\(\\operatorname{Re}(z) = (z + \\bar{z})/2\\).',
                    solution: 'Since \\(x > 0\\), \\(x^{\\bar{\\rho}} = \\overline{x^\\rho}\\). Then \\(-x^\\rho/\\rho - x^{\\bar{\\rho}}/\\bar{\\rho} = -x^\\rho/\\rho - \\overline{x^\\rho/\\rho} = -2\\operatorname{Re}(x^\\rho/\\rho)\\). Writing \\(\\rho = \\beta + i\\gamma\\): \\(x^\\rho = x^\\beta e^{i\\gamma\\log x}\\), and \\(1/\\rho = (\\beta - i\\gamma)/(\\beta^2 + \\gamma^2)\\), so \\(\\operatorname{Re}(x^\\rho/\\rho) = \\frac{x^\\beta}{\\beta^2+\\gamma^2}[\\beta\\cos(\\gamma\\log x) + \\gamma\\sin(\\gamma\\log x)]\\).'
                },
                {
                    question: 'The first zero has \\(\\gamma_1 \\approx 14.13\\). At what values of \\(x\\) does its wave contribution \\(W_{\\rho_1}(x)\\) cross zero (i.e., the cosine vanishes)?',
                    hint: '\\(\\cos(\\gamma \\log x - \\theta) = 0\\) when \\(\\gamma \\log x - \\theta = \\pi/2 + n\\pi\\).',
                    solution: 'The crossings occur at \\(\\gamma_1 \\log x = \\theta + \\pi/2 + n\\pi\\), so \\(x = \\exp((\\theta + \\pi/2 + n\\pi)/\\gamma_1)\\). With \\(\\theta \\approx \\arctan(14.13/0.5) \\approx 1.535\\), the first few crossings are at \\(x \\approx e^{(1.535 + 1.571)/14.13} \\approx e^{0.220} \\approx 1.25\\), then spacing in multiplicative steps of \\(e^{\\pi/14.13} \\approx e^{0.222} \\approx 1.249\\).'
                }
            ]
        },

        // ================================================================
        // SECTION 4: Riemann's Explicit Formula for pi(x)
        // ================================================================
        {
            id: 'sec-riemann-explicit',
            title: "Riemann's Formula for \\(\\pi(x)\\)",
            content: `
<h2>Riemann's Explicit Formula for \\(\\pi(x)\\)</h2>

<div class="env-block intuition">
    <div class="env-title">From \\(\\psi\\) to \\(\\pi\\)</div>
    <div class="env-body">
        <p>The von Mangoldt formula gives \\(\\psi(x)\\) in terms of zeros. Since \\(\\psi(x) = \\sum_{p^k \\leq x} \\log p\\) and \\(\\pi(x) = \\#\\{p \\leq x\\}\\), we can translate between them. Riemann's original formula expresses \\(\\pi(x)\\) directly in terms of the logarithmic integral and zero contributions.</p>
    </div>
</div>

<h3>The Logarithmic Integral and Its Cousins</h3>

<div class="env-block definition">
    <div class="env-title">Definition (Logarithmic Integral)</div>
    <div class="env-body">
        <p>The <strong>logarithmic integral</strong> is defined as</p>
        \\[
        \\operatorname{Li}(x) = \\int_2^x \\frac{dt}{\\log t}.
        \\]
        <p>(Some authors use the offset integral from 0 with a principal value; we use the version starting at 2.)</p>
    </div>
</div>

<h3>Riemann's Formula</h3>

<div class="env-block theorem">
    <div class="env-title">Theorem 8.2 (Riemann's Explicit Formula for \\(\\pi(x)\\))</div>
    <div class="env-body">
        <p>For \\(x > 1\\),</p>
        \\[
        \\pi(x) = \\operatorname{Li}(x) - \\sum_{\\rho} \\operatorname{Li}(x^\\rho) - \\log 2 + \\int_x^\\infty \\frac{dt}{t(t^2 - 1)\\log t},
        \\]
        <p>where the sum is over all nontrivial zeros of \\(\\zeta(s)\\), taken in conjugate pairs.</p>
    </div>
</div>

<p>This is the formula Riemann stated (without complete proof) in 1859. The key insight is that \\(\\operatorname{Li}(x^\\rho)\\) captures the oscillatory behavior: for \\(\\rho\\) near the critical line, \\(\\operatorname{Li}(x^\\rho)\\) produces oscillations that correct \\(\\operatorname{Li}(x)\\) to match the actual staircase of \\(\\pi(x)\\).</p>

<h3>Connection to the von Mangoldt Formula</h3>

<p>Since \\(\\psi(x) = \\sum_{p^k \\leq x} \\log p = \\int_2^x \\log t \\, d\\pi^*(t)\\) (where \\(\\pi^*(t)\\) counts prime powers with weight 1), one can recover \\(\\pi(x)\\) from \\(\\psi(x)\\) via partial summation (Abel summation / summation by parts). The translation replaces \\(x^\\rho / \\rho\\) by \\(\\operatorname{Li}(x^\\rho)\\), which is the "smoothed" version.</p>

<div class="viz-placeholder" data-viz="viz-cumulative-zeros"></div>
`,
            visualizations: [
                {
                    id: 'viz-cumulative-zeros',
                    title: 'Riemann\'s Formula: Li(x) Corrected by Zeros',
                    description: 'Watch how adding more zeros corrects Li(x) toward the actual prime counting function pi(x). Each zero refines the approximation.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 380,
                            originX: 60, originY: 340, scale: 1
                        });
                        var GAMMAS = [14.134725, 21.022040, 25.010858, 30.424876, 32.935062,
                            37.586178, 40.918719, 43.327073, 48.005151, 49.773832,
                            52.970321, 56.446248, 59.347044, 60.831779, 65.112544];
                        var nZeros = 5;

                        VizEngine.createSlider(controls, 'Zeros', 0, 15, nZeros, 1, function(v) {
                            nZeros = Math.round(v);
                            draw();
                        });

                        var primes = VizEngine.sievePrimes(200);
                        function piExact(x) {
                            var c = 0;
                            for (var i = 0; i < primes.length; i++) {
                                if (primes[i] > x) break;
                                c++;
                            }
                            return c;
                        }

                        function Li(x) {
                            if (x <= 2) return 0;
                            var s = 0, dt = 0.1;
                            for (var t = 2; t < x; t += dt) {
                                s += dt / Math.log(t);
                            }
                            return s;
                        }

                        // Approximate Li(x^rho) contribution for a pair
                        function zeroCorrection(x, N) {
                            var s = 0;
                            for (var k = 0; k < N && k < GAMMAS.length; k++) {
                                var g = GAMMAS[k];
                                var logx = Math.log(x);
                                var sqrtX = Math.sqrt(x);
                                var modRho = Math.sqrt(0.25 + g * g);
                                var argRho = Math.atan2(g, 0.5);
                                // Approximate: Re(Li(x^rho)) ~ Re(x^rho / (rho * log(x)))
                                // for moderate x, use: -2*Re(x^rho/rho) / log(x)
                                if (logx < 0.01) continue;
                                var cosG = Math.cos(g * logx - argRho);
                                var re = sqrtX * cosG / modRho;
                                s += 2 * re / logx;
                            }
                            return s;
                        }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var W = viz.width - 80;
                            var H = 300;
                            var left = 60;
                            var bottom = 340;
                            var xMax = 100;
                            var yMax = 30;

                            function toSx(x) { return left + (x / xMax) * W; }
                            function toSy(y) { return bottom - (y / yMax) * H; }

                            // Grid
                            ctx.strokeStyle = viz.colors.grid; ctx.lineWidth = 0.5;
                            for (var gx = 10; gx <= xMax; gx += 10) {
                                ctx.beginPath(); ctx.moveTo(toSx(gx), bottom); ctx.lineTo(toSx(gx), bottom - H); ctx.stroke();
                            }
                            for (var gy = 5; gy <= yMax; gy += 5) {
                                ctx.beginPath(); ctx.moveTo(left, toSy(gy)); ctx.lineTo(left + W, toSy(gy)); ctx.stroke();
                                ctx.fillStyle = viz.colors.text; ctx.font = '10px -apple-system,sans-serif';
                                ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
                                ctx.fillText(gy.toString(), left - 4, toSy(gy));
                            }

                            // Axes
                            ctx.strokeStyle = viz.colors.axis; ctx.lineWidth = 1;
                            ctx.beginPath(); ctx.moveTo(left, bottom); ctx.lineTo(left + W, bottom); ctx.stroke();
                            ctx.beginPath(); ctx.moveTo(left, bottom); ctx.lineTo(left, bottom - H); ctx.stroke();

                            // pi(x) staircase
                            ctx.strokeStyle = viz.colors.white; ctx.lineWidth = 1.5;
                            ctx.beginPath();
                            var prevPi = 0;
                            for (var n = 2; n <= xMax; n++) {
                                var curPi = piExact(n);
                                ctx.moveTo(toSx(n - 1), toSy(prevPi));
                                ctx.lineTo(toSx(n), toSy(prevPi));
                                if (curPi !== prevPi) ctx.lineTo(toSx(n), toSy(curPi));
                                prevPi = curPi;
                            }
                            ctx.stroke();

                            // Li(x) curve
                            ctx.strokeStyle = viz.colors.blue + '88';
                            ctx.lineWidth = 1.5;
                            ctx.setLineDash([6, 4]);
                            ctx.beginPath();
                            for (var px = 0; px <= W; px++) {
                                var xv = 2.5 + (px / W) * (xMax - 2.5);
                                var yv = Li(xv);
                                if (px === 0) ctx.moveTo(toSx(xv), toSy(yv));
                                else ctx.lineTo(toSx(xv), toSy(yv));
                            }
                            ctx.stroke();
                            ctx.setLineDash([]);

                            // Corrected curve
                            if (nZeros > 0) {
                                ctx.strokeStyle = viz.colors.teal;
                                ctx.lineWidth = 2;
                                ctx.beginPath();
                                for (var px2 = 0; px2 <= W; px2++) {
                                    var xv2 = 2.5 + (px2 / W) * (xMax - 2.5);
                                    var yv2 = Li(xv2) - zeroCorrection(xv2, nZeros);
                                    if (px2 === 0) ctx.moveTo(toSx(xv2), toSy(yv2));
                                    else ctx.lineTo(toSx(xv2), toSy(yv2));
                                }
                                ctx.stroke();
                            }

                            // Legend
                            var legY = 18;
                            ctx.font = '11px -apple-system,sans-serif'; ctx.textAlign = 'left';
                            ctx.fillStyle = viz.colors.white;
                            ctx.fillRect(left + 10, legY - 5, 8, 8);
                            ctx.fillText('\u03C0(x)', left + 22, legY + 1);
                            ctx.fillStyle = viz.colors.blue + '88';
                            ctx.fillRect(left + 80, legY - 5, 8, 8);
                            ctx.fillText('Li(x)', left + 92, legY + 1);
                            if (nZeros > 0) {
                                ctx.fillStyle = viz.colors.teal;
                                ctx.fillRect(left + 140, legY - 5, 8, 8);
                                ctx.fillText('Li(x) \u2212 zeros (' + nZeros + ')', left + 152, legY + 1);
                            }

                            // x labels
                            ctx.fillStyle = viz.colors.text; ctx.font = '10px -apple-system,sans-serif';
                            ctx.textAlign = 'center'; ctx.textBaseline = 'top';
                            for (var lx = 20; lx <= xMax; lx += 20) {
                                ctx.fillText(lx.toString(), toSx(lx), bottom + 4);
                            }
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Show that \\(\\operatorname{Li}(x) \\sim x / \\log x\\) as \\(x \\to \\infty\\) by integration by parts.',
                    hint: 'Write \\(\\int_2^x dt/\\log t\\) and integrate by parts with \\(u = 1/\\log t\\), \\(dv = dt\\).',
                    solution: 'Integrating by parts: \\(\\operatorname{Li}(x) = \\frac{x}{\\log x} - \\frac{2}{\\log 2} + \\int_2^x \\frac{dt}{(\\log t)^2}\\). The integral is \\(O(x / (\\log x)^2)\\), so \\(\\operatorname{Li}(x) = \\frac{x}{\\log x} + O\\!\\left(\\frac{x}{(\\log x)^2}\\right) \\sim \\frac{x}{\\log x}\\).'
                }
            ]
        },

        // ================================================================
        // SECTION 5: The Error Term Under RH
        // ================================================================
        {
            id: 'sec-rh-error',
            title: 'The Error Term Under RH',
            content: `
<h2>The Error Term Under the Riemann Hypothesis</h2>

<div class="env-block intuition">
    <div class="env-title">The Stakes of RH</div>
    <div class="env-body">
        <p>The Riemann Hypothesis (RH) asserts that every nontrivial zero \\(\\rho\\) satisfies \\(\\operatorname{Re}(\\rho) = 1/2\\). Why does this matter for primes? Because the explicit formula tells us that the error \\(\\psi(x) - x\\) is controlled by \\(\\sum x^\\rho / \\rho\\). If all \\(\\beta = 1/2\\), then each \\(|x^\\rho| = \\sqrt{x}\\), giving the best possible error bound.</p>
    </div>
</div>

<h3>The Classical Error Bound</h3>

<div class="env-block theorem">
    <div class="env-title">Theorem 8.3 (de la Vallee Poussin, 1899)</div>
    <div class="env-body">
        <p>There exists a constant \\(c > 0\\) such that</p>
        \\[
        \\psi(x) = x + O\\!\\left(x \\exp\\bigl(-c \\sqrt{\\log x}\\bigr)\\right).
        \\]
        <p>Equivalently, \\(\\pi(x) = \\operatorname{Li}(x) + O\\!\\left(x \\exp(-c\\sqrt{\\log x})\\right)\\).</p>
    </div>
</div>

<p>This follows from the zero-free region \\(\\sigma \\geq 1 - c / \\log t\\) established in Chapter 6. The error comes from estimating the sum over zeros using the density of zeros near the critical line.</p>

<h3>The Error Under RH</h3>

<div class="env-block theorem">
    <div class="env-title">Theorem 8.4 (von Koch, 1901)</div>
    <div class="env-body">
        <p>If the Riemann Hypothesis is true, then</p>
        \\[
        \\psi(x) = x + O(\\sqrt{x} \\log^2 x),
        \\]
        <p>and consequently</p>
        \\[
        \\pi(x) = \\operatorname{Li}(x) + O(\\sqrt{x} \\log x).
        \\]
    </div>
</div>

<p>The proof is direct from the explicit formula: if all zeros have \\(\\beta = 1/2\\), then</p>
\\[
\\left|\\sum_{|\\gamma| \\leq T} \\frac{x^\\rho}{\\rho}\\right| \\leq \\sqrt{x} \\sum_{|\\gamma| \\leq T} \\frac{1}{|\\rho|} = O(\\sqrt{x} \\log^2 T),
\\]
<p>using the zero-counting function \\(N(T) = O(T \\log T)\\), and choosing \\(T = x\\).</p>

<h3>The Converse Direction</h3>

<div class="env-block theorem">
    <div class="env-title">Theorem 8.5</div>
    <div class="env-body">
        <p>The Riemann Hypothesis is equivalent to the statement</p>
        \\[
        \\pi(x) = \\operatorname{Li}(x) + O(\\sqrt{x} \\log x).
        \\]
        <p>It is also equivalent to: for every \\(\\varepsilon > 0\\), \\(\\psi(x) = x + O(x^{1/2 + \\varepsilon})\\).</p>
    </div>
</div>

<div class="env-block remark">
    <div class="env-title">Skewes' Number</div>
    <div class="env-body">
        <p>For all computed values of \\(x\\), \\(\\pi(x) < \\operatorname{Li}(x)\\). Littlewood (1914) proved that \\(\\pi(x) - \\operatorname{Li}(x)\\) changes sign infinitely often. Skewes (1933) showed, assuming RH, that the first sign change occurs before \\(x < e^{e^{e^{79}}}\\), an astronomically large number now called Skewes' number. Modern estimates place the first crossing near \\(x \\approx 1.397 \\times 10^{316}\\).</p>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-rh-vs-classical"></div>
<div class="viz-placeholder" data-viz="viz-skewes"></div>
`,
            visualizations: [
                {
                    id: 'viz-rh-vs-classical',
                    title: 'Error Bounds: Classical vs. RH',
                    description: 'Compare the classical error bound (de la Vallee Poussin) with the RH-conditional bound (von Koch). The RH bound is dramatically tighter.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 380,
                            originX: 80, originY: 340, scale: 1
                        });

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var W = viz.width - 100;
                            var H = 300;
                            var left = 80;
                            var bottom = 340;

                            // Plot in log-log: x-axis = log10(x), y-axis = log10(error bound)
                            var logXmin = 1, logXmax = 12; // x from 10 to 10^12
                            var logYmin = 0, logYmax = 12;

                            function toSx(lx) { return left + ((lx - logXmin) / (logXmax - logXmin)) * W; }
                            function toSy(ly) { return bottom - ((ly - logYmin) / (logYmax - logYmin)) * H; }

                            // Grid
                            ctx.strokeStyle = viz.colors.grid; ctx.lineWidth = 0.5;
                            for (var gx = 2; gx <= logXmax; gx += 2) {
                                ctx.beginPath(); ctx.moveTo(toSx(gx), bottom); ctx.lineTo(toSx(gx), bottom - H); ctx.stroke();
                                ctx.fillStyle = viz.colors.text; ctx.font = '10px -apple-system,sans-serif';
                                ctx.textAlign = 'center'; ctx.textBaseline = 'top';
                                ctx.fillText('10^' + gx, toSx(gx), bottom + 4);
                            }
                            for (var gy = 2; gy <= logYmax; gy += 2) {
                                ctx.beginPath(); ctx.moveTo(left, toSy(gy)); ctx.lineTo(left + W, toSy(gy)); ctx.stroke();
                                ctx.fillStyle = viz.colors.text; ctx.font = '10px -apple-system,sans-serif';
                                ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
                                ctx.fillText('10^' + gy, left - 6, toSy(gy));
                            }

                            // Axes
                            ctx.strokeStyle = viz.colors.axis; ctx.lineWidth = 1;
                            ctx.beginPath(); ctx.moveTo(left, bottom); ctx.lineTo(left + W, bottom); ctx.stroke();
                            ctx.beginPath(); ctx.moveTo(left, bottom); ctx.lineTo(left, bottom - H); ctx.stroke();

                            // Classical bound: x * exp(-c * sqrt(log x)), log10 = log10(x) + (-c*sqrt(log x))/ln10
                            var c = 0.05;
                            ctx.strokeStyle = viz.colors.orange;
                            ctx.lineWidth = 2;
                            ctx.beginPath();
                            for (var px = 0; px <= W; px++) {
                                var logX = logXmin + (px / W) * (logXmax - logXmin);
                                var x_ln = logX * Math.log(10);
                                var logErr = logX - c * Math.sqrt(x_ln) / Math.log(10);
                                if (logErr < logYmin || logErr > logYmax) continue;
                                if (px === 0) ctx.moveTo(toSx(logX), toSy(logErr));
                                else ctx.lineTo(toSx(logX), toSy(logErr));
                            }
                            ctx.stroke();

                            // RH bound: sqrt(x) * (log x)^2, log10 = 0.5*log10(x) + 2*log10(log(x))
                            ctx.strokeStyle = viz.colors.teal;
                            ctx.lineWidth = 2;
                            ctx.beginPath();
                            var started = false;
                            for (var px2 = 0; px2 <= W; px2++) {
                                var logX2 = logXmin + (px2 / W) * (logXmax - logXmin);
                                var lnX = logX2 * Math.log(10);
                                var logErr2 = 0.5 * logX2 + 2 * Math.log10(lnX);
                                if (logErr2 < logYmin || logErr2 > logYmax) { started = false; continue; }
                                if (!started) { ctx.moveTo(toSx(logX2), toSy(logErr2)); started = true; }
                                else ctx.lineTo(toSx(logX2), toSy(logErr2));
                            }
                            ctx.stroke();

                            // Trivial bound: x itself
                            ctx.strokeStyle = viz.colors.red + '55';
                            ctx.lineWidth = 1;
                            ctx.setLineDash([4, 4]);
                            ctx.beginPath();
                            ctx.moveTo(toSx(logXmin), toSy(logXmin));
                            ctx.lineTo(toSx(logXmax), toSy(logXmax));
                            ctx.stroke();
                            ctx.setLineDash([]);

                            // Labels
                            viz.screenText('Error Bound Comparison (log-log scale)', viz.width / 2, 16, viz.colors.white, 14);
                            viz.screenText('log\u2081\u2080 x', viz.width / 2, bottom + 20, viz.colors.text, 11);

                            // Legend
                            var legY = 36;
                            ctx.font = '11px -apple-system,sans-serif'; ctx.textAlign = 'left';
                            ctx.fillStyle = viz.colors.orange;
                            ctx.fillRect(left + 10, legY, 16, 3);
                            ctx.fillText('Classical: x exp(\u2212c\u221A(log x))', left + 30, legY + 4);
                            ctx.fillStyle = viz.colors.teal;
                            ctx.fillRect(left + 10, legY + 18, 16, 3);
                            ctx.fillText('Under RH: \u221Ax (log x)\u00B2', left + 30, legY + 22);
                            ctx.fillStyle = viz.colors.red + '55';
                            ctx.fillRect(left + 10, legY + 36, 16, 3);
                            ctx.fillText('Trivial: x', left + 30, legY + 40);
                        }
                        draw();
                        return viz;
                    }
                },
                {
                    id: 'viz-skewes',
                    title: "Skewes' Number and Sign Changes",
                    description: "Li(x) overestimates pi(x) for all computed x, but Littlewood proved the difference changes sign infinitely often. This visualization shows the oscillations of pi(x) - Li(x) and why the first crossing requires enormous x.",
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 360,
                            originX: 60, originY: 180, scale: 1
                        });
                        var primes = VizEngine.sievePrimes(1000);

                        function piExact(x) {
                            var c = 0;
                            for (var i = 0; i < primes.length; i++) {
                                if (primes[i] > x) break;
                                c++;
                            }
                            return c;
                        }

                        function Li(x) {
                            if (x <= 2) return 0;
                            var s = 0, dt = 0.5;
                            for (var t = 2; t < x; t += dt) {
                                s += dt / Math.log(t);
                            }
                            return s;
                        }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var W = viz.width - 80;
                            var left = 60;
                            var xMax = 1000;

                            // Compute pi(x) - Li(x)
                            var diffs = [];
                            var yMin = 0, yMax2 = 0;
                            for (var x = 3; x <= xMax; x++) {
                                var d = piExact(x) - Li(x);
                                diffs.push({ x: x, d: d });
                                if (d < yMin) yMin = d;
                                if (d > yMax2) yMax2 = d;
                            }
                            yMin = Math.floor(yMin) - 1;
                            yMax2 = Math.ceil(yMax2) + 1;
                            var yRange = yMax2 - yMin;

                            var top = 50;
                            var H = 280;
                            function toSx(x) { return left + (x / xMax) * W; }
                            function toSy(y) { return top + H - ((y - yMin) / yRange) * H; }

                            // Zero line
                            ctx.strokeStyle = viz.colors.axis;
                            ctx.lineWidth = 1;
                            ctx.beginPath();
                            ctx.moveTo(left, toSy(0));
                            ctx.lineTo(left + W, toSy(0));
                            ctx.stroke();

                            // Shade regions
                            ctx.fillStyle = viz.colors.red + '11';
                            ctx.fillRect(left, top, W, toSy(0) - top);
                            ctx.fillStyle = viz.colors.teal + '11';
                            ctx.fillRect(left, toSy(0), W, top + H - toSy(0));

                            // Plot
                            ctx.strokeStyle = viz.colors.blue;
                            ctx.lineWidth = 1.5;
                            ctx.beginPath();
                            for (var i = 0; i < diffs.length; i++) {
                                var sx = toSx(diffs[i].x);
                                var sy = toSy(diffs[i].d);
                                if (i === 0) ctx.moveTo(sx, sy);
                                else ctx.lineTo(sx, sy);
                            }
                            ctx.stroke();

                            // Labels
                            viz.screenText('\u03C0(x) \u2212 Li(x)', viz.width / 2, 20, viz.colors.white, 14);
                            viz.screenText('Always negative for x \u2264 10\u00B3 (and far beyond)', viz.width / 2, 36, viz.colors.text, 11);

                            // Annotations
                            viz.screenText('\u03C0(x) > Li(x) would be here', left + W - 100, top + 15, viz.colors.red + '88', 10);
                            viz.screenText('\u03C0(x) < Li(x)', left + W - 80, toSy(0) + 15, viz.colors.teal, 10);

                            // x labels
                            ctx.fillStyle = viz.colors.text; ctx.font = '10px -apple-system,sans-serif';
                            ctx.textAlign = 'center'; ctx.textBaseline = 'top';
                            for (var lx = 200; lx <= xMax; lx += 200) {
                                ctx.fillText(lx.toString(), toSx(lx), top + H + 4);
                            }

                            // y labels
                            ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
                            for (var ly = Math.ceil(yMin); ly <= yMax2; ly++) {
                                if (ly % 2 !== 0) continue;
                                ctx.fillText(ly.toString(), left - 4, toSy(ly));
                            }
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Under RH, the error in \\(\\psi(x)\\) is \\(O(\\sqrt{x} \\log^2 x)\\). What does this imply about the error in \\(\\pi(x)\\)?',
                    hint: 'Use partial summation: \\(\\pi(x) \\approx \\psi(x) / \\log x\\). How does dividing by \\(\\log x\\) affect the error bound?',
                    solution: 'Since \\(\\pi(x) = \\psi(x)/\\log x + O(\\sqrt{x}/\\log^2 x)\\) by partial summation, and \\(\\psi(x) = x + O(\\sqrt{x}\\log^2 x)\\), we get \\(\\pi(x) = x/\\log x + O(\\sqrt{x}\\log^2 x / \\log x) = x/\\log x + O(\\sqrt{x}\\log x)\\). More precisely, \\(\\pi(x) = \\operatorname{Li}(x) + O(\\sqrt{x}\\log x)\\).'
                },
                {
                    question: 'Suppose a zero existed at \\(\\rho = 0.7 + i \\cdot 30\\). How would the error in \\(\\psi(x)\\) change compared to the RH prediction?',
                    hint: 'The contribution of this zero would be \\(O(x^{0.7})\\) instead of \\(O(x^{0.5})\\).',
                    solution: 'The zero at \\(\\rho = 0.7 + 30i\\) would contribute \\(O(x^{0.7}/|\\rho|)\\) to the error. Since \\(x^{0.7} \\gg x^{0.5}\\) for large \\(x\\), this would dominate, giving \\(\\psi(x) = x + O(x^{0.7})\\) rather than \\(O(x^{0.5+\\varepsilon})\\). The further a zero is from the critical line, the worse the error bound, which is why RH (all zeros on \\(\\operatorname{Re}(s) = 1/2\\)) gives the optimal bound.'
                },
                {
                    question: "Compute the approximate value of Skewes' number \\(e^{e^{e^{79}}}\\) in terms of the number of digits (order of magnitude).",
                    hint: 'Compute step by step: \\(e^{79}\\), then \\(e^{e^{79}}\\), then count decimal digits.',
                    solution: '\\(e^{79} \\approx 2.03 \\times 10^{34}\\). Then \\(e^{e^{79}} \\approx 10^{10^{34}}\\), a number with about \\(10^{34}\\) digits. Finally \\(e^{e^{e^{79}}} \\approx 10^{10^{10^{34}}}\\), which has \\(10^{10^{34}}\\) digits. This is incomprehensibly large; the observable universe has only about \\(10^{80}\\) atoms.'
                }
            ]
        },

        // ================================================================
        // SECTION 6: Bridge to the Next Chapter
        // ================================================================
        {
            id: 'sec-bridge',
            title: 'Looking Ahead: Primes in Arithmetic Progressions',
            content: `
<h2>Looking Ahead: Primes in Arithmetic Progressions</h2>

<div class="env-block intuition">
    <div class="env-title">Beyond \\(\\zeta(s)\\)</div>
    <div class="env-body">
        <p>The explicit formula for \\(\\psi(x)\\) uses the zeros of \\(\\zeta(s)\\) to understand <em>all</em> primes. But what if we want to count primes in a specific residue class, say primes \\(\\equiv 3 \\pmod{4}\\)? For this, we need a richer family of functions: the <strong>Dirichlet \\(L\\)-functions</strong> \\(L(s, \\chi)\\).</p>
    </div>
</div>

<h3>The Generalized Explicit Formula</h3>

<p>Define \\(\\psi(x; q, a) = \\sum_{n \\leq x, \\, n \\equiv a \\pmod{q}} \\Lambda(n)\\). An explicit formula analogous to Theorem 8.1 holds, but the sum over zeros now ranges over the zeros of all \\(L(s, \\chi)\\) for characters \\(\\chi \\pmod{q}\\):</p>
\\[
\\psi(x; q, a) = \\frac{x}{\\varphi(q)} - \\sum_{\\chi \\pmod{q}} \\frac{\\bar{\\chi}(a)}{\\varphi(q)} \\sum_\\rho \\frac{x^\\rho}{\\rho} + \\text{lower order},
\\]
<p>where \\(\\rho\\) runs over zeros of \\(L(s, \\chi)\\) and \\(\\varphi\\) is Euler's totient.</p>

<p>This formula is the engine behind <strong>Dirichlet's theorem</strong> (primes exist in every coprime residue class) and the quantitative study of how primes distribute among residue classes.</p>

<h3>The Generalized Riemann Hypothesis</h3>

<div class="env-block definition">
    <div class="env-title">Definition (GRH)</div>
    <div class="env-body">
        <p>The <strong>Generalized Riemann Hypothesis (GRH)</strong> asserts that for every Dirichlet character \\(\\chi\\), every nontrivial zero of \\(L(s, \\chi)\\) has \\(\\operatorname{Re}(s) = 1/2\\).</p>
    </div>
</div>

<p>Under GRH, the error in \\(\\psi(x; q, a)\\) becomes \\(O(\\sqrt{x} \\log^2 x)\\), just as in the case \\(q = 1\\). This has profound consequences: it implies that every arithmetic progression \\(a, a+q, a+2q, \\ldots\\) with \\(\\gcd(a, q) = 1\\) contains a prime \\(\\leq cq^2 \\log^2 q\\), a bound far stronger than what is known unconditionally.</p>

<h3>What Comes Next</h3>

<p>In Chapter 9, we develop the theory of <strong>Dirichlet characters</strong> and \\(L\\)-functions. These generalize the zeta function to "hear" individual residue classes. In Chapter 10, we prove Dirichlet's theorem and analyze the critical value \\(L(1, \\chi) \\neq 0\\) that makes everything work.</p>

<div class="env-block remark">
    <div class="env-title">The Big Picture</div>
    <div class="env-body">
        <p>The explicit formula is a bridge between two worlds: the <em>arithmetic</em> world of primes (discrete, irregular, mysterious) and the <em>analytic</em> world of zeta zeros (continuous, structured, accessible to complex analysis). Every advance in understanding the zeros translates directly into sharper results about primes. This is the central miracle of analytic number theory.</p>
    </div>
</div>
`,
            visualizations: [],
            exercises: [
                {
                    question: 'In the explicit formula for \\(\\psi(x; q, a)\\), why does the main term \\(x / \\varphi(q)\\) make sense as an approximation for the number of primes \\(\\equiv a \\pmod{q}\\) up to \\(x\\)?',
                    hint: "Think about what fraction of all integers are \\(\\equiv a \\pmod{q}\\), and recall that \\(\\psi(x) \\sim x\\).",
                    solution: 'Among all residues mod \\(q\\), there are \\(\\varphi(q)\\) coprime to \\(q\\). Heuristically, primes should be equally distributed among these classes (no bias). Since \\(\\psi(x) \\sim x\\) counts the total prime-power weight, each class should get approximately \\(x / \\varphi(q)\\). The explicit formula confirms this with precise error terms.'
                },
            ]
        }
    ],

    // ================================================================
    // EXTRA VISUALIZATIONS (registered on the chapter object)
    // ================================================================
    extraVisualizations: [
        // ============================================================
        // STAR VISUALIZATION: Zero Superposition
        // ============================================================
        {
            id: 'viz-zero-superposition',
            title: 'Zero Superposition: Building the Prime Staircase',
            description: 'Start with the smooth line y = x. Add the first zeta zero\'s contribution: a wave appears. Use the slider to add up to 50 zeros and watch the Chebyshev staircase psi(x) emerge from the superposition.',
            sectionId: 'sec-von-mangoldt',
            setup: function(body, controls) {
                var viz = new VizEngine(body, {
                    width: 560, height: 420,
                    originX: 60, originY: 380, scale: 1
                });

                var GAMMAS = [
                    14.134725, 21.022040, 25.010858, 30.424876, 32.935062,
                    37.586178, 40.918719, 43.327073, 48.005151, 49.773832,
                    52.970321, 56.446248, 59.347044, 60.831779, 65.112544,
                    67.079811, 69.546402, 72.067158, 75.704691, 77.144840,
                    79.337375, 82.910381, 84.735493, 87.425275, 88.809111,
                    92.491899, 94.651344, 95.870634, 98.831194, 101.317851,
                    103.725539, 105.446623, 107.168611, 111.029536, 111.874659,
                    114.320221, 116.226680, 118.790783, 121.370125, 122.946829,
                    124.256819, 127.516684, 129.578704, 131.087688, 133.497737,
                    134.756510, 138.116042, 139.736209, 141.123707, 143.111846
                ];

                var nZeros = 1;
                var xMax = 100;
                var showExact = true;

                var slider = VizEngine.createSlider(controls, 'Zeros', 0, 50, nZeros, 1, function(v) {
                    nZeros = Math.round(v);
                    draw();
                });

                VizEngine.createSlider(controls, 'x max', 50, 200, xMax, 10, function(v) {
                    xMax = Math.round(v);
                    draw();
                });

                var toggleBtn = VizEngine.createButton(controls, 'Toggle \u03C8(x)', function() {
                    showExact = !showExact;
                    toggleBtn.style.borderColor = showExact ? viz.colors.white : '#30363d';
                    draw();
                });
                toggleBtn.style.borderColor = viz.colors.white;

                var primes = VizEngine.sievePrimes(250);
                function vonMangoldt(n) {
                    for (var i = 0; i < primes.length; i++) {
                        var p = primes[i];
                        if (p > n) break;
                        var pk = p;
                        while (pk <= n) {
                            if (pk === n) return Math.log(p);
                            pk *= p;
                        }
                    }
                    return 0;
                }

                function psiExact(x) {
                    var s = 0;
                    for (var n = 2; n <= Math.floor(x); n++) s += vonMangoldt(n);
                    return s;
                }

                // Compute zero-sum correction: sum over first N zero pairs
                function zeroSum(x, N) {
                    if (x <= 1) return 0;
                    var s = 0;
                    var logx = Math.log(x);
                    var sqrtX = Math.sqrt(x);
                    for (var k = 0; k < N && k < GAMMAS.length; k++) {
                        var g = GAMMAS[k];
                        var denom = 0.25 + g * g;
                        var cosG = Math.cos(g * logx);
                        var sinG = Math.sin(g * logx);
                        // -2 Re(x^rho / rho) where rho = 1/2 + ig
                        var re = sqrtX * (0.5 * cosG + g * sinG) / denom;
                        s += 2 * re;
                    }
                    return s;
                }

                function draw() {
                    viz.clear();
                    var ctx = viz.ctx;
                    var W = viz.width - 80;
                    var H = 340;
                    var left = 60;
                    var bottom = 380;
                    var yMax = xMax * 1.15;

                    function toSx(x) { return left + (x / xMax) * W; }
                    function toSy(y) { return bottom - (y / yMax) * H; }

                    // Grid
                    ctx.strokeStyle = viz.colors.grid; ctx.lineWidth = 0.5;
                    var step = xMax <= 100 ? 20 : 50;
                    for (var gx = step; gx <= xMax; gx += step) {
                        ctx.beginPath(); ctx.moveTo(toSx(gx), bottom); ctx.lineTo(toSx(gx), bottom - H); ctx.stroke();
                        ctx.fillStyle = viz.colors.text; ctx.font = '10px -apple-system,sans-serif';
                        ctx.textAlign = 'center'; ctx.textBaseline = 'top';
                        ctx.fillText(gx.toString(), toSx(gx), bottom + 4);
                    }
                    var yStep = xMax <= 100 ? 20 : 50;
                    for (var gy = yStep; gy < yMax; gy += yStep) {
                        ctx.beginPath(); ctx.moveTo(left, toSy(gy)); ctx.lineTo(left + W, toSy(gy)); ctx.stroke();
                        ctx.fillStyle = viz.colors.text; ctx.font = '10px -apple-system,sans-serif';
                        ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
                        ctx.fillText(gy.toString(), left - 4, toSy(gy));
                    }

                    // Axes
                    ctx.strokeStyle = viz.colors.axis; ctx.lineWidth = 1;
                    ctx.beginPath(); ctx.moveTo(left, bottom); ctx.lineTo(left + W, bottom); ctx.stroke();
                    ctx.beginPath(); ctx.moveTo(left, bottom); ctx.lineTo(left, bottom - H); ctx.stroke();

                    // y = x line (main term)
                    ctx.strokeStyle = viz.colors.blue + '55';
                    ctx.lineWidth = 1;
                    ctx.setLineDash([6, 4]);
                    ctx.beginPath();
                    ctx.moveTo(toSx(0), toSy(0));
                    ctx.lineTo(toSx(Math.min(xMax, yMax)), toSy(Math.min(xMax, yMax)));
                    ctx.stroke();
                    ctx.setLineDash([]);

                    // Exact psi(x) staircase
                    if (showExact) {
                        ctx.strokeStyle = viz.colors.white + '88';
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        var prevPsi = 0;
                        for (var n = 2; n <= xMax; n++) {
                            var curPsi = psiExact(n);
                            ctx.moveTo(toSx(n - 1), toSy(prevPsi));
                            ctx.lineTo(toSx(n), toSy(prevPsi));
                            if (curPsi !== prevPsi) {
                                ctx.lineTo(toSx(n), toSy(curPsi));
                            }
                            prevPsi = curPsi;
                        }
                        ctx.stroke();
                    }

                    // Explicit formula approximation: x - sum_rho - log(2pi)
                    ctx.strokeStyle = nZeros === 0 ? viz.colors.blue : viz.colors.teal;
                    ctx.lineWidth = 2.5;
                    ctx.beginPath();
                    var started = false;
                    var plotStep = Math.max(1, Math.floor(xMax / 500));
                    for (var px = 0; px <= W; px += 1) {
                        var xv = 2 + (px / W) * (xMax - 2);
                        var yv = xv - zeroSum(xv, nZeros) - Math.log(2 * Math.PI);
                        if (!isFinite(yv) || yv < -10) { started = false; continue; }
                        if (!started) { ctx.moveTo(toSx(xv), toSy(yv)); started = true; }
                        else ctx.lineTo(toSx(xv), toSy(yv));
                    }
                    ctx.stroke();

                    // Title and info
                    viz.screenText('Zero Superposition: ' + nZeros + ' zero pair' + (nZeros !== 1 ? 's' : ''), viz.width / 2, 16, viz.colors.white, 14);

                    // Legend
                    var legY = 30;
                    ctx.font = '10px -apple-system,sans-serif'; ctx.textAlign = 'left';

                    ctx.fillStyle = viz.colors.blue + '55';
                    ctx.fillRect(left + 8, legY, 12, 3);
                    ctx.fillStyle = viz.colors.text;
                    ctx.fillText('y = x (main term)', left + 24, legY + 4);

                    ctx.fillStyle = viz.colors.teal;
                    ctx.fillRect(left + 170, legY, 12, 3);
                    ctx.fillText('x \u2212 \u03A3 x\u1D68/\u03C1 \u2212 log 2\u03C0', left + 186, legY + 4);

                    if (showExact) {
                        ctx.fillStyle = viz.colors.white + '88';
                        ctx.fillRect(left + 370, legY, 12, 3);
                        ctx.fillText('\u03C8(x) exact', left + 386, legY + 4);
                    }
                }
                draw();
                return viz;
            }
        }
    ]
});

// Register extra visualizations for the section rendering system
(function() {
    var ch = window.CHAPTERS.find(function(c) { return c.id === 'ch08'; });
    if (!ch || !ch.extraVisualizations) return;
    ch.extraVisualizations.forEach(function(ev) {
        // Insert the viz placeholder into the appropriate section content
        var sec = ch.sections.find(function(s) { return s.id === ev.sectionId; });
        if (sec) {
            // Add to the section's visualizations array
            if (!sec.visualizations) sec.visualizations = [];
            sec.visualizations.push(ev);
            // Add placeholder to section content
            sec.content = '<div class="viz-placeholder" data-viz="' + ev.id + '"></div>\n' + sec.content;
        }
    });
})();
