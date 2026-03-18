window.CHAPTERS = window.CHAPTERS || [];
window.CHAPTERS.push({
    id: 'ch09',
    number: 9,
    title: 'Dirichlet Characters & L-Functions',
    subtitle: 'Frequency filters for primes in arithmetic progressions',
    sections: [

        // ================================================================
        // SECTION 1: Motivation — Filtering Primes by Residue Class
        // ================================================================
        {
            id: 'sec-motivation',
            title: 'Filtering Primes by Residue Class',
            content: `
<h2>Filtering Primes by Residue Class</h2>

<div class="env-block intuition">
    <div class="env-title">The Central Question</div>
    <div class="env-body">
        <p>Are primes distributed evenly among the residue classes modulo \\(q\\)? For instance, among all large primes, roughly half should be \\(\\equiv 1 \\pmod{4}\\) and half \\(\\equiv 3 \\pmod{4}\\). Dirichlet proved this in 1837 — but the proof requires a completely new kind of tool: <em>characters</em>.</p>
    </div>
</div>

<p>The Prime Number Theorem tells us that primes up to \\(x\\) number about \\(x/\\log x\\). But it says nothing about <em>which</em> residue classes these primes fall into. The deeper question is:</p>

\\[
\\pi(x; q, a) := \\#\\{p \\leq x : p \\text{ prime}, p \\equiv a \\pmod{q}\\}
\\]

<p>For \\(\\gcd(a,q)=1\\), Dirichlet's Theorem says \\(\\pi(x;q,a) \\sim \\frac{1}{\\varphi(q)} \\frac{x}{\\log x}\\), meaning each eligible residue class gets an equal asymptotic share. The refinement, the <strong>Generalized Riemann Hypothesis</strong>, predicts the error in this equidistribution.</p>

<h3>Why the Zeta Function Isn't Enough</h3>

<p>The proof of the ordinary PNT exploits the Riemann zeta function \\(\\zeta(s) = \\sum_{n=1}^\\infty n^{-s}\\). To isolate a single residue class \\(a \\pmod{q}\\), we need a <em>filter</em>: a function that picks out \\(n \\equiv a \\pmod q\\) and kills all other residues.</p>

<p>The key identity is the <strong>orthogonality of characters</strong>:</p>

\\[
\\mathbf{1}[n \\equiv a \\pmod{q}] = \\frac{1}{\\varphi(q)} \\sum_{\\chi \\bmod q} \\chi(a)^{-1} \\chi(n).
\\]

<p>This is the analytic analogue of a discrete Fourier transform. Characters \\(\\chi\\) are the "frequency components" that, when summed, isolate any desired residue class.</p>

<h3>The Strategy in Three Steps</h3>

<ol>
    <li><strong>Define characters:</strong> multiplicative functions \\(\\chi: (\\mathbb{Z}/q\\mathbb{Z})^\\times \\to \\mathbb{C}^\\times\\) extended to \\(\\mathbb{Z}\\).</li>
    <li><strong>Form L-functions:</strong> \\(L(s,\\chi) = \\sum_{n=1}^\\infty \\chi(n) n^{-s}\\), with Euler product and analytic properties analogous to \\(\\zeta(s)\\).</li>
    <li><strong>Prove \\(L(1,\\chi) \\neq 0\\):</strong> The non-vanishing at \\(s=1\\) for non-principal \\(\\chi\\) is the deepest step, and it implies Dirichlet's Theorem.</li>
</ol>

<div class="viz-placeholder" data-viz="viz-prime-residue-counts"></div>

<div class="env-block remark">
    <div class="env-title">Historical Note</div>
    <div class="env-body">
        <p>Dirichlet's 1837 proof was a landmark: the first use of analysis (complex functions, infinite series) to prove a theorem about discrete objects (primes). It introduced both the concept of a "character" and the technique of forming Dirichlet series — tools that dominated number theory for the next two centuries.</p>
    </div>
</div>
`,
            visualizations: [
                {
                    id: 'viz-prime-residue-counts',
                    title: 'Primes in Arithmetic Progressions',
                    description: 'Count primes \\(\\leq x\\) in each residue class \\(a \\pmod{q}\\). Adjust \\(q\\) and \\(x\\) to see the equidistribution emerge.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, { width: 620, height: 340, originX: 60, originY: 280, scale: 1 });
                        var q = 4, xMax = 200;

                        VizEngine.createSlider(controls, 'modulus q', 3, 12, q, 1, function(v) { q = Math.round(v); draw(); });
                        VizEngine.createSlider(controls, 'x', 50, 500, xMax, 50, function(v) { xMax = Math.round(v); draw(); });

                        var primes = VizEngine.sievePrimes(600);

                        function gcd(a, b) { while (b) { var t = b; b = a % b; a = t; } return a; }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var residues = [];
                            for (var r = 1; r < q; r++) { if (gcd(r, q) === 1) residues.push(r); }
                            var phi = residues.length;

                            // Count primes in each residue class
                            var counts = {};
                            residues.forEach(function(r) { counts[r] = 0; });
                            primes.forEach(function(p) {
                                if (p <= xMax && counts[p % q] !== undefined) counts[p % q]++;
                            });

                            var maxCount = Math.max.apply(null, residues.map(function(r) { return counts[r]; })) || 1;
                            var chartH = 200;
                            var barW = Math.min(50, (viz.width - 120) / phi);
                            var gap = 8;
                            var totalW = phi * (barW + gap) - gap;
                            var startX = (viz.width - totalW) / 2;

                            // Y axis
                            ctx.strokeStyle = viz.colors.axis; ctx.lineWidth = 1;
                            ctx.beginPath(); ctx.moveTo(startX - 10, 20); ctx.lineTo(startX - 10, 220); ctx.stroke();

                            var colors = [viz.colors.blue, viz.colors.teal, viz.colors.orange, viz.colors.purple, viz.colors.green, viz.colors.red, viz.colors.yellow, viz.colors.pink];

                            residues.forEach(function(r, i) {
                                var c = counts[r];
                                var h = (c / maxCount) * chartH;
                                var x = startX + i * (barW + gap);
                                var y = 220 - h;
                                ctx.fillStyle = colors[i % colors.length] + 'aa';
                                ctx.fillRect(x, y, barW, h);
                                ctx.strokeStyle = colors[i % colors.length];
                                ctx.lineWidth = 1.5;
                                ctx.strokeRect(x, y, barW, h);

                                ctx.fillStyle = viz.colors.text;
                                ctx.font = '11px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.textBaseline = 'top';
                                ctx.fillText(r + ' mod ' + q, x + barW / 2, 226);
                                ctx.fillStyle = colors[i % colors.length];
                                ctx.fillText(c, x + barW / 2, y - 14);
                            });

                            // Y axis labels
                            ctx.fillStyle = viz.colors.text; ctx.font = '10px -apple-system,sans-serif'; ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
                            [0, 0.5, 1].forEach(function(f) {
                                var yy = 220 - f * chartH;
                                ctx.fillText(Math.round(f * maxCount), startX - 14, yy);
                                ctx.strokeStyle = viz.colors.grid; ctx.lineWidth = 0.5;
                                ctx.beginPath(); ctx.moveTo(startX - 10, yy); ctx.lineTo(viz.width - 20, yy); ctx.stroke();
                            });

                            // Title
                            viz.screenText('Primes \u2264 ' + xMax + ' by residue class mod ' + q + '   (\u03C6(' + q + ') = ' + phi + ' classes)', viz.width / 2, 12, viz.colors.white, 13);
                        }

                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'List all primes \\(p \\leq 50\\) and categorize them by their residue \\(\\pmod{4}\\). Are the counts equal? How many primes are \\(\\equiv 1\\) and how many are \\(\\equiv 3\\)?',
                    hint: 'The only prime that is \\(\\equiv 0\\) or \\(\\equiv 2 \\pmod 4\\) is \\(p = 2\\). All others are odd.',
                    solution: 'Primes \\(\\leq 50\\): 2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47. Excluding 2: \\(\\equiv 1\\pmod 4\\): 5, 13, 17, 29, 37, 41 (6 primes); \\(\\equiv 3\\pmod 4\\): 3, 7, 11, 19, 23, 31, 43, 47 (8 primes). The counts are not exactly equal for small \\(x\\) — the slight excess of \\(3\\pmod 4\\) primes is Chebyshev\'s bias — but asymptotically they equalize by Dirichlet\'s Theorem.'
                }
            ]
        },

        // ================================================================
        // SECTION 2: Dirichlet Characters
        // ================================================================
        {
            id: 'sec-characters',
            title: 'Dirichlet Characters',
            content: `
<h2>Dirichlet Characters</h2>

<div class="env-block definition">
    <div class="env-title">Definition 9.1 (Dirichlet Character mod \\(q\\))</div>
    <div class="env-body">
        <p>A <strong>Dirichlet character mod \\(q\\)</strong> is a completely multiplicative function \\(\\chi: \\mathbb{Z} \\to \\mathbb{C}\\) satisfying:</p>
        <ol>
            <li><strong>Periodicity:</strong> \\(\\chi(n+q) = \\chi(n)\\) for all \\(n\\).</li>
            <li><strong>Vanishing:</strong> \\(\\chi(n) = 0\\) if and only if \\(\\gcd(n,q) > 1\\).</li>
            <li><strong>Multiplicativity:</strong> \\(\\chi(mn) = \\chi(m)\\chi(n)\\) for all \\(m, n\\).</li>
        </ol>
        <p>The values \\(\\chi(n)\\) for \\(\\gcd(n,q)=1\\) are roots of unity of order dividing \\(\\varphi(q)\\).</p>
    </div>
</div>

<p>There are exactly \\(\\varphi(q)\\) distinct Dirichlet characters mod \\(q\\), one for each group homomorphism \\((\\mathbb{Z}/q\\mathbb{Z})^\\times \\to \\mathbb{C}^\\times\\). These form a group under pointwise multiplication: \\((\\chi_1 \\chi_2)(n) = \\chi_1(n)\\chi_2(n)\\).</p>

<h3>The Principal Character</h3>

<div class="env-block definition">
    <div class="env-title">Definition 9.2 (Principal Character)</div>
    <div class="env-body">
        <p>The <strong>principal character</strong> \\(\\chi_0\\) mod \\(q\\) is defined by</p>
        \\[\\chi_0(n) = \\begin{cases} 1 & \\text{if } \\gcd(n,q) = 1, \\\\ 0 & \\text{if } \\gcd(n,q) > 1. \\end{cases}\\]
        <p>It is the identity element of the character group.</p>
    </div>
</div>

<h3>Characters Mod 4</h3>

<p>For \\(q = 4\\), we have \\(\\varphi(4) = 2\\), so there are exactly 2 characters: \\(\\chi_0\\) (principal) and \\(\\chi_1\\) (the non-principal character, also called the <strong>Kronecker symbol</strong> \\(\\left(\\frac{-4}{\\cdot}\\right)\\)).</p>

\\[
\\begin{array}{c|cccc}
n \\bmod 4 & 0 & 1 & 2 & 3 \\\\ \\hline
\\chi_0(n) & 0 & 1 & 0 & 1 \\\\
\\chi_1(n) & 0 & 1 & 0 & -1
\\end{array}
\\]

<p>The non-principal character \\(\\chi_1\\) assigns \\(+1\\) to residues \\(\\equiv 1\\pmod 4\\) and \\(-1\\) to residues \\(\\equiv 3 \\pmod 4\\). Summing \\(\\chi_0(n) + \\chi_1(n)\\) gives \\(2 \\cdot \\mathbf{1}[n \\equiv 1 \\pmod 4]\\), and summing \\(\\chi_0(n) - \\chi_1(n)\\) gives \\(2 \\cdot \\mathbf{1}[n \\equiv 3 \\pmod 4]\\). This is the filter mechanism.</p>

<h3>Structure of the Character Group</h3>

<div class="env-block theorem">
    <div class="env-title">Theorem 9.1 (Character Group Structure)</div>
    <div class="env-body">
        <p>The group of characters mod \\(q\\) is isomorphic to \\((\\mathbb{Z}/q\\mathbb{Z})^\\times\\) as abstract groups. In particular, it is a finite abelian group of order \\(\\varphi(q)\\).</p>
        <p>Every character \\(\\chi\\) satisfies \\(|\\chi(n)| = 1\\) when \\(\\gcd(n,q)=1\\), and \\(\\chi^{\\varphi(q)} = \\chi_0\\) (the principal character).</p>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-character-table"></div>

<div class="env-block example">
    <div class="env-title">Example: Characters Mod 5</div>
    <div class="env-body">
        <p>Since \\((\\mathbb{Z}/5\\mathbb{Z})^\\times \\cong \\mathbb{Z}/4\\mathbb{Z}\\) (cyclic of order 4, generated by \\(2\\)), there are \\(\\varphi(5) = 4\\) characters. A generator of the character group sends \\(2 \\mapsto e^{2\\pi i / 4} = i\\). The four characters on the generator \\(g = 2\\):</p>
        <ul>
            <li>\\(\\chi_0: 2 \\mapsto 1\\)</li>
            <li>\\(\\chi_1: 2 \\mapsto i\\)</li>
            <li>\\(\\chi_2: 2 \\mapsto -1\\)</li>
            <li>\\(\\chi_3: 2 \\mapsto -i\\)</li>
        </ul>
        <p>These extend to all \\(n\\) by multiplicativity and periodicity.</p>
    </div>
</div>
`,
            visualizations: [
                {
                    id: 'viz-character-table',
                    title: 'Interactive Character Table mod \\(q\\)',
                    description: 'Select a modulus \\(q\\) to display all \\(\\varphi(q)\\) Dirichlet characters. Each row is a character; each column is a residue class. Colors encode phase of the (possibly complex) value.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, { width: 620, height: 320, originX: 0, originY: 0, scale: 1 });
                        var q = 5;

                        VizEngine.createSlider(controls, 'modulus q', 3, 12, q, 1, function(v) { q = Math.round(v); draw(); });

                        function gcd(a, b) { while (b) { var t = b; b = a % b; a = t; } return a; }
                        function modpow(base, exp, mod) {
                            var result = 1; base = base % mod;
                            while (exp > 0) { if (exp % 2 === 1) result = result * base % mod; exp = Math.floor(exp / 2); base = base * base % mod; }
                            return result;
                        }
                        function findGenerator(q) {
                            var phi = 0;
                            for (var i = 1; i < q; i++) if (gcd(i, q) === 1) phi++;
                            for (var g = 2; g < q; g++) {
                                if (gcd(g, q) !== 1) continue;
                                var ok = true;
                                for (var d = 1; d < phi; d++) {
                                    if (phi % d === 0 && modpow(g, d, q) === 1) { ok = false; break; }
                                }
                                if (ok) return { g: g, phi: phi };
                            }
                            return { g: 2, phi: phi };
                        }
                        function buildChars(q) {
                            // Compute discrete log table for coprime residues
                            var units = [];
                            for (var i = 1; i < q; i++) if (gcd(i, q) === 1) units.push(i);
                            var phi = units.length;
                            var gen = findGenerator(q);
                            var g = gen.g;

                            // discrete log: dlog[r] = k such that g^k ≡ r
                            var dlog = {};
                            var cur = 1;
                            for (var k = 0; k < phi; k++) { dlog[cur] = k; cur = cur * g % q; }

                            // Build phi characters: chi_j(n) = exp(2pi i * j * dlog[n] / phi)
                            var chars = [];
                            for (var j = 0; j < phi; j++) {
                                var chi = [];
                                for (var n = 0; n < q; n++) {
                                    if (gcd(n, q) > 1) { chi.push([0, 0]); }
                                    else {
                                        var angle = 2 * Math.PI * j * dlog[n] / phi;
                                        chi.push([Math.cos(angle), Math.sin(angle)]);
                                    }
                                }
                                chars.push(chi);
                            }
                            return { chars: chars, units: units, phi: phi };
                        }

                        function complexColor(re, im) {
                            if (re === 0 && im === 0) return '#222233';
                            var arg = Math.atan2(im, re);
                            var hue = (arg / Math.PI + 1) / 2;
                            var rgb = VizEngine.hslToRgb(hue, 0.8, 0.55);
                            return 'rgb(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ')';
                        }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var info = buildChars(q);
                            var chars = info.chars, phi = info.phi;

                            var colW = Math.min(44, (viz.width - 90) / q);
                            var rowH = Math.min(38, (viz.height - 60) / phi);
                            var startX = 80;
                            var startY = 50;

                            // Header
                            viz.screenText('Character table mod ' + q + '   (' + phi + ' characters)', viz.width / 2, 18, viz.colors.white, 13);
                            ctx.fillStyle = viz.colors.text; ctx.font = '11px -apple-system,sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';

                            // Column headers: n = 0..q-1
                            for (var n = 0; n < q; n++) {
                                ctx.fillStyle = gcd(n, q) > 1 ? viz.colors.text : viz.colors.blue;
                                ctx.fillText(n, startX + n * colW + colW / 2, startY - 16);
                            }
                            // n label
                            ctx.fillStyle = viz.colors.muted || '#666';
                            ctx.fillText('n:', startX - 20, startY - 16);

                            for (var j = 0; j < phi; j++) {
                                ctx.fillStyle = viz.colors.text; ctx.textAlign = 'right';
                                ctx.fillText('\\u03C7' + j, startX - 6, startY + j * rowH + rowH / 2);
                                for (var n2 = 0; n2 < q; n2++) {
                                    var val = chars[j][n2];
                                    var re = val[0], im = val[1];
                                    var cellX = startX + n2 * colW;
                                    var cellY = startY + j * rowH;
                                    // Color cell
                                    ctx.fillStyle = complexColor(re, im);
                                    ctx.fillRect(cellX + 1, cellY + 1, colW - 2, rowH - 2);
                                    // Value text
                                    ctx.fillStyle = '#ffffff';
                                    ctx.font = '9px -apple-system,sans-serif';
                                    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                                    var txt;
                                    if (re === 0 && im === 0) { txt = '0'; }
                                    else if (Math.abs(im) < 0.01) { txt = re > 0.5 ? '+1' : '-1'; }
                                    else if (Math.abs(re) < 0.01) { txt = im > 0 ? '+i' : '-i'; }
                                    else { txt = (re > 0 ? '+' : '') + re.toFixed(1) + (im > 0 ? '+' : '') + im.toFixed(1) + 'i'; }
                                    ctx.fillText(txt, cellX + colW / 2, cellY + rowH / 2);
                                }
                            }

                            // Legend
                            var legY = startY + phi * rowH + 12;
                            ctx.fillStyle = viz.colors.text; ctx.font = '10px -apple-system,sans-serif'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
                            ctx.fillText('Color = arg(\u03C7(n)).  Dark cell = \u03C7(n) = 0 (gcd(n,q) > 1)', startX, legY + 10);
                        }

                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Write out the full character table for \\(q = 8\\). How many characters are there? What is \\(\\varphi(8)\\)? List the characters on the units \\(\\{1, 3, 5, 7\\}\\).',
                    hint: '\\((\\mathbb{Z}/8\\mathbb{Z})^\\times \\cong \\mathbb{Z}/2\\mathbb{Z} \\times \\mathbb{Z}/2\\mathbb{Z}\\) (not cyclic). So there are \\(\\varphi(8) = 4\\) characters, each sending generators to \\(\\pm 1\\).',
                    solution: 'The units mod 8 are \\(\\{1,3,5,7\\}\\) and \\(\\varphi(8)=4\\). Since the group is \\(\\mathbb{Z}/2\\times\\mathbb{Z}/2\\), all characters take values \\(\\pm 1\\). Generators: \\(3^2 = 9 \\equiv 1\\), \\(5^2 \\equiv 1\\), \\(7 \\equiv -1\\). The four characters: \\(\\chi_0 = (1,1,1,1)\\), \\(\\chi_1 = (1,-1,1,-1)\\), \\(\\chi_2 = (1,1,-1,-1)\\), \\(\\chi_3 = (1,-1,-1,1)\\) on \\((1,3,5,7)\\).'
                },
                {
                    question: 'Show that if \\(\\chi\\) is a character mod \\(q\\), then \\(|\\chi(n)| = 1\\) for all \\(n\\) coprime to \\(q\\). What does this imply about the values \\(\\chi(n)\\) takes?',
                    hint: 'Use the fact that \\(n^{\\varphi(q)} \\equiv 1 \\pmod q\\) and \\(\\chi\\) is multiplicative.',
                    solution: 'Since \\(n^{\\varphi(q)} \\equiv 1 \\pmod q\\), multiplicativity gives \\(\\chi(n)^{\\varphi(q)} = \\chi(n^{\\varphi(q)}) = \\chi(1) = 1\\). So \\(\\chi(n)\\) is a \\(\\varphi(q)\\)-th root of unity, hence lies on the unit circle: \\(|\\chi(n)| = 1\\).'
                }
            ]
        },

        // ================================================================
        // SECTION 3: Orthogonality Relations
        // ================================================================
        {
            id: 'sec-orthogonality',
            title: 'Orthogonality Relations',
            content: `
<h2>Orthogonality Relations</h2>

<p>The power of characters lies in two orthogonality relations that turn character sums into indicator functions. These are the discrete Fourier analysis of the group \\((\\mathbb{Z}/q\\mathbb{Z})^\\times\\).</p>

<div class="env-block theorem">
    <div class="env-title">Theorem 9.2 (First Orthogonality Relation)</div>
    <div class="env-body">
        <p>For a fixed modulus \\(q\\) and any \\(n \\in \\mathbb{Z}\\):</p>
        \\[\\sum_{\\chi \\bmod q} \\chi(n) = \\begin{cases} \\varphi(q) & \\text{if } n \\equiv 1 \\pmod{q}, \\\\ 0 & \\text{otherwise (or if } \\gcd(n,q) > 1\\text{).} \\end{cases}\\]
    </div>
</div>

<div class="env-block proof">
    <div class="env-title">Proof Sketch</div>
    <div class="env-body">
        <p>If \\(n \\equiv 1 \\pmod q\\), then \\(\\chi(n) = \\chi(1) = 1\\) for all \\(\\chi\\), so the sum is \\(\\varphi(q)\\). If \\(\\gcd(n,q) = 1\\) but \\(n \\not\\equiv 1\\), choose a character \\(\\psi\\) with \\(\\psi(n) \\neq 1\\) (such \\(\\psi\\) exists since the character group separates elements). Then \\(\\psi(n) \\sum_\\chi \\chi(n) = \\sum_\\chi (\\psi\\chi)(n) = \\sum_\\chi \\chi(n)\\), forcing the sum to be zero. \\(\\square\\)</p>
    </div>
</div>

<div class="env-block theorem">
    <div class="env-title">Theorem 9.3 (Second Orthogonality Relation)</div>
    <div class="env-body">
        <p>For a fixed modulus \\(q\\) and characters \\(\\chi, \\psi\\) mod \\(q\\):</p>
        \\[\\sum_{n=1}^{q} \\chi(n) \\overline{\\psi(n)} = \\begin{cases} \\varphi(q) & \\text{if } \\chi = \\psi, \\\\ 0 & \\text{if } \\chi \\neq \\psi. \\end{cases}\\]
    </div>
</div>

<p>In inner product language: \\(\\langle \\chi, \\psi \\rangle = \\frac{1}{\\varphi(q)} \\sum_n \\chi(n)\\overline{\\psi(n)} = \\delta_{\\chi,\\psi}\\). The characters form an orthonormal basis for the space of class functions on \\((\\mathbb{Z}/q\\mathbb{Z})^\\times\\).</p>

<h3>The Indicator Function Formula</h3>

<p>Combining both relations, for \\(\\gcd(a,q) = 1\\):</p>

\\[
\\boxed{\\mathbf{1}[n \\equiv a \\pmod{q}] = \\frac{1}{\\varphi(q)} \\sum_{\\chi \\bmod q} \\chi(a)^{-1} \\chi(n) = \\frac{1}{\\varphi(q)} \\sum_{\\chi} \\overline{\\chi(a)} \\chi(n).}
\\]

<p>This identity — a discrete Fourier inversion formula — is the analytical engine behind Dirichlet's theorem. Applying it to the von Mangoldt function \\(\\Lambda\\) and summing over \\(n \\leq x\\) yields</p>

\\[
\\psi(x; q, a) = \\sum_{\\substack{n \\leq x \\\\ n \\equiv a}} \\Lambda(n) = \\frac{1}{\\varphi(q)} \\sum_\\chi \\overline{\\chi(a)} \\psi(x, \\chi),
\\]

where \\(\\psi(x,\\chi) = \\sum_{n \\leq x} \\chi(n)\\Lambda(n)\\). The asymptotic behavior of each \\(\\psi(x,\\chi)\\) is controlled by the zeros of \\(L(s,\\chi)\\).

<div class="viz-placeholder" data-viz="viz-character-filter"></div>
`,
            visualizations: [
                {
                    id: 'viz-character-filter',
                    title: 'Character Filter: Isolating a Residue Class',
                    description: 'Watch how summing \\(\\overline{\\chi(a)}\\chi(n)\\) over all \\(\\chi\\) creates a filter that equals \\(\\varphi(q)\\) at \\(n \\equiv a\\) and cancels to \\(0\\) elsewhere.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, { width: 620, height: 300, originX: 60, originY: 200, scale: 1 });
                        var q = 5, a = 1;

                        VizEngine.createSlider(controls, 'mod q', 3, 8, q, 1, function(v) { q = Math.round(v); if (a >= q) a = 1; draw(); });
                        VizEngine.createSlider(controls, 'target a', 1, 7, a, 1, function(v) { a = Math.round(v); draw(); });

                        function gcd(x, y) { while (y) { var t = y; y = x % y; x = t; } return x; }
                        function modpow(base, exp, mod) {
                            var r = 1; base %= mod;
                            while (exp > 0) { if (exp & 1) r = r * base % mod; exp >>= 1; base = base * base % mod; }
                            return r;
                        }
                        function findPhi(q) { var c = 0; for (var i = 1; i < q; i++) if (gcd(i, q) === 1) c++; return c; }
                        function findGen(q) {
                            var phi = findPhi(q);
                            for (var g = 2; g < q; g++) {
                                if (gcd(g, q) !== 1) continue;
                                var ok = true;
                                for (var d = 1; d < phi; d++) { if (phi % d === 0 && modpow(g, d, q) === 1) { ok = false; break; } }
                                if (ok) return { g: g, phi: phi };
                            }
                            return { g: 2, phi: phi };
                        }

                        function computeFilter(q, a) {
                            var gen = findGen(q);
                            var phi = gen.phi; var g = gen.g;
                            var dlog = {};
                            var cur = 1;
                            for (var k = 0; k < phi; k++) { dlog[cur] = k; cur = cur * g % q; }

                            var result = new Array(q).fill(0);
                            for (var n = 0; n < q; n++) {
                                if (gcd(n, q) > 1) { result[n] = 0; continue; }
                                if (gcd(a, q) > 1) { result[n] = 0; continue; }
                                var sum = 0;
                                for (var j = 0; j < phi; j++) {
                                    // chi_j(a)^{-1} * chi_j(n) = exp(-2pi i j dlog[a] / phi) * exp(2pi i j dlog[n] / phi)
                                    var angle = 2 * Math.PI * j * (dlog[n] - dlog[a]) / phi;
                                    sum += Math.cos(angle);
                                }
                                result[n] = sum;
                            }
                            return result;
                        }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var aEff = ((a % q) + q) % q;
                            if (aEff === 0) aEff = 1;
                            var filter = computeFilter(q, aEff);
                            var phi = findPhi(q);
                            var barW = Math.min(50, (viz.width - 120) / q);
                            var startX = 80;
                            var chartH = 160;

                            viz.screenText('Filter \u03A3\u03C7 \u03C7\u0304(a)\u03C7(n) for q=' + q + ', a=' + aEff + '    \u03C6(q)=' + phi, viz.width / 2, 14, viz.colors.white, 13);

                            for (var n = 0; n < q; n++) {
                                var val = filter[n];
                                var h = Math.abs(val / phi) * chartH;
                                var x = startX + n * (barW + 8);
                                var isTarget = (n === aEff);
                                ctx.fillStyle = isTarget ? viz.colors.green + 'cc' : viz.colors.blue + '77';
                                ctx.fillRect(x, 200 - h, barW, h);
                                ctx.strokeStyle = isTarget ? viz.colors.green : viz.colors.blue;
                                ctx.lineWidth = isTarget ? 2.5 : 1;
                                ctx.strokeRect(x, 200 - h, barW, h);

                                ctx.fillStyle = viz.colors.text; ctx.font = '11px -apple-system,sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'top';
                                ctx.fillText('n=' + n, x + barW / 2, 206);
                                ctx.fillStyle = isTarget ? viz.colors.green : viz.colors.white;
                                ctx.fillText(val.toFixed(1), x + barW / 2, 200 - h - 14);
                            }

                            // Axis
                            ctx.strokeStyle = viz.colors.axis; ctx.lineWidth = 1;
                            ctx.beginPath(); ctx.moveTo(startX - 10, 200); ctx.lineTo(viz.width - 20, 200); ctx.stroke();

                            ctx.fillStyle = viz.colors.teal; ctx.font = '12px -apple-system,sans-serif'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
                            ctx.fillText('\u03C6(q) = ' + phi + ' at n \u2261 a,  0 elsewhere', startX, 240);
                        }

                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Verify the second orthogonality relation for \\(q = 4\\): compute \\(\\sum_{n=1}^{4} \\chi_0(n)\\overline{\\chi_1(n)}\\) and \\(\\sum_{n=1}^{4} \\chi_1(n)\\overline{\\chi_1(n)}\\), where \\(\\chi_0, \\chi_1\\) are the two characters mod 4.',
                    hint: 'Only odd \\(n\\) contribute (even \\(n\\) give 0). Use the table from Section 2.',
                    solution: '\\(\\sum_{n=1}^4 \\chi_0(n)\\overline{\\chi_1(n)} = 0 + \\chi_0(1)\\overline{\\chi_1(1)} + 0 + \\chi_0(3)\\overline{\\chi_1(3)} = 1\\cdot 1 + 1\\cdot(-1) = 0\\). \\(\\sum_{n=1}^4 |\\chi_1(n)|^2 = 0 + 1 + 0 + 1 = 2 = \\varphi(4)\\). Both match Theorem 9.3.'
                }
            ]
        },

        // ================================================================
        // SECTION 4: Gauss Sums
        // ================================================================
        {
            id: 'sec-gauss-sums',
            title: 'Gauss Sums',
            content: `
<h2>Gauss Sums</h2>

<div class="env-block definition">
    <div class="env-title">Definition 9.3 (Gauss Sum)</div>
    <div class="env-body">
        <p>For a Dirichlet character \\(\\chi\\) mod \\(q\\), the <strong>Gauss sum</strong> is</p>
        \\[\\tau(\\chi) = \\sum_{n=1}^{q} \\chi(n) e^{2\\pi i n / q} = \\sum_{n \\bmod q} \\chi(n) e(n/q),\\]
        <p>where \\(e(x) = e^{2\\pi i x}\\).</p>
    </div>
</div>

<p>Gauss sums are the "Fourier transform" of a character. They appear in two critical contexts:</p>
<ol>
    <li><strong>Functional equations:</strong> The functional equation of \\(L(s,\\chi)\\) involves the factor \\(\\tau(\\chi)/\\sqrt{q}\\).</li>
    <li><strong>Character sum estimates:</strong> The estimate \\(|\\tau(\\chi)| = \\sqrt{q}\\) for primitive \\(\\chi\\) is the cornerstone of exponential sum bounds.</li>
</ol>

<div class="env-block theorem">
    <div class="env-title">Theorem 9.4 (Absolute Value of Gauss Sums)</div>
    <div class="env-body">
        <p>If \\(\\chi\\) is a <em>primitive</em> character mod \\(q\\), then</p>
        \\[|\\tau(\\chi)|^2 = q, \\quad \\text{i.e.,} \\quad |\\tau(\\chi)| = \\sqrt{q}.\\]
        <p>For the principal character \\(\\chi_0\\), \\(\\tau(\\chi_0) = \\mu(q)\\) (the Mobius function of \\(q\\)).</p>
    </div>
</div>

<div class="env-block proof">
    <div class="env-title">Proof of \\(|\\tau(\\chi)|^2 = q\\)</div>
    <div class="env-body">
        <p>Compute \\(|\\tau(\\chi)|^2 = \\tau(\\chi)\\overline{\\tau(\\chi)} = \\sum_{m,n} \\chi(m)\\overline{\\chi(n)} e((m-n)/q)\\). Substituting \\(n = m - k\\):</p>
        \\[= \\sum_{k=0}^{q-1} e(-k/q) \\sum_{m} \\chi(m)\\overline{\\chi(m-k)}.\\]
        <p>For primitive \\(\\chi\\), the inner sum \\(\\sum_m \\chi(m)\\overline{\\chi(m-k)}\\) equals \\(\\chi(-1)q\\) when \\(k = 0\\) and is related to Ramanujan sums otherwise. The full calculation gives \\(|\\tau(\\chi)|^2 = q\\). \\(\\square\\)</p>
    </div>
</div>

<h3>Connection to the Functional Equation</h3>

<p>The completed L-function \\(\\xi(s,\\chi)\\) satisfies a functional equation relating \\(s\\) to \\(1-s\\):</p>

\\[
\\xi(s, \\chi) = \\frac{\\tau(\\chi)}{i^a \\sqrt{q}} \\xi(1-s, \\bar{\\chi}),
\\]

where \\(a = 0\\) or \\(1\\) depending on the parity of \\(\\chi\\). The Gauss sum provides the "amplitude" of this symmetry. Since \\(|\\tau(\\chi)|/\\sqrt{q} = 1\\) for primitive \\(\\chi\\), this is a unitary symmetry.

<div class="viz-placeholder" data-viz="viz-gauss-sum-circle"></div>

<div class="env-block example">
    <div class="env-title">Example: Gauss Sum for \\(\\chi_1\\) mod 4</div>
    <div class="env-body">
        <p>\\(\\tau(\\chi_1) = \\chi_1(1)e(1/4) + \\chi_1(3)e(3/4) = e^{\\pi i/2} + (-1)e^{3\\pi i/2} = i + (-1)(-i) = i + i = 2i.\\)</p>
        <p>So \\(|\\tau(\\chi_1)| = 2 = \\sqrt{4} = \\sqrt{q}\\). \\(\\checkmark\\)</p>
    </div>
</div>
`,
            visualizations: [
                {
                    id: 'viz-gauss-sum-circle',
                    title: 'Gauss Sum on the Unit Circle',
                    description: 'Each term \\(\\chi(n) e^{2\\pi in/q}\\) is a unit-circle vector. Their vector sum is \\(\\tau(\\chi)\\). Change \\(q\\) and the character index to see how the partial sums trace a path that lands exactly at \\(\\sqrt{q}\\) distance from the origin.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, { width: 620, height: 340, originX: 310, originY: 170, scale: 70 });
                        var q = 5, chi_idx = 1;

                        VizEngine.createSlider(controls, 'mod q', 3, 10, q, 1, function(v) { q = Math.round(v); if (chi_idx >= findPhi(q)) chi_idx = 1; draw(); });
                        VizEngine.createSlider(controls, 'character \u03C7_j', 0, 5, chi_idx, 1, function(v) { chi_idx = Math.round(v); draw(); });

                        function gcd(a, b) { while (b) { var t = b; b = a % b; a = t; } return a; }
                        function modpow(base, exp, mod) { var r = 1; base %= mod; while (exp > 0) { if (exp & 1) r = r * base % mod; exp >>= 1; base = base * base % mod; } return r; }
                        function findPhi(q) { var c = 0; for (var i = 1; i < q; i++) if (gcd(i, q) === 1) c++; return c; }
                        function findGen(q) {
                            var phi = findPhi(q);
                            for (var g = 2; g < q; g++) {
                                if (gcd(g, q) !== 1) continue;
                                var ok = true;
                                for (var d = 1; d < phi; d++) { if (phi % d === 0 && modpow(g, d, q) === 1) { ok = false; break; } }
                                if (ok) return { g: g, phi: phi };
                            }
                            return { g: 2, phi: phi };
                        }
                        function getCharVal(n, j, q) {
                            if (gcd(n, q) > 1) return [0, 0];
                            var gen = findGen(q);
                            var phi = gen.phi, g = gen.g;
                            var dlog = {}; var cur = 1;
                            for (var k = 0; k < phi; k++) { dlog[cur] = k; cur = cur * g % q; }
                            var angle = 2 * Math.PI * j * dlog[n] / phi;
                            return [Math.cos(angle), Math.sin(angle)];
                        }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            // Unit circle
                            viz.drawCircle(0, 0, 1, null, viz.colors.grid + '66', 1);
                            viz.drawAxes();

                            var j = Math.min(chi_idx, findPhi(q) - 1);
                            var cx = 0, cy = 0;
                            var colors = [viz.colors.blue, viz.colors.teal, viz.colors.orange, viz.colors.purple, viz.colors.green, viz.colors.red, viz.colors.yellow];

                            for (var n = 1; n <= q; n++) {
                                var chi = getCharVal(n, j, q);
                                var eAngle = 2 * Math.PI * n / q;
                                // term = chi(n) * e^(2pi i n/q)
                                var re_e = Math.cos(eAngle), im_e = Math.sin(eAngle);
                                var tre = chi[0] * re_e - chi[1] * im_e;
                                var tim = chi[0] * im_e + chi[1] * re_e;
                                if (Math.abs(tre) < 1e-9 && Math.abs(tim) < 1e-9) continue;
                                viz.drawVector(cx, cy, cx + tre, cy + tim, colors[(n - 1) % colors.length], 'n=' + n, 1.5);
                                cx += tre; cy += tim;
                            }

                            // Final point
                            viz.drawPoint(cx, cy, viz.colors.red, '', 7);
                            var mag = Math.sqrt(cx * cx + cy * cy);
                            viz.screenText('\\u03C4(\\u03C7) = (' + cx.toFixed(2) + ', ' + cy.toFixed(2) + 'i)', viz.width / 2, 18, viz.colors.white, 12);
                            viz.screenText('|\\u03C4| = ' + mag.toFixed(3) + '   \\u221A' + q + ' = ' + Math.sqrt(q).toFixed(3), viz.width / 2, 32, viz.colors.teal, 12);
                        }

                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Compute \\(\\tau(\\chi_1)\\) for the non-principal character \\(\\chi_1\\) mod 5, where \\(\\chi_1(2) = i\\). Verify that \\(|\\tau(\\chi_1)| = \\sqrt{5}\\).',
                    hint: 'The values of \\(\\chi_1\\) on \\(1,2,3,4\\) mod 5 are \\(1, i, -i, -1\\) (since \\(3 = 2^3\\) mod 5, \\(4 = 2^2\\) mod 5). Multiply each by \\(e^{2\\pi in/5}\\) and sum.',
                    solution: '\\(\\chi_1(1)=1, \\chi_1(2)=i, \\chi_1(3)=-i, \\chi_1(4)=-1\\). So \\(\\tau(\\chi_1) = e^{2\\pi i/5} + i\\,e^{4\\pi i/5} + (-i)e^{6\\pi i/5} + (-1)e^{8\\pi i/5}\\). Numerical computation: \\(|\\tau(\\chi_1)|^2 = 5\\), so \\(|\\tau(\\chi_1)| = \\sqrt{5}\\). \\(\\checkmark\\)'
                }
            ]
        },

        // ================================================================
        // SECTION 5: L-Functions
        // ================================================================
        {
            id: 'sec-l-functions',
            title: 'L-Functions',
            content: `
<h2>Dirichlet L-Functions</h2>

<div class="env-block definition">
    <div class="env-title">Definition 9.4 (Dirichlet L-Function)</div>
    <div class="env-body">
        <p>For a Dirichlet character \\(\\chi\\) mod \\(q\\) and \\(\\text{Re}(s) > 1\\), the <strong>Dirichlet L-function</strong> is</p>
        \\[L(s, \\chi) = \\sum_{n=1}^{\\infty} \\chi(n) n^{-s}.\\]
        <p>It converges absolutely for \\(\\text{Re}(s) > 1\\) and has an <strong>Euler product</strong>:</p>
        \\[L(s, \\chi) = \\prod_{p \\text{ prime}} \\frac{1}{1 - \\chi(p)p^{-s}}.\\]
    </div>
</div>

<p>The Euler product follows from the complete multiplicativity of \\(\\chi\\) and unique factorization, exactly as for \\(\\zeta(s)\\). Notice that for the principal character \\(\\chi_0\\) mod \\(q\\):</p>

\\[L(s, \\chi_0) = \\prod_{p \\nmid q} \\frac{1}{1 - p^{-s}} = \\zeta(s) \\prod_{p \\mid q} (1 - p^{-s}).\\]

So \\(L(s,\\chi_0)\\) is essentially \\(\\zeta(s)\\) with finitely many Euler factors removed.

<h3>Analytic Continuation</h3>

<div class="env-block theorem">
    <div class="env-title">Theorem 9.5 (Analytic Continuation)</div>
    <div class="env-body">
        <p>For a non-principal character \\(\\chi\\), \\(L(s,\\chi)\\) extends to an <em>entire function</em> of \\(s\\) (no poles). For the principal character \\(\\chi_0\\) mod \\(q\\), \\(L(s,\\chi_0)\\) extends to all \\(\\mathbb{C}\\) except for a simple pole at \\(s = 1\\) with residue \\(\\varphi(q)/q\\).</p>
    </div>
</div>

<p>The continuation for non-principal \\(\\chi\\) uses partial summation: since \\(\\sum_{n=1}^N \\chi(n) = 0\\) for each complete period (by orthogonality), the partial sums are bounded. This allows the series to converge for \\(\\text{Re}(s) > 0\\).</p>

<h3>Euler Product and Logarithmic Derivative</h3>

<p>Taking the logarithmic derivative of the Euler product:</p>

\\[
-\\frac{L'}{L}(s, \\chi) = \\sum_{n=1}^\\infty \\chi(n) \\Lambda(n) n^{-s},
\\]

where \\(\\Lambda\\) is the von Mangoldt function. This is the Dirichlet series that directly connects \\(L(s,\\chi)\\) to prime counting.

<div class="viz-placeholder" data-viz="viz-euler-product-l"></div>

<div class="env-block example">
    <div class="env-title">Example: \\(L(s, \\chi_4)\\) at \\(s = 1\\)</div>
    <div class="env-body">
        <p>For the non-principal character mod 4 (with \\(\\chi_4(1) = 1, \\chi_4(3) = -1\\)):</p>
        \\[L(1, \\chi_4) = 1 - \\frac{1}{3} + \\frac{1}{5} - \\frac{1}{7} + \\cdots = \\frac{\\pi}{4}.\\]
        <p>This is Leibniz's formula for \\(\\pi\\)! The non-vanishing \\(L(1,\\chi_4) = \\pi/4 \\neq 0\\) is precisely what Dirichlet needed to prove infinitely many primes \\(\\equiv 1\\) and \\(\\equiv 3\\) mod 4.</p>
    </div>
</div>
`,
            visualizations: [
                {
                    id: 'viz-euler-product-l',
                    title: 'Euler Product Assembly for \\(L(s, \\chi_4)\\)',
                    description: 'Watch how multiplying successive prime factors \\((1 - \\chi_4(p)p^{-s})^{-1}\\) converges to \\(L(s, \\chi_4)\\) as \\(s\\) varies.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, { width: 620, height: 320, originX: 60, originY: 200, scale: 55 });
                        var sVal = 1.0, numPrimes = 20;

                        VizEngine.createSlider(controls, 'Re(s)', 0.6, 3.0, sVal, 0.05, function(v) { sVal = v; draw(); });
                        VizEngine.createSlider(controls, 'primes', 5, 50, numPrimes, 1, function(v) { numPrimes = Math.round(v); draw(); });

                        var primes = VizEngine.sievePrimes(250);

                        // chi_4: 1 mod 4 -> 1, 3 mod 4 -> -1, even -> 0
                        function chi4(p) { if (p === 2) return 0; return (p % 4 === 1) ? 1 : -1; }

                        // L(s, chi4) partial sum
                        function lPartialSum(s, N) {
                            var sum = 0;
                            for (var n = 1; n <= N; n++) {
                                var cn = (n % 2 === 0) ? 0 : (n % 4 === 1 ? 1 : -1);
                                sum += cn * Math.pow(n, -s);
                            }
                            return sum;
                        }
                        // Euler product up to P-th prime
                        function eulerProd(s, nP) {
                            var prod = 1.0;
                            for (var i = 0; i < nP && i < primes.length; i++) {
                                var p = primes[i];
                                var c = chi4(p);
                                prod /= (1 - c * Math.pow(p, -s));
                            }
                            return prod;
                        }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            // Exact value (use high partial sum)
                            var exact = lPartialSum(sVal, 2000);

                            // Build convergence sequence
                            var pts = [];
                            for (var k = 1; k <= numPrimes; k++) {
                                pts.push({ k: k, val: eulerProd(sVal, k) });
                            }

                            var yMin = Math.min.apply(null, pts.map(function(p) { return p.val; }));
                            var yMax = Math.max.apply(null, pts.map(function(p) { return p.val; }));
                            yMin = Math.min(yMin, exact) - 0.05;
                            yMax = Math.max(yMax, exact) + 0.05;
                            var range = yMax - yMin || 0.1;

                            var chartW = viz.width - 90;
                            var chartH = 180;
                            var baseX = 70, baseY = 210;

                            // Exact line
                            ctx.strokeStyle = viz.colors.green; ctx.lineWidth = 1.5; ctx.setLineDash([5, 4]);
                            var ey = baseY - (exact - yMin) / range * chartH;
                            ctx.beginPath(); ctx.moveTo(baseX, ey); ctx.lineTo(baseX + chartW, ey); ctx.stroke();
                            ctx.setLineDash([]);
                            ctx.fillStyle = viz.colors.green; ctx.font = '11px -apple-system,sans-serif'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
                            ctx.fillText('L(' + sVal.toFixed(2) + ',\u03C7\u2084) \u2248 ' + exact.toFixed(4), baseX + chartW - 150, ey - 10);

                            // Euler product convergence
                            ctx.strokeStyle = viz.colors.orange; ctx.lineWidth = 2;
                            ctx.beginPath();
                            pts.forEach(function(pt, i) {
                                var x = baseX + i / (numPrimes - 1) * chartW;
                                var y = baseY - (pt.val - yMin) / range * chartH;
                                i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
                            });
                            ctx.stroke();

                            // Dots
                            pts.forEach(function(pt, i) {
                                var x = baseX + i / (numPrimes - 1) * chartW;
                                var y = baseY - (pt.val - yMin) / range * chartH;
                                ctx.fillStyle = viz.colors.orange;
                                ctx.beginPath(); ctx.arc(x, y, 3, 0, Math.PI * 2); ctx.fill();
                            });

                            // Axes
                            ctx.strokeStyle = viz.colors.axis; ctx.lineWidth = 1;
                            ctx.beginPath(); ctx.moveTo(baseX, baseY + 5); ctx.lineTo(baseX + chartW, baseY + 5); ctx.stroke();
                            ctx.beginPath(); ctx.moveTo(baseX - 5, baseY - chartH); ctx.lineTo(baseX - 5, baseY + 5); ctx.stroke();

                            // Y labels
                            ctx.fillStyle = viz.colors.text; ctx.font = '10px -apple-system,sans-serif'; ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
                            [0, 0.5, 1].forEach(function(f) {
                                var yy = baseY - f * chartH;
                                ctx.fillText((yMin + f * range).toFixed(2), baseX - 8, yy);
                            });

                            // X label: prime count
                            ctx.fillStyle = viz.colors.text; ctx.textAlign = 'center'; ctx.textBaseline = 'top';
                            ctx.fillText('Number of prime factors included', baseX + chartW / 2, baseY + 10);

                            viz.screenText('Euler product for L(s, \u03C7\u2084)   s = ' + sVal.toFixed(2), viz.width / 2, 14, viz.colors.white, 13);
                        }

                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Show that \\(L(s, \\chi_0) = \\zeta(s)\\prod_{p|q}(1 - p^{-s})\\) for the principal character mod \\(q\\). Deduce that \\(L(s,\\chi_0)\\) has a simple pole at \\(s=1\\) with residue \\(\\varphi(q)/q\\).',
                    hint: 'In the Euler product, \\(\\chi_0(p) = 0\\) when \\(p \\mid q\\) and \\(\\chi_0(p) = 1\\) when \\(p \\nmid q\\). Use the residue of \\(\\zeta(s)\\) at \\(s=1\\).',
                    solution: '\\(L(s,\\chi_0) = \\prod_{p \\nmid q}(1-p^{-s})^{-1} = \\zeta(s) \\prod_{p|q}(1-p^{-s})\\). Near \\(s=1\\), \\(\\zeta(s) \\sim 1/(s-1)\\), so \\(\\text{Res}_{s=1} L(s,\\chi_0) = \\prod_{p|q}(1-p^{-1}) = \\varphi(q)/q\\) by the product formula for Euler\'s totient function.'
                },
                {
                    question: 'Compute \\(L(1, \\chi_4) = 1 - 1/3 + 1/5 - 1/7 + \\cdots\\) to 4 decimal places using the first 1000 terms, and compare with \\(\\pi/4\\).',
                    hint: 'The series converges slowly (conditionally). You can accelerate it: \\(\\pi/4 = \\arctan(1)\\).',
                    solution: 'Partial sum of 1000 terms \\(\\approx 0.7844\\). Exact value \\(\\pi/4 \\approx 0.7854\\). The series converges slowly as \\(O(1/N)\\). This is the Leibniz formula; \\(L(1,\\chi_4) = \\pi/4 \\neq 0\\).'
                }
            ]
        },

        // ================================================================
        // SECTION 6: Properties of L-Functions
        // ================================================================
        {
            id: 'sec-l-function-properties',
            title: 'Properties of L-Functions',
            content: `
<h2>Properties of Dirichlet L-Functions</h2>

<h3>Non-Vanishing on \\(\\text{Re}(s) = 1\\)</h3>

<p>The key step in Dirichlet's theorem is proving that \\(L(1, \\chi) \\neq 0\\) for all non-principal characters \\(\\chi\\). This is a deep result with no trivial proof.</p>

<div class="env-block theorem">
    <div class="env-title">Theorem 9.6 (Non-Vanishing at \\(s = 1\\))</div>
    <div class="env-body">
        <p>For every non-principal Dirichlet character \\(\\chi\\) mod \\(q\\),</p>
        \\[L(1, \\chi) \\neq 0.\\]
    </div>
</div>

<p>The proof splits into two cases:</p>

<p><strong>Case 1: \\(\\chi\\) is complex</strong> (i.e., \\(\\chi \\neq \\bar\\chi\\)). Consider</p>
\\[
F(s) = \\prod_{\\chi \\bmod q} L(s,\\chi) = \\prod_{p} \\prod_{\\chi} \\frac{1}{1-\\chi(p)p^{-s}}.
\\]
<p>For real \\(s > 1\\), one can show \\(F(s) \\geq 1\\) (all terms are positive reals). If \\(L(1,\\chi) = 0\\) for complex \\(\\chi\\), then \\(L(1,\\bar\\chi) = 0\\) too (complex conjugate), and the double zero cancels the simple pole of \\(L(s,\\chi_0)\\), making \\(F(s) \\to 0\\) as \\(s \\to 1^+\\), contradicting \\(F(s) \\geq 1\\).</p>

<p><strong>Case 2: \\(\\chi\\) is real</strong> (\\(\\chi = \\bar\\chi\\), i.e., \\(\\chi\\) takes only values \\(0, \\pm 1\\)). This case is harder; it uses the fact that \\(L(s,\\chi) \\cdot \\zeta(s)\\) has positive coefficients (since \\(\\sum_{d|n} \\chi(d) \\geq 0\\)), combined with the Phragmen-Lindelof principle.</p>

<h3>Zero-Free Region</h3>

<div class="env-block theorem">
    <div class="env-title">Theorem 9.7 (Zero-Free Region for \\(L(s,\\chi)\\))</div>
    <div class="env-body">
        <p>For non-principal \\(\\chi\\) mod \\(q\\), there exists \\(c > 0\\) such that \\(L(s,\\chi) \\neq 0\\) in the region</p>
        \\[\\sigma > 1 - \\frac{c}{\\log(q(|t|+2))},\\]
        <p>with the possible exception of at most one real zero (the <em>Siegel zero</em>), which can only arise for real \\(\\chi\\).</p>
    </div>
</div>

<h3>Functional Equation</h3>

<p>Define the completed L-function. Let \\(\\mathfrak{a} = 0\\) if \\(\\chi(-1) = 1\\) (even character) and \\(\\mathfrak{a} = 1\\) if \\(\\chi(-1) = -1\\) (odd). Set</p>

\\[
\\Lambda(s, \\chi) = \\left(\\frac{q}{\\pi}\\right)^{(s+\\mathfrak{a})/2} \\Gamma\\!\\left(\\frac{s+\\mathfrak{a}}{2}\\right) L(s,\\chi).
\\]

<div class="env-block theorem">
    <div class="env-title">Theorem 9.8 (Functional Equation)</div>
    <div class="env-body">
        <p>For primitive \\(\\chi\\) mod \\(q\\),</p>
        \\[\\Lambda(s, \\chi) = \\frac{\\tau(\\chi)}{i^{\\mathfrak{a}} \\sqrt{q}} \\Lambda(1-s, \\bar{\\chi}).\\]
        <p>In particular, the zeros of \\(L(s,\\chi)\\) in the critical strip \\(0 < \\text{Re}(s) < 1\\) are symmetric about \\(\\text{Re}(s) = 1/2\\) (via \\(s \\leftrightarrow 1 - s\\) with \\(\\chi \\to \\bar\\chi\\)).</p>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-l-function-zero-free"></div>

<div class="env-block remark">
    <div class="env-title">The Generalized Riemann Hypothesis (GRH)</div>
    <div class="env-body">
        <p>The GRH asserts that for every Dirichlet character \\(\\chi\\), all non-trivial zeros of \\(L(s,\\chi)\\) satisfy \\(\\text{Re}(s) = 1/2\\). Under GRH, one has the sharp bound \\(\\pi(x;q,a) = \\text{Li}(x)/\\varphi(q) + O(\\sqrt{x}\\log(qx))\\), uniform in \\(q\\).</p>
    </div>
</div>
`,
            visualizations: [
                {
                    id: 'viz-l-function-zero-free',
                    title: 'Zero-Free Region Schematic for \\(L(s,\\chi)\\)',
                    description: 'Visualize the known zero-free region for \\(L(s,\\chi)\\) in the critical strip, compared to the conjectured GRH line \\(\\text{Re}(s) = 1/2\\).',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, { width: 620, height: 340, originX: 80, originY: 170, scale: 130 });

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            // Background: critical strip
                            var [x0] = viz.toScreen(0, 0);
                            var [x1] = viz.toScreen(1, 0);
                            ctx.fillStyle = '#1a1a35';
                            ctx.fillRect(x0, 0, x1 - x0, viz.height);

                            // Zero-free region: sigma > 1 - c/log(q(|t|+2))
                            var c = 0.06;
                            ctx.fillStyle = viz.colors.green + '22';
                            ctx.beginPath();
                            var steps = 100;
                            for (var i = 0; i <= steps; i++) {
                                var t = -3 + 6 * i / steps;
                                var sigma = 1 - c / Math.log(2 + Math.abs(t));
                                var [sx, sy] = viz.toScreen(sigma, t);
                                i === 0 ? ctx.moveTo(sx, sy) : ctx.lineTo(sx, sy);
                            }
                            var [sx1] = viz.toScreen(1.2, -3);
                            var [sx2] = viz.toScreen(1.2, 3);
                            ctx.lineTo(sx1, sy); ctx.lineTo(sx2, viz.toScreen(1.2, -3)[1]);
                            ctx.closePath(); ctx.fill();

                            // Zero-free boundary
                            ctx.strokeStyle = viz.colors.green; ctx.lineWidth = 2;
                            ctx.beginPath();
                            for (var i2 = 0; i2 <= steps; i2++) {
                                var t2 = -3 + 6 * i2 / steps;
                                var s2 = 1 - c / Math.log(2 + Math.abs(t2));
                                var [sx3, sy3] = viz.toScreen(s2, t2);
                                i2 === 0 ? ctx.moveTo(sx3, sy3) : ctx.lineTo(sx3, sy3);
                            }
                            ctx.stroke();

                            // GRH line: Re(s) = 1/2
                            ctx.strokeStyle = viz.colors.purple; ctx.lineWidth = 2; ctx.setLineDash([6, 4]);
                            var [ghx] = viz.toScreen(0.5, 0);
                            ctx.beginPath(); ctx.moveTo(ghx, 0); ctx.lineTo(ghx, viz.height); ctx.stroke();
                            ctx.setLineDash([]);

                            // Re(s) = 1 line
                            ctx.strokeStyle = viz.colors.blue; ctx.lineWidth = 1.5; ctx.setLineDash([4, 3]);
                            var [onex] = viz.toScreen(1, 0);
                            ctx.beginPath(); ctx.moveTo(onex, 0); ctx.lineTo(onex, viz.height); ctx.stroke();
                            ctx.setLineDash([]);

                            // Schematic zeros on Re=1/2
                            var zeroTs = [1.4, 2.1, 2.7, -1.4, -2.1, -2.7];
                            zeroTs.forEach(function(t) {
                                viz.drawPoint(0.5, t, viz.colors.red, '', 5);
                            });

                            viz.drawAxes();

                            // Labels
                            ctx.fillStyle = viz.colors.green; ctx.font = '11px -apple-system,sans-serif'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
                            ctx.fillText('Zero-free region', viz.toScreen(0.85, 2.7)[0], viz.toScreen(0.85, 2.7)[1]);
                            ctx.fillStyle = viz.colors.purple;
                            ctx.fillText('GRH: Re(s)=1/2', viz.toScreen(0.5, -3.1)[0] + 4, viz.toScreen(0.5, -3.1)[1]);
                            ctx.fillStyle = viz.colors.red;
                            ctx.fillText('zeros', viz.toScreen(0.56, 2.1)[0], viz.toScreen(0.56, 2.1)[1]);

                            viz.screenText('Critical strip and zero-free region for L(s,\u03C7)', viz.width / 2, 14, viz.colors.white, 13);
                        }

                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Explain in your own words why \\(L(s, \\chi_0)\\) has a pole at \\(s = 1\\) but \\(L(s, \\chi) \\) for non-principal \\(\\chi\\) does not. What is the residue of \\(L(s,\\chi_0)\\) at \\(s=1\\) for \\(q = 7\\)?',
                    hint: 'Compare \\(L(s,\\chi_0)\\) to \\(\\zeta(s)\\). For the residue, use \\(\\varphi(7)/7\\).',
                    solution: '\\(L(s,\\chi_0) = \\zeta(s)\\prod_{p|q}(1-p^{-s})\\) inherits the pole of \\(\\zeta\\) at \\(s=1\\). For non-principal \\(\\chi\\), the partial sums \\(\\sum_{n \\leq N}\\chi(n)\\) are bounded (they have period \\(q\\) and sum to 0 over each period), so the Dirichlet series converges for \\(\\text{Re}(s) > 0\\) and is entire. Residue at \\(s=1\\): \\(\\varphi(7)/7 = 6/7\\).'
                }
            ]
        },

        // ================================================================
        // SECTION 7: Proving Dirichlet's Theorem
        // ================================================================
        {
            id: 'sec-bridge',
            title: "Proving Dirichlet's Theorem",
            content: `
<h2>Proving Dirichlet's Theorem</h2>

<div class="env-block theorem">
    <div class="env-title">Theorem 9.9 (Dirichlet's Theorem on Primes in Progressions, 1837)</div>
    <div class="env-body">
        <p>Let \\(q \\geq 1\\) and \\(a\\) with \\(\\gcd(a,q) = 1\\). Then there are <em>infinitely many</em> primes \\(p \\equiv a \\pmod{q}\\). Moreover,</p>
        \\[\\sum_{\\substack{p \\leq x \\\\ p \\equiv a \\pmod q}} \\frac{1}{p} \\to \\infty \\quad \\text{as } x \\to \\infty.\\]
    </div>
</div>

<h3>Proof Roadmap</h3>

<p>We work with</p>
\\[
\\psi(x; q, a) = \\sum_{\\substack{n \\leq x \\\\ n \\equiv a}} \\Lambda(n).
\\]

<p><strong>Step 1 (Orthogonality decomposition):</strong></p>
\\[
\\psi(x; q, a) = \\frac{1}{\\varphi(q)} \\sum_{\\chi \\bmod q} \\overline{\\chi(a)} \\psi(x, \\chi), \\quad \\psi(x,\\chi) = \\sum_{n \\leq x} \\Lambda(n) \\chi(n).
\\]

<p><strong>Step 2 (Explicit formula for \\(\\psi(x, \\chi)\\)):</strong> Perron's formula gives</p>
\\[
\\psi(x, \\chi) = -\\sum_{\\rho: L(\\rho,\\chi)=0} \\frac{x^\\rho}{\\rho} - \\delta_{\\chi, \\chi_0} \\log x + \\cdots
\\]
where the sum is over non-trivial zeros of \\(L(s,\\chi)\\).

<p><strong>Step 3 (Contribution of the principal character):</strong> The \\(\\chi_0\\) term gives \\(\\psi(x,\\chi_0) \\sim x\\) (using the PNT for \\(\\zeta\\)).</p>

<p><strong>Step 4 (Non-principal characters):</strong> For \\(\\chi \\neq \\chi_0\\), one needs \\(\\psi(x,\\chi) = o(x)\\). This requires both:</p>
<ul>
    <li>That \\(L(s,\\chi)\\) has no zeros with \\(\\text{Re}(\\rho) \\geq 1\\) — which follows from \\(L(1,\\chi) \\neq 0\\).</li>
    <li>A zero-free region to bound the sum over zeros.</li>
</ul>

<p><strong>Step 5 (Conclusion):</strong> Assembling:</p>
\\[
\\psi(x; q, a) = \\frac{x}{\\varphi(q)} + o(x),
\\]
which implies infinitely many primes (and equidistribution) in the class \\(a \\pmod q\\).

<h3>Why \\(L(1,\\chi) \\neq 0\\) Is the Key</h3>

<p>If \\(L(1,\\chi_1) = 0\\) for some non-principal character, then \\(\\psi(x,\\chi_1)\\) would have a term \\(-x^1/1 = -x\\), which would cancel the main term from \\(\\chi_0\\) and make \\(\\psi(x;q,a) = 0\\) — meaning no primes in the class \\(a\\). The non-vanishing is not just a technical detail; it is the entire content of the theorem.</p>

<div class="env-block remark">
    <div class="env-title">Quantitative Form: Siegel-Walfisz Theorem</div>
    <div class="env-body">
        <p>For any \\(A > 0\\) and \\(q \\leq (\\log x)^A\\):</p>
        \\[\\psi(x; q, a) = \\frac{x}{\\varphi(q)} + O_A\\!\\left(\\frac{x}{(\\log x)^A}\\right).\\]
        <p>The error term is essentially optimal without GRH. The implicit constant depends on \\(A\\) in an ineffective (non-computable) way due to the possible Siegel zero.</p>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-dirichlet-pnt"></div>

<div class="env-block intuition">
    <div class="env-title">The Big Picture</div>
    <div class="env-body">
        <p>Dirichlet characters are exactly the right "frequency filters" for primes. By decomposing the prime counting function into a superposition of \\(\\varphi(q)\\) L-function contributions, each \\(L(s,\\chi)\\) handles one "mode." Non-vanishing of \\(L(1,\\chi)\\) ensures each mode contributes the right asymptotic share. This blueprint — decompose, analyze each component, recombine — drives all of analytic number theory.</p>
    </div>
</div>
`,
            visualizations: [
                {
                    id: 'viz-dirichlet-pnt',
                    title: "Equidistribution: \\(\\psi(x;q,a)/x \\to 1/\\varphi(q)\\)",
                    description: 'Plot \\(\\psi(x;q,a)/x\\) versus \\(x\\) for each coprime residue class. All curves converge to the same limit \\(1/\\varphi(q)\\), confirming equidistribution.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, { width: 620, height: 300, originX: 60, originY: 250, scale: 1 });
                        var q = 4;

                        VizEngine.createSlider(controls, 'mod q', 3, 10, q, 1, function(v) { q = Math.round(v); draw(); });

                        var primes = VizEngine.sievePrimes(1000);

                        function gcd(a, b) { while (b) { var t = b; b = a % b; a = t; } return a; }
                        function findPhi(q) { var c = 0; for (var i = 1; i < q; i++) if (gcd(i, q) === 1) c++; return c; }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var phi = findPhi(q);
                            var residues = [];
                            for (var r = 1; r < q; r++) if (gcd(r, q) === 1) residues.push(r);

                            var xMax = 800;
                            var chartW = viz.width - 80;
                            var chartH = 200;
                            var baseX = 70, baseY = 240;

                            // Limit line
                            var limit = 1.0 / phi;
                            var ly = baseY - limit * chartH * phi; // normalize so limit = some fixed height
                            ctx.strokeStyle = viz.colors.green + '88'; ctx.lineWidth = 1.5; ctx.setLineDash([5, 4]);
                            ctx.beginPath(); ctx.moveTo(baseX, baseY - chartH); ctx.lineTo(baseX + chartW, baseY - chartH); ctx.stroke();
                            ctx.setLineDash([]);
                            ctx.fillStyle = viz.colors.green; ctx.font = '11px -apple-system,sans-serif'; ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
                            ctx.fillText('1/\u03C6(q) = 1/' + phi, baseX - 4, baseY - chartH);

                            var colors = [viz.colors.blue, viz.colors.teal, viz.colors.orange, viz.colors.purple, viz.colors.red, viz.colors.yellow, viz.colors.pink];

                            residues.forEach(function(a, ri) {
                                // Build psi(x; q, a)/x
                                var psiSum = 0;
                                var pts = [];
                                var xStep = Math.max(1, Math.floor(xMax / 100));
                                var primeIdx = 0;
                                for (var x = 2; x <= xMax; x += xStep) {
                                    while (primeIdx < primes.length && primes[primeIdx] <= x) {
                                        var p = primes[primeIdx];
                                        if (p % q === a) psiSum += Math.log(p);
                                        primeIdx++;
                                    }
                                    pts.push([x, psiSum / x * phi]); // scale so limit = 1
                                }

                                ctx.strokeStyle = colors[ri % colors.length]; ctx.lineWidth = 1.5;
                                ctx.beginPath();
                                pts.forEach(function(pt, i) {
                                    var px = baseX + (pt[0] / xMax) * chartW;
                                    var py = baseY - Math.min(pt[1], 2) * chartH;
                                    i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
                                });
                                ctx.stroke();

                                // Legend
                                ctx.fillStyle = colors[ri % colors.length];
                                ctx.font = '10px -apple-system,sans-serif'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
                                ctx.fillText(a + ' mod ' + q, baseX + chartW - 150 + ri * 55, baseY - chartH - 14);
                            });

                            // Axes
                            ctx.strokeStyle = viz.colors.axis; ctx.lineWidth = 1;
                            ctx.beginPath(); ctx.moveTo(baseX, baseY); ctx.lineTo(baseX + chartW, baseY); ctx.stroke();
                            ctx.beginPath(); ctx.moveTo(baseX, baseY); ctx.lineTo(baseX, baseY - chartH - 10); ctx.stroke();

                            ctx.fillStyle = viz.colors.text; ctx.font = '10px -apple-system,sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'top';
                            ctx.fillText('x', baseX + chartW + 10, baseY - 6);
                            ctx.fillText(xMax, baseX + chartW, baseY + 4);
                            ctx.fillText('0', baseX - 8, baseY + 4);

                            ctx.fillStyle = viz.colors.text; ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
                            ctx.fillText('1 (= \u03C6(q) \u00D7 1/\u03C6(q))', baseX - 4, baseY - chartH);
                            ctx.fillText('0', baseX - 4, baseY);

                            viz.screenText('\u03C8(x;q,a) \u00D7 \u03C6(q)/x  \u2192  1  for all a coprime to q=' + q, viz.width / 2, 12, viz.colors.white, 13);
                        }

                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Use the orthogonality decomposition to write \\(\\psi(x; 4, 1)\\) and \\(\\psi(x; 4, 3)\\) explicitly in terms of \\(\\psi(x, \\chi_0)\\) and \\(\\psi(x, \\chi_1)\\) for the two characters mod 4.',
                    hint: '\\(\\overline{\\chi_0(1)} = 1\\), \\(\\overline{\\chi_1(1)} = 1\\), \\(\\overline{\\chi_1(3)} = -1\\).',
                    solution: '\\(\\psi(x;4,1) = \\frac{1}{2}[\\psi(x,\\chi_0) + \\psi(x,\\chi_1)]\\). \\(\\psi(x;4,3) = \\frac{1}{2}[\\psi(x,\\chi_0) - \\psi(x,\\chi_1)]\\). Since \\(\\psi(x,\\chi_0) \\sim x\\) and \\(L(1,\\chi_1)\\neq 0\\) implies \\(\\psi(x,\\chi_1) = o(x)\\), both converge to \\(x/2\\).'
                },
                {
                    question: 'State precisely what would go wrong in the proof of Dirichlet\'s theorem if we had \\(L(1,\\chi_1) = 0\\) for the non-principal character \\(\\chi_1\\) mod 4.',
                    hint: 'Think about the explicit formula for \\(\\psi(x,\\chi_1)\\) and what a zero at \\(s=1\\) contributes.',
                    solution: 'If \\(L(1,\\chi_1) = 0\\), then \\(s=1\\) is a zero of \\(L(s,\\chi_1)\\) in the explicit formula for \\(\\psi(x,\\chi_1)\\). This contributes a term \\(-x^1/1 = -x\\). Then \\(\\psi(x;4,1) = \\frac{1}{2}[x + (-x) + \\text{lower order}] \\to 0\\), suggesting no primes \\(\\equiv 1\\pmod 4\\) beyond some point — a contradiction. The non-vanishing at \\(s=1\\) prevents this cancellation.'
                },
                {
                    question: 'Verify directly that there are infinitely many primes \\(\\equiv 3 \\pmod{4}\\) without using L-functions, by adapting Euclid\'s proof. Why does this argument not extend to primes \\(\\equiv 1 \\pmod{4}\\)?',
                    hint: 'If \\(p_1, \\ldots, p_k\\) are all primes \\(\\equiv 3\\pmod 4\\), consider \\(N = 4p_1\\cdots p_k - 1\\). For primes \\(\\equiv 1 \\pmod 4\\), try a similar product and see why the argument breaks.',
                    solution: 'Let \\(N = 4p_1 \\cdots p_k - 1 \\equiv 3 \\pmod 4\\). Then \\(N > 1\\) and every prime factor \\(p\\) of \\(N\\) satisfies \\(p \\neq p_i\\) (since \\(p \\nmid N\\)). Since \\(N \\equiv 3 \\pmod 4\\), at least one prime factor must be \\(\\equiv 3 \\pmod 4\\), giving a new prime of this type — contradiction. For \\(\\equiv 1 \\pmod 4\\): taking \\(N = 4p_1\\cdots p_k + 1\\) gives \\(N \\equiv 1 \\pmod 4\\), but all prime factors could be \\(\\equiv 3 \\pmod 4\\) (product of two such is \\(\\equiv 1\\)). The argument breaks because the product of \\(\\equiv 3\\) residues can be \\(\\equiv 1\\). This is why L-functions are needed for the general case.'
                }
            ]
        }

    ] // end sections
});
