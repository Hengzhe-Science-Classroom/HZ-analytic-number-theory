window.CHAPTERS = window.CHAPTERS || [];
window.CHAPTERS.push({
    id: 'ch20',
    number: 20,
    title: 'Computational Analytic Number Theory',
    subtitle: 'Theory meets machine',
    sections: [
        // ================================================================
        // SECTION 1: Motivation — Why Compute?
        // ================================================================
        {
            id: 'sec-motivation',
            title: 'Why Compute?',
            content: `
<h2>Why Compute?</h2>

<div class="env-block intuition">
    <div class="env-title">Computation as a Telescope</div>
    <div class="env-body">
        <p>Mathematics is often imagined as pure thought, pen and paper. But analytic number theory has always been intertwined with large-scale calculation. Euler computed zeta values by hand. Riemann calculated the first few zeros of \\(\\zeta(s)\\) to formulate his hypothesis. Littlewood proved that \\(\\pi(x) - \\mathrm{li}(x)\\) changes sign, but could not exhibit an explicit crossover. Computation extends our mathematical senses, revealing structure that pure proof cannot yet explain.</p>
    </div>
</div>

<p>This chapter surveys the major computational problems of analytic number theory: evaluating the Riemann-Siegel formula for \\(\\zeta(1/2 + it)\\), verifying the Riemann Hypothesis for trillions of zeros, computing \\(\\pi(x)\\) for astronomically large \\(x\\), and testing primality of enormous numbers. These are not merely engineering feats; they provide evidence for (and occasionally against) deep conjectures, and the algorithms themselves reveal mathematical structure.</p>

<h3>Three Pillars</h3>

<p>Computational analytic number theory rests on three pillars:</p>

<ol>
    <li><strong>Evaluation:</strong> Computing number-theoretic functions (\\(\\zeta(s)\\), \\(\\pi(x)\\), \\(L(s, \\chi)\\)) to high precision.</li>
    <li><strong>Verification:</strong> Checking conjectures (RH, GRH, BSD) for vast ranges of parameters.</li>
    <li><strong>Discovery:</strong> Using computation to formulate new conjectures or find counterexamples.</li>
</ol>

<div class="env-block remark">
    <div class="env-title">Historical Milestones</div>
    <div class="env-body">
        <p><strong>1859:</strong> Riemann computed zeros of \\(\\zeta(s)\\) by hand, finding them all on the critical line. <strong>1903:</strong> Gram computed the first 15 zeros. <strong>1936:</strong> Titchmarsh and Comrie used a mechanical desk calculator to verify RH for the first 1041 zeros. <strong>1953:</strong> Turing used the Manchester Mark I to push to 1104 zeros. <strong>2004:</strong> Gourdon verified RH for the first \\(10^{13}\\) zeros. <strong>2020:</strong> Platt and Trudgian extended this to beyond \\(3 \\times 10^{12}\\) with rigorous error bounds.</p>
    </div>
</div>

<h3>The Interplay of Theory and Computation</h3>

<p>The relationship between proof and computation is symbiotic. Theory provides:</p>
<ul>
    <li><strong>Efficient algorithms:</strong> The Riemann-Siegel formula evaluates \\(\\zeta(1/2 + it)\\) in \\(O(t^{1/2})\\) operations, compared to \\(O(t)\\) for the definition. Without it, large-scale zero verification would be impossible.</li>
    <li><strong>Correctness guarantees:</strong> Turing's method (Section 3) proves that no zeros were missed, not merely that observed zeros lie on the critical line.</li>
    <li><strong>Complexity bounds:</strong> The AKS primality test (Section 5) shows that primality is in P, settling a fundamental question.</li>
</ul>

<p>Computation provides:</p>
<ul>
    <li><strong>Evidence:</strong> Verifying RH for \\(10^{13}\\) zeros is not a proof, but it is powerful evidence.</li>
    <li><strong>Counterexample hunting:</strong> The first counterexample to the Mertens conjecture (\\(|M(x)| \\leq \\sqrt{x}\\)) was found computationally (Odlyzko and te Riele, 1985), though indirectly.</li>
    <li><strong>Conjectures:</strong> Numerical patterns in zero spacings led to the Montgomery-Dyson connection with random matrix theory.</li>
</ul>

<div class="viz-placeholder" data-viz="viz-record-timeline"></div>
`,
            visualizations: [
                {
                    id: 'viz-record-timeline',
                    title: 'Milestones in Computational Number Theory',
                    description: 'A timeline of computational records: zeros of zeta verified, digits of \\(\\pi(x)\\) computed, and largest known primes.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 400,
                            originX: 0, originY: 0, scale: 1
                        });

                        var milestones = [
                            {year: 1859, label: 'Riemann: first zeros by hand', color: viz.colors.blue},
                            {year: 1903, label: 'Gram: 15 zeros', color: viz.colors.blue},
                            {year: 1936, label: 'Titchmarsh: 1041 zeros', color: viz.colors.blue},
                            {year: 1953, label: 'Turing: 1104 zeros (computer)', color: viz.colors.teal},
                            {year: 1968, label: 'Rosser+: 3.5M zeros', color: viz.colors.blue},
                            {year: 1979, label: 'Brent: 81M zeros', color: viz.colors.blue},
                            {year: 1985, label: 'Mertens conj. disproved', color: viz.colors.orange},
                            {year: 1986, label: 'van de Lune: 1.5B zeros', color: viz.colors.blue},
                            {year: 2002, label: 'AKS: primality in P', color: viz.colors.green},
                            {year: 2004, label: 'Gourdon: 10^13 zeros', color: viz.colors.purple},
                            {year: 2018, label: 'Mersenne prime M82589933', color: viz.colors.green},
                            {year: 2020, label: 'Platt-Trudgian: rigorous RH verification', color: viz.colors.pink}
                        ];

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var pad = 50;
                            var lineY = 200;
                            var yearMin = 1850;
                            var yearMax = 2030;

                            viz.screenText('Milestones in Computational Number Theory', viz.width / 2, 20, viz.colors.white, 14);

                            // Timeline axis
                            ctx.strokeStyle = viz.colors.axis;
                            ctx.lineWidth = 2;
                            ctx.beginPath();
                            ctx.moveTo(pad, lineY);
                            ctx.lineTo(viz.width - pad, lineY);
                            ctx.stroke();

                            // Decade ticks
                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '10px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'top';
                            for (var d = 1860; d <= 2020; d += 20) {
                                var dx = pad + (d - yearMin) / (yearMax - yearMin) * (viz.width - 2 * pad);
                                ctx.strokeStyle = viz.colors.grid;
                                ctx.lineWidth = 0.5;
                                ctx.beginPath(); ctx.moveTo(dx, lineY - 5); ctx.lineTo(dx, lineY + 5); ctx.stroke();
                                ctx.fillText(d.toString(), dx, lineY + 8);
                            }

                            // Milestones
                            for (var i = 0; i < milestones.length; i++) {
                                var m = milestones[i];
                                var mx = pad + (m.year - yearMin) / (yearMax - yearMin) * (viz.width - 2 * pad);
                                var above = (i % 2 === 0);
                                var stemH = 30 + (i % 3) * 20;
                                var my = above ? lineY - stemH : lineY + stemH;

                                // Stem
                                ctx.strokeStyle = m.color + '88';
                                ctx.lineWidth = 1;
                                ctx.beginPath();
                                ctx.moveTo(mx, lineY);
                                ctx.lineTo(mx, my);
                                ctx.stroke();

                                // Dot
                                ctx.fillStyle = m.color;
                                ctx.beginPath();
                                ctx.arc(mx, lineY, 4, 0, Math.PI * 2);
                                ctx.fill();

                                // Label
                                ctx.fillStyle = m.color;
                                ctx.font = '9px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.textBaseline = above ? 'bottom' : 'top';
                                // Wrap long labels
                                var words = m.label.split(' ');
                                var line1 = '';
                                var line2 = '';
                                for (var w = 0; w < words.length; w++) {
                                    if (line1.length < 18) line1 += (line1 ? ' ' : '') + words[w];
                                    else line2 += (line2 ? ' ' : '') + words[w];
                                }
                                if (above) {
                                    if (line2) {
                                        ctx.fillText(line1, mx, my - 10);
                                        ctx.fillText(line2, mx, my);
                                    } else {
                                        ctx.fillText(line1, mx, my);
                                    }
                                } else {
                                    ctx.fillText(line1, mx, my);
                                    if (line2) ctx.fillText(line2, mx, my + 12);
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
                    question: 'Explain why evaluating \\(\\zeta(1/2 + it)\\) from its definition \\(\\sum_{n=1}^{\\infty} n^{-s}\\) is impractical for large \\(t\\). What is the computational complexity, and why does convergence fail on the critical line?',
                    hint: 'The Dirichlet series \\(\\sum n^{-s}\\) only converges absolutely for \\(\\operatorname{Re}(s) > 1\\). On the critical line \\(\\sigma = 1/2\\), it does not converge at all.',
                    solution: 'The Dirichlet series \\(\\sum_{n=1}^{\\infty} n^{-s}\\) converges absolutely only for \\(\\operatorname{Re}(s) > 1\\). At \\(s = 1/2 + it\\), the terms \\(n^{-1/2 - it}\\) have magnitude \\(n^{-1/2}\\), so the series diverges. Even using approximate functional equations or smoothing, one needs \\(O(t)\\) terms for \\(O(1)\\) accuracy. The Riemann-Siegel formula reduces this to \\(O(\\sqrt{t})\\) terms, a square-root savings that makes computation feasible for \\(t \\sim 10^{13}\\).'
                }
            ]
        },

        // ================================================================
        // SECTION 2: The Riemann-Siegel Formula
        // ================================================================
        {
            id: 'sec-riemann-siegel',
            title: 'The Riemann-Siegel Formula',
            content: `
<h2>The Riemann-Siegel Formula</h2>

<div class="env-block intuition">
    <div class="env-title">The Key Idea</div>
    <div class="env-body">
        <p>To study zeros on the critical line \\(\\operatorname{Re}(s) = 1/2\\), we work with the Hardy function \\(Z(t)\\), a real-valued function whose sign changes correspond to zeros of \\(\\zeta(1/2 + it)\\). The Riemann-Siegel formula gives an efficient way to compute \\(Z(t)\\), requiring only \\(O(\\sqrt{t})\\) terms instead of \\(O(t)\\).</p>
    </div>
</div>

<h3>The Hardy Function</h3>

<p>Define the <em>Riemann-Siegel theta function</em>:</p>
\\[
\\theta(t) = \\arg\\left(\\pi^{-it/2} \\Gamma\\!\\left(\\frac{1/4 + it/2}{1}\\right)\\right) \\approx \\frac{t}{2}\\ln\\frac{t}{2\\pi e} - \\frac{\\pi}{8} + O(1/t).
\\]

<p>The <em>Hardy function</em> (or Hardy's \\(Z\\)-function) is:</p>
\\[
Z(t) = e^{i\\theta(t)} \\zeta(1/2 + it).
\\]

<div class="env-block theorem">
    <div class="env-title">Theorem 20.1 (Properties of Z(t))</div>
    <div class="env-body">
        <p>The function \\(Z(t)\\) satisfies:</p>
        <ol>
            <li>\\(Z(t)\\) is <strong>real-valued</strong> for real \\(t\\).</li>
            <li>\\(|Z(t)| = |\\zeta(1/2 + it)|\\).</li>
            <li>The zeros of \\(Z(t)\\) on the real line correspond exactly to zeros of \\(\\zeta(s)\\) on the critical line.</li>
            <li>Sign changes of \\(Z(t)\\) certify simple zeros on the critical line.</li>
        </ol>
    </div>
</div>

<h3>The Formula</h3>

<div class="env-block theorem">
    <div class="env-title">Theorem 20.2 (Riemann-Siegel Formula)</div>
    <div class="env-body">
        <p>Let \\(N = \\lfloor \\sqrt{t/(2\\pi)} \\rfloor\\). Then</p>
        \\[
        Z(t) = 2 \\sum_{n=1}^{N} \\frac{\\cos(\\theta(t) - t\\ln n)}{\\sqrt{n}} + R(t)
        \\]
        <p>where \\(R(t) = O(t^{-1/4})\\) is a remainder term. The leading correction term involves</p>
        \\[
        R_0(t) = (-1)^{N-1} \\left(\\frac{t}{2\\pi}\\right)^{-1/4} \\frac{\\cos(2\\pi(p^2 - p - 1/16))}{\\cos(2\\pi p)}
        \\]
        <p>where \\(p = \\sqrt{t/(2\\pi)} - N\\) is the fractional part.</p>
    </div>
</div>

<p>The main sum has only \\(N = O(\\sqrt{t})\\) terms, each requiring \\(O(1)\\) arithmetic operations. For \\(t \\sim 10^{12}\\), this means about \\(10^6\\) terms instead of \\(10^{12}\\).</p>

<div class="env-block remark">
    <div class="env-title">Historical Note</div>
    <div class="env-body">
        <p>Riemann discovered this formula around 1859, but it was found only posthumously in his unpublished notes, decoded by Siegel in 1932. Riemann had used it to compute zeros, a remarkable feat given that he worked entirely by hand. The formula was Riemann's secret weapon for empirical investigation of his hypothesis.</p>
    </div>
</div>

<h3>Computing \\(\\theta(t)\\)</h3>

<p>For practical computation, \\(\\theta(t)\\) is evaluated using the Stirling series:</p>
\\[
\\theta(t) = \\frac{t}{2}\\ln\\frac{t}{2\\pi} - \\frac{t}{2} - \\frac{\\pi}{8} + \\frac{1}{48t} + \\frac{7}{5760t^3} + \\cdots
\\]

<p>This asymptotic expansion converges rapidly for \\(t > 10\\), and a few terms give double-precision accuracy.</p>

<div class="viz-placeholder" data-viz="viz-riemann-siegel-z"></div>
`,
            visualizations: [
                {
                    id: 'viz-riemann-siegel-z',
                    title: 'The Hardy Z-Function',
                    description: 'Plot of \\(Z(t)\\) computed via the Riemann-Siegel formula. Each sign change (crossing of zero) corresponds to a zero of \\(\\zeta(s)\\) on the critical line. Drag the range to explore different heights.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 380,
                            originX: 50, originY: 190, scale: 1
                        });

                        var tMin = 0;
                        var tMax = 50;

                        VizEngine.createSlider(controls, 't-start', 0, 200, tMin, 5, function(v) {
                            tMin = v;
                            tMax = tMin + 50;
                            draw();
                        });

                        function theta(t) {
                            if (t < 1) return 0;
                            return (t / 2) * Math.log(t / (2 * Math.PI)) - t / 2 - Math.PI / 8 + 1 / (48 * t);
                        }

                        function Z(t) {
                            if (t < 2) return 0;
                            var N = Math.floor(Math.sqrt(t / (2 * Math.PI)));
                            if (N < 1) N = 1;
                            var th = theta(t);
                            var sum = 0;
                            for (var n = 1; n <= N; n++) {
                                sum += Math.cos(th - t * Math.log(n)) / Math.sqrt(n);
                            }
                            return 2 * sum;
                        }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var pad = 50;
                            var plotW = viz.width - pad - 20;
                            var plotH = viz.height - 60;
                            var plotTop = 40;
                            var plotLeft = pad;

                            viz.screenText('Z(t) via Riemann-Siegel Formula', viz.width / 2, 15, viz.colors.white, 14);

                            // Evaluate Z(t) over range
                            var pts = [];
                            var steps = 500;
                            var yMin = Infinity, yMax = -Infinity;
                            for (var i = 0; i <= steps; i++) {
                                var t = tMin + (tMax - tMin) * i / steps;
                                var z = Z(t);
                                if (Math.abs(z) > 100) z = z > 0 ? 100 : -100;
                                pts.push({t: t, z: z});
                                if (z < yMin) yMin = z;
                                if (z > yMax) yMax = z;
                            }
                            var yRange = Math.max(Math.abs(yMin), Math.abs(yMax), 2);
                            yMin = -yRange; yMax = yRange;

                            // Axes
                            var zeroY = plotTop + plotH / 2;
                            ctx.strokeStyle = viz.colors.axis;
                            ctx.lineWidth = 1;
                            ctx.beginPath();
                            ctx.moveTo(plotLeft, zeroY);
                            ctx.lineTo(plotLeft + plotW, zeroY);
                            ctx.stroke();

                            // t-axis labels
                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '10px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'top';
                            var tStep = Math.ceil((tMax - tMin) / 10);
                            for (var t = Math.ceil(tMin / tStep) * tStep; t <= tMax; t += tStep) {
                                var tx = plotLeft + (t - tMin) / (tMax - tMin) * plotW;
                                ctx.fillText(t.toFixed(0), tx, zeroY + 4);
                                ctx.strokeStyle = viz.colors.grid;
                                ctx.lineWidth = 0.3;
                                ctx.beginPath(); ctx.moveTo(tx, plotTop); ctx.lineTo(tx, plotTop + plotH); ctx.stroke();
                            }

                            // y-axis labels
                            ctx.textAlign = 'right';
                            ctx.textBaseline = 'middle';
                            for (var y = -Math.floor(yRange); y <= Math.floor(yRange); y++) {
                                if (y === 0) continue;
                                var sy = zeroY - (y / yRange) * (plotH / 2);
                                ctx.fillStyle = viz.colors.text;
                                ctx.fillText(y.toFixed(0), plotLeft - 5, sy);
                            }

                            // Zero band highlight
                            ctx.fillStyle = viz.colors.teal + '11';
                            ctx.fillRect(plotLeft, zeroY - 2, plotW, 4);

                            // Plot Z(t)
                            ctx.strokeStyle = viz.colors.blue;
                            ctx.lineWidth = 1.5;
                            ctx.beginPath();
                            var started = false;
                            var zeroCrossings = [];
                            for (var i = 0; i <= steps; i++) {
                                var px = plotLeft + (pts[i].t - tMin) / (tMax - tMin) * plotW;
                                var py = zeroY - (pts[i].z / yRange) * (plotH / 2);
                                py = Math.max(plotTop, Math.min(plotTop + plotH, py));
                                if (!started) { ctx.moveTo(px, py); started = true; }
                                else ctx.lineTo(px, py);

                                // Detect zero crossings
                                if (i > 0 && pts[i].z * pts[i-1].z < 0) {
                                    var tCross = pts[i-1].t + (pts[i].t - pts[i-1].t) * Math.abs(pts[i-1].z) / (Math.abs(pts[i-1].z) + Math.abs(pts[i].z));
                                    zeroCrossings.push(tCross);
                                }
                            }
                            ctx.stroke();

                            // Mark zero crossings
                            for (var j = 0; j < zeroCrossings.length; j++) {
                                var cx = plotLeft + (zeroCrossings[j] - tMin) / (tMax - tMin) * plotW;
                                ctx.fillStyle = viz.colors.red;
                                ctx.beginPath();
                                ctx.arc(cx, zeroY, 3, 0, Math.PI * 2);
                                ctx.fill();
                            }

                            // Legend
                            viz.screenText('t', plotLeft + plotW + 10, zeroY, viz.colors.text, 11);
                            viz.screenText('Z(t)', plotLeft + 5, plotTop - 5, viz.colors.blue, 11, 'left');
                            viz.screenText(zeroCrossings.length + ' zeros detected', viz.width / 2, viz.height - 10, viz.colors.red, 11);
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Show that \\(Z(t)\\) is real-valued. (Hint: use the functional equation \\(\\zeta(s) = \\chi(s)\\zeta(1-s)\\) and the fact that \\(e^{2i\\theta(t)} = \\chi(1/2 + it)\\).)',
                    hint: 'Write \\(Z(t) = e^{i\\theta(t)}\\zeta(1/2+it)\\). The functional equation gives \\(\\zeta(1/2+it) = \\chi(1/2+it)\\zeta(1/2-it)\\). Since \\(\\overline{\\zeta(1/2+it)} = \\zeta(1/2-it)\\), show \\(\\overline{Z(t)} = Z(t)\\).',
                    solution: 'We have \\(Z(t) = e^{i\\theta(t)}\\zeta(1/2 + it)\\). Taking the conjugate: \\(\\overline{Z(t)} = e^{-i\\theta(t)}\\zeta(1/2 - it)\\). From the functional equation, \\(\\zeta(1/2+it) = \\chi(1/2+it)\\zeta(1/2-it)\\) where \\(\\chi(1/2+it) = e^{-2i\\theta(t)}\\). So \\(\\zeta(1/2-it) = e^{2i\\theta(t)}\\zeta(1/2+it)\\), giving \\(\\overline{Z(t)} = e^{-i\\theta(t)} \\cdot e^{2i\\theta(t)}\\zeta(1/2+it) = e^{i\\theta(t)}\\zeta(1/2+it) = Z(t)\\).'
                },
                {
                    question: 'Verify numerically that the Riemann-Siegel formula with \\(N = \\lfloor\\sqrt{t/(2\\pi)}\\rfloor\\) terms gives a good approximation to \\(Z(t)\\) for \\(t = 100\\). How many terms are needed?',
                    hint: 'For \\(t = 100\\): \\(N = \\lfloor\\sqrt{100/(2\\pi)}\\rfloor = \\lfloor\\sqrt{15.92}\\rfloor = \\lfloor 3.99\\rfloor = 3\\). Compute each of the 3 terms.',
                    solution: 'For \\(t = 100\\): \\(N = 3\\). We compute \\(\\theta(100) \\approx 50\\ln(100/(2\\pi e)) - \\pi/8 \\approx 50 \\times 1.7668 - 0.3927 \\approx 87.95\\). The three terms are \\(2\\cos(87.95 - 0)/1 + 2\\cos(87.95 - 100\\ln 2)/\\sqrt{2} + 2\\cos(87.95 - 100\\ln 3)/\\sqrt{3}\\). Only 3 terms suffice for reasonable accuracy, compared to hundreds needed from the direct definition.'
                }
            ]
        },

        // ================================================================
        // SECTION 3: Zero Verification — Turing's Method
        // ================================================================
        {
            id: 'sec-zero-verification',
            title: "Zero Verification: Turing's Method",
            content: `
<h2>Zero Verification: Turing's Method</h2>

<div class="env-block intuition">
    <div class="env-title">The Verification Problem</div>
    <div class="env-body">
        <p>Finding sign changes of \\(Z(t)\\) tells us there are zeros on the critical line. But how do we know we haven't <em>missed</em> any? A zero could lie on the critical line between two evaluation points without causing a sign change (if two zeros are very close), or worse, a zero could lie off the critical line entirely. We need a method to certify completeness.</p>
    </div>
</div>

<h3>Counting Zeros: The Argument Principle</h3>

<p>Let \\(N(T)\\) count the number of zeros of \\(\\zeta(s)\\) with \\(0 < \\operatorname{Im}(s) < T\\) (counting multiplicity). The Riemann-von Mangoldt formula gives:</p>

<div class="env-block theorem">
    <div class="env-title">Theorem 20.3 (Riemann-von Mangoldt)</div>
    <div class="env-body">
        \\[
        N(T) = \\frac{T}{2\\pi}\\ln\\frac{T}{2\\pi} - \\frac{T}{2\\pi} + \\frac{7}{8} + S(T) + O(1/T)
        \\]
        <p>where \\(S(T) = \\frac{1}{\\pi}\\arg\\zeta(1/2 + iT)\\) satisfies \\(S(T) = O(\\log T)\\).</p>
    </div>
</div>

<p>The smooth part \\(\\frac{T}{2\\pi}\\ln\\frac{T}{2\\pi} - \\frac{T}{2\\pi} + \\frac{7}{8}\\) is computable; the oscillatory part \\(S(T)\\) is bounded but hard to evaluate precisely.</p>

<h3>Gram Points and Gram's Law</h3>

<div class="env-block definition">
    <div class="env-title">Definition (Gram Point)</div>
    <div class="env-body">
        <p>The \\(n\\)-th <strong>Gram point</strong> \\(g_n\\) is the unique solution to \\(\\theta(g_n) = n\\pi\\) for \\(n \\geq 0\\).</p>
    </div>
</div>

<p><strong>Gram's law</strong> (an empirical observation, not a theorem) states that \\((-1)^n Z(g_n) > 0\\) for "most" \\(n\\). When Gram's law holds at \\(g_n\\), the sign of \\(Z\\) at consecutive Gram points alternates, guaranteeing at least one zero in each Gram interval \\([g_n, g_{n+1}]\\).</p>

<p>Gram's law fails for about 27% of Gram points, and the failure rate is believed to increase slowly. Violations do not imply RH failure; they just mean the simple counting argument needs reinforcement.</p>

<h3>Turing's Method</h3>

<div class="env-block theorem">
    <div class="env-title">Theorem 20.4 (Turing's Method, simplified)</div>
    <div class="env-body">
        <p>Suppose we find exactly \\(N\\) sign changes of \\(Z(t)\\) in \\([0, T]\\), and the Riemann-von Mangoldt formula gives \\(N(T) = N\\) (to sufficient precision). Then all \\(N\\) zeros with \\(0 < \\operatorname{Im}(\\rho) < T\\) lie on the critical line and are simple.</p>
    </div>
</div>

<p>The logic is elegant: the argument principle counts <em>all</em> zeros in the critical strip (on or off the line), while sign changes count only those on the line. If these counts agree, every zero must be on the line.</p>

<div class="env-block remark">
    <div class="env-title">Practical Refinement</div>
    <div class="env-body">
        <p>In practice, one works with <em>Gram blocks</em>: maximal sequences of consecutive Gram intervals where the sign-change count matches the expected zero count. Turing showed that if a "Gram block" of length \\(k\\) contains exactly \\(k\\) sign changes, then it contains exactly \\(k\\) zeros on the critical line. Modern implementations (Gourdon, Platt) use refined versions with careful error analysis in the Riemann-von Mangoldt remainder.</p>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-zero-verification"></div>
`,
            visualizations: [
                {
                    id: 'viz-zero-verification',
                    title: "Gram Points and Turing's Verification",
                    description: 'Gram points (vertical lines) partition the t-axis. At each Gram point, we check the sign of \\(Z(t)\\). Alternating signs (Gram\'s law) guarantee zeros between them. Green ticks = Gram\'s law holds; red crosses = violations.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 380,
                            originX: 0, originY: 0, scale: 1
                        });

                        function theta(t) {
                            if (t < 1) return 0;
                            return (t / 2) * Math.log(t / (2 * Math.PI)) - t / 2 - Math.PI / 8 + 1 / (48 * t);
                        }

                        function Z(t) {
                            if (t < 2) return 0;
                            var N = Math.floor(Math.sqrt(t / (2 * Math.PI)));
                            if (N < 1) N = 1;
                            var th = theta(t);
                            var sum = 0;
                            for (var n = 1; n <= N; n++) {
                                sum += Math.cos(th - t * Math.log(n)) / Math.sqrt(n);
                            }
                            return 2 * sum;
                        }

                        // Find Gram points by solving theta(g) = n*pi
                        function findGramPoint(n) {
                            // Newton's method
                            var t = 2 * Math.PI * Math.exp(1) * Math.exp(2 * n * Math.PI / (2 * Math.PI));
                            // Better initial guess for small n
                            if (n < 20) t = 10 + n * 2.5;
                            for (var iter = 0; iter < 50; iter++) {
                                var th = theta(t);
                                var target = n * Math.PI;
                                var dthetadt = 0.5 * Math.log(t / (2 * Math.PI));
                                if (Math.abs(dthetadt) < 1e-10) break;
                                t = t - (th - target) / dthetadt;
                                if (t < 2) t = 2;
                                if (Math.abs(th - target) < 1e-8) break;
                            }
                            return t;
                        }

                        var tMin = 10;
                        var tMax = 60;

                        VizEngine.createSlider(controls, 't-start', 0, 150, tMin, 10, function(v) {
                            tMin = v;
                            tMax = tMin + 50;
                            draw();
                        });

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var pad = 50;
                            var plotW = viz.width - pad - 20;
                            var plotH = viz.height - 80;
                            var plotTop = 40;
                            var plotLeft = pad;
                            var zeroY = plotTop + plotH / 2;

                            viz.screenText("Gram Points & Turing's Method", viz.width / 2, 15, viz.colors.white, 14);

                            // Plot Z(t)
                            var pts = [];
                            var steps = 500;
                            var yRange = 0;
                            for (var i = 0; i <= steps; i++) {
                                var t = tMin + (tMax - tMin) * i / steps;
                                var z = Z(t);
                                if (Math.abs(z) > 50) z = z > 0 ? 50 : -50;
                                pts.push({t: t, z: z});
                                yRange = Math.max(yRange, Math.abs(z));
                            }
                            yRange = Math.max(yRange, 2);

                            // Zero line
                            ctx.strokeStyle = viz.colors.axis;
                            ctx.lineWidth = 1;
                            ctx.beginPath();
                            ctx.moveTo(plotLeft, zeroY);
                            ctx.lineTo(plotLeft + plotW, zeroY);
                            ctx.stroke();

                            // Find Gram points in range
                            var gramPoints = [];
                            for (var n = 0; n < 100; n++) {
                                var g = findGramPoint(n);
                                if (g < tMin - 5) continue;
                                if (g > tMax + 5) break;
                                gramPoints.push({n: n, t: g, z: Z(g)});
                            }

                            // Draw Gram point lines and check Gram's law
                            for (var j = 0; j < gramPoints.length; j++) {
                                var gp = gramPoints[j];
                                if (gp.t < tMin || gp.t > tMax) continue;
                                var gx = plotLeft + (gp.t - tMin) / (tMax - tMin) * plotW;

                                ctx.strokeStyle = viz.colors.grid;
                                ctx.lineWidth = 0.5;
                                ctx.setLineDash([3, 3]);
                                ctx.beginPath();
                                ctx.moveTo(gx, plotTop);
                                ctx.lineTo(gx, plotTop + plotH);
                                ctx.stroke();
                                ctx.setLineDash([]);

                                // Check Gram's law: (-1)^n Z(g_n) > 0
                                var gramLaw = (gp.n % 2 === 0 ? gp.z > 0 : gp.z < 0);
                                var gy = plotTop + plotH + 12;
                                ctx.fillStyle = gramLaw ? viz.colors.green : viz.colors.red;
                                ctx.font = '12px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.fillText(gramLaw ? '\u2713' : '\u2717', gx, gy);
                                ctx.fillStyle = viz.colors.text;
                                ctx.font = '8px -apple-system,sans-serif';
                                ctx.fillText('g' + gp.n, gx, gy + 12);
                            }

                            // Plot Z(t)
                            ctx.strokeStyle = viz.colors.blue;
                            ctx.lineWidth = 1.5;
                            ctx.beginPath();
                            var started = false;
                            for (var i = 0; i <= steps; i++) {
                                var px = plotLeft + (pts[i].t - tMin) / (tMax - tMin) * plotW;
                                var py = zeroY - (pts[i].z / yRange) * (plotH / 2);
                                py = Math.max(plotTop, Math.min(plotTop + plotH, py));
                                if (!started) { ctx.moveTo(px, py); started = true; }
                                else ctx.lineTo(px, py);
                            }
                            ctx.stroke();

                            // Mark zero crossings
                            for (var i = 1; i <= steps; i++) {
                                if (pts[i].z * pts[i-1].z < 0) {
                                    var tCross = pts[i-1].t + (pts[i].t - pts[i-1].t) * Math.abs(pts[i-1].z) / (Math.abs(pts[i-1].z) + Math.abs(pts[i].z));
                                    var cx = plotLeft + (tCross - tMin) / (tMax - tMin) * plotW;
                                    ctx.fillStyle = viz.colors.orange;
                                    ctx.beginPath();
                                    ctx.arc(cx, zeroY, 4, 0, Math.PI * 2);
                                    ctx.fill();
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
                    question: 'Explain the logic of Turing\'s method: why does agreement between the sign-change count and \\(N(T)\\) imply that all zeros up to height \\(T\\) lie on the critical line?',
                    hint: 'The argument principle counts all zeros in the critical strip, regardless of their real part. Sign changes of \\(Z(t)\\) count only zeros on the critical line.',
                    solution: 'The Riemann-von Mangoldt formula counts the total number \\(N(T)\\) of zeros with \\(0 < \\operatorname{Im}(\\rho) < T\\) in the entire critical strip \\(0 < \\operatorname{Re}(s) < 1\\). Sign changes of \\(Z(t)\\) detect zeros on the critical line \\(\\operatorname{Re}(s) = 1/2\\). If we find exactly \\(N(T)\\) sign changes, then all zeros must be on the line: any off-line zero would mean fewer sign changes than \\(N(T)\\). Moreover, each sign change detects at least one zero, so the zeros must be simple (a double zero would not cause a sign change).'
                },
                {
                    question: 'The first Gram point where Gram\'s law fails is \\(g_{126}\\). Look up or compute the approximate value of \\(g_{126}\\). What does this failure mean, and does it contradict RH?',
                    hint: 'Gram\'s law is an empirical pattern, not a consequence of RH. Its failure means the simple counting heuristic (one zero per Gram interval) breaks down locally, requiring Turing\'s more sophisticated block analysis.',
                    solution: 'The first failure of Gram\'s law occurs at \\(g_{126} \\approx 282.45\\), where \\((-1)^{126}Z(g_{126}) < 0\\) instead of being positive. This means the Gram interval \\([g_{126}, g_{127}]\\) may contain 0 or 2 zeros instead of exactly 1. It does not contradict RH. Turing\'s method handles this by grouping consecutive Gram intervals into "Gram blocks" and checking that the total zero count matches across the block.'
                }
            ]
        },

        // ================================================================
        // SECTION 4: Computing pi(x) — The Meissel-Lehmer Method
        // ================================================================
        {
            id: 'sec-computing-pi',
            title: 'Computing pi(x): Meissel-Lehmer',
            content: `
<h2>Computing \\(\\pi(x)\\): The Meissel-Lehmer Method</h2>

<div class="env-block intuition">
    <div class="env-title">The Challenge</div>
    <div class="env-body">
        <p>How do you compute \\(\\pi(10^{24})\\), the number of primes up to \\(10^{24}\\)? Sieving all integers up to \\(10^{24}\\) is out of the question: there is not enough memory in the world. Yet we know \\(\\pi(10^{24}) = 18{,}435{,}599{,}767{,}349{,}200{,}867{,}866\\). The trick is an inclusion-exclusion identity that computes \\(\\pi(x)\\) in \\(O(x^{2/3})\\) time without listing any individual primes near \\(x\\).</p>
    </div>
</div>

<h3>The Legendre Identity</h3>

<p>Define \\(\\phi(x, a)\\) as the number of integers \\(\\leq x\\) not divisible by any of the first \\(a\\) primes. Then by inclusion-exclusion:</p>

\\[
\\phi(x, a) = \\lfloor x \\rfloor - \\sum_{i=1}^{a} \\left\\lfloor \\frac{x}{p_i} \\right\\rfloor + \\sum_{i<j} \\left\\lfloor \\frac{x}{p_i p_j} \\right\\rfloor - \\cdots
\\]

<p>If \\(a = \\pi(\\sqrt{x})\\), then every composite \\(\\leq x\\) has a prime factor \\(\\leq \\sqrt{x}\\), so:</p>

\\[
\\pi(x) = \\phi(x, a) + a - 1.
\\]

<p>This is Legendre's identity (1808). It is correct but impractical for large \\(x\\): the inclusion-exclusion sum has \\(2^a\\) terms.</p>

<h3>Meissel's Simplification</h3>

<p>Meissel (1870) found a crucial decomposition. Define:</p>
<ul>
    <li>\\(P_2(x, a)\\) = number of integers \\(\\leq x\\) with exactly 2 prime factors, both \\(> p_a\\).</li>
</ul>

<p>Then for \\(a = \\pi(x^{1/3})\\):</p>

\\[
\\pi(x) = \\phi(x, a) + a - 1 - P_2(x, a).
\\]

<p>The term \\(P_2(x, a)\\) can be computed as:</p>
\\[
P_2(x, a) = \\sum_{\\substack{p_a < p \\leq \\sqrt{x}}} \\left(\\pi(x/p) - \\pi(p) + 1\\right).
\\]

<h3>The Lehmer Extension</h3>

<p>Lehmer (1959) extended this to handle \\(P_3\\) (numbers with exactly 3 prime factors above \\(p_a\\)), choosing \\(a = \\pi(x^{1/4})\\):</p>

\\[
\\pi(x) = \\phi(x, a) + \\frac{(a-2)(a-1)}{2} - 1 - P_2(x, a) - P_3(x, a).
\\]

<div class="env-block theorem">
    <div class="env-title">Theorem 20.5 (Meissel-Lehmer Complexity)</div>
    <div class="env-body">
        <p>The Meissel-Lehmer algorithm (with Lagarias-Miller-Odlyzko refinements) computes \\(\\pi(x)\\) exactly in:</p>
        <ul>
            <li>Time: \\(O(x^{2/3} / \\ln x)\\).</li>
            <li>Space: \\(O(x^{1/3} \\ln^2 x)\\).</li>
        </ul>
        <p>Further improvements by Deleglise-Rivat (1996) and more recently by Platt achieve \\(O(x^{2/3}/\\ln^2 x)\\).</p>
    </div>
</div>

<h3>Computational Records</h3>

<table style="width:100%;border-collapse:collapse;margin:12px 0;">
<tr style="border-bottom:1px solid #333;"><th style="text-align:left;padding:4px;">Year</th><th style="text-align:left;">\\(x\\)</th><th style="text-align:left;">\\(\\pi(x)\\)</th><th style="text-align:left;">Who</th></tr>
<tr><td style="padding:4px;">1870</td><td>\\(10^8\\)</td><td>5,761,455</td><td>Meissel</td></tr>
<tr><td style="padding:4px;">1959</td><td>\\(10^{10}\\)</td><td>455,052,511</td><td>Lehmer</td></tr>
<tr><td style="padding:4px;">1987</td><td>\\(10^{16}\\)</td><td>~2.79 \\times 10^{14}\\)</td><td>Lagarias-Odlyzko</td></tr>
<tr><td style="padding:4px;">2001</td><td>\\(10^{20}\\)</td><td>~2.22 \\times 10^{18}\\)</td><td>Platt</td></tr>
<tr><td style="padding:4px;">2015</td><td>\\(10^{25}\\)</td><td>~1.70 \\times 10^{23}\\)</td><td>Staple</td></tr>
</table>

<div class="viz-placeholder" data-viz="viz-meissel-lehmer"></div>
`,
            visualizations: [
                {
                    id: 'viz-meissel-lehmer',
                    title: 'Sieve vs. Meissel-Lehmer: Operation Count',
                    description: 'Compare the number of operations to compute \\(\\pi(x)\\) by direct sieving (\\(O(x)\\)) versus the Meissel-Lehmer algorithm (\\(O(x^{2/3})\\)). The gap grows dramatically with \\(x\\).',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 380,
                            originX: 0, originY: 0, scale: 1
                        });

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var pad = 70;
                            var plotW = viz.width - pad - 30;
                            var plotH = viz.height - 80;
                            var plotTop = 40;
                            var plotLeft = pad;
                            var plotBottom = plotTop + plotH;

                            viz.screenText('Sieve O(x) vs Meissel-Lehmer O(x^{2/3})', viz.width / 2, 15, viz.colors.white, 14);

                            // Log-log plot: x from 10^4 to 10^24
                            var logMin = 4, logMax = 24;

                            // Axes
                            ctx.strokeStyle = viz.colors.axis;
                            ctx.lineWidth = 1;
                            ctx.beginPath();
                            ctx.moveTo(plotLeft, plotBottom);
                            ctx.lineTo(plotLeft + plotW, plotBottom);
                            ctx.stroke();
                            ctx.beginPath();
                            ctx.moveTo(plotLeft, plotTop);
                            ctx.lineTo(plotLeft, plotBottom);
                            ctx.stroke();

                            // x-axis: log10(x)
                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '10px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'top';
                            for (var e = logMin; e <= logMax; e += 4) {
                                var px = plotLeft + (e - logMin) / (logMax - logMin) * plotW;
                                ctx.fillText('10^' + e, px, plotBottom + 5);
                                ctx.strokeStyle = viz.colors.grid;
                                ctx.lineWidth = 0.3;
                                ctx.beginPath(); ctx.moveTo(px, plotTop); ctx.lineTo(px, plotBottom); ctx.stroke();
                            }
                            viz.screenText('x', plotLeft + plotW + 15, plotBottom, viz.colors.text, 11);

                            // y-axis: log10(operations)
                            var opsMin = 3, opsMax = 25;
                            ctx.textAlign = 'right';
                            ctx.textBaseline = 'middle';
                            for (var o = 4; o <= 24; o += 4) {
                                var py = plotBottom - (o - opsMin) / (opsMax - opsMin) * plotH;
                                ctx.fillStyle = viz.colors.text;
                                ctx.fillText('10^' + o, plotLeft - 5, py);
                                ctx.strokeStyle = viz.colors.grid;
                                ctx.lineWidth = 0.3;
                                ctx.beginPath(); ctx.moveTo(plotLeft, py); ctx.lineTo(plotLeft + plotW, py); ctx.stroke();
                            }
                            viz.screenText('ops', plotLeft - 5, plotTop - 10, viz.colors.text, 10, 'center');

                            // Plot sieve: O(x) => log10(ops) = log10(x)
                            ctx.strokeStyle = viz.colors.red;
                            ctx.lineWidth = 2;
                            ctx.beginPath();
                            for (var i = 0; i <= 200; i++) {
                                var logx = logMin + (logMax - logMin) * i / 200;
                                var logOps = logx; // O(x)
                                var px = plotLeft + (logx - logMin) / (logMax - logMin) * plotW;
                                var py = plotBottom - (logOps - opsMin) / (opsMax - opsMin) * plotH;
                                py = Math.max(plotTop, Math.min(plotBottom, py));
                                i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
                            }
                            ctx.stroke();

                            // Plot M-L: O(x^{2/3}) => log10(ops) = (2/3)*log10(x)
                            ctx.strokeStyle = viz.colors.teal;
                            ctx.lineWidth = 2;
                            ctx.beginPath();
                            for (var i = 0; i <= 200; i++) {
                                var logx = logMin + (logMax - logMin) * i / 200;
                                var logOps = (2 / 3) * logx;
                                var px = plotLeft + (logx - logMin) / (logMax - logMin) * plotW;
                                var py = plotBottom - (logOps - opsMin) / (opsMax - opsMin) * plotH;
                                py = Math.max(plotTop, Math.min(plotBottom, py));
                                i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
                            }
                            ctx.stroke();

                            // Shade savings region
                            ctx.fillStyle = viz.colors.teal + '15';
                            ctx.beginPath();
                            for (var i = 0; i <= 200; i++) {
                                var logx = logMin + (logMax - logMin) * i / 200;
                                var logOps = logx;
                                var px = plotLeft + (logx - logMin) / (logMax - logMin) * plotW;
                                var py = plotBottom - (logOps - opsMin) / (opsMax - opsMin) * plotH;
                                py = Math.max(plotTop, Math.min(plotBottom, py));
                                i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
                            }
                            for (var i = 200; i >= 0; i--) {
                                var logx = logMin + (logMax - logMin) * i / 200;
                                var logOps = (2 / 3) * logx;
                                var px = plotLeft + (logx - logMin) / (logMax - logMin) * plotW;
                                var py = plotBottom - (logOps - opsMin) / (opsMax - opsMin) * plotH;
                                py = Math.max(plotTop, Math.min(plotBottom, py));
                                ctx.lineTo(px, py);
                            }
                            ctx.closePath();
                            ctx.fill();

                            // Legend
                            var lx = plotLeft + 30;
                            ctx.fillStyle = viz.colors.red;
                            ctx.fillRect(lx, plotTop + 10, 20, 3);
                            ctx.fillStyle = viz.colors.red;
                            ctx.font = '11px -apple-system,sans-serif';
                            ctx.textAlign = 'left';
                            ctx.fillText('Sieve: O(x)', lx + 25, plotTop + 14);

                            ctx.fillStyle = viz.colors.teal;
                            ctx.fillRect(lx, plotTop + 28, 20, 3);
                            ctx.fillStyle = viz.colors.teal;
                            ctx.fillText('Meissel-Lehmer: O(x^{2/3})', lx + 25, plotTop + 32);

                            // Annotation
                            viz.screenText('At x = 10^24: sieve needs 10^24 ops,  M-L needs 10^16', viz.width / 2, viz.height - 10, viz.colors.white, 11);
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Use Legendre\'s identity to compute \\(\\pi(30)\\). Take \\(a = \\pi(\\sqrt{30}) = \\pi(5) = 3\\), so the first 3 primes are 2, 3, 5.',
                    hint: 'Compute \\(\\phi(30, 3)\\) by inclusion-exclusion: integers \\(\\leq 30\\) not divisible by 2, 3, or 5. Then \\(\\pi(30) = \\phi(30, 3) + 3 - 1\\).',
                    solution: '\\(\\phi(30, 3) = 30 - \\lfloor 30/2 \\rfloor - \\lfloor 30/3 \\rfloor - \\lfloor 30/5 \\rfloor + \\lfloor 30/6 \\rfloor + \\lfloor 30/10 \\rfloor + \\lfloor 30/15 \\rfloor - \\lfloor 30/30 \\rfloor = 30 - 15 - 10 - 6 + 5 + 3 + 2 - 1 = 8\\). So \\(\\pi(30) = 8 + 3 - 1 = 10\\). Indeed, the primes \\(\\leq 30\\) are 2, 3, 5, 7, 11, 13, 17, 19, 23, 29.'
                }
            ]
        },

        // ================================================================
        // SECTION 5: Primality Testing
        // ================================================================
        {
            id: 'sec-primality',
            title: 'Primality Testing',
            content: `
<h2>Primality Testing</h2>

<div class="env-block intuition">
    <div class="env-title">Testing vs. Factoring</div>
    <div class="env-body">
        <p>An important distinction: <em>primality testing</em> asks "is \\(n\\) prime?" while <em>factoring</em> asks "what are \\(n\\)'s prime factors?" Testing is much easier. We can certify that a 1000-digit number is prime in seconds, but factoring a 600-digit composite remains beyond current capability. This gap is the basis of RSA cryptography.</p>
    </div>
</div>

<h3>Fermat's Test and Pseudoprimes</h3>

<p>Fermat's little theorem states: if \\(p\\) is prime and \\(\\gcd(a, p) = 1\\), then \\(a^{p-1} \\equiv 1 \\pmod{p}\\). The contrapositive gives a compositeness test: if \\(a^{n-1} \\not\\equiv 1 \\pmod{n}\\) for some \\(a\\), then \\(n\\) is composite.</p>

<p>However, some composites \\(n\\) satisfy \\(a^{n-1} \\equiv 1 \\pmod{n}\\) for all \\(a\\) coprime to \\(n\\). These are <em>Carmichael numbers</em> (e.g., 561 = 3 \\times 11 \\times 17). The Fermat test cannot detect them.</p>

<h3>Miller-Rabin Test</h3>

<div class="env-block theorem">
    <div class="env-title">Theorem 20.6 (Miller-Rabin Test)</div>
    <div class="env-body">
        <p>Write \\(n - 1 = 2^s \\cdot d\\) with \\(d\\) odd. Then \\(n\\) is a <strong>strong pseudoprime</strong> to base \\(a\\) if either:</p>
        <ol>
            <li>\\(a^d \\equiv 1 \\pmod{n}\\), or</li>
            <li>\\(a^{2^r d} \\equiv -1 \\pmod{n}\\) for some \\(0 \\leq r < s\\).</li>
        </ol>
        <p>If \\(n\\) is an odd prime, both conditions hold for every \\(a\\) coprime to \\(n\\). If \\(n\\) is composite, at most \\(1/4\\) of bases \\(1 < a < n\\) are strong liars. So \\(k\\) independent random bases give error probability \\(\\leq 4^{-k}\\).</p>
    </div>
</div>

<p>The Miller-Rabin test runs in \\(O(k \\log^2 n \\cdot \\log \\log n)\\) bit operations using fast modular exponentiation. With \\(k = 40\\) rounds, the false positive probability is \\(< 2^{-80}\\), negligible for any practical purpose.</p>

<div class="env-block remark">
    <div class="env-title">Deterministic Variants</div>
    <div class="env-body">
        <p>Under GRH, Miller (1976) showed that testing bases \\(a \\leq 2(\\ln n)^2\\) suffices to determine primality deterministically. For numbers below specific bounds, fixed sets of bases are known to be sufficient: for \\(n < 3.3 \\times 10^{24}\\), the bases \\(\\{2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37\\}\\) suffice.</p>
    </div>
</div>

<h3>The AKS Algorithm</h3>

<div class="env-block theorem">
    <div class="env-title">Theorem 20.7 (Agrawal-Kayal-Saxena, 2002)</div>
    <div class="env-body">
        <p>There exists a deterministic polynomial-time algorithm for primality testing. Specifically, PRIMES \\(\\in\\) P: one can determine whether \\(n\\) is prime in \\(O(\\log^{6+\\varepsilon} n)\\) bit operations (unconditionally).</p>
    </div>
</div>

<p>The AKS test is based on a generalization of Fermat's little theorem to polynomials: \\(n\\) is prime if and only if \\((x + a)^n \\equiv x^n + a \\pmod{n}\\) in \\(\\mathbb{Z}[x]\\). Checking this identity directly takes \\(O(n)\\) time, but working modulo \\(x^r - 1\\) for suitable \\(r\\) reduces it to polynomial time.</p>

<div class="env-block remark">
    <div class="env-title">Practice vs. Theory</div>
    <div class="env-body">
        <p>Despite its theoretical importance (resolving a decades-old question), AKS is rarely used in practice. Miller-Rabin with enough rounds is faster and sufficient for all practical purposes. The significance of AKS is <em>complexity-theoretic</em>: it proves PRIMES \\(\\in\\) P unconditionally, without reliance on any unproved hypothesis.</p>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-miller-rabin"></div>
`,
            visualizations: [
                {
                    id: 'viz-miller-rabin',
                    title: 'Miller-Rabin Primality Test',
                    description: 'Enter a number and watch the Miller-Rabin test in action. The test checks multiple random bases. Green = probably prime; red = definitely composite.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 380,
                            originX: 0, originY: 0, scale: 1
                        });

                        var testN = 561; // Carmichael number
                        var results = [];
                        var numBases = 10;

                        // Simple slider for n
                        VizEngine.createSlider(controls, 'n', 3, 1000, testN, 1, function(v) {
                            testN = Math.round(v);
                            runTest();
                        });

                        function modPow(base, exp, mod) {
                            var result = 1;
                            base = base % mod;
                            while (exp > 0) {
                                if (exp % 2 === 1) result = (result * base) % mod;
                                exp = Math.floor(exp / 2);
                                base = (base * base) % mod;
                            }
                            return result;
                        }

                        function millerRabinSingle(n, a) {
                            if (n < 2) return {prime: false, reason: 'n < 2'};
                            if (n === 2 || n === 3) return {prime: true, reason: 'small prime'};
                            if (n % 2 === 0) return {prime: false, reason: 'even'};

                            // Write n-1 = 2^s * d
                            var d = n - 1;
                            var s = 0;
                            while (d % 2 === 0) { d /= 2; s++; }

                            // Compute a^d mod n
                            var x = modPow(a, d, n);
                            if (x === 1 || x === n - 1) return {prime: true, reason: 'a^d = ' + (x === 1 ? '1' : '-1')};

                            for (var r = 1; r < s; r++) {
                                x = (x * x) % n;
                                if (x === n - 1) return {prime: true, reason: 'a^(2^' + r + 'd) = -1'};
                                if (x === 1) return {prime: false, reason: 'non-trivial sqrt of 1'};
                            }
                            return {prime: false, reason: 'failed all rounds'};
                        }

                        function isPrimeDirect(n) {
                            if (n < 2) return false;
                            if (n < 4) return true;
                            if (n % 2 === 0 || n % 3 === 0) return false;
                            for (var i = 5; i * i <= n; i += 6) {
                                if (n % i === 0 || n % (i + 2) === 0) return false;
                            }
                            return true;
                        }

                        function runTest() {
                            results = [];
                            var bases = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29];
                            for (var i = 0; i < numBases && i < bases.length; i++) {
                                if (bases[i] >= testN) continue;
                                var r = millerRabinSingle(testN, bases[i]);
                                r.base = bases[i];
                                results.push(r);
                            }
                            draw();
                        }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var actual = isPrimeDirect(testN);

                            viz.screenText('Miller-Rabin Test for n = ' + testN, viz.width / 2, 20, viz.colors.white, 14);
                            viz.screenText('(Actually ' + (actual ? 'PRIME' : 'COMPOSITE') + ')', viz.width / 2, 38, actual ? viz.colors.green : viz.colors.red, 11);

                            // Draw results as a table
                            var startY = 65;
                            var rowH = 28;
                            ctx.font = '11px -apple-system,sans-serif';
                            ctx.textAlign = 'left';

                            // Header
                            ctx.fillStyle = viz.colors.text;
                            ctx.fillText('Base a', 30, startY);
                            ctx.fillText('Verdict', 120, startY);
                            ctx.fillText('Reason', 230, startY);

                            ctx.strokeStyle = viz.colors.grid;
                            ctx.lineWidth = 0.5;
                            ctx.beginPath();
                            ctx.moveTo(20, startY + 8);
                            ctx.lineTo(540, startY + 8);
                            ctx.stroke();

                            var composite = false;
                            for (var i = 0; i < results.length; i++) {
                                var r = results[i];
                                var ry = startY + (i + 1) * rowH;

                                ctx.fillStyle = viz.colors.white;
                                ctx.fillText('a = ' + r.base, 30, ry);

                                if (r.prime) {
                                    ctx.fillStyle = viz.colors.green;
                                    ctx.fillText('Prob. Prime', 120, ry);
                                } else {
                                    ctx.fillStyle = viz.colors.red;
                                    ctx.fillText('COMPOSITE', 120, ry);
                                    composite = true;
                                }

                                ctx.fillStyle = viz.colors.text;
                                ctx.fillText(r.reason, 230, ry);
                            }

                            // Summary
                            var summY = startY + (results.length + 2) * rowH;
                            if (composite) {
                                viz.screenText('Verdict: COMPOSITE (detected by at least one base)', viz.width / 2, summY, viz.colors.red, 13);
                            } else if (results.length > 0) {
                                viz.screenText('Verdict: Probably prime (passed all ' + results.length + ' bases)', viz.width / 2, summY, viz.colors.green, 13);
                            }

                            // Note for Carmichael numbers
                            if (testN === 561 || testN === 1105 || testN === 1729) {
                                viz.screenText('Note: ' + testN + ' is a Carmichael number (passes Fermat, fails Miller-Rabin)', viz.width / 2, summY + 20, viz.colors.orange, 10);
                            }
                        }
                        runTest();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Verify that 561 is a Carmichael number by checking (a) it is composite, and (b) \\(a^{560} \\equiv 1 \\pmod{561}\\) for \\(a = 2\\). Then show the Miller-Rabin test with base 2 correctly identifies 561 as composite.',
                    hint: '\\(561 = 3 \\times 11 \\times 17\\). For Miller-Rabin: \\(560 = 2^4 \\times 35\\). Compute \\(2^{35} \\pmod{561}\\), then square repeatedly.',
                    solution: '(a) \\(561 = 3 \\times 11 \\times 17\\), so it is composite. (b) By CRT, \\(2^{560} \\equiv (2^2)^{280} \\equiv 1^{280} \\equiv 1 \\pmod{3}\\), and similarly mod 11 and 17, so \\(2^{560} \\equiv 1 \\pmod{561}\\) (Carmichael). For Miller-Rabin: \\(560 = 2^4 \\times 35\\). We compute \\(2^{35} \\equiv 263 \\pmod{561}\\). Then \\(263^2 \\equiv 166 \\pmod{561}\\), \\(166^2 \\equiv 67 \\pmod{561}\\), \\(67^2 \\equiv 1 \\pmod{561}\\). Since \\(67 \\not\\equiv \\pm 1 \\pmod{561}\\) but \\(67^2 \\equiv 1\\), we found a non-trivial square root of 1, proving 561 is composite.'
                },
                {
                    question: 'Explain the key idea behind AKS: how does reducing \\((x+a)^n \\pmod{x^r - 1, n}\\) make the test polynomial-time?',
                    hint: 'The identity \\((x+a)^n = x^n + a\\) in \\(\\mathbb{Z}_n[x]\\) has \\(n+1\\) coefficients. Working modulo \\(x^r - 1\\) reduces this to \\(r\\) coefficients.',
                    solution: 'The identity \\((x+a)^n \\equiv x^n + a \\pmod{n}\\) characterizes primes but checking it requires computing a polynomial of degree \\(n\\), which is exponential in \\(\\log n\\). Working modulo \\(x^r - 1\\) for \\(r = O(\\log^5 n)\\) reduces all polynomials to degree \\(< r\\), making each arithmetic operation take \\(O(r \\log n)\\) time. AKS shows that checking \\(O(\\sqrt{r} \\log n)\\) values of \\(a\\) suffices, giving total complexity \\(O(r^{3/2} \\log^3 n) = O(\\log^{10.5} n)\\), later improved to \\(\\tilde{O}(\\log^6 n)\\).'
                }
            ]
        },

        // ================================================================
        // SECTION 6: Bridge — Computation and Conjecture
        // ================================================================
        {
            id: 'sec-bridge',
            title: 'Bridge: Computation & Conjecture',
            content: `
<h2>Bridge: Computation and Conjecture</h2>

<div class="env-block intuition">
    <div class="env-title">The Role of Computation</div>
    <div class="env-body">
        <p>We have seen computation as verification (checking RH for \\(10^{13}\\) zeros), as evaluation (computing \\(\\pi(10^{25})\\)), and as classification (testing primality). But computation also plays a creative role: it discovers patterns, suggests conjectures, and occasionally shatters them.</p>
    </div>
</div>

<h3>Computation as Discovery: Zero Spacings and Random Matrices</h3>

<p>In the 1970s, Montgomery studied the pair correlation of zeta zeros: the statistical distribution of gaps between consecutive zeros \\(\\gamma_n - \\gamma_m\\). He found (conditionally on RH) that the pair correlation function is:</p>
\\[
1 - \\left(\\frac{\\sin \\pi u}{\\pi u}\\right)^2
\\]
<p>for test functions supported in \\((-1, 1)\\). At a famous tea-time encounter, Freeman Dyson recognized this as the pair correlation of eigenvalues of large random unitary matrices (GUE). This unexpected connection, discovered through numerical computation, revolutionized the field.</p>

<p>Odlyzko's monumental computations of zeros near the \\(10^{20}\\)-th zero confirmed the GUE prediction with stunning precision, far beyond what Montgomery's conditional theorem covered. The data is so compelling that the random matrix connection is now a central paradigm in number theory, despite remaining largely unproved.</p>

<h3>Computation as Destruction: The Mertens Conjecture</h3>

<p>The Mertens conjecture asserted that \\(|M(x)| \\leq \\sqrt{x}\\) for all \\(x \\geq 1\\), where \\(M(x) = \\sum_{n \\leq x} \\mu(n)\\). If true, it would imply RH. Odlyzko and te Riele (1985) disproved it computationally, showing (via the oscillation of \\(M(x)\\) related to zeta zeros) that \\(|M(x)| > \\sqrt{x}\\) for some \\(x < e^{1.59 \\times 10^{40}}\\). The counterexample is far too large to exhibit directly, but the proof is rigorous.</p>

<h3>The Skewes Number and \\(\\pi(x) > \\mathrm{li}(x)\\)</h3>

<p>Littlewood (1914) proved that \\(\\pi(x) - \\mathrm{li}(x)\\) changes sign infinitely often, but his proof was non-constructive. The search for the first crossover point, the "Skewes number," has been a long computational quest. Current bounds place the first sign change below \\(e^{727.95} \\approx 1.4 \\times 10^{316}\\).</p>

<h3>Open Computational Frontiers</h3>

<ol>
    <li><strong>Extend RH verification:</strong> Beyond \\(10^{13}\\) zeros, with rigorous error bounds.</li>
    <li><strong>Compute \\(\\pi(x)\\) for \\(x > 10^{25}\\):</strong> Improving the Deleglise-Rivat algorithm.</li>
    <li><strong>Zero spacings at extreme heights:</strong> Testing GUE predictions at \\(t \\sim 10^{30}\\).</li>
    <li><strong>GRH verification:</strong> Extending zero verification to Dirichlet \\(L\\)-functions systematically.</li>
    <li><strong>Maass forms and beyond:</strong> Computing eigenvalues and L-function zeros for automorphic forms.</li>
</ol>

<div class="env-block remark">
    <div class="env-title">A Philosophical Note</div>
    <div class="env-body">
        <p>None of these computations prove the Riemann Hypothesis. But as Polya said, "if you want to climb a mountain, look at it from afar before you try to climb it." Large-scale computation gives us a panoramic view of the landscape, revealing structure and suggesting paths that pure thought alone might miss. The history of analytic number theory shows that theory and computation advance together, each inspiring the other.</p>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-z-interactive"></div>
`,
            visualizations: [
                {
                    id: 'viz-z-interactive',
                    title: 'Interactive Z(t) Explorer',
                    description: 'Drag the blue point along the t-axis to explore \\(Z(t)\\) interactively. The panel shows the current value, nearby zeros, and the Gram point structure. Explore the first Gram law violation near t = 282.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 380,
                            originX: 0, originY: 0, scale: 1
                        });

                        function theta(t) {
                            if (t < 1) return 0;
                            return (t / 2) * Math.log(t / (2 * Math.PI)) - t / 2 - Math.PI / 8 + 1 / (48 * t);
                        }

                        function Z(t) {
                            if (t < 2) return 0;
                            var N = Math.floor(Math.sqrt(t / (2 * Math.PI)));
                            if (N < 1) N = 1;
                            var th = theta(t);
                            var sum = 0;
                            for (var n = 1; n <= N; n++) {
                                sum += Math.cos(th - t * Math.log(n)) / Math.sqrt(n);
                            }
                            return 2 * sum;
                        }

                        var tCenter = 25;
                        var windowSize = 30;

                        VizEngine.createSlider(controls, 't-center', 5, 300, tCenter, 1, function(v) {
                            tCenter = v;
                            draw();
                        });

                        VizEngine.createSlider(controls, 'window', 10, 80, windowSize, 5, function(v) {
                            windowSize = v;
                            draw();
                        });

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var tMin = Math.max(2, tCenter - windowSize / 2);
                            var tMax = tCenter + windowSize / 2;
                            var pad = 50;
                            var plotW = viz.width - pad - 20;
                            var plotH = viz.height - 100;
                            var plotTop = 50;
                            var plotLeft = pad;
                            var zeroY = plotTop + plotH / 2;

                            viz.screenText('Z(t) Explorer', viz.width / 2, 15, viz.colors.white, 14);

                            // Evaluate Z(t)
                            var pts = [];
                            var steps = 400;
                            var yRange = 0;
                            for (var i = 0; i <= steps; i++) {
                                var t = tMin + (tMax - tMin) * i / steps;
                                var z = Z(t);
                                if (Math.abs(z) > 50) z = z > 0 ? 50 : -50;
                                pts.push({t: t, z: z});
                                yRange = Math.max(yRange, Math.abs(z));
                            }
                            yRange = Math.max(yRange, 1);

                            // Zero line
                            ctx.strokeStyle = viz.colors.axis;
                            ctx.lineWidth = 1;
                            ctx.beginPath();
                            ctx.moveTo(plotLeft, zeroY);
                            ctx.lineTo(plotLeft + plotW, zeroY);
                            ctx.stroke();

                            // Plot
                            ctx.strokeStyle = viz.colors.blue;
                            ctx.lineWidth = 2;
                            ctx.beginPath();
                            var started = false;
                            var zeros = [];
                            for (var i = 0; i <= steps; i++) {
                                var px = plotLeft + (pts[i].t - tMin) / (tMax - tMin) * plotW;
                                var py = zeroY - (pts[i].z / yRange) * (plotH / 2);
                                py = Math.max(plotTop, Math.min(plotTop + plotH, py));
                                if (!started) { ctx.moveTo(px, py); started = true; }
                                else ctx.lineTo(px, py);

                                if (i > 0 && pts[i].z * pts[i-1].z < 0) {
                                    var tCross = pts[i-1].t + (pts[i].t - pts[i-1].t) * Math.abs(pts[i-1].z) / (Math.abs(pts[i-1].z) + Math.abs(pts[i].z));
                                    zeros.push(tCross);
                                }
                            }
                            ctx.stroke();

                            // Zero markers
                            for (var j = 0; j < zeros.length; j++) {
                                var zx = plotLeft + (zeros[j] - tMin) / (tMax - tMin) * plotW;
                                ctx.fillStyle = viz.colors.orange;
                                ctx.beginPath();
                                ctx.arc(zx, zeroY, 4, 0, Math.PI * 2);
                                ctx.fill();
                            }

                            // Current t marker
                            var curX = plotLeft + (tCenter - tMin) / (tMax - tMin) * plotW;
                            var curZ = Z(tCenter);
                            var curY = zeroY - (curZ / yRange) * (plotH / 2);
                            curY = Math.max(plotTop, Math.min(plotTop + plotH, curY));

                            ctx.strokeStyle = viz.colors.teal;
                            ctx.lineWidth = 1;
                            ctx.setLineDash([4, 3]);
                            ctx.beginPath();
                            ctx.moveTo(curX, plotTop);
                            ctx.lineTo(curX, plotTop + plotH);
                            ctx.stroke();
                            ctx.setLineDash([]);

                            ctx.fillStyle = viz.colors.teal;
                            ctx.beginPath();
                            ctx.arc(curX, curY, 5, 0, Math.PI * 2);
                            ctx.fill();

                            // Info panel
                            var infoY = viz.height - 35;
                            viz.screenText('t = ' + tCenter.toFixed(1) + '    Z(t) = ' + curZ.toFixed(4) + '    Zeros in view: ' + zeros.length, viz.width / 2, infoY, viz.colors.white, 11);

                            // t-axis labels
                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '10px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'top';
                            var tStep = Math.max(1, Math.ceil(windowSize / 10));
                            for (var t = Math.ceil(tMin / tStep) * tStep; t <= tMax; t += tStep) {
                                var tx = plotLeft + (t - tMin) / (tMax - tMin) * plotW;
                                ctx.fillText(t.toFixed(0), tx, zeroY + plotH / 2 + 5);
                            }
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'The Montgomery-Dyson pair correlation conjecture predicts that the normalized spacings between consecutive zeta zeros follow GUE statistics. What is the predicted probability of a normalized gap \\(\\delta < 0.5\\) between consecutive zeros?',
                    hint: 'Under GUE, very small gaps are highly unlikely; the probability density vanishes as \\(\\delta^2\\) for small \\(\\delta\\). This is "level repulsion." Numerically, \\(P(\\delta < 0.5) \\approx 0.11\\).',
                    solution: 'Under GUE statistics, the nearest-neighbor spacing distribution has density approximately \\(p(s) = (32/\\pi^2) s^2 e^{-4s^2/\\pi}\\) (the Wigner surmise). This gives \\(P(\\delta < 0.5) \\approx 0.11\\), reflecting level repulsion: zeros of \\(\\zeta\\) resist clustering, unlike Poisson-distributed points where \\(P(\\delta < 0.5) \\approx 0.39\\). Odlyzko\'s computation of \\(10^6\\) zeros near \\(\\gamma_{10^{20}}\\) confirmed this with striking accuracy.'
                },
                {
                    question: 'Why does the disproof of the Mertens conjecture not disprove the Riemann Hypothesis, even though the Mertens conjecture implies RH?',
                    hint: 'Implication goes one way: Mertens \\(\\Rightarrow\\) RH. The contrapositive is: not-RH \\(\\Rightarrow\\) not-Mertens. So disproving Mertens tells us nothing about RH.',
                    solution: 'The logical relationship is: Mertens conjecture \\(\\Rightarrow\\) RH. The contrapositive is \\(\\neg\\)RH \\(\\Rightarrow\\) \\(\\neg\\)Mertens. Disproving Mertens (\\(\\neg\\)Mertens) does not yield \\(\\neg\\)RH by any valid logical deduction. It simply means the Mertens bound was too strong. RH could still hold even though \\(|M(x)|/\\sqrt{x}\\) occasionally exceeds 1. In fact, current belief is that \\(|M(x)| = O(x^{1/2+\\varepsilon})\\) for every \\(\\varepsilon > 0\\) (which follows from RH), but the implied constant can exceed 1.'
                },
                {
                    question: 'Summarize the computational evidence for RH as of 2020. What has been verified, and what remains unproven?',
                    hint: 'Distinguish between numerical verification (checking zeros) and theoretical status.',
                    solution: 'As of 2020: (1) All nontrivial zeros of \\(\\zeta(s)\\) with \\(|\\operatorname{Im}(s)| < T\\) for \\(T \\approx 3 \\times 10^{12}\\) have been verified to lie on the critical line (Platt-Trudgian, with rigorous error bounds). This accounts for over \\(10^{13}\\) zeros. (2) Zero spacings near \\(\\gamma_{10^{20}}\\) match GUE predictions (Odlyzko). (3) No theoretical proof of RH exists, not even for a single non-trivial zero. The gap between "verified for \\(10^{13}\\) zeros" and "proved for all zeros" remains as wide as ever. Analytic number theory has made RH plausible but not proved it.'
                }
            ]
        }
    ]
});
