window.CHAPTERS = window.CHAPTERS || [];
window.CHAPTERS.push({
    id: 'ch16',
    number: 16,
    title: 'Zeros of L-Functions',
    subtitle: 'The fine structure of zero distribution',
    sections: [

        // ================================================================
        // SECTION 1: Motivation — The Fine Structure
        // ================================================================
        {
            id: 'sec-motivation',
            title: 'The Fine Structure',
            content: `
<h2>The Fine Structure of Zero Distribution</h2>

<div class="env-block intuition">
    <div class="env-title">Where We Are</div>
    <div class="env-body">
        <p>The Prime Number Theorem tells us that primes are distributed like \\(x/\\log x\\) on average. The Explicit Formula (Ch 8) told us how each zero of \\(\\zeta(s)\\) contributes an oscillatory term to \\(\\psi(x)\\). Zero-free regions (Ch 6) gave us a quantitative handle on the error term.</p>
        <p>But we have so far treated the zeros as a rough collection: how many lie in a box, what is the leftmost? In this chapter we study the <strong>fine structure</strong> of zero distribution: how the zeros are spaced relative to one another, what statistics govern their distribution, and what this says about the deep arithmetic of primes.</p>
    </div>
</div>

<p>The nontrivial zeros of \\(\\zeta(s)\\) are the points \\(\\rho = \\beta + i\\gamma\\) with \\(0 < \\beta < 1\\) where \\(\\zeta(\\rho) = 0\\). The Riemann Hypothesis asserts \\(\\beta = \\tfrac{1}{2}\\) for all such zeros. Even without RH, we know:</p>

<ul>
    <li>The zeros come in conjugate pairs: if \\(\\rho\\) is a zero, so is \\(\\bar{\\rho}\\) and \\(1 - \\bar{\\rho}\\).</li>
    <li>The zeros are symmetric about the critical line \\(\\operatorname{Re}(s) = \\tfrac{1}{2}\\).</li>
    <li>The number of zeros with imaginary part in \\([0, T]\\) grows like \\(\\frac{T}{2\\pi}\\log\\frac{T}{2\\pi e}\\).</li>
</ul>

<h3>Three Fundamental Questions</h3>

<p>This chapter addresses three increasingly fine questions:</p>

<ol>
    <li><strong>Counting:</strong> Precisely how many zeros \\(N(T)\\) have \\(0 < \\gamma \\le T\\)? (Riemann-von Mangoldt formula)</li>
    <li><strong>Density:</strong> How many zeros can lie far to the right, near \\(\\operatorname{Re}(s) = 1\\)? (Zero density estimates)</li>
    <li><strong>Spacing:</strong> What is the distribution of gaps \\(\\gamma_{n+1} - \\gamma_n\\) between consecutive zeros? (Pair correlation and random matrices)</li>
</ol>

<div class="env-block remark">
    <div class="env-title">Why Spacing Matters</div>
    <div class="env-body">
        <p>If the zeros were spaced randomly and independently, each oscillatory term \\(x^\\rho / \\rho\\) in the explicit formula would tend to cancel others. But if zeros cluster together, their contributions reinforce, creating larger fluctuations in the prime counting function. The spacing statistics of zeros are therefore intimately connected to the size of the error term in the PNT.</p>
    </div>
</div>

<h3>The Stunning Discovery</h3>

<p>In 1972, Hugh Montgomery discovered that the pair correlation of zeta zeros follows a precise law — the same law that governs the eigenvalue spacings of large random unitary matrices (the GUE ensemble from quantum chaos). This connection, amplified by Freeman Dyson's observation, opened a new chapter in mathematics: the interface between number theory, random matrix theory, and quantum chaos.</p>

<div class="viz-placeholder" data-viz="viz-nt-staircase"></div>
`,
            visualizations: [
                {
                    id: 'viz-nt-staircase',
                    title: 'N(T): The Zero-Counting Staircase',
                    description: 'The function \\(N(T)\\) counts the number of nontrivial zeros \\(\\rho = \\beta + i\\gamma\\) of \\(\\zeta(s)\\) with \\(0 < \\gamma \\le T\\). Each step corresponds to a zero. The smooth approximation is the Riemann-von Mangoldt main term \\(\\frac{T}{2\\pi}\\log\\frac{T}{2\\pi e} + \\frac{7}{8}\\).',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, { width: 680, height: 380, originX: 70, originY: 350, scale: 1 });

                        // First 50 imaginary parts of zeta zeros
                        var zetaZeros = [
                            14.1347,18.2101,21.0220,25.0109,30.4249,32.9351,37.5862,40.9187,43.3271,48.0052,
                            49.7738,52.9703,56.4462,59.3470,60.8318,65.1125,67.0798,69.5465,72.0672,75.7047,
                            77.1448,79.3374,82.9104,84.7357,87.4253,88.8091,92.4919,94.6513,95.8706,98.8312,
                            101.318,103.726,105.447,107.169,111.030,111.875,114.320,116.227,118.791,121.370,
                            122.947,124.257,127.517,129.579,131.088,133.498,134.757,138.116,139.736,141.124
                        ];

                        var T = 50;
                        var slider = VizEngine.createSlider(controls, 'T', 10, 150, T, 1, function(v) {
                            T = v; draw();
                        });

                        function rvmMain(t) {
                            if (t <= 0) return 0;
                            return (t / (2 * Math.PI)) * Math.log(t / (2 * Math.PI * Math.E)) + 7/8;
                        }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var W = viz.width, H = viz.height;
                            var pad = { l: 70, r: 20, t: 30, b: 40 };
                            var chartW = W - pad.l - pad.r;
                            var chartH = H - pad.t - pad.b;

                            var tMax = Math.max(T, 15);
                            var nMax = zetaZeros.filter(function(z) { return z <= tMax; }).length + 2;
                            nMax = Math.max(nMax, 5);

                            function tx(t) { return pad.l + (t / tMax) * chartW; }
                            function ty(n) { return pad.t + chartH - (n / nMax) * chartH; }

                            // Grid lines
                            ctx.strokeStyle = '#1a1a40'; ctx.lineWidth = 0.5;
                            for (var ni = 0; ni <= nMax; ni += Math.ceil(nMax / 8)) {
                                ctx.beginPath(); ctx.moveTo(pad.l, ty(ni)); ctx.lineTo(W - pad.r, ty(ni)); ctx.stroke();
                            }

                            // Smooth RvM curve
                            ctx.strokeStyle = '#f0883e'; ctx.lineWidth = 1.5;
                            ctx.beginPath();
                            var first = true;
                            for (var ti = 1; ti <= tMax; ti += tMax / 300) {
                                var y = rvmMain(ti);
                                if (y < 0) { first = true; continue; }
                                if (first) { ctx.moveTo(tx(ti), ty(y)); first = false; }
                                else ctx.lineTo(tx(ti), ty(y));
                            }
                            ctx.stroke();

                            // Step function N(T)
                            ctx.strokeStyle = '#58a6ff'; ctx.lineWidth = 2;
                            ctx.beginPath();
                            var steps = zetaZeros.filter(function(z) { return z <= tMax; });
                            ctx.moveTo(tx(0), ty(0));
                            for (var si = 0; si < steps.length; si++) {
                                var gamma = steps[si];
                                ctx.lineTo(tx(gamma), ty(si));
                                ctx.lineTo(tx(gamma), ty(si + 1));
                            }
                            if (steps.length > 0) ctx.lineTo(tx(tMax), ty(steps.length));
                            ctx.stroke();

                            // Mark the current T
                            if (T <= tMax) {
                                ctx.strokeStyle = '#3fb950'; ctx.lineWidth = 1;
                                ctx.setLineDash([4, 4]);
                                ctx.beginPath(); ctx.moveTo(tx(T), pad.t); ctx.lineTo(tx(T), H - pad.b); ctx.stroke();
                                ctx.setLineDash([]);
                                var nT = zetaZeros.filter(function(z) { return z <= T; }).length;
                                ctx.fillStyle = '#3fb950'; ctx.font = '11px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.fillText('N(' + T.toFixed(0) + ') = ' + nT, tx(T), pad.t - 6);
                            }

                            // Axes
                            ctx.strokeStyle = '#4a4a7a'; ctx.lineWidth = 1; ctx.setLineDash([]);
                            ctx.beginPath(); ctx.moveTo(pad.l, pad.t); ctx.lineTo(pad.l, H - pad.b); ctx.stroke();
                            ctx.beginPath(); ctx.moveTo(pad.l, H - pad.b); ctx.lineTo(W - pad.r, H - pad.b); ctx.stroke();

                            // Axis labels
                            ctx.fillStyle = '#8b949e'; ctx.font = '11px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            for (var tl = 0; tl <= tMax; tl += Math.ceil(tMax / 6)) {
                                ctx.fillText(tl.toString(), tx(tl), H - pad.b + 14);
                            }
                            ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
                            for (var nl = 0; nl <= nMax; nl += Math.ceil(nMax / 8)) {
                                ctx.fillText(nl.toString(), pad.l - 5, ty(nl));
                            }

                            ctx.fillStyle = '#8b949e'; ctx.font = '11px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText('T', W / 2, H - 6);
                            ctx.save(); ctx.translate(12, H / 2); ctx.rotate(-Math.PI / 2);
                            ctx.fillText('N(T)', 0, 0); ctx.restore();

                            // Legend
                            ctx.textAlign = 'left'; ctx.textBaseline = 'top';
                            ctx.fillStyle = '#58a6ff'; ctx.fillRect(W - 150, 10, 14, 3); ctx.fillText('N(T) actual', W - 130, 6);
                            ctx.fillStyle = '#f0883e'; ctx.fillRect(W - 150, 26, 14, 3); ctx.fillText('RvM approx.', W - 130, 22);
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'The first zeta zero has imaginary part \\(\\gamma_1 \\approx 14.135\\). Compute the Riemann-von Mangoldt approximation \\(\\frac{T}{2\\pi}\\log\\frac{T}{2\\pi e} + \\frac{7}{8}\\) at \\(T = 14.135\\) and compare it to the actual value \\(N(14.135) = 1\\).',
                    hint: 'Plug in \\(T = 14.135\\) directly. The main term gives a rough estimate; the correction \\(\\frac{7}{8}\\) ensures the rounding works out to 1.',
                    solution: 'At \\(T = 14.135\\): \\(\\frac{14.135}{2\\pi}\\log\\frac{14.135}{2\\pi e} \\approx 2.250 \\times \\log(0.823) \\approx 2.250 \\times (-0.194) \\approx -0.437\\). Adding \\(\\frac{7}{8} = 0.875\\) gives approximately \\(0.44\\), and rounding to the nearest integer gives 0 or 1. More carefully, the formula predicts \\(N(T) \\approx 1\\) for \\(T\\) just above \\(\\gamma_1\\), consistent with reality. The formula is asymptotic; for small \\(T\\) the correction terms matter.'
                }
            ]
        },

        // ================================================================
        // SECTION 2: Riemann-von Mangoldt Formula
        // ================================================================
        {
            id: 'sec-rvmf',
            title: 'Riemann-von Mangoldt Formula',
            content: `
<h2>The Riemann-von Mangoldt Formula</h2>

<div class="env-block intuition">
    <div class="env-title">Counting Zeros Precisely</div>
    <div class="env-body">
        <p>How many nontrivial zeros of \\(\\zeta(s)\\) lie in the box \\(0 < \\operatorname{Re}(s) < 1\\), \\(0 < \\operatorname{Im}(s) \\le T\\)? The answer, denoted \\(N(T)\\), is given by an asymptotic formula that Riemann stated and von Mangoldt proved rigorously.</p>
    </div>
</div>

<div class="env-block theorem">
    <div class="env-title">Theorem 16.1 (Riemann-von Mangoldt Formula)</div>
    <div class="env-body">
        <p>Let \\(N(T)\\) denote the number of nontrivial zeros \\(\\rho = \\beta + i\\gamma\\) of \\(\\zeta(s)\\) with \\(0 < \\gamma \\le T\\) (counted with multiplicity). Then</p>
        \\[
        N(T) = \\frac{T}{2\\pi}\\log\\frac{T}{2\\pi e} + \\frac{7}{8} + S(T) + O\\!\\left(\\frac{1}{T}\\right),
        \\]
        <p>where \\(S(T) = \\frac{1}{\\pi}\\arg\\zeta\\!\\left(\\tfrac{1}{2} + iT\\right)\\) and \\(S(T) = O(\\log T)\\).</p>
    </div>
</div>

<h3>Proof Strategy: The Argument Principle</h3>

<p>The key tool is the <strong>argument principle</strong>: for a meromorphic function \\(f\\) with no zeros or poles on a contour \\(C\\),</p>
\\[
\\frac{1}{2\\pi i}\\oint_C \\frac{f'(s)}{f(s)}\\,ds = Z - P,
\\]
<p>where \\(Z\\) is the number of zeros and \\(P\\) the number of poles (counted with multiplicity) inside \\(C\\).</p>

<p>Apply this to the completed zeta function \\(\\xi(s) = \\tfrac{1}{2}s(s-1)\\pi^{-s/2}\\Gamma(s/2)\\zeta(s)\\), which is entire and equals \\(\\xi(1-s)\\). Consider the rectangle with corners \\(2, 2+iT, -1+iT, -1\\). Since \\(\\xi\\) is entire, \\(P = 0\\), and we count zeros by tracking how much \\(\\arg\\xi(s)\\) changes as \\(s\\) traverses the boundary.</p>

<p>Breaking the boundary into four pieces and applying the functional equation to relate the left side to the right, the main contribution comes from the horizontal segment \\([2, 2+iT]\\) and its reflection. Stirling's formula for \\(\\Gamma\\) then yields:</p>

\\[
N(T) = \\frac{1}{\\pi}\\vartheta(T) + 1 + S(T),
\\]
<p>where the Riemann-Siegel theta function is</p>
\\[
\\vartheta(T) = \\operatorname{Im}\\log\\Gamma\\!\\left(\\tfrac{1}{4} + \\tfrac{i T}{2}\\right) - \\frac{T}{2}\\log\\pi.
\\]

<h3>The Riemann-Siegel Theta Function</h3>

<p>By Stirling's formula, \\(\\vartheta(T)\\) has the asymptotic expansion</p>
\\[
\\vartheta(T) = \\frac{T}{2}\\log\\frac{T}{2\\pi} - \\frac{T}{2} - \\frac{\\pi}{8} + \\frac{1}{48T} + O(T^{-3}).
\\]
<p>Substituting into \\(\\frac{1}{\\pi}\\vartheta(T) + 1\\) gives the Riemann-von Mangoldt formula above.</p>

<div class="env-block definition">
    <div class="env-title">Definition: S(T)</div>
    <div class="env-body">
        <p>The function \\(S(T) = \\frac{1}{\\pi}\\arg\\zeta(\\tfrac{1}{2}+iT)\\) measures the deviation of \\(N(T)\\) from its smooth main term. It is determined by continuous variation of the argument along the line \\(\\operatorname{Re}(s) = \\tfrac{1}{2}\\) from \\(s = 2\\) to \\(s = 2 + iT\\) to \\(s = \\tfrac{1}{2}+iT\\).</p>
    </div>
</div>

<h3>Bounds on S(T)</h3>

<p>Unconditionally, \\(S(T) = O(\\log T)\\). Under RH, Littlewood proved \\(S(T) = O(\\log T / \\log\\log T)\\), and the order of magnitude is believed to be \\(O(\\sqrt{\\log T / \\log\\log T})\\).</p>

<div class="env-block remark">
    <div class="env-title">Gaps Between Zeros</div>
    <div class="env-body">
        <p>The density of zeros near height \\(T\\) is approximately \\(\\frac{\\log T}{2\\pi}\\). Thus the "expected" gap between consecutive zeros near height \\(T\\) is \\(\\frac{2\\pi}{\\log T}\\). This is the natural unit for normalizing zero spacings — dividing by \\(\\frac{2\\pi}{\\log T}\\) gives gaps of order 1 on average.</p>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-zero-spacing"></div>
`,
            visualizations: [
                {
                    id: 'viz-zero-spacing',
                    title: 'Zero Spacing Histogram vs GUE Prediction',
                    description: 'Normalized spacings between consecutive imaginary parts of zeta zeros. The normalization divides each gap by \\(\\frac{2\\pi}{\\log(\\gamma/(2\\pi))}\\) so the mean spacing is 1. The histogram is compared with the Wigner surmise \\(p(s) = \\frac{\\pi}{2}s e^{-\\pi s^2/4}\\) from GUE random matrix theory.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, { width: 680, height: 380, originX: 50, originY: 340, scale: 1 });

                        // First 100 imaginary parts of zeta zeros (hardcoded)
                        var zeros100 = [
                            14.134725,18.210242,21.022040,25.010858,30.424876,32.935062,37.586178,40.918719,
                            43.327073,48.005151,49.773832,52.970321,56.446248,59.347044,60.831779,65.112544,
                            67.079811,69.546402,72.067158,75.704691,77.144840,79.337376,82.910381,84.735493,
                            87.425275,88.809112,92.491900,94.651344,95.870634,98.831194,101.317851,103.725538,
                            105.446623,107.168611,111.029535,111.874659,114.320221,116.226680,118.790782,121.370125,
                            122.946829,124.256819,127.516684,129.578704,131.087688,133.497737,134.756510,138.116042,
                            139.736209,141.123707,143.111846,146.000982,147.422765,150.053521,150.925257,153.024693,
                            156.112909,157.597591,158.849988,161.188964,163.030709,165.537069,167.184439,169.094515,
                            169.911976,173.411536,174.754191,176.441434,178.377407,179.916484,182.207078,184.874467,
                            185.598783,187.228922,189.416159,192.026656,193.079726,195.265397,196.876481,198.015309,
                            201.264751,202.493595,204.189671,205.394697,207.906259,209.576509,211.690862,213.347919,
                            214.547044,216.169538,219.067596,220.714918,221.430705,224.007000,224.983324,227.421444,
                            229.337413,231.250188,231.987235,233.693404
                        ];

                        function wignerSurmise(s) {
                            return (Math.PI / 2) * s * Math.exp(-Math.PI * s * s / 4);
                        }

                        function drawHist(nBins) {
                            viz.clear();
                            var ctx = viz.ctx;
                            var W = viz.width, H = viz.height;
                            var pad = { l: 55, r: 20, t: 30, b: 45 };
                            var chartW = W - pad.l - pad.r;
                            var chartH = H - pad.t - pad.b;

                            // Compute normalized spacings
                            var spacings = [];
                            for (var i = 0; i < zeros100.length - 1; i++) {
                                var gap = zeros100[i + 1] - zeros100[i];
                                var logFactor = Math.log(zeros100[i] / (2 * Math.PI)) / (2 * Math.PI);
                                var normalized = gap * logFactor;
                                if (normalized > 0) spacings.push(normalized);
                            }

                            // Histogram
                            var sMax = 3.5;
                            var bins = new Array(nBins).fill(0);
                            var binW = sMax / nBins;
                            spacings.forEach(function(s) {
                                var b = Math.floor(s / binW);
                                if (b >= 0 && b < nBins) bins[b]++;
                            });
                            var total = spacings.length;
                            var maxDensity = 0;
                            bins.forEach(function(c) { maxDensity = Math.max(maxDensity, c / (total * binW)); });
                            maxDensity = Math.max(maxDensity, 1.0);

                            function sx(s) { return pad.l + (s / sMax) * chartW; }
                            function sy(d) { return pad.t + chartH - (d / (maxDensity * 1.1)) * chartH; }

                            // Grid
                            ctx.strokeStyle = '#1a1a40'; ctx.lineWidth = 0.5;
                            for (var gi = 0; gi <= 5; gi++) {
                                var gd = gi * maxDensity / 5;
                                ctx.beginPath(); ctx.moveTo(pad.l, sy(gd)); ctx.lineTo(W - pad.r, sy(gd)); ctx.stroke();
                            }

                            // Draw histogram bars
                            bins.forEach(function(c, bi) {
                                var density = c / (total * binW);
                                var bx = sx(bi * binW);
                                var bw = (chartW / nBins) - 1;
                                var bh = chartH - (sy(density) - pad.t);
                                ctx.fillStyle = '#58a6ff44';
                                ctx.fillRect(bx, sy(density), bw, bh);
                                ctx.strokeStyle = '#58a6ff';
                                ctx.lineWidth = 1;
                                ctx.strokeRect(bx, sy(density), bw, bh);
                            });

                            // Wigner surmise curve
                            ctx.strokeStyle = '#f85149'; ctx.lineWidth = 2.5;
                            ctx.beginPath();
                            var firstPt = true;
                            for (var si2 = 0; si2 <= sMax; si2 += sMax / 200) {
                                var wy = wignerSurmise(si2);
                                if (firstPt) { ctx.moveTo(sx(si2), sy(wy)); firstPt = false; }
                                else ctx.lineTo(sx(si2), sy(wy));
                            }
                            ctx.stroke();

                            // Poisson (for comparison)
                            ctx.strokeStyle = '#d2992244'; ctx.lineWidth = 1.5;
                            ctx.setLineDash([6, 4]);
                            ctx.beginPath();
                            firstPt = true;
                            for (var si3 = 0; si3 <= sMax; si3 += sMax / 200) {
                                var py2 = Math.exp(-si3);
                                if (firstPt) { ctx.moveTo(sx(si3), sy(py2)); firstPt = false; }
                                else ctx.lineTo(sx(si3), sy(py2));
                            }
                            ctx.stroke();
                            ctx.setLineDash([]);

                            // Axes
                            ctx.strokeStyle = '#4a4a7a'; ctx.lineWidth = 1;
                            ctx.beginPath(); ctx.moveTo(pad.l, pad.t); ctx.lineTo(pad.l, H - pad.b); ctx.stroke();
                            ctx.beginPath(); ctx.moveTo(pad.l, H - pad.b); ctx.lineTo(W - pad.r, H - pad.b); ctx.stroke();

                            // Tick labels
                            ctx.fillStyle = '#8b949e'; ctx.font = '11px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            for (var ti = 0; ti <= 7; ti++) {
                                var ts = ti * 0.5;
                                ctx.fillText(ts.toFixed(1), sx(ts), H - pad.b + 14);
                            }
                            ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
                            for (var gi2 = 0; gi2 <= 5; gi2++) {
                                var gd2 = gi2 * maxDensity / 5;
                                ctx.fillText(gd2.toFixed(2), pad.l - 5, sy(gd2));
                            }

                            ctx.fillStyle = '#8b949e'; ctx.font = '11px -apple-system,sans-serif';
                            ctx.textAlign = 'center'; ctx.textBaseline = 'top';
                            ctx.fillText('Normalized spacing s', W / 2, H - 14);
                            ctx.save(); ctx.translate(14, H / 2); ctx.rotate(-Math.PI / 2);
                            ctx.fillText('Density', 0, 0); ctx.restore();

                            // Legend
                            ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
                            ctx.fillStyle = '#58a6ff'; ctx.fillRect(W - 200, 12, 14, 10); ctx.fillText('Zeta zero spacings', W - 180, 17);
                            ctx.strokeStyle = '#f85149'; ctx.lineWidth = 2.5; ctx.setLineDash([]);
                            ctx.beginPath(); ctx.moveTo(W - 200, 32); ctx.lineTo(W - 186, 32); ctx.stroke();
                            ctx.fillStyle = '#f85149'; ctx.fillText('GUE Wigner surmise', W - 180, 32);
                            ctx.strokeStyle = '#d2992244'; ctx.lineWidth = 1.5; ctx.setLineDash([6,4]);
                            ctx.beginPath(); ctx.moveTo(W - 200, 47); ctx.lineTo(W - 186, 47); ctx.stroke();
                            ctx.setLineDash([]);
                            ctx.fillStyle = '#d29922'; ctx.fillText('Poisson (random)', W - 180, 47);

                            ctx.fillStyle = '#f0f6fc'; ctx.font = 'bold 12px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText('n = ' + spacings.length + ' spacings from first 100 zeros', W / 2, 18);
                        }

                        var nBins = 18;
                        var binSlider = VizEngine.createSlider(controls, 'Bins', 8, 30, nBins, 1, function(v) {
                            nBins = Math.round(v); drawHist(nBins);
                        });
                        drawHist(nBins);
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Using the von Mangoldt formula, estimate the number of zeros with imaginary part between 1000 and 1001.',
                    hint: 'Compute \\(N(1001) - N(1000)\\) using the main term \\(\\frac{T}{2\\pi}\\log\\frac{T}{2\\pi e}\\).',
                    solution: '\\(N(T) \\approx \\frac{T}{2\\pi}\\log\\frac{T}{2\\pi e}\\). The density at height \\(T\\) is \\(N\'(T) \\approx \\frac{1}{2\\pi}\\log\\frac{T}{2\\pi}\\). At \\(T = 1000\\): density \\(\\approx \\frac{1}{2\\pi}\\log(159.2) \\approx \\frac{5.07}{6.28} \\approx 0.808\\) zeros per unit. So approximately 0.8 zeros are expected between 1000 and 1001 — meaning a gap of about \\(\\frac{1}{0.808} \\approx 1.24\\) on average between consecutive zeros at this height.'
                }
            ]
        },

        // ================================================================
        // SECTION 3: Zero Density Estimates
        // ================================================================
        {
            id: 'sec-zero-density',
            title: 'Zero Density Estimates',
            content: `
<h2>Zero Density Estimates</h2>

<div class="env-block intuition">
    <div class="env-title">Zeros Off the Critical Line</div>
    <div class="env-body">
        <p>We cannot prove the Riemann Hypothesis. But we can prove that <em>most</em> zeros are very close to the critical line — in a quantitative sense. Zero density estimates bound the number of zeros in the region \\(\\operatorname{Re}(s) \\ge \\sigma\\) for \\(\\sigma > \\tfrac{1}{2}\\).</p>
    </div>
</div>

<p>Define \\(N(\\sigma, T)\\) to be the number of zeros \\(\\rho = \\beta + i\\gamma\\) with \\(\\beta \\ge \\sigma\\) and \\(|\\gamma| \\le T\\). The Riemann Hypothesis says \\(N(\\sigma, T) = 0\\) for all \\(\\sigma > \\tfrac{1}{2}\\). We aim for upper bounds.</p>

<div class="env-block theorem">
    <div class="env-title">Theorem 16.2 (Ingham's Zero Density Estimate, 1940)</div>
    <div class="env-body">
        <p>For \\(\\tfrac{1}{2} \\le \\sigma \\le 1\\) and \\(T \\ge 2\\),</p>
        \\[
        N(\\sigma, T) \\ll T^{3(1-\\sigma)/(2-\\sigma)} (\\log T)^5.
        \\]
    </div>
</div>

<p>Notice: at \\(\\sigma = 1\\), the bound gives \\(N(1, T) \\ll (\\log T)^5\\), consistent with the zero-free region (which says \\(N(1,T) = 0\\) except possibly very near \\(1\\)). At \\(\\sigma = \\tfrac{1}{2}\\), the bound gives \\(N(\\tfrac{1}{2}, T) \\ll T (\\log T)^5\\), consistent with Riemann-von Mangoldt. Ingham's estimate interpolates between these two extremes.</p>

<h3>The Method: Large Values of \\(\\zeta\\)</h3>

<p>The key idea behind Ingham's bound is to connect zeros to <strong>large values of \\(|\\zeta(s)|\\)</strong> on vertical lines. If \\(\\zeta(\\beta + i\\gamma) = 0\\) with \\(\\beta \\ge \\sigma\\), then by the functional equation and convexity bounds, \\(|\\zeta(\\sigma + i\\gamma)|\\) must be large in a neighborhood.</p>

<p>One key input is the <strong>mean value theorem</strong> for \\(\\zeta\\): for \\(\\tfrac{1}{2} \\le \\sigma < 1\\),</p>
\\[
\\int_0^T |\\zeta(\\sigma + it)|^2\\,dt \\asymp T.
\\]
<p>This says \\(|\\zeta|^2\\) is of average size 1 on \\(\\operatorname{Re}(s) = \\sigma\\) (after suitable normalization). If zeros force large values nearby, there cannot be too many of them.</p>

<h3>The Lindel\\(\\mathrm{\\ddot{o}}\\)f Hypothesis Connection</h3>

<p>Define the Lindelof exponent \\(\\mu(\\sigma)\\) by \\(\\zeta(\\sigma + it) \\ll |t|^{\\mu(\\sigma)+\\varepsilon}\\). The <strong>Lindelof Hypothesis</strong> asserts \\(\\mu(\\tfrac{1}{2}) = 0\\), i.e., \\(\\zeta(\\tfrac{1}{2} + it) \\ll |t|^\\varepsilon\\). Under LH, one can show \\(N(\\sigma, T) \\ll T^{2(1-\\sigma)+\\varepsilon}\\), a stronger bound than Ingham's for \\(\\sigma\\) near \\(\\tfrac{1}{2}\\).</p>

<div class="env-block theorem">
    <div class="env-title">Theorem 16.3 (Huxley's Density Estimate, 1972)</div>
    <div class="env-body">
        <p>For \\(\\tfrac{1}{2} \\le \\sigma \\le 1\\) and \\(T \\ge 2\\),</p>
        \\[
        N(\\sigma, T) \\ll T^{(12/5)(1-\\sigma)} (\\log T)^A
        \\]
        <p>for some absolute constant \\(A > 0\\).</p>
    </div>
</div>

<h3>Arithmetic Consequences</h3>

<p>Zero density estimates have direct implications for prime distribution. If \\(N(\\sigma, T) \\ll T^{A(1-\\sigma)}(\\log T)^B\\) for some \\(A < 2\\), one can prove:</p>
\\[
\\psi(x+h) - \\psi(x) \\sim h
\\]
<p>for \\(h \\ge x^\\theta\\) with \\(\\theta > \\frac{A-1}{A}\\). In particular, Huxley's \\(A = 12/5\\) implies Hoheisel's theorem: the PNT holds in intervals \\([x, x + x^{7/12+\\varepsilon}]\\).</p>

<div class="viz-placeholder" data-viz="viz-density-bounds"></div>
`,
            visualizations: [
                {
                    id: 'viz-density-bounds',
                    title: 'Zero Density Bounds: N(σ,T) as a Function of σ',
                    description: 'For fixed \\(T = 1000\\), the upper bounds from Ingham (1940) and Huxley (1972) on \\(N(\\sigma, T)\\) as a function of \\(\\sigma \\in [0.5, 1]\\). The density hypothesis would give \\(N(\\sigma,T) \\ll T^{2(1-\\sigma)+\\varepsilon}\\). Use the slider to vary \\(T\\).',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, { width: 680, height: 380, originX: 70, originY: 350, scale: 1 });
                        var T = 1000;
                        VizEngine.createSlider(controls, 'T', 100, 10000, T, 100, function(v) { T = v; draw(); });

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var W = viz.width, H = viz.height;
                            var pad = { l: 70, r: 20, t: 30, b: 45 };
                            var chartW = W - pad.l - pad.r;
                            var chartH = H - pad.t - pad.b;

                            var sigMin = 0.5, sigMax = 1.0;
                            var logT = Math.log(T);

                            // Compute max for scaling
                            var yMax = 0;
                            var steps = 200;
                            for (var i = 0; i <= steps; i++) {
                                var sig = sigMin + (sigMax - sigMin) * i / steps;
                                if (sig >= 1) continue;
                                var ingham = Math.pow(T, 3 * (1 - sig) / (2 - sig)) * Math.pow(logT, 5);
                                yMax = Math.max(yMax, ingham);
                            }
                            yMax = Math.min(yMax, T * 10); // cap for display
                            if (yMax < 1) yMax = 1;

                            function sx(sig) { return pad.l + (sig - sigMin) / (sigMax - sigMin) * chartW; }
                            function sy(y) {
                                // Use log scale
                                var logY = Math.log10(Math.max(y, 1));
                                var logMax = Math.log10(yMax);
                                return pad.t + chartH - (logY / logMax) * chartH;
                            }

                            // Grid
                            ctx.strokeStyle = '#1a1a40'; ctx.lineWidth = 0.5;
                            for (var gi = 0; gi <= 4; gi++) {
                                var gll = gi * Math.log10(yMax) / 4;
                                var gy = pad.t + chartH - (gll / Math.log10(yMax)) * chartH;
                                ctx.beginPath(); ctx.moveTo(pad.l, gy); ctx.lineTo(W - pad.r, gy); ctx.stroke();
                            }

                            // Density hypothesis: T^{2(1-sigma)}
                            ctx.strokeStyle = '#3fb950'; ctx.lineWidth = 1.5; ctx.setLineDash([8, 4]);
                            ctx.beginPath();
                            var first = true;
                            for (var i = 0; i <= steps; i++) {
                                var sig = sigMin + (sigMax - sigMin) * i / steps;
                                if (sig >= 1.0) break;
                                var dh = Math.pow(T, 2 * (1 - sig));
                                var px = sx(sig), py = sy(dh);
                                if (py < pad.t || py > pad.t + chartH) { first = true; continue; }
                                first ? (ctx.moveTo(px, py), first = false) : ctx.lineTo(px, py);
                            }
                            ctx.stroke(); ctx.setLineDash([]);

                            // Huxley: T^{(12/5)(1-sigma)} * logT^A
                            ctx.strokeStyle = '#f0883e'; ctx.lineWidth = 2;
                            ctx.beginPath(); first = true;
                            for (var i = 0; i <= steps; i++) {
                                var sig = sigMin + (sigMax - sigMin) * i / steps;
                                if (sig >= 1.0) break;
                                var hux = Math.pow(T, (12/5) * (1 - sig)) * Math.pow(logT, 10);
                                var px = sx(sig), py = sy(hux);
                                if (py < pad.t || py > pad.t + chartH) { first = true; continue; }
                                first ? (ctx.moveTo(px, py), first = false) : ctx.lineTo(px, py);
                            }
                            ctx.stroke();

                            // Ingham: T^{3(1-sigma)/(2-sigma)} * logT^5
                            ctx.strokeStyle = '#bc8cff'; ctx.lineWidth = 2;
                            ctx.beginPath(); first = true;
                            for (var i = 0; i <= steps; i++) {
                                var sig = sigMin + (sigMax - sigMin) * i / steps;
                                if (sig >= 1.0) break;
                                var ing = Math.pow(T, 3 * (1 - sig) / (2 - sig)) * Math.pow(logT, 5);
                                var px = sx(sig), py = sy(ing);
                                if (py < pad.t || py > pad.t + chartH) { first = true; continue; }
                                first ? (ctx.moveTo(px, py), first = false) : ctx.lineTo(px, py);
                            }
                            ctx.stroke();

                            // Axes
                            ctx.strokeStyle = '#4a4a7a'; ctx.lineWidth = 1;
                            ctx.beginPath(); ctx.moveTo(pad.l, pad.t); ctx.lineTo(pad.l, H - pad.b); ctx.stroke();
                            ctx.beginPath(); ctx.moveTo(pad.l, H - pad.b); ctx.lineTo(W - pad.r, H - pad.b); ctx.stroke();

                            // Labels
                            ctx.fillStyle = '#8b949e'; ctx.font = '11px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            [0.5, 0.6, 0.7, 0.8, 0.9, 1.0].forEach(function(s) {
                                ctx.fillText(s.toFixed(1), sx(s), H - pad.b + 14);
                            });
                            ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
                            for (var gi2 = 0; gi2 <= 4; gi2++) {
                                var gll2 = gi2 * Math.log10(yMax) / 4;
                                var gy2 = pad.t + chartH - (gll2 / Math.log10(yMax)) * chartH;
                                var gval = Math.round(Math.pow(10, gll2));
                                ctx.fillText('10^' + Math.round(gll2), pad.l - 5, gy2);
                            }

                            ctx.fillStyle = '#8b949e'; ctx.textAlign = 'center'; ctx.textBaseline = 'top';
                            ctx.fillText('\u03c3', W / 2, H - 14);

                            // Legend
                            ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
                            ctx.strokeStyle = '#3fb950'; ctx.lineWidth = 1.5; ctx.setLineDash([8,4]);
                            ctx.beginPath(); ctx.moveTo(W-200, 14); ctx.lineTo(W-180, 14); ctx.stroke(); ctx.setLineDash([]);
                            ctx.fillStyle = '#3fb950'; ctx.fillText('Density Hyp.', W-174, 14);
                            ctx.strokeStyle = '#f0883e'; ctx.lineWidth = 2;
                            ctx.beginPath(); ctx.moveTo(W-200, 30); ctx.lineTo(W-180, 30); ctx.stroke();
                            ctx.fillStyle = '#f0883e'; ctx.fillText('Huxley', W-174, 30);
                            ctx.strokeStyle = '#bc8cff'; ctx.lineWidth = 2;
                            ctx.beginPath(); ctx.moveTo(W-200, 46); ctx.lineTo(W-180, 46); ctx.stroke();
                            ctx.fillStyle = '#bc8cff'; ctx.fillText('Ingham', W-174, 46);

                            ctx.fillStyle = '#f0f6fc'; ctx.font = 'bold 12px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText('Upper bounds on N(\u03c3, T) for T = ' + T.toLocaleString() + ' (log scale)', W/2, 18);
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Ingham\'s bound gives \\(N(\\sigma, T) \\ll T^{3(1-\\sigma)/(2-\\sigma)}(\\log T)^5\\). For \\(\\sigma = 3/4\\), what exponent does this give for \\(T\\)?',
                    hint: 'Substitute \\(\\sigma = 3/4\\) into the exponent \\(3(1-\\sigma)/(2-\\sigma)\\).',
                    solution: 'With \\(\\sigma = 3/4\\): \\(3(1 - 3/4)/(2 - 3/4) = 3 \\cdot (1/4) / (5/4) = (3/4)/(5/4) = 3/5\\). So \\(N(3/4, T) \\ll T^{3/5}(\\log T)^5\\). Huxley\'s bound gives \\(T^{(12/5)(1/4)}(\\log T)^A = T^{3/5}(\\log T)^A\\), the same exponent in \\(T\\)! The density hypothesis would give \\(T^{2(1/4)} = T^{1/2}\\), a better bound.'
                }
            ]
        },

        // ================================================================
        // SECTION 4: The Density Hypothesis
        // ================================================================
        {
            id: 'sec-density-hypothesis',
            title: 'The Density Hypothesis',
            content: `
<h2>The Density Hypothesis</h2>

<div class="env-block definition">
    <div class="env-title">Definition: The Density Hypothesis</div>
    <div class="env-body">
        <p>The <strong>Density Hypothesis</strong> for \\(\\zeta(s)\\) asserts that for any \\(\\varepsilon > 0\\) and \\(\\tfrac{1}{2} \\le \\sigma \\le 1\\),</p>
        \\[
        N(\\sigma, T) \\ll T^{2(1-\\sigma)+\\varepsilon}.
        \\]
    </div>
</div>

<p>The exponent \\(2(1-\\sigma)\\) is believed to be the correct order of magnitude. It is motivated by probabilistic heuristics: if the zeros behaved like points of a Poisson process on the critical line, the expected number in a \\(\\sigma\\)-neighborhood would scale like \\(T^{2(1-\\sigma)}\\).</p>

<h3>Why the Exponent 2(1-σ)?</h3>

<p>Consider trying to "move" a zero from \\(\\operatorname{Re}(s) = \\tfrac{1}{2}\\) to \\(\\operatorname{Re}(s) = \\sigma\\). By the mean value theorem, \\(\\int_0^T |\\zeta(\\sigma+it)|^{2k}\\,dt \\asymp T(\\log T)^{k^2}\\) for positive integers \\(k\\). The \\(2k\\)-th moment bounds the number of large values, and optimizing over \\(k\\) (or using Dirichlet polynomial methods) gives the exponent \\(2(1-\\sigma)\\) in the density hypothesis.</p>

<h3>Known Results</h3>

<p>The density hypothesis is known conditionally under RH (trivially) and under the Generalized Lindelof Hypothesis. Unconditionally:</p>
<ul>
    <li><strong>Montgomery (1971):</strong> \\(N(\\sigma, T) \\ll T^{(2+\\varepsilon)(1-\\sigma)}\\) for \\(\\sigma\\) near 1. This matches the density hypothesis with the extra \\(\\varepsilon\\) factor in the exponent.</li>
    <li><strong>Jutila (1977):</strong> Proved the density hypothesis for \\(\\sigma \\ge 11/14\\).</li>
    <li><strong>Guth-Maynard (2024):</strong> Using new methods from decoupling and incidence geometry, proved \\(N(\\sigma, T) \\ll T^{(15/8)(1-\\sigma)+\\varepsilon}\\) improving on Huxley for a range of \\(\\sigma\\). This has arithmetic consequences for primes in short intervals.</li>
</ul>

<h3>The Grand Density Hypothesis</h3>

<p>For a Dirichlet L-function \\(L(s,\\chi)\\) modulo \\(q\\), define \\(N(\\sigma, T, \\chi)\\) analogously. The Grand Density Hypothesis for Dirichlet L-functions asserts</p>
\\[
\\sum_{\\chi \\pmod{q}} N(\\sigma, T, \\chi) \\ll (qT)^{2(1-\\sigma)+\\varepsilon}.
\\]
<p>This uniform version (averaging over all characters modulo \\(q\\)) is what is actually needed for strong results about primes in arithmetic progressions.</p>

<div class="env-block theorem">
    <div class="env-title">Theorem 16.4 (Arithmetic Application)</div>
    <div class="env-body">
        <p>Under the density hypothesis, the error term in the PNT satisfies</p>
        \\[
        \\psi(x) = x + O(x^{1/2+\\varepsilon})
        \\]
        <p>for every \\(\\varepsilon > 0\\). Under GRH, the same bound holds, but the density hypothesis is a strictly weaker assumption.</p>
    </div>
</div>

<div class="env-block remark">
    <div class="env-title">The Hierarchy of Hypotheses</div>
    <div class="env-body">
        <p>RH implies the Generalized Lindelof Hypothesis, which implies the density hypothesis. But none of these implications has been reversed. The density hypothesis is the weakest of the three and the most likely to be proved first — yet even it remains open for the full range \\(\\frac{1}{2} \\le \\sigma \\le 1\\).</p>
    </div>
</div>
`,
            visualizations: [],
            exercises: [
                {
                    question: 'Show that the density hypothesis implies \\(N(T) \\ll T^{1+\\varepsilon}\\) for any \\(\\varepsilon > 0\\) (where \\(N(T)\\) counts all zeros with \\(0 < \\gamma \\le T\\)).',
                    hint: 'Take \\(\\sigma = 1/2\\) in the density hypothesis. The density hypothesis gives \\(N(1/2, T) \\ll T^{2(1-1/2)+\\varepsilon} = T^{1+\\varepsilon}\\).',
                    solution: 'By definition, \\(N(T) = N(1/2, T)\\) since every nontrivial zero has \\(\\beta \\ge 1/2\\) (the zeros are in the critical strip \\(0 < \\beta < 1\\), and by symmetry we count \\(\\beta \\ge 1/2\\) or equivalently all zeros). The density hypothesis with \\(\\sigma = 1/2\\) gives \\(N(T) = N(1/2, T) \\ll T^{2(1-1/2)+\\varepsilon} = T^{1+\\varepsilon}\\). This is consistent with the Riemann-von Mangoldt formula \\(N(T) \\sim \\frac{T}{2\\pi}\\log T\\), which is \\(O(T^{1+\\varepsilon})\\).'
                }
            ]
        },

        // ================================================================
        // SECTION 5: Montgomery's Pair Correlation
        // ================================================================
        {
            id: 'sec-pair-correlation',
            title: "Montgomery's Pair Correlation",
            content: `
<h2>Montgomery's Pair Correlation</h2>

<div class="env-block intuition">
    <div class="env-title">From Counting to Spacing</div>
    <div class="env-body">
        <p>The Riemann-von Mangoldt formula tells us the total number of zeros up to height \\(T\\), and their average spacing. But what about the <em>distribution</em> of gaps? How often do zeros cluster close together versus spread far apart?</p>
        <p>Hugh Montgomery (1972) introduced a precise statistical tool: the pair correlation function.</p>
    </div>
</div>

<div class="env-block definition">
    <div class="env-title">Definition: Pair Correlation Function</div>
    <div class="env-body">
        <p>Let \\(\\gamma_1, \\gamma_2, \\ldots\\) be the imaginary parts of the nontrivial zeros of \\(\\zeta(s)\\), normalized so that the average spacing is 1 (i.e., replace \\(\\gamma_n\\) by \\(\\tilde{\\gamma}_n = \\gamma_n \\cdot \\frac{\\log \\gamma_n}{2\\pi}\\)). The pair correlation function is</p>
        \\[
        F(\\alpha) = \\frac{1}{N(T)} \\sum_{\\substack{m \\ne n \\\\ |\\gamma_m - \\gamma_n| \\le T}} e^{2\\pi i \\alpha (\\tilde{\\gamma}_m - \\tilde{\\gamma}_n)}.
        \\]
        <p>The pair correlation density \\(p_2(s)\\) is defined by the relation \\(\\hat{p}_2(\\alpha) = F(\\alpha)\\).</p>
    </div>
</div>

<h3>Montgomery's Theorem</h3>

<div class="env-block theorem">
    <div class="env-title">Theorem 16.5 (Montgomery, 1972)</div>
    <div class="env-body">
        <p>Assuming RH, for \\(0 \\le \\alpha \\le 1\\),</p>
        \\[
        F(\\alpha) \\sim 1 - \\left(\\frac{\\sin(\\pi\\alpha)}{\\pi\\alpha}\\right)^2 + \\delta(\\alpha)
        \\]
        <p>as \\(T \\to \\infty\\), where \\(\\delta(\\alpha)\\) is the Dirac delta at 0. Equivalently, the two-point correlation function is</p>
        \\[
        R_2(s) = 1 - \\left(\\frac{\\sin(\\pi s)}{\\pi s}\\right)^2.
        \\]
    </div>
</div>

<p>This is precisely the pair correlation function of eigenvalues of large random Hermitian matrices from the <strong>Gaussian Unitary Ensemble (GUE)</strong>. Montgomery proved his result for \\(\\alpha \\in [0,1]\\); the full range \\(\\alpha > 1\\) is still open.</p>

<h3>Dyson's Observation</h3>

<p>When Montgomery presented his result at an IAS tea in 1972, Freeman Dyson immediately recognized the formula \\(1 - (\\sin(\\pi s)/\\pi s)^2\\) as the pair correlation of GUE eigenvalues, which he had computed in the context of nuclear energy levels. This serendipitous collision of number theory and quantum physics has driven decades of research.</p>

<h3>The Hardy-Littlewood Conjecture Connection</h3>

<p>Montgomery showed that his pair correlation result is equivalent (on RH) to a strong form of the <strong>Hardy-Littlewood prime \\(k\\)-tuples conjecture</strong> for pairs. More precisely, the pair correlation of zeros encodes information about the distribution of pairs of primes \\((p, p+h)\\), and the GUE statistics predict the correct constant in the Hardy-Littlewood conjecture.</p>

<div class="viz-placeholder" data-viz="viz-random-matrix"></div>
`,
            visualizations: [
                {
                    id: 'viz-random-matrix',
                    title: 'Random Matrix Eigenvalue Spacings (GUE Simulation)',
                    description: 'Eigenvalue spacings of a random \\(N \\times N\\) Hermitian matrix (GUE). The histogram approaches the Wigner surmise \\(p(s) = \\frac{\\pi}{2}s e^{-\\pi s^2/4}\\) as \\(N \\to \\infty\\). Press "New Matrix" to resample.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, { width: 680, height: 380, originX: 50, originY: 340, scale: 1 });
                        var N = 40;
                        VizEngine.createSlider(controls, 'Matrix size N', 10, 80, N, 5, function(v) { N = Math.round(v); generateAndDraw(); });
                        VizEngine.createButton(controls, 'New Matrix', function() { generateAndDraw(); });

                        function generateGUEEigenvalues(n) {
                            // Generate a random n x n Hermitian matrix and compute eigenvalues
                            // We use a real symmetric matrix (GOE) as an approximation for visualization
                            // Real symmetric: A[i][j] = A[j][i], entries N(0,1) off-diagonal, N(0,2) diagonal
                            var A = [];
                            for (var i = 0; i < n; i++) {
                                A.push(new Float64Array(n));
                            }
                            // Fill upper triangle
                            for (var i = 0; i < n; i++) {
                                for (var j = i; j < n; j++) {
                                    var r1 = Math.random(), r2 = Math.random();
                                    var z = Math.sqrt(-2 * Math.log(Math.max(r1, 1e-15))) * Math.cos(2 * Math.PI * r2);
                                    if (i === j) z *= Math.sqrt(2);
                                    A[i][j] = z;
                                    A[j][i] = z;
                                }
                            }
                            // Power iteration / QR-like: use Jacobi eigenvalue algorithm (simplified)
                            // For small n, use iterative Jacobi
                            var eigs = jacobiEigenvalues(A, n);
                            eigs.sort(function(a, b) { return a - b; });
                            return eigs;
                        }

                        function jacobiEigenvalues(A, n) {
                            // Make a copy
                            var M = [];
                            for (var i = 0; i < n; i++) M.push(A[i].slice());
                            var maxIter = n * n * 10;
                            for (var iter = 0; iter < maxIter; iter++) {
                                // Find largest off-diagonal
                                var maxVal = 0, p = 0, q = 1;
                                for (var i = 0; i < n; i++) {
                                    for (var j = i + 1; j < n; j++) {
                                        if (Math.abs(M[i][j]) > maxVal) { maxVal = Math.abs(M[i][j]); p = i; q = j; }
                                    }
                                }
                                if (maxVal < 1e-8) break;
                                // Compute rotation angle
                                var theta = 0;
                                if (Math.abs(M[p][p] - M[q][q]) > 1e-12) {
                                    theta = 0.5 * Math.atan2(2 * M[p][q], M[p][p] - M[q][q]);
                                } else {
                                    theta = Math.PI / 4;
                                }
                                var c = Math.cos(theta), s = Math.sin(theta);
                                // Update
                                var newPP = c*c*M[p][p] + 2*c*s*M[p][q] + s*s*M[q][q];
                                var newQQ = s*s*M[p][p] - 2*c*s*M[p][q] + c*c*M[q][q];
                                var newPQ = (c*c - s*s)*M[p][q] + c*s*(M[q][q] - M[p][p]);
                                for (var r = 0; r < n; r++) {
                                    if (r !== p && r !== q) {
                                        var newRp = c*M[r][p] + s*M[r][q];
                                        var newRq = -s*M[r][p] + c*M[r][q];
                                        M[r][p] = M[p][r] = newRp;
                                        M[r][q] = M[q][r] = newRq;
                                    }
                                }
                                M[p][p] = newPP; M[q][q] = newQQ; M[p][q] = M[q][p] = newPQ;
                            }
                            var eigs = [];
                            for (var i = 0; i < n; i++) eigs.push(M[i][i]);
                            return eigs;
                        }

                        function computeSpacings(eigs) {
                            var spacings = [];
                            for (var i = 0; i < eigs.length - 1; i++) spacings.push(eigs[i+1] - eigs[i]);
                            // Normalize so mean = 1
                            var mean = spacings.reduce(function(a,b){return a+b;},0) / spacings.length;
                            if (mean > 0) spacings = spacings.map(function(s) { return s / mean; });
                            return spacings;
                        }

                        function wignerSurmise(s) {
                            return (Math.PI / 2) * s * Math.exp(-Math.PI * s * s / 4);
                        }

                        function drawHistogram(spacings) {
                            viz.clear();
                            var ctx = viz.ctx;
                            var W = viz.width, H = viz.height;
                            var pad = { l: 55, r: 20, t: 30, b: 45 };
                            var chartW = W - pad.l - pad.r;
                            var chartH = H - pad.t - pad.b;

                            var sMax = 3.5, nBins = 20;
                            var bins = new Array(nBins).fill(0);
                            var binW = sMax / nBins;
                            spacings.forEach(function(s) {
                                var b = Math.floor(s / binW);
                                if (b >= 0 && b < nBins) bins[b]++;
                            });
                            var total = spacings.length;
                            var maxDensity = 0;
                            bins.forEach(function(c) { maxDensity = Math.max(maxDensity, c / (total * binW)); });
                            maxDensity = Math.max(maxDensity, wignerSurmise(Math.sqrt(2/Math.PI)) * 1.2);

                            function sx(s) { return pad.l + (s / sMax) * chartW; }
                            function sy(d) { return pad.t + chartH - (d / (maxDensity * 1.1)) * chartH; }

                            // Grid
                            ctx.strokeStyle = '#1a1a40'; ctx.lineWidth = 0.5;
                            for (var gi = 0; gi <= 5; gi++) {
                                var gd = gi * maxDensity / 5;
                                ctx.beginPath(); ctx.moveTo(pad.l, sy(gd)); ctx.lineTo(W-pad.r, sy(gd)); ctx.stroke();
                            }

                            // Bars
                            bins.forEach(function(c, bi) {
                                var density = c / (total * binW);
                                var bx = sx(bi * binW);
                                var bw = chartW / nBins - 1;
                                var byTop = sy(density);
                                ctx.fillStyle = '#bc8cff44';
                                ctx.fillRect(bx, byTop, bw, H - pad.b - byTop);
                                ctx.strokeStyle = '#bc8cff'; ctx.lineWidth = 1;
                                ctx.strokeRect(bx, byTop, bw, H - pad.b - byTop);
                            });

                            // Wigner surmise
                            ctx.strokeStyle = '#f85149'; ctx.lineWidth = 2.5;
                            ctx.beginPath();
                            var first = true;
                            for (var si = 0; si <= sMax; si += sMax / 200) {
                                var wy = wignerSurmise(si);
                                var px = sx(si), py = sy(wy);
                                first ? (ctx.moveTo(px, py), first = false) : ctx.lineTo(px, py);
                            }
                            ctx.stroke();

                            // Axes
                            ctx.strokeStyle = '#4a4a7a'; ctx.lineWidth = 1;
                            ctx.beginPath(); ctx.moveTo(pad.l, pad.t); ctx.lineTo(pad.l, H-pad.b); ctx.stroke();
                            ctx.beginPath(); ctx.moveTo(pad.l, H-pad.b); ctx.lineTo(W-pad.r, H-pad.b); ctx.stroke();

                            ctx.fillStyle = '#8b949e'; ctx.font = '11px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            for (var ti = 0; ti <= 7; ti++) ctx.fillText((ti*0.5).toFixed(1), sx(ti*0.5), H-pad.b+14);
                            ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
                            for (var gi2 = 0; gi2 <= 5; gi2++) {
                                var gd2 = gi2 * maxDensity / 5;
                                ctx.fillText(gd2.toFixed(2), pad.l-5, sy(gd2));
                            }
                            ctx.textAlign = 'center'; ctx.textBaseline = 'top';
                            ctx.fillText('Normalized spacing s', W/2, H-14);
                            ctx.save(); ctx.translate(14, H/2); ctx.rotate(-Math.PI/2); ctx.fillText('Density', 0, 0); ctx.restore();

                            // Legend & title
                            ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
                            ctx.fillStyle = '#bc8cff'; ctx.fillRect(W-200, 12, 14, 10); ctx.fillText('GUE eigenvalue gaps', W-180, 17);
                            ctx.strokeStyle = '#f85149'; ctx.lineWidth = 2.5;
                            ctx.beginPath(); ctx.moveTo(W-200, 32); ctx.lineTo(W-186, 32); ctx.stroke();
                            ctx.fillStyle = '#f85149'; ctx.fillText('Wigner surmise', W-180, 32);
                            ctx.fillStyle = '#f0f6fc'; ctx.font = 'bold 12px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText(N + '\xd7' + N + ' random matrix, ' + spacings.length + ' spacings', W/2, 18);
                        }

                        function generateAndDraw() {
                            var eigs = generateGUEEigenvalues(N);
                            var spacings = computeSpacings(eigs);
                            drawHistogram(spacings);
                        }
                        generateAndDraw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'The pair correlation density is \\(R_2(s) = 1 - (\\sin(\\pi s)/\\pi s)^2\\). Compute \\(R_2(0)\\) and interpret the result in terms of zero spacing.',
                    hint: 'As \\(s \\to 0\\), \\(\\sin(\\pi s)/(\\pi s) \\to 1\\). Think about what \\(R_2(0) = 0\\) means for the probability of finding two zeros very close together.',
                    solution: '\\(R_2(0) = 1 - \\lim_{s\\to 0}(\\sin(\\pi s)/\\pi s)^2 = 1 - 1 = 0\\). This is <strong>level repulsion</strong>: the probability of finding two zeros very close together (spacing \\(s \\approx 0\\)) is approximately 0. Zeros of \\(\\zeta(s)\\) tend to repel each other, just like eigenvalues of random unitary matrices. This contrasts with a Poisson process (random points), where \\(R_2(0) = 1\\) and close clustering is common.'
                }
            ]
        },

        // ================================================================
        // SECTION 6: Random Matrix Theory
        // ================================================================
        {
            id: 'sec-random-matrices',
            title: 'Random Matrix Theory (GUE)',
            content: `
<h2>Random Matrix Theory and the GUE</h2>

<div class="env-block intuition">
    <div class="env-title">Why Matrices?</div>
    <div class="env-body">
        <p>In quantum mechanics, energy levels of a complex quantum system are modeled as eigenvalues of a large Hermitian matrix. Wigner's insight (1951) was that for a "generic" complex system, the statistics of these eigenvalues depend not on the specifics of the Hamiltonian but only on its symmetry class. For systems with unitary symmetry, this leads to the Gaussian Unitary Ensemble (GUE).</p>
        <p>Montgomery's 1972 discovery: zeta zeros apparently fall in the same symmetry class.</p>
    </div>
</div>

<h3>The Gaussian Unitary Ensemble</h3>

<div class="env-block definition">
    <div class="env-title">Definition: GUE</div>
    <div class="env-body">
        <p>The <strong>Gaussian Unitary Ensemble (GUE)</strong> is the probability measure on \\(N \\times N\\) complex Hermitian matrices \\(H\\) with density proportional to \\(e^{-\\operatorname{tr}(H^2)}\\). The entries \\(H_{jk}\\) for \\(j < k\\) are independent complex Gaussians \\(\\mathcal{N}(0, 1/2) + i\\mathcal{N}(0, 1/2)\\), and the diagonal entries are real \\(\\mathcal{N}(0, 1)\\).</p>
    </div>
</div>

<p>The GUE eigenvalue distribution has two key universality properties:</p>
<ol>
    <li><strong>Local statistics are universal:</strong> The spacing distribution depends only on the symmetry class (unitary), not on the specific Gaussian distribution.</li>
    <li><strong>The density of states follows Wigner's semicircle law:</strong> The empirical spectral distribution converges to \\(\\rho(x) = \\frac{1}{2\\pi}\\sqrt{4 - x^2}\\) for \\(|x| \\le 2\\).</li>
</ol>

<h3>Nearest-Neighbor Spacing</h3>

<p>For GUE, the nearest-neighbor spacing distribution is approximated by the <strong>Wigner surmise</strong>:</p>
\\[
p_{\\text{GUE}}(s) = \\frac{32}{\\pi^2} s^2 e^{-4s^2/\\pi}.
\\]
<p>For practical purposes (and for comparison with zeta zeros), the simpler form</p>
\\[
p(s) = \\frac{\\pi}{2} s e^{-\\pi s^2/4}
\\]
<p>gives excellent agreement. Both exhibit <strong>level repulsion</strong> (vanishing as \\(s \\to 0\\)) and <strong>exponential suppression</strong> of large gaps.</p>

<h3>Higher Correlations</h3>

<p>The GUE prediction goes beyond pair correlation. The \\(n\\)-point correlation functions of GUE are given by a determinantal formula involving the sine kernel:</p>
\\[
K(x, y) = \\frac{\\sin(\\pi(x-y))}{\\pi(x-y)}.
\\]
\\[
R_n(x_1, \\ldots, x_n) = \\det[K(x_i, x_j)]_{1 \\le i,j \\le n}.
\\]
<p>For \\(n = 2\\): \\(R_2(s) = 1 - K(0, s)^2 = 1 - (\\sin(\\pi s)/\\pi s)^2\\), recovering Montgomery's formula.</p>

<div class="env-block theorem">
    <div class="env-title">Theorem 16.6 (Rudnick-Sarnak, 1996)</div>
    <div class="env-body">
        <p>For any automorphic L-function (not just \\(\\zeta(s)\\)), the \\(n\\)-level density statistics of zeros near height \\(T\\) are consistent with the GUE prediction as \\(T \\to \\infty\\), assuming the relevant L-functions have no zeros with small imaginary part.</p>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-gue-comparison"></div>
`,
            visualizations: [
                {
                    id: 'viz-gue-comparison',
                    title: 'Zeta Zeros vs GUE Eigenvalues: Spacing Overlay',
                    description: 'Direct comparison of normalized spacings between consecutive zeta zeros (blue) and consecutive GUE eigenvalues from a 50\\(\\times\\)50 random matrix (purple), overlaid with the Wigner surmise (red). Both empirical distributions track the GUE prediction closely.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, { width: 680, height: 380, originX: 50, originY: 340, scale: 1 });

                        var zeros100 = [
                            14.134725,18.210242,21.022040,25.010858,30.424876,32.935062,37.586178,40.918719,
                            43.327073,48.005151,49.773832,52.970321,56.446248,59.347044,60.831779,65.112544,
                            67.079811,69.546402,72.067158,75.704691,77.144840,79.337376,82.910381,84.735493,
                            87.425275,88.809112,92.491900,94.651344,95.870634,98.831194,101.317851,103.725538,
                            105.446623,107.168611,111.029535,111.874659,114.320221,116.226680,118.790782,121.370125,
                            122.946829,124.256819,127.516684,129.578704,131.087688,133.497737,134.756510,138.116042,
                            139.736209,141.123707,143.111846,146.000982,147.422765,150.053521,150.925257,153.024693,
                            156.112909,157.597591,158.849988,161.188964,163.030709,165.537069,167.184439,169.094515,
                            169.911976,173.411536,174.754191,176.441434,178.377407,179.916484,182.207078,184.874467,
                            185.598783,187.228922,189.416159,192.026656,193.079726,195.265397,196.876481,198.015309,
                            201.264751,202.493595,204.189671,205.394697,207.906259,209.576509,211.690862,213.347919,
                            214.547044,216.169538,219.067596,220.714918,221.430705,224.007000,224.983324,227.421444,
                            229.337413,231.250188,231.987235,233.693404
                        ];

                        function computeZetaSpacings() {
                            var sp = [];
                            for (var i = 0; i < zeros100.length - 1; i++) {
                                var gap = zeros100[i+1] - zeros100[i];
                                var lf = Math.log(zeros100[i] / (2*Math.PI)) / (2*Math.PI);
                                var n = gap * lf;
                                if (n > 0) sp.push(n);
                            }
                            return sp;
                        }

                        function generateGOESpacings(n) {
                            // Small random symmetric matrix
                            var A = [];
                            for (var i = 0; i < n; i++) A.push(new Float64Array(n));
                            for (var i = 0; i < n; i++) {
                                for (var j = i; j < n; j++) {
                                    var r1 = Math.random(), r2 = Math.random();
                                    var z = Math.sqrt(-2*Math.log(Math.max(r1,1e-15)))*Math.cos(2*Math.PI*r2);
                                    if (i===j) z *= Math.sqrt(2);
                                    A[i][j] = A[j][i] = z;
                                }
                            }
                            // Power method for eigenvalues approximation using tridiagonal reduction
                            // Use a simpler approach: sum of Gaussian for each eigenvalue (Wigner-like)
                            // For true GUE, we rely on the Jacobi method
                            var eigs = jacobiEigs(A, n);
                            eigs.sort(function(a,b){return a-b;});
                            var sp = [];
                            for (var i = 0; i < n-1; i++) sp.push(eigs[i+1] - eigs[i]);
                            var mean = sp.reduce(function(a,b){return a+b;},0) / sp.length;
                            if (mean > 0) sp = sp.map(function(s){return s/mean;});
                            return sp;
                        }

                        function jacobiEigs(A, n) {
                            var M = [];
                            for (var i = 0; i < n; i++) M.push(A[i].slice());
                            for (var iter = 0; iter < n*n*5; iter++) {
                                var maxV = 0, p = 0, q = 1;
                                for (var i = 0; i < n; i++) for (var j = i+1; j < n; j++) if (Math.abs(M[i][j]) > maxV) { maxV = Math.abs(M[i][j]); p=i; q=j; }
                                if (maxV < 1e-8) break;
                                var th = Math.abs(M[p][p]-M[q][q]) > 1e-12 ? 0.5*Math.atan2(2*M[p][q], M[p][p]-M[q][q]) : Math.PI/4;
                                var c = Math.cos(th), s = Math.sin(th);
                                var npp = c*c*M[p][p]+2*c*s*M[p][q]+s*s*M[q][q];
                                var nqq = s*s*M[p][p]-2*c*s*M[p][q]+c*c*M[q][q];
                                var npq = (c*c-s*s)*M[p][q]+c*s*(M[q][q]-M[p][p]);
                                for (var r = 0; r < n; r++) {
                                    if (r!==p && r!==q) {
                                        var nrp = c*M[r][p]+s*M[r][q];
                                        var nrq = -s*M[r][p]+c*M[r][q];
                                        M[r][p]=M[p][r]=nrp; M[r][q]=M[q][r]=nrq;
                                    }
                                }
                                M[p][p]=npp; M[q][q]=nqq; M[p][q]=M[q][p]=npq;
                            }
                            return Array.from({length:n},function(_,i){return M[i][i];});
                        }

                        function wignerSurmise(s) { return (Math.PI/2)*s*Math.exp(-Math.PI*s*s/4); }

                        function buildHist(spacings, nBins, sMax) {
                            var bins = new Array(nBins).fill(0);
                            var bw = sMax / nBins;
                            spacings.forEach(function(s) { var b = Math.floor(s/bw); if (b>=0&&b<nBins) bins[b]++; });
                            var total = spacings.length;
                            return bins.map(function(c) { return c / (total * bw); });
                        }

                        var reuseGOE = null;

                        VizEngine.createButton(controls, 'New Matrix', function() { reuseGOE = null; draw(); });

                        function draw() {
                            if (!reuseGOE) reuseGOE = generateGOESpacings(50);
                            var zetaSp = computeZetaSpacings();
                            var goeSp = reuseGOE;

                            viz.clear();
                            var ctx = viz.ctx;
                            var W = viz.width, H = viz.height;
                            var pad = { l: 55, r: 20, t: 30, b: 45 };
                            var chartW = W - pad.l - pad.r;
                            var chartH = H - pad.t - pad.b;
                            var sMax = 3.5, nBins = 18;
                            var bw = sMax / nBins;

                            var zHist = buildHist(zetaSp, nBins, sMax);
                            var gHist = buildHist(goeSp, nBins, sMax);
                            var maxD = 0;
                            zHist.forEach(function(d){maxD=Math.max(maxD,d);});
                            gHist.forEach(function(d){maxD=Math.max(maxD,d);});
                            maxD = Math.max(maxD, 1.0);

                            function sx(s) { return pad.l + (s/sMax)*chartW; }
                            function sy(d) { return pad.t + chartH - (d/(maxD*1.1))*chartH; }

                            ctx.strokeStyle = '#1a1a40'; ctx.lineWidth = 0.5;
                            for (var gi = 0; gi <= 5; gi++) {
                                var gd = gi*maxD/5;
                                ctx.beginPath(); ctx.moveTo(pad.l,sy(gd)); ctx.lineTo(W-pad.r,sy(gd)); ctx.stroke();
                            }

                            var bwPx = chartW / nBins;
                            // GUE bars (offset slightly)
                            gHist.forEach(function(d, bi) {
                                var bx = sx(bi*bw) + bwPx*0.25;
                                var bw2 = bwPx * 0.45;
                                ctx.fillStyle = '#bc8cff44';
                                ctx.fillRect(bx, sy(d), bw2, H-pad.b-sy(d));
                                ctx.strokeStyle = '#bc8cff'; ctx.lineWidth = 1;
                                ctx.strokeRect(bx, sy(d), bw2, H-pad.b-sy(d));
                            });
                            // Zeta bars
                            zHist.forEach(function(d, bi) {
                                var bx = sx(bi*bw);
                                var bw2 = bwPx * 0.45;
                                ctx.fillStyle = '#58a6ff44';
                                ctx.fillRect(bx, sy(d), bw2, H-pad.b-sy(d));
                                ctx.strokeStyle = '#58a6ff'; ctx.lineWidth = 1;
                                ctx.strokeRect(bx, sy(d), bw2, H-pad.b-sy(d));
                            });

                            // Wigner
                            ctx.strokeStyle = '#f85149'; ctx.lineWidth = 2.5;
                            ctx.beginPath();
                            var first = true;
                            for (var si = 0; si <= sMax; si += sMax/300) {
                                var wy = wignerSurmise(si);
                                first ? (ctx.moveTo(sx(si),sy(wy)), first=false) : ctx.lineTo(sx(si),sy(wy));
                            }
                            ctx.stroke();

                            // Axes
                            ctx.strokeStyle = '#4a4a7a'; ctx.lineWidth = 1;
                            ctx.beginPath(); ctx.moveTo(pad.l,pad.t); ctx.lineTo(pad.l,H-pad.b); ctx.stroke();
                            ctx.beginPath(); ctx.moveTo(pad.l,H-pad.b); ctx.lineTo(W-pad.r,H-pad.b); ctx.stroke();

                            ctx.fillStyle = '#8b949e'; ctx.font = '11px -apple-system,sans-serif'; ctx.textAlign = 'center';
                            for (var ti = 0; ti <= 7; ti++) ctx.fillText((ti*0.5).toFixed(1), sx(ti*0.5), H-pad.b+14);
                            ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
                            for (var gi2 = 0; gi2 <= 5; gi2++) {
                                var gd2 = gi2*maxD/5;
                                ctx.fillText(gd2.toFixed(2), pad.l-5, sy(gd2));
                            }
                            ctx.textAlign = 'center'; ctx.textBaseline = 'top';
                            ctx.fillText('Normalized spacing s', W/2, H-14);
                            ctx.save(); ctx.translate(14, H/2); ctx.rotate(-Math.PI/2); ctx.fillText('Density', 0, 0); ctx.restore();

                            ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
                            ctx.fillStyle = '#58a6ff'; ctx.fillRect(W-220, 12, 14, 10); ctx.fillText('Zeta zeros', W-200, 17);
                            ctx.fillStyle = '#bc8cff'; ctx.fillRect(W-220, 28, 14, 10); ctx.fillText('50\xd750 GUE matrix', W-200, 33);
                            ctx.strokeStyle = '#f85149'; ctx.lineWidth = 2.5;
                            ctx.beginPath(); ctx.moveTo(W-220, 48); ctx.lineTo(W-206, 48); ctx.stroke();
                            ctx.fillStyle = '#f85149'; ctx.fillText('Wigner surmise', W-200, 48);

                            ctx.fillStyle = '#f0f6fc'; ctx.font = 'bold 12px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText('Zeta zeros vs GUE eigenvalues: both follow GUE statistics', W/2, 18);
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'The Wigner surmise is \\(p(s) = \\frac{\\pi}{2}s e^{-\\pi s^2/4}\\). Verify that this is a probability density: show \\(\\int_0^\\infty p(s)\\,ds = 1\\) and \\(\\int_0^\\infty s \\cdot p(s)\\,ds = 1\\) (unit mean).',
                    hint: 'For the normalization integral, use the substitution \\(u = \\pi s^2/4\\). For the mean, use integration by parts or the substitution \\(u = s^2\\).',
                    solution: 'Normalization: let \\(u = \\pi s^2/4\\), \\(du = \\pi s/2\\,ds\\). Then \\(\\int_0^\\infty \\frac{\\pi}{2} s e^{-u} \\frac{2}{\\pi s}\\,du = \\int_0^\\infty e^{-u}\\,du = 1\\). Mean: \\(\\int_0^\\infty s \\cdot \\frac{\\pi}{2}s e^{-\\pi s^2/4}\\,ds = \\frac{\\pi}{2}\\int_0^\\infty s^2 e^{-\\pi s^2/4}\\,ds\\). Let \\(t = \\sqrt{\\pi/4}\\,s\\); this becomes \\(\\frac{\\pi}{2}\\cdot(4/\\pi)^{3/2}\\int_0^\\infty t^2 e^{-t^2}\\,dt = \\frac{\\pi}{2}\\cdot(4/\\pi)^{3/2}\\cdot\\frac{\\sqrt{\\pi}}{4} = 1\\).'
                }
            ]
        },

        // ================================================================
        // SECTION 7: The Automorphic Perspective
        // ================================================================
        {
            id: 'sec-bridge',
            title: 'The Automorphic Perspective',
            content: `
<h2>The Automorphic Perspective</h2>

<div class="env-block intuition">
    <div class="env-title">Zeros as a Universal Phenomenon</div>
    <div class="env-body">
        <p>The GUE statistics of zeta zeros are not a coincidence specific to the Riemann zeta function. They appear to be a <em>universal</em> phenomenon for all automorphic L-functions. This universality, called the <strong>Katz-Sarnak philosophy</strong>, connects deep arithmetic to random matrix theory.</p>
    </div>
</div>

<h3>The Katz-Sarnak Framework</h3>

<p>Katz and Sarnak (1999) studied families of L-functions and showed that the symmetry type (unitary, orthogonal, symplectic) of the monodromy group of a family of varieties over finite fields governs the local statistics of zeros. For the Riemann zeta function (a single L-function), the relevant symmetry type is unitary (GUE).</p>

<p>More precisely, for a "family" \\(\\{L(s, \\pi)\\}\\) of automorphic L-functions, as we vary \\(\\pi\\) over a natural collection:</p>
<ul>
    <li><strong>Unitary symmetry (GUE):</strong> Appears for GL(1) twists (Dirichlet characters) and for "generic" families.</li>
    <li><strong>Orthogonal symmetry (GOE/SO):</strong> Appears for self-dual families with positive root number (e.g., symmetric square L-functions).</li>
    <li><strong>Symplectic symmetry (GSp):</strong> Appears for families with negative root number (e.g., quadratic twists of elliptic curve L-functions).</li>
</ul>

<h3>Low-Lying Zeros and the 1-Level Density</h3>

<p>The <strong>1-level density</strong> of a family is the average distribution of zeros near the central point \\(s = \\tfrac{1}{2}\\). Define</p>
\\[
D_1(f, \\phi) = \\sum_{L(\\rho, \\pi) = 0} \\phi\\!\\left(\\frac{\\log c(\\pi)}{2\\pi}\\cdot\\gamma\\right),
\\]
<p>where \\(\\phi\\) is a Schwartz function, \\(c(\\pi)\\) is the analytic conductor, and \\(\\gamma\\) runs over imaginary parts of zeros.</p>

<div class="env-block theorem">
    <div class="env-title">Theorem 16.7 (Iwaniec-Luo-Sarnak, 2000)</div>
    <div class="env-body">
        <p>For the family of Hecke-Maass cusp forms on \\(\\text{SL}(2,\\mathbb{Z})\\) (holomorphic or Maass), the 1-level density satisfies</p>
        \\[
        \\langle D_1(f, \\phi) \\rangle_{T} \\to \\int_{-\\infty}^{\\infty} \\phi(x) W_{\\text{SO}(\\text{even})}(x)\\,dx
        \\]
        <p>as \\(T \\to \\infty\\), where \\(W_{\\text{SO}(\\text{even})}(x) = 1 + \\tfrac{1}{2}\\delta(x)\\) is the 1-level density of \\(\\text{SO}(\\text{even})\\) random matrices. This is consistent with the sign of the root number.</p>
    </div>
</div>

<h3>Why This Matters for Arithmetic</h3>

<p>The random matrix universality conjecture, if true, would imply:</p>
<ul>
    <li>The Hardy-Littlewood conjecture for prime \\(k\\)-tuples (via pair correlation of zeta zeros)</li>
    <li>Sharp bounds on the number of rank 0 vs rank 2 elliptic curves in families (via 1-level density)</li>
    <li>Distribution of central values \\(L(\\tfrac{1}{2}, \\chi_d)\\) for quadratic characters \\(\\chi_d\\) (via moments of L-functions)</li>
</ul>

<h3>The Explicit Formula Perspective</h3>

<p>The explicit formula \\(\\psi(x) = x - \\sum_\\rho x^\\rho/\\rho - \\ldots\\) shows that prime fluctuations are controlled by zeta zeros. The spacing statistics of zeros determine how these oscillations reinforce or cancel:</p>
<ul>
    <li><strong>If zeros were clustered (small gaps):</strong> Many \\(x^\\rho\\) terms with similar \\(\\gamma\\) would reinforce, creating sharp oscillations in \\(\\psi(x)\\).</li>
    <li><strong>GUE statistics:</strong> Level repulsion means zeros are spread out, so the oscillations tend to cancel, giving a smoother \\(\\psi(x)\\) — consistent with the PNT error term.</li>
</ul>

<div class="env-block remark">
    <div class="env-title">Open Problems</div>
    <div class="env-body">
        <p>The central open problems in this area include:
        <ul>
            <li>Proving Montgomery's pair correlation conjecture for the full range \\(\\alpha > 0\\) (currently known only for \\(0 \\le \\alpha \\le 1\\)).</li>
            <li>Extending Katz-Sarnak from function fields (where RH is proved) to number fields.</li>
            <li>Proving the Density Hypothesis \\(N(\\sigma, T) \\ll T^{2(1-\\sigma)+\\varepsilon}\\) for all \\(\\sigma\\).</li>
            <li>Connecting GUE statistics to the Riemann Hypothesis: does GUE spacing force \\(\\beta = 1/2\\)?</li>
        </ul>
        </p>
    </div>
</div>
`,
            visualizations: [],
            exercises: [
                {
                    question: 'The 1-level density for \\(\\text{SO}(\\text{even})\\) is \\(W(x) = 1 + \\frac{1}{2}\\delta(x)\\). How does the \\(\\delta(x)\\) term affect the expected number of zeros at the central point \\(s = \\frac{1}{2}\\) for an individual L-function?',
                    hint: 'The \\(\\delta(x)\\) term in the 1-level density corresponds to an excess of zeros at \\(\\gamma = 0\\), i.e., at \\(s = \\frac{1}{2}\\) itself. Think about what a zero at the central point means for an L-function (its order of vanishing).',
                    solution: 'The \\(\\frac{1}{2}\\delta(x)\\) term indicates that, on average, L-functions in an SO(even) family have an excess of \\(\\frac{1}{2}\\) zeros at the central point compared to random. For a single L-function, a zero at \\(s = \\frac{1}{2}\\) means the L-function vanishes there (analytic rank \\(\\ge 1\\)). For elliptic curve L-functions, the Birch-Swinnerton-Dyer conjecture predicts that this corresponds to an elliptic curve of rank \\(\\ge 1\\). The \\(\\frac{1}{2}\\) is an average: roughly half the family members have a zero at the central point, consistent with BSD predictions for rank distribution.',
                },
                {
                    question: 'Let \\(\\gamma_1 < \\gamma_2 < \\cdots\\) be the imaginary parts of zeta zeros. The normalized spacing is \\(s_n = (\\gamma_{n+1} - \\gamma_n)\\frac{\\log \\gamma_n}{2\\pi}\\). Using the data \\(\\gamma_1 \\approx 14.135\\), \\(\\gamma_2 \\approx 18.210\\), compute \\(s_1\\) and compare it to the Wigner surmise value at that point.',
                    hint: 'Compute the gap \\(\\gamma_2 - \\gamma_1\\), then multiply by \\(\\log(\\gamma_1)/(2\\pi)\\). The Wigner surmise \\(p(s) = (\\pi/2)s e^{-\\pi s^2/4}\\) has its mode at \\(s = \\sqrt{2/\\pi} \\approx 0.798\\).',
                    solution: 'Gap: \\(\\gamma_2 - \\gamma_1 = 18.210 - 14.135 = 4.075\\). Normalization: \\(\\log(14.135)/(2\\pi) = 2.648/6.283 \\approx 0.4213\\). Normalized spacing: \\(s_1 = 4.075 \\times 0.4213 \\approx 1.717\\). The Wigner surmise at \\(s = 1.717\\) is \\(p(1.717) = (\\pi/2)(1.717)e^{-\\pi(1.717)^2/4} \\approx 2.697 \\times e^{-2.315} \\approx 2.697 \\times 0.099 \\approx 0.267\\). So the first gap is somewhat larger than the mode \\(s \\approx 0.8\\), consistent with significant variability in individual spacings.'
                }
            ]
        }
    ]
});
