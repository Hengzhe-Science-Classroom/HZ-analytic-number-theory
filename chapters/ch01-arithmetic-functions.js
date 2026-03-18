window.CHAPTERS = window.CHAPTERS || [];
window.CHAPTERS.push({
    id: 'ch01',
    number: 1,
    title: 'Arithmetic Functions',
    subtitle: 'The language of multiplicative number theory',
    sections: [
        // ================================================================
        // SECTION 1: Motivation
        // ================================================================
        {
            id: 'sec-motivation',
            title: 'From Primes to Multiplicative Structure',
            content: `
<h2>From Primes to Multiplicative Structure</h2>

<div class="env-block intuition">
    <div class="env-title">Why not just study primes directly?</div>
    <div class="env-body">
        <p>The primes are irregular. They have no closed formula, no simple pattern. Yet aggregated information about them — how many primes up to \\(x\\), how prime gaps behave on average — obeys remarkably clean laws. The key insight of analytic number theory is that <em>averaging</em> tames what counting cannot. To average, we need functions. And to make those functions tractable, we need structure.</p>
    </div>
</div>

<p>An <strong>arithmetic function</strong> is any function \\(f : \\mathbb{N} \\to \\mathbb{C}\\). That's it. No continuity, no smoothness. Just a sequence of complex numbers indexed by the positive integers. The richness comes not from analytic properties but from <em>multiplicative</em> ones.</p>

<p>To see why this matters, consider two basic questions:</p>
<ol>
    <li>How many positive integers up to \\(n\\) are coprime to \\(n\\)?</li>
    <li>How many positive divisors does \\(n\\) have?</li>
</ol>

<p>Both are perfectly well-defined integer sequences. Both turn out to be multiplicative in a precise sense: if you know the answer at prime powers, you know the answer everywhere. This is not a coincidence. It is the arithmetic of \\(\\mathbb{Z}\\) imposing itself.</p>

<h3>The Shape of the Subject</h3>

<p>Chapter 1 introduces the cast of arithmetic functions that appear throughout analytic number theory. Chapter 2 will study their <em>averages</em>. The connection between these two levels — pointwise values and asymptotic averages — is the engine that drives all the deep results, including the Prime Number Theorem.</p>

<p>The organizing principle is this: <strong>arithmetic functions form a ring under Dirichlet convolution</strong>, and the Mobius function is the multiplicative inverse of the constant function \\(1\\). This algebraic fact encodes and generalizes the inclusion-exclusion principle of elementary combinatorics.</p>

<div class="env-block remark">
    <div class="env-title">Notation</div>
    <div class="env-body">
        <p>Throughout, \\(\\mathbb{N} = \\{1, 2, 3, \\ldots\\}\\) denotes the positive integers. We write \\(d \\mid n\\) for "\\(d\\) divides \\(n\\)," and \\(p\\) always denotes a prime. The notation \\(p^k \\| n\\) means \\(p^k \\mid n\\) but \\(p^{k+1} \\nmid n\\) (exactly \\(k\\) factors of \\(p\\)).</p>
    </div>
</div>
`,
            visualizations: [],
            exercises: []
        },

        // ================================================================
        // SECTION 2: The Cast of Characters
        // ================================================================
        {
            id: 'sec-basic-functions',
            title: 'The Cast of Characters',
            content: `
<h2>The Cast of Characters</h2>

<div class="env-block intuition">
    <div class="env-title">Six functions, one story</div>
    <div class="env-body">
        <p>Six arithmetic functions appear everywhere in number theory. Each counts or weights something different about an integer's multiplicative structure. They look disparate at first, but they are all connected through divisor sums and Dirichlet convolution, which we develop next.</p>
    </div>
</div>

<div class="env-block definition">
    <div class="env-title">Euler's Totient Function \\(\\varphi(n)\\)</div>
    <div class="env-body">
        <p>\\(\\varphi(n) = \\#\\{k : 1 \\le k \\le n,\\; \\gcd(k, n) = 1\\}\\)</p>
        <p>the count of integers in \\(\\{1, \\ldots, n\\}\\) coprime to \\(n\\). For a prime power: \\(\\varphi(p^k) = p^k - p^{k-1} = p^{k-1}(p-1)\\).</p>
    </div>
</div>

<div class="env-block definition">
    <div class="env-title">The Mobius Function \\(\\mu(n)\\)</div>
    <div class="env-body">
        <p>
        \\[\\mu(n) = \\begin{cases} 1 & n = 1 \\\\ (-1)^k & n = p_1 p_2 \\cdots p_k \\text{ (distinct primes)} \\\\ 0 & p^2 \\mid n \\text{ for some prime } p \\end{cases}\\]
        </p>
        <p>\\(\\mu(n)\\) detects squarefreeness and counts prime factors with sign.</p>
    </div>
</div>

<div class="env-block definition">
    <div class="env-title">Divisor Functions \\(d(n)\\) and \\(\\sigma(n)\\)</div>
    <div class="env-body">
        <p>\\(d(n) = \\sum_{d \\mid n} 1\\) (number of positive divisors; also written \\(\\tau(n)\\) or \\(\\sigma_0(n)\\)).</p>
        <p>\\(\\sigma(n) = \\sum_{d \\mid n} d\\) (sum of positive divisors; also written \\(\\sigma_1(n)\\)).</p>
        <p>More generally, \\(\\sigma_\\alpha(n) = \\sum_{d \\mid n} d^\\alpha\\). At prime powers: \\(\\sigma(p^k) = 1 + p + \\cdots + p^k = (p^{k+1}-1)/(p-1)\\).</p>
    </div>
</div>

<div class="env-block definition">
    <div class="env-title">Von Mangoldt's Function \\(\\Lambda(n)\\)</div>
    <div class="env-body">
        <p>
        \\[\\Lambda(n) = \\begin{cases} \\log p & n = p^k \\text{ for some prime } p,\\, k \\ge 1 \\\\ 0 & \\text{otherwise} \\end{cases}\\]
        </p>
        <p>\\(\\Lambda(n)\\) concentrates mass at prime powers, weighted by \\(\\log p\\). It is the key function in the proof of the Prime Number Theorem.</p>
    </div>
</div>

<div class="env-block definition">
    <div class="env-title">Liouville's Function \\(\\lambda(n)\\)</div>
    <div class="env-body">
        <p>If \\(n = p_1^{a_1} \\cdots p_k^{a_k}\\), then \\(\\lambda(n) = (-1)^{a_1 + \\cdots + a_k}\\).</p>
        <p>\\(\\lambda(n)\\) is \\(+1\\) if \\(n\\) has an even number of prime factors (counted with multiplicity) and \\(-1\\) if odd. It is completely multiplicative: \\(\\lambda(mn) = \\lambda(m)\\lambda(n)\\) for all \\(m, n\\).</p>
    </div>
</div>

<h3>Quick Reference Table</h3>
<table style="width:100%;border-collapse:collapse;font-size:0.88rem;">
<thead>
<tr style="color:#8b949e;border-bottom:1px solid #30363d;">
    <th style="text-align:left;padding:6px 8px;">n</th>
    <th style="padding:6px 8px;">\\(\\varphi(n)\\)</th>
    <th style="padding:6px 8px;">\\(\\mu(n)\\)</th>
    <th style="padding:6px 8px;">\\(d(n)\\)</th>
    <th style="padding:6px 8px;">\\(\\sigma(n)\\)</th>
    <th style="padding:6px 8px;">\\(\\lambda(n)\\)</th>
</tr>
</thead>
<tbody style="color:#c9d1d9;">
<tr><td style="padding:4px 8px;">1</td><td style="text-align:center;padding:4px 8px;">1</td><td style="text-align:center;padding:4px 8px;">1</td><td style="text-align:center;padding:4px 8px;">1</td><td style="text-align:center;padding:4px 8px;">1</td><td style="text-align:center;padding:4px 8px;">1</td></tr>
<tr><td style="padding:4px 8px;">2</td><td style="text-align:center;padding:4px 8px;">1</td><td style="text-align:center;padding:4px 8px;">-1</td><td style="text-align:center;padding:4px 8px;">2</td><td style="text-align:center;padding:4px 8px;">3</td><td style="text-align:center;padding:4px 8px;">-1</td></tr>
<tr><td style="padding:4px 8px;">3</td><td style="text-align:center;padding:4px 8px;">2</td><td style="text-align:center;padding:4px 8px;">-1</td><td style="text-align:center;padding:4px 8px;">2</td><td style="text-align:center;padding:4px 8px;">4</td><td style="text-align:center;padding:4px 8px;">-1</td></tr>
<tr><td style="padding:4px 8px;">4</td><td style="text-align:center;padding:4px 8px;">2</td><td style="text-align:center;padding:4px 8px;">0</td><td style="text-align:center;padding:4px 8px;">3</td><td style="text-align:center;padding:4px 8px;">7</td><td style="text-align:center;padding:4px 8px;">1</td></tr>
<tr><td style="padding:4px 8px;">6</td><td style="text-align:center;padding:4px 8px;">2</td><td style="text-align:center;padding:4px 8px;">1</td><td style="text-align:center;padding:4px 8px;">4</td><td style="text-align:center;padding:4px 8px;">12</td><td style="text-align:center;padding:4px 8px;">1</td></tr>
<tr><td style="padding:4px 8px;">12</td><td style="text-align:center;padding:4px 8px;">4</td><td style="text-align:center;padding:4px 8px;">0</td><td style="text-align:center;padding:4px 8px;">6</td><td style="text-align:center;padding:4px 8px;">28</td><td style="text-align:center;padding:4px 8px;">1</td></tr>
<tr><td style="padding:4px 8px;">30</td><td style="text-align:center;padding:4px 8px;">8</td><td style="text-align:center;padding:4px 8px;">-1</td><td style="text-align:center;padding:4px 8px;">8</td><td style="text-align:center;padding:4px 8px;">72</td><td style="text-align:center;padding:4px 8px;">-1</td></tr>
</tbody>
</table>

<div class="env-block viz-placeholder" data-viz="viz-function-scatter"></div>
`,
            visualizations: [
                {
                    id: 'viz-function-scatter',
                    title: 'Arithmetic Functions: Values and Running Averages',
                    description: 'Scatter plot of f(n)/n for selected arithmetic functions. The running average (orange line) converges to a constant for phi and sigma, illustrating the content of Chapter 2.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, { width: 620, height: 360, originX: 60, originY: 320, scale: 1 });

                        var maxN = 100;
                        var selectedFn = 'phi';

                        // Helper functions
                        function gcd(a, b) { while (b) { var t = b; b = a % b; a = t; } return a; }
                        function divisors(n) {
                            var divs = [];
                            for (var i = 1; i <= Math.sqrt(n); i++) {
                                if (n % i === 0) {
                                    divs.push(i);
                                    if (i !== n / i) divs.push(n / i);
                                }
                            }
                            return divs;
                        }
                        function eulerPhi(n) {
                            var count = 0;
                            for (var k = 1; k <= n; k++) { if (gcd(k, n) === 1) count++; }
                            return count;
                        }
                        function mobius(n) {
                            if (n === 1) return 1;
                            var factors = 0;
                            var m = n;
                            for (var p = 2; p * p <= m; p++) {
                                if (m % p === 0) {
                                    factors++;
                                    m = m / p;
                                    if (m % p === 0) return 0;
                                }
                            }
                            if (m > 1) factors++;
                            return factors % 2 === 0 ? 1 : -1;
                        }
                        function sigmaFn(n) { return divisors(n).reduce(function(s, d) { return s + d; }, 0); }
                        function divisorCount(n) { return divisors(n).length; }

                        // Controls
                        var fnSel = document.createElement('select');
                        fnSel.style.cssText = 'background:#1a1a40;color:#c9d1d9;border:1px solid #30363d;padding:3px 8px;border-radius:4px;font-size:0.8rem;margin-right:12px;';
                        [['phi', '\u03c6(n)/n'], ['sigma', '\u03c3(n)/n'], ['d', 'd(n)/ln(n)'], ['mu', '\u03bc(n)']].forEach(function(opt) {
                            var o = document.createElement('option');
                            o.value = opt[0]; o.textContent = opt[1];
                            fnSel.appendChild(o);
                        });
                        fnSel.addEventListener('change', function() { selectedFn = fnSel.value; draw(); });
                        controls.appendChild(fnSel);

                        VizEngine.createSlider(controls, 'max n', 30, 200, maxN, 1, function(v) { maxN = Math.round(v); draw(); });

                        function getValues(fn, n) {
                            if (fn === 'phi') return eulerPhi(n) / n;
                            if (fn === 'sigma') return sigmaFn(n) / n;
                            if (fn === 'd') return divisorCount(n) / Math.log(n);
                            if (fn === 'mu') return mobius(n);
                            return 0;
                        }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            // Compute all values
                            var vals = [];
                            for (var i = 1; i <= maxN; i++) vals.push(getValues(selectedFn, i));

                            // Find range
                            var vMin = Math.min.apply(null, vals);
                            var vMax = Math.max.apply(null, vals);
                            if (vMax === vMin) vMax = vMin + 1;
                            var pad = (vMax - vMin) * 0.12;
                            vMin -= pad; vMax += pad;

                            // Chart area
                            var left = 60, right = viz.width - 20, top = 30, bottom = viz.height - 40;
                            var cw = right - left, ch = bottom - top;

                            // Axes
                            ctx.strokeStyle = viz.colors.axis; ctx.lineWidth = 1;
                            ctx.beginPath(); ctx.moveTo(left, bottom); ctx.lineTo(right, bottom); ctx.stroke();
                            ctx.beginPath(); ctx.moveTo(left, top); ctx.lineTo(left, bottom); ctx.stroke();

                            // Y-axis labels
                            ctx.fillStyle = viz.colors.text; ctx.font = '10px -apple-system,sans-serif';
                            ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
                            var nTicks = 5;
                            for (var t = 0; t <= nTicks; t++) {
                                var yv = vMin + (vMax - vMin) * t / nTicks;
                                var py = bottom - (yv - vMin) / (vMax - vMin) * ch;
                                ctx.fillText(yv.toFixed(2), left - 4, py);
                                ctx.strokeStyle = viz.colors.grid; ctx.lineWidth = 0.4;
                                ctx.beginPath(); ctx.moveTo(left, py); ctx.lineTo(right, py); ctx.stroke();
                            }

                            // X labels
                            ctx.fillStyle = viz.colors.text; ctx.textAlign = 'center'; ctx.textBaseline = 'top';
                            var xStep = maxN <= 50 ? 10 : maxN <= 100 ? 20 : 50;
                            for (var xi = xStep; xi <= maxN; xi += xStep) {
                                var px = left + (xi - 1) / (maxN - 1) * cw;
                                ctx.fillText(xi, px, bottom + 4);
                            }

                            // Zero line if in range
                            if (vMin < 0 && vMax > 0) {
                                var py0 = bottom - (0 - vMin) / (vMax - vMin) * ch;
                                ctx.strokeStyle = viz.colors.axis; ctx.lineWidth = 0.7;
                                ctx.setLineDash([4, 4]);
                                ctx.beginPath(); ctx.moveTo(left, py0); ctx.lineTo(right, py0); ctx.stroke();
                                ctx.setLineDash([]);
                            }

                            // Scatter points
                            var runSum = 0;
                            for (var n = 1; n <= maxN; n++) {
                                var v = vals[n - 1];
                                runSum += v;
                                var px2 = left + (n - 1) / Math.max(maxN - 1, 1) * cw;
                                var pY = bottom - (v - vMin) / (vMax - vMin) * ch;
                                ctx.fillStyle = viz.colors.blue + 'cc';
                                ctx.beginPath(); ctx.arc(px2, pY, 2.5, 0, Math.PI * 2); ctx.fill();
                            }

                            // Running average
                            ctx.strokeStyle = viz.colors.orange; ctx.lineWidth = 2;
                            ctx.beginPath();
                            var rSum2 = 0;
                            for (var n2 = 1; n2 <= maxN; n2++) {
                                rSum2 += vals[n2 - 1];
                                var avg = rSum2 / n2;
                                var px3 = left + (n2 - 1) / Math.max(maxN - 1, 1) * cw;
                                var pY3 = bottom - (avg - vMin) / (vMax - vMin) * ch;
                                if (n2 === 1) ctx.moveTo(px3, pY3); else ctx.lineTo(px3, pY3);
                            }
                            ctx.stroke();

                            // Labels
                            var labels = {
                                'phi': '\u03c6(n)/n  (avg \u2192 6/\u03c0\u00b2 \u2248 0.608)',
                                'sigma': '\u03c3(n)/n  (avg \u2192 \u03c0\u00b2/6 \u2248 1.645)',
                                'd': 'd(n)/ln(n)  (avg \u2192 1)',
                                'mu': '\u03bc(n)  (avg \u2192 0)'
                            };
                            viz.screenText(labels[selectedFn] || '', viz.width / 2, 14, viz.colors.white, 13);

                            // Legend
                            ctx.fillStyle = viz.colors.blue;
                            ctx.beginPath(); ctx.arc(left + 14, bottom - 16, 4, 0, Math.PI * 2); ctx.fill();
                            ctx.fillStyle = viz.colors.text; ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
                            ctx.fillText('f(n)', left + 22, bottom - 16);
                            ctx.strokeStyle = viz.colors.orange; ctx.lineWidth = 2;
                            ctx.beginPath(); ctx.moveTo(left + 60, bottom - 16); ctx.lineTo(left + 76, bottom - 16); ctx.stroke();
                            ctx.fillStyle = viz.colors.text;
                            ctx.fillText('running avg', left + 80, bottom - 16);
                        }

                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Compute \\(\\mu(360)\\).',
                    hint: 'Factor 360 completely. If any prime appears squared, \\(\\mu = 0\\).',
                    solution: '\\(360 = 2^3 \\cdot 3^2 \\cdot 5\\). Since \\(2^2 \\mid 360\\), the integer is not squarefree. Therefore \\(\\mu(360) = 0\\).'
                },
                {
                    question: 'Find \\(\\Lambda(n)\\) for \\(n = 1, 2, \\ldots, 20\\). Which values are nonzero?',
                    hint: '\\(\\Lambda(n) \\ne 0\\) only at prime powers. List the prime powers up to 20.',
                    solution: 'The prime powers up to 20 are: \\(2, 3, 4=2^2, 5, 7, 8=2^3, 9=3^2, 11, 13, 16=2^4, 17, 19\\). For each, \\(\\Lambda(p^k) = \\log p\\). So \\(\\Lambda(2)=\\log 2\\), \\(\\Lambda(3)=\\log 3\\), \\(\\Lambda(4)=\\log 2\\), \\(\\Lambda(5)=\\log 5\\), \\(\\Lambda(7)=\\log 7\\), \\(\\Lambda(8)=\\log 2\\), \\(\\Lambda(9)=\\log 3\\), and so on. All other values are 0.'
                }
            ]
        },

        // ================================================================
        // SECTION 3: Multiplicative Functions
        // ================================================================
        {
            id: 'sec-multiplicative',
            title: 'Multiplicative Functions',
            content: `
<h2>Multiplicative Functions</h2>

<div class="env-block intuition">
    <div class="env-title">Why multiplicativity is the right notion</div>
    <div class="env-body">
        <p>The fundamental theorem of arithmetic says every integer factors uniquely into primes. A multiplicative function is one that "respects" this structure: the value at a product of coprime numbers is the product of the values. This means the entire function is determined by its values at prime powers. Computing \\(f(n)\\) for general \\(n\\) reduces to combining \\(f(p^k)\\) over the prime factorization.</p>
    </div>
</div>

<div class="env-block definition">
    <div class="env-title">Multiplicative and Completely Multiplicative</div>
    <div class="env-body">
        <p>An arithmetic function \\(f\\) is <strong>multiplicative</strong> if \\(f(1) = 1\\) and for all \\(m, n\\) with \\(\\gcd(m, n) = 1\\):
        \\[f(mn) = f(m)f(n).\\]
        It is <strong>completely multiplicative</strong> if \\(f(mn) = f(m)f(n)\\) for <em>all</em> \\(m, n\\) (no coprimality required).</p>
    </div>
</div>

<div class="env-block theorem">
    <div class="env-title">Theorem: Multiplicativity from Prime Powers</div>
    <div class="env-body">
        <p>If \\(f\\) is multiplicative and \\(n = p_1^{a_1} \\cdots p_k^{a_k}\\), then
        \\[f(n) = f(p_1^{a_1}) \\cdots f(p_k^{a_k}).\\]
        Thus \\(f\\) is completely determined by its values at prime powers. For completely multiplicative \\(f\\), we further have \\(f(p^k) = f(p)^k\\), so \\(f\\) is determined by its values at primes.</p>
    </div>
</div>

<h3>Which Functions Are Multiplicative?</h3>
<ul>
    <li><strong>Multiplicative:</strong> \\(\\varphi\\), \\(\\mu\\), \\(d\\), \\(\\sigma\\), \\(\\sigma_\\alpha\\), \\(\\lambda\\)</li>
    <li><strong>Completely multiplicative:</strong> \\(\\lambda(n)\\), the principal character \\(\\mathbf{1}\\) (constant 1), the identity \\(\\text{id}(n) = n\\), power functions \\(n^\\alpha\\)</li>
    <li><strong>Not multiplicative:</strong> \\(\\Lambda(n)\\) (fails at \\(n = 1\\) in the additive sense; it is <em>completely additive</em>: \\(\\Lambda(mn) = \\Lambda(m) + \\Lambda(n)\\))</li>
</ul>

<div class="env-block example">
    <div class="env-title">Verifying \\(\\varphi\\) is Multiplicative</div>
    <div class="env-body">
        <p>Let \\(\\gcd(m, n) = 1\\). By CRT, \\(\\mathbb{Z}/mn\\mathbb{Z} \\cong \\mathbb{Z}/m\\mathbb{Z} \\times \\mathbb{Z}/n\\mathbb{Z}\\). A unit in \\(\\mathbb{Z}/mn\\mathbb{Z}\\) corresponds to a pair of units, so \\(\\varphi(mn) = \\varphi(m)\\varphi(n)\\). Combined with \\(\\varphi(p^k) = p^{k-1}(p-1)\\):
        \\[\\varphi(n) = n \\prod_{p \\mid n} \\left(1 - \\frac{1}{p}\\right).\\]</p>
    </div>
</div>

<div class="env-block theorem">
    <div class="env-title">Product of Multiplicative Functions</div>
    <div class="env-body">
        <p>If \\(f\\) and \\(g\\) are multiplicative, so is \\(fg\\) (pointwise product). If \\(f\\) is multiplicative, so is \\(n \\mapsto f(n^k)\\) and \\(n \\mapsto \\sum_{d^2 \\mid n} f(n/d^2)\\). More importantly, the <em>Dirichlet convolution</em> \\(f * g\\) (defined next) of two multiplicative functions is again multiplicative.</p>
    </div>
</div>

<div class="env-block viz-placeholder" data-viz="viz-mult-builder"></div>
`,
            visualizations: [
                {
                    id: 'viz-mult-builder',
                    title: 'Multiplicative Function Builder',
                    description: 'Set f at the four smallest primes via sliders. The function auto-extends to all n via multiplicativity: f(p1^a * p2^b * ...) = f(p1^a) * f(p2^b) * ...',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, { width: 620, height: 320, originX: 60, originY: 290, scale: 1 });

                        var fp = { 2: 1.0, 3: 0.8, 5: 0.6, 7: 0.5 };

                        function divisors(n) {
                            var d = [];
                            for (var i = 1; i <= Math.sqrt(n); i++) {
                                if (n % i === 0) { d.push(i); if (i !== n / i) d.push(n / i); }
                            }
                            return d;
                        }

                        // Extend f multiplicatively
                        function computeF(n) {
                            if (n === 1) return 1;
                            var result = 1;
                            var m = n;
                            var primes = [2, 3, 5, 7, 11, 13, 17, 19];
                            for (var i = 0; i < primes.length; i++) {
                                var p = primes[i];
                                if (m % p === 0) {
                                    var k = 0;
                                    while (m % p === 0) { k++; m = m / p; }
                                    // f(p^k) = f(p)^k for simplicity (completely multiplicative extension)
                                    var fpVal = fp[p] !== undefined ? fp[p] : 0.5;
                                    result *= Math.pow(fpVal, k);
                                }
                            }
                            if (m > 1) {
                                // prime > 19, use default 0.5
                                result *= 0.5;
                            }
                            return result;
                        }

                        function mkSlider(p) {
                            VizEngine.createSlider(controls, 'f(' + p + ')', 0, 2, fp[p], 0.05, function(v) {
                                fp[p] = v;
                                draw();
                            });
                        }
                        [2, 3, 5, 7].forEach(mkSlider);

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var maxN = 40;
                            var vals = [];
                            for (var i = 1; i <= maxN; i++) vals.push(computeF(i));

                            var vMax = Math.max.apply(null, vals.map(Math.abs));
                            if (vMax < 0.1) vMax = 1;
                            var vMin = 0;

                            var left = 60, right = viz.width - 20, top = 30, bottom = viz.height - 30;
                            var cw = right - left, ch = bottom - top;

                            // Axes
                            ctx.strokeStyle = viz.colors.axis; ctx.lineWidth = 1;
                            ctx.beginPath(); ctx.moveTo(left, bottom); ctx.lineTo(right, bottom); ctx.stroke();
                            ctx.beginPath(); ctx.moveTo(left, top); ctx.lineTo(left, bottom); ctx.stroke();

                            // Y ticks
                            ctx.fillStyle = viz.colors.text; ctx.font = '10px -apple-system,sans-serif';
                            ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
                            for (var t = 0; t <= 4; t++) {
                                var yv = vMax * t / 4;
                                var py = bottom - yv / vMax * ch;
                                ctx.fillText(yv.toFixed(2), left - 4, py);
                                ctx.strokeStyle = viz.colors.grid; ctx.lineWidth = 0.3;
                                ctx.beginPath(); ctx.moveTo(left, py); ctx.lineTo(right, py); ctx.stroke();
                            }

                            // Bars
                            var barW = cw / maxN * 0.7;
                            for (var n = 1; n <= maxN; n++) {
                                var v = Math.abs(vals[n - 1]);
                                var px = left + (n - 0.5) / maxN * cw;
                                var barH = v / vMax * ch;
                                var py2 = bottom - barH;
                                // Color by smallest prime factor
                                var colors = [viz.colors.blue, viz.colors.teal, viz.colors.orange, viz.colors.purple];
                                var col = viz.colors.text;
                                if (n % 2 === 0) col = colors[0];
                                else if (n % 3 === 0) col = colors[1];
                                else if (n % 5 === 0) col = colors[2];
                                else if (n % 7 === 0) col = colors[3];
                                else col = viz.colors.green;
                                ctx.fillStyle = col + 'bb';
                                ctx.fillRect(px - barW / 2, py2, barW, barH);
                                if (n <= 20) {
                                    ctx.fillStyle = viz.colors.text;
                                    ctx.textAlign = 'center'; ctx.textBaseline = 'top';
                                    ctx.fillText(n, px, bottom + 2);
                                }
                            }

                            viz.screenText('f(n) extended multiplicatively from f(2), f(3), f(5), f(7)', viz.width / 2, 14, viz.colors.white, 12);
                        }

                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Show that \\(\\varphi\\) is multiplicative by verifying the formula \\(\\varphi(p^k) = p^{k-1}(p-1)\\) and applying the Chinese Remainder Theorem argument.',
                    hint: 'Count integers in \\(\\{1, \\ldots, p^k\\}\\) not divisible by \\(p\\). Then argue that coprimality to \\(mn\\) factors when \\(\\gcd(m,n)=1\\).',
                    solution: 'For a prime power: the integers in \\(\\{1, \\ldots, p^k\\}\\) divisible by \\(p\\) are \\(p, 2p, \\ldots, p^{k-1} \\cdot p\\), which are \\(p^{k-1}\\) of them. So \\(\\varphi(p^k) = p^k - p^{k-1}\\). For coprime \\(m, n\\): an integer \\(a\\) is coprime to \\(mn\\) iff it is coprime to both \\(m\\) and \\(n\\) separately. By CRT, the pairs \\((a \\bmod m, a \\bmod n)\\) biject with \\(a \\bmod mn\\), so \\(\\varphi(mn) = \\varphi(m)\\varphi(n)\\).'
                }
            ]
        },

        // ================================================================
        // SECTION 4: Dirichlet Convolution
        // ================================================================
        {
            id: 'sec-dirichlet-convolution',
            title: 'Dirichlet Convolution',
            content: `
<h2>Dirichlet Convolution</h2>

<div class="env-block intuition">
    <div class="env-title">A product operation on arithmetic functions</div>
    <div class="env-body">
        <p>Ordinary functions on \\(\\mathbb{R}\\) can be multiplied pointwise or convolved. For arithmetic functions, the natural "convolution" sums over divisors rather than over shifts. This operation, called Dirichlet convolution, turns the set of arithmetic functions into a commutative ring whose multiplicative identity is the function \\(\\varepsilon\\) that is 1 at \\(n=1\\) and 0 elsewhere.</p>
    </div>
</div>

<div class="env-block definition">
    <div class="env-title">Dirichlet Convolution</div>
    <div class="env-body">
        <p>For arithmetic functions \\(f, g : \\mathbb{N} \\to \\mathbb{C}\\), their <strong>Dirichlet convolution</strong> is
        \\[(f * g)(n) = \\sum_{d \\mid n} f(d)\\, g\\!\\left(\\frac{n}{d}\\right) = \\sum_{ab = n} f(a)\\,g(b).\\]</p>
    </div>
</div>

<h3>The Ring Structure</h3>
<p>Let \\(\\mathcal{A}\\) denote the set of arithmetic functions. Under pointwise addition and Dirichlet convolution:</p>
<ul>
    <li><strong>Commutativity:</strong> \\(f * g = g * f\\) (the sum over \\(d \\mid n\\) and \\(n/d \\mid n\\) are the same)</li>
    <li><strong>Associativity:</strong> \\((f * g) * h = f * (g * h)\\) (triple sum over \\(abc = n\\))</li>
    <li><strong>Identity:</strong> The function \\(\\varepsilon(n) = [n = 1]\\) satisfies \\(f * \\varepsilon = f\\)</li>
    <li><strong>Inverses:</strong> \\(f\\) has a Dirichlet inverse iff \\(f(1) \\ne 0\\)</li>
</ul>

<div class="env-block theorem">
    <div class="env-title">Theorem: Convolution Preserves Multiplicativity</div>
    <div class="env-body">
        <p>If \\(f\\) and \\(g\\) are multiplicative, then \\(f * g\\) is multiplicative. </p>
        <p><em>Proof sketch.</em> Let \\(\\gcd(m, n) = 1\\). Every divisor \\(d\\) of \\(mn\\) factors uniquely as \\(d = d_1 d_2\\) with \\(d_1 \\mid m\\) and \\(d_2 \\mid n\\) (and \\(\\gcd(d_1, d_2) = 1\\)). So
        \\[(f*g)(mn) = \\sum_{d_1 \\mid m}\\sum_{d_2 \\mid n} f(d_1 d_2)\\,g\\!\\left(\\frac{mn}{d_1 d_2}\\right) = \\left(\\sum_{d_1 \\mid m} f(d_1)\\,g\\!\\left(\\frac{m}{d_1}\\right)\\right)\\!\\left(\\sum_{d_2 \\mid n} f(d_2)\\,g\\!\\left(\\frac{n}{d_2}\\right)\\right)\\]
        using multiplicativity of \\(f\\) and \\(g\\). \\(\\square\\)</p>
    </div>
</div>

<h3>Key Examples</h3>
<p>Let \\(\\mathbf{1}\\) denote the constant function \\(\\mathbf{1}(n) = 1\\) and \\(\\text{id}(n) = n\\). Then:</p>
<ul>
    <li>\\(\\mathbf{1} * \\mathbf{1} = d\\) (number of divisors, since \\(\\sum_{d\\mid n} 1 \\cdot 1 = d(n)\\))</li>
    <li>\\(\\mathbf{1} * \\text{id} = \\sigma\\) (sum of divisors)</li>
    <li>\\(\\mu * \\mathbf{1} = \\varepsilon\\) (the fundamental identity; proved next section)</li>
    <li>\\(\\mu * \\text{id} = \\varphi\\) (a nontrivial identity: \\(\\sum_{d \\mid n} \\mu(d)\\, (n/d) = \\varphi(n)\\))</li>
</ul>

<div class="env-block viz-placeholder" data-viz="viz-convolution-anim"></div>
<div class="env-block viz-placeholder" data-viz="viz-convolution-table"></div>
`,
            visualizations: [
                {
                    id: 'viz-convolution-anim',
                    title: 'Dirichlet Convolution: Term-by-Term',
                    description: 'Visualize (f*g)(n) = sum over divisors d of n: each bar shows f(d)*g(n/d). Select f and g and a target n.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, { width: 620, height: 300, originX: 60, originY: 260, scale: 1 });

                        var targetN = 12;
                        var fnF = 'mu', fnG = 'one';

                        function gcd(a, b) { while (b) { var t = b; b = a % b; a = t; } return a; }
                        function divisors(n) {
                            var d = [];
                            for (var i = 1; i <= Math.sqrt(n); i++) {
                                if (n % i === 0) { d.push(i); if (i !== n / i) d.push(n / i); }
                            }
                            return d.sort(function(a, b) { return a - b; });
                        }
                        function eulerPhi(n) {
                            var count = 0;
                            for (var k = 1; k <= n; k++) { if (gcd(k, n) === 1) count++; }
                            return count;
                        }
                        function mobius(n) {
                            if (n === 1) return 1;
                            var factors = 0, m = n;
                            for (var p = 2; p * p <= m; p++) {
                                if (m % p === 0) {
                                    factors++;
                                    m = m / p;
                                    if (m % p === 0) return 0;
                                }
                            }
                            if (m > 1) factors++;
                            return factors % 2 === 0 ? 1 : -1;
                        }
                        function evalFn(name, n) {
                            if (name === 'one') return 1;
                            if (name === 'id') return n;
                            if (name === 'mu') return mobius(n);
                            if (name === 'phi') return eulerPhi(n);
                            if (name === 'eps') return n === 1 ? 1 : 0;
                            return 1;
                        }

                        // Controls
                        var nSel = document.createElement('select');
                        nSel.style.cssText = 'background:#1a1a40;color:#c9d1d9;border:1px solid #30363d;padding:3px 8px;border-radius:4px;font-size:0.8rem;margin-right:8px;';
                        for (var ni = 2; ni <= 30; ni++) {
                            var opt = document.createElement('option');
                            opt.value = ni; opt.textContent = 'n = ' + ni;
                            if (ni === 12) opt.selected = true;
                            nSel.appendChild(opt);
                        }
                        nSel.addEventListener('change', function() { targetN = parseInt(nSel.value); draw(); });
                        controls.appendChild(nSel);

                        var fSel = document.createElement('select');
                        fSel.style.cssText = 'background:#1a1a40;color:#c9d1d9;border:1px solid #30363d;padding:3px 8px;border-radius:4px;font-size:0.8rem;margin-right:8px;';
                        [['one','f = 1'],['mu','f = \u03bc'],['phi','f = \u03c6'],['id','f = id'],['eps','f = \u03b5']].forEach(function(o) {
                            var op = document.createElement('option'); op.value = o[0]; op.textContent = o[1]; fSel.appendChild(op);
                        });
                        fSel.value = 'mu';
                        fSel.addEventListener('change', function() { fnF = fSel.value; draw(); });
                        controls.appendChild(fSel);

                        var gSel = document.createElement('select');
                        gSel.style.cssText = 'background:#1a1a40;color:#c9d1d9;border:1px solid #30363d;padding:3px 8px;border-radius:4px;font-size:0.8rem;';
                        [['one','g = 1'],['mu','g = \u03bc'],['phi','g = \u03c6'],['id','g = id'],['eps','g = \u03b5']].forEach(function(o) {
                            var op = document.createElement('option'); op.value = o[0]; op.textContent = o[1]; gSel.appendChild(op);
                        });
                        gSel.value = 'one';
                        gSel.addEventListener('change', function() { fnG = gSel.value; draw(); });
                        controls.appendChild(gSel);

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var divs = divisors(targetN);
                            var terms = divs.map(function(d) {
                                return { d: d, fd: evalFn(fnF, d), gnd: evalFn(fnG, targetN / d), prod: evalFn(fnF, d) * evalFn(fnG, targetN / d) };
                            });
                            var total = terms.reduce(function(s, t) { return s + t.prod; }, 0);

                            var left = 60, right = viz.width - 30, top = 40, bottom = viz.height - 30;
                            var cw = right - left, ch = bottom - top;
                            var nd = terms.length;
                            var barW = Math.min(50, cw / (nd + 1) * 0.7);
                            var gap = cw / (nd + 1);

                            // Find y range
                            var allVals = terms.map(function(t) { return t.prod; });
                            var vMax = Math.max(1, Math.max.apply(null, allVals.map(Math.abs)));

                            // Zero line
                            var py0 = bottom - (0 + vMax) / (2 * vMax) * ch;
                            ctx.strokeStyle = viz.colors.axis; ctx.lineWidth = 1;
                            ctx.beginPath(); ctx.moveTo(left, py0); ctx.lineTo(right, py0); ctx.stroke();

                            // Y labels
                            ctx.fillStyle = viz.colors.text; ctx.font = '10px -apple-system,sans-serif'; ctx.textAlign = 'right';
                            [-vMax, 0, vMax].forEach(function(yv) {
                                var py = bottom - (yv + vMax) / (2 * vMax) * ch;
                                ctx.textBaseline = 'middle';
                                ctx.fillText(yv.toFixed(1), left - 4, py);
                            });

                            // Bars
                            terms.forEach(function(t, i) {
                                var px = left + gap * (i + 1);
                                var hNorm = (t.prod) / (2 * vMax) * ch;
                                var pyTop = py0 - hNorm;
                                var h = Math.abs(hNorm);
                                var col = t.prod > 0 ? viz.colors.teal : t.prod < 0 ? viz.colors.red : viz.colors.text;
                                ctx.fillStyle = col + 'aa';
                                ctx.fillRect(px - barW / 2, Math.min(pyTop, py0), barW, h || 2);
                                ctx.strokeStyle = col; ctx.lineWidth = 1.5;
                                ctx.strokeRect(px - barW / 2, Math.min(pyTop, py0), barW, h || 2);

                                // Labels below
                                ctx.fillStyle = viz.colors.text; ctx.textAlign = 'center'; ctx.textBaseline = 'top';
                                ctx.font = '10px -apple-system,sans-serif';
                                ctx.fillText('d=' + t.d, px, bottom + 2);
                                ctx.font = '9px -apple-system,sans-serif'; ctx.fillStyle = viz.colors.text + 'aa';
                                ctx.fillText(t.fd.toFixed(0) + '\u00d7' + t.gnd.toFixed(0), px, bottom + 14);
                            });

                            // Title + result
                            var fnNames = { one: '1', mu: '\u03bc', phi: '\u03c6', id: 'id', eps: '\u03b5' };
                            viz.screenText(
                                '(f\u2217g)(' + targetN + ')  =  \u03a3_{d|' + targetN + '}  f(d)\u00b7g(' + targetN + '/d)  =  ' + total.toFixed(2),
                                viz.width / 2, 18, viz.colors.white, 13
                            );
                            viz.screenText('f = ' + fnNames[fnF] + ',   g = ' + fnNames[fnG], viz.width / 2, 32, viz.colors.text, 11);
                        }

                        draw();
                        return viz;
                    }
                },
                {
                    id: 'viz-convolution-table',
                    title: 'Dirichlet Convolution: Divisor Contribution Table',
                    description: 'For each n up to 16, see which (a,b) pairs with ab=n contribute to (f*g)(n). Color intensity shows the product f(a)*g(b).',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, { width: 620, height: 280, originX: 0, originY: 0, scale: 1 });
                        var maxN = 16;

                        function divisors(n) {
                            var d = [];
                            for (var i = 1; i <= Math.sqrt(n); i++) {
                                if (n % i === 0) { d.push(i); if (i !== n / i) d.push(n / i); }
                            }
                            return d.sort(function(a, b) { return a - b; });
                        }
                        function mobius(n) {
                            if (n === 1) return 1;
                            var factors = 0, m = n;
                            for (var p = 2; p * p <= m; p++) {
                                if (m % p === 0) { factors++; m = m / p; if (m % p === 0) return 0; }
                            }
                            if (m > 1) factors++;
                            return factors % 2 === 0 ? 1 : -1;
                        }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var left = 40, top = 30, right = viz.width - 20, bottom = viz.height - 20;
                            var cw = right - left, ch = bottom - top;
                            var cellW = cw / maxN, cellH = ch / maxN;

                            // Axis labels
                            ctx.fillStyle = viz.colors.text; ctx.font = '10px -apple-system,sans-serif';
                            ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                            for (var n = 1; n <= maxN; n++) {
                                ctx.fillText(n, left + (n - 0.5) * cellW, top - 12);
                                ctx.fillText(n, left - 14, top + (n - 0.5) * cellH);
                            }
                            viz.screenText('a (rows)', left - 20, top / 2, viz.colors.text, 10);
                            viz.screenText('n = ab  (columns)', viz.width / 2, 12, viz.colors.white, 11);

                            // Fill cells: row a, col b (where n=ab)
                            for (var a = 1; a <= maxN; a++) {
                                for (var b = 1; b <= maxN; b++) {
                                    var n = a * b;
                                    if (n > maxN) continue;
                                    var muA = mobius(a), oneB = 1; // mu * 1
                                    var prod = muA * oneB;
                                    var col = prod > 0 ? viz.colors.teal : prod < 0 ? viz.colors.red : viz.colors.grid;
                                    var alpha = prod === 0 ? '33' : 'bb';
                                    ctx.fillStyle = col + alpha;
                                    ctx.fillRect(left + (n - 1) * cellW + 1, top + (a - 1) * cellH + 1, cellW - 2, cellH - 2);
                                    if (prod !== 0) {
                                        ctx.fillStyle = viz.colors.white;
                                        ctx.font = '9px -apple-system,sans-serif';
                                        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                                        ctx.fillText(prod > 0 ? '+1' : '-1',
                                            left + (n - 0.5) * cellW, top + (a - 0.5) * cellH);
                                    }
                                }
                            }

                            // Draw column sums (= mu*1 = epsilon)
                            ctx.fillStyle = viz.colors.text; ctx.font = '10px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            for (var nc = 1; nc <= maxN; nc++) {
                                var s = 0;
                                divisors(nc).forEach(function(d) { s += mobius(d); });
                                ctx.fillStyle = s === 0 ? viz.colors.text : viz.colors.orange;
                                ctx.fillText('=' + s, left + (nc - 0.5) * cellW, bottom + 10);
                            }
                            viz.screenText('\u03bc \u2217 1 = \u03b5  (column sums)', viz.width / 2, bottom + 22, viz.colors.orange, 11);
                        }

                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Verify that \\(\\mu * \\mathbf{1} = \\varepsilon\\) for \\(n = 12\\) by computing \\(\\sum_{d \\mid 12} \\mu(d)\\) directly.',
                    hint: 'List all divisors of 12 and compute \\(\\mu\\) for each.',
                    solution: 'Divisors of 12: 1, 2, 3, 4, 6, 12. Values: \\(\\mu(1)=1,\\, \\mu(2)=-1,\\, \\mu(3)=-1,\\, \\mu(4)=0\\) (since \\(4=2^2\\)), \\(\\mu(6)=1\\) (squarefree, 2 prime factors), \\(\\mu(12)=0\\) (since \\(4 \\mid 12\\)). Sum: \\(1 - 1 - 1 + 0 + 1 + 0 = 0 = \\varepsilon(12)\\). \\(\\checkmark\\)'
                }
            ]
        },

        // ================================================================
        // SECTION 5: Mobius Inversion
        // ================================================================
        {
            id: 'sec-mobius-inversion',
            title: 'Mobius Inversion',
            content: `
<h2>Mobius Inversion</h2>

<div class="env-block intuition">
    <div class="env-title">The number-theoretic inclusion-exclusion</div>
    <div class="env-body">
        <p>Suppose you know \\(g(n) = \\sum_{d \\mid n} f(d)\\) for every \\(n\\). Can you recover \\(f\\) from \\(g\\)? Yes: the Mobius function inverts divisor sums in exactly the same way that inclusion-exclusion inverts counting under union. This is not a coincidence: both are instances of inversion on a poset.</p>
    </div>
</div>

<div class="env-block theorem">
    <div class="env-title">Mobius Inversion Formula</div>
    <div class="env-body">
        <p>Let \\(f, g : \\mathbb{N} \\to \\mathbb{C}\\). Then:
        \\[g(n) = \\sum_{d \\mid n} f(d) \\iff f(n) = \\sum_{d \\mid n} \\mu(d)\\, g\\!\\left(\\frac{n}{d}\\right).\\]
        Equivalently in Dirichlet convolution language: \\(g = f * \\mathbf{1} \\iff f = g * \\mu\\).</p>
    </div>
</div>

<div class="env-block proof">
    <div class="env-title">Proof</div>
    <div class="env-body">
        <p>The equivalence in both directions follows from the single identity \\(\\mu * \\mathbf{1} = \\varepsilon\\).</p>
        <p>(\\(\\Rightarrow\\)): If \\(g = f * \\mathbf{1}\\), then \\(g * \\mu = (f * \\mathbf{1}) * \\mu = f * (\\mathbf{1} * \\mu) = f * \\varepsilon = f\\).</p>
        <p>(\\(\\Leftarrow\\)): If \\(f = g * \\mu\\), then \\(f * \\mathbf{1} = (g * \\mu) * \\mathbf{1} = g * (\\mu * \\mathbf{1}) = g * \\varepsilon = g\\). \\(\\square\\)</p>
        <p>The core identity \\(\\mu * \\mathbf{1} = \\varepsilon\\) follows from multiplicativity: for a prime power \\(p^k\\),
        \\[\\sum_{d \\mid p^k} \\mu(d) = \\mu(1) + \\mu(p) = 1 + (-1) = 0 = \\varepsilon(p^k), \\quad k \\ge 1.\\]
        Since \\(\\mu * \\mathbf{1}\\) is multiplicative and equals 1 at \\(n=1\\), this suffices.</p>
    </div>
</div>

<h3>Applications</h3>

<div class="env-block example">
    <div class="env-title">Recovering \\(\\varphi\\) from \\(\\sigma\\)-type sums</div>
    <div class="env-body">
        <p>It is known (and easy to verify multiplicatively) that \\(\\sum_{d \\mid n} \\varphi(d) = n\\). In Dirichlet language: \\(\\varphi * \\mathbf{1} = \\text{id}\\). Applying Mobius inversion:
        \\[\\varphi = \\text{id} * \\mu, \\quad \\text{i.e., } \\varphi(n) = \\sum_{d \\mid n} \\mu(d)\\cdot \\frac{n}{d} = n \\sum_{d \\mid n} \\frac{\\mu(d)}{d}.\\]
        This gives the formula \\(\\varphi(n) = n \\prod_{p \\mid n}(1 - 1/p)\\) once one evaluates the sum multiplicatively.</p>
    </div>
</div>

<div class="env-block example">
    <div class="env-title">The Fundamental Identity for \\(\\Lambda\\)</div>
    <div class="env-body">
        <p>The von Mangoldt function satisfies \\(\\sum_{d \\mid n} \\Lambda(d) = \\log n\\). (Proof: both sides equal \\(\\sum_p \\sum_{k: p^k \\mid n} \\log p\\).) In Dirichlet notation: \\(\\Lambda * \\mathbf{1} = \\log\\), so by Mobius inversion:
        \\[\\Lambda(n) = \\sum_{d \\mid n} \\mu(d) \\log \\frac{n}{d} = -\\sum_{d \\mid n} \\mu(d) \\log d.\\]
        This identity is the bridge from \\(\\Lambda\\) to the logarithmic derivative \\(-\\zeta'/\\zeta\\).</p>
    </div>
</div>

<div class="env-block viz-placeholder" data-viz="viz-mobius-inversion"></div>
`,
            visualizations: [
                {
                    id: 'viz-mobius-inversion',
                    title: 'Mobius Inversion on the Divisor Lattice',
                    description: 'The Hasse diagram of divisors of n. The forward sum g = f*1 accumulates f values upward; inversion recovers f by the Mobius weights.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, { width: 620, height: 360, originX: 0, originY: 0, scale: 1 });
                        var selectedN = 12;
                        var showInverse = false;

                        function gcd(a, b) { while (b) { var t = b; b = a % b; a = t; } return a; }
                        function divisors(n) {
                            var d = [];
                            for (var i = 1; i <= Math.sqrt(n); i++) {
                                if (n % i === 0) { d.push(i); if (i !== n / i) d.push(n / i); }
                            }
                            return d.sort(function(a, b) { return a - b; });
                        }
                        function mobius(n) {
                            if (n === 1) return 1;
                            var factors = 0, m = n;
                            for (var p = 2; p * p <= m; p++) {
                                if (m % p === 0) { factors++; m = m / p; if (m % p === 0) return 0; }
                            }
                            if (m > 1) factors++;
                            return factors % 2 === 0 ? 1 : -1;
                        }

                        // Compute level (number of prime factors with multiplicity) for Hasse positioning
                        function omega(n) {
                            if (n === 1) return 0;
                            var count = 0, m = n;
                            for (var p = 2; p <= m; p++) {
                                while (m % p === 0) { count++; m = m / p; }
                            }
                            return count;
                        }

                        var nSel = document.createElement('select');
                        nSel.style.cssText = 'background:#1a1a40;color:#c9d1d9;border:1px solid #30363d;padding:3px 8px;border-radius:4px;font-size:0.8rem;margin-right:10px;';
                        [6, 12, 24, 30, 36].forEach(function(ni) {
                            var op = document.createElement('option'); op.value = ni; op.textContent = 'n = ' + ni;
                            if (ni === selectedN) op.selected = true;
                            nSel.appendChild(op);
                        });
                        nSel.addEventListener('change', function() { selectedN = parseInt(nSel.value); draw(); });
                        controls.appendChild(nSel);

                        var btn = VizEngine.createButton(controls, 'Toggle: forward / inverse', function() { showInverse = !showInverse; draw(); });

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var divs = divisors(selectedN);

                            // Compute levels
                            var levels = {};
                            var maxLevel = 0;
                            divs.forEach(function(d) { var l = omega(d); levels[d] = l; if (l > maxLevel) maxLevel = l; });

                            // Group by level
                            var byLevel = {};
                            divs.forEach(function(d) {
                                var l = levels[d];
                                if (!byLevel[l]) byLevel[l] = [];
                                byLevel[l].push(d);
                            });

                            // Positions
                            var left = 50, right = viz.width - 50, top = 30, bottom = viz.height - 50;
                            var positions = {};
                            for (var l = 0; l <= maxLevel; l++) {
                                var grp = byLevel[l] || [];
                                var y = bottom - (l / Math.max(maxLevel, 1)) * (bottom - top);
                                grp.forEach(function(d, i) {
                                    var x = left + (i + 0.5) / grp.length * (right - left);
                                    positions[d] = { x: x, y: y };
                                });
                            }

                            // Draw edges (cover relations: d -> d*p)
                            ctx.strokeStyle = viz.colors.grid; ctx.lineWidth = 1;
                            divs.forEach(function(d) {
                                divs.forEach(function(d2) {
                                    if (d2 > d && d2 % d === 0 && omega(d2) === omega(d) + 1) {
                                        var p1 = positions[d], p2 = positions[d2];
                                        ctx.beginPath(); ctx.moveTo(p1.x, p1.y); ctx.lineTo(p2.x, p2.y); ctx.stroke();
                                    }
                                });
                            });

                            // Draw nodes with values
                            divs.forEach(function(d) {
                                var pos = positions[d];
                                var muD = mobius(d);
                                // f(d) = mu(d) for illustration; g(d) = sum_{e|d} f(e)
                                var fVal = muD;
                                var gVal = 0;
                                divisors(d).forEach(function(e) { gVal += mobius(e); });

                                var displayVal = showInverse ? fVal : gVal;
                                var col = displayVal > 0 ? viz.colors.teal : displayVal < 0 ? viz.colors.red : viz.colors.text;

                                // Circle
                                ctx.fillStyle = viz.colors.bg;
                                ctx.beginPath(); ctx.arc(pos.x, pos.y, 18, 0, Math.PI * 2); ctx.fill();
                                ctx.strokeStyle = col; ctx.lineWidth = 2;
                                ctx.beginPath(); ctx.arc(pos.x, pos.y, 18, 0, Math.PI * 2); ctx.stroke();

                                // Divisor label
                                ctx.fillStyle = viz.colors.white; ctx.font = 'bold 12px -apple-system,sans-serif';
                                ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                                ctx.fillText(d, pos.x, pos.y - 3);

                                // Value label
                                ctx.fillStyle = col; ctx.font = '10px -apple-system,sans-serif';
                                ctx.fillText((displayVal > 0 ? '+' : '') + displayVal, pos.x, pos.y + 8);

                                // Mobius annotation below circle
                                ctx.fillStyle = viz.colors.text + 'aa'; ctx.font = '9px -apple-system,sans-serif';
                                ctx.fillText('\u03bc=' + muD, pos.x, pos.y + 24);
                            });

                            var label = showInverse
                                ? 'Showing f = \u03bc  (recovered by inversion)'
                                : 'Showing g(d) = \u03a3_{e|d} \u03bc(e) = \u03b5(d)';
                            viz.screenText(label, viz.width / 2, viz.height - 18, viz.colors.orange, 12);
                            viz.screenText('Divisor lattice of n = ' + selectedN, viz.width / 2, 14, viz.colors.white, 13);
                        }

                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Use Mobius inversion to prove that \\(\\sum_{d \\mid n} \\mu(d) = [n=1]\\).',
                    hint: 'Apply the formula with \\(g = \\varepsilon\\) and \\(f = \\varepsilon\\), or argue multiplicatively at prime powers.',
                    solution: 'Apply the inversion with \\(g = \\varepsilon\\). If \\(f * \\mathbf{1} = \\varepsilon\\) then \\(f = \\mu\\) since \\(\\mathbf{1}\\) has Dirichlet inverse \\(\\mu\\). But also \\(\\varepsilon * \\mathbf{1} = \\mathbf{1} \\ne \\varepsilon\\), so instead: argue directly. The function \\(h(n) = \\sum_{d \\mid n} \\mu(d) = (\\mu * \\mathbf{1})(n)\\). We compute \\(\\mu * \\mathbf{1}\\) multiplicatively: at \\(n=1\\) it is 1; at \\(p^k\\) for \\(k \\ge 1\\): \\(\\sum_{j=0}^{k} \\mu(p^j) = 1 + (-1) + 0 + \\cdots = 0\\). So \\(\\mu * \\mathbf{1} = \\varepsilon\\). \\(\\square\\)'
                },
                {
                    question: 'Given that \\(\\sum_{d \\mid n} \\varphi(d) = n\\), apply Mobius inversion to derive the formula \\(\\varphi(n) = \\sum_{d \\mid n} \\mu(d) \\frac{n}{d}\\).',
                    hint: 'Identify \\(f\\) and \\(g\\) in the inversion formula and apply directly.',
                    solution: 'Set \\(g(n) = n\\) and note that the given identity says \\(g(n) = \\sum_{d \\mid n} \\varphi(d)\\), i.e., \\(g = \\varphi * \\mathbf{1}\\). By Mobius inversion, \\(\\varphi(n) = \\sum_{d \\mid n} \\mu(d) g(n/d) = \\sum_{d \\mid n} \\mu(d) \\frac{n}{d}\\).'
                }
            ]
        },

        // ================================================================
        // SECTION 6: The von Mangoldt Function
        // ================================================================
        {
            id: 'sec-mangoldt',
            title: 'The von Mangoldt Function',
            content: `
<h2>The von Mangoldt Function</h2>

<div class="env-block intuition">
    <div class="env-title">Why concentrate mass at prime powers?</div>
    <div class="env-body">
        <p>The primes themselves do not form a multiplicative function. But \\(\\Lambda\\) — which assigns \\(\\log p\\) to every prime power \\(p^k\\) and zero elsewhere — is the "right" object: it is completely additive (\\(\\Lambda(mn) = \\Lambda(m) + \\Lambda(n)\\)) and it connects cleanly to the zeta function via \\(-\\zeta'(s)/\\zeta(s) = \\sum_{n=1}^\\infty \\Lambda(n) n^{-s}\\). The PNT is equivalent to the claim that \\(\\psi(x) = \\sum_{n \\le x} \\Lambda(n) \\sim x\\).</p>
    </div>
</div>

<div class="env-block definition">
    <div class="env-title">Von Mangoldt Function</div>
    <div class="env-body">
        <p>
        \\[\\Lambda(n) = \\begin{cases} \\log p & \\text{if } n = p^k \\text{ for some prime } p \\text{ and } k \\ge 1 \\\\ 0 & \\text{otherwise.}\\end{cases}\\]
        </p>
    </div>
</div>

<div class="env-block theorem">
    <div class="env-title">Fundamental Divisor Sum Identity</div>
    <div class="env-body">
        <p>\\[\\sum_{d \\mid n} \\Lambda(d) = \\log n.\\]</p>
        <p><em>Proof.</em> Both sides count \\(\\log p\\) weighted by how many times \\(p^k \\mid n\\). For the left side: \\(\\Lambda(d) = \\log p\\) when \\(d = p^k\\), and \\(p^k \\mid n\\) iff \\(k \\le v_p(n)\\), so the contribution from prime \\(p\\) is \\(v_p(n) \\log p\\). For the right side: \\(\\log n = \\sum_p v_p(n) \\log p\\) by unique factorization. \\(\\square\\)</p>
    </div>
</div>

<h3>Connection to the Zeta Function</h3>

<p>For \\(\\text{Re}(s) > 1\\), the Riemann zeta function satisfies
\\[\\zeta(s) = \\sum_{n=1}^\\infty n^{-s} = \\prod_p (1 - p^{-s})^{-1}.\\]
Taking the logarithmic derivative:
\\[-\\frac{\\zeta'(s)}{\\zeta(s)} = \\sum_p \\frac{\\log p}{p^s - 1} = \\sum_p \\log p \\sum_{k=1}^\\infty p^{-ks} = \\sum_{n=1}^\\infty \\Lambda(n) n^{-s}.\\]</p>

<p>So \\(-\\zeta'(s)/\\zeta(s)\\) is the Dirichlet series of \\(\\Lambda\\). The zeros and poles of \\(\\zeta\\) control the distribution of \\(\\Lambda\\) via Perron's formula, which is the analytic heart of the PNT.</p>

<div class="env-block definition">
    <div class="env-title">Chebyshev's Psi Function</div>
    <div class="env-body">
        <p>\\[\\psi(x) = \\sum_{n \\le x} \\Lambda(n) = \\sum_{p^k \\le x} \\log p.\\]
        The Prime Number Theorem is the statement \\(\\psi(x) \\sim x\\) as \\(x \\to \\infty\\). This is equivalent to \\(\\pi(x) \\sim x/\\log x\\).</p>
    </div>
</div>

<div class="env-block viz-placeholder" data-viz="viz-mangoldt-spikes"></div>
`,
            visualizations: [
                {
                    id: 'viz-mangoldt-spikes',
                    title: 'Von Mangoldt Function \\(\\Lambda(n)\\)',
                    description: 'Spikes at prime powers, height log p. Colors distinguish different primes. The running sum is Chebyshev\'s psi function.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, { width: 620, height: 340, originX: 60, originY: 300, scale: 1 });
                        var maxN = 100;
                        var showPsi = false;

                        function vonMangoldt(n) {
                            if (n <= 1) return 0;
                            var m = n;
                            for (var p = 2; p * p <= m; p++) {
                                if (m % p === 0) {
                                    var base = p;
                                    while (m % p === 0) m = m / p;
                                    if (m === 1) return Math.log(base);
                                    return 0;
                                }
                            }
                            // n is prime
                            return Math.log(n);
                        }

                        function smallestPrimeFactor(n) {
                            for (var p = 2; p * p <= n; p++) { if (n % p === 0) return p; }
                            return n;
                        }

                        VizEngine.createSlider(controls, 'max n', 20, 200, maxN, 1, function(v) { maxN = Math.round(v); draw(); });
                        VizEngine.createButton(controls, 'Toggle \u03a8(x)', function() { showPsi = !showPsi; draw(); });

                        var primeColors = {};
                        var colorList = ['#58a6ff', '#3fb9a0', '#f0883e', '#bc8cff', '#3fb950', '#f85149', '#d29922', '#f778ba'];

                        function getColor(p) {
                            if (!primeColors[p]) {
                                var keys = Object.keys(primeColors).length;
                                primeColors[p] = colorList[keys % colorList.length];
                            }
                            return primeColors[p];
                        }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            var vals = [];
                            for (var i = 1; i <= maxN; i++) vals.push(vonMangoldt(i));

                            var vMax = Math.log(maxN) * 1.1;
                            var left = 60, right = viz.width - 20, top = 30, bottom = viz.height - 40;
                            var cw = right - left, ch = bottom - top;

                            // Axes
                            ctx.strokeStyle = viz.colors.axis; ctx.lineWidth = 1;
                            ctx.beginPath(); ctx.moveTo(left, bottom); ctx.lineTo(right, bottom); ctx.stroke();
                            ctx.beginPath(); ctx.moveTo(left, top); ctx.lineTo(left, bottom); ctx.stroke();

                            // Y labels
                            ctx.fillStyle = viz.colors.text; ctx.font = '10px -apple-system,sans-serif';
                            ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
                            [0, 1, 2, 3, 4, 5].forEach(function(v) {
                                if (v > vMax) return;
                                var py = bottom - v / vMax * ch;
                                ctx.fillText('ln' + (v > 1 ? ' ' + Math.round(Math.exp(v)) : ' e'), left - 4, py);
                                ctx.strokeStyle = viz.colors.grid; ctx.lineWidth = 0.3;
                                ctx.beginPath(); ctx.moveTo(left, py); ctx.lineTo(right, py); ctx.stroke();
                            });

                            // X labels
                            ctx.fillStyle = viz.colors.text; ctx.textAlign = 'center'; ctx.textBaseline = 'top';
                            var xStep = maxN <= 50 ? 10 : maxN <= 100 ? 20 : 50;
                            for (var xi = xStep; xi <= maxN; xi += xStep) {
                                var px2 = left + (xi - 1) / Math.max(maxN - 1, 1) * cw;
                                ctx.fillText(xi, px2, bottom + 4);
                            }

                            var barW = Math.max(1.5, cw / maxN * 0.6);

                            if (showPsi) {
                                // Draw psi(x) step function
                                var psi = 0;
                                ctx.strokeStyle = viz.colors.orange; ctx.lineWidth = 2;
                                ctx.beginPath();
                                for (var n2 = 1; n2 <= maxN; n2++) {
                                    psi += vals[n2 - 1];
                                    var px3 = left + (n2 - 1) / Math.max(maxN - 1, 1) * cw;
                                    var py3 = bottom - (psi / maxN) / (vMax / maxN) * ch * (vMax / maxN);
                                    // Normalize psi/x against vMax*x/maxN scale
                                    py3 = bottom - (psi / n2) / vMax * ch;
                                    if (n2 === 1) ctx.moveTo(px3, py3); else ctx.lineTo(px3, py3);
                                }
                                ctx.stroke();
                                // y=1 line
                                var py1 = bottom - (1 / vMax) * ch;
                                ctx.strokeStyle = viz.colors.text; ctx.lineWidth = 1; ctx.setLineDash([4, 4]);
                                ctx.beginPath(); ctx.moveTo(left, py1); ctx.lineTo(right, py1); ctx.stroke();
                                ctx.setLineDash([]);
                                viz.screenText('\u03a8(x)/x  vs  1  (PNT: \u03a8(x)/x \u2192 1)', viz.width / 2, 14, viz.colors.orange, 13);
                            } else {
                                // Draw Lambda spikes
                                for (var n3 = 1; n3 <= maxN; n3++) {
                                    var v = vals[n3 - 1];
                                    if (v === 0) continue;
                                    var px4 = left + (n3 - 1) / Math.max(maxN - 1, 1) * cw;
                                    var barH = v / vMax * ch;
                                    var spf = smallestPrimeFactor(n3);
                                    var col = getColor(spf);
                                    ctx.fillStyle = col + 'cc';
                                    ctx.fillRect(px4 - barW / 2, bottom - barH, barW, barH);
                                }
                                viz.screenText('\u039b(n): spikes at prime powers p^k, height = ln p', viz.width / 2, 14, viz.colors.white, 13);

                                // Legend for first few primes
                                var legPrimes = [2, 3, 5, 7, 11, 13];
                                var legX = left + 10;
                                ctx.font = '10px -apple-system,sans-serif'; ctx.textBaseline = 'middle';
                                legPrimes.forEach(function(p, i) {
                                    ctx.fillStyle = getColor(p);
                                    ctx.fillRect(legX + i * 50, top + 5, 10, 10);
                                    ctx.textAlign = 'left';
                                    ctx.fillText('p=' + p, legX + i * 50 + 14, top + 10);
                                });
                            }
                        }

                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Verify the identity \\(\\sum_{d \\mid n} \\Lambda(d) = \\log n\\) for \\(n = 12\\).',
                    hint: 'Find all divisors of 12 that are prime powers; for each, record \\(\\Lambda(d) = \\log p\\).',
                    solution: 'Divisors of 12: 1, 2, 3, 4, 6, 12. Prime powers: \\(2 = 2^1, 3 = 3^1, 4 = 2^2\\). So \\(\\sum_{d \\mid 12} \\Lambda(d) = \\Lambda(2) + \\Lambda(3) + \\Lambda(4) = \\log 2 + \\log 3 + \\log 2 = 2\\log 2 + \\log 3 = \\log 4 + \\log 3 = \\log 12\\). \\(\\checkmark\\)'
                },
                {
                    question: 'Use the identity \\(\\Lambda * \\mathbf{1} = \\log\\) and Mobius inversion to derive \\(\\Lambda(n) = -\\sum_{d \\mid n} \\mu(d) \\log d\\).',
                    hint: 'Apply Mobius inversion to \\(g = \\log\\), \\(f = \\Lambda\\), \\(g = f * \\mathbf{1}\\).',
                    solution: 'Since \\(\\Lambda * \\mathbf{1} = \\log\\), Mobius inversion gives \\(\\Lambda(n) = \\sum_{d \\mid n} \\mu(d) \\log(n/d) = \\log n \\sum_{d \\mid n} \\mu(d) - \\sum_{d \\mid n} \\mu(d) \\log d\\). The first sum is \\(\\varepsilon(n) \\log n = 0\\) for \\(n > 1\\) (and \\(\\Lambda(1) = 0\\) anyway). So \\(\\Lambda(n) = -\\sum_{d \\mid n} \\mu(d) \\log d\\).'
                }
            ]
        },

        // ================================================================
        // SECTION 7: Bridge to Ch 2
        // ================================================================
        {
            id: 'sec-bridge',
            title: 'From Functions to Averages',
            content: `
<h2>From Functions to Averages</h2>

<div class="env-block intuition">
    <div class="env-title">The pointwise view vs the average view</div>
    <div class="env-body">
        <p>Everything in this chapter has been pointwise: the value of \\(f\\) at a particular integer. But many of the most important results in analytic number theory are about <em>sums</em>: \\(\\sum_{n \\le x} f(n)\\). Individual values of \\(\\varphi(n)\\) or \\(\\Lambda(n)\\) are erratic; their partial sums are smooth and obey precise asymptotics. Chapter 2 develops the tools for these asymptotics: partial summation, the hyperbola method, and Dirichlet's divisor problem.</p>
    </div>
</div>

<h3>Why Averages Behave Better</h3>

<p>Consider \\(d(n)\\), the number of divisors. Individual values: \\(d(p) = 2\\) for every prime, \\(d(2^k) = k+1\\) grows without bound, and \\(d(n)\\) is famously erratic. Yet Dirichlet proved in 1849:
\\[\\sum_{n \\le x} d(n) = x \\log x + (2\\gamma - 1)x + O(\\sqrt{x}),\\]
where \\(\\gamma\\) is the Euler-Mascheroni constant. The dominant term \\(x \\log x\\) follows from the observation \\(\\sum_{n \\le x} d(n) = \\sum_{n \\le x} \\lfloor x/n \\rfloor\\), which counts lattice points under a hyperbola.</p>

<p>Similarly, for Euler's totient:
\\[\\sum_{n \\le x} \\varphi(n) = \\frac{3}{\\pi^2} x^2 + O(x \\log x).\\]
The leading constant \\(3/\\pi^2 = 6/\\pi^2 \\cdot 1/2\\) arises from \\(\\sum_{n=1}^\\infty \\mu(n)/n^2 = 1/\\zeta(2) = 6/\\pi^2\\), connecting the average behavior of \\(\\varphi\\) directly to the zeta function.</p>

<h3>The Tools We Will Need</h3>

<div class="env-block theorem">
    <div class="env-title">Abel's Summation (preview)</div>
    <div class="env-body">
        <p>If \\(A(x) = \\sum_{n \\le x} a(n)\\) and \\(\\phi\\) is continuously differentiable, then
        \\[\\sum_{n \\le x} a(n)\\phi(n) = A(x)\\phi(x) - \\int_1^x A(t)\\phi'(t)\\,dt.\\]
        This "partial summation" formula is the discrete analogue of integration by parts. It converts sum estimates on \\(a(n)\\) into sum estimates on \\(a(n)\\phi(n)\\).</p>
    </div>
</div>

<div class="env-block theorem">
    <div class="env-title">The Hyperbola Method (preview)</div>
    <div class="env-body">
        <p>For \\(f = g * h\\):
        \\[\\sum_{n \\le x} f(n) = \\sum_{a \\le \\sqrt{x}} g(a) H(x/a) + \\sum_{b \\le \\sqrt{x}} h(b) G(x/b) - G(\\sqrt{x})H(\\sqrt{x}),\\]
        where \\(G(t) = \\sum_{n \\le t} g(n)\\) and \\(H(t) = \\sum_{n \\le t} h(n)\\). This reduces summing a convolution to summing the factors, each over a shorter range.</p>
    </div>
</div>

<h3>The Path Forward</h3>

<p>The machinery of Chapter 1 — multiplicativity, Dirichlet convolution, Mobius inversion — is not an end in itself. It is the language in which the analytic theory is written. Every asymptotic estimate in Chapter 2 will be a statement about an arithmetic function from this chapter, and the proof will use the algebraic identities we have just established.</p>

<p>The deepest application is the Prime Number Theorem: \\(\\psi(x) \\sim x\\). In the Dirichlet series language, this is a statement about the behavior of \\(-\\zeta'(s)/\\zeta(s)\\) near \\(s = 1\\). Chapter 3 will develop the complex-analytic methods needed to extract asymptotics from Dirichlet series. But the arithmetic functions are the vocabulary; their averages are the sentences; and the PNT is the main theorem.</p>

<div class="env-block remark">
    <div class="env-title">Connections to Later Chapters</div>
    <div class="env-body">
        <ul>
            <li><strong>Chapter 2:</strong> Average orders of \\(\\varphi(n)\\), \\(d(n)\\), \\(\\sigma(n)\\) via elementary methods</li>
            <li><strong>Chapter 3:</strong> Dirichlet series \\(\\sum f(n)n^{-s}\\) as generating functions; analytic continuation of \\(\\zeta(s)\\)</li>
            <li><strong>Chapter 4:</strong> The prime counting function \\(\\pi(x)\\) and Chebyshev's estimates via \\(\\Lambda\\)</li>
            <li><strong>Chapter 5:</strong> PNT via Perron's formula; the connection \\(-\\zeta'/\\zeta = \\sum \\Lambda(n)n^{-s}\\)</li>
        </ul>
    </div>
</div>
`,
            visualizations: [],
            exercises: [
                {
                    question: 'Compute \\(\\sum_{n \\le 10} d(n)\\) directly by summing \\(d(n)\\) for \\(n = 1, \\ldots, 10\\). Compare with the leading asymptotic \\(x \\log x + (2\\gamma - 1)x\\) at \\(x = 10\\) (use \\(\\gamma \\approx 0.5772\\)).',
                    hint: 'For each \\(n\\), count its divisors. The asymptotic gives an upper estimate; the error should be \\(O(\\sqrt{10}) \\approx 3\\).',
                    solution: '\\(d(1)=1, d(2)=2, d(3)=2, d(4)=3, d(5)=2, d(6)=4, d(7)=2, d(8)=4, d(9)=3, d(10)=4\\). Sum = 27. Asymptotic: \\(10 \\ln 10 + (2 \\times 0.5772 - 1) \\times 10 \\approx 23.03 + 1.544 \\approx 24.6\\). Error \\(|27 - 24.6| \\approx 2.4 < \\sqrt{10} \\approx 3.16\\). The \\(O(\\sqrt{x})\\) error bound is satisfied.'
                },
                {
                    question: 'Show \\(\\sum_{d \\mid n} \\varphi(d) = n\\) for \\(n = 12\\) by direct computation.',
                    hint: 'Compute \\(\\varphi(d)\\) for each \\(d \\mid 12\\) and sum.',
                    solution: 'Divisors of 12: 1,2,3,4,6,12. Values: \\(\\varphi(1)=1, \\varphi(2)=1, \\varphi(3)=2, \\varphi(4)=2, \\varphi(6)=2, \\varphi(12)=4\\). Sum: \\(1+1+2+2+2+4=12\\). \\(\\checkmark\\)'
                }
            ]
        }
    ]
});
