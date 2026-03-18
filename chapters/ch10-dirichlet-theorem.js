window.CHAPTERS = window.CHAPTERS || [];
window.CHAPTERS.push({
    id: 'ch10',
    number: 10,
    title: "Dirichlet's Theorem",
    subtitle: "Every lane of the prime highway carries traffic",
    sections: [

        // ================================================================
        // SECTION 1: Primes in Every Lane
        // ================================================================
        {
            id: 'sec-motivation',
            title: 'Primes in Every Lane',
            content: `
<h2>Primes in Every Lane</h2>

<div class="env-block intuition">
    <div class="env-title">The Big Question</div>
    <div class="env-body">
        <p>Pick any two numbers that share no common factor, say 3 and 7. The arithmetic progression \\(3, 10, 17, 24, 31, 38, \\ldots\\) (numbers of the form \\(7n + 3\\)) contains infinitely many primes: 3, 17, 31, 59, 73, \\ldots. Is this always the case? Does every "lane" of the integer highway that isn't blocked by a common factor carry infinitely many prime numbers?</p>
    </div>
</div>

<p>In 1837, Peter Gustav Lejeune Dirichlet answered this question with an emphatic yes. His theorem is one of the great achievements of 19th-century mathematics, and the method he invented — using complex-analytic tools to prove number-theoretic results — launched the entire field of analytic number theory.</p>

<h3>The Setup</h3>

<p>Fix a modulus \\(q \\geq 1\\) and a residue \\(a\\) with \\(\\gcd(a, q) = 1\\). The <em>arithmetic progression</em> modulo \\(q\\) with residue \\(a\\) is the set
\\[
\\{a,\\; a+q,\\; a+2q,\\; a+3q,\\; \\ldots\\} = \\{n \\in \\mathbb{Z}_{>0} : n \\equiv a \\pmod{q}\\}.
\\]
The condition \\(\\gcd(a,q) = 1\\) is necessary: if \\(d = \\gcd(a,q) > 1\\), then every element of the progression is divisible by \\(d\\), so there can be at most one prime in it.</p>

<div class="env-block theorem">
    <div class="env-title">Theorem 10.1 (Dirichlet, 1837)</div>
    <div class="env-body">
        <p>For any integers \\(q \\geq 1\\) and \\(a\\) with \\(\\gcd(a, q) = 1\\), there are infinitely many primes \\(p \\equiv a \\pmod{q}\\).</p>
    </div>
</div>

<p>Moreover, these primes are <em>equidistributed</em> among the \\(\\varphi(q)\\) reduced residue classes modulo \\(q\\): in the long run, each class gets an equal share \\(1/\\varphi(q)\\) of all primes. (This is the quantitative refinement we will discuss in Section 5.)</p>

<h3>Why Euclid's Argument Fails</h3>

<p>Euclid's proof that there are infinitely many primes is elegant: assume finitely many, multiply them together, add 1, and get a contradiction. For arithmetic progressions, this direct approach breaks down. Suppose we know finitely many primes \\(p_1, \\ldots, p_k \\equiv 3 \\pmod 4\\). Form \\(N = 4p_1 \\cdots p_k - 1\\). Then \\(N \\equiv 3 \\pmod 4\\), so \\(N\\) must have a prime factor \\(\\equiv 3 \\pmod 4\\) (since a product of numbers \\(\\equiv 1 \\pmod 4\\) stays \\(\\equiv 1\\)). That factor can't be any \\(p_i\\), contradiction. This works for \\(a \\equiv -1 \\pmod q\\) but fails for most other residues.</p>

<p>Dirichlet's genius was to replace Euclid's elementary counting with the <em>logarithmic derivative of L-functions</em>. The key objects are Dirichlet characters and their associated L-series.</p>

<div class="env-block definition">
    <div class="env-title">Definition (Dirichlet Character)</div>
    <div class="env-body">
        <p>A <em>Dirichlet character modulo \\(q\\)</em> is a completely multiplicative function \\(\\chi : \\mathbb{Z} \\to \\mathbb{C}\\) satisfying:
        <ol>
            <li>\\(\\chi(n+q) = \\chi(n)\\) for all \\(n\\) (periodicity),</li>
            <li>\\(\\chi(n) = 0\\) if \\(\\gcd(n,q) > 1\\),</li>
            <li>\\(\\chi(mn) = \\chi(m)\\chi(n)\\) for all \\(m, n\\).</li>
        </ol>
        The <em>principal character</em> \\(\\chi_0\\) satisfies \\(\\chi_0(n) = 1\\) whenever \\(\\gcd(n,q)=1\\).</p>
    </div>
</div>

<p>There are exactly \\(\\varphi(q)\\) distinct characters modulo \\(q\\), forming a group under multiplication isomorphic to the dual group \\(\\widehat{(\\mathbb{Z}/q\\mathbb{Z})^\\times}\\).</p>

<div class="env-block example">
    <div class="env-title">Example: Characters mod 4</div>
    <div class="env-body">
        <p>Modulo 4, the reduced residues are \\(\\{1, 3\\}\\) with \\(\\varphi(4) = 2\\). There are two characters:</p>
        <table style="width:auto;border-collapse:collapse;margin:8px 0;">
            <tr><th style="padding:4px 12px;border:1px solid #30363d;">\\(n\\) mod 4</th><th style="padding:4px 12px;border:1px solid #30363d;">\\(\\chi_0(n)\\)</th><th style="padding:4px 12px;border:1px solid #30363d;">\\(\\chi_1(n)\\)</th></tr>
            <tr><td style="padding:4px 12px;border:1px solid #30363d;">1</td><td style="padding:4px 12px;border:1px solid #30363d;">1</td><td style="padding:4px 12px;border:1px solid #30363d;">1</td></tr>
            <tr><td style="padding:4px 12px;border:1px solid #30363d;">3</td><td style="padding:4px 12px;border:1px solid #30363d;">1</td><td style="padding:4px 12px;border:1px solid #30363d;">-1</td></tr>
            <tr><td style="padding:4px 12px;border:1px solid #30363d;">0, 2</td><td style="padding:4px 12px;border:1px solid #30363d;">0</td><td style="padding:4px 12px;border:1px solid #30363d;">0</td></tr>
        </table>
        <p>Here \\(\\chi_1\\) is the <em>Legendre symbol mod 4</em>, also written \\(\\chi_1(n) = \\left(\\frac{-4}{n}\\right)\\) for odd \\(n\\).</p>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-prime-race-general"></div>
`,
            visualizations: [
                {
                    id: 'viz-prime-race-general',
                    title: 'Prime Counting Functions \\(\\pi(x; q, a)\\)',
                    description: 'Count primes up to x in each reduced residue class mod q. Select a modulus from the dropdown. Each curve shows \\(\\pi(x; q, a)\\) for a coprime to q.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, { width: 700, height: 400, originX: 60, originY: 370, scale: 1 });

                        var qVal = 4;
                        var xMax = 500;

                        // Dropdown for q
                        var qSelect = document.createElement('select');
                        qSelect.style.cssText = 'padding:4px 8px;border:1px solid #30363d;border-radius:4px;background:#1a1a40;color:#c9d1d9;font-size:0.78rem;margin-right:8px;';
                        [4, 6, 8, 10, 12].forEach(function(q) {
                            var opt = document.createElement('option');
                            opt.value = q; opt.textContent = 'q = ' + q;
                            if (q === qVal) opt.selected = true;
                            qSelect.appendChild(opt);
                        });
                        qSelect.addEventListener('change', function() { qVal = parseInt(qSelect.value); draw(); });

                        var xSlider = VizEngine.createSlider(controls, 'x max', 100, 2000, xMax, 50, function(v) { xMax = v; draw(); });
                        controls.insertBefore(document.createTextNode('Modulus: '), xSlider.parentNode);
                        controls.insertBefore(qSelect, xSlider.parentNode);

                        function gcd(a, b) { return b === 0 ? a : gcd(b, a % b); }

                        function getResidues(q) {
                            var res = [];
                            for (var a = 1; a < q; a++) { if (gcd(a, q) === 1) res.push(a); }
                            return res;
                        }

                        var COLORS = ['#58a6ff','#f0883e','#3fb950','#bc8cff','#f85149','#3fb9a0','#d29922','#f778ba'];

                        function computePrimeCounts(q, xMax) {
                            var primes = VizEngine.sievePrimes(xMax);
                            var residues = getResidues(q);
                            var counts = {};
                            residues.forEach(function(a) { counts[a] = []; });
                            var cur = {};
                            residues.forEach(function(a) { cur[a] = 0; });

                            var step = Math.max(1, Math.floor(xMax / 300));
                            var pi = 0;
                            var primeIdx = 0;
                            var result = { x: [], counts: counts };

                            for (var x = 2; x <= xMax; x += step) {
                                while (primeIdx < primes.length && primes[primeIdx] <= x) {
                                    var p = primes[primeIdx++];
                                    var r = p % q;
                                    if (counts[r] !== undefined) cur[r]++;
                                }
                                result.x.push(x);
                                residues.forEach(function(a) { counts[a].push(cur[a]); });
                            }
                            return result;
                        }

                        function draw() {
                            viz.clear();
                            var residues = getResidues(qVal);
                            var data = computePrimeCounts(qVal, xMax);

                            var chartW = viz.width - 80;
                            var chartH = viz.height - 60;

                            // Find max count
                            var maxCount = 1;
                            residues.forEach(function(a) {
                                var arr = data.counts[a];
                                if (arr.length) maxCount = Math.max(maxCount, arr[arr.length - 1]);
                            });
                            maxCount = Math.ceil(maxCount * 1.1);

                            var ctx = viz.ctx;

                            // Axes
                            ctx.strokeStyle = viz.colors.axis; ctx.lineWidth = 1.5;
                            ctx.beginPath(); ctx.moveTo(60, 10); ctx.lineTo(60, viz.height - 40); ctx.stroke();
                            ctx.beginPath(); ctx.moveTo(60, viz.height - 40); ctx.lineTo(viz.width - 20, viz.height - 40); ctx.stroke();

                            // x-axis labels
                            ctx.fillStyle = viz.colors.text; ctx.font = '11px -apple-system,sans-serif'; ctx.textAlign = 'center';
                            for (var xi = 0; xi <= 5; xi++) {
                                var xv = Math.round(xMax * xi / 5);
                                var px = 60 + (viz.width - 80) * xi / 5;
                                ctx.fillText(xv, px, viz.height - 26);
                            }
                            ctx.fillText('x', viz.width - 10, viz.height - 26);

                            // y-axis labels
                            ctx.textAlign = 'right';
                            for (var yi = 0; yi <= 4; yi++) {
                                var yv = Math.round(maxCount * yi / 4);
                                var py = viz.height - 40 - (viz.height - 50) * yi / 4;
                                ctx.fillText(yv, 56, py + 4);
                                ctx.strokeStyle = viz.colors.grid; ctx.lineWidth = 0.5;
                                ctx.beginPath(); ctx.moveTo(60, py); ctx.lineTo(viz.width - 20, py); ctx.stroke();
                            }

                            // Curves
                            residues.forEach(function(a, i) {
                                var arr = data.counts[a];
                                var color = COLORS[i % COLORS.length];
                                ctx.strokeStyle = color; ctx.lineWidth = 2;
                                ctx.beginPath();
                                for (var k = 0; k < data.x.length; k++) {
                                    var px = 60 + (data.x[k] / xMax) * chartW;
                                    var py = (viz.height - 40) - (arr[k] / maxCount) * (viz.height - 50);
                                    k === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
                                }
                                ctx.stroke();

                                // Legend
                                var legX = 70 + (i % 4) * 120;
                                var legY = 18 + Math.floor(i / 4) * 18;
                                ctx.fillStyle = color;
                                ctx.fillRect(legX, legY - 6, 16, 3);
                                ctx.font = '11px -apple-system,sans-serif'; ctx.textAlign = 'left';
                                ctx.fillText('a = ' + a, legX + 20, legY);
                            });

                            // Title
                            ctx.fillStyle = viz.colors.white; ctx.font = '13px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText('\u03c0(x; q=' + qVal + ', a) for each a coprime to ' + qVal, viz.width / 2, viz.height - 10);
                        }

                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Verify that there are exactly \\(\\varphi(q)\\) Dirichlet characters modulo \\(q\\) for \\(q = 5\\). List the values \\(\\chi(1), \\chi(2), \\chi(3), \\chi(4)\\) for each character.',
                    hint: 'The group \\((\\mathbb{Z}/5\\mathbb{Z})^\\times \\cong \\mathbb{Z}/4\\mathbb{Z}\\) is cyclic generated by 2. A character is determined by \\(\\chi(2)\\), which must be a 4th root of unity.',
                    solution: 'We have \\(\\varphi(5) = 4\\) and \\(2^1=2, 2^2=4, 2^3=3, 2^4=1\\) mod 5. Setting \\(\\chi(2) = i^k\\) for \\(k=0,1,2,3\\) gives the four characters: \\(\\chi_0 = (1,1,1,1)\\), \\(\\chi_1=(1,i,-1,-i)\\), \\(\\chi_2=(1,-1,1,-1)\\), \\(\\chi_3=(1,-i,-1,i)\\) for values at \\(n=1,2,3,4\\).'
                }
            ]
        },

        // ================================================================
        // SECTION 2: Proof Setup
        // ================================================================
        {
            id: 'sec-proof-setup',
            title: 'Proof Setup',
            content: `
<h2>Proof Setup: Log of L-Functions and Orthogonality</h2>

<p>The proof of Dirichlet's theorem is an analytic argument: we show that the sum of \\(1/p\\) over primes \\(p \\equiv a \\pmod q\\) diverges, which forces infinitely many such primes.</p>

<h3>The Dirichlet L-Function</h3>

<div class="env-block definition">
    <div class="env-title">Definition (Dirichlet L-Function)</div>
    <div class="env-body">
        <p>For a Dirichlet character \\(\\chi\\) modulo \\(q\\) and \\(\\operatorname{Re}(s) > 1\\), the <em>Dirichlet L-function</em> is
        \\[
        L(s, \\chi) = \\sum_{n=1}^{\\infty} \\frac{\\chi(n)}{n^s} = \\prod_{p} \\frac{1}{1 - \\chi(p)p^{-s}}.
        \\]
        The Euler product converges absolutely for \\(\\operatorname{Re}(s) > 1\\) because \\(\\chi\\) is completely multiplicative and \\(|\\chi(n)| \\leq 1\\).</p>
    </div>
</div>

<h3>The Orthogonality Trick</h3>

<p>The key algebraic identity is the <em>orthogonality of characters</em>:
\\[
\\frac{1}{\\varphi(q)} \\sum_{\\chi \\bmod q} \\chi(n) \\overline{\\chi(a)} = \\begin{cases} 1 & \\text{if } n \\equiv a \\pmod q, \\\\ 0 & \\text{otherwise.} \\end{cases}
\\]
This lets us isolate the arithmetic progression \\(n \\equiv a \\pmod q\\):
\\[
\\sum_{\\substack{p \\leq x \\\\ p \\equiv a \\pmod q}} \\frac{1}{p} = \\frac{1}{\\varphi(q)} \\sum_{\\chi \\bmod q} \\overline{\\chi(a)} \\sum_{p \\leq x} \\frac{\\chi(p)}{p}.
\\]</p>

<h3>Taking the Logarithm</h3>

<p>For \\(s > 1\\), taking logarithms of the Euler product gives
\\[
\\log L(s, \\chi) = \\sum_p \\sum_{k=1}^{\\infty} \\frac{\\chi(p^k)}{k p^{ks}} = \\sum_p \\frac{\\chi(p)}{p^s} + O(1).
\\]
The \\(O(1)\\) error comes from the terms \\(k \\geq 2\\), which converge absolutely for \\(s > 1/2\\). Therefore
\\[
\\sum_p \\frac{\\chi(p)}{p^s} = \\log L(s, \\chi) + O(1) \\quad \\text{as } s \\to 1^+.
\\]
Substituting into the orthogonality formula:
\\[
\\sum_{\\substack{p \\\\ p \\equiv a \\pmod q}} \\frac{1}{p^s} = \\frac{1}{\\varphi(q)} \\sum_{\\chi} \\overline{\\chi(a)} \\log L(s, \\chi) + O(1).
\\]</p>

<h3>The Principal Character Term</h3>

<p>For the principal character \\(\\chi_0\\),
\\[
L(s, \\chi_0) = \\prod_{p \\nmid q} \\frac{1}{1-p^{-s}} = \\zeta(s) \\prod_{p \\mid q} (1 - p^{-s}).
\\]
Since \\(\\zeta(s) \\to \\infty\\) as \\(s \\to 1^+\\), we get \\(\\log L(s, \\chi_0) \\to +\\infty\\). This term contributes \\(\\frac{1}{\\varphi(q)} \\log \\frac{1}{s-1} + O(1)\\) to the sum.</p>

<p>The crucial step: for all non-principal characters \\(\\chi \\neq \\chi_0\\), we need \\(L(1, \\chi) \\neq 0\\). If even one \\(L(1, \\chi) = 0\\), the \\(\\log L(s,\\chi)\\) term could cancel the principal-character divergence, and the argument would collapse.</p>

<div class="env-block remark">
    <div class="env-title">The Central Difficulty</div>
    <div class="env-body">
        <p>Proving \\(L(1, \\chi) \\neq 0\\) splits into two cases based on whether \\(\\chi\\) is <em>complex</em> (takes values outside \\(\\mathbb{R}\\)) or <em>real</em> (takes only values in \\(\\{0, \\pm 1\\}\\)). The complex case is relatively straightforward; the real case requires an entirely different approach.</p>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-l1-values"></div>
`,
            visualizations: [
                {
                    id: 'viz-l1-values',
                    title: '\\(L(1, \\chi)\\) Values for Characters mod \\(q\\)',
                    description: 'Bar chart of \\(|L(1,\\chi)|\\) for all non-principal characters modulo q. All values are strictly positive, confirming \\(L(1,\\chi) \\neq 0\\). Select different moduli.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, { width: 660, height: 380, originX: 60, originY: 340, scale: 1 });
                        var qVal = 5;

                        var qSelect = document.createElement('select');
                        qSelect.style.cssText = 'padding:4px 8px;border:1px solid #30363d;border-radius:4px;background:#1a1a40;color:#c9d1d9;font-size:0.78rem;margin-right:8px;';
                        [5, 7, 8, 12, 13].forEach(function(q) {
                            var opt = document.createElement('option');
                            opt.value = q; opt.textContent = 'q = ' + q;
                            if (q === qVal) opt.selected = true;
                            qSelect.appendChild(opt);
                        });
                        qSelect.addEventListener('change', function() { qVal = parseInt(qSelect.value); draw(); });
                        controls.appendChild(document.createTextNode('Modulus: '));
                        controls.appendChild(qSelect);

                        function gcd(a, b) { return b === 0 ? a : gcd(b, a % b); }

                        // Compute L(1, chi) numerically by partial sums (Dirichlet series convergence)
                        // For a primitive character mod q, use the formula via Gauss sums when available
                        // Here we use brute-force partial sums with enough terms
                        function computeL1(chi_vals, q) {
                            // chi_vals[n mod q] = chi(n) (complex as [re, im])
                            var re = 0, im = 0;
                            var N = 5000;
                            for (var n = 1; n <= N; n++) {
                                var r = n % q;
                                var c = chi_vals[r];
                                if (c) { re += c[0] / n; im += c[1] / n; }
                            }
                            // Apply Euler-Maclaurin or just return magnitude
                            return Math.sqrt(re * re + im * im);
                        }

                        // Build characters for small q by brute force (find generators)
                        function buildChars(q) {
                            // Enumerate reduced residues
                            var units = [];
                            for (var a = 1; a < q; a++) { if (gcd(a, q) === 1) units.push(a); }
                            var phi = units.length;

                            // Find the group structure via multiplication table, then assign characters
                            // For prime q, group is cyclic; use generator
                            // General: use the fact that chars are group homomorphisms (Z/qZ)* -> C*
                            // We enumerate characters by their action on generators
                            // Simplified: for each character index k, chi_k(g^j) = zeta^(jk) where g is a generator
                            // Find generator
                            var gen = -1;
                            for (var g = 2; g < q; g++) {
                                if (gcd(g, q) !== 1) continue;
                                var ord = 1, pw = g;
                                while (pw !== 1 && ord <= phi) { pw = (pw * g) % q; ord++; }
                                if (ord === phi) { gen = g; break; }
                            }

                            // If no single generator (non-cyclic group), fall back to a simpler scheme
                            var chars = [];
                            if (gen !== -1) {
                                // Compute discrete log table: dl[a] = k such that g^k = a
                                var dl = new Array(q).fill(-1);
                                var pw = 1;
                                for (var j = 0; j < phi; j++) { dl[pw] = j; pw = (pw * gen) % q; }

                                for (var k = 0; k < phi; k++) {
                                    var cv = new Array(q).fill(null);
                                    var zeta_re = Math.cos(2 * Math.PI * k / phi);
                                    var zeta_im = Math.sin(2 * Math.PI * k / phi);
                                    for (var a2 = 1; a2 < q; a2++) {
                                        if (gcd(a2, q) !== 1) continue;
                                        var exp = dl[a2];
                                        var ang = 2 * Math.PI * k * exp / phi;
                                        cv[a2] = [Math.cos(ang), Math.sin(ang)];
                                    }
                                    chars.push({ k: k, vals: cv, isPrincipal: k === 0 });
                                }
                            } else {
                                // Fallback: principal only
                                var cv0 = new Array(q).fill(null);
                                for (var a3 = 1; a3 < q; a3++) { if (gcd(a3, q) === 1) cv0[a3] = [1, 0]; }
                                chars.push({ k: 0, vals: cv0, isPrincipal: true });
                            }
                            return chars;
                        }

                        var COLORS = ['#58a6ff','#f0883e','#3fb950','#bc8cff','#f85149','#3fb9a0','#d29922','#f778ba'];

                        function draw() {
                            viz.clear();
                            var chars = buildChars(qVal);
                            var nonPrincipal = chars.filter(function(c) { return !c.isPrincipal; });

                            // Compute L(1,chi) for each
                            var lvals = nonPrincipal.map(function(c) { return computeL1(c.vals, qVal); });
                            var maxL = Math.max(3, Math.max.apply(null, lvals) * 1.2);

                            var ctx = viz.ctx;
                            var n = nonPrincipal.length;
                            var barW = Math.min(60, (viz.width - 100) / (n + 1));
                            var chartBottom = viz.height - 50;
                            var chartTop = 40;
                            var chartH = chartBottom - chartTop;

                            // Axes
                            ctx.strokeStyle = viz.colors.axis; ctx.lineWidth = 1.5;
                            ctx.beginPath(); ctx.moveTo(60, chartTop); ctx.lineTo(60, chartBottom); ctx.stroke();
                            ctx.beginPath(); ctx.moveTo(60, chartBottom); ctx.lineTo(viz.width - 20, chartBottom); ctx.stroke();

                            // Y gridlines
                            ctx.font = '11px -apple-system,sans-serif'; ctx.textAlign = 'right';
                            for (var yi = 0; yi <= 4; yi++) {
                                var yv = maxL * yi / 4;
                                var py = chartBottom - chartH * yi / 4;
                                ctx.fillStyle = viz.colors.text;
                                ctx.fillText(yv.toFixed(1), 56, py + 4);
                                ctx.strokeStyle = viz.colors.grid; ctx.lineWidth = 0.4;
                                ctx.beginPath(); ctx.moveTo(60, py); ctx.lineTo(viz.width - 20, py); ctx.stroke();
                            }

                            lvals.forEach(function(lv, i) {
                                var color = COLORS[i % COLORS.length];
                                var xc = 80 + i * ((viz.width - 110) / Math.max(n, 1));
                                var barH = (lv / maxL) * chartH;

                                ctx.fillStyle = color + 'aa';
                                ctx.fillRect(xc - barW / 2, chartBottom - barH, barW, barH);
                                ctx.strokeStyle = color; ctx.lineWidth = 1.5;
                                ctx.strokeRect(xc - barW / 2, chartBottom - barH, barW, barH);

                                // Value label
                                ctx.fillStyle = viz.colors.white; ctx.font = 'bold 11px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.fillText(lv.toFixed(3), xc, chartBottom - barH - 8);

                                // Character label
                                ctx.fillStyle = viz.colors.text; ctx.font = '10px -apple-system,sans-serif';
                                ctx.fillText('\u03c7' + (i + 1), xc, chartBottom + 14);
                            });

                            // Title
                            ctx.fillStyle = viz.colors.white; ctx.font = '13px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText('|L(1, \u03c7)| for non-principal characters mod ' + qVal + '   (all > 0)', viz.width / 2, 22);

                            // Zero line label
                            ctx.fillStyle = viz.colors.red; ctx.font = '11px -apple-system,sans-serif';
                            ctx.textAlign = 'left';
                            ctx.fillText('0 (would break the proof)', 64, chartBottom + 28);
                        }

                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'State and prove the orthogonality relation: \\(\\sum_{\\chi \\bmod q} \\chi(n) \\overline{\\chi(a)} = \\varphi(q) \\cdot \\mathbf{1}[n \\equiv a \\pmod q]\\) for \\(\\gcd(a,q) = 1\\).',
                    hint: 'Think of the characters as characters of the finite group \\(G = (\\mathbb{Z}/q\\mathbb{Z})^\\times\\). Orthogonality of characters of finite abelian groups is a standard result: \\(\\sum_{\\chi \\in \\hat{G}} \\chi(g) = |G| \\cdot \\mathbf{1}[g = e]\\).',
                    solution: 'For a finite abelian group \\(G\\) with dual \\(\\hat{G}\\), the orthogonality relation \\(\\sum_{\\chi \\in \\hat{G}} \\chi(g) = |G|\\mathbf{1}[g=e]\\) follows from: if \\(g \\neq e\\), there exists \\(\\chi_0 \\in \\hat{G}\\) with \\(\\chi_0(g) \\neq 1\\). Then \\(\\chi_0(g) \\sum_\\chi \\chi(g) = \\sum_\\chi \\chi_0 \\chi(g) = \\sum_\\chi \\chi(g)\\), so the sum is 0. Apply to \\(G = (\\mathbb{Z}/q\\mathbb{Z})^\\times\\) with \\(g = na^{-1}\\).'
                }
            ]
        },

        // ================================================================
        // SECTION 3: L(1,chi) != 0 for Complex chi
        // ================================================================
        {
            id: 'sec-complex-chi',
            title: '\\(L(1,\\chi) \\neq 0\\) for Complex \\(\\chi\\)',
            content: `
<h2>\\(L(1,\\chi) \\neq 0\\) for Complex Characters</h2>

<p>A character \\(\\chi\\) is called <em>complex</em> if \\(\\chi \\neq \\bar\\chi\\), i.e., if it takes non-real values. (Equivalently, \\(\\chi^2 \\neq \\chi_0\\).) For complex characters, the non-vanishing of \\(L(1,\\chi)\\) follows from a slick product argument.</p>

<h3>The Product Formula</h3>

<p>Consider the product over all characters modulo \\(q\\):
\\[
\\prod_{\\chi \\bmod q} L(s, \\chi) = \\prod_p \\prod_{\\chi} \\frac{1}{1 - \\chi(p)p^{-s}}.
\\]
Using the factorization of cyclotomic polynomials, for each prime \\(p \\nmid q\\),
\\[
\\prod_{\\chi} (1 - \\chi(p)X) = (1 - X^f)^{\\varphi(q)/f}
\\]
where \\(f\\) is the order of \\(p\\) in \\((\\mathbb{Z}/q\\mathbb{Z})^\\times\\). Therefore
\\[
\\prod_{\\chi} L(s, \\chi) = \\prod_{p \\nmid q} \\frac{1}{(1 - p^{-fs})^{\\varphi(q)/f}},
\\]
which is a Dirichlet series with <strong>non-negative integer coefficients</strong>. In particular, \\(\\prod_\\chi L(s, \\chi) \\geq 1\\) for all real \\(s > 1\\).</p>

<h3>Ruling Out Zeros of Complex Characters</h3>

<div class="env-block theorem">
    <div class="env-title">Theorem 10.2</div>
    <div class="env-body">
        <p>If \\(\\chi\\) is a complex character modulo \\(q\\), then \\(L(1, \\chi) \\neq 0\\).</p>
    </div>
</div>

<div class="env-block proof">
    <div class="env-title">Proof</div>
    <div class="env-body">
        <p>Suppose \\(L(1, \\chi) = 0\\) for some complex \\(\\chi\\). Since \\(\\chi\\) is complex, \\(\\bar\\chi \\neq \\chi\\) is also a character, and \\(L(1, \\bar\\chi) = \\overline{L(1,\\chi)} = 0\\). So \\(L(s, \\chi)\\) and \\(L(s, \\bar\\chi)\\) both vanish at \\(s = 1\\).</p>
        <p>The product \\(F(s) = \\prod_\\chi L(s, \\chi)\\) has a simple pole at \\(s = 1\\) from the principal character (since \\(L(s, \\chi_0) \\sim c/(s-1)\\)), but the zeros of \\(L(s,\\chi)\\) and \\(L(s,\\bar\\chi)\\) at \\(s=1\\) would cancel this pole and give \\(F(1) = 0\\).</p>
        <p>But we showed \\(F(s) \\geq 1\\) for \\(s > 1\\) real (Dirichlet series with non-negative coefficients at least 1). By continuity, \\(F(1) \\geq 1 > 0\\), a contradiction. \\(\\square\\)</p>
    </div>
</div>

<h3>Counting the Zeros</h3>

<p>More precisely: \\(F(s) = \\prod_\\chi L(s,\\chi)\\) has at most a simple pole at \\(s=1\\) (from \\(\\chi_0\\)). Each \\(L(s,\\chi)\\) with \\(\\chi \\neq \\chi_0\\) extends to an entire function. If \\(L(1,\\chi) = 0\\) for any complex \\(\\chi\\), then since \\(\\bar\\chi \\neq \\chi\\), we get a zero of order at least 2 in the product, which makes \\(F(s) \\to 0\\) as \\(s \\to 1\\). This contradicts \\(F(s) \\geq 1\\).</p>

<div class="env-block remark">
    <div class="env-title">Analytic Continuation</div>
    <div class="env-body">
        <p>For the above argument to work rigorously near \\(s = 1\\), we need \\(L(s,\\chi)\\) to extend analytically to a neighborhood of \\(s = 1\\) for \\(\\chi \\neq \\chi_0\\). This follows from the fact that the partial sums \\(\\sum_{n \\leq N} \\chi(n)\\) are bounded (since \\(\\sum_{n=1}^q \\chi(n) = 0\\) for non-principal \\(\\chi\\)), which implies the Dirichlet series converges for \\(\\operatorname{Re}(s) > 0\\) by Dirichlet's convergence theorem for series with bounded partial sums.</p>
    </div>
</div>

<p>The hard part of Dirichlet's theorem is showing that <em>real</em> characters also have \\(L(1,\\chi) \\neq 0\\). A real character satisfies \\(\\chi = \\bar\\chi\\), so the above argument gives only a simple zero in the product, which exactly cancels the simple pole from \\(\\chi_0\\). The argument is inconclusive.</p>
`,
            visualizations: [],
            exercises: [
                {
                    question: 'Let \\(\\chi\\) be a non-principal character modulo \\(q\\). Show that \\(\\sum_{n=1}^{N} \\chi(n) = O(q)\\) uniformly in \\(N\\). Conclude that \\(L(s,\\chi)\\) converges for \\(\\operatorname{Re}(s) > 0\\).',
                    hint: 'Since \\(\\chi\\) has period \\(q\\) and \\(\\sum_{n=1}^{q} \\chi(n) = 0\\) for non-principal \\(\\chi\\), write \\(N = mq + r\\) and split the sum. For convergence, use partial summation (Abel summation).',
                    solution: 'Write \\(N = mq + r\\) with \\(0 \\leq r < q\\). Then \\(\\sum_{n=1}^N \\chi(n) = m \\sum_{n=1}^q \\chi(n) + \\sum_{n=1}^r \\chi(n) = 0 + O(q) = O(q)\\). For convergence when \\(\\operatorname{Re}(s) > 0\\): by partial summation, \\(L(s,\\chi) = s\\int_1^\\infty A(t) t^{-s-1}\\,dt\\) where \\(A(t) = \\sum_{n \\leq t}\\chi(n) = O(q)\\). The integral converges absolutely for \\(\\operatorname{Re}(s) > 0\\).'
                },
                {
                    question: 'Explain why the argument in Theorem 10.2 does not immediately work for real characters.',
                    hint: 'For a real character \\(\\chi\\), what is \\(\\bar\\chi\\)? How many zeros does the product \\(\\prod_\\chi L(s,\\chi)\\) accumulate at \\(s=1\\) if \\(L(1,\\chi) = 0\\)?',
                    solution: 'For a real character, \\(\\bar\\chi = \\chi\\), so \\(L(1,\\bar\\chi) = L(1,\\chi)\\). If \\(L(1,\\chi) = 0\\), the product \\(F(s)\\) gains only a simple zero from \\(L(s,\\chi)\\), which exactly cancels the simple pole from \\(L(s,\\chi_0)\\). So \\(F(s)\\) would remain bounded (rather than zero) as \\(s \\to 1\\), and no contradiction arises from \\(F(s) \\geq 1\\).'
                }
            ]
        },

        // ================================================================
        // SECTION 4: L(1,chi) != 0 for Real chi
        // ================================================================
        {
            id: 'sec-real-chi',
            title: '\\(L(1,\\chi) \\neq 0\\) for Real \\(\\chi\\)',
            content: `
<h2>\\(L(1,\\chi) \\neq 0\\) for Real Characters: The Hard Case</h2>

<p>The non-vanishing of \\(L(1,\\chi)\\) for real characters is the deep part of Dirichlet's theorem. A real primitive character \\(\\chi\\) modulo \\(q\\) is a generalized Legendre symbol, and \\(L(1,\\chi)\\) has an explicit form related to the class number of a quadratic field.</p>

<h3>Real Characters and Quadratic Fields</h3>

<p>Every real primitive character modulo \\(q\\) has the form \\(\\chi = \\left(\\frac{D}{\\cdot}\\right)\\), the Kronecker symbol, where \\(D\\) is a fundamental discriminant. The connection to quadratic fields \\(\\mathbb{Q}(\\sqrt{D})\\) is deep:</p>

<div class="env-block theorem">
    <div class="env-title">Theorem 10.3 (Dirichlet Class Number Formula)</div>
    <div class="env-body">
        <p>Let \\(\\chi = \\left(\\frac{D}{\\cdot}\\right)\\) be the primitive real character associated to the quadratic field \\(K = \\mathbb{Q}(\\sqrt{D})\\). Then
        \\[
        L(1, \\chi) = \\begin{cases}
        \\dfrac{2\\pi h(D)}{w(D)\\sqrt{|D|}} & \\text{if } D < 0 \\\\ [8pt]
        \\dfrac{2 h(D) \\log \\varepsilon_D}{\\sqrt{D}} & \\text{if } D > 0
        \\end{cases}
        \\]
        where \\(h(D)\\) is the class number of \\(K\\), \\(w(D)\\) is the number of roots of unity in \\(K\\), and \\(\\varepsilon_D\\) is the fundamental unit when \\(D > 0\\).</p>
    </div>
</div>

<p>Since \\(h(D) \\geq 1\\) (every ring of integers has at least the trivial class), \\(\\log \\varepsilon_D > 0\\) (\\(\\varepsilon_D > 1\\)), and \\(\\sqrt{D}, \\sqrt{|D|} > 0\\), the formula immediately gives \\(L(1,\\chi) > 0\\).</p>

<h3>The Class Number via Lattice Counting</h3>

<p>The class number \\(h(D)\\) counts equivalence classes of integral binary quadratic forms \\(ax^2 + bxy + cy^2\\) of discriminant \\(D = b^2 - 4ac\\). Two forms are equivalent if related by an \\(SL_2(\\mathbb{Z})\\) substitution.</p>

<p>For negative \\(D\\), these forms correspond to lattices in \\(\\mathbb{C}\\), and \\(h(D)\\) equals the number of reduced forms \\(ax^2 + bxy + cy^2\\) with \\(-a < b \\leq a < c\\) or \\(0 \\leq b \\leq a = c\\).</p>

<div class="env-block example">
    <div class="env-title">Example: \\(D = -23\\)</div>
    <div class="env-body">
        <p>For \\(D = -23\\), the reduced forms are \\(x^2 + xy + 6y^2\\), \\(2x^2 + xy + 3y^2\\), and \\(2x^2 - xy + 3y^2\\). So \\(h(-23) = 3\\). The class number formula gives
        \\[
        L(1, \chi_{-23}) = \\frac{2\\pi \\cdot 3}{2 \\sqrt{23}} = \\frac{3\\pi}{\\sqrt{23}} \\approx 1.965.
        \\]</p>
    </div>
</div>

<h3>An Elementary Proof via Partial Sums</h3>

<p>A more direct proof (due to de la Vallée-Poussin, simplified by various authors) avoids the class number formula. Consider
\\[
S = \\sum_{n=1}^{q} \\sum_{m=1}^{q} \\chi(m) \\log \\sin\\frac{m\\pi n}{q}.
\\]
Using properties of Gauss sums and the fact that \\(\\chi\\) is real primitive, one shows \\(S = \\tau(\\chi) q L(1,\\chi)\\) where \\(\\tau(\\chi) = \\sum_{a=1}^{q} \\chi(a) e^{2\\pi ia/q}\\) is the Gauss sum with \\(|\\tau(\\chi)| = \\sqrt{q}\\). The sum \\(S\\) can also be evaluated as \\(\\tau(\\chi) q L(1,\\chi) = -(\\text{positive quantity})\\), giving \\(L(1,\\chi) \\neq 0\\).</p>

<div class="env-block remark">
    <div class="env-title">Why This is Harder</div>
    <div class="env-body">
        <p>The non-vanishing of \\(L(1,\\chi)\\) for real \\(\\chi\\) is "harder" because it does not follow from the product formula alone. It requires either deep algebraic geometry (the class number formula connecting L-values to arithmetic invariants of number fields) or clever analytic manipulations. The same difficulty reappears in the theory of Siegel zeros (Section 6): how close to 1 can a real zero of \\(L(s,\\chi)\\) be?</p>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-class-number"></div>
`,
            visualizations: [
                {
                    id: 'viz-class-number',
                    title: 'Reduced Binary Quadratic Forms and Class Numbers',
                    description: 'Visualize reduced forms \\(ax^2+bxy+cy^2\\) of discriminant \\(D\\) as lattice points in the \\((a,b)\\) plane satisfying the reduction conditions. Toggle different discriminants.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, { width: 640, height: 420, originX: 320, originY: 210, scale: 30 });
                        var D = -23;

                        var Dvals = [-3, -4, -7, -8, -11, -15, -20, -23, -24, -40];
                        var Dsel = document.createElement('select');
                        Dsel.style.cssText = 'padding:4px 8px;border:1px solid #30363d;border-radius:4px;background:#1a1a40;color:#c9d1d9;font-size:0.78rem;margin-right:8px;';
                        Dvals.forEach(function(dv) {
                            var opt = document.createElement('option');
                            opt.value = dv; opt.textContent = 'D = ' + dv;
                            if (dv === D) opt.selected = true;
                            Dsel.appendChild(opt);
                        });
                        Dsel.addEventListener('change', function() { D = parseInt(Dsel.value); draw(); });
                        controls.appendChild(document.createTextNode('Discriminant: '));
                        controls.appendChild(Dsel);

                        function getReducedForms(D) {
                            // D < 0: reduced means -a < b <= a < c, or 0 <= b <= a = c
                            var forms = [];
                            if (D >= 0) return forms;
                            var aMax = Math.floor(Math.sqrt(-D / 3)) + 2;
                            for (var a = 1; a <= aMax; a++) {
                                for (var b = -a; b <= a; b++) {
                                    // c = (b^2 - D) / (4a)
                                    var num = b * b - D;
                                    if (num % (4 * a) !== 0) continue;
                                    var c = num / (4 * a);
                                    if (c < a) continue;
                                    if (c === a && b < 0) continue;
                                    if (b * b - 4 * a * c !== D) continue;
                                    forms.push({ a: a, b: b, c: c });
                                }
                            }
                            return forms;
                        }

                        function draw() {
                            viz.clear();
                            viz.drawGrid(1);
                            viz.drawAxes();

                            var forms = getReducedForms(D);
                            var COLORS = ['#58a6ff','#f0883e','#3fb950','#bc8cff','#f85149','#3fb9a0'];

                            forms.forEach(function(f, i) {
                                var color = COLORS[i % COLORS.length];
                                // Plot in (b, a) space (b on x-axis, a on y-axis)
                                viz.drawPoint(f.b, f.a, color, null, 7);
                                viz.drawText(f.a + 'x\u00b2' + (f.b >= 0 ? '+' : '') + f.b + 'xy+' + f.c + 'y\u00b2',
                                    f.b + 0.3, f.a + 0.3, color, 9, 'left');
                            });

                            // Reduction boundary: |b| <= a <= c
                            // Mark the line a = |b|
                            viz.drawFunction(function(x) { return Math.abs(x); }, -6, 6, viz.colors.grid + '88', 1, 100);

                            var ctx = viz.ctx;
                            ctx.fillStyle = viz.colors.white; ctx.font = '13px -apple-system,sans-serif'; ctx.textAlign = 'center';
                            viz.screenText('Reduced forms of discriminant D = ' + D + '   (h = ' + forms.length + ')', viz.width / 2, 18, viz.colors.white, 13);
                            viz.screenText('b (coefficient of xy)', viz.width / 2, viz.height - 8, viz.colors.text, 11);
                            ctx.save(); ctx.translate(14, viz.height / 2); ctx.rotate(-Math.PI / 2);
                            ctx.fillStyle = viz.colors.text; ctx.font = '11px -apple-system,sans-serif'; ctx.textAlign = 'center';
                            ctx.fillText('a (leading coefficient)', 0, 0);
                            ctx.restore();
                        }

                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Compute \\(h(-4)\\) by finding all reduced binary quadratic forms \\(ax^2 + bxy + cy^2\\) of discriminant \\(-4\\). Then verify the class number formula: \\(L(1, \\chi_{-4}) = \\pi/4\\) using the Leibniz formula \\(\\pi/4 = 1 - 1/3 + 1/5 - 1/7 + \\cdots\\).',
                    hint: 'For \\(D = -4\\): reduced condition gives \\(-a < b \\leq a \\leq c\\). The only form is \\(x^2 + y^2\\). Check: \\(h(-4) = 1\\), \\(w = 4\\), so the formula gives \\(L(1,\\chi_{-4}) = 2\\pi \\cdot 1 / (4 \\cdot 2) = \\pi/4\\). The character \\(\\chi_{-4}(n) = (-1)^{(n-1)/2}\\) for odd \\(n\\) is the character counting representations as sums of two squares.',
                    solution: 'The only reduced form of discriminant \\(-4\\) is \\(x^2 + y^2\\) (with \\(a=1, b=0, c=1\\)). So \\(h(-4) = 1\\). The formula gives \\(L(1,\\chi_{-4}) = 2\\pi \\cdot 1/(4 \\cdot 2) = \\pi/4\\). To verify: \\(\\chi_{-4}\\) is the non-principal character mod 4 with \\(\\chi_{-4}(1)=1, \\chi_{-4}(3)=-1\\). The L-series is \\(1 - 1/3 + 1/5 - 1/7 + \\cdots = \\pi/4\\) by Leibniz.'
                }
            ]
        },

        // ================================================================
        // SECTION 5: PNT for Arithmetic Progressions
        // ================================================================
        {
            id: 'sec-quantitative',
            title: 'PNT for Arithmetic Progressions',
            content: `
<h2>The Prime Number Theorem for Arithmetic Progressions</h2>

<p>Dirichlet's theorem gives infinitely many primes in each reduced residue class, but says nothing about how many there are up to \\(x\\). The quantitative refinement is the <em>Prime Number Theorem for arithmetic progressions</em>, which says that the primes distribute equally among the \\(\\varphi(q)\\) residue classes.</p>

<h3>The Statement</h3>

<div class="env-block theorem">
    <div class="env-title">Theorem 10.4 (PNT for Arithmetic Progressions)</div>
    <div class="env-body">
        <p>For fixed \\(q\\) and \\(\\gcd(a,q) = 1\\),
        \\[
        \\pi(x; q, a) := \\#\\{p \\leq x : p \\equiv a \\pmod q\\} \\sim \\frac{1}{\\varphi(q)} \\cdot \\frac{x}{\\log x} \\quad \\text{as } x \\to \\infty.
        \\]
        Equivalently, \\(\\psi(x; q, a) := \\sum_{\\substack{n \\leq x \\\\ n \\equiv a \\pmod q}} \\Lambda(n) \\sim \\dfrac{x}{\\varphi(q)}\\) where \\(\\Lambda\\) is the von Mangoldt function.</p>
    </div>
</div>

<h3>Proof via L-Function Zeros</h3>

<p>The proof follows the same template as the standard PNT. Using the orthogonality of characters,
\\[
\\psi(x; q, a) = \\frac{1}{\\varphi(q)} \\sum_{\\chi \\bmod q} \\overline{\\chi(a)} \\psi(x, \\chi)
\\]
where \\(\\psi(x, \\chi) = \\sum_{n \\leq x} \\Lambda(n)\\chi(n)\\). The explicit formula for each \\(\\psi(x,\\chi)\\) involves the zeros of \\(L(s,\\chi)\\):
\\[
\\psi(x, \\chi) = -\\sum_{\\rho} \\frac{x^\\rho}{\\rho} + \\text{(minor terms)}
\\]
where the sum is over zeros \\(\\rho\\) of \\(L(s,\\chi)\\). For \\(\\chi = \\chi_0\\), the term from \\(\\rho = 1\\) (which is actually a pole, not a zero) contributes the main term \\(x\\). For all other \\(\\chi\\), the main term is absent, and the sum over zeros gives an error term.</p>

<h3>The Error Term and Zero-Free Regions</h3>

<p>The quality of the error term depends on how far the zeros of \\(L(s,\\chi)\\) are pushed from the line \\(\\operatorname{Re}(s) = 1\\). The classical result gives
\\[
\\psi(x; q, a) = \\frac{x}{\\varphi(q)} + O\\left(x e^{-c\\sqrt{\\log x}}\\right)
\\]
for \\(q\\) fixed. Under GRH (all zeros have \\(\\operatorname{Re}(s) = 1/2\\)), this improves to \\(O(x^{1/2} \\log^2 x)\\).</p>

<p>For varying \\(q\\), the situation is more delicate. The <em>Bombieri-Vinogradov theorem</em> (Chapter 13) shows that on average over \\(q \\leq x^{1/2}/(\\log x)^A\\), the error term is as small as GRH would predict.</p>

<h3>Equidistribution</h3>

<p>The ratio \\(\\pi(x; q, a) / \\pi(x)\\) converges to \\(1/\\varphi(q)\\) as \\(x \\to \\infty\\), confirming that primes are equidistributed modulo \\(q\\). This is the analogue of Weyl's equidistribution theorem for primes.</p>

<div class="viz-placeholder" data-viz="viz-equidistribution"></div>
`,
            visualizations: [
                {
                    id: 'viz-equidistribution',
                    title: 'Convergence to Equidistribution \\(1/\\varphi(q)\\)',
                    description: 'Plot \\(\\pi(x;q,a) / \\pi(x)\\) for each residue \\(a\\) coprime to \\(q\\). All curves converge to \\(1/\\varphi(q)\\) as \\(x\\) grows.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, { width: 680, height: 380, originX: 60, originY: 340, scale: 1 });
                        var qVal = 6;

                        function gcd(a, b) { return b === 0 ? a : gcd(b, a % b); }

                        var qSelect = document.createElement('select');
                        qSelect.style.cssText = 'padding:4px 8px;border:1px solid #30363d;border-radius:4px;background:#1a1a40;color:#c9d1d9;font-size:0.78rem;margin-right:8px;';
                        [4, 5, 6, 8, 10, 12].forEach(function(q) {
                            var opt = document.createElement('option');
                            opt.value = q; opt.textContent = 'q = ' + q;
                            if (q === qVal) opt.selected = true;
                            qSelect.appendChild(opt);
                        });
                        qSelect.addEventListener('change', function() { qVal = parseInt(qSelect.value); draw(); });
                        controls.appendChild(document.createTextNode('Modulus: '));
                        controls.appendChild(qSelect);

                        var COLORS = ['#58a6ff','#f0883e','#3fb950','#bc8cff','#f85149','#3fb9a0','#d29922','#f778ba'];

                        function draw() {
                            viz.clear();
                            var xMax = 3000;
                            var primes = VizEngine.sievePrimes(xMax);
                            var units = [];
                            for (var a = 1; a < qVal; a++) { if (gcd(a, qVal) === 1) units.push(a); }
                            var phi = units.length;

                            var step = 20;
                            var xs = [], piTotal = [];
                            var cur = {}; units.forEach(function(a) { cur[a] = 0; });
                            var totalPi = 0;
                            var pIdx = 0;
                            var dataSeries = {}; units.forEach(function(a) { dataSeries[a] = []; });

                            for (var x = 10; x <= xMax; x += step) {
                                while (pIdx < primes.length && primes[pIdx] <= x) {
                                    var p = primes[pIdx++];
                                    var r = p % qVal;
                                    if (cur[r] !== undefined) cur[r]++;
                                    totalPi++;
                                }
                                xs.push(x);
                                piTotal.push(totalPi);
                                units.forEach(function(a) {
                                    dataSeries[a].push(totalPi > 0 ? cur[a] / totalPi : 0);
                                });
                            }

                            var chartW = viz.width - 80;
                            var chartH = viz.height - 60;
                            var ctx = viz.ctx;

                            // Axes
                            ctx.strokeStyle = viz.colors.axis; ctx.lineWidth = 1.5;
                            ctx.beginPath(); ctx.moveTo(60, 20); ctx.lineTo(60, viz.height - 40); ctx.stroke();
                            ctx.beginPath(); ctx.moveTo(60, viz.height - 40); ctx.lineTo(viz.width - 20, viz.height - 40); ctx.stroke();

                            // Y range 0 to 0.6
                            var yMax = 0.6;
                            ctx.font = '11px -apple-system,sans-serif'; ctx.textAlign = 'right';
                            for (var yi = 0; yi <= 6; yi++) {
                                var yv = yMax * yi / 6;
                                var py = (viz.height - 40) - chartH * yi / 6;
                                ctx.fillStyle = viz.colors.text;
                                ctx.fillText(yv.toFixed(2), 56, py + 4);
                                ctx.strokeStyle = viz.colors.grid; ctx.lineWidth = 0.4;
                                ctx.beginPath(); ctx.moveTo(60, py); ctx.lineTo(viz.width - 20, py); ctx.stroke();
                            }

                            // X labels
                            ctx.textAlign = 'center';
                            for (var xi = 0; xi <= 5; xi++) {
                                var xv = Math.round(xMax * xi / 5);
                                var px = 60 + chartW * xi / 5;
                                ctx.fillStyle = viz.colors.text;
                                ctx.fillText(xv, px, viz.height - 26);
                            }

                            // Target line 1/phi(q)
                            var target = 1 / phi;
                            var tyPx = (viz.height - 40) - (target / yMax) * chartH;
                            ctx.strokeStyle = viz.colors.white + '55'; ctx.lineWidth = 1.5; ctx.setLineDash([6, 4]);
                            ctx.beginPath(); ctx.moveTo(60, tyPx); ctx.lineTo(viz.width - 20, tyPx); ctx.stroke();
                            ctx.setLineDash([]);
                            ctx.fillStyle = viz.colors.white; ctx.font = '11px -apple-system,sans-serif'; ctx.textAlign = 'left';
                            ctx.fillText('1/\u03c6(q) = 1/' + phi + ' \u2248 ' + target.toFixed(3), viz.width - 140, tyPx - 8);

                            // Curves
                            units.forEach(function(a, i) {
                                var color = COLORS[i % COLORS.length];
                                var arr = dataSeries[a];
                                ctx.strokeStyle = color; ctx.lineWidth = 1.8;
                                ctx.beginPath();
                                for (var k = 0; k < xs.length; k++) {
                                    var px = 60 + (xs[k] / xMax) * chartW;
                                    var py = (viz.height - 40) - (arr[k] / yMax) * chartH;
                                    k === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
                                }
                                ctx.stroke();

                                var legX = 70 + (i % 4) * 110;
                                var legY = 18 + Math.floor(i / 4) * 16;
                                ctx.fillStyle = color; ctx.fillRect(legX, legY - 5, 14, 3);
                                ctx.font = '10px -apple-system,sans-serif'; ctx.textAlign = 'left';
                                ctx.fillText('a=' + a, legX + 18, legY);
                            });

                            ctx.fillStyle = viz.colors.white; ctx.font = '13px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText('\u03c0(x; q, a) / \u03c0(x)  converging to  1/\u03c6(' + qVal + ') = 1/' + phi, viz.width / 2, viz.height - 8);
                        }

                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Using the von Mangoldt function, rewrite \\(\\psi(x; q, a)\\) as a sum involving \\(\\Lambda\\), and explain why \\(\\psi(x; q, a) \\sim \\pi(x; q, a) \\log x\\) for fixed \\(q\\).',
                    hint: 'The dominant contribution to \\(\\psi(x;q,a)\\) comes from primes (\\(k=1\\) terms), since prime powers contribute at most \\(O(\\sqrt{x})\\).',
                    solution: '\\(\\psi(x; q, a) = \\sum_{n \\leq x, n \\equiv a} \\Lambda(n) = \\sum_{p \\leq x, p \\equiv a} \\log p + \\sum_{k \\geq 2} \\sum_{p^k \\leq x, p^k \\equiv a} \\log p\\). The prime power terms are \\(O(\\sqrt{x})\\), negligible compared to the main term. Since \\(\\pi(x;q,a) \\sim x/(\\varphi(q)\\log x)\\) and \\(\\sum_{p \\leq x, p \\equiv a} \\log p \\sim x/\\varphi(q)\\), dividing gives \\(\\pi(x;q,a) \\log x \\sim \\psi(x;q,a)\\).'
                }
            ]
        },

        // ================================================================
        // SECTION 6: Siegel Zeros
        // ================================================================
        {
            id: 'sec-siegel',
            title: 'Siegel Zeros',
            content: `
<h2>Siegel Zeros: The Shadow on the Real Line</h2>

<p>The zero-free region for \\(L(s,\\chi)\\) (Theorem 10.5 below) has a strange exception: for real characters, there might be a real zero very close to \\(s = 1\\). These are called <em>Siegel zeros</em>, and they are the most frustrating open problem in the zero-free region theory.</p>

<h3>The Classical Zero-Free Region</h3>

<div class="env-block theorem">
    <div class="env-title">Theorem 10.5 (Zero-Free Region for L-Functions)</div>
    <div class="env-body">
        <p>There exists an absolute constant \\(c > 0\\) such that \\(L(s, \\chi)\\) has no zeros in the region
        \\[
        \\sigma > 1 - \\frac{c}{\\log(q(|t|+2))}
        \\]
        with at most one exception: for each modulus \\(q\\), there is at most one real character \\(\\chi_1 \\pmod q\\) and at most one real zero \\(\\beta_1\\) (called a <em>Siegel zero</em>) with \\(\\beta_1 > 1 - c/\\log q\\).</p>
    </div>
</div>

<h3>The Siegel Zero Threat</h3>

<p>If a Siegel zero \\(\\beta_1\\) exists, the explicit formula gives
\\[
\\psi(x; q, a) = \\frac{x}{\\varphi(q)} - \\frac{\\overline{\\chi_1(a)} x^{\\beta_1}}{\\varphi(q) \\beta_1} + \\text{error}.
\\]
The second term \\(x^{\\beta_1}/\\varphi(q)\\) is nearly as large as the main term if \\(\\beta_1\\) is close to 1. This leads to highly irregular prime distribution for small \\(q\\).</p>

<h3>Siegel's Theorem</h3>

<div class="env-block theorem">
    <div class="env-title">Theorem 10.6 (Siegel, 1935)</div>
    <div class="env-body">
        <p>For any \\(\\varepsilon > 0\\), there exists \\(c(\\varepsilon) > 0\\) (ineffective) such that for every real primitive character \\(\\chi\\) modulo \\(q\\),
        \\[
        L(1, \\chi) > c(\\varepsilon) q^{-\\varepsilon}.
        \\]
        Equivalently, the Siegel zero \\(\\beta_1\\) (if it exists) satisfies \\(\\beta_1 < 1 - c(\\varepsilon) q^{-\\varepsilon}\\).</p>
    </div>
</div>

<p>The word <em>ineffective</em> is key: the constant \\(c(\\varepsilon)\\) cannot be computed. If we knew \\(c(\\varepsilon)\\) explicitly for any \\(\\varepsilon\\), we would know that the exceptional Siegel zero (if it exists) is bounded away from 1, which would give us an effective version of the PNT for primes in arithmetic progressions.</p>

<h3>Why Siegel Zeros Matter</h3>

<p>Siegel zeros are connected to deep open problems:</p>
<ul>
    <li><strong>Landau-Siegel zeros conjecture:</strong> No Siegel zeros exist. This would follow from GRH.</li>
    <li><strong>Goldfeld-Gross-Zagier:</strong> An effective lower bound for \\(h(D)\\) (class numbers of imaginary quadratic fields) would eliminate Siegel zeros for the associated characters.</li>
    <li><strong>Linnik's constant:</strong> The least prime \\(p \\equiv a \\pmod q\\) satisfies \\(p \\ll q^L\\). The best known \\(L \\leq 5\\) (Xylouris 2011); GRH would give \\(L = 2 + \\varepsilon\\). Siegel zeros prevent us from getting \\(L\\) much below 2 unconditionally.</li>
</ul>

<div class="viz-placeholder" data-viz="viz-siegel-near-miss"></div>
`,
            visualizations: [
                {
                    id: 'viz-siegel-near-miss',
                    title: 'Siegel Zero: Interactive \\(\\varepsilon\\) Bound',
                    description: 'Visualize Siegel\'s theorem: \\(L(1,\\chi) > c(\\varepsilon) q^{-\\varepsilon}\\). Drag the \\(\\varepsilon\\) slider to see how the lower bound on \\(L(1,\\chi)\\) shrinks as \\(q\\) grows, with different \\(\\varepsilon\\) choices.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, { width: 640, height: 360, originX: 70, originY: 310, scale: 1 });
                        var eps = 0.1;

                        VizEngine.createSlider(controls, '\u03b5', 0.01, 0.5, eps, 0.01, function(v) { eps = v; draw(); });

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var chartW = viz.width - 90;
                            var chartH = viz.height - 60;
                            var qMax = 1000;

                            // Axes
                            ctx.strokeStyle = viz.colors.axis; ctx.lineWidth = 1.5;
                            ctx.beginPath(); ctx.moveTo(70, 20); ctx.lineTo(70, viz.height - 40); ctx.stroke();
                            ctx.beginPath(); ctx.moveTo(70, viz.height - 40); ctx.lineTo(viz.width - 20, viz.height - 40); ctx.stroke();

                            // Y: 0 to 1 for L(1,chi)
                            ctx.font = '11px -apple-system,sans-serif'; ctx.textAlign = 'right';
                            for (var yi = 0; yi <= 5; yi++) {
                                var yv = yi / 5;
                                var py = (viz.height - 40) - chartH * yi / 5;
                                ctx.fillStyle = viz.colors.text;
                                ctx.fillText(yv.toFixed(1), 66, py + 4);
                                ctx.strokeStyle = viz.colors.grid; ctx.lineWidth = 0.4;
                                ctx.beginPath(); ctx.moveTo(70, py); ctx.lineTo(viz.width - 20, py); ctx.stroke();
                            }

                            // X labels
                            ctx.textAlign = 'center';
                            for (var xi = 0; xi <= 5; xi++) {
                                var xv = Math.round(qMax * xi / 5);
                                var px = 70 + chartW * xi / 5;
                                ctx.fillStyle = viz.colors.text;
                                ctx.fillText(xv, px, viz.height - 26);
                            }
                            ctx.fillStyle = viz.colors.text; ctx.textAlign = 'center';
                            ctx.fillText('q (modulus)', viz.width / 2, viz.height - 10);

                            // Siegel lower bound: assume c(eps) = 1 for illustration
                            // The actual c(eps) is unknown; show q^{-eps} curve
                            ctx.strokeStyle = viz.colors.red; ctx.lineWidth = 2;
                            ctx.beginPath();
                            for (var qi = 2; qi <= qMax; qi += 5) {
                                var bound = Math.pow(qi, -eps);
                                var px2 = 70 + (qi / qMax) * chartW;
                                var py2 = (viz.height - 40) - Math.min(bound, 1) * chartH;
                                qi === 2 ? ctx.moveTo(px2, py2) : ctx.lineTo(px2, py2);
                            }
                            ctx.stroke();

                            // Show a "hypothetical L(1,chi)" hovering above the bound
                            ctx.strokeStyle = viz.colors.blue; ctx.lineWidth = 2; ctx.setLineDash([5, 3]);
                            ctx.beginPath();
                            for (var qi2 = 2; qi2 <= qMax; qi2 += 5) {
                                var val = Math.max(Math.pow(qi2, -eps) * 2, 0.05) + 0.1 * Math.sin(qi2 / 30);
                                var px3 = 70 + (qi2 / qMax) * chartW;
                                var py3 = (viz.height - 40) - Math.min(Math.max(val, 0), 1) * chartH;
                                qi2 === 2 ? ctx.moveTo(px3, py3) : ctx.lineTo(px3, py3);
                            }
                            ctx.stroke(); ctx.setLineDash([]);

                            // Labels
                            ctx.fillStyle = viz.colors.red; ctx.font = '12px -apple-system,sans-serif'; ctx.textAlign = 'left';
                            ctx.fillText('Siegel lower bound: c(\u03b5) \u00b7 q^{-\u03b5}', 80, 35);
                            ctx.fillStyle = viz.colors.blue;
                            ctx.fillText('L(1, \u03c7) for a real \u03c7 (illustrative)', 80, 55);

                            ctx.fillStyle = viz.colors.white; ctx.font = '13px -apple-system,sans-serif'; ctx.textAlign = 'center';
                            ctx.fillText('\u03b5 = ' + eps.toFixed(2) + '  \u2014  Siegel: L(1,\u03c7) > c(\u03b5) q^{-\u03b5}  (c(\u03b5) ineffective)', viz.width / 2, viz.height - 44);
                        }

                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Suppose a Siegel zero \\(\\beta_1\\) for a real character \\(\\chi_1 \\pmod q\\) satisfies \\(\\beta_1 = 1 - \\delta\\) with \\(\\delta\\) small. Show that the "error" term \\(x^{\\beta_1}/\\varphi(q)\\) in \\(\\psi(x; q, a)\\) is comparable to the main term \\(x/\\varphi(q)\\) when \\(x \\approx e^{1/\\delta}\\).',
                    hint: 'Compare \\(x^{1-\\delta}\\) to \\(x\\). The ratio is \\(x^{-\\delta} = e^{-\\delta \\log x}\\), which equals 1 when \\(\\log x = 1/\\delta\\), i.e., \\(x = e^{1/\\delta}\\).',
                    solution: 'The error term is \\(x^{\\beta_1} = x^{1-\\delta} = x \\cdot e^{-\\delta \\log x}\\). This is comparable to \\(x\\) when \\(e^{-\\delta \\log x} \\approx 1\\), i.e., \\(\\delta \\log x \\ll 1\\), i.e., \\(x \\ll e^{1/\\delta}\\). For \\(x = e^{1/\\delta}\\), the error term is \\(x \\cdot e^{-1} \\approx 0.37x\\), nearly as large as the main term. This means that for \\(x\\) up to \\(e^{1/\\delta}\\), the equidistribution theorem is effectively false for the progression class detected by \\(\\chi_1\\).'
                }
            ]
        },

        // ================================================================
        // SECTION 7: Beyond Zeta Methods
        // ================================================================
        {
            id: 'sec-bridge',
            title: 'Beyond Zeta Methods',
            content: `
<h2>Beyond Zeta Methods: Chebyshev's Bias and Connections</h2>

<p>Dirichlet's theorem and its quantitative refinement leave a finer question: among the different residue classes modulo \\(q\\), are all classes really equally populated, or are there systematic biases that persist even as \\(x \\to \\infty\\)?</p>

<h3>Chebyshev's Bias</h3>

<p>In 1853, Chebyshev observed that \\(\\pi(x; 4, 3) > \\pi(x; 4, 1)\\) "most of the time" — primes that are \\(3 \\pmod 4\\) seem to outnumber those that are \\(1 \\pmod 4\\). This is not a contradiction to equidistribution (the two counts do converge to the same limit), but a logarithmic-density statement.</p>

<div class="env-block theorem">
    <div class="env-title">Theorem 10.7 (Rubinstein-Sarnak, 1994)</div>
    <div class="env-body">
        <p>Assume GRH and the Linear Independence hypothesis (the imaginary parts of nontrivial zeros of Dirichlet L-functions are linearly independent over \\(\\mathbb{Q}\\)). Define the "race" between residue classes as the logarithmic density
        \\[
        \\delta(q; a_1, a_2) = \\lim_{X \\to \\infty} \\frac{1}{\\log X} \\int_2^X \\mathbf{1}[\\pi(x; q, a_1) > \\pi(x; q, a_2)] \\frac{dx}{x}.
        \\]
        For \\(q = 4\\): \\(\\delta(4; 3, 1) \\approx 0.9959\\), confirming that \\(\\pi(x; 4, 3) > \\pi(x; 4, 1)\\) about 99.59% of the time (in logarithmic density).</p>
    </div>
</div>

<p>The bias arises from the contribution of the Möbius function and the zeros of L-functions. The "non-squares" modulo \\(q\\) (residues that are not perfect squares mod \\(q\\)) are systematically favored because they are associated with the low-lying zeros of L-functions via the explicit formula.</p>

<h3>The Explicit Formula Perspective</h3>

<p>Define the "prime counting error"
\\[
E(x; q, a) = \\frac{\\pi(x; q, a) - \\pi(x)/\\varphi(q)}{\\sqrt{x}/\\log x}.
\\]
Under GRH, this normalized error oscillates with amplitude \\(O(1)\\). Its mean value is
\\[
\\langle E(x; q, a) \\rangle = -\\mathbf{1}[a^2 \\equiv 1 \\pmod q] + \\text{small},
\\]
meaning quadratic residues get a negative bias while non-residues get a positive one. This is the content of Chebyshev's bias, made precise by Rubinstein and Sarnak.</p>

<h3>Connection to Random Matrix Theory</h3>

<p>The distribution of \\(E(x; q, a)\\) as \\(x\\) varies (in log-scale) converges to a probability distribution whose moments are computable from the zeros of \\(L(s, \\chi)\\). Under GRH + Linear Independence, this distribution is Gaussian with mean \\(-\\mathbf{1}[a^2 \\equiv 1 \\pmod q]\\). The negative mean for quadratic residues is the Chebyshev bias.</p>

<h3>Generalizations and Open Problems</h3>

<ul>
    <li><strong>Effective equidistribution:</strong> The Bombieri-Vinogradov theorem (Ch. 13) gives a GRH-quality estimate on average over \\(q\\). The Elliott-Halberstam conjecture extends this further.</li>
    <li><strong>Chebotarev density theorem:</strong> Dirichlet's theorem generalizes to number fields: for a Galois extension \\(K/\\mathbb{Q}\\), the density of primes whose Frobenius lies in a given conjugacy class equals that class's proportion in the Galois group.</li>
    <li><strong>Effective Chebotarev:</strong> Under GRH, one can show that the least prime \\(p \\equiv a \\pmod q\\) satisfies \\(p \\ll (\\log q)^2\\) (Lagarias-Odlyzko 1977). Unconditionally, only \\(p \\ll q^2 (\\log q)^2\\) is known.</li>
    <li><strong>Linnik's theorem:</strong> The least prime in the progression is \\(\\ll q^L\\) with \\(L\\) absolute. Current record: \\(L \\leq 5\\) (Xylouris 2011). GRH gives \\(L = 2 + \\varepsilon\\).</li>
</ul>

<div class="viz-placeholder" data-viz="viz-chebyshev-bias"></div>

<div class="env-block remark">
    <div class="env-title">Looking Ahead</div>
    <div class="env-body">
        <p>The ideas in this chapter — L-functions, characters, zero-free regions, explicit formulas — recur throughout analytic number theory. Chapter 11 uses sieve methods to count primes in progressions without L-functions (at the cost of weaker results). Chapter 13 proves the Bombieri-Vinogradov theorem, which is a GRH-strength result on average. Chapter 16 studies the zeros of L-functions in depth, where the analogue of the Riemann Hypothesis for Dirichlet L-functions remains open.</p>
    </div>
</div>
`,
            visualizations: [
                {
                    id: 'viz-chebyshev-bias',
                    title: "Chebyshev's Bias: \\(\\pi(x;4,3) > \\pi(x;4,1)\\) Most of the Time",
                    description: 'Plot the difference \\(\\pi(x;4,3) - \\pi(x;4,1)\\). The curve is positive most of the time, confirming Chebyshev\'s observation. A histogram shows what fraction of x values (in log scale) have the "3 wins" outcome.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, { width: 680, height: 380, originX: 70, originY: 200, scale: 1 });

                        function draw() {
                            viz.clear();
                            var xMax = 5000;
                            var primes = VizEngine.sievePrimes(xMax);

                            var xs = [], diff = [];
                            var pi3 = 0, pi1 = 0;
                            var pIdx = 0;
                            var logWin = 0, logTotal = 0;

                            var step = 10;
                            for (var x = 3; x <= xMax; x += step) {
                                while (pIdx < primes.length && primes[pIdx] <= x) {
                                    var p = primes[pIdx++];
                                    if (p % 4 === 3) pi3++;
                                    if (p % 4 === 1) pi1++;
                                }
                                xs.push(x);
                                diff.push(pi3 - pi1);
                                var logIncrement = 1 / x * step;
                                logTotal += logIncrement;
                                if (pi3 > pi1) logWin += logIncrement;
                            }

                            var maxDiff = Math.max(1, Math.max.apply(null, diff.map(Math.abs)));
                            var chartH = viz.height - 60;
                            var chartW = viz.width - 90;
                            var ctx = viz.ctx;

                            // Axes
                            ctx.strokeStyle = viz.colors.axis; ctx.lineWidth = 1.5;
                            ctx.beginPath(); ctx.moveTo(70, 30); ctx.lineTo(70, viz.height - 30); ctx.stroke();
                            ctx.beginPath(); ctx.moveTo(70, viz.height / 2); ctx.lineTo(viz.width - 20, viz.height / 2); ctx.stroke();

                            // Y labels
                            ctx.font = '10px -apple-system,sans-serif'; ctx.textAlign = 'right';
                            [-maxDiff, -maxDiff/2, 0, maxDiff/2, maxDiff].forEach(function(yv) {
                                var py = (viz.height / 2) - (yv / maxDiff) * (chartH / 2);
                                ctx.fillStyle = viz.colors.text;
                                ctx.fillText(Math.round(yv), 66, py + 4);
                                ctx.strokeStyle = viz.colors.grid; ctx.lineWidth = 0.3;
                                ctx.beginPath(); ctx.moveTo(70, py); ctx.lineTo(viz.width - 20, py); ctx.stroke();
                            });

                            // Zero line bold
                            ctx.strokeStyle = viz.colors.axis; ctx.lineWidth = 1;
                            ctx.setLineDash([4, 4]);
                            ctx.beginPath(); ctx.moveTo(70, viz.height / 2); ctx.lineTo(viz.width - 20, viz.height / 2); ctx.stroke();
                            ctx.setLineDash([]);

                            // X labels
                            ctx.textAlign = 'center';
                            for (var xi = 0; xi <= 5; xi++) {
                                var xv = Math.round(xMax * xi / 5);
                                var px = 70 + chartW * xi / 5;
                                ctx.fillStyle = viz.colors.text;
                                ctx.fillText(xv, px, viz.height - 14);
                            }

                            // Difference curve
                            ctx.lineWidth = 1.5;
                            for (var k = 1; k < xs.length; k++) {
                                var d = diff[k];
                                ctx.strokeStyle = d >= 0 ? viz.colors.teal : viz.colors.red;
                                ctx.beginPath();
                                var px1 = 70 + (xs[k-1] / xMax) * chartW;
                                var py1 = (viz.height / 2) - (diff[k-1] / maxDiff) * (chartH / 2);
                                var px2 = 70 + (xs[k] / xMax) * chartW;
                                var py2 = (viz.height / 2) - (d / maxDiff) * (chartH / 2);
                                ctx.moveTo(px1, py1); ctx.lineTo(px2, py2); ctx.stroke();
                            }

                            // Stats
                            var bias = logWin / Math.max(logTotal, 1e-10);
                            ctx.fillStyle = viz.colors.white; ctx.font = '13px -apple-system,sans-serif'; ctx.textAlign = 'center';
                            ctx.fillText('\u03c0(x; 4, 3) \u2212 \u03c0(x; 4, 1)    [teal = 3 winning, red = 1 winning]', viz.width / 2, 18);
                            ctx.fillStyle = viz.colors.teal; ctx.font = '12px -apple-system,sans-serif';
                            ctx.fillText('3 wins ' + (bias * 100).toFixed(1) + '% of the time (log density, up to ' + xMax + ')', viz.width / 2, viz.height - 46);
                            ctx.fillStyle = viz.colors.text; ctx.font = '11px -apple-system,sans-serif';
                            ctx.fillText('Rubinstein-Sarnak (1994) predict \u224899.59% under GRH + Lin. Ind.', viz.width / 2, viz.height - 30);
                        }

                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Using the explicit formula, explain qualitatively why the residue class \\(3 \\pmod 4\\) should be favored over \\(1 \\pmod 4\\). (Hint: what does the character \\(\\chi_{-4}\\) contribute to the explicit formula, and which class is the quadratic residue class?)',
                    hint: 'The non-principal character mod 4 is \\(\\chi_1\\) with \\(\\chi_1(1)=1\\) and \\(\\chi_1(3)=-1\\). In the explicit formula for \\(\\pi(x;4,a)\\), the dominant term from \\(\\chi_1\\) zeros gives a negative contribution to \\(\\pi(x;4,1)\\) and a positive one to \\(\\pi(x;4,3)\\).',
                    solution: 'The explicit formula gives \\(\\pi(x;4,1) - \\pi(x;4,3) \\approx -\\frac{2}{\\sqrt{x}} \\sum_\\gamma \\frac{x^{i\\gamma}}{|\\rho|}\\). The leading bias comes from the term \\(-\\overline{\\chi_1(1)} \\cdot (-1) = +1\\) vs \\(-\\overline{\\chi_1(3)} \\cdot (-1) = -1\\) from the zeros. More precisely: 1 is a quadratic residue mod 4 (since \\(1^2 \\equiv 1\\)) while 3 is a non-residue. Non-residue classes receive a positive contribution from the lowest zero of \\(L(s,\\chi_1)\\) because \\(\\chi_1(3) = -1 < 0\\), which flips the sign and gives 3 an advantage.',
                    question2: 'Compute \\(\\pi(x;4,3) - \\pi(x;4,1)\\) for \\(x = 100, 1000\\) by direct count. What is the sign each time?',
                    hint2: 'List primes up to 1000 and classify each as 1 or 3 mod 4.',
                    solution2: 'Primes \\(\\equiv 1 \\pmod 4\\) up to 100: 5,13,17,29,37,41,53,61,73,89,97 (11 primes). Primes \\(\\equiv 3 \\pmod 4\\) up to 100: 3,7,11,19,23,31,43,47,59,67,71,79,83 (13 primes). Difference = 2. Up to 1000: count gives \\(\\pi(1000;4,3) - \\pi(1000;4,1) \\approx 172 - 167 = 5\\). Both positive, confirming the bias.'
                },
                {
                    question: 'State the Chebotarev density theorem for a Galois extension \\(K/\\mathbb{Q}\\) of degree \\(n\\). Show how Dirichlet\'s theorem is the special case \\(K = \\mathbb{Q}(\\zeta_q)\\) and \\(G = \\text{Gal}(K/\\mathbb{Q}) \\cong (\\mathbb{Z}/q\\mathbb{Z})^\\times\\).',
                    hint: 'The Frobenius element \\(\\text{Frob}_p \\in \\text{Gal}(K/\\mathbb{Q})\\) for an unramified prime \\(p\\) is the element sending \\(\\alpha \\mapsto \\alpha^p\\). For \\(K = \\mathbb{Q}(\\zeta_q)\\), \\(\\text{Frob}_p\\) is the map \\(\\zeta_q \\mapsto \\zeta_q^p\\), which corresponds to \\(p \\bmod q \\in (\\mathbb{Z}/q\\mathbb{Z})^\\times\\).',
                    solution: 'Chebotarev: for a Galois extension \\(K/\\mathbb{Q}\\) with group \\(G\\) and a conjugacy class \\(C \\subset G\\), the density of unramified primes \\(p\\) with \\(\\text{Frob}_p \\in C\\) equals \\(|C|/|G|\\). For \\(K = \\mathbb{Q}(\\zeta_q)\\): \\(G \\cong (\\mathbb{Z}/q\\mathbb{Z})^\\times\\) and \\(\\text{Frob}_p\\) corresponds to \\(p \\bmod q\\). A singleton class \\(\\{a\\}\\) has density \\(1/|G| = 1/\\varphi(q)\\), which is exactly Dirichlet\'s theorem. All conjugacy classes in an abelian group are singletons, so Dirichlet is Chebotarev for abelian extensions.'
                }
            ]
        }

    ]
});
