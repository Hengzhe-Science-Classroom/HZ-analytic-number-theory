// ================================================================
// Chapter 16 — Zeros of L-Functions
// ================================================================
window.CHAPTERS = window.CHAPTERS || [];
window.CHAPTERS.push({
    id: 'ch16',
    number: 16,
    title: 'Zeros of L-Functions',
    subtitle: 'The fine structure of zero distribution',
    sections: [
        // ================================================================
        // SECTION 1: Motivation
        // ================================================================
        {
            id: 'sec-motivation',
            title: 'Why Zeros Matter',
            content: `
<h2>Why Zeros Matter</h2>

<div class="env-block intuition">
    <div class="env-title">The Central Question</div>
    <div class="env-body">
        <p>We have seen how the Prime Number Theorem follows from the absence of zeta zeros on the line \\(\\operatorname{Re}(s) = 1\\). But the PNT is only the beginning. The <em>quality</em> of the prime counting approximation \\(\\pi(x) \\sim \\operatorname{Li}(x)\\) depends on how far to the left the zeros can lie. The Riemann Hypothesis asserts they all sit on \\(\\operatorname{Re}(s) = \\tfrac{1}{2}\\), which would give the best possible error term \\(O(x^{1/2}\\log x)\\).</p>
    </div>
</div>

<p>The explicit formula (Chapter 8) expresses \\(\\psi(x)\\) as a sum over zeros:</p>

\\[
\\psi(x) = x - \\sum_{\\rho} \\frac{x^\\rho}{\\rho} - \\log(2\\pi) - \\tfrac{1}{2}\\log(1 - x^{-2}).
\\]

<p>Each zero \\(\\rho = \\beta + i\\gamma\\) contributes a wave of magnitude \\(\\sim x^\\beta / |\\rho|\\). The closer \\(\\beta\\) is to 1, the larger the oscillation and the worse the error. This chapter studies the <strong>fine structure</strong> of the zero distribution: how many zeros lie in a given region, how they are spaced, and what universal laws they obey.</p>

<h3>Three Levels of Understanding</h3>

<ol>
    <li><strong>Counting:</strong> How many zeros have imaginary part up to \\(T\\)? The Riemann-von Mangoldt formula gives \\(N(T) \\sim \\frac{T}{2\\pi}\\log\\frac{T}{2\\pi e}\\).</li>
    <li><strong>Density:</strong> How many zeros can have \\(\\operatorname{Re}(s) \\geq \\sigma\\) for \\(\\sigma > \\tfrac{1}{2}\\)? Zero-density estimates bound these counts and serve as partial substitutes for RH.</li>
    <li><strong>Local spacing:</strong> On the finest scale, how are consecutive zeros distributed along the critical line? Montgomery's pair correlation conjecture and random matrix theory reveal stunning universality.</li>
</ol>

<div class="env-block remark">
    <div class="env-title">Historical Arc</div>
    <div class="env-body">
        <p>Riemann (1859) introduced both the zero-counting formula and the hypothesis about their location. Ingham (1940) proved the first strong zero-density estimates. Montgomery (1973) discovered the pair correlation function matches that of eigenvalues of random unitary matrices, and Dyson immediately recognized the GUE connection. This circle of ideas now extends to all automorphic L-functions.</p>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-nt-staircase"></div>
`,
            visualizations: [
                {
                    id: 'viz-nt-staircase',
                    title: 'N(T): The Zero-Counting Staircase',
                    description: 'The staircase function N(T) counts zeros of \\(\\zeta(s)\\) with imaginary part in \\((0, T]\\). Each step marks a zero. The smooth curve is the Riemann-von Mangoldt approximation \\(\\frac{T}{2\\pi}\\log\\frac{T}{2\\pi e}\\). Drag the slider to explore higher zeros.',
                    setup: function(body, controls) {
                        // First 100 nontrivial zeros of zeta (imaginary parts, positive)
                        var zetaZeros = [14.134725,21.022040,25.010858,30.424876,32.935062,37.586178,40.918719,43.327073,48.005151,49.773832,52.970321,56.446248,59.347044,60.831779,65.112544,67.079811,69.546402,72.067158,75.704691,77.144840,79.337375,82.910381,84.735493,87.425275,88.809111,92.491899,94.651344,95.870634,98.831194,101.317851,103.725538,105.446623,107.168611,111.029535,111.874659,114.320221,116.226680,118.790783,121.370125,122.946829,124.256819,127.516684,129.578704,131.087689,133.497737,134.756510,138.116042,139.736209,141.123707,143.111846,146.000982,147.422765,150.053521,150.925258,153.024694,156.112909,157.597592,158.849989,161.188964,163.030709,165.537069,167.184440,169.094515,169.911977,173.411537,174.754191,176.441434,178.377407,179.916484,182.207078,184.874467,185.598783,187.228922,189.416158,192.026566,193.079726,195.265397,196.876482,198.015310,201.264752,202.493595,204.189671,205.394697,207.906259,209.576509,211.690862,213.347919,214.547044,216.169538,219.067596,220.714919,221.430703,224.007000,224.983324,227.421444,229.337413,231.250189,231.987235,233.693404,236.524230];

                        var viz = new VizEngine(body, {
                            width: 560, height: 380,
                            originX: 60, originY: 340, scale: 1
                        });

                        var Tmax = 100;
                        VizEngine.createSlider(controls, 'T max', 30, 240, Tmax, 10, function(v) {
                            Tmax = v;
                            draw();
                        });

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var w = viz.width, h = viz.height;
                            var padL = 60, padR = 20, padT = 30, padB = 40;
                            var plotW = w - padL - padR;
                            var plotH = h - padT - padB;

                            // Axes
                            ctx.strokeStyle = viz.colors.axis; ctx.lineWidth = 1;
                            ctx.beginPath(); ctx.moveTo(padL, padT); ctx.lineTo(padL, h - padB); ctx.lineTo(w - padR, h - padB); ctx.stroke();

                            // Scales
                            var xScale = plotW / Tmax;
                            var nMax = 0;
                            for (var i = 0; i < zetaZeros.length; i++) {
                                if (zetaZeros[i] <= Tmax) nMax = i + 1;
                            }
                            var rvmMax = Tmax / (2 * Math.PI) * Math.log(Tmax / (2 * Math.PI * Math.E));
                            var yMax = Math.max(nMax, rvmMax) * 1.1;
                            var yScale = plotH / yMax;

                            // Grid lines
                            ctx.strokeStyle = viz.colors.grid; ctx.lineWidth = 0.5;
                            ctx.fillStyle = viz.colors.text; ctx.font = '10px -apple-system,sans-serif';
                            ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
                            var yStep = Math.max(1, Math.ceil(yMax / 8));
                            for (var y = 0; y <= yMax; y += yStep) {
                                var sy = h - padB - y * yScale;
                                ctx.beginPath(); ctx.moveTo(padL, sy); ctx.lineTo(w - padR, sy); ctx.stroke();
                                ctx.fillText(y.toString(), padL - 5, sy);
                            }
                            ctx.textAlign = 'center'; ctx.textBaseline = 'top';
                            var xStep = Math.max(10, Math.ceil(Tmax / 8 / 10) * 10);
                            for (var x = 0; x <= Tmax; x += xStep) {
                                var sx = padL + x * xScale;
                                ctx.beginPath(); ctx.moveTo(sx, h - padB); ctx.lineTo(sx, padT); ctx.stroke();
                                ctx.fillText(x.toString(), sx, h - padB + 4);
                            }

                            // Riemann-von Mangoldt smooth curve
                            ctx.strokeStyle = viz.colors.orange; ctx.lineWidth = 2;
                            ctx.beginPath();
                            var started = false;
                            for (var t = 5; t <= Tmax; t += 0.5) {
                                var nRvm = t / (2 * Math.PI) * Math.log(t / (2 * Math.PI * Math.E));
                                var px = padL + t * xScale;
                                var py = h - padB - nRvm * yScale;
                                if (!started) { ctx.moveTo(px, py); started = true; } else ctx.lineTo(px, py);
                            }
                            ctx.stroke();

                            // Staircase N(T)
                            ctx.strokeStyle = viz.colors.blue; ctx.lineWidth = 2;
                            ctx.beginPath();
                            ctx.moveTo(padL, h - padB);
                            var count = 0;
                            for (var j = 0; j < zetaZeros.length; j++) {
                                if (zetaZeros[j] > Tmax) break;
                                var sx1 = padL + zetaZeros[j] * xScale;
                                var sy1 = h - padB - count * yScale;
                                ctx.lineTo(sx1, sy1);
                                count++;
                                var sy2 = h - padB - count * yScale;
                                ctx.lineTo(sx1, sy2);
                            }
                            ctx.lineTo(padL + Tmax * xScale, h - padB - count * yScale);
                            ctx.stroke();

                            // Labels
                            viz.screenText('T', w / 2, h - 5, viz.colors.text, 12);
                            viz.screenText('N(T)', 15, h / 2, viz.colors.text, 12);
                            viz.screenText('N(T): Zero-Counting Staircase', w / 2, 15, viz.colors.white, 14);

                            // Legend
                            var legY = padT + 10;
                            ctx.fillStyle = viz.colors.blue;
                            ctx.fillRect(padL + 10, legY, 20, 3);
                            ctx.fillStyle = viz.colors.blue; ctx.font = '11px -apple-system,sans-serif';
                            ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
                            ctx.fillText('N(T) exact', padL + 35, legY + 2);

                            ctx.fillStyle = viz.colors.orange;
                            ctx.fillRect(padL + 10, legY + 18, 20, 3);
                            ctx.fillStyle = viz.colors.orange;
                            ctx.fillText('(T/2\u03C0) log(T/2\u03C0e)', padL + 35, legY + 20);

                            viz.screenText(count + ' zeros up to T = ' + Tmax.toFixed(0), w / 2, h - padB - plotH - 2, viz.colors.teal, 11);
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'The first nontrivial zero of \\(\\zeta(s)\\) has imaginary part \\(\\gamma_1 \\approx 14.135\\). Compute \\(N(15)\\) using the Riemann-von Mangoldt formula and compare with the exact count.',
                    hint: 'The formula gives \\(N(T) \\approx \\frac{T}{2\\pi}\\log\\frac{T}{2\\pi e} + \\frac{7}{8}\\). Plug in \\(T = 15\\).',
                    solution: 'We have \\(N(15) \\approx \\frac{15}{2\\pi}\\log\\frac{15}{2\\pi e} \\approx 2.39 \\times 0.167 \\approx 0.4\\). Adding the correction \\(7/8\\) gives about \\(1.3\\). The exact count is \\(N(15) = 1\\) (only \\(\\gamma_1 \\approx 14.135\\) is below 15). The formula is asymptotic and only becomes accurate for larger \\(T\\).'
                }
            ]
        },

        // ================================================================
        // SECTION 2: The Riemann-von Mangoldt Formula
        // ================================================================
        {
            id: 'sec-rvmf',
            title: 'The N(T) Formula',
            content: `
<h2>The Riemann-von Mangoldt Formula</h2>

<div class="env-block intuition">
    <div class="env-title">Counting Zeros via Argument Principle</div>
    <div class="env-body">
        <p>To count the zeros of \\(\\zeta(s)\\) inside a rectangle, we apply the argument principle: the number of zeros minus poles equals \\(\\frac{1}{2\\pi i}\\) times the change in \\(\\log\\zeta(s)\\) along the boundary. By choosing a rectangle with vertices at \\(2\\), \\(2+iT\\), \\(-1+iT\\), \\(-1\\), and using the functional equation, we can evaluate each segment.</p>
    </div>
</div>

<div class="env-block definition">
    <div class="env-title">Definition</div>
    <div class="env-body">
        <p>Let \\(N(T)\\) denote the number of zeros \\(\\rho = \\beta + i\\gamma\\) of \\(\\zeta(s)\\) with \\(0 < \\gamma \\leq T\\), counted with multiplicity.</p>
    </div>
</div>

<div class="env-block theorem">
    <div class="env-title">Theorem 16.1 (Riemann-von Mangoldt Formula)</div>
    <div class="env-body">
        <p>For \\(T \\geq 2\\) not equal to any \\(\\gamma\\),</p>
        \\[
        N(T) = \\frac{T}{2\\pi}\\log\\frac{T}{2\\pi} - \\frac{T}{2\\pi} + \\frac{7}{8} + S(T) + O(1/T),
        \\]
        <p>where \\(S(T) = \\frac{1}{\\pi}\\arg\\zeta(\\tfrac{1}{2} + iT)\\) is defined by continuous variation along the line from \\(2+iT\\) to \\(\\tfrac{1}{2}+iT\\).</p>
    </div>
</div>

<div class="env-block proof">
    <div class="env-title">Proof Sketch</div>
    <div class="env-body">
        <p>Apply the argument principle to \\(\\xi(s) = \\frac{1}{2}s(s-1)\\pi^{-s/2}\\Gamma(s/2)\\zeta(s)\\) on the rectangle \\(\\{s : -1 \\leq \\sigma \\leq 2,\\, 0 \\leq t \\leq T\\}\\). Since \\(\\xi\\) is entire and its zeros are exactly the nontrivial zeros of \\(\\zeta\\):</p>
        \\[
        N(T) = \\frac{1}{2\\pi}\\Delta_{\\partial R}\\arg\\xi(s).
        \\]
        <p>The contribution from \\(\\Gamma(s/2)\\) gives the main term via Stirling's formula \\(\\arg\\Gamma(\\sigma + iT/2) \\sim \\frac{T}{2}\\log\\frac{T}{2} - \\frac{T}{2}\\), while the \\(\\pi^{-s/2}\\) and polynomial factors contribute lower-order terms. The remainder is \\(S(T)\\).</p>
    </div>
    <div class="qed">&#x25FC;</div>
</div>

<h3>Properties of S(T)</h3>

<p>The function \\(S(T)\\) measures the deviation of the actual zero count from the smooth approximation. Key facts:</p>

<div class="env-block theorem">
    <div class="env-title">Theorem 16.2 (Bounds on S(T))</div>
    <div class="env-body">
        <ol>
            <li>\\(S(T) = O(\\log T)\\) unconditionally (Backlund, 1918).</li>
            <li>\\(\\int_0^T S(t)\\,dt = O(\\log T)\\), so \\(S(T)\\) averages to zero.</li>
            <li>On RH, \\(S(T) = O(\\log T / \\log\\log T)\\) (Littlewood, 1924).</li>
        </ol>
    </div>
</div>

<div class="env-block example">
    <div class="env-title">Example: Computing N(100)</div>
    <div class="env-body">
        <p>The smooth part gives \\(\\frac{100}{2\\pi}\\log\\frac{100}{2\\pi} - \\frac{100}{2\\pi} + \\frac{7}{8} \\approx 15.92 \\cdot 2.766 - 15.92 + 0.875 \\approx 29.0\\). The actual count is \\(N(100) = 29\\). The agreement is excellent because \\(S(100)\\) is very small.</p>
    </div>
</div>

<div class="env-block remark">
    <div class="env-title">Generalization to L-functions</div>
    <div class="env-body">
        <p>For a Dirichlet \\(L\\)-function \\(L(s, \\chi)\\) with conductor \\(q\\), the analogous formula is:</p>
        \\[
        N(T, \\chi) = \\frac{T}{\\pi}\\log\\frac{qT}{2\\pi e} + O(\\log qT).
        \\]
        <p>The conductor \\(q\\) acts as an "analytic weight" that increases the zero density.</p>
    </div>
</div>
`,
            visualizations: [],
            exercises: [
                {
                    question: 'Verify that the Riemann-von Mangoldt formula predicts \\(N(50) \\approx 10\\), while the exact count from the first 100 zeros table gives \\(N(50) = 10\\).',
                    hint: 'Compute \\(\\frac{50}{2\\pi}\\log\\frac{50}{2\\pi} - \\frac{50}{2\\pi} + \\frac{7}{8}\\).',
                    solution: 'We have \\(\\frac{50}{2\\pi} \\approx 7.958\\) and \\(\\log\\frac{50}{2\\pi} \\approx \\log 7.958 \\approx 2.074\\). So the main terms give \\(7.958 \\times 2.074 - 7.958 + 0.875 \\approx 16.507 - 7.958 + 0.875 \\approx 9.42\\). Rounding to the nearest integer gives 10 (since \\(S(T)\\) contributes a small correction), matching the exact count: the 10th zero is at \\(\\gamma_{10} \\approx 49.77\\).'
                }
            ]
        },

        // ================================================================
        // SECTION 3: Zero-Density Estimates
        // ================================================================
        {
            id: 'sec-zero-density',
            title: 'Zero-Density Estimates',
            content: `
<h2>Zero-Density Estimates</h2>

<div class="env-block intuition">
    <div class="env-title">Measuring Failure of RH</div>
    <div class="env-body">
        <p>If the Riemann Hypothesis is true, there are no zeros with \\(\\operatorname{Re}(s) > \\tfrac{1}{2}\\). But even without RH, we can show that zeros far from the critical line are <em>rare</em>. Zero-density estimates quantify this rarity and often substitute for RH in applications.</p>
    </div>
</div>

<div class="env-block definition">
    <div class="env-title">Definition</div>
    <div class="env-body">
        <p>For \\(\\sigma > \\tfrac{1}{2}\\), define</p>
        \\[
        N(\\sigma, T) = \\#\\{\\rho = \\beta + i\\gamma : \\zeta(\\rho) = 0,\\; \\beta \\geq \\sigma,\\; 0 < \\gamma \\leq T\\}.
        \\]
        <p>This counts how many zeros have real part at least \\(\\sigma\\).</p>
    </div>
</div>

<div class="env-block theorem">
    <div class="env-title">Theorem 16.3 (Ingham's Zero-Density Estimate, 1940)</div>
    <div class="env-body">
        <p>For \\(\\tfrac{1}{2} \\leq \\sigma \\leq 1\\),</p>
        \\[
        N(\\sigma, T) \\ll T^{\\frac{3(1-\\sigma)}{2-\\sigma}} (\\log T)^5.
        \\]
        <p>In particular, at \\(\\sigma = \\tfrac{3}{4}\\), this gives \\(N(\\tfrac{3}{4}, T) \\ll T^{3/5}(\\log T)^5\\), much smaller than the total \\(N(T) \\sim \\frac{T}{2\\pi}\\log T\\).</p>
    </div>
</div>

<p>The key idea behind zero-density estimates is a <strong>mean-value theorem</strong> for Dirichlet polynomials. If \\(\\sum a_n n^{-s}\\) approximates \\(\\zeta(s)\\) or \\(\\log\\zeta(s)\\) in the critical strip, then:</p>

\\[
\\int_0^T \\left|\\sum_{n \\leq N} a_n n^{-\\sigma - it}\\right|^2 dt \\approx T\\sum_{n \\leq N} |a_n|^2 n^{-2\\sigma}.
\\]

<p>This "large sieve" type inequality converts zero detection into a second-moment problem.</p>

<h3>Improvements and the State of the Art</h3>

<div class="env-block theorem">
    <div class="env-title">Theorem 16.4 (Huxley-Jutila Density Estimate)</div>
    <div class="env-body">
        <p>For \\(\\tfrac{1}{2} \\leq \\sigma \\leq 1\\),</p>
        \\[
        N(\\sigma, T) \\ll T^{\\frac{12(1-\\sigma)}{5}}(\\log T)^C.
        \\]
        <p>This is stronger than Ingham's bound for \\(\\sigma\\) near 1 and is used in the Bombieri-Vinogradov theorem.</p>
    </div>
</div>

<div class="env-block remark">
    <div class="env-title">Application: Primes in Arithmetic Progressions</div>
    <div class="env-body">
        <p>Zero-density estimates for \\(L(s,\\chi)\\) control the error in \\(\\pi(x;q,a)\\). Even without proving that individual \\(L\\)-functions satisfy RH, strong enough density estimates give results "on average over \\(q\\)" that are as good as what RH would provide (this is the content of the Bombieri-Vinogradov theorem, Chapter 13).</p>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-zero-spacing"></div>
`,
            visualizations: [
                {
                    id: 'viz-zero-spacing',
                    title: 'Zero Spacing Distribution',
                    description: 'Histogram of normalized spacings \\(\\delta_n = (\\gamma_{n+1} - \\gamma_n) \\cdot \\frac{\\log(\\gamma_n/2\\pi)}{2\\pi}\\) between consecutive zeros, compared with the GUE prediction (solid curve). The zeros repel each other: small spacings are rare.',
                    setup: function(body, controls) {
                        var zetaZeros = [14.134725,21.022040,25.010858,30.424876,32.935062,37.586178,40.918719,43.327073,48.005151,49.773832,52.970321,56.446248,59.347044,60.831779,65.112544,67.079811,69.546402,72.067158,75.704691,77.144840,79.337375,82.910381,84.735493,87.425275,88.809111,92.491899,94.651344,95.870634,98.831194,101.317851,103.725538,105.446623,107.168611,111.029535,111.874659,114.320221,116.226680,118.790783,121.370125,122.946829,124.256819,127.516684,129.578704,131.087689,133.497737,134.756510,138.116042,139.736209,141.123707,143.111846,146.000982,147.422765,150.053521,150.925258,153.024694,156.112909,157.597592,158.849989,161.188964,163.030709,165.537069,167.184440,169.094515,169.911977,173.411537,174.754191,176.441434,178.377407,179.916484,182.207078,184.874467,185.598783,187.228922,189.416158,192.026566,193.079726,195.265397,196.876482,198.015310,201.264752,202.493595,204.189671,205.394697,207.906259,209.576509,211.690862,213.347919,214.547044,216.169538,219.067596,220.714919,221.430703,224.007000,224.983324,227.421444,229.337413,231.250189,231.987235,233.693404,236.524230];

                        var viz = new VizEngine(body, {
                            width: 560, height: 380,
                            originX: 60, originY: 340, scale: 1
                        });

                        // Compute normalized spacings
                        var spacings = [];
                        for (var i = 0; i < zetaZeros.length - 1; i++) {
                            var gap = zetaZeros[i + 1] - zetaZeros[i];
                            var avgDensity = Math.log(zetaZeros[i] / (2 * Math.PI)) / (2 * Math.PI);
                            spacings.push(gap * avgDensity);
                        }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var w = viz.width, h = viz.height;
                            var padL = 60, padR = 20, padT = 30, padB = 40;
                            var plotW = w - padL - padR;
                            var plotH = h - padT - padB;

                            // Histogram
                            var nBins = 15;
                            var maxS = 3.0;
                            var binW = maxS / nBins;
                            var bins = new Array(nBins).fill(0);
                            for (var j = 0; j < spacings.length; j++) {
                                var bin = Math.floor(spacings[j] / binW);
                                if (bin >= 0 && bin < nBins) bins[bin]++;
                            }
                            // Normalize to density
                            var total = spacings.length;
                            for (var k = 0; k < nBins; k++) bins[k] /= (total * binW);

                            var yMax = 0;
                            for (var k = 0; k < nBins; k++) yMax = Math.max(yMax, bins[k]);
                            // GUE density peak
                            yMax = Math.max(yMax, 1.1);
                            yMax *= 1.15;

                            var xScale = plotW / maxS;
                            var yScale = plotH / yMax;

                            // Axes
                            ctx.strokeStyle = viz.colors.axis; ctx.lineWidth = 1;
                            ctx.beginPath(); ctx.moveTo(padL, padT); ctx.lineTo(padL, h - padB); ctx.lineTo(w - padR, h - padB); ctx.stroke();

                            // Y axis labels
                            ctx.fillStyle = viz.colors.text; ctx.font = '10px -apple-system,sans-serif';
                            ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
                            for (var yl = 0; yl <= yMax; yl += 0.2) {
                                var sy = h - padB - yl * yScale;
                                ctx.strokeStyle = viz.colors.grid; ctx.lineWidth = 0.5;
                                ctx.beginPath(); ctx.moveTo(padL, sy); ctx.lineTo(w - padR, sy); ctx.stroke();
                                ctx.fillStyle = viz.colors.text;
                                ctx.fillText(yl.toFixed(1), padL - 5, sy);
                            }
                            // X axis labels
                            ctx.textAlign = 'center'; ctx.textBaseline = 'top';
                            for (var xl = 0; xl <= maxS; xl += 0.5) {
                                var sx = padL + xl * xScale;
                                ctx.fillText(xl.toFixed(1), sx, h - padB + 4);
                            }

                            // Draw histogram bars
                            for (var b = 0; b < nBins; b++) {
                                var bx = padL + b * binW * xScale;
                                var bw = binW * xScale;
                                var bh = bins[b] * yScale;
                                ctx.fillStyle = viz.colors.blue + '66';
                                ctx.fillRect(bx, h - padB - bh, bw, bh);
                                ctx.strokeStyle = viz.colors.blue;
                                ctx.lineWidth = 1;
                                ctx.strokeRect(bx, h - padB - bh, bw, bh);
                            }

                            // GUE spacing distribution (Wigner surmise approximation)
                            // p(s) = (32/pi^2) s^2 exp(-4s^2/pi)
                            ctx.strokeStyle = viz.colors.orange; ctx.lineWidth = 2.5;
                            ctx.beginPath();
                            var gueSt = false;
                            for (var gs = 0; gs <= maxS; gs += 0.01) {
                                var pg = (32 / (Math.PI * Math.PI)) * gs * gs * Math.exp(-4 * gs * gs / Math.PI);
                                var gx = padL + gs * xScale;
                                var gy = h - padB - pg * yScale;
                                if (!gueSt) { ctx.moveTo(gx, gy); gueSt = true; } else ctx.lineTo(gx, gy);
                            }
                            ctx.stroke();

                            // Poisson for comparison
                            ctx.strokeStyle = viz.colors.red + '88'; ctx.lineWidth = 1.5;
                            ctx.setLineDash([5, 5]);
                            ctx.beginPath();
                            var poisSt = false;
                            for (var ps = 0; ps <= maxS; ps += 0.01) {
                                var pp = Math.exp(-ps);
                                var px = padL + ps * xScale;
                                var py = h - padB - pp * yScale;
                                if (!poisSt) { ctx.moveTo(px, py); poisSt = true; } else ctx.lineTo(px, py);
                            }
                            ctx.stroke();
                            ctx.setLineDash([]);

                            // Title and labels
                            viz.screenText('Normalized Zero Spacing Distribution', w / 2, 15, viz.colors.white, 14);
                            viz.screenText('Spacing s', w / 2, h - 5, viz.colors.text, 12);
                            viz.screenText('Density', 15, h / 2, viz.colors.text, 12);

                            // Legend
                            var ly = padT + 10;
                            ctx.fillStyle = viz.colors.blue + '66';
                            ctx.fillRect(w - 180, ly, 14, 14);
                            ctx.fillStyle = viz.colors.text; ctx.font = '11px -apple-system,sans-serif'; ctx.textAlign = 'left';
                            ctx.fillText('Zeta zeros', w - 162, ly + 11);

                            ctx.strokeStyle = viz.colors.orange; ctx.lineWidth = 2;
                            ctx.beginPath(); ctx.moveTo(w - 180, ly + 26); ctx.lineTo(w - 166, ly + 26); ctx.stroke();
                            ctx.fillStyle = viz.colors.text;
                            ctx.fillText('GUE (Wigner)', w - 162, ly + 30);

                            ctx.strokeStyle = viz.colors.red + '88'; ctx.lineWidth = 1.5; ctx.setLineDash([5, 5]);
                            ctx.beginPath(); ctx.moveTo(w - 180, ly + 44); ctx.lineTo(w - 166, ly + 44); ctx.stroke();
                            ctx.setLineDash([]);
                            ctx.fillStyle = viz.colors.text;
                            ctx.fillText('Poisson', w - 162, ly + 48);
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Ingham\'s bound gives \\(N(\\sigma, T) \\ll T^{3(1-\\sigma)/(2-\\sigma)}\\). Show that at \\(\\sigma = 1\\), this gives \\(N(1,T) \\ll 1\\), consistent with \\(\\zeta(s) \\neq 0\\) for \\(\\operatorname{Re}(s) = 1\\).',
                    hint: 'Simply plug \\(\\sigma = 1\\) into the exponent \\(\\frac{3(1-\\sigma)}{2-\\sigma}\\).',
                    solution: 'At \\(\\sigma = 1\\), the exponent becomes \\(\\frac{3(1-1)}{2-1} = \\frac{0}{1} = 0\\). So \\(N(1,T) \\ll T^0(\\log T)^5 = (\\log T)^5 / T^0\\), which is \\(O((\\log T)^5)\\). Actually the bound gives \\(T^0 = 1\\) times log powers. Since \\(\\zeta(1+it) \\neq 0\\) for all \\(t\\) (de la Vallee Poussin), we know \\(N(1,T) = 0\\) exactly, consistent with the bound.'
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

<div class="env-block intuition">
    <div class="env-title">What Would Be Optimal?</div>
    <div class="env-body">
        <p>On the Riemann Hypothesis, \\(N(\\sigma, T) = 0\\) for all \\(\\sigma > \\tfrac{1}{2}\\). The Density Hypothesis is a weaker conjecture that asks for a bound nearly as strong as what RH implies for the <em>counting</em> of off-line zeros, without requiring their complete absence.</p>
    </div>
</div>

<div class="env-block definition">
    <div class="env-title">Definition (Density Hypothesis)</div>
    <div class="env-body">
        <p>The <strong>Density Hypothesis</strong> (DH) asserts that for every \\(\\varepsilon > 0\\),</p>
        \\[
        N(\\sigma, T) \\ll T^{2(1-\\sigma) + \\varepsilon}.
        \\]
    </div>
</div>

<p>The exponent \\(2(1-\\sigma)\\) is the "correct" exponent suggested by the following heuristic: the total number of zeros up to height \\(T\\) is \\(\\sim T\\log T\\), and the zeros should be distributed so that the fraction with \\(\\beta \\geq \\sigma\\) decreases like \\(T^{-(2\\sigma - 1)}\\).</p>

<h3>Known Results Toward DH</h3>

<div class="env-block theorem">
    <div class="env-title">Theorem 16.5 (Status of the Density Hypothesis)</div>
    <div class="env-body">
        <p>The Density Hypothesis is known in the following ranges:</p>
        <ol>
            <li>DH holds for \\(\\sigma \\geq \\tfrac{3}{4}\\) (Ingham, 1940).</li>
            <li>For \\(\\sigma\\) near \\(\\tfrac{1}{2}\\), the best results give exponents \\(\\frac{12}{5}(1-\\sigma)\\) (Huxley) or improvements via exponential sum techniques.</li>
            <li>Assuming the Lindel&ouml;f Hypothesis, DH follows in full.</li>
        </ol>
    </div>
</div>

<h3>Consequences of the Density Hypothesis</h3>

<p>The DH has powerful consequences that go beyond what current unconditional results can reach:</p>

<div class="env-block theorem">
    <div class="env-title">Theorem 16.6</div>
    <div class="env-body">
        <p>The Density Hypothesis implies:</p>
        <ol>
            <li>The Lindel&ouml;f Hypothesis: \\(\\zeta(\\tfrac{1}{2} + it) \\ll t^\\varepsilon\\).</li>
            <li>For every \\(\\theta > \\tfrac{1}{2}\\), the prime-counting error satisfies \\(\\pi(x) - \\operatorname{Li}(x) \\ll x^\\theta\\).</li>
            <li>Primes in short intervals: \\([x, x + x^{1/2+\\varepsilon}]\\) contains primes for all large \\(x\\).</li>
        </ol>
    </div>
</div>

<div class="env-block remark">
    <div class="env-title">The Hierarchy of Hypotheses</div>
    <div class="env-body">
        <p>The logical dependencies among the major conjectures are:</p>
        \\[
        \\text{RH} \\Longrightarrow \\text{Lindel\\\"of Hypothesis} \\Longrightarrow \\text{Density Hypothesis}.
        \\]
        <p>The reverse implications are not known. The Density Hypothesis is strictly weaker than RH but already implies most of the consequences that matter for prime distribution.</p>
    </div>
</div>
`,
            visualizations: [],
            exercises: [
                {
                    question: 'Compare the exponents in Ingham\'s bound \\(\\frac{3(1-\\sigma)}{2-\\sigma}\\) and the Density Hypothesis bound \\(2(1-\\sigma)\\) at \\(\\sigma = 3/4\\). Which is stronger?',
                    hint: 'Plug \\(\\sigma = 3/4\\) into both expressions.',
                    solution: 'Ingham: \\(\\frac{3 \\cdot 1/4}{2 - 3/4} = \\frac{3/4}{5/4} = \\frac{3}{5} = 0.6\\). DH: \\(2 \\cdot 1/4 = 0.5\\). The DH exponent 0.5 is smaller, so DH is stronger. But Ingham\'s bound is unconditional, while DH remains a conjecture for \\(\\sigma < 3/4\\).'
                }
            ]
        },

        // ================================================================
        // SECTION 5: Pair Correlation
        // ================================================================
        {
            id: 'sec-pair-correlation',
            title: 'Montgomery\'s Pair Correlation',
            content: `
<h2>Montgomery's Pair Correlation Conjecture</h2>

<div class="env-block intuition">
    <div class="env-title">Listening to the Zeros</div>
    <div class="env-body">
        <p>The Riemann-von Mangoldt formula tells us the average spacing between consecutive zeros near height \\(T\\) is \\(\\frac{2\\pi}{\\log(T/2\\pi)}\\). But what about the <em>fluctuations</em> around this average? Do zeros clump, or do they repel? Montgomery (1973) discovered that they repel each other, and the repulsion pattern matches a universal law from random matrix theory.</p>
    </div>
</div>

<h3>The Pair Correlation Function</h3>

<div class="env-block definition">
    <div class="env-title">Definition</div>
    <div class="env-body">
        <p>Let \\(\\tilde{\\gamma}_n = \\gamma_n \\cdot \\frac{\\log(\\gamma_n/2\\pi)}{2\\pi}\\) denote the "unfolded" zeros (rescaled so the average spacing is 1). The <strong>pair correlation function</strong> \\(R_2(\\alpha)\\) is defined so that</p>
        \\[
        \\#\\{(m,n) : \\tilde{\\gamma}_m \\neq \\tilde{\\gamma}_n,\\; \\alpha \\leq \\tilde{\\gamma}_m - \\tilde{\\gamma}_n \\leq \\beta\\} \\sim N \\int_\\alpha^\\beta R_2(u)\\,du,
        \\]
        <p>where \\(N\\) is the number of zeros in the sample.</p>
    </div>
</div>

<div class="env-block theorem">
    <div class="env-title">Theorem 16.7 (Montgomery, 1973)</div>
    <div class="env-body">
        <p>Assume the Riemann Hypothesis. For the Fourier transform \\(F(\\alpha) = \\sum_{0 < \\gamma, \\gamma' \\leq T} T^{i\\alpha(\\gamma - \\gamma')} w(\\gamma - \\gamma')\\) (with a suitable weight \\(w\\)),</p>
        \\[
        F(\\alpha) \\sim \\begin{cases} T\\log T \\cdot |\\alpha| & \\text{if } |\\alpha| \\leq 1, \\\\ T\\log T & \\text{if } |\\alpha| \\geq 1. \\end{cases}
        \\]
        <p>Montgomery proved the case \\(|\\alpha| \\leq 1\\) and conjectured the case \\(|\\alpha| \\geq 1\\).</p>
    </div>
</div>

<div class="env-block theorem">
    <div name="env-title">Conjecture 16.8 (Montgomery Pair Correlation Conjecture)</div>
    <div class="env-body">
        <p>The pair correlation function of the unfolded zeros of \\(\\zeta(s)\\) is</p>
        \\[
        R_2(u) = 1 - \\left(\\frac{\\sin \\pi u}{\\pi u}\\right)^2.
        \\]
    </div>
</div>

<p>The key feature is that \\(R_2(0) = 0\\): zeros repel. For small \\(u\\), \\(R_2(u) \\approx \\frac{\\pi^2}{3} u^2\\), so the probability of two zeros being very close is proportional to the square of their distance. This quadratic repulsion is the hallmark of the <strong>GUE universality class</strong>.</p>

<h3>The Famous Tea</h3>

<div class="env-block remark">
    <div class="env-title">Historical Note: Montgomery Meets Dyson</div>
    <div class="env-body">
        <p>In 1973, during a tea at the Institute for Advanced Study, Montgomery mentioned his result to Freeman Dyson. Dyson immediately recognized the formula \\(1 - (\\sin\\pi u / \\pi u)^2\\) as the pair correlation function for eigenvalues of large random unitary matrices (the GUE ensemble). This chance encounter launched the field of "arithmetic quantum chaos" and the deep connection between number theory and random matrix theory.</p>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-random-matrix"></div>
`,
            visualizations: [
                {
                    id: 'viz-random-matrix',
                    title: 'Pair Correlation: Zeros vs. Random Matrices',
                    description: 'The blue histogram shows the pair correlation of the first 100 zeta zeros (unfolded). The orange curve is the GUE prediction \\(1 - (\\sin\\pi u / \\pi u)^2\\). The repulsion near \\(u = 0\\) is clearly visible: zeros avoid being too close together.',
                    setup: function(body, controls) {
                        var zetaZeros = [14.134725,21.022040,25.010858,30.424876,32.935062,37.586178,40.918719,43.327073,48.005151,49.773832,52.970321,56.446248,59.347044,60.831779,65.112544,67.079811,69.546402,72.067158,75.704691,77.144840,79.337375,82.910381,84.735493,87.425275,88.809111,92.491899,94.651344,95.870634,98.831194,101.317851,103.725538,105.446623,107.168611,111.029535,111.874659,114.320221,116.226680,118.790783,121.370125,122.946829,124.256819,127.516684,129.578704,131.087689,133.497737,134.756510,138.116042,139.736209,141.123707,143.111846,146.000982,147.422765,150.053521,150.925258,153.024694,156.112909,157.597592,158.849989,161.188964,163.030709,165.537069,167.184440,169.094515,169.911977,173.411537,174.754191,176.441434,178.377407,179.916484,182.207078,184.874467,185.598783,187.228922,189.416158,192.026566,193.079726,195.265397,196.876482,198.015310,201.264752,202.493595,204.189671,205.394697,207.906259,209.576509,211.690862,213.347919,214.547044,216.169538,219.067596,220.714919,221.430703,224.007000,224.983324,227.421444,229.337413,231.250189,231.987235,233.693404,236.524230];

                        var viz = new VizEngine(body, {
                            width: 560, height: 380,
                            originX: 60, originY: 340, scale: 1
                        });

                        // Unfold zeros
                        var unfolded = [];
                        for (var i = 0; i < zetaZeros.length; i++) {
                            var g = zetaZeros[i];
                            unfolded.push(g * Math.log(g / (2 * Math.PI)) / (2 * Math.PI));
                        }

                        // Compute pair differences
                        var diffs = [];
                        for (var i = 0; i < unfolded.length; i++) {
                            for (var j = i + 1; j < unfolded.length; j++) {
                                var d = Math.abs(unfolded[j] - unfolded[i]);
                                if (d < 4) diffs.push(d);
                            }
                        }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var w = viz.width, h = viz.height;
                            var padL = 60, padR = 20, padT = 30, padB = 40;
                            var plotW = w - padL - padR;
                            var plotH = h - padT - padB;

                            var maxU = 4.0;
                            var nBins = 20;
                            var binW = maxU / nBins;
                            var bins = new Array(nBins).fill(0);
                            for (var k = 0; k < diffs.length; k++) {
                                var bin = Math.floor(diffs[k] / binW);
                                if (bin >= 0 && bin < nBins) bins[bin]++;
                            }

                            // Normalize: density = count / (N * binW) where N = number of pairs
                            var N = unfolded.length;
                            for (var k = 0; k < nBins; k++) bins[k] /= (N * binW);

                            var yMax = 1.5;
                            var xScale = plotW / maxU;
                            var yScale = plotH / yMax;

                            // Axes
                            ctx.strokeStyle = viz.colors.axis; ctx.lineWidth = 1;
                            ctx.beginPath(); ctx.moveTo(padL, padT); ctx.lineTo(padL, h - padB); ctx.lineTo(w - padR, h - padB); ctx.stroke();

                            // Grid
                            ctx.fillStyle = viz.colors.text; ctx.font = '10px -apple-system,sans-serif';
                            ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
                            for (var yl = 0; yl <= yMax; yl += 0.25) {
                                var sy = h - padB - yl * yScale;
                                ctx.strokeStyle = viz.colors.grid; ctx.lineWidth = 0.5;
                                ctx.beginPath(); ctx.moveTo(padL, sy); ctx.lineTo(w - padR, sy); ctx.stroke();
                                ctx.fillStyle = viz.colors.text;
                                ctx.fillText(yl.toFixed(2), padL - 5, sy);
                            }
                            ctx.textAlign = 'center'; ctx.textBaseline = 'top';
                            for (var xl = 0; xl <= maxU; xl += 0.5) {
                                var sx = padL + xl * xScale;
                                ctx.fillText(xl.toFixed(1), sx, h - padB + 4);
                            }

                            // Histogram
                            for (var b = 0; b < nBins; b++) {
                                var bx = padL + b * binW * xScale;
                                var bw = binW * xScale;
                                var bh = bins[b] * yScale;
                                ctx.fillStyle = viz.colors.blue + '55';
                                ctx.fillRect(bx, h - padB - bh, bw, bh);
                                ctx.strokeStyle = viz.colors.blue; ctx.lineWidth = 1;
                                ctx.strokeRect(bx, h - padB - bh, bw, bh);
                            }

                            // GUE pair correlation: 1 - (sin(pi*u)/(pi*u))^2
                            ctx.strokeStyle = viz.colors.orange; ctx.lineWidth = 2.5;
                            ctx.beginPath();
                            var started = false;
                            for (var u = 0.01; u <= maxU; u += 0.02) {
                                var sinc = Math.sin(Math.PI * u) / (Math.PI * u);
                                var r2 = 1 - sinc * sinc;
                                var gx = padL + u * xScale;
                                var gy = h - padB - r2 * yScale;
                                if (!started) { ctx.moveTo(gx, gy); started = true; } else ctx.lineTo(gx, gy);
                            }
                            ctx.stroke();

                            // R_2 = 1 line
                            ctx.strokeStyle = viz.colors.text + '44'; ctx.lineWidth = 1; ctx.setLineDash([4, 4]);
                            var yOne = h - padB - 1.0 * yScale;
                            ctx.beginPath(); ctx.moveTo(padL, yOne); ctx.lineTo(w - padR, yOne); ctx.stroke();
                            ctx.setLineDash([]);

                            viz.screenText('Pair Correlation of Zeta Zeros', w / 2, 15, viz.colors.white, 14);
                            viz.screenText('u (unfolded spacing)', w / 2, h - 5, viz.colors.text, 12);
                            viz.screenText('R\u2082(u)', 20, h / 2, viz.colors.text, 12);

                            // Legend
                            var ly = padT + 8;
                            ctx.fillStyle = viz.colors.blue + '55';
                            ctx.fillRect(w - 195, ly, 14, 14);
                            ctx.fillStyle = viz.colors.text; ctx.font = '11px -apple-system,sans-serif'; ctx.textAlign = 'left';
                            ctx.fillText('Zeta zeros', w - 178, ly + 11);

                            ctx.strokeStyle = viz.colors.orange; ctx.lineWidth = 2;
                            ctx.beginPath(); ctx.moveTo(w - 195, ly + 25); ctx.lineTo(w - 181, ly + 25); ctx.stroke();
                            ctx.fillStyle = viz.colors.text;
                            ctx.fillText('1 - (sin\u03C0u/\u03C0u)\u00B2', w - 178, ly + 29);
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Show that the pair correlation function \\(R_2(u) = 1 - \\left(\\frac{\\sin\\pi u}{\\pi u}\\right)^2\\) satisfies \\(R_2(n) = 1\\) for all nonzero integers \\(n\\).',
                    hint: 'What is \\(\\sin(n\\pi)\\) for integer \\(n\\)?',
                    solution: 'For integer \\(n \\neq 0\\), \\(\\sin(n\\pi) = 0\\), so \\(\\left(\\frac{\\sin n\\pi}{n\\pi}\\right)^2 = 0\\). Thus \\(R_2(n) = 1 - 0 = 1\\). This means the pair correlation at integer spacings equals 1, the "Poisson" (uncorrelated) value, as expected from the fact that repulsion is a local effect.'
                },
            ]
        },

        // ================================================================
        // SECTION 6: Random Matrix Theory and GUE
        // ================================================================
        {
            id: 'sec-random-matrices',
            title: 'Random Matrices and GUE',
            content: `
<h2>Random Matrix Theory and the GUE</h2>

<div class="env-block intuition">
    <div class="env-title">Why Random Matrices?</div>
    <div class="env-body">
        <p>A random \\(N \\times N\\) Hermitian matrix \\(H\\) drawn from the Gaussian Unitary Ensemble (GUE) has \\(N\\) real eigenvalues. As \\(N \\to \\infty\\), the local statistics of these eigenvalues (after unfolding) are <em>universal</em>: they depend only on the symmetry class (unitary, in this case), not on the specific distribution. Montgomery's discovery is that zeta zeros exhibit the same local statistics.</p>
    </div>
</div>

<h3>The GUE Ensemble</h3>

<div class="env-block definition">
    <div class="env-title">Definition (Gaussian Unitary Ensemble)</div>
    <div class="env-body">
        <p>The <strong>GUE(N)</strong> is the probability space of \\(N \\times N\\) Hermitian matrices \\(H = (h_{ij})\\) with density proportional to \\(\\exp(-\\tfrac{N}{2}\\operatorname{tr}(H^2))\\). Equivalently:</p>
        <ul>
            <li>Diagonal entries \\(h_{ii}\\) are i.i.d. \\(\\mathcal{N}(0, 1/N)\\).</li>
            <li>Off-diagonal entries \\(h_{ij} = \\overline{h_{ji}}\\) with \\(\\operatorname{Re}(h_{ij}), \\operatorname{Im}(h_{ij}) \\sim \\mathcal{N}(0, 1/(2N))\\) independent.</li>
        </ul>
    </div>
</div>

<div class="env-block theorem">
    <div class="env-title">Theorem 16.9 (GUE Level Repulsion)</div>
    <div class="env-body">
        <p>For GUE(N) eigenvalues \\(\\lambda_1 \\leq \\cdots \\leq \\lambda_N\\), the joint density is</p>
        \\[
        p(\\lambda_1, \\ldots, \\lambda_N) \\propto \\prod_{i < j} |\\lambda_i - \\lambda_j|^2 \\cdot \\exp\\!\\left(-\\frac{N}{2}\\sum_i \\lambda_i^2\\right).
        \\]
        <p>The \\(|\\lambda_i - \\lambda_j|^2\\) factor causes <strong>quadratic repulsion</strong>: eigenvalues strongly avoid each other.</p>
    </div>
</div>

<h3>The GUE Nearest-Neighbor Spacing</h3>

<p>The nearest-neighbor spacing distribution for GUE is well-approximated by the <strong>Wigner surmise</strong>:</p>

\\[
p_{\\text{GUE}}(s) = \\frac{32}{\\pi^2} s^2 e^{-4s^2/\\pi}.
\\]

<p>Compare this with the Poisson distribution \\(p_{\\text{Poisson}}(s) = e^{-s}\\) for uncorrelated random points:</p>

<ul>
    <li><strong>GUE:</strong> \\(p(0) = 0\\) (quadratic vanishing), mode at \\(s \\approx 0.68\\).</li>
    <li><strong>Poisson:</strong> \\(p(0) = 1\\) (no repulsion), mode at \\(s = 0\\).</li>
</ul>

<h3>The Katz-Sarnak Philosophy</h3>

<div class="env-block theorem">
    <div class="env-title">Conjecture 16.10 (Katz-Sarnak, 1999)</div>
    <div class="env-body">
        <p>The local statistics of zeros of any "reasonable" family of L-functions match those of eigenvalues of a classical compact group, determined by the symmetry type of the family:</p>
        <ul>
            <li>Unitary: \\(L(s, \\chi)\\) with \\(\\chi\\) varying over primitive characters.</li>
            <li>Symplectic: L-functions of even self-dual representations.</li>
            <li>Orthogonal: L-functions of odd self-dual representations.</li>
        </ul>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-gue-comparison"></div>
`,
            visualizations: [
                {
                    id: 'viz-gue-comparison',
                    title: 'GUE vs. Poisson Spacing Distribution',
                    description: 'The GUE (Wigner surmise) spacing distribution shows quadratic level repulsion: \\(p(s) \\propto s^2 e^{-cs^2}\\). The Poisson distribution \\(e^{-s}\\) has no repulsion. The GOE distribution \\(\\propto s \\cdot e^{-cs^2}\\) shows linear repulsion. Drag the slider to interpolate between them.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 380,
                            originX: 60, originY: 340, scale: 1
                        });

                        var showGOE = true;
                        VizEngine.createButton(controls, 'Toggle GOE', function() {
                            showGOE = !showGOE;
                            draw();
                        });

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var w = viz.width, h = viz.height;
                            var padL = 60, padR = 20, padT = 30, padB = 40;
                            var plotW = w - padL - padR;
                            var plotH = h - padT - padB;

                            var maxS = 4.0;
                            var yMax = 1.1;
                            var xScale = plotW / maxS;
                            var yScale = plotH / yMax;

                            // Axes
                            ctx.strokeStyle = viz.colors.axis; ctx.lineWidth = 1;
                            ctx.beginPath(); ctx.moveTo(padL, padT); ctx.lineTo(padL, h - padB); ctx.lineTo(w - padR, h - padB); ctx.stroke();

                            // Grid
                            ctx.fillStyle = viz.colors.text; ctx.font = '10px -apple-system,sans-serif';
                            ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
                            for (var yl = 0; yl <= yMax; yl += 0.2) {
                                var sy = h - padB - yl * yScale;
                                ctx.strokeStyle = viz.colors.grid; ctx.lineWidth = 0.5;
                                ctx.beginPath(); ctx.moveTo(padL, sy); ctx.lineTo(w - padR, sy); ctx.stroke();
                                ctx.fillStyle = viz.colors.text;
                                ctx.fillText(yl.toFixed(1), padL - 5, sy);
                            }
                            ctx.textAlign = 'center'; ctx.textBaseline = 'top';
                            for (var xl = 0; xl <= maxS; xl += 0.5) {
                                ctx.fillText(xl.toFixed(1), padL + xl * xScale, h - padB + 4);
                            }

                            // Poisson: p(s) = exp(-s)
                            ctx.strokeStyle = viz.colors.red; ctx.lineWidth = 2;
                            ctx.beginPath();
                            for (var s = 0; s <= maxS; s += 0.02) {
                                var pp = Math.exp(-s);
                                var px = padL + s * xScale;
                                var py = h - padB - pp * yScale;
                                s === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
                            }
                            ctx.stroke();

                            // GOE: p(s) = (pi/2) s exp(-pi s^2/4)
                            if (showGOE) {
                                ctx.strokeStyle = viz.colors.purple; ctx.lineWidth = 2;
                                ctx.beginPath();
                                var goeStarted = false;
                                for (var s = 0; s <= maxS; s += 0.02) {
                                    var pg = (Math.PI / 2) * s * Math.exp(-Math.PI * s * s / 4);
                                    var px = padL + s * xScale;
                                    var py = h - padB - pg * yScale;
                                    if (!goeStarted) { ctx.moveTo(px, py); goeStarted = true; } else ctx.lineTo(px, py);
                                }
                                ctx.stroke();
                            }

                            // GUE: p(s) = (32/pi^2) s^2 exp(-4s^2/pi)
                            ctx.strokeStyle = viz.colors.orange; ctx.lineWidth = 2.5;
                            ctx.beginPath();
                            var gueStarted = false;
                            for (var s = 0; s <= maxS; s += 0.02) {
                                var pg = (32 / (Math.PI * Math.PI)) * s * s * Math.exp(-4 * s * s / Math.PI);
                                var px = padL + s * xScale;
                                var py = h - padB - pg * yScale;
                                if (!gueStarted) { ctx.moveTo(px, py); gueStarted = true; } else ctx.lineTo(px, py);
                            }
                            ctx.stroke();

                            // Labels
                            viz.screenText('Spacing Distributions: GUE, GOE, Poisson', w / 2, 15, viz.colors.white, 14);
                            viz.screenText('Spacing s', w / 2, h - 5, viz.colors.text, 12);
                            viz.screenText('p(s)', 20, h / 2, viz.colors.text, 12);

                            // Legend
                            var ly = padT + 10;
                            ctx.strokeStyle = viz.colors.orange; ctx.lineWidth = 2.5;
                            ctx.beginPath(); ctx.moveTo(w - 170, ly); ctx.lineTo(w - 156, ly); ctx.stroke();
                            ctx.fillStyle = viz.colors.text; ctx.font = '11px -apple-system,sans-serif'; ctx.textAlign = 'left';
                            ctx.fillText('GUE (s\u00B2 repulsion)', w - 152, ly + 4);

                            if (showGOE) {
                                ctx.strokeStyle = viz.colors.purple; ctx.lineWidth = 2;
                                ctx.beginPath(); ctx.moveTo(w - 170, ly + 18); ctx.lineTo(w - 156, ly + 18); ctx.stroke();
                                ctx.fillStyle = viz.colors.text;
                                ctx.fillText('GOE (s repulsion)', w - 152, ly + 22);
                            }

                            ctx.strokeStyle = viz.colors.red; ctx.lineWidth = 2;
                            ctx.beginPath(); ctx.moveTo(w - 170, ly + 36); ctx.lineTo(w - 156, ly + 36); ctx.stroke();
                            ctx.fillStyle = viz.colors.text;
                            ctx.fillText('Poisson (no repulsion)', w - 152, ly + 40);

                            // Annotation
                            viz.screenText('p(0) = 0 for GUE/GOE: level repulsion', w / 2, h - padB - plotH + 15, viz.colors.teal, 11);
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Verify that the Wigner surmise \\(p(s) = \\frac{32}{\\pi^2}s^2 e^{-4s^2/\\pi}\\) is normalized: \\(\\int_0^\\infty p(s)\\,ds = 1\\).',
                    hint: 'Use the Gaussian integral \\(\\int_0^\\infty s^2 e^{-as^2}\\,ds = \\frac{\\sqrt{\\pi}}{4a^{3/2}}\\) with \\(a = 4/\\pi\\).',
                    solution: '\\(\\int_0^\\infty \\frac{32}{\\pi^2} s^2 e^{-4s^2/\\pi}\\,ds = \\frac{32}{\\pi^2} \\cdot \\frac{\\sqrt{\\pi}}{4(4/\\pi)^{3/2}} = \\frac{32}{\\pi^2} \\cdot \\frac{\\sqrt{\\pi} \\cdot \\pi^{3/2}}{4 \\cdot 8} = \\frac{32}{\\pi^2} \\cdot \\frac{\\pi^2}{32} = 1\\). \\(\\checkmark\\)'
                },
                {
                    question: 'Compute the mean spacing \\(\\langle s \\rangle = \\int_0^\\infty s \\cdot p(s)\\,ds\\) for the GUE Wigner surmise.',
                    hint: 'Use \\(\\int_0^\\infty s^3 e^{-as^2}\\,ds = \\frac{1}{2a^2}\\) with \\(a = 4/\\pi\\).',
                    solution: '\\(\\langle s \\rangle = \\frac{32}{\\pi^2}\\int_0^\\infty s^3 e^{-4s^2/\\pi}\\,ds = \\frac{32}{\\pi^2} \\cdot \\frac{1}{2(4/\\pi)^2} = \\frac{32}{\\pi^2} \\cdot \\frac{\\pi^2}{32} = 1\\). So the mean spacing is exactly 1, as it should be for properly unfolded eigenvalues. \\(\\checkmark\\)'
                }
            ]
        },

        // ================================================================
        // SECTION 7: The Bridge
        // ================================================================
        {
            id: 'sec-bridge',
            title: 'Looking Ahead',
            content: `
<h2>From Zero Statistics to Automorphic Forms</h2>

<div class="env-block intuition">
    <div class="env-title">The Grand Unified Picture</div>
    <div class="env-body">
        <p>This chapter has shown that zeta zeros are not randomly scattered: they obey precise counting laws (Riemann-von Mangoldt), are rare far from the critical line (zero-density estimates), and exhibit universal repulsion patterns (GUE statistics). The natural question is: <em>why</em> do L-function zeros behave like eigenvalues of random matrices?</p>
    </div>
</div>

<h3>Three Threads Going Forward</h3>

<div class="env-block definition">
    <div class="env-title">The Spectral Interpretation</div>
    <div class="env-body">
        <p>The Hilbert-Polya conjecture posits that the nontrivial zeros \\(\\rho = \\tfrac{1}{2} + i\\gamma_n\\) correspond to eigenvalues of a self-adjoint operator. If such an operator exists, the GUE statistics would follow from its spectral theory. Finding this operator (the "Riemann operator") remains one of the deepest open problems in mathematics.</p>
    </div>
</div>

<h3>Connections to Physics</h3>

<p>The GUE universality of zeta zeros connects to several areas of physics:</p>

<ul>
    <li><strong>Quantum chaos:</strong> Energy levels of classically chaotic quantum systems follow GUE statistics (Bohigas-Giannoni-Schmit conjecture, 1984). The zeros of \\(\\zeta\\) behave like the spectrum of a chaotic quantum system.</li>
    <li><strong>Nuclear physics:</strong> The original motivation for random matrix theory (Wigner, 1950s) was modeling energy levels of heavy nuclei, whose level spacings follow GOE (real symmetric matrices) or GUE (with time-reversal symmetry breaking).</li>
    <li><strong>Quantum gravity:</strong> In certain models, the partition function involves a matrix integral whose eigenvalue statistics are GUE.</li>
</ul>

<h3>Computational Evidence</h3>

<div class="env-block theorem">
    <div class="env-title">Numerical Results (Odlyzko, 1987-2001)</div>
    <div class="env-body">
        <p>Andrew Odlyzko computed billions of zeros of \\(\\zeta(s)\\) near height \\(T = 10^{20}\\) and higher. His data shows extraordinary agreement with GUE predictions for all local statistics: nearest-neighbor spacing, pair correlation, number variance, and higher correlations. The match is accurate to several decimal places, providing overwhelming numerical evidence for the Montgomery-Odlyzko law.</p>
    </div>
</div>

<h3>Preview: Automorphic Forms (Chapter 17)</h3>

<p>The Katz-Sarnak philosophy tells us that the symmetry type (unitary, symplectic, orthogonal) of an L-function family determines its zero statistics. But what determines the symmetry type? The answer lies in the <strong>automorphic form</strong> that generates the L-function. Chapter 17 introduces modular forms and automorphic representations, the algebraic structures that organize all L-functions into a coherent theory.</p>

<div class="env-block remark">
    <div class="env-title">The Langlands Program Connection</div>
    <div class="env-body">
        <p>The Langlands program predicts that every "motivic" L-function is automorphic. Combined with the Katz-Sarnak philosophy, this would mean that <em>all</em> L-functions of arithmetic interest have zero statistics governed by random matrix theory. Understanding automorphic forms is therefore the key to understanding the fine structure of primes.</p>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-density-bounds"></div>
`,
            visualizations: [
                {
                    id: 'viz-density-bounds',
                    title: 'Zero-Density Exponents Compared',
                    description: 'The exponent \\(A(\\sigma)\\) in the bound \\(N(\\sigma,T) \\ll T^{A(\\sigma)+\\varepsilon}\\) for different results. RH would give \\(A(\\sigma) = 0\\). The Density Hypothesis gives \\(A(\\sigma) = 2(1-\\sigma)\\). Ingham and Huxley give unconditional bounds.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 380,
                            originX: 60, originY: 340, scale: 1
                        });

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var w = viz.width, h = viz.height;
                            var padL = 60, padR = 30, padT = 30, padB = 40;
                            var plotW = w - padL - padR;
                            var plotH = h - padT - padB;

                            // sigma range: 1/2 to 1
                            var sigMin = 0.5, sigMax = 1.0;
                            var aMax = 1.2;
                            var xScale = plotW / (sigMax - sigMin);
                            var yScale = plotH / aMax;

                            // Axes
                            ctx.strokeStyle = viz.colors.axis; ctx.lineWidth = 1;
                            ctx.beginPath(); ctx.moveTo(padL, padT); ctx.lineTo(padL, h - padB); ctx.lineTo(w - padR, h - padB); ctx.stroke();

                            // Grid
                            ctx.fillStyle = viz.colors.text; ctx.font = '10px -apple-system,sans-serif';
                            ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
                            for (var yl = 0; yl <= aMax; yl += 0.2) {
                                var sy = h - padB - yl * yScale;
                                ctx.strokeStyle = viz.colors.grid; ctx.lineWidth = 0.5;
                                ctx.beginPath(); ctx.moveTo(padL, sy); ctx.lineTo(w - padR, sy); ctx.stroke();
                                ctx.fillStyle = viz.colors.text;
                                ctx.fillText(yl.toFixed(1), padL - 5, sy);
                            }
                            ctx.textAlign = 'center'; ctx.textBaseline = 'top';
                            for (var xl = 0.5; xl <= 1.0; xl += 0.1) {
                                var sx = padL + (xl - sigMin) * xScale;
                                ctx.fillText(xl.toFixed(1), sx, h - padB + 4);
                            }

                            // RH line: A(sigma) = 0
                            ctx.strokeStyle = viz.colors.green; ctx.lineWidth = 2;
                            ctx.beginPath();
                            ctx.moveTo(padL, h - padB);
                            ctx.lineTo(w - padR, h - padB);
                            ctx.stroke();

                            // Density Hypothesis: A = 2(1 - sigma)
                            ctx.strokeStyle = viz.colors.teal; ctx.lineWidth = 2;
                            ctx.beginPath();
                            for (var s = sigMin; s <= sigMax; s += 0.01) {
                                var a = 2 * (1 - s);
                                var px = padL + (s - sigMin) * xScale;
                                var py = h - padB - a * yScale;
                                s === sigMin ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
                            }
                            ctx.stroke();

                            // Ingham: A = 3(1-sigma)/(2-sigma)
                            ctx.strokeStyle = viz.colors.blue; ctx.lineWidth = 2;
                            ctx.beginPath();
                            for (var s = sigMin; s <= sigMax; s += 0.01) {
                                var a = 3 * (1 - s) / (2 - s);
                                var px = padL + (s - sigMin) * xScale;
                                var py = h - padB - a * yScale;
                                s === sigMin ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
                            }
                            ctx.stroke();

                            // Huxley: A = 12(1-sigma)/5
                            ctx.strokeStyle = viz.colors.orange; ctx.lineWidth = 2;
                            ctx.beginPath();
                            for (var s = sigMin; s <= sigMax; s += 0.01) {
                                var a = 12 * (1 - s) / 5;
                                var px = padL + (s - sigMin) * xScale;
                                var py = h - padB - a * yScale;
                                s === sigMin ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
                            }
                            ctx.stroke();

                            // Title and labels
                            viz.screenText('Zero-Density Exponents A(\u03C3)', w / 2, 15, viz.colors.white, 14);
                            viz.screenText('\u03C3', w / 2, h - 5, viz.colors.text, 12);
                            viz.screenText('A(\u03C3)', 20, h / 2, viz.colors.text, 12);

                            // Legend
                            var ly = padT + 10;
                            var lx = padL + 15;
                            ctx.font = '11px -apple-system,sans-serif'; ctx.textAlign = 'left';

                            ctx.strokeStyle = viz.colors.green; ctx.lineWidth = 2;
                            ctx.beginPath(); ctx.moveTo(lx, ly); ctx.lineTo(lx + 20, ly); ctx.stroke();
                            ctx.fillStyle = viz.colors.text; ctx.fillText('RH: A = 0', lx + 25, ly + 4);

                            ctx.strokeStyle = viz.colors.teal; ctx.lineWidth = 2;
                            ctx.beginPath(); ctx.moveTo(lx, ly + 18); ctx.lineTo(lx + 20, ly + 18); ctx.stroke();
                            ctx.fillStyle = viz.colors.text; ctx.fillText('DH: 2(1-\u03C3)', lx + 25, ly + 22);

                            ctx.strokeStyle = viz.colors.blue; ctx.lineWidth = 2;
                            ctx.beginPath(); ctx.moveTo(lx, ly + 36); ctx.lineTo(lx + 20, ly + 36); ctx.stroke();
                            ctx.fillStyle = viz.colors.text; ctx.fillText('Ingham: 3(1-\u03C3)/(2-\u03C3)', lx + 25, ly + 40);

                            ctx.strokeStyle = viz.colors.orange; ctx.lineWidth = 2;
                            ctx.beginPath(); ctx.moveTo(lx, ly + 54); ctx.lineTo(lx + 20, ly + 54); ctx.stroke();
                            ctx.fillStyle = viz.colors.text; ctx.fillText('Huxley: 12(1-\u03C3)/5', lx + 25, ly + 58);
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Explain why the Hilbert-Polya conjecture, if true, would imply the Riemann Hypothesis.',
                    hint: 'Self-adjoint operators on Hilbert space have real eigenvalues.',
                    solution: 'If the nontrivial zeros of \\(\\zeta(s)\\) are of the form \\(\\rho = \\frac{1}{2} + i\\lambda\\) where \\(\\lambda\\) ranges over the eigenvalues of a self-adjoint operator \\(T\\), then since self-adjoint operators have real spectrum, every \\(\\lambda\\) is real. This means every \\(\\rho\\) has \\(\\operatorname{Re}(\\rho) = \\frac{1}{2}\\), which is exactly the Riemann Hypothesis.'
                },
            ]
        }
    ]
});
