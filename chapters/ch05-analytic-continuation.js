window.CHAPTERS = window.CHAPTERS || [];
window.CHAPTERS.push({
    id: 'ch05',
    number: 5,
    title: 'Analytic Continuation & Functional Equation',
    subtitle: 'Revealing the hidden symmetry s \u2194 1\u2212s',
    sections: [
        // ================================================================
        // SECTION 1: Motivation
        // ================================================================
        {
            id: 'sec-motivation',
            title: 'Why Continue?',
            content: `
<h2>Why Continue Beyond \\(\\sigma > 1\\)?</h2>

<div class="env-block intuition">
    <div class="env-title">The Core Tension</div>
    <div class="env-body">
        <p>We defined \\(\\zeta(s) = \\sum_{n=1}^{\\infty} n^{-s}\\) for \\(\\operatorname{Re}(s) > 1\\). The Euler product lives there, primes live there, everything is clean. But the zeros that control the distribution of primes (the Riemann Hypothesis, the explicit formula) all live in \\(0 < \\operatorname{Re}(s) < 1\\), where the series <em>diverges</em>.</p>
        <p>We need a principled way to extend \\(\\zeta(s)\\) to the entire complex plane. Not a trick, not a different function. The <strong>same</strong> function, defined by the same analytic identity, pushed past the boundary of convergence.</p>
    </div>
</div>

<h3>What Is Analytic Continuation?</h3>

<div class="env-block definition">
    <div class="env-title">Definition 5.1 (Analytic Continuation)</div>
    <div class="env-body">
        <p>Let \\(f\\) be analytic on a domain \\(D_1 \\subset \\mathbb{C}\\), and let \\(g\\) be analytic on \\(D_2 \\subset \\mathbb{C}\\), with \\(D_1 \\cap D_2\\) nonempty and connected. If \\(f(s) = g(s)\\) for all \\(s \\in D_1 \\cap D_2\\), then \\(g\\) is called the <strong>analytic continuation</strong> of \\(f\\) to \\(D_2\\).</p>
    </div>
</div>

<div class="env-block theorem">
    <div class="env-title">Theorem 5.1 (Uniqueness of Analytic Continuation)</div>
    <div class="env-body">
        <p>The analytic continuation, if it exists, is <strong>unique</strong>. If \\(g_1\\) and \\(g_2\\) are both analytic on \\(D_2\\) and agree with \\(f\\) on \\(D_1 \\cap D_2\\), then \\(g_1 \\equiv g_2\\) on \\(D_2\\).</p>
    </div>
</div>

<p>This is the identity theorem for holomorphic functions. Two analytic functions that agree on a set with a limit point must agree everywhere on their common domain. It means there is exactly <em>one</em> right answer: the continuation is determined by the original definition.</p>

<h3>A Warm-Up: The Geometric Series</h3>

<p>The series \\(\\sum_{n=0}^{\\infty} z^n\\) converges only for \\(|z| < 1\\). But the function \\(f(z) = 1/(1-z)\\) is analytic on \\(\\mathbb{C} \\setminus \\{1\\}\\). Inside the disk, the series equals \\(1/(1-z)\\). Outside the disk, the series diverges, but the function \\(1/(1-z)\\) is perfectly well-defined. This is analytic continuation in its simplest form.</p>

<h3>The Strategy for \\(\\zeta(s)\\)</h3>

<p>We will continue \\(\\zeta(s)\\) in two stages:</p>
<ol>
    <li><strong>To \\(\\operatorname{Re}(s) > 0\\)</strong> (except \\(s = 1\\)): using the alternating zeta function (Dirichlet eta function) or partial summation.</li>
    <li><strong>To all of \\(\\mathbb{C}\\)</strong> (except \\(s = 1\\)): using the Jacobi theta function and the Mellin transform, which simultaneously reveals the functional equation.</li>
</ol>

<h3>First Extension: The Half-Plane \\(\\sigma > 0\\)</h3>

<p>Consider the integral representation valid for \\(\\sigma > 1\\):</p>

\\[
\\zeta(s) = \\frac{s}{s-1} - s \\int_1^{\\infty} \\{x\\} x^{-s-1}\\, dx,
\\]

<p>where \\(\\{x\\} = x - \\lfloor x \\rfloor\\) is the fractional part. Since \\(0 \\le \\{x\\} < 1\\), the integral converges absolutely for \\(\\sigma > 0\\), and the right-hand side is meromorphic there with a simple pole at \\(s = 1\\) of residue \\(1\\).</p>

<div class="env-block remark">
    <div class="env-title">Remark: The Pole at \\(s = 1\\)</div>
    <div class="env-body">
        <p>The pole at \\(s=1\\) is not an artifact of our method. It reflects the divergence of the harmonic series \\(\\sum 1/n\\). More deeply, it encodes the "density" of all integers: the sum over <em>all</em> integers weighted by \\(n^{-s}\\) should diverge at \\(s=1\\) because the integers have density 1.</p>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-poisson-duality"></div>
`,
            visualizations: [
                {
                    id: 'viz-poisson-duality',
                    title: 'Poisson Summation Duality',
                    description: 'Poisson summation relates sums over a lattice to sums over the dual lattice: \\(\\sum_n f(n) = \\sum_k \\hat{f}(k)\\). Drag the width parameter to see how a narrow Gaussian in the spatial domain yields a wide Gaussian in the frequency domain, and vice versa. This duality is the engine behind the functional equation.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 400,
                            originX: 280, originY: 310, scale: 50
                        });

                        var sigma = 0.5;
                        VizEngine.createSlider(controls, '\u03c3 (width)', 0.15, 2.0, sigma, 0.05, function(v) {
                            sigma = v; draw();
                        });

                        function gaussian(x, s) {
                            return Math.exp(-Math.PI * x * x / (s * s));
                        }
                        function gaussianFT(k, s) {
                            return s * Math.exp(-Math.PI * k * k * s * s);
                        }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            // Title
                            viz.screenText('Poisson Summation: f vs f\u0302', viz.width / 2, 20, viz.colors.white, 14);

                            // Top half: f(x) = exp(-pi x^2 / sigma^2) and lattice samples
                            var topOriginY = 140;
                            var botOriginY = 310;

                            // Labels
                            viz.screenText('f(x) = exp(-\u03c0x\u00b2/\u03c3\u00b2)', viz.width / 2, 45, viz.colors.blue, 12);
                            viz.screenText('f\u0302(k) = \u03c3 exp(-\u03c0k\u00b2\u03c3\u00b2)', viz.width / 2, 205, viz.colors.teal, 12);

                            // Draw f(x) curve
                            ctx.strokeStyle = viz.colors.blue;
                            ctx.lineWidth = 2;
                            ctx.beginPath();
                            var started = false;
                            for (var px = 0; px <= viz.width; px++) {
                                var x = (px - 280) / 50;
                                var y = gaussian(x, sigma);
                                var sy = topOriginY - y * 100;
                                if (!started) { ctx.moveTo(px, sy); started = true; }
                                else ctx.lineTo(px, sy);
                            }
                            ctx.stroke();

                            // x-axis for top
                            ctx.strokeStyle = viz.colors.axis;
                            ctx.lineWidth = 1;
                            ctx.beginPath();
                            ctx.moveTo(0, topOriginY);
                            ctx.lineTo(viz.width, topOriginY);
                            ctx.stroke();

                            // Lattice samples for f
                            var sumF = 0;
                            for (var n = -5; n <= 5; n++) {
                                var val = gaussian(n, sigma);
                                sumF += val;
                                var sx = 280 + n * 50;
                                if (sx < 10 || sx > viz.width - 10) continue;
                                ctx.fillStyle = viz.colors.orange;
                                ctx.beginPath();
                                ctx.arc(sx, topOriginY - val * 100, 4, 0, Math.PI * 2);
                                ctx.fill();
                                // stem
                                ctx.strokeStyle = viz.colors.orange + '66';
                                ctx.lineWidth = 1;
                                ctx.beginPath();
                                ctx.moveTo(sx, topOriginY);
                                ctx.lineTo(sx, topOriginY - val * 100);
                                ctx.stroke();
                            }

                            // Draw f-hat curve
                            ctx.strokeStyle = viz.colors.teal;
                            ctx.lineWidth = 2;
                            ctx.beginPath();
                            started = false;
                            for (var px2 = 0; px2 <= viz.width; px2++) {
                                var k = (px2 - 280) / 50;
                                var y2 = gaussianFT(k, sigma);
                                var sy2 = botOriginY - y2 * 100;
                                if (sy2 < 180) sy2 = 180;
                                if (!started) { ctx.moveTo(px2, sy2); started = true; }
                                else ctx.lineTo(px2, sy2);
                            }
                            ctx.stroke();

                            // k-axis for bottom
                            ctx.strokeStyle = viz.colors.axis;
                            ctx.lineWidth = 1;
                            ctx.beginPath();
                            ctx.moveTo(0, botOriginY);
                            ctx.lineTo(viz.width, botOriginY);
                            ctx.stroke();

                            // Lattice samples for f-hat
                            var sumFhat = 0;
                            for (var m = -5; m <= 5; m++) {
                                var val2 = gaussianFT(m, sigma);
                                sumFhat += val2;
                                var sx2 = 280 + m * 50;
                                if (sx2 < 10 || sx2 > viz.width - 10) continue;
                                ctx.fillStyle = viz.colors.purple;
                                ctx.beginPath();
                                ctx.arc(sx2, botOriginY - val2 * 100, 4, 0, Math.PI * 2);
                                ctx.fill();
                                ctx.strokeStyle = viz.colors.purple + '66';
                                ctx.lineWidth = 1;
                                ctx.beginPath();
                                ctx.moveTo(sx2, botOriginY);
                                ctx.lineTo(sx2, botOriginY - val2 * 100);
                                ctx.stroke();
                            }

                            // Show sums
                            viz.screenText('\u03a3 f(n) \u2248 ' + sumF.toFixed(3), 100, topOriginY + 22, viz.colors.orange, 12);
                            viz.screenText('\u03a3 f\u0302(k) \u2248 ' + sumFhat.toFixed(3), 100, botOriginY + 22, viz.colors.purple, 12);
                            viz.screenText('Equal by Poisson!', viz.width - 100, botOriginY + 22,
                                Math.abs(sumF - sumFhat) < 0.1 ? viz.colors.green : viz.colors.red, 12);

                            viz.screenText('\u03c3 = ' + sigma.toFixed(2), viz.width - 80, 45, viz.colors.white, 12);
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Show that the Dirichlet eta function \\(\\eta(s) = \\sum_{n=1}^{\\infty} (-1)^{n-1} n^{-s}\\) converges for \\(\\operatorname{Re}(s) > 0\\) and satisfies \\(\\eta(s) = (1 - 2^{1-s})\\zeta(s)\\).',
                    hint: 'Write \\(\\eta(s) = \\sum n^{-s} - 2\\sum (2n)^{-s}\\) and use the alternating series / Abel summation.',
                    solution: 'Group terms: \\(\\eta(s) = \\sum_{n=1}^{\\infty} n^{-s} - 2 \\sum_{n=1}^{\\infty} (2n)^{-s} = \\zeta(s) - 2 \\cdot 2^{-s} \\zeta(s) = (1 - 2^{1-s})\\zeta(s)\\). The alternating series converges for \\(\\sigma > 0\\) by Dirichlet\'s test (partial sums of \\((-1)^{n-1}\\) are bounded and \\(n^{-s} \\to 0\\)). Since \\(1 - 2^{1-s} \\neq 0\\) for \\(s \\neq 1\\) (for \\(\\sigma > 0\\)), we get \\(\\zeta(s) = \\eta(s)/(1-2^{1-s})\\) as the continuation to \\(\\sigma > 0\\).'
                }
            ]
        },

        // ================================================================
        // SECTION 2: The Jacobi Theta Function
        // ================================================================
        {
            id: 'sec-theta',
            title: 'The Jacobi Theta Function',
            content: `
<h2>The Jacobi Theta Function</h2>

<div class="env-block intuition">
    <div class="env-title">Why Theta?</div>
    <div class="env-body">
        <p>The key to the functional equation is a function from a completely different part of mathematics: the theory of elliptic functions and modular forms. The Jacobi theta function \\(\\vartheta(t)\\) is the sum of Gaussian-like terms, and it satisfies a remarkable self-duality under \\(t \\mapsto 1/t\\). This duality, which is Poisson summation in disguise, will generate the symmetry \\(s \\leftrightarrow 1-s\\) for \\(\\zeta\\).</p>
    </div>
</div>

<div class="env-block definition">
    <div class="env-title">Definition 5.2 (Jacobi Theta Function)</div>
    <div class="env-body">
        <p>For \\(t > 0\\), define</p>
        \\[
        \\vartheta(t) = \\sum_{n=-\\infty}^{\\infty} e^{-\\pi n^2 t}.
        \\]
        <p>This converges rapidly for \\(t > 0\\) (each term is a Gaussian evaluated at integer points).</p>
    </div>
</div>

<div class="env-block theorem">
    <div class="env-title">Theorem 5.2 (Jacobi's Modular Relation)</div>
    <div class="env-body">
        <p>For all \\(t > 0\\),</p>
        \\[
        \\vartheta(t) = \\frac{1}{\\sqrt{t}}\\, \\vartheta\\!\\left(\\frac{1}{t}\\right).
        \\]
    </div>
</div>

<h3>Proof via Poisson Summation</h3>

<p>The Poisson summation formula states that for a Schwartz function \\(f\\),</p>
\\[
\\sum_{n \\in \\mathbb{Z}} f(n) = \\sum_{k \\in \\mathbb{Z}} \\hat{f}(k),
\\]
<p>where \\(\\hat{f}(\\xi) = \\int_{-\\infty}^{\\infty} f(x) e^{-2\\pi i x \\xi}\\, dx\\) is the Fourier transform.</p>

<p>Take \\(f(x) = e^{-\\pi x^2 t}\\). Its Fourier transform is</p>
\\[
\\hat{f}(\\xi) = \\frac{1}{\\sqrt{t}}\\, e^{-\\pi \\xi^2 / t}.
\\]
<p>This is the self-duality of the Gaussian: it is its own Fourier transform (up to scaling). Applying Poisson summation:</p>
\\[
\\sum_{n \\in \\mathbb{Z}} e^{-\\pi n^2 t} = \\frac{1}{\\sqrt{t}} \\sum_{k \\in \\mathbb{Z}} e^{-\\pi k^2 / t},
\\]
<p>which is exactly \\(\\vartheta(t) = t^{-1/2}\\, \\vartheta(1/t)\\). \\(\\square\\)</p>

<h3>Behavior of \\(\\vartheta\\)</h3>

<p>As \\(t \\to \\infty\\): \\(\\vartheta(t) \\to 1\\) (all terms except \\(n=0\\) are exponentially small).</p>
<p>As \\(t \\to 0^+\\): \\(\\vartheta(t) \\sim 1/\\sqrt{t} \\to \\infty\\) (by the modular relation).</p>

<p>Define the "half-theta":</p>
\\[
\\psi(t) = \\sum_{n=1}^{\\infty} e^{-\\pi n^2 t} = \\frac{\\vartheta(t) - 1}{2}.
\\]
<p>The modular relation becomes:</p>
\\[
2\\psi(t) + 1 = \\frac{1}{\\sqrt{t}}\\bigl(2\\psi(1/t) + 1\\bigr).
\\]

<div class="viz-placeholder" data-viz="viz-mellin-bridge"></div>
`,
            visualizations: [
                {
                    id: 'viz-mellin-bridge',
                    title: 'The Theta Function and Its Modular Symmetry',
                    description: 'The theta function \\(\\vartheta(t) = \\sum e^{-\\pi n^2 t}\\) for \\(t > 0\\). The blue curve shows \\(\\vartheta(t)\\) and the teal curve shows \\(t^{-1/2}\\vartheta(1/t)\\). By Jacobi\'s relation, they are identical. Adjust the number of terms to see convergence.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 380,
                            originX: 80, originY: 300, scale: 60
                        });

                        var nTerms = 10;
                        VizEngine.createSlider(controls, 'Terms', 1, 30, nTerms, 1, function(v) {
                            nTerms = Math.round(v); draw();
                        });

                        function theta(t, N) {
                            var s = 1; // n=0 term
                            for (var n = 1; n <= N; n++) {
                                s += 2 * Math.exp(-Math.PI * n * n * t);
                            }
                            return s;
                        }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            viz.screenText('\u03d1(t) and t^{-1/2}\u03d1(1/t)', viz.width / 2, 20, viz.colors.white, 14);

                            // Axes
                            // x-axis
                            ctx.strokeStyle = viz.colors.axis;
                            ctx.lineWidth = 1;
                            ctx.beginPath();
                            ctx.moveTo(80, 300);
                            ctx.lineTo(540, 300);
                            ctx.stroke();
                            // y-axis
                            ctx.beginPath();
                            ctx.moveTo(80, 300);
                            ctx.lineTo(80, 40);
                            ctx.stroke();

                            // Axis labels
                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '11px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            for (var tx = 0; tx <= 7; tx++) {
                                var sx = 80 + tx * 60;
                                ctx.fillText(tx.toString(), sx, 315);
                                ctx.strokeStyle = viz.colors.grid;
                                ctx.lineWidth = 0.5;
                                ctx.beginPath();
                                ctx.moveTo(sx, 300);
                                ctx.lineTo(sx, 40);
                                ctx.stroke();
                            }
                            ctx.textAlign = 'right';
                            for (var yv = 1; yv <= 4; yv++) {
                                var sy = 300 - yv * 60;
                                ctx.fillStyle = viz.colors.text;
                                ctx.fillText(yv.toString(), 74, sy + 4);
                                ctx.strokeStyle = viz.colors.grid;
                                ctx.lineWidth = 0.5;
                                ctx.beginPath();
                                ctx.moveTo(80, sy);
                                ctx.lineTo(540, sy);
                                ctx.stroke();
                            }

                            // Plot theta(t) in blue
                            ctx.strokeStyle = viz.colors.blue;
                            ctx.lineWidth = 2.5;
                            ctx.beginPath();
                            var started = false;
                            for (var px = 82; px <= 540; px++) {
                                var t = (px - 80) / 60;
                                if (t < 0.05) continue;
                                var val = theta(t, nTerms);
                                var py = 300 - val * 60;
                                if (py < 35) { started = false; continue; }
                                if (!started) { ctx.moveTo(px, py); started = true; }
                                else ctx.lineTo(px, py);
                            }
                            ctx.stroke();

                            // Plot t^{-1/2} theta(1/t) in teal (dashed)
                            ctx.strokeStyle = viz.colors.teal;
                            ctx.lineWidth = 2;
                            ctx.setLineDash([6, 4]);
                            ctx.beginPath();
                            started = false;
                            for (var px2 = 82; px2 <= 540; px2++) {
                                var t2 = (px2 - 80) / 60;
                                if (t2 < 0.05) continue;
                                var val2 = (1 / Math.sqrt(t2)) * theta(1 / t2, nTerms);
                                var py2 = 300 - val2 * 60;
                                if (py2 < 35) { started = false; continue; }
                                if (!started) { ctx.moveTo(px2, py2); started = true; }
                                else ctx.lineTo(px2, py2);
                            }
                            ctx.stroke();
                            ctx.setLineDash([]);

                            // Highlight t=1 (fixed point)
                            var sx1 = 80 + 60;
                            ctx.strokeStyle = viz.colors.yellow + '66';
                            ctx.lineWidth = 1;
                            ctx.setLineDash([3, 3]);
                            ctx.beginPath();
                            ctx.moveTo(sx1, 300);
                            ctx.lineTo(sx1, 40);
                            ctx.stroke();
                            ctx.setLineDash([]);
                            viz.screenText('t = 1', sx1, 330, viz.colors.yellow, 10);

                            // Legend
                            ctx.fillStyle = viz.colors.blue;
                            ctx.fillRect(360, 42, 20, 3);
                            viz.screenText('\u03d1(t)', 400, 45, viz.colors.blue, 11, 'left');

                            ctx.strokeStyle = viz.colors.teal;
                            ctx.lineWidth = 2;
                            ctx.setLineDash([4, 3]);
                            ctx.beginPath();
                            ctx.moveTo(360, 60);
                            ctx.lineTo(380, 60);
                            ctx.stroke();
                            ctx.setLineDash([]);
                            viz.screenText('t\u207b\u00b9\u00b2\u03d1(1/t)', 400, 62, viz.colors.teal, 11, 'left');

                            viz.screenText('N = ' + nTerms + ' terms', viz.width - 60, 330, viz.colors.text, 10);
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Verify the Fourier transform: if \\(f(x) = e^{-\\pi x^2 t}\\), show that \\(\\hat{f}(\\xi) = t^{-1/2} e^{-\\pi \\xi^2/t}\\).',
                    hint: 'Complete the square in the exponent of \\(\\int e^{-\\pi x^2 t - 2\\pi i x \\xi} dx\\).',
                    solution: 'Write \\(-\\pi t x^2 - 2\\pi i x \\xi = -\\pi t (x + i\\xi/t)^2 - \\pi \\xi^2/t\\). Shift the contour: \\(\\int e^{-\\pi t u^2} du = 1/\\sqrt{t}\\) by the Gaussian integral. So \\(\\hat{f}(\\xi) = t^{-1/2} e^{-\\pi \\xi^2/t}\\).'
                },
                {
                    question: 'Show that \\(\\vartheta(t)\\) is exponentially close to 1 for large \\(t\\): prove \\(|\\vartheta(t) - 1| \\le 2e^{-\\pi t}/(1 - e^{-\\pi t})\\) for \\(t > 0\\).',
                    hint: 'Bound the tail by a geometric series: \\(\\sum_{n=1}^{\\infty} e^{-\\pi n^2 t} \\le \\sum_{n=1}^{\\infty} e^{-\\pi n t}\\).',
                    solution: 'Since \\(n^2 \\ge n\\) for \\(n \\ge 1\\), we have \\(e^{-\\pi n^2 t} \\le e^{-\\pi n t}\\). So \\(\\psi(t) = \\sum_{n=1}^{\\infty} e^{-\\pi n^2 t} \\le \\sum_{n=1}^{\\infty} e^{-\\pi n t} = e^{-\\pi t}/(1 - e^{-\\pi t})\\). Since \\(\\vartheta(t) = 1 + 2\\psi(t)\\), we get \\(|\\vartheta(t) - 1| \\le 2e^{-\\pi t}/(1-e^{-\\pi t})\\).'
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
<h2>The Mellin Transform: Connecting \\(\\vartheta\\) to \\(\\zeta\\)</h2>

<div class="env-block intuition">
    <div class="env-title">What Does Mellin Do?</div>
    <div class="env-body">
        <p>The Mellin transform is a multiplicative Fourier transform. Where the ordinary Fourier transform decomposes functions into additive characters \\(e^{2\\pi i x \\xi}\\), the Mellin transform decomposes into multiplicative characters \\(x^{s-1}\\). It is the natural transform for Dirichlet series and will convert the theta function's sum of Gaussians directly into the zeta function.</p>
    </div>
</div>

<div class="env-block definition">
    <div class="env-title">Definition 5.3 (Mellin Transform)</div>
    <div class="env-body">
        <p>The Mellin transform of \\(f: (0,\\infty) \\to \\mathbb{C}\\) is</p>
        \\[
        \\mathcal{M}[f](s) = \\int_0^{\\infty} f(t)\\, t^{s-1}\\, dt,
        \\]
        <p>defined in a vertical strip \\(a < \\operatorname{Re}(s) < b\\) where the integral converges absolutely.</p>
    </div>
</div>

<h3>The Key Computation</h3>

<p>We compute the Mellin transform of \\(\\psi(t) = \\sum_{n=1}^{\\infty} e^{-\\pi n^2 t}\\). For \\(\\sigma > 1\\):</p>

\\[
\\int_0^{\\infty} \\psi(t)\\, t^{s/2-1}\\, dt = \\sum_{n=1}^{\\infty} \\int_0^{\\infty} e^{-\\pi n^2 t}\\, t^{s/2-1}\\, dt.
\\]

<p>Substituting \\(u = \\pi n^2 t\\):</p>

\\[
\\int_0^{\\infty} e^{-\\pi n^2 t}\\, t^{s/2-1}\\, dt = \\frac{1}{(\\pi n^2)^{s/2}} \\int_0^{\\infty} e^{-u}\\, u^{s/2-1}\\, du = \\frac{\\Gamma(s/2)}{\\pi^{s/2} n^s}.
\\]

<p>Summing over \\(n\\):</p>

\\[
\\int_0^{\\infty} \\psi(t)\\, t^{s/2-1}\\, dt = \\frac{\\Gamma(s/2)}{\\pi^{s/2}} \\sum_{n=1}^{\\infty} \\frac{1}{n^s} = \\frac{\\Gamma(s/2)}{\\pi^{s/2}}\\, \\zeta(s).
\\]

<div class="env-block theorem">
    <div class="env-title">Theorem 5.3 (Mellin Transform of Theta)</div>
    <div class="env-body">
        <p>For \\(\\operatorname{Re}(s) > 1\\),</p>
        \\[
        \\pi^{-s/2}\\,\\Gamma(s/2)\\,\\zeta(s) = \\int_0^{\\infty} \\psi(t)\\, t^{s/2}\\, \\frac{dt}{t}.
        \\]
        <p>The left side is the "completed" zeta function. This integral is the bridge between theta and zeta.</p>
    </div>
</div>

<h3>The Gamma Factor</h3>

<p>The factor \\(\\pi^{-s/2} \\Gamma(s/2)\\) is not decoration. It arises inevitably from the Mellin transform of the Gaussian. We define the <strong>completed zeta function</strong>:</p>

\\[
\\xi(s) = \\frac{1}{2} s(s-1) \\pi^{-s/2} \\Gamma(s/2) \\zeta(s).
\\]

<p>The prefactor \\(\\frac{1}{2}s(s-1)\\) cancels the pole at \\(s=1\\) (from \\(\\zeta\\)) and the pole at \\(s=0\\) (from \\(\\Gamma(s/2)\\)), making \\(\\xi(s)\\) an entire function. The functional equation will say \\(\\xi(s) = \\xi(1-s)\\).</p>

<div class="viz-placeholder" data-viz="viz-contour-hankel"></div>
`,
            visualizations: [
                {
                    id: 'viz-contour-hankel',
                    title: 'The Mellin Bridge: From \\(\\psi\\) to \\(\\zeta\\)',
                    description: 'The Mellin transform converts the exponential decay of \\(\\psi(t)\\) into the power-law coefficients of \\(\\zeta(s)\\). This shows \\(\\psi(t)\\) (left) being integrated against \\(t^{s/2-1}\\) (right, for a chosen real \\(s\\)) to produce \\(\\pi^{-s/2}\\Gamma(s/2)\\zeta(s)\\).',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 380,
                            originX: 0, originY: 0, scale: 1
                        });

                        var sVal = 2.0;
                        VizEngine.createSlider(controls, 's (real)', 1.1, 6.0, sVal, 0.1, function(v) {
                            sVal = v; draw();
                        });

                        function psi(t) {
                            var s = 0;
                            for (var n = 1; n <= 20; n++) {
                                s += Math.exp(-Math.PI * n * n * t);
                            }
                            return s;
                        }

                        function gammaLanczos(z) {
                            if (z < 0.5) return Math.PI / (Math.sin(Math.PI * z) * gammaLanczos(1 - z));
                            z -= 1;
                            var g = 7;
                            var c = [0.99999999999980993, 676.5203681218851, -1259.1392167224028,
                                771.32342877765313, -176.61502916214059, 12.507343278686905,
                                -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7];
                            var x = c[0];
                            for (var i = 1; i < g + 2; i++) x += c[i] / (z + i);
                            var t = z + g + 0.5;
                            return Math.sqrt(2 * Math.PI) * Math.pow(t, z + 0.5) * Math.exp(-t) * x;
                        }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            viz.screenText('Mellin Transform: \u03c8(t) \u00d7 t^(s/2-1)', viz.width / 2, 20, viz.colors.white, 14);

                            var leftW = 260;
                            var rightW = 260;
                            var margin = 40;

                            // Left panel: psi(t)
                            var lx0 = 50, ly0 = 320;
                            var lxScale = 30, lyScale = 200;

                            // x-axis
                            ctx.strokeStyle = viz.colors.axis;
                            ctx.lineWidth = 1;
                            ctx.beginPath();
                            ctx.moveTo(lx0, ly0);
                            ctx.lineTo(lx0 + 7 * lxScale, ly0);
                            ctx.stroke();

                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '10px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            for (var tx = 0; tx <= 7; tx++) {
                                ctx.fillText(tx.toString(), lx0 + tx * lxScale, ly0 + 12);
                            }
                            viz.screenText('\u03c8(t)', lx0 + 3.5 * lxScale, 50, viz.colors.blue, 12);
                            viz.screenText('t', lx0 + 7 * lxScale + 10, ly0, viz.colors.text, 10);

                            // Plot psi(t)
                            ctx.strokeStyle = viz.colors.blue;
                            ctx.lineWidth = 2;
                            ctx.beginPath();
                            var started = false;
                            for (var px = 0; px <= 7 * lxScale; px++) {
                                var t = px / lxScale;
                                if (t < 0.01) continue;
                                var val = psi(t);
                                var py = ly0 - val * lyScale;
                                if (py < 40) { started = false; continue; }
                                if (!started) { ctx.moveTo(lx0 + px, py); started = true; }
                                else ctx.lineTo(lx0 + px, py);
                            }
                            ctx.stroke();

                            // Plot integrand psi(t) * t^{s/2 - 1} in teal
                            ctx.strokeStyle = viz.colors.teal;
                            ctx.lineWidth = 2;
                            ctx.beginPath();
                            started = false;
                            var integralVal = 0;
                            var dt = 0.01;
                            for (var px2 = 0; px2 <= 7 * lxScale; px2++) {
                                var t2 = px2 / lxScale;
                                if (t2 < 0.02) continue;
                                var val2 = psi(t2) * Math.pow(t2, sVal / 2 - 1);
                                if (t2 > 0.02) integralVal += psi(t2) * Math.pow(t2, sVal / 2 - 1) * dt;
                                var py2 = ly0 - val2 * lyScale;
                                if (py2 < 40 || !isFinite(py2)) { started = false; continue; }
                                if (!started) { ctx.moveTo(lx0 + px2, py2); started = true; }
                                else ctx.lineTo(lx0 + px2, py2);
                            }
                            ctx.stroke();

                            // Fill area under integrand
                            ctx.fillStyle = viz.colors.teal + '22';
                            ctx.beginPath();
                            ctx.moveTo(lx0 + 1, ly0);
                            for (var px3 = 1; px3 <= 7 * lxScale; px3++) {
                                var t3 = px3 / lxScale;
                                if (t3 < 0.02) continue;
                                var val3 = psi(t3) * Math.pow(t3, sVal / 2 - 1);
                                var py3 = ly0 - val3 * lyScale;
                                if (py3 < 40 || !isFinite(py3)) py3 = 40;
                                ctx.lineTo(lx0 + px3, py3);
                            }
                            ctx.lineTo(lx0 + 7 * lxScale, ly0);
                            ctx.closePath();
                            ctx.fill();

                            // Legend
                            ctx.fillStyle = viz.colors.blue;
                            ctx.fillRect(lx0 + 10, 65, 15, 3);
                            viz.screenText('\u03c8(t)', lx0 + 40, 68, viz.colors.blue, 10, 'left');

                            ctx.fillStyle = viz.colors.teal;
                            ctx.fillRect(lx0 + 10, 80, 15, 3);
                            viz.screenText('\u03c8(t)\u00b7t^(s/2-1)', lx0 + 40, 83, viz.colors.teal, 10, 'left');

                            // Result
                            var gammaVal = gammaLanczos(sVal / 2);
                            var expected = Math.pow(Math.PI, -sVal / 2) * gammaVal;
                            // zeta(s) for real s > 1
                            var zetaApprox = 0;
                            for (var nn = 1; nn <= 1000; nn++) zetaApprox += Math.pow(nn, -sVal);
                            expected *= zetaApprox;

                            viz.screenText('s = ' + sVal.toFixed(1), viz.width / 2, ly0 + 35, viz.colors.white, 13);
                            viz.screenText('\u03c0^(-s/2)\u0393(s/2)\u03b6(s) \u2248 ' + expected.toFixed(4), viz.width / 2, ly0 + 55, viz.colors.teal, 12);
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Show that \\(\\int_0^{\\infty} e^{-at} t^{s-1} dt = a^{-s} \\Gamma(s)\\) for \\(a > 0\\) and \\(\\operatorname{Re}(s) > 0\\), by substitution.',
                    hint: 'Set \\(u = at\\).',
                    solution: 'Substituting \\(u = at\\), \\(du = a\\,dt\\), so \\(\\int_0^\\infty e^{-at} t^{s-1} dt = \\int_0^\\infty e^{-u} (u/a)^{s-1} du/a = a^{-s} \\int_0^\\infty e^{-u} u^{s-1} du = a^{-s} \\Gamma(s)\\).'
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

<div class="env-block intuition">
    <div class="env-title">The Punchline</div>
    <div class="env-body">
        <p>We will prove that \\(\\xi(s) = \\xi(1-s)\\), where \\(\\xi(s)\\) is the completed zeta function. This is not just a formal identity; it is a deep structural symmetry. It says that the prime-counting information encoded in \\(\\zeta\\) on the right half-plane \\(\\sigma > 1/2\\) is completely determined by the values on the left half-plane \\(\\sigma < 1/2\\), and vice versa. The critical line \\(\\sigma = 1/2\\) is the axis of this symmetry.</p>
    </div>
</div>

<div class="env-block theorem">
    <div class="env-title">Theorem 5.4 (Riemann's Functional Equation)</div>
    <div class="env-body">
        <p>The function</p>
        \\[
        \\xi(s) = \\frac{1}{2} s(s-1) \\pi^{-s/2} \\Gamma(s/2) \\zeta(s)
        \\]
        <p>extends to an entire function satisfying</p>
        \\[
        \\xi(s) = \\xi(1-s).
        \\]
        <p>Equivalently,</p>
        \\[
        \\pi^{-s/2} \\Gamma(s/2) \\zeta(s) = \\pi^{-(1-s)/2} \\Gamma\\!\\left(\\frac{1-s}{2}\\right) \\zeta(1-s).
        \\]
    </div>
</div>

<h3>Proof (Riemann, 1859)</h3>

<p>From Theorem 5.3, for \\(\\sigma > 1\\):</p>
\\[
\\pi^{-s/2} \\Gamma(s/2) \\zeta(s) = \\int_0^{\\infty} \\psi(t)\\, t^{s/2}\\, \\frac{dt}{t}.
\\]

<p><strong>Step 1: Split the integral at \\(t = 1\\).</strong></p>
\\[
\\int_0^{\\infty} = \\int_0^1 + \\int_1^{\\infty}.
\\]

<p>The integral \\(\\int_1^{\\infty} \\psi(t) t^{s/2-1} dt\\) converges for all \\(s\\) (since \\(\\psi(t)\\) decays exponentially as \\(t \\to \\infty\\)). The problem is \\(\\int_0^1\\), where \\(\\psi(t)\\) blows up.</p>

<p><strong>Step 2: Use the modular relation.</strong> From \\(2\\psi(t) + 1 = t^{-1/2}(2\\psi(1/t) + 1)\\):</p>
\\[
\\psi(t) = \\frac{1}{2}\\left(t^{-1/2} - 1\\right) + t^{-1/2}\\psi(1/t).
\\]

<p><strong>Step 3: Substitute into \\(\\int_0^1\\).</strong></p>
\\[
\\int_0^1 \\psi(t) t^{s/2-1} dt = \\int_0^1 \\left[\\frac{t^{-1/2} - 1}{2} + t^{-1/2}\\psi(1/t)\\right] t^{s/2-1} dt.
\\]

<p>The first part gives:</p>
\\[
\\frac{1}{2}\\int_0^1 \\left(t^{(s-1)/2 - 1} - t^{s/2-1}\\right) dt = \\frac{1}{2}\\left(\\frac{1}{(s-1)/2} - \\frac{1}{s/2}\\right) = \\frac{1}{s-1} - \\frac{1}{s}.
\\]

<p>For the second part, substitute \\(u = 1/t\\):</p>
\\[
\\int_0^1 t^{-1/2} \\psi(1/t) t^{s/2-1} dt = \\int_1^{\\infty} \\psi(u) u^{(1-s)/2 - 1} du.
\\]

<p><strong>Step 4: Combine.</strong></p>
\\[
\\pi^{-s/2} \\Gamma(s/2) \\zeta(s) = \\frac{1}{s-1} - \\frac{1}{s} + \\int_1^{\\infty} \\psi(t)\\left(t^{s/2-1} + t^{(1-s)/2-1}\\right) dt.
\\]

<p>The right side is manifestly <strong>invariant under \\(s \\mapsto 1-s\\)</strong>: both the rational part \\(1/(s-1) - 1/s\\) (which equals \\(-1/s + 1/(s-1)\\) = \\(1/((1-s)-1) - 1/(1-s)\\) up to sign, check carefully!) and the integral (which has both \\(s\\) and \\(1-s\\) terms symmetrically) are invariant.</p>

<p>Moreover, the right side is meromorphic on all of \\(\\mathbb{C}\\), providing the analytic continuation. The poles come from \\(1/(s-1)\\) and \\(1/s\\), which are cancelled by the \\(s(s-1)/2\\) factor in \\(\\xi(s)\\). \\(\\square\\)</p>

<div class="env-block remark">
    <div class="env-title">Remark: The Asymmetric Form</div>
    <div class="env-body">
        <p>The functional equation is often written asymmetrically:</p>
        \\[
        \\zeta(s) = 2^s \\pi^{s-1} \\sin\\!\\left(\\frac{\\pi s}{2}\\right) \\Gamma(1-s)\\, \\zeta(1-s).
        \\]
        <p>This follows from the symmetric form via the duplication formula for \\(\\Gamma\\) and the reflection formula \\(\\Gamma(s)\\Gamma(1-s) = \\pi/\\sin(\\pi s)\\). The \\(\\sin(\\pi s/2)\\) factor vanishes at negative even integers, producing the trivial zeros \\(\\zeta(-2n) = 0\\).</p>
    </div>
</div>

<div class="env-block remark">
    <div class="env-title">Consequences for Zeros</div>
    <div class="env-body">
        <p>The trivial zeros at \\(s = -2, -4, -6, \\ldots\\) come from \\(\\sin(\\pi s/2) = 0\\). All other zeros (the nontrivial zeros) must lie in the critical strip \\(0 \\le \\sigma \\le 1\\). By the functional equation, if \\(\\rho\\) is a nontrivial zero, so is \\(1 - \\rho\\). The Riemann Hypothesis asserts they all have \\(\\operatorname{Re}(\\rho) = 1/2\\).</p>
    </div>
</div>
`,
            visualizations: [],
            exercises: [
                {
                    question: 'Verify that \\(1/(s-1) - 1/s\\) is invariant under \\(s \\mapsto 1-s\\).',
                    hint: 'Substitute \\(s \\to 1-s\\) and simplify.',
                    solution: 'Under \\(s \\mapsto 1-s\\): \\(\\frac{1}{(1-s)-1} - \\frac{1}{1-s} = \\frac{1}{-s} - \\frac{1}{1-s} = -\\frac{1}{s} + \\frac{1}{s-1} = \\frac{1}{s-1} - \\frac{1}{s}\\). This is the same expression. \\(\\square\\)'
                },
                {
                    question: 'Use the functional equation in asymmetric form to compute \\(\\zeta(0)\\) and \\(\\zeta(-1)\\).',
                    hint: 'For \\(\\zeta(0)\\), use \\(\\zeta(0) = 2^0 \\pi^{-1} \\sin(0) \\Gamma(1) \\zeta(1)\\)... but \\(\\sin(0) = 0\\) and \\(\\zeta(1) = \\infty\\). Use L\'Hopital or the integral representation instead. For \\(\\zeta(-1)\\), use \\(\\zeta(-1) = 2^{-1} \\pi^{-2} \\sin(-\\pi/2) \\Gamma(2) \\zeta(2)\\).',
                    solution: 'For \\(\\zeta(-1)\\): \\(\\zeta(-1) = 2^{-1} \\pi^{-2} \\cdot (-1) \\cdot 1! \\cdot \\pi^2/6 = -1/12\\). The famous result \\(\\zeta(-1) = -1/12\\) is the regularized "value" of \\(1 + 2 + 3 + \\cdots\\). For \\(\\zeta(0)\\), from the integral representation: \\(\\zeta(0) = -1/2\\).'
                }
            ]
        },

        // ================================================================
        // SECTION 5: The Hurwitz Zeta Function
        // ================================================================
        {
            id: 'sec-hurwitz',
            title: 'The Hurwitz Zeta Function',
            content: `
<h2>The Hurwitz Zeta Function</h2>

<div class="env-block intuition">
    <div class="env-title">Generalizing \\(\\zeta\\)</div>
    <div class="env-body">
        <p>The Riemann zeta function sums \\(n^{-s}\\) over all positive integers. What if we shift the lattice? Summing \\((n+a)^{-s}\\) for a fixed \\(0 < a \\le 1\\) gives the Hurwitz zeta function. At \\(a = 1\\) we recover \\(\\zeta(s)\\); at \\(a = 1/2\\) we get a close relative of the Dirichlet beta function. Most importantly, Dirichlet L-functions decompose as finite linear combinations of Hurwitz zeta values.</p>
    </div>
</div>

<div class="env-block definition">
    <div class="env-title">Definition 5.4 (Hurwitz Zeta Function)</div>
    <div class="env-body">
        <p>For \\(0 < a \\le 1\\) and \\(\\operatorname{Re}(s) > 1\\),</p>
        \\[
        \\zeta(s, a) = \\sum_{n=0}^{\\infty} \\frac{1}{(n + a)^s}.
        \\]
    </div>
</div>

<p>Basic properties:</p>
<ul>
    <li>\\(\\zeta(s, 1) = \\zeta(s)\\) (the Riemann zeta function).</li>
    <li>\\(\\zeta(s, 1/2) = (2^s - 1)\\zeta(s)\\) (related to the Dirichlet eta function).</li>
    <li>\\(\\zeta(s, a)\\) has a meromorphic continuation to all of \\(\\mathbb{C}\\), with a simple pole at \\(s = 1\\) of residue 1 (independent of \\(a\\)).</li>
</ul>

<h3>The Bridge to L-Functions</h3>

<p>The connection to Dirichlet L-functions is the main reason we care about \\(\\zeta(s,a)\\) in this course. Let \\(\\chi\\) be a Dirichlet character modulo \\(q\\). Then</p>

\\[
L(s, \\chi) = \\sum_{n=1}^{\\infty} \\frac{\\chi(n)}{n^s} = \\frac{1}{q^s} \\sum_{a=1}^{q} \\chi(a)\\, \\zeta\\!\\left(s, \\frac{a}{q}\\right).
\\]

<div class="env-block theorem">
    <div class="env-title">Theorem 5.5 (L-function as Hurwitz Combination)</div>
    <div class="env-body">
        <p>For any Dirichlet character \\(\\chi\\) mod \\(q\\) and \\(\\operatorname{Re}(s) > 1\\),</p>
        \\[
        L(s, \\chi) = q^{-s} \\sum_{a=1}^{q} \\chi(a)\\, \\zeta\\!\\left(s, \\frac{a}{q}\\right).
        \\]
    </div>
</div>

<p><strong>Proof.</strong> Write \\(n = qm + a\\) with \\(1 \\le a \\le q\\) and \\(m \\ge 0\\):</p>
\\[
L(s, \\chi) = \\sum_{a=1}^{q} \\chi(a) \\sum_{m=0}^{\\infty} \\frac{1}{(qm + a)^s} = \\sum_{a=1}^{q} \\chi(a) \\cdot q^{-s} \\sum_{m=0}^{\\infty} \\frac{1}{(m + a/q)^s} = q^{-s} \\sum_{a=1}^{q} \\chi(a)\\, \\zeta(s, a/q).
\\]
\\(\\square\\)

<p>This decomposition is the key to proving that \\(L(s, \\chi)\\) has an analytic continuation and a functional equation. The continuation of each \\(\\zeta(s, a/q)\\) gives the continuation of \\(L(s, \\chi)\\), and the functional equation for \\(L\\) follows from Gauss sums and the Hurwitz functional equation (which we state without proof here, deferring the details to Chapter 9).</p>

<div class="env-block definition">
    <div class="env-title">Definition 5.5 (Bernoulli Polynomials)</div>
    <div class="env-body">
        <p>The Bernoulli polynomials \\(B_n(x)\\) are defined by</p>
        \\[
        \\frac{t e^{xt}}{e^t - 1} = \\sum_{n=0}^{\\infty} B_n(x) \\frac{t^n}{n!}.
        \\]
        <p>They satisfy \\(\\zeta(-n, a) = -\\frac{B_{n+1}(a)}{n+1}\\) for \\(n \\ge 0\\), generalizing \\(\\zeta(-n) = -B_{n+1}/(n+1)\\).</p>
    </div>
</div>
`,
            visualizations: [],
            exercises: [
                {
                    question: 'Prove that \\(\\zeta(s, 1/2) = (2^s - 1)\\zeta(s)\\).',
                    hint: 'Write \\(\\zeta(s) = \\sum_{n \\text{ odd}} n^{-s} + \\sum_{n \\text{ even}} n^{-s}\\) and express the odd part using \\(\\zeta(s, 1/2)\\).',
                    solution: '\\(\\zeta(s, 1/2) = \\sum_{n=0}^{\\infty} (n+1/2)^{-s} = 2^s \\sum_{n=0}^{\\infty} (2n+1)^{-s}\\). Now \\(\\sum_{n=0}^{\\infty} (2n+1)^{-s} = \\zeta(s) - 2^{-s}\\zeta(s) = (1 - 2^{-s})\\zeta(s)\\). So \\(\\zeta(s,1/2) = 2^s(1 - 2^{-s})\\zeta(s) = (2^s - 1)\\zeta(s)\\).'
                },
                {
                    question: 'Verify the L-function decomposition for \\(\\chi_4\\), the nontrivial character mod 4 (\\(\\chi_4(1)=1, \\chi_4(3)=-1, \\chi_4(0)=\\chi_4(2)=0\\)).',
                    hint: 'Apply Theorem 5.5 with \\(q=4\\). Only \\(a=1\\) and \\(a=3\\) contribute.',
                    solution: '\\(L(s, \\chi_4) = 4^{-s}[\\chi_4(1)\\zeta(s, 1/4) + \\chi_4(3)\\zeta(s, 3/4)] = 4^{-s}[\\zeta(s, 1/4) - \\zeta(s, 3/4)]\\). Direct expansion: \\(L(s, \\chi_4) = 1 - 3^{-s} + 5^{-s} - 7^{-s} + \\cdots\\), which is the Leibniz series at \\(s=1\\) giving \\(\\pi/4\\).'
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
    <div class="env-title">From Zeta Back to Counting</div>
    <div class="env-body">
        <p>We have spent this chapter extending \\(\\zeta(s)\\) to the whole complex plane. Perron's formula reverses the flow: it recovers arithmetic information (summatory functions like \\(\\sum_{n \\le x} a_n\\)) from the analytic properties of the Dirichlet series \\(\\sum a_n n^{-s}\\). This is the key tool that will let us prove the Prime Number Theorem in Chapter 7.</p>
    </div>
</div>

<div class="env-block theorem">
    <div class="env-title">Theorem 5.6 (Perron's Formula)</div>
    <div class="env-body">
        <p>Let \\(F(s) = \\sum_{n=1}^{\\infty} a_n n^{-s}\\) converge absolutely for \\(\\operatorname{Re}(s) > \\sigma_a\\). For \\(x > 0\\) not an integer and \\(c > \\sigma_a\\),</p>
        \\[
        \\sum_{n \\le x} a_n = \\frac{1}{2\\pi i} \\int_{c - i\\infty}^{c + i\\infty} F(s) \\frac{x^s}{s}\\, ds.
        \\]
    </div>
</div>

<h3>The Mechanism</h3>

<p>Perron's formula rests on a single complex-analysis fact: for \\(c > 0\\),</p>
\\[
\\frac{1}{2\\pi i} \\int_{c - i\\infty}^{c + i\\infty} \\frac{y^s}{s}\\, ds = \\begin{cases} 1 & \\text{if } y > 1, \\\\ 1/2 & \\text{if } y = 1, \\\\ 0 & \\text{if } 0 < y < 1. \\end{cases}
\\]

<p>This is a "step-function detector." Taking \\(y = x/n\\), it picks out exactly those \\(n \\le x\\). Applying this to each term of \\(F(s) = \\sum a_n n^{-s}\\):</p>
\\[
\\frac{1}{2\\pi i} \\int_{c-i\\infty}^{c+i\\infty} F(s) \\frac{x^s}{s} ds = \\sum_{n=1}^{\\infty} a_n \\cdot \\frac{1}{2\\pi i} \\int_{c-i\\infty}^{c+i\\infty} \\frac{(x/n)^s}{s} ds = \\sum_{n < x} a_n + \\frac{a_{\\lfloor x \\rfloor}}{2} \\cdot \\mathbb{1}_{x \\in \\mathbb{Z}}.
\\]

<h3>Application: Counting Primes</h3>

<p>Taking \\(F(s) = -\\zeta'(s)/\\zeta(s)\\) (the logarithmic derivative), the coefficients are \\(a_n = \\Lambda(n)\\) (the von Mangoldt function). So:</p>
\\[
\\psi(x) = \\sum_{n \\le x} \\Lambda(n) = \\frac{1}{2\\pi i} \\int_{c-i\\infty}^{c+i\\infty} \\left(-\\frac{\\zeta'(s)}{\\zeta(s)}\\right) \\frac{x^s}{s}\\, ds.
\\]

<p>Moving the contour to the left picks up residues at the poles of \\(-\\zeta'/\\zeta\\), which occur at the zeros and poles of \\(\\zeta\\). This leads directly to the explicit formula (Chapter 8) and the PNT (Chapter 7).</p>

<div class="viz-placeholder" data-viz="viz-perron-contour"></div>
`,
            visualizations: [
                {
                    id: 'viz-perron-contour',
                    title: "Perron's Contour Integral",
                    description: 'The vertical contour at \\(\\operatorname{Re}(s) = c\\) is shown in the complex plane. Moving it left picks up residues at the zeros of \\(\\zeta(s)\\). Adjust \\(c\\) and \\(x\\) to see how the integral recovers the step function \\(\\sum_{n \\le x} 1\\).',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 400,
                            originX: 280, originY: 200, scale: 60
                        });

                        var cVal = 2.0;
                        var xVal = 5.0;

                        VizEngine.createSlider(controls, 'c (contour)', 1.1, 4.0, cVal, 0.1, function(v) {
                            cVal = v; draw();
                        });
                        VizEngine.createSlider(controls, 'x', 1.5, 10, xVal, 0.5, function(v) {
                            xVal = v; draw();
                        });

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            viz.screenText("Perron's Formula Contour", viz.width / 2, 18, viz.colors.white, 14);

                            viz.drawGrid(1);
                            viz.drawAxes();

                            // Label axes
                            viz.screenText('Re(s)', viz.width - 20, viz.originY + 16, viz.colors.text, 10);
                            viz.screenText('Im(s)', viz.originX + 20, 14, viz.colors.text, 10);

                            // Critical strip shading
                            var sx0 = viz.originX;
                            var sx1 = viz.originX + 1 * viz.scale;
                            ctx.fillStyle = viz.colors.purple + '15';
                            ctx.fillRect(sx0, 0, sx1 - sx0, viz.height);
                            viz.screenText('Critical strip', viz.originX + 0.5 * viz.scale, viz.height - 15, viz.colors.purple, 9);

                            // Critical line at sigma = 1/2
                            var sxHalf = viz.originX + 0.5 * viz.scale;
                            ctx.strokeStyle = viz.colors.yellow + '55';
                            ctx.lineWidth = 1;
                            ctx.setLineDash([4, 4]);
                            ctx.beginPath();
                            ctx.moveTo(sxHalf, 0);
                            ctx.lineTo(sxHalf, viz.height);
                            ctx.stroke();
                            ctx.setLineDash([]);
                            viz.screenText('\u03c3=1/2', sxHalf, viz.height - 28, viz.colors.yellow, 8);

                            // Pole at s=1
                            viz.drawPoint(1, 0, viz.colors.red, 's=1', 5);

                            // Some nontrivial zeros (approximate)
                            var zeros = [14.135, 21.022, 25.011, 30.425];
                            for (var z = 0; z < zeros.length; z++) {
                                var zy = zeros[z];
                                if (zy * viz.scale / 60 > 3) continue;
                                var zScaled = zy / 60 * viz.scale;
                                // Only show if they fit
                                viz.drawPoint(0.5, zy / 60, viz.colors.green, null, 3);
                                viz.drawPoint(0.5, -zy / 60, viz.colors.green, null, 3);
                            }

                            // Perron contour at Re(s) = c
                            var sxC = viz.originX + cVal * viz.scale;
                            ctx.strokeStyle = viz.colors.teal;
                            ctx.lineWidth = 3;
                            ctx.beginPath();
                            ctx.moveTo(sxC, 10);
                            ctx.lineTo(sxC, viz.height - 10);
                            ctx.stroke();

                            // Arrow on contour
                            ctx.fillStyle = viz.colors.teal;
                            ctx.beginPath();
                            ctx.moveTo(sxC, viz.originY - 40);
                            ctx.lineTo(sxC - 6, viz.originY - 30);
                            ctx.lineTo(sxC + 6, viz.originY - 30);
                            ctx.closePath();
                            ctx.fill();

                            viz.screenText('c = ' + cVal.toFixed(1), sxC + 8, 25, viz.colors.teal, 11, 'left');

                            // Show result
                            var floorX = Math.floor(xVal);
                            viz.screenText('\u230ax\u230b = ' + floorX + '  (x = ' + xVal.toFixed(1) + ')',
                                viz.width / 2, viz.height - 50, viz.colors.white, 13);
                            viz.screenText('(1/2\u03c0i) \u222b \u03b6(s) x^s/s ds = \u230ax\u230b',
                                viz.width / 2, viz.height - 30, viz.colors.orange, 11);
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Prove the "step function detector": for \\(c > 0\\) and \\(y > 0\\), \\(\\frac{1}{2\\pi i}\\int_{c-i\\infty}^{c+i\\infty} y^s/s\\, ds = 1\\) if \\(y > 1\\) and \\(0\\) if \\(y < 1\\).',
                    hint: 'For \\(y > 1\\), close the contour with a large semicircle to the left (picking up the residue at \\(s=0\\)). For \\(y < 1\\), close to the right where there are no poles.',
                    solution: 'For \\(y > 1\\): close the contour to the left with a semicircle of radius \\(R \\to \\infty\\). On the semicircle, \\(|y^s/s| = y^{\\sigma}/|s| \\to 0\\) since \\(\\sigma \\to -\\infty\\) and \\(0 < y < \\infty\\)... wait, we need \\(y > 1\\) so \\(y^\\sigma \\to 0\\) as \\(\\sigma \\to -\\infty\\). The only pole inside is at \\(s = 0\\) with residue \\(y^0 = 1\\). For \\(y < 1\\): close to the right; \\(y^\\sigma \\to 0\\) as \\(\\sigma \\to +\\infty\\) since \\(y < 1\\). No poles to the right of \\(c\\), so the integral is 0.'
                }
            ]
        },

        // ================================================================
        // SECTION 7: Bridge to Chapter 6
        // ================================================================
        {
            id: 'sec-bridge',
            title: 'Looking Ahead: Zero-Free Regions',
            content: `
<h2>Looking Ahead: Zero-Free Regions</h2>

<div class="env-block intuition">
    <div class="env-title">What We Have Built</div>
    <div class="env-body">
        <p>In this chapter we have:</p>
        <ol>
            <li>Extended \\(\\zeta(s)\\) to a meromorphic function on all of \\(\\mathbb{C}\\), with a single simple pole at \\(s=1\\).</li>
            <li>Proved the functional equation \\(\\xi(s) = \\xi(1-s)\\), establishing the symmetry of the critical strip around \\(\\sigma = 1/2\\).</li>
            <li>Located the trivial zeros at \\(s = -2, -4, -6, \\ldots\\) and shown that all nontrivial zeros lie in the critical strip \\(0 \\le \\sigma \\le 1\\).</li>
            <li>Introduced the Hurwitz zeta function and shown how L-functions decompose into Hurwitz values, bridging the path to Dirichlet's theorem (Chapter 9, 10).</li>
            <li>Set up Perron's formula, the contour-integral tool that will convert zero-free regions into prime-counting estimates.</li>
        </ol>
    </div>
</div>

<h3>The Logic of the PNT</h3>

<p>The Prime Number Theorem \\(\\pi(x) \\sim x/\\ln x\\) will follow from a chain of three links:</p>

<div class="env-block theorem">
    <div class="env-title">The PNT Chain</div>
    <div class="env-body">
        <p><strong>Link 1 (Chapter 6):</strong> \\(\\zeta(s) \\neq 0\\) on the line \\(\\sigma = 1\\).</p>
        <p><strong>Link 2 (This chapter):</strong> Perron's formula converts \\(\\psi(x)\\) into a contour integral involving \\(-\\zeta'/\\zeta\\).</p>
        <p><strong>Link 3 (Chapter 7):</strong> The zero-free region on \\(\\sigma = 1\\) forces \\(\\psi(x) \\sim x\\), which is equivalent to the PNT.</p>
    </div>
</div>

<p>Link 1, the zero-free region, is the heart of the matter. Why does \\(\\zeta(1 + it) \\neq 0\\) for \\(t \\neq 0\\)? The proof is surprisingly short and uses only elementary properties of \\(\\cos\\). It is one of the most elegant arguments in all of mathematics.</p>

<h3>What About the Critical Strip?</h3>

<p>The functional equation constrains zeros to lie in the critical strip \\(0 \\le \\sigma \\le 1\\), and the zero-free region on \\(\\sigma = 1\\) pushes them strictly inside. But how far inside? The classical de la Vallee Poussin zero-free region (Chapter 6) gives \\(\\sigma < 1 - c/\\log t\\) for some constant \\(c\\). Better zero-free regions give better error terms for the PNT.</p>

<p>The Riemann Hypothesis, that all nontrivial zeros have \\(\\sigma = 1/2\\), would give the best possible error term: \\(\\pi(x) = \\operatorname{Li}(x) + O(\\sqrt{x} \\log x)\\). This remains one of the great open problems of mathematics.</p>

<h3>Connection to L-functions</h3>

<p>Everything we have done for \\(\\zeta(s)\\) generalizes to Dirichlet L-functions \\(L(s, \\chi)\\). The Hurwitz decomposition (Theorem 5.5) gives the analytic continuation. The functional equation for \\(L(s, \\chi)\\) involves Gauss sums (Chapter 9). The zero-free region \\(L(1+it, \\chi) \\neq 0\\) gives Dirichlet's theorem on primes in arithmetic progressions (Chapter 10).</p>

<p>The story of the zeta function, from its definition as a simple sum to its role as the key to prime distribution, is one of the most remarkable narratives in mathematics. We have now laid all the analytic groundwork; the number-theoretic payoff begins in the next chapter.</p>
`,
            visualizations: [],
            exercises: [
                {
                    question: 'Show that if \\(\\zeta(\\rho) = 0\\) with \\(\\rho = \\beta + i\\gamma\\) in the critical strip, then \\(\\zeta(1-\\rho) = 0\\), \\(\\zeta(\\bar{\\rho}) = 0\\), and \\(\\zeta(1-\\bar{\\rho}) = 0\\).',
                    hint: 'Use the functional equation for \\(s \\mapsto 1-s\\) and the Schwarz reflection principle \\(\\zeta(\\bar{s}) = \\overline{\\zeta(s)}\\) for the complex conjugate.',
                    solution: 'Functional equation: \\(\\xi(\\rho) = 0 \\Rightarrow \\xi(1-\\rho) = 0 \\Rightarrow \\zeta(1-\\rho) = 0\\) (since the Gamma and power-of-pi factors have no zeros in the strip). Schwarz reflection: \\(\\zeta(s)\\) has real coefficients, so \\(\\overline{\\zeta(s)} = \\zeta(\\bar{s})\\), giving \\(\\zeta(\\bar{\\rho}) = \\overline{\\zeta(\\rho)} = 0\\). Combining: \\(\\zeta(1-\\bar{\\rho}) = 0\\). Thus zeros come in quartets \\(\\{\\rho, 1-\\rho, \\bar{\\rho}, 1-\\bar{\\rho}\\}\\), unless \\(\\rho\\) is on the critical line (where \\(\\rho = 1-\\bar{\\rho}\\), so the quartet collapses to a pair).'
                }
            ]
        }
    ]
});
