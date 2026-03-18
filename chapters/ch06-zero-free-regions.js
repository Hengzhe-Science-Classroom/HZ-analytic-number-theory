window.CHAPTERS = window.CHAPTERS || [];
window.CHAPTERS.push({
    id: 'ch06',
    number: 6,
    title: 'Zero-Free Regions',
    subtitle: 'Why primes obey the Prime Number Theorem',
    sections: [

        // ================================================================
        // SECTION 1: Why Zeros Matter
        // ================================================================
        {
            id: 'sec-motivation',
            title: 'Why Zeros Matter',
            content: `
<h2>Why Zeros Matter</h2>

<div class="env-block intuition">
    <div class="env-title">The Central Mystery</div>
    <div class="env-body">
        <p>The Prime Number Theorem says that \\(\\pi(x) \\sim x / \\log x\\). But why should primes behave so regularly? The answer turns out to depend entirely on <em>where</em> the Riemann zeta function vanishes. Zeros close to the line \\(\\text{Re}(s) = 1\\) would introduce oscillations that destroy the PNT. Keeping zeros away from that line is the key.</p>
    </div>
</div>

<p>Recall the Chebyshev function \\(\\psi(x) = \\sum_{p^k \\le x} \\log p\\). The Prime Number Theorem in its cleanest form is the statement</p>

\\[
\\psi(x) \\sim x \\qquad (x \\to \\infty),
\\]

<p>and via Mertens' theorem this is equivalent to \\(\\pi(x) \\sim x/\\log x\\). Everything hinges on the <em>explicit formula</em> of Riemann and von Mangoldt, which we will study carefully in Chapter 8. For now, the key fact is:</p>

<div class="env-block theorem">
    <div class="env-title">Theorem 6.1 (PNT and the zero-free region)</div>
    <div class="env-body">
        <p>The following are equivalent:</p>
        <ol>
            <li>\\(\\psi(x) \\sim x\\) (the Prime Number Theorem).</li>
            <li>\\(\\zeta(s) \\ne 0\\) for all \\(s\\) with \\(\\text{Re}(s) = 1\\).</li>
        </ol>
    </div>
</div>

<p>This equivalence, established by Hadamard and de la Vallée Poussin in 1896, is one of the great triumphs of nineteenth-century mathematics. The proof of (2)&thinsp;&rarr;&thinsp;(1) uses the <em>Perron inversion formula</em>; the proof of (1)&thinsp;&rarr;&thinsp;(2) uses the explicit formula in reverse. We focus on establishing (2) here.</p>

<h3>The Critical Strip</h3>

<p>Recall that all non-trivial zeros of \\(\\zeta(s)\\) lie in the <em>critical strip</em> \\(0 < \\text{Re}(s) < 1\\). The Riemann Hypothesis asserts they all lie on the <em>critical line</em> \\(\\text{Re}(s) = \\tfrac{1}{2}\\). For the PNT we need something weaker but still hard: no zeros at all on the boundary \\(\\text{Re}(s) = 1\\).</p>

<p>The <em>zero-free region</em> then pushes this further: we want to say there are no zeros in a neighborhood of \\(\\text{Re}(s) = 1\\). The larger this neighborhood, the better our error term in the PNT.</p>

<div class="env-block remark">
    <div class="env-title">Guide to this Chapter</div>
    <div class="env-body">
        <ul>
            <li><strong>Section 2:</strong> The 3-4-1 inequality proves \\(\\zeta(1+it) \\ne 0\\) for all real \\(t \\ne 0\\).</li>
            <li><strong>Section 3:</strong> The <em>classical zero-free region</em> \\(\\sigma > 1 - c/\\log|t|\\) follows by quantifying the same inequality.</li>
            <li><strong>Section 4:</strong> The Vinogradov-Korobov improvement gives a region \\(\\sigma > 1 - c/(\\log|t|)^{2/3}(\\log\\log|t|)^{1/3}\\).</li>
            <li><strong>Section 5:</strong> The zero landscape — what we know and what we conjecture.</li>
            <li><strong>Section 6:</strong> Armed for the PNT proof in Chapter 7.</li>
        </ul>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-341-trick"></div>
`,
            visualizations: [
                {
                    id: 'viz-341-trick',
                    title: 'PNT Equivalence: Zeros and Prime Counting',
                    description: 'The explicit formula links \\(\\psi(x)\\) to the zeros of \\(\\zeta(s)\\). Each non-trivial zero \\(\\rho = \\beta + i\\gamma\\) contributes an oscillation \\(-x^\\rho/\\rho\\). Drag the slider to see how zeros near Re(s)=1 deform the prime-counting staircase.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 340,
                            originX: 70, originY: 290, scale: 2.2
                        });

                        // Slider: how close is the zero to Re(s)=1
                        var betaVal = 0.5; // zero at beta + 14.134i
                        var slider = VizEngine.createSlider(controls, 'Zero location \u03B2', 0.1, 0.99, betaVal, 0.01, function(v) {
                            betaVal = v; draw();
                        });

                        function psiApprox(x, beta) {
                            // psi(x) ~ x - x^beta * cos(gamma * log x) / |rho|  (rough approximation)
                            if (x < 2) return 0;
                            var gamma = 14.134;
                            var r = Math.pow(x, beta);
                            var phase = gamma * Math.log(x);
                            return x - 2 * r * Math.cos(phase) / Math.sqrt(beta * beta + gamma * gamma);
                        }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var xMax = 120;

                            viz.drawGrid(10);
                            viz.drawAxes();

                            // True psi(x) approximation: step function at primes
                            var primes = VizEngine.sievePrimes(xMax + 5);
                            var pairs = [[2, 0]];
                            var curPsi = 0;
                            for (var i = 0; i < primes.length; i++) {
                                var p = primes[i];
                                if (p > xMax) break;
                                // prime powers
                                var pk = p;
                                while (pk <= xMax) {
                                    pairs.push([pk - 0.01, curPsi]);
                                    curPsi += Math.log(p);
                                    pairs.push([pk, curPsi]);
                                    pk *= p;
                                }
                            }
                            pairs.push([xMax, curPsi]);
                            viz.drawStepFunction(pairs, viz.colors.teal, 1.5);

                            // Smooth approximation
                            viz.drawFunction(function(x) {
                                return psiApprox(x, betaVal);
                            }, 2, xMax, betaVal > 0.95 ? viz.colors.green : viz.colors.orange, 2, 400);

                            // Line y = x
                            viz.drawFunction(function(x) { return x; }, 2, xMax, viz.colors.grid, 1, 100);

                            // Labels
                            viz.screenText('\u03C8(x) exact', 460, 50, viz.colors.teal, 11);
                            viz.screenText('\u03C8(x) with \u03B2=' + betaVal.toFixed(2), 460, 65, betaVal > 0.95 ? viz.colors.green : viz.colors.orange, 11);
                            viz.screenText('y = x', 460, 80, viz.colors.text, 11);
                            viz.screenText('x', viz.width - 15, viz.originY + 5, viz.colors.text, 12);

                            // Info box
                            var msg = betaVal > 0.95
                                ? 'Zero near Re(s)=1: large oscillations disrupt PNT'
                                : betaVal > 0.7
                                    ? 'Zero in the strip: moderate oscillations'
                                    : 'Zero near Re(s)=1/2: oscillations are small (RH)';
                            ctx.fillStyle = betaVal > 0.95 ? viz.colors.orange + 'cc' : viz.colors.green + 'cc';
                            ctx.fillRect(viz.width/2 - 150, 8, 300, 22);
                            viz.screenText(msg, viz.width/2, 19, viz.colors.white, 10);
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Assuming the Riemann Hypothesis (all non-trivial zeros have \\(\\text{Re}(\\rho) = \\tfrac{1}{2}\\)), the explicit formula gives \\(\\psi(x) = x + O(x^{1/2}\\log^2 x)\\). Show that this implies \\(\\pi(x) = \\text{Li}(x) + O(x^{1/2}\\log x)\\). (Use partial summation.)',
                    hint: 'Write \\(\\pi(x) = \\int_2^x d\\psi(t)/\\log t\\) and integrate by parts.',
                    solution: 'By partial summation (Abel summation), \\(\\pi(x) = \\psi(x)/\\log x + \\int_2^x \\psi(t)/(t\\log^2 t)\\,dt\\). Substituting \\(\\psi(t) = t + O(t^{1/2}\\log^2 t)\\), the main terms give \\(\\text{Li}(x)\\) and the error terms integrate to \\(O(x^{1/2}\\log x)\\).'
                },
                {
                    question: 'Explain in one paragraph why the equivalence "PNT \\(\\Leftrightarrow\\) \\(\\zeta(1+it) \\ne 0\\)" is philosophically surprising.',
                    hint: 'Think about what connects the distribution of primes (an arithmetic object) to zeros of a complex function.',
                    solution: 'The primes are defined by purely multiplicative arithmetic: a natural number is prime if it has no non-trivial factors. There is no a priori reason for them to have a smooth asymptotic distribution. The surprise is that analytic information about \\(\\zeta(s)\\) — the non-vanishing on the line \\(\\text{Re}(s) = 1\\) — directly controls whether the prime-counting function \\(\\psi(x)\\) is asymptotically linear. The bridge is the Perron formula, which expresses \\(\\psi(x)\\) as a contour integral involving \\(\\zeta^\\prime/\\zeta\\), so poles from zeros of \\(\\zeta\\) near the contour create oscillatory terms in \\(\\psi(x)\\).'
                }
            ]
        },

        // ================================================================
        // SECTION 2: No Zeros on Re(s) = 1
        // ================================================================
        {
            id: 'sec-no-zeros-line',
            title: 'No Zeros on Re(s) = 1',
            content: `
<h2>No Zeros on Re(s) = 1</h2>

<div class="env-block intuition">
    <div class="env-title">The Trigonometric Trick</div>
    <div class="env-body">
        <p>The proof that \\(\\zeta(1+it) \\ne 0\\) is one of the most elegant in all of analytic number theory. It uses nothing but the Euler product and a single trigonometric inequality: \\(3 + 4\\cos\\theta + \\cos 2\\theta \\ge 0\\). This inequality, combined with the positivity of the Dirichlet series coefficients for \\(\\sigma > 1\\), forces any hypothetical zero at \\(1+it\\) into a contradiction.</p>
    </div>
</div>

<h3>The Key Inequality</h3>

<div class="env-block lemma">
    <div class="env-title">Lemma 6.2 (3-4-1 inequality)</div>
    <div class="env-body">
        <p>For all \\(\\theta \\in \\mathbb{R}\\),</p>
        \\[
        3 + 4\\cos\\theta + \\cos 2\\theta \\ge 0.
        \\]
    </div>
</div>

<p><em>Proof.</em> Write \\(\\cos 2\\theta = 2\\cos^2\\theta - 1\\). Then</p>
\\[
3 + 4\\cos\\theta + \\cos 2\\theta = 2 + 4\\cos\\theta + 2\\cos^2\\theta = 2(1 + \\cos\\theta)^2 \\ge 0.
\\]

<h3>Applying it to Zeta</h3>

<p>For \\(\\sigma > 1\\), the logarithm of the Euler product gives</p>
\\[
\\log\\zeta(s) = \\sum_p \\sum_{k=1}^\\infty \\frac{p^{-ks}}{k}.
\\]
<p>Writing \\(s = \\sigma + it\\) and taking real parts,</p>
\\[
\\text{Re}\\,\\log\\zeta(\\sigma + it) = \\sum_p \\sum_{k=1}^\\infty \\frac{\\cos(kt\\log p)}{k\\, p^{k\\sigma}}.
\\]

<p>Now apply the 3-4-1 inequality with \\(\\theta = kt\\log p\\):</p>
\\[
3\\,\\frac{1}{p^{k\\sigma}} + 4\\,\\frac{\\cos(kt\\log p)}{p^{k\\sigma}} + \\frac{\\cos(2kt\\log p)}{p^{k\\sigma}} \\ge 0.
\\]

<p>Summing over all \\(p\\) and \\(k \\ge 1\\), we obtain the central inequality:</p>

<div class="env-block theorem">
    <div class="env-title">Lemma 6.3 (Positivity inequality)</div>
    <div class="env-body">
        \\[
        3\\log\\zeta(\\sigma) + 4\\,\\text{Re}\\log\\zeta(\\sigma+it) + \\text{Re}\\log\\zeta(\\sigma+2it) \\ge 0
        \\]
        <p>for \\(\\sigma > 1\\) and \\(t \\in \\mathbb{R}\\). Exponentiating:</p>
        \\[
        \\zeta(\\sigma)^3 \\cdot |\\zeta(\\sigma+it)|^4 \\cdot |\\zeta(\\sigma+2it)| \\ge 1. \\tag{\\star}
        \\]
    </div>
</div>

<h3>The Contradiction</h3>

<p>Suppose \\(\\zeta(1+it_0) = 0\\) for some real \\(t_0 \\ne 0\\). Since \\(\\zeta(s)\\) has a simple pole at \\(s=1\\), we know:</p>
<ul>
    <li>\\(\\zeta(\\sigma) \\sim \\frac{1}{\\sigma - 1}\\) as \\(\\sigma \\to 1^+\\), so \\(\\zeta(\\sigma)^3 = O\\bigl((\\sigma-1)^{-3}\\bigr)\\).</li>
    <li>If \\(\\zeta(1+it_0) = 0\\), then \\(|\\zeta(\\sigma+it_0)| = O(\\sigma - 1)\\) as \\(\\sigma \\to 1^+\\), since the zero is at least simple. So \\(|\\zeta(\\sigma+it_0)|^4 = O\\bigl((\\sigma-1)^4\\bigr)\\).</li>
    <li>\\(|\\zeta(\\sigma + 2it_0)| = O(1)\\) since \\(\\zeta\\) is analytic and nonzero near \\(1 + 2it_0\\) (assuming \\(2t_0 \\ne 0\\)).</li>
</ul>

<p>Combining: the left side of \\((\\star)\\) is \\(O\\bigl((\\sigma-1)^{-3+4}\\bigr) = O(\\sigma-1) \\to 0\\) as \\(\\sigma \\to 1^+\\). But the right side is 1. Contradiction.</p>

<div class="env-block theorem">
    <div class="env-title">Theorem 6.4 (Hadamard, de la Vallée Poussin, 1896)</div>
    <div class="env-body">
        <p>\\(\\zeta(1+it) \\ne 0\\) for all real \\(t \\ne 0\\).</p>
    </div>
</div>

<div class="env-block remark">
    <div class="env-title">Why Does the Pole Help?</div>
    <div class="env-body">
        <p>The proof crucially uses the pole of \\(\\zeta(s)\\) at \\(s=1\\). The pole provides the factor \\(\\zeta(\\sigma)^3 \\approx (\\sigma-1)^{-3}\\), which "wants to blow up." But if there is a zero of order \\(m\\) at \\(1+it_0\\), the factor \\(|\\zeta(\\sigma+it_0)|^4 \\approx (\\sigma-1)^{4m}\\) "wants to vanish." Inequality \\((\\star)\\) says the blow-up always wins — but only if \\(4m > 3\\), i.e., \\(m \\ge 1\\). A zero of any order at \\(1+it_0\\) leads to contradiction because \\(4 \\cdot 1 = 4 > 3\\).</p>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-contradiction-game"></div>
`,
            visualizations: [
                {
                    id: 'viz-contradiction-game',
                    title: 'The 3-4-1 Contradiction Machine',
                    description: 'Watch the inequality \\(\\zeta(\\sigma)^3 |\\zeta(\\sigma+it)|^4 |\\zeta(\\sigma+2it)| \\ge 1\\) in action. Set a hypothetical zero at \\(1 + it\\) and watch what happens as \\(\\sigma \\to 1^+\\).',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 340,
                            originX: 60, originY: 300, scale: 50
                        });

                        var zeroT = 14.134;
                        var hasZero = true;

                        var tSlider = VizEngine.createSlider(controls, 'Imaginary part t', 1, 30, zeroT, 0.1, function(v) {
                            zeroT = v; draw();
                        });
                        var toggleBtn = VizEngine.createButton(controls, 'Toggle zero at 1+it', function() {
                            hasZero = !hasZero; draw();
                        });

                        // Approximate zeta on the real axis near 1 using partial sum
                        function zetaRealApprox(sigma) {
                            var s = 0;
                            for (var n = 1; n <= 5000; n++) {
                                s += Math.pow(n, -sigma);
                            }
                            return s;
                        }

                        // |zeta(sigma + it)|^2 via partial sum of Dirichlet series
                        function zetaMagSq(sigma, t) {
                            var re = 0, im = 0;
                            for (var n = 1; n <= 2000; n++) {
                                var ns = Math.pow(n, -sigma);
                                re += ns * Math.cos(t * Math.log(n));
                                im -= ns * Math.sin(t * Math.log(n));
                            }
                            return re * re + im * im;
                        }

                        function product341(sigma, t, zeroPower) {
                            // zeta(sigma)^3 * |zeta(sigma+it)|^4 * |zeta(sigma+2it)|
                            // If hasZero: multiply |zeta(sigma+it)|^4 by (sigma-1)^(4*zeroPower) correction
                            var z0 = zetaRealApprox(sigma);
                            var z1sq = zetaMagSq(sigma, t);
                            var z2sq = zetaMagSq(sigma, 2 * t);

                            if (hasZero) {
                                // Simulate a zero: replace z1sq by (sigma-1)^2
                                var d = sigma - 1;
                                z1sq = d * d;
                            }

                            var val = Math.pow(z0, 3) * Math.pow(z1sq, 2) * Math.sqrt(z2sq);
                            return val;
                        }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            // Draw axes with sigma on x from 1.001 to 1.3
                            var sigMin = 1.001, sigMax = 1.3;
                            var yMax = 5;

                            // X axis label
                            viz.screenText('\u03C3', viz.width - 20, viz.originY + 2, viz.colors.text, 13);
                            viz.screenText('\u03C3=1', viz.originX, viz.originY + 12, viz.colors.text, 10);

                            // Gridlines
                            ctx.strokeStyle = viz.colors.grid; ctx.lineWidth = 0.5;
                            for (var yg = 0; yg <= 4; yg += 1) {
                                var sy = viz.originY - yg * viz.scale / yMax * viz.height / yMax;
                                // simple: map y in [0,yMax] to screen
                            }

                            // Manually map sigma and product to screen
                            function toSX(sigma) {
                                return viz.originX + (sigma - sigMin) / (sigMax - sigMin) * (viz.width - viz.originX - 20);
                            }
                            function toSY(val) {
                                return viz.originY - Math.min(val, 6) / 6 * (viz.originY - 30);
                            }

                            // Draw threshold line y=1
                            ctx.strokeStyle = viz.colors.yellow; ctx.lineWidth = 1; ctx.setLineDash([5, 4]);
                            ctx.beginPath();
                            ctx.moveTo(viz.originX, toSY(1));
                            ctx.lineTo(viz.width - 10, toSY(1));
                            ctx.stroke(); ctx.setLineDash([]);
                            viz.screenText('= 1 (minimum)', viz.width - 90, toSY(1) - 8, viz.colors.yellow, 10);

                            // Draw the product
                            var steps = 200;
                            ctx.strokeStyle = hasZero ? viz.colors.red : viz.colors.green;
                            ctx.lineWidth = 2.5;
                            ctx.beginPath();
                            var started = false;
                            for (var i = 0; i <= steps; i++) {
                                var sig = sigMin + (sigMax - sigMin) * i / steps;
                                var val = product341(sig, zeroT, 1);
                                var sx = toSX(sig);
                                var sy = toSY(val);
                                if (!started) { ctx.moveTo(sx, sy); started = true; }
                                else ctx.lineTo(sx, sy);
                            }
                            ctx.stroke();

                            // Draw sigma axis
                            ctx.strokeStyle = viz.colors.axis; ctx.lineWidth = 1.5;
                            ctx.beginPath();
                            ctx.moveTo(viz.originX, viz.originY);
                            ctx.lineTo(viz.width - 10, viz.originY);
                            ctx.stroke();
                            // Tick at sigma=1.1, 1.2, 1.3
                            for (var st = 1.1; st <= 1.3; st += 0.1) {
                                var sx2 = toSX(st);
                                ctx.fillStyle = viz.colors.text; ctx.font = '10px sans-serif';
                                ctx.textAlign = 'center';
                                ctx.fillText(st.toFixed(1), sx2, viz.originY + 12);
                                ctx.strokeStyle = viz.colors.axis; ctx.lineWidth = 1;
                                ctx.beginPath(); ctx.moveTo(sx2, viz.originY - 3); ctx.lineTo(sx2, viz.originY + 3); ctx.stroke();
                            }

                            // Y axis labels
                            ctx.textAlign = 'right'; ctx.font = '10px sans-serif'; ctx.fillStyle = viz.colors.text;
                            for (var yv = 0; yv <= 5; yv++) {
                                var svy = toSY(yv);
                                ctx.fillText(yv, viz.originX - 4, svy + 4);
                            }

                            // Arrow at right end
                            var arrowSig = sigMin + (sigMax - sigMin) * 0.15;
                            var arrowVal = product341(arrowSig, zeroT, 1);
                            var arrowSY = toSY(arrowVal);
                            var arrowSX = toSX(arrowSig);

                            // Status text
                            var lastVal = product341(sigMin + 0.001, zeroT, 1);
                            var statusMsg, statusColor;
                            if (hasZero) {
                                statusMsg = 'CONTRADICTION: product \u2192 0 < 1 as \u03C3 \u2192 1\u207A (zero assumed at 1+it)';
                                statusColor = viz.colors.red;
                            } else {
                                statusMsg = 'OK: product stays \u2265 1 (no zero at 1+it)';
                                statusColor = viz.colors.green;
                            }
                            ctx.fillStyle = statusColor + 'dd';
                            ctx.fillRect(40, 10, viz.width - 60, 22);
                            ctx.fillStyle = '#fff'; ctx.font = 'bold 11px sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText(statusMsg, viz.width/2, 21);

                            // Formula label
                            viz.screenText('\u03B6(\u03C3)\u00B3 \u00B7 |\u03B6(\u03C3+it)|\u2074 \u00B7 |\u03B6(\u03C3+2it)|', viz.width - 140, 50, hasZero ? viz.colors.red : viz.colors.green, 11);
                        }

                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Prove the trigonometric inequality \\(3 + 4\\cos\\theta + \\cos 2\\theta \\ge 0\\) by writing \\(\\cos 2\\theta = 2\\cos^2\\theta - 1\\) and completing the square.',
                    hint: 'After substitution, the expression becomes a perfect square.',
                    solution: '\\(3 + 4\\cos\\theta + (2\\cos^2\\theta - 1) = 2 + 4\\cos\\theta + 2\\cos^2\\theta = 2(1 + 2\\cos\\theta + \\cos^2\\theta) = 2(1+\\cos\\theta)^2 \\ge 0\\).'
                },
                {
                    question: 'The proof of Theorem 6.4 uses the fact that \\(\\zeta(s)\\) has a <em>simple</em> pole at \\(s=1\\). Why does the argument break down if the pole were of order 2?',
                    hint: 'Re-examine the order of vanishing/blowing-up in the proof.',
                    solution: 'If \\(\\zeta(s)\\) had a pole of order 2 at \\(s=1\\), then \\(\\zeta(\\sigma)^3 \\sim (\\sigma-1)^{-6}\\). A zero of order 1 at \\(1+it_0\\) gives \\(|\\zeta(\\sigma+it_0)|^4 \\sim (\\sigma-1)^4\\). The product would be \\(\\sim (\\sigma-1)^{-2}\\to \\infty\\), which does not contradict \\(\\ge 1\\). So the argument would fail — the pole order must exceed \\(4m/3\\) to force a contradiction.'
                },
                {
                    question: 'Use the inequality \\(\\zeta(\\sigma)^3 |\\zeta(\\sigma+it)|^4 |\\zeta(\\sigma+2it)| \\ge 1\\) to derive a lower bound: \\(|\\zeta(\\sigma+it)| \\ge \\zeta(\\sigma)^{-3/4}\\) when \\(\\zeta(\\sigma+2it)\\) is bounded above.',
                    hint: 'Solve for \\(|\\zeta(\\sigma+it)|^4\\) in terms of the other factors.',
                    solution: 'From \\(\\zeta(\\sigma)^3 |\\zeta(\\sigma+it)|^4 |\\zeta(\\sigma+2it)| \\ge 1\\), we get \\(|\\zeta(\\sigma+it)|^4 \\ge (\\zeta(\\sigma)^3 |\\zeta(\\sigma+2it)|)^{-1}\\). If \\(|\\zeta(\\sigma+2it)| \\le C\\), then \\(|\\zeta(\\sigma+it)|^4 \\ge (C\\zeta(\\sigma)^3)^{-1}\\), giving \\(|\\zeta(\\sigma+it)| \\ge C^{-1/4}\\zeta(\\sigma)^{-3/4}\\).'
                }
            ]
        },

        // ================================================================
        // SECTION 3: The Classical Zero-Free Region
        // ================================================================
        {
            id: 'sec-classical-region',
            title: 'The Classical Zero-Free Region',
            content: `
<h2>The Classical Zero-Free Region</h2>

<div class="env-block intuition">
    <div class="env-title">From Qualitative to Quantitative</div>
    <div class="env-body">
        <p>Theorem 6.4 shows \\(\\zeta(1+it) \\ne 0\\), but for the PNT error term we need something sharper: a region \\(\\{\\sigma > 1 - f(t)\\}\\) free of zeros, where \\(f(t) \\to 0\\) as \\(|t| \\to \\infty\\). The same 3-4-1 inequality, combined with careful estimates of \\(\\log\\zeta(s)\\) near the line, gives \\(f(t) = c/\\log|t|\\). This classical region has been state-of-the-art for most of analytic number theory's history.</p>
    </div>
</div>

<h3>Estimating Log-Zeta near the Line</h3>

<p>For \\(\\sigma > 1\\), the Dirichlet series gives</p>
\\[
-\\frac{\\zeta'}{\\zeta}(s) = \\sum_p \\sum_{k=1}^\\infty \\frac{\\log p}{p^{ks}},
\\]
<p>but to work near \\(\\sigma = 1\\) we need to count zeros via the Hadamard factorization. The key estimate is:</p>

<div class="env-block lemma">
    <div class="env-title">Lemma 6.5 (Logarithmic derivative near Re(s)=1)</div>
    <div class="env-body">
        <p>For \\(\\sigma > 1\\) and \\(|t| \\ge 2\\),</p>
        \\[
        -\\text{Re}\\frac{\\zeta'}{\\zeta}(\\sigma + it) \\le -\\sum_{\\rho}\\text{Re}\\frac{1}{\\sigma + it - \\rho} + A\\log|t|,
        \\]
        <p>where the sum is over non-trivial zeros \\(\\rho = \\beta + i\\gamma\\) and \\(A > 0\\) is an absolute constant.</p>
    </div>
</div>

<p>From the 3-4-1 inequality \\((\\star)\\), taking logarithmic derivatives and applying the lemma, one obtains:</p>

<div class="env-block theorem">
    <div class="env-title">Theorem 6.6 (Classical zero-free region)</div>
    <div class="env-body">
        <p>There exists an absolute constant \\(c > 0\\) such that \\(\\zeta(s) \\ne 0\\) for</p>
        \\[
        \\sigma > 1 - \\frac{c}{\\log|t|}, \\qquad |t| \\ge 2.
        \\]
        <p>Combined with the result for \\(|t| \\le 2\\) (a compact region, where zeros can be checked directly), \\(\\zeta(s)\\) has no zeros in the entire region \\(\\sigma > 1 - c_1/(\\log(|t|+2))\\) for some \\(c_1 > 0\\).</p>
    </div>
</div>

<h3>Proof Sketch</h3>

<p>Suppose \\(\\rho_0 = \\beta_0 + i t_0\\) is a zero with \\(|t_0| \\ge 2\\). Plug \\(t = t_0\\) into the 3-4-1 inequality and use Lemma 6.5 to bound \\(-\\text{Re}(\\zeta'/\\zeta)\\). After bounding each term, one arrives at:</p>
\\[
0 \\le 3\\cdot\\frac{1}{\\sigma - 1} - 4\\cdot\\frac{\\sigma - \\beta_0}{(\\sigma-\\beta_0)^2 + (t_0-t_0)^2} + A\\log|t_0|.
\\]
<p>Setting \\(\\sigma = 1 + \\delta/\\log|t_0|\\) and taking \\(\\delta\\) small enough forces \\(\\beta_0 < 1 - c/\\log|t_0|\\) for a suitable \\(c\\).</p>

<h3>Consequence for the PNT</h3>

<p>The classical zero-free region implies the PNT with an explicit error term:</p>
\\[
\\psi(x) = x + O\\bigl(x \\exp(-c\\sqrt{\\log x})\\bigr).
\\]
<p>This is far stronger than just \\(\\psi(x)/x \\to 1\\), but still much weaker than what the RH would give (\\(O(x^{1/2}\\log^2 x)\\)).</p>

<div class="env-block remark">
    <div class="env-title">Why \\(\\exp(-c\\sqrt{\\log x})\\)?</div>
    <div class="env-body">
        <p>The error comes from moving the contour in the Perron integral into the zero-free region up to height \\(T \\approx \\exp(c'\\sqrt{\\log x})\\). The zero-free region \\(\\sigma > 1 - c/\\log T\\) then gives the saving \\(x^{-c/\\log T}\\). Setting \\(T = \\exp(c'\\sqrt{\\log x})\\) balances the two sources of error.</p>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-zero-free-evolution"></div>
`,
            visualizations: [
                {
                    id: 'viz-zero-free-evolution',
                    title: 'Evolution of Zero-Free Regions',
                    description: 'A timeline of zero-free region improvements. The classical region is \\(\\sigma > 1 - c/\\log t\\). Vinogradov-Korobov expands it. RH would give a fixed strip \\(\\sigma > 1/2\\). Use the slider to compare.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 340,
                            originX: 80, originY: 250, scale: 160
                        });

                        var tMax = 100;
                        var showVK = false;
                        var showRH = false;

                        VizEngine.createButton(controls, 'Classical', function() { showVK = false; showRH = false; draw(); });
                        VizEngine.createButton(controls, '+ Vin-Kor', function() { showVK = true; showRH = false; draw(); });
                        VizEngine.createButton(controls, '+ RH (conjectural)', function() { showVK = true; showRH = true; draw(); });

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            // Axis ranges: sigma in [0.6, 1.05], t in [0, tMax]
                            var sigMin = 0.6, sigMax = 1.05;
                            var c = 0.04; // classical constant (exaggerated for visibility)
                            var cVK = 0.09; // VK constant (exaggerated)

                            function toSX(sigma) {
                                return viz.originX + (sigma - sigMin) / (sigMax - sigMin) * (viz.width - viz.originX - 20);
                            }
                            function toSY(t) {
                                return viz.originY - t / tMax * (viz.originY - 20);
                            }

                            // Draw critical strip
                            ctx.fillStyle = '#1a1a40';
                            ctx.fillRect(viz.originX, 20, toSX(1.0) - viz.originX, viz.originY - 20);

                            // Known zero-free region (classical) — filled
                            ctx.fillStyle = viz.colors.green + '33';
                            ctx.beginPath();
                            ctx.moveTo(toSX(1.0), toSY(0));
                            for (var tt = 0; tt <= tMax; tt += 0.5) {
                                var tVal = Math.max(tt, 2);
                                var sigBound = 1 - c / Math.log(tVal);
                                ctx.lineTo(toSX(sigBound), toSY(tt));
                            }
                            ctx.lineTo(toSX(1.0), toSY(tMax));
                            ctx.closePath(); ctx.fill();

                            // VK region
                            if (showVK) {
                                ctx.fillStyle = viz.colors.blue + '44';
                                ctx.beginPath();
                                ctx.moveTo(toSX(1.0), toSY(0));
                                for (var tt2 = 0; tt2 <= tMax; tt2 += 0.5) {
                                    var tVal2 = Math.max(tt2, 2);
                                    var logT = Math.log(tVal2);
                                    var loglogT = Math.log(Math.max(logT, 1.1));
                                    var sigBound2 = 1 - cVK / (Math.pow(logT, 2/3) * Math.pow(loglogT, 1/3));
                                    ctx.lineTo(toSX(sigBound2), toSY(tt2));
                                }
                                ctx.lineTo(toSX(1.0), toSY(tMax));
                                ctx.closePath(); ctx.fill();
                            }

                            // RH region (sigma > 0.5)
                            if (showRH) {
                                ctx.fillStyle = viz.colors.purple + '33';
                                var sx05 = toSX(0.5);
                                ctx.fillRect(toSX(0.5), 20, toSX(1.0) - toSX(0.5), viz.originY - 20);
                            }

                            // Critical line sigma=0.5
                            ctx.strokeStyle = viz.colors.purple; ctx.lineWidth = 1; ctx.setLineDash([4, 3]);
                            var sx05 = toSX(0.5);
                            ctx.beginPath(); ctx.moveTo(sx05, 20); ctx.lineTo(sx05, viz.originY); ctx.stroke();
                            ctx.setLineDash([]);
                            viz.screenText('\u03C3=1/2', sx05, 12, viz.colors.purple, 10);

                            // Line sigma=1
                            ctx.strokeStyle = viz.colors.white; ctx.lineWidth = 2;
                            var sx1 = toSX(1.0);
                            ctx.beginPath(); ctx.moveTo(sx1, 20); ctx.lineTo(sx1, viz.originY); ctx.stroke();
                            viz.screenText('\u03C3=1', sx1, 12, viz.colors.white, 11);

                            // Classical boundary
                            ctx.strokeStyle = viz.colors.green; ctx.lineWidth = 2;
                            ctx.beginPath();
                            for (var tt3 = 0; tt3 <= tMax; tt3 += 0.5) {
                                var tVal3 = Math.max(tt3, 2);
                                var sb3 = 1 - c / Math.log(tVal3);
                                var sx3 = toSX(sb3), sy3 = toSY(tt3);
                                tt3 === 0 ? ctx.moveTo(sx3, sy3) : ctx.lineTo(sx3, sy3);
                            }
                            ctx.stroke();

                            // VK boundary
                            if (showVK) {
                                ctx.strokeStyle = viz.colors.blue; ctx.lineWidth = 2;
                                ctx.beginPath();
                                for (var tt4 = 0; tt4 <= tMax; tt4 += 0.5) {
                                    var tVal4 = Math.max(tt4, 2);
                                    var logT4 = Math.log(tVal4);
                                    var loglogT4 = Math.log(Math.max(logT4, 1.1));
                                    var sb4 = 1 - cVK / (Math.pow(logT4, 2/3) * Math.pow(loglogT4, 1/3));
                                    var sx4 = toSX(sb4), sy4 = toSY(tt4);
                                    tt4 === 0 ? ctx.moveTo(sx4, sy4) : ctx.lineTo(sx4, sy4);
                                }
                                ctx.stroke();
                            }

                            // Axes
                            ctx.strokeStyle = viz.colors.axis; ctx.lineWidth = 1;
                            ctx.beginPath(); ctx.moveTo(viz.originX, viz.originY); ctx.lineTo(viz.width - 10, viz.originY); ctx.stroke();
                            ctx.beginPath(); ctx.moveTo(viz.originX, viz.originY); ctx.lineTo(viz.originX, 20); ctx.stroke();

                            // Labels
                            ctx.fillStyle = viz.colors.text; ctx.font = '10px sans-serif';
                            for (var ts = 0; ts <= 100; ts += 20) {
                                ctx.textAlign = 'right';
                                ctx.fillText(ts, viz.originX - 4, toSY(ts) + 4);
                            }
                            viz.screenText('\u03C3', viz.width - 10, viz.originY + 4, viz.colors.text, 12);
                            viz.screenText('t', viz.originX - 10, 20, viz.colors.text, 12);

                            // Legend
                            var lx = viz.width - 160, ly = 40;
                            ctx.font = '10px sans-serif'; ctx.textAlign = 'left';
                            ctx.fillStyle = viz.colors.green + '66'; ctx.fillRect(lx, ly, 14, 10);
                            ctx.fillStyle = viz.colors.text; ctx.fillText('Classical: c/log t', lx+18, ly+9);
                            if (showVK) {
                                ctx.fillStyle = viz.colors.blue + '66'; ctx.fillRect(lx, ly+16, 14, 10);
                                ctx.fillStyle = viz.colors.text; ctx.fillText('VK: c/(log t)^{2/3}...', lx+18, ly+25);
                            }
                            if (showRH) {
                                ctx.fillStyle = viz.colors.purple + '44'; ctx.fillRect(lx, ly+32, 14, 10);
                                ctx.fillStyle = viz.colors.text; ctx.fillText('RH: \u03C3 > 1/2', lx+18, ly+41);
                            }
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Let \\(\\rho_0 = \\beta_0 + it_0\\) be a zero of \\(\\zeta(s)\\) with \\(t_0 \\ge 2\\). Using the inequality \\(\\zeta(\\sigma)^3|\\zeta(\\sigma+it_0)|^4|\\zeta(\\sigma+2it_0)| \\ge 1\\) and the bounds \\(\\zeta(\\sigma) \\le \\frac{A}{\\sigma-1}\\) and \\(|\\zeta(\\sigma+it_0)| \\le A(\\sigma-\\beta_0)\\), derive that \\(\\beta_0 \\le 1 - c/\\log t_0\\) for some \\(c > 0\\).',
                    hint: 'Take logarithms and solve for \\(\\beta_0\\). Use \\(|\\zeta(\\sigma+2it_0)| \\le A\\log t_0\\).',
                    solution: 'Taking logarithms of the inequality: \\(3\\log\\zeta(\\sigma) + 4\\log|\\zeta(\\sigma+it_0)| + \\log|\\zeta(\\sigma+2it_0)| \\ge 0\\). Substituting the bounds: \\(-3\\log(\\sigma-1) + 4\\log A(\\sigma-\\beta_0) + \\log(A\\log t_0) \\ge 0\\). Setting \\(\\sigma = 1 + \\delta/\\log t_0\\), the first term is \\(\\approx 3\\log\\log t_0\\), the last term is \\(O(\\log\\log t_0)\\), and the middle term forces \\(4\\log(\\delta/\\log t_0 + 1 - \\beta_0) \\ge \\text{const} \\cdot \\log\\log t_0\\). Working out the algebra gives \\(1 - \\beta_0 \\ge c/\\log t_0\\).'
                },
                {
                    question: 'Show that the classical zero-free region gives the error bound \\(\\psi(x) = x + O(x e^{-c\\sqrt{\\log x}})\\) (you may use without proof that the Perron integral error is controlled by \\(x^{1-c/\\log T}\\) when the contour passes through height \\(T\\)).',
                    hint: 'Set \\(T = e^{\\sqrt{\\log x}}\\) and balance the two error terms.',
                    solution: 'The contour integration error from moving right of \\(\\sigma = 1\\) to height \\(T\\) contributes \\(O(x^{1-c/\\log T}\\cdot\\text{poly}(\\log x))\\). The truncation error from height \\(> T\\) contributes \\(O(x\\log^2 x/T)\\). Setting \\(T = e^{\\sqrt{\\log x}}\\) makes both terms \\(O(xe^{-c\\sqrt{\\log x}})\\) after absorbing logarithmic factors.'
                }
            ]
        },

        // ================================================================
        // SECTION 4: Vinogradov-Korobov Improvement
        // ================================================================
        {
            id: 'sec-vinogradov-korobov',
            title: 'Vinogradov-Korobov Improvement',
            content: `
<h2>Vinogradov-Korobov Improvement</h2>

<div class="env-block intuition">
    <div class="env-title">Breaking the Log Barrier</div>
    <div class="env-body">
        <p>The classical zero-free region \\(\\sigma > 1 - c/\\log t\\) has stood essentially unchanged since 1899. In 1958, Vinogradov and Korobov independently broke through this barrier using deep techniques from exponential sums — the same tools that appear in Weyl's method for Waring's problem. Their improvement, though modest-looking, gives a genuinely better PNT error term.</p>
    </div>
</div>

<h3>The Improvement</h3>

<div class="env-block theorem">
    <div class="env-title">Theorem 6.7 (Vinogradov-Korobov, 1958)</div>
    <div class="env-body">
        <p>There exists an absolute constant \\(c > 0\\) such that \\(\\zeta(s) \\ne 0\\) for</p>
        \\[
        \\sigma > 1 - \\frac{c}{(\\log|t|)^{2/3}(\\log\\log|t|)^{1/3}}, \\qquad |t| \\ge 3.
        \\]
    </div>
</div>

<p>The exponent \\(2/3\\) replaces the classical exponent \\(1\\) (in the denominator). Since \\((\\log t)^{2/3} \\ll \\log t\\), the new region is strictly <em>larger</em>: we exclude zeros further from \\(\\text{Re}(s) = 1\\).</p>

<h3>How is it Proved?</h3>

<p>The key is to improve the estimate of \\(\\log\\zeta(\\sigma+it)\\) for \\(\\sigma\\) close to 1. The classical approach uses the Euler product directly. Vinogradov's method estimates exponential sums \\(\\sum_{n \\le N} n^{-it} = \\sum_{n \\le N} e^{-it\\log n}\\) with much greater precision via the Vinogradov mean value theorem.</p>

<p>More precisely, one needs to bound \\(\\zeta(\\sigma+it)\\) for \\(\\sigma\\) near 1. Vinogradov's method gives:</p>
\\[
\\zeta(\\sigma+it) \\ll |t|^{A(1-\\sigma)^{3/2}}(\\log|t|)^B
\\]
<p>for \\(\\sigma\\) in a certain range near 1. The classical bound is \\(|t|^{A(1-\\sigma)} \\log|t|\\). The exponent \\(3/2\\) versus \\(1\\) in the power of \\((1-\\sigma)\\) is what ultimately gives the improvement in the zero-free region.</p>

<h3>Consequence for PNT</h3>

<p>The Vinogradov-Korobov region yields:</p>
\\[
\\psi(x) = x + O\\bigl(x \\exp(-c(\\log x)^{3/5}(\\log\\log x)^{-1/5})\\bigr).
\\]

<p>This is the best known unconditional error term for the PNT to this day.</p>

<div class="env-block remark">
    <div class="env-title">No Further Progress in 65 Years</div>
    <div class="env-body">
        <p>The Vinogradov-Korobov region has not been improved since 1958. Any improvement would require a fundamentally new idea about exponential sums or about the distribution of primes in short intervals. This is an active research frontier. Improving the exponent \\(2/3\\) to anything less would be a major result.</p>
    </div>
</div>

<h3>The Exceptional Zero Problem</h3>

<p>For the Riemann zeta function, one can rule out zeros very close to \\(\\text{Re}(s) = 1\\) using the methods above. But for Dirichlet L-functions \\(L(s, \\chi)\\), there is a more subtle issue: a possible <em>Siegel zero</em> or <em>exceptional zero</em> — a real zero \\(\\beta_1\\) of \\(L(s, \\chi_1)\\) for a real character \\(\\chi_1\\), which could be very close to 1. The best known bound is Siegel's theorem:</p>
\\[
\\beta_1 < 1 - c(\\varepsilon) q^{-\\varepsilon} \\quad \\text{for every } \\varepsilon > 0,
\\]
<p>where \\(c(\\varepsilon)\\) is <em>ineffective</em> (not computable). This ineffectivity is a fundamental difficulty in analytic number theory. We will return to it in Chapter 9.</p>
`,
            visualizations: [],
            exercises: [
                {
                    question: 'Why does the exponent \\(2/3\\) in Theorem 6.7 (instead of \\(1\\) in the classical region) imply a strictly larger zero-free region? Show that \\((\\log t)^{2/3}(\\log\\log t)^{1/3} = o(\\log t)\\) as \\(t \\to \\infty\\).',
                    hint: 'Compare \\((\\log t)^{2/3}\\) to \\(\\log t\\).',
                    solution: 'We have \\((\\log t)^{2/3}(\\log\\log t)^{1/3} / \\log t = (\\log\\log t)^{1/3}/(\\log t)^{1/3} \\to 0\\) as \\(t \\to \\infty\\). So the VK denominator is smaller than the classical denominator, meaning the lower bound on \\(\\sigma\\) is further from 1, i.e., the zero-free region is strictly larger.'
                },
                {
                    question: 'Verify that the VK zero-free region gives the error term \\(O(x\\exp(-c(\\log x)^{3/5}(\\log\\log x)^{-1/5}))\\) by optimizing over \\(T\\) in the Perron integral (assuming the contour error is \\(O(xe^{-c/((\\log T)^{2/3}(\\log\\log T)^{1/3})})\\)).',
                    hint: 'Set \\(\\log T = (\\log x)^{3/5}(\\log\\log x)^{-1/5} \\cdot f\\) and optimize \\(f\\).',
                    solution: 'The savings from the zero-free region is \\(e^{-c/(\\log T)^{2/3}(\\log\\log T)^{1/3}}\\). The truncation error is \\(e^{-\\log T}\\) roughly. Setting both equal: \\((\\log T)^{2/3}(\\log\\log T)^{1/3} = \\log T\\) is too crude. Optimizing more carefully with \\(\\log T = (\\log x)^{3/5}(\\log\\log x)^{-2/5}\\) (approximately) gives the stated error term after tracking all factors.'
                }
            ]
        },

        // ================================================================
        // SECTION 5: The Zero Landscape
        // ================================================================
        {
            id: 'sec-zero-landscape',
            title: 'The Zero Landscape',
            content: `
<h2>The Zero Landscape</h2>

<div class="env-block intuition">
    <div class="env-title">What We Know and What We Conjecture</div>
    <div class="env-body">
        <p>The non-trivial zeros of \\(\\zeta(s)\\) live in the critical strip \\(0 < \\text{Re}(s) < 1\\). By the functional equation they are symmetric about \\(\\text{Re}(s) = 1/2\\), and by complex conjugation they come in pairs \\(\\rho, \\bar{\\rho}\\). The Riemann Hypothesis says all of them sit exactly on the critical line \\(\\text{Re}(s) = 1/2\\). Numerically, this has been verified for the first \\(10^{13}\\) zeros, but it remains unproved.</p>
    </div>
</div>

<h3>Counting Zeros: The N(T) Formula</h3>

<p>Let \\(N(T)\\) denote the number of non-trivial zeros \\(\\rho = \\beta + i\\gamma\\) of \\(\\zeta(s)\\) with \\(0 < \\gamma \\le T\\). The von Mangoldt formula gives:</p>

<div class="env-block theorem">
    <div class="env-title">Theorem 6.8 (von Mangoldt, 1905)</div>
    <div class="env-body">
        \\[
        N(T) = \\frac{T}{2\\pi}\\log\\frac{T}{2\\pi e} + O(\\log T).
        \\]
    </div>
</div>

<p>This formula tells us zeros are distributed roughly uniformly in height, with average spacing \\(\\sim 2\\pi/\\log T\\) near height \\(T\\). So zeros become denser as \\(T\\) grows, but the density grows only logarithmically.</p>

<h3>The First Zeros</h3>

<p>The first few non-trivial zeros of \\(\\zeta(s)\\) (on the critical line, with positive imaginary part) are:</p>

<table style="width:100%;border-collapse:collapse;font-size:0.9rem;">
<tr><th style="border-bottom:1px solid #30363d;padding:4px 8px;">#</th><th style="border-bottom:1px solid #30363d;padding:4px 8px;">\\(\\gamma_n\\) (imaginary part)</th><th style="border-bottom:1px solid #30363d;padding:4px 8px;">Verified on critical line?</th></tr>
<tr><td style="padding:3px 8px;">1</td><td style="padding:3px 8px;">14.134725...</td><td style="padding:3px 8px;">Yes</td></tr>
<tr><td style="padding:3px 8px;">2</td><td style="padding:3px 8px;">21.022040...</td><td style="padding:3px 8px;">Yes</td></tr>
<tr><td style="padding:3px 8px;">3</td><td style="padding:3px 8px;">25.010858...</td><td style="padding:3px 8px;">Yes</td></tr>
<tr><td style="padding:3px 8px;">4</td><td style="padding:3px 8px;">30.424876...</td><td style="padding:3px 8px;">Yes</td></tr>
<tr><td style="padding:3px 8px;">5</td><td style="padding:3px 8px;">32.935062...</td><td style="padding:3px 8px;">Yes</td></tr>
<tr><td style="padding:3px 8px;">...</td><td style="padding:3px 8px;">...</td><td style="padding:3px 8px;">...</td></tr>
<tr><td style="padding:3px 8px;">\\(10^{13}\\)</td><td style="padding:3px 8px;">\\(\\approx 10^{12}\\)</td><td style="padding:3px 8px;">Yes (numerical)</td></tr>
</table>

<h3>Zero-Density Theorems</h3>

<p>Even without RH, we can bound how many zeros can stray far from the critical line. The zero-density theorem states:</p>
\\[
N(\\sigma, T) := \\#\\{\\rho = \\beta+i\\gamma : \\beta > \\sigma, 0 < \\gamma \\le T\\} \\ll T^{A(1-\\sigma)}(\\log T)^B
\\]
<p>for \\(1/2 \\le \\sigma \\le 1\\). This shows that zeros with \\(\\text{Re}(\\rho) > \\sigma\\) are exponentially rare in \\(\\sigma - 1/2\\). As \\(\\sigma \\to 1\\), \\(N(\\sigma, T) \\to 0\\), consistent with the zero-free region.</p>

<h3>The Riemann Hypothesis Preview</h3>

<p>The Riemann Hypothesis (RH) asserts: all non-trivial zeros satisfy \\(\\text{Re}(\\rho) = 1/2\\). This would immediately imply:</p>
<ul>
    <li>\\(\\psi(x) = x + O(x^{1/2}\\log^2 x)\\)</li>
    <li>An asymptotic for twin primes (conditional on RH + Elliott-Halberstam)</li>
    <li>Precise results on gaps between primes</li>
</ul>
<p>RH is one of the seven Millennium Prize Problems (Clay Mathematics Institute, $1 million prize). Despite immense effort over 165 years, it remains open.</p>

<div class="viz-placeholder" data-viz="viz-zero-count"></div>
`,
            visualizations: [
                {
                    id: 'viz-zero-count',
                    title: 'N(T): The Zero Counting Staircase',
                    description: 'N(T) counts the non-trivial zeros of \\(\\zeta(s)\\) with imaginary part in \\((0, T]\\). The smooth approximation \\(T/(2\\pi)\\log(T/(2\\pi e))\\) is shown alongside the actual step function. Drag the slider to explore.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 340,
                            originX: 55, originY: 300, scale: 1
                        });

                        // Known zeros (imaginary parts of first 30 non-trivial zeros)
                        var knownGammas = [
                            14.1347, 21.0220, 25.0109, 30.4249, 32.9351,
                            37.5862, 40.9187, 43.3271, 48.0052, 49.7738,
                            52.9703, 56.4462, 59.3470, 60.8318, 65.1125,
                            67.0798, 69.5465, 72.0672, 75.7047, 77.1448,
                            79.3374, 82.9104, 84.7355, 87.4253, 88.8091,
                            92.4919, 94.6513, 95.8706, 98.8312, 101.318
                        ];

                        var TMax = 80;
                        var slider = VizEngine.createSlider(controls, 'T', 15, TMax, 45, 0.5, function(v) {
                            TMax = v; draw();
                        });

                        function NTsmooth(T) {
                            if (T < 2) return 0;
                            return T / (2 * Math.PI) * Math.log(T / (2 * Math.PI * Math.E));
                        }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            var Tmin = 10, Tmax = TMax;
                            var Nmax = knownGammas.filter(function(g) { return g <= Tmax; }).length + 3;
                            if (Nmax < 5) Nmax = 5;

                            function toSX(T) {
                                return viz.originX + (T - Tmin) / (Tmax - Tmin) * (viz.width - viz.originX - 20);
                            }
                            function toSY(N) {
                                return viz.originY - N / Nmax * (viz.originY - 25);
                            }

                            // Grid
                            for (var ng = 0; ng <= Nmax; ng += 5) {
                                ctx.strokeStyle = viz.colors.grid; ctx.lineWidth = 0.5;
                                ctx.beginPath(); ctx.moveTo(viz.originX, toSY(ng)); ctx.lineTo(viz.width - 10, toSY(ng)); ctx.stroke();
                                ctx.fillStyle = viz.colors.text; ctx.font = '10px sans-serif';
                                ctx.textAlign = 'right';
                                ctx.fillText(ng, viz.originX - 4, toSY(ng) + 4);
                            }

                            // Smooth N(T) formula
                            ctx.strokeStyle = viz.colors.orange; ctx.lineWidth = 2;
                            ctx.beginPath();
                            var started = false;
                            for (var tt = Tmin; tt <= Tmax; tt += 0.1) {
                                var val = NTsmooth(tt);
                                if (val < 0) continue;
                                var sx = toSX(tt), sy = toSY(val);
                                if (!started) { ctx.moveTo(sx, sy); started = true; }
                                else ctx.lineTo(sx, sy);
                            }
                            ctx.stroke();

                            // Step function: actual N(T)
                            var zeros = knownGammas.filter(function(g) { return g >= Tmin && g <= Tmax; });
                            zeros.sort(function(a,b){return a-b;});

                            ctx.strokeStyle = viz.colors.teal; ctx.lineWidth = 2.5;
                            ctx.beginPath();
                            var curN = knownGammas.filter(function(g) { return g < Tmin; }).length;
                            ctx.moveTo(toSX(Tmin), toSY(curN));
                            for (var zi = 0; zi < zeros.length; zi++) {
                                var z = zeros[zi];
                                ctx.lineTo(toSX(z), toSY(curN));
                                curN++;
                                ctx.lineTo(toSX(z), toSY(curN));
                            }
                            ctx.lineTo(toSX(Tmax), toSY(curN));
                            ctx.stroke();

                            // Zero markers
                            for (var zi2 = 0; zi2 < zeros.length; zi2++) {
                                var sy_z = toSY(knownGammas.filter(function(g) { return g <= zeros[zi2]; }).length);
                                ctx.fillStyle = viz.colors.teal;
                                ctx.beginPath(); ctx.arc(toSX(zeros[zi2]), sy_z, 3, 0, Math.PI*2); ctx.fill();
                            }

                            // Axes
                            ctx.strokeStyle = viz.colors.axis; ctx.lineWidth = 1.5;
                            ctx.beginPath(); ctx.moveTo(viz.originX, viz.originY); ctx.lineTo(viz.width-10, viz.originY); ctx.stroke();
                            ctx.beginPath(); ctx.moveTo(viz.originX, viz.originY); ctx.lineTo(viz.originX, 20); ctx.stroke();

                            // X-axis ticks
                            ctx.fillStyle = viz.colors.text; ctx.font = '10px sans-serif'; ctx.textAlign = 'center';
                            for (var xt = Tmin; xt <= Tmax; xt += 10) {
                                var sx_t = toSX(xt);
                                ctx.fillText(xt, sx_t, viz.originY + 12);
                                ctx.strokeStyle = viz.colors.axis; ctx.lineWidth = 1;
                                ctx.beginPath(); ctx.moveTo(sx_t, viz.originY-3); ctx.lineTo(sx_t, viz.originY+3); ctx.stroke();
                            }

                            // Legend
                            ctx.font = '10px sans-serif'; ctx.textAlign = 'left';
                            ctx.strokeStyle = viz.colors.teal; ctx.lineWidth = 2;
                            ctx.beginPath(); ctx.moveTo(viz.width-160, 35); ctx.lineTo(viz.width-140, 35); ctx.stroke();
                            ctx.fillStyle = viz.colors.text; ctx.fillText('N(T) exact', viz.width-136, 39);
                            ctx.strokeStyle = viz.colors.orange; ctx.lineWidth = 2;
                            ctx.beginPath(); ctx.moveTo(viz.width-160, 50); ctx.lineTo(viz.width-140, 50); ctx.stroke();
                            ctx.fillStyle = viz.colors.text; ctx.fillText('T/(2\u03C0)log(T/2\u03C0e)', viz.width-136, 54);

                            // Count display
                            var actualN = knownGammas.filter(function(g) { return g <= Tmax; }).length;
                            var smoothN = NTsmooth(Tmax).toFixed(1);
                            viz.screenText('T=' + Tmax.toFixed(1) + '  N(T)=' + actualN + '  smooth=' + smoothN, viz.width/2, 15, viz.colors.white, 11);

                            viz.screenText('T', viz.width - 12, viz.originY + 4, viz.colors.text, 12);
                            viz.screenText('N(T)', viz.originX - 10, 18, viz.colors.text, 11);
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Using the von Mangoldt formula \\(N(T) = \\frac{T}{2\\pi}\\log\\frac{T}{2\\pi e} + O(\\log T)\\), estimate the average spacing between consecutive zeros near height \\(T\\). What is this spacing for \\(T = 100\\)? For \\(T = 10^6\\)?',
                    hint: 'The spacing is approximately \\(1/N\'(T)\\).',
                    solution: '\\(N\'(T) \\approx \\frac{1}{2\\pi}\\log\\frac{T}{2\\pi}\\). So the average spacing is \\(\\approx 2\\pi/\\log(T/2\\pi)\\). For \\(T=100\\): spacing \\(\\approx 2\\pi/\\log(100/2\\pi) \\approx 6.28/2.77 \\approx 2.27\\). For \\(T=10^6\\): spacing \\(\\approx 6.28/\\log(10^6/2\\pi) \\approx 6.28/12.97 \\approx 0.48\\).'
                },
                {
                    question: 'The zero-density theorem gives \\(N(\\sigma, T) \\ll T^{A(1-\\sigma)}\\log^B T\\). Show that for any fixed \\(\\sigma > 1/2\\), \\(N(\\sigma, T)/N(T) \\to 0\\) as \\(T \\to \\infty\\). What does this say about where most zeros are?',
                    hint: 'Use \\(N(T) \\sim T\\log T/(2\\pi)\\).',
                    solution: '\\(N(\\sigma,T)/N(T) \\ll T^{A(1-\\sigma)}\\log^B T / (T\\log T/(2\\pi)) \\approx T^{A(1-\\sigma)-1}\\log^{B-1}T\\). For any \\(\\sigma > 1/2\\), we have \\(A(1-\\sigma) < A/2\\). Taking \\(A < 2\\) (which the density theorem achieves), the ratio \\(\\to 0\\). This says: most zeros concentrate near the critical line \\(\\text{Re}(s) = 1/2\\), consistent with RH.'
                }
            ]
        },

        // ================================================================
        // SECTION 6: Armed for PNT
        // ================================================================
        {
            id: 'sec-bridge',
            title: 'Armed for PNT',
            content: `
<h2>Armed for PNT</h2>

<p>We now have everything we need to prove the Prime Number Theorem. Let us take stock of what we have established in this chapter, and sketch how each piece feeds into the proof.</p>

<h3>Summary of Chapter 6</h3>

<div class="env-block theorem">
    <div class="env-title">What We Have Proved</div>
    <div class="env-body">
        <ol>
            <li><strong>No zeros on Re(s) = 1</strong> (Theorem 6.4): \\(\\zeta(1+it) \\ne 0\\) for all \\(t \\ne 0\\). Proof: the 3-4-1 inequality \\(3 + 4\\cos\\theta + \\cos 2\\theta \\ge 0\\) combined with the pole of \\(\\zeta\\) at \\(s=1\\).</li>
            <li><strong>Classical zero-free region</strong> (Theorem 6.6): no zeros for \\(\\sigma > 1 - c/\\log|t|\\), \\(|t| \\ge 2\\). Same inequality, quantified.</li>
            <li><strong>Vinogradov-Korobov</strong> (Theorem 6.7): no zeros for \\(\\sigma > 1 - c/(\\log|t|)^{2/3}(\\log\\log|t|)^{1/3}\\), using exponential sums.</li>
            <li><strong>Zero counting</strong> (Theorem 6.8): \\(N(T) \\sim T\\log T/(2\\pi)\\).</li>
        </ol>
    </div>
</div>

<h3>The PNT Proof Roadmap</h3>

<p>The full proof of the PNT (Chapter 7) proceeds in four steps:</p>

<ol>
    <li><strong>Perron's formula:</strong> \\(\\psi(x) = \\frac{1}{2\\pi i}\\int_{c-i\\infty}^{c+i\\infty} \\left(-\\frac{\\zeta'(s)}{\\zeta(s)}\\right)\\frac{x^s}{s}\\,ds\\) for \\(c > 1\\).</li>
    <li><strong>Move the contour</strong> leftward to \\(\\text{Re}(s) = 1 - c_1/\\log T\\), avoiding zeros by Theorem 6.6.</li>
    <li><strong>Residue at \\(s=1\\):</strong> The pole of \\(-\\zeta'/\\zeta\\) at \\(s=1\\) contributes \\(x/1 = x\\) (the main term).</li>
    <li><strong>Bound the remainder:</strong> The integral over the contour contributes \\(O(xe^{-c\\sqrt{\\log x}})\\).</li>
</ol>

<p>The crucial ingredient is Step 2: <em>we can move the contour past \\(\\text{Re}(s)=1\\) precisely because Theorem 6.6 guarantees no zeros there.</em> Without the zero-free region, the contour would be blocked and the residue calculation would be impossible.</p>

<h3>The Landscape Ahead</h3>

<div class="env-block remark">
    <div class="env-title">Looking Forward</div>
    <div class="env-body">
        <ul>
            <li><strong>Chapter 7:</strong> Complete proof of the PNT via Perron's formula and the zero-free region.</li>
            <li><strong>Chapter 8:</strong> The explicit formula \\(\\psi(x) = x - \\sum_\\rho x^\\rho/\\rho - \\log(2\\pi)\\). Each zero contributes an oscillation; the zero-free region controls their collective size.</li>
            <li><strong>Chapter 9:</strong> Generalization to Dirichlet L-functions. The Siegel zero problem: real zeros of \\(L(s,\\chi)\\) close to 1 that resist all known methods.</li>
            <li><strong>Chapter 16:</strong> Zeros of L-functions in full generality: the Grand Riemann Hypothesis, zero repulsion, and the Pair Correlation Conjecture of Montgomery.</li>
        </ul>
    </div>
</div>

<p>The zero-free region is not an isolated technical lemma — it is the load-bearing wall of the entire building. Every quantitative result about prime distribution rests on it, and every improvement in the error term corresponds to an improvement in the size of the zero-free region. The Riemann Hypothesis, if proved, would give the ultimate zero-free region and with it a near-perfect description of prime distribution.</p>

<div class="env-block intuition">
    <div class="env-title">The Deep Reason</div>
    <div class="env-body">
        <p>Why does arithmetic — the behavior of integers under multiplication — care about where an analytic function vanishes? The answer is that the Euler product \\(\\zeta(s) = \\prod_p (1-p^{-s})^{-1}\\) encodes all multiplicative information about primes into the analytic structure of \\(\\zeta(s)\\). The zeros of \\(\\zeta(s)\\) are the "spectral frequencies" at which the prime distribution oscillates. The further these frequencies are from the real axis (i.e., from \\(\\text{Re}(s)=1\\)), the smaller and better-controlled the oscillations. This is, at heart, a spectral theory of prime numbers.</p>
    </div>
</div>
`,
            visualizations: [],
            exercises: [
                {
                    question: 'Explain why Perron\'s formula \\(\\psi(x) = \\frac{1}{2\\pi i}\\int_{c-iT}^{c+iT}(-\\zeta\'/\\zeta)(s)x^s/s\\,ds + \\text{error}\\) cannot be used to prove PNT if we only know that \\(\\zeta(s) \\ne 0\\) for \\(\\text{Re}(s) > 1\\).',
                    hint: 'What happens when you try to shift the contour left of Re(s)=1?',
                    solution: 'If we only know \\(\\zeta \\ne 0\\) for \\(\\text{Re}(s) > 1\\), we cannot push the contour into the strip \\(0 < \\text{Re}(s) < 1\\) without potentially crossing zeros. The function \\(-\\zeta\'/\\zeta\\) has poles at zeros of \\(\\zeta\\), and any such pole on the contour or between the original and new contour would contribute additional residues. Without knowing the line \\(\\text{Re}(s)=1\\) is zero-free, we cannot even begin the contour shift needed to extract the main term \\(x\\).'
                },
                {
                    question: 'State (without proof) how the PNT error term improves if one assumes the Riemann Hypothesis. Compare this to the classical and Vinogradov-Korobov error terms.',
                    hint: 'Under RH, all zeros have \\(\\text{Re}(\\rho) = 1/2\\).',
                    solution: 'Under RH: \\(\\psi(x) = x + O(x^{1/2}\\log^2 x)\\), equivalently \\(\\pi(x) = \\text{Li}(x) + O(x^{1/2}\\log x)\\). Classical error: \\(O(x e^{-c\\sqrt{\\log x}})\\). VK error: \\(O(x\\exp(-c(\\log x)^{3/5}(\\log\\log x)^{-1/5}))\\). Under RH the error \\(O(\\sqrt{x}\\log^2 x)\\) is dramatically smaller, reflecting the fact that zeros at \\(\\text{Re}(s)=1/2\\) contribute oscillations of size \\(\\sim x^{1/2}\\), versus oscillations that could be nearly as large as \\(x\\) from a zero with \\(\\text{Re}(s)\\) close to 1.'
                },
                {
                    question: 'In the explicit formula \\(\\psi(x) = x - \\sum_\\rho x^\\rho/\\rho - \\log(2\\pi) - \\tfrac{1}{2}\\log(1-x^{-2})\\), the sum over zeros converges conditionally. How does the classical zero-free region allow us to bound \\(|\\sum_{|\\gamma| \\le T} x^\\rho/\\rho|\\)?',
                    hint: 'Bound \\(|x^\\rho|\\) using the zero-free region constraint on \\(\\text{Re}(\\rho)\\).',
                    solution: '\\(|x^\\rho| = x^{\\text{Re}(\\rho)} = x^\\beta\\). In the zero-free region, we know \\(\\beta < 1 - c/\\log|\\gamma|\\) for every zero \\(\\rho = \\beta + i\\gamma\\). So \\(|x^\\rho| = x^\\beta \\le x \\cdot x^{-c/\\log|\\gamma|} = x \\cdot e^{-c\\log x/\\log|\\gamma|}\\). Summing over \\(|\\gamma| \\le T\\) using \\(\\#\\{|\\gamma| \\le T\\} \\ll T\\log T\\), and optimizing \\(T\\), gives the bound \\(O(xe^{-c\\sqrt{\\log x}})\\) for the sum.'
                }
            ]
        }
    ]
});
