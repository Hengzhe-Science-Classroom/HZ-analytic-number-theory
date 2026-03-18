window.CHAPTERS = window.CHAPTERS || [];
window.CHAPTERS.push({
    id: 'ch11',
    number: 11,
    title: 'Sieve Methods I: Combinatorial Sieves',
    subtitle: 'Hunting primes by elimination',
    sections: [
        // ================================================================
        // SECTION 1: Motivation — Why Sieves?
        // ================================================================
        {
            id: 'sec-motivation',
            title: 'Why Sieves?',
            content: `
<h2>Why Sieves?</h2>

<div class="env-block intuition">
    <div class="env-title">The Fundamental Problem</div>
    <div class="env-body">
        <p>How many primes are there up to \\(N\\)? How many twin primes? How many primes of the form \\(n^2 + 1\\)? These questions share a common structure: we start with a set of integers and want to count those that survive after removing multiples of small primes. A <strong>sieve</strong> is a systematic method for performing this elimination.</p>
    </div>
</div>

<p>The oldest and most intuitive approach is the <em>Sieve of Eratosthenes</em>, which dates to the 3rd century BCE. The idea is disarmingly simple: to find all primes up to \\(N\\), write down all integers from 2 to \\(N\\), then cross out multiples of 2, then multiples of 3, then multiples of 5, and so on. What remains after crossing out multiples of all primes up to \\(\\sqrt{N}\\) is exactly the set of primes in \\([2, N]\\).</p>

<p>But we want more than a procedure; we want <strong>estimates</strong>. How many numbers survive the sieve? Can we turn the sieve into an analytic tool for bounding \\(\\pi(N)\\) or counting primes in arithmetic progressions?</p>

<h3>From Algorithm to Analysis</h3>

<p>The transition from sieve-as-algorithm to sieve-as-estimate involves three ideas:</p>

<ol>
    <li><strong>Inclusion-exclusion</strong> gives an exact formula for the count of survivors, but it has exponentially many terms.</li>
    <li><strong>Truncation</strong> (Brun's idea): stop the inclusion-exclusion at a controlled depth to get upper and lower bounds instead of exact counts.</li>
    <li><strong>Optimization</strong> (Selberg, Rosser): choose the truncation weights carefully to make the bounds as tight as possible.</li>
</ol>

<p>This chapter covers the first two ideas. We develop the sieve of Eratosthenes as a counting tool, connect it to inclusion-exclusion, introduce Brun's truncation, and prove Brun's theorem on the convergence of the twin prime reciprocal sum.</p>

<div class="env-block remark">
    <div class="env-title">Historical Note</div>
    <div class="env-body">
        <p>Viggo Brun (1885--1978) revolutionized sieve theory in 1919 by showing that truncated inclusion-exclusion could yield non-trivial upper bounds for prime-counting problems that seemed completely out of reach. His proof that the sum of reciprocals of twin primes converges was the first major result about twin primes, and it remains one of the deepest facts we know about them unconditionally.</p>
    </div>
</div>
`,
            visualizations: [],
            exercises: [
                {
                    question: 'Explain informally why we only need to sieve by primes up to \\(\\sqrt{N}\\) to identify all primes up to \\(N\\).',
                    hint: 'If \\(n \\leq N\\) is composite, what can you say about its smallest prime factor?',
                    solution: 'If \\(n \\leq N\\) is composite, write \\(n = ab\\) with \\(1 < a \\leq b\\). Then \\(a^2 \\leq ab = n \\leq N\\), so \\(a \\leq \\sqrt{N}\\). In particular, the smallest prime factor of \\(n\\) is at most \\(\\sqrt{N}\\). So every composite \\(n \\leq N\\) is crossed out when we sieve by primes \\(p \\leq \\sqrt{N}\\).'
                }
            ]
        },

        // ================================================================
        // SECTION 2: The Sieve of Eratosthenes
        // ================================================================
        {
            id: 'sec-eratosthenes',
            title: 'The Sieve of Eratosthenes',
            content: `
<h2>The Sieve of Eratosthenes</h2>

<div class="env-block intuition">
    <div class="env-title">The Algorithm</div>
    <div class="env-body">
        <p>Write the integers \\(2, 3, 4, \\ldots, N\\) in a grid. Start with \\(p = 2\\): cross out \\(4, 6, 8, \\ldots\\) (multiples of 2 greater than 2). The next uncrossed number is 3: cross out \\(9, 12, 15, \\ldots\\) (multiples of 3 greater than 3, starting at \\(3^2 = 9\\) since smaller multiples were already crossed out). Continue with 5, 7, 11, \\ldots until \\(p > \\sqrt{N}\\). The surviving numbers are exactly the primes up to \\(N\\).</p>
    </div>
</div>

<p>Let us formalize this. Define the <strong>sifting function</strong>:</p>

<div class="env-block definition">
    <div class="env-title">Definition (Sifting Function)</div>
    <div class="env-body">
        <p>For a finite set \\(\\mathcal{A}\\) of positive integers, a set of primes \\(\\mathcal{P}\\), and a parameter \\(z > 0\\), define</p>
        \\[S(\\mathcal{A}, \\mathcal{P}, z) = |\\{a \\in \\mathcal{A} : \\gcd(a, P(z)) = 1\\}|,\\]
        <p>where \\(P(z) = \\prod_{p \\in \\mathcal{P},\\, p < z} p\\). This counts elements of \\(\\mathcal{A}\\) not divisible by any prime \\(p < z\\) in \\(\\mathcal{P}\\).</p>
    </div>
</div>

<p>For the classical Eratosthenes sieve, \\(\\mathcal{A} = \\{2, 3, \\ldots, N\\}\\), \\(\\mathcal{P}\\) is the set of all primes, and \\(z = \\sqrt{N}\\). Then \\(S(\\mathcal{A}, \\mathcal{P}, z)\\) counts exactly the primes in \\([2, N]\\) (plus the number 1 is not in \\(\\mathcal{A}\\), so this is exactly \\(\\pi(N)\\)).</p>

<div class="env-block definition">
    <div class="env-title">Definition (Sieve Notation)</div>
    <div class="env-body">
        <p>For a squarefree integer \\(d\\) whose prime factors all lie in \\(\\mathcal{P}\\), define</p>
        \\[\\mathcal{A}_d = \\{a \\in \\mathcal{A} : d \\mid a\\},\\]
        <p>the subset of \\(\\mathcal{A}\\) divisible by \\(d\\). We write \\(|\\mathcal{A}_d|\\) for its cardinality.</p>
    </div>
</div>

<p>The key observation is that \\(|\\mathcal{A}_d|\\) can usually be decomposed as a "main term" plus an "error term":</p>

\\[|\\mathcal{A}_d| = \\frac{\\omega(d)}{d} \\cdot X + r_d,\\]

<p>where \\(X\\) is some parameter approximating \\(|\\mathcal{A}|\\), \\(\\omega\\) is a multiplicative function satisfying \\(0 \\leq \\omega(p) < p\\), and \\(r_d\\) is a remainder. For \\(\\mathcal{A} = \\{1, 2, \\ldots, N\\}\\), we have \\(|\\mathcal{A}_d| = \\lfloor N/d \\rfloor = N/d + O(1)\\), so \\(X = N\\), \\(\\omega(d) = d\\), and \\(|r_d| \\leq 1\\).</p>

<div class="viz-placeholder" data-viz="viz-eratosthenes-grid"></div>
`,
            visualizations: [
                {
                    id: 'viz-eratosthenes-grid',
                    title: 'Animated Sieve of Eratosthenes',
                    description: 'Watch the sieve eliminate composite numbers step by step. Each prime crosses out its multiples. Surviving numbers (shown in bright colors) are prime.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 580, height: 420,
                            originX: 0, originY: 0, scale: 1
                        });

                        var N = 100;
                        var sieveState = []; // 0=untouched, 1=prime, 2=crossed out
                        var currentPrime = 0;
                        var currentMult = 0;
                        var animating = false;
                        var animSpeed = 80;
                        var sievingPrimes = [];

                        function reset() {
                            sieveState = new Array(N + 1).fill(0);
                            sieveState[0] = 2; sieveState[1] = 2;
                            currentPrime = 0;
                            currentMult = 0;
                            sievingPrimes = [];
                            draw();
                        }

                        VizEngine.createSlider(controls, 'N', 30, 200, N, 10, function(v) {
                            N = Math.round(v);
                            reset();
                        });

                        VizEngine.createButton(controls, 'Run Sieve', function() {
                            if (animating) return;
                            reset();
                            animating = true;
                            currentPrime = 2;
                            currentMult = 4;
                            stepSieve();
                        });

                        VizEngine.createButton(controls, 'Reset', function() {
                            animating = false;
                            reset();
                        });

                        function stepSieve() {
                            if (!animating) return;

                            if (currentPrime * currentPrime > N) {
                                // Mark remaining untouched as prime
                                for (var i = 2; i <= N; i++) {
                                    if (sieveState[i] === 0) {
                                        sieveState[i] = 1;
                                    }
                                }
                                animating = false;
                                draw();
                                return;
                            }

                            if (sieveState[currentPrime] === 2) {
                                currentPrime++;
                                currentMult = currentPrime * currentPrime;
                                stepSieve();
                                return;
                            }

                            // Mark current as prime
                            sieveState[currentPrime] = 1;
                            sievingPrimes.push(currentPrime);

                            if (currentMult <= N) {
                                sieveState[currentMult] = 2;
                                draw();
                                currentMult += currentPrime;
                                setTimeout(stepSieve, animSpeed);
                            } else {
                                currentPrime++;
                                while (currentPrime <= Math.sqrt(N) && sieveState[currentPrime] === 2) {
                                    currentPrime++;
                                }
                                currentMult = currentPrime * currentPrime;
                                draw();
                                setTimeout(stepSieve, animSpeed);
                            }
                        }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            viz.screenText('Sieve of Eratosthenes up to ' + N, viz.width / 2, 18, viz.colors.white, 15);

                            var cols = Math.ceil(Math.sqrt(N * 1.4));
                            var rows = Math.ceil(N / cols);
                            var cellW = Math.min(36, (viz.width - 40) / cols);
                            var cellH = Math.min(28, (viz.height - 70) / rows);
                            var startX = (viz.width - cols * cellW) / 2;
                            var startY = 40;

                            for (var i = 2; i <= N; i++) {
                                var col = (i - 2) % cols;
                                var row = Math.floor((i - 2) / cols);
                                var x = startX + col * cellW;
                                var y = startY + row * cellH;

                                var state = sieveState[i];
                                var bgColor, textColor;

                                if (state === 1) {
                                    // Prime
                                    bgColor = viz.colors.blue + '55';
                                    textColor = viz.colors.blue;
                                } else if (state === 2) {
                                    // Crossed out
                                    bgColor = viz.colors.red + '22';
                                    textColor = viz.colors.text + '55';
                                } else {
                                    // Untouched
                                    bgColor = null;
                                    textColor = viz.colors.white;
                                }

                                if (bgColor) {
                                    ctx.fillStyle = bgColor;
                                    ctx.fillRect(x, y, cellW - 2, cellH - 2);
                                }

                                ctx.font = (cellW < 24 ? '9' : '11') + 'px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.textBaseline = 'middle';
                                ctx.fillStyle = textColor;
                                ctx.fillText(i.toString(), x + cellW / 2 - 1, y + cellH / 2);

                                if (state === 2) {
                                    ctx.strokeStyle = viz.colors.red + '44';
                                    ctx.lineWidth = 1;
                                    ctx.beginPath();
                                    ctx.moveTo(x + 2, y + 2);
                                    ctx.lineTo(x + cellW - 4, y + cellH - 4);
                                    ctx.stroke();
                                }
                            }

                            // Stats
                            var primeCount = 0;
                            for (var j = 2; j <= N; j++) {
                                if (sieveState[j] === 1) primeCount++;
                            }
                            if (primeCount > 0 || !animating) {
                                var crossed = 0;
                                for (var k = 2; k <= N; k++) { if (sieveState[k] === 2) crossed++; }
                                viz.screenText(
                                    'Primes found: ' + primeCount + '   Eliminated: ' + crossed,
                                    viz.width / 2, viz.height - 10, viz.colors.teal, 12
                                );
                            }
                            if (animating && currentPrime > 0) {
                                viz.screenText(
                                    'Sieving by p = ' + currentPrime,
                                    viz.width / 2, viz.height - 28, viz.colors.orange, 12
                                );
                            }
                        }
                        reset();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Run the sieve of Eratosthenes by hand for \\(N = 50\\). How many primes are there up to 50? Which prime is the last one you need to sieve by?',
                    hint: '\\(\\sqrt{50} \\approx 7.07\\), so you sieve by 2, 3, 5, 7.',
                    solution: 'Sieving by 2, 3, 5, 7 suffices since \\(7^2 = 49 \\leq 50 < 64 = 8^2\\). The primes up to 50 are: 2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47. That is \\(\\pi(50) = 15\\) primes.'
                }
            ]
        },

        // ================================================================
        // SECTION 3: Inclusion-Exclusion and the Legendre Sieve
        // ================================================================
        {
            id: 'sec-inclusion-exclusion',
            title: 'Inclusion-Exclusion and the Legendre Sieve',
            content: `
<h2>Inclusion-Exclusion and the Legendre Sieve</h2>

<div class="env-block intuition">
    <div class="env-title">Counting Survivors</div>
    <div class="env-body">
        <p>How many integers in \\(\\{1, \\ldots, 30\\}\\) are divisible by neither 2 nor 3? By inclusion-exclusion: start with 30, subtract the \\(\\lfloor 30/2 \\rfloor = 15\\) multiples of 2, subtract the \\(\\lfloor 30/3 \\rfloor = 10\\) multiples of 3, then add back the \\(\\lfloor 30/6 \\rfloor = 5\\) multiples of both (which we subtracted twice). Answer: \\(30 - 15 - 10 + 5 = 10\\).</p>
    </div>
</div>

<h3>The General Inclusion-Exclusion Principle</h3>

<div class="env-block theorem">
    <div class="env-title">Theorem 11.1 (Inclusion-Exclusion)</div>
    <div class="env-body">
        <p>Let \\(A_1, A_2, \\ldots, A_k\\) be finite subsets of a finite set \\(U\\). Then</p>
        \\[\\left| U \\setminus \\bigcup_{i=1}^k A_i \\right| = \\sum_{S \\subseteq \\{1,\\ldots,k\\}} (-1)^{|S|} \\left| \\bigcap_{i \\in S} A_i \\right|,\\]
        <p>where the empty intersection is \\(U\\) itself.</p>
    </div>
</div>

<div class="env-block proof">
    <div class="env-title">Proof</div>
    <div class="env-body">
        <p>Fix an element \\(x \\in U\\). Suppose \\(x\\) belongs to exactly \\(m\\) of the sets \\(A_1, \\ldots, A_k\\). Then \\(x\\)'s contribution to the right side is</p>
        \\[\\sum_{j=0}^{m} (-1)^j \\binom{m}{j} = (1 - 1)^m = \\begin{cases} 1 & \\text{if } m = 0, \\\\ 0 & \\text{if } m \\geq 1. \\end{cases}\\]
        <p>So exactly the elements in none of the \\(A_i\\) contribute 1, and the rest contribute 0.</p>
    </div>
    <div class="qed"></div>
</div>

<h3>The Legendre Sieve</h3>

<p>Applying inclusion-exclusion to the sifting function gives the <strong>Legendre formula</strong>:</p>

<div class="env-block theorem">
    <div class="env-title">Theorem 11.2 (Legendre Sieve)</div>
    <div class="env-body">
        <p>With the notation of the previous section,</p>
        \\[S(\\mathcal{A}, \\mathcal{P}, z) = \\sum_{d \\mid P(z)} \\mu(d) \\, |\\mathcal{A}_d|,\\]
        <p>where the sum runs over all squarefree divisors of \\(P(z) = \\prod_{p < z,\\, p \\in \\mathcal{P}} p\\), and \\(\\mu\\) is the Mobius function.</p>
    </div>
</div>

<div class="env-block proof">
    <div class="env-title">Proof</div>
    <div class="env-body">
        <p>For each prime \\(p < z\\) in \\(\\mathcal{P}\\), let \\(A_p = \\{a \\in \\mathcal{A} : p \\mid a\\}\\). Then</p>
        \\[S(\\mathcal{A}, \\mathcal{P}, z) = \\left| \\mathcal{A} \\setminus \\bigcup_{p} A_p \\right| = \\sum_{S} (-1)^{|S|} \\left| \\bigcap_{p \\in S} A_p \\right|.\\]
        <p>Since the \\(A_p\\) correspond to divisibility by distinct primes, \\(\\bigcap_{p \\in S} A_p = \\mathcal{A}_d\\) where \\(d = \\prod_{p \\in S} p\\). The sum over subsets \\(S\\) becomes a sum over squarefree divisors \\(d\\) of \\(P(z)\\), and \\((-1)^{|S|} = \\mu(d)\\).</p>
    </div>
    <div class="qed"></div>
</div>

<h3>Applying the Legendre Sieve</h3>

<p>For \\(\\mathcal{A} = \\{1, 2, \\ldots, N\\}\\) with \\(|\\mathcal{A}_d| = \\lfloor N/d \\rfloor\\), the Legendre formula gives</p>

\\[S(\\mathcal{A}, \\mathcal{P}, z) = \\sum_{d \\mid P(z)} \\mu(d) \\lfloor N/d \\rfloor.\\]

<p>Using \\(\\lfloor N/d \\rfloor = N/d + O(1)\\), the main term is</p>

\\[N \\sum_{d \\mid P(z)} \\frac{\\mu(d)}{d} = N \\prod_{p < z} \\left(1 - \\frac{1}{p}\\right),\\]

<p>by the multiplicativity of \\(\\mu(d)/d\\) over squarefree \\(d\\). The remainder is \\(O(2^{\\pi(z)})\\), since there are \\(2^{\\pi(z)}\\) squarefree divisors of \\(P(z)\\).</p>

<div class="env-block warning">
    <div class="env-title">The Parity Problem</div>
    <div class="env-body">
        <p>For \\(z = \\sqrt{N}\\), the error term \\(O(2^{\\pi(z)}) = O(2^{c\\sqrt{N}/\\ln N})\\) dwarfs the main term \\(O(N/\\ln N)\\) for large \\(N\\). The full inclusion-exclusion has too many terms! This is why we need Brun's truncation.</p>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-inclusion-exclusion"></div>
`,
            visualizations: [
                {
                    id: 'viz-inclusion-exclusion',
                    title: 'Inclusion-Exclusion for Sieving',
                    description: 'Visualize how inclusion-exclusion counts integers not divisible by any of the first few primes. Watch the alternating over- and under-counting converge to the exact answer.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 580, height: 400,
                            originX: 60, originY: 360, scale: 1
                        });

                        var N = 60;
                        var maxPrimeIdx = 3;
                        var smallPrimes = [2, 3, 5, 7, 11, 13];

                        VizEngine.createSlider(controls, 'N', 20, 120, N, 10, function(v) {
                            N = Math.round(v);
                            draw();
                        });
                        VizEngine.createSlider(controls, '# primes', 1, 6, maxPrimeIdx, 1, function(v) {
                            maxPrimeIdx = Math.round(v);
                            draw();
                        });

                        function gcd(a, b) { while (b) { var t = b; b = a % b; a = t; } return a; }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            var primes = smallPrimes.slice(0, maxPrimeIdx);
                            var P = 1;
                            for (var i = 0; i < primes.length; i++) P *= primes[i];

                            // Exact count: coprime to all primes
                            var exact = 0;
                            for (var n = 1; n <= N; n++) {
                                if (gcd(n, P) === 1) exact++;
                            }

                            // Build all squarefree divisors of P
                            var divisors = [1];
                            for (var pi = 0; pi < primes.length; pi++) {
                                var p = primes[pi];
                                var len = divisors.length;
                                for (var di = 0; di < len; di++) {
                                    divisors.push(divisors[di] * p);
                                }
                            }
                            divisors.sort(function(a, b) { return a - b; });

                            // Group by number of prime factors (for step-by-step I-E)
                            function countFactors(d) {
                                var c = 0;
                                for (var q = 0; q < primes.length; q++) {
                                    if (d % primes[q] === 0) c++;
                                }
                                return c;
                            }

                            // Compute partial sums for I-E steps
                            var steps = [];
                            var running = 0;
                            for (var k = 0; k <= primes.length; k++) {
                                var termSum = 0;
                                for (var dj = 0; dj < divisors.length; dj++) {
                                    if (countFactors(divisors[dj]) === k) {
                                        var sign = (k % 2 === 0) ? 1 : -1;
                                        termSum += sign * Math.floor(N / divisors[dj]);
                                    }
                                }
                                running += termSum;
                                steps.push({ k: k, partial: running, term: termSum });
                            }

                            // Title
                            viz.screenText(
                                'Inclusion-Exclusion: coprime to {' + primes.join(', ') + '} in [1,' + N + ']',
                                viz.width / 2, 18, viz.colors.white, 13
                            );

                            // Bar chart of partial sums
                            var chartL = 80;
                            var chartR = viz.width - 60;
                            var chartW = chartR - chartL;
                            var barW = Math.min(60, chartW / (steps.length + 1));
                            var chartBot = 330;
                            var chartTop = 50;
                            var maxVal = N;
                            var chartH = chartBot - chartTop;

                            // Horizontal line at exact answer
                            var exactY = chartBot - (exact / maxVal) * chartH;
                            ctx.strokeStyle = viz.colors.teal;
                            ctx.lineWidth = 2;
                            ctx.setLineDash([6, 4]);
                            ctx.beginPath();
                            ctx.moveTo(chartL - 10, exactY);
                            ctx.lineTo(chartR + 10, exactY);
                            ctx.stroke();
                            ctx.setLineDash([]);
                            ctx.font = '11px -apple-system,sans-serif';
                            ctx.textAlign = 'left';
                            ctx.fillStyle = viz.colors.teal;
                            ctx.fillText('Exact = ' + exact, chartR + 12, exactY + 4);

                            // Zero line
                            ctx.strokeStyle = viz.colors.axis;
                            ctx.lineWidth = 1;
                            ctx.beginPath();
                            ctx.moveTo(chartL, chartBot);
                            ctx.lineTo(chartR, chartBot);
                            ctx.stroke();

                            var barColors = [viz.colors.blue, viz.colors.orange, viz.colors.green, viz.colors.purple, viz.colors.red, viz.colors.yellow, viz.colors.pink];

                            for (var si = 0; si < steps.length; si++) {
                                var cx = chartL + (si + 0.5) * (chartW / steps.length);
                                var val = steps[si].partial;
                                var barH = (val / maxVal) * chartH;

                                ctx.fillStyle = barColors[si % barColors.length] + 'aa';
                                ctx.fillRect(cx - barW / 2, chartBot - barH, barW, barH);
                                ctx.strokeStyle = barColors[si % barColors.length];
                                ctx.lineWidth = 1.5;
                                ctx.strokeRect(cx - barW / 2, chartBot - barH, barW, barH);

                                // Value label
                                ctx.font = 'bold 12px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.fillStyle = viz.colors.white;
                                ctx.textBaseline = 'bottom';
                                ctx.fillText(val.toString(), cx, chartBot - barH - 4);

                                // Step label
                                ctx.font = '10px -apple-system,sans-serif';
                                ctx.fillStyle = viz.colors.text;
                                ctx.textBaseline = 'top';
                                var label = si === 0 ? 'N' : (si % 2 === 1 ? 'Sub ' + si : 'Add ' + si);
                                ctx.fillText(label, cx, chartBot + 6);
                            }

                            // Legend
                            viz.screenText(
                                'Alternating sums converge to exact count (dashed line)',
                                viz.width / 2, viz.height - 10, viz.colors.text, 11
                            );
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Use the Legendre sieve to compute the exact number of integers in \\(\\{1, \\ldots, 30\\}\\) that are coprime to \\(30 = 2 \\cdot 3 \\cdot 5\\). Verify using Euler\'s totient: \\(\\varphi(30)\\).',
                    hint: 'Sum \\(\\mu(d) \\lfloor 30/d \\rfloor\\) over all squarefree divisors \\(d\\) of 30.',
                    solution: 'The squarefree divisors of 30 are \\(1, 2, 3, 5, 6, 10, 15, 30\\). We compute: \\(\\lfloor 30/1 \\rfloor - \\lfloor 30/2 \\rfloor - \\lfloor 30/3 \\rfloor - \\lfloor 30/5 \\rfloor + \\lfloor 30/6 \\rfloor + \\lfloor 30/10 \\rfloor + \\lfloor 30/15 \\rfloor - \\lfloor 30/30 \\rfloor = 30 - 15 - 10 - 6 + 5 + 3 + 2 - 1 = 8\\). And \\(\\varphi(30) = 30(1 - 1/2)(1 - 1/3)(1 - 1/5) = 30 \\cdot 1/2 \\cdot 2/3 \\cdot 4/5 = 8\\). \\(\\checkmark\\)'
                },
                {
                    question: 'How many squarefree divisors does \\(P(z)\\) have when \\(z = 20\\)? Why does this make the full Legendre sieve impractical for large \\(z\\)?',
                    hint: '\\(P(20) = 2 \\cdot 3 \\cdot 5 \\cdot 7 \\cdot 11 \\cdot 13 \\cdot 17 \\cdot 19\\). A product of \\(k\\) distinct primes has \\(2^k\\) squarefree divisors.',
                    solution: 'There are \\(\\pi(20) = 8\\) primes below 20, so \\(P(20)\\) has \\(2^8 = 256\\) squarefree divisors. For \\(z = 100\\), there are \\(\\pi(100) = 25\\) primes, giving \\(2^{25} = 33{,}554{,}432\\) terms. For \\(z = \\sqrt{N}\\), the number of terms \\(2^{\\pi(\\sqrt{N})}\\) grows super-polynomially, eventually swamping the main term.'
                }
            ]
        },

        // ================================================================
        // SECTION 4: Brun's Combinatorial Sieve
        // ================================================================
        {
            id: 'sec-brun',
            title: "Brun's Combinatorial Sieve",
            content: `
<h2>Brun's Combinatorial Sieve</h2>

<div class="env-block intuition">
    <div class="env-title">Truncation: The Key Idea</div>
    <div class="env-body">
        <p>The Legendre sieve uses the full inclusion-exclusion, summing over all \\(2^{\\pi(z)}\\) squarefree divisors of \\(P(z)\\). Brun's insight: if we <strong>truncate</strong> the sum by only including divisors with at most \\(2r\\) prime factors, the alternating sum gives an <strong>upper bound</strong> on the sifting function. If we truncate at \\(2r - 1\\) prime factors, we get a <strong>lower bound</strong>. This is a consequence of the Bonferroni inequalities.</p>
    </div>
</div>

<h3>Bonferroni Inequalities</h3>

<div class="env-block theorem">
    <div class="env-title">Theorem 11.3 (Bonferroni Inequalities)</div>
    <div class="env-body">
        <p>With the notation of Theorem 11.1, let \\(S_j = \\sum_{|T| = j} |\\bigcap_{i \\in T} A_i|\\). Then for any \\(m\\):</p>
        \\[\\text{If } m \\text{ is even:} \\quad \\left| U \\setminus \\bigcup A_i \\right| \\leq \\sum_{j=0}^{m} (-1)^j S_j,\\]
        \\[\\text{If } m \\text{ is odd:} \\quad \\left| U \\setminus \\bigcup A_i \\right| \\geq \\sum_{j=0}^{m} (-1)^j S_j.\\]
    </div>
</div>

<p>Brun's sieve applies this principle to the sifting function. Define:</p>

<div class="env-block definition">
    <div class="env-title">Definition (Brun's Sieve Bounds)</div>
    <div class="env-body">
        <p>For a truncation parameter \\(b \\geq 1\\), define</p>
        \\[S^+(\\mathcal{A}, \\mathcal{P}, z) = \\sum_{\\substack{d \\mid P(z) \\\\ \\nu(d) \\leq 2b}} \\mu(d) |\\mathcal{A}_d|, \\qquad S^-(\\mathcal{A}, \\mathcal{P}, z) = \\sum_{\\substack{d \\mid P(z) \\\\ \\nu(d) \\leq 2b-1}} \\mu(d) |\\mathcal{A}_d|,\\]
        <p>where \\(\\nu(d)\\) denotes the number of distinct prime factors of \\(d\\). Then</p>
        \\[S^-(\\mathcal{A}, \\mathcal{P}, z) \\leq S(\\mathcal{A}, \\mathcal{P}, z) \\leq S^+(\\mathcal{A}, \\mathcal{P}, z).\\]
    </div>
</div>

<h3>Brun's Key Estimate</h3>

<p>The art of Brun's method lies in choosing \\(b\\) optimally relative to \\(z\\) and \\(N\\). The crucial combinatorial estimate is:</p>

<div class="env-block theorem">
    <div class="env-title">Theorem 11.4 (Brun's Upper Bound)</div>
    <div class="env-body">
        <p>Let \\(\\mathcal{A} = \\{1, 2, \\ldots, N\\}\\), \\(\\mathcal{P}\\) the set of all primes, and \\(z = N^{1/u}\\) for some \\(u > 1\\). Then for \\(b = \\lfloor u/2 \\rfloor\\),</p>
        \\[S(\\mathcal{A}, \\mathcal{P}, z) \\leq N \\prod_{p < z}\\left(1 - \\frac{1}{p}\\right) \\left(1 + O\\left(\\frac{1}{(\\ln z)^{1/3}}\\right)\\right) + O(z).\\]
        <p>In particular, for \\(z = \\sqrt{N}\\) (so \\(u = 2\\)), Brun's sieve recovers a bound of the correct order for \\(\\pi(N)\\).</p>
    </div>
</div>

<p>The error term \\(O(z)\\) replaces the catastrophic \\(O(2^{\\pi(z)})\\) of the Legendre sieve. This is because the truncated sum has only \\(\\sum_{j=0}^{2b} \\binom{\\pi(z)}{j}\\) terms instead of \\(2^{\\pi(z)}\\), and \\(\\binom{\\pi(z)}{j}\\) is much smaller than \\(2^{\\pi(z)}\\) when \\(j\\) is bounded.</p>

<div class="viz-placeholder" data-viz="viz-brun-truncation"></div>
`,
            visualizations: [
                {
                    id: 'viz-brun-truncation',
                    title: "Brun's Truncation: Upper and Lower Bounds",
                    description: 'See how truncating inclusion-exclusion at different depths produces alternating upper and lower bounds that squeeze the true count.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 580, height: 400,
                            originX: 0, originY: 0, scale: 1
                        });

                        var N = 100;

                        VizEngine.createSlider(controls, 'N', 30, 200, N, 10, function(v) {
                            N = Math.round(v);
                            draw();
                        });

                        function gcd(a, b) { while (b) { var t = b; b = a % b; a = t; } return a; }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            // Use primes up to sqrt(N)
                            var sqrtN = Math.floor(Math.sqrt(N));
                            var primes = VizEngine.sievePrimes(sqrtN);
                            var k = primes.length;

                            // Build all squarefree divisors of P(sqrt(N))
                            var divisors = [{ d: 1, nf: 0 }];
                            for (var pi = 0; pi < k; pi++) {
                                var p = primes[pi];
                                var len = divisors.length;
                                for (var di = 0; di < len; di++) {
                                    divisors.push({ d: divisors[di].d * p, nf: divisors[di].nf + 1 });
                                }
                            }

                            // Compute partial I-E sums truncated at depth m
                            var exact = 0;
                            var Pz = 1;
                            for (var qi = 0; qi < k; qi++) Pz *= primes[qi];
                            for (var n = 1; n <= N; n++) {
                                if (gcd(n, Pz) === 1) exact++;
                            }

                            var partials = [];
                            var running = 0;
                            for (var m = 0; m <= k; m++) {
                                var termSum = 0;
                                for (var dj = 0; dj < divisors.length; dj++) {
                                    if (divisors[dj].nf === m) {
                                        var mu = (m % 2 === 0) ? 1 : -1;
                                        termSum += mu * Math.floor(N / divisors[dj].d);
                                    }
                                }
                                running += termSum;
                                partials.push(running);
                            }

                            viz.screenText(
                                'Truncated I-E bounds for S(A, P, ' + sqrtN + '), N = ' + N,
                                viz.width / 2, 18, viz.colors.white, 13
                            );
                            viz.screenText(
                                'Primes used: {' + primes.join(', ') + '}  (k = ' + k + ')',
                                viz.width / 2, 38, viz.colors.text, 11
                            );

                            // Chart
                            var chartL = 70;
                            var chartR = viz.width - 40;
                            var chartW = chartR - chartL;
                            var chartBot = 350;
                            var chartTop = 60;
                            var chartH = chartBot - chartTop;
                            var maxVal = Math.max(N, Math.max.apply(null, partials));
                            var minVal = Math.min(0, Math.min.apply(null, partials));
                            var range = maxVal - minVal || 1;

                            function yPos(v) {
                                return chartBot - ((v - minVal) / range) * chartH;
                            }

                            // Exact line
                            var ey = yPos(exact);
                            ctx.strokeStyle = viz.colors.teal;
                            ctx.lineWidth = 2;
                            ctx.setLineDash([6, 4]);
                            ctx.beginPath();
                            ctx.moveTo(chartL, ey);
                            ctx.lineTo(chartR, ey);
                            ctx.stroke();
                            ctx.setLineDash([]);
                            ctx.font = '11px -apple-system,sans-serif';
                            ctx.textAlign = 'left';
                            ctx.fillStyle = viz.colors.teal;
                            ctx.fillText('Exact = ' + exact, chartR - 80, ey - 8);

                            // Zero line
                            if (minVal < 0) {
                                var zy = yPos(0);
                                ctx.strokeStyle = viz.colors.axis;
                                ctx.lineWidth = 0.5;
                                ctx.beginPath();
                                ctx.moveTo(chartL, zy);
                                ctx.lineTo(chartR, zy);
                                ctx.stroke();
                            }

                            // Plot partial sums as connected points
                            var maxDepth = Math.min(partials.length, 12);
                            var dx = chartW / Math.max(maxDepth - 1, 1);

                            for (var si = 0; si < maxDepth; si++) {
                                var px = chartL + si * dx;
                                var py = yPos(partials[si]);

                                // Color based on upper/lower
                                var isUpper = (si % 2 === 0);
                                var col = isUpper ? viz.colors.orange : viz.colors.blue;

                                // Connect to previous
                                if (si > 0) {
                                    var ppx = chartL + (si - 1) * dx;
                                    var ppy = yPos(partials[si - 1]);
                                    ctx.strokeStyle = viz.colors.text + '44';
                                    ctx.lineWidth = 1;
                                    ctx.beginPath();
                                    ctx.moveTo(ppx, ppy);
                                    ctx.lineTo(px, py);
                                    ctx.stroke();
                                }

                                // Point
                                ctx.fillStyle = col;
                                ctx.beginPath();
                                ctx.arc(px, py, 5, 0, Math.PI * 2);
                                ctx.fill();

                                // Value
                                ctx.font = '10px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.fillStyle = col;
                                ctx.textBaseline = isUpper ? 'top' : 'bottom';
                                ctx.fillText(partials[si].toString(), px, py + (isUpper ? 8 : -8));

                                // Depth label
                                ctx.fillStyle = viz.colors.text;
                                ctx.textBaseline = 'top';
                                ctx.fillText('m=' + si, px, chartBot + 6);
                            }

                            // Legend
                            ctx.font = '11px -apple-system,sans-serif';
                            ctx.textAlign = 'left';
                            ctx.fillStyle = viz.colors.orange;
                            ctx.fillText('\u25CF Upper bound (even m)', chartL, viz.height - 16);
                            ctx.fillStyle = viz.colors.blue;
                            ctx.fillText('\u25CF Lower bound (odd m)', chartL + 200, viz.height - 16);
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Let \\(N = 100\\). Compute the Brun upper bound truncated at depth \\(m = 2\\) (using primes 2, 3, 5, 7) for the count of integers in \\([1, 100]\\) coprime to \\(2 \\cdot 3 \\cdot 5 \\cdot 7 = 210\\).',
                    hint: 'Include all \\(d \\mid 210\\) with \\(\\nu(d) \\leq 2\\): the divisors 1, and all primes, and all products of two primes. Sum \\(\\mu(d) \\lfloor 100/d \\rfloor\\).',
                    solution: 'Depth \\(m = 0\\): \\(\\lfloor 100/1 \\rfloor = 100\\). Depth \\(m = 1\\): subtract \\(\\lfloor 100/2 \\rfloor + \\lfloor 100/3 \\rfloor + \\lfloor 100/5 \\rfloor + \\lfloor 100/7 \\rfloor = 50 + 33 + 20 + 14 = 117\\). Depth \\(m = 2\\): add back \\(\\lfloor 100/6 \\rfloor + \\lfloor 100/10 \\rfloor + \\lfloor 100/14 \\rfloor + \\lfloor 100/15 \\rfloor + \\lfloor 100/21 \\rfloor + \\lfloor 100/35 \\rfloor = 16 + 10 + 7 + 6 + 4 + 2 = 45\\). Upper bound: \\(100 - 117 + 45 = 28\\). The exact answer is \\(\\varphi(210) \\cdot 100/210 \\approx 22.9\\), so the upper bound 28 is reasonable.'
                }
            ]
        },

        // ================================================================
        // SECTION 5: Brun's Theorem on Twin Primes
        // ================================================================
        {
            id: 'sec-brun-theorem',
            title: "Brun's Theorem",
            content: `
<h2>Brun's Theorem: The Twin Prime Sum Converges</h2>

<div class="env-block intuition">
    <div class="env-title">A Remarkable Result</div>
    <div class="env-body">
        <p>We know that \\(\\sum_{p \\text{ prime}} 1/p\\) diverges (there are "many" primes). But what about the sum over <strong>twin primes</strong> \\((p, p+2)\\) where both are prime? Is there an inexhaustible supply of twin primes, or do they thin out so rapidly that their reciprocals converge? Brun proved in 1919 that the sum converges, regardless of whether there are infinitely many twin primes.</p>
    </div>
</div>

<h3>Setting Up the Sieve</h3>

<p>To count twin primes up to \\(N\\), we sieve the set</p>

\\[\\mathcal{A} = \\{n(n+2) : 1 \\leq n \\leq N\\}\\]

<p>by all primes. An integer \\(n\\) produces a twin prime pair \\((n, n+2)\\) precisely when neither \\(n\\) nor \\(n+2\\) has a small prime factor (below \\(\\sqrt{N}\\)). For a prime \\(p\\), the number of \\(n \\in [1, N]\\) such that \\(p \\mid n(n+2)\\) is approximately \\(2N/p\\) for odd \\(p\\) (since \\(p \\mid n\\) or \\(p \\mid n+2\\), giving two residue classes mod \\(p\\)) and \\(N/2\\) for \\(p = 2\\) (since \\(2 \\mid n(n+2)\\) for all \\(n\\)).</p>

<p>More precisely, the multiplicative function \\(\\omega\\) for this problem satisfies \\(\\omega(p) = 2\\) for odd \\(p\\) and \\(\\omega(2) = 1\\).</p>

<div class="env-block theorem">
    <div class="env-title">Theorem 11.5 (Brun's Twin Prime Bound)</div>
    <div class="env-body">
        <p>Let \\(\\pi_2(N)\\) denote the number of primes \\(p \\leq N\\) such that \\(p + 2\\) is also prime. Then</p>
        \\[\\pi_2(N) \\ll \\frac{N (\\ln \\ln N)^2}{(\\ln N)^2}.\\]
    </div>
</div>

<p>The key step uses Brun's sieve with \\(z = N^{1/u}\\) for \\(u\\) a suitably large constant. The product \\(\\prod_{p < z} (1 - 2/p)\\) over odd primes, combined with the factor from \\(p = 2\\), gives a main term of order \\(N / (\\ln z)^2\\). The choice of \\(u\\) and the resulting error control yield the bound above.</p>

<h3>The Main Theorem</h3>

<div class="env-block theorem">
    <div class="env-title">Theorem 11.6 (Brun, 1919)</div>
    <div class="env-body">
        <p>The sum of the reciprocals of twin primes converges:</p>
        \\[B_2 = \\sum_{\\substack{p :\\, p \\text{ and } p+2 \\\\ \\text{both prime}}} \\left(\\frac{1}{p} + \\frac{1}{p+2}\\right) < \\infty.\\]
        <p>The constant \\(B_2\\) is called <strong>Brun's constant</strong>.</p>
    </div>
</div>

<div class="env-block proof">
    <div class="env-title">Proof sketch</div>
    <div class="env-body">
        <p>By Theorem 11.5, the number of twin primes in \\((N/2, N]\\) is \\(O(N (\\ln \\ln N)^2 / (\\ln N)^2)\\). By partial summation, the sum of \\(1/p\\) over twin primes \\(p \\in (N/2, N]\\) is</p>
        \\[O\\left(\\frac{(\\ln \\ln N)^2}{(\\ln N)^2}\\right).\\]
        <p>Summing over dyadic intervals \\((2^{k-1}, 2^k]\\) for \\(k = 1, 2, \\ldots\\), we get</p>
        \\[B_2 \\leq C \\sum_{k=1}^{\\infty} \\frac{(\\ln k)^2}{k^2} < \\infty.\\]
    </div>
    <div class="qed"></div>
</div>

<p>The numerical value of Brun's constant is known to about 10 decimal places:</p>

\\[B_2 \\approx 1.902160583104.\\]

<p>This was computed by Thomas Nicely in 1994 (famously uncovering the Pentium FDIV bug in the process).</p>

<div class="env-block remark">
    <div class="env-title">What Brun's Theorem Does NOT Say</div>
    <div class="env-body">
        <p>Brun's theorem does not tell us whether there are finitely or infinitely many twin primes. The sum \\(\\sum 1/p\\) over twin primes converges either way: if there are finitely many, the sum is a finite sum; if infinitely many, they thin out fast enough that the sum still converges. The Twin Prime Conjecture remains open.</p>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-twin-primes"></div>
<div class="viz-placeholder" data-viz="viz-brun-constant"></div>
`,
            visualizations: [
                {
                    id: 'viz-twin-primes',
                    title: 'Twin Primes up to N',
                    description: 'Visualize the distribution of twin prime pairs. Twin primes are highlighted in the number grid. Notice how they become sparser as N grows.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 580, height: 400,
                            originX: 0, originY: 0, scale: 1
                        });

                        var N = 200;

                        VizEngine.createSlider(controls, 'N', 50, 500, N, 50, function(v) {
                            N = Math.round(v);
                            draw();
                        });

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            var primes = VizEngine.sievePrimes(N + 2);
                            var isPrime = new Uint8Array(N + 3);
                            for (var i = 0; i < primes.length; i++) isPrime[primes[i]] = 1;

                            // Find twin primes
                            var twins = [];
                            for (var p = 2; p <= N; p++) {
                                if (isPrime[p] && isPrime[p + 2]) {
                                    twins.push(p);
                                }
                            }

                            var isTwin = new Uint8Array(N + 3);
                            for (var ti = 0; ti < twins.length; ti++) {
                                isTwin[twins[ti]] = 1;
                                isTwin[twins[ti] + 2] = 1;
                            }

                            viz.screenText('Twin Primes up to ' + N, viz.width / 2, 16, viz.colors.white, 14);
                            viz.screenText(
                                twins.length + ' twin prime pairs,  ' + primes.filter(function(p) { return p <= N; }).length + ' primes total',
                                viz.width / 2, 34, viz.colors.teal, 11
                            );

                            // Grid
                            var cols = Math.ceil(Math.sqrt(N * 1.5));
                            var rows = Math.ceil(N / cols);
                            var cellW = Math.min(30, (viz.width - 30) / cols);
                            var cellH = Math.min(22, (viz.height - 70) / rows);
                            var startX = (viz.width - cols * cellW) / 2;
                            var startY = 50;

                            for (var n = 2; n <= N; n++) {
                                var col = (n - 2) % cols;
                                var row = Math.floor((n - 2) / cols);
                                var x = startX + col * cellW;
                                var y = startY + row * cellH;

                                if (isTwin[n]) {
                                    ctx.fillStyle = viz.colors.orange + '55';
                                    ctx.fillRect(x, y, cellW - 1, cellH - 1);
                                } else if (isPrime[n]) {
                                    ctx.fillStyle = viz.colors.blue + '33';
                                    ctx.fillRect(x, y, cellW - 1, cellH - 1);
                                }

                                var textCol = isTwin[n] ? viz.colors.orange : (isPrime[n] ? viz.colors.blue : viz.colors.text + '44');
                                ctx.font = (cellW < 20 ? '7' : '9') + 'px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.textBaseline = 'middle';
                                ctx.fillStyle = textCol;
                                ctx.fillText(n.toString(), x + cellW / 2 - 0.5, y + cellH / 2);
                            }
                        }
                        draw();
                        return viz;
                    }
                },
                {
                    id: 'viz-brun-constant',
                    title: "Brun's Constant: Partial Sums",
                    description: "Watch the partial sums of \\(1/p + 1/(p+2)\\) over twin primes converge to Brun's constant \\(B_2 \\approx 1.902\\).",
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 580, height: 380,
                            originX: 70, originY: 330, scale: 1
                        });

                        var maxN = 5000;

                        VizEngine.createSlider(controls, 'N', 100, 10000, maxN, 100, function(v) {
                            maxN = Math.round(v);
                            draw();
                        });

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            var primes = VizEngine.sievePrimes(maxN + 2);
                            var isPrime = new Uint8Array(maxN + 3);
                            for (var i = 0; i < primes.length; i++) isPrime[primes[i]] = 1;

                            // Compute partial sums
                            var points = [];
                            var sum = 0;
                            for (var p = 2; p <= maxN; p++) {
                                if (isPrime[p] && isPrime[p + 2]) {
                                    sum += 1 / p + 1 / (p + 2);
                                    points.push([p, sum]);
                                }
                            }

                            var B2 = 1.902160583;

                            viz.screenText("Brun's Constant: Partial Sums", viz.width / 2, 16, viz.colors.white, 14);

                            // Chart area
                            var chartL = 70;
                            var chartR = viz.width - 40;
                            var chartW = chartR - chartL;
                            var chartBot = 330;
                            var chartTop = 40;
                            var chartH = chartBot - chartTop;

                            // Draw axes
                            ctx.strokeStyle = viz.colors.axis;
                            ctx.lineWidth = 1;
                            ctx.beginPath();
                            ctx.moveTo(chartL, chartBot);
                            ctx.lineTo(chartR, chartBot);
                            ctx.stroke();
                            ctx.beginPath();
                            ctx.moveTo(chartL, chartBot);
                            ctx.lineTo(chartL, chartTop);
                            ctx.stroke();

                            // Y-axis labels
                            var yMax = Math.max(B2 + 0.2, sum + 0.1);
                            var yMin = 0;
                            ctx.font = '10px -apple-system,sans-serif';
                            ctx.textAlign = 'right';
                            ctx.fillStyle = viz.colors.text;
                            for (var yv = 0; yv <= yMax; yv += 0.5) {
                                var yy = chartBot - (yv / yMax) * chartH;
                                ctx.fillText(yv.toFixed(1), chartL - 6, yy + 3);
                                ctx.strokeStyle = viz.colors.grid;
                                ctx.lineWidth = 0.5;
                                ctx.beginPath();
                                ctx.moveTo(chartL, yy);
                                ctx.lineTo(chartR, yy);
                                ctx.stroke();
                            }

                            // X-axis labels
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'top';
                            var xStep = Math.max(1, Math.pow(10, Math.floor(Math.log10(maxN / 4))));
                            for (var xv = 0; xv <= maxN; xv += xStep) {
                                var xx = chartL + (xv / maxN) * chartW;
                                ctx.fillStyle = viz.colors.text;
                                ctx.fillText(xv.toString(), xx, chartBot + 4);
                            }

                            // B2 reference line
                            var b2y = chartBot - (B2 / yMax) * chartH;
                            ctx.strokeStyle = viz.colors.orange;
                            ctx.lineWidth = 1.5;
                            ctx.setLineDash([6, 4]);
                            ctx.beginPath();
                            ctx.moveTo(chartL, b2y);
                            ctx.lineTo(chartR, b2y);
                            ctx.stroke();
                            ctx.setLineDash([]);
                            ctx.font = '11px -apple-system,sans-serif';
                            ctx.textAlign = 'left';
                            ctx.fillStyle = viz.colors.orange;
                            ctx.fillText('B\u2082 \u2248 1.902', chartR - 70, b2y - 10);

                            // Plot partial sums
                            if (points.length > 0) {
                                ctx.strokeStyle = viz.colors.blue;
                                ctx.lineWidth = 2;
                                ctx.beginPath();
                                for (var j = 0; j < points.length; j++) {
                                    var px = chartL + (points[j][0] / maxN) * chartW;
                                    var py = chartBot - (points[j][1] / yMax) * chartH;
                                    if (j === 0) ctx.moveTo(px, py);
                                    else ctx.lineTo(px, py);
                                }
                                ctx.stroke();

                                // Current value
                                var lastSum = points[points.length - 1][1];
                                viz.screenText(
                                    'Current partial sum: ' + lastSum.toFixed(6) + '  (' + points.length + ' twin prime pairs)',
                                    viz.width / 2, viz.height - 10, viz.colors.teal, 11
                                );
                            }
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'List all twin prime pairs \\((p, p+2)\\) with \\(p \\leq 100\\). Compute the partial sum \\(\\sum (1/p + 1/(p+2))\\) over these pairs to 3 decimal places.',
                    hint: 'The twin primes below 100 are: (3,5), (5,7), (11,13), (17,19), (29,31), (41,43), (59,61), (71,73).',
                    solution: 'The twin prime pairs with \\(p \\leq 100\\) are \\((3,5), (5,7), (11,13), (17,19), (29,31), (41,43), (59,61), (71,73)\\). The partial sum is \\((1/3 + 1/5) + (1/5 + 1/7) + (1/11 + 1/13) + (1/17 + 1/19) + (1/29 + 1/31) + (1/41 + 1/43) + (1/59 + 1/61) + (1/71 + 1/73) \\approx 0.533 + 0.343 + 0.168 + 0.111 + 0.067 + 0.048 + 0.033 + 0.028 = 1.331\\). (More precisely \\(\\approx 1.3309\\).)'
                },
                {
                    question: 'Why does the convergence of \\(B_2\\) not resolve the Twin Prime Conjecture?',
                    hint: 'Consider the sum \\(\\sum_{n=1}^{10} 1/n\\) vs. \\(\\sum_{n=1}^{\\infty} 1/n^2\\). One is finite and the other infinite, but both have finitely many terms below any bound.',
                    solution: 'A sum can converge either because there are finitely many terms (trivially) or because infinitely many terms decrease fast enough. Brun\'s theorem says the terms \\(1/p + 1/(p+2)\\) decrease fast enough for convergence, but this is consistent with both finitely and infinitely many twin primes. Compare: \\(\\sum 1/n^2\\) converges with infinitely many terms, while \\(\\sum_{n=1}^{10} 1/n\\) converges trivially with only 10 terms.'
                }
            ]
        },

        // ================================================================
        // SECTION 6: Applications of Combinatorial Sieves
        // ================================================================
        {
            id: 'sec-applications',
            title: 'Applications',
            content: `
<h2>Applications of Combinatorial Sieves</h2>

<p>Brun's sieve is a versatile tool. Beyond twin primes, it gives upper bounds for many problems about primes in restricted sets. We present several important applications.</p>

<h3>Application 1: Goldbach Representations</h3>

<div class="env-block theorem">
    <div class="env-title">Theorem 11.7 (Goldbach Upper Bound)</div>
    <div class="env-body">
        <p>Let \\(r(N)\\) denote the number of representations of an even integer \\(N\\) as a sum of two primes. Then</p>
        \\[r(N) \\ll \\frac{N}{(\\ln N)^2} \\prod_{\\substack{p \\mid N \\\\ p > 2}} \\frac{p - 1}{p - 2}.\\]
    </div>
</div>

<p>To count representations \\(N = p + q\\), sieve the set \\(\\mathcal{A} = \\{n : 1 \\leq n \\leq N,\\, \\gcd(n, N) = 1\\}\\). The condition that both \\(n\\) and \\(N - n\\) are prime requires sieving by all primes up to \\(\\sqrt{N}\\). The multiplicative function is \\(\\omega(p) = 2\\) for \\(p \\nmid N\\) and \\(\\omega(p) = 1\\) for \\(p \\mid N\\).</p>

<h3>Application 2: Almost Primes</h3>

<div class="env-block definition">
    <div class="env-title">Definition (Almost Prime)</div>
    <div class="env-body">
        <p>An integer \\(n\\) is a \\(P_r\\)-<strong>number</strong> (or \\(r\\)-almost prime) if it has at most \\(r\\) prime factors, counted with multiplicity. Thus \\(P_1\\)-numbers are the primes, \\(P_2\\)-numbers have at most 2 prime factors (primes or semiprimes), etc.</p>
    </div>
</div>

<div class="env-block theorem">
    <div class="env-title">Theorem 11.8 (Brun's Sieve for Almost Primes)</div>
    <div class="env-body">
        <p>For any \\(r \\geq 1\\), there exist infinitely many \\(n\\) such that both \\(n\\) and \\(n + 2\\) are \\(P_r\\)-numbers, provided \\(r \\geq 9\\). (Brun originally proved this for \\(r = 9\\); later refinements by Rademacher and others reduced this to smaller \\(r\\).)</p>
    </div>
</div>

<p>The idea is that Brun's upper bound sieve, combined with a lower bound sieve, can show that many integers survive with at most \\(r\\) prime factors. This is a stepping stone toward results like Chen's theorem (1973), which proves that every sufficiently large even number is the sum of a prime and a \\(P_2\\)-number.</p>

<h3>Application 3: Primes in Arithmetic Progressions</h3>

<p>Brun's sieve can also give upper bounds for primes in arithmetic progressions. For \\(\\mathcal{A} = \\{n \\leq N : n \\equiv a \\pmod{q}\\}\\) with \\(\\gcd(a, q) = 1\\), we have \\(|\\mathcal{A}_d| \\approx N/(qd)\\) for \\(\\gcd(d, q) = 1\\), giving:</p>

<div class="env-block theorem">
    <div class="env-title">Theorem 11.9 (Upper Bound for Primes in Progressions)</div>
    <div class="env-body">
        <p>For \\(\\gcd(a, q) = 1\\),</p>
        \\[\\pi(N; q, a) \\ll \\frac{N}{\\varphi(q) \\ln(N/q)},\\]
        <p>uniformly for \\(1 \\leq q \\leq N^{1-\\epsilon}\\). This is the <strong>Brun-Titchmarsh inequality</strong>.</p>
    </div>
</div>

<p>Compare this with the expected asymptotic \\(\\pi(N; q, a) \\sim N / (\\varphi(q) \\ln N)\\) from the prime number theorem for arithmetic progressions. The Brun-Titchmarsh bound is off by a constant factor (essentially 2) but holds uniformly in a much wider range of \\(q\\).</p>

<div class="viz-placeholder" data-viz="viz-sieve-function"></div>
<div class="viz-placeholder" data-viz="viz-almost-primes"></div>
`,
            visualizations: [
                {
                    id: 'viz-sieve-function',
                    title: 'The Sifting Function S(A, P, z)',
                    description: 'Watch how the count of survivors S(A, P, z) decreases as the sieving parameter z increases. Compare with the prediction from the main term.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 580, height: 380,
                            originX: 70, originY: 330, scale: 1
                        });

                        var N = 1000;

                        VizEngine.createSlider(controls, 'N', 100, 5000, N, 100, function(v) {
                            N = Math.round(v);
                            draw();
                        });

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            var allPrimes = VizEngine.sievePrimes(Math.ceil(Math.sqrt(N)) + 1);

                            // Compute S(A, P, z) for z = each prime
                            var points = [];
                            var mainTermPoints = [];
                            var isSifted = new Uint8Array(N + 1);

                            var survivors = N - 1; // start with [2..N]
                            points.push([1, survivors]);
                            mainTermPoints.push([1, N]);

                            var prodFactor = 1;
                            for (var pi = 0; pi < allPrimes.length; pi++) {
                                var p = allPrimes[pi];
                                if (p * p > N) break;
                                // Cross out multiples of p
                                for (var m = p * p; m <= N; m += p) {
                                    if (!isSifted[m]) {
                                        isSifted[m] = 1;
                                        survivors--;
                                    }
                                }
                                // Also cross out multiples below p^2 that include p
                                for (var m2 = 2 * p; m2 <= N; m2 += p) {
                                    if (!isSifted[m2] && m2 !== p) {
                                        isSifted[m2] = 1;
                                        survivors--;
                                    }
                                }
                                prodFactor *= (1 - 1 / p);
                                points.push([p, survivors]);
                                mainTermPoints.push([p, N * prodFactor]);
                            }

                            viz.screenText('Sifting Function S(A, P, z) for N = ' + N, viz.width / 2, 16, viz.colors.white, 14);

                            // Chart
                            var chartL = 70;
                            var chartR = viz.width - 40;
                            var chartW = chartR - chartL;
                            var chartBot = 320;
                            var chartTop = 40;
                            var chartH = chartBot - chartTop;
                            var xMax = points[points.length - 1][0];
                            var yMax = N;

                            // Axes
                            ctx.strokeStyle = viz.colors.axis;
                            ctx.lineWidth = 1;
                            ctx.beginPath();
                            ctx.moveTo(chartL, chartBot);
                            ctx.lineTo(chartR, chartBot);
                            ctx.stroke();
                            ctx.beginPath();
                            ctx.moveTo(chartL, chartBot);
                            ctx.lineTo(chartL, chartTop);
                            ctx.stroke();

                            // Labels
                            ctx.font = '10px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillStyle = viz.colors.text;
                            ctx.textBaseline = 'top';
                            viz.screenText('z (sieving parameter)', viz.width / 2, chartBot + 18, viz.colors.text, 10);

                            // Plot actual S
                            ctx.strokeStyle = viz.colors.blue;
                            ctx.lineWidth = 2;
                            ctx.beginPath();
                            for (var i = 0; i < points.length; i++) {
                                var px = chartL + (points[i][0] / xMax) * chartW;
                                var py = chartBot - (points[i][1] / yMax) * chartH;
                                if (i === 0) ctx.moveTo(px, py);
                                else ctx.lineTo(px, py);
                            }
                            ctx.stroke();

                            // Plot main term
                            ctx.strokeStyle = viz.colors.orange;
                            ctx.lineWidth = 1.5;
                            ctx.setLineDash([4, 3]);
                            ctx.beginPath();
                            for (var j = 0; j < mainTermPoints.length; j++) {
                                var mpx = chartL + (mainTermPoints[j][0] / xMax) * chartW;
                                var mpy = chartBot - (mainTermPoints[j][1] / yMax) * chartH;
                                if (j === 0) ctx.moveTo(mpx, mpy);
                                else ctx.lineTo(mpx, mpy);
                            }
                            ctx.stroke();
                            ctx.setLineDash([]);

                            // Legend
                            ctx.font = '11px -apple-system,sans-serif';
                            ctx.textAlign = 'left';
                            ctx.fillStyle = viz.colors.blue;
                            ctx.fillText('\u2014 Actual S(A,P,z)', chartL + 10, chartTop + 10);
                            ctx.fillStyle = viz.colors.orange;
                            ctx.fillText('--- Main term N\u220F(1-1/p)', chartL + 10, chartTop + 26);

                            viz.screenText(
                                'Final survivors: ' + points[points.length - 1][1],
                                viz.width / 2, viz.height - 10, viz.colors.teal, 11
                            );
                        }
                        draw();
                        return viz;
                    }
                },
                {
                    id: 'viz-almost-primes',
                    title: 'Almost Primes: P_r Numbers',
                    description: 'Explore the distribution of r-almost primes (numbers with at most r prime factors). As r increases, more numbers qualify.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 580, height: 400,
                            originX: 0, originY: 0, scale: 1
                        });

                        var N = 100;
                        var r = 2;

                        VizEngine.createSlider(controls, 'N', 30, 200, N, 10, function(v) {
                            N = Math.round(v);
                            draw();
                        });
                        VizEngine.createSlider(controls, 'r (max prime factors)', 1, 5, r, 1, function(v) {
                            r = Math.round(v);
                            draw();
                        });

                        function countPrimeFactors(n) {
                            var count = 0;
                            for (var p = 2; p * p <= n; p++) {
                                while (n % p === 0) {
                                    count++;
                                    n = n / p;
                                }
                            }
                            if (n > 1) count++;
                            return count;
                        }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            viz.screenText('P_' + r + ' numbers (at most ' + r + ' prime factors) up to ' + N, viz.width / 2, 16, viz.colors.white, 14);

                            var cols = Math.ceil(Math.sqrt(N * 1.4));
                            var rows = Math.ceil(N / cols);
                            var cellW = Math.min(36, (viz.width - 30) / cols);
                            var cellH = Math.min(26, (viz.height - 70) / rows);
                            var startX = (viz.width - cols * cellW) / 2;
                            var startY = 40;

                            var almostPrimeCount = 0;
                            var colorMap = [
                                viz.colors.text + '33',    // 0 factors (n=1)
                                viz.colors.blue,           // 1 factor (prime)
                                viz.colors.teal,           // 2 factors
                                viz.colors.green,          // 3 factors
                                viz.colors.orange,         // 4 factors
                                viz.colors.purple          // 5 factors
                            ];

                            for (var n = 2; n <= N; n++) {
                                var col = (n - 2) % cols;
                                var row = Math.floor((n - 2) / cols);
                                var x = startX + col * cellW;
                                var y = startY + row * cellH;

                                var omega = countPrimeFactors(n);
                                var isAlmostPrime = omega <= r;

                                if (isAlmostPrime) {
                                    almostPrimeCount++;
                                    var bgCol = (colorMap[Math.min(omega, 5)] || viz.colors.white) + '33';
                                    ctx.fillStyle = bgCol;
                                    ctx.fillRect(x, y, cellW - 1, cellH - 1);
                                }

                                ctx.font = (cellW < 22 ? '8' : '10') + 'px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.textBaseline = 'middle';
                                ctx.fillStyle = isAlmostPrime ? (colorMap[Math.min(omega, 5)] || viz.colors.white) : viz.colors.text + '33';
                                ctx.fillText(n.toString(), x + cellW / 2 - 0.5, y + cellH / 2);
                            }

                            viz.screenText(
                                almostPrimeCount + ' numbers are P_' + r + ' out of ' + (N - 1),
                                viz.width / 2, viz.height - 16, viz.colors.teal, 12
                            );

                            // Legend
                            var legX = startX;
                            var legY = viz.height - 36;
                            ctx.font = '9px -apple-system,sans-serif';
                            ctx.textAlign = 'left';
                            for (var li = 1; li <= Math.min(r, 5); li++) {
                                ctx.fillStyle = colorMap[li];
                                ctx.fillRect(legX + (li - 1) * 90, legY, 10, 10);
                                ctx.fillText('\u03A9=' + li, legX + (li - 1) * 90 + 14, legY + 8);
                            }
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Use a sieve argument to show that \\(\\pi(2N) - \\pi(N) \\ll N / \\ln N\\). That is, the number of primes in \\((N, 2N]\\) is \\(O(N / \\ln N)\\).',
                    hint: 'Sieve \\(\\mathcal{A} = \\{N+1, N+2, \\ldots, 2N\\}\\) by primes up to \\(\\sqrt{2N}\\). Each prime \\(p\\) eliminates about \\(N/p\\) elements.',
                    solution: 'Apply Brun\'s sieve with \\(\\mathcal{A} = \\{N+1, \\ldots, 2N\\}\\), \\(|\\mathcal{A}| = N\\), \\(z = \\sqrt{2N}\\). The main term is \\(N \\prod_{p \\leq z}(1 - 1/p)\\). By Mertens\' theorem, \\(\\prod_{p \\leq z}(1 - 1/p) \\sim e^{-\\gamma}/\\ln z = e^{-\\gamma}/(\\frac{1}{2}\\ln(2N)) \\ll 1/\\ln N\\). So the sieve gives \\(\\pi(2N) - \\pi(N) \\ll N / \\ln N\\).'
                },
                {
                    question: 'Count the \\(P_2\\)-numbers (semiprimes or primes) up to 30. List them.',
                    hint: 'A \\(P_2\\)-number has at most 2 prime factors counted with multiplicity: primes and products of two primes (e.g., 4, 6, 9, 10, ...).',
                    solution: 'The \\(P_2\\)-numbers up to 30 are: 2, 3, 4, 5, 6, 7, 9, 10, 11, 13, 14, 15, 21, 22, 25, 26, 29. Wait, let us be careful. Primes: 2, 3, 5, 7, 11, 13, 17, 19, 23, 29. Semiprimes (\\(\\Omega = 2\\)): 4, 6, 9, 10, 14, 15, 21, 22, 25, 26. Total: 20 numbers out of 29.'
                },
                {
                    question: 'State the Brun-Titchmarsh inequality and explain why it is weaker than the prime number theorem for arithmetic progressions by a factor of about 2.',
                    hint: 'Compare \\(\\pi(N; q, a) \\ll N/(\\varphi(q) \\ln(N/q))\\) with the PNT prediction \\(\\pi(N; q, a) \\sim N/(\\varphi(q) \\ln N)\\).',
                    solution: 'The Brun-Titchmarsh inequality states \\(\\pi(N; q, a) \\leq (2 + o(1)) N/(\\varphi(q) \\ln(N/q))\\) for \\(q < N\\). The PNT for arithmetic progressions gives \\(\\pi(N; q, a) \\sim N/(\\varphi(q) \\ln N)\\). For fixed \\(q\\), \\(\\ln(N/q) \\sim \\ln N\\), so the Brun-Titchmarsh bound exceeds the true order by a factor of about 2. The factor 2 arises because Brun\'s pure sieve cannot distinguish primes from products of an even number of prime factors (this is related to the "parity problem" in sieve theory).'
                }
            ]
        },

        // ================================================================
        // SECTION 7: Bridge — Toward Selberg's Sieve
        // ================================================================
        {
            id: 'sec-bridge',
            title: 'Bridge: Toward Selberg\'s Sieve',
            content: `
<h2>Bridge: From Combinatorial to Analytic Sieves</h2>

<div class="env-block intuition">
    <div class="env-title">Where We Stand</div>
    <div class="env-body">
        <p>Brun's combinatorial sieve gives us upper bounds of the right order of magnitude, but with an annoying constant factor (roughly 2 in many applications). Can we do better? The answer is yes, and the next chapter develops <strong>Selberg's sieve</strong>, which optimizes the sieve weights using a beautiful variational argument.</p>
    </div>
</div>

<h3>The Limitations of Brun's Sieve</h3>

<p>The fundamental limitation of the combinatorial sieve is the <strong>parity problem</strong>. A sieve based on the Mobius function \\(\\mu(d)\\) treats products of an even number of primes and products of an odd number of primes symmetrically. It cannot distinguish a prime \\(p\\) from a product \\(p_1 p_2 p_3\\) of three primes. This inherent symmetry means:</p>

<div class="env-block theorem">
    <div class="env-title">The Parity Barrier</div>
    <div class="env-body">
        <p>No "pure" sieve method can prove an asymptotic formula for \\(\\pi(N)\\), or prove that there are infinitely many twin primes, or prove Goldbach's conjecture. Sieve methods give upper bounds (and sometimes lower bounds) but cannot distinguish between primes and almost-primes with an even number of factors.</p>
    </div>
</div>

<p>This was made precise by Selberg in the 1950s and formalized by Bombieri in the 1970s. The parity barrier is one of the deepest obstructions in analytic number theory.</p>

<h3>Selberg's Approach</h3>

<p>Instead of truncating the Mobius function, Selberg (1947) takes a completely different approach. He considers sieve weights \\(\\lambda_d\\) (with \\(\\lambda_1 = 1\\)) and minimizes the quadratic form</p>

\\[\\sum_{d_1, d_2 \\mid P(z)} \\lambda_{d_1} \\lambda_{d_2} |\\mathcal{A}_{[d_1, d_2]}|,\\]

<p>where \\([d_1, d_2]\\) is the least common multiple. The minimum can be computed explicitly using multiplicativity, and the resulting upper bound is often sharper than Brun's by a constant factor.</p>

<h3>What Lies Ahead</h3>

<p>The next chapter will develop:</p>

<ol>
    <li><strong>Selberg's upper bound sieve</strong> and its connection to quadratic optimization.</li>
    <li>The <strong>large sieve inequality</strong>, a powerful tool from harmonic analysis.</li>
    <li>Applications to the <strong>Brun-Titchmarsh inequality</strong> with improved constants.</li>
    <li>The <strong>Bombieri-Vinogradov theorem</strong>, which gives "Riemann Hypothesis on average" for primes in arithmetic progressions.</li>
</ol>

<div class="env-block remark">
    <div class="env-title">The Sieve as a Philosophy</div>
    <div class="env-body">
        <p>Sieve methods exemplify a recurring theme in analytic number theory: when an exact formula is out of reach, settle for sharp inequalities. The art is in choosing the right framework (combinatorial vs. Selberg vs. large sieve) and the right parameters. As we will see, different problems call for different sieves, and the interplay between them is one of the richest areas of modern number theory.</p>
    </div>
</div>
`,
            visualizations: [],
            exercises: [
                {
                    question: 'Explain the parity problem informally. Why can\'t a sieve based on \\(\\mu(d)\\) alone distinguish primes from products of three primes?',
                    hint: 'Think about what \\(\\mu(d)\\) detects: it gives \\((-1)^k\\) for a product of \\(k\\) distinct primes. How does this interact with elements that are themselves products of primes?',
                    solution: 'The Mobius function \\(\\mu(d)\\) assigns \\((-1)^k\\) to squarefree \\(d\\) with \\(k\\) prime factors. A sieve uses \\(\\sum \\mu(d)\\) over divisors \\(d\\) of an integer \\(n\\) to detect whether \\(n = 1\\). But the sieve weights only see divisibility, not the full factorization structure. An integer with \\(\\Omega(n)\\) even contributes the same sign pattern as one with \\(\\Omega(n)\\) even. Since primes have \\(\\Omega = 1\\) (odd) and triply-composite numbers have \\(\\Omega = 3\\) (odd), a sieve cannot separate them: both contribute with the same parity. To break this barrier, one needs additional input beyond pure sieve inequalities, such as bilinear form estimates or automorphic form theory.'
                }
            ]
        }
    ]
});
