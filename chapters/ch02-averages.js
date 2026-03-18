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
    <div class="env-title">The Central Problem</div>
    <div class="env-body">
        <p>Individual values of arithmetic functions like \\(d(n)\\), \\(\\varphi(n)\\), or \\(\\Lambda(n)\\) jump around wildly. The divisor function \\(d(n)\\) equals 2 at every prime but can be arbitrarily large at highly composite numbers. Trying to understand these functions one value at a time is like trying to understand a coastline by examining individual grains of sand. The right move is to step back and look at the average.</p>
    </div>
</div>

<p>The key idea of this chapter is deceptively simple: if \\(f(n)\\) is too irregular to study directly, study its <strong>summatory function</strong></p>

\\[
F(x) = \\sum_{n \\le x} f(n)
\\]

<p>instead. Summation smooths out fluctuations. Even though \\(d(n)\\) oscillates unpredictably, the sum \\(\\sum_{n \\le x} d(n)\\) grows like \\(x \\log x\\), which tells us the <em>average</em> number of divisors near \\(x\\) is about \\(\\log x\\).</p>

<div class="env-block definition">
    <div class="env-title">Definition (Average Order)</div>
    <div class="env-body">
        <p>We say \\(g(n)\\) is the <strong>average order</strong> of an arithmetic function \\(f(n)\\) if</p>
        \\[
        \\sum_{n \\le x} f(n) \\sim \\sum_{n \\le x} g(n) \\quad \\text{as } x \\to \\infty,
        \\]
        <p>that is, the ratio of the two sums tends to 1.</p>
    </div>
</div>

<p>This is a weaker statement than pointwise approximation. The average order of \\(d(n)\\) is \\(\\log n\\), but \\(d(n)\\) can be much larger or smaller than \\(\\log n\\) for any particular \\(n\\). The average captures the typical behavior.</p>

<div class="env-block example">
    <div class="env-title">Example: Classical Average Orders</div>
    <div class="env-body">
        <p>Several fundamental results in analytic number theory take the form of average-order statements:</p>
        <ul>
            <li>\\(d(n)\\) has average order \\(\\log n\\): \\(\\sum_{n \\le x} d(n) \\sim x \\log x\\)</li>
            <li>\\(\\sigma(n)/n\\) has average order \\(\\pi^2/6\\): \\(\\sum_{n \\le x} \\sigma(n) \\sim \\frac{\\pi^2}{12} x^2\\)</li>
            <li>\\(\\varphi(n)\\) has average order \\(\\frac{3}{\\pi^2} n\\): \\(\\sum_{n \\le x} \\varphi(n) \\sim \\frac{3}{\\pi^2} x^2\\)</li>
            <li>\\(\\Lambda(n)\\) has average order 1: \\(\\sum_{n \\le x} \\Lambda(n) \\sim x\\) (equivalent to PNT)</li>
        </ul>
    </div>
</div>

<div class="env-block remark">
    <div class="env-title">Why This Matters</div>
    <div class="env-body">
        <p>The last statement, \\(\\psi(x) = \\sum_{n \\le x} \\Lambda(n) \\sim x\\), is <em>equivalent</em> to the Prime Number Theorem. The entire program of proving PNT reduces to understanding the average behavior of the von Mangoldt function. This is why summatory functions are the central objects of analytic number theory, not the arithmetic functions themselves.</p>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-running-averages"></div>
`,
            visualizations: [
                {
                    id: 'viz-running-averages',
                    title: 'Running Averages of Arithmetic Functions',
                    description: 'Watch how the running average (1/x)\\sum_{n<=x} f(n) stabilizes as x grows, even though f(n) itself oscillates wildly. Compare d(n), phi(n), and Lambda(n).',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 380,
                            originX: 60, originY: 320, scale: 1
                        });

                        var N = 200;
                        var funcChoice = 0; // 0 = d(n), 1 = phi(n), 2 = Lambda(n)
                        var funcNames = ['d(n): divisor function', 'phi(n): Euler totient', 'Lambda(n): von Mangoldt'];
                        var avgLabels = ['avg ~ log(n)', 'avg ~ 3n/pi^2', 'avg ~ 1 (PNT)'];

                        VizEngine.createSlider(controls, 'N', 50, 500, N, 50, function(v) {
                            N = Math.round(v);
                            draw();
                        });

                        var btnD = VizEngine.createButton(controls, 'd(n)', function() { funcChoice = 0; draw(); });
                        var btnPhi = VizEngine.createButton(controls, '\u03C6(n)', function() { funcChoice = 1; draw(); });
                        var btnLambda = VizEngine.createButton(controls, '\u039B(n)', function() { funcChoice = 2; draw(); });

                        // Compute arithmetic functions
                        function divisorCount(n) {
                            var count = 0;
                            for (var d = 1; d * d <= n; d++) {
                                if (n % d === 0) { count += (d * d === n) ? 1 : 2; }
                            }
                            return count;
                        }

                        function eulerPhi(n) {
                            var result = n;
                            var p = 2;
                            var m = n;
                            while (p * p <= m) {
                                if (m % p === 0) {
                                    while (m % p === 0) m /= p;
                                    result -= result / p;
                                }
                                p++;
                            }
                            if (m > 1) result -= result / m;
                            return Math.round(result);
                        }

                        function vonMangoldt(n) {
                            if (n < 2) return 0;
                            var p = 2;
                            while (p * p <= n) {
                                if (n % p === 0) {
                                    // Check if n is a power of p
                                    while (n > 1) {
                                        if (n % p !== 0) return 0;
                                        n /= p;
                                    }
                                    return Math.log(p);
                                }
                                p++;
                            }
                            return Math.log(n); // n is prime
                        }

                        function getFunc(n) {
                            if (funcChoice === 0) return divisorCount(n);
                            if (funcChoice === 1) return eulerPhi(n);
                            return vonMangoldt(n);
                        }

                        function getAvgPrediction(n) {
                            if (funcChoice === 0) return Math.log(n);
                            if (funcChoice === 1) return (3 / (Math.PI * Math.PI)) * n;
                            return 1;
                        }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            viz.screenText(funcNames[funcChoice], viz.width / 2, 18, viz.colors.white, 14);

                            // Compute values and running averages
                            var vals = [];
                            var runAvgs = [];
                            var sum = 0;
                            var maxVal = 0;
                            var maxAvg = 0;

                            for (var n = 1; n <= N; n++) {
                                var v = getFunc(n);
                                vals.push(v);
                                sum += v;
                                runAvgs.push(sum / n);
                                if (v > maxVal) maxVal = v;
                                if (sum / n > maxAvg) maxAvg = sum / n;
                            }

                            // Also track predicted average
                            var predMax = 0;
                            for (var i = 1; i <= N; i++) {
                                var pred = getAvgPrediction(i);
                                if (pred > predMax) predMax = pred;
                            }

                            var yMax = Math.max(maxAvg, predMax) * 1.3;
                            if (yMax < 1) yMax = 2;

                            var chartL = 60;
                            var chartR = viz.width - 30;
                            var chartT = 40;
                            var chartB = 310;
                            var chartW = chartR - chartL;
                            var chartH = chartB - chartT;

                            // Axes
                            ctx.strokeStyle = viz.colors.axis;
                            ctx.lineWidth = 1;
                            ctx.beginPath();
                            ctx.moveTo(chartL, chartB);
                            ctx.lineTo(chartR, chartB);
                            ctx.stroke();
                            ctx.beginPath();
                            ctx.moveTo(chartL, chartB);
                            ctx.lineTo(chartL, chartT);
                            ctx.stroke();

                            // Y-axis labels
                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '10px -apple-system,sans-serif';
                            ctx.textAlign = 'right';
                            ctx.textBaseline = 'middle';
                            for (var tick = 0; tick <= 4; tick++) {
                                var yVal = (yMax * tick / 4);
                                var sy = chartB - (tick / 4) * chartH;
                                ctx.fillText(yVal.toFixed(1), chartL - 6, sy);
                                ctx.strokeStyle = viz.colors.grid;
                                ctx.lineWidth = 0.5;
                                ctx.beginPath();
                                ctx.moveTo(chartL, sy);
                                ctx.lineTo(chartR, sy);
                                ctx.stroke();
                            }

                            // X-axis labels
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'top';
                            var xStep = Math.max(1, Math.round(N / 6));
                            for (var xn = xStep; xn <= N; xn += xStep) {
                                var sx = chartL + (xn / N) * chartW;
                                ctx.fillText(xn.toString(), sx, chartB + 4);
                            }

                            // Plot individual values as faint dots
                            for (var j = 0; j < N; j++) {
                                var px = chartL + ((j + 1) / N) * chartW;
                                var py = chartB - (vals[j] / yMax) * chartH;
                                if (py < chartT) py = chartT;
                                ctx.fillStyle = viz.colors.blue + '44';
                                ctx.beginPath();
                                ctx.arc(px, py, 1.5, 0, Math.PI * 2);
                                ctx.fill();
                            }

                            // Plot running average
                            ctx.strokeStyle = viz.colors.teal;
                            ctx.lineWidth = 2;
                            ctx.beginPath();
                            for (var k = 0; k < N; k++) {
                                var ax = chartL + ((k + 1) / N) * chartW;
                                var ay = chartB - (runAvgs[k] / yMax) * chartH;
                                if (ay < chartT) ay = chartT;
                                if (k === 0) ctx.moveTo(ax, ay);
                                else ctx.lineTo(ax, ay);
                            }
                            ctx.stroke();

                            // Plot predicted average
                            ctx.strokeStyle = viz.colors.orange;
                            ctx.lineWidth = 1.5;
                            ctx.setLineDash([6, 4]);
                            ctx.beginPath();
                            for (var m = 0; m < N; m++) {
                                var bx = chartL + ((m + 1) / N) * chartW;
                                var by = chartB - (getAvgPrediction(m + 1) / yMax) * chartH;
                                if (by < chartT) by = chartT;
                                if (m === 0) ctx.moveTo(bx, by);
                                else ctx.lineTo(bx, by);
                            }
                            ctx.stroke();
                            ctx.setLineDash([]);

                            // Legend
                            var legY = chartB + 26;
                            ctx.font = '11px -apple-system,sans-serif';
                            ctx.textAlign = 'left';

                            ctx.fillStyle = viz.colors.blue + '88';
                            ctx.fillRect(chartL, legY, 12, 12);
                            ctx.fillStyle = viz.colors.text;
                            ctx.fillText('f(n) values', chartL + 16, legY + 10);

                            ctx.fillStyle = viz.colors.teal;
                            ctx.fillRect(chartL + 120, legY, 12, 12);
                            ctx.fillStyle = viz.colors.text;
                            ctx.fillText('running avg', chartL + 136, legY + 10);

                            ctx.fillStyle = viz.colors.orange;
                            ctx.fillRect(chartL + 240, legY, 12, 12);
                            ctx.fillStyle = viz.colors.text;
                            ctx.fillText(avgLabels[funcChoice], chartL + 256, legY + 10);
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Compute \\(\\frac{1}{10}\\sum_{n=1}^{10} d(n)\\) directly. Compare with \\(\\log 10 \\approx 2.303\\).',
                    hint: 'List d(1) through d(10): d(1)=1, d(2)=2, d(3)=2, d(4)=3, d(5)=2, d(6)=4, d(7)=2, d(8)=4, d(9)=3, d(10)=4.',
                    solution: 'The sum is 1+2+2+3+2+4+2+4+3+4 = 27, so the average is 2.7. This is reasonably close to \\(\\log 10 \\approx 2.303\\). The discrepancy is not a contradiction: the asymptotic statement \\(\\sum_{n \\le x} d(n) \\sim x \\log x\\) only claims the ratio tends to 1 as \\(x \\to \\infty\\). At \\(x = 10\\) we are far from the asymptotic regime.'
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

<div class="env-block intuition">
    <div class="env-title">The Big Three</div>
    <div class="env-body">
        <p>Three summatory functions dominate analytic number theory. Each encodes different information about the primes, and their asymptotic behavior is intimately connected to deep theorems.</p>
    </div>
</div>

<h3>The Divisor Summatory Function \\(D(x)\\)</h3>

<div class="env-block definition">
    <div class="env-title">Definition</div>
    <div class="env-body">
        <p>The <strong>divisor summatory function</strong> is</p>
        \\[
        D(x) = \\sum_{n \\le x} d(n),
        \\]
        <p>where \\(d(n) = \\sum_{d \\mid n} 1\\) counts the number of positive divisors of \\(n\\).</p>
    </div>
</div>

<p>We can rewrite this sum in a revealing way. Since \\(d(n) = \\sum_{d \\mid n} 1\\), we have</p>

\\[
D(x) = \\sum_{n \\le x} \\sum_{d \\mid n} 1 = \\sum_{d \\le x} \\left\\lfloor \\frac{x}{d} \\right\\rfloor.
\\]

<p>The last step swaps the order of summation: instead of summing over \\(n\\) and then its divisors, we sum over each potential divisor \\(d\\) and count how many multiples of \\(d\\) are at most \\(x\\). This is a key technique that recurs throughout the subject.</p>

<div class="env-block theorem">
    <div class="env-title">Theorem 2.1 (Dirichlet, 1849)</div>
    <div class="env-body">
        <p>For \\(x \\ge 1\\),</p>
        \\[
        D(x) = x \\log x + (2\\gamma - 1)x + O(\\sqrt{x}),
        \\]
        <p>where \\(\\gamma \\approx 0.5772\\) is the Euler-Mascheroni constant.</p>
    </div>
</div>

<h3>Euler's Totient Summatory Function \\(\\Phi(x)\\)</h3>

<div class="env-block definition">
    <div class="env-title">Definition</div>
    <div class="env-body">
        <p>The <strong>totient summatory function</strong> is</p>
        \\[
        \\Phi(x) = \\sum_{n \\le x} \\varphi(n).
        \\]
    </div>
</div>

<div class="env-block theorem">
    <div class="env-title">Theorem 2.2</div>
    <div class="env-body">
        <p>For \\(x \\ge 1\\),</p>
        \\[
        \\Phi(x) = \\frac{3}{\\pi^2} x^2 + O(x \\log x).
        \\]
        <p>Equivalently, the average value of \\(\\varphi(n)/n\\) is \\(6/\\pi^2 = 1/\\zeta(2)\\). This says that the "probability" that two random integers are coprime is \\(6/\\pi^2 \\approx 0.6079\\).</p>
    </div>
</div>

<h3>Chebyshev's Function \\(\\psi(x)\\)</h3>

<div class="env-block definition">
    <div class="env-title">Definition</div>
    <div class="env-body">
        <p>The <strong>Chebyshev psi function</strong> is</p>
        \\[
        \\psi(x) = \\sum_{n \\le x} \\Lambda(n) = \\sum_{p^k \\le x} \\log p,
        \\]
        <p>where the von Mangoldt function \\(\\Lambda(n) = \\log p\\) if \\(n = p^k\\) for some prime \\(p\\) and integer \\(k \\ge 1\\), and \\(\\Lambda(n) = 0\\) otherwise.</p>
    </div>
</div>

<div class="env-block theorem">
    <div class="env-title">Theorem 2.3 (Prime Number Theorem, equivalent form)</div>
    <div class="env-body">
        <p>\\[\\psi(x) \\sim x \\quad \\text{as } x \\to \\infty.\\]</p>
        <p>This is equivalent to \\(\\pi(x) \\sim x/\\log x\\). The function \\(\\psi(x)\\) is analytically more natural than \\(\\pi(x)\\) because \\(\\Lambda(n)\\) is multiplicative-friendly and connects directly to the zeros of \\(\\zeta(s)\\) via the explicit formula.</p>
    </div>
</div>

<div class="env-block remark">
    <div class="env-title">Chebyshev's Bounds (1852)</div>
    <div class="env-body">
        <p>Before the PNT was proved, Chebyshev showed that there exist constants \\(A < 1 < B\\) such that</p>
        \\[Ax < \\psi(x) < Bx\\]
        <p>for all large \\(x\\). He obtained \\(A \\approx 0.921\\) and \\(B \\approx 1.106\\). This was already enough to prove Bertrand's postulate: there is always a prime between \\(n\\) and \\(2n\\).</p>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-psi-chebyshev"></div>
`,
            visualizations: [
                {
                    id: 'viz-psi-chebyshev',
                    title: 'Chebyshev\'s psi(x) vs x',
                    description: 'The Chebyshev function psi(x) counts primes (weighted by log p) and prime powers. Watch how psi(x)/x converges to 1, confirming the PNT. The jumps occur at prime powers.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 380,
                            originX: 60, originY: 320, scale: 1
                        });

                        var xMax = 200;
                        VizEngine.createSlider(controls, 'x max', 50, 1000, xMax, 50, function(v) {
                            xMax = Math.round(v);
                            draw();
                        });

                        var showRatio = false;
                        VizEngine.createButton(controls, 'Toggle \u03C8(x)/x', function() {
                            showRatio = !showRatio;
                            draw();
                        });

                        var primes = VizEngine.sievePrimes(1100);

                        function vonMangoldt(n) {
                            if (n < 2) return 0;
                            for (var i = 0; i < primes.length; i++) {
                                var p = primes[i];
                                if (p * p > n) break;
                                if (n % p === 0) {
                                    var m = n;
                                    while (m > 1) {
                                        if (m % p !== 0) return 0;
                                        m /= p;
                                    }
                                    return Math.log(p);
                                }
                            }
                            return Math.log(n);
                        }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            var chartL = 60, chartR = viz.width - 30;
                            var chartT = 40, chartB = 310;
                            var chartW = chartR - chartL;
                            var chartH = chartB - chartT;

                            // Compute psi
                            var psi = 0;
                            var psiVals = [0]; // psi(0) = 0
                            for (var n = 1; n <= xMax; n++) {
                                psi += vonMangoldt(n);
                                psiVals.push(psi);
                            }

                            if (showRatio) {
                                viz.screenText('\u03C8(x) / x', viz.width / 2, 18, viz.colors.white, 14);

                                // Y range for ratio
                                var yMin = 0.7, yMax2 = 1.3;

                                // Axes
                                ctx.strokeStyle = viz.colors.axis; ctx.lineWidth = 1;
                                ctx.beginPath(); ctx.moveTo(chartL, chartB); ctx.lineTo(chartR, chartB); ctx.stroke();
                                ctx.beginPath(); ctx.moveTo(chartL, chartB); ctx.lineTo(chartL, chartT); ctx.stroke();

                                // Horizontal line at 1
                                var y1 = chartB - ((1 - yMin) / (yMax2 - yMin)) * chartH;
                                ctx.strokeStyle = viz.colors.orange;
                                ctx.lineWidth = 1.5;
                                ctx.setLineDash([6, 4]);
                                ctx.beginPath(); ctx.moveTo(chartL, y1); ctx.lineTo(chartR, y1); ctx.stroke();
                                ctx.setLineDash([]);

                                ctx.fillStyle = viz.colors.orange;
                                ctx.font = '11px -apple-system,sans-serif';
                                ctx.textAlign = 'left';
                                ctx.fillText('PNT: ratio \u2192 1', chartR - 100, y1 - 10);

                                // Y labels
                                ctx.fillStyle = viz.colors.text;
                                ctx.font = '10px -apple-system,sans-serif';
                                ctx.textAlign = 'right';
                                ctx.textBaseline = 'middle';
                                for (var t = 0; t <= 4; t++) {
                                    var yv = yMin + (yMax2 - yMin) * t / 4;
                                    var sy = chartB - (t / 4) * chartH;
                                    ctx.fillText(yv.toFixed(2), chartL - 6, sy);
                                }

                                // Plot ratio
                                ctx.strokeStyle = viz.colors.teal;
                                ctx.lineWidth = 2;
                                ctx.beginPath();
                                var started = false;
                                for (var i = 2; i <= xMax; i++) {
                                    var ratio = psiVals[i] / i;
                                    var px = chartL + (i / xMax) * chartW;
                                    var py = chartB - ((ratio - yMin) / (yMax2 - yMin)) * chartH;
                                    py = Math.max(chartT, Math.min(chartB, py));
                                    if (!started) { ctx.moveTo(px, py); started = true; }
                                    else ctx.lineTo(px, py);
                                }
                                ctx.stroke();
                            } else {
                                viz.screenText('\u03C8(x) = \u03A3 \u039B(n) for n \u2264 x', viz.width / 2, 18, viz.colors.white, 14);

                                var yMaxVal = Math.max(psiVals[xMax], xMax) * 1.1;

                                // Axes
                                ctx.strokeStyle = viz.colors.axis; ctx.lineWidth = 1;
                                ctx.beginPath(); ctx.moveTo(chartL, chartB); ctx.lineTo(chartR, chartB); ctx.stroke();
                                ctx.beginPath(); ctx.moveTo(chartL, chartB); ctx.lineTo(chartL, chartT); ctx.stroke();

                                // Y labels
                                ctx.fillStyle = viz.colors.text;
                                ctx.font = '10px -apple-system,sans-serif';
                                ctx.textAlign = 'right';
                                ctx.textBaseline = 'middle';
                                for (var t2 = 0; t2 <= 4; t2++) {
                                    var yv2 = (yMaxVal * t2 / 4);
                                    var sy2 = chartB - (t2 / 4) * chartH;
                                    ctx.fillText(Math.round(yv2).toString(), chartL - 6, sy2);
                                }

                                // Plot y=x line
                                ctx.strokeStyle = viz.colors.orange;
                                ctx.lineWidth = 1.5;
                                ctx.setLineDash([6, 4]);
                                ctx.beginPath();
                                ctx.moveTo(chartL, chartB);
                                var endY = chartB - (xMax / yMaxVal) * chartH;
                                ctx.lineTo(chartR, endY);
                                ctx.stroke();
                                ctx.setLineDash([]);

                                ctx.fillStyle = viz.colors.orange;
                                ctx.font = '11px -apple-system,sans-serif';
                                ctx.textAlign = 'left';
                                ctx.fillText('y = x', chartR - 40, endY - 10);

                                // Plot psi(x) as step function
                                ctx.strokeStyle = viz.colors.teal;
                                ctx.lineWidth = 2;
                                ctx.beginPath();
                                for (var j = 0; j <= xMax; j++) {
                                    var px2 = chartL + (j / xMax) * chartW;
                                    var py2 = chartB - (psiVals[j] / yMaxVal) * chartH;
                                    if (j === 0) ctx.moveTo(px2, py2);
                                    else ctx.lineTo(px2, py2);
                                }
                                ctx.stroke();
                            }

                            // X-axis labels
                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '10px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'top';
                            var xStep = Math.max(1, Math.round(xMax / 6));
                            for (var xl = xStep; xl <= xMax; xl += xStep) {
                                var sxl = chartL + (xl / xMax) * chartW;
                                ctx.fillText(xl.toString(), sxl, chartB + 4);
                            }

                            // Legend
                            var legY = chartB + 26;
                            ctx.font = '11px -apple-system,sans-serif';
                            ctx.textAlign = 'left';
                            ctx.fillStyle = viz.colors.teal;
                            ctx.fillRect(chartL, legY, 12, 12);
                            ctx.fillStyle = viz.colors.text;
                            ctx.fillText(showRatio ? '\u03C8(x)/x' : '\u03C8(x)', chartL + 16, legY + 10);
                            ctx.fillStyle = viz.colors.orange;
                            ctx.fillRect(chartL + 100, legY, 12, 12);
                            ctx.fillStyle = viz.colors.text;
                            ctx.fillText(showRatio ? 'PNT limit = 1' : 'y = x', chartL + 116, legY + 10);
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Show that \\(D(x) = \\sum_{d \\le x} \\lfloor x/d \\rfloor\\) by exchanging the order of summation in \\(\\sum_{n \\le x} \\sum_{d \\mid n} 1\\).',
                    hint: 'Write the double sum as \\(\\sum_{d \\ge 1} \\sum_{\\substack{n \\le x \\\\ d \\mid n}} 1\\). How many multiples of \\(d\\) are at most \\(x\\)?',
                    solution: 'We have \\(\\sum_{n \\le x} d(n) = \\sum_{n \\le x} \\sum_{d \\mid n} 1 = \\sum_{d=1}^{\\lfloor x \\rfloor} \\sum_{\\substack{n \\le x \\\\ d \\mid n}} 1\\). The inner sum counts multiples of \\(d\\) up to \\(x\\), which is \\(\\lfloor x/d \\rfloor\\). So \\(D(x) = \\sum_{d \\le x} \\lfloor x/d \\rfloor\\).'
                },
                {
                    question: 'Using the identity \\(\\sum_{d \\mid n} \\varphi(d) = n\\), show that \\(\\Phi(x) = \\sum_{n \\le x} \\varphi(n)\\) can be expressed in terms of \\(\\lfloor x/d \\rfloor\\).',
                    hint: 'Start from \\(\\sum_{n \\le x} n = \\sum_{n \\le x} \\sum_{d \\mid n} \\varphi(d)\\) and swap the order of summation.',
                    solution: 'We have \\(\\sum_{n \\le x} n = \\sum_{n \\le x} \\sum_{d \\mid n} \\varphi(d) = \\sum_{d \\le x} \\varphi(d) \\lfloor x/d \\rfloor\\). Since \\(\\sum_{n \\le x} n = \\lfloor x \\rfloor(\\lfloor x \\rfloor + 1)/2\\), this gives a relationship between \\(\\Phi(x)\\) and the floor function sums. This can be inverted using Mobius inversion to obtain \\(\\Phi(x)\\) asymptotics.'
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

<div class="env-block intuition">
    <div class="env-title">Discrete Integration by Parts</div>
    <div class="env-body">
        <p>Abel summation is the discrete analogue of integration by parts. Just as \\(\\int u \\, dv = uv - \\int v \\, du\\) converts one integral into another, Abel summation converts a sum \\(\\sum a(n) f(n)\\) into an integral involving the partial sums \\(A(x) = \\sum_{n \\le x} a(n)\\). This is powerful because it lets us exploit smooth information about \\(f\\) (which we can integrate) together with average-order information about \\(a(n)\\) (which is what \\(A(x)\\) encodes).</p>
    </div>
</div>

<div class="env-block theorem">
    <div class="env-title">Theorem 2.4 (Abel Summation Formula)</div>
    <div class="env-body">
        <p>Let \\(a(n)\\) be an arithmetic function and let \\(A(x) = \\sum_{n \\le x} a(n)\\). If \\(f\\) is a function with a continuous derivative on \\([1, x]\\), then</p>
        \\[
        \\sum_{n \\le x} a(n) f(n) = A(x) f(x) - \\int_1^x A(t) f'(t) \\, dt.
        \\]
    </div>
</div>

<div class="env-block proof">
    <div class="env-title">Proof Sketch</div>
    <div class="env-body">
        <p>Write \\(a(n) = A(n) - A(n-1)\\), so</p>
        \\[
        \\sum_{n=1}^{N} a(n) f(n) = \\sum_{n=1}^{N} [A(n) - A(n-1)] f(n).
        \\]
        <p>Rearranging (the discrete analogue of integration by parts):</p>
        \\[
        = A(N) f(N) - \\sum_{n=1}^{N-1} A(n) [f(n+1) - f(n)].
        \\]
        <p>Since \\(f\\) is \\(C^1\\), we have \\(f(n+1) - f(n) = \\int_n^{n+1} f'(t) \\, dt\\), and on each interval \\([n, n+1)\\), \\(A(t) = A(n)\\). Combining these gives the result.</p>
    </div>
</div>

<div class="env-block example">
    <div class="env-title">Example: Partial Sums of \\(1/n\\)</div>
    <div class="env-body">
        <p>Take \\(a(n) = 1\\) (so \\(A(x) = \\lfloor x \\rfloor\\)) and \\(f(t) = 1/t\\). Abel summation gives</p>
        \\[
        \\sum_{n \\le x} \\frac{1}{n} = \\frac{\\lfloor x \\rfloor}{x} + \\int_1^x \\frac{\\lfloor t \\rfloor}{t^2} \\, dt.
        \\]
        <p>Writing \\(\\lfloor t \\rfloor = t - \\{t\\}\\) where \\(\\{t\\}\\) is the fractional part, this becomes</p>
        \\[
        = 1 - \\frac{\\{x\\}}{x} + \\log x - \\int_1^x \\frac{\\{t\\}}{t^2} \\, dt = \\log x + \\gamma + O(1/x),
        \\]
        <p>where \\(\\gamma = 1 - \\int_1^\\infty \\{t\\}/t^2 \\, dt\\) is the Euler-Mascheroni constant.</p>
    </div>
</div>

<div class="env-block example">
    <div class="env-title">Example: From \\(\\psi(x) \\sim x\\) to PNT</div>
    <div class="env-body">
        <p>Take \\(a(n) = \\Lambda(n)\\) and \\(f(t) = 1/\\log t\\). Then \\(\\sum_{n \\le x} \\Lambda(n)/\\log n\\) is closely related to \\(\\pi(x)\\) (each prime \\(p\\) contributes \\(\\log p / \\log p = 1\\)). Abel summation converts the asymptotic \\(\\psi(x) \\sim x\\) into \\(\\pi(x) \\sim x/\\log x\\). This is how the PNT in the form \\(\\psi(x) \\sim x\\) implies the classical statement \\(\\pi(x) \\sim x/\\log x\\).</p>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-abel-summation"></div>
`,
            visualizations: [
                {
                    id: 'viz-abel-summation',
                    title: 'Abel Summation: Geometric Interpretation',
                    description: 'Abel summation decomposes sum a(n)f(n) into a boundary term A(x)f(x) minus an integral. The shaded area shows the integral term. Drag x to see how the decomposition works.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 380,
                            originX: 60, originY: 330, scale: 25
                        });

                        var xVal = 8;
                        VizEngine.createSlider(controls, 'x', 3, 15, xVal, 1, function(v) {
                            xVal = Math.round(v);
                            draw();
                        });

                        // a(n) = 1, f(t) = 1/t, A(x) = floor(x)
                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            viz.screenText('Abel summation: \u03A3 1/n = \u230Ax\u230B/x + \u222B \u230At\u230B/t\u00B2 dt', viz.width / 2, 18, viz.colors.white, 13);

                            var chartL = 60, chartR = viz.width - 30;
                            var chartT = 40, chartB = 320;
                            var chartW = chartR - chartL;
                            var chartH = chartB - chartT;

                            var xRange = xVal + 1;
                            var yMax = 1.2;

                            // Map math coords to pixel
                            function toPixel(x, y) {
                                return [chartL + (x / xRange) * chartW, chartB - (y / yMax) * chartH];
                            }

                            // Axes
                            ctx.strokeStyle = viz.colors.axis; ctx.lineWidth = 1;
                            ctx.beginPath(); ctx.moveTo(chartL, chartB); ctx.lineTo(chartR, chartB); ctx.stroke();
                            ctx.beginPath(); ctx.moveTo(chartL, chartB); ctx.lineTo(chartL, chartT); ctx.stroke();

                            // Shade the integral: A(t)/t^2 between 1 and x
                            // A(t) = floor(t), so we draw rectangles
                            for (var n = 1; n < xVal; n++) {
                                var leftX = n;
                                var rightX = n + 1;
                                if (rightX > xVal) rightX = xVal;
                                // On [n, n+1), A(t) = n, so A(t)/t^2 area
                                // We shade below f(t) = 1/t from leftX to rightX, height A(n)*(1/t - 1/(t+dt))
                                // Actually let's shade A(t)*f'(t) area = floor(t)/t^2
                                var steps = 20;
                                ctx.fillStyle = viz.colors.teal + '33';
                                ctx.beginPath();
                                var p0 = toPixel(leftX, 0);
                                ctx.moveTo(p0[0], p0[1]);
                                for (var s = 0; s <= steps; s++) {
                                    var t = leftX + (rightX - leftX) * s / steps;
                                    var val = n / (t * t);
                                    var pp = toPixel(t, Math.min(val, yMax));
                                    ctx.lineTo(pp[0], pp[1]);
                                }
                                var pEnd = toPixel(rightX, 0);
                                ctx.lineTo(pEnd[0], pEnd[1]);
                                ctx.closePath();
                                ctx.fill();
                            }

                            // Draw f(t) = 1/t
                            ctx.strokeStyle = viz.colors.blue;
                            ctx.lineWidth = 2;
                            ctx.beginPath();
                            var started = false;
                            for (var i = 0; i <= 300; i++) {
                                var t = 0.3 + (xRange - 0.3) * i / 300;
                                var fv = 1 / t;
                                if (fv > yMax * 1.2) continue;
                                var p = toPixel(t, fv);
                                if (!started) { ctx.moveTo(p[0], p[1]); started = true; }
                                else ctx.lineTo(p[0], p[1]);
                            }
                            ctx.stroke();

                            // Draw step function A(t)/t^2
                            ctx.strokeStyle = viz.colors.teal;
                            ctx.lineWidth = 1.5;
                            for (var k = 1; k < xVal; k++) {
                                var lx = k, rx = Math.min(k + 1, xVal);
                                ctx.beginPath();
                                for (var s2 = 0; s2 <= 40; s2++) {
                                    var t2 = lx + (rx - lx) * s2 / 40;
                                    var val2 = k / (t2 * t2);
                                    var p2 = toPixel(t2, Math.min(val2, yMax));
                                    if (s2 === 0) ctx.moveTo(p2[0], p2[1]);
                                    else ctx.lineTo(p2[0], p2[1]);
                                }
                                ctx.stroke();
                            }

                            // Mark the points 1/n
                            for (var m = 1; m <= xVal; m++) {
                                var pm = toPixel(m, 1 / m);
                                ctx.fillStyle = viz.colors.orange;
                                ctx.beginPath();
                                ctx.arc(pm[0], pm[1], 4, 0, Math.PI * 2);
                                ctx.fill();
                            }

                            // Show sum value
                            var harmonicSum = 0;
                            for (var h = 1; h <= xVal; h++) harmonicSum += 1 / h;
                            var euler = 0.5772156649;

                            viz.screenText('H(' + xVal + ') = \u03A3 1/n = ' + harmonicSum.toFixed(4), viz.width / 2, chartB + 24, viz.colors.white, 12);
                            viz.screenText('log(' + xVal + ') + \u03B3 = ' + (Math.log(xVal) + euler).toFixed(4), viz.width / 2, chartB + 40, viz.colors.orange, 11);

                            // Labels
                            ctx.fillStyle = viz.colors.blue;
                            ctx.font = '12px -apple-system,sans-serif';
                            ctx.textAlign = 'left';
                            var lbl1 = toPixel(1.5, 1 / 1.5);
                            ctx.fillText('f(t) = 1/t', lbl1[0] + 10, lbl1[1] - 6);

                            ctx.fillStyle = viz.colors.teal;
                            var lbl2 = toPixel(3, 2 / 9);
                            ctx.fillText('\u230At\u230B/t\u00B2', lbl2[0] + 10, lbl2[1] - 6);

                            // X labels
                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '10px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'top';
                            for (var xl = 1; xl <= xVal; xl++) {
                                var sxl = toPixel(xl, 0);
                                ctx.fillText(xl.toString(), sxl[0], chartB + 4);
                            }
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Use Abel summation with \\(a(n) = 1\\) and \\(f(t) = \\log t\\) to derive an asymptotic formula for \\(\\sum_{n \\le x} \\log n = \\log(\\lfloor x \\rfloor!)\\).',
                    hint: 'You have \\(A(x) = \\lfloor x \\rfloor\\) and \\(f\'(t) = 1/t\\). Apply the Abel formula and use \\(\\lfloor t \\rfloor = t - \\{t\\}\\).',
                    solution: 'Abel summation gives \\(\\sum_{n \\le x} \\log n = \\lfloor x \\rfloor \\log x - \\int_1^x \\lfloor t \\rfloor / t \\, dt\\). Writing \\(\\lfloor t \\rfloor = t - \\{t\\}\\), the integral becomes \\(\\int_1^x 1 \\, dt - \\int_1^x \\{t\\}/t \\, dt = (x - 1) - \\int_1^x \\{t\\}/t \\, dt\\). The fractional part integral is \\(O(\\log x)\\), giving \\(\\log(\\lfloor x \\rfloor!) = x \\log x - x + O(\\log x)\\), which is Stirling\'s approximation.'
                },
                {
                    question: 'Explain why Abel summation is called "discrete integration by parts." Identify the correspondence: what plays the role of \\(u\\), \\(dv\\), \\(v\\), and \\(du\\)?',
                    hint: 'Compare \\(\\int u \\, dv = uv - \\int v \\, du\\) with \\(\\sum a(n) f(n) = A(x) f(x) - \\int A(t) f\'(t) \\, dt\\).',
                    solution: 'In \\(\\int u \\, dv = uv - \\int v \\, du\\): \\(u \\leftrightarrow f(t)\\) (the smooth function), \\(dv \\leftrightarrow dA(t)\\) (the sum, viewed as a Stieltjes measure), \\(v \\leftrightarrow A(t)\\) (the partial sums), and \\(du \\leftrightarrow f\'(t) \\, dt\\). The Abel formula is literally the Riemann-Stieltjes integration by parts formula \\(\\int_1^x f(t) \\, dA(t) = f(x)A(x) - f(1)A(1) - \\int_1^x A(t) f\'(t) \\, dt\\).'
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

<div class="env-block intuition">
    <div class="env-title">Beyond Abel Summation</div>
    <div class="env-body">
        <p>Abel summation relates a discrete sum to an integral with one correction term. The Euler-Maclaurin formula goes further: it expresses the difference between a sum and an integral as a systematic series of corrections involving higher derivatives, controlled by the Bernoulli numbers. It is the workhorse for computing precise asymptotics.</p>
    </div>
</div>

<h3>Bernoulli Numbers</h3>

<div class="env-block definition">
    <div class="env-title">Definition (Bernoulli Numbers)</div>
    <div class="env-body">
        <p>The <strong>Bernoulli numbers</strong> \\(B_0, B_1, B_2, \\ldots\\) are defined by the generating function</p>
        \\[
        \\frac{t}{e^t - 1} = \\sum_{k=0}^{\\infty} B_k \\frac{t^k}{k!}.
        \\]
        <p>The first several values are: \\(B_0 = 1\\), \\(B_1 = -1/2\\), \\(B_2 = 1/6\\), \\(B_3 = 0\\), \\(B_4 = -1/30\\), \\(B_5 = 0\\), \\(B_6 = 1/42\\). All odd Bernoulli numbers beyond \\(B_1\\) vanish.</p>
    </div>
</div>

<h3>The Formula</h3>

<div class="env-block theorem">
    <div class="env-title">Theorem 2.5 (Euler-Maclaurin Summation Formula)</div>
    <div class="env-body">
        <p>If \\(f\\) has \\(2p\\) continuous derivatives on \\([a, b]\\) where \\(a, b\\) are integers, then</p>
        \\[
        \\sum_{n=a}^{b} f(n) = \\int_a^b f(t) \\, dt + \\frac{f(a) + f(b)}{2} + \\sum_{k=1}^{p} \\frac{B_{2k}}{(2k)!} \\left[ f^{(2k-1)}(b) - f^{(2k-1)}(a) \\right] + R_p,
        \\]
        <p>where the remainder satisfies \\(|R_p| \\le \\frac{2}{(2\\pi)^{2p}} \\int_a^b |f^{(2p)}(t)| \\, dt\\).</p>
    </div>
</div>

<div class="env-block example">
    <div class="env-title">Example: Stirling's Formula via Euler-Maclaurin</div>
    <div class="env-body">
        <p>Apply the Euler-Maclaurin formula to \\(f(t) = \\log t\\) on \\([1, N]\\):</p>
        \\[
        \\log N! = \\sum_{n=1}^{N} \\log n = \\int_1^N \\log t \\, dt + \\frac{\\log N}{2} + \\frac{B_2}{2}\\left(\\frac{1}{N} - 1\\right) + \\cdots
        \\]
        \\[
        = N \\log N - N + 1 + \\frac{\\log N}{2} + \\frac{1}{12N} - 1 + \\cdots
        \\]
        <p>This yields Stirling's approximation \\(N! \\sim \\sqrt{2\\pi N}(N/e)^N\\) with computable correction terms.</p>
    </div>
</div>

<div class="env-block remark">
    <div class="env-title">Connection to the Zeta Function</div>
    <div class="env-body">
        <p>Euler-Maclaurin applied to \\(f(t) = t^{-s}\\) on \\([1, \\infty)\\) gives the analytic continuation of the Riemann zeta function to \\(\\text{Re}(s) > -2p + 1\\). Each Bernoulli correction extends the domain further. This is one of the classical methods for continuing \\(\\zeta(s)\\) beyond \\(\\text{Re}(s) > 1\\).</p>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-euler-maclaurin"></div>
`,
            visualizations: [
                {
                    id: 'viz-euler-maclaurin',
                    title: 'Euler-Maclaurin: Sum vs Integral',
                    description: 'Compare the discrete sum sum f(n) with the integral of f. The Euler-Maclaurin formula explains the difference. The correction terms (involving Bernoulli numbers) close the gap.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 380,
                            originX: 60, originY: 330, scale: 1
                        });

                        var nMax = 10;
                        var pTerms = 0; // number of Euler-Maclaurin correction terms
                        var funcIdx = 0; // 0 = 1/t, 1 = log(t)

                        VizEngine.createSlider(controls, 'N', 3, 30, nMax, 1, function(v) {
                            nMax = Math.round(v);
                            draw();
                        });
                        VizEngine.createSlider(controls, 'Correction terms', 0, 4, pTerms, 1, function(v) {
                            pTerms = Math.round(v);
                            draw();
                        });
                        VizEngine.createButton(controls, 'f = 1/t', function() { funcIdx = 0; draw(); });
                        VizEngine.createButton(controls, 'f = log(t)', function() { funcIdx = 1; draw(); });

                        // Bernoulli numbers B_2, B_4, B_6, B_8
                        var bernoulli = [1/6, -1/30, 1/42, -1/30]; // B_2, B_4, B_6, B_8

                        function f(t) { return funcIdx === 0 ? 1/t : Math.log(t); }
                        // Derivatives of 1/t: f^(k)(t) = (-1)^k k! / t^{k+1}
                        // Derivatives of log(t): f^(k)(t) = (-1)^{k+1} (k-1)! / t^k for k>=1
                        function fDeriv(k, t) {
                            if (funcIdx === 0) {
                                // k-th derivative of 1/t
                                var sign = (k % 2 === 0) ? 1 : -1;
                                var fact = 1; for (var i = 2; i <= k; i++) fact *= i;
                                return sign * fact / Math.pow(t, k + 1);
                            } else {
                                // k-th derivative of log(t)
                                if (k === 0) return Math.log(t);
                                var sign2 = ((k + 1) % 2 === 0) ? 1 : -1;
                                var fact2 = 1; for (var j = 2; j <= k - 1; j++) fact2 *= j;
                                return sign2 * fact2 / Math.pow(t, k);
                            }
                        }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            var fName = funcIdx === 0 ? 'f(t) = 1/t' : 'f(t) = log(t)';
                            viz.screenText('Euler-Maclaurin: ' + fName, viz.width / 2, 18, viz.colors.white, 13);

                            // Compute exact sum
                            var exactSum = 0;
                            for (var n = 1; n <= nMax; n++) exactSum += f(n);

                            // Compute integral
                            var integral;
                            if (funcIdx === 0) integral = Math.log(nMax); // integral of 1/t from 1 to N
                            else integral = nMax * Math.log(nMax) - nMax + 1; // integral of log(t) from 1 to N

                            // Euler-Maclaurin approximation
                            var emApprox = integral + (f(1) + f(nMax)) / 2;
                            for (var p = 0; p < pTerms && p < bernoulli.length; p++) {
                                var k = 2 * (p + 1); // B_{2k}/(2k)!
                                var factK = 1; for (var fi = 2; fi <= k; fi++) factK *= fi;
                                emApprox += bernoulli[p] / factK * (fDeriv(k - 1, nMax) - fDeriv(k - 1, 1));
                            }

                            var error = Math.abs(exactSum - emApprox);
                            var integralError = Math.abs(exactSum - integral);

                            // Bar comparison
                            var barY = 80;
                            var barH = 30;
                            var barMaxW = viz.width - 140;
                            var maxBarVal = Math.max(exactSum, emApprox, integral) * 1.1;

                            // Exact sum bar
                            ctx.fillStyle = viz.colors.blue;
                            ctx.fillRect(120, barY, (exactSum / maxBarVal) * barMaxW, barH);
                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '11px -apple-system,sans-serif';
                            ctx.textAlign = 'right';
                            ctx.textBaseline = 'middle';
                            ctx.fillText('Exact sum:', 115, barY + barH / 2);
                            ctx.textAlign = 'left';
                            ctx.fillStyle = viz.colors.white;
                            ctx.fillText(exactSum.toFixed(6), 120 + (exactSum / maxBarVal) * barMaxW + 6, barY + barH / 2);

                            // Integral bar
                            barY += 45;
                            ctx.fillStyle = viz.colors.orange;
                            ctx.fillRect(120, barY, (integral / maxBarVal) * barMaxW, barH);
                            ctx.fillStyle = viz.colors.text;
                            ctx.textAlign = 'right';
                            ctx.fillText('Integral:', 115, barY + barH / 2);
                            ctx.textAlign = 'left';
                            ctx.fillStyle = viz.colors.white;
                            ctx.fillText(integral.toFixed(6) + '  (err: ' + integralError.toFixed(6) + ')', 120 + (integral / maxBarVal) * barMaxW + 6, barY + barH / 2);

                            // E-M approximation bar
                            barY += 45;
                            ctx.fillStyle = viz.colors.teal;
                            ctx.fillRect(120, barY, Math.max(0, (emApprox / maxBarVal) * barMaxW), barH);
                            ctx.fillStyle = viz.colors.text;
                            ctx.textAlign = 'right';
                            ctx.fillText('E-M (' + pTerms + ' corr):', 115, barY + barH / 2);
                            ctx.textAlign = 'left';
                            ctx.fillStyle = viz.colors.white;
                            ctx.fillText(emApprox.toFixed(6) + '  (err: ' + error.toExponential(2) + ')', 120 + Math.max(0, (emApprox / maxBarVal) * barMaxW) + 6, barY + barH / 2);

                            // Bernoulli numbers table
                            barY += 60;
                            viz.screenText('Bernoulli numbers used:', viz.width / 2, barY, viz.colors.white, 12);
                            barY += 20;
                            var bNames = ['B\u2082 = 1/6', 'B\u2084 = -1/30', 'B\u2086 = 1/42', 'B\u2088 = -1/30'];
                            for (var bi = 0; bi < Math.min(pTerms, 4); bi++) {
                                var bx = 80 + bi * 130;
                                ctx.fillStyle = viz.colors.teal;
                                ctx.font = '11px -apple-system,sans-serif';
                                ctx.textAlign = 'left';
                                ctx.fillText(bNames[bi], bx, barY);
                            }
                            if (pTerms === 0) {
                                ctx.fillStyle = viz.colors.text;
                                ctx.font = '11px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.fillText('(none, using only integral + endpoint average)', viz.width / 2, barY);
                            }

                            viz.screenText('Increasing correction terms improves accuracy exponentially', viz.width / 2, viz.height - 20, viz.colors.text, 11);
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Use the Euler-Maclaurin formula (with \\(p = 1\\)) applied to \\(f(t) = 1/t\\) on \\([1, N]\\) to derive the asymptotic expansion \\(\\sum_{n=1}^{N} 1/n = \\log N + \\gamma + 1/(2N) - 1/(12N^2) + O(1/N^4)\\).',
                    hint: 'The formula gives: integral \\(= \\log N\\), endpoint average \\(= (1 + 1/N)/2\\), and the \\(B_2\\) term involves \\(f\'(b) - f\'(a) = -1/N^2 + 1\\).',
                    solution: 'Euler-Maclaurin with \\(p=1\\): \\(\\sum_{n=1}^N 1/n = \\int_1^N 1/t \\, dt + (1 + 1/N)/2 + \\frac{B_2}{2!}(f\'(N) - f\'(1)) + R_1\\). We have \\(\\int_1^N 1/t \\, dt = \\log N\\), \\(f\'(t) = -1/t^2\\), so the \\(B_2\\) correction is \\(\\frac{1/6}{2}(-1/N^2 + 1) = \\frac{1}{12}(1 - 1/N^2)\\). Collecting: \\(\\log N + 1/2 + 1/(2N) + 1/12 - 1/(12N^2) + R_1\\). The constant \\(1/2 + 1/12 + \\cdots\\) assembles into \\(\\gamma\\).'
                }
            ]
        },

        // ================================================================
        // SECTION 5: Dirichlet's Hyperbola Method
        // ================================================================
        {
            id: 'sec-hyperbola',
            title: 'Dirichlet\'s Hyperbola Method',
            content: `
<h2>Dirichlet's Hyperbola Method</h2>

<div class="env-block intuition">
    <div class="env-title">The Key Geometric Idea</div>
    <div class="env-body">
        <p>To compute \\(D(x) = \\sum_{n \\le x} d(n) = \\sum_{ab \\le x} 1\\), we count lattice points \\((a, b)\\) with \\(a, b \\ge 1\\) in the region under the hyperbola \\(ab = x\\). The naive approach sums along one variable. Dirichlet's insight: split the region at the "diagonal" \\(a = b = \\sqrt{x}\\) and sum over each half separately. This avoids double-counting and yields a better error term.</p>
    </div>
</div>

<div class="env-block theorem">
    <div class="env-title">Theorem 2.6 (Dirichlet's Hyperbola Method for \\(D(x)\\))</div>
    <div class="env-body">
        <p>Let \\(f = g * h\\) (Dirichlet convolution). Then</p>
        \\[
        \\sum_{n \\le x} f(n) = \\sum_{a \\le u} g(a) H(x/a) + \\sum_{b \\le v} h(b) G(x/b) - G(u) H(v),
        \\]
        <p>where \\(G(x) = \\sum_{n \\le x} g(n)\\), \\(H(x) = \\sum_{n \\le x} h(n)\\), and \\(uv = x\\).</p>
        <p>Applying this to \\(d = 1 * 1\\) with \\(u = v = \\sqrt{x}\\) gives</p>
        \\[
        D(x) = 2 \\sum_{a \\le \\sqrt{x}} \\left\\lfloor \\frac{x}{a} \\right\\rfloor - \\lfloor \\sqrt{x} \\rfloor^2 = x \\log x + (2\\gamma - 1)x + O(\\sqrt{x}).
        \\]
    </div>
</div>

<div class="env-block proof">
    <div class="env-title">Proof Idea</div>
    <div class="env-body">
        <p>We count lattice points \\((a, b)\\) with \\(ab \\le x\\) by splitting into three regions:</p>
        <ul>
            <li><strong>Region I</strong>: \\(a \\le \\sqrt{x}\\), any valid \\(b\\) (i.e., \\(b \\le x/a\\)). Contribution: \\(\\sum_{a \\le \\sqrt{x}} \\lfloor x/a \\rfloor\\).</li>
            <li><strong>Region II</strong>: \\(b \\le \\sqrt{x}\\), any valid \\(a\\). By symmetry, same as Region I: \\(\\sum_{b \\le \\sqrt{x}} \\lfloor x/b \\rfloor\\).</li>
            <li><strong>Overlap</strong>: \\(a \\le \\sqrt{x}\\) and \\(b \\le \\sqrt{x}\\). This is counted twice, so subtract \\(\\lfloor \\sqrt{x} \\rfloor^2\\).</li>
        </ul>
        <p>The estimate \\(\\sum_{a \\le \\sqrt{x}} \\lfloor x/a \\rfloor = x \\sum_{a \\le \\sqrt{x}} 1/a + O(\\sqrt{x})\\), combined with the harmonic sum asymptotics, gives the result.</p>
    </div>
</div>

<div class="env-block remark">
    <div class="env-title">The Dirichlet Divisor Problem</div>
    <div class="env-body">
        <p>What is the true order of the error \\(\\Delta(x) = D(x) - x \\log x - (2\\gamma - 1)x\\)? Dirichlet showed \\(\\Delta(x) = O(\\sqrt{x})\\). The best known bound (as of 2024) is \\(O(x^{131/416 + \\varepsilon})\\) due to Huxley. It is conjectured that \\(\\Delta(x) = O(x^{1/4 + \\varepsilon})\\), but this remains open. Hardy showed that \\(\\Delta(x) = \\Omega(x^{1/4})\\), so \\(1/4\\) would be optimal.</p>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-hyperbola-lattice"></div>
`,
            visualizations: [
                {
                    id: 'viz-hyperbola-lattice',
                    title: 'Dirichlet\'s Hyperbola Method: Lattice Point Counting',
                    description: 'Count lattice points (a,b) with ab <= x under the hyperbola. The blue region counts a <= sqrt(x), the green region counts b <= sqrt(x), and the overlap (orange) is subtracted. Drag x to see how the count changes.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 400,
                            originX: 50, originY: 360, scale: 1
                        });

                        var xVal = 30;
                        VizEngine.createSlider(controls, 'x', 10, 100, xVal, 5, function(v) {
                            xVal = Math.round(v);
                            draw();
                        });

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            viz.screenText('Lattice points under ab = ' + xVal, viz.width / 2, 18, viz.colors.white, 14);

                            var sqrtX = Math.sqrt(xVal);
                            var maxCoord = Math.ceil(xVal / 1) + 1;
                            var displayMax = Math.min(maxCoord, xVal + 2);

                            // Scale to fit
                            var chartL = 50, chartB = 355, chartT = 40, chartR = viz.width - 20;
                            var chartW = chartR - chartL;
                            var chartH = chartB - chartT;
                            var pixPerUnit = Math.min(chartW, chartH) / displayMax;

                            function toP(a, b) {
                                return [chartL + a * pixPerUnit, chartB - b * pixPerUnit];
                            }

                            // Draw grid
                            ctx.strokeStyle = viz.colors.grid;
                            ctx.lineWidth = 0.3;
                            for (var g = 0; g <= displayMax; g++) {
                                var pg = toP(g, 0);
                                ctx.beginPath(); ctx.moveTo(pg[0], chartB); ctx.lineTo(pg[0], chartT); ctx.stroke();
                                pg = toP(0, g);
                                ctx.beginPath(); ctx.moveTo(chartL, pg[1]); ctx.lineTo(chartR, pg[1]); ctx.stroke();
                            }

                            // Shade Region I (a <= sqrt(x), blue) and Region II (b <= sqrt(x), green)
                            var sqrtFloor = Math.floor(sqrtX);

                            // Region I: a from 1 to sqrtFloor, b from 1 to floor(x/a) but b > sqrtFloor
                            for (var a = 1; a <= sqrtFloor; a++) {
                                var bMax = Math.floor(xVal / a);
                                for (var b = sqrtFloor + 1; b <= bMax && b <= displayMax; b++) {
                                    var pp = toP(a, b);
                                    ctx.fillStyle = viz.colors.blue + '44';
                                    ctx.fillRect(pp[0] - pixPerUnit * 0.4, pp[1] - pixPerUnit * 0.4, pixPerUnit * 0.8, pixPerUnit * 0.8);
                                }
                            }

                            // Region II: b from 1 to sqrtFloor, a from sqrtFloor+1 to floor(x/b)
                            for (var b2 = 1; b2 <= sqrtFloor; b2++) {
                                var aMax = Math.floor(xVal / b2);
                                for (var a2 = sqrtFloor + 1; a2 <= aMax && a2 <= displayMax; a2++) {
                                    var pp2 = toP(a2, b2);
                                    ctx.fillStyle = viz.colors.green + '44';
                                    ctx.fillRect(pp2[0] - pixPerUnit * 0.4, pp2[1] - pixPerUnit * 0.4, pixPerUnit * 0.8, pixPerUnit * 0.8);
                                }
                            }

                            // Overlap: a <= sqrtFloor, b <= sqrtFloor, ab <= x
                            for (var a3 = 1; a3 <= sqrtFloor; a3++) {
                                for (var b3 = 1; b3 <= sqrtFloor && a3 * b3 <= xVal; b3++) {
                                    var pp3 = toP(a3, b3);
                                    ctx.fillStyle = viz.colors.orange + '55';
                                    ctx.fillRect(pp3[0] - pixPerUnit * 0.4, pp3[1] - pixPerUnit * 0.4, pixPerUnit * 0.8, pixPerUnit * 0.8);
                                }
                            }

                            // Draw lattice points
                            var totalPoints = 0;
                            for (var la = 1; la <= displayMax; la++) {
                                for (var lb = 1; lb <= displayMax && la * lb <= xVal; lb++) {
                                    totalPoints++;
                                    var lp = toP(la, lb);
                                    ctx.fillStyle = viz.colors.white;
                                    ctx.beginPath();
                                    ctx.arc(lp[0], lp[1], Math.min(3, pixPerUnit * 0.2), 0, Math.PI * 2);
                                    ctx.fill();
                                }
                            }

                            // Draw hyperbola ab = x
                            ctx.strokeStyle = viz.colors.red;
                            ctx.lineWidth = 2;
                            ctx.beginPath();
                            var started = false;
                            for (var t = 0.5; t <= displayMax; t += 0.2) {
                                var hb = xVal / t;
                                if (hb > displayMax || hb < 0.3) continue;
                                var hp = toP(t, hb);
                                if (!started) { ctx.moveTo(hp[0], hp[1]); started = true; }
                                else ctx.lineTo(hp[0], hp[1]);
                            }
                            ctx.stroke();

                            // Draw sqrt(x) lines
                            ctx.strokeStyle = viz.colors.yellow;
                            ctx.lineWidth = 1;
                            ctx.setLineDash([4, 4]);
                            var sqrtP = toP(sqrtX, 0);
                            ctx.beginPath(); ctx.moveTo(sqrtP[0], chartB); ctx.lineTo(sqrtP[0], chartT); ctx.stroke();
                            sqrtP = toP(0, sqrtX);
                            ctx.beginPath(); ctx.moveTo(chartL, sqrtP[1]); ctx.lineTo(chartR, sqrtP[1]); ctx.stroke();
                            ctx.setLineDash([]);

                            // Labels
                            ctx.fillStyle = viz.colors.yellow;
                            ctx.font = '10px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            sqrtP = toP(sqrtX, 0);
                            ctx.fillText('\u221A' + xVal, sqrtP[0], chartB + 14);

                            // Axis labels
                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '10px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'top';
                            for (var xl = 1; xl <= displayMax; xl += Math.max(1, Math.floor(displayMax / 10))) {
                                var xlp = toP(xl, 0);
                                ctx.fillText(xl.toString(), xlp[0], chartB + 2);
                            }

                            // Summary
                            var Dx = totalPoints;
                            var approx = xVal * Math.log(xVal) + (2 * 0.5772 - 1) * xVal;
                            viz.screenText('D(' + xVal + ') = ' + Dx + '    Approx: ' + approx.toFixed(1) + '    Error: ' + Math.abs(Dx - approx).toFixed(1), viz.width / 2, chartB + 30, viz.colors.white, 11);

                            // Legend
                            var legX = chartR - 180, legY = chartT + 10;
                            ctx.font = '10px -apple-system,sans-serif';
                            ctx.textAlign = 'left';

                            ctx.fillStyle = viz.colors.blue + '88';
                            ctx.fillRect(legX, legY, 10, 10);
                            ctx.fillStyle = viz.colors.text;
                            ctx.fillText('Region I (a \u2264 \u221Ax)', legX + 14, legY + 9);

                            ctx.fillStyle = viz.colors.green + '88';
                            ctx.fillRect(legX, legY + 16, 10, 10);
                            ctx.fillStyle = viz.colors.text;
                            ctx.fillText('Region II (b \u2264 \u221Ax)', legX + 14, legY + 25);

                            ctx.fillStyle = viz.colors.orange + '88';
                            ctx.fillRect(legX, legY + 32, 10, 10);
                            ctx.fillStyle = viz.colors.text;
                            ctx.fillText('Overlap (subtract)', legX + 14, legY + 41);
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Verify Dirichlet\'s formula for \\(x = 12\\): compute \\(D(12)\\) directly, then via the hyperbola method with \\(u = v = \\lfloor\\sqrt{12}\\rfloor = 3\\).',
                    hint: 'Direct: \\(D(12) = \\sum_{n=1}^{12} d(n)\\). Hyperbola: \\(2\\sum_{a=1}^{3} \\lfloor 12/a \\rfloor - 3^2\\).',
                    solution: 'Direct: d(1)=1, d(2)=2, d(3)=2, d(4)=3, d(5)=2, d(6)=4, d(7)=2, d(8)=4, d(9)=3, d(10)=4, d(11)=2, d(12)=6. Sum = 35. Hyperbola: \\(2(\\lfloor 12/1 \\rfloor + \\lfloor 12/2 \\rfloor + \\lfloor 12/3 \\rfloor) - 3^2 = 2(12 + 6 + 4) - 9 = 44 - 9 = 35\\). They agree.'
                },
                {
                    question: 'Use the hyperbola method to find the asymptotic formula for \\(\\sum_{n \\le x} \\sigma_0(n^2)\\), where \\(\\sigma_0(n^2) = \\sum_{d \\mid n^2} 1\\). (Hint: \\(\\sigma_0(n^2) = \\sum_{d \\mid n} 2^{\\omega(n/d)}\\) where \\(\\omega\\) counts distinct prime factors.)',
                    hint: 'This is harder. The key is that \\(\\sigma_0(n^2) = (d * |\\mu|)(n)\\) in Dirichlet convolution sense, so the hyperbola method applies to this convolution.',
                    solution: 'One can show \\(\\sigma_0(n^2) = \\sum_{ab = n} |\\mu(a)|\\), i.e., \\(\\sigma_0(n^2) = (|\\mu| * 1)(n)\\). Applying the hyperbola method: \\(\\sum_{n \\le x} \\sigma_0(n^2) = \\sum_{a \\le \\sqrt{x}} |\\mu(a)| \\lfloor x/a \\rfloor + \\sum_{b \\le \\sqrt{x}} Q(x/b) - Q(\\sqrt{x})\\lfloor\\sqrt{x}\\rfloor\\), where \\(Q(x) = \\sum_{n \\le x} |\\mu(n)| \\sim 6x/\\pi^2\\). This gives \\(\\sum_{n \\le x} \\sigma_0(n^2) \\sim \\frac{6}{\\pi^2} x \\log x + O(x)\\).'
                }
            ]
        },

        // ================================================================
        // SECTION 6: From Sums to Series
        // ================================================================
        {
            id: 'sec-bridge',
            title: 'From Sums to Series',
            content: `
<h2>From Sums to Series</h2>

<div class="env-block intuition">
    <div class="env-title">The Bridge to Chapter 3</div>
    <div class="env-body">
        <p>In this chapter we studied finite sums \\(\\sum_{n \\le x} f(n)\\). In the next chapter we study Dirichlet series \\(\\sum_{n=1}^{\\infty} f(n) n^{-s}\\). These are not unrelated objects. Abel summation is exactly the tool that connects them: the convergence and analytic properties of \\(\\sum f(n) n^{-s}\\) are controlled by the growth of the partial sums \\(\\sum_{n \\le x} f(n)\\).</p>
    </div>
</div>

<h3>From Summatory Functions to Dirichlet Series</h3>

<p>Abel summation with \\(f(t) = t^{-s}\\) gives a fundamental relationship. If \\(F(x) = \\sum_{n \\le x} a(n)\\), then</p>

\\[
\\sum_{n=1}^{\\infty} a(n) n^{-s} = s \\int_1^{\\infty} F(t) t^{-s-1} \\, dt,
\\]

<p>provided the integral (or series) converges. This Mellin-type formula shows that the Dirichlet series is a continuous transform of the summatory function.</p>

<div class="env-block theorem">
    <div class="env-title">Theorem 2.7 (Abscissa of Convergence)</div>
    <div class="env-body">
        <p>If \\(F(x) = \\sum_{n \\le x} a(n) = O(x^\\alpha)\\), then the Dirichlet series \\(\\sum a(n) n^{-s}\\) converges for \\(\\text{Re}(s) > \\alpha\\). The precise abscissa of convergence is</p>
        \\[
        \\sigma_c = \\limsup_{x \\to \\infty} \\frac{\\log |F(x)|}{\\log x}.
        \\]
    </div>
</div>

<div class="env-block example">
    <div class="env-title">Example: Recovering \\(\\zeta(s)\\) Convergence</div>
    <div class="env-body">
        <p>For \\(a(n) = 1\\), we have \\(F(x) = \\lfloor x \\rfloor = O(x)\\), so \\(\\alpha = 1\\) and the Dirichlet series \\(\\sum n^{-s} = \\zeta(s)\\) converges for \\(\\text{Re}(s) > 1\\). This is the classical result.</p>
        <p>For \\(a(n) = \\mu(n)\\), the PNT implies \\(M(x) = \\sum_{n \\le x} \\mu(n) = o(x)\\), which gives convergence of \\(\\sum \\mu(n) n^{-s} = 1/\\zeta(s)\\) for \\(\\text{Re}(s) > 1\\). The RH would give \\(M(x) = O(x^{1/2+\\varepsilon})\\), implying convergence for \\(\\text{Re}(s) > 1/2\\).</p>
    </div>
</div>

<h3>The Error Term and Zeros</h3>

<p>The asymptotic expansions we derived in this chapter all have error terms. These error terms are intimately related to the zeros of the associated Dirichlet series:</p>

<ul>
    <li>\\(D(x) = x \\log x + (2\\gamma - 1)x + \\Delta(x)\\): the error \\(\\Delta(x)\\) is related to the zeros of \\(\\zeta(s)^2\\)</li>
    <li>\\(\\psi(x) = x + E(x)\\): the error \\(E(x)\\) is <em>directly</em> given by a sum over zeros of \\(\\zeta(s)\\) (the explicit formula of Chapter 8)</li>
    <li>\\(\\Phi(x) = \\frac{3}{\\pi^2} x^2 + E_\\varphi(x)\\): controlled by zeros of \\(\\zeta(s)\\)</li>
</ul>

<p>This profound connection, that the oscillatory behavior of number-theoretic sums is governed by the zeros of analytic functions, is the central theme of analytic number theory. We will develop it fully starting in Chapter 3.</p>

<div class="env-block remark">
    <div class="env-title">Summary of Methods</div>
    <div class="env-body">
        <p>We now have four tools for studying summatory functions:</p>
        <ol>
            <li><strong>Direct estimation</strong>: rewriting sums by swapping order of summation</li>
            <li><strong>Abel summation</strong>: converting sums into integrals (one correction term)</li>
            <li><strong>Euler-Maclaurin</strong>: systematic corrections via Bernoulli numbers</li>
            <li><strong>Hyperbola method</strong>: exploiting the structure of Dirichlet convolutions</li>
        </ol>
        <p>Each is suited to different situations. In Chapter 3, we add the most powerful tool of all: the analytic properties of Dirichlet series.</p>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-error-oscillation"></div>
`,
            visualizations: [
                {
                    id: 'viz-error-oscillation',
                    title: 'Error Term Oscillations',
                    description: 'The error Delta(x) = D(x) - x log x - (2gamma-1)x oscillates in a way controlled by the zeros of zeta(s). Watch the oscillations as x grows.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 380,
                            originX: 60, originY: 200, scale: 1
                        });

                        var xMax = 200;
                        var showDivisor = true;
                        var showPsi = false;

                        VizEngine.createSlider(controls, 'x max', 50, 1000, xMax, 50, function(v) {
                            xMax = Math.round(v);
                            draw();
                        });
                        VizEngine.createButton(controls, '\u0394(x) divisor', function() { showDivisor = true; showPsi = false; draw(); });
                        VizEngine.createButton(controls, '\u03C8(x)-x', function() { showDivisor = false; showPsi = true; draw(); });

                        var primes = VizEngine.sievePrimes(1100);

                        function divisorCount(n) {
                            var count = 0;
                            for (var d = 1; d * d <= n; d++) {
                                if (n % d === 0) count += (d * d === n) ? 1 : 2;
                            }
                            return count;
                        }

                        function vonMangoldt(n) {
                            if (n < 2) return 0;
                            for (var i = 0; i < primes.length; i++) {
                                var p = primes[i];
                                if (p * p > n) break;
                                if (n % p === 0) {
                                    var m = n;
                                    while (m > 1) {
                                        if (m % p !== 0) return 0;
                                        m /= p;
                                    }
                                    return Math.log(p);
                                }
                            }
                            return Math.log(n);
                        }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            var gamma = 0.5772156649;

                            var chartL = 60, chartR = viz.width - 20;
                            var chartT = 40, chartB = 350;
                            var chartW = chartR - chartL;
                            var chartH = chartB - chartT;
                            var midY = (chartT + chartB) / 2;

                            // Compute errors
                            var errors = [];
                            var maxErr = 0;
                            var cumSum = 0;

                            if (showDivisor) {
                                viz.screenText('\u0394(x) = D(x) - x log x - (2\u03B3-1)x', viz.width / 2, 18, viz.colors.white, 13);
                                for (var n = 1; n <= xMax; n++) {
                                    cumSum += divisorCount(n);
                                    var predicted = n * Math.log(n) + (2 * gamma - 1) * n;
                                    var err = cumSum - predicted;
                                    errors.push(err);
                                    if (Math.abs(err) > maxErr) maxErr = Math.abs(err);
                                }
                            } else {
                                viz.screenText('\u03C8(x) - x', viz.width / 2, 18, viz.colors.white, 13);
                                for (var n2 = 1; n2 <= xMax; n2++) {
                                    cumSum += vonMangoldt(n2);
                                    var err2 = cumSum - n2;
                                    errors.push(err2);
                                    if (Math.abs(err2) > maxErr) maxErr = Math.abs(err2);
                                }
                            }

                            if (maxErr < 1) maxErr = 1;

                            // Axes
                            ctx.strokeStyle = viz.colors.axis; ctx.lineWidth = 1;
                            ctx.beginPath(); ctx.moveTo(chartL, chartB); ctx.lineTo(chartR, chartB); ctx.stroke();
                            ctx.beginPath(); ctx.moveTo(chartL, midY); ctx.lineTo(chartR, midY); ctx.stroke();

                            // Zero line label
                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '10px -apple-system,sans-serif';
                            ctx.textAlign = 'right';
                            ctx.textBaseline = 'middle';
                            ctx.fillText('0', chartL - 6, midY);
                            ctx.fillText('+' + maxErr.toFixed(0), chartL - 6, chartT + 10);
                            ctx.fillText('-' + maxErr.toFixed(0), chartL - 6, chartB - 10);

                            // Plot error
                            ctx.strokeStyle = showDivisor ? viz.colors.teal : viz.colors.purple;
                            ctx.lineWidth = 1.5;
                            ctx.beginPath();
                            for (var i = 0; i < errors.length; i++) {
                                var px = chartL + ((i + 1) / xMax) * chartW;
                                var py = midY - (errors[i] / maxErr) * (chartH / 2 - 10);
                                py = Math.max(chartT, Math.min(chartB, py));
                                if (i === 0) ctx.moveTo(px, py);
                                else ctx.lineTo(px, py);
                            }
                            ctx.stroke();

                            // Draw sqrt(x) envelope for divisor error
                            if (showDivisor) {
                                ctx.strokeStyle = viz.colors.orange;
                                ctx.lineWidth = 1;
                                ctx.setLineDash([4, 4]);
                                ctx.beginPath();
                                for (var j = 1; j <= xMax; j++) {
                                    var sx = chartL + (j / xMax) * chartW;
                                    var envY = midY - (Math.sqrt(j) / maxErr) * (chartH / 2 - 10);
                                    if (j === 1) ctx.moveTo(sx, envY);
                                    else ctx.lineTo(sx, envY);
                                }
                                ctx.stroke();
                                ctx.beginPath();
                                for (var j2 = 1; j2 <= xMax; j2++) {
                                    var sx2 = chartL + (j2 / xMax) * chartW;
                                    var envY2 = midY + (Math.sqrt(j2) / maxErr) * (chartH / 2 - 10);
                                    if (j2 === 1) ctx.moveTo(sx2, envY2);
                                    else ctx.lineTo(sx2, envY2);
                                }
                                ctx.stroke();
                                ctx.setLineDash([]);

                                // Legend
                                ctx.fillStyle = viz.colors.orange;
                                ctx.font = '10px -apple-system,sans-serif';
                                ctx.textAlign = 'left';
                                ctx.fillText('\u00B1\u221Ax envelope', chartR - 110, chartT + 10);
                            }

                            // X labels
                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '10px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'top';
                            var xStep = Math.max(1, Math.round(xMax / 6));
                            for (var xl = xStep; xl <= xMax; xl += xStep) {
                                var sxl = chartL + (xl / xMax) * chartW;
                                ctx.fillText(xl.toString(), sxl, chartB + 4);
                            }

                            viz.screenText('The oscillations encode information about the zeros of \u03B6(s)', viz.width / 2, chartB + 22, viz.colors.text, 10);
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Show that if \\(\\psi(x) \\sim x\\), then \\(\\pi(x) \\sim x/\\log x\\) using Abel summation. (Hint: write \\(\\pi(x) = \\sum_{p \\le x} 1\\) and note that \\(\\Lambda\\) weights primes by \\(\\log p\\).)',
                    hint: 'We have \\(\\pi(x) = \\sum_{n \\le x} \\Lambda(n)/\\log n + O(\\sqrt{x})\\) (the \\(O(\\sqrt{x})\\) accounts for prime powers). Apply Abel summation with \\(a(n) = \\Lambda(n)\\) and \\(f(t) = 1/\\log t\\).',
                    solution: 'Write \\(\\theta(x) = \\sum_{p \\le x} \\log p\\). Since \\(\\psi(x) - \\theta(x) = O(\\sqrt{x} \\log x)\\), \\(\\theta(x) \\sim x\\) too. Now \\(\\pi(x) = \\sum_{p \\le x} 1 = \\sum_{p \\le x} \\frac{\\log p}{\\log p}\\). Abel summation with \\(A(x) = \\theta(x) \\sim x\\) and \\(f(t) = 1/\\log t\\) gives \\(\\pi(x) = \\theta(x)/\\log x + \\int_2^x \\theta(t)/(t \\log^2 t) \\, dt\\). Since \\(\\theta(t) \\sim t\\), the integral is \\(\\int_2^x 1/\\log^2 t \\, dt = o(x/\\log x)\\). So \\(\\pi(x) \\sim x/\\log x\\).'
                },
                {
                    question: 'The abscissa of convergence of \\(\\sum_{n=1}^\\infty d(n) n^{-s}\\) is \\(\\sigma_c = 1\\). Verify this using Theorem 2.7 and the known asymptotic \\(D(x) \\sim x \\log x\\).',
                    hint: 'Compute \\(\\limsup_{x \\to \\infty} \\log|D(x)|/\\log x\\). Since \\(D(x) \\sim x \\log x\\), what is the growth rate?',
                    solution: 'We have \\(D(x) \\sim x \\log x\\), so \\(\\log D(x) \\sim \\log(x \\log x) = \\log x + \\log \\log x\\). Thus \\(\\log D(x)/\\log x \\to 1\\) as \\(x \\to \\infty\\). By Theorem 2.7, \\(\\sigma_c = 1\\). This is consistent with the fact that \\(\\sum d(n) n^{-s} = \\zeta(s)^2\\), which has a double pole at \\(s = 1\\) and converges for \\(\\text{Re}(s) > 1\\).'
                },
            ]
        }
    ]
});
