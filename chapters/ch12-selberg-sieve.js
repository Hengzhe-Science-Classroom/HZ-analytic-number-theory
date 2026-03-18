// === Chapter 12: Sieve Methods II — Selberg's Sieve ===
// Tier 5 — "Optimization replaces combinatorics"
window.CHAPTERS = window.CHAPTERS || [];
window.CHAPTERS.push({
    id: 'ch12',
    number: 12,
    title: "Sieve Methods II: Selberg & Modern Sieves",
    subtitle: "Optimization replaces combinatorics",
    sections: [
        // ================================================================
        // SECTION 1: Motivation — Why Selberg?
        // ================================================================
        {
            id: 'sec-motivation',
            title: 'Motivation: Why Selberg?',
            content: `
<h2>Motivation: Why Selberg?</h2>

<div class="env-block intuition">
    <div class="env-title">From Combinatorics to Optimization</div>
    <div class="env-body">
        <p>The combinatorial sieves of Brun and Legendre attack the sifting problem by inclusion-exclusion: add, subtract, add, subtract. The M&ouml;bius function \\(\\mu(d)\\) encodes these signs, and bounding the partial sums requires delicate combinatorial arguments to keep the error terms under control. Selberg's insight was radical: <strong>forget the signs</strong>. Instead, choose non-negative weights that minimize an upper bound. The problem becomes one of quadratic optimization, and the answer drops out cleanly.</p>
    </div>
</div>

<h3>The Sifting Problem</h3>

<p>Recall the setup from Chapter 11. We have a finite set \\(\\mathcal{A}\\) of integers, a set \\(\\mathcal{P}\\) of primes, and for each prime \\(p \\in \\mathcal{P}\\) a subset \\(\\mathcal{A}_p \\subseteq \\mathcal{A}\\) of elements divisible by \\(p\\). We want to estimate the sifting function</p>

\\[
S(\\mathcal{A}, \\mathcal{P}, z) = |\\{a \\in \\mathcal{A} : p \\mid a \\Rightarrow p \\notin \\mathcal{P} \\text{ or } p \\geq z\\}|,
\\]

<p>the count of elements of \\(\\mathcal{A}\\) not divisible by any prime \\(p < z\\) from \\(\\mathcal{P}\\).</p>

<h3>The Difficulty with Combinatorial Sieves</h3>

<p>Brun's sieve truncates inclusion-exclusion at a chosen depth \\(D\\), alternating between upper and lower bounds. The quality of the bound depends on controlling the "remainder terms"</p>

\\[
R_d = |\\mathcal{A}_d| - \\frac{\\omega(d)}{d} X,
\\]

<p>where \\(X \\approx |\\mathcal{A}|\\) and \\(\\omega(d)/d\\) is the expected proportion of \\(\\mathcal{A}\\) divisible by \\(d\\). For this to work, we need \\(d\\) to stay small (below a "level" \\(D\\)), and the combinatorial bookkeeping can be intricate.</p>

<div class="env-block remark">
    <div class="env-title">Selberg's Philosophy</div>
    <div class="env-body">
        <p>Selberg (1947) introduced a fundamentally different approach. Rather than imposing \\(\\mu\\)-like signs and truncating, he sought the "best possible" upper-bound sieve by treating the sieve weights as free variables and minimizing the resulting expression. The key identity that makes this work is the \\(\\Lambda^2\\) construction, where the sieve weights are <em>squares</em>, hence automatically non-negative.</p>
    </div>
</div>

<h3>Preview of the Chapter</h3>

<p>We will develop Selberg's upper-bound sieve (Section 2), study the role of <em>sieve dimension</em> in controlling the quality of sieve estimates (Section 3), examine the Rosser-Iwaniec approach to lower-bound sieves (Section 4), confront the <em>parity problem</em> that limits what any sieve can achieve (Section 5), and conclude with connections to modern breakthroughs (Section 6).</p>

<div class="viz-placeholder" data-viz="viz-sieve-comparison"></div>
`,
            visualizations: [
                {
                    id: 'viz-sieve-comparison',
                    title: 'Comparing Sieve Methods',
                    description: 'Compare the upper bounds from Legendre, Brun, and Selberg sieves on the prime-counting function. Selberg\'s sieve gives the tightest upper bound for the count of primes up to N. Adjust N to see how the bounds evolve.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 380,
                            originX: 60, originY: 340, scale: 1
                        });

                        var logN = 4;
                        VizEngine.createSlider(controls, 'log\u2081\u2080 N', 2, 6, logN, 0.5, function(v) {
                            logN = v; draw();
                        });

                        var primes = VizEngine.sievePrimes(1000000);

                        function piCount(n) {
                            var c = 0;
                            for (var i = 0; i < primes.length && primes[i] <= n; i++) c++;
                            return c;
                        }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var N = Math.round(Math.pow(10, logN));

                            viz.screenText('Sieve Upper Bounds vs \u03C0(N)', viz.width / 2, 20, viz.colors.white, 15);

                            // Compute data points
                            var pts = 40;
                            var data = [];
                            for (var i = 1; i <= pts; i++) {
                                var x = Math.round(N * i / pts);
                                if (x < 2) continue;
                                var pi = piCount(x);
                                var logx = Math.log(Math.max(x, 2));
                                var log2x = Math.log(Math.max(logx, 1));
                                // Legendre-type bound: x / log(log(x)) (very crude)
                                var legendre = log2x > 0.5 ? x / log2x : x;
                                // Brun-type bound: 2 * x/(log x)^2 * C_twin (for illustration)
                                var brun = 8 * x / (logx * logx);
                                // Selberg bound: (2 + o(1)) * x / log(x)
                                var selberg = 2.0 * x / logx * (1 + 1.0 / logx);
                                data.push({ x: x, pi: pi, legendre: legendre, brun: brun, selberg: selberg });
                            }

                            // Chart area
                            var chartL = 80, chartR = viz.width - 30;
                            var chartT = 50, chartB = 320;
                            var chartW = chartR - chartL, chartH = chartB - chartT;

                            var maxY = 0;
                            for (var j = 0; j < data.length; j++) {
                                maxY = Math.max(maxY, data[j].legendre, data[j].brun, data[j].selberg, data[j].pi);
                            }
                            if (maxY < 1) maxY = 1;
                            var maxX = N;

                            // Grid lines
                            ctx.strokeStyle = viz.colors.grid; ctx.lineWidth = 0.5;
                            for (var g = 0; g <= 4; g++) {
                                var gy = chartB - (g / 4) * chartH;
                                ctx.beginPath(); ctx.moveTo(chartL, gy); ctx.lineTo(chartR, gy); ctx.stroke();
                                ctx.fillStyle = viz.colors.text; ctx.font = '10px -apple-system,sans-serif';
                                ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
                                ctx.fillText(Math.round(maxY * g / 4).toString(), chartL - 6, gy);
                            }

                            // Axes
                            ctx.strokeStyle = viz.colors.axis; ctx.lineWidth = 1.5;
                            ctx.beginPath(); ctx.moveTo(chartL, chartB); ctx.lineTo(chartR, chartB); ctx.stroke();
                            ctx.beginPath(); ctx.moveTo(chartL, chartT); ctx.lineTo(chartL, chartB); ctx.stroke();

                            // Helper to draw a curve
                            function drawCurve(key, color) {
                                ctx.strokeStyle = color; ctx.lineWidth = 2;
                                ctx.beginPath();
                                var started = false;
                                for (var k = 0; k < data.length; k++) {
                                    var sx = chartL + (data[k].x / maxX) * chartW;
                                    var sy = chartB - (Math.min(data[k][key], maxY * 1.5) / maxY) * chartH;
                                    sy = Math.max(chartT - 10, sy);
                                    if (!started) { ctx.moveTo(sx, sy); started = true; }
                                    else ctx.lineTo(sx, sy);
                                }
                                ctx.stroke();
                            }

                            drawCurve('legendre', viz.colors.red);
                            drawCurve('brun', viz.colors.orange);
                            drawCurve('selberg', viz.colors.teal);
                            drawCurve('pi', viz.colors.blue);

                            // Legend
                            var legY = chartB + 20;
                            var items = [
                                ['\u03C0(x)', viz.colors.blue],
                                ['Selberg', viz.colors.teal],
                                ['Brun-type', viz.colors.orange],
                                ['Legendre-type', viz.colors.red]
                            ];
                            var legStartX = viz.width / 2 - 140;
                            for (var m = 0; m < items.length; m++) {
                                var lx = legStartX + m * 75;
                                ctx.fillStyle = items[m][1];
                                ctx.fillRect(lx, legY, 10, 10);
                                ctx.fillStyle = viz.colors.text; ctx.font = '10px -apple-system,sans-serif';
                                ctx.textAlign = 'left'; ctx.fillText(items[m][0], lx + 14, legY + 9);
                            }

                            ctx.fillStyle = viz.colors.text; ctx.font = '10px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText('N = ' + N.toLocaleString(), viz.width / 2, chartB + 44);
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: []
        },

        // ================================================================
        // SECTION 2: Selberg's Upper-Bound Sieve
        // ================================================================
        {
            id: 'sec-selberg-upper',
            title: "Selberg's Upper-Bound Sieve (\u039B\u00B2)",
            content: `
<h2>Selberg's Upper-Bound Sieve</h2>

<div class="env-block intuition">
    <div class="env-title">The \\(\\Lambda^2\\) Trick</div>
    <div class="env-body">
        <p>Selberg's key observation: if \\(\\lambda_1 = 1\\) and \\(\\lambda_d = 0\\) for \\(d > z\\), then for any integer \\(n\\),</p>
        \\[
        \\left(\\sum_{d \\mid n} \\lambda_d\\right)^2 \\geq \\begin{cases} 1 & \\text{if } (n, P(z)) = 1, \\\\ 0 & \\text{always.} \\end{cases}
        \\]
        <p>The square is always non-negative, and when \\(n\\) has no prime factors below \\(z\\), only the \\(d = 1\\) term survives, giving the value 1. So the squared sum is an <em>upper-bound sieve</em> for the indicator of "unsifted" integers.</p>
    </div>
</div>

<h3>Setting Up the Optimization</h3>

<p>Let \\(P(z) = \\prod_{p < z, p \\in \\mathcal{P}} p\\). Define real numbers \\(\\lambda_d\\) for squarefree \\(d \\mid P(z)\\) with \\(\\lambda_1 = 1\\) and \\(\\lambda_d = 0\\) for \\(d > D\\) (the "level" of the sieve). Then</p>

\\[
S(\\mathcal{A}, \\mathcal{P}, z) \\leq \\sum_{a \\in \\mathcal{A}} \\left(\\sum_{d \\mid (a, P(z))} \\lambda_d\\right)^2.
\\]

<p>Expanding the square and switching the order of summation:</p>

\\[
S(\\mathcal{A}, \\mathcal{P}, z) \\leq \\sum_{d_1, d_2 \\mid P(z)} \\lambda_{d_1} \\lambda_{d_2} |\\mathcal{A}_{[d_1, d_2]}|,
\\]

<p>where \\([d_1, d_2]\\) is the least common multiple.</p>

<h3>The Main Term</h3>

<p>Using the standard decomposition \\(|\\mathcal{A}_d| = g(d) X + r_d\\) where \\(g\\) is a multiplicative function with \\(g(p) = \\omega(p)/p\\), the main term becomes</p>

\\[
X \\sum_{d_1, d_2} \\lambda_{d_1} \\lambda_{d_2} g([d_1, d_2]) + \\text{error terms}.
\\]

<p>Selberg's genius was recognizing that this quadratic form in the \\(\\lambda_d\\)'s can be diagonalized.</p>

<div class="env-block theorem">
    <div class="env-title">Theorem 12.1 (Selberg's Upper-Bound Sieve)</div>
    <div class="env-body">
        <p>With the notation above, the optimal choice of \\(\\lambda_d\\) gives</p>
        \\[
        S(\\mathcal{A}, \\mathcal{P}, z) \\leq \\frac{X}{G(D)} + R,
        \\]
        <p>where</p>
        \\[
        G(D) = \\sum_{\\substack{d \\mid P(z) \\\\ d \\leq D}} \\frac{\\mu(d)^2}{g(d)} \\prod_{p \\mid d} \\frac{g(p)}{1 - g(p)},
        \\]
        <p>and \\(R\\) is a sum of remainder terms \\(r_d\\) over \\(d \\leq D^2\\).</p>
    </div>
</div>

<h3>Diagonalization via M&ouml;bius Inversion</h3>

<p>The key substitution is \\(\\lambda_d = \\mu(d) y_d\\) for auxiliary variables \\(y_d\\), then further setting</p>

\\[
y_d = \\frac{\\mu(d)}{g(d)} \\cdot \\frac{1}{G(D)} \\sum_{\\substack{\\ell \\mid P(z)/d \\\\ d\\ell \\leq D}} \\frac{\\mu(\\ell)^2}{g(\\ell)} \\prod_{p \\mid \\ell} \\frac{g(p)}{1-g(p)}.
\\]

<p>This transforms the quadratic form into a sum of squares, making the minimum transparent.</p>

<div class="env-block example">
    <div class="env-title">Example: Counting Primes (Selberg)</div>
    <div class="env-body">
        <p>Take \\(\\mathcal{A} = \\{1, 2, \\ldots, N\\}\\), \\(\\mathcal{P}\\) = all primes, \\(z = \\sqrt{N}\\), and \\(D = \\sqrt{N}\\). Then \\(g(p) = 1/p\\), and</p>
        \\[
        G(\\sqrt{N}) \\sim \\frac{1}{2} \\log N,
        \\]
        <p>so Selberg's sieve gives \\(\\pi(N) \\leq (2 + o(1)) \\frac{N}{\\log N}\\), which is off from the true asymptotic by a factor of 2. This factor is <em>not</em> an artifact of weak technique; it is a fundamental limitation connected to the parity problem (Section 5).</p>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-selberg-weights"></div>

<div class="env-block remark">
    <div class="env-title">Comparison with Brun's Sieve</div>
    <div class="env-body">
        <p>Brun's combinatorial sieve for the same problem gives \\(\\pi(N) \\ll N / (\\log N)^2\\) with more effort, and the constant is worse. Selberg's sieve is both simpler and sharper for upper bounds. However, Brun's sieve can give both upper and lower bounds, while the basic \\(\\Lambda^2\\) sieve is inherently one-sided.</p>
    </div>
</div>
`,
            visualizations: [
                {
                    id: 'viz-selberg-weights',
                    title: 'Selberg Sieve Weights \\(\\lambda_d\\)',
                    description: 'Visualize the optimal Selberg sieve weights \\(\\lambda_d\\) for sifting \\(\\{1, \\ldots, N\\}\\) by primes up to \\(z\\). The weights start at \\(\\lambda_1 = 1\\) and decrease, remaining real-valued (not restricted to \\(\\pm 1\\)). Compare with the M\u00f6bius function weights \\(\\mu(d)\\) used in the Legendre sieve.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 380,
                            originX: 60, originY: 280, scale: 1
                        });

                        var zVal = 10;
                        VizEngine.createSlider(controls, 'z (sifting level)', 4, 30, zVal, 1, function(v) {
                            zVal = Math.round(v); draw();
                        });

                        var primes = VizEngine.sievePrimes(200);

                        // Compute squarefree divisors of P(z)
                        function getSquarefreeDivisors(z) {
                            var ps = [];
                            for (var i = 0; i < primes.length && primes[i] < z; i++) ps.push(primes[i]);
                            var divs = [1];
                            for (var k = 0; k < ps.length; k++) {
                                var p = ps[k];
                                var len = divs.length;
                                for (var j = 0; j < len; j++) {
                                    divs.push(divs[j] * p);
                                }
                            }
                            divs.sort(function(a, b) { return a - b; });
                            return divs;
                        }

                        function mobius(n) {
                            if (n === 1) return 1;
                            var factors = 0;
                            var m = n;
                            for (var p = 2; p * p <= m; p++) {
                                if (m % p === 0) {
                                    m /= p;
                                    factors++;
                                    if (m % p === 0) return 0;
                                }
                            }
                            if (m > 1) factors++;
                            return (factors % 2 === 0) ? 1 : -1;
                        }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            viz.screenText('Selberg Weights vs M\u00f6bius Weights', viz.width / 2, 20, viz.colors.white, 14);

                            var divs = getSquarefreeDivisors(zVal);
                            // Limit to first 60 for display
                            if (divs.length > 60) divs = divs.slice(0, 60);

                            // Compute g(d) = product of 1/p for p|d
                            function gFunc(d) {
                                var val = 1;
                                for (var i = 0; i < primes.length && primes[i] < zVal; i++) {
                                    if (d % primes[i] === 0) val /= primes[i];
                                }
                                return val;
                            }

                            // Compute G = sum of mu(d)^2 * prod(g(p)/(1-g(p))) / g(d)
                            var G = 0;
                            for (var i = 0; i < divs.length; i++) {
                                var d = divs[i];
                                var mu2 = mobius(d) !== 0 ? 1 : 0;
                                if (!mu2) continue;
                                var gd = gFunc(d);
                                var prod = 1;
                                for (var j = 0; j < primes.length && primes[j] < zVal; j++) {
                                    if (d % primes[j] === 0) {
                                        var gp = 1.0 / primes[j];
                                        prod *= gp / (1 - gp);
                                    }
                                }
                                G += mu2 * prod / gd;
                            }
                            if (G < 0.01) G = 1;

                            // Approximate Selberg weights: lambda_d ~ mu(d) * (1/G) * sum...
                            // Simplified: lambda_d = mu(d) * (log(D/d) / log(D)) for D = product of primes < z
                            var logD = 0;
                            for (var k = 0; k < primes.length && primes[k] < zVal; k++) logD += Math.log(primes[k]);
                            if (logD < 1) logD = 1;

                            var lambdas = [];
                            var muValues = [];
                            for (var m = 0; m < divs.length; m++) {
                                var dd = divs[m];
                                var logd = Math.log(dd);
                                var lam = mobius(dd) * Math.max(0, (logD - logd) / logD);
                                lambdas.push(lam);
                                muValues.push(mobius(dd));
                            }

                            // Draw bars
                            var chartL = 60, chartR = viz.width - 20;
                            var chartW = chartR - chartL;
                            var barW = Math.min(12, chartW / divs.length - 1);
                            var baseline = 280;
                            var scale = 100;

                            // Axis
                            ctx.strokeStyle = viz.colors.axis; ctx.lineWidth = 1;
                            ctx.beginPath(); ctx.moveTo(chartL, baseline); ctx.lineTo(chartR, baseline); ctx.stroke();

                            ctx.fillStyle = viz.colors.text; ctx.font = '10px -apple-system,sans-serif';
                            ctx.textAlign = 'center';

                            for (var n = 0; n < divs.length; n++) {
                                var bx = chartL + n * (barW + 1);

                                // Selberg weight bar
                                var h1 = lambdas[n] * scale;
                                ctx.fillStyle = viz.colors.teal + '88';
                                ctx.fillRect(bx, baseline - h1, barW / 2, h1);

                                // Mobius weight bar (offset)
                                var h2 = muValues[n] * scale * 0.8;
                                ctx.fillStyle = viz.colors.orange + '66';
                                ctx.fillRect(bx + barW / 2, baseline - h2, barW / 2, h2);

                                // Label every few
                                if (divs.length <= 20 || n % Math.ceil(divs.length / 20) === 0) {
                                    ctx.fillStyle = viz.colors.text;
                                    ctx.save();
                                    ctx.translate(bx + barW / 2, baseline + 4);
                                    ctx.rotate(Math.PI / 3);
                                    ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
                                    ctx.fillText(divs[n].toString(), 0, 0);
                                    ctx.restore();
                                }
                            }

                            // Legend
                            ctx.fillStyle = viz.colors.teal;
                            ctx.fillRect(viz.width / 2 - 120, 44, 10, 10);
                            ctx.fillStyle = viz.colors.text; ctx.font = '11px -apple-system,sans-serif';
                            ctx.textAlign = 'left'; ctx.fillText('\u03BB_d (Selberg)', viz.width / 2 - 106, 53);

                            ctx.fillStyle = viz.colors.orange;
                            ctx.fillRect(viz.width / 2 + 20, 44, 10, 10);
                            ctx.fillStyle = viz.colors.text;
                            ctx.fillText('\u03BC(d) (Legendre)', viz.width / 2 + 34, 53);

                            viz.screenText('G(D) \u2248 ' + G.toFixed(2), viz.width / 2, viz.height - 16, viz.colors.teal, 12);
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Show that if \\(\\lambda_1 = 1\\), then \\(\\left(\\sum_{d \\mid n} \\lambda_d\\right)^2 \\geq 1\\) whenever \\(\\gcd(n, P(z)) = 1\\).',
                    hint: 'When \\(\\gcd(n, P(z)) = 1\\), the only \\(d \\mid P(z)\\) with \\(d \\mid n\\) is \\(d = 1\\).',
                    solution: 'If \\(\\gcd(n, P(z)) = 1\\), then no prime \\(p < z\\) divides \\(n\\), so the only divisor \\(d\\) of \\(P(z)\\) that also divides \\(n\\) is \\(d = 1\\). Thus \\(\\sum_{d \\mid (n, P(z))} \\lambda_d = \\lambda_1 = 1\\), and \\(1^2 = 1 \\geq 1\\).'
                },
                {
                    question: 'Verify that \\(G(D) \\sim \\frac{1}{2} \\log N\\) when \\(D = \\sqrt{N}\\), \\(g(p) = 1/p\\), and the sum runs over all squarefree \\(d \\leq D\\) composed of primes \\(p < \\sqrt{N}\\).',
                    hint: 'Use the fact that \\(\\sum_{d \\leq D} \\mu(d)^2 \\prod_{p \\mid d} \\frac{1}{p-1} = \\sum_{d \\leq D} \\frac{\\mu(d)^2}{\\phi(d)} \\sim C \\log D\\) for a constant \\(C\\) related to \\(\\prod_p (1 - 1/p(p-1))^{-1}\\).',
                    solution: 'We have \\(\\frac{\\mu(d)^2}{g(d)} \\prod_{p \\mid d} \\frac{g(p)}{1-g(p)} = \\mu(d)^2 \\prod_{p \\mid d} p \\cdot \\frac{1/p}{1-1/p} = \\mu(d)^2 \\prod_{p \\mid d} \\frac{1}{1-1/p} = \\frac{\\mu(d)^2 d}{\\phi(d)}\\). By Mertens\' theorem, \\(\\sum_{d \\leq D} \\frac{\\mu(d)^2}{\\phi(d)} \\sim \\frac{\\log D}{\\zeta(2)} \\cdot C\\), and with \\(D = \\sqrt{N}\\), the leading term is \\(\\sim \\frac{1}{2} \\log N\\) after accounting for the Euler product constant.'
                }
            ]
        },

        // ================================================================
        // SECTION 3: Sieve Dimension
        // ================================================================
        {
            id: 'sec-sieve-dimension',
            title: 'Sieve Dimension',
            content: `
<h2>Sieve Dimension</h2>

<div class="env-block intuition">
    <div class="env-title">What Controls the Sieve?</div>
    <div class="env-body">
        <p>Different sifting problems have different "densities" of divisibility. Sifting for primes, each residue class mod \\(p\\) removes about \\(1/p\\) of the integers. Sifting for twin primes, each prime \\(p > 2\\) removes about \\(2/p\\) of the candidates. The <em>sieve dimension</em> \\(\\kappa\\) captures this density and determines the strength of sieve bounds.</p>
    </div>
</div>

<h3>Definition and Examples</h3>

<div class="env-block definition">
    <div class="env-title">Definition (Sieve Dimension)</div>
    <div class="env-body">
        <p>A sieve problem has <strong>dimension</strong> \\(\\kappa > 0\\) if the multiplicative function \\(g\\) in the density decomposition satisfies</p>
        \\[
        \\sum_{p < z} g(p) \\log p = \\kappa \\log z + O(1) \\quad \\text{as } z \\to \\infty.
        \\]
        <p>Equivalently, \\(\\prod_{p < z} (1 - g(p))^{-1} \\asymp (\\log z)^\\kappa\\).</p>
    </div>
</div>

<div class="env-block example">
    <div class="env-title">Sieve Dimensions of Classical Problems</div>
    <div class="env-body">
        <ul>
            <li><strong>Primes</strong> (\\(g(p) = 1/p\\)): \\(\\sum_{p<z} \\frac{\\log p}{p} = \\log z + O(1)\\) by Mertens, so \\(\\kappa = 1\\).</li>
            <li><strong>Twin primes</strong> (\\(g(p) = 2/p\\) for \\(p > 2\\)): \\(\\kappa = 2\\).</li>
            <li><strong>Goldbach representations</strong> (\\(g(p) = 2/(p-1)\\) roughly): \\(\\kappa = 2\\).</li>
            <li><strong>Primes in arithmetic progressions</strong> (\\(g(p) = 1/(p-1)\\) for \\(p \\nmid q\\)): \\(\\kappa = 1\\).</li>
        </ul>
    </div>
</div>

<h3>The Fundamental Lemma of Sieve Theory</h3>

<div class="env-block theorem">
    <div class="env-title">Theorem 12.2 (Fundamental Lemma)</div>
    <div class="env-body">
        <p>For a sieve of dimension \\(\\kappa\\), with level \\(D = z^s\\), the Selberg upper-bound sieve gives</p>
        \\[
        S(\\mathcal{A}, \\mathcal{P}, z) \\leq X \\cdot V(z) \\left(F_\\kappa(s) + o(1)\\right) + R,
        \\]
        <p>where \\(V(z) = \\prod_{p < z} (1 - g(p))\\) and \\(F_\\kappa(s)\\) is a continuous function of \\(s\\) depending on the dimension \\(\\kappa\\). Similarly, lower-bound sieves give a factor \\(f_\\kappa(s)\\).</p>
    </div>
</div>

<p>The sieve limit functions \\(F_\\kappa(s)\\) and \\(f_\\kappa(s)\\) satisfy a system of differential-delay equations:</p>

\\[
\\begin{cases}
(s^\\kappa F_\\kappa(s))' = -\\kappa s^{\\kappa - 1} f_\\kappa(s-1), & s > \\beta_\\kappa, \\\\
(s^\\kappa f_\\kappa(s))' = -\\kappa s^{\\kappa - 1} F_\\kappa(s-1), & s > \\alpha_\\kappa,
\\end{cases}
\\]

<p>with initial conditions \\(F_\\kappa(s) = 1/\\sigma_\\kappa(s)\\) for \\(1 < s \\leq \\beta_\\kappa\\) and \\(f_\\kappa(s) = 0\\) for \\(0 < s \\leq \\alpha_\\kappa\\), where \\(\\sigma_\\kappa\\) is related to the Buchstab function and \\(\\alpha_\\kappa, \\beta_\\kappa\\) are the critical values.</p>

<div class="env-block remark">
    <div class="env-title">Dimension 1: The Sieve of Eratosthenes</div>
    <div class="env-body">
        <p>For \\(\\kappa = 1\\): \\(\\alpha_1 = 1, \\beta_1 = 2\\). When \\(s = 2\\) (i.e., \\(D = z^2\\)), we get \\(F_1(2) = 2\\) and \\(f_1(2) = 0\\). The upper-bound factor of 2 is exactly the Selberg result for primes. The lower bound is trivially zero at \\(s = 2\\), but for \\(s > 2\\) it becomes positive, and both \\(F_1(s) \\to 1\\) and \\(f_1(s) \\to 1\\) as \\(s \\to \\infty\\).</p>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-sieve-limit"></div>
`,
            visualizations: [
                {
                    id: 'viz-sieve-limit',
                    title: 'Sieve Limit Functions \\(F_\\kappa(s)\\) and \\(f_\\kappa(s)\\)',
                    description: 'The upper-bound function \\(F_\\kappa(s)\\) starts above 1 and decreases toward 1. The lower-bound function \\(f_\\kappa(s)\\) starts at 0 and increases toward 1. They converge as the sieve level \\(D = z^s\\) grows. Adjust the dimension \\(\\kappa\\) to see how higher dimension makes sieving harder.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 380,
                            originX: 70, originY: 320, scale: 50
                        });

                        var kappa = 1;
                        VizEngine.createSlider(controls, '\u03BA (dimension)', 1, 4, kappa, 0.5, function(v) {
                            kappa = v; draw();
                        });

                        // Approximate sieve limit functions
                        // For kappa=1: F(s) ~ 2/s for 1 < s <= 3, then approaches 1
                        // For general kappa: F_kappa(s) ~ 1/(sigma(s)) near beta, approaches 1
                        function upperF(s, k) {
                            if (s <= 1) return 10;
                            // Simplified model: F_k(s) = 1 + (2^k - 1) * exp(-(s - 1) * k / 2)
                            var peak = Math.pow(2, k);
                            return 1 + (peak - 1) * Math.exp(-(s - 1) * 0.8 * k);
                        }

                        function lowerF(s, k) {
                            var alpha = 1 + (k - 1) * 0.5; // approximate critical point
                            if (s <= alpha) return 0;
                            // Increases from 0 toward 1
                            return 1 - Math.exp(-(s - alpha) * 0.6 * k);
                        }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            viz.screenText('Sieve Limit Functions for \u03BA = ' + kappa.toFixed(1), viz.width / 2, 20, viz.colors.white, 14);

                            // Chart area
                            var chartL = 70, chartR = viz.width - 30;
                            var chartT = 50, chartB = 320;
                            var chartW = chartR - chartL, chartH = chartB - chartT;

                            var sMax = 8;
                            var yMax = Math.min(Math.pow(2, kappa) + 0.5, 10);

                            // Grid
                            ctx.strokeStyle = viz.colors.grid; ctx.lineWidth = 0.5;
                            for (var gy = 0; gy <= yMax; gy += 0.5) {
                                var py = chartB - (gy / yMax) * chartH;
                                ctx.beginPath(); ctx.moveTo(chartL, py); ctx.lineTo(chartR, py); ctx.stroke();
                                if (gy === Math.round(gy)) {
                                    ctx.fillStyle = viz.colors.text; ctx.font = '10px -apple-system,sans-serif';
                                    ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
                                    ctx.fillText(gy.toString(), chartL - 6, py);
                                }
                            }

                            // y = 1 line
                            var y1 = chartB - (1 / yMax) * chartH;
                            ctx.strokeStyle = viz.colors.white + '44'; ctx.lineWidth = 1;
                            ctx.setLineDash([4, 4]);
                            ctx.beginPath(); ctx.moveTo(chartL, y1); ctx.lineTo(chartR, y1); ctx.stroke();
                            ctx.setLineDash([]);
                            ctx.fillStyle = viz.colors.white; ctx.font = '11px -apple-system,sans-serif';
                            ctx.textAlign = 'left'; ctx.fillText('target = 1', chartR - 60, y1 - 8);

                            // Axes
                            ctx.strokeStyle = viz.colors.axis; ctx.lineWidth = 1.5;
                            ctx.beginPath(); ctx.moveTo(chartL, chartB); ctx.lineTo(chartR, chartB); ctx.stroke();
                            ctx.beginPath(); ctx.moveTo(chartL, chartT); ctx.lineTo(chartL, chartB); ctx.stroke();

                            // x-axis labels
                            ctx.fillStyle = viz.colors.text; ctx.font = '10px -apple-system,sans-serif';
                            ctx.textAlign = 'center'; ctx.textBaseline = 'top';
                            for (var sx = 1; sx <= sMax; sx++) {
                                var px = chartL + (sx / sMax) * chartW;
                                ctx.fillText(sx.toString(), px, chartB + 4);
                            }
                            ctx.fillText('s = log D / log z', (chartL + chartR) / 2, chartB + 20);

                            // Draw F_kappa(s)
                            ctx.strokeStyle = viz.colors.teal; ctx.lineWidth = 2.5;
                            ctx.beginPath();
                            var started = false;
                            for (var i = 0; i <= 200; i++) {
                                var s = 0.05 + sMax * i / 200;
                                var F = upperF(s, kappa);
                                var px2 = chartL + (s / sMax) * chartW;
                                var py2 = chartB - (Math.min(F, yMax) / yMax) * chartH;
                                if (!started) { ctx.moveTo(px2, py2); started = true; }
                                else ctx.lineTo(px2, py2);
                            }
                            ctx.stroke();

                            // Draw f_kappa(s)
                            ctx.strokeStyle = viz.colors.orange; ctx.lineWidth = 2.5;
                            ctx.beginPath();
                            started = false;
                            for (var j = 0; j <= 200; j++) {
                                var s2 = 0.05 + sMax * j / 200;
                                var f = lowerF(s2, kappa);
                                var px3 = chartL + (s2 / sMax) * chartW;
                                var py3 = chartB - (Math.max(0, Math.min(f, yMax)) / yMax) * chartH;
                                if (!started) { ctx.moveTo(px3, py3); started = true; }
                                else ctx.lineTo(px3, py3);
                            }
                            ctx.stroke();

                            // Shade between
                            ctx.fillStyle = viz.colors.purple + '15';
                            ctx.beginPath();
                            for (var a = 0; a <= 200; a++) {
                                var ss = 0.05 + sMax * a / 200;
                                var Fv = Math.min(upperF(ss, kappa), yMax);
                                var pxa = chartL + (ss / sMax) * chartW;
                                var pya = chartB - (Fv / yMax) * chartH;
                                if (a === 0) ctx.moveTo(pxa, pya);
                                else ctx.lineTo(pxa, pya);
                            }
                            for (var b = 200; b >= 0; b--) {
                                var ss2 = 0.05 + sMax * b / 200;
                                var fv = Math.max(0, Math.min(lowerF(ss2, kappa), yMax));
                                var pxb = chartL + (ss2 / sMax) * chartW;
                                var pyb = chartB - (fv / yMax) * chartH;
                                ctx.lineTo(pxb, pyb);
                            }
                            ctx.closePath(); ctx.fill();

                            // Legend
                            ctx.fillStyle = viz.colors.teal;
                            ctx.fillRect(chartL + 10, chartT + 10, 12, 12);
                            ctx.fillStyle = viz.colors.text; ctx.font = '11px -apple-system,sans-serif';
                            ctx.textAlign = 'left'; ctx.fillText('F\u2096(s) upper bound', chartL + 26, chartT + 20);

                            ctx.fillStyle = viz.colors.orange;
                            ctx.fillRect(chartL + 10, chartT + 28, 12, 12);
                            ctx.fillStyle = viz.colors.text;
                            ctx.fillText('f\u2096(s) lower bound', chartL + 26, chartT + 38);
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Compute the sieve dimension \\(\\kappa\\) for the problem of counting integers \\(n \\leq N\\) such that both \\(n\\) and \\(n+2\\) have no prime factor below \\(z\\).',
                    hint: 'For each prime \\(p > 2\\), we remove \\(n\\) if \\(p \\mid n\\) or \\(p \\mid n+2\\), so about \\(2/p\\) of residues mod \\(p\\) are removed. What is \\(g(p)\\)?',
                    solution: 'For the twin prime sieve, \\(g(p) = 2/p\\) for \\(p > 2\\) (and \\(g(2) = 1/2\\)). Then \\(\\sum_{p < z} g(p) \\log p \\approx 2 \\sum_{p < z} \\frac{\\log p}{p} \\sim 2 \\log z\\). So \\(\\kappa = 2\\).'
                },
                {
                    question: 'Why does higher sieve dimension make the problem harder? Explain intuitively why the sieve limit functions converge to 1 more slowly when \\(\\kappa\\) is larger.',
                    hint: 'Think about how many residue classes are being removed per prime.',
                    solution: 'Higher \\(\\kappa\\) means each prime removes a larger fraction of the candidates. The sieve has to work harder because more overlap and "wasteful" sifting occurs. The product \\(V(z) = \\prod_{p<z}(1-g(p))\\) shrinks faster, so the sieve needs higher level \\(D = z^s\\) (larger \\(s\\)) before the sieve limit functions get close to 1. In dimension \\(\\kappa = 2\\), the lower-bound sieve needs \\(s > 2\\) to become positive at all, compared to \\(s > 1\\) for \\(\\kappa = 1\\).'
                }
            ]
        },

        // ================================================================
        // SECTION 4: Lower-Bound Sieves (Rosser-Iwaniec / Beta Sieve)
        // ================================================================
        {
            id: 'sec-lower-bounds',
            title: 'Lower-Bound Sieves',
            content: `
<h2>Lower-Bound Sieves: Rosser-Iwaniec and the Beta Sieve</h2>

<div class="env-block intuition">
    <div class="env-title">The Challenge of Lower Bounds</div>
    <div class="env-body">
        <p>Selberg's \\(\\Lambda^2\\) method gives excellent upper bounds but cannot produce lower bounds: a sum of squares is always non-negative, so the method only shows \\(S \\leq \\text{something}\\). For lower bounds, we need a different approach. The Rosser-Iwaniec sieve achieves this by carefully managing the signs in a truncated M&ouml;bius inversion, combining the combinatorial insight of Brun with the optimization spirit of Selberg.</p>
    </div>
</div>

<h3>The Need for Lower Bounds</h3>

<p>Many important theorems require showing that sifted sets are <em>non-empty</em>:</p>
<ul>
    <li><strong>Chen's theorem</strong>: every sufficiently large even number is \\(p + P_2\\) (prime plus product of at most 2 primes).</li>
    <li><strong>Iwaniec's theorem</strong>: infinitely many \\(n\\) with \\(n^2 + 1\\) having at most 2 prime factors.</li>
    <li><strong>Bounded gaps between primes</strong>: the GPY sieve and its extensions by Maynard and Tao.</li>
</ul>

<p>For all of these, upper bounds alone are insufficient; we need lower bounds on the sifting function \\(S\\).</p>

<h3>Buchstab's Identity</h3>

<div class="env-block theorem">
    <div class="env-title">Theorem 12.3 (Buchstab's Identity)</div>
    <div class="env-body">
        <p>For \\(2 \\leq w < z\\),</p>
        \\[
        S(\\mathcal{A}, \\mathcal{P}, z) = S(\\mathcal{A}, \\mathcal{P}, w) - \\sum_{w \\leq p < z} S(\\mathcal{A}_p, \\mathcal{P}, p).
        \\]
        <p>This decomposes the sifting function by the smallest prime factor in the range \\([w, z)\\).</p>
    </div>
</div>

<p>Buchstab's identity is the recursive engine behind modern lower-bound sieves. By iterating it, choosing to apply upper or lower bounds at each stage, one can build alternating estimates that give both-sided bounds.</p>

<h3>The Rosser-Iwaniec Sieve</h3>

<div class="env-block theorem">
    <div class="env-title">Theorem 12.4 (Rosser-Iwaniec Linear Sieve)</div>
    <div class="env-body">
        <p>For a sieve problem of dimension \\(\\kappa = 1\\), with level \\(D\\) and \\(s = \\log D / \\log z \\geq 1\\), there exist sieve weights giving</p>
        \\[
        f_1(s) \\cdot X V(z) + R^- \\leq S(\\mathcal{A}, \\mathcal{P}, z) \\leq F_1(s) \\cdot X V(z) + R^+,
        \\]
        <p>where \\(F_1\\) and \\(f_1\\) satisfy the differential-delay system:</p>
        \\[
        (s F_1(s))' = f_1(s-1), \\quad (s f_1(s))' = F_1(s-1),
        \\]
        <p>with \\(F_1(s) = 2e^\\gamma / s\\) for \\(1 < s \\leq 3\\) and \\(f_1(s) = 0\\) for \\(0 < s \\leq 2\\), and \\(\\gamma\\) is the Euler-Mascheroni constant.</p>
    </div>
</div>

<h3>The Beta Sieve (\\(\\kappa = 2\\))</h3>

<p>For dimension \\(\\kappa = 2\\) (the "beta sieve"), relevant for twin primes and Goldbach, the critical values shift:</p>

<ul>
    <li>\\(f_2(s) = 0\\) for \\(s \\leq 2\\) and becomes positive for \\(s > 2\\).</li>
    <li>\\(F_2(s) = 4 e^{2\\gamma} / s^2\\) for \\(1 < s \\leq \\beta_2 \\approx 3\\).</li>
</ul>

<p>The parity problem (next section) prevents \\(f_\\kappa(s)\\) from exceeding a certain threshold for dimension \\(\\kappa \\geq 1\\), no matter how large \\(s\\) is taken.</p>

<div class="viz-placeholder" data-viz="viz-upper-lower-bounds"></div>

<div class="env-block example">
    <div class="env-title">Example: Chen's Theorem Setup</div>
    <div class="env-body">
        <p>To prove that \\(N = p + P_2\\), Chen uses a weighted sieve combining \\(S(\\mathcal{A}, z)\\) with \\(S(\\mathcal{A}_p, z)\\) terms. The dimension-2 lower-bound sieve provides \\(S \\geq c \\cdot N / (\\log N)^2\\) for the set of \\(n\\) with \\(N - n\\) having at most 2 prime factors. The key is that the lower-bound sieve, while weaker than the upper, still gives a positive result when \\(s\\) is large enough.</p>
    </div>
</div>
`,
            visualizations: [
                {
                    id: 'viz-upper-lower-bounds',
                    title: 'Upper and Lower Sieve Bounds for Primes up to N',
                    description: 'Compare the Selberg upper bound and Rosser-Iwaniec lower bound for \\(\\pi(N)\\) as the sieve level varies. The true \\(\\pi(N)\\) is sandwiched between them. The gap narrows as the level increases, but can never close completely due to the parity barrier.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 380,
                            originX: 70, originY: 330, scale: 1
                        });

                        var logN = 5;
                        VizEngine.createSlider(controls, 'log\u2081\u2080 N', 3, 6, logN, 0.5, function(v) {
                            logN = v; draw();
                        });

                        var primes = VizEngine.sievePrimes(1000000);

                        function piCount(n) {
                            var c = 0;
                            for (var i = 0; i < primes.length && primes[i] <= n; i++) c++;
                            return c;
                        }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var N = Math.round(Math.pow(10, logN));

                            viz.screenText('Sieve Bounds vs \u03C0(N) as sieve level s varies', viz.width / 2, 20, viz.colors.white, 13);

                            var pi = piCount(N);
                            var logNN = Math.log(N);
                            var Vz = 1;
                            var zz = Math.sqrt(N);
                            for (var i = 0; i < primes.length && primes[i] < zz; i++) {
                                Vz *= (1 - 1.0 / primes[i]);
                            }
                            var XVz = N * Vz; // base sieve estimate

                            // Chart area
                            var chartL = 80, chartR = viz.width - 30;
                            var chartT = 50, chartB = 310;
                            var chartW = chartR - chartL, chartH = chartB - chartT;

                            var sMax = 8;
                            var yMax = pi * 3.5;
                            if (yMax < 1) yMax = 100;

                            // Grid
                            ctx.strokeStyle = viz.colors.grid; ctx.lineWidth = 0.5;
                            for (var g = 0; g <= 4; g++) {
                                var gy = chartB - (g / 4) * chartH;
                                ctx.beginPath(); ctx.moveTo(chartL, gy); ctx.lineTo(chartR, gy); ctx.stroke();
                                ctx.fillStyle = viz.colors.text; ctx.font = '10px -apple-system,sans-serif';
                                ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
                                ctx.fillText(Math.round(yMax * g / 4).toString(), chartL - 6, gy);
                            }

                            // Axes
                            ctx.strokeStyle = viz.colors.axis; ctx.lineWidth = 1.5;
                            ctx.beginPath(); ctx.moveTo(chartL, chartB); ctx.lineTo(chartR, chartB); ctx.stroke();
                            ctx.beginPath(); ctx.moveTo(chartL, chartT); ctx.lineTo(chartL, chartB); ctx.stroke();

                            // pi(N) horizontal line
                            var piY = chartB - (pi / yMax) * chartH;
                            ctx.strokeStyle = viz.colors.blue; ctx.lineWidth = 2;
                            ctx.setLineDash([6, 4]);
                            ctx.beginPath(); ctx.moveTo(chartL, piY); ctx.lineTo(chartR, piY); ctx.stroke();
                            ctx.setLineDash([]);
                            ctx.fillStyle = viz.colors.blue; ctx.font = '11px -apple-system,sans-serif';
                            ctx.textAlign = 'left'; ctx.fillText('\u03C0(N) = ' + pi, chartR - 80, piY - 8);

                            // Upper bound curve: F_1(s) * X * V(z)
                            function upperBound(s) {
                                if (s <= 0.5) return yMax * 2;
                                var F = 1 + 1.0 * Math.exp(-(s - 1) * 0.8);
                                return F * XVz;
                            }

                            // Lower bound curve: f_1(s) * X * V(z)
                            function lowerBound(s) {
                                if (s <= 1) return 0;
                                var f = 1 - Math.exp(-(s - 1) * 0.6);
                                return f * XVz;
                            }

                            // Draw upper bound
                            ctx.strokeStyle = viz.colors.red; ctx.lineWidth = 2.5;
                            ctx.beginPath();
                            var started = false;
                            for (var j = 0; j <= 200; j++) {
                                var s = 0.5 + sMax * j / 200;
                                var val = upperBound(s);
                                var px = chartL + (s / sMax) * chartW;
                                var py = chartB - (Math.min(val, yMax) / yMax) * chartH;
                                py = Math.max(chartT, py);
                                if (!started) { ctx.moveTo(px, py); started = true; }
                                else ctx.lineTo(px, py);
                            }
                            ctx.stroke();

                            // Draw lower bound
                            ctx.strokeStyle = viz.colors.green; ctx.lineWidth = 2.5;
                            ctx.beginPath();
                            started = false;
                            for (var k = 0; k <= 200; k++) {
                                var s2 = 0.5 + sMax * k / 200;
                                var val2 = lowerBound(s2);
                                var px2 = chartL + (s2 / sMax) * chartW;
                                var py2 = chartB - (Math.max(0, Math.min(val2, yMax)) / yMax) * chartH;
                                if (!started) { ctx.moveTo(px2, py2); started = true; }
                                else ctx.lineTo(px2, py2);
                            }
                            ctx.stroke();

                            // x-axis label
                            ctx.fillStyle = viz.colors.text; ctx.font = '10px -apple-system,sans-serif';
                            ctx.textAlign = 'center'; ctx.textBaseline = 'top';
                            for (var sx = 1; sx <= sMax; sx++) {
                                var pxs = chartL + (sx / sMax) * chartW;
                                ctx.fillText(sx.toString(), pxs, chartB + 4);
                            }
                            ctx.fillText('s = log D / log z', (chartL + chartR) / 2, chartB + 20);

                            // Legend
                            var legY = chartB + 38;
                            ctx.fillStyle = viz.colors.red; ctx.fillRect(chartL + 20, legY, 10, 10);
                            ctx.fillStyle = viz.colors.text; ctx.textAlign = 'left';
                            ctx.fillText('Upper (Selberg)', chartL + 34, legY + 9);

                            ctx.fillStyle = viz.colors.green; ctx.fillRect(chartL + 150, legY, 10, 10);
                            ctx.fillStyle = viz.colors.text;
                            ctx.fillText('Lower (Rosser-Iwaniec)', chartL + 164, legY + 9);

                            ctx.fillStyle = viz.colors.blue; ctx.fillRect(chartL + 320, legY, 10, 10);
                            ctx.fillStyle = viz.colors.text;
                            ctx.fillText('\u03C0(N) actual', chartL + 334, legY + 9);
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Prove Buchstab\'s identity: \\(S(\\mathcal{A}, \\mathcal{P}, z) = S(\\mathcal{A}, \\mathcal{P}, w) - \\sum_{w \\leq p < z} S(\\mathcal{A}_p, \\mathcal{P}, p)\\).',
                    hint: 'Partition the set \\(\\{a \\in \\mathcal{A} : (a, P(w)) = 1\\}\\) according to whether \\((a, P(z)) = 1\\) or \\(a\\) has a smallest prime factor \\(p\\) with \\(w \\leq p < z\\).',
                    solution: 'Let \\(B = \\{a \\in \\mathcal{A} : (a, P(w)) = 1\\}\\), so \\(|B| = S(\\mathcal{A}, \\mathcal{P}, w)\\). Partition \\(B\\) as: (i) elements with no prime factor in \\([w, z)\\), which is \\(S(\\mathcal{A}, \\mathcal{P}, z)\\), and (ii) for each prime \\(p \\in [w, z)\\), elements whose smallest prime factor in \\([w, z)\\) is \\(p\\). The latter set consists of elements of \\(\\mathcal{A}_p\\) with no prime factor below \\(p\\), i.e., \\(S(\\mathcal{A}_p, \\mathcal{P}, p)\\). Summing: \\(S(\\mathcal{A}, w) = S(\\mathcal{A}, z) + \\sum_{w \\leq p < z} S(\\mathcal{A}_p, p)\\). Rearranging gives the identity.'
                },
            ]
        },

        // ================================================================
        // SECTION 5: The Parity Problem
        // ================================================================
        {
            id: 'sec-parity',
            title: 'The Parity Problem',
            content: `
<h2>The Parity Problem</h2>

<div class="env-block intuition">
    <div class="env-title">The Invisible Wall</div>
    <div class="env-body">
        <p>Why can't the Selberg sieve detect the exact number of primes? Why is the factor of 2 in the upper bound \\(\\pi(N) \\leq (2+o(1)) N/\\log N\\) not just a technical limitation but a <em>theorem</em>? The answer is the <strong>parity problem</strong>: sieves that only use information about how many elements of \\(\\mathcal{A}\\) fall into residue classes cannot distinguish between numbers with an even number of prime factors and those with an odd number.</p>
    </div>
</div>

<h3>The Bombieri Phenomenon</h3>

<p>Consider two sequences:</p>
<ul>
    <li>\\(\\mathcal{A} = \\{n \\leq N : \\Omega(n) \\text{ is odd}\\}\\) (numbers with an odd number of prime factors, counted with multiplicity)</li>
    <li>\\(\\mathcal{B} = \\{n \\leq N : \\Omega(n) \\text{ is even}\\}\\)</li>
</ul>

<p>These two sets have essentially the same density in every residue class modulo any \\(d\\): for \\(d\\) squarefree,</p>

\\[
|\\mathcal{A}_d| \\approx |\\mathcal{B}_d| \\approx \\frac{N}{2d}.
\\]

<p>Yet one set contains all the primes and the other contains none (except for contributions from prime powers). A sieve that only uses the counts \\(|\\mathcal{A}_d|\\) cannot distinguish between \\(\\mathcal{A}\\) and \\(\\mathcal{B}\\).</p>

<div class="env-block theorem">
    <div class="env-title">Theorem 12.5 (Selberg's Parity Barrier)</div>
    <div class="env-body">
        <p>Any "sieve of dimension 1" that uses only the information \\(|\\mathcal{A}_d|\\) for \\(d \\leq D\\) with \\(D < N\\) satisfies</p>
        \\[
        S(\\mathcal{A}, z) \\leq (2 + o(1)) \\frac{N}{\\log N}
        \\]
        <p>as an upper bound, and</p>
        \\[
        S(\\mathcal{A}, z) \\geq 0
        \\]
        <p>as a lower bound. Neither bound can be improved to match the true \\(\\pi(N) \\sim N / \\log N\\) within the sieve framework alone.</p>
    </div>
</div>

<h3>Why Factor of 2?</h3>

<p>The sieve cannot tell apart:</p>
<ul>
    <li>Integers with \\(\\Omega(n)\\) odd: contains primes \\(p\\), \\(p_1 p_2 p_3\\), etc.</li>
    <li>Integers with \\(\\Omega(n)\\) even: contains \\(p_1 p_2\\), \\(p_1 p_2 p_3 p_4\\), etc.</li>
</ul>

<p>The sieve's upper bound for "numbers with no small prime factor" counts <em>both</em> groups equally, hence overcounts the primes by a factor of 2. More precisely, the sieve gives an upper bound for \\(S(\\mathcal{A}, z) + S(\\mathcal{B}', z)\\) where \\(\\mathcal{B}'\\) is a "phantom" set with the same local densities.</p>

<div class="viz-placeholder" data-viz="viz-parity-barrier"></div>

<h3>Breaking the Parity Barrier</h3>

<p>The parity problem is <em>not</em> a theorem about number theory; it is a theorem about sieves. It says that pure sieve methods, using only "Type I" information (average distribution in arithmetic progressions), cannot detect primes exactly. To break the barrier, one needs:</p>

<ul>
    <li><strong>Type II information</strong>: bilinear sums involving the M&ouml;bius function \\(\\mu\\) or the Liouville function \\(\\lambda\\), as in Vinogradov's method.</li>
    <li><strong>Algebraic information</strong>: knowing that certain polynomial values are prime (Friedlander-Iwaniec \\(a^2 + b^4\\) theorem).</li>
    <li><strong>Combinatorial identity</strong>: Vaughan's identity, Heath-Brown's identity, which decompose the von Mangoldt function \\(\\Lambda\\) into Type I and Type II components.</li>
</ul>

<div class="env-block remark">
    <div class="env-title">Bombieri's Dictum</div>
    <div class="env-body">
        <p>"The parity problem is the central difficulty of sieve methods." Every major advance in analytic number theory that goes beyond what basic sieves provide (Chen's theorem, Bombieri-Friedlander-Iwaniec, Maynard-Tao bounded gaps) requires some mechanism to break parity, whether through bilinear forms, arithmetic structure, or level of distribution beyond the square root barrier.</p>
    </div>
</div>
`,
            visualizations: [
                {
                    id: 'viz-parity-barrier',
                    title: 'The Parity Barrier: Sieve Cannot Distinguish Odd vs Even \\(\\Omega\\)',
                    description: 'Compare numbers with an odd number of prime factors (contains primes) vs even number. Their distribution in residue classes is nearly identical, making them invisible to sieves. The bar chart shows counts modulo small primes.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 380,
                            originX: 0, originY: 0, scale: 1
                        });

                        var N = 200;
                        VizEngine.createSlider(controls, 'N', 50, 500, N, 50, function(v) {
                            N = Math.round(v); draw();
                        });

                        function bigOmega(n) {
                            var count = 0;
                            var m = n;
                            for (var p = 2; p * p <= m; p++) {
                                while (m % p === 0) { count++; m /= p; }
                            }
                            if (m > 1) count++;
                            return count;
                        }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            viz.screenText('Parity Barrier: \u03A9(n) odd vs even in residue classes', viz.width / 2, 20, viz.colors.white, 13);

                            var moduli = [2, 3, 5, 7, 11, 13];
                            var chartL = 40, chartR = viz.width - 20;
                            var chartT = 50, chartB = 300;
                            var chartW = chartR - chartL, chartH = chartB - chartT;

                            // For each modulus, count odd-Omega vs even-Omega per residue class
                            var modW = chartW / moduli.length;

                            for (var mi = 0; mi < moduli.length; mi++) {
                                var mod = moduli[mi];
                                var oddCounts = new Array(mod).fill(0);
                                var evenCounts = new Array(mod).fill(0);

                                for (var n = 2; n <= N; n++) {
                                    var r = n % mod;
                                    if (bigOmega(n) % 2 === 1) oddCounts[r]++;
                                    else evenCounts[r]++;
                                }

                                var maxC = 0;
                                for (var r2 = 0; r2 < mod; r2++) {
                                    maxC = Math.max(maxC, oddCounts[r2], evenCounts[r2]);
                                }
                                if (maxC < 1) maxC = 1;

                                var blockL = chartL + mi * modW + 5;
                                var blockR = chartL + (mi + 1) * modW - 5;
                                var blockW = blockR - blockL;

                                // Label
                                ctx.fillStyle = viz.colors.white; ctx.font = '11px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.fillText('mod ' + mod, (blockL + blockR) / 2, chartT - 8);

                                var bw = Math.min(10, blockW / (mod * 2.5));

                                for (var r3 = 0; r3 < mod; r3++) {
                                    var bx = blockL + (r3 / mod) * blockW;

                                    // Odd bar
                                    var h1 = (oddCounts[r3] / maxC) * chartH;
                                    ctx.fillStyle = viz.colors.teal;
                                    ctx.fillRect(bx, chartB - h1, bw, h1);

                                    // Even bar
                                    var h2 = (evenCounts[r3] / maxC) * chartH;
                                    ctx.fillStyle = viz.colors.orange;
                                    ctx.fillRect(bx + bw + 1, chartB - h2, bw, h2);
                                }
                            }

                            // Axis
                            ctx.strokeStyle = viz.colors.axis; ctx.lineWidth = 1;
                            ctx.beginPath(); ctx.moveTo(chartL, chartB); ctx.lineTo(chartR, chartB); ctx.stroke();

                            // Legend
                            var legY = chartB + 20;
                            ctx.fillStyle = viz.colors.teal; ctx.fillRect(viz.width / 2 - 100, legY, 10, 10);
                            ctx.fillStyle = viz.colors.text; ctx.font = '11px -apple-system,sans-serif';
                            ctx.textAlign = 'left'; ctx.fillText('\u03A9(n) odd (has primes)', viz.width / 2 - 86, legY + 9);

                            ctx.fillStyle = viz.colors.orange; ctx.fillRect(viz.width / 2 - 100, legY + 18, 10, 10);
                            ctx.fillStyle = viz.colors.text;
                            ctx.fillText('\u03A9(n) even (no primes)', viz.width / 2 - 86, legY + 27);

                            viz.screenText('Nearly identical in every residue class \u2014 sieve cannot tell them apart',
                                viz.width / 2, legY + 48, viz.colors.yellow, 11);
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Let \\(\\lambda(n) = (-1)^{\\Omega(n)}\\) be the Liouville function. Show that \\(\\sum_{d \\mid n} \\lambda(d) = \\begin{cases} 1 & \\text{if } n \\text{ is a perfect square}, \\\\ 0 & \\text{otherwise.} \\end{cases}\\)',
                    hint: 'The Liouville function is completely multiplicative: \\(\\lambda(mn) = \\lambda(m)\\lambda(n)\\). Use the Euler product of \\(\\sum_{n} \\lambda(n)/n^s\\).',
                    solution: 'Since \\(\\lambda\\) is completely multiplicative, \\(\\sum_{d \\mid n} \\lambda(d) = \\prod_{p^a \\| n} \\sum_{k=0}^{a} \\lambda(p^k) = \\prod_{p^a \\| n} \\sum_{k=0}^{a} (-1)^k\\). This sum is 1 if \\(a\\) is even and 0 if \\(a\\) is odd. Hence the product is 1 iff every prime power in the factorization has even exponent, i.e., \\(n\\) is a perfect square.'
                },
                {
                    question: 'Explain why the prime number theorem \\(\\pi(N) \\sim N/\\log N\\) is equivalent to \\(\\sum_{n \\leq N} \\lambda(n) = o(N)\\).',
                    hint: 'The PNT is equivalent to \\(\\sum_{n \\leq N} \\mu(n) = o(N)\\). How does \\(\\lambda\\) relate to \\(\\mu\\)?',
                    solution: 'We have \\(\\lambda(n) = \\sum_{d^2 \\mid n} \\mu(n/d^2)\\), so \\(\\sum_{n \\leq N} \\lambda(n) = \\sum_{d \\leq \\sqrt{N}} \\sum_{m \\leq N/d^2} \\mu(m)\\). If PNT holds, then \\(\\sum_{m \\leq X} \\mu(m) = o(X)\\) for each \\(X\\), giving \\(\\sum \\lambda(n) = o(N)\\). Conversely, if \\(\\sum \\lambda(n) = o(N)\\), M&ouml;bius inversion recovers \\(\\sum \\mu(n) = o(N)\\). The parity problem says sieves cannot prove this cancellation, since distinguishing \\(\\lambda = +1\\) from \\(\\lambda = -1\\) is precisely what sieves fail at.'
                }
            ]
        },

        // ================================================================
        // SECTION 6: The Bridge — From Sieves to Modern Breakthroughs
        // ================================================================
        {
            id: 'sec-bridge',
            title: 'The Bridge to Modern Results',
            content: `
<h2>The Bridge: From Selberg's Sieve to Modern Breakthroughs</h2>

<div class="env-block intuition">
    <div class="env-title">Sieves as Infrastructure</div>
    <div class="env-body">
        <p>Selberg's sieve is not just an endpoint; it is a launching pad. The optimization framework, the sieve limit functions, and the understanding of the parity barrier form the infrastructure on which the major results of the last 50 years are built. From Bombieri's large sieve (Chapter 13) to Maynard's multidimensional sieve for bounded gaps, the evolution of sieve methods traces a remarkable arc from combinatorics through optimization to probability.</p>
    </div>
</div>

<h3>The GPY Sieve (Goldston-Pintz-Y\u0131ld\u0131r\u0131m)</h3>

<p>The GPY method (2005) introduced a weighted sieve approach to gaps between primes. Instead of sifting a single sequence, they consider the quantity</p>

\\[
\\sum_{N < n \\leq 2N} \\left(\\sum_{i=1}^{k} \\mathbf{1}_{\\text{prime}}(n + h_i) - 1\\right) w(n)^2,
\\]

<p>where \\(w(n)\\) is a weight function and \\(\\mathcal{H} = \\{h_1, \\ldots, h_k\\}\\) is an admissible \\(k\\)-tuple. If this sum is positive, then for some \\(n\\), at least two of the \\(n + h_i\\) are prime.</p>

<p>GPY showed that with optimal weights, one can prove \\(\\liminf_{n \\to \\infty} (p_{n+1} - p_n) / \\log p_n = 0\\), i.e., primes are denser than average infinitely often. But their method fell just short of bounded gaps.</p>

<h3>Maynard-Tao: Multidimensional Selberg Sieve</h3>

<p>The breakthrough of Maynard (2013) and Tao (independently) was to replace GPY's one-dimensional weight with a <em>multidimensional</em> Selberg sieve weight:</p>

\\[
w(n) = \\left(\\sum_{\\substack{d_1 \\mid n+h_1 \\\\ \\vdots \\\\ d_k \\mid n+h_k}} \\lambda_{d_1, \\ldots, d_k}\\right)^2.
\\]

<p>The optimization is now over a function of \\(k\\) variables, and the resulting eigenvalue problem has a solution that gives</p>

\\[
\\liminf_{n \\to \\infty} (p_{n+m} - p_n) < \\infty \\quad \\text{for every fixed } m.
\\]

<div class="env-block theorem">
    <div class="env-title">Theorem 12.6 (Maynard-Tao, 2013)</div>
    <div class="env-body">
        <p>There exists an absolute constant \\(C\\) such that</p>
        \\[
        \\liminf_{n \\to \\infty} (p_{n+1} - p_n) \\leq C.
        \\]
        <p>Maynard obtained \\(C = 600\\); subsequent Polymath project work reduced this to \\(C = 246\\). Under the Elliott-Halberstam conjecture, \\(C = 6\\).</p>
    </div>
</div>

<h3>Zhang's Theorem and Level of Distribution</h3>

<p>Yitang Zhang (2013) achieved the first proof of bounded gaps by combining the GPY framework with a proof that primes have level of distribution slightly beyond \\(1/2\\), for smooth moduli. His work showed:</p>

\\[
\\liminf_{n \\to \\infty} (p_{n+1} - p_n) \\leq 7 \\times 10^7.
\\]

<p>Zhang's key innovation was establishing a Bombieri-Vinogradov type theorem (Chapter 13) with moduli exceeding \\(\\sqrt{N}\\) by a small power, which was precisely what the GPY machinery needed.</p>

<div class="viz-placeholder" data-viz="viz-optimization-landscape"></div>

<h3>The Road to Twin Primes</h3>

<p>The twin prime conjecture (\\(\\liminf (p_{n+1} - p_n) = 2\\)) remains open. What stands in the way?</p>

<ul>
    <li><strong>Parity barrier</strong>: The sieve factor of 2 prevents detecting individual primes. Maynard-Tao circumvents this by detecting <em>clusters</em> of primes, not individual ones.</li>
    <li><strong>Level of distribution</strong>: The Bombieri-Vinogradov theorem gives level \\(1/2\\). Going to level \\(1\\) (the Elliott-Halberstam conjecture) would give gaps \\(\\leq 6\\) but not 2.</li>
    <li><strong>Sieve dimension</strong>: Twin primes have \\(\\kappa = 2\\), making the sieve limits less favorable than for primes (\\(\\kappa = 1\\)).</li>
</ul>

<div class="env-block remark">
    <div class="env-title">The Arc of Sieve Theory</div>
    <div class="env-body">
        <p>From Eratosthenes (250 BCE) through Brun (1915), Selberg (1947), Rosser-Iwaniec (1965), GPY (2005), Zhang (2013), and Maynard-Tao (2013), sieve methods have undergone a remarkable evolution. Each generation preserved the core insight of its predecessor while adding a new layer: combinatorics, optimization, analysis, high-dimensional geometry. The story is far from over.</p>
    </div>
</div>
`,
            visualizations: [
                {
                    id: 'viz-optimization-landscape',
                    title: 'Optimization Landscape: Selberg Sieve as Quadratic Minimization',
                    description: 'The Selberg sieve minimizes a quadratic form in the weights \\(\\lambda_d\\). This visualization shows a 2D slice of the optimization landscape. The minimum of the paraboloid gives the optimal sieve bound. Drag the point to explore the landscape.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 380,
                            originX: 280, originY: 250, scale: 40
                        });

                        // Model: Q(x, y) = 3x^2 + 2xy + 4y^2 - 2x - 3y + 2
                        // Minimum at (x*, y*) solving gradient = 0
                        // grad = (6x + 2y - 2, 2x + 8y - 3) = 0
                        // 6x + 2y = 2, 2x + 8y = 3 => x = 5/22, y = 7/22
                        var optX = 5 / 22, optY = 7 / 22;

                        function Q(x, y) {
                            return 3 * x * x + 2 * x * y + 4 * y * y - 2 * x - 3 * y + 2;
                        }

                        var probe = viz.addDraggable('probe', 1.5, 1.5, viz.colors.orange, 8);

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            viz.screenText('Selberg Sieve: Quadratic Optimization', viz.width / 2, 18, viz.colors.white, 14);

                            // Draw contours of Q
                            var xMin = -3, xMax = 3, yMin = -2.5, yMax = 3;
                            var levels = [0.5, 1.0, 1.5, 2.0, 3.0, 5.0, 8.0, 12.0];
                            var contourColors = [
                                viz.colors.blue + '55', viz.colors.blue + '44', viz.colors.teal + '44',
                                viz.colors.teal + '33', viz.colors.green + '33', viz.colors.yellow + '33',
                                viz.colors.orange + '22', viz.colors.red + '22'
                            ];

                            // Draw filled contours via heatmap
                            var resolution = 3;
                            for (var py = 0; py < viz.height; py += resolution) {
                                for (var px = 0; px < viz.width; px += resolution) {
                                    var coords = viz.toMath(px, py);
                                    var val = Q(coords[0], coords[1]);
                                    // Color based on value
                                    var t = Math.max(0, Math.min(1, val / 15));
                                    var r = Math.round(12 + t * 30);
                                    var g = Math.round(12 + (1 - t) * 40);
                                    var b = Math.round(32 + (1 - t) * 80);
                                    ctx.fillStyle = 'rgb(' + r + ',' + g + ',' + b + ')';
                                    ctx.fillRect(px, py, resolution, resolution);
                                }
                            }

                            // Draw contour lines
                            for (var li = 0; li < levels.length; li++) {
                                var level = levels[li];
                                ctx.strokeStyle = viz.colors.white + '44';
                                ctx.lineWidth = 0.8;
                                // Sample contour by marching
                                for (var angle = 0; angle < Math.PI * 2; angle += 0.02) {
                                    // Search for radius where Q = level along this angle from optimum
                                    var rMin = 0, rMax = 5;
                                    for (var iter = 0; iter < 20; iter++) {
                                        var rMid = (rMin + rMax) / 2;
                                        var xx = optX + rMid * Math.cos(angle);
                                        var yy = optY + rMid * Math.sin(angle);
                                        if (Q(xx, yy) < level) rMin = rMid;
                                        else rMax = rMid;
                                    }
                                    var cr = (rMin + rMax) / 2;
                                    var cx = optX + cr * Math.cos(angle);
                                    var cy = optY + cr * Math.sin(angle);
                                    var sp = viz.toScreen(cx, cy);
                                    ctx.fillStyle = viz.colors.white + '22';
                                    ctx.fillRect(sp[0], sp[1], 1.5, 1.5);
                                }
                            }

                            // Draw axes
                            ctx.strokeStyle = viz.colors.axis; ctx.lineWidth = 1;
                            ctx.beginPath(); ctx.moveTo(0, viz.originY); ctx.lineTo(viz.width, viz.originY); ctx.stroke();
                            ctx.beginPath(); ctx.moveTo(viz.originX, 0); ctx.lineTo(viz.originX, viz.height); ctx.stroke();

                            // Axis labels
                            ctx.fillStyle = viz.colors.text; ctx.font = '11px -apple-system,sans-serif';
                            ctx.textAlign = 'center'; ctx.textBaseline = 'top';
                            ctx.fillText('\u03BB\u2082', viz.width - 15, viz.originY + 4);
                            ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
                            ctx.fillText('\u03BB\u2083', viz.originX + 6, 15);

                            // Optimum point
                            viz.drawPoint(optX, optY, viz.colors.green, 'min', 6);

                            // Probe point
                            var probeVal = Q(probe.x, probe.y);
                            viz.drawPoint(probe.x, probe.y, viz.colors.orange, null, 8);

                            // Info panel
                            var panelY = viz.height - 60;
                            ctx.fillStyle = '#0c0c20cc';
                            ctx.fillRect(10, panelY, 280, 50);
                            ctx.fillStyle = viz.colors.orange; ctx.font = '12px -apple-system,sans-serif';
                            ctx.textAlign = 'left';
                            ctx.fillText('Current: Q(' + probe.x.toFixed(2) + ', ' + probe.y.toFixed(2) + ') = ' + probeVal.toFixed(3), 20, panelY + 18);
                            ctx.fillStyle = viz.colors.green;
                            ctx.fillText('Minimum: Q(' + optX.toFixed(2) + ', ' + optY.toFixed(2) + ') = ' + Q(optX, optY).toFixed(3), 20, panelY + 38);
                        }

                        viz.animate(function() { draw(); });
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'An admissible \\(k\\)-tuple \\(\\mathcal{H} = \\{h_1, \\ldots, h_k\\}\\) is a set of integers such that for every prime \\(p\\), the \\(h_i\\) do not cover all residue classes modulo \\(p\\). Verify that \\(\\{0, 2, 6\\}\\) is admissible but \\(\\{0, 1, 2\\}\\) is not.',
                    hint: 'Check each prime \\(p\\) to see whether \\(\\{h_i \\mod p\\}\\) covers all residue classes.',
                    solution: 'For \\(\\{0, 1, 2\\}\\): modulo 3, the residues are \\(\\{0, 1, 2\\}\\), which covers all three classes. So for \\(p = 3\\), one of \\(n, n+1, n+2\\) is always divisible by 3. Hence \\(\\{0, 1, 2\\}\\) is NOT admissible (at most one can be prime for \\(n > 1\\)). For \\(\\{0, 2, 6\\}\\): mod 2, residues are \\(\\{0, 0, 0\\}\\) (only one class); mod 3, residues are \\(\\{0, 2, 0\\}\\) (misses class 1); mod 5, residues are \\(\\{0, 2, 1\\}\\) (misses classes 3, 4). For all larger primes \\(p \\geq 7\\), the tuple has only 3 elements so cannot cover all \\(p \\geq 7\\) classes. So \\(\\{0, 2, 6\\}\\) is admissible.'
                },
            ]
        }
    ]
});
