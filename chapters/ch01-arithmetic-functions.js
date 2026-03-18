window.CHAPTERS = window.CHAPTERS || [];
window.CHAPTERS.push({
    id: 'ch01',
    number: 1,
    title: 'Arithmetic Functions',
    subtitle: 'The language of multiplicative number theory',
    sections: [
        // ================================================================
        // SECTION 1: From Primes to Multiplicative Structure
        // ================================================================
        {
            id: 'sec-motivation',
            title: 'From Primes to Multiplicative Structure',
            content: `
<h2>From Primes to Multiplicative Structure</h2>

<div class="env-block intuition">
    <div class="env-title">The Central Question</div>
    <div class="env-body">
        <p>How are the prime numbers distributed among the positive integers? This is perhaps the oldest unsolved problem in mathematics, and analytic number theory is the field that attacks it. But before we can study the distribution of primes with analytic tools, we need a language: a collection of functions defined on the positive integers that encode multiplicative information.</p>
    </div>
</div>

<p>The fundamental theorem of arithmetic tells us that every positive integer \\(n \\geq 2\\) has a unique factorization into primes:</p>

\\[
n = p_1^{a_1} p_2^{a_2} \\cdots p_k^{a_k}.
\\]

<p>This factorization is the DNA of \\(n\\). An <strong>arithmetic function</strong> is any function \\(f: \\mathbb{Z}^+ \\to \\mathbb{C}\\). The interesting ones are those whose values reflect the prime factorization of their argument. These are the <em>multiplicative</em> functions, and they form the backbone of analytic number theory.</p>

<div class="env-block definition">
    <div class="env-title">Definition 1.1 (Arithmetic Function)</div>
    <div class="env-body">
        <p>An <strong>arithmetic function</strong> is a function \\(f: \\mathbb{Z}^+ \\to \\mathbb{C}\\). The set of all arithmetic functions is denoted \\(\\mathcal{A}\\).</p>
    </div>
</div>

<p>Why complex-valued? Because we will eventually study these functions via their Dirichlet series \\(\\sum_{n=1}^\\infty f(n) n^{-s}\\), where \\(s\\) is a complex variable. Even when \\(f(n)\\) is real for all \\(n\\), the analysis lives in \\(\\mathbb{C}\\).</p>

<h3>What Makes a Good Arithmetic Function?</h3>

<p>Not every function on \\(\\mathbb{Z}^+\\) is useful. The arithmetic functions that drive the theory share a key property: their values at composite numbers are determined by their values at prime powers. This is the <em>multiplicativity</em> condition, and it connects the algebra of \\(\\mathbb{Z}\\) (via unique factorization) to the analysis we will develop.</p>

<div class="env-block remark">
    <div class="env-title">A Roadmap</div>
    <div class="env-body">
        <p>This chapter introduces the main characters (\\(\\varphi, \\mu, d, \\sigma, \\Lambda, \\lambda\\)), the algebraic structure they live in (the Dirichlet ring), and the key inversion formula that lets us move between summatory and pointwise information. Everything here is preparation for the analytic machinery of later chapters.</p>
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

<p>We introduce six arithmetic functions that appear throughout analytic number theory. Each encodes a different aspect of the multiplicative structure of the integers.</p>

<h3>Euler's Totient Function \\(\\varphi(n)\\)</h3>

<div class="env-block definition">
    <div class="env-title">Definition 1.2 (Euler's Totient)</div>
    <div class="env-body">
        <p>\\(\\varphi(n) = |\\{k : 1 \\leq k \\leq n,\\; \\gcd(k, n) = 1\\}|\\), the count of integers from 1 to \\(n\\) coprime to \\(n\\).</p>
        <p>For a prime power \\(p^a\\):</p>
        \\[\\varphi(p^a) = p^a - p^{a-1} = p^{a-1}(p - 1).\\]
    </div>
</div>

<p>The totient function controls the structure of the group \\((\\mathbb{Z}/n\\mathbb{Z})^\\times\\) and satisfies the beautiful identity \\(\\sum_{d \\mid n} \\varphi(d) = n\\).</p>

<h3>The Mobius Function \\(\\mu(n)\\)</h3>

<div class="env-block definition">
    <div class="env-title">Definition 1.3 (Mobius Function)</div>
    <div class="env-body">
        \\[\\mu(n) = \\begin{cases} 1 & \\text{if } n = 1, \\\\ (-1)^k & \\text{if } n = p_1 p_2 \\cdots p_k \\text{ (distinct primes)}, \\\\ 0 & \\text{if } p^2 \\mid n \\text{ for some prime } p. \\end{cases}\\]
    </div>
</div>

<p>The Mobius function is the inclusion-exclusion principle incarnate. Its fundamental property is:</p>

\\[
\\sum_{d \\mid n} \\mu(d) = \\varepsilon(n) = \\begin{cases} 1 & n = 1, \\\\ 0 & n > 1. \\end{cases}
\\]

<h3>The Divisor Function \\(d(n)\\) and Sum-of-Divisors \\(\\sigma(n)\\)</h3>

<div class="env-block definition">
    <div class="env-title">Definition 1.4 (Divisor Functions)</div>
    <div class="env-body">
        <p>More generally, for \\(\\alpha \\in \\mathbb{C}\\):</p>
        \\[\\sigma_\\alpha(n) = \\sum_{d \\mid n} d^\\alpha.\\]
        <p>Special cases: \\(d(n) = \\sigma_0(n)\\) counts the number of divisors; \\(\\sigma(n) = \\sigma_1(n)\\) is the sum of divisors.</p>
        <p>At prime powers: \\(d(p^a) = a + 1\\) and \\(\\sigma(p^a) = 1 + p + p^2 + \\cdots + p^a = \\frac{p^{a+1} - 1}{p - 1}\\).</p>
    </div>
</div>

<h3>The von Mangoldt Function \\(\\Lambda(n)\\)</h3>

<div class="env-block definition">
    <div class="env-title">Definition 1.5 (von Mangoldt Function)</div>
    <div class="env-body">
        \\[\\Lambda(n) = \\begin{cases} \\log p & \\text{if } n = p^k \\text{ for some prime } p \\text{ and integer } k \\geq 1, \\\\ 0 & \\text{otherwise}. \\end{cases}\\]
    </div>
</div>

<p>This function is <em>not</em> multiplicative, but it is the natural weight for counting primes: \\(\\sum_{n \\leq x} \\Lambda(n) = \\psi(x)\\), the Chebyshev function, and the prime number theorem is equivalent to \\(\\psi(x) \\sim x\\).</p>

<h3>The Liouville Function \\(\\lambda(n)\\)</h3>

<div class="env-block definition">
    <div class="env-title">Definition 1.6 (Liouville Function)</div>
    <div class="env-body">
        <p>If \\(n = p_1^{a_1} \\cdots p_k^{a_k}\\), then</p>
        \\[\\lambda(n) = (-1)^{a_1 + a_2 + \\cdots + a_k} = (-1)^{\\Omega(n)},\\]
        <p>where \\(\\Omega(n)\\) is the number of prime factors of \\(n\\) counted with multiplicity.</p>
    </div>
</div>

<p>The Liouville function is <em>completely</em> multiplicative (\\(\\lambda(mn) = \\lambda(m)\\lambda(n)\\) for all \\(m, n\\)) and satisfies \\(\\sum_{d \\mid n} \\lambda(d) = \\mathbf{1}_{n \\text{ is a perfect square}}\\).</p>

<div class="viz-placeholder" data-viz="viz-function-scatter"></div>
`,
            visualizations: [
                {
                    id: 'viz-function-scatter',
                    title: 'Arithmetic Functions: Scatter & Running Average',
                    description: 'Plot f(n)/n for the main arithmetic functions. The running average reveals the asymptotic density. Select a function and drag the slider to explore.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 620, height: 400,
                            originX: 60, originY: 340, scale: 1
                        });

                        var N = 100;
                        var funcChoice = 'phi';

                        // Number theory helpers
                        function factorize(n) {
                            var factors = {};
                            var d = 2;
                            while (d * d <= n) {
                                while (n % d === 0) {
                                    factors[d] = (factors[d] || 0) + 1;
                                    n = Math.floor(n / d);
                                }
                                d++;
                            }
                            if (n > 1) factors[n] = (factors[n] || 0) + 1;
                            return factors;
                        }

                        function eulerPhi(n) {
                            if (n === 1) return 1;
                            var result = n;
                            var f = factorize(n);
                            for (var p in f) {
                                p = parseInt(p);
                                result = result * (1 - 1 / p);
                            }
                            return Math.round(result);
                        }

                        function divisorCount(n) {
                            var f = factorize(n);
                            var d = 1;
                            for (var p in f) d *= (f[p] + 1);
                            return d;
                        }

                        function divisorSum(n) {
                            var f = factorize(n);
                            var s = 1;
                            for (var p in f) {
                                var pp = parseInt(p);
                                var a = f[p];
                                s *= (Math.pow(pp, a + 1) - 1) / (pp - 1);
                            }
                            return Math.round(s);
                        }

                        function mobius(n) {
                            if (n === 1) return 1;
                            var f = factorize(n);
                            for (var p in f) {
                                if (f[p] > 1) return 0;
                            }
                            return Object.keys(f).length % 2 === 0 ? 1 : -1;
                        }

                        function liouville(n) {
                            var f = factorize(n);
                            var omega = 0;
                            for (var p in f) omega += f[p];
                            return omega % 2 === 0 ? 1 : -1;
                        }

                        var funcMap = {
                            'phi': { fn: function(n) { return eulerPhi(n) / n; }, label: 'phi(n)/n', asymp: '6/pi^2 ~ 0.608', color: viz.colors.blue },
                            'd': { fn: function(n) { return divisorCount(n); }, label: 'd(n)', asymp: '~ log n', color: viz.colors.teal },
                            'sigma': { fn: function(n) { return divisorSum(n) / n; }, label: 'sigma(n)/n', asymp: '~ pi^2/6 * log n', color: viz.colors.orange },
                            'mu': { fn: function(n) { return mobius(n); }, label: 'mu(n)', asymp: 'mean -> 0', color: viz.colors.purple },
                            'lambda': { fn: function(n) { return liouville(n); }, label: 'lambda(n)', asymp: 'mean -> 0', color: viz.colors.green }
                        };

                        // Controls
                        var selDiv = document.createElement('div');
                        selDiv.style.cssText = 'display:flex;gap:6px;flex-wrap:wrap;margin-bottom:4px;';
                        var funcNames = ['phi', 'd', 'sigma', 'mu', 'lambda'];
                        var funcLabels = ['\u03C6(n)/n', 'd(n)', '\u03C3(n)/n', '\u03BC(n)', '\u03BB(n)'];
                        var buttons = [];
                        funcNames.forEach(function(name, i) {
                            var b = document.createElement('button');
                            b.textContent = funcLabels[i];
                            b.style.cssText = 'padding:3px 10px;border:1px solid #30363d;border-radius:4px;background:#1a1a40;color:#c9d1d9;font-size:0.78rem;cursor:pointer;';
                            b.addEventListener('click', function() {
                                funcChoice = name;
                                buttons.forEach(function(bb) { bb.style.background = '#1a1a40'; });
                                b.style.background = '#2a2a5a';
                                draw();
                            });
                            buttons.push(b);
                            selDiv.appendChild(b);
                        });
                        buttons[0].style.background = '#2a2a5a';
                        controls.appendChild(selDiv);

                        VizEngine.createSlider(controls, 'N', 20, 500, N, 10, function(v) {
                            N = Math.round(v);
                            draw();
                        });

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var info = funcMap[funcChoice];
                            var fn = info.fn;
                            var color = info.color;

                            // Compute values
                            var vals = [0]; // index 0 unused
                            var maxVal = 0;
                            var minVal = Infinity;
                            for (var n = 1; n <= N; n++) {
                                var v = fn(n);
                                vals.push(v);
                                if (v > maxVal) maxVal = v;
                                if (v < minVal) minVal = v;
                            }

                            // Set up coordinate system
                            var leftMargin = 60;
                            var rightMargin = 20;
                            var topMargin = 40;
                            var bottomMargin = 50;
                            var plotW = viz.width - leftMargin - rightMargin;
                            var plotH = viz.height - topMargin - bottomMargin;

                            // Determine Y range
                            var yMin = Math.min(minVal, 0);
                            var yMax = maxVal * 1.1;
                            if (yMin < 0) { yMin = minVal * 1.2; }
                            if (yMax - yMin < 0.1) yMax = yMin + 1;

                            function toPixel(n, v) {
                                var px = leftMargin + (n - 1) / (N - 1) * plotW;
                                var py = topMargin + plotH - (v - yMin) / (yMax - yMin) * plotH;
                                return [px, py];
                            }

                            // Grid lines
                            ctx.strokeStyle = viz.colors.grid;
                            ctx.lineWidth = 0.5;
                            var nYTicks = 5;
                            for (var t = 0; t <= nYTicks; t++) {
                                var yv = yMin + (yMax - yMin) * t / nYTicks;
                                var py = topMargin + plotH - t / nYTicks * plotH;
                                ctx.beginPath(); ctx.moveTo(leftMargin, py); ctx.lineTo(leftMargin + plotW, py); ctx.stroke();
                                ctx.fillStyle = viz.colors.text;
                                ctx.font = '10px -apple-system,sans-serif';
                                ctx.textAlign = 'right';
                                ctx.textBaseline = 'middle';
                                ctx.fillText(yv.toFixed(2), leftMargin - 5, py);
                            }

                            // X axis
                            var zeroY = topMargin + plotH - (0 - yMin) / (yMax - yMin) * plotH;
                            if (zeroY >= topMargin && zeroY <= topMargin + plotH) {
                                ctx.strokeStyle = viz.colors.axis;
                                ctx.lineWidth = 1;
                                ctx.beginPath(); ctx.moveTo(leftMargin, zeroY); ctx.lineTo(leftMargin + plotW, zeroY); ctx.stroke();
                            }

                            // Scatter points
                            for (var i = 1; i <= N; i++) {
                                var pt = toPixel(i, vals[i]);
                                ctx.fillStyle = color + '88';
                                ctx.beginPath();
                                ctx.arc(pt[0], pt[1], Math.max(1.5, 4 - N / 200), 0, Math.PI * 2);
                                ctx.fill();
                            }

                            // Running average
                            ctx.strokeStyle = viz.colors.white;
                            ctx.lineWidth = 2;
                            ctx.beginPath();
                            var runSum = 0;
                            var started = false;
                            for (var j = 1; j <= N; j++) {
                                runSum += vals[j];
                                var avg = runSum / j;
                                var ap = toPixel(j, avg);
                                if (!started) { ctx.moveTo(ap[0], ap[1]); started = true; }
                                else ctx.lineTo(ap[0], ap[1]);
                            }
                            ctx.stroke();

                            // Labels
                            viz.screenText(info.label, viz.width / 2, 18, color, 15);
                            viz.screenText('Running avg (white)  |  Asymptotic: ' + info.asymp, viz.width / 2, viz.height - 10, viz.colors.text, 11);

                            // X-axis label
                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '11px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText('n', leftMargin + plotW / 2, viz.height - 28);

                            // X ticks
                            var xStep = Math.max(1, Math.floor(N / 10));
                            for (var xt = 1; xt <= N; xt += xStep) {
                                var xp = toPixel(xt, yMin);
                                ctx.fillStyle = viz.colors.text;
                                ctx.font = '9px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.textBaseline = 'top';
                                ctx.fillText(xt.toString(), xp[0], topMargin + plotH + 3);
                            }
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Compute \\(\\varphi(12)\\), \\(d(12)\\), \\(\\sigma(12)\\), \\(\\mu(12)\\), and \\(\\lambda(12)\\).',
                    hint: 'Factor \\(12 = 2^2 \\cdot 3\\). Use the formulas at prime powers and multiplicativity.',
                    solution: '\\(12 = 2^2 \\cdot 3\\). \\(\\varphi(12) = \\varphi(4)\\varphi(3) = 2 \\cdot 2 = 4\\) (the integers 1, 5, 7, 11 are coprime to 12). \\(d(12) = d(4)d(3) = 3 \\cdot 2 = 6\\). \\(\\sigma(12) = \\sigma(4)\\sigma(3) = 7 \\cdot 4 = 28\\). \\(\\mu(12) = 0\\) since \\(2^2 \\mid 12\\). \\(\\lambda(12) = (-1)^{2+1} = -1\\).'
                },
                {
                    question: 'Verify that \\(\\sum_{d \\mid 12} \\varphi(d) = 12\\).',
                    hint: 'The divisors of 12 are 1, 2, 3, 4, 6, 12.',
                    solution: '\\(\\varphi(1) + \\varphi(2) + \\varphi(3) + \\varphi(4) + \\varphi(6) + \\varphi(12) = 1 + 1 + 2 + 2 + 2 + 4 = 12\\). \\(\\checkmark\\)'
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

<div class="env-block definition">
    <div class="env-title">Definition 1.7 (Multiplicative Function)</div>
    <div class="env-body">
        <p>An arithmetic function \\(f\\) is <strong>multiplicative</strong> if \\(f(1) = 1\\) and</p>
        \\[f(mn) = f(m)f(n) \\quad \\text{whenever } \\gcd(m, n) = 1.\\]
        <p>It is <strong>completely multiplicative</strong> if \\(f(1) = 1\\) and \\(f(mn) = f(m)f(n)\\) for <em>all</em> \\(m, n\\).</p>
    </div>
</div>

<p>The distinction matters. For a multiplicative function, we only know \\(f(mn) = f(m)f(n)\\) when \\(m\\) and \\(n\\) share no prime factors. For a completely multiplicative function, the factorization works without restriction.</p>

<div class="env-block theorem">
    <div class="env-title">Theorem 1.1 (Values at Prime Powers Determine Everything)</div>
    <div class="env-body">
        <p>If \\(f\\) is multiplicative and \\(n = p_1^{a_1} \\cdots p_k^{a_k}\\), then</p>
        \\[f(n) = f(p_1^{a_1}) \\cdot f(p_2^{a_2}) \\cdots f(p_k^{a_k}).\\]
        <p>If \\(f\\) is completely multiplicative, this simplifies further: \\(f(p^a) = f(p)^a\\), so \\(f\\) is determined entirely by its values on the primes.</p>
    </div>
</div>

<div class="env-block proof">
    <div class="env-title">Proof</div>
    <div class="env-body">
        <p>Since \\(p_1^{a_1}, p_2^{a_2}, \\ldots, p_k^{a_k}\\) are pairwise coprime, repeated application of the multiplicativity condition gives the product formula. For the completely multiplicative case, \\(f(p^a) = f(p \\cdot p^{a-1}) = f(p) \\cdot f(p^{a-1})\\), and induction gives \\(f(p^a) = f(p)^a\\).</p>
    </div>
    <div class="qed">&marker;</div>
</div>

<h3>Classification of Our Cast</h3>

<table style="width:100%;border-collapse:collapse;margin:1em 0;">
<tr style="border-bottom:1px solid #30363d;">
    <th style="text-align:left;padding:4px 8px;color:#8b949e;">Function</th>
    <th style="text-align:left;padding:4px 8px;color:#8b949e;">Multiplicative?</th>
    <th style="text-align:left;padding:4px 8px;color:#8b949e;">Completely?</th>
    <th style="text-align:left;padding:4px 8px;color:#8b949e;">\\(f(p)\\)</th>
    <th style="text-align:left;padding:4px 8px;color:#8b949e;">\\(f(p^a)\\), \\(a \\geq 2\\)</th>
</tr>
<tr style="border-bottom:1px solid #1a1a40;">
    <td style="padding:4px 8px;">\\(\\varepsilon(n)\\)</td><td style="padding:4px 8px;">Yes</td><td style="padding:4px 8px;">Yes</td><td style="padding:4px 8px;">0</td><td style="padding:4px 8px;">0</td>
</tr>
<tr style="border-bottom:1px solid #1a1a40;">
    <td style="padding:4px 8px;">\\(\\mathbf{1}(n) = 1\\)</td><td style="padding:4px 8px;">Yes</td><td style="padding:4px 8px;">Yes</td><td style="padding:4px 8px;">1</td><td style="padding:4px 8px;">1</td>
</tr>
<tr style="border-bottom:1px solid #1a1a40;">
    <td style="padding:4px 8px;">\\(\\text{id}(n) = n\\)</td><td style="padding:4px 8px;">Yes</td><td style="padding:4px 8px;">Yes</td><td style="padding:4px 8px;">\\(p\\)</td><td style="padding:4px 8px;">\\(p^a\\)</td>
</tr>
<tr style="border-bottom:1px solid #1a1a40;">
    <td style="padding:4px 8px;">\\(\\mu(n)\\)</td><td style="padding:4px 8px;">Yes</td><td style="padding:4px 8px;">No</td><td style="padding:4px 8px;">\\(-1\\)</td><td style="padding:4px 8px;">0</td>
</tr>
<tr style="border-bottom:1px solid #1a1a40;">
    <td style="padding:4px 8px;">\\(\\varphi(n)\\)</td><td style="padding:4px 8px;">Yes</td><td style="padding:4px 8px;">No</td><td style="padding:4px 8px;">\\(p-1\\)</td><td style="padding:4px 8px;">\\(p^{a-1}(p-1)\\)</td>
</tr>
<tr style="border-bottom:1px solid #1a1a40;">
    <td style="padding:4px 8px;">\\(d(n)\\)</td><td style="padding:4px 8px;">Yes</td><td style="padding:4px 8px;">No</td><td style="padding:4px 8px;">2</td><td style="padding:4px 8px;">\\(a+1\\)</td>
</tr>
<tr style="border-bottom:1px solid #1a1a40;">
    <td style="padding:4px 8px;">\\(\\sigma(n)\\)</td><td style="padding:4px 8px;">Yes</td><td style="padding:4px 8px;">No</td><td style="padding:4px 8px;">\\(p+1\\)</td><td style="padding:4px 8px;">\\(\\frac{p^{a+1}-1}{p-1}\\)</td>
</tr>
<tr style="border-bottom:1px solid #1a1a40;">
    <td style="padding:4px 8px;">\\(\\lambda(n)\\)</td><td style="padding:4px 8px;">Yes</td><td style="padding:4px 8px;">Yes</td><td style="padding:4px 8px;">\\(-1\\)</td><td style="padding:4px 8px;">\\((-1)^a\\)</td>
</tr>
<tr>
    <td style="padding:4px 8px;">\\(\\Lambda(n)\\)</td><td style="padding:4px 8px;">No</td><td style="padding:4px 8px;">No</td><td style="padding:4px 8px;">\\(\\log p\\)</td><td style="padding:4px 8px;">\\(\\log p\\)</td>
</tr>
</table>

<div class="env-block remark">
    <div class="env-title">Key Observation</div>
    <div class="env-body">
        <p>The von Mangoldt function \\(\\Lambda\\) is the odd one out: it is not multiplicative. This is because \\(\\Lambda(1) = 0 \\neq 1\\). Its importance comes not from multiplicativity but from its connection to the logarithmic derivative of the Riemann zeta function (Section 6).</p>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-mult-builder"></div>
`,
            visualizations: [
                {
                    id: 'viz-mult-builder',
                    title: 'Multiplicative Function Builder',
                    description: 'Set the values f(p) for the first few primes using sliders, then watch the function propagate to all integers via multiplicativity. Observe how prime power values and coprime products are determined.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 620, height: 400,
                            originX: 0, originY: 0, scale: 1
                        });

                        var primes = [2, 3, 5, 7];
                        var fPrime = { 2: -1, 3: -1, 5: -1, 7: -1 };
                        var complMult = false;
                        var N = 30;

                        primes.forEach(function(p) {
                            VizEngine.createSlider(controls, 'f(' + p + ')', -3, 3, fPrime[p], 0.5, function(v) {
                                fPrime[p] = v;
                                draw();
                            });
                        });

                        var cmBtn = VizEngine.createButton(controls, 'Completely Mult: OFF', function() {
                            complMult = !complMult;
                            cmBtn.textContent = 'Completely Mult: ' + (complMult ? 'ON' : 'OFF');
                            draw();
                        });

                        function computeF(n) {
                            if (n === 1) return 1;
                            var result = 1;
                            var temp = n;
                            for (var i = 0; i < primes.length; i++) {
                                var p = primes[i];
                                var a = 0;
                                while (temp % p === 0) { a++; temp = Math.floor(temp / p); a; }
                                // fix: recount
                                a = 0; var t2 = n;
                                // redo properly
                                t2 = temp; // already divided out
                                // Let me redo this cleanly
                            }
                            // Clean implementation
                            result = 1;
                            temp = n;
                            for (var j = 0; j < primes.length; j++) {
                                var pp = primes[j];
                                var aa = 0;
                                while (temp % pp === 0) { aa++; temp = Math.floor(temp / pp); }
                                if (aa > 0) {
                                    if (complMult) {
                                        result *= Math.pow(fPrime[pp], aa);
                                    } else {
                                        // For generic multiplicative, f(p^a) we use a simple model:
                                        // Use geometric-like: f(p^a) = f(p)^a when completely mult
                                        // For non-completely-mult, use the "sum" model:
                                        // f(p^a) = 1 + f(p) + f(p)^2 + ... + f(p)^a (divisor-sum style)
                                        // Actually let's just use f(p)^a for simplicity with a note
                                        result *= Math.pow(fPrime[pp], aa);
                                    }
                                }
                            }
                            if (temp > 1) return null; // has prime factor we don't control
                            return result;
                        }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            viz.screenText('Multiplicative Function Builder', viz.width / 2, 18, viz.colors.white, 15);
                            viz.screenText(complMult ? 'f(mn) = f(m)f(n) for ALL m,n' : 'f(mn) = f(m)f(n) when gcd(m,n)=1', viz.width / 2, 36, viz.colors.teal, 11);

                            // Compute values
                            var values = [];
                            var maxAbs = 1;
                            for (var n = 1; n <= N; n++) {
                                var v = computeF(n);
                                values.push(v);
                                if (v !== null && Math.abs(v) > maxAbs) maxAbs = Math.abs(v);
                            }

                            // Plot as bar chart
                            var leftM = 40;
                            var rightM = 20;
                            var topM = 55;
                            var botM = 60;
                            var plotW = viz.width - leftM - rightM;
                            var plotH = viz.height - topM - botM;
                            var barW = Math.max(2, plotW / N - 2);
                            var yScale = plotH / 2 / (maxAbs * 1.1);
                            var zeroY = topM + plotH / 2;

                            // Zero line
                            ctx.strokeStyle = viz.colors.axis;
                            ctx.lineWidth = 1;
                            ctx.beginPath(); ctx.moveTo(leftM, zeroY); ctx.lineTo(leftM + plotW, zeroY); ctx.stroke();

                            // Y gridlines
                            ctx.strokeStyle = viz.colors.grid;
                            ctx.lineWidth = 0.5;
                            var yStep = Math.max(0.5, Math.ceil(maxAbs) / 4);
                            for (var yg = -Math.ceil(maxAbs); yg <= Math.ceil(maxAbs); yg += yStep) {
                                if (yg === 0) continue;
                                var gy = zeroY - yg * yScale;
                                if (gy < topM || gy > topM + plotH) continue;
                                ctx.beginPath(); ctx.moveTo(leftM, gy); ctx.lineTo(leftM + plotW, gy); ctx.stroke();
                                ctx.fillStyle = viz.colors.text;
                                ctx.font = '9px -apple-system,sans-serif';
                                ctx.textAlign = 'right';
                                ctx.textBaseline = 'middle';
                                ctx.fillText(yg.toFixed(1), leftM - 4, gy);
                            }

                            for (var k = 0; k < N; k++) {
                                var xc = leftM + (k + 0.5) / N * plotW;
                                var val = values[k];
                                var nn = k + 1;

                                // Determine color: primes=blue, prime powers=teal, composites=orange, unknown=gray
                                var col;
                                if (val === null) {
                                    col = viz.colors.text + '44';
                                } else {
                                    var isPrime = false;
                                    var isPrimePower = false;
                                    if (nn === 1) col = viz.colors.white;
                                    else {
                                        var f = {};
                                        var tmp = nn;
                                        for (var d = 2; d * d <= tmp; d++) {
                                            while (tmp % d === 0) { f[d] = (f[d]||0)+1; tmp = Math.floor(tmp/d); }
                                        }
                                        if (tmp > 1) f[tmp] = (f[tmp]||0)+1;
                                        var nFactors = Object.keys(f).length;
                                        if (nFactors === 1) {
                                            var exp = f[Object.keys(f)[0]];
                                            if (exp === 1) { isPrime = true; col = viz.colors.blue; }
                                            else { isPrimePower = true; col = viz.colors.teal; }
                                        } else {
                                            col = viz.colors.orange;
                                        }
                                    }
                                }

                                if (val !== null) {
                                    var barH = val * yScale;
                                    ctx.fillStyle = col;
                                    if (barH >= 0) {
                                        ctx.fillRect(xc - barW/2, zeroY - barH, barW, barH);
                                    } else {
                                        ctx.fillRect(xc - barW/2, zeroY, barW, -barH);
                                    }
                                } else {
                                    // Draw X for unknown
                                    ctx.strokeStyle = viz.colors.text + '44';
                                    ctx.lineWidth = 1;
                                    ctx.beginPath(); ctx.moveTo(xc-3, zeroY-3); ctx.lineTo(xc+3, zeroY+3); ctx.stroke();
                                    ctx.beginPath(); ctx.moveTo(xc+3, zeroY-3); ctx.lineTo(xc-3, zeroY+3); ctx.stroke();
                                }

                                // n labels
                                if (N <= 30 || (nn % 5 === 0)) {
                                    ctx.fillStyle = viz.colors.text;
                                    ctx.font = (N <= 30 ? '9' : '8') + 'px -apple-system,sans-serif';
                                    ctx.textAlign = 'center';
                                    ctx.textBaseline = 'top';
                                    ctx.fillText(nn.toString(), xc, topM + plotH + 3);
                                }
                            }

                            // Legend
                            var ly = viz.height - 20;
                            ctx.font = '10px -apple-system,sans-serif';
                            ctx.textAlign = 'left';
                            ctx.fillStyle = viz.colors.blue; ctx.fillRect(leftM, ly-4, 10, 10);
                            ctx.fillText('prime', leftM+14, ly+4);
                            ctx.fillStyle = viz.colors.teal; ctx.fillRect(leftM+70, ly-4, 10, 10);
                            ctx.fillText('prime power', leftM+84, ly+4);
                            ctx.fillStyle = viz.colors.orange; ctx.fillRect(leftM+180, ly-4, 10, 10);
                            ctx.fillText('composite', leftM+194, ly+4);

                            // Show f(p^a) = f(p)^a note
                            viz.screenText('f(p^a) = f(p)^a  (using completely multiplicative model for simplicity)', viz.width/2, viz.height - 38, viz.colors.text, 10);
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Prove that if \\(f\\) and \\(g\\) are multiplicative, then so is their pointwise product \\(h(n) = f(n)g(n)\\).',
                    hint: 'Check \\(h(1)\\) and then verify \\(h(mn) = h(m)h(n)\\) when \\(\\gcd(m,n) = 1\\).',
                    solution: '\\(h(1) = f(1)g(1) = 1 \\cdot 1 = 1\\). For \\(\\gcd(m,n) = 1\\): \\(h(mn) = f(mn)g(mn) = f(m)f(n) \\cdot g(m)g(n) = [f(m)g(m)][f(n)g(n)] = h(m)h(n)\\). \\(\\checkmark\\)'
                },
                {
                    question: 'Show that \\(\\mu\\) is not completely multiplicative by finding \\(m, n\\) with \\(\\mu(mn) \\neq \\mu(m)\\mu(n)\\).',
                    hint: 'Try \\(m = n = 2\\).',
                    solution: '\\(\\mu(2) = -1\\), so \\(\\mu(2)\\mu(2) = (-1)(-1) = 1\\). But \\(\\mu(4) = \\mu(2^2) = 0\\). Since \\(1 \\neq 0\\), \\(\\mu\\) is not completely multiplicative.'
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
    <div class="env-title">Why Not Pointwise?</div>
    <div class="env-body">
        <p>You might think the natural way to multiply arithmetic functions is pointwise: \\((f \\cdot g)(n) = f(n)g(n)\\). This works, but it misses the multiplicative structure of \\(\\mathbb{Z}^+\\). The right product, the one that respects divisibility, is <em>Dirichlet convolution</em>.</p>
    </div>
</div>

<div class="env-block definition">
    <div class="env-title">Definition 1.8 (Dirichlet Convolution)</div>
    <div class="env-body">
        <p>The <strong>Dirichlet convolution</strong> of arithmetic functions \\(f\\) and \\(g\\) is</p>
        \\[(f * g)(n) = \\sum_{d \\mid n} f(d) \\, g\\!\\left(\\frac{n}{d}\\right) = \\sum_{ab = n} f(a)g(b).\\]
    </div>
</div>

<p>The second form makes the symmetry \\(f * g = g * f\\) transparent: we sum over all factorizations \\(n = ab\\) with \\(a, b \\geq 1\\).</p>

<div class="env-block theorem">
    <div class="env-title">Theorem 1.2 (The Dirichlet Ring)</div>
    <div class="env-body">
        <p>The set of arithmetic functions with \\(f(1) \\neq 0\\), together with Dirichlet convolution \\(*\\) and pointwise addition, forms a commutative ring with identity. Specifically:</p>
        <ol>
            <li><strong>Commutativity:</strong> \\(f * g = g * f\\).</li>
            <li><strong>Associativity:</strong> \\((f * g) * h = f * (g * h)\\).</li>
            <li><strong>Identity:</strong> The function \\(\\varepsilon(n) = [n = 1]\\) satisfies \\(f * \\varepsilon = f\\).</li>
            <li><strong>Inverses:</strong> If \\(f(1) \\neq 0\\), there exists a unique \\(f^{-1}\\) with \\(f * f^{-1} = \\varepsilon\\).</li>
        </ol>
    </div>
</div>

<p>The inverse is computed recursively: \\(f^{-1}(1) = 1/f(1)\\), and for \\(n > 1\\):</p>

\\[
f^{-1}(n) = -\\frac{1}{f(1)} \\sum_{\\substack{d \\mid n \\\\ d < n}} f\\!\\left(\\frac{n}{d}\\right) f^{-1}(d).
\\]

<h3>Key Convolution Identities</h3>

<p>Many classical identities in number theory are statements about Dirichlet convolution:</p>

<table style="width:100%;border-collapse:collapse;margin:1em 0;">
<tr style="border-bottom:1px solid #30363d;">
    <th style="text-align:left;padding:4px 8px;color:#8b949e;">Identity</th>
    <th style="text-align:left;padding:4px 8px;color:#8b949e;">Meaning</th>
</tr>
<tr style="border-bottom:1px solid #1a1a40;">
    <td style="padding:4px 8px;">\\(\\mu * \\mathbf{1} = \\varepsilon\\)</td>
    <td style="padding:4px 8px;">\\(\\sum_{d|n} \\mu(d) = [n=1]\\); \\(\\mu\\) is the Dirichlet inverse of \\(\\mathbf{1}\\)</td>
</tr>
<tr style="border-bottom:1px solid #1a1a40;">
    <td style="padding:4px 8px;">\\(\\varphi * \\mathbf{1} = \\text{id}\\)</td>
    <td style="padding:4px 8px;">\\(\\sum_{d|n} \\varphi(d) = n\\)</td>
</tr>
<tr style="border-bottom:1px solid #1a1a40;">
    <td style="padding:4px 8px;">\\(\\mathbf{1} * \\mathbf{1} = d\\)</td>
    <td style="padding:4px 8px;">\\(\\sum_{d|n} 1 = d(n)\\); the divisor count</td>
</tr>
<tr style="border-bottom:1px solid #1a1a40;">
    <td style="padding:4px 8px;">\\(\\text{id} * \\mathbf{1} = \\sigma\\)</td>
    <td style="padding:4px 8px;">\\(\\sum_{d|n} d = \\sigma(n)\\); the divisor sum</td>
</tr>
<tr>
    <td style="padding:4px 8px;">\\(\\Lambda * \\mathbf{1} = \\log\\)</td>
    <td style="padding:4px 8px;">\\(\\sum_{d|n} \\Lambda(d) = \\log n\\)</td>
</tr>
</table>

<div class="env-block theorem">
    <div class="env-title">Theorem 1.3</div>
    <div class="env-body">
        <p>If \\(f\\) and \\(g\\) are multiplicative, then \\(f * g\\) is multiplicative.</p>
    </div>
</div>

<div class="env-block proof">
    <div class="env-title">Proof</div>
    <div class="env-body">
        <p>We need \\((f*g)(1) = 1\\) and \\((f*g)(mn) = (f*g)(m)(f*g)(n)\\) when \\(\\gcd(m,n) = 1\\).</p>
        <p>\\((f*g)(1) = f(1)g(1) = 1\\). For coprime \\(m, n\\), the divisors of \\(mn\\) are exactly the products \\(d_1 d_2\\) where \\(d_1 \\mid m\\) and \\(d_2 \\mid n\\) (this is the Chinese Remainder Theorem). So:</p>
        \\[(f*g)(mn) = \\sum_{d \\mid mn} f(d)g\\!\\left(\\frac{mn}{d}\\right) = \\sum_{d_1 \\mid m} \\sum_{d_2 \\mid n} f(d_1 d_2) g\\!\\left(\\frac{m}{d_1} \\cdot \\frac{n}{d_2}\\right).\\]
        <p>Since \\(\\gcd(d_1, d_2) = 1\\) and \\(\\gcd(m/d_1, n/d_2) = 1\\), multiplicativity of \\(f\\) and \\(g\\) gives:</p>
        \\[= \\sum_{d_1 \\mid m} f(d_1)g\\!\\left(\\frac{m}{d_1}\\right) \\cdot \\sum_{d_2 \\mid n} f(d_2)g\\!\\left(\\frac{n}{d_2}\\right) = (f*g)(m) \\cdot (f*g)(n).\\]
    </div>
    <div class="qed">&marker;</div>
</div>

<div class="viz-placeholder" data-viz="viz-convolution-anim"></div>

<div class="viz-placeholder" data-viz="viz-convolution-table"></div>
`,
            visualizations: [
                {
                    id: 'viz-convolution-anim',
                    title: 'Dirichlet Convolution: Divisor Pairs',
                    description: 'Visualize how (f*g)(n) is computed by summing over all divisor pairs (d, n/d). Each bar shows f(d) * g(n/d) for one divisor d of n. Animate through values of n to see which divisor pairs contribute.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 620, height: 400,
                            originX: 0, originY: 0, scale: 1
                        });

                        var nVal = 12;
                        var fChoice = 'mu';
                        var gChoice = 'one';

                        function getDivisors(n) {
                            var divs = [];
                            for (var d = 1; d <= n; d++) {
                                if (n % d === 0) divs.push(d);
                            }
                            return divs;
                        }

                        function factorize(n) {
                            var factors = {};
                            var d = 2;
                            while (d * d <= n) {
                                while (n % d === 0) { factors[d] = (factors[d]||0)+1; n = Math.floor(n/d); }
                                d++;
                            }
                            if (n > 1) factors[n] = (factors[n]||0)+1;
                            return factors;
                        }

                        var funcDefs = {
                            'one': { label: '1', fn: function() { return 1; } },
                            'id': { label: 'id', fn: function(n) { return n; } },
                            'mu': { label: '\u03BC', fn: function(n) {
                                if (n === 1) return 1;
                                var f = factorize(n);
                                for (var p in f) { if (f[p] > 1) return 0; }
                                return Object.keys(f).length % 2 === 0 ? 1 : -1;
                            }},
                            'phi': { label: '\u03C6', fn: function(n) {
                                if (n === 1) return 1;
                                var result = n;
                                var f = factorize(n);
                                for (var p in f) { result *= (1 - 1/parseInt(p)); }
                                return Math.round(result);
                            }},
                            'lambda_liou': { label: '\u03BB', fn: function(n) {
                                var f = factorize(n);
                                var omega = 0;
                                for (var p in f) omega += f[p];
                                return omega % 2 === 0 ? 1 : -1;
                            }},
                            'mangoldt': { label: '\u039B', fn: function(n) {
                                if (n === 1) return 0;
                                var f = factorize(n);
                                if (Object.keys(f).length !== 1) return 0;
                                var p = parseInt(Object.keys(f)[0]);
                                return Math.log(p);
                            }}
                        };

                        // Controls
                        var selRow = document.createElement('div');
                        selRow.style.cssText = 'display:flex;gap:8px;align-items:center;margin-bottom:4px;font-size:0.78rem;color:#c9d1d9;';
                        selRow.innerHTML = '<span>f:</span>';
                        var fSel = document.createElement('select');
                        fSel.style.cssText = 'background:#1a1a40;color:#c9d1d9;border:1px solid #30363d;border-radius:4px;padding:2px 6px;font-size:0.78rem;';
                        var gLabel = document.createElement('span');
                        gLabel.textContent = '  g:';
                        gLabel.style.marginLeft = '12px';
                        var gSel = document.createElement('select');
                        gSel.style.cssText = fSel.style.cssText;

                        Object.keys(funcDefs).forEach(function(key) {
                            var o1 = document.createElement('option'); o1.value = key; o1.textContent = funcDefs[key].label;
                            var o2 = document.createElement('option'); o2.value = key; o2.textContent = funcDefs[key].label;
                            fSel.appendChild(o1);
                            gSel.appendChild(o2);
                        });
                        fSel.value = 'mu'; gSel.value = 'one';
                        fSel.addEventListener('change', function() { fChoice = fSel.value; draw(); });
                        gSel.addEventListener('change', function() { gChoice = gSel.value; draw(); });

                        selRow.appendChild(fSel);
                        selRow.appendChild(gLabel);
                        selRow.appendChild(gSel);
                        controls.appendChild(selRow);

                        VizEngine.createSlider(controls, 'n', 1, 60, nVal, 1, function(v) {
                            nVal = Math.round(v);
                            draw();
                        });

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var f = funcDefs[fChoice].fn;
                            var g = funcDefs[gChoice].fn;
                            var fLabel = funcDefs[fChoice].label;
                            var gLabel2 = funcDefs[gChoice].label;

                            var divs = getDivisors(nVal);

                            viz.screenText('(' + fLabel + ' * ' + gLabel2 + ')(' + nVal + ') = \u03A3 ' + fLabel + '(d)\u00B7' + gLabel2 + '(' + nVal + '/d)', viz.width / 2, 18, viz.colors.white, 14);

                            // Compute terms
                            var terms = [];
                            var sum = 0;
                            var maxAbs = 1;
                            for (var i = 0; i < divs.length; i++) {
                                var d = divs[i];
                                var nd = nVal / d;
                                var fd = f(d);
                                var gnd = g(nd);
                                var prod = fd * gnd;
                                sum += prod;
                                terms.push({ d: d, nd: nd, fd: fd, gnd: gnd, prod: prod });
                                if (Math.abs(prod) > maxAbs) maxAbs = Math.abs(prod);
                                if (Math.abs(fd) > maxAbs) maxAbs = Math.abs(fd);
                                if (Math.abs(gnd) > maxAbs) maxAbs = Math.abs(gnd);
                            }

                            // Layout: show bars for each divisor pair
                            var leftM = 60;
                            var rightM = 30;
                            var topM = 50;
                            var botM = 80;
                            var plotW = viz.width - leftM - rightM;
                            var plotH = viz.height - topM - botM;

                            var nBars = divs.length;
                            var groupW = Math.min(80, plotW / nBars);
                            var barW = Math.max(4, groupW / 4);
                            var totalGroupW = nBars * groupW;
                            var startX = leftM + (plotW - totalGroupW) / 2;

                            // Scale
                            var yScale = plotH / 2 / (maxAbs * 1.15);
                            var zeroY = topM + plotH / 2;

                            // Zero line
                            ctx.strokeStyle = viz.colors.axis;
                            ctx.lineWidth = 1;
                            ctx.beginPath(); ctx.moveTo(leftM, zeroY); ctx.lineTo(leftM + plotW, zeroY); ctx.stroke();

                            for (var j = 0; j < terms.length; j++) {
                                var t = terms[j];
                                var xc = startX + (j + 0.5) * groupW;

                                // f(d) bar
                                var fH = t.fd * yScale;
                                ctx.fillStyle = viz.colors.blue + 'aa';
                                if (fH >= 0) ctx.fillRect(xc - barW * 1.5, zeroY - fH, barW, Math.max(1, Math.abs(fH)));
                                else ctx.fillRect(xc - barW * 1.5, zeroY, barW, Math.abs(fH));

                                // g(n/d) bar
                                var gH = t.gnd * yScale;
                                ctx.fillStyle = viz.colors.teal + 'aa';
                                if (gH >= 0) ctx.fillRect(xc - barW * 0.3, zeroY - gH, barW, Math.max(1, Math.abs(gH)));
                                else ctx.fillRect(xc - barW * 0.3, zeroY, barW, Math.abs(gH));

                                // f(d)*g(n/d) bar (product)
                                var pH = t.prod * yScale;
                                ctx.fillStyle = viz.colors.orange + 'cc';
                                if (pH >= 0) ctx.fillRect(xc + barW * 0.9, zeroY - pH, barW, Math.max(1, Math.abs(pH)));
                                else ctx.fillRect(xc + barW * 0.9, zeroY, barW, Math.abs(pH));

                                // Label: d | n/d
                                ctx.fillStyle = viz.colors.text;
                                ctx.font = '9px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.textBaseline = 'top';
                                ctx.fillText(t.d + '|' + t.nd, xc, zeroY + plotH/2 + 5);
                            }

                            // Result
                            viz.screenText('= ' + sum.toFixed(4).replace(/\.?0+$/, ''), viz.width / 2, viz.height - 40, viz.colors.yellow, 16);

                            // Legend
                            var ly = viz.height - 18;
                            ctx.font = '10px -apple-system,sans-serif';
                            ctx.textAlign = 'left';
                            ctx.fillStyle = viz.colors.blue; ctx.fillRect(leftM, ly-5, 10, 10);
                            ctx.fillText(fLabel + '(d)', leftM+14, ly+3);
                            ctx.fillStyle = viz.colors.teal; ctx.fillRect(leftM+80, ly-5, 10, 10);
                            ctx.fillText(gLabel2 + '(n/d)', leftM+94, ly+3);
                            ctx.fillStyle = viz.colors.orange; ctx.fillRect(leftM+180, ly-5, 10, 10);
                            ctx.fillText('product', leftM+194, ly+3);
                        }
                        draw();
                        return viz;
                    }
                },
                {
                    id: 'viz-convolution-table',
                    title: 'Convolution Contribution Table',
                    description: 'A matrix view: rows are values of d, columns are values of n, and cells show f(d)*g(n/d) when d|n. See which pairs contribute to each convolution value.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 620, height: 400,
                            originX: 0, originY: 0, scale: 1
                        });

                        var N = 12;

                        function factorize(n) {
                            var factors = {};
                            var d = 2;
                            while (d * d <= n) {
                                while (n % d === 0) { factors[d] = (factors[d]||0)+1; n = Math.floor(n/d); }
                                d++;
                            }
                            if (n > 1) factors[n] = (factors[n]||0)+1;
                            return factors;
                        }
                        function mobius(n) {
                            if (n === 1) return 1;
                            var f = factorize(n);
                            for (var p in f) { if (f[p] > 1) return 0; }
                            return Object.keys(f).length % 2 === 0 ? 1 : -1;
                        }

                        VizEngine.createSlider(controls, 'N', 6, 20, N, 1, function(v) {
                            N = Math.round(v);
                            draw();
                        });

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            viz.screenText('(\u03BC * 1)(n) contribution table: cells show \u03BC(d) when d|n', viz.width/2, 14, viz.colors.white, 12);

                            var leftM = 40;
                            var topM = 35;
                            var cellW = Math.min(35, (viz.width - leftM - 20) / N);
                            var cellH = Math.min(25, (viz.height - topM - 40) / N);

                            // Column headers (n)
                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '9px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'bottom';
                            for (var n = 1; n <= N; n++) {
                                ctx.fillText(n.toString(), leftM + (n-0.5) * cellW, topM - 2);
                            }
                            ctx.textAlign = 'right';
                            ctx.textBaseline = 'middle';
                            // Row headers (d)
                            for (var d = 1; d <= N; d++) {
                                ctx.fillStyle = viz.colors.text;
                                ctx.fillText(d.toString(), leftM - 4, topM + (d-0.5) * cellH);
                            }

                            // Label axes
                            ctx.fillStyle = viz.colors.teal;
                            ctx.font = '10px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText('n \u2192', leftM + N*cellW/2, topM - 14);
                            ctx.save();
                            ctx.translate(12, topM + N*cellH/2);
                            ctx.rotate(-Math.PI/2);
                            ctx.fillText('d \u2192', 0, 0);
                            ctx.restore();

                            // Cells
                            for (var dd = 1; dd <= N; dd++) {
                                for (var nn = 1; nn <= N; nn++) {
                                    var x = leftM + (nn-1) * cellW;
                                    var y = topM + (dd-1) * cellH;

                                    if (nn % dd === 0) {
                                        var mu = mobius(dd);
                                        var bgColor;
                                        if (mu === 1) bgColor = viz.colors.blue + '44';
                                        else if (mu === -1) bgColor = viz.colors.red + '44';
                                        else bgColor = viz.colors.text + '11';

                                        ctx.fillStyle = bgColor;
                                        ctx.fillRect(x, y, cellW-1, cellH-1);

                                        ctx.fillStyle = mu === 0 ? viz.colors.text + '66' : viz.colors.white;
                                        ctx.font = '9px -apple-system,sans-serif';
                                        ctx.textAlign = 'center';
                                        ctx.textBaseline = 'middle';
                                        ctx.fillText(mu.toString(), x + cellW/2, y + cellH/2);
                                    } else {
                                        ctx.fillStyle = '#0c0c20';
                                        ctx.fillRect(x, y, cellW-1, cellH-1);
                                    }
                                }
                            }

                            // Bottom: show column sums = epsilon(n)
                            var sumY = topM + N * cellH + 4;
                            ctx.font = '9px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'top';
                            ctx.fillStyle = viz.colors.yellow;
                            ctx.fillText('\u03A3:', leftM - 12, sumY);
                            for (var cn = 1; cn <= N; cn++) {
                                var colSum = 0;
                                for (var cd = 1; cd <= cn; cd++) {
                                    if (cn % cd === 0) colSum += mobius(cd);
                                }
                                ctx.fillStyle = colSum === 0 ? viz.colors.text : viz.colors.yellow;
                                ctx.fillText(colSum.toString(), leftM + (cn-0.5)*cellW, sumY);
                            }
                            viz.screenText('Column sums = \u03B5(n): only n=1 gives 1, all others give 0', viz.width/2, viz.height - 12, viz.colors.yellow, 10);
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Compute \\((\\mu * \\text{id})(12)\\) directly from the definition.',
                    hint: 'Sum \\(\\mu(d) \\cdot (12/d)\\) over all divisors \\(d\\) of 12.',
                    solution: 'Divisors of 12: 1, 2, 3, 4, 6, 12. \\((\\mu * \\text{id})(12) = \\mu(1) \\cdot 12 + \\mu(2) \\cdot 6 + \\mu(3) \\cdot 4 + \\mu(4) \\cdot 3 + \\mu(6) \\cdot 2 + \\mu(12) \\cdot 1 = 12 - 6 - 4 + 0 + 2 + 0 = 4 = \\varphi(12)\\). This confirms \\(\\mu * \\text{id} = \\varphi\\).'
                },
                {
                    question: 'Prove the identity \\(\\Lambda * \\mathbf{1} = \\log\\) by evaluating both sides at \\(n = p^a\\).',
                    hint: 'The divisors of \\(p^a\\) are \\(1, p, p^2, \\ldots, p^a\\). Use \\(\\Lambda(p^k) = \\log p\\).',
                    solution: '\\(\\sum_{d \\mid p^a} \\Lambda(d) = \\Lambda(1) + \\Lambda(p) + \\Lambda(p^2) + \\cdots + \\Lambda(p^a) = 0 + \\log p + \\log p + \\cdots + \\log p = a \\log p = \\log(p^a)\\). Since both sides are multiplicative-like (technically: both sides agree on prime powers), the identity extends to all \\(n\\) via unique factorization.'
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
    <div class="env-title">The Fundamental Trick</div>
    <div class="env-body">
        <p>In many problems, we can compute the summatory function \\(g(n) = \\sum_{d \\mid n} f(d)\\) easily, but what we really want is \\(f(n)\\) itself. Mobius inversion lets us "undo" the summation: if \\(g = f * \\mathbf{1}\\), then \\(f = g * \\mu\\). This is analogous to multiplying by the inverse in ordinary algebra.</p>
    </div>
</div>

<div class="env-block theorem">
    <div class="env-title">Theorem 1.4 (Mobius Inversion Formula)</div>
    <div class="env-body">
        <p>If \\(g(n) = \\sum_{d \\mid n} f(d)\\) for all \\(n \\geq 1\\), then</p>
        \\[f(n) = \\sum_{d \\mid n} \\mu(d) \\, g\\!\\left(\\frac{n}{d}\\right) = \\sum_{d \\mid n} \\mu\\!\\left(\\frac{n}{d}\\right) g(d).\\]
        <p>Conversely, if this inversion holds, then \\(g = f * \\mathbf{1}\\).</p>
    </div>
</div>

<div class="env-block proof">
    <div class="env-title">Proof</div>
    <div class="env-body">
        <p>In the Dirichlet ring: \\(g = f * \\mathbf{1}\\). Convolving both sides with \\(\\mu = \\mathbf{1}^{-1}\\):</p>
        \\[g * \\mu = f * \\mathbf{1} * \\mu = f * \\varepsilon = f.\\]
    </div>
    <div class="qed">&marker;</div>
</div>

<h3>Applications</h3>

<div class="env-block example">
    <div class="env-title">Example: Recovering \\(\\varphi\\) from \\(\\text{id}\\)</div>
    <div class="env-body">
        <p>We know \\(\\sum_{d \\mid n} \\varphi(d) = n\\), i.e., \\(\\varphi * \\mathbf{1} = \\text{id}\\). By Mobius inversion:</p>
        \\[\\varphi(n) = \\sum_{d \\mid n} \\mu(d) \\cdot \\frac{n}{d} = n \\sum_{d \\mid n} \\frac{\\mu(d)}{d}.\\]
        <p>For \\(n = p_1^{a_1} \\cdots p_k^{a_k}\\), this gives the product formula:</p>
        \\[\\varphi(n) = n \\prod_{p \\mid n} \\left(1 - \\frac{1}{p}\\right).\\]
    </div>
</div>

<div class="env-block example">
    <div class="env-title">Example: Counting Primitive \\(n\\)-th Roots of Unity</div>
    <div class="env-body">
        <p>The number of primitive \\(n\\)-th roots of unity equals \\(\\varphi(n)\\). This follows from the fact that \\(\\sum_{d \\mid n} \\varphi(d) = n\\), which counts the total number of \\(n\\)-th roots of unity (primitive at each divisor level).</p>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-mobius-inversion"></div>
`,
            visualizations: [
                {
                    id: 'viz-mobius-inversion',
                    title: 'Mobius Inversion on the Divisor Lattice',
                    description: 'See a Hasse diagram of the divisor lattice of n. The forward direction sums f over divisors to get g. The inverse direction uses Mobius function weights to recover f from g. Toggle between forward and inverse.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 620, height: 420,
                            originX: 0, originY: 0, scale: 1
                        });

                        var nVal = 12;
                        var showInverse = false;

                        function factorize(n) {
                            var factors = {};
                            var d = 2;
                            while (d * d <= n) {
                                while (n % d === 0) { factors[d] = (factors[d]||0)+1; n = Math.floor(n/d); }
                                d++;
                            }
                            if (n > 1) factors[n] = (factors[n]||0)+1;
                            return factors;
                        }
                        function getDivisors(n) {
                            var divs = [];
                            for (var d = 1; d <= n; d++) { if (n % d === 0) divs.push(d); }
                            return divs;
                        }
                        function eulerPhi(n) {
                            if (n === 1) return 1;
                            var result = n;
                            var f = factorize(n);
                            for (var p in f) { result *= (1 - 1/parseInt(p)); }
                            return Math.round(result);
                        }
                        function mobius(n) {
                            if (n === 1) return 1;
                            var f = factorize(n);
                            for (var p in f) { if (f[p] > 1) return 0; }
                            return Object.keys(f).length % 2 === 0 ? 1 : -1;
                        }

                        VizEngine.createSlider(controls, 'n', 2, 30, nVal, 1, function(v) {
                            nVal = Math.round(v);
                            draw();
                        });

                        var invBtn = VizEngine.createButton(controls, 'Show: Forward (\u03C6*1 = id)', function() {
                            showInverse = !showInverse;
                            invBtn.textContent = showInverse ? 'Show: Inverse (id*\u03BC = \u03C6)' : 'Show: Forward (\u03C6*1 = id)';
                            draw();
                        });

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var divs = getDivisors(nVal);

                            // Title
                            if (!showInverse) {
                                viz.screenText('Forward: g(n) = \u03A3_{d|n} \u03C6(d) = n', viz.width/2, 18, viz.colors.blue, 14);
                            } else {
                                viz.screenText('Inverse: \u03C6(n) = \u03A3_{d|n} \u03BC(n/d) \u00B7 d', viz.width/2, 18, viz.colors.orange, 14);
                            }

                            // Compute positions for Hasse diagram
                            // Layer by number of prime factors (with multiplicity)
                            function omega(m) {
                                var f = factorize(m);
                                var s = 0;
                                for (var p in f) s += f[p];
                                return s;
                            }

                            var maxOmega = 0;
                            var layers = {};
                            divs.forEach(function(d) {
                                var o = omega(d);
                                if (o > maxOmega) maxOmega = o;
                                if (!layers[o]) layers[o] = [];
                                layers[o].push(d);
                            });

                            var leftM = 60;
                            var rightM = 200;
                            var topM = 45;
                            var botM = 40;
                            var plotH = viz.height - topM - botM;
                            var plotW = viz.width - leftM - rightM;

                            var positions = {};
                            for (var layer = 0; layer <= maxOmega; layer++) {
                                var nodes = layers[layer] || [];
                                var nNodes = nodes.length;
                                var y = topM + (layer / Math.max(1, maxOmega)) * plotH;
                                for (var i = 0; i < nNodes; i++) {
                                    var x = leftM + (i + 0.5) / nNodes * plotW;
                                    positions[nodes[i]] = [x, y];
                                }
                            }

                            // Draw edges (d1 -> d2 if d1|d2 and d2/d1 is prime)
                            for (var a = 0; a < divs.length; a++) {
                                for (var b = a + 1; b < divs.length; b++) {
                                    var d1 = divs[a], d2 = divs[b];
                                    if (d2 % d1 === 0) {
                                        var ratio = d2 / d1;
                                        var f = factorize(ratio);
                                        if (Object.keys(f).length === 1 && f[Object.keys(f)[0]] === 1) {
                                            // This is a cover relation
                                            ctx.strokeStyle = viz.colors.grid;
                                            ctx.lineWidth = 1;
                                            ctx.beginPath();
                                            ctx.moveTo(positions[d1][0], positions[d1][1]);
                                            ctx.lineTo(positions[d2][0], positions[d2][1]);
                                            ctx.stroke();
                                        }
                                    }
                                }
                            }

                            // Draw nodes with values
                            for (var k = 0; k < divs.length; k++) {
                                var d = divs[k];
                                var pos = positions[d];
                                var phi = eulerPhi(d);
                                var mu = mobius(nVal / d);

                                // Node circle
                                ctx.fillStyle = viz.colors.bg;
                                ctx.beginPath(); ctx.arc(pos[0], pos[1], 16, 0, Math.PI*2); ctx.fill();
                                ctx.strokeStyle = viz.colors.axis;
                                ctx.lineWidth = 1.5;
                                ctx.beginPath(); ctx.arc(pos[0], pos[1], 16, 0, Math.PI*2); ctx.stroke();

                                // Divisor label
                                ctx.fillStyle = viz.colors.white;
                                ctx.font = 'bold 11px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.textBaseline = 'middle';
                                ctx.fillText(d.toString(), pos[0], pos[1]);

                                // Value annotation
                                if (!showInverse) {
                                    // Show phi(d)
                                    ctx.fillStyle = viz.colors.blue;
                                    ctx.font = '9px -apple-system,sans-serif';
                                    ctx.textAlign = 'left';
                                    ctx.fillText('\u03C6=' + phi, pos[0] + 19, pos[1] - 3);
                                } else {
                                    // Show mu(n/d) * d
                                    var muVal = mu;
                                    var contrib = muVal * d;
                                    var col = muVal > 0 ? viz.colors.blue : (muVal < 0 ? viz.colors.red : viz.colors.text + '66');
                                    ctx.fillStyle = col;
                                    ctx.font = '9px -apple-system,sans-serif';
                                    ctx.textAlign = 'left';
                                    ctx.fillText('\u03BC(' + (nVal/d) + ')\u00B7' + d + '=' + contrib, pos[0] + 19, pos[1] - 3);
                                }
                            }

                            // Summary panel on right
                            var panelX = viz.width - 180;
                            var panelY = topM + 10;

                            if (!showInverse) {
                                viz.screenText('Forward sum:', panelX + 80, panelY, viz.colors.blue, 12);
                                var runSum = 0;
                                for (var m = 0; m < divs.length; m++) {
                                    var dd = divs[m];
                                    var phiD = eulerPhi(dd);
                                    runSum += phiD;
                                    ctx.fillStyle = viz.colors.text;
                                    ctx.font = '10px -apple-system,sans-serif';
                                    ctx.textAlign = 'left';
                                    ctx.fillText('\u03C6(' + dd + ') = ' + phiD, panelX + 10, panelY + 18 + m * 16);
                                }
                                ctx.fillStyle = viz.colors.yellow;
                                ctx.font = 'bold 11px -apple-system,sans-serif';
                                ctx.fillText('\u03A3 = ' + runSum + ' = n', panelX + 10, panelY + 22 + divs.length * 16);
                            } else {
                                viz.screenText('Inverse sum:', panelX + 80, panelY, viz.colors.orange, 12);
                                var invSum = 0;
                                for (var m2 = 0; m2 < divs.length; m2++) {
                                    var dd2 = divs[m2];
                                    var muV = mobius(nVal / dd2);
                                    var contrib2 = muV * dd2;
                                    invSum += contrib2;
                                    var col2 = muV > 0 ? viz.colors.blue : (muV < 0 ? viz.colors.red : viz.colors.text + '66');
                                    ctx.fillStyle = col2;
                                    ctx.font = '10px -apple-system,sans-serif';
                                    ctx.textAlign = 'left';
                                    ctx.fillText('\u03BC(' + (nVal/dd2) + ')\u00B7' + dd2 + ' = ' + contrib2, panelX + 10, panelY + 18 + m2 * 16);
                                }
                                ctx.fillStyle = viz.colors.yellow;
                                ctx.font = 'bold 11px -apple-system,sans-serif';
                                ctx.fillText('\u03A3 = ' + invSum + ' = \u03C6(' + nVal + ')', panelX + 10, panelY + 22 + divs.length * 16);
                            }
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Use Mobius inversion to derive the formula \\(\\varphi(n) = n \\prod_{p \\mid n}(1 - 1/p)\\).',
                    hint: 'Start from \\(\\varphi(n) = \\sum_{d \\mid n} \\mu(d) \\cdot n/d = n \\sum_{d \\mid n} \\mu(d)/d\\). The sum over \\(d\\) is multiplicative in \\(n\\), so evaluate it at prime powers.',
                    solution: 'From \\(\\varphi * \\mathbf{1} = \\text{id}\\), Mobius inversion gives \\(\\varphi = \\text{id} * \\mu\\), so \\(\\varphi(n) = \\sum_{d|n} \\mu(d)(n/d) = n \\sum_{d|n} \\mu(d)/d\\). The function \\(h(n) = \\sum_{d|n} \\mu(d)/d\\) is multiplicative (as a convolution of multiplicative functions). At \\(n = p^a\\): \\(h(p^a) = \\mu(1)/1 + \\mu(p)/p = 1 - 1/p\\). By multiplicativity: \\(h(n) = \\prod_{p|n}(1-1/p)\\), giving \\(\\varphi(n) = n\\prod_{p|n}(1-1/p)\\).'
                },
                {
                    question: 'If \\(f\\) is completely multiplicative, show that \\(f^{-1}(n) = \\mu(n)f(n)\\).',
                    hint: 'Verify \\((f \\cdot \\mu) * f = \\varepsilon\\) by checking on prime powers. Use the fact that \\(f(p^a) = f(p)^a\\).',
                    solution: 'We verify \\(\\sum_{d|n} f^{-1}(d) f(n/d) = \\varepsilon(n)\\). At \\(n = p^a\\): \\(\\sum_{k=0}^{a} \\mu(p^k)f(p^k) \\cdot f(p^{a-k}) = \\sum_{k=0}^{a} \\mu(p^k) f(p)^a\\) (using complete multiplicativity). Only \\(k=0,1\\) contribute (\\(\\mu(p^k)=0\\) for \\(k \\geq 2\\)): \\(f(p)^a - f(p)^a = 0\\) for \\(a \\geq 1\\), and at \\(a=0\\): \\(f(1) = 1\\). So \\(f^{-1} * f = \\varepsilon\\). \\(\\checkmark\\)'
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
    <div class="env-title">Why Weight Primes by \\(\\log p\\)?</div>
    <div class="env-body">
        <p>The prime counting function \\(\\pi(x) = |\\{p \\leq x : p \\text{ prime}\\}|\\) is the most natural way to measure the distribution of primes. But it is analytically awkward: it has jumps of size 1 at each prime and is hard to connect to complex analysis.</p>
        <p>The von Mangoldt function provides a smoother version: \\(\\Lambda(n) = \\log p\\) when \\(n\\) is a prime power \\(p^k\\), and 0 otherwise. The weight \\(\\log p\\) is precisely what makes the connection to the Riemann zeta function clean.</p>
    </div>
</div>

<h3>Connection to the Zeta Function</h3>

<p>The key identity is:</p>

\\[
-\\frac{\\zeta'(s)}{\\zeta(s)} = \\sum_{n=1}^{\\infty} \\frac{\\Lambda(n)}{n^s}, \\quad \\Re(s) > 1.
\\]

<div class="env-block proof">
    <div class="env-title">Derivation</div>
    <div class="env-body">
        <p>Start from the Euler product \\(\\zeta(s) = \\prod_p (1 - p^{-s})^{-1}\\). Taking logarithmic derivatives:</p>
        \\[\\frac{\\zeta'(s)}{\\zeta(s)} = -\\sum_p \\frac{\\log p}{p^s - 1} = -\\sum_p \\sum_{k=1}^{\\infty} \\frac{\\log p}{p^{ks}} = -\\sum_{n=1}^{\\infty} \\frac{\\Lambda(n)}{n^s}.\\]
    </div>
    <div class="qed">&marker;</div>
</div>

<h3>The Chebyshev Functions</h3>

<div class="env-block definition">
    <div class="env-title">Definition 1.9 (Chebyshev Functions)</div>
    <div class="env-body">
        \\[\\psi(x) = \\sum_{n \\leq x} \\Lambda(n), \\qquad \\theta(x) = \\sum_{p \\leq x} \\log p.\\]
    </div>
</div>

<p>The prime number theorem is equivalent to \\(\\psi(x) \\sim x\\), which is equivalent to \\(\\theta(x) \\sim x\\), which is equivalent to \\(\\pi(x) \\sim x / \\log x\\). The von Mangoldt function is the key to all three equivalences.</p>

<div class="env-block theorem">
    <div class="env-title">Theorem 1.5</div>
    <div class="env-body">
        <p>\\(\\psi(x) = \\theta(x) + O(\\sqrt{x})\\). In particular, \\(\\psi(x) \\sim x \\iff \\theta(x) \\sim x\\).</p>
    </div>
</div>

<div class="env-block proof">
    <div class="env-title">Proof sketch</div>
    <div class="env-body">
        <p>\\(\\psi(x) - \\theta(x) = \\sum_{p^k \\leq x, k \\geq 2} \\log p \\leq \\sum_{p \\leq \\sqrt{x}} \\lfloor \\log x / \\log p \\rfloor \\cdot \\log p \\leq \\sqrt{x} \\cdot \\log x\\).</p>
    </div>
    <div class="qed">&marker;</div>
</div>

<div class="viz-placeholder" data-viz="viz-mangoldt-spikes"></div>
`,
            visualizations: [
                {
                    id: 'viz-mangoldt-spikes',
                    title: 'von Mangoldt Spikes',
                    description: 'Lambda(n) appears as spikes at prime powers, colored by the underlying prime. The height log(p) is the same for all powers of p. The cumulative sum psi(x) is overlaid, showing the staircase approaching x (PNT).',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 620, height: 400,
                            originX: 0, originY: 0, scale: 1
                        });

                        var N = 100;
                        var showPsi = true;

                        VizEngine.createSlider(controls, 'N', 20, 300, N, 10, function(v) {
                            N = Math.round(v);
                            draw();
                        });

                        var psiBtn = VizEngine.createButton(controls, '\u03C8(x) overlay: ON', function() {
                            showPsi = !showPsi;
                            psiBtn.textContent = '\u03C8(x) overlay: ' + (showPsi ? 'ON' : 'OFF');
                            draw();
                        });

                        function factorize(n) {
                            var factors = {};
                            var d = 2;
                            while (d * d <= n) {
                                while (n % d === 0) { factors[d] = (factors[d]||0)+1; n = Math.floor(n/d); }
                                d++;
                            }
                            if (n > 1) factors[n] = (factors[n]||0)+1;
                            return factors;
                        }

                        function mangoldt(n) {
                            if (n <= 1) return { val: 0, prime: 0 };
                            var f = factorize(n);
                            var keys = Object.keys(f);
                            if (keys.length !== 1) return { val: 0, prime: 0 };
                            var p = parseInt(keys[0]);
                            return { val: Math.log(p), prime: p };
                        }

                        // Assign colors to small primes
                        var primeColors = {};
                        var smallPrimes = VizEngine.sievePrimes(20);
                        var colorList = [viz.colors.blue, viz.colors.teal, viz.colors.orange, viz.colors.green, viz.colors.purple, viz.colors.red, viz.colors.yellow, viz.colors.pink];
                        smallPrimes.forEach(function(p, i) { primeColors[p] = colorList[i % colorList.length]; });

                        function getPrimeColor(p) {
                            if (primeColors[p]) return primeColors[p];
                            // Hash for larger primes
                            var h = (p * 2654435761) >>> 0;
                            return colorList[h % colorList.length];
                        }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            viz.screenText('\u039B(n): von Mangoldt function spikes', viz.width/2, 18, viz.colors.white, 14);

                            var leftM = 50;
                            var rightM = 20;
                            var topM = 38;
                            var botM = 50;
                            var plotW = viz.width - leftM - rightM;
                            var plotH = viz.height - topM - botM;

                            var maxLogP = Math.log(N) * 1.1;
                            var maxPsi = 0;

                            // Compute
                            var data = [];
                            var psi = 0;
                            for (var n = 1; n <= N; n++) {
                                var m = mangoldt(n);
                                psi += m.val;
                                data.push({ n: n, val: m.val, prime: m.prime, psi: psi });
                                if (psi > maxPsi) maxPsi = psi;
                            }

                            var yMax = showPsi ? Math.max(maxLogP, maxPsi * 1.05) : maxLogP;

                            function toP(nn, yy) {
                                return [
                                    leftM + (nn - 1) / (N - 1) * plotW,
                                    topM + plotH - yy / yMax * plotH
                                ];
                            }

                            // X axis
                            ctx.strokeStyle = viz.colors.axis;
                            ctx.lineWidth = 1;
                            var xAxisY = topM + plotH;
                            ctx.beginPath(); ctx.moveTo(leftM, xAxisY); ctx.lineTo(leftM + plotW, xAxisY); ctx.stroke();

                            // Y gridlines
                            ctx.strokeStyle = viz.colors.grid;
                            ctx.lineWidth = 0.5;
                            var yStep = yMax > 20 ? Math.ceil(yMax / 5 / 10) * 10 : yMax > 5 ? 2 : 1;
                            for (var yg = yStep; yg < yMax; yg += yStep) {
                                var gy = topM + plotH - yg / yMax * plotH;
                                ctx.beginPath(); ctx.moveTo(leftM, gy); ctx.lineTo(leftM + plotW, gy); ctx.stroke();
                                ctx.fillStyle = viz.colors.text;
                                ctx.font = '9px -apple-system,sans-serif';
                                ctx.textAlign = 'right';
                                ctx.textBaseline = 'middle';
                                ctx.fillText(yg.toFixed(yg < 10 ? 1 : 0), leftM - 4, gy);
                            }

                            // Spikes
                            var barW = Math.max(1.5, plotW / N * 0.7);
                            for (var i = 0; i < data.length; i++) {
                                var d = data[i];
                                if (d.val > 0) {
                                    var pt = toP(d.n, d.val);
                                    var base = toP(d.n, 0);
                                    ctx.strokeStyle = getPrimeColor(d.prime);
                                    ctx.lineWidth = barW;
                                    ctx.beginPath();
                                    ctx.moveTo(pt[0], base[1]);
                                    ctx.lineTo(pt[0], pt[1]);
                                    ctx.stroke();

                                    // Dot at top
                                    ctx.fillStyle = getPrimeColor(d.prime);
                                    ctx.beginPath();
                                    ctx.arc(pt[0], pt[1], Math.min(3, barW), 0, Math.PI * 2);
                                    ctx.fill();
                                }
                            }

                            // Psi overlay
                            if (showPsi) {
                                ctx.strokeStyle = viz.colors.yellow;
                                ctx.lineWidth = 2;
                                ctx.beginPath();
                                for (var j = 0; j < data.length; j++) {
                                    var pp = toP(data[j].n, data[j].psi);
                                    if (j === 0) ctx.moveTo(pp[0], pp[1]);
                                    else ctx.lineTo(pp[0], pp[1]);
                                }
                                ctx.stroke();

                                // y = x line (PNT prediction)
                                ctx.strokeStyle = viz.colors.white + '55';
                                ctx.lineWidth = 1;
                                ctx.setLineDash([4, 4]);
                                ctx.beginPath();
                                ctx.moveTo(toP(1, 1)[0], toP(1, 1)[1]);
                                var endVal = Math.min(N, yMax);
                                ctx.lineTo(toP(endVal, endVal)[0], toP(endVal, endVal)[1]);
                                ctx.stroke();
                                ctx.setLineDash([]);

                                viz.screenText('\u03C8(x) (yellow) vs x (dashed)', viz.width/2, viz.height - 12, viz.colors.yellow, 10);
                            }

                            // X-axis labels
                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '9px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'top';
                            var xStep2 = Math.max(1, Math.floor(N / 10));
                            for (var xt = 1; xt <= N; xt += xStep2) {
                                var xp = toP(xt, 0);
                                ctx.fillText(xt.toString(), xp[0], xAxisY + 3);
                            }

                            // Legend: show first few primes
                            var legY = viz.height - 30;
                            ctx.font = '9px -apple-system,sans-serif';
                            ctx.textAlign = 'left';
                            var legPrimes = smallPrimes.slice(0, 6);
                            for (var lp = 0; lp < legPrimes.length; lp++) {
                                var lx = leftM + lp * 65;
                                ctx.fillStyle = getPrimeColor(legPrimes[lp]);
                                ctx.fillRect(lx, legY, 8, 8);
                                ctx.fillText('p=' + legPrimes[lp], lx + 11, legY + 7);
                            }
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Verify that \\(\\sum_{d \\mid 30} \\Lambda(d) = \\log 30\\).',
                    hint: 'List the divisors of 30 and identify which are prime powers.',
                    solution: 'Divisors of 30: 1, 2, 3, 5, 6, 10, 15, 30. Prime powers among these: 2, 3, 5 (all with \\(k=1\\)). So \\(\\sum_{d|30} \\Lambda(d) = \\Lambda(2) + \\Lambda(3) + \\Lambda(5) = \\log 2 + \\log 3 + \\log 5 = \\log 30\\). \\(\\checkmark\\)'
                },
                {
                    question: 'Show that \\(\\Lambda = \\mu * \\log\\), i.e., \\(\\Lambda(n) = \\sum_{d \\mid n} \\mu(d) \\log(n/d)\\).',
                    hint: 'We know \\(\\Lambda * \\mathbf{1} = \\log\\). Apply Mobius inversion.',
                    solution: 'From \\(\\log = \\Lambda * \\mathbf{1}\\), Mobius inversion gives \\(\\Lambda = \\log * \\mu = \\mu * \\log\\). Explicitly: \\(\\Lambda(n) = \\sum_{d|n} \\mu(d) \\log(n/d) = -\\sum_{d|n} \\mu(d) \\log d + \\log n \\sum_{d|n} \\mu(d)\\). The second term is \\(\\log n \\cdot \\varepsilon(n) = 0\\) for \\(n > 1\\). So \\(\\Lambda(n) = -\\sum_{d|n} \\mu(d) \\log d\\) for \\(n > 1\\).'
                }
            ]
        },

        // ================================================================
        // SECTION 7: From Functions to Averages
        // ================================================================
        {
            id: 'sec-bridge',
            title: 'From Functions to Averages',
            content: `
<h2>From Functions to Averages</h2>

<div class="env-block intuition">
    <div class="env-title">The Bridge to Analysis</div>
    <div class="env-body">
        <p>The arithmetic functions we have met are defined pointwise, but their real power emerges when we study their <em>average behavior</em>. The transition from pointwise to summatory is the bridge between algebra and analysis in number theory.</p>
    </div>
</div>

<p>Given an arithmetic function \\(f\\), its <strong>summatory function</strong> is:</p>

\\[
F(x) = \\sum_{n \\leq x} f(n).
\\]

<p>The central question of analytic number theory is: what is the asymptotic behavior of \\(F(x)\\) as \\(x \\to \\infty\\)?</p>

<h3>Classical Asymptotic Results</h3>

<div class="env-block theorem">
    <div class="env-title">Theorem 1.6 (Average Orders)</div>
    <div class="env-body">
        <ol>
            <li>\\(\\displaystyle\\sum_{n \\leq x} d(n) = x \\log x + (2\\gamma - 1)x + O(\\sqrt{x})\\), where \\(\\gamma\\) is Euler's constant.</li>
            <li>\\(\\displaystyle\\sum_{n \\leq x} \\sigma(n) = \\frac{\\pi^2}{12} x^2 + O(x \\log x)\\).</li>
            <li>\\(\\displaystyle\\sum_{n \\leq x} \\varphi(n) = \\frac{3}{\\pi^2} x^2 + O(x \\log x)\\).</li>
            <li>\\(\\displaystyle\\sum_{n \\leq x} \\Lambda(n) = x + O\\!\\left(x \\exp\\!\\left(-c\\sqrt{\\log x}\\right)\\right)\\) (Prime Number Theorem).</li>
        </ol>
    </div>
</div>

<p>Result (1) says that on average, a positive integer \\(n\\) has about \\(\\log n\\) divisors. Result (3) says that the "probability" that two randomly chosen integers are coprime is \\(6/\\pi^2 \\approx 0.608\\). Result (4) is the prime number theorem in von Mangoldt form.</p>

<h3>The Dirichlet Series Connection</h3>

<p>The tool that makes these estimates possible is the <strong>Dirichlet series</strong>:</p>

\\[
F(s) = \\sum_{n=1}^{\\infty} \\frac{f(n)}{n^s}.
\\]

<p>The connection between pointwise and summatory is mediated by Dirichlet series via <strong>Perron's formula</strong>:</p>

\\[
\\sum_{n \\leq x} f(n) = \\frac{1}{2\\pi i} \\int_{c - i\\infty}^{c + i\\infty} F(s) \\frac{x^s}{s} \\, ds.
\\]

<p>This integral representation converts summatory asymptotics into complex analysis: the behavior of \\(F(x)\\) depends on the analytic properties (poles, zeros, growth) of the Dirichlet series \\(F(s)\\). This is the subject of the next chapter.</p>

<div class="env-block remark">
    <div class="env-title">Looking Ahead</div>
    <div class="env-body">
        <p>Chapter 2 will introduce Dirichlet series systematically, prove the Euler product for multiplicative functions, and establish the analytic continuation of the Riemann zeta function. The arithmetic functions from this chapter are the building blocks; Dirichlet series are the mortar that binds them into a coherent theory.</p>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-function-scatter-summatory"></div>
`,
            visualizations: [],
            exercises: [
                {
                    question: 'Use the formula \\(\\sum_{n \\leq x} d(n) \\approx x \\log x\\) to estimate how many divisors the integers from 1 to 1000 have in total.',
                    hint: 'Plug in \\(x = 1000\\).',
                    solution: '\\(\\sum_{n \\leq 1000} d(n) \\approx 1000 \\cdot \\log 1000 \\approx 1000 \\cdot 6.908 \\approx 6908\\). The more precise formula gives \\(1000 \\log 1000 + (2\\gamma - 1) \\cdot 1000 \\approx 6908 + 154 = 7062\\). The exact value is 7069.'
                },
                {
                    question: 'The "probability" that a random integer is squarefree is \\(6/\\pi^2\\). Relate this to \\(\\sum_{n \\leq x} |\\mu(n)|\\).',
                    hint: 'An integer is squarefree iff \\(\\mu(n) \\neq 0\\), iff \\(|\\mu(n)| = 1\\).',
                    solution: '\\(|\\mu(n)| = 1\\) iff \\(n\\) is squarefree (no prime squared divides \\(n\\)). So \\(\\sum_{n \\leq x} |\\mu(n)|\\) counts squarefree integers up to \\(x\\). It is known that \\(\\sum_{n \\leq x} |\\mu(n)| = \\frac{6}{\\pi^2} x + O(\\sqrt{x})\\). Dividing by \\(x\\), the density of squarefree integers is \\(6/\\pi^2 \\approx 0.608\\).'
                }
            ]
        }
    ]
});
