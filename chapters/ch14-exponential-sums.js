window.CHAPTERS = window.CHAPTERS || [];
window.CHAPTERS.push({
    id: 'ch14',
    number: 14,
    title: 'Exponential Sums',
    subtitle: 'Measuring cancellation, measuring randomness',
    sections: [
        // ================================================================
        // SECTION 1: Motivation
        // ================================================================
        {
            id: 'sec-motivation',
            title: 'Why Exponential Sums?',
            content: `
<h2>Why Exponential Sums?</h2>

<div class="env-block intuition">
    <div class="env-title">The Central Question</div>
    <div class="env-body">
        <p>Consider the sum \\(\\displaystyle S = \\sum_{n=1}^{N} e^{2\\pi i f(n)}\\). Each term \\(e^{2\\pi i f(n)}\\) is a unit vector in the complex plane. If the "angles" \\(f(n)\\) are arranged systematically, the vectors might all point roughly the same direction and the sum could be as large as \\(N\\). But if the angles are spread out, the vectors cancel and \\(|S|\\) is much smaller. The art of exponential sums is making this cancellation precise.</p>
    </div>
</div>

<p>An <strong>exponential sum</strong> is a finite sum of the form</p>

\\[
S = \\sum_{n=1}^{N} e^{2\\pi i f(n)}
\\]

<p>where \\(f\\) is a real-valued function. The absolute value \\(|S|\\) measures how much cancellation occurs: the trivial bound is \\(|S| \\leq N\\) (triangle inequality), and any improvement over this "trivial" bound contains arithmetic or analytic information about \\(f\\).</p>

<div class="env-block definition">
    <div class="env-title">Definition (Exponential Sum)</div>
    <div class="env-body">
        <p>For a real-valued function \\(f : \\{1, 2, \\ldots, N\\} \\to \\mathbb{R}\\), the <strong>exponential sum</strong> associated to \\(f\\) is</p>
        \\[S_N(f) = \\sum_{n=1}^{N} e(f(n)), \\qquad \\text{where } e(x) := e^{2\\pi i x}.\\]
        <p>The notation \\(e(x)\\) is standard in analytic number theory and emphasizes that only the fractional part of \\(x\\) matters.</p>
    </div>
</div>

<p>Exponential sums appear everywhere in number theory:</p>
<ul>
    <li><strong>Distribution of primes:</strong> The explicit formula for \\(\\psi(x)\\) involves sums over zeros of \\(\\zeta(s)\\), which are exponential sums in disguise.</li>
    <li><strong>Diophantine equations:</strong> The number of solutions to \\(f(x_1, \\ldots, x_k) = 0 \\pmod{q}\\) can be expressed as an exponential sum (via orthogonality of characters).</li>
    <li><strong>Equidistribution:</strong> Weyl's criterion converts the question "is the sequence \\(\\{f(n)\\}\\) equidistributed mod 1?" into estimating exponential sums.</li>
    <li><strong>Sieve methods:</strong> The Selberg sieve and the large sieve both involve bounding bilinear forms of exponential sums.</li>
</ul>

<div class="env-block remark">
    <div class="env-title">The Geometry of Cancellation</div>
    <div class="env-body">
        <p>Think of \\(S_N(f)\\) as a random walk in the complex plane, where the \\(n\\)-th step has length 1 and direction \\(2\\pi f(n)\\). If the steps are "random," the walk travels about \\(\\sqrt{N}\\) from the origin (by the central limit theorem). If the steps are coherent (all pointing the same way), the distance is \\(N\\). The fundamental dichotomy of exponential sums is: <em>either the phases are structured enough that \\(|S_N|\\) is large, or there is enough cancellation that \\(|S_N| \\ll N^{1-\\delta}\\) for some \\(\\delta > 0\\).</em></p>
    </div>
</div>

<div class="env-block example">
    <div class="env-title">Example: Geometric Sum</div>
    <div class="env-body">
        <p>The simplest exponential sum is \\(f(n) = \\alpha n\\) for a fixed real \\(\\alpha\\). Then</p>
        \\[S_N(\\alpha) = \\sum_{n=1}^{N} e(\\alpha n) = e(\\alpha) \\cdot \\frac{e(N\\alpha) - 1}{e(\\alpha) - 1} = \\frac{\\sin(\\pi N \\alpha)}{\\sin(\\pi \\alpha)} \\cdot e\\!\\left(\\frac{(N+1)\\alpha}{2}\\right)\\]
        <p>when \\(\\alpha \\notin \\mathbb{Z}\\). The magnitude is \\(|S_N| = |\\sin(\\pi N\\alpha)/\\sin(\\pi \\alpha)|\\), which is \\(O(1/\\|\\alpha\\|)\\) where \\(\\|\\alpha\\| = \\min_{m \\in \\mathbb{Z}} |\\alpha - m|\\) is the distance to the nearest integer. This is \\(\\ll N\\) when \\(\\alpha\\) is irrational, confirming cancellation.</p>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-weyl-spiral"></div>
`,
            visualizations: [
                {
                    id: 'viz-weyl-spiral',
                    title: 'Exponential Sum Spiral',
                    description: 'Each unit vector e(alpha * n) is drawn head-to-tail in the complex plane, forming a spiral. Drag the slider to change alpha. Rational alpha produces closed patterns; irrational alpha produces spirals with strong cancellation.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 440,
                            originX: 280, originY: 220, scale: 8
                        });

                        var alpha = 0.0;
                        var N = 100;

                        VizEngine.createSlider(controls, 'alpha', 0, 1, alpha, 0.001, function(v) {
                            alpha = v;
                            draw();
                        });
                        VizEngine.createSlider(controls, 'N', 10, 500, N, 1, function(v) {
                            N = Math.round(v);
                            draw();
                        });

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            // Draw faint axes
                            ctx.strokeStyle = viz.colors.grid;
                            ctx.lineWidth = 0.5;
                            ctx.beginPath(); ctx.moveTo(0, viz.originY); ctx.lineTo(viz.width, viz.originY); ctx.stroke();
                            ctx.beginPath(); ctx.moveTo(viz.originX, 0); ctx.lineTo(viz.originX, viz.height); ctx.stroke();

                            // Cumulative sum path
                            var cx = 0, cy = 0;
                            ctx.beginPath();
                            var sx0 = viz.originX, sy0 = viz.originY;
                            ctx.moveTo(sx0, sy0);

                            for (var n = 1; n <= N; n++) {
                                var angle = 2 * Math.PI * alpha * n;
                                cx += Math.cos(angle);
                                cy += Math.sin(angle);
                                var sx = viz.originX + cx * viz.scale;
                                var sy = viz.originY - cy * viz.scale;
                                ctx.lineTo(sx, sy);
                            }

                            ctx.strokeStyle = viz.colors.blue;
                            ctx.lineWidth = 1.2;
                            ctx.stroke();

                            // Mark the endpoint
                            var endSx = viz.originX + cx * viz.scale;
                            var endSy = viz.originY - cy * viz.scale;
                            ctx.fillStyle = viz.colors.orange;
                            ctx.beginPath();
                            ctx.arc(endSx, endSy, 5, 0, Math.PI * 2);
                            ctx.fill();

                            // Draw line from origin to endpoint (the sum magnitude)
                            ctx.strokeStyle = viz.colors.orange;
                            ctx.lineWidth = 2;
                            ctx.setLineDash([4, 3]);
                            ctx.beginPath();
                            ctx.moveTo(viz.originX, viz.originY);
                            ctx.lineTo(endSx, endSy);
                            ctx.stroke();
                            ctx.setLineDash([]);

                            // Display info
                            var mag = Math.sqrt(cx * cx + cy * cy);
                            viz.screenText('alpha = ' + alpha.toFixed(3), viz.width / 2, 18, viz.colors.white, 14);
                            viz.screenText('|S_N| = ' + mag.toFixed(2) + '   (N = ' + N + ',  trivial bound = ' + N + ')', viz.width / 2, 38, viz.colors.teal, 12);

                            // Show sqrt(N) reference
                            viz.screenText('sqrt(N) = ' + Math.sqrt(N).toFixed(2), viz.width / 2, 56, viz.colors.text, 11);

                            // Rational approximation hint
                            if (alpha > 0.001 && alpha < 0.999) {
                                var bestP = 0, bestQ = 1, bestErr = Math.abs(alpha);
                                for (var q = 1; q <= 50; q++) {
                                    var p = Math.round(alpha * q);
                                    var err = Math.abs(alpha - p / q);
                                    if (err < bestErr) { bestP = p; bestQ = q; bestErr = err; }
                                }
                                if (bestErr < 0.005) {
                                    viz.screenText('Near ' + bestP + '/' + bestQ, viz.width / 2, viz.height - 15, viz.colors.purple, 11);
                                }
                            }
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Show that for \\(\\alpha \\in \\mathbb{Z}\\), we have \\(S_N(\\alpha) = N\\). What does the spiral look like in this case?',
                    hint: 'If \\(\\alpha\\) is an integer, each \\(e(\\alpha n) = 1\\).',
                    solution: 'When \\(\\alpha \\in \\mathbb{Z}\\), \\(e(\\alpha n) = e^{2\\pi i \\alpha n} = 1\\) for all \\(n\\), so \\(S_N = \\sum_{n=1}^N 1 = N\\). The "spiral" is a straight line along the positive real axis of length \\(N\\): no cancellation at all.'
                }
            ]
        },

        // ================================================================
        // SECTION 2: Weyl Sums and Equidistribution
        // ================================================================
        {
            id: 'sec-weyl',
            title: 'Weyl Sums and Equidistribution',
            content: `
<h2>Weyl Sums and Equidistribution</h2>

<div class="env-block intuition">
    <div class="env-title">From Sums to Distribution</div>
    <div class="env-body">
        <p>Hermann Weyl discovered a remarkable equivalence: the sequence \\(\\{\\alpha, 2\\alpha, 3\\alpha, \\ldots\\}\\) is equidistributed modulo 1 if and only if the exponential sums \\(\\sum_{n=1}^N e(h \\alpha n)\\) are \\(o(N)\\) for every nonzero integer \\(h\\). This converts a distributional question into an analytic one.</p>
    </div>
</div>

<div class="env-block definition">
    <div class="env-title">Definition (Equidistribution mod 1)</div>
    <div class="env-body">
        <p>A sequence \\((x_n)_{n \\geq 1}\\) of real numbers is <strong>equidistributed modulo 1</strong> if for every interval \\([a, b] \\subseteq [0, 1)\\),</p>
        \\[\\lim_{N \\to \\infty} \\frac{\\#\\{1 \\leq n \\leq N : \\{x_n\\} \\in [a, b]\\}}{N} = b - a,\\]
        <p>where \\(\\{x\\} = x - \\lfloor x \\rfloor\\) denotes the fractional part.</p>
    </div>
</div>

<div class="env-block theorem">
    <div class="env-title">Theorem 14.1 (Weyl's Criterion)</div>
    <div class="env-body">
        <p>A sequence \\((x_n)\\) is equidistributed mod 1 if and only if for every nonzero integer \\(h\\),</p>
        \\[\\lim_{N \\to \\infty} \\frac{1}{N} \\sum_{n=1}^{N} e(h x_n) = 0.\\]
    </div>
</div>

<div class="env-block proof">
    <div class="env-title">Proof Sketch</div>
    <div class="env-body">
        <p>The forward direction: if \\((x_n)\\) is equidistributed, the Weyl sums converge to \\(\\int_0^1 e(hx)\\,dx = 0\\) for \\(h \\neq 0\\).</p>
        <p>The converse uses a density argument. The exponentials \\(\\{e(hx) : h \\in \\mathbb{Z}\\}\\) are dense in the continuous functions on \\([0,1)\\) (by the Stone-Weierstrass theorem). If \\(\\frac{1}{N}\\sum e(h x_n) \\to \\int_0^1 e(hx)\\,dx\\) for all \\(h\\), then by approximation, \\(\\frac{1}{N}\\sum g(x_n) \\to \\int_0^1 g(x)\\,dx\\) for all continuous \\(g\\), and in particular for characteristic functions of intervals (after smoothing).</p>
    </div>
    <div class="qed">&marker;</div>
</div>

<div class="env-block corollary">
    <div class="env-title">Corollary (Weyl's Equidistribution Theorem)</div>
    <div class="env-body">
        <p>If \\(\\alpha\\) is irrational, the sequence \\((n\\alpha)_{n \\geq 1}\\) is equidistributed modulo 1.</p>
    </div>
</div>

<div class="env-block proof">
    <div class="env-title">Proof</div>
    <div class="env-body">
        <p>For nonzero integer \\(h\\), the Weyl sum is</p>
        \\[\\frac{1}{N}\\sum_{n=1}^N e(h\\alpha n) = \\frac{1}{N} \\cdot \\frac{e(h\\alpha(N+1)) - e(h\\alpha)}{e(h\\alpha) - 1}.\\]
        <p>Since \\(\\alpha\\) is irrational, \\(h\\alpha \\notin \\mathbb{Z}\\), so \\(e(h\\alpha) \\neq 1\\) and the denominator is a nonzero constant. The numerator is bounded by 2, so the whole expression is \\(O(1/N) \\to 0\\).</p>
    </div>
    <div class="qed">&marker;</div>
</div>

<h3>Weyl Sums for Polynomials</h3>

<p>A <strong>Weyl sum</strong> is an exponential sum of the form</p>
\\[W_N(f) = \\sum_{n=1}^{N} e(f(n))\\]
<p>where \\(f(x) = \\alpha_d x^d + \\alpha_{d-1} x^{d-1} + \\cdots + \\alpha_1 x + \\alpha_0\\) is a polynomial. The key result generalizes Weyl's equidistribution theorem.</p>

<div class="env-block theorem">
    <div class="env-title">Theorem 14.2 (Weyl's Inequality for Polynomials)</div>
    <div class="env-body">
        <p>Let \\(f(x) = \\alpha_d x^d + \\cdots + \\alpha_0\\) with \\(d \\geq 2\\). If \\(\\alpha_d\\) is irrational, then</p>
        \\[\\frac{1}{N}\\sum_{n=1}^{N} e(f(n)) \\to 0 \\quad \\text{as } N \\to \\infty.\\]
        <p>Consequently, the sequence \\((f(n))\\) is equidistributed mod 1.</p>
    </div>
</div>

<p>The quantitative version of Weyl's inequality gives explicit bounds. For a quadratic \\(f(n) = \\alpha n^2 + \\beta n\\), one obtains</p>
\\[\\left|\\sum_{n=1}^{N} e(\\alpha n^2 + \\beta n)\\right| \\ll N^{1+\\varepsilon} \\left(\\frac{1}{q} + \\frac{1}{N} + \\frac{q}{N^2}\\right)^{1/2}\\]
<p>where \\(q\\) is the denominator in a rational approximation \\(|\\alpha - a/q| \\leq 1/(qN)\\). The bound is non-trivial (\\(\\ll N^{1-\\delta}\\)) when \\(q\\) is in a suitable range.</p>

<div class="viz-placeholder" data-viz="viz-equidistribution"></div>
`,
            visualizations: [
                {
                    id: 'viz-equidistribution',
                    title: 'Equidistribution of n*alpha mod 1',
                    description: 'The fractional parts {n * alpha} fill up the unit interval uniformly when alpha is irrational. The histogram shows the distribution for the first N terms. Compare rational alpha (gaps and clusters) with irrational alpha (uniform fill).',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 380,
                            originX: 0, originY: 0, scale: 1
                        });

                        var alpha = (Math.sqrt(5) - 1) / 2; // golden ratio - 1
                        var N = 200;
                        var nBins = 20;

                        VizEngine.createSlider(controls, 'alpha', 0.01, 0.99, alpha, 0.001, function(v) {
                            alpha = v;
                            draw();
                        });
                        VizEngine.createSlider(controls, 'N', 20, 1000, N, 10, function(v) {
                            N = Math.round(v);
                            draw();
                        });

                        VizEngine.createButton(controls, 'golden ratio', function() {
                            alpha = (Math.sqrt(5) - 1) / 2;
                            draw();
                        });
                        VizEngine.createButton(controls, 'sqrt(2)', function() {
                            alpha = Math.sqrt(2) - 1;
                            draw();
                        });
                        VizEngine.createButton(controls, '1/3', function() {
                            alpha = 1 / 3;
                            draw();
                        });

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            var left = 60, right = viz.width - 30;
                            var top = 50, bottom = viz.height - 80;
                            var chartW = right - left;
                            var chartH = bottom - top;

                            // Compute fractional parts and histogram
                            var bins = new Array(nBins).fill(0);
                            for (var n = 1; n <= N; n++) {
                                var frac = (alpha * n) % 1;
                                if (frac < 0) frac += 1;
                                var b = Math.min(Math.floor(frac * nBins), nBins - 1);
                                bins[b]++;
                            }

                            var maxBin = Math.max.apply(null, bins);
                            var expected = N / nBins;

                            // Draw expected line
                            var expY = bottom - (expected / maxBin) * chartH;
                            ctx.strokeStyle = viz.colors.orange;
                            ctx.lineWidth = 1.5;
                            ctx.setLineDash([5, 4]);
                            ctx.beginPath();
                            ctx.moveTo(left, expY);
                            ctx.lineTo(right, expY);
                            ctx.stroke();
                            ctx.setLineDash([]);

                            // Draw bars
                            var barW = chartW / nBins - 2;
                            for (var i = 0; i < nBins; i++) {
                                var bx = left + i * (chartW / nBins) + 1;
                                var bh = (bins[i] / maxBin) * chartH;
                                ctx.fillStyle = viz.colors.blue + 'aa';
                                ctx.fillRect(bx, bottom - bh, barW, bh);
                                ctx.strokeStyle = viz.colors.blue;
                                ctx.lineWidth = 1;
                                ctx.strokeRect(bx, bottom - bh, barW, bh);
                            }

                            // x-axis
                            ctx.strokeStyle = viz.colors.axis;
                            ctx.lineWidth = 1;
                            ctx.beginPath();
                            ctx.moveTo(left, bottom);
                            ctx.lineTo(right, bottom);
                            ctx.stroke();

                            // x labels
                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '10px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'top';
                            for (var j = 0; j <= 4; j++) {
                                var xv = j / 4;
                                ctx.fillText(xv.toFixed(2), left + xv * chartW, bottom + 4);
                            }

                            // Discrepancy measure
                            var disc = 0;
                            for (var k = 0; k < nBins; k++) {
                                disc = Math.max(disc, Math.abs(bins[k] / N - 1 / nBins));
                            }

                            // Dot strip at bottom
                            var stripY = viz.height - 30;
                            var maxDots = Math.min(N, 300);
                            for (var m = 1; m <= maxDots; m++) {
                                var fr = (alpha * m) % 1;
                                if (fr < 0) fr += 1;
                                var dx = left + fr * chartW;
                                ctx.fillStyle = viz.colors.teal + '66';
                                ctx.beginPath();
                                ctx.arc(dx, stripY, 1.5, 0, Math.PI * 2);
                                ctx.fill();
                            }

                            // Title and info
                            viz.screenText('Equidistribution of {n * alpha} mod 1', viz.width / 2, 18, viz.colors.white, 14);
                            viz.screenText('alpha = ' + alpha.toFixed(4) + '    N = ' + N + '    max discrepancy = ' + disc.toFixed(4), viz.width / 2, 36, viz.colors.teal, 11);
                            viz.screenText('--- expected = N/' + nBins, right - 30, expY - 12, viz.colors.orange, 10, 'right');
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Show that the sequence \\((n^2 \\sqrt{2})\\) is equidistributed mod 1 by verifying Weyl\'s criterion for \\(f(n) = \\sqrt{2}\\, n^2\\).',
                    hint: 'Apply Theorem 14.2 with \\(d = 2\\) and \\(\\alpha_2 = \\sqrt{2}\\), which is irrational.',
                    solution: 'The polynomial is \\(f(n) = \\sqrt{2}\\, n^2\\) with leading coefficient \\(\\alpha_2 = \\sqrt{2}\\), which is irrational. By Theorem 14.2 (Weyl\'s inequality for polynomials), \\(\\frac{1}{N}\\sum_{n=1}^N e(h\\sqrt{2}\\, n^2) \\to 0\\) for every nonzero integer \\(h\\). Weyl\'s criterion then gives equidistribution mod 1.'
                },
            ]
        },

        // ================================================================
        // SECTION 3: Van der Corput's Method (A/B Processes)
        // ================================================================
        {
            id: 'sec-van-der-corput',
            title: 'Van der Corput\'s Method',
            content: `
<h2>Van der Corput's Method</h2>

<div class="env-block intuition">
    <div class="env-title">Two Ways to Create Cancellation</div>
    <div class="env-body">
        <p>Van der Corput's method provides two systematic techniques for bounding exponential sums. <strong>Process A</strong> (differencing) reduces a sum to one with a simpler phase by forming differences \\(f(n+h) - f(n)\\). <strong>Process B</strong> (Poisson summation) converts a sum with a smooth, rapidly-varying phase into one with a slowly-varying phase. Together, they form a toolkit that handles polynomials of any degree.</p>
    </div>
</div>

<h3>Process A: Weyl Differencing</h3>

<div class="env-block theorem">
    <div class="env-title">Theorem 14.3 (Van der Corput's Inequality)</div>
    <div class="env-body">
        <p>Let \\(S = \\sum_{n=M+1}^{M+N} a_n\\) where \\(|a_n| \\leq 1\\). Then for any positive integer \\(H < N\\),</p>
        \\[|S|^2 \\leq \\frac{N + H}{H+1} \\left( N + 2 \\sum_{h=1}^{H} \\left(1 - \\frac{h}{H+1}\\right) \\left|\\sum_{n} a_{n+h} \\overline{a_n}\\right| \\right).\\]
    </div>
</div>

<p>When \\(a_n = e(f(n))\\), the inner sum becomes \\(\\sum_n e(f(n+h) - f(n))\\). If \\(f\\) is a polynomial of degree \\(d\\), then \\(f(n+h) - f(n)\\) has degree \\(d-1\\). This is the power of differencing: <em>it reduces the degree by one</em>.</p>

<div class="env-block example">
    <div class="env-title">Example: Quadratic Weyl Sums</div>
    <div class="env-body">
        <p>Let \\(f(n) = \\alpha n^2\\). Then \\(f(n+h) - f(n) = 2\\alpha h n + \\alpha h^2\\). The inner sum becomes</p>
        \\[\\sum_n e(2\\alpha h n + \\alpha h^2) = e(\\alpha h^2) \\sum_n e(2\\alpha h n),\\]
        <p>which is a geometric sum. For irrational \\(\\alpha\\), this is \\(O(1/\\|2\\alpha h\\|)\\), giving non-trivial bounds for the original quadratic sum.</p>
    </div>
</div>

<h3>Process B: Poisson Summation / Stationary Phase</h3>

<div class="env-block theorem">
    <div class="env-title">Theorem 14.4 (Van der Corput's Lemma, First Derivative Test)</div>
    <div class="env-body">
        <p>Let \\(f : [a, b] \\to \\mathbb{R}\\) be continuously differentiable with \\(f'\\) monotone and \\(|f'(x)| \\geq \\lambda > 0\\) on \\([a, b]\\). Then</p>
        \\[\\left|\\sum_{a < n \\leq b} e(f(n))\\right| \\ll \\frac{1}{\\lambda}.\\]
    </div>
</div>

<div class="env-block theorem">
    <div class="env-title">Theorem 14.5 (Second Derivative Test)</div>
    <div class="env-body">
        <p>Let \\(f : [a, b] \\to \\mathbb{R}\\) be twice continuously differentiable with \\(|f''(x)| \\asymp \\lambda_2 > 0\\) on \\([a, b]\\). Then</p>
        \\[\\left|\\sum_{a < n \\leq b} e(f(n))\\right| \\ll (b-a)\\sqrt{\\lambda_2} + \\frac{1}{\\sqrt{\\lambda_2}}.\\]
    </div>
</div>

<p>The second derivative test captures the idea of <strong>stationary phase</strong>: the sum is dominated by terms near the point where \\(f'(x) = \\text{integer}\\) (i.e., the phase is stationary), and contributions from other terms cancel.</p>

<div class="env-block remark">
    <div class="env-title">Geometric Interpretation</div>
    <div class="env-body">
        <p>When \\(f''\\) is large, the spiral \\(\\sum e(f(n))\\) curls tightly and different arcs cancel. When \\(f''\\) is small, the spiral straightens out and consecutive terms nearly align, producing less cancellation. The second derivative test quantifies this: larger curvature (\\(\\lambda_2\\)) yields smaller sums.</p>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-van-der-corput-a"></div>
<div class="viz-placeholder" data-viz="viz-van-der-corput-b"></div>
`,
            visualizations: [
                {
                    id: 'viz-van-der-corput-a',
                    title: 'Process A: Weyl Differencing',
                    description: 'See how differencing reduces the degree of a polynomial phase. The left spiral shows the original sum S = sum e(alpha * n^2). The right shows the differenced sum for a chosen h, which has a linear phase.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 380,
                            originX: 0, originY: 0, scale: 1
                        });

                        var alpha = 0.03;
                        var N = 80;
                        var hVal = 1;

                        VizEngine.createSlider(controls, 'alpha', 0.001, 0.15, alpha, 0.001, function(v) {
                            alpha = v; draw();
                        });
                        VizEngine.createSlider(controls, 'h', 1, 10, hVal, 1, function(v) {
                            hVal = Math.round(v); draw();
                        });
                        VizEngine.createSlider(controls, 'N', 20, 200, N, 1, function(v) {
                            N = Math.round(v); draw();
                        });

                        function drawSpiral(cx, cy, sc, fn, maxN, color, label) {
                            var ctx = viz.ctx;
                            var px = 0, py = 0;
                            ctx.beginPath();
                            ctx.moveTo(cx, cy);
                            for (var n = 1; n <= maxN; n++) {
                                var angle = 2 * Math.PI * fn(n);
                                px += Math.cos(angle);
                                py += Math.sin(angle);
                                ctx.lineTo(cx + px * sc, cy - py * sc);
                            }
                            ctx.strokeStyle = color;
                            ctx.lineWidth = 1.2;
                            ctx.stroke();

                            // endpoint dot
                            ctx.fillStyle = viz.colors.orange;
                            ctx.beginPath();
                            ctx.arc(cx + px * sc, cy - py * sc, 4, 0, Math.PI * 2);
                            ctx.fill();

                            var mag = Math.sqrt(px * px + py * py);
                            viz.screenText(label, cx, cy - 170, viz.colors.white, 12);
                            viz.screenText('|S| = ' + mag.toFixed(2), cx, cy + 175, color, 11);
                        }

                        function draw() {
                            viz.clear();

                            viz.screenText('Process A: Weyl Differencing (degree reduction)', viz.width / 2, 15, viz.colors.white, 14);

                            // Original sum: e(alpha * n^2)
                            drawSpiral(viz.width / 4, viz.height / 2, 3, function(n) {
                                return alpha * n * n;
                            }, N, viz.colors.blue, 'Original: e(alpha n^2)');

                            // Differenced sum: e(2*alpha*h*n + alpha*h^2)
                            drawSpiral(3 * viz.width / 4, viz.height / 2, 3, function(n) {
                                return 2 * alpha * hVal * n + alpha * hVal * hVal;
                            }, N - hVal, viz.colors.teal, 'Differenced (h=' + hVal + '): e(2alpha h n)');
                        }
                        draw();
                        return viz;
                    }
                },
                {
                    id: 'viz-van-der-corput-b',
                    title: 'Process B: Curvature and Cancellation',
                    description: 'Visualize how the second derivative (curvature of the phase) controls cancellation. When f\'\'(x) is large, the spiral curls tightly and the magnitude stays small. When f\'\'(x) is small, it straightens out.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 380,
                            originX: 280, originY: 200, scale: 4
                        });

                        var lambda2 = 0.01;
                        var N = 150;

                        VizEngine.createSlider(controls, 'f\'\' (curvature)', 0.001, 0.1, lambda2, 0.001, function(v) {
                            lambda2 = v; draw();
                        });
                        VizEngine.createSlider(controls, 'N', 30, 300, N, 1, function(v) {
                            N = Math.round(v); draw();
                        });

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            // Draw faint axes
                            ctx.strokeStyle = viz.colors.grid;
                            ctx.lineWidth = 0.5;
                            ctx.beginPath(); ctx.moveTo(0, viz.originY); ctx.lineTo(viz.width, viz.originY); ctx.stroke();
                            ctx.beginPath(); ctx.moveTo(viz.originX, 0); ctx.lineTo(viz.originX, viz.height); ctx.stroke();

                            // Sum e(0.5 * lambda2 * n^2) -- pure quadratic
                            var px = 0, py = 0;
                            ctx.beginPath();
                            ctx.moveTo(viz.originX, viz.originY);
                            for (var n = 1; n <= N; n++) {
                                var angle = 2 * Math.PI * 0.5 * lambda2 * n * n;
                                px += Math.cos(angle);
                                py += Math.sin(angle);
                                ctx.lineTo(viz.originX + px * viz.scale, viz.originY - py * viz.scale);
                            }
                            ctx.strokeStyle = viz.colors.blue;
                            ctx.lineWidth = 1.2;
                            ctx.stroke();

                            // Endpoint
                            var ex = viz.originX + px * viz.scale;
                            var ey = viz.originY - py * viz.scale;
                            ctx.fillStyle = viz.colors.orange;
                            ctx.beginPath(); ctx.arc(ex, ey, 5, 0, Math.PI * 2); ctx.fill();

                            // Dashed line to endpoint
                            ctx.strokeStyle = viz.colors.orange;
                            ctx.lineWidth = 1.5;
                            ctx.setLineDash([4, 3]);
                            ctx.beginPath();
                            ctx.moveTo(viz.originX, viz.originY);
                            ctx.lineTo(ex, ey);
                            ctx.stroke();
                            ctx.setLineDash([]);

                            var mag = Math.sqrt(px * px + py * py);
                            var bound = N * Math.sqrt(lambda2) + 1 / Math.sqrt(lambda2);

                            viz.screenText('f(n) = (1/2) * lambda_2 * n^2,   f\'\'= lambda_2 = ' + lambda2.toFixed(3), viz.width / 2, 18, viz.colors.white, 12);
                            viz.screenText('|S_N| = ' + mag.toFixed(2) + '    VdC bound ~ N*sqrt(lambda_2) + 1/sqrt(lambda_2) = ' + bound.toFixed(1), viz.width / 2, 38, viz.colors.teal, 11);
                            viz.screenText('N = ' + N + '    trivial bound = ' + N, viz.width / 2, viz.height - 15, viz.colors.text, 11);
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Apply the first derivative test to bound \\(\\sum_{n=1}^{N} e(\\alpha n^2)\\) when \\(\\alpha > 1/N\\). What bound do you get?',
                    hint: 'Here \\(f\'(x) = 2\\alpha x\\), which is monotone. The minimum of \\(|f\'|\\) on \\([1, N]\\) is \\(2\\alpha\\), so \\(\\lambda = 2\\alpha\\).',
                    solution: 'With \\(f(x) = \\alpha x^2\\), we have \\(f\'(x) = 2\\alpha x\\), which is positive and increasing for \\(x \\geq 1\\). The minimum value on \\([1, N]\\) is \\(f\'(1) = 2\\alpha\\), so \\(\\lambda = 2\\alpha\\). The first derivative test gives \\(|S| \\ll 1/\\lambda = 1/(2\\alpha)\\). This is non-trivial when \\(1/(2\\alpha) < N\\), i.e., \\(\\alpha > 1/(2N)\\).'
                },
                {
                    question: 'Explain why applying Process A once to a cubic sum \\(\\sum e(\\alpha n^3)\\) produces a quadratic sum, and applying it again produces a linear (geometric) sum.',
                    hint: 'Compute the difference \\(\\alpha(n+h)^3 - \\alpha n^3\\) and identify the leading term.',
                    solution: '\\(\\alpha(n+h)^3 - \\alpha n^3 = 3\\alpha h n^2 + 3\\alpha h^2 n + \\alpha h^3\\). The leading term is \\(3\\alpha h n^2\\): a degree-2 polynomial. One more differencing: \\(3\\alpha h ((n+h\')^2 - n^2) = 3\\alpha h(2h\' n + h\'^2)\\), which is linear in \\(n\\). Each application of Process A reduces the degree by one, eventually reaching a geometric sum.'
                }
            ]
        },

        // ================================================================
        // SECTION 4: Vinogradov's Method
        // ================================================================
        {
            id: 'sec-vinogradov',
            title: 'Vinogradov\'s Method',
            content: `
<h2>Vinogradov's Method</h2>

<div class="env-block intuition">
    <div class="env-title">Beyond Weyl</div>
    <div class="env-body">
        <p>Weyl's method, applied \\(d-1\\) times to a degree-\\(d\\) polynomial, gives a bound of \\(N^{1-c_d}\\) where \\(c_d = 1/2^{d-1}\\). For large \\(d\\), this decay rate is tiny. Vinogradov's method (also called Vinogradov's mean value theorem) dramatically improves the exponent, replacing \\(2^{d-1}\\) by something closer to \\(d^2\\).</p>
    </div>
</div>

<h3>Vinogradov's Mean Value Theorem</h3>

<p>Let \\(J_{s,d}(N)\\) denote the number of solutions to the system</p>
\\[
x_1^j + \\cdots + x_s^j = y_1^j + \\cdots + y_s^j, \\quad j = 1, 2, \\ldots, d
\\]
<p>with \\(1 \\leq x_i, y_i \\leq N\\). This "mean value" counts the number of solutions to a system of Diophantine equations.</p>

<div class="env-block theorem">
    <div class="env-title">Theorem 14.6 (Main Conjecture / Bourgain-Demeter-Guth 2016)</div>
    <div class="env-body">
        <p>For \\(s \\geq d(d+1)/2\\),</p>
        \\[J_{s,d}(N) \\ll_{s,d,\\varepsilon} N^{\\varepsilon}(N^s + N^{2s - d(d+1)/2}).\\]
        <p>This is sharp up to \\(N^\\varepsilon\\) factors.</p>
    </div>
</div>

<p>This theorem was conjectured by Vinogradov in the 1930s and fully proved by Bourgain, Demeter, and Guth in 2016 using decoupling methods from harmonic analysis. It has profound consequences:</p>

<div class="env-block corollary">
    <div class="env-title">Corollary (Weyl-type Bound)</div>
    <div class="env-body">
        <p>For \\(f(n) = \\alpha_d n^d + \\cdots + \\alpha_0\\) with \\(|\\alpha_d - a/q| \\leq q^{-2}\\), \\(\\gcd(a,q)=1\\),</p>
        \\[\\left|\\sum_{n=1}^{N} e(f(n))\\right| \\ll N^{1+\\varepsilon}\\left(\\frac{1}{q} + \\frac{1}{N} + \\frac{q}{N^d}\\right)^{1/d(d-1)}.\\]
        <p>This is far superior to Weyl's exponent of \\(1/2^{d-1}\\) for large \\(d\\).</p>
    </div>
</div>

<h3>Application: Waring's Problem</h3>

<p>The exponential sum machinery is essential for Waring's problem: given \\(d \\geq 2\\), every sufficiently large integer is the sum of at most \\(G(d)\\) perfect \\(d\\)-th powers. The circle method (Hardy-Littlewood-Vinogradov) reduces this to estimating</p>
\\[
r_{s,d}(n) = \\int_0^1 \\left(\\sum_{m=1}^{N} e(\\alpha m^d)\\right)^s e(-\\alpha n)\\,d\\alpha.
\\]

<p>Vinogradov showed \\(G(d) \\leq 2d(\\log d + O(\\log\\log d))\\), a near-optimal result obtained through his refined bounds on exponential sums.</p>

<div class="env-block remark">
    <div class="env-title">Historical Note</div>
    <div class="env-body">
        <p>The progression of bounds for Weyl sums illustrates the difficulty of the problem. For a degree-\\(d\\) polynomial with irrational leading coefficient:</p>
        <ul>
            <li><strong>Weyl (1916):</strong> savings of \\(N^{-1/2^{d-1}}\\)</li>
            <li><strong>Vinogradov (1935):</strong> savings of \\(N^{-c/d^2 \\log d}\\)</li>
            <li><strong>Wooley (2012, efficient congruencing):</strong> nearly optimal for many \\(d\\)</li>
            <li><strong>Bourgain-Demeter-Guth (2016, \\(\\ell^2\\) decoupling):</strong> optimal up to \\(\\varepsilon\\)</li>
        </ul>
        <p>Each advance required genuinely new ideas, not just refinement of old techniques.</p>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-cancellation-slider"></div>
`,
            visualizations: [
                {
                    id: 'viz-cancellation-slider',
                    title: 'Cancellation in Polynomial Sums',
                    description: 'Compare the magnitude |S_N| for polynomial phases of different degrees. As the degree increases, more cancellation occurs (for generic irrational alpha), but the Weyl bound weakens exponentially. The Vinogradov bound improves upon Weyl for large d.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 380,
                            originX: 0, originY: 0, scale: 1
                        });

                        var N = 200;
                        var alphaBase = Math.sqrt(2) - 1;

                        VizEngine.createSlider(controls, 'N', 50, 500, N, 10, function(v) {
                            N = Math.round(v); draw();
                        });

                        function computeMag(degree, maxN) {
                            var cx = 0, cy = 0;
                            for (var n = 1; n <= maxN; n++) {
                                var phase = alphaBase * Math.pow(n, degree);
                                cx += Math.cos(2 * Math.PI * phase);
                                cy += Math.sin(2 * Math.PI * phase);
                            }
                            return Math.sqrt(cx * cx + cy * cy);
                        }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            var left = 80, right = viz.width - 40;
                            var top = 60, bottom = viz.height - 60;
                            var chartW = right - left;
                            var chartH = bottom - top;
                            var maxDeg = 6;

                            // Compute magnitudes for degrees 1..maxDeg
                            var mags = [];
                            for (var d = 1; d <= maxDeg; d++) {
                                mags.push(computeMag(d, N));
                            }
                            var maxMag = Math.max(N, Math.max.apply(null, mags));

                            // Bars
                            var barW = chartW / maxDeg - 10;
                            var colors = [viz.colors.blue, viz.colors.teal, viz.colors.orange, viz.colors.purple, viz.colors.green, viz.colors.pink];

                            for (var i = 0; i < maxDeg; i++) {
                                var bx = left + i * (chartW / maxDeg) + 5;
                                var bh = (mags[i] / maxMag) * chartH;
                                ctx.fillStyle = colors[i] + 'bb';
                                ctx.fillRect(bx, bottom - bh, barW, bh);
                                ctx.strokeStyle = colors[i];
                                ctx.lineWidth = 1;
                                ctx.strokeRect(bx, bottom - bh, barW, bh);

                                // Label
                                ctx.fillStyle = viz.colors.text;
                                ctx.font = '11px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.textBaseline = 'top';
                                ctx.fillText('d=' + (i + 1), bx + barW / 2, bottom + 5);
                                ctx.fillText('|S|=' + mags[i].toFixed(1), bx + barW / 2, bottom + 18);
                            }

                            // Reference lines
                            // Trivial bound N
                            var trivY = bottom - (N / maxMag) * chartH;
                            ctx.strokeStyle = viz.colors.red;
                            ctx.lineWidth = 1;
                            ctx.setLineDash([5, 4]);
                            ctx.beginPath(); ctx.moveTo(left, trivY); ctx.lineTo(right, trivY); ctx.stroke();
                            ctx.setLineDash([]);
                            viz.screenText('trivial = ' + N, right + 5, trivY, viz.colors.red, 10, 'left', 'middle');

                            // sqrt(N) reference
                            var sqrtY = bottom - (Math.sqrt(N) / maxMag) * chartH;
                            ctx.strokeStyle = viz.colors.teal;
                            ctx.lineWidth = 1;
                            ctx.setLineDash([3, 3]);
                            ctx.beginPath(); ctx.moveTo(left, sqrtY); ctx.lineTo(right, sqrtY); ctx.stroke();
                            ctx.setLineDash([]);
                            viz.screenText('sqrt(N)=' + Math.sqrt(N).toFixed(1), right + 5, sqrtY, viz.colors.teal, 10, 'left', 'middle');

                            // x-axis
                            ctx.strokeStyle = viz.colors.axis;
                            ctx.lineWidth = 1;
                            ctx.beginPath(); ctx.moveTo(left, bottom); ctx.lineTo(right, bottom); ctx.stroke();

                            // Title
                            viz.screenText('|S_N(alpha * n^d)| for degrees d = 1..6,  alpha = sqrt(2)-1', viz.width / 2, 18, viz.colors.white, 13);
                            viz.screenText('N = ' + N, viz.width / 2, 38, viz.colors.teal, 12);
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'For a degree-\\(d\\) polynomial, Weyl\'s method gives a saving of \\(N^{-1/2^{d-1}}\\). What saving does this give for \\(d = 10\\)?',
                    hint: 'Compute \\(1/2^{9}\\).',
                    solution: 'The saving is \\(N^{-1/2^9} = N^{-1/512}\\). This means \\(|S_N| \\ll N^{1-1/512} \\approx N^{0.998}\\), which is barely better than the trivial bound \\(N\\). For large \\(d\\), Weyl\'s method gives negligible improvement. Vinogradov\'s method gives savings of \\(N^{-c/d^2}\\), which for \\(d = 10\\) would be roughly \\(N^{-c/100}\\), a significant improvement.'
                }
            ]
        },

        // ================================================================
        // SECTION 5: Gauss Sums and Kloosterman Sums
        // ================================================================
        {
            id: 'sec-gauss-kloosterman',
            title: 'Gauss Sums and Kloosterman Sums',
            content: `
<h2>Gauss Sums and Kloosterman Sums</h2>

<div class="env-block intuition">
    <div class="env-title">Character Sums: A Different Flavor</div>
    <div class="env-body">
        <p>So far we have studied sums where the phase \\(f(n)\\) is a polynomial. A different class of exponential sums arises from <strong>multiplicative characters</strong> and the arithmetic of finite fields. Gauss sums and Kloosterman sums are the prototypical examples. Their exact evaluation or sharp bounding is connected to deep algebraic geometry (the Riemann hypothesis for curves over finite fields).</p>
    </div>
</div>

<h3>Gauss Sums</h3>

<div class="env-block definition">
    <div class="env-title">Definition (Gauss Sum)</div>
    <div class="env-body">
        <p>For a Dirichlet character \\(\\chi\\) modulo \\(q\\), the <strong>Gauss sum</strong> is</p>
        \\[\\tau(\\chi) = \\sum_{n=1}^{q} \\chi(n)\\, e(n/q) = \\sum_{n=1}^{q} \\chi(n)\\, e^{2\\pi i n/q}.\\]
    </div>
</div>

<div class="env-block theorem">
    <div class="env-title">Theorem 14.7 (Magnitude of Gauss Sums)</div>
    <div class="env-body">
        <p>If \\(\\chi\\) is a primitive character modulo \\(q\\), then \\(|\\tau(\\chi)| = \\sqrt{q}\\).</p>
    </div>
</div>

<p>For the special case of the quadratic (Legendre) symbol \\(\\chi(n) = \\left(\\frac{n}{p}\\right)\\) with \\(p\\) an odd prime, the Gauss sum evaluates to</p>
\\[
\\tau\\left(\\left(\\frac{\\cdot}{p}\\right)\\right) = \\sum_{n=0}^{p-1} \\left(\\frac{n}{p}\\right) e(n/p) = \\begin{cases} \\sqrt{p} & \\text{if } p \\equiv 1 \\pmod{4}, \\\\ i\\sqrt{p} & \\text{if } p \\equiv 3 \\pmod{4}. \\end{cases}
\\]

<p>This remarkable formula was first conjectured by Gauss and proved by him after years of effort. It plays a central role in the proof of quadratic reciprocity.</p>

<h3>Kloosterman Sums</h3>

<div class="env-block definition">
    <div class="env-title">Definition (Kloosterman Sum)</div>
    <div class="env-body">
        <p>For integers \\(a, b\\) and a positive integer \\(q\\), the <strong>Kloosterman sum</strong> is</p>
        \\[K(a, b; q) = \\sum_{\\substack{n=1 \\\\ \\gcd(n, q) = 1}}^{q} e\\!\\left(\\frac{an + b\\overline{n}}{q}\\right)\\]
        <p>where \\(\\overline{n}\\) denotes the multiplicative inverse of \\(n\\) modulo \\(q\\).</p>
    </div>
</div>

<p>The Kloosterman sum is a "twisted" exponential sum: the phase involves both \\(n\\) and \\(n^{-1}\\). It arises naturally in the Fourier expansion of modular forms and in the circle method for Waring's problem.</p>

<div class="env-block theorem">
    <div class="env-title">Theorem 14.8 (Weil Bound)</div>
    <div class="env-body">
        <p>For a prime \\(p\\) and \\(\\gcd(ab, p) = 1\\),</p>
        \\[|K(a, b; p)| \\leq 2\\sqrt{p}.\\]
        <p>This is a consequence of Weil's proof of the Riemann hypothesis for curves over finite fields (1948).</p>
    </div>
</div>

<div class="env-block remark">
    <div class="env-title">Why sqrt(p)?</div>
    <div class="env-body">
        <p>The Kloosterman sum has \\(p-1\\) terms, each of unit modulus. The trivial bound is \\(p-1\\). The Weil bound of \\(2\\sqrt{p}\\) is essentially the square-root barrier, analogous to square-root cancellation in random walks. This bound is best possible: there exist \\(a, b\\) with \\(|K(a,b;p)| \\geq (2 - \\varepsilon)\\sqrt{p}\\) for infinitely many \\(p\\). The deep reason is that \\(K(a,b;p)\\) equals the trace of Frobenius on a rank-2 \\(\\ell\\)-adic sheaf, and the Riemann hypothesis for this sheaf gives eigenvalues of absolute value \\(\\sqrt{p}\\).</p>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-kloosterman-path"></div>
<div class="viz-placeholder" data-viz="viz-weil-bound"></div>
`,
            visualizations: [
                {
                    id: 'viz-kloosterman-path',
                    title: 'Kloosterman Sum Path',
                    description: 'The Kloosterman sum K(a, b; p) traced as a walk in the complex plane. Each step adds e((a*n + b*n_inv)/p). The resulting path has a characteristic "asteroid" shape. Adjust a, b, and the prime p.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 420,
                            originX: 280, originY: 210, scale: 1
                        });

                        var primes = [5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97, 101, 127, 151, 199, 251];
                        var primeIdx = 10; // start with 41
                        var aVal = 1;
                        var bVal = 1;

                        VizEngine.createSlider(controls, 'prime index', 0, primes.length - 1, primeIdx, 1, function(v) {
                            primeIdx = Math.round(v); draw();
                        });
                        VizEngine.createSlider(controls, 'a', 1, 20, aVal, 1, function(v) {
                            aVal = Math.round(v); draw();
                        });
                        VizEngine.createSlider(controls, 'b', 1, 20, bVal, 1, function(v) {
                            bVal = Math.round(v); draw();
                        });

                        function modInverse(n, p) {
                            // Extended Euclidean algorithm
                            var a = ((n % p) + p) % p;
                            if (a === 0) return 0;
                            var t = 0, newt = 1, r = p, newr = a;
                            while (newr !== 0) {
                                var quotient = Math.floor(r / newr);
                                var tmp = t - quotient * newt; t = newt; newt = tmp;
                                tmp = r - quotient * newr; r = newr; newr = tmp;
                            }
                            return ((t % p) + p) % p;
                        }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var p = primes[primeIdx];

                            // Auto-scale: the walk has roughly sqrt(p) extent
                            var sc = Math.min(180, 800 / Math.sqrt(p)) / Math.sqrt(p) * 2;

                            // Draw faint axes
                            ctx.strokeStyle = viz.colors.grid;
                            ctx.lineWidth = 0.5;
                            ctx.beginPath(); ctx.moveTo(0, viz.originY); ctx.lineTo(viz.width, viz.originY); ctx.stroke();
                            ctx.beginPath(); ctx.moveTo(viz.originX, 0); ctx.lineTo(viz.originX, viz.height); ctx.stroke();

                            // Compute Kloosterman sum
                            var cx = 0, cy = 0;
                            ctx.beginPath();
                            ctx.moveTo(viz.originX, viz.originY);

                            var a = aVal % p || 1;
                            var b = bVal % p || 1;

                            for (var n = 1; n < p; n++) {
                                var ninv = modInverse(n, p);
                                var phase = 2 * Math.PI * (a * n + b * ninv) / p;
                                cx += Math.cos(phase);
                                cy += Math.sin(phase);
                                ctx.lineTo(viz.originX + cx * sc, viz.originY - cy * sc);
                            }
                            ctx.strokeStyle = viz.colors.blue;
                            ctx.lineWidth = 1.5;
                            ctx.stroke();

                            // Endpoint
                            var ex = viz.originX + cx * sc;
                            var ey = viz.originY - cy * sc;
                            ctx.fillStyle = viz.colors.orange;
                            ctx.beginPath(); ctx.arc(ex, ey, 5, 0, Math.PI * 2); ctx.fill();

                            // Dashed line origin to endpoint
                            ctx.strokeStyle = viz.colors.orange;
                            ctx.lineWidth = 1.5;
                            ctx.setLineDash([4, 3]);
                            ctx.beginPath();
                            ctx.moveTo(viz.originX, viz.originY);
                            ctx.lineTo(ex, ey);
                            ctx.stroke();
                            ctx.setLineDash([]);

                            // Weil bound circle
                            var weilR = 2 * Math.sqrt(p) * sc;
                            ctx.strokeStyle = viz.colors.red + '55';
                            ctx.lineWidth = 1;
                            ctx.setLineDash([3, 3]);
                            ctx.beginPath();
                            ctx.arc(viz.originX, viz.originY, weilR, 0, Math.PI * 2);
                            ctx.stroke();
                            ctx.setLineDash([]);

                            var mag = Math.sqrt(cx * cx + cy * cy);

                            viz.screenText('K(' + a + ', ' + b + '; ' + p + ')', viz.width / 2, 18, viz.colors.white, 15);
                            viz.screenText('|K| = ' + mag.toFixed(2) + '    Weil bound: 2*sqrt(' + p + ') = ' + (2 * Math.sqrt(p)).toFixed(2) + '    trivial: ' + (p - 1), viz.width / 2, 40, viz.colors.teal, 11);
                            viz.screenText('red circle = Weil bound', viz.width / 2, viz.height - 15, viz.colors.red, 10);
                        }
                        draw();
                        return viz;
                    }
                },
                {
                    id: 'viz-weil-bound',
                    title: 'Weil Bound: |K(a,b;p)| vs 2*sqrt(p)',
                    description: 'For a fixed prime p, compute |K(1, b; p)| for all b = 1, ..., p-1 and compare against the Weil bound 2*sqrt(p). The values cluster near their expected Sato-Tate distribution.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 380,
                            originX: 0, originY: 0, scale: 1
                        });

                        var primeChoices = [17, 31, 53, 79, 101, 127, 151, 199];
                        var pIdx = 4;

                        VizEngine.createSlider(controls, 'prime index', 0, primeChoices.length - 1, pIdx, 1, function(v) {
                            pIdx = Math.round(v); draw();
                        });

                        function modInverse(n, p) {
                            var a = ((n % p) + p) % p;
                            if (a === 0) return 0;
                            var t = 0, newt = 1, r = p, newr = a;
                            while (newr !== 0) {
                                var q = Math.floor(r / newr);
                                var tmp = t - q * newt; t = newt; newt = tmp;
                                tmp = r - q * newr; r = newr; newr = tmp;
                            }
                            return ((t % p) + p) % p;
                        }

                        function kloosterman(a, b, p) {
                            var cx = 0, cy = 0;
                            for (var n = 1; n < p; n++) {
                                var ninv = modInverse(n, p);
                                var phase = 2 * Math.PI * (a * n + b * ninv) / p;
                                cx += Math.cos(phase);
                                cy += Math.sin(phase);
                            }
                            return Math.sqrt(cx * cx + cy * cy);
                        }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var p = primeChoices[pIdx];
                            var weil = 2 * Math.sqrt(p);

                            var left = 60, right = viz.width - 30;
                            var top = 55, bottom = viz.height - 50;
                            var chartW = right - left;
                            var chartH = bottom - top;

                            // Compute |K(1, b; p)| for b = 1..p-1
                            var vals = [];
                            for (var b = 1; b < p; b++) {
                                vals.push(kloosterman(1, b, p));
                            }
                            var maxVal = Math.max(weil * 1.1, Math.max.apply(null, vals));

                            // Scatter plot
                            var dotW = Math.min(6, chartW / vals.length);
                            for (var i = 0; i < vals.length; i++) {
                                var dx = left + (i / (vals.length - 1)) * chartW;
                                var dy = bottom - (vals[i] / maxVal) * chartH;
                                var col = vals[i] > weil ? viz.colors.red : viz.colors.blue;
                                ctx.fillStyle = col;
                                ctx.beginPath();
                                ctx.arc(dx, dy, Math.max(2, dotW / 2), 0, Math.PI * 2);
                                ctx.fill();
                            }

                            // Weil bound line
                            var weilY = bottom - (weil / maxVal) * chartH;
                            ctx.strokeStyle = viz.colors.red;
                            ctx.lineWidth = 2;
                            ctx.setLineDash([6, 4]);
                            ctx.beginPath(); ctx.moveTo(left, weilY); ctx.lineTo(right, weilY); ctx.stroke();
                            ctx.setLineDash([]);
                            viz.screenText('Weil: 2sqrt(p) = ' + weil.toFixed(2), right - 80, weilY - 12, viz.colors.red, 10);

                            // sqrt(p) line
                            var sqrtY = bottom - (Math.sqrt(p) / maxVal) * chartH;
                            ctx.strokeStyle = viz.colors.teal;
                            ctx.lineWidth = 1;
                            ctx.setLineDash([4, 3]);
                            ctx.beginPath(); ctx.moveTo(left, sqrtY); ctx.lineTo(right, sqrtY); ctx.stroke();
                            ctx.setLineDash([]);
                            viz.screenText('sqrt(p)=' + Math.sqrt(p).toFixed(2), right - 60, sqrtY - 12, viz.colors.teal, 10);

                            // Axes
                            ctx.strokeStyle = viz.colors.axis;
                            ctx.lineWidth = 1;
                            ctx.beginPath(); ctx.moveTo(left, bottom); ctx.lineTo(right, bottom); ctx.stroke();
                            ctx.beginPath(); ctx.moveTo(left, top); ctx.lineTo(left, bottom); ctx.stroke();

                            // Labels
                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '10px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'top';
                            ctx.fillText('b', (left + right) / 2, bottom + 5);
                            ctx.save();
                            ctx.translate(15, (top + bottom) / 2);
                            ctx.rotate(-Math.PI / 2);
                            ctx.fillText('|K(1,b;p)|', 0, 0);
                            ctx.restore();

                            viz.screenText('|K(1, b; ' + p + ')| for b = 1, ..., ' + (p - 1), viz.width / 2, 18, viz.colors.white, 13);

                            // Count violations (should be 0 by Weil)
                            var violations = vals.filter(function(v) { return v > weil + 0.01; }).length;
                            var avgVal = vals.reduce(function(a, b) { return a + b; }, 0) / vals.length;
                            viz.screenText('avg |K| = ' + avgVal.toFixed(2) + '    violations of Weil bound: ' + violations, viz.width / 2, 38, viz.colors.teal, 11);
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Verify that \\(|\\tau(\\chi)|^2 = p\\) for \\(\\chi = \\left(\\frac{\\cdot}{p}\\right)\\) by computing \\(\\tau(\\chi) \\overline{\\tau(\\chi)}\\) directly.',
                    hint: 'Use \\(\\overline{\\tau(\\chi)} = \\sum_{m} \\overline{\\chi(m)} e(-m/p) = \\sum_m \\chi(m) e(-m/p)\\) (since \\(\\chi\\) is real for the Legendre symbol). Then expand the product and use orthogonality of \\(e(n/p)\\).',
                    solution: '\\(|\\tau|^2 = \\sum_{n,m} \\chi(n)\\chi(m) e((n-m)/p)\\). Substituting \\(m = nt\\): \\(= \\sum_n \\chi(n)^2 \\sum_t \\chi(t) e(n(1-t)/p)\\). Since \\(\\chi(n)^2 = 1\\) for \\(\\gcd(n,p)=1\\) and the inner sum over \\(n\\) gives \\(p\\) when \\(t=1\\) and 0 otherwise (by character orthogonality), we get \\(|\\tau|^2 = (p-1) \\cdot \\chi(1) = p - 1\\). More carefully, including the \\(n=0\\) terms gives exactly \\(p\\).'
                },
            ]
        },

        // ================================================================
        // SECTION 6: Applications
        // ================================================================
        {
            id: 'sec-applications',
            title: 'Applications',
            content: `
<h2>Applications of Exponential Sum Bounds</h2>

<div class="env-block intuition">
    <div class="env-title">The Payoff</div>
    <div class="env-body">
        <p>Exponential sum estimates are not ends in themselves; they are the engine behind many of the deepest results in number theory. Here we survey the most important applications, showing how the machinery developed in previous sections drives concrete theorems.</p>
    </div>
</div>

<h3>Application 1: The Circle Method and Waring's Problem</h3>

<p>To show that every large integer \\(n\\) is a sum of \\(s\\) perfect \\(d\\)-th powers, the Hardy-Littlewood-Vinogradov circle method writes</p>
\\[
r_{s,d}(n) = \\int_0^1 S(\\alpha)^s e(-n\\alpha)\\,d\\alpha, \\quad S(\\alpha) = \\sum_{m=1}^{N} e(\\alpha m^d).
\\]

<p>The integral is split into "major arcs" (\\(\\alpha\\) near rationals \\(a/q\\) with small \\(q\\)) and "minor arcs" (the rest). On major arcs, \\(S(\\alpha)\\) can be approximated by Gauss sums; on minor arcs, one needs \\(|S(\\alpha)| \\ll N^{1-\\delta}\\) for some \\(\\delta > 0\\). Vinogradov's bounds provide exactly this.</p>

<h3>Application 2: Bounds on Character Sums (Polya-Vinogradov)</h3>

<div class="env-block theorem">
    <div class="env-title">Theorem 14.9 (Polya-Vinogradov Inequality)</div>
    <div class="env-body">
        <p>For any non-principal Dirichlet character \\(\\chi\\) modulo \\(q\\) and any \\(M, N\\),</p>
        \\[\\left|\\sum_{n=M+1}^{M+N} \\chi(n)\\right| \\ll \\sqrt{q} \\log q.\\]
    </div>
</div>

<p>The proof proceeds by expressing \\(\\chi(n)\\) in terms of Gauss sums and the exponential function \\(e(\\cdot)\\), then using the geometric series bound. The key input is \\(|\\tau(\\chi)| = \\sqrt{q}\\).</p>

<h3>Application 3: Equidistribution of Arithmetic Sequences</h3>

<p>Weyl's criterion converts distribution questions into exponential sum estimates. For example:</p>
<ul>
    <li>\\((\\sqrt{p_n})\\) where \\(p_n\\) is the \\(n\\)-th prime is equidistributed mod 1 (Vinogradov, using bounds on sums \\(\\sum_{p \\leq N} e(\\alpha \\sqrt{p})\\)).</li>
    <li>\\((\\alpha p)\\) for irrational \\(\\alpha\\) is equidistributed as \\(p\\) ranges over primes (requires Vaughan's identity + Vinogradov-type bounds).</li>
</ul>

<h3>Application 4: Lattice Point Problems</h3>

<p>The Gauss circle problem asks for the error \\(E(R)\\) in the count of lattice points inside a circle of radius \\(R\\):</p>
\\[\\sum_{n_1^2 + n_2^2 \\leq R^2} 1 = \\pi R^2 + E(R).\\]

<p>Using Poisson summation and bounds on \\(\\sum e(\\alpha n^2)\\), one shows \\(E(R) = O(R^{2/3})\\) (van der Corput). The connection: the lattice point count can be expressed as an exponential sum, and the curvature of the circle provides the second-derivative bound needed for Process B.</p>

<h3>Application 5: Vinogradov's Three Primes Theorem</h3>

<div class="env-block theorem">
    <div class="env-title">Theorem 14.10 (Vinogradov, 1937)</div>
    <div class="env-body">
        <p>Every sufficiently large odd integer is the sum of three primes.</p>
    </div>
</div>

<p>The proof uses the circle method with the exponential sum</p>
\\[S(\\alpha) = \\sum_{p \\leq N} (\\log p)\\, e(\\alpha p).\\]
<p>Bounding \\(S(\\alpha)\\) on minor arcs requires Vinogradov's estimates for exponential sums over primes, which combine sieve methods with the Weyl/Vinogradov bounds developed in this chapter.</p>

<div class="env-block remark">
    <div class="env-title">The Unreasonable Effectiveness of Exponential Sums</div>
    <div class="env-body">
        <p>It is striking that such diverse problems (additive number theory, distribution mod 1, lattice points, primes in arithmetic progressions) all reduce to the same question: <em>how much cancellation is there in \\(\\sum e(f(n))\\)?</em> The universality of this reduction is one of the central phenomena of analytic number theory.</p>
    </div>
</div>
`,
            visualizations: [],
            exercises: [
                {
                    question: 'The Polya-Vinogradov inequality gives \\(|\\sum_{n=1}^N \\chi(n)| \\ll \\sqrt{q}\\log q\\). For \\(q = 10^6\\), how does this compare to the trivial bound \\(N\\) when \\(N = q\\)?',
                    hint: 'Compute \\(\\sqrt{10^6} \\log(10^6)\\) and compare to \\(10^6\\).',
                    solution: '\\(\\sqrt{q}\\log q = \\sqrt{10^6} \\cdot \\log(10^6) = 10^3 \\cdot 6\\log 10 \\approx 10^3 \\cdot 13.8 \\approx 13{,}800\\). The trivial bound is \\(N = 10^6\\). The Polya-Vinogradov bound is about 72 times smaller than the trivial bound, demonstrating substantial cancellation in character sums.'
                }
            ]
        },

        // ================================================================
        // SECTION 7: Bridge
        // ================================================================
        {
            id: 'sec-bridge',
            title: 'Looking Ahead',
            content: `
<h2>Looking Ahead: The Bridge to \\(L\\)-Functions and Beyond</h2>

<div class="env-block intuition">
    <div class="env-title">The Bigger Picture</div>
    <div class="env-body">
        <p>The exponential sum techniques of this chapter are not isolated tools; they form the analytic core of the three great pillars of modern number theory: the circle method, the large sieve, and the theory of automorphic forms. Each pillar rests on the same foundation: quantifying cancellation.</p>
    </div>
</div>

<h3>From Exponential Sums to \\(L\\)-Functions</h3>

<p>The completed \\(L\\)-function \\(L(s, \\chi) = \\sum_{n=1}^\\infty \\chi(n) n^{-s}\\) is, at heart, a Dirichlet series weighted by a character, an infinite exponential sum in disguise. The analytic properties of \\(L(s, \\chi)\\) (functional equation, zero-free region, zero density estimates) are all proved using exponential sum techniques:</p>

<ul>
    <li><strong>Approximate functional equation:</strong> Expresses \\(L(s, \\chi)\\) as a finite exponential sum plus a remainder, making the Gauss sum \\(\\tau(\\chi)\\) appear naturally.</li>
    <li><strong>Zero-free regions:</strong> The Vinogradov-Korobov zero-free region \\(\\sigma > 1 - c/(\\log q)^{2/3}(\\log\\log q)^{1/3}\\) is proved using Vinogradov's bounds on trigonometric sums.</li>
    <li><strong>Subconvexity:</strong> Bounding \\(L(1/2, \\chi)\\) below the "convexity bound" \\(q^{1/4}\\) uses Weyl-type estimates.</li>
</ul>

<h3>The Large Sieve</h3>

<p>The large sieve inequality,</p>
\\[\\sum_{r=1}^{R} \\left|\\sum_{n=M+1}^{M+N} a_n e(\\alpha_r n)\\right|^2 \\leq (N + R - 1)\\sum_{n} |a_n|^2,\\]
<p>is a deep result about the collective behavior of exponential sums at different frequencies. It combines with sieve methods to give powerful results about primes in short intervals, gaps between primes, and the distribution of primes in arithmetic progressions.</p>

<h3>Automorphic Forms and the Langlands Program</h3>

<p>The Weil bound on Kloosterman sums generalizes to the Ramanujan-Petersson conjecture for automorphic forms. Deligne's proof (1974) of the Weil conjectures, which implies the Ramanujan conjecture for holomorphic modular forms, is the ultimate expression of "square-root cancellation" in algebraic geometry. The Langlands program seeks to extend these ideas to all automorphic \\(L\\)-functions, a vision where exponential sum bounds become consequences of deep structural properties of algebraic groups.</p>

<div class="env-block remark">
    <div class="env-title">The Road Ahead</div>
    <div class="env-body">
        <p>The study of exponential sums remains intensely active. Highlights from recent decades include:</p>
        <ul>
            <li>The Bourgain-Demeter-Guth proof of the Vinogradov main conjecture (2016).</li>
            <li>Polymath 8: Maynard's and Tao's use of exponential sum machinery in proving bounded gaps between primes.</li>
            <li>The "delta method" of Duke-Friedlander-Iwaniec, combining Kloosterman sum bounds with the spectral theory of automorphic forms.</li>
        </ul>
        <p>Every improvement in exponential sum bounds has downstream consequences throughout number theory. The subject is far from closed.</p>
    </div>
</div>
`,
            visualizations: [],
            exercises: [
                {
                    question: 'Explain the analogy between the Weil bound \\(|K(a,b;p)| \\leq 2\\sqrt{p}\\) and the Riemann Hypothesis for the Riemann zeta function.',
                    hint: 'Both are statements about the location of "eigenvalues." For Kloosterman sums, the eigenvalues of Frobenius have absolute value \\(\\sqrt{p}\\). For \\(\\zeta(s)\\), the Riemann Hypothesis places zeros on \\(\\Re(s) = 1/2\\).',
                    solution: 'The Weil bound follows from the "Riemann hypothesis for curves over \\(\\mathbb{F}_p\\)": the eigenvalues of Frobenius on the relevant cohomology have absolute value \\(\\sqrt{p}\\). For the Riemann zeta function, RH asserts that all non-trivial zeros lie on \\(\\Re(s) = 1/2\\), which implies optimal cancellation in \\(\\sum \\Lambda(n) n^{-s}\\). Both are instances of a single paradigm: zeros/eigenvalues of an associated \\(L\\)-function lie on a critical line/circle, and this is equivalent to optimal square-root cancellation in the corresponding exponential (or character) sum.'
                }
            ]
        }
    ]
});
