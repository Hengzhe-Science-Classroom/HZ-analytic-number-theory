// === Chapter 19: Bounded Gaps Between Primes ===
window.CHAPTERS = window.CHAPTERS || [];
window.CHAPTERS.push({
    id: 'ch19',
    number: 19,
    title: 'Bounded Gaps Between Primes',
    subtitle: 'From infinity to 246: the Zhang\u2013Maynard\u2013Tao revolution',
    sections: [
        // ================================================================
        // SECTION 1: Motivation — The Twin Prime Conjecture and Beyond
        // ================================================================
        {
            id: 'sec-motivation',
            title: 'The Twin Prime Conjecture',
            content: `
<h2>The Twin Prime Conjecture and Beyond</h2>

<div class="env-block intuition">
    <div class="env-title">A Question as Old as Number Theory</div>
    <div class="env-body">
        <p>The primes 2, 3, 5, 7, 11, 13, ... grow ever sparser among the integers. The Prime Number Theorem tells us the "average gap" between consecutive primes near \\(x\\) is about \\(\\log x\\), which tends to infinity. Yet pairs of primes differing by just 2 keep appearing: \\((3,5), (5,7), (11,13), (17,19), (29,31), (41,43), \\ldots\\) Are there infinitely many such <em>twin primes</em>?</p>
    </div>
</div>

<p>The twin prime conjecture is one of the oldest open problems in mathematics: it asserts that there are infinitely many primes \\(p\\) such that \\(p+2\\) is also prime. Despite centuries of effort, this remains unproven. But in 2013, the mathematical world witnessed a breakthrough that brought us closer than ever.</p>

<div class="env-block definition">
    <div class="env-title">Definition (Prime Gaps)</div>
    <div class="env-body">
        <p>Let \\(p_n\\) denote the \\(n\\)-th prime. The <strong>\\(n\\)-th prime gap</strong> is \\(g_n = p_{n+1} - p_n\\). We define</p>
        \\[H_1 = \\liminf_{n \\to \\infty} (p_{n+1} - p_n).\\]
        <p>The twin prime conjecture asserts \\(H_1 = 2\\). More generally, for \\(m \\geq 1\\),</p>
        \\[H_m = \\liminf_{n \\to \\infty} (p_{n+m} - p_n)\\]
        <p>measures how close \\(m+1\\) consecutive primes can cluster. The <strong>prime \\(k\\)-tuples conjecture</strong> (Hardy-Littlewood, 1923) predicts the exact values.</p>
    </div>
</div>

<p>Before 2013, mathematicians could not even prove that \\(H_1 < \\infty\\), i.e., that there exists <em>any</em> finite bound on how close consecutive primes must recurrently appear. Yitang Zhang changed everything.</p>

<h3>Historical Timeline</h3>

<p>The story of bounded gaps unfolds in several acts:</p>

<ul>
    <li><strong>1849</strong>: de Polignac conjectures that for every even \\(k\\), there are infinitely many prime pairs \\((p, p+k)\\).</li>
    <li><strong>1915</strong>: Viggo Brun proves that the sum \\(\\sum_{p,\\,p+2\\text{ prime}} 1/p\\) converges (so twin primes, if infinite, are sparse). His sieve is the first of its kind.</li>
    <li><strong>1940</strong>: Erd\\H{o}s proves \\(\\liminf g_n / \\log p_n < 1\\), i.e., infinitely often the gap is smaller than the average.</li>
    <li><strong>2005</strong>: Goldston-Pintz-Y\\i{}ld\\i{}r\\i{}m (GPY) show \\(\\liminf g_n / \\log p_n = 0\\), and conditionally \\(H_1 \\leq 16\\) under Elliott-Halberstam.</li>
    <li><strong>2013 (April)</strong>: <strong>Yitang Zhang</strong> proves \\(H_1 \\leq 70{,}000{,}000\\). The first unconditional finite bound.</li>
    <li><strong>2013 (Nov)</strong>: James <strong>Maynard</strong> (independently, Terence <strong>Tao</strong>) proves \\(H_1 \\leq 600\\), and moreover \\(H_m < \\infty\\) for all \\(m\\).</li>
    <li><strong>2014</strong>: The Polymath 8 project (a massive online collaboration) reduces the bound to \\(H_1 \\leq 246\\).</li>
</ul>

<div class="viz-placeholder" data-viz="viz-bounded-gap-timeline"></div>

<div class="env-block remark">
    <div class="env-title">The Gap to 2</div>
    <div class="env-body">
        <p>The current bound \\(H_1 \\leq 246\\) means: infinitely often, two primes are separated by at most 246. But 246 is not 2, and closing this gap seems to require fundamentally new ideas. The parity barrier in sieve theory (see Chapter 12) prevents these methods from detecting the difference between 0 and 2 prime factors, making a proof of the twin prime conjecture by sieve methods alone appear impossible.</p>
    </div>
</div>
`,
            visualizations: [
                {
                    id: 'viz-bounded-gap-timeline',
                    title: 'Timeline of Bounded Gap Results',
                    description: 'The dramatic collapse of the bounded gap constant \\(H_1\\) from infinity to 246. Each bar shows the best known upper bound at that point in time. Note the logarithmic scale.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 700, height: 400,
                            originX: 0, originY: 0, scale: 1
                        });

                        var milestones = [
                            { year: 'Pre-2013', bound: Infinity, label: 'H\u2081 = \u221E?', color: viz.colors.text },
                            { year: 'Zhang\n2013 Apr', bound: 70000000, label: '70,000,000', color: viz.colors.blue },
                            { year: 'Polymath\n2013 Jun', bound: 4680, label: '4,680', color: viz.colors.teal },
                            { year: 'Maynard\n2013 Nov', bound: 600, label: '600', color: viz.colors.orange },
                            { year: 'Polymath 8b\n2014', bound: 246, label: '246', color: viz.colors.green },
                            { year: 'Twin Prime\nConjecture', bound: 2, label: '2 (?)', color: viz.colors.pink }
                        ];

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var left = 100, right = viz.width - 40;
                            var top = 50, bottom = viz.height - 70;
                            var barW = Math.min(60, (right - left) / milestones.length - 20);
                            var chartH = bottom - top;

                            viz.screenText('The Collapse of H\u2081', viz.width / 2, 22, viz.colors.white, 16);
                            viz.screenText('(log scale)', 50, top + chartH / 2, viz.colors.text, 10);

                            // log scale: map log10(bound) to pixel height
                            var maxLog = 8; // 10^8

                            // y-axis labels
                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '10px -apple-system,sans-serif';
                            ctx.textAlign = 'right';
                            ctx.textBaseline = 'middle';
                            for (var p = 0; p <= maxLog; p += 2) {
                                var yy = bottom - (p / maxLog) * chartH;
                                ctx.fillStyle = viz.colors.text;
                                ctx.fillText('10' + (p === 0 ? '\u2070' : p === 2 ? '\u00B2' : p === 4 ? '\u2074' : p === 6 ? '\u2076' : '\u2078'), left - 10, yy);
                                ctx.strokeStyle = viz.colors.grid;
                                ctx.lineWidth = 0.5;
                                ctx.beginPath();
                                ctx.moveTo(left, yy);
                                ctx.lineTo(right, yy);
                                ctx.stroke();
                            }

                            for (var i = 0; i < milestones.length; i++) {
                                var m = milestones[i];
                                var cx = left + (i + 0.5) * (right - left) / milestones.length;

                                if (isFinite(m.bound)) {
                                    var logB = Math.log10(Math.max(m.bound, 1));
                                    var h = (logB / maxLog) * chartH;
                                    ctx.fillStyle = m.color + 'aa';
                                    ctx.fillRect(cx - barW / 2, bottom - h, barW, h);
                                    ctx.strokeStyle = m.color;
                                    ctx.lineWidth = 1.5;
                                    ctx.strokeRect(cx - barW / 2, bottom - h, barW, h);

                                    // bound label
                                    ctx.fillStyle = m.color;
                                    ctx.font = 'bold 11px -apple-system,sans-serif';
                                    ctx.textAlign = 'center';
                                    ctx.textBaseline = 'bottom';
                                    ctx.fillText(m.label, cx, bottom - h - 4);
                                } else {
                                    // infinity: draw a dashed arrow going up
                                    ctx.strokeStyle = m.color;
                                    ctx.lineWidth = 2;
                                    ctx.setLineDash([4, 4]);
                                    ctx.beginPath();
                                    ctx.moveTo(cx, bottom);
                                    ctx.lineTo(cx, top + 10);
                                    ctx.stroke();
                                    ctx.setLineDash([]);
                                    // arrow
                                    ctx.fillStyle = m.color;
                                    ctx.beginPath();
                                    ctx.moveTo(cx, top + 5);
                                    ctx.lineTo(cx - 5, top + 15);
                                    ctx.lineTo(cx + 5, top + 15);
                                    ctx.closePath();
                                    ctx.fill();
                                    ctx.font = 'bold 12px -apple-system,sans-serif';
                                    ctx.textAlign = 'center';
                                    ctx.textBaseline = 'bottom';
                                    ctx.fillText('\u221E', cx, top + 2);
                                }

                                // year label
                                ctx.fillStyle = viz.colors.text;
                                ctx.font = '10px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.textBaseline = 'top';
                                var lines = m.year.split('\n');
                                for (var li = 0; li < lines.length; li++) {
                                    ctx.fillText(lines[li], cx, bottom + 8 + li * 13);
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
                    question: 'The average gap between consecutive primes near \\(N\\) is approximately \\(\\log N\\). At \\(N = 10^{100}\\), what is the average gap? How does this compare with \\(H_1 \\leq 246\\)?',
                    hint: 'Compute \\(\\log(10^{100}) = 100 \\log 10 \\approx 230\\). The bound \\(H_1 \\leq 246\\) says gaps of size at most 246 occur infinitely often.',
                    solution: 'The average gap near \\(10^{100}\\) is \\(\\log(10^{100}) = 100 \\ln 10 \\approx 230.3\\). So near \\(10^{100}\\), the average gap is about 230, and \\(H_1 \\leq 246\\) says gaps \\(\\leq 246\\) occur infinitely often. Near \\(10^{100}\\), the "bounded gap" result is saying roughly that gaps near the average size recur. But this holds for <em>all</em> \\(N\\), meaning small gaps never permanently disappear.'
                }
            ]
        },

        // ================================================================
        // SECTION 2: The GPY Method
        // ================================================================
        {
            id: 'sec-gpy',
            title: 'The GPY Sieve',
            content: `
<h2>The Goldston-Pintz-Y\\i{}ld\\i{}r\\i{}m Method</h2>

<div class="env-block intuition">
    <div class="env-title">The Core Idea</div>
    <div class="env-body">
        <p>Sieve methods (Chapters 11-13) typically try to detect primes by removing composites. The GPY approach does something subtler: instead of sieving for individual primes, it constructs a <em>weighted</em> sum over an admissible set of linear forms, chosen so that if the sum is large enough, at least two of the forms must simultaneously be prime. The key innovation is a specific choice of "smooth" sieve weights that can be analyzed using the Bombieri-Vinogradov theorem.</p>
    </div>
</div>

<h3>Admissible Tuples</h3>

<div class="env-block definition">
    <div class="env-title">Definition (Admissible \\(k\\)-Tuple)</div>
    <div class="env-body">
        <p>A set \\(\\mathcal{H} = \\{h_1, h_2, \\ldots, h_k\\}\\) of distinct non-negative integers is called <strong>admissible</strong> if for every prime \\(p\\), the set \\(\\mathcal{H}\\) does not cover all residue classes modulo \\(p\\). Equivalently,</p>
        \\[\\nu_p(\\mathcal{H}) := |\\{h \\bmod p : h \\in \\mathcal{H}\\}| < p \\quad \\text{for all primes } p.\\]
    </div>
</div>

<p>The admissibility condition is necessary: if \\(\\mathcal{H}\\) covers all residues mod some prime \\(p\\), then for any \\(n\\), at least one of \\(n+h_1, \\ldots, n+h_k\\) is divisible by \\(p\\), so the tuple \\((n+h_1, \\ldots, n+h_k)\\) cannot all be prime (for \\(n\\) large enough).</p>

<div class="env-block example">
    <div class="env-title">Example: Admissibility Check</div>
    <div class="env-body">
        <p>Is \\(\\mathcal{H} = \\{0, 2, 6\\}\\) admissible?</p>
        <ul>
            <li>Mod 2: \\(\\{0, 0, 0\\}\\) covers 1 class out of 2. \\(\\checkmark\\)</li>
            <li>Mod 3: \\(\\{0, 2, 0\\}\\) covers 2 classes out of 3. \\(\\checkmark\\)</li>
            <li>Mod 5: \\(\\{0, 2, 1\\}\\) covers 3 classes out of 5. \\(\\checkmark\\)</li>
            <li>For \\(p \\geq 4 > k = 3\\), the tuple has at most 3 residues mod \\(p < p\\). \\(\\checkmark\\)</li>
        </ul>
        <p>Yes, \\(\\{0,2,6\\}\\) is admissible. Indeed, \\(n = 5\\) gives primes \\(5, 7, 11\\), and \\(n = 11\\) gives \\(11, 13, 17\\).</p>
        <p>In contrast, \\(\\{0, 2, 4\\}\\) is <em>not</em> admissible: mod 3 we get \\(\\{0, 2, 1\\}\\), which covers all 3 classes. So among any three consecutive even-spaced numbers \\(n, n+2, n+4\\), one is always divisible by 3.</p>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-admissible-tuples"></div>

<h3>The GPY Sieve Weights</h3>

<p>Let \\(\\mathcal{H} = \\{h_1, \\ldots, h_k\\}\\) be an admissible \\(k\\)-tuple. For a parameter \\(R\\) and a smooth function \\(F\\) supported on the simplex \\(\\{(t_1, \\ldots, t_k) : t_i \\geq 0,\\, \\sum t_i \\leq 1\\}\\), define weights:</p>

\\[\\lambda_d = \\mu(d) \\left(\\frac{\\log(R/d)}{\\log R}\\right)^k\\]

<p>for squarefree \\(d\\) dividing \\(\\prod_{i=1}^k (n + h_i)\\), and \\(\\lambda_d = 0\\) otherwise. The GPY strategy studies the sum:</p>

\\[S = \\sum_{N \\leq n \\leq 2N} \\left(\\sum_{i=1}^k \\mathbf{1}_{\\text{prime}}(n+h_i) - \\rho \\right) w(n)^2\\]

<p>where \\(w(n) = \\sum_{d \\mid \\prod(n+h_i)} \\lambda_d\\) and \\(\\rho\\) is a threshold. If \\(S > 0\\), then for some \\(n\\), at least \\(\\lceil \\rho \\rceil + 1\\) of the \\(n + h_i\\) are prime simultaneously.</p>

<div class="viz-placeholder" data-viz="viz-gpy-weights"></div>

<div class="env-block theorem">
    <div class="env-title">Theorem 19.1 (GPY, 2005)</div>
    <div class="env-body">
        <p>Let \\(\\mathcal{H}\\) be an admissible \\(k\\)-tuple. Under the Bombieri-Vinogradov theorem (Chapter 13), the GPY method yields</p>
        \\[\\liminf_{n \\to \\infty} \\frac{p_{n+1} - p_n}{\\log p_n} = 0.\\]
        <p>Moreover, if the Elliott-Halberstam conjecture (level of distribution \\(\\vartheta = 1\\)) holds, then \\(H_1 \\leq 16\\).</p>
    </div>
</div>

<div class="env-block remark">
    <div class="env-title">What Was Missing</div>
    <div class="env-body">
        <p>The GPY argument falls just short of proving \\(H_1 < \\infty\\) unconditionally. The Bombieri-Vinogradov theorem provides a level of distribution \\(\\vartheta = 1/2\\), but GPY needs \\(\\vartheta > 1/2\\) to beat the "trivial" threshold. Zhang's breakthrough was to show that a slightly stronger-than-BV result holds for <em>smooth</em> moduli, which sufficed.</p>
    </div>
</div>
`,
            visualizations: [
                {
                    id: 'viz-admissible-tuples',
                    title: 'Admissible Tuple Checker',
                    description: 'Enter a set of non-negative integers (comma-separated) and check whether the tuple is admissible. The tool checks each prime \\(p \\leq k\\) and highlights any obstruction.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 650, height: 380,
                            originX: 0, originY: 0, scale: 1
                        });

                        var currentTuple = [0, 2, 6, 8, 12];
                        var inputEl = document.createElement('input');
                        inputEl.type = 'text';
                        inputEl.value = '0, 2, 6, 8, 12';
                        inputEl.style.cssText = 'width:200px;padding:4px 8px;border:1px solid #30363d;border-radius:4px;background:#1a1a40;color:#c9d1d9;font-size:0.85rem;margin-right:8px;';
                        controls.appendChild(inputEl);

                        var checkBtn = VizEngine.createButton(controls, 'Check', function() {
                            var parts = inputEl.value.split(',').map(function(s) { return parseInt(s.trim()); }).filter(function(n) { return !isNaN(n) && n >= 0; });
                            if (parts.length < 2) return;
                            currentTuple = parts.sort(function(a, b) { return a - b; });
                            draw();
                        });

                        // Preset buttons
                        var presets = [
                            { label: '{0,2} twin', val: [0, 2] },
                            { label: '{0,2,6}', val: [0, 2, 6] },
                            { label: '{0,2,6,8,12}', val: [0, 2, 6, 8, 12] },
                            { label: '{0,4,6,10,12,16}', val: [0, 4, 6, 10, 12, 16] },
                            { label: '{0,2,4} NOT', val: [0, 2, 4] }
                        ];
                        presets.forEach(function(pr) {
                            VizEngine.createButton(controls, pr.label, function() {
                                currentTuple = pr.val.slice();
                                inputEl.value = currentTuple.join(', ');
                                draw();
                            });
                        });

                        function sievePrimesSmall(max) {
                            var s = new Uint8Array(max + 1);
                            var p = [];
                            for (var i = 2; i <= max; i++) {
                                if (!s[i]) { p.push(i); for (var j = i * i; j <= max; j += i) s[j] = 1; }
                            }
                            return p;
                        }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var k = currentTuple.length;

                            viz.screenText('Admissibility of {' + currentTuple.join(', ') + '}', viz.width / 2, 22, viz.colors.white, 14);
                            viz.screenText('k = ' + k, viz.width / 2, 42, viz.colors.text, 12);

                            // Check each prime p up to max needed
                            var maxCheck = Math.max(k + 5, currentTuple[currentTuple.length - 1] + 1);
                            var primes = sievePrimesSmall(maxCheck);
                            var results = [];
                            var admissible = true;

                            for (var pi = 0; pi < primes.length; pi++) {
                                var p = primes[pi];
                                if (p > maxCheck) break;
                                var residues = {};
                                var count = 0;
                                for (var hi = 0; hi < k; hi++) {
                                    var r = ((currentTuple[hi] % p) + p) % p;
                                    if (!residues[r]) { residues[r] = true; count++; }
                                }
                                var pass = count < p;
                                results.push({ p: p, count: count, pass: pass });
                                if (!pass) admissible = false;
                                if (p > k + 2 && pass) break; // for p > k, always passes (at most k < p residues)
                            }

                            // Draw results table
                            var startY = 65;
                            var rowH = 24;
                            var colW = 90;
                            var cols = Math.min(results.length, 6);
                            var startX = (viz.width - cols * colW) / 2;

                            // Header
                            ctx.fillStyle = viz.colors.text;
                            ctx.font = 'bold 11px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'middle';

                            for (var ri = 0; ri < Math.min(results.length, cols); ri++) {
                                var rx = startX + ri * colW + colW / 2;
                                var res = results[ri];
                                ctx.fillStyle = viz.colors.text;
                                ctx.fillText('p = ' + res.p, rx, startY);

                                // residue classes visualization
                                var cellTop = startY + 18;
                                var cellSize = Math.min(16, (colW - 10) / res.p);
                                var rowStartX = rx - (res.p * cellSize) / 2;

                                // show all residue classes mod p
                                for (var c = 0; c < res.p; c++) {
                                    var occupied = false;
                                    for (var hi2 = 0; hi2 < k; hi2++) {
                                        if (((currentTuple[hi2] % res.p) + res.p) % res.p === c) { occupied = true; break; }
                                    }
                                    var cx2 = rowStartX + c * cellSize + cellSize / 2;
                                    var cy2 = cellTop + cellSize / 2;
                                    if (occupied) {
                                        ctx.fillStyle = res.pass ? viz.colors.teal + 'aa' : viz.colors.red + 'aa';
                                        ctx.fillRect(rowStartX + c * cellSize + 1, cellTop + 1, cellSize - 2, cellSize - 2);
                                    } else {
                                        ctx.strokeStyle = viz.colors.grid;
                                        ctx.lineWidth = 1;
                                        ctx.strokeRect(rowStartX + c * cellSize + 1, cellTop + 1, cellSize - 2, cellSize - 2);
                                    }
                                }

                                // Result text
                                ctx.fillStyle = res.pass ? viz.colors.green : viz.colors.red;
                                ctx.font = '10px -apple-system,sans-serif';
                                ctx.fillText(res.count + '/' + res.p + (res.pass ? ' \u2713' : ' \u2717'), rx, cellTop + cellSize + 14);
                            }

                            // Verdict
                            var verdictY = startY + 80;
                            if (admissible) {
                                viz.screenText('\u2713 ADMISSIBLE', viz.width / 2, verdictY, viz.colors.green, 18);
                                viz.screenText('The Hardy-Littlewood conjecture predicts infinitely many n with all n+h\u1D62 prime', viz.width / 2, verdictY + 22, viz.colors.text, 11);
                            } else {
                                viz.screenText('\u2717 NOT ADMISSIBLE', viz.width / 2, verdictY, viz.colors.red, 18);
                                var obs = results.filter(function(r) { return !r.pass; });
                                viz.screenText('Obstructed at p = ' + obs.map(function(r) { return r.p; }).join(', ') + ': covers all residues', viz.width / 2, verdictY + 22, viz.colors.text, 11);
                            }

                            // Show instances where all entries are prime (search small n)
                            if (admissible) {
                                var instances = [];
                                var allPrimes = sievePrimesSmall(5000);
                                var primeSet = {};
                                for (var pp = 0; pp < allPrimes.length; pp++) primeSet[allPrimes[pp]] = true;
                                for (var n = 1; n <= 5000; n++) {
                                    var allP = true;
                                    for (var ti = 0; ti < k; ti++) {
                                        if (!primeSet[n + currentTuple[ti]]) { allP = false; break; }
                                    }
                                    if (allP) instances.push(n);
                                    if (instances.length >= 8) break;
                                }
                                if (instances.length > 0) {
                                    viz.screenText('Instances (n \u2264 5000): n = ' + instances.join(', '), viz.width / 2, verdictY + 50, viz.colors.blue, 12);
                                    // Show first instance
                                    var n0 = instances[0];
                                    var primeStrs = currentTuple.map(function(h) { return (n0 + h); });
                                    viz.screenText('n = ' + n0 + ':  {' + primeStrs.join(', ') + '} all prime', viz.width / 2, verdictY + 70, viz.colors.teal, 11);
                                }
                            }

                            // Number line showing the tuple
                            var lineY = viz.height - 50;
                            var maxH = currentTuple[currentTuple.length - 1];
                            var lineLeft = 60;
                            var lineRight = viz.width - 60;
                            var lineScale = maxH > 0 ? (lineRight - lineLeft) / maxH : 1;

                            ctx.strokeStyle = viz.colors.axis;
                            ctx.lineWidth = 1;
                            ctx.beginPath();
                            ctx.moveTo(lineLeft, lineY);
                            ctx.lineTo(lineRight, lineY);
                            ctx.stroke();

                            for (var di = 0; di < k; di++) {
                                var dx = lineLeft + currentTuple[di] * lineScale;
                                ctx.fillStyle = admissible ? viz.colors.blue : viz.colors.red;
                                ctx.beginPath();
                                ctx.arc(dx, lineY, 5, 0, Math.PI * 2);
                                ctx.fill();
                                ctx.fillStyle = viz.colors.text;
                                ctx.font = '10px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.textBaseline = 'top';
                                ctx.fillText(currentTuple[di].toString(), dx, lineY + 8);
                            }
                        }
                        draw();
                        return viz;
                    }
                },
                {
                    id: 'viz-gpy-weights',
                    title: 'GPY Weight Function',
                    description: 'The GPY sieve assigns a weight \\(w(n)^2\\) to each integer \\(n\\), designed to be large when many of \\(n+h_1, \\ldots, n+h_k\\) have few small prime factors. The plot shows how the weight concentrates on "almost-prime" values.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 650, height: 360,
                            originX: 70, originY: 310, scale: 1
                        });

                        var kVal = 5;
                        VizEngine.createSlider(controls, 'k (tuple size)', 3, 15, kVal, 1, function(v) {
                            kVal = Math.round(v);
                            draw();
                        });

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            viz.screenText('GPY Weight Profile: \u03BB_d = \u03BC(d)(log(R/d)/log R)\u1D4F', viz.width / 2, 20, viz.colors.white, 13);

                            // Simulate the weight function shape
                            // The Selberg-type weight w(n) ~ (log R / log n)^k peaks at smooth numbers
                            // We visualize the "score" function s(t) = (1-t)^k for t = log d / log R
                            var left = 80, right = viz.width - 40;
                            var top = 50, bottom = 310;
                            var chartW = right - left;
                            var chartH = bottom - top;
                            var steps = 200;

                            // Axes
                            ctx.strokeStyle = viz.colors.axis;
                            ctx.lineWidth = 1;
                            ctx.beginPath();
                            ctx.moveTo(left, bottom);
                            ctx.lineTo(right, bottom);
                            ctx.stroke();
                            ctx.beginPath();
                            ctx.moveTo(left, bottom);
                            ctx.lineTo(left, top);
                            ctx.stroke();

                            viz.screenText('t = log d / log R', viz.width / 2, bottom + 25, viz.colors.text, 11);
                            viz.screenText('\u03BB(t)', left - 30, top + chartH / 2, viz.colors.text, 11);

                            // Draw (1-t)^k
                            ctx.strokeStyle = viz.colors.blue;
                            ctx.lineWidth = 2.5;
                            ctx.beginPath();
                            for (var i = 0; i <= steps; i++) {
                                var t = i / steps;
                                var y = Math.pow(Math.max(0, 1 - t), kVal);
                                var px = left + t * chartW;
                                var py = bottom - y * chartH;
                                if (i === 0) ctx.moveTo(px, py);
                                else ctx.lineTo(px, py);
                            }
                            ctx.stroke();

                            // Shade area
                            ctx.fillStyle = viz.colors.blue + '22';
                            ctx.beginPath();
                            ctx.moveTo(left, bottom);
                            for (var j = 0; j <= steps; j++) {
                                var t2 = j / steps;
                                var y2 = Math.pow(Math.max(0, 1 - t2), kVal);
                                ctx.lineTo(left + t2 * chartW, bottom - y2 * chartH);
                            }
                            ctx.lineTo(right, bottom);
                            ctx.closePath();
                            ctx.fill();

                            // Labels
                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '10px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'top';
                            ctx.fillText('0', left, bottom + 4);
                            ctx.fillText('1', right, bottom + 4);
                            ctx.fillText('0.5', left + chartW / 2, bottom + 4);

                            ctx.textAlign = 'right';
                            ctx.textBaseline = 'middle';
                            ctx.fillText('1', left - 6, top);
                            ctx.fillText('0', left - 6, bottom);

                            // Annotation
                            viz.screenText('(1 - t)^' + kVal, left + chartW * 0.25, top + 30, viz.colors.blue, 12);
                            viz.screenText('Weight concentrates on small d (smooth moduli)', viz.width / 2, bottom + 40, viz.colors.text, 10);
                            viz.screenText('Larger k \u2192 sharper concentration near t = 0', viz.width / 2, bottom + 55, viz.colors.teal, 10);
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Show that \\(\\{0, 2, 4\\}\\) is not admissible. More generally, prove that any set of \\(p\\) consecutive even numbers is not admissible.',
                    hint: 'For \\(\\{0, 2, 4\\}\\), check residues mod 3. For \\(p\\) consecutive even numbers \\(\\{0, 2, 4, \\ldots, 2(p-1)\\}\\), these are \\(\\{0, 2, 4, \\ldots, 2(p-1)\\}\\) mod \\(p\\).',
                    solution: '\\(\\{0, 2, 4\\} \\bmod 3 = \\{0, 2, 1\\}\\), which covers all residues mod 3, so not admissible. For \\(\\{0, 2, \\ldots, 2(p-1)\\}\\) mod \\(p\\): if \\(p\\) is odd, these are \\(2 \\cdot \\{0, 1, \\ldots, p-1\\}\\) mod \\(p\\). Since \\(\\gcd(2, p) = 1\\), multiplication by 2 permutes residues mod \\(p\\), so all \\(p\\) classes are covered. Not admissible.'
                },
                {
                    question: 'Prove that an admissible \\(k\\)-tuple \\(\\mathcal{H}\\) satisfies \\(\\nu_p(\\mathcal{H}) \\leq \\min(k, p-1)\\) for all primes \\(p\\). Why is the condition \\(\\nu_p < p\\) only non-trivial for \\(p \\leq k\\)?',
                    hint: 'The set \\(\\mathcal{H}\\) has \\(k\\) elements, so it hits at most \\(k\\) residue classes mod \\(p\\). If \\(k < p\\), then \\(\\nu_p \\leq k < p\\) automatically.',
                    solution: 'Since \\(|\\mathcal{H}| = k\\), we have \\(\\nu_p(\\mathcal{H}) \\leq k\\). If \\(p > k\\), then \\(\\nu_p \\leq k < p\\), so admissibility holds trivially. Hence one only needs to verify \\(\\nu_p < p\\) for the finitely many primes \\(p \\leq k\\).'
                }
            ]
        },

        // ================================================================
        // SECTION 3: Zhang's Theorem
        // ================================================================
        {
            id: 'sec-zhang',
            title: "Zhang's Breakthrough (2013)",
            content: `
<h2>Zhang's Theorem: Bounded Gaps at Last</h2>

<div class="env-block intuition">
    <div class="env-title">The Crucial Upgrade</div>
    <div class="env-body">
        <p>The GPY method needed the primes to be "well-distributed" in arithmetic progressions slightly beyond what Bombieri-Vinogradov guarantees. Zhang's insight was that such enhanced equidistribution holds when the moduli are <em>smooth</em> (composed of small prime factors). This is enough because the GPY weights naturally concentrate on smooth moduli.</p>
    </div>
</div>

<div class="env-block theorem">
    <div class="env-title">Theorem 19.2 (Zhang, 2013)</div>
    <div class="env-body">
        <p>There are infinitely many pairs of primes differing by at most \\(70{,}000{,}000\\). That is,</p>
        \\[H_1 = \\liminf_{n \\to \\infty}(p_{n+1} - p_n) \\leq 70{,}000{,}000.\\]
    </div>
</div>

<h3>Architecture of Zhang's Proof</h3>

<p>Zhang's proof has three main components:</p>

<h4>1. The GPY Framework with a Twist</h4>

<p>Zhang works with the modified GPY sum, taking an admissible \\(k_0\\)-tuple \\(\\mathcal{H}\\) with \\(k_0 = 3{,}500{,}000\\) and diameter (largest element) at most \\(70{,}000{,}000\\). The key inequality to establish is:</p>

\\[\\sum_{N \\leq n \\leq 2N} w(n)^2 \\cdot \\left(\\sum_{i=1}^{k_0} \\mathbf{1}_{\\text{prime}}(n + h_i)\\right) > \\rho \\sum_{N \\leq n \\leq 2N} w(n)^2\\]

<p>for some \\(\\rho > 1\\). If this holds, then for some \\(n\\), at least two of \\(n + h_1, \\ldots, n + h_{k_0}\\) must be prime, giving a prime gap \\(\\leq \\mathrm{diam}(\\mathcal{H}) \\leq 70{,}000{,}000\\).</p>

<h4>2. Beyond Bombieri-Vinogradov: Smooth Moduli</h4>

<p>The standard Bombieri-Vinogradov theorem (Chapter 13) asserts equidistribution of primes in arithmetic progressions to moduli \\(q \\leq x^{1/2 - \\varepsilon}\\) on average. Zhang proves:</p>

<div class="env-block theorem">
    <div class="env-title">Theorem 19.3 (Zhang's BV Extension for Smooth Moduli)</div>
    <div class="env-body">
        <p>Let \\(y = x^{\\delta}\\) for a small \\(\\delta > 0\\). For moduli \\(q\\) that are \\(y\\)-smooth (all prime factors \\(\\leq y\\)), the Bombieri-Vinogradov bound holds with level of distribution \\(\\vartheta = 1/2 + 1/584\\). Precisely:</p>
        \\[\\sum_{\\substack{q \\leq x^{1/2 + 1/584} \\\\ q \\text{ is } y\\text{-smooth}}} \\max_{(a,q)=1} \\left|\\pi(x;q,a) - \\frac{\\mathrm{li}(x)}{\\varphi(q)}\\right| \\ll \\frac{x}{(\\log x)^A}\\]
        <p>for any \\(A > 0\\).</p>
    </div>
</div>

<p>This tiny gain of \\(1/584\\) over the \\(1/2\\) barrier is what makes everything work.</p>

<h4>3. Three Deep Inputs</h4>

<p>Zhang's proof of the BV extension combines three major results from analytic number theory:</p>

<ol>
    <li><strong>The Weil bound for Kloosterman sums:</strong> \\(|S(m, n; c)| \\leq \\tau(c) \\sqrt{c} \\cdot \\gcd(m, n, c)^{1/2}\\), giving square-root cancellation in character sums.</li>
    <li><strong>The Birch-Bombieri estimate:</strong> Bounds on averages of incomplete Kloosterman sums, extending Weil's bound to incomplete sums.</li>
    <li><strong>Deligne's proof of the Riemann Hypothesis for varieties over finite fields:</strong> Used to control correlations of Kloosterman sums across different moduli.</li>
</ol>

<div class="env-block remark">
    <div class="env-title">Why the Bound Was So Large</div>
    <div class="env-body">
        <p>Zhang's original bound of 70 million was large for two reasons: (1) the admissible tuple \\(\\mathcal{H}\\) needed to be enormous (\\(k_0 = 3{,}500{,}000\\)) because the level-of-distribution gain was tiny (\\(1/584\\)), and (2) finding dense admissible tuples is a non-trivial optimization problem. Larger \\(k_0\\) means larger diameter. Subsequent Polymath refinements reduced \\(k_0\\) by optimizing every constant and improving the level of distribution.</p>
    </div>
</div>

<div class="env-block remark">
    <div class="env-title">Yitang Zhang: A Remarkable Story</div>
    <div class="env-body">
        <p>Zhang's path to his 2013 breakthrough was extraordinary. After completing his PhD in 1991, he spent years outside academia, working at a Subway restaurant and as a delivery worker, among other jobs. He continued doing mathematics in isolation. When he submitted his proof to the Annals of Mathematics in April 2013, at age 58 and without a tenure-track position, the referees recognized it immediately as correct and groundbreaking. He received the Cole Prize, the MacArthur Fellowship, and numerous other honors.</p>
    </div>
</div>
`,
            visualizations: [],
            exercises: [
                {
                    question: 'If the level of distribution can be improved to \\(\\vartheta = 1/2 + \\eta\\) for smooth moduli, explain qualitatively why a larger \\(\\eta\\) allows a smaller tuple size \\(k_0\\) and hence a smaller bound on \\(H_1\\).',
                    hint: 'The GPY analysis requires \\(k_0\\) to be large enough that the "prime detection" sum exceeds a threshold that depends on \\(\\vartheta\\). A larger \\(\\vartheta\\) lowers this threshold.',
                    solution: 'In the GPY framework, the ratio of the "prime" sum to the "weight" sum is roughly \\(\\frac{\\log R}{\\log N}\\) where \\(R \\approx N^{\\vartheta}\\). This ratio must exceed \\(2/k_0\\) (roughly). Since \\(\\log R / \\log N \\approx \\vartheta\\), we need \\(k_0 > 2/\\vartheta\\). A larger \\(\\vartheta\\) directly reduces the required \\(k_0\\). A smaller \\(k_0\\) allows denser admissible tuples with smaller diameter, hence a smaller \\(H_1\\).'
                },
                {
                    question: 'Zhang used an admissible \\(k_0\\)-tuple with \\(k_0 = 3{,}500{,}000\\). The tuple consists of the first \\(k_0\\) primes larger than \\(k_0\\) (shifted to start at 0). Explain why this construction automatically gives an admissible tuple.',
                    hint: 'If \\(p \\leq k_0\\), then all elements of the tuple are primes \\(> k_0 \\geq p\\), so no element is divisible by \\(p\\), meaning residue 0 mod \\(p\\) is never hit.',
                    solution: 'The tuple \\(\\mathcal{H}\\) consists of primes in \\((k_0, 2k_0 \\log k_0]\\) (approximately). For any prime \\(p \\leq k_0\\), every element of \\(\\mathcal{H}\\) is a prime \\(> k_0 \\geq p\\), so no element is \\(\\equiv 0 \\pmod{p}\\). Hence \\(\\nu_p(\\mathcal{H}) \\leq k_0 - 1 < p\\) holds trivially when \\(p > k_0\\), and for \\(p \\leq k_0\\), the tuple avoids residue 0, so \\(\\nu_p \\leq p - 1 < p\\). The tuple is admissible.'
                }
            ]
        },

        // ================================================================
        // SECTION 4: The Maynard-Tao Method (H <= 246)
        // ================================================================
        {
            id: 'sec-maynard-tao',
            title: 'Maynard-Tao: H \u2264 246',
            content: `
<h2>The Maynard-Tao Revolution</h2>

<div class="env-block intuition">
    <div class="env-title">A Fundamentally Better Sieve</div>
    <div class="env-body">
        <p>While Zhang's method was a tour-de-force improvement of GPY, James Maynard (and independently Terence Tao) found a genuinely different approach to the sieve weights. Instead of using one-dimensional Selberg sieve weights \\(\\lambda_d\\), Maynard introduced <em>multidimensional</em> weights that optimize over a function of \\(k\\) variables simultaneously. This produced dramatically better numerics and, crucially, proved that \\(H_m < \\infty\\) for <em>all</em> \\(m\\).</p>
    </div>
</div>

<h3>The Maynard-Tao Sieve</h3>

<p>Let \\(\\mathcal{H} = \\{h_1, \\ldots, h_k\\}\\) be admissible and let \\(F: [0,1]^k \\to \\mathbb{R}\\) be a smooth function supported on the simplex</p>
\\[\\Delta_k = \\{(t_1, \\ldots, t_k) \\in [0,1]^k : t_1 + \\cdots + t_k \\leq 1\\}.\\]

<p>Define weights:</p>
\\[w(n) = \\sum_{\\substack{d_1 \\mid n+h_1 \\\\ \\vdots \\\\ d_k \\mid n+h_k}} \\lambda_{d_1, \\ldots, d_k}\\]

<p>where</p>
\\[\\lambda_{d_1, \\ldots, d_k} = \\mu(d_1) \\cdots \\mu(d_k) \\cdot F\\!\\left(\\frac{\\log d_1}{\\log R}, \\ldots, \\frac{\\log d_k}{\\log R}\\right)\\]

<p>for squarefree \\(d_i\\) with \\(d_1 \\cdots d_k \\leq R\\), and \\(R = N^{\\vartheta/2 - \\varepsilon}\\).</p>

<div class="viz-placeholder" data-viz="viz-maynard-simplex"></div>

<h3>The Key Ratio</h3>

<p>The Maynard-Tao argument reduces to optimizing the ratio:</p>

\\[M_k := \\sup_F \\frac{\\sum_{m=1}^k J_m(F)}{I(F)}\\]

<p>where</p>
\\[I(F) = \\int_{\\Delta_k} F(t_1, \\ldots, t_k)^2 \\, dt_1 \\cdots dt_k,\\]
\\[J_m(F) = \\int_{\\Delta_k^{(m)}} \\left(\\int_0^{1 - t_1 - \\cdots - \\hat{t}_m - \\cdots - t_k} F(t_1, \\ldots, t_k) \\, dt_m \\right)^2 \\prod_{j \\neq m} dt_j,\\]

<p>with \\(\\Delta_k^{(m)}\\) being the projection of \\(\\Delta_k\\) omitting the \\(m\\)-th coordinate. If \\(M_k > 4/\\vartheta\\), then \\(H_1 \\leq \\mathrm{diam}(\\mathcal{H})\\).</p>

<div class="env-block theorem">
    <div class="env-title">Theorem 19.4 (Maynard, 2013; Tao, independently)</div>
    <div class="env-body">
        <p>For the Bombieri-Vinogradov level \\(\\vartheta = 1/2\\):</p>
        <ol>
            <li>\\(M_k > 4/\\vartheta = 8\\) holds for \\(k \\geq 105\\), giving \\(H_1 \\leq 600\\).</li>
            <li>\\(M_k \\to \\infty\\) as \\(k \\to \\infty\\) (in fact, \\(M_k \\geq \\log k - 2\\log\\log k - 2\\)).</li>
            <li>For any \\(m \\geq 1\\), if \\(M_k > 2m(2/\\vartheta)\\), then \\(H_m < \\infty\\). Since \\(M_k \\to \\infty\\), this gives \\(H_m < \\infty\\) for all \\(m\\).</li>
        </ol>
    </div>
</div>

<div class="env-block corollary">
    <div class="env-title">Corollary 19.5</div>
    <div class="env-body">
        <p>For every \\(m \\geq 1\\), there are infinitely many bounded clusters of \\(m+1\\) primes. In particular, infinitely many intervals of bounded length contain 3 primes, 4 primes, or any prescribed number of primes.</p>
    </div>
</div>

<h3>Why Multidimensional Wins</h3>

<p>The GPY weights are <em>one-dimensional</em>: they depend on a single parameter \\(\\sum t_i\\). The Maynard-Tao weights are <em>k-dimensional</em>: the function \\(F(t_1, \\ldots, t_k)\\) can independently favor small divisors of each \\(n + h_i\\). This gives vastly more room for optimization. Concretely:</p>

<table style="width:100%;border-collapse:collapse;margin:1em 0;">
<tr style="border-bottom:1px solid #30363d;">
    <th style="text-align:left;padding:6px;">Method</th>
    <th style="text-align:center;padding:6px;">Needs \\(\\vartheta >\\)</th>
    <th style="text-align:center;padding:6px;">Min \\(k\\) for \\(H_1 < \\infty\\)</th>
    <th style="text-align:center;padding:6px;">Best \\(H_1\\)</th>
</tr>
<tr style="border-bottom:1px solid #1a1a40;">
    <td style="padding:6px;">GPY (standard BV)</td>
    <td style="text-align:center;padding:6px;">1/2</td>
    <td style="text-align:center;padding:6px;">\u221E (fails)</td>
    <td style="text-align:center;padding:6px;">\u221E</td>
</tr>
<tr style="border-bottom:1px solid #1a1a40;">
    <td style="padding:6px;">Zhang (smooth BV)</td>
    <td style="text-align:center;padding:6px;">1/2 (uses 1/2 + 1/584)</td>
    <td style="text-align:center;padding:6px;">3,500,000</td>
    <td style="text-align:center;padding:6px;">70,000,000</td>
</tr>
<tr style="border-bottom:1px solid #1a1a40;">
    <td style="padding:6px;">Maynard-Tao</td>
    <td style="text-align:center;padding:6px;">any \\(\\vartheta > 0\\)</td>
    <td style="text-align:center;padding:6px;">105</td>
    <td style="text-align:center;padding:6px;">600</td>
</tr>
<tr>
    <td style="padding:6px;">Polymath 8b</td>
    <td style="text-align:center;padding:6px;">any \\(\\vartheta > 0\\)</td>
    <td style="text-align:center;padding:6px;">50</td>
    <td style="text-align:center;padding:6px;">246</td>
</tr>
</table>

<p>The Maynard-Tao approach also does not need any beyond-BV input. The standard Bombieri-Vinogradov theorem (\\(\\vartheta = 1/2\\)) suffices. This makes the argument substantially simpler than Zhang's.</p>
`,
            visualizations: [
                {
                    id: 'viz-maynard-simplex',
                    title: 'The Maynard Simplex and Weight Function',
                    description: 'The Maynard sieve optimizes a function \\(F\\) over the simplex \\(\\Delta_k = \\{t_i \\geq 0,\\, \\sum t_i \\leq 1\\}\\). For \\(k=2\\), this is a triangle; for \\(k=3\\), a tetrahedron. The visualization shows \\(k=2\\) with the weight function \\(F(t_1, t_2) = (1-t_1-t_2)^2\\) as a heatmap.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 500, height: 440,
                            originX: 0, originY: 0, scale: 1
                        });

                        var power = 2;
                        VizEngine.createSlider(controls, 'Exponent', 1, 6, power, 1, function(v) {
                            power = Math.round(v);
                            draw();
                        });

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            viz.screenText('F(t\u2081, t\u2082) on \u0394\u2082 = {t\u2081,t\u2082 \u2265 0, t\u2081+t\u2082 \u2264 1}', viz.width / 2, 18, viz.colors.white, 13);

                            // Draw heatmap of F(t1,t2) = (1-t1-t2)^power on the simplex
                            var margin = 80;
                            var size = Math.min(viz.width - 2 * margin, viz.height - margin - 80);
                            var ox = margin;
                            var oy = viz.height - margin;
                            var res = 150;

                            for (var i = 0; i < res; i++) {
                                for (var j = 0; j < res - i; j++) {
                                    var t1 = i / res;
                                    var t2 = j / res;
                                    if (t1 + t2 > 1) continue;
                                    var val = Math.pow(Math.max(0, 1 - t1 - t2), power);

                                    // Map to color (blue to white)
                                    var r = Math.round(12 + val * 80);
                                    var g = Math.round(12 + val * 150);
                                    var b = Math.round(32 + val * 223);
                                    ctx.fillStyle = 'rgb(' + r + ',' + g + ',' + b + ')';

                                    var px = ox + t1 * size;
                                    var py = oy - t2 * size;
                                    var cellW = size / res + 1;
                                    ctx.fillRect(px, py - cellW, cellW, cellW);
                                }
                            }

                            // Draw simplex border
                            ctx.strokeStyle = viz.colors.white;
                            ctx.lineWidth = 2;
                            ctx.beginPath();
                            ctx.moveTo(ox, oy);
                            ctx.lineTo(ox + size, oy);
                            ctx.lineTo(ox, oy - size);
                            ctx.closePath();
                            ctx.stroke();

                            // Axis labels
                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '12px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'top';
                            ctx.fillText('t\u2081', ox + size / 2, oy + 8);
                            ctx.fillText('0', ox, oy + 8);
                            ctx.fillText('1', ox + size, oy + 8);

                            ctx.save();
                            ctx.translate(ox - 15, oy - size / 2);
                            ctx.rotate(-Math.PI / 2);
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'bottom';
                            ctx.fillText('t\u2082', 0, 0);
                            ctx.restore();

                            ctx.textAlign = 'right';
                            ctx.textBaseline = 'middle';
                            ctx.fillText('1', ox - 8, oy - size);
                            ctx.fillText('0', ox - 8, oy);

                            // Label the constraint line
                            ctx.save();
                            ctx.translate(ox + size / 2 + 10, oy - size / 2 - 10);
                            ctx.rotate(-Math.PI / 4);
                            ctx.fillStyle = viz.colors.orange;
                            ctx.font = '11px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText('t\u2081 + t\u2082 = 1', 0, 0);
                            ctx.restore();

                            // Color bar
                            var barX = viz.width - 50;
                            var barH = size;
                            var barW = 15;
                            for (var ci = 0; ci < barH; ci++) {
                                var cv = ci / barH;
                                var cr = Math.round(12 + cv * 80);
                                var cg = Math.round(12 + cv * 150);
                                var cb = Math.round(32 + cv * 223);
                                ctx.fillStyle = 'rgb(' + cr + ',' + cg + ',' + cb + ')';
                                ctx.fillRect(barX, oy - ci, barW, 1);
                            }
                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '10px -apple-system,sans-serif';
                            ctx.textAlign = 'left';
                            ctx.textBaseline = 'bottom';
                            ctx.fillText('0', barX + barW + 4, oy);
                            ctx.textBaseline = 'top';
                            ctx.fillText('1', barX + barW + 4, oy - barH);

                            viz.screenText('F(t\u2081,t\u2082) = (1 - t\u2081 - t\u2082)^' + power, viz.width / 2, viz.height - 30, viz.colors.teal, 12);
                            viz.screenText('Maximum at origin, zero on boundary t\u2081+t\u2082=1', viz.width / 2, viz.height - 12, viz.colors.text, 10);
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'For \\(k = 2\\) and the test function \\(F(t_1, t_2) = (1 - t_1 - t_2)^2\\) on \\(\\Delta_2\\), compute \\(I(F) = \\int_{\\Delta_2} F^2\\, dt_1\\, dt_2\\).',
                    hint: 'Use the substitution \\(u = 1 - t_1 - t_2\\). The simplex \\(\\Delta_2 = \\{t_1, t_2 \\geq 0,\\, t_1 + t_2 \\leq 1\\}\\) can be integrated by first integrating over \\(t_2 \\in [0, 1-t_1]\\), then \\(t_1 \\in [0,1]\\).',
                    solution: '\\(I(F) = \\int_0^1 \\int_0^{1-t_1} (1-t_1-t_2)^4\\, dt_2\\, dt_1\\). Let \\(s = 1-t_1\\). Inner integral: \\(\\int_0^s (s-t_2)^4\\, dt_2 = s^5/5\\). Outer: \\(\\int_0^1 (1-t_1)^5/5\\, dt_1 = 1/(5 \\cdot 6) = 1/30\\). So \\(I(F) = 1/30\\).'
                },
                {
                    question: 'Explain why \\(M_k \\to \\infty\\) as \\(k \\to \\infty\\) implies \\(H_m < \\infty\\) for all \\(m\\).',
                    hint: 'If \\(M_k > 2m \\cdot (2/\\vartheta)\\), the sieve detects \\(m+1\\) primes simultaneously.',
                    solution: 'The Maynard-Tao analysis shows: if \\(M_k > 2m(2/\\vartheta)\\), then for any admissible \\(k\\)-tuple \\(\\mathcal{H}\\), infinitely many \\(n\\) have at least \\(m+1\\) of \\(n+h_1, \\ldots, n+h_k\\) prime. Since \\(M_k \\to \\infty\\), for any fixed \\(m\\), there exists \\(k\\) with \\(M_k > 4m/\\vartheta\\). Choosing such \\(k\\) and any admissible \\(k\\)-tuple gives \\(H_m \\leq \\mathrm{diam}(\\mathcal{H}) < \\infty\\).'
                }
            ]
        },

        // ================================================================
        // SECTION 5: k-Tuples and Constellations
        // ================================================================
        {
            id: 'sec-k-tuples',
            title: 'Prime Constellations',
            content: `
<h2>Prime \\(k\\)-Tuples and Constellations</h2>

<div class="env-block intuition">
    <div class="env-title">Patterns in the Primes</div>
    <div class="env-body">
        <p>Twin primes \\((p, p+2)\\), cousin primes \\((p, p+4)\\), sexy primes \\((p, p+6)\\), and prime triplets \\((p, p+2, p+6)\\) are all instances of <em>prime constellations</em>: fixed patterns that recur among the primes. The Hardy-Littlewood conjecture predicts precise asymptotics for how often each admissible pattern occurs, and the Maynard-Tao theorem confirms that all admissible patterns recur infinitely often (with bounded gaps).</p>
    </div>
</div>

<h3>The Hardy-Littlewood Prime \\(k\\)-Tuples Conjecture</h3>

<div class="env-block theorem">
    <div class="env-title">Conjecture (Hardy-Littlewood, 1923)</div>
    <div class="env-body">
        <p>Let \\(\\mathcal{H} = \\{h_1, \\ldots, h_k\\}\\) be an admissible \\(k\\)-tuple. Then the number of \\(n \\leq x\\) such that all of \\(n+h_1, \\ldots, n+h_k\\) are prime satisfies</p>
        \\[\\pi_{\\mathcal{H}}(x) \\sim \\mathfrak{S}(\\mathcal{H}) \\frac{x}{(\\log x)^k}\\]
        <p>where the <strong>singular series</strong> is</p>
        \\[\\mathfrak{S}(\\mathcal{H}) = \\prod_{p \\text{ prime}} \\frac{1 - \\nu_p(\\mathcal{H})/p}{(1 - 1/p)^k}.\\]
    </div>
</div>

<p>The singular series \\(\\mathfrak{S}(\\mathcal{H})\\) is the "correction factor" that accounts for local divisibility obstructions. When \\(\\mathcal{H}\\) is not admissible, \\(\\mathfrak{S}(\\mathcal{H}) = 0\\) (the product has a zero factor). When \\(\\mathcal{H}\\) is admissible, \\(\\mathfrak{S}(\\mathcal{H}) > 0\\).</p>

<div class="env-block example">
    <div class="env-title">Example: The Twin Prime Constant</div>
    <div class="env-body">
        <p>For twin primes, \\(\\mathcal{H} = \\{0, 2\\}\\). Then \\(\\nu_p = 1\\) for \\(p = 2\\) (both are even or odd) and \\(\\nu_p = 2\\) for \\(p \\geq 3\\). The singular series is:</p>
        \\[\\mathfrak{S}(\\{0,2\\}) = \\prod_{p \\geq 3} \\frac{1 - 2/p}{(1 - 1/p)^2} = 2 \\prod_{p \\geq 3} \\frac{p(p-2)}{(p-1)^2} \\approx 1.3203.\\]
        <p>This is twice the <strong>twin prime constant</strong> \\(C_2 \\approx 0.6602\\). The conjecture predicts \\(\\pi_2(x) \\sim 2C_2 \\cdot x/(\\log x)^2\\).</p>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-prime-constellations"></div>

<h3>Known Prime Constellations</h3>

<p>Some notable admissible patterns and their names:</p>

<table style="width:100%;border-collapse:collapse;margin:1em 0;">
<tr style="border-bottom:1px solid #30363d;">
    <th style="text-align:left;padding:6px;">Name</th>
    <th style="text-align:left;padding:6px;">Pattern \\(\\mathcal{H}\\)</th>
    <th style="text-align:center;padding:6px;">\\(k\\)</th>
    <th style="text-align:left;padding:6px;">Smallest instance</th>
</tr>
<tr style="border-bottom:1px solid #1a1a40;">
    <td style="padding:6px;">Twin primes</td>
    <td style="padding:6px;">\\(\\{0, 2\\}\\)</td>
    <td style="text-align:center;padding:6px;">2</td>
    <td style="padding:6px;">\\((3, 5)\\)</td>
</tr>
<tr style="border-bottom:1px solid #1a1a40;">
    <td style="padding:6px;">Cousin primes</td>
    <td style="padding:6px;">\\(\\{0, 4\\}\\)</td>
    <td style="text-align:center;padding:6px;">2</td>
    <td style="padding:6px;">\\((3, 7)\\)</td>
</tr>
<tr style="border-bottom:1px solid #1a1a40;">
    <td style="padding:6px;">Sexy primes</td>
    <td style="padding:6px;">\\(\\{0, 6\\}\\)</td>
    <td style="text-align:center;padding:6px;">2</td>
    <td style="padding:6px;">\\((5, 11)\\)</td>
</tr>
<tr style="border-bottom:1px solid #1a1a40;">
    <td style="padding:6px;">Prime triplet (type I)</td>
    <td style="padding:6px;">\\(\\{0, 2, 6\\}\\)</td>
    <td style="text-align:center;padding:6px;">3</td>
    <td style="padding:6px;">\\((5, 7, 11)\\)</td>
</tr>
<tr style="border-bottom:1px solid #1a1a40;">
    <td style="padding:6px;">Prime triplet (type II)</td>
    <td style="padding:6px;">\\(\\{0, 4, 6\\}\\)</td>
    <td style="text-align:center;padding:6px;">3</td>
    <td style="padding:6px;">\\((7, 11, 13)\\)</td>
</tr>
<tr style="border-bottom:1px solid #1a1a40;">
    <td style="padding:6px;">Prime quadruplet</td>
    <td style="padding:6px;">\\(\\{0, 2, 6, 8\\}\\)</td>
    <td style="text-align:center;padding:6px;">4</td>
    <td style="padding:6px;">\\((5, 7, 11, 13)\\)</td>
</tr>
<tr>
    <td style="padding:6px;">Prime quintuplet</td>
    <td style="padding:6px;">\\(\\{0, 2, 6, 8, 12\\}\\)</td>
    <td style="text-align:center;padding:6px;">5</td>
    <td style="padding:6px;">\\((5, 7, 11, 13, 17)\\)</td>
</tr>
</table>

<div class="env-block remark">
    <div class="env-title">Dense Admissible Tuples</div>
    <div class="env-body">
        <p>For the Polymath 8b bound of \\(H_1 \\leq 246\\), one needs an admissible 50-tuple \\(\\mathcal{H}\\) with \\(\\mathrm{diam}(\\mathcal{H}) \\leq 246\\). Finding the densest admissible tuples is a challenging optimization problem. The best known 50-tuple with diameter 246 was constructed by exhaustive search, confirming that such a tuple exists.</p>
    </div>
</div>
`,
            visualizations: [
                {
                    id: 'viz-prime-constellations',
                    title: 'Prime Constellations Finder',
                    description: 'Explore how various prime constellations appear among the first primes. Select a constellation type and see where it occurs on the number line.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 700, height: 380,
                            originX: 0, originY: 0, scale: 1
                        });

                        var patterns = {
                            'Twins {0,2}': [0, 2],
                            'Cousins {0,4}': [0, 4],
                            'Sexy {0,6}': [0, 6],
                            'Triplet I {0,2,6}': [0, 2, 6],
                            'Triplet II {0,4,6}': [0, 4, 6],
                            'Quadruplet {0,2,6,8}': [0, 2, 6, 8],
                            'Quintuplet {0,2,6,8,12}': [0, 2, 6, 8, 12]
                        };
                        var patternNames = Object.keys(patterns);
                        var currentPattern = 0;

                        var select = document.createElement('select');
                        select.style.cssText = 'padding:4px 8px;border:1px solid #30363d;border-radius:4px;background:#1a1a40;color:#c9d1d9;font-size:0.8rem;';
                        patternNames.forEach(function(name, i) {
                            var opt = document.createElement('option');
                            opt.value = i;
                            opt.textContent = name;
                            select.appendChild(opt);
                        });
                        select.addEventListener('change', function() {
                            currentPattern = parseInt(select.value);
                            draw();
                        });
                        controls.appendChild(select);

                        var maxN = 500;
                        VizEngine.createSlider(controls, 'Search up to', 100, 2000, maxN, 100, function(v) {
                            maxN = Math.round(v);
                            draw();
                        });

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var H = patterns[patternNames[currentPattern]];
                            var k = H.length;

                            // Find all primes up to maxN + max(H)
                            var maxH = H[H.length - 1];
                            var primes = VizEngine.sievePrimes(maxN + maxH);
                            var primeSet = {};
                            for (var i = 0; i < primes.length; i++) primeSet[primes[i]] = true;

                            // Find instances
                            var instances = [];
                            for (var n = 2; n <= maxN; n++) {
                                var allPrime = true;
                                for (var j = 0; j < k; j++) {
                                    if (!primeSet[n + H[j]]) { allPrime = false; break; }
                                }
                                if (allPrime) instances.push(n);
                            }

                            viz.screenText(patternNames[currentPattern], viz.width / 2, 18, viz.colors.white, 15);
                            viz.screenText(instances.length + ' instances found for n \u2264 ' + maxN, viz.width / 2, 40, viz.colors.teal, 12);

                            // Draw number line with instances highlighted
                            var lineTop = 65;
                            var lineH = viz.height - lineTop - 30;
                            var rowH = 22;
                            var maxRows = Math.floor(lineH / rowH);
                            var cols = 10;
                            var colW = (viz.width - 40) / cols;

                            var showInstances = instances.slice(0, maxRows * cols);

                            for (var si = 0; si < showInstances.length; si++) {
                                var row = Math.floor(si / cols);
                                var col = si % cols;
                                var px = 20 + col * colW;
                                var py = lineTop + row * rowH;

                                var inst = showInstances[si];
                                var tupleStr = '(' + H.map(function(h) { return inst + h; }).join(', ') + ')';

                                ctx.fillStyle = viz.colors.blue;
                                ctx.font = '10px -apple-system,sans-serif';
                                ctx.textAlign = 'left';
                                ctx.textBaseline = 'middle';
                                ctx.fillText(tupleStr, px, py);
                            }

                            if (instances.length > showInstances.length) {
                                viz.screenText('... and ' + (instances.length - showInstances.length) + ' more', viz.width / 2, viz.height - 10, viz.colors.text, 11);
                            }

                            // Density info
                            if (instances.length > 1) {
                                var density = instances.length / (maxN / Math.pow(Math.log(maxN), k));
                                viz.screenText('Observed count / predicted scale: ' + density.toFixed(2), viz.width / 2, 56, viz.colors.text, 10);
                            }
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Compute the singular series \\(\\mathfrak{S}(\\{0, 2, 6\\})\\) for the prime triplet \\((p, p+2, p+6)\\). Show that \\(\\nu_2 = 1\\) and \\(\\nu_3 = 2\\), and compute the first few Euler factors.',
                    hint: 'Mod 2: \\(\\{0, 0, 0\\}\\), so \\(\\nu_2 = 1\\). Mod 3: \\(\\{0, 2, 0\\}\\), so \\(\\nu_3 = 2\\). For \\(p \\geq 5\\): \\(\\nu_p = 3\\). The Euler factor at \\(p\\) is \\(\\frac{1 - \\nu_p/p}{(1-1/p)^3}\\).',
                    solution: 'Mod 2: \\(\\{0,0,0\\}\\), \\(\\nu_2 = 1\\). Factor: \\(\\frac{1-1/2}{(1/2)^3} = 4\\). Mod 3: \\(\\{0,2,0\\}\\), \\(\\nu_3 = 2\\). Factor: \\(\\frac{1-2/3}{(2/3)^3} = \\frac{1/3}{8/27} = 9/8\\). Mod 5: \\(\\{0,2,1\\}\\), \\(\\nu_5 = 3\\). Factor: \\(\\frac{1-3/5}{(4/5)^3} = \\frac{2/5}{64/125} = 50/64 = 25/32\\). So \\(\\mathfrak{S} = 4 \\cdot \\frac{9}{8} \\cdot \\frac{25}{32} \\cdots\\). Numerically, \\(\\mathfrak{S}(\\{0,2,6\\}) \\approx 2.858\\).'
                },
                {
                    question: 'Show that if \\(\\mathcal{H}\\) is not admissible (i.e., \\(\\nu_p(\\mathcal{H}) = p\\) for some prime \\(p\\)), then \\(\\mathfrak{S}(\\mathcal{H}) = 0\\).',
                    hint: 'Look at the Euler factor at the obstructing prime.',
                    solution: 'If \\(\\nu_p(\\mathcal{H}) = p\\) for some prime \\(p\\), then the factor \\((1 - \\nu_p/p) = (1 - p/p) = 0\\). Since the singular series is a product including this factor, \\(\\mathfrak{S}(\\mathcal{H}) = 0\\). This is consistent: the tuple is not admissible, so the conjecture predicts \\(\\pi_{\\mathcal{H}}(x) \\sim 0\\), i.e., only finitely many instances.'
                }
            ]
        },

        // ================================================================
        // SECTION 6: Bridge to the Frontier
        // ================================================================
        {
            id: 'sec-bridge',
            title: 'The Road Forward',
            content: `
<h2>From 246 to 2: The Remaining Frontier</h2>

<div class="env-block intuition">
    <div class="env-title">What Has Been Achieved and What Remains</div>
    <div class="env-body">
        <p>The Zhang-Maynard-Tao revolution established that the gap between consecutive primes does not grow without bound: gaps of bounded size recur infinitely often. But the gap from \\(H_1 \\leq 246\\) to the twin prime conjecture \\(H_1 = 2\\) remains vast, and current methods face a fundamental obstruction.</p>
    </div>
</div>

<h3>The Polymath Project</h3>

<p>Polymath 8, organized by Terence Tao, was one of the most successful examples of massively collaborative mathematics. It proceeded in two phases:</p>

<ul>
    <li><strong>Polymath 8a</strong> (June-July 2013): Optimized Zhang's original approach, reducing the bound from 70,000,000 to 4,680. The improvements came from: (i) sharper numerical estimates for Kloosterman sum bounds, (ii) better choices of admissible tuples, (iii) improved level-of-distribution results for smooth moduli.</li>
    <li><strong>Polymath 8b</strong> (November 2013 onward): Adopted the Maynard-Tao framework. The main optimizations were: (i) numerical computation of \\(M_k\\) via variational methods, (ii) construction of dense admissible tuples by computer search, (iii) careful bookkeeping of error terms. The final result: \\(H_1 \\leq 246\\).</li>
</ul>

<div class="viz-placeholder" data-viz="viz-polymath-collaboration"></div>

<h3>The Parity Barrier</h3>

<p>The fundamental obstruction to reaching \\(H_1 = 2\\) is the <strong>parity problem</strong> in sieve theory. This is not a technical difficulty but a theorem:</p>

<div class="env-block theorem">
    <div class="env-title">Theorem 19.6 (Selberg's Parity Barrier, informal)</div>
    <div class="env-body">
        <p>Sieve methods that only use information about the "size" of divisor sums (not their parity) cannot distinguish between numbers with an even number of prime factors and those with an odd number. In particular, such methods cannot prove the twin prime conjecture, nor can they prove that \\(H_1 \\leq 6\\).</p>
    </div>
</div>

<p>More precisely, any sieve argument in the Selberg-type framework satisfies a "parity constraint": the sieve cannot tell whether \\(n\\) has an even or odd number of prime factors. Since proving \\(n + 2\\) is prime requires detecting that it has exactly one prime factor (odd parity), pure sieve methods face an inherent limitation.</p>

<div class="env-block remark">
    <div class="env-title">The 6 vs. 2 Gap</div>
    <div class="env-body">
        <p>Current methods can approach \\(H_1 \\leq 6\\) (under the generalized Elliott-Halberstam conjecture) but not \\(H_1 \\leq 2\\). The obstruction at 6 is related to the structure of admissible pairs: \\(\\{0, 2\\}\\), \\(\\{0, 4\\}\\), and \\(\\{0, 6\\}\\) are all admissible 2-tuples, and the sieve cannot distinguish which gap actually occurs. The Maynard-Tao method shows one of these gaps recurs infinitely, but not which one.</p>
    </div>
</div>

<h3>Beyond Bounded Gaps</h3>

<p>The bounded gaps result has inspired several directions of current research:</p>

<ol>
    <li><strong>Large gaps between primes:</strong> Complementing bounded gaps, Ford, Green, Konyagin, Maynard, and Tao (2014) proved that \\(\\limsup g_n / \\log p_n \\cdot \\frac{\\log\\log\\log p_n}{(\\log\\log p_n)^2} \\geq c > 0\\), showing that large gaps also have structure.</li>
    <li><strong>Primes in arithmetic progressions:</strong> The Maynard-Tao method has been extended to show bounded gaps between primes in specific residue classes \\(a \\pmod{q}\\).</li>
    <li><strong>Narrow admissible tuples:</strong> Optimizing the diameter of admissible \\(k\\)-tuples for small \\(k\\) connects to the "prime constellation race" in computational number theory.</li>
    <li><strong>Higher-dimensional sieves:</strong> The success of Maynard's multidimensional weights suggests that further innovations in sieve design could yield new breakthroughs.</li>
</ol>

<h3>What Would It Take to Prove the Twin Prime Conjecture?</h3>

<p>Several possible paths forward have been identified, each requiring ideas beyond current technology:</p>

<ul>
    <li><strong>Breaking the parity barrier:</strong> Friedlander and Iwaniec showed this is possible in special cases (e.g., primes of the form \\(a^2 + b^4\\)). A general parity-breaking technique would revolutionize analytic number theory.</li>
    <li><strong>Higher-order correlations:</strong> Using information about correlations of arithmetic functions (rather than just averages) could circumvent parity. This connects to the Elliott conjecture on correlations of multiplicative functions.</li>
    <li><strong>Algebraic geometry and automorphic forms:</strong> Deeper connections between L-functions and sieve theory, perhaps via the Langlands program, might provide the missing input.</li>
</ul>

<div class="env-block remark">
    <div class="env-title">Connecting Threads</div>
    <div class="env-body">
        <p>This chapter brings together many strands from the course. The GPY sieve builds on Selberg's sieve (Chapter 12); Zhang's proof uses Bombieri-Vinogradov (Chapter 13) and exponential sum estimates (Chapter 14); the Maynard-Tao method relies on the standard sieve framework. The parity problem connects to zeros of L-functions (Chapter 16) and the structure of multiplicative functions. The road from 246 to 2 likely passes through territories covered in Chapters 17 (automorphic forms) and 21 (open problems).</p>
    </div>
</div>
`,
            visualizations: [
                {
                    id: 'viz-polymath-collaboration',
                    title: 'Polymath 8: Collaborative Bound Reduction',
                    description: 'The Polymath 8 project saw dozens of mathematicians collaborating online to reduce the bounded gap constant. This visualization shows the progression of bounds during the project.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 700, height: 380,
                            originX: 0, originY: 0, scale: 1
                        });

                        // Key milestones in the Polymath progression
                        var data = [
                            { date: 'May 2013', bound: 70000000, phase: '8a', who: 'Zhang' },
                            { date: 'Jun 1', bound: 60000000, phase: '8a', who: 'Polymath' },
                            { date: 'Jun 5', bound: 42342946, phase: '8a', who: 'Polymath' },
                            { date: 'Jun 10', bound: 13008612, phase: '8a', who: 'Polymath' },
                            { date: 'Jun 20', bound: 4802222, phase: '8a', who: 'Polymath' },
                            { date: 'Jul 10', bound: 4680, phase: '8a', who: 'Polymath' },
                            { date: 'Nov 19', bound: 600, phase: '8b', who: 'Maynard' },
                            { date: 'Nov 22', bound: 576, phase: '8b', who: 'Polymath' },
                            { date: 'Dec 2013', bound: 270, phase: '8b', who: 'Polymath' },
                            { date: 'Jan 2014', bound: 252, phase: '8b', who: 'Polymath' },
                            { date: 'Apr 2014', bound: 246, phase: '8b', who: 'Polymath' }
                        ];

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            viz.screenText('Polymath 8: The Race to Reduce H\u2081', viz.width / 2, 20, viz.colors.white, 15);

                            var left = 90, right = viz.width - 30;
                            var top = 50, bottom = viz.height - 50;
                            var chartW = right - left;
                            var chartH = bottom - top;
                            var n = data.length;
                            var maxLog = Math.log10(70000000);

                            // y-axis (log scale)
                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '10px -apple-system,sans-serif';
                            ctx.textAlign = 'right';
                            ctx.textBaseline = 'middle';
                            for (var p = 0; p <= 8; p++) {
                                var yy = bottom - (p / maxLog) * chartH;
                                ctx.fillStyle = viz.colors.text;
                                if (p <= 7) ctx.fillText('10' + ['\u2070', '\u00B9', '\u00B2', '\u00B3', '\u2074', '\u2075', '\u2076', '\u2077'][p], left - 8, yy);
                                ctx.strokeStyle = viz.colors.grid;
                                ctx.lineWidth = 0.5;
                                ctx.beginPath();
                                ctx.moveTo(left, yy);
                                ctx.lineTo(right, yy);
                                ctx.stroke();
                            }

                            // Plot points and connecting line
                            var points = [];
                            for (var i = 0; i < n; i++) {
                                var px = left + (i + 0.5) * chartW / n;
                                var py = bottom - (Math.log10(data[i].bound) / maxLog) * chartH;
                                points.push([px, py]);
                            }

                            // Connecting line
                            ctx.strokeStyle = viz.colors.blue + '88';
                            ctx.lineWidth = 2;
                            ctx.beginPath();
                            for (var j = 0; j < points.length; j++) {
                                if (j === 0) ctx.moveTo(points[j][0], points[j][1]);
                                else ctx.lineTo(points[j][0], points[j][1]);
                            }
                            ctx.stroke();

                            // Points and labels
                            for (var di = 0; di < n; di++) {
                                var d = data[di];
                                var pt = points[di];
                                var color = d.phase === '8a' ? viz.colors.blue : viz.colors.orange;

                                ctx.fillStyle = color;
                                ctx.beginPath();
                                ctx.arc(pt[0], pt[1], 5, 0, Math.PI * 2);
                                ctx.fill();

                                // Bound label
                                ctx.fillStyle = viz.colors.white;
                                ctx.font = '9px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.textBaseline = 'bottom';
                                var boundStr = d.bound >= 1000000 ? (d.bound / 1000000).toFixed(1) + 'M' : d.bound.toLocaleString();
                                ctx.fillText(boundStr, pt[0], pt[1] - 8);

                                // Date label
                                ctx.fillStyle = viz.colors.text;
                                ctx.font = '8px -apple-system,sans-serif';
                                ctx.textBaseline = 'top';
                                ctx.save();
                                ctx.translate(pt[0], bottom + 5);
                                ctx.rotate(Math.PI / 4);
                                ctx.textAlign = 'left';
                                ctx.fillText(d.date, 0, 0);
                                ctx.restore();
                            }

                            // Phase labels
                            var midA = left + 3.5 * chartW / n;
                            var midB = left + 8.5 * chartW / n;
                            viz.screenText('Phase 8a (GPY+Zhang)', midA, top - 5, viz.colors.blue, 10);
                            viz.screenText('Phase 8b (Maynard-Tao)', midB, top - 5, viz.colors.orange, 10);

                            // Phase divider
                            var divX = left + 6.5 * chartW / n;
                            ctx.strokeStyle = viz.colors.text + '44';
                            ctx.lineWidth = 1;
                            ctx.setLineDash([4, 4]);
                            ctx.beginPath();
                            ctx.moveTo(divX, top);
                            ctx.lineTo(divX, bottom);
                            ctx.stroke();
                            ctx.setLineDash([]);
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Explain in your own words what the "parity problem" is and why it prevents sieve methods from proving the twin prime conjecture.',
                    hint: 'Think about what the sieve can detect: it can bound the total number of prime factors but cannot determine whether that count is even or odd. How does this relate to identifying actual primes?',
                    solution: 'Sieve methods bound the number of prime factors of \\(n\\) by weighting \\(n\\) according to its small divisors. These weights are symmetric with respect to the parity (even/odd count) of prime factors. Detecting a prime requires knowing \\(n\\) has exactly 1 prime factor (odd parity), but the sieve treats "1 factor" and "2 factors" similarly. Formally, sieve upper bounds for primes also bound semiprimes (products of two primes), and sieve lower bounds for primes also apply to products of three primes. The twin prime conjecture requires distinguishing \\(n+2\\) being prime from \\(n+2\\) being a product of two primes, which the sieve cannot do.'
                },
                {
                    question: 'Under the Elliott-Halberstam conjecture (level of distribution \\(\\vartheta = 1\\)), the GPY method gives \\(H_1 \\leq 16\\). Under the generalized Elliott-Halberstam conjecture, Maynard showed \\(H_1 \\leq 6\\). Why can we not reach \\(H_1 \\leq 2\\) even under the strongest conjectures about equidistribution?',
                    hint: 'The sieve picks up a gap from the densest admissible 2-tuple. There are three admissible 2-tuples with small diameter: \\(\\{0,2\\}, \\{0,4\\}, \\{0,6\\}\\). The method cannot distinguish which gap occurs.',
                    solution: 'The sieve proves that for some admissible 2-tuple \\(\\mathcal{H}\\), infinitely many \\(n\\) have both \\(n + h_1\\) and \\(n + h_2\\) prime. The three smallest-diameter admissible 2-tuples are \\(\\{0,2\\}, \\{0,4\\}, \\{0,6\\}\\), and the method does not specify which one works. It can only guarantee the minimum diameter of the densest 2-tuple it needs, which is 6 (using \\(\\{0,6\\}\\) or the union \\(\\{0,2,6\\}\\)). Without additional parity-breaking input, the method cannot force the gap to be specifically 2 rather than 4 or 6.'
                },
                {
                    question: 'The Maynard-Tao theorem shows \\(H_m < \\infty\\) for all \\(m\\). Deduce that the prime \\(k\\)-tuples conjecture, if true, implies \\(H_m = (k-1)\\text{-th element of the densest admissible } (m+1)\\text{-tuple}\\). What does this predict for \\(H_2\\)?',
                    hint: 'The densest admissible 3-tuple is \\(\\{0, 2, 6\\}\\) (or \\(\\{0, 4, 6\\}\\)). Its diameter is 6.',
                    solution: 'The \\(k\\)-tuples conjecture says every admissible tuple has infinitely many prime instances. The value \\(H_m\\) equals the minimum diameter of an admissible \\((m+1)\\)-tuple. For \\(m = 2\\): the smallest-diameter admissible 3-tuple is \\(\\{0, 2, 6\\}\\) (or \\(\\{0, 4, 6\\}\\)), with diameter 6. So the conjecture predicts \\(H_2 = 6\\). This means infinitely many triples of primes fit in an interval of length 6, e.g., \\((p, p+2, p+6)\\) or \\((p, p+4, p+6)\\).'
                }
            ]
        }
    ]
});
