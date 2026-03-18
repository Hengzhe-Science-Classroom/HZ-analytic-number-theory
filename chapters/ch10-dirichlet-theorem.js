// === Chapter 10: Dirichlet's Theorem & the L(1,χ) Problem ===
window.CHAPTERS = window.CHAPTERS || [];
window.CHAPTERS.push({
    id: 'ch10',
    number: 10,
    title: "Dirichlet's Theorem & the L(1,\u03C7) Problem",
    subtitle: 'Every lane of the prime highway carries traffic',
    sections: [
        // ================================================================
        // SECTION 1: Motivation — Primes in Arithmetic Progressions
        // ================================================================
        {
            id: 'sec-motivation',
            title: 'Motivation',
            content: `
<h2>Primes in Arithmetic Progressions</h2>

<div class="env-block intuition">
    <div class="env-title">A Highway with Infinitely Many Lanes</div>
    <div class="env-body">
        <p>Picture the integers as a highway with \\(q\\) lanes, numbered \\(0, 1, \\ldots, q-1\\). An integer \\(n\\) travels in lane \\(n \\bmod q\\). Lane 0 carries all multiples of \\(q\\), so no primes beyond \\(q\\) itself can be found there. Lanes sharing a common factor with \\(q\\) are similarly barren. But what about the remaining \\(\\varphi(q)\\) "coprime" lanes? Dirichlet's theorem says: <strong>every coprime lane carries infinitely many primes.</strong></p>
    </div>
</div>

<p>Euclid proved there are infinitely many primes. But this says nothing about how primes distribute among residue classes. Fix a modulus \\(q \\geq 1\\) and a residue \\(a\\) with \\(\\gcd(a, q) = 1\\). Are there infinitely many primes \\(p \\equiv a \\pmod{q}\\)?</p>

<div class="env-block theorem">
    <div class="env-title">Theorem 10.1 (Dirichlet, 1837)</div>
    <div class="env-body">
        <p>If \\(\\gcd(a, q) = 1\\), then there are infinitely many primes \\(p\\) with \\(p \\equiv a \\pmod{q}\\). More precisely,</p>
        \\[\\sum_{\\substack{p \\leq x \\\\ p \\equiv a \\pmod{q}}} \\frac{1}{p} = \\frac{1}{\\varphi(q)} \\log \\log x + O_q(1).\\]
    </div>
</div>

<p>This is stronger than mere infinitude: it says each coprime class gets its "fair share" of the reciprocal sum, with share \\(1/\\varphi(q)\\). The primes are, in a precise logarithmic sense, equidistributed among the coprime residue classes.</p>

<h3>Why the Condition \\(\\gcd(a,q) = 1\\) Is Necessary</h3>

<p>If \\(d = \\gcd(a,q) > 1\\), then every integer \\(n \\equiv a \\pmod{q}\\) is divisible by \\(d\\), so the only prime that could satisfy \\(p \\equiv a \\pmod{q}\\) is \\(p = d\\) itself (and only if \\(a = d\\)). The coprimality condition is not an artifact of the proof; it is the exact boundary of truth.</p>

<h3>Easy Cases and the Hard Case</h3>

<p>For certain moduli and residues, elementary arguments suffice:</p>

<div class="env-block example">
    <div class="env-title">Example: Primes \\(\\equiv 3 \\pmod{4}\\)</div>
    <div class="env-body">
        <p>Suppose only finitely many primes are \\(\\equiv 3 \\pmod{4}\\), say \\(p_1, \\ldots, p_k\\). Consider \\(N = 4p_1 p_2 \\cdots p_k - 1\\). Then \\(N \\equiv 3 \\pmod{4}\\), and \\(N\\) must have a prime factor \\(\\equiv 3 \\pmod{4}\\) (since a product of primes all \\(\\equiv 1 \\pmod{4}\\) is itself \\(\\equiv 1 \\pmod{4}\\)). But this factor is none of the \\(p_i\\), contradiction.</p>
    </div>
</div>

<p>Such Euclidean tricks work for \\(a = -1\\) (or more generally when \\(a\\) has order 2 in \\((\\mathbb{Z}/q\\mathbb{Z})^\\times\\)), but they fail for general \\(a\\). For instance, there is no known Euclidean proof that there are infinitely many primes \\(\\equiv 1 \\pmod{3}\\). Dirichlet's analytic method handles all cases uniformly.</p>

<h3>The Architecture of Dirichlet's Proof</h3>

<p>The proof has three conceptual layers:</p>
<ol>
    <li><strong>Orthogonality of characters:</strong> Dirichlet characters let us "filter" residue classes from the full sum over all primes.</li>
    <li><strong>Non-vanishing \\(L(1, \\chi) \\neq 0\\):</strong> This is the analytic heart. For complex characters, the proof is relatively simple; for the real character, it requires deeper ideas.</li>
    <li><strong>Divergence:</strong> The sum \\(\\sum_{p \\equiv a} 1/p\\) diverges because the \\(\\log L(s, \\chi)\\) terms stay bounded as \\(s \\to 1^+\\), while the principal character contributes a divergent piece.</li>
</ol>

<div class="viz-placeholder" data-viz="viz-prime-race-general"></div>
`,
            visualizations: [
                {
                    id: 'viz-prime-race-general',
                    title: 'Prime Races in Arithmetic Progressions',
                    description: 'Count primes in each coprime residue class mod q up to x. Dirichlet\'s theorem predicts each class gets roughly the same share. Watch how the counts equalize as x grows.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 400,
                            originX: 60, originY: 360, scale: 1
                        });

                        var primes = VizEngine.sievePrimes(50000);
                        var qVal = 4;
                        var xMax = 1000;

                        VizEngine.createSlider(controls, 'q (modulus)', 3, 12, qVal, 1, function(v) {
                            qVal = Math.round(v);
                            draw();
                        });
                        VizEngine.createSlider(controls, 'x max', 500, 50000, xMax, 500, function(v) {
                            xMax = Math.round(v);
                            draw();
                        });

                        function gcd(a, b) { while (b) { var t = b; b = a % b; a = t; } return a; }

                        var raceColors = [
                            viz.colors.blue, viz.colors.teal, viz.colors.orange,
                            viz.colors.purple, viz.colors.green, viz.colors.red,
                            viz.colors.yellow, viz.colors.pink, '#66ccff', '#ff9966',
                            '#99ff99', '#cc99ff'
                        ];

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            // Find coprime residues
                            var residues = [];
                            for (var a = 1; a < qVal; a++) {
                                if (gcd(a, qVal) === 1) residues.push(a);
                            }
                            var phi = residues.length;

                            // Count primes in each class up to various x
                            var steps = 200;
                            var counts = {};
                            for (var r = 0; r < residues.length; r++) counts[residues[r]] = [];

                            for (var i = 0; i <= steps; i++) {
                                var x = Math.round(100 + (xMax - 100) * i / steps);
                                var cnts = {};
                                for (var r2 = 0; r2 < residues.length; r2++) cnts[residues[r2]] = 0;
                                for (var j = 0; j < primes.length && primes[j] <= x; j++) {
                                    var rem = primes[j] % qVal;
                                    if (cnts[rem] !== undefined) cnts[rem]++;
                                }
                                for (var r3 = 0; r3 < residues.length; r3++) {
                                    counts[residues[r3]].push({ x: x, count: cnts[residues[r3]] });
                                }
                            }

                            // Find max count for scaling
                            var maxCount = 1;
                            for (var r4 = 0; r4 < residues.length; r4++) {
                                var arr = counts[residues[r4]];
                                for (var k = 0; k < arr.length; k++) {
                                    if (arr[k].count > maxCount) maxCount = arr[k].count;
                                }
                            }

                            // Draw
                            var plotLeft = 70, plotRight = viz.width - 30;
                            var plotTop = 40, plotBottom = 330;
                            var plotW = plotRight - plotLeft;
                            var plotH = plotBottom - plotTop;

                            // Axes
                            ctx.strokeStyle = viz.colors.axis;
                            ctx.lineWidth = 1;
                            ctx.beginPath();
                            ctx.moveTo(plotLeft, plotBottom);
                            ctx.lineTo(plotRight, plotBottom);
                            ctx.stroke();
                            ctx.beginPath();
                            ctx.moveTo(plotLeft, plotBottom);
                            ctx.lineTo(plotLeft, plotTop);
                            ctx.stroke();

                            // Y-axis labels
                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '10px -apple-system,sans-serif';
                            ctx.textAlign = 'right';
                            ctx.textBaseline = 'middle';
                            for (var yt = 0; yt <= 5; yt++) {
                                var yVal = Math.round(maxCount * yt / 5);
                                var yy = plotBottom - (yt / 5) * plotH;
                                ctx.fillText(yVal.toString(), plotLeft - 5, yy);
                                ctx.strokeStyle = viz.colors.grid;
                                ctx.lineWidth = 0.5;
                                ctx.beginPath();
                                ctx.moveTo(plotLeft, yy);
                                ctx.lineTo(plotRight, yy);
                                ctx.stroke();
                            }

                            // X-axis labels
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'top';
                            for (var xt = 0; xt <= 4; xt++) {
                                var xv = Math.round(100 + (xMax - 100) * xt / 4);
                                var xx = plotLeft + (xt / 4) * plotW;
                                ctx.fillText(xv.toString(), xx, plotBottom + 4);
                            }

                            // Draw curves
                            for (var r5 = 0; r5 < residues.length; r5++) {
                                var res = residues[r5];
                                var data = counts[res];
                                var col = raceColors[r5 % raceColors.length];
                                ctx.strokeStyle = col;
                                ctx.lineWidth = 2;
                                ctx.beginPath();
                                for (var d = 0; d < data.length; d++) {
                                    var px = plotLeft + (d / steps) * plotW;
                                    var py = plotBottom - (data[d].count / maxCount) * plotH;
                                    if (d === 0) ctx.moveTo(px, py);
                                    else ctx.lineTo(px, py);
                                }
                                ctx.stroke();
                            }

                            // Legend
                            var legY = plotBottom + 25;
                            var legSpacing = Math.min(80, (viz.width - 40) / residues.length);
                            var legStart = (viz.width - residues.length * legSpacing) / 2;
                            ctx.font = '11px -apple-system,sans-serif';
                            ctx.textAlign = 'left';
                            for (var r6 = 0; r6 < residues.length; r6++) {
                                var lx = legStart + r6 * legSpacing;
                                ctx.fillStyle = raceColors[r6 % raceColors.length];
                                ctx.fillRect(lx, legY, 10, 10);
                                ctx.fillText(residues[r6] + ' mod ' + qVal, lx + 14, legY + 9);
                            }

                            // Title
                            viz.screenText('Prime Race mod ' + qVal + ' (\u03C6 = ' + phi + ')', viz.width / 2, 18, viz.colors.white, 14);
                            viz.screenText('Each class should get \u2248 1/' + phi + ' of the primes', viz.width / 2, plotBottom + 55, viz.colors.text, 11);
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Show by a Euclidean argument that there are infinitely many primes \\(p \\equiv 2 \\pmod{3}\\).',
                    hint: 'Consider \\(N = 3p_1 p_2 \\cdots p_k - 1\\). What is \\(N \\bmod 3\\)?',
                    solution: 'Suppose \\(p_1, \\ldots, p_k\\) are the only primes \\(\\equiv 2 \\pmod{3}\\). Let \\(N = 3p_1 \\cdots p_k - 1\\). Then \\(N \\equiv 2 \\pmod{3}\\). Since a product of primes all \\(\\equiv 1 \\pmod{3}\\) is \\(\\equiv 1 \\pmod{3}\\), the number \\(N\\) must have at least one prime factor \\(\\equiv 2 \\pmod{3}\\). But \\(N\\) is coprime to all the \\(p_i\\), a contradiction.'
                }
            ]
        },

        // ================================================================
        // SECTION 2: Proof Setup — Orthogonality and the Key Formula
        // ================================================================
        {
            id: 'sec-proof-setup',
            title: 'Proof Setup',
            content: `
<h2>The Architecture of the Proof</h2>

<div class="env-block intuition">
    <div class="env-title">Characters as Frequency Filters</div>
    <div class="env-body">
        <p>The fundamental trick is character orthogonality: to isolate primes in a single residue class \\(a \\bmod q\\), we use the identity</p>
        \\[\\mathbf{1}_{n \\equiv a \\pmod{q}} = \\frac{1}{\\varphi(q)} \\sum_{\\chi \\bmod q} \\chi(a)^{-1} \\chi(n),\\]
        <p>which acts like a Fourier filter. Summing over primes, this converts the problem into understanding \\(L\\)-functions at \\(s = 1\\).</p>
    </div>
</div>

<h3>Setting Up the Sum</h3>

<p>For \\(s > 1\\), taking logarithmic derivatives of the Euler product \\(L(s, \\chi) = \\prod_p (1 - \\chi(p)p^{-s})^{-1}\\) gives</p>
\\[-\\frac{L'(s, \\chi)}{L(s, \\chi)} = \\sum_p \\frac{\\chi(p) \\log p}{p^s - \\chi(p)} = \\sum_{n=1}^\\infty \\frac{\\chi(n) \\Lambda(n)}{n^s},\\]
<p>where \\(\\Lambda\\) is the von Mangoldt function. For the purpose of proving Dirichlet's theorem (infinitude), it suffices to work with the simpler sum</p>
\\[\\log L(s, \\chi) = \\sum_p \\frac{\\chi(p)}{p^s} + O(1) \\quad \\text{as } s \\to 1^+,\\]
<p>where the \\(O(1)\\) absorbs the convergent contributions from prime powers \\(p^k\\) with \\(k \\geq 2\\).</p>

<h3>Applying Orthogonality</h3>

<p>Using the orthogonality relation and summing:</p>
\\[\\sum_{\\substack{p \\leq x \\\\ p \\equiv a \\pmod{q}}} \\frac{1}{p^s} = \\frac{1}{\\varphi(q)} \\sum_{\\chi \\bmod q} \\overline{\\chi(a)} \\sum_p \\frac{\\chi(p)}{p^s}.\\]

<p>The right side separates into:</p>
<ul>
    <li>The <strong>principal character</strong> \\(\\chi_0\\): its \\(L\\)-function satisfies \\(L(s, \\chi_0) = \\zeta(s) \\prod_{p \\mid q}(1 - p^{-s})\\), so \\(\\log L(s, \\chi_0) \\to \\infty\\) as \\(s \\to 1^+\\).</li>
    <li>The <strong>non-principal characters</strong> \\(\\chi \\neq \\chi_0\\): we need \\(\\log L(s, \\chi)\\) to remain bounded as \\(s \\to 1^+\\), which requires \\(L(1, \\chi) \\neq 0\\).</li>
</ul>

<div class="env-block theorem">
    <div class="env-title">Theorem 10.2 (Reduction to Non-vanishing)</div>
    <div class="env-body">
        <p>If \\(L(1, \\chi) \\neq 0\\) for every non-principal character \\(\\chi \\bmod q\\), then</p>
        \\[\\sum_{\\substack{p \\equiv a \\pmod{q}}} \\frac{1}{p^s} = \\frac{1}{\\varphi(q)} \\log \\frac{1}{s-1} + O_q(1) \\quad \\text{as } s \\to 1^+.\\]
        <p>In particular, the sum over \\(1/p\\) diverges, proving infinitely many primes in the class \\(a \\bmod q\\).</p>
    </div>
</div>

<p>The entire proof thus reduces to the non-vanishing statement: <strong>\\(L(1, \\chi) \\neq 0\\) for all \\(\\chi \\neq \\chi_0\\).</strong> This is the heart of the matter, and we address it in the next two sections.</p>

<div class="env-block remark">
    <div class="env-title">Historical Note</div>
    <div class="env-body">
        <p>Dirichlet introduced characters and \\(L\\)-functions precisely for this theorem, published in 1837. It was the first major application of analysis to number theory, and it established the template that analytic number theory would follow for nearly two centuries: translate a counting problem into an analytic statement about a generating function, then prove that analytic statement.</p>
    </div>
</div>
`,
            visualizations: [],
            exercises: [
                {
                    question: 'Write out the orthogonality relation explicitly for \\(q = 5\\) and \\(a = 2\\). How many characters are there, and what are their values at \\(n = 1, 2, 3, 4\\)?',
                    hint: 'There are \\(\\varphi(5) = 4\\) characters mod 5. The group \\((\\mathbb{Z}/5\\mathbb{Z})^\\times\\) is cyclic of order 4, generated by 2.',
                    solution: 'The four characters mod 5 have values: \\(\\chi_0 = (1,1,1,1)\\), \\(\\chi_1 = (1,i,-i,-1)\\), \\(\\chi_2 = (1,-1,-1,1)\\), \\(\\chi_3 = (1,-i,i,-1)\\) at \\(n=1,2,3,4\\). Orthogonality gives \\(\\frac{1}{4}\\sum_\\chi \\overline{\\chi(2)}\\chi(n) = 1\\) if \\(n \\equiv 2\\) and \\(0\\) otherwise. Check: \\(\\frac{1}{4}(1 \\cdot 1 + (-i) \\cdot i + (-1)(-1) + i(-i)) = \\frac{1}{4}(1 + 1 + 1 + 1) = 1\\).'
                },
                {
                    question: 'Show that for the principal character \\(\\chi_0 \\bmod q\\), \\(L(s, \\chi_0) = \\zeta(s) \\prod_{p \\mid q}(1 - p^{-s})\\). What does this imply about the behavior of \\(L(s, \\chi_0)\\) as \\(s \\to 1^+\\)?',
                    hint: 'Compare the Euler products: \\(\\chi_0(p) = 1\\) for \\(p \\nmid q\\) and \\(\\chi_0(p) = 0\\) for \\(p \\mid q\\).',
                    solution: '\\(L(s, \\chi_0) = \\prod_{p \\nmid q}(1 - p^{-s})^{-1} = \\zeta(s) \\cdot \\prod_{p \\mid q}(1 - p^{-s})\\). Since \\(\\zeta(s) \\to \\infty\\) as \\(s \\to 1^+\\) and the finite product \\(\\to \\prod_{p \\mid q}(1 - 1/p) = \\varphi(q)/q > 0\\), we get \\(L(s, \\chi_0) \\to \\infty\\). More precisely, \\(L(s, \\chi_0) \\sim \\frac{\\varphi(q)}{q} \\cdot \\frac{1}{s-1}\\) as \\(s \\to 1^+\\).'
                }
            ]
        },

        // ================================================================
        // SECTION 3: L(1,χ) ≠ 0 for Complex Characters (Easy Case)
        // ================================================================
        {
            id: 'sec-complex-chi',
            title: 'L(1,\u03C7) \u2260 0: Complex Case',
            content: `
<h2>Non-vanishing for Complex Characters</h2>

<div class="env-block intuition">
    <div class="env-title">The Product Trick</div>
    <div class="env-body">
        <p>When \\(\\chi\\) is complex (i.e., \\(\\chi \\neq \\overline{\\chi}\\)), the proof that \\(L(1, \\chi) \\neq 0\\) is surprisingly elegant. The key idea: consider the product \\(\\prod_{\\chi \\bmod q} L(s, \\chi)\\) over all characters. This product has a representation as a Dirichlet series with non-negative coefficients, and it has a pole at \\(s = 1\\) (from \\(\\chi_0\\)). If any \\(L(1, \\chi)\\) were zero, the zero would cancel the pole, making the product bounded near \\(s = 1\\), which contradicts the non-negative coefficients growing unboundedly.</p>
    </div>
</div>

<h3>The Product Formula</h3>

<p>Define the "Dedekind-like" product</p>
\\[F(s) = \\prod_{\\chi \\bmod q} L(s, \\chi).\\]

<div class="env-block theorem">
    <div class="env-title">Theorem 10.3 (Product Representation)</div>
    <div class="env-body">
        <p>For \\(s > 1\\),</p>
        \\[F(s) = \\prod_{\\chi \\bmod q} L(s, \\chi) = \\prod_p \\prod_{\\chi} \\frac{1}{1 - \\chi(p) p^{-s}}.\\]
        <p>For each prime \\(p \\nmid q\\), let \\(f\\) be the order of \\(p\\) in \\((\\mathbb{Z}/q\\mathbb{Z})^\\times\\). Then</p>
        \\[\\prod_{\\chi} (1 - \\chi(p) p^{-s})^{-1} = (1 - p^{-fs})^{-\\varphi(q)/f}.\\]
        <p>In particular, \\(F(s) = \\sum_{n=1}^\\infty a_n n^{-s}\\) with \\(a_n \\geq 0\\) for all \\(n\\).</p>
    </div>
</div>

<h3>The Non-vanishing Argument</h3>

<div class="env-block theorem">
    <div class="env-title">Theorem 10.4 (Non-vanishing, Complex Case)</div>
    <div class="env-body">
        <p>If \\(\\chi \\bmod q\\) is a complex character (\\(\\chi \\neq \\overline{\\chi}\\)), then \\(L(1, \\chi) \\neq 0\\).</p>
    </div>
</div>

<div class="env-block proof">
    <div class="env-title">Proof</div>
    <div class="env-body">
        <p>Since \\(\\chi\\) is complex, \\(\\overline{\\chi}\\) is a distinct non-principal character, and \\(L(1, \\overline{\\chi}) = \\overline{L(1, \\chi)}\\). So if \\(L(1, \\chi) = 0\\), then also \\(L(1, \\overline{\\chi}) = 0\\).</p>
        <p>Now consider \\(F(s)\\) near \\(s = 1\\):</p>
        <ul>
            <li>\\(L(s, \\chi_0)\\) has a simple pole at \\(s = 1\\) (order 1).</li>
            <li>If \\(L(1, \\chi) = 0\\), then \\(L(s, \\chi)\\) has a zero at \\(s = 1\\) of order \\(\\geq 1\\), and so does \\(L(s, \\overline{\\chi})\\).</li>
            <li>All other \\(L(s, \\chi')\\) are bounded near \\(s = 1\\).</li>
        </ul>
        <p>Total: \\(F(s)\\) has the pole of order 1 from \\(\\chi_0\\) canceled by zeros of order \\(\\geq 2\\) from the pair \\(\\{\\chi, \\overline{\\chi}\\}\\). Thus \\(F(s) \\to 0\\) as \\(s \\to 1^+\\).</p>
        <p>But \\(F(s) = \\sum a_n n^{-s}\\) with \\(a_n \\geq 0\\) and \\(a_1 = 1\\). For \\(s > 1\\), \\(F(s) \\geq a_1 = 1 > 0\\). This contradicts \\(F(s) \\to 0\\). \\(\\square\\)</p>
    </div>
</div>

<div class="env-block remark">
    <div class="env-title">Why This Fails for Real Characters</div>
    <div class="env-body">
        <p>If \\(\\chi\\) is a real, non-principal character, then \\(\\overline{\\chi} = \\chi\\), so a zero at \\(s = 1\\) gives only a single zero to cancel the simple pole. The product \\(F(s)\\) would then approach a finite, possibly nonzero limit. The argument breaks down, and we need a fundamentally different approach.</p>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-l1-values"></div>
`,
            visualizations: [
                {
                    id: 'viz-l1-values',
                    title: 'Values of L(1, \u03C7) in the Complex Plane',
                    description: 'Plot the values of L(1, \u03C7) for all non-principal characters mod q. Complex characters come in conjugate pairs. Notice how they are all bounded away from the origin.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 400,
                            originX: 280, originY: 200, scale: 80
                        });

                        var qVal = 7;

                        VizEngine.createSlider(controls, 'q (modulus)', 3, 20, qVal, 1, function(v) {
                            qVal = Math.round(v);
                            draw();
                        });

                        function gcd(a, b) { while (b) { var t = b; b = a % b; a = t; } return a; }

                        // Compute characters mod q via discrete log
                        function getCharacters(q) {
                            // Find primitive root if exists, otherwise use character table
                            var coprimes = [];
                            for (var a = 1; a < q; a++) {
                                if (gcd(a, q) === 1) coprimes.push(a);
                            }
                            var phi = coprimes.length;
                            var chars = [];

                            // For simplicity, compute L(1,chi) numerically using partial sums
                            // Generate characters via DFT on the group
                            for (var k = 0; k < phi; k++) {
                                var chiVals = {};
                                for (var j = 0; j < phi; j++) {
                                    var angle = 2 * Math.PI * k * j / phi;
                                    chiVals[coprimes[j]] = { re: Math.cos(angle), im: Math.sin(angle) };
                                }
                                // This is not quite right for non-cyclic groups, but works for prime q
                                chars.push(chiVals);
                            }
                            return { chars: chars, coprimes: coprimes, phi: phi };
                        }

                        // Compute L(1, chi) by partial sums (Euler product approx would be better but this suffices)
                        function computeL1(chiVals, q, N) {
                            var re = 0, im = 0;
                            for (var n = 1; n <= N; n++) {
                                var rem = n % q;
                                if (gcd(rem, q) !== 1) continue;
                                var cv = chiVals[rem];
                                if (!cv) continue;
                                re += cv.re / n;
                                im += cv.im / n;
                            }
                            return { re: re, im: im };
                        }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            viz.drawGrid(0.5);
                            viz.drawAxes();
                            viz.screenText('L(1, \u03C7) for \u03C7 mod ' + qVal, viz.width / 2, 18, viz.colors.white, 14);
                            viz.screenText('Re', viz.width - 25, viz.originY - 8, viz.colors.text, 11);
                            viz.screenText('Im', viz.originX + 10, 15, viz.colors.text, 11);

                            var info = getCharacters(qVal);
                            var N = 5000; // partial sum truncation

                            var pointColors = [
                                viz.colors.blue, viz.colors.teal, viz.colors.orange,
                                viz.colors.purple, viz.colors.green, viz.colors.red,
                                viz.colors.yellow, viz.colors.pink
                            ];

                            var plotted = 0;
                            for (var k = 1; k < info.phi; k++) { // skip principal character (k=0)
                                var L = computeL1(info.chars[k], qVal, N);
                                var col = pointColors[plotted % pointColors.length];
                                viz.drawPoint(L.re, L.im, col, '\u03C7_' + k, 6);
                                plotted++;
                            }

                            // Mark origin
                            ctx.strokeStyle = viz.colors.red + '44';
                            ctx.lineWidth = 1;
                            ctx.setLineDash([4, 4]);
                            ctx.beginPath();
                            ctx.arc(viz.originX, viz.originY, 10, 0, Math.PI * 2);
                            ctx.stroke();
                            ctx.setLineDash([]);

                            viz.screenText('All values avoid the origin (L(1,\u03C7) \u2260 0)', viz.width / 2, viz.height - 15, viz.colors.teal, 11);
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Let \\(q = 5\\). Compute the product \\(\\prod_{\\chi \\bmod 5} (1 - \\chi(2) \\cdot 2^{-s})^{-1}\\) and verify that it equals \\((1 - 2^{-fs})^{-\\varphi(5)/f}\\) where \\(f\\) is the order of \\(2\\) mod 5.',
                    hint: 'The order of 2 mod 5 is 4 (since \\(2^4 = 16 \\equiv 1 \\pmod{5}\\) and no smaller power works). So \\(f = 4 = \\varphi(5)\\).',
                    solution: 'Since \\(f = 4 = \\varphi(5)\\), the formula gives \\((1 - 2^{-4s})^{-1}\\). The character values at 2 are \\(1, i, -1, -i\\) (the 4th roots of unity). So the product is \\(\\prod_{j=0}^{3}(1 - \\omega^j 2^{-s})^{-1}\\) where \\(\\omega = i\\). This equals \\((1 - 2^{-4s})^{-1}\\) by the factorization \\(1 - x^4 = \\prod(1 - \\omega^j x)\\). \\(\\checkmark\\)'
                }
            ]
        },

        // ================================================================
        // SECTION 4: L(1,χ) ≠ 0 for the Real Character (Hard Case)
        // ================================================================
        {
            id: 'sec-real-chi',
            title: 'L(1,\u03C7) \u2260 0: Real Case',
            content: `
<h2>The Real Character: Class Numbers and Positivity</h2>

<div class="env-block intuition">
    <div class="env-title">Why the Real Case Is Hard</div>
    <div class="env-body">
        <p>For a real non-principal character \\(\\chi\\) (which exists only when \\(q\\) has a primitive quadratic character, e.g., the Legendre symbol), the product trick gives no contradiction because \\(\\overline{\\chi} = \\chi\\). A single zero at \\(s = 1\\) would exactly cancel the simple pole from \\(\\chi_0\\), leaving the product finite and positive. We need a completely different idea.</p>
    </div>
</div>

<h3>Dirichlet's Class Number Formula</h3>

<p>Dirichlet's stroke of genius was to connect \\(L(1, \\chi)\\) to an algebraic invariant: the class number of a quadratic field. For a fundamental discriminant \\(D\\) (with \\(|D| = q\\) or related), the quadratic character \\(\\chi_D(n) = \\left(\\frac{D}{n}\\right)\\) (the Kronecker symbol) satisfies:</p>

<div class="env-block theorem">
    <div class="env-title">Theorem 10.5 (Dirichlet Class Number Formula)</div>
    <div class="env-body">
        <p>Let \\(D\\) be a fundamental discriminant and \\(\\chi_D\\) the associated primitive quadratic character. Then:</p>
        <ul>
            <li>If \\(D < 0\\) (imaginary quadratic field \\(\\mathbb{Q}(\\sqrt{D})\\)):
            \\[L(1, \\chi_D) = \\frac{2\\pi h(D)}{w \\sqrt{|D|}}\\]
            where \\(h(D)\\) is the class number and \\(w\\) is the number of roots of unity (\\(w = 2\\) for \\(D < -4\\)).</li>
            <li>If \\(D > 0\\) (real quadratic field):
            \\[L(1, \\chi_D) = \\frac{2 h(D) \\log \\varepsilon}{\\sqrt{D}}\\]
            where \\(\\varepsilon > 1\\) is the fundamental unit.</li>
        </ul>
    </div>
</div>

<p>Since \\(h(D) \\geq 1\\) (the principal class always exists), and all other quantities are positive, we conclude:</p>

<div class="env-block corollary">
    <div class="env-title">Corollary (Non-vanishing for Real Characters)</div>
    <div class="env-body">
        <p>For every real primitive character \\(\\chi_D\\), \\(L(1, \\chi_D) > 0\\). Combined with the complex case, this completes the proof that \\(L(1, \\chi) \\neq 0\\) for all non-principal characters.</p>
    </div>
</div>

<h3>An Alternative: The Direct Positivity Argument</h3>

<p>There is a more elementary approach (due essentially to de la Vallee Poussin and Mertens) that avoids the class number formula. For a real character \\(\\chi\\), one shows directly that</p>
\\[L(1, \\chi) = \\sum_{n=1}^\\infty \\frac{\\chi(n)}{n} > 0\\]
<p>by grouping terms and using the fact that \\(\\chi\\) is a real quadratic character. The idea is to write</p>
\\[\\sum_{n \\leq x} \\frac{\\chi(n)}{n} = \\sum_{n \\leq x} \\frac{1}{n} \\sum_{d^2 \\mid n} \\mu(n/d^2) \\cdot (\\text{something positive}),\\]
<p>exploiting the connection between \\(\\chi\\) and the representation of integers by quadratic forms. The convergent series \\(\\sum \\chi(n)/n\\) is then shown to have strictly positive partial sums, from which positivity of the limit follows.</p>

<div class="viz-placeholder" data-viz="viz-class-number"></div>
`,
            visualizations: [
                {
                    id: 'viz-class-number',
                    title: 'Class Numbers and L(1, \u03C7)',
                    description: 'For negative discriminants D, the class number formula gives L(1, \u03C7_D) = 2\u03C0 h(D) / (w \u221A|D|). Since h(D) \u2265 1, L(1, \u03C7_D) is always positive. Explore how class numbers grow with |D|.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 400,
                            originX: 0, originY: 0, scale: 1
                        });

                        // Precomputed class numbers for small negative discriminants
                        // h(-3)=1, h(-4)=1, h(-7)=1, h(-8)=1, h(-11)=1, h(-15)=2, h(-19)=1, h(-20)=2, ...
                        var classData = [
                            { D: -3, h: 1, w: 6 },
                            { D: -4, h: 1, w: 4 },
                            { D: -7, h: 1, w: 2 },
                            { D: -8, h: 1, w: 2 },
                            { D: -11, h: 1, w: 2 },
                            { D: -15, h: 2, w: 2 },
                            { D: -19, h: 1, w: 2 },
                            { D: -20, h: 2, w: 2 },
                            { D: -23, h: 3, w: 2 },
                            { D: -24, h: 2, w: 2 },
                            { D: -31, h: 3, w: 2 },
                            { D: -35, h: 2, w: 2 },
                            { D: -39, h: 4, w: 2 },
                            { D: -40, h: 2, w: 2 },
                            { D: -43, h: 1, w: 2 },
                            { D: -47, h: 5, w: 2 },
                            { D: -51, h: 2, w: 2 },
                            { D: -52, h: 2, w: 2 },
                            { D: -55, h: 4, w: 2 },
                            { D: -56, h: 4, w: 2 },
                            { D: -59, h: 3, w: 2 },
                            { D: -67, h: 1, w: 2 },
                            { D: -68, h: 4, w: 2 },
                            { D: -71, h: 7, w: 2 },
                            { D: -79, h: 5, w: 2 },
                            { D: -83, h: 3, w: 2 },
                            { D: -84, h: 4, w: 2 },
                            { D: -87, h: 6, w: 2 },
                            { D: -88, h: 2, w: 2 },
                            { D: -91, h: 2, w: 2 },
                            { D: -95, h: 8, w: 2 },
                            { D: -104, h: 6, w: 2 },
                            { D: -107, h: 3, w: 2 },
                            { D: -115, h: 2, w: 2 },
                            { D: -116, h: 6, w: 2 },
                            { D: -119, h: 10, w: 2 },
                            { D: -120, h: 4, w: 2 },
                            { D: -123, h: 2, w: 2 },
                            { D: -127, h: 5, w: 2 },
                            { D: -131, h: 5, w: 2 },
                            { D: -148, h: 2, w: 2 },
                            { D: -163, h: 1, w: 2 }
                        ];

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            var plotLeft = 70, plotRight = viz.width - 30;
                            var plotTop = 50, plotBottom = 300;
                            var plotW = plotRight - plotLeft;
                            var plotH = plotBottom - plotTop;

                            // Title
                            viz.screenText('Class Numbers h(D) and L(1, \u03C7_D)', viz.width / 2, 18, viz.colors.white, 14);

                            // Find max |D| and max h for scaling
                            var maxAbsD = 170;
                            var maxH = 0;
                            for (var i = 0; i < classData.length; i++) {
                                if (classData[i].h > maxH) maxH = classData[i].h;
                            }

                            // Axes
                            ctx.strokeStyle = viz.colors.axis;
                            ctx.lineWidth = 1;
                            ctx.beginPath();
                            ctx.moveTo(plotLeft, plotBottom);
                            ctx.lineTo(plotRight, plotBottom);
                            ctx.stroke();
                            ctx.beginPath();
                            ctx.moveTo(plotLeft, plotBottom);
                            ctx.lineTo(plotLeft, plotTop);
                            ctx.stroke();

                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '11px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'top';
                            ctx.fillText('|D|', viz.width / 2, plotBottom + 20);
                            ctx.save();
                            ctx.translate(20, (plotTop + plotBottom) / 2);
                            ctx.rotate(-Math.PI / 2);
                            ctx.textBaseline = 'middle';
                            ctx.fillText('h(D)', 0, 0);
                            ctx.restore();

                            // Y labels
                            ctx.textAlign = 'right';
                            ctx.textBaseline = 'middle';
                            for (var yt = 0; yt <= maxH; yt += 2) {
                                var yy = plotBottom - (yt / maxH) * plotH;
                                ctx.fillStyle = viz.colors.text;
                                ctx.fillText(yt.toString(), plotLeft - 5, yy);
                                ctx.strokeStyle = viz.colors.grid;
                                ctx.lineWidth = 0.3;
                                ctx.beginPath();
                                ctx.moveTo(plotLeft, yy);
                                ctx.lineTo(plotRight, yy);
                                ctx.stroke();
                            }

                            // X labels
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'top';
                            for (var xt = 0; xt <= maxAbsD; xt += 20) {
                                var xx = plotLeft + (xt / maxAbsD) * plotW;
                                ctx.fillStyle = viz.colors.text;
                                ctx.fillText(xt.toString(), xx, plotBottom + 4);
                            }

                            // Plot class numbers as dots
                            for (var j = 0; j < classData.length; j++) {
                                var d = classData[j];
                                var px = plotLeft + (Math.abs(d.D) / maxAbsD) * plotW;
                                var py = plotBottom - (d.h / maxH) * plotH;

                                // Color: h=1 (class number 1, special) in blue, others in teal
                                var col = d.h === 1 ? viz.colors.blue : viz.colors.teal;
                                ctx.fillStyle = col;
                                ctx.beginPath();
                                ctx.arc(px, py, 4, 0, Math.PI * 2);
                                ctx.fill();
                            }

                            // Compute L(1, chi_D) for each and show
                            var lPlotTop = plotBottom + 45;
                            var lPlotBottom = viz.height - 20;
                            var lPlotH = lPlotBottom - lPlotTop;

                            viz.screenText('L(1, \u03C7_D) = 2\u03C0 h / (w\u221A|D|)', viz.width / 2, lPlotTop - 8, viz.colors.orange, 11);

                            // Plot L values as bar-like dots
                            var maxL = 0;
                            for (var k = 0; k < classData.length; k++) {
                                var dd = classData[k];
                                var Lval = 2 * Math.PI * dd.h / (dd.w * Math.sqrt(Math.abs(dd.D)));
                                if (Lval > maxL) maxL = Lval;
                            }

                            ctx.strokeStyle = viz.colors.orange + '44';
                            ctx.lineWidth = 0.3;
                            ctx.beginPath();
                            var zeroY = lPlotBottom;
                            ctx.moveTo(plotLeft, zeroY);
                            ctx.lineTo(plotRight, zeroY);
                            ctx.stroke();

                            for (var m = 0; m < classData.length; m++) {
                                var dm = classData[m];
                                var Lv = 2 * Math.PI * dm.h / (dm.w * Math.sqrt(Math.abs(dm.D)));
                                var bx = plotLeft + (Math.abs(dm.D) / maxAbsD) * plotW;
                                var by = lPlotBottom - (Lv / maxL) * lPlotH;

                                ctx.fillStyle = viz.colors.orange;
                                ctx.beginPath();
                                ctx.arc(bx, by, 3, 0, Math.PI * 2);
                                ctx.fill();
                            }

                            viz.screenText('All L(1,\u03C7_D) > 0: the class number is always \u2265 1', viz.width / 2, viz.height - 5, viz.colors.teal, 10);
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Compute \\(L(1, \\chi_{-4})\\) where \\(\\chi_{-4}\\) is the non-principal character mod 4 (i.e., \\(\\chi_{-4}(n) = 0, 1, 0, -1, 0, 1, 0, -1, \\ldots\\)). Relate it to a well-known series.',
                    hint: 'The series is \\(1 - 1/3 + 1/5 - 1/7 + \\cdots\\). This is the Leibniz formula for what?',
                    solution: '\\(L(1, \\chi_{-4}) = \\sum_{n=0}^\\infty \\frac{(-1)^n}{2n+1} = 1 - \\frac{1}{3} + \\frac{1}{5} - \\frac{1}{7} + \\cdots = \\frac{\\pi}{4}\\). From the class number formula with \\(D = -4\\), \\(h(-4) = 1\\), \\(w = 4\\): \\(L(1, \\chi_{-4}) = \\frac{2\\pi \\cdot 1}{4 \\cdot \\sqrt{4}} = \\frac{\\pi}{4}\\). \\(\\checkmark\\)'
                },
                {
                    question: 'Why does the "product trick" fail for real characters? Explain precisely what goes wrong in the order-of-vanishing count.',
                    hint: 'For complex \\(\\chi\\), the pair \\(\\{\\chi, \\overline{\\chi}\\}\\) contributes two zeros to cancel one pole. For real \\(\\chi\\), the pair collapses.',
                    solution: 'For complex \\(\\chi\\), if \\(L(1,\\chi)=0\\) then \\(L(1,\\overline{\\chi})=0\\) too, giving two zeros to cancel the single pole of \\(L(s,\\chi_0)\\), so \\(F(s) \\to 0\\), contradicting \\(F(s) \\geq 1\\). For real \\(\\chi\\), \\(\\overline{\\chi} = \\chi\\), so the zero-pair collapses to a single zero, which exactly cancels the pole. The product \\(F(s)\\) approaches a finite positive limit, and no contradiction arises.'
                }
            ]
        },

        // ================================================================
        // SECTION 5: Quantitative Form — PNT for Arithmetic Progressions
        // ================================================================
        {
            id: 'sec-quantitative',
            title: 'PNT for Progressions',
            content: `
<h2>The Prime Number Theorem in Arithmetic Progressions</h2>

<div class="env-block intuition">
    <div class="env-title">From Infinitude to Asymptotics</div>
    <div class="env-body">
        <p>Dirichlet's theorem says each coprime class has infinitely many primes. The prime number theorem for arithmetic progressions gives the precise rate: each class gets asymptotically \\(1/\\varphi(q)\\) of all primes. This is the quantitative version of "every lane carries equal traffic."</p>
    </div>
</div>

<div class="env-block theorem">
    <div class="env-title">Theorem 10.6 (PNT for Arithmetic Progressions)</div>
    <div class="env-body">
        <p>For \\(\\gcd(a, q) = 1\\),</p>
        \\[\\pi(x; q, a) := \\#\\{p \\leq x : p \\equiv a \\pmod{q}\\} \\sim \\frac{\\mathrm{li}(x)}{\\varphi(q)} \\quad \\text{as } x \\to \\infty.\\]
        <p>Equivalently,</p>
        \\[\\psi(x; q, a) := \\sum_{\\substack{n \\leq x \\\\ n \\equiv a \\pmod{q}}} \\Lambda(n) \\sim \\frac{x}{\\varphi(q)}.\\]
    </div>
</div>

<h3>The Explicit Formula for Progressions</h3>

<p>Just as the PNT for all primes rests on the zeros of \\(\\zeta(s)\\), the PNT in progressions rests on the zeros of all \\(L(s, \\chi)\\) with \\(\\chi \\bmod q\\):</p>

\\[\\psi(x; q, a) = \\frac{x}{\\varphi(q)} - \\frac{1}{\\varphi(q)} \\sum_{\\chi \\bmod q} \\overline{\\chi(a)} \\sum_{\\rho_{\\chi}} \\frac{x^{\\rho_\\chi}}{\\rho_\\chi} + O(\\log^2 x),\\]

<p>where \\(\\rho_\\chi\\) runs over the non-trivial zeros of \\(L(s, \\chi)\\). The error term depends on how far the zeros \\(\\rho_\\chi\\) are from the line \\(\\operatorname{Re}(s) = 1\\).</p>

<h3>The Generalized Riemann Hypothesis</h3>

<div class="env-block definition">
    <div class="env-title">Conjecture (GRH for Dirichlet L-functions)</div>
    <div class="env-body">
        <p>All non-trivial zeros of \\(L(s, \\chi)\\), for every primitive character \\(\\chi\\), lie on the critical line \\(\\operatorname{Re}(s) = 1/2\\).</p>
    </div>
</div>

<p>Under GRH, the error term improves dramatically:</p>

<div class="env-block theorem">
    <div class="env-title">Theorem 10.7 (Conditional on GRH)</div>
    <div class="env-body">
        <p>Assuming GRH for all \\(L(s, \\chi)\\) with \\(\\chi \\bmod q\\),</p>
        \\[\\psi(x; q, a) = \\frac{x}{\\varphi(q)} + O(\\sqrt{x} \\log^2(qx)).\\]
    </div>
</div>

<p>Without GRH, the best unconditional results come from zero-free regions of \\(L\\)-functions, analogous to the classical zero-free region for \\(\\zeta(s)\\).</p>

<h3>Uniformity in \\(q\\): The Siegel-Walfisz Theorem</h3>

<p>The asymptotic \\(\\pi(x; q, a) \\sim \\mathrm{li}(x)/\\varphi(q)\\) holds for each fixed \\(q\\), but the implicit constant depends on \\(q\\). How large can \\(q\\) be relative to \\(x\\) while the asymptotic remains valid?</p>

<div class="env-block theorem">
    <div class="env-title">Theorem 10.8 (Siegel-Walfisz, 1936)</div>
    <div class="env-body">
        <p>For any fixed \\(A > 0\\), there exists \\(c(A) > 0\\) such that</p>
        \\[\\psi(x; q, a) = \\frac{x}{\\varphi(q)} + O_A\\left(x \\exp(-c(A) \\sqrt{\\log x})\\right)\\]
        <p>uniformly for \\(q \\leq (\\log x)^A\\).</p>
    </div>
</div>

<p>The limitation \\(q \\leq (\\log x)^A\\) is quite restrictive. The Bombieri-Vinogradov theorem (Chapter 13) dramatically extends the range of uniformity on average over \\(q\\).</p>

<div class="viz-placeholder" data-viz="viz-equidistribution"></div>
`,
            visualizations: [
                {
                    id: 'viz-equidistribution',
                    title: 'Equidistribution of Primes in Residue Classes',
                    description: 'For each coprime residue class mod q, plot the fraction of primes up to x falling in that class. The prediction is 1/\u03C6(q) for each. Watch convergence as x grows.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 400,
                            originX: 0, originY: 0, scale: 1
                        });

                        var primes = VizEngine.sievePrimes(50000);
                        var qVal = 5;
                        var xMax = 10000;

                        VizEngine.createSlider(controls, 'q (modulus)', 3, 12, qVal, 1, function(v) {
                            qVal = Math.round(v);
                            draw();
                        });
                        VizEngine.createSlider(controls, 'x max', 1000, 50000, xMax, 1000, function(v) {
                            xMax = Math.round(v);
                            draw();
                        });

                        function gcd(a, b) { while (b) { var t = b; b = a % b; a = t; } return a; }

                        var lineColors = [
                            viz.colors.blue, viz.colors.teal, viz.colors.orange,
                            viz.colors.purple, viz.colors.green, viz.colors.red,
                            viz.colors.yellow, viz.colors.pink
                        ];

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            var residues = [];
                            for (var a = 1; a < qVal; a++) {
                                if (gcd(a, qVal) === 1) residues.push(a);
                            }
                            var phi = residues.length;
                            var target = 1 / phi;

                            var plotLeft = 70, plotRight = viz.width - 30;
                            var plotTop = 40, plotBottom = 330;
                            var plotW = plotRight - plotLeft;
                            var plotH = plotBottom - plotTop;

                            // Compute fractions at many x values
                            var steps = 200;
                            var fractions = {};
                            for (var r = 0; r < residues.length; r++) fractions[residues[r]] = [];

                            for (var i = 0; i <= steps; i++) {
                                var x = Math.round(200 + (xMax - 200) * i / steps);
                                var total = 0;
                                var cnts = {};
                                for (var r2 = 0; r2 < residues.length; r2++) cnts[residues[r2]] = 0;

                                for (var j = 0; j < primes.length && primes[j] <= x; j++) {
                                    if (gcd(primes[j], qVal) === 1) {
                                        total++;
                                        var rem = primes[j] % qVal;
                                        if (cnts[rem] !== undefined) cnts[rem]++;
                                    }
                                }

                                for (var r3 = 0; r3 < residues.length; r3++) {
                                    fractions[residues[r3]].push({
                                        x: x,
                                        frac: total > 0 ? cnts[residues[r3]] / total : 0
                                    });
                                }
                            }

                            // Y range: center on target
                            var yMin = target - 0.15;
                            var yMax2 = target + 0.15;
                            if (yMin < 0) { yMin = 0; yMax2 = 2 * target + 0.1; }

                            // Axes
                            ctx.strokeStyle = viz.colors.axis;
                            ctx.lineWidth = 1;
                            ctx.beginPath();
                            ctx.moveTo(plotLeft, plotBottom);
                            ctx.lineTo(plotRight, plotBottom);
                            ctx.stroke();
                            ctx.beginPath();
                            ctx.moveTo(plotLeft, plotBottom);
                            ctx.lineTo(plotLeft, plotTop);
                            ctx.stroke();

                            // Target line
                            var targetY = plotBottom - ((target - yMin) / (yMax2 - yMin)) * plotH;
                            ctx.strokeStyle = viz.colors.white + '66';
                            ctx.lineWidth = 1;
                            ctx.setLineDash([6, 4]);
                            ctx.beginPath();
                            ctx.moveTo(plotLeft, targetY);
                            ctx.lineTo(plotRight, targetY);
                            ctx.stroke();
                            ctx.setLineDash([]);
                            ctx.fillStyle = viz.colors.white;
                            ctx.font = '11px -apple-system,sans-serif';
                            ctx.textAlign = 'right';
                            ctx.textBaseline = 'bottom';
                            ctx.fillText('1/\u03C6 = ' + target.toFixed(3), plotLeft - 5, targetY);

                            // Draw fraction curves
                            for (var r4 = 0; r4 < residues.length; r4++) {
                                var data = fractions[residues[r4]];
                                var col = lineColors[r4 % lineColors.length];
                                ctx.strokeStyle = col;
                                ctx.lineWidth = 1.5;
                                ctx.beginPath();
                                for (var k = 0; k < data.length; k++) {
                                    var px = plotLeft + (k / steps) * plotW;
                                    var py = plotBottom - ((data[k].frac - yMin) / (yMax2 - yMin)) * plotH;
                                    py = Math.max(plotTop, Math.min(plotBottom, py));
                                    if (k === 0) ctx.moveTo(px, py);
                                    else ctx.lineTo(px, py);
                                }
                                ctx.stroke();
                            }

                            // Legend
                            var legY = plotBottom + 20;
                            var legSpacing = Math.min(80, (viz.width - 40) / residues.length);
                            var legStart = (viz.width - residues.length * legSpacing) / 2;
                            ctx.font = '11px -apple-system,sans-serif';
                            ctx.textAlign = 'left';
                            for (var r5 = 0; r5 < residues.length; r5++) {
                                var lx = legStart + r5 * legSpacing;
                                ctx.fillStyle = lineColors[r5 % lineColors.length];
                                ctx.fillRect(lx, legY, 10, 10);
                                ctx.fillText(residues[r5] + ' mod ' + qVal, lx + 14, legY + 9);
                            }

                            viz.screenText('Fraction of primes in each class mod ' + qVal, viz.width / 2, 18, viz.colors.white, 14);
                            viz.screenText('All curves converge to 1/\u03C6(q) = ' + target.toFixed(4), viz.width / 2, plotBottom + 50, viz.colors.teal, 11);
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Compute \\(\\pi(1000; 5, 1)\\), \\(\\pi(1000; 5, 2)\\), \\(\\pi(1000; 5, 3)\\), \\(\\pi(1000; 5, 4)\\). How close are the ratios to \\(1/4\\)?',
                    hint: 'The primes up to 1000 not equal to 5 must fall in one of the four classes 1, 2, 3, 4 mod 5. Count them (or look up a table).',
                    solution: 'There are 167 primes up to 1000 (excluding 2, 3, 5). Among primes up to 1000: \\(\\pi(1000;5,1) = 40\\), \\(\\pi(1000;5,2) = 42\\), \\(\\pi(1000;5,3) = 42\\), \\(\\pi(1000;5,4) = 43\\) (the exact counts depend on including 2 and 3). The total is 167 (for \\(p > 5\\)), and the ratios are approximately \\(40/167 \\approx 0.240\\), \\(42/167 \\approx 0.251\\), \\(42/167 \\approx 0.251\\), \\(43/167 \\approx 0.257\\). All close to \\(1/4 = 0.25\\).'
                },
                {
                    question: 'Explain why the Siegel-Walfisz theorem only gives uniformity for \\(q \\leq (\\log x)^A\\), and why this range is unsatisfying for applications.',
                    hint: 'Think about what range of \\(q\\) appears in sieve methods or the Goldbach problem.',
                    solution: 'Applications like the Goldbach problem need primes in progressions with \\(q \\approx \\sqrt{x}\\) or even \\(q \\approx x^{1/2}\\), far exceeding \\((\\log x)^A\\). The Siegel-Walfisz range \\(q \\leq (\\log x)^A\\) covers only fixed moduli as \\(x \\to \\infty\\). The limitation comes from possible Siegel zeros: if an \\(L(s, \\chi_D)\\) has a real zero very close to \\(s = 1\\), its contribution to \\(\\psi(x; q, a)\\) could be large and the error bound depends ineffectively on \\(q\\). The Bombieri-Vinogradov theorem circumvents this by averaging over \\(q\\).'
                }
            ]
        },

        // ================================================================
        // SECTION 6: Siegel Zeros — The Persistent Ghost
        // ================================================================
        {
            id: 'sec-siegel',
            title: 'Siegel Zeros',
            content: `
<h2>Siegel Zeros: The Persistent Ghost</h2>

<div class="env-block intuition">
    <div class="env-title">A Zero That Probably Doesn't Exist</div>
    <div class="env-body">
        <p>The deepest obstacle in the theory of primes in progressions is the possible existence of "Siegel zeros": real zeros of \\(L(s, \\chi_D)\\) for a real character \\(\\chi_D\\), lying very close to \\(s = 1\\). Dirichlet's theorem tells us \\(L(1, \\chi) \\neq 0\\), but it says nothing about how close a zero can get. If a zero \\(\\beta\\) exists with \\(1 - \\beta < 1/\\log q\\), it wreaks havoc on the distribution of primes mod \\(q\\).</p>
    </div>
</div>

<h3>What Is a Siegel Zero?</h3>

<div class="env-block definition">
    <div class="env-title">Definition (Exceptional Zero / Siegel Zero)</div>
    <div class="env-body">
        <p>A <strong>Siegel zero</strong> (or exceptional zero) is a real zero \\(\\beta \\in (0, 1)\\) of \\(L(s, \\chi_D)\\) for a real primitive character \\(\\chi_D\\), satisfying</p>
        \\[1 - \\beta < \\frac{c}{\\log q}\\]
        <p>for some absolute constant \\(c > 0\\). If such a zero exists, \\(\\chi_D\\) is called the <strong>exceptional character</strong> mod \\(q\\).</p>
    </div>
</div>

<h3>The Zero-Free Region with Exception</h3>

<p>For general Dirichlet \\(L\\)-functions, the standard zero-free region mirrors the classical one for \\(\\zeta(s)\\):</p>

<div class="env-block theorem">
    <div class="env-title">Theorem 10.9 (Zero-free Region for \\(L\\)-functions)</div>
    <div class="env-body">
        <p>There exists \\(c > 0\\) such that \\(L(s, \\chi)\\) has no zeros in the region</p>
        \\[\\operatorname{Re}(s) > 1 - \\frac{c}{\\log(q(|t| + 2))}\\]
        <p>with at most one exception: a single real zero \\(\\beta_1\\) belonging to a real character \\(\\chi_1\\) (the possible Siegel zero).</p>
    </div>
</div>

<h3>Siegel's Theorem</h3>

<p>We cannot prove that Siegel zeros don't exist, but we can show they can't be too close to 1:</p>

<div class="env-block theorem">
    <div class="env-title">Theorem 10.10 (Siegel, 1935)</div>
    <div class="env-body">
        <p>For every \\(\\varepsilon > 0\\), there exists \\(c(\\varepsilon) > 0\\) (ineffective!) such that</p>
        \\[L(1, \\chi_D) > c(\\varepsilon) |D|^{-\\varepsilon}\\]
        <p>for every real primitive character \\(\\chi_D\\). Equivalently, if \\(\\beta\\) is a real zero, then</p>
        \\[\\beta < 1 - c(\\varepsilon) q^{-\\varepsilon}.\\]
    </div>
</div>

<div class="env-block remark">
    <div class="env-title">The Ineffectivity Problem</div>
    <div class="env-body">
        <p>Siegel's theorem is <strong>ineffective</strong>: the constant \\(c(\\varepsilon)\\) exists but cannot be computed. This is because the proof proceeds by contradiction in a subtle way: either every \\(L(s, \\chi)\\) is far from zero, or there is one that is close, but if there is one that is close, then all <em>other</em> \\(L(s, \\chi')\\) are far from zero. We can conclude that "at most one" modulus can have a Siegel zero, but we cannot determine which one. This ineffectivity propagates into the Siegel-Walfisz theorem and is one of the most frustrating aspects of analytic number theory.</p>
    </div>
</div>

<h3>Consequences of a Siegel Zero</h3>

<p>If a Siegel zero \\(\\beta_1\\) existed for \\(\\chi_D \\bmod q\\), it would cause striking effects:</p>
<ul>
    <li><strong>Biased distribution:</strong> Primes \\(p \\equiv a \\pmod{q}\\) with \\(\\chi_D(a) = -1\\) would be over-represented relative to those with \\(\\chi_D(a) = 1\\), at least for a long initial segment.</li>
    <li><strong>Large class number:</strong> The class number \\(h(D)\\) would be very small (by the class number formula), which contradicts the growth expected from Siegel's lower bound on \\(L(1, \\chi_D)\\).</li>
    <li><strong>Landau-Siegel zero conjecture:</strong> It is widely believed (but unproven) that Siegel zeros do not exist. GRH implies this immediately.</li>
</ul>

<div class="viz-placeholder" data-viz="viz-siegel-near-miss"></div>
`,
            visualizations: [
                {
                    id: 'viz-siegel-near-miss',
                    title: 'How Close Can a Zero Get to s = 1?',
                    description: 'Visualize the zero-free region for L(s, \u03C7). The classical region excludes a neighborhood of Re(s) = 1, but a single real "Siegel zero" might sneak through for a real character. Drag the hypothetical zero to see its effect.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 400,
                            originX: 100, originY: 200, scale: 200
                        });

                        var siegelBeta = 0.95;
                        VizEngine.createSlider(controls, '\u03B2 (Siegel zero)', 0.5, 0.999, siegelBeta, 0.001, function(v) {
                            siegelBeta = v;
                            draw();
                        });

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            // Draw the critical strip [0,1] x R
                            var [sx0] = viz.toScreen(0, 0);
                            var [sx1] = viz.toScreen(1, 0);
                            ctx.fillStyle = '#1a1a40';
                            ctx.fillRect(sx0, 0, sx1 - sx0, viz.height);

                            // Critical line Re(s) = 1/2
                            var [sxHalf] = viz.toScreen(0.5, 0);
                            ctx.strokeStyle = viz.colors.teal + '44';
                            ctx.lineWidth = 1;
                            ctx.setLineDash([4, 4]);
                            ctx.beginPath();
                            ctx.moveTo(sxHalf, 0);
                            ctx.lineTo(sxHalf, viz.height);
                            ctx.stroke();
                            ctx.setLineDash([]);

                            // Line Re(s) = 1
                            var [sxOne] = viz.toScreen(1, 0);
                            ctx.strokeStyle = viz.colors.white + '66';
                            ctx.lineWidth = 1.5;
                            ctx.beginPath();
                            ctx.moveTo(sxOne, 0);
                            ctx.lineTo(sxOne, viz.height);
                            ctx.stroke();

                            // Zero-free region curve: Re(s) > 1 - c/log(q(|t|+2))
                            // Approximate as a curve
                            ctx.strokeStyle = viz.colors.orange;
                            ctx.lineWidth = 2;
                            ctx.beginPath();
                            for (var py = 0; py <= viz.height; py += 2) {
                                var t = (viz.originY - py) / viz.scale;
                                var c = 0.05;
                                var boundary = 1 - c / Math.log(10 * (Math.abs(t) + 2));
                                var [bx] = viz.toScreen(boundary, 0);
                                if (py === 0) ctx.moveTo(bx, py);
                                else ctx.lineTo(bx, py);
                            }
                            ctx.stroke();

                            // Shade the zero-free region
                            ctx.fillStyle = viz.colors.green + '11';
                            ctx.beginPath();
                            for (var py2 = 0; py2 <= viz.height; py2 += 2) {
                                var t2 = (viz.originY - py2) / viz.scale;
                                var c2 = 0.05;
                                var bd2 = 1 - c2 / Math.log(10 * (Math.abs(t2) + 2));
                                var [bx2] = viz.toScreen(bd2, 0);
                                if (py2 === 0) ctx.moveTo(bx2, py2);
                                else ctx.lineTo(bx2, py2);
                            }
                            ctx.lineTo(viz.width, viz.height);
                            ctx.lineTo(viz.width, 0);
                            ctx.closePath();
                            ctx.fill();

                            // Draw hypothetical Siegel zero
                            viz.drawPoint(siegelBeta, 0, viz.colors.red, '\u03B2 = ' + siegelBeta.toFixed(3), 7);

                            // Show gap from 1
                            var gap = 1 - siegelBeta;
                            ctx.strokeStyle = viz.colors.red + '88';
                            ctx.lineWidth = 1;
                            ctx.setLineDash([3, 3]);
                            var [sxBeta, syBeta] = viz.toScreen(siegelBeta, 0);
                            ctx.beginPath();
                            ctx.moveTo(sxBeta, syBeta - 30);
                            ctx.lineTo(sxOne, syBeta - 30);
                            ctx.stroke();
                            ctx.setLineDash([]);
                            ctx.fillStyle = viz.colors.red;
                            ctx.font = '11px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'bottom';
                            ctx.fillText('1 - \u03B2 = ' + gap.toFixed(4), (sxBeta + sxOne) / 2, syBeta - 33);

                            // Labels
                            viz.screenText('Re(s) = 1/2', sxHalf, 15, viz.colors.teal, 10);
                            viz.screenText('Re(s) = 1', sxOne + 5, 15, viz.colors.white, 10, 'left');
                            viz.screenText('Zero-free region', viz.width - 60, 50, viz.colors.green, 10);
                            viz.screenText('(except possible Siegel zero)', viz.width / 2, viz.height - 30, viz.colors.red, 10);
                            viz.screenText('Siegel: \u03B2 < 1 - c(\u03B5)q^{-\u03B5}', viz.width / 2, viz.height - 12, viz.colors.text, 10);
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Explain why at most one real character mod \\(q\\) can have a Siegel zero (for a given \\(q\\)).',
                    hint: 'If two real characters both had zeros near \\(s = 1\\), consider the product \\(L(s, \\chi_1) L(s, \\chi_2) L(s, \\chi_1 \\chi_2) L(s, \\chi_0)\\).',
                    solution: 'The product \\(F(s) = L(s,\\chi_0)L(s,\\chi_1)L(s,\\chi_2)L(s,\\chi_1\\chi_2)\\) has non-negative Dirichlet coefficients (by the same argument as the product over all characters). It has a simple pole at \\(s=1\\) from \\(\\chi_0\\). If both \\(\\chi_1\\) and \\(\\chi_2\\) had zeros at \\(s=\\beta_1, \\beta_2\\) near 1, the product would have zeros of total order \\(\\geq 2\\) near \\(s=1\\) (even more if \\(\\chi_1\\chi_2\\) also vanishes), canceling the pole and forcing \\(F(s) \\to 0\\), contradicting \\(F(s) \\geq 1\\).'
                },
                {
                    question: 'If a Siegel zero \\(\\beta\\) existed with \\(1 - \\beta \\sim 1/(\\log q)^2\\), roughly how many primes \\(p \\leq x\\) in the "depleted" residue class (with \\(\\chi(a) = 1\\)) would be missing compared to the expected \\(x/(\\varphi(q) \\log x)\\)?',
                    hint: 'The Siegel zero contributes a term \\(\\sim -x^\\beta / \\beta\\) to \\(\\psi(x; q, a)\\) when \\(\\chi(a) = 1\\).',
                    solution: 'The contribution of the Siegel zero is \\(\\sim x^\\beta / \\varphi(q)\\). With \\(\\beta \\approx 1 - 1/(\\log q)^2\\), we get \\(x^\\beta = x \\cdot x^{-1/(\\log q)^2} = x \\cdot e^{-\\log x/(\\log q)^2}\\). For \\(x = q^{100}\\) say, this is \\(x \\cdot e^{-100/\\log q}\\), which is nearly \\(x\\). So the Siegel zero term \\(-x^\\beta/\\varphi(q)\\) nearly cancels the main term \\(x/\\varphi(q)\\), meaning the class with \\(\\chi(a) = 1\\) could have far fewer primes than expected, with the "missing" primes migrating to classes with \\(\\chi(a) = -1\\).'
                }
            ]
        },

        // ================================================================
        // SECTION 7: Bridge — Looking Ahead
        // ================================================================
        {
            id: 'sec-bridge',
            title: 'Bridge',
            content: `
<h2>Looking Back and Ahead</h2>

<h3>What We Have Accomplished</h3>

<p>In this chapter we proved Dirichlet's theorem in its qualitative form (infinitely many primes in every coprime class) and its quantitative form (the PNT for arithmetic progressions). The logical structure was:</p>

<ol>
    <li><strong>Character orthogonality</strong> reduced the problem to studying \\(L(s, \\chi)\\) at \\(s = 1\\).</li>
    <li><strong>Non-vanishing</strong> \\(L(1, \\chi) \\neq 0\\) was proved in two cases:
        <ul>
            <li>Complex characters: the product trick (a single elegant argument).</li>
            <li>Real characters: the class number formula (connecting analysis to algebra).</li>
        </ul>
    </li>
    <li><strong>Quantitative estimates</strong> came from zero-free regions for \\(L(s, \\chi)\\), with the Siegel zero as the persistent obstruction to uniformity.</li>
</ol>

<h3>The Chebyshev Bias</h3>

<p>Although primes are equidistributed among coprime classes in the limit, the approach to the limit is not uniform. There is a persistent "bias" favoring non-residues over residues, first observed by Chebyshev for primes mod 4:</p>

<div class="env-block theorem">
    <div class="env-title">Observation (Chebyshev Bias)</div>
    <div class="env-body">
        <p>Among primes up to \\(x\\), there tend to be more primes \\(\\equiv 3 \\pmod{4}\\) than \\(\\equiv 1 \\pmod{4}\\). More precisely, under GRH and a linear independence assumption on zeros, the set of \\(x\\) for which \\(\\pi(x; 4, 3) > \\pi(x; 4, 1)\\) has logarithmic density approximately 0.9959 (Rubinstein-Sarnak, 1994).</p>
    </div>
</div>

<p>This bias arises because \\(-1\\) is a quadratic non-residue mod 4, and the contribution of the zero at \\(s = 1/2\\) of \\(L(s, \\chi_{-4})\\) (conditional on GRH) creates a systematic second-order correction that favors non-residues.</p>

<div class="viz-placeholder" data-viz="viz-chebyshev-bias"></div>

<h3>Connections to What Follows</h3>

<p>The themes introduced here reverberate through the rest of the course:</p>

<ul>
    <li><strong>Chapter 11 (Combinatorial Sieves):</strong> Sieve methods estimate primes in progressions differently, and their power combined with Dirichlet's theorem yields results on primes represented by polynomials.</li>
    <li><strong>Chapter 13 (Bombieri-Vinogradov):</strong> The frustrating limitation \\(q \\leq (\\log x)^A\\) in Siegel-Walfisz is overcome on average. The BV theorem says that the PNT holds in progressions for \\(q\\) up to \\(x^{1/2-\\varepsilon}\\), for "most" \\(q\\). This is a substitute for GRH in many applications.</li>
    <li><strong>Chapter 16 (Zeros of \\(L\\)-functions):</strong> Zero density estimates and the distribution of zeros of \\(L(s, \\chi)\\) refine everything we have done. The Siegel zero problem remains central.</li>
</ul>

<div class="env-block remark">
    <div class="env-title">The Lasting Legacy</div>
    <div class="env-body">
        <p>Dirichlet's 1837 paper is one of the founding documents of analytic number theory. Its core ideas, characters and \\(L\\)-functions, grew into a vast edifice: Hecke \\(L\\)-functions, Artin \\(L\\)-functions, automorphic \\(L\\)-functions, the Langlands program. The question "does \\(L(1, \\chi) \\neq 0\\)?" was the first instance of what became one of the central themes of modern number theory: understanding the special values and zeros of \\(L\\)-functions.</p>
    </div>
</div>
`,
            visualizations: [
                {
                    id: 'viz-chebyshev-bias',
                    title: 'Chebyshev Bias: Primes mod 4',
                    description: 'Plot \u03C0(x;4,3) - \u03C0(x;4,1), the excess of primes \u2261 3 (mod 4) over primes \u2261 1 (mod 4). Notice the persistent positive bias, even though both counts grow at the same rate asymptotically.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 380,
                            originX: 60, originY: 250, scale: 1
                        });

                        var primes = VizEngine.sievePrimes(50000);
                        var xMax = 10000;

                        VizEngine.createSlider(controls, 'x max', 1000, 50000, xMax, 1000, function(v) {
                            xMax = Math.round(v);
                            draw();
                        });

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            // Compute running difference pi(x;4,3) - pi(x;4,1)
                            var data = [];
                            var count3 = 0, count1 = 0;
                            for (var i = 0; i < primes.length && primes[i] <= xMax; i++) {
                                var p = primes[i];
                                if (p === 2) continue;
                                if (p % 4 === 3) count3++;
                                else if (p % 4 === 1) count1++;
                                data.push({ x: p, diff: count3 - count1 });
                            }

                            if (data.length === 0) { viz.screenText('No data', viz.width/2, viz.height/2, viz.colors.text, 14); return; }

                            // Find range
                            var minDiff = 0, maxDiff = 0;
                            for (var j = 0; j < data.length; j++) {
                                if (data[j].diff < minDiff) minDiff = data[j].diff;
                                if (data[j].diff > maxDiff) maxDiff = data[j].diff;
                            }
                            var padding = Math.max(2, Math.ceil((maxDiff - minDiff) * 0.1));
                            minDiff -= padding;
                            maxDiff += padding;

                            var plotLeft = 70, plotRight = viz.width - 20;
                            var plotTop = 40, plotBottom = 340;
                            var plotW = plotRight - plotLeft;
                            var plotH = plotBottom - plotTop;

                            // Zero line
                            var zeroY = plotBottom - ((0 - minDiff) / (maxDiff - minDiff)) * plotH;
                            ctx.strokeStyle = viz.colors.white + '44';
                            ctx.lineWidth = 1;
                            ctx.setLineDash([4, 4]);
                            ctx.beginPath();
                            ctx.moveTo(plotLeft, zeroY);
                            ctx.lineTo(plotRight, zeroY);
                            ctx.stroke();
                            ctx.setLineDash([]);
                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '10px -apple-system,sans-serif';
                            ctx.textAlign = 'right';
                            ctx.fillText('0', plotLeft - 5, zeroY);

                            // Axes
                            ctx.strokeStyle = viz.colors.axis;
                            ctx.lineWidth = 1;
                            ctx.beginPath();
                            ctx.moveTo(plotLeft, plotBottom);
                            ctx.lineTo(plotRight, plotBottom);
                            ctx.stroke();
                            ctx.beginPath();
                            ctx.moveTo(plotLeft, plotTop);
                            ctx.lineTo(plotLeft, plotBottom);
                            ctx.stroke();

                            // Y labels
                            var yStep = Math.max(1, Math.round((maxDiff - minDiff) / 6));
                            for (var yl = Math.ceil(minDiff / yStep) * yStep; yl <= maxDiff; yl += yStep) {
                                var yy = plotBottom - ((yl - minDiff) / (maxDiff - minDiff)) * plotH;
                                ctx.fillStyle = viz.colors.text;
                                ctx.textAlign = 'right';
                                ctx.textBaseline = 'middle';
                                ctx.fillText(yl.toString(), plotLeft - 5, yy);
                            }

                            // Draw the curve
                            ctx.strokeStyle = viz.colors.orange;
                            ctx.lineWidth = 1.5;
                            ctx.beginPath();
                            for (var k = 0; k < data.length; k++) {
                                var px = plotLeft + (data[k].x / xMax) * plotW;
                                var py = plotBottom - ((data[k].diff - minDiff) / (maxDiff - minDiff)) * plotH;
                                if (k === 0) ctx.moveTo(px, py);
                                else ctx.lineTo(px, py);
                            }
                            ctx.stroke();

                            // Shade positive region
                            ctx.fillStyle = viz.colors.teal + '11';
                            ctx.beginPath();
                            ctx.moveTo(plotLeft, zeroY);
                            for (var m = 0; m < data.length; m++) {
                                var px2 = plotLeft + (data[m].x / xMax) * plotW;
                                var py2 = plotBottom - ((Math.max(data[m].diff, 0) - minDiff) / (maxDiff - minDiff)) * plotH;
                                ctx.lineTo(px2, Math.min(py2, zeroY));
                            }
                            ctx.lineTo(plotLeft + (data[data.length-1].x / xMax) * plotW, zeroY);
                            ctx.closePath();
                            ctx.fill();

                            // Title and labels
                            viz.screenText('\u03C0(x;4,3) - \u03C0(x;4,1): The Chebyshev Bias', viz.width / 2, 18, viz.colors.white, 14);

                            var lastData = data[data.length - 1];
                            viz.screenText(
                                'At x = ' + xMax + ': \u03C0(x;4,3) - \u03C0(x;4,1) = ' + lastData.diff,
                                viz.width / 2, plotBottom + 25, viz.colors.orange, 11
                            );
                            viz.screenText(
                                'Positive \u2248 99.6% of the time (under GRH + LI)',
                                viz.width / 2, plotBottom + 42, viz.colors.teal, 10
                            );
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'The Chebyshev bias says primes \\(\\equiv 3 \\pmod{4}\\) usually outnumber primes \\(\\equiv 1 \\pmod{4}\\). But we also know both classes have the same asymptotic density. How can both statements be true simultaneously?',
                    hint: 'Think about the difference between "natural density" and "logarithmic density." Also, \\(\\pi(x;4,3) - \\pi(x;4,1)\\) being positive most of the time does not contradict \\(\\pi(x;4,3)/\\pi(x;4,1) \\to 1\\).',
                    solution: 'The difference \\(\\pi(x;4,3) - \\pi(x;4,1)\\) can be positive "most" of the time (in logarithmic density), yet both \\(\\pi(x;4,3)/\\pi(x) \\to 1/2\\) and \\(\\pi(x;4,1)/\\pi(x) \\to 1/2\\). The bias is a fluctuation of order \\(O(\\sqrt{x}/\\log x)\\), which is negligible compared to the counts \\(\\sim x/(2\\log x)\\) but large enough to be consistently positive. The function \\(\\pi(x;4,3) - \\pi(x;4,1)\\) changes sign infinitely often (Littlewood proved this), but spends disproportionately more "time" positive.'
                },
                {
                    question: 'State the Bombieri-Vinogradov theorem precisely and explain why it is often called a "substitute for GRH on average."',
                    hint: 'BV bounds \\(\\sum_{q \\leq Q} \\max_{\\gcd(a,q)=1} |\\psi(x;q,a) - x/\\varphi(q)|\\) for \\(Q\\) up to \\(x^{1/2}/\\log^A x\\).',
                    solution: 'The Bombieri-Vinogradov theorem states: for any \\(A > 0\\), \\[\\sum_{q \\leq Q} \\max_{\\gcd(a,q)=1} \\left|\\psi(x;q,a) - \\frac{x}{\\varphi(q)}\\right| \\ll_A \\frac{x}{(\\log x)^A}\\] for \\(Q \\leq x^{1/2}(\\log x)^{-B}\\) with \\(B = B(A)\\). Under GRH, \\(|\\psi(x;q,a) - x/\\varphi(q)| \\ll \\sqrt{x}\\log^2(qx)\\) for each individual \\(q\\), which summing over \\(q \\leq Q\\) gives a similar result for \\(Q \\leq x^{1/2}\\). BV gives the same range of \\(Q\\) unconditionally, at the cost of only bounding the average over \\(q\\) (some individual \\(q\\) could still behave badly).'
                },
                {
                    question: 'Prove that if \\(L(s, \\chi)\\) is a Dirichlet \\(L\\)-function with \\(\\chi\\) primitive mod \\(q\\), then \\(L(s, \\chi)\\) has infinitely many non-trivial zeros (zeros with \\(0 < \\operatorname{Re}(s) < 1\\)).',
                    hint: 'Use the explicit formula or the argument principle. The key is the functional equation and the growth of \\(N(T, \\chi) \\sim (T/\\pi) \\log(qT/2\\pi e)\\).',
                    solution: 'By the functional equation and argument principle, the number of zeros \\(\\rho\\) of \\(L(s,\\chi)\\) with \\(0 < \\operatorname{Re}(\\rho) < 1\\) and \\(|\\operatorname{Im}(\\rho)| \\leq T\\) satisfies \\(N(T,\\chi) = \\frac{T}{\\pi}\\log\\frac{qT}{2\\pi e} + O(\\log qT)\\). As \\(T \\to \\infty\\), \\(N(T,\\chi) \\to \\infty\\), so there are infinitely many non-trivial zeros. Alternatively, if there were only finitely many, the explicit formula would give \\(\\psi(x;q,a)\\) as a finite sum of \\(x^\\rho\\) terms plus \\(x/\\varphi(q)\\), but such a finite sum cannot match the known oscillatory behavior.'
                }
            ]
        }
    ]
});
