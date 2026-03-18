window.CHAPTERS = window.CHAPTERS || [];
window.CHAPTERS.push({
    id: 'ch09',
    number: 9,
    title: 'Dirichlet Characters & L-Functions',
    subtitle: 'Frequency filters for primes in arithmetic progressions',
    sections: [
        // ================================================================
        // SECTION 1: Motivation — Why Characters?
        // ================================================================
        {
            id: 'sec-motivation',
            title: 'Why Characters?',
            content: `
<h2>Why Characters?</h2>

<div class="env-block intuition">
    <div class="env-title">The Filtering Problem</div>
    <div class="env-body">
        <p>Euler proved there are infinitely many primes by showing \\(\\prod_p (1-p^{-1})^{-1}\\) diverges. But this product treats all primes equally. What if we want to count only primes in a specific residue class, say \\(p \\equiv 1 \\pmod{4}\\)?</p>
        <p>We need a tool that "lights up" integers in a given residue class and vanishes on the rest, something that respects multiplicative structure so it can slot into Euler products. Dirichlet characters are precisely such filters.</p>
    </div>
</div>

<p>Consider the arithmetic progression \\(a, a+q, a+2q, \\ldots\\) where \\(\\gcd(a,q)=1\\). Dirichlet's theorem (1837) asserts this progression contains infinitely many primes. The proof requires separating the contribution of primes \\(p \\equiv a \\pmod{q}\\) from all other primes. Attempting this directly is hopeless: the Euler product \\(\\prod_p (1-p^{-s})^{-1}\\) mixes all residue classes together.</p>

<p>Dirichlet's brilliant idea was to borrow from Fourier analysis. In signal processing, to isolate a frequency component, you multiply by a sinusoidal filter and integrate. The discrete analogue for the group \\((\\mathbb{Z}/q\\mathbb{Z})^\\times\\) is a <em>Dirichlet character</em>: a multiplicative function \\(\\chi\\colon \\mathbb{Z} \\to \\mathbb{C}\\) that is periodic mod \\(q\\) and vanishes on integers sharing a factor with \\(q\\).</p>

<h3>The Analogy with Fourier Analysis</h3>

<p>For a finite abelian group \\(G\\) of order \\(n\\), the characters \\(\\hat{G} = \\{\\chi_1, \\ldots, \\chi_n\\}\\) form a basis for functions on \\(G\\), just as \\(\\{e^{2\\pi i k x/n}\\}\\) form a basis for periodic functions. The orthogonality relations are the discrete analogue of \\(\\int_0^1 e^{2\\pi i k x} e^{-2\\pi i l x}\\, dx = \\delta_{kl}\\).</p>

<p>When we form \\(L(s,\\chi) = \\sum_{n=1}^\\infty \\chi(n) n^{-s}\\), the character "twists" each term by a root of unity that depends on \\(n \\bmod q\\). Summing \\(\\overline{\\chi(a)} L(s,\\chi)\\) over all characters extracts exactly the primes \\(\\equiv a \\pmod{q}\\), just as an inverse Fourier transform recovers a single frequency component.</p>

<div class="env-block remark">
    <div class="env-title">Historical Note</div>
    <div class="env-body">
        <p>Dirichlet introduced these ideas in his 1837 paper <em>Beweis des Satzes, dass jede unbegrenzte arithmetische Progression...</em>, one of the founding documents of analytic number theory. The character concept predates abstract group theory; Dedekind and Frobenius later placed it in a general algebraic framework. The modern perspective via the dual group \\(\\widehat{G}\\) makes the Fourier analogy explicit.</p>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-character-filter"></div>
`,
            visualizations: [
                {
                    id: 'viz-character-filter',
                    title: 'Characters as Frequency Filters',
                    description: 'Integers 1 through N are displayed on a number line. Choose a character mod q. Watch how the character assigns complex values (shown as colored arrows) to each integer, vanishing on those sharing a factor with q. Primes in a specific residue class "resonate" with the matching character.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 380,
                            originX: 0, originY: 0, scale: 1
                        });

                        var qVal = 5;
                        var chiIdx = 1;

                        function gcd(a, b) { while (b) { var t = b; b = a % b; a = t; } return a; }

                        function getCharsModQ(q) {
                            // Compute all Dirichlet characters mod q via generators
                            var coprime = [];
                            for (var i = 1; i < q; i++) if (gcd(i, q) === 1) coprime.push(i);
                            var phi = coprime.length;
                            // Find primitive root or use discrete log table
                            var order = {};
                            for (var j = 0; j < phi; j++) {
                                var g = coprime[j], o = 1, v = g % q;
                                while (v !== 1) { v = (v * g) % q; o++; }
                                order[g] = o;
                            }
                            // Find a generator (primitive root if exists)
                            var gen = null;
                            for (var k = 0; k < phi; k++) {
                                if (order[coprime[k]] === phi) { gen = coprime[k]; break; }
                            }
                            var chars = [];
                            if (gen) {
                                // Cyclic group
                                var dlogs = {};
                                var pw = 1;
                                for (var m = 0; m < phi; m++) { dlogs[pw] = m; pw = (pw * gen) % q; }
                                for (var c = 0; c < phi; c++) {
                                    var chi = {};
                                    for (var n = 0; n < q; n++) {
                                        if (gcd(n, q) === 1) {
                                            var angle = 2 * Math.PI * c * dlogs[n % q] / phi;
                                            chi[n] = [Math.cos(angle), Math.sin(angle)];
                                        } else {
                                            chi[n] = [0, 0];
                                        }
                                    }
                                    chars.push(chi);
                                }
                            } else {
                                // Non-cyclic; just provide principal character
                                var chi0 = {};
                                for (var n2 = 0; n2 < q; n2++) {
                                    chi0[n2] = gcd(n2, q) === 1 ? [1, 0] : [0, 0];
                                }
                                chars.push(chi0);
                            }
                            return chars;
                        }

                        var allChars = getCharsModQ(qVal);

                        VizEngine.createSlider(controls, 'q (modulus)', 3, 12, qVal, 1, function(v) {
                            qVal = Math.round(v);
                            allChars = getCharsModQ(qVal);
                            chiIdx = Math.min(chiIdx, allChars.length - 1);
                            draw();
                        });
                        VizEngine.createSlider(controls, 'Character index', 0, 10, chiIdx, 1, function(v) {
                            chiIdx = Math.min(Math.round(v), allChars.length - 1);
                            draw();
                        });

                        var primeSet = {};
                        var primes = VizEngine.sievePrimes(60);
                        for (var pp = 0; pp < primes.length; pp++) primeSet[primes[pp]] = true;

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var N = 40;
                            var chi = allChars[chiIdx];
                            var cols = 10;
                            var cellW = 48;
                            var cellH = 34;
                            var startX = (viz.width - cols * cellW) / 2;
                            var startY = 50;

                            viz.screenText('Character \u03C7_' + chiIdx + ' mod ' + qVal, viz.width / 2, 20, viz.colors.white, 15);
                            viz.screenText(chiIdx === 0 ? '(principal character)' : '(non-trivial character)', viz.width / 2, 36, viz.colors.text, 11);

                            for (var n = 1; n <= N; n++) {
                                var row = Math.floor((n - 1) / cols);
                                var col = (n - 1) % cols;
                                var cx = startX + col * cellW + cellW / 2;
                                var cy = startY + row * cellH + cellH / 2;

                                var val = chi[n % qVal];
                                if (!val) val = chi[n % qVal] || [0, 0];
                                var mag = Math.sqrt(val[0] * val[0] + val[1] * val[1]);

                                // Background
                                if (primeSet[n]) {
                                    ctx.fillStyle = viz.colors.blue + '22';
                                    ctx.fillRect(cx - cellW / 2 + 1, cy - cellH / 2 + 1, cellW - 2, cellH - 2);
                                }

                                // Number
                                ctx.fillStyle = mag < 0.01 ? viz.colors.text + '44' : (primeSet[n] ? viz.colors.blue : viz.colors.white);
                                ctx.font = '12px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.textBaseline = 'top';
                                ctx.fillText(n, cx, cy - cellH / 2 + 2);

                                // Arrow showing chi(n) as a complex number
                                if (mag > 0.01) {
                                    var arrowLen = 10;
                                    var ax = cx + val[0] * arrowLen;
                                    var ay = cy + 4 - val[1] * arrowLen;
                                    var hue = (Math.atan2(val[1], val[0]) / Math.PI + 1) / 2;
                                    var rgb = VizEngine.hslToRgb(hue, 0.8, 0.6);
                                    var color = 'rgb(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ')';
                                    ctx.strokeStyle = color;
                                    ctx.lineWidth = 2;
                                    ctx.beginPath();
                                    ctx.moveTo(cx, cy + 4);
                                    ctx.lineTo(ax, ay);
                                    ctx.stroke();
                                    ctx.fillStyle = color;
                                    ctx.beginPath();
                                    ctx.arc(ax, ay, 2, 0, Math.PI * 2);
                                    ctx.fill();
                                }
                            }

                            // Legend
                            var legY = startY + Math.ceil(N / cols) * cellH + 10;
                            ctx.fillStyle = viz.colors.blue + '22';
                            ctx.fillRect(startX, legY, 12, 12);
                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '11px -apple-system,sans-serif';
                            ctx.textAlign = 'left';
                            ctx.fillText('= prime', startX + 16, legY + 10);
                            ctx.fillText('Arrow = \u03C7(n) in \u2102  (angle = argument, gray = \u03C7(n)=0)', startX + 80, legY + 10);
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: []
        },

        // ================================================================
        // SECTION 2: Dirichlet Characters — Definition, Group, Principal
        // ================================================================
        {
            id: 'sec-characters',
            title: 'Dirichlet Characters',
            content: `
<h2>Dirichlet Characters</h2>

<h3>Definition</h3>

<div class="env-block definition">
    <div class="env-title">Definition 9.1 (Dirichlet Character)</div>
    <div class="env-body">
        <p>A <strong>Dirichlet character modulo \\(q\\)</strong> is a function \\(\\chi\\colon \\mathbb{Z} \\to \\mathbb{C}\\) satisfying:</p>
        <ol>
            <li><strong>Periodicity:</strong> \\(\\chi(n+q) = \\chi(n)\\) for all \\(n\\).</li>
            <li><strong>Multiplicativity:</strong> \\(\\chi(mn) = \\chi(m)\\chi(n)\\) for all \\(m,n\\).</li>
            <li><strong>Support:</strong> \\(\\chi(n) = 0\\) if and only if \\(\\gcd(n,q) > 1\\).</li>
        </ol>
    </div>
</div>

<p>Conditions (1) and (3) say that \\(\\chi\\) is determined by its values on the group \\((\\mathbb{Z}/q\\mathbb{Z})^\\times\\). Condition (2) makes \\(\\chi\\) a group homomorphism from \\((\\mathbb{Z}/q\\mathbb{Z})^\\times\\) to \\(\\mathbb{C}^\\times\\). Since every element of \\((\\mathbb{Z}/q\\mathbb{Z})^\\times\\) has finite order, the values of \\(\\chi\\) are roots of unity: \\(|\\chi(n)| = 1\\) whenever \\(\\gcd(n,q)=1\\).</p>

<h3>The Principal Character</h3>

<div class="env-block definition">
    <div class="env-title">Definition 9.2 (Principal Character)</div>
    <div class="env-body">
        <p>The <strong>principal character</strong> \\(\\chi_0\\) modulo \\(q\\) is defined by</p>
        \\[
        \\chi_0(n) = \\begin{cases} 1 & \\text{if } \\gcd(n,q)=1, \\\\ 0 & \\text{if } \\gcd(n,q)>1. \\end{cases}
        \\]
    </div>
</div>

<p>The principal character is the trivial homomorphism on \\((\\mathbb{Z}/q\\mathbb{Z})^\\times\\). It detects coprimality to \\(q\\) but carries no further information about residue classes.</p>

<h3>The Character Group</h3>

<div class="env-block theorem">
    <div class="env-title">Theorem 9.1 (Character Group)</div>
    <div class="env-body">
        <p>The set of all Dirichlet characters modulo \\(q\\) forms a group \\(\\widehat{G}\\) under pointwise multiplication, where \\(G = (\\mathbb{Z}/q\\mathbb{Z})^\\times\\). This group is isomorphic to \\(G\\) itself:</p>
        \\[
        \\widehat{G} \\cong G, \\qquad |\\widehat{G}| = \\varphi(q).
        \\]
        <p>The identity element is the principal character \\(\\chi_0\\), and the inverse of \\(\\chi\\) is the conjugate \\(\\overline{\\chi}\\).</p>
    </div>
</div>

<div class="env-block proof">
    <div class="env-title">Proof Sketch</div>
    <div class="env-body">
        <p>By the structure theorem for finite abelian groups, \\(G \\cong \\mathbb{Z}/d_1 \\times \\cdots \\times \\mathbb{Z}/d_r\\). A character on a cyclic group \\(\\mathbb{Z}/d\\) is determined by its value on a generator: \\(\\chi(g) = e^{2\\pi i k/d}\\) for some \\(0 \\leq k < d\\). Characters on the product are products of characters on the factors, giving exactly \\(d_1 \\cdots d_r = |G| = \\varphi(q)\\) characters.</p>
    </div>
    <div class="qed">&marker;</div>
</div>

<div class="env-block example">
    <div class="env-title">Example: Characters mod 5</div>
    <div class="env-body">
        <p>The group \\((\\mathbb{Z}/5\\mathbb{Z})^\\times = \\{1,2,3,4\\}\\) is cyclic of order 4, generated by \\(g=2\\). Setting \\(\\chi(2)=i^k\\) for \\(k=0,1,2,3\\) gives all four characters:</p>
        <table style="margin:0 auto; border-collapse:collapse;">
            <tr style="border-bottom:1px solid #333;"><th style="padding:4px 10px;">\\(n\\)</th><th style="padding:4px 10px;">1</th><th style="padding:4px 10px;">2</th><th style="padding:4px 10px;">3</th><th style="padding:4px 10px;">4</th></tr>
            <tr><td>\\(\\chi_0\\)</td><td>1</td><td>1</td><td>1</td><td>1</td></tr>
            <tr><td>\\(\\chi_1\\)</td><td>1</td><td>\\(i\\)</td><td>\\(-i\\)</td><td>\\(-1\\)</td></tr>
            <tr><td>\\(\\chi_2\\)</td><td>1</td><td>\\(-1\\)</td><td>\\(-1\\)</td><td>1</td></tr>
            <tr><td>\\(\\chi_3\\)</td><td>1</td><td>\\(-i\\)</td><td>\\(i\\)</td><td>\\(-1\\)</td></tr>
        </table>
        <p style="margin-top:8px;">Note that \\(\\chi_2\\) is the Legendre symbol \\(\\left(\\frac{\\cdot}{5}\\right)\\), a real (quadratic) character. The characters \\(\\chi_1\\) and \\(\\chi_3 = \\overline{\\chi_1}\\) are conjugate.</p>
    </div>
</div>

<div class="env-block definition">
    <div class="env-title">Definition 9.3 (Primitive Character and Conductor)</div>
    <div class="env-body">
        <p>A character \\(\\chi \\bmod q\\) is <strong>primitive</strong> if it is not induced from a character modulo any proper divisor of \\(q\\). The smallest such modulus is the <strong>conductor</strong> \\(f_\\chi\\). If \\(f_\\chi = q\\), the character is primitive.</p>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-character-table"></div>
`,
            visualizations: [
                {
                    id: 'viz-character-table',
                    title: 'Interactive Character Table',
                    description: 'Choose a modulus q to see the full table of Dirichlet characters mod q. Each entry shows the value of chi(n) as a colored dot on the unit circle. Click a row to highlight that character across all residues.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 420,
                            originX: 0, originY: 0, scale: 1
                        });

                        var qVal = 5;
                        var highlight = -1;

                        function gcd(a, b) { while (b) { var t = b; b = a % b; a = t; } return a; }

                        function buildCharTable(q) {
                            var coprime = [];
                            for (var i = 1; i < q; i++) if (gcd(i, q) === 1) coprime.push(i);
                            var phi = coprime.length;
                            var order = {};
                            for (var j = 0; j < phi; j++) {
                                var g = coprime[j], o = 1, v = g % q;
                                while (v !== 1) { v = (v * g) % q; o++; }
                                order[g] = o;
                            }
                            var gen = null;
                            for (var k = 0; k < phi; k++) {
                                if (order[coprime[k]] === phi) { gen = coprime[k]; break; }
                            }
                            var table = [];
                            if (gen) {
                                var dlogs = {};
                                var pw = 1;
                                for (var m = 0; m < phi; m++) { dlogs[pw] = m; pw = (pw * gen) % q; }
                                for (var c = 0; c < phi; c++) {
                                    var row = [];
                                    for (var ni = 0; ni < coprime.length; ni++) {
                                        var n = coprime[ni];
                                        var angle = 2 * Math.PI * c * dlogs[n] / phi;
                                        row.push([Math.cos(angle), Math.sin(angle)]);
                                    }
                                    table.push(row);
                                }
                            } else {
                                var row0 = [];
                                for (var ni2 = 0; ni2 < coprime.length; ni2++) row0.push([1, 0]);
                                table.push(row0);
                            }
                            return { coprime: coprime, table: table };
                        }

                        var data = buildCharTable(qVal);

                        VizEngine.createSlider(controls, 'q', 3, 13, qVal, 1, function(v) {
                            qVal = Math.round(v);
                            data = buildCharTable(qVal);
                            highlight = -1;
                            draw();
                        });

                        viz.canvas.addEventListener('click', function(e) {
                            var rect = viz.canvas.getBoundingClientRect();
                            var my = e.clientY - rect.top;
                            var headerH = 65;
                            var rowH = Math.min(28, (viz.height - headerH - 30) / data.table.length);
                            var idx = Math.floor((my - headerH) / rowH);
                            if (idx >= 0 && idx < data.table.length) {
                                highlight = (highlight === idx) ? -1 : idx;
                                draw();
                            }
                        });

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var cop = data.coprime;
                            var tbl = data.table;
                            var phi = cop.length;

                            viz.screenText('Character Table mod ' + qVal + '  (\u03C6(' + qVal + ') = ' + phi + ' characters)', viz.width / 2, 18, viz.colors.white, 14);

                            var headerH = 65;
                            var colW = Math.min(50, (viz.width - 90) / phi);
                            var rowH = Math.min(28, (viz.height - headerH - 30) / tbl.length);
                            var startX = 80;

                            // Column headers
                            ctx.font = '11px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'bottom';
                            ctx.fillStyle = viz.colors.text;
                            for (var c = 0; c < phi; c++) {
                                ctx.fillText(cop[c], startX + c * colW + colW / 2, headerH - 5);
                            }
                            ctx.fillStyle = viz.colors.text;
                            ctx.textAlign = 'left';
                            ctx.fillText('n \u2192', startX - 30, headerH - 5);

                            // Rows
                            for (var r = 0; r < tbl.length; r++) {
                                var ry = headerH + r * rowH;
                                if (highlight === r) {
                                    ctx.fillStyle = viz.colors.blue + '22';
                                    ctx.fillRect(startX - 5, ry, phi * colW + 10, rowH);
                                }
                                // Row label
                                ctx.fillStyle = highlight === r ? viz.colors.blue : viz.colors.text;
                                ctx.font = '11px -apple-system,sans-serif';
                                ctx.textAlign = 'right';
                                ctx.textBaseline = 'middle';
                                ctx.fillText('\u03C7\u2080'.replace('\u2080', String.fromCharCode(0x2080 + r)), startX - 10, ry + rowH / 2);

                                for (var ci = 0; ci < phi; ci++) {
                                    var val = tbl[r][ci];
                                    var cx = startX + ci * colW + colW / 2;
                                    var cy = ry + rowH / 2;
                                    var hue = (Math.atan2(val[1], val[0]) / Math.PI + 1) / 2;
                                    var rgb = VizEngine.hslToRgb(hue, 0.85, 0.55);
                                    var dotColor = 'rgb(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ')';
                                    ctx.fillStyle = dotColor;
                                    ctx.beginPath();
                                    ctx.arc(cx, cy, 5, 0, Math.PI * 2);
                                    ctx.fill();
                                }
                            }

                            // Info text
                            var infoY = headerH + tbl.length * rowH + 15;
                            viz.screenText('Click a row to highlight. Color encodes argument of \u03C7(n).', viz.width / 2, infoY, viz.colors.text, 11);
                            viz.screenText('Red = 1,  Cyan = -1,  Blue = i,  Yellow = -i', viz.width / 2, infoY + 16, viz.colors.text, 10);
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Show that \\(\\chi(1) = 1\\) for every Dirichlet character \\(\\chi\\), and \\(\\chi(-1) = \\pm 1\\).',
                    hint: 'Use multiplicativity: \\(\\chi(1) = \\chi(1 \\cdot 1) = \\chi(1)^2\\), so \\(\\chi(1)(\\chi(1)-1)=0\\). Since \\(\\chi(1) \\neq 0\\), what follows? For \\(\\chi(-1)\\), use \\((-1)^2 = 1\\).',
                    solution: 'Since \\(\\gcd(1,q)=1\\), we have \\(\\chi(1) \\neq 0\\). Multiplicativity gives \\(\\chi(1) = \\chi(1)^2\\), so \\(\\chi(1) = 1\\). Similarly, \\(\\chi(-1)^2 = \\chi(1) = 1\\), so \\(\\chi(-1) = \\pm 1\\).'
                },
                {
                    question: 'Write out all Dirichlet characters mod 7. The group \\((\\mathbb{Z}/7\\mathbb{Z})^\\times\\) is cyclic of order 6 with generator \\(g=3\\). How many characters are real-valued?',
                    hint: 'A character is determined by \\(\\chi(3) = \\omega\\), a 6th root of unity. For a real-valued character, all values must be \\(\\pm 1\\), so \\(\\omega^6=1\\) and \\(\\omega \\in \\{\\pm 1\\}\\).',
                    solution: 'There are \\(\\varphi(7)=6\\) characters, given by \\(\\chi_k(3) = e^{2\\pi i k/6}\\) for \\(k=0,1,\\ldots,5\\). Real-valued characters require \\(\\chi(3) \\in \\{1,-1\\}\\), giving \\(k=0\\) (principal) and \\(k=3\\) (the Legendre symbol \\((\\cdot/7)\\)). So exactly 2 characters are real-valued.'
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

<div class="env-block intuition">
    <div class="env-title">The Key Extraction Mechanism</div>
    <div class="env-body">
        <p>Orthogonality is why characters work as filters. When you sum a non-trivial character over all residues, the values "cancel out" to zero, like the integral of \\(e^{2\\pi i k x}\\) over a full period. Only the trivial character survives, and this is exactly what lets us isolate individual residue classes.</p>
    </div>
</div>

<div class="env-block theorem">
    <div class="env-title">Theorem 9.2 (First Orthogonality Relation)</div>
    <div class="env-body">
        <p>For any Dirichlet character \\(\\chi \\bmod q\\):</p>
        \\[
        \\sum_{n=1}^{q} \\chi(n) = \\begin{cases} \\varphi(q) & \\text{if } \\chi = \\chi_0, \\\\ 0 & \\text{if } \\chi \\neq \\chi_0. \\end{cases}
        \\]
    </div>
</div>

<div class="env-block proof">
    <div class="env-title">Proof</div>
    <div class="env-body">
        <p>If \\(\\chi = \\chi_0\\), the sum counts elements of \\((\\mathbb{Z}/q\\mathbb{Z})^\\times\\), giving \\(\\varphi(q)\\).</p>
        <p>If \\(\\chi \\neq \\chi_0\\), there exists \\(a\\) with \\(\\gcd(a,q)=1\\) and \\(\\chi(a) \\neq 1\\). Substituting \\(n \\mapsto an\\):</p>
        \\[
        \\chi(a) \\sum_{n=1}^q \\chi(n) = \\sum_{n=1}^q \\chi(an) = \\sum_{m=1}^q \\chi(m)
        \\]
        <p>since multiplication by \\(a\\) permutes the residues mod \\(q\\). Thus \\((\\chi(a)-1)\\sum \\chi(n) = 0\\), and since \\(\\chi(a) \\neq 1\\), the sum is zero.</p>
    </div>
    <div class="qed">&marker;</div>
</div>

<div class="env-block theorem">
    <div class="env-title">Theorem 9.3 (Second Orthogonality Relation)</div>
    <div class="env-body">
        <p>For integers \\(m, n\\) with \\(\\gcd(n,q)=1\\):</p>
        \\[
        \\sum_{\\chi \\bmod q} \\chi(m)\\overline{\\chi(n)} = \\begin{cases} \\varphi(q) & \\text{if } m \\equiv n \\pmod{q}, \\\\ 0 & \\text{otherwise.} \\end{cases}
        \\]
    </div>
</div>

<div class="env-block proof">
    <div class="env-title">Proof</div>
    <div class="env-body">
        <p>By multiplicativity, \\(\\chi(m)\\overline{\\chi(n)} = \\chi(mn^{-1})\\) where \\(n^{-1}\\) is the inverse of \\(n\\) mod \\(q\\). Setting \\(a = mn^{-1}\\), the sum becomes \\(\\sum_\\chi \\chi(a)\\). This is the "dual" version of Theorem 9.2: summing over all characters at a fixed group element. If \\(a \\equiv 1\\), every character gives 1, yielding \\(\\varphi(q)\\). If \\(a \\not\\equiv 1\\), there exists \\(\\chi\\) with \\(\\chi(a) \\neq 1\\), and the same permutation trick gives zero.</p>
    </div>
    <div class="qed">&marker;</div>
</div>

<div class="env-block remark">
    <div class="env-title">The Extraction Formula</div>
    <div class="env-body">
        <p>The second orthogonality relation gives the fundamental extraction identity: for \\(\\gcd(a,q)=1\\),</p>
        \\[
        \\frac{1}{\\varphi(q)} \\sum_{\\chi \\bmod q} \\overline{\\chi(a)} \\chi(n) = \\begin{cases} 1 & \\text{if } n \\equiv a \\pmod{q}, \\\\ 0 & \\text{otherwise.} \\end{cases}
        \\]
        <p>This is the "Kronecker delta on residue classes." Multiplying a Dirichlet series by \\(\\overline{\\chi(a)}\\) and summing over \\(\\chi\\) selects exactly the terms with \\(n \\equiv a \\pmod{q}\\).</p>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-orthogonality-demo"></div>
`,
            visualizations: [],
            exercises: [
                {
                    question: 'Use the extraction formula to express \\(\\sum_{\\substack{p \\leq x \\\\ p \\equiv a \\pmod{q}}} \\frac{1}{p}\\) in terms of \\(L\\)-functions.',
                    hint: 'Replace the indicator function \\(\\mathbf{1}_{p \\equiv a}\\) with the character sum, then interchange sums.',
                    solution: 'By the extraction formula, \\(\\sum_{p \\equiv a} p^{-1} = \\frac{1}{\\varphi(q)} \\sum_\\chi \\overline{\\chi(a)} \\sum_p \\chi(p) p^{-1}\\). The inner sum relates to \\(\\log L(s,\\chi)\\) at \\(s=1\\) via the Euler product. This is the starting point of Dirichlet\'s proof.'
                },
                {
                    question: 'Verify the first orthogonality relation for the character table mod 5. Compute \\(\\sum_{n=1}^{5} \\chi_k(n)\\) for \\(k=0,1,2,3\\).',
                    hint: 'Use the character table from Example 9.1. Remember \\(\\chi(5) = \\chi(0) = 0\\).',
                    solution: 'For \\(\\chi_0\\): \\(1+1+1+1+0 = 4 = \\varphi(5)\\). For \\(\\chi_1\\): \\(1+i+(-i)+(-1)+0 = 0\\). For \\(\\chi_2\\): \\(1+(-1)+(-1)+1+0 = 0\\). For \\(\\chi_3\\): \\(1+(-i)+i+(-1)+0 = 0\\). \\(\\checkmark\\)'
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

<div class="env-block intuition">
    <div class="env-title">Roots of Unity Meet Characters</div>
    <div class="env-body">
        <p>A Gauss sum combines a Dirichlet character with additive characters (roots of unity). The resulting sum has a beautiful geometric structure: on the unit circle, the character-weighted roots of unity conspire to produce a sum of modulus exactly \\(\\sqrt{q}\\). This is the multiplicative-additive bridge that makes the functional equation of \\(L\\)-functions possible.</p>
    </div>
</div>

<div class="env-block definition">
    <div class="env-title">Definition 9.4 (Gauss Sum)</div>
    <div class="env-body">
        <p>For a Dirichlet character \\(\\chi \\bmod q\\) and integer \\(a\\), the <strong>Gauss sum</strong> is</p>
        \\[
        G(a, \\chi) = \\sum_{n=1}^{q} \\chi(n)\\, e^{2\\pi i a n / q}.
        \\]
        <p>When \\(a = 1\\), we write \\(G(\\chi) = G(1, \\chi)\\) and call this <em>the</em> Gauss sum of \\(\\chi\\).</p>
    </div>
</div>

<div class="env-block theorem">
    <div class="env-title">Theorem 9.4 (Modulus of the Gauss Sum)</div>
    <div class="env-body">
        <p>If \\(\\chi\\) is a primitive character modulo \\(q\\), then</p>
        \\[
        |G(\\chi)| = \\sqrt{q}.
        \\]
    </div>
</div>

<div class="env-block proof">
    <div class="env-title">Proof</div>
    <div class="env-body">
        <p>Compute \\(|G(\\chi)|^2 = G(\\chi)\\overline{G(\\chi)}\\):</p>
        \\[
        |G(\\chi)|^2 = \\sum_{m,n=1}^{q} \\chi(m)\\overline{\\chi(n)}\\, e^{2\\pi i(m-n)/q} = \\sum_{m,n} \\chi(mn^{-1}) e^{2\\pi i(m-n)/q}.
        \\]
        <p>Setting \\(m = kn\\) (mod \\(q\\), summing over \\(k\\) coprime to \\(q\\)):</p>
        \\[
        = \\sum_{k} \\chi(k) \\sum_{n} e^{2\\pi i n(k-1)/q}.
        \\]
        <p>The inner sum over \\(n\\) is \\(q\\) if \\(k \\equiv 1\\) and \\(0\\) otherwise (geometric sum). For a primitive character, this calculation gives \\(|G(\\chi)|^2 = q\\).</p>
    </div>
    <div class="qed">&marker;</div>
</div>

<div class="env-block theorem">
    <div class="env-title">Theorem 9.5 (Gauss Sum Factorization)</div>
    <div class="env-body">
        <p>For a primitive character \\(\\chi \\bmod q\\) and \\(\\gcd(a,q)=1\\):</p>
        \\[
        G(a, \\chi) = \\overline{\\chi(a)}\\, G(\\chi).
        \\]
        <p>This factorization separates the \\(a\\)-dependence into \\(\\overline{\\chi(a)}\\), leaving \\(G(\\chi)\\) as a universal constant.</p>
    </div>
</div>

<div class="env-block example">
    <div class="env-title">Example: Quadratic Gauss Sum</div>
    <div class="env-body">
        <p>For the Legendre symbol \\(\\chi(n) = \\left(\\frac{n}{p}\\right)\\) with \\(p\\) an odd prime, the Gauss sum satisfies</p>
        \\[
        G(\\chi)^2 = \\chi(-1) \\cdot p = (-1)^{(p-1)/2} p = p^*
        \\]
        <p>where \\(p^* = (-1)^{(p-1)/2}p\\). So \\(G(\\chi) = \\sqrt{p^*}\\), connecting the Gauss sum to quadratic reciprocity.</p>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-gauss-sum-circle"></div>
`,
            visualizations: [
                {
                    id: 'viz-gauss-sum-circle',
                    title: 'Gauss Sum on the Unit Circle',
                    description: 'Each term chi(n) * e^(2pi i n/q) is a point on the unit circle, weighted and rotated by the character. Watch the partial sums accumulate. For primitive characters, the total sum has modulus sqrt(q).',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 420,
                            originX: 280, originY: 220, scale: 70
                        });

                        var qVal = 7;
                        var chiIdx = 1;
                        var showPartial = true;

                        function gcd(a, b) { while (b) { var t = b; b = a % b; a = t; } return a; }

                        function getCharsModQ(q) {
                            var coprime = [];
                            for (var i = 1; i < q; i++) if (gcd(i, q) === 1) coprime.push(i);
                            var phi = coprime.length;
                            var order = {};
                            for (var j = 0; j < phi; j++) {
                                var g = coprime[j], o = 1, v = g % q;
                                while (v !== 1) { v = (v * g) % q; o++; }
                                order[g] = o;
                            }
                            var gen = null;
                            for (var k = 0; k < phi; k++) {
                                if (order[coprime[k]] === phi) { gen = coprime[k]; break; }
                            }
                            var chars = [];
                            if (gen) {
                                var dlogs = {};
                                var pw = 1;
                                for (var m = 0; m < phi; m++) { dlogs[pw] = m; pw = (pw * gen) % q; }
                                for (var c = 0; c < phi; c++) {
                                    var chi = {};
                                    for (var n = 0; n < q; n++) {
                                        if (gcd(n, q) === 1) {
                                            var angle = 2 * Math.PI * c * dlogs[n % q] / phi;
                                            chi[n] = [Math.cos(angle), Math.sin(angle)];
                                        } else {
                                            chi[n] = [0, 0];
                                        }
                                    }
                                    chars.push(chi);
                                }
                            } else {
                                var chi0 = {};
                                for (var n2 = 0; n2 < q; n2++) chi0[n2] = gcd(n2, q) === 1 ? [1, 0] : [0, 0];
                                chars.push(chi0);
                            }
                            return chars;
                        }

                        var allChars = getCharsModQ(qVal);

                        VizEngine.createSlider(controls, 'q', 3, 13, qVal, 1, function(v) {
                            qVal = Math.round(v);
                            allChars = getCharsModQ(qVal);
                            chiIdx = Math.min(chiIdx, allChars.length - 1);
                            draw();
                        });
                        VizEngine.createSlider(controls, 'Character', 0, 10, chiIdx, 1, function(v) {
                            chiIdx = Math.min(Math.round(v), allChars.length - 1);
                            draw();
                        });

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var chi = allChars[chiIdx];

                            // Unit circle
                            viz.drawCircle(0, 0, 1, null, viz.colors.grid, 1);
                            viz.drawSegment(-2.5, 0, 2.5, 0, viz.colors.grid, 0.5);
                            viz.drawSegment(0, -2.5, 0, 2.5, viz.colors.grid, 0.5);

                            viz.screenText('Gauss Sum G(\u03C7_' + chiIdx + ') mod ' + qVal, viz.width / 2, 18, viz.colors.white, 14);

                            // Compute terms and partial sums
                            var terms = [];
                            var sumRe = 0, sumIm = 0;
                            for (var n = 1; n < qVal; n++) {
                                var cv = chi[n];
                                if (!cv || (cv[0] === 0 && cv[1] === 0)) continue;
                                // chi(n) * e^(2pi i n/q)
                                var addAngle = 2 * Math.PI * n / qVal;
                                var eRe = Math.cos(addAngle), eIm = Math.sin(addAngle);
                                var tRe = cv[0] * eRe - cv[1] * eIm;
                                var tIm = cv[0] * eIm + cv[1] * eRe;
                                terms.push({ n: n, re: tRe, im: tIm, pRe: sumRe + tRe, pIm: sumIm + tIm });
                                sumRe += tRe;
                                sumIm += tIm;
                            }

                            // Draw partial sum path
                            if (showPartial && terms.length > 0) {
                                ctx.strokeStyle = viz.colors.teal + '66';
                                ctx.lineWidth = 1.5;
                                ctx.beginPath();
                                var [sx0, sy0] = viz.toScreen(0, 0);
                                ctx.moveTo(sx0, sy0);
                                for (var i = 0; i < terms.length; i++) {
                                    var [sxi, syi] = viz.toScreen(terms[i].pRe, terms[i].pIm);
                                    ctx.lineTo(sxi, syi);
                                }
                                ctx.stroke();
                            }

                            // Draw individual term arrows
                            var prevRe = 0, prevIm = 0;
                            for (var j = 0; j < terms.length; j++) {
                                var t = terms[j];
                                var hue = j / terms.length;
                                var rgb = VizEngine.hslToRgb(hue, 0.8, 0.55);
                                var col = 'rgb(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ')';
                                viz.drawPoint(t.pRe, t.pIm, col, '' + t.n, 3);
                                prevRe = t.pRe;
                                prevIm = t.pIm;
                            }

                            // Final sum point
                            var mag = Math.sqrt(sumRe * sumRe + sumIm * sumIm);
                            viz.drawPoint(sumRe, sumIm, viz.colors.orange, null, 6);

                            // Circle of radius sqrt(q) for reference
                            var sqrtQ = Math.sqrt(qVal);
                            viz.drawCircle(0, 0, sqrtQ, null, viz.colors.orange + '44', 1);

                            // Info
                            viz.screenText('|G(\u03C7)| = ' + mag.toFixed(3) + '    \u221Aq = ' + sqrtQ.toFixed(3), viz.width / 2, viz.height - 30, viz.colors.orange, 13);
                            viz.screenText('G(\u03C7) = ' + sumRe.toFixed(3) + ' + ' + sumIm.toFixed(3) + 'i', viz.width / 2, viz.height - 12, viz.colors.text, 11);
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Compute the Gauss sum \\(G(\\chi)\\) for the non-trivial character \\(\\chi \\bmod 3\\) (i.e., \\(\\chi(1)=1, \\chi(2)=-1\\)). Verify that \\(|G(\\chi)| = \\sqrt{3}\\).',
                    hint: '\\(G(\\chi) = \\chi(1)e^{2\\pi i/3} + \\chi(2)e^{4\\pi i/3} = e^{2\\pi i/3} - e^{4\\pi i/3}\\). Simplify using Euler\'s formula.',
                    solution: '\\(G(\\chi) = e^{2\\pi i/3} - e^{4\\pi i/3} = (\\cos\\frac{2\\pi}{3} + i\\sin\\frac{2\\pi}{3}) - (\\cos\\frac{4\\pi}{3} + i\\sin\\frac{4\\pi}{3}) = (-\\frac{1}{2}+\\frac{\\sqrt{3}}{2}i) - (-\\frac{1}{2}-\\frac{\\sqrt{3}}{2}i) = i\\sqrt{3}\\). So \\(|G(\\chi)| = \\sqrt{3}\\). \\(\\checkmark\\)'
                },
                {
                    question: 'Show that for the principal character \\(\\chi_0 \\bmod q\\), the Gauss sum \\(G(\\chi_0)\\) equals the Ramanujan sum \\(c_q(1) = \\mu(q)\\).',
                    hint: '\\(G(\\chi_0) = \\sum_{\\gcd(n,q)=1} e^{2\\pi i n/q}\\). Use the Mobius function identity for the Ramanujan sum.',
                    solution: '\\(G(\\chi_0) = \\sum_{n=1}^{q} \\chi_0(n) e^{2\\pi i n/q} = \\sum_{\\gcd(n,q)=1} e^{2\\pi i n/q} = c_q(1) = \\mu(q)\\) by the standard evaluation of Ramanujan sums. For prime \\(q=p\\), this gives \\(G(\\chi_0) = -1\\), consistent with the sum of all \\(p\\)-th roots of unity being 0, minus the \\(n=0\\) term.'
                }
            ]
        },

        // ================================================================
        // SECTION 5: L-Functions
        // ================================================================
        {
            id: 'sec-l-functions',
            title: 'Dirichlet L-Functions',
            content: `
<h2>Dirichlet L-Functions</h2>

<div class="env-block intuition">
    <div class="env-title">Twisted Zeta Functions</div>
    <div class="env-body">
        <p>If the Riemann zeta function \\(\\zeta(s) = \\sum n^{-s}\\) encodes the distribution of all primes, then \\(L(s,\\chi) = \\sum \\chi(n) n^{-s}\\) encodes the distribution of primes filtered by the character \\(\\chi\\). Each character provides a different "view" of the primes, and together they give complete information about primes in arithmetic progressions.</p>
    </div>
</div>

<div class="env-block definition">
    <div class="env-title">Definition 9.5 (Dirichlet L-Function)</div>
    <div class="env-body">
        <p>For a Dirichlet character \\(\\chi \\bmod q\\), the <strong>Dirichlet \\(L\\)-function</strong> is</p>
        \\[
        L(s, \\chi) = \\sum_{n=1}^{\\infty} \\frac{\\chi(n)}{n^s}, \\qquad \\operatorname{Re}(s) > 1.
        \\]
    </div>
</div>

<div class="env-block theorem">
    <div class="env-title">Theorem 9.6 (Euler Product for L-Functions)</div>
    <div class="env-body">
        <p>For \\(\\operatorname{Re}(s) > 1\\), the \\(L\\)-function has an Euler product:</p>
        \\[
        L(s, \\chi) = \\prod_{p \\text{ prime}} \\left(1 - \\frac{\\chi(p)}{p^s}\\right)^{-1}.
        \\]
    </div>
</div>

<div class="env-block proof">
    <div class="env-title">Proof</div>
    <div class="env-body">
        <p>The proof is identical to the Euler product for \\(\\zeta(s)\\), using the complete multiplicativity of \\(\\chi\\). For each prime \\(p\\):</p>
        \\[
        \\sum_{k=0}^{\\infty} \\frac{\\chi(p^k)}{p^{ks}} = \\sum_{k=0}^{\\infty} \\frac{\\chi(p)^k}{p^{ks}} = \\left(1 - \\frac{\\chi(p)}{p^s}\\right)^{-1}
        \\]
        <p>since \\(|\\chi(p)/p^s| < 1\\) for \\(\\operatorname{Re}(s) > 1\\). The product converges absolutely and equals the sum by the fundamental theorem of arithmetic.</p>
    </div>
    <div class="qed">&marker;</div>
</div>

<h3>Analytic Continuation</h3>

<div class="env-block theorem">
    <div class="env-title">Theorem 9.7 (Analytic Continuation)</div>
    <div class="env-body">
        <p>Let \\(\\chi \\neq \\chi_0\\) be a non-principal character mod \\(q\\).</p>
        <ol>
            <li>The series \\(\\sum \\chi(n) n^{-s}\\) converges (conditionally) for \\(\\operatorname{Re}(s) > 0\\).</li>
            <li>\\(L(s,\\chi)\\) extends to an <strong>entire function</strong> (no poles).</li>
        </ol>
        <p>For the principal character \\(\\chi_0 \\bmod q\\):</p>
        \\[
        L(s, \\chi_0) = \\zeta(s) \\prod_{p \\mid q} \\left(1 - p^{-s}\\right)
        \\]
        <p>which has a simple pole at \\(s = 1\\) inherited from \\(\\zeta(s)\\), with residue \\(\\varphi(q)/q\\).</p>
    </div>
</div>

<div class="env-block proof">
    <div class="env-title">Proof Sketch (Convergence for \\(\\chi \\neq \\chi_0\\))</div>
    <div class="env-body">
        <p>The key is that \\(\\sum_{n=1}^{N} \\chi(n)\\) is bounded (by the first orthogonality relation, the sum over a full period is 0). By partial summation (Abel's summation formula), the series \\(\\sum \\chi(n) n^{-s}\\) converges for \\(\\operatorname{Re}(s) > 0\\), since the partial sums of the coefficients are bounded and \\(n^{-s} \\to 0\\).</p>
    </div>
    <div class="qed">&marker;</div>
</div>

<h3>Functional Equation</h3>

<p>For a primitive character \\(\\chi \\bmod q\\) with \\(\\chi(-1) = (-1)^a\\) (so \\(a = 0\\) or \\(1\\)), define the completed \\(L\\)-function:</p>
\\[
\\Lambda(s, \\chi) = \\left(\\frac{q}{\\pi}\\right)^{(s+a)/2} \\Gamma\\!\\left(\\frac{s+a}{2}\\right) L(s, \\chi).
\\]

<div class="env-block theorem">
    <div class="env-title">Theorem 9.8 (Functional Equation)</div>
    <div class="env-body">
        <p>For a primitive character \\(\\chi \\bmod q\\):</p>
        \\[
        \\Lambda(s, \\chi) = \\frac{G(\\chi)}{i^a \\sqrt{q}}\\, \\Lambda(1-s, \\overline{\\chi}).
        \\]
        <p>The factor \\(G(\\chi)/(i^a \\sqrt{q})\\) is a complex number of modulus 1 (the <strong>root number</strong>), and this equation relates \\(L(s,\\chi)\\) to \\(L(1-s,\\overline{\\chi})\\) via the symmetry \\(s \\leftrightarrow 1-s\\).</p>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-euler-product-l"></div>
`,
            visualizations: [
                {
                    id: 'viz-euler-product-l',
                    title: 'L-Function Euler Product Assembly',
                    description: 'Watch L(s, chi) being built one prime factor at a time. Each Euler factor (1 - chi(p)/p^s)^{-1} modifies the running product. The complex partial products trace a spiral converging to L(s, chi).',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 420,
                            originX: 280, originY: 220, scale: 80
                        });

                        var sRe = 2.0;
                        var qVal = 5;
                        var chiIdx = 1;
                        var numPrimes = 20;

                        function gcd(a, b) { while (b) { var t = b; b = a % b; a = t; } return a; }

                        function getChiValues(q, idx) {
                            var coprime = [];
                            for (var i = 1; i < q; i++) if (gcd(i, q) === 1) coprime.push(i);
                            var phi = coprime.length;
                            var order = {};
                            for (var j = 0; j < phi; j++) {
                                var g = coprime[j], o = 1, v = g % q;
                                while (v !== 1) { v = (v * g) % q; o++; }
                                order[g] = o;
                            }
                            var gen = null;
                            for (var k = 0; k < phi; k++) {
                                if (order[coprime[k]] === phi) { gen = coprime[k]; break; }
                            }
                            if (!gen) return function(n) { return gcd(n, q) === 1 ? [1, 0] : [0, 0]; };
                            var dlogs = {};
                            var pw = 1;
                            for (var m = 0; m < phi; m++) { dlogs[pw] = m; pw = (pw * gen) % q; }
                            return function(n) {
                                if (gcd(n, q) !== 1) return [0, 0];
                                var r = n % q;
                                var angle = 2 * Math.PI * idx * dlogs[r] / phi;
                                return [Math.cos(angle), Math.sin(angle)];
                            };
                        }

                        VizEngine.createSlider(controls, 'Re(s)', 1.1, 4, sRe, 0.1, function(v) {
                            sRe = v; draw();
                        });
                        VizEngine.createSlider(controls, 'Primes', 1, 50, numPrimes, 1, function(v) {
                            numPrimes = Math.round(v); draw();
                        });

                        var primes = VizEngine.sievePrimes(300);

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var chi = getChiValues(qVal, chiIdx);

                            viz.drawCircle(0, 0, 0, null, viz.colors.grid, 0.5);
                            viz.drawSegment(-3, 0, 3, 0, viz.colors.grid, 0.5);
                            viz.drawSegment(0, -3, 0, 3, viz.colors.grid, 0.5);

                            viz.screenText('L(' + sRe.toFixed(1) + ', \u03C7_' + chiIdx + ') mod ' + qVal + '  via Euler product', viz.width / 2, 18, viz.colors.white, 13);

                            // Build Euler product
                            var prodRe = 1, prodIm = 0;
                            var path = [[1, 0]];
                            var nP = Math.min(numPrimes, primes.length);

                            for (var i = 0; i < nP; i++) {
                                var p = primes[i];
                                var cv = chi(p);
                                // (1 - chi(p)/p^s)^{-1}
                                // chi(p)/p^s as complex number (s is real here)
                                var ps = Math.pow(p, -sRe);
                                var facRe = 1 - cv[0] * ps;
                                var facIm = cv[1] * ps;
                                // Invert: 1/(a+bi) = (a-bi)/(a^2+b^2)
                                var denom = facRe * facRe + facIm * facIm;
                                var invRe = facRe / denom;
                                var invIm = -facIm / denom;
                                // Multiply into product
                                var newRe = prodRe * invRe - prodIm * invIm;
                                var newIm = prodRe * invIm + prodIm * invRe;
                                prodRe = newRe;
                                prodIm = newIm;
                                path.push([prodRe, prodIm]);
                            }

                            // Draw path
                            ctx.strokeStyle = viz.colors.teal + '88';
                            ctx.lineWidth = 1.5;
                            ctx.beginPath();
                            for (var j = 0; j < path.length; j++) {
                                var [sx, sy] = viz.toScreen(path[j][0], path[j][1]);
                                j === 0 ? ctx.moveTo(sx, sy) : ctx.lineTo(sx, sy);
                            }
                            ctx.stroke();

                            // Draw points
                            for (var k = 0; k < path.length; k++) {
                                var col = k === 0 ? viz.colors.white : (k === path.length - 1 ? viz.colors.orange : viz.colors.teal);
                                var r = k === path.length - 1 ? 5 : 3;
                                viz.drawPoint(path[k][0], path[k][1], col, null, r);
                            }

                            // Label final
                            var mag = Math.sqrt(prodRe * prodRe + prodIm * prodIm);
                            viz.screenText('L(s,\u03C7) \u2248 ' + prodRe.toFixed(4) + ' + ' + prodIm.toFixed(4) + 'i', viz.width / 2, viz.height - 30, viz.colors.orange, 12);
                            viz.screenText('|L(s,\u03C7)| \u2248 ' + mag.toFixed(4) + '   (' + nP + ' primes)', viz.width / 2, viz.height - 12, viz.colors.text, 11);

                            // Mark origin and 1
                            viz.drawPoint(0, 0, viz.colors.text, 'O', 2);
                            viz.drawPoint(1, 0, viz.colors.text, '1', 2);
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Show that \\(L(s,\\chi_0) = \\zeta(s) \\prod_{p|q}(1-p^{-s})\\) for the principal character \\(\\chi_0 \\bmod q\\).',
                    hint: 'Compare the Euler products of \\(L(s,\\chi_0)\\) and \\(\\zeta(s)\\). They agree at every prime not dividing \\(q\\).',
                    solution: 'The Euler product of \\(L(s,\\chi_0)\\) has factor \\((1-\\chi_0(p)p^{-s})^{-1}\\). If \\(p \\nmid q\\), then \\(\\chi_0(p)=1\\), so the factor is \\((1-p^{-s})^{-1}\\), matching \\(\\zeta(s)\\). If \\(p | q\\), then \\(\\chi_0(p)=0\\), so the factor is 1, while \\(\\zeta(s)\\) has \\((1-p^{-s})^{-1}\\). Thus \\(L(s,\\chi_0) = \\zeta(s) \\prod_{p|q}(1-p^{-s})\\).'
                },
                {
                    question: 'Compute \\(L(1, \\chi)\\) where \\(\\chi\\) is the non-trivial character mod 4 (i.e., \\(\\chi(1)=1, \\chi(3)=-1\\)). Relate this to a well-known series.',
                    hint: 'Write out the first few terms: \\(L(1,\\chi) = 1 - 1/3 + 1/5 - 1/7 + \\cdots\\)',
                    solution: '\\(L(1,\\chi) = \\sum_{n \\text{ odd}} \\chi(n)/n = 1 - \\frac{1}{3} + \\frac{1}{5} - \\frac{1}{7} + \\cdots = \\frac{\\pi}{4}\\) (the Leibniz formula). This is a special value of a Dirichlet \\(L\\)-function, connected to the class number of \\(\\mathbb{Q}(i)\\).'
                }
            ]
        },

        // ================================================================
        // SECTION 6: L-Function Properties (Non-vanishing on Re(s)=1)
        // ================================================================
        {
            id: 'sec-l-function-properties',
            title: 'Non-Vanishing on Re(s) = 1',
            content: `
<h2>Non-Vanishing of \\(L(1,\\chi)\\)</h2>

<div class="env-block intuition">
    <div class="env-title">Why This Matters</div>
    <div class="env-body">
        <p>Dirichlet's proof that there are infinitely many primes \\(\\equiv a \\pmod{q}\\) reduces to showing \\(L(1,\\chi) \\neq 0\\) for every non-principal character \\(\\chi\\). If some \\(L(1,\\chi)\\) were zero, the logarithmic divergence from the principal character could not be split evenly among all residue classes.</p>
    </div>
</div>

<p>The extraction formula gives</p>
\\[
\\sum_{\\substack{p \\leq x \\\\ p \\equiv a \\,(q)}} \\frac{1}{p} = \\frac{1}{\\varphi(q)} \\sum_{\\chi} \\overline{\\chi(a)} \\sum_{p \\leq x} \\frac{\\chi(p)}{p}.
\\]

<p>The \\(\\chi_0\\) term contributes \\(\\sim \\log\\log x\\) (diverging). Each non-principal term contributes \\(\\sim \\log L(1,\\chi)\\) (bounded), <em>provided</em> \\(L(1,\\chi) \\neq 0\\). The divergence of the left side then implies infinitely many primes in the progression.</p>

<h3>Complex Characters</h3>

<div class="env-block theorem">
    <div class="env-title">Theorem 9.9 (Non-Vanishing for Complex Characters)</div>
    <div class="env-body">
        <p>If \\(\\chi \\neq \\chi_0\\) is a complex character (\\(\\chi \\neq \\overline{\\chi}\\)), then \\(L(1,\\chi) \\neq 0\\).</p>
    </div>
</div>

<div class="env-block proof">
    <div class="env-title">Proof</div>
    <div class="env-body">
        <p>Consider the product</p>
        \\[
        \\prod_{\\chi \\bmod q} L(s,\\chi) = \\prod_{\\chi} \\prod_p \\left(1-\\frac{\\chi(p)}{p^s}\\right)^{-1}
        \\]
        <p>for real \\(s > 1\\). For each prime \\(p\\) with \\(\\gcd(p,q)=1\\), writing \\(p \\equiv g^k \\pmod{q}\\) and using all characters:</p>
        \\[
        \\prod_{\\chi} \\left(1-\\frac{\\chi(p)}{p^s}\\right)^{-1} = \\prod_{\\chi} \\left(1-\\frac{\\omega^k}{p^s}\\right)^{-1}
        \\]
        <p>where \\(\\omega\\) ranges over all \\(\\varphi(q)\\)-th roots of unity. This product equals \\((1-p^{-s\\varphi(q)})^{-1}\\) (since \\(\\prod_{\\omega^n=1}(1-\\omega x) = 1-x^n\\)), which is a Dirichlet series with non-negative coefficients. Thus \\(\\prod_\\chi L(s,\\chi) \\geq 1\\) for \\(s > 1\\).</p>
        <p>Now \\(L(s,\\chi_0)\\) has a simple pole at \\(s=1\\). If both \\(L(1,\\chi)=0\\) and \\(L(1,\\overline{\\chi})=0\\), the product would have a double zero defeating the simple pole, forcing the product to vanish, contradicting \\(\\geq 1\\). Since \\(L(1,\\overline{\\chi}) = \\overline{L(1,\\chi)}\\), they vanish together, and this double zero is impossible.</p>
    </div>
    <div class="qed">&marker;</div>
</div>

<h3>Real Characters</h3>

<p>The harder case is real characters (\\(\\chi = \\overline{\\chi}\\)), where \\(L(1,\\chi)\\) and \\(L(1,\\overline{\\chi})\\) provide only a single zero. Dirichlet's original proof used the analytic class number formula; we state the result.</p>

<div class="env-block theorem">
    <div class="env-title">Theorem 9.10 (Non-Vanishing for Real Characters)</div>
    <div class="env-body">
        <p>If \\(\\chi\\) is a real non-principal character mod \\(q\\), then \\(L(1,\\chi) > 0\\).</p>
    </div>
</div>

<div class="env-block proof">
    <div class="env-title">Proof Sketch (via the Class Number Formula)</div>
    <div class="env-body">
        <p>For the quadratic character \\(\\chi_D = \\left(\\frac{D}{\\cdot}\\right)\\) associated to the discriminant \\(D\\), the class number formula gives</p>
        \\[
        L(1, \\chi_D) = \\begin{cases} \\frac{2\\pi h(D)}{w\\sqrt{|D|}} & \\text{if } D < 0, \\\\[6pt] \\frac{h(D) \\log \\varepsilon}{\\sqrt{D}} & \\text{if } D > 0, \\end{cases}
        \\]
        <p>where \\(h(D)\\) is the class number (a positive integer), \\(w\\) is the number of roots of unity, and \\(\\varepsilon > 1\\) is the fundamental unit. Since all quantities on the right are positive, \\(L(1,\\chi_D) > 0\\).</p>
    </div>
    <div class="qed">&marker;</div>
</div>

<div class="env-block remark">
    <div class="env-title">Non-Vanishing on the Entire Line \\(\\operatorname{Re}(s)=1\\)</div>
    <div class="env-body">
        <p>Just as for \\(\\zeta(s)\\), one can prove that \\(L(s,\\chi) \\neq 0\\) for all \\(\\operatorname{Re}(s)=1\\) and \\(\\chi \\neq \\chi_0\\), using the same 3-4-1 inequality adapted to \\(L\\)-functions. This is the key input for the prime number theorem in arithmetic progressions.</p>
    </div>
</div>
`,
            visualizations: [],
            exercises: [
                {
                    question: 'Why does the product-of-L-functions argument fail for a real character \\(\\chi = \\overline{\\chi}\\)?',
                    hint: 'If \\(\\chi\\) is real, \\(L(1,\\chi) = 0\\) provides only a single zero. How does this compare to the order of the pole from \\(L(s,\\chi_0)\\)?',
                    solution: 'For complex \\(\\chi \\neq \\overline{\\chi}\\), if \\(L(1,\\chi)=0\\) then also \\(L(1,\\overline{\\chi})=\\overline{L(1,\\chi)}=0\\), giving a double zero that overwhelms the simple pole of \\(L(s,\\chi_0)\\). But if \\(\\chi\\) is real, \\(L(1,\\chi) = L(1,\\overline{\\chi})\\), so a single zero only cancels the pole, leaving \\(\\prod L\\) bounded below, which is not a contradiction. A different argument (class number formula) is needed.'
                }
            ]
        },

        // ================================================================
        // SECTION 7: Bridge to Dirichlet's Theorem
        // ================================================================
        {
            id: 'sec-bridge',
            title: 'Bridge: From Characters to Primes in Progressions',
            content: `
<h2>Bridge: From Characters to Primes in Progressions</h2>

<div class="env-block intuition">
    <div class="env-title">Assembling the Machine</div>
    <div class="env-body">
        <p>We now have all the components of Dirichlet's proof. Characters decompose the prime-counting problem into frequency components. Orthogonality extracts individual residue classes. The Euler product connects \\(L(1,\\chi)\\) to primes. Non-vanishing ensures no frequency component is "silent." The next chapter will assemble these into the complete proof.</p>
    </div>
</div>

<h3>The Proof Strategy</h3>

<p>Dirichlet's argument, which we will carry out in Chapter 10, has the following structure:</p>

<ol>
    <li><strong>Take logarithms of the Euler product:</strong>
    \\[
    \\log L(s,\\chi) = \\sum_p \\sum_{k=1}^\\infty \\frac{\\chi(p)^k}{k p^{ks}} = \\sum_p \\frac{\\chi(p)}{p^s} + O(1)
    \\]
    for \\(s > 1\\), where the \\(O(1)\\) term comes from prime powers \\(k \\geq 2\\).
    </li>

    <li><strong>Apply the extraction formula:</strong>
    \\[
    \\sum_{\\substack{p \\\\ p \\equiv a \\,(q)}} \\frac{1}{p^s} = \\frac{1}{\\varphi(q)} \\sum_\\chi \\overline{\\chi(a)} \\log L(s,\\chi) + O(1).
    \\]
    </li>

    <li><strong>Take \\(s \\to 1^+\\):</strong> The \\(\\chi_0\\) term gives \\(\\frac{1}{\\varphi(q)} \\log L(s,\\chi_0) \\to +\\infty\\) (from the pole). For \\(\\chi \\neq \\chi_0\\), since \\(L(1,\\chi) \\neq 0\\), we have \\(\\log L(s,\\chi) \\to \\log L(1,\\chi)\\), which is finite.</li>

    <li><strong>Conclude:</strong> \\(\\sum_{p \\equiv a} p^{-s} \\to \\infty\\) as \\(s \\to 1^+\\), implying infinitely many primes in the progression.</li>
</ol>

<h3>The Quantitative Refinement</h3>

<p>The same argument gives a quantitative result: not only are there infinitely many primes \\(p \\equiv a \\pmod{q}\\), but their density among all primes is exactly \\(1/\\varphi(q)\\):</p>

<div class="env-block theorem">
    <div class="env-title">Theorem 9.11 (Equidistribution of Primes)</div>
    <div class="env-body">
        <p>For \\(\\gcd(a,q) = 1\\),</p>
        \\[
        \\pi(x; q, a) \\sim \\frac{\\pi(x)}{\\varphi(q)} \\sim \\frac{x}{\\varphi(q) \\log x}
        \\]
        <p>as \\(x \\to \\infty\\). In other words, primes are equidistributed among the \\(\\varphi(q)\\) reduced residue classes modulo \\(q\\).</p>
    </div>
</div>

<p>This is the prime number theorem for arithmetic progressions, proved by combining the technology of Chapters 6-8 (zero-free region, contour integration) with the character machinery of this chapter.</p>

<h3>Looking Ahead</h3>

<p>In Chapter 10, we will:</p>
<ul>
    <li>Execute the full proof of Dirichlet's theorem with all details.</li>
    <li>Confront the delicate \\(L(1,\\chi) \\neq 0\\) problem for real characters head-on.</li>
    <li>Discuss Siegel zeros: hypothetical near-zeros of \\(L(s,\\chi)\\) near \\(s=1\\) that remain the deepest open question in this area.</li>
    <li>Prove the prime number theorem for arithmetic progressions: \\(\\psi(x;q,a) \\sim x/\\varphi(q)\\).</li>
</ul>

<div class="env-block remark">
    <div class="env-title">The Bigger Picture</div>
    <div class="env-body">
        <p>Dirichlet characters and their \\(L\\)-functions are the simplest case of a vast generalization. Hecke \\(L\\)-functions, Artin \\(L\\)-functions, and automorphic \\(L\\)-functions all follow the same paradigm: a Dirichlet series with an Euler product, analytic continuation, a functional equation, and deep arithmetic information encoded in the location of zeros. This perspective, which we will glimpse in the later chapters of this course, is the Langlands program: the grand unifying vision of modern number theory.</p>
    </div>
</div>
`,
            visualizations: [],
            exercises: [
                {
                    question: 'In the proof sketch, we used \\(\\log L(s,\\chi) = \\sum_p \\chi(p)/p^s + O(1)\\). Justify the \\(O(1)\\) bound on the prime-power terms \\(\\sum_p \\sum_{k \\geq 2} \\chi(p)^k/(kp^{ks})\\).',
                    hint: 'Bound \\(|\\chi(p)^k/(kp^{ks})| \\leq p^{-ks}\\) for \\(s \\geq 1\\), \\(k \\geq 2\\). Sum over \\(k\\) first (geometric series), then over \\(p\\).',
                    solution: 'For \\(s \\geq 1\\), \\(\\sum_{k \\geq 2} |\\chi(p)|^k/(kp^{ks}) \\leq \\sum_{k \\geq 2} p^{-k} = p^{-2}/(1-p^{-1}) \\leq 2p^{-2}\\). Summing over all primes: \\(\\sum_p 2p^{-2} \\leq 2\\sum_n n^{-2} = \\pi^2/3 < \\infty\\). So the total is \\(O(1)\\), independent of \\(s\\).'
                }
            ]
        }
    ]
});
