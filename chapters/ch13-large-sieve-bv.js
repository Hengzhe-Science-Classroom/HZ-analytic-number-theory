window.CHAPTERS = window.CHAPTERS || [];
window.CHAPTERS.push({
    id: 'ch13',
    number: 13,
    title: 'The Large Sieve & Bombieri-Vinogradov',
    subtitle: 'GRH on average, for free',
    sections: [
        // ================================================================
        // SECTION 1: Motivation
        // ================================================================
        {
            id: 'sec-motivation',
            title: 'Motivation',
            content: `
<h2>Why the Large Sieve?</h2>

<div class="env-block intuition">
    <div class="env-title">The Central Tension</div>
    <div class="env-body">
        <p>We proved Dirichlet's theorem: there are infinitely many primes in every arithmetic progression \\(a \\bmod q\\) with \\(\\gcd(a,q) = 1\\). But to apply sieve methods effectively, we need <em>quantitative</em> information: not just that primes exist in progressions, but that they are <strong>well-distributed</strong> across progressions, uniformly for many moduli \\(q\\) at once.</p>
        <p>The Generalized Riemann Hypothesis (GRH) would give exactly this. But GRH remains unproven. The large sieve inequality and the Bombieri-Vinogradov theorem provide a remarkable substitute: they show that GRH-quality estimates hold <strong>on average</strong> over moduli, which is often all that sieve methods require.</p>
    </div>
</div>

<h3>What We Need and Why</h3>

<p>Recall the prime-counting function in arithmetic progressions:</p>
\\[
\\pi(x; q, a) = \\#\\{p \\le x : p \\equiv a \\pmod{q}\\}.
\\]
<p>The prime number theorem for progressions says that for fixed \\(q\\) with \\(\\gcd(a,q) = 1\\),</p>
\\[
\\pi(x; q, a) \\sim \\frac{\\operatorname{li}(x)}{\\varphi(q)}
\\]
<p>as \\(x \\to \\infty\\). But "fixed \\(q\\)" is too restrictive. Sieve methods (Brun, Selberg, and the methods from Chapters 11-12) often require uniform estimates as \\(q\\) ranges over an interval \\([1, Q]\\), where \\(Q\\) can grow with \\(x\\).</p>

<div class="env-block definition">
    <div class="env-title">Definition 13.1 (Error in Arithmetic Progressions)</div>
    <div class="env-body">
        <p>Define the error term</p>
        \\[
        E(x; q, a) = \\psi(x; q, a) - \\frac{x}{\\varphi(q)},
        \\]
        <p>where \\(\\psi(x; q, a) = \\sum_{\\substack{n \\le x \\\\ n \\equiv a \\pmod{q}}} \\Lambda(n)\\) is the Chebyshev function restricted to the progression \\(a \\bmod q\\).</p>
    </div>
</div>

<p>Under GRH, one has \\(|E(x; q, a)| \\ll x^{1/2} \\log^2 x\\) for every \\(q \\le x\\). The Bombieri-Vinogradov theorem instead gives</p>
\\[
\\sum_{q \\le Q} \\max_{\\gcd(a,q)=1} |E(x; q, a)| \\ll \\frac{x}{(\\log x)^A}
\\]
<p>for any \\(A > 0\\), provided \\(Q \\le x^{1/2}(\\log x)^{-B}\\) for some \\(B = B(A)\\). Individual errors can be large, but they <em>average out</em>. This is exactly what sieve methods consume.</p>

<h3>Historical Arc</h3>

<p>The large sieve was introduced by Linnik (1941) to study the least quadratic non-residue. The name refers to "sieving" a set by removing it from many residue classes simultaneously. Bombieri (1965) and A. I. Vinogradov (1965) independently used large sieve ideas to prove the eponymous theorem. Montgomery and Vaughan (1973) gave the sharp form of the analytic large sieve inequality.</p>

<div class="env-block remark">
    <div class="env-title">The Power of "On Average"</div>
    <div class="env-body">
        <p>The phrase "GRH on average" is apt: for <em>most</em> moduli \\(q \\le Q\\), the primes in progressions mod \\(q\\) behave as well as GRH predicts. The few exceptional moduli where the error is large make a negligible total contribution. This is a recurring motif in analytic number theory: what cannot be proved for all can often be proved for almost all.</p>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-bv-histogram"></div>
`,
            visualizations: [
                {
                    id: 'viz-bv-histogram',
                    title: 'Errors in Arithmetic Progressions',
                    description: 'For each modulus q, the bars show the maximum error |E(x; q, a)| over reduced residues a. While individual errors fluctuate, most moduli have small errors. The Bombieri-Vinogradov theorem controls their sum.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 380,
                            originX: 60, originY: 340, scale: 1
                        });

                        var xVal = 500;
                        VizEngine.createSlider(controls, 'x', 200, 2000, xVal, 100, function(v) {
                            xVal = Math.round(v);
                            draw();
                        });

                        // Simple prime sieve
                        function sieveTo(n) {
                            var s = new Uint8Array(n + 1);
                            var primes = [];
                            for (var i = 2; i <= n; i++) {
                                if (!s[i]) { primes.push(i); for (var j = i * i; j <= n; j += i) s[j] = 1; }
                            }
                            return primes;
                        }

                        function eulerPhi(n) {
                            var result = n;
                            for (var p = 2; p * p <= n; p++) {
                                if (n % p === 0) {
                                    while (n % p === 0) n /= p;
                                    result -= result / p;
                                }
                            }
                            if (n > 1) result -= result / n;
                            return Math.round(result);
                        }

                        function gcd(a, b) { while (b) { var t = b; b = a % b; a = t; } return a; }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var primes = sieveTo(xVal);
                            var maxQ = Math.min(40, Math.floor(Math.sqrt(xVal)));

                            // For each q, compute max |psi(x;q,a) - x/phi(q)| over gcd(a,q)=1
                            var errors = [];
                            for (var q = 2; q <= maxQ; q++) {
                                var phi = eulerPhi(q);
                                if (phi === 0) continue;
                                var expected = xVal / phi;
                                var maxErr = 0;
                                for (var a = 1; a < q; a++) {
                                    if (gcd(a, q) !== 1) continue;
                                    // Count Lambda(n) for n <= x, n = a mod q
                                    var count = 0;
                                    for (var pi = 0; pi < primes.length; pi++) {
                                        var p = primes[pi];
                                        if (p > xVal) break;
                                        if (p % q === a) count += Math.log(p);
                                    }
                                    var err = Math.abs(count - expected);
                                    if (err > maxErr) maxErr = err;
                                }
                                errors.push({ q: q, err: maxErr, phi: phi });
                            }

                            if (errors.length === 0) return;

                            // Draw bars
                            var maxErr = 0;
                            for (var i = 0; i < errors.length; i++) {
                                if (errors[i].err > maxErr) maxErr = errors[i].err;
                            }
                            if (maxErr < 1) maxErr = 1;

                            var barW = Math.min(18, (viz.width - 100) / errors.length - 2);
                            var chartH = 270;
                            var chartBottom = 320;
                            var chartLeft = 60;

                            // Y axis
                            ctx.strokeStyle = viz.colors.axis;
                            ctx.lineWidth = 1;
                            ctx.beginPath();
                            ctx.moveTo(chartLeft, chartBottom);
                            ctx.lineTo(chartLeft, chartBottom - chartH);
                            ctx.stroke();

                            // X axis
                            ctx.beginPath();
                            ctx.moveTo(chartLeft, chartBottom);
                            ctx.lineTo(viz.width - 20, chartBottom);
                            ctx.stroke();

                            viz.screenText('max |E(x; q, a)|', 30, chartBottom - chartH / 2, viz.colors.text, 10, 'center');
                            viz.screenText('Errors in Arithmetic Progressions (x = ' + xVal + ')', viz.width / 2, 18, viz.colors.white, 14);

                            // Compute BV average level
                            var sumErr = 0;
                            for (var i = 0; i < errors.length; i++) sumErr += errors[i].err;
                            var avgErr = sumErr / errors.length;

                            for (var i = 0; i < errors.length; i++) {
                                var e = errors[i];
                                var h = (e.err / maxErr) * chartH;
                                var bx = chartLeft + 10 + i * (barW + 2);

                                // Color: small errors blue, large errors red
                                var t = e.err / maxErr;
                                var col = t < 0.5 ? viz.colors.blue : (t < 0.8 ? viz.colors.orange : viz.colors.red);
                                ctx.fillStyle = col + 'cc';
                                ctx.fillRect(bx, chartBottom - h, barW, h);

                                // q label every few bars
                                if (i % Math.max(1, Math.floor(errors.length / 10)) === 0 || i === errors.length - 1) {
                                    ctx.fillStyle = viz.colors.text;
                                    ctx.font = '9px -apple-system,sans-serif';
                                    ctx.textAlign = 'center';
                                    ctx.textBaseline = 'top';
                                    ctx.fillText('q=' + e.q, bx + barW / 2, chartBottom + 3);
                                }
                            }

                            // Draw average line
                            var avgH = (avgErr / maxErr) * chartH;
                            ctx.strokeStyle = viz.colors.teal;
                            ctx.lineWidth = 2;
                            ctx.setLineDash([6, 4]);
                            ctx.beginPath();
                            ctx.moveTo(chartLeft, chartBottom - avgH);
                            ctx.lineTo(viz.width - 20, chartBottom - avgH);
                            ctx.stroke();
                            ctx.setLineDash([]);
                            viz.screenText('average', viz.width - 50, chartBottom - avgH - 10, viz.colors.teal, 10);

                            viz.screenText('Most moduli have small errors; the sum is controlled by BV', viz.width / 2, viz.height - 10, viz.colors.text, 10);
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: []
        },

        // ================================================================
        // SECTION 2: The Large Sieve Inequality
        // ================================================================
        {
            id: 'sec-large-sieve',
            title: 'The Large Sieve Inequality',
            content: `
<h2>The Additive Large Sieve</h2>

<div class="env-block intuition">
    <div class="env-title">What Does the Large Sieve Measure?</div>
    <div class="env-body">
        <p>Consider a finite sequence of complex numbers \\((a_n)_{M < n \\le M+N}\\). Think of this as a "signal." The large sieve inequality bounds how much "energy" this signal can concentrate near a collection of well-spaced points on the unit circle. The key insight: if the points are well-separated, the energy cannot pile up.</p>
    </div>
</div>

<h3>The Analytic (Additive) Form</h3>

<div class="env-block theorem">
    <div class="env-title">Theorem 13.1 (Large Sieve Inequality, Montgomery-Vaughan 1973)</div>
    <div class="env-body">
        <p>Let \\(a_{M+1}, \\ldots, a_{M+N}\\) be complex numbers and let \\(\\alpha_1, \\ldots, \\alpha_R\\) be real numbers satisfying</p>
        \\[
        \\|\\alpha_r - \\alpha_s\\| \\ge \\delta > 0 \\quad \\text{for all } r \\ne s,
        \\]
        <p>where \\(\\|\\cdot\\|\\) denotes the distance to the nearest integer. Then</p>
        \\[
        \\sum_{r=1}^{R} \\left| \\sum_{n=M+1}^{M+N} a_n \\, e(n\\alpha_r) \\right|^2 \\le (N - 1 + \\delta^{-1}) \\sum_{n=M+1}^{M+N} |a_n|^2,
        \\]
        <p>where \\(e(\\theta) = e^{2\\pi i \\theta}\\).</p>
    </div>
</div>

<p>The constant \\(N - 1 + \\delta^{-1}\\) is best possible, as shown by Montgomery and Vaughan. The inequality says: the total "energy" of the exponential sums at the sample points is bounded by the \\(\\ell^2\\)-norm of the coefficients, multiplied by a factor that accounts for both the length \\(N\\) and the spacing \\(\\delta\\).</p>

<div class="env-block proof">
    <div class="env-title">Proof Sketch (Duality Approach)</div>
    <div class="env-body">
        <p>The key idea is to view the inequality through the lens of operator theory. Define the operator \\(T\\) that maps the sequence \\((a_n)\\) to the values \\((S(\\alpha_r))\\) where \\(S(\\alpha) = \\sum a_n e(n\\alpha)\\). Then:</p>
        <ol>
            <li>The large sieve inequality asserts \\(\\|T\\|^2 \\le N - 1 + \\delta^{-1}\\).</li>
            <li>By duality (\\(\\|T\\| = \\|T^*\\|\\)), this is equivalent to bounding \\(T^*T\\), which involves the kernel \\(\\sum_r e((m - n)\\alpha_r)\\).</li>
            <li>The well-spacing condition \\(\\|\\alpha_r - \\alpha_s\\| \\ge \\delta\\) controls the off-diagonal terms through the Beurling-Selberg function, yielding the sharp constant.</li>
        </ol>
    </div>
    <div class="qed">&marker;</div>
</div>

<h3>Duality Principle</h3>

<p>A powerful feature of the large sieve is its <em>self-duality</em>. The same inequality has an equivalent "dual" formulation:</p>

<div class="env-block theorem">
    <div class="env-title">Theorem 13.2 (Dual Large Sieve)</div>
    <div class="env-body">
        <p>Under the same conditions, for any complex numbers \\(b_1, \\ldots, b_R\\),</p>
        \\[
        \\sum_{n=M+1}^{M+N} \\left| \\sum_{r=1}^{R} b_r \\, e(n\\alpha_r) \\right|^2 \\le (N - 1 + \\delta^{-1}) \\sum_{r=1}^{R} |b_r|^2.
        \\]
    </div>
</div>

<p>The primal form says: a signal's energy at well-spaced frequencies is bounded. The dual says: a superposition of well-spaced exponentials has bounded energy over any interval. These are the same statement via the Hilbert space adjoint.</p>

<div class="env-block remark">
    <div class="env-title">Why "Well-Spaced" Matters</div>
    <div class="env-body">
        <p>If the points \\(\\alpha_r\\) cluster together, the exponential sums \\(S(\\alpha_r)\\) become nearly identical, and the left side can be as large as \\(R \\cdot N^2 \\sup |a_n|^2\\). The spacing condition \\(\\delta > 0\\) ensures that the evaluation points "see different parts" of the signal. The Farey fractions \\(a/q\\) with \\(q \\le Q\\) are a natural example of well-spaced points, with \\(\\delta = 1/Q^2\\).</p>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-well-spacing"></div>

<div class="viz-placeholder" data-viz="viz-large-sieve-energy"></div>
`,
            visualizations: [
                {
                    id: 'viz-well-spacing',
                    title: 'Well-Spacing of Farey Fractions',
                    description: 'Farey fractions a/q with q <= Q on the unit interval. Adjacent fractions satisfy |a/q - a\'/q\'| >= 1/(qQ), ensuring the well-spacing condition. Increase Q to see more fractions fill the interval while maintaining minimum separation.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 300,
                            originX: 40, originY: 150, scale: 460
                        });

                        var Q = 6;
                        VizEngine.createSlider(controls, 'Q', 2, 20, Q, 1, function(v) {
                            Q = Math.round(v);
                            draw();
                        });

                        function gcd(a, b) { while (b) { var t = b; b = a % b; a = t; } return a; }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            viz.screenText('Farey Fractions F_' + Q + ' on [0, 1]', viz.width / 2, 20, viz.colors.white, 14);

                            // Collect Farey fractions
                            var fracs = [];
                            for (var q = 1; q <= Q; q++) {
                                for (var a = 0; a <= q; a++) {
                                    if (gcd(a, q) === 1) {
                                        fracs.push({ a: a, q: q, val: a / q });
                                    }
                                }
                            }
                            fracs.sort(function(x, y) { return x.val - y.val; });

                            // Remove duplicates (0/1 = 0, 1/1 = 1 etc)
                            var unique = [fracs[0]];
                            for (var i = 1; i < fracs.length; i++) {
                                if (Math.abs(fracs[i].val - unique[unique.length - 1].val) > 1e-10) {
                                    unique.push(fracs[i]);
                                }
                            }
                            fracs = unique;

                            // Draw number line
                            var lineY = 150;
                            var lineLeft = 40;
                            var lineRight = 520;
                            var lineW = lineRight - lineLeft;

                            ctx.strokeStyle = viz.colors.axis;
                            ctx.lineWidth = 2;
                            ctx.beginPath();
                            ctx.moveTo(lineLeft, lineY);
                            ctx.lineTo(lineRight, lineY);
                            ctx.stroke();

                            // Draw fractions
                            var minGap = Infinity;
                            var minPair = [0, 0];
                            for (var i = 0; i < fracs.length; i++) {
                                var f = fracs[i];
                                var sx = lineLeft + f.val * lineW;

                                // Color by denominator
                                var colors = [viz.colors.white, viz.colors.blue, viz.colors.teal, viz.colors.orange, viz.colors.purple, viz.colors.green, viz.colors.red, viz.colors.yellow, viz.colors.pink];
                                var col = colors[f.q % colors.length] || viz.colors.white;

                                // Tick mark
                                var tickH = 20 - Math.min(12, f.q);
                                ctx.strokeStyle = col;
                                ctx.lineWidth = 1.5;
                                ctx.beginPath();
                                ctx.moveTo(sx, lineY - tickH);
                                ctx.lineTo(sx, lineY + tickH);
                                ctx.stroke();

                                // Label (only if not too crowded)
                                if (fracs.length <= 30 || f.q <= 4) {
                                    ctx.fillStyle = col;
                                    ctx.font = (fracs.length > 20 ? '8' : '10') + 'px -apple-system,sans-serif';
                                    ctx.textAlign = 'center';
                                    ctx.textBaseline = 'top';
                                    var labelY = lineY + tickH + 4 + (i % 2) * 12;
                                    ctx.fillText(f.a + '/' + f.q, sx, labelY);
                                }

                                // Track minimum gap
                                if (i > 0) {
                                    var gap = fracs[i].val - fracs[i - 1].val;
                                    if (gap < minGap) {
                                        minGap = gap;
                                        minPair = [i - 1, i];
                                    }
                                }
                            }

                            // Highlight minimum gap
                            if (fracs.length > 1) {
                                var sx1 = lineLeft + fracs[minPair[0]].val * lineW;
                                var sx2 = lineLeft + fracs[minPair[1]].val * lineW;
                                ctx.fillStyle = viz.colors.red + '33';
                                ctx.fillRect(sx1, lineY - 25, sx2 - sx1, 50);
                            }

                            var delta = 1 / (Q * Q);
                            viz.screenText('|F_' + Q + '| = ' + fracs.length + ' fractions', viz.width / 2, 50, viz.colors.teal, 12);
                            viz.screenText('min spacing >= 1/Q\u00B2 = 1/' + (Q * Q) + ' \u2248 ' + delta.toFixed(4), viz.width / 2, 70, viz.colors.text, 11);
                            if (fracs.length > 1) {
                                viz.screenText('actual min gap = ' + minGap.toFixed(5), viz.width / 2, 88, viz.colors.orange, 11);
                            }
                            viz.screenText('Colors indicate denominator q', viz.width / 2, viz.height - 15, viz.colors.text, 10);
                        }
                        draw();
                        return viz;
                    }
                },
                {
                    id: 'viz-large-sieve-energy',
                    title: 'Large Sieve Energy Distribution',
                    description: 'The large sieve bounds the total energy sum |S(alpha_r)|^2 at well-spaced points. Here we visualize |S(alpha)|^2 for a random sequence (a_n), showing peaks at rationals a/q and verifying the inequality.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 380,
                            originX: 60, originY: 340, scale: 1
                        });

                        var N = 20;
                        var coeffs = [];
                        function randomize() {
                            coeffs = [];
                            for (var i = 0; i < N; i++) {
                                coeffs.push({ re: 2 * Math.random() - 1, im: 2 * Math.random() - 1 });
                            }
                        }
                        randomize();

                        VizEngine.createSlider(controls, 'N', 5, 50, N, 5, function(v) {
                            N = Math.round(v);
                            randomize();
                            draw();
                        });

                        VizEngine.createButton(controls, 'Randomize', function() {
                            randomize();
                            draw();
                        });

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            viz.screenText('|S(\u03B1)|\u00B2 for N = ' + N + ' random coefficients', viz.width / 2, 18, viz.colors.white, 14);

                            // Compute |S(alpha)|^2 for alpha in [0,1]
                            var steps = 400;
                            var vals = [];
                            var maxVal = 0;
                            for (var i = 0; i <= steps; i++) {
                                var alpha = i / steps;
                                var re = 0, im = 0;
                                for (var n = 0; n < coeffs.length; n++) {
                                    var angle = 2 * Math.PI * (n + 1) * alpha;
                                    re += coeffs[n].re * Math.cos(angle) - coeffs[n].im * Math.sin(angle);
                                    im += coeffs[n].re * Math.sin(angle) + coeffs[n].im * Math.cos(angle);
                                }
                                var v = re * re + im * im;
                                vals.push(v);
                                if (v > maxVal) maxVal = v;
                            }

                            // Compute ||a||^2
                            var normSq = 0;
                            for (var n = 0; n < coeffs.length; n++) {
                                normSq += coeffs[n].re * coeffs[n].re + coeffs[n].im * coeffs[n].im;
                            }

                            // Draw the function
                            var chartLeft = 60, chartRight = 530;
                            var chartBottom = 330, chartTop = 50;
                            var chartW = chartRight - chartLeft;
                            var chartH = chartBottom - chartTop;

                            // Axes
                            ctx.strokeStyle = viz.colors.axis;
                            ctx.lineWidth = 1;
                            ctx.beginPath();
                            ctx.moveTo(chartLeft, chartBottom);
                            ctx.lineTo(chartRight, chartBottom);
                            ctx.stroke();
                            ctx.beginPath();
                            ctx.moveTo(chartLeft, chartBottom);
                            ctx.lineTo(chartLeft, chartTop);
                            ctx.stroke();

                            // X labels
                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '10px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'top';
                            for (var x = 0; x <= 10; x++) {
                                var sx = chartLeft + (x / 10) * chartW;
                                ctx.fillText((x / 10).toFixed(1), sx, chartBottom + 4);
                            }
                            viz.screenText('\u03B1', chartRight + 15, chartBottom, viz.colors.text, 12);

                            // Plot |S(alpha)|^2
                            if (maxVal > 0) {
                                ctx.strokeStyle = viz.colors.blue;
                                ctx.lineWidth = 1.5;
                                ctx.beginPath();
                                for (var i = 0; i <= steps; i++) {
                                    var sx = chartLeft + (i / steps) * chartW;
                                    var sy = chartBottom - (vals[i] / maxVal) * chartH;
                                    if (i === 0) ctx.moveTo(sx, sy); else ctx.lineTo(sx, sy);
                                }
                                ctx.stroke();

                                // Draw the large sieve bound level (N * ||a||^2) / R * delta^{-1}
                                // For Q=5 Farey: R ~ 3Q^2/pi^2, delta = 1/Q^2
                                // Bound per point: (N-1+Q^2)*||a||^2 / R
                                var Qfar = 5;
                                var fareyCount = 0;
                                var totalEnergy = 0;
                                for (var q = 1; q <= Qfar; q++) {
                                    for (var a = 0; a <= q; a++) {
                                        if (gcd(a, q) === 1) {
                                            fareyCount++;
                                            var alpha = a / q;
                                            var idx = Math.round(alpha * steps);
                                            if (idx >= 0 && idx <= steps) totalEnergy += vals[idx];
                                        }
                                    }
                                }
                                function gcd(a, b) { while (b) { var t = b; b = a % b; a = t; } return a; }

                                var bound = (N - 1 + Qfar * Qfar) * normSq;

                                // Display verification
                                viz.screenText('\u2211|S(\u03B1_r)|\u00B2 at F_5 = ' + totalEnergy.toFixed(1), viz.width / 2 - 100, viz.height - 25, viz.colors.orange, 11, 'left');
                                viz.screenText('Bound: (N-1+Q\u00B2)||\u2009a\u2009||\u00B2 = ' + bound.toFixed(1), viz.width / 2 - 100, viz.height - 10, viz.colors.teal, 11, 'left');

                                // Mark Farey points on the plot
                                for (var q = 1; q <= Qfar; q++) {
                                    for (var a = 0; a <= q; a++) {
                                        if (gcd(a, q) === 1) {
                                            var alpha = a / q;
                                            var idx = Math.round(alpha * steps);
                                            if (idx >= 0 && idx <= steps) {
                                                var sx = chartLeft + alpha * chartW;
                                                var sy = chartBottom - (vals[idx] / maxVal) * chartH;
                                                ctx.fillStyle = viz.colors.orange;
                                                ctx.beginPath();
                                                ctx.arc(sx, sy, 3, 0, Math.PI * 2);
                                                ctx.fill();
                                            }
                                        }
                                    }
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
                    question: 'Show that the Farey fractions of order \\(Q\\), i.e., \\(\\{a/q : 1 \\le q \\le Q,\\, 0 \\le a \\le q,\\, \\gcd(a,q) = 1\\}\\), satisfy the well-spacing condition \\(\\|a/q - a\'/q\'\\| \\ge 1/(qQ) \\ge 1/Q^2\\) for distinct fractions \\(a/q \\ne a\'/q\'\\).',
                    hint: 'Use the mediant property of Farey sequences: consecutive Farey fractions \\(a/q\\) and \\(a\'/q\'\\) satisfy \\(|aq\' - a\'q| = 1\\), so \\(|a/q - a\'/q\'| = 1/(qq\')\\). Since \\(q\' \\le Q\\), this gives \\(1/(qQ)\\).',
                    solution: 'For consecutive Farey fractions \\(a/q < a\'/q\'\\) in \\(\\mathcal{F}_Q\\), the mediant property gives \\(a\'q - aq\' = 1\\), so \\(a\'/q\' - a/q = 1/(qq\') \\ge 1/(qQ) \\ge 1/Q^2\\). Since the minimum distance occurs between consecutive fractions, any two distinct Farey fractions are at least \\(1/Q^2\\) apart. Applying this with \\(\\delta = 1/Q^2\\) in the large sieve gives the useful form with \\(N + Q^2\\) on the right side (since \\(N - 1 + Q^2 \\le N + Q^2\\)).'
                },
                {
                    question: 'Let \\(a_n = 1\\) for \\(1 \\le n \\le N\\) and \\(\\alpha = 0\\). Compute \\(|S(0)|^2\\) and compare it with the large sieve bound when \\(R = 1\\).',
                    hint: 'With \\(\\alpha = 0\\), we have \\(S(0) = \\sum_{n=1}^N 1 = N\\). The bound with \\(R=1\\) and any \\(\\delta\\) gives \\((N-1+\\delta^{-1})N\\).',
                    solution: '\\(S(0) = N\\), so \\(|S(0)|^2 = N^2\\). The bound is \\((N - 1 + \\delta^{-1}) \\cdot N\\). For this to be tight, we need \\(N^2 \\le (N-1+\\delta^{-1})N\\), i.e., \\(N \\le N - 1 + \\delta^{-1}\\), i.e., \\(\\delta^{-1} \\ge 1\\). This shows the bound is not tight for a single point (off by a factor \\(\\sim \\delta^{-1}/N\\) for small \\(\\delta\\)), but it becomes meaningful when we sum over many well-spaced points.'
                }
            ]
        },

        // ================================================================
        // SECTION 3: The Multiplicative Large Sieve
        // ================================================================
        {
            id: 'sec-multiplicative-ls',
            title: 'The Multiplicative Large Sieve',
            content: `
<h2>From Additive to Multiplicative</h2>

<div class="env-block intuition">
    <div class="env-title">Characters as Frequencies</div>
    <div class="env-body">
        <p>The additive large sieve bounds exponential sums \\(\\sum a_n e(n\\alpha)\\) at well-spaced \\(\\alpha\\). For number-theoretic applications, we need to bound <em>character sums</em> \\(\\sum a_n \\chi(n)\\) over many characters \\(\\chi \\bmod q\\) and many moduli \\(q\\). The passage from exponentials to characters is natural: a character \\(\\chi \\bmod q\\) is built from additive characters via the discrete Fourier transform on \\((\\mathbb{Z}/q\\mathbb{Z})^\\times\\).</p>
    </div>
</div>

<h3>The Multiplicative Form</h3>

<div class="env-block theorem">
    <div class="env-title">Theorem 13.3 (Multiplicative Large Sieve Inequality)</div>
    <div class="env-body">
        <p>Let \\(a_{M+1}, \\ldots, a_{M+N}\\) be complex numbers. Then</p>
        \\[
        \\sum_{q \\le Q} \\frac{q}{\\varphi(q)} \\sum_{\\substack{\\chi \\bmod q \\\\ \\chi \\text{ primitive}}} \\left| \\sum_{n=M+1}^{M+N} a_n \\chi(n) \\right|^2 \\le (N - 1 + Q^2) \\sum_{n=M+1}^{M+N} |a_n|^2.
        \\]
    </div>
</div>

<p>The proof reduces the multiplicative form to the additive one. Each primitive character \\(\\chi \\bmod q\\) can be expressed via Gauss sums as a linear combination of additive characters \\(e(an/q)\\). Since the Farey fractions \\(a/q\\) with \\(q \\le Q\\) are \\(\\delta\\)-spaced with \\(\\delta = 1/Q^2\\), the additive large sieve applies directly.</p>

<div class="env-block proof">
    <div class="env-title">Proof Sketch</div>
    <div class="env-body">
        <p>For a primitive character \\(\\chi \\bmod q\\), the Gauss sum gives</p>
        \\[
        \\chi(n) = \\frac{1}{\\tau(\\bar{\\chi})} \\sum_{a=1}^{q} \\bar{\\chi}(a)\\, e\\!\\left(\\frac{an}{q}\\right),
        \\]
        <p>where \\(|\\tau(\\chi)|^2 = q\\). Substituting and using \\(|\\tau(\\bar{\\chi})|^2 = q\\):</p>
        \\[
        \\left|\\sum_n a_n \\chi(n)\\right|^2 = \\frac{1}{q} \\left|\\sum_{a=1}^{q} \\bar{\\chi}(a) \\sum_n a_n e(an/q)\\right|^2.
        \\]
        <p>Summing over primitive \\(\\chi \\bmod q\\) and applying the orthogonality of characters, then summing over \\(q \\le Q\\), the problem reduces to bounding \\(\\sum |S(a/q)|^2\\) over Farey fractions, which is exactly the additive large sieve with \\(\\delta = 1/Q^2\\).</p>
    </div>
    <div class="qed">&marker;</div>
</div>

<h3>Application: Bounding Character Sums on Average</h3>

<div class="env-block example">
    <div class="env-title">Example: Primes and Characters</div>
    <div class="env-body">
        <p>Taking \\(a_n = \\Lambda(n)\\) (the von Mangoldt function) for \\(n \\le x\\), the multiplicative large sieve gives</p>
        \\[
        \\sum_{q \\le Q} \\sum_{\\substack{\\chi \\bmod q \\\\ \\chi \\text{ primitive}}} \\left| \\sum_{n \\le x} \\Lambda(n) \\chi(n) \\right|^2 \\ll (x + Q^2) \\cdot x.
        \\]
        <p>For \\(Q \\le \\sqrt{x}\\), this gives \\(O(x^2)\\), consistent with the expectation that character sums \\(\\sum \\Lambda(n)\\chi(n)\\) are \\(O(\\sqrt{x}\\log x)\\) "on average" (which is the GRH prediction for each individual character).</p>
    </div>
</div>

<div class="env-block remark">
    <div class="env-title">The Role of Primitivity</div>
    <div class="env-body">
        <p>The restriction to <em>primitive</em> characters is natural: every Dirichlet character is induced from a unique primitive character. The factor \\(q/\\varphi(q)\\) on the left handles the translation between primitive and all characters modulo \\(q\\). When only primitive characters appear, there is no double-counting from characters of smaller conductor.</p>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-farey-circle"></div>
`,
            visualizations: [
                {
                    id: 'viz-farey-circle',
                    title: 'Farey Fractions on the Unit Circle',
                    description: 'Farey fractions a/q mapped to the unit circle via e(a/q). Colored by denominator q. The additive-to-multiplicative connection: characters mod q correspond to harmonics at these points.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 400, height: 400,
                            originX: 200, originY: 200, scale: 150
                        });

                        var Q = 6;
                        VizEngine.createSlider(controls, 'Q', 2, 15, Q, 1, function(v) {
                            Q = Math.round(v);
                            draw();
                        });

                        function gcd(a, b) { while (b) { var t = b; b = a % b; a = t; } return a; }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            viz.screenText('e(a/q) for q \u2264 ' + Q, viz.width / 2, 18, viz.colors.white, 14);

                            // Draw unit circle
                            viz.drawCircle(0, 0, 1, null, viz.colors.axis + '66', 1);

                            // Collect and draw Farey fractions
                            var colors = [viz.colors.white, viz.colors.blue, viz.colors.teal, viz.colors.orange, viz.colors.purple, viz.colors.green, viz.colors.red, viz.colors.yellow, viz.colors.pink];
                            var count = 0;

                            for (var q = 1; q <= Q; q++) {
                                var col = colors[q % colors.length] || viz.colors.white;
                                for (var a = 0; a < q; a++) {
                                    if (gcd(a, q) !== 1 && a !== 0) continue;
                                    if (a === 0 && q !== 1) continue;

                                    var angle = 2 * Math.PI * a / q;
                                    var x = Math.cos(angle);
                                    var y = Math.sin(angle);
                                    count++;

                                    // Draw point
                                    var r = Math.max(3, 7 - q);
                                    viz.drawPoint(x, y, col, null, r);

                                    // Label
                                    var lx = 1.18 * Math.cos(angle);
                                    var ly = 1.18 * Math.sin(angle);
                                    if (Q <= 10) {
                                        viz.drawText(a + '/' + q, lx, ly, col, 9);
                                    }
                                }
                            }

                            // Draw lines connecting fractions with same q (showing q-th roots structure)
                            for (var q = 2; q <= Math.min(Q, 8); q++) {
                                var col = colors[q % colors.length] + '33';
                                var points = [];
                                for (var a = 0; a < q; a++) {
                                    if (gcd(a, q) === 1) {
                                        points.push(a / q);
                                    }
                                }
                                if (points.length > 1) {
                                    for (var i = 0; i < points.length; i++) {
                                        for (var j = i + 1; j < points.length; j++) {
                                            var a1 = 2 * Math.PI * points[i];
                                            var a2 = 2 * Math.PI * points[j];
                                            viz.drawSegment(Math.cos(a1), Math.sin(a1), Math.cos(a2), Math.sin(a2), col, 0.5);
                                        }
                                    }
                                }
                            }

                            viz.screenText(count + ' points from ' + Q + ' denominators', viz.width / 2, viz.height - 15, viz.colors.text, 10);
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Deduce from the multiplicative large sieve that for \\(Q \\le \\sqrt{N}\\), the average value of \\(\\left|\\sum_{n \\le N} a_n \\chi(n)\\right|^2\\) over primitive characters \\(\\chi\\) with conductor \\(q \\le Q\\) is at most \\(O(N \\sum |a_n|^2 / Q^2)\\).',
                    hint: 'The number of primitive characters with conductor \\(q \\le Q\\) is \\(\\sum_{q \\le Q} \\varphi(q) \\sim 3Q^2/\\pi^2\\). Divide both sides of the multiplicative large sieve by this count.',
                    solution: 'The multiplicative large sieve gives the total sum \\(\\le (N - 1 + Q^2) \\sum |a_n|^2 \\le 2N \\sum |a_n|^2\\) (for \\(Q \\le \\sqrt{N}\\)). The number of primitive characters is \\(\\sum_{q \\le Q} \\varphi(q) \\asymp Q^2\\). Therefore the average is \\(\\le 2N\\sum|a_n|^2 / Q^2 \\asymp N\\sum|a_n|^2/Q^2\\). For \\(a_n = 1\\), this gives an average of \\(O(N^2/Q^2)\\), consistent with square-root cancellation \\(|\\sum \\chi(n)|^2 \\approx N\\) expected from GRH.'
                },
                {
                    question: 'Show that the additive large sieve with \\(\\alpha_r = r/N\\) (\\(r = 0, 1, \\ldots, N-1\\)) and \\(\\delta = 1/N\\) recovers Parseval\'s identity (up to the factor \\(N-1+N = 2N-1\\)).',
                    hint: 'The points \\(r/N\\) are the \\(N\\)-th roots of unity. The sums \\(\\sum a_n e(nr/N)\\) are (up to normalization) the DFT of the sequence. Compare the bound with exact Parseval \\(\\sum |\\hat{a}_r|^2 = N \\sum |a_n|^2\\).',
                    solution: 'With \\(\\alpha_r = r/N\\) for \\(r = 0, \\ldots, N-1\\), the spacing is \\(\\delta = 1/N\\). The large sieve gives \\(\\sum_{r=0}^{N-1} |\\hat{a}(r/N)|^2 \\le (N - 1 + N) \\sum |a_n|^2 = (2N-1)\\sum|a_n|^2\\). The exact Parseval identity gives equality with coefficient \\(N\\) (not \\(2N-1\\)), so the large sieve loses a factor of roughly 2. This is the price of generality: the large sieve works for <em>any</em> well-spaced points, not just the special equally-spaced case where Fourier analysis gives exact orthogonality.'
                }
            ]
        },

        // ================================================================
        // SECTION 4: The Bombieri-Vinogradov Theorem
        // ================================================================
        {
            id: 'sec-bv-theorem',
            title: 'The Bombieri-Vinogradov Theorem',
            content: `
<h2>The Bombieri-Vinogradov Theorem</h2>

<div class="env-block intuition">
    <div class="env-title">GRH for Free (On Average)</div>
    <div class="env-body">
        <p>GRH implies \\(\\psi(x; q, a) = x/\\varphi(q) + O(x^{1/2}\\log^2 x)\\) for every \\(q\\) and every \\(\\gcd(a,q)=1\\). We cannot prove this for individual \\(q\\), but the Bombieri-Vinogradov theorem gives something almost as good: the average error over all \\(q \\le Q\\) is as small as GRH would predict, as long as \\(Q\\) does not exceed \\(\\sqrt{x}\\) (up to logarithmic factors).</p>
    </div>
</div>

<div class="env-block theorem">
    <div class="env-title">Theorem 13.4 (Bombieri-Vinogradov)</div>
    <div class="env-body">
        <p>For any \\(A > 0\\), there exists \\(B = B(A) > 0\\) such that</p>
        \\[
        \\sum_{q \\le Q} \\max_{\\gcd(a,q) = 1} \\left| \\psi(x; q, a) - \\frac{x}{\\varphi(q)} \\right| \\ll_A \\frac{x}{(\\log x)^A}
        \\]
        <p>for \\(Q = x^{1/2} (\\log x)^{-B}\\).</p>
    </div>
</div>

<p>The theorem is sometimes stated with \\(\\max_{y \\le x}\\) on the left, giving a uniform version. The key point: the level of distribution \\(Q \\sim x^{1/2}\\) matches the "square root barrier" of the Riemann Hypothesis.</p>

<h3>Proof Strategy</h3>

<p>The proof combines three ingredients:</p>

<div class="env-block remark">
    <div class="env-title">The Three Pillars</div>
    <div class="env-body">
        <ol>
            <li><strong>Vaughan's identity</strong> (or the Heath-Brown identity): decomposes \\(\\Lambda(n)\\) into convolutions involving shorter sums, reducing the problem to bilinear forms \\(\\sum_{m \\sim M} \\sum_{n \\sim N} a_m b_n\\) with \\(MN \\sim x\\).</li>
            <li><strong>The multiplicative large sieve</strong>: handles the "Type II" sums where both \\(M\\) and \\(N\\) are in an intermediate range.</li>
            <li><strong>The Siegel-Walfisz theorem</strong>: handles the "Type I" sums where one variable is very short (\\(M \\le x^\\epsilon\\)), using individual zero-free regions for \\(L\\)-functions.</li>
        </ol>
    </div>
</div>

<p>The classification into "Type I" and "Type II" sums goes back to Vinogradov. Type I sums have the form \\(\\sum_{m \\le M} a_m \\sum_{n \\le x/m} 1_{n \\equiv a(q)}\\) where \\(M\\) is small, and the inner sum is essentially \\(x/(mq)\\) with a small error. Type II sums \\(\\sum_m a_m \\sum_n b_n 1_{mn \\equiv a(q)}\\) require the large sieve because both sums contribute non-trivially.</p>

<h3>The Level of Distribution</h3>

<div class="env-block definition">
    <div name="env-title">Definition 13.2 (Level of Distribution)</div>
    <div class="env-body">
        <p>We say the primes have <strong>level of distribution</strong> \\(\\theta\\) if for every \\(A > 0\\),</p>
        \\[
        \\sum_{q \\le x^\\theta / (\\log x)^B} \\max_{\\gcd(a,q) = 1} |E(x; q, a)| \\ll_A \\frac{x}{(\\log x)^A}
        \\]
        <p>for some \\(B = B(A)\\).</p>
    </div>
</div>

<p>Bombieri-Vinogradov gives \\(\\theta = 1/2\\). GRH would give \\(\\theta = 1 - \\epsilon\\) for any \\(\\epsilon > 0\\). The Elliott-Halberstam conjecture asserts \\(\\theta = 1 - \\epsilon\\). Any improvement beyond \\(\\theta = 1/2\\), even to \\(\\theta = 1/2 + \\delta\\) for some small \\(\\delta > 0\\), would have dramatic consequences for prime gaps.</p>

<div class="env-block theorem">
    <div class="env-title">Theorem 13.5 (Consequences of Level of Distribution)</div>
    <div class="env-body">
        <p>If the primes have level of distribution \\(\\theta\\):</p>
        <ul>
            <li>\\(\\theta > 1/2\\): bounded prime gaps (Goldston-Pintz-Y\\u0131ld\\u0131r\\u0131m, 2005, conditional; Maynard-Tao, 2013, needs \\(\\theta > 1/2\\) which BV gives marginally).</li>
            <li>\\(\\theta \\ge 1/2\\): Chen's theorem on \\(p + 2\\) being a product of at most 2 primes.</li>
            <li>\\(\\theta = 1 - \\epsilon\\) (Elliott-Halberstam): bounded gaps of size \\(\\le 6\\) (Maynard).</li>
        </ul>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-bv-vs-grh"></div>
`,
            visualizations: [
                {
                    id: 'viz-bv-vs-grh',
                    title: 'Bombieri-Vinogradov vs GRH',
                    description: 'Compare the cumulative error sum(q <= Q) max_a |E(x;q,a)| with the BV bound x/(log x)^A and the GRH prediction. BV matches GRH quality up to Q ~ sqrt(x).',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 380,
                            originX: 60, originY: 340, scale: 1
                        });

                        var xVal = 1000;
                        VizEngine.createSlider(controls, 'x', 200, 5000, xVal, 200, function(v) {
                            xVal = Math.round(v);
                            draw();
                        });

                        function sieveTo(n) {
                            var s = new Uint8Array(n + 1);
                            var primes = [];
                            for (var i = 2; i <= n; i++) {
                                if (!s[i]) { primes.push(i); for (var j = i * i; j <= n; j += i) s[j] = 1; }
                            }
                            return primes;
                        }

                        function eulerPhi(n) {
                            var result = n, m = n;
                            for (var p = 2; p * p <= m; p++) {
                                if (m % p === 0) {
                                    while (m % p === 0) m /= p;
                                    result -= result / p;
                                }
                            }
                            if (m > 1) result -= result / m;
                            return Math.round(result);
                        }

                        function gcd(a, b) { while (b) { var t = b; b = a % b; a = t; } return a; }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var primes = sieveTo(xVal);

                            var sqrtX = Math.sqrt(xVal);
                            var maxQ = Math.min(50, Math.floor(sqrtX * 1.5));

                            // Compute cumulative sum of max errors
                            var cumErrors = [];
                            var cumSum = 0;
                            for (var q = 2; q <= maxQ; q++) {
                                var phi = eulerPhi(q);
                                if (phi === 0) continue;
                                var expected = xVal / phi;
                                var maxErr = 0;
                                for (var a = 1; a < q; a++) {
                                    if (gcd(a, q) !== 1) continue;
                                    var count = 0;
                                    for (var pi = 0; pi < primes.length; pi++) {
                                        var p = primes[pi];
                                        if (p > xVal) break;
                                        if (p % q === a) count += Math.log(p);
                                    }
                                    var err = Math.abs(count - expected);
                                    if (err > maxErr) maxErr = err;
                                }
                                cumSum += maxErr;
                                cumErrors.push({ q: q, cumErr: cumSum });
                            }

                            if (cumErrors.length === 0) return;

                            var chartLeft = 60, chartRight = 520;
                            var chartBottom = 320, chartTop = 50;
                            var chartW = chartRight - chartLeft;
                            var chartH = chartBottom - chartTop;

                            viz.screenText('Cumulative Error vs BV Bound (x = ' + xVal + ')', viz.width / 2, 18, viz.colors.white, 14);

                            // Y scale
                            var maxCum = cumErrors[cumErrors.length - 1].cumErr;
                            var bvBound = xVal / Math.log(xVal);
                            var yMax = Math.max(maxCum, bvBound) * 1.2;

                            // Axes
                            ctx.strokeStyle = viz.colors.axis;
                            ctx.lineWidth = 1;
                            ctx.beginPath(); ctx.moveTo(chartLeft, chartBottom); ctx.lineTo(chartRight, chartBottom); ctx.stroke();
                            ctx.beginPath(); ctx.moveTo(chartLeft, chartBottom); ctx.lineTo(chartLeft, chartTop); ctx.stroke();

                            // X label
                            viz.screenText('Q', chartRight + 10, chartBottom, viz.colors.text, 12);

                            // Mark sqrt(x)
                            var sqrtPos = chartLeft + (sqrtX / maxQ) * chartW;
                            if (sqrtPos < chartRight) {
                                ctx.strokeStyle = viz.colors.yellow + '88';
                                ctx.lineWidth = 1;
                                ctx.setLineDash([4, 4]);
                                ctx.beginPath(); ctx.moveTo(sqrtPos, chartTop); ctx.lineTo(sqrtPos, chartBottom); ctx.stroke();
                                ctx.setLineDash([]);
                                viz.screenText('\u221Ax', sqrtPos, chartTop - 10, viz.colors.yellow, 10);
                            }

                            // Plot cumulative error
                            ctx.strokeStyle = viz.colors.blue;
                            ctx.lineWidth = 2;
                            ctx.beginPath();
                            for (var i = 0; i < cumErrors.length; i++) {
                                var sx = chartLeft + ((cumErrors[i].q - 2) / (maxQ - 2)) * chartW;
                                var sy = chartBottom - (cumErrors[i].cumErr / yMax) * chartH;
                                if (i === 0) ctx.moveTo(sx, sy); else ctx.lineTo(sx, sy);
                            }
                            ctx.stroke();

                            // Plot BV bound (x/(log x)^A, A=1 for display)
                            ctx.strokeStyle = viz.colors.teal;
                            ctx.lineWidth = 2;
                            ctx.setLineDash([6, 4]);
                            var bvY = chartBottom - (bvBound / yMax) * chartH;
                            ctx.beginPath(); ctx.moveTo(chartLeft, bvY); ctx.lineTo(chartRight, bvY); ctx.stroke();
                            ctx.setLineDash([]);

                            // Legend
                            var legY = chartBottom + 20;
                            ctx.fillStyle = viz.colors.blue;
                            ctx.fillRect(chartLeft + 30, legY, 15, 3);
                            viz.screenText('\u2211 max|E(x;q,a)|', chartLeft + 110, legY + 2, viz.colors.blue, 10);

                            ctx.strokeStyle = viz.colors.teal;
                            ctx.setLineDash([6, 4]);
                            ctx.beginPath(); ctx.moveTo(chartLeft + 200, legY + 1); ctx.lineTo(chartLeft + 215, legY + 1); ctx.stroke();
                            ctx.setLineDash([]);
                            viz.screenText('x/(log x)', chartLeft + 275, legY + 2, viz.colors.teal, 10);

                            viz.screenText('BV: cumulative error stays below bound for Q \u2264 \u221Ax', viz.width / 2, viz.height - 10, viz.colors.text, 10);
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Explain why Bombieri-Vinogradov cannot replace GRH in all applications. Give a specific example where one needs an <em>individual</em> bound on \\(E(x; q, a)\\) rather than an average bound.',
                    hint: 'Think about problems where a single specific modulus \\(q\\) is important, not a range of moduli.',
                    solution: 'The least prime in an arithmetic progression \\(a \\bmod q\\) requires an individual bound: GRH gives \\(p_{q,a} \\ll q^{2+\\epsilon}\\), while BV says nothing about any single modulus. Similarly, the Vinogradov ternary Goldbach theorem uses individual zero-free regions (or GRH) for specific \\(L(s,\\chi)\\). BV controls the <em>aggregate</em> error but permits individual errors to be as large as \\(x/\\varphi(q)\\) (the main term), which would make the asymptotic formula vacuous for that particular \\(q\\).'
                },
                {
                    question: 'The Bombieri-Vinogradov theorem gives level of distribution \\(\\theta = 1/2\\). What would level \\(\\theta = 1/2 + 1/584\\) (as established by Zhang 2014 for a restricted version) imply for bounded prime gaps?',
                    hint: 'Zhang\'s breakthrough showed bounded gaps between primes. The key input was a BV-type estimate (with restrictions on the moduli) at level slightly above \\(1/2\\).',
                    solution: 'Zhang (2014) proved that there are infinitely many pairs of primes with gap \\(\\le 7 \\times 10^7\\), using a BV-type estimate with \\(\\theta = 1/2 + 1/584\\) restricted to smooth (or "dense-divisor") moduli. This was sufficient for the GPY sieve method to produce bounded gaps. The restriction to smooth moduli is important: full BV at level \\(\\theta > 1/2\\) (the Elliott-Halberstam conjecture) is much stronger and would give smaller gap bounds. Maynard and Tao subsequently proved bounded gaps using only \\(\\theta = 1/2\\) (standard BV), with bound 600, by a different multidimensional sieve.'
                }
            ]
        },

        // ================================================================
        // SECTION 5: Applications
        // ================================================================
        {
            id: 'sec-applications',
            title: 'Applications',
            content: `
<h2>Applications: Chen's Theorem and Beyond</h2>

<div class="env-block intuition">
    <div class="env-title">What BV Buys Us</div>
    <div class="env-body">
        <p>The Bombieri-Vinogradov theorem is the engine behind many of the deepest results in prime number theory obtained without assuming GRH. Wherever sieve methods need primes to be well-distributed in arithmetic progressions for <em>many</em> moduli simultaneously, BV provides exactly what is needed.</p>
    </div>
</div>

<h3>Chen's Theorem (1966/1973)</h3>

<div class="env-block theorem">
    <div class="env-title">Theorem 13.6 (Chen Jingrun)</div>
    <div class="env-body">
        <p>Every sufficiently large even integer \\(N\\) can be written as</p>
        \\[
        N = p + P_2,
        \\]
        <p>where \\(p\\) is prime and \\(P_2\\) has at most 2 prime factors (counted with multiplicity). Equivalently, every sufficiently large even number is the sum of a prime and a number with at most 2 prime factors.</p>
    </div>
</div>

<p>Chen's theorem is the closest approach to the Goldbach conjecture achieved to date. The proof uses a weighted sieve (a refinement of the Selberg sieve from Chapter 12) combined with a "switching principle," and the Bombieri-Vinogradov theorem is the critical input that makes the sieve estimates sharp enough.</p>

<div class="env-block proof">
    <div class="env-title">Proof Outline</div>
    <div class="env-body">
        <p>Let \\(N\\) be a large even number. Consider the set</p>
        \\[
        \\mathcal{A} = \\{N - p : p \\le N,\\, p \\text{ prime}\\}.
        \\]
        <p>We want to show that \\(\\mathcal{A}\\) contains elements with at most 2 prime factors. The sieve method proceeds in three steps:</p>
        <ol>
            <li><strong>Lower bound sieve:</strong> Use a lower-bound sieve (Rosser-Iwaniec type) to show that \\(\\mathcal{A}\\) contains many elements not divisible by any prime \\(p \\le N^{1/3}\\).</li>
            <li><strong>Switching principle:</strong> Elements of \\(\\mathcal{A}\\) that avoid primes up to \\(N^{1/3}\\) are either prime, a product of two primes, or a product of three primes \\(> N^{1/3}\\).</li>
            <li><strong>Upper bound sieve:</strong> Use the Selberg upper bound sieve to bound the count of elements that are products of three primes. This upper bound is smaller than the lower bound from step 1, leaving room for primes and semiprimes.</li>
        </ol>
        <p>Each step requires estimates for \\(\\pi(x; q, a)\\) uniformly over \\(q \\le \\sqrt{N}/\\log^B N\\), which is exactly what Bombieri-Vinogradov provides.</p>
    </div>
    <div class="qed">&marker;</div>
</div>

<h3>Other Applications</h3>

<div class="env-block example">
    <div class="env-title">Titchmarsh Divisor Problem</div>
    <div class="env-body">
        <p>For primes \\(p \\le x\\), one has</p>
        \\[
        \\sum_{p \\le x} d(p - 1) \\sim C \\cdot \\frac{x}{\\log x} \\cdot \\log x = Cx,
        \\]
        <p>where \\(C = \\prod_p (1 - 1/(p(p-1)))\\). The proof uses BV to handle the distribution of primes \\(p \\equiv 1 \\pmod{d}\\) for many moduli \\(d\\) simultaneously.</p>
    </div>
</div>

<div class="env-block example">
    <div class="env-title">Primes Represented by Polynomials</div>
    <div class="env-body">
        <p>Iwaniec (1978) used the large sieve and BV-type estimates to prove that there are infinitely many \\(n\\) such that \\(n^2 + 1\\) has at most 2 prime factors. The key: reducing the problem to counting primes in arithmetic progressions modulo \\(d\\) for many values of \\(d\\).</p>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-chen-setup"></div>
`,
            visualizations: [
                {
                    id: 'viz-chen-setup',
                    title: 'Chen\'s Theorem: Goldbach Representations',
                    description: 'For even N, show representations N = p + m where m has few prime factors. Blue dots: m is prime (Goldbach). Orange: m has 2 prime factors (Chen). Gray: m has 3+ factors. Chen proved the blue+orange count is always positive for large N.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 380,
                            originX: 0, originY: 0, scale: 1
                        });

                        var N = 100;
                        VizEngine.createSlider(controls, 'N (even)', 20, 200, N, 2, function(v) {
                            N = Math.round(v);
                            if (N % 2 !== 0) N++;
                            draw();
                        });

                        function sieveTo(n) {
                            var s = new Uint8Array(n + 1);
                            var primes = [];
                            for (var i = 2; i <= n; i++) {
                                if (!s[i]) { primes.push(i); for (var j = i * i; j <= n; j += i) s[j] = 1; }
                            }
                            return primes;
                        }

                        function countPrimeFactors(n) {
                            if (n <= 1) return 0;
                            var count = 0;
                            for (var p = 2; p * p <= n; p++) {
                                while (n % p === 0) { count++; n /= p; }
                            }
                            if (n > 1) count++;
                            return count;
                        }

                        function isPrime(n) {
                            if (n < 2) return false;
                            if (n < 4) return true;
                            if (n % 2 === 0 || n % 3 === 0) return false;
                            for (var i = 5; i * i <= n; i += 6) {
                                if (n % i === 0 || n % (i + 2) === 0) return false;
                            }
                            return true;
                        }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            viz.screenText('Representations ' + N + ' = p + m', viz.width / 2, 20, viz.colors.white, 14);

                            // Find all representations
                            var reps = [];
                            var primes = sieveTo(N);
                            for (var i = 0; i < primes.length; i++) {
                                var p = primes[i];
                                if (p >= N) break;
                                var m = N - p;
                                if (m < 2) continue;
                                var omega = countPrimeFactors(m);
                                reps.push({ p: p, m: m, omega: omega });
                            }

                            if (reps.length === 0) {
                                viz.screenText('No representations found', viz.width / 2, viz.height / 2, viz.colors.text, 14);
                                return;
                            }

                            // Layout as grid
                            var cols = Math.min(Math.ceil(Math.sqrt(reps.length * 2)), 15);
                            var rows = Math.ceil(reps.length / cols);
                            var cellW = Math.min(35, (viz.width - 40) / cols);
                            var cellH = Math.min(30, (viz.height - 120) / rows);
                            var startX = (viz.width - cols * cellW) / 2;
                            var startY = 50;

                            var goldbach = 0, chen = 0, other = 0;

                            for (var i = 0; i < reps.length; i++) {
                                var r = reps[i];
                                var row = Math.floor(i / cols);
                                var col = i % cols;
                                var px = startX + col * cellW + cellW / 2;
                                var py = startY + row * cellH + cellH / 2;

                                var color;
                                if (r.omega === 1) { color = viz.colors.blue; goldbach++; }
                                else if (r.omega === 2) { color = viz.colors.orange; chen++; }
                                else { color = viz.colors.text + '44'; other++; }

                                // Draw dot
                                ctx.fillStyle = color;
                                ctx.beginPath();
                                ctx.arc(px, py, Math.min(10, cellW / 2 - 2), 0, Math.PI * 2);
                                ctx.fill();

                                // Label p inside
                                ctx.fillStyle = r.omega <= 2 ? '#000' : viz.colors.text;
                                ctx.font = (cellW < 20 ? '7' : '8') + 'px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.textBaseline = 'middle';
                                ctx.fillText(r.p.toString(), px, py);
                            }

                            // Summary
                            var sumY = Math.min(startY + rows * cellH + 20, viz.height - 60);

                            ctx.fillStyle = viz.colors.blue;
                            ctx.beginPath(); ctx.arc(100, sumY, 6, 0, Math.PI * 2); ctx.fill();
                            viz.screenText('p + prime: ' + goldbach, 170, sumY, viz.colors.blue, 12, 'left');

                            ctx.fillStyle = viz.colors.orange;
                            ctx.beginPath(); ctx.arc(250, sumY, 6, 0, Math.PI * 2); ctx.fill();
                            viz.screenText('p + P\u2082: ' + chen, 320, sumY, viz.colors.orange, 12, 'left');

                            ctx.fillStyle = viz.colors.text + '44';
                            ctx.beginPath(); ctx.arc(380, sumY, 6, 0, Math.PI * 2); ctx.fill();
                            viz.screenText('p + P\u2083\u208A: ' + other, 440, sumY, viz.colors.text, 12, 'left');

                            viz.screenText('Chen: blue + orange > 0 for all large even N', viz.width / 2, viz.height - 15, viz.colors.teal, 11);
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Why does Chen\'s sieve need the level of distribution to be at least \\(1/2\\)? Sketch the sieve dimension argument.',
                    hint: 'The sieve of dimension \\(\\kappa\\) can prove results about \\(P_{r}\\) (numbers with at most \\(r\\) prime factors) when \\(r > \\kappa\\). For the Goldbach problem, \\(\\kappa = 1\\) (linear sieve), so one can reach \\(P_2\\). But the sieve needs remainder terms to be controlled up to level \\(D \\sim x^{1/2}\\).',
                    solution: 'Chen\'s proof uses a weighted linear sieve (\\(\\kappa = 1\\)) on the set \\(\\mathcal{A} = \\{N - p : p \\le N\\}\\). The sieve parameter \\(D\\) must satisfy \\(D^2 \\lesssim N\\) for the linear sieve to work, giving \\(D \\sim N^{1/2}\\). The remainder terms in the sieve involve \\(\\sum_{d \\le D} |r_d|\\) where \\(r_d\\) encodes the error in counting primes \\(p \\equiv N \\pmod{d}\\). This is exactly the sum that BV controls at level \\(Q \\sim N^{1/2}\\). If we only had level \\(\\theta < 1/2\\), the sieve could only take \\(D \\sim N^{\\theta}\\), which is too small for the sieve to produce \\(P_2\\) results.'
                },
                {
                    question: 'Use the Bombieri-Vinogradov theorem to show that \\(\\sum_{q \\le \\sqrt{x}/\\log^B x} \\left|\\pi(x; q, 1) - \\frac{\\mathrm{li}(x)}{\\varphi(q)}\\right| \\ll \\frac{x}{(\\log x)^A}\\).',
                    hint: 'The passage from \\(\\psi(x; q, a)\\) to \\(\\pi(x; q, a)\\) uses partial summation: \\(\\pi(x; q, a) = \\psi(x; q, a)/\\log x + O(\\sqrt{x}/\\log x)\\). The error from prime powers is negligible.',
                    solution: 'By partial summation, \\(\\pi(x; q, a) = \\int_2^x \\frac{d\\psi(t;q,a)}{\\log t}\\). Using \\(\\psi(x;q,a) = x/\\varphi(q) + E(x;q,a)\\), we get \\(\\pi(x;q,a) = \\mathrm{li}(x)/\\varphi(q) + \\int_2^x dE(t;q,a)/\\log t\\). Integration by parts gives \\(|\\pi(x;q,a) - \\mathrm{li}(x)/\\varphi(q)| \\ll |E(x;q,a)|/\\log x + \\int_2^x |E(t;q,a)|/(t\\log^2 t)\\,dt\\). Summing over \\(q \\le Q\\) and applying BV at each \\(t\\) gives the result. The key: BV with \\(\\psi\\) transfers cleanly to \\(\\pi\\) via partial summation.'
                },
                {
                    question: 'Suppose the Elliott-Halberstam conjecture holds (\\(\\theta = 1 - \\epsilon\\)). Show that the GPY method gives bounded gaps between primes without any additional input.',
                    hint: 'In the GPY framework, one needs \\(\\theta > 1/2\\) plus a specific constant. With full EH (\\(\\theta = 1\\)), the "narrow admissible tuple" can be taken with very few elements.',
                    solution: 'The GPY (Goldston-Pintz-Y\\u0131ld\\u0131r\\u0131m) method shows that if the primes have level of distribution \\(\\theta\\), then \\(\\liminf (p_{n+1} - p_n) \\le C(\\theta)\\) for a constant depending on \\(\\theta\\). For \\(\\theta > 1/2\\), GPY proved \\(\\liminf (p_{n+1}-p_n)/\\log p_n = 0\\) (small gaps). Under full EH (\\(\\theta = 1-\\epsilon\\)), one can take admissible \\(k\\)-tuples in an interval of length \\(O(k \\log k)\\) with \\(k\\) chosen to satisfy the sieve conditions, obtaining gaps bounded by a fixed constant. Maynard showed that under EH, \\(\\liminf (p_{n+1} - p_n) \\le 6\\).'
                }
            ]
        },

        // ================================================================
        // SECTION 6: Bridge to What Comes Next
        // ================================================================
        {
            id: 'sec-bridge',
            title: 'Bridge: Beyond the Square Root Barrier',
            content: `
<h2>Bridge: Beyond the Square Root Barrier</h2>

<div class="env-block intuition">
    <div class="env-title">Where We Stand</div>
    <div class="env-body">
        <p>We have traversed the sieve landscape: from Eratosthenes' elementary idea (Chapter 11) through Selberg's optimization (Chapter 12) to the large sieve's analytic power (this chapter). The Bombieri-Vinogradov theorem, our crowning achievement, gives GRH-quality estimates on average, enabling results like Chen's theorem without assuming any unproven hypothesis.</p>
    </div>
</div>

<h3>What We Achieved</h3>

<p>The journey through Part E (Sieve Methods) can be summarized as a progression of barriers overcome:</p>

<table style="width:100%; border-collapse: collapse; margin: 1em 0;">
<thead>
<tr style="border-bottom: 2px solid #30363d;">
    <th style="text-align:left; padding: 6px;">Result</th>
    <th style="text-align:left; padding: 6px;">Method</th>
    <th style="text-align:left; padding: 6px;">Level of Distribution Used</th>
</tr>
</thead>
<tbody>
<tr style="border-bottom: 1px solid #21262d;">
    <td style="padding: 6px;">\\(\\pi(x) \\ll x/\\log x\\) (upper bound)</td>
    <td style="padding: 6px;">Brun's sieve (Ch 11)</td>
    <td style="padding: 6px;">Not needed</td>
</tr>
<tr style="border-bottom: 1px solid #21262d;">
    <td style="padding: 6px;">Twin prime \\(P_2\\) (upper bound)</td>
    <td style="padding: 6px;">Selberg sieve (Ch 12)</td>
    <td style="padding: 6px;">Not needed</td>
</tr>
<tr style="border-bottom: 1px solid #21262d;">
    <td style="padding: 6px;">Chen's theorem: \\(N = p + P_2\\)</td>
    <td style="padding: 6px;">Weighted sieve + BV (Ch 13)</td>
    <td style="padding: 6px;">\\(\\theta = 1/2\\) (BV)</td>
</tr>
<tr style="border-bottom: 1px solid #21262d;">
    <td style="padding: 6px;">Bounded prime gaps</td>
    <td style="padding: 6px;">Maynard-Tao sieve + BV</td>
    <td style="padding: 6px;">\\(\\theta = 1/2\\) (BV)</td>
</tr>
<tr>
    <td style="padding: 6px;">Gap \\(\\le 6\\)?</td>
    <td style="padding: 6px;">Would need EH</td>
    <td style="padding: 6px;">\\(\\theta = 1 - \\epsilon\\)</td>
</tr>
</tbody>
</table>

<h3>The \\(\\sqrt{x}\\) Barrier</h3>

<p>The Bombieri-Vinogradov theorem works up to \\(Q \\sim \\sqrt{x}\\). This is not a limitation of the proof method; it reflects a fundamental connection to the Riemann Hypothesis. The large sieve naturally pairs with the square root: \\(\\delta^{-1} = Q^2\\), and the inequality \\(N + Q^2 \\sim x\\) is balanced when \\(Q \\sim \\sqrt{x}\\).</p>

<p>Breaking this barrier, even slightly, has profound consequences. Zhang's 2014 result used a BV-type estimate at level \\(\\theta = 1/2 + 1/584\\) (restricted to smooth moduli) to prove bounded prime gaps for the first time.</p>

<h3>What Comes Next</h3>

<p>Part F (Advanced Methods) develops the tools that complement and extend sieve methods:</p>

<div class="env-block remark">
    <div class="env-title">The Road Ahead</div>
    <div class="env-body">
        <ul>
            <li><strong>Chapter 14 (Exponential Sums):</strong> The methods of Weyl and Vinogradov for bounding \\(\\sum e(f(n))\\) provide the key estimates for Type I and Type II sums that appear in BV-type arguments. Deeper exponential sum estimates can push the level of distribution beyond \\(1/2\\) for restricted classes of moduli.</li>
            <li><strong>Chapter 15 (The Circle Method):</strong> Hardy, Littlewood, and Ramanujan's approach to additive problems (Goldbach, Waring) uses exponential sums on major and minor arcs. The large sieve naturally complements the minor arc analysis.</li>
            <li><strong>Chapter 16 (Zeros of L-Functions):</strong> The zero-density estimates \\(N(\\sigma, T; \\chi)\\) provide a more refined alternative to BV for some applications. The connection: BV can be deduced from Halasz-type mean value estimates for Dirichlet polynomials, which are closely related to zero-density theorems.</li>
        </ul>
    </div>
</div>

<p>The large sieve is not merely a technique; it is a <em>philosophy</em>. In analysis, we often cannot control individual terms, but we can control averages. The passage from individual to average, from pointwise to \\(L^2\\), is a theme that runs through all of modern analytic number theory.</p>

<div class="viz-placeholder" data-viz="viz-bv-histogram-summary"></div>
`,
            visualizations: [],
            exercises: [
                {
                    question: 'Summarize the logical dependencies: which results from earlier chapters does the proof of Bombieri-Vinogradov require?',
                    hint: 'Think about what tools the proof uses: Vaughan\'s identity (related to Chapter 2), the multiplicative large sieve (this chapter), Siegel-Walfisz (Chapter 10), and character sums (Chapter 9).',
                    solution: 'The proof of BV requires: (1) <strong>Dirichlet characters and orthogonality</strong> (Chapter 9) for the reduction to character sums; (2) <strong>The Siegel-Walfisz theorem</strong> (Chapter 10) to handle Type I sums where one variable is short; (3) <strong>Vaughan\'s identity</strong> (variant of ideas from Chapter 2 on arithmetic functions) for the decomposition \\(\\Lambda = \\mu * \\log\\) and the resulting bilinear structure; (4) <strong>The multiplicative large sieve</strong> (this chapter, Section 3) for the Type II estimates. The zero-free region for \\(L(s,\\chi)\\) from Chapter 6 also enters via Siegel-Walfisz.'
                },
                {
                    question: 'Prove that the "dual" of Bombieri-Vinogradov, i.e., controlling \\(\\sum_{a \\le q} |E(x;q,a)|\\) for a fixed \\(q\\), is essentially the Barban-Davenport-Halberstam theorem: \\(\\sum_{q \\le Q} \\sum_{\\gcd(a,q)=1} |E(x;q,a)|^2 \\ll xQ \\log x\\). State this precisely and explain why the \\(L^2\\) version is easier than the \\(L^1\\) version (BV).',
                    hint: 'Barban-Davenport-Halberstam follows almost directly from the large sieve and Parseval over characters. BV requires additionally Vaughan\'s identity and the Siegel-Walfisz theorem because it controls the \\(L^1\\)-norm (maximum over \\(a\\)), not just the \\(L^2\\)-norm.',
                    solution: 'The Barban-Davenport-Halberstam theorem states: \\(\\sum_{q \\le Q} \\sum_{\\gcd(a,q)=1} |\\psi(x;q,a) - x/\\varphi(q)|^2 \\ll xQ\\log x\\) for \\(Q \\le x\\). This follows from the orthogonality relation \\(\\sum_a |E(x;q,a)|^2 = \\sum_{\\chi \\ne \\chi_0} |\\sum_{n \\le x} \\Lambda(n)\\chi(n)|^2 / \\varphi(q)^2\\) and the large sieve bound on character sums. The \\(L^2\\) norm is easier because: (a) orthogonality converts it to character sums directly; (b) the large sieve bounds \\(L^2\\) norms by design. BV controls the harder \\(L^1\\) norm (actually \\(\\max_a\\) then \\(\\ell^1\\) over \\(q\\)), requiring Cauchy-Schwarz plus additional combinatorial decomposition (Vaughan/Heath-Brown) to close the argument.'
                }
            ]
        }
    ]
});
