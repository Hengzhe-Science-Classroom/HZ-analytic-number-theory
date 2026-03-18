window.CHAPTERS = window.CHAPTERS || [];
window.CHAPTERS.push({
    id: 'ch00',
    number: 0,
    title: 'The Drama of the Primes',
    subtitle: 'From Euclid to Riemann: the greatest story in mathematics',
    sections: [
        // ================================================================
        // SECTION 1: Why Primes?
        // ================================================================
        {
            id: 'sec-why-primes',
            title: 'Why Primes?',
            content: `
<h2>Why Primes?</h2>

<div class="env-block intuition">
    <div class="env-title">The Atoms of Arithmetic</div>
    <div class="env-body">
        <p>Every material object is built from atoms. Every integer greater than 1 is built from primes. This is not a loose analogy; it is a theorem, and one of the oldest in all of mathematics. Understanding primes is understanding the very fabric of the integers.</p>
    </div>
</div>

<p>A <em>prime number</em> is an integer \\(p \\geq 2\\) whose only positive divisors are 1 and \\(p\\) itself. The first few primes are</p>

\\[
2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, \\ldots
\\]

<p>Every other integer \\(n \\geq 2\\) can be written as a product of primes. This is the content of the most fundamental result in number theory:</p>

<div class="env-block theorem">
    <div class="env-title">Fundamental Theorem of Arithmetic</div>
    <div class="env-body">
        <p>Every integer \\(n \\geq 2\\) can be expressed as a product of prime numbers, and this factorization is unique up to the order of the factors.</p>
    </div>
</div>

<p>For example, \\(60 = 2^2 \\cdot 3 \\cdot 5\\), and no other collection of primes multiplies to give 60. The uniqueness is what makes primes truly atomic: they are the irreducible building blocks, and the decomposition into building blocks is unambiguous.</p>

<div class="env-block proof">
    <div class="env-title">Proof sketch (existence)</div>
    <div class="env-body">
        <p>By strong induction. If \\(n\\) is prime, we are done. Otherwise \\(n = ab\\) with \\(1 < a, b < n\\). By induction both \\(a\\) and \\(b\\) have prime factorizations, so \\(n\\) does too. \\(\\square\\)</p>
    </div>
</div>

<p>The uniqueness half is more subtle and requires Euclid's lemma (if \\(p \\mid ab\\) then \\(p \\mid a\\) or \\(p \\mid b\\)). We will not dwell on it here; our concern is with the <em>distribution</em> of primes, not the mechanics of factorization.</p>

<h3>How Many Primes Are There?</h3>

<p>If primes are the atoms of the integers, the first question is whether we ever run out of atoms. Euclid settled this around 300 BCE:</p>

<div class="env-block theorem">
    <div class="env-title">Euclid's Theorem (c. 300 BCE)</div>
    <div class="env-body">
        <p>There are infinitely many prime numbers.</p>
    </div>
</div>

<div class="env-block proof">
    <div class="env-title">Proof</div>
    <div class="env-body">
        <p>Suppose for contradiction that there are only finitely many primes \\(p_1, p_2, \\ldots, p_k\\). Consider the number</p>
        \\[
        N = p_1 p_2 \\cdots p_k + 1.
        \\]
        <p>Since \\(N > 1\\), it has a prime factor \\(q\\). But \\(q\\) cannot be any of \\(p_1, \\ldots, p_k\\), because dividing \\(N\\) by any \\(p_i\\) leaves remainder 1. So \\(q\\) is a prime not in our list, contradicting the assumption. \\(\\square\\)</p>
    </div>
</div>

<div class="env-block remark">
    <div class="env-title">A common misconception</div>
    <div class="env-body">
        <p>Euclid's proof does <em>not</em> claim that \\(N = p_1 \\cdots p_k + 1\\) is itself prime. For example, \\(2 \\cdot 3 \\cdot 5 \\cdot 7 \\cdot 11 \\cdot 13 + 1 = 30031 = 59 \\cdot 509\\). The point is that \\(N\\) has a prime factor not already on the list.</p>
    </div>
</div>

<p>So there are infinitely many primes. But <em>how</em> are they distributed among the integers? Are they roughly evenly spaced, or do they thin out? Do they follow a pattern, or are they fundamentally irregular? These questions drive the entire subject of analytic number theory.</p>
`,
            visualizations: [],
            exercises: [
                {
                    question: 'Compute \\(\\pi(100)\\), the number of primes up to 100, by listing all primes up to 100.',
                    hint: 'Systematically check each number, or use the sieve of Eratosthenes: cross out multiples of 2, then 3, then 5, then 7. Since \\(\\sqrt{100} = 10\\), you only need to sieve up to 7.',
                    solution: 'The primes up to 100 are: 2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97. So \\(\\pi(100) = 25\\).'
                },
                {
                    question: 'In Euclid\'s proof, we form \\(N = p_1 p_2 \\cdots p_k + 1\\). Compute \\(N\\) when the list is \\(\\{2, 3, 5\\}\\) and when the list is \\(\\{2, 3, 5, 7, 11, 13\\}\\). Is \\(N\\) prime in each case?',
                    hint: 'Compute the products and add 1, then try to factor the results.',
                    solution: 'For \\(\\{2,3,5\\}\\): \\(N = 30 + 1 = 31\\), which is prime. For \\(\\{2,3,5,7,11,13\\}\\): \\(N = 30030 + 1 = 30031 = 59 \\times 509\\), which is composite. Euclid\'s proof guarantees a new prime factor, not that \\(N\\) itself is prime.'
                }
            ]
        },

        // ================================================================
        // SECTION 2: The Irregular Staircase
        // ================================================================
        {
            id: 'sec-irregularity',
            title: 'The Irregular Staircase',
            content: `
<h2>The Irregular Staircase</h2>

<div class="env-block intuition">
    <div class="env-title">A Staircase with No Blueprint</div>
    <div class="env-body">
        <p>Define \\(\\pi(x)\\) to be the number of primes \\(p \\leq x\\). This function climbs like a staircase, gaining one step each time \\(x\\) passes a prime. If you plot it, the staircase looks deceptively regular from afar, but up close every step is a surprise. There is no simple formula for the step locations.</p>
    </div>
</div>

<p>The <em>prime counting function</em> \\(\\pi(x)\\) is the central object of study in analytic number theory. Some values:</p>

<table style="margin:0 auto;border-collapse:collapse;">
<tr style="border-bottom:2px solid #30363d;"><th style="padding:4px 16px;">\\(x\\)</th><th style="padding:4px 16px;">\\(\\pi(x)\\)</th><th style="padding:4px 16px;">Fraction prime</th></tr>
<tr><td style="padding:4px 16px;text-align:center;">10</td><td style="padding:4px 16px;text-align:center;">4</td><td style="padding:4px 16px;text-align:center;">40%</td></tr>
<tr><td style="padding:4px 16px;text-align:center;">100</td><td style="padding:4px 16px;text-align:center;">25</td><td style="padding:4px 16px;text-align:center;">25%</td></tr>
<tr><td style="padding:4px 16px;text-align:center;">1,000</td><td style="padding:4px 16px;text-align:center;">168</td><td style="padding:4px 16px;text-align:center;">16.8%</td></tr>
<tr><td style="padding:4px 16px;text-align:center;">10,000</td><td style="padding:4px 16px;text-align:center;">1,229</td><td style="padding:4px 16px;text-align:center;">12.3%</td></tr>
<tr><td style="padding:4px 16px;text-align:center;">100,000</td><td style="padding:4px 16px;text-align:center;">9,592</td><td style="padding:4px 16px;text-align:center;">9.6%</td></tr>
<tr><td style="padding:4px 16px;text-align:center;">1,000,000</td><td style="padding:4px 16px;text-align:center;">78,498</td><td style="padding:4px 16px;text-align:center;">7.8%</td></tr>
</table>

<p>Primes thin out, but they never stop. The fraction of integers up to \\(x\\) that are prime decreases, yet \\(\\pi(x)\\) itself grows without bound.</p>

<h3>Prime Gaps</h3>

<p>Define the \\(n\\)-th prime gap as \\(g_n = p_{n+1} - p_n\\). The first few gaps are</p>

\\[
1, 2, 2, 4, 2, 4, 2, 4, 6, 2, 6, 4, 2, 4, 6, 6, 2, 6, \\ldots
\\]

<p>The gaps are erratic. Sometimes primes cluster tightly (twin primes like 11, 13 have gap 2), sometimes they spread apart. The question of whether infinitely many gaps of size 2 exist, the <strong>Twin Prime Conjecture</strong>, remains open.</p>

<div class="viz-placeholder" data-viz="viz-prime-staircase"></div>

<div class="viz-placeholder" data-viz="viz-prime-gaps"></div>

<p>Despite the local chaos, a remarkable regularity emerges at large scales. This tension between local irregularity and global order is the central drama of prime number theory.</p>

<h3>Bertrand's Postulate</h3>

<p>While the gaps between primes are unpredictable in detail, they cannot grow too fast:</p>

<div class="env-block theorem">
    <div class="env-title">Bertrand's Postulate (Chebyshev, 1852)</div>
    <div class="env-body">
        <p>For every integer \\(n \\geq 1\\), there exists a prime \\(p\\) with \\(n < p \\leq 2n\\).</p>
    </div>
</div>

<p>Equivalently, \\(p_{n+1} < 2p_n\\) for all \\(n\\). Prime gaps grow, but not faster than the primes themselves. Bertrand conjectured this in 1845 after checking it up to \\(n = 3{,}000{,}000\\); Chebyshev proved it in 1852 using elementary (but ingenious) bounds on \\(\\pi(x)\\).</p>
`,
            visualizations: [
                // VIZ 1: Prime staircase vs x/ln(x) vs Li(x)
                {
                    id: 'viz-prime-staircase',
                    title: 'The Prime Staircase',
                    description: 'The staircase function pi(x) compared to its two main approximations: x/ln(x) and Li(x). Drag the slider to change the range.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 380,
                            originX: 60, originY: 340, scale: 1
                        });

                        // Helper: sieve primes up to max
                        function sievePrimes(max) {
                            var sieve = new Uint8Array(max + 1);
                            var primes = [];
                            for (var i = 2; i <= max; i++) {
                                if (!sieve[i]) {
                                    primes.push(i);
                                    for (var j = i * i; j <= max; j += i) sieve[j] = 1;
                                }
                            }
                            return primes;
                        }

                        // Helper: count primes <= x
                        function primeCount(x, primes) {
                            var count = 0;
                            for (var i = 0; i < primes.length; i++) {
                                if (primes[i] <= x) count++;
                                else break;
                            }
                            return count;
                        }

                        // Helper: Li(x) via trapezoidal integration
                        function Li(x) {
                            if (x <= 2) return 0;
                            var sum = 0;
                            var steps = 500;
                            var a = 2, b = x;
                            var h = (b - a) / steps;
                            for (var i = 0; i < steps; i++) {
                                var t0 = a + i * h;
                                var t1 = t0 + h;
                                sum += (1 / Math.log(t0) + 1 / Math.log(t1)) * h / 2;
                            }
                            return sum;
                        }

                        var allPrimes = sievePrimes(12000);
                        var xMax = 500;

                        var slider = VizEngine.createSlider(controls, 'x max', 100, 10000, xMax, 100, function(v) {
                            xMax = Math.round(v);
                            draw();
                        });

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            var plotLeft = 60;
                            var plotRight = viz.width - 20;
                            var plotTop = 40;
                            var plotBottom = 320;
                            var plotW = plotRight - plotLeft;
                            var plotH = plotBottom - plotTop;

                            var piMax = primeCount(xMax, allPrimes);
                            var yMax = Math.max(piMax * 1.1, 10);

                            function toSx(x) { return plotLeft + (x / xMax) * plotW; }
                            function toSy(y) { return plotBottom - (y / yMax) * plotH; }

                            // Grid lines
                            ctx.strokeStyle = viz.colors.grid; ctx.lineWidth = 0.5;
                            var yStep = Math.pow(10, Math.floor(Math.log10(yMax / 4)));
                            if (yMax / yStep > 8) yStep *= 2;
                            for (var gy = yStep; gy < yMax; gy += yStep) {
                                var sy = toSy(gy);
                                ctx.beginPath(); ctx.moveTo(plotLeft, sy); ctx.lineTo(plotRight, sy); ctx.stroke();
                                ctx.fillStyle = viz.colors.text; ctx.font = '10px -apple-system,sans-serif';
                                ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
                                ctx.fillText(gy.toLocaleString(), plotLeft - 6, sy);
                            }

                            // x axis labels
                            var xStep = Math.pow(10, Math.floor(Math.log10(xMax / 4)));
                            if (xMax / xStep > 8) xStep *= 2;
                            ctx.textAlign = 'center'; ctx.textBaseline = 'top';
                            for (var gx = xStep; gx < xMax; gx += xStep) {
                                var sx = toSx(gx);
                                ctx.beginPath(); ctx.moveTo(sx, plotTop); ctx.lineTo(sx, plotBottom); ctx.stroke();
                                ctx.fillStyle = viz.colors.text;
                                ctx.fillText(gx.toLocaleString(), sx, plotBottom + 4);
                            }

                            // Axes
                            ctx.strokeStyle = viz.colors.axis; ctx.lineWidth = 1.5;
                            ctx.beginPath(); ctx.moveTo(plotLeft, plotBottom); ctx.lineTo(plotRight, plotBottom); ctx.stroke();
                            ctx.beginPath(); ctx.moveTo(plotLeft, plotBottom); ctx.lineTo(plotLeft, plotTop); ctx.stroke();

                            // pi(x) staircase (blue)
                            ctx.strokeStyle = viz.colors.blue; ctx.lineWidth = 2;
                            ctx.beginPath();
                            var started = false;
                            var count = 0;
                            var prevX = 2;
                            for (var pi = 0; pi < allPrimes.length && allPrimes[pi] <= xMax; pi++) {
                                var p = allPrimes[pi];
                                if (!started) {
                                    ctx.moveTo(toSx(2), toSy(0));
                                    started = true;
                                }
                                // Horizontal line from previous prime to this prime at current count
                                ctx.lineTo(toSx(p), toSy(count));
                                // Step up
                                count++;
                                ctx.lineTo(toSx(p), toSy(count));
                            }
                            // Extend to xMax
                            ctx.lineTo(toSx(xMax), toSy(count));
                            ctx.stroke();

                            // x/ln(x) curve (teal)
                            ctx.strokeStyle = viz.colors.teal; ctx.lineWidth = 2;
                            ctx.beginPath();
                            var started2 = false;
                            var numSteps = 300;
                            for (var si = 0; si <= numSteps; si++) {
                                var x = 2 + (xMax - 2) * si / numSteps;
                                var y = x / Math.log(x);
                                if (!started2) { ctx.moveTo(toSx(x), toSy(y)); started2 = true; }
                                else ctx.lineTo(toSx(x), toSy(y));
                            }
                            ctx.stroke();

                            // Li(x) curve (orange)
                            ctx.strokeStyle = viz.colors.orange; ctx.lineWidth = 2;
                            ctx.beginPath();
                            var started3 = false;
                            for (var si2 = 0; si2 <= numSteps; si2++) {
                                var x2 = 2 + (xMax - 2) * si2 / numSteps;
                                var y2 = Li(x2);
                                if (!started3) { ctx.moveTo(toSx(x2), toSy(y2)); started3 = true; }
                                else ctx.lineTo(toSx(x2), toSy(y2));
                            }
                            ctx.stroke();

                            // Title
                            viz.screenText('The Prime Staircase: \u03C0(x) vs approximations', viz.width / 2, 18, viz.colors.white, 14);

                            // Legend
                            var legY = plotBottom + 28;
                            ctx.font = '11px -apple-system,sans-serif';
                            ctx.textAlign = 'left';
                            ctx.fillStyle = viz.colors.blue;
                            ctx.fillRect(plotLeft + 20, legY, 14, 3);
                            ctx.fillText('\u03C0(x)', plotLeft + 38, legY + 5);

                            ctx.fillStyle = viz.colors.teal;
                            ctx.fillRect(plotLeft + 100, legY, 14, 3);
                            ctx.fillText('x/ln(x)', plotLeft + 118, legY + 5);

                            ctx.fillStyle = viz.colors.orange;
                            ctx.fillRect(plotLeft + 200, legY, 14, 3);
                            ctx.fillText('Li(x)', plotLeft + 218, legY + 5);

                            // Numerical info
                            var piVal = primeCount(xMax, allPrimes);
                            var approxVal = Math.round(xMax / Math.log(xMax));
                            var liVal = Math.round(Li(xMax));
                            viz.screenText(
                                '\u03C0(' + xMax + ') = ' + piVal + '    x/ln(x) \u2248 ' + approxVal + '    Li(x) \u2248 ' + liVal,
                                viz.width / 2, legY + 22, viz.colors.white, 11
                            );
                        }
                        draw();
                        return viz;
                    }
                },

                // VIZ 2: Prime gaps scatter plot
                {
                    id: 'viz-prime-gaps',
                    title: 'Prime Gaps',
                    description: 'The gap between consecutive primes p_{n+1} - p_n. Each dot is one gap. Color intensity reflects gap size.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 340,
                            originX: 60, originY: 300, scale: 1
                        });

                        function sievePrimes(max) {
                            var sieve = new Uint8Array(max + 1);
                            var primes = [];
                            for (var i = 2; i <= max; i++) {
                                if (!sieve[i]) {
                                    primes.push(i);
                                    for (var j = i * i; j <= max; j += i) sieve[j] = 1;
                                }
                            }
                            return primes;
                        }

                        var allPrimes = sievePrimes(4000);
                        var nMax = 200;

                        var slider = VizEngine.createSlider(controls, 'n (primes)', 20, 500, nMax, 10, function(v) {
                            nMax = Math.round(v);
                            draw();
                        });

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            var plotLeft = 60;
                            var plotRight = viz.width - 20;
                            var plotTop = 40;
                            var plotBottom = 280;
                            var plotW = plotRight - plotLeft;
                            var plotH = plotBottom - plotTop;

                            var n = Math.min(nMax, allPrimes.length - 1);

                            // Compute gaps
                            var gaps = [];
                            var maxGap = 0;
                            for (var i = 0; i < n; i++) {
                                var g = allPrimes[i + 1] - allPrimes[i];
                                gaps.push(g);
                                if (g > maxGap) maxGap = g;
                            }
                            maxGap = Math.max(maxGap, 2);

                            function toSx(i) { return plotLeft + (i / n) * plotW; }
                            function toSy(g) { return plotBottom - (g / (maxGap * 1.1)) * plotH; }

                            // Grid
                            ctx.strokeStyle = viz.colors.grid; ctx.lineWidth = 0.5;
                            for (var gy = 2; gy <= maxGap; gy += 2) {
                                var sy = toSy(gy);
                                ctx.beginPath(); ctx.moveTo(plotLeft, sy); ctx.lineTo(plotRight, sy); ctx.stroke();
                                ctx.fillStyle = viz.colors.text; ctx.font = '10px -apple-system,sans-serif';
                                ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
                                ctx.fillText(gy, plotLeft - 6, sy);
                            }

                            // Axes
                            ctx.strokeStyle = viz.colors.axis; ctx.lineWidth = 1.5;
                            ctx.beginPath(); ctx.moveTo(plotLeft, plotBottom); ctx.lineTo(plotRight, plotBottom); ctx.stroke();
                            ctx.beginPath(); ctx.moveTo(plotLeft, plotBottom); ctx.lineTo(plotLeft, plotTop); ctx.stroke();

                            // Points colored by gap size
                            for (var j = 0; j < gaps.length; j++) {
                                var g2 = gaps[j];
                                var t = g2 / maxGap;
                                // Interpolate blue -> orange -> red
                                var r, gn, b;
                                if (t < 0.5) {
                                    r = Math.round(88 + (240 - 88) * t * 2);
                                    gn = Math.round(166 + (136 - 166) * t * 2);
                                    b = Math.round(255 + (62 - 255) * t * 2);
                                } else {
                                    r = Math.round(240 + (248 - 240) * (t - 0.5) * 2);
                                    gn = Math.round(136 + (81 - 136) * (t - 0.5) * 2);
                                    b = Math.round(62 + (73 - 62) * (t - 0.5) * 2);
                                }
                                var color = 'rgb(' + r + ',' + gn + ',' + b + ')';
                                var sx = toSx(j);
                                var syp = toSy(g2);
                                ctx.fillStyle = color;
                                ctx.beginPath();
                                ctx.arc(sx, syp, 2.5, 0, Math.PI * 2);
                                ctx.fill();
                            }

                            // Title
                            viz.screenText('Prime Gaps: g_n = p_{n+1} \u2212 p_n', viz.width / 2, 18, viz.colors.white, 14);

                            // Labels
                            ctx.fillStyle = viz.colors.text; ctx.font = '11px -apple-system,sans-serif';
                            ctx.textAlign = 'center'; ctx.textBaseline = 'top';
                            ctx.fillText('n (prime index)', viz.width / 2, plotBottom + 8);
                            ctx.save(); ctx.translate(16, (plotTop + plotBottom) / 2);
                            ctx.rotate(-Math.PI / 2);
                            ctx.fillText('gap size', 0, 0);
                            ctx.restore();

                            // Stats
                            var avgGap = gaps.reduce(function(a, b) { return a + b; }, 0) / gaps.length;
                            viz.screenText(
                                'n = ' + n + '  |  max gap = ' + maxGap + '  |  avg gap = ' + avgGap.toFixed(2),
                                viz.width / 2, plotBottom + 26, viz.colors.white, 11
                            );
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Verify Bertrand\'s postulate for \\(n = 25\\): find a prime \\(p\\) with \\(25 < p \\leq 50\\).',
                    hint: 'Check the primes between 25 and 50.',
                    solution: '\\(29\\) is prime and \\(25 < 29 \\leq 50\\). In fact, the primes in this range are 29, 31, 37, 41, 43, 47, so there are many such primes.'
                }
            ]
        },

        // ================================================================
        // SECTION 3: Euler's Bridge to Analysis
        // ================================================================
        {
            id: 'sec-euler-connection',
            title: 'Euler\'s Bridge to Analysis',
            content: `
<h2>Euler's Bridge to Analysis</h2>

<div class="env-block intuition">
    <div class="env-title">When Algebra Meets Analysis</div>
    <div class="env-body">
        <p>Euclid proved that primes are infinite using a clever algebraic argument. Euler, in the 1730s, found a completely different proof that opened a door Euclid could never have imagined: primes are not just infinite, they are infinite in a <em>quantitative</em> sense that can be measured by the tools of calculus.</p>
    </div>
</div>

<p>Euler's starting point is a remarkable identity connecting an infinite sum over all positive integers to an infinite product over all primes:</p>

<div class="env-block theorem">
    <div class="env-title">Euler Product Formula</div>
    <div class="env-body">
        <p>For all real \\(s > 1\\),</p>
        \\[
        \\sum_{n=1}^{\\infty} \\frac{1}{n^s} = \\prod_{p \\text{ prime}} \\frac{1}{1 - p^{-s}}.
        \\]
    </div>
</div>

<div class="env-block proof">
    <div class="env-title">Proof sketch</div>
    <div class="env-body">
        <p>Expand each factor \\(\\frac{1}{1-p^{-s}} = 1 + p^{-s} + p^{-2s} + \\cdots\\) as a geometric series. Multiplying these series over all primes, each term in the product corresponds to choosing an exponent for each prime, producing \\(\\frac{1}{(p_1^{a_1} p_2^{a_2} \\cdots)^s}\\). By the fundamental theorem of arithmetic, every positive integer appears exactly once. \\(\\square\\)</p>
    </div>
</div>

<p>The left side is what we will later call \\(\\zeta(s)\\), the Riemann zeta function. For now, the key insight is this: the Euler product translates information about primes (the right side) into information about the integers (the left side), and vice versa.</p>

<div class="viz-placeholder" data-viz="viz-euler-product"></div>

<h3>Euler's Second Proof of Infinitude</h3>

<p>Euler used his product to give a quantitative proof that primes are infinite:</p>

<div class="env-block theorem">
    <div class="env-title">Divergence of the prime reciprocal series (Euler, ~1737)</div>
    <div class="env-body">
        <p>The sum of the reciprocals of the primes diverges:</p>
        \\[
        \\sum_{p \\text{ prime}} \\frac{1}{p} = \\frac{1}{2} + \\frac{1}{3} + \\frac{1}{5} + \\frac{1}{7} + \\frac{1}{11} + \\cdots = +\\infty.
        \\]
    </div>
</div>

<p>This is a far stronger statement than Euclid's theorem. Not only are there infinitely many primes, but they are "dense enough" among the integers that their reciprocals sum to infinity (contrast this with the squares, \\(\\sum 1/n^2 = \\pi^2/6 < \\infty\\), which also form an infinite set but a sparser one).</p>

<div class="env-block remark">
    <div class="env-title">The speed of divergence</div>
    <div class="env-body">
        <p>Mertens (1874) refined this to show:</p>
        \\[
        \\sum_{p \\leq x} \\frac{1}{p} = \\ln \\ln x + M + O\\!\\left(\\frac{1}{\\ln x}\\right),
        \\]
        <p>where \\(M \\approx 0.2615\\) is Mertens' constant. This is <em>very</em> slow divergence: reaching sum 4 requires primes up to about \\(e^{e^{3.74}} \\approx 10^{18}\\). Yet diverge it does.</p>
    </div>
</div>

<p>Euler's bridge from number theory to analysis was the founding act of analytic number theory. Every subsequent development, from Dirichlet's theorem on primes in arithmetic progressions to the Riemann hypothesis, builds on this idea: encode prime structure in an analytic object, then study the analytic object.</p>
`,
            visualizations: [
                // VIZ 3: Euler product built one prime at a time
                {
                    id: 'viz-euler-product',
                    title: 'Building the Euler Product',
                    description: 'Watch the Euler product converge to zeta(s) one prime factor at a time. Each bar shows the cumulative product after including that prime.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 380,
                            originX: 60, originY: 340, scale: 1
                        });

                        var smallPrimes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47];
                        var sVal = 2;

                        var slider = VizEngine.createSlider(controls, 's', 1.1, 4, sVal, 0.1, function(v) {
                            sVal = v;
                            draw();
                        });

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            var plotLeft = 70;
                            var plotRight = viz.width - 20;
                            var plotTop = 50;
                            var plotBottom = 300;
                            var plotW = plotRight - plotLeft;
                            var plotH = plotBottom - plotTop;

                            // Compute partial products
                            var products = [];
                            var prod = 1;
                            for (var i = 0; i < smallPrimes.length; i++) {
                                var p = smallPrimes[i];
                                prod *= 1 / (1 - Math.pow(p, -sVal));
                                products.push({ prime: p, value: prod });
                            }

                            // Compute exact zeta(s) approximately (sum 1/n^s up to 10000)
                            var zetaApprox = 0;
                            for (var n = 1; n <= 10000; n++) {
                                zetaApprox += Math.pow(n, -sVal);
                            }

                            var maxVal = Math.max(zetaApprox * 1.15, products[products.length - 1].value * 1.1);

                            function toSy(v) { return plotBottom - (v / maxVal) * plotH; }

                            // Grid
                            ctx.strokeStyle = viz.colors.grid; ctx.lineWidth = 0.5;
                            var yStep2 = maxVal > 5 ? 1 : maxVal > 2 ? 0.5 : 0.2;
                            ctx.fillStyle = viz.colors.text; ctx.font = '10px -apple-system,sans-serif';
                            ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
                            for (var gy = yStep2; gy < maxVal; gy += yStep2) {
                                var sy = toSy(gy);
                                ctx.beginPath(); ctx.moveTo(plotLeft, sy); ctx.lineTo(plotRight, sy); ctx.stroke();
                                ctx.fillStyle = viz.colors.text;
                                ctx.fillText(gy.toFixed(1), plotLeft - 6, sy);
                            }

                            // Axes
                            ctx.strokeStyle = viz.colors.axis; ctx.lineWidth = 1.5;
                            ctx.beginPath(); ctx.moveTo(plotLeft, plotBottom); ctx.lineTo(plotRight, plotBottom); ctx.stroke();
                            ctx.beginPath(); ctx.moveTo(plotLeft, plotBottom); ctx.lineTo(plotLeft, plotTop); ctx.stroke();

                            // Zeta target line (dashed)
                            ctx.strokeStyle = viz.colors.green; ctx.lineWidth = 1.5;
                            ctx.setLineDash([6, 4]);
                            var zetaSy = toSy(zetaApprox);
                            ctx.beginPath(); ctx.moveTo(plotLeft, zetaSy); ctx.lineTo(plotRight, zetaSy); ctx.stroke();
                            ctx.setLineDash([]);
                            ctx.fillStyle = viz.colors.green; ctx.font = '11px -apple-system,sans-serif';
                            ctx.textAlign = 'left';
                            ctx.fillText('\u03B6(' + sVal.toFixed(1) + ') \u2248 ' + zetaApprox.toFixed(4), plotRight - 120, zetaSy - 8);

                            // Bars
                            var barWidth = Math.min(28, plotW / products.length - 4);
                            for (var bi = 0; bi < products.length; bi++) {
                                var bx = plotLeft + (bi + 0.5) * (plotW / products.length);
                                var bh = plotBottom - toSy(products[bi].value);
                                // Color: fade from blue to teal as we add more primes
                                var t2 = bi / (products.length - 1);
                                var cr = Math.round(88 * (1 - t2) + 63 * t2);
                                var cg = Math.round(166 * (1 - t2) + 185 * t2);
                                var cb = Math.round(255 * (1 - t2) + 160 * t2);
                                ctx.fillStyle = 'rgb(' + cr + ',' + cg + ',' + cb + ')';
                                ctx.fillRect(bx - barWidth / 2, plotBottom - bh, barWidth, bh);

                                // Prime label
                                ctx.fillStyle = viz.colors.text; ctx.font = '9px -apple-system,sans-serif';
                                ctx.textAlign = 'center'; ctx.textBaseline = 'top';
                                ctx.fillText(products[bi].prime, bx, plotBottom + 4);
                            }

                            // Title
                            viz.screenText(
                                'Euler Product: \u220F (1 \u2212 p^{-s})^{-1} for s = ' + sVal.toFixed(1),
                                viz.width / 2, 20, viz.colors.white, 14
                            );

                            // Info
                            var lastProd = products[products.length - 1].value;
                            viz.screenText(
                                'After p=' + smallPrimes[smallPrimes.length - 1] + ': product = ' + lastProd.toFixed(4) +
                                '  |  \u03B6(' + sVal.toFixed(1) + ') = ' + zetaApprox.toFixed(4) +
                                '  |  error: ' + Math.abs(zetaApprox - lastProd).toFixed(4),
                                viz.width / 2, plotBottom + 34, viz.colors.white, 11
                            );
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Compute the Euler product \\(\\prod_{p \\leq 7} \\frac{1}{1 - p^{-2}}\\) for \\(s = 2\\), using only the primes \\(p = 2, 3, 5, 7\\). Compare with \\(\\pi^2/6\\).',
                    hint: 'Compute each factor: \\(\\frac{1}{1 - 1/4} = \\frac{4}{3}\\), etc., then multiply.',
                    solution: 'The factors are \\(\\frac{4}{3}, \\frac{9}{8}, \\frac{25}{24}, \\frac{49}{48}\\). Their product is \\(\\frac{4 \\cdot 9 \\cdot 25 \\cdot 49}{3 \\cdot 8 \\cdot 24 \\cdot 48} = \\frac{44100}{27648} \\approx 1.5952\\). The true value \\(\\zeta(2) = \\pi^2/6 \\approx 1.6449\\). Already close with just four primes!'
                },
                {
                    question: 'Explain why the divergence of \\(\\sum 1/p\\) implies that there are infinitely many primes, using the Euler product.',
                    hint: 'If there were only finitely many primes, what would the product be?',
                    solution: 'If there were finitely many primes, the Euler product \\(\\prod_p (1 - p^{-1})^{-1}\\) would be a finite product of finite terms, hence finite. But taking \\(s \\to 1^+\\), the left side \\(\\sum 1/n^s \\to +\\infty\\) (the harmonic series diverges). So there must be infinitely many prime factors. The divergence of \\(\\sum 1/p\\) sharpens this: taking logarithms of the product gives \\(\\sum_p \\ln(1-p^{-1})^{-1} \\approx \\sum 1/p\\), and this must diverge to match the harmonic series.'
                },
                {
                    question: 'Mertens\' theorem says \\(\\sum_{p \\leq x} 1/p \\approx \\ln \\ln x + M\\). Estimate this sum for \\(x = 100\\) and \\(x = 10^6\\).',
                    hint: 'Use \\(M \\approx 0.2615\\). Compute \\(\\ln \\ln x\\) using natural logarithms.',
                    solution: 'For \\(x = 100\\): \\(\\ln \\ln 100 = \\ln(4.605) \\approx 1.527\\), so the sum \\(\\approx 1.527 + 0.262 = 1.789\\). The exact sum \\(1/2 + 1/3 + 1/5 + 1/7 + \\cdots + 1/97 \\approx 1.803\\). For \\(x = 10^6\\): \\(\\ln \\ln 10^6 = \\ln(13.816) \\approx 2.626\\), so the sum \\(\\approx 2.626 + 0.262 = 2.888\\).'
                }
            ]
        },

        // ================================================================
        // SECTION 4: The Gauss-Legendre Conjecture
        // ================================================================
        {
            id: 'sec-gauss-conjecture',
            title: 'The Gauss-Legendre Conjecture',
            content: `
<h2>The Gauss-Legendre Conjecture</h2>

<div class="env-block intuition">
    <div class="env-title">The Teenager's Insight</div>
    <div class="env-body">
        <p>In 1792 or 1793, the fifteen-year-old Carl Friedrich Gauss received a table of prime numbers as a gift. He began to study it obsessively, counting primes and looking for patterns. What he found, reportedly from staring at tables and computing, was one of the most profound empirical observations in mathematics.</p>
    </div>
</div>

<p>Gauss observed that the "density" of primes near a large number \\(x\\) is approximately \\(1/\\ln x\\). That is, among the integers near \\(x\\), roughly one in every \\(\\ln x\\) is prime. This leads to the approximation</p>

\\[
\\pi(x) \\approx \\frac{x}{\\ln x}.
\\]

<p>Independently, Legendre proposed the similar formula \\(\\pi(x) \\approx x / (\\ln x - 1.08366)\\) in 1798. But Gauss went further: recognizing that the density \\(1/\\ln t\\) varies with \\(t\\), the total count of primes up to \\(x\\) should be obtained by integrating:</p>

<div class="env-block definition">
    <div class="env-title">The Logarithmic Integral</div>
    <div class="env-body">
        \\[
        \\operatorname{Li}(x) = \\int_2^x \\frac{dt}{\\ln t}.
        \\]
    </div>
</div>

<p>This gives a significantly better approximation than \\(x/\\ln x\\). The comparison is striking:</p>

<table style="margin:0 auto;border-collapse:collapse;">
<tr style="border-bottom:2px solid #30363d;"><th style="padding:4px 12px;">\\(x\\)</th><th style="padding:4px 12px;">\\(\\pi(x)\\)</th><th style="padding:4px 12px;">\\(x/\\ln x\\)</th><th style="padding:4px 12px;">\\(\\operatorname{Li}(x)\\)</th><th style="padding:4px 12px;">Error of \\(x/\\ln x\\)%</th><th style="padding:4px 12px;">Error of \\(\\operatorname{Li}\\)%</th></tr>
<tr><td style="padding:4px 12px;text-align:center;">\\(10^3\\)</td><td style="padding:4px 12px;text-align:center;">168</td><td style="padding:4px 12px;text-align:center;">145</td><td style="padding:4px 12px;text-align:center;">177</td><td style="padding:4px 12px;text-align:center;">13.7%</td><td style="padding:4px 12px;text-align:center;">5.4%</td></tr>
<tr><td style="padding:4px 12px;text-align:center;">\\(10^6\\)</td><td style="padding:4px 12px;text-align:center;">78,498</td><td style="padding:4px 12px;text-align:center;">72,382</td><td style="padding:4px 12px;text-align:center;">78,628</td><td style="padding:4px 12px;text-align:center;">7.8%</td><td style="padding:4px 12px;text-align:center;">0.17%</td></tr>
<tr><td style="padding:4px 12px;text-align:center;">\\(10^9\\)</td><td style="padding:4px 12px;text-align:center;">50,847,534</td><td style="padding:4px 12px;text-align:center;">48,254,942</td><td style="padding:4px 12px;text-align:center;">50,849,235</td><td style="padding:4px 12px;text-align:center;">5.1%</td><td style="padding:4px 12px;text-align:center;">0.003%</td></tr>
</table>

<div class="viz-placeholder" data-viz="viz-pi-vs-approx"></div>

<p>The conjecture that \\(\\pi(x) \\sim x/\\ln x\\) (meaning \\(\\pi(x)/(x/\\ln x) \\to 1\\) as \\(x \\to \\infty\\)) became known as the <strong>Prime Number Theorem</strong>. It was proved independently by Hadamard and de la Vall\u00e9e-Poussin in 1896, over a century after Gauss's empirical observation. The proof required exactly the analytic machinery that Euler's product formula had inaugurated.</p>

<div class="env-block theorem">
    <div class="env-title">Prime Number Theorem (Hadamard, de la Vall\u00e9e-Poussin, 1896)</div>
    <div class="env-body">
        \\[
        \\pi(x) \\sim \\frac{x}{\\ln x} \\qquad \\text{as } x \\to \\infty.
        \\]
        <p>Equivalently, \\(\\pi(x) \\sim \\operatorname{Li}(x)\\).</p>
    </div>
</div>
`,
            visualizations: [
                // VIZ 4: pi(x) vs x/ln(x) vs Li(x) with relative errors
                {
                    id: 'viz-pi-vs-approx',
                    title: 'Approximation Quality',
                    description: 'Compare pi(x) with x/ln(x) and Li(x). The bottom panel shows relative errors. Li(x) is dramatically more accurate.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 420,
                            originX: 60, originY: 380, scale: 1
                        });

                        function sievePrimes(max) {
                            var sieve = new Uint8Array(max + 1);
                            var primes = [];
                            for (var i = 2; i <= max; i++) {
                                if (!sieve[i]) {
                                    primes.push(i);
                                    for (var j = i * i; j <= max; j += i) sieve[j] = 1;
                                }
                            }
                            return primes;
                        }

                        function primeCount(x, primes) {
                            var count = 0;
                            for (var i = 0; i < primes.length; i++) {
                                if (primes[i] <= x) count++; else break;
                            }
                            return count;
                        }

                        function Li(x) {
                            if (x <= 2) return 0;
                            var sum = 0; var steps = 500;
                            var h = (x - 2) / steps;
                            for (var i = 0; i < steps; i++) {
                                var t0 = 2 + i * h;
                                var t1 = t0 + h;
                                sum += (1 / Math.log(t0) + 1 / Math.log(t1)) * h / 2;
                            }
                            return sum;
                        }

                        var allPrimes = sievePrimes(12000);
                        var xMax = 1000;

                        var slider = VizEngine.createSlider(controls, 'x max', 200, 10000, xMax, 200, function(v) {
                            xMax = Math.round(v);
                            draw();
                        });

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            // Top panel: the three functions
                            var topLeft = 70, topRight = viz.width - 20;
                            var topTop = 35, topBottom = 230;
                            var topW = topRight - topLeft, topH = topBottom - topTop;

                            // Bottom panel: relative errors
                            var botTop = 260, botBottom = 390;
                            var botH = botBottom - botTop;

                            var piMax = primeCount(xMax, allPrimes);
                            var yTopMax = Math.max(piMax * 1.15, 10);

                            function toSxTop(x) { return topLeft + (x / xMax) * topW; }
                            function toSyTop(y) { return topBottom - (y / yTopMax) * topH; }

                            // Top axes
                            ctx.strokeStyle = viz.colors.axis; ctx.lineWidth = 1;
                            ctx.beginPath(); ctx.moveTo(topLeft, topBottom); ctx.lineTo(topRight, topBottom); ctx.stroke();
                            ctx.beginPath(); ctx.moveTo(topLeft, topBottom); ctx.lineTo(topLeft, topTop); ctx.stroke();

                            // Top grid
                            ctx.strokeStyle = viz.colors.grid; ctx.lineWidth = 0.5;
                            var yStep = Math.pow(10, Math.floor(Math.log10(yTopMax / 4)));
                            if (yTopMax / yStep > 8) yStep *= 2;
                            ctx.fillStyle = viz.colors.text; ctx.font = '9px -apple-system,sans-serif';
                            ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
                            for (var gy = yStep; gy < yTopMax; gy += yStep) {
                                var sgy = toSyTop(gy);
                                ctx.beginPath(); ctx.moveTo(topLeft, sgy); ctx.lineTo(topRight, sgy); ctx.stroke();
                                ctx.fillStyle = viz.colors.text;
                                ctx.fillText(Math.round(gy).toLocaleString(), topLeft - 4, sgy);
                            }

                            // Sampling points for curves
                            var nSamples = 200;
                            var sampDx = Math.max(1, Math.floor(xMax / nSamples));

                            // pi(x) staircase
                            ctx.strokeStyle = viz.colors.blue; ctx.lineWidth = 2;
                            ctx.beginPath();
                            var piStarted = false;
                            var cnt = 0;
                            for (var pi2 = 0; pi2 < allPrimes.length && allPrimes[pi2] <= xMax; pi2++) {
                                var pp = allPrimes[pi2];
                                if (!piStarted) { ctx.moveTo(toSxTop(2), toSyTop(0)); piStarted = true; }
                                ctx.lineTo(toSxTop(pp), toSyTop(cnt));
                                cnt++;
                                ctx.lineTo(toSxTop(pp), toSyTop(cnt));
                            }
                            ctx.lineTo(toSxTop(xMax), toSyTop(cnt));
                            ctx.stroke();

                            // x/ln(x)
                            ctx.strokeStyle = viz.colors.teal; ctx.lineWidth = 2;
                            ctx.beginPath();
                            for (var si = 0; si <= nSamples; si++) {
                                var x = 3 + (xMax - 3) * si / nSamples;
                                var y = x / Math.log(x);
                                si === 0 ? ctx.moveTo(toSxTop(x), toSyTop(y)) : ctx.lineTo(toSxTop(x), toSyTop(y));
                            }
                            ctx.stroke();

                            // Li(x)
                            ctx.strokeStyle = viz.colors.orange; ctx.lineWidth = 2;
                            ctx.beginPath();
                            for (var si2 = 0; si2 <= nSamples; si2++) {
                                var x2 = 3 + (xMax - 3) * si2 / nSamples;
                                var y2 = Li(x2);
                                si2 === 0 ? ctx.moveTo(toSxTop(x2), toSyTop(y2)) : ctx.lineTo(toSxTop(x2), toSyTop(y2));
                            }
                            ctx.stroke();

                            // Bottom panel: relative errors
                            ctx.strokeStyle = viz.colors.axis; ctx.lineWidth = 1;
                            ctx.beginPath(); ctx.moveTo(topLeft, botBottom); ctx.lineTo(topRight, botBottom); ctx.stroke();
                            ctx.beginPath(); ctx.moveTo(topLeft, botBottom); ctx.lineTo(topLeft, botTop); ctx.stroke();

                            // Compute errors at sample points
                            var errSamples = [];
                            for (var ei = 1; ei <= 80; ei++) {
                                var ex = 10 + (xMax - 10) * ei / 80;
                                var epi = primeCount(ex, allPrimes);
                                if (epi === 0) continue;
                                var errXln = (ex / Math.log(ex) - epi) / epi * 100;
                                var errLi = (Li(ex) - epi) / epi * 100;
                                errSamples.push({ x: ex, errXln: errXln, errLi: errLi });
                            }

                            // Find error range
                            var minErr = 0, maxErr = 0;
                            for (var es = 0; es < errSamples.length; es++) {
                                minErr = Math.min(minErr, errSamples[es].errXln, errSamples[es].errLi);
                                maxErr = Math.max(maxErr, errSamples[es].errXln, errSamples[es].errLi);
                            }
                            var errRange = Math.max(Math.abs(minErr), Math.abs(maxErr), 5) * 1.2;

                            function toSyBot(e) { return (botTop + botBottom) / 2 - (e / errRange) * (botH / 2); }

                            // Zero line
                            ctx.strokeStyle = viz.colors.axis; ctx.lineWidth = 0.5;
                            ctx.setLineDash([4, 4]);
                            var zeroY = toSyBot(0);
                            ctx.beginPath(); ctx.moveTo(topLeft, zeroY); ctx.lineTo(topRight, zeroY); ctx.stroke();
                            ctx.setLineDash([]);

                            // Error labels
                            ctx.fillStyle = viz.colors.text; ctx.font = '9px -apple-system,sans-serif';
                            ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
                            var errStep = errRange > 20 ? 10 : errRange > 10 ? 5 : 2;
                            for (var ge = -Math.floor(errRange); ge <= Math.floor(errRange); ge += errStep) {
                                if (ge === 0) continue;
                                var sey = toSyBot(ge);
                                if (sey < botTop || sey > botBottom) continue;
                                ctx.strokeStyle = viz.colors.grid; ctx.lineWidth = 0.5;
                                ctx.beginPath(); ctx.moveTo(topLeft, sey); ctx.lineTo(topRight, sey); ctx.stroke();
                                ctx.fillStyle = viz.colors.text;
                                ctx.fillText(ge + '%', topLeft - 4, sey);
                            }

                            // x/ln(x) error curve
                            ctx.strokeStyle = viz.colors.teal; ctx.lineWidth = 1.5;
                            ctx.beginPath();
                            for (var ej = 0; ej < errSamples.length; ej++) {
                                var esx = toSxTop(errSamples[ej].x);
                                var esy = toSyBot(errSamples[ej].errXln);
                                ej === 0 ? ctx.moveTo(esx, esy) : ctx.lineTo(esx, esy);
                            }
                            ctx.stroke();

                            // Li(x) error curve
                            ctx.strokeStyle = viz.colors.orange; ctx.lineWidth = 1.5;
                            ctx.beginPath();
                            for (var ek = 0; ek < errSamples.length; ek++) {
                                var esx2 = toSxTop(errSamples[ek].x);
                                var esy2 = toSyBot(errSamples[ek].errLi);
                                ek === 0 ? ctx.moveTo(esx2, esy2) : ctx.lineTo(esx2, esy2);
                            }
                            ctx.stroke();

                            // Title
                            viz.screenText('\u03C0(x) vs Approximations', viz.width / 2, 14, viz.colors.white, 14);

                            // Legend
                            ctx.font = '10px -apple-system,sans-serif'; ctx.textAlign = 'left';
                            ctx.fillStyle = viz.colors.blue;
                            ctx.fillRect(topRight - 160, topTop + 4, 12, 3);
                            ctx.fillText('\u03C0(x)', topRight - 144, topTop + 10);
                            ctx.fillStyle = viz.colors.teal;
                            ctx.fillRect(topRight - 160, topTop + 18, 12, 3);
                            ctx.fillText('x/ln(x)', topRight - 144, topTop + 24);
                            ctx.fillStyle = viz.colors.orange;
                            ctx.fillRect(topRight - 160, topTop + 32, 12, 3);
                            ctx.fillText('Li(x)', topRight - 144, topTop + 38);

                            // Panel label
                            viz.screenText('Relative Error (%)', topLeft + 60, botTop - 6, viz.colors.text, 10);
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'For \\(x = 1000\\), compute the relative errors of \\(x/\\ln x\\) and \\(\\operatorname{Li}(x)\\) as approximations to \\(\\pi(x) = 168\\).',
                    hint: 'Use \\(\\ln 1000 \\approx 6.908\\) and \\(\\operatorname{Li}(1000) \\approx 177.6\\).',
                    solution: '\\(x/\\ln x = 1000/6.908 \\approx 144.8\\). Relative error: \\((168 - 144.8)/168 \\approx 13.8\\%\\). \\(\\operatorname{Li}(1000) \\approx 177.6\\). Relative error: \\((177.6 - 168)/168 \\approx 5.7\\%\\). Li(x) overshoots slightly but is far more accurate.'
                }
            ]
        },

        // ================================================================
        // SECTION 5: Riemann's Revolution
        // ================================================================
        {
            id: 'sec-riemann-revolution',
            title: 'Riemann\'s Revolution',
            content: `
<h2>Riemann's Revolution</h2>

<div class="env-block intuition">
    <div class="env-title">Eight Pages That Changed Mathematics</div>
    <div class="env-body">
        <p>In 1859, Bernhard Riemann published a single 8-page paper, "Ueber die Anzahl der Primzahlen unter einer gegebenen Gr\u00f6sse" ("On the Number of Primes Less Than a Given Magnitude"). This paper, submitted as part of his election to the Berlin Academy, is one of the most consequential documents in the history of mathematics. In it, Riemann introduced the ideas that transformed prime number theory from a collection of empirical observations and isolated results into a coherent analytic theory.</p>
    </div>
</div>

<h3>The Zeta Function Goes Complex</h3>

<p>Euler's product formula defined \\(\\zeta(s) = \\sum n^{-s}\\) for real \\(s > 1\\). Riemann's crucial step was to extend \\(\\zeta\\) to all complex numbers \\(s = \\sigma + it\\) (except \\(s = 1\\), where it has a simple pole). This analytic continuation revealed hidden structure:</p>

<div class="env-block definition">
    <div class="env-title">The Riemann Zeta Function</div>
    <div class="env-body">
        <p>The function \\(\\zeta(s)\\), initially defined by \\(\\sum_{n=1}^{\\infty} n^{-s}\\) for \\(\\operatorname{Re}(s) > 1\\), extends to a meromorphic function on all of \\(\\mathbb{C}\\) with a single simple pole at \\(s = 1\\).</p>
    </div>
</div>

<p>Riemann showed that \\(\\zeta\\) satisfies a remarkable functional equation linking its values at \\(s\\) and \\(1-s\\):</p>

\\[
\\zeta(s) = 2^s \\pi^{s-1} \\sin\\!\\left(\\frac{\\pi s}{2}\\right) \\Gamma(1-s)\\, \\zeta(1-s).
\\]

<p>This equation implies that \\(\\zeta(s) = 0\\) at the negative even integers \\(s = -2, -4, -6, \\ldots\\) (the "trivial zeros"). All other zeros, the non-trivial ones, must lie in the <strong>critical strip</strong> \\(0 \\leq \\operatorname{Re}(s) \\leq 1\\).</p>

<h3>Zeros Control Primes</h3>

<p>Riemann's deepest insight was that the distribution of prime numbers is governed by the locations of the zeros of \\(\\zeta(s)\\) in the critical strip. He wrote down an explicit formula expressing \\(\\pi(x)\\) as a sum over the zeros:</p>

\\[
\\pi(x) = \\operatorname{Li}(x) - \\sum_{\\rho} \\operatorname{Li}(x^{\\rho}) - \\ln 2 + \\int_x^{\\infty} \\frac{dt}{t(t^2-1)\\ln t},
\\]

<p>where the sum runs over all non-trivial zeros \\(\\rho\\) of \\(\\zeta\\). Each zero contributes a "correction term" \\(\\operatorname{Li}(x^{\\rho})\\), and these corrections oscillate like waves. The primes, viewed from this perspective, are the superposition of these waves, one for each zero.</p>

<div class="env-block remark">
    <div class="env-title">A musical analogy</div>
    <div class="env-body">
        <p>If \\(\\operatorname{Li}(x)\\) is the "fundamental frequency" of the primes, then each zero \\(\\rho\\) contributes a harmonic. The distribution of primes is the chord that results from playing all these harmonics together. The closer the zeros are to the critical line, the more orderly the music.</p>
    </div>
</div>

<h3>The Riemann Hypothesis</h3>

<p>Riemann computed the first few zeros and observed that they all lie on the line \\(\\operatorname{Re}(s) = 1/2\\). He wrote:</p>

<blockquote style="border-left:3px solid #58a6ff;padding-left:16px;color:#8b949e;font-style:italic;">
"One would of course like to have a rigorous proof of this; I have for the time being, after some fleeting vain attempts, put aside the search for such a proof."
</blockquote>

<div class="env-block theorem">
    <div class="env-title">The Riemann Hypothesis (1859)</div>
    <div class="env-body">
        <p>All non-trivial zeros of \\(\\zeta(s)\\) have real part equal to \\(1/2\\).</p>
    </div>
</div>

<p>This is the most famous open problem in mathematics. If true, it implies the strongest possible form of the Prime Number Theorem: \\(\\pi(x) = \\operatorname{Li}(x) + O(\\sqrt{x} \\ln x)\\). The error in the prime counting function would be as small as it could possibly be. Over 10 trillion zeros have been computed, and all lie on the critical line. Yet the conjecture remains unproved.</p>

<div class="viz-placeholder" data-viz="viz-ulam-spiral"></div>

<div class="viz-placeholder" data-viz="viz-prime-race"></div>
`,
            visualizations: [
                // VIZ 5: Ulam spiral
                {
                    id: 'viz-ulam-spiral',
                    title: 'The Ulam Spiral',
                    description: 'Arrange integers in a spiral. Primes (blue dots) cluster along diagonal lines, hinting at deep structure. Drag the slider to increase N.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 500,
                            originX: 280, originY: 250, scale: 1
                        });

                        function sievePrimes(max) {
                            var sieve = new Uint8Array(max + 1);
                            var primes = [];
                            for (var i = 2; i <= max; i++) {
                                if (!sieve[i]) {
                                    primes.push(i);
                                    for (var j = i * i; j <= max; j += i) sieve[j] = 1;
                                }
                            }
                            return primes;
                        }

                        var N = 2000;
                        var slider = VizEngine.createSlider(controls, 'N', 100, 10000, N, 100, function(v) {
                            N = Math.round(v);
                            draw();
                        });

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            var primeSet = new Set(sievePrimes(N + 1));

                            // Generate spiral coordinates
                            // Direction: right, up, left, down
                            var dx = [1, 0, -1, 0];
                            var dy = [0, 1, 0, -1];
                            var x = 0, y = 0;
                            var dir = 0;
                            var stepSize = 1;
                            var stepCount = 0;
                            var turnCount = 0;

                            // Determine pixel size based on N
                            var sideLen = Math.ceil(Math.sqrt(N));
                            var pixSize = Math.max(1, Math.min(6, Math.floor(Math.min(viz.width, viz.height) / (sideLen + 4))));
                            var cx = Math.floor(viz.width / 2);
                            var cy = Math.floor(viz.height / 2);

                            for (var n = 1; n <= N; n++) {
                                if (primeSet.has(n)) {
                                    var px = cx + x * pixSize;
                                    var py = cy - y * pixSize;
                                    ctx.fillStyle = viz.colors.blue;
                                    ctx.fillRect(px, py, Math.max(pixSize - 1, 1), Math.max(pixSize - 1, 1));
                                }

                                // Move in current direction
                                x += dx[dir];
                                y += dy[dir];
                                stepCount++;

                                if (stepCount === stepSize) {
                                    stepCount = 0;
                                    dir = (dir + 1) % 4;
                                    turnCount++;
                                    if (turnCount % 2 === 0) stepSize++;
                                }
                            }

                            // Title
                            viz.screenText('Ulam Spiral (N = ' + N + ')', viz.width / 2, 16, viz.colors.white, 14);
                            viz.screenText('Blue = prime', viz.width / 2, viz.height - 12, viz.colors.text, 10);
                        }
                        draw();
                        return viz;
                    }
                },

                // VIZ 6: Prime Race pi(x;4,1) vs pi(x;4,3)
                {
                    id: 'viz-prime-race',
                    title: 'Prime Race: Primes mod 4',
                    description: 'Count primes congruent to 1 mod 4 vs 3 mod 4. Primes \u2261 3 (mod 4) tend to lead, but the race is tight.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 380,
                            originX: 60, originY: 340, scale: 1
                        });

                        function sievePrimes(max) {
                            var sieve = new Uint8Array(max + 1);
                            var primes = [];
                            for (var i = 2; i <= max; i++) {
                                if (!sieve[i]) {
                                    primes.push(i);
                                    for (var j = i * i; j <= max; j += i) sieve[j] = 1;
                                }
                            }
                            return primes;
                        }

                        var allPrimes = sievePrimes(12000);
                        var xMax = 1000;
                        var animating = false;
                        var animX = 10;
                        var animId = null;

                        var slider = VizEngine.createSlider(controls, 'x max', 100, 10000, xMax, 100, function(v) {
                            xMax = Math.round(v);
                            if (!animating) draw(xMax);
                        });

                        var playBtn = VizEngine.createButton(controls, 'Play', function() {
                            if (animating) {
                                animating = false;
                                if (animId) { cancelAnimationFrame(animId); animId = null; }
                                playBtn.textContent = 'Play';
                            } else {
                                animating = true;
                                animX = 10;
                                playBtn.textContent = 'Pause';
                                animate();
                            }
                        });

                        function animate() {
                            if (!animating) return;
                            animX = Math.min(animX + Math.max(1, Math.floor(xMax / 300)), xMax);
                            draw(animX);
                            if (animX >= xMax) {
                                animating = false;
                                playBtn.textContent = 'Play';
                                return;
                            }
                            animId = requestAnimationFrame(animate);
                        }

                        function draw(upTo) {
                            viz.clear();
                            var ctx = viz.ctx;

                            var plotLeft = 70;
                            var plotRight = viz.width - 20;
                            var plotTop = 40;
                            var plotBottom = 320;
                            var plotW = plotRight - plotLeft;
                            var plotH = plotBottom - plotTop;

                            // Count primes mod 4
                            var count1 = 0, count3 = 0;
                            var data1 = [], data3 = [];
                            for (var i = 0; i < allPrimes.length && allPrimes[i] <= upTo; i++) {
                                var p = allPrimes[i];
                                if (p === 2) continue;
                                if (p % 4 === 1) {
                                    count1++;
                                    data1.push({ x: p, y: count1 });
                                } else if (p % 4 === 3) {
                                    count3++;
                                    data3.push({ x: p, y: count3 });
                                }
                            }

                            var yMax = Math.max(count1, count3, 5) * 1.1;

                            function toSx(x) { return plotLeft + (x / xMax) * plotW; }
                            function toSy(y) { return plotBottom - (y / yMax) * plotH; }

                            // Grid
                            ctx.strokeStyle = viz.colors.grid; ctx.lineWidth = 0.5;
                            var yStep = Math.pow(10, Math.floor(Math.log10(yMax / 4)));
                            if (yMax / yStep > 8) yStep *= 2;
                            ctx.fillStyle = viz.colors.text; ctx.font = '9px -apple-system,sans-serif';
                            ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
                            for (var gy = yStep; gy < yMax; gy += yStep) {
                                var sy = toSy(gy);
                                ctx.beginPath(); ctx.moveTo(plotLeft, sy); ctx.lineTo(plotRight, sy); ctx.stroke();
                                ctx.fillStyle = viz.colors.text;
                                ctx.fillText(Math.round(gy), plotLeft - 4, sy);
                            }

                            // Axes
                            ctx.strokeStyle = viz.colors.axis; ctx.lineWidth = 1.5;
                            ctx.beginPath(); ctx.moveTo(plotLeft, plotBottom); ctx.lineTo(plotRight, plotBottom); ctx.stroke();
                            ctx.beginPath(); ctx.moveTo(plotLeft, plotBottom); ctx.lineTo(plotLeft, plotTop); ctx.stroke();

                            // pi(x;4,3) - orange
                            ctx.strokeStyle = viz.colors.orange; ctx.lineWidth = 2;
                            ctx.beginPath();
                            if (data3.length > 0) {
                                ctx.moveTo(toSx(data3[0].x), toSy(data3[0].y));
                                for (var d3 = 1; d3 < data3.length; d3++) {
                                    ctx.lineTo(toSx(data3[d3].x), toSy(data3[d3].y));
                                }
                            }
                            ctx.stroke();

                            // pi(x;4,1) - teal
                            ctx.strokeStyle = viz.colors.teal; ctx.lineWidth = 2;
                            ctx.beginPath();
                            if (data1.length > 0) {
                                ctx.moveTo(toSx(data1[0].x), toSy(data1[0].y));
                                for (var d1 = 1; d1 < data1.length; d1++) {
                                    ctx.lineTo(toSx(data1[d1].x), toSy(data1[d1].y));
                                }
                            }
                            ctx.stroke();

                            // Title
                            viz.screenText('Prime Race: \u03C0(x; 4, 1) vs \u03C0(x; 4, 3)', viz.width / 2, 18, viz.colors.white, 14);

                            // Legend
                            var legY = plotBottom + 16;
                            ctx.font = '11px -apple-system,sans-serif'; ctx.textAlign = 'left';
                            ctx.fillStyle = viz.colors.teal;
                            ctx.fillRect(plotLeft + 40, legY, 14, 3);
                            ctx.fillText('\u03C0(x; 4, 1) = ' + count1, plotLeft + 58, legY + 5);
                            ctx.fillStyle = viz.colors.orange;
                            ctx.fillRect(plotLeft + 200, legY, 14, 3);
                            ctx.fillText('\u03C0(x; 4, 3) = ' + count3, plotLeft + 218, legY + 5);

                            var leader = count3 > count1 ? '3 mod 4 leads by ' + (count3 - count1) :
                                         count1 > count3 ? '1 mod 4 leads by ' + (count1 - count3) : 'Tied!';
                            viz.screenText(leader, viz.width / 2, legY + 26, viz.colors.white, 11);
                        }
                        draw(xMax);
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'The first few non-trivial zeros of \\(\\zeta(s)\\) on the critical line have imaginary parts approximately \\(14.13, 21.02, 25.01, 30.42, 32.94\\). Compute the average spacing between these zeros.',
                    hint: 'Compute the differences between consecutive values and average them.',
                    solution: 'Spacings: \\(21.02 - 14.13 = 6.89\\), \\(25.01 - 21.02 = 3.99\\), \\(30.42 - 25.01 = 5.41\\), \\(32.94 - 30.42 = 2.52\\). Average: \\((6.89 + 3.99 + 5.41 + 2.52)/4 = 4.70\\). The zeros are irregularly spaced, with average gap about 4.7.'
                },
                {
                    question: 'Count the primes that are \\(\\equiv 1 \\pmod{4}\\) and \\(\\equiv 3 \\pmod{4}\\) up to \\(x = 100\\). Which class is ahead?',
                    hint: 'List primes up to 100 and check each modulo 4. Remember that \\(p=2\\) is neither 1 nor 3 mod 4.',
                    solution: 'Primes \\(\\equiv 1\\pmod{4}\\): 5, 13, 17, 29, 37, 41, 53, 61, 73, 89, 97 (11 primes). Primes \\(\\equiv 3\\pmod{4}\\): 3, 7, 11, 19, 23, 31, 43, 47, 59, 67, 71, 79, 83 (13 primes). The 3 mod 4 class leads by 2. This phenomenon (Chebyshev\'s bias) persists: primes \\(\\equiv 3\\pmod{4}\\) tend to outnumber those \\(\\equiv 1\\pmod{4}\\), though the lead changes infinitely often.'
                }
            ]
        },

        // ================================================================
        // SECTION 6: What Lies Ahead
        // ================================================================
        {
            id: 'sec-roadmap',
            title: 'What Lies Ahead',
            content: `
<h2>What Lies Ahead</h2>

<div class="env-block intuition">
    <div class="env-title">A Map of the Territory</div>
    <div class="env-body">
        <p>We have traced the arc from Euclid's finitary proof to Riemann's analytic revolution. The rest of this course fills in the details, building the machinery piece by piece until we can prove the Prime Number Theorem and understand the Riemann Hypothesis.</p>
    </div>
</div>

<p>Here is the road ahead:</p>

<ol>
    <li><strong>Chapter 1: Arithmetic Functions</strong> — The Euler totient \\(\\varphi(n)\\), the M\u00f6bius function \\(\\mu(n)\\), divisor sums, and Dirichlet convolution. These are the algebraic building blocks of analytic number theory.</li>
    <li><strong>Chapter 2: Summation Techniques</strong> — Abel summation, partial summation, and the Euler-Maclaurin formula. How to convert sums into integrals and vice versa.</li>
    <li><strong>Chapter 3: The Zeta Function</strong> — Definition, analytic continuation, functional equation, and the connection to primes via the Euler product.</li>
    <li><strong>Chapter 4: Dirichlet Series and Characters</strong> — L-functions, Dirichlet's theorem on primes in arithmetic progressions, and the beginning of the modern theory.</li>
    <li><strong>Chapter 5: The Prime Number Theorem</strong> — The full proof, from Chebyshev's bounds through the Wiener-Ikehara approach.</li>
    <li><strong>Chapter 6: The Riemann Hypothesis and Beyond</strong> — The zero-free region, the explicit formula, and what RH would imply about the distribution of primes.</li>
</ol>

<div class="env-block remark">
    <div class="env-title">Prerequisites</div>
    <div class="env-body">
        <p>This course assumes familiarity with real analysis (limits, series, continuity, differentiation, integration) and some exposure to complex analysis (analytic functions, contour integration). Linear algebra and basic group theory will occasionally appear. No prior number theory is required beyond comfort with divisibility and modular arithmetic.</p>
    </div>
</div>

<p>The story of the primes is one of the great intellectual adventures in human history. Euclid knew they were infinite. Euler showed they were analytically significant. Gauss guessed their density. Riemann revealed that their deepest secrets are encoded in the zeros of an analytic function. We are about to learn how to read that encoding.</p>
`,
            visualizations: [],
            exercises: [
                {
                    question: 'The harmonic series \\(\\sum_{n=1}^{N} 1/n\\) and the prime reciprocal sum \\(\\sum_{p \\leq N} 1/p\\) both diverge. For \\(N = 100\\), compute (approximately) both sums and compare their sizes.',
                    hint: 'The harmonic series up to 100 is \\(\\approx \\ln 100 + \\gamma \\approx 5.187\\). For the prime sum, add \\(1/p\\) for each prime up to 100.',
                    solution: 'Harmonic: \\(H_{100} \\approx 5.187\\). Prime reciprocals: \\(1/2 + 1/3 + 1/5 + 1/7 + \\cdots + 1/97 \\approx 1.803\\). The prime sum is about a third of the harmonic sum. By Mertens\' theorem, \\(\\sum_{p \\leq N} 1/p \\approx \\ln\\ln N\\), which grows much more slowly than \\(\\ln N\\).'
                },
                {
                    question: 'If the Riemann Hypothesis is true, the error \\(|\\pi(x) - \\operatorname{Li}(x)|\\) is bounded by \\(C\\sqrt{x}\\ln x\\). For \\(x = 10^{10}\\), roughly how large could this error be (taking \\(C = 1/(8\\pi)\\) as a reasonable constant)?',
                    hint: 'Compute \\(\\sqrt{10^{10}} = 10^5\\) and \\(\\ln(10^{10}) = 10 \\ln 10 \\approx 23.03\\).',
                    solution: '\\(C\\sqrt{x}\\ln x = \\frac{1}{8\\pi} \\cdot 10^5 \\cdot 23.03 \\approx \\frac{2{,}303{,}000}{25.13} \\approx 91{,}600\\). The actual \\(\\pi(10^{10}) = 455{,}052{,}511\\), so the RH-implied error bound is about 0.02% of the true count. The actual error \\(|\\pi(10^{10}) - \\operatorname{Li}(10^{10})| \\approx 3{,}104\\) is well within this bound.'
                }
            ]
        }
    ]
});
