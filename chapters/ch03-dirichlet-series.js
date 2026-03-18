window.CHAPTERS = window.CHAPTERS || [];
window.CHAPTERS.push({
    id: 'ch03',
    number: 3,
    title: 'Dirichlet Series & Euler Products',
    subtitle: 'Encoding arithmetic in the language of analysis',
    sections: [
        // ================================================================
        // SECTION 1: Motivation
        // ================================================================
        {
            id: 'sec-motivation',
            title: 'Motivation',
            content: `
<h2>Why Dirichlet Series?</h2>

<div class="env-block intuition">
    <div class="env-title">The Central Idea</div>
    <div class="env-body">
        <p>We have spent two chapters studying arithmetic functions: \\(\\mu(n)\\), \\(\\phi(n)\\), \\(\\Lambda(n)\\), \\(d(n)\\). We computed their averages by summing \\(\\sum_{n \\le x} f(n)\\) and estimating the error. But all of that was <em>elementary</em>: no complex analysis, no analytic continuation. We now introduce the machine that will transform number theory into analysis.</p>
    </div>
</div>

<p>The idea is breathtakingly simple. Given an arithmetic function \\(f: \\mathbb{N} \\to \\mathbb{C}\\), attach it to a <strong>generating series</strong>:</p>

\\[
F(s) = \\sum_{n=1}^{\\infty} \\frac{f(n)}{n^s}, \\quad s \\in \\mathbb{C}.
\\]

<p>This is a <strong>Dirichlet series</strong>. It encodes \\(f\\) in a way that turns two key operations, pointwise multiplication and Dirichlet convolution, into simple algebraic manipulations of the series.</p>

<h3>Why Not Power Series?</h3>

<p>If you have studied generating functions in combinatorics, you might expect us to use a power series \\(\\sum f(n) x^n\\). The trouble is that number theory is <em>multiplicative</em>. The relation \\(f(mn) = f(m) f(n)\\) for multiplicative functions has no natural interpretation in the power series world, where the exponents add. In a Dirichlet series, the exponents multiply via \\(n^{-s} \\cdot m^{-s} = (nm)^{-s}\\), which is exactly what we need.</p>

<div class="env-block example">
    <div class="env-title">Example: The Zeta Function</div>
    <div class="env-body">
        <p>The simplest arithmetic function is \\(f(n) = 1\\) for all \\(n\\). Its Dirichlet series is</p>
        \\[\\zeta(s) = \\sum_{n=1}^{\\infty} \\frac{1}{n^s}.\\]
        <p>This is the <strong>Riemann zeta function</strong>, the central object of this course. For now, it is just a series; soon it will become much more.</p>
    </div>
</div>

<div class="env-block example">
    <div class="env-title">Example: Other Familiar Series</div>
    <div class="env-body">
        <p>Several arithmetic functions we have already encountered have natural Dirichlet series:</p>
        <ul>
            <li>\\(f(n) = \\mu(n)\\): the series \\(\\sum \\mu(n)/n^s = 1/\\zeta(s)\\).</li>
            <li>\\(f(n) = \\Lambda(n)\\): the series \\(\\sum \\Lambda(n)/n^s = -\\zeta'(s)/\\zeta(s)\\).</li>
            <li>\\(f(n) = d(n)\\): the series \\(\\sum d(n)/n^s = \\zeta(s)^2\\).</li>
        </ul>
        <p>Each identity encodes deep arithmetic in compact analytic form. We will prove all of these.</p>
    </div>
</div>

<h3>The Program</h3>

<p>This chapter establishes the analytic foundations: convergence, the Euler product, formal properties (multiplication = Dirichlet convolution), and uniqueness. By the end, you will see exactly how \\(\\zeta(s)\\) arises as the bridge between prime factorization and complex analysis.</p>

<div class="viz-placeholder" data-viz="viz-series-comparison"></div>
`,
            visualizations: [
                {
                    id: 'viz-series-comparison',
                    title: 'Comparing Dirichlet Series',
                    description: 'Visualize the partial sums of several Dirichlet series for real \\(s\\). Drag the slider to change \\(s\\) and watch convergence behavior. For \\(s > 1\\) all series converge; as \\(s \\to 1^+\\), \\(\\zeta(s)\\) diverges.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 380,
                            originX: 60, originY: 340, scale: 1
                        });

                        var sVal = 2.0;
                        VizEngine.createSlider(controls, 's', 1.05, 4.0, sVal, 0.05, function(v) {
                            sVal = v; draw();
                        });

                        var primes = VizEngine.sievePrimes(200);

                        function mobius(n) {
                            if (n === 1) return 1;
                            var result = 1;
                            for (var i = 0; i < primes.length && primes[i] * primes[i] <= n; i++) {
                                if (n % primes[i] === 0) {
                                    n /= primes[i];
                                    if (n % primes[i] === 0) return 0;
                                    result = -result;
                                }
                            }
                            if (n > 1) result = -result;
                            return result;
                        }

                        function divisorCount(n) {
                            var d = 0;
                            for (var i = 1; i * i <= n; i++) {
                                if (n % i === 0) { d++; if (i !== n / i) d++; }
                            }
                            return d;
                        }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var N = 60;

                            viz.screenText('Partial Sums of Dirichlet Series (real s = ' + sVal.toFixed(2) + ')', viz.width / 2, 20, viz.colors.white, 14);

                            // Compute partial sums
                            var zetaSums = [], muSums = [], dSums = [];
                            var zAcc = 0, mAcc = 0, dAcc = 0;
                            for (var n = 1; n <= N; n++) {
                                zAcc += 1 / Math.pow(n, sVal);
                                mAcc += mobius(n) / Math.pow(n, sVal);
                                dAcc += divisorCount(n) / Math.pow(n, sVal);
                                zetaSums.push(zAcc);
                                muSums.push(mAcc);
                                dSums.push(dAcc);
                            }

                            // Find range for y axis
                            var allVals = zetaSums.concat(muSums).concat(dSums);
                            var yMin = Math.min.apply(null, allVals);
                            var yMax = Math.max.apply(null, allVals);
                            var yRange = yMax - yMin || 1;
                            yMin -= yRange * 0.1;
                            yMax += yRange * 0.1;
                            yRange = yMax - yMin;

                            var chartL = 70, chartR = viz.width - 30;
                            var chartT = 45, chartB = 310;
                            var chartW = chartR - chartL, chartH = chartB - chartT;

                            // Grid lines
                            ctx.strokeStyle = viz.colors.grid; ctx.lineWidth = 0.5;
                            for (var g = 0; g <= 4; g++) {
                                var gy = chartB - g / 4 * chartH;
                                ctx.beginPath(); ctx.moveTo(chartL, gy); ctx.lineTo(chartR, gy); ctx.stroke();
                                var gLabel = (yMin + g / 4 * yRange).toFixed(2);
                                ctx.fillStyle = viz.colors.text; ctx.font = '10px -apple-system,sans-serif';
                                ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
                                ctx.fillText(gLabel, chartL - 6, gy);
                            }

                            // x axis labels
                            ctx.textAlign = 'center'; ctx.textBaseline = 'top';
                            for (var xl = 10; xl <= N; xl += 10) {
                                var xx = chartL + (xl - 1) / (N - 1) * chartW;
                                ctx.fillStyle = viz.colors.text; ctx.font = '10px -apple-system,sans-serif';
                                ctx.fillText(xl.toString(), xx, chartB + 4);
                            }
                            ctx.fillText('n', chartR + 10, chartB + 4);

                            function plotSeries(sums, color) {
                                ctx.strokeStyle = color; ctx.lineWidth = 2;
                                ctx.beginPath();
                                for (var i = 0; i < sums.length; i++) {
                                    var px = chartL + i / (N - 1) * chartW;
                                    var py = chartB - (sums[i] - yMin) / yRange * chartH;
                                    if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
                                }
                                ctx.stroke();
                            }

                            plotSeries(dSums, viz.colors.orange);
                            plotSeries(zetaSums, viz.colors.blue);
                            plotSeries(muSums, viz.colors.teal);

                            // Legend
                            var ly = chartB + 28;
                            ctx.font = '11px -apple-system,sans-serif'; ctx.textAlign = 'left';
                            ctx.fillStyle = viz.colors.blue;
                            ctx.fillRect(chartL, ly, 14, 3);
                            ctx.fillText('\u03B6(s) = \u03A3 1/n\u02E2', chartL + 18, ly + 4);

                            ctx.fillStyle = viz.colors.teal;
                            ctx.fillRect(chartL + 140, ly, 14, 3);
                            ctx.fillText('1/\u03B6(s) = \u03A3 \u03BC(n)/n\u02E2', chartL + 158, ly + 4);

                            ctx.fillStyle = viz.colors.orange;
                            ctx.fillRect(chartL + 320, ly, 14, 3);
                            ctx.fillText('\u03B6(s)\u00B2 = \u03A3 d(n)/n\u02E2', chartL + 338, ly + 4);

                            // Converged values
                            viz.screenText(
                                '\u03B6(' + sVal.toFixed(2) + ') \u2248 ' + zetaSums[N - 1].toFixed(4) +
                                '    1/\u03B6 \u2248 ' + muSums[N - 1].toFixed(4) +
                                '    \u03B6\u00B2 \u2248 ' + dSums[N - 1].toFixed(4),
                                viz.width / 2, ly + 22, viz.colors.white, 11
                            );
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Write down the Dirichlet series for the arithmetic function \\(f(n) = n\\). For which real values of \\(s\\) does it converge?',
                    hint: 'The series is \\(\\sum n / n^s = \\sum 1/n^{s-1}\\). Compare with \\(\\zeta(s-1)\\).',
                    solution: 'The series is \\(\\sum_{n=1}^\\infty n^{1-s} = \\zeta(s-1)\\). It converges for \\(\\operatorname{Re}(s-1) > 1\\), i.e., \\(\\operatorname{Re}(s) > 2\\).'
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

<div class="env-block intuition">
    <div class="env-title">Half-Planes, Not Discs</div>
    <div class="env-body">
        <p>A power series \\(\\sum a_n z^n\\) converges inside a disc \\(|z| < R\\). A Dirichlet series \\(\\sum a_n / n^s\\) converges in a <em>half-plane</em> \\(\\operatorname{Re}(s) > \\sigma_c\\). The reason is that \\(|n^{-s}| = n^{-\\sigma}\\) depends only on \\(\\sigma = \\operatorname{Re}(s)\\), not on \\(t = \\operatorname{Im}(s)\\). So convergence is determined by how far right we are, not by how far up or down.</p>
    </div>
</div>

<h3>Absolute vs. Conditional Convergence</h3>

<p>Write \\(s = \\sigma + it\\). There are two critical thresholds:</p>

<div class="env-block definition">
    <div class="env-title">Definition (Abscissae of Convergence)</div>
    <div class="env-body">
        <p>For a Dirichlet series \\(F(s) = \\sum a_n n^{-s}\\):</p>
        <ul>
            <li>The <strong>abscissa of convergence</strong> \\(\\sigma_c\\) is the infimum of all \\(\\sigma\\) such that the series converges for \\(\\operatorname{Re}(s) = \\sigma\\). The series converges for \\(\\operatorname{Re}(s) > \\sigma_c\\) and diverges for \\(\\operatorname{Re}(s) < \\sigma_c\\).</li>
            <li>The <strong>abscissa of absolute convergence</strong> \\(\\sigma_a\\) is defined identically but with absolute convergence.</li>
        </ul>
        <p>We always have \\(\\sigma_c \\le \\sigma_a \\le \\sigma_c + 1\\).</p>
    </div>
</div>

<p>The gap \\(\\sigma_a - \\sigma_c\\) can be as large as 1. The classic example is the alternating series \\(\\sum (-1)^{n-1} / n^s\\), which converges conditionally for \\(\\sigma > 0\\) but absolutely only for \\(\\sigma > 1\\), so \\(\\sigma_c = 0\\) and \\(\\sigma_a = 1\\).</p>

<div class="env-block theorem">
    <div class="env-title">Theorem 3.1 (Convergence Half-Plane)</div>
    <div class="env-body">
        <p>If \\(\\sum a_n n^{-s}\\) converges at \\(s = s_0\\), then it converges for all \\(s\\) with \\(\\operatorname{Re}(s) > \\operatorname{Re}(s_0)\\). Moreover, the convergence is uniform in any angular region \\(|\\arg(s - s_0)| \\le \\theta < \\pi/2\\).</p>
    </div>
</div>

<div class="env-block proof">
    <div class="env-title">Proof Sketch</div>
    <div class="env-body">
        <p>Suppose \\(\\sum a_n n^{-s_0}\\) converges. Write \\(s = s_0 + w\\) with \\(\\operatorname{Re}(w) > 0\\). Then</p>
        \\[\\frac{a_n}{n^s} = \\frac{a_n}{n^{s_0}} \\cdot \\frac{1}{n^w}.\\]
        <p>Since \\(1/n^w \\to 0\\) monotonically and the partial sums \\(\\sum_{n \\le N} a_n n^{-s_0}\\) are bounded, Abel summation (summation by parts) gives convergence of the original series.</p>
    </div>
    <div class="qed">&marker;</div>
</div>

<h3>The Abscissa Formula</h3>

<div class="env-block theorem">
    <div class="env-title">Theorem 3.2 (Abscissa of Absolute Convergence)</div>
    <div class="env-body">
        <p>\\[\\sigma_a = \\limsup_{n \\to \\infty} \\frac{\\log |a_1| + |a_2| + \\cdots + |a_n|}{\\log n}.\\]</p>
        <p>In particular, if \\(|a_n| = O(n^\\alpha)\\), then \\(\\sigma_a \\le \\alpha + 1\\).</p>
    </div>
</div>

<div class="env-block example">
    <div class="env-title">Example: Abscissae for \\(\\zeta(s)\\)</div>
    <div class="env-body">
        <p>For \\(\\zeta(s) = \\sum 1/n^s\\), all coefficients are \\(a_n = 1\\). The series \\(\\sum 1/n^\\sigma\\) converges if and only if \\(\\sigma > 1\\) (by comparison with the integral \\(\\int_1^\\infty x^{-\\sigma} dx\\)). So \\(\\sigma_a = \\sigma_c = 1\\). In this case, the gap is zero.</p>
    </div>
</div>

<div class="env-block remark">
    <div class="env-title">The Strip of Conditional Convergence</div>
    <div class="env-body">
        <p>When \\(\\sigma_c < \\sigma_a\\), the strip \\(\\sigma_c < \\operatorname{Re}(s) < \\sigma_a\\) is a region of <em>conditional</em> convergence. The series converges, but not absolutely. This strip is analogous to the boundary of the disc of convergence for a power series, where convergence behavior can be subtle.</p>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-convergence-halfplane"></div>

<div class="viz-placeholder" data-viz="viz-abscissa-wall"></div>
`,
            visualizations: [
                {
                    id: 'viz-convergence-halfplane',
                    title: 'Convergence Half-Plane',
                    description: 'The complex \\(s\\)-plane divided into regions of absolute convergence, conditional convergence, and divergence. Drag \\(\\sigma_c\\) and \\(\\sigma_a\\) to explore different Dirichlet series.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 380,
                            originX: 280, originY: 190, scale: 50
                        });

                        var sigmaC = 0;
                        var sigmaA = 1;

                        var dragC = viz.addDraggable('sc', sigmaC, 0, viz.colors.teal, 8, function(x) {
                            sigmaC = Math.min(x, sigmaA - 0.1);
                            dragC.x = sigmaC; dragC.y = 0;
                            draw();
                        });
                        var dragA = viz.addDraggable('sa', sigmaA, 0, viz.colors.orange, 8, function(x) {
                            sigmaA = Math.max(x, sigmaC + 0.1);
                            dragA.x = sigmaA; dragA.y = 0;
                            draw();
                        });

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            // Divergence region (left of sigma_c)
                            var scScreen = viz.toScreen(sigmaC, 0)[0];
                            var saScreen = viz.toScreen(sigmaA, 0)[0];

                            ctx.fillStyle = viz.colors.red + '22';
                            ctx.fillRect(0, 0, scScreen, viz.height);

                            // Conditional convergence strip
                            if (saScreen - scScreen > 1) {
                                ctx.fillStyle = viz.colors.yellow + '22';
                                ctx.fillRect(scScreen, 0, saScreen - scScreen, viz.height);
                            }

                            // Absolute convergence region
                            ctx.fillStyle = viz.colors.green + '22';
                            ctx.fillRect(saScreen, 0, viz.width - saScreen, viz.height);

                            viz.drawGrid(1);
                            viz.drawAxes();

                            // Vertical lines at sigma_c and sigma_a
                            ctx.strokeStyle = viz.colors.teal; ctx.lineWidth = 2;
                            ctx.setLineDash([6, 4]);
                            ctx.beginPath(); ctx.moveTo(scScreen, 0); ctx.lineTo(scScreen, viz.height); ctx.stroke();

                            ctx.strokeStyle = viz.colors.orange;
                            ctx.beginPath(); ctx.moveTo(saScreen, 0); ctx.lineTo(saScreen, viz.height); ctx.stroke();
                            ctx.setLineDash([]);

                            // Labels
                            viz.screenText('\u03C3', viz.width - 15, viz.originY - 12, viz.colors.text, 13);
                            viz.screenText('it', viz.originX + 12, 15, viz.colors.text, 13);

                            viz.screenText('Diverges', scScreen / 2, 25, viz.colors.red, 12);
                            if (saScreen - scScreen > 50) {
                                viz.screenText('Conditional', (scScreen + saScreen) / 2, 25, viz.colors.yellow, 11);
                            }
                            viz.screenText('Absolute', (saScreen + viz.width) / 2, 25, viz.colors.green, 12);

                            viz.screenText('\u03C3\u1D04 = ' + sigmaC.toFixed(2), scScreen, viz.height - 15, viz.colors.teal, 11);
                            viz.screenText('\u03C3\u2090 = ' + sigmaA.toFixed(2), saScreen, viz.height - 15, viz.colors.orange, 11);

                            viz.drawDraggables();
                        }
                        draw();
                        return viz;
                    }
                },
                {
                    id: 'viz-abscissa-wall',
                    title: 'The Abscissa Wall',
                    description: 'Compute partial sums \\(\\sum_{n=1}^{N} a_n / n^\\sigma\\) for real \\(\\sigma\\) to see the convergence/divergence transition. As \\(N\\) grows, the partial sums stabilize for \\(\\sigma > \\sigma_c\\) and blow up for \\(\\sigma < \\sigma_c\\).',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 380,
                            originX: 60, originY: 340, scale: 1
                        });

                        var NVal = 100;
                        var seriesType = 'zeta';

                        VizEngine.createSlider(controls, 'N', 10, 500, NVal, 10, function(v) {
                            NVal = Math.round(v); draw();
                        });

                        var btnZeta = VizEngine.createButton(controls, '\u03B6(s)', function() {
                            seriesType = 'zeta'; draw();
                        });
                        var btnAlt = VizEngine.createButton(controls, 'Alt. zeta', function() {
                            seriesType = 'alt'; draw();
                        });
                        var btnMu = VizEngine.createButton(controls, '1/\u03B6(s)', function() {
                            seriesType = 'mu'; draw();
                        });

                        var primes = VizEngine.sievePrimes(600);

                        function mobius(n) {
                            if (n === 1) return 1;
                            var nn = n, result = 1;
                            for (var i = 0; i < primes.length && primes[i] * primes[i] <= nn; i++) {
                                if (nn % primes[i] === 0) {
                                    nn /= primes[i];
                                    if (nn % primes[i] === 0) return 0;
                                    result = -result;
                                }
                            }
                            if (nn > 1) result = -result;
                            return result;
                        }

                        function coeff(n) {
                            if (seriesType === 'zeta') return 1;
                            if (seriesType === 'alt') return Math.pow(-1, n - 1);
                            return mobius(n);
                        }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            var title = seriesType === 'zeta' ? '\u03B6(s): \u03C3\u1D04 = 1' :
                                        seriesType === 'alt' ? 'Alternating: \u03C3\u1D04 = 0, \u03C3\u2090 = 1' :
                                        '1/\u03B6(s): \u03C3\u1D04 = 1';
                            viz.screenText('Partial sums of ' + title + '  (N = ' + NVal + ')', viz.width / 2, 20, viz.colors.white, 13);

                            // Compute partial sums for a range of sigma values
                            var sigmaMin = seriesType === 'alt' ? -0.5 : 0.3;
                            var sigmaMax = 3.0;
                            var nSigma = 40;
                            var sums = [];
                            for (var i = 0; i < nSigma; i++) {
                                var sigma = sigmaMin + (sigmaMax - sigmaMin) * i / (nSigma - 1);
                                var acc = 0;
                                for (var n = 1; n <= NVal; n++) {
                                    acc += coeff(n) / Math.pow(n, sigma);
                                }
                                sums.push({ sigma: sigma, val: acc });
                            }

                            // Clamp for display
                            var chartL = 70, chartR = viz.width - 30;
                            var chartT = 45, chartB = 310;
                            var chartW = chartR - chartL, chartH = chartB - chartT;

                            var yMin = -2, yMax = 8;
                            for (var k = 0; k < sums.length; k++) {
                                var v = Math.max(-10, Math.min(20, sums[k].val));
                                sums[k].clamped = v;
                            }

                            // Y axis
                            ctx.strokeStyle = viz.colors.grid; ctx.lineWidth = 0.5;
                            ctx.fillStyle = viz.colors.text; ctx.font = '10px -apple-system,sans-serif';
                            ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
                            for (var gy = -2; gy <= 8; gy += 2) {
                                var yy = chartB - (gy - yMin) / (yMax - yMin) * chartH;
                                ctx.beginPath(); ctx.moveTo(chartL, yy); ctx.lineTo(chartR, yy); ctx.stroke();
                                ctx.fillText(gy.toString(), chartL - 6, yy);
                            }

                            // X axis labels
                            ctx.textAlign = 'center'; ctx.textBaseline = 'top';
                            for (var xs = Math.ceil(sigmaMin); xs <= sigmaMax; xs++) {
                                var xp = chartL + (xs - sigmaMin) / (sigmaMax - sigmaMin) * chartW;
                                ctx.fillStyle = viz.colors.text; ctx.font = '10px -apple-system,sans-serif';
                                ctx.fillText('\u03C3=' + xs, xp, chartB + 4);
                            }

                            // Plot
                            ctx.strokeStyle = viz.colors.blue; ctx.lineWidth = 2.5;
                            ctx.beginPath();
                            var started = false;
                            for (var j = 0; j < sums.length; j++) {
                                var px = chartL + j / (nSigma - 1) * chartW;
                                var cv = Math.max(yMin, Math.min(yMax, sums[j].clamped));
                                var py = chartB - (cv - yMin) / (yMax - yMin) * chartH;
                                if (!started) { ctx.moveTo(px, py); started = true; } else ctx.lineTo(px, py);
                            }
                            ctx.stroke();

                            // Mark sigma_c
                            var sc = seriesType === 'alt' ? 0 : 1;
                            var scX = chartL + (sc - sigmaMin) / (sigmaMax - sigmaMin) * chartW;
                            ctx.strokeStyle = viz.colors.red; ctx.lineWidth = 2;
                            ctx.setLineDash([6, 4]);
                            ctx.beginPath(); ctx.moveTo(scX, chartT); ctx.lineTo(scX, chartB); ctx.stroke();
                            ctx.setLineDash([]);
                            viz.screenText('\u03C3\u1D04', scX, chartT - 10, viz.colors.red, 12);

                            viz.screenText('\u03C3', chartR + 10, chartB + 4, viz.colors.text, 12);
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Show that if \\(\\sum a_n n^{-s_0}\\) converges absolutely at \\(s_0\\), then it converges absolutely for all \\(s\\) with \\(\\operatorname{Re}(s) > \\operatorname{Re}(s_0)\\).',
                    hint: 'Use the comparison \\(|a_n n^{-s}| = |a_n| n^{-\\sigma} \\le |a_n| n^{-\\sigma_0}\\) when \\(\\sigma > \\sigma_0\\).',
                    solution: 'For \\(\\sigma = \\operatorname{Re}(s) > \\sigma_0 = \\operatorname{Re}(s_0)\\), we have \\(n^{-\\sigma} \\le n^{-\\sigma_0}\\) for all \\(n \\ge 1\\). So \\(|a_n n^{-s}| = |a_n| n^{-\\sigma} \\le |a_n| n^{-\\sigma_0}\\). Since \\(\\sum |a_n| n^{-\\sigma_0}\\) converges by hypothesis, the comparison test gives absolute convergence at \\(s\\).'
                },
                {
                    question: 'The Dirichlet eta function is \\(\\eta(s) = \\sum_{n=1}^\\infty (-1)^{n-1} / n^s\\). Find \\(\\sigma_c\\) and \\(\\sigma_a\\). Show that \\(\\eta(s) = (1 - 2^{1-s})\\zeta(s)\\) for \\(\\operatorname{Re}(s) > 1\\).',
                    hint: 'For conditional convergence, use the alternating series test. For the identity, write \\(\\zeta(s) - 2 \\cdot 2^{-s} \\zeta(s) = ?\\).',
                    solution: 'The alternating series \\(\\sum (-1)^{n-1}/n^\\sigma\\) converges for \\(\\sigma > 0\\) by the alternating series test (the terms \\(1/n^\\sigma\\) decrease to 0), so \\(\\sigma_c = 0\\). It converges absolutely iff \\(\\sum 1/n^\\sigma\\) converges, so \\(\\sigma_a = 1\\). For the identity: \\(\\eta(s) = \\sum 1/n^s - 2\\sum 1/(2n)^s = \\zeta(s) - 2 \\cdot 2^{-s} \\zeta(s) = (1 - 2^{1-s})\\zeta(s)\\).'
                }
            ]
        },

        // ================================================================
        // SECTION 3: The Euler Product
        // ================================================================
        {
            id: 'sec-euler-product',
            title: 'The Euler Product',
            content: `
<h2>The Euler Product</h2>

<div class="env-block intuition">
    <div class="env-title">Primes Meet Analysis</div>
    <div class="env-body">
        <p>The <strong>fundamental theorem of arithmetic</strong> says every positive integer factors uniquely into primes. The <strong>Euler product</strong> is the analytic translation of this fact. It says that \\(\\zeta(s)\\), which sums over all positive integers, can be written as a product over primes. This is the single most important identity in analytic number theory.</p>
    </div>
</div>

<div class="env-block theorem">
    <div class="env-title">Theorem 3.3 (Euler Product for \\(\\zeta(s)\\))</div>
    <div class="env-body">
        <p>For \\(\\operatorname{Re}(s) > 1\\),</p>
        \\[\\zeta(s) = \\sum_{n=1}^{\\infty} \\frac{1}{n^s} = \\prod_{p \\text{ prime}} \\frac{1}{1 - p^{-s}}.\\]
    </div>
</div>

<div class="env-block proof">
    <div class="env-title">Proof</div>
    <div class="env-body">
        <p>For each prime \\(p\\), the geometric series gives</p>
        \\[\\frac{1}{1 - p^{-s}} = 1 + \\frac{1}{p^s} + \\frac{1}{p^{2s}} + \\frac{1}{p^{3s}} + \\cdots\\]
        <p>provided \\(|p^{-s}| = p^{-\\sigma} < 1\\), which holds for \\(\\sigma > 0\\). Now consider the finite product over primes \\(p \\le P\\):</p>
        \\[\\prod_{p \\le P} \\frac{1}{1 - p^{-s}} = \\prod_{p \\le P} \\left(\\sum_{k=0}^{\\infty} p^{-ks}\\right).\\]
        <p>Expanding the product and using uniqueness of prime factorization, we get</p>
        \\[\\prod_{p \\le P} \\frac{1}{1 - p^{-s}} = \\sum_{\\substack{n \\ge 1 \\\\ p | n \\Rightarrow p \\le P}} \\frac{1}{n^s}.\\]
        <p>The right side sums over all \\(n\\) whose prime factors are all \\(\\le P\\). As \\(P \\to \\infty\\), this exhausts all positive integers, giving</p>
        \\[\\prod_{p} \\frac{1}{1 - p^{-s}} = \\sum_{n=1}^{\\infty} \\frac{1}{n^s} = \\zeta(s).\\]
        <p>The absolute convergence of \\(\\zeta(s)\\) for \\(\\sigma > 1\\) justifies the rearrangement.</p>
    </div>
    <div class="qed">&marker;</div>
</div>

<h3>The General Euler Product</h3>

<div class="env-block theorem">
    <div class="env-title">Theorem 3.4 (Euler Product for Multiplicative Functions)</div>
    <div class="env-body">
        <p>If \\(f\\) is a multiplicative function and \\(\\sum |f(n)| n^{-\\sigma}\\) converges, then</p>
        \\[\\sum_{n=1}^{\\infty} \\frac{f(n)}{n^s} = \\prod_{p} \\left(1 + \\frac{f(p)}{p^s} + \\frac{f(p^2)}{p^{2s}} + \\cdots\\right).\\]
        <p>If \\(f\\) is <em>completely</em> multiplicative (\\(f(mn) = f(m)f(n)\\) for all \\(m, n\\)), the product simplifies to</p>
        \\[\\prod_{p} \\frac{1}{1 - f(p) p^{-s}}.\\]
    </div>
</div>

<div class="env-block example">
    <div class="env-title">Example: Euler Products for Familiar Functions</div>
    <div class="env-body">
        <ul>
            <li>\\(\\mu(n)\\): Since \\(\\mu(p) = -1\\) and \\(\\mu(p^k) = 0\\) for \\(k \\ge 2\\), the Euler product is \\(\\prod_p (1 - p^{-s}) = 1/\\zeta(s)\\).</li>
            <li>\\(\\phi(n)/n\\): Since \\(\\phi\\) is multiplicative with \\(\\phi(p^k) = p^{k-1}(p-1)\\), the Euler product is \\(\\prod_p (1 - p^{-s})/(1 - p^{1-s}) = \\zeta(s-1)/\\zeta(s)\\).</li>
            <li>\\(|\\mu(n)|\\) (the squarefree indicator): \\(\\prod_p (1 + p^{-s}) = \\zeta(s)/\\zeta(2s)\\).</li>
        </ul>
    </div>
</div>

<h3>Why the Euler Product Matters</h3>

<p>The Euler product reveals that <strong>the analytic properties of \\(\\zeta(s)\\) encode information about the primes</strong>. The zeros and poles of \\(\\zeta(s)\\) control the distribution of primes. If \\(\\zeta(s)\\) had no zeros near the line \\(\\operatorname{Re}(s) = 1\\), we could prove the Prime Number Theorem. This is exactly the strategy we will follow in Chapters 6 and 7.</p>

<p>Another immediate consequence: <strong>\\(\\zeta(s) \\ne 0\\) for \\(\\operatorname{Re}(s) > 1\\)</strong>, since each factor \\((1 - p^{-s})^{-1}\\) is nonzero there, and the product converges absolutely.</p>

<div class="viz-placeholder" data-viz="viz-euler-product-assembly"></div>
`,
            visualizations: [
                {
                    id: 'viz-euler-product-assembly',
                    title: 'Euler Product Assembly',
                    description: 'Watch the Euler product build \\(\\zeta(s)\\) one prime at a time. Each factor \\((1-p^{-s})^{-1}\\) contributes the integers whose largest prime factor is \\(p\\). The partial product converges to \\(\\zeta(s)\\).',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 380,
                            originX: 60, originY: 340, scale: 1
                        });

                        var sVal = 2.0;
                        VizEngine.createSlider(controls, 's (real)', 1.1, 4.0, sVal, 0.1, function(v) {
                            sVal = v; draw();
                        });

                        var primes = VizEngine.sievePrimes(100);

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            viz.screenText('Euler Product: \u03B6(' + sVal.toFixed(1) + ') = \u220F (1 - p\u207B\u02E2)\u207B\u00B9', viz.width / 2, 20, viz.colors.white, 14);

                            // Compute partial Euler products
                            var nPrimes = Math.min(25, primes.length);
                            var products = [];
                            var acc = 1;
                            for (var i = 0; i < nPrimes; i++) {
                                acc *= 1 / (1 - Math.pow(primes[i], -sVal));
                                products.push({ p: primes[i], val: acc });
                            }

                            // Also compute zeta directly for comparison
                            var zetaVal = 0;
                            for (var n = 1; n <= 10000; n++) zetaVal += 1 / Math.pow(n, sVal);

                            var chartL = 70, chartR = viz.width - 30;
                            var chartT = 50, chartB = 300;
                            var chartW = chartR - chartL, chartH = chartB - chartT;

                            var yMin = 0.8, yMax = Math.max(zetaVal * 1.15, products[nPrimes - 1].val * 1.1);

                            // Grid
                            ctx.strokeStyle = viz.colors.grid; ctx.lineWidth = 0.5;
                            ctx.fillStyle = viz.colors.text; ctx.font = '10px -apple-system,sans-serif';
                            ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
                            var yStep = Math.max(0.2, Math.round((yMax - yMin) / 5 * 10) / 10);
                            for (var gy = Math.ceil(yMin / yStep) * yStep; gy <= yMax; gy += yStep) {
                                var yy = chartB - (gy - yMin) / (yMax - yMin) * chartH;
                                ctx.beginPath(); ctx.moveTo(chartL, yy); ctx.lineTo(chartR, yy); ctx.stroke();
                                ctx.fillText(gy.toFixed(1), chartL - 6, yy);
                            }

                            // Horizontal line at zeta(s) value
                            var zetaY = chartB - (zetaVal - yMin) / (yMax - yMin) * chartH;
                            ctx.strokeStyle = viz.colors.blue + '66'; ctx.lineWidth = 1;
                            ctx.setLineDash([4, 4]);
                            ctx.beginPath(); ctx.moveTo(chartL, zetaY); ctx.lineTo(chartR, zetaY); ctx.stroke();
                            ctx.setLineDash([]);
                            ctx.fillStyle = viz.colors.blue; ctx.textAlign = 'left';
                            ctx.fillText('\u03B6(' + sVal.toFixed(1) + ') = ' + zetaVal.toFixed(6), chartR - 120, zetaY - 8);

                            // Bar chart of partial products
                            var barW = Math.min(18, chartW / nPrimes - 2);
                            for (var j = 0; j < nPrimes; j++) {
                                var bx = chartL + (j + 0.5) / nPrimes * chartW;
                                var bVal = Math.min(products[j].val, yMax);
                                var by = chartB - (bVal - yMin) / (yMax - yMin) * chartH;
                                var bBase = chartB - (0 - yMin) / (yMax - yMin) * chartH;
                                bBase = chartB;

                                var factor = products[j].val / (j > 0 ? products[j - 1].val : 1);
                                var intensity = Math.min(1, (factor - 1) * 5);
                                var alpha = Math.round(0x44 + intensity * 0x88).toString(16);

                                ctx.fillStyle = viz.colors.teal + alpha;
                                ctx.fillRect(bx - barW / 2, by, barW, bBase - by);
                                ctx.strokeStyle = viz.colors.teal; ctx.lineWidth = 1;
                                ctx.strokeRect(bx - barW / 2, by, barW, bBase - by);

                                // Prime label
                                if (nPrimes <= 20 || j % 2 === 0) {
                                    ctx.fillStyle = viz.colors.text; ctx.font = '9px -apple-system,sans-serif';
                                    ctx.textAlign = 'center'; ctx.textBaseline = 'top';
                                    ctx.fillText(products[j].p.toString(), bx, chartB + 3);
                                }
                            }

                            // Label
                            viz.screenText('primes p', chartR + 10, chartB + 8, viz.colors.text, 10);

                            // Show convergence
                            var last = products[nPrimes - 1].val;
                            var error = Math.abs(zetaVal - last);
                            viz.screenText(
                                'After ' + nPrimes + ' primes: product = ' + last.toFixed(6) + '   error = ' + error.toExponential(2),
                                viz.width / 2, chartB + 40, viz.colors.white, 12
                            );
                            viz.screenText(
                                'Each bar shows the cumulative product \u220F_{p\u2264P} (1-p\u207B\u02E2)\u207B\u00B9',
                                viz.width / 2, chartB + 58, viz.colors.text, 10
                            );
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Prove that \\(\\sum_{n=1}^\\infty \\mu(n)/n^s = 1/\\zeta(s)\\) for \\(\\operatorname{Re}(s) > 1\\) using the Euler product.',
                    hint: 'Compute the Euler product for \\(\\mu\\): since \\(\\mu(p) = -1\\) and \\(\\mu(p^k) = 0\\) for \\(k \\ge 2\\), the local factor at \\(p\\) is \\(1 - p^{-s}\\).',
                    solution: 'The Euler product for \\(\\sum \\mu(n)/n^s\\) is \\(\\prod_p (1 + \\mu(p)p^{-s} + \\mu(p^2)p^{-2s} + \\cdots) = \\prod_p (1 - p^{-s})\\). But \\(\\zeta(s) = \\prod_p (1 - p^{-s})^{-1}\\), so \\(\\sum \\mu(n)/n^s = \\prod_p (1 - p^{-s}) = 1/\\zeta(s)\\).'
                },
                {
                    question: 'Show that \\(\\sum_{n=1}^\\infty d(n)/n^s = \\zeta(s)^2\\) for \\(\\operatorname{Re}(s) > 1\\), where \\(d(n)\\) is the number of divisors of \\(n\\).',
                    hint: 'Use the fact that \\(d = 1 * 1\\) (Dirichlet convolution) and that the Dirichlet series of a convolution is the product of the individual series.',
                    solution: 'Since \\(d(n) = \\sum_{d|n} 1 = (1 * 1)(n)\\), the Dirichlet series is \\(\\sum d(n)/n^s = (\\sum 1/n^s)(\\sum 1/n^s) = \\zeta(s)^2\\). Alternatively, the Euler product: \\(d(p^k) = k+1\\), so the local factor is \\(\\sum_{k=0}^\\infty (k+1)p^{-ks} = (1-p^{-s})^{-2}\\), and the product over \\(p\\) gives \\(\\zeta(s)^2\\).'
                }
            ]
        },

        // ================================================================
        // SECTION 4: Formal Properties
        // ================================================================
        {
            id: 'sec-formal-properties',
            title: 'Formal Properties',
            content: `
<h2>Algebra of Dirichlet Series</h2>

<div class="env-block intuition">
    <div class="env-title">Dirichlet Series as a Ring</div>
    <div class="env-body">
        <p>Dirichlet series can be added, subtracted, and multiplied. The multiplication law is the key surprise: the product of two Dirichlet series corresponds to <strong>Dirichlet convolution</strong> of their coefficients, not pointwise multiplication. This is the reason Dirichlet series are the natural generating functions for multiplicative number theory.</p>
    </div>
</div>

<h3>Multiplication = Dirichlet Convolution</h3>

<div class="env-block theorem">
    <div class="env-title">Theorem 3.5 (Product of Dirichlet Series)</div>
    <div class="env-body">
        <p>If \\(F(s) = \\sum a_n n^{-s}\\) and \\(G(s) = \\sum b_n n^{-s}\\) both converge absolutely, then</p>
        \\[F(s) \\cdot G(s) = \\sum_{n=1}^{\\infty} \\frac{c_n}{n^s}, \\quad \\text{where } c_n = \\sum_{d | n} a_d \\, b_{n/d} = (a * b)(n).\\]
    </div>
</div>

<div class="env-block proof">
    <div class="env-title">Proof</div>
    <div class="env-body">
        <p>Multiply the two series:</p>
        \\[F(s) G(s) = \\left(\\sum_{m=1}^{\\infty} \\frac{a_m}{m^s}\\right) \\left(\\sum_{k=1}^{\\infty} \\frac{b_k}{k^s}\\right) = \\sum_{m,k \\ge 1} \\frac{a_m b_k}{(mk)^s}.\\]
        <p>Since both series converge absolutely, we can rearrange freely. Collecting terms with \\(mk = n\\), i.e., \\(m = d\\), \\(k = n/d\\) for each divisor \\(d\\) of \\(n\\):</p>
        \\[F(s) G(s) = \\sum_{n=1}^{\\infty} \\frac{1}{n^s} \\sum_{d | n} a_d \\, b_{n/d} = \\sum_{n=1}^{\\infty} \\frac{(a * b)(n)}{n^s}.\\]
    </div>
    <div class="qed">&marker;</div>
</div>

<p>This theorem has powerful consequences. Every identity involving Dirichlet convolution immediately becomes an identity among Dirichlet series:</p>

<div class="env-block example">
    <div class="env-title">Example: Mobius Inversion via Dirichlet Series</div>
    <div class="env-body">
        <p>The Mobius inversion formula \\(g = f * 1 \\Leftrightarrow f = g * \\mu\\) is the statement that \\(1/\\zeta(s)\\) is the Dirichlet series for \\(\\mu\\). If \\(G(s) = F(s) \\zeta(s)\\), then \\(F(s) = G(s) / \\zeta(s) = G(s) \\cdot \\sum \\mu(n)/n^s\\).</p>
    </div>
</div>

<h3>The Logarithmic Derivative</h3>

<div class="env-block theorem">
    <div class="env-title">Theorem 3.6 (Logarithmic Derivative of \\(\\zeta(s)\\))</div>
    <div class="env-body">
        <p>For \\(\\operatorname{Re}(s) > 1\\),</p>
        \\[-\\frac{\\zeta'(s)}{\\zeta(s)} = \\sum_{n=1}^{\\infty} \\frac{\\Lambda(n)}{n^s}\\]
        <p>where \\(\\Lambda\\) is the von Mangoldt function.</p>
    </div>
</div>

<div class="env-block proof">
    <div class="env-title">Proof</div>
    <div class="env-body">
        <p>Taking the logarithm of the Euler product:</p>
        \\[\\log \\zeta(s) = -\\sum_p \\log(1 - p^{-s}) = \\sum_p \\sum_{k=1}^{\\infty} \\frac{p^{-ks}}{k} = \\sum_p \\sum_{k=1}^{\\infty} \\frac{1}{k \\cdot p^{ks}}.\\]
        <p>Differentiating with respect to \\(s\\):</p>
        \\[\\frac{\\zeta'(s)}{\\zeta(s)} = -\\sum_p \\sum_{k=1}^{\\infty} \\frac{\\log p}{p^{ks}} = -\\sum_{n=1}^{\\infty} \\frac{\\Lambda(n)}{n^s}\\]
        <p>since \\(\\Lambda(p^k) = \\log p\\) and \\(\\Lambda(n) = 0\\) if \\(n\\) is not a prime power.</p>
    </div>
    <div class="qed">&marker;</div>
</div>

<p>The identity \\(-\\zeta'/\\zeta = \\sum \\Lambda(n)/n^s\\) is one of the most important in the subject. It connects the <em>zeros</em> of \\(\\zeta(s)\\) (which appear as poles of \\(-\\zeta'/\\zeta\\)) to the distribution of primes (encoded in \\(\\Lambda\\)).</p>

<div class="env-block remark">
    <div class="env-title">Formal Inverse</div>
    <div class="env-body">
        <p>If \\(F(s) = \\sum a_n n^{-s}\\) with \\(a_1 \\ne 0\\), the series has a formal Dirichlet-series inverse \\(1/F(s) = \\sum b_n n^{-s}\\) where \\(b_1 = 1/a_1\\) and the \\(b_n\\) are determined recursively by \\((a * b)(n) = \\delta_n\\) (the identity for convolution). For \\(\\zeta(s)\\), this inverse is \\(\\sum \\mu(n)/n^s\\).</p>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-log-derivative"></div>
`,
            visualizations: [
                {
                    id: 'viz-log-derivative',
                    title: 'The Logarithmic Derivative \\(-\\zeta\'(s)/\\zeta(s)\\)',
                    description: 'Plot the function \\(-\\zeta\'(s)/\\zeta(s)\\) for real \\(s > 1\\). The partial sums \\(\\sum_{n \\le N} \\Lambda(n)/n^s\\) approximate it. The von Mangoldt function concentrates on prime powers.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 380,
                            originX: 60, originY: 340, scale: 1
                        });

                        var NVal = 200;
                        VizEngine.createSlider(controls, 'N (terms)', 20, 500, NVal, 10, function(v) {
                            NVal = Math.round(v); draw();
                        });

                        var primes = VizEngine.sievePrimes(600);

                        function vonMangoldt(n) {
                            if (n <= 1) return 0;
                            for (var i = 0; i < primes.length; i++) {
                                var p = primes[i];
                                if (p * p > n) break;
                                if (n % p === 0) {
                                    // Check if n is a power of p
                                    var m = n;
                                    while (m % p === 0) m /= p;
                                    return m === 1 ? Math.log(p) : 0;
                                }
                            }
                            // n is prime
                            return Math.log(n);
                        }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            viz.screenText('-\u03B6\'(s)/\u03B6(s) = \u03A3 \u039B(n)/n\u02E2  (N = ' + NVal + ')', viz.width / 2, 20, viz.colors.white, 13);

                            var chartL = 70, chartR = viz.width - 30;
                            var chartT = 50, chartB = 310;
                            var chartW = chartR - chartL, chartH = chartB - chartT;

                            var sigmaMin = 1.05, sigmaMax = 4.0;
                            var nPts = 60;

                            // Compute -zeta'/zeta via partial sums
                            var values = [];
                            for (var i = 0; i < nPts; i++) {
                                var sigma = sigmaMin + (sigmaMax - sigmaMin) * i / (nPts - 1);
                                var acc = 0;
                                for (var n = 1; n <= NVal; n++) {
                                    var lam = vonMangoldt(n);
                                    if (lam > 0) acc += lam / Math.pow(n, sigma);
                                }
                                values.push({ sigma: sigma, val: acc });
                            }

                            var yMin = 0, yMax = Math.max.apply(null, values.map(function(v) { return v.val; })) * 1.1;
                            if (yMax < 1) yMax = 5;

                            // Grid
                            ctx.strokeStyle = viz.colors.grid; ctx.lineWidth = 0.5;
                            ctx.fillStyle = viz.colors.text; ctx.font = '10px -apple-system,sans-serif';
                            ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
                            var yStep = Math.max(1, Math.round((yMax - yMin) / 5));
                            for (var gy = 0; gy <= yMax; gy += yStep) {
                                var yy = chartB - (gy - yMin) / (yMax - yMin) * chartH;
                                ctx.beginPath(); ctx.moveTo(chartL, yy); ctx.lineTo(chartR, yy); ctx.stroke();
                                ctx.fillText(gy.toFixed(0), chartL - 6, yy);
                            }

                            // X axis
                            ctx.textAlign = 'center'; ctx.textBaseline = 'top';
                            for (var xs = Math.ceil(sigmaMin); xs <= sigmaMax; xs++) {
                                var xp = chartL + (xs - sigmaMin) / (sigmaMax - sigmaMin) * chartW;
                                ctx.fillText('\u03C3=' + xs, xp, chartB + 4);
                            }

                            // Plot
                            ctx.strokeStyle = viz.colors.purple; ctx.lineWidth = 2.5;
                            ctx.beginPath();
                            for (var j = 0; j < values.length; j++) {
                                var px = chartL + j / (nPts - 1) * chartW;
                                var py = chartB - (Math.min(values[j].val, yMax) - yMin) / (yMax - yMin) * chartH;
                                if (j === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
                            }
                            ctx.stroke();

                            // Annotation
                            viz.screenText('-\u03B6\'/\u03B6 \u2192 \u221E as \u03C3 \u2192 1\u207A (pole of \u03B6 at s=1)', viz.width / 2, chartB + 35, viz.colors.purple, 11);
                            viz.screenText('The pole encodes \u03C0(x) ~ x/ln(x)', viz.width / 2, chartB + 52, viz.colors.text, 10);
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Show that the Dirichlet series for \\(\\sigma(n) = \\sum_{d|n} d\\) is \\(\\zeta(s)\\zeta(s-1)\\). What is the abscissa of convergence?',
                    hint: 'Write \\(\\sigma = \\mathrm{id} * 1\\) where \\(\\mathrm{id}(n) = n\\). What is the Dirichlet series for \\(\\mathrm{id}(n)\\)?',
                    solution: 'Since \\(\\sigma(n) = \\sum_{d|n} d = (\\mathrm{id} * 1)(n)\\), the Dirichlet series is \\(\\sum \\sigma(n)/n^s = (\\sum n/n^s)(\\sum 1/n^s) = \\zeta(s-1)\\zeta(s)\\). The series \\(\\zeta(s-1)\\) converges for \\(\\operatorname{Re}(s) > 2\\), so \\(\\sigma_c = 2\\).'
                },
                {
                    question: 'Verify that \\(-\\zeta\'(s)/\\zeta(s) = \\sum \\Lambda(n)/n^s\\) can also be derived from the identity \\(\\Lambda = \\mu * \\log\\) (Dirichlet convolution of \\(\\mu\\) and \\(\\log\\)).',
                    hint: 'What is the Dirichlet series for \\(f(n) = \\log n\\)? Differentiate \\(\\zeta(s)\\) to find it.',
                    solution: 'The Dirichlet series for \\(\\log n\\) is \\(-\\zeta\'(s) = \\sum (\\log n)/n^s\\). So \\(\\sum \\Lambda(n)/n^s = \\sum (\\mu * \\log)(n)/n^s = (\\sum \\mu(n)/n^s)(\\sum (\\log n)/n^s) = (1/\\zeta(s))(-\\zeta\'(s)) = -\\zeta\'(s)/\\zeta(s)\\).'
                }
            ]
        },

        // ================================================================
        // SECTION 5: Uniqueness
        // ================================================================
        {
            id: 'sec-uniqueness',
            title: 'Uniqueness',
            content: `
<h2>Uniqueness of Dirichlet Series</h2>

<div class="env-block intuition">
    <div class="env-title">Can Two Different Functions Share a Series?</div>
    <div class="env-body">
        <p>If two arithmetic functions \\(f\\) and \\(g\\) produce the same Dirichlet series \\(\\sum f(n)/n^s = \\sum g(n)/n^s\\) in some half-plane, must \\(f = g\\)? The answer is <strong>yes</strong>, and this is not obvious. The proof relies on the fact that the functions \\(n^{-s}\\) are "independent" as functions of \\(s\\).</p>
    </div>
</div>

<div class="env-block theorem">
    <div class="env-title">Theorem 3.7 (Uniqueness Theorem for Dirichlet Series)</div>
    <div class="env-body">
        <p>Suppose \\(\\sum a_n n^{-s} = \\sum b_n n^{-s}\\) for all \\(s\\) in some half-plane \\(\\operatorname{Re}(s) > \\sigma_0\\). Then \\(a_n = b_n\\) for all \\(n \\ge 1\\).</p>
    </div>
</div>

<div class="env-block proof">
    <div class="env-title">Proof</div>
    <div class="env-body">
        <p>Let \\(c_n = a_n - b_n\\), so \\(\\sum c_n n^{-s} = 0\\) for \\(\\operatorname{Re}(s) > \\sigma_0\\). We want \\(c_n = 0\\) for all \\(n\\).</p>
        <p>Suppose not, and let \\(N\\) be the smallest index with \\(c_N \\ne 0\\). Then</p>
        \\[0 = \\sum_{n=N}^{\\infty} \\frac{c_n}{n^s} = \\frac{c_N}{N^s} + \\sum_{n=N+1}^{\\infty} \\frac{c_n}{n^s}.\\]
        <p>Multiply through by \\(N^s\\):</p>
        \\[c_N = -\\sum_{n=N+1}^{\\infty} c_n \\left(\\frac{N}{n}\\right)^s.\\]
        <p>As \\(\\sigma = \\operatorname{Re}(s) \\to +\\infty\\), each term \\((N/n)^s \\to 0\\) since \\(N/n < 1\\). The right side tends to 0, forcing \\(c_N = 0\\), a contradiction.</p>
    </div>
    <div class="qed">&marker;</div>
</div>

<div class="env-block remark">
    <div class="env-title">Analogy with Power Series</div>
    <div class="env-body">
        <p>For power series, uniqueness follows from the identity theorem of complex analysis (or simply by evaluating derivatives at the origin). For Dirichlet series, the proof is more elementary but uses a different trick: sending \\(\\sigma \\to +\\infty\\) to isolate individual coefficients.</p>
    </div>
</div>

<h3>Consequences</h3>

<p>Uniqueness means that identities between Dirichlet series immediately translate into identities between arithmetic functions. For instance, from \\(\\zeta(s)^2 = \\sum d(n)/n^s\\) and the uniqueness theorem, we can conclude \\(d = 1 * 1\\) without any direct combinatorial argument.</p>

<p>Uniqueness also justifies the "formal" manipulations we have been doing: if we derive an identity by algebraic manipulation of convergent Dirichlet series, the resulting coefficient identity holds for all \\(n\\).</p>

<div class="viz-placeholder" data-viz="viz-spiral-partial-sums"></div>
`,
            visualizations: [
                {
                    id: 'viz-spiral-partial-sums',
                    title: 'Partial Sums of \\(n^{-s}\\) in the Complex Plane',
                    description: 'For complex \\(s = \\sigma + it\\), the terms \\(n^{-s} = n^{-\\sigma} e^{-it \\log n}\\) are complex numbers that spiral as \\(n\\) grows. Watch the partial sums \\(\\sum_{n=1}^{N} n^{-s}\\) trace a path in \\(\\mathbb{C}\\). Convergence means the path settles to a limit.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 400,
                            originX: 280, originY: 200, scale: 80
                        });

                        var sigma = 1.5;
                        var tVal = 5.0;
                        var NVal = 80;

                        VizEngine.createSlider(controls, '\u03C3 (Re)', 0.6, 3.0, sigma, 0.1, function(v) {
                            sigma = v; draw();
                        });
                        VizEngine.createSlider(controls, 't (Im)', 0, 20, tVal, 0.5, function(v) {
                            tVal = v; draw();
                        });
                        VizEngine.createSlider(controls, 'N', 10, 200, NVal, 5, function(v) {
                            NVal = Math.round(v); draw();
                        });

                        function draw() {
                            viz.clear();
                            viz.drawGrid(0.5);
                            viz.drawAxes();
                            var ctx = viz.ctx;

                            viz.screenText('Partial sums of \u03B6(' + sigma.toFixed(1) + ' + ' + tVal.toFixed(1) + 'i)  in \u2102', viz.width / 2, 15, viz.colors.white, 13);

                            // Compute partial sums
                            var sumRe = 0, sumIm = 0;
                            var points = [{ re: 0, im: 0 }];
                            for (var n = 1; n <= NVal; n++) {
                                var mag = Math.pow(n, -sigma);
                                var angle = -tVal * Math.log(n);
                                sumRe += mag * Math.cos(angle);
                                sumIm += mag * Math.sin(angle);
                                points.push({ re: sumRe, im: sumIm });
                            }

                            // Draw path
                            ctx.strokeStyle = viz.colors.blue + '88'; ctx.lineWidth = 1;
                            ctx.beginPath();
                            for (var i = 0; i < points.length; i++) {
                                var pt = viz.toScreen(points[i].re, points[i].im);
                                if (i === 0) ctx.moveTo(pt[0], pt[1]); else ctx.lineTo(pt[0], pt[1]);
                            }
                            ctx.stroke();

                            // Draw individual term vectors for first few
                            var limit = Math.min(15, NVal);
                            for (var j = 0; j < limit; j++) {
                                var p1 = points[j], p2 = points[j + 1];
                                var alpha = Math.max(0x22, Math.round(0xFF * (1 - j / limit)));
                                ctx.strokeStyle = viz.colors.teal + alpha.toString(16).padStart(2, '0');
                                ctx.lineWidth = 1.5;
                                ctx.beginPath();
                                var s1 = viz.toScreen(p1.re, p1.im);
                                var s2 = viz.toScreen(p2.re, p2.im);
                                ctx.moveTo(s1[0], s1[1]);
                                ctx.lineTo(s2[0], s2[1]);
                                ctx.stroke();
                            }

                            // Mark the final partial sum
                            var final = points[points.length - 1];
                            viz.drawPoint(final.re, final.im, viz.colors.orange, null, 5);

                            // Label
                            viz.screenText(
                                'S_N = ' + final.re.toFixed(4) + ' + ' + final.im.toFixed(4) + 'i',
                                viz.width / 2, viz.height - 15, viz.colors.orange, 12
                            );

                            // Origin
                            viz.drawPoint(0, 0, viz.colors.white, 'O', 3);
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Use the uniqueness theorem to prove that if \\(f\\) is completely multiplicative and \\(\\sum f(n)/n^s\\) converges absolutely in some half-plane, then \\(f(1) = 1\\).',
                    hint: 'Compare the Dirichlet series with itself after applying the Euler product. What does the constant term tell you?',
                    solution: 'The Euler product gives \\(\\sum f(n)/n^s = \\prod_p (1 - f(p)p^{-s})^{-1}\\). Evaluating the product at \\(s \\to +\\infty\\): each factor \\(\\to 1\\), so the product \\(\\to 1\\). But the Dirichlet series \\(\\to f(1)\\) (all terms with \\(n > 1\\) vanish). By uniqueness (or directly), \\(f(1) = 1\\).'
                }
            ]
        },

        // ================================================================
        // SECTION 6: Bridge to Zeta
        // ================================================================
        {
            id: 'sec-bridge',
            title: 'Enter \u03B6(s)',
            content: `
<h2>Enter \\(\\zeta(s)\\): The Bridge to Prime Distribution</h2>

<div class="env-block intuition">
    <div class="env-title">Where We Stand</div>
    <div class="env-body">
        <p>We have built the algebraic and analytic framework of Dirichlet series. Let us now focus on the single most important example: \\(\\zeta(s) = \\sum 1/n^s\\). We collect everything we know and preview what comes next.</p>
    </div>
</div>

<h3>What We Know About \\(\\zeta(s)\\) So Far</h3>

<div class="env-block theorem">
    <div class="env-title">Summary: Properties of \\(\\zeta(s)\\) for \\(\\operatorname{Re}(s) > 1\\)</div>
    <div class="env-body">
        <ol>
            <li><strong>Convergence:</strong> \\(\\zeta(s) = \\sum 1/n^s\\) converges absolutely for \\(\\operatorname{Re}(s) > 1\\).</li>
            <li><strong>Euler product:</strong> \\(\\zeta(s) = \\prod_p (1 - p^{-s})^{-1}\\).</li>
            <li><strong>Non-vanishing:</strong> \\(\\zeta(s) \\ne 0\\) for \\(\\operatorname{Re}(s) > 1\\).</li>
            <li><strong>Pole at \\(s = 1\\):</strong> \\(\\zeta(s)\\) has a simple pole at \\(s = 1\\) with residue 1. This follows from comparison with \\(\\int_1^\\infty x^{-s} dx = 1/(s-1)\\).</li>
            <li><strong>Logarithmic derivative:</strong> \\(-\\zeta'(s)/\\zeta(s) = \\sum \\Lambda(n)/n^s\\).</li>
        </ol>
    </div>
</div>

<h3>The Pole at \\(s = 1\\) and the Infinitude of Primes</h3>

<div class="env-block theorem">
    <div class="env-title">Theorem 3.8 (Euler's Proof Revisited)</div>
    <div class="env-body">
        <p>There are infinitely many primes.</p>
    </div>
</div>

<div class="env-block proof">
    <div class="env-title">Proof (via the Euler product)</div>
    <div class="env-body">
        <p>Suppose there are only finitely many primes \\(p_1, \\ldots, p_k\\). Then the Euler product</p>
        \\[\\zeta(s) = \\prod_{i=1}^{k} \\frac{1}{1 - p_i^{-s}}\\]
        <p>would be a finite product of functions holomorphic and nonzero at \\(s = 1\\). In particular, \\(\\zeta(1)\\) would be a finite number. But \\(\\zeta(s) \\to +\\infty\\) as \\(s \\to 1^+\\) (since the harmonic series diverges), contradiction.</p>
    </div>
    <div class="qed">&marker;</div>
</div>

<p>This is Euler's famous analytic proof of the infinitude of primes (1737). It goes far beyond Euclid's proof because it is <em>quantitative</em>: the rate at which \\(\\zeta(s) \\to \\infty\\) as \\(s \\to 1^+\\) encodes how dense the primes are.</p>

<h3>A Quantitative Statement</h3>

<div class="env-block theorem">
    <div class="env-title">Theorem 3.9 (Sum over Primes)</div>
    <div class="env-body">
        <p>\\[\\sum_p \\frac{1}{p^s} = \\log\\frac{1}{s-1} + M + O(s-1) \\quad \\text{as } s \\to 1^+\\]</p>
        <p>where \\(M\\) is Mertens' constant. In particular, \\(\\sum 1/p\\) diverges, confirming that primes are "not too sparse."</p>
    </div>
</div>

<div class="env-block proof">
    <div class="env-title">Proof Sketch</div>
    <div class="env-body">
        <p>From the Euler product, \\(\\log \\zeta(s) = -\\sum_p \\log(1 - p^{-s}) = \\sum_p p^{-s} + O(1)\\) for \\(s\\) near 1 (the higher-order terms \\(p^{-2s}/2 + \\cdots\\) converge). Since \\(\\zeta(s) \\sim 1/(s-1)\\), we get \\(\\log \\zeta(s) \\sim \\log 1/(s-1)\\), hence \\(\\sum_p p^{-s} \\sim \\log 1/(s-1)\\).</p>
    </div>
    <div class="qed">&marker;</div>
</div>

<h3>What Comes Next</h3>

<p>This is just the beginning. The Dirichlet series representation of \\(\\zeta(s)\\) converges only for \\(\\operatorname{Re}(s) > 1\\), but the really interesting things happen at and to the left of the line \\(\\operatorname{Re}(s) = 1\\). In the next chapter, we will:</p>

<ol>
    <li>Extend \\(\\zeta(s)\\) to all of \\(\\mathbb{C}\\) by <strong>analytic continuation</strong>.</li>
    <li>Establish the <strong>functional equation</strong> \\(\\xi(s) = \\xi(1-s)\\).</li>
    <li>Study the <strong>zeros</strong> of \\(\\zeta(s)\\), which control the error in the Prime Number Theorem.</li>
</ol>

<p>The bridge between primes and analysis is now fully constructed. The rest of the course is about crossing it.</p>

<div class="viz-placeholder" data-viz="viz-spiral-partial-sums-zeta"></div>
`,
            visualizations: [
                {
                    id: 'viz-spiral-partial-sums-zeta',
                    title: 'The Pole of \\(\\zeta(s)\\) at \\(s = 1\\)',
                    description: 'Watch \\(\\zeta(s)\\) blow up as \\(s \\to 1^+\\) along the real axis. The Euler product perspective: each prime factor \\((1-p^{-s})^{-1}\\) contributes a finite but growing amount. Drag \\(s\\) toward 1 to see the divergence.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 380,
                            originX: 80, originY: 300, scale: 1
                        });

                        var sVal = 1.5;
                        VizEngine.createSlider(controls, 's', 1.01, 3.0, sVal, 0.01, function(v) {
                            sVal = v; draw();
                        });

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            viz.screenText('\u03B6(s) near s = 1: divergence and the pole', viz.width / 2, 20, viz.colors.white, 14);

                            var chartL = 90, chartR = viz.width - 30;
                            var chartT = 50, chartB = 280;
                            var chartW = chartR - chartL, chartH = chartB - chartT;

                            // Plot zeta(s) for s in [1.01, 3]
                            var nPts = 100;
                            var sMin = 1.01, sMax = 3.0;
                            var values = [];
                            for (var i = 0; i < nPts; i++) {
                                var s = sMin + (sMax - sMin) * i / (nPts - 1);
                                // Approximate zeta(s) via partial sum
                                var z = 0;
                                for (var n = 1; n <= 5000; n++) z += 1 / Math.pow(n, s);
                                values.push({ s: s, z: z });
                            }

                            // Also 1/(s-1) for comparison
                            var yMax = 20;
                            var yMin = 0;

                            // Grid
                            ctx.strokeStyle = viz.colors.grid; ctx.lineWidth = 0.5;
                            ctx.fillStyle = viz.colors.text; ctx.font = '10px -apple-system,sans-serif';
                            ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
                            for (var gy = 0; gy <= yMax; gy += 5) {
                                var yy = chartB - (gy / yMax) * chartH;
                                ctx.beginPath(); ctx.moveTo(chartL, yy); ctx.lineTo(chartR, yy); ctx.stroke();
                                ctx.fillText(gy.toString(), chartL - 6, yy);
                            }

                            // X axis
                            ctx.textAlign = 'center'; ctx.textBaseline = 'top';
                            for (var xs = 1; xs <= 3; xs += 0.5) {
                                var xp = chartL + (xs - sMin) / (sMax - sMin) * chartW;
                                ctx.fillText(xs.toFixed(1), xp, chartB + 4);
                            }

                            // Plot 1/(s-1)
                            ctx.strokeStyle = viz.colors.text + '66'; ctx.lineWidth = 1;
                            ctx.setLineDash([4, 4]);
                            ctx.beginPath();
                            for (var j = 0; j < nPts; j++) {
                                var ss = values[j].s;
                                var approx = 1 / (ss - 1);
                                var px = chartL + j / (nPts - 1) * chartW;
                                var py = chartB - Math.min(approx, yMax) / yMax * chartH;
                                if (j === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
                            }
                            ctx.stroke();
                            ctx.setLineDash([]);

                            // Plot zeta
                            ctx.strokeStyle = viz.colors.blue; ctx.lineWidth = 2.5;
                            ctx.beginPath();
                            for (var k = 0; k < nPts; k++) {
                                var px2 = chartL + k / (nPts - 1) * chartW;
                                var py2 = chartB - Math.min(values[k].z, yMax) / yMax * chartH;
                                if (k === 0) ctx.moveTo(px2, py2); else ctx.lineTo(px2, py2);
                            }
                            ctx.stroke();

                            // Mark current s
                            var curX = chartL + (sVal - sMin) / (sMax - sMin) * chartW;
                            var curZ = 0;
                            for (var m = 1; m <= 5000; m++) curZ += 1 / Math.pow(m, sVal);
                            var curY = chartB - Math.min(curZ, yMax) / yMax * chartH;

                            ctx.strokeStyle = viz.colors.orange; ctx.lineWidth = 1;
                            ctx.setLineDash([3, 3]);
                            ctx.beginPath(); ctx.moveTo(curX, chartB); ctx.lineTo(curX, curY); ctx.stroke();
                            ctx.setLineDash([]);
                            viz.drawScreenPoint(curX, curY, viz.colors.orange, 5);

                            // Legend
                            var ly = chartB + 28;
                            ctx.font = '11px -apple-system,sans-serif'; ctx.textAlign = 'left';
                            ctx.fillStyle = viz.colors.blue;
                            ctx.fillRect(chartL, ly, 14, 3);
                            ctx.fillText('\u03B6(s)', chartL + 18, ly + 4);

                            ctx.fillStyle = viz.colors.text;
                            ctx.fillRect(chartL + 80, ly, 14, 3);
                            ctx.fillText('1/(s\u22121)', chartL + 98, ly + 4);

                            // Current value
                            viz.screenText(
                                's = ' + sVal.toFixed(2) + '   \u03B6(s) \u2248 ' + curZ.toFixed(4) +
                                '   1/(s\u22121) = ' + (1 / (sVal - 1)).toFixed(4),
                                viz.width / 2, ly + 24, viz.colors.orange, 12
                            );
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Show that \\(\\sum_p 1/p^2\\) converges. What does this say about the density of primes?',
                    hint: 'Compare with \\(\\sum 1/n^2\\), or use the fact that \\(\\zeta(2) < \\infty\\) and the Euler product.',
                    solution: 'From the Euler product, \\(\\log \\zeta(s) = \\sum_p \\sum_{k=1}^\\infty p^{-ks}/k\\). At \\(s = 2\\), \\(\\zeta(2) = \\pi^2/6 < \\infty\\), so \\(\\log \\zeta(2) < \\infty\\). Since \\(\\sum_p p^{-2} \\le \\log \\zeta(2)\\), it converges. This means primes are sparse enough that the sum of their reciprocal squares converges, even though \\(\\sum 1/p\\) diverges.'
                },
                {
                    question: 'Use the Euler product to show that \\(\\prod_p (1 - 1/p) = 0\\). Interpret this probabilistically.',
                    hint: 'Take the reciprocal: \\(\\prod_p (1-1/p)^{-1} = \\zeta(1) = +\\infty\\).',
                    solution: 'We have \\(\\prod_{p \\le P} (1 - 1/p)^{-1} = \\sum_{\\substack{n: p|n \\Rightarrow p \\le P}} 1/n \\to \\zeta(1) = +\\infty\\). So \\(\\prod_p (1 - 1/p) = 0\\). Probabilistically: if you independently remove multiples of each prime \\(p\\) with probability \\(1/p\\), the probability that a random integer "survives" all sieving is \\(\\prod (1-1/p) = 0\\). This is consistent with the fact that the only integer not divisible by any prime is 1, which has density 0.'
                }
            ]
        }
    ]
});
