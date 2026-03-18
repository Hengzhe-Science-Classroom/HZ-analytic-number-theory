// === Chapter 4: The Riemann Zeta Function ===
window.CHAPTERS = window.CHAPTERS || [];
window.CHAPTERS.push({
    id: 'ch04',
    number: 4,
    title: 'The Riemann Zeta Function',
    subtitle: 'The master key to the distribution of primes',
    sections: [
        // ================================================================
        // SECTION 1: Motivation
        // ================================================================
        {
            id: 'sec-motivation',
            title: 'Motivation',
            content: `
<h2>Why the Zeta Function?</h2>

<div class="env-block intuition">
    <div class="env-title">The Central Mystery</div>
    <div class="env-body">
        <p>The primes 2, 3, 5, 7, 11, 13, ... appear to be scattered chaotically among the integers. Yet their distribution hides astonishing regularity. The key to unlocking this regularity is a single function of a complex variable: the Riemann zeta function \\(\\zeta(s)\\).</p>
    </div>
</div>

<p>In Chapter 3, we saw that Dirichlet series encode arithmetic information. The most important Dirichlet series is the simplest one:</p>

\\[
\\zeta(s) = \\sum_{n=1}^{\\infty} \\frac{1}{n^s}, \\qquad \\operatorname{Re}(s) > 1.
\\]

<p>This series converges absolutely for \\(\\operatorname{Re}(s) > 1\\), and its Euler product</p>

\\[
\\zeta(s) = \\prod_{p \\text{ prime}} \\frac{1}{1 - p^{-s}}, \\qquad \\operatorname{Re}(s) > 1,
\\]

<p>directly connects \\(\\zeta(s)\\) to the prime numbers. As Euler already understood: <em>the product runs over primes, but the sum runs over all integers</em>. This duality is the engine of analytic number theory.</p>

<div class="env-block theorem">
    <div class="env-title">Theorem 4.1 (Euler, 1737)</div>
    <div class="env-body">
        <p>The identity \\(\\zeta(s) = \\prod_p (1 - p^{-s})^{-1}\\) holds for \\(\\operatorname{Re}(s) > 1\\). In particular, \\(\\zeta(s) \\neq 0\\) in this region.</p>
    </div>
</div>

<p>The non-vanishing is crucial: if \\(\\zeta(s)\\) never vanishes for \\(\\operatorname{Re}(s) > 1\\), then \\(\\log \\zeta(s)\\) makes sense in that half-plane, and we can take logarithmic derivatives to extract information about primes. The entire Prime Number Theorem program (Chapters 6 and 7) rests on understanding where \\(\\zeta(s)\\) can and cannot vanish.</p>

<h3>Riemann's 1859 Memoir</h3>

<p>In his only paper on number theory, Riemann made a conceptual leap that transformed the subject. He proposed studying \\(\\zeta(s)\\) as a function of a <em>complex</em> variable \\(s = \\sigma + it\\), extending it beyond the region of convergence \\(\\sigma > 1\\) to the entire complex plane (except for a single pole at \\(s = 1\\)). He showed that the distribution of primes is governed by the <em>zeros</em> of this extended function.</p>

<div class="env-block remark">
    <div class="env-title">Roadmap for This Chapter</div>
    <div class="env-body">
        <p>We will:</p>
        <ol>
            <li>Study \\(\\zeta(s)\\) for real \\(s > 1\\), establishing basic properties.</li>
            <li>Extend to the strip \\(0 < \\operatorname{Re}(s) \\leq 1\\) using the Dirichlet eta function.</li>
            <li>Examine the pole at \\(s = 1\\) and its Laurent expansion.</li>
            <li>Compute special values: \\(\\zeta(2), \\zeta(4), \\zeta(2k)\\) and the trivial zeros.</li>
            <li>Introduce the Gamma function and the xi function \\(\\xi(s)\\), previewing the functional equation.</li>
        </ol>
    </div>
</div>
`,
            visualizations: [],
            exercises: []
        },

        // ================================================================
        // SECTION 2: The Half-Plane Re(s) > 1
        // ================================================================
        {
            id: 'sec-half-plane',
            title: 'The Half-Plane Re(s) > 1',
            content: `
<h2>\\(\\zeta(s)\\) for \\(\\operatorname{Re}(s) > 1\\)</h2>

<p>For real \\(s > 1\\), the zeta function is an ordinary convergent series of positive terms. We can evaluate it numerically and study its behavior as \\(s \\to 1^+\\) and as \\(s \\to \\infty\\).</p>

<div class="env-block definition">
    <div class="env-title">Definition (Riemann Zeta Function, Initial Domain)</div>
    <div class="env-body">
        <p>For \\(\\operatorname{Re}(s) > 1\\), the <strong>Riemann zeta function</strong> is</p>
        \\[\\zeta(s) = \\sum_{n=1}^{\\infty} \\frac{1}{n^s}.\\]
        <p>The series converges absolutely and uniformly on compact subsets of \\(\\{s \\in \\mathbb{C} : \\operatorname{Re}(s) > 1\\}\\).</p>
    </div>
</div>

<h3>Basic Properties on the Real Line</h3>

<p>For real \\(s > 1\\):</p>
<ul>
    <li>\\(\\zeta(s)\\) is a strictly decreasing function of \\(s\\).</li>
    <li>\\(\\zeta(s) \\to \\infty\\) as \\(s \\to 1^+\\) (the harmonic series diverges).</li>
    <li>\\(\\zeta(s) \\to 1\\) as \\(s \\to \\infty\\) (only the \\(n=1\\) term survives).</li>
</ul>

<div class="env-block theorem">
    <div class="env-title">Theorem 4.2 (Integral Comparison)</div>
    <div class="env-body">
        <p>For \\(s > 1\\),</p>
        \\[\\frac{1}{s-1} < \\zeta(s) - 1 < \\frac{1}{s-1} + 1 - \\frac{1}{2^{s-1}}.\\]
        <p>In particular, \\(\\zeta(s) \\sim \\frac{1}{s-1}\\) as \\(s \\to 1^+\\).</p>
    </div>
</div>

<p><em>Proof sketch.</em> Compare \\(\\sum_{n=2}^{\\infty} n^{-s}\\) with the integral \\(\\int_1^{\\infty} x^{-s}\\,dx = \\frac{1}{s-1}\\). Since \\(f(x) = x^{-s}\\) is decreasing, the sum is between the integral from 1 to \\(\\infty\\) and the integral from 2 to \\(\\infty\\) plus \\(f(2)\\).</p>

<div class="viz-placeholder" data-viz="viz-zeta-real-line"></div>

<h3>Absolute Convergence</h3>

<p>For complex \\(s = \\sigma + it\\) with \\(\\sigma > 1\\), we have \\(|n^{-s}| = n^{-\\sigma}\\), so the series converges absolutely. The convergence is <em>not</em> absolute for \\(\\sigma \\leq 1\\), and the series does not converge at all for \\(\\sigma \\leq 0\\) (the terms do not tend to zero in modulus). Extending \\(\\zeta(s)\\) beyond \\(\\sigma = 1\\) requires a different approach.</p>
`,
            visualizations: [
                {
                    id: 'viz-zeta-real-line',
                    title: 'Zeta on the Real Line',
                    description: 'The graph of zeta(s) for real s > 1. Watch the blow-up as s approaches 1 (the harmonic series diverges) and the decay toward 1 as s grows. Drag the slider to add partial sums.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 380,
                            originX: 80, originY: 280, scale: 80
                        });
                        var nTerms = 200;
                        var showPartial = 10;

                        VizEngine.createSlider(controls, 'Partial sum N', 3, 200, showPartial, 1, function(v) {
                            showPartial = Math.round(v);
                            draw();
                        });

                        function zetaPartial(s, N) {
                            var sum = 0;
                            for (var n = 1; n <= N; n++) sum += Math.pow(n, -s);
                            return sum;
                        }

                        function draw() {
                            viz.clear();
                            viz.drawGrid();
                            viz.drawAxes();
                            var ctx = viz.ctx;

                            // Draw zeta(s) (high-N approximation)
                            viz.drawFunction(function(s) {
                                if (s <= 1.01) return NaN;
                                return zetaPartial(s, 500);
                            }, 1.01, 6, viz.colors.blue, 2.5);

                            // Draw partial sum
                            viz.drawFunction(function(s) {
                                if (s <= 0.5) return NaN;
                                return zetaPartial(s, showPartial);
                            }, 0.5, 6, viz.colors.orange, 1.5);

                            // Draw asymptote 1/(s-1) + 1
                            viz.drawFunction(function(s) {
                                if (s <= 1.01) return NaN;
                                return 1 / (s - 1) + 1;
                            }, 1.01, 6, viz.colors.teal + '88', 1, true);

                            // Horizontal line y=1
                            viz.drawSegment(0, 1, 6, 1, viz.colors.text + '44', 1, true);

                            // Vertical line s=1
                            viz.drawSegment(1, -1, 1, 4, viz.colors.red + '66', 1, true);

                            // Labels
                            viz.screenText('zeta(s)', viz.width - 60, 40, viz.colors.blue, 13);
                            viz.screenText('S_N(s), N=' + showPartial, viz.width - 90, 58, viz.colors.orange, 11);
                            viz.screenText('1/(s-1)+1', viz.width - 80, 76, viz.colors.teal, 11);
                            viz.screenText('s = 1 (pole)', 140, 30, viz.colors.red, 11);
                            viz.screenText('y = 1', viz.width - 40, viz.originY - 80 - 8, viz.colors.text, 10);
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Show that \\(\\zeta(2) > 1 + \\frac{1}{4} + \\frac{1}{9} + \\frac{1}{16} > 1.4\\) by computing the first four terms. Can you get a tighter lower bound by including more terms?',
                    hint: 'Just compute \\(1 + 1/4 + 1/9 + 1/16 = 1 + 0.25 + 0.1111 + 0.0625\\).',
                    solution: '\\(1 + 1/4 + 1/9 + 1/16 = 1.4236...\\). Adding \\(1/25 + 1/36 + 1/49 + 1/64 + 1/81 + 1/100\\) gives \\(\\approx 1.5498\\). The exact value is \\(\\zeta(2) = \\pi^2/6 \\approx 1.6449\\).'
                },
                {
                    question: 'Prove that \\(\\zeta(s)\\) is strictly decreasing for real \\(s > 1\\). (Hint: differentiate term by term.)',
                    hint: 'Compute \\(\\zeta\'(s) = -\\sum_{n=2}^{\\infty} (\\log n) / n^s\\) and note each term is negative.',
                    solution: 'For \\(s > 1\\), \\(\\zeta\'(s) = -\\sum_{n=2}^{\\infty} \\frac{\\log n}{n^s}\\). Each term \\(-\\frac{\\log n}{n^s} < 0\\) for \\(n \\geq 2\\) (since \\(\\log n > 0\\) and \\(n^s > 0\\)). The sum of negative terms is negative, so \\(\\zeta\'(s) < 0\\) for all \\(s > 1\\). Thus \\(\\zeta\\) is strictly decreasing.'
                }
            ]
        },

        // ================================================================
        // SECTION 3: Continuation to the Strip 0 < Re(s) <= 1
        // ================================================================
        {
            id: 'sec-continuation-strip',
            title: 'Continuation to 0 < Re(s)',
            content: `
<h2>The Eta Trick: Extending to \\(\\operatorname{Re}(s) > 0\\)</h2>

<div class="env-block intuition">
    <div class="env-title">The Key Idea</div>
    <div class="env-body">
        <p>The Dirichlet series \\(\\sum n^{-s}\\) diverges for \\(\\operatorname{Re}(s) \\leq 1\\). But the <em>alternating</em> version \\(\\sum (-1)^{n-1} n^{-s}\\) converges (conditionally) for \\(\\operatorname{Re}(s) > 0\\). Since we can express \\(\\zeta(s)\\) in terms of this alternating series, we obtain \\(\\zeta(s)\\) in the larger half-plane.</p>
    </div>
</div>

<div class="env-block definition">
    <div class="env-title">Definition (Dirichlet Eta Function)</div>
    <div class="env-body">
        <p>The <strong>Dirichlet eta function</strong> (alternating zeta function) is</p>
        \\[\\eta(s) = \\sum_{n=1}^{\\infty} \\frac{(-1)^{n-1}}{n^s} = 1 - \\frac{1}{2^s} + \\frac{1}{3^s} - \\frac{1}{4^s} + \\cdots\\]
        <p>This series converges for \\(\\operatorname{Re}(s) > 0\\).</p>
    </div>
</div>

<div class="env-block theorem">
    <div class="env-title">Theorem 4.3 (Eta-Zeta Relation)</div>
    <div class="env-body">
        <p>For \\(\\operatorname{Re}(s) > 0\\), \\(s \\neq 1\\),</p>
        \\[\\zeta(s) = \\frac{\\eta(s)}{1 - 2^{1-s}}.\\]
        <p>This extends \\(\\zeta(s)\\) meromorphically to \\(\\operatorname{Re}(s) > 0\\) with a simple pole at \\(s = 1\\).</p>
    </div>
</div>

<p><em>Proof.</em> For \\(\\operatorname{Re}(s) > 1\\),</p>

\\[
\\zeta(s) - \\eta(s) = 2\\sum_{n=1}^{\\infty} \\frac{1}{(2n)^s} = \\frac{2}{2^s} \\zeta(s) = 2^{1-s}\\zeta(s).
\\]

<p>Solving: \\(\\zeta(s)(1 - 2^{1-s}) = \\eta(s)\\), so \\(\\zeta(s) = \\eta(s)/(1 - 2^{1-s})\\). Since \\(\\eta(s)\\) converges for \\(\\operatorname{Re}(s) > 0\\), this gives \\(\\zeta(s)\\) in the larger region. The denominator \\(1 - 2^{1-s}\\) vanishes at \\(s = 1\\) (since \\(2^0 = 1\\)) and at \\(s = 1 + 2\\pi i k / \\log 2\\) for integer \\(k\\), but the latter are removable since \\(\\eta(s)\\) also vanishes there.</p>

<div class="viz-placeholder" data-viz="viz-eta-alternating"></div>

<h3>Numerical Evaluation: Borwein Acceleration</h3>

<p>For numerical computation of \\(\\zeta(s)\\) in the critical strip \\(0 < \\operatorname{Re}(s) < 1\\), naive summation of \\(\\eta(s)\\) converges painfully slowly. The <strong>Borwein acceleration</strong> method dramatically improves convergence. It replaces the partial sums with a weighted average:</p>

\\[
\\eta(s) \\approx \\frac{-1}{d_n} \\sum_{k=0}^{n-1} \\frac{(-1)^k (d_k - d_n)}{(k+1)^s},
\\]

<p>where \\(d_k = n \\sum_{j=0}^{k} \\binom{n}{j}\\) are the Borwein coefficients. This converges like \\(O(3^{-n})\\), making it practical to evaluate \\(\\zeta(s)\\) anywhere in the critical strip to high precision.</p>

<div class="env-block remark">
    <div class="env-title">Note on Analytic Continuation</div>
    <div class="env-body">
        <p>The eta trick extends \\(\\zeta(s)\\) from \\(\\operatorname{Re}(s) > 1\\) to \\(\\operatorname{Re}(s) > 0\\). To go further (to the entire complex plane), we need the functional equation, which is the subject of Chapter 5. For now, the strip \\(0 < \\operatorname{Re}(s) \\leq 1\\) already contains the <em>critical strip</em> \\(0 \\leq \\operatorname{Re}(s) \\leq 1\\), where all the non-trivial zeros of \\(\\zeta(s)\\) live.</p>
    </div>
</div>
`,
            visualizations: [
                {
                    id: 'viz-eta-alternating',
                    title: 'The Alternating Series eta(s)',
                    description: 'Compare the partial sums of zeta(s) = sum 1/n^s (which diverges for s <= 1) with eta(s) = sum (-1)^(n-1)/n^s (which converges for s > 0). Slide s to see how the alternating series tames the divergence.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 380,
                            originX: 60, originY: 260, scale: 1
                        });
                        var sVal = 0.7;
                        var maxN = 80;

                        VizEngine.createSlider(controls, 's', 0.1, 3.0, sVal, 0.05, function(v) {
                            sVal = v;
                            draw();
                        });

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            viz.screenText('Partial Sums: zeta vs eta at s = ' + sVal.toFixed(2), viz.width / 2, 20, viz.colors.white, 14);

                            // Compute partial sums
                            var zetaSums = [];
                            var etaSums = [];
                            var zs = 0, es = 0;
                            for (var n = 1; n <= maxN; n++) {
                                zs += Math.pow(n, -sVal);
                                es += Math.pow(-1, n - 1) * Math.pow(n, -sVal);
                                zetaSums.push(zs);
                                etaSums.push(es);
                            }

                            // Determine scale
                            var allVals = zetaSums.concat(etaSums);
                            var yMax = Math.max.apply(null, allVals) * 1.1;
                            var yMin = Math.min.apply(null, allVals.concat([0])) - 0.2;
                            var yRange = yMax - yMin;
                            if (yRange < 1) yRange = 1;

                            var chartL = 70, chartR = viz.width - 30;
                            var chartT = 40, chartB = viz.height - 50;
                            var chartW = chartR - chartL, chartH = chartB - chartT;

                            // Axes
                            ctx.strokeStyle = viz.colors.axis; ctx.lineWidth = 1;
                            ctx.beginPath(); ctx.moveTo(chartL, chartB); ctx.lineTo(chartR, chartB); ctx.stroke();
                            ctx.beginPath(); ctx.moveTo(chartL, chartT); ctx.lineTo(chartL, chartB); ctx.stroke();

                            // Y-axis labels
                            ctx.fillStyle = viz.colors.text; ctx.font = '10px -apple-system,sans-serif';
                            ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
                            var nTicks = 5;
                            for (var t = 0; t <= nTicks; t++) {
                                var yv = yMin + (yRange) * t / nTicks;
                                var sy = chartB - (yv - yMin) / yRange * chartH;
                                ctx.fillText(yv.toFixed(1), chartL - 5, sy);
                                ctx.strokeStyle = viz.colors.grid; ctx.lineWidth = 0.5;
                                ctx.beginPath(); ctx.moveTo(chartL, sy); ctx.lineTo(chartR, sy); ctx.stroke();
                            }

                            // X-axis labels
                            ctx.textAlign = 'center'; ctx.textBaseline = 'top';
                            for (var x = 10; x <= maxN; x += 10) {
                                var sx = chartL + (x / maxN) * chartW;
                                ctx.fillText(x.toString(), sx, chartB + 4);
                            }
                            ctx.fillText('N', chartR + 10, chartB + 4);

                            // Plot zeta partial sums
                            ctx.strokeStyle = viz.colors.blue; ctx.lineWidth = 2;
                            ctx.beginPath();
                            for (var i = 0; i < maxN; i++) {
                                var px = chartL + ((i + 1) / maxN) * chartW;
                                var py = chartB - (zetaSums[i] - yMin) / yRange * chartH;
                                if (py < chartT - 20 || py > chartB + 20) { if (i > 0) ctx.stroke(); ctx.beginPath(); continue; }
                                i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
                            }
                            ctx.stroke();

                            // Plot eta partial sums
                            ctx.strokeStyle = viz.colors.orange; ctx.lineWidth = 2;
                            ctx.beginPath();
                            for (var i = 0; i < maxN; i++) {
                                var px = chartL + ((i + 1) / maxN) * chartW;
                                var py = chartB - (etaSums[i] - yMin) / yRange * chartH;
                                if (py < chartT - 20 || py > chartB + 20) { if (i > 0) ctx.stroke(); ctx.beginPath(); continue; }
                                i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
                            }
                            ctx.stroke();

                            // If s > 1, show true zeta value
                            if (sVal > 1) {
                                var trueZeta = zetaSums[maxN - 1]; // good approx
                                var zy = chartB - (trueZeta - yMin) / yRange * chartH;
                                ctx.strokeStyle = viz.colors.blue + '44'; ctx.lineWidth = 1; ctx.setLineDash([4, 4]);
                                ctx.beginPath(); ctx.moveTo(chartL, zy); ctx.lineTo(chartR, zy); ctx.stroke();
                                ctx.setLineDash([]);
                            }

                            // Eta limit line
                            var etaLimit = etaSums[maxN - 1];
                            var ey = chartB - (etaLimit - yMin) / yRange * chartH;
                            ctx.strokeStyle = viz.colors.orange + '44'; ctx.lineWidth = 1; ctx.setLineDash([4, 4]);
                            ctx.beginPath(); ctx.moveTo(chartL, ey); ctx.lineTo(chartR, ey); ctx.stroke();
                            ctx.setLineDash([]);

                            // Legend
                            var legY = viz.height - 30;
                            viz.screenText('sum 1/n^s', chartL + 80, legY, viz.colors.blue, 12);
                            viz.screenText('sum (-1)^(n-1)/n^s', chartL + 250, legY, viz.colors.orange, 12);

                            if (sVal <= 1) {
                                viz.screenText('zeta series DIVERGES for s <= 1', viz.width / 2, chartT + 15, viz.colors.red, 12);
                            }
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Verify the identity \\(\\zeta(s) = \\eta(s)/(1 - 2^{1-s})\\) numerically at \\(s = 2\\) by computing both sides with enough terms.',
                    hint: 'Compute \\(\\eta(2) = 1 - 1/4 + 1/9 - 1/16 + \\cdots\\) and check that \\(\\eta(2)/(1 - 2^{-1}) = \\eta(2) \\cdot 2 = \\pi^2/6\\).',
                    solution: '\\(\\eta(2) = \\sum_{n=1}^\\infty (-1)^{n-1}/n^2 = \\pi^2/12\\). Then \\(\\eta(2)/(1-2^{-1}) = (\\pi^2/12)/(1/2) = \\pi^2/6 = \\zeta(2)\\). Numerically: \\(\\pi^2/12 \\approx 0.8225\\), divided by \\(0.5\\) gives \\(1.6449 \\approx \\pi^2/6\\).'
                },
                {
                    question: 'Show that the denominator \\(1 - 2^{1-s}\\) vanishes at \\(s = 1\\) and at \\(s = 1 + 2\\pi i k/\\log 2\\) for any nonzero integer \\(k\\). Why does only \\(s = 1\\) produce a genuine pole of \\(\\zeta(s)\\)?',
                    hint: '\\(2^{1-s} = 1\\) iff \\((1-s)\\log 2 = 2\\pi i k\\) for some integer \\(k\\). For \\(k \\neq 0\\), check that \\(\\eta(s)\\) also vanishes.',
                    solution: '\\(2^{1-s} = e^{(1-s)\\log 2} = 1\\) iff \\((1-s)\\log 2 = 2\\pi ik\\), i.e., \\(s = 1 - 2\\pi ik/\\log 2\\). At \\(s = 1\\), \\(\\eta(1) = \\log 2 \\neq 0\\), so the zero of the denominator is not cancelled: genuine pole. For \\(k \\neq 0\\), one can show \\(\\eta(s)\\) also vanishes (the alternating series has the same periodicity), making the singularity removable.'
                }
            ]
        },

        // ================================================================
        // SECTION 4: The Pole at s = 1
        // ================================================================
        {
            id: 'sec-pole',
            title: 'The Pole at s = 1',
            content: `
<h2>The Pole at \\(s = 1\\) and the Laurent Expansion</h2>

<p>The zeta function has a unique singularity in the half-plane \\(\\operatorname{Re}(s) > 0\\): a <strong>simple pole</strong> at \\(s = 1\\) with residue 1. This pole is the analytic shadow of the divergence of the harmonic series.</p>

<div class="env-block theorem">
    <div class="env-title">Theorem 4.4 (Laurent Expansion at \\(s=1\\))</div>
    <div class="env-body">
        <p>Near \\(s = 1\\), the zeta function has the Laurent expansion</p>
        \\[\\zeta(s) = \\frac{1}{s-1} + \\gamma + O(s-1),\\]
        <p>where \\(\\gamma = 0.57721\\ldots\\) is the <strong>Euler-Mascheroni constant</strong>, defined by</p>
        \\[\\gamma = \\lim_{N \\to \\infty} \\left(\\sum_{n=1}^{N} \\frac{1}{n} - \\log N\\right).\\]
    </div>
</div>

<p><em>Proof sketch.</em> By the Euler-Maclaurin formula,</p>

\\[
\\zeta(s) = \\sum_{n=1}^{N} n^{-s} + \\frac{N^{1-s}}{s-1} + \\frac{1}{2}N^{-s} + \\cdots
\\]

<p>As \\(s \\to 1\\), the leading singular term is \\(\\frac{1}{s-1}\\). The regular part evaluates to \\(\\gamma\\) at \\(s = 1\\).</p>

<div class="env-block definition">
    <div class="env-title">Definition (Euler-Mascheroni Constant)</div>
    <div class="env-body">
        <p>The Euler-Mascheroni constant is</p>
        \\[\\gamma = \\lim_{N \\to \\infty} \\left(\\sum_{n=1}^{N} \\frac{1}{n} - \\ln N\\right) = 0.5772156649\\ldots\\]
        <p>It is unknown whether \\(\\gamma\\) is rational or irrational.</p>
    </div>
</div>

<h3>Why the Pole Matters</h3>

<p>The simple pole of \\(\\zeta(s)\\) at \\(s = 1\\) with residue 1 is deeply connected to the Prime Number Theorem. Informally:</p>

<ul>
    <li>The Euler product \\(\\zeta(s) = \\prod_p (1 - p^{-s})^{-1}\\) diverges as \\(s \\to 1^+\\) because there are infinitely many primes. The <em>rate</em> of divergence encodes the <em>density</em> of primes.</li>
    <li>The fact that the residue is exactly 1 (not some other constant) translates, through the machinery of Chapters 6-7, to the statement \\(\\pi(x) \\sim x/\\log x\\).</li>
</ul>

<div class="env-block example">
    <div class="env-title">Example: Mertens' Theorem as a Consequence</div>
    <div class="env-body">
        <p>The simple pole of \\(\\zeta(s)\\) at \\(s=1\\) implies \\(\\log\\zeta(s) \\sim \\log\\frac{1}{s-1}\\) as \\(s \\to 1^+\\). Since \\(\\log\\zeta(s) = -\\sum_p \\log(1-p^{-s}) \\sim \\sum_p p^{-s}\\), this gives \\(\\sum_p p^{-s} \\sim \\log\\frac{1}{s-1}\\). Converting this from the "\\(s\\)-world" back to the "\\(x\\)-world" via a Tauberian argument gives Mertens' theorem: \\(\\sum_{p \\leq x} 1/p \\sim \\log\\log x\\).</p>
    </div>
</div>
`,
            visualizations: [],
            exercises: [
                {
                    question: 'Compute \\(\\gamma\\) to three decimal places by evaluating \\(\\sum_{n=1}^{100} 1/n - \\ln 100\\).',
                    hint: 'The harmonic sum \\(H_{100} = 1 + 1/2 + \\cdots + 1/100 \\approx 5.18738\\). And \\(\\ln 100 \\approx 4.60517\\).',
                    solution: '\\(H_{100} \\approx 5.18738\\) and \\(\\ln 100 \\approx 4.60517\\), so \\(H_{100} - \\ln 100 \\approx 0.58221\\). The true value is \\(\\gamma \\approx 0.57722\\). The convergence is slow (error \\(\\approx 1/(2N)\\)), so \\(N = 100\\) gives only about 2 correct digits.'
                }
            ]
        },

        // ================================================================
        // SECTION 5: Special Values
        // ================================================================
        {
            id: 'sec-special-values',
            title: 'Special Values',
            content: `
<h2>Special Values of \\(\\zeta(s)\\)</h2>

<div class="env-block intuition">
    <div class="env-title">Two Families of Special Values</div>
    <div class="env-body">
        <p>The zeta function takes remarkable values at certain integers. At positive even integers, Euler found explicit formulas involving \\(\\pi\\). At negative integers, the values are rational numbers related to Bernoulli numbers. At positive odd integers \\(\\geq 3\\), essentially nothing is known (Apery proved \\(\\zeta(3)\\) irrational in 1978, but no closed form is known).</p>
    </div>
</div>

<h3>The Basel Problem: \\(\\zeta(2) = \\pi^2/6\\)</h3>

<p>The problem of evaluating \\(\\sum_{n=1}^{\\infty} 1/n^2\\) was posed by Pietro Mengoli in 1650 and solved by Euler in 1734. Euler's original proof used the factorization of \\(\\sin(\\pi x)/(\\pi x)\\) as an infinite product over its zeros, equating coefficients of \\(x^2\\).</p>

<div class="env-block theorem">
    <div class="env-title">Theorem 4.5 (Euler, 1734: Basel Problem)</div>
    <div class="env-body">
        \\[\\zeta(2) = \\sum_{n=1}^{\\infty} \\frac{1}{n^2} = \\frac{\\pi^2}{6}.\\]
    </div>
</div>

<h3>General Even Values: \\(\\zeta(2k)\\)</h3>

<div class="env-block theorem">
    <div class="env-title">Theorem 4.6 (Euler's Formula for Even Zeta Values)</div>
    <div class="env-body">
        <p>For each positive integer \\(k\\),</p>
        \\[\\zeta(2k) = \\frac{(-1)^{k+1} (2\\pi)^{2k}}{2(2k)!} B_{2k},\\]
        <p>where \\(B_{2k}\\) are the <strong>Bernoulli numbers</strong>, defined by the generating function</p>
        \\[\\frac{t}{e^t - 1} = \\sum_{n=0}^{\\infty} B_n \\frac{t^n}{n!}.\\]
    </div>
</div>

<p>The first few values:</p>

<table class="display-table">
<tr><th>\\(k\\)</th><th>\\(B_{2k}\\)</th><th>\\(\\zeta(2k)\\)</th><th>Decimal</th></tr>
<tr><td>1</td><td>\\(1/6\\)</td><td>\\(\\pi^2/6\\)</td><td>1.6449...</td></tr>
<tr><td>2</td><td>\\(-1/30\\)</td><td>\\(\\pi^4/90\\)</td><td>1.0823...</td></tr>
<tr><td>3</td><td>\\(1/42\\)</td><td>\\(\\pi^6/945\\)</td><td>1.0173...</td></tr>
<tr><td>4</td><td>\\(-1/30\\)</td><td>\\(\\pi^8/9450\\)</td><td>1.0041...</td></tr>
</table>

<div class="viz-placeholder" data-viz="viz-special-values"></div>

<h3>Trivial Zeros: \\(\\zeta(-2n) = 0\\)</h3>

<p>The functional equation (Chapter 5) implies that \\(\\zeta(-2n) = 0\\) for \\(n = 1, 2, 3, \\ldots\\). These are called the <strong>trivial zeros</strong> because they arise from the poles of the Gamma function factor in the functional equation, not from any deep arithmetic structure.</p>

<div class="env-block definition">
    <div class="env-title">Definition (Trivial and Non-Trivial Zeros)</div>
    <div class="env-body">
        <p>The <strong>trivial zeros</strong> of \\(\\zeta(s)\\) are at \\(s = -2, -4, -6, \\ldots\\).</p>
        <p>All other zeros (which lie in the critical strip \\(0 \\leq \\operatorname{Re}(s) \\leq 1\\)) are called <strong>non-trivial zeros</strong>.</p>
        <p>The <strong>Riemann Hypothesis</strong> asserts that every non-trivial zero has \\(\\operatorname{Re}(s) = 1/2\\).</p>
    </div>
</div>

<h3>Negative Integer Values</h3>

<p>Using the functional equation (previewed below), one can show:</p>

\\[
\\zeta(0) = -\\tfrac{1}{2}, \\quad \\zeta(-1) = -\\tfrac{1}{12}, \\quad \\zeta(-3) = \\tfrac{1}{120}, \\quad \\zeta(-2n+1) = -\\frac{B_{2n}}{2n}.
\\]

<p>The value \\(\\zeta(-1) = -1/12\\) is sometimes (misleadingly) written as "\\(1 + 2 + 3 + 4 + \\cdots = -1/12\\)." This is not a convergent sum; it is the value assigned by analytic continuation.</p>
`,
            visualizations: [
                {
                    id: 'viz-special-values',
                    title: 'Special Values of Zeta',
                    description: 'Visualize the first several values zeta(2k) and see how rapidly they approach 1. Each bar shows zeta(2k) - 1.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 340,
                            originX: 80, originY: 300, scale: 1
                        });

                        // Bernoulli numbers B_{2k} for k=1..8
                        var bernoulli = [1/6, -1/30, 1/42, -1/30, 5/66, -691/2730, 7/6, -3617/510];

                        function zetaEven(k) {
                            var sign = Math.pow(-1, k + 1);
                            return sign * Math.pow(2 * Math.PI, 2 * k) * bernoulli[k - 1] / (2 * factorial(2 * k));
                        }

                        function factorial(n) {
                            var r = 1;
                            for (var i = 2; i <= n; i++) r *= i;
                            return r;
                        }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            viz.screenText('Special Values: zeta(2k)', viz.width / 2, 18, viz.colors.white, 15);

                            var nBars = 8;
                            var barW = 45;
                            var gap = 12;
                            var startX = 90;
                            var baseY = 280;
                            var scaleY = 180;

                            // zeta(2) is largest; scale by zeta(2) - 1
                            var maxVal = zetaEven(1) - 1;

                            for (var k = 1; k <= nBars; k++) {
                                var val = zetaEven(k);
                                var barH = (val - 1) / maxVal * scaleY;
                                var x = startX + (k - 1) * (barW + gap);

                                // Bar
                                var hue = (k - 1) / nBars;
                                var rgb = VizEngine.hslToRgb(hue * 0.7 + 0.55, 0.7, 0.55);
                                ctx.fillStyle = 'rgb(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ')';
                                ctx.fillRect(x, baseY - barH, barW, barH);

                                // Value label
                                ctx.fillStyle = viz.colors.white;
                                ctx.font = '10px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.textBaseline = 'bottom';
                                ctx.fillText(val.toFixed(4), x + barW / 2, baseY - barH - 4);

                                // x-axis label
                                ctx.fillStyle = viz.colors.text;
                                ctx.textBaseline = 'top';
                                ctx.fillText('zeta(' + (2 * k) + ')', x + barW / 2, baseY + 4);
                            }

                            // Baseline y=1
                            ctx.strokeStyle = viz.colors.teal + '88'; ctx.lineWidth = 1; ctx.setLineDash([4, 4]);
                            ctx.beginPath(); ctx.moveTo(startX - 10, baseY); ctx.lineTo(viz.width - 10, baseY); ctx.stroke();
                            ctx.setLineDash([]);
                            ctx.fillStyle = viz.colors.teal; ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
                            ctx.fillText('1.0', startX - 15, baseY);

                            viz.screenText('Values converge to 1 as k grows (each bar = zeta(2k) - 1)', viz.width / 2, viz.height - 15, viz.colors.text, 11);
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Verify that \\(\\zeta(4) = \\pi^4/90\\) by computing \\(-(-1)^{2+1}(2\\pi)^4 B_4 / (2 \\cdot 4!)\\) with \\(B_4 = -1/30\\).',
                    hint: 'Plug \\(k = 2\\), \\(B_4 = -1/30\\) into Euler\'s formula. Watch the signs carefully.',
                    solution: '\\(\\zeta(4) = \\frac{(-1)^{3}(2\\pi)^4}{2 \\cdot 4!} \\cdot (-1/30) = \\frac{-(16\\pi^4)}{48} \\cdot (-1/30) = \\frac{16\\pi^4}{1440} = \\frac{\\pi^4}{90}\\).'
                },
                {
                    question: 'Explain informally why \\(\\zeta(2k) \\to 1\\) rapidly as \\(k \\to \\infty\\).',
                    hint: 'What is the largest term in the sum \\(\\sum 1/n^{2k}\\) after \\(n = 1\\)?',
                    solution: 'The \\(n = 1\\) term contributes 1. The next term is \\(1/2^{2k}\\), which shrinks exponentially in \\(k\\). All remaining terms are even smaller. So \\(\\zeta(2k) = 1 + 2^{-2k} + 3^{-2k} + \\cdots \\to 1\\) exponentially fast.'
                }
            ]
        },

        // ================================================================
        // SECTION 6: Gamma Function and Xi Function
        // ================================================================
        {
            id: 'sec-gamma-xi',
            title: 'Gamma, Xi, and the Functional Equation',
            content: `
<h2>The Gamma Function and the Functional Equation</h2>

<div class="env-block intuition">
    <div class="env-title">Why Gamma?</div>
    <div class="env-body">
        <p>The functional equation of \\(\\zeta(s)\\) relates \\(\\zeta(s)\\) to \\(\\zeta(1-s)\\), connecting the right half-plane to the left. The "glue" that makes this work is the Gamma function \\(\\Gamma(s)\\), which appears naturally through Mellin transforms of exponential functions.</p>
    </div>
</div>

<h3>The Gamma Function</h3>

<div class="env-block definition">
    <div class="env-title">Definition (Gamma Function)</div>
    <div class="env-body">
        <p>For \\(\\operatorname{Re}(s) > 0\\),</p>
        \\[\\Gamma(s) = \\int_0^{\\infty} t^{s-1} e^{-t}\\,dt.\\]
        <p>Key properties:</p>
        <ul>
            <li>\\(\\Gamma(n) = (n-1)!\\) for positive integers \\(n\\).</li>
            <li>Functional equation: \\(\\Gamma(s+1) = s\\,\\Gamma(s)\\).</li>
            <li>\\(\\Gamma(1/2) = \\sqrt{\\pi}\\).</li>
            <li>\\(\\Gamma(s)\\) extends meromorphically to all of \\(\\mathbb{C}\\) with simple poles at \\(s = 0, -1, -2, \\ldots\\).</li>
        </ul>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-gamma-function"></div>

<h3>The Completed Zeta Function \\(\\xi(s)\\)</h3>

<p>Riemann defined the <strong>xi function</strong></p>

\\[
\\xi(s) = \\frac{1}{2} s(s-1) \\pi^{-s/2} \\Gamma(s/2)\\, \\zeta(s).
\\]

<p>The factors are chosen so that:</p>
<ul>
    <li>The pole of \\(\\zeta(s)\\) at \\(s = 1\\) is cancelled by the \\((s-1)\\) factor.</li>
    <li>The trivial zeros of \\(\\zeta(s)\\) (from \\(\\Gamma(s/2)\\) poles) are removed.</li>
    <li>The resulting function is <strong>entire</strong> (no poles) and satisfies a beautifully symmetric functional equation.</li>
</ul>

<div class="env-block theorem">
    <div class="env-title">Theorem 4.7 (Functional Equation)</div>
    <div class="env-body">
        <p>The xi function satisfies</p>
        \\[\\xi(s) = \\xi(1 - s)\\]
        <p>for all \\(s \\in \\mathbb{C}\\). Equivalently,</p>
        \\[\\pi^{-s/2}\\,\\Gamma(s/2)\\,\\zeta(s) = \\pi^{-(1-s)/2}\\,\\Gamma\\!\\left(\\frac{1-s}{2}\\right)\\zeta(1-s).\\]
    </div>
</div>

<p>The full proof uses the Jacobi theta function and Poisson summation; we defer it to Chapter 5. For now, note the key consequence:</p>

<div class="env-block remark">
    <div class="env-title">Symmetry of Zeros</div>
    <div class="env-body">
        <p>Since \\(\\xi(s) = \\xi(1 - s)\\), the non-trivial zeros of \\(\\zeta(s)\\) are symmetric about the line \\(\\operatorname{Re}(s) = 1/2\\). If \\(\\rho\\) is a zero, so is \\(1 - \\rho\\). (Combined with the fact that \\(\\overline{\\zeta(s)} = \\zeta(\\bar{s})\\), the zeros are also symmetric about the real axis.)</p>
        <p>The Riemann Hypothesis states that in fact all non-trivial zeros lie <em>on</em> the line \\(\\operatorname{Re}(s) = 1/2\\), not merely symmetric about it.</p>
    </div>
</div>
`,
            visualizations: [
                {
                    id: 'viz-gamma-function',
                    title: 'The Gamma Function',
                    description: 'The real Gamma function Gamma(s), generalizing the factorial. It has poles at 0, -1, -2, ... and interpolates (n-1)! at positive integers.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 380,
                            originX: 260, originY: 200, scale: 30
                        });

                        // Lanczos approximation for Gamma(x) for real x
                        function gammaReal(x) {
                            if (x <= 0 && x === Math.floor(x)) return NaN; // poles
                            if (x < 0.5) {
                                return Math.PI / (Math.sin(Math.PI * x) * gammaReal(1 - x));
                            }
                            x -= 1;
                            var g = 7;
                            var c = [
                                0.99999999999980993,
                                676.5203681218851,
                                -1259.1392167224028,
                                771.32342877765313,
                                -176.61502916214059,
                                12.507343278686905,
                                -0.13857109526572012,
                                9.9843695780195716e-6,
                                1.5056327351493116e-7
                            ];
                            var t = x + g + 0.5;
                            var sum = c[0];
                            for (var i = 1; i < g + 2; i++) {
                                sum += c[i] / (x + i);
                            }
                            return Math.sqrt(2 * Math.PI) * Math.pow(t, x + 0.5) * Math.exp(-t) * sum;
                        }

                        function draw() {
                            viz.clear();
                            viz.drawGrid();
                            viz.drawAxes();

                            // Draw Gamma(x) in segments to handle poles
                            var segments = [[-4.99, -4.01], [-3.99, -3.01], [-2.99, -2.01], [-1.99, -1.01], [-0.99, -0.01], [0.01, 8]];
                            for (var seg = 0; seg < segments.length; seg++) {
                                viz.drawFunction(function(x) {
                                    var val = gammaReal(x);
                                    if (Math.abs(val) > 8) return NaN;
                                    return val;
                                }, segments[seg][0], segments[seg][1], viz.colors.blue, 2, 400);
                            }

                            // Mark integer values: Gamma(n) = (n-1)!
                            var factorials = [1, 1, 2, 6, 24]; // 0!, 1!, 2!, 3!, 4!
                            for (var n = 1; n <= 5; n++) {
                                var y = factorials[n - 1];
                                if (y <= 8) {
                                    viz.drawPoint(n, y, viz.colors.orange, '(' + n + ', ' + y + ')', 4);
                                }
                            }

                            // Mark Gamma(1/2) = sqrt(pi)
                            viz.drawPoint(0.5, Math.sqrt(Math.PI), viz.colors.teal, 'Gamma(1/2)=sqrt(pi)', 4);

                            // Mark poles
                            for (var p = 0; p >= -4; p--) {
                                var sx = viz.toScreen(p, 0);
                                viz.ctx.strokeStyle = viz.colors.red + '66';
                                viz.ctx.lineWidth = 1;
                                viz.ctx.setLineDash([3, 3]);
                                viz.ctx.beginPath();
                                viz.ctx.moveTo(sx[0], 0);
                                viz.ctx.lineTo(sx[0], viz.height);
                                viz.ctx.stroke();
                                viz.ctx.setLineDash([]);
                            }

                            viz.screenText('Gamma(s)', viz.width - 70, 25, viz.colors.blue, 14);
                            viz.screenText('Poles at 0, -1, -2, ...', 80, viz.height - 20, viz.colors.red, 11);
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Prove that \\(\\Gamma(1/2) = \\sqrt{\\pi}\\) by computing \\(\\int_0^\\infty t^{-1/2} e^{-t}\\,dt\\) via the substitution \\(t = u^2\\).',
                    hint: 'With \\(t = u^2\\), \\(dt = 2u\\,du\\), and \\(t^{-1/2} = 1/u\\), so the integral becomes \\(2\\int_0^\\infty e^{-u^2}\\,du\\).',
                    solution: '\\(\\Gamma(1/2) = \\int_0^\\infty t^{-1/2}e^{-t}\\,dt\\). Let \\(t = u^2\\), \\(dt = 2u\\,du\\): \\(\\Gamma(1/2) = \\int_0^\\infty u^{-1} e^{-u^2} \\cdot 2u\\,du = 2\\int_0^\\infty e^{-u^2}\\,du = 2 \\cdot \\frac{\\sqrt{\\pi}}{2} = \\sqrt{\\pi}\\), using the Gaussian integral \\(\\int_0^\\infty e^{-u^2}\\,du = \\sqrt{\\pi}/2\\).'
                },
                {
                    question: 'Use the functional equation \\(\\xi(s) = \\xi(1-s)\\) and the formula for \\(\\xi\\) to show that the trivial zeros \\(\\zeta(-2n) = 0\\) arise from the poles of \\(\\Gamma(s/2)\\) at \\(s = -2, -4, \\ldots\\).',
                    hint: 'At \\(s = -2n\\), \\(\\Gamma(s/2) = \\Gamma(-n)\\) which has a pole. For \\(\\xi(s)\\) to be entire, \\(\\zeta(s)\\) must have a zero to cancel this pole.',
                    solution: '\\(\\xi(s) = \\frac{1}{2}s(s-1)\\pi^{-s/2}\\Gamma(s/2)\\zeta(s)\\) is entire. At \\(s = -2n\\) (\\(n \\geq 1\\)), \\(\\Gamma(s/2) = \\Gamma(-n)\\) has a simple pole. The factors \\(s\\), \\((s-1)\\), and \\(\\pi^{-s/2}\\) are finite and nonzero. For \\(\\xi(s)\\) to remain finite, \\(\\zeta(s)\\) must have a zero to cancel the pole of \\(\\Gamma(s/2)\\). Hence \\(\\zeta(-2n) = 0\\).'
                }
            ]
        },

        // ================================================================
        // SECTION 7: Bridge to What Comes Next
        // ================================================================
        {
            id: 'sec-bridge',
            title: 'The Critical Line',
            content: `
<h2>The Critical Line and What Lies Ahead</h2>

<p>We have now established the zeta function in the half-plane \\(\\operatorname{Re}(s) > 0\\), identified its pole, computed its special values, and glimpsed the functional equation. The stage is set for the deeper developments of Chapters 5-8.</p>

<h3>The Critical Line \\(\\operatorname{Re}(s) = 1/2\\)</h3>

<p>The functional equation \\(\\xi(s) = \\xi(1 - s)\\) makes the line \\(\\sigma = 1/2\\) a natural axis of symmetry. The values \\(|\\zeta(1/2 + it)|\\) oscillate as \\(t\\) increases, and the zeros of \\(\\zeta\\) on this line (i.e., the values of \\(t\\) where \\(\\zeta(1/2 + it) = 0\\)) are the subject of the Riemann Hypothesis.</p>

<div class="viz-placeholder" data-viz="viz-critical-line"></div>

<div class="env-block theorem">
    <div class="env-title">Theorem 4.8 (Hardy, 1914)</div>
    <div class="env-body">
        <p>The function \\(\\zeta(1/2 + it)\\) has infinitely many real zeros. That is, there are infinitely many non-trivial zeros on the critical line.</p>
    </div>
</div>

<p>Hardy's result was strengthened by Selberg (1942), who showed that a positive proportion of all non-trivial zeros lie on the critical line. Computations by van de Lune, te Riele, and others have verified that the first \\(10^{13}\\) non-trivial zeros all lie on the critical line, with no exceptions found.</p>

<h3>What Comes Next</h3>

<div class="env-block remark">
    <div class="env-title">Preview of Chapters 5-8</div>
    <div class="env-body">
        <ul>
            <li><strong>Chapter 5</strong>: Full analytic continuation to \\(\\mathbb{C}\\) via Jacobi's theta function and Poisson summation. Proof of the functional equation.</li>
            <li><strong>Chapter 6</strong>: Zero-free regions for \\(\\zeta(s)\\) near \\(\\operatorname{Re}(s) = 1\\). The de la Vallee-Poussin region.</li>
            <li><strong>Chapter 7</strong>: The Prime Number Theorem as a consequence of the zero-free region.</li>
            <li><strong>Chapter 8</strong>: The explicit formula connecting \\(\\psi(x)\\) to the zeros of \\(\\zeta(s)\\).</li>
        </ul>
    </div>
</div>
`,
            visualizations: [
                {
                    id: 'viz-critical-line',
                    title: '|zeta(1/2 + it)| on the Critical Line',
                    description: 'The modulus of zeta along the critical line Re(s) = 1/2, plotted as a function of t (the imaginary part). Zeros of zeta(1/2 + it) appear where the curve touches zero. The first few non-trivial zeros are visible near t = 14.13, 21.02, 25.01, ...',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 380,
                            originX: 60, originY: 340, scale: 1
                        });
                        var tMax = 50;

                        VizEngine.createSlider(controls, 't_max', 20, 100, tMax, 5, function(v) {
                            tMax = v;
                            draw();
                        });

                        // Complex arithmetic helpers
                        function cmul(a, b) { return [a[0]*b[0] - a[1]*b[1], a[0]*b[1] + a[1]*b[0]]; }
                        function cdiv(a, b) { var d = b[0]*b[0]+b[1]*b[1]; return [(a[0]*b[0]+a[1]*b[1])/d, (a[1]*b[0]-a[0]*b[1])/d]; }
                        function cexp(a) { var r = Math.exp(a[0]); return [r*Math.cos(a[1]), r*Math.sin(a[1])]; }
                        function cpow(base, s) {
                            // base^s = exp(s * log(base)), base > 0 real
                            var logb = Math.log(base);
                            return cexp([s[0]*logb, s[1]*logb]);
                        }

                        // Borwein-accelerated eta for complex s
                        function zetaComplex(sr, si) {
                            var n = 20;
                            // Compute Borwein d_k coefficients
                            var d = new Array(n + 1);
                            d[0] = 1;
                            for (var k = 1; k <= n; k++) {
                                d[k] = d[k-1] + n * factorial(n + k - 1) / (factorial(n - k) * factorial(2 * k));
                            }
                            // Simplify: use standard Borwein coefficients
                            // Actually use the Chebyshev-like formula
                            d = borweinCoeffs(n);
                            var dn = d[n];

                            var sumR = 0, sumI = 0;
                            for (var k = 0; k < n; k++) {
                                var sign = (k % 2 === 0) ? 1 : -1;
                                var coeff = sign * (d[k] - dn);
                                var term = cpow(k + 1, [sr, si]);
                                var invTerm = cdiv([1, 0], term);
                                sumR += coeff * invTerm[0];
                                sumI += coeff * invTerm[1];
                            }
                            var etaR = -sumR / dn;
                            var etaI = -sumI / dn;

                            // zeta = eta / (1 - 2^{1-s})
                            var pow2 = cpow(2, [1 - sr, -si]);
                            var denomR = 1 - pow2[0];
                            var denomI = -pow2[1];
                            return cdiv([etaR, etaI], [denomR, denomI]);
                        }

                        function borweinCoeffs(n) {
                            var d = new Array(n + 1);
                            d[0] = 1;
                            for (var k = 1; k <= n; k++) {
                                d[k] = d[k-1] * (n + k - 1) * (n - k + 1) / ((2*k - 1) * k);
                                // Accumulate: d[k] = sum_{j=0}^{k} C(n,j)
                                // Simpler: just use partial sums of binomials
                            }
                            // Recompute properly
                            d[0] = 0;
                            var binom = 1;
                            for (var j = 0; j <= n; j++) {
                                if (j > 0) binom = binom * (n - j + 1) / j;
                                d[j] = (j === 0) ? binom : d[j-1] + binom;
                            }
                            return d;
                        }

                        function factorial(m) {
                            if (m <= 1) return 1;
                            var r = 1;
                            for (var i = 2; i <= m; i++) r *= i;
                            return r;
                        }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            var chartL = 60, chartR = viz.width - 20;
                            var chartT = 30, chartB = viz.height - 40;
                            var chartW = chartR - chartL, chartH = chartB - chartT;

                            viz.screenText('|zeta(1/2 + it)|', viz.width / 2, 15, viz.colors.white, 14);

                            // Compute values
                            var nPts = 400;
                            var vals = [];
                            var maxVal = 0;
                            for (var i = 0; i <= nPts; i++) {
                                var t = tMax * i / nPts;
                                var z = zetaComplex(0.5, t);
                                var mag = Math.sqrt(z[0]*z[0] + z[1]*z[1]);
                                if (!isFinite(mag)) mag = 0;
                                vals.push(mag);
                                if (mag > maxVal) maxVal = mag;
                            }
                            if (maxVal < 1) maxVal = 1;
                            maxVal *= 1.1;

                            // Axes
                            ctx.strokeStyle = viz.colors.axis; ctx.lineWidth = 1;
                            ctx.beginPath(); ctx.moveTo(chartL, chartB); ctx.lineTo(chartR, chartB); ctx.stroke();
                            ctx.beginPath(); ctx.moveTo(chartL, chartT); ctx.lineTo(chartL, chartB); ctx.stroke();

                            // Y-axis labels
                            ctx.fillStyle = viz.colors.text; ctx.font = '10px -apple-system,sans-serif';
                            ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
                            for (var yt = 0; yt <= 4; yt++) {
                                var yv = (maxVal / 4) * yt;
                                var sy = chartB - (yv / maxVal) * chartH;
                                ctx.fillText(yv.toFixed(1), chartL - 5, sy);
                                ctx.strokeStyle = viz.colors.grid; ctx.lineWidth = 0.3;
                                ctx.beginPath(); ctx.moveTo(chartL, sy); ctx.lineTo(chartR, sy); ctx.stroke();
                            }

                            // X-axis labels
                            ctx.textAlign = 'center'; ctx.textBaseline = 'top';
                            for (var xt = 0; xt <= tMax; xt += 10) {
                                var sx = chartL + (xt / tMax) * chartW;
                                ctx.fillStyle = viz.colors.text;
                                ctx.fillText(xt.toString(), sx, chartB + 4);
                            }
                            viz.screenText('t', chartR + 10, chartB + 8, viz.colors.text, 11);

                            // Plot
                            ctx.strokeStyle = viz.colors.blue; ctx.lineWidth = 2;
                            ctx.beginPath();
                            for (var i = 0; i <= nPts; i++) {
                                var px = chartL + (i / nPts) * chartW;
                                var py = chartB - (vals[i] / maxVal) * chartH;
                                i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
                            }
                            ctx.stroke();

                            // Mark approximate zeros
                            var knownZeros = [14.134, 21.022, 25.011, 30.425, 32.935, 37.586, 40.919, 43.327, 48.005, 49.774];
                            for (var zi = 0; zi < knownZeros.length; zi++) {
                                if (knownZeros[zi] > tMax) break;
                                var zx = chartL + (knownZeros[zi] / tMax) * chartW;
                                ctx.fillStyle = viz.colors.red;
                                ctx.beginPath(); ctx.arc(zx, chartB, 4, 0, Math.PI * 2); ctx.fill();
                                ctx.fillStyle = viz.colors.red; ctx.font = '9px -apple-system,sans-serif';
                                ctx.textAlign = 'center'; ctx.textBaseline = 'top';
                                ctx.fillText(knownZeros[zi].toFixed(1), zx, chartB + 14);
                            }

                            viz.screenText('Red dots = non-trivial zeros on the critical line', viz.width / 2, viz.height - 10, viz.colors.text, 10);
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'The Riemann Hypothesis predicts that ALL non-trivial zeros have \\(\\operatorname{Re}(s) = 1/2\\). Explain why any zero off the critical line would come in a group of four: \\(\\rho, \\bar{\\rho}, 1-\\rho, 1-\\bar{\\rho}\\).',
                    hint: 'Use two symmetries: (1) \\(\\overline{\\zeta(s)} = \\zeta(\\bar{s})\\) (conjugation symmetry), and (2) \\(\\xi(s) = \\xi(1-s)\\) (functional equation symmetry).',
                    solution: 'If \\(\\zeta(\\rho) = 0\\), then \\(\\zeta(\\bar{\\rho}) = \\overline{\\zeta(\\rho)} = 0\\) (conjugation). From the functional equation \\(\\xi(s) = \\xi(1-s)\\) and the fact that \\(\\xi\\) vanishes exactly at non-trivial zeros of \\(\\zeta\\), \\(\\zeta(1-\\rho) = 0\\) and \\(\\zeta(1-\\bar{\\rho}) = 0\\). If \\(\\operatorname{Re}(\\rho) = 1/2\\), these four coincide in pairs. If \\(\\operatorname{Re}(\\rho) \\neq 1/2\\), they are four distinct points, forming a quadruplet.'
                }
            ]
        }
    ]
});
