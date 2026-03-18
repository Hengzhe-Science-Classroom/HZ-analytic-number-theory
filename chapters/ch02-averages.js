window.CHAPTERS = window.CHAPTERS || [];
window.CHAPTERS.push({
    id: 'ch02',
    number: 2,
    title: 'Averages of Arithmetic Functions',
    subtitle: 'Smoothing the chaos to reveal the pattern',
    sections: [

        // ================================================================
        // SECTION 1: Why Averages?
        // ================================================================
        {
            id: 'sec-motivation',
            title: 'Why Averages?',
            content: `
<h2>Why Averages?</h2>

<div class="env-block intuition">
    <div class="env-title">The Central Paradox</div>
    <div class="env-body">
        <p>The divisor function \\(d(n)\\) counts how many positive integers divide \\(n\\). At \\(n = 2^{20} = 1048576\\) it equals 21. At \\(n = 2^{20} - 1 = 1048575\\), which equals \\(3 \\cdot 5 \\cdot 25 \\cdot 43 \\cdot 65 \\cdot 127\\), the count is much larger. Neighboring values behave completely differently. Yet if you average \\(d(1), d(2), \\ldots, d(N)\\), the result converges to \\(\\log N\\) with stunning precision.</p>
        <p><strong>Lesson:</strong> individual values are wild, but the average is tame. Analytic number theory exploits this.</p>
    </div>
</div>

<p>Arithmetic functions such as \\(d(n)\\), \\(\\phi(n)\\), and \\(\\Lambda(n)\\) oscillate wildly as \\(n\\) varies. Trying to understand them pointwise is hopeless in general. The breakthrough insight, going back to Dirichlet and Chebyshev, is to study <em>summatory functions</em>:</p>

\\[
D(x) = \\sum_{n \\le x} d(n), \\quad \\Phi(x) = \\sum_{n \\le x} \\phi(n), \\quad \\Psi(x) = \\sum_{n \\le x} \\Lambda(n).
\\]

<p>These partial sums smooth out local fluctuations. Their asymptotics encode deep information about the primes.</p>

<h3>Average Order</h3>

<div class="env-block definition">
    <div class="env-title">Definition 2.1 (Average Order)</div>
    <div class="env-body">
        <p>An arithmetic function \\(f\\) has <strong>average order</strong> \\(g(n)\\) if</p>
        \\[\\sum_{n \\le x} f(n) \\sim \\sum_{n \\le x} g(n) \\quad \\text{as } x \\to \\infty.\\]
        <p>Equivalently, \\(\\frac{1}{x} \\sum_{n \\le x} f(n) \\sim \\frac{1}{x} \\sum_{n \\le x} g(n)\\).</p>
    </div>
</div>

<p>The table below records the average orders we will establish in this chapter.</p>

<table style="width:100%;border-collapse:collapse;margin:1.2em 0;">
    <thead>
        <tr style="border-bottom:1px solid #30363d;">
            <th style="text-align:left;padding:6px 10px;color:#8b949e;">Function</th>
            <th style="text-align:left;padding:6px 10px;color:#8b949e;">Average Order</th>
            <th style="text-align:left;padding:6px 10px;color:#8b949e;">Result</th>
        </tr>
    </thead>
    <tbody>
        <tr style="border-bottom:1px solid #21262d;">
            <td style="padding:6px 10px;">\\(d(n)\\)</td>
            <td style="padding:6px 10px;">\\(\\log n\\)</td>
            <td style="padding:6px 10px;">Dirichlet 1849</td>
        </tr>
        <tr style="border-bottom:1px solid #21262d;">
            <td style="padding:6px 10px;">\\(\\phi(n)\\)</td>
            <td style="padding:6px 10px;">\\(\\frac{6}{{\\pi^2}} n\\)</td>
            <td style="padding:6px 10px;">\\(\\Phi(x) \\sim \\frac{3x^2}{\\pi^2}\\)</td>
        </tr>
        <tr style="border-bottom:1px solid #21262d;">
            <td style="padding:6px 10px;">\\(\\sigma(n)\\)</td>
            <td style="padding:6px 10px;">\\(\\frac{\\pi^2}{6} n\\)</td>
            <td style="padding:6px 10px;">\\(\\Sigma(x) \\sim \\frac{\\pi^2 x^2}{12}\\)</td>
        </tr>
        <tr>
            <td style="padding:6px 10px;">\\(\\Lambda(n)\\)</td>
            <td style="padding:6px 10px;">1</td>
            <td style="padding:6px 10px;">\\(\\Psi(x) \\sim x\\) (PNT)</td>
        </tr>
    </tbody>
</table>

<div class="viz-placeholder" data-viz="viz-running-averages"></div>

<div class="env-block remark">
    <div class="env-title">Why the Average of \\(\\Lambda(n)\\) is so Deep</div>
    <div class="env-body">
        <p>That \\(\\Psi(x) \\sim x\\) is equivalent to the Prime Number Theorem. Chebyshev proved in 1852 that \\(\\Psi(x) \\asymp x\\) (within constant multiples), but the exact asymptotic \\(\\Psi(x)/x \\to 1\\) waited until Hadamard and de la Vallee Poussin in 1896. We will revisit this in Chapter 7.</p>
    </div>
</div>
`,
            visualizations: [
                {
                    id: 'viz-running-averages',
                    title: 'Running Averages of Arithmetic Functions',
                    description: 'The running average (1/x) sum_{n<=x} f(n) for d(n), phi(n)/n, and Lambda(n). Each converges to its average order. Toggle functions with the buttons.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, { width: 600, height: 340, originX: 60, originY: 300, scale: 1 });
                        var N = 200;

                        // Precompute number-theoretic functions up to N
                        function computeAll(limit) {
                            var d = new Array(limit + 1).fill(1);
                            var phi = new Array(limit + 1);
                            var lam = new Array(limit + 1).fill(0);
                            for (var i = 0; i <= limit; i++) phi[i] = i;

                            for (var p = 2; p <= limit; p++) {
                                if (phi[p] === p) { // p is prime
                                    for (var m = p; m <= limit; m += p) {
                                        phi[m] -= phi[m] / p;
                                        d[m]++;
                                    }
                                    for (var pk = p; pk <= limit; pk *= p) {
                                        for (var m2 = pk; m2 <= limit; m2 += pk) {
                                            lam[m2] = Math.log(p);
                                        }
                                    }
                                }
                            }
                            // Proper divisor count: initialize to 0 and count properly
                            var dc = new Array(limit + 1).fill(0);
                            for (var k = 1; k <= limit; k++) {
                                for (var m3 = k; m3 <= limit; m3 += k) dc[m3]++;
                            }
                            return { d: dc, phi: phi, lam: lam };
                        }

                        var data = computeAll(N);
                        var showD = true, showPhi = true, showLam = true;

                        var btnD = VizEngine.createButton(controls, 'd(n): avg ~ log n', function() { showD = !showD; btnD.style.opacity = showD ? '1' : '0.4'; draw(); });
                        var btnPhi = VizEngine.createButton(controls, 'phi(n)/n: avg ~ 6/pi^2', function() { showPhi = !showPhi; btnPhi.style.opacity = showPhi ? '1' : '0.4'; draw(); });
                        var btnLam = VizEngine.createButton(controls, 'Lambda(n): avg ~ 1', function() { showLam = !showLam; btnLam.style.opacity = showLam ? '1' : '0.4'; draw(); });
                        controls.style.gap = '6px';

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var W = viz.width, H = viz.height;
                            var padL = 60, padR = 20, padT = 28, padB = 36;
                            var chartW = W - padL - padR, chartH = H - padT - padB;

                            // Axes
                            ctx.strokeStyle = viz.colors.axis; ctx.lineWidth = 1.5;
                            ctx.beginPath(); ctx.moveTo(padL, padT); ctx.lineTo(padL, padT + chartH); ctx.lineTo(padL + chartW, padT + chartH); ctx.stroke();

                            // Y labels
                            ctx.fillStyle = viz.colors.text; ctx.font = '10px -apple-system,sans-serif'; ctx.textAlign = 'right';
                            var yMax = 6;
                            for (var yv = 0; yv <= yMax; yv++) {
                                var sy = padT + chartH - (yv / yMax) * chartH;
                                ctx.fillText(yv.toString(), padL - 5, sy + 4);
                                ctx.strokeStyle = viz.colors.grid; ctx.lineWidth = 0.5;
                                ctx.beginPath(); ctx.moveTo(padL, sy); ctx.lineTo(padL + chartW, sy); ctx.stroke();
                            }
                            // X labels
                            ctx.textAlign = 'center'; ctx.textBaseline = 'top';
                            for (var xv = 0; xv <= N; xv += 50) {
                                var sx = padL + (xv / N) * chartW;
                                ctx.fillStyle = viz.colors.text; ctx.font = '10px -apple-system,sans-serif';
                                ctx.fillText(xv.toString(), sx, padT + chartH + 5);
                            }

                            function plotRunningAvg(arr, scaleY, color, refFn) {
                                // Draw reference line
                                ctx.strokeStyle = color + '55'; ctx.lineWidth = 1; ctx.setLineDash([4, 4]);
                                ctx.beginPath();
                                for (var n = 2; n <= N; n++) {
                                    var ref = refFn(n);
                                    var rx = padL + ((n) / N) * chartW;
                                    var ry = padT + chartH - Math.min((ref / yMax) * chartH, chartH);
                                    if (n === 2) ctx.moveTo(rx, ry); else ctx.lineTo(rx, ry);
                                }
                                ctx.stroke(); ctx.setLineDash([]);

                                // Draw running average
                                ctx.strokeStyle = color; ctx.lineWidth = 2;
                                ctx.beginPath();
                                var sum = 0;
                                for (var n = 1; n <= N; n++) {
                                    sum += arr[n] * scaleY;
                                    var avg = sum / n;
                                    var px = padL + (n / N) * chartW;
                                    var py = padT + chartH - Math.min((avg / yMax) * chartH, chartH);
                                    if (n === 1) ctx.moveTo(px, py); else ctx.lineTo(px, py);
                                }
                                ctx.stroke();
                            }

                            if (showD) plotRunningAvg(data.d, 1, viz.colors.blue, function(n) { return Math.log(n); });
                            if (showPhi) plotRunningAvg(data.phi, 1 / 1, viz.colors.teal, function(n) { return (6 / (Math.PI * Math.PI)) * n / n * n; });
                            if (showLam) plotRunningAvg(data.lam, 1, viz.colors.orange, function(_n) { return 1; });

                            // Legend
                            var legItems = [];
                            if (showD) legItems.push({ color: viz.colors.blue, label: 'avg d(n) \u2192 log n' });
                            if (showPhi) legItems.push({ color: viz.colors.teal, label: 'avg \u03c6(n)/n \u2192 6/\u03c6\u00b2' });
                            if (showLam) legItems.push({ color: viz.colors.orange, label: 'avg \u039b(n) \u2192 1' });
                            legItems.forEach(function(it, i) {
                                ctx.fillStyle = it.color; ctx.fillRect(padL + 10 + i * 160, padT + 8, 20, 3);
                                ctx.fillStyle = viz.colors.text; ctx.font = '11px -apple-system,sans-serif'; ctx.textAlign = 'left';
                                ctx.fillText(it.label, padL + 34 + i * 160, padT + 13);
                            });
                            ctx.fillStyle = viz.colors.text; ctx.font = '11px -apple-system,sans-serif'; ctx.textAlign = 'center';
                            ctx.fillText('n', padL + chartW / 2, padT + chartH + 22);
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Show that \\(d(n) \\ge 1\\) for all \\(n \\ge 1\\), and that \\(d(n) = 2\\) if and only if \\(n\\) is prime. What is \\(d(1)\\)?',
                    hint: 'Every \\(n\\) is divisible by 1 and by itself. When are those the only divisors?',
                    solution: '\\(d(n) \\ge 1\\) because 1 always divides \\(n\\). \\(d(1) = 1\\) since only 1 divides 1. \\(d(n) = 2\\) iff the only divisors are 1 and \\(n\\), i.e., iff \\(n\\) is prime.'
                }
            ]
        },

        // ================================================================
        // SECTION 2: Summatory Functions
        // ================================================================
        {
            id: 'sec-summatory',
            title: 'Summatory Functions',
            content: `
<h2>Summatory Functions</h2>

<p>For an arithmetic function \\(f\\), define its <em>summatory function</em></p>

\\[F(x) = \\sum_{n \\le x} f(n).\\]

<p>The floor function \\(\\lfloor x \\rfloor\\) is the largest integer \\(\\le x\\). We write \\(\\{x\\} = x - \\lfloor x \\rfloor\\) for the fractional part.</p>

<h3>The Divisor Sum \\(D(x)\\)</h3>

<div class="env-block theorem">
    <div class="env-title">Theorem 2.1 (Dirichlet, 1849)</div>
    <div class="env-body">
        <p>For \\(x \\ge 1\\),</p>
        \\[D(x) := \\sum_{n \\le x} d(n) = x \\log x + (2\\gamma - 1)x + O(\\sqrt{x}),\\]
        <p>where \\(\\gamma = 0.5772\\ldots\\) is the Euler-Mascheroni constant.</p>
    </div>
</div>

<p>The proof uses the hyperbola method and will occupy Section 5. For now, observe that the leading term \\(x \\log x\\) confirms that the average order of \\(d(n)\\) is \\(\\log n\\).</p>

<h3>Euler's Totient Sum \\(\\Phi(x)\\)</h3>

<div class="env-block theorem">
    <div class="env-title">Theorem 2.2</div>
    <div class="env-body">
        \\[\\Phi(x) := \\sum_{n \\le x} \\phi(n) = \\frac{3x^2}{\\pi^2} + O(x \\log x).\\]
    </div>
</div>

<p><strong>Proof sketch.</strong> Use the identity \\(\\phi(n) = \\sum_{d \\mid n} \\mu(d) \\cdot (n/d)\\) and Mobius inversion. Alternatively, note that \\(\\Phi(x) = \\frac{1}{2}\\left(1 + \\sum_{n \\le x} \\mu(n) \\lfloor x/n \\rfloor (\\lfloor x/n \\rfloor + 1)\\right)\\) and use \\(\\sum \\mu(n)/n^2 = 6/\\pi^2\\).</p>

<h3>Chebyshev's \\(\\Psi(x)\\)</h3>

<div class="env-block definition">
    <div class="env-title">Definition 2.2 (Chebyshev's Psi)</div>
    <div class="env-body">
        <p>The von Mangoldt function is</p>
        \\[\\Lambda(n) = \\begin{cases} \\log p & \\text{if } n = p^k \\text{ for some prime } p, k \\ge 1, \\\\ 0 & \\text{otherwise.} \\end{cases}\\]
        <p>Chebyshev's second function is \\(\\Psi(x) = \\sum_{n \\le x} \\Lambda(n) = \\sum_{p^k \\le x} \\log p.\\)</p>
    </div>
</div>

<p>The connection to primes is made precise by</p>

\\[\\Psi(x) = \\sum_{p \\le x} \\log p + \\sum_{p^2 \\le x} \\log p + \\cdots = \\theta(x) + \\theta(x^{1/2}) + \\theta(x^{1/3}) + \\cdots,\\]

<p>where \\(\\theta(x) = \\sum_{p \\le x} \\log p\\). Since \\(\\theta(x^{1/k}) = 0\\) for \\(x^{1/k} < 2\\), the sum is finite. It follows that \\(\\Psi(x) \\sim x \\Leftrightarrow \\theta(x) \\sim x \\Leftrightarrow \\pi(x) \\sim x/\\log x\\) (the PNT).</p>

<div class="viz-placeholder" data-viz="viz-psi-chebyshev"></div>
`,
            visualizations: [
                {
                    id: 'viz-psi-chebyshev',
                    title: 'Chebyshev\'s Psi(x) vs x',
                    description: 'Plot of Psi(x) and the comparison line y = x. The ratio Psi(x)/x hovering near 1 is a harbinger of the Prime Number Theorem.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, { width: 600, height: 320, originX: 60, originY: 290, scale: 1 });
                        var N = 300;

                        // Precompute Lambda via smallest prime factor sieve
                        var spf = new Array(N + 1).fill(0);
                        for (var i = 2; i <= N; i++) {
                            if (spf[i] === 0) {
                                for (var j = i; j <= N; j += i) {
                                    if (spf[j] === 0) spf[j] = i;
                                }
                            }
                        }
                        function vonMangoldt(n) {
                            if (n < 2) return 0;
                            var p = spf[n]; var m = n;
                            while (m % p === 0) m = m / p;
                            return m === 1 ? Math.log(p) : 0;
                        }

                        // Build Psi(x)
                        var psi = new Array(N + 1).fill(0);
                        for (var k = 1; k <= N; k++) psi[k] = psi[k - 1] + vonMangoldt(k);

                        var showRatio = false;
                        VizEngine.createButton(controls, 'Toggle: Psi(x) / Ratio', function() { showRatio = !showRatio; draw(); });

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var W = viz.width, H = viz.height;
                            var padL = 60, padR = 20, padT = 28, padB = 40;
                            var chartW = W - padL - padR, chartH = H - padT - padB;

                            ctx.strokeStyle = viz.colors.axis; ctx.lineWidth = 1.5;
                            ctx.beginPath(); ctx.moveTo(padL, padT); ctx.lineTo(padL, padT + chartH); ctx.lineTo(padL + chartW, padT + chartH); ctx.stroke();

                            if (!showRatio) {
                                // Y scale: 0..N
                                var yMax = N;
                                for (var yv = 0; yv <= yMax; yv += 50) {
                                    var sy = padT + chartH - (yv / yMax) * chartH;
                                    ctx.fillStyle = viz.colors.text; ctx.font = '10px -apple-system,sans-serif'; ctx.textAlign = 'right';
                                    ctx.fillText(yv.toString(), padL - 4, sy + 4);
                                    ctx.strokeStyle = viz.colors.grid; ctx.lineWidth = 0.5;
                                    ctx.beginPath(); ctx.moveTo(padL, sy); ctx.lineTo(padL + chartW, sy); ctx.stroke();
                                }
                                // y = x reference
                                ctx.strokeStyle = viz.colors.orange + '88'; ctx.lineWidth = 1.5; ctx.setLineDash([6, 4]);
                                ctx.beginPath(); ctx.moveTo(padL, padT + chartH); ctx.lineTo(padL + chartW, padT); ctx.stroke(); ctx.setLineDash([]);

                                // Psi(x)
                                ctx.strokeStyle = viz.colors.blue; ctx.lineWidth = 2;
                                ctx.beginPath();
                                for (var n = 1; n <= N; n++) {
                                    var px = padL + (n / N) * chartW;
                                    var py = padT + chartH - (psi[n] / yMax) * chartH;
                                    n === 1 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
                                }
                                ctx.stroke();
                                // Labels
                                ctx.fillStyle = viz.colors.blue; ctx.font = '12px -apple-system,sans-serif'; ctx.textAlign = 'left';
                                ctx.fillText('\u03a8(x)', padL + chartW - 45, padT + chartH * 0.15);
                                ctx.fillStyle = viz.colors.orange; ctx.fillText('y = x', padL + chartW - 40, padT + chartH * 0.05);
                            } else {
                                // Ratio Psi(x)/x
                                var yMin2 = 0.5, yMax2 = 1.5;
                                for (var yv2 = yMin2; yv2 <= yMax2 + 0.01; yv2 += 0.25) {
                                    var sy2 = padT + chartH - ((yv2 - yMin2) / (yMax2 - yMin2)) * chartH;
                                    ctx.fillStyle = viz.colors.text; ctx.font = '10px -apple-system,sans-serif'; ctx.textAlign = 'right';
                                    ctx.fillText(yv2.toFixed(2), padL - 4, sy2 + 4);
                                    ctx.strokeStyle = yv2 === 1 ? viz.colors.orange + 'aa' : viz.colors.grid; ctx.lineWidth = yv2 === 1 ? 1 : 0.5;
                                    ctx.beginPath(); ctx.moveTo(padL, sy2); ctx.lineTo(padL + chartW, sy2); ctx.stroke();
                                }
                                ctx.strokeStyle = viz.colors.blue; ctx.lineWidth = 2;
                                ctx.beginPath();
                                for (var n2 = 5; n2 <= N; n2++) {
                                    var px2 = padL + (n2 / N) * chartW;
                                    var ratio = psi[n2] / n2;
                                    var clamped = Math.max(yMin2, Math.min(yMax2, ratio));
                                    var py2 = padT + chartH - ((clamped - yMin2) / (yMax2 - yMin2)) * chartH;
                                    n2 === 5 ? ctx.moveTo(px2, py2) : ctx.lineTo(px2, py2);
                                }
                                ctx.stroke();
                                ctx.fillStyle = viz.colors.blue; ctx.font = '12px -apple-system,sans-serif'; ctx.textAlign = 'left';
                                ctx.fillText('\u03a8(x)/x', padL + 8, padT + 14);
                            }
                            // X labels
                            ctx.textAlign = 'center'; ctx.textBaseline = 'top'; ctx.fillStyle = viz.colors.text; ctx.font = '10px -apple-system,sans-serif';
                            for (var xv = 0; xv <= N; xv += 50) {
                                var sxv = padL + (xv / N) * chartW;
                                ctx.fillText(xv.toString(), sxv, padT + chartH + 5);
                            }
                            ctx.fillText('x', padL + chartW / 2, padT + chartH + 22);
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Using the identity \\(\\sum_{d \\mid n} \\phi(d) = n\\), show that \\(\\Phi(x) = \\frac{1}{2}\\sum_{n \\le x} \\mu(n) \\lfloor x/n \\rfloor (\\lfloor x/n \\rfloor + 1)\\) up to a small error. (Apostol Ch. 3 approach.)',
                    hint: 'Apply Mobius inversion to \\(n = \\sum_{d \\mid n} \\phi(d)\\), swap summation order, and use \\(\\sum_{n \\le x} n = x(x+1)/2\\).',
                    solution: 'From \\(n = \\sum_{d \\mid n} \\phi(d)\\) and Mobius inversion, \\(\\phi(n) = \\sum_{d \\mid n} \\mu(d)(n/d)\\). Then \\(\\Phi(x) = \\sum_{n \\le x} \\sum_{d \\mid n} \\mu(d)(n/d) = \\sum_{d \\le x} \\mu(d) \\sum_{m \\le x/d} m = \\sum_{d \\le x} \\mu(d) \\cdot \\frac{\\lfloor x/d \\rfloor(\\lfloor x/d \\rfloor + 1)}{2}\\).'
                }
            ]
        },

        // ================================================================
        // SECTION 3: Abel Summation
        // ================================================================
        {
            id: 'sec-abel',
            title: 'Abel Summation',
            content: `
<h2>Abel Summation</h2>

<p>Abel summation is the discrete analogue of integration by parts. It converts a sum \\(\\sum_{n \\le x} a(n) f(n)\\) into a summatory function \\(A(x) = \\sum_{n \\le x} a(n)\\) times a smooth factor.</p>

<div class="env-block theorem">
    <div class="env-title">Theorem 2.3 (Abel's Summation Formula)</div>
    <div class="env-body">
        <p>Let \\(a(n)\\) be arithmetic, \\(A(x) = \\sum_{n \\le x} a(n)\\), and \\(f\\) continuously differentiable on \\([1, x]\\). Then</p>
        \\[\\sum_{n \\le x} a(n) f(n) = A(x) f(x) - \\int_1^x A(t) f'(t) \\, dt.\\]
    </div>
</div>

<p><strong>Proof.</strong> Write \\(a(n) = A(n) - A(n-1)\\). Then:</p>

\\[\\sum_{n=1}^{N} a(n) f(n) = \\sum_{n=1}^{N} (A(n) - A(n-1)) f(n) = A(N)f(N) - \\sum_{n=1}^{N-1} A(n)(f(n+1) - f(n)).\\]

<p>This is summation by parts. Replacing the difference \\(f(n+1) - f(n) = \\int_n^{n+1} f'(t)\\,dt\\) and \\(A(n) = A(t)\\) for \\(t \\in [n, n+1)\\) gives the integral form. \\(\\square\\)</p>

<h3>Application: Partial Sums of \\(1/n\\)</h3>

<div class="env-block example">
    <div class="env-title">Example 2.1</div>
    <div class="env-body">
        <p>Take \\(a(n) = 1\\), so \\(A(x) = \\lfloor x \\rfloor = x - \\{x\\}\\). With \\(f(t) = 1/t\\):</p>
        \\[\\sum_{n \\le x} \\frac{1}{n} = \\frac{\\lfloor x \\rfloor}{x} + \\int_1^x \\frac{\\lfloor t \\rfloor}{t^2} \\, dt = \\log x + \\gamma + O(1/x).\\]
        <p>The constant \\(\\gamma = \\int_1^\\infty \\left(\\frac{\\lfloor t \\rfloor}{t^2} - \\frac{1}{t}\\right) dt + 1\\) is the Euler-Mascheroni constant.</p>
    </div>
</div>

<h3>Application: Dirichlet Series Convergence</h3>

<p>Abel summation is the key tool for establishing convergence of Dirichlet series \\(\\sum a(n) n^{-s}\\). If \\(A(x) = O(x^\\alpha)\\), then \\(\\sum a(n) n^{-s}\\) converges absolutely for \\(\\text{Re}(s) > \\alpha\\).</p>

<div class="env-block theorem">
    <div class="env-title">Theorem 2.4 (Convergence via Abel)</div>
    <div class="env-body">
        <p>If \\(A(x) = O(x^\\alpha)\\), then for \\(\\sigma = \\text{Re}(s) > \\alpha\\):</p>
        \\[\\sum_{n=1}^\\infty \\frac{a(n)}{n^s} = s \\int_1^\\infty \\frac{A(t)}{t^{s+1}} \\, dt.\\]
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-abel-summation"></div>

<div class="env-block remark">
    <div class="env-title">Partial Summation vs Abel: Terminology</div>
    <div class="env-body">
        <p>In analytic number theory, "Abel summation" and "partial summation" are used interchangeably. The result is sometimes called the "Euler-Maclaurin summation formula" in its integral form, though that formula has additional Bernoulli correction terms (Section 4).</p>
    </div>
</div>
`,
            visualizations: [
                {
                    id: 'viz-abel-summation',
                    title: 'Abel Summation: Geometric Proof',
                    description: 'Abel summation as discrete integration by parts. The step function A(x) and smooth function f(x) interact: the sum equals A(x)f(x) minus the integral of A(t)f\'(t). Drag the slider to change x.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, { width: 600, height: 340, originX: 60, originY: 300, scale: 1 });
                        var xVal = 8;
                        var slider = VizEngine.createSlider(controls, 'N', 2, 15, xVal, 1, function(v) { xVal = Math.round(v); draw(); });

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var W = viz.width, H = viz.height;
                            var padL = 60, padR = 20, padT = 28, padB = 36;
                            var chartW = W - padL - padR, chartH = H - padT - padB;
                            var N = xVal;
                            var xMax = 16;

                            // Axes
                            ctx.strokeStyle = viz.colors.axis; ctx.lineWidth = 1.5;
                            ctx.beginPath(); ctx.moveTo(padL, padT); ctx.lineTo(padL, padT + chartH); ctx.lineTo(padL + chartW, padT + chartH); ctx.stroke();

                            // f(t) = 1/t, A(t) = floor(t)
                            var yMax = 2.5;

                            // Y grid
                            for (var yv = 0; yv <= yMax; yv += 0.5) {
                                var sy = padT + chartH - (yv / yMax) * chartH;
                                ctx.fillStyle = viz.colors.text; ctx.font = '9px -apple-system,sans-serif'; ctx.textAlign = 'right';
                                ctx.fillText(yv.toFixed(1), padL - 4, sy + 4);
                                ctx.strokeStyle = viz.colors.grid; ctx.lineWidth = 0.5;
                                ctx.beginPath(); ctx.moveTo(padL, sy); ctx.lineTo(padL + chartW, sy); ctx.stroke();
                            }

                            function sx(t) { return padL + (t / xMax) * chartW; }
                            function sy(y) { return padT + chartH - (y / yMax) * chartH; }

                            // Draw A(t)*f(t) rectangles (Abel decomposition)
                            // sum a(n)*f(n) = sum of bars at integer n, height f(n)
                            ctx.fillStyle = viz.colors.blue + '44';
                            for (var n = 1; n <= N; n++) {
                                var barH = 1 / n;
                                var x1 = sx(n - 0.4), x2 = sx(n + 0.4);
                                var y1 = sy(barH), y2 = sy(0);
                                ctx.fillRect(x1, y1, x2 - x1, y2 - y1);
                                ctx.strokeStyle = viz.colors.blue; ctx.lineWidth = 1;
                                ctx.strokeRect(x1, y1, x2 - x1, y2 - y1);
                            }

                            // Draw A(t)*(-f'(t)) area (integral term) -- shade region under curve from 1 to N
                            ctx.fillStyle = viz.colors.orange + '33';
                            ctx.beginPath();
                            ctx.moveTo(sx(1), sy(0));
                            var steps = 200;
                            for (var i = 0; i <= steps; i++) {
                                var t = 1 + (N - 1) * i / steps;
                                var floorT = Math.floor(t);
                                var val = floorT / (t * t); // A(t)/t^2 = A(t)*(-f'(t)) for f=1/t
                                ctx.lineTo(sx(t), sy(val));
                            }
                            ctx.lineTo(sx(N), sy(0));
                            ctx.closePath(); ctx.fill();

                            // Draw 1/t curve
                            ctx.strokeStyle = viz.colors.teal; ctx.lineWidth = 2;
                            ctx.beginPath();
                            for (var i = 0; i <= 200; i++) {
                                var t = 1 + (xMax - 1) * i / 200;
                                var x = sx(t), yy = sy(1 / t);
                                i === 0 ? ctx.moveTo(x, yy) : ctx.lineTo(x, yy);
                            }
                            ctx.stroke();

                            // N marker
                            ctx.strokeStyle = viz.colors.red; ctx.lineWidth = 1.5; ctx.setLineDash([4, 4]);
                            ctx.beginPath(); ctx.moveTo(sx(N), padT); ctx.lineTo(sx(N), padT + chartH); ctx.stroke(); ctx.setLineDash([]);
                            ctx.fillStyle = viz.colors.red; ctx.font = '11px -apple-system,sans-serif'; ctx.textAlign = 'center';
                            ctx.fillText('N=' + N, sx(N), padT + 12);

                            // Running harmonic sum display
                            var harmSum = 0;
                            for (var k = 1; k <= N; k++) harmSum += 1 / k;
                            var logApprox = Math.log(N) + 0.5772;
                            ctx.fillStyle = viz.colors.white; ctx.font = '11px -apple-system,sans-serif'; ctx.textAlign = 'left';
                            ctx.fillText('\u03a3 1/n = ' + harmSum.toFixed(4) + '   ln(N)+\u03b3 \u2248 ' + logApprox.toFixed(4), padL + 8, padT + 14);

                            // Legend
                            ctx.fillStyle = viz.colors.blue + 'aa'; ctx.fillRect(padL + 8, padT + chartH - 40, 14, 10);
                            ctx.fillStyle = viz.colors.text; ctx.font = '10px -apple-system,sans-serif'; ctx.textAlign = 'left';
                            ctx.fillText('1/n terms (blue)', padL + 26, padT + chartH - 32);
                            ctx.fillStyle = viz.colors.orange + 'aa'; ctx.fillRect(padL + 8, padT + chartH - 26, 14, 10);
                            ctx.fillText('\u222bA(t)/t\u00b2 dt (orange)', padL + 26, padT + chartH - 18);
                            ctx.fillStyle = viz.colors.teal; ctx.fillRect(padL + 200, padT + chartH - 26, 14, 3);
                            ctx.fillStyle = viz.colors.text; ctx.fillText('f(t) = 1/t', padL + 218, padT + chartH - 18);

                            // X labels
                            ctx.textAlign = 'center'; ctx.textBaseline = 'top'; ctx.fillStyle = viz.colors.text; ctx.font = '10px -apple-system,sans-serif';
                            for (var xv = 2; xv <= xMax; xv += 2) {
                                ctx.fillText(xv.toString(), sx(xv), padT + chartH + 5);
                            }
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Use Abel summation with \\(a(n) = \\Lambda(n)\\) and \\(f(t) = 1/t\\) to express \\(\\sum_{n \\le x} \\Lambda(n)/n\\) in terms of \\(\\Psi(x)\\) and an integral. Given \\(\\Psi(x) = x + O(x \\exp(-c\\sqrt{\\log x}))\\), find the asymptotic.',
                    hint: 'Apply Theorem 2.3 with \\(f(t) = 1/t\\), so \\(f\'(t) = -1/t^2\\). The main term is \\(\\Psi(x)/x + \\int_1^x \\Psi(t)/t^2 \\, dt\\).',
                    solution: 'Abel summation gives \\(\\sum_{n \\le x} \\Lambda(n)/n = \\Psi(x)/x + \\int_1^x \\Psi(t)/t^2 \\, dt\\). Substituting \\(\\Psi(t) = t + E(t)\\) with \\(E(t)\\) small: main term is \\(1 + \\int_1^x t^{-1}\\,dt = 1 + \\log x\\). So \\(\\sum_{n \\le x} \\Lambda(n)/n = \\log x + O(1)\\), consistent with Mertens\' theorem.'
                },
                {
                    question: 'Using Abel summation, show that if \\(\\sum_{p \\le x} 1/p = \\log\\log x + M + o(1)\\) (Mertens), then \\(\\sum_{p \\le x} (\\log p)/p = \\log x + O(1)\\).',
                    hint: 'Apply Abel summation to the sum over primes with \\(a(p) = 1/p\\) and the weight \\(\\log p\\), or directly integrate the known asymptotic.',
                    solution: 'Let \\(\\pi(t)\\) count primes. By partial summation: \\(\\sum_{p \\le x} (\\log p)/p = \\sum_{p \\le x} (1/p) \\cdot \\log p\\). Writing \\(A(t) = \\sum_{p \\le t} 1/p = \\log\\log t + C + o(1)\\) and \\(f(t) = \\log t\\), Abel\'s formula gives main contribution \\(A(x)\\log x - \\int_2^x A(t)/t \\, dt = \\log x + O(\\log\\log x)\\).'
                }
            ]
        },

        // ================================================================
        // SECTION 4: Euler-Maclaurin Formula
        // ================================================================
        {
            id: 'sec-euler-maclaurin',
            title: 'Euler-Maclaurin Formula',
            content: `
<h2>The Euler-Maclaurin Formula</h2>

<p>Abel summation replaces a sum by an integral up to a controlled error. The Euler-Maclaurin formula goes further: it provides an asymptotic expansion of the <em>difference</em> between the sum and the integral in terms of Bernoulli numbers.</p>

<h3>Bernoulli Numbers and Polynomials</h3>

<div class="env-block definition">
    <div class="env-title">Definition 2.3 (Bernoulli Numbers)</div>
    <div class="env-body">
        <p>The Bernoulli numbers \\(B_k\\) are defined by the generating function</p>
        \\[\\frac{t}{e^t - 1} = \\sum_{k=0}^\\infty B_k \\frac{t^k}{k!}, \\quad |t| < 2\\pi.\\]
        <p>First few values: \\(B_0 = 1,\\; B_1 = -\\tfrac{1}{2},\\; B_2 = \\tfrac{1}{6},\\; B_3 = 0,\\; B_4 = -\\tfrac{1}{30},\\ldots\\) All \\(B_k = 0\\) for odd \\(k \\ge 3\\).</p>
    </div>
</div>

<div class="env-block theorem">
    <div class="env-title">Theorem 2.5 (Euler-Maclaurin Formula)</div>
    <div class="env-body">
        <p>Let \\(f\\) be \\((K+1)\\) times continuously differentiable on \\([m, n]\\). Then</p>
        \\[\\sum_{j=m}^{n} f(j) = \\int_m^n f(t) \\, dt + \\frac{f(m)+f(n)}{2} + \\sum_{k=1}^{K} \\frac{B_{2k}}{(2k)!} \\bigl(f^{(2k-1)}(n) - f^{(2k-1)}(m)\\bigr) + R_K,\\]
        <p>where \\(|R_K| \\le \\frac{2}{(2\\pi)^{2K}} \\int_m^n |f^{(2K+1)}(t)| \\, dt.\\)</p>
    </div>
</div>

<h3>Stirling's Formula Sketch</h3>

<p>Apply Euler-Maclaurin to \\(f(j) = \\log j\\) with \\(m=1, n=N\\):</p>

\\[\\log(N!) = \\sum_{j=1}^N \\log j = N\\log N - N + \\tfrac{1}{2}\\log N + \\tfrac{1}{2}\\log(2\\pi) + O(1/N).\\]

<p>This is Stirling's approximation \\(N! \\approx \\sqrt{2\\pi N} (N/e)^N\\).</p>

<h3>The Harmonic Numbers</h3>

<p>Apply Euler-Maclaurin to \\(f(j) = 1/j\\):</p>

\\[H_N = \\sum_{j=1}^N \\frac{1}{j} = \\log N + \\gamma + \\frac{1}{2N} - \\sum_{k=1}^K \\frac{B_{2k}}{2k} \\cdot N^{-2k} + O(N^{-2K-2}),\\]

<p>where \\(\\gamma = 0.5772156649\\ldots\\) This is a complete asymptotic expansion (but divergent as a series).</p>

<div class="env-block remark">
    <div class="env-title">Asymptotic vs Convergent</div>
    <div class="env-body">
        <p>The Euler-Maclaurin expansion \\(H_N \\sim \\log N + \\gamma + \\frac{1}{2N} - \\frac{1}{12N^2} + \\cdots\\) diverges as a formal series (Bernoulli numbers grow factorially). But truncating at any fixed \\(K\\) gives an error \\(O(N^{-2K-2})\\). This is an <em>asymptotic expansion</em>: better for fixed \\(N\\) as \\(K\\) increases up to a point, then worse. The optimal truncation minimizes \\(N^{-2K}(2K)!/(2\\pi)^{2K}\\).</p>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-euler-maclaurin"></div>
`,
            visualizations: [
                {
                    id: 'viz-euler-maclaurin',
                    title: 'Euler-Maclaurin: H_N vs ln(N) + gamma',
                    description: 'The harmonic numbers H_N compared to ln(N)+gamma and successive Euler-Maclaurin approximations. See the correction terms snap into precision.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, { width: 600, height: 330, originX: 60, originY: 300, scale: 1 });
                        var nMax = 50;
                        var gamma = 0.5772156649;
                        var terms = 0;
                        var slider = VizEngine.createSlider(controls, 'EM terms K', 0, 4, 0, 1, function(v) { terms = Math.round(v); draw(); });

                        // Bernoulli numbers B_{2k}/(2k) for k=1..4
                        var emCoeffs = [
                            1 / 12,        // B2/(2) = (1/6)/2
                            -1 / 120,      // B4/(4) = (-1/30)/4
                            1 / 252,       // B6/(6) = (1/42)/6
                            -1 / 240       // B8/(8) = (-1/30)/8
                        ];

                        function emApprox(N, K) {
                            var val = Math.log(N) + gamma + 1 / (2 * N);
                            for (var k = 0; k < K && k < emCoeffs.length; k++) {
                                var power = 1;
                                for (var j = 0; j < 2 * (k + 1); j++) power *= N;
                                val -= emCoeffs[k] / power;
                            }
                            return val;
                        }

                        function harmonic(N) {
                            var h = 0; for (var k = 1; k <= N; k++) h += 1 / k; return h;
                        }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var W = viz.width, H = viz.height;
                            var padL = 60, padR = 20, padT = 28, padB = 36;
                            var chartW = W - padL - padR, chartH = H - padT - padB;

                            ctx.strokeStyle = viz.colors.axis; ctx.lineWidth = 1.5;
                            ctx.beginPath(); ctx.moveTo(padL, padT); ctx.lineTo(padL, padT + chartH); ctx.lineTo(padL + chartW, padT + chartH); ctx.stroke();

                            var yMin = 0, yMax = 4.5;

                            for (var yv = 0; yv <= yMax; yv += 1) {
                                var sy = padT + chartH - ((yv - yMin) / (yMax - yMin)) * chartH;
                                ctx.fillStyle = viz.colors.text; ctx.font = '10px -apple-system,sans-serif'; ctx.textAlign = 'right';
                                ctx.fillText(yv.toString(), padL - 4, sy + 4);
                                ctx.strokeStyle = viz.colors.grid; ctx.lineWidth = 0.5;
                                ctx.beginPath(); ctx.moveTo(padL, sy); ctx.lineTo(padL + chartW, sy); ctx.stroke();
                            }

                            function toSx(n) { return padL + (n / nMax) * chartW; }
                            function toSy(y) { return padT + chartH - ((y - yMin) / (yMax - yMin)) * chartH; }

                            // Exact harmonic numbers
                            ctx.strokeStyle = viz.colors.blue; ctx.lineWidth = 2;
                            ctx.beginPath();
                            for (var n = 1; n <= nMax; n++) {
                                var h = harmonic(n);
                                n === 1 ? ctx.moveTo(toSx(n), toSy(h)) : ctx.lineTo(toSx(n), toSy(h));
                            }
                            ctx.stroke();

                            // log(N)+gamma baseline
                            ctx.strokeStyle = viz.colors.orange; ctx.lineWidth = 1.5; ctx.setLineDash([6, 4]);
                            ctx.beginPath();
                            for (var n = 1; n <= nMax; n++) {
                                var approx0 = Math.log(n) + gamma;
                                n === 1 ? ctx.moveTo(toSx(n), toSy(approx0)) : ctx.lineTo(toSx(n), toSy(approx0));
                            }
                            ctx.stroke(); ctx.setLineDash([]);

                            // EM approximation with K terms
                            if (terms > 0) {
                                ctx.strokeStyle = viz.colors.green; ctx.lineWidth = 2;
                                ctx.beginPath();
                                for (var n = 1; n <= nMax; n++) {
                                    var approxK = emApprox(n, terms);
                                    n === 1 ? ctx.moveTo(toSx(n), toSy(approxK)) : ctx.lineTo(toSx(n), toSy(approxK));
                                }
                                ctx.stroke();
                            }

                            // Error panel: show |H_N - approx| at N=nMax
                            var errBaseline = Math.abs(harmonic(nMax) - (Math.log(nMax) + gamma));
                            var errEM = terms > 0 ? Math.abs(harmonic(nMax) - emApprox(nMax, terms)) : null;
                            ctx.fillStyle = viz.colors.white; ctx.font = '11px -apple-system,sans-serif'; ctx.textAlign = 'left';
                            ctx.fillText('At N=' + nMax + ':  |H_N - ln N - \u03b3| = ' + errBaseline.toFixed(6), padL + 8, padT + 14);
                            if (errEM !== null) {
                                ctx.fillStyle = viz.colors.green;
                                ctx.fillText('|H_N - EM_' + terms + '| = ' + errEM.toExponential(3), padL + 8, padT + 30);
                            }

                            // Legend
                            ctx.fillStyle = viz.colors.blue; ctx.fillRect(padL + 8, padT + chartH - 38, 18, 3);
                            ctx.fillStyle = viz.colors.text; ctx.font = '10px -apple-system,sans-serif'; ctx.textAlign = 'left'; ctx.fillText('H_N (exact)', padL + 30, padT + chartH - 31);
                            ctx.fillStyle = viz.colors.orange; ctx.fillRect(padL + 120, padT + chartH - 38, 18, 3);
                            ctx.fillText('ln N + \u03b3', padL + 142, padT + chartH - 31);
                            if (terms > 0) { ctx.fillStyle = viz.colors.green; ctx.fillRect(padL + 220, padT + chartH - 38, 18, 3); ctx.fillStyle = viz.colors.text; ctx.fillText('EM K=' + terms, padL + 242, padT + chartH - 31); }

                            ctx.textAlign = 'center'; ctx.textBaseline = 'top'; ctx.fillStyle = viz.colors.text; ctx.font = '10px -apple-system,sans-serif';
                            for (var xv = 0; xv <= nMax; xv += 10) {
                                ctx.fillText(xv.toString(), toSx(xv), padT + chartH + 5);
                            }
                            ctx.fillText('N', padL + chartW / 2, padT + chartH + 22);
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Apply the Euler-Maclaurin formula to \\(f(j) = 1/j^2\\) to show \\(\\sum_{j=1}^N 1/j^2 = \\pi^2/6 - 1/N + O(1/N^2)\\). What is the next correction term?',
                    hint: 'The integral \\(\\int_N^\\infty t^{-2} \\, dt = 1/N\\). The boundary term at infinity vanishes. Use \\(B_2 = 1/6\\), \\(f\'(t) = -2/t^3\\).',
                    solution: 'By EM: \\(\\sum_{j=1}^N 1/j^2 = \\pi^2/6 - \\int_N^\\infty t^{-2}\\,dt + \\frac{1}{2N^2} + \\frac{B_2}{2!} \\cdot (-2N^{-3}) + \\cdots = \\pi^2/6 - N^{-1} + \\frac{1}{2}N^{-2} + O(N^{-3})\\).'
                }
            ]
        },

        // ================================================================
        // SECTION 5: Dirichlet's Hyperbola Method
        // ================================================================
        {
            id: 'sec-hyperbola',
            title: "Dirichlet's Hyperbola Method",
            content: `
<h2>Dirichlet's Hyperbola Method</h2>

<p>We prove Theorem 2.1: \\(D(x) = x\\log x + (2\\gamma-1)x + O(\\sqrt{x})\\). The proof is a masterpiece of elementary analytic number theory.</p>

<h3>Setup: Counting Lattice Points</h3>

<p>Observe that</p>

\\[D(x) = \\sum_{n \\le x} d(n) = \\sum_{n \\le x} \\sum_{d \\mid n} 1 = \\#\\{(a,b) \\in \\mathbb{Z}_{>0}^2 : ab \\le x\\}.\\]

<p>We are counting integer lattice points under the hyperbola \\(ab = x\\) in the first quadrant. By symmetry \\((a,b) \\leftrightarrow (b,a)\\), we can split:</p>

\\[D(x) = 2 \\sum_{a \\le \\sqrt{x}} \\left\\lfloor \\frac{x}{a} \\right\\rfloor - \\lfloor \\sqrt{x} \\rfloor^2.\\]

<p>The first term counts lattice points in the region \\(a \\le \\sqrt{x}\\) (both sides), and the correction subtracts the square \\(a, b \\le \\sqrt{x}\\) that was counted twice.</p>

<div class="viz-placeholder" data-viz="viz-hyperbola-lattice"></div>

<h3>Asymptotic Evaluation</h3>

<div class="env-block theorem">
    <div class="env-title">Theorem 2.6 (Dirichlet's Hyperbola Identity)</div>
    <div class="env-body">
        \\[D(x) = 2\\sum_{n \\le \\sqrt{x}} \\left\\lfloor \\frac{x}{n} \\right\\rfloor - \\lfloor\\sqrt{x}\\rfloor^2.\\]
    </div>
</div>

<strong>Proof of the asymptotic.</strong> Write \\(\\lfloor x/n \\rfloor = x/n - \\{x/n\\}\\):

\\[2\\sum_{n \\le \\sqrt{x}} \\frac{x}{n} = 2x \\sum_{n \\le \\sqrt{x}} \\frac{1}{n} = 2x\\bigl(\\tfrac{1}{2}\\log x + \\gamma + O(x^{-1/2})\\bigr) = x\\log x + 2\\gamma x + O(\\sqrt{x}).\\]

<p>The error from fractional parts: \\(\\sum_{n \\le \\sqrt{x}} \\{x/n\\} = O(\\sqrt{x})\\). And \\(\\lfloor\\sqrt{x}\\rfloor^2 = x - O(\\sqrt{x})\\). Combining:</p>

\\[D(x) = x\\log x + 2\\gamma x - x + O(\\sqrt{x}) = x\\log x + (2\\gamma-1)x + O(\\sqrt{x}). \\quad \\square\\]

<h3>Generalizations</h3>

<p>The hyperbola method applies whenever we need asymptotics for \\(\\sum_{n \\le x} (f * g)(n)\\) where \\(f * g\\) is a Dirichlet convolution:</p>

\\[\\sum_{n \\le x} (f*g)(n) = \\sum_{a \\le u} f(a) G(x/a) + \\sum_{b \\le x/u} g(b) F(x/b) - F(u) G(x/u),\\]

<p>for any \\(u \\le x\\). The optimal choice of \\(u\\) (often \\(u = \\sqrt{x}\\)) balances the error terms.</p>

<div class="env-block remark">
    <div class="env-title">The Dirichlet Divisor Problem</div>
    <div class="env-body">
        <p>Dirichlet's error term \\(O(\\sqrt{x})\\) is not optimal. The true error is conjectured to be \\(O(x^{1/4+\\epsilon})\\). Voronoi (1903) improved it to \\(O(x^{1/3} \\log x)\\). The current record is \\(O(x^{131/416})\\) (Huxley, 2003). This is one of the most famous open problems in analytic number theory.</p>
    </div>
</div>
`,
            visualizations: [
                {
                    id: 'viz-hyperbola-lattice',
                    title: 'Lattice Points Under the Hyperbola xy = N',
                    description: 'Blue dots: lattice points with ab <= N. Orange region: a <= sqrt(N) (used in Dirichlet\'s split). Drag the slider to change N and watch D(N) build up.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, { width: 600, height: 380, originX: 40, originY: 360, scale: 1 });
                        var N = 30;
                        var slider = VizEngine.createSlider(controls, 'N', 5, 80, N, 1, function(v) { N = Math.round(v); draw(); });

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var W = viz.width, H = viz.height;
                            var padL = 40, padR = 20, padT = 28, padB = 28;
                            var chartW = W - padL - padR, chartH = H - padT - padB;
                            var axisMax = Math.ceil(N * 0.85) + 2;

                            function sx(a) { return padL + (a / axisMax) * chartW; }
                            function sy(b) { return padT + chartH - (b / axisMax) * chartH; }

                            // Axes
                            ctx.strokeStyle = viz.colors.axis; ctx.lineWidth = 1.5;
                            ctx.beginPath(); ctx.moveTo(padL, padT); ctx.lineTo(padL, padT + chartH); ctx.lineTo(padL + chartW, padT + chartH); ctx.stroke();

                            // Grid
                            ctx.strokeStyle = viz.colors.grid; ctx.lineWidth = 0.4;
                            for (var k = 1; k <= axisMax; k++) {
                                ctx.beginPath(); ctx.moveTo(sx(k), padT); ctx.lineTo(sx(k), padT + chartH); ctx.stroke();
                                ctx.beginPath(); ctx.moveTo(padL, sy(k)); ctx.lineTo(padL + chartW, sy(k)); ctx.stroke();
                            }

                            var sqrtN = Math.sqrt(N);

                            // Orange shading: a <= sqrt(N) strip
                            ctx.fillStyle = viz.colors.orange + '22';
                            ctx.fillRect(padL, padT, sx(sqrtN) - padL, chartH);

                            // Teal shading: b <= sqrt(N) strip (symmetric)
                            ctx.fillStyle = viz.colors.teal + '18';
                            ctx.fillRect(padL, sy(sqrtN), chartW, padT + chartH - sy(sqrtN));

                            // Hyperbola curve xy = N
                            ctx.strokeStyle = viz.colors.yellow; ctx.lineWidth = 2;
                            ctx.beginPath();
                            var started = false;
                            for (var i = 0; i <= 300; i++) {
                                var a = 0.5 + (axisMax - 0.5) * i / 300;
                                var b = N / a;
                                if (b > axisMax || b < 0.3) { started = false; continue; }
                                var px = sx(a), py = sy(b);
                                if (!started) { ctx.moveTo(px, py); started = true; } else { ctx.lineTo(px, py); }
                            }
                            ctx.stroke();

                            // Sqrt(N) vertical line
                            ctx.strokeStyle = viz.colors.orange; ctx.lineWidth = 1.5; ctx.setLineDash([5, 4]);
                            ctx.beginPath(); ctx.moveTo(sx(sqrtN), padT); ctx.lineTo(sx(sqrtN), padT + chartH); ctx.stroke(); ctx.setLineDash([]);

                            // Lattice points
                            var count = 0;
                            for (var a = 1; a <= axisMax; a++) {
                                for (var b = 1; b * a <= N; b++) {
                                    count++;
                                    var inLeft = a <= sqrtN;
                                    ctx.fillStyle = inLeft ? viz.colors.blue : viz.colors.purple;
                                    var r = Math.max(2, Math.min(5, 180 / axisMax));
                                    ctx.beginPath(); ctx.arc(sx(a), sy(b), r, 0, Math.PI * 2); ctx.fill();
                                }
                            }

                            // Dirichlet formula value
                            var dirichlet = 0;
                            for (var a2 = 1; a2 <= sqrtN; a2++) dirichlet += Math.floor(N / a2);
                            dirichlet = 2 * dirichlet - Math.floor(sqrtN) * Math.floor(sqrtN);

                            // Axis labels
                            ctx.fillStyle = viz.colors.text; ctx.font = '10px -apple-system,sans-serif'; ctx.textAlign = 'center';
                            for (var k2 = 5; k2 <= axisMax; k2 += 5) {
                                ctx.fillText(k2.toString(), sx(k2), padT + chartH + 6);
                                ctx.textAlign = 'right';
                                ctx.fillText(k2.toString(), padL - 4, sy(k2) + 4);
                                ctx.textAlign = 'center';
                            }
                            ctx.fillStyle = viz.colors.text; ctx.font = '11px -apple-system,sans-serif'; ctx.textAlign = 'center';
                            ctx.fillText('a', padL + chartW / 2, padT + chartH + 18);
                            ctx.textAlign = 'right'; ctx.fillText('b', padL - 8, padT + 10);

                            // Info panel
                            ctx.fillStyle = viz.colors.white; ctx.font = '12px -apple-system,sans-serif'; ctx.textAlign = 'left';
                            ctx.fillText('N = ' + N + '   D(N) = ' + count + '   Formula: ' + dirichlet, padL + 4, padT + 14);
                            ctx.fillStyle = viz.colors.orange; ctx.font = '10px -apple-system,sans-serif';
                            ctx.fillText('\u221aN = ' + sqrtN.toFixed(2), sx(sqrtN) + 4, padT + 26);

                            // Legend
                            ctx.fillStyle = viz.colors.blue; ctx.beginPath(); ctx.arc(padL + 12, padT + chartH - 22, 4, 0, Math.PI * 2); ctx.fill();
                            ctx.fillStyle = viz.colors.text; ctx.font = '10px -apple-system,sans-serif'; ctx.textAlign = 'left';
                            ctx.fillText('a \u2264 \u221aN', padL + 20, padT + chartH - 18);
                            ctx.fillStyle = viz.colors.purple; ctx.beginPath(); ctx.arc(padL + 90, padT + chartH - 22, 4, 0, Math.PI * 2); ctx.fill();
                            ctx.fillText('a > \u221aN', padL + 98, padT + chartH - 18);
                            ctx.fillStyle = viz.colors.yellow; ctx.fillRect(padL + 170, padT + chartH - 25, 16, 2);
                            ctx.fillStyle = viz.colors.text; ctx.fillText('ab = N', padL + 190, padT + chartH - 18);
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Compute \\(D(100) = \\sum_{n \\le 100} d(n)\\) using Dirichlet\'s formula \\(D(x) = 2\\sum_{n \\le 10} \\lfloor 100/n \\rfloor - 10^2\\). Verify against the asymptotic \\(100\\log 100 + (2\\gamma-1) \\cdot 100 \\approx ?\\)',
                    hint: 'Compute \\(\\lfloor 100/n \\rfloor\\) for \\(n = 1, 2, \\ldots, 10\\): you get 100, 50, 33, 25, 20, 16, 14, 12, 11, 10. Sum is 291. Formula gives \\(2 \\times 291 - 100 = 482\\).',
                    solution: '\\(D(100) = 2(100+50+33+25+20+16+14+12+11+10) - 100 = 2 \\times 291 - 100 = 482\\). Asymptotic: \\(100\\ln 100 + (2 \\times 0.5772 - 1) \\times 100 \\approx 460.5 + 15.44 \\approx 475.9\\). Error \\(\\approx 6\\), well within \\(O(\\sqrt{100}) = O(10)\\).'
                },
                {
                    question: 'Apply the hyperbola method to \\(\\sum_{n \\le x} \\sigma(n)\\) where \\(\\sigma(n) = \\sum_{d \\mid n} d\\). Use the identity \\(\\sigma = \\text{id} * \\mathbf{1}\\) to derive the leading asymptotic.',
                    hint: '\\(\\sum_{n \\le x} \\sigma(n) = \\sum_{a \\le x} a \\lfloor x/a \\rfloor\\). Use \\(\\sum_{a \\le x} a = x^2/2 + O(x)\\) and the hyperbola split.',
                    solution: '\\(\\sum_{n \\le x} \\sigma(n) = \\sum_{a \\le x} \\sum_{b \\le x/a} a = \\sum_{a \\le x} a \\lfloor x/a \\rfloor\\). Writing \\(\\lfloor x/a \\rfloor \\approx x/a\\): main term is \\(x \\sum_{a \\le x} 1 = x \\cdot x\\) -- not quite. More carefully, the sum equals \\(\\frac{\\pi^2}{12} x^2 + O(x \\log x)\\) by Dirichlet convolution of \\(\\text{id}\\) with \\(\\mathbf{1}\\).'
                },
                {
                    question: 'Show that the error in Dirichlet\'s formula \\(D(x) - x\\log x - (2\\gamma-1)x\\) changes sign infinitely often (i.e., is \\(\\Omega_\\pm(x^{1/4})\\)). This is the Hardy-Landau-Ingham result.',
                    hint: 'This follows from the fact that the Dirichlet series for \\(d(n)\\) has zeros of \\(\\zeta(s)^2\\) on the critical line. The oscillation is driven by the contribution of the zeros.',
                    solution: 'Hardy (1916) showed the error term is \\(\\Omega(x^{1/4} \\log x)\\). The key idea: if the error had fixed sign for large \\(x\\), the Dirichlet series \\(\\sum d(n) n^{-s} - \\zeta(s)^2\\) would extend analytically past \\(s = 1/2\\), contradicting the analytic behavior of \\(\\zeta(s)^2\\) near its zeros on the critical line.'
                }
            ]
        },

        // ================================================================
        // SECTION 6: From Sums to Series (Bridge to Ch 3)
        // ================================================================
        {
            id: 'sec-bridge',
            title: 'From Sums to Series',
            content: `
<h2>From Sums to Series</h2>

<p>The techniques of this chapter, Abel summation and the Euler-Maclaurin formula, do more than prove specific asymptotics. They reveal a deep connection: <em>summatory functions of arithmetic functions and Dirichlet series are two sides of the same coin.</em></p>

<h3>Abel Summation and Dirichlet Series</h3>

<p>Let \\(f\\) be arithmetic and \\(F(x) = \\sum_{n \\le x} f(n)\\). Abel's formula gives:</p>

\\[\\sum_{n=1}^{\\infty} \\frac{f(n)}{n^s} = s \\int_1^\\infty \\frac{F(t)}{t^{s+1}} \\, dt, \\quad \\text{Re}(s) > \\sigma_c,\\]

<p>where \\(\\sigma_c\\) is the abscissa of convergence. Thus the analytic properties of the Dirichlet series \\(\\mathcal{D}(s) = \\sum f(n)/n^s\\) (poles, zeros, functional equations) are encoded in the asymptotics of \\(F(x)\\), and vice versa.</p>

<div class="env-block theorem">
    <div class="env-title">Theorem 2.7 (Perron's Formula, preview)</div>
    <div class="env-body">
        <p>The inversion of the above relationship is <strong>Perron's formula</strong>: for \\(c > \\sigma_c\\),</p>
        \\[F(x) = \\frac{1}{2\\pi i} \\int_{c-i\\infty}^{c+i\\infty} \\mathcal{D}(s) \\frac{x^s}{s} \\, ds.\\]
        <p>This reduces the study of \\(F(x)\\) to contour integration, allowing the residues at poles and the contribution of zeros to be extracted.</p>
    </div>
</div>

<h3>The Zeta Function Appears</h3>

<p>For \\(f = \\mathbf{1}\\) (the constant 1 function), \\(\\mathcal{D}(s) = \\zeta(s)\\) and \\(F(x) = \\lfloor x \\rfloor\\). For \\(f = d\\), \\(\\mathcal{D}(s) = \\zeta(s)^2\\). For \\(f = \\Lambda\\), the logarithmic derivative gives \\(-\\zeta'/\\zeta\\). The asymptotics we proved in this chapter are shadows of the analytic structure of \\(\\zeta(s)\\).</p>

<div class="env-block theorem">
    <div class="env-title">Key Correspondence Table</div>
    <div class="env-body">
        <table style="width:100%;border-collapse:collapse;">
            <thead>
                <tr style="border-bottom:1px solid #30363d;">
                    <th style="text-align:left;padding:4px 8px;color:#8b949e;">Arithmetic function</th>
                    <th style="text-align:left;padding:4px 8px;color:#8b949e;">Dirichlet series</th>
                    <th style="text-align:left;padding:4px 8px;color:#8b949e;">Summatory asymptotic</th>
                </tr>
            </thead>
            <tbody>
                <tr style="border-bottom:1px solid #21262d;"><td style="padding:4px 8px;">\\(\\mathbf{1}\\)</td><td style="padding:4px 8px;">\\(\\zeta(s)\\)</td><td style="padding:4px 8px;">\\(\\lfloor x \\rfloor = x + O(1)\\)</td></tr>
                <tr style="border-bottom:1px solid #21262d;"><td style="padding:4px 8px;">\\(d(n)\\)</td><td style="padding:4px 8px;">\\(\\zeta(s)^2\\)</td><td style="padding:4px 8px;">\\(x\\log x + (2\\gamma-1)x + O(\\sqrt{x})\\)</td></tr>
                <tr style="border-bottom:1px solid #21262d;"><td style="padding:4px 8px;">\\(\\phi(n)\\)</td><td style="padding:4px 8px;">\\(\\zeta(s-1)/\\zeta(s)\\)</td><td style="padding:4px 8px;">\\(3x^2/\\pi^2 + O(x\\log x)\\)</td></tr>
                <tr><td style="padding:4px 8px;">\\(\\Lambda(n)\\)</td><td style="padding:4px 8px;">\\(-\\zeta'(s)/\\zeta(s)\\)</td><td style="padding:4px 8px;">\\(\\Psi(x) \\sim x\\) (PNT)</td></tr>
            </tbody>
        </table>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-error-oscillation"></div>

<h3>The Road Ahead</h3>

<p>In Chapter 3 we define Dirichlet series rigorously, establish their convergence properties (including the half-plane of absolute convergence), and prove the Euler product formula. In Chapter 4 we meet the Riemann zeta function as an analytic function on \\(\\mathbb{C}\\), with its pole at \\(s=1\\) and its functional equation. The present chapter has equipped us with the summatory-function intuition that makes those analytic results meaningful.</p>

<div class="env-block intuition">
    <div class="env-title">The Unifying Vision</div>
    <div class="env-body">
        <p>The reason analytic number theory works is this: the wild, erratic behavior of arithmetic functions averages out into smooth asymptotics. Those asymptotics are controlled by poles and zeros of associated Dirichlet series. The location of the zeros of \\(\\zeta(s)\\), particularly whether they lie on \\(\\text{Re}(s) = 1/2\\) (the Riemann Hypothesis), governs the precision of the Prime Number Theorem. Everything connects.</p>
    </div>
</div>
`,
            visualizations: [
                {
                    id: 'viz-error-oscillation',
                    title: 'The Dirichlet Error: D(x) - x log x - (2gamma-1)x',
                    description: 'The oscillating error term E(x) = D(x) - x log x - (2gamma-1)x. The envelope ~ sqrt(x) is shown. Use the slider to zoom in x.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, { width: 600, height: 320, originX: 60, originY: 160, scale: 1 });
                        var xMax = 200;
                        var gamma = 0.5772156649;

                        var sliderX = VizEngine.createSlider(controls, 'x max', 50, 500, xMax, 10, function(v) { xMax = Math.round(v); draw(); });

                        // Precompute D(x) incrementally up to 500
                        var MAXN = 500;
                        var Dval = new Array(MAXN + 1).fill(0);
                        for (var k = 1; k <= MAXN; k++) {
                            Dval[k] = Dval[k - 1];
                            for (var d = 1; d * d <= k; d++) {
                                if (k % d === 0) {
                                    Dval[k] += (d * d === k) ? 1 : 2;
                                }
                            }
                        }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var W = viz.width, H = viz.height;
                            var padL = 60, padR = 20, padT = 28, padB = 36;
                            var chartW = W - padL - padR, chartH = H - padT - padB;

                            // Compute errors
                            var errors = [];
                            for (var n = 1; n <= xMax; n++) {
                                var main = n * Math.log(n) + (2 * gamma - 1) * n;
                                errors.push(Dval[n] - main);
                            }
                            var eMax = Math.max.apply(null, errors.map(Math.abs));
                            var yMax = Math.max(eMax * 1.1, 2);
                            var yMin = -yMax;

                            // Axes
                            ctx.strokeStyle = viz.colors.axis; ctx.lineWidth = 1.5;
                            var zeroY = padT + chartH * yMax / (yMax - yMin);
                            ctx.beginPath(); ctx.moveTo(padL, padT); ctx.lineTo(padL, padT + chartH); ctx.stroke();
                            ctx.beginPath(); ctx.moveTo(padL, zeroY); ctx.lineTo(padL + chartW, zeroY); ctx.stroke();

                            function toSx(n) { return padL + (n / xMax) * chartW; }
                            function toSy(y) { return padT + chartH * (yMax - y) / (yMax - yMin); }

                            // sqrt(x) envelope
                            ctx.strokeStyle = viz.colors.orange + '88'; ctx.lineWidth = 1.5; ctx.setLineDash([5, 4]);
                            ctx.beginPath();
                            for (var n = 1; n <= xMax; n++) {
                                var env = Math.sqrt(n) * 2;
                                n === 1 ? ctx.moveTo(toSx(n), toSy(env)) : ctx.lineTo(toSx(n), toSy(env));
                            }
                            ctx.stroke();
                            ctx.beginPath();
                            for (var n = 1; n <= xMax; n++) {
                                var env2 = -Math.sqrt(n) * 2;
                                n === 1 ? ctx.moveTo(toSx(n), toSy(env2)) : ctx.lineTo(toSx(n), toSy(env2));
                            }
                            ctx.stroke(); ctx.setLineDash([]);

                            // Error curve
                            ctx.strokeStyle = viz.colors.blue; ctx.lineWidth = 1.5;
                            ctx.beginPath();
                            for (var n = 1; n <= xMax; n++) {
                                var px = toSx(n), py = toSy(errors[n - 1]);
                                n === 1 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
                            }
                            ctx.stroke();

                            // Y axis labels
                            ctx.fillStyle = viz.colors.text; ctx.font = '10px -apple-system,sans-serif'; ctx.textAlign = 'right';
                            var step = Math.pow(10, Math.floor(Math.log10(yMax)));
                            for (var yv = -yMax; yv <= yMax; yv += step) {
                                var sy2 = toSy(yv);
                                if (sy2 < padT || sy2 > padT + chartH) continue;
                                ctx.fillText(Math.round(yv).toString(), padL - 4, sy2 + 4);
                                ctx.strokeStyle = viz.colors.grid; ctx.lineWidth = 0.4;
                                ctx.beginPath(); ctx.moveTo(padL, sy2); ctx.lineTo(padL + chartW, sy2); ctx.stroke();
                            }

                            // X labels
                            ctx.textAlign = 'center'; ctx.textBaseline = 'top'; ctx.fillStyle = viz.colors.text; ctx.font = '10px -apple-system,sans-serif';
                            for (var xv = 0; xv <= xMax; xv += Math.round(xMax / 5)) {
                                ctx.fillText(xv.toString(), toSx(xv), padT + chartH + 5);
                            }
                            ctx.fillText('x', padL + chartW / 2, padT + chartH + 22);

                            // Legend
                            ctx.fillStyle = viz.colors.blue; ctx.fillRect(padL + 8, padT + 6, 18, 2);
                            ctx.fillStyle = viz.colors.text; ctx.font = '10px -apple-system,sans-serif'; ctx.textAlign = 'left';
                            ctx.fillText('E(x) = D(x) \u2212 x\u2009ln\u2009x \u2212 (2\u03b3\u22121)x', padL + 30, padT + 10);
                            ctx.fillStyle = viz.colors.orange + 'aa'; ctx.fillRect(padL + 8, padT + 22, 18, 2);
                            ctx.fillStyle = viz.colors.text; ctx.fillText('\u00b12\u221ax envelope', padL + 30, padT + 26);
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Using Abel summation (Theorem 2.4), show that \\(\\zeta(s) = \\frac{s}{s-1} - s\\int_1^\\infty \\{t\\} t^{-s-1} \\, dt\\) for \\(\\text{Re}(s) > 0, s \\ne 1\\). This gives an analytic continuation of \\(\\zeta(s)\\) to the half-plane \\(\\text{Re}(s) > 0\\).',
                    hint: 'Take \\(a(n) = 1\\), \\(A(x) = \\lfloor x \\rfloor = x - \\{x\\}\\), and \\(f(t) = t^{-s}\\). Apply Theorem 2.4 and split \\(\\lfloor t \\rfloor = t - \\{t\\}\\).',
                    solution: 'Theorem 2.4: \\(\\zeta(s) = s\\int_1^\\infty \\lfloor t\\rfloor t^{-s-1}\\,dt = s\\int_1^\\infty (t - \\{t\\}) t^{-s-1}\\,dt = s\\int_1^\\infty t^{-s}\\,dt - s\\int_1^\\infty \\{t\\} t^{-s-1}\\,dt = \\frac{s}{s-1} - s\\int_1^\\infty \\{t\\}t^{-s-1}\\,dt\\). The integral converges for \\(\\text{Re}(s) > 0\\) since \\(\\{t\\} \\in [0,1)\\).'
                },
                {
                    question: 'Derive the average order of \\(\\phi(n)\\): show \\(\\frac{1}{x}\\sum_{n \\le x} \\phi(n) \\to \\frac{6}{\\pi^2}\\cdot x\\) by using \\(\\sum_{n \\le x} \\phi(n) = \\frac{x^2}{2} \\cdot \\frac{6}{\\pi^2} + O(x\\log x)\\). The key identity is \\(\\phi(n) = n \\sum_{d \\mid n} \\mu(d)/d\\).',
                    hint: 'Substitute \\(\\phi(n) = \\sum_{d \\mid n} \\mu(d) (n/d)\\), swap order of summation: \\(\\Phi(x) = \\sum_{d \\le x} \\mu(d) \\sum_{m \\le x/d} m\\). Use \\(\\sum_{m \\le y} m = y^2/2 + O(y)\\) and \\(\\sum_{d=1}^\\infty \\mu(d)/d^2 = 6/\\pi^2\\).',
                    solution: '\\(\\Phi(x) = \\sum_{d \\le x} \\mu(d) \\frac{(x/d)^2}{2} + O(x/d) = \\frac{x^2}{2} \\sum_{d \\le x} \\frac{\\mu(d)}{d^2} + O(x\\log x)\\). Since \\(\\sum_{d=1}^\\infty \\mu(d)/d^2 = 1/\\zeta(2) = 6/\\pi^2\\) and the tail \\(\\sum_{d > x} \\mu(d)/d^2 = O(1/x)\\): \\(\\Phi(x) = \\frac{3x^2}{\\pi^2} + O(x\\log x)\\).'
                },
                {
                    question: 'Show that \\(\\sum_{p \\le x} \\frac{1}{p} \\sim \\log\\log x\\) is equivalent (via Abel summation) to \\(\\pi(x) \\sim x/\\log x\\). This is part of the proof that the average order of \\(\\mathbf{1}_{\\text{prime}}\\) is \\(1/\\log n\\).',
                    hint: 'Let \\(a(n) = \\mathbf{1}_{\\text{prime}}(n)/\\log n\\) and apply Abel to \\(\\sum_{p \\le x} 1/p = \\sum a(n)\\log n \\cdot (1/\\log n) \\cdot (1/n) \\cdot n\\ldots\\) More directly: Abel on \\(\\pi(t)\\) with \\(f(t) = 1/(t\\log t)\\).',
                    solution: 'Abel summation: \\(\\sum_{p \\le x} 1/p = \\pi(x)/(x\\log x) + \\int_2^x \\pi(t)/(t\\log t)^\\prime\\ldots\\). If \\(\\pi(t) \\sim t/\\log t\\), then \\(\\int_2^x \\frac{\\pi(t)}{t(\\log t)^2}\\,dt \\sim \\int_2^x \\frac{1}{(\\log t)^2 } \\cdot \\frac{1}{\\log t}\\,dt\\) ... the standard computation yields \\(\\log\\log x + M\\) for a constant \\(M\\) (Mertens\' constant). The equivalence is bidirectional via partial summation.'
                }
            ]
        }
    ]
});
