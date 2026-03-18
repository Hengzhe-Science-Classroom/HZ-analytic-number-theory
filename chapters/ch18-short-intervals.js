window.CHAPTERS = window.CHAPTERS || [];
window.CHAPTERS.push({
    id: 'ch18',
    number: 18,
    title: 'Primes in Short Intervals',
    subtitle: 'How short can an interval be while still containing a prime?',
    sections: [

        // ================================================================
        // SECTION 1: Motivation
        // ================================================================
        {
            id: 'sec-motivation',
            title: 'Motivation',
            content: `
<h2>Motivation: Finding Primes in Short Intervals</h2>

<div class="env-block intuition">
    <div class="env-title">The Central Question</div>
    <div class="env-body">
        <p>The Prime Number Theorem tells us that primes near \\(x\\) are spaced on average \\(\\log x\\) apart. So the interval \\((x, x + \\log x]\\) contains about one prime on average. But what if we ask for a <em>guaranteed</em> prime in a much shorter interval? How short can the interval \\((x, x + x^\\theta]\\) be while still being certain to contain a prime for all large \\(x\\)?</p>
    </div>
</div>

<p>We write the problem in terms of a single exponent \\(\\theta\\): we want</p>

\\[
\\pi(x + x^\\theta) - \\pi(x) \\sim \\frac{x^\\theta}{\\log x} \\quad \\text{as } x \\to \\infty.
\\]

<p>Here \\(\\pi(x)\\) counts primes up to \\(x\\). The right-hand side is the heuristic count from the Prime Number Theorem applied locally. Establishing this asymptotic for a given \\(\\theta &lt; 1\\) is the challenge.</p>

<h3>Why This Is Hard</h3>

<p>For intervals of length \\(x\\) (i.e., \\(\\theta = 1\\)), the Prime Number Theorem itself suffices. As \\(\\theta\\) decreases, we need much finer control of the distribution of primes. The error term in the PNT, which is bounded by \\(O(x e^{-c\\sqrt{\\log x}})\\) unconditionally, swamps the count \\(x^\\theta / \\log x\\) for small \\(\\theta\\).</p>

<p>To push \\(\\theta\\) below \\(1\\), we need:
<ul>
    <li><strong>Zero-free regions</strong> for the Riemann zeta function: wider zero-free regions give better error terms.</li>
    <li><strong>Density estimates</strong>: bounds on how many zeros \\(\\zeta(s)\\) can have in a strip \\(\\sigma \\geq \\sigma_0\\).</li>
    <li><strong>Large sieve inequalities</strong>: tools to average over Dirichlet characters.</li>
</ul>
</p>

<div class="env-block definition">
    <div class="env-title">Definition (Short Interval)</div>
    <div class="env-body">
        <p>An interval \\((x, x+h]\\) is called a <strong>short interval</strong> if \\(h = o(x)\\). We parameterize \\(h = x^\\theta\\) for \\(\\theta \\in (0, 1)\\). The goal is to find the infimum of \\(\\theta\\) for which the interval always contains a prime for all sufficiently large \\(x\\).</p>
    </div>
</div>

<h3>What We Know and What We Want</h3>

<table style="width:100%;border-collapse:collapse;margin:1em 0;">
    <thead>
        <tr style="border-bottom:1px solid #30363d;">
            <th style="padding:6px 10px;text-align:left;color:#8b949e;">Result</th>
            <th style="padding:6px 10px;text-align:left;color:#8b949e;">Exponent \\(\\theta\\)</th>
            <th style="padding:6px 10px;text-align:left;color:#8b949e;">Year</th>
        </tr>
    </thead>
    <tbody>
        <tr style="border-bottom:1px solid #21262d;">
            <td style="padding:6px 10px;">Hoheisel (first sub-1)</td>
            <td style="padding:6px 10px;">\\(1 - 1/33000\\)</td>
            <td style="padding:6px 10px;">1930</td>
        </tr>
        <tr style="border-bottom:1px solid #21262d;">
            <td style="padding:6px 10px;">Ingham</td>
            <td style="padding:6px 10px;">\\(5/8\\)</td>
            <td style="padding:6px 10px;">1937</td>
        </tr>
        <tr style="border-bottom:1px solid #21262d;">
            <td style="padding:6px 10px;">Huxley</td>
            <td style="padding:6px 10px;">\\(7/12\\)</td>
            <td style="padding:6px 10px;">1972</td>
        </tr>
        <tr style="border-bottom:1px solid #21262d;">
            <td style="padding:6px 10px;">Baker-Harman-Pintz</td>
            <td style="padding:6px 10px;">\\(0.525\\)</td>
            <td style="padding:6px 10px;">2001</td>
        </tr>
        <tr>
            <td style="padding:6px 10px;">Conditional on RH</td>
            <td style="padding:6px 10px;">\\(1/2 + \\varepsilon\\)</td>
            <td style="padding:6px 10px;">classical</td>
        </tr>
    </tbody>
</table>

<p>Cramer's conjecture predicts that the maximal prime gap near \\(x\\) is \\(O((\\log x)^2)\\), which would correspond to \\(\\theta \\to 0\\) (polylogarithmic intervals). This remains entirely open.</p>

<div class="viz-placeholder" data-viz="viz-short-interval"></div>
`,
            visualizations: [
                {
                    id: 'viz-short-interval',
                    title: 'Short Interval Prime Counter',
                    description: 'Adjust the exponent \u03b8 to see the interval (x, x + x^\u03b8] and count primes in it. The dashed line shows the PNT prediction x^\u03b8 / log x.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, { width: 600, height: 360, originX: 60, originY: 300, scale: 1 });
                        var theta = 0.6;
                        var xBase = 1000;

                        VizEngine.createSlider(controls, '\u03b8', 0.51, 0.99, theta, 0.01, function(v) {
                            theta = v; draw();
                        });
                        VizEngine.createSlider(controls, 'x (base)', 500, 5000, xBase, 100, function(v) {
                            xBase = Math.round(v); draw();
                        });

                        var primes = VizEngine.sievePrimes(8000);

                        function primesInInterval(lo, hi) {
                            var count = 0;
                            for (var i = 0; i < primes.length; i++) {
                                if (primes[i] > lo && primes[i] <= hi) count++;
                                if (primes[i] > hi) break;
                            }
                            return count;
                        }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var h = Math.pow(xBase, theta);
                            var hi = xBase + h;
                            var count = primesInInterval(xBase, Math.min(hi, 7999));
                            var predicted = h / Math.log(xBase);

                            // Title
                            viz.screenText('Primes in (x, x + x^\u03b8]', viz.width / 2, 20, viz.colors.white, 15);

                            // Show interval on number line
                            var lineY = 130;
                            var pad = 60;
                            var lineLen = viz.width - 2 * pad;
                            // draw line
                            ctx.strokeStyle = viz.colors.axis; ctx.lineWidth = 2;
                            ctx.beginPath(); ctx.moveTo(pad, lineY); ctx.lineTo(pad + lineLen, lineY); ctx.stroke();

                            // Interval highlight
                            var displayRange = Math.max(h * 4, 200);
                            var scaleF = lineLen / displayRange;
                            var lo_screen = pad;
                            var hi_screen = Math.min(pad + h * scaleF, pad + lineLen);

                            ctx.fillStyle = viz.colors.blue + '33';
                            ctx.fillRect(lo_screen, lineY - 12, hi_screen - lo_screen, 24);
                            ctx.strokeStyle = viz.colors.blue; ctx.lineWidth = 1.5;
                            ctx.strokeRect(lo_screen, lineY - 12, hi_screen - lo_screen, 24);

                            // Mark primes in interval
                            for (var i = 0; i < primes.length; i++) {
                                var p = primes[i];
                                if (p <= xBase) continue;
                                if (p > xBase + displayRange) break;
                                var px = pad + (p - xBase) * scaleF;
                                if (px > pad + lineLen) break;
                                var inInterval = p <= hi;
                                ctx.fillStyle = inInterval ? viz.colors.orange : viz.colors.grid;
                                ctx.beginPath(); ctx.arc(px, lineY, inInterval ? 5 : 3, 0, Math.PI * 2); ctx.fill();
                            }

                            // Labels
                            ctx.fillStyle = viz.colors.text; ctx.font = '11px -apple-system,sans-serif';
                            ctx.textAlign = 'center'; ctx.textBaseline = 'top';
                            ctx.fillText('x = ' + xBase.toLocaleString(), lo_screen, lineY + 18);
                            ctx.fillText('x + x^\u03b8 \u2248 ' + Math.round(hi).toLocaleString(), Math.min(hi_screen, pad + lineLen - 60), lineY + 18);

                            // Stats box
                            var bx = 60, by = 195, bw = viz.width - 120, bh = 120;
                            ctx.fillStyle = '#1a1a40'; ctx.fillRect(bx, by, bw, bh);
                            ctx.strokeStyle = viz.colors.grid; ctx.lineWidth = 1; ctx.strokeRect(bx, by, bw, bh);

                            var col1 = bx + 30, col2 = bx + bw / 2 + 20;
                            ctx.font = '13px -apple-system,sans-serif'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle';

                            ctx.fillStyle = viz.colors.text; ctx.fillText('Interval length h = x^\u03b8:', col1, by + 22);
                            ctx.fillStyle = viz.colors.blue; ctx.fillText(Math.round(h).toLocaleString(), col2, by + 22);

                            ctx.fillStyle = viz.colors.text; ctx.fillText('Primes found (actual):', col1, by + 48);
                            ctx.fillStyle = viz.colors.orange; ctx.fillText(count.toString(), col2, by + 48);

                            ctx.fillStyle = viz.colors.text; ctx.fillText('PNT prediction h/log x:', col1, by + 74);
                            ctx.fillStyle = viz.colors.teal; ctx.fillText(predicted.toFixed(2), col2, by + 74);

                            ctx.fillStyle = viz.colors.text; ctx.fillText('Ratio actual/predicted:', col1, by + 100);
                            ctx.fillStyle = viz.colors.purple;
                            ctx.fillText(predicted > 0 ? (count / predicted).toFixed(2) : 'N/A', col2, by + 100);

                            viz.screenText('\u03b8 = ' + theta.toFixed(2) + '   Orange dots = primes in interval', viz.width / 2, 330, viz.colors.text, 11);
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'The PNT gives \\(\\pi(x) \\sim x/\\log x\\). Show that \\(\\pi(x + x^\\theta) - \\pi(x) \\sim x^\\theta / \\log x\\) follows formally from the PNT applied to both endpoints, provided \\(x^\\theta / \\log x \\to \\infty\\).',
                    hint: 'Write \\(\\pi(x+h) - \\pi(x) = \\frac{x+h}{\\log(x+h)} - \\frac{x}{\\log x} + \\text{error}\\). For \\(h = x^\\theta\\) with \\(\\theta < 1\\), expand \\(\\log(x+h) = \\log x + \\log(1 + h/x) \\approx \\log x\\).',
                    solution: 'Since \\(h = x^\\theta = o(x)\\), we have \\(\\log(x+h) = \\log x(1 + o(1))\\) so \\(\\frac{x+h}{\\log(x+h)} \\approx \\frac{x+h}{\\log x}\\). Thus \\(\\pi(x+h)-\\pi(x) \\approx h/\\log x = x^\\theta/\\log x\\). The PNT error term \\(O(xe^{-c\\sqrt{\\log x}})\\) is negligible when \\(h/\\log x \\to \\infty\\), i.e., when \\(x^\\theta\\) grows faster than any power of \\(\\log x\\).'
                }
            ]
        },

        // ================================================================
        // SECTION 2: Hoheisel and Beyond
        // ================================================================
        {
            id: 'sec-hoheisel',
            title: 'Hoheisel and Beyond',
            content: `
<h2>Hoheisel and Beyond</h2>

<p>In 1930, G. Hoheisel proved the first result of the form: for every sufficiently large \\(x\\), the interval \\((x, x + x^\\theta]\\) contains a prime for \\(\\theta = 1 - 1/33000\\). This breakthrough showed that gaps between consecutive primes are \\(o(x)\\), far shorter than a trivial bound.</p>

<h3>The Approach via the Zeta Function</h3>

<p>The key is the explicit formula connecting prime counts to zeros of \\(\\zeta(s)\\):</p>

\\[
\\psi(x) = x - \\sum_{\\rho} \\frac{x^\\rho}{\\rho} - \\frac{\\zeta'(0)}{\\zeta(0)} - \\frac{1}{2}\\log(1-x^{-2}),
\\]

<p>where \\(\\psi(x) = \\sum_{p^k \\leq x} \\log p\\) is Chebyshev's function and the sum runs over non-trivial zeros \\(\\rho = \\beta + i\\gamma\\) of \\(\\zeta\\). To bound</p>

\\[
\\psi(x+h) - \\psi(x) = h - \\sum_\\rho \\frac{(x+h)^\\rho - x^\\rho}{\\rho} + O(\\log^2 x),
\\]

<p>we need to bound the zero sum. If we know all zeros satisfy \\(\\beta \\leq 1 - \\delta\\) for some \\(\\delta > 0\\), then \\(|x^\\rho| \\leq x^{1-\\delta}\\) and the sum is bounded by terms of size \\(x^{1-\\delta}/|\\rho|\\). Hoheisel used a zero-free region and zero density estimates together.</p>

<div class="env-block theorem">
    <div class="env-title">Theorem (Hoheisel, 1930)</div>
    <div class="env-body">
        <p>There exists \\(\\theta_0 < 1\\) such that for all \\(x\\) sufficiently large and all \\(\\theta \\in [\\theta_0, 1]\\),</p>
        \\[\\pi(x + x^\\theta) - \\pi(x) \\sim \\frac{x^\\theta}{\\log x}.\\]
        <p>Hoheisel's original \\(\\theta_0 = 1 - 1/33000\\); subsequent refinements improved this rapidly.</p>
    </div>
</div>

<h3>The Role of Zero-Density Estimates</h3>

<p>Let \\(N(\\sigma, T)\\) denote the number of zeros \\(\\rho = \\beta + i\\gamma\\) of \\(\\zeta(s)\\) with \\(\\beta \\geq \\sigma\\) and \\(|\\gamma| \\leq T\\). A zero-density estimate of the form</p>

\\[
N(\\sigma, T) \\ll T^{A(1-\\sigma)}(\\log T)^B
\\]

<p>controls how many zeros can lie near the line \\(\\text{Re}(s) = 1\\). Combined with zero-free region estimates, one derives bounds on \\(\\psi(x+h) - \\psi(x) - h\\).</p>

<div class="env-block theorem">
    <div class="env-title">Theorem (Ingham, 1937)</div>
    <div class="env-body">
        <p>Using the density hypothesis \\(N(\\sigma, T) \\ll T^{2(1-\\sigma)}\\log^5 T\\), Ingham showed the asymptotic \\(\\pi(x+h) \\sim h/\\log x\\) holds for \\(h \\geq x^{5/8+\\varepsilon}\\), i.e., \\(\\theta_0 = 5/8\\).</p>
    </div>
</div>

<h3>The Huxley Barrier</h3>

<p>The density hypothesis \\(N(\\sigma,T) \\ll T^{2(1-\\sigma)+\\varepsilon}\\), if true, would give \\(\\theta_0 = 7/12\\). Huxley (1972) established this and proved:</p>

\\[
\\pi(x+h) - \\pi(x) \\sim \\frac{h}{\\log x}, \\quad h \\geq x^{7/12+\\varepsilon}.
\\]

<p>For nearly three decades, \\(\\theta = 7/12\\) was the record. Breaking the \\(7/12\\) barrier required entirely new methods: sieve theory and the combinatorial decomposition of primes.</p>

<div class="viz-placeholder" data-viz="viz-theta-timeline"></div>
`,
            visualizations: [
                {
                    id: 'viz-theta-timeline',
                    title: 'Historical Progress: The Exponent \u03b8 Over Time',
                    description: 'Each milestone is plotted as the best known \u03b8 against year. The dashed lines show key theoretical thresholds.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, { width: 620, height: 370, originX: 80, originY: 60, scale: 1 });

                        var milestones = [
                            { year: 1930, theta: 1 - 1/33000, label: 'Hoheisel', color: '#58a6ff' },
                            { year: 1937, theta: 5/8,          label: 'Ingham',   color: '#3fb9a0' },
                            { year: 1963, theta: 3/5,          label: 'Prachar',  color: '#d29922' },
                            { year: 1969, theta: 0.58,         label: 'Montgomery', color: '#bc8cff' },
                            { year: 1972, theta: 7/12,         label: 'Huxley',   color: '#f0883e' },
                            { year: 1996, theta: 0.535,        label: 'Baker-Harman', color: '#f85149' },
                            { year: 2001, theta: 0.525,        label: 'BHP',      color: '#f778ba' },
                        ];

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var pad = { l: 80, r: 40, t: 40, b: 60 };
                            var W = viz.width - pad.l - pad.r;
                            var H = viz.height - pad.t - pad.b;

                            var yearMin = 1925, yearMax = 2010;
                            var thetaMin = 0.50, thetaMax = 1.02;

                            function sx(yr) { return pad.l + (yr - yearMin) / (yearMax - yearMin) * W; }
                            function sy(th) { return pad.t + (1 - (th - thetaMin) / (thetaMax - thetaMin)) * H; }

                            // Grid
                            ctx.strokeStyle = viz.colors.grid; ctx.lineWidth = 0.5;
                            [0.5, 0.525, 0.583, 7/12, 0.625, 0.75, 1.0].forEach(function(th) {
                                var y = sy(th);
                                ctx.beginPath(); ctx.moveTo(pad.l, y); ctx.lineTo(pad.l + W, y); ctx.stroke();
                            });

                            // Axis
                            ctx.strokeStyle = viz.colors.axis; ctx.lineWidth = 1.5;
                            ctx.beginPath(); ctx.moveTo(pad.l, pad.t); ctx.lineTo(pad.l, pad.t + H); ctx.stroke();
                            ctx.beginPath(); ctx.moveTo(pad.l, pad.t + H); ctx.lineTo(pad.l + W, pad.t + H); ctx.stroke();

                            // Y labels
                            ctx.fillStyle = viz.colors.text; ctx.font = '10px -apple-system,sans-serif'; ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
                            [[1.0,'1'], [7/12,'7/12'], [5/8,'5/8'], [0.535,'0.535'], [0.525,'0.525'], [0.5,'1/2']].forEach(function(p) {
                                ctx.fillText(p[1], pad.l - 6, sy(p[0]));
                            });

                            // X labels
                            ctx.textAlign = 'center'; ctx.textBaseline = 'top';
                            [1930,1940,1950,1960,1970,1980,1990,2000,2010].forEach(function(yr) {
                                ctx.fillText(yr.toString(), sx(yr), pad.t + H + 6);
                            });

                            // Dashed horizontal reference lines
                            ctx.setLineDash([4,4]);
                            ctx.lineWidth = 1;
                            ctx.strokeStyle = viz.colors.purple + '88';
                            var rhY = sy(0.5);
                            ctx.beginPath(); ctx.moveTo(pad.l, rhY); ctx.lineTo(pad.l + W, rhY); ctx.stroke();
                            ctx.setLineDash([]);
                            ctx.fillStyle = viz.colors.purple + 'cc'; ctx.font = '10px -apple-system,sans-serif';
                            ctx.textAlign = 'left'; ctx.textBaseline = 'bottom';
                            ctx.fillText('RH limit: 1/2', pad.l + 4, rhY - 2);

                            // Step line connecting milestones
                            ctx.strokeStyle = viz.colors.blue + '55'; ctx.lineWidth = 1.5;
                            ctx.beginPath();
                            milestones.forEach(function(m, i) {
                                var x = sx(m.year), y = sy(m.theta);
                                if (i === 0) ctx.moveTo(x, y);
                                else {
                                    ctx.lineTo(sx(m.year), sy(milestones[i-1].theta));
                                    ctx.lineTo(x, y);
                                }
                            });
                            ctx.stroke();

                            // Points and labels
                            milestones.forEach(function(m) {
                                var x = sx(m.year), y = sy(m.theta);
                                ctx.fillStyle = m.color;
                                ctx.beginPath(); ctx.arc(x, y, 6, 0, Math.PI * 2); ctx.fill();
                                ctx.fillStyle = m.color; ctx.font = '11px -apple-system,sans-serif';
                                ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
                                ctx.fillText(m.label + ' (' + m.theta.toFixed(3) + ')', x + 9, y);
                            });

                            // Axis titles
                            ctx.save();
                            ctx.translate(14, pad.t + H/2);
                            ctx.rotate(-Math.PI/2);
                            ctx.fillStyle = viz.colors.text; ctx.font = '12px -apple-system,sans-serif';
                            ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                            ctx.fillText('\u03b8 (exponent)', 0, 0);
                            ctx.restore();

                            ctx.fillStyle = viz.colors.text; ctx.font = '12px -apple-system,sans-serif';
                            ctx.textAlign = 'center'; ctx.textBaseline = 'top';
                            ctx.fillText('Year', pad.l + W/2, pad.t + H + 30);

                            viz.screenText('Progress on primes in (x, x + x^\u03b8]', viz.width/2, 16, viz.colors.white, 14);
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'The zero-density estimate \\(N(\\sigma, T) \\ll T^{A(1-\\sigma)} \\log^B T\\) with \\(A = 2\\) is called the Density Hypothesis. Show that this implies \\(\\theta_0 = 7/12\\) via the following sketch: for \\(h = x^\\theta\\), the zero sum in the explicit formula contributes \\(\\ll h x^{(A-1)(1-\\sigma_0)} / (A-1)^{-1}\\) when zeros are grouped by height. What value of \\(\\sigma_0\\) and \\(A\\) gives the optimum?',
                    hint: 'You want the zero contribution to be \\(o(h)\\). Set \\(x^{(A-1)(1-\\sigma_0)} = x^{\\theta-1}\\) and choose \\(\\sigma_0\\) to make the density estimate tight.',
                    solution: 'With \\(A = 2\\), set \\(1 - \\sigma_0 = \\theta - 1\\), so \\(\\sigma_0 = 2 - \\theta\\). But \\(\\sigma_0 < 1\\) forces \\(\\theta > 1\\), which is wrong. The correct balancing argument works as follows: one splits the zeros by \\(\\sigma \\in [1/2, 1]\\) and uses \\(N(\\sigma, T) \\ll T^{2(1-\\sigma)}\\). Optimizing gives \\(\\theta = 1 - (1-\\sigma_0)/2\\); with the optimal \\(\\sigma_0\\), one derives \\(\\theta = 7/12\\).'
                }
            ]
        },

        // ================================================================
        // SECTION 3: Baker-Harman-Pintz (theta = 0.525)
        // ================================================================
        {
            id: 'sec-bhp',
            title: 'Baker-Harman-Pintz',
            content: `
<h2>Baker-Harman-Pintz: Breaking the \\(7/12\\) Barrier</h2>

<p>For nearly three decades, Huxley's \\(\\theta = 7/12 \\approx 0.5833\\) stood unchallenged. The key difficulty was that improvements in zero-density estimates alone seemed insufficient to go below \\(7/12\\) without new ideas.</p>

<h3>The Combinatorial Sieve Approach</h3>

<p>Baker and Harman (1996) introduced a new strategy: instead of trying to extract primes from the explicit formula, they used <strong>sieve methods</strong> to count primes in short intervals directly. The idea is to write</p>

\\[
\\pi(x+h) - \\pi(x) = S(\\mathcal{A}, \\mathcal{P}, z)
\\]

<p>where \\(\\mathcal{A} = \\{n : x < n \\leq x+h\\}\\) and \\(S(\\mathcal{A}, \\mathcal{P}, z)\\) is the sieve function counting integers in \\(\\mathcal{A}\\) not divisible by any prime \\(p \\leq z\\). By choosing \\(z = (x+h)^{1/2}\\), one sieves out all composites (Eratosthenes). But this is too costly.</p>

<p>The insight is to use a <em>weighted sieve</em> and combine it with information from exponential sums and character sums. Specifically, one decomposes the sum over \\(\\mathcal{A}\\) into Type I and Type II sums:</p>

<div class="env-block definition">
    <div class="env-title">Type I and Type II Sums</div>
    <div class="env-body">
        <p>A <strong>Type I sum</strong> has the form \\(\\sum_{m \\leq M} a_m \\#\\{n \\in \\mathcal{A} : m \\mid n\\}\\) for well-behaved coefficients \\(a_m\\).</p>
        <p>A <strong>Type II sum</strong> has the form \\(\\sum_{m \\sim M} \\sum_{n \\sim N} a_m b_n \\mathbf{1}[mn \\in \\mathcal{A}]\\) for \\(MN \\approx x\\) and general bounded \\(a_m, b_n\\).</p>
        <p>Type I sums are estimated using the distribution of residues. Type II sums are bounded using the large sieve or Vaughan's identity.</p>
    </div>
</div>

<h3>The BHP Result</h3>

<div class="env-block theorem">
    <div class="env-title">Theorem (Baker-Harman-Pintz, 2001)</div>
    <div class="env-body">
        <p>For all \\(x\\) sufficiently large,</p>
        \\[\\pi(x + x^{0.525}) - \\pi(x) \\geq \\frac{0.03 \\, x^{0.525}}{\\log x}.\\]
        <p>In particular, every interval \\((x, x + x^{0.525}]\\) contains a prime for all large \\(x\\).</p>
    </div>
</div>

<p>The proof combines:</p>
<ol>
    <li><strong>Harman's sieve</strong>: a flexible sieve that uses both upper and lower bounds to prove the existence of primes.</li>
    <li><strong>Exponential sum estimates</strong>: Weyl-type bounds on \\(\\sum_{n \\in \\mathcal{A}} e(f(n))\\) for smooth \\(f\\).</li>
    <li><strong>Zero-density results</strong>: to handle potential zeros of \\(\\zeta(s)\\) very close to the 1-line.</li>
</ol>

<p>Importantly, BHP does <em>not</em> prove the asymptotic \\(\\pi(x+h) \\sim h/\\log x\\); it only establishes a positive lower bound, \\(\\geq c \cdot h/\\log x\\) for a small constant \\(c = 0.03\\). The full asymptotic for \\(\\theta = 0.525\\) is still unknown.</p>

<div class="env-block remark">
    <div class="env-title">Remark: The Limit of the Method</div>
    <div class="env-body">
        <p>The BHP argument uses the Bombieri-Vinogradov theorem and zero-density estimates in a critical way. To push \\(\\theta\\) below \\(0.525\\), one would need either stronger zero-density estimates, stronger exponential sum bounds, or a fundamentally new approach. Current methods hit a barrier near \\(0.525\\).</p>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-interval-density"></div>
`,
            visualizations: [
                {
                    id: 'viz-interval-density',
                    title: 'Prime Density in Short Intervals',
                    description: 'For each base point x, plot the ratio (actual count) / (predicted count h/log x) for h = x^0.525. A ratio near 1 confirms the heuristic; large deviations reveal local fluctuations.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, { width: 620, height: 360, originX: 70, originY: 310, scale: 1 });
                        var theta = 0.525;
                        var numPoints = 80;

                        VizEngine.createSlider(controls, '\u03b8', 0.51, 0.70, theta, 0.005, function(v) {
                            theta = v; draw();
                        });

                        var primes = VizEngine.sievePrimes(20000);
                        // Build prime lookup
                        var primeSet = new Uint8Array(20001);
                        primes.forEach(function(p) { primeSet[p] = 1; });

                        function countInInterval(lo, hi) {
                            var cnt = 0;
                            var loInt = Math.floor(lo) + 1;
                            var hiInt = Math.floor(hi);
                            for (var n = loInt; n <= hiInt && n <= 20000; n++) {
                                if (primeSet[n]) cnt++;
                            }
                            return cnt;
                        }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var pad = { l: 70, r: 20, t: 30, b: 50 };
                            var W = viz.width - pad.l - pad.r;
                            var H = viz.height - pad.t - pad.b;

                            var xMin = 500, xMax = 15000;
                            var ratios = [];
                            for (var i = 0; i < numPoints; i++) {
                                var x = xMin + (xMax - xMin) * i / (numPoints - 1);
                                var h = Math.pow(x, theta);
                                var actual = countInInterval(x, x + h);
                                var pred = h / Math.log(x);
                                ratios.push({ x: x, ratio: pred > 0.5 ? actual / pred : null });
                            }

                            var validRatios = ratios.filter(function(r) { return r.ratio !== null; }).map(function(r) { return r.ratio; });
                            var rMin = Math.max(0, Math.min.apply(null, validRatios) - 0.1);
                            var rMax = Math.max.apply(null, validRatios) + 0.1;

                            function sx(x) { return pad.l + (x - xMin) / (xMax - xMin) * W; }
                            function sy(r) { return pad.t + (1 - (r - rMin) / (rMax - rMin)) * H; }

                            // Grid at ratio = 1
                            var y1 = sy(1);
                            ctx.strokeStyle = viz.colors.teal + '66'; ctx.lineWidth = 1; ctx.setLineDash([5,5]);
                            ctx.beginPath(); ctx.moveTo(pad.l, y1); ctx.lineTo(pad.l + W, y1); ctx.stroke();
                            ctx.setLineDash([]);
                            ctx.fillStyle = viz.colors.teal; ctx.font = '10px -apple-system,sans-serif';
                            ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
                            ctx.fillText('1.00', pad.l - 4, y1);

                            // Axes
                            ctx.strokeStyle = viz.colors.axis; ctx.lineWidth = 1.5;
                            ctx.beginPath(); ctx.moveTo(pad.l, pad.t); ctx.lineTo(pad.l, pad.t + H); ctx.stroke();
                            ctx.beginPath(); ctx.moveTo(pad.l, pad.t + H); ctx.lineTo(pad.l + W, pad.t + H); ctx.stroke();

                            // Y axis labels
                            ctx.fillStyle = viz.colors.text; ctx.font = '10px -apple-system,sans-serif'; ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
                            var steps = 5;
                            for (var s = 0; s <= steps; s++) {
                                var rv = rMin + (rMax - rMin) * s / steps;
                                ctx.fillText(rv.toFixed(1), pad.l - 4, sy(rv));
                            }

                            // X axis labels
                            ctx.textAlign = 'center'; ctx.textBaseline = 'top';
                            [2000, 5000, 8000, 11000, 14000].forEach(function(xv) {
                                if (xv >= xMin && xv <= xMax) {
                                    ctx.fillText(xv.toLocaleString(), sx(xv), pad.t + H + 4);
                                }
                            });

                            // Plot ratios
                            ratios.forEach(function(r) {
                                if (r.ratio === null) return;
                                var x = sx(r.x), y = sy(r.ratio);
                                var dev = Math.abs(r.ratio - 1);
                                var col = dev < 0.3 ? viz.colors.blue : (dev < 0.6 ? viz.colors.orange : viz.colors.red);
                                ctx.fillStyle = col;
                                ctx.beginPath(); ctx.arc(x, y, 3, 0, Math.PI * 2); ctx.fill();
                            });

                            // Axis titles
                            ctx.save();
                            ctx.translate(14, pad.t + H/2);
                            ctx.rotate(-Math.PI/2);
                            ctx.fillStyle = viz.colors.text; ctx.font = '11px -apple-system,sans-serif';
                            ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                            ctx.fillText('actual / predicted', 0, 0);
                            ctx.restore();
                            ctx.fillStyle = viz.colors.text; ctx.font = '11px -apple-system,sans-serif';
                            ctx.textAlign = 'center'; ctx.textBaseline = 'top';
                            ctx.fillText('x', pad.l + W/2, pad.t + H + 28);

                            viz.screenText('\u03b8 = ' + theta.toFixed(3) + '  |  (actual primes) / (h/log x)', viz.width/2, 12, viz.colors.white, 13);
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Harman\'s sieve gives a lower bound \\(\\pi(x+h) - \\pi(x) \\geq c \\cdot h/\\log x\\) for \\(h = x^{0.525}\\) with constant \\(c = 0.03\\). Why does the method not automatically yield the asymptotic (i.e., \\(c \\to 1\\) as \\(x \\to \\infty\\))?',
                    hint: 'A sieve lower bound comes from carefully chosen "weights" that detect primes but undercounts them. What prevents these weights from being exact?',
                    solution: 'Sieve lower bounds use non-negative weights that underapproximate the prime indicator: \\(w(n) \\leq \\mathbf{1}[n \\text{ prime}]\\), with equality avoided to keep the sieve sum positive. The "parity problem" prevents sieves from distinguishing primes from products of two large primes without additional input. The BHP result requires exponential sum estimates to handle the "difficult" part of the sum where the sieve alone is insufficient, but these estimates only control the contribution within a certain range. The result is a fixed lower bound constant, not an asymptotic.'
                },
                {
                    question: 'State why Bombieri-Vinogradov is used in the BHP argument. What role does the modulus \\(q \\leq x^{1/2}(\\log x)^{-A}\\) play?',
                    hint: 'The Bombieri-Vinogradov theorem replaces GRH for averages over arithmetic progressions.',
                    solution: 'Bombieri-Vinogradov states that \\(\\sum_{q \\leq Q} \\max_{(a,q)=1} |\\psi(x; q, a) - x/\\phi(q)| \\ll x (\\log x)^{-A}\\) for \\(Q = x^{1/2}(\\log x)^{-B}\\). In the BHP argument, one needs to control primes in arithmetic progressions within the short interval. Bombieri-Vinogradov provides GRH-quality control on average over moduli \\(q \\leq x^{1/2-\\varepsilon}\\), which is exactly the range needed for the Type I sums in the sieve decomposition.'
                }
            ]
        },

        // ================================================================
        // SECTION 4: Conditional Results (RH)
        // ================================================================
        {
            id: 'sec-conditional',
            title: 'Conditional Results',
            content: `
<h2>Conditional Results: The Riemann Hypothesis</h2>

<p>Under the Riemann Hypothesis (all non-trivial zeros of \\(\\zeta(s)\\) lie on \\(\\text{Re}(s) = 1/2\\)), the distribution of primes is much better controlled. We can take \\(h\\) as short as \\(x^{1/2+\\varepsilon}\\).</p>

<h3>The Conditional Explicit Formula</h3>

<p>If RH holds, every non-trivial zero satisfies \\(|x^\\rho| = x^{1/2}\\). The error term in the explicit formula becomes:</p>

\\[
\\psi(x+h) - \\psi(x) - h = -\\sum_\\rho \\frac{(x+h)^\\rho - x^\\rho}{\\rho} + O(\\log^2 x).
\\]

<p>Each term satisfies</p>

\\[
\\left| \\frac{(x+h)^\\rho - x^\\rho}{\\rho} \\right| \\ll \\frac{h \\cdot x^{-1/2}}{|\\rho|} \cdot x^{1/2} = \\frac{h}{|\\rho|}.
\\]

<p>Wait, more carefully: for \\(h \\ll x\\) and \\(\\rho = 1/2 + i\\gamma\\),</p>

\\[
(x+h)^\\rho - x^\\rho = \\rho \\int_x^{x+h} t^{\\rho-1} dt = O(h x^{-1/2}),
\\]

<p>so the contribution from zero \\(\\rho\\) is \\(O(h x^{-1/2} / |\\rho|)\\). Summing over zeros with \\(|\\gamma| \\leq T\\) (and there are \\(O(T \\log T)\\) such zeros), the total error is \\(O(h x^{-1/2} \\cdot T \\log T + x^{1/2} \\log x / T)\\). Choosing \\(T = x^{1/2} / h\\) balances these, giving error \\(O(x^{1/2} \\log^2 x)\\).</p>

<div class="env-block theorem">
    <div class="env-title">Theorem (RH Conditional)</div>
    <div class="env-body">
        <p>Assuming RH, for any \\(\\varepsilon > 0\\) and all \\(x\\) sufficiently large,</p>
        \\[\\pi(x + x^{1/2+\\varepsilon}) - \\pi(x) \\sim \\frac{x^{1/2+\\varepsilon}}{\\log x}.\\]
        <p>In particular, every interval \\((x, x + x^{1/2+\\varepsilon}]\\) contains a prime.</p>
    </div>
</div>

<h3>What RH Cannot Give</h3>

<p>Remarkably, RH alone does not prove the existence of a prime in \\((x, x + C\\sqrt{x}]\\). This requires the interval length \\(h \\gg x^{1/2+\\varepsilon}\\) for some fixed \\(\\varepsilon > 0\\). The bound \\(h = C\\sqrt{x}\\) corresponds to \\(\\varepsilon = 0\\) and lies just outside what the explicit formula technique yields. To go below \\(\\theta = 1/2\\), one would need to disprove the existence of Siegel zeros or prove something beyond RH.</p>

<div class="env-block definition">
    <div class="env-title">Lindelof Hypothesis</div>
    <div class="env-body">
        <p>The <strong>Lindelof Hypothesis</strong> states that \\(\\zeta(1/2 + it) = O(|t|^\\varepsilon)\\) for all \\(\\varepsilon > 0\\). This implies the Density Hypothesis \\(N(\\sigma, T) \\ll T^{2(1-\\sigma)+\\varepsilon}\\), which in turn gives \\(\\theta_0 = 7/12\\). So LH is weaker than RH for this application.</p>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-conditional-comparison"></div>
`,
            visualizations: [
                {
                    id: 'viz-conditional-comparison',
                    title: 'Unconditional vs Conditional: Comparing Error Terms',
                    description: 'Visualize how the prime counting error |\u03c8(x+h) - \u03c8(x) - h| scales under different assumptions as x grows. Unconditional gives O(x exp(-c sqrt(log x))); RH gives O(x^{1/2} log^2 x).',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, { width: 620, height: 370, originX: 80, originY: 50, scale: 1 });

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var pad = { l: 80, r: 30, t: 40, b: 60 };
                            var W = viz.width - pad.l - pad.r;
                            var H = viz.height - pad.t - pad.b;

                            var logXMin = 3, logXMax = 20;
                            // For comparison, show error bound / h as function of log x
                            // h = x^theta with theta = 0.6 (fixed for display)
                            var theta = 0.6;

                            // Unconditional error / h: O( x^{1-theta} * exp(-c sqrt(log x)) )
                            // RH error / h: O( x^{0.5-theta} * log^2 x )
                            // BHP: h = x^{0.525}, show ratio near 0

                            function unconditional(logX) {
                                var c = 0.1;
                                return Math.exp((1 - theta) * logX * Math.LN10 - c * Math.sqrt(logX * Math.LN10));
                            }
                            function rhBound(logX) {
                                return Math.exp((0.5 - theta) * logX * Math.LN10) * Math.pow(logX * Math.LN10, 2);
                            }

                            var samples = 200;
                            var maxVal = 0;
                            for (var i = 0; i < samples; i++) {
                                var lx = logXMin + (logXMax - logXMin) * i / samples;
                                maxVal = Math.max(maxVal, unconditional(lx), rhBound(lx));
                            }

                            function sy(v) { return pad.t + (1 - Math.max(0, Math.min(1, v / maxVal))) * H; }
                            function sx(lx) { return pad.l + (lx - logXMin) / (logXMax - logXMin) * W; }

                            // Grid
                            ctx.strokeStyle = viz.colors.grid; ctx.lineWidth = 0.5;
                            for (var p = 0; p <= 4; p++) {
                                var yy = pad.t + H * p / 4;
                                ctx.beginPath(); ctx.moveTo(pad.l, yy); ctx.lineTo(pad.l + W, yy); ctx.stroke();
                            }

                            // Axes
                            ctx.strokeStyle = viz.colors.axis; ctx.lineWidth = 1.5;
                            ctx.beginPath(); ctx.moveTo(pad.l, pad.t); ctx.lineTo(pad.l, pad.t + H); ctx.stroke();
                            ctx.beginPath(); ctx.moveTo(pad.l, pad.t + H); ctx.lineTo(pad.l + W, pad.t + H); ctx.stroke();

                            // x-axis labels
                            ctx.fillStyle = viz.colors.text; ctx.font = '10px -apple-system,sans-serif';
                            ctx.textAlign = 'center'; ctx.textBaseline = 'top';
                            [5, 8, 11, 14, 17, 20].forEach(function(lx) {
                                ctx.fillText('10^' + lx, sx(lx), pad.t + H + 4);
                            });

                            // Unconditional curve
                            ctx.strokeStyle = viz.colors.orange; ctx.lineWidth = 2;
                            ctx.beginPath();
                            var started = false;
                            for (var i = 0; i <= samples; i++) {
                                var lx = logXMin + (logXMax - logXMin) * i / samples;
                                var v = unconditional(lx);
                                if (!isFinite(v)) { started = false; continue; }
                                var x = sx(lx), y = sy(v);
                                if (!started) { ctx.moveTo(x, y); started = true; } else ctx.lineTo(x, y);
                            }
                            ctx.stroke();

                            // RH curve
                            ctx.strokeStyle = viz.colors.blue; ctx.lineWidth = 2; started = false;
                            ctx.beginPath();
                            for (var i = 0; i <= samples; i++) {
                                var lx = logXMin + (logXMax - logXMin) * i / samples;
                                var v = rhBound(lx);
                                if (!isFinite(v)) { started = false; continue; }
                                var x = sx(lx), y = sy(v);
                                if (!started) { ctx.moveTo(x, y); started = true; } else ctx.lineTo(x, y);
                            }
                            ctx.stroke();

                            // Zero line
                            ctx.strokeStyle = viz.colors.teal + '88'; ctx.lineWidth = 1; ctx.setLineDash([4,4]);
                            ctx.beginPath(); ctx.moveTo(pad.l, pad.t + H); ctx.lineTo(pad.l + W, pad.t + H); ctx.stroke();
                            ctx.setLineDash([]);

                            // Legend
                            var legX = pad.l + 20, legY = pad.t + 20;
                            ctx.fillStyle = viz.colors.orange; ctx.fillRect(legX, legY, 20, 3);
                            ctx.fillStyle = viz.colors.orange; ctx.font = '11px -apple-system,sans-serif'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
                            ctx.fillText('Unconditional error bound / h', legX + 26, legY + 2);
                            ctx.fillStyle = viz.colors.blue; ctx.fillRect(legX, legY + 20, 20, 3);
                            ctx.fillStyle = viz.colors.blue;
                            ctx.fillText('RH error bound / h', legX + 26, legY + 22);

                            ctx.fillStyle = viz.colors.text;
                            ctx.fillText('(h = x^' + theta.toFixed(2) + ',  y-axis = relative error,  lower is better)', pad.l + W/2, pad.t + H + 38);
                            ctx.textAlign = 'center'; ctx.textBaseline = 'top';

                            viz.screenText('Error in prime count: unconditional vs RH', viz.width/2, 16, viz.colors.white, 14);
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Assuming RH, show that the \\(k\\)-th prime \\(p_k\\) satisfies \\(p_{k+1} - p_k = O(p_k^{1/2} \\log p_k)\\). Does this follow from just knowing that \\((x, x + x^{1/2+\\varepsilon}]\\) always contains a prime?',
                    hint: 'If \\((x, x + x^{1/2+\\varepsilon}]\\) contains a prime for all large \\(x\\), what does this say about the gap \\(p_{n+1} - p_n\\) when \\(p_n = x\\)?',
                    solution: 'Set \\(x = p_n\\). The interval \\((p_n, p_n + p_n^{1/2+\\varepsilon}]\\) contains a prime, so the next prime \\(p_{n+1}\\) satisfies \\(p_{n+1} \\leq p_n + p_n^{1/2+\\varepsilon}\\), giving \\(p_{n+1} - p_n \\leq p_n^{1/2+\\varepsilon}\\). This holds for every \\(\\varepsilon > 0\\) but not for \\(\\varepsilon = 0\\); the gap bound \\(O(p_n^{1/2} \\log p_n)\\) stated is actually Cramer\'s conditional conjecture, stronger than what the interval result gives.'
                }
            ]
        },

        // ================================================================
        // SECTION 5: Cramer's Conjecture
        // ================================================================
        {
            id: 'sec-cramer',
            title: "Cramer's Conjecture",
            content: `
<h2>Cramer's Conjecture and the Random Model</h2>

<p>In 1936, Harald Cramer proposed a probabilistic model for the primes that has guided intuition ever since. The idea: think of an integer \\(n\\) as "prime" with probability \\(1/\\log n\\) (the empirical density), independently for each \\(n\\). What does this random model predict about gaps?</p>

<h3>The Random Model</h3>

<p>Let \\(X_n\\) be independent Bernoulli random variables with \\(P(X_n = 1) = 1/\\log n\\). The "random primes" are \\(\\mathcal{P} = \\{n : X_n = 1\\}\\). The expected gap after position \\(N\\) is \\(\\sum_{k > N} k \\cdot (1/\\log k) \\cdot \\prod_{j=N+1}^{k-1} (1 - 1/\\log j)\\), which to leading order is \\(\\log N\\).</p>

<p>For the maximum gap up to \\(N\\), extreme value theory for geometric random variables gives:</p>

\\[
G_N := \\max_{p \\leq N} (p_{\\text{next}} - p) \\sim (\\log N)^2 \\quad \\text{(in probability)}.
\\]

<div class="env-block theorem">
    <div class="env-title">Cramer's Conjecture (1936)</div>
    <div class="env-body">
        <p>\\[\\limsup_{n \\to \\infty} \\frac{p_{n+1} - p_n}{(\\log p_n)^2} = 1.\\]</p>
        <p>That is, the maximal prime gap near \\(x\\) is \\((1+o(1))(\\log x)^2\\).</p>
    </div>
</div>

<h3>Granville's Refinement</h3>

<p>Granville (1995) pointed out that the Cramer model ignores the divisibility constraints on primes (primes are not divisible by 2, 3, 5, ...). A corrected model predicts the constant \\(2e^{-\\gamma} \\approx 1.1229\\) instead of 1:</p>

\\[
\\limsup_{n \\to \\infty} \\frac{p_{n+1} - p_n}{(\\log p_n)^2} \\geq 2e^{-\\gamma} \\approx 1.1229,
\\]

<p>where \\(\\gamma \\approx 0.5772\\) is the Euler-Mascheroni constant.</p>

<h3>What Is Known Unconditionally</h3>

<p>Unconditionally, the best known result is \\(p_{n+1} - p_n = O(p_n^{0.525})\\) (from BHP). This is vastly larger than \\((\\log p_n)^2\\). Even under RH, the best is \\(p_{n+1} - p_n = O(p_n^{1/2} \\log p_n)\\), still far from \\((\\log p_n)^2\\). Cramer's conjecture is completely open.</p>

<div class="env-block remark">
    <div class="env-title">The Firoozbakht Conjecture</div>
    <div class="env-body">
        <p>In 1982, Firoozbakht conjectured that \\(p_n^{1/n}\\) is strictly decreasing, i.e., \\(p_{n+1} &lt; p_n^{1+1/n}\\). This would imply \\(p_{n+1} - p_n &lt; (\\log p_n)^2 - \\log p_n + 1\\), slightly stronger than Cramer. Numerical evidence supports it up to \\(4 \\times 10^{18}\\) but it remains unproven.</p>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-cramer-model"></div>
`,
            visualizations: [
                {
                    id: 'viz-cramer-model',
                    title: "Cramer's Random Model vs Actual Primes",
                    description: "Compare gaps between actual primes with gaps from Cramer's random model (each integer independently 'prime' with probability 1/log n). Both should scale like (log x)^2.",
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, { width: 620, height: 370, originX: 70, originY: 50, scale: 1 });
                        var seed = 42;

                        function lcgRand(s) { return (s * 1664525 + 1013904223) & 0xffffffff; }

                        function generateRandomPrimes(maxN, initSeed) {
                            var gaps = [];
                            var s = initSeed;
                            var lastPrime = 2;
                            for (var n = 3; n <= maxN; n++) {
                                s = lcgRand(s);
                                var prob = 1 / Math.log(n);
                                var u = ((s >>> 0) / 0xffffffff);
                                if (u < prob) {
                                    gaps.push({ x: n, gap: n - lastPrime });
                                    lastPrime = n;
                                }
                            }
                            return gaps;
                        }

                        var realPrimes = VizEngine.sievePrimes(5000);
                        var realGaps = [];
                        for (var i = 1; i < realPrimes.length; i++) {
                            realGaps.push({ x: realPrimes[i], gap: realPrimes[i] - realPrimes[i-1] });
                        }

                        var randGaps = generateRandomPrimes(5000, seed);

                        VizEngine.createButton(controls, 'New random seed', function() {
                            seed = (seed * 6364136223846793005 + 1442695040888963407) | 0;
                            seed = Math.abs(seed) % 100000 + 1;
                            randGaps = generateRandomPrimes(5000, seed);
                            draw();
                        });

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var pad = { l: 70, r: 20, t: 40, b: 55 };
                            var W = viz.width - pad.l - pad.r;
                            var H = viz.height - pad.t - pad.b;

                            var xMax = 5000;
                            var gapMax = 0;
                            realGaps.forEach(function(g) { gapMax = Math.max(gapMax, g.gap); });
                            randGaps.forEach(function(g) { gapMax = Math.max(gapMax, g.gap); });
                            gapMax = gapMax * 1.1;

                            function sx(x) { return pad.l + x / xMax * W; }
                            function sy(g) { return pad.t + (1 - g / gapMax) * H; }

                            // Cramer prediction curve: (log x)^2
                            ctx.strokeStyle = viz.colors.yellow + '99'; ctx.lineWidth = 1.5; ctx.setLineDash([6,4]);
                            ctx.beginPath();
                            for (var xi = 10; xi <= xMax; xi += 20) {
                                var pred = Math.pow(Math.log(xi), 2);
                                var x = sx(xi), y = sy(pred);
                                if (xi === 10) ctx.moveTo(x, y); else ctx.lineTo(x, y);
                            }
                            ctx.stroke(); ctx.setLineDash([]);

                            // Random model gaps
                            randGaps.forEach(function(g) {
                                var x = sx(g.x), y = sy(g.gap);
                                ctx.fillStyle = viz.colors.teal + '77';
                                ctx.beginPath(); ctx.arc(x, y, 2, 0, Math.PI * 2); ctx.fill();
                            });

                            // Real prime gaps
                            realGaps.forEach(function(g) {
                                var x = sx(g.x), y = sy(g.gap);
                                ctx.fillStyle = viz.colors.orange + 'aa';
                                ctx.beginPath(); ctx.arc(x, y, 2.5, 0, Math.PI * 2); ctx.fill();
                            });

                            // Axes
                            ctx.strokeStyle = viz.colors.axis; ctx.lineWidth = 1.5;
                            ctx.beginPath(); ctx.moveTo(pad.l, pad.t); ctx.lineTo(pad.l, pad.t + H); ctx.stroke();
                            ctx.beginPath(); ctx.moveTo(pad.l, pad.t + H); ctx.lineTo(pad.l + W, pad.t + H); ctx.stroke();

                            // Labels
                            ctx.fillStyle = viz.colors.text; ctx.font = '10px -apple-system,sans-serif';
                            ctx.textAlign = 'center'; ctx.textBaseline = 'top';
                            [1000, 2000, 3000, 4000, 5000].forEach(function(xv) {
                                ctx.fillText(xv.toLocaleString(), sx(xv), pad.t + H + 4);
                            });
                            ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
                            [0, 20, 40, 60, 80].forEach(function(g) {
                                if (g <= gapMax) ctx.fillText(g.toString(), pad.l - 4, sy(g));
                            });

                            // Legend
                            var legX = pad.l + 20, legY = pad.t + 16;
                            ctx.fillStyle = viz.colors.orange + 'aa'; ctx.beginPath(); ctx.arc(legX + 5, legY, 4, 0, Math.PI*2); ctx.fill();
                            ctx.fillStyle = viz.colors.orange; ctx.font = '11px -apple-system,sans-serif'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
                            ctx.fillText('Actual prime gaps', legX + 14, legY);
                            ctx.fillStyle = viz.colors.teal + '99'; ctx.beginPath(); ctx.arc(legX + 5, legY + 18, 4, 0, Math.PI*2); ctx.fill();
                            ctx.fillStyle = viz.colors.teal;
                            ctx.fillText("Cramer random model gaps", legX + 14, legY + 18);
                            ctx.strokeStyle = viz.colors.yellow + '99'; ctx.lineWidth = 1.5; ctx.setLineDash([5,4]);
                            ctx.beginPath(); ctx.moveTo(legX, legY + 36); ctx.lineTo(legX + 20, legY + 36); ctx.stroke(); ctx.setLineDash([]);
                            ctx.fillStyle = viz.colors.yellow;
                            ctx.fillText('(log x)^2 prediction', legX + 26, legY + 36);

                            ctx.fillStyle = viz.colors.text; ctx.font = '11px -apple-system,sans-serif'; ctx.textAlign = 'center';
                            ctx.fillText('x', pad.l + W/2, pad.t + H + 30);

                            ctx.save(); ctx.translate(14, pad.t + H/2); ctx.rotate(-Math.PI/2);
                            ctx.fillStyle = viz.colors.text; ctx.font = '11px -apple-system,sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                            ctx.fillText('gap size', 0, 0); ctx.restore();

                            viz.screenText("Cramer's Random Model vs Actual Prime Gaps", viz.width/2, 16, viz.colors.white, 14);
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: "Using Cramer's model where each \\(n\\) is independently prime with probability \\(1/\\log n\\), estimate the expected number of primes in the interval \\((N, N + (\\log N)^2]\\). What does this suggest about Cramer's conjecture?",
                    hint: 'The expected count is \\(\\sum_{n=N+1}^{N + (\\log N)^2} 1/\\log n \\approx (\\log N)^2 / \\log N = \\log N\\).',
                    solution: "The expected count is approximately \\((\\log N)^2 / \\log N = \\log N \\to \\infty\\). So in the random model, an interval of length \\((\\log N)^2\\) is expected to contain about \\(\\log N\\) primes, and an interval of length \\(c(\\log N)^2\\) for small \\(c\\) will typically contain \\(c \\log N\\) primes. The probability that a specific interval \\((N, N + (\\log N)^2]\\) contains no primes is \\(\\prod_{n} (1-1/\\log n) \\approx e^{-(\\log N)^2 / \\log N} = e^{-\\log N} = 1/N\\). Summing over \\(N\\) gives a convergent series, so by Borel-Cantelli, infinitely many such empty intervals occur only if the sum diverges. This heuristic supports Cramer's conjecture."
                },
                {
                    question: "Explain why Granville's correction gives a constant \\(2e^{-\\gamma} > 1\\) rather than 1. What feature of the primes does Cramer's model ignore?",
                    hint: 'Primes satisfy the additional constraint: they are not divisible by 2, 3, 5, ... This changes the local density.',
                    solution: "Cramer's model treats all integers as equiprobable candidates for primality with density \\(1/\\log n\\). But primes must avoid all small prime divisors. If we condition on \\(n\\) being coprime to all primes \\(p \\leq z\\), the local density in a residue class modulo \\(\\prod_{p \\leq z} p\\) is \\(\\phi(\\prod p) / \\prod p = \\prod_{p \\leq z} (1-1/p) \\approx e^{-\\gamma}/\\log z\\). The Granville correction accounts for the fact that in neighborhoods of \\(N\\), consecutive integers are not independently prime: the divisibility by small primes is correlated. This systematic bias inflates the expected gap by a factor \\(2e^{-\\gamma} \\approx 1.12\\)."
                }
            ]
        },

        // ================================================================
        // SECTION 6: From Gaps to Bounded Gaps
        // ================================================================
        {
            id: 'sec-bridge',
            title: 'From Gaps to Bounded Gaps',
            content: `
<h2>From Short Intervals to Bounded Gaps</h2>

<p>The short interval problem asks: does \\((x, x + x^\\theta]\\) always contain a prime? The bounded gaps problem asks something different but related: are there infinitely many prime pairs \\((p, p')\\) with \\(p' - p \\leq C\\) for some fixed constant \\(C\\)?</p>

<h3>The Gap Between the Two Questions</h3>

<p>Short intervals shrink as \\(x \\to \\infty\\) (in the sense that \\(h/x = x^{\\theta-1} \\to 0\\)) but still grow to infinity. Bounded gaps is a statement about gaps of constant size. The two questions are related but not equivalent:</p>

<ul>
    <li>A short interval result \\(\\theta < 1\\) says gaps are \\(o(x)\\).</li>
    <li>BHP says gaps are \\(O(x^{0.525})\\).</li>
    <li>Zhang (2013) proved gaps are bounded: \\(\\liminf_{n} (p_{n+1} - p_n) \\leq 70{,}000{,}000\\).</li>
    <li>Maynard-Tao (2013-14) improved this to 246.</li>
    <li>Twin prime conjecture: \\(\\liminf = 2\\) (open).</li>
</ul>

<h3>The GPY Method</h3>

<p>The Goldston-Pintz-Yildirim (GPY) approach (2005) proved that</p>

\\[
\\liminf_{n\\to\\infty} \\frac{p_{n+1} - p_n}{\\log p_n} = 0,
\\]

<p>meaning gaps are infinitely often much shorter than average. Their method uses a sieve weight:</p>

\\[
w(n) = \\left( \\sum_{\\substack{d \\mid P(n) \\\\ d \\leq R}} \\lambda_d \\right)^2
\\]

<p>where \\(P(n) = n(n+2)(n+6) \\cdots\\) is the product over a tuple, and the \\(\\lambda_d\\) are chosen to maximize the ratio of primes detected to total weight. GPY showed that if the Elliott-Halberstam conjecture holds with exponent \\(> 1/2\\), then bounded gaps follow. Zhang proved a version of this conjecture in a specific range to get his finite bound.</p>

<div class="env-block theorem">
    <div class="env-title">Maynard-Tao Theorem (2013-14)</div>
    <div class="env-body">
        <p>For any \\(m \\geq 1\\), there exists \\(C_m\\) such that there are infinitely many integers \\(n\\) with at least \\(m\\) primes among \\(\\{n+h_1, n+h_2, \\ldots, n+h_k\\}\\) for an admissible \\(k\\)-tuple. In particular,</p>
        \\[\\liminf_{n\\to\\infty}(p_{n+1} - p_n) \\leq 246.\\]
    </div>
</div>

<h3>The Connection: Short Intervals Enable GPY</h3>

<p>There is a direct link: improvements in short interval primes (BHP at \\(\\theta = 0.525\\)) feed into the Bombieri-Vinogradov theorem, which is the main unconditional input to GPY. The fact that primes are sufficiently well-distributed in short intervals is exactly what makes the sieve weights effective.</p>

<div class="viz-placeholder" data-viz="viz-maximal-gaps"></div>
`,
            visualizations: [
                {
                    id: 'viz-maximal-gaps',
                    title: 'Maximal Prime Gaps vs Predictions',
                    description: 'Scatter plot of maximal prime gaps (the largest gap among all consecutive primes up to x) against x, compared with the Cramer prediction (log x)^2 and the BHP bound x^{0.525}.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, { width: 620, height: 380, originX: 70, originY: 50, scale: 1 });

                        var primes = VizEngine.sievePrimes(100000);

                        // Compute record gaps (maximal gaps)
                        var maxGaps = [];
                        var currentMax = 0;
                        for (var i = 1; i < primes.length; i++) {
                            var gap = primes[i] - primes[i-1];
                            if (gap > currentMax) {
                                currentMax = gap;
                                maxGaps.push({ x: primes[i], gap: gap });
                            }
                        }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var pad = { l: 70, r: 20, t: 40, b: 55 };
                            var W = viz.width - pad.l - pad.r;
                            var H = viz.height - pad.t - pad.b;

                            var xMax = 100000;
                            var gapMax = 0;
                            maxGaps.forEach(function(g) { gapMax = Math.max(gapMax, g.gap); });
                            gapMax = gapMax * 1.3;

                            function sx(x) { return pad.l + (x / xMax) * W; }
                            function sy(g) { return pad.t + (1 - g / gapMax) * H; }

                            // BHP curve: x^0.525
                            ctx.strokeStyle = viz.colors.red + '88'; ctx.lineWidth = 1.5; ctx.setLineDash([3,5]);
                            ctx.beginPath();
                            for (var xi = 100; xi <= xMax; xi += 500) {
                                var v = Math.pow(xi, 0.525);
                                if (v > gapMax * 1.2) continue;
                                var x = sx(xi), y = sy(v);
                                if (xi === 100) ctx.moveTo(x, y); else ctx.lineTo(x, y);
                            }
                            ctx.stroke(); ctx.setLineDash([]);

                            // Cramer prediction: (log x)^2
                            ctx.strokeStyle = viz.colors.yellow + '99'; ctx.lineWidth = 1.5; ctx.setLineDash([6,4]);
                            ctx.beginPath();
                            for (var xi = 10; xi <= xMax; xi += 200) {
                                var v = Math.pow(Math.log(xi), 2);
                                var x = sx(xi), y = sy(v);
                                if (xi === 10) ctx.moveTo(x, y); else ctx.lineTo(x, y);
                            }
                            ctx.stroke(); ctx.setLineDash([]);

                            // Granville: 2e^{-gamma} * (log x)^2
                            var granvConst = 2 * Math.exp(-0.5772);
                            ctx.strokeStyle = viz.colors.purple + '88'; ctx.lineWidth = 1; ctx.setLineDash([8,4]);
                            ctx.beginPath();
                            for (var xi = 10; xi <= xMax; xi += 200) {
                                var v = granvConst * Math.pow(Math.log(xi), 2);
                                var x = sx(xi), y = sy(v);
                                if (xi === 10) ctx.moveTo(x, y); else ctx.lineTo(x, y);
                            }
                            ctx.stroke(); ctx.setLineDash([]);

                            // Record gap points
                            maxGaps.forEach(function(g) {
                                var x = sx(g.x), y = sy(g.gap);
                                ctx.fillStyle = viz.colors.orange;
                                ctx.beginPath(); ctx.arc(x, y, 4, 0, Math.PI * 2); ctx.fill();
                            });

                            // Axes
                            ctx.strokeStyle = viz.colors.axis; ctx.lineWidth = 1.5;
                            ctx.beginPath(); ctx.moveTo(pad.l, pad.t); ctx.lineTo(pad.l, pad.t + H); ctx.stroke();
                            ctx.beginPath(); ctx.moveTo(pad.l, pad.t + H); ctx.lineTo(pad.l + W, pad.t + H); ctx.stroke();

                            ctx.fillStyle = viz.colors.text; ctx.font = '10px -apple-system,sans-serif';
                            ctx.textAlign = 'center'; ctx.textBaseline = 'top';
                            [20000, 40000, 60000, 80000, 100000].forEach(function(xv) {
                                ctx.fillText(xv.toLocaleString(), sx(xv), pad.t + H + 4);
                            });
                            ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
                            for (var gv = 0; gv <= gapMax; gv += 100) {
                                ctx.fillText(gv.toString(), pad.l - 4, sy(gv));
                            }

                            // Legend
                            var legX = pad.l + 20, legY = pad.t + 16;
                            ctx.fillStyle = viz.colors.orange; ctx.beginPath(); ctx.arc(legX+5, legY, 4, 0, Math.PI*2); ctx.fill();
                            ctx.fillStyle = viz.colors.orange; ctx.font = '11px -apple-system,sans-serif'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
                            ctx.fillText('Maximal gap record', legX + 14, legY);

                            ctx.strokeStyle = viz.colors.yellow + '99'; ctx.lineWidth = 1.5; ctx.setLineDash([6,4]);
                            ctx.beginPath(); ctx.moveTo(legX, legY+18); ctx.lineTo(legX+20, legY+18); ctx.stroke(); ctx.setLineDash([]);
                            ctx.fillStyle = viz.colors.yellow; ctx.fillText('Cramer: (log x)^2', legX+26, legY+18);

                            ctx.strokeStyle = viz.colors.purple + '88'; ctx.setLineDash([8,4]);
                            ctx.beginPath(); ctx.moveTo(legX, legY+36); ctx.lineTo(legX+20, legY+36); ctx.stroke(); ctx.setLineDash([]);
                            ctx.fillStyle = viz.colors.purple; ctx.fillText('Granville: 2e^{\u2212\u03b3}(log x)^2', legX+26, legY+36);

                            ctx.strokeStyle = viz.colors.red + '88'; ctx.setLineDash([3,5]);
                            ctx.beginPath(); ctx.moveTo(legX, legY+54); ctx.lineTo(legX+20, legY+54); ctx.stroke(); ctx.setLineDash([]);
                            ctx.fillStyle = viz.colors.red; ctx.fillText('BHP bound x^{0.525}', legX+26, legY+54);

                            ctx.fillStyle = viz.colors.text; ctx.textAlign = 'center'; ctx.textBaseline = 'top';
                            ctx.fillText('x', pad.l + W/2, pad.t + H + 30);
                            ctx.save(); ctx.translate(14, pad.t + H/2); ctx.rotate(-Math.PI/2);
                            ctx.fillStyle = viz.colors.text; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                            ctx.fillText('gap size', 0, 0); ctx.restore();

                            viz.screenText('Maximal prime gaps vs predictions', viz.width/2, 16, viz.colors.white, 14);
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'The GPY method shows that \\(\\liminf (p_{n+1} - p_n)/\\log p_n = 0\\). Does this follow from BHP (every interval \\((x, x+x^{0.525}]\\) contains a prime)?',
                    hint: 'BHP bounds the maximum gap; GPY is about the minimum gap. Think about what each result literally says.',
                    solution: "No. BHP gives an upper bound on the largest gap, saying gaps can't be too large. GPY gives a lower bound on how often gaps are small, saying gaps are sometimes much smaller than average. These are different statements. BHP says \\(p_{n+1} - p_n = O(p_n^{0.525})\\) for all \\(n\\), while GPY says \\(p_{n+1} - p_n = o(\\log p_n)\\) for infinitely many \\(n\\). Neither implies the other."
                },
                {
                    question: "Assuming the Elliott-Halberstam conjecture with exponent \\(\\theta > 1/2\\), the GPY argument gives bounded prime gaps. Why is the exponent \\(1/2\\) a natural barrier, and what does Zhang's 2013 result actually prove to cross it?",
                    hint: 'The Bombieri-Vinogradov theorem gives exponent 1/2 unconditionally. Zhang proved a weaker but sufficient version for his purposes.',
                    solution: "The Bombieri-Vinogradov theorem, which averages the prime number theorem over arithmetic progressions, holds unconditionally for moduli \\(q \\leq x^{1/2-\\varepsilon}\\). Elliott-Halberstam conjectures it holds for \\(q \\leq x^{1-\\varepsilon}\\). In GPY, one needs extra room beyond \\(1/2\\) to make the sieve sum positive. Zhang proved a version of Bombieri-Vinogradov for smooth moduli \\(q \\leq x^{1/2 + 1/584}\\) (i.e., moduli whose prime factors are at most \\(x^\\varepsilon\\)). This small gain above \\(1/2\\) for a restricted class of moduli is sufficient for the GPY argument to yield a finite gap bound."
                },
                {
                    question: "The Maynard-Tao result gives \\(\\liminf_n(p_{n+1} - p_n) \\leq 246\\). Describe the key difference between Maynard's approach and Zhang's.",
                    hint: 'Maynard uses a multidimensional sieve instead of a one-dimensional weight.',
                    solution: "Zhang's approach follows GPY using a one-dimensional sieve weight on a translated integer \\(n\\), then uses the improved Bombieri-Vinogradov theorem to push through. Maynard independently discovered a multidimensional sieve where the weight \\(\\lambda_{d_1,\\ldots,d_k}\\) acts simultaneously on a \\(k\\)-tuple \\(\\{n+h_1, \\ldots, n+h_k\\}\\). By optimizing over all \\(k\\)-dimensional weight vectors, Maynard obtains a much stronger result without needing any improvement to Bombieri-Vinogradov: the multidimensional optimization is flexible enough that the standard \\(1/2\\) exponent suffices, giving \\(\\liminf \\leq 600\\), later refined to 246."
                }
            ]
        }

    ]
});
