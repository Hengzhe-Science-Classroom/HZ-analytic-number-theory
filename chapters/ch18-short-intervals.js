window.CHAPTERS = window.CHAPTERS || [];
window.CHAPTERS.push({
    id: 'ch18',
    number: 18,
    title: 'Primes in Short Intervals',
    subtitle: 'How short can an interval be while still containing a prime?',
    sections: [
        // ================================================================
        // SECTION 1: Motivation — The Fundamental Question
        // ================================================================
        {
            id: 'sec-motivation',
            title: 'Motivation',
            content: `
<h2>The Fundamental Question</h2>

<div class="env-block intuition">
    <div class="env-title">A Simple Question with Deep Consequences</div>
    <div class="env-body">
        <p>The Prime Number Theorem tells us that near a large number \\(x\\), primes have "average density" about \\(1/\\log x\\). In an interval \\([x, x+y]\\) of length \\(y\\), we thus expect roughly \\(y/\\log x\\) primes. But how small can \\(y\\) be before this estimate breaks down? Can we guarantee primes in intervals that are tiny compared to \\(x\\) itself?</p>
    </div>
</div>

<p>Let \\(\\pi(x)\\) denote the prime-counting function. The Prime Number Theorem (Chapter 7) gives</p>
\\[
\\pi(x) \\sim \\frac{x}{\\log x}.
\\]

<p>A natural next question is: for which functions \\(y = y(x)\\) does the asymptotic</p>
\\[
\\pi(x + y) - \\pi(x) \\sim \\frac{y}{\\log x}
\\]
<p>hold as \\(x \\to \\infty\\)? Equivalently, how short can the interval \\((x, x+y]\\) be while still "behaving like" a random sample of density \\(1/\\log x\\)?</p>

<h3>Trivial and Nontrivial Ranges</h3>

<p>When \\(y = x\\), we recover the PNT itself. When \\(y = x^{1-\\varepsilon}\\) for any \\(\\varepsilon > 0\\), the PNT with error term (Chapter 8) already gives</p>
\\[
\\pi(x + y) - \\pi(x) \\sim \\frac{y}{\\log x}.
\\]

<p>The real challenge is to push \\(y\\) below \\(x^{1-\\varepsilon}\\), ultimately toward \\(y = x^{\\theta}\\) for \\(\\theta < 1\\). We seek the smallest exponent \\(\\theta\\) such that</p>
\\[
\\pi(x + x^\\theta) - \\pi(x) \\sim \\frac{x^\\theta}{\\log x}
\\]
<p>holds. This exponent encodes how much we know about the distribution of zeros of the Riemann zeta function.</p>

<h3>The Zero-Density Connection</h3>

<p>Why does this problem connect to zeros of \\(\\zeta(s)\\)? The explicit formula (Chapter 8) expresses \\(\\psi(x) = \\sum_{n \\leq x} \\Lambda(n)\\) in terms of the zeros \\(\\rho = \\beta + i\\gamma\\) of \\(\\zeta(s)\\):</p>
\\[
\\psi(x) = x - \\sum_{\\rho} \\frac{x^\\rho}{\\rho} + O(\\log^2 x).
\\]
<p>For a short interval \\((x, x+y]\\), we need the sum over zeros to be \\(o(y)\\). Each zero \\(\\rho\\) contributes roughly \\(x^{\\beta}/|\\rho|\\), so zeros with \\(\\beta\\) close to 1 are the main obstacle. The further we push the zero-free region, or the fewer zeros we have near \\(\\beta = 1\\), the shorter we can make the interval.</p>

<div class="env-block definition">
    <div class="env-title">Definition (Short Interval Prime Count)</div>
    <div class="env-body">
        <p>Define</p>
        \\[\\Delta(x, y) = \\psi(x + y) - \\psi(x) - y\\]
        <p>as the error in the prime count (weighted by the von Mangoldt function) in \\((x, x+y]\\). The short-interval problem asks: for which \\(y = y(x) \\to \\infty\\) is \\(\\Delta(x, y) = o(y)\\)?</p>
    </div>
</div>

<div class="env-block remark">
    <div class="env-title">Historical Context</div>
    <div class="env-body">
        <p>Bertrand's postulate (proved by Chebyshev in 1852) guarantees a prime in \\((x, 2x)\\) for all \\(x \\geq 1\\), corresponding to \\(\\theta = 1\\). The quest to reduce \\(\\theta\\) below 1 began with Hoheisel in 1930 and continues to the present day, each improvement reflecting deeper understanding of \\(\\zeta(s)\\).</p>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-short-interval"></div>
`,
            visualizations: [
                {
                    id: 'viz-short-interval',
                    title: 'Primes in Short Intervals',
                    description: 'Adjust \\(\\theta\\) to control the interval length \\(y = x^\\theta\\). The visualization highlights primes in \\((x, x + x^\\theta]\\) and compares the actual count with the PNT prediction \\(x^\\theta / \\log x\\).',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 400,
                            originX: 0, originY: 0, scale: 1
                        });

                        var theta = 0.6;
                        var xCenter = 10000;
                        var primes = VizEngine.sievePrimes(200000);
                        var primeSet = new Set(primes);

                        VizEngine.createSlider(controls, '\u03B8', 0.5, 1.0, theta, 0.01, function(v) {
                            theta = v;
                            draw();
                        });

                        VizEngine.createSlider(controls, 'x', 1000, 100000, xCenter, 1000, function(v) {
                            xCenter = Math.round(v);
                            draw();
                        });

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            var y = Math.round(Math.pow(xCenter, theta));
                            var lo = xCenter;
                            var hi = Math.min(xCenter + y, 200000);

                            // Find primes in interval
                            var intervalPrimes = [];
                            for (var i = 0; i < primes.length; i++) {
                                if (primes[i] > lo && primes[i] <= hi) intervalPrimes.push(primes[i]);
                                if (primes[i] > hi) break;
                            }

                            var expected = y / Math.log(xCenter);

                            // Title
                            viz.screenText('Primes in (x, x + x\u03B8]', viz.width / 2, 20, viz.colors.white, 16);
                            viz.screenText('x = ' + xCenter.toLocaleString() + ',  \u03B8 = ' + theta.toFixed(2) + ',  y = x\u03B8 = ' + y.toLocaleString(), viz.width / 2, 42, viz.colors.text, 12);

                            // Number line representation
                            var lineY = 120;
                            var lineLeft = 40;
                            var lineRight = viz.width - 40;
                            var lineW = lineRight - lineLeft;

                            // Draw the interval
                            ctx.fillStyle = viz.colors.blue + '22';
                            ctx.fillRect(lineLeft, lineY - 30, lineW, 60);
                            ctx.strokeStyle = viz.colors.blue;
                            ctx.lineWidth = 2;
                            ctx.strokeRect(lineLeft, lineY - 30, lineW, 60);

                            // Mark primes on the number line
                            if (y > 0) {
                                for (var j = 0; j < intervalPrimes.length; j++) {
                                    var px = lineLeft + ((intervalPrimes[j] - lo) / y) * lineW;
                                    ctx.fillStyle = viz.colors.teal;
                                    ctx.beginPath();
                                    ctx.arc(px, lineY, Math.max(2, Math.min(4, 200 / intervalPrimes.length)), 0, Math.PI * 2);
                                    ctx.fill();
                                }
                            }

                            // Labels
                            viz.screenText('x', lineLeft, lineY + 50, viz.colors.text, 11);
                            viz.screenText('x + x\u03B8', lineRight, lineY + 50, viz.colors.text, 11);

                            // Stats panel
                            var statsY = 200;
                            viz.screenText('Actual primes found: ' + intervalPrimes.length, viz.width / 2, statsY, viz.colors.teal, 14);
                            viz.screenText('PNT prediction (y / log x): ' + expected.toFixed(1), viz.width / 2, statsY + 25, viz.colors.orange, 14);

                            var ratio = expected > 0.01 ? (intervalPrimes.length / expected) : 0;
                            var ratioColor = Math.abs(ratio - 1) < 0.2 ? viz.colors.green : viz.colors.red;
                            viz.screenText('Ratio (actual / predicted): ' + ratio.toFixed(3), viz.width / 2, statsY + 50, ratioColor, 14);

                            // Bar comparison
                            var barY = statsY + 90;
                            var barMaxW = 200;
                            var maxVal = Math.max(intervalPrimes.length, expected, 1);
                            var barH = 20;

                            ctx.fillStyle = viz.colors.teal;
                            ctx.fillRect(viz.width / 2 - barMaxW / 2, barY, barMaxW * (intervalPrimes.length / maxVal), barH);
                            viz.screenText('Actual', viz.width / 2 - barMaxW / 2 - 40, barY + barH / 2, viz.colors.teal, 11, 'right');

                            ctx.fillStyle = viz.colors.orange;
                            ctx.fillRect(viz.width / 2 - barMaxW / 2, barY + barH + 8, barMaxW * (expected / maxVal), barH);
                            viz.screenText('Predicted', viz.width / 2 - barMaxW / 2 - 40, barY + barH + 8 + barH / 2, viz.colors.orange, 11, 'right');

                            // Message about theta
                            var msgY = barY + 2 * barH + 40;
                            if (theta <= 0.525) {
                                viz.screenText('Best unconditional: Baker-Harman-Pintz (2001), \u03B8 = 0.525', viz.width / 2, msgY, viz.colors.green, 11);
                            } else if (theta <= 0.5 + 0.001) {
                                viz.screenText('Conditional on RH: \u03B8 = 1/2 + \u03B5 suffices', viz.width / 2, msgY, viz.colors.purple, 11);
                            } else if (theta < 1) {
                                viz.screenText('Hoheisel (1930) first proved \u03B8 < 1 is achievable', viz.width / 2, msgY, viz.colors.text, 11);
                            }
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Using the PNT, estimate the number of primes in the interval \\((10^6, 10^6 + 10^3]\\). How does this compare with the actual count (there are 75 primes in this interval)?',
                    hint: 'The PNT predicts approximately \\(y/\\log x\\) primes, where \\(y = 10^3\\) and \\(x = 10^6\\).',
                    solution: 'The PNT prediction is \\(10^3 / \\log(10^6) = 1000 / (6 \\ln 10) \\approx 1000 / 13.816 \\approx 72.4\\). The actual count of 75 primes is very close to this prediction, confirming that the PNT asymptotic works well even at moderate scales.'
                },
                {
                    question: 'If \\(\\theta = 0.9\\), how long is the interval \\((x, x + x^{0.9}]\\) when \\(x = 10^{10}\\)? Express both the interval length and the number of expected primes.',
                    hint: 'Compute \\(x^{0.9} = (10^{10})^{0.9} = 10^9\\), then apply the PNT density.',
                    solution: 'The interval length is \\(x^{0.9} = 10^9\\), which is one-tenth of \\(x\\). The expected number of primes is \\(10^9 / \\log(10^{10}) = 10^9 / (10 \\ln 10) \\approx 10^9 / 23.03 \\approx 4.34 \\times 10^7\\), about 43 million primes.'
                }
            ]
        },

        // ================================================================
        // SECTION 2: Hoheisel's Theorem
        // ================================================================
        {
            id: 'sec-hoheisel',
            title: "Hoheisel's Theorem",
            content: `
<h2>Hoheisel's Theorem: Breaking the Barrier</h2>

<div class="env-block intuition">
    <div class="env-title">The First Breakthrough</div>
    <div class="env-body">
        <p>Before 1930, the best anyone could say was essentially Bertrand's postulate: there is always a prime between \\(x\\) and \\(2x\\). Hoheisel's theorem was revolutionary because it showed for the first time that the interval can be taken as \\(x^\\theta\\) with \\(\\theta < 1\\). The key insight: connect the problem to zero-density estimates for \\(\\zeta(s)\\).</p>
    </div>
</div>

<div class="env-block theorem">
    <div class="env-title">Theorem 18.1 (Hoheisel, 1930)</div>
    <div class="env-body">
        <p>There exists a constant \\(\\theta < 1\\) such that</p>
        \\[\\pi(x + x^\\theta) - \\pi(x) \\sim \\frac{x^\\theta}{\\log x}\\]
        <p>for all sufficiently large \\(x\\). Hoheisel's original value was \\(\\theta = 1 - 1/33000\\).</p>
    </div>
</div>

<h3>The Method: Zero-Density Estimates</h3>

<p>Hoheisel's proof introduced a paradigm that remains central: instead of proving a zero-free region, use <em>zero-density estimates</em> that bound how many zeros of \\(\\zeta(s)\\) can have real part \\(\\beta \\geq \\sigma\\).</p>

<div class="env-block definition">
    <div class="env-title">Definition (Zero-Density Function)</div>
    <div class="env-body">
        <p>For \\(\\sigma \\in (1/2, 1)\\) and \\(T > 0\\), define</p>
        \\[N(\\sigma, T) = \\#\\{\\rho = \\beta + i\\gamma : \\zeta(\\rho) = 0, \\; \\beta \\geq \\sigma, \\; |\\gamma| \\leq T\\}.\\]
        <p>A <strong>zero-density estimate</strong> is a bound of the form \\(N(\\sigma, T) \\ll T^{A(1-\\sigma)} \\log^B T\\).</p>
    </div>
</div>

<p>The connection between zero-density and short intervals runs as follows. The explicit formula gives</p>
\\[
\\psi(x+y) - \\psi(x) = y - \\sum_{|\\gamma| \\leq T} \\frac{(x+y)^\\rho - x^\\rho}{\\rho} + O\\left(\\frac{x \\log^2 x}{T}\\right).
\\]

<p>Each term in the sum is bounded by \\(|x^\\rho| \\cdot y \\cdot x^{-1} \\cdot |\\rho|^{-1} \\cdot x^{\\beta - 1}\\) (roughly). By partial summation and the zero-density estimate, the sum over zeros can be controlled if \\(y\\) is not too small relative to the density bound.</p>

<div class="env-block theorem">
    <div class="env-title">Theorem 18.2 (Ingham's Density Estimate, 1940)</div>
    <div class="env-body">
        <p>For \\(1/2 \\leq \\sigma \\leq 1\\) and \\(T \\geq 2\\),</p>
        \\[N(\\sigma, T) \\ll T^{3(1-\\sigma)/(2-\\sigma)} \\log^5 T.\\]
        <p>This bound (improving on Hoheisel's weaker estimate) implies that one can take \\(\\theta = 5/8 = 0.625\\) in the short interval theorem.</p>
    </div>
</div>

<h3>Subsequent Improvements</h3>

<p>After Hoheisel, the value of \\(\\theta\\) was reduced in stages, each step requiring either better zero-density estimates or new ideas about the distribution of zeros:</p>

<ul>
    <li>Hoheisel (1930): \\(\\theta = 1 - 1/33000 \\approx 0.99997\\)</li>
    <li>Ingham (1937): \\(\\theta = 5/8 = 0.625\\)</li>
    <li>Huxley (1972): \\(\\theta = 7/12 \\approx 0.583\\)</li>
    <li>Heath-Brown (1988): \\(\\theta = 7/12 - \\varepsilon\\) (breaking the 7/12 barrier)</li>
    <li>Baker-Harman-Pintz (2001): \\(\\theta = 0.525\\) (current record)</li>
</ul>

<div class="env-block remark">
    <div class="env-title">The Pattern of Progress</div>
    <div class="env-body">
        <p>Each improvement corresponds to a deeper understanding of the zeta function. Ingham used his own density theorem. Huxley combined density estimates with exponential sum techniques (Chapter 14). Baker-Harman-Pintz used a sophisticated sieve-theoretic decomposition together with multiple zero-density regions.</p>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-theta-timeline"></div>
`,
            visualizations: [
                {
                    id: 'viz-theta-timeline',
                    title: 'Timeline of \\(\\theta\\) Improvements',
                    description: 'The history of reducing the exponent \\(\\theta\\) in the short interval problem. Each point represents a proved result. The dashed line at \\(\\theta = 1/2\\) is the conjectural limit under RH.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 380,
                            originX: 0, originY: 0, scale: 1
                        });

                        var results = [
                            { year: 1852, theta: 1.0, author: 'Chebyshev (Bertrand)' },
                            { year: 1930, theta: 0.99997, author: 'Hoheisel' },
                            { year: 1937, theta: 0.625, author: 'Ingham' },
                            { year: 1972, theta: 0.5833, author: 'Huxley' },
                            { year: 1988, theta: 0.5833, author: 'Heath-Brown (7/12-)' },
                            { year: 2001, theta: 0.525, author: 'Baker-Harman-Pintz' }
                        ];

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            viz.screenText('Progress on the Short Interval Exponent \u03B8', viz.width / 2, 20, viz.colors.white, 15);

                            var margin = { left: 80, right: 40, top: 55, bottom: 50 };
                            var plotW = viz.width - margin.left - margin.right;
                            var plotH = viz.height - margin.top - margin.bottom;

                            // Axes
                            ctx.strokeStyle = viz.colors.axis;
                            ctx.lineWidth = 1.5;
                            ctx.beginPath();
                            ctx.moveTo(margin.left, margin.top);
                            ctx.lineTo(margin.left, margin.top + plotH);
                            ctx.lineTo(margin.left + plotW, margin.top + plotH);
                            ctx.stroke();

                            // Y-axis: theta from 0.4 to 1.05
                            var yMin = 0.4, yMax = 1.05;
                            function toY(t) { return margin.top + plotH * (1 - (t - yMin) / (yMax - yMin)); }
                            function toX(yr) { return margin.left + plotW * (yr - 1840) / (2020 - 1840); }

                            // Y gridlines and labels
                            ctx.font = '10px -apple-system,sans-serif';
                            ctx.textAlign = 'right';
                            ctx.textBaseline = 'middle';
                            for (var t = 0.5; t <= 1.0; t += 0.1) {
                                var yy = toY(t);
                                ctx.fillStyle = viz.colors.text;
                                ctx.fillText(t.toFixed(1), margin.left - 8, yy);
                                ctx.strokeStyle = viz.colors.grid;
                                ctx.lineWidth = 0.5;
                                ctx.beginPath();
                                ctx.moveTo(margin.left, yy);
                                ctx.lineTo(margin.left + plotW, yy);
                                ctx.stroke();
                            }
                            viz.screenText('\u03B8', margin.left - 30, margin.top + plotH / 2, viz.colors.text, 13);

                            // X labels
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'top';
                            for (var yr = 1860; yr <= 2020; yr += 20) {
                                var xx = toX(yr);
                                ctx.fillStyle = viz.colors.text;
                                ctx.fillText(yr.toString(), xx, margin.top + plotH + 6);
                            }

                            // RH line at theta = 0.5
                            ctx.strokeStyle = viz.colors.purple;
                            ctx.lineWidth = 1;
                            ctx.setLineDash([6, 4]);
                            ctx.beginPath();
                            ctx.moveTo(margin.left, toY(0.5));
                            ctx.lineTo(margin.left + plotW, toY(0.5));
                            ctx.stroke();
                            ctx.setLineDash([]);
                            viz.screenText('RH: \u03B8 = 1/2', margin.left + plotW - 50, toY(0.5) - 12, viz.colors.purple, 10);

                            // Step function connecting results
                            ctx.strokeStyle = viz.colors.blue + '88';
                            ctx.lineWidth = 2;
                            ctx.beginPath();
                            for (var i = 0; i < results.length; i++) {
                                var r = results[i];
                                var px = toX(r.year);
                                var py = toY(r.theta);
                                if (i === 0) {
                                    ctx.moveTo(px, py);
                                } else {
                                    ctx.lineTo(px, py);
                                }
                                if (i < results.length - 1) {
                                    ctx.lineTo(toX(results[i + 1].year), py);
                                } else {
                                    ctx.lineTo(margin.left + plotW, py);
                                }
                            }
                            ctx.stroke();

                            // Data points and labels
                            for (var j = 0; j < results.length; j++) {
                                var rr = results[j];
                                var ppx = toX(rr.year);
                                var ppy = toY(rr.theta);

                                ctx.fillStyle = viz.colors.teal;
                                ctx.beginPath();
                                ctx.arc(ppx, ppy, 5, 0, Math.PI * 2);
                                ctx.fill();

                                ctx.fillStyle = viz.colors.white;
                                ctx.font = '9px -apple-system,sans-serif';
                                ctx.textAlign = 'left';
                                ctx.textBaseline = 'bottom';
                                var labelOffset = (j % 2 === 0) ? -10 : 14;
                                ctx.fillText(rr.author, ppx + 6, ppy + labelOffset);
                                ctx.fillStyle = viz.colors.teal;
                                ctx.fillText(rr.theta < 0.9999 ? rr.theta.toFixed(3) : '1.000', ppx + 6, ppy + labelOffset + 11);
                            }
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: "State the zero-density estimate \\(N(\\sigma, T) \\ll T^{A(1-\\sigma)} \\log^B T\\) and explain why a smaller exponent \\(A\\) leads to a smaller admissible \\(\\theta\\) in the short interval problem.",
                    hint: 'Think about the explicit formula: zeros with \\(\\beta\\) close to 1 contribute the most. If there are fewer such zeros (smaller \\(A\\)), the error term is smaller, so shorter intervals suffice.',
                    solution: 'The zero-density estimate bounds the number of zeros with \\(\\beta \\geq \\sigma\\). In the explicit formula, the error from zeros is roughly \\(\\sum_{\\rho} x^{\\beta - 1} y\\). If \\(N(\\sigma, T)\\) is small (small \\(A\\)), fewer zeros have \\(\\beta\\) near 1, so the error is smaller. This means \\(y = x^\\theta\\) with smaller \\(\\theta\\) still dominates the error, giving a PNT-type asymptotic in shorter intervals.'
                }
            ]
        },

        // ================================================================
        // SECTION 3: Baker-Harman-Pintz — The Current Record
        // ================================================================
        {
            id: 'sec-bhp',
            title: 'Baker-Harman-Pintz',
            content: `
<h2>Baker-Harman-Pintz: \\(\\theta = 0.525\\)</h2>

<div class="env-block intuition">
    <div class="env-title">The State of the Art</div>
    <div class="env-body">
        <p>The best unconditional result, proved in 2001 by Baker, Harman, and Pintz, asserts that the interval \\((x, x + x^{0.525}]\\) always contains primes for large \\(x\\). The proof combines three powerful techniques: sieve methods (Part E), exponential sum estimates (Chapter 14), and zero-density estimates.</p>
    </div>
</div>

<div class="env-block theorem">
    <div name="env-title">Theorem 18.3 (Baker-Harman-Pintz, 2001)</div>
    <div class="env-body">
        <p>For all sufficiently large \\(x\\),</p>
        \\[\\pi(x + x^{0.525}) - \\pi(x) \\gg \\frac{x^{0.525}}{\\log x}.\\]
    </div>
</div>

<h3>The Three Ingredients</h3>

<p>The proof of BHP uses a decomposition into three types of sums, each handled by different tools:</p>

<h4>1. Type I Sums (Convolution Structure)</h4>

<p>These arise from representing primes via sieve identities (Vaughan's identity, Chapter 12):</p>
\\[
\\sum_{\\substack{mn \\in (x, x+y] \\\\ m \\leq M}} a_m = \\sum_{m \\leq M} a_m \\left(\\left\\lfloor \\frac{x+y}{m} \\right\\rfloor - \\left\\lfloor \\frac{x}{m} \\right\\rfloor\\right).
\\]
<p>Type I sums are handled by standard techniques when \\(M \\leq y^{1-\\varepsilon}\\), but extending the range of \\(M\\) is crucial for smaller \\(\\theta\\).</p>

<h4>2. Type II Sums (Bilinear Sums)</h4>

<p>These are bilinear expressions of the form</p>
\\[
\\sum_{\\substack{mn \\in (x, x+y] \\\\ M < m \\leq 2M}} a_m b_n.
\\]
<p>Handled by Cauchy-Schwarz and mean-value theorems for Dirichlet polynomials. The strength of available mean-value theorems directly impacts the admissible range.</p>

<h4>3. Type III Sums (Trilinear and Beyond)</h4>

<p>These require exponential sum techniques, particularly bounds for sums like</p>
\\[
\\sum_{h \\leq H} \\left|\\sum_{n \\sim N} e(hf(n))\\right|
\\]
<p>where \\(f\\) involves fractional parts. The estimates of Huxley and Watt on exponential sums are essential here.</p>

<h3>Why 0.525?</h3>

<p>The exponent \\(\\theta = 0.525\\) arises from a delicate balancing act. The three types of sums each impose constraints on how small \\(y\\) can be. Schematically:</p>

<ul>
    <li>Type I requires \\(y \\geq x^{1/2+\\varepsilon}\\) (essentially the Riemann Hypothesis barrier)</li>
    <li>Type II is manageable for \\(y \\geq x^{0.525}\\) with current mean-value theorems</li>
    <li>Type III requires exponential sum estimates that currently limit us to \\(y \\geq x^{0.525}\\)</li>
</ul>

<p>Improving \\(\\theta\\) below 0.525 would require breakthroughs in at least one of these areas.</p>

<div class="env-block remark">
    <div class="env-title">How Far From Optimal?</div>
    <div class="env-body">
        <p>The Riemann Hypothesis implies \\(\\theta = 1/2 + \\varepsilon\\) works. Cramer's conjecture (Section 5) suggests even \\(y \\sim (\\log x)^2\\) should suffice, which corresponds to \\(\\theta \\to 0\\). The gap between the unconditional \\(\\theta = 0.525\\) and the conjectural \\(\\theta \\to 0\\) is enormous, reflecting the depth of our ignorance about the finer structure of zeta zeros.</p>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-interval-density"></div>
`,
            visualizations: [
                {
                    id: 'viz-interval-density',
                    title: 'Prime Density in Short Intervals',
                    description: 'For various values of \\(x\\), this visualization shows how the ratio \\(\\pi(x + x^\\theta) - \\pi(x)\\) vs. \\(x^\\theta / \\log x\\) behaves as \\(x\\) grows. Convergence to 1 confirms the PNT in short intervals.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 380,
                            originX: 0, originY: 0, scale: 1
                        });

                        var theta = 0.6;
                        var primes = VizEngine.sievePrimes(200000);

                        VizEngine.createSlider(controls, '\u03B8', 0.5, 0.9, theta, 0.01, function(v) {
                            theta = v;
                            draw();
                        });

                        function countPrimesInInterval(lo, hi) {
                            var count = 0;
                            for (var i = 0; i < primes.length; i++) {
                                if (primes[i] > hi) break;
                                if (primes[i] > lo) count++;
                            }
                            return count;
                        }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            viz.screenText('Ratio: actual / predicted prime count in (x, x + x\u03B8]', viz.width / 2, 20, viz.colors.white, 13);

                            var margin = { left: 70, right: 30, top: 50, bottom: 50 };
                            var plotW = viz.width - margin.left - margin.right;
                            var plotH = viz.height - margin.top - margin.bottom;

                            // Sample x values
                            var xValues = [];
                            for (var x = 500; x <= 150000; x += 500) {
                                var y = Math.pow(x, theta);
                                if (x + y > 200000) break;
                                var actual = countPrimesInInterval(x, x + y);
                                var predicted = y / Math.log(x);
                                if (predicted > 0.5) {
                                    xValues.push({ x: x, ratio: actual / predicted });
                                }
                            }

                            if (xValues.length === 0) {
                                viz.screenText('Interval too large for sieve range', viz.width / 2, viz.height / 2, viz.colors.red, 14);
                                return;
                            }

                            // Axes
                            ctx.strokeStyle = viz.colors.axis;
                            ctx.lineWidth = 1.5;
                            ctx.beginPath();
                            ctx.moveTo(margin.left, margin.top);
                            ctx.lineTo(margin.left, margin.top + plotH);
                            ctx.lineTo(margin.left + plotW, margin.top + plotH);
                            ctx.stroke();

                            var xMin = xValues[0].x, xMax = xValues[xValues.length - 1].x;
                            var rMin = 0, rMax = 2.5;

                            function toScreenX(v) { return margin.left + plotW * (v - xMin) / (xMax - xMin); }
                            function toScreenY(v) { return margin.top + plotH * (1 - (v - rMin) / (rMax - rMin)); }

                            // Y gridlines
                            ctx.font = '10px -apple-system,sans-serif';
                            ctx.textAlign = 'right';
                            ctx.textBaseline = 'middle';
                            for (var r = 0; r <= 2.5; r += 0.5) {
                                var sy = toScreenY(r);
                                ctx.fillStyle = viz.colors.text;
                                ctx.fillText(r.toFixed(1), margin.left - 6, sy);
                                ctx.strokeStyle = viz.colors.grid;
                                ctx.lineWidth = 0.5;
                                ctx.beginPath();
                                ctx.moveTo(margin.left, sy);
                                ctx.lineTo(margin.left + plotW, sy);
                                ctx.stroke();
                            }

                            // Ratio = 1 line
                            ctx.strokeStyle = viz.colors.green;
                            ctx.lineWidth = 1.5;
                            ctx.setLineDash([4, 3]);
                            ctx.beginPath();
                            ctx.moveTo(margin.left, toScreenY(1));
                            ctx.lineTo(margin.left + plotW, toScreenY(1));
                            ctx.stroke();
                            ctx.setLineDash([]);

                            // X labels
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'top';
                            var xStep = Math.max(10000, Math.round((xMax - xMin) / 5 / 10000) * 10000);
                            for (var xv = Math.ceil(xMin / xStep) * xStep; xv <= xMax; xv += xStep) {
                                ctx.fillStyle = viz.colors.text;
                                ctx.fillText((xv / 1000).toFixed(0) + 'k', toScreenX(xv), margin.top + plotH + 6);
                            }
                            viz.screenText('x', margin.left + plotW / 2, margin.top + plotH + 35, viz.colors.text, 12);
                            viz.screenText('ratio', margin.left - 40, margin.top + plotH / 2, viz.colors.text, 12);

                            // Plot points
                            for (var k = 0; k < xValues.length; k++) {
                                var pt = xValues[k];
                                var px = toScreenX(pt.x);
                                var py = toScreenY(Math.min(pt.ratio, rMax));
                                ctx.fillStyle = viz.colors.blue + '88';
                                ctx.beginPath();
                                ctx.arc(px, py, 2, 0, Math.PI * 2);
                                ctx.fill();
                            }

                            // Moving average
                            var windowSize = Math.max(5, Math.floor(xValues.length / 20));
                            ctx.strokeStyle = viz.colors.teal;
                            ctx.lineWidth = 2;
                            ctx.beginPath();
                            var started = false;
                            for (var m = windowSize; m < xValues.length; m++) {
                                var avg = 0;
                                for (var w = m - windowSize; w < m; w++) avg += xValues[w].ratio;
                                avg /= windowSize;
                                var mx = toScreenX(xValues[m].x);
                                var my = toScreenY(Math.min(avg, rMax));
                                if (!started) { ctx.moveTo(mx, my); started = true; }
                                else ctx.lineTo(mx, my);
                            }
                            ctx.stroke();

                            viz.screenText('\u03B8 = ' + theta.toFixed(2), viz.width - 80, margin.top + 15, viz.colors.white, 12);
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Explain why Type I sums are easier to handle than Type II sums in the short interval problem, and why the critical range is \\(M \\approx y\\).',
                    hint: 'Type I sums reduce to counting lattice points in short intervals, which involves the fractional part of \\(x/m\\). When \\(m\\) is small relative to \\(y\\), the interval \\((x/m, (x+y)/m]\\) is long and contains many integers.',
                    solution: 'For Type I sums with \\(m \\leq M\\), each inner sum counts integers in an interval of length \\(\\approx y/m\\). When \\(m \\ll y\\), this interval is long and the count is approximately \\(y/m\\) with small relative error. The difficulty arises when \\(m \\approx y\\), where the interval has length \\(\\approx 1\\) and the count is either 0 or 1, making the sum highly sensitive to arithmetic structure. Type II sums are harder because both variables range over a "critical" region where neither factor alone determines the counting.'
                },
                {
                    question: 'If future improvements to exponential sum estimates reduced the Type III constraint to \\(y \\geq x^{0.51}\\), would this immediately give \\(\\theta = 0.51\\)?',
                    hint: 'Consider whether the Type I and Type II constraints might still be binding.',
                    solution: 'Not necessarily. The final \\(\\theta\\) is determined by the most restrictive of the three constraints. Even if Type III allows \\(\\theta = 0.51\\), the Type I and Type II constraints might require \\(\\theta > 0.51\\). In practice, the Type I barrier at \\(\\theta = 1/2\\) (related to RH) and Type II limitations could prevent reaching \\(\\theta = 0.51\\). All three types must simultaneously allow the same \\(\\theta\\).'
                }
            ]
        },

        // ================================================================
        // SECTION 4: Conditional Results Under RH
        // ================================================================
        {
            id: 'sec-conditional',
            title: 'Conditional Results (RH)',
            content: `
<h2>What the Riemann Hypothesis Implies</h2>

<div class="env-block intuition">
    <div class="env-title">The Power of RH for Short Intervals</div>
    <div class="env-body">
        <p>The Riemann Hypothesis (all nontrivial zeros have \\(\\beta = 1/2\\)) immediately implies that the error term \\(\\psi(x) - x\\) is \\(O(x^{1/2} \\log^2 x)\\). This has dramatic consequences for primes in short intervals: the PNT holds in intervals of length barely larger than \\(\\sqrt{x}\\).</p>
    </div>
</div>

<div class="env-block theorem">
    <div class="env-title">Theorem 18.4 (Von Koch, 1901; conditional on RH)</div>
    <div class="env-body">
        <p>Assume the Riemann Hypothesis. Then for any \\(\\varepsilon > 0\\),</p>
        \\[\\psi(x+y) - \\psi(x) = y + O(x^{1/2} \\log^2 x)\\]
        <p>uniformly. In particular, if \\(y \\geq x^{1/2+\\varepsilon}\\), then</p>
        \\[\\pi(x+y) - \\pi(x) \\sim \\frac{y}{\\log x}.\\]
    </div>
</div>

<p>The proof is direct from the explicit formula. Under RH, every zero \\(\\rho = 1/2 + i\\gamma\\) satisfies \\(|x^\\rho| = x^{1/2}\\), so the sum over zeros is</p>
\\[
\\left|\\sum_{\\rho} \\frac{(x+y)^\\rho - x^\\rho}{\\rho}\\right| \\leq \\sum_{\\rho} \\frac{|y| \\cdot x^{-1/2}}{|\\rho|} \\ll x^{1/2} \\log^2 x.
\\]

<h3>Can We Do Better Than \\(x^{1/2+\\varepsilon}\\)?</h3>

<p>Under RH, can we push below \\(\\sqrt{x}\\)? Not by this method alone, since \\(x^{1/2}\\) is the natural scale of the error under RH. However, on average we can go further.</p>

<div class="env-block theorem">
    <div class="env-title">Theorem 18.5 (Selberg, 1943; conditional on RH)</div>
    <div class="env-body">
        <p>Assume RH. For \\(y = x^\\varepsilon\\) (any fixed \\(\\varepsilon > 0\\)),</p>
        \\[\\int_1^X \\left(\\psi(x + y) - \\psi(x) - y\\right)^2 dx = O(X y \\log^2 X).\\]
        <p>This means that \\(\\psi(x+y) - \\psi(x) \\sim y\\) for "almost all" \\(x\\), even with \\(y\\) much smaller than \\(\\sqrt{x}\\).</p>
    </div>
</div>

<h3>Beyond RH: The Density Hypothesis</h3>

<p>An important conjecture intermediate between current knowledge and RH is the <em>Density Hypothesis</em>:</p>

<div class="env-block definition">
    <div class="env-title">Conjecture (Density Hypothesis)</div>
    <div class="env-body">
        <p>For all \\(\\varepsilon > 0\\),</p>
        \\[N(\\sigma, T) \\ll T^{2(1-\\sigma)+\\varepsilon}.\\]
        <p>This is weaker than RH (which gives \\(N(\\sigma, T) = 0\\) for \\(\\sigma > 1/2\\)) but much stronger than what is currently proved. The Density Hypothesis implies \\(\\theta = 1/2 + \\varepsilon\\), matching the consequence of RH for this problem.</p>
    </div>
</div>

<div class="env-block remark">
    <div class="env-title">The Lindelof Hypothesis</div>
    <div class="env-body">
        <p>The Lindelof Hypothesis (\\(\\zeta(1/2 + it) \\ll t^\\varepsilon\\)) also has consequences for short intervals. While it does not directly imply the Density Hypothesis, it does imply strong bounds on mean values of \\(\\zeta\\) that yield \\(\\theta = 1/2 + \\varepsilon\\) via a different route.</p>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-conditional-comparison"></div>
`,
            visualizations: [
                {
                    id: 'viz-conditional-comparison',
                    title: 'Unconditional vs. Conditional Bounds',
                    description: 'Compare the interval lengths required under different assumptions. Each bar shows \\(x^\\theta\\) relative to \\(x\\), illustrating how much stronger conditional results are.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 380,
                            originX: 0, originY: 0, scale: 1
                        });

                        var logx = 20;
                        VizEngine.createSlider(controls, 'log x', 10, 50, logx, 1, function(v) {
                            logx = Math.round(v);
                            draw();
                        });

                        var results = [
                            { label: 'Bertrand (1852)', theta: 1.0, color: null },
                            { label: 'Hoheisel (1930)', theta: 0.99997, color: null },
                            { label: 'Ingham (1937)', theta: 0.625, color: null },
                            { label: 'BHP (2001)', theta: 0.525, color: null },
                            { label: 'RH', theta: 0.501, color: null },
                            { label: 'Cramer conj.', theta: 0, color: null }
                        ];

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var colors = [viz.colors.text, viz.colors.red, viz.colors.orange, viz.colors.teal, viz.colors.purple, viz.colors.green];

                            viz.screenText('Interval Length x\u03B8 for log x = ' + logx, viz.width / 2, 20, viz.colors.white, 15);
                            viz.screenText('(log scale, digits of x\u03B8)', viz.width / 2, 38, viz.colors.text, 11);

                            var margin = { left: 160, right: 40, top: 60, bottom: 30 };
                            var barH = 28;
                            var gap = 12;
                            var plotW = viz.width - margin.left - margin.right;

                            // Compute log10(x^theta) = theta * log10(x) = theta * logx / ln(10)
                            // But logx here is log_e(x), so log10(x^theta) = theta * logx / 2.302585
                            var maxDigits = logx / Math.LN10; // digits of x

                            for (var i = 0; i < results.length; i++) {
                                var r = results[i];
                                var yy = margin.top + i * (barH + gap);
                                var digits;
                                if (r.theta === 0) {
                                    // Cramer: y ~ (log x)^2
                                    digits = Math.log10(logx * logx);
                                } else {
                                    digits = r.theta * logx / Math.LN10;
                                }

                                // Bar
                                var barW = Math.max(3, plotW * digits / maxDigits);
                                ctx.fillStyle = colors[i];
                                ctx.fillRect(margin.left, yy, barW, barH);

                                // Label
                                ctx.fillStyle = colors[i];
                                ctx.font = '11px -apple-system,sans-serif';
                                ctx.textAlign = 'right';
                                ctx.textBaseline = 'middle';
                                ctx.fillText(r.label, margin.left - 8, yy + barH / 2);

                                // Value
                                ctx.fillStyle = viz.colors.white;
                                ctx.font = '10px -apple-system,sans-serif';
                                ctx.textAlign = 'left';
                                ctx.fillText(digits.toFixed(1) + ' digits', margin.left + barW + 6, yy + barH / 2);
                            }

                            // Reference line for x itself
                            var xBarW = plotW;
                            var refY = margin.top + results.length * (barH + gap) + 10;
                            ctx.strokeStyle = viz.colors.axis;
                            ctx.lineWidth = 1;
                            ctx.setLineDash([3, 3]);
                            ctx.beginPath();
                            ctx.moveTo(margin.left + xBarW, margin.top);
                            ctx.lineTo(margin.left + xBarW, refY);
                            ctx.stroke();
                            ctx.setLineDash([]);
                            viz.screenText('x has ' + maxDigits.toFixed(1) + ' digits', margin.left + plotW / 2, refY + 15, viz.colors.text, 11);
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Under RH, show that there exists a prime in the interval \\((x, x + c\\sqrt{x}\\log^2 x]\\) for some constant \\(c > 0\\) and all large \\(x\\).',
                    hint: 'Use the RH error bound \\(\\psi(x) = x + O(\\sqrt{x}\\log^2 x)\\) and apply it to both \\(\\psi(x + y)\\) and \\(\\psi(x)\\).',
                    solution: 'Under RH, \\(\\psi(x) = x + O(\\sqrt{x}\\log^2 x)\\). Thus \\(\\psi(x+y) - \\psi(x) = y + O(\\sqrt{x}\\log^2 x)\\). Taking \\(y = c\\sqrt{x}\\log^2 x\\) with \\(c\\) sufficiently large, the main term \\(y\\) dominates the error, giving \\(\\psi(x+y) - \\psi(x) > 0\\). Since \\(\\psi\\) increases only at prime powers, this interval must contain a prime power, and for large \\(x\\) most prime powers are primes themselves.'
                },
                {
                    question: 'Explain why the Density Hypothesis is strictly weaker than RH but implies the same short-interval result \\(\\theta = 1/2 + \\varepsilon\\).',
                    hint: 'RH says \\(N(\\sigma, T) = 0\\) for \\(\\sigma > 1/2\\). The Density Hypothesis allows zeros with \\(\\beta > 1/2\\) but bounds their count. Why is this sufficient for the short-interval application?',
                    solution: 'RH asserts there are no zeros with \\(\\beta > 1/2\\), while the DH allows such zeros but bounds \\(N(\\sigma, T) \\ll T^{2(1-\\sigma)+\\varepsilon}\\). For short intervals, what matters is the total contribution of zeros to the explicit formula. Even if some zeros have \\(\\beta > 1/2\\), if they are few enough (as guaranteed by DH), their aggregate contribution to \\(\\sum (x+y)^\\rho / \\rho\\) is \\(o(y)\\) when \\(y \\geq x^{1/2+\\varepsilon}\\). DH is weaker because it permits zeros that RH forbids, but the zeros are so sparse that they cannot disrupt the prime count in intervals of length \\(x^{1/2+\\varepsilon}\\).'
                }
            ]
        },

        // ================================================================
        // SECTION 5: Cramer's Model and Probabilistic Heuristics
        // ================================================================
        {
            id: 'sec-cramer',
            title: "Cramer's Model",
            content: `
<h2>Cramer's Model: A Probabilistic Perspective</h2>

<div class="env-block intuition">
    <div class="env-title">Primes as Random Numbers</div>
    <div class="env-body">
        <p>Harald Cramer (1936) proposed a bold heuristic: model each integer \\(n\\) near \\(x\\) as "prime" independently with probability \\(1/\\log x\\). This random model reproduces many known properties of primes and makes striking predictions about prime gaps.</p>
    </div>
</div>

<div class="env-block definition">
    <div class="env-title">Cramer's Random Model</div>
    <div class="env-body">
        <p>Let \\(X_n\\) be independent random variables with \\(\\Pr(X_n = 1) = 1/\\log n\\) for \\(n \\geq 2\\). In this model, the "prime count" in \\((x, x+y]\\) is</p>
        \\[\\Pi(x, y) = \\sum_{x < n \\leq x+y} X_n.\\]
        <p>By linearity of expectation, \\(\\mathbb{E}[\\Pi(x,y)] \\approx y/\\log x\\), matching the PNT.</p>
    </div>
</div>

<h3>Maximal Gaps</h3>

<p>Let \\(p_n\\) denote the \\(n\\)-th prime. The <strong>maximal gap</strong> up to \\(x\\) is</p>
\\[
G(x) = \\max_{p_n \\leq x} (p_{n+1} - p_n).
\\]

<p>Cramer's model predicts:</p>

<div class="env-block theorem">
    <div class="env-title">Conjecture (Cramer, 1936)</div>
    <div class="env-body">
        \\[\\limsup_{x \\to \\infty} \\frac{G(x)}{(\\log x)^2} = 1.\\]
    </div>
</div>

<p>More precisely, in the random model, the largest gap among the first \\(N \\approx x/\\log x\\) "primes" is a maximum of \\(N\\) geometric random variables, which by extreme value theory is approximately \\((\\log N) \\cdot \\log x \\approx (\\log x)^2\\).</p>

<h3>Granville's Refinement</h3>

<p>Granville (1995) observed that Cramer's model ignores the residual structure of primes modulo small primes. After correcting for this (primes cannot be even, divisible by 3, etc.), the prediction becomes</p>
\\[
\\limsup_{x \\to \\infty} \\frac{G(x)}{(\\log x)^2} \\geq 2e^{-\\gamma} \\approx 1.1229
\\]
<p>where \\(\\gamma\\) is the Euler-Mascheroni constant. The correction factor \\(2e^{-\\gamma}\\) arises from Mertens' theorem applied to the sieving effect of small primes.</p>

<h3>What We Actually Know</h3>

<p>Unconditionally, the best upper bound on prime gaps is far from Cramer's conjecture:</p>
\\[
G(x) \\ll x^{0.525}
\\]
<p>(from Baker-Harman-Pintz). Under RH, this improves to \\(G(x) \\ll \\sqrt{x} \\log x\\). Cramer's conjecture asserts \\(G(x) \\ll (\\log x)^2\\), an enormous difference.</p>

<div class="env-block remark">
    <div class="env-title">Lower Bounds on Gaps</div>
    <div class="env-body">
        <p>Westzynthius (1931), Rankin (1938), and others proved that \\(G(x) > c \\log x \\log_2 x \\log_4 x / (\\log_3 x)^2\\) for some \\(c > 0\\) (where \\(\\log_k\\) denotes the \\(k\\)-fold iterated logarithm). Ford, Green, Konyagin, Maynard, and Tao (2018) improved this to \\(G(x) \\gg \\log x \\log_2 x \\log_4 x / \\log_3 x\\). This confirms that gaps can be larger than \\(\\log x\\) by growing factors, consistent with (but far from proving) Cramer's conjecture.</p>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-cramer-model"></div>
<div class="viz-placeholder" data-viz="viz-maximal-gaps"></div>
`,
            visualizations: [
                {
                    id: 'viz-cramer-model',
                    title: "Cramer's Random Model vs. Actual Primes",
                    description: 'Compare the distribution of prime gaps with a random model. Each bar shows the count of consecutive prime gaps of a given size near \\(x\\). The random model (orange) is generated by Bernoulli sampling with probability \\(1/\\log x\\).',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 380,
                            originX: 0, originY: 0, scale: 1
                        });

                        var xCenter = 10000;
                        var windowSize = 5000;
                        var primes = VizEngine.sievePrimes(200000);

                        VizEngine.createSlider(controls, 'x', 2000, 100000, xCenter, 1000, function(v) {
                            xCenter = Math.round(v);
                            draw();
                        });

                        VizEngine.createButton(controls, 'New Random Sample', function() { draw(); });

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            var lo = Math.max(2, xCenter - windowSize);
                            var hi = Math.min(200000, xCenter + windowSize);

                            // Actual prime gaps
                            var actualGaps = {};
                            var maxGap = 0;
                            for (var i = 0; i < primes.length - 1; i++) {
                                if (primes[i] < lo) continue;
                                if (primes[i] > hi) break;
                                var g = primes[i + 1] - primes[i];
                                actualGaps[g] = (actualGaps[g] || 0) + 1;
                                maxGap = Math.max(maxGap, g);
                            }

                            // Random model gaps
                            var prob = 1 / Math.log(xCenter);
                            var randomPrimes = [];
                            for (var n = lo; n <= hi; n++) {
                                if (Math.random() < prob) randomPrimes.push(n);
                            }
                            var randomGaps = {};
                            for (var j = 0; j < randomPrimes.length - 1; j++) {
                                var rg = randomPrimes[j + 1] - randomPrimes[j];
                                randomGaps[rg] = (randomGaps[rg] || 0) + 1;
                                maxGap = Math.max(maxGap, rg);
                            }

                            maxGap = Math.min(maxGap, 60);
                            viz.screenText("Cramer's Model vs. Actual Prime Gaps near x = " + xCenter.toLocaleString(), viz.width / 2, 20, viz.colors.white, 13);

                            var margin = { left: 50, right: 20, top: 45, bottom: 50 };
                            var plotW = viz.width - margin.left - margin.right;
                            var plotH = viz.height - margin.top - margin.bottom;

                            // Find max count for scaling
                            var maxCount = 1;
                            for (var gg = 1; gg <= maxGap; gg++) {
                                maxCount = Math.max(maxCount, actualGaps[gg] || 0, randomGaps[gg] || 0);
                            }

                            var barW = Math.max(2, plotW / maxGap / 2.5);
                            var barGap = 1;

                            // Axes
                            ctx.strokeStyle = viz.colors.axis;
                            ctx.lineWidth = 1;
                            ctx.beginPath();
                            ctx.moveTo(margin.left, margin.top + plotH);
                            ctx.lineTo(margin.left + plotW, margin.top + plotH);
                            ctx.stroke();

                            for (var gap = 2; gap <= maxGap; gap += 2) {
                                var baseX = margin.left + (gap / maxGap) * plotW;

                                // Actual bar
                                var aCount = actualGaps[gap] || 0;
                                var aH = (aCount / maxCount) * plotH;
                                ctx.fillStyle = viz.colors.blue + 'aa';
                                ctx.fillRect(baseX - barW - barGap / 2, margin.top + plotH - aH, barW, aH);

                                // Random bar
                                var rCount = randomGaps[gap] || 0;
                                var rH = (rCount / maxCount) * plotH;
                                ctx.fillStyle = viz.colors.orange + 'aa';
                                ctx.fillRect(baseX + barGap / 2, margin.top + plotH - rH, barW, rH);

                                // Label
                                if (gap % 4 === 0 || gap <= 6) {
                                    ctx.fillStyle = viz.colors.text;
                                    ctx.font = '9px -apple-system,sans-serif';
                                    ctx.textAlign = 'center';
                                    ctx.textBaseline = 'top';
                                    ctx.fillText(gap.toString(), baseX, margin.top + plotH + 4);
                                }
                            }

                            // Legend
                            var legY = margin.top + plotH + 25;
                            ctx.fillStyle = viz.colors.blue;
                            ctx.fillRect(viz.width / 2 - 100, legY, 12, 12);
                            ctx.fillStyle = viz.colors.white;
                            ctx.font = '11px -apple-system,sans-serif';
                            ctx.textAlign = 'left';
                            ctx.fillText('Actual primes', viz.width / 2 - 84, legY + 10);

                            ctx.fillStyle = viz.colors.orange;
                            ctx.fillRect(viz.width / 2 + 30, legY, 12, 12);
                            ctx.fillStyle = viz.colors.white;
                            ctx.fillText('Random model', viz.width / 2 + 46, legY + 10);

                            viz.screenText('gap size', margin.left + plotW / 2, margin.top + plotH + 40, viz.colors.text, 11);
                        }
                        draw();
                        return viz;
                    }
                },
                {
                    id: 'viz-maximal-gaps',
                    title: 'Maximal Prime Gaps',
                    description: 'The largest prime gap \\(G(x)\\) up to \\(x\\), compared with \\((\\log x)^2\\) (Cramer\'s conjecture) and \\(\\sqrt{x}\\) (RH bound). Watch how \\(G(x) / (\\log x)^2\\) fluctuates but stays bounded.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 380,
                            originX: 0, originY: 0, scale: 1
                        });

                        var primes = VizEngine.sievePrimes(200000);

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            viz.screenText('Maximal Prime Gap G(x) vs. (log x)\u00B2', viz.width / 2, 20, viz.colors.white, 14);

                            // Compute maximal gaps
                            var data = [];
                            var maxGapSoFar = 0;
                            for (var i = 0; i < primes.length - 1; i++) {
                                var g = primes[i + 1] - primes[i];
                                if (g > maxGapSoFar) {
                                    maxGapSoFar = g;
                                    data.push({ x: primes[i], gap: g });
                                }
                            }

                            var margin = { left: 60, right: 30, top: 45, bottom: 45 };
                            var plotW = viz.width - margin.left - margin.right;
                            var plotH = viz.height - margin.top - margin.bottom;

                            // Plot G(x) / (log x)^2
                            var ratios = data.map(function(d) {
                                var logx = Math.log(d.x);
                                return { x: d.x, ratio: d.gap / (logx * logx), gap: d.gap };
                            });

                            var xMin = 2, xMax = 200000;
                            var rMin = 0, rMax = 2;

                            function toScreenX(v) { return margin.left + plotW * Math.log(v / xMin) / Math.log(xMax / xMin); }
                            function toScreenY(v) { return margin.top + plotH * (1 - (v - rMin) / (rMax - rMin)); }

                            // Axes
                            ctx.strokeStyle = viz.colors.axis;
                            ctx.lineWidth = 1.5;
                            ctx.beginPath();
                            ctx.moveTo(margin.left, margin.top);
                            ctx.lineTo(margin.left, margin.top + plotH);
                            ctx.lineTo(margin.left + plotW, margin.top + plotH);
                            ctx.stroke();

                            // Y gridlines
                            ctx.font = '10px -apple-system,sans-serif';
                            ctx.textAlign = 'right';
                            ctx.textBaseline = 'middle';
                            for (var r = 0; r <= 2; r += 0.5) {
                                var sy = toScreenY(r);
                                ctx.fillStyle = viz.colors.text;
                                ctx.fillText(r.toFixed(1), margin.left - 6, sy);
                                ctx.strokeStyle = viz.colors.grid;
                                ctx.lineWidth = 0.5;
                                ctx.beginPath();
                                ctx.moveTo(margin.left, sy);
                                ctx.lineTo(margin.left + plotW, sy);
                                ctx.stroke();
                            }

                            // Cramer = 1 line
                            ctx.strokeStyle = viz.colors.green;
                            ctx.lineWidth = 1.5;
                            ctx.setLineDash([4, 3]);
                            ctx.beginPath();
                            ctx.moveTo(margin.left, toScreenY(1));
                            ctx.lineTo(margin.left + plotW, toScreenY(1));
                            ctx.stroke();
                            ctx.setLineDash([]);
                            viz.screenText("Cramer's conjecture: ratio \u2192 1", margin.left + plotW / 2, toScreenY(1) - 12, viz.colors.green, 10);

                            // Granville line at 2e^{-gamma}
                            var granville = 2 * Math.exp(-0.5772156649);
                            ctx.strokeStyle = viz.colors.purple;
                            ctx.lineWidth = 1;
                            ctx.setLineDash([3, 3]);
                            ctx.beginPath();
                            ctx.moveTo(margin.left, toScreenY(granville));
                            ctx.lineTo(margin.left + plotW, toScreenY(granville));
                            ctx.stroke();
                            ctx.setLineDash([]);
                            viz.screenText('Granville: \u2265 2e^{-\u03B3} \u2248 ' + granville.toFixed(2), margin.left + plotW - 80, toScreenY(granville) + 12, viz.colors.purple, 10);

                            // X labels (log scale)
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'top';
                            var xTicks = [10, 100, 1000, 10000, 100000];
                            for (var k = 0; k < xTicks.length; k++) {
                                var sx = toScreenX(xTicks[k]);
                                ctx.fillStyle = viz.colors.text;
                                ctx.fillText(xTicks[k] >= 1000 ? (xTicks[k] / 1000) + 'k' : xTicks[k].toString(), sx, margin.top + plotH + 6);
                            }

                            // Data points: step function for G(x)/(log x)^2
                            ctx.strokeStyle = viz.colors.teal;
                            ctx.lineWidth = 2;
                            ctx.beginPath();
                            for (var m = 0; m < ratios.length; m++) {
                                var px = toScreenX(ratios[m].x);
                                var py = toScreenY(Math.min(ratios[m].ratio, rMax));
                                if (m === 0) ctx.moveTo(px, py);
                                else {
                                    ctx.lineTo(px, py);
                                }
                                if (m < ratios.length - 1) {
                                    ctx.lineTo(toScreenX(ratios[m + 1].x), py);
                                }

                                // Point
                                ctx.fillStyle = viz.colors.teal;
                                ctx.fill();
                            }
                            ctx.stroke();

                            // Redraw points on top
                            for (var n = 0; n < ratios.length; n++) {
                                var ppx = toScreenX(ratios[n].x);
                                var ppy = toScreenY(Math.min(ratios[n].ratio, rMax));
                                ctx.fillStyle = viz.colors.teal;
                                ctx.beginPath();
                                ctx.arc(ppx, ppy, 3, 0, Math.PI * 2);
                                ctx.fill();
                            }

                            viz.screenText('x (log scale)', margin.left + plotW / 2, margin.top + plotH + 30, viz.colors.text, 11);
                            viz.screenText('G(x) / (log x)\u00B2', margin.left - 35, margin.top + plotH / 2, viz.colors.text, 11);
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: "In Cramer's model, the gap between consecutive primes near \\(x\\) is approximately Geometric with parameter \\(p = 1/\\log x\\). Compute the expected gap and its variance.",
                    hint: 'For a Geometric(\\(p\\)) random variable, \\(\\mathbb{E}[G] = 1/p\\) and \\(\\text{Var}(G) = (1-p)/p^2\\).',
                    solution: "In Cramer's model, consecutive prime gaps near \\(x\\) follow Geometric(\\(1/\\log x\\)). Thus \\(\\mathbb{E}[G] = \\log x\\) and \\(\\text{Var}(G) = (1 - 1/\\log x) \\cdot (\\log x)^2 \\approx (\\log x)^2\\). The standard deviation is \\(\\approx \\log x\\), same order as the mean, consistent with the high variability of prime gaps."
                },
                {
                    question: "Use extreme value theory to explain why Cramer's model predicts \\(G(x) \\sim (\\log x)^2\\). How many independent gaps are there up to \\(x\\)?",
                    hint: 'There are \\(\\pi(x) \\approx x/\\log x\\) primes up to \\(x\\), giving about that many gaps. The maximum of \\(N\\) independent Geometric(\\(p\\)) random variables is approximately \\(\\log(N)/p\\).',
                    solution: "There are \\(N = \\pi(x) \\approx x/\\log x\\) prime gaps up to \\(x\\). Each is approximately Geometric(\\(1/\\log x\\)). The maximum of \\(N\\) independent Geometric(\\(p\\)) variables is approximately \\(\\log(N) / p = \\log(x/\\log x) \\cdot \\log x \\approx (\\log x)^2\\) (since \\(\\log(x/\\log x) \\sim \\log x\\)). Thus \\(G(x) \\sim (\\log x)^2\\)."
                }
            ]
        },

        // ================================================================
        // SECTION 6: The Bridge — Connecting Themes
        // ================================================================
        {
            id: 'sec-bridge',
            title: 'The Bridge',
            content: `
<h2>The Bridge: From Short Intervals to Modern Number Theory</h2>

<div class="env-block intuition">
    <div class="env-title">A Web of Connections</div>
    <div class="env-body">
        <p>The short interval problem sits at the nexus of many threads in analytic number theory. Zero-free regions, zero-density estimates, sieve methods, exponential sums, and probabilistic models all converge here. This section traces these connections and looks toward the frontier.</p>
    </div>
</div>

<h3>Connection to Bounded Gaps (Chapter 19)</h3>

<p>The short interval problem asks: can we guarantee primes in \\((x, x + x^\\theta]\\)? The bounded gaps problem (Chapter 19) asks something superficially different: are there infinitely many pairs of primes with bounded gap? Yet the tools overlap deeply.</p>

<p>Both problems ultimately depend on understanding Type I, Type II, and Type III sums. Zhang's 2013 breakthrough on bounded gaps (\\(\\liminf (p_{n+1} - p_n) < 7 \\times 10^7\\)) used the Bombieri-Vinogradov theorem (Chapter 13) to handle Type I sums, and required going "beyond Bombieri-Vinogradov" for Type III sums, in a spirit similar to Baker-Harman-Pintz.</p>

<h3>Connection to the Explicit Formula (Chapter 8)</h3>

<p>The explicit formula is the engine behind all rigorous short-interval results. Every improvement to \\(\\theta\\) can be traced to either:</p>
<ol>
    <li>Better control of the zero sum \\(\\sum_\\rho x^\\rho / \\rho\\) (via zero-density estimates), or</li>
    <li>Better decompositions of the prime sum (via sieve identities) that reduce the problem to sums where the zero contribution is easier to bound.</li>
</ol>

<h3>Connection to Sieve Methods (Part E)</h3>

<p>The BHP proof decomposes the prime-detecting function into Type I, II, and III components using Vaughan's identity and Heath-Brown's identity (Chapter 12). This is not coincidental: sieve methods are the natural language for decomposing the indicator function of primes.</p>

<div class="env-block theorem">
    <div class="env-title">Theorem 18.6 (Summary of Key Equivalences)</div>
    <div class="env-body">
        <p>The following are equivalent (up to technical conditions):</p>
        <ol>
            <li>\\(\\theta = 1/2 + \\varepsilon\\) in the short interval problem</li>
            <li>The Density Hypothesis: \\(N(\\sigma, T) \\ll T^{2(1-\\sigma)+\\varepsilon}\\)</li>
            <li>A sufficiently strong form of the Lindelof Hypothesis on the 1-line</li>
        </ol>
        <p>All three are consequences of RH, but proving any one of them unconditionally remains open.</p>
    </div>
</div>

<h3>Open Problems</h3>

<div class="env-block remark">
    <div class="env-title">What Would Constitute Progress?</div>
    <div class="env-body">
        <p>Several milestones would represent major advances:</p>
        <ul>
            <li><strong>Breaking \\(\\theta = 1/2\\):</strong> Even proving \\(\\theta = 0.524\\) would be a substantial improvement on BHP.</li>
            <li><strong>The Density Hypothesis:</strong> Proving \\(N(\\sigma, T) \\ll T^{2(1-\\sigma)+\\varepsilon}\\) would give \\(\\theta = 1/2 + \\varepsilon\\) unconditionally.</li>
            <li><strong>Almost all short intervals:</strong> Proving that \\(\\pi(x + (\\log x)^A) - \\pi(x) \\sim (\\log x)^{A-1}\\) for almost all \\(x\\) (some \\(A\\)) would bring us closer to Cramer's world.</li>
            <li><strong>Cramer's conjecture:</strong> Any progress toward \\(G(x) \\ll (\\log x)^{2+\\varepsilon}\\) would be revolutionary.</li>
        </ul>
    </div>
</div>

<h3>The Big Picture</h3>

<p>The short interval problem encapsulates a central theme of analytic number theory: the tension between what the zeros of \\(\\zeta(s)\\) allow and what we can prove about those zeros. Every technique developed in this course, from Euler products to exponential sums, from sieves to automorphic forms, has been brought to bear on understanding primes in short intervals. The current frontier at \\(\\theta = 0.525\\) is a measure of how far we have come; the gap to \\(\\theta = 0\\) is a measure of how far we have yet to go.</p>

<div class="viz-placeholder" data-viz="viz-bridge"></div>
`,
            visualizations: [
                {
                    id: 'viz-bridge',
                    title: 'The Web of Connections',
                    description: 'A visual map showing how the short interval problem connects to other major topics in analytic number theory. Each node represents a key topic, and edges show the logical dependencies.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 400,
                            originX: 0, originY: 0, scale: 1
                        });

                        var nodes = [
                            { id: 'short', label: 'Short Intervals', x: 280, y: 60, color: null },
                            { id: 'zeros', label: 'Zero-Density', x: 100, y: 150, color: null },
                            { id: 'sieve', label: 'Sieve Methods', x: 460, y: 150, color: null },
                            { id: 'expsum', label: 'Exponential Sums', x: 460, y: 250, color: null },
                            { id: 'explicit', label: 'Explicit Formula', x: 100, y: 250, color: null },
                            { id: 'rh', label: 'Riemann Hypothesis', x: 180, y: 340, color: null },
                            { id: 'gaps', label: 'Bounded Gaps', x: 380, y: 340, color: null },
                            { id: 'bv', label: 'Bombieri-Vinogradov', x: 280, y: 250, color: null }
                        ];

                        var edges = [
                            ['short', 'zeros'], ['short', 'sieve'], ['short', 'expsum'],
                            ['short', 'explicit'], ['short', 'bv'],
                            ['zeros', 'explicit'], ['zeros', 'rh'],
                            ['sieve', 'gaps'], ['sieve', 'bv'],
                            ['expsum', 'sieve'], ['explicit', 'rh'],
                            ['bv', 'gaps'], ['bv', 'explicit']
                        ];

                        var nodeColors = [
                            viz.colors.teal, viz.colors.blue, viz.colors.orange,
                            viz.colors.yellow, viz.colors.purple, viz.colors.pink,
                            viz.colors.green, viz.colors.red
                        ];

                        var hoveredNode = null;

                        function getNode(id) {
                            for (var i = 0; i < nodes.length; i++) {
                                if (nodes[i].id === id) return nodes[i];
                            }
                            return null;
                        }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            viz.screenText('Connections in the Short Interval Problem', viz.width / 2, 20, viz.colors.white, 14);

                            // Draw edges
                            for (var e = 0; e < edges.length; e++) {
                                var n1 = getNode(edges[e][0]);
                                var n2 = getNode(edges[e][1]);
                                if (!n1 || !n2) continue;
                                var isHighlighted = hoveredNode && (edges[e][0] === hoveredNode || edges[e][1] === hoveredNode);
                                ctx.strokeStyle = isHighlighted ? viz.colors.white + 'cc' : viz.colors.axis + '66';
                                ctx.lineWidth = isHighlighted ? 2 : 1;
                                ctx.beginPath();
                                ctx.moveTo(n1.x, n1.y);
                                ctx.lineTo(n2.x, n2.y);
                                ctx.stroke();
                            }

                            // Draw nodes
                            for (var i = 0; i < nodes.length; i++) {
                                var n = nodes[i];
                                var col = nodeColors[i];
                                var isHovered = hoveredNode === n.id;
                                var r = isHovered ? 22 : 18;

                                ctx.fillStyle = col + (isHovered ? 'dd' : '88');
                                ctx.beginPath();
                                ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
                                ctx.fill();

                                ctx.strokeStyle = col;
                                ctx.lineWidth = isHovered ? 2.5 : 1.5;
                                ctx.beginPath();
                                ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
                                ctx.stroke();

                                ctx.fillStyle = viz.colors.white;
                                ctx.font = (isHovered ? 'bold ' : '') + '9px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.textBaseline = 'middle';

                                // Word wrap for short labels
                                var words = n.label.split(' ');
                                if (words.length <= 2) {
                                    ctx.fillText(n.label, n.x, n.y + r + 12);
                                } else {
                                    var mid = Math.ceil(words.length / 2);
                                    ctx.fillText(words.slice(0, mid).join(' '), n.x, n.y + r + 8);
                                    ctx.fillText(words.slice(mid).join(' '), n.x, n.y + r + 20);
                                }
                            }
                        }

                        // Hover detection
                        viz.canvas.addEventListener('mousemove', function(e) {
                            var rect = viz.canvas.getBoundingClientRect();
                            var mx = e.clientX - rect.left;
                            var my = e.clientY - rect.top;
                            var oldHovered = hoveredNode;
                            hoveredNode = null;
                            for (var i = 0; i < nodes.length; i++) {
                                var dx = mx - nodes[i].x;
                                var dy = my - nodes[i].y;
                                if (dx * dx + dy * dy < 25 * 25) {
                                    hoveredNode = nodes[i].id;
                                    break;
                                }
                            }
                            if (hoveredNode !== oldHovered) draw();
                        });

                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: "Explain why improving the exponent in the Bombieri-Vinogradov theorem (currently \\(Q \\leq x^{1/2-\\varepsilon}\\)) would have implications for the short interval problem.",
                    hint: "Bombieri-Vinogradov controls primes in arithmetic progressions on average, which is essentially a 'Type I' estimate. Extending its range of validity to \\(Q \\leq x^{1/2+\\delta}\\) would strengthen the Type I information available.",
                    solution: "The Bombieri-Vinogradov theorem gives 'RH-quality' control over primes in arithmetic progressions for moduli \\(q \\leq x^{1/2-\\varepsilon}\\). In the short interval problem, Type I sums involve terms \\(\\sum_{m \\leq M} a_m [\\text{integers in } (x, x+y] \\text{ divisible by } m]\\), which connects to primes in progressions. If BV could be extended to \\(q \\leq x^{1/2+\\delta}\\), the Type I range would expand, potentially lowering \\(\\theta\\). Elliott-Halberstam conjecture (BV with \\(Q \\leq x^{1-\\varepsilon}\\)) combined with sieve theory would give dramatic improvements."
                },
                {
                    question: 'Summarize the three main approaches to the short interval problem (zero-density, sieve decomposition, probabilistic model) and identify the key limitation of each.',
                    hint: 'Each approach captures different aspects of the problem. Think about what information each method uses and what it ignores.',
                    solution: '(1) Zero-density approach: uses the explicit formula and bounds \\(N(\\sigma, T)\\) to control the zero sum. Limitation: current zero-density estimates are not strong enough to reach \\(\\theta = 1/2\\). (2) Sieve decomposition: breaks the prime indicator into Type I/II/III sums and bounds each separately. Limitation: the decomposition loses information about cancellation between types, and each type has its own barrier. (3) Probabilistic model (Cramer): provides heuristic predictions by treating primes as random. Limitation: it ignores the multiplicative structure of primes (divisibility constraints), as shown by Granville\'s correction, and cannot be made rigorous without essentially proving RH. The true difficulty is that all three approaches ultimately reduce to understanding zeta zeros, which remains the central open problem.'
                }
            ]
        }
    ]
});
