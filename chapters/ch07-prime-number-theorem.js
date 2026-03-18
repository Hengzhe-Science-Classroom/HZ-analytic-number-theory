// === Chapter 7: The Prime Number Theorem ===
window.CHAPTERS = window.CHAPTERS || [];
window.CHAPTERS.push({
    id: 'ch07',
    number: 7,
    title: 'The Prime Number Theorem',
    subtitle: 'The climax: \u03C0(x) ~ x/ln(x), proved by complex analysis',
    sections: [
        // ================================================================
        // SECTION 1: Motivation — Why PNT?
        // ================================================================
        {
            id: 'sec-motivation',
            title: 'Motivation',
            content: `
<h2>The Central Question of Analytic Number Theory</h2>

<div class="env-block intuition">
    <div class="env-title">The Climax</div>
    <div class="env-body">
        <p>Everything we have built so far, arithmetic functions, Dirichlet series, the zeta function, analytic continuation, zero-free regions, converges on a single theorem. The <strong>Prime Number Theorem</strong> (PNT) asserts that the number of primes up to \\(x\\) satisfies</p>
        \\[\\pi(x) \\sim \\frac{x}{\\ln x}\\]
        <p>meaning \\(\\lim_{x \\to \\infty} \\pi(x) / (x/\\ln x) = 1\\). Primes thin out, but in a perfectly predictable way.</p>
    </div>
</div>

<p>The conjecture is old. Gauss, as a teenager around 1792, studied tables of primes and guessed that the "density" of primes near \\(x\\) is roughly \\(1/\\ln x\\). By 1808 Legendre published the approximation \\(\\pi(x) \\approx x/(\\ln x - 1.08366)\\). But a proof eluded mathematicians for over a century.</p>

<h3>What Does \\(\\pi(x) \\sim x/\\ln x\\) Actually Say?</h3>

<p>The statement is asymptotic: it does <em>not</em> say \\(\\pi(x) = x/\\ln x\\), nor does it give an error bound. It says the <em>ratio</em> tends to 1. More precisely:</p>

<div class="env-block definition">
    <div class="env-title">Definition (Asymptotic Equivalence)</div>
    <div class="env-body">
        <p>We write \\(f(x) \\sim g(x)\\) as \\(x \\to \\infty\\) if \\(\\lim_{x \\to \\infty} f(x)/g(x) = 1\\).</p>
    </div>
</div>

<p>A sharper approximation uses the <strong>logarithmic integral</strong>:</p>
\\[\\operatorname{Li}(x) = \\int_2^x \\frac{dt}{\\ln t}.\\]
<p>Integration by parts gives \\(\\operatorname{Li}(x) = x/\\ln x + x/(\\ln x)^2 + 2x/(\\ln x)^3 + \\cdots\\), so \\(\\operatorname{Li}(x) \\sim x/\\ln x\\). In practice \\(\\operatorname{Li}(x)\\) is far more accurate than \\(x/\\ln x\\).</p>

<h3>Historical Timeline</h3>

<div class="env-block remark">
    <div class="env-title">Key Dates</div>
    <div class="env-body">
        <ul>
            <li><strong>~1792</strong>: Gauss conjectures the prime density \\(\\approx 1/\\ln x\\) from numerical data.</li>
            <li><strong>1837</strong>: Dirichlet introduces \\(L\\)-functions and proves his theorem on primes in arithmetic progressions.</li>
            <li><strong>1848-1850</strong>: Chebyshev proves \\(\\pi(x)\\) is bounded between \\(c_1 x/\\ln x\\) and \\(c_2 x/\\ln x\\) with explicit constants.</li>
            <li><strong>1859</strong>: Riemann's memoir connects \\(\\pi(x)\\) to the zeros of \\(\\zeta(s)\\) via the explicit formula.</li>
            <li><strong>1896</strong>: Hadamard and de la Vall\\'{e}e-Poussin independently prove PNT using the zero-free region \\(\\zeta(s) \\neq 0\\) on \\(\\operatorname{Re}(s) = 1\\).</li>
            <li><strong>1949</strong>: Selberg and Erd\\H{o}s give "elementary" proofs (no complex analysis), but the analytic proof remains cleaner and more powerful.</li>
        </ul>
    </div>
</div>

<h3>The Strategy</h3>

<p>The proof we present follows the classical Hadamard-de la Vall\\'{e}e-Poussin approach:</p>
<ol>
    <li>Reduce PNT to an equivalent statement about the Chebyshev function \\(\\psi(x)\\).</li>
    <li>Express \\(\\psi(x)\\) via a contour integral involving \\(\\zeta'/\\zeta\\) (Perron's formula).</li>
    <li>Shift the contour leftward past \\(\\operatorname{Re}(s) = 1\\), picking up the residue of the pole at \\(s = 1\\).</li>
    <li>Use the zero-free region (Chapter 6) to bound the remaining integral.</li>
    <li>Conclude \\(\\psi(x) \\sim x\\), hence \\(\\pi(x) \\sim x/\\ln x\\).</li>
</ol>

<div class="viz-placeholder" data-viz="viz-psi-convergence"></div>
`,
            visualizations: [
                {
                    id: 'viz-psi-convergence',
                    title: '\\(\\psi(x)/x\\) Converges to 1',
                    description: 'The Chebyshev function \\(\\psi(x) = \\sum_{p^k \\leq x} \\ln p\\). The PNT is equivalent to \\(\\psi(x)/x \\to 1\\). Watch the ratio settle toward 1 as \\(x\\) grows.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 380,
                            originX: 60, originY: 340, scale: 1
                        });

                        var maxX = 500;
                        VizEngine.createSlider(controls, 'x max', 100, 5000, maxX, 100, function(v) {
                            maxX = Math.round(v);
                            draw();
                        });

                        var primes = VizEngine.sievePrimes(10000);

                        function psi(x) {
                            var sum = 0;
                            for (var i = 0; i < primes.length; i++) {
                                var p = primes[i];
                                if (p > x) break;
                                var pk = p;
                                while (pk <= x) {
                                    sum += Math.log(p);
                                    pk *= p;
                                }
                            }
                            return sum;
                        }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var W = viz.width - 80;
                            var H = 280;
                            var baseY = 330;
                            var topY = 40;

                            // Title
                            viz.screenText('\u03C8(x)/x approaching 1', viz.width / 2, 20, viz.colors.white, 14);

                            // Draw axes
                            ctx.strokeStyle = viz.colors.axis;
                            ctx.lineWidth = 1;
                            ctx.beginPath();
                            ctx.moveTo(60, baseY);
                            ctx.lineTo(viz.width - 20, baseY);
                            ctx.stroke();
                            ctx.beginPath();
                            ctx.moveTo(60, baseY);
                            ctx.lineTo(60, topY);
                            ctx.stroke();

                            // Y axis labels
                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '10px -apple-system,sans-serif';
                            ctx.textAlign = 'right';
                            ctx.textBaseline = 'middle';
                            for (var yv = 0; yv <= 1.4; yv += 0.2) {
                                var sy = baseY - (yv / 1.5) * H;
                                ctx.fillText(yv.toFixed(1), 55, sy);
                                ctx.strokeStyle = viz.colors.grid;
                                ctx.lineWidth = 0.5;
                                ctx.beginPath();
                                ctx.moveTo(60, sy);
                                ctx.lineTo(viz.width - 20, sy);
                                ctx.stroke();
                            }

                            // Draw y=1 line (target)
                            var y1 = baseY - (1.0 / 1.5) * H;
                            ctx.strokeStyle = viz.colors.green + '88';
                            ctx.lineWidth = 2;
                            ctx.setLineDash([6, 4]);
                            ctx.beginPath();
                            ctx.moveTo(60, y1);
                            ctx.lineTo(viz.width - 20, y1);
                            ctx.stroke();
                            ctx.setLineDash([]);
                            viz.screenText('y = 1', viz.width - 15, y1 - 10, viz.colors.green, 11, 'right');

                            // Plot psi(x)/x
                            var step = Math.max(1, Math.floor(maxX / 400));
                            ctx.strokeStyle = viz.colors.blue;
                            ctx.lineWidth = 2;
                            ctx.beginPath();
                            var started = false;
                            for (var x = 2; x <= maxX; x += step) {
                                var ratio = psi(x) / x;
                                var sx = 60 + (x / maxX) * W;
                                var sy2 = baseY - (ratio / 1.5) * H;
                                if (!started) { ctx.moveTo(sx, sy2); started = true; }
                                else ctx.lineTo(sx, sy2);
                            }
                            ctx.stroke();

                            // X axis labels
                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '10px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'top';
                            var nLabels = Math.min(6, Math.floor(maxX / 100));
                            for (var i = 1; i <= nLabels; i++) {
                                var xv = Math.round(maxX * i / nLabels);
                                var sxl = 60 + (xv / maxX) * W;
                                ctx.fillText(xv.toString(), sxl, baseY + 4);
                            }

                            // Current endpoint
                            var endRatio = psi(maxX) / maxX;
                            viz.screenText('\u03C8(' + maxX + ')/' + maxX + ' = ' + endRatio.toFixed(4), viz.width / 2, baseY + 22, viz.colors.teal, 12);
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: []
        },

        // ================================================================
        // SECTION 2: Chebyshev Functions
        // ================================================================
        {
            id: 'sec-chebyshev',
            title: 'Chebyshev Functions',
            content: `
<h2>The Chebyshev Functions \\(\\psi\\), \\(\\theta\\), and Their Equivalence</h2>

<p>Rather than working directly with \\(\\pi(x)\\), the proof of PNT uses smoother "weighted" counting functions introduced by Chebyshev.</p>

<div class="env-block definition">
    <div class="env-title">Definition (Chebyshev Functions)</div>
    <div class="env-body">
        <p>The <strong>first Chebyshev function</strong> is</p>
        \\[\\theta(x) = \\sum_{p \\leq x} \\ln p\\]
        <p>which sums \\(\\ln p\\) over primes \\(p \\leq x\\).</p>
        <p>The <strong>second Chebyshev function</strong> is</p>
        \\[\\psi(x) = \\sum_{n \\leq x} \\Lambda(n) = \\sum_{p^k \\leq x} \\ln p\\]
        <p>where \\(\\Lambda\\) is the von Mangoldt function. This sums \\(\\ln p\\) over all prime powers \\(p^k \\leq x\\).</p>
    </div>
</div>

<h3>Why Use These?</h3>

<p>The function \\(\\pi(x)\\) counts each prime equally, but from the perspective of Dirichlet series, the natural weight for the prime \\(p\\) is \\(\\ln p\\). Recall that \\(-\\zeta'(s)/\\zeta(s) = \\sum_{n=1}^{\\infty} \\Lambda(n) n^{-s}\\), so \\(\\psi(x)\\) is the partial-sum function of the coefficients of \\(-\\zeta'/\\zeta\\). This is what makes Perron's formula directly applicable.</p>

<h3>Equivalence of PNT Statements</h3>

<div class="env-block theorem">
    <div class="env-title">Theorem 7.1 (Equivalence)</div>
    <div class="env-body">
        <p>The following are equivalent:</p>
        <ol>
            <li>\\(\\pi(x) \\sim x/\\ln x\\) (PNT for \\(\\pi\\)).</li>
            <li>\\(\\theta(x) \\sim x\\) (PNT for \\(\\theta\\)).</li>
            <li>\\(\\psi(x) \\sim x\\) (PNT for \\(\\psi\\)).</li>
        </ol>
    </div>
</div>

<div class="env-block proof">
    <div class="env-title">Proof Sketch</div>
    <div class="env-body">
        <p><strong>(3) \\(\\Rightarrow\\) (2):</strong> Since \\(\\psi(x) = \\theta(x) + \\theta(x^{1/2}) + \\theta(x^{1/3}) + \\cdots\\), and trivially \\(\\theta(x) \\leq \\psi(x)\\), we have</p>
        \\[\\theta(x) \\leq \\psi(x) \\leq \\theta(x) + \\theta(x^{1/2}) + \\theta(x^{1/3}) + \\cdots.\\]
        <p>Now \\(\\theta(y) \\leq y \\ln y\\) trivially (each prime \\(p \\leq y\\) contributes at most \\(\\ln y\\)). The sum of higher prime powers contributes at most \\(\\sqrt{x} \\ln x \\cdot \\log_2 x\\), which is \\(o(x)\\). Hence \\(\\psi(x) - \\theta(x) = o(x)\\), so \\(\\psi(x) \\sim x\\) iff \\(\\theta(x) \\sim x\\).</p>

        <p><strong>(2) \\(\\Leftrightarrow\\) (1):</strong> By Abel summation (partial summation),</p>
        \\[\\theta(x) = \\pi(x) \\ln x - \\int_2^x \\frac{\\pi(t)}{t}\\, dt.\\]
        <p>If \\(\\pi(x) \\sim x/\\ln x\\), then \\(\\theta(x) \\sim x\\). Conversely, if \\(\\theta(x) \\sim x\\), then \\(\\pi(x) \\sim x/\\ln x\\). The details use careful asymptotic analysis of the integral.</p>
    </div>
    <div class="qed">&marker;</div>
</div>

<h3>The Key Relation: \\(\\psi\\) and \\(\\zeta'/\\zeta\\)</h3>

<p>The Dirichlet series representation</p>
\\[-\\frac{\\zeta'(s)}{\\zeta(s)} = \\sum_{n=1}^{\\infty} \\frac{\\Lambda(n)}{n^s}, \\quad \\operatorname{Re}(s) > 1\\]
<p>means \\(\\psi(x) = \\sum_{n \\leq x} \\Lambda(n)\\) is exactly the partial sum of the coefficients of \\(-\\zeta'/\\zeta\\). Perron's formula will convert this into a contour integral.</p>

<div class="viz-placeholder" data-viz="viz-chebyshev-sandwich"></div>
`,
            visualizations: [
                {
                    id: 'viz-chebyshev-sandwich',
                    title: 'Chebyshev Sandwich: \\(\\theta(x)\\), \\(\\psi(x)\\), and \\(x\\)',
                    description: 'Compare the growth of \\(\\theta(x)\\) and \\(\\psi(x)\\) against the line \\(y = x\\). Both converge to the same asymptotic, but \\(\\psi\\) includes prime power contributions.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 380,
                            originX: 60, originY: 340, scale: 1
                        });

                        var maxX = 200;
                        VizEngine.createSlider(controls, 'x max', 50, 2000, maxX, 50, function(v) {
                            maxX = Math.round(v);
                            draw();
                        });

                        var primes = VizEngine.sievePrimes(5000);

                        function theta(x) {
                            var sum = 0;
                            for (var i = 0; i < primes.length; i++) {
                                if (primes[i] > x) break;
                                sum += Math.log(primes[i]);
                            }
                            return sum;
                        }

                        function psiFunc(x) {
                            var sum = 0;
                            for (var i = 0; i < primes.length; i++) {
                                var p = primes[i];
                                if (p > x) break;
                                var pk = p;
                                while (pk <= x) {
                                    sum += Math.log(p);
                                    pk *= p;
                                }
                            }
                            return sum;
                        }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var W = viz.width - 80;
                            var H = 280;
                            var baseY = 330;

                            viz.screenText('\u03B8(x), \u03C8(x), and x', viz.width / 2, 20, viz.colors.white, 14);

                            // Axes
                            ctx.strokeStyle = viz.colors.axis;
                            ctx.lineWidth = 1;
                            ctx.beginPath();
                            ctx.moveTo(60, baseY);
                            ctx.lineTo(viz.width - 20, baseY);
                            ctx.stroke();
                            ctx.beginPath();
                            ctx.moveTo(60, baseY);
                            ctx.lineTo(60, 30);
                            ctx.stroke();

                            // Scale
                            var yMax = maxX * 1.1;

                            function toSx(x) { return 60 + (x / maxX) * W; }
                            function toSy(y) { return baseY - (y / yMax) * H; }

                            // Y labels
                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '10px -apple-system,sans-serif';
                            ctx.textAlign = 'right';
                            ctx.textBaseline = 'middle';
                            var yStep = Math.pow(10, Math.floor(Math.log10(yMax / 4)));
                            if (yMax / yStep > 8) yStep *= 2;
                            for (var yv = 0; yv <= yMax; yv += yStep) {
                                var sy = toSy(yv);
                                if (sy < 35) break;
                                ctx.fillText(Math.round(yv).toString(), 55, sy);
                                ctx.strokeStyle = viz.colors.grid;
                                ctx.lineWidth = 0.5;
                                ctx.beginPath();
                                ctx.moveTo(60, sy);
                                ctx.lineTo(viz.width - 20, sy);
                                ctx.stroke();
                            }

                            // Draw y = x
                            ctx.strokeStyle = viz.colors.white + '66';
                            ctx.lineWidth = 1.5;
                            ctx.setLineDash([4, 4]);
                            ctx.beginPath();
                            ctx.moveTo(toSx(0), toSy(0));
                            ctx.lineTo(toSx(maxX), toSy(maxX));
                            ctx.stroke();
                            ctx.setLineDash([]);

                            // Plot theta
                            var step = Math.max(1, Math.floor(maxX / 300));
                            ctx.strokeStyle = viz.colors.teal;
                            ctx.lineWidth = 2;
                            ctx.beginPath();
                            var started = false;
                            for (var x = 2; x <= maxX; x += step) {
                                var sx = toSx(x);
                                var sy2 = toSy(theta(x));
                                if (!started) { ctx.moveTo(sx, sy2); started = true; }
                                else ctx.lineTo(sx, sy2);
                            }
                            ctx.stroke();

                            // Plot psi
                            ctx.strokeStyle = viz.colors.blue;
                            ctx.lineWidth = 2;
                            ctx.beginPath();
                            started = false;
                            for (var x2 = 2; x2 <= maxX; x2 += step) {
                                var sx3 = toSx(x2);
                                var sy3 = toSy(psiFunc(x2));
                                if (!started) { ctx.moveTo(sx3, sy3); started = true; }
                                else ctx.lineTo(sx3, sy3);
                            }
                            ctx.stroke();

                            // Legend
                            var legY = baseY + 18;
                            ctx.font = '11px -apple-system,sans-serif';
                            ctx.textAlign = 'left';
                            ctx.fillStyle = viz.colors.blue;
                            ctx.fillRect(viz.width / 2 - 120, legY - 5, 12, 12);
                            ctx.fillText('\u03C8(x)', viz.width / 2 - 104, legY + 5);
                            ctx.fillStyle = viz.colors.teal;
                            ctx.fillRect(viz.width / 2 - 40, legY - 5, 12, 12);
                            ctx.fillText('\u03B8(x)', viz.width / 2 - 24, legY + 5);
                            ctx.fillStyle = viz.colors.white + '88';
                            ctx.fillRect(viz.width / 2 + 40, legY - 5, 12, 12);
                            ctx.fillText('y = x', viz.width / 2 + 56, legY + 5);

                            // X labels
                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '10px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'top';
                            var xStep = Math.pow(10, Math.floor(Math.log10(maxX / 5)));
                            if (maxX / xStep > 10) xStep *= 2;
                            for (var xv = xStep; xv <= maxX; xv += xStep) {
                                ctx.fillText(xv.toString(), toSx(xv), baseY + 4);
                            }
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Compute \\(\\theta(20)\\) and \\(\\psi(20)\\) by hand.',
                    hint: 'Primes up to 20: 2, 3, 5, 7, 11, 13, 17, 19. For \\(\\psi\\), also include prime powers \\(4 = 2^2\\), \\(8 = 2^3\\), \\(9 = 3^2\\), \\(16 = 2^4\\).',
                    solution: '\\(\\theta(20) = \\ln 2 + \\ln 3 + \\ln 5 + \\ln 7 + \\ln 11 + \\ln 13 + \\ln 17 + \\ln 19 = \\ln(2 \\cdot 3 \\cdot 5 \\cdot 7 \\cdot 11 \\cdot 13 \\cdot 17 \\cdot 19) = \\ln(9{,}699{,}690) \\approx 16.09\\). For \\(\\psi(20)\\): add \\(\\ln 2\\) for \\(4, 8, 16\\) (three extra copies) and \\(\\ln 3\\) for \\(9\\) (one extra copy). So \\(\\psi(20) = \\theta(20) + 3\\ln 2 + \\ln 3 \\approx 16.09 + 2.08 + 1.10 = 19.27\\).'
                },
                {
                    question: 'Show that \\(\\psi(x) - \\theta(x) = O(\\sqrt{x}\\,(\\ln x)^2)\\).',
                    hint: 'The difference \\(\\psi(x) - \\theta(x) = \\sum_{k=2}^{\\infty} \\theta(x^{1/k})\\). Use \\(\\theta(y) \\leq y \\ln y\\) and note the sum has at most \\(\\log_2 x\\) nonzero terms.',
                    solution: '\\(\\psi(x) - \\theta(x) = \\theta(x^{1/2}) + \\theta(x^{1/3}) + \\cdots\\). Since \\(\\theta(y) \\leq y \\ln y\\), the \\(k\\)-th term is \\(\\leq x^{1/k} \\ln(x^{1/k}) = x^{1/k} \\cdot \\frac{\\ln x}{k}\\). The dominant term is \\(k=2\\): \\(\\theta(\\sqrt{x}) \\leq \\sqrt{x} \\ln \\sqrt{x} = \\frac{1}{2}\\sqrt{x}\\ln x\\). There are \\(\\leq \\log_2 x\\) terms total, so \\(\\psi(x) - \\theta(x) = O(\\sqrt{x}(\\ln x)^2)\\).'
                }
            ]
        },

        // ================================================================
        // SECTION 3: Chebyshev's Bounds
        // ================================================================
        {
            id: 'sec-chebyshev-bounds',
            title: "Chebyshev's Bounds",
            content: `
<h2>Chebyshev's Bounds: The Right Order of Growth</h2>

<p>Half a century before the PNT was proved, Chebyshev (1848-1850) showed that \\(\\pi(x)\\) has the right order of magnitude. He could not prove the limit equals 1, but he pinned it between two constants.</p>

<div class="env-block theorem">
    <div class="env-title">Theorem 7.2 (Chebyshev's Bounds)</div>
    <div class="env-body">
        <p>There exist constants \\(0 < c_1 < 1 < c_2\\) such that for all sufficiently large \\(x\\),</p>
        \\[c_1 \\frac{x}{\\ln x} \\leq \\pi(x) \\leq c_2 \\frac{x}{\\ln x}.\\]
        <p>Equivalently, \\(c_1 x \\leq \\psi(x) \\leq c_2 x\\). Chebyshev obtained \\(c_1 = \\ln 2 \\approx 0.693\\) and \\(c_2 = 6 \\ln 2 / 5 \\approx 0.832\\) for the upper bound on \\(\\theta\\), and corresponding values for \\(\\pi\\).</p>
    </div>
</div>

<div class="env-block proof">
    <div class="env-title">Proof Idea (Upper Bound)</div>
    <div class="env-body">
        <p>Consider the central binomial coefficient \\(\\binom{2n}{n}\\). On one hand, \\(\\binom{2n}{n} \\leq 2^{2n}\\) (since it is one term of \\((1+1)^{2n}\\)). On the other hand, every prime \\(p\\) with \\(n < p \\leq 2n\\) divides \\(\\binom{2n}{n}\\) (since \\(p\\) divides \\((2n)!\\) but not \\(n! \\cdot n!\\)). Therefore:</p>
        \\[\\prod_{n < p \\leq 2n} p \\leq \\binom{2n}{n} \\leq 4^n.\\]
        <p>Taking logarithms: \\(\\theta(2n) - \\theta(n) \\leq n \\ln 4\\). Telescoping gives \\(\\theta(x) \\leq 2x \\ln 2\\).</p>
    </div>
    <div class="qed">&marker;</div>
</div>

<div class="env-block proof">
    <div class="env-title">Proof Idea (Lower Bound)</div>
    <div class="env-body">
        <p>We also have \\(\\binom{2n}{n} \\geq 2^{2n}/(2n+1)\\) (the central term is the largest). A more careful analysis of the prime factorization of \\(\\binom{2n}{n}\\) gives the lower bound. Alternatively, one shows \\(\\theta(x) \\geq (\\ln 2) x\\) for large \\(x\\) by analyzing \\(\\sum_{p \\leq x} \\ln p\\) via similar binomial coefficient arguments.</p>
    </div>
    <div class="qed">&marker;</div>
</div>

<h3>Chebyshev's Remarkable Claim</h3>

<p>Chebyshev also showed: <em>if</em> \\(\\lim_{x \\to \\infty} \\pi(x)/(x/\\ln x)\\) exists, it must equal 1. So the only question was whether the limit exists at all. Proving existence required entirely different tools: complex analysis.</p>

<div class="env-block remark">
    <div class="env-title">Bertrand's Postulate</div>
    <div class="env-body">
        <p>As a bonus, Chebyshev's method proves <strong>Bertrand's postulate</strong>: for every \\(n \\geq 1\\), there exists a prime \\(p\\) with \\(n < p \\leq 2n\\). The bound \\(\\theta(2n) - \\theta(n) > 0\\) for large \\(n\\) (supplemented by computation for small \\(n\\)) gives exactly this.</p>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-perron-integral"></div>
`,
            visualizations: [
                {
                    id: 'viz-perron-integral',
                    title: "Chebyshev's Bounds vs PNT",
                    description: "Compare \\(\\pi(x)\\) with Chebyshev's upper and lower bounds and the PNT approximation \\(x/\\ln x\\). Chebyshev proved the sandwich; PNT says both bounds converge to the same line.",
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 380,
                            originX: 60, originY: 340, scale: 1
                        });

                        var maxX = 500;
                        VizEngine.createSlider(controls, 'x max', 50, 5000, maxX, 50, function(v) {
                            maxX = Math.round(v);
                            draw();
                        });

                        var primes = VizEngine.sievePrimes(10000);

                        function piFunc(x) {
                            var cnt = 0;
                            for (var i = 0; i < primes.length; i++) {
                                if (primes[i] > x) break;
                                cnt++;
                            }
                            return cnt;
                        }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var W = viz.width - 80;
                            var H = 280;
                            var baseY = 330;
                            var piMax = piFunc(maxX);
                            var yMax = Math.max(piMax * 1.3, 10);

                            viz.screenText("Chebyshev's Bounds on \u03C0(x)", viz.width / 2, 20, viz.colors.white, 14);

                            // Axes
                            ctx.strokeStyle = viz.colors.axis;
                            ctx.lineWidth = 1;
                            ctx.beginPath();
                            ctx.moveTo(60, baseY);
                            ctx.lineTo(viz.width - 20, baseY);
                            ctx.stroke();
                            ctx.beginPath();
                            ctx.moveTo(60, baseY);
                            ctx.lineTo(60, 30);
                            ctx.stroke();

                            function toSx(x) { return 60 + (x / maxX) * W; }
                            function toSy(y) { return baseY - (y / yMax) * H; }

                            var step = Math.max(1, Math.floor(maxX / 300));

                            // Upper bound: c2 * x/ln(x) with c2 = 1.25506
                            ctx.strokeStyle = viz.colors.red + '88';
                            ctx.lineWidth = 1.5;
                            ctx.setLineDash([4, 4]);
                            ctx.beginPath();
                            var started = false;
                            for (var x = 3; x <= maxX; x += step) {
                                var val = 1.25506 * x / Math.log(x);
                                if (!started) { ctx.moveTo(toSx(x), toSy(val)); started = true; }
                                else ctx.lineTo(toSx(x), toSy(val));
                            }
                            ctx.stroke();
                            ctx.setLineDash([]);

                            // Lower bound: c1 * x/ln(x) with c1 = 0.693
                            ctx.strokeStyle = viz.colors.orange + '88';
                            ctx.lineWidth = 1.5;
                            ctx.setLineDash([4, 4]);
                            ctx.beginPath();
                            started = false;
                            for (var x2 = 3; x2 <= maxX; x2 += step) {
                                var val2 = 0.693 * x2 / Math.log(x2);
                                if (!started) { ctx.moveTo(toSx(x2), toSy(val2)); started = true; }
                                else ctx.lineTo(toSx(x2), toSy(val2));
                            }
                            ctx.stroke();
                            ctx.setLineDash([]);

                            // PNT: x/ln(x)
                            ctx.strokeStyle = viz.colors.green;
                            ctx.lineWidth = 1.5;
                            ctx.beginPath();
                            started = false;
                            for (var x3 = 3; x3 <= maxX; x3 += step) {
                                var val3 = x3 / Math.log(x3);
                                if (!started) { ctx.moveTo(toSx(x3), toSy(val3)); started = true; }
                                else ctx.lineTo(toSx(x3), toSy(val3));
                            }
                            ctx.stroke();

                            // pi(x) step function
                            ctx.strokeStyle = viz.colors.blue;
                            ctx.lineWidth = 2;
                            ctx.beginPath();
                            var pidx = 0;
                            ctx.moveTo(toSx(2), toSy(0));
                            for (var i = 0; i < primes.length && primes[i] <= maxX; i++) {
                                pidx = i + 1;
                                ctx.lineTo(toSx(primes[i]), toSy(pidx - 1));
                                ctx.lineTo(toSx(primes[i]), toSy(pidx));
                            }
                            ctx.lineTo(toSx(maxX), toSy(pidx));
                            ctx.stroke();

                            // Legend
                            var legY = baseY + 16;
                            ctx.font = '10px -apple-system,sans-serif';
                            ctx.textAlign = 'left';
                            ctx.fillStyle = viz.colors.blue;
                            ctx.fillRect(60, legY - 4, 10, 10);
                            ctx.fillText('\u03C0(x)', 74, legY + 4);
                            ctx.fillStyle = viz.colors.green;
                            ctx.fillRect(140, legY - 4, 10, 10);
                            ctx.fillText('x/ln x', 154, legY + 4);
                            ctx.fillStyle = viz.colors.red + '88';
                            ctx.fillRect(220, legY - 4, 10, 10);
                            ctx.fillText('upper', 234, legY + 4);
                            ctx.fillStyle = viz.colors.orange + '88';
                            ctx.fillRect(290, legY - 4, 10, 10);
                            ctx.fillText('lower', 304, legY + 4);
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Show that \\(\\binom{2n}{n} \\geq \\frac{4^n}{2n+1}\\) using the binomial theorem.',
                    hint: 'Expand \\((1+1)^{2n} = \\sum_{k=0}^{2n} \\binom{2n}{k} = 4^n\\). The central term \\(\\binom{2n}{n}\\) is the largest of the \\(2n+1\\) terms.',
                    solution: 'Since \\(\\binom{2n}{n} \\geq \\binom{2n}{k}\\) for all \\(k\\), and \\(\\sum_{k=0}^{2n} \\binom{2n}{k} = 4^n\\), we get \\((2n+1) \\binom{2n}{n} \\geq 4^n\\), hence \\(\\binom{2n}{n} \\geq 4^n/(2n+1)\\).'
                },
                {
                    question: 'Use Chebyshev\'s upper bound \\(\\theta(x) < 2x \\ln 2\\) to show \\(\\pi(x) < \\frac{2 \\ln 2 \\cdot x}{\\ln x}\\) for \\(x \\geq 2\\).',
                    hint: 'Since each prime \\(p \\leq x\\) contributes \\(\\ln p \\geq \\ln 2\\) to \\(\\theta(x)\\), and the largest contribution is \\(\\ln x\\), try the relation \\(\\theta(x) = \\sum_{p \\leq x} \\ln p \\geq \\pi(x) \\ln 2\\). But for the upper bound on \\(\\pi\\), use \\(\\theta(x) \\geq \\sum_{\\sqrt{x} < p \\leq x} \\ln p \\geq (\\pi(x) - \\pi(\\sqrt{x})) \\frac{\\ln x}{2}\\).',
                    solution: 'For \\(p > \\sqrt{x}\\), we have \\(\\ln p > \\frac{1}{2}\\ln x\\). So \\(\\theta(x) \\geq \\sum_{\\sqrt{x}<p\\leq x} \\ln p > (\\pi(x) - \\pi(\\sqrt{x}))\\frac{\\ln x}{2}\\). Since \\(\\pi(\\sqrt{x}) \\leq \\sqrt{x}\\) and using \\(\\theta(x) < 2x\\ln 2\\): \\(\\pi(x) < \\frac{2\\theta(x)}{\\ln x} + \\sqrt{x} < \\frac{4x\\ln 2}{\\ln x} + \\sqrt{x} < \\frac{(4\\ln 2 + \\epsilon) x}{\\ln x}\\) for large \\(x\\). A tighter argument using \\(\\theta(x) \\leq \\pi(x) \\ln x\\) directly gives \\(\\pi(x) \\geq \\theta(x)/\\ln x > c_1 x / \\ln x\\), and the upper bound follows similarly.'
                }
            ]
        },

        // ================================================================
        // SECTION 4: Perron's Formula Applied
        // ================================================================
        {
            id: 'sec-perron-applied',
            title: "Perron's Formula Applied",
            content: `
<h2>Expressing \\(\\psi(x)\\) as a Contour Integral</h2>

<p>The bridge between the analytic properties of \\(\\zeta(s)\\) and the arithmetic function \\(\\psi(x)\\) is <strong>Perron's formula</strong>, which converts a Dirichlet series partial sum into a contour integral.</p>

<div class="env-block theorem">
    <div class="env-title">Theorem 7.3 (Perron's Formula)</div>
    <div class="env-body">
        <p>Let \\(F(s) = \\sum_{n=1}^{\\infty} a_n n^{-s}\\) be a Dirichlet series converging absolutely for \\(\\operatorname{Re}(s) > \\sigma_a\\), and let \\(A(x) = \\sum_{n \\leq x} a_n\\). Then for \\(c > \\sigma_a\\) and non-integer \\(x > 0\\),</p>
        \\[A(x) = \\frac{1}{2\\pi i} \\int_{c - i\\infty}^{c + i\\infty} F(s) \\frac{x^s}{s}\\, ds.\\]
    </div>
</div>

<p>The key idea: the integral \\(\\frac{1}{2\\pi i}\\int_{c-i\\infty}^{c+i\\infty} y^s \\frac{ds}{s}\\) equals 1 if \\(y > 1\\), 0 if \\(0 < y < 1\\), and \\(1/2\\) if \\(y = 1\\). This acts as a "switch" that picks out terms with \\(n \\leq x\\).</p>

<h3>Application to \\(\\psi(x)\\)</h3>

<p>Taking \\(F(s) = -\\zeta'(s)/\\zeta(s)\\) and \\(a_n = \\Lambda(n)\\), Perron's formula gives:</p>

<div class="env-block theorem">
    <div class="env-title">Corollary (Perron for \\(\\psi\\))</div>
    <div class="env-body">
        <p>For \\(c > 1\\) and non-integer \\(x > 0\\),</p>
        \\[\\psi(x) = \\frac{1}{2\\pi i} \\int_{c - i\\infty}^{c + i\\infty} \\left(-\\frac{\\zeta'(s)}{\\zeta(s)}\\right) \\frac{x^s}{s}\\, ds.\\]
    </div>
</div>

<p>In practice, we truncate the integral at height \\(T\\): integrate from \\(c - iT\\) to \\(c + iT\\), with an error term that depends on the growth of \\(\\zeta'/\\zeta\\) along the horizontal segments.</p>

<h3>The Truncated Perron Formula</h3>

<div class="env-block theorem">
    <div class="env-title">Theorem 7.4 (Truncated Perron)</div>
    <div class="env-body">
        <p>For \\(c > 1\\), \\(x \\geq 2\\), \\(T \\geq 2\\),</p>
        \\[\\psi(x) = \\frac{1}{2\\pi i} \\int_{c - iT}^{c + iT} \\left(-\\frac{\\zeta'(s)}{\\zeta(s)}\\right) \\frac{x^s}{s}\\, ds + O\\!\\left(\\frac{x \\ln^2 x}{T}\\right).\\]
    </div>
</div>

<p>The error \\(O(x \\ln^2 x / T)\\) comes from estimating the tail of the integral for \\(|\\operatorname{Im}(s)| > T\\). By choosing \\(T\\) large enough (but not too large), we can make this error small relative to \\(x\\).</p>

<h3>What Remains</h3>

<p>We now have \\(\\psi(x)\\) expressed as a contour integral of \\(-\\zeta'/\\zeta \\cdot x^s/s\\) along the vertical line \\(\\operatorname{Re}(s) = c > 1\\). The next step: shift this contour leftward past \\(\\operatorname{Re}(s) = 1\\), using the residue theorem to pick up the pole at \\(s = 1\\).</p>

<div class="viz-placeholder" data-viz="viz-contour-shift"></div>
`,
            visualizations: [
                {
                    id: 'viz-contour-shift',
                    title: 'Contour Shift Animation',
                    description: 'Watch the Perron contour shift leftward past Re(s) = 1, picking up the residue at s = 1. The pole at s = 1 contributes the main term x; the shifted contour contributes the error.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 400,
                            originX: 280, originY: 200, scale: 100
                        });

                        var t = 0;
                        var playing = true;

                        VizEngine.createButton(controls, 'Play/Pause', function() {
                            playing = !playing;
                        });
                        VizEngine.createButton(controls, 'Reset', function() {
                            t = 0;
                        });

                        function draw(time) {
                            viz.clear();
                            var ctx = viz.ctx;

                            if (playing) t = (time / 3000) % 3;

                            // Progress of shift: 0->1 is before shift, 1->2 during shift, 2->3 after
                            var c = 1.5; // initial contour
                            var cTarget = 0.5; // target after shift
                            var cCurrent;
                            var showResidue = false;
                            var showPole = true;

                            if (t < 1) {
                                cCurrent = c;
                            } else if (t < 2) {
                                var frac = t - 1;
                                cCurrent = c - (c - cTarget) * frac;
                                if (cCurrent < 1.0) showResidue = true;
                            } else {
                                cCurrent = cTarget;
                                showResidue = true;
                            }

                            // Background: shade the critical strip lightly
                            var x0 = viz.originX + 0 * viz.scale;
                            var x1 = viz.originX + 1 * viz.scale;
                            ctx.fillStyle = '#1a1a4022';
                            ctx.fillRect(x0, 0, x1 - x0, viz.height);

                            // Draw axes
                            ctx.strokeStyle = viz.colors.axis;
                            ctx.lineWidth = 1;
                            ctx.beginPath();
                            ctx.moveTo(0, viz.originY);
                            ctx.lineTo(viz.width, viz.originY);
                            ctx.stroke();
                            ctx.beginPath();
                            ctx.moveTo(viz.originX, 0);
                            ctx.lineTo(viz.originX, viz.height);
                            ctx.stroke();

                            // Labels
                            viz.screenText('Re', viz.width - 15, viz.originY - 12, viz.colors.text, 11);
                            viz.screenText('Im', viz.originX + 14, 12, viz.colors.text, 11);

                            // Re(s) = 1 line
                            var xLine1 = viz.originX + 1 * viz.scale;
                            ctx.strokeStyle = viz.colors.yellow + '66';
                            ctx.lineWidth = 1;
                            ctx.setLineDash([4, 4]);
                            ctx.beginPath();
                            ctx.moveTo(xLine1, 0);
                            ctx.lineTo(xLine1, viz.height);
                            ctx.stroke();
                            ctx.setLineDash([]);
                            viz.screenText('Re = 1', xLine1, viz.height - 12, viz.colors.yellow, 10);

                            // Pole at s = 1
                            if (showPole) {
                                var poleX = viz.originX + 1 * viz.scale;
                                var poleY = viz.originY;
                                ctx.strokeStyle = viz.colors.red;
                                ctx.lineWidth = 2;
                                var pr = 8;
                                ctx.beginPath();
                                ctx.moveTo(poleX - pr, poleY - pr);
                                ctx.lineTo(poleX + pr, poleY + pr);
                                ctx.stroke();
                                ctx.beginPath();
                                ctx.moveTo(poleX + pr, poleY - pr);
                                ctx.lineTo(poleX - pr, poleY + pr);
                                ctx.stroke();
                                viz.screenText('s = 1', poleX + 14, poleY - 12, viz.colors.red, 11);
                            }

                            // Draw current contour (vertical line at Re = cCurrent)
                            var contourX = viz.originX + cCurrent * viz.scale;
                            var T = 1.5;
                            var topY = viz.originY - T * viz.scale;
                            var botY = viz.originY + T * viz.scale;

                            ctx.strokeStyle = viz.colors.blue;
                            ctx.lineWidth = 3;
                            ctx.beginPath();
                            ctx.moveTo(contourX, topY);
                            ctx.lineTo(contourX, botY);
                            ctx.stroke();

                            // Arrows on contour
                            ctx.fillStyle = viz.colors.blue;
                            ctx.beginPath();
                            ctx.moveTo(contourX, viz.originY - 20);
                            ctx.lineTo(contourX - 6, viz.originY - 10);
                            ctx.lineTo(contourX + 6, viz.originY - 10);
                            ctx.closePath();
                            ctx.fill();

                            // Draw horizontal segments if shifting
                            if (t >= 1 && cCurrent < c) {
                                ctx.strokeStyle = viz.colors.teal;
                                ctx.lineWidth = 2;
                                // Top segment
                                ctx.beginPath();
                                ctx.moveTo(viz.originX + c * viz.scale, topY);
                                ctx.lineTo(contourX, topY);
                                ctx.stroke();
                                // Bottom segment
                                ctx.beginPath();
                                ctx.moveTo(contourX, botY);
                                ctx.lineTo(viz.originX + c * viz.scale, botY);
                                ctx.stroke();
                            }

                            // Residue contribution
                            if (showResidue) {
                                ctx.fillStyle = viz.colors.green + '44';
                                ctx.beginPath();
                                ctx.arc(viz.originX + 1 * viz.scale, viz.originY, 15, 0, Math.PI * 2);
                                ctx.fill();
                                ctx.strokeStyle = viz.colors.green;
                                ctx.lineWidth = 2;
                                ctx.beginPath();
                                ctx.arc(viz.originX + 1 * viz.scale, viz.originY, 15, 0, Math.PI * 2);
                                ctx.stroke();
                                viz.screenText('Res = x', viz.originX + 1 * viz.scale, viz.originY + 28, viz.colors.green, 12);
                            }

                            // Status text
                            var statusText;
                            if (t < 1) statusText = 'Contour at Re(s) = ' + c.toFixed(1) + ' (right of all poles)';
                            else if (t < 2) statusText = 'Shifting contour left... Re(s) = ' + cCurrent.toFixed(2);
                            else statusText = 'Residue at s = 1 gives main term x';
                            viz.screenText(statusText, viz.width / 2, viz.height - 20, viz.colors.white, 12);

                            // Label
                            viz.screenText('Re(s) = ' + cCurrent.toFixed(2), contourX, topY - 12, viz.colors.blue, 10);
                        }

                        viz.animate(draw);
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Verify the Perron kernel: show that for \\(c > 0\\), \\(\\frac{1}{2\\pi i}\\int_{c-i\\infty}^{c+i\\infty} \\frac{y^s}{s}\\,ds = 1\\) if \\(y > 1\\) and \\(= 0\\) if \\(0 < y < 1\\).',
                    hint: 'For \\(y > 1\\), close the contour to the left (large semicircle in Re(s) < 0). The integrand has a simple pole at \\(s = 0\\) with residue \\(y^0 = 1\\). For \\(y < 1\\), close to the right where there are no poles.',
                    solution: 'For \\(y > 1\\): close left with a large semicircle of radius \\(R\\). On the semicircle, \\(|y^s/s| = y^{\\operatorname{Re}(s)}/|s| \\to 0\\) since \\(\\operatorname{Re}(s) \\to -\\infty\\) and \\(y > 1\\). By the residue theorem, the integral equals \\(\\operatorname{Res}_{s=0}(y^s/s) = 1\\). For \\(y < 1\\): close right; \\(y^{\\operatorname{Re}(s)} \\to 0\\) as \\(\\operatorname{Re}(s) \\to +\\infty\\), and there are no poles to the right of the contour, so the integral is 0.'
                },
                {
                    question: 'Why does the truncation error in Theorem 7.4 have the form \\(O(x \\ln^2 x / T)\\)?',
                    hint: 'The tail integral for \\(|\\operatorname{Im}(s)| > T\\) involves estimating \\(|\\zeta\'(s)/\\zeta(s)|\\) for large imaginary part. Use the bound \\(\\zeta\'/\\zeta(s) = O(\\ln^2 t)\\) for \\(\\sigma \\geq 1+1/\\ln t\\).',
                    solution: 'On the line \\(\\operatorname{Re}(s) = c = 1 + 1/\\ln x\\), the integrand is \\((-\\zeta\'/\\zeta)(s) \\cdot x^s/s\\). We have \\(|x^s| = x^c = ex\\) and \\(|1/s| = O(1/T)\\) for \\(|t| \\geq T\\). The bound \\(\\zeta\'/\\zeta = O(\\ln^2 t)\\) means the tail integral is \\(O(x \\int_T^{\\infty} \\ln^2 t / t^2 \\, dt) = O(x \\ln^2 T / T)\\). Choosing \\(T\\) appropriately and noting \\(\\ln T \\leq \\ln x\\) gives \\(O(x \\ln^2 x / T)\\).'
                }
            ]
        },

        // ================================================================
        // SECTION 5: The Contour Proof
        // ================================================================
        {
            id: 'sec-contour-proof',
            title: 'The Contour Proof',
            content: `
<h2>Shifting the Contour: The Heart of the Proof</h2>

<p>We now execute the central argument. Starting from the Perron integral for \\(\\psi(x)\\), we deform the contour to extract the main term.</p>

<h3>Setup</h3>

<p>We work with the truncated integral</p>
\\[I = \\frac{1}{2\\pi i} \\int_{c-iT}^{c+iT} \\left(-\\frac{\\zeta'(s)}{\\zeta(s)}\\right) \\frac{x^s}{s}\\, ds\\]
<p>where \\(c = 1 + 1/\\ln x\\) and \\(T\\) will be chosen later. The integrand \\(-\\frac{\\zeta'(s)}{\\zeta(s)} \\cdot \\frac{x^s}{s}\\) has:</p>
<ul>
    <li>A <strong>pole at \\(s = 1\\)</strong> from the simple pole of \\(\\zeta(s)\\), with residue \\(x^1/1 = x\\).</li>
    <li><strong>Poles at the zeros of \\(\\zeta(s)\\)</strong>, contributing to the explicit formula (Chapter 8).</li>
    <li>A pole at \\(s = 0\\) from the \\(1/s\\) factor.</li>
</ul>

<h3>The Rectangular Contour</h3>

<div class="env-block theorem">
    <div class="env-title">Theorem 7.5 (Main Estimate)</div>
    <div class="env-body">
        <p>Let \\(\\sigma_0 = 1 - c_0 / \\ln T\\) where \\(c_0\\) is the constant from the zero-free region (Chapter 6): \\(\\zeta(s) \\neq 0\\) for \\(\\sigma \\geq 1 - c_0/\\ln(|t|+2)\\). Then</p>
        \\[\\psi(x) = x + O\\!\\left(x \\exp\\left(-c_1 \\sqrt{\\ln x}\\right)\\right)\\]
        <p>for some absolute constant \\(c_1 > 0\\).</p>
    </div>
</div>

<div class="env-block proof">
    <div class="env-title">Proof Outline</div>
    <div class="env-body">
        <p><strong>Step 1: Shift the contour.</strong> Replace the vertical line \\(\\operatorname{Re}(s) = c\\) by a rectangular path with left edge at \\(\\operatorname{Re}(s) = \\sigma_0 = 1 - c_0/\\ln T\\). By the residue theorem:</p>
        \\[I = x + \\frac{1}{2\\pi i} \\oint_{\\text{shifted}} \\left(-\\frac{\\zeta'}{\\zeta}\\right) \\frac{x^s}{s}\\, ds\\]
        <p>where the \\(x\\) comes from the residue at \\(s = 1\\).</p>

        <p><strong>Step 2: Bound the shifted integral.</strong> On the three new segments:</p>
        <ul>
            <li><em>Horizontal segments</em> (\\(\\operatorname{Im}(s) = \\pm T\\), \\(\\sigma_0 \\leq \\sigma \\leq c\\)): Using \\(|\\zeta'/\\zeta| = O(\\ln^2 T)\\) and \\(|x^s/s| \\leq x^c / T\\), each contributes \\(O(x \\ln^3 T / T)\\).</li>
            <li><em>Left vertical segment</em> (\\(\\sigma = \\sigma_0\\), \\(-T \\leq t \\leq T\\)): Using the zero-free region, \\(|\\zeta'/\\zeta(\\sigma_0 + it)| = O(\\ln^2 T)\\) uniformly, and \\(|x^s| = x^{\\sigma_0}\\). This contributes \\(O(x^{\\sigma_0} \\ln^3 T)\\).</li>
        </ul>

        <p><strong>Step 3: Optimize \\(T\\).</strong> The error from the left edge is \\(O(x^{\\sigma_0} \\ln^3 T) = O(x \\cdot x^{-(c_0/\\ln T)} \\ln^3 T)\\). We want \\(x^{-c_0/\\ln T} = e^{-c_0 \\ln x / \\ln T}\\) to be small. Choosing \\(T = e^{\\sqrt{\\ln x}}\\) gives \\(\\ln T = \\sqrt{\\ln x}\\), and the error becomes</p>
        \\[O\\!\\left(x \\exp(-c_0 \\sqrt{\\ln x}) \\cdot (\\ln x)^{3/2}\\right) = O\\!\\left(x \\exp(-c_1 \\sqrt{\\ln x})\\right).\\]
    </div>
    <div class="qed">&marker;</div>
</div>

<h3>The Conclusion</h3>

<p>We have proved \\(\\psi(x) = x + O(x e^{-c_1\\sqrt{\\ln x}})\\), which is much stronger than \\(\\psi(x) \\sim x\\). The PNT follows:</p>

<div class="env-block theorem">
    <div class="env-title">Theorem 7.6 (Prime Number Theorem)</div>
    <div class="env-body">
        \\[\\pi(x) \\sim \\frac{x}{\\ln x} \\sim \\operatorname{Li}(x).\\]
    </div>
</div>

<p>The key input was the zero-free region from Chapter 6. A wider zero-free region would give a smaller error term. The Riemann Hypothesis (all nontrivial zeros on \\(\\operatorname{Re}(s) = 1/2\\)) would give \\(\\psi(x) = x + O(\\sqrt{x} \\ln^2 x)\\).</p>

<div class="viz-placeholder" data-viz="viz-three-approximations"></div>
`,
            visualizations: [
                {
                    id: 'viz-three-approximations',
                    title: 'Three Approximations to \\(\\pi(x)\\)',
                    description: 'Compare \\(\\pi(x)\\) with \\(x/\\ln x\\), \\(\\operatorname{Li}(x)\\), and \\(x/(\\ln x - 1)\\). Li(x) is remarkably accurate even for moderate \\(x\\).',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 400,
                            originX: 60, originY: 360, scale: 1
                        });

                        var maxX = 500;
                        VizEngine.createSlider(controls, 'x max', 50, 10000, maxX, 50, function(v) {
                            maxX = Math.round(v);
                            draw();
                        });

                        var primes = VizEngine.sievePrimes(15000);

                        function piFunc(x) {
                            var cnt = 0;
                            for (var i = 0; i < primes.length; i++) {
                                if (primes[i] > x) break;
                                cnt++;
                            }
                            return cnt;
                        }

                        function Li(x) {
                            // Numerical integration of 1/ln(t) from 2 to x
                            if (x <= 2) return 0;
                            var n = 500;
                            var sum = 0;
                            var dt = (x - 2) / n;
                            for (var i = 0; i < n; i++) {
                                var t = 2 + (i + 0.5) * dt;
                                sum += 1 / Math.log(t);
                            }
                            return sum * dt;
                        }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var W = viz.width - 80;
                            var H = 300;
                            var baseY = 350;
                            var piMax = piFunc(maxX);
                            var yMax = Math.max(piMax * 1.2, 10);

                            viz.screenText('Three Approximations to \u03C0(x)', viz.width / 2, 18, viz.colors.white, 14);

                            // Axes
                            ctx.strokeStyle = viz.colors.axis;
                            ctx.lineWidth = 1;
                            ctx.beginPath();
                            ctx.moveTo(60, baseY);
                            ctx.lineTo(viz.width - 20, baseY);
                            ctx.stroke();
                            ctx.beginPath();
                            ctx.moveTo(60, baseY);
                            ctx.lineTo(60, 30);
                            ctx.stroke();

                            function toSx(x) { return 60 + (x / maxX) * W; }
                            function toSy(y) { return baseY - (y / yMax) * H; }

                            var step = Math.max(1, Math.floor(maxX / 300));

                            // pi(x)
                            ctx.strokeStyle = viz.colors.blue;
                            ctx.lineWidth = 2.5;
                            ctx.beginPath();
                            var pidx = 0;
                            ctx.moveTo(toSx(2), toSy(0));
                            for (var i = 0; i < primes.length && primes[i] <= maxX; i++) {
                                pidx = i + 1;
                                ctx.lineTo(toSx(primes[i]), toSy(pidx - 1));
                                ctx.lineTo(toSx(primes[i]), toSy(pidx));
                            }
                            ctx.lineTo(toSx(maxX), toSy(pidx));
                            ctx.stroke();

                            // x/ln(x)
                            ctx.strokeStyle = viz.colors.orange;
                            ctx.lineWidth = 1.5;
                            ctx.beginPath();
                            var started = false;
                            for (var x = 3; x <= maxX; x += step) {
                                var val = x / Math.log(x);
                                if (!started) { ctx.moveTo(toSx(x), toSy(val)); started = true; }
                                else ctx.lineTo(toSx(x), toSy(val));
                            }
                            ctx.stroke();

                            // Li(x)
                            ctx.strokeStyle = viz.colors.green;
                            ctx.lineWidth = 1.5;
                            ctx.beginPath();
                            started = false;
                            for (var x2 = 3; x2 <= maxX; x2 += step) {
                                var val2 = Li(x2);
                                if (!started) { ctx.moveTo(toSx(x2), toSy(val2)); started = true; }
                                else ctx.lineTo(toSx(x2), toSy(val2));
                            }
                            ctx.stroke();

                            // x/(ln(x) - 1)
                            ctx.strokeStyle = viz.colors.purple;
                            ctx.lineWidth = 1.5;
                            ctx.setLineDash([4, 3]);
                            ctx.beginPath();
                            started = false;
                            for (var x3 = 4; x3 <= maxX; x3 += step) {
                                var lnx = Math.log(x3);
                                if (lnx <= 1.01) continue;
                                var val3 = x3 / (lnx - 1);
                                if (!started) { ctx.moveTo(toSx(x3), toSy(val3)); started = true; }
                                else ctx.lineTo(toSx(x3), toSy(val3));
                            }
                            ctx.stroke();
                            ctx.setLineDash([]);

                            // Legend
                            var legY = baseY + 14;
                            ctx.font = '10px -apple-system,sans-serif';
                            ctx.textAlign = 'left';
                            var items = [
                                [viz.colors.blue, '\u03C0(x)'],
                                [viz.colors.orange, 'x/ln x'],
                                [viz.colors.green, 'Li(x)'],
                                [viz.colors.purple, 'x/(ln x - 1)']
                            ];
                            for (var j = 0; j < items.length; j++) {
                                var lx = 60 + j * 120;
                                ctx.fillStyle = items[j][0];
                                ctx.fillRect(lx, legY - 4, 10, 10);
                                ctx.fillText(items[j][1], lx + 14, legY + 4);
                            }

                            // Show numerical comparison at endpoint
                            var piEnd = piFunc(maxX);
                            var xlnx = maxX > 2 ? (maxX / Math.log(maxX)).toFixed(1) : '?';
                            var liEnd = Li(maxX).toFixed(1);
                            viz.screenText('\u03C0(' + maxX + ')=' + piEnd + '  x/ln x=' + xlnx + '  Li(x)=' + liEnd, viz.width / 2, legY + 22, viz.colors.white, 11);
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Show that the residue of \\(-\\frac{\\zeta\'(s)}{\\zeta(s)} \\cdot \\frac{x^s}{s}\\) at \\(s=1\\) is \\(x\\).',
                    hint: 'Near \\(s = 1\\), \\(\\zeta(s)\\) has a simple pole with residue 1, so \\(\\zeta(s) = \\frac{1}{s-1} + \\gamma + O(s-1)\\). Compute \\(\\zeta\'/\\zeta\\) near \\(s = 1\\).',
                    solution: 'Near \\(s = 1\\): \\(\\zeta(s) = (s-1)^{-1} + \\gamma + \\cdots\\), so \\(\\zeta\'(s) = -(s-1)^{-2} + \\cdots\\), and \\(-\\zeta\'/\\zeta(s) = (s-1)^{-1}(1 + O(s-1))/(1 + \\gamma(s-1) + \\cdots) = (s-1)^{-1} + O(1)\\). Therefore \\(-\\frac{\\zeta\'(s)}{\\zeta(s)} \\cdot \\frac{x^s}{s} = \\frac{x^s}{s(s-1)} + O(x^s/s)\\). The residue at \\(s = 1\\) is \\(\\lim_{s \\to 1} (s-1) \\cdot \\frac{x^s}{s(s-1)} = x^1/1 = x\\).'
                },
                {
                    question: 'Why does \\(T = e^{\\sqrt{\\ln x}}\\) optimize the error in the PNT proof?',
                    hint: 'The error has two competing parts: the truncation error \\(O(x \\ln^2 x / T)\\) (wants \\(T\\) large) and the left-edge error \\(O(x e^{-c \\ln x / \\ln T})\\) (wants \\(\\ln T \\approx \\sqrt{\\ln x}\\)).',
                    solution: 'Truncation error: \\(O(x \\ln^2 x / T)\\). With \\(T = e^{\\sqrt{\\ln x}}\\), this is \\(O(x (\\ln x)^2 e^{-\\sqrt{\\ln x}})\\), which is \\(o(x)\\). Left-edge error: \\(O(x e^{-c_0 \\ln x / \\ln T} \\cdot (\\ln T)^3) = O(x e^{-c_0 \\sqrt{\\ln x}} \\cdot (\\ln x)^{3/2})\\). Both are \\(O(x e^{-c_1 \\sqrt{\\ln x}})\\). Choosing \\(\\ln T\\) much smaller or larger would make one term dominate; \\(\\ln T = \\sqrt{\\ln x}\\) balances them.'
                }
            ]
        },

        // ================================================================
        // SECTION 6: The Error Term
        // ================================================================
        {
            id: 'sec-error-term',
            title: 'The Error Term',
            content: `
<h2>How Good Is the Approximation?</h2>

<p>The PNT says \\(\\psi(x) \\sim x\\), but how fast does the ratio converge? The error term in the PNT is one of the deepest questions in number theory, intimately connected to the Riemann Hypothesis.</p>

<h3>What We Proved</h3>

<p>The classical proof gives:</p>
\\[\\psi(x) = x + O\\!\\left(x \\exp(-c\\sqrt{\\ln x})\\right).\\]
<p>Equivalently, \\(\\pi(x) = \\operatorname{Li}(x) + O(x \\exp(-c\\sqrt{\\ln x}))\\).</p>

<p>This error term decreases slowly, slower than any power of \\(x\\). For example, at \\(x = 10^{10}\\), \\(\\sqrt{\\ln x} \\approx 4.8\\), so the relative error is roughly \\(e^{-4.8c}\\).</p>

<h3>Improvements</h3>

<div class="env-block theorem">
    <div class="env-title">Theorem 7.7 (Improved Error Terms)</div>
    <div class="env-body">
        <p>Using wider zero-free regions:</p>
        <ul>
            <li><strong>Korobov-Vinogradov (1958)</strong>: \\(\\psi(x) = x + O(x \\exp(-c(\\ln x)^{3/5}(\\ln \\ln x)^{-1/5}))\\).</li>
            <li><strong>Under RH</strong>: \\(\\psi(x) = x + O(\\sqrt{x}\\ln^2 x)\\).</li>
        </ul>
    </div>
</div>

<p>The gap between the unconditional error \\(O(x \\exp(-c(\\ln x)^{3/5-\\epsilon}))\\) and the conditional error \\(O(\\sqrt{x}\\ln^2 x)\\) is enormous. Closing this gap is essentially equivalent to making progress on RH.</p>

<h3>The Connection to Zeros</h3>

<p>The explicit formula (Chapter 8) makes the connection precise:</p>
\\[\\psi(x) = x - \\sum_{\\rho} \\frac{x^{\\rho}}{\\rho} + \\text{lower order terms}\\]
<p>where the sum runs over nontrivial zeros \\(\\rho = \\beta + i\\gamma\\) of \\(\\zeta(s)\\). Each zero contributes a term of size \\(\\sim x^{\\beta}/|\\rho|\\). If all zeros have \\(\\beta = 1/2\\) (RH), each contributes \\(O(\\sqrt{x}/|\\gamma|)\\), and the sum converges nicely. But if a zero has \\(\\beta\\) close to 1, its contribution \\(x^{\\beta}\\) is nearly as large as the main term.</p>

<h3>Lower Bounds on the Error</h3>

<div class="env-block theorem">
    <div class="env-title">Theorem 7.8 (Littlewood, 1914)</div>
    <div class="env-body">
        <p>The error term in PNT cannot be too small:</p>
        \\[\\pi(x) - \\operatorname{Li}(x) = \\Omega_{\\pm}\\!\\left(\\frac{\\sqrt{x}\\ln\\ln\\ln x}{\\ln x}\\right).\\]
        <p>That is, \\(\\pi(x) - \\operatorname{Li}(x)\\) changes sign infinitely often and is sometimes as large as \\(\\sqrt{x}\\ln\\ln\\ln x / \\ln x\\) in both positive and negative directions.</p>
    </div>
</div>

<p>Littlewood's theorem shows that \\(\\operatorname{Li}(x)\\) is <em>not</em> always an overestimate of \\(\\pi(x)\\). Although \\(\\operatorname{Li}(x) > \\pi(x)\\) for all computed values up to enormous bounds, it must eventually fail, and does so infinitely often. The first crossover point (Skewes' number) was originally estimated around \\(10^{10^{10^{34}}}\\), later reduced to approximately \\(1.4 \\times 10^{316}\\).</p>

<div class="viz-placeholder" data-viz="viz-error-shrinking"></div>
`,
            visualizations: [
                {
                    id: 'viz-error-shrinking',
                    title: 'The PNT Error: \\(\\pi(x) - \\operatorname{Li}(x)\\)',
                    description: 'Plot the difference \\(\\pi(x) - \\operatorname{Li}(x)\\). Despite being negative for all small \\(x\\) (Li overestimates), Littlewood proved it changes sign infinitely often.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 380,
                            originX: 60, originY: 200, scale: 1
                        });

                        var maxX = 1000;
                        VizEngine.createSlider(controls, 'x max', 100, 10000, maxX, 100, function(v) {
                            maxX = Math.round(v);
                            draw();
                        });

                        var primes = VizEngine.sievePrimes(15000);

                        function piFunc(x) {
                            var cnt = 0;
                            for (var i = 0; i < primes.length; i++) {
                                if (primes[i] > x) break;
                                cnt++;
                            }
                            return cnt;
                        }

                        function Li(x) {
                            if (x <= 2) return 0;
                            var n = 500;
                            var sum = 0;
                            var dt = (x - 2) / n;
                            for (var i = 0; i < n; i++) {
                                var t = 2 + (i + 0.5) * dt;
                                sum += 1 / Math.log(t);
                            }
                            return sum * dt;
                        }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var W = viz.width - 80;
                            var H = 300;
                            var baseY = 200;

                            viz.screenText('\u03C0(x) - Li(x)', viz.width / 2, 18, viz.colors.white, 14);

                            // Compute differences to find range
                            var step = Math.max(1, Math.floor(maxX / 400));
                            var diffs = [];
                            var dMin = Infinity, dMax = -Infinity;
                            for (var x = 3; x <= maxX; x += step) {
                                var d = piFunc(x) - Li(x);
                                diffs.push({ x: x, d: d });
                                if (d < dMin) dMin = d;
                                if (d > dMax) dMax = d;
                            }
                            var range = Math.max(Math.abs(dMin), Math.abs(dMax), 5);

                            function toSx(x) { return 60 + (x / maxX) * W; }
                            function toSy(d) { return baseY - (d / range) * (H / 2 - 20); }

                            // Axes
                            ctx.strokeStyle = viz.colors.axis;
                            ctx.lineWidth = 1;
                            ctx.beginPath();
                            ctx.moveTo(60, baseY);
                            ctx.lineTo(viz.width - 20, baseY);
                            ctx.stroke();
                            ctx.beginPath();
                            ctx.moveTo(60, 30);
                            ctx.lineTo(60, viz.height - 30);
                            ctx.stroke();

                            // Zero line
                            viz.screenText('0', 50, baseY, viz.colors.text, 10, 'right');

                            // Y range labels
                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '10px -apple-system,sans-serif';
                            ctx.textAlign = 'right';
                            ctx.textBaseline = 'middle';
                            var yStep = Math.pow(10, Math.floor(Math.log10(range)));
                            if (range / yStep < 3) yStep /= 2;
                            for (var yv = -range; yv <= range; yv += yStep) {
                                if (Math.abs(yv) < yStep * 0.1) continue;
                                var sy = toSy(yv);
                                if (sy < 35 || sy > viz.height - 35) continue;
                                ctx.fillText(Math.round(yv).toString(), 55, sy);
                                ctx.strokeStyle = viz.colors.grid;
                                ctx.lineWidth = 0.5;
                                ctx.beginPath();
                                ctx.moveTo(60, sy);
                                ctx.lineTo(viz.width - 20, sy);
                                ctx.stroke();
                            }

                            // Plot the difference
                            ctx.strokeStyle = viz.colors.teal;
                            ctx.lineWidth = 2;
                            ctx.beginPath();
                            for (var i = 0; i < diffs.length; i++) {
                                var sx = toSx(diffs[i].x);
                                var sy2 = toSy(diffs[i].d);
                                if (i === 0) ctx.moveTo(sx, sy2);
                                else ctx.lineTo(sx, sy2);
                            }
                            ctx.stroke();

                            // Shade negative region
                            ctx.fillStyle = viz.colors.red + '15';
                            ctx.beginPath();
                            ctx.moveTo(toSx(diffs[0].x), baseY);
                            for (var j = 0; j < diffs.length; j++) {
                                ctx.lineTo(toSx(diffs[j].x), toSy(Math.min(diffs[j].d, 0)));
                            }
                            ctx.lineTo(toSx(diffs[diffs.length - 1].x), baseY);
                            ctx.closePath();
                            ctx.fill();

                            // X labels
                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '10px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'top';
                            var xStep2 = Math.pow(10, Math.floor(Math.log10(maxX / 5)));
                            if (maxX / xStep2 > 10) xStep2 *= 2;
                            for (var xv = xStep2; xv <= maxX; xv += xStep2) {
                                ctx.fillText(xv.toString(), toSx(xv), viz.height - 25);
                            }

                            viz.screenText('Li(x) overestimates \u03C0(x) for small x (but not forever)', viz.width / 2, viz.height - 8, viz.colors.text, 10);
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Show that under RH, \\(\\pi(x) = \\operatorname{Li}(x) + O(\\sqrt{x} \\ln x)\\).',
                    hint: 'If RH holds, \\(\\psi(x) = x + O(\\sqrt{x} \\ln^2 x)\\). Use Abel summation to convert from \\(\\psi\\) to \\(\\pi\\).',
                    solution: 'Under RH, \\(\\psi(x) = x + O(\\sqrt{x}\\ln^2 x)\\). By partial summation, \\(\\pi(x) = \\psi(x)/\\ln x + \\int_2^x \\psi(t)/(t \\ln^2 t)\\,dt\\). Substituting \\(\\psi(t) = t + O(\\sqrt{t}\\ln^2 t)\\): the main term gives \\(\\operatorname{Li}(x)\\), and the error is \\(O(\\sqrt{x}/\\ln x) + O(\\int_2^x \\sqrt{t} \\ln^2 t / (t \\ln^2 t)\\,dt) = O(\\sqrt{x}/\\ln x) + O(\\sqrt{x}) = O(\\sqrt{x}\\ln x)\\).'
                },
                {
                    question: 'The error \\(O(x \\exp(-c\\sqrt{\\ln x}))\\) goes to zero relative to \\(x\\). For what value of \\(x\\) does the relative error first drop below 1%? (Take \\(c = 0.5\\).)',
                    hint: 'Solve \\(e^{-0.5\\sqrt{\\ln x}} < 0.01\\), i.e., \\(\\sqrt{\\ln x} > 2\\ln 100/1 = 9.21\\).',
                    solution: 'We need \\(e^{-0.5\\sqrt{\\ln x}} < 0.01\\), so \\(0.5\\sqrt{\\ln x} > \\ln 100 \\approx 4.605\\), giving \\(\\sqrt{\\ln x} > 9.21\\), so \\(\\ln x > 84.8\\), i.e., \\(x > e^{84.8} \\approx 7 \\times 10^{36}\\). The convergence is very slow! This is why the PNT error term, though theoretically going to zero, is hard to observe for moderate \\(x\\).'
                }
            ]
        },

        // ================================================================
        // SECTION 7: Bridge to What's Next
        // ================================================================
        {
            id: 'sec-bridge',
            title: 'Looking Forward',
            content: `
<h2>The PNT in Perspective</h2>

<p>The Prime Number Theorem is the crown jewel of Part C of this course. Let us reflect on what we have achieved and where the theory goes next.</p>

<h3>What We Used</h3>

<p>The proof combined every major tool from the preceding chapters:</p>
<ol>
    <li><strong>Arithmetic functions</strong> (Ch 1-2): the von Mangoldt function \\(\\Lambda(n)\\) and its summatory function \\(\\psi(x)\\).</li>
    <li><strong>Dirichlet series</strong> (Ch 3): the representation \\(-\\zeta'/\\zeta(s) = \\sum \\Lambda(n) n^{-s}\\).</li>
    <li><strong>Analytic continuation</strong> (Ch 4-5): extending \\(\\zeta(s)\\) and \\(\\zeta'/\\zeta(s)\\) to the left of \\(\\operatorname{Re}(s) = 1\\).</li>
    <li><strong>Zero-free region</strong> (Ch 6): the critical input \\(\\zeta(1+it) \\neq 0\\), and the quantitative bound \\(\\sigma > 1 - c/\\ln t\\).</li>
    <li><strong>Contour integration</strong>: Perron's formula and the residue theorem.</li>
</ol>

<h3>The Explicit Formula (Chapter 8 Preview)</h3>

<p>The contour argument we used discarded information about the zeros. In Chapter 8, we will track those contributions carefully, arriving at the <strong>explicit formula</strong>:</p>
\\[\\psi(x) = x - \\sum_{\\rho} \\frac{x^{\\rho}}{\\rho} - \\ln(2\\pi) - \\frac{1}{2}\\ln(1 - x^{-2})\\]
<p>where the sum is over all nontrivial zeros \\(\\rho\\) of \\(\\zeta(s)\\). Each zero creates an oscillation in \\(\\psi(x)\\); the PNT says these oscillations cancel in the limit.</p>

<h3>Beyond the Classical PNT</h3>

<div class="env-block remark">
    <div class="env-title">Extensions and Analogues</div>
    <div class="env-body">
        <ul>
            <li><strong>Primes in arithmetic progressions</strong> (Ch 9-10): \\(\\pi(x; q, a) \\sim x/(\\varphi(q) \\ln x)\\) for \\(\\gcd(a,q) = 1\\), using \\(L\\)-functions.</li>
            <li><strong>Siegel-Walfisz theorem</strong>: PNT in progressions uniform in \\(q \\leq (\\ln x)^A\\).</li>
            <li><strong>Bombieri-Vinogradov</strong> (Ch 13): PNT in progressions "on average" for \\(q\\) up to \\(\\sqrt{x}/(\\ln x)^B\\).</li>
            <li><strong>Short intervals</strong> (Ch 18): primes in \\([x, x + x^{\\theta}]\\) for \\(\\theta < 1\\).</li>
        </ul>
    </div>
</div>

<h3>A Historical Reflection</h3>

<p>The PNT took over a century from conjecture to proof. Gauss's numerical insight (1792) had to wait for Riemann's vision (1859) and then Hadamard and de la Vall\\'{e}e-Poussin's technical execution (1896). The proof unified discrete number theory with continuous complex analysis in a way that reshaped mathematics. As Hadamard wrote: "The shortest path between two truths in the real domain passes through the complex domain."</p>

<div class="viz-placeholder" data-viz="viz-pnt-history"></div>
`,
            visualizations: [
                {
                    id: 'viz-pnt-history',
                    title: 'PNT History Timeline',
                    description: 'Key milestones in the journey from conjecture to proof, and beyond.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 380,
                            originX: 0, originY: 0, scale: 1
                        });

                        var events = [
                            { year: 1792, label: 'Gauss conjectures', color: 'blue' },
                            { year: 1837, label: 'Dirichlet L-functions', color: 'teal' },
                            { year: 1850, label: 'Chebyshev bounds', color: 'orange' },
                            { year: 1859, label: 'Riemann memoir', color: 'purple' },
                            { year: 1896, label: 'PNT proved', color: 'green' },
                            { year: 1914, label: 'Littlewood \u03A9 result', color: 'yellow' },
                            { year: 1949, label: 'Elementary proof', color: 'red' },
                            { year: 1958, label: 'Korobov-Vinogradov', color: 'pink' }
                        ];

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            viz.screenText('Key Milestones of the PNT', viz.width / 2, 20, viz.colors.white, 15);

                            var lineY = 100;
                            var startX = 50;
                            var endX = viz.width - 30;
                            var yearMin = 1780;
                            var yearMax = 1970;

                            // Timeline line
                            ctx.strokeStyle = viz.colors.axis;
                            ctx.lineWidth = 2;
                            ctx.beginPath();
                            ctx.moveTo(startX, lineY);
                            ctx.lineTo(endX, lineY);
                            ctx.stroke();

                            // Decade marks
                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '9px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'top';
                            for (var yr = 1800; yr <= 1960; yr += 20) {
                                var sx = startX + (yr - yearMin) / (yearMax - yearMin) * (endX - startX);
                                ctx.strokeStyle = viz.colors.grid;
                                ctx.lineWidth = 0.5;
                                ctx.beginPath();
                                ctx.moveTo(sx, lineY - 4);
                                ctx.lineTo(sx, lineY + 4);
                                ctx.stroke();
                                ctx.fillStyle = viz.colors.text;
                                ctx.fillText(yr.toString(), sx, lineY + 8);
                            }

                            // Events
                            for (var i = 0; i < events.length; i++) {
                                var ev = events[i];
                                var ex = startX + (ev.year - yearMin) / (yearMax - yearMin) * (endX - startX);
                                var col = viz.colors[ev.color] || viz.colors.white;
                                var above = (i % 2 === 0);
                                var ey = above ? lineY - 30 - (i % 3) * 28 : lineY + 30 + (i % 3) * 28;

                                // Connecting line
                                ctx.strokeStyle = col + '88';
                                ctx.lineWidth = 1;
                                ctx.beginPath();
                                ctx.moveTo(ex, lineY);
                                ctx.lineTo(ex, ey);
                                ctx.stroke();

                                // Dot on timeline
                                ctx.fillStyle = col;
                                ctx.beginPath();
                                ctx.arc(ex, lineY, 5, 0, Math.PI * 2);
                                ctx.fill();

                                // Label
                                ctx.fillStyle = col;
                                ctx.font = 'bold 10px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.textBaseline = above ? 'bottom' : 'top';
                                ctx.fillText(ev.year.toString(), ex, ey + (above ? -2 : 2));
                                ctx.font = '9px -apple-system,sans-serif';
                                ctx.fillStyle = viz.colors.white;
                                ctx.fillText(ev.label, ex, ey + (above ? -14 : 14));
                            }

                            // Bottom summary cards
                            var cardY = 260;
                            var cards = [
                                { title: 'Conjecture', desc: '~100 years', color: viz.colors.blue },
                                { title: 'Framework', desc: 'Riemann 1859', color: viz.colors.purple },
                                { title: 'Proof', desc: 'Hadamard/VP 1896', color: viz.colors.green },
                                { title: 'Refinement', desc: 'Error terms', color: viz.colors.orange }
                            ];
                            var cardW = (viz.width - 80) / 4;
                            for (var j = 0; j < cards.length; j++) {
                                var cx = 40 + j * cardW + cardW / 2;
                                ctx.fillStyle = cards[j].color + '22';
                                ctx.fillRect(40 + j * cardW + 4, cardY, cardW - 8, 50);
                                ctx.strokeStyle = cards[j].color + '66';
                                ctx.lineWidth = 1;
                                ctx.strokeRect(40 + j * cardW + 4, cardY, cardW - 8, 50);
                                ctx.fillStyle = cards[j].color;
                                ctx.font = 'bold 11px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.textBaseline = 'top';
                                ctx.fillText(cards[j].title, cx, cardY + 8);
                                ctx.fillStyle = viz.colors.text;
                                ctx.font = '10px -apple-system,sans-serif';
                                ctx.fillText(cards[j].desc, cx, cardY + 26);
                            }

                            // Arrow between framework and proof
                            viz.screenText('The zero-free region was the missing piece', viz.width / 2, cardY + 65, viz.colors.teal, 11);
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'The PNT says \\(\\pi(x) \\sim x/\\ln x\\). Show that this implies the \\(n\\)-th prime \\(p_n\\) satisfies \\(p_n \\sim n \\ln n\\).',
                    hint: 'If \\(\\pi(x) \\sim x/\\ln x\\), set \\(x = p_n\\) so \\(\\pi(p_n) = n\\). Then \\(n \\sim p_n/\\ln p_n\\), i.e., \\(p_n \\sim n \\ln p_n\\). Now argue that \\(\\ln p_n \\sim \\ln n\\).',
                    solution: 'From \\(\\pi(p_n) = n\\) and \\(\\pi(x) \\sim x/\\ln x\\), we get \\(n \\sim p_n / \\ln p_n\\), so \\(p_n \\sim n \\ln p_n\\). Taking logs: \\(\\ln p_n \\sim \\ln n + \\ln\\ln p_n \\sim \\ln n\\) (since \\(\\ln\\ln p_n = o(\\ln n)\\)). Substituting back: \\(p_n \\sim n \\ln n\\).'
                },
                {
                    question: 'Show that \\(\\sum_{p \\leq x} 1/p = \\ln \\ln x + M + o(1)\\) for a constant \\(M\\) (Mertens\' theorem), assuming PNT.',
                    hint: 'Use Abel summation with \\(a_n = 1/n\\) if \\(n\\) is prime and the PNT estimate \\(\\pi(x) = \\operatorname{Li}(x) + o(x/\\ln x)\\).',
                    solution: 'By Abel summation, \\(\\sum_{p \\leq x} 1/p = \\pi(x)/x + \\int_2^x \\pi(t)/t^2\\, dt\\). The first term is \\(\\sim 1/\\ln x = o(1)\\). For the integral, \\(\\pi(t)/t^2 \\sim 1/(t \\ln t)\\), so \\(\\int_2^x dt/(t \\ln t) = \\ln \\ln x - \\ln \\ln 2\\). A careful treatment of the error gives \\(\\sum_{p \\leq x} 1/p = \\ln \\ln x + M + O(1/\\ln x)\\) where \\(M = \\gamma + \\sum_p (\\ln(1-1/p) + 1/p) \\approx 0.2615\\) is the Meissel-Mertens constant.'
                },
                {
                    question: 'Why was the "elementary" proof of Selberg and Erd\\H{o}s (1949) considered remarkable, and why is the analytic proof still preferred?',
                    hint: 'Think about what tools each proof uses and what generalizations each approach enables.',
                    solution: 'The elementary proof avoids complex analysis entirely, using only real-variable methods and clever combinatorial identities (Selberg\'s symmetry formula). This was remarkable because many believed complex analysis was essential. However, the analytic proof is preferred because: (1) it gives a quantitative error term \\(O(x e^{-c\\sqrt{\\ln x}})\\) naturally, while the elementary proof requires substantial additional work for any error term; (2) the analytic method generalizes directly to PNT in arithmetic progressions, number fields, and other settings via \\(L\\)-functions; (3) the key ideas (Perron + zero-free region) are clean and conceptually transparent.'
                }
            ]
        }
    ]
});
