window.CHAPTERS = window.CHAPTERS || [];
window.CHAPTERS.push({
    id: 'ch05',
    number: 5,
    title: 'Analytic Continuation & Functional Equation',
    subtitle: 'Revealing the hidden symmetry s \u2194 1\u2212s',
    sections: [

        // ================================================================
        // SECTION 1: Beyond the Half-Plane
        // ================================================================
        {
            id: 'sec-motivation',
            title: 'Beyond the Half-Plane',
            content: `
<h2>Beyond the Half-Plane</h2>

<div class="env-block intuition">
    <div class="env-title">The Fundamental Problem</div>
    <div class="env-body">
        <p>The Dirichlet series \\(\\zeta(s) = \\sum_{n=1}^{\\infty} n^{-s}\\) converges absolutely for \\(\\text{Re}(s) > 1\\). Yet Riemann's 1859 memoir treats \\(\\zeta(s)\\) as a function on all of \\(\\mathbb{C}\\) (minus the pole at \\(s=1\\)). How does one legitimately define \\(\\zeta(-2) = 0\\) or \\(\\zeta(-1) = -1/12\\) when the series diverges so wildly for \\(\\text{Re}(s) \\leq 1\\)?</p>
        <p>The answer is <em>analytic continuation</em>, one of the most powerful ideas in complex analysis: an analytic function defined on an open set has at most one extension to any connected domain. If we can construct the extension by any method, the result is unique.</p>
    </div>
</div>

<p>Recall from Chapter 4 that \\(\\zeta(s)\\) is defined by</p>
\\[\\zeta(s) = \\sum_{n=1}^{\\infty} \\frac{1}{n^s}, \\quad \\text{Re}(s) > 1.\\]
<p>We showed it admits a meromorphic continuation to \\(\\text{Re}(s) > 0\\) via the formula</p>
\\[\\zeta(s) = \\frac{s}{s-1} - s \\int_1^{\\infty} \\frac{\\{x\\}}{x^{s+1}}\\,dx, \\quad \\text{Re}(s) > 0,\\]
<p>where \\(\\{x\\} = x - \\lfloor x \\rfloor\\) is the fractional part. But this only crosses the first line \\(\\text{Re}(s)=1\\). The trivial zeros at \\(s = -2, -4, -6, \\ldots\\) and the non-trivial zeros in the critical strip \\(0 < \\text{Re}(s) < 1\\) are all to the left of \\(\\text{Re}(s) = 0\\). To reach them, we need continuation to all of \\(\\mathbb{C}\\).</p>

<h3>The Strategy: Three Routes to Global Continuation</h3>
<p>Riemann's memoir presents what amounts to three interlocking approaches, each illuminating a different aspect of the zeta function:</p>

<div class="env-block definition">
    <div class="env-title">Three Roads to Analytic Continuation</div>
    <div class="env-body">
        <ol>
            <li><strong>Via the theta function:</strong> Express \\(\\zeta(s)\\) in terms of the Jacobi theta function \\(\\vartheta(t) = \\sum_{n=-\\infty}^{\\infty} e^{-\\pi n^2 t}\\), exploit its modular transformation \\(\\vartheta(1/t) = t^{1/2}\\vartheta(t)\\), and obtain both the continuation and the functional equation simultaneously.</li>
            <li><strong>Via the Hankel contour:</strong> Replace the integral definition of \\(\\Gamma(s)\\) by a contour integral that converges everywhere, yielding a formula for \\(\\zeta(s)\\Gamma(s)\\) as a contour integral valid for all \\(s\\).</li>
            <li><strong>Via the Hurwitz zeta function:</strong> Extend to a family \\(\\zeta(s, a)\\), prove the functional equation for this family, and recover \\(\\zeta(s)\\) as the special case \\(a = 1\\).</li>
        </ol>
    </div>
</div>

<p>All three routes arrive at the same destination: the <em>completed zeta function</em></p>
\\[\\xi(s) = \\frac{1}{2}s(s-1)\\pi^{-s/2}\\Gamma(s/2)\\zeta(s),\\]
<p>which is entire and satisfies \\(\\xi(s) = \\xi(1-s)\\). This symmetric object is the natural home of the zeta function.</p>

<h3>What the Functional Equation Means Geometrically</h3>
<p>The map \\(s \\mapsto 1-s\\) is a reflection across the critical line \\(\\text{Re}(s) = 1/2\\). The functional equation \\(\\xi(s) = \\xi(1-s)\\) says the completed zeta function is symmetric under this reflection. Concretely:</p>
<ul>
    <li>If \\(\\rho\\) is a zero of \\(\\zeta(s)\\), then \\(1-\\rho\\) is also a zero. (By the reflection principle for real coefficients, so are \\(\\bar{\\rho}\\) and \\(1-\\bar{\\rho}\\).)</li>
    <li>The trivial zeros at \\(s = -2, -4, \\ldots\\) come from poles of \\(\\Gamma(s/2)\\); the non-trivial zeros lie in the critical strip and are paired symmetrically about \\(\\text{Re}(s) = 1/2\\).</li>
    <li>The Riemann Hypothesis asserts that <em>all</em> non-trivial zeros lie exactly on \\(\\text{Re}(s) = 1/2\\).</li>
</ul>

<div class="env-block remark">
    <div class="env-title">Why This Chapter Is the Pivot of the Course</div>
    <div class="env-body">
        <p>Everything that precedes this chapter (arithmetic functions, Dirichlet series, the Euler product) was preparation. Everything that follows (zero-free regions, the PNT, explicit formulas, L-functions) depends on the global analytic properties established here. The functional equation is not merely an elegant symmetry: it is a computational tool. It allows us to evaluate \\(\\zeta(s)\\) for \\(\\text{Re}(s) &lt; 0\\) from values for \\(\\text{Re}(s) > 1\\), and vice versa. Perron's formula, developed in Section 6, converts this analytic information back into arithmetic — the density of primes.</p>
    </div>
</div>
`,
            visualizations: [
                {
                    id: 'viz-poisson-duality',
                    title: 'Poisson Summation: The Engine Behind the Functional Equation',
                    description: 'The Poisson summation formula \\(\\sum_n f(n) = \\sum_n \\hat{f}(n)\\) connects a sum over a lattice to a sum over the dual lattice. Drag the slider to change the width parameter \\(t\\) of a Gaussian and watch both the function and its transform respond symmetrically.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, { width: 580, height: 360, originX: 290, originY: 180, scale: 45 });
                        var t = 1.0;

                        VizEngine.createSlider(controls, 't (width)', 0.2, 3.0, t, 0.05, function(v) { t = v; draw(); });

                        function gaussianSum(tVal, N) {
                            // f(x) = exp(-pi x^2 t), sum over n = -N..N
                            var s = 0;
                            for (var n = -N; n <= N; n++) s += Math.exp(-Math.PI * n * n * tVal);
                            return s;
                        }
                        function dualSum(tVal, N) {
                            // hat{f}(n) = (1/sqrt(t)) exp(-pi n^2 / t)
                            var s = 0;
                            for (var n = -N; n <= N; n++) s += Math.exp(-Math.PI * n * n / tVal) / Math.sqrt(tVal);
                            return s;
                        }

                        function draw() {
                            viz.clear();
                            viz.drawGrid(1);
                            viz.drawAxes();

                            var ctx = viz.ctx;
                            var N = 5;

                            // Draw f(x) = exp(-pi x^2 t) as curve
                            viz.drawFunction(function(x) { return Math.exp(-Math.PI * x * x * t); }, -3, 3, viz.colors.blue, 2.5);
                            // Draw dual f-hat(x) = (1/sqrt(t)) exp(-pi x^2 / t)
                            viz.drawFunction(function(x) { return Math.exp(-Math.PI * x * x / t) / Math.sqrt(t); }, -3, 3, viz.colors.orange, 2, );

                            // Draw sample points for lattice sums
                            for (var n = -N; n <= N; n++) {
                                var yf = Math.exp(-Math.PI * n * n * t);
                                var yg = Math.exp(-Math.PI * n * n / t) / Math.sqrt(t);
                                viz.drawPoint(n, yf, viz.colors.blue, null, 4);
                                viz.drawPoint(n, yg, viz.colors.orange, null, 4);
                            }

                            var sf = gaussianSum(t, 8);
                            var sg = dualSum(t, 8);

                            // Labels
                            viz.screenText('f(x) = e^(-\u03C0x\u00B2t)', 80, 28, viz.colors.blue, 13);
                            viz.screenText('\u0192\u0302(x) = (1/\u221At) e^(-\u03C0x\u00B2/t)', 80, 48, viz.colors.orange, 13);
                            viz.screenText('Poisson: \u03A3f(n) = \u03A3\u0192\u0302(n)', viz.width / 2, viz.height - 28, viz.colors.white, 13);
                            viz.screenText('\u03A3f(n) = ' + sf.toFixed(6), viz.width / 2 - 80, viz.height - 12, viz.colors.blue, 11);
                            viz.screenText('\u03A3\u0192\u0302(n) = ' + sg.toFixed(6), viz.width / 2 + 80, viz.height - 12, viz.colors.orange, 11);
                            viz.screenText('t = ' + t.toFixed(2), viz.width - 60, 20, viz.colors.white, 12);
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'The Euler-Maclaurin formula gives \\(\\zeta(s) = \\frac{s}{s-1} - s\\int_1^\\infty \\frac{\\{x\\}}{x^{s+1}}\\,dx\\) for \\(\\text{Re}(s)>0\\). Show this integral converges absolutely for \\(\\text{Re}(s) > 0\\) and deduce that \\(\\zeta(s)\\) has a simple pole at \\(s=1\\) with residue 1, and is analytic elsewhere in \\(\\text{Re}(s)>0\\).',
                    hint: 'Bound \\(|\\{x\\}| \\leq 1\\) and estimate \\(\\int_1^\\infty x^{-(\\sigma+1)}\\,dx\\) for \\(\\sigma = \\text{Re}(s)\\). For the pole, expand \\(s/(s-1)\\) near \\(s=1\\).',
                    solution: 'Since \\(0 \\leq \\{x\\} < 1\\), the integral satisfies \\(\\left|\\int_1^\\infty \\{x\\}x^{-s-1}\\,dx\\right| \\leq \\int_1^\\infty x^{-\\sigma-1}\\,dx = 1/\\sigma\\), which converges for \\(\\sigma > 0\\). The integral thus defines an analytic function in \\(\\text{Re}(s)>0\\). Near \\(s=1\\), the term \\(s/(s-1)\\) contributes a simple pole with residue 1, while the integral term is analytic at \\(s=1\\) (contributing \\(-1\\) to the Laurent expansion, consistent with \\(\\zeta(s) = 1/(s-1) + \\gamma + O(s-1)\\)).'
                }
            ]
        },

        // ================================================================
        // SECTION 2: Jacobi Theta Function
        // ================================================================
        {
            id: 'sec-theta',
            title: 'Jacobi Theta Function',
            content: `
<h2>The Jacobi Theta Function</h2>

<div class="env-block definition">
    <div class="env-title">Definition (Jacobi Theta Function)</div>
    <div class="env-body">
        <p>For \\(t > 0\\), define</p>
        \\[\\vartheta(t) = \\sum_{n=-\\infty}^{\\infty} e^{-\\pi n^2 t} = 1 + 2\\sum_{n=1}^{\\infty} e^{-\\pi n^2 t}.\\]
        <p>More generally, for \\(\\tau\\) in the upper half-plane \\(\\mathcal{H} = \\{\\tau : \\text{Im}(\\tau) > 0\\}\\), the Jacobi theta function is \\(\\vartheta(\\tau) = \\sum_{n \\in \\mathbb{Z}} e^{\\pi i n^2 \\tau}\\). We work with the real restriction \\(\\tau = it\\), \\(t > 0\\).</p>
    </div>
</div>

<p>The theta function is a bridge between analysis and arithmetic. Roughly, its "size" encodes information about sums of squares, and the symmetry we are about to establish reflects a deep duality.</p>

<h3>The Modular Transformation</h3>

<div class="env-block theorem">
    <div class="env-title">Theorem 5.1 (Modular Relation for \\(\\vartheta\\))</div>
    <div class="env-body">
        <p>For all \\(t > 0\\),</p>
        \\[\\vartheta(1/t) = t^{1/2} \\cdot \\vartheta(t).\\]
    </div>
</div>

<div class="env-block proof">
    <div class="env-title">Proof (via Poisson Summation)</div>
    <div class="env-body">
        <p>Apply the Poisson summation formula: if \\(f \\in L^1(\\mathbb{R})\\) with Fourier transform \\(\\hat{f}(\\xi) = \\int_{-\\infty}^{\\infty} f(x)e^{-2\\pi i x \\xi}\\,dx\\), then</p>
        \\[\\sum_{n \\in \\mathbb{Z}} f(n) = \\sum_{n \\in \\mathbb{Z}} \\hat{f}(n).\\]
        <p>Take \\(f(x) = e^{-\\pi t x^2}\\). Its Fourier transform is</p>
        \\[\\hat{f}(\\xi) = \\int_{-\\infty}^{\\infty} e^{-\\pi t x^2} e^{-2\\pi i x \\xi}\\,dx.\\]
        <p>Complete the square in the exponent: \\(-\\pi t x^2 - 2\\pi i x \\xi = -\\pi t (x + i\\xi/t)^2 - \\pi \\xi^2/t\\). Contour shifting (valid by Cauchy's theorem since the Gaussian decays rapidly) gives</p>
        \\[\\hat{f}(\\xi) = e^{-\\pi \\xi^2/t} \\int_{-\\infty}^{\\infty} e^{-\\pi t u^2}\\,du = \\frac{1}{\\sqrt{t}} e^{-\\pi \\xi^2/t}.\\]
        <p>Applying Poisson summation:</p>
        \\[\\vartheta(t) = \\sum_n e^{-\\pi n^2 t} = \\sum_n \\frac{1}{\\sqrt{t}} e^{-\\pi n^2/t} = \\frac{1}{\\sqrt{t}} \\vartheta(1/t). \\qquad \\square\\]
    </div>
</div>

<h3>Asymptotic Behavior</h3>
<p>The modular relation encodes a remarkable asymptotic exchange:</p>
<ul>
    <li>As \\(t \\to \\infty\\): \\(\\vartheta(t) \\to 1\\) since all terms \\(e^{-\\pi n^2 t} \\to 0\\) for \\(n \\neq 0\\).</li>
    <li>As \\(t \\to 0^+\\): by the modular relation, \\(\\vartheta(t) = t^{-1/2}\\vartheta(1/t) \\sim t^{-1/2}\\) since \\(\\vartheta(1/t) \\to 1\\).</li>
</ul>
<p>So \\(\\vartheta(t) - 1 \\sim 2e^{-\\pi t}\\) for large \\(t\\), and \\(\\vartheta(t) - t^{-1/2} \\sim 2t^{-1/2}e^{-\\pi/t}\\) for small \\(t\\). Both transitions are exponentially fast.</p>

<div class="env-block definition">
    <div class="env-title">Definition (Completed Theta: Splitting at \\(t=1\\))</div>
    <div class="env-body">
        <p>Write \\(\\psi(t) = \\frac{1}{2}(\\vartheta(t) - 1) = \\sum_{n=1}^{\\infty} e^{-\\pi n^2 t}\\). The modular relation becomes</p>
        \\[\\psi(1/t) = t^{1/2}\\psi(t) + \\frac{1}{2}(t^{1/2} - 1).\\]
        <p>This is the form used to split the Mellin integral at \\(t=1\\) and derive the functional equation (Section 4).</p>
    </div>
</div>

<h3>Connection to Representation by Squares</h3>
<p>The theta function encodes arithmetic. Note that \\(\\vartheta(t)^k = \\sum_{n_1, \\ldots, n_k \\in \\mathbb{Z}} e^{-\\pi(n_1^2 + \\cdots + n_k^2)t} = \\sum_{n=0}^{\\infty} r_k(n) e^{-\\pi n t}\\), where \\(r_k(n)\\) is the number of representations of \\(n\\) as a sum of \\(k\\) squares. This connection between theta functions and arithmetic is the prototype for the Circle Method (Chapter 15).</p>
`,
            visualizations: [],
            exercises: [
                {
                    question: 'Verify directly that the Fourier transform of \\(f(x) = e^{-\\pi t x^2}\\) is \\(\\hat{f}(\\xi) = t^{-1/2} e^{-\\pi \\xi^2 / t}\\). (That is, carry out the Gaussian integral explicitly.)',
                    hint: 'Complete the square: \\(-\\pi t x^2 - 2\\pi i \\xi x = -\\pi t(x + i\\xi/t)^2 - \\pi \\xi^2/t\\). Then use \\(\\int_{-\\infty}^\\infty e^{-\\pi t u^2}\\,du = t^{-1/2}\\).',
                    solution: 'Write \\(\\hat{f}(\\xi) = \\int e^{-\\pi t x^2 - 2\\pi i \\xi x}dx\\). Completing the square: exponent \\(= -\\pi t(x + i\\xi/t)^2 - \\pi \\xi^2/t\\). So \\(\\hat{f}(\\xi) = e^{-\\pi\\xi^2/t}\\int e^{-\\pi t u^2}du\\) where \\(u = x+i\\xi/t\\) (contour shift valid by Cauchy). Using the standard Gaussian \\(\\int e^{-\\pi t u^2}du = (\\pi t)^{-1/2}\\sqrt{\\pi} = t^{-1/2}\\), we get \\(\\hat{f}(\\xi) = t^{-1/2}e^{-\\pi\\xi^2/t}\\).'
                },
                {
                    question: 'Use the modular relation \\(\\vartheta(1/t) = \\sqrt{t}\\,\\vartheta(t)\\) to show \\(\\vartheta(1) = 1 + 2e^{-\\pi} + 2e^{-4\\pi} + \\cdots\\) satisfies \\(\\vartheta(1) = \\vartheta(1)\\) (the relation is trivially satisfied at \\(t=1\\)) and compute \\(\\vartheta(1)\\) numerically to 4 decimal places.',
                    hint: 'Sum the first few terms of \\(1 + 2\\sum_{n=1}^N e^{-\\pi n^2}\\). Note \\(e^{-\\pi} \\approx 0.04322\\).',
                    solution: '\\(e^{-\\pi} \\approx 0.043221\\), \\(e^{-4\\pi} \\approx 0.000187\\), \\(e^{-9\\pi} \\approx 8.1\\times10^{-13}\\approx 0\\). So \\(\\vartheta(1) \\approx 1 + 2(0.043221) + 2(0.000187) \\approx 1.0869\\). More precisely, \\(\\vartheta(1) \\approx 1.0865\\). The modular relation gives \\(\\vartheta(1) = \\vartheta(1)\\), which is trivially consistent at \\(t=1\\).'
                }
            ]
        },

        // ================================================================
        // SECTION 3: The Mellin Transform
        // ================================================================
        {
            id: 'sec-mellin',
            title: 'The Mellin Transform',
            content: `
<h2>The Mellin Transform</h2>

<p>The Mellin transform is the multiplicative counterpart of the Fourier transform. Where the Fourier transform decomposes a function on \\((0,\\infty)\\) into additive characters \\(e^{i\\xi x}\\), the Mellin transform decomposes it into multiplicative characters \\(x^s\\).</p>

<div class="env-block definition">
    <div class="env-title">Definition (Mellin Transform)</div>
    <div class="env-body">
        <p>For a function \\(f:(0,\\infty) \\to \\mathbb{C}\\), the Mellin transform is</p>
        \\[\\mathcal{M}[f](s) = \\int_0^{\\infty} f(t)\\, t^s \\,\\frac{dt}{t} = \\int_0^\\infty f(t)\\, t^{s-1}\\,dt,\\]
        <p>defined in a vertical strip \\(\\{s : \\alpha < \\text{Re}(s) < \\beta\\}\\) where the integral converges.</p>
    </div>
</div>

<h3>The Gamma Function as a Mellin Transform</h3>
<p>The canonical example is:</p>
\\[\\Gamma(s) = \\int_0^{\\infty} e^{-t}\\, t^{s-1}\\,dt, \\quad \\text{Re}(s) > 0.\\]
<p>This converges absolutely for \\(\\text{Re}(s) > 0\\). Substituting \\(t \\mapsto nt\\), we get</p>
\\[\\int_0^{\\infty} e^{-nt}\\, t^{s-1}\\,dt = \\frac{\\Gamma(s)}{n^s}.\\]
<p>Summing over \\(n \\geq 1\\) (justified by dominated convergence for \\(\\text{Re}(s) > 1\\)):</p>
\\[\\sum_{n=1}^\\infty \\int_0^\\infty e^{-nt} t^{s-1}\\,dt = \\int_0^\\infty \\frac{t^{s-1}}{e^t - 1}\\,dt = \\Gamma(s)\\zeta(s).\\]

<div class="env-block theorem">
    <div class="env-title">Theorem 5.2 (Mellin Representation of \\(\\zeta\\))</div>
    <div class="env-body">
        <p>For \\(\\text{Re}(s) > 1\\),</p>
        \\[\\Gamma(s)\\zeta(s) = \\int_0^{\\infty} \\frac{t^{s-1}}{e^t - 1}\\,dt.\\]
        <p>The substitution \\(t \\mapsto \\pi n^2 t\\) in \\(\\Gamma(s/2)\\) gives the variant:</p>
        \\[\\pi^{-s/2}\\Gamma(s/2)\\zeta(s) = \\int_0^\\infty t^{s/2 - 1}\\psi(t)\\,dt, \\quad \\text{Re}(s) > 1,\\]
        <p>where \\(\\psi(t) = \\sum_{n=1}^\\infty e^{-\\pi n^2 t}\\). This is the Mellin transform of \\(\\psi\\).</p>
    </div>
</div>

<div class="env-block proof">
    <div class="env-title">Proof of the Theta-Mellin Identity</div>
    <div class="env-body">
        <p>From \\(\\Gamma(s/2) = \\int_0^\\infty e^{-u} u^{s/2-1}\\,du\\), substitute \\(u = \\pi n^2 t\\):</p>
        \\[\\Gamma(s/2) = \\pi^{s/2} n^s \\int_0^\\infty e^{-\\pi n^2 t} t^{s/2-1}\\,dt.\\]
        <p>Rearranging and summing over \\(n \\geq 1\\):</p>
        \\[\\pi^{-s/2}\\Gamma(s/2) \\cdot \\frac{1}{n^s} = \\int_0^\\infty e^{-\\pi n^2 t} t^{s/2-1}\\,dt.\\]
        \\[\\pi^{-s/2}\\Gamma(s/2)\\zeta(s) = \\int_0^\\infty \\underbrace{\\sum_{n=1}^\\infty e^{-\\pi n^2 t}}_{\\psi(t)} t^{s/2-1}\\,dt. \\qquad \\square\\]
    </div>
</div>

<h3>Splitting the Integral: The Key Trick</h3>
<p>Define the completed zeta factor \\(Z(s) = \\pi^{-s/2}\\Gamma(s/2)\\zeta(s)\\). We have</p>
\\[Z(s) = \\int_0^1 \\psi(t) t^{s/2-1}\\,dt + \\int_1^\\infty \\psi(t) t^{s/2-1}\\,dt.\\]
<p>The second integral converges for all \\(s\\) since \\(\\psi(t) \\sim e^{-\\pi t}\\) decays exponentially. In the first integral, substitute \\(t \\mapsto 1/t\\) and apply the modular relation \\(\\psi(1/t) = t^{1/2}\\psi(t) + \\frac{1}{2}(t^{1/2}-1)\\):</p>
\\[\\int_0^1 \\psi(t) t^{s/2-1}\\,dt = \\int_1^\\infty \\psi(1/t)\\cdot t^{1-s/2} \\cdot t^{-1}\\cdot t\\,dt\\]

<p>After substitution and the modular relation:</p>
\\[Z(s) = \\int_1^\\infty \\psi(t)(t^{s/2} + t^{(1-s)/2})\\,\\frac{dt}{t} - \\frac{1}{s} - \\frac{1}{1-s}.\\]

<p>This beautiful formula is the key to everything: the integral converges for <em>all</em> \\(s\\), the poles at \\(s=0\\) and \\(s=1\\) come from the explicit terms \\(-1/s - 1/(1-s)\\), and the entire expression is manifestly symmetric under \\(s \\mapsto 1-s\\).</p>
`,
            visualizations: [
                {
                    id: 'viz-mellin-bridge',
                    title: 'Mellin Transform: From \\(\\psi(t)\\) to \\(\\zeta(s)\\)',
                    description: 'Visualize the integrand \\(\\psi(t)\\cdot t^{\\sigma/2-1}\\) for various values of \\(\\sigma = \\text{Re}(s)\\). The Mellin transform selects which power of \\(t\\) contributes most — adjusting \\(\\sigma\\) shifts the weight from small \\(t\\) (left) to large \\(t\\) (right).',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, { width: 580, height: 360, originX: 60, originY: 300, scale: 50 });
                        var sigma = 2.0;
                        var logScale = false;

                        VizEngine.createSlider(controls, '\u03C3 = Re(s)', 0.1, 4.0, sigma, 0.1, function(v) { sigma = v; draw(); });
                        VizEngine.createButton(controls, 'Toggle log-t axis', function() { logScale = !logScale; draw(); });

                        function psi(t) {
                            var s = 0;
                            for (var n = 1; n <= 8; n++) s += Math.exp(-Math.PI * n * n * t);
                            return s;
                        }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var W = viz.width - 80, H = 240;
                            var tMin = 0.05, tMax = 3;
                            var steps = 300;

                            // Compute integrand
                            var pts = [];
                            for (var i = 0; i <= steps; i++) {
                                var tFrac = i / steps;
                                var t;
                                if (logScale) {
                                    t = Math.exp(Math.log(tMin) + tFrac * (Math.log(tMax) - Math.log(tMin)));
                                } else {
                                    t = tMin + tFrac * (tMax - tMin);
                                }
                                var y = psi(t) * Math.pow(t, sigma / 2 - 1);
                                pts.push({ t: t, y: y });
                            }
                            var maxY = Math.max(...pts.map(p => isFinite(p.y) ? p.y : 0));
                            if (maxY < 1e-10) maxY = 1;

                            // Draw axes
                            ctx.strokeStyle = viz.colors.axis; ctx.lineWidth = 1.5;
                            ctx.beginPath(); ctx.moveTo(70, 40); ctx.lineTo(70, 300); ctx.lineTo(viz.width - 20, 300); ctx.stroke();

                            // Draw integrand curve
                            ctx.strokeStyle = viz.colors.teal; ctx.lineWidth = 2.5;
                            ctx.beginPath();
                            var started = false;
                            for (var j = 0; j < pts.length; j++) {
                                var p = pts[j];
                                if (!isFinite(p.y) || p.y < 0) { started = false; continue; }
                                var tx = logScale
                                    ? 70 + (Math.log(p.t) - Math.log(tMin)) / (Math.log(tMax) - Math.log(tMin)) * W
                                    : 70 + (p.t - tMin) / (tMax - tMin) * W;
                                var ty = 300 - Math.min(1, p.y / maxY) * H;
                                if (!started) { ctx.moveTo(tx, ty); started = true; } else ctx.lineTo(tx, ty);
                            }
                            ctx.stroke();

                            // Fill under curve
                            ctx.fillStyle = viz.colors.teal + '22';
                            ctx.beginPath();
                            started = false;
                            for (var k = 0; k < pts.length; k++) {
                                var p2 = pts[k];
                                if (!isFinite(p2.y) || p2.y < 0) { started = false; continue; }
                                var tx2 = logScale
                                    ? 70 + (Math.log(p2.t) - Math.log(tMin)) / (Math.log(tMax) - Math.log(tMin)) * W
                                    : 70 + (p2.t - tMin) / (tMax - tMin) * W;
                                var ty2 = 300 - Math.min(1, p2.y / maxY) * H;
                                if (!started) { ctx.moveTo(tx2, 300); ctx.lineTo(tx2, ty2); started = true; }
                                else ctx.lineTo(tx2, ty2);
                            }
                            ctx.lineTo(70 + W, 300); ctx.closePath(); ctx.fill();

                            // x-axis labels
                            ctx.fillStyle = viz.colors.text; ctx.font = '10px sans-serif'; ctx.textAlign = 'center';
                            var tTicks = logScale ? [0.1, 0.3, 1, 3] : [0.5, 1, 1.5, 2, 2.5, 3];
                            for (var tt of tTicks) {
                                var tx3 = logScale
                                    ? 70 + (Math.log(tt) - Math.log(tMin)) / (Math.log(tMax) - Math.log(tMin)) * W
                                    : 70 + (tt - tMin) / (tMax - tMin) * W;
                                if (tx3 < 70 || tx3 > 70 + W) continue;
                                ctx.fillText(tt.toString(), tx3, 315);
                            }

                            ctx.fillStyle = viz.colors.white; ctx.font = '13px sans-serif'; ctx.textAlign = 'left';
                            ctx.fillText('\u03C8(t)\u00B7t^(\u03C3/2\u22121)', 75, 55);
                            ctx.fillStyle = viz.colors.text;
                            ctx.fillText(logScale ? 'log t' : 't', 70 + W - 10, 315);
                            ctx.fillStyle = viz.colors.yellow; ctx.font = '12px sans-serif'; ctx.textAlign = 'center';
                            ctx.fillText('\u03C3 = ' + sigma.toFixed(2), viz.width / 2, 335);
                            ctx.fillText('Area = Z(\u03C3) + 1/\u03C3 + 1/(1\u2212\u03C3)', viz.width / 2, 350);
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Compute the Mellin transform of \\(f(t) = e^{-at}\\) for \\(a > 0\\). Show that \\(\\mathcal{M}[e^{-at}](s) = a^{-s}\\Gamma(s)\\). Use this to verify the identity \\(\\Gamma(s)\\zeta(s) = \\int_0^\\infty \\frac{t^{s-1}}{e^t - 1}\\,dt\\) for \\(\\text{Re}(s) > 1\\).',
                    hint: 'Substitute \\(u = at\\) in \\(\\int_0^\\infty e^{-at} t^{s-1}\\,dt\\). Then expand \\(1/(e^t - 1) = \\sum_{n=1}^\\infty e^{-nt}\\) and sum term by term.',
                    solution: 'With \\(u = at\\): \\(\\int_0^\\infty e^{-at} t^{s-1}dt = a^{-s}\\int_0^\\infty e^{-u}u^{s-1}du = a^{-s}\\Gamma(s)\\). For the zeta formula: \\(\\int_0^\\infty \\frac{t^{s-1}}{e^t-1}dt = \\sum_{n=1}^\\infty \\int_0^\\infty e^{-nt}t^{s-1}dt = \\sum_{n=1}^\\infty n^{-s}\\Gamma(s) = \\Gamma(s)\\zeta(s)\\). Swapping sum and integral is justified by dominated convergence for \\(\\text{Re}(s)>1\\).'
                }
            ]
        },

        // ================================================================
        // SECTION 4: The Functional Equation
        // ================================================================
        {
            id: 'sec-functional-eq',
            title: 'The Functional Equation',
            content: `
<h2>The Functional Equation</h2>

<p>We now harvest the work of the previous two sections. The Mellin transform of \\(\\psi\\), combined with the modular relation for \\(\\vartheta\\), yields both the analytic continuation of \\(\\zeta(s)\\) to all of \\(\\mathbb{C}\\) and the functional equation in a single stroke.</p>

<div class="env-block theorem">
    <div class="env-title">Theorem 5.3 (Riemann's Functional Equation)</div>
    <div class="env-body">
        <p>Define the <em>completed zeta function</em></p>
        \\[\\xi(s) = \\frac{1}{2}s(s-1)\\pi^{-s/2}\\Gamma(s/2)\\zeta(s).\\]
        <p>Then \\(\\xi(s)\\) extends to an <strong>entire function</strong> of order 1, and satisfies</p>
        \\[\\xi(s) = \\xi(1-s).\\]
        <p>Equivalently, writing \\(Z(s) = \\pi^{-s/2}\\Gamma(s/2)\\zeta(s)\\),</p>
        \\[Z(s) = Z(1-s).\\]
    </div>
</div>

<div class="env-block proof">
    <div class="env-title">Proof (Complete)</div>
    <div class="env-body">
        <p><strong>Step 1: Mellin integral.</strong> For \\(\\text{Re}(s) > 1\\), from Theorem 5.2:</p>
        \\[Z(s) = \\int_0^\\infty \\psi(t)\\, t^{s/2-1}\\,dt.\\]

        <p><strong>Step 2: Split at \\(t=1\\).</strong></p>
        \\[Z(s) = \\int_0^1 \\psi(t)\\, t^{s/2-1}\\,dt + \\int_1^\\infty \\psi(t)\\, t^{s/2-1}\\,dt.\\]

        <p><strong>Step 3: Transform the \\([0,1]\\) integral.</strong> Substitute \\(t \\to 1/t\\) (so \\(dt/t \\to -dt/t\\) and limits reverse):</p>
        \\[\\int_0^1 \\psi(t)\\, t^{s/2-1}\\,dt = \\int_1^\\infty \\psi(1/t)\\, t^{-s/2+1}\\,\\frac{dt}{t} = \\int_1^\\infty \\psi(1/t)\\, t^{-s/2}\\,dt.\\]

        <p><strong>Step 4: Apply the modular relation.</strong> From \\(\\psi(1/t) = t^{1/2}\\psi(t) + \\tfrac{1}{2}(t^{1/2}-1)\\):</p>
        \\[\\int_1^\\infty \\psi(1/t)\\, t^{-s/2}\\,dt = \\int_1^\\infty \\psi(t)\\,t^{(1-s)/2}\\,dt + \\frac{1}{2}\\int_1^\\infty (t^{1/2}-1)\\,t^{-s/2}\\,dt.\\]

        <p><strong>Step 5: Evaluate the elementary integral.</strong></p>
        \\[\\frac{1}{2}\\int_1^\\infty t^{1/2-s/2}\\,dt - \\frac{1}{2}\\int_1^\\infty t^{-s/2}\\,dt = \\frac{1}{2}\\left[\\frac{-1}{s/2-3/2}\\right] - \\frac{1}{2}\\left[\\frac{-1}{s/2-1}\\right] = \\frac{-1}{s-3} + \\frac{1}{s-2}\\]
        <p>Wait — let us do this carefully. For \\(\\text{Re}(s) > 1\\):</p>
        \\[\\int_1^\\infty t^{(1/2-s/2)-1}\\,dt = \\int_1^\\infty t^{-(s-1)/2-1}\\,dt = \\frac{1}{(s-1)/2} = \\frac{2}{s-1},\\]
        \\[\\int_1^\\infty t^{-s/2-1+1}\\,dt = \\int_1^\\infty t^{-s/2}\\,dt = \\frac{1}{s/2} = \\frac{2}{s}\\text{ (for }\\text{Re}(s)>0).\\]

        <p>Combining:</p>
        \\[Z(s) = \\int_1^\\infty \\psi(t)\\left(t^{s/2} + t^{(1-s)/2}\\right)\\frac{dt}{t} - \\frac{1}{s} - \\frac{1}{1-s}.\\]

        <p><strong>Step 6: Analytic continuation.</strong> The integral \\(\\int_1^\\infty \\psi(t)(t^{s/2}+t^{(1-s)/2})t^{-1}\\,dt\\) converges for all \\(s \\in \\mathbb{C}\\) (since \\(\\psi(t) \\sim e^{-\\pi t}\\) as \\(t \\to \\infty\\)). This gives the analytic continuation of \\(Z(s)\\), with simple poles at \\(s=0\\) and \\(s=1\\) from the explicit terms.</p>

        <p><strong>Step 7: Symmetry.</strong> Under \\(s \\mapsto 1-s\\): the integrand \\(t^{s/2} + t^{(1-s)/2}\\) is symmetric, and \\(-1/s - 1/(1-s)\\) maps to \\(-1/(1-s) - 1/s\\) — also symmetric. So \\(Z(s) = Z(1-s)\\). The poles of \\(Z\\) at \\(s=0\\) and \\(s=1\\) are cancelled by \\(s(s-1)/2\\) in the definition of \\(\\xi\\), leaving an entire function. \\(\\square\\)</p>
    </div>
</div>

<h3>Reformulations of the Functional Equation</h3>

<div class="env-block theorem">
    <div class="env-title">Theorem 5.4 (Equivalent Forms)</div>
    <div class="env-body">
        <p>The functional equation \\(\\xi(s) = \\xi(1-s)\\) is equivalent to each of:</p>
        <ol>
            <li>\\(\\pi^{-s/2}\\Gamma(s/2)\\zeta(s) = \\pi^{-(1-s)/2}\\Gamma((1-s)/2)\\zeta(1-s)\\)</li>
            <li>\\(\\zeta(s) = 2^s \\pi^{s-1} \\sin\\!\\left(\\frac{\\pi s}{2}\\right)\\Gamma(1-s)\\zeta(1-s)\\)</li>
        </ol>
        <p>Form (2) is sometimes more convenient for explicit computations (e.g., computing \\(\\zeta(-2n)\\) for non-negative integers \\(n\\)).</p>
    </div>
</div>

<div class="env-block example">
    <div class="env-title">Computing Special Values via the Functional Equation</div>
    <div class="env-body">
        <p><strong>Trivial zeros:</strong> From form (2), \\(\\zeta(s) = 0\\) when \\(\\sin(\\pi s/2) = 0\\) and the right side is finite. This happens for \\(s = -2, -4, -6, \\ldots\\) (since \\(\\sin(-\\pi n) = 0\\) for \\(n \\in \\mathbb{Z}^+\\) and \\(\\zeta(1+2n)\\) is finite). These are the <em>trivial zeros</em>.</p>
        <p><strong>The value \\(\\zeta(-1) = -1/12\\):</strong> Set \\(s = -1\\). Then \\(1 - s = 2\\), \\(\\Gamma(1-s) = \\Gamma(2) = 1\\), \\(\\sin(-\\pi/2) = -1\\), \\(\\zeta(2) = \\pi^2/6\\). So</p>
        \\[\\zeta(-1) = 2^{-1}\\pi^{-2}(-1)\\cdot 1\\cdot \\frac{\\pi^2}{6} = -\\frac{1}{12}.\\]
    </div>
</div>

<div class="env-block remark">
    <div class="env-title">The \\(\\xi\\) Function and the Critical Strip</div>
    <div class="env-body">
        <p>The \\(\\xi\\) function is entire, real-valued on the real axis, and satisfies \\(\\xi(s) = \\overline{\\xi(\\bar{s})}\\). All its zeros are exactly the non-trivial zeros of \\(\\zeta(s)\\). The functional equation implies that non-trivial zeros are symmetric about both the real axis and the critical line \\(\\text{Re}(s)=1/2\\). If \\(\\rho = \\beta + i\\gamma\\) is a non-trivial zero, so are \\(1-\\rho\\), \\(\\bar{\\rho}\\), and \\(1-\\bar{\\rho}\\) (forming a "quadruple" unless \\(\\beta = 1/2\\) or \\(\\gamma = 0\\)).</p>
    </div>
</div>
`,
            visualizations: [
                {
                    id: 'viz-contour-hankel',
                    title: 'Hankel Contour: Analytic Continuation via Complex Integration',
                    description: 'The Hankel contour \\(\\mathcal{H}\\) runs from \\(+\\infty\\) along the real axis to a small circle around the origin, then back to \\(+\\infty\\). This contour integral for \\(\\Gamma(s)\\) converges for all \\(s\\), giving the meromorphic continuation. The visualization shows the contour and the integrand magnitude.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, { width: 580, height: 360, originX: 290, originY: 180, scale: 55 });
                        var epsilon = 0.4;
                        VizEngine.createSlider(controls, '\u03B5 (contour radius)', 0.1, 1.0, epsilon, 0.05, function(v) { epsilon = v; draw(); });

                        function draw() {
                            viz.clear();
                            viz.drawGrid(1);
                            viz.drawAxes();
                            var ctx = viz.ctx;

                            // Draw Hankel contour
                            // Upper branch: from +inf down to epsilon along real axis (above)
                            var eps = epsilon;
                            var [cx, cy] = viz.toScreen(0, 0);

                            // Upper horizontal branch
                            ctx.strokeStyle = viz.colors.blue; ctx.lineWidth = 2.5;
                            ctx.setLineDash([]);
                            ctx.beginPath();
                            var [sx1, sy1] = viz.toScreen(eps, 0.05);
                            var [sx2, sy2] = viz.toScreen(4.5, 0.05);
                            ctx.moveTo(sx2, sy2); ctx.lineTo(sx1, sy1); ctx.stroke();

                            // Circle around origin
                            ctx.beginPath();
                            ctx.arc(cx, cy, eps * viz.scale, Math.PI / 2 + 0.1, -Math.PI / 2 - 0.1, true);
                            ctx.stroke();

                            // Lower horizontal branch
                            ctx.beginPath();
                            var [sx3, sy3] = viz.toScreen(eps, -0.05);
                            var [sx4, sy4] = viz.toScreen(4.5, -0.05);
                            ctx.moveTo(sx3, sy3); ctx.lineTo(sx4, sy4); ctx.stroke();

                            // Arrows on branches
                            viz.drawVector(3.5, 0.05, 2.0, 0.05, viz.colors.blue, null, 1.5);
                            viz.drawVector(1.5, -0.05, 3.0, -0.05, viz.colors.blue, null, 1.5);

                            // Label the contour
                            viz.drawText('\u210B (Hankel)', 3.2, 0.5, viz.colors.blue, 13);
                            viz.drawText('\u03B5 = ' + eps.toFixed(2), eps + 0.1, 0.4, viz.colors.yellow, 12);

                            // Draw the pole at origin
                            viz.drawPoint(0, 0, viz.colors.red, null, 7);
                            viz.drawText('0', 0.15, -0.3, viz.colors.red, 11);

                            // Explanation text
                            viz.screenText('\u0393(s) = \u222E\u2097 e^z z^{s-1} dz  (for all s)', viz.width / 2, viz.height - 44, viz.colors.white, 13);
                            viz.screenText('The contour avoids the branch cut Re(z) > 0, Im(z) = 0', viz.width / 2, viz.height - 24, viz.colors.text, 11);
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Use the functional equation in form (2) to compute \\(\\zeta(-3)\\). Note that \\(\\zeta(4) = \\pi^4/90\\).',
                    hint: 'Set \\(s = -3\\) in \\(\\zeta(s) = 2^s\\pi^{s-1}\\sin(\\pi s/2)\\Gamma(1-s)\\zeta(1-s)\\). Compute \\(\\sin(-3\\pi/2)\\), \\(\\Gamma(4) = 3!\\), and \\(\\zeta(4)\\).',
                    solution: 'At \\(s=-3\\): \\(2^{-3} = 1/8\\), \\(\\pi^{-4}\\), \\(\\sin(-3\\pi/2) = 1\\), \\(\\Gamma(4) = 6\\), \\(\\zeta(4) = \\pi^4/90\\). Thus \\(\\zeta(-3) = \\frac{1}{8}\\cdot\\pi^{-4}\\cdot 1\\cdot 6\\cdot\\frac{\\pi^4}{90} = \\frac{6}{8\\cdot 90} = \\frac{1}{120}\\).'
                },
                {
                    question: 'Show that \\(\\zeta(-2n) = 0\\) for \\(n = 1, 2, 3, \\ldots\\) (the trivial zeros) using form (2) of the functional equation.',
                    hint: 'At \\(s = -2n\\), evaluate \\(\\sin(\\pi s/2) = \\sin(-n\\pi)\\). Also check that \\(\\zeta(1+2n)\\) is finite and \\(\\Gamma(1+2n)\\) is finite.',
                    solution: 'At \\(s = -2n\\): \\(\\sin(\\pi(-2n)/2) = \\sin(-n\\pi) = 0\\) for all integers \\(n \\geq 1\\). The factors \\(2^{-2n}\\), \\(\\pi^{-2n-1}\\), \\(\\Gamma(1+2n) = (2n)!\\), and \\(\\zeta(1+2n)\\) are all finite and nonzero. So the product is \\(0 \\cdot (\\text{finite}) = 0\\). Hence \\(\\zeta(-2n) = 0\\) for \\(n \\geq 1\\).'
                },
                {
                    question: 'Verify the identity \\(\\xi(0) = \\xi(1) = 1/2\\). (Use the definition \\(\\xi(s) = \\frac{1}{2}s(s-1)\\pi^{-s/2}\\Gamma(s/2)\\zeta(s)\\) and the known residue \\(\\text{Res}_{s=1}\\zeta(s) = 1\\).)',
                    hint: 'Near \\(s=1\\), \\(\\zeta(s) = 1/(s-1) + \\gamma + \\cdots\\). Factor out \\((s-1)\\) from \\(\\zeta(s)\\) and take the limit. For \\(s=0\\), use the functional equation and the fact \\(\\Gamma(s/2) \\sim 2/s\\) near \\(s=0\\).',
                    solution: 'Near \\(s=1\\): \\(\\xi(s) = \\frac{1}{2}s(s-1)\\pi^{-s/2}\\Gamma(s/2)\\cdot\\frac{1}{s-1}(1+O(s-1)) = \\frac{1}{2}\\cdot 1\\cdot\\pi^{-1/2}\\Gamma(1/2)\\cdot 1 = \\frac{1}{2}\\cdot\\pi^{-1/2}\\cdot\\sqrt{\\pi} = \\frac{1}{2}\\). For \\(s=0\\): by \\(\\xi(0)=\\xi(1)=1/2\\) from the functional equation. Alternatively: near \\(s=0\\), \\(\\Gamma(s/2)\\sim 2/s\\), \\(\\zeta(s)\\to\\zeta(0)=-1/2\\), so \\(\\xi(0) = \\frac{1}{2}\\cdot 0\\cdot(-1)\\cdot 1\\cdot(2/0)\\cdot(-1/2) = \\frac{1}{2}\\).'
                }
            ]
        },

        // ================================================================
        // SECTION 5: Hurwitz Zeta Function
        // ================================================================
        {
            id: 'sec-hurwitz',
            title: 'Hurwitz Zeta Function',
            content: `
<h2>Hurwitz Zeta Function</h2>

<p>The Hurwitz zeta function generalizes the Riemann zeta by introducing a shift parameter. It is not merely a tool for proving properties of \\(\\zeta(s)\\) — it is a central object in its own right, connecting to Dirichlet L-functions (Chapter 9), the digamma function, Bernoulli polynomials, and even the theory of modular forms.</p>

<div class="env-block definition">
    <div class="env-title">Definition (Hurwitz Zeta Function)</div>
    <div class="env-body">
        <p>For \\(0 < a \\leq 1\\) and \\(\\text{Re}(s) > 1\\), define</p>
        \\[\\zeta(s, a) = \\sum_{n=0}^{\\infty} \\frac{1}{(n+a)^s}.\\]
        <p>Special cases: \\(\\zeta(s, 1) = \\zeta(s)\\) and \\(\\zeta(s, 1/2) = 2^s(\\zeta(s) - 1) + 2^s\\) — wait, more precisely:</p>
        \\[\\zeta(s, 1/2) = 2^s \\sum_{n=0}^\\infty \\frac{1}{(2n+1)^s} = 2^s(\\zeta(s) - 2^{-s}\\zeta(s)) = (2^s - 1)\\cdot 2\\cdot\\eta(s)\\ldots\\]
        <p>More usefully: \\(\\zeta(s) = \\zeta(s,1)\\) and for the Lerch relation:</p>
        \\[\\zeta(s, a) - \\zeta(s, a+1) = a^{-s}.\\]
    </div>
</div>

<h3>Analytic Continuation of \\(\\zeta(s,a)\\)</h3>

<div class="env-block theorem">
    <div class="env-title">Theorem 5.5 (Analytic Continuation of Hurwitz Zeta)</div>
    <div class="env-body">
        <p>The Hurwitz zeta function \\(\\zeta(s, a)\\) has an analytic continuation to \\(\\mathbb{C} \\setminus \\{1\\}\\) with a simple pole at \\(s = 1\\) with residue 1 (independent of \\(a\\)). The continuation is given by:</p>
        \\[\\zeta(s, a) = \\frac{\\Gamma(1-s)}{2\\pi i} \\int_{\\mathcal{H}} \\frac{z^{s-1} e^{az}}{1 - e^z}\\,dz,\\]
        <p>where \\(\\mathcal{H}\\) is the Hankel contour. Equivalently, via the Mellin transform:</p>
        \\[\\zeta(s, a) = \\frac{1}{\\Gamma(s)}\\int_0^\\infty \\frac{t^{s-1}e^{-at}}{1 - e^{-t}}\\,dt.\\]
    </div>
</div>

<h3>Connection to Dirichlet L-Functions</h3>

<p>This is the structural bridge to Chapter 9. Let \\(\\chi\\) be a Dirichlet character modulo \\(q\\). Then</p>
\\[L(s, \\chi) = \\sum_{n=1}^\\infty \\frac{\\chi(n)}{n^s} = \\frac{1}{q^s} \\sum_{a=1}^q \\chi(a) \\cdot \\zeta\\!\\left(s, \\frac{a}{q}\\right).\\]

<div class="env-block proof">
    <div class="env-title">Derivation</div>
    <div class="env-body">
        <p>Group the integers \\(n \\geq 1\\) by residue class modulo \\(q\\: n = qm + a\\, \\) for \\(m \\geq 0\\) and \\(1 \\leq a \\leq q\\). Since \\(\\chi(n) = \\chi(a)\\) (\\(\\chi\\) is periodic):</p>
        \\[L(s, \\chi) = \\sum_{a=1}^q \\chi(a) \\sum_{m=0}^\\infty \\frac{1}{(qm+a)^s} = \\sum_{a=1}^q \\chi(a) \\cdot \\frac{1}{q^s} \\sum_{m=0}^\\infty \\frac{1}{(m + a/q)^s} = q^{-s}\\sum_{a=1}^q \\chi(a)\\,\\zeta(s, a/q). \\qquad \\square\\]
    </div>
</div>

<h3>Special Values: Bernoulli Polynomials</h3>

<div class="env-block theorem">
    <div class="env-title">Theorem 5.6 (Values at Non-Positive Integers)</div>
    <div class="env-body">
        <p>For non-negative integers \\(n\\),</p>
        \\[\\zeta(-n, a) = -\\frac{B_{n+1}(a)}{n+1},\\]
        <p>where \\(B_k(a)\\) is the \\(k\\)-th Bernoulli polynomial, defined by \\(\\frac{te^{at}}{e^t-1} = \\sum_{k=0}^\\infty \\frac{B_k(a)}{k!}t^k\\).</p>
        <p>In particular: \\(\\zeta(0, a) = \\tfrac{1}{2} - a\\), \\(\\quad \\zeta(-1, a) = -\\tfrac{1}{2}B_2(a) = -\\tfrac{1}{12}(6a^2 - 6a + 1)\\).</p>
    </div>
</div>

<div class="env-block example">
    <div class="env-title">Example: \\(\\zeta(-1) = -1/12\\) via Bernoulli</div>
    <div class="env-body">
        <p>At \\(a=1\\): \\(\\zeta(-1, 1) = \\zeta(-1) = -B_2(1)/2 = -(1/6)/2 = -1/12\\). (Since \\(B_2(x) = x^2 - x + 1/6\\) gives \\(B_2(1) = 1 - 1 + 1/6 = 1/6\\).)</p>
    </div>
</div>

<h3>Functional Equation for \\(\\zeta(s,a)\\)</h3>

<div class="env-block theorem">
    <div class="env-title">Theorem 5.7 (Hurwitz's Formula)</div>
    <div class="env-body">
        <p>For \\(0 < a \\leq 1\\) and \\(\\text{Re}(s) > 1\\):</p>
        \\[\\zeta(1-s, a) = \\frac{\\Gamma(s)}{(2\\pi)^s} \\left[e^{\\pi i s/2}\\sum_{n=1}^\\infty \\frac{e^{2\\pi i na}}{n^s} + e^{-\\pi i s/2}\\sum_{n=1}^\\infty \\frac{e^{-2\\pi i na}}{n^s}\\right].\\]
        <p>This can be written more compactly as:</p>
        \\[\\zeta(1-s, a) = \\frac{2\\,\\Gamma(s)}{(2\\pi)^s} \\sum_{n=1}^\\infty \\frac{\\cos(2\\pi na - \\pi s/2)}{n^s}.\\]
        <p>Setting \\(a = 1\\) recovers the standard functional equation for \\(\\zeta(s)\\).</p>
    </div>
</div>

<div class="env-block remark">
    <div class="env-title">Why Hurwitz Matters Beyond Zeta</div>
    <div class="env-body">
        <p>The Hurwitz zeta is not just a generalization of \\(\\zeta(s)\\) — it is the building block of the entire L-function universe. The decomposition \\(L(s,\\chi) = q^{-s}\\sum_a \\chi(a)\\zeta(s, a/q)\\) means: to prove the functional equation of \\(L(s,\\chi)\\), it suffices to apply Hurwitz's formula and use the Gauss sum \\(\\tau(\\chi) = \\sum_a \\chi(a) e^{2\\pi i a/q}\\). This is exactly the strategy of Chapter 9.</p>
    </div>
</div>
`,
            visualizations: [],
            exercises: [
                {
                    question: 'Compute \\(\\zeta(s, 1/2)\\) in terms of \\(\\zeta(s)\\). (Hint: split \\(\\sum_{n=0}^\\infty (n+1/2)^{-s}\\) into even and odd \\(n\\).) Show that \\(\\zeta(s, 1/2) = (2^s - 1)\\zeta(s)\\).',
                    hint: 'Write \\(n + 1/2 = (2n+1)/2\\). Then \\(\\sum_{n=0}^\\infty (2n+1)^{-s} = \\zeta(s) - 2^{-s}\\zeta(s) + ?\\). Actually, directly: \\(2^{-s}\\sum_{n=0}^\\infty (n+1/2)^{-s} \\cdot 2^{-s}\\)... Better: \\(\\sum_{n=0}^\\infty (n+1/2)^{-s} = 2^s\\sum_{n=0}^\\infty (2n+1)^{-s}\\) and sum over odds = \\(\\zeta(s) - 2^{-s}\\zeta(s)\\) is the sum over evens subtracted from all, so odds \\(= (1-2^{-s})\\zeta(s)\\).',
                    solution: '\\(\\zeta(s,1/2) = \\sum_{n=0}^\\infty (n+1/2)^{-s} = 2^s\\sum_{n=0}^\\infty(2n+1)^{-s}\\). The sum over odd positive integers: \\(\\sum_{k \\text{ odd}} k^{-s} = \\zeta(s) - \\sum_{k \\text{ even}} k^{-s} = \\zeta(s) - 2^{-s}\\zeta(s) = (1-2^{-s})\\zeta(s)\\). So \\(\\zeta(s,1/2) = 2^s(1-2^{-s})\\zeta(s) = (2^s-1)\\zeta(s)\\).'
                },
                {
                    question: 'Using the formula \\(L(s, \\chi) = q^{-s}\\sum_{a=1}^q \\chi(a)\\,\\zeta(s, a/q)\\), write \\(L(s, \\chi_{-4})\\) in terms of Hurwitz zeta functions, where \\(\\chi_{-4}\\) is the non-principal character modulo 4 (with \\(\\chi(1)=1, \\chi(3)=-1, \\chi(0)=\\chi(2)=0\\)).',
                    hint: 'Only \\(a=1,2,3,4\\) contribute; \\(\\chi(2)=\\chi(4)=0\\) (since \\(\\gcd(2,4)=2\\neq 1\\)).',
                    solution: '\\(L(s,\\chi_{-4}) = 4^{-s}[\\chi(1)\\zeta(s,1/4) + \\chi(2)\\zeta(s,2/4) + \\chi(3)\\zeta(s,3/4) + \\chi(4)\\zeta(s,1)] = 4^{-s}[\\zeta(s,1/4) - \\zeta(s,3/4)]\\). This is the Dirichlet beta function \\(\\beta(s) = 1-3^{-s}+5^{-s}-\\cdots\\) in disguise: \\(L(s,\\chi_{-4}) = \\beta(s)\\).'
                }
            ]
        },

        // ================================================================
        // SECTION 6: Perron's Formula
        // ================================================================
        {
            id: 'sec-perron',
            title: "Perron's Formula",
            content: `
<h2>Perron's Formula</h2>

<div class="env-block intuition">
    <div class="env-title">The Big Picture</div>
    <div class="env-body">
        <p>We have spent several chapters building the analytic theory of \\(\\zeta(s)\\) and Dirichlet series. Perron's formula is the key that converts this analytic information back into arithmetic. It expresses a partial sum \\(\\sum_{n \\leq x} a(n)\\) in terms of a contour integral of the associated Dirichlet series \\(F(s) = \\sum_{n=1}^\\infty a(n)/n^s\\). In Chapter 7, we will apply this with \\(F(s) = -\\zeta'(s)/\\zeta(s)\\) to count primes.</p>
    </div>
</div>

<h3>The Perron Integral</h3>

<div class="env-block theorem">
    <div class="env-title">Theorem 5.8 (Perron's Integral Formula)</div>
    <div class="env-body">
        <p>For \\(c > 0\\) and \\(x > 0\\),</p>
        \\[\\frac{1}{2\\pi i}\\int_{c-i\\infty}^{c+i\\infty} \\frac{x^s}{s}\\,ds = \\begin{cases} 0 & \\text{if } 0 < x < 1, \\\\ 1/2 & \\text{if } x = 1, \\\\ 1 & \\text{if } x > 1.\\end{cases}\\]
        <p>This is the <em>Perron kernel</em>: the indicator function \\(\\mathbf{1}_{[0,1]}(1/x)\\), realized as a contour integral.</p>
    </div>
</div>

<div class="env-block proof">
    <div class="env-title">Proof Sketch</div>
    <div class="env-body">
        <p>For \\(x > 1\\): the integrand \\(x^s/s\\) has a simple pole at \\(s = 0\\) with residue 1. Complete the contour by a large semicircle to the left; the semicircular arc contributes 0 as the radius \\(R \\to \\infty\\) (since \\(|x^s| = x^c e^{-t \\log x} \\to 0\\) for \\(x > 1\\) as \\(\\text{Im}(s) \\to -\\infty\\) on the left). By the residue theorem, the integral equals \\(2\\pi i \\cdot \\text{Res}_{s=0}(x^s/s) = 2\\pi i\\), giving \\(1/(2\\pi i)\\cdot 2\\pi i = 1\\).</p>
        <p>For \\(x < 1\\): close to the right; the integrand has no poles in \\(\\text{Re}(s) > c\\), so the integral is 0.</p>
    </div>
</div>

<div class="env-block theorem">
    <div class="env-title">Theorem 5.9 (Perron's Formula, Classical Form)</div>
    <div class="env-body">
        <p>Let \\(F(s) = \\sum_{n=1}^\\infty a(n)n^{-s}\\) converge absolutely for \\(\\text{Re}(s) > \\sigma_a\\). For \\(x > 0\\), \\(x \\notin \\mathbb{Z}\\), and \\(c > \\sigma_a\\):</p>
        \\[\\sum_{n \\leq x} a(n) = \\frac{1}{2\\pi i}\\int_{c-i\\infty}^{c+i\\infty} F(s)\\,\\frac{x^s}{s}\\,ds.\\]
    </div>
</div>

<div class="env-block proof">
    <div class="env-title">Proof</div>
    <div class="env-body">
        <p>Substitute the Dirichlet series for \\(F(s)\\) and apply the Perron integral termwise:</p>
        \\[\\frac{1}{2\\pi i}\\int_{c-i\\infty}^{c+i\\infty} F(s)\\frac{x^s}{s}\\,ds = \\sum_{n=1}^\\infty a(n) \\cdot \\frac{1}{2\\pi i}\\int_{c-i\\infty}^{c+i\\infty} \\frac{(x/n)^s}{s}\\,ds.\\]
        <p>By the Perron integral formula, the inner integral equals \\(\\mathbf{1}_{n \\leq x}\\) (for \\(x\\) not an integer). Summing over \\(n\\) gives \\(\\sum_{n \\leq x} a(n)\\). The interchange of sum and integral is justified by absolute convergence. \\(\\square\\)</p>
    </div>
</div>

<h3>The Truncated Perron Formula</h3>

<p>In practice, we cannot integrate to \\(\\pm i\\infty\\). The truncated version is more useful:</p>

<div class="env-block theorem">
    <div class="env-title">Theorem 5.10 (Truncated Perron's Formula)</div>
    <div class="env-body">
        <p>Let \\(F(s) = \\sum a(n)n^{-s}\\) with \\(|a(n)| \\leq d(n)\\) (say), \\(c = 1 + 1/\\log x\\), and \\(T \\geq 2\\). Then</p>
        \\[\\sum_{n \\leq x} a(n) = \\frac{1}{2\\pi i}\\int_{c-iT}^{c+iT} F(s)\\frac{x^s}{s}\\,ds + O\\!\\left(\\frac{x^c}{T} \\sum_{n=1}^\\infty \\frac{|a(n)|}{n^c}\\right) + O\\!\\left(x^\\delta \\log x\\right),\\]
        <p>where the last error accounts for terms \\(n\\) near \\(x\\).</p>
    </div>
</div>

<h3>Application: The Prime Counting Function</h3>
<p>The von Mangoldt function \\(\\Lambda(n)\\) satisfies \\(-\\zeta'(s)/\\zeta(s) = \\sum_{n=1}^\\infty \\Lambda(n)n^{-s}\\) for \\(\\text{Re}(s) > 1\\) (from Chapter 4). Perron's formula gives</p>
\\[\\psi(x) = \\sum_{n \\leq x} \\Lambda(n) = \\frac{1}{2\\pi i}\\int_{c-iT}^{c+iT} \\left(-\\frac{\\zeta'(s)}{\\zeta(s)}\\right)\\frac{x^s}{s}\\,ds + \\text{error}.\\]
<p>Moving the contour to the left, we pick up residues at the poles of \\(-\\zeta'/\\zeta\\): a main term \\(x\\) from the simple pole of \\(-\\zeta'/\\zeta\\) at \\(s=1\\), and contributions \\(-x^\\rho/\\rho\\) from each zero \\(\\rho\\) of \\(\\zeta\\). This gives the <em>explicit formula</em></p>
\\[\\psi(x) = x - \\sum_{\\rho} \\frac{x^\\rho}{\\rho} - \\frac{\\zeta'(0)}{\\zeta(0)} - \\tfrac{1}{2}\\log(1-x^{-2}),\\]
<p>which is the central result of Chapter 8.</p>

<div class="env-block remark">
    <div class="env-title">Perron and the Critical Strip</div>
    <div class="env-body">
        <p>The power of Perron's formula depends on how far left we can move the contour. If we know \\(\\zeta(s) \\neq 0\\) in a region \\(\\mathcal{R}\\), the contour can be pushed into \\(\\mathcal{R}\\) and the zero contributions from that region vanish. The prime number theorem (Chapter 7) follows from establishing that \\(\\mathcal{R}\\) includes the line \\(\\text{Re}(s) = 1\\). The best known error bounds (Chapter 6) come from the widest known zero-free regions.</p>
    </div>
</div>
`,
            visualizations: [
                {
                    id: 'viz-perron-contour',
                    title: "Perron's Formula: Moving the Contour",
                    description: "Drag the contour left to pick up residues at the pole \\(s=1\\) and the non-trivial zeros. The main term \\(x\\) arises from \\(s=1\\); each non-trivial zero \\(\\rho\\) contributes an oscillatory correction \\(-x^\\rho/\\rho\\).",
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, { width: 580, height: 400, originX: 340, originY: 200, scale: 60 });
                        var contourRe = 1.6;
                        var T = 3.0;
                        var showZeros = true;

                        VizEngine.createSlider(controls, 'Contour Re(s)', 0.3, 1.9, contourRe, 0.05, function(v) { contourRe = v; draw(); });
                        VizEngine.createSlider(controls, 'T (height)', 1.0, 5.0, T, 0.1, function(v) { T = v; draw(); });
                        VizEngine.createButton(controls, 'Toggle zeros', function() { showZeros = !showZeros; draw(); });

                        // First few non-trivial zeros (imaginary parts, from tables)
                        var zeroIms = [14.135, 21.022, 25.011, 30.424, 32.935];
                        // Scale for display
                        var zScale = 0.14;

                        function draw() {
                            viz.clear();
                            viz.drawGrid(0.5);

                            var ctx = viz.ctx;

                            // Draw critical strip shading
                            var [sx0] = viz.toScreen(0, 0);
                            var [sx1] = viz.toScreen(1, 0);
                            ctx.fillStyle = viz.colors.purple + '18';
                            ctx.fillRect(sx0, 0, sx1 - sx0, viz.height);

                            // Draw critical line Re(s) = 1/2
                            viz.drawLine(0.5, -10, 0.5, 10, viz.colors.purple, 1, true);

                            // Draw Re(s) = 1 (edge of convergence)
                            viz.drawLine(1, -10, 1, 10, viz.colors.green, 1, true);

                            // Draw the Perron contour (vertical line at contourRe, truncated to [-T, T])
                            var lineColor = contourRe > 1 ? viz.colors.blue : (contourRe > 0.5 ? viz.colors.orange : viz.colors.red);
                            viz.drawSegment(contourRe, -T * zScale, contourRe, T * zScale, lineColor, 3);
                            // Closing arcs (suggestive dashed box)
                            if (contourRe < 1.55) {
                                viz.drawSegment(contourRe, T * zScale, 1.7, T * zScale, lineColor, 1.5, true);
                                viz.drawSegment(contourRe, -T * zScale, 1.7, -T * zScale, lineColor, 1.5, true);
                            }

                            // Arrows on contour
                            viz.drawVector(contourRe, -1.2 * zScale, contourRe, 0.5 * zScale, lineColor, null, 1.5);

                            viz.drawAxes();

                            // Draw pole at s = 1
                            viz.drawPoint(1, 0, viz.colors.red, null, 7);
                            viz.drawText('pole\ns=1', 1.13, 0.12, viz.colors.red, 10);

                            // Draw trivial zeros at negative even integers (symbolic)
                            for (var k = 1; k <= 3; k++) {
                                viz.drawPoint(-2 * k, 0, viz.colors.yellow, null, 5);
                            }
                            viz.drawText('trivial zeros', -2.3, -0.25, viz.colors.yellow, 10);

                            // Draw non-trivial zeros
                            if (showZeros) {
                                for (var zi = 0; zi < zeroIms.length; zi++) {
                                    var gy = zeroIms[zi] * zScale;
                                    if (gy > T * zScale + 0.05) continue;
                                    viz.drawPoint(0.5, gy, viz.colors.teal, null, 5);
                                    viz.drawPoint(0.5, -gy, viz.colors.teal, null, 5);
                                }
                            }

                            // Labels
                            viz.drawText('Re(s)=1/2', 0.5, T * zScale + 0.18, viz.colors.purple, 10);
                            viz.drawText('Re(s)=1', 1.0, T * zScale + 0.18, viz.colors.green, 10);
                            viz.screenText("Perron contour at Re(s) = " + contourRe.toFixed(2), viz.width / 2, viz.height - 30, viz.colors.white, 12);
                            if (contourRe <= 1.0) {
                                viz.screenText("Contour has crossed Re(s)=1: picking up residues from zeros!", viz.width / 2, viz.height - 14, viz.colors.orange, 11);
                            }
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: "Prove the Perron integral: for \\(c > 0\\) and \\(x > 1\\), show \\(\\frac{1}{2\\pi i}\\int_{c-i\\infty}^{c+i\\infty} \\frac{x^s}{s}\\,ds = 1\\) by closing the contour to the left and computing the residue at \\(s=0\\). Verify the integral is 0 for \\(0 < x < 1\\) by closing to the right.",
                    hint: 'For \\(x>1\\), on a semicircle of radius \\(R\\) to the left: \\(|x^s/s| = x^\\sigma/|s| \\leq x^{-R}/R \\to 0\\) since \\(x^{-R} \\to 0\\) for \\(x>1\\) and \\(\\sigma \\leq c-R \\to -\\infty\\). Apply the residue theorem.',
                    solution: 'For \\(x > 1\\): on the left semicircle \\(s = c + Re^{i\\theta}\\), \\(\\theta \\in [\\pi/2, 3\\pi/2]\\), \\(|x^s| = x^{c+R\\cos\\theta}\\) with \\(\\cos\\theta \\leq 0\\) so \\(|x^s| \\leq x^c\\). More precisely \\(|x^s/s| \\leq x^c \\cdot x^{R\\cos\\theta}/R \\to 0\\) uniformly as \\(R\\to\\infty\\). By residue theorem: \\(\\frac{1}{2\\pi i}\\int = \\text{Res}_{s=0}(x^s/s) = x^0 = 1\\). For \\(x < 1\\): close to the right; \\(|x^s/s| \\leq x^{c+R\\cos\\theta}/R \\to 0\\) since \\(\\cos\\theta \\geq 0\\) means \\(x^{R\\cos\\theta} \\to 0\\) for \\(x<1\\). No poles enclosed, so the integral is 0.'
                },
                {
                    question: "Let \\(F(s) = \\zeta(s)^2 = \\sum_{n=1}^\\infty d(n)/n^s\\) where \\(d(n)\\) is the number of divisors. Use Perron's formula to write \\(\\sum_{n \\leq x} d(n)\\) as a contour integral, then identify the main term by moving the contour past the double pole at \\(s=1\\). What is the leading asymptotic?",
                    hint: 'At \\(s=1\\), \\(\\zeta(s)^2 = (s-1)^{-2} + \\cdots\\) has a double pole. The residue at \\(s=1\\) of \\(\\zeta(s)^2 x^s/s\\) should give \\(x \\log x\\) plus lower-order terms.',
                    solution: "By Perron: \\(\\sum_{n\\leq x}d(n) = \\frac{1}{2\\pi i}\\int_{c-i\\infty}^{c+i\\infty} \\zeta(s)^2 x^s/s\\,ds\\). Moving the contour to \\(\\text{Re}(s) = 1/2\\) picks up the double pole at \\(s=1\\). Near \\(s=1\\): \\(\\zeta(s)^2 = (s-1)^{-2} + 2\\gamma(s-1)^{-1} + \\cdots\\) and \\(x^s/s = x(1+(s-1)\\log x)(1-(s-1)+\\cdots)\\). The residue computes to \\(x\\log x + (2\\gamma-1)x\\). So \\(\\sum_{n\\leq x}d(n) = x\\log x + (2\\gamma - 1)x + O(x^{1/2+\\epsilon})\\). This is the Dirichlet divisor problem result."
                }
            ]
        },

        // ================================================================
        // SECTION 7: Where Are the Zeros?
        // ================================================================
        {
            id: 'sec-bridge',
            title: 'Where Are the Zeros?',
            content: `
<h2>Where Are the Zeros?</h2>

<p>We now have enough structure to take stock of what we know about the zeros of \\(\\zeta(s)\\) and to look ahead.</p>

<h3>Classification of Zeros</h3>

<div class="env-block theorem">
    <div class="env-title">Theorem 5.11 (Zeros of \\(\\zeta(s)\\))</div>
    <div class="env-body">
        <p>The complete list of zeros of \\(\\zeta(s)\\) is:</p>
        <ol>
            <li><strong>Trivial zeros</strong> at \\(s = -2, -4, -6, \\ldots\\) (negative even integers). These arise from poles of \\(\\Gamma(s/2)\\) and are explicitly known.</li>
            <li><strong>Non-trivial zeros</strong> \\(\\rho = \\beta + i\\gamma\\) with \\(0 \\leq \\beta \\leq 1\\). The functional equation and positivity arguments show \\(0 < \\beta < 1\\) (no non-trivial zeros on the boundary of the critical strip). They are symmetric about both the real axis and the critical line \\(\\text{Re}(s) = 1/2\\).</li>
        </ol>
        <p>There are infinitely many non-trivial zeros. Riemann's conjecture (1859) — unproven — is that all satisfy \\(\\beta = 1/2\\).</p>
    </div>
</div>

<h3>No Zeros on the Boundary \\(\\text{Re}(s) = 1\\)</h3>

<p>A crucial fact for the Prime Number Theorem is that \\(\\zeta(1 + it) \\neq 0\\) for all real \\(t \\neq 0\\). We defer the proof to Chapter 6, but outline the strategy:</p>

<div class="env-block theorem">
    <div class="env-title">Theorem 5.12 (Zero-Free on \\(\\text{Re}(s) = 1\\))</div>
    <div class="env-body">
        <p>\\(\\zeta(s) \\neq 0\\) for \\(\\text{Re}(s) = 1\\).</p>
        <p><em>Key ingredient:</em> The trigonometric inequality \\(3 + 4\\cos\\theta + \\cos 2\\theta \\geq 0\\) implies</p>
        \\[\\zeta(\\sigma)^3 |\\zeta(\\sigma+it)|^4 |\\zeta(\\sigma+2it)| \\geq 1 \\quad (\\sigma > 1).\\]
        <p>If \\(\\zeta(1+it_0) = 0\\), then \\(|\\zeta(\\sigma+it_0)|^4 \\to 0\\) as \\(\\sigma \\to 1^+\\), while \\(\\zeta(\\sigma)^3 \\sim (\\sigma-1)^{-3}\\) and \\(|\\zeta(\\sigma+2it_0)| = O(1)\\). The inequality forces \\((\\sigma-1)^{-3}\\cdot (\\sigma-1)^4 \\cdot O(1) = O(\\sigma-1) \\geq 1\\), a contradiction as \\(\\sigma \\to 1^+\\).</p>
    </div>
</div>

<h3>The Riemann Hypothesis: A Precise Statement</h3>

<div class="env-block definition">
    <div class="env-title">The Riemann Hypothesis (RH)</div>
    <div class="env-body">
        <p>All non-trivial zeros of \\(\\zeta(s)\\) satisfy \\(\\text{Re}(\\rho) = 1/2\\).</p>
        <p>Equivalently (via Perron's formula): \\(\\psi(x) = x + O(x^{1/2+\\epsilon})\\) for every \\(\\epsilon > 0\\). The best unconditional bound is \\(\\psi(x) = x + O(x \\exp(-c\\sqrt{\\log x}))\\) (Chapter 7). Under RH, the error shrinks to nearly \\(O(\\sqrt{x}\\log^2 x)\\).</p>
    </div>
</div>

<h3>Counting Non-Trivial Zeros: The \\(N(T)\\) Function</h3>

<p>Let \\(N(T)\\) count the zeros \\(\\rho = \\beta + i\\gamma\\) with \\(0 < \\gamma \\leq T\\) (counting multiplicity). By the argument principle applied to \\(\\xi(s)\\):</p>

<div class="env-block theorem">
    <div class="env-title">Theorem 5.13 (Riemann–von Mangoldt Formula)</div>
    <div class="env-body">
        \\[N(T) = \\frac{T}{2\\pi}\\log\\frac{T}{2\\pi e} + \\frac{7}{8} + O(\\log T).\\]
    </div>
</div>

<p>This exact asymptotic formula shows that zeros are distributed like \\(T\\log T / (2\\pi)\\) up to height \\(T\\), with average gap \\(\\sim 2\\pi/\\log T\\) near height \\(T\\).</p>

<h3>Road Map: What Comes Next</h3>

<div class="env-block remark">
    <div class="env-title">The Structure of the Remaining Course</div>
    <div class="env-body">
        <ul>
            <li><strong>Chapter 6:</strong> Zero-free regions. We quantify how far to the left of \\(\\text{Re}(s) = 1\\) we know \\(\\zeta(s) \\neq 0\\). The classical region of Hadamard and de la Vallée Poussin is \\(\\sigma \\geq 1 - c/\\log(|t|+2)\\).</li>
            <li><strong>Chapter 7:</strong> The Prime Number Theorem. Using Perron's formula and the zero-free region, we prove \\(\\psi(x) \\sim x\\), equivalently \\(\\pi(x) \\sim x/\\log x\\).</li>
            <li><strong>Chapter 8:</strong> The Explicit Formula. The full asymptotic expansion \\(\\psi(x) = x - \\sum_\\rho x^\\rho/\\rho + \\cdots\\) encodes the precise relationship between primes and zeros.</li>
            <li><strong>Chapter 9:</strong> L-functions. The Hurwitz zeta decomposition \\(L(s,\\chi) = q^{-s}\\sum \\chi(a)\\zeta(s,a/q)\\) from this chapter is the starting point for extending all of the above to arithmetic progressions.</li>
        </ul>
    </div>
</div>

<h3>Summary: The Completed Zeta Function</h3>

<p>The central objects introduced in this chapter are:</p>
\\[\\boxed{\\xi(s) = \\frac{1}{2}s(s-1)\\pi^{-s/2}\\Gamma(s/2)\\zeta(s), \\quad \\xi(s) = \\xi(1-s).}\\]
<p>The analytic continuation extends \\(\\zeta(s)\\) from the half-plane \\(\\text{Re}(s) > 1\\) to a meromorphic function on \\(\\mathbb{C}\\) with a single simple pole at \\(s = 1\\). The functional equation reveals the symmetry of this global object. The Hurwitz zeta function generalizes and connects to the full L-function zoo. Perron's formula translates all of this back into the counting of primes.</p>
`,
            visualizations: [],
            exercises: [
                {
                    question: 'Use the Riemann-von Mangoldt formula to estimate: (a) \\(N(100)\\), the number of non-trivial zeros with imaginary part between 0 and 100; (b) the average gap between consecutive zeros near height \\(T = 1000\\).',
                    hint: 'Apply the formula \\(N(T) \\approx \\frac{T}{2\\pi}\\log\\frac{T}{2\\pi}\\) (dropping lower-order terms). For the gap, note the \\(n\\)-th zero near height \\(T\\) has gap \\(\\approx 1/N\'(T)\\).',
                    solution: '(a) \\(N(100) \\approx \\frac{100}{2\\pi}\\log\\frac{100}{2\\pi} \\approx \\frac{100}{6.28}\\log(15.92) \\approx 15.92\\times 2.77 \\approx 44\\). (Actual value: \\(N(100) = 29\\), the formula is not so tight at small \\(T\\).) (b) At \\(T=1000\\): \\(N\'(T) = \\frac{1}{2\\pi}\\log\\frac{T}{2\\pi} \\approx \\frac{\\log(159)}{6.28} \\approx \\frac{5.07}{6.28} \\approx 0.81\\) zeros per unit, so average gap \\(\\approx 1/0.81 \\approx 1.23\\).'
                },
                {
                    question: "Explain in words why the functional equation \\(\\xi(s) = \\xi(1-s)\\) implies that if \\(\\rho\\) is a zero of \\(\\zeta(s)\\), then so is \\(1-\\rho\\), \\(\\bar{\\rho}\\), and \\(1-\\bar{\\rho}\\). Under what conditions do some of these coincide?",
                    hint: 'Use (1) \\(\\xi(s)=\\xi(1-s)\\); (2) the functional equation for complex conjugates \\(\\overline{\\xi(s)} = \\xi(\\bar{s})\\) (since \\(\\xi\\) has real Fourier/Taylor coefficients). For coincidences, consider \\(\\rho = 1-\\rho\\) (critical line) or \\(\\rho = \\bar{\\rho}\\) (real axis).',
                    solution: 'Since \\(\\xi(\\rho)=0\\): (1) \\(\\xi(1-\\rho) = \\xi(\\rho) = 0\\), so \\(1-\\rho\\) is also a zero. (2) Since \\(\\xi\\) has real coefficients, \\(\\overline{\\xi(s)} = \\xi(\\bar{s})\\), so \\(0 = \\overline{\\xi(\\rho)} = \\xi(\\bar{\\rho})\\), giving \\(\\bar{\\rho}\\) as a zero. (3) Combining: \\(1-\\bar{\\rho}\\) is a zero. Coincidences: \\(\\rho = 1-\\rho\\) iff \\(\\text{Re}(\\rho) = 1/2\\) (on the critical line — the RH zeros, forming pairs \\(\\{\\rho, \\bar\\rho\\}\\)). \\(\\rho = \\bar{\\rho}\\) iff \\(\\text{Im}(\\rho)=0\\) (real zeros — no non-trivial real zeros exist, as one can show). Generically, non-trivial zeros form quadruples.'
                },
                {
                    question: "Compute \\(\\zeta(0)\\). Use either the functional equation or the Laurent expansion \\(\\zeta(s) = 1/(s-1) + \\gamma + O(s-1)\\) and analytic continuation, verifying \\(\\zeta(0) = -1/2\\).",
                    hint: 'Use the formula \\(\\zeta(s) = 2^s\\pi^{s-1}\\sin(\\pi s/2)\\Gamma(1-s)\\zeta(1-s)\\) at \\(s=0\\). Or use \\(\\zeta(0) = \\lim_{s\\to 0} \\zeta(s)\\) from the Euler–Maclaurin representation.',
                    solution: 'From the functional equation at \\(s=0\\): \\(\\zeta(0) = 2^0\\pi^{-1}\\sin(0)\\Gamma(1)\\zeta(1)\\)... but \\(\\sin(0)=0\\) and \\(\\zeta(1)=\\infty\\), giving an indeterminate form. Instead, use the Euler-Maclaurin formula: \\(\\zeta(s) = \\frac{s}{s-1} - s\\int_1^\\infty\\{x\\}x^{-s-1}dx\\). At \\(s=0\\): \\(\\zeta(0) = 0/(0-1) - 0 = 0/(-1) = 0\\)... More carefully, \\(\\zeta(s) = s/(s-1) + \\text{analytic}\\) and \\(s/(s-1)|_{s=0} = 0/(-1) = 0\\). Using the formula \\(\\zeta(0,a) = 1/2-a\\) with \\(a=1\\): \\(\\zeta(0)=\\zeta(0,1)=1/2-1=-1/2\\). This can also be verified via the Laurent expansion near \\(s=1\\) and the functional equation applied carefully.'
                }
            ]
        }
    ]
});
