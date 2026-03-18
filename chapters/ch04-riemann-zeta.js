window.CHAPTERS = window.CHAPTERS || [];
window.CHAPTERS.push({
    id: 'ch04',
    number: 4,
    title: 'The Riemann Zeta Function',
    subtitle: 'The master key to the distribution of primes',
    sections: [

        // ================================================================
        // SECTION 1: The Master Key
        // ================================================================
        {
            id: 'sec-motivation',
            title: 'The Master Key',
            content: `
<h2>The Master Key</h2>

<div class="env-block intuition">
    <div class="env-title">Why This Function?</div>
    <div class="env-body">
        <p>Gauss counted primes empirically and conjectured \\(\\pi(x) \\sim x/\\log x\\). Euler discovered a product formula linking the sum \\(\\sum n^{-s}\\) to all primes simultaneously. Riemann's 1859 memoir fused these threads into a single complex-analytic object whose zeros encode the finest fluctuations in the distribution of primes. The Riemann zeta function is, in this precise sense, the master key: one function controls everything.</p>
    </div>
</div>

<p>Define the <strong>Riemann zeta function</strong> by the Dirichlet series</p>

\\[
\\zeta(s) = \\sum_{n=1}^{\\infty} \\frac{1}{n^s}, \\qquad \\operatorname{Re}(s) > 1.
\\]

<p>At first glance this looks like a routine sum. But \\(s\\) is a <em>complex</em> variable, \\(s = \\sigma + it\\) with \\(\\sigma, t \\in \\mathbb{R}\\), and the power \\(n^{-s} = e^{-s \\log n}\\) oscillates as \\(t\\) varies. The resulting analytic function, when extended to all of \\(\\mathbb{C}\\), contains the full arithmetic of primes encoded in its zeros.</p>

<h3>The Euler Product</h3>

<p>The deep connection to primes comes through the Euler product. By unique factorization in \\(\\mathbb{Z}\\), for \\(\\operatorname{Re}(s) > 1\\):</p>

\\[
\\zeta(s) = \\prod_{p \\text{ prime}} \\frac{1}{1 - p^{-s}}.
\\]

<div class="env-block proof">
    <div class="env-title">Proof</div>
    <div class="env-body">
        <p>Expand each geometric factor: \\(\\frac{1}{1-p^{-s}} = 1 + p^{-s} + p^{-2s} + \\cdots\\). Taking the product over all primes, the Fundamental Theorem of Arithmetic ensures that every positive integer \\(n\\) appears exactly once in the expansion (as \\(n = \\prod p_i^{a_i}\\) corresponds to \\(\\prod p_i^{-a_i s}\\)). Absolute convergence for \\(\\sigma > 1\\) justifies rearranging. \\(\\square\\)</p>
    </div>
</div>

<p>The Euler product is not merely a formula—it is a <em>translation dictionary</em> between additive structure (the Dirichlet series, summing over integers) and multiplicative structure (the product, ranging over primes). Every non-trivial theorem about \\(\\zeta(s)\\) ultimately traces back to this identity.</p>

<h3>The Road Map</h3>

<p>This chapter carries \\(\\zeta(s)\\) from its safe half-plane \\(\\operatorname{Re}(s)>1\\), across the boundary \\(\\sigma=1\\), and into the critical strip \\(0 < \\sigma < 1\\) where the action happens. Along the way we:</p>

<ol>
    <li>Establish absolute convergence and analytic continuation to \\(\\operatorname{Re}(s) > 0\\) via the eta function;</li>
    <li>Analyze the simple pole at \\(s=1\\) (residue = 1, the arithmetic mean of all primes);</li>
    <li>Compute special values \\(\\zeta(2) = \\pi^2/6\\), \\(\\zeta(2k)\\) in terms of Bernoulli numbers, and the trivial zeros at \\(s = -2, -4, -6, \\ldots\\);</li>
    <li>Introduce the Gamma function \\(\\Gamma(s)\\) and the completed zeta function \\(\\xi(s)\\);</li>
    <li>State the functional equation and set the stage for Chapter 5.</li>
</ol>

<div class="viz-placeholder" data-viz="viz-zeta-real-line"></div>
`,
            visualizations: [
                {
                    id: 'viz-zeta-real-line',
                    title: 'Zeta on the Real Axis',
                    description: 'Plot of \\(\\zeta(\\sigma)\\) for real \\(\\sigma > 1\\). The function blows up as \\(\\sigma \\to 1^+\\) (simple pole) and approaches 1 from above as \\(\\sigma \\to \\infty\\). Drag the slider to see partial sums converge.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 360,
                            originX: 80, originY: 300, scale: 80
                        });

                        var N = 50;
                        var slider = VizEngine.createSlider(controls, 'Terms N', 1, 200, N, 1, function(v) {
                            N = Math.round(v);
                            draw();
                        });

                        function zetaReal(sigma, terms) {
                            var s = 0;
                            for (var n = 1; n <= terms; n++) s += Math.pow(n, -sigma);
                            return s;
                        }

                        function draw() {
                            viz.clear();
                            viz.drawGrid(0.5);
                            viz.drawAxes();

                            // True zeta (many terms)
                            viz.drawFunction(function(sigma) {
                                return zetaReal(sigma, 500);
                            }, 1.05, 5, viz.colors.blue, 2.5, 200);

                            // Partial sum with N terms
                            viz.drawFunction(function(sigma) {
                                return zetaReal(sigma, N);
                            }, 1.05, 5, viz.colors.orange, 1.5, 200);

                            // Pole marker at s=1
                            viz.ctx.strokeStyle = viz.colors.red;
                            viz.ctx.lineWidth = 1;
                            viz.ctx.setLineDash([5, 4]);
                            var [sx] = viz.toScreen(1, 0);
                            viz.ctx.beginPath(); viz.ctx.moveTo(sx, 0); viz.ctx.lineTo(sx, viz.height); viz.ctx.stroke();
                            viz.ctx.setLineDash([]);

                            // Labels
                            viz.screenText('\u03b6(\u03c3) = \u03a3 n\u207b\u03c3', viz.width/2, 22, viz.colors.white, 15);
                            viz.screenText('Blue: \u03b6(\u03c3) (500 terms)   Orange: partial sum (N=' + N + ')', viz.width/2, 42, viz.colors.text, 11);
                            viz.screenText('pole at \u03c3=1', sx + 6, 60, viz.colors.red, 11);

                            // Value readout at sigma=2
                            var v2 = zetaReal(2, 500);
                            viz.drawPoint(2, v2, viz.colors.teal, '\u03b6(2)\u2248' + v2.toFixed(4), 4);

                            // horizontal asymptote y=1
                            viz.drawLine(1, 1, 5, 1, viz.colors.grid, 1, true);
                            viz.drawText('y = 1', 4.5, 1.1, viz.colors.text, 11);
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Show that the Dirichlet series \\(\\sum n^{-s}\\) converges absolutely for \\(\\operatorname{Re}(s) > 1\\) by comparing with a real integral.',
                    hint: 'Bound \\(|n^{-s}| = n^{-\\sigma}\\) and apply the integral test with \\(\\int_1^\\infty x^{-\\sigma}\\,dx\\).',
                    solution: 'We have \\(|n^{-s}| = n^{-\\sigma}\\). For \\(\\sigma > 1\\), the series \\(\\sum n^{-\\sigma}\\) is a real \\(p\\)-series with \\(p = \\sigma > 1\\), hence convergent. The integral test gives \\(\\int_1^\\infty x^{-\\sigma}\\,dx = 1/(\\sigma-1) < \\infty\\). By the comparison test, \\(\\sum n^{-s}\\) converges absolutely for \\(\\operatorname{Re}(s)>1\\).'
                },
                {
                    question: 'Verify the Euler product for the first two prime factors. Multiply out \\((1-2^{-s})^{-1}(1-3^{-s})^{-1}\\) and identify which integers appear.',
                    hint: 'Expand as geometric series and multiply term by term.',
                    solution: '\\((1-2^{-s})^{-1} = 1 + 2^{-s} + 4^{-s} + \\cdots\\) and \\((1-3^{-s})^{-1} = 1 + 3^{-s} + 9^{-s} + \\cdots\\). Their product yields \\(n^{-s}\\) for every \\(n\\) whose prime factors are contained in \\(\\{2, 3\\}\\): i.e., \\(n = 2^a 3^b\\) for \\(a, b \\geq 0\\). Including more primes eventually covers all positive integers by the Fundamental Theorem of Arithmetic.'
                }
            ]
        },

        // ================================================================
        // SECTION 2: Zeta for Re(s) > 1
        // ================================================================
        {
            id: 'sec-half-plane',
            title: 'Zeta for Re(s) > 1',
            content: `
<h2>The Zeta Function for \\(\\operatorname{Re}(s) > 1\\)</h2>

<div class="env-block definition">
    <div class="env-title">Definition 4.1</div>
    <div class="env-body">
        <p>For \\(s \\in \\mathbb{C}\\) with \\(\\operatorname{Re}(s) > 1\\), define</p>
        \\[\\zeta(s) = \\sum_{n=1}^{\\infty} n^{-s} = \\sum_{n=1}^{\\infty} e^{-s \\log n}.\\]
        <p>Here \\(n^{-s}\\) is understood via the principal branch: \\(n^{-s} = e^{-s \\log n}\\) with \\(\\log n \\in \\mathbb{R}_{>0}\\).</p>
    </div>
</div>

<h3>Uniform Convergence and Analyticity</h3>

<div class="env-block theorem">
    <div class="env-title">Theorem 4.1 (Analyticity for \\(\\sigma > 1\\))</div>
    <div class="env-body">
        <p>The series \\(\\sum_{n=1}^\\infty n^{-s}\\) converges uniformly on any half-plane \\(\\{\\operatorname{Re}(s) \\geq 1 + \\delta\\}\\) for \\(\\delta > 0\\). Hence \\(\\zeta(s)\\) is holomorphic on \\(\\operatorname{Re}(s) > 1\\), and</p>
        \\[\\zeta'(s) = -\\sum_{n=2}^{\\infty} \\frac{\\log n}{n^s}.\\]
    </div>
</div>

<div class="env-block proof">
    <div class="env-title">Proof</div>
    <div class="env-body">
        <p>For \\(\\operatorname{Re}(s) \\geq 1+\\delta\\) we have \\(|n^{-s}| = n^{-\\operatorname{Re}(s)} \\leq n^{-(1+\\delta)}\\). The Weierstrass M-test applies since \\(\\sum n^{-(1+\\delta)} < \\infty\\). A uniformly convergent series of holomorphic functions is holomorphic, and differentiation commutes with the sum. \\(\\square\\)</p>
    </div>
</div>

<h3>Dirichlet Series Arithmetic</h3>

<p>Because \\(\\zeta(s)\\) converges absolutely for \\(\\sigma > 1\\), products of Dirichlet series are legitimate:</p>

\\[
\\zeta(s)^2 = \\sum_{n=1}^{\\infty} \\frac{d(n)}{n^s}, \\qquad
\\frac{1}{\\zeta(s)} = \\sum_{n=1}^{\\infty} \\frac{\\mu(n)}{n^s},
\\]

<p>where \\(d(n)\\) is the divisor function and \\(\\mu(n)\\) is the Möbius function. These identities are the analytic incarnations of Dirichlet convolution: \\(d = 1 * 1\\) and \\(\\mu * 1 = \\varepsilon\\).</p>

<h3>Growth Estimates</h3>

<p>For fixed \\(\\sigma > 1\\):</p>
\\[
\\zeta(\\sigma) = \\frac{1}{\\sigma - 1} + \\gamma + O(\\sigma - 1) \\quad \\text{as } \\sigma \\to 1^+,
\\]
<p>where \\(\\gamma \\approx 0.5772\\) is the Euler-Mascheroni constant. This Laurent expansion near the pole is the starting point for many analytic estimates.</p>

<div class="env-block remark">
    <div class="env-title">Remark: Abscissa of Convergence</div>
    <div class="env-body">
        <p>For a general Dirichlet series \\(\\sum a_n n^{-s}\\), there is an <em>abscissa of convergence</em> \\(\\sigma_c\\) such that the series converges for \\(\\sigma > \\sigma_c\\) and diverges for \\(\\sigma < \\sigma_c\\). For \\(\\zeta(s)\\) itself, \\(\\sigma_c = 1\\). However \\(\\zeta(s)\\) is much more than the series: via analytic continuation it extends to all of \\(\\mathbb{C}\\) minus \\(\\{1\\}\\), a region far beyond any Dirichlet series.</p>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-eta-alternating"></div>
`,
            visualizations: [
                {
                    id: 'viz-eta-alternating',
                    title: 'Convergence in the Half-Plane',
                    description: 'The partial sums \\(S_N(\\sigma) = \\sum_{n=1}^N n^{-\\sigma}\\) for various real \\(\\sigma\\). For \\(\\sigma > 1\\) the sums converge; near \\(\\sigma = 1\\) the series diverges (harmonic series). Drag the slider for \\(N\\).',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 360,
                            originX: 60, originY: 320, scale: 40
                        });

                        var N = 30;
                        VizEngine.createSlider(controls, 'Terms N', 2, 100, N, 1, function(v) {
                            N = Math.round(v); draw();
                        });

                        var sigmas = [
                            { val: 2.0, color: '#58a6ff', label: '\u03c3=2' },
                            { val: 1.5, color: '#3fb9a0', label: '\u03c3=1.5' },
                            { val: 1.2, color: '#f0883e', label: '\u03c3=1.2' },
                            { val: 1.02, color: '#f85149', label: '\u03c3=1.02' }
                        ];

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            // axes: x = term index, y = partial sum
                            ctx.strokeStyle = viz.colors.axis; ctx.lineWidth = 1.5;
                            ctx.beginPath(); ctx.moveTo(viz.originX, 0); ctx.lineTo(viz.originX, viz.height); ctx.stroke();
                            ctx.beginPath(); ctx.moveTo(0, viz.originY); ctx.lineTo(viz.width, viz.originY); ctx.stroke();

                            // x-axis labels
                            ctx.fillStyle = viz.colors.text; ctx.font = '10px -apple-system,sans-serif';
                            ctx.textAlign = 'center'; ctx.textBaseline = 'top';
                            for (var x = 0; x <= N; x += 10) {
                                var [sx] = viz.toScreen(x, 0);
                                ctx.fillText(x, sx, viz.originY + 4);
                            }

                            // draw partial sums for each sigma
                            sigmas.forEach(function(sg) {
                                ctx.strokeStyle = sg.color; ctx.lineWidth = 2;
                                ctx.beginPath();
                                var sum = 0;
                                for (var n = 1; n <= N; n++) {
                                    sum += Math.pow(n, -sg.val);
                                    var [sx, sy] = viz.toScreen(n, Math.min(sum, 8));
                                    if (n === 1) ctx.moveTo(sx, sy); else ctx.lineTo(sx, sy);
                                }
                                ctx.stroke();

                                // label at end
                                var [lx, ly] = viz.toScreen(N, Math.min(sum, 8));
                                ctx.fillStyle = sg.color; ctx.font = '11px -apple-system,sans-serif';
                                ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
                                ctx.fillText(sg.label, lx + 4, ly);
                            });

                            viz.screenText('Partial sums S_N(\u03c3) = \u03a3\u2081^N n^{-\u03c3}', viz.width/2, 16, viz.colors.white, 14);
                            viz.screenText('N = ' + N, viz.width/2, 36, viz.colors.text, 11);
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Prove that \\(\\zeta(s)\\) is zero-free on \\(\\operatorname{Re}(s) > 1\\) using the Euler product.',
                    hint: 'A convergent product of non-zero factors is non-zero provided the product converges absolutely.',
                    solution: 'For \\(\\sigma > 1\\), the Euler product \\(\\zeta(s) = \\prod_p (1-p^{-s})^{-1}\\) converges absolutely. Each factor satisfies \\(|1-p^{-s}| \\geq 1 - p^{-\\sigma} > 0\\). Since \\(\\sum_p p^{-\\sigma} < \\infty\\), the product converges to a non-zero value. Hence \\(\\zeta(s) \\neq 0\\) for \\(\\sigma > 1\\).'
                },
                {
                    question: 'Show that \\(\\frac{1}{\\zeta(s)} = \\sum_{n=1}^\\infty \\mu(n)\\,n^{-s}\\) for \\(\\operatorname{Re}(s) > 1\\), using the Möbius function definition \\(\\sum_{d|n}\\mu(d) = [n=1]\\).',
                    hint: 'Multiply both sides by \\(\\zeta(s)\\) and compare the Dirichlet series coefficients.',
                    solution: 'Multiply: \\(\\zeta(s) \\cdot \\sum_n \\mu(n)n^{-s} = \\sum_n \\left(\\sum_{d|n}\\mu(d)\\right)n^{-s}\\). The inner sum is \\([n=1]\\), so the product equals 1. Hence \\(\\sum_n \\mu(n) n^{-s} = 1/\\zeta(s)\\).'
                }
            ]
        },

        // ================================================================
        // SECTION 3: Extending to Re(s) > 0 — eta function trick
        // ================================================================
        {
            id: 'sec-continuation-strip',
            title: 'Extending to Re(s) > 0',
            content: `
<h2>Extending to \\(\\operatorname{Re}(s) > 0\\): The Eta Function Trick</h2>

<div class="env-block intuition">
    <div class="env-title">The Problem</div>
    <div class="env-body">
        <p>The Dirichlet series \\(\\sum n^{-s}\\) diverges for \\(\\operatorname{Re}(s) \\leq 1\\). Yet the zeta function, as the unique analytic continuation, must extend across this barrier. The first step uses an alternating series whose abscissa of convergence is 0, not 1.</p>
    </div>
</div>

<h3>The Dirichlet Eta Function</h3>

<div class="env-block definition">
    <div class="env-title">Definition 4.2 (Eta function)</div>
    <div class="env-body">
        <p>The <strong>Dirichlet eta function</strong> (also called the alternating zeta function) is</p>
        \\[\\eta(s) = \\sum_{n=1}^{\\infty} \\frac{(-1)^{n+1}}{n^s} = 1 - 2^{-s} + 3^{-s} - 4^{-s} + \\cdots\\]
        <p>By Dirichlet's test for alternating series, \\(\\eta(s)\\) converges for \\(\\operatorname{Re}(s) > 0\\) (and conditionally on the line \\(\\operatorname{Re}(s) = 0\\) except at \\(s = 0\\)).</p>
    </div>
</div>

<h3>The Functional Relation</h3>

<div class="env-block theorem">
    <div class="env-title">Theorem 4.2</div>
    <div class="env-body">
        <p>For \\(\\operatorname{Re}(s) > 1\\):</p>
        \\[\\eta(s) = (1 - 2^{1-s})\\,\\zeta(s).\\]
        <p>Since \\(\\eta(s)\\) is holomorphic on \\(\\operatorname{Re}(s) > 0\\) and \\((1-2^{1-s})^{-1}\\) is meromorphic there, this relation extends \\(\\zeta(s)\\) to \\(\\operatorname{Re}(s) > 0\\) (except at points where \\(1 - 2^{1-s} = 0\\)).</p>
    </div>
</div>

<div class="env-block proof">
    <div class="env-title">Proof</div>
    <div class="env-body">
        <p>Group the series \\(\\zeta(s)\\) by subtracting twice the contribution from even integers:</p>
        \\[
        \\zeta(s) - 2\\cdot\\frac{1}{2^s}\\zeta(s)
        = \\zeta(s)(1 - 2^{1-s})
        = \\sum_{n=1}^\\infty n^{-s} - 2\\sum_{n=1}^\\infty (2n)^{-s}
        = \\sum_{n=1}^\\infty \\frac{(-1)^{n+1}}{n^s} = \\eta(s). \\quad\\square
        \\]
    </div>
</div>

<p>Therefore, for \\(\\operatorname{Re}(s) > 0\\) with \\(1-2^{1-s} \\neq 0\\):</p>

\\[
\\zeta(s) = \\frac{\\eta(s)}{1 - 2^{1-s}}.
\\]

<h3>Where Does \\(1 - 2^{1-s} = 0\\)?</h3>

<p>We need \\(2^{1-s} = 1\\), i.e., \\(e^{(1-s)\\log 2} = 1\\), which requires \\((1-s)\\log 2 = 2\\pi i k\\) for integer \\(k\\). This gives</p>
\\[s = 1 + \\frac{2\\pi i k}{\\log 2}, \\qquad k \\in \\mathbb{Z}.\\]
<p>These are isolated points on the vertical line \\(\\operatorname{Re}(s) = 1\\). But \\(\\eta(s)\\) also vanishes at these points (by a residue argument), so the singularities are removable. One checks that \\(k \\neq 0\\) gives \\(\\eta(s) = 0\\) there as well, and \\(k=0\\) corresponds to \\(s=1\\), the pole of \\(\\zeta\\). The continuation to \\(\\operatorname{Re}(s) > 0\\) is therefore meromorphic, with a unique pole at \\(s=1\\).</p>

<div class="env-block remark">
    <div class="env-title">Key Value: \\(\\eta(1) = \\ln 2\\)</div>
    <div class="env-body">
        <p>Setting \\(s=1\\) in the alternating series: \\(\\eta(1) = 1 - \\frac{1}{2} + \\frac{1}{3} - \\frac{1}{4} + \\cdots = \\ln 2 \\approx 0.6931\\). This is Leibniz's series (1674), a cornerstone of the theory.</p>
    </div>
</div>
`,
            visualizations: [],
            exercises: [
                {
                    question: 'Prove that \\(\\eta(1) = \\ln 2\\). Use the Taylor series \\(\\ln(1+x) = \\sum_{n=1}^\\infty (-1)^{n+1} x^n / n\\) evaluated at \\(x = 1\\).',
                    hint: 'Abel\'s theorem justifies passing to the boundary of the radius of convergence.',
                    solution: 'The Taylor series \\(\\ln(1+x) = \\sum_{n=1}^\\infty (-1)^{n+1} x^n/n\\) has radius of convergence 1. At \\(x=1\\) the alternating series \\(\\sum (-1)^{n+1}/n\\) converges by the alternating series test. Abel\'s theorem (continuity of power series at a convergent boundary point) gives \\(\\eta(1) = \\ln(1+1) = \\ln 2\\).'
                },
                {
                    question: 'Verify the eta-zeta relation at \\(s=2\\): compute \\(\\eta(2) = \\pi^2/12\\) and \\(\\zeta(2) = \\pi^2/6\\), then check \\(\\eta(2) = (1 - 2^{1-2})\\zeta(2)\\).',
                    hint: 'Use the known values; compute \\(1 - 2^{-1} = 1/2\\).',
                    solution: '\\(1 - 2^{1-2} = 1 - 2^{-1} = 1/2\\). So the relation predicts \\(\\eta(2) = \\zeta(2)/2 = (\\pi^2/6)/2 = \\pi^2/12\\). One can verify \\(\\eta(2) = \\sum_n (-1)^{n+1}/n^2 = \\pi^2/12\\) directly by splitting into odd and even terms: \\(\\eta(2) = \\zeta(2) - 2\\sum_n (2n)^{-2} = \\zeta(2) - \\zeta(2)/2 = \\pi^2/12\\). \\(\\checkmark\\)'
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
<h2>The Pole at \\(s = 1\\)</h2>

<div class="env-block intuition">
    <div class="env-title">Harmonic Divergence is a Theorem</div>
    <div class="env-body">
        <p>The harmonic series \\(\\sum 1/n\\) diverges, but gently—like \\(\\log N\\). The simple pole of \\(\\zeta(s)\\) at \\(s=1\\) with residue 1 is the complex-analytic capture of this fact. The residue equals exactly 1, and the Laurent coefficient \\(-\\gamma\\) encodes the Euler-Mascheroni constant, measuring the deviation from the integral \\(\\int 1/x\\,dx\\).</p>
    </div>
</div>

<h3>The Laurent Expansion at \\(s = 1\\)</h3>

<div class="env-block theorem">
    <div class="env-title">Theorem 4.3 (Pole and Laurent Expansion)</div>
    <div class="env-body">
        <p>\\(\\zeta(s)\\) has a <strong>simple pole</strong> at \\(s=1\\) with residue 1, and the Laurent expansion begins</p>
        \\[\\zeta(s) = \\frac{1}{s-1} + \\gamma + \\gamma_1(s-1) + \\gamma_2(s-1)^2 + \\cdots\\]
        <p>where \\(\\gamma = \\lim_{N\\to\\infty}\\left(\\sum_{n=1}^N \\frac{1}{n} - \\log N\\right) \\approx 0.5772\\) is the Euler-Mascheroni constant, and \\(\\gamma_1, \\gamma_2, \\ldots\\) are the Stieltjes constants.</p>
    </div>
</div>

<div class="env-block proof">
    <div class="env-title">Proof sketch</div>
    <div class="env-body">
        <p>Use the Euler-Maclaurin formula to write</p>
        \\[\\sum_{n=1}^N \\frac{1}{n^s} = \\int_1^N \\frac{dx}{x^s} + \\frac{1}{2}\\left(1 + N^{-s}\\right) + s\\int_1^N \\frac{\\{x\\} - 1/2}{x^{s+1}}\\,dx,\\]
        <p>where \\(\\{x\\} = x - \\lfloor x\\rfloor\\). The first integral evaluates to \\((N^{1-s}-1)/(1-s)\\). As \\(N\\to\\infty\\) for \\(\\operatorname{Re}(s) > 0\\), the boundary term and fractional-part integral converge, yielding a meromorphic continuation with the stated pole. Expanding around \\(s=1\\) produces the Stieltjes expansion. \\(\\square\\)</p>
    </div>
</div>

<h3>Residue Computation</h3>

<p>The residue is</p>
\\[
\\operatorname{Res}_{s=1}\\zeta(s) = \\lim_{s \\to 1}(s-1)\\zeta(s).
\\]
<p>From the Euler-Maclaurin analysis, \\((s-1)\\zeta(s) \\to 1\\) as \\(s \\to 1\\). Equivalently, from the eta-zeta relation:</p>
\\[
(s-1)\\zeta(s) = \\frac{(s-1)}{1-2^{1-s}}\\,\\eta(s) \\xrightarrow{s\\to 1} \\frac{1}{\\log 2}\\,\\eta(1) = \\frac{\\ln 2}{\\ln 2} = 1.
\\]
<p>The residue 1 implies that prime counting functions behave like \\(x/\\log x\\) to leading order—the quantitative content of the Prime Number Theorem.</p>

<h3>Connection to the Prime Number Theorem</h3>

<p>The Prime Number Theorem states \\(\\pi(x) \\sim x/\\log x\\). Its proof requires two things about \\(\\zeta(s)\\):</p>
<ol>
    <li>\\(\\zeta(s)\\) has a simple pole of residue 1 at \\(s = 1\\) (which we have), and</li>
    <li>\\(\\zeta(s) \\neq 0\\) on the line \\(\\operatorname{Re}(s) = 1\\) (non-trivial, proved in Chapter 6).</li>
</ol>
<p>Together, via a Tauberian theorem applied to the logarithmic derivative \\(-\\zeta'/\\zeta\\), they imply PNT. The pole at \\(s=1\\) is not an anomaly to be worked around—it <em>is</em> the leading term of the prime distribution.</p>
`,
            visualizations: [],
            exercises: [
                {
                    question: 'Compute \\(\\lim_{s\\to 1}(s-1)\\zeta(s)\\) using the eta-zeta relation \\(\\zeta(s) = \\eta(s)/(1-2^{1-s})\\).',
                    hint: 'Use L\'Hopital or Taylor expansion for \\(1-2^{1-s}\\) near \\(s=1\\).',
                    solution: 'As \\(s \\to 1\\): \\(1 - 2^{1-s} = 1 - e^{(1-s)\\ln 2} \\approx (s-1)\\ln 2\\). So \\((s-1)/(1-2^{1-s}) \\to 1/\\ln 2\\). Since \\(\\eta(1) = \\ln 2\\), we get \\(\\lim_{s\\to 1}(s-1)\\zeta(s) = (1/\\ln 2)\\cdot \\ln 2 = 1\\). The residue is 1.'
                },
                {
                    question: 'Show that \\(\\zeta(s) - 1/(s-1)\\) extends to an entire function, i.e., is holomorphic everywhere (not just for \\(\\operatorname{Re}(s) > 0\\)).',
                    hint: 'Subtracting the principal part removes the pole. What does the Laurent expansion at \\(s=1\\) tell you?',
                    solution: 'The Laurent expansion \\(\\zeta(s) = (s-1)^{-1} + \\gamma + \\gamma_1(s-1)+\\cdots\\) shows that \\(\\zeta(s) - 1/(s-1)\\) has a removable singularity at \\(s=1\\) (the pole is exactly cancelled). Via the functional equation (Chapter 5), \\(\\zeta(s)\\) is analytic everywhere except \\(s=1\\), so \\(\\zeta(s) - 1/(s-1)\\) is entire.'
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
    <div class="env-title">Numbers in Unexpected Places</div>
    <div class="env-body">
        <p>Why should \\(1 + 1/4 + 1/9 + 1/16 + \\cdots = \\pi^2/6\\)? The answer is analytic: \\(\\pi\\) enters through the functional equation, through the sine product, through Fourier analysis. The appearance of \\(\\pi\\) in the values of \\(\\zeta\\) at positive even integers is one of mathematics' deepest coherences.</p>
    </div>
</div>

<h3>The Basel Problem: \\(\\zeta(2) = \\pi^2/6\\)</h3>

<div class="env-block theorem">
    <div class="env-title">Theorem 4.4 (Basel Problem, Euler 1734)</div>
    <div class="env-body">
        \\[\\zeta(2) = \\sum_{n=1}^{\\infty} \\frac{1}{n^2} = \\frac{\\pi^2}{6}.\\]
    </div>
</div>

<div class="env-block proof">
    <div class="env-title">Proof (via Parseval's identity)</div>
    <div class="env-body">
        <p>Consider \\(f(x) = x\\) on \\([-\\pi, \\pi]\\), extended by periodicity. Its Fourier series is</p>
        \\[f(x) = 2\\sum_{n=1}^\\infty \\frac{(-1)^{n+1}}{n}\\sin(nx).\\]
        <p>Parseval's theorem gives \\(\\frac{1}{\\pi}\\int_{-\\pi}^\\pi x^2\\,dx = 2\\sum_{n=1}^\\infty \\left(\\frac{2}{n}\\right)^2 / 2\\). The left side is \\(2\\pi^2/3\\). Solving: \\(\\sum 1/n^2 = \\pi^2/6\\). \\(\\square\\)</p>
    </div>
</div>

<h3>General Even Values: \\(\\zeta(2k)\\)</h3>

<p>For positive integers \\(k\\):</p>

\\[
\\zeta(2k) = \\frac{(-1)^{k+1}(2\\pi)^{2k}}{2\\,(2k)!}\\,B_{2k},
\\]

<p>where \\(B_{2k}\\) are the Bernoulli numbers (\\(B_2 = 1/6\\), \\(B_4 = -1/30\\), \\(B_6 = 1/42\\), \\(\\ldots\\)). For example:</p>

\\[
\\zeta(2) = \\frac{\\pi^2}{6}, \\quad
\\zeta(4) = \\frac{\\pi^4}{90}, \\quad
\\zeta(6) = \\frac{\\pi^6}{945}.
\\]

<p>This formula comes from the partial-fraction expansion of \\(\\pi\\cot(\\pi z)\\), or equivalently from the functional equation of \\(\\zeta(s)\\).</p>

<h3>Odd Values: An Open Mystery</h3>

<p>The values \\(\\zeta(3), \\zeta(5), \\zeta(7), \\ldots\\) at odd positive integers remain largely mysterious. Apéry proved in 1978 that \\(\\zeta(3)\\) is irrational (Apéry's constant \\(\\approx 1.202\\)), but no closed form in terms of \\(\\pi\\) is known. Whether \\(\\zeta(5)\\) is irrational is open.</p>

<h3>Trivial Zeros</h3>

<div class="env-block theorem">
    <div class="env-title">Theorem 4.5 (Trivial Zeros)</div>
    <div class="env-body">
        <p>\\(\\zeta(s) = 0\\) at \\(s = -2, -4, -6, \\ldots\\) (negative even integers). These are the <strong>trivial zeros</strong>.</p>
    </div>
</div>

<p>They arise from the functional equation (Chapter 5): the Gamma function \\(\\Gamma(s/2)\\) has poles at \\(s = 0, -2, -4, \\ldots\\), and these poles force \\(\\zeta(s)\\) to vanish at \\(s = -2, -4, \\ldots\\) so that the completed function \\(\\xi(s)\\) remains entire.</p>

<p>All other zeros of \\(\\zeta(s)\\) (the <strong>non-trivial zeros</strong>) lie in the critical strip \\(0 < \\operatorname{Re}(s) < 1\\). The Riemann Hypothesis asserts they all lie on the critical line \\(\\operatorname{Re}(s) = 1/2\\).</p>

<div class="viz-placeholder" data-viz="viz-special-values"></div>
`,
            visualizations: [
                {
                    id: 'viz-special-values',
                    title: 'Special Values and Convergence',
                    description: 'Bar chart of \\(\\zeta(2k)\\) for \\(k = 1, \\ldots, 8\\), each normalized by \\(\\pi^{2k}\\). The normalized values are rational (Bernoulli numbers). Hover over bars to see exact fractions.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 340,
                            originX: 70, originY: 290, scale: 1
                        });

                        // zeta(2k) / pi^(2k) = |B_{2k}| / (2 * (2k)!) * 2^(2k-1) ... use exact rationals
                        // zeta(2k) = (-1)^{k+1} (2pi)^{2k} B_{2k} / (2 (2k)!)
                        // normalized = zeta(2k)/pi^{2k} = (-1)^{k+1} 2^{2k} B_{2k} / (2 (2k)!)
                        var bernoulli = [1/6, -1/30, 1/42, -1/30, 5/66, -691/2730, 7/6, -3617/510];
                        var labels = ['1/6', '-1/30', '1/42', '-1/30', '5/66', '-691/2730', '7/6', '-3617/510'];
                        var zetaVals = [], normalizedVals = [];
                        for (var k = 1; k <= 8; k++) {
                            var B = bernoulli[k-1];
                            var fact = 1; for (var j=1; j<=2*k; j++) fact *= j;
                            var val = Math.pow(-1, k+1) * Math.pow(2*Math.PI, 2*k) * B / (2 * fact);
                            zetaVals.push(val);
                            var norm = Math.pow(-1, k+1) * Math.pow(2, 2*k) * B / (2 * fact);
                            normalizedVals.push(Math.abs(norm));
                        }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var barW = 42, gap = 18;
                            var startX = 80;
                            var chartBottom = 270, chartTop = 40;
                            var chartH = chartBottom - chartTop;
                            var maxV = 0.6;

                            // axes
                            ctx.strokeStyle = viz.colors.axis; ctx.lineWidth = 1.5;
                            ctx.beginPath(); ctx.moveTo(startX - 10, chartBottom); ctx.lineTo(viz.width - 20, chartBottom); ctx.stroke();

                            viz.screenText('\u03b6(2k) / \u03c0\u00b2\u1d4f  (normalized Bernoulli ratios)', viz.width/2, 18, viz.colors.white, 14);

                            for (var k = 0; k < 8; k++) {
                                var x = startX + k * (barW + gap);
                                var h = (normalizedVals[k] / maxV) * chartH;
                                if (h > chartH) h = chartH;

                                var col = k % 2 === 0 ? viz.colors.blue : viz.colors.teal;
                                ctx.fillStyle = col + 'bb';
                                ctx.fillRect(x, chartBottom - h, barW, h);
                                ctx.strokeStyle = col;
                                ctx.lineWidth = 1.5;
                                ctx.strokeRect(x, chartBottom - h, barW, h);

                                // k label
                                ctx.fillStyle = viz.colors.text;
                                ctx.font = '11px -apple-system,sans-serif';
                                ctx.textAlign = 'center'; ctx.textBaseline = 'top';
                                ctx.fillText('k=' + (k+1), x + barW/2, chartBottom + 4);

                                // zeta value
                                ctx.fillStyle = col;
                                ctx.font = '10px -apple-system,sans-serif';
                                ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
                                ctx.fillText('\u03b6(' + (2*(k+1)) + ')', x + barW/2, chartBottom - h - 14);
                                ctx.fillStyle = viz.colors.white;
                                ctx.fillText('\u2248' + zetaVals[k].toFixed(3), x + barW/2, chartBottom - h - 2);
                            }

                            // special annotation for k=1
                            ctx.fillStyle = viz.colors.yellow;
                            ctx.font = '11px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText('\u03c0\u00b2/6', startX + barW/2, chartTop + 4);
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Derive \\(\\zeta(2) = \\pi^2/6\\) using the product formula for \\(\\sin(\\pi z)\\): \\(\\sin(\\pi z) = \\pi z \\prod_{n=1}^\\infty (1 - z^2/n^2)\\).',
                    hint: 'Take logarithm, differentiate, or compare coefficients in the Taylor expansion.',
                    solution: 'Expand \\(\\ln\\sin(\\pi z) = \\ln(\\pi z) + \\sum_n \\ln(1 - z^2/n^2)\\). The Taylor expansion of \\(\\ln(1-u) = -u - u^2/2 - \\cdots\\) gives the \\(z^2\\) coefficient as \\(-\\sum_n 1/n^2\\) on one side. On the other, \\(\\ln\\sin(\\pi z) = \\ln(\\pi z) + \\sum_k c_k z^{2k}\\) and matching the \\(z^2\\) coefficient via the Taylor series of \\(\\sin\\) gives \\(-\\pi^2/6\\). Hence \\(\\sum 1/n^2 = \\pi^2/6\\).'
                },
                {
                    question: 'Compute \\(\\zeta(4)\\) using \\(\\zeta(4) = (\\pi^2/6)^2 \\cdot 2/5\\) or by applying Parseval to \\(f(x) = x^2\\) on \\([-\\pi,\\pi]\\). Verify the answer is \\(\\pi^4/90\\).',
                    hint: 'Use Parseval: \\(\\|f\\|^2 = \\pi \\sum |c_n|^2\\). Compute the Fourier coefficients of \\(x^2\\).',
                    solution: 'The Fourier series of \\(f(x)=x^2\\) is \\(\\pi^2/3 + 4\\sum_{n=1}^\\infty (-1)^n n^{-2}\\cos(nx)\\). Parseval: \\((1/\\pi)\\int_{-\\pi}^\\pi x^4\\,dx = (2\\pi^4/5)/\\pi = 2\\pi^4/5\\) on the left; the right gives \\((\\pi^2/3)^2 \\cdot 2/\\pi + 2\\sum_{n=1}^\\infty 16/n^4\\). Solving yields \\(\\sum 1/n^4 = \\pi^4/90\\).'
                }
            ]
        },

        // ================================================================
        // SECTION 6: Gamma Function and Xi Function
        // ================================================================
        {
            id: 'sec-gamma-xi',
            title: 'Gamma Function and Xi Function',
            content: `
<h2>The Gamma Function and the \\(\\xi\\) Function</h2>

<div class="env-block intuition">
    <div class="env-title">Completing the Picture</div>
    <div class="env-body">
        <p>The functional equation (Chapter 5) relates \\(\\zeta(s)\\) and \\(\\zeta(1-s)\\). To state it cleanly, one multiplies \\(\\zeta(s)\\) by a Gamma factor, forming the <em>completed</em> zeta function \\(\\xi(s)\\). The Gamma function provides the archimedean factor—the contribution of the "prime at infinity"—that makes the functional equation symmetric.</p>
    </div>
</div>

<h3>The Gamma Function</h3>

<div class="env-block definition">
    <div class="env-title">Definition 4.3</div>
    <div class="env-body">
        <p>For \\(\\operatorname{Re}(s) > 0\\):</p>
        \\[\\Gamma(s) = \\int_0^\\infty t^{s-1}\\,e^{-t}\\,dt.\\]
        <p>Key properties: \\(\\Gamma(s+1) = s\\,\\Gamma(s)\\), \\(\\Gamma(1) = 1\\), \\(\\Gamma(n) = (n-1)!\\) for \\(n \\in \\mathbb{Z}_{>0}\\), and \\(\\Gamma(1/2) = \\sqrt{\\pi}\\).</p>
    </div>
</div>

<p>The Gamma function is meromorphic on all of \\(\\mathbb{C}\\) with simple poles at \\(0, -1, -2, \\ldots\\) and no zeros. Its reciprocal \\(1/\\Gamma(s)\\) is entire. These poles, combined with the functional equation, are responsible for the trivial zeros of \\(\\zeta\\).</p>

<h3>Weierstrass Product and Reflection Formula</h3>

<p>Two key identities:</p>

\\[
\\frac{1}{\\Gamma(s)} = s\\,e^{\\gamma s} \\prod_{n=1}^\\infty \\left(1 + \\frac{s}{n}\\right)e^{-s/n}, \\qquad
\\Gamma(s)\\,\\Gamma(1-s) = \\frac{\\pi}{\\sin(\\pi s)}.
\\]

<p>The reflection formula \\(\\Gamma(s)\\Gamma(1-s) = \\pi/\\sin(\\pi s)\\) will be crucial: at integer arguments it relates to the trivial zeros, and it appears inside the functional equation of \\(\\zeta\\).</p>

<h3>The Completed Zeta Function \\(\\xi(s)\\)</h3>

<div class="env-block definition">
    <div class="env-title">Definition 4.4 (Xi function)</div>
    <div class="env-body">
        <p>Define</p>
        \\[\\xi(s) = \\frac{1}{2}s(s-1)\\,\\pi^{-s/2}\\,\\Gamma\\!\\left(\\frac{s}{2}\\right)\\,\\zeta(s).\\]
        <p>Equivalently, \\(\\xi(s) = \\frac{1}{2}s(s-1)\\Lambda(s)\\) where \\(\\Lambda(s) = \\pi^{-s/2}\\Gamma(s/2)\\zeta(s)\\) is the <em>completed zeta function</em>.</p>
    </div>
</div>

<p>The factors \\(s\\) and \\((s-1)\\) are included precisely to cancel the pole of \\(\\Gamma(s/2)\\) at \\(s=0\\) and the pole of \\(\\zeta(s)\\) at \\(s=1\\), making \\(\\xi(s)\\) an <strong>entire function</strong>.</p>

<h3>Symmetry of \\(\\xi\\)</h3>

<p>The functional equation (Theorem 5.1, Chapter 5) will tell us:</p>
\\[\\xi(s) = \\xi(1-s).\\]
<p>This reflects the symmetry \\(s \\leftrightarrow 1-s\\) of the critical strip about the line \\(\\operatorname{Re}(s) = 1/2\\). The non-trivial zeros of \\(\\zeta(s)\\) are exactly the zeros of \\(\\xi(s)\\), and the functional equation forces them to be symmetric about both the real axis (complex conjugation) and the critical line.</p>

<div class="viz-placeholder" data-viz="viz-gamma-function"></div>
`,
            visualizations: [
                {
                    id: 'viz-gamma-function',
                    title: 'The Gamma Function',
                    description: 'Plot of \\(\\Gamma(x)\\) for real \\(x\\). Observe the simple poles at non-positive integers and the rapid growth for large \\(x\\). Drag the slider to zoom into the poles.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 360,
                            originX: 240, originY: 200, scale: 55
                        });

                        var yMax = 5;
                        VizEngine.createSlider(controls, 'Y-range', 1, 15, yMax, 0.5, function(v) {
                            yMax = v; draw();
                        });

                        // Lanczos approximation of Gamma for real x
                        function gammaReal(x) {
                            if (x <= 0 && x === Math.floor(x)) return Infinity;
                            if (x < 0.5) {
                                return Math.PI / (Math.sin(Math.PI * x) * gammaReal(1 - x));
                            }
                            var g = 7;
                            var c = [0.99999999999980993,676.5203681218851,-1259.1392167224028,
                                771.32342877765313,-176.61502916214059,12.507343278686905,
                                -0.13857109526572012,9.9843695780195716e-6,1.5056327351493116e-7];
                            x -= 1;
                            var a = c[0];
                            var t = x + g + 0.5;
                            for (var i = 1; i < g + 2; i++) a += c[i] / (x + i);
                            return Math.sqrt(2*Math.PI) * Math.pow(t, x+0.5) * Math.exp(-t) * a;
                        }

                        function draw() {
                            viz.clear();
                            viz.drawGrid(1);
                            viz.drawAxes();

                            // clamp helper
                            function clamp(y) { return Math.max(-yMax, Math.min(yMax, y)); }

                            // Draw Gamma in segments (skip across poles)
                            var poles = [-5,-4,-3,-2,-1,0];
                            var segments = [[-5.95,-4.05],[-3.95,-2.05],[-1.95,-0.05],[0.05, 4.5]];

                            segments.forEach(function(seg) {
                                viz.ctx.strokeStyle = viz.colors.blue;
                                viz.ctx.lineWidth = 2;
                                viz.ctx.beginPath();
                                var started = false;
                                var steps = 200;
                                for (var i = 0; i <= steps; i++) {
                                    var x = seg[0] + (seg[1]-seg[0]) * i / steps;
                                    var y = gammaReal(x);
                                    if (!isFinite(y) || Math.abs(y) > yMax * 1.5) { started = false; continue; }
                                    var [sx, sy] = viz.toScreen(x, y);
                                    if (!started) { viz.ctx.moveTo(sx, sy); started = true; } else { viz.ctx.lineTo(sx, sy); }
                                }
                                viz.ctx.stroke();
                            });

                            // Mark poles
                            poles.forEach(function(p) {
                                if (p >= -5) {
                                    var [sx] = viz.toScreen(p, 0);
                                    viz.ctx.strokeStyle = viz.colors.red + '88';
                                    viz.ctx.lineWidth = 1;
                                    viz.ctx.setLineDash([4,3]);
                                    viz.ctx.beginPath(); viz.ctx.moveTo(sx, 0); viz.ctx.lineTo(sx, viz.height); viz.ctx.stroke();
                                    viz.ctx.setLineDash([]);
                                }
                            });

                            // Mark Gamma(1/2) = sqrt(pi)
                            var gHalf = Math.sqrt(Math.PI);
                            viz.drawPoint(0.5, gHalf, viz.colors.orange, '\u0393(1/2)=\u221a\u03c0', 4);
                            // Mark Gamma(1) = 1
                            viz.drawPoint(1, 1, viz.colors.teal, '\u0393(1)=1', 4);

                            viz.screenText('\u0393(x): poles at x = 0, -1, -2, \u2026', viz.width/2, 16, viz.colors.white, 14);

                            // y-axis limits
                            viz.ctx.save();
                            viz.ctx.fillStyle = viz.colors.text;
                            viz.ctx.font = '10px -apple-system,sans-serif';
                            viz.ctx.textAlign = 'right';
                            viz.ctx.textBaseline = 'middle';
                            var [,syMax] = viz.toScreen(0, yMax);
                            var [,syMin] = viz.toScreen(0, -yMax);
                            viz.ctx.fillText('+'+yMax.toFixed(1), viz.originX-6, syMax);
                            viz.ctx.fillText('-'+yMax.toFixed(1), viz.originX-6, syMin);
                            viz.ctx.restore();
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Verify that \\(\\Gamma(1/2) = \\sqrt{\\pi}\\) using the Gaussian integral \\(\\int_{-\\infty}^\\infty e^{-x^2}\\,dx = \\sqrt{\\pi}\\).',
                    hint: 'Substitute \\(t = x^2\\) in the definition \\(\\Gamma(1/2) = \\int_0^\\infty t^{-1/2}e^{-t}\\,dt\\).',
                    solution: 'Set \\(t = x^2\\), \\(dt = 2x\\,dx\\): \\(\\Gamma(1/2) = \\int_0^\\infty x^{-1}e^{-x^2}\\cdot 2x\\,dx = 2\\int_0^\\infty e^{-x^2}\\,dx = \\int_{-\\infty}^\\infty e^{-x^2}\\,dx = \\sqrt{\\pi}\\).'
                },
                {
                    question: 'Using \\(\\Gamma(s+1) = s\\,\\Gamma(s)\\) repeatedly, express \\(\\Gamma(s/2)\\) near \\(s = 0\\) as a simple pole with residue 2. Hence show the factor \\(\\pi^{-s/2}\\Gamma(s/2)\\zeta(s)\\) is regular at \\(s=0\\).',
                    hint: 'Near \\(s=0\\): \\(\\Gamma(s/2) \\approx 2/s\\). Also compute \\(\\zeta(0) = -1/2\\).',
                    solution: '\\(\\Gamma(s/2) = (2/s)\\Gamma(1+s/2) \\to 2/s\\) as \\(s\\to 0\\). Meanwhile \\(\\pi^{-s/2} \\to 1\\) and \\(\\zeta(0) = -1/2\\) (from the functional equation or Bernoulli number: \\(\\zeta(0) = -B_1 = -(-1/2) = -1/2\\)). So \\(\\pi^{-s/2}\\Gamma(s/2)\\zeta(s) \\approx (2/s)\\cdot(-1/2) = -1/s\\). The additional factor \\((1/2)s(s-1)\\) in \\(\\xi\\) then cancels this pole.'
                }
            ]
        },

        // ================================================================
        // SECTION 7: The Functional Equation Awaits
        // ================================================================
        {
            id: 'sec-bridge',
            title: 'The Functional Equation Awaits',
            content: `
<h2>The Functional Equation Awaits</h2>

<div class="env-block intuition">
    <div class="env-title">What We Have Built</div>
    <div class="env-body">
        <p>We have defined \\(\\zeta(s)\\) for \\(\\operatorname{Re}(s) > 1\\), extended it to \\(\\operatorname{Re}(s) > 0\\) via \\(\\eta(s)\\), located its pole at \\(s=1\\) with residue 1, evaluated it at positive even integers, identified the trivial zeros, and introduced the completed function \\(\\xi(s)\\). The final step—extending \\(\\zeta\\) to all of \\(\\mathbb{C}\\) and revealing the symmetry \\(\\xi(s) = \\xi(1-s)\\)—is the functional equation.</p>
    </div>
</div>

<h3>Statement of the Functional Equation</h3>

<div class="env-block theorem">
    <div class="env-title">Theorem 4.6 (Functional Equation, Riemann 1859)</div>
    <div class="env-body">
        <p>The completed zeta function \\(\\xi(s) = \\frac{1}{2}s(s-1)\\pi^{-s/2}\\Gamma(s/2)\\zeta(s)\\) extends to an <strong>entire function</strong> satisfying</p>
        \\[\\xi(s) = \\xi(1-s).\\]
        <p>Equivalently, \\(\\zeta(s) = 2^s \\pi^{s-1}\\sin\\!\\left(\\frac{\\pi s}{2}\\right)\\Gamma(1-s)\\,\\zeta(1-s).\\]</p>
    </div>
</div>

<p>The proof (Chapter 5) uses the theta function \\(\\vartheta(t) = \\sum_{n=-\\infty}^\\infty e^{-\\pi n^2 t}\\) and the Poisson summation formula, which transforms the sum over integers at scale \\(t\\) into a sum at scale \\(1/t\\). This is deep: the functional equation encodes the automorphic symmetry of \\(\\mathbb{Z}\\) inside \\(\\mathbb{R}\\).</p>

<h3>Consequences</h3>

<p><strong>1. Global meromorphic continuation.</strong> The functional equation, combined with the continuation to \\(\\operatorname{Re}(s) > 0\\), yields \\(\\zeta(s)\\) meromorphic on all of \\(\\mathbb{C}\\) with a single pole at \\(s=1\\).</p>

<p><strong>2. Trivial zeros confirmed.</strong> For \\(s = -2k\\) (\\(k \\geq 1\\)), the factor \\(\\sin(\\pi s/2) = \\sin(-k\\pi) = 0\\) makes the right side vanish (while \\(\\zeta(1-s) = \\zeta(1+2k)\\) is finite and non-zero), so \\(\\zeta(-2k) = 0\\).</p>

<p><strong>3. Values at negative integers.</strong> The functional equation gives</p>
\\[\\zeta(-m) = \\frac{(-1)^m B_{m+1}}{m+1}, \\qquad m \\geq 1.\\]
<p>In particular \\(\\zeta(0) = -1/2\\), \\(\\zeta(-1) = -1/12\\), \\(\\zeta(-3) = 1/120\\). The famously provocative "\\(1+2+3+\\cdots = -1/12\\)" is the statement \\(\\zeta(-1) = -1/12\\) in disguise: a regularization of a divergent series via analytic continuation, not a literal equality.</p>

<p><strong>4. The critical strip.</strong> The only non-trivial zeros lie in \\(0 < \\operatorname{Re}(s) < 1\\), symmetric about \\(\\operatorname{Re}(s)=1/2\\) and about the real axis. The Riemann Hypothesis conjectures they all lie on \\(\\operatorname{Re}(s)=1/2\\).</p>

<div class="viz-placeholder" data-viz="viz-critical-line"></div>

<h3>The Road Ahead</h3>

<p>Chapter 5 proves the functional equation via theta functions. Chapter 6 establishes the zero-free region \\(\\{\\operatorname{Re}(s) > 1 - c/\\log|t|\\}\\) which is the quantitative heart of the Prime Number Theorem with error term. The interplay between the zeros of \\(\\zeta\\) and the distribution of primes—made precise by the Explicit Formula (Chapter 8)—is the central subject of analytic number theory.</p>

<div class="env-block remark">
    <div class="env-title">The Riemann Hypothesis</div>
    <div class="env-body">
        <p>Riemann's 1859 memoir computed the first few non-trivial zeros numerically and conjectured that all lie on \\(\\operatorname{Re}(s) = 1/2\\). This remains unproven. It is equivalent to the best possible error bound in the Prime Number Theorem: \\(\\pi(x) = \\operatorname{Li}(x) + O(\\sqrt{x}\\log x)\\). Every approach to understanding primes eventually runs into the zeros of \\(\\zeta(s)\\), and the Riemann Hypothesis is the master question about those zeros.</p>
    </div>
</div>
`,
            visualizations: [
                {
                    id: 'viz-critical-line',
                    title: 'Zeta on the Critical Line',
                    description: 'Plot of \\(|\\zeta(1/2 + it)|\\) for real \\(t\\). The zeros appear where the curve touches zero. Drag the slider to explore the range of \\(t\\). The first zero is near \\(t \\approx 14.134\\).',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 320,
                            originX: 60, originY: 270, scale: 1
                        });

                        var tMin = 0, tMax = 50;
                        VizEngine.createSlider(controls, 't-min', 0, 100, tMin, 1, function(v) {
                            tMin = v; if (tMin >= tMax - 5) tMax = tMin + 10; draw();
                        });
                        VizEngine.createSlider(controls, 't-max', 10, 150, tMax, 1, function(v) {
                            tMax = v; if (tMax <= tMin + 5) tMin = Math.max(0, tMax - 10); draw();
                        });

                        // Borwein algorithm for zeta(1/2 + it)
                        function zetaHalfIt(t) {
                            var s_re = 0.5, s_im = t;
                            var N = 60;
                            // eta via alternating series
                            var re = 0, im = 0;
                            for (var n = 1; n <= N; n++) {
                                // n^{-s} = exp(-s ln n) = exp(-0.5 ln n - it ln n)
                                var logn = Math.log(n);
                                var mag = Math.exp(-s_re * logn);
                                var arg = -s_im * logn;
                                var sign = (n % 2 === 1) ? 1 : -1;
                                re += sign * mag * Math.cos(arg);
                                im += sign * mag * Math.sin(arg);
                            }
                            // divide by (1 - 2^{1-s})
                            var logTwo = Math.log(2);
                            var a = 1 - Math.exp((1 - s_re) * logTwo) * Math.cos((1 - s_re) * 0 - s_im * logTwo);
                            // 2^{1-s} = exp((1-s) log 2) where 1-s = (0.5 - it)
                            var pow2_re = Math.exp((1 - s_re) * logTwo) * Math.cos(-s_im * logTwo);
                            var pow2_im = Math.exp((1 - s_re) * logTwo) * Math.sin(-s_im * logTwo);
                            var denom_re = 1 - pow2_re, denom_im = -pow2_im;
                            var denom2 = denom_re * denom_re + denom_im * denom_im;
                            if (denom2 < 1e-30) return 0;
                            var res_re = (re * denom_re + im * denom_im) / denom2;
                            var res_im = (im * denom_re - re * denom_im) / denom2;
                            return Math.sqrt(res_re * res_re + res_im * res_im);
                        }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var left = 60, right = viz.width - 20;
                            var bottom = 260, top = 30;
                            var chartH = bottom - top;
                            var maxMag = 5;
                            var tRange = tMax - tMin;

                            // axes
                            ctx.strokeStyle = viz.colors.axis; ctx.lineWidth = 1.5;
                            ctx.beginPath(); ctx.moveTo(left, bottom); ctx.lineTo(right, bottom); ctx.stroke();
                            ctx.beginPath(); ctx.moveTo(left, top); ctx.lineTo(left, bottom); ctx.stroke();

                            // t-axis labels
                            ctx.fillStyle = viz.colors.text; ctx.font = '10px -apple-system,sans-serif';
                            ctx.textAlign = 'center'; ctx.textBaseline = 'top';
                            var tStep = tRange > 40 ? 10 : 5;
                            for (var tt = Math.ceil(tMin/tStep)*tStep; tt <= tMax; tt += tStep) {
                                var px = left + (tt - tMin) / tRange * (right - left);
                                ctx.fillText(tt, px, bottom + 4);
                                ctx.strokeStyle = viz.colors.grid; ctx.lineWidth = 0.5;
                                ctx.beginPath(); ctx.moveTo(px, top); ctx.lineTo(px, bottom); ctx.stroke();
                            }

                            // y-axis labels
                            ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
                            for (var y = 0; y <= maxMag; y++) {
                                var py = bottom - (y / maxMag) * chartH;
                                ctx.fillStyle = viz.colors.text;
                                ctx.fillText(y, left - 4, py);
                            }

                            // Draw |zeta(1/2 + it)|
                            var steps = 400;
                            ctx.strokeStyle = viz.colors.blue; ctx.lineWidth = 2;
                            ctx.beginPath();
                            var started = false;
                            for (var i = 0; i <= steps; i++) {
                                var t = tMin + (tMax - tMin) * i / steps;
                                var mag = zetaHalfIt(t);
                                var py2 = bottom - Math.min(mag / maxMag, 1.05) * chartH;
                                var px2 = left + (t - tMin) / tRange * (right - left);
                                if (!started) { ctx.moveTo(px2, py2); started = true; } else { ctx.lineTo(px2, py2); }
                            }
                            ctx.stroke();

                            // Zero line
                            ctx.strokeStyle = viz.colors.red + '66'; ctx.lineWidth = 1;
                            ctx.setLineDash([4,3]);
                            ctx.beginPath(); ctx.moveTo(left, bottom); ctx.lineTo(right, bottom); ctx.stroke();
                            ctx.setLineDash([]);

                            viz.screenText('|\u03b6(1/2 + it)|  —  zeros touch the axis', viz.width/2, 14, viz.colors.white, 14);
                            viz.screenText('First zero near t \u2248 14.134', viz.width/2, 32, viz.colors.text, 11);
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Use the functional equation to compute \\(\\zeta(-1)\\). Show that it gives \\(-1/12\\).',
                    hint: 'Set \\(s = -1\\) in \\(\\zeta(s) = 2^s\\pi^{s-1}\\sin(\\pi s/2)\\Gamma(1-s)\\zeta(1-s)\\). Evaluate \\(\\sin(-\\pi/2)\\), \\(\\Gamma(2) = 1\\), \\(\\zeta(2) = \\pi^2/6\\).',
                    solution: '\\(\\zeta(-1) = 2^{-1}\\pi^{-2}\\sin(-\\pi/2)\\,\\Gamma(2)\\,\\zeta(2) = \\frac{1}{2}\\cdot\\frac{1}{\\pi^2}\\cdot(-1)\\cdot 1\\cdot\\frac{\\pi^2}{6} = -\\frac{1}{12}\\). \\(\\checkmark\\)'
                },
                {
                    question: 'Verify that \\(\\xi(s) = \\xi(1-s)\\) implies non-trivial zeros come in pairs \\(\\{\\rho, 1-\\rho\\}\\). Show also that complex conjugation gives pairs \\(\\{\\rho, \\bar{\\rho}\\}\\).',
                    hint: 'If \\(\\xi(\\rho) = 0\\), apply the symmetry \\(\\xi(s)=\\xi(1-s)\\) and the reality condition \\(\\overline{\\xi(s)} = \\xi(\\bar{s})\\).',
                    solution: 'If \\(\\xi(\\rho)=0\\), then \\(\\xi(1-\\rho) = \\xi(\\rho) = 0\\), so \\(1-\\rho\\) is also a zero. For conjugation: \\(\\zeta(s)\\) has real coefficients, so \\(\\overline{\\zeta(s)} = \\zeta(\\bar{s})\\); the same holds for \\(\\xi\\). Hence \\(\\xi(\\bar{\\rho}) = \\overline{\\xi(\\rho)} = 0\\). Combining: zeros come in quadruples \\(\\{\\rho, 1-\\rho, \\bar\\rho, 1-\\bar\\rho\\}\\), collapsing to pairs when \\(\\rho\\) is real or on the critical line.'
                },
                {
                    question: 'Compute \\(\\zeta(0)\\) two ways: (a) directly from the eta relation and \\(\\eta(0) = 1/2\\); (b) from the functional equation setting \\(s \\to 0\\).',
                    hint: 'For (a): \\(1 - 2^{1-0} = -1\\), so \\(\\zeta(0) = \\eta(0)/(-1)\\). For (b): use \\(\\sin(0) = 0\\) and L\'Hopital.',
                    solution: '(a) \\(\\eta(0) = 1 - 1 + 1 - \\cdots = 1/2\\) (Cesaro/Abel sum). \\(\\zeta(0) = \\eta(0)/(1-2) = (1/2)/(-1) = -1/2\\). (b) As \\(s\\to 0\\): \\(\\sin(\\pi s/2) \\approx \\pi s/2\\), \\(2^s \\to 1\\), \\(\\pi^{s-1} \\to 1/\\pi\\), \\(\\Gamma(1-s) \\to 1\\), \\(\\zeta(1-s) = \\zeta(1) \\sim 1/s\\). So \\(\\zeta(s) \\approx 1 \\cdot (1/\\pi) \\cdot (\\pi s/2) \\cdot 1 \\cdot (1/s) = 1/2\\). Wait—we get \\(\\zeta(0) = -1/2\\) by this limit, noting care with signs: \\(\\zeta(1-s)\\) near \\(s=0\\) is \\(\\zeta(1-s) \\approx 1/(1-s-1) = -1/s\\) (pole of \\(\\zeta\\) at 1). So \\(\\zeta(s) \\approx (1/\\pi)(\\pi s/2)\\cdot(-1/s) = -1/2\\).'
                }
            ]
        }

    ]  // end sections
});
