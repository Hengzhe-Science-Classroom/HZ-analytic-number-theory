window.CHAPTERS = window.CHAPTERS || [];
window.CHAPTERS.push({
    id: 'ch15',
    number: 15,
    title: 'The Circle Method',
    subtitle: 'Solving additive problems by Fourier analysis on the circle',
    sections: [

        // ================================================================
        // SECTION 1: Additive Problems
        // ================================================================
        {
            id: 'sec-motivation',
            title: 'Additive Problems',
            content: `
<h2>Additive Problems</h2>

<div class="env-block intuition">
    <div class="env-title">The Central Question</div>
    <div class="env-body">
        <p>Can every even integer greater than 2 be written as the sum of two primes? Can every sufficiently large integer be written as the sum of a fixed number of cubes? These are <em>additive problems</em>: questions about whether a given number can be represented as a sum of elements drawn from a prescribed set.</p>
        <p>The circle method, developed by Hardy, Ramanujan, and Littlewood in the 1910s–1920s, is the most powerful analytic engine for attacking such problems.</p>
    </div>
</div>

<p>An <strong>additive problem</strong> asks: given a set \\(\\mathcal{A} \\subset \\mathbb{Z}_{\\geq 0}\\), can every sufficiently large integer \\(n\\) be represented as</p>
\\[
n = a_1 + a_2 + \\cdots + a_s, \\quad a_i \\in \\mathcal{A}?
\\]

<p>The count of such representations is</p>
\\[
r_s(n) = \\#\\{(a_1, \\ldots, a_s) \\in \\mathcal{A}^s : a_1 + \\cdots + a_s = n\\}.
\\]

<p>The problem is solved if we can show \\(r_s(n) > 0\\) (existence), and better still if we can give an asymptotic formula for \\(r_s(n)\\) as \\(n \\to \\infty\\).</p>

<h3>Landmark Additive Problems</h3>

<div class="env-block example">
    <div class="env-title">Goldbach's Conjecture (1742)</div>
    <div class="env-body">
        <p><strong>Binary:</strong> Every even integer \\(n \\geq 4\\) is the sum of two primes. Open.</p>
        <p><strong>Ternary (Vinogradov 1937):</strong> Every odd integer \\(n \\geq N_0\\) is the sum of three primes. Proved. The bound \\(N_0\\) was made effective (\\(e^{3100}\\) by Vinogradov, later reduced to \\(e^{3100}\\) and finally to \\(10^{27}\\) by Helfgott 2013, who also verified all odd \\(n < 8.875 \\times 10^{30}\\)).</p>
    </div>
</div>

<div class="env-block example">
    <div class="env-title">Waring's Problem (1770)</div>
    <div class="env-body">
        <p>For each \\(k \\geq 2\\), is there a finite \\(s = g(k)\\) such that every positive integer is the sum of \\(g(k)\\) perfect \\(k\\)-th powers? Hilbert (1909) proved the answer is yes for all \\(k\\). The circle method gives the asymptotic formula and the correct order of \\(s\\) needed.</p>
    </div>
</div>

<h3>The Fourier-Analytic Idea</h3>

<p>The key observation is that \\(r_s(n)\\) is the \\(n\\)-th Fourier coefficient of a power of a generating function. Define the <em>exponential sum</em></p>
\\[
f(\\alpha) = \\sum_{a \\in \\mathcal{A}} e(a\\alpha), \\quad e(x) := e^{2\\pi i x}.
\\]

<p>Then \\(f(\\alpha)^s = \\sum_n r_s(n)\\, e(n\\alpha)\\), so by Fourier inversion on \\(\\mathbb{R}/\\mathbb{Z}\\):</p>
\\[
\\boxed{r_s(n) = \\int_0^1 f(\\alpha)^s\\, e(-n\\alpha)\\, d\\alpha.}
\\]

<p>This is the <strong>Hardy–Littlewood–Ramanujan circle method integral</strong>. Everything else is about estimating this integral.</p>

<div class="env-block remark">
    <div class="env-title">Why "Circle Method"?</div>
    <div class="env-body">
        <p>The unit interval \\([0,1)\\) with endpoints identified is the unit circle \\(\\mathbb{R}/\\mathbb{Z}\\). The integration is literally an integral around a circle in the complex plane: substituting \\(\\alpha = \\theta/(2\\pi)\\) gives an integral around \\(|z| = 1\\) with \\(z = e^{2\\pi i \\alpha}\\). The name comes from this complex-variable perspective.</p>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-arc-partition"></div>
`,
            visualizations: [
                {
                    id: 'viz-arc-partition',
                    title: 'Major and Minor Arcs on the Unit Circle',
                    description: 'The unit circle [0,1) is partitioned into major arcs (near low-denominator fractions a/q) and minor arcs (everything else). Drag the slider Q to see how the partition changes.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, { width: 520, height: 520, originX: 260, originY: 260, scale: 110 });
                        var Q = 4;
                        VizEngine.createSlider(controls, 'Q', 2, 12, Q, 1, function(v) { Q = Math.round(v); draw(); });

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var cx = viz.originX, cy = viz.originY, R = 2.0 * viz.scale;

                            // Background circle
                            ctx.strokeStyle = viz.colors.axis; ctx.lineWidth = 1.5;
                            ctx.beginPath(); ctx.arc(cx, cy, R, 0, 2 * Math.PI); ctx.stroke();

                            // Collect major arc centers: a/q with gcd(a,q)=1, q<=Q
                            function gcd(a, b) { return b === 0 ? a : gcd(b, a % b); }
                            var majorFracs = [];
                            for (var q = 1; q <= Q; q++) {
                                for (var a = 0; a < q; a++) {
                                    if (gcd(a, q) === 1 || (a === 0 && q === 1)) {
                                        majorFracs.push(a / q);
                                    }
                                }
                            }
                            // Remove duplicates
                            majorFracs = majorFracs.filter(function(v, i, arr) {
                                return arr.findIndex(function(w) { return Math.abs(w - v) < 1e-9; }) === i;
                            }).sort(function(a, b) { return a - b; });

                            var delta = 1 / (Q * Q);

                            // Draw minor arcs (background fill)
                            ctx.fillStyle = viz.colors.blue + '18';
                            ctx.beginPath(); ctx.arc(cx, cy, R, 0, 2 * Math.PI); ctx.fill();

                            // Draw major arcs (highlighted sectors)
                            majorFracs.forEach(function(frac) {
                                var theta = 2 * Math.PI * frac;
                                var dtheta = 2 * Math.PI * delta;
                                var t1 = theta - dtheta - Math.PI / 2;
                                var t2 = theta + dtheta - Math.PI / 2;
                                ctx.beginPath();
                                ctx.moveTo(cx, cy);
                                ctx.arc(cx, cy, R, t1, t2);
                                ctx.closePath();
                                ctx.fillStyle = viz.colors.orange + '55';
                                ctx.fill();
                                ctx.strokeStyle = viz.colors.orange; ctx.lineWidth = 1.5;
                                ctx.stroke();

                                // Tick mark
                                var tx = cx + R * Math.cos(theta - Math.PI / 2);
                                var ty = cy + R * Math.sin(theta - Math.PI / 2);
                                ctx.fillStyle = viz.colors.yellow;
                                ctx.beginPath(); ctx.arc(tx, ty, 4, 0, 2 * Math.PI); ctx.fill();
                            });

                            // Labels for a few major arc centers
                            ctx.font = '11px -apple-system,sans-serif';
                            ctx.fillStyle = viz.colors.white;
                            var labelFracs = [[0,1],[1,2],[1,3],[2,3],[1,4],[3,4]];
                            labelFracs.forEach(function(aq) {
                                var a = aq[0], q = aq[1];
                                if (q > Q) return;
                                var frac = a / q;
                                var theta = 2 * Math.PI * frac - Math.PI / 2;
                                var lr = R + 22;
                                var lx = cx + lr * Math.cos(theta);
                                var ly = cy + lr * Math.sin(theta);
                                ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                                ctx.fillText(a + '/' + q, lx, ly);
                            });

                            // Legend
                            ctx.font = '12px -apple-system,sans-serif';
                            ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
                            ctx.fillStyle = viz.colors.orange;
                            ctx.fillRect(18, viz.height - 50, 14, 14);
                            ctx.fillStyle = viz.colors.white;
                            ctx.fillText('Major arcs  \u03b4 = 1/Q\u00b2 = 1/' + (Q * Q), 38, viz.height - 43);
                            ctx.fillStyle = viz.colors.blue + 'aa';
                            ctx.fillRect(18, viz.height - 30, 14, 14);
                            ctx.fillStyle = viz.colors.white;
                            ctx.fillText('Minor arcs', 38, viz.height - 23);

                            // Title
                            viz.screenText('Arc Partition  (Q = ' + Q + ',  fractions with q \u2264 Q)', cx, 22, viz.colors.white, 14);
                            viz.screenText('# major arc centers: ' + majorFracs.length + '   arc width: \u00b11/' + (Q * Q), cx, 42, viz.colors.text, 11);
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Define \\(f(\\alpha) = \\sum_{n=0}^{N} e(n\\alpha)\\). Show that \\(\\int_0^1 |f(\\alpha)|^2\\, d\\alpha = N + 1\\). What does this say about the "energy" of the exponential sum?',
                    hint: 'Expand \\(|f(\\alpha)|^2 = f(\\alpha)\\overline{f(\\alpha)}\\) and use Parseval/orthogonality of \\(e(n\\alpha)\\).',
                    solution: 'We have \\(|f(\\alpha)|^2 = \\sum_{m,n=0}^N e((m-n)\\alpha)\\). Integrating, \\(\\int_0^1 e(k\\alpha)\\,d\\alpha = \\mathbf{1}[k=0]\\). Only terms \\(m=n\\) survive, giving \\(N+1\\) terms each contributing 1. The total energy equals the number of elements in the set, which is Parseval\'s theorem.'
                },
                {
                    question: 'Let \\(r_2(n)\\) be the number of ways to write \\(n = a + b\\) with \\(a, b \\in \\{0,1,\\ldots,N\\}\\). Express \\(r_2(n)\\) as a Fourier integral and compute it directly for \\(n \\leq N\\).',
                    hint: 'Use \\(r_2(n) = \\int_0^1 f(\\alpha)^2 e(-n\\alpha)\\,d\\alpha\\) and expand.',
                    solution: 'For \\(0 \\leq n \\leq N\\), we need \\(a + b = n\\) with \\(0 \\leq a, b \\leq N\\). The solutions are \\(a \\in \\{\\max(0,n-N), \\ldots, \\min(n,N)\\}\\). For \\(n \\leq N\\) this gives \\(n+1\\) solutions. The Fourier method gives the same answer: \\(r_2(n) = n+1\\) for \\(0 \\leq n \\leq N\\).'
                }
            ]
        },

        // ================================================================
        // SECTION 2: Setting Up the Integral
        // ================================================================
        {
            id: 'sec-setup',
            title: 'Setting Up the Integral',
            content: `
<h2>Setting Up the Integral</h2>

<p>We make the circle method precise. Fix the target integer \\(n\\) and a set \\(\\mathcal{A}\\). The generating exponential sum is</p>
\\[
f(\\alpha) = \\sum_{a \\in \\mathcal{A},\\, a \\leq n} e(a\\alpha).
\\]

<p>Then the representation count is the Fourier coefficient</p>
\\[
r_s(n) = \\int_0^1 f(\\alpha)^s\\, e(-n\\alpha)\\, d\\alpha.
\\]

<h3>The Weyl Sum</h3>

<p>For Waring's problem with \\(\\mathcal{A} = \\{1^k, 2^k, 3^k, \\ldots\\}\\), the generating function is a <strong>Weyl sum</strong>:</p>
\\[
f(\\alpha) = \\sum_{m=1}^{P} e(m^k \\alpha), \\quad P \\approx n^{1/k}.
\\]

<p>For Goldbach/Vinogradov with \\(\\mathcal{A} = \\{\\text{primes}\\}\\):</p>
\\[
f(\\alpha) = \\sum_{p \\leq n} (\\log p)\\, e(p\\alpha)
\\]
<p>(the logarithmic weight is natural from the prime number theorem).</p>

<h3>Behavior at Rational Points</h3>

<div class="env-block theorem">
    <div class="env-title">Heuristic: Peaks at Rationals</div>
    <div class="env-body">
        <p>At a rational \\(\\alpha = a/q\\) with \\(\\gcd(a,q)=1\\), the exponential \\(e(m^k \\cdot a/q)\\) is periodic with period \\(q\\). The Weyl sum decomposes into a "Ramanujan sum" times a large main term:</p>
        \\[
        f(a/q) \\approx \\frac{1}{q} S(a,q)\\cdot P, \\quad S(a,q) = \\sum_{r=1}^q e(r^k a / q).
        \\]
        <p>For small \\(q\\), \\(S(a,q)\\) can be large (\\(|S(a,q)| \\leq q\\)), so \\(f(a/q) \\approx P\\). Far from all rationals with small denominator, \\(f(\\alpha)\\) is much smaller.</p>
    </div>
</div>

<h3>Strategy: Divide and Conquer</h3>

<p>Split \\([0,1)\\) into:</p>
<ul>
    <li><strong>Major arcs</strong> \\(\\mathfrak{M}\\): small neighborhoods of fractions \\(a/q\\) with \\(q \\leq Q\\) (here \\(f(\\alpha)\\) is large and computable).</li>
    <li><strong>Minor arcs</strong> \\(\\mathfrak{m} = [0,1) \\setminus \\mathfrak{M}\\): the rest (\\(f(\\alpha)\\) is small by Weyl/Vinogradov estimates).</li>
</ul>

\\[
r_s(n) = \\underbrace{\\int_{\\mathfrak{M}} f^s e(-n\\cdot)}_{{\\rm main\\; term}} + \\underbrace{\\int_{\\mathfrak{m}} f^s e(-n\\cdot)}_{{\\rm error}}.
\\]

<p>Success requires: (a) computing the major arc integral explicitly, and (b) showing the minor arc contribution is smaller.</p>

<div class="env-block definition">
    <div class="env-title">Definition (Major Arcs)</div>
    <div class="env-body">
        <p>For parameters \\(P\\) (the size of the set) and \\(Q = P^\\theta\\) (a power of \\(P\\) to be chosen), the major arc centered at \\(a/q\\) is</p>
        \\[
        \\mathfrak{M}(a,q) = \\left\\{\\alpha \\in [0,1) : \\left|\\alpha - \\frac{a}{q}\\right| \\leq \\frac{Q}{P^k}\\right\\}.
        \\]
        <p>The major arcs are disjoint for \\(Q < P^{k/2}\\).</p>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-major-arc-peak"></div>
`,
            visualizations: [
                {
                    id: 'viz-major-arc-peak',
                    title: 'Major Arc Peak: |f(α)| Near a Rational',
                    description: 'The Weyl sum |f(α)| peaks sharply near low-denominator rationals. The blue curve shows the Gaussian-like approximation on the major arc. Adjust the denominator q and parameter P.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, { width: 580, height: 360, originX: 80, originY: 300, scale: 1 });
                        var P = 40, q = 1;
                        VizEngine.createSlider(controls, 'P', 10, 80, P, 5, function(v) { P = Math.round(v); draw(); });
                        VizEngine.createSlider(controls, 'q', 1, 6, q, 1, function(v) { q = Math.round(v); draw(); });

                        function weylSum(alpha, Pval, kpow) {
                            var re = 0, im = 0;
                            for (var m = 1; m <= Pval; m++) {
                                var phase = 2 * Math.PI * Math.pow(m, kpow) * alpha;
                                re += Math.cos(phase);
                                im += Math.sin(phase);
                            }
                            return Math.sqrt(re * re + im * im);
                        }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var W = viz.width - 100, H = 240;
                            var leftX = 80, bottomY = 290;
                            var alphaCenter = 1 / q;
                            var alphaMin = alphaCenter - 0.15, alphaMax = alphaCenter + 0.15;
                            var steps = 200;
                            var maxVal = P;

                            // Axes
                            ctx.strokeStyle = viz.colors.axis; ctx.lineWidth = 1.5;
                            ctx.beginPath(); ctx.moveTo(leftX, bottomY); ctx.lineTo(leftX + W, bottomY); ctx.stroke();
                            ctx.beginPath(); ctx.moveTo(leftX, bottomY); ctx.lineTo(leftX, bottomY - H); ctx.stroke();

                            // Y axis labels
                            ctx.fillStyle = viz.colors.text; ctx.font = '11px -apple-system,sans-serif';
                            ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
                            [0.25, 0.5, 0.75, 1.0].forEach(function(frac) {
                                var yy = bottomY - frac * H;
                                ctx.fillText(Math.round(frac * maxVal), leftX - 6, yy);
                                ctx.strokeStyle = viz.colors.grid; ctx.lineWidth = 0.5;
                                ctx.beginPath(); ctx.moveTo(leftX, yy); ctx.lineTo(leftX + W, yy); ctx.stroke();
                            });

                            // X axis labels
                            ctx.textAlign = 'center'; ctx.textBaseline = 'top';
                            ctx.fillStyle = viz.colors.text;
                            [-0.1, 0, 0.1].forEach(function(offset) {
                                var alpha = alphaCenter + offset;
                                var sx = leftX + (alpha - alphaMin) / (alphaMax - alphaMin) * W;
                                var label = offset === 0 ? (q === 1 ? '0' : '1/' + q) : (offset > 0 ? '+0.1' : '-0.1');
                                ctx.fillText(label, sx, bottomY + 4);
                            });

                            // Major arc width shading
                            var delta = Q_width(P, q);
                            var sx1 = leftX + (alphaCenter - delta - alphaMin) / (alphaMax - alphaMin) * W;
                            var sx2 = leftX + (alphaCenter + delta - alphaMin) / (alphaMax - alphaMin) * W;
                            ctx.fillStyle = viz.colors.orange + '22';
                            ctx.fillRect(Math.max(leftX, sx1), bottomY - H, Math.min(sx2, leftX + W) - Math.max(leftX, sx1), H);

                            // Actual Weyl sum |f(alpha)|
                            ctx.strokeStyle = viz.colors.blue; ctx.lineWidth = 2;
                            ctx.beginPath();
                            var started = false;
                            for (var i = 0; i <= steps; i++) {
                                var alpha = alphaMin + (alphaMax - alphaMin) * i / steps;
                                var val = weylSum(alpha, P, 2);
                                var sx = leftX + (alpha - alphaMin) / (alphaMax - alphaMin) * W;
                                var sy = bottomY - (val / maxVal) * H;
                                if (!started) { ctx.moveTo(sx, sy); started = true; } else { ctx.lineTo(sx, sy); }
                            }
                            ctx.stroke();

                            // Gaussian approximation on major arc
                            ctx.strokeStyle = viz.colors.orange; ctx.lineWidth = 1.5; ctx.setLineDash([5, 4]);
                            ctx.beginPath(); started = false;
                            for (var j = 0; j <= steps; j++) {
                                var beta = alphaMin + (alphaMax - alphaMin) * j / steps;
                                var betaDiff = beta - alphaCenter;
                                var gaussVal = P * Math.exp(-Math.PI * P * P * betaDiff * betaDiff * 0.4);
                                var sx3 = leftX + (beta - alphaMin) / (alphaMax - alphaMin) * W;
                                var sy3 = bottomY - Math.min(gaussVal / maxVal, 1.05) * H;
                                if (!started) { ctx.moveTo(sx3, sy3); started = true; } else { ctx.lineTo(sx3, sy3); }
                            }
                            ctx.stroke(); ctx.setLineDash([]);

                            // Legend
                            ctx.font = '11px -apple-system,sans-serif'; ctx.textAlign = 'left';
                            ctx.strokeStyle = viz.colors.blue; ctx.lineWidth = 2;
                            ctx.beginPath(); ctx.moveTo(leftX + 10, 20); ctx.lineTo(leftX + 35, 20); ctx.stroke();
                            ctx.fillStyle = viz.colors.white; ctx.fillText('|f(\u03b1)| (Weyl sum)', leftX + 40, 15);
                            ctx.strokeStyle = viz.colors.orange; ctx.lineWidth = 1.5; ctx.setLineDash([5, 4]);
                            ctx.beginPath(); ctx.moveTo(leftX + 10, 38); ctx.lineTo(leftX + 35, 38); ctx.stroke();
                            ctx.setLineDash([]);
                            ctx.fillStyle = viz.colors.orange; ctx.fillText('Gaussian approx', leftX + 40, 33);

                            // Title
                            viz.screenText('|f(\u03b1)| near \u03b1\u2080 = ' + (q === 1 ? '0' : '1/' + q) + '  (P = ' + P + ', k = 2)', viz.width / 2, 12, viz.colors.white, 13);
                        }

                        function Q_width(Pval, qval) { return 1 / (qval * qval * Math.log(Pval + 2)); }

                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Show that the major arcs \\(\\mathfrak{M}(a,q)\\) for \\(0 \\leq a < q \\leq Q\\) with \\(\\gcd(a,q)=1\\) are pairwise disjoint when \\(2Q^2 \\leq P^k\\).',
                    hint: 'Suppose two arcs overlap at \\(\\alpha\\). Then \\(|a/q - a\'/q\'| \\leq 2Q/P^k\\). Use the fact that \\(|a/q - a\'/q\'| \\geq 1/(qq\')\\) when \\(a/q \\neq a\'/q\'\\).',
                    solution: 'If \\(a/q \\neq a\'/q\'\\), then \\(|a/q - a\'/q\'| = |aq\' - a\'q|/(qq\') \\geq 1/(qq\') \\geq 1/Q^2\\). Two arcs overlap only if \\(2Q/P^k \\geq 1/Q^2\\), i.e., \\(2Q^3 \\geq P^k\\). Contrapositive: if \\(2Q^3 \\leq P^k\\) the arcs are disjoint. (The bound \\(2Q^2 \\leq P^k\\) gives a slightly cleaner statement for the standard setup where the width is \\(Q/P^k\\) on each side.)'
                }
            ]
        },

        // ================================================================
        // SECTION 3: Major and Minor Arcs
        // ================================================================
        {
            id: 'sec-major-minor',
            title: 'Major and Minor Arcs',
            content: `
<h2>Major and Minor Arcs</h2>

<p>The circle method stands or falls on two estimates: an asymptotic formula on the major arcs, and a saving on the minor arcs.</p>

<h3>Major Arc Analysis</h3>

<p>On a major arc \\(\\mathfrak{M}(a,q)\\), write \\(\\alpha = a/q + \\beta\\) with \\(|\\beta| \\leq Q/P^k\\). The Weyl sum factors as</p>
\\[
f\\!\\left(\\frac{a}{q} + \\beta\\right) \\approx \\frac{S(a,q)}{q} \\cdot I(\\beta),
\\]
<p>where \\(S(a,q) = \\sum_{r=1}^q e(r^k a/q)\\) is the <strong>complete exponential sum</strong> and</p>
\\[
I(\\beta) = \\int_0^P e(t^k \\beta)\\, dt
\\]
<p>is a smooth "arclength" integral. When \\(s\\) is large enough, integrating over the major arcs and summing over \\(a/q\\) yields</p>
\\[
\\int_{\\mathfrak{M}} f^s e(-n\\alpha)\\, d\\alpha \\sim \\mathfrak{S}(n) \\cdot J(n),
\\]
<p>where \\(\\mathfrak{S}(n)\\) is the <strong>singular series</strong> and \\(J(n)\\) is the <strong>singular integral</strong>.</p>

<h3>The Singular Series and Integral</h3>

<div class="env-block definition">
    <div class="env-title">Definition (Singular Series and Integral)</div>
    <div class="env-body">
        <p>The <strong>singular series</strong> is</p>
        \\[
        \\mathfrak{S}(n) = \\sum_{q=1}^\\infty \\sum_{\\substack{a=1 \\\\ \\gcd(a,q)=1}}^q \\left(\\frac{S(a,q)}{q}\\right)^s e\\!\\left(-\\frac{na}{q}\\right).
        \\]
        <p>The <strong>singular integral</strong> is</p>
        \\[
        J(n) = \\int_{-\\infty}^\\infty I(\\beta)^s\\, e(-n\\beta)\\, d\\beta.
        \\]
        <p>Both converge absolutely when \\(s\\) is large relative to \\(k\\).</p>
    </div>
</div>

<p>The singular series has an Euler product interpretation: it equals</p>
\\[
\\mathfrak{S}(n) = \\prod_p \\sigma_p(n),
\\]
<p>where \\(\\sigma_p(n)\\) is the density of \\(p\\)-adic solutions to \\(x_1^k + \\cdots + x_s^k = n\\). Positivity of \\(\\mathfrak{S}(n)\\) is a necessary condition for solutions to exist.</p>

<h3>Minor Arc Bound via Weyl's Inequality</h3>

<div class="env-block theorem">
    <div class="env-title">Theorem (Weyl's Inequality)</div>
    <div class="env-body">
        <p>Let \\(\\alpha \\in \\mathfrak{m}\\) (minor arcs). Then for \\(k \\geq 2\\),</p>
        \\[
        f(\\alpha) = \\sum_{m=1}^P e(m^k \\alpha) \\ll P^{1 - \\sigma_k + \\varepsilon}
        \\]
        <p>where \\(\\sigma_k = 2^{1-k}\\). More precisely, if \\(|\\alpha - a/q| \\leq 1/q^2\\) and \\(q > Q\\), then \\(|f(\\alpha)| \\ll P^{1+\\varepsilon}(1/P + 1/q + q/P^k)^{2^{1-k}}\\).</p>
    </div>
</div>

<p>Weyl's inequality is proved by repeated <em>Weyl differencing</em>: writing \\(|f(\\alpha)|^{2^j}\\) as a sum involving differences \\(f(h\\alpha)\\) for \\(h = 1, \\ldots, 2^{j-1}\\), and applying Cauchy–Schwarz \\(j\\) times.</p>

<div class="env-block example">
    <div class="env-title">Vinogradov's Mean Value Theorem</div>
    <div class="env-body">
        <p>A far stronger minor arc bound comes from Vinogradov's mean value theorem (proved in optimal form by Bourgain–Demeter–Guth 2016 via decoupling):</p>
        \\[
        \\int_0^1 |f(\\alpha)|^{2s}\\, d\\alpha \\ll P^{s + \\varepsilon} + P^{2s - k(k+1)/2 + \\varepsilon}.
        \\]
        <p>This is sharp (within \\(\\varepsilon\\)) and enables Waring's problem with \\(s \\geq k(k+1)/2 + 1\\) variables.</p>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-minor-arc-cancel"></div>
`,
            visualizations: [
                {
                    id: 'viz-minor-arc-cancel',
                    title: 'Minor Arc Cancellation: A Random Walk',
                    description: 'On minor arcs, the terms e(m^k α) oscillate without coherent phase, producing a random-walk-like cancellation. Each step adds a unit complex number. Watch the walk shrink relative to P as the arc becomes "more minor".',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, { width: 520, height: 480, originX: 260, originY: 260, scale: 1 });
                        var P = 60, alphaFrac = 0.37;
                        VizEngine.createSlider(controls, 'P (terms)', 10, 100, P, 5, function(v) { P = Math.round(v); draw(); });
                        VizEngine.createSlider(controls, '\u03b1', 0.01, 0.99, alphaFrac, 0.01, function(v) { alphaFrac = v; draw(); });

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var cx = viz.width / 2, cy = viz.height / 2;
                            var R = Math.min(cx, cy) - 30;

                            // Draw unit circle guide
                            var stepR = R / Math.sqrt(P);  // expected RW radius
                            ctx.strokeStyle = viz.colors.grid; ctx.lineWidth = 0.8;
                            ctx.beginPath(); ctx.arc(cx, cy, stepR, 0, 2 * Math.PI); ctx.stroke();
                            ctx.strokeStyle = viz.colors.axis + '44'; ctx.lineWidth = 0.5;
                            ctx.beginPath(); ctx.arc(cx, cy, R, 0, 2 * Math.PI); ctx.stroke();

                            // Draw the walk
                            var re = 0, im = 0;
                            var scale = R / P;  // scale so P steps of unit length fill the box
                            ctx.strokeStyle = viz.colors.blue; ctx.lineWidth = 1.2;
                            ctx.globalAlpha = 0.7;
                            ctx.beginPath(); ctx.moveTo(cx, cy);
                            for (var m = 1; m <= P; m++) {
                                var phase = 2 * Math.PI * Math.pow(m, 2) * alphaFrac;
                                re += Math.cos(phase);
                                im += Math.sin(phase);
                                ctx.lineTo(cx + re * scale, cy - im * scale);
                            }
                            ctx.stroke();
                            ctx.globalAlpha = 1.0;

                            // Start and end points
                            ctx.fillStyle = viz.colors.green;
                            ctx.beginPath(); ctx.arc(cx, cy, 5, 0, 2 * Math.PI); ctx.fill();
                            ctx.fillStyle = viz.colors.orange;
                            ctx.beginPath(); ctx.arc(cx + re * scale, cy - im * scale, 6, 0, 2 * Math.PI); ctx.fill();

                            // Arrow from origin to endpoint
                            var endX = cx + re * scale, endY = cy - im * scale;
                            var len = Math.sqrt(re * re + im * im);
                            ctx.strokeStyle = viz.colors.yellow; ctx.lineWidth = 2;
                            ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(endX, endY); ctx.stroke();

                            // Stats
                            var absVal = Math.sqrt(re * re + im * im);
                            viz.screenText('\u03b1 = ' + alphaFrac.toFixed(3) + '   P = ' + P, viz.width / 2, 16, viz.colors.white, 13);
                            viz.screenText('|f(\u03b1)| = ' + absVal.toFixed(2) + '   (expected \u221aP \u2248 ' + Math.sqrt(P).toFixed(1) + ')', viz.width / 2, 34, viz.colors.text, 11);
                            viz.screenText('|f(\u03b1)|/P = ' + (absVal / P).toFixed(3) + '  (cancellation = ' + (100 * (1 - absVal / P)).toFixed(0) + '%)', viz.width / 2, viz.height - 20, viz.colors.teal, 11);

                            // Legend
                            ctx.fillStyle = viz.colors.green;
                            ctx.beginPath(); ctx.arc(18, viz.height - 55, 5, 0, 2 * Math.PI); ctx.fill();
                            ctx.fillStyle = viz.colors.text; ctx.font = '11px -apple-system,sans-serif'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
                            ctx.fillText('Start (0)', 28, viz.height - 55);
                            ctx.fillStyle = viz.colors.orange;
                            ctx.beginPath(); ctx.arc(18, viz.height - 38, 5, 0, 2 * Math.PI); ctx.fill();
                            ctx.fillStyle = viz.colors.text;
                            ctx.fillText('End = f(\u03b1)', 28, viz.height - 38);
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Explain why the bound \\(|f(\\alpha)| \\ll P\\) is trivial (just use the triangle inequality). Why does the circle method need \\(|f(\\alpha)| \\ll P^{1-\\delta}\\) for minor arcs?',
                    hint: 'Count powers: \\(|\\int_{\\mathfrak{m}} f^s e(-n\\cdot)| \\leq \\int_{\\mathfrak{m}} |f|^s \\leq |\\mathfrak{m}| \\cdot \\max_{\\mathfrak{m}} |f|^s\\).',
                    solution: 'Trivially \\(|f(\\alpha)| \\leq P\\) (sum of \\(P\\) unit vectors). So \\(|\\int_{\\mathfrak{m}} f^s| \\leq \\max|f|^s \\leq P^s\\). The main term on major arcs is \\(\\sim c \\cdot P^{s-k}\\) (from integration), so we need the minor arc contribution to be \\(o(P^{s-k})\\). With \\(|f| \\ll P^{1-\\delta}\\) on minor arcs, Holder gives \\(\\int_{\\mathfrak{m}} |f|^s \\ll P^{s(1-\\delta)} = o(P^s)\\), and comparing exponents shows we need \\(s\\delta > k\\).'
                },
                {
                    question: 'What is the "Weyl differencing" trick? State how \\(|f(\\alpha)|^2\\) can be bounded in terms of a sum involving \\(f(2m\\alpha - \\alpha)\\)-type expressions.',
                    hint: 'Expand \\(|f(\\alpha)|^2 = f(\\alpha)\\overline{f(\\alpha)}\\) and use \\(\\overline{e(x)} = e(-x)\\).',
                    solution: '\\(|f(\\alpha)|^2 = \\sum_{m,m\'=1}^P e((m^k - m\'^k)\\alpha) = \\sum_{h} e(h\\alpha) \\cdot (\\#{m : m^k - m\'^k = h})\\). Writing \\(m = m\' + h\\) gives \\(|f|^2 = \\sum_{h=-P}^{P} \\sum_{m=1}^P e((m^k - (m-h)^k)\\alpha)\\). The inner sum is another exponential sum but in a polynomial of degree \\(k-1\\). Repeating reduces the degree by 1 each time, producing after \\(k-1\\) steps a sum that is easy to bound by Weyl\'s inequality.'
                }
            ]
        },

        // ================================================================
        // SECTION 4: Waring's Problem
        // ================================================================
        {
            id: 'sec-waring',
            title: "Waring's Problem",
            content: `
<h2>Waring's Problem</h2>

<p>In 1770 Edward Waring asserted without proof: every integer is the sum of at most 9 perfect cubes, 19 fourth powers, and so on. This was proved by Hilbert (1909) via a purely algebraic identity, but the circle method gives quantitative asymptotic formulas.</p>

<h3>The Two Constants g(k) and G(k)</h3>

<div class="env-block definition">
    <div class="env-title">Definition</div>
    <div class="env-body">
        <ul>
            <li>\\(g(k)\\) = minimum \\(s\\) such that <em>every</em> positive integer is a sum of \\(s\\) perfect \\(k\\)-th powers.</li>
            <li>\\(G(k)\\) = minimum \\(s\\) such that every <em>sufficiently large</em> positive integer is a sum of \\(s\\) perfect \\(k\\)-th powers.</li>
        </ul>
        <p>Clearly \\(G(k) \\leq g(k)\\). The values \\(g(k)\\) are sensitive to small exceptions (e.g., \\(g(3) = 9\\) because 23 requires 9 cubes), while \\(G(k)\\) reflects the true asymptotic difficulty.</p>
    </div>
</div>

<table style="width:100%;border-collapse:collapse;margin:1em 0;">
<thead>
<tr><th style="padding:6px;border-bottom:1px solid #30363d;">k</th><th>g(k)</th><th>G(k) known</th><th>G(k) conjectured</th></tr>
</thead>
<tbody>
<tr><td style="padding:4px 6px;">2</td><td>4</td><td>4 (Lagrange)</td><td>4</td></tr>
<tr><td style="padding:4px 6px;">3</td><td>9</td><td>&#x2264; 7 (Vinogradov)</td><td>4</td></tr>
<tr><td style="padding:4px 6px;">4</td><td>19</td><td>&#x2264; 15 (Davenport)</td><td>15</td></tr>
<tr><td style="padding:4px 6px;">5</td><td>37</td><td>&#x2264; 23 (BDG)</td><td>17</td></tr>
<tr><td style="padding:4px 6px;">k (large)</td><td>\\(2^k + \\lfloor(3/2)^k\\rfloor - 2\\)</td><td>\\(\\leq k(k+1) + 1\\)</td><td>\\(k+1\\) or \\(k+2\\)</td></tr>
</tbody>
</table>

<h3>Asymptotic Formula</h3>

<div class="env-block theorem">
    <div class="env-title">Theorem (Hardy–Littlewood, Vinogradov)</div>
    <div class="env-body">
        <p>For \\(s \\geq s_0(k)\\) (effectively \\(s \\geq k(k+1)/2 + 1\\) by Bourgain–Demeter–Guth), as \\(n \\to \\infty\\):</p>
        \\[
        r_s(n) = \\frac{\\Gamma(1 + 1/k)^s}{\\Gamma(s/k)}\\, \\mathfrak{S}(n)\\, n^{s/k - 1} (1 + o(1)),
        \\]
        <p>where \\(\\mathfrak{S}(n) > 0\\) is the singular series (a product of local densities over all primes).</p>
    </div>
</div>

<p>The prefactor \\(\\Gamma(1+1/k)^s/\\Gamma(s/k)\\) comes from the singular integral \\(J(n)\\). It reflects the "real density" of solutions. The singular series \\(\\mathfrak{S}(n)\\) reflects \\(p\\)-adic density for each prime \\(p\\).</p>

<div class="viz-placeholder" data-viz="viz-waring-decompose"></div>
`,
            visualizations: [
                {
                    id: 'viz-waring-decompose',
                    title: "Waring Decomposition: Writing n as a Sum of k-th Powers",
                    description: 'Enter a target n and choose k. The visualization shows a greedy decomposition of n into perfect k-th powers, and counts representations r_s(n) for small s.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, { width: 560, height: 380, originX: 40, originY: 340, scale: 1 });
                        var nVal = 100, kVal = 2;
                        VizEngine.createSlider(controls, 'n', 1, 200, nVal, 1, function(v) { nVal = Math.round(v); draw(); });
                        VizEngine.createSlider(controls, 'k', 2, 4, kVal, 1, function(v) { kVal = Math.round(v); draw(); });

                        function kthPowers(k, limit) {
                            var pows = [], m = 1;
                            while (Math.pow(m, k) <= limit) { pows.push(Math.pow(m, k)); m++; }
                            return pows;
                        }

                        function countReps(n, k, s) {
                            // Count r_s(n) = # ways n = a1^k + ... + as^k, order matters
                            var pows = kthPowers(k, n);
                            var count = 0;
                            function rec(rem, terms) {
                                if (terms === 0) { if (rem === 0) count++; return; }
                                for (var i = 0; i < pows.length && pows[i] <= rem; i++) rec(rem - pows[i], terms - 1);
                            }
                            rec(n, s);
                            return count;
                        }

                        function greedyDecomp(n, k) {
                            var parts = [], rem = n;
                            while (rem > 0) {
                                var m = Math.floor(Math.pow(rem, 1 / k));
                                while (Math.pow(m + 1, k) <= rem) m++;
                                parts.push(m);
                                rem -= Math.pow(m, k);
                            }
                            return parts;
                        }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var pows = kthPowers(kVal, nVal);
                            var parts = greedyDecomp(nVal, kVal);
                            var W = viz.width - 60, H = 200;
                            var leftX = 50, bottomY = 290;
                            var barW = Math.max(2, Math.floor(W / nVal) - 1);

                            // Draw bar chart: squares up to nVal
                            var maxPow = pows[pows.length - 1];
                            pows.forEach(function(p, idx) {
                                var sx = leftX + Math.round((p / nVal) * W);
                                var sy = bottomY - (p / maxPow) * H;
                                ctx.fillStyle = viz.colors.blue + '66';
                                ctx.fillRect(sx - 2, sy, 4, bottomY - sy);
                                ctx.fillStyle = viz.colors.blue;
                                ctx.beginPath(); ctx.arc(sx, sy, 3, 0, 2 * Math.PI); ctx.fill();
                                if (idx < 8) {
                                    ctx.fillStyle = viz.colors.text; ctx.font = '9px -apple-system,sans-serif';
                                    ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
                                    ctx.fillText(Math.round(Math.pow(p, 1 / kVal)) + '\u1d4f', sx, sy - 2);
                                }
                            });

                            // Mark target n
                            var nSx = leftX + W;
                            ctx.strokeStyle = viz.colors.yellow; ctx.lineWidth = 2; ctx.setLineDash([4, 3]);
                            ctx.beginPath(); ctx.moveTo(nSx, bottomY); ctx.lineTo(nSx, bottomY - H); ctx.stroke();
                            ctx.setLineDash([]);
                            ctx.fillStyle = viz.colors.yellow; ctx.font = '12px -apple-system,sans-serif';
                            ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
                            ctx.fillText('n = ' + nVal, nSx, bottomY - H - 4);

                            // Axes
                            ctx.strokeStyle = viz.colors.axis; ctx.lineWidth = 1.5;
                            ctx.beginPath(); ctx.moveTo(leftX, bottomY); ctx.lineTo(leftX + W + 20, bottomY); ctx.stroke();
                            ctx.beginPath(); ctx.moveTo(leftX, bottomY); ctx.lineTo(leftX, bottomY - H - 10); ctx.stroke();

                            // Greedy decomposition display
                            var decompStr = parts.map(function(p) { return p + '\u1d4f'; }).join(' + ');
                            var sumStr = parts.map(function(p) { return Math.pow(p, kVal); }).join(' + ');
                            ctx.fillStyle = viz.colors.white; ctx.font = '13px -apple-system,sans-serif';
                            ctx.textAlign = 'left'; ctx.textBaseline = 'top';
                            ctx.fillText('Greedy: ' + nVal + ' = ' + sumStr + ' = ' + decompStr, leftX, bottomY + 10);
                            ctx.fillStyle = viz.colors.text;
                            ctx.fillText('# terms: ' + parts.length + '  (g(k) for k=' + kVal + ' is ' + [0,0,4,9,19][kVal] + ')', leftX, bottomY + 30);

                            // Count r_s(n) for s = 1..min(parts.length+1, 5)
                            var repCounts = [];
                            for (var s = 1; s <= Math.min(5, parts.length + 1); s++) {
                                repCounts.push({ s: s, r: countReps(nVal, kVal, s) });
                            }
                            ctx.fillStyle = viz.colors.teal; ctx.font = '11px -apple-system,sans-serif';
                            ctx.textBaseline = 'top';
                            repCounts.forEach(function(rc, idx) {
                                ctx.fillText('r_' + rc.s + '(' + nVal + ') = ' + rc.r, leftX + idx * 100, bottomY + 52);
                            });

                            // Title
                            viz.screenText('k = ' + kVal + '-th powers up to n = ' + nVal, viz.width / 2, 16, viz.colors.white, 13);
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Verify by direct computation that 23 requires 9 cubes: 23 = 8+8+1+1+1+1+1+1+1. Can you do it in 8? Show that every integer \\(n \\geq 9\\) is a sum of at most 8 cubes.',
                    hint: 'Check all representations of 23 as a sum of cubes (1, 8, 27 are the relevant cubes). For the general bound, a result of Dickson (1939) establishes \\(g(3) = 9\\) and \\(G(3) \\leq 7\\).',
                    solution: 'The cubes at most 23 are 1, 8. To represent 23: we need \\(8a + 1b = 23\\), so \\(a = 0, b = 23\\) (23 ones) or \\(a = 1, b = 15\\) (16 terms) or \\(a = 2, b = 7\\) (9 terms). The minimum is 9. For \\(n \\geq 9\\), Linnik (1943) and others showed that 7 cubes suffice. The key idea is that once \\(n\\) is large enough, the singular series argument gives \\(r_7(n) > 0\\).'
                },
                {
                    question: 'The singular series \\(\\mathfrak{S}(n)\\) for squares (\\(k=2\\), \\(s=4\\)) satisfies \\(\\mathfrak{S}(n) = c_0 \\prod_{p | n} (1 + O(1/p))\\). Why must \\(\\mathfrak{S}(n) > 0\\) for all \\(n \\geq 1\\)?',
                    hint: 'Consider the \\(p\\)-adic factors. Every integer is a sum of 4 squares mod any prime power (Lagrange\'s theorem modulo \\(p^m\\)).',
                    solution: '\\(\\mathfrak{S}(n) = \\prod_p \\sigma_p(n)\\) where \\(\\sigma_p(n)\\) is the \\(p\\)-adic density of representations. By Lagrange\'s 4-square theorem, every integer has at least one representation as \\(x_1^2 + x_2^2 + x_3^2 + x_4^2\\) over \\(\\mathbb{Z}/p^m\\mathbb{Z}\\) for all \\(p, m\\). This means \\(\\sigma_p(n) > 0\\) for all \\(p\\). The product converges to a positive value because \\(\\sigma_p(n) = 1 + O(1/p^2)\\) for \\(p \\nmid n\\).'
                }
            ]
        },

        // ================================================================
        // SECTION 5: Vinogradov's Theorem (Ternary Goldbach)
        // ================================================================
        {
            id: 'sec-goldbach',
            title: "Vinogradov's Theorem",
            content: `
<h2>Vinogradov's Theorem</h2>

<p>The most celebrated application of the circle method to primes is Vinogradov's 1937 theorem on the ternary Goldbach problem.</p>

<div class="env-block theorem">
    <div class="env-title">Theorem (Vinogradov 1937)</div>
    <div class="env-body">
        <p>Every sufficiently large odd integer \\(n\\) is the sum of three primes:</p>
        \\[
        n = p_1 + p_2 + p_3, \quad p_i \text{ prime.}
        \\]
        <p>More precisely, the number of representations satisfies</p>
        \\[
        r_3(n) = \\frac{n^2}{2(\\log n)^3}\\, \\mathfrak{S}_3(n)(1 + o(1)),
        \\]
        <p>where \\(\\mathfrak{S}_3(n) = \\prod_{p \\mid n} \\frac{p-1}{p-2} \\cdot \\prod_{p \\nmid n} \\left(1 - \\frac{1}{(p-1)^2}\\right) > 0\\) for odd \\(n\\).</p>
    </div>
</div>

<h3>The Prime Exponential Sum</h3>

<p>Define</p>
\\[
S(\\alpha) = \\sum_{p \\leq n} e(p \\alpha),
\\]
<p>so \\(r_3(n) = \\int_0^1 S(\\alpha)^3 e(-n\\alpha)\\, d\\alpha\\) (up to the log-weight convention).</p>

<p>On a major arc \\(|\\alpha - a/q| \\leq 1/(qQ)\\), the prime sum factors as</p>
\\[
S(\\alpha) \\approx \\frac{\\mu(q)}{\\phi(q)} \\sum_{m \\leq n} e(m\\beta) \\cdot \\mathbf{1}[\\gcd(m,q)=1],
\\]
<p>where \\(\\beta = \\alpha - a/q\\). The factor \\(\\mu(q)/\\phi(q)\\) reflects the distribution of primes in arithmetic progressions (via PNT in progressions and Siegel's theorem).</p>

<h3>Minor Arc Bound for Primes</h3>

<p>Vinogradov's key estimate (the "Vinogradov mean value theorem" precursor): for \\(\\alpha \\in \\mathfrak{m}\\),</p>
\\[
|S(\\alpha)| \\ll n (\\log n)^{-A}
\\]
<p>for any \\(A > 0\\), provided no Siegel zero exists. The bound requires the full strength of the zero-free region for Dirichlet \\(L\\)-functions.</p>

<p>Combining major arc computation and minor arc bound:</p>
\\[
\\int_{\\mathfrak{m}} S^3 e(-n\\cdot) \\ll n^2 (\\log n)^{-B} = o(r_3(n)).
\\]

<div class="env-block remark">
    <div class="env-title">Connection to the Riemann Hypothesis</div>
    <div class="env-body">
        <p>The "exceptional Siegel zero" is a potential real zero \\(\\beta_1\\) of some \\(L(s,\\chi)\\) very close to \\(s=1\\). If it exists, it corrupts the minor arc bound but (by a "two-case" argument) actually forces \\(\\mathfrak{S}_3(n) > 0\\) to compensate. The proof is ultimately unconditional but uses this delicate two-case structure.</p>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-goldbach-counting"></div>
`,
            visualizations: [
                {
                    id: 'viz-goldbach-counting',
                    title: "Goldbach Representations: Counting p₁ + p₂ = 2n",
                    description: 'For each even number 2n, the bar shows r₂(2n) = #{(p,q) prime : p+q=2n}. The smooth curve is the Hardy–Littlewood prediction. Slide n to explore.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, { width: 580, height: 360, originX: 60, originY: 310, scale: 1 });
                        var nMax = 100;
                        VizEngine.createSlider(controls, '2n max', 20, 200, nMax * 2, 2, function(v) { nMax = Math.round(v / 2); draw(); });

                        var primeCache = {};
                        function isPrime(m) {
                            if (m < 2) return false;
                            if (primeCache[m] !== undefined) return primeCache[m];
                            if (m === 2) { primeCache[m] = true; return true; }
                            if (m % 2 === 0) { primeCache[m] = false; return false; }
                            for (var d = 3; d * d <= m; d += 2) { if (m % d === 0) { primeCache[m] = false; return false; } }
                            primeCache[m] = true; return true;
                        }

                        function goldReps(twoN) {
                            var count = 0;
                            for (var p = 2; p <= twoN / 2; p++) {
                                if (isPrime(p) && isPrime(twoN - p)) count++;
                            }
                            return count;
                        }

                        function hlPred(twoN) {
                            // Hardy-Littlewood heuristic: ~ C2 * 2n / (log(2n))^2
                            var C2 = 1.3203;  // twin prime constant approximation
                            var logn = Math.log(twoN);
                            return C2 * twoN / (logn * logn);
                        }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var W = viz.width - 80, H = 240;
                            var leftX = 60, bottomY = 305;
                            var barW = Math.max(1, Math.floor(W / nMax) - 1);

                            var reps = [];
                            var maxR = 1;
                            for (var n2 = 2; n2 <= nMax; n2++) {
                                var r = goldReps(2 * n2);
                                reps.push(r);
                                if (r > maxR) maxR = r;
                            }

                            // Axes
                            ctx.strokeStyle = viz.colors.axis; ctx.lineWidth = 1.5;
                            ctx.beginPath(); ctx.moveTo(leftX, bottomY); ctx.lineTo(leftX + W, bottomY); ctx.stroke();
                            ctx.beginPath(); ctx.moveTo(leftX, bottomY); ctx.lineTo(leftX, bottomY - H); ctx.stroke();

                            // Y labels
                            ctx.fillStyle = viz.colors.text; ctx.font = '10px -apple-system,sans-serif';
                            ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
                            [0.25, 0.5, 0.75, 1.0].forEach(function(frac) {
                                var yy = bottomY - frac * H;
                                ctx.fillText(Math.round(frac * maxR), leftX - 4, yy);
                                ctx.strokeStyle = viz.colors.grid; ctx.lineWidth = 0.5;
                                ctx.beginPath(); ctx.moveTo(leftX, yy); ctx.lineTo(leftX + W, yy); ctx.stroke();
                            });

                            // Bars
                            reps.forEach(function(r, i) {
                                var n2 = i + 2;
                                var sx = leftX + (i / (nMax - 1)) * W;
                                var barH = (r / maxR) * H;
                                ctx.fillStyle = viz.colors.blue + 'bb';
                                ctx.fillRect(sx - barW / 2, bottomY - barH, barW, barH);
                            });

                            // H-L smooth curve
                            ctx.strokeStyle = viz.colors.orange; ctx.lineWidth = 2;
                            ctx.beginPath();
                            var started = false;
                            for (var i2 = 0; i2 < nMax - 1; i2++) {
                                var n3 = i2 + 2;
                                var pred = hlPred(2 * n3);
                                var sx2 = leftX + (i2 / (nMax - 1)) * W;
                                var sy2 = bottomY - (pred / maxR) * H;
                                if (sy2 < bottomY - H) sy2 = bottomY - H;
                                if (!started) { ctx.moveTo(sx2, sy2); started = true; } else { ctx.lineTo(sx2, sy2); }
                            }
                            ctx.stroke();

                            // X labels
                            ctx.fillStyle = viz.colors.text; ctx.textAlign = 'center'; ctx.textBaseline = 'top';
                            [4, Math.round(nMax / 2) * 2, nMax * 2].forEach(function(val) {
                                var idx = val / 2 - 2;
                                var sx3 = leftX + (idx / (nMax - 1)) * W;
                                ctx.fillText(val, sx3, bottomY + 4);
                            });

                            // Legend
                            ctx.fillStyle = viz.colors.blue + 'bb'; ctx.fillRect(leftX + 10, 22, 12, 12);
                            ctx.fillStyle = viz.colors.white; ctx.font = '11px -apple-system,sans-serif'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
                            ctx.fillText('r\u2082(2n) = #{p+q=2n, p,q prime}', leftX + 28, 28);
                            ctx.strokeStyle = viz.colors.orange; ctx.lineWidth = 2;
                            ctx.beginPath(); ctx.moveTo(leftX + 10, 42); ctx.lineTo(leftX + 22, 42); ctx.stroke();
                            ctx.fillStyle = viz.colors.orange;
                            ctx.fillText('Hardy\u2013Littlewood prediction', leftX + 28, 42);

                            viz.screenText('Goldbach Representations r\u2082(2n) for 2n \u2264 ' + (nMax * 2), viz.width / 2, 10, viz.colors.white, 13);
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Explain why \\(\\mathfrak{S}_3(n) = 0\\) when \\(n\\) is even. Why is the ternary Goldbach problem only stated for odd \\(n\\)?',
                    hint: 'If \\(n\\) is even and \\(n = p_1 + p_2 + p_3\\), what parities must the primes have? What does that say about \\(p_1, p_2, p_3\\)?',
                    solution: 'For \\(n\\) even and \\(n = p_1 + p_2 + p_3\\): each \\(p_i\\) is either 2 or odd. Sum of three odd numbers is odd, not even. So at least one of the \\(p_i = 2\\). Then \\(n - 2 = p_2 + p_3\\) even, which is binary Goldbach, still open. Analytically, the singular series \\(\\mathfrak{S}_3(n)\\) at \\(p = 2\\) gives the local factor \\(\\sigma_2(n)\\), which vanishes when \\(n\\) is even (no 2-adic solutions to \\(x_1 + x_2 + x_3 = n\\) with all \\(x_i\\) odd prime representatives mod 2).'
                },
                {
                    question: 'The Hardy-Littlewood conjecture predicts the number of representations of \\(2n\\) as \\(p + q\\) (binary Goldbach) is \\(\\sim 2C_2 \\cdot 2n / (\\log 2n)^2\\) where \\(C_2 = \\prod_{p > 2}(1 - 1/(p-1)^2)\\). Explain the heuristic: why \\(1/(\\log n)^2\\)?',
                    hint: 'The probability that a random number near \\(n\\) is prime is about \\(1/\\log n\\) (PNT). We need two numbers \\(p\\) and \\(2n - p\\) to both be prime.',
                    solution: 'By PNT, the "probability" that a random integer near \\(n\\) is prime is \\(1/\\log n\\). For a random \\(p \\leq 2n\\), the probability that both \\(p\\) and \\(2n-p\\) are prime is approximately \\((1/\\log p)(1/\\log(2n-p)) \\approx 1/(\\log n)^2\\). Summing over \\(p = 2, 3, \\ldots, 2n\\) gives \\(\\sim 2n/(\\log n)^2\\). The correction factor \\(2C_2\\) accounts for the fact that primes are not uniformly distributed mod small primes (at \\(p=2\\), both numbers must be odd, giving a factor of 2; at odd primes \\(p\\), there are "twin prime" corrections).'
                }
            ]
        },

        // ================================================================
        // SECTION 6: The Singular Series
        // ================================================================
        {
            id: 'sec-singular-series',
            title: 'The Singular Series',
            content: `
<h2>The Singular Series</h2>

<p>The singular series \\(\\mathfrak{S}(n)\\) is the arithmetic heart of the circle method. It measures whether a given \\(n\\) is locally representable at every prime.</p>

<h3>Definition via Ramanujan Sums</h3>

<p>For the \\(s\\)-fold sum-of-\\(k\\)-th-powers problem:</p>
\\[
\\mathfrak{S}(n) = \\sum_{q=1}^\\infty A(q), \\quad A(q) = \\sum_{\\substack{a=0 \\\\ \\gcd(a,q)=1}}^{q-1} \\left(\\frac{S(a,q)}{q}\\right)^s e\\!\\left(-\\frac{na}{q}\\right),
\\]
<p>where \\(S(a,q) = \\sum_{r=1}^q e(r^k a/q)\\) is a complete Weyl sum.</p>

<h3>Euler Product</h3>

<p>Since \\(A(q)\\) is multiplicative in \\(q\\), the series factors as an Euler product:</p>
\\[
\\mathfrak{S}(n) = \\prod_p \\sigma_p(n),
\\]
\\[
\\sigma_p(n) = \\sum_{t=0}^\\infty A(p^t) = \\lim_{m \\to \\infty} \\frac{\\#\\{(x_1,\\ldots,x_s) \\in (\\mathbb{Z}/p^m\\mathbb{Z})^s : x_1^k + \\cdots + x_s^k \\equiv n\\}}{p^{m(s-1)}}.
\\]

<p>Thus \\(\\sigma_p(n)\\) is the \\(p\\)-adic density: the "probability" that a random \\(s\\)-tuple of integers satisfies \\(x_1^k + \\cdots + x_s^k = n\\) modulo arbitrarily high powers of \\(p\\).</p>

<h3>Positivity of the Singular Series</h3>

<div class="env-block theorem">
    <div class="env-title">Theorem (Positivity)</div>
    <div class="env-body">
        <p>\\(\\mathfrak{S}(n) > 0\\) if and only if \\(n\\) is locally representable, i.e., for every prime power \\(p^m\\), the congruence \\(x_1^k + \\cdots + x_s^k \\equiv n \\pmod{p^m}\\) has a solution. For \\(s \\geq 2k + 1\\), this holds for all \\(n \\geq 1\\).</p>
    </div>
</div>

<p>The singular series is bounded: \\(\\mathfrak{S}(n) \\asymp 1\\) for most \\(n\\), but its exact value encodes deep arithmetic information.</p>

<h3>Examples</h3>

<div class="env-block example">
    <div class="env-title">Four Squares (k=2, s=4)</div>
    <div class="env-body">
        <p>\\[\\mathfrak{S}(n) = \\frac{8}{\\prod_{p^2 | n} (1 + 1/p)},\\]</p>
        <p>which is always \\(> 0\\). This matches Jacobi's formula: \\(r_4(n) = 8\\sum_{4 \\nmid d, d | n} d\\).</p>
    </div>
</div>

<div class="env-block example">
    <div class="env-title">Three Primes (Ternary Goldbach)</div>
    <div class="env-body">
        <p>\\[\\mathfrak{S}_3(n) = \\prod_{p \\mid n, p > 2} \\frac{p-1}{p-2} \\cdot \\prod_{p \\nmid n, p > 2} \\left(1 - \\frac{1}{(p-1)^2}\\right),\\]</p>
        <p>which is \\(> 0\\) for odd \\(n\\) and \\(= 0\\) for even \\(n\\).</p>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-singular-series"></div>
`,
            visualizations: [
                {
                    id: 'viz-singular-series',
                    title: 'The Singular Series: Product of Local Factors',
                    description: 'Watch the partial Euler product ∏_{p≤P} σ_p(n) converge as more primes are included. Choose n and k to explore how local conditions shape the global count.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, { width: 580, height: 380, originX: 60, originY: 320, scale: 1 });
                        var nVal = 9, kVal = 2, sVal = 4;
                        VizEngine.createSlider(controls, 'n', 1, 50, nVal, 1, function(v) { nVal = Math.round(v); draw(); });
                        VizEngine.createSlider(controls, 'k', 2, 3, kVal, 1, function(v) { kVal = Math.round(v); draw(); });
                        VizEngine.createSlider(controls, 's', 3, 8, sVal, 1, function(v) { sVal = Math.round(v); draw(); });

                        function gcd(a, b) { return b === 0 ? a : gcd(b, a % b); }

                        function localFactor(p, n, k, s) {
                            // Approximate sigma_p(n) via mod p^2 count
                            var pm = p * p;
                            var count = 0;
                            var total = 1;
                            for (var i = 0; i < s; i++) total *= pm;
                            for (var x1 = 0; x1 < pm; x1++) {
                                var pw1 = mod(Math.pow(x1, k), pm);
                                for (var x2 = 0; x2 < pm; x2++) {
                                    var sum2 = (pw1 + mod(Math.pow(x2, k), pm)) % pm;
                                    if (s === 2) { if (sum2 === n % pm) count++; continue; }
                                    for (var x3 = 0; x3 < pm; x3++) {
                                        var sum3 = (sum2 + mod(Math.pow(x3, k), pm)) % pm;
                                        if (s === 3) { if (sum3 === n % pm) count++; continue; }
                                        for (var x4 = 0; x4 < pm; x4++) {
                                            var sum4 = (sum3 + mod(Math.pow(x4, k), pm)) % pm;
                                            if (sum4 === n % pm) count++;
                                        }
                                        if (s <= 4) break;
                                    }
                                    if (s <= 3) break;
                                }
                                if (s <= 2) break;
                            }
                            if (s > 4) return 1.0;  // too expensive, skip
                            var expected = total / pm;
                            return count / expected;
                        }

                        function mod(x, m) { return ((x % m) + m) % m; }

                        var primes30 = VizEngine.sievePrimes(30);

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var W = viz.width - 100, H = 220;
                            var leftX = 70, bottomY = 315;

                            // Compute partial products
                            var partials = [1.0];
                            var labels = ['1'];
                            primes30.forEach(function(p) {
                                var lf = localFactor(p, nVal, kVal, Math.min(sVal, 4));
                                partials.push(partials[partials.length - 1] * lf);
                                labels.push('p\u2264' + p);
                            });

                            var maxV = Math.max.apply(null, partials) * 1.2 || 2;
                            var minV = 0;

                            // Axes
                            ctx.strokeStyle = viz.colors.axis; ctx.lineWidth = 1.5;
                            ctx.beginPath(); ctx.moveTo(leftX, bottomY); ctx.lineTo(leftX + W, bottomY); ctx.stroke();
                            ctx.beginPath(); ctx.moveTo(leftX, bottomY); ctx.lineTo(leftX, bottomY - H); ctx.stroke();

                            // Y labels
                            ctx.fillStyle = viz.colors.text; ctx.font = '10px -apple-system,sans-serif';
                            ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
                            [0, 0.5, 1.0].forEach(function(frac) {
                                var val = frac * maxV;
                                var yy = bottomY - (val / maxV) * H;
                                ctx.fillText(val.toFixed(2), leftX - 4, yy);
                                ctx.strokeStyle = viz.colors.grid; ctx.lineWidth = 0.5;
                                ctx.beginPath(); ctx.moveTo(leftX, yy); ctx.lineTo(leftX + W, yy); ctx.stroke();
                            });

                            // Plot partial products
                            var barW = Math.floor(W / partials.length) - 2;
                            partials.forEach(function(val, idx) {
                                var sx = leftX + (idx / (partials.length - 1)) * W;
                                var barH = (val / maxV) * H;
                                ctx.fillStyle = val > 0 ? viz.colors.teal + 'aa' : viz.colors.red + 'aa';
                                ctx.fillRect(sx - barW / 2, bottomY - barH, barW, barH);
                                // Dot at top
                                ctx.fillStyle = viz.colors.teal;
                                ctx.beginPath(); ctx.arc(sx, bottomY - barH, 3, 0, 2 * Math.PI); ctx.fill();
                            });

                            // Connect with line
                            ctx.strokeStyle = viz.colors.teal; ctx.lineWidth = 1.5;
                            ctx.beginPath();
                            partials.forEach(function(val, idx) {
                                var sx = leftX + (idx / (partials.length - 1)) * W;
                                var sy = bottomY - (val / maxV) * H;
                                idx === 0 ? ctx.moveTo(sx, sy) : ctx.lineTo(sx, sy);
                            });
                            ctx.stroke();

                            // X labels (every other prime)
                            ctx.fillStyle = viz.colors.text; ctx.textAlign = 'center'; ctx.textBaseline = 'top';
                            ctx.font = '9px -apple-system,sans-serif';
                            [0, 2, 4, 6, 8, 10].forEach(function(idx) {
                                if (idx >= labels.length) return;
                                var sx = leftX + (idx / (partials.length - 1)) * W;
                                ctx.fillText(labels[idx], sx, bottomY + 4);
                            });

                            // Final value annotation
                            var finalVal = partials[partials.length - 1];
                            ctx.fillStyle = viz.colors.yellow; ctx.font = '12px -apple-system,sans-serif';
                            ctx.textAlign = 'left'; ctx.textBaseline = 'top';
                            ctx.fillText('\u1d50(n) \u2248 ' + finalVal.toFixed(4), leftX + 10, 50);

                            viz.screenText('\u03a3(n): partial Euler product for n=' + nVal + ', k=' + kVal + ', s=' + sVal, viz.width / 2, 14, viz.colors.white, 13);
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Show that for \\(k = 1\\) (sums of integers) and any \\(s \\geq 1\\), the singular series \\(\\mathfrak{S}(n) = 1\\) identically. Why does this make sense?',
                    hint: 'For \\(k=1\\), \\(x_1 + \\cdots + x_s = n\\) is a linear equation. What is its \\(p\\)-adic density?',
                    solution: 'For \\(k=1\\): \\(x_1 + \\cdots + x_s = n\\) over \\(\\mathbb{Z}/p^m\\mathbb{Z}\\). The number of solutions is \\(p^{m(s-1)}\\) (choose \\(x_1, \\ldots, x_{s-1}\\) freely, then \\(x_s = n - x_1 - \\cdots - x_{s-1}\\) is determined). So \\(\\sigma_p = p^{m(s-1)}/p^{m(s-1)} = 1\\) for all \\(p\\), and \\(\\mathfrak{S}(n) = \\prod_p 1 = 1\\). This makes sense: there are no arithmetic obstructions to representing an integer as a sum of \\(s\\) integers.'
                },
                {
                    question: 'For the four-squares theorem (\\(k=2\\), \\(s=4\\)), verify that \\(\\sigma_2(n) > 0\\) for all \\(n \\geq 1\\) by showing that \\(x_1^2 + x_2^2 + x_3^2 + x_4^2 \\equiv n \\pmod{8}\\) always has a solution.',
                    hint: 'The quadratic residues mod 8 are \\{0, 1, 4\\}. Check which values \\(n \\bmod 8\\) can be represented as sums of four elements of \\{0,1,4\\}.',
                    solution: 'Squares mod 8 are \\{0,1,4\\}. We need to show every residue 0..7 is a sum of four elements of \\{0,1,4\\}. 0=0+0+0+0, 1=1+0+0+0, 2=1+1+0+0, 3=1+1+1+0, 4=4+0+0+0 or 1+1+1+1, 5=4+1+0+0, 6=4+1+1+0, 7=4+1+1+1. Every residue works. Since the congruence has solutions mod 8 (and by Hensel\'s lemma also mod all powers of 2), \\(\\sigma_2(n) > 0\\) for all \\(n\\).'
                }
            ]
        },

        // ================================================================
        // SECTION 7: The Distribution of Zeros
        // ================================================================
        {
            id: 'sec-bridge',
            title: 'The Distribution of Zeros',
            content: `
<h2>The Distribution of Zeros</h2>

<p>The circle method and the distribution of zeros of \\(L\\)-functions are intimately linked. This section explains the bridge.</p>

<h3>From Circle Method to Zeros</h3>

<p>The prime exponential sum \\(S(\\alpha) = \\sum_{p \\leq N} e(p\\alpha)\\) is connected to the Riemann zeta function via Mellin transform / explicit formula ideas. On a major arc \\(\\alpha = a/q + \\beta\\), the approximation</p>
\\[
S(\\alpha) \\approx \\frac{\\mu(q)}{\\phi(q)} \\sum_{n \\leq N} \\Lambda(n) e(n\\beta)
\\]
<p>uses the von Mangoldt function \\(\\Lambda\\). The inner sum \\(\\sum_{n \\leq N} \\Lambda(n) e(n\\beta)\\) is related to the zeros \\(\\rho = \\sigma + it\\) of \\(\\zeta(s)\\) via</p>
\\[
\\sum_{n \\leq N} \\Lambda(n) e(n\\beta) = -\\frac{e((N+1)\\beta)}{\\log N} \\sum_\\rho \\frac{N^{\\rho - 1}}{\\rho - 1} + \\cdots
\\]

<p>A zero at \\(\\rho = 1/2 + it\\) contributes an oscillation \\(N^{-1/2} \\cdot e^{it \\log N}\\). The more zeros there are with large \\(|t|\\), and the closer they are to \\(\\text{Re}(s) = 1\\), the harder it is to bound \\(S(\\alpha)\\) on minor arcs.</p>

<h3>Zero-Free Regions as Minor Arc Savings</h3>

<div class="env-block theorem">
    <div class="env-title">Principle (Zero-Free Region = Minor Arc Bound)</div>
    <div class="env-body">
        <p>The classical zero-free region \\(\\sigma > 1 - c/\\log(|t|+2)\\) for \\(\\zeta(s)\\) implies</p>
        \\[
        \\left|\\sum_{n \\leq N} \\Lambda(n) e(n\\beta)\\right| \\ll N \\exp(-c\\sqrt{\\log N})
        \\]
        <p>for \\(\\beta\\) in the minor arcs. This saving (power of \\(\\log N\\)) is what makes Vinogradov's theorem work.</p>
        <p>Under GRH (all zeros on \\(\\text{Re}(s) = 1/2\\)), the bound improves to \\(O(N^{1/2} \\log N)\\), enabling much stronger results.</p>
    </div>
</div>

<h3>The Exceptional Zero Problem</h3>

<p>A Siegel zero \\(\\beta_1\\) of \\(L(s, \\chi)\\) for a real character \\(\\chi \\bmod q\\) is a real zero with \\(\\beta_1 > 1 - c/\\log q\\). It causes the minor arc bound to deteriorate by a factor related to \\(L(1,\\chi)\\). Vinogradov's proof handles this via a two-case argument:</p>
<ul>
    <li><strong>Case 1</strong> (No Siegel zero): standard zero-free region suffices.</li>
    <li><strong>Case 2</strong> (Siegel zero exists): the zero itself contributes a detectable term to the major arc integral that is positive and large, compensating for the loss in the minor arc bound.</li>
</ul>

<h3>The Hardy–Littlewood–Cramér Heuristic</h3>

<p>Cramér modeled primes as independent Bernoulli events with probability \\(1/\\log n\\). Under this model, Goldbach's conjecture holds almost surely and the gaps between primes are \\(O((\\log n)^2)\\). The circle method formalizes this heuristic: the main term \\(\\mathfrak{S}(n) \\cdot J(n)\\) is exactly the "Cramér prediction" corrected for arithmetic obstructions.</p>

<div class="env-block remark">
    <div class="env-title">Historical Note: The Hardy–Ramanujan Circle</div>
    <div class="env-body">
        <p>Hardy and Ramanujan (1918) introduced the method to study \\(p(n)\\), the partition function. They obtained the asymptotic \\(p(n) \\sim \\frac{1}{4n\\sqrt{3}} e^{\\pi\\sqrt{2n/3}}\\). Rademacher (1937) made this exact with a convergent series. Hardy and Littlewood (1920s) then applied the method systematically to Waring's problem and the binary/ternary Goldbach conjectures, naming it "the circle method" for their use of contour integration.</p>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-arc-partition"></div>

<p>The arc partition visualization from Section 1 makes a reappearance here: as we enlarge \\(Q\\) (admitting more and smaller major arcs), we capture the contributions of more zeros via more Ramanujan sums, but the minor arc savings correspondingly weakens. The optimal choice \\(Q = N^{1/2}\\) (or \\(Q = N^{1/3}\\) for ternary problems) balances these two effects.</p>
`,
            visualizations: [],
            exercises: [
                {
                    question: 'State the explicit formula for \\(\\psi(x) = \\sum_{n \\leq x} \\Lambda(n)\\) in terms of zeros of \\(\\zeta(s)\\). Identify which zeros contribute oscillations of amplitude \\(x^{\\sigma}\\) and frequency \\(t \\log x / (2\\pi)\\).',
                    hint: 'The explicit formula is \\(\\psi(x) = x - \\sum_\\rho x^\\rho / \\rho - \\log(2\\pi) - \\frac{1}{2}\\log(1 - x^{-2})\\). A zero \\(\\rho = \\sigma + it\\) contributes \\(-x^\\rho/\\rho = -x^\\sigma e^{it\\log x}/|\\rho|\\).',
                    solution: 'From the explicit formula, each zero \\(\\rho = \\sigma + it\\) contributes a term \\(-x^\\rho/\\rho\\) to \\(\\psi(x)\\). The modulus is \\(x^\\sigma / |\\rho|\\): on GRH where \\(\\sigma = 1/2\\), this is \\(x^{1/2}/|\\rho|\\). The argument oscillates as \\(e^{it\\log x}\\), giving oscillations with "frequency" \\(t/(2\\pi)\\) in \\(\\log x\\)-space. Zeros with large \\(|t|\\) contribute high-frequency oscillations (which tend to cancel when summed), while zeros with large \\(\\sigma\\) (close to 1) would give large-amplitude contributions, hence the importance of the zero-free region.'
                },
                {
                    question: 'The circle method applied to \\(\\mathcal{A} = \\{1, 2, 3, \\ldots\\}\\) (all positive integers) gives the trivial representation count \\(r_s(n) = \\binom{n+s-1}{s-1}\\). Verify this directly using the integral formula \\(r_s(n) = \\int_0^1 (\\sum_{m=1}^n e(m\\alpha))^s e(-n\\alpha)\\, d\\alpha\\).',
                    hint: 'The generating function for compositions is \\(f(\\alpha) = \\sum_{m \\geq 1} e(m\\alpha) = e(\\alpha)/(1-e(\\alpha))\\) as a formal series. The Fourier coefficient of \\(f(\\alpha)^s\\) counts ordered representations.',
                    solution: '\\(r_s(n)\\) = # ordered ways to write \\(n = m_1 + \\cdots + m_s\\) with \\(m_i \\geq 1\\). By stars-and-bars, this is \\(\\binom{n-1}{s-1}\\) (place \\(s-1\\) dividers among \\(n-1\\) gaps). The integral formula gives the same answer: \\(f(\\alpha)^s = \\sum_{m_1,\\ldots,m_s \\geq 1} e((m_1+\\cdots+m_s)\\alpha)\\), and \\(\\int_0^1 e(k\\alpha)\\, d\\alpha = \\mathbf{1}[k=0]\\) picks out tuples with \\(m_1 + \\cdots + m_s = n\\), giving exactly \\(\\binom{n-1}{s-1}\\).'
                }
            ]
        }
    ]
});
