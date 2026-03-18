window.CHAPTERS = window.CHAPTERS || [];
window.CHAPTERS.push({
    id: 'ch08',
    number: 8,
    title: 'The Explicit Formula & the Error Term',
    subtitle: 'Each zero sings a note in the symphony of primes',
    sections: [

        // ================================================================
        // SECTION 1: Zeros as Frequencies
        // ================================================================
        {
            id: 'sec-motivation',
            title: 'Zeros as Frequencies',
            content: `
<h2>Zeros as Frequencies</h2>

<div class="env-block intuition">
    <div class="env-title">The Central Insight</div>
    <div class="env-body">
        <p>The primes look random. Yet the zeta zeros encode their distribution with uncanny precision. The explicit formula is the dictionary between these two worlds: it says that \\(\\psi(x)\\) — the Chebyshev function counting prime powers — is built from the zeta zeros, one oscillating wave per zero.</p>
        <p>Think of a symphony: the primes are the sound you hear, the zeros are the individual frequency components (the Fourier modes). Adding more modes reconstructs the sound more faithfully. This chapter makes that analogy exact.</p>
    </div>
</div>

<h3>The Chebyshev Function</h3>

<p>Recall the von Mangoldt function:
\\[
\\Lambda(n) = \\begin{cases} \\log p & \\text{if } n = p^k \\text{ for some prime } p, k \\geq 1, \\\\ 0 & \\text{otherwise.} \\end{cases}
\\]
The Chebyshev psi-function is its summatory function:
\\[
\\psi(x) = \\sum_{n \\leq x} \\Lambda(n) = \\sum_{p^k \\leq x} \\log p.
\\]
</p>

<p>This is a staircase: it is piecewise constant, jumping by \\(\\log p\\) at every prime power \\(p^k \\leq x\\). The Prime Number Theorem is equivalent to \\(\\psi(x) \\sim x\\) as \\(x \\to \\infty\\).</p>

<div class="env-block remark">
    <div class="env-title">Why \\(\\psi(x)\\) Instead of \\(\\pi(x)\\)?</div>
    <div class="env-body">
        <p>The function \\(\\psi(x)\\) is more natural analytically because \\(\\log \\zeta(s) = \\sum_p \\sum_k \\frac{1}{kp^{ks}}\\), and differentiating turns \\(\\log p / p^{ks}\\) into \\(\\Lambda(n)/n^s\\). The Dirichlet series for \\(-\\zeta'/\\zeta\\) is \\(\\sum_{n=1}^\\infty \\Lambda(n) n^{-s}\\), which directly connects \\(\\psi\\) to the analytic structure of \\(\\zeta\\).</p>
    </div>
</div>

<h3>What the Explicit Formula Will Say</h3>

<p>The Riemann–von Mangoldt explicit formula states, roughly:
\\[
\\psi(x) = x - \\sum_{\\rho} \\frac{x^\\rho}{\\rho} - \\frac{\\zeta'(0)}{\\zeta(0)} - \\frac{1}{2}\\log\\left(1 - x^{-2}\\right),
\\]
where the sum runs over the non-trivial zeros \\(\\rho = \\beta + i\\gamma\\) of \\(\\zeta(s)\\).</p>

<p>Each term \\(x^\\rho / \\rho\\) oscillates: writing \\(\\rho = \\frac{1}{2} + i\\gamma\\) (assuming RH), we get \\(x^\\rho = x^{1/2} e^{i\\gamma \\log x}\\), a wave with amplitude \\(x^{1/2}\\) and frequency \\(\\gamma / (2\\pi)\\) in the variable \\(\\log x\\). The zeros are literally the frequencies of the oscillations hidden inside \\(\\psi(x)\\).</p>

<div class="viz-placeholder" data-viz="viz-sound-analogy"></div>
`,
            visualizations: [
                {
                    id: 'viz-sound-analogy',
                    title: 'Zeros as Harmonics',
                    description: 'Each zeta zero contributes a wave to \\(\\psi(x)\\). Select which zeros to include and see their oscillating contributions — each zero a different color, each a distinct frequency.',
                    setup: function(body, controls) {
                        var ZEROS = [14.134725,21.022040,25.010858,30.424876,32.935062,37.586178,40.918719,43.327073,48.005151,49.773832,52.970321,56.446248,59.347044,60.831779,65.112544,67.079811,69.546402,72.067158,75.704691,77.144840];
                        var viz = new VizEngine(body, { width: 640, height: 320, originX: 60, originY: 260, scale: 1 });
                        var numZeros = 5;
                        var xMax = 80;

                        VizEngine.createSlider(controls, 'Number of zeros shown', 1, 20, numZeros, 1, function(v) {
                            numZeros = Math.round(v);
                            draw();
                        });

                        var zeroColors = [
                            '#58a6ff','#3fb9a0','#f0883e','#bc8cff','#f85149',
                            '#d29922','#f778ba','#3fb950','#79c0ff','#56d364',
                            '#e3b341','#ff7b72','#d2a8ff','#7ee787','#ffa657',
                            '#a5d6ff','#f0883e','#79c0ff','#bc8cff','#58a6ff'
                        ];

                        function waveContrib(gamma, t) {
                            // Re(x^rho / rho) with rho = 1/2 + i*gamma, x = e^t
                            // x^rho = e^(t/2) * e^(i*gamma*t)
                            // 1/rho = (1/2 - i*gamma) / (1/4 + gamma^2)
                            var xHalf = Math.exp(t / 2);
                            var rhoAbs2 = 0.25 + gamma * gamma;
                            var re = (0.5 * Math.cos(gamma * t) + gamma * Math.sin(gamma * t)) / rhoAbs2;
                            return -xHalf * re;
                        }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var W = viz.width, H = viz.height;
                            var plotLeft = 60, plotRight = W - 20;
                            var plotBottom = H - 40, plotTop = 20;
                            var plotW = plotRight - plotLeft;
                            var plotH = plotBottom - plotTop;

                            // Background
                            ctx.fillStyle = '#0c0c20';
                            ctx.fillRect(0, 0, W, H);

                            // Grid lines
                            ctx.strokeStyle = '#1a1a40';
                            ctx.lineWidth = 0.5;
                            for (var g = 0; g <= 4; g++) {
                                var yg = plotTop + g * plotH / 4;
                                ctx.beginPath(); ctx.moveTo(plotLeft, yg); ctx.lineTo(plotRight, yg); ctx.stroke();
                            }

                            // Axes
                            var midY = plotTop + plotH / 2;
                            ctx.strokeStyle = '#4a4a7a'; ctx.lineWidth = 1.5;
                            ctx.beginPath(); ctx.moveTo(plotLeft, midY); ctx.lineTo(plotRight, midY); ctx.stroke();
                            ctx.beginPath(); ctx.moveTo(plotLeft, plotTop); ctx.lineTo(plotLeft, plotBottom); ctx.stroke();

                            // X axis labels
                            ctx.fillStyle = '#8b949e'; ctx.font = '10px sans-serif'; ctx.textAlign = 'center';
                            for (var xi = 10; xi <= xMax; xi += 10) {
                                var xp = plotLeft + (xi / xMax) * plotW;
                                ctx.fillText(xi.toString(), xp, plotBottom + 14);
                            }
                            ctx.fillText('x', plotRight - 5, midY - 8);

                            // Draw each zero's wave
                            var steps = 400;
                            var ampScale = plotH * 0.38;

                            for (var z = 0; z < numZeros; z++) {
                                var gamma = ZEROS[z];
                                ctx.strokeStyle = zeroColors[z % zeroColors.length];
                                ctx.lineWidth = 1.5;
                                ctx.beginPath();
                                var started = false;
                                for (var i = 0; i <= steps; i++) {
                                    var xVal = 2 + (xMax - 2) * i / steps;
                                    var t = Math.log(xVal);
                                    var w = waveContrib(gamma, t);
                                    var px = plotLeft + ((xVal - 0) / xMax) * plotW;
                                    var py = midY - w / xVal * ampScale * 2;
                                    if (!isFinite(py) || py < plotTop - 10 || py > plotBottom + 10) { started = false; continue; }
                                    if (!started) { ctx.moveTo(px, py); started = true; } else { ctx.lineTo(px, py); }
                                }
                                ctx.stroke();
                            }

                            // Legend
                            var legX = plotLeft + 10, legY = plotTop + 10;
                            ctx.font = '10px sans-serif'; ctx.textAlign = 'left';
                            for (var li = 0; li < Math.min(numZeros, 5); li++) {
                                ctx.fillStyle = zeroColors[li % zeroColors.length];
                                ctx.fillRect(legX, legY + li * 16, 14, 10);
                                ctx.fillText('\u03b3\u2080' + (li+1) + ' = ' + ZEROS[li].toFixed(3), legX + 18, legY + li * 16 + 9);
                            }
                            if (numZeros > 5) {
                                ctx.fillStyle = '#8b949e';
                                ctx.fillText('+ ' + (numZeros - 5) + ' more zeros...', legX, legY + 5 * 16 + 9);
                            }

                            // Title
                            ctx.fillStyle = '#f0f6fc'; ctx.font = 'bold 12px sans-serif'; ctx.textAlign = 'center';
                            ctx.fillText('Individual zero contributions: Re(x^{\u03c1}/\u03c1)', W / 2, H - 8);
                        }

                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'The zero \\(\\rho_1 = \\frac{1}{2} + 14.135i\\) contributes \\(-x^{\\rho_1}/\\rho_1\\) to \\(\\psi(x)\\). Compute the real part of \\(x^{\\rho_1}\\) at \\(x = 100\\). What is the oscillation amplitude at \\(x = 100\\)?',
                    hint: 'Write \\(x^{\\rho_1} = x^{1/2} e^{i \\gamma_1 \\log x}\\). The amplitude of this complex exponential is \\(|x^{\\rho_1}| = x^{1/2} = 10\\).',
                    solution: 'At \\(x=100\\): \\(x^{1/2} = 10\\), \\(\\gamma_1 \\log 100 = 14.135 \\times 4.6052 \\approx 65.1\\) radians. So \\(\\text{Re}(x^{\\rho_1}) = 10\\cos(65.1) \\approx 10 \\times (-0.327) \\approx -3.27\\). The amplitude of the contribution is \\(|x^{\\rho_1}/\\rho_1| = 10/|\\rho_1| = 10/\\sqrt{0.25 + 14.135^2} \\approx 10/14.136 \\approx 0.707\\).'
                },
                {
                    question: 'Under the Riemann Hypothesis, all non-trivial zeros have \\(\\text{Re}(\\rho) = 1/2\\). Why does this force every wave contribution \\(|x^\\rho/\\rho|\\) to have amplitude of order \\(x^{1/2}/|\\gamma|\\)?',
                    hint: 'Factor \\(|x^\\rho/\\rho| = x^{\\text{Re}(\\rho)}/|\\rho|\\).',
                    solution: 'If \\(\\rho = 1/2 + i\\gamma\\), then \\(|x^\\rho| = x^{1/2}\\) and \\(|\\rho| \\approx |\\gamma|\\) for large \\(\\gamma\\). Thus \\(|x^\\rho/\\rho| \\approx x^{1/2}/|\\gamma|\\). Each zero contributes an oscillation of amplitude \\(O(x^{1/2}/\\gamma_n)\\), which decreases as \\(n\\) grows. The sum converges (conditionally), and the total error \\(\\psi(x) - x\\) is bounded by \\(O(x^{1/2} \\log^2 x)\\) under RH.'
                }
            ]
        },

        // ================================================================
        // SECTION 2: Von Mangoldt's Explicit Formula
        // ================================================================
        {
            id: 'sec-von-mangoldt',
            title: "Von Mangoldt's Explicit Formula",
            content: `
<h2>Von Mangoldt's Explicit Formula</h2>

<div class="env-block theorem">
    <div class="env-title">Theorem 8.1 (Von Mangoldt's Explicit Formula)</div>
    <div class="env-body">
        <p>For \\(x > 1\\) and \\(x\\) not a prime power,
        \\[
        \\psi(x) = x - \\sum_{\\rho} \\frac{x^\\rho}{\\rho} - \\log(2\\pi) - \\frac{1}{2}\\log\\bigl(1 - x^{-2}\\bigr),
        \\]
        where the sum is over all non-trivial zeros \\(\\rho\\) of \\(\\zeta(s)\\), ordered symmetrically \\(|\\rho| \\leq T \\to \\infty\\).</p>
    </div>
</div>

<h3>Derivation Sketch via Perron's Formula</h3>

<p>The starting point is the logarithmic derivative of \\(\\zeta(s)\\):
\\[
-\\frac{\\zeta'(s)}{\\zeta(s)} = \\sum_{n=1}^\\infty \\Lambda(n) n^{-s}, \\quad \\text{Re}(s) > 1.
\\]
</p>

<p>Perron's formula recovers partial sums from Dirichlet series: for \\(c > 1\\),
\\[
\\psi(x) = \\frac{1}{2\\pi i} \\int_{c-i\\infty}^{c+i\\infty} \\left(-\\frac{\\zeta'(s)}{\\zeta(s)}\\right) \\frac{x^s}{s} \\, ds.
\\]
</p>

<p>Move the contour left, crossing the poles of \\(-\\zeta'/\\zeta\\). These occur at:
<ul>
    <li>\\(s = 1\\): simple pole with residue \\(1\\), contributing the main term \\(x\\).</li>
    <li>\\(s = \\rho\\) (non-trivial zeros): simple poles contributing \\(-x^\\rho/\\rho\\).</li>
    <li>\\(s = 0\\): contributing \\(-\\zeta'(0)/\\zeta(0) = -\\log(2\\pi)\\).</li>
    <li>\\(s = -2k\\) (trivial zeros, \\(k=1,2,3,\\ldots\\)): contributing \\(-\\sum_{k=1}^\\infty x^{-2k}/(2k) = \\frac{1}{2}\\log(1-x^{-2})\\).</li>
</ul>
</p>

<div class="env-block remark">
    <div class="env-title">Conditional Convergence</div>
    <div class="env-body">
        <p>The sum \\(\\sum_\\rho x^\\rho/\\rho\\) does not converge absolutely. It must be understood as a symmetric limit: \\(\\lim_{T\\to\\infty} \\sum_{|\\text{Im}(\\rho)| \\leq T} x^\\rho/\\rho\\). The pairing of \\(\\rho\\) and \\(\\bar\\rho\\) makes the sum real (since \\(\\zeta(s) = \\overline{\\zeta(\\bar s)}\\) implies zeros come in conjugate pairs).</p>
    </div>
</div>

<h3>The Anatomy of the Formula</h3>

<div class="viz-placeholder" data-viz="viz-explicit-formula-anatomy"></div>

<div class="env-block example">
    <div class="env-title">Numerical Verification at x = 100</div>
    <div class="env-body">
        <p>At \\(x = 100\\), the true value is \\(\\psi(100) = \\log 2 + \\log 3 + \\log 5 + \\log 7 + \\cdots \\approx 94.0\\).</p>
        <p>The main term is \\(x = 100\\). The trivial correction is \\(-\\log(2\\pi) \\approx -1.838\\). Using the first zero \\(\\rho_1 = \\frac{1}{2} + 14.135i\\):
        \\[
        \\frac{x^{\\rho_1}}{\\rho_1} + \\frac{x^{\\bar\\rho_1}}{\\bar\\rho_1} = 2\\,\\text{Re}\\left(\\frac{x^{\\rho_1}}{\\rho_1}\\right) = 2 \\cdot \\frac{10 \\cos(65.08)}{14.136} \\approx -0.46.
        \\]
        Adding more zeros, the partial sum converges toward \\(-6.1\\), placing \\(\\psi(100) \\approx 94.1\\). Impressive.</p>
    </div>
</div>
`,
            visualizations: [
                {
                    id: 'viz-explicit-formula-anatomy',
                    title: 'Anatomy of the Explicit Formula',
                    description: 'A decomposition diagram: \\(\\psi(x)\\) equals main term, minus zero sum, minus constant, minus trivial-zero sum.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, { width: 640, height: 300, originX: 0, originY: 0, scale: 1 });

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var W = viz.width, H = viz.height;

                            ctx.fillStyle = '#0c0c20';
                            ctx.fillRect(0, 0, W, H);

                            // Title
                            ctx.fillStyle = '#f0f6fc'; ctx.font = 'bold 14px sans-serif'; ctx.textAlign = 'center';
                            ctx.fillText('Von Mangoldt Explicit Formula: Decomposition', W / 2, 28);

                            // Draw boxes
                            var boxH = 56, boxY = 70, gap = 8;
                            var parts = [
                                { label: '\u03c8(x)', color: '#f0f6fc', w: 90, desc: 'Chebyshev function\nCounts prime powers' },
                                { label: '=', color: '#8b949e', w: 30, desc: '' },
                                { label: 'x', color: '#58a6ff', w: 70, desc: 'Main term\n\u223c x (PNT)' },
                                { label: '\u2212', color: '#8b949e', w: 30, desc: '' },
                                { label: '\u03a3\u03c1 x\u1d9d/\u03c1', color: '#f85149', w: 110, desc: 'Non-trivial zeros\nOscillating waves' },
                                { label: '\u2212', color: '#8b949e', w: 30, desc: '' },
                                { label: 'log(2\u03c0)', color: '#d29922', w: 90, desc: 'Constant term\n\u22481.838' },
                                { label: '\u2212', color: '#8b949e', w: 30, desc: '' },
                                { label: '\u00bd log(1\u2212x\u207b\u00b2)', color: '#3fb9a0', w: 120, desc: 'Trivial zeros\n\u2192 0 as x\u2192\u221e' }
                            ];

                            var totalW = parts.reduce(function(s, p) { return s + p.w + gap; }, 0) - gap;
                            var startX = (W - totalW) / 2;
                            var x = startX;

                            parts.forEach(function(p) {
                                if (p.desc) {
                                    // Box
                                    ctx.fillStyle = p.color + '22';
                                    ctx.strokeStyle = p.color;
                                    ctx.lineWidth = 2;
                                    ctx.beginPath();
                                    ctx.roundRect(x, boxY, p.w, boxH, 6);
                                    ctx.fill(); ctx.stroke();

                                    ctx.fillStyle = p.color;
                                    ctx.font = 'bold 13px sans-serif';
                                    ctx.textAlign = 'center';
                                    ctx.fillText(p.label, x + p.w / 2, boxY + 22);

                                    // Description below
                                    ctx.fillStyle = p.color + 'cc';
                                    ctx.font = '9px sans-serif';
                                    var lines = p.desc.split('\n');
                                    lines.forEach(function(line, li) {
                                        ctx.fillText(line, x + p.w / 2, boxY + boxH + 16 + li * 13);
                                    });
                                } else {
                                    // Operator
                                    ctx.fillStyle = p.color;
                                    ctx.font = 'bold 20px sans-serif';
                                    ctx.textAlign = 'center';
                                    ctx.fillText(p.label, x + p.w / 2, boxY + boxH / 2 + 7);
                                }
                                x += p.w + gap;
                            });

                            // Note
                            ctx.fillStyle = '#8b949e'; ctx.font = '11px sans-serif'; ctx.textAlign = 'center';
                            ctx.fillText('The zero sum converges conditionally; symmetric ordering |Im(\u03c1)| \u2264 T \u2192 \u221e', W / 2, H - 12);
                        }

                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Explain why the residue of \\(-\\zeta\'(s)/\\zeta(s) \\cdot x^s/s\\) at \\(s=1\\) is \\(+x\\). (Recall that \\(\\zeta(s)\\) has a simple pole at \\(s=1\\) with residue 1.)',
                    hint: 'Near \\(s=1\\): \\(\\zeta(s) \\approx 1/(s-1)\\), so \\(-\\zeta\'/\\zeta \\approx 1/(s-1)\\). The integrand has a simple pole at \\(s=1\\) with residue \\(x^1/1 = x\\).',
                    solution: 'Near \\(s=1\\), write \\(\\zeta(s) = \\frac{1}{s-1} + \\gamma_0 + O(s-1)\\). Then \\(\\zeta\'(s) = -\\frac{1}{(s-1)^2} + O(1)\\) and \\(-\\zeta\'(s)/\\zeta(s) = \\frac{1}{s-1} + O(1)\\). So \\(-\\frac{\\zeta\'(s)}{\\zeta(s)} \\cdot \\frac{x^s}{s}\\) has a simple pole at \\(s=1\\) with residue \\(x^1/1 = x\\).'
                },
                {
                    question: 'The trivial zeros occur at \\(s = -2, -4, -6, \\ldots\\). Show their total contribution to the explicit formula sums to \\(\\frac{1}{2}\\log(1-x^{-2})\\).',
                    hint: 'Each trivial zero \\(-2k\\) is a simple zero of \\(\\zeta\\), contributing \\(-x^{-2k}/(-2k) = x^{-2k}/(2k)\\). Sum over \\(k \\geq 1\\).',
                    solution: 'The contribution from trivial zero \\(s = -2k\\) is \\(-x^{-2k}/(-2k) = x^{-2k}/(2k)\\). Wait, actually the sign: we subtract \\(x^\\rho/\\rho\\) for each zero, so trivial zeros contribute \\(-\\sum_{k=1}^\\infty x^{-2k}/(2k)\\). But \\(\\sum_{k=1}^\\infty t^k/k = -\\log(1-t)\\), so setting \\(t = x^{-2}\\): contribution \\(= -\\sum_{k=1}^\\infty x^{-2k}/(2k) \\cdot 2 \\cdot (1/2) = \\frac{1}{2}\\sum_{k=1}^\\infty (-1) \\cdot \\frac{(x^{-2})^k}{k}\\cdot(-1)\\). More carefully: \\(\\frac{1}{2}\\log(1-x^{-2}) = \\frac{1}{2}\\sum_{k=1}^\\infty \\frac{-x^{-2k}}{k}\\), so the trivial zeros contribute \\(-\\frac{1}{2}\\log(1-x^{-2})\\), which is positive (since \\(\\log(1-x^{-2}) < 0\\)).'
                }
            ]
        },

        // ================================================================
        // SECTION 3: Each Zero's Contribution
        // ================================================================
        {
            id: 'sec-individual-zeros',
            title: "Each Zero's Contribution",
            content: `
<h2>Each Zero's Contribution</h2>

<p>The term \\(x^\\rho / \\rho\\) for a single zero \\(\\rho = \\beta + i\\gamma\\) is a complex number. Since zeros come in conjugate pairs \\(\\rho, \\bar\\rho\\), their contributions add up to a real oscillation:
\\[
-\\frac{x^\\rho}{\\rho} - \\frac{x^{\\bar\\rho}}{\\bar\\rho} = -2\\,\\text{Re}\\left(\\frac{x^\\rho}{\\rho}\\right).
\\]
</p>

<p>Write \\(\\rho = \\beta + i\\gamma\\) with \\(\\gamma > 0\\). Then:
\\[
x^\\rho = x^\\beta \\cdot e^{i\\gamma \\log x} = x^\\beta \\bigl[\\cos(\\gamma \\log x) + i\\sin(\\gamma \\log x)\\bigr].
\\]
</p>

<p>Also \\(\\rho = |\\rho| e^{i\\theta}\\) where \\(|\\rho| = \\sqrt{\\beta^2 + \\gamma^2}\\) and \\(\\theta = \\arctan(\\gamma/\\beta)\\). So:
\\[
\\text{Re}\\left(\\frac{x^\\rho}{\\rho}\\right) = \\frac{x^\\beta}{|\\rho|} \\cos(\\gamma \\log x - \\theta).
\\]
</p>

<div class="env-block definition">
    <div class="env-title">The Wave from Zero \\(\\rho_n = \\frac{1}{2} + i\\gamma_n\\)</div>
    <div class="env-body">
        <p>Under RH (\\(\\beta = 1/2\\)):
        \\[
        w_n(x) = -2\\,\\text{Re}\\left(\\frac{x^{\\rho_n}}{\\rho_n}\\right) = -\\frac{2x^{1/2}}{|\\rho_n|}\\cos\\bigl(\\gamma_n \\log x - \\theta_n\\bigr),
        \\]
        where \\(\\theta_n = \\arctan(2\\gamma_n)\\approx \\pi/2\\) for large \\(\\gamma_n\\). This is a wave with amplitude \\(2x^{1/2}/|\\rho_n| \\approx 2x^{1/2}/\\gamma_n\\), oscillating in \\(\\log x\\) with angular frequency \\(\\gamma_n\\).</p>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-single-zero-wave"></div>

<h3>The Phase Shifts</h3>

<p>Each zero has a different \\(\\gamma_n\\), so the waves have different periods in \\(\\log x\\). The period of \\(w_n(x)\\) in \\(\\log x\\) is \\(2\\pi/\\gamma_n\\). For the first zero, \\(\\gamma_1 \\approx 14.135\\), giving period \\(\\approx 0.444\\) in \\(\\log x\\), i.e., a factor of \\(e^{0.444} \\approx 1.56\\) multiplicative period in \\(x\\).</p>

<p>As \\(x\\) increases, these waves with different frequencies become increasingly de-synchronized, which is why \\(\\psi(x) - x\\) fluctuates erratically but grows no faster than \\(x^{1/2+\\epsilon}\\).</p>
`,
            visualizations: [
                {
                    id: 'viz-single-zero-wave',
                    title: 'Individual Zero Wave Contribution',
                    description: 'The contribution \\(-2\\,\\text{Re}(x^{\\rho_n}/\\rho_n)\\) from a single zero. Choose which zero with the slider. Note the growing amplitude \\(\\propto x^{1/2}\\) and the oscillation in \\(\\log x\\).',
                    setup: function(body, controls) {
                        var ZEROS = [14.134725,21.022040,25.010858,30.424876,32.935062,37.586178,40.918719,43.327073,48.005151,49.773832,52.970321,56.446248,59.347044,60.831779,65.112544,67.079811,69.546402,72.067158,75.704691,77.144840,79.337375,82.910381,84.735493,87.425275,88.809111,92.491899,94.651344,95.870634,98.831194,101.317851];
                        var viz = new VizEngine(body, { width: 640, height: 320, originX: 0, originY: 0, scale: 1 });
                        var zeroIdx = 0;
                        var xMax = 100;

                        VizEngine.createSlider(controls, 'Zero index n', 1, 30, 1, 1, function(v) {
                            zeroIdx = Math.round(v) - 1;
                            draw();
                        });
                        VizEngine.createSlider(controls, 'x max', 50, 500, xMax, 50, function(v) {
                            xMax = v;
                            draw();
                        });

                        function waveContrib(gamma, x) {
                            var beta = 0.5;
                            var rhoAbs = Math.sqrt(beta * beta + gamma * gamma);
                            var theta = Math.atan2(gamma, beta);
                            return -(2 * Math.pow(x, beta) / rhoAbs) * Math.cos(gamma * Math.log(x) - theta);
                        }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var W = viz.width, H = viz.height;
                            var gamma = ZEROS[zeroIdx];

                            ctx.fillStyle = '#0c0c20'; ctx.fillRect(0, 0, W, H);

                            var plotLeft = 60, plotRight = W - 20, plotTop = 30, plotBottom = H - 45;
                            var plotW = plotRight - plotLeft, plotH = plotBottom - plotTop;

                            // Find range
                            var steps = 600;
                            var yMin = 0, yMax = 0;
                            for (var i = 0; i <= steps; i++) {
                                var xv = 2 + (xMax - 2) * i / steps;
                                var w = waveContrib(gamma, xv);
                                if (isFinite(w)) { yMin = Math.min(yMin, w); yMax = Math.max(yMax, w); }
                            }
                            var yRange = Math.max(Math.abs(yMin), Math.abs(yMax));
                            if (yRange < 1) yRange = 1;

                            function px(xv) { return plotLeft + ((xv - 2) / (xMax - 2)) * plotW; }
                            function py(yv) { return plotTop + plotH / 2 - (yv / yRange) * (plotH / 2 * 0.9); }

                            // Grid
                            ctx.strokeStyle = '#1a1a40'; ctx.lineWidth = 0.5;
                            for (var g = 0; g <= 4; g++) {
                                var yg = plotTop + g * plotH / 4;
                                ctx.beginPath(); ctx.moveTo(plotLeft, yg); ctx.lineTo(plotRight, yg); ctx.stroke();
                            }

                            // Envelope: +/- 2*x^0.5 / |rho|
                            var rhoAbs = Math.sqrt(0.25 + gamma * gamma);
                            ctx.strokeStyle = '#58a6ff33'; ctx.lineWidth = 1; ctx.setLineDash([4, 4]);
                            ctx.beginPath();
                            for (var i2 = 0; i2 <= steps; i2++) {
                                var xv2 = 2 + (xMax - 2) * i2 / steps;
                                var env = 2 * Math.sqrt(xv2) / rhoAbs;
                                var pp = px(xv2), ppE = py(env);
                                if (i2 === 0) ctx.moveTo(pp, ppE); else ctx.lineTo(pp, ppE);
                            }
                            ctx.stroke();
                            ctx.beginPath();
                            for (var i3 = 0; i3 <= steps; i3++) {
                                var xv3 = 2 + (xMax - 2) * i3 / steps;
                                var env3 = -2 * Math.sqrt(xv3) / rhoAbs;
                                var pp3 = px(xv3), ppE3 = py(env3);
                                if (i3 === 0) ctx.moveTo(pp3, ppE3); else ctx.lineTo(pp3, ppE3);
                            }
                            ctx.stroke();
                            ctx.setLineDash([]);

                            // Zero line
                            ctx.strokeStyle = '#4a4a7a'; ctx.lineWidth = 1.5;
                            ctx.beginPath(); ctx.moveTo(plotLeft, py(0)); ctx.lineTo(plotRight, py(0)); ctx.stroke();
                            ctx.beginPath(); ctx.moveTo(plotLeft, plotTop); ctx.lineTo(plotLeft, plotBottom); ctx.stroke();

                            // Wave
                            ctx.strokeStyle = '#f0883e'; ctx.lineWidth = 2;
                            ctx.beginPath();
                            var started = false;
                            for (var i4 = 0; i4 <= steps; i4++) {
                                var xv4 = 2 + (xMax - 2) * i4 / steps;
                                var w4 = waveContrib(gamma, xv4);
                                var ppx = px(xv4), ppy = py(w4);
                                if (!isFinite(ppy)) { started = false; continue; }
                                if (!started) { ctx.moveTo(ppx, ppy); started = true; } else { ctx.lineTo(ppx, ppy); }
                            }
                            ctx.stroke();

                            // Axes labels
                            ctx.fillStyle = '#8b949e'; ctx.font = '10px sans-serif'; ctx.textAlign = 'center';
                            for (var xi = 0; xi <= xMax; xi += Math.ceil(xMax / 10) * 2) {
                                if (xi < 2) continue;
                                ctx.fillText(xi.toString(), px(xi), plotBottom + 14);
                            }
                            ctx.textAlign = 'right';
                            ctx.fillText((yRange).toFixed(1), plotLeft - 4, plotTop + 5);
                            ctx.fillText((-yRange).toFixed(1), plotLeft - 4, plotBottom - 5);
                            ctx.fillText('0', plotLeft - 4, py(0));

                            // Title
                            ctx.fillStyle = '#f0f6fc'; ctx.font = 'bold 12px sans-serif'; ctx.textAlign = 'center';
                            ctx.fillText('Zero \u03c1\u2080' + (zeroIdx+1) + ': \u03b3 = ' + gamma.toFixed(6) + ' | Amplitude \u223c 2x\u00bd/|\u03c1| (blue envelope)', W / 2, H - 8);
                        }

                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'For zero \\(\\rho_n = \\frac{1}{2} + i\\gamma_n\\), what is the period of the wave \\(w_n(x)\\) in \\(\\log x\\)? For \\(\\gamma_1 = 14.135\\), what multiplicative factor in \\(x\\) corresponds to one full period?',
                    hint: 'The wave is \\(\\cos(\\gamma \\log x + \\text{const})\\). One period occurs when \\(\\gamma \\Delta(\\log x) = 2\\pi\\).',
                    solution: 'Period in \\(\\log x\\) is \\(2\\pi/\\gamma_n\\). For \\(\\gamma_1 = 14.135\\), this is \\(2\\pi/14.135 \\approx 0.4444\\). Since \\(\\Delta(\\log x) = 0.444\\) means \\(x_{\\text{new}}/x_{\\text{old}} = e^{0.444} \\approx 1.559\\). So the first zero produces oscillations that repeat whenever \\(x\\) is multiplied by \\(\\approx 1.56\\).'
                },
                {
                    question: 'Show that the two contributions \\(-x^\\rho/\\rho - x^{\\bar\\rho}/\\bar\\rho\\) from a conjugate pair are real. (Recall that if \\(\\zeta(\\rho) = 0\\) then \\(\\zeta(\\bar\\rho) = 0\\) by the reflection principle.)',
                    hint: 'Compute the complex conjugate of \\(x^\\rho/\\rho\\) directly.',
                    solution: 'For real \\(x > 0\\) and \\(\\rho = \\beta + i\\gamma\\): \\(\\overline{x^\\rho/\\rho} = \\overline{e^{\\rho \\log x}/\\rho} = e^{\\bar\\rho \\log x}/\\bar\\rho = x^{\\bar\\rho}/\\bar\\rho\\). So \\(-x^\\rho/\\rho - x^{\\bar\\rho}/\\bar\\rho = -x^\\rho/\\rho - \\overline{x^\\rho/\\rho} = -2\\,\\text{Re}(x^\\rho/\\rho) \\in \\mathbb{R}\\).'
                }
            ]
        },

        // ================================================================
        // SECTION 4: Riemann's Formula for pi(x)
        // ================================================================
        {
            id: 'sec-riemann-explicit',
            title: "Riemann's Formula for \\(\\pi(x)\\)",
            content: `
<h2>Riemann's Formula for \\(\\pi(x)\\)</h2>

<p>In his 1859 paper, Riemann derived a formula for \\(\\pi(x)\\) directly. His approach was different: he worked with \\(\\Pi(x) = \\sum_{n=1}^\\infty \\pi(x^{1/n})/n\\), then used Mobius inversion.</p>

<h3>The Riemann \\(\\Pi\\) Function</h3>

<p>Define:
\\[
\\Pi(x) = \\sum_{p^k \\leq x} \\frac{1}{k} = \\pi(x) + \\frac{1}{2}\\pi(x^{1/2}) + \\frac{1}{3}\\pi(x^{1/3}) + \\cdots
\\]
This is finite since \\(\\pi(x^{1/k}) = 0\\) for \\(x^{1/k} < 2\\), i.e., \\(k > \\log_2 x\\).</p>

<p>Riemann showed:
\\[
\\Pi(x) = \\text{Li}(x) - \\sum_\\rho \\text{Li}(x^\\rho) - \\log 2 + \\int_x^\\infty \\frac{dt}{t(t^2-1)\\log t},
\\]
where \\(\\text{Li}(x) = \\int_0^x \\frac{dt}{\\log t}\\) (principal value) and the sum runs over non-trivial zeros.</p>

<p>Recovering \\(\\pi(x)\\) from \\(\\Pi(x)\\) via Mobius inversion:
\\[
\\pi(x) = \\sum_{n=1}^\\infty \\frac{\\mu(n)}{n} \\Pi(x^{1/n}) = \\Pi(x) - \\frac{1}{2}\\Pi(x^{1/2}) - \\frac{1}{3}\\Pi(x^{1/3}) - \\frac{1}{5}\\Pi(x^{1/5}) + \\frac{1}{6}\\Pi(x^{1/6}) - \\cdots
\\]
</p>

<div class="env-block remark">
    <div class="env-title">Li(x) vs \\(\\pi(x)\\)</div>
    <div class="env-body">
        <p>Gauss conjectured and de la Vallee Poussin proved that \\(\\pi(x) \\sim \\text{Li}(x) \\sim x/\\log x\\). The explicit formula shows that \\(\\pi(x) - \\text{Li}(x) = -\\sum_\\rho \\text{Li}(x^\\rho)/\\mu(?) + \\cdots\\). Remarkably, \\(\\text{Li}(x) > \\pi(x)\\) for all computed values of \\(x\\), but Littlewood (1914) proved this inequality reverses infinitely often. The first sign change (the Skewes number) is known to occur before \\(e^{e^{e^{79}}}\\), and computationally is estimated near \\(10^{316}\\).</p>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-skewes"></div>

<h3>The Oscillating Contributions from Zeros</h3>

<p>The term \\(-\\text{Li}(x^\\rho)\\) for a non-trivial zero \\(\\rho = \\frac{1}{2} + i\\gamma\\):
\\[
\\text{Li}(x^\\rho) \\approx \\frac{x^\\rho}{\\log x^\\rho} = \\frac{x^{1/2} e^{i\\gamma \\log x}}{\\frac{1}{2}\\log x + i\\gamma \\log x}.
\\]
For large \\(\\gamma\\), this is approximately \\(x^{1/2}/(i\\gamma \\log x) \\cdot e^{i\\gamma \\log x}\\), an oscillation of amplitude \\(x^{1/2}/(\\gamma \\log x)\\).</p>

<p>The sum over all zeros produces the fluctuations visible in \\(\\pi(x) - \\text{Li}(x)\\).</p>
`,
            visualizations: [
                {
                    id: 'viz-skewes',
                    title: "Li(x) - pi(x): The Slow Oscillation",
                    description: 'Li(x) - pi(x) is positive for all computed x up to around 10^19, but Littlewood proved it changes sign infinitely often. This visualization shows the slow drift and illustrates why the eventual sign change (Skewes number) is so enormous.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, { width: 640, height: 320, originX: 0, originY: 0, scale: 1 });

                        // Precomputed Li(x) - pi(x) values from known data
                        // Using actual pi(x) data and Li(x) = integral approximation
                        var knownData = [
                            [10, 5.12, 4, 1.12],
                            [100, 30.13, 25, 5.13],
                            [1000, 177.6, 168, 9.6],
                            [10000, 1246.1, 1229, 17.1],
                            [100000, 9629.8, 9592, 37.8],
                            [1000000, 78627.5, 78498, 129.5],
                            [10000000, 664918.4, 664579, 339.4],
                            [100000000, 5762209.4, 5761455, 754.4],
                            [1000000000, 50849234.9, 50847534, 1700.9],
                            [10000000000, 455052511.3, 455052511, 0.3]
                        ];

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var W = viz.width, H = viz.height;
                            ctx.fillStyle = '#0c0c20'; ctx.fillRect(0, 0, W, H);

                            var plotLeft = 80, plotRight = W - 30, plotTop = 30, plotBottom = H - 50;
                            var plotW = plotRight - plotLeft, plotH = plotBottom - plotTop;

                            // Use log scale for x (log10)
                            var xMin = 1, xMax = 10; // log10(x) range

                            function px(logx) { return plotLeft + (logx - xMin) / (xMax - xMin) * plotW; }
                            function py(v, vMax) { return plotBottom - (v / vMax) * plotH * 0.85; }

                            var maxDiff = 2000;

                            // Grid
                            ctx.strokeStyle = '#1a1a40'; ctx.lineWidth = 0.5;
                            for (var g = 0; g <= 4; g++) {
                                var yg = plotTop + g * plotH / 4;
                                ctx.beginPath(); ctx.moveTo(plotLeft, yg); ctx.lineTo(plotRight, yg); ctx.stroke();
                            }
                            for (var xi2 = xMin; xi2 <= xMax; xi2++) {
                                var xp2 = px(xi2);
                                ctx.beginPath(); ctx.moveTo(xp2, plotTop); ctx.lineTo(xp2, plotBottom); ctx.stroke();
                            }

                            // Zero line
                            ctx.strokeStyle = '#f85149'; ctx.lineWidth = 1.5; ctx.setLineDash([6, 4]);
                            var py0 = py(0, maxDiff);
                            ctx.beginPath(); ctx.moveTo(plotLeft, py0); ctx.lineTo(plotRight, py0); ctx.stroke();
                            ctx.setLineDash([]);

                            // Li(x) - pi(x) curve (using data points)
                            ctx.strokeStyle = '#58a6ff'; ctx.lineWidth = 2.5;
                            ctx.beginPath();
                            knownData.forEach(function(d, i) {
                                var lx = Math.log10(d[0]);
                                var diff = d[1] - d[2];
                                var ppx = px(lx), ppy = py(diff, maxDiff);
                                if (i === 0) ctx.moveTo(ppx, ppy); else ctx.lineTo(ppx, ppy);
                            });
                            ctx.stroke();

                            // Points
                            knownData.forEach(function(d) {
                                var lx = Math.log10(d[0]);
                                var diff = d[1] - d[2];
                                var ppx = px(lx), ppy = py(diff, maxDiff);
                                ctx.fillStyle = '#58a6ff';
                                ctx.beginPath(); ctx.arc(ppx, ppy, 4, 0, Math.PI * 2); ctx.fill();
                            });

                            // Skewes note
                            ctx.fillStyle = '#f85149'; ctx.font = 'italic 11px sans-serif'; ctx.textAlign = 'center';
                            ctx.fillText('Li(x) > \u03c0(x) for all x up to ~10\u00b9\u2079 (computed)', W / 2, py0 - 10);
                            ctx.fillText('First sign change (Skewes number) \u2248 10\u00b3\u00b9\u2076', W / 2, plotTop + 15);

                            // Axes
                            ctx.strokeStyle = '#4a4a7a'; ctx.lineWidth = 1.5;
                            ctx.beginPath(); ctx.moveTo(plotLeft, plotBottom); ctx.lineTo(plotRight, plotBottom); ctx.stroke();
                            ctx.beginPath(); ctx.moveTo(plotLeft, plotTop); ctx.lineTo(plotLeft, plotBottom); ctx.stroke();

                            // Axis labels
                            ctx.fillStyle = '#8b949e'; ctx.font = '10px sans-serif'; ctx.textAlign = 'center';
                            for (var xi3 = 1; xi3 <= 10; xi3++) {
                                ctx.fillText('10\u02e3'.replace('z', xi3), px(xi3), plotBottom + 16);
                            }
                            ctx.textAlign = 'right';
                            [0, 500, 1000, 1500, 2000].forEach(function(v) {
                                ctx.fillText(v.toString(), plotLeft - 5, py(v, maxDiff));
                            });

                            // Labels
                            ctx.fillStyle = '#f0f6fc'; ctx.font = 'bold 13px sans-serif'; ctx.textAlign = 'center';
                            ctx.fillText('Li(x) \u2212 \u03c0(x) vs x (log scale)', W / 2, H - 10);
                            ctx.fillStyle = '#8b949e'; ctx.font = '10px sans-serif';
                            ctx.fillText('x (log\u2081\u2080 scale)', W / 2, plotBottom + 32);
                            ctx.save(); ctx.translate(15, plotTop + plotH / 2); ctx.rotate(-Math.PI / 2);
                            ctx.fillText('Li(x) \u2212 \u03c0(x)', 0, 0); ctx.restore();
                        }

                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Gauss noticed empirically that \\(\\text{Li}(x) > \\pi(x)\\) for all \\(x\\) he computed. Littlewood proved this fails for some \\(x < e^{e^{e^{79}}}\\). Why does the explicit formula make a sign change plausible? (Hint: consider the oscillating zero contributions.)',
                    hint: 'The formula \\(\\pi(x) - \\text{Li}(x) = -\\sum_\\rho \\text{Li}(x^\\rho) + \\ldots\\) contains oscillating terms. Can oscillations of amplitude \\(x^{1/2}/\\log x\\) accumulate to cancel the bias?',
                    solution: 'The formula shows \\(\\pi(x) - \\text{Li}(x) = -\\sum_\\rho \\text{Li}(x^\\rho) + \\ldots\\), where each zero contributes an oscillation of amplitude \\(\\sim x^{1/2}/(|\\gamma| \\log x)\\). While \\(\\text{Li}(x)\\) leads \\(\\pi(x)\\) initially due to the structure of the prime distribution, the sum of infinitely many oscillating terms can, at specific values of \\(x\\), push \\(\\pi(x) - \\text{Li}(x)\\) positive. Littlewood showed these cancellations must occur; finding the precise \\(x\\) requires detailed knowledge of zero locations.'
                },
                {
                    question: 'The function \\(\\Pi(x)\\) defined by Riemann satisfies \\(\\Pi(x) = \\pi(x) + \\frac{1}{2}\\pi(x^{1/2}) + \\frac{1}{3}\\pi(x^{1/3}) + \\cdots\\). For \\(x = 100\\), compute \\(\\Pi(100)\\) using \\(\\pi(100) = 25\\), \\(\\pi(10) = 4\\), \\(\\pi(100^{1/3}) = \\pi(4.64) = 2\\), \\(\\pi(100^{1/k}) = 1\\) for \\(k = 4, 5, 6\\), and zero thereafter.',
                    hint: 'Only finitely many terms contribute since \\(\\pi(x^{1/k}) = 0\\) for \\(x^{1/k} < 2\\).',
                    solution: '\\(\\Pi(100) = \\pi(100) + \\frac{1}{2}\\pi(10) + \\frac{1}{3}\\pi(100^{1/3}) + \\frac{1}{4}\\pi(100^{1/4}) + \\frac{1}{5}\\pi(100^{1/5}) + \\frac{1}{6}\\pi(100^{1/6}) + \\cdots\\). We have \\(100^{1/4} \\approx 3.16\\), \\(\\pi(3.16)=2\\); \\(100^{1/5} \\approx 2.51\\), \\(\\pi(2.51)=1\\); \\(100^{1/6} \\approx 2.15\\), \\(\\pi(2.15)=1\\); \\(100^{1/7} \\approx 1.93 < 2\\), so \\(\\pi = 0\\). Thus \\(\\Pi(100) = 25 + 2 + 2/3 + 2/4 + 1/5 + 1/6 = 25 + 2 + 0.667 + 0.5 + 0.2 + 0.167 \\approx 28.53\\).'
                }
            ]
        },

        // ================================================================
        // SECTION 5: The Error Term Under RH
        // ================================================================
        {
            id: 'sec-rh-error',
            title: 'The Error Term Under RH',
            content: `
<h2>The Error Term Under RH</h2>

<h3>Classical Bound</h3>

<p>From the zero-free region \\(\\{\\sigma > 1 - c/\\log t\\}\\), one can show (Chapter 7):
\\[
\\psi(x) = x + O\\left(x \\exp\\left(-c\\sqrt{\\log x}\\right)\\right).
\\]
This is stronger than any power of \\(\\log x\\) but weaker than any power \\(x^\\epsilon\\).</p>

<h3>Under the Riemann Hypothesis</h3>

<div class="env-block theorem">
    <div class="env-title">Theorem 8.2 (RH implies sharp error bound)</div>
    <div class="env-body">
        <p>The Riemann Hypothesis (all non-trivial zeros have \\(\\text{Re}(\\rho) = 1/2\\)) is equivalent to
        \\[
        \\psi(x) = x + O\\left(x^{1/2} \\log^2 x\\right).
        \\]
        Equivalently, \\(\\pi(x) = \\text{Li}(x) + O\\left(x^{1/2}\\log x\\right)\\).</p>
    </div>
</div>

<p>The proof: if RH holds, each zero contribution \\(|x^\\rho/\\rho| = x^{1/2}/|\\rho|\\). Summing over zeros with \\(|\\gamma| \\leq T\\) (there are \\(\\sim T \\log T / (2\\pi)\\) such zeros) and choosing \\(T = x\\):
\\[
\\left|\\sum_{|\\gamma| \\leq x} \\frac{x^\\rho}{\\rho}\\right| \\lesssim x^{1/2} \\sum_{|\\gamma| \\leq x} \\frac{1}{|\\gamma|} \\lesssim x^{1/2} \\log^2 x.
\\]
</p>

<div class="env-block remark">
    <div class="env-title">The Converse</div>
    <div class="env-body">
        <p>Ingham (1932) showed the converse: if \\(\\psi(x) = x + O(x^{\\theta + \\epsilon})\\) for all \\(\\epsilon > 0\\), then all zeros satisfy \\(\\text{Re}(\\rho) \\leq \\theta\\). So \\(\\theta = 1/2\\) in the error bound is exactly the Riemann Hypothesis. Any improvement to \\(\\psi(x) = x + O(x^{1/2-\\epsilon})\\) would be false — oscillations of order \\(x^{1/2}\\) are provably present (von Koch, 1901).</p>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-rh-vs-classical"></div>

<h3>Von Koch's Lower Bound</h3>

<p>Von Koch (1901) proved that under RH,
\\[
\\limsup_{x \\to \\infty} \\frac{\\psi(x) - x}{x^{1/2} \\log\\log\\log x} > 0.
\\]
So the \\(x^{1/2}\\) growth of the error is not just an artifact of the method — it is really there.</p>

<p>More precisely, Cramér conjectured \\(p_{n+1} - p_n = O((\\log p_n)^2)\\), consistent with RH but a much stronger statement about prime gaps.</p>
`,
            visualizations: [
                {
                    id: 'viz-rh-vs-classical',
                    title: 'Error Bounds: Classical vs Under RH',
                    description: 'Side-by-side comparison of \\(|\\psi(x) - x|\\) vs the two error bounds: classical \\(x e^{-c\\sqrt{\\log x}}\\) and RH bound \\(x^{1/2}\\log^2 x\\). See how RH dramatically tightens the error.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, { width: 640, height: 360, originX: 0, originY: 0, scale: 1 });
                        var showRH = true;
                        var showClassical = true;

                        VizEngine.createButton(controls, 'Toggle RH bound', function() { showRH = !showRH; draw(); });
                        VizEngine.createButton(controls, 'Toggle Classical bound', function() { showClassical = !showClassical; draw(); });

                        // Approximate psi(x) - x using first 50 zeros
                        var ZEROS = [14.134725,21.022040,25.010858,30.424876,32.935062,37.586178,40.918719,43.327073,48.005151,49.773832,52.970321,56.446248,59.347044,60.831779,65.112544,67.079811,69.546402,72.067158,75.704691,77.144840,79.337375,82.910381,84.735493,87.425275,88.809111,92.491899,94.651344,95.870634,98.831194,101.317851];

                        function psiError(x, nZeros) {
                            var beta = 0.5;
                            var sum = 0;
                            for (var i = 0; i < nZeros; i++) {
                                var g = ZEROS[i];
                                var rhoAbs2 = 0.25 + g * g;
                                var xb = Math.pow(x, beta);
                                // -2 Re(x^rho / rho)
                                var re = (0.5 * Math.cos(g * Math.log(x)) + g * Math.sin(g * Math.log(x))) / rhoAbs2;
                                sum += -2 * xb * re;
                            }
                            return Math.abs(sum);
                        }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var W = viz.width, H = viz.height;
                            ctx.fillStyle = '#0c0c20'; ctx.fillRect(0, 0, W, H);

                            var plotLeft = 70, plotRight = W - 20, plotTop = 30, plotBottom = H - 50;
                            var plotW = plotRight - plotLeft, plotH = plotBottom - plotTop;

                            var xMin = 2, xMax = 200;
                            var steps = 300;

                            function px(xv) { return plotLeft + (xv - xMin) / (xMax - xMin) * plotW; }

                            // Find y range
                            var yMax = 0;
                            for (var i = 0; i <= steps; i++) {
                                var xv = xMin + (xMax - xMin) * i / steps;
                                var cl = xv * Math.exp(-0.5 * Math.sqrt(Math.log(xv)));
                                yMax = Math.max(yMax, cl);
                            }
                            yMax = Math.min(yMax, 200);

                            function py(yv) { return plotBottom - (yv / yMax) * plotH * 0.9; }

                            // Grid
                            ctx.strokeStyle = '#1a1a40'; ctx.lineWidth = 0.5;
                            for (var g = 0; g <= 4; g++) {
                                var yg = plotTop + g * plotH / 4;
                                ctx.beginPath(); ctx.moveTo(plotLeft, yg); ctx.lineTo(plotRight, yg); ctx.stroke();
                            }

                            // Classical bound
                            if (showClassical) {
                                ctx.strokeStyle = '#d29922'; ctx.lineWidth = 2; ctx.setLineDash([6, 3]);
                                ctx.beginPath();
                                var started = false;
                                for (var i2 = 0; i2 <= steps; i2++) {
                                    var xv2 = xMin + (xMax - xMin) * i2 / steps;
                                    if (xv2 < 3) continue;
                                    var cl2 = xv2 * Math.exp(-0.5 * Math.sqrt(Math.log(xv2)));
                                    var ppx2 = px(xv2), ppy2 = py(cl2);
                                    if (!isFinite(ppy2) || ppy2 < plotTop - 5) { started = false; continue; }
                                    if (!started) { ctx.moveTo(ppx2, ppy2); started = true; } else { ctx.lineTo(ppx2, ppy2); }
                                }
                                ctx.stroke(); ctx.setLineDash([]);
                            }

                            // RH bound: x^0.5 * (log x)^2 / 10 for display
                            if (showRH) {
                                ctx.strokeStyle = '#3fb9a0'; ctx.lineWidth = 2; ctx.setLineDash([4, 4]);
                                ctx.beginPath();
                                var started3 = false;
                                for (var i3 = 0; i3 <= steps; i3++) {
                                    var xv3 = xMin + (xMax - xMin) * i3 / steps;
                                    var rhb = Math.sqrt(xv3) * Math.pow(Math.log(Math.max(xv3, 2)), 2) / 4;
                                    var ppx3 = px(xv3), ppy3 = py(rhb);
                                    if (!isFinite(ppy3) || ppy3 < plotTop - 5) { started3 = false; continue; }
                                    if (!started3) { ctx.moveTo(ppx3, ppy3); started3 = true; } else { ctx.lineTo(ppx3, ppy3); }
                                }
                                ctx.stroke(); ctx.setLineDash([]);
                            }

                            // Actual |psi(x) - x| approximation
                            ctx.strokeStyle = '#f85149'; ctx.lineWidth = 2.5;
                            ctx.beginPath();
                            var started2 = false;
                            for (var i4 = 0; i4 <= steps; i4++) {
                                var xv4 = xMin + (xMax - xMin) * i4 / steps;
                                if (xv4 < 3) continue;
                                var err = psiError(xv4, 30);
                                var ppx4 = px(xv4), ppy4 = py(err);
                                if (!isFinite(ppy4) || ppy4 < plotTop - 5) { started2 = false; continue; }
                                if (!started2) { ctx.moveTo(ppx4, ppy4); started2 = true; } else { ctx.lineTo(ppx4, ppy4); }
                            }
                            ctx.stroke();

                            // Axes
                            ctx.strokeStyle = '#4a4a7a'; ctx.lineWidth = 1.5;
                            ctx.beginPath(); ctx.moveTo(plotLeft, plotBottom); ctx.lineTo(plotRight, plotBottom); ctx.stroke();
                            ctx.beginPath(); ctx.moveTo(plotLeft, plotTop); ctx.lineTo(plotLeft, plotBottom); ctx.stroke();

                            // Labels
                            ctx.fillStyle = '#8b949e'; ctx.font = '10px sans-serif'; ctx.textAlign = 'center';
                            [50, 100, 150, 200].forEach(function(xv5) {
                                ctx.fillText(xv5.toString(), px(xv5), plotBottom + 14);
                            });
                            ctx.textAlign = 'right';
                            [0, 50, 100, 150, 200].forEach(function(yv) {
                                ctx.fillText(yv.toString(), plotLeft - 5, py(yv));
                            });

                            // Legend
                            var legX = plotLeft + 10, legY = plotTop + 10;
                            ctx.font = '11px sans-serif'; ctx.textAlign = 'left';
                            ctx.strokeStyle = '#f85149'; ctx.lineWidth = 2.5;
                            ctx.beginPath(); ctx.moveTo(legX, legY + 6); ctx.lineTo(legX + 20, legY + 6); ctx.stroke();
                            ctx.fillStyle = '#f85149'; ctx.fillText('|\u03c8(x)\u2212x| (30 zeros)', legX + 24, legY + 9);

                            if (showRH) {
                                ctx.strokeStyle = '#3fb9a0'; ctx.lineWidth = 2; ctx.setLineDash([4, 4]);
                                ctx.beginPath(); ctx.moveTo(legX, legY + 22); ctx.lineTo(legX + 20, legY + 22); ctx.stroke(); ctx.setLineDash([]);
                                ctx.fillStyle = '#3fb9a0'; ctx.fillText('RH bound: x\u00bd(log x)\u00b2/4', legX + 24, legY + 25);
                            }
                            if (showClassical) {
                                ctx.strokeStyle = '#d29922'; ctx.lineWidth = 2; ctx.setLineDash([6, 3]);
                                ctx.beginPath(); ctx.moveTo(legX, legY + 38); ctx.lineTo(legX + 20, legY + 38); ctx.stroke(); ctx.setLineDash([]);
                                ctx.fillStyle = '#d29922'; ctx.fillText('Classical: x\u00b7e^\u207b\u1d9e\u221a(log x)', legX + 24, legY + 41);
                            }

                            ctx.fillStyle = '#f0f6fc'; ctx.font = 'bold 12px sans-serif'; ctx.textAlign = 'center';
                            ctx.fillText('Error bounds on \u03c8(x): RH vs classical', W / 2, H - 10);
                        }

                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'The classical error bound is \\(O(x \\exp(-c\\sqrt{\\log x}))\\). How large must \\(x\\) be before this exceeds \\(x^{0.99}\\)? Show that for any \\(\\alpha < 1\\), the classical bound eventually beats \\(x^\\alpha\\).',
                    hint: 'Compare \\(x e^{-c\\sqrt{\\log x}}\\) with \\(x^\\alpha\\): when does \\(x^{1-\\alpha} > e^{c\\sqrt{\\log x}}\\)?',
                    solution: 'Set \\(x^{1-\\alpha} = e^{c\\sqrt{\\log x}}\\). Taking logs: \\((1-\\alpha)\\log x = c\\sqrt{\\log x}\\). Let \\(u = \\sqrt{\\log x}\\): \\((1-\\alpha)u^2 = cu\\), so \\(u = c/(1-\\alpha)\\) and \\(\\log x = c^2/(1-\\alpha)^2\\). For \\(x\\) larger than \\(e^{c^2/(1-\\alpha)^2}\\), the classical bound is smaller than \\(x^\\alpha\\). So the classical bound beats any fixed power \\(x^\\alpha\\) (\\(\\alpha < 1\\)) for large enough \\(x\\), but the threshold grows as \\(\\alpha \\to 1\\).'
                },
                {
                    question: 'Assuming RH, prove that \\(\\pi(2x) - \\pi(x) > 0\\) for all \\(x \\geq 25\\). (Hint: \\(\\pi(2x) - \\pi(x) = [\\text{Li}(2x) - \\text{Li}(x)] + O(x^{1/2}\\log x)\\). Show the main term dominates.)',
                    hint: '\\(\\text{Li}(2x) - \\text{Li}(x) \\sim x/\\log x\\) by the PNT. The error is \\(O(x^{1/2}\\log x)\\), which is smaller for large \\(x\\).',
                    solution: 'By the PNT with explicit form, \\(\\pi(2x) - \\pi(x) = [\\text{Li}(2x) - \\text{Li}(x)] + O(x^{1/2}\\log x)\\). Now \\(\\text{Li}(2x) - \\text{Li}(x) = \\int_x^{2x} \\frac{dt}{\\log t} \\geq \\frac{x}{\\log(2x)}\\). For large \\(x\\), \\(x/\\log(2x) \\gg x^{1/2}\\log x\\) (since \\(x^{1/2} \\to \\infty\\) faster than \\(\\log^2 x\\)). So the main term dominates and the count is positive. This is Bertrand\'s postulate (rigorously proved by Chebyshev without RH, but the RH approach gives the sharp asymptotic).'
                }
            ]
        },

        // ================================================================
        // SECTION 6: From Zeta to L-functions
        // ================================================================
        {
            id: 'sec-bridge',
            title: 'From Zeta to L-functions',
            content: `
<h2>From Zeta to L-functions</h2>

<p>The explicit formula for \\(\\psi(x)\\) is not special to the Riemann zeta function. It applies to any Dirichlet L-function \\(L(s, \\chi)\\) and yields precise information about primes in arithmetic progressions.</p>

<h3>Explicit Formula for \\(\\psi(x, \\chi)\\)</h3>

<p>For a Dirichlet character \\(\\chi \\pmod{q}\\), define:
\\[
\\psi(x, \\chi) = \\sum_{n \\leq x} \\Lambda(n)\\chi(n).
\\]
The analogous explicit formula is:
\\[
\\psi(x, \\chi) = -\\frac{\\delta_{\\chi,\\chi_0} \\cdot x}{1} - \\sum_\\rho \\frac{x^\\rho}{\\rho} - \\text{(constant terms)},
\\]
where \\(\\delta_{\\chi,\\chi_0} = 1\\) if \\(\\chi\\) is principal (contributing the main term \\(x/\\phi(q)\\) to Dirichlet's theorem) and the sum runs over non-trivial zeros of \\(L(s,\\chi)\\).</p>

<p>By orthogonality of characters:
\\[
\\psi(x; q, a) = \\frac{1}{\\phi(q)} \\sum_\\chi \\bar\\chi(a) \\psi(x, \\chi) \\approx \\frac{x}{\\phi(q)} - \\frac{1}{\\phi(q)} \\sum_\\chi \\bar\\chi(a) \\sum_\\rho \\frac{x^\\rho}{\\rho}.
\\]
</p>

<div class="env-block theorem">
    <div class="env-title">Theorem 8.3 (Primes in Arithmetic Progressions, error form)</div>
    <div class="env-body">
        <p>For \\(\\gcd(a, q) = 1\\),
        \\[
        \\psi(x; q, a) = \\frac{x}{\\phi(q)} + E(x; q, a),
        \\]
        where \\(|E(x; q, a)| \\leq C \\cdot x^\\beta_1 \\log^2 x + O(x^{1/2}\\log^2(qx)),
        \\]
        with \\(\\beta_1\\) the real part of any Siegel zero of the L-functions modulo \\(q\\), and the second error assuming GRH for the remaining zeros.</p>
    </div>
</div>

<h3>The Generalized Riemann Hypothesis</h3>

<p>GRH states that all non-trivial zeros of all Dirichlet L-functions have real part \\(1/2\\). Under GRH:
\\[
\\pi(x; q, a) = \\frac{\\text{Li}(x)}{\\phi(q)} + O\\left(\\sqrt{x}\\log(qx)\\right).
\\]
The \\(\\sqrt{x}\\log(qx)\\) error captures the oscillation due to zero contributions from all L-functions with conductor \\(q\\).</p>

<div class="env-block remark">
    <div class="env-title">Bombieri-Vinogradov as Average GRH</div>
    <div class="env-body">
        <p>The Bombieri-Vinogradov theorem (Chapter 13) says that on average over \\(q \\leq x^{1/2}/\\log^A x\\), the error in \\(\\pi(x; q, a)\\) is as small as GRH predicts. It is often called "GRH on average" and is unconditional, making it a powerful substitute for GRH in applications.</p>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-zero-superposition"></div>

<h3>Scope of the Explicit Formula</h3>

<p>The explicit formula is the key mechanism connecting:
<ul>
    <li>Analytic properties of L-functions (location of zeros) ↔ distribution of primes</li>
    <li>Hypotheses about zeros (RH, GRH) ↔ precision of prime counting results</li>
    <li>Siegel zeros (potential real zeros near \\(s=1\\)) ↔ exceptional irregularities in prime distribution</li>
</ul>
</p>

<p>In the next chapter, we develop Dirichlet characters and L-functions systematically, building toward the proof of Dirichlet's theorem and the deeper analytic theory.</p>
`,
            visualizations: [
                {
                    id: 'viz-zero-superposition',
                    title: 'STAR VISUALIZATION: Zero Superposition — Psi(x) from Waves',
                    description: 'The centerpiece of the course. Start with the main term y = x (flat trend). Add zeta zero contributions one by one. Watch the smooth waves gradually build up the staircase structure of \\(\\psi(x)\\). Slider: number of zeros included (1 to 50). The staircase of prime powers emerges from the symphony of oscillations.',
                    setup: function(body, controls) {
                        var ZEROS = [14.134725,21.022040,25.010858,30.424876,32.935062,37.586178,40.918719,43.327073,48.005151,49.773832,52.970321,56.446248,59.347044,60.831779,65.112544,67.079811,69.546402,72.067158,75.704691,77.144840,79.337375,82.910381,84.735493,87.425275,88.809111,92.491899,94.651344,95.870634,98.831194,101.317851,103.725539,105.446623,107.168611,111.029536,111.874659,114.320221,116.226680,118.790783,121.370125,122.946829,124.256819,127.516684,129.578704,131.087688,133.497737,134.756510,138.116042,139.736209,141.123707,143.111846];

                        var viz = new VizEngine(body, { width: 700, height: 420, originX: 0, originY: 0, scale: 1 });
                        var numZeros = 1;
                        var showTrue = true;
                        var animating = false;
                        var animFrame = null;

                        // Slider
                        var slider = VizEngine.createSlider(controls, 'Zeros included', 0, 50, numZeros, 1, function(v) {
                            numZeros = Math.round(v);
                            if (animating) { cancelAnimationFrame(animFrame); animating = false; }
                            draw();
                        });
                        VizEngine.createButton(controls, 'Animate +1 zero', function() {
                            if (numZeros < 50) {
                                numZeros++;
                                slider.value = numZeros;
                                slider.dispatchEvent(new Event('input'));
                            }
                        });
                        VizEngine.createButton(controls, 'Play through all', function() {
                            if (animating) { cancelAnimationFrame(animFrame); animating = false; return; }
                            numZeros = 0;
                            animating = true;
                            function step() {
                                if (numZeros < 50 && animating) {
                                    numZeros++;
                                    slider.value = numZeros;
                                    draw();
                                    animFrame = setTimeout(step, 180);
                                } else { animating = false; }
                            }
                            step();
                        });
                        VizEngine.createButton(controls, 'Toggle true \u03c8(x)', function() {
                            showTrue = !showTrue;
                            draw();
                        });

                        // Precompute true psi(x) via sieve
                        function computePsi(xMax) {
                            var limit = Math.floor(xMax);
                            var psi = new Float64Array(limit + 1);
                            // Sieve of Eratosthenes to get smallest prime factor
                            var spf = new Int32Array(limit + 1);
                            for (var i = 2; i <= limit; i++) spf[i] = i;
                            for (var p = 2; p * p <= limit; p++) {
                                if (spf[p] === p) { // p is prime
                                    for (var j = p * p; j <= limit; j += p) {
                                        if (spf[j] === j) spf[j] = p;
                                    }
                                }
                            }
                            // Compute Lambda(n) = log(p) if n is prime power
                            var cumPsi = 0;
                            for (var n = 2; n <= limit; n++) {
                                var m = n, p2 = spf[n];
                                var isPrimePower = true;
                                while (m > 1) {
                                    if (spf[m] !== p2) { isPrimePower = false; break; }
                                    m = Math.floor(m / spf[m]);
                                }
                                if (isPrimePower) cumPsi += Math.log(p2);
                                psi[n] = cumPsi;
                            }
                            psi[0] = 0; psi[1] = 0;
                            return psi;
                        }

                        var xMax = 100;
                        var truePsi = computePsi(xMax);

                        function approxPsi(x, nZeros) {
                            // psi(x) = x - sum_rho 2*Re(x^rho/rho) - log(2pi) - 0.5*log(1-x^-2)
                            var val = x - Math.log(2 * Math.PI);
                            if (x > 1) val -= 0.5 * Math.log(1 - 1 / (x * x));
                            for (var i = 0; i < nZeros; i++) {
                                var g = ZEROS[i];
                                var beta = 0.5;
                                var rhoAbs2 = beta * beta + g * g;
                                var xb = Math.pow(x, beta);
                                var logX = Math.log(x);
                                // -2 Re(x^rho / rho): rho = beta + ig, x^rho = x^beta * e^{ig log x}
                                // Re(x^rho/rho) = x^beta * Re(e^{ig log x}/(beta+ig))
                                //              = x^beta * (beta*cos(g*logX) + g*sin(g*logX)) / rhoAbs2
                                var reContrib = xb * (beta * Math.cos(g * logX) + g * Math.sin(g * logX)) / rhoAbs2;
                                val -= 2 * reContrib;
                            }
                            return val;
                        }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var W = viz.width, H = viz.height;
                            ctx.fillStyle = '#0c0c20'; ctx.fillRect(0, 0, W, H);

                            var plotLeft = 60, plotRight = W - 20, plotTop = 30, plotBottom = H - 55;
                            var plotW = plotRight - plotLeft, plotH = plotBottom - plotTop;

                            function px(xv) { return plotLeft + (xv / xMax) * plotW; }
                            function py(yv) { return plotBottom - (yv / xMax) * plotH * 0.95; }

                            // Grid
                            ctx.strokeStyle = '#1a1a40'; ctx.lineWidth = 0.5;
                            for (var gv = 0; gv <= 100; gv += 10) {
                                var xg = px(gv);
                                ctx.beginPath(); ctx.moveTo(xg, plotTop); ctx.lineTo(xg, plotBottom); ctx.stroke();
                                var yg2 = py(gv);
                                ctx.beginPath(); ctx.moveTo(plotLeft, yg2); ctx.lineTo(plotRight, yg2); ctx.stroke();
                            }

                            // True psi(x) staircase
                            if (showTrue) {
                                ctx.strokeStyle = '#ffffff55'; ctx.lineWidth = 1.5;
                                ctx.beginPath();
                                ctx.moveTo(px(0), py(0));
                                for (var xi = 2; xi <= xMax; xi++) {
                                    var yPrev = truePsi[xi - 1] || 0;
                                    var yCurr = truePsi[xi] || 0;
                                    ctx.lineTo(px(xi), py(yPrev));
                                    ctx.lineTo(px(xi), py(yCurr));
                                }
                                ctx.stroke();
                            }

                            // Main term y = x (when numZeros = 0)
                            if (numZeros === 0) {
                                ctx.strokeStyle = '#58a6ff'; ctx.lineWidth = 2;
                                ctx.beginPath(); ctx.moveTo(px(0), py(0)); ctx.lineTo(px(xMax), py(xMax)); ctx.stroke();
                                ctx.fillStyle = '#58a6ff'; ctx.font = '12px sans-serif'; ctx.textAlign = 'left';
                                ctx.fillText('Main term: y = x', px(5), py(xMax) + 15);
                            } else {
                                // Explicit formula approximation
                                var steps = 500;
                                ctx.strokeStyle = '#f0883e'; ctx.lineWidth = 2.5;
                                ctx.beginPath();
                                var started = false;
                                for (var i = 0; i <= steps; i++) {
                                    var xv = 1.5 + (xMax - 1.5) * i / steps;
                                    var yv = approxPsi(xv, numZeros);
                                    var ppx = px(xv), ppy = py(yv);
                                    if (!isFinite(ppy) || ppy > plotBottom + 10 || ppy < plotTop - 10) { started = false; continue; }
                                    if (!started) { ctx.moveTo(ppx, ppy); started = true; } else { ctx.lineTo(ppx, ppy); }
                                }
                                ctx.stroke();

                                // Also draw the pure main term faintly
                                ctx.strokeStyle = '#58a6ff44'; ctx.lineWidth = 1.5; ctx.setLineDash([4, 4]);
                                ctx.beginPath(); ctx.moveTo(px(0), py(0)); ctx.lineTo(px(xMax), py(xMax)); ctx.stroke();
                                ctx.setLineDash([]);
                            }

                            // Axes
                            ctx.strokeStyle = '#4a4a7a'; ctx.lineWidth = 1.5;
                            ctx.beginPath(); ctx.moveTo(plotLeft, plotBottom); ctx.lineTo(plotRight, plotBottom); ctx.stroke();
                            ctx.beginPath(); ctx.moveTo(plotLeft, plotTop); ctx.lineTo(plotLeft, plotBottom); ctx.stroke();

                            // Labels
                            ctx.fillStyle = '#8b949e'; ctx.font = '10px sans-serif'; ctx.textAlign = 'center';
                            [0, 20, 40, 60, 80, 100].forEach(function(xv2) {
                                ctx.fillText(xv2.toString(), px(xv2), plotBottom + 14);
                            });
                            ctx.textAlign = 'right';
                            [0, 20, 40, 60, 80, 100].forEach(function(yv2) {
                                ctx.fillText(yv2.toString(), plotLeft - 5, py(yv2));
                            });

                            // Legend
                            var legX = plotLeft + 10, legY = plotTop + 8;
                            ctx.font = '11px sans-serif'; ctx.textAlign = 'left';
                            if (showTrue) {
                                ctx.strokeStyle = '#ffffff55'; ctx.lineWidth = 1.5;
                                ctx.beginPath(); ctx.moveTo(legX, legY + 6); ctx.lineTo(legX + 18, legY + 6); ctx.stroke();
                                ctx.fillStyle = '#ffffff88'; ctx.fillText('True \u03c8(x) staircase', legX + 22, legY + 9);
                                legY += 18;
                            }
                            if (numZeros === 0) {
                                ctx.strokeStyle = '#58a6ff'; ctx.lineWidth = 2;
                                ctx.beginPath(); ctx.moveTo(legX, legY + 6); ctx.lineTo(legX + 18, legY + 6); ctx.stroke();
                                ctx.fillStyle = '#58a6ff'; ctx.fillText('Main term y = x', legX + 22, legY + 9);
                            } else {
                                ctx.strokeStyle = '#58a6ff44'; ctx.lineWidth = 1.5; ctx.setLineDash([4,4]);
                                ctx.beginPath(); ctx.moveTo(legX, legY + 6); ctx.lineTo(legX + 18, legY + 6); ctx.stroke(); ctx.setLineDash([]);
                                ctx.fillStyle = '#58a6ff88'; ctx.fillText('Main term (x)', legX + 22, legY + 9);
                                legY += 18;
                                ctx.strokeStyle = '#f0883e'; ctx.lineWidth = 2.5;
                                ctx.beginPath(); ctx.moveTo(legX, legY + 6); ctx.lineTo(legX + 18, legY + 6); ctx.stroke();
                                ctx.fillStyle = '#f0883e'; ctx.fillText('x \u2212 \u03a3 (first ' + numZeros + ' zeros)', legX + 22, legY + 9);
                            }

                            // Bottom info
                            ctx.fillStyle = '#f0f6fc'; ctx.font = 'bold 13px sans-serif'; ctx.textAlign = 'center';
                            ctx.fillText(numZeros === 0
                                ? 'Add zero contributions to see the staircase emerge'
                                : numZeros + ' zero' + (numZeros > 1 ? 's' : '') + ' included | \u03b3\u2080\u2081 = ' + (numZeros >= 1 ? ZEROS[0].toFixed(3) : '') + (numZeros > 1 ? ', \u03b3\u2080' + numZeros + ' = ' + ZEROS[numZeros-1].toFixed(3) : ''),
                                W / 2, H - 12);
                        }

                        draw();

                        // Cleanup function
                        return {
                            canvas: viz.canvas,
                            cleanup: function() {
                                if (animating) { cancelAnimationFrame(animFrame); animating = false; }
                            }
                        };
                    }
                },
                {
                    id: 'viz-cumulative-zeros',
                    title: 'Cumulative Error: More Zeros = Better Approximation',
                    description: 'Watch \\(|\\psi(x) - x + \\sum_{\\text{first } N \\text{ zeros}} x^\\rho/\\rho|\\) shrink as N increases. The explicit formula converges to the true \\(\\psi(x)\\).',
                    setup: function(body, controls) {
                        var ZEROS = [14.134725,21.022040,25.010858,30.424876,32.935062,37.586178,40.918719,43.327073,48.005151,49.773832,52.970321,56.446248,59.347044,60.831779,65.112544,67.079811,69.546402,72.067158,75.704691,77.144840,79.337375,82.910381,84.735493,87.425275,88.809111];
                        var viz = new VizEngine(body, { width: 640, height: 320, originX: 0, originY: 0, scale: 1 });
                        var xVal = 50;
                        var nZerosMax = 25;

                        VizEngine.createSlider(controls, 'x value', 10, 100, xVal, 1, function(v) { xVal = v; draw(); });

                        function truePsiAt(x) {
                            var psi = 0;
                            for (var n = 2; n <= x; n++) {
                                var m = n;
                                var spf = null;
                                var tmp = n;
                                for (var pp = 2; pp * pp <= tmp; pp++) {
                                    if (tmp % pp === 0) { spf = pp; break; }
                                }
                                if (spf === null) spf = tmp;
                                var isPrimePower = true;
                                while (m > 1) {
                                    if (m % spf !== 0) { isPrimePower = false; break; }
                                    m = Math.floor(m / spf);
                                }
                                if (isPrimePower) psi += Math.log(spf);
                            }
                            return psi;
                        }

                        function approxPsiN(x, N) {
                            var val = x - Math.log(2 * Math.PI);
                            if (x > 1) val -= 0.5 * Math.log(1 - 1/(x*x));
                            for (var i = 0; i < N; i++) {
                                var g = ZEROS[i];
                                var beta = 0.5;
                                var rhoAbs2 = 0.25 + g*g;
                                var xb = Math.pow(x, beta);
                                var lx = Math.log(x);
                                var re = xb * (0.5 * Math.cos(g*lx) + g*Math.sin(g*lx)) / rhoAbs2;
                                val -= 2 * re;
                            }
                            return val;
                        }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var W = viz.width, H = viz.height;
                            ctx.fillStyle = '#0c0c20'; ctx.fillRect(0, 0, W, H);

                            var plotLeft = 70, plotRight = W - 20, plotTop = 30, plotBottom = H - 50;
                            var plotW = plotRight - plotLeft, plotH = plotBottom - plotTop;

                            var truePsi = truePsiAt(Math.floor(xVal));

                            // Compute errors for N = 0 to nZerosMax
                            var errors = [];
                            for (var N = 0; N <= nZerosMax; N++) {
                                errors.push(Math.abs(approxPsiN(xVal, N) - truePsi));
                            }
                            var yMax = Math.max.apply(null, errors) * 1.1;
                            if (yMax < 1) yMax = 1;

                            function px(N) { return plotLeft + (N / nZerosMax) * plotW; }
                            function py(yv) { return plotBottom - (yv / yMax) * plotH * 0.9; }

                            // Grid
                            ctx.strokeStyle = '#1a1a40'; ctx.lineWidth = 0.5;
                            for (var g = 0; g <= 4; g++) {
                                var yg = plotTop + g * plotH / 4;
                                ctx.beginPath(); ctx.moveTo(plotLeft, yg); ctx.lineTo(plotRight, yg); ctx.stroke();
                            }

                            // Error curve
                            ctx.strokeStyle = '#bc8cff'; ctx.lineWidth = 2.5;
                            ctx.beginPath();
                            errors.forEach(function(e, N) {
                                var ppx = px(N), ppy = py(e);
                                if (N === 0) ctx.moveTo(ppx, ppy); else ctx.lineTo(ppx, ppy);
                            });
                            ctx.stroke();

                            // Points
                            errors.forEach(function(e, N) {
                                ctx.fillStyle = '#bc8cff';
                                ctx.beginPath(); ctx.arc(px(N), py(e), 3, 0, Math.PI * 2); ctx.fill();
                            });

                            // Axes
                            ctx.strokeStyle = '#4a4a7a'; ctx.lineWidth = 1.5;
                            ctx.beginPath(); ctx.moveTo(plotLeft, plotBottom); ctx.lineTo(plotRight, plotBottom); ctx.stroke();
                            ctx.beginPath(); ctx.moveTo(plotLeft, plotTop); ctx.lineTo(plotLeft, plotBottom); ctx.stroke();

                            // Labels
                            ctx.fillStyle = '#8b949e'; ctx.font = '10px sans-serif'; ctx.textAlign = 'center';
                            [0, 5, 10, 15, 20, 25].forEach(function(N2) {
                                ctx.fillText(N2.toString(), px(N2), plotBottom + 14);
                            });
                            ctx.textAlign = 'right';
                            ctx.fillText(yMax.toFixed(1), plotLeft - 5, plotTop + 5);
                            ctx.fillText('0', plotLeft - 5, plotBottom - 2);

                            ctx.fillStyle = '#f0f6fc'; ctx.font = 'bold 12px sans-serif'; ctx.textAlign = 'center';
                            ctx.fillText('|\u03c8(' + xVal.toFixed(0) + ') \u2212 explicit formula with N zeros|   (true \u03c8 = ' + truePsi.toFixed(2) + ')', W / 2, H - 10);
                            ctx.fillStyle = '#8b949e'; ctx.font = '10px sans-serif';
                            ctx.fillText('N (number of zero pairs)', W / 2, plotBottom + 30);
                        }

                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'State precisely what the Generalized Riemann Hypothesis says about the zeros of \\(L(s, \\chi)\\) for a primitive Dirichlet character \\(\\chi \\pmod{q}\\). How does it imply \\(\\pi(x; q, a) \\approx \\text{Li}(x)/\\phi(q)\\) with error \\(O(\\sqrt{x} \\log(qx))\\)?',
                    hint: 'Under GRH, all non-trivial zeros of \\(L(s,\\chi)\\) satisfy \\(\\text{Re}(\\rho) = 1/2\\). The explicit formula then gives error \\(|E| \\leq \\text{const} \\cdot x^{1/2} \\sum_{|\\gamma| \\leq x} 1/|\\rho| \\sim x^{1/2} \\log^2(qx)\\).',
                    solution: 'GRH: for any primitive character \\(\\chi\\) modulo any \\(q \\geq 1\\), all non-trivial zeros \\(\\rho\\) of \\(L(s,\\chi)\\) satisfy \\(\\text{Re}(\\rho) = 1/2\\). Consequence: each zero \\(\\rho = 1/2 + i\\gamma\\) contributes \\(|x^\\rho/\\rho| = x^{1/2}/|\\rho|\\) to the error in the explicit formula for \\(\\psi(x,\\chi)\\). Summing over zeros with \\(|\\gamma| \\leq x\\) (there are \\(\\sim (q\\log q + \\log x) \\log(qx)\\) such zeros) yields \\(|E| = O(x^{1/2}\\log^2(qx))\\). The estimate for \\(\\pi(x;q,a)\\) follows by partial summation.'
                },
                {
                    question: 'The Bombieri-Vinogradov theorem says: for any \\(A > 0\\), \\(\\sum_{q \\leq Q} \\max_{\\gcd(a,q)=1} \\left|\\psi(x;q,a) - \\frac{x}{\\phi(q)}\\right| \\ll_A \\frac{x}{\\log^A x}\\), where \\(Q = x^{1/2}/\\log^B x\\) for some \\(B = B(A)\\). Why is this called "GRH on average"?',
                    hint: 'GRH would give the same bound for each individual modulus up to \\(Q \\sim x^{1/2}\\). Bombieri-Vinogradov achieves the same total savings by averaging.',
                    solution: 'Under GRH for each \\(L(s,\\chi_q)\\), one gets \\(|\\psi(x;q,a) - x/\\phi(q)| \\ll x^{1/2}\\log^2(qx)\\). Summing over \\(q \\leq Q\\) gives \\(\\sum_q O(x^{1/2}\\log^2(qx)) = O(Qx^{1/2}\\log^3 x)\\). For \\(Q = x^{1/2}/\\log^B x\\), this is \\(O(x/\\log^{B-3} x)\\). Bombieri-Vinogradov achieves \\(O(x/\\log^A x)\\) for any fixed \\(A\\) unconditionally, matching the GRH total bound. The theorem is weaker than GRH individually but achieves the same type of result in aggregate (hence "on average").'
                },
                {
                    question: 'Von Koch (1901) proved the error \\(\\psi(x) - x = \\Omega(x^{1/2})\\), meaning \\(\\limsup (\\psi(x)-x)/x^{1/2} > 0\\). This shows the RH error bound \\(O(x^{1/2}\\log^2 x)\\) cannot be improved to \\(O(x^{1/2-\\epsilon})\\). Sketch why: if all zeros have \\(\\text{Re}(\\rho) = 1/2\\), why must the oscillations reach amplitude \\(x^{1/2}\\)?',
                    hint: 'The sum \\(\\sum_n x^{1/2}/\\gamma_n \\cdot \\cos(\\gamma_n \\log x - \\theta_n)\\) consists of waves that occasionally constructively interfere.',
                    solution: 'By the explicit formula, \\(\\psi(x) - x = -\\sum_\\rho x^{1/2} A_\\rho \\cos(\\gamma \\log x + \\phi_\\rho) + O(1)\\) where \\(A_\\rho = 2/|\\rho|\\). Although the average of this sum is zero, the Kronecker-Weyl theorem on equidistribution implies the phases \\(\\gamma_n \\log x\\) are equidistributed modulo \\(2\\pi\\) as \\(x\\) varies. At exceptional \\(x\\) values where many waves constructively interfere, the sum reaches size \\(\\Omega(x^{1/2})\\). More precisely, von Koch showed \\(\\limsup |\\psi(x)-x|/(x^{1/2}) \\geq C \\sum_n 1/\\gamma_n = \\infty\\) (the series diverges), confirming the \\(x^{1/2}\\) lower bound is sharp.'
                }
            ]
        }
    ]
});
