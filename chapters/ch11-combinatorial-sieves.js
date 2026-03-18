window.CHAPTERS = window.CHAPTERS || [];
window.CHAPTERS.push({
    id: 'ch11',
    number: 11,
    title: 'Sieve Methods I: Combinatorial Sieves',
    subtitle: 'Hunting primes by elimination',
    sections: [
        // ================================================================
        // SECTION 1: Beyond L-Functions
        // ================================================================
        {
            id: 'sec-motivation',
            title: 'Beyond L-Functions',
            content: `
<h2>Beyond L-Functions</h2>

<div class="env-block intuition">
    <div class="env-title">A Different Kind of Question</div>
    <div class="env-body">
        <p>So far, our main tool has been the Riemann zeta function and its relatives. We locate primes by studying the zeros of \\(\\zeta(s)\\), extract asymptotics via contour integrals, and prove equidistribution by pushing zero-free regions. This is analytic machinery: the primes emerge as residues and Fourier coefficients.</p>
        <p>But some questions resist this approach. Are there infinitely many twin primes \\((p, p+2)\\)? How many primes lie in the set \\(\\{n^2 + 1 : n \\in \\mathbb{Z}\\}\\)? The L-function method has no obvious handle on these. We need a different strategy: <strong>sieve methods</strong>.</p>
    </div>
</div>

<p>The idea is ancient. Instead of asking where primes <em>are</em>, we eliminate composite numbers. Start with all integers in some range. Strike out multiples of 2, then 3, then 5, and so on. What remains after eliminating multiples of all small primes must consist of large primes (plus the primes themselves, which survive).</p>

<h3>The General Setup</h3>

<p>Let \\(\\mathcal{A}\\) be a finite set of integers, and let \\(\\mathcal{P}\\) be a set of primes. We want to count</p>
\\[S(\\mathcal{A}, \\mathcal{P}, z) = \\#\\{a \\in \\mathcal{A} : \\gcd(a, P(z)) = 1\\}\\]
<p>where \\(P(z) = \\prod_{p \\in \\mathcal{P},\\, p < z} p\\) is the product of the "sieving primes." Elements surviving the sieve are not divisible by any prime \\(p < z\\) in \\(\\mathcal{P}\\).</p>

<div class="env-block definition">
    <div class="env-title">Definition 11.1 (Sieve Problem)</div>
    <div class="env-body">
        <p>Given:</p>
        <ul>
            <li>A finite set \\(\\mathcal{A} \\subset \\mathbb{Z}\\), the <strong>sifted set</strong></li>
            <li>A set of primes \\(\\mathcal{P}\\), the <strong>sieving primes</strong></li>
            <li>A parameter \\(z > 0\\), the <strong>sieve level</strong></li>
        </ul>
        <p>Let \\(\\mathcal{A}_d = \\{a \\in \\mathcal{A} : d \\mid a\\}\\) and write \\(|\\mathcal{A}_d| = \\frac{X}{d} \\omega(d) + r_d\\), where \\(\\omega\\) is a multiplicative function approximating the density of \\(\\mathcal{A}\\) modulo \\(d\\), \\(X\\) is the "size" of \\(\\mathcal{A}\\), and \\(r_d\\) is the remainder. The <strong>sieve function</strong> is</p>
        \\[S(\\mathcal{A}, \\mathcal{P}, z) = \\sum_{\\substack{a \\in \\mathcal{A} \\\\ \\gcd(a, P(z)) = 1}} 1.\\]
    </div>
</div>

<h3>Why Not Just Use PNT?</h3>

<p>For the set \\(\\mathcal{A} = \\{1, \\ldots, N\\}\\), the Prime Number Theorem tells us \\(S(\\mathcal{A}, \\mathcal{P}, \\sqrt{N}) \\approx \\pi(N)\\). But sieves apply to <em>thin</em> sets where the PNT gives no information. If \\(\\mathcal{A} = \\{n(n+2) : n \\leq N\\}\\), asking when both \\(n\\) and \\(n+2\\) survive the sieve asks about twin primes, and no L-function directly controls this.</p>

<p>Sieves trade precision for generality. They typically yield upper bounds and sometimes lower bounds, but not exact formulas. The fundamental tension of sieve theory is that the natural approach via inclusion-exclusion <em>explodes</em>, and the art lies in taming that explosion.</p>

<div class="env-block remark">
    <div class="env-title">Historical Note</div>
    <div class="env-body">
        <p>The ancient Sieve of Eratosthenes (3rd century BCE) is the conceptual ancestor. Modern sieve theory began with Viggo Brun (1920), who showed that the sum of reciprocals of twin primes converges. Atle Selberg's 1947 sieve revolutionized the field with its elegant optimization. In the 21st century, sieves became central to the breakthroughs of Goldston-Pintz-Yildirim (2005) and Zhang (2013) on bounded gaps between primes.</p>
    </div>
</div>
`,
            visualizations: [
                {
                    id: 'viz-sieve-function',
                    title: 'The Sieve Function S(A, P, z)',
                    description: 'Watch how S(A, P, z) changes as z increases. The sifted set starts as all integers up to N; each prime p < z eliminates its multiples. Drag the z-slider to see survivors vanish.',
                    setup: function(body, controls) {
                        var N = 80;
                        var viz = new VizEngine(body, { width: 560, height: 340, originX: 40, originY: 300, scale: 1 });
                        var zVal = 2;
                        var primes = VizEngine.sievePrimes(N);

                        VizEngine.createSlider(controls, 'z (sieve level)', 2, 12, 2, 1, function(v) {
                            zVal = Math.round(v);
                            draw();
                        });

                        function isSurvivor(n) {
                            for (var i = 0; i < primes.length; i++) {
                                if (primes[i] >= zVal) break;
                                if (n % primes[i] === 0) return false;
                            }
                            return true;
                        }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var cols = 16;
                            var cellSize = Math.floor((viz.width - 60) / cols);
                            var rows = Math.ceil(N / cols);
                            var startX = 30;
                            var startY = 30;
                            var survivors = 0;

                            viz.screenText('Integers 1 to ' + N + ', sieved by primes < ' + zVal, viz.width / 2, 14, viz.colors.white, 13);

                            for (var n = 1; n <= N; n++) {
                                var row = Math.floor((n - 1) / cols);
                                var col = (n - 1) % cols;
                                var x = startX + col * cellSize;
                                var y = startY + row * cellSize;
                                var survived = isSurvivor(n);
                                var isPrime = primes.indexOf(n) >= 0;

                                if (survived) {
                                    survivors++;
                                    ctx.fillStyle = isPrime ? viz.colors.teal + 'cc' : viz.colors.blue + '55';
                                    ctx.fillRect(x, y, cellSize - 2, cellSize - 2);
                                } else {
                                    ctx.fillStyle = viz.colors.grid;
                                    ctx.fillRect(x, y, cellSize - 2, cellSize - 2);
                                }

                                ctx.font = '9px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.textBaseline = 'middle';
                                ctx.fillStyle = survived ? viz.colors.white : viz.colors.text + '44';
                                ctx.fillText(n, x + cellSize / 2 - 1, y + cellSize / 2 - 1);
                            }

                            viz.screenText('Survivors: ' + survivors + '   P(z) = ' + primes.filter(function(p) { return p < zVal; }).join('\u00d7'), viz.width / 2, viz.height - 16, viz.colors.yellow, 12);
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Let \\(\\mathcal{A} = \\{1, 2, \\ldots, 30\\}\\) and \\(\\mathcal{P} = \\{2, 3, 5\\}\\). Compute \\(S(\\mathcal{A}, \\mathcal{P}, 6)\\) by direct enumeration.',
                    hint: 'An element survives if and only if it shares no factor with \\(P(6) = 2 \\cdot 3 \\cdot 5 = 30\\). Which numbers in \\([1,30]\\) are coprime to 30?',
                    solution: 'The survivors are numbers in \\([1,30]\\) coprime to 30. By Euler\'s phi function, \\(\\phi(30) = 30(1 - 1/2)(1 - 1/3)(1 - 1/5) = 8\\) numbers per period of 30. These are \\(\\{1, 7, 11, 13, 17, 19, 23, 29\\}\\), giving \\(S = 8\\).'
                }
            ]
        },

        // ================================================================
        // SECTION 2: Sieve of Eratosthenes & Legendre's Formula
        // ================================================================
        {
            id: 'sec-eratosthenes',
            title: 'Sieve of Eratosthenes',
            content: `
<h2>Sieve of Eratosthenes</h2>

<div class="env-block intuition">
    <div class="env-title">The Algorithm</div>
    <div class="env-body">
        <p>To find all primes up to \\(N\\): write down all integers from 2 to \\(N\\). Circle 2 (it is prime), then cross out all multiples of 2. The next uncrossed number is 3; circle it and cross out all multiples of 3. Continue: the next uncrossed number is always prime. Stop when you reach \\(\\sqrt{N}\\); everything still standing is prime.</p>
        <p>Why stop at \\(\\sqrt{N}\\)? Any composite number \\(n \\leq N\\) has a prime factor \\(\\leq \\sqrt{N}\\), so it was already crossed out.</p>
    </div>
</div>

<h3>Legendre's Formula</h3>

<p>The sieve of Eratosthenes has a clean formula. Let \\(\\pi(x)\\) count primes up to \\(x\\). Legendre observed that for \\(2 \\leq z \\leq x\\):</p>

\\[\\pi(x) - \\pi(z) + 1 = S(\\{1, \\ldots, \\lfloor x \\rfloor\\}, \\mathcal{P}, z)\\]

<p>when \\(z \\leq \\sqrt{x}\\). The "+1" accounts for 1 surviving (it has no prime factors) and subtracting the primes \\(\\leq z\\) that were already counted. More usefully, for \\(z = \\sqrt{x}\\):</p>

\\[\\pi(x) = S(\\mathcal{A}, \\mathcal{P}, \\sqrt{x}) + \\pi(\\sqrt{x}) - 1.\\]

<p>The Legendre-Eratosthenes formula evaluates \\(S\\) via inclusion-exclusion on prime divisors:</p>

<div class="env-block theorem">
    <div class="env-title">Theorem 11.1 (Legendre's Sieve)</div>
    <div class="env-body">
        <p>With \\(P(z) = \\prod_{p < z} p\\),</p>
        \\[S(\\mathcal{A}, \\mathcal{P}, z) = \\sum_{d \\mid P(z)} \\mu(d) \\left\\lfloor \\frac{x}{d} \\right\\rfloor\\]
        <p>where \\(\\mu\\) is the Mobius function, and \\(\\mathcal{A} = \\{1, \\ldots, x\\}\\).</p>
    </div>
</div>

<p>This is inclusion-exclusion: we subtract those divisible by each prime \\(p < z\\), add back those divisible by \\(pq\\), subtract those divisible by \\(pqr\\), and so on. The Mobius function \\(\\mu(d)\\) precisely encodes the alternating sign pattern.</p>

<h3>Why Legendre's Formula Fails</h3>

<p>The formula is exact but computationally useless for large \\(x\\). The number of divisors of \\(P(z)\\) is \\(2^{\\pi(z)}\\). Taking \\(z = \\sqrt{x}\\), this is \\(2^{\\pi(\\sqrt{x})} \\approx 2^{2\\sqrt{x}/\\log x}\\), which grows faster than any polynomial in \\(x\\). The exact formula has exponentially many terms.</p>

<p>Even analytically, the error terms \\(r_d = \\lfloor x/d \\rfloor - x/d\\) accumulate. There are \\(2^{\\pi(z)}\\) such terms, each at most 1 in absolute value, giving a total error up to \\(2^{\\pi(z)}\\), which can dwarf the main term. This is the <strong>parity problem</strong> in embryonic form.</p>

<div class="env-block definition">
    <div class="env-title">Definition 11.2 (Sieve Dimension)</div>
    <div class="env-body">
        <p>The <strong>dimension</strong> (or density) of a sieve is the constant \\(\\kappa\\) such that</p>
        \\[\\sum_{p < z} \\frac{\\omega(p)}{p} = \\kappa \\log z + O(1).\\]
        <p>For the sieve over all integers (\\(\\omega(p) = 1\\) for all \\(p\\)), \\(\\kappa = 1\\) (linear sieve). Twin prime sieves have \\(\\kappa = 2\\) because both \\(n\\) and \\(n+2\\) must avoid each prime, contributing \\(2/p\\) instead of \\(1/p\\).</p>
    </div>
</div>
`,
            visualizations: [
                {
                    id: 'viz-eratosthenes-grid',
                    title: 'Animated Sieve of Eratosthenes',
                    description: 'Watch the sieve sweep through primes one by one, crossing out composite numbers. Press Play to animate; use the speed slider to control the pace.',
                    setup: function(body, controls) {
                        var N = 120;
                        var viz = new VizEngine(body, { width: 560, height: 360, originX: 0, originY: 0, scale: 1 });
                        var cols = 15;
                        var cellSize = Math.floor((viz.width - 10) / cols);
                        var startX = 5;
                        var startY = 45;

                        var sieve = new Uint8Array(N + 1); // 0 = unchecked, 1 = composite, 2 = prime
                        var currentP = 2;
                        var animStep = 0;
                        var animating = false;
                        var animIntervalId = null;
                        var speed = 80;
                        var highlightSet = new Set();

                        function stepSieve() {
                            // Find composites for currentP
                            if (currentP > Math.sqrt(N)) {
                                // Mark remaining unchecked as prime
                                for (var i = 2; i <= N; i++) {
                                    if (!sieve[i]) sieve[i] = 2;
                                }
                                clearInterval(animIntervalId);
                                animating = false;
                                highlightSet.clear();
                                draw();
                                return;
                            }
                            if (!sieve[currentP]) {
                                sieve[currentP] = 2;
                                highlightSet.clear();
                                for (var j = currentP * currentP; j <= N; j += currentP) {
                                    sieve[j] = 1;
                                    highlightSet.add(j);
                                }
                                animStep++;
                            }
                            // find next prime
                            currentP++;
                            while (currentP <= N && sieve[currentP] === 1) currentP++;
                            draw();
                        }

                        function reset() {
                            if (animIntervalId) clearInterval(animIntervalId);
                            sieve = new Uint8Array(N + 1);
                            currentP = 2;
                            animStep = 0;
                            animating = false;
                            highlightSet = new Set();
                            draw();
                        }

                        var playBtn = VizEngine.createButton(controls, 'Play', function() {
                            if (animating) return;
                            animating = true;
                            animIntervalId = setInterval(stepSieve, speed);
                        });
                        VizEngine.createButton(controls, 'Step', function() {
                            if (animIntervalId) clearInterval(animIntervalId);
                            animating = false;
                            stepSieve();
                        });
                        VizEngine.createButton(controls, 'Reset', reset);
                        VizEngine.createSlider(controls, 'Speed', 20, 300, speed, 20, function(v) {
                            speed = 320 - v;
                            if (animating) {
                                clearInterval(animIntervalId);
                                animIntervalId = setInterval(stepSieve, speed);
                            }
                        });

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var primeCount = 0;

                            viz.screenText('Sieve of Eratosthenes: N = ' + N, viz.width / 2, 14, viz.colors.white, 13);

                            for (var n = 1; n <= N; n++) {
                                var row = Math.floor((n - 1) / cols);
                                var col = (n - 1) % cols;
                                var x = startX + col * cellSize;
                                var y = startY + row * cellSize;

                                var bg;
                                if (sieve[n] === 2) { bg = viz.colors.teal; primeCount++; }
                                else if (highlightSet.has(n)) { bg = viz.colors.red + 'bb'; }
                                else if (sieve[n] === 1) { bg = viz.colors.grid; }
                                else { bg = viz.colors.blue + '33'; }

                                ctx.fillStyle = bg;
                                ctx.fillRect(x, y, cellSize - 2, cellSize - 2);

                                ctx.font = '9px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.textBaseline = 'middle';
                                var tc = (sieve[n] === 2) ? viz.colors.white : (sieve[n] === 1 ? viz.colors.text + '44' : viz.colors.text + 'aa');
                                ctx.fillStyle = tc;
                                ctx.fillText(n, x + cellSize / 2 - 1, y + cellSize / 2 - 1);
                            }

                            var status = animating ? 'Sieving by p = ' + (currentP - 1) : (animStep === 0 ? 'Press Play to start' : 'Done: ' + primeCount + ' primes found');
                            viz.screenText(status, viz.width / 2, viz.height - 14, viz.colors.yellow, 12);
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Use Legendre\'s formula to compute \\(\\pi(30)\\). Verify by listing all primes up to 30.',
                    hint: 'Apply inclusion-exclusion with primes \\(p < \\sqrt{30} \\approx 5.5\\), i.e., \\(p \\in \\{2, 3, 5\\}\\). Compute \\(\\sum_{d \\mid 30} \\mu(d) \\lfloor 30/d \\rfloor\\), then add \\(\\pi(\\sqrt{30}) - 1 = 3 - 1 = 2\\) to get \\(\\pi(30)\\).',
                    solution: 'We have \\(P(\\sqrt{30}) = 30\\). The divisors of 30 with nonzero \\(\\mu\\) are squarefree: \\(\\{1,2,3,5,6,10,15,30\\}\\). Computing: \\(\\lfloor 30/1 \\rfloor - \\lfloor 30/2 \\rfloor - \\lfloor 30/3 \\rfloor - \\lfloor 30/5 \\rfloor + \\lfloor 30/6 \\rfloor + \\lfloor 30/10 \\rfloor + \\lfloor 30/15 \\rfloor - \\lfloor 30/30 \\rfloor = 30 - 15 - 10 - 6 + 5 + 3 + 2 - 1 = 8\\). Adding \\(\\pi(5) - 1 = 2\\) gives \\(\\pi(30) = 10\\). The primes are \\(2, 3, 5, 7, 11, 13, 17, 19, 23, 29\\). \\(\\checkmark\\)'
                }
            ]
        },

        // ================================================================
        // SECTION 3: Inclusion-Exclusion Explosion
        // ================================================================
        {
            id: 'sec-inclusion-exclusion',
            title: 'The Inclusion-Exclusion Explosion',
            content: `
<h2>The Inclusion-Exclusion Explosion</h2>

<p>The Legendre sieve is exact but the error terms make it computationally impractical. To understand <em>why</em> the error explodes, we need to examine the structure of the inclusion-exclusion sum carefully.</p>

<h3>The Bonferroni Inequalities</h3>

<p>Let \\(A_p = \\{n \\in \\mathcal{A} : p \\mid n\\}\\) for each prime \\(p < z\\). We want to count elements in none of the \\(A_p\\). The full inclusion-exclusion gives an exact answer, but truncating it gives bounds:</p>

<div class="env-block theorem">
    <div class="env-title">Theorem 11.2 (Bonferroni Inequalities)</div>
    <div class="env-body">
        <p>Define the partial inclusion-exclusion sums</p>
        \\[S_k = \\sum_{\\substack{d \\mid P(z) \\\\ \\Omega(d) = k}} |\\mathcal{A}_d|\\]
        <p>where \\(\\Omega(d)\\) is the number of prime factors of \\(d\\). Then for any \\(r \\geq 0\\):</p>
        \\[\\sum_{k=0}^{2r+1} (-1)^k S_k \\leq S(\\mathcal{A}, \\mathcal{P}, z) \\leq \\sum_{k=0}^{2r} (-1)^k S_k.\\]
        <p>Odd partial sums give lower bounds; even partial sums give upper bounds.</p>
    </div>
</div>

<p>This is the <strong>over/under oscillation</strong>: each new "layer" of the inclusion-exclusion alternately overshoots and undershoots the true count. The bounds converge only when we include all layers, but that is the explosive full sum.</p>

<h3>Formal Counting via Mobius</h3>

<p>The Legendre sieve in full generality writes</p>
\\[S(\\mathcal{A}, \\mathcal{P}, z) = \\sum_{d \\mid P(z)} \\mu(d) |\\mathcal{A}_d|.\\]

<p>If \\(|\\mathcal{A}_d| = \\frac{X}{d}\\omega(d) + r_d\\), separating the "main term" from the "remainder":</p>
\\[S(\\mathcal{A}, \\mathcal{P}, z) = X \\underbrace{\\sum_{d \\mid P(z)} \\frac{\\mu(d)\\omega(d)}{d}}_{\\text{main term}} + \\underbrace{\\sum_{d \\mid P(z)} \\mu(d) r_d}_{\\text{remainder}}.\\]

<p>The main term is a product over primes:</p>
\\[\\sum_{d \\mid P(z)} \\frac{\\mu(d)\\omega(d)}{d} = \\prod_{p < z,\\, p \\in \\mathcal{P}} \\left(1 - \\frac{\\omega(p)}{p}\\right).\\]

<p>This is beautiful: the main term factors. For \\(\\mathcal{A} = [1, X]\\) and \\(\\omega(p) = 1\\), it equals \\(\\prod_{p < z}(1 - 1/p) \\sim e^{-\\gamma}/(\\log z)\\) by Mertens' theorem, giving roughly \\(X e^{-\\gamma}/\\log z\\) survivors.</p>

<h3>The Explosion</h3>

<p>The trouble is the remainder: \\(|\\sum_{d \\mid P(z)} \\mu(d) r_d| \\leq \\sum_{d \\mid P(z)} |r_d| \\leq 2^{\\pi(z)}\\). When \\(z = x^{1/2}\\), this is \\(2^{\\pi(\\sqrt{x})} \\sim 2^{2\\sqrt{x}/\\log x}\\), exponential in \\(\\sqrt{x}\\). The main term is only \\(\\sim x / \\log x\\). The error swamps the main term for large \\(x\\).</p>

<p>The key insight of Brun is to <em>truncate</em> the inclusion-exclusion at an appropriate level, accepting approximate bounds rather than exact counts, but keeping the error manageable.</p>

<div class="env-block remark">
    <div class="env-title">The Parity Barrier</div>
    <div class="env-body">
        <p>Even with all the refinements in this chapter, combinatorial sieves cannot distinguish numbers with an even number of prime factors from those with an odd number. This "parity problem" (Selberg, 1950) is a fundamental obstruction: the sieve cannot prove that a given set contains a prime, only that it contains numbers with few prime factors.</p>
    </div>
</div>
`,
            visualizations: [
                {
                    id: 'viz-inclusion-exclusion',
                    title: 'Inclusion-Exclusion Over/Under Oscillation',
                    description: 'The partial sums of inclusion-exclusion oscillate above and below the true count. Drag the slider to add more terms. Blue bars are upper bounds (even layers), orange bars are lower bounds (odd layers).',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, { width: 560, height: 340, originX: 50, originY: 290, scale: 1 });
                        var N = 100;
                        var primes = [2, 3, 5, 7, 11];
                        var layersVal = 1;

                        VizEngine.createSlider(controls, 'Layers of I-E', 0, 5, 1, 1, function(v) {
                            layersVal = Math.round(v);
                            draw();
                        });

                        // Precompute exact count
                        function exactCount() {
                            var c = 0;
                            for (var n = 1; n <= N; n++) {
                                var ok = true;
                                for (var pi = 0; pi < primes.length; pi++) {
                                    if (n % primes[pi] === 0) { ok = false; break; }
                                }
                                if (ok) c++;
                            }
                            return c;
                        }
                        var exact = exactCount();

                        // Partial I-E sum up to r layers
                        function partialIE(r) {
                            if (r < 0) return N;
                            var total = N;
                            // Layer k: all products of k primes from our list
                            function combSum(idx, k, prod) {
                                if (k === 0) return Math.floor(N / prod);
                                var s = 0;
                                for (var i = idx; i < primes.length; i++) {
                                    s += combSum(i + 1, k - 1, prod * primes[i]);
                                }
                                return s;
                            }
                            var val = N;
                            for (var k = 1; k <= r; k++) {
                                var sign = (k % 2 === 1) ? -1 : 1;
                                val += sign * combSum(0, k, 1);
                            }
                            return val;
                        }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var chartBottom = 270;
                            var chartTop = 40;
                            var chartH = chartBottom - chartTop;
                            var barW = 60;
                            var gap = 18;

                            viz.screenText('Inclusion-Exclusion: N=' + N + ', primes ' + primes.join(','), viz.width / 2, 16, viz.colors.white, 12);
                            viz.screenText('Exact count = ' + exact, viz.width / 2, 30, viz.colors.green, 11);

                            var maxVal = N + 10;
                            var yScale = chartH / maxVal;

                            // Exact count line
                            var yExact = chartBottom - exact * yScale;
                            ctx.strokeStyle = viz.colors.green;
                            ctx.lineWidth = 2;
                            ctx.setLineDash([6, 4]);
                            ctx.beginPath();
                            ctx.moveTo(20, yExact);
                            ctx.lineTo(viz.width - 20, yExact);
                            ctx.stroke();
                            ctx.setLineDash([]);
                            ctx.fillStyle = viz.colors.green;
                            ctx.font = '10px -apple-system,sans-serif';
                            ctx.textAlign = 'right';
                            ctx.fillText('exact=' + exact, viz.width - 24, yExact - 4);

                            var startX = 60;
                            for (var k = 0; k <= layersVal; k++) {
                                var val = partialIE(k);
                                var x = startX + k * (barW + gap);
                                var h = val * yScale;
                                var isUpper = (k % 2 === 0);
                                var col = isUpper ? viz.colors.blue : viz.colors.orange;

                                ctx.fillStyle = col + '99';
                                ctx.fillRect(x, chartBottom - h, barW, h);
                                ctx.strokeStyle = col;
                                ctx.lineWidth = 2;
                                ctx.strokeRect(x, chartBottom - h, barW, h);

                                ctx.fillStyle = viz.colors.white;
                                ctx.font = '11px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.fillText(val.toString(), x + barW / 2, chartBottom - h - 8);

                                ctx.fillStyle = viz.colors.text;
                                ctx.font = '10px -apple-system,sans-serif';
                                ctx.fillText('k=' + k, x + barW / 2, chartBottom + 12);
                                ctx.fillStyle = isUpper ? viz.colors.blue : viz.colors.orange;
                                ctx.fillText(isUpper ? 'UB' : 'LB', x + barW / 2, chartBottom + 24);
                            }

                            // Y-axis ticks
                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '10px -apple-system,sans-serif';
                            ctx.textAlign = 'right';
                            for (var t = 0; t <= maxVal; t += 20) {
                                var ty = chartBottom - t * yScale;
                                ctx.fillText(t, 44, ty + 4);
                                ctx.strokeStyle = viz.colors.grid;
                                ctx.lineWidth = 0.5;
                                ctx.beginPath();
                                ctx.moveTo(48, ty);
                                ctx.lineTo(viz.width - 20, ty);
                                ctx.stroke();
                            }
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'How many integers in \\([1, 100]\\) are not divisible by 2, 3, or 5? Compute using two layers of inclusion-exclusion and compare with the exact answer.',
                    hint: 'Layer 0: 100. Layer 1: subtract \\(\\lfloor 100/2 \\rfloor + \\lfloor 100/3 \\rfloor + \\lfloor 100/5 \\rfloor\\). Layer 2: add back pairs \\(\\lfloor 100/6 \\rfloor + \\lfloor 100/10 \\rfloor + \\lfloor 100/15 \\rfloor\\). Full formula subtracts \\(\\lfloor 100/30 \\rfloor\\).',
                    solution: 'After 2 layers: \\(100 - 50 - 33 - 20 + 16 + 10 + 6 = 29\\). Full inclusion-exclusion subtracts \\(\\lfloor 100/30 \\rfloor = 3\\), giving \\(29 - 3 = 26\\). By Euler\'s phi, \\(\\phi(30) \\cdot (100/30) + \\text{correction} = 8 \\cdot 3 + \\text{correction} = 26\\). The 2-layer upper bound 29 overshoots by 3.'
                }
            ]
        },

        // ================================================================
        // SECTION 4: Brun's Sieve
        // ================================================================
        {
            id: 'sec-brun',
            title: "Brun's Sieve",
            content: `
<h2>Brun's Sieve</h2>

<p>Viggo Brun's 1920 insight: instead of including all layers of inclusion-exclusion (which explodes), truncate at a fixed level. By the Bonferroni inequalities, even truncations give upper bounds and odd truncations give lower bounds. The key is to choose the truncation level so that the main term dominates the remainder.</p>

<h3>The Truncation Idea</h3>

<p>Define the truncated Mobius-like function \\(\\lambda_d^\\pm\\) supported on squarefree integers \\(d \\mid P(z)\\) with \\(\\Omega(d) \\leq s\\) for some parameter \\(s\\):</p>

\\[\\lambda_d^+ = \\begin{cases} \\mu(d) & \\text{if } \\Omega(d) \\leq s \\text{ and } s \\text{ even,} \\\\ 0 & \\text{if } \\Omega(d) > s \\text{ or}\\end{cases} \\quad \\lambda_d^- = \\begin{cases} \\mu(d) & \\text{if } \\Omega(d) \\leq s \\text{ and } s \\text{ odd,} \\\\ 0 & \\text{otherwise.} \\end{cases}\\]

<p>More precisely, Brun's truncation is:</p>
\\[\\lambda_d = \\begin{cases} \\mu(d) & \\text{if } d \\mid P(z) \\text{ and } \\Omega(d) \\leq 2\\nu + 1 \\\\ 0 & \\text{otherwise.}\\end{cases}\\]

<p>The Bonferroni inequalities guarantee:</p>
\\[S^-(\\mathcal{A}) \\leq S(\\mathcal{A}, \\mathcal{P}, z) \\leq S^+(\\mathcal{A})\\]
<p>where \\(S^\\pm\\) use the truncated weights \\(\\lambda^\\pm\\).</p>

<h3>Brun's Pure Sieve</h3>

<div class="env-block theorem">
    <div class="env-title">Theorem 11.3 (Brun's Sieve)</div>
    <div class="env-body">
        <p>Let \\(|\\mathcal{A}_d| \\leq X/d\\) for all \\(d \\mid P(z)\\). For any even integer \\(s\\),</p>
        \\[S(\\mathcal{A}, \\mathcal{P}, z) \\leq X \\prod_{p < z}\\left(1 - \\frac{1}{p}\\right) \\left(1 + O\\left(\\frac{(2s)^{\\Omega(P(z))}}{(s/e)^s} z^{-c}\\right)\\right) + \\text{error},\\]
        <p>and similarly for the lower bound with odd \\(s\\). By choosing \\(s = c \\log\\log z\\) for a suitable constant \\(c\\), the correction factor is bounded, and we obtain</p>
        \\[S(\\mathcal{A}, \\mathcal{P}, z) \\ll X \\prod_{p < z}\\left(1 - \\frac{1}{p}\\right).\\]
    </div>
</div>

<p>The optimal truncation level \\(s \\asymp \\log\\log z\\) means we only use products of at most \\(O(\\log\\log z)\\) primes. The number of terms is \\(\\binom{\\pi(z)}{s} \\ll z^{c \\log\\log z / \\log z}\\), which is polynomial rather than exponential. This tames the explosion.</p>

<h3>Choosing Parameters</h3>

<p>For twin primes, take \\(\\mathcal{A} = \\{n(n+2) : n \\leq N\\}\\) and \\(\\mathcal{P}\\) = all primes. Here \\(\\omega(p) = 2\\) for \\(p > 2\\) (both \\(n \\equiv 0\\) and \\(n \\equiv -2 \\pmod{p}\\) are excluded). The sieve density is:</p>
\\[\\prod_{p < z}\\left(1 - \\frac{\\omega(p)}{p}\\right) = \\frac{1}{2} \\prod_{2 < p < z}\\left(1 - \\frac{2}{p}\\right).\\]

<p>By Mertens' third theorem, \\(\\prod_{p < z}(1 - 1/p) \\sim e^{-\\gamma}/\\log z\\). For the twin prime product with factor 2, heuristics give \\(\\prod_p (1 - 2/p) \\cdot (1 - 1/p)^{-2} = 2C_2\\) where \\(C_2 \\approx 0.6601\\ldots\\) is the twin prime constant.</p>

<div class="env-block example">
    <div class="env-title">Example: Upper Bound for Twin Primes</div>
    <div class="env-body">
        <p>Brun's sieve gives \\(\\pi_2(N) \\ll N / (\\log N)^2\\), matching the expected order of magnitude for twin primes from the Hardy-Littlewood conjecture \\(\\pi_2(N) \\sim 2C_2 N / (\\log N)^2\\). The sieve yields the right shape but with an unspecified constant.</p>
    </div>
</div>
`,
            visualizations: [
                {
                    id: 'viz-brun-truncation',
                    title: "Brun's Truncation: Upper and Lower Bounds",
                    description: "As the truncation level s increases, the upper and lower bounds converge toward the true sieve count. The true count is shown as a green dashed line.",
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, { width: 560, height: 340, originX: 60, originY: 300, scale: 1 });
                        var N = 200;
                        var primes = [2, 3, 5, 7, 11, 13];

                        // Exact survivors: coprime to all our primes
                        function exactSurvivors() {
                            var c = 0;
                            for (var n = 1; n <= N; n++) {
                                var ok = true;
                                for (var i = 0; i < primes.length; i++) {
                                    if (n % primes[i] === 0) { ok = false; break; }
                                }
                                if (ok) c++;
                            }
                            return c;
                        }
                        var exact = exactSurvivors();

                        // Partial inclusion-exclusion sum for all subsets of size <= s
                        function partialSieve(s) {
                            var total = N;
                            function rec(start, depth, prod, sign) {
                                if (depth === 0 || start === primes.length) return;
                                for (var i = start; i < primes.length; i++) {
                                    var np = prod * primes[i];
                                    total += sign * Math.floor(N / np);
                                    if (depth > 1) rec(i + 1, depth - 1, np, -sign);
                                }
                            }
                            // This is the direct Bonferroni approach
                            // Recompute from scratch for each s
                            total = N;
                            function compute(start, depth, prod, sgn) {
                                for (var i = start; i < primes.length; i++) {
                                    var np = prod * primes[i];
                                    total += sgn * Math.floor(N / np);
                                    if (depth > 1) compute(i + 1, depth - 1, np, -sgn);
                                }
                            }
                            for (var k = 1; k <= s; k++) {
                                // Handled above — redo clean
                            }
                            // Cleaner: sum over all subsets of primes with size <= s
                            total = 0;
                            var n = primes.length;
                            for (var mask = 0; mask < (1 << n); mask++) {
                                var bits = 0, prod2 = 1;
                                for (var b = 0; b < n; b++) {
                                    if (mask & (1 << b)) { bits++; prod2 *= primes[b]; }
                                }
                                if (bits > s) continue;
                                var sign2 = (bits % 2 === 0) ? 1 : -1;
                                total += sign2 * Math.floor(N / prod2);
                            }
                            return total;
                        }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var chartBottom = 280;
                            var chartTop = 40;
                            var chartH = chartBottom - chartTop;
                            var maxBound = N + 10;
                            var yScale = chartH / maxBound;

                            viz.screenText("Brun Truncation Bounds: N=" + N + ", primes {" + primes.join(',') + "}", viz.width / 2, 16, viz.colors.white, 12);

                            // Exact line
                            var yEx = chartBottom - exact * yScale;
                            ctx.strokeStyle = viz.colors.green;
                            ctx.lineWidth = 2;
                            ctx.setLineDash([6, 4]);
                            ctx.beginPath();
                            ctx.moveTo(50, yEx);
                            ctx.lineTo(viz.width - 20, yEx);
                            ctx.stroke();
                            ctx.setLineDash([]);
                            ctx.fillStyle = viz.colors.green;
                            ctx.font = '10px -apple-system,sans-serif';
                            ctx.textAlign = 'right';
                            ctx.fillText('exact=' + exact, viz.width - 22, yEx - 5);

                            // Plot bounds for s=0..6
                            var pts = [];
                            for (var s = 0; s <= 6; s++) {
                                pts.push(partialSieve(s));
                            }

                            var barW = 50;
                            var startX = 65;
                            var gap = 16;
                            for (var s2 = 0; s2 <= 6; s2++) {
                                var val = pts[s2];
                                var x = startX + s2 * (barW + gap);
                                var h = Math.max(0, val * yScale);
                                var isUpper = (s2 % 2 === 0);
                                var col = isUpper ? viz.colors.blue : viz.colors.orange;

                                ctx.fillStyle = col + '88';
                                ctx.fillRect(x, chartBottom - h, barW, h);
                                ctx.strokeStyle = col;
                                ctx.lineWidth = 1.5;
                                ctx.strokeRect(x, chartBottom - h, barW, h);

                                ctx.fillStyle = col;
                                ctx.font = 'bold 11px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.fillText(val.toString(), x + barW / 2, chartBottom - h - 9);

                                ctx.fillStyle = viz.colors.text;
                                ctx.font = '10px -apple-system,sans-serif';
                                ctx.fillText('s=' + s2, x + barW / 2, chartBottom + 12);
                                ctx.fillStyle = isUpper ? viz.colors.blue : viz.colors.orange;
                                ctx.fillText(isUpper ? 'upper' : 'lower', x + barW / 2, chartBottom + 24);
                            }

                            // y-axis
                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '10px -apple-system,sans-serif';
                            ctx.textAlign = 'right';
                            for (var t = 0; t <= maxBound; t += 40) {
                                var ty = chartBottom - t * yScale;
                                ctx.fillText(t, 44, ty + 4);
                                ctx.strokeStyle = viz.colors.grid;
                                ctx.lineWidth = 0.5;
                                ctx.beginPath();
                                ctx.moveTo(48, ty);
                                ctx.lineTo(viz.width - 20, ty);
                                ctx.stroke();
                            }
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: "For the set \\(\\mathcal{A} = \\{n(n+2) : 1 \\leq n \\leq 100\\}\\) and the prime 3, compute \\(\\omega(3)\\): how many residue classes mod 3 does 3 eliminate from this set?",
                    hint: "The set consists of products \\(n(n+2)\\). An element \\(n(n+2)\\) is divisible by 3 if \\(n \\equiv 0 \\pmod 3\\) or \\(n \\equiv 1 \\pmod 3\\) (since \\(n+2 \\equiv 0\\)). What about \\(n \\equiv 2 \\pmod 3\\)?",
                    solution: "If \\(n \\equiv 0 \\pmod 3\\), then \\(3 \\mid n\\). If \\(n \\equiv 1 \\pmod 3\\), then \\(n + 2 \\equiv 0 \\pmod 3\\). If \\(n \\equiv 2 \\pmod 3\\), then \\(n \\equiv 2\\) and \\(n+2 \\equiv 1\\), so neither factor is divisible by 3. Thus 3 eliminates 2 out of 3 residue classes: \\(\\omega(3) = 2\\)."
                }
            ]
        },

        // ================================================================
        // SECTION 5: Brun's Theorem (Twin Primes)
        // ================================================================
        {
            id: 'sec-brun-theorem',
            title: "Brun's Theorem",
            content: `
<h2>Brun's Theorem</h2>

<p>The most famous application of Brun's sieve is to twin primes. While we cannot prove there are infinitely many twin primes, Brun proved something remarkable: even if there are infinitely many, the sum of their reciprocals converges.</p>

<div class="env-block theorem">
    <div class="env-title">Theorem 11.4 (Brun's Theorem, 1919)</div>
    <div class="env-body">
        <p>The sum of reciprocals of twin primes converges:</p>
        \\[B_2 = \\left(\\frac{1}{3} + \\frac{1}{5}\\right) + \\left(\\frac{1}{5} + \\frac{1}{7}\\right) + \\left(\\frac{1}{11} + \\frac{1}{13}\\right) + \\cdots = \\sum_{\\substack{p,\\, p+2\\, \\text{both prime}}} \\frac{1}{p} < \\infty.\\]
        <p>The numerical value is \\(B_2 \\approx 1.9021605831\\ldots\\) (Brun's constant).</p>
    </div>
</div>

<h3>Why This Is Surprising</h3>

<p>Compare with the prime reciprocal sum \\(\\sum_{p} 1/p = \\infty\\) (Euler). That sum diverges, meaning primes are "abundant" enough for the series to diverge. Twin primes, if they exist in abundance, would also have a divergent series. Brun's theorem says that even the most optimistic scenario (infinitely many twin primes) is consistent with a convergent series: twin primes must be "sparse enough" that \\(\\sum 1/p_n < \\infty\\).</p>

<h3>Proof Sketch</h3>

<p>The key bound is the count of twin primes. Brun's sieve applied to \\(\\mathcal{A} = \\{n(n+2) : n \\leq N\\}\\) gives:</p>
\\[\\pi_2(N) := \\#\\{p \\leq N : p, p+2 \\text{ both prime}\\} \\ll \\frac{N}{(\\log N)^2}.\\]

<p>With \\(\\pi_2(N) \\ll N / (\\log N)^2\\), partial summation gives:</p>
\\[\\sum_{p \\leq N,\\, p+2\\, \\text{prime}} \\frac{1}{p} = \\int_2^N \\frac{1}{t} d\\pi_2(t) \\ll \\int_2^N \\frac{1}{t (\\log t)^2} dt + O(1) < \\infty.\\]

<p>The integral \\(\\int_2^\\infty t^{-1} (\\log t)^{-2} dt\\) converges by the substitution \\(u = \\log t\\): it becomes \\(\\int_{\\log 2}^\\infty u^{-2} du < \\infty\\).</p>

<h3>The Sieve Bound for Twin Primes</h3>

<p>More explicitly, for \\(z = (\\log N)^A\\) and suitable \\(A\\):</p>
\\[\\pi_2(N) \\leq S(\\mathcal{A}, \\mathcal{P}, z) \\ll N \\prod_{p < z}\\left(1 - \\frac{2}{p}\\right) \\ll \\frac{N}{(\\log N)^2}.\\]

<p>The last inequality uses the product estimate:</p>
\\[\\prod_{p < z}\\left(1 - \\frac{2}{p}\\right) = \\prod_{p < z}\\left(1 - \\frac{1}{p}\\right)^2 \\cdot \\prod_{p < z} \\frac{(1-2/p)}{(1-1/p)^2} \\sim \\frac{C}{(\\log z)^2}\\]
<p>where \\(C = 2\\prod_{p > 2}(1 - (p-1)^{-2}) \\approx 1.3202\\ldots\\) The product over primes converges because \\(\\sum_p (2/p - (1-2/p)^{-1}(1-1/p)^2)\\) converges.</p>

<div class="env-block remark">
    <div class="env-title">Computational Note</div>
    <div class="env-body">
        <p>Computing \\(B_2\\) to many decimal places requires finding large twin primes. Thomas Nicely (1994, 1995) computed \\(B_2\\) to many digits, and in doing so discovered the famous "Pentium FDIV bug" when his results differed from expected values due to a floating-point error in Intel's Pentium processor. Brun's constant has since been computed to 12 decimal places: \\(B_2 \\approx 1.902160583104\\ldots\\)</p>
    </div>
</div>
`,
            visualizations: [
                {
                    id: 'viz-brun-constant',
                    title: "Convergence of Brun's Constant",
                    description: "Partial sums of \\(\\sum 1/p\\) over twin primes grow very slowly and appear to converge. Compare with the divergent sum over all primes.",
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, { width: 560, height: 340, originX: 60, originY: 300, scale: 1 });

                        // Precompute twin primes up to a limit
                        var LIMIT = 100000;
                        var sieve = VizEngine.sievePrimes(LIMIT + 2);
                        var sieveSet = new Set(sieve);
                        var twinPrimes = [];
                        for (var i = 0; i < sieve.length; i++) {
                            if (sieveSet.has(sieve[i] + 2)) {
                                twinPrimes.push(sieve[i]);
                            }
                        }

                        // Build cumulative sums sampled at log-spaced points
                        var NUM_POINTS = 120;
                        var twinSum = [];
                        var allSum = [];
                        var ns = [];
                        var cumTwin = 0;
                        var cumAll = 0;
                        var twinIdx = 0;
                        var allIdx = 0;
                        var logMax = Math.log(LIMIT);
                        for (var k = 1; k <= NUM_POINTS; k++) {
                            var x = Math.exp(k * logMax / NUM_POINTS);
                            while (twinIdx < twinPrimes.length && twinPrimes[twinIdx] <= x) {
                                cumTwin += 2 / twinPrimes[twinIdx];
                                twinIdx++;
                            }
                            while (allIdx < sieve.length && sieve[allIdx] <= x) {
                                cumAll += 1 / sieve[allIdx];
                                allIdx++;
                            }
                            ns.push(x);
                            twinSum.push(cumTwin);
                            allSum.push(cumAll);
                        }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var chartBottom = 280;
                            var chartTop = 40;
                            var chartH = chartBottom - chartTop;
                            var chartLeft = 60;
                            var chartRight = viz.width - 20;
                            var chartW = chartRight - chartLeft;

                            viz.screenText("Brun's Constant vs. All-Prime Reciprocal Sum", viz.width / 2, 16, viz.colors.white, 13);

                            // Scales
                            var xMax = Math.log(LIMIT);
                            var yMax = Math.max(allSum[allSum.length - 1], twinSum[twinSum.length - 1]) * 1.1;
                            var xScale = chartW / xMax;
                            var yScale = chartH / yMax;

                            // Axes
                            ctx.strokeStyle = viz.colors.axis;
                            ctx.lineWidth = 1.5;
                            ctx.beginPath();
                            ctx.moveTo(chartLeft, chartTop);
                            ctx.lineTo(chartLeft, chartBottom);
                            ctx.lineTo(chartRight, chartBottom);
                            ctx.stroke();

                            // Grid
                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '10px -apple-system,sans-serif';
                            ctx.textAlign = 'right';
                            for (var t = 0; t <= yMax; t += 1) {
                                var ty = chartBottom - t * yScale;
                                ctx.fillText(t.toFixed(1), chartLeft - 4, ty + 3);
                                ctx.strokeStyle = viz.colors.grid;
                                ctx.lineWidth = 0.5;
                                ctx.beginPath();
                                ctx.moveTo(chartLeft, ty);
                                ctx.lineTo(chartRight, ty);
                                ctx.stroke();
                            }

                            // x labels (log scale)
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'top';
                            [10, 100, 1000, 10000, 100000].forEach(function(v) {
                                var lx = chartLeft + Math.log(v) * xScale;
                                ctx.fillStyle = viz.colors.text;
                                ctx.fillText(v >= 1000 ? (v/1000) + 'k' : v.toString(), lx, chartBottom + 4);
                            });
                            ctx.fillText('p (log scale)', (chartLeft + chartRight) / 2, chartBottom + 18);

                            // All-primes sum (orange, diverging)
                            ctx.strokeStyle = viz.colors.orange;
                            ctx.lineWidth = 1.5;
                            ctx.beginPath();
                            for (var i = 0; i < ns.length; i++) {
                                var px2 = chartLeft + Math.log(ns[i]) * xScale;
                                var py2 = chartBottom - allSum[i] * yScale;
                                if (i === 0) ctx.moveTo(px2, py2);
                                else ctx.lineTo(px2, py2);
                            }
                            ctx.stroke();

                            // Twin-primes sum (teal, converging)
                            ctx.strokeStyle = viz.colors.teal;
                            ctx.lineWidth = 2.5;
                            ctx.beginPath();
                            for (var j = 0; j < ns.length; j++) {
                                var px3 = chartLeft + Math.log(ns[j]) * xScale;
                                var py3 = chartBottom - twinSum[j] * yScale;
                                if (j === 0) ctx.moveTo(px3, py3);
                                else ctx.lineTo(px3, py3);
                            }
                            ctx.stroke();

                            // Horizontal dashed line at B_2 ~ 1.902
                            var b2 = 1.902;
                            var yB2 = chartBottom - b2 * yScale;
                            ctx.setLineDash([5, 4]);
                            ctx.strokeStyle = viz.colors.green;
                            ctx.lineWidth = 1;
                            ctx.beginPath();
                            ctx.moveTo(chartLeft, yB2);
                            ctx.lineTo(chartRight, yB2);
                            ctx.stroke();
                            ctx.setLineDash([]);
                            ctx.fillStyle = viz.colors.green;
                            ctx.font = '10px -apple-system,sans-serif';
                            ctx.textAlign = 'right';
                            ctx.fillText('B\u2082 \u2248 1.902', chartRight, yB2 - 5);

                            // Legend
                            ctx.font = '11px -apple-system,sans-serif';
                            ctx.textAlign = 'left';
                            ctx.fillStyle = viz.colors.orange;
                            ctx.fillText('\u03a3 1/p (all primes, diverges)', chartLeft + 10, chartTop + 10);
                            ctx.fillStyle = viz.colors.teal;
                            ctx.fillText('\u03a3 1/p (twin primes, converges to B\u2082)', chartLeft + 10, chartTop + 25);
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: "Show that if \\(\\pi_2(N) \\gg N/(\\log N)^2\\) (lower bound), then \\(\\sum_{\\text{twin } p \\leq N} 1/p\\) also diverges. This shows the upper bound \\(\\pi_2(N) \\ll N/(\\log N)^2\\) is necessary for Brun's theorem.",
                    hint: "Apply partial summation: \\(\\sum_{p \\leq N} 1/p = \\pi_2(N)/N + \\int_2^N \\pi_2(t)/t^2 \\, dt\\). If \\(\\pi_2(t) \\geq ct/(\\log t)^2\\), what does the integral give?",
                    solution: "If \\(\\pi_2(t) \\geq ct/(\\log t)^2\\) for large \\(t\\), then \\(\\int_2^N \\pi_2(t)/t^2 \\, dt \\geq c \\int_2^N (\\log t)^{-2}/t \\, dt = c \\int_{\\log 2}^{\\log N} u^{-2} du \\to c/\\log 2 < \\infty\\). Actually this converges! The argument for divergence requires \\(\\pi_2(N) \\gg N / \\log N\\) (like all primes). The sieve bound \\(\\pi_2(N) \\ll N/(\\log N)^2\\) is precisely what makes the series converge."
                },
                {
                    question: "The first few twin prime pairs are (3,5), (5,7), (11,13), (17,19), (29,31), (41,43). Compute the partial sum \\(\\sum 1/p\\) over all primes in these pairs (counting 5 once). How does it compare to \\(B_2 \\approx 1.902\\)?",
                    hint: "List the twin primes appearing: 3, 5, 7, 11, 13, 17, 19, 29, 31, 41, 43. Sum their reciprocals.",
                    solution: "The unique primes are 3, 5, 7, 11, 13, 17, 19, 29, 31, 41, 43. Their reciprocals sum to \\(1/3 + 1/5 + 1/7 + 1/11 + 1/13 + 1/17 + 1/19 + 1/29 + 1/31 + 1/41 + 1/43 \\approx 0.333 + 0.200 + 0.143 + 0.091 + 0.077 + 0.059 + 0.053 + 0.034 + 0.032 + 0.024 + 0.023 \\approx 1.069\\). This is already more than half of \\(B_2 \\approx 1.902\\), illustrating how much of the sum comes from small twin primes."
                }
            ]
        },

        // ================================================================
        // SECTION 6: Applications
        // ================================================================
        {
            id: 'sec-applications',
            title: 'Applications',
            content: `
<h2>Applications of Combinatorial Sieves</h2>

<p>Brun's sieve and its variants yield a suite of upper bounds that, while short of the full prime-detection goal, are mathematically significant and often sharp in order of magnitude.</p>

<h3>Upper Bounds for Primes in Arithmetic Progressions</h3>

<p>For \\(\\mathcal{A} = \\{an + b : n \\leq N/a\\}\\) with \\(\\gcd(a, b) = 1\\), the sieve gives</p>
\\[\\pi(N; a, b) := \\#\\{p \\leq N : p \\equiv b \\pmod{a}\\} \\ll \\frac{N}{\\phi(a) \\log N}.\\]
<p>This is weaker than the PNT for arithmetic progressions (which gives \\(\\sim N/\\phi(a) \\log N\\)), but holds without requiring the non-vanishing of \\(L(1, \\chi)\\).</p>

<h3>Almost Primes</h3>

<p>Define \\(P_r\\) to be the set of integers with at most \\(r\\) prime factors, counted with multiplicity. These are called <strong>\\(r\\)-almost primes</strong>. For \\(r = 1\\), \\(P_1\\) is the primes. For \\(r = 2\\), \\(P_2 = \\{4, 6, 9, 10, 14, 15, \\ldots\\}\\) includes semiprimes like 6 = 2 · 3.</p>

<div class="env-block theorem">
    <div class="env-title">Theorem 11.5 (Brun: Almost Primes in \\(n^2 + 1\\))</div>
    <div class="env-body">
        <p>The set \\(\\{n^2 + 1 : n \\leq N\\}\\) contains \\(\\gg N / \\log N\\) elements that are \\(P_r\\) for some fixed \\(r\\). In particular, there are infinitely many integers of the form \\(n^2 + 1\\) with a bounded number of prime factors.</p>
    </div>
</div>

<p>The proof uses the sieve for the set \\(\\mathcal{A} = \\{n^2 + 1 : n \\leq N\\}\\) with \\(\\omega(p) = 1 + \\left(\\frac{-1}{p}\\right)\\) (the number of solutions to \\(x^2 \\equiv -1 \\pmod p\\)), which equals 0 or 2 for odd \\(p\\) and equals 1 for \\(p = 2\\).</p>

<h3>Goldbach's Problem: Almost-Primes Version</h3>

<p>Brun proved that every large even integer can be written as the sum of two \\(P_9\\) numbers (a so-called "9+9 result"). The chain of improvements:</p>
<ul>
    <li>Brun (1920): \\(9 + 9\\)</li>
    <li>Rényi (1947): \\(1 + K\\) for some large \\(K\\)</li>
    <li>Pan (1962), Barban (1963): \\(1 + 5\\), \\(1 + 4\\), \\(1 + 3\\)</li>
    <li>Chen (1973): \\(1 + 2\\) (Chen's Theorem)</li>
</ul>
<p>Chen's theorem states every large even integer is \\(p + m\\) where \\(p\\) is prime and \\(m \\in P_2\\). This is the closest anyone has come to Goldbach using sieve methods.</p>

<h3>Sieve Upper Bound for Primes Generally</h3>

<div class="env-block theorem">
    <div class="env-title">Theorem 11.6 (Brun-Titchmarsh Inequality)</div>
    <div class="env-body">
        <p>For \\(1 \\leq a < q\\) with \\(\\gcd(a, q) = 1\\) and any \\(x > q\\):</p>
        \\[\\pi(x; q, a) \\leq \\frac{2x}{\\phi(q) \\log(x/q)}.\\]
        <p>This is the correct order \\(x / (\\phi(q) \\log x)\\) up to the constant 2 (the Siegel-Walfisz theorem gives asymptotic equality with constant 1, but requires GRH or deep zero-density estimates).</p>
    </div>
</div>

<p>The Brun-Titchmarsh inequality is remarkable for being <em>unconditional</em> and <em>uniform</em> in \\(q\\) up to \\(q < x\\). It is used extensively in modern analytic number theory, including in the proof of the Bombieri-Vinogradov theorem (Chapter 13).</p>
`,
            visualizations: [
                {
                    id: 'viz-twin-primes',
                    title: 'Twin Primes on the Number Line',
                    description: 'Twin prime pairs are highlighted in teal. Observe how they thin out as numbers grow. Use the slider to extend the range.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, { width: 560, height: 320, originX: 0, originY: 0, scale: 1 });
                        var rangeVal = 150;

                        VizEngine.createSlider(controls, 'Range N', 50, 400, 150, 10, function(v) {
                            rangeVal = Math.round(v);
                            draw();
                        });

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var N = rangeVal;
                            var primes = VizEngine.sievePrimes(N + 2);
                            var primeSet = new Set(primes);

                            var cols = Math.ceil(Math.sqrt(N * 2));
                            cols = Math.min(cols, 24);
                            var cellSize = Math.floor((viz.width - 20) / cols);
                            var startX = 10;
                            var startY = 40;
                            var twinCount = 0;

                            viz.screenText('Twin Primes up to N = ' + N, viz.width / 2, 16, viz.colors.white, 13);

                            for (var n = 1; n <= N; n++) {
                                var row = Math.floor((n - 1) / cols);
                                var col2 = (n - 1) % cols;
                                var x = startX + col2 * cellSize;
                                var y = startY + row * cellSize;

                                if (y + cellSize > viz.height - 30) break;

                                var isPrime = primeSet.has(n);
                                var isTwin = isPrime && (primeSet.has(n - 2) || primeSet.has(n + 2));

                                var bg;
                                if (isTwin) { bg = viz.colors.teal; twinCount++; }
                                else if (isPrime) { bg = viz.colors.blue + '88'; }
                                else { bg = viz.colors.grid + '44'; }

                                ctx.fillStyle = bg;
                                ctx.fillRect(x, y, cellSize - 1, cellSize - 1);

                                if (cellSize >= 16) {
                                    ctx.font = Math.max(7, cellSize - 6) + 'px -apple-system,sans-serif';
                                    ctx.textAlign = 'center';
                                    ctx.textBaseline = 'middle';
                                    ctx.fillStyle = isTwin ? viz.colors.white : (isPrime ? viz.colors.white + 'bb' : viz.colors.text + '55');
                                    ctx.fillText(n, x + cellSize / 2 - 0.5, y + cellSize / 2 - 0.5);
                                }
                            }

                            var twinPairs = Math.floor(twinCount / 2);
                            viz.screenText('Twin primes (teal): ' + twinCount + '  |  Twin pairs: ~' + twinPairs, viz.width / 2, viz.height - 14, viz.colors.yellow, 11);
                        }
                        draw();
                        return viz;
                    }
                },
                {
                    id: 'viz-almost-primes',
                    title: 'Almost Primes P_r Colored by Number of Prime Factors',
                    description: 'Each number is colored by its number of prime factors (with multiplicity). Primes are teal (1 factor), semiprimes P_2 are blue, P_3 are orange, and highly composite numbers are darker.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, { width: 560, height: 320, originX: 0, originY: 0, scale: 1 });
                        var N = 180;

                        function bigOmega(n) {
                            var c = 0, d = 2;
                            while (d * d <= n) {
                                while (n % d === 0) { c++; n = Math.floor(n / d); }
                                d++;
                            }
                            if (n > 1) c++;
                            return c;
                        }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var cols = 18;
                            var cellSize = Math.floor((viz.width - 10) / cols);
                            var startX = 5;
                            var startY = 38;
                            var colorMap = [viz.colors.grid, viz.colors.teal, viz.colors.blue, viz.colors.orange, viz.colors.purple, viz.colors.red];

                            viz.screenText('Almost Primes: Color = number of prime factors \u03a9(n)', viz.width / 2, 14, viz.colors.white, 12);

                            for (var n = 1; n <= N; n++) {
                                var row = Math.floor((n - 1) / cols);
                                var col = (n - 1) % cols;
                                var x = startX + col * cellSize;
                                var y = startY + row * cellSize;

                                var om = (n === 1) ? 0 : bigOmega(n);
                                var col_idx = Math.min(om, colorMap.length - 1);
                                ctx.fillStyle = colorMap[col_idx] + (om === 0 ? '44' : 'cc');
                                ctx.fillRect(x, y, cellSize - 1, cellSize - 1);

                                ctx.font = '8px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.textBaseline = 'middle';
                                ctx.fillStyle = om <= 1 ? viz.colors.white : viz.colors.white + 'cc';
                                ctx.fillText(n, x + cellSize / 2 - 0.5, y + cellSize / 2 - 0.5);
                            }

                            // Legend
                            var legY = viz.height - 20;
                            var legX = 10;
                            var labels = ['1', 'P\u2081 (prime)', 'P\u2082', 'P\u2083', 'P\u2084', 'P\u2085+'];
                            for (var k = 0; k < colorMap.length; k++) {
                                ctx.fillStyle = colorMap[k] + 'cc';
                                ctx.fillRect(legX + k * 85, legY, 14, 12);
                                ctx.fillStyle = viz.colors.text;
                                ctx.font = '9px -apple-system,sans-serif';
                                ctx.textAlign = 'left';
                                ctx.textBaseline = 'top';
                                ctx.fillText(labels[k], legX + k * 85 + 17, legY + 1);
                            }
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: "State and prove the easy direction of Chen's theorem: every prime \\(p > 2\\) is a sum of two \\(P_2\\) numbers. (Hint: think trivially.)",
                    hint: "\\(p = 2 + (p - 2)\\). What is \\(p - 2\\) for a prime \\(p > 3\\)?",
                    solution: "For any prime \\(p > 3\\), write \\(p = 2 + (p-2)\\). Then 2 is prime (hence \\(P_1 \\subset P_2\\)) and \\(p - 2 > 1\\). If \\(p - 2\\) is prime, done. If not, \\(p - 2\\) must be composite, but this easy direction is trivial: \\(p = p + 0\\) doesn't work (0 is not \\(P_2\\)). The real content is Goldbach: writing an even number as \\(p + P_2\\)."
                },
                {
                    question: "For the Brun-Titchmarsh inequality with \\(q = 3, a = 1\\), what upper bound does it give for \\(\\pi(x; 3, 1)\\) (primes \\(\\equiv 1 \\pmod 3\\)) when \\(x = 10^6\\)?",
                    hint: "Apply \\(\\pi(x; q, a) \\leq 2x/(\\phi(q) \\log(x/q))\\) with \\(q = 3, \\phi(3) = 2, x = 10^6\\).",
                    solution: "\\(\\pi(10^6; 3, 1) \\leq \\frac{2 \\cdot 10^6}{\\phi(3) \\log(10^6/3)} = \\frac{2 \\cdot 10^6}{2 \\log(333333)} \\approx \\frac{10^6}{12.72} \\approx 78616\\). The actual value is \\(\\pi(10^6; 3, 1) \\approx 39175\\), about half the bound — consistent with the constant 2 being an overestimate."
                }
            ]
        },

        // ================================================================
        // SECTION 7: The Limits of Combinatorial Sieves
        // ================================================================
        {
            id: 'sec-bridge',
            title: 'The Limits of Combinatorial Sieves',
            content: `
<h2>The Limits of Combinatorial Sieves</h2>

<p>Combinatorial sieves are powerful but fundamentally limited. Understanding where they fail guides the development of the Selberg sieve, the large sieve, and modern methods.</p>

<h3>The Parity Problem</h3>

<p>The most celebrated obstruction to sieve methods is Selberg's <strong>parity problem</strong>. In rough terms:</p>

<div class="env-block theorem">
    <div class="env-title">Theorem 11.7 (Parity Principle, Selberg)</div>
    <div class="env-body">
        <p>Combinatorial sieves cannot distinguish between integers with an even number of prime factors and those with an odd number. More precisely, for any sieve weights \\(\\lambda_d\\) arising from the inclusion-exclusion framework, and any sequence \\(\\mathcal{A}\\), the sieve gives the same bound for</p>
        \\[\\#\\{a \\in \\mathcal{A} : a \\in P_1\\} \\quad \\text{and} \\quad \\#\\{a \\in \\mathcal{A} : a = p \\cdot q, \\text{ two primes}\\}.\\]
    </div>
</div>

<p>As a consequence, no combinatorial sieve can prove that a given sequence (like \\(n^2 + 1\\)) contains infinitely many primes. It can show the sequence contains infinitely many \\(P_2\\) numbers, but distinguishing \\(P_1\\) from \\(P_2\\) is exactly what the parity obstruction prevents.</p>

<h3>The Sieve Constant and Dimension</h3>

<p>For a sieve of dimension \\(\\kappa\\), the best possible upper bound from combinatorial methods is:</p>
\\[S(\\mathcal{A}, \\mathcal{P}, z) \\leq (F(s) + o(1)) X \\prod_{p < z}\\left(1 - \\frac{\\omega(p)}{p}\\right)\\]
<p>where \\(s = \\log X / \\log z\\) and \\(F\\) is a function depending only on \\(\\kappa\\). For \\(\\kappa = 1\\) (linear sieve), \\(F(s) \\to 1\\) as \\(s \\to \\infty\\), so the upper bound is asymptotically sharp. For \\(\\kappa = 2\\) (twin prime problem), \\(F(s) \\to 2e^{\\gamma} \\cdot \\kappa / \\kappa = 2\\), and no combinatorial sieve can achieve constant 1.</p>

<h3>What Comes Next</h3>

<p>Several approaches break through the combinatorial limitations:</p>
<ul>
    <li><strong>Selberg's sieve (Chapter 12):</strong> Replaces Mobius weights with optimized quadratic weights. Does not fully overcome parity, but dramatically improves constants.</li>
    <li><strong>Large sieve (Chapter 13):</strong> Operates in a completely different framework, using character sum estimates to average over progressions.</li>
    <li><strong>GPY sieve (2005):</strong> Goldston-Pintz-Yildirim showed \\(\\liminf (p_{n+1} - p_n) / \\log p_n = 0\\) by combining the Selberg sieve with the Elliott-Halberstam conjecture idea.</li>
    <li><strong>Zhang-Maynard (2013-2014):</strong> Bounded gaps between primes \\((p_{n+1} - p_n \\leq 246\\) unconditionally, Maynard: \\(\\leq 600\\)) using a multidimensional Selberg sieve that circumvents parity for the <em>gap</em> question.</li>
</ul>

<div class="env-block remark">
    <div class="env-title">The Moral of Sieve Theory</div>
    <div class="env-body">
        <p>Sieves are not a complete theory of primes; they are a collection of techniques for getting bounds when analytic methods give no information. The art is knowing which sieve to apply, at what level, and how to combine sieve bounds with character sum estimates, mean value theorems, and exponential sum bounds to extract the most information. The combinatorial sieves of this chapter are the conceptual foundation; the rest of Part IV builds the modern machinery on top of them.</p>
    </div>
</div>

<h3>Summary of Bounds Obtained</h3>

<table>
    <thead>
        <tr><th>Problem</th><th>What we want</th><th>Best sieve bound</th></tr>
    </thead>
    <tbody>
        <tr><td>Twin primes</td><td>\\(\\pi_2(N) \\sim 2C_2 N/(\\log N)^2\\)</td><td>\\(\\pi_2(N) \\ll N/(\\log N)^2\\) (Brun)</td></tr>
        <tr><td>Goldbach</td><td>Every even \\(n = p + q\\)</td><td>Every even \\(n = p + P_2\\) (Chen)</td></tr>
        <tr><td>\\(n^2+1\\) prime</td><td>Infinitely many primes</td><td>Infinitely many \\(P_2\\) (Brun-type)</td></tr>
        <tr><td>Primes in \\([N, N+N^{1/2}]\\)</td><td>\\(\\sim N^{1/2}/\\log N\\)</td><td>\\(\\ll N^{1/2}/\\log N\\) (Selberg, Ch.12)</td></tr>
    </tbody>
</table>
`,
            visualizations: [],
            exercises: [
                {
                    question: "Explain in one paragraph why the parity problem prevents Brun's sieve from proving that \\(\\{n^2 + 1\\}\\) contains infinitely many primes, even though it can handle \\(P_2\\) numbers.",
                    hint: "Think about what distinguishes a prime from a semiprime \\(p \\cdot q\\) in terms of the Mobius function and Liouville function.",
                    solution: "The Liouville function \\(\\lambda(n) = (-1)^{\\Omega(n)}\\) equals \\(+1\\) for numbers with an even number of prime factors and \\(-1\\) for those with an odd number (primes). Brun's sieve, being built on inclusion-exclusion via Mobius weights, is in essence a sum over \\(\\mu(d)\\), which is a linear functional of arithmetic functions. It turns out that the sieve estimates are identical for sequences weighted by \\(1\\) and by \\(\\lambda\\): formally, \\(S(\\mathcal{A}, \\mathcal{P}, z)\\) cannot distinguish the contribution from primes (\\(\\Omega = 1\\)) from semiprimes (\\(\\Omega = 2\\)) because both groups survive the sieve in the same way. The sieve detects only that an element has no small prime factor, not how many large prime factors it has."
                },
                {
                    question: "The Brun-Titchmarsh bound is \\(\\pi(x; q, a) \\leq 2x/(\\phi(q) \\log(x/q))\\). Show that for \\(q \\leq x^{1/2}\\), this gives \\(\\pi(x; q, a) \\ll x/(\\phi(q) \\log x)\\), matching the expected order of magnitude.",
                    hint: "When \\(q \\leq x^{1/2}\\), what can you say about \\(\\log(x/q)\\) vs \\(\\log x\\)?",
                    solution: "If \\(q \\leq x^{1/2}\\), then \\(x/q \\geq x^{1/2}\\), so \\(\\log(x/q) \\geq \\frac{1}{2} \\log x\\). Therefore \\(2x/(\\phi(q) \\log(x/q)) \\leq 2x/(\\phi(q) \\cdot \\frac{1}{2} \\log x) = 4x/(\\phi(q) \\log x)\\). This is \\(O(x/\\phi(q) \\log x)\\), matching the expected order."
                },
                {
                    question: "Compute \\(\\prod_{p \\leq 10}(1 - 1/p)\\) and compare to \\(e^{-\\gamma}/\\log 10\\) where \\(\\gamma \\approx 0.5772\\). This illustrates Mertens' third theorem.",
                    hint: "The primes up to 10 are 2, 3, 5, 7. Compute the product directly, then evaluate \\(e^{-\\gamma}/\\log 10 \\approx 0.5615 / 2.303\\).",
                    solution: "\\(\\prod_{p \\leq 10}(1-1/p) = (1-1/2)(1-1/3)(1-1/5)(1-1/7) = \\frac{1}{2} \\cdot \\frac{2}{3} \\cdot \\frac{4}{5} \\cdot \\frac{6}{7} = \\frac{48}{210} = \\frac{8}{35} \\approx 0.2286\\). Mertens' approximation: \\(e^{-\\gamma}/\\log 10 \\approx 0.5615 / 2.303 \\approx 0.2438\\). The ratio is \\(0.2286/0.2438 \\approx 0.94\\), close to 1 for such small \\(z = 10\\)."
                }
            ]
        }
    ]
});
