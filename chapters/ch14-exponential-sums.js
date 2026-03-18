window.CHAPTERS = window.CHAPTERS || [];
window.CHAPTERS.push({
    id: 'ch14',
    number: 14,
    title: 'Exponential Sums',
    subtitle: 'Measuring cancellation, measuring randomness',
    sections: [

        // ================================================================
        // SECTION 1: Motivation — Measuring Cancellation
        // ================================================================
        {
            id: 'sec-motivation',
            title: 'Measuring Cancellation',
            content: `
<h2>Measuring Cancellation</h2>

<div class="env-block intuition">
    <div class="env-title">The Central Question</div>
    <div class="env-body">
        <p>Suppose we add up \\(N\\) complex numbers of modulus 1, each pointing in a direction \\(e(f(n)) = e^{2\\pi i f(n)}\\). If the angles \\(f(n)\\) are "random-looking," the partial sums wander like a random walk and we expect the total to have modulus \\(O(\\sqrt{N})\\). If the angles are perfectly aligned the sum grows like \\(N\\). Everything interesting lies in between.</p>
        <p>An <strong>exponential sum</strong> is any sum of the form
        \\[S = \\sum_{n=M+1}^{M+N} e(f(n)), \\qquad e(t) := e^{2\\pi i t}.\\]
        Bounding \\(|S|\\) is the central technique of analytic number theory: it underlies the prime number theorem, Dirichlet's theorem, Waring's problem, and the circle method.</p>
    </div>
</div>

<p>The notation \\(e(t) = e^{2\\pi i t}\\) is standard. Note that \\(e(t+1) = e(t)\\), so \\(e(t)\\) depends only on \\(\\{t\\}\\), the fractional part of \\(t\\).</p>

<h3>Trivial Bound vs. Cancellation</h3>

<p>The <em>trivial bound</em> is simply \\(|S| \\le N\\) by the triangle inequality. The goal is a <em>non-trivial bound</em> \\(|S| = o(N)\\). How much cancellation there is depends critically on the arithmetic properties of \\(f\\).</p>

<div class="env-block example">
    <div class="env-title">Example: Geometric Sum</div>
    <div class="env-body">
        <p>Let \\(f(n) = \\alpha n\\) with \\(\\alpha \\notin \\mathbb{Z}\\). Then</p>
        \\[\\left|\\sum_{n=1}^{N} e(\\alpha n)\\right| = \\left|\\frac{e(\\alpha) - e((N+1)\\alpha)}{1 - e(\\alpha)}\\right| \\le \\frac{1}{|1 - e(\\alpha)|} = \\frac{1}{2|\\sin(\\pi\\alpha)|}.\\]
        <p>This is \\(O(1)\\) regardless of \\(N\\) — perfect cancellation once \\(\\alpha\\) is bounded away from integers. The sum stays bounded because the unit vectors rotate at a constant rate, completing full cycles.</p>
    </div>
</div>

<div class="env-block example">
    <div class="env-title">Example: Quadratic Phase</div>
    <div class="env-body">
        <p>Let \\(f(n) = \\alpha n^2\\). Now the rotation rate changes with \\(n\\), and the vectors spiral rather than rotate uniformly. For irrational \\(\\alpha\\), we still get cancellation (Weyl's theorem), but the bound is \\(o(N)\\) rather than \\(O(1)\\).</p>
    </div>
</div>

<h3>Three Flavors of Exponential Sum</h3>

<p>In practice, three families dominate:</p>
<ol>
    <li><strong>Weyl sums:</strong> \\(f(n) = \\alpha_k n^k + \\cdots + \\alpha_1 n\\), polynomial phase. Tools: Weyl differencing, van der Corput, Vinogradov.</li>
    <li><strong>Character sums / Gauss sums:</strong> \\(f(n) = n^2/p\\) (mod \\(p\\)), arithmetic phase. Tools: multiplicative structure, Weil bounds.</li>
    <li><strong>Sums over primes:</strong> \\(\\sum_p e(f(p))\\), restricted to primes. Tools: Vaughan's identity, circle method.</li>
</ol>

<p>Each family demands different ideas, but all share one goal: proving \\(|S| \\ll N^{1-\\delta}\\) for some explicit \\(\\delta > 0\\).</p>

<div class="env-block remark">
    <div class="env-title">Why "Exponential"?</div>
    <div class="env-body">
        <p>The term refers to the exponential function \\(e^{2\\pi i f(n)}\\), not to exponential growth. The sum is called exponential because each term is an exponential with a varying exponent, not because the sum grows exponentially — indeed, the whole point is that it does <em>not</em>.</p>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-cancellation-slider"></div>
`,
            visualizations: [
                {
                    id: 'viz-cancellation-slider',
                    title: 'Cancellation vs. Alignment: Sweeping \\(\\alpha\\)',
                    description: 'As \\(\\alpha\\) sweeps from 0 to 1, watch \\(|S_N(\\alpha)|/N\\) where \\(S_N(\\alpha) = \\sum_{n=1}^N e(\\alpha n)\\). Near integers, alignment is near-perfect; away from integers, cancellation dominates.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, { width: 560, height: 320, originX: 60, originY: 160, scale: 1 });
                        var N = 50;
                        var alphaVal = 0.3;

                        VizEngine.createSlider(controls, 'alpha', 0, 1, alphaVal, 0.001, function(v) {
                            alphaVal = v; draw();
                        });
                        VizEngine.createSlider(controls, 'N', 10, 200, N, 1, function(v) {
                            N = Math.round(v); draw();
                        });

                        function computeSum(alpha, n) {
                            var re = 0, im = 0;
                            for (var k = 1; k <= n; k++) {
                                var phase = 2 * Math.PI * alpha * k;
                                re += Math.cos(phase);
                                im += Math.sin(phase);
                            }
                            return Math.sqrt(re * re + im * im);
                        }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var W = viz.width, H = viz.height;

                            // Draw |S_N(alpha)| / N as a function of alpha over [0,1]
                            var plotL = 60, plotR = W - 20, plotT = 30, plotB = H - 50;
                            var plotW = plotR - plotL, plotH = plotB - plotT;

                            // Axes
                            ctx.strokeStyle = viz.colors.axis; ctx.lineWidth = 1.5;
                            ctx.beginPath(); ctx.moveTo(plotL, plotB); ctx.lineTo(plotR, plotB); ctx.stroke();
                            ctx.beginPath(); ctx.moveTo(plotL, plotT); ctx.lineTo(plotL, plotB); ctx.stroke();

                            // Y axis labels
                            ctx.fillStyle = viz.colors.text; ctx.font = '11px -apple-system,sans-serif';
                            ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
                            for (var yl = 0; yl <= 4; yl++) {
                                var yv = yl * 0.25;
                                var yy = plotB - yv * plotH;
                                ctx.fillText(yv.toFixed(2), plotL - 4, yy);
                                ctx.strokeStyle = viz.colors.grid; ctx.lineWidth = 0.5;
                                ctx.beginPath(); ctx.moveTo(plotL, yy); ctx.lineTo(plotR, yy); ctx.stroke();
                            }
                            ctx.fillStyle = viz.colors.text; ctx.textAlign = 'center';
                            ctx.fillText('|S\u2099(\u03b1)| / N', plotL - 32, plotT + plotH / 2);

                            // X axis labels
                            ctx.textAlign = 'center'; ctx.textBaseline = 'top';
                            var xTicks = [0, 0.25, 0.5, 0.75, 1.0];
                            xTicks.forEach(function(t) {
                                var xx = plotL + t * plotW;
                                ctx.fillStyle = viz.colors.text;
                                ctx.fillText(t.toFixed(2), xx, plotB + 4);
                                ctx.strokeStyle = viz.colors.grid; ctx.lineWidth = 0.5;
                                ctx.beginPath(); ctx.moveTo(xx, plotT); ctx.lineTo(xx, plotB); ctx.stroke();
                            });
                            ctx.fillText('\u03b1', plotL + plotW / 2, plotB + 24);

                            // Trivial bound line
                            ctx.strokeStyle = viz.colors.grid; ctx.lineWidth = 1; ctx.setLineDash([4, 4]);
                            ctx.beginPath(); ctx.moveTo(plotL, plotT); ctx.lineTo(plotR, plotT); ctx.stroke();
                            ctx.setLineDash([]);
                            ctx.fillStyle = viz.colors.text; ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
                            ctx.fillText('trivial bound = 1', plotR - 100, plotT + 8);

                            // Plot curve
                            var steps = 400;
                            ctx.strokeStyle = viz.colors.teal; ctx.lineWidth = 2;
                            ctx.beginPath();
                            for (var i = 0; i <= steps; i++) {
                                var a = i / steps;
                                var val = computeSum(a, N) / N;
                                var px = plotL + a * plotW;
                                var py = plotB - Math.min(val, 1) * plotH;
                                i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
                            }
                            ctx.stroke();

                            // Mark current alpha
                            var curVal = computeSum(alphaVal, N) / N;
                            var cx = plotL + alphaVal * plotW;
                            var cy = plotB - Math.min(curVal, 1) * plotH;
                            ctx.fillStyle = viz.colors.orange;
                            ctx.beginPath(); ctx.arc(cx, cy, 5, 0, Math.PI * 2); ctx.fill();

                            ctx.fillStyle = viz.colors.white; ctx.font = '13px -apple-system,sans-serif';
                            ctx.textAlign = 'center'; ctx.textBaseline = 'top';
                            ctx.fillText('\u03b1 = ' + alphaVal.toFixed(3) + '   |S\u2099| = ' + computeSum(alphaVal, N).toFixed(2) + '   N = ' + N, W / 2, plotB + 38);
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Compute \\(\\left|\\sum_{n=1}^{N} e(n/q)\\right|\\) exactly when \\(q \\mid N\\) (i.e., \\(q\\) divides \\(N\\)). What does this tell you about cancellation for rational \\(\\alpha = 1/q\\)?',
                    hint: 'When \\(\\alpha = 1/q\\) and \\(q \\mid N\\), the sum is a sum of all \\(q\\)-th roots of unity repeated \\(N/q\\) times.',
                    solution: 'Each complete block of \\(q\\) terms \\(\\sum_{n=1}^{q} e(n/q) = 0\\) (sum of all \\(q\\)-th roots of unity). With \\(N/q\\) complete blocks, the total sum is exactly 0. Perfect cancellation occurs because rational rotations close up exactly, unlike irrational \\(\\alpha\\) where the orbit is dense.'
                },
                {
                    question: 'For \\(\\alpha = 1/\\sqrt{2}\\), the trivial bound gives \\(|S_N| \\le N\\). Explain heuristically why we expect \\(|S_N| = O(\\sqrt{N})\\). What property of \\(\\alpha\\) is responsible?',
                    hint: 'Think of the terms \\(e(\\alpha n)\\) as unit vectors pointing in "pseudo-random" directions. What does a random walk of \\(N\\) unit steps look like?',
                    solution: 'Since \\(\\alpha\\) is irrational, the sequence \\(\\{\\alpha n\\}\\) is equidistributed in \\([0,1)\\) (Weyl\'s theorem). The angles \\(2\\pi\\alpha n\\) are "pseudo-random" enough that consecutive steps have no consistent drift. A random walk of \\(N\\) unit steps has expected displacement \\(\\sim \\sqrt{N}\\), giving \\(|S_N| = O(\\sqrt{N})\\). The equidistribution (irrational \\(\\alpha\\)) prevents coherent alignment.'
                }
            ]
        },

        // ================================================================
        // SECTION 2: Weyl Sums
        // ================================================================
        {
            id: 'sec-weyl',
            title: 'Weyl Sums',
            content: `
<h2>Weyl Sums</h2>

<div class="env-block intuition">
    <div class="env-title">The Idea</div>
    <div class="env-body">
        <p>Hermann Weyl (1916) asked: given \\(f(n) = \\alpha n^k + \\cdots\\) with \\(\\alpha\\) irrational, how fast does the partial sum \\(S_N = \\sum_{n=1}^N e(f(n))\\) grow? His answer used a brilliant trick: square the sum to replace \\(f(n)\\) with a difference \\(f(n+h) - f(n)\\), which has one lower degree. Iterate until the phase is linear, then apply the geometric sum formula.</p>
    </div>
</div>

<h3>Weyl's Inequality</h3>

<div class="env-block theorem">
    <div class="env-title">Theorem 14.1 (Weyl's Inequality)</div>
    <div class="env-body">
        <p>Let \\(f(n) = \\alpha n^k + \\alpha_{k-1} n^{k-1} + \\cdots + \\alpha_1 n\\) with \\(\\alpha = \\alpha_k \\in \\mathbb{R}\\). Suppose there exist integers \\(a, q\\) with \\(\\gcd(a,q)=1\\), \\(q \\ge 1\\), and \\(|\\alpha - a/q| \\le 1/q^2\\). Then</p>
        \\[\\left|\\sum_{n=1}^{N} e(f(n))\\right| \\ll N^{1+\\varepsilon} \\left(\\frac{1}{q} + \\frac{1}{N} + \\frac{q}{N^k}\\right)^{2^{1-k}}.\\]
        <p>In particular, if \\(\\alpha\\) is irrational the sum is \\(o(N)\\).</p>
    </div>
</div>

<p>The exponent \\(2^{1-k}\\) shows the cost of each differencing step: after \\(k-1\\) doublings, the bound degrades from the ideal \\(1/2\\) (for linear) to \\(2^{1-k}\\). For large \\(k\\), Weyl's inequality becomes weak; Vinogradov's method (Section 4) overcomes this.</p>

<h3>The Weyl Differencing Argument</h3>

<p>The key identity is:</p>
\\[|S_N|^2 = \\sum_{n=1}^{N}\\sum_{m=1}^{N} e(f(n) - f(m)) = N + 2\\operatorname{Re}\\sum_{h=1}^{N-1}\\sum_{n=1}^{N-h} e(f(n+h)-f(n)).\\]

<p>For \\(f(n) = \\alpha n^k\\), the difference \\(f(n+h) - f(n) = k\\alpha h n^{k-1} + O(h^2 n^{k-2})\\) is a polynomial of degree \\(k-1\\) in \\(n\\). Applying the Cauchy-Schwarz inequality and iterating reduces the problem to bounding a sum with linear phase, i.e., a geometric series.</p>

<div class="env-block definition">
    <div class="env-title">Definition: Weyl Sum</div>
    <div class="env-body">
        <p>A <em>Weyl sum</em> (or polynomial exponential sum) is any sum of the form</p>
        \\[W_k(\\alpha; N) = \\sum_{n=1}^{N} e(\\alpha n^k).\\]
        <p>The general polynomial case reduces to controlling \\(W_k\\) via the differencing argument.</p>
    </div>
</div>

<h3>Equidistribution via Weyl</h3>

<div class="env-block theorem">
    <div class="env-title">Theorem 14.2 (Weyl's Equidistribution Theorem)</div>
    <div class="env-body">
        <p>Let \\(f(n) = \\alpha_k n^k + \\cdots + \\alpha_1 n\\) where at least one \\(\\alpha_j\\) (for \\(j \\ge 1\\)) is irrational. Then the sequence \\(\\{f(n)\\}_{n=1}^{\\infty}\\) is equidistributed modulo 1: for every interval \\([a,b] \\subseteq [0,1)\\),</p>
        \\[\\frac{1}{N}\\#\\{1 \\le n \\le N : \\{f(n)\\} \\in [a,b]\\} \\to b - a \\quad \\text{as } N \\to \\infty.\\]
    </div>
</div>

<p><strong>Proof sketch.</strong> By Weyl's criterion, equidistribution is equivalent to \\(N^{-1}\\sum_{n=1}^N e(mf(n)) \\to 0\\) for every integer \\(m \\ne 0\\). The polynomial \\(mf(n)\\) has leading irrational coefficient \\(m\\alpha_k\\) (or whichever \\(\\alpha_j\\) is irrational), so Weyl's inequality gives \\(o(N)\\). \\(\\square\\)</p>

<p>This is one of the deepest results in classical analysis: a purely algebraic condition (irrationality of a coefficient) forces a purely statistical conclusion (equidistribution). The bridge is the exponential sum.</p>

<div class="viz-placeholder" data-viz="viz-weyl-spiral"></div>
<div class="viz-placeholder" data-viz="viz-equidistribution"></div>
`,
            visualizations: [
                {
                    id: 'viz-weyl-spiral',
                    title: 'Weyl Spiral: Cumulative Sum \\(\\sum_{n=1}^N e(\\alpha n^k)\\)',
                    description: 'The cumulative partial sums \\(S_j = \\sum_{n=1}^{j} e(\\alpha n^k)\\) traced in the complex plane. For irrational \\(\\alpha\\), the path spirals erratically and stays bounded; for rational \\(\\alpha\\), it closes up. Adjust \\(\\alpha\\) and degree \\(k\\).',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, { width: 560, height: 420, originX: 280, originY: 210, scale: 40 });
                        var alpha = 0.618, k = 2, N = 100;

                        VizEngine.createSlider(controls, 'alpha', 0, 1, alpha, 0.001, function(v) { alpha = v; draw(); });
                        VizEngine.createSlider(controls, 'k (degree)', 1, 4, k, 1, function(v) { k = Math.round(v); draw(); });
                        VizEngine.createSlider(controls, 'N (terms)', 10, 300, N, 1, function(v) { N = Math.round(v); draw(); });

                        function draw() {
                            viz.clear();
                            viz.drawAxes();

                            var ctx = viz.ctx;
                            var re = 0, im = 0;
                            var pts = [[0, 0]];
                            for (var n = 1; n <= N; n++) {
                                var phase = 2 * Math.PI * alpha * Math.pow(n, k);
                                re += Math.cos(phase);
                                im += Math.sin(phase);
                                pts.push([re, im]);
                            }

                            // Find bounding box and rescale
                            var minX = 0, maxX = 0, minY = 0, maxY = 0;
                            pts.forEach(function(p) {
                                minX = Math.min(minX, p[0]); maxX = Math.max(maxX, p[0]);
                                minY = Math.min(minY, p[1]); maxY = Math.max(maxY, p[1]);
                            });
                            var span = Math.max(maxX - minX, maxY - minY, 1);
                            var scale = Math.min(viz.width, viz.height) * 0.38 / span;

                            // Draw path
                            ctx.strokeStyle = viz.colors.teal; ctx.lineWidth = 1.2; ctx.globalAlpha = 0.8;
                            ctx.beginPath();
                            pts.forEach(function(p, i) {
                                var sx = viz.originX + p[0] * scale;
                                var sy = viz.originY - p[1] * scale;
                                i === 0 ? ctx.moveTo(sx, sy) : ctx.lineTo(sx, sy);
                            });
                            ctx.stroke();
                            ctx.globalAlpha = 1;

                            // Draw final point
                            var lastPt = pts[pts.length - 1];
                            var lx = viz.originX + lastPt[0] * scale;
                            var ly = viz.originY - lastPt[1] * scale;
                            ctx.fillStyle = viz.colors.orange;
                            ctx.beginPath(); ctx.arc(lx, ly, 5, 0, Math.PI * 2); ctx.fill();

                            // Draw origin
                            ctx.fillStyle = viz.colors.green;
                            ctx.beginPath(); ctx.arc(viz.originX, viz.originY, 4, 0, Math.PI * 2); ctx.fill();

                            // Magnitude circle
                            var mag = Math.sqrt(lastPt[0]*lastPt[0] + lastPt[1]*lastPt[1]);
                            ctx.strokeStyle = viz.colors.orange + '44'; ctx.lineWidth = 1;
                            ctx.beginPath(); ctx.arc(viz.originX, viz.originY, mag * scale, 0, Math.PI * 2); ctx.stroke();

                            // Labels
                            viz.screenText('\u03b1 = ' + alpha.toFixed(3) + '   k = ' + k + '   N = ' + N, viz.width/2, 18, viz.colors.white, 13);
                            viz.screenText('|S\u2099| = ' + mag.toFixed(2) + '   |S\u2099|/\u221aN = ' + (mag/Math.sqrt(N)).toFixed(2), viz.width/2, 36, viz.colors.text, 11);
                            viz.screenText('S = ' + lastPt[0].toFixed(2) + ' + ' + lastPt[1].toFixed(2) + 'i', viz.width/2, viz.height - 10, viz.colors.teal, 11);
                        }
                        draw();
                        return viz;
                    }
                },
                {
                    id: 'viz-equidistribution',
                    title: 'Equidistribution: \\(\\{n\\alpha\\} \\bmod 1\\) Filling \\([0,1)\\)',
                    description: 'The fractional parts \\(\\{n\\alpha\\}\\) fill \\([0,1)\\) uniformly for irrational \\(\\alpha\\) (Weyl\'s equidistribution theorem). Rational \\(\\alpha = p/q\\) produces only \\(q\\) distinct values. The histogram shows the empirical density after \\(N\\) terms.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, { width: 560, height: 320, originX: 60, originY: 280, scale: 1 });
                        var alpha = (1 + Math.sqrt(5)) / 2; // golden ratio
                        var N = 200;
                        var BINS = 40;

                        VizEngine.createSlider(controls, 'alpha', 0, 2, alpha, 0.001, function(v) { alpha = v; draw(); });
                        VizEngine.createSlider(controls, 'N', 20, 500, N, 1, function(v) { N = Math.round(v); draw(); });

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var W = viz.width, H = viz.height;
                            var plotL = 60, plotR = W - 20, plotT = 30, plotB = H - 50;
                            var plotW = plotR - plotL, plotH = plotB - plotT;

                            // Compute fractional parts
                            var counts = new Array(BINS).fill(0);
                            for (var n = 1; n <= N; n++) {
                                var frac = ((alpha * n) % 1 + 1) % 1;
                                var bin = Math.min(Math.floor(frac * BINS), BINS - 1);
                                counts[bin]++;
                            }

                            // Normalize
                            var maxCount = Math.max.apply(null, counts);
                            var uniform = N / BINS;

                            // Axes
                            ctx.strokeStyle = viz.colors.axis; ctx.lineWidth = 1.5;
                            ctx.beginPath(); ctx.moveTo(plotL, plotB); ctx.lineTo(plotR, plotB); ctx.stroke();
                            ctx.beginPath(); ctx.moveTo(plotL, plotT); ctx.lineTo(plotL, plotB); ctx.stroke();

                            // Bars
                            var barW = plotW / BINS;
                            for (var b = 0; b < BINS; b++) {
                                var bh = (counts[b] / Math.max(maxCount, uniform * 2)) * plotH;
                                var bx = plotL + b * barW;
                                var frac2 = counts[b] / uniform; // ratio to uniform
                                // Color: blue if close to uniform, orange if above, teal if below
                                var hue = frac2 > 1.1 ? viz.colors.orange : (frac2 < 0.9 ? viz.colors.teal : viz.colors.blue);
                                ctx.fillStyle = hue + 'aa';
                                ctx.fillRect(bx, plotB - bh, barW - 1, bh);
                                ctx.strokeStyle = hue; ctx.lineWidth = 0.5;
                                ctx.strokeRect(bx, plotB - bh, barW - 1, bh);
                            }

                            // Uniform level line
                            var uniformH = (uniform / Math.max(maxCount, uniform * 2)) * plotH;
                            ctx.strokeStyle = viz.colors.green; ctx.lineWidth = 1.5; ctx.setLineDash([5, 4]);
                            ctx.beginPath(); ctx.moveTo(plotL, plotB - uniformH); ctx.lineTo(plotR, plotB - uniformH); ctx.stroke();
                            ctx.setLineDash([]);

                            // X labels
                            ctx.fillStyle = viz.colors.text; ctx.font = '11px -apple-system,sans-serif';
                            ctx.textAlign = 'center'; ctx.textBaseline = 'top';
                            [0, 0.25, 0.5, 0.75, 1.0].forEach(function(t) {
                                ctx.fillText(t.toFixed(2), plotL + t * plotW, plotB + 4);
                            });
                            ctx.fillText('{n\u03b1} mod 1', plotL + plotW / 2, plotB + 22);

                            // Title
                            var fracAlpha = alpha - Math.floor(alpha);
                            viz.screenText('\u03b1 = ' + alpha.toFixed(3) + '   N = ' + N, W/2, 14, viz.colors.white, 13);
                            viz.screenText('Green line = uniform level (N/bins = ' + (N/BINS).toFixed(1) + ')', W/2, plotB + 40, viz.colors.green, 10);

                            // Scatter of actual points along x-axis
                            ctx.fillStyle = viz.colors.purple + 'aa';
                            for (var n2 = 1; n2 <= Math.min(N, 100); n2++) {
                                var fp = ((alpha * n2) % 1 + 1) % 1;
                                var px = plotL + fp * plotW;
                                ctx.beginPath(); ctx.arc(px, plotB + 2, 2, 0, Math.PI * 2); ctx.fill();
                            }
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Apply the Weyl differencing argument to \\(W_2(\\alpha; N) = \\sum_{n=1}^N e(\\alpha n^2)\\). Show that \\(|W_2|^2 \\le N + 2\\sum_{h=1}^{N-1}\\left|\\sum_{n=1}^{N-h} e(2\\alpha h n)\\right|\\). What is the degree of the phase after differencing?',
                    hint: 'Expand \\(|W_2|^2 = W_2 \\overline{W_2}\\) and set \\(h = n - m\\).',
                    solution: 'We write \\(|W_2|^2 = \\sum_{n,m} e(\\alpha(n^2 - m^2))\\). Set \\(h = n - m\\): \\(n^2 - m^2 = (n-m)(n+m) = h(2m+h)\\). Fixing \\(h\\), the inner sum is \\(\\sum_{m} e(\\alpha h(2m+h)) = e(\\alpha h^2)\\sum_{m} e(2\\alpha h m)\\). The phase \\(2\\alpha h m\\) is linear in \\(m\\) — degree drops from 2 to 1. Apply the geometric sum bound to get \\(\\min(N, 1/(2\\|\\alpha h\\|))\\) where \\(\\|\\cdot\\|\\) denotes distance to nearest integer.'
                },
                {
                    question: 'State Weyl\'s criterion for equidistribution and use it (assuming Weyl\'s inequality) to prove that \\(\\{\\sqrt{2}\\, n\\}\\) is equidistributed modulo 1.',
                    hint: 'Weyl\'s criterion: \\(\\{x_n\\}\\) is equidistributed iff \\(\\frac{1}{N}\\sum_{n=1}^N e(mx_n) \\to 0\\) for all integers \\(m \\ne 0\\).',
                    solution: 'By Weyl\'s criterion, we need \\(N^{-1}\\sum_{n=1}^N e(m\\sqrt{2}\\,n) \\to 0\\) for each \\(m \\ne 0\\). This is a linear exponential sum with \\(\\alpha = m\\sqrt{2}\\). Since \\(\\sqrt{2}\\) is irrational, so is \\(m\\sqrt{2}\\) for \\(m \\ne 0\\). By the geometric sum formula, \\(\\left|\\sum_{n=1}^N e(m\\sqrt{2}\\,n)\\right| \\le \\frac{1}{|1-e(m\\sqrt{2})|} = \\frac{1}{2|\\sin(\\pi m\\sqrt{2})|} < \\infty\\), so dividing by \\(N \\to \\infty\\) gives 0. \\(\\square\\)'
                }
            ]
        },

        // ================================================================
        // SECTION 3: Van der Corput's Method
        // ================================================================
        {
            id: 'sec-van-der-corput',
            title: "Van der Corput's Method",
            content: `
<h2>Van der Corput's Method</h2>

<div class="env-block intuition">
    <div class="env-title">Beyond Polynomials</div>
    <div class="env-body">
        <p>Weyl's differencing works perfectly for polynomial phases. But what about \\(e(x^{3/2})\\) or \\(e(\\log n)\\)? Van der Corput (1921–1922) developed two <em>processes</em> — the A-process (differencing) and B-process (Poisson summation) — that together handle smooth analytic phases. The B-process is more powerful but requires the phase to be smooth.</p>
    </div>
</div>

<h3>Setup and Notation</h3>

<p>We consider sums \\(S = \\sum_{a < n \\le b} e(f(n))\\) where \\(f\\) is a smooth real-valued function. The key parameters are:</p>
<ul>
    <li>\\(N = b - a\\) (length of the sum)</li>
    <li>\\(\\lambda_j \\asymp f^{(j)}(n)\\) for \\(n \\in [a,b]\\) (size of \\(j\\)-th derivative)</li>
</ul>

<h3>The A-Process (Differencing)</h3>

<div class="env-block theorem">
    <div class="env-title">Theorem 14.3 (Van der Corput A-Process)</div>
    <div class="env-body">
        <p>With the notation above,</p>
        \\[\\left|\\sum_{a < n \\le b} e(f(n))\\right|^2 \\le \\frac{N+H}{H} \\sum_{|h| < H} \\left(1 - \\frac{|h|}{H}\\right)\\left|\\sum_{a < n \\le b-h} e(f(n+h)-f(n))\\right| + N+H\\]
        <p>for any positive integer \\(H \\le N\\). The phase \\(f(n+h)-f(n) \\approx h f'(n)\\) has one fewer derivative.</p>
    </div>
</div>

<p>After one A-step, \\(\\lambda_j \\mapsto h\\lambda_{j+1}\\). Choosing \\(H \\sim \\lambda_j^{-1/2} N\\) optimally balances the terms.</p>

<h3>The B-Process (Poisson Summation)</h3>

<div class="env-block theorem">
    <div class="env-title">Theorem 14.4 (Van der Corput B-Process)</div>
    <div class="env-body">
        <p>Suppose \\(f''(x) \\asymp \\lambda_2\\) on \\([a,b]\\). Then</p>
        \\[\\sum_{a < n \\le b} e(f(n)) = \\sum_{f'(a) < m \\le f'(b)} \\frac{e(g(m) - 1/8)}{\\sqrt{f''(g(m))}} + O(\\lambda_2^{-1/2}),\\]
        <p>where \\(g(m)\\) is the saddle point: the solution to \\(f'(x) = m\\). The new sum has \\(\\sim \\lambda_2 N\\) terms (possibly fewer than \\(N\\)) with a smoother phase \\(g(m)\\).</p>
    </div>
</div>

<p>The B-process replaces a sum of \\(N\\) terms with a sum of \\(\\lambda_2 N\\) terms. When \\(\\lambda_2 \\ll 1\\), this is a dramatic compression. The key condition is that \\(f''\\) is bounded away from zero and not too large.</p>

<h3>Iterating: the Van der Corput Process</h3>

<p>One applies A and B alternately. Each A-step increases the derivative order; each B-step compresses the sum length. A single (AB) cycle can reduce \\(|S|\\) substantially. For \\(f(n) = n^\\rho\\) with \\(1 < \\rho < 2\\), one (AB) cycle gives \\(|S| \\ll N^{(\\rho-1)/2 + \\varepsilon}\\), which beats Weyl for non-integer \\(\\rho\\).</p>

<div class="env-block example">
    <div class="env-title">Example: \\(\\sum e(n^{3/2})\\)</div>
    <div class="env-body">
        <p>Take \\(f(n) = n^{3/2}\\), \\(N\\) large. Then \\(f'(n) = \\frac{3}{2} n^{1/2}\\), \\(f''(n) = \\frac{3}{4} n^{-1/2}\\). The trivial bound is \\(N\\). After one B-process with \\(N \\sim X\\), the sum over saddle points has length \\(\\sim N^{1/2}\\), giving \\(|S| \\ll N^{3/4+\\varepsilon}\\).</p>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-van-der-corput-a"></div>
<div class="viz-placeholder" data-viz="viz-van-der-corput-b"></div>
`,
            visualizations: [
                {
                    id: 'viz-van-der-corput-a',
                    title: 'A-Process: Differencing Reduces the Phase Degree',
                    description: 'Visualize how the A-process transforms \\(\\sum e(f(n))\\) by replacing \\(f(n)\\) with the difference \\(f(n+h)-f(n)\\). The left panel shows the original phases; the right shows the differenced phases for shift \\(h\\). Notice the flattening.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, { width: 560, height: 360, originX: 280, originY: 180, scale: 1 });
                        var N = 40, h = 3, alpha = 0.05;

                        VizEngine.createSlider(controls, 'alpha (curvature)', 0.01, 0.15, alpha, 0.001, function(v) { alpha = v; draw(); });
                        VizEngine.createSlider(controls, 'h (shift)', 1, 10, h, 1, function(v) { h = Math.round(v); draw(); });
                        VizEngine.createSlider(controls, 'N', 20, 80, N, 1, function(v) { N = Math.round(v); draw(); });

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var W = viz.width, H = viz.height;
                            var leftCx = W * 0.27, leftCy = H / 2;
                            var rightCx = W * 0.77, rightCy = H / 2;
                            var R = Math.min(W * 0.22, H * 0.40);

                            // Draw unit circles
                            [leftCx, rightCx].forEach(function(cx) {
                                ctx.strokeStyle = viz.colors.axis; ctx.lineWidth = 1;
                                ctx.beginPath(); ctx.arc(cx, leftCy, R, 0, Math.PI * 2); ctx.stroke();
                                ctx.strokeStyle = viz.colors.grid; ctx.lineWidth = 0.5;
                                ctx.beginPath(); ctx.moveTo(cx - R - 10, leftCy); ctx.lineTo(cx + R + 10, leftCy); ctx.stroke();
                                ctx.beginPath(); ctx.moveTo(cx, leftCy - R - 10); ctx.lineTo(cx, leftCy + R + 10); ctx.stroke();
                            });

                            // Original vectors: e(alpha * n^2)
                            var reOrig = 0, imOrig = 0;
                            ctx.strokeStyle = viz.colors.teal + '55'; ctx.lineWidth = 0.8;
                            for (var n = 1; n <= N; n++) {
                                var phaseOrig = 2 * Math.PI * alpha * n * n;
                                var vx = Math.cos(phaseOrig), vy = -Math.sin(phaseOrig);
                                ctx.beginPath(); ctx.moveTo(leftCx, leftCy); ctx.lineTo(leftCx + vx * R, leftCy + vy * R); ctx.stroke();
                                reOrig += vx; imOrig += vy;
                            }
                            // Sum vector
                            var sumScaleOrig = R / Math.max(Math.sqrt(reOrig*reOrig+imOrig*imOrig), 0.01);
                            ctx.strokeStyle = viz.colors.orange; ctx.lineWidth = 2.5;
                            ctx.beginPath(); ctx.moveTo(leftCx, leftCy);
                            ctx.lineTo(leftCx + reOrig * Math.min(sumScaleOrig, 0.9), leftCy + imOrig * Math.min(sumScaleOrig, 0.9)); ctx.stroke();
                            ctx.fillStyle = viz.colors.orange;
                            ctx.beginPath(); ctx.arc(leftCx + reOrig * Math.min(sumScaleOrig, 0.9), leftCy + imOrig * Math.min(sumScaleOrig, 0.9), 4, 0, Math.PI * 2); ctx.fill();

                            // Differenced vectors: e(alpha*(n+h)^2 - alpha*n^2) = e(alpha*(2hn + h^2))
                            var reDiff = 0, imDiff = 0;
                            ctx.strokeStyle = viz.colors.purple + '55'; ctx.lineWidth = 0.8;
                            for (var n2 = 1; n2 <= N - h; n2++) {
                                var phaseDiff = 2 * Math.PI * alpha * (2 * h * n2 + h * h);
                                var dvx = Math.cos(phaseDiff), dvy = -Math.sin(phaseDiff);
                                ctx.beginPath(); ctx.moveTo(rightCx, rightCy); ctx.lineTo(rightCx + dvx * R, rightCy + dvy * R); ctx.stroke();
                                reDiff += dvx; imDiff += dvy;
                            }
                            var sumScaleDiff = R / Math.max(Math.sqrt(reDiff*reDiff+imDiff*imDiff), 0.01);
                            ctx.strokeStyle = viz.colors.orange; ctx.lineWidth = 2.5;
                            ctx.beginPath(); ctx.moveTo(rightCx, rightCy);
                            ctx.lineTo(rightCx + reDiff * Math.min(sumScaleDiff, 0.9), rightCy + imDiff * Math.min(sumScaleDiff, 0.9)); ctx.stroke();
                            ctx.fillStyle = viz.colors.orange;
                            ctx.beginPath(); ctx.arc(rightCx + reDiff * Math.min(sumScaleDiff, 0.9), rightCy + imDiff * Math.min(sumScaleDiff, 0.9), 4, 0, Math.PI * 2); ctx.fill();

                            // Labels
                            var origMag = Math.sqrt(reOrig*reOrig+imOrig*imOrig);
                            var diffMag = Math.sqrt(reDiff*reDiff+imDiff*imDiff);
                            ctx.fillStyle = viz.colors.white; ctx.font = '12px -apple-system,sans-serif'; ctx.textAlign = 'center';
                            ctx.fillText('Original: \u03a3e(\u03b1n\u00b2)', leftCx, 18);
                            ctx.fillText('|S| = ' + origMag.toFixed(2), leftCx, 32);
                            ctx.fillText('A-step: \u03a3e(\u03b1(2hn+h\u00b2))', rightCx, 18);
                            ctx.fillText('|\u03a3e\u0394f| = ' + diffMag.toFixed(2), rightCx, 32);
                            ctx.fillStyle = viz.colors.text; ctx.font = '11px -apple-system,sans-serif';
                            ctx.fillText('\u03b1=' + alpha.toFixed(3) + '  h=' + h + '  N=' + N, W/2, H - 10);
                        }
                        draw();
                        return viz;
                    }
                },
                {
                    id: 'viz-van-der-corput-b',
                    title: 'B-Process: Saddle Points and the Dual Sum',
                    description: 'The B-process (Poisson summation) trades \\(N\\) terms with phase \\(f(n)\\) for \\(\\sim \\lambda_2 N\\) terms at saddle points. Visualize the original sum length vs. the dual sum length as \\(f\'\'\\) varies. When \\(f\'\' \\ll 1/N\\), the dual sum is much shorter.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, { width: 560, height: 340, originX: 60, originY: 280, scale: 1 });
                        var lambda2 = 0.05; // size of f''

                        VizEngine.createSlider(controls, '\u03bb\u2082 = |f\'\'| (x10\u207b\u00b3)', 1, 100, lambda2 * 1000, 1, function(v) {
                            lambda2 = v / 1000; draw();
                        });

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var W = viz.width, H = viz.height;

                            var plotL = 60, plotR = W - 20, plotT = 30, plotB = H - 60;
                            var plotW = plotR - plotL, plotH = plotB - plotT;

                            // Axes
                            ctx.strokeStyle = viz.colors.axis; ctx.lineWidth = 1.5;
                            ctx.beginPath(); ctx.moveTo(plotL, plotB); ctx.lineTo(plotR, plotB); ctx.stroke();
                            ctx.beginPath(); ctx.moveTo(plotL, plotT); ctx.lineTo(plotL, plotB); ctx.stroke();

                            // X-axis: N from 10 to 1000 (log scale)
                            var NMin = 10, NMax = 1000;
                            function xPos(N) { return plotL + (Math.log10(N) - Math.log10(NMin)) / (Math.log10(NMax) - Math.log10(NMin)) * plotW; }
                            // Y-axis: sum length 1 to 1000 (log scale)
                            function yPos(len) { return plotB - (Math.log10(Math.max(len,1)) - 0) / (Math.log10(NMax) - 0) * plotH; }

                            // Grid lines and labels
                            ctx.fillStyle = viz.colors.text; ctx.font = '10px -apple-system,sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'top';
                            [10, 100, 1000].forEach(function(N2) {
                                var xx = xPos(N2);
                                ctx.fillText('N=' + N2, xx, plotB + 4);
                                ctx.strokeStyle = viz.colors.grid; ctx.lineWidth = 0.5;
                                ctx.beginPath(); ctx.moveTo(xx, plotT); ctx.lineTo(xx, plotB); ctx.stroke();
                            });
                            ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
                            [1, 10, 100, 1000].forEach(function(len) {
                                var yy = yPos(len);
                                ctx.fillText(len, plotL - 4, yy);
                                ctx.strokeStyle = viz.colors.grid; ctx.lineWidth = 0.5;
                                ctx.beginPath(); ctx.moveTo(plotL, yy); ctx.lineTo(plotR, yy); ctx.stroke();
                            });

                            // Original sum: N terms (diagonal)
                            ctx.strokeStyle = viz.colors.teal; ctx.lineWidth = 2;
                            ctx.beginPath();
                            for (var i = 0; i <= 100; i++) {
                                var Nval = Math.pow(10, Math.log10(NMin) + i/100 * (Math.log10(NMax) - Math.log10(NMin)));
                                var px = xPos(Nval), py = yPos(Nval);
                                i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
                            }
                            ctx.stroke();

                            // Dual sum: lambda2 * N terms
                            ctx.strokeStyle = viz.colors.orange; ctx.lineWidth = 2;
                            ctx.beginPath();
                            for (var i2 = 0; i2 <= 100; i2++) {
                                var Nval2 = Math.pow(10, Math.log10(NMin) + i2/100 * (Math.log10(NMax) - Math.log10(NMin)));
                                var dualLen = Math.max(1, lambda2 * Nval2);
                                var px2 = xPos(Nval2), py2 = yPos(dualLen);
                                i2 === 0 ? ctx.moveTo(px2, py2) : ctx.lineTo(px2, py2);
                            }
                            ctx.stroke();

                            // Legend
                            ctx.font = '12px -apple-system,sans-serif'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
                            ctx.fillStyle = viz.colors.teal; ctx.fillRect(plotL + 10, plotT + 10, 14, 3); ctx.fillText('Original: N terms', plotL + 28, plotT + 11);
                            ctx.fillStyle = viz.colors.orange; ctx.fillRect(plotL + 10, plotT + 28, 14, 3); ctx.fillText('Dual (B-process): \u03bb\u2082\u00b7N terms', plotL + 28, plotT + 29);

                            ctx.fillStyle = viz.colors.white; ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
                            ctx.fillText('\u03bb\u2082 = ' + lambda2.toFixed(4) + '   (f\'\' \u2248 ' + lambda2.toFixed(4) + ')', W/2, H - 4);
                            ctx.fillStyle = viz.colors.text; ctx.font = '11px -apple-system,sans-serif';
                            ctx.fillText('B-process saves work when \u03bb\u2082 \u226a 1  (f\'\' small)', W/2, H - 20);

                            // Crossover point
                            if (lambda2 < 1) {
                                var Ncross = 1 / lambda2;
                                if (Ncross <= NMax) {
                                    ctx.strokeStyle = viz.colors.purple; ctx.lineWidth = 1; ctx.setLineDash([4,3]);
                                    var xcross = xPos(Ncross);
                                    ctx.beginPath(); ctx.moveTo(xcross, plotT); ctx.lineTo(xcross, plotB); ctx.stroke();
                                    ctx.setLineDash([]);
                                    ctx.fillStyle = viz.colors.purple; ctx.textAlign = 'center'; ctx.textBaseline = 'top';
                                    ctx.fillText('N=' + Math.round(Ncross), xcross, plotT + 2);
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
                    question: "Explain why the B-process (Poisson summation) is applicable only when \\(f''(x) \\ne 0\\) on \\([a,b]\\). What goes wrong if \\(f'' = 0\\)?",
                    hint: "The B-process replaces each term by a sum over saddle points, where saddle points are solutions to \\(f'(x) = m\\). What happens to the saddle-point equation if \\(f'\\) is constant?",
                    solution: "If \\(f'' = 0\\) on \\([a,b]\\), then \\(f'\\) is constant, say \\(f'(x) = c\\). The saddle-point equation \\(f'(x) = m\\) has either infinitely many solutions (if \\(m = c\\)) or none (if \\(m \\ne c\\)). The stationary phase approximation breaks down — there is no isolated saddle point. The B-process requires \\(f''\\) to be nonzero so that each integer \\(m\\) corresponds to at most one saddle point with a well-defined quadratic expansion."
                },
                {
                    question: "For \\(f(n) = n^{3/2}\\), compute \\(f'(n)\\) and \\(f''(n)\\). Estimate the number of terms in the B-process dual sum over \\([1, N]\\).",
                    hint: "The dual sum runs over \\(m \\in [f'(1), f'(N)]\\).",
                    solution: "\\(f'(n) = \\frac{3}{2}n^{1/2}\\), \\(f''(n) = \\frac{3}{4}n^{-1/2}\\). The range of \\(m\\) is \\([f'(1), f'(N)] = [3/2, \\frac{3}{2}\\sqrt{N}]\\), giving \\(\\sim \\frac{3}{2}\\sqrt{N}\\) integer values. The dual sum has \\(O(\\sqrt{N})\\) terms instead of \\(N\\), a compression by a factor of \\(\\sqrt{N}\\). Since each dual term has magnitude \\((f'')^{-1/2} \\sim n^{1/4} \\ll 1\\), the dual sum is \\(O(N^{1/4} \\cdot N^{1/2}) = O(N^{3/4})\\), consistent with \\(|S| \\ll N^{3/4}\\)."
                }
            ]
        },

        // ================================================================
        // SECTION 4: Vinogradov's Method
        // ================================================================
        {
            id: 'sec-vinogradov',
            title: "Vinogradov's Method",
            content: `
<h2>Vinogradov's Method</h2>

<div class="env-block intuition">
    <div class="env-title">Overcoming the Weyl Bottleneck</div>
    <div class="env-body">
        <p>Weyl's inequality for degree \\(k\\) gives \\(|S| \\ll N^{1 - 2^{1-k} + \\varepsilon}\\). For \\(k = 10\\), the saving over the trivial bound is only \\(2^{-9} \\approx 0.2\\%\\). Vinogradov (1934–1937) obtained \\(|S| \\ll N^{1 - c/k^2}\\) — saving a full \\(1/k^2\\) — by averaging over many shifts simultaneously, rather than iterating one shift at a time.</p>
    </div>
</div>

<h3>Mean Value Estimates</h3>

<p>Vinogradov's key idea is to bound the <em>mean value</em></p>
\\[J_{s,k}(N) = \\int_0^1 \\cdots \\int_0^1 \\left|\\sum_{n=1}^N e(\\alpha_1 n + \\alpha_2 n^2 + \\cdots + \\alpha_k n^k)\\right|^{2s} \\, d\\alpha_1 \\cdots d\\alpha_k.\\]

<p>By orthogonality, \\(J_{s,k}(N)\\) counts the number of solutions to the system</p>
\\[x_1^j + x_2^j + \\cdots + x_s^j = y_1^j + y_2^j + \\cdots + y_s^j, \\quad j = 1, 2, \\ldots, k,\\]
<p>with \\(1 \\le x_i, y_i \\le N\\). The trivial solutions contribute \\(N^s\\) (permutations of \\(x_i = y_i\\)); non-trivial solutions are controlled by number-theoretic arguments.</p>

<div class="env-block theorem">
    <div class="env-title">Theorem 14.5 (Vinogradov Mean Value Theorem)</div>
    <div class="env-body">
        <p>For \\(s \\ge 1\\) and \\(k \\ge 2\\),</p>
        \\[J_{s,k}(N) \\ll N^{2s - k(k+1)/2 + \\varepsilon} + N^s.\\]
        <p>The first term dominates when \\(s \\ge k(k+1)/4\\). The exponent \\(k(k+1)/2\\) equals the number of unknowns in the Vinogradov system, and achieving \\(N^{2s-k(k+1)/2}\\) means the system behaves as if the solutions were "generic" (no unexpected collisions).</p>
    </div>
</div>

<p><strong>Historical note.</strong> The VMT in this sharp form was proved by Wooley (2012–2016) using <em>efficient congruencing</em>, completing a program that Vinogradov began but could not finish with his original tools. Bourgain, Demeter, and Guth (2016) gave an independent proof via decoupling inequalities from harmonic analysis.</p>

<h3>Consequence for Weyl Sums</h3>

<p>From the VMT, one deduces: for any polynomial \\(f(n) = \\alpha n^k + \\cdots\\) with \\(|\\alpha - a/q| \\le 1/q^2\\),</p>
\\[\\left|\\sum_{n=1}^N e(f(n))\\right| \\ll N^{1 + \\varepsilon} \\left(\\frac{1}{q} + \\frac{1}{N} + \\frac{q}{N^k}\\right)^{1/k(k-1)}.\\]
<p>The saving is \\(1/k(k-1)\\) vs. Weyl's \\(2^{1-k}\\) — a dramatic improvement for large \\(k\\).</p>

<div class="env-block definition">
    <div class="env-title">Definition: Vinogradov System</div>
    <div class="env-body">
        <p>The <em>Vinogradov system</em> \\(V_{s,k}(N)\\) is the set of \\((\\mathbf{x}, \\mathbf{y}) \\in \\{1,\\ldots,N\\}^{2s}\\) satisfying</p>
        \\[\\sum_{i=1}^s x_i^j = \\sum_{i=1}^s y_i^j \\quad \\text{for } j = 1, \\ldots, k.\\]
        <p>\\(J_{s,k}(N) = |V_{s,k}(N)|\\).</p>
    </div>
</div>

<h3>Application: Waring's Problem</h3>

<p>Waring's problem asks: for each \\(k\\), does every sufficiently large integer \\(n\\) have a representation as a sum of \\(s\\) perfect \\(k\\)-th powers? The VMT gives the current best value of \\(s\\) for which the answer is yes (via the Hardy-Littlewood circle method combined with the VMT bound).</p>
`,
            visualizations: [],
            exercises: [
                {
                    question: 'Interpret \\(J_{s,k}(N)\\) combinatorially. Show that \\(J_{s,k}(N) \\ge N^s\\) by constructing trivial solutions to the Vinogradov system.',
                    hint: 'What happens when \\(\\{x_1,\\ldots,x_s\\} = \\{y_1,\\ldots,y_s\\}\\) as multisets?',
                    solution: 'For any \\((x_1,\\ldots,x_s) \\in \\{1,\\ldots,N\\}^s\\), set \\((y_1,\\ldots,y_s\\)\\) to be any permutation of \\((x_1,\\ldots,x_s)\\). Then \\(\\sum x_i^j = \\sum y_i^j\\) for all \\(j\\), so every such pair is a solution. There are \\(N^s\\) choices for \\(\\mathbf{x}\\) and \\(s!\\) permutations for \\(\\mathbf{y}\\), giving at least \\(N^s\\) solutions (taking only the identity permutation). Thus \\(J_{s,k}(N) \\ge N^s\\).'
                },
                {
                    question: "For \\(k=2\\), the Vinogradov system reduces to \\(x_1 + x_2 = y_1 + y_2\\) and \\(x_1^2 + x_2^2 = y_1^2 + y_2^2\\). Show that these two equations together force \\(\\{x_1, x_2\\} = \\{y_1, y_2\\}\\) as multisets (when \\(x_i, y_i\\) are integers).",
                    hint: 'Use the identity \\((x_1^2 + x_2^2) - \\frac{(x_1+x_2)^2}{2} = \\frac{(x_1-x_2)^2}{2}\\) applied to both sides.',
                    solution: 'Let \\(a = x_1 + x_2 = y_1 + y_2\\) and \\(b = x_1^2 + x_2^2 = y_1^2 + y_2^2\\). Then \\(x_1 x_2 = (a^2 - b)/2 = y_1 y_2\\). So \\(x_1, x_2\\) and \\(y_1, y_2\\) are both roots of \\(t^2 - at + (a^2-b)/2 = 0\\). A quadratic has exactly two roots (counting multiplicity), so \\(\\{x_1, x_2\\} = \\{y_1, y_2\\}\\) as multisets. All solutions are trivial: \\(J_{2,2}(N) = N^2 \\cdot 2\\) (identity and swap). This matches the VMT prediction \\(N^{2s - k(k+1)/2} = N^{4-3} = N\\) being dominated by \\(N^s = N^2\\).'
                }
            ]
        },

        // ================================================================
        // SECTION 5: Gauss & Kloosterman Sums
        // ================================================================
        {
            id: 'sec-gauss-kloosterman',
            title: 'Gauss & Kloosterman Sums',
            content: `
<h2>Gauss and Kloosterman Sums</h2>

<div class="env-block intuition">
    <div class="env-title">Arithmetic Phases</div>
    <div class="env-body">
        <p>When the phase \\(f(n)\\) has arithmetic structure — for example, \\(f(n) = n^2/p\\) or \\(f(n) = (mn + n^{-1})/p\\) — we can exploit the ring structure of \\(\\mathbb{Z}/p\\mathbb{Z}\\) to get <em>exact</em> evaluations or square-root bounds, rather than the approximate bounds from Weyl or van der Corput.</p>
    </div>
</div>

<h3>Gauss Sums</h3>

<div class="env-block definition">
    <div class="env-title">Definition: Gauss Sum</div>
    <div class="env-body">
        <p>For a prime \\(p\\) and integer \\(a\\), the <em>Gauss sum</em> is</p>
        \\[G(a, p) = \\sum_{n=0}^{p-1} e\\left(\\frac{an^2}{p}\\right) = \\sum_{n \\bmod p} e\\left(\\frac{an^2}{p}\\right).\\]
        <p>More generally, for a Dirichlet character \\(\\chi \\bmod q\\),</p>
        \\[\\tau(\\chi) = \\sum_{n=1}^{q} \\chi(n) e\\left(\\frac{n}{q}\\right).\\]
    </div>
</div>

<p>The classical result evaluates \\(|G(1,p)|\\) exactly:</p>

<div class="env-block theorem">
    <div class="env-title">Theorem 14.6 (Gauss)</div>
    <div class="env-body">
        <p>For an odd prime \\(p\\),</p>
        \\[G(1,p) = \\begin{cases} \\sqrt{p} & \\text{if } p \\equiv 1 \\pmod 4, \\\\ i\\sqrt{p} & \\text{if } p \\equiv 3 \\pmod 4. \\end{cases}\\]
        <p>In particular, \\(|G(1,p)| = \\sqrt{p}\\). This is the square-root cancellation threshold.</p>
    </div>
</div>

<h3>Kloosterman Sums</h3>

<div class="env-block definition">
    <div class="env-title">Definition: Kloosterman Sum</div>
    <div class="env-body">
        <p>For integers \\(m, n, c\\) with \\(c \\ge 1\\), the <em>Kloosterman sum</em> is</p>
        \\[S(m, n; c) = \\sum_{\\substack{d=1 \\\\ \\gcd(d,c)=1}}^{c} e\\left(\\frac{md + n\\bar{d}}{c}\\right),\\]
        <p>where \\(\\bar{d}\\) denotes the multiplicative inverse of \\(d \\bmod c\\).</p>
    </div>
</div>

<p>Kloosterman sums appear naturally in the Fourier expansion of automorphic forms (Poincare series) and in counting solutions to \\(ax + by \\equiv c \\pmod{q}\\) with \\(xy \\equiv n \\pmod{q}\\).</p>

<div class="env-block theorem">
    <div class="env-title">Theorem 14.7 (Weil Bound)</div>
    <div class="env-body">
        <p>For a prime \\(p\\) and integers \\(m, n\\) not both divisible by \\(p\\),</p>
        \\[|S(m, n; p)| \\le 2\\sqrt{p}.\\]
        <p>This bound is sharp: there exist \\(m, n, p\\) with \\(|S(m,n;p)| = 2\\sqrt{p}\\).</p>
    </div>
</div>

<p>The Weil bound follows from the Riemann hypothesis for curves over finite fields, proved by Weil (1948). For composite moduli, one uses the multiplicativity of Kloosterman sums: \\(S(m,n;q_1 q_2) = S(m\\bar{q}_2, n\\bar{q}_2; q_1) S(m\\bar{q}_1, n\\bar{q}_1; q_2)\\) when \\(\\gcd(q_1, q_2) = 1\\).</p>

<h3>Connection to \\(\\ell\\)-adic Sheaves</h3>

<p>The deepest modern understanding of these bounds comes from Deligne's proof of the Riemann hypothesis over finite fields (1974). Each Kloosterman sum \\(S(m,n;p)\\) is a trace of Frobenius on a certain \\(\\ell\\)-adic sheaf (the "Kloosterman sheaf"). The Weil bound \\(2\\sqrt{p}\\) reflects the fact that the sheaf has rank 2 and its eigenvalues have complex modulus \\(\\sqrt{p}\\).</p>

<div class="viz-placeholder" data-viz="viz-kloosterman-path"></div>
<div class="viz-placeholder" data-viz="viz-weil-bound"></div>
`,
            visualizations: [
                {
                    id: 'viz-kloosterman-path',
                    title: 'Kloosterman Sum \\(S(m,n;p)\\) Traced in \\(\\mathbb{C}\\)',
                    description: 'Each term \\(e((md + n\\bar{d})/p)\\) is a unit vector in \\(\\mathbb{C}\\). Trace the partial sums as \\(d\\) ranges over invertible residues mod \\(p\\). Adjust \\(m, n, p\\).',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, { width: 560, height: 420, originX: 280, originY: 210, scale: 40 });
                        var m = 1, n = 1, p = 13;

                        VizEngine.createSlider(controls, 'm', 1, 20, m, 1, function(v) { m = Math.round(v); draw(); });
                        VizEngine.createSlider(controls, 'n', 1, 20, n, 1, function(v) { n = Math.round(v); draw(); });
                        VizEngine.createSlider(controls, 'p (prime)', 5, 47, p, 1, function(v) {
                            var primes = [5,7,11,13,17,19,23,29,31,37,41,43,47];
                            p = primes.reduce(function(a, b) { return Math.abs(b - v) < Math.abs(a - v) ? b : a; });
                            draw();
                        });

                        function modInverse(d, mod) {
                            // Extended Euclidean
                            var a = ((d % mod) + mod) % mod;
                            if (a === 0) return 0;
                            var old_r = a, r = mod, old_s = 1, s = 0;
                            while (r !== 0) {
                                var q = Math.floor(old_r / r);
                                var tmp = r; r = old_r - q * r; old_r = tmp;
                                tmp = s; s = old_s - q * s; old_s = tmp;
                            }
                            return ((old_s % mod) + mod) % mod;
                        }

                        function draw() {
                            viz.clear();
                            viz.drawAxes();
                            var ctx = viz.ctx;

                            // Draw unit circle
                            ctx.strokeStyle = viz.colors.grid; ctx.lineWidth = 1;
                            ctx.beginPath(); ctx.arc(viz.originX, viz.originY, viz.scale, 0, Math.PI * 2); ctx.stroke();

                            var pts = [[0, 0]];
                            var re = 0, im = 0;
                            for (var d = 1; d < p; d++) {
                                if (Math.gcd) { if (Math.gcd(d, p) !== 1) continue; }
                                var dInv = modInverse(d, p);
                                if (dInv === 0) continue;
                                var phase = 2 * Math.PI * (m * d + n * dInv) / p;
                                re += Math.cos(phase); im += Math.sin(phase);
                                pts.push([re, im]);
                            }

                            // Scale to fit
                            var maxR = 0;
                            pts.forEach(function(p2) { maxR = Math.max(maxR, Math.sqrt(p2[0]*p2[0]+p2[1]*p2[1])); });
                            var scale = maxR > 0 ? Math.min(viz.scale * 3, Math.min(viz.width, viz.height) * 0.38 / maxR) : viz.scale;

                            // Draw Weil circle: |S| <= 2*sqrt(p)
                            var weilR = 2 * Math.sqrt(p) * scale;
                            ctx.strokeStyle = viz.colors.yellow + '66'; ctx.lineWidth = 1.5; ctx.setLineDash([5,4]);
                            ctx.beginPath(); ctx.arc(viz.originX, viz.originY, weilR, 0, Math.PI * 2); ctx.stroke();
                            ctx.setLineDash([]);
                            ctx.fillStyle = viz.colors.yellow; ctx.font = '11px -apple-system,sans-serif'; ctx.textAlign = 'left';
                            ctx.fillText('Weil: 2\u221a' + p + ' = ' + (2*Math.sqrt(p)).toFixed(2), viz.originX + weilR + 4, viz.originY - 4);

                            // Draw path
                            ctx.strokeStyle = viz.colors.teal; ctx.lineWidth = 1.5;
                            ctx.beginPath();
                            pts.forEach(function(pt, i) {
                                var sx = viz.originX + pt[0] * scale;
                                var sy = viz.originY - pt[1] * scale;
                                i === 0 ? ctx.moveTo(sx, sy) : ctx.lineTo(sx, sy);
                            });
                            ctx.stroke();

                            // Individual step vectors
                            for (var i = 0; i < pts.length - 1; i++) {
                                var sx1 = viz.originX + pts[i][0] * scale, sy1 = viz.originY - pts[i][1] * scale;
                                var sx2 = viz.originX + pts[i+1][0] * scale, sy2 = viz.originY - pts[i+1][1] * scale;
                                ctx.strokeStyle = viz.colors.blue + '88'; ctx.lineWidth = 1;
                                ctx.beginPath(); ctx.moveTo(sx1, sy1); ctx.lineTo(sx2, sy2); ctx.stroke();
                            }

                            // Final point
                            var lastPt = pts[pts.length - 1];
                            var mag = Math.sqrt(lastPt[0]*lastPt[0]+lastPt[1]*lastPt[1]);
                            var lsx = viz.originX + lastPt[0] * scale, lsy = viz.originY - lastPt[1] * scale;
                            ctx.fillStyle = viz.colors.orange;
                            ctx.beginPath(); ctx.arc(lsx, lsy, 5, 0, Math.PI * 2); ctx.fill();

                            viz.screenText('S(' + m + ',' + n + ';' + p + ') = ' + re.toFixed(3) + '+' + im.toFixed(3) + 'i', viz.width/2, 16, viz.colors.white, 13);
                            viz.screenText('|S| = ' + mag.toFixed(3) + '   Weil bound = ' + (2*Math.sqrt(p)).toFixed(3), viz.width/2, 32, viz.colors.text, 11);
                        }
                        draw();
                        return viz;
                    }
                },
                {
                    id: 'viz-weil-bound',
                    title: 'Weil Bound: \\(|S(m,n;p)| \\le 2\\sqrt{p}\\) Across Primes',
                    description: 'For each prime \\(p\\), plot \\(|S(m,n;p)|\\) (blue dots) and the Weil bound \\(2\\sqrt{p}\\) (red curve). The bound is rarely tight; the ratio \\(|S|/(2\\sqrt{p})\\) is typically much less than 1.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, { width: 560, height: 340, originX: 60, originY: 290, scale: 1 });
                        var m = 1, n = 1;

                        VizEngine.createSlider(controls, 'm', 1, 10, m, 1, function(v) { m = Math.round(v); draw(); });
                        VizEngine.createSlider(controls, 'n', 1, 10, n, 1, function(v) { n = Math.round(v); draw(); });

                        function modInverse(d, mod) {
                            var a = ((d % mod) + mod) % mod;
                            if (a === 0) return 0;
                            var old_r = a, r = mod, old_s = 1, s = 0;
                            while (r !== 0) {
                                var q = Math.floor(old_r / r);
                                var tmp = r; r = old_r - q * r; old_r = tmp;
                                tmp = s; s = old_s - q * s; old_s = tmp;
                            }
                            return ((old_s % mod) + mod) % mod;
                        }

                        function kloosterman(m2, n2, p2) {
                            var re = 0, im = 0;
                            for (var d = 1; d < p2; d++) {
                                var dInv = modInverse(d, p2);
                                if (dInv === 0) continue;
                                // gcd(d, p2) = 1 since p2 is prime and 1<=d<p2
                                var phase = 2 * Math.PI * (m2 * d + n2 * dInv) / p2;
                                re += Math.cos(phase); im += Math.sin(phase);
                            }
                            return Math.sqrt(re * re + im * im);
                        }

                        var primes = [2,3,5,7,11,13,17,19,23,29,31,37,41,43,47,53,59,61,67,71,73,79,83,89,97];

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var W = viz.width, H = viz.height;
                            var plotL = 60, plotR = W - 20, plotT = 30, plotB = H - 50;
                            var plotW = plotR - plotL, plotH = plotB - plotT;
                            var maxP = primes[primes.length - 1];

                            // Axes
                            ctx.strokeStyle = viz.colors.axis; ctx.lineWidth = 1.5;
                            ctx.beginPath(); ctx.moveTo(plotL, plotB); ctx.lineTo(plotR, plotB); ctx.stroke();
                            ctx.beginPath(); ctx.moveTo(plotL, plotT); ctx.lineTo(plotL, plotB); ctx.stroke();

                            // Labels
                            ctx.fillStyle = viz.colors.text; ctx.font = '10px -apple-system,sans-serif';
                            ctx.textAlign = 'center'; ctx.textBaseline = 'top';
                            [2, 25, 50, 75, 97].forEach(function(v) {
                                var xx = plotL + (v / maxP) * plotW;
                                ctx.fillText('p=' + v, xx, plotB + 4);
                            });
                            ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
                            var maxBound = 2 * Math.sqrt(maxP);
                            [0, 5, 10, 15, 20].forEach(function(v) {
                                if (v > maxBound) return;
                                var yy = plotB - (v / maxBound) * plotH;
                                ctx.fillText(v, plotL - 4, yy);
                                ctx.strokeStyle = viz.colors.grid; ctx.lineWidth = 0.5;
                                ctx.beginPath(); ctx.moveTo(plotL, yy); ctx.lineTo(plotR, yy); ctx.stroke();
                            });

                            // Weil bound curve 2*sqrt(p)
                            ctx.strokeStyle = viz.colors.red; ctx.lineWidth = 2;
                            ctx.beginPath();
                            for (var i = 0; i <= 100; i++) {
                                var pv = 2 + (maxP - 2) * i / 100;
                                var bv = 2 * Math.sqrt(pv);
                                var px = plotL + (pv / maxP) * plotW;
                                var py = plotB - (bv / maxBound) * plotH;
                                i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
                            }
                            ctx.stroke();

                            // Kloosterman sum values
                            primes.forEach(function(p2) {
                                var kval = kloosterman(m, n, p2);
                                var px = plotL + (p2 / maxP) * plotW;
                                var py = plotB - (kval / maxBound) * plotH;
                                ctx.fillStyle = viz.colors.blue;
                                ctx.beginPath(); ctx.arc(px, py, 3.5, 0, Math.PI * 2); ctx.fill();
                            });

                            // Legend
                            ctx.font = '12px -apple-system,sans-serif'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
                            ctx.fillStyle = viz.colors.red;
                            ctx.beginPath(); ctx.moveTo(plotL + 10, plotT + 12); ctx.lineTo(plotL + 26, plotT + 12); ctx.strokeStyle = viz.colors.red; ctx.lineWidth = 2; ctx.stroke();
                            ctx.fillText('Weil bound 2\u221ap', plotL + 30, plotT + 12);
                            ctx.fillStyle = viz.colors.blue;
                            ctx.beginPath(); ctx.arc(plotL + 18, plotT + 30, 3.5, 0, Math.PI * 2); ctx.fill();
                            ctx.fillText('|S(m,n;p)|', plotL + 30, plotT + 30);

                            ctx.fillStyle = viz.colors.white; ctx.textAlign = 'center'; ctx.textBaseline = 'top';
                            ctx.fillText('m=' + m + ',  n=' + n, W/2, plotB + 28);
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Verify the Gauss sum \\(G(1,5) = \\sum_{n=0}^{4} e(n^2/5)\\) numerically. What is \\(|G(1,5)|\\)? Does it equal \\(\\sqrt{5}\\)?',
                    hint: 'Compute \\(e(0), e(1/5), e(4/5), e(9/5), e(16/5) = e(0), e(1/5), e(4/5), e(4/5), e(1/5)\\) (since \\(9 \\equiv 4, 16 \\equiv 1 \\pmod 5\\)).',
                    solution: 'The values \\(n^2 \\bmod 5\\) for \\(n=0,1,2,3,4\\) are \\(0,1,4,4,1\\). So \\(G(1,5) = 1 + e(1/5) + e(4/5) + e(4/5) + e(1/5) = 1 + 2e(1/5) + 2e(4/5)\\). Now \\(e(1/5) + e(4/5) = 2\\cos(2\\pi/5) = (\\sqrt{5}-1)/2\\). So \\(G(1,5) = 1 + 2 \\cdot 2\\cos(2\\pi/5)\\). Numerically: \\(\\cos(72°) \\approx 0.309\\), giving \\(G(1,5) \\approx 1 + 4(0.309) = 2.236 \\approx \\sqrt{5}\\). Since \\(5 \\equiv 1 \\pmod 4\\), \\(G(1,5) = \\sqrt{5}\\) is real and positive. \\(|G(1,5)| = \\sqrt{5}\\). \\(\\checkmark\\)'
                },
                {
                    question: 'Show that for a prime \\(p\\) and \\(m \\not\\equiv 0 \\pmod p\\), the Kloosterman sum satisfies \\(S(m,0;p) = \\sum_{d=1}^{p-1} e(md/p) = -1\\). (This is the "degenerate" Kloosterman sum.)',
                    hint: "When \\(n=0\\), the \\(\\bar{d}\\) term disappears. Sum over all nonzero residues mod \\(p\\).",
                    solution: "When \\(n=0\\), \\(S(m,0;p) = \\sum_{d=1}^{p-1} e(md/p)\\). This is a complete character sum \\(\\sum_{d=0}^{p-1} e(md/p) - e(0) = 0 - 1 = -1\\), using the fact that \\(\\sum_{d=0}^{p-1} e(md/p) = 0\\) for \\(m \\not\\equiv 0 \\pmod p\\) (sum of all \\(p\\)-th roots of unity). So \\(S(m,0;p) = -1\\) and \\(|S(m,0;p)| = 1 \\le 2\\sqrt{p}\\). \\(\\square\\)"
                }
            ]
        },

        // ================================================================
        // SECTION 6: Applications
        // ================================================================
        {
            id: 'sec-applications',
            title: 'Applications',
            content: `
<h2>Applications</h2>

<p>Exponential sums permeate analytic number theory. Here we sketch four flagship applications.</p>

<h3>1. Dirichlet's Theorem on Primes in Progressions</h3>

<p>Dirichlet characters \\(\\chi \\bmod q\\) satisfy the orthogonality relation</p>
\\[\\sum_{\\chi \\bmod q} \\chi(n) \\overline{\\chi(m)} = \\phi(q) \\cdot \\mathbf{1}[n \\equiv m \\pmod q].\\]
<p>The Gauss sum \\(\\tau(\\chi) = \\sum_n \\chi(n) e(n/q)\\) relates characters to exponential sums via the inversion formula \\(\\chi(n) = \\frac{1}{\\tau(\\bar\\chi)}\\sum_a \\bar\\chi(a) e(an/q)\\). Bounding \\(L(1, \\chi) \\ne 0\\) — the key analytic input for Dirichlet's theorem — uses the non-vanishing of \\(\\tau(\\chi)\\) and the factorization \\(\\zeta(s)\\prod_{\\chi} L(s,\\chi)\\).</p>

<h3>2. Vinogradov's Three-Primes Theorem</h3>

<p>Every sufficiently large odd integer is a sum of three primes (1937). The proof uses the Hardy-Littlewood circle method. On the "major arcs" (\\(\\alpha\\) near rationals \\(a/q\\) with \\(q\\) small), the exponential sum over primes</p>
\\[S(\\alpha) = \\sum_{p \\le N} e(\\alpha p)\\]
<p>is controlled by primes in arithmetic progressions (Siegel-Walfisz theorem). On the "minor arcs," Vinogradov's method bounds \\(S(\\alpha)\\) by exploiting the irregularity of primes at irrational \\(\\alpha\\).</p>

<h3>3. The Divisor Problem and the Riemann Hypothesis</h3>

<p>The error term in the divisor problem \\(\\sum_{n \\le x} d(n) = x\\log x + (2\\gamma-1)x + \\Delta(x)\\) satisfies \\(\\Delta(x) = O(x^{1/3+\\varepsilon})\\) (van der Corput). The conjectured bound \\(O(x^{1/4+\\varepsilon})\\) would follow from the Riemann hypothesis combined with exponential sum estimates for \\(\\sum_{n \\sim \\sqrt{x}} e(2\\sqrt{xn})\\).</p>

<h3>4. Equidistribution of Hecke Eigenvalues</h3>

<p>The Sato-Tate conjecture (proved by Taylor et al., 2008) states that normalized Hecke eigenvalues of a non-CM elliptic curve are equidistributed with respect to the semicircular measure. The key analytic tool is bounding the Rankin-Selberg \\(L\\)-function, which amounts to controlling exponential sums of the form \\(\\sum_{n \\le x} a_f(n) e(\\alpha n)\\) where \\(a_f(n)\\) are Fourier coefficients of a cusp form.</p>

<div class="env-block remark">
    <div class="env-title">A Unifying Thread</div>
    <div class="env-body">
        <p>In every application, the strategy is the same: write the counting or averaging problem as an integral over \\([0,1]\\) (or \\([0,1]^k\\)) involving an exponential sum, decompose \\([0,1]\\) into "major arcs" where arithmetic approximations are good and "minor arcs" where cancellation is guaranteed, and bound each piece. The quality of the final result is precisely the quality of the exponential sum bound used on the minor arcs.</p>
    </div>
</div>
`,
            visualizations: [],
            exercises: [
                {
                    question: 'Explain why bounding the exponential sum \\(S(\\alpha) = \\sum_{p \\le N} e(\\alpha p)\\) on "minor arcs" (\\(\\alpha\\) far from rationals with small denominator) is the key step in proving Vinogradov\'s three-primes theorem via the circle method.',
                    hint: 'Write the number of representations of \\(n\\) as \\(p_1 + p_2 + p_3\\) as \\(\\int_0^1 S(\\alpha)^3 e(-n\\alpha)\\, d\\alpha\\) and explain the major/minor arc decomposition.',
                    solution: 'By orthogonality, \\(r(n) = \\#\\{p_1+p_2+p_3 = n\\} = \\int_0^1 S(\\alpha)^3 e(-n\\alpha)\\, d\\alpha\\). Split \\([0,1]\\) into major arcs \\(\\mathfrak{M}\\) (\\(\\alpha\\) within \\(q/N^2\\) of \\(a/q\\) for \\(q \\le Q\\)) and minor arcs \\(\\mathfrak{m} = [0,1] \\setminus \\mathfrak{M}\\). On major arcs, \\(S(\\alpha) \\approx \\frac{\\mu(q)}{\\phi(q)} \\cdot \\frac{N}{\\log N}\\) by Dirichlet\'s theorem, and the integral gives the "singular series" times \\(N^2/(\\log N)^3\\) — the expected main term. On minor arcs, one needs \\(\\max_{\\alpha \\in \\mathfrak{m}} |S(\\alpha)| \\le N^{1-\\delta}\\) for some \\(\\delta > 0\\). This is Vinogradov\'s estimate, and it makes the minor-arc integral \\(o(N^2/(\\log N)^3)\\), a negligible error term. The positivity of \\(r(n)\\) then follows for large \\(n\\).'
                },
                {
                    question: 'Use the Gauss sum evaluation \\(|G(1,p)| = \\sqrt{p}\\) to derive the quadratic reciprocity law for odd primes \\(p \\ne q\\). (Sketch only; assume \\(G(1,p)^2 = (-1)^{(p-1)/2} p\\).)',
                    hint: 'Evaluate \\(G(1,p)^2 \\bmod q\\) two ways.',
                    solution: 'Recall \\(G(1,p)^2 = (-1)^{(p-1)/2} p\\). Raise both sides to the power \\((q-1)/2 \\bmod q\\) (Euler\'s criterion). Left side: \\(G(1,p)^{q-1} = \\left(G(1,p)^2\\right)^{(q-1)/2}\\). Right side (mod \\(q\\)): \\(G(1,p) \\equiv G(1,p)^q / G(1,p)^{q-1}\\). Working mod \\(q\\) one computes \\(G(1,p)^q \\equiv \\left(p/q\\right) G(1,p) \\pmod q\\) (by Frobenius). Thus \\(G(1,p)^{q-1} \\equiv \\left(p/q\\right)\\pmod q\\). Comparing with \\(\\left((-1)^{(p-1)/2}p/q\\right) = \\left(-1/q\\right)^{(p-1)/2}\\left(p/q\\right)\\), and using \\(G(1,p)^2 = (-1)^{(p-1)/2}p\\), one recovers quadratic reciprocity: \\(\\left(p/q\\right)\\left(q/p\\right) = (-1)^{(p-1)(q-1)/4}\\). \\(\\square\\)'
                }
            ]
        },

        // ================================================================
        // SECTION 7: Bridge — Engine of the Circle Method
        // ================================================================
        {
            id: 'sec-bridge',
            title: 'Engine of the Circle Method',
            content: `
<h2>Engine of the Circle Method</h2>

<div class="env-block intuition">
    <div class="env-title">The Circle Method in One Paragraph</div>
    <div class="env-body">
        <p>The Hardy-Littlewood circle method (1920s) uses the identity
        \\[\\mathbf{1}[n = k] = \\int_0^1 e((n-k)\\alpha)\\, d\\alpha\\]
        to convert a discrete counting problem into a continuous integral. Writing the generating function \\(F(\\alpha) = \\sum_n a_n e(n\\alpha)\\) (a "trigonometric polynomial"), one gets \\(\\sum a_{n_1} a_{n_2} \\cdots = \\int_0^1 F(\\alpha)^s e(-N\\alpha)\\, d\\alpha\\). The integral is evaluated by decomposing \\([0,1]\\) into major arcs (where arithmetic information about \\(F\\) is available) and minor arcs (where exponential sum bounds guarantee smallness). Exponential sums are literally the engine that makes the minor arc argument work.</p>
    </div>
</div>

<h3>Waring's Problem: Blueprint</h3>

<p>To show every large \\(n\\) is a sum of \\(s\\) perfect \\(k\\)-th powers, define</p>
\\[f(\\alpha) = \\sum_{m=1}^{N^{1/k}} e(\\alpha m^k), \\qquad r_s(n) = \\int_0^1 f(\\alpha)^s e(-n\\alpha)\\, d\\alpha.\\]

<p>Then \\(r_s(n) = \\#\\{m_1^k + \\cdots + m_s^k = n, \\, 1 \\le m_i \\le N^{1/k}\\}\\). To show \\(r_s(n) > 0\\), one proves \\(r_s(n) \\sim \\mathfrak{S}(n) \\cdot \\mathfrak{I}(n)\\) where:</p>
<ul>
    <li>\\(\\mathfrak{S}(n) = \\sum_{q=1}^{\\infty} \\sum_{\\gcd(a,q)=1} q^{-s} \\left(\\sum_{m=1}^{q} e(am^k/q)\\right)^s e(-an/q)\\) is the <em>singular series</em> (arithmetic factor, related to Gauss sums over all moduli).</li>
    <li>\\(\\mathfrak{I}(n) = \\int_{-\\infty}^{\\infty} \\left(\\int_0^1 e(\\beta t^k)\\, dt\\right)^s e(-\\beta n/N)\\, d\\beta\\) is the <em>singular integral</em> (real analysis factor).</li>
</ul>

<p>Both factors are positive for \\(n\\) sufficiently large and \\(s \\ge s_0(k)\\), proving Waring's conjecture. The key analytic input: on minor arcs, the VMT gives \\(|f(\\alpha)| \\ll N^{1/k - 1/(2k^2) + \\varepsilon}\\), so \\(\\int_{\\text{minor}} |f|^s |e(-n\\alpha)| \\, d\\alpha = o(N^{s/k - 1})\\).</p>

<h3>Structure of the Major Arcs</h3>

<p>Major arcs are intervals \\(|\\alpha - a/q| \\le Q/N\\) for \\(\\gcd(a,q)=1\\) and \\(q \\le Q\\). On a major arc near \\(a/q\\),</p>
\\[f(\\alpha) \\approx \\frac{1}{\\phi(q)} S(q,a) \\cdot I(\\alpha - a/q)\\]
<p>where \\(S(q,a) = \\sum_{m=1}^{q} e(am^k/q)\\) is a Gauss-type sum and \\(I(\\beta) = \\int_0^{N^{1/k}} e(\\beta t^k)\\, dt\\). The product \\(\\prod_p (1 + \\text{local correction})\\) converges to the singular series, and the Gaussian integral gives the singular integral.</p>

<div class="env-block theorem">
    <div class="env-title">Theorem 14.8 (Hua's Inequality)</div>
    <div class="env-body">
        <p>For \\(f(\\alpha) = \\sum_{m=1}^{N} e(\\alpha m^k)\\),</p>
        \\[\\int_0^1 |f(\\alpha)|^{2^k}\\, d\\alpha \\ll N^{2^k - k + \\varepsilon}.\\]
        <p>This mean value estimate, combined with the major arc approximation, allows one to handle Waring's problem with \\(s \\ge 2^k + 1\\) variables (Hua's theorem). The VMT improves this to \\(s \\ge k^2 \\log k\\) variables.</p>
    </div>
</div>

<h3>Beyond Waring: Other Applications of the Circle Method</h3>

<ul>
    <li><strong>Goldbach's conjecture (conditional):</strong> Every even number \\(\\ge 4\\) is a sum of two primes. Assuming GRH on the minor arcs, Chen's theorem proves every large even number is \\(p + q_1 q_2\\) (almost there).</li>
    <li><strong>Sums of two squares:</strong> \\(r_2(n) = \\int_0^1 \\left(\\sum_{m \\le \\sqrt{n}} e(\\alpha m^2)\\right)^2 e(-n\\alpha)\\, d\\alpha\\), recovering Fermat's theorem via Gauss sum evaluation on major arcs.</li>
    <li><strong>Partition function:</strong> Hardy and Ramanujan's asymptotic \\(p(n) \\sim \\frac{1}{4\\sqrt{3}n} e^{\\pi\\sqrt{2n/3}}\\) came from applying the circle method to \\(\\prod_{n \\ge 1}(1-q^n)^{-1}\\).</li>
</ul>

<div class="env-block remark">
    <div class="env-title">Looking Forward</div>
    <div class="env-body">
        <p>The circle method and exponential sums remain the most versatile tools in analytic number theory. Current research extends them to: (1) exponential sums in short intervals (Huxley's method), (2) sums twisted by automorphic forms (trace formulas), and (3) multilinear analogues using decoupling inequalities (Bourgain-Demeter-Guth). Each advance unlocks new counting problems that were previously inaccessible.</p>
    </div>
</div>
`,
            visualizations: [],
            exercises: [
                {
                    question: 'Write out the circle method integral for \\(r_3(n) = \\#\\{a^2 + b^2 + c^2 = n\\}\\). Identify the generating function \\(f(\\alpha)\\), the major arcs, and explain (without computing) why the minor arc contribution is negligible.',
                    hint: 'Use \\(f(\\alpha) = \\sum_{m=0}^{\\sqrt{n}} e(\\alpha m^2)\\) and \\(r_3(n) = \\int_0^1 f(\\alpha)^3 e(-n\\alpha)\\, d\\alpha\\).',
                    solution: 'Set \\(f(\\alpha) = \\sum_{0 \\le m \\le \\sqrt{n}} e(m^2 \\alpha)\\). Then \\(r_3(n) = \\int_0^1 f(\\alpha)^3 e(-n\\alpha)\\, d\\alpha\\). Major arcs: \\(\\mathfrak{M}(q,a) = \\{|\\alpha - a/q| \\le n^{-1/2}\\}\\) for \\(q \\le Q = n^{1/4}\\), \\(\\gcd(a,q)=1\\). On each major arc, \\(f(\\alpha) \\approx \\frac{1}{\\sqrt{q}} G(a,q) \\cdot \\int_0^{n^{1/2}} e(\\beta t^2)\\, dt\\) (Gauss sum times a Fresnel-type integral). The minor arcs are \\([0,1] \\setminus \\bigcup \\mathfrak{M}(q,a)\\). On minor arcs, for \\(q > Q\\) we have \\(|f(\\alpha)| \\ll n^{1/4+\\varepsilon}\\) by Weyl\'s inequality (\\(k=2\\)), so \\(\\int_{\\mathfrak{m}} |f|^3 \\le n^{1/4+\\varepsilon} \\int_0^1 |f|^2 \\, d\\alpha = n^{1/4+\\varepsilon} \\cdot r_2(\\cdot)\\) average \\(\\ll n^{3/4+\\varepsilon}\\) — negligible vs. the main term \\(\\sim \\pi \\cdot n\\).'
                },
                {
                    question: 'The singular series for Waring\'s problem with \\(k=2\\), \\(s=4\\) (sums of four squares) is \\(\\mathfrak{S}(n) = \\sum_{q=1}^\\infty A(q,n)\\). Explain why \\(\\mathfrak{S}(n) > 0\\) for all \\(n \\ge 1\\) is plausible, and relate \\(A(q,n)\\) to local densities of solutions to \\(x_1^2 + x_2^2 + x_3^2 + x_4^2 \\equiv n \\pmod{q^m}\\) as \\(m \\to \\infty\\).',
                    hint: "By Hensel's lemma and the Chinese Remainder Theorem, the \\(q\\)-adic local density factors over primes.",
                    solution: "Each term \\(A(q,n) = q^{-4}\\sum_{a=1}^{q}{}' \\left(\\sum_{m=1}^{q} e(am^2/q)\\right)^4 e(-an/q)\\) measures the density of solutions mod \\(q\\). By CRT, \\(\\mathfrak{S}(n) = \\prod_p (1 + A(p,n) + A(p^2,n) + \\cdots) = \\prod_p \\mu_p(n)^{-1}\\) where \\(\\mu_p(n)\\) is the \\(p\\)-adic density. Lagrange's four-square theorem (every positive integer is a sum of four squares) tells us \\(r_4(n) > 0\\) directly, so \\(\\mathfrak{S}(n) > 0\\) is consistent. More precisely, Jacobi's four-square theorem gives \\(r_4(n) = 8\\sum_{4 \\nmid d, d|n} d\\), which is always positive, confirming \\(\\mathfrak{S}(n) \\cdot \\mathfrak{I}(n) > 0\\)."
                }
            ]
        }

    ] // end sections
}); // end CHAPTERS.push
