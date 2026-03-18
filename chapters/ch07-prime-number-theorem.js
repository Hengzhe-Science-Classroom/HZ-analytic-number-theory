window.CHAPTERS = window.CHAPTERS || [];
window.CHAPTERS.push({
    id: 'ch07',
    number: 7,
    title: 'The Prime Number Theorem',
    subtitle: 'The climax: \u03c0(x) \u223c x/ln(x), proved by complex analysis',
    sections: [

        // ================================================================
        // SECTION 1: The Climax
        // ================================================================
        {
            id: 'sec-motivation',
            title: 'The Climax',
            content: `
<h2>The Climax: The Prime Number Theorem</h2>

<div class="env-block intuition">
    <div class="env-title">The Central Question</div>
    <div class="env-body">
        <p>Among the first million integers, roughly how many are prime? Among the first trillion? Is there a clean formula that captures the density of primes in the long run?</p>
        <p>Gauss pondered this at age 15, around 1792, staring at tables of primes. He noticed that the primes thin out, but in a remarkably regular way. His conjecture, refined over a century, became the crown jewel of 19th-century mathematics.</p>
    </div>
</div>

<p>Let \\(\\pi(x)\\) denote the number of primes up to \\(x\\). The <strong>Prime Number Theorem</strong> (PNT) states that primes are distributed asymptotically like \\(x / \\ln x\\):</p>

<div class="env-block theorem">
    <div class="env-title">Theorem 7.1 (Prime Number Theorem)</div>
    <div class="env-body">
        \\[\\pi(x) \\sim \\frac{x}{\\ln x} \\quad \\text{as } x \\to \\infty,\\]
        <p>meaning \\(\\displaystyle\\lim_{x \\to \\infty} \\frac{\\pi(x)}{x / \\ln x} = 1.\\)</p>
    </div>
</div>

<p>Equivalently, the \\(n\\)-th prime \\(p_n \\sim n \\ln n\\), and the probability that a randomly chosen integer near \\(x\\) is prime is approximately \\(1/\\ln x\\).</p>

<h3>Historical Significance</h3>

<p>The PNT was conjectured independently by Gauss and Legendre around 1800, but proved only in <strong>1896</strong> by Hadamard and de la Vall&eacute;e Poussin, working independently. Their proofs both used the Riemann zeta function and its zero-free region near the line \\(\\text{Re}(s) = 1\\). The key insight, first articulated by Riemann in his 1859 memoir, was that the distribution of primes is encoded in the zeros of \\(\\zeta(s)\\).</p>

<p>This was one of the first great triumphs of complex analysis in pure number theory: a problem about integers, solved by the theory of functions of a complex variable.</p>

<h3>Two Equivalent Forms</h3>

<p>The PNT has several equivalent formulations, each highlighting a different aspect:</p>

<ol>
    <li>\\(\\pi(x) \\sim x / \\ln x\\) (counting primes directly)</li>
    <li>\\(\\psi(x) \\sim x\\) (von Mangoldt's function, the cleanest analytically)</li>
    <li>\\(\\theta(x) \\sim x\\) (Chebyshev's theta function)</li>
    <li>\\(\\pi(x) \\sim \\operatorname{Li}(x) = \\int_2^x \\frac{dt}{\\ln t}\\) (best approximation)</li>
</ol>

<p>We will prove the equivalences and establish that \\(\\psi(x) \\sim x\\) is the analytically cleanest target.</p>

<div class="env-block remark">
    <div class="env-title">Why \\(\\psi(x)\\)?</div>
    <div class="env-body">
        <p>The von Mangoldt function \\(\\Lambda(n)\\) equals \\(\\ln p\\) if \\(n = p^k\\) (prime power) and \\(0\\) otherwise. Its summatory function \\(\\psi(x) = \\sum_{n \\le x} \\Lambda(n)\\) is related to \\(-\\zeta'(s)/\\zeta(s)\\) by a Mellin-type formula, making it the natural target for contour integration.</p>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-pnt-history"></div>
`,
            visualizations: [
                {
                    id: 'viz-pnt-history',
                    title: 'Timeline: Road to the Prime Number Theorem',
                    description: 'Key milestones in the development of the PNT, from Gauss\'s empirical observations to the 1896 proofs and beyond.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 700, height: 340,
                            originX: 0, originY: 0, scale: 1
                        });

                        var events = [
                            { year: 1792, label: 'Gauss conjectures\n\u03c0(x) ~ x/ln x', color: viz.colors.blue },
                            { year: 1798, label: 'Legendre\nindependent conjecture', color: viz.colors.teal },
                            { year: 1848, label: 'Chebyshev: bounds\nc\u2081x/ln x < \u03c0(x) < c\u2082x/ln x', color: viz.colors.orange },
                            { year: 1859, label: 'Riemann: zeta zeros\ncontrol primes', color: viz.colors.purple },
                            { year: 1896, label: 'Hadamard &\nde la Vall\xe9e Poussin\nPROVED PNT', color: viz.colors.green },
                            { year: 1949, label: 'Erd\u0151s & Selberg:\nelementary proof', color: viz.colors.yellow },
                        ];

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var W = viz.width, H = viz.height;

                            viz.screenText('Timeline: Road to the Prime Number Theorem', W / 2, 22, viz.colors.white, 15);

                            // Timeline bar
                            var y0 = H / 2 + 10;
                            var x0 = 50, x1 = W - 30;
                            var yearMin = 1785, yearMax = 1960;
                            function xOf(yr) {
                                return x0 + (yr - yearMin) / (yearMax - yearMin) * (x1 - x0);
                            }

                            ctx.strokeStyle = viz.colors.axis; ctx.lineWidth = 2;
                            ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y0); ctx.stroke();

                            // Decade ticks
                            ctx.fillStyle = viz.colors.text; ctx.font = '10px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            for (var yr = 1800; yr <= 1960; yr += 20) {
                                var xv = xOf(yr);
                                ctx.strokeStyle = viz.colors.grid; ctx.lineWidth = 0.5;
                                ctx.beginPath(); ctx.moveTo(xv, y0 - 5); ctx.lineTo(xv, y0 + 5); ctx.stroke();
                                ctx.fillStyle = viz.colors.text;
                                ctx.fillText(yr.toString(), xv, y0 + 18);
                            }

                            // Events
                            events.forEach(function(ev, i) {
                                var xv = xOf(ev.year);
                                var above = (i % 2 === 0);
                                var labelY = above ? y0 - 80 : y0 + 55;
                                var lineY1 = above ? y0 - 10 : y0 + 10;
                                var lineY2 = above ? labelY + 28 : labelY - 5;

                                ctx.strokeStyle = ev.color; ctx.lineWidth = 1.5;
                                ctx.setLineDash([3, 3]);
                                ctx.beginPath(); ctx.moveTo(xv, lineY1); ctx.lineTo(xv, lineY2); ctx.stroke();
                                ctx.setLineDash([]);

                                ctx.fillStyle = ev.color;
                                ctx.beginPath(); ctx.arc(xv, y0, 5, 0, Math.PI * 2); ctx.fill();

                                var lines = ev.label.split('\n');
                                ctx.font = '10px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                lines.forEach(function(line, li) {
                                    ctx.fillStyle = ev.color;
                                    ctx.fillText(line, xv, labelY + li * 14);
                                });

                                ctx.font = 'bold 11px -apple-system,sans-serif';
                                ctx.fillStyle = viz.colors.white;
                                ctx.fillText(ev.year.toString(), xv, above ? labelY - 14 : labelY + lines.length * 14 + 4);
                            });
                        }

                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Using \\(\\pi(x) \\sim x/\\ln x\\), estimate \\(\\pi(10^6)\\), \\(\\pi(10^9)\\), and \\(\\pi(10^{12})\\). The true values are 78,498; 50,847,534; and 37,607,912,018. Compute the relative error in each case.',
                    hint: 'Plug in the values: \\(x/\\ln x\\) at \\(x = 10^k\\) gives \\(10^k / (k \\ln 10)\\).',
                    solution: 'At \\(10^6\\): \\(10^6/(6\\ln 10) \\approx 72{,}382\\), relative error \\(\\approx 7.8\\%\\). At \\(10^9\\): \\(\\approx 48{,}255{,}000\\), error \\(\\approx 5.1\\%\\). At \\(10^{12}\\): \\(\\approx 36{,}191{,}000{,}000\\), error \\(\\approx 3.8\\%\\). The approximation improves slowly (logarithmically) as \\(x \\to \\infty\\), which is why \\(\\operatorname{Li}(x)\\) is preferred in practice.'
                },
                {
                    question: 'Show that \\(\\pi(x) \\sim x/\\ln x\\) implies the \\(n\\)-th prime satisfies \\(p_n \\sim n \\ln n\\).',
                    hint: 'If \\(\\pi(p_n) = n\\) and \\(\\pi(x) \\sim x/\\ln x\\), substitute \\(x = p_n\\) and solve for \\(p_n\\) asymptotically.',
                    solution: 'From \\(n = \\pi(p_n) \\sim p_n / \\ln p_n\\) we get \\(p_n \\sim n \\ln p_n\\). Since \\(p_n \\to \\infty\\), \\(\\ln p_n \\sim \\ln n\\), so \\(p_n \\sim n \\ln n\\). More carefully: \\(\\ln p_n = \\ln n + \\ln \\ln p_n \\sim \\ln n\\) since \\(\\ln \\ln p_n = o(\\ln n)\\).'
                }
            ]
        },

        // ================================================================
        // SECTION 2: Chebyshev Functions
        // ================================================================
        {
            id: 'sec-chebyshev',
            title: 'Chebyshev Functions',
            content: `
<h2>Chebyshev Functions: \\(\\psi(x)\\) and \\(\\theta(x)\\)</h2>

<div class="env-block intuition">
    <div class="env-title">Smooth Substitutes for \\(\\pi(x)\\)</div>
    <div class="env-body">
        <p>The function \\(\\pi(x)\\) is a step function that jumps by 1 at each prime. For analytic work, it is awkward because it treats all primes equally, ignoring their relative "weight." Chebyshev introduced two weighted counts that are analytically superior: each prime \\(p\\) is weighted by \\(\\ln p\\), which reflects its "size."</p>
    </div>
</div>

<h3>The Two Functions</h3>

<div class="env-block definition">
    <div class="env-title">Definition (Chebyshev Functions)</div>
    <div class="env-body">
        <p>For \\(x \\ge 1\\):</p>
        <ul>
            <li>\\(\\displaystyle\\theta(x) = \\sum_{p \\le x} \\ln p\\) (sum over primes only)</li>
            <li>\\(\\displaystyle\\psi(x) = \\sum_{p^k \\le x} \\ln p = \\sum_{n \\le x} \\Lambda(n)\\) (sum over prime powers)</li>
        </ul>
        <p>where \\(\\Lambda(n)\\) is the von Mangoldt function: \\(\\Lambda(n) = \\ln p\\) if \\(n = p^k\\), else \\(0\\).</p>
    </div>
</div>

<p>The relationship between the two is:
\\[\\psi(x) = \\theta(x) + \\theta(x^{1/2}) + \\theta(x^{1/3}) + \\cdots = \\sum_{k=1}^{\\lfloor \\log_2 x \\rfloor} \\theta(x^{1/k}).\\]
The higher-order terms \\(\\theta(x^{1/2}), \\theta(x^{1/3}), \\ldots\\) are \\(O(x^{1/2})\\), so \\(\\psi(x) - \\theta(x) = O(x^{1/2} \\ln x)\\). In particular, \\(\\psi(x) \\sim x\\) if and only if \\(\\theta(x) \\sim x\\).</p>

<h3>Equivalence of PNT Forms</h3>

<div class="env-block theorem">
    <div class="env-title">Theorem 7.2 (Equivalences)</div>
    <div class="env-body">
        <p>The following are equivalent:</p>
        <ol>
            <li>\\(\\pi(x) \\sim x / \\ln x\\)</li>
            <li>\\(\\theta(x) \\sim x\\)</li>
            <li>\\(\\psi(x) \\sim x\\)</li>
        </ol>
    </div>
</div>

<p><strong>Proof sketch (1 \\Leftrightarrow 2):</strong> By partial summation (Abel summation),
\\[\\theta(x) = \\pi(x) \\ln x - \\int_2^x \\frac{\\pi(t)}{t} \\, dt.\\]
If \\(\\pi(x) \\sim x/\\ln x\\), the right side is \\(\\sim x - \\int_2^x (1/\\ln t) \\, dt\\). The integral \\(\\int_2^x dt/\\ln t = O(x/\\ln x)\\), so \\(\\theta(x) \\sim x\\). The converse is similar. \\(\\square\\)</p>

<h3>Connection to the Zeta Function</h3>

<p>The key analytic identity is:
\\[-\\frac{\\zeta'(s)}{\\zeta(s)} = \\sum_{n=1}^\\infty \\frac{\\Lambda(n)}{n^s}, \\quad \\text{Re}(s) > 1.\\]
This makes \\(\\psi(x)\\) the natural function to recover via Perron's formula from the Dirichlet series \\(-\\zeta'(s)/\\zeta(s)\\). The residue of \\(-\\zeta'(s)/\\zeta(s)\\) at \\(s = 1\\) is \\(1\\) (since \\(\\zeta(s)\\) has a simple pole there), which is exactly why \\(\\psi(x) \\sim x\\).</p>

<div class="viz-placeholder" data-viz="viz-psi-convergence"></div>
`,
            visualizations: [
                {
                    id: 'viz-psi-convergence',
                    title: '\\(\\psi(x)/x \\to 1\\): Convergence to 1',
                    description: 'Watch \\(\\psi(x)/x\\) (the ratio of the Chebyshev function to \\(x\\)) oscillate and converge to 1. Use the slider to extend the range.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 660, height: 360,
                            originX: 60, originY: 310, scale: 1
                        });

                        var maxX = 200;
                        var animating = false;
                        var animX = 10;

                        VizEngine.createSlider(controls, 'x max', 100, 2000, maxX, 50, function(v) {
                            maxX = Math.round(v);
                            animating = false;
                            draw(maxX);
                        });

                        var btnAnim = VizEngine.createButton(controls, 'Animate', function() {
                            animating = !animating;
                            btnAnim.textContent = animating ? 'Pause' : 'Animate';
                            if (animating) { animX = 10; runAnim(); }
                        });

                        // Sieve to get primes
                        var MAXSIEVE = 2100;
                        var primes = VizEngine.sievePrimes(MAXSIEVE);

                        // Precompute psi(x) for x = 1..MAXSIEVE
                        var psiArr = new Float64Array(MAXSIEVE + 1);
                        for (var n = 2; n <= MAXSIEVE; n++) {
                            psiArr[n] = psiArr[n - 1];
                            // check if n is a prime power
                            var val = n, p = 0;
                            for (var pi = 0; pi < primes.length && primes[pi] <= val; pi++) {
                                if (val % primes[pi] === 0) {
                                    p = primes[pi];
                                    while (val % p === 0) val = val / p;
                                    if (val === 1) { psiArr[n] += Math.log(p); }
                                    break;
                                }
                            }
                        }

                        function draw(xLimit) {
                            viz.clear();
                            var ctx = viz.ctx;
                            var W = viz.width, H = viz.height;
                            var plotW = W - 70, plotH = H - 50;
                            var x0 = 60, y0 = 10;

                            // axes
                            ctx.strokeStyle = viz.colors.axis; ctx.lineWidth = 1.5;
                            ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x0, y0 + plotH); ctx.stroke();
                            ctx.beginPath(); ctx.moveTo(x0, y0 + plotH); ctx.lineTo(x0 + plotW, y0 + plotH); ctx.stroke();

                            // y=1 reference line
                            var yRef = y0 + plotH * (1 - 1.0) / 0.6; // will be at ratio=1 in [0.7, 1.3]
                            var yMin = 0.7, yMax = 1.3;
                            var yRef2 = y0 + plotH * (1 - (1.0 - yMin) / (yMax - yMin));
                            ctx.strokeStyle = viz.colors.green; ctx.lineWidth = 1; ctx.setLineDash([5, 4]);
                            ctx.beginPath(); ctx.moveTo(x0, yRef2); ctx.lineTo(x0 + plotW, yRef2); ctx.stroke();
                            ctx.setLineDash([]);

                            // y-axis labels
                            ctx.fillStyle = viz.colors.text; ctx.font = '11px -apple-system,sans-serif';
                            ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
                            [0.7, 0.8, 0.9, 1.0, 1.1, 1.2, 1.3].forEach(function(v) {
                                var sy = y0 + plotH * (1 - (v - yMin) / (yMax - yMin));
                                ctx.fillStyle = v === 1.0 ? viz.colors.green : viz.colors.text;
                                ctx.fillText(v.toFixed(1), x0 - 4, sy);
                                ctx.strokeStyle = viz.colors.grid; ctx.lineWidth = 0.5;
                                ctx.beginPath(); ctx.moveTo(x0, sy); ctx.lineTo(x0 + plotW, sy); ctx.stroke();
                            });

                            // x-axis labels
                            ctx.fillStyle = viz.colors.text; ctx.textAlign = 'center'; ctx.textBaseline = 'top';
                            var nTicks = Math.min(10, Math.floor(xLimit / 50));
                            for (var ti = 0; ti <= nTicks; ti++) {
                                var xv = Math.round(xLimit * ti / nTicks);
                                var sx = x0 + (xv / xLimit) * plotW;
                                ctx.fillText(xv, sx, y0 + plotH + 4);
                            }

                            // psi(x)/x curve
                            ctx.strokeStyle = viz.colors.blue; ctx.lineWidth = 2;
                            ctx.beginPath();
                            var started = false;
                            var step = Math.max(1, Math.floor(xLimit / 600));
                            for (var xi = 2; xi <= Math.min(xLimit, MAXSIEVE); xi += step) {
                                var ratio = psiArr[xi] / xi;
                                if (ratio < yMin || ratio > yMax) { started = false; continue; }
                                var sx2 = x0 + (xi / xLimit) * plotW;
                                var sy2 = y0 + plotH * (1 - (ratio - yMin) / (yMax - yMin));
                                if (!started) { ctx.moveTo(sx2, sy2); started = true; } else { ctx.lineTo(sx2, sy2); }
                            }
                            ctx.stroke();

                            // Current value label
                            var lastX = Math.min(xLimit, MAXSIEVE);
                            var lastRatio = psiArr[lastX] / lastX;
                            viz.screenText('\u03c8(x)/x at x=' + lastX + ': ' + lastRatio.toFixed(4), W / 2, 18, viz.colors.blue, 13);
                            viz.screenText('y = 1 (PNT: \u03c8(x)/x \u2192 1)', x0 + plotW - 10, yRef2 - 10, viz.colors.green, 11);
                            viz.screenText('x', x0 + plotW + 5, y0 + plotH, viz.colors.text, 12);
                            viz.screenText('\u03c8(x)/x', x0 - 20, y0 + 5, viz.colors.blue, 11);
                        }

                        function runAnim() {
                            if (!animating) return;
                            animX = Math.min(animX + 3, Math.min(maxX, MAXSIEVE));
                            draw(animX);
                            if (animX < Math.min(maxX, MAXSIEVE)) {
                                requestAnimationFrame(runAnim);
                            } else {
                                animating = false;
                                btnAnim.textContent = 'Animate';
                            }
                        }

                        draw(maxX);
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Compute \\(\\psi(30)\\) by hand: list all prime powers \\(p^k \\le 30\\) and sum their \\(\\ln p\\) contributions.',
                    hint: 'Prime powers up to 30: \\(2, 4, 8, 16\\) (from \\(p=2\\)); \\(3, 9, 27\\) (from \\(p=3\\)); \\(5, 25\\) (from \\(p=5\\)); \\(7\\); \\(11, 13, 17, 19, 23, 29\\).',
                    solution: '\\(\\psi(30) = 4\\ln 2 + 3\\ln 3 + 2\\ln 5 + \\ln 7 + \\ln 11 + \\ln 13 + \\ln 17 + \\ln 19 + \\ln 23 + \\ln 29\\). Numerically: \\(4(0.693) + 3(1.099) + 2(1.609) + 1.946 + 2.398 + 2.565 + 2.833 + 2.944 + 3.135 + 3.367 \\approx 2.773 + 3.296 + 3.219 + 18.188 \\approx 27.476\\). So \\(\\psi(30)/30 \\approx 0.916\\), already reasonably close to 1.'
                },
                {
                    question: 'Show that \\(\\psi(x) - \\theta(x) = O(\\sqrt{x} \\ln x)\\).',
                    hint: 'Use \\(\\psi(x) = \\theta(x) + \\theta(x^{1/2}) + \\theta(x^{1/3}) + \\cdots\\) and the trivial bound \\(\\theta(y) \\le y \\ln y\\) (actually \\(\\theta(y) = O(y)\\)).',
                    solution: 'The sum has at most \\(\\log_2 x\\) nonzero terms. The \\(k\\)-th term is \\(\\theta(x^{1/k}) = O(x^{1/k})\\). For \\(k \\ge 2\\): \\(\\sum_{k=2}^{\\log_2 x} \\theta(x^{1/k}) \\le \\sum_{k=2}^{\\log_2 x} O(x^{1/k}) \\le (\\log_2 x) \\cdot O(x^{1/2}) = O(\\sqrt{x} \\ln x)\\).'
                }
            ]
        },

        // ================================================================
        // SECTION 3: Chebyshev's Bounds
        // ================================================================
        {
            id: 'sec-chebyshev-bounds',
            title: "Chebyshev's Bounds",
            content: `
<h2>Chebyshev's Bounds: Before the Full Proof</h2>

<div class="env-block intuition">
    <div class="env-title">The State of Affairs in 1848</div>
    <div class="env-body">
        <p>Chebyshev could not prove the PNT, but he established the first rigorous bounds: the ratio \\(\\pi(x) / (x/\\ln x)\\) is trapped between two positive constants. This was a major advance over nothing.</p>
    </div>
</div>

<div class="env-block theorem">
    <div class="env-title">Theorem 7.3 (Chebyshev's Bounds, 1848)</div>
    <div class="env-body">
        <p>There exist constants \\(0 < c_1 < 1 < c_2\\) such that for all \\(x \\ge 2\\):</p>
        \\[c_1 \\frac{x}{\\ln x} < \\pi(x) < c_2 \\frac{x}{\\ln x}.\\]
        <p>One can take \\(c_1 = \\ln 2 - \\varepsilon \\approx 0.693\\) and \\(c_2 = 2\\ln 2 + \\varepsilon \\approx 1.386\\).</p>
    </div>
</div>

<h3>Proof via Binomial Coefficients</h3>

<p>Chebyshev's elegant method uses the central binomial coefficient \\(\\binom{2n}{n}\\).</p>

<p><strong>Upper bound.</strong> Every prime \\(n < p \\le 2n\\) divides \\(\\binom{2n}{n}\\). Since \\(\\binom{2n}{n} \\le 4^n\\), the product of primes in \\((n, 2n]\\) satisfies:
\\[\\prod_{n < p \\le 2n} p \\le 4^n.\\]
Taking logarithms: \\(\\theta(2n) - \\theta(n) \\le n \\ln 4\\). Iterating (summing over \\(n, n/2, n/4, \\ldots\\)) gives \\(\\theta(x) \\le x \\ln 4\\), hence \\(\\pi(x) \\le 2\\ln 2 \\cdot x/\\ln x\\).</p>

<p><strong>Lower bound.</strong> Since \\(\\binom{2n}{n} \\ge 4^n / (2n+1)\\), the product of primes in \\((n, 2n]\\) is at least \\(4^n / (2n+1)^k\\) for some small \\(k\\), yielding \\(\\pi(2n) - \\pi(n) \\ge \\ln 2 \\cdot n / \\ln(2n) \\cdot (1 - o(1))\\), and iterating gives the lower bound.</p>

<h3>Bertrand's Postulate</h3>

<p>As an immediate corollary of the lower bound argument (or by a more careful analysis), Chebyshev's method establishes:</p>

<div class="env-block theorem">
    <div class="env-title">Corollary 7.4 (Bertrand's Postulate)</div>
    <div class="env-body">
        <p>For every integer \\(n \\ge 1\\), there exists a prime \\(p\\) with \\(n < p \\le 2n\\).</p>
    </div>
</div>

<p>This is tight: Bertrand's postulate follows from \\(\\theta(2n) - \\theta(n) > 0\\), which is a consequence of the lower bound argument.</p>

<div class="viz-placeholder" data-viz="viz-chebyshev-sandwich"></div>
`,
            visualizations: [
                {
                    id: 'viz-chebyshev-sandwich',
                    title: "Chebyshev's Sandwich: \\(\\pi(x)\\) Between Two Bounds",
                    description: 'The blue curve \\(\\pi(x)\\) is sandwiched between Chebyshev\'s lower and upper bounds (orange dashes). Drag the slider to increase \\(x\\).',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 660, height: 380,
                            originX: 60, originY: 340, scale: 1
                        });

                        var maxX = 300;
                        var MAXSIEVE2 = 2200;
                        var primes2 = VizEngine.sievePrimes(MAXSIEVE2);
                        var piArr = new Int32Array(MAXSIEVE2 + 1);
                        var pc = 0, pi2 = 0;
                        for (var n2 = 0; n2 <= MAXSIEVE2; n2++) {
                            if (pi2 < primes2.length && primes2[pi2] === n2) { pc++; pi2++; }
                            piArr[n2] = pc;
                        }

                        VizEngine.createSlider(controls, 'x max', 50, 2000, maxX, 50, function(v) {
                            maxX = Math.round(v);
                            draw();
                        });

                        var c1 = Math.log(2), c2 = 2 * Math.log(2);

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var W = viz.width, H = viz.height;
                            var x0 = 60, plotH = H - 50, plotW = W - 80;
                            var xLim = Math.min(maxX, MAXSIEVE2);

                            // find max pi for scaling
                            var piMax = piArr[xLim] * 1.3;
                            function sx(x) { return x0 + (x / xLim) * plotW; }
                            function sy(y) { return H - 40 - (y / piMax) * plotH; }

                            // Grid
                            ctx.strokeStyle = viz.colors.grid; ctx.lineWidth = 0.5;
                            var nYTicks = 5;
                            for (var ti = 0; ti <= nYTicks; ti++) {
                                var yv = piMax * ti / nYTicks;
                                var syi = sy(yv);
                                ctx.beginPath(); ctx.moveTo(x0, syi); ctx.lineTo(x0 + plotW, syi); ctx.stroke();
                                ctx.fillStyle = viz.colors.text; ctx.font = '10px sans-serif';
                                ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
                                ctx.fillText(Math.round(yv), x0 - 4, syi);
                            }

                            // Upper bound: c2 * x/ln(x)
                            ctx.strokeStyle = viz.colors.orange; ctx.lineWidth = 1.5; ctx.setLineDash([6, 4]);
                            ctx.beginPath();
                            var ubStarted = false;
                            for (var xi = 3; xi <= xLim; xi += Math.max(1, Math.floor(xLim / 400))) {
                                var ub = c2 * xi / Math.log(xi);
                                var sxi = sx(xi), syi2 = sy(ub);
                                if (!ubStarted) { ctx.moveTo(sxi, syi2); ubStarted = true; } else { ctx.lineTo(sxi, syi2); }
                            }
                            ctx.stroke();

                            // Lower bound: c1 * x/ln(x)
                            ctx.strokeStyle = viz.colors.yellow; ctx.lineWidth = 1.5;
                            ctx.beginPath();
                            var lbStarted = false;
                            for (var xi2 = 3; xi2 <= xLim; xi2 += Math.max(1, Math.floor(xLim / 400))) {
                                var lb = c1 * xi2 / Math.log(xi2);
                                var sxi2 = sx(xi2), syi3 = sy(lb);
                                if (!lbStarted) { ctx.moveTo(sxi2, syi3); lbStarted = true; } else { ctx.lineTo(sxi2, syi3); }
                            }
                            ctx.stroke();
                            ctx.setLineDash([]);

                            // pi(x) step function
                            ctx.strokeStyle = viz.colors.blue; ctx.lineWidth = 2;
                            ctx.beginPath();
                            var prevSx = sx(1), prevSy = sy(0);
                            ctx.moveTo(prevSx, prevSy);
                            var step3 = Math.max(1, Math.floor(xLim / 600));
                            for (var xi3 = 2; xi3 <= xLim; xi3 += step3) {
                                var nsxi = sx(xi3), nsyi = sy(piArr[xi3]);
                                ctx.lineTo(nsxi, prevSy);
                                ctx.lineTo(nsxi, nsyi);
                                prevSy = nsyi;
                            }
                            ctx.stroke();

                            // x/ln x
                            ctx.strokeStyle = viz.colors.teal; ctx.lineWidth = 1; ctx.setLineDash([3, 3]);
                            ctx.beginPath();
                            var mStarted = false;
                            for (var xi4 = 3; xi4 <= xLim; xi4 += Math.max(1, Math.floor(xLim / 400))) {
                                var mv = xi4 / Math.log(xi4);
                                var smx = sx(xi4), smy = sy(mv);
                                if (!mStarted) { ctx.moveTo(smx, smy); mStarted = true; } else { ctx.lineTo(smx, smy); }
                            }
                            ctx.stroke(); ctx.setLineDash([]);

                            // axes
                            ctx.strokeStyle = viz.colors.axis; ctx.lineWidth = 1.5;
                            ctx.beginPath(); ctx.moveTo(x0, H - 40); ctx.lineTo(x0 + plotW, H - 40); ctx.stroke();
                            ctx.beginPath(); ctx.moveTo(x0, H - 40); ctx.lineTo(x0, H - 40 - plotH); ctx.stroke();
                            ctx.fillStyle = viz.colors.text; ctx.font = '10px sans-serif';
                            ctx.textAlign = 'center'; ctx.textBaseline = 'top';
                            var nXTick = Math.min(8, Math.floor(xLim / 50));
                            for (var ti2 = 1; ti2 <= nXTick; ti2++) {
                                var xvl = Math.round(xLim * ti2 / nXTick);
                                ctx.fillText(xvl, sx(xvl), H - 36);
                            }

                            // Legend
                            var lx = x0 + 10, ly = 14;
                            var items = [
                                [viz.colors.blue, '\u03c0(x)'],
                                [viz.colors.teal, 'x/ln x'],
                                [viz.colors.orange, '2 ln2 \u00b7 x/ln x (upper)'],
                                [viz.colors.yellow, 'ln2 \u00b7 x/ln x (lower)'],
                            ];
                            items.forEach(function(it, i) {
                                ctx.fillStyle = it[0]; ctx.font = '11px sans-serif'; ctx.textAlign = 'left';
                                ctx.fillRect(lx + i * 145, ly, 18, 10);
                                ctx.fillStyle = viz.colors.text;
                                ctx.fillText(it[1], lx + i * 145 + 22, ly + 9);
                            });
                        }

                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: "Verify Chebyshev's upper bound argument: show that every prime \\(p\\) with \\(n < p \\le 2n\\) divides \\(\\binom{2n}{n}\\).",
                    hint: '\\(\\binom{2n}{n} = (2n)! / (n!)^2\\). If \\(n < p \\le 2n\\), then \\(p\\) appears exactly once in \\((2n)!\\) in the range \\((n, 2n]\\), and not at all in \\(n!\\).',
                    solution: 'Since \\(n < p \\le 2n\\), the factor \\(p\\) appears in \\((2n)!\\) (from the term \\(p\\) in \\(1 \\cdot 2 \\cdots 2n\\)) but does not appear in either copy of \\(n!\\) (since \\(p > n\\)). Therefore \\(p \\mid \\binom{2n}{n}\\). Moreover, \\(p^2 > 4n^2 > 2n\\) for \\(p > \\sqrt{2n}\\), so \\(p^2 \\nmid (2n)!\\) in the range \\((n,2n]\\), meaning the \\(p\\)-adic valuation is exactly 1.'
                },
                {
                    question: "Use \\(\\binom{2n}{n} \\le 4^n\\) to show \\(\\theta(2n) - \\theta(n) \\le n \\ln 4\\), and by iterating deduce \\(\\theta(x) \\le 2x \\ln 2\\).",
                    hint: 'The product of primes in \\((n, 2n]\\) equals \\(\\exp(\\theta(2n) - \\theta(n))\\). This product divides \\(\\binom{2n}{n} \\le 4^n\\). To extend to all \\(x\\), write \\(x \\le 2^k\\) and telescope.',
                    solution: 'From the divisibility: \\(\\exp(\\theta(2n) - \\theta(n)) \\le \\binom{2n}{n} \\le 4^n\\), so \\(\\theta(2n) - \\theta(n) \\le n \\ln 4 = 2n \\ln 2\\). For general \\(x\\), telescope: \\(\\theta(x) = \\sum_{j=0}^{k-1}[\\theta(x/2^j) - \\theta(x/2^{j+1})] \\le \\sum_{j=0}^{k-1} (x/2^{j+1})\\ln 4 \\le x \\ln 4\\).'
                },
                {
                    question: 'Verify Bertrand\'s postulate for \\(n = 25\\): find a prime between 25 and 50.',
                    hint: 'Just list: 29, 31, 37, 41, 43, 47 are all prime and lie in (25, 50).',
                    solution: 'The primes between 25 and 50 are: 29, 31, 37, 41, 43, 47. So there are 6 primes in this range, confirming Bertrand\'s postulate with room to spare.'
                }
            ]
        },

        // ================================================================
        // SECTION 4: Applying Perron's Formula
        // ================================================================
        {
            id: 'sec-perron-applied',
            title: "Applying Perron's Formula",
            content: `
<h2>Applying Perron's Formula to \\(\\psi(x)\\)</h2>

<div class="env-block intuition">
    <div class="env-title">The Strategy</div>
    <div class="env-body">
        <p>Perron's formula converts a Dirichlet series into a contour integral. We use it to express \\(\\psi(x)\\) as an integral of \\(-\\zeta'(s)/\\zeta(s)\\) over a vertical line in the complex plane. Then we shift this contour to the left, picking up residues from the poles of \\(-\\zeta'(s)/\\zeta(s)\\). The main term \\(x\\) comes from the residue at \\(s = 1\\).</p>
    </div>
</div>

<h3>The Dirichlet Series Identity</h3>

<p>Recall the von Mangoldt identity:
\\[-\\frac{\\zeta'(s)}{\\zeta(s)} = \\sum_{n=1}^\\infty \\frac{\\Lambda(n)}{n^s}, \\quad \\text{Re}(s) > 1.\\]
This follows from logarithmic differentiation of the Euler product \\(\\zeta(s) = \\prod_p (1-p^{-s})^{-1}\\):
\\[\\frac{d}{ds} \\ln \\zeta(s) = -\\sum_p \\frac{\\ln p \\cdot p^{-s}}{1 - p^{-s}} = -\\sum_p \\sum_{k=1}^\\infty \\frac{\\ln p}{p^{ks}} = -\\sum_{n=1}^\\infty \\frac{\\Lambda(n)}{n^s}.\\]
</p>

<h3>Perron's Formula</h3>

<div class="env-block theorem">
    <div class="env-title">Theorem 7.5 (Perron's Formula, smooth version)</div>
    <div class="env-body">
        <p>For \\(c > 1\\) and \\(x > 1\\) not an integer:
        \\[\\psi(x) = \\frac{1}{2\\pi i} \\int_{c - i\\infty}^{c + i\\infty} \\left(-\\frac{\\zeta'(s)}{\\zeta(s)}\\right) \\frac{x^s}{s} \\, ds.\\]
        </p>
    </div>
</div>

<p>This is proved using the identity
\\[\\frac{1}{2\\pi i} \\int_{c-i\\infty}^{c+i\\infty} \\frac{y^s}{s} ds = \\begin{cases} 1 & y > 1 \\\\ 0 & 0 < y < 1 \\end{cases} \\quad (c > 0)\\]
applied term-by-term to the Dirichlet series: the \\(n\\)-th term contributes \\(\\Lambda(n)\\) iff \\(n \\le x\\) (i.e., \\(y = x/n > 1\\)).</p>

<h3>Structure of Poles of \\(-\\zeta'/\\zeta\\)</h3>

<p>The poles of \\(-\\zeta'(s)/\\zeta(s)\\) come from:</p>
<ul>
    <li><strong>Pole at \\(s = 1\\):</strong> \\(\\zeta(s) = 1/(s-1) + O(1)\\) near \\(s=1\\), so \\(-\\zeta'/\\zeta\\) has a simple pole with residue \\(1\\). This gives the main term \\(x^1/1 = x\\).</li>
    <li><strong>Poles at nontrivial zeros \\(\\rho\\):</strong> If \\(\\zeta(\\rho) = 0\\) with order 1, then \\(-\\zeta'/\\zeta\\) has a simple pole at \\(s = \\rho\\) with residue \\(-1\\), contributing \\(-x^\\rho/\\rho\\).</li>
    <li><strong>Trivial zeros at \\(s = -2, -4, -6, \\ldots\\):</strong> Contribute \\(-x^{-2k}/(-2k)\\), which are small.</li>
    <li><strong>Pole at \\(s = 0\\):</strong> Contributes a constant.</li>
</ul>

<p>If we could shift the contour all the way to the left, we would get the "explicit formula":
\\[\\psi(x) = x - \\sum_{\\rho} \\frac{x^\\rho}{\\rho} - \\ln(2\\pi) - \\frac{1}{2}\\ln(1 - x^{-2}).\\]
This is Riemann's explicit formula, relating prime distribution to zeta zeros.</p>

<div class="viz-placeholder" data-viz="viz-perron-integral"></div>
`,
            visualizations: [
                {
                    id: 'viz-perron-integral',
                    title: "Perron's Contour: Vertical Line in \\(\\mathbb{C}\\)",
                    description: 'The Perron contour is the vertical line Re(s) = c > 1. The integrand has poles at s=1 (from the simple pole of zeta) and at nontrivial zeros of zeta. Drag the vertical line to see how its position relative to the pole at s=1 changes.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 620, height: 400,
                            originX: 200, originY: 200, scale: 60
                        });

                        var cLine = 2.0;
                        var t = 0;

                        // Approximate nontrivial zeros (imaginary parts)
                        var zeroIm = [14.135, 21.022, 25.011, 30.425, 32.935];

                        VizEngine.createSlider(controls, 'c (Re of contour)', 0.2, 3.0, cLine, 0.05, function(v) {
                            cLine = v;
                            draw(t);
                        });

                        function draw(ts) {
                            viz.clear();
                            viz.drawGrid(1);
                            viz.drawAxes();

                            var ctx = viz.ctx;
                            var W = viz.width, H = viz.height;

                            // Critical strip shading (0 < Re(s) < 1)
                            var [sx0] = viz.toScreen(0, 0), [sx1] = viz.toScreen(1, 0);
                            ctx.fillStyle = viz.colors.purple + '18';
                            ctx.fillRect(sx0, 0, sx1 - sx0, H);

                            // Pole at s=1 (red X)
                            var [px1, py1] = viz.toScreen(1, 0);
                            ctx.strokeStyle = viz.colors.red; ctx.lineWidth = 2.5;
                            ctx.beginPath(); ctx.moveTo(px1 - 8, py1 - 8); ctx.lineTo(px1 + 8, py1 + 8); ctx.stroke();
                            ctx.beginPath(); ctx.moveTo(px1 - 8, py1 + 8); ctx.lineTo(px1 + 8, py1 - 8); ctx.stroke();
                            ctx.fillStyle = viz.colors.red; ctx.font = '11px sans-serif';
                            ctx.textAlign = 'left'; ctx.textBaseline = 'top';
                            ctx.fillText('pole s=1', px1 + 10, py1 - 8);

                            // Nontrivial zeros (at Re(s) = 0.5, by RH convention, shown schematically)
                            zeroIm.forEach(function(im) {
                                var scale = viz.scale;
                                if (Math.abs(im) > H / (2 * scale) - 0.5) return;
                                var [zx, zy] = viz.toScreen(0.5, im / scale);
                                ctx.fillStyle = viz.colors.orange;
                                ctx.beginPath(); ctx.arc(zx, zy, 5, 0, Math.PI * 2); ctx.fill();
                                var [zx2, zy2] = viz.toScreen(0.5, -im / scale);
                                ctx.beginPath(); ctx.arc(zx2, zy2, 5, 0, Math.PI * 2); ctx.fill();
                            });

                            // Contour line at Re(s) = c
                            var [scx] = viz.toScreen(cLine, 0);
                            ctx.strokeStyle = cLine > 1 ? viz.colors.blue : viz.colors.red;
                            ctx.lineWidth = 2.5;
                            ctx.setLineDash(cLine > 1 ? [] : [6, 4]);
                            ctx.beginPath(); ctx.moveTo(scx, 0); ctx.lineTo(scx, H); ctx.stroke();
                            ctx.setLineDash([]);

                            // Label contour
                            ctx.fillStyle = cLine > 1 ? viz.colors.blue : viz.colors.red;
                            ctx.font = 'bold 12px sans-serif'; ctx.textAlign = 'center';
                            ctx.fillText('Re(s) = c = ' + cLine.toFixed(2), scx, 16);

                            // Arrow on contour (animated upward)
                            var arrowY = (ts * 30) % H;
                            var [ax] = viz.toScreen(cLine, 0);
                            ctx.fillStyle = cLine > 1 ? viz.colors.blue : viz.colors.red;
                            ctx.beginPath();
                            ctx.moveTo(ax, arrowY - 8);
                            ctx.lineTo(ax - 5, arrowY + 4);
                            ctx.lineTo(ax + 5, arrowY + 4);
                            ctx.closePath(); ctx.fill();

                            // Labels
                            viz.screenText('Critical strip: 0 < Re(s) < 1', W / 2, H - 18, viz.colors.purple, 11);
                            viz.screenText('Orange dots: nontrivial zeros (Re\u2248\xbd assumed by RH)', W / 2, H - 4, viz.colors.orange, 10);
                            ctx.fillStyle = cLine > 1 ? viz.colors.green : viz.colors.red;
                            ctx.font = '12px sans-serif'; ctx.textAlign = 'center';
                            ctx.fillText(cLine > 1 ? 'Contour to the right of s=1: Perron valid' : 'Contour left of s=1: must count residues!', W / 2, H - 32);
                        }

                        viz.animate(function(ts) { t = ts / 1000; draw(t); });
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Verify the identity \\(\\displaystyle -\\frac{\\zeta\'(s)}{\\zeta(s)} = \\sum_{n=1}^\\infty \\frac{\\Lambda(n)}{n^s}\\) for \\(\\text{Re}(s) > 1\\) by differentiating the Euler product.',
                    hint: 'Take \\(\\ln\\) of \\(\\zeta(s) = \\prod_p (1 - p^{-s})^{-1}\\), differentiate termwise, and use \\(\\sum_{k \\ge 1} k p^{-ks}\\ln p\\) for each prime.',
                    solution: '\\(\\ln\\zeta(s) = -\\sum_p \\ln(1 - p^{-s}) = \\sum_p \\sum_{k=1}^\\infty \\frac{p^{-ks}}{k}\\). Differentiating: \\(\\zeta\'(s)/\\zeta(s) = -\\sum_p \\sum_{k=1}^\\infty \\frac{\\ln p \\cdot p^{-ks}}{1} = -\\sum_p \\sum_{k=1}^\\infty \\frac{\\ln p}{p^{ks}}\\). Reindexing by \\(n = p^k\\): \\(-\\zeta\'/\\zeta = \\sum_n \\Lambda(n) n^{-s}\\).'
                },
                {
                    question: 'What is the residue of \\(-\\zeta\'(s)/\\zeta(s)\\) at \\(s = 1\\)? What does this imply for the main term in \\(\\psi(x)\\)?',
                    hint: 'Near \\(s = 1\\): \\(\\zeta(s) = \\frac{1}{s-1} + \\gamma + O(s-1)\\) (Laurent expansion). Compute \\(-\\zeta\'/\\zeta\\) near \\(s=1\\).',
                    solution: 'Near \\(s=1\\): \\(\\zeta(s) \\approx (s-1)^{-1}\\), so \\(\\zeta\'(s) \\approx -(s-1)^{-2}\\) and \\(-\\zeta\'/\\zeta \\approx (s-1)^{-2} \\cdot (s-1) = (s-1)^{-1}\\). The residue is \\(1\\). In Perron\'s formula, this contributes \\(\\text{Res}_{s=1}\\left[\\frac{x^s}{s} \\cdot \\frac{1}{s-1}\\right] = x^1/1 = x\\), giving the main term \\(\\psi(x) \\approx x\\).'
                }
            ]
        },

        // ================================================================
        // SECTION 5: Shifting the Contour
        // ================================================================
        {
            id: 'sec-contour-proof',
            title: 'Shifting the Contour',
            content: `
<h2>Shifting the Contour: Capturing the Main Term</h2>

<div class="env-block intuition">
    <div class="env-title">The Key Move</div>
    <div class="env-body">
        <p>Perron's formula gives \\(\\psi(x)\\) as an integral over the vertical line \\(\\text{Re}(s) = c > 1\\). To evaluate it, we shift this line to the left, toward \\(\\text{Re}(s) = 1\\). As we cross the pole at \\(s = 1\\), we pick up a residue equal to \\(x\\). The PNT then follows from showing the remaining integral is \\(o(x)\\), which requires a zero-free region for \\(\\zeta(s)\\) near \\(\\text{Re}(s) = 1\\).</p>
    </div>
</div>

<h3>The Rectangular Contour</h3>

<p>Fix \\(T > 0\\) large and consider the rectangular contour \\(\\mathcal{R}\\) with vertices at \\(c \\pm iT\\) and \\(\\sigma_0 \\pm iT\\), where \\(\\sigma_0 < 1\\) is chosen inside a zero-free region. By Cauchy's residue theorem:</p>

\\[\\frac{1}{2\\pi i} \\oint_{\\mathcal{R}} \\left(-\\frac{\\zeta'(s)}{\\zeta(s)}\\right) \\frac{x^s}{s} ds = \\sum_{\\text{poles inside}} \\text{Res}.\\]

<p>The only pole inside \\(\\mathcal{R}\\) (for \\(T\\) not hitting a zero imaginary part) is at \\(s = 1\\), contributing \\(x\\).</p>

<h3>Bounding the Error Integrals</h3>

<p>The contour \\(\\mathcal{R}\\) consists of four segments. The right vertical piece gives \\(\\psi(x)\\) (by Perron's formula). The other three pieces must be bounded.</p>

<p><strong>Horizontal pieces</strong> \\((\\sigma_0 \\le \\sigma \\le c, \\text{Im}(s) = \\pm T)\\): On these, \\(|x^s/s| = x^\\sigma/T\\). Using a bound \\(|-\\zeta'/\\zeta| = O(\\log^2 T)\\) (valid in the zero-free region), the horizontal integrals contribute \\(O(x \\log^2 T / T)\\).</p>

<p><strong>Left vertical piece</strong> \\((\\text{Re}(s) = \\sigma_0, |\\text{Im}(s)| \\le T)\\): Here \\(|x^s| = x^{\\sigma_0} = o(x)\\), so this piece is \\(O(x^{\\sigma_0} T)\\).</p>

<h3>The Zero-Free Region is Crucial</h3>

<p>Why do we need \\(\\zeta(s) \\ne 0\\) near \\(\\text{Re}(s) = 1\\)? Because \\(-\\zeta'/\\zeta\\) has poles at zeros of \\(\\zeta\\). If \\(\\zeta\\) had a zero on \\(\\text{Re}(s) = 1\\), shifting the contour past \\(\\text{Re}(s) = 1\\) would pick up an additional residue \\(x^\\rho/\\rho\\) with \\(|x^\\rho| = x\\), cancelling the main term. This is why the nonvanishing \\(\\zeta(1 + it) \\ne 0\\) for all real \\(t\\) is the essential ingredient.</p>

<div class="env-block theorem">
    <div class="env-title">Theorem 7.6 (Contour shift gives PNT)</div>
    <div class="env-body">
        <p>Assuming \\(\\zeta(1 + it) \\ne 0\\) for all \\(t \\in \\mathbb{R}\\), there exists \\(\\sigma_0 = \\sigma_0(T) < 1\\) (inside the zero-free region) such that:</p>
        \\[\\psi(x) = x + O\\left(\\frac{x \\log^2 T}{T} + x^{\\sigma_0} T\\right).\\]
        <p>Optimizing \\(T\\) (choosing \\(T = x^{1/2}\\)) gives \\(\\psi(x) = x + o(x)\\), i.e., \\(\\psi(x) \\sim x\\).</p>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-contour-shift"></div>
`,
            visualizations: [
                {
                    id: 'viz-contour-shift',
                    title: 'Contour Shift: From Re(s) = c to Re(s) = \\(\\sigma_0\\)',
                    description: 'Animate the contour shifting left. Watch it capture the residue at s=1 (the main term x) and leave the error integrals on the horizontal and left-vertical segments. The animation shows the rectangular contour expanding and then shifting.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 620, height: 420,
                            originX: 240, originY: 210, scale: 55
                        });

                        var phase = 0; // 0..1: shift progress
                        var animating = false;
                        var animId = null;

                        var btnAnim = VizEngine.createButton(controls, 'Animate Shift', function() {
                            animating = !animating;
                            btnAnim.textContent = animating ? 'Pause' : 'Animate Shift';
                            if (animating) runAnim();
                        });
                        VizEngine.createButton(controls, 'Reset', function() {
                            animating = false; phase = 0;
                            btnAnim.textContent = 'Animate Shift';
                            draw(phase);
                        });

                        function runAnim() {
                            if (!animating) return;
                            phase = Math.min(phase + 0.008, 1);
                            draw(phase);
                            if (phase < 1) { animId = requestAnimationFrame(runAnim); }
                            else { animating = false; btnAnim.textContent = 'Animate Shift'; }
                        }

                        var cInit = 1.8, sigma0 = 0.5, T = 2.8;

                        function draw(ph) {
                            viz.clear();
                            viz.drawGrid(1);
                            viz.drawAxes();
                            var ctx = viz.ctx;
                            var W = viz.width, H = viz.height;

                            // Critical strip
                            var [sx0] = viz.toScreen(0, 0), [sx1] = viz.toScreen(1, 0);
                            ctx.fillStyle = viz.colors.purple + '15';
                            ctx.fillRect(sx0, 0, sx1 - sx0, H);

                            // Pole at s=1
                            var [px1, py1] = viz.toScreen(1, 0);
                            ctx.strokeStyle = viz.colors.red; ctx.lineWidth = 2.5;
                            ctx.beginPath(); ctx.moveTo(px1-8,py1-8); ctx.lineTo(px1+8,py1+8); ctx.stroke();
                            ctx.beginPath(); ctx.moveTo(px1-8,py1+8); ctx.lineTo(px1+8,py1-8); ctx.stroke();
                            ctx.fillStyle = viz.colors.red; ctx.font = '11px sans-serif';
                            ctx.textAlign = 'left'; ctx.fillText('Res = x', px1+10, py1-4);

                            // Zeros on critical line
                            [[14.135, 1], [21.022, 2]].forEach(function(zm) {
                                var im = zm[0] / viz.scale;
                                if (Math.abs(im) > H/(2*viz.scale)) return;
                                var [zx, zy] = viz.toScreen(0.5, im);
                                var [zx2, zy2] = viz.toScreen(0.5, -im);
                                ctx.fillStyle = viz.colors.orange;
                                ctx.beginPath(); ctx.arc(zx, zy, 4, 0, Math.PI*2); ctx.fill();
                                ctx.beginPath(); ctx.arc(zx2, zy2, 4, 0, Math.PI*2); ctx.fill();
                            });

                            // Current contour: right side at c, left side shifts from c to sigma0
                            var c = cInit;
                            var sigLeft = cInit + (sigma0 - cInit) * ph;

                            // Draw rectangular contour
                            var [rx0, ry0] = viz.toScreen(sigLeft, -T);
                            var [rx1, ry1] = viz.toScreen(c, -T);
                            var [rx2, ry2] = viz.toScreen(c, T);
                            var [rx3, ry3] = viz.toScreen(sigLeft, T);

                            ctx.strokeStyle = viz.colors.blue; ctx.lineWidth = 2;
                            ctx.beginPath();
                            ctx.moveTo(rx1, ry1);
                            ctx.lineTo(rx2, ry2); // right side (Perron)
                            ctx.strokeStyle = viz.colors.blue; ctx.stroke();

                            // horizontal top
                            ctx.strokeStyle = viz.colors.teal; ctx.lineWidth = 1.5;
                            ctx.beginPath(); ctx.moveTo(rx2, ry2); ctx.lineTo(rx3, ry3); ctx.stroke();

                            // left side
                            ctx.strokeStyle = ph > 0.05 ? viz.colors.green : viz.colors.blue;
                            ctx.lineWidth = 2;
                            ctx.beginPath(); ctx.moveTo(rx3, ry3); ctx.lineTo(rx0, ry0); ctx.stroke();

                            // horizontal bottom
                            ctx.strokeStyle = viz.colors.teal; ctx.lineWidth = 1.5;
                            ctx.beginPath(); ctx.moveTo(rx0, ry0); ctx.lineTo(rx1, ry1); ctx.stroke();

                            // Labels for segments
                            ctx.font = '11px sans-serif'; ctx.textAlign = 'center';
                            ctx.fillStyle = viz.colors.blue;
                            ctx.fillText('\u03c8(x) side', (rx1+rx2)/2 + 30, (ry1+ry2)/2);
                            ctx.fillStyle = viz.colors.teal;
                            ctx.fillText('O(x log\xb2T/T)', (rx2+rx3)/2, ry2 - 8);
                            ctx.fillText('O(x log\xb2T/T)', (rx0+rx1)/2, ry0 + 16);
                            if (ph > 0.05) {
                                ctx.fillStyle = viz.colors.green;
                                ctx.fillText('O(x^\u03c3\u2080 T)', (rx0+rx3)/2 - 30, (ry0+ry3)/2);
                            }

                            // Residue label
                            if (ph > 0.3) {
                                ctx.fillStyle = viz.colors.yellow; ctx.font = 'bold 13px sans-serif';
                                ctx.fillText('Captured: Res = x', px1, py1 + 30);
                            }

                            // sigma_0 label
                            var [sigX] = viz.toScreen(sigLeft, 0);
                            ctx.fillStyle = ph > 0.05 ? viz.colors.green : viz.colors.axis;
                            ctx.font = '11px sans-serif'; ctx.textAlign = 'center';
                            ctx.fillText('\u03c3 = ' + sigLeft.toFixed(2), sigX, 12);

                            viz.screenText('Phase: ' + (ph * 100).toFixed(0) + '% shifted  |  \u03c8(x) = x + (error terms)', W/2, H-8, viz.colors.text, 11);
                        }

                        draw(phase);
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Explain in your own words why \\(\\zeta(1+it) \\ne 0\\) is necessary for the PNT. What would happen to the contour integral argument if \\(\\zeta(1+i t_0) = 0\\) for some real \\(t_0\\)?',
                    hint: 'A zero at \\(s = 1 + it_0\\) means \\(-\\zeta\'/\\zeta\\) has a pole there. When shifting the contour, you would cross this pole and pick up a residue.',
                    solution: 'If \\(\\zeta(1+it_0) = 0\\), then \\(-\\zeta\'/\\zeta\\) has a simple pole at \\(\\rho = 1+it_0\\) with residue \\(-1\\). Shifting the contour past \\(\\text{Re}(s)=1\\) would pick up this residue, contributing \\(-x^{1+it_0}/(1+it_0)\\) to \\(\\psi(x)\\). Since \\(|x^{1+it_0}| = x\\), this term is of size \\(x\\), competing with the main term \\(x\\) and preventing \\(\\psi(x) \\sim x\\).'
                },
                {
                    question: 'In the rectangular contour argument, why do we send \\(T \\to \\infty\\) rather than use a fixed \\(T\\)?',
                    hint: 'Think about what happens to the horizontal integrals as \\(T \\to \\infty\\), and what constraints this places on the choice of \\(T\\).',
                    solution: 'A fixed \\(T\\) might coincide with the imaginary part of a nontrivial zero, making \\(-\\zeta\'/\\zeta\\) large on the horizontal segments. By taking \\(T \\to \\infty\\) carefully (avoiding zeros), the horizontal contributions vanish. In practice, for the PNT we optimize \\(T = T(x) \\to \\infty\\) with \\(x\\) to get the best error term. One cannot simply take \\(T = \\infty\\) at once because the integrals might not converge absolutely.'
                }
            ]
        },

        // ================================================================
        // SECTION 6: The Error Term
        // ================================================================
        {
            id: 'sec-error-term',
            title: 'The Error Term',
            content: `
<h2>The Error Term: How Quickly Does \\(\\psi(x)/x \\to 1\\)?</h2>

<div class="env-block intuition">
    <div class="env-title">Beyond \\(\\sim\\)</div>
    <div class="env-body">
        <p>The PNT says \\(\\psi(x) \\sim x\\), but this hides the rate of convergence. The Chebyshev bounds show the ratio \\(\\psi(x)/x\\) stays between 0.693 and 1.386. The full PNT improves this to \\(|\\psi(x)/x - 1| \\to 0\\). But how fast? The answer depends on the zero-free region for \\(\\zeta(s)\\), and computing this explicitly is one of the central problems of analytic number theory.</p>
    </div>
</div>

<h3>The Classical Zero-Free Region</h3>

<p>De la Vall&eacute;e Poussin proved that there exists \\(c > 0\\) such that \\(\\zeta(\\sigma + it) \\ne 0\\) for
\\[\\sigma \\ge 1 - \\frac{c}{\\ln(|t| + 2)}.\\]
This is the "classical zero-free region." The key ingredient is the identity \\(3 + 4\\cos\\theta + \\cos 2\\theta \\ge 0\\), used to bound \\(\\text{Re}(-\\zeta'/\\zeta)\\) via the sum over primes.</p>

<h3>The Error Term Formula</h3>

<div class="env-block theorem">
    <div class="env-title">Theorem 7.7 (PNT with error term)</div>
    <div class="env-body">
        <p>There exists an absolute constant \\(c > 0\\) such that:
        \\[\\psi(x) = x + O\\left(x \\exp\\left(-c \\sqrt{\\ln x}\\right)\\right),\\]
        and equivalently,
        \\[\\pi(x) = \\operatorname{Li}(x) + O\\left(x \\exp\\left(-c \\sqrt{\\ln x}\\right)\\right).\\]
        </p>
    </div>
</div>

<p>The term \\(\\exp(-c\\sqrt{\\ln x})\\) comes from optimizing the contour: the zero-free region width \\(c/\\ln T\\) forces \\(x^{\\sigma_0} = x^{1 - c/\\ln T}\\), and choosing \\(T = \\exp(\\sqrt{\\ln x})\\) balances the error.</p>

<h3>The Role of the Riemann Hypothesis</h3>

<p>Under the Riemann Hypothesis (all nontrivial zeros have \\(\\text{Re}(\\rho) = 1/2\\)), one can show:
\\[\\psi(x) = x + O\\left(\\sqrt{x} \\ln^2 x\\right).\\]
This is much stronger: the error is \\(O(\\sqrt{x})\\) instead of \\(O(x e^{-c\\sqrt{\\ln x}})\\). The residues at zeros \\(\\rho = 1/2 + i\\gamma\\) contribute \\(x^{\\rho}/\\rho\\) with \\(|x^\\rho| = \\sqrt{x}\\). So the RH gives the "best possible" error, given the location of the zeros.</p>

<div class="viz-placeholder" data-viz="viz-error-shrinking"></div>
`,
            visualizations: [
                {
                    id: 'viz-error-shrinking',
                    title: '\\(|\\psi(x) - x|/x\\): The Error Shrinking',
                    description: 'Plot the relative error \\(|\\psi(x) - x|/x\\) and compare it to \\(1/\\ln x\\) and the PNT bound \\(\\exp(-c\\sqrt{\\ln x})\\). The error oscillates but trends downward.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 660, height: 360,
                            originX: 60, originY: 310, scale: 1
                        });

                        var maxX = 500;
                        VizEngine.createSlider(controls, 'x max', 100, 2000, maxX, 100, function(v) {
                            maxX = Math.round(v);
                            draw();
                        });

                        // Precompute psi
                        var MSIEVE = 2100;
                        var primes3 = VizEngine.sievePrimes(MSIEVE);
                        var psiB = new Float64Array(MSIEVE + 1);
                        for (var n3 = 2; n3 <= MSIEVE; n3++) {
                            psiB[n3] = psiB[n3-1];
                            var vv = n3, pp = 0;
                            for (var ii = 0; ii < primes3.length && primes3[ii] <= vv; ii++) {
                                if (vv % primes3[ii] === 0) {
                                    pp = primes3[ii];
                                    while (vv % pp === 0) vv /= pp;
                                    if (vv === 1) psiB[n3] += Math.log(pp);
                                    break;
                                }
                            }
                        }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var W = viz.width, H = viz.height;
                            var x0 = 60, plotW = W - 80, plotH = H - 50;
                            var y0 = 10;
                            var xLim = Math.min(maxX, MSIEVE);

                            // Find max error for scaling
                            var maxErr = 0;
                            var step4 = Math.max(1, Math.floor(xLim / 400));
                            for (var xi = 10; xi <= xLim; xi += step4) {
                                var err = Math.abs(psiB[xi] - xi) / xi;
                                if (err > maxErr) maxErr = err;
                            }
                            maxErr = Math.max(maxErr, 0.05);

                            function sx(x) { return x0 + (x / xLim) * plotW; }
                            function sy(y) { return y0 + plotH * (1 - y / maxErr); }

                            // Grid
                            ctx.strokeStyle = viz.colors.grid; ctx.lineWidth = 0.5;
                            for (var ti = 0; ti <= 5; ti++) {
                                var yv = maxErr * ti / 5;
                                var syi = sy(yv);
                                ctx.beginPath(); ctx.moveTo(x0, syi); ctx.lineTo(x0 + plotW, syi); ctx.stroke();
                                ctx.fillStyle = viz.colors.text; ctx.font = '10px sans-serif';
                                ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
                                ctx.fillText(yv.toFixed(3), x0 - 4, syi);
                            }

                            // 1/ln x reference
                            ctx.strokeStyle = viz.colors.teal; ctx.lineWidth = 1.5; ctx.setLineDash([4,4]);
                            ctx.beginPath(); var refStarted = false;
                            for (var xi2 = 10; xi2 <= xLim; xi2 += step4) {
                                var rv = 1 / Math.log(xi2);
                                if (rv > maxErr * 1.05) { refStarted = false; continue; }
                                var rsxi = sx(xi2), rsyi = sy(Math.min(rv, maxErr));
                                if (!refStarted) { ctx.moveTo(rsxi, rsyi); refStarted = true; } else { ctx.lineTo(rsxi, rsyi); }
                            }
                            ctx.stroke(); ctx.setLineDash([]);

                            // |psi(x)-x|/x
                            ctx.strokeStyle = viz.colors.blue; ctx.lineWidth = 2;
                            ctx.beginPath(); var errStarted = false;
                            for (var xi3 = 10; xi3 <= xLim; xi3 += step4) {
                                var errv = Math.abs(psiB[xi3] - xi3) / xi3;
                                if (errv > maxErr * 1.05) { errStarted = false; continue; }
                                var esxi = sx(xi3), esyi = sy(Math.min(errv, maxErr));
                                if (!errStarted) { ctx.moveTo(esxi, esyi); errStarted = true; } else { ctx.lineTo(esxi, esyi); }
                            }
                            ctx.stroke();

                            // Axes
                            ctx.strokeStyle = viz.colors.axis; ctx.lineWidth = 1.5;
                            ctx.beginPath(); ctx.moveTo(x0, y0 + plotH); ctx.lineTo(x0 + plotW, y0 + plotH); ctx.stroke();
                            ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x0, y0 + plotH); ctx.stroke();

                            // x-axis labels
                            ctx.fillStyle = viz.colors.text; ctx.font = '10px sans-serif';
                            ctx.textAlign = 'center'; ctx.textBaseline = 'top';
                            for (var ti2 = 1; ti2 <= 8; ti2++) {
                                var xvl = Math.round(xLim * ti2 / 8);
                                ctx.fillText(xvl, sx(xvl), y0 + plotH + 4);
                            }

                            // Legend
                            ctx.fillStyle = viz.colors.blue; ctx.font = '11px sans-serif'; ctx.textAlign = 'left';
                            ctx.fillRect(x0 + 10, y0 + 10, 18, 10);
                            ctx.fillStyle = viz.colors.text; ctx.fillText('|\u03c8(x) - x|/x', x0 + 32, y0 + 18);
                            ctx.fillStyle = viz.colors.teal;
                            ctx.fillRect(x0 + 150, y0 + 10, 18, 10);
                            ctx.fillStyle = viz.colors.text; ctx.fillText('1/ln x', x0 + 172, y0 + 18);
                        }

                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'The error term is \\(O(x e^{-c\\sqrt{\\ln x}})\\). Numerically, at \\(x = 10^{100}\\), how large is \\(e^{-c\\sqrt{\\ln x}}\\) relative to \\(1/\\ln x\\)? (Take \\(c = 0.2\\).)',
                    hint: '\\(\\ln(10^{100}) = 100 \\ln 10 \\approx 230\\). Compute \\(e^{-0.2\\sqrt{230}}\\) and \\(1/230\\).',
                    solution: '\\(\\sqrt{\\ln(10^{100})} = \\sqrt{100\\ln 10} \\approx \\sqrt{230.3} \\approx 15.18\\). So \\(e^{-0.2 \\times 15.18} = e^{-3.04} \\approx 0.048\\). Compare to \\(1/\\ln(10^{100}) \\approx 1/230 \\approx 0.0043\\). At this scale, the classical error bound \\(\\approx 0.048\\) is actually weaker than \\(1/\\ln x \\approx 0.004\\). This illustrates why the error term is not sharp and RH would give \\(O(x^{-1/2}\\ln^2 x)\\) instead.'
                },
                {
                    question: 'Under RH, the error is \\(O(\\sqrt{x} \\ln^2 x)\\). Show this means \\(|\\pi(x) - \\operatorname{Li}(x)| = O(\\sqrt{x} \\ln x)\\).',
                    hint: 'Use partial summation to relate \\(\\psi(x) - x\\) to \\(\\pi(x) - \\operatorname{Li}(x)\\).',
                    solution: 'By Abel summation: \\(\\pi(x) = \\psi(x)/\\ln x + \\int_2^x \\psi(t)/t \\ln^2 t \\, dt + O(1)\\) (roughly). If \\(\\psi(x) = x + R(x)\\) with \\(R(x) = O(\\sqrt{x}\\ln^2 x)\\), then \\(\\pi(x) = x/\\ln x + R(x)/\\ln x + O(\\int_2^x \\sqrt{t}\\ln^2 t/(t\\ln^2 t)dt) = \\operatorname{Li}(x) + O(\\sqrt{x}\\ln x)\\). The integral \\(\\int_2^x \\sqrt{t}^{-1}dt = O(\\sqrt{x})\\), giving the stated bound.'
                }
            ]
        },

        // ================================================================
        // SECTION 7: Beyond the Leading Term
        // ================================================================
        {
            id: 'sec-bridge',
            title: 'Beyond the Leading Term',
            content: `
<h2>Beyond the Leading Term: What Comes Next?</h2>

<div class="env-block intuition">
    <div class="env-title">From \\(\\sim\\) to \\(=\\)</div>
    <div class="env-body">
        <p>The PNT is a statement about leading-order behavior: \\(\\pi(x) \\sim x/\\ln x\\). But number theory needs more. Goldbach's conjecture, twin primes, primes in short intervals, primes in arithmetic progressions --- all require understanding not just the leading term but the fluctuations. The key is that the error term is controlled by zeros of \\(\\zeta(s)\\), each of which imprints an oscillation on \\(\\psi(x)\\).</p>
    </div>
</div>

<h3>The Explicit Formula Revisited</h3>

<p>Riemann's explicit formula (for \\(x\\) not a prime power):
\\[\\psi(x) = x - \\sum_{\\rho} \\frac{x^\\rho}{\\rho} - \\ln(2\\pi) - \\frac{1}{2}\\ln(1 - x^{-2}),\\]
where the sum over \\(\\rho\\) runs over all nontrivial zeros of \\(\\zeta\\). Each zero \\(\\rho = \\beta + i\\gamma\\) contributes a term
\\[\\frac{x^\\rho}{\\rho} = \\frac{x^\\beta}{|\\rho|} e^{i\\gamma \\ln x + i\\arg\\rho}.\\]
This is an oscillatory term with frequency \\(\\gamma/(2\\pi)\\) in \\(\\ln x\\) and amplitude \\(x^\\beta/|\\rho|\\). If RH holds (\\(\\beta = 1/2\\)), all oscillations have amplitude \\(O(\\sqrt{x})\\).</p>

<h3>Three Approximations to \\(\\pi(x)\\)</h3>

<p>There are three increasingly accurate approximations:</p>
<ol>
    <li>\\(x / \\ln x\\): the simplest, off by \\(\\sim x/\\ln^2 x\\)</li>
    <li>\\(\\operatorname{Li}(x) = \\int_2^x dt/\\ln t\\): much better, off by \\(O(x e^{-c\\sqrt{\\ln x}})\\) unconditionally</li>
    <li>\\(\\operatorname{Li}(x) - \\sum_{\\rho} \\operatorname{Li}(x^\\rho)\\): the full Riemann approximation (requires knowing zeros)</li>
</ol>

<p>The logarithmic integral \\(\\operatorname{Li}(x)\\) consistently overestimates \\(\\pi(x)\\) for all computed values of \\(x\\). Littlewood proved in 1914 that \\(\\pi(x) - \\operatorname{Li}(x)\\) changes sign infinitely often, but the first crossover is conjectured to occur near \\(x \\approx 10^{316}\\) (Skewes' number problem).</p>

<h3>The Road Ahead</h3>

<p>The PNT is not an endpoint but a beginning. The chapters ahead explore:</p>
<ul>
    <li><strong>Ch 8 (Explicit Formula):</strong> The exact relationship between zeros and prime oscillations.</li>
    <li><strong>Ch 9–10 (Dirichlet L-functions):</strong> PNT for primes in arithmetic progressions \\(a \\pmod q\\).</li>
    <li><strong>Ch 11–13 (Sieves):</strong> Counting primes when complex analysis is unavailable or too weak.</li>
    <li><strong>Ch 18–19 (Gaps):</strong> How large can gaps between consecutive primes be?</li>
</ul>

<div class="env-block remark">
    <div class="env-title">The Riemann Hypothesis</div>
    <div class="env-body">
        <p>The Riemann Hypothesis — that all nontrivial zeros of \\(\\zeta(s)\\) lie on \\(\\text{Re}(s) = 1/2\\) — would give the best possible error term \\(O(\\sqrt{x}\\ln^2 x)\\). It remains unproven, listed as one of the Millennium Prize Problems. The deepest open question in all of mathematics asks: can the prime distribution be controlled as well as random coin flips?</p>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-three-approximations"></div>
`,
            visualizations: [
                {
                    id: 'viz-three-approximations',
                    title: 'Three Approximations: \\(\\pi(x)\\) vs \\(x/\\ln x\\) vs \\(\\operatorname{Li}(x)\\)',
                    description: 'Compare the three approximations to \\(\\pi(x)\\). Li(x) tracks \\(\\pi(x)\\) much more closely than x/ln x. Use the slider to zoom in.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 680, height: 400,
                            originX: 60, originY: 360, scale: 1
                        });

                        var maxX = 500;
                        VizEngine.createSlider(controls, 'x max', 50, 2000, maxX, 50, function(v) {
                            maxX = Math.round(v);
                            draw();
                        });

                        var MSIEVE2 = 2100;
                        var primes4 = VizEngine.sievePrimes(MSIEVE2);
                        var piArr2 = new Int32Array(MSIEVE2 + 1);
                        var pc2 = 0, pi4 = 0;
                        for (var n4 = 0; n4 <= MSIEVE2; n4++) {
                            if (pi4 < primes4.length && primes4[pi4] === n4) { pc2++; pi4++; }
                            piArr2[n4] = pc2;
                        }

                        // Li(x) via numerical integration
                        function Li(x) {
                            if (x <= 2) return 0;
                            // Simple rectangle rule from 2 to x
                            var sum = 0, steps = 200, dx = (x - 2) / steps;
                            for (var i = 0; i <= steps; i++) {
                                var t = 2 + i * dx;
                                sum += (i === 0 || i === steps ? 0.5 : 1) / Math.log(t);
                            }
                            return sum * dx;
                        }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var W = viz.width, H = viz.height;
                            var x0 = 60, plotW = W - 80, plotH = H - 50, y0 = 10;
                            var xLim = Math.min(maxX, MSIEVE2);
                            var piMax = piArr2[xLim] * 1.15;

                            function sx(x) { return x0 + (x / xLim) * plotW; }
                            function sy(y) { return y0 + plotH * (1 - y / piMax); }

                            // Grid
                            ctx.strokeStyle = viz.colors.grid; ctx.lineWidth = 0.5;
                            for (var ti = 0; ti <= 5; ti++) {
                                var yv = piMax * ti / 5;
                                var syi = sy(yv);
                                ctx.beginPath(); ctx.moveTo(x0, syi); ctx.lineTo(x0 + plotW, syi); ctx.stroke();
                                ctx.fillStyle = viz.colors.text; ctx.font = '10px sans-serif';
                                ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
                                ctx.fillText(Math.round(yv), x0 - 4, syi);
                            }

                            var step5 = Math.max(1, Math.floor(xLim / 300));

                            // x/ln x
                            ctx.strokeStyle = viz.colors.orange; ctx.lineWidth = 1.5; ctx.setLineDash([6,4]);
                            ctx.beginPath(); var s1 = false;
                            for (var xi = 3; xi <= xLim; xi += step5) {
                                var yv2 = xi / Math.log(xi);
                                var sxi = sx(xi), syi2 = sy(yv2);
                                if (!s1) { ctx.moveTo(sxi, syi2); s1 = true; } else ctx.lineTo(sxi, syi2);
                            }
                            ctx.stroke(); ctx.setLineDash([]);

                            // Li(x)
                            ctx.strokeStyle = viz.colors.yellow; ctx.lineWidth = 1.5;
                            ctx.beginPath(); var s2 = false;
                            var liStep = Math.max(5, Math.floor(xLim / 100));
                            for (var xi2 = 5; xi2 <= xLim; xi2 += liStep) {
                                var lyv = Li(xi2);
                                var lsxi = sx(xi2), lsyi = sy(lyv);
                                if (!s2) { ctx.moveTo(lsxi, lsyi); s2 = true; } else ctx.lineTo(lsxi, lsyi);
                            }
                            ctx.stroke();

                            // pi(x)
                            ctx.strokeStyle = viz.colors.blue; ctx.lineWidth = 2;
                            ctx.beginPath();
                            var prevSyi = sy(0);
                            ctx.moveTo(sx(1), prevSyi);
                            for (var xi3 = 2; xi3 <= xLim; xi3 += step5) {
                                var nsxi = sx(xi3), nsyi = sy(piArr2[xi3]);
                                ctx.lineTo(nsxi, prevSyi);
                                ctx.lineTo(nsxi, nsyi);
                                prevSyi = nsyi;
                            }
                            ctx.stroke();

                            // Axes
                            ctx.strokeStyle = viz.colors.axis; ctx.lineWidth = 1.5;
                            ctx.beginPath(); ctx.moveTo(x0, y0 + plotH); ctx.lineTo(x0 + plotW, y0 + plotH); ctx.stroke();
                            ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x0, y0 + plotH); ctx.stroke();
                            ctx.fillStyle = viz.colors.text; ctx.font = '10px sans-serif';
                            ctx.textAlign = 'center'; ctx.textBaseline = 'top';
                            for (var ti2 = 1; ti2 <= 8; ti2++) {
                                var xvl = Math.round(xLim * ti2 / 8);
                                ctx.fillText(xvl, sx(xvl), y0 + plotH + 4);
                            }

                            // Legend
                            var items = [
                                [viz.colors.blue, '\u03c0(x) (exact)'],
                                [viz.colors.yellow, 'Li(x)'],
                                [viz.colors.orange, 'x/ln x'],
                            ];
                            items.forEach(function(it, i) {
                                ctx.fillStyle = it[0];
                                ctx.fillRect(x0 + 10 + i * 140, y0 + 10, 18, 10);
                                ctx.fillStyle = viz.colors.text; ctx.font = '11px sans-serif'; ctx.textAlign = 'left';
                                ctx.fillText(it[1], x0 + 32 + i * 140, y0 + 18);
                            });
                        }

                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Show that \\(\\operatorname{Li}(x) - x/\\ln x \\sim x/\\ln^2 x\\) as \\(x \\to \\infty\\). This explains why \\(\\operatorname{Li}(x)\\) is a better approximation.',
                    hint: 'Integrate \\(\\operatorname{Li}(x) = \\int_2^x \\frac{dt}{\\ln t}\\) by parts: let \\(u = 1/\\ln t\\), \\(dv = dt\\).',
                    solution: 'By parts: \\(\\int_2^x \\frac{dt}{\\ln t} = \\frac{x}{\\ln x} - \\frac{2}{\\ln 2} + \\int_2^x \\frac{dt}{\\ln^2 t}\\). The main correction is \\(\\int_2^x dt/\\ln^2 t \\sim x/\\ln^2 x\\). So \\(\\operatorname{Li}(x) = x/\\ln x + x/\\ln^2 x + O(x/\\ln^3 x)\\), confirming \\(\\operatorname{Li}(x) - x/\\ln x \\sim x/\\ln^2 x\\). Integrating by parts \\(k\\) times gives \\(\\operatorname{Li}(x) \\sim \\sum_{j=1}^k (j-1)! x/\\ln^j x\\) (asymptotic series).'
                },
                {
                    question: "Each nontrivial zero \\(\\rho = 1/2 + i\\gamma\\) (assuming RH) contributes \\(-x^\\rho/\\rho\\) to \\(\\psi(x)\\). Show this term oscillates with frequency \\(\\gamma/(2\\pi)\\) in \\(\\ln x\\).",
                    hint: 'Write \\(x^\\rho = x^{1/2} e^{i\\gamma \\ln x}\\) and take the real part.',
                    solution: '\\(x^\\rho = e^{\\rho \\ln x} = e^{(1/2 + i\\gamma)\\ln x} = \\sqrt{x} e^{i\\gamma \\ln x}\\). The real contribution is \\(\\text{Re}(-x^\\rho/\\rho) = -\\sqrt{x} \\text{Re}(e^{i\\gamma \\ln x}/\\rho)\\). Since \\(e^{i\\gamma \\ln x} = \\cos(\\gamma \\ln x) + i\\sin(\\gamma \\ln x)\\), this oscillates with angular frequency \\(\\gamma\\) in \\(\\ln x\\), or ordinary frequency \\(\\gamma/(2\\pi)\\). The amplitude is \\(\\sqrt{x}/|\\rho|\\), growing with \\(x\\) but much slower than \\(x\\).'
                },
                {
                    question: "Littlewood's theorem states \\(\\pi(x) - \\operatorname{Li}(x)\\) changes sign infinitely often. Why is this surprising given that \\(\\operatorname{Li}(x) > \\pi(x)\\) for all computed \\(x \\le 10^{23}\\)?",
                    hint: 'Think about what the explicit formula implies: the error is a sum of oscillatory terms. As more zeros contribute, can the sum change sign?',
                    solution: 'The explicit formula shows \\(\\pi(x) - \\operatorname{Li}(x) = -\\sum_\\rho \\operatorname{Li}(x^\\rho) + \\cdots\\). The leading oscillatory term from the first zero \\(\\gamma_1 \\approx 14.1\\) has \\(\\operatorname{Li}(x)\\) consistently larger at small \\(x\\), but the sum of infinitely many oscillatory terms eventually constructively interferes to push \\(\\pi(x) - \\operatorname{Li}(x)\\) positive. This happens around \\(x \\approx e^{727.95\\ldots}\\) (Skewes 1955, improved to \\(e^{727.9513}\\) by later work). The moral: asymptotic statements say nothing about any fixed range of \\(x\\), no matter how large.'
                }
            ]
        }

    ]
});
