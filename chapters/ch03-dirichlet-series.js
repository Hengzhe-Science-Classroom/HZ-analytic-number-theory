window.CHAPTERS = window.CHAPTERS || [];
window.CHAPTERS.push({
    id: 'ch03',
    number: 3,
    title: 'Dirichlet Series & Euler Products',
    subtitle: 'Encoding arithmetic in the language of analysis',
    sections: [

        // ================================================================
        // SECTION 1: Encoding Arithmetic in Analysis
        // ================================================================
        {
            id: 'sec-motivation',
            title: 'Encoding Arithmetic in Analysis',
            content: `
<h2>Encoding Arithmetic in Analysis</h2>

<div class="env-block intuition">
    <div class="env-title">The Central Idea</div>
    <div class="env-body">
        <p>Suppose you want to study a sequence of numbers \\(a(1), a(2), a(3), \\ldots\\) that encodes arithmetic information&mdash;say, \\(a(n) = 1\\) for all \\(n\\) (counting divisors), or \\(a(n) = \\Lambda(n)\\) (von Mangoldt), or \\(a(n) = \\mu(n)\\) (Mobius). How do you bring the tools of <em>analysis</em> to bear on purely <em>multiplicative</em> structure?</p>
        <p>The answer: package the whole sequence into a single function of a complex variable \\(s\\), via the <strong>Dirichlet series</strong>
        \\[F(s) = \\sum_{n=1}^{\\infty} \\frac{a(n)}{n^s}.\\]
        Now analytic properties of \\(F\\) (poles, zeros, growth) become statements about the arithmetic of \\(a\\).</p>
    </div>
</div>

<h3>Why \\(n^{-s}\\) and Not Something Else?</h3>

<p>The choice of weight \\(n^{-s}\\) is not arbitrary. Write \\(n^{-s} = e^{-s \\log n}\\). Then the "frequency" of the \\(n\\)-th term is \\(\\log n\\), the natural scale for multiplicative arithmetic (since \\(\\log nm = \\log n + \\log m\\)). Dirichlet series are the "Fourier series on the multiplicative group of positive integers."</p>

<p>More precisely: if we set \\(x = e^{-u}\\) so that \\(n^{-s} = e^{-su\\log n} \\cdot \\ldots\\), we get a Laplace-type transform on the additive structure of \\(\\log n\\). This is the deep reason that the theory of Dirichlet series interacts so naturally with contour integration.</p>

<h3>Three Motivating Examples</h3>

<div class="env-block example">
    <div class="env-title">Example 3.1 (Riemann Zeta Function)</div>
    <div class="env-body">
        <p>Take \\(a(n) = 1\\) for all \\(n\\):</p>
        \\[\\zeta(s) = \\sum_{n=1}^{\\infty} \\frac{1}{n^s}, \\qquad \\operatorname{Re}(s) > 1.\\]
        <p>This encodes the most basic arithmetic object: the density of all positive integers. Its analytic continuation and zeros govern the distribution of primes.</p>
    </div>
</div>

<div class="env-block example">
    <div class="env-title">Example 3.2 (Mobius Function)</div>
    <div class="env-body">
        <p>Take \\(a(n) = \\mu(n)\\):</p>
        \\[\\frac{1}{\\zeta(s)} = \\sum_{n=1}^{\\infty} \\frac{\\mu(n)}{n^s}, \\qquad \\operatorname{Re}(s) > 1.\\]
        <p>The identity \\(\\zeta(s) \\cdot (1/\\zeta(s)) = 1\\) is the analytic expression of \\(\\sum_{d|n} \\mu(d) = [n=1]\\).</p>
    </div>
</div>

<div class="env-block example">
    <div class="env-title">Example 3.3 (Von Mangoldt Function)</div>
    <div class="env-body">
        <p>Take \\(a(n) = \\Lambda(n)\\) (equaling \\(\\log p\\) if \\(n=p^k\\), else 0):</p>
        \\[-\\frac{\\zeta'(s)}{\\zeta(s)} = \\sum_{n=1}^{\\infty} \\frac{\\Lambda(n)}{n^s}, \\qquad \\operatorname{Re}(s) > 1.\\]
        <p>The poles and zeros of \\(\\zeta(s)\\) directly control the sum of \\(\\Lambda(n)\\) over \\(n \\le x\\), which is the prime-counting function \\(\\psi(x)\\).</p>
    </div>
</div>

<h3>The Program of This Chapter</h3>

<p>We will:</p>
<ol>
    <li>Establish when a Dirichlet series converges (absolutely, conditionally, uniformly).</li>
    <li>Prove the Euler product identity, connecting Dirichlet series to primes.</li>
    <li>Develop algebraic properties: multiplication = Dirichlet convolution.</li>
    <li>Prove the uniqueness theorem: the series determines \\(a(n)\\) completely.</li>
    <li>Bridge to \\(\\zeta(s)\\) and Chapter 4.</li>
</ol>

<div class="viz-placeholder" data-viz="viz-series-comparison"></div>
`,
            visualizations: [
                {
                    id: 'viz-series-comparison',
                    title: 'Three Dirichlet Series: Convergence Compared',
                    description: 'Compare partial sums of zeta(s), L(s,chi_4), and |a(n)| = 1/n^sigma for real s. Drag the sigma slider to see how the abscissa of convergence differs.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, { width: 620, height: 340, originX: 70, originY: 300, scale: 1 });
                        var sigma = 1.5;
                        VizEngine.createSlider(controls, '\u03c3', 0.5, 3.0, sigma, 0.05, function(v) { sigma = v; draw(); });

                        // chi_4: 1,-1,0,1,-1,0,...  (primitive character mod 4)
                        function chi4(n) {
                            var r = ((n % 4) + 4) % 4;
                            if (r === 1) return 1;
                            if (r === 3) return -1;
                            return 0;
                        }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var N = 120;
                            var w = viz.width, h = viz.height;

                            // Chart area
                            var left = 70, right = w - 20, top = 20, bottom = 300;
                            var chartW = right - left, chartH = bottom - top;

                            // Compute partial sums
                            var zetaSums = [], lSums = [], negDivSums = [];
                            var zs = 0, ls = 0;
                            for (var n = 1; n <= N; n++) {
                                zs += Math.pow(n, -sigma);
                                ls += chi4(n) * Math.pow(n, -sigma);
                                zetaSums.push(zs);
                                lSums.push(ls);
                            }

                            // Y scale: find max
                            var maxVal = Math.max(zetaSums[N-1], Math.abs(lSums[0]));
                            maxVal = Math.max(maxVal, 2);
                            // auto-range
                            var yRange = maxVal * 1.1;
                            if (sigma <= 1.05) yRange = Math.min(yRange, 30);

                            function sx(i) { return left + (i / N) * chartW; }
                            function sy(v) { return bottom - (v / yRange) * chartH; }

                            // Grid
                            ctx.strokeStyle = viz.colors.grid; ctx.lineWidth = 0.5;
                            for (var g = 0; g <= 5; g++) {
                                var gv = (g / 5) * yRange;
                                var gy = sy(gv);
                                ctx.beginPath(); ctx.moveTo(left, gy); ctx.lineTo(right, gy); ctx.stroke();
                                ctx.fillStyle = viz.colors.text; ctx.font = '10px sans-serif';
                                ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
                                ctx.fillText(gv.toFixed(1), left - 4, gy);
                            }

                            // X axis labels
                            ctx.fillStyle = viz.colors.text; ctx.font = '10px sans-serif';
                            ctx.textAlign = 'center'; ctx.textBaseline = 'top';
                            [1, 20, 40, 60, 80, 100, 120].forEach(function(n) {
                                ctx.fillText(n, sx(n), bottom + 4);
                            });

                            // Draw zeta partial sums
                            ctx.strokeStyle = viz.colors.blue; ctx.lineWidth = 2;
                            ctx.beginPath();
                            for (var i = 0; i < N; i++) {
                                var px = sx(i+1), py = sy(Math.min(zetaSums[i], yRange));
                                if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
                            }
                            ctx.stroke();

                            // Draw L(s,chi_4) partial sums (abs value for comparison)
                            ctx.strokeStyle = viz.colors.orange; ctx.lineWidth = 2;
                            ctx.beginPath();
                            var started = false;
                            for (var i = 0; i < N; i++) {
                                var v = lSums[i];
                                var px = sx(i+1), py = sy(Math.min(Math.abs(v), yRange));
                                if (!started) { ctx.moveTo(px, py); started = true; } else ctx.lineTo(px, py);
                            }
                            ctx.stroke();

                            // Baseline
                            ctx.strokeStyle = viz.colors.axis; ctx.lineWidth = 1;
                            ctx.beginPath(); ctx.moveTo(left, bottom); ctx.lineTo(right, bottom); ctx.stroke();
                            ctx.beginPath(); ctx.moveTo(left, top); ctx.lineTo(left, bottom); ctx.stroke();

                            // Legend
                            var lx = left + 20, ly = top + 10;
                            ctx.font = '12px sans-serif'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
                            ctx.fillStyle = viz.colors.blue;
                            ctx.fillRect(lx, ly, 18, 3);
                            ctx.fillText('\u03b6(s) = \u03a3 n\u207b\u03c3', lx + 24, ly + 1);
                            ctx.fillStyle = viz.colors.orange;
                            ctx.fillRect(lx, ly + 20, 18, 3);
                            ctx.fillText('|L(s,\u03c7\u2084)| partial sums', lx + 24, ly + 21);

                            // Convergence status
                            var zetaConverges = sigma > 1;
                            var lConverges = sigma > 0;
                            ctx.font = '11px sans-serif'; ctx.textAlign = 'right'; ctx.textBaseline = 'top';
                            ctx.fillStyle = zetaConverges ? viz.colors.green : viz.colors.red;
                            ctx.fillText('\u03b6(s): \u03c3_c = 1, ' + (zetaConverges ? 'converges' : 'diverges'), right - 4, top + 4);
                            ctx.fillStyle = lConverges ? viz.colors.green : viz.colors.red;
                            ctx.fillText('L(s,\u03c7\u2084): \u03c3_c = 0, ' + (lConverges ? 'converges' : 'diverges'), right - 4, top + 20);

                            viz.screenText('\u03c3 = ' + sigma.toFixed(2), w / 2, bottom + 22, viz.colors.white, 13);
                            viz.screenText('Partial sums S_N = \u03a3_{n=1}^{N} a(n)n\u207b\u03c3,  N up to 120', w / 2, top - 8, viz.colors.text, 11);
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Explain in your own words why the weight \\(n^{-s}\\) is natural for multiplicative arithmetic. What algebraic property of \\(\\log n\\) is key?',
                    hint: 'Think about what happens to \\(\\log(nm)\\) versus \\(\\log n + \\log m\\).',
                    solution: 'Since \\(\\log(nm) = \\log n + \\log m\\), the logarithm converts multiplication into addition. Writing \\(n^{-s} = e^{-s \\log n}\\), the Dirichlet series becomes a Laplace transform on the additive semigroup \\((\\mathbb{Z}_{>0}, \\times)\\) via the isomorphism \\(n \\mapsto \\log n\\). This is why Euler products factor over primes: primes are the "generators" of the multiplicative semigroup, and \\(\\log p\\) are the corresponding "frequencies."'
                },
                {
                    question: 'Write the Dirichlet series for \\(a(n) = d(n)\\) (number of divisors). What well-known function does it equal?',
                    hint: 'Use the multiplicativity of \\(d\\) and the Euler product. What is \\(\\sum_{k=0}^{\\infty} (k+1)p^{-ks}\\)?',
                    solution: '\\(\\sum_{n=1}^{\\infty} d(n)/n^s = \\zeta(s)^2\\) for \\(\\operatorname{Re}(s) > 1\\). This follows from the Dirichlet convolution identity \\(d = \\mathbf{1} * \\mathbf{1}\\) and the multiplication theorem for Dirichlet series proved in Section 4.'
                }
            ]
        },

        // ================================================================
        // SECTION 2: Convergence
        // ================================================================
        {
            id: 'sec-convergence',
            title: 'Convergence',
            content: `
<h2>Convergence of Dirichlet Series</h2>

<p>A Dirichlet series \\(F(s) = \\sum_{n=1}^{\\infty} a(n)n^{-s}\\) may converge for some values of \\(s \\in \\mathbb{C}\\) and diverge for others. The remarkable structure here is that the region of convergence is always a <em>right half-plane</em>.</p>

<h3>The Abscissas of Convergence</h3>

<div class="env-block definition">
    <div class="env-title">Definition 3.1 (Abscissa of Convergence)</div>
    <div class="env-body">
        <p>The <strong>abscissa of convergence</strong> \\(\\sigma_c\\) of \\(\\sum a(n)n^{-s}\\) is the infimum of all \\(\\sigma_0 \\in \\mathbb{R}\\) such that the series converges for every \\(s\\) with \\(\\operatorname{Re}(s) > \\sigma_0\\). The series converges in the half-plane \\(\\{s : \\operatorname{Re}(s) > \\sigma_c\\}\\) and diverges for \\(\\operatorname{Re}(s) < \\sigma_c\\).</p>
        <p>The <strong>abscissa of absolute convergence</strong> \\(\\sigma_a\\) is defined similarly with absolute convergence. One always has \\(\\sigma_c \\le \\sigma_a \\le \\sigma_c + 1\\).</p>
    </div>
</div>

<h3>The Half-Plane Theorem</h3>

<div class="env-block theorem">
    <div class="env-title">Theorem 3.1 (Half-Plane of Convergence)</div>
    <div class="env-body">
        <p>If \\(\\sum a(n)n^{-s_0}\\) converges at \\(s_0 = \\sigma_0 + it_0\\), then it converges for every \\(s\\) with \\(\\operatorname{Re}(s) > \\sigma_0\\). Moreover, the convergence is uniform on every sector \\(|\\arg(s - s_0)| \\le \\theta < \\pi/2\\).</p>
    </div>
</div>

<div class="env-block proof">
    <div class="env-title">Proof Sketch</div>
    <div class="env-body">
        <p>Write \\(n^{-s} = n^{-s_0} \\cdot n^{-(s-s_0)}\\). Let \\(A(x) = \\sum_{n \\le x} a(n)n^{-s_0}\\) (partial sums, bounded by hypothesis). Abel summation gives</p>
        \\[\\sum_{n=M}^{N} a(n)n^{-s} = A(N)\\cdot N^{-(s-s_0)} - A(M-1)\\cdot M^{-(s-s_0)} + (s-s_0)\\int_M^N A(x)x^{-(s-s_0)-1}\\,dx.\\]
        <p>Since \\(A(x)\\) is bounded and \\(\\operatorname{Re}(s-s_0) > 0\\), each term \\(\\to 0\\) as \\(M, N \\to \\infty\\), giving the Cauchy criterion. Uniformity on sectors follows from bounding \\(|s-s_0|/\\operatorname{Re}(s-s_0) \\le 1/\\cos\\theta\\). \\(\\square\\)</p>
    </div>
</div>

<h3>Computing \\(\\sigma_c\\) and \\(\\sigma_a\\)</h3>

<p>Let \\(A(x) = \\sum_{n \\le x} a(n)\\). Then:</p>
\\[\\sigma_a = \\limsup_{n \\to \\infty} \\frac{\\log |a(n)|}{\\log n}, \\qquad \\sigma_c = \\limsup_{x \\to \\infty} \\frac{\\log |A(x)|}{\\log x}.\\]

<div class="env-block example">
    <div class="env-title">Example 3.4 (Standard Cases)</div>
    <div class="env-body">
        <ul>
            <li>\\(\\zeta(s)\\): \\(a(n) = 1\\), \\(A(x) \\sim x\\), so \\(\\sigma_c = \\sigma_a = 1\\).</li>
            <li>\\(L(s, \\chi)\\) for a non-principal character \\(\\chi\\): \\(A(x) = O(1)\\) (partial sums are bounded), so \\(\\sigma_c = 0\\), but \\(\\sigma_a = 1\\) since \\(|\\chi(n)| \\le 1\\).</li>
            <li>\\(\\sum \\mu(n)/n^s = 1/\\zeta(s)\\): \\(\\sigma_c = 1/2\\) is equivalent to the Riemann Hypothesis (since \\(\\sum_{n \\le x}\\mu(n) = O(x^{1/2+\\varepsilon})\\) iff RH holds). Unconditionally, \\(\\sigma_c \\le 1\\).</li>
        </ul>
    </div>
</div>

<h3>Analytic Properties</h3>

<div class="env-block theorem">
    <div class="env-title">Theorem 3.2 (Analyticity)</div>
    <div class="env-body">
        <p>In the half-plane of absolute convergence \\(\\operatorname{Re}(s) > \\sigma_a\\), the function \\(F(s) = \\sum a(n)n^{-s}\\) is holomorphic, and its derivatives may be computed term by term:</p>
        \\[F^{(k)}(s) = \\sum_{n=1}^{\\infty} a(n) \\cdot \\frac{(-\\log n)^k}{n^s}.\\]
        <p>In particular, \\(-F'(s)/F(s)\\) encodes the "log-derivative" structure crucial for prime counting.</p>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-convergence-halfplane"></div>
<div class="viz-placeholder" data-viz="viz-abscissa-wall"></div>
`,
            visualizations: [
                {
                    id: 'viz-convergence-halfplane',
                    title: 'Convergence Half-Plane in the Complex s-Plane',
                    description: 'The s-plane, with sigma = Re(s) on the horizontal axis and t = Im(s) vertical. The convergence region (sigma > sigma_c) is shaded green, divergence region red. Choose a series type to see how sigma_c changes.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, { width: 560, height: 420, originX: 220, originY: 210, scale: 70 });
                        var seriesType = 'zeta';

                        // Series selector
                        var sel = document.createElement('select');
                        sel.style.cssText = 'background:#1a1a40;color:#c9d1d9;border:1px solid #30363d;border-radius:4px;padding:4px 8px;font-size:0.82rem;margin-right:8px;';
                        [['zeta', '\u03b6(s): \u03c3_c = 1'],
                         ['chi4', 'L(s,\u03c7\u2084): \u03c3_c = 0'],
                         ['mu_rh', '\u03a3\u03bc(n)/n^s: \u03c3_c = 1/2 (assume RH)'],
                         ['ramanujan', '\u03a3\u03c4(n)/n^s: \u03c3_c = 13/2']].forEach(function(opt) {
                            var o = document.createElement('option'); o.value = opt[0]; o.textContent = opt[1];
                            sel.appendChild(o);
                        });
                        sel.addEventListener('change', function() { seriesType = sel.value; draw(); });
                        controls.appendChild(sel);

                        function sigmaCForType(t) {
                            if (t === 'zeta') return 1;
                            if (t === 'chi4') return 0;
                            if (t === 'mu_rh') return 0.5;
                            if (t === 'ramanujan') return 6.5;
                            return 1;
                        }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var sc = sigmaCForType(seriesType);
                            var w = viz.width, h = viz.height;

                            // Shade convergence region (sigma > sc)
                            var [scSx] = viz.toScreen(sc, 0);
                            // Green: right of sigma_c
                            ctx.fillStyle = viz.colors.green + '28';
                            ctx.fillRect(scSx, 0, w - scSx, h);
                            // Red: left of sigma_c
                            ctx.fillStyle = viz.colors.red + '28';
                            ctx.fillRect(0, 0, scSx, h);

                            // Grid
                            viz.drawGrid(1);
                            viz.drawAxes();

                            // Critical line (abscissa of convergence)
                            ctx.strokeStyle = viz.colors.yellow; ctx.lineWidth = 2.5; ctx.setLineDash([8, 4]);
                            ctx.beginPath(); ctx.moveTo(scSx, 0); ctx.lineTo(scSx, h); ctx.stroke();
                            ctx.setLineDash([]);

                            // Labels
                            ctx.fillStyle = viz.colors.yellow; ctx.font = 'bold 13px sans-serif';
                            ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
                            ctx.fillText('\u03c3_c = ' + (sc % 1 === 0 ? sc : sc.toFixed(1)), scSx, h - 8);

                            ctx.fillStyle = viz.colors.green + 'cc'; ctx.font = '12px sans-serif';
                            ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                            ctx.fillText('Convergence', Math.min(w - 60, scSx + (w - scSx) / 2), h / 2);
                            ctx.fillStyle = viz.colors.red + 'cc';
                            ctx.fillText('Divergence', Math.max(60, scSx / 2), h / 2);

                            // Axis labels
                            ctx.fillStyle = viz.colors.text; ctx.font = '12px sans-serif';
                            ctx.textAlign = 'right'; ctx.textBaseline = 'top';
                            ctx.fillText('\u03c3 = Re(s)', w - 4, viz.originY + 4);
                            ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
                            ctx.fillText('it = Im(s)', viz.originX + 4, 12);

                            // Mark s=2 as example point in convergence region (if sc < 2)
                            if (sc < 2) {
                                viz.drawPoint(2, 0, viz.colors.blue, 's = 2', 6);
                            }
                            // Mark s = sc - 0.5 in divergence region if well-defined
                            if (sc > -2.5) {
                                viz.drawPoint(sc - 0.5, 0, viz.colors.red, '', 5);
                            }

                            // Title
                            viz.screenText('Convergence Half-Plane for ' + sel.options[sel.selectedIndex].text, w/2, 10, viz.colors.white, 12);
                        }
                        draw();
                        return viz;
                    }
                },
                {
                    id: 'viz-abscissa-wall',
                    title: 'The Abscissa Wall',
                    description: 'Animated visualization of the "wall" at sigma_c. Terms on the right side (sigma > sigma_c) decay; on the left they can grow. Watch the wall slide as you change sigma_c.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, { width: 560, height: 320, originX: 60, originY: 160, scale: 1 });
                        var sigmaC = 1.0;
                        var sigmaProbe = 1.5;

                        VizEngine.createSlider(controls, '\u03c3_c (wall)', 0, 2, sigmaC, 0.1, function(v) { sigmaC = v; draw(); });
                        VizEngine.createSlider(controls, '\u03c3 (probe)', -0.5, 3, sigmaProbe, 0.1, function(v) { sigmaProbe = v; draw(); });

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var w = viz.width, h = viz.height;

                            // Show N terms a(n)/n^sigma, bar heights
                            var N = 30;
                            var barW = (w - 100) / N;
                            var left = 60, bottom = 280, top = 30;
                            var chartH = bottom - top;

                            // Compute partial sums and term sizes
                            var terms = [];
                            for (var n = 1; n <= N; n++) {
                                // a(n) = 1 for zeta-like series
                                terms.push(Math.pow(n, -sigmaProbe));
                            }
                            var maxTerm = Math.max.apply(null, terms.map(Math.abs));
                            if (maxTerm < 0.01) maxTerm = 0.01;
                            // Cap display
                            var dispMax = Math.min(maxTerm, 5);

                            var converges = sigmaProbe > sigmaC;

                            // Background shade
                            ctx.fillStyle = (converges ? viz.colors.green : viz.colors.red) + '18';
                            ctx.fillRect(left, top, w - left - 10, bottom - top);

                            // Axis
                            ctx.strokeStyle = viz.colors.axis; ctx.lineWidth = 1;
                            ctx.beginPath(); ctx.moveTo(left, bottom); ctx.lineTo(w - 10, bottom); ctx.stroke();
                            ctx.beginPath(); ctx.moveTo(left, top); ctx.lineTo(left, bottom); ctx.stroke();

                            // Y gridlines
                            ctx.strokeStyle = viz.colors.grid; ctx.lineWidth = 0.5;
                            for (var g = 1; g <= 5; g++) {
                                var gv = (g / 5) * dispMax;
                                var gy = bottom - (Math.min(gv, dispMax) / dispMax) * chartH;
                                ctx.beginPath(); ctx.moveTo(left, gy); ctx.lineTo(w - 10, gy); ctx.stroke();
                                ctx.fillStyle = viz.colors.text; ctx.font = '9px sans-serif';
                                ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
                                ctx.fillText(gv.toFixed(2), left - 3, gy);
                            }

                            // Bars
                            for (var i = 0; i < N; i++) {
                                var bx = left + i * barW;
                                var bv = Math.min(terms[i], dispMax);
                                var bh = (bv / dispMax) * chartH;
                                var color = terms[i] <= terms[0] * 1.01 || converges ? viz.colors.blue : viz.colors.orange;
                                ctx.fillStyle = color + '99';
                                ctx.fillRect(bx + 1, bottom - bh, barW - 2, bh);
                                ctx.strokeStyle = color; ctx.lineWidth = 0.5;
                                ctx.strokeRect(bx + 1, bottom - bh, barW - 2, bh);
                                // n label every 5
                                if ((i + 1) % 5 === 0 || i === 0) {
                                    ctx.fillStyle = viz.colors.text; ctx.font = '9px sans-serif';
                                    ctx.textAlign = 'center'; ctx.textBaseline = 'top';
                                    ctx.fillText(i + 1, bx + barW / 2, bottom + 3);
                                }
                            }

                            // Status
                            ctx.font = 'bold 13px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                            ctx.fillStyle = converges ? viz.colors.green : viz.colors.red;
                            ctx.fillText(
                                '\u03c3 = ' + sigmaProbe.toFixed(1) + (sigmaProbe > sigmaC ? ' > \u03c3_c: CONVERGES' : ' \u2264 \u03c3_c: DIVERGES (terms don\'t \u2192 0 fast enough)'),
                                w / 2, top + 12
                            );

                            ctx.fillStyle = viz.colors.yellow; ctx.font = '11px sans-serif';
                            ctx.fillText('Terms a(n)/n^\u03c3 = 1/n^' + sigmaProbe.toFixed(1) + ',  \u03c3_c = ' + sigmaC.toFixed(1), w/2, bottom + 22);
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Prove that \\(\\sigma_a - \\sigma_c \\le 1\\) for any Dirichlet series \\(\\sum a(n)n^{-s}\\).',
                    hint: 'Suppose the series converges conditionally at \\(s_0\\). Use Abel summation to show absolute convergence at \\(s_0 + 1 + \\varepsilon\\).',
                    solution: 'If \\(\\sum a(n)n^{-s_0}\\) converges, partial sums \\(A_N = \\sum_{n=1}^N a(n)n^{-s_0}\\) are bounded, say \\(|A_N| \\le M\\). By Abel summation, \\(\\sum_{n=M}^N |a(n)n^{-s}| \\le 2M \\cdot N^{-(\\sigma - \\sigma_0)} + |\\sigma - \\sigma_0| \\int_M^N M x^{-(\\sigma-\\sigma_0)-1}\\,dx \\to 0\\) provided \\(\\sigma > \\sigma_0 + 1\\). Thus absolute convergence holds for \\(\\operatorname{Re}(s) > \\sigma_c + 1\\), giving \\(\\sigma_a \\le \\sigma_c + 1\\).'
                },
                {
                    question: 'Find \\(\\sigma_c\\) and \\(\\sigma_a\\) for the Dirichlet series with \\(a(n) = (-1)^{n-1}\\).',
                    hint: 'What is the partial sum \\(A(x) = \\sum_{n \\le x} (-1)^{n-1}\\)? This is related to the Dirichlet eta function.',
                    solution: '\\(A(x) \\in \\{0, 1\\}\\) (bounded), so \\(\\sigma_c = 0\\). Since \\(|a(n)| = 1\\), we have \\(\\sigma_a = 1\\). The series equals the eta function \\(\\eta(s) = (1 - 2^{1-s})\\zeta(s)\\), which converges conditionally for \\(\\operatorname{Re}(s) > 0\\) and absolutely for \\(\\operatorname{Re}(s) > 1\\).'
                }
            ]
        },

        // ================================================================
        // SECTION 3: Euler Products
        // ================================================================
        {
            id: 'sec-euler-product',
            title: 'Euler Products',
            content: `
<h2>Euler Products</h2>

<p>One of the most profound identities in mathematics connects a sum over all positive integers to a product over primes.</p>

<div class="env-block theorem">
    <div class="env-title">Theorem 3.3 (Euler Product)</div>
    <div class="env-body">
        <p>Let \\(f\\) be a completely multiplicative arithmetic function with \\(\\sum_{n=1}^{\\infty} |f(n)| < \\infty\\). Then</p>
        \\[\\sum_{n=1}^{\\infty} f(n) = \\prod_{p \\text{ prime}} \\frac{1}{1 - f(p)},\\]
        <p>where the product converges absolutely. In particular, for \\(\\operatorname{Re}(s) > 1\\):</p>
        \\[\\zeta(s) = \\sum_{n=1}^{\\infty} \\frac{1}{n^s} = \\prod_{p} \\frac{1}{1 - p^{-s}}.\\]
    </div>
</div>

<div class="env-block proof">
    <div class="env-title">Proof</div>
    <div class="env-body">
        <p>For \\(\\operatorname{Re}(s) > 1\\), each geometric series converges:
        \\[\\frac{1}{1 - p^{-s}} = \\sum_{k=0}^{\\infty} p^{-ks}.\\]
        Multiply finitely many such series over primes \\(p \\le P\\):
        \\[\\prod_{p \\le P} \\frac{1}{1-p^{-s}} = \\prod_{p \\le P} \\sum_{k=0}^{\\infty} p^{-ks} = \\sum_{\\substack{n=1 \\\\ p|n \\Rightarrow p \\le P}}^{\\infty} \\frac{1}{n^s},\\]
        by unique factorization. The right side omits only integers with a prime factor \\(> P\\, \\), so</p>
        \\[\\left| \\zeta(s) - \\prod_{p \\le P} \\frac{1}{1-p^{-s}} \\right| \\le \\sum_{n > P} n^{-\\sigma} \\to 0 \\quad (P \\to \\infty),\\]
        <p>since \\(\\sum n^{-\\sigma}\\) converges for \\(\\sigma > 1\\). \\(\\square\\)</p>
    </div>
</div>

<h3>Euler Products and Multiplicativity</h3>

<div class="env-block theorem">
    <div class="env-title">Theorem 3.4 (Euler Product for Multiplicative Functions)</div>
    <div class="env-body">
        <p>Let \\(f\\) be multiplicative and \\(\\sum |f(n)| n^{-\\sigma} < \\infty\\). Then</p>
        \\[\\sum_{n=1}^{\\infty} \\frac{f(n)}{n^s} = \\prod_{p} \\left( \\sum_{k=0}^{\\infty} \\frac{f(p^k)}{p^{ks}} \\right).\\]
        <p>If \\(f\\) is completely multiplicative, \\(f(p^k) = f(p)^k\\), and each local factor is \\((1 - f(p)p^{-s})^{-1}\\).</p>
    </div>
</div>

<h3>Infinitely Many Primes (Again)</h3>

<div class="env-block example">
    <div class="env-title">Example 3.5 (A New Proof of Infinitely Many Primes)</div>
    <div class="env-body">
        <p>If there were finitely many primes, the product \\(\\prod_p (1-p^{-1})^{-1}\\) would be a finite number. But \\(\\sum_{n=1}^{\\infty} 1/n = \\infty\\) (harmonic series diverges), and \\(\\zeta(1) = \\prod_p (1-p^{-1})^{-1}\\). Contradiction. Therefore there are infinitely many primes.</p>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-euler-product-assembly"></div>
`,
            visualizations: [
                {
                    id: 'viz-euler-product-assembly',
                    title: 'Euler Product Assembly',
                    description: 'Multiply factors (1 - p^{-s})^{-1} one prime at a time, for real s > 1. Watch the partial product converge to zeta(s). The bar chart tracks the ratio (partial product / zeta(s)).',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, { width: 600, height: 360, originX: 60, originY: 300, scale: 1 });
                        var sigma = 2.0;
                        var nPrimes = 10;

                        VizEngine.createSlider(controls, '\u03c3 (real s)', 1.1, 4.0, sigma, 0.1, function(v) { sigma = v; draw(); });
                        VizEngine.createSlider(controls, '# primes', 1, 20, nPrimes, 1, function(v) { nPrimes = Math.round(v); draw(); });

                        var PRIMES = VizEngine.sievePrimes(80);

                        // Compute zeta(sigma) by partial sum (300 terms)
                        function zetaApprox(sig, N) {
                            var s = 0;
                            for (var n = 1; n <= N; n++) s += Math.pow(n, -sig);
                            return s;
                        }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var w = viz.width, h = viz.height;
                            var left = 60, bottom = 280, top = 30;
                            var chartH = bottom - top;

                            var zetaVal = zetaApprox(sigma, 500);

                            // Compute partial products
                            var products = [];
                            var prod = 1;
                            for (var i = 0; i < Math.min(nPrimes, PRIMES.length); i++) {
                                prod *= 1 / (1 - Math.pow(PRIMES[i], -sigma));
                                products.push(prod);
                            }

                            var maxProd = Math.max(products[products.length - 1], zetaVal) * 1.05;
                            var barW = Math.min(30, (w - left - 20) / (products.length + 1));
                            var gap = 4;

                            function barH(v) { return (v / maxProd) * chartH; }

                            // zeta line
                            var zetaY = bottom - barH(zetaVal);
                            ctx.strokeStyle = viz.colors.yellow; ctx.lineWidth = 1.5; ctx.setLineDash([6, 4]);
                            ctx.beginPath(); ctx.moveTo(left, zetaY); ctx.lineTo(w - 10, zetaY); ctx.stroke();
                            ctx.setLineDash([]);
                            ctx.fillStyle = viz.colors.yellow; ctx.font = '11px sans-serif'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
                            ctx.fillText('\u03b6(' + sigma.toFixed(1) + ') \u2248 ' + zetaVal.toFixed(4), left + 4, zetaY - 8);

                            // Axes
                            ctx.strokeStyle = viz.colors.axis; ctx.lineWidth = 1;
                            ctx.beginPath(); ctx.moveTo(left, bottom); ctx.lineTo(w - 10, bottom); ctx.stroke();
                            ctx.beginPath(); ctx.moveTo(left, top); ctx.lineTo(left, bottom); ctx.stroke();

                            // Y gridlines
                            ctx.strokeStyle = viz.colors.grid; ctx.lineWidth = 0.5;
                            for (var g = 1; g <= 5; g++) {
                                var gv = (g / 5) * maxProd;
                                var gy = bottom - barH(gv);
                                ctx.beginPath(); ctx.moveTo(left, gy); ctx.lineTo(w - 10, gy); ctx.stroke();
                                ctx.fillStyle = viz.colors.text; ctx.font = '9px sans-serif';
                                ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
                                ctx.fillText(gv.toFixed(2), left - 3, gy);
                            }

                            // Bars: partial products
                            for (var i = 0; i < products.length; i++) {
                                var bx = left + i * (barW + gap);
                                var bv = products[i];
                                var bh2 = barH(bv);
                                // Color by ratio to zeta
                                var ratio = bv / zetaVal;
                                var green = Math.floor(Math.min(ratio, 1) * 200);
                                ctx.fillStyle = 'rgba(63,' + green + ',160,0.75)';
                                ctx.fillRect(bx, bottom - bh2, barW, bh2);
                                ctx.strokeStyle = viz.colors.purple; ctx.lineWidth = 0.8;
                                ctx.strokeRect(bx, bottom - bh2, barW, bh2);
                                // Prime label
                                ctx.fillStyle = viz.colors.text; ctx.font = '10px sans-serif';
                                ctx.textAlign = 'center'; ctx.textBaseline = 'top';
                                ctx.fillText('p' + (i+1) + '=' + PRIMES[i], bx + barW / 2, bottom + 3);
                                // Ratio label on bar
                                if (barW >= 18) {
                                    ctx.fillStyle = viz.colors.white; ctx.font = '9px sans-serif';
                                    ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
                                    ctx.fillText((ratio * 100).toFixed(0) + '%', bx + barW / 2, bottom - bh2 - 1);
                                }
                            }

                            // Final ratio text
                            if (products.length > 0) {
                                var finalRatio = products[products.length - 1] / zetaVal;
                                ctx.font = 'bold 13px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                                ctx.fillStyle = viz.colors.white;
                                ctx.fillText(
                                    '\u220f_{p \u2264 ' + PRIMES[products.length - 1] + '} (1-p^{-' + sigma.toFixed(1) + '})^{-1} = ' + products[products.length-1].toFixed(4) + '  (' + (finalRatio * 100).toFixed(1) + '% of \u03b6)',
                                    w / 2, top + 12
                                );
                            }
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Prove that \\(\\zeta(s)\\) has no zeros in the half-plane \\(\\operatorname{Re}(s) > 1\\) using the Euler product.',
                    hint: 'Show that \\(1/\\zeta(s) = \\prod_p (1 - p^{-s})\\) converges absolutely for \\(\\operatorname{Re}(s) > 1\\). A convergent product of factors that do not vanish is itself non-zero.',
                    solution: 'For \\(\\sigma > 1\\), we have \\(\\sum_p p^{-\\sigma} \\le \\sum_n n^{-\\sigma} < \\infty\\), so \\(\\prod_p (1 - p^{-s})\\) converges absolutely (since \\(\\sum_p |p^{-s}| \\le \\sum_p p^{-\\sigma} < \\infty\\)). Each factor \\(|1 - p^{-s}| \\ge 1 - p^{-\\sigma} > 0\\). An absolutely convergent product of non-zero factors is non-zero, so \\(1/\\zeta(s) \\ne 0\\), meaning \\(\\zeta(s) \\ne 0\\) for \\(\\sigma > 1\\).'
                },
                {
                    question: 'Use the Euler product to derive \\(\\zeta(s)^2 = \\sum_{n=1}^{\\infty} d(n)/n^s\\), where \\(d(n)\\) is the number of divisors of \\(n\\).',
                    hint: 'At each prime \\(p\\), compare the local factors of \\(\\zeta(s)^2\\) with the generating function \\(\\sum_{k=0}^{\\infty} d(p^k) p^{-ks}\\). What is \\(d(p^k)\\)?',
                    solution: '\\(d(p^k) = k+1\\), so \\(\\sum_{k=0}^{\\infty}(k+1)p^{-ks} = (1-p^{-s})^{-2}\\). Since the Euler product of \\(\\zeta(s)\\) has local factor \\((1-p^{-s})^{-1}\\), squaring gives local factor \\((1-p^{-s})^{-2}\\). By unique factorization, reassembling over all primes yields \\(\\zeta(s)^2 = \\sum_{n=1}^{\\infty} d(n)/n^s\\). Alternatively: \\(\\zeta(s)^2 = (\\sum_m m^{-s})(\\sum_n n^{-s}) = \\sum_k (\\sum_{mn=k} 1) k^{-s} = \\sum_k d(k) k^{-s}\\).'
                }
            ]
        },

        // ================================================================
        // SECTION 4: Algebraic Properties
        // ================================================================
        {
            id: 'sec-formal-properties',
            title: 'Algebraic Properties',
            content: `
<h2>Algebraic Properties: Dirichlet Convolution</h2>

<p>The key algebraic fact: multiplying two Dirichlet series corresponds exactly to Dirichlet convolution of their coefficients.</p>

<div class="env-block theorem">
    <div class="env-title">Theorem 3.5 (Multiplication = Dirichlet Convolution)</div>
    <div class="env-body">
        <p>Let \\(F(s) = \\sum a(n)n^{-s}\\) and \\(G(s) = \\sum b(n)n^{-s}\\) converge absolutely for \\(\\operatorname{Re}(s) > \\sigma_0\\). Then for \\(\\operatorname{Re}(s) > \\sigma_0\\):</p>
        \\[F(s) \\cdot G(s) = \\sum_{n=1}^{\\infty} \\frac{(a * b)(n)}{n^s},\\]
        <p>where \\((a * b)(n) = \\sum_{d|n} a(d) b(n/d)\\) is the <strong>Dirichlet convolution</strong>.</p>
    </div>
</div>

<div class="env-block proof">
    <div class="env-title">Proof</div>
    <div class="env-body">
        <p>Since both series converge absolutely, we may multiply and rearrange freely:</p>
        \\[F(s)G(s) = \\left(\\sum_m \\frac{a(m)}{m^s}\\right)\\left(\\sum_n \\frac{b(n)}{n^s}\\right) = \\sum_{m,n \\ge 1} \\frac{a(m)b(n)}{(mn)^s} = \\sum_{k=1}^{\\infty} \\frac{1}{k^s} \\sum_{mn=k} a(m)b(n).\\]
        <p>The inner sum \\(\\sum_{mn=k} a(m)b(n) = \\sum_{d|k} a(d)b(k/d) = (a*b)(k)\\). \\(\\square\\)</p>
    </div>
</div>

<h3>The Ring of Formal Dirichlet Series</h3>

<p>With pointwise addition and Dirichlet convolution, the set of arithmetic functions forms a commutative ring. The identity element is the function \\(\\mathbf{e}(1) = 1\\), \\(\\mathbf{e}(n) = 0\\) for \\(n > 1\\) (whose Dirichlet series is 1). The multiplicative inverse of \\(F(s)\\) corresponds to the inverse under Dirichlet convolution.</p>

<div class="env-block example">
    <div class="env-title">Example 3.6 (Key Identities)</div>
    <div class="env-body">
        <ul>
            <li>\\(\\zeta(s) \\cdot \\frac{1}{\\zeta(s)} = 1\\) corresponds to \\(\\mathbf{1} * \\mu = \\mathbf{e}\\), i.e., \\(\\sum_{d|n} \\mu(d) = [n=1]\\).</li>
            <li>\\(\\zeta(s)^2 = \\sum d(n)n^{-s}\\) corresponds to \\(d = \\mathbf{1} * \\mathbf{1}\\), the divisor sum.</li>
            <li>\\(\\zeta(s-1)/\\zeta(s) = \\sum \\varphi(n)n^{-s}\\) corresponds to \\(\\varphi = \\text{id} * \\mu\\) (id-function Dirichlet-convolved with Mobius).</li>
        </ul>
    </div>
</div>

<h3>The Log Derivative</h3>

<p>Differentiating \\(\\log F(s) = -\\sum_p \\log(1 - f(p)p^{-s})\\) and applying the chain rule gives the log-derivative formula:</p>

<div class="env-block theorem">
    <div class="env-title">Theorem 3.6 (Log Derivative of Euler Product)</div>
    <div class="env-body">
        <p>For \\(\\operatorname{Re}(s) > 1\\):</p>
        \\[\\frac{\\zeta'(s)}{\\zeta(s)} = -\\sum_{n=1}^{\\infty} \\frac{\\Lambda(n)}{n^s},\\]
        <p>where \\(\\Lambda(n) = \\log p\\) if \\(n = p^k\\) for some prime \\(p\\) and \\(k \\ge 1\\), and \\(\\Lambda(n) = 0\\) otherwise.</p>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-log-derivative"></div>
`,
            visualizations: [
                {
                    id: 'viz-log-derivative',
                    title: '-\\u03b6\'(s)/\\u03b6(s) = \\u2211 \\u039b(n)/n^s: Von Mangoldt Weights',
                    description: 'The von Mangoldt function Lambda(n) is the coefficient of the log-derivative of zeta. Bars show log(p) at prime powers p^k. Partial sums converge to -zeta\'(s)/zeta(s) for real s > 1.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, { width: 600, height: 360, originX: 60, originY: 300, scale: 1 });
                        var sigma = 2.0;
                        var N = 40;
                        VizEngine.createSlider(controls, '\u03c3', 1.1, 4.0, sigma, 0.1, function(v) { sigma = v; draw(); });
                        VizEngine.createSlider(controls, 'N terms', 5, 80, N, 1, function(v) { N = Math.round(v); draw(); });

                        var PRIMES = VizEngine.sievePrimes(200);

                        function vonMangoldt(n) {
                            for (var i = 0; i < PRIMES.length; i++) {
                                var p = PRIMES[i];
                                if (p * p > n) break;
                                if (n % p === 0) {
                                    var pk = n;
                                    while (pk % p === 0) pk /= p;
                                    if (pk === 1) return Math.log(p);
                                    return 0;
                                }
                            }
                            if (n > 1) return Math.log(n); // n is prime
                            return 0;
                        }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var w = viz.width, h = viz.height;
                            var left = 60, bottom = 280, top = 30;
                            var chartH = bottom - top;

                            // Compute Lambda(n)/n^sigma and partial sums
                            var terms = [];
                            var partialSum = 0;
                            for (var n = 1; n <= N; n++) {
                                var lam = vonMangoldt(n);
                                var t = lam * Math.pow(n, -sigma);
                                terms.push({ n: n, lam: lam, t: t });
                                partialSum += t;
                            }

                            // Reference: -zeta'/zeta at sigma by numerical diff
                            var eps = 0.0001;
                            function zetaApprox(s) {
                                var v = 0;
                                for (var i = 1; i <= 1000; i++) v += Math.pow(i, -s);
                                return v;
                            }
                            var zetaLogDeriv = -(Math.log(zetaApprox(sigma + eps)) - Math.log(zetaApprox(sigma - eps))) / (2 * eps);

                            var maxTerm = 0;
                            terms.forEach(function(t) { maxTerm = Math.max(maxTerm, t.t); });
                            if (maxTerm < 0.001) maxTerm = 0.1;

                            var barW = Math.max(4, Math.min(18, (w - left - 20) / N - 1));
                            var gap = 1;

                            // Axes
                            ctx.strokeStyle = viz.colors.axis; ctx.lineWidth = 1;
                            ctx.beginPath(); ctx.moveTo(left, bottom); ctx.lineTo(w - 10, bottom); ctx.stroke();
                            ctx.beginPath(); ctx.moveTo(left, top); ctx.lineTo(left, bottom); ctx.stroke();

                            // Y gridlines
                            var maxDisplay = maxTerm * 1.2;
                            ctx.strokeStyle = viz.colors.grid; ctx.lineWidth = 0.5;
                            for (var g = 1; g <= 4; g++) {
                                var gv = (g / 4) * maxDisplay;
                                var gy = bottom - (gv / maxDisplay) * chartH;
                                ctx.beginPath(); ctx.moveTo(left, gy); ctx.lineTo(w - 10, gy); ctx.stroke();
                                ctx.fillStyle = viz.colors.text; ctx.font = '9px sans-serif';
                                ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
                                ctx.fillText(gv.toFixed(3), left - 3, gy);
                            }

                            // Bars
                            for (var i = 0; i < terms.length; i++) {
                                var d = terms[i];
                                var bx = left + i * (barW + gap);
                                var bh = (d.t / maxDisplay) * chartH;
                                var isPrimePow = d.lam > 0;
                                ctx.fillStyle = isPrimePow ? (Number.isInteger(Math.log(d.n) / Math.log(Math.round(Math.exp(d.lam)))) ? viz.colors.blue + 'cc' : viz.colors.purple + 'cc') : viz.colors.grid;
                                if (isPrimePow) {
                                    ctx.fillStyle = d.lam > 1 ? viz.colors.orange + 'cc' : viz.colors.blue + 'cc';
                                }
                                ctx.fillRect(bx, bottom - bh, barW, bh);
                                // n labels at primes and small n
                                if (d.n <= 20 || (d.lam > 0 && d.n <= N)) {
                                    ctx.fillStyle = viz.colors.text; ctx.font = '9px sans-serif';
                                    ctx.textAlign = 'center'; ctx.textBaseline = 'top';
                                    ctx.fillText(d.n, bx + barW / 2, bottom + 2);
                                }
                            }

                            // Partial sum line
                            ctx.strokeStyle = viz.colors.teal; ctx.lineWidth = 1.5; ctx.setLineDash([4, 3]);
                            var cumY = bottom - (partialSum / maxDisplay) * chartH;
                            ctx.beginPath(); ctx.moveTo(left, cumY); ctx.lineTo(left + (N - 1) * (barW + gap) + barW, cumY); ctx.stroke();
                            ctx.setLineDash([]);

                            // Reference -zeta'/zeta line
                            var refY = bottom - (zetaLogDeriv / maxDisplay) * chartH;
                            ctx.strokeStyle = viz.colors.yellow; ctx.lineWidth = 2; ctx.setLineDash([8, 4]);
                            ctx.beginPath(); ctx.moveTo(left, refY); ctx.lineTo(w - 10, refY); ctx.stroke();
                            ctx.setLineDash([]);

                            ctx.font = '11px sans-serif'; ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
                            ctx.fillStyle = viz.colors.yellow;
                            ctx.fillText('-\u03b6\'(\u03c3)/\u03b6(\u03c3) \u2248 ' + zetaLogDeriv.toFixed(4), w - 12, refY - 8);
                            ctx.fillStyle = viz.colors.teal;
                            ctx.fillText('\u03a3_{n\u2264N} \u039b(n)/n^\u03c3 \u2248 ' + partialSum.toFixed(4), w - 12, cumY + 10);

                            // Title
                            viz.screenText('-\u03b6\'(s)/\u03b6(s) = \u03a3 \u039b(n)/n^s,  \u03c3 = ' + sigma.toFixed(1), w/2, top + 12, viz.colors.white, 12);
                            viz.screenText('Blue: \u039b(p)=log p (primes)   Orange: \u039b(p^k)=log p (higher powers)', w/2, top + 28, viz.colors.text, 10);
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Show that the Dirichlet convolution \\(\\mathbf{1} * \\mathbf{1}\\) counts divisors. That is, verify \\((\\mathbf{1} * \\mathbf{1})(n) = d(n)\\).',
                    hint: 'Expand the convolution formula \\(\\sum_{d|n} 1 \\cdot 1\\).',
                    solution: '\\((\\mathbf{1}*\\mathbf{1})(n) = \\sum_{d|n} 1 \\cdot 1 = \\sum_{d|n} 1 = d(n)\\), the number of positive divisors of \\(n\\). This gives the identity \\(\\zeta(s)^2 = \\sum d(n)n^{-s}\\).'
                },
                {
                    question: 'Verify the identity \\(-\\zeta\'(s)/\\zeta(s) = \\sum_{n=1}^{\\infty} \\Lambda(n)n^{-s}\\) by differentiating the Euler product \\(\\log \\zeta(s) = -\\sum_p \\log(1-p^{-s})\\).',
                    hint: 'Differentiate term by term using the chain rule. Expand \\(-\\log(1-p^{-s})\\) as a power series.',
                    solution: 'Differentiating \\(\\log \\zeta(s) = -\\sum_p \\log(1-p^{-s})\\): \\[\\frac{\\zeta\'(s)}{\\zeta(s)} = \\sum_p \\frac{-p^{-s}\\log p}{1-p^{-s}} \\cdot (-1) \\cdot (-1) = -\\sum_p \\frac{(\\log p) p^{-s}}{1-p^{-s}}.\\] Expanding \\((\\log p)p^{-s}/(1-p^{-s}) = \\sum_{k=1}^{\\infty}(\\log p)p^{-ks}\\), and summing over all \\(p\\) and \\(k\\) gives \\(\\sum_{n}\\Lambda(n)n^{-s}\\) by unique factorization.'
                }
            ]
        },

        // ================================================================
        // SECTION 5: Uniqueness Theorem
        // ================================================================
        {
            id: 'sec-uniqueness',
            title: 'Uniqueness Theorem',
            content: `
<h2>The Uniqueness Theorem</h2>

<p>A Dirichlet series is not just a formal object: the function it represents determines its coefficients uniquely. This is the Dirichlet analogue of the uniqueness theorem for power series.</p>

<div class="env-block theorem">
    <div class="env-title">Theorem 3.7 (Uniqueness)</div>
    <div class="env-body">
        <p>Suppose \\(\\sum_{n=1}^{\\infty} a(n)n^{-s} = 0\\) for all \\(s\\) in some half-plane \\(\\operatorname{Re}(s) > \\sigma_0\\) where the series converges absolutely. Then \\(a(n) = 0\\) for all \\(n \\ge 1\\).</p>
        <p>Equivalently: if \\(\\sum a(n)n^{-s} = \\sum b(n)n^{-s}\\) in a half-plane of absolute convergence, then \\(a(n) = b(n)\\) for all \\(n\\).</p>
    </div>
</div>

<div class="env-block proof">
    <div class="env-title">Proof</div>
    <div class="env-body">
        <p>Let \\(F(s) = \\sum_{n=1}^{\\infty} a(n)n^{-s} = 0\\) for \\(\\sigma > \\sigma_0\\). We recover \\(a(n)\\) from \\(F\\) by a "Mellin-type" extraction. The key step:</p>
        <p><strong>Step 1.</strong> Suppose \\(a(1) \\ne 0\\). For large real \\(s = \\sigma \\to \\infty\\):</p>
        \\[F(s) = a(1) + \\sum_{n=2}^{\\infty} a(n)n^{-s} = a(1) + O(2^{-\\sigma}).\\]
        <p>As \\(\\sigma \\to \\infty\\), \\(F(\\sigma) \\to a(1)\\). But \\(F(\\sigma) = 0\\), so \\(a(1) = 0\\). Contradiction.</p>
        <p><strong>Step 2.</strong> Inductively, if \\(a(1) = a(2) = \\cdots = a(n_0-1) = 0\\), then \\(n_0^s F(s) = a(n_0) + \\sum_{n > n_0} a(n)(n_0/n)^s\\). As \\(\\sigma \\to \\infty\\), this \\(\\to a(n_0)\\). Since the left side is 0, \\(a(n_0) = 0\\). \\(\\square\\)</p>
    </div>
</div>

<h3>Consequences</h3>

<div class="env-block remark">
    <div class="env-title">Why Uniqueness Matters</div>
    <div class="env-body">
        <p>Uniqueness means we can read off arithmetic identities directly from analytic identities between Dirichlet series. For instance:</p>
        <ul>
            <li>\\(\\zeta(s)^2 = \\sum d(n)n^{-s}\\) forces \\(d = \\mathbf{1}*\\mathbf{1}\\).</li>
            <li>\\(\\zeta(s)/\\zeta(2s) = \\sum |\\mu(n)|n^{-s}\\) (squarefree indicator), since the Euler factors match.</li>
            <li>Any identity between Euler products yields a Dirichlet convolution identity via uniqueness.</li>
        </ul>
    </div>
</div>

<div class="env-block theorem">
    <div class="env-title">Theorem 3.8 (Perron-type Extraction)</div>
    <div class="env-body">
        <p>More quantitatively, if \\(\\sum |a(n)| n^{-\\sigma_0} < \\infty\\), then for any \\(\\sigma > \\sigma_0\\) and any \\(T > 0\\),</p>
        \\[\\frac{1}{2T} \\int_{-T}^{T} F(\\sigma + it) \\, n^{\\sigma + it} \\, dt \\longrightarrow a(n) \\quad \\text{as } T \\to \\infty.\\]
        <p>This Mellin inversion formula is the basis of Perron's theorem, used in Chapter 7 to extract \\(\\psi(x) = \\sum_{n \\le x} \\Lambda(n)\\) from \\(-\\zeta'/\\zeta\\).</p>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-spiral-partial-sums"></div>
`,
            visualizations: [
                {
                    id: 'viz-spiral-partial-sums',
                    title: 'Partial Sums of n^{-s} in the Complex Plane',
                    description: 'Each term 1/n^s is a complex number. Their partial sums trace a spiral in C. Adjust sigma and t to see how the spiral\'s shape reflects convergence.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, { width: 560, height: 440, originX: 280, originY: 220, scale: 1 });
                        var sigma = 1.5, t = 10.0, N = 60;
                        var animating = false, animId = null;

                        VizEngine.createSlider(controls, '\u03c3', 0.3, 3.0, sigma, 0.05, function(v) { sigma = v; if (!animating) draw(); });
                        VizEngine.createSlider(controls, 't', 0, 40, t, 0.5, function(v) { t = v; if (!animating) draw(); });
                        VizEngine.createSlider(controls, 'N terms', 5, 120, N, 1, function(v) { N = Math.round(v); if (!animating) draw(); });

                        var animBtn = VizEngine.createButton(controls, 'Animate t', function() {
                            if (animating) {
                                animating = false;
                                if (animId) { cancelAnimationFrame(animId); animId = null; }
                                animBtn.textContent = 'Animate t';
                            } else {
                                animating = true;
                                animBtn.textContent = 'Stop';
                                var t0 = null;
                                function step(ts) {
                                    if (!t0) t0 = ts;
                                    t = ((ts - t0) / 800) % 40;
                                    draw();
                                    if (animating) animId = requestAnimationFrame(step);
                                }
                                animId = requestAnimationFrame(step);
                            }
                        });

                        function cPow(n, sig, ti) {
                            // n^{-s} = n^{-sigma} * e^{-i*t*log(n)}
                            var mag = Math.pow(n, -sig);
                            var arg = -ti * Math.log(n);
                            return [mag * Math.cos(arg), mag * Math.sin(arg)];
                        }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var w = viz.width, h = viz.height;
                            var cx = viz.originX, cy = viz.originY;

                            // Dynamic scale: find max excursion
                            var pts = [[0, 0]];
                            var rx = 0, ry = 0;
                            for (var n = 1; n <= N; n++) {
                                var c = cPow(n, sigma, t);
                                rx += c[0]; ry += c[1];
                                pts.push([rx, ry]);
                            }
                            var maxR = 0;
                            pts.forEach(function(p) { maxR = Math.max(maxR, Math.sqrt(p[0]*p[0]+p[1]*p[1])); });
                            if (maxR < 0.1) maxR = 0.1;
                            var scale = Math.min(180, (Math.min(w, h) * 0.42) / maxR);

                            // Grid circles
                            ctx.strokeStyle = viz.colors.grid; ctx.lineWidth = 0.5;
                            var gridR = maxR;
                            for (var r = gridR / 4; r <= gridR * 1.1; r += gridR / 4) {
                                ctx.beginPath(); ctx.arc(cx, cy, r * scale, 0, Math.PI * 2); ctx.stroke();
                            }
                            // Axes
                            ctx.strokeStyle = viz.colors.axis; ctx.lineWidth = 1;
                            ctx.beginPath(); ctx.moveTo(0, cy); ctx.lineTo(w, cy); ctx.stroke();
                            ctx.beginPath(); ctx.moveTo(cx, 0); ctx.lineTo(cx, h); ctx.stroke();
                            ctx.fillStyle = viz.colors.text; ctx.font = '10px sans-serif';
                            ctx.textAlign = 'right'; ctx.textBaseline = 'top';
                            ctx.fillText('Re', w - 2, cy + 2);
                            ctx.textAlign = 'left'; ctx.textBaseline = 'bottom';
                            ctx.fillText('Im', cx + 2, 2);

                            // Draw spiral path
                            if (pts.length > 1) {
                                ctx.beginPath();
                                ctx.moveTo(cx + pts[0][0] * scale, cy - pts[0][1] * scale);
                                for (var i = 1; i < pts.length; i++) {
                                    var alpha = Math.max(0.2, i / pts.length);
                                    ctx.strokeStyle = 'rgba(88,166,255,' + alpha + ')';
                                    ctx.lineWidth = 1 + alpha;
                                    ctx.lineTo(cx + pts[i][0] * scale, cy - pts[i][1] * scale);
                                    if (i % 5 === 0 || i === pts.length - 1) {
                                        ctx.stroke();
                                        ctx.beginPath();
                                        ctx.moveTo(cx + pts[i][0] * scale, cy - pts[i][1] * scale);
                                    }
                                }
                                ctx.stroke();
                            }

                            // Mark starting point (origin)
                            viz.drawScreenPoint(cx, cy, viz.colors.green, 5);
                            ctx.fillStyle = viz.colors.green; ctx.font = '11px sans-serif';
                            ctx.textAlign = 'left'; ctx.textBaseline = 'bottom';
                            ctx.fillText('S_0 = 0', cx + 8, cy - 4);

                            // Mark final partial sum
                            var final = pts[pts.length - 1];
                            var fx = cx + final[0] * scale, fy = cy - final[1] * scale;
                            viz.drawScreenPoint(fx, fy, viz.colors.orange, 6);
                            ctx.fillStyle = viz.colors.orange; ctx.font = '11px sans-serif';
                            ctx.textAlign = 'left'; ctx.textBaseline = 'bottom';
                            var re = final[0], im = final[1];
                            ctx.fillText('S_' + N + ' = ' + re.toFixed(3) + (im >= 0 ? '+' : '') + im.toFixed(3) + 'i', fx + 8, fy - 4);

                            // Convergence note
                            var converges = sigma > 1;
                            ctx.font = 'bold 12px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'top';
                            ctx.fillStyle = converges ? viz.colors.green : viz.colors.red;
                            ctx.fillText('\u03c3 = ' + sigma.toFixed(2) + ',  t = ' + t.toFixed(1) + '  \u2192 s = \u03c3 + it', w / 2, 10);
                            ctx.fillStyle = viz.colors.text; ctx.font = '11px sans-serif';
                            ctx.fillText(converges ? 'Spiral converges (\u03c3 > 1)' : 'Spiral may diverge (\u03c3 \u2264 1)', w / 2, 28);
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Use the uniqueness theorem to prove: if \\(\\sum a(n)n^{-s} = \\sum b(n)n^{-s}\\) for \\(\\operatorname{Re}(s) > \\sigma_0\\), then \\(a(n) = b(n)\\) for all \\(n\\).',
                    hint: 'Apply the uniqueness theorem to the Dirichlet series \\(\\sum (a(n)-b(n))n^{-s}\\).',
                    solution: 'Let \\(c(n) = a(n) - b(n)\\). Then \\(\\sum c(n)n^{-s} = 0\\) for \\(\\operatorname{Re}(s) > \\sigma_0\\). By Theorem 3.7, taking \\(s = \\sigma \\to \\infty\\), we get \\(c(1) = \\lim_{\\sigma\\to\\infty} \\sum c(n)n^{-\\sigma} = 0\\). Then \\(\\sigma^s \\sum_{n\\ge 2} c(n)n^{-s} \\to c(2)\\) as \\(\\sigma\\to\\infty\\), so \\(c(2) = 0\\). By induction all \\(c(n) = 0\\).'
                },
                {
                    question: 'Explain why the uniqueness theorem implies that no non-trivial Dirichlet series can be identically zero except if all coefficients vanish. What would it mean for a Dirichlet series to be zero on a convergent open set but not everywhere?',
                    hint: 'Think about the identity theorem for holomorphic functions. A holomorphic function that vanishes on a set with an accumulation point in its domain must vanish everywhere in its connected domain.',
                    solution: 'Since a Dirichlet series converging in a half-plane defines a holomorphic function there, and the half-plane is connected, the identity theorem for holomorphic functions implies that if the function is zero on any set with an accumulation point in the half-plane, it is identically zero. The uniqueness theorem then recovers the stronger statement: once the analytic function is identically zero, all coefficients must vanish. So a non-trivial Dirichlet series (not all coefficients zero) represents a non-zero holomorphic function in its half-plane of convergence.'
                }
            ]
        },

        // ================================================================
        // SECTION 6: Enter zeta(s)
        // ================================================================
        {
            id: 'sec-bridge',
            title: 'Enter \\u03b6(s)',
            content: `
<h2>Enter \\(\\zeta(s)\\): Bridge to Chapter 4</h2>

<p>Everything in this chapter has been preparation for one function. The Riemann zeta function is the canonical Dirichlet series, and it concentrates all the themes we have developed.</p>

<h3>What We Know About \\(\\zeta(s)\\) So Far</h3>

<div class="env-block theorem">
    <div class="env-title">Summary: Properties of \\(\\zeta(s)\\) for \\(\\operatorname{Re}(s) > 1\\)</div>
    <div class="env-body">
        <ol>
            <li><strong>Convergence.</strong> \\(\\zeta(s) = \\sum_{n=1}^{\\infty} n^{-s}\\) converges absolutely for \\(\\operatorname{Re}(s) > 1\\), so \\(\\sigma_a = 1\\).</li>
            <li><strong>Holomorphicity.</strong> \\(\\zeta\\) is holomorphic for \\(\\operatorname{Re}(s) > 1\\), with \\(\\zeta^{(k)}(s) = (-1)^k \\sum_{n=1}^{\\infty} (\\log n)^k n^{-s}\\).</li>
            <li><strong>Euler product.</strong> \\(\\zeta(s) = \\prod_p (1-p^{-s})^{-1}\\), which implies \\(\\zeta(s) \\ne 0\\) for \\(\\sigma > 1\\).</li>
            <li><strong>Log derivative.</strong> \\(\\zeta'/\\zeta = -\\sum \\Lambda(n) n^{-s}\\), connecting \\(\\zeta\\) to prime powers.</li>
            <li><strong>Divergence at \\(s = 1\\).</strong> \\(\\zeta(s) \\to \\infty\\) as \\(s \\to 1^+\\) (harmonic series diverges), so \\(\\zeta\\) has a singularity at \\(s = 1\\).</li>
        </ol>
    </div>
</div>

<h3>What Remains to Be Done</h3>

<p>The real power of \\(\\zeta(s)\\) comes from its <em>analytic continuation</em> beyond \\(\\operatorname{Re}(s) > 1\\). We need to:</p>
<ul>
    <li>Extend \\(\\zeta(s)\\) to all \\(s \\in \\mathbb{C}\\) except \\(s = 1\\) (Chapter 4, using the integral representation).</li>
    <li>Identify the nature of the singularity at \\(s = 1\\): it is a simple pole with residue 1 (Chapter 4).</li>
    <li>Establish the functional equation \\(\\zeta(s) = 2^s \\pi^{s-1} \\sin(\\pi s/2) \\Gamma(1-s) \\zeta(1-s)\\) (Chapter 5).</li>
    <li>Locate the zeros of \\(\\zeta(s)\\): trivial zeros at \\(s = -2, -4, -6, \\ldots\\) and non-trivial zeros in the critical strip (Chapters 5-6).</li>
    <li>Prove \\(\\psi(x) \\sim x\\) (the Prime Number Theorem) using the zeros of \\(\\zeta\\) (Chapter 7).</li>
</ul>

<div class="env-block intuition">
    <div class="env-title">The Guiding Picture</div>
    <div class="env-body">
        <p>Think of \\(\\zeta(s)\\) as a "generating function" that packages all primes. Every prime \\(p\\) contributes a local factor \\((1-p^{-s})^{-1}\\). The zeros and poles of \\(\\zeta(s)\\) are precisely the "resonances" between these local factors&mdash;they encode global information about how primes are distributed.</p>
        <p>The Riemann Hypothesis asserts that all non-trivial zeros lie on the line \\(\\operatorname{Re}(s) = 1/2\\). This is equivalent to the sharpest possible error bound in the Prime Number Theorem: \\(\\pi(x) = \\operatorname{Li}(x) + O(\\sqrt{x} \\log x)\\).</p>
    </div>
</div>

<h3>The Pole at \\(s = 1\\) and the PNT</h3>

<p>The simple pole of \\(\\zeta(s)\\) at \\(s = 1\\) with residue 1 is equivalent to the Prime Number Theorem in the rough sense. More precisely:</p>
\\[\\sum_{n=1}^{\\infty} \\frac{1}{n^s} \\sim \\frac{1}{s-1} \\quad (s \\to 1^+),\\]
and Perron's formula converts this into
\\[\\psi(x) = \\sum_{n \\le x} \\Lambda(n) \\sim x \\quad (x \\to \\infty).\\]

<div class="env-block remark">
    <div class="env-title">Roadmap from Here</div>
    <div class="env-body">
        <p>Chapter 4 extends \\(\\zeta(s)\\) to \\(\\mathbb{C} \\setminus \\{1\\}\\) using the Euler-Maclaurin formula and the integral representation. The key tool is the Gamma function and the completed zeta function \\(\\xi(s) = \\frac{1}{2}s(s-1)\\pi^{-s/2}\\Gamma(s/2)\\zeta(s)\\), which satisfies \\(\\xi(s) = \\xi(1-s)\\).</p>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-euler-product-assembly"></div>
`,
            visualizations: [],
            exercises: [
                {
                    question: 'Verify directly that \\(\\zeta(s) \\to \\infty\\) as \\(s \\to 1^+\\) (real approach) by comparing \\(\\sum n^{-s}\\) to the integral \\(\\int_1^{\\infty} x^{-s}\\,dx = 1/(s-1)\\).',
                    hint: 'Use the integral test: for \\(s > 1\\), \\(\\sum_{n=1}^N n^{-s} \\ge \\int_1^{N+1} x^{-s}\\,dx\\). Let \\(N \\to \\infty\\) and then \\(s \\to 1^+\\).',
                    solution: 'By the integral test, \\(\\zeta(s) \\ge \\int_1^{\\infty} x^{-s}\\,dx = 1/(s-1)\\) for \\(s > 1\\). As \\(s \\to 1^+\\), \\(1/(s-1) \\to \\infty\\), so \\(\\zeta(s) \\to \\infty\\). More precisely, one shows \\(\\zeta(s) = 1/(s-1) + O(1)\\) as \\(s \\to 1^+\\), establishing the simple pole with residue 1.'
                },
                {
                    question: 'Using the Euler product, prove that \\(-\\log \\zeta(\\sigma) \\sim \\log(\\sigma - 1)\\) as \\(\\sigma \\to 1^+\\), and deduce that \\(\\sum_p p^{-\\sigma} \\to \\infty\\) as \\(\\sigma \\to 1^+\\).',
                    hint: 'Use \\(\\log \\zeta(\\sigma) = -\\sum_p \\log(1-p^{-\\sigma})\\) and compare with \\(\\sum_p p^{-\\sigma}\\). Use \\(-\\log(1-x) = x + x^2/2 + \\ldots \\ge x\\).',
                    solution: 'Since \\(\\zeta(\\sigma) \\sim 1/(\\sigma-1)\\), we have \\(\\log \\zeta(\\sigma) \\sim \\log 1/(\\sigma-1) = -\\log(\\sigma-1) \\to \\infty\\). From \\(\\log \\zeta(\\sigma) = -\\sum_p \\log(1-p^{-\\sigma}) \\ge \\sum_p p^{-\\sigma}\\) (since \\(-\\log(1-x) \\ge x\\) for \\(0 < x < 1\\)), it follows that \\(\\sum_p p^{-\\sigma} \\le \\log\\zeta(\\sigma)\\). The other direction: \\(-\\log(1-x) \\le x/(1-x)\\), so \\(\\log\\zeta(\\sigma) \\le \\sum_p p^{-\\sigma}/(1-p^{-\\sigma}) \\le (1 + o(1)) \\sum_p p^{-\\sigma}\\). Thus \\(\\sum_p p^{-\\sigma} \\sim \\log(1/(\\sigma-1)) \\to \\infty\\).'
                }
            ]
        }

    ] // end sections
}); // end CHAPTERS.push
