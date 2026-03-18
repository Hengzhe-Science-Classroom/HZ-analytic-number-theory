window.CHAPTERS = window.CHAPTERS || [];
window.CHAPTERS.push({
    id: 'ch13',
    number: 13,
    title: 'The Large Sieve & Bombieri-Vinogradov',
    subtitle: 'GRH on average, for free',
    sections: [

        // ================================================================
        // SECTION 1: GRH on Average
        // ================================================================
        {
            id: 'sec-motivation',
            title: 'GRH on Average',
            content: `
<h2>GRH on Average</h2>

<div class="env-block intuition">
    <div class="env-title">The Impossibility Bypass</div>
    <div class="env-body">
        <p>The Generalized Riemann Hypothesis (GRH) is one of the deepest open problems in mathematics. It would give us
        precise control over how primes are distributed in arithmetic progressions. Without it, our error terms are
        far weaker. Yet there is a remarkable saving grace: <strong>for most moduli simultaneously</strong>, we
        can achieve GRH-quality estimates unconditionally. This is the Bombieri-Vinogradov theorem.</p>
    </div>
</div>

<p>Recall from Chapter 10 that the Prime Number Theorem in arithmetic progressions states</p>
\\[
\\pi(x; q, a) = \\frac{\\mathrm{li}(x)}{\\phi(q)} + E(x, q, a),
\\]
<p>where \\(\\pi(x; q, a)\\) counts primes \\(p \\le x\\) with \\(p \\equiv a \\pmod{q}\\), \\(\\phi(q)\\) is Euler's totient,
and \\(E(x, q, a)\\) is the error. On GRH, the error satisfies \\(|E(x, q, a)| \\ll x^{1/2} \\log^2 x\\) for all
\\(q \\le x\\) and \\((a, q) = 1\\).</p>

<p>The Bombieri-Vinogradov theorem (1965) achieves this <em>on average over \\(q\\)</em>:</p>

<div class="env-block theorem">
    <div class="env-title">Theorem 13.1 (Bombieri-Vinogradov)</div>
    <div class="env-body">
        <p>For any fixed \\(A > 0\\), there exists \\(B = B(A) > 0\\) such that</p>
        \\[
        \\sum_{q \\le Q} \\max_{(a,q)=1} \\left| \\psi(x; q, a) - \\frac{x}{\\phi(q)} \\right| \\ll \\frac{x}{(\\log x)^A},
        \\]
        <p>where \\(Q = x^{1/2} (\\log x)^{-B}\\) and \\(\\psi(x; q, a) = \\sum_{n \\le x,\\, n \\equiv a \\pmod q} \\Lambda(n)\\).</p>
    </div>
</div>

<p>The crucial point is the range \\(Q \\approx x^{1/2}\\): GRH would give the same bound for all individual \\(q \\le x^{1/2}\\),
and Bombieri-Vinogradov achieves it as a sum over all \\(q\\) up to \\(x^{1/2}\\) (nearly). This suffices for most
applications.</p>

<h3>Why Does This Matter?</h3>

<p>Many sieve problems require an estimate of the form</p>
\\[
\\sum_{q \\le Q} \\left| \\sum_{n \\le x} \\Lambda(n) e(n\\alpha_r) \\right| \\ll x (\\log x)^{-A}
\\]
<p>with \\(Q\\) as large as possible. The engine behind Bombieri-Vinogradov is the <strong>Large Sieve inequality</strong>,
which we develop next.</p>

<div class="env-block remark">
    <div class="env-title">Historical Context</div>
    <div class="env-body">
        <p>Linnik (1941) introduced the large sieve heuristically. Renyi (1950) gave the first application to primes in
        progressions. The sharp form of the large sieve inequality was established independently by Bombieri (1965)
        and A.I. Vinogradov (1965). The current clean proof via duality is due to Montgomery and Vaughan (1973).</p>
    </div>
</div>
`,
            visualizations: [
                {
                    id: 'viz-bv-vs-grh',
                    title: 'BV vs GRH: Error Term Comparison',
                    description: 'Compare what GRH would give for individual q against what Bombieri-Vinogradov proves on average. The BV bound is the sum over all q up to Q.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, { width: 580, height: 360, originX: 70, originY: 300, scale: 1 });

                        var logX = 8;
                        VizEngine.createSlider(controls, 'log\u2082(x)', 4, 16, logX, 0.5, function(v) {
                            logX = v; draw();
                        });

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var x = Math.pow(2, logX);
                            var sqrtX = Math.sqrt(x);
                            var logXval = Math.log(x);

                            // Draw bars for individual q and sum
                            var W = viz.width - 90;
                            var H = 260;
                            var barW = 18;
                            var numQ = Math.min(20, Math.floor(sqrtX / logXval));
                            if (numQ < 2) numQ = 2;

                            var grh = sqrtX * logXval * logXval;
                            var bvSum = 0;
                            var grh_sum = 0;
                            var qList = [];
                            for (var qi = 1; qi <= numQ; qi++) {
                                var q = qi;
                                var err_grh = sqrtX * logXval * logXval;
                                var err_est = sqrtX * logXval;
                                bvSum += err_est;
                                grh_sum += err_grh;
                                qList.push({ q: q, grh: err_grh, est: err_est });
                            }
                            var bvBound = x / (logXval * logXval);

                            var maxVal = Math.max(grh_sum, bvSum, bvBound);
                            var scale = H / maxVal;

                            // Background
                            viz.screenText('Individual GRH bound vs BV average', viz.width / 2, 18, viz.colors.white, 14);

                            // Draw BV theoretical bound line
                            var bvY = viz.originY - bvBound * scale;
                            ctx.strokeStyle = viz.colors.green;
                            ctx.lineWidth = 2;
                            ctx.setLineDash([6, 4]);
                            ctx.beginPath();
                            ctx.moveTo(50, bvY);
                            ctx.lineTo(viz.width - 20, bvY);
                            ctx.stroke();
                            ctx.setLineDash([]);
                            viz.screenText('BV bound x/(log x)^A', viz.width - 22, bvY - 8, viz.colors.green, 10, 'right');

                            var spacing = Math.max(barW + 4, Math.floor(W / (numQ + 1)));
                            for (var i = 0; i < qList.length; i++) {
                                var item = qList[i];
                                var xPos = 60 + i * spacing;

                                // GRH individual bar
                                var hGRH = item.grh * scale;
                                ctx.fillStyle = viz.colors.blue + '99';
                                ctx.fillRect(xPos, viz.originY - hGRH, barW * 0.9, hGRH);

                                // Estimated error bar
                                var hEst = item.est * scale;
                                ctx.fillStyle = viz.colors.orange + 'bb';
                                ctx.fillRect(xPos + barW * 0.45, viz.originY - hEst, barW * 0.45, hEst);

                                // q label
                                ctx.fillStyle = viz.colors.text;
                                ctx.font = '9px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.fillText('q=' + item.q, xPos + barW / 2, viz.originY + 12);
                            }

                            // Axis
                            ctx.strokeStyle = viz.colors.axis;
                            ctx.lineWidth = 1.5;
                            ctx.beginPath();
                            ctx.moveTo(50, viz.originY);
                            ctx.lineTo(viz.width - 10, viz.originY);
                            ctx.stroke();

                            // Legend
                            var lx = viz.width - 200, ly = 40;
                            ctx.fillStyle = viz.colors.blue + '99';
                            ctx.fillRect(lx, ly, 14, 12);
                            ctx.fillStyle = viz.colors.white; ctx.font = '10px -apple-system,sans-serif'; ctx.textAlign = 'left';
                            ctx.fillText('GRH: individual bound', lx + 18, ly + 10);
                            ctx.fillStyle = viz.colors.orange + 'bb';
                            ctx.fillRect(lx, ly + 18, 14, 12);
                            ctx.fillText('Est error for q', lx + 18, ly + 28);

                            viz.screenText('x = 2^' + logX.toFixed(1) + ',  Q \u2248 ' + Math.round(sqrtX / logXval), viz.width / 2, viz.originY + 28, viz.colors.text, 11);
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'State precisely what GRH would give for \\(\\psi(x;q,a)\\) and compare with the Bombieri-Vinogradov bound. For which values of \\(q\\) is BV non-trivial?',
                    hint: 'GRH implies \\(|\\psi(x;q,a) - x/\\phi(q)| \\ll x^{1/2} \\log^2 x\\) for each individual \\(q\\). BV sums over \\(q \\le x^{1/2}/(\\log x)^B\\).',
                    solution: 'GRH gives \\(|E(x,q,a)| \\ll x^{1/2}\\log^2 x\\) for each \\(q \\le x\\) individually. BV proves that \\(\\sum_{q \\le x^{1/2}/(\\log x)^B} \\max_a |E(x,q,a)| \\ll x/(\\log x)^A\\). The bound is non-trivial for \\(q \\le x^{1/2}/(\\log x)^B\\), which is nearly the full GRH range \\(q \\le x^{1/2}\\).'
                }
            ]
        },

        // ================================================================
        // SECTION 2: The Large Sieve Inequality
        // ================================================================
        {
            id: 'sec-large-sieve',
            title: 'The Large Sieve Inequality',
            content: `
<h2>The Large Sieve Inequality</h2>

<div class="env-block intuition">
    <div class="env-title">The Core Idea</div>
    <div class="env-body">
        <p>If we evaluate a trigonometric polynomial \\(S(\\alpha) = \\sum_{n=M+1}^{M+N} a_n e(n\\alpha)\\) at many
        well-spaced points \\(\\alpha_1, \\dots, \\alpha_R\\), then <em>on average</em> the values cannot all be large.
        Energy must spread out. This intuition becomes a precise inequality that controls the sum of \\(|S(\\alpha_r)|^2\\).</p>
    </div>
</div>

<h3>Setup and Statement</h3>

<p>Let \\(e(\\alpha) = e^{2\\pi i \\alpha}\\). Given complex numbers \\(a_M, \\dots, a_{M+N}\\), define the
<em>exponential sum</em></p>
\\[
S(\\alpha) = \\sum_{n=M+1}^{M+N} a_n e(n\\alpha).
\\]
<p>Let \\(\\alpha_1, \\dots, \\alpha_R \\in [0,1)\\) be real numbers that are <strong>\\(\\delta\\)-spaced</strong>: any two
satisfy \\(\\|\\alpha_r - \\alpha_s\\| \\ge \\delta\\) (distance on the circle \\(\\mathbb{R}/\\mathbb{Z}\\)).</p>

<div class="env-block theorem">
    <div class="env-title">Theorem 13.2 (Large Sieve Inequality)</div>
    <div class="env-body">
        <p>With the above notation,</p>
        \\[
        \\sum_{r=1}^{R} |S(\\alpha_r)|^2 \\le \\left(N + \\delta^{-1}\\right) \\sum_{n=M+1}^{M+N} |a_n|^2.
        \\]
    </div>
</div>

<p>The bound \\((N + \\delta^{-1})\\) is sharp: if \\(\\delta = 1/N\\) (minimum spacing for \\(N\\) points) we get
\\(2N\\), roughly double the trivial bound \\(N\\). The inequality says that <em>the energy \\(\\sum |S(\\alpha_r)|^2\\)
is controlled by the energy in the coefficients \\(\\sum |a_n|^2\\), amplified by the number of points we can
fit with spacing \\(\\delta\\)</em>.</p>

<h3>Proof Sketch via Duality</h3>

<p>The elegant proof by Montgomery-Vaughan uses the following duality principle:</p>

<div class="env-block theorem">
    <div class="env-title">Lemma 13.3 (Duality / Transposition)</div>
    <div class="env-body">
        <p>The inequality \\(\\sum_r |S(\\alpha_r)|^2 \\le \\Delta \\sum_n |a_n|^2\\) is equivalent to
        \\(\\sum_n |T_n|^2 \\le \\Delta \\sum_r |b_r|^2\\) where \\(T_n = \\sum_r b_r e(n\\alpha_r)\\).</p>
    </div>
</div>

<p>So it suffices to prove the "dual" direction. The key input is an estimate for the kernel</p>
\\[
K(\\alpha) = \\sum_{r \\ne s} \\frac{1}{\\|\\alpha_r - \\alpha_s\\|}
\\]
<p>which is controlled by the well-spacing condition: \\(K \\ll R \\delta^{-1}\\).</p>

<p>The full proof proceeds by expanding \\(\\sum_r |S(\\alpha_r)|^2\\) and estimating the cross terms using the
<strong>Hilbert inequality</strong>:</p>
\\[
\\left| \\sum_{m \\ne n} \\frac{a_m \\bar{a}_n}{m - n} \\right| \\le \\pi \\sum_n |a_n|^2.
\\]

<h3>Additive vs Multiplicative Form</h3>

<p>The additive large sieve controls sums over arbitrary real \\(\\alpha_r\\). The multiplicative version
(next section) specializes to the Farey fractions \\(\\alpha_r = a/q\\) with \\((a,q)=1\\) and \\(q \\le Q\\).
These are \\(\\delta = Q^{-2}\\)-spaced (Farey spacing), giving the key estimate used in BV.</p>
`,
            visualizations: [
                {
                    id: 'viz-large-sieve-energy',
                    title: 'Large Sieve: Energy Distribution',
                    description: 'Visualize |S(alpha_r)|^2 at well-spaced points alpha_r. The bars show energy at each evaluation point. The horizontal line is the large sieve bound. Adjust N and spacing.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, { width: 580, height: 360, originX: 60, originY: 310, scale: 1 });

                        var N = 12;
                        var R = 8;
                        var animT = 0;
                        var animId = null;

                        VizEngine.createSlider(controls, 'N (terms)', 4, 30, N, 1, function(v) { N = Math.round(v); });
                        VizEngine.createSlider(controls, 'R (points)', 2, 16, R, 1, function(v) { R = Math.round(v); });

                        function computeEnergy() {
                            var alphas = [];
                            var delta = 1 / (R + 1);
                            for (var r = 0; r < R; r++) {
                                alphas.push((r + 0.5) * delta + 0.05 * Math.sin(r * 1.7 + animT));
                            }

                            // Random-ish coefficients seeded by N
                            var an = [];
                            for (var n = 0; n < N; n++) {
                                var seed = n * 0.7391 + N * 0.3183;
                                an.push([Math.cos(seed * 6.28), Math.sin(seed * 4.71)]);
                            }
                            var coefEnergy = an.reduce(function(s, c) { return s + c[0]*c[0] + c[1]*c[1]; }, 0);

                            var energies = [];
                            for (var ri = 0; ri < R; ri++) {
                                var re = 0, im = 0;
                                for (var ni = 0; ni < N; ni++) {
                                    var phase = 2 * Math.PI * (ni + 1) * alphas[ri];
                                    re += an[ni][0] * Math.cos(phase) - an[ni][1] * Math.sin(phase);
                                    im += an[ni][0] * Math.sin(phase) + an[ni][1] * Math.cos(phase);
                                }
                                energies.push(re * re + im * im);
                            }

                            return { alphas: alphas, energies: energies, coefEnergy: coefEnergy, delta: delta };
                        }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            animT += 0.008;

                            var res = computeEnergy();
                            var bound = (N + 1 / res.delta) * res.coefEnergy;
                            var totalE = res.energies.reduce(function(a, b) { return a + b; }, 0);
                            var maxE = Math.max(bound, totalE, 1);

                            var chartH = 260;
                            var barW = Math.min(36, Math.floor(480 / R));
                            var gap = 4;
                            var startX = 60;

                            // Bound line
                            var boundY = viz.originY - (bound / maxE) * chartH;
                            ctx.strokeStyle = viz.colors.green;
                            ctx.lineWidth = 2;
                            ctx.setLineDash([6, 4]);
                            ctx.beginPath();
                            ctx.moveTo(40, boundY);
                            ctx.lineTo(viz.width - 10, boundY);
                            ctx.stroke();
                            ctx.setLineDash([]);
                            viz.screenText('LS bound', viz.width - 12, boundY - 8, viz.colors.green, 10, 'right');

                            // Total energy
                            var totalY = viz.originY - (totalE / maxE) * chartH;
                            ctx.strokeStyle = viz.colors.blue;
                            ctx.lineWidth = 2;
                            ctx.beginPath();
                            ctx.moveTo(40, totalY);
                            ctx.lineTo(viz.width - 10, totalY);
                            ctx.stroke();
                            viz.screenText('\u03a3|S(\u03b1r)|^2', viz.width - 12, totalY - 8, viz.colors.blue, 10, 'right');

                            // Energy bars
                            for (var r = 0; r < R; r++) {
                                var e = res.energies[r];
                                var h = (e / maxE) * chartH;
                                var xPos = startX + r * (barW + gap);
                                var t = e / maxE;
                                var r1 = Math.round(88 + 167 * t), g1 = Math.round(166 - 100 * t), b1 = Math.round(255 - 200 * t);
                                ctx.fillStyle = 'rgba(' + r1 + ',' + g1 + ',' + b1 + ',0.85)';
                                ctx.fillRect(xPos, viz.originY - h, barW, h);
                                ctx.fillStyle = viz.colors.text;
                                ctx.font = '9px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.fillText('\u03b1' + (r+1), xPos + barW / 2, viz.originY + 12);
                            }

                            // Axis
                            ctx.strokeStyle = viz.colors.axis;
                            ctx.lineWidth = 1.5;
                            ctx.beginPath();
                            ctx.moveTo(40, viz.originY);
                            ctx.lineTo(viz.width - 10, viz.originY);
                            ctx.stroke();

                            viz.screenText('N=' + N + '  R=' + R + '  \u03b4\u22481/' + (R+1), viz.width / 2, 18, viz.colors.white, 13);
                            viz.screenText('Sum energy: ' + totalE.toFixed(1) + '  Bound: ' + bound.toFixed(1), viz.width / 2, viz.originY + 28, viz.colors.text, 11);

                            animId = requestAnimationFrame(draw);
                        }

                        draw();
                        return {
                            canvas: viz.canvas,
                            stopAnimation: function() { if (animId) cancelAnimationFrame(animId); }
                        };
                    }
                }
            ],
            exercises: [
                {
                    question: 'Show that the large sieve bound \\((N + \\delta^{-1})\\sum|a_n|^2\\) is tight for \\(R = 1\\) and a suitable choice of \\(a_n\\) and \\(\\alpha_1\\).',
                    hint: 'Take \\(\\alpha_1 = 0\\) and all \\(a_n = 1/\\sqrt{N}\\). Compute \\(|S(0)|^2\\) and compare with the bound.',
                    solution: 'With \\(\\alpha_1 = 0\\), \\(S(0) = \\sum_n a_n\\). Taking \\(a_n = 1/\\sqrt{N}\\) gives \\(|S(0)|^2 = N\\) and \\(\\sum |a_n|^2 = 1\\). The bound is \\((N + \\delta^{-1}) \\cdot 1 \\ge N\\), achieved with equality when \\(\\delta = 1/N\\). For a single point, \\(\\delta\\) is unconstrained, so we may take \\(\\delta = 1/N\\) to get \\(2N \\ge N\\).'
                }
            ]
        },

        // ================================================================
        // SECTION 3: Multiplicative Large Sieve
        // ================================================================
        {
            id: 'sec-multiplicative-ls',
            title: 'Multiplicative Large Sieve',
            content: `
<h2>Multiplicative Large Sieve</h2>

<p>The additive large sieve becomes most powerful when the evaluation points are the <em>Farey fractions</em>:
rational numbers \\(a/q\\) with \\((a,q) = 1\\) and \\(q \\le Q\\). These are the natural points for
connecting additive exponential sums to multiplicative characters.</p>

<h3>Farey Points and Their Spacing</h3>

<p>The Farey sequence \\(\\mathcal{F}_Q\\) consists of all fractions \\(a/q\\) with \\(0 \\le a/q \\le 1\\),
\\((a,q)=1\\), \\(q \\le Q\\), arranged in increasing order. Key fact: consecutive Farey fractions \\(a/q\\) and \\(a'/q'\\)
satisfy \\(|a/q - a'/q'| = 1/(qq')\\).</p>

<p>Thus any two distinct Farey fractions \\(a/q \\ne a'/q'\\) with \\(q, q' \\le Q\\) satisfy</p>
\\[
\\left\\| \\frac{a}{q} - \\frac{a'}{q'} \\right\\| \\ge \\frac{1}{q q'} \\ge \\frac{1}{Q^2}.
\\]
<p>So the \\(\\sum_{q \\le Q} \\phi(q)\\) Farey fractions are \\(\\delta = Q^{-2}\\)-spaced.</p>

<h3>The Multiplicative Large Sieve</h3>

<p>Applying Theorem 13.2 with these points and \\(\\delta = 1/Q^2\\) gives:</p>

<div class="env-block theorem">
    <div class="env-title">Theorem 13.4 (Multiplicative Large Sieve)</div>
    <div class="env-body">
        <p>For any complex numbers \\(a_n\\) with \\(M < n \\le M + N\\),</p>
        \\[
        \\sum_{q \\le Q} \\sum_{\\substack{a=1 \\\\ (a,q)=1}}^{q}
        \\left| \\sum_{n=M+1}^{M+N} a_n e\\!\\left(\\frac{an}{q}\\right) \\right|^2 \\le (N + Q^2) \\sum_{n=M+1}^{M+N} |a_n|^2.
        \\]
    </div>
</div>

<h3>Character Sum Formulation</h3>

<p>By orthogonality of Dirichlet characters, the exponential sums \\(\\sum_n a_n e(an/q)\\) are essentially
Fourier coefficients of \\(a_n\\) over the group \\((\\mathbb{Z}/q\\mathbb{Z})^*\\). Specifically, for
\\(a_n = \\Lambda(n)\\) (the von Mangoldt function), the sum \\(\\sum_{n \\le N} \\Lambda(n) e(an/q)\\)
decomposes as</p>
\\[
\\sum_{n \\le N} \\Lambda(n) e\\!\\left(\\frac{an}{q}\\right) = \\frac{1}{\\phi(q)} \\sum_{\\chi \\bmod q} \\bar{\\chi}(a) \\sum_{n \\le N} \\Lambda(n) \\chi(n).
\\]

<p>This connects to \\(\\psi(N, \\chi) = \\sum_{n \\le N} \\Lambda(n)\\chi(n)\\), whose size is controlled by the
zeros of \\(L(s, \\chi)\\). The large sieve gives an <em>averaged</em> bound over all \\(\\chi\\) of conductor
\\(\\le Q\\):</p>

<div class="env-block theorem">
    <div class="env-title">Corollary 13.5 (Large Sieve for Characters)</div>
    <div class="env-body">
        \\[
        \\sum_{q \\le Q} \\frac{q}{\\phi(q)} \\sum_{\\chi \\bmod q}^{*} |\\psi(N,\\chi)|^2 \\ll (N + Q^2) N,
        \\]
        <p>where \\(\\sum^*\\) denotes a sum over primitive characters.</p>
    </div>
</div>

<div class="env-block remark">
    <div class="env-title">The \\(N + Q^2\\) Threshold</div>
    <div class="env-body">
        <p>The factor \\(N + Q^2\\) shows a phase transition. When \\(Q \\ll N^{1/2}\\), the bound is \\(\\ll N^2\\),
        which is what we want. When \\(Q \\gg N^{1/2}\\), the \\(Q^2\\) dominates and the bound deteriorates.
        This is why the BV theorem is limited to \\(Q \\le x^{1/2}\\): it is a fundamental barrier of the method.</p>
    </div>
</div>
`,
            visualizations: [
                {
                    id: 'viz-farey-circle',
                    title: 'Farey Fractions on the Unit Circle',
                    description: 'Farey fractions a/q with q <= Q mapped as angles 2*pi*a/q on the unit circle. Animate Q to watch the circle fill up. Well-spacing is visible as gaps between adjacent fractions.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, { width: 520, height: 400, originX: 260, originY: 200, scale: 90 });

                        var Q = 4;
                        var animating = false;
                        var animQ = 1;
                        var animId = null;

                        VizEngine.createSlider(controls, 'Q', 1, 20, Q, 1, function(v) { Q = Math.round(v); draw(); });
                        VizEngine.createButton(controls, 'Animate Q', function() {
                            if (animating) { animating = false; if (animId) cancelAnimationFrame(animId); return; }
                            animating = true; animQ = 1;
                            function step() {
                                if (!animating) return;
                                Q = animQ;
                                draw();
                                animQ = animQ >= 20 ? 1 : animQ + 1;
                                animId = setTimeout(function() { requestAnimationFrame(step); }, 400);
                            }
                            step();
                        });

                        function getFareyFractions(Qval) {
                            var fracs = [];
                            for (var q = 1; q <= Qval; q++) {
                                for (var a = 0; a < q; a++) {
                                    if (gcd(a, q) === 1 || a === 0 && q === 1) {
                                        fracs.push({ a: a, q: q, val: a / q });
                                    }
                                }
                            }
                            fracs.sort(function(x, y) { return x.val - y.val; });
                            return fracs;
                        }

                        function gcd(a, b) { return b === 0 ? a : gcd(b, a % b); }

                        var palette = ['#58a6ff','#3fb9a0','#f0883e','#bc8cff','#f778ba','#3fb950','#d29922','#f85149'];

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            // Unit circle
                            ctx.strokeStyle = viz.colors.axis;
                            ctx.lineWidth = 1;
                            ctx.beginPath();
                            ctx.arc(viz.originX, viz.originY, 90, 0, Math.PI * 2);
                            ctx.stroke();

                            var fracs = getFareyFractions(Q);

                            fracs.forEach(function(f) {
                                if (f.a === 0 && f.q === 1) {
                                    // skip origin fraction for clarity
                                }
                                var angle = 2 * Math.PI * f.val - Math.PI / 2;
                                var r = 90;
                                var px = viz.originX + r * Math.cos(angle);
                                var py = viz.originY + r * Math.sin(angle);

                                var color = palette[(f.q - 1) % palette.length];
                                ctx.fillStyle = color;
                                ctx.beginPath();
                                ctx.arc(px, py, Math.max(2, 6 - f.q * 0.2), 0, Math.PI * 2);
                                ctx.fill();

                                if (Q <= 8 && f.q <= 5) {
                                    var lx = viz.originX + (r + 18) * Math.cos(angle);
                                    var ly = viz.originY + (r + 18) * Math.sin(angle);
                                    ctx.fillStyle = color;
                                    ctx.font = '9px -apple-system,sans-serif';
                                    ctx.textAlign = 'center';
                                    ctx.textBaseline = 'middle';
                                    ctx.fillText(f.a + '/' + f.q, lx, ly);
                                }
                            });

                            // Min spacing indicator
                            var minSpacing = fracs.length > 1 ? Infinity : 0;
                            for (var i = 1; i < fracs.length; i++) {
                                var d = fracs[i].val - fracs[i-1].val;
                                if (d < minSpacing) minSpacing = d;
                            }

                            viz.screenText('Q = ' + Q, viz.width / 2, 20, viz.colors.white, 16, 'center');
                            viz.screenText('|F_Q| = ' + fracs.length + ' fractions', viz.width / 2, 370, viz.colors.text, 12, 'center');
                            viz.screenText('\u03b4 \u2265 1/Q\u00b2 = 1/' + (Q*Q), viz.width / 2, 385, viz.colors.teal, 11, 'center');

                            // Color legend for small Q
                            if (Q <= 10) {
                                for (var q = 1; q <= Math.min(Q, 6); q++) {
                                    ctx.fillStyle = palette[(q-1) % palette.length];
                                    ctx.font = '10px -apple-system,sans-serif';
                                    ctx.textAlign = 'left';
                                    ctx.textBaseline = 'middle';
                                    ctx.fillRect(8, 30 + (q-1) * 16, 10, 10);
                                    ctx.fillText('q=' + q, 22, 35 + (q-1) * 16);
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
                    question: 'Verify that any two distinct Farey fractions \\(a/q\\) and \\(a\'/q\'\\) with \\(q, q\' \\le Q\\) satisfy \\(\\|a/q - a\'/q\'\\| \\ge 1/(qq\') \\ge 1/Q^2\\).',
                    hint: 'For distinct fractions, \\(|aq\' - a\'q| \\ge 1\\). Divide by \\(qq\'\\).',
                    solution: 'Since \\(a/q \\ne a\'/q\'\\), we have \\(aq\' - a\'q \\ne 0\\), so \\(|aq\' - a\'q| \\ge 1\\). Therefore \\(|a/q - a\'/q\'| = |aq\' - a\'q|/(qq\') \\ge 1/(qq\') \\ge 1/Q^2\\). The circle distance \\(\\|\\cdot\\|\\) only makes this larger.'
                },
            ]
        },

        // ================================================================
        // SECTION 4: Bombieri-Vinogradov Theorem
        // ================================================================
        {
            id: 'sec-bv-theorem',
            title: 'Bombieri-Vinogradov Theorem',
            content: `
<h2>Bombieri-Vinogradov Theorem</h2>

<h3>The Route from Large Sieve to BV</h3>

<p>We now show how the multiplicative large sieve implies Bombieri-Vinogradov. The argument has three steps:</p>

<ol>
<li><strong>Character sum decomposition.</strong> Express the error \\(E(x,q,a) = \\psi(x;q,a) - x/\\phi(q)\\)
in terms of character sums \\(\\psi(x,\\chi)\\) via the orthogonality of Dirichlet characters.</li>
<li><strong>Zero-detecting sum.</strong> Bound \\(|\\psi(x,\\chi)|\\) using the explicit formula for \\(L(s,\\chi)\\),
reducing to a sum over zeros \\(\\rho\\) of \\(L(s,\\chi)\\).</li>
<li><strong>Large sieve averaging.</strong> Sum over \\(q \\le Q\\) and all characters \\(\\chi \\bmod q\\); the
large sieve bounds the total.</li>
</ol>

<h3>Step 1: Character Decomposition</h3>

<p>By orthogonality,</p>
\\[
\\psi(x; q, a) = \\frac{1}{\\phi(q)} \\sum_{\\chi \\bmod q} \\bar{\\chi}(a) \\psi(x, \\chi),
\\]
<p>where \\(\\psi(x, \\chi) = \\sum_{n \\le x} \\Lambda(n) \\chi(n)\\). For the principal character \\(\\chi_0\\),
\\(\\psi(x, \\chi_0) = \\psi(x) + O(\\log x)\\), so the main term \\(x/\\phi(q)\\) cancels. Thus</p>
\\[
E(x, q, a) = \\frac{1}{\\phi(q)} \\sum_{\\chi \\ne \\chi_0} \\bar{\\chi}(a) \\psi(x, \\chi) + O(\\log x).
\\]

<h3>Step 2: Zero-Detecting Bound</h3>

<p>From the explicit formula (Chapter 8), for \\(T = x^{1/2}\\):</p>
\\[
\\psi(x, \\chi) = -\\sum_{|\\mathrm{Im}(\\rho)| \\le T} \\frac{x^\\rho}{\\rho} + O\\!\\left(\\frac{x \\log^2(qx)}{T}\\right).
\\]

<p>The key bound is: for any \\(\\epsilon > 0\\) and \\(\\chi\\) primitive mod \\(q\\),</p>
\\[
|\\psi(x, \\chi)| \\ll x^{1/2} \\log^2(qx) \\cdot N(\\sigma_0, T, \\chi)^{1/2} + \\cdots
\\]
<p>where \\(N(\\sigma, T, \\chi)\\) counts zeros with real part \\(> \\sigma\\) and imaginary part \\(\\le T\\).
The <strong>zero-density estimates</strong> (bounding \\(N\\) for \\(\\sigma > 1/2\\)) then feed into the sum.</p>

<h3>Step 3: The Siegel-Walfisz Supplement</h3>

<p>For small \\(q\\) (\\(q \\le (\\log x)^{2B}\\)), one uses the Siegel-Walfisz theorem: for any \\(A\\),</p>
\\[
\\psi(x; q, a) = \\frac{x}{\\phi(q)} + O_A\\left(\\frac{x}{(\\log x)^A}\\right) \\quad \\text{uniformly in } q \\le (\\log x)^A.
\\]

<p>For large \\(q\\) (\\((\\log x)^{2B} < q \\le Q\\)), the large sieve handles the sum. Combining:</p>

<div class="env-block theorem">
    <div class="env-title">Theorem 13.1 (Bombieri-Vinogradov, Restated)</div>
    <div class="env-body">
        <p>For any \\(A > 0\\), with \\(Q = x^{1/2}(\\log x)^{-B}\\) (\\(B = B(A)\\) sufficiently large),</p>
        \\[
        \\sum_{q \\le Q} \\max_{y \\le x} \\max_{(a,q)=1} \\left| \\psi(y; q, a) - \\frac{y}{\\phi(q)} \\right| \\ll_A \\frac{x}{(\\log x)^A}.
        \\]
    </div>
</div>

<h3>The Elliott-Halberstam Conjecture</h3>

<p>Can we push \\(Q\\) beyond \\(x^{1/2}\\)? The Elliott-Halberstam conjecture (1968) asserts that the BV conclusion holds for all \\(Q = x^{1-\\epsilon}\\). This is completely open. The \\(x^{1/2}\\) barrier of BV is a genuine obstacle of current methods, not an artifact.</p>

<p>Goldston-Pintz-Yildirim (2005) and Zhang (2013) showed that even a small improvement \\(Q = x^{1/2+\\delta}\\) for tiny \\(\\delta > 0\\) would yield strong results on prime gaps. Zhang proved bounded gaps using a modified BV-type estimate with additional structure (Cauchy-Schwarz over smooth moduli).</p>
`,
            visualizations: [
                {
                    id: 'viz-bv-histogram',
                    title: 'BV Error Terms: Histogram by Modulus',
                    description: 'For each modulus q, display max_a |psi(x;q,a) - x/phi(q)| (estimated). The BV theorem says the sum of these bars is small. Watch the distribution shift as x grows.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, { width: 580, height: 360, originX: 60, originY: 310, scale: 1 });

                        var logX = 10;
                        VizEngine.createSlider(controls, 'log\u2082(x)', 6, 18, logX, 0.5, function(v) { logX = v; draw(); });

                        function pseudoError(q, x) {
                            // Heuristic: error ~ sqrt(x)/phi(q) * log(x) * (random-ish factor from q)
                            var seed = (q * 0.6180339 + Math.floor(logX)) % 1;
                            var randf = 0.5 + 0.5 * Math.abs(Math.sin(seed * 37.1 + q * 1.3));
                            return Math.sqrt(x) * Math.log(Math.log(x) + 1) * randf / Math.sqrt(q);
                        }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var x = Math.pow(2, logX);
                            var sqrtX = Math.sqrt(x);
                            var logXv = Math.log(x);
                            var Q = Math.max(4, Math.floor(sqrtX / (logXv * logXv)));
                            Q = Math.min(Q, 40);

                            var errors = [];
                            var maxErr = 0;
                            var totalErr = 0;
                            for (var q = 1; q <= Q; q++) {
                                var e = pseudoError(q, x);
                                errors.push(e);
                                if (e > maxErr) maxErr = e;
                                totalErr += e;
                            }
                            var bvBound = x / (logXv * logXv);

                            var chartH = 260;
                            var barW = Math.max(6, Math.floor(480 / Q));
                            var startX = 65;

                            // BV bound line (total)
                            // Draw as proportion of total
                            var totalMaxScale = Math.max(totalErr, bvBound, 1);

                            // Individual bars
                            for (var i = 0; i < Q; i++) {
                                var h = (errors[i] / maxErr) * chartH * 0.85;
                                var xPos = startX + i * (barW + 2);
                                var frac = errors[i] / maxErr;
                                var rr = Math.round(88 + 100 * frac), gg = Math.round(166 - 100 * frac), bb = Math.round(255 - 200 * frac);
                                ctx.fillStyle = 'rgba(' + rr + ',' + gg + ',' + bb + ',0.85)';
                                ctx.fillRect(xPos, viz.originY - h, barW, h);
                                if (Q <= 20) {
                                    ctx.fillStyle = viz.colors.text;
                                    ctx.font = '8px -apple-system,sans-serif';
                                    ctx.textAlign = 'center';
                                    ctx.fillText(i + 1, xPos + barW / 2, viz.originY + 10);
                                }
                            }

                            // Axis
                            ctx.strokeStyle = viz.colors.axis;
                            ctx.lineWidth = 1.5;
                            ctx.beginPath();
                            ctx.moveTo(50, viz.originY);
                            ctx.lineTo(viz.width - 10, viz.originY);
                            ctx.stroke();

                            // Label
                            viz.screenText('Max\u2090 |\u03c8(x;q,a) - x/\u03d5(q)|  for q = 1 to ' + Q, viz.width / 2, 20, viz.colors.white, 13);
                            viz.screenText('x = 2^' + logX.toFixed(1) + '   Q \u2248 x^{1/2}/(log x)^2 = ' + Q, viz.width / 2, viz.originY + 25, viz.colors.text, 11);
                            viz.screenText('Sum of bars \u226a x/(log x)^A  (BV)', viz.width / 2, viz.originY + 40, viz.colors.green, 11);
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'What is the Elliott-Halberstam conjecture (EH), and why would EH with exponent \\(\\theta > 1/2\\) be useful for primes in progressions?',
                    hint: 'EH conjectures the BV bound holds for \\(Q = x^\\theta\\) for any \\(\\theta < 1\\).',
                    solution: 'EH(\\(\\theta\\)): \\(\\sum_{q \\le x^\\theta} \\max_{(a,q)=1}|\\psi(x;q,a) - x/\\phi(q)| \\ll_A x/(\\log x)^A\\). For \\(\\theta > 1/2\\), this would extend BV into a range inaccessible by current methods. Goldston-Pintz-Yildirim showed that EH(\\(1/2 + \\epsilon\\)) implies infinitely many prime pairs differing by at most a bounded constant. Zhang\'s 2013 breakthrough proved a weak substitute (BV over smooth moduli) to get the first explicit bounded gap of \\(70{,}000{,}000\\).'
                },
            ]
        },

        // ================================================================
        // SECTION 5: Applications
        // ================================================================
        {
            id: 'sec-applications',
            title: 'Applications',
            content: `
<h2>Applications</h2>

<p>The Bombieri-Vinogradov theorem is a workhorse of analytic number theory. Here we illustrate two
landmark applications: the Brun-Titchmarsh theorem improvement and the setup for Chen's theorem.</p>

<h3>Application 1: Primes in Short Arithmetic Progressions</h3>

<p>From BV, we can immediately derive: for almost all \\(q \\le x^{1/2}\\) and all \\((a,q) = 1\\),</p>
\\[
\\pi(x; q, a) \\sim \\frac{\\pi(x)}{\\phi(q)}.
\\]

<p>More precisely, BV implies that for any \\(A > 0\\), the set of "bad" moduli \\(q \\le Q\\) (where the
error \\(|E(x,q,a)|\\) exceeds \\(x^{1/2} (\\log x)^{-A}\\)) has total count at most \\((\\log x)^{B}\\). This
is far stronger than what an individual L-function zero-free region gives.</p>

<h3>Application 2: The Titchmarsh Divisor Problem</h3>

<p>The Titchmarsh divisor problem asks for the average of \\(d(n+1)\\) (number of divisors) over primes \\(n \\le x\\).
BV gives:</p>
\\[
\\sum_{p \\le x} d(p+1) \\sim C x \\quad (x \\to \\infty)
\\]
<p>with an explicit constant \\(C\\). This requires controlling \\(\\pi(x; q, a)\\) for many progressions
simultaneously, exactly what BV provides.</p>

<h3>Application 3: Chen's Theorem Setup</h3>

<p>Chen Jingrun (1973) proved that every sufficiently large even number is the sum of a prime and a
<em>semiprime</em> (product of at most two primes). This is the best result towards Goldbach's conjecture
(every even number = sum of two primes).</p>

<p>Chen's theorem requires estimating</p>
\\[
S(\\mathcal{A}, z) = \\sum_{\\substack{p \\le x \\\\ p + 2 = P_2}} 1,
\\]
<p>where \\(P_2\\) denotes an integer with at most 2 prime factors. The sieve (Chapter 12) reduces this to
understanding \\(\\sum_{q \\le Q} |\\pi(x; q, a) - \\pi(x)/\\phi(q)|\\) for progressions that arise in the
sieve remainder. BV with \\(Q = x^{1/2}(\\log x)^{-B}\\) makes the remainder negligible.</p>

<div class="env-block theorem">
    <div class="env-title">Theorem 13.6 (Chen 1973)</div>
    <div class="env-body">
        <p>Every sufficiently large even integer \\(N\\) can be written as \\(N = p + m\\) where \\(p\\) is prime
        and \\(m\\) has at most two prime factors.</p>
    </div>
</div>

<p>The key ideas in the proof are:</p>
<ul>
    <li>Selberg's sieve (Chapter 12) to count the main term.</li>
    <li>BV to control the remainder terms \\(R_d\\) in the sieve.</li>
    <li>Buchstab's identity to shift between "\\(P_2\\)" and "almost prime."</li>
    <li>A switching principle to handle the bilinear structure.</li>
</ul>

<h3>Goldbach-Type Applications</h3>

<p>BV also underpins the proof that almost all even integers are Goldbach sums (Vinogradov's three-prime
theorem covers odd numbers; BV handles the averaged version for even numbers up to \\(x\\)). Specifically,
the number of even integers \\(\\le x\\) that are <em>not</em> expressible as \\(p_1 + p_2\\) is \\(o(x)\\).</p>
`,
            visualizations: [
                {
                    id: 'viz-chen-setup',
                    title: "Chen's Theorem: Sieve + BV Interaction",
                    description: "Illustrate the sieve levels in Chen's theorem. Level 0: all integers near N. Level 1: after removing multiples of small primes (sieve). Level 2: remainder controlled by BV. Adjust N.",
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, { width: 580, height: 380, originX: 40, originY: 60, scale: 1 });

                        var N = 100;
                        VizEngine.createSlider(controls, 'N (even)', 20, 200, N, 2, function(v) { N = Math.round(v / 2) * 2; draw(); });

                        function isPrime(n) {
                            if (n < 2) return false;
                            for (var i = 2; i <= Math.sqrt(n); i++) if (n % i === 0) return false;
                            return true;
                        }
                        function primeFactorCount(n) {
                            var count = 0;
                            var d = 2;
                            while (d * d <= n) {
                                while (n % d === 0) { count++; n /= d; }
                                d++;
                            }
                            if (n > 1) count++;
                            return count;
                        }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            var pairs = [];
                            for (var p = 2; p < N; p++) {
                                if (isPrime(p)) {
                                    var m = N - p;
                                    if (m >= 2) {
                                        pairs.push({ p: p, m: m, omega: primeFactorCount(m) });
                                    }
                                }
                            }

                            var goldbach = pairs.filter(function(x) { return x.omega === 1; });
                            var chen = pairs.filter(function(x) { return x.omega <= 2; });
                            var rest = pairs.filter(function(x) { return x.omega >= 3; });

                            // Header
                            viz.screenText('N = ' + N + ' = p + m', viz.width / 2, 20, viz.colors.white, 15, 'center');
                            viz.screenText('Representations N = p + m for prime p', viz.width / 2, 38, viz.colors.text, 11, 'center');

                            var dotR = 5;
                            var cols = Math.floor((viz.width - 60) / (dotR * 2 + 4));
                            var allPairs = goldbach.concat(chen.filter(function(x) { return x.omega === 2; })).concat(rest);

                            allPairs.forEach(function(pair, i) {
                                var col = i % cols;
                                var row = Math.floor(i / cols);
                                var px = 40 + col * (dotR * 2 + 4) + dotR;
                                var py = 70 + row * (dotR * 2 + 6) + dotR;

                                var color;
                                if (pair.omega === 1) color = viz.colors.green;
                                else if (pair.omega === 2) color = viz.colors.blue;
                                else color = viz.colors.red + '88';

                                ctx.fillStyle = color;
                                ctx.beginPath();
                                ctx.arc(px, py, dotR, 0, Math.PI * 2);
                                ctx.fill();
                            });

                            // Legend
                            var ly = viz.height - 60;
                            ctx.fillStyle = viz.colors.green;
                            ctx.beginPath(); ctx.arc(50, ly, 6, 0, Math.PI * 2); ctx.fill();
                            ctx.fillStyle = viz.colors.white; ctx.font = '11px -apple-system,sans-serif'; ctx.textAlign = 'left';
                            ctx.fillText('m prime (Goldbach): ' + goldbach.length, 62, ly + 4);

                            ctx.fillStyle = viz.colors.blue;
                            ctx.beginPath(); ctx.arc(50, ly + 20, 6, 0, Math.PI * 2); ctx.fill();
                            ctx.fillText('m = p1*p2 (Chen P2): ' + chen.filter(function(x){return x.omega===2;}).length, 62, ly + 24);

                            ctx.fillStyle = viz.colors.red + '88';
                            ctx.beginPath(); ctx.arc(50, ly + 40, 6, 0, Math.PI * 2); ctx.fill();
                            ctx.fillText('\u03a9(m) \u2265 3 (sieved out): ' + rest.length, 62, ly + 44);
                        }

                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: "State Chen's theorem precisely and explain why it is stronger than Goldbach's conjecture but weaker than a full proof.",
                    hint: 'Goldbach says p + q = N with both prime. Chen allows one factor to be semiprime.',
                    solution: "Chen's theorem: every sufficiently large even integer N = p + P_2 where p is prime and P_2 has at most 2 prime factors (P_2 is either prime or a product of two primes). This is one step from Goldbach (N = p + q, two primes), but in Chen's result P_2 may be composite. The key advance is that sieve methods can control the count of P_2's using BV, whereas proving P_2 is always prime would require controlling the sieve remainder far more precisely than current methods allow."
                },
                {
                    question: "What is Vinogradov's three-prime theorem, and how does it relate to BV?",
                    hint: 'Vinogradov proved every large odd number is a sum of three primes, using the circle method.',
                    solution: "Vinogradov (1937): every sufficiently large odd integer N = p1 + p2 + p3. The proof uses Hardy-Littlewood's circle method (Chapter 15). The major arcs near Farey fractions a/q contribute the main term; the minor arcs are estimated by exponential sum bounds. The large sieve enters when bounding contributions from characters of small conductor. Unlike Chen's theorem, Vinogradov's theorem does not need BV directly, but the structure is parallel: major arc = arithmetic progression main term, minor arc = sieve remainder."
                }
            ]
        },

        // ================================================================
        // SECTION 6: Bridge to Exponential Sums
        // ================================================================
        {
            id: 'sec-bridge',
            title: 'Exponential Sums',
            content: `
<h2>Exponential Sums: The Bridge</h2>

<p>The large sieve is fundamentally an estimate about exponential sums \\(S(\\alpha) = \\sum_n a_n e(n\\alpha)\\).
This section introduces the broader landscape of exponential sums and their role in analytic number theory,
bridging to Chapter 14.</p>

<h3>Why Exponential Sums?</h3>

<p>Many problems in number theory reduce to estimating sums of the form</p>
\\[
S = \\sum_{n=1}^{N} f(n) e(g(n))
\\]
<p>where \\(f\\) is an arithmetic function and \\(g\\) is a real-valued function. The oscillation of \\(e(g(n))\\)
causes cancellation, and the art is to quantify this cancellation.</p>

<p>Key examples:</p>
<ul>
<li><strong>Gauss sums:</strong> \\(\\tau(\\chi) = \\sum_{a \\bmod q} \\chi(a) e(a/q)\\). These are central
to the functional equation of \\(L(s,\\chi)\\).</li>
<li><strong>Kloosterman sums:</strong> \\(K(a,b;q) = \\sum_{n \\bmod q}^* e((an + b\\bar n)/q)\\). Weil proved
\\(|K(a,b;q)| \\le 2\\sqrt{q}\\), a crucial bound for many applications.</li>
<li><strong>Weyl sums:</strong> \\(W = \\sum_{n \\le N} e(\\alpha n^k)\\). Weyl's inequality bounds these,
giving equidistribution of \\(\\{n^k \\alpha\\}\\).</li>
</ul>

<h3>The Weyl-van der Corput Method</h3>

<p>For smooth functions \\(g\\), the key tool is the <strong>van der Corput method</strong>. The idea:
if \\(g''\\) is bounded and bounded away from zero, then</p>
\\[
\\left| \\sum_{n=M+1}^{M+N} e(g(n)) \\right| \\ll N (g'')^{1/2} + (g'')^{-1/2}.
\\]

<p>More precisely, if \\(\\lambda_2 \\le g''(n) \\le C\\lambda_2\\) throughout \\([M, M+N]\\), then</p>
\\[
\\left| \\sum_{n=M+1}^{M+N} e(g(n)) \\right| \\ll N \\lambda_2^{1/2} + \\lambda_2^{-1/2}.
\\]

<h3>Connection to the Large Sieve</h3>

<p>The large sieve can be viewed as an \\(L^2\\) version of van der Corput. While van der Corput bounds
a single exponential sum, the large sieve bounds a sum of \\(|\\cdot|^2\\) over many evaluation points
simultaneously. The duality argument in the large sieve proof mirrors the Cauchy-Schwarz step in
van der Corput.</p>

<p>The two methods are complementary:</p>

<div class="env-block remark">
    <div class="env-title">Large Sieve vs van der Corput</div>
    <div class="env-body">
        <ul>
        <li><strong>Large sieve:</strong> many points, averaged \\(L^2\\) bound, applies to arbitrary \\(a_n\\).</li>
        <li><strong>van der Corput:</strong> single sum, pointwise bound, requires smoothness of \\(g\\).</li>
        <li>For problems involving many moduli (BV, character sums), large sieve dominates.</li>
        <li>For problems involving a single oscillatory sum (Gauss circle, divisor problem), van der Corput dominates.</li>
        </ul>
    </div>
</div>

<h3>Exponential Pairs</h3>

<p>The van der Corput method has been systematized into the theory of <em>exponential pairs</em>: pairs
\\((k,l)\\) such that \\(|\\sum_{n \\sim N} e(f(n))| \\ll N^l \\lambda^k\\) under suitable conditions on \\(f'\\).
The classical pairs form a closed set under two operations (\\(A\\) and \\(B\\)), and the optimal pair (for
the Dirichlet divisor problem) is sought along the boundary of this set. Huxley's 2003 result
\\((k,l) = (131/416, 1/2 + 131/416)\\) currently gives the best bound for the divisor problem.</p>

<p>Chapter 14 develops the full van der Corput theory, Weyl differencing, and applications to the
Gauss circle problem and Riemann zeta function on the critical line.</p>
`,
            visualizations: [
                {
                    id: 'viz-well-spacing',
                    title: 'Well-Spacing and the Large Sieve Bound',
                    description: 'Drag the evaluation points alpha_1,...,alpha_R on [0,1). The large sieve bound (N + 1/delta) updates live. Pack points together to see how the bound blows up. The minimum spacing delta is displayed.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, { width: 580, height: 340, originX: 40, originY: 170, scale: 1 });

                        var N = 10;
                        VizEngine.createSlider(controls, 'N (coeff count)', 2, 30, N, 1, function(v) { N = Math.round(v); draw(); });

                        // Points stored as fractions of [0,1]
                        var pts = [0.1, 0.28, 0.47, 0.65, 0.83];

                        var lineY = 130; // pixel y for the [0,1] line
                        var lineX0 = 60, lineX1 = viz.width - 60;
                        var ptRadius = 10;

                        var dragging = -1;

                        function toScreen(t) { return lineX0 + t * (lineX1 - lineX0); }
                        function fromScreen(sx) { return Math.max(0.001, Math.min(0.999, (sx - lineX0) / (lineX1 - lineX0))); }

                        function getMinSpacing() {
                            var sorted = pts.slice().sort(function(a, b) { return a - b; });
                            var min = Infinity;
                            for (var i = 1; i < sorted.length; i++) {
                                min = Math.min(min, sorted[i] - sorted[i-1]);
                            }
                            // Circle: also check wrap-around
                            if (sorted.length > 1) {
                                min = Math.min(min, 1 - sorted[sorted.length-1] + sorted[0]);
                            }
                            return min;
                        }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            // Draw [0,1] line
                            ctx.strokeStyle = viz.colors.axis;
                            ctx.lineWidth = 2;
                            ctx.beginPath();
                            ctx.moveTo(lineX0, lineY);
                            ctx.lineTo(lineX1, lineY);
                            ctx.stroke();

                            // Tick marks
                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '10px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            for (var t = 0; t <= 10; t++) {
                                var tx = lineX0 + (t / 10) * (lineX1 - lineX0);
                                ctx.strokeStyle = viz.colors.grid;
                                ctx.lineWidth = 1;
                                ctx.beginPath(); ctx.moveTo(tx, lineY - 5); ctx.lineTo(tx, lineY + 5); ctx.stroke();
                                ctx.fillText((t / 10).toFixed(1), tx, lineY + 18);
                            }

                            // Spacing segments
                            var sorted = pts.slice().sort(function(a, b) { return a - b; });
                            var delta = getMinSpacing();
                            for (var i = 1; i < sorted.length; i++) {
                                var x1 = toScreen(sorted[i-1]), x2 = toScreen(sorted[i]);
                                ctx.strokeStyle = viz.colors.grid;
                                ctx.lineWidth = 1;
                                ctx.setLineDash([3, 3]);
                                ctx.beginPath(); ctx.moveTo(x1, lineY - 30); ctx.lineTo(x2, lineY - 30); ctx.stroke();
                                ctx.setLineDash([]);
                                if (sorted[i] - sorted[i-1] === delta) {
                                    ctx.strokeStyle = viz.colors.red;
                                    ctx.lineWidth = 2;
                                    ctx.beginPath(); ctx.moveTo(x1, lineY - 30); ctx.lineTo(x2, lineY - 30); ctx.stroke();
                                }
                            }

                            // Points
                            var colors2 = [viz.colors.blue, viz.colors.teal, viz.colors.orange, viz.colors.purple, viz.colors.pink, viz.colors.green];
                            pts.forEach(function(p, i) {
                                var px = toScreen(p);
                                ctx.fillStyle = colors2[i % colors2.length];
                                ctx.beginPath(); ctx.arc(px, lineY, ptRadius, 0, Math.PI * 2); ctx.fill();
                                ctx.fillStyle = viz.colors.white;
                                ctx.font = 'bold 9px -apple-system,sans-serif';
                                ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                                ctx.fillText('\u03b1' + (i+1), px, lineY);
                            });

                            // Large sieve bound
                            var bound = N + 1 / delta;
                            viz.screenText('N = ' + N + '   R = ' + pts.length + '   \u03b4 = ' + delta.toFixed(3), viz.width / 2, 20, viz.colors.white, 13, 'center');
                            viz.screenText('LS bound: N + 1/\u03b4 = ' + N + ' + ' + (1/delta).toFixed(1) + ' = ' + bound.toFixed(1), viz.width / 2, 200, viz.colors.green, 14, 'center');
                            viz.screenText('Min spacing \u03b4 (red segment)', viz.width / 2, 220, viz.colors.red, 11, 'center');
                            viz.screenText('Drag points to see bound change', viz.width / 2, 240, viz.colors.text, 11, 'center');

                            VizEngine.createButton;
                        }

                        // Mouse drag
                        viz.canvas.addEventListener('mousedown', function(e) {
                            var r = viz.canvas.getBoundingClientRect();
                            var mx = e.clientX - r.left;
                            var my = e.clientY - r.top;
                            for (var i = 0; i < pts.length; i++) {
                                var px = toScreen(pts[i]);
                                if (Math.abs(mx - px) < ptRadius + 4 && Math.abs(my - lineY) < ptRadius + 4) {
                                    dragging = i; break;
                                }
                            }
                        });
                        viz.canvas.addEventListener('mousemove', function(e) {
                            if (dragging < 0) return;
                            var r = viz.canvas.getBoundingClientRect();
                            pts[dragging] = fromScreen(e.clientX - r.left);
                            draw();
                        });
                        viz.canvas.addEventListener('mouseup', function() { dragging = -1; });
                        viz.canvas.addEventListener('mouseleave', function() { dragging = -1; });

                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'State van der Corput\'s second derivative test. If \\(g(n) = \\alpha n^2 + \\beta n\\) on \\([M, M+N]\\) with \\(|\\alpha| \\approx \\lambda\\), what bound does it give?',
                    hint: 'Second derivative: \\(g\'\'(n) = 2\\alpha\\), so \\(\\lambda_2 = 2|\\alpha|\\). Apply the formula \\(|S| \\ll N\\lambda_2^{1/2} + \\lambda_2^{-1/2}\\).',
                    solution: 'Van der Corput second derivative test: if \\(\\lambda_2 \\le |g\'\'(n)| \\le C\\lambda_2\\) on \\([M, M+N]\\), then \\(|\\sum_{n} e(g(n))| \\ll N\\lambda_2^{1/2} + \\lambda_2^{-1/2}\\). For \\(g(n) = \\alpha n^2 + \\beta n\\), \\(g\'\'(n) = 2\\alpha\\), \\(\\lambda_2 = 2|\\alpha|\\). Bound: \\(\\ll N|\\alpha|^{1/2} + |\\alpha|^{-1/2}\\). Optimal balance at \\(N = |\\alpha|^{-1}\\) (i.e., \\(\\lambda N^2 \\approx 1\\)), giving \\(|S| \\ll N^{1/2}\\). This matches the Weyl bound for quadratic exponential sums.'
                },
                {
                    question: 'Compute the Gauss sum \\(\\tau(\\chi) = \\sum_{a=0}^{q-1} \\chi(a) e(a/q)\\) for \\(\\chi\\) the Legendre symbol mod \\(p\\) (prime), and verify \\(|\\tau(\\chi)|^2 = p\\).',
                    hint: 'Compute \\(|\\tau|^2 = \\tau \\bar{\\tau}\\) by expanding and using the identity \\(\\sum_{a=1}^{p-1} e(na/p) = -1\\) for \\(p \\nmid n\\).',
                    solution: '\\(|\\tau(\\chi)|^2 = \\sum_{a,b=1}^{p-1} \\chi(a)\\overline{\\chi(b)} e((a-b)/p) = \\sum_{a=1}^{p-1} \\sum_{b=1}^{p-1} \\chi(ab^{-1}) e((a-b)/p)\\). Substituting \\(a = cb\\): \\(= \\sum_{c=1}^{p-1} \\chi(c) \\sum_{b=1}^{p-1} e(b(c-1)/p)\\). For \\(c \\ne 1\\), the inner sum \\(= -1\\); for \\(c = 1\\), it is \\(p-1\\). So \\(|\\tau|^2 = (p-1)\\chi(1) + (-1)\\sum_{c \\ne 1} \\chi(c) = (p-1) - \\sum_{c=1}^{p-1}\\chi(c) + \\chi(1) = p - 0 = p\\), using \\(\\sum_{c=1}^{p-1}\\chi(c) = 0\\) for non-principal \\(\\chi\\).'
                }
            ]
        }

    ] // end sections
}); // end chapter
