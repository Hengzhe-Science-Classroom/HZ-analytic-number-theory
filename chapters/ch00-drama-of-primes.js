// === Chapter 0: The Drama of the Primes ===
// Analytic Number Theory — Interactive Course
// 6 sections, 6 visualizations, 8 exercises

(function() {
    'use strict';

    // ----------------------------------------------------------------
    // Helper functions (shared across visualizations in this chapter)
    // ----------------------------------------------------------------

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
            if (primes[i] <= x) count++;
            else break;
        }
        return count;
    }

    // Logarithmic integral Li(x) via numerical integration (Gauss-Legendre approximation)
    function Li(x) {
        if (x <= 1) return 0;
        // Integrate 1/ln(t) from 2 to x using composite Simpson's rule
        var n = 200;
        var a = 2, b = x;
        var h = (b - a) / n;
        var sum = 1 / Math.log(a) + 1 / Math.log(b);
        for (var i = 1; i < n; i++) {
            var t = a + i * h;
            sum += (i % 2 === 0 ? 2 : 4) / Math.log(t);
        }
        return (h / 3) * sum;
    }

    // Precomputed primes up to 10000
    var PRIMES_10K = sievePrimes(10000);

    // ----------------------------------------------------------------
    window.CHAPTERS = window.CHAPTERS || [];
    window.CHAPTERS.push({
        id: 'ch00',
        number: 0,
        title: 'The Drama of the Primes',
        subtitle: 'From Euclid to Riemann: the greatest story in mathematics',
        sections: [

            // ============================================================
            // SECTION 1: Why Primes?
            // ============================================================
            {
                id: 'sec-why-primes',
                title: 'Why Primes?',
                content: `
<h2>Why Primes?</h2>

<div class="env-block intuition">
    <div class="env-title">An Opening Puzzle</div>
    <div class="env-body">
        <p>Pick any two large primes, say \\(p = 104{,}729\\) and \\(q = 224{,}737\\). Their product \\(n = pq = 23{,}531{,}897{,}273\\) takes a modern computer a fraction of a second to compute. But given only \\(n\\), finding \\(p\\) and \\(q\\) takes vastly longer — this asymmetry between multiplication and factoring is the foundation of RSA encryption, protecting trillions of dollars of internet traffic daily.</p>
        <p>The humble prime number sits at the intersection of pure mathematics, computational complexity, and cryptography. Why do primes have this power?</p>
    </div>
</div>

<p>An integer \\(p \\geq 2\\) is <strong>prime</strong> if its only divisors are \\(1\\) and \\(p\\) itself. The sequence begins:</p>
\\[
2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, \\ldots
\\]
<p>and continues without end. Their fundamental importance rests on a single theorem.</p>

<div class="env-block theorem">
    <div class="env-title">Theorem (Fundamental Theorem of Arithmetic)</div>
    <div class="env-body">
        <p>Every integer \\(n \\geq 2\\) can be written as a product of primes in exactly one way (up to ordering):</p>
        \\[
        n = p_1^{a_1} p_2^{a_2} \\cdots p_k^{a_k}, \\quad p_1 < p_2 < \\cdots < p_k \\text{ prime}, \\; a_i \\geq 1.
        \\]
        <p>This representation is called the <em>prime factorization</em> of \\(n\\).</p>
    </div>
</div>

<p>Primes are the <em>atoms</em> of multiplicative arithmetic: every positive integer is built from them, and the building is unique. This uniqueness is not obvious — it requires proof, relying on Euclid's lemma: if \\(p \\mid ab\\) and \\(p\\) is prime, then \\(p \\mid a\\) or \\(p \\mid b\\).</p>

<div class="env-block proof">
    <div class="env-title">Proof sketch (Euclid's Theorem: infinitely many primes)</div>
    <div class="env-body">
        <p>Suppose for contradiction that there are finitely many primes \\(p_1, p_2, \\ldots, p_k\\). Form</p>
        \\[
        N = p_1 p_2 \\cdots p_k + 1.
        \\]
        <p>Then \\(N > 1\\), so \\(N\\) has a prime factor \\(q\\). But \\(q\\) cannot be any \\(p_i\\), since dividing \\(N\\) by any \\(p_i\\) leaves remainder \\(1\\). Contradiction. \\(\\square\\)</p>
    </div>
</div>

<p>Euclid proved this around 300 BCE. It remains one of the most elegant arguments in all of mathematics. But knowing primes are infinite is only the beginning. The real question — one that would not be answered for another two millennia — is: <em>how many primes are there up to a given bound?</em></p>

<h3>Primes as the Multiplicative Basis</h3>

<p>The multiplicative structure of \\(\\mathbb{Z}\\) is entirely encoded in the primes. Every arithmetic function of multiplicative type factors through the prime factorization. For instance, the number of divisors of \\(n = p_1^{a_1} \\cdots p_k^{a_k}\\) is:</p>
\\[
d(n) = (a_1 + 1)(a_2 + 1) \\cdots (a_k + 1).
\\]
<p>The Euler totient satisfies \\(\\phi(n) = n \\prod_{p \\mid n}(1 - 1/p)\\). Every such formula ultimately traces back to how \\(n\\) factors into primes.</p>

<div class="env-block remark">
    <div class="env-title">Why Analytic Methods?</div>
    <div class="env-body">
        <p>The primes are defined combinatorially (no nontrivial factors), yet their global distribution is governed by analysis. This is the central miracle of analytic number theory: tools from complex analysis — contour integrals, residues, the theory of entire functions — yield precise information about an intrinsically discrete, multiplicative object. The bridge is the Euler product and the Riemann zeta function, which we build toward in this chapter.</p>
    </div>
</div>
`,
                visualizations: [],
                exercises: [
                    {
                        question: 'Write out the prime factorizations of \\(360\\), \\(1001\\), and \\(2^{10} - 1 = 1023\\). For each, compute the number of positive divisors \\(d(n) = \\prod (a_i + 1)\\).',
                        hint: 'For 1001, try dividing by small primes: 7, 11, 13. For 1023, note it equals \\(3 \\times 341\\).',
                        solution: '\\(360 = 2^3 \\cdot 3^2 \\cdot 5\\), so \\(d(360) = 4 \\cdot 3 \\cdot 2 = 24\\). \\(1001 = 7 \\cdot 11 \\cdot 13\\), so \\(d(1001) = 2 \\cdot 2 \\cdot 2 = 8\\). \\(1023 = 3 \\cdot 341 = 3 \\cdot 11 \\cdot 31\\), so \\(d(1023) = 2 \\cdot 2 \\cdot 2 = 8\\).'
                    },
                    {
                        question: 'Modify Euclid\'s proof: instead of forming \\(N = p_1 \\cdots p_k + 1\\), form \\(N = p_1 \\cdots p_k - 1\\). Does the argument still work? Why or why not?',
                        hint: 'The key property used is that \\(N \\equiv 1 \\pmod{p_i}\\) for all \\(i\\). Does \\(N = p_1 \\cdots p_k - 1\\) satisfy this?',
                        solution: 'Yes: \\(N = p_1 \\cdots p_k - 1 \\equiv -1 \\pmod{p_i}\\) for all \\(i\\), so no \\(p_i\\) divides \\(N\\). Any prime factor of \\(N\\) must be a new prime not in our list. The argument works equally well. (Caution: \\(N\\) could equal \\(1\\) if \\(k = 0\\), but since we assumed at least one prime, \\(N \\geq 1\\).)'
                    }
                ]
            },

            // ============================================================
            // SECTION 2: The Irregular Staircase
            // ============================================================
            {
                id: 'sec-irregularity',
                title: 'The Irregular Staircase',
                content: `
<h2>The Irregular Staircase</h2>

<div class="env-block intuition">
    <div class="env-title">Order Hidden in Chaos</div>
    <div class="env-body">
        <p>Plot \\(\\pi(x)\\) — the number of primes up to \\(x\\) — and you see a staircase climbing erratically, jumping by 1 at each prime and staying flat between them. No formula predicts exactly where the next step falls. Yet zoom out, and a smooth, regular curve emerges from the chaos. This tension between local unpredictability and global regularity is the central mystery of prime number theory.</p>
    </div>
</div>

<div class="env-block definition">
    <div class="env-title">Definition (Prime Counting Function)</div>
    <div class="env-body">
        <p>For \\(x > 0\\), define</p>
        \\[
        \\pi(x) = \\#\\{p \\leq x : p \\text{ prime}\\} = \\sum_{\\substack{p \\leq x \\\\ p \\text{ prime}}} 1.
        \\]
        <p>Some values: \\(\\pi(10) = 4\\), \\(\\pi(100) = 25\\), \\(\\pi(1000) = 168\\), \\(\\pi(10^6) = 78{,}498\\), \\(\\pi(10^9) = 50{,}847{,}534\\).</p>
    </div>
</div>

<p>The gaps between consecutive primes \\(g_n = p_{n+1} - p_n\\) are notoriously irregular. We have \\(g_1 = 1\\) (the only even prime is 2), but thereafter all gaps are even. Gaps can be arbitrarily large: for any \\(k\\), the \\(k\\) consecutive integers \\((k+1)! + 2, (k+1)! + 3, \\ldots, (k+1)! + (k+1)\\) are all composite. Yet we also have:</p>

<div class="env-block theorem">
    <div class="env-title">Theorem (Bertrand's Postulate, 1845)</div>
    <div class="env-body">
        <p>For every integer \\(n \\geq 1\\), there is at least one prime \\(p\\) with \\(n < p \\leq 2n\\).</p>
        <p>Equivalently, \\(g_n = p_{n+1} - p_n < p_n\\) for all \\(n\\), so no prime gap exceeds the prime itself.</p>
    </div>
</div>

<p>Bertrand's postulate was proved by Chebyshev (1852) using elementary estimates. Much finer results are known: unconditionally, \\(g_n = O(p_n^{0.525})\\) (Baker–Harman–Pintz 2001); under RH, \\(g_n = O(\\sqrt{p_n} \\log p_n)\\). The <em>twin prime conjecture</em> asserts \\(g_n = 2\\) infinitely often — still open after millennia. Zhang (2013) proved \\(g_n < 7 \\times 10^7\\) infinitely often, and subsequent work (Maynard, Tao, Polymath8) reduced this to 246.</p>

<h3>The Ulam Spiral</h3>

<p>Arrange the positive integers in a square spiral. Color the primes. The result — the Ulam spiral — shows unexpected diagonal streaks. These correspond to quadratic polynomials \\(4n^2 + bn + c\\) that produce unusually many primes. This visual regularity is still not fully understood theoretically.</p>

<div class="viz-placeholder" data-viz="viz-prime-staircase"></div>
<div class="viz-placeholder" data-viz="viz-prime-gaps"></div>
<div class="viz-placeholder" data-viz="viz-ulam-spiral"></div>
`,
                visualizations: [
                    {
                        id: 'viz-prime-staircase',
                        title: '\\(\\pi(x)\\) vs. Smooth Approximations',
                        description: 'The prime counting function \\(\\pi(x)\\) as a blue staircase, compared to \\(x/\\ln x\\) (teal) and \\(\\mathrm{Li}(x)\\) (orange). Drag the slider to zoom in or out.',
                        setup: function(body, controls) {
                            var viz = new VizEngine(body, { width: 620, height: 380, originX: 60, originY: 340, scale: 1 });
                            var xMax = 500;

                            VizEngine.createSlider(controls, 'x max', 100, 10000, xMax, 100, function(v) {
                                xMax = Math.round(v);
                                draw();
                            });

                            function draw() {
                                viz.clear();
                                var ctx = viz.ctx;
                                var W = viz.width, H = viz.height;
                                var padL = 60, padR = 20, padT = 30, padB = 40;
                                var plotW = W - padL - padR;
                                var plotH = H - padT - padB;

                                var primes = PRIMES_10K.filter(function(p) { return p <= xMax; });
                                var piMax = primes.length;

                                function sx(x) { return padL + (x / xMax) * plotW; }
                                function sy(y) { return padT + plotH - (y / (piMax * 1.1)) * plotH; }

                                // Grid lines
                                ctx.strokeStyle = '#1a1a40';
                                ctx.lineWidth = 0.5;
                                for (var g = 0; g <= 5; g++) {
                                    var yv = (g / 5) * piMax * 1.1;
                                    var yp = sy(yv);
                                    ctx.beginPath(); ctx.moveTo(padL, yp); ctx.lineTo(W - padR, yp); ctx.stroke();
                                    ctx.fillStyle = '#4a4a7a';
                                    ctx.font = '10px -apple-system,sans-serif';
                                    ctx.textAlign = 'right';
                                    ctx.fillText(Math.round(yv), padL - 4, yp + 3);
                                }
                                for (var g2 = 0; g2 <= 4; g2++) {
                                    var xv = (g2 / 4) * xMax;
                                    var xp = sx(xv);
                                    ctx.beginPath(); ctx.moveTo(xp, padT); ctx.lineTo(xp, H - padB); ctx.stroke();
                                    ctx.fillStyle = '#4a4a7a';
                                    ctx.font = '10px -apple-system,sans-serif';
                                    ctx.textAlign = 'center';
                                    ctx.fillText(Math.round(xv), xp, H - padB + 14);
                                }

                                // x/ln(x) curve
                                ctx.strokeStyle = '#3fb9a0';
                                ctx.lineWidth = 2;
                                ctx.beginPath();
                                var started = false;
                                for (var xi = 3; xi <= xMax; xi += Math.max(1, xMax / 400)) {
                                    var y1 = xi / Math.log(xi);
                                    var px2 = sx(xi), py2 = sy(y1);
                                    if (!started) { ctx.moveTo(px2, py2); started = true; }
                                    else ctx.lineTo(px2, py2);
                                }
                                ctx.stroke();

                                // Li(x) curve
                                ctx.strokeStyle = '#f0883e';
                                ctx.lineWidth = 2;
                                ctx.beginPath();
                                started = false;
                                for (var xi2 = 3; xi2 <= xMax; xi2 += Math.max(1, xMax / 400)) {
                                    var y2 = Li(xi2);
                                    var px3 = sx(xi2), py3 = sy(y2);
                                    if (!started) { ctx.moveTo(px3, py3); started = true; }
                                    else ctx.lineTo(px3, py3);
                                }
                                ctx.stroke();

                                // pi(x) staircase
                                ctx.strokeStyle = '#58a6ff';
                                ctx.lineWidth = 2.5;
                                ctx.beginPath();
                                ctx.moveTo(sx(2), sy(0));
                                var cnt = 0;
                                for (var pi2 = 0; pi2 < primes.length; pi2++) {
                                    var p = primes[pi2];
                                    var pNext = pi2 + 1 < primes.length ? primes[pi2 + 1] : xMax;
                                    // horizontal segment before prime
                                    ctx.lineTo(sx(p), sy(cnt));
                                    cnt++;
                                    // vertical jump at prime
                                    ctx.lineTo(sx(p), sy(cnt));
                                    // horizontal after prime
                                    ctx.lineTo(sx(Math.min(pNext, xMax)), sy(cnt));
                                }
                                ctx.stroke();

                                // Legend
                                var legY = padT + 10;
                                ctx.font = '11px -apple-system,sans-serif';
                                ctx.textAlign = 'left';
                                [[viz.colors ? '#58a6ff' : '#58a6ff', '\u03c0(x)'],
                                 ['#3fb9a0', 'x/ln(x)'],
                                 ['#f0883e', 'Li(x)']].forEach(function(item, idx) {
                                    ctx.fillStyle = item[0];
                                    ctx.fillRect(W - padR - 120, legY + idx * 18, 20, 3);
                                    ctx.fillStyle = '#c9d1d9';
                                    ctx.fillText(item[1], W - padR - 94, legY + idx * 18 + 4);
                                });

                                // Title
                                ctx.fillStyle = '#8b949e';
                                ctx.font = '12px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.fillText('\u03c0(' + xMax + ') = ' + piMax, W / 2, padT - 10);
                            }

                            draw();
                            return viz;
                        }
                    },
                    {
                        id: 'viz-prime-gaps',
                        title: 'Prime Gaps \\(g_n = p_{n+1} - p_n\\)',
                        description: 'Scatter plot of prime gaps. Each dot represents the gap after the \\(n\\)-th prime. Dots are colored by gap size: small gaps blue, large gaps red.',
                        setup: function(body, controls) {
                            var viz = new VizEngine(body, { width: 620, height: 340, originX: 60, originY: 300, scale: 1 });
                            var nMax = 200;

                            VizEngine.createSlider(controls, 'primes shown', 50, 500, nMax, 10, function(v) {
                                nMax = Math.round(v);
                                draw();
                            });

                            function draw() {
                                viz.clear();
                                var ctx = viz.ctx;
                                var W = viz.width, H = viz.height;
                                var padL = 55, padR = 20, padT = 30, padB = 40;
                                var plotW = W - padL - padR;
                                var plotH = H - padT - padB;

                                var n = Math.min(nMax, PRIMES_10K.length - 1);
                                var gaps = [];
                                var maxGap = 0;
                                for (var i = 0; i < n; i++) {
                                    var g = PRIMES_10K[i + 1] - PRIMES_10K[i];
                                    gaps.push(g);
                                    if (g > maxGap) maxGap = g;
                                }

                                function sx(i) { return padL + (i / n) * plotW; }
                                function sy(g) { return padT + plotH - (g / (maxGap + 4)) * plotH; }

                                // Grid
                                ctx.strokeStyle = '#1a1a40';
                                ctx.lineWidth = 0.5;
                                var gapTicks = [2, 6, 12, 18, 24, 30, 36];
                                gapTicks.forEach(function(gt) {
                                    if (gt > maxGap + 4) return;
                                    var yp = sy(gt);
                                    ctx.beginPath(); ctx.moveTo(padL, yp); ctx.lineTo(W - padR, yp); ctx.stroke();
                                    ctx.fillStyle = '#4a4a7a';
                                    ctx.font = '10px -apple-system,sans-serif';
                                    ctx.textAlign = 'right';
                                    ctx.fillText(gt, padL - 4, yp + 3);
                                });

                                // Axes
                                ctx.strokeStyle = '#4a4a7a';
                                ctx.lineWidth = 1;
                                ctx.beginPath();
                                ctx.moveTo(padL, padT); ctx.lineTo(padL, H - padB);
                                ctx.moveTo(padL, H - padB); ctx.lineTo(W - padR, H - padB);
                                ctx.stroke();

                                // x-axis labels
                                ctx.fillStyle = '#4a4a7a';
                                ctx.font = '10px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                for (var ti = 0; ti <= 4; ti++) {
                                    var idx = Math.round((ti / 4) * n);
                                    ctx.fillText(idx, sx(idx), H - padB + 14);
                                }

                                // Dots
                                for (var i2 = 0; i2 < gaps.length; i2++) {
                                    var g2 = gaps[i2];
                                    var t = g2 / (maxGap || 1);
                                    // Color: small = blue, large = red
                                    var r = Math.round(88 + 167 * t);
                                    var gb2 = Math.round(166 - 130 * t);
                                    var b2 = Math.round(255 - 187 * t);
                                    ctx.fillStyle = 'rgb(' + r + ',' + gb2 + ',' + b2 + ')';
                                    ctx.beginPath();
                                    ctx.arc(sx(i2 + 1), sy(g2), 3, 0, Math.PI * 2);
                                    ctx.fill();
                                }

                                // Labels
                                ctx.fillStyle = '#8b949e';
                                ctx.font = '12px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.fillText('n (prime index)', W / 2, H - 5);
                                ctx.save();
                                ctx.translate(12, H / 2);
                                ctx.rotate(-Math.PI / 2);
                                ctx.fillText('gap size', 0, 0);
                                ctx.restore();

                                // Annotate max gap
                                var maxIdx = gaps.indexOf(maxGap);
                                ctx.fillStyle = '#f85149';
                                ctx.font = '10px -apple-system,sans-serif';
                                ctx.textAlign = 'left';
                                ctx.fillText('max=' + maxGap + ' after p=' + PRIMES_10K[maxIdx], sx(maxIdx + 1) + 5, sy(maxGap) - 5);
                            }

                            draw();
                            return viz;
                        }
                    },
                    {
                        id: 'viz-ulam-spiral',
                        title: 'Ulam Spiral',
                        description: 'Integers arranged in a square spiral; primes colored blue. Diagonal streaks correspond to prime-rich quadratic polynomials.',
                        setup: function(body, controls) {
                            var viz = new VizEngine(body, { width: 500, height: 500, originX: 250, originY: 250, scale: 1 });
                            var N = 2500;

                            VizEngine.createSlider(controls, 'N', 100, 10000, N, 100, function(v) {
                                N = Math.round(v);
                                draw();
                            });

                            function draw() {
                                viz.clear();
                                var ctx = viz.ctx;
                                var W = viz.width, H = viz.height;
                                var side = Math.ceil(Math.sqrt(N));
                                var cellSize = Math.max(1, Math.floor(Math.min(W, H) / (side + 2)));
                                var ox = Math.floor(W / 2);
                                var oy = Math.floor(H / 2);

                                // Sieve for N
                                var localPrimes = sievePrimes(N + 10);
                                var isPrime = new Uint8Array(N + 10);
                                for (var i = 0; i < localPrimes.length; i++) isPrime[localPrimes[i]] = 1;

                                // Spiral walk: right, up, left, down...
                                var x = 0, y = 0;
                                var dx = 1, dy = 0;
                                var steps = 1, stepCount = 0, turns = 0;

                                for (var n = 1; n <= N; n++) {
                                    var px = ox + x * cellSize;
                                    var py = oy - y * cellSize;

                                    if (isPrime[n]) {
                                        ctx.fillStyle = '#58a6ff';
                                        ctx.fillRect(px - Math.floor(cellSize / 2), py - Math.floor(cellSize / 2), cellSize, cellSize);
                                    } else if (cellSize >= 3) {
                                        ctx.fillStyle = '#1a1a40';
                                        ctx.fillRect(px - Math.floor(cellSize / 2), py - Math.floor(cellSize / 2), cellSize, cellSize);
                                    }

                                    // Move
                                    x += dx; y += dy;
                                    stepCount++;
                                    if (stepCount === steps) {
                                        stepCount = 0;
                                        // Turn left (dx,dy) -> (-dy,dx)
                                        var tmp = dx; dx = -dy; dy = tmp;
                                        turns++;
                                        if (turns % 2 === 0) steps++;
                                    }
                                }

                                ctx.fillStyle = '#8b949e';
                                ctx.font = '12px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.fillText('N = ' + N + '  (' + localPrimes.filter(function(p) { return p <= N; }).length + ' primes)', W / 2, H - 8);
                            }

                            draw();
                            return viz;
                        }
                    }
                ],
                exercises: [
                    {
                        question: 'Compute \\(\\pi(100)\\) by hand (or by systematic elimination). List all primes up to 100.',
                        hint: 'Use the Sieve of Eratosthenes: eliminate multiples of 2, 3, 5, 7 up to 100. You only need to check primes up to \\(\\sqrt{100} = 10\\).',
                        solution: 'There are \\(\\pi(100) = 25\\) primes up to 100: 2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97.'
                    },
                    {
                        question: 'Verify Bertrand\'s Postulate for \\(n \\leq 50\\): for each \\(n\\), find a prime \\(p\\) with \\(n < p \\leq 2n\\).',
                        hint: 'Use the prime list from the previous exercise plus primes in \\((50, 100]\\).',
                        solution: 'For example: \\(n=1\\): \\(p=2\\); \\(n=2\\): \\(p=3\\); \\(n=10\\): \\(p=11\\); \\(n=20\\): \\(p=23\\); \\(n=50\\): \\(p=53\\). In each case, a prime exists in the interval \\((n, 2n]\\), confirming Bertrand\'s Postulate. The nearest prime to \\(n\\) from above never exceeds \\(2n\\) for \\(n \\leq 50\\).'
                    }
                ]
            },

            // ============================================================
            // SECTION 3: Euler's Bridge to Analysis
            // ============================================================
            {
                id: 'sec-euler-connection',
                title: "Euler's Bridge to Analysis",
                content: `
<h2>Euler's Bridge to Analysis</h2>

<div class="env-block intuition">
    <div class="env-title">From Discrete to Continuous</div>
    <div class="env-body">
        <p>Primes are among the most discrete objects in mathematics — individual integers with a combinatorial definition. Yet Euler discovered that the sum of their reciprocals \\(\\sum 1/p\\) diverges, and the mechanism of the proof runs through a beautiful product formula that connects the discrete world of integers to the continuous world of convergent series. This is the first hint that analysis has something to say about primes.</p>
    </div>
</div>

<p>In 1737, Euler proved a spectacular identity relating a sum over all positive integers to a product over primes:</p>

<div class="env-block theorem">
    <div class="env-title">Theorem (Euler Product Formula)</div>
    <div class="env-body">
        <p>For real \\(s > 1\\),</p>
        \\[
        \\sum_{n=1}^{\\infty} \\frac{1}{n^s} = \\prod_{p \\text{ prime}} \\frac{1}{1 - p^{-s}}.
        \\]
        <p>The left side is the Riemann zeta function \\(\\zeta(s)\\); the right is the Euler product.</p>
    </div>
</div>

<div class="env-block proof">
    <div class="env-title">Proof</div>
    <div class="env-body">
        <p>Expand each factor on the right as a geometric series (valid for \\(p^{-s} < 1\\), i.e., \\(s > 0\\)):</p>
        \\[
        \\frac{1}{1 - p^{-s}} = 1 + p^{-s} + p^{-2s} + p^{-3s} + \\cdots = \\sum_{a=0}^{\\infty} p^{-as}.
        \\]
        <p>The product over all primes therefore equals</p>
        \\[
        \\prod_p \\sum_{a=0}^{\\infty} p^{-as} = \\sum_{n} n^{-s},
        \\]
        <p>where the last sum runs over all positive integers, each occurring exactly once by the Fundamental Theorem of Arithmetic (unique factorization). For \\(s > 1\\), both the sum and product converge absolutely, justifying the rearrangement. \\(\\square\\)</p>
    </div>
</div>

<h3>Divergence of \\(\\sum 1/p\\)</h3>

<p>The Euler product immediately yields a new proof of the infinitude of primes, and much more:</p>

<div class="env-block theorem">
    <div class="env-title">Theorem (Euler, 1737)</div>
    <div class="env-body">
        <p>The series \\(\\sum_{p} 1/p\\) (over all primes) diverges.</p>
    </div>
</div>

<div class="env-block proof">
    <div class="env-title">Proof sketch</div>
    <div class="env-body">
        <p>Take logarithms of the Euler product at \\(s = 1\\):</p>
        \\[
        \\log \\zeta(s) = -\\sum_p \\log(1 - p^{-s}) = \\sum_p \\left(p^{-s} + \\frac{1}{2}p^{-2s} + \\frac{1}{3}p^{-3s} + \\cdots \\right).
        \\]
        <p>The tail \\(\\sum_p \\sum_{k \\geq 2} \\frac{1}{k} p^{-ks}\\) is bounded by \\(\\sum_n n^{-2s}/(1 - n^{-s})\\), which is bounded as \\(s \\to 1^+\\). So</p>
        \\[
        \\sum_p p^{-s} = \\log \\zeta(s) + O(1) \\to +\\infty \\quad \\text{as } s \\to 1^+,
        \\]
        <p>since \\(\\zeta(s) \\to +\\infty\\) as \\(s \\to 1^+\\). Thus \\(\\sum_p 1/p = +\\infty\\). \\(\\square\\)</p>
    </div>
</div>

<p>This is stronger than the infinitude of primes: the primes are not just infinite but "large" in the sense that their reciprocals do not form a convergent series. For comparison, the sum over prime squares \\(\\sum_p 1/p^2\\) converges (it is approximately 0.4522). Mertens' theorem (1874) gives the precise asymptotic:</p>
\\[
\\sum_{p \\leq x} \\frac{1}{p} = \\log \\log x + M + o(1),
\\]
<p>where \\(M \\approx 0.2615\\) is the <em>Meissel–Mertens constant</em>.</p>

<div class="viz-placeholder" data-viz="viz-euler-product"></div>

<div class="env-block remark">
    <div class="env-title">The Product as an Encoding</div>
    <div class="env-body">
        <p>The Euler product \\(\\zeta(s) = \\prod_p (1 - p^{-s})^{-1}\\) encodes all multiplicative arithmetic in a single formula. Taking the logarithmic derivative yields \\(-\\zeta'(s)/\\zeta(s) = \\sum_n \\Lambda(n) n^{-s}\\), where \\(\\Lambda\\) is the von Mangoldt function. This connects the zeros and poles of \\(\\zeta\\) to the distribution of primes — the key insight behind Riemann's 1859 paper.</p>
    </div>
</div>
`,
                visualizations: [
                    {
                        id: 'viz-euler-product',
                        title: "Euler Product: Partial Products vs. \\(\\zeta(s)\\)",
                        description: 'Build the Euler product \\(\\prod_{p \\leq P} (1-p^{-s})^{-1}\\) one prime at a time for real \\(s > 1\\). The bar chart shows each factor; the running product converges to \\(\\zeta(s)\\).',
                        setup: function(body, controls) {
                            var viz = new VizEngine(body, { width: 620, height: 360, originX: 60, originY: 320, scale: 1 });
                            var sVal = 2.0;
                            var numPrimes = 12;

                            VizEngine.createSlider(controls, 's', 1.1, 4.0, sVal, 0.1, function(v) {
                                sVal = v;
                                draw();
                            });
                            VizEngine.createSlider(controls, 'primes used', 2, 20, numPrimes, 1, function(v) {
                                numPrimes = Math.round(v);
                                draw();
                            });

                            function zetaApprox(s) {
                                // Use many terms for reference
                                var sum = 0;
                                for (var n = 1; n <= 50000; n++) sum += Math.pow(n, -s);
                                return sum;
                            }

                            function draw() {
                                viz.clear();
                                var ctx = viz.ctx;
                                var W = viz.width, H = viz.height;
                                var padL = 55, padR = 20, padT = 40, padB = 50;
                                var plotW = W - padL - padR;
                                var plotH = H - padT - padB;

                                var primes = PRIMES_10K.slice(0, numPrimes);
                                var factors = primes.map(function(p) { return 1 / (1 - Math.pow(p, -sVal)); });

                                // Running product
                                var running = [];
                                var prod = 1;
                                for (var i = 0; i < factors.length; i++) {
                                    prod *= factors[i];
                                    running.push(prod);
                                }

                                var zeta = zetaApprox(sVal);
                                var maxVal = Math.max(zeta * 1.1, running[running.length - 1] * 1.1, 1.5);

                                var barW = Math.min(24, (plotW / numPrimes) * 0.5);

                                function sy(v) { return padT + plotH - (v / maxVal) * plotH; }
                                function sx(i) { return padL + (i + 0.5) * (plotW / numPrimes); }

                                // Reference line: zeta(s)
                                ctx.strokeStyle = '#f0883e';
                                ctx.lineWidth = 1.5;
                                ctx.setLineDash([6, 4]);
                                ctx.beginPath();
                                ctx.moveTo(padL, sy(zeta));
                                ctx.lineTo(W - padR, sy(zeta));
                                ctx.stroke();
                                ctx.setLineDash([]);
                                ctx.fillStyle = '#f0883e';
                                ctx.font = '11px -apple-system,sans-serif';
                                ctx.textAlign = 'left';
                                ctx.fillText('\u03b6(' + sVal.toFixed(1) + ') \u2248 ' + zeta.toFixed(4), W - padR - 110, sy(zeta) - 6);

                                // Bars for individual factors (1-p^-s)^-1
                                for (var i2 = 0; i2 < primes.length; i2++) {
                                    var x = sx(i2);
                                    var fac = factors[i2];

                                    ctx.fillStyle = '#58a6ff66';
                                    ctx.fillRect(x - barW / 2, sy(fac), barW, plotH - (sy(fac) - padT - plotH + plotH));
                                    ctx.fillRect(x - barW / 2, sy(fac), barW, sy(0) - sy(fac));
                                    ctx.fillStyle = '#58a6ff';
                                    ctx.fillRect(x - barW / 2, sy(fac), barW, sy(0) - sy(fac));

                                    // Prime label
                                    ctx.fillStyle = '#8b949e';
                                    ctx.font = '10px -apple-system,sans-serif';
                                    ctx.textAlign = 'center';
                                    ctx.fillText('p=' + primes[i2], x, padT + plotH + 16);
                                    ctx.fillText(fac.toFixed(3), x, sy(fac) - 6);
                                }

                                // Running product line
                                ctx.strokeStyle = '#3fb950';
                                ctx.lineWidth = 2;
                                ctx.beginPath();
                                for (var i3 = 0; i3 < running.length; i3++) {
                                    var x3 = sx(i3);
                                    var y3 = sy(running[i3]);
                                    if (i3 === 0) ctx.moveTo(x3, y3);
                                    else ctx.lineTo(x3, y3);
                                    ctx.arc(x3, y3, 3, 0, Math.PI * 2);
                                }
                                ctx.stroke();

                                // Y-axis ticks
                                ctx.fillStyle = '#4a4a7a';
                                ctx.font = '10px -apple-system,sans-serif';
                                ctx.textAlign = 'right';
                                for (var t = 0; t <= 4; t++) {
                                    var yv = (t / 4) * maxVal;
                                    ctx.fillText(yv.toFixed(1), padL - 4, sy(yv) + 3);
                                    ctx.strokeStyle = '#1a1a40';
                                    ctx.lineWidth = 0.5;
                                    ctx.beginPath();
                                    ctx.moveTo(padL, sy(yv));
                                    ctx.lineTo(W - padR, sy(yv));
                                    ctx.stroke();
                                }

                                // Legend
                                var legX = padL + 10;
                                var legY = padT + 10;
                                ctx.font = '11px -apple-system,sans-serif';
                                ctx.textAlign = 'left';
                                ctx.fillStyle = '#58a6ff';
                                ctx.fillRect(legX, legY, 14, 10);
                                ctx.fillStyle = '#c9d1d9';
                                ctx.fillText('(1 - p\u207b\u02e2)\u207b\u00b9  per prime', legX + 18, legY + 9);
                                ctx.strokeStyle = '#3fb950';
                                ctx.lineWidth = 2;
                                ctx.beginPath();
                                ctx.moveTo(legX, legY + 24); ctx.lineTo(legX + 14, legY + 24);
                                ctx.stroke();
                                ctx.fillStyle = '#c9d1d9';
                                ctx.fillText('running product', legX + 18, legY + 27);

                                // Title info
                                ctx.fillStyle = '#8b949e';
                                ctx.font = '12px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.fillText('s = ' + sVal.toFixed(2) + '   product over ' + numPrimes + ' primes = ' + running[running.length - 1].toFixed(5), W / 2, padT - 16);
                            }

                            draw();
                            return viz;
                        }
                    }
                ],
                exercises: [
                    {
                        question: 'Compute the Euler product \\(\\prod_{p \\leq 13} (1 - p^{-2})^{-1}\\) using \\(p = 2, 3, 5, 7, 11, 13\\). Compare to \\(\\zeta(2) = \\pi^2/6 \\approx 1.6449\\).',
                        hint: 'Each factor is \\(1/(1 - 1/p^2)\\). For \\(p=2\\): \\(1/(1-1/4) = 4/3\\). Multiply the six factors together.',
                        solution: '\\(\\frac{4}{3} \\cdot \\frac{9}{8} \\cdot \\frac{25}{24} \\cdot \\frac{49}{48} \\cdot \\frac{121}{120} \\cdot \\frac{169}{168} \\approx 1.5696 / 0.9705 \\approx 1.6170\\). This is already within 1.7% of \\(\\pi^2/6 \\approx 1.6449\\), showing rapid convergence.'
                    }
                ]
            },

            // ============================================================
            // SECTION 4: The Gauss–Legendre Conjecture
            // ============================================================
            {
                id: 'sec-gauss-conjecture',
                title: 'The Gauss–Legendre Conjecture',
                content: `
<h2>The Gauss–Legendre Conjecture</h2>

<div class="env-block intuition">
    <div class="env-title">The First Asymptotic</div>
    <div class="env-body">
        <p>By 1792, Gauss had computed tables of primes by hand and noticed an empirical pattern: the density of primes near \\(x\\) is approximately \\(1/\\ln x\\). A prime near \\(10^6\\) has roughly a 1-in-14 chance of being prime; near \\(10^9\\), about 1-in-21. Integrating this density gives a far more accurate estimate than \\(x/\\ln x\\) — the logarithmic integral \\(\\mathrm{Li}(x)\\).</p>
    </div>
</div>

<div class="env-block theorem">
    <div class="env-title">Theorem (Prime Number Theorem, proved 1896)</div>
    <div class="env-body">
        <p>As \\(x \\to \\infty\\),</p>
        \\[
        \\pi(x) \\sim \\frac{x}{\\ln x},
        \\]
        <p>meaning \\(\\pi(x) / (x / \\ln x) \\to 1\\). Equivalently, the \\(n\\)-th prime satisfies \\(p_n \\sim n \\ln n\\).</p>
    </div>
</div>

<p>Gauss and Legendre conjectured this independently around 1796–1798. A proof eluded mathematicians for a century. Chebyshev (1852) proved \\(0.92 < \\pi(x)/(x/\\ln x) < 1.11\\) for large \\(x\\) — the right order, but not the limit. The full theorem was proved simultaneously by Hadamard and de la Vallée Poussin in 1896, using the theory of the Riemann zeta function.</p>

<h3>Li(x) is Better</h3>

<p>Gauss actually used the <em>logarithmic integral</em></p>
\\[
\\mathrm{Li}(x) = \\int_2^x \\frac{dt}{\\ln t},
\\]
<p>which is a far more accurate approximation. Numerically:</p>

<table style="border-collapse:collapse;width:100%;font-size:0.9rem;margin:1em 0;">
    <thead>
        <tr style="border-bottom:1px solid #30363d;color:#8b949e;">
            <th style="padding:6px 12px;text-align:left;">x</th>
            <th style="padding:6px 12px;text-align:right;">\\(\\pi(x)\\)</th>
            <th style="padding:6px 12px;text-align:right;">\\(x/\\ln x\\)</th>
            <th style="padding:6px 12px;text-align:right;">\\(\\mathrm{Li}(x)\\)</th>
            <th style="padding:6px 12px;text-align:right;">\\(|\\pi - \\mathrm{Li}|\\)</th>
        </tr>
    </thead>
    <tbody style="color:#c9d1d9;">
        <tr><td style="padding:4px 12px;">\\(10^3\\)</td><td style="padding:4px 12px;text-align:right;">168</td><td style="padding:4px 12px;text-align:right;">145</td><td style="padding:4px 12px;text-align:right;">178</td><td style="padding:4px 12px;text-align:right;">10</td></tr>
        <tr><td style="padding:4px 12px;">\\(10^4\\)</td><td style="padding:4px 12px;text-align:right;">1,229</td><td style="padding:4px 12px;text-align:right;">1,086</td><td style="padding:4px 12px;text-align:right;">1,246</td><td style="padding:4px 12px;text-align:right;">17</td></tr>
        <tr><td style="padding:4px 12px;">\\(10^6\\)</td><td style="padding:4px 12px;text-align:right;">78,498</td><td style="padding:4px 12px;text-align:right;">72,382</td><td style="padding:4px 12px;text-align:right;">78,628</td><td style="padding:4px 12px;text-align:right;">130</td></tr>
        <tr><td style="padding:4px 12px;">\\(10^9\\)</td><td style="padding:4px 12px;text-align:right;">50,847,534</td><td style="padding:4px 12px;text-align:right;">48,254,942</td><td style="padding:4px 12px;text-align:right;">50,849,235</td><td style="padding:4px 12px;text-align:right;">1,701</td></tr>
    </tbody>
</table>

<p>In each row, \\(\\mathrm{Li}(x)\\) is dramatically closer to \\(\\pi(x)\\) than \\(x/\\ln x\\). The error in \\(\\mathrm{Li}(x)\\) is related to the zeros of \\(\\zeta(s)\\) via the explicit formula:</p>
\\[
\\pi(x) = \\mathrm{Li}(x) - \\sum_{\\rho} \\mathrm{Li}(x^\\rho) + \\text{smaller terms},
\\]
<p>where the sum runs over the nontrivial zeros \\(\\rho\\) of \\(\\zeta(s)\\). Each zero contributes an oscillatory correction; if \\(\\mathrm{Re}(\\rho) = 1/2\\) for all \\(\\rho\\) (the Riemann Hypothesis), the error satisfies \\(|\\pi(x) - \\mathrm{Li}(x)| = O(\\sqrt{x} \\log x)\\).</p>

<div class="viz-placeholder" data-viz="viz-pi-vs-approx"></div>

<div class="env-block remark">
    <div class="env-title">Skewes' Number</div>
    <div class="env-body">
        <p>It appears from all computed data that \\(\\pi(x) < \\mathrm{Li}(x)\\) always. But Littlewood (1914) proved that the difference \\(\\pi(x) - \\mathrm{Li}(x)\\) changes sign infinitely often. The first crossing was long known only to occur before \\(e^{e^{e^{79}}}\\) (Skewes, 1933 — the "Skewes number"), one of the largest numbers ever to appear in a mathematical proof at the time. Current estimates place the first crossover near \\(x \\approx 1.40 \\times 10^{316}\\).</p>
    </div>
</div>
`,
                visualizations: [
                    {
                        id: 'viz-pi-vs-approx',
                        title: '\\(\\pi(x)\\), \\(x/\\ln x\\), and \\(\\mathrm{Li}(x)\\): Relative Errors',
                        description: 'Top panel: all three functions. Bottom panel: relative error \\((f(x) - \\pi(x))/\\pi(x)\\) for each approximation. Li(x) is far more accurate.',
                        setup: function(body, controls) {
                            var viz = new VizEngine(body, { width: 620, height: 440, originX: 60, originY: 220, scale: 1 });
                            var xMax = 1000;

                            VizEngine.createSlider(controls, 'x max', 200, 5000, xMax, 100, function(v) {
                                xMax = Math.round(v);
                                draw();
                            });

                            function draw() {
                                viz.clear();
                                var ctx = viz.ctx;
                                var W = viz.width, H = viz.height;
                                var padL = 60, padR = 20, padT = 20, padMid = 20;
                                var topH = Math.floor(H * 0.55);
                                var botH = H - topH - padMid - 30;

                                var primes = PRIMES_10K.filter(function(p) { return p <= xMax; });
                                var piXMax = primes.length;

                                // Precompute pi at sample points
                                var steps = 200;
                                var xs = [], piVals = [], liVals = [], xlnxVals = [];
                                for (var i = 1; i <= steps; i++) {
                                    var xi = 2 + (xMax - 2) * i / steps;
                                    xs.push(xi);
                                    piVals.push(primeCount(xi, primes));
                                    liVals.push(Li(xi));
                                    xlnxVals.push(xi / Math.log(xi));
                                }

                                // === TOP PANEL: functions ===
                                function sxT(x) { return padL + (x / xMax) * (W - padL - padR); }
                                function syT(y) { return padT + topH - (y / (piXMax * 1.15)) * topH; }

                                // Grid
                                ctx.strokeStyle = '#1a1a40'; ctx.lineWidth = 0.5;
                                for (var g = 0; g <= 4; g++) {
                                    var yv = (g / 4) * piXMax * 1.15;
                                    ctx.beginPath(); ctx.moveTo(padL, syT(yv)); ctx.lineTo(W - padR, syT(yv)); ctx.stroke();
                                    ctx.fillStyle = '#4a4a7a'; ctx.font = '9px -apple-system,sans-serif'; ctx.textAlign = 'right';
                                    ctx.fillText(Math.round(yv), padL - 3, syT(yv) + 3);
                                }

                                // pi(x) staircase
                                ctx.strokeStyle = '#58a6ff'; ctx.lineWidth = 2;
                                ctx.beginPath();
                                var prev = 0;
                                for (var i2 = 0; i2 < primes.length; i2++) {
                                    var p = primes[i2];
                                    var pNext = i2 + 1 < primes.length ? primes[i2 + 1] : xMax;
                                    ctx.lineTo(sxT(p), syT(prev));
                                    prev++;
                                    ctx.lineTo(sxT(p), syT(prev));
                                    ctx.lineTo(sxT(Math.min(pNext, xMax)), syT(prev));
                                }
                                ctx.stroke();

                                // x/ln(x)
                                ctx.strokeStyle = '#3fb9a0'; ctx.lineWidth = 1.5;
                                ctx.beginPath();
                                for (var i3 = 0; i3 < xs.length; i3++) {
                                    var px = sxT(xs[i3]), py = syT(xlnxVals[i3]);
                                    i3 === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
                                }
                                ctx.stroke();

                                // Li(x)
                                ctx.strokeStyle = '#f0883e'; ctx.lineWidth = 1.5;
                                ctx.beginPath();
                                for (var i4 = 0; i4 < xs.length; i4++) {
                                    var px4 = sxT(xs[i4]), py4 = syT(liVals[i4]);
                                    i4 === 0 ? ctx.moveTo(px4, py4) : ctx.lineTo(px4, py4);
                                }
                                ctx.stroke();

                                // Top panel legend
                                var legY = padT + 8;
                                [['#58a6ff', '\u03c0(x)'], ['#3fb9a0', 'x/ln(x)'], ['#f0883e', 'Li(x)']].forEach(function(item, idx) {
                                    ctx.fillStyle = item[0];
                                    ctx.fillRect(W - padR - 150 + idx * 52, legY, 14, 3);
                                    ctx.fillStyle = '#c9d1d9';
                                    ctx.font = '10px -apple-system,sans-serif';
                                    ctx.textAlign = 'left';
                                    ctx.fillText(item[1], W - padR - 134 + idx * 52, legY + 6);
                                });

                                // === BOTTOM PANEL: relative errors ===
                                var botTop = padT + topH + padMid;
                                var maxErr = 0;
                                var errLi = [], errXlnx = [];
                                for (var i5 = 0; i5 < xs.length; i5++) {
                                    var pi5 = piVals[i5];
                                    if (pi5 > 0) {
                                        var e1 = (liVals[i5] - pi5) / pi5;
                                        var e2 = (xlnxVals[i5] - pi5) / pi5;
                                        errLi.push(e1);
                                        errXlnx.push(e2);
                                        maxErr = Math.max(maxErr, Math.abs(e1), Math.abs(e2));
                                    } else {
                                        errLi.push(0); errXlnx.push(0);
                                    }
                                }
                                if (maxErr < 0.01) maxErr = 0.3;

                                function sxB(x) { return padL + (x / xMax) * (W - padL - padR); }
                                function syB(e) { return botTop + botH / 2 - (e / maxErr) * (botH / 2); }

                                // Zero line
                                ctx.strokeStyle = '#4a4a7a'; ctx.lineWidth = 1;
                                ctx.beginPath();
                                ctx.moveTo(padL, syB(0)); ctx.lineTo(W - padR, syB(0));
                                ctx.stroke();

                                // Error grid
                                ctx.strokeStyle = '#1a1a40'; ctx.lineWidth = 0.5;
                                [-maxErr, -maxErr / 2, maxErr / 2, maxErr].forEach(function(ev) {
                                    ctx.beginPath(); ctx.moveTo(padL, syB(ev)); ctx.lineTo(W - padR, syB(ev)); ctx.stroke();
                                    ctx.fillStyle = '#4a4a7a'; ctx.font = '9px -apple-system,sans-serif'; ctx.textAlign = 'right';
                                    ctx.fillText((ev * 100).toFixed(1) + '%', padL - 3, syB(ev) + 3);
                                });

                                // Error curves
                                ctx.strokeStyle = '#f0883e'; ctx.lineWidth = 1.5;
                                ctx.beginPath();
                                for (var i6 = 0; i6 < xs.length; i6++) {
                                    var px6 = sxB(xs[i6]), py6 = syB(errLi[i6]);
                                    i6 === 0 ? ctx.moveTo(px6, py6) : ctx.lineTo(px6, py6);
                                }
                                ctx.stroke();

                                ctx.strokeStyle = '#3fb9a0'; ctx.lineWidth = 1.5;
                                ctx.beginPath();
                                for (var i7 = 0; i7 < xs.length; i7++) {
                                    var px7 = sxB(xs[i7]), py7 = syB(errXlnx[i7]);
                                    i7 === 0 ? ctx.moveTo(px7, py7) : ctx.lineTo(px7, py7);
                                }
                                ctx.stroke();

                                // x-axis label
                                ctx.fillStyle = '#8b949e'; ctx.font = '11px -apple-system,sans-serif'; ctx.textAlign = 'center';
                                ctx.fillText('x', W / 2, H - 8);
                                ctx.fillText('Relative error (bottom panel)', W / 2, botTop + botH + 18);

                                // Panel divider label
                                ctx.fillStyle = '#4a4a7a'; ctx.font = '10px -apple-system,sans-serif'; ctx.textAlign = 'left';
                                ctx.fillText('Relative error:', padL, botTop + 12);
                            }

                            draw();
                            return viz;
                        }
                    }
                ],
                exercises: [
                    {
                        question: 'Show that \\(x/\\ln x \\sim \\mathrm{Li}(x)\\) as \\(x \\to \\infty\\) (i.e., their ratio tends to 1), even though \\(\\mathrm{Li}(x) - x/\\ln x \\to +\\infty\\). Why does the table above show \\(\\mathrm{Li}(x)\\) is much more accurate than \\(x/\\ln x\\)?',
                        hint: 'Integrate \\(\\mathrm{Li}(x) = \\int_2^x dt/\\ln t\\) by parts. The leading term is \\(x/\\ln x\\); the next term is \\(x/(\\ln x)^2\\).',
                        solution: 'Integration by parts: \\(\\mathrm{Li}(x) = x/\\ln x + \\int_2^x dt/(\\ln t)^2 = x/\\ln x + x/(\\ln x)^2 + O(x/(\\ln x)^3)\\). Both are asymptotically \\(x/\\ln x\\), but Li(x) includes the correction \\(+x/(\\ln x)^2\\), which is positive and large (for \\(x = 10^6\\), it is \\(\\approx 5220\\)), explaining why Li(x) is much closer to \\(\\pi(x)\\).'
                    }
                ]
            },

            // ============================================================
            // SECTION 5: Riemann's Revolution
            // ============================================================
            {
                id: 'sec-riemann-revolution',
                title: "Riemann's Revolution",
                content: `
<h2>Riemann's Revolution</h2>

<div class="env-block intuition">
    <div class="env-title">The 1859 Paper</div>
    <div class="env-body">
        <p>In 1859, Bernhard Riemann submitted a 9-page paper to the Berlin Academy: <em>"On the Number of Primes Less Than a Given Magnitude."</em> It is the most consequential single paper in the history of analytic number theory. In it, Riemann extended Euler's zeta function to the entire complex plane, revealed its deep symmetry (the functional equation), and announced (but did not prove) the Prime Number Theorem — along with a conjecture about the zeros of \\(\\zeta(s)\\) that remains unproved 165 years later.</p>
    </div>
</div>

<h3>The Riemann Zeta Function</h3>

<p>Euler's sum \\(\\zeta(s) = \\sum_{n=1}^\\infty n^{-s}\\) converges for real \\(s > 1\\). Riemann allowed \\(s = \\sigma + it\\) to be complex, with \\(\\sigma = \\mathrm{Re}(s) > 1\\). The series still converges absolutely, and \\(\\zeta(s)\\) is a holomorphic function in this half-plane.</p>

<div class="env-block theorem">
    <div class="env-title">Theorem (Riemann, 1859)</div>
    <div class="env-body">
        <p>\\(\\zeta(s)\\) extends to a meromorphic function on all of \\(\\mathbb{C}\\), holomorphic except for a simple pole at \\(s = 1\\) with residue 1. It satisfies the <em>functional equation</em>:</p>
        \\[
        \\xi(s) := \\frac{1}{2} s(s-1) \\pi^{-s/2} \\Gamma\\!\\left(\\frac{s}{2}\\right) \\zeta(s) = \\xi(1-s),
        \\]
        <p>i.e., the completed zeta function \\(\\xi(s)\\) is entire and symmetric about \\(s = 1/2\\).</p>
    </div>
</div>

<p>The zeros of \\(\\zeta(s)\\) come in two types:</p>
<ul>
    <li><strong>Trivial zeros</strong>: at \\(s = -2, -4, -6, \\ldots\\) (from the \\(\\Gamma\\) function poles)</li>
    <li><strong>Nontrivial zeros</strong>: in the <em>critical strip</em> \\(0 < \\mathrm{Re}(s) < 1\\). The functional equation implies they are symmetric about \\(\\mathrm{Re}(s) = 1/2\\).</li>
</ul>

<p>The first few nontrivial zeros are at approximately:</p>
\\[
\\rho_1 \\approx \\frac{1}{2} + 14.135i, \\quad \\rho_2 \\approx \\frac{1}{2} + 21.022i, \\quad \\rho_3 \\approx \\frac{1}{2} + 25.011i, \\ldots
\\]

<h3>The Riemann Hypothesis</h3>

<div class="env-block theorem">
    <div class="env-title">Riemann Hypothesis (1859, unproved)</div>
    <div class="env-body">
        <p>All nontrivial zeros of \\(\\zeta(s)\\) lie on the <em>critical line</em> \\(\\mathrm{Re}(s) = 1/2\\).</p>
        <p>Equivalently: every zero \\(\\rho\\) satisfies \\(\\rho = 1/2 + it\\) for some real \\(t\\).</p>
    </div>
</div>

<p>Why do zeros control primes? Riemann's <em>explicit formula</em> makes this precise:</p>
\\[
\\psi(x) = x - \\sum_\\rho \\frac{x^\\rho}{\\rho} - \\log(2\\pi) - \\frac{1}{2}\\log(1 - x^{-2}),
\\]
<p>where \\(\\psi(x) = \\sum_{p^k \\leq x} \\log p\\) (the Chebyshev function), and the sum is over nontrivial zeros \\(\\rho\\). Each zero contributes an oscillation of amplitude \\(x^{\\mathrm{Re}(\\rho)}\\). If RH holds, all oscillations have amplitude \\(\\sqrt{x}\\), giving \\(\\psi(x) = x + O(\\sqrt{x} \\log^2 x)\\) and hence \\(\\pi(x) = \\mathrm{Li}(x) + O(\\sqrt{x} \\log x)\\).</p>

<div class="viz-placeholder" data-viz="viz-prime-race"></div>

<div class="env-block remark">
    <div class="env-title">What Has Been Proved</div>
    <div class="env-body">
        <p>The functional equation, analytic continuation, and the prime number theorem are all proved. The Riemann Hypothesis remains open. As of 2024, the first \\(10^{13}\\) nontrivial zeros have been verified to lie on the critical line (Platt–Trudgian 2021). The Clay Mathematics Institute lists RH as one of the Millennium Prize Problems, with a $1,000,000 prize.</p>
    </div>
</div>
`,
                visualizations: [
                    {
                        id: 'viz-prime-race',
                        title: 'The Prime Race: \\(\\pi(x; 4, 1)\\) vs. \\(\\pi(x; 4, 3)\\)',
                        description: 'Count primes \\(\\equiv 1 \\pmod 4\\) (teal) and \\(\\equiv 3 \\pmod 4\\) (orange). By Dirichlet\'s theorem both grow like \\(\\frac{1}{2}\\mathrm{Li}(x)\\), but 3 mod 4 leads almost always — a "Chebyshev bias."',
                        setup: function(body, controls) {
                            var viz = new VizEngine(body, { width: 620, height: 360, originX: 60, originY: 320, scale: 1 });
                            var xMax = 500;
                            var animating = false;
                            var animX = 10;
                            var animId = null;

                            VizEngine.createSlider(controls, 'x max', 100, 5000, xMax, 100, function(v) {
                                xMax = Math.round(v);
                                if (!animating) draw(xMax);
                            });

                            var playBtn = VizEngine.createButton(controls, 'Play', function() {
                                if (animating) {
                                    animating = false;
                                    playBtn.textContent = 'Play';
                                    if (animId) cancelAnimationFrame(animId);
                                } else {
                                    animating = true;
                                    animX = 10;
                                    playBtn.textContent = 'Pause';
                                    step();
                                }
                            });

                            function step() {
                                if (!animating) return;
                                animX += Math.max(1, xMax / 300);
                                if (animX >= xMax) { animX = xMax; animating = false; playBtn.textContent = 'Play'; }
                                draw(Math.floor(animX));
                                if (animating) animId = requestAnimationFrame(step);
                            }

                            function draw(curX) {
                                viz.clear();
                                var ctx = viz.ctx;
                                var W = viz.width, H = viz.height;
                                var padL = 55, padR = 20, padT = 30, padB = 40;
                                var plotW = W - padL - padR;
                                var plotH = H - padT - padB;

                                var primes = PRIMES_10K.filter(function(p) { return p <= curX && p > 2; });
                                var cnt1 = [], cnt3 = [];
                                var c1 = 0, c3 = 0;
                                var xs = [];

                                for (var i = 0; i < primes.length; i++) {
                                    var p = primes[i];
                                    if (p % 4 === 1) c1++;
                                    if (p % 4 === 3) c3++;
                                    cnt1.push(c1);
                                    cnt3.push(c3);
                                    xs.push(p);
                                }

                                var maxCount = Math.max(c1, c3, 1);

                                function sxP(x) { return padL + (x / curX) * plotW; }
                                function syP(y) { return padT + plotH - (y / (maxCount * 1.1)) * plotH; }

                                // Grid
                                ctx.strokeStyle = '#1a1a40'; ctx.lineWidth = 0.5;
                                for (var g = 0; g <= 4; g++) {
                                    var yv = (g / 4) * maxCount * 1.1;
                                    ctx.beginPath(); ctx.moveTo(padL, syP(yv)); ctx.lineTo(W - padR, syP(yv)); ctx.stroke();
                                    ctx.fillStyle = '#4a4a7a'; ctx.font = '9px -apple-system,sans-serif'; ctx.textAlign = 'right';
                                    ctx.fillText(Math.round(yv), padL - 3, syP(yv) + 3);
                                }

                                // 1/2 Li(x) reference
                                ctx.strokeStyle = '#4a4a7a'; ctx.lineWidth = 1; ctx.setLineDash([4, 4]);
                                ctx.beginPath();
                                var refStarted = false;
                                for (var xi = 5; xi <= curX; xi += Math.max(1, curX / 200)) {
                                    var y = Li(xi) / 2;
                                    var px = sxP(xi), py = syP(y);
                                    if (!refStarted) { ctx.moveTo(px, py); refStarted = true; }
                                    else ctx.lineTo(px, py);
                                }
                                ctx.stroke();
                                ctx.setLineDash([]);

                                // pi(x;4,1)
                                ctx.strokeStyle = '#3fb9a0'; ctx.lineWidth = 2;
                                ctx.beginPath();
                                for (var i2 = 0; i2 < xs.length; i2++) {
                                    var px2 = sxP(xs[i2]), py2 = syP(cnt1[i2]);
                                    i2 === 0 ? ctx.moveTo(px2, py2) : ctx.lineTo(px2, py2);
                                }
                                ctx.stroke();

                                // pi(x;4,3)
                                ctx.strokeStyle = '#f0883e'; ctx.lineWidth = 2;
                                ctx.beginPath();
                                for (var i3 = 0; i3 < xs.length; i3++) {
                                    var px3 = sxP(xs[i3]), py3 = syP(cnt3[i3]);
                                    i3 === 0 ? ctx.moveTo(px3, py3) : ctx.lineTo(px3, py3);
                                }
                                ctx.stroke();

                                // Shaded region where 3 leads
                                ctx.fillStyle = '#f0883e11';
                                ctx.beginPath();
                                for (var i4 = 0; i4 < xs.length; i4++) {
                                    if (cnt3[i4] > cnt1[i4]) {
                                        var px4a = sxP(xs[i4]);
                                        ctx.fillRect(px4a, syP(cnt3[i4]), Math.max(1, sxP(i4 + 1 < xs.length ? xs[i4 + 1] : curX) - px4a), syP(cnt1[i4]) - syP(cnt3[i4]));
                                    }
                                }

                                // Labels
                                ctx.fillStyle = '#8b949e'; ctx.font = '11px -apple-system,sans-serif'; ctx.textAlign = 'center';
                                ctx.fillText('x', W / 2, H - 5);

                                var legY = padT + 10;
                                [['#3fb9a0', '\u03c0(x; 4, 1)  \u2261 1 (mod 4)'],
                                 ['#f0883e', '\u03c0(x; 4, 3)  \u2261 3 (mod 4)'],
                                 ['#4a4a7a', '\u00bdLi(x)']].forEach(function(item, idx) {
                                    ctx.strokeStyle = item[0]; ctx.lineWidth = 2;
                                    ctx.beginPath(); ctx.moveTo(W - padR - 200, legY + idx * 18); ctx.lineTo(W - padR - 186, legY + idx * 18); ctx.stroke();
                                    ctx.fillStyle = '#c9d1d9'; ctx.font = '10px -apple-system,sans-serif'; ctx.textAlign = 'left';
                                    ctx.fillText(item[1], W - padR - 182, legY + idx * 18 + 4);
                                });

                                // Current counts
                                ctx.fillStyle = '#8b949e'; ctx.font = '11px -apple-system,sans-serif'; ctx.textAlign = 'center';
                                ctx.fillText('At x = ' + curX + ':  \u22611: ' + c1 + '  \u22613: ' + c3 + '  lead: ' + (c3 > c1 ? '3 mod 4' : c1 > c3 ? '1 mod 4' : 'tie'), W / 2, padT - 12);
                            }

                            draw(xMax);
                            return viz;
                        }
                    }
                ],
                exercises: [
                    {
                        question: 'The functional equation \\(\\xi(s) = \\xi(1-s)\\) implies that if \\(\\rho\\) is a nontrivial zero of \\(\\zeta\\), so are \\(1-\\rho\\), \\(\\bar{\\rho}\\), and \\(1-\\bar{\\rho}\\). Draw these four zeros in the complex plane for \\(\\rho = 1/3 + 5i\\) (a hypothetical off-line zero). Why does the Riemann Hypothesis collapse this quadruple to a pair?',
                        hint: 'If \\(\\mathrm{Re}(\\rho) = 1/2\\), then \\(1 - \\rho = 1/2 - it = \\bar{\\rho}\\).',
                        solution: 'For \\(\\rho = 1/3 + 5i\\): the four zeros are \\(1/3 + 5i\\), \\(2/3 - 5i\\), \\(1/3 - 5i\\), \\(2/3 + 5i\\) — a rectangle in the critical strip. If \\(\\mathrm{Re}(\\rho) = 1/2\\), then \\(1-\\rho = 1/2 - it\\) and \\(\\bar{\\rho} = 1/2 - it\\), so \\(1-\\rho = \\bar{\\rho}\\): the four collapse to two (conjugate pairs on the critical line). Under RH, there are no "off-critical-line" rectangles.'
                    }
                ]
            },

            // ============================================================
            // SECTION 6: What Lies Ahead
            // ============================================================
            {
                id: 'sec-roadmap',
                title: 'What Lies Ahead',
                content: `
<h2>What Lies Ahead</h2>

<div class="env-block intuition">
    <div class="env-title">The Course in One Paragraph</div>
    <div class="env-body">
        <p>We have just glimpsed the landscape. Primes are infinite (Euclid), their reciprocals diverge (Euler), they thin out like \\(1/\\ln x\\) (Gauss–Legendre), and their exact distribution is governed by the zeros of an analytic function in the complex plane (Riemann). Each of these insights required new tools. Building those tools systematically — and rigorously — is what this course does.</p>
    </div>
</div>

<h3>The Roadmap</h3>

<p>The course is organized in four parts:</p>

<div class="env-block definition">
    <div class="env-title">Part A: Foundations (Chapters 1–2)</div>
    <div class="env-body">
        <p><strong>Chapter 1 — Arithmetic Functions.</strong> We study functions \\(f: \\mathbb{Z}_{>0} \\to \\mathbb{C}\\) systematically: multiplicativity, the Dirichlet convolution \\((f * g)(n) = \\sum_{d \\mid n} f(d)g(n/d)\\), Möbius inversion, and key examples (\\(\\mu\\), \\(\\phi\\), \\(\\sigma_k\\), \\(\\Lambda\\)).</p>
        <p><strong>Chapter 2 — Averages of Arithmetic Functions.</strong> Partial summation, the hyperbola method, and precise estimates for \\(\\sum_{n \\leq x} d(n)\\), \\(\\sum_{n \\leq x} \\phi(n)\\), and \\(\\sum_{n \\leq x} \\mu(n)\\). These averages are the empirical footprint of arithmetic functions.</p>
    </div>
</div>

<div class="env-block definition">
    <div class="env-title">Part B: Dirichlet Series and the Zeta Function (Chapters 3–5)</div>
    <div class="env-body">
        <p><strong>Chapter 3 — Dirichlet Series.</strong> The formal and analytic theory of \\(F(s) = \\sum a_n n^{-s}\\): abscissa of convergence, Euler products for multiplicative functions, the Dirichlet series zoo.</p>
        <p><strong>Chapter 4 — The Riemann Zeta Function.</strong> Analytic continuation, the functional equation via \\(\\theta\\)-functions, the critical strip, the zero-free region, and the connection to \\(\\psi(x)\\).</p>
        <p><strong>Chapter 5 — Analytic Continuation and the Functional Equation.</strong> The completed zeta function \\(\\xi(s)\\), the Hadamard product over zeros, and the explicit formula \\(\\psi(x) = x - \\sum_\\rho x^\\rho/\\rho - \\cdots\\)</p>
    </div>
</div>

<div class="env-block definition">
    <div class="env-title">Part C: The Prime Number Theorem (Chapters 6–9)</div>
    <div class="env-body">
        <p><strong>Chapters 6–9</strong> prove the PNT: the zero-free region \\(\\zeta(1+it) \\neq 0\\), Perron's formula, the contour integral approach, and error estimates. Chapter 9 covers the explicit formula in detail.</p>
    </div>
</div>

<div class="env-block definition">
    <div class="env-title">Part D: Dirichlet Characters, Sieves, and Beyond (Chapters 10–21)</div>
    <div class="env-body">
        <p>Dirichlet characters and \\(L\\)-functions, Dirichlet's theorem on primes in arithmetic progressions, the large sieve, the Bombieri–Vinogradov theorem, exponential sums, the circle method, automorphic forms, and the breakthrough results of Zhang, Maynard, and Tao on bounded gaps between primes.</p>
    </div>
</div>

<h3>Prerequisites and Philosophy</h3>

<p>This course assumes real analysis (at the level of Rudin's <em>Principles</em>) and complex analysis (Cauchy's theorem, residues, contour integration). Abstract algebra through group theory is used from Chapter 10 onward. The philosophy is: <em>every result should be motivated before it is stated, and every proof should be understood, not just verified</em>.</p>

<h3>Notation and Conventions</h3>

<ul>
    <li>\\(p\\) always denotes a prime; \\(\\sum_p\\) and \\(\\prod_p\\) run over primes.</li>
    <li>\\(f(x) = O(g(x))\\): \\(|f(x)| \\leq Cg(x)\\) for large \\(x\\) and some constant \\(C > 0\\).</li>
    <li>\\(f(x) = o(g(x))\\): \\(f(x)/g(x) \\to 0\\).</li>
    <li>\\(f(x) \\sim g(x)\\): \\(f(x)/g(x) \\to 1\\).</li>
    <li>\\(f(x) \\asymp g(x)\\): \\(f = O(g)\\) and \\(g = O(f)\\) (same order of magnitude).</li>
    <li>\\(\\log\\) means natural logarithm throughout.</li>
</ul>

<div class="env-block remark">
    <div class="env-title">A Note on Rigor</div>
    <div class="env-body">
        <p>Analytic number theory has a justified reputation for subtle error terms and deceptively clean-looking formulas that conceal intricate analysis. We will be careful about interchange of sums and integrals, uniform convergence, and the placement of error terms. When a step requires justification beyond what is immediate, we will supply it.</p>
    </div>
</div>

<div class="env-block intuition">
    <div class="env-title">Bridge to Chapter 1</div>
    <div class="env-body">
        <p>The prime-counting function \\(\\pi(x)\\) involves all primes at once — it is a global object. To study it rigorously, we need tools that decompose multiplicative structure. The central tool is the <em>arithmetic function</em>: a function on the positive integers encoding some property of \\(n\\). The key examples — the Möbius function \\(\\mu\\), the von Mangoldt function \\(\\Lambda\\), the Euler totient \\(\\phi\\) — all live in a rich algebraic structure called the <em>Dirichlet ring</em>, governed by the convolution product. To count primes, we need to understand arithmetic functions and their averages.</p>
    </div>
</div>
`,
                visualizations: [],
                exercises: [
                    {
                        question: 'Look up (or derive) the exact value \\(\\zeta(2) = \\pi^2/6\\). Using the Euler product, express \\(\\prod_p (1 - p^{-2})\\) in closed form.',
                        hint: '\\(\\zeta(2) = \\prod_p (1 - p^{-2})^{-1}\\), so \\(\\prod_p (1 - p^{-2}) = 1/\\zeta(2)\\).',
                        solution: '\\(\\prod_p (1 - p^{-2}) = 1/\\zeta(2) = 6/\\pi^2 \\approx 0.6079\\). This has the probabilistic interpretation: a "random" integer is squarefree with probability \\(6/\\pi^2\\).'
                    },
                    {
                        question: 'The \\(n\\)-th prime \\(p_n\\) satisfies \\(p_n \\sim n \\ln n\\) (from PNT). Estimate \\(p_{1000}\\) and \\(p_{10^6}\\). Check against known values \\(p_{1000} = 7919\\) and \\(p_{10^6} = 15{,}485{,}863\\).',
                        hint: '\\(p_n \\approx n \\ln n\\). For \\(n = 1000\\): \\(1000 \\ln 1000 \\approx 1000 \\times 6.908 = 6908\\). Compare to 7919.',
                        solution: '\\(p_{1000} \\approx 1000 \\ln 1000 = 6908\\) vs. actual 7919: error \\(\\approx 14\\%\\). A better estimate uses \\(p_n \\approx n(\\ln n + \\ln \\ln n - 1)\\), giving \\(1000(6.908 + 1.933 - 1) = 7841\\), error \\(< 1\\%\\). For \\(p_{10^6}\\): \\(10^6 \\times (\\ln 10^6 + \\ln \\ln 10^6 - 1) \\approx 10^6 \\times (13.816 + 2.626 - 1) \\approx 15{,}442{,}000\\), vs. actual \\(15{,}485{,}863\\): error \\(< 0.3\\%\\).'
                    }
                ]
            }

        ] // end sections
    }); // end CHAPTERS.push

})(); // end IIFE
