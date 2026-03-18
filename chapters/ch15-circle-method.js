// === Chapter 15: The Circle Method ===
window.CHAPTERS = window.CHAPTERS || [];
window.CHAPTERS.push({
    id: 'ch15',
    number: 15,
    title: 'The Circle Method',
    subtitle: 'Solving additive problems by Fourier analysis on the circle',
    sections: [
        // ================================================================
        // SECTION 1: Motivation — Why the Circle?
        // ================================================================
        {
            id: 'sec-motivation',
            title: 'Motivation — Why the Circle?',
            content: `
<h2>Motivation: Why the Circle?</h2>

<div class="env-block intuition">
    <div class="env-title">The Central Question</div>
    <div class="env-body">
        <p>How many ways can a positive integer \\(n\\) be written as a sum of \\(s\\) perfect \\(k\\)-th powers? Or as a sum of three primes? These are <em>additive</em> questions, and the circle method is the most powerful general technique for attacking them.</p>
    </div>
</div>

<p>Additive number theory asks: given a set \\(\\mathcal{A} \\subseteq \\mathbb{Z}\\), how many representations does an integer \\(n\\) have as a sum of elements of \\(\\mathcal{A}\\)? The number of representations,</p>

\\[
r(n) = \\#\\{(a_1, \\ldots, a_s) \\in \\mathcal{A}^s : a_1 + \\cdots + a_s = n\\},
\\]

<p>is the object we want to estimate. Direct combinatorial counting is usually hopeless. Instead, we use <strong>Fourier analysis</strong>.</p>

<h3>From Counting to Integrals</h3>

<p>The key idea is the orthogonality relation for exponentials. Let \\(e(\\alpha) = e^{2\\pi i \\alpha}\\). Then for any integer \\(m\\),</p>

\\[
\\int_0^1 e(m\\alpha)\\, d\\alpha = \\begin{cases} 1 & \\text{if } m = 0, \\\\ 0 & \\text{if } m \\neq 0. \\end{cases}
\\]

<p>This acts as a "Kronecker delta detector": it picks out terms where a sum equals zero. If we define the <strong>generating function</strong></p>

\\[
f(\\alpha) = \\sum_{a \\in \\mathcal{A}} e(a\\alpha),
\\]

<p>then</p>

\\[
f(\\alpha)^s = \\sum_{a_1, \\ldots, a_s \\in \\mathcal{A}} e\\bigl((a_1 + \\cdots + a_s)\\alpha\\bigr) = \\sum_{n} r(n)\\, e(n\\alpha).
\\]

<p>Multiplying by \\(e(-n\\alpha)\\) and integrating over \\([0,1]\\), we extract exactly \\(r(n)\\):</p>

\\[
r(n) = \\int_0^1 f(\\alpha)^s\\, e(-n\\alpha)\\, d\\alpha.
\\]

<p>This is the fundamental identity of the circle method. We have transformed a counting problem into an integral over the <strong>unit interval</strong> \\([0,1]\\), which we identify with the circle \\(\\mathbb{R}/\\mathbb{Z}\\).</p>

<div class="env-block remark">
    <div class="env-title">Historical Note</div>
    <div class="env-body">
        <p>The method was invented by Hardy and Ramanujan (1918) to study the partition function \\(p(n)\\). It was then developed systematically by Hardy and Littlewood in a series of papers in the 1920s (their "Partitio Numerorum" series), and refined by Vinogradov in the 1930s into the form used today.</p>
    </div>
</div>

<h3>Why "Circle"?</h3>

<p>The variable \\(\\alpha\\) ranges over \\([0,1]\\), which we identify with the unit circle \\(\\mathbb{R}/\\mathbb{Z}\\) via the map \\(\\alpha \\mapsto e(\\alpha) = e^{2\\pi i \\alpha}\\). Geometrically, we are performing Fourier analysis on the circle group. This is why the technique is called the <em>circle method</em>, or sometimes the <em>Hardy-Littlewood method</em>.</p>

<div class="viz-placeholder" data-viz="viz-arc-partition"></div>
`,
            visualizations: [
                {
                    id: 'viz-arc-partition',
                    title: 'The Unit Circle and Fourier Detection',
                    description: 'The unit interval [0,1] wraps around the circle. The exponential sum f(alpha) traces a path in the complex plane. When alpha is near a rational number a/q with small q, the sum has large magnitude (constructive interference). Away from such rationals, cancellation makes the sum small.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 380,
                            originX: 280, originY: 200, scale: 100
                        });

                        var N = 20;
                        var alphaVal = 0;

                        var slider = VizEngine.createSlider(controls, 'alpha', 0, 1, 0, 0.005, function(v) {
                            alphaVal = v;
                            draw();
                        });

                        VizEngine.createSlider(controls, 'N', 5, 50, N, 1, function(v) {
                            N = Math.round(v);
                            draw();
                        });

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            // Draw unit circle
                            viz.drawCircle(0, 0, 1, null, viz.colors.grid, 1);

                            // Draw axes
                            viz.drawSegment(-1.6, 0, 1.6, 0, viz.colors.grid, 0.5);
                            viz.drawSegment(0, -1.6, 0, 1.6, viz.colors.grid, 0.5);

                            // Compute f(alpha) = sum_{n=1}^{N} e(n*alpha)
                            var re = 0, im = 0;
                            var pathRe = [0], pathIm = [0];
                            for (var n = 1; n <= N; n++) {
                                var angle = 2 * Math.PI * n * alphaVal;
                                re += Math.cos(angle);
                                im += Math.sin(angle);
                                pathRe.push(re / N);
                                pathIm.push(im / N);
                            }

                            // Draw partial sums path (normalized)
                            ctx.strokeStyle = viz.colors.blue + '88';
                            ctx.lineWidth = 1;
                            ctx.beginPath();
                            for (var i = 0; i < pathRe.length; i++) {
                                var sx = viz.originX + pathRe[i] * viz.scale;
                                var sy = viz.originY - pathIm[i] * viz.scale;
                                if (i === 0) ctx.moveTo(sx, sy);
                                else ctx.lineTo(sx, sy);
                            }
                            ctx.stroke();

                            // Draw final point
                            var finalRe = re / N, finalIm = im / N;
                            var mag = Math.sqrt(finalRe * finalRe + finalIm * finalIm);
                            viz.drawPoint(finalRe, finalIm, viz.colors.blue, null, 6);
                            viz.drawSegment(0, 0, finalRe, finalIm, viz.colors.blue, 2);

                            // Mark alpha on circle
                            var aAngle = 2 * Math.PI * alphaVal;
                            viz.drawPoint(Math.cos(aAngle), Math.sin(aAngle), viz.colors.orange, null, 5);

                            // Labels
                            viz.screenText('alpha = ' + alphaVal.toFixed(3), viz.width / 2, 20, viz.colors.white, 14);
                            viz.screenText('|f(alpha)/N| = ' + mag.toFixed(3), viz.width / 2, 40, viz.colors.teal, 12);

                            // Show nearby rational
                            var bestQ = 1, bestA = 0, bestDist = 1;
                            for (var q = 1; q <= 10; q++) {
                                for (var a = 0; a <= q; a++) {
                                    var d = Math.abs(alphaVal - a / q);
                                    if (d < bestDist) { bestDist = d; bestQ = q; bestA = a; }
                                }
                            }
                            viz.screenText('Nearest: ' + bestA + '/' + bestQ + '  (dist ' + bestDist.toFixed(4) + ')', viz.width / 2, viz.height - 20, viz.colors.text, 11);

                            // Legend
                            viz.screenText('Re', viz.width - 20, viz.originY - 8, viz.colors.text, 10);
                            viz.screenText('Im', viz.originX + 8, 15, viz.colors.text, 10);
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Verify the orthogonality relation: compute \\(\\int_0^1 e(m\\alpha)\\,d\\alpha\\) for \\(m = 0\\) and \\(m \\neq 0\\).',
                    hint: 'For \\(m = 0\\), the integrand is 1. For \\(m \\neq 0\\), use the antiderivative of \\(e^{2\\pi i m \\alpha}\\).',
                    solution: 'For \\(m=0\\): \\(\\int_0^1 1\\,d\\alpha = 1\\). For \\(m \\neq 0\\): \\(\\int_0^1 e^{2\\pi i m \\alpha}\\,d\\alpha = \\frac{e^{2\\pi i m} - 1}{2\\pi i m} = \\frac{1 - 1}{2\\pi i m} = 0\\), since \\(e^{2\\pi i m} = 1\\) for integer \\(m\\).'
                }
            ]
        },

        // ================================================================
        // SECTION 2: The Setup — r(n) as an Integral
        // ================================================================
        {
            id: 'sec-setup',
            title: 'The Setup: r(n) as an Integral',
            content: `
<h2>The Setup: \\(r(n)\\) as an Integral</h2>

<p>We now formalize the approach. Fix a set \\(\\mathcal{A}\\) and a number of summands \\(s\\). Define the <strong>exponential generating function</strong></p>

\\[
f(\\alpha) = \\sum_{a \\in \\mathcal{A},\\, a \\leq n} e(a\\alpha).
\\]

<p>(We restrict to \\(a \\leq n\\) since larger elements cannot contribute to representations of \\(n\\).)</p>

<div class="env-block theorem">
    <div class="env-title">Theorem 15.1 (Circle Method Identity)</div>
    <div class="env-body">
        <p>The number of representations \\(r_s(n) = \\#\\{(a_1,\\ldots,a_s) \\in \\mathcal{A}^s : a_1 + \\cdots + a_s = n,\\, a_i \\leq n\\}\\) satisfies</p>
        \\[r_s(n) = \\int_0^1 f(\\alpha)^s\\, e(-n\\alpha)\\, d\\alpha.\\]
    </div>
</div>

<div class="env-block proof">
    <div class="env-title">Proof</div>
    <div class="env-body">
        <p>Expanding \\(f(\\alpha)^s\\):</p>
        \\[f(\\alpha)^s = \\sum_{a_1,\\ldots,a_s} e\\bigl((a_1+\\cdots+a_s)\\alpha\\bigr).\\]
        <p>Multiply by \\(e(-n\\alpha)\\) and integrate:</p>
        \\[\\int_0^1 f(\\alpha)^s e(-n\\alpha)\\,d\\alpha = \\sum_{a_1,\\ldots,a_s} \\int_0^1 e\\bigl((a_1+\\cdots+a_s - n)\\alpha\\bigr)\\,d\\alpha.\\]
        <p>By orthogonality, each integral is 1 if \\(a_1+\\cdots+a_s = n\\) and 0 otherwise. The result follows.</p>
    </div>
</div>

<h3>The Key Examples</h3>

<p>Two classical applications drive the entire theory:</p>

<div class="env-block definition">
    <div class="env-title">Waring's Problem</div>
    <div class="env-body">
        <p>Let \\(\\mathcal{A} = \\{0, 1^k, 2^k, 3^k, \\ldots\\}\\) be the set of perfect \\(k\\)-th powers. Then \\(r_s(n)\\) counts the number of representations of \\(n\\) as a sum of \\(s\\) perfect \\(k\\)-th powers. The generating function is</p>
        \\[f(\\alpha) = \\sum_{m=1}^{n^{1/k}} e(m^k \\alpha).\\]
    </div>
</div>

<div class="env-block definition">
    <div class="env-title">Goldbach's Problem</div>
    <div class="env-body">
        <p>Let \\(\\mathcal{A}\\) be the set of primes. For the ternary Goldbach problem (every large odd integer is a sum of three primes), the generating function is</p>
        \\[f(\\alpha) = \\sum_{p \\leq n} (\\log p)\\, e(p\\alpha).\\]
        <p>(The weight \\(\\log p\\) is standard; it simplifies the analysis via the von Mangoldt function.)</p>
    </div>
</div>

<h3>The Challenge</h3>

<p>The integral \\(\\int_0^1 f(\\alpha)^s e(-n\\alpha)\\,d\\alpha\\) is exact, but evaluating it is hard. The integrand oscillates wildly. The genius of Hardy, Littlewood, and Vinogradov was to realize that not all \\(\\alpha \\in [0,1]\\) contribute equally. Near "nice" rationals \\(a/q\\) (with small denominator \\(q\\)), the function \\(f(\\alpha)\\) is large; away from such rationals, massive cancellation makes \\(f(\\alpha)\\) small.</p>

<p>This leads to the <strong>major arc / minor arc decomposition</strong>, which is the subject of the next section.</p>

<div class="viz-placeholder" data-viz="viz-major-arc-peak"></div>
`,
            visualizations: [
                {
                    id: 'viz-major-arc-peak',
                    title: 'Peaks of |f(alpha)| Near Rationals',
                    description: 'Plot |f(alpha)|^2 for the generating function of k-th powers. Notice the sharp peaks near low-denominator rationals a/q. The height and width of each peak depend on q: smaller q gives taller, wider peaks.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 380,
                            originX: 50, originY: 340, scale: 1
                        });

                        var kVal = 2;
                        var NVal = 30;

                        VizEngine.createSlider(controls, 'k (power)', 1, 4, kVal, 1, function(v) {
                            kVal = Math.round(v);
                            draw();
                        });

                        VizEngine.createSlider(controls, 'N', 10, 60, NVal, 5, function(v) {
                            NVal = Math.round(v);
                            draw();
                        });

                        function computeF(alpha) {
                            var re = 0, im = 0;
                            for (var m = 1; m <= NVal; m++) {
                                var mk = Math.pow(m, kVal);
                                var angle = 2 * Math.PI * mk * alpha;
                                re += Math.cos(angle);
                                im += Math.sin(angle);
                            }
                            return re * re + im * im;
                        }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var plotW = viz.width - 80;
                            var plotH = 290;
                            var plotX0 = 60;
                            var plotY0 = 30;

                            viz.screenText('|f(alpha)|^2 for ' + kVal + getSuffix(kVal) + ' powers, N=' + NVal, viz.width / 2, 18, viz.colors.white, 14);

                            // Sample the function
                            var nSamples = 500;
                            var vals = [];
                            var maxVal = 0;
                            for (var i = 0; i <= nSamples; i++) {
                                var alpha = i / nSamples;
                                var v = computeF(alpha);
                                vals.push(v);
                                if (v > maxVal) maxVal = v;
                            }
                            if (maxVal < 1) maxVal = 1;

                            // Draw axes
                            ctx.strokeStyle = viz.colors.axis;
                            ctx.lineWidth = 1;
                            ctx.beginPath();
                            ctx.moveTo(plotX0, plotY0);
                            ctx.lineTo(plotX0, plotY0 + plotH);
                            ctx.lineTo(plotX0 + plotW, plotY0 + plotH);
                            ctx.stroke();

                            // X-axis labels
                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '10px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'top';
                            var fracs = [[0,'0'],[1,4,'1/4'],[1,3,'1/3'],[1,2,'1/2'],[2,3,'2/3'],[3,4,'3/4'],[1,1,'1']];
                            for (var fi = 0; fi < fracs.length; fi++) {
                                var fr = fracs[fi];
                                var xv;
                                if (fr.length === 2) xv = fr[0];
                                else xv = fr[0] / fr[1];
                                var label = fr.length === 2 ? '' + fr[1] : fr[2];
                                var sx = plotX0 + xv * plotW;
                                ctx.fillStyle = viz.colors.text;
                                ctx.fillText(label, sx, plotY0 + plotH + 4);
                                ctx.strokeStyle = viz.colors.grid;
                                ctx.lineWidth = 0.3;
                                ctx.beginPath();
                                ctx.moveTo(sx, plotY0);
                                ctx.lineTo(sx, plotY0 + plotH);
                                ctx.stroke();
                            }

                            // Plot
                            ctx.strokeStyle = viz.colors.blue;
                            ctx.lineWidth = 1.5;
                            ctx.beginPath();
                            for (var j = 0; j <= nSamples; j++) {
                                var px = plotX0 + (j / nSamples) * plotW;
                                var py = plotY0 + plotH - (vals[j] / maxVal) * plotH;
                                if (j === 0) ctx.moveTo(px, py);
                                else ctx.lineTo(px, py);
                            }
                            ctx.stroke();

                            // Mark peaks at 0, 1/q for small q
                            var peakRats = [[0,1],[1,2],[1,3],[2,3],[1,4],[3,4],[1,1]];
                            for (var pi = 0; pi < peakRats.length; pi++) {
                                var pa = peakRats[pi][0], pq = peakRats[pi][1];
                                var pAlpha = pa / pq;
                                var pv = computeF(pAlpha);
                                var ppx = plotX0 + pAlpha * plotW;
                                var ppy = plotY0 + plotH - (pv / maxVal) * plotH;
                                ctx.fillStyle = viz.colors.orange;
                                ctx.beginPath();
                                ctx.arc(ppx, ppy, 3, 0, Math.PI * 2);
                                ctx.fill();
                            }

                            viz.screenText('alpha', plotX0 + plotW / 2, plotY0 + plotH + 20, viz.colors.text, 11);
                        }

                        function getSuffix(k) {
                            if (k === 1) return 'st';
                            if (k === 2) return 'nd';
                            if (k === 3) return 'rd';
                            return 'th';
                        }

                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'For \\(\\mathcal{A} = \\{1, 2, \\ldots, n\\}\\) and \\(s = 2\\), compute \\(f(\\alpha)\\) explicitly as a geometric series and show that \\(|f(\\alpha)|^2\\) peaks at \\(\\alpha = 0\\) with value \\(n^2\\).',
                    hint: 'Use the formula for a geometric sum: \\(\\sum_{m=1}^n z^m = z(z^n - 1)/(z-1)\\).',
                    solution: 'We have \\(f(\\alpha) = \\sum_{m=1}^n e(m\\alpha) = e(\\alpha)\\frac{e(n\\alpha)-1}{e(\\alpha)-1}\\). At \\(\\alpha = 0\\), every term is 1, so \\(f(0) = n\\) and \\(|f(0)|^2 = n^2\\). For \\(\\alpha \\neq 0\\), \\(|f(\\alpha)| = \\frac{|\\sin(\\pi n \\alpha)|}{|\\sin(\\pi \\alpha)|}\\), which is bounded and typically \\(O(1/\\|\\alpha\\|)\\) where \\(\\|\\alpha\\|\\) is the distance to the nearest integer.'
                }
            ]
        },

        // ================================================================
        // SECTION 3: Major and Minor Arcs
        // ================================================================
        {
            id: 'sec-major-minor',
            title: 'Major and Minor Arcs',
            content: `
<h2>Major and Minor Arcs</h2>

<p>The heart of the circle method is the <strong>dissection</strong> of the interval \\([0,1]\\) into two parts based on Diophantine approximation.</p>

<div class="env-block definition">
    <div class="env-title">Definition (Farey Dissection)</div>
    <div class="env-body">
        <p>Fix a parameter \\(Q \\geq 1\\) (depending on \\(n\\)). The <strong>major arcs</strong> are neighborhoods of rationals with small denominators:</p>
        \\[\\mathfrak{M}(q, a) = \\left\\{\\alpha : \\left|\\alpha - \\frac{a}{q}\\right| \\leq \\frac{Q}{n}\\right\\}, \\quad 1 \\leq a \\leq q \\leq Q,\\; \\gcd(a,q) = 1.\\]
        \\[\\mathfrak{M} = \\bigcup_{q \\leq Q} \\bigcup_{\\substack{a=1 \\\\ \\gcd(a,q)=1}}^q \\mathfrak{M}(q,a).\\]
        <p>The <strong>minor arcs</strong> are everything else:</p>
        \\[\\mathfrak{m} = [0,1] \\setminus \\mathfrak{M}.\\]
    </div>
</div>

<div class="env-block intuition">
    <div class="env-title">Why This Works</div>
    <div class="env-body">
        <p>On each major arc \\(\\mathfrak{M}(q,a)\\), the generating function \\(f(\\alpha)\\) can be well-approximated because \\(\\alpha \\approx a/q\\) and the exponentials \\(e(m^k \\cdot a/q)\\) factor through the residues modulo \\(q\\). This leads to explicit formulas involving <strong>Gauss sums</strong> and <strong>singular series</strong>.</p>
        <p>On the minor arcs, \\(\\alpha\\) is not well-approximable by rationals with small denominators, and exponential sum estimates (Weyl, Vinogradov) show that \\(|f(\\alpha)|\\) is much smaller. When \\(s\\) is large enough, this "smallness" to the \\(s\\)-th power makes the minor arc contribution negligible.</p>
    </div>
</div>

<h3>The Strategy</h3>

<p>We split the integral:</p>

\\[
r_s(n) = \\underbrace{\\int_{\\mathfrak{M}} f(\\alpha)^s\\,e(-n\\alpha)\\,d\\alpha}_{\\text{major arc contribution}} + \\underbrace{\\int_{\\mathfrak{m}} f(\\alpha)^s\\,e(-n\\alpha)\\,d\\alpha}_{\\text{minor arc contribution}}.
\\]

<p>The circle method succeeds when:</p>
<ol>
    <li><strong>Major arcs</strong>: We can compute the integral explicitly, obtaining an asymptotic formula involving the <em>singular series</em> \\(\\mathfrak{S}(n)\\) and a <em>singular integral</em> \\(\\mathfrak{J}(n)\\).</li>
    <li><strong>Minor arcs</strong>: We can show the integral is \\(o(\\text{major arc contribution})\\), i.e., negligible.</li>
</ol>

<h3>The Major Arc Approximation</h3>

<p>On \\(\\mathfrak{M}(q,a)\\), write \\(\\alpha = a/q + \\beta\\) with \\(|\\beta| \\leq Q/n\\). Then</p>

\\[
f(\\alpha) = \\sum_{m \\leq n^{1/k}} e(m^k(a/q + \\beta)) = \\sum_{r=1}^{q} e(r^k a/q) \\sum_{\\substack{m \\leq n^{1/k} \\\\ m \\equiv r \\pmod{q}}} e(m^k \\beta).
\\]

<p>The inner sum over the arithmetic progression is well-approximated by an integral (by partial summation or Euler-Maclaurin), and the outer sum is a <strong>Gauss-type sum</strong></p>

\\[
S(q,a) = \\sum_{r=1}^{q} e(r^k a/q),
\\]

<p>which can be evaluated using multiplicativity and local analysis.</p>

<h3>The Minor Arc Bound</h3>

<p>The crucial ingredient is a bound of the form</p>

\\[
\\sup_{\\alpha \\in \\mathfrak{m}} |f(\\alpha)| \\leq n^{1/k - \\delta}
\\]

<p>for some \\(\\delta > 0\\). For \\(k = 2\\), Weyl's inequality gives \\(\\delta\\) related to \\(1/(2\\log n)\\). For general \\(k\\), Vinogradov's mean value theorem gives sharp results. The key is that this power saving, raised to the \\(s\\)-th power, overwhelms the volume of the minor arcs.</p>

<div class="viz-placeholder" data-viz="viz-minor-arc-cancel"></div>
`,
            visualizations: [
                {
                    id: 'viz-minor-arc-cancel',
                    title: 'Cancellation on Minor Arcs',
                    description: 'Watch how the exponential sum e(1*alpha) + e(2*alpha) + ... + e(N*alpha) cancels on minor arcs. For alpha near a rational with small denominator, the vectors align (constructive). For "generic" alpha, they spiral and cancel (destructive).',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 380,
                            originX: 280, originY: 200, scale: 80
                        });

                        var N = 30;
                        var alphaVal = 0.31;
                        var animating = false;
                        var animFrame = 0;

                        VizEngine.createSlider(controls, 'alpha', 0, 1, alphaVal, 0.001, function(v) {
                            alphaVal = v;
                            draw();
                        });

                        VizEngine.createSlider(controls, 'N', 5, 80, N, 1, function(v) {
                            N = Math.round(v);
                            draw();
                        });

                        VizEngine.createButton(controls, 'Animate', function() {
                            if (animating) { animating = false; return; }
                            animating = true;
                            animFrame = 0;
                            function step() {
                                if (!animating || animFrame > 200) { animating = false; return; }
                                alphaVal = animFrame / 200;
                                slider.value = alphaVal;
                                draw();
                                animFrame++;
                                requestAnimationFrame(step);
                            }
                            var slider = controls.querySelector('.viz-slider');
                            step();
                        });

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            // Draw unit circle for reference
                            viz.drawCircle(0, 0, 1, null, viz.colors.grid + '44', 0.5);

                            // Draw vectors e(n*alpha) head to tail
                            var cumRe = 0, cumIm = 0;
                            var scale = 1 / N; // normalize each vector

                            ctx.lineWidth = 1;
                            for (var n = 1; n <= N; n++) {
                                var angle = 2 * Math.PI * n * alphaVal;
                                var dre = scale * Math.cos(angle);
                                var dim = scale * Math.sin(angle);

                                var t = n / N;
                                var r = Math.round(88 + 167 * t);
                                var g = Math.round(166 - 50 * t);
                                var b = Math.round(255 - 100 * t);
                                ctx.strokeStyle = 'rgb(' + r + ',' + g + ',' + b + ')';
                                ctx.globalAlpha = 0.6;

                                var sx1 = viz.originX + cumRe * viz.scale;
                                var sy1 = viz.originY - cumIm * viz.scale;
                                cumRe += dre;
                                cumIm += dim;
                                var sx2 = viz.originX + cumRe * viz.scale;
                                var sy2 = viz.originY - cumIm * viz.scale;
                                ctx.beginPath();
                                ctx.moveTo(sx1, sy1);
                                ctx.lineTo(sx2, sy2);
                                ctx.stroke();
                            }
                            ctx.globalAlpha = 1;

                            // Draw resultant
                            var mag = Math.sqrt(cumRe * cumRe + cumIm * cumIm);
                            viz.drawSegment(0, 0, cumRe, cumIm, viz.colors.orange, 2.5);
                            viz.drawPoint(cumRe, cumIm, viz.colors.orange, null, 5);
                            viz.drawPoint(0, 0, viz.colors.white, null, 3);

                            // Info
                            viz.screenText('alpha = ' + alphaVal.toFixed(3), viz.width / 2, 18, viz.colors.white, 13);
                            viz.screenText('|f(alpha)/N| = ' + mag.toFixed(4), viz.width / 2, 36, mag > 0.3 ? viz.colors.orange : viz.colors.teal, 13);
                            viz.screenText(mag > 0.3 ? 'Major arc: constructive' : 'Minor arc: cancellation!', viz.width / 2, viz.height - 18, mag > 0.3 ? viz.colors.orange : viz.colors.teal, 12);
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Explain why the major arcs \\(\\mathfrak{M}(q,a)\\) for distinct reduced fractions \\(a/q\\) with \\(q \\leq Q\\) are disjoint when \\(Q^2 < n\\).',
                    hint: 'If \\(a/q \\neq a\'/q\'\\), what is \\(|a/q - a\'/q\'|\\)?',
                    solution: 'If \\(a/q \\neq a\'/q\'\\) are distinct reduced fractions, then \\(|a/q - a\'/q\'| \\geq 1/(qq\') \\geq 1/Q^2\\). The major arc around \\(a/q\\) has radius \\(Q/n\\), so two such arcs can overlap only if \\(2Q/n \\geq 1/Q^2\\), i.e., \\(Q^3 \\geq n/2\\). When \\(Q^2 < n\\) (hence \\(Q^3 < n^{3/2}\\) which is much less than the typical choice), the arcs are disjoint for \\(Q \\ll n^{1/3}\\). More precisely, the standard choice \\(Q = (\\log n)^A\\) easily satisfies \\(Q^3 < n\\).'
                }
            ]
        },

        // ================================================================
        // SECTION 4: Waring's Problem
        // ================================================================
        {
            id: 'sec-waring',
            title: "Waring's Problem",
            content: `
<h2>Waring's Problem</h2>

<div class="env-block intuition">
    <div class="env-title">The Question</div>
    <div class="env-body">
        <p>Edward Waring (1770) conjectured that every positive integer can be written as the sum of a bounded number of \\(k\\)-th powers. For example, every integer is the sum of 4 squares (Lagrange, 1770), 9 cubes (proved in various stages), and 19 fourth powers.</p>
    </div>
</div>

<h3>Notation</h3>

<div class="env-block definition">
    <div class="env-title">Definition</div>
    <div class="env-body">
        <p>For each \\(k \\geq 2\\):</p>
        <ul>
            <li>\\(g(k)\\) is the smallest \\(s\\) such that <em>every</em> positive integer is a sum of \\(s\\) perfect \\(k\\)-th powers.</li>
            <li>\\(G(k)\\) is the smallest \\(s\\) such that every <em>sufficiently large</em> integer is a sum of \\(s\\) perfect \\(k\\)-th powers.</li>
        </ul>
        <p>Clearly \\(G(k) \\leq g(k)\\). The function \\(G(k)\\) is the more natural analytic object, since the circle method gives asymptotic results.</p>
    </div>
</div>

<h3>Known Values and Bounds</h3>

<table style="width:100%;border-collapse:collapse;margin:16px 0;">
<tr style="border-bottom:1px solid #333;">
    <th style="text-align:center;padding:6px;">\\(k\\)</th>
    <th style="text-align:center;padding:6px;">\\(g(k)\\)</th>
    <th style="text-align:center;padding:6px;">\\(G(k)\\) best known</th>
    <th style="text-align:center;padding:6px;">Circle method gives</th>
</tr>
<tr><td style="text-align:center;padding:4px;">2</td><td style="text-align:center;">4</td><td style="text-align:center;">4</td><td style="text-align:center;">\\(G(2) \\leq 5\\)</td></tr>
<tr><td style="text-align:center;padding:4px;">3</td><td style="text-align:center;">9</td><td style="text-align:center;">\\(\\leq 7\\)</td><td style="text-align:center;">\\(G(3) \\leq 9\\)</td></tr>
<tr><td style="text-align:center;padding:4px;">4</td><td style="text-align:center;">19</td><td style="text-align:center;">\\(\\leq 16\\)</td><td style="text-align:center;">\\(G(4) \\leq 21\\)</td></tr>
<tr><td style="text-align:center;padding:4px;">general</td><td style="text-align:center;">\\(2^k + \\lfloor(3/2)^k\\rfloor - 2\\)</td><td style="text-align:center;">\\(O(k \\log k)\\)</td><td style="text-align:center;">\\(s \\geq 2^k + 1\\) suffices</td></tr>
</table>

<h3>The Circle Method for Waring's Problem</h3>

<div class="env-block theorem">
    <div class="env-title">Theorem 15.2 (Hardy-Littlewood Asymptotic Formula)</div>
    <div class="env-body">
        <p>Let \\(k \\geq 2\\) and \\(s \\geq s_0(k)\\) be sufficiently large. Then the number of representations of \\(n\\) as a sum of \\(s\\) positive \\(k\\)-th powers satisfies</p>
        \\[r_{s,k}(n) = \\mathfrak{S}_{s,k}(n)\\, \\mathfrak{J}_{s,k}(n) + o(n^{s/k - 1}),\\]
        <p>where \\(\\mathfrak{S}_{s,k}(n)\\) is the <strong>singular series</strong> and \\(\\mathfrak{J}_{s,k}(n) \\asymp n^{s/k - 1}\\) is the <strong>singular integral</strong>.</p>
    </div>
</div>

<p>The singular integral \\(\\mathfrak{J}_{s,k}(n)\\) is what you would expect from a "continuous" model: if the \\(k\\)-th powers up to \\(n\\) were uniformly distributed, how many \\(s\\)-tuples would sum to \\(n\\)? This gives the "main term" \\(n^{s/k-1}\\). The singular series \\(\\mathfrak{S}_{s,k}(n)\\) corrects for local (modular arithmetic) obstructions.</p>

<h3>The Formula for \\(g(k)\\)</h3>

<p>For \\(k \\geq 2\\), the exact value of \\(g(k)\\) is determined by small numbers. Consider \\(n = 2^k \\lfloor (3/2)^k \\rfloor - 1\\). This number is less than \\(3^k\\), so it can only use powers \\(1^k\\) and \\(2^k\\). The greedy algorithm uses \\(\\lfloor (3/2)^k \\rfloor - 1\\) copies of \\(2^k\\), leaving a remainder that requires \\(2^k - 1\\) copies of \\(1^k\\). This gives</p>

\\[
g(k) \\geq 2^k + \\lfloor (3/2)^k \\rfloor - 2.
\\]

<p>Remarkably, equality holds for all known \\(k\\), and this was proved for all \\(k\\) satisfying a mild condition on \\(\\{(3/2)^k\\}\\) (the fractional part).</p>

<div class="viz-placeholder" data-viz="viz-waring-decompose"></div>
`,
            visualizations: [
                {
                    id: 'viz-waring-decompose',
                    title: "Waring Decompositions: Writing n as a Sum of k-th Powers",
                    description: 'Choose n and k, and see how n can be decomposed into k-th powers. The visualization shows the greedy decomposition and counts how many summands are needed. Compare with the theoretical g(k) and G(k) bounds.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 380,
                            originX: 0, originY: 0, scale: 1
                        });

                        var nVal = 30;
                        var kVal = 2;

                        VizEngine.createSlider(controls, 'n', 1, 100, nVal, 1, function(v) {
                            nVal = Math.round(v);
                            draw();
                        });
                        VizEngine.createSlider(controls, 'k', 2, 4, kVal, 1, function(v) {
                            kVal = Math.round(v);
                            draw();
                        });

                        function greedyDecompose(n, k) {
                            var parts = [];
                            var rem = n;
                            while (rem > 0) {
                                var base = Math.floor(Math.pow(rem, 1/k));
                                if (base < 1) base = 1;
                                // make sure base^k <= rem
                                while (Math.pow(base, k) > rem) base--;
                                if (base < 1) base = 1;
                                parts.push(base);
                                rem -= Math.pow(base, k);
                            }
                            return parts;
                        }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            var parts = greedyDecompose(nVal, kVal);
                            var powLabel = kVal === 2 ? 'squares' : (kVal === 3 ? 'cubes' : kVal + 'th powers');

                            viz.screenText(nVal + ' as a sum of ' + powLabel + ' (greedy)', viz.width / 2, 22, viz.colors.white, 14);

                            // Show decomposition as stacked colored boxes
                            var expr = parts.map(function(b) { return b + '^' + kVal; }).join(' + ');
                            var numExpr = parts.map(function(b) { return Math.pow(b, kVal); }).join(' + ');
                            viz.screenText(expr, viz.width / 2, 48, viz.colors.teal, 12);
                            viz.screenText('= ' + numExpr + ' = ' + nVal, viz.width / 2, 66, viz.colors.text, 11);
                            viz.screenText(parts.length + ' summands needed', viz.width / 2, 86, viz.colors.orange, 12);

                            // Visual: show each k-th power as a group of unit squares
                            var boxSize = Math.min(14, Math.max(4, 400 / nVal));
                            var startY = 110;
                            var xCur = 30;
                            var rowH = boxSize + 2;
                            var maxPerRow = Math.floor((viz.width - 60) / (boxSize + 1));

                            var colors = [viz.colors.blue, viz.colors.teal, viz.colors.orange, viz.colors.purple, viz.colors.green, viz.colors.pink, viz.colors.yellow, viz.colors.red];
                            var unitIdx = 0;
                            xCur = 30;
                            var yCur = startY;

                            for (var p = 0; p < parts.length; p++) {
                                var pw = Math.pow(parts[p], kVal);
                                var col = colors[p % colors.length];
                                for (var u = 0; u < pw; u++) {
                                    if (xCur + boxSize > viz.width - 20) {
                                        xCur = 30;
                                        yCur += rowH;
                                    }
                                    ctx.fillStyle = col + 'cc';
                                    ctx.fillRect(xCur, yCur, boxSize - 1, boxSize - 1);
                                    xCur += boxSize + 1;
                                    unitIdx++;
                                }
                                // small gap between groups
                                xCur += 3;
                            }

                            // g(k) and G(k) info
                            var gk;
                            if (kVal === 2) gk = 4;
                            else if (kVal === 3) gk = 9;
                            else if (kVal === 4) gk = 19;
                            else gk = '?';
                            var Gk;
                            if (kVal === 2) Gk = 4;
                            else if (kVal === 3) Gk = '<=7';
                            else if (kVal === 4) Gk = '<=16';
                            else Gk = '?';

                            viz.screenText('g(' + kVal + ') = ' + gk + '    G(' + kVal + ') ' + Gk, viz.width / 2, viz.height - 20, viz.colors.text, 11);
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Show that \\(g(2) \\geq 4\\) by finding an integer that cannot be written as the sum of 3 squares.',
                    hint: 'Legendre\'s three-square theorem states that \\(n\\) is a sum of three squares if and only if \\(n\\) is not of the form \\(4^a(8b+7)\\).',
                    solution: 'The number \\(7\\) cannot be written as the sum of 3 squares: checking all possibilities, \\(7 = 4+1+1+1\\) requires 4 squares. More generally, \\(n = 7\\) is of the form \\(4^0(8 \\cdot 0 + 7)\\), so by Legendre\'s theorem it is not a sum of 3 squares. Hence \\(g(2) \\geq 4\\).'
                },
                {
                    question: 'Verify the formula \\(g(k) = 2^k + \\lfloor (3/2)^k \\rfloor - 2\\) for \\(k = 2, 3, 4\\).',
                    hint: 'Compute \\(\\lfloor (3/2)^k \\rfloor\\) for each \\(k\\) and check against the known values.',
                    solution: 'For \\(k=2\\): \\(\\lfloor (3/2)^2 \\rfloor = \\lfloor 2.25 \\rfloor = 2\\), so \\(g(2) = 4 + 2 - 2 = 4\\). For \\(k=3\\): \\(\\lfloor (3/2)^3 \\rfloor = \\lfloor 3.375 \\rfloor = 3\\), so \\(g(3) = 8 + 3 - 2 = 9\\). For \\(k=4\\): \\(\\lfloor (3/2)^4 \\rfloor = \\lfloor 5.0625 \\rfloor = 5\\), so \\(g(4) = 16 + 5 - 2 = 19\\). All match the known values.'
                }
            ]
        },

        // ================================================================
        // SECTION 5: Goldbach and Vinogradov
        // ================================================================
        {
            id: 'sec-goldbach',
            title: 'Goldbach & Vinogradov',
            content: `
<h2>Goldbach's Conjecture and Vinogradov's Theorem</h2>

<div class="env-block intuition">
    <div class="env-title">The Conjectures</div>
    <div class="env-body">
        <p><strong>Binary Goldbach</strong> (1742): Every even integer \\(\\geq 4\\) is a sum of two primes. <em>Still open.</em></p>
        <p><strong>Ternary Goldbach</strong>: Every odd integer \\(\\geq 7\\) is a sum of three primes. <em>Proved by Vinogradov (1937) for all sufficiently large odd integers, and by Helfgott (2013) for all odd integers \\(\\geq 7\\).</em></p>
    </div>
</div>

<h3>Vinogradov's Approach</h3>

<p>Define the von Mangoldt generating function</p>

\\[
f(\\alpha) = \\sum_{p \\leq n} (\\log p)\\, e(p\\alpha),
\\]

<p>or equivalently using the von Mangoldt function</p>

\\[
f(\\alpha) = \\sum_{m \\leq n} \\Lambda(m)\\, e(m\\alpha).
\\]

<p>The number of representations of \\(n\\) as a sum of three primes (weighted by \\(\\log\\)) is</p>

\\[
r_3(n) = \\int_0^1 f(\\alpha)^3\\, e(-n\\alpha)\\, d\\alpha.
\\]

<div class="env-block theorem">
    <div class="env-title">Theorem 15.3 (Vinogradov, 1937)</div>
    <div class="env-body">
        <p>For every odd integer \\(n \\geq n_0\\),</p>
        \\[r_3(n) = \\frac{1}{2}\\mathfrak{S}(n)\\, n^2 + O\\left(\\frac{n^2}{(\\log n)^A}\\right),\\]
        <p>where \\(\\mathfrak{S}(n)\\) is a singular series satisfying \\(\\mathfrak{S}(n) \\geq c > 0\\) for odd \\(n\\), and \\(A > 0\\) is arbitrary.</p>
    </div>
</div>

<p>Since \\(r_3(n) > 0\\) for large odd \\(n\\), this proves the ternary Goldbach conjecture for all sufficiently large odd integers.</p>

<h3>The Singular Series for Goldbach</h3>

<p>For the ternary Goldbach problem, the singular series is</p>

\\[
\\mathfrak{S}(n) = \\prod_{p \\mid n} \\left(1 - \\frac{1}{(p-1)^2}\\right) \\prod_{p \\nmid n} \\left(1 + \\frac{1}{(p-1)^3}\\right).
\\]

<p>For odd \\(n\\), the factor at \\(p = 2\\) ensures \\(\\mathfrak{S}(n) > 0\\). For even \\(n\\), the factor at \\(p = 2\\) vanishes (reflecting the parity obstruction: an even number cannot be a sum of three odd primes unless one of them is 2).</p>

<h3>Key Ingredients</h3>

<p>Vinogradov's proof requires two fundamental estimates:</p>

<div class="env-block theorem">
    <div class="env-title">Vinogradov's Exponential Sum Bound</div>
    <div class="env-body">
        <p>For \\(\\alpha\\) in the minor arcs (not close to any rational \\(a/q\\) with \\(q \\leq (\\log n)^B\\)),</p>
        \\[\\left|\\sum_{m \\leq n} \\Lambda(m)\\, e(m\\alpha)\\right| \\ll \\frac{n}{(\\log n)^A}\\]
        <p>for any \\(A > 0\\) (with the implied constant depending on \\(A\\)).</p>
    </div>
</div>

<p>This is where Vinogradov's method diverges from Hardy-Littlewood's: Vinogradov uses Type I and Type II sums (bilinear decompositions) rather than the Generalized Riemann Hypothesis, making the result unconditional.</p>

<div class="viz-placeholder" data-viz="viz-goldbach-counting"></div>
`,
            visualizations: [
                {
                    id: 'viz-goldbach-counting',
                    title: 'Goldbach Representations',
                    description: 'For each even number n, count the number of ways to write n = p + q with p, q prime (binary Goldbach). The count r_2(n) grows roughly as n/log^2(n), modulated by the singular series. For the ternary version, the count grows as n^2.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 380,
                            originX: 55, originY: 340, scale: 1
                        });

                        var maxN = 100;
                        VizEngine.createSlider(controls, 'max N', 20, 300, maxN, 10, function(v) {
                            maxN = Math.round(v);
                            draw();
                        });

                        var primeSet = {};
                        var primes = VizEngine.sievePrimes(1000);
                        for (var i = 0; i < primes.length; i++) primeSet[primes[i]] = true;

                        function goldbachCount(n) {
                            if (n < 4 || n % 2 !== 0) return 0;
                            var count = 0;
                            for (var p = 2; p <= n / 2; p++) {
                                if (primeSet[p] && primeSet[n - p]) count++;
                            }
                            return count;
                        }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var plotW = viz.width - 80;
                            var plotH = 290;
                            var plotX0 = 60;
                            var plotY0 = 30;

                            viz.screenText('Binary Goldbach: r_2(n) for even n', viz.width / 2, 16, viz.colors.white, 14);

                            // Compute counts
                            var counts = [];
                            var maxCount = 0;
                            for (var n = 4; n <= maxN; n += 2) {
                                var c = goldbachCount(n);
                                counts.push({n: n, count: c});
                                if (c > maxCount) maxCount = c;
                            }
                            if (maxCount < 1) maxCount = 1;

                            // Axes
                            ctx.strokeStyle = viz.colors.axis;
                            ctx.lineWidth = 1;
                            ctx.beginPath();
                            ctx.moveTo(plotX0, plotY0);
                            ctx.lineTo(plotX0, plotY0 + plotH);
                            ctx.lineTo(plotX0 + plotW, plotY0 + plotH);
                            ctx.stroke();

                            // Bars
                            var barW = Math.max(1, Math.min(8, plotW / counts.length - 1));
                            for (var j = 0; j < counts.length; j++) {
                                var c = counts[j];
                                var bx = plotX0 + (j / counts.length) * plotW;
                                var bh = (c.count / maxCount) * plotH;
                                var t = c.count / maxCount;
                                ctx.fillStyle = t > 0.5 ? viz.colors.blue : viz.colors.teal;
                                ctx.fillRect(bx, plotY0 + plotH - bh, barW, bh);
                            }

                            // x labels
                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '9px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'top';
                            var step = Math.max(2, Math.floor(counts.length / 10)) * 2;
                            for (var j2 = 0; j2 < counts.length; j2 += step / 2) {
                                var c2 = counts[j2];
                                if (c2) {
                                    var lx = plotX0 + (j2 / counts.length) * plotW;
                                    ctx.fillText(c2.n, lx, plotY0 + plotH + 3);
                                }
                            }

                            // y label
                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '10px -apple-system,sans-serif';
                            ctx.textAlign = 'right';
                            ctx.fillText(maxCount, plotX0 - 4, plotY0 + 8);
                            ctx.fillText('0', plotX0 - 4, plotY0 + plotH);

                            viz.screenText('Every even n >= 4 has at least one representation (unproven in general!)', viz.width / 2, viz.height - 14, viz.colors.text, 10);
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Why does the circle method for binary Goldbach (\\(s = 2\\) primes) fail where ternary (\\(s = 3\\)) succeeds?',
                    hint: 'Think about the power of the minor arc bound versus the density of primes.',
                    solution: 'For \\(s\\) summands, the major arc contribution is \\(\\sim n^{s-1}/(\\log n)^s\\). The minor arc integral is bounded by \\(\\sup_{\\mathfrak{m}}|f|^{s-2} \\int_0^1 |f|^2\\,d\\alpha\\). By Parseval, \\(\\int |f|^2 \\sim n \\log n\\), and the minor arc sup is \\(\\ll n/(\\log n)^A\\). For \\(s = 3\\), the minor arc is \\(O(n^2/(\\log n)^A)\\), which is \\(o(n^2/(\\log n)^3)\\) for \\(A > 3\\). For \\(s = 2\\), we need the minor arc to be \\(o(n/(\\log n)^2)\\), but we only get \\(O(n/(\\log n)^A) \\cdot 1\\) which barely competes with the main term; the method does not provide enough "room".'
                }
            ]
        },

        // ================================================================
        // SECTION 6: The Singular Series
        // ================================================================
        {
            id: 'sec-singular-series',
            title: 'The Singular Series',
            content: `
<h2>The Singular Series</h2>

<p>The singular series is the arithmetic heart of the circle method. It encodes the <strong>local obstructions</strong> to representing \\(n\\) as a sum.</p>

<h3>Definition</h3>

<div class="env-block definition">
    <div class="env-title">Definition (Singular Series)</div>
    <div class="env-body">
        <p>For the representation of \\(n\\) as a sum of \\(s\\) elements from \\(\\mathcal{A}\\), the singular series is</p>
        \\[\\mathfrak{S}(n) = \\sum_{q=1}^{\\infty} \\sum_{\\substack{a=1 \\\\ \\gcd(a,q)=1}}^{q} \\left(\\frac{S(q,a)}{q}\\right)^s e(-an/q),\\]
        <p>where \\(S(q,a) = \\sum_{r=1}^{q} e(r^k a/q)\\) is a Gauss-type exponential sum.</p>
    </div>
</div>

<h3>Euler Product Form</h3>

<p>The series has an Euler product over primes:</p>

\\[
\\mathfrak{S}(n) = \\prod_{p} \\beta_p(n),
\\]

<p>where \\(\\beta_p(n)\\) measures the local density of solutions modulo \\(p^j\\) for all \\(j\\). Specifically,</p>

\\[
\\beta_p(n) = \\lim_{j \\to \\infty} \\frac{\\#\\{(x_1,\\ldots,x_s) \\in (\\mathbb{Z}/p^j\\mathbb{Z})^s : x_1^k + \\cdots + x_s^k \\equiv n \\pmod{p^j}\\}}{p^{j(s-1)}}.
\\]

<p>This product converges absolutely when \\(s\\) is large enough relative to \\(k\\).</p>

<div class="env-block intuition">
    <div class="env-title">Interpretation</div>
    <div class="env-body">
        <p>Think of \\(\\mathfrak{S}(n)\\) as a "correction factor" that accounts for the fact that the \\(k\\)-th powers are not uniformly distributed modulo each prime. If \\(\\mathfrak{S}(n) = 0\\), there is a local obstruction (some prime \\(p\\) for which the equation has no solution mod \\(p\\)). If \\(\\mathfrak{S}(n) > 0\\), there is no local obstruction, and the circle method proves the representation exists.</p>
    </div>
</div>

<h3>Local-Global Principle</h3>

<p>The circle method embodies a form of the <strong>local-global principle</strong>: the integer \\(n\\) has a representation as a sum of \\(k\\)-th powers if and only if</p>
<ol>
    <li><strong>Local condition</strong>: \\(\\mathfrak{S}(n) > 0\\) (no \\(p\\)-adic obstruction for any prime \\(p\\)).</li>
    <li><strong>Archimedean condition</strong>: \\(\\mathfrak{J}(n) > 0\\) (the "real" or "continuous" model allows it, which is automatic for \\(n\\) in the right range).</li>
</ol>

<p>When \\(s\\) is large enough and both conditions hold, the circle method gives</p>

\\[
r_{s,k}(n) \\sim \\mathfrak{S}(n) \\cdot \\mathfrak{J}(n) > 0,
\\]

<p>proving the representation exists.</p>

<h3>Example: Sums of Squares</h3>

<p>For \\(k = 2\\) and \\(s = 4\\) (four squares), the singular series gives the exact formula (when combined with modular form theory):</p>

\\[
r_4(n) = 8\\sum_{4 \\nmid d \\mid n} d.
\\]

<p>This is Jacobi's four-square theorem. The singular series for four squares equals \\(8\\sum_{4 \\nmid d \\mid n} d / (\\pi^2 n)\\), recovering the exact arithmetic.</p>

<div class="viz-placeholder" data-viz="viz-singular-series"></div>
`,
            visualizations: [
                {
                    id: 'viz-singular-series',
                    title: 'The Singular Series: Local Densities',
                    description: 'Visualize the local factor beta_p(n) for the sum-of-squares problem. Each prime p contributes a factor that depends on n mod p. The product of all these factors gives the singular series.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 380,
                            originX: 0, originY: 0, scale: 1
                        });

                        var nVal = 15;
                        var sVal = 4;

                        VizEngine.createSlider(controls, 'n', 1, 50, nVal, 1, function(v) {
                            nVal = Math.round(v);
                            draw();
                        });
                        VizEngine.createSlider(controls, 's (summands)', 2, 8, sVal, 1, function(v) {
                            sVal = Math.round(v);
                            draw();
                        });

                        var smallPrimes = [2, 3, 5, 7, 11, 13, 17, 19, 23];

                        // Count solutions to x1^2 + ... + xs^2 = n mod p
                        function localCount(p, n, s) {
                            // brute force for small p
                            if (s === 1) {
                                var count = 0;
                                for (var x = 0; x < p; x++) {
                                    if ((x * x) % p === n % p) count++;
                                }
                                return count;
                            }
                            var total = 0;
                            for (var x = 0; x < p; x++) {
                                var rem = ((n - x * x) % p + p) % p;
                                total += localCount(p, rem, s - 1);
                            }
                            return total;
                        }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            viz.screenText('Singular series factors for n = ' + nVal + ', s = ' + sVal + ' squares', viz.width / 2, 20, viz.colors.white, 13);

                            var barW = 40;
                            var barGap = 12;
                            var totalW = smallPrimes.length * (barW + barGap);
                            var startX = (viz.width - totalW) / 2;
                            var barBottom = 300;
                            var barMaxH = 200;

                            var product = 1;
                            var factors = [];

                            for (var i = 0; i < smallPrimes.length; i++) {
                                var p = smallPrimes[i];
                                var cnt = localCount(p, nVal, sVal);
                                var expected = Math.pow(p, sVal - 1); // "random" expectation
                                var beta = cnt / expected;
                                factors.push({p: p, beta: beta, cnt: cnt, expected: expected});
                                product *= beta;
                            }

                            // Find max beta for scaling
                            var maxBeta = 0;
                            for (var j = 0; j < factors.length; j++) {
                                if (factors[j].beta > maxBeta) maxBeta = factors[j].beta;
                            }
                            if (maxBeta < 1.5) maxBeta = 1.5;

                            // Draw reference line at beta = 1
                            var refY = barBottom - (1 / maxBeta) * barMaxH;
                            ctx.strokeStyle = viz.colors.axis;
                            ctx.lineWidth = 1;
                            ctx.setLineDash([4, 3]);
                            ctx.beginPath();
                            ctx.moveTo(startX - 10, refY);
                            ctx.lineTo(startX + totalW, refY);
                            ctx.stroke();
                            ctx.setLineDash([]);
                            viz.screenText('beta = 1 (no bias)', startX - 15, refY, viz.colors.text, 9, 'right');

                            for (var k = 0; k < factors.length; k++) {
                                var f = factors[k];
                                var bx = startX + k * (barW + barGap);
                                var bh = (f.beta / maxBeta) * barMaxH;

                                var col = f.beta > 1 ? viz.colors.teal : (f.beta < 0.8 ? viz.colors.red : viz.colors.blue);
                                ctx.fillStyle = col + 'aa';
                                ctx.fillRect(bx, barBottom - bh, barW, bh);
                                ctx.strokeStyle = col;
                                ctx.lineWidth = 1;
                                ctx.strokeRect(bx, barBottom - bh, barW, bh);

                                // Label
                                ctx.fillStyle = viz.colors.white;
                                ctx.font = '11px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.textBaseline = 'top';
                                ctx.fillText('p=' + f.p, bx + barW / 2, barBottom + 4);
                                ctx.fillStyle = viz.colors.text;
                                ctx.font = '9px -apple-system,sans-serif';
                                ctx.fillText(f.beta.toFixed(2), bx + barW / 2, barBottom - bh - 14);
                            }

                            viz.screenText('Product (partial): ' + product.toFixed(4), viz.width / 2, barBottom + 30, viz.colors.orange, 12);
                            viz.screenText('beta_p > 1: more solutions mod p than random. beta_p < 1: fewer.', viz.width / 2, viz.height - 14, viz.colors.text, 10);
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Show that for the sum of 4 squares, every \\(n\\) has a solution modulo \\(p\\) for every prime \\(p\\). Why does this imply \\(\\mathfrak{S}(n) > 0\\)?',
                    hint: 'By the Chevalley-Warning theorem, the number of solutions to \\(x_1^2 + \\cdots + x_s^2 \\equiv n \\pmod{p}\\) is divisible by \\(p\\) when \\(s > 2 \\cdot 2 = 4\\). For \\(s = 4\\), use direct counting.',
                    solution: 'For \\(s = 4\\) and any prime \\(p\\), the equation \\(x_1^2 + x_2^2 + x_3^2 + x_4^2 \\equiv n \\pmod{p}\\) has solutions. Each \\(x^2\\) takes \\((p+1)/2\\) distinct values mod \\(p\\), so \\(x_1^2 + x_2^2\\) takes all values mod \\(p\\) (by a counting argument: the sets \\(\\{a^2 \\pmod{p}\\}\\) and \\(\\{n - b^2 \\pmod{p}\\}\\) each have size \\((p+1)/2\\), so they must intersect). Once two squares represent every residue, adding two more only increases the count. Since \\(\\beta_p(n) > 0\\) for every \\(p\\), the product \\(\\mathfrak{S}(n) = \\prod_p \\beta_p(n) > 0\\) (the product converges to a positive value since \\(\\beta_p \\to 1\\) rapidly as \\(p \\to \\infty\\)).'
                },
                {
                    question: 'Compute \\(\\beta_2(n)\\) for the sum of 4 squares when \\(n\\) is odd versus when \\(n \\equiv 0 \\pmod{4}\\).',
                    hint: 'Count solutions to \\(x_1^2 + x_2^2 + x_3^2 + x_4^2 \\equiv n \\pmod{2}\\) and also modulo 4.',
                    solution: 'Modulo 2: squares are 0 or 1. For \\(n\\) odd, we need an odd number of odd \\(x_i\\), i.e., 1 or 3 out of 4: \\(\\binom{4}{1} + \\binom{4}{3} = 8\\) solutions out of \\(2^4 = 16\\), giving \\(\\beta_2 = 8/8 = 1\\). For \\(n\\) even, need 0, 2, or 4 odd: \\(1 + 6 + 1 = 8\\) out of 16, again \\(\\beta_2 = 1\\). For a more refined analysis modulo \\(2^j\\), the 2-adic factor depends on the exact power of 2 dividing \\(n\\).'
                }
            ]
        },

        // ================================================================
        // SECTION 7: The Bridge — From Arcs to Asymptotics
        // ================================================================
        {
            id: 'sec-bridge',
            title: 'The Bridge: From Arcs to Asymptotics',
            content: `
<h2>The Bridge: From Arcs to Asymptotics</h2>

<p>We now synthesize the pieces to see how the circle method produces a final asymptotic formula.</p>

<h3>Step 1: Split the Integral</h3>

\\[
r_s(n) = \\int_{\\mathfrak{M}} f(\\alpha)^s\\, e(-n\\alpha)\\, d\\alpha + \\int_{\\mathfrak{m}} f(\\alpha)^s\\, e(-n\\alpha)\\, d\\alpha.
\\]

<h3>Step 2: Evaluate Major Arcs</h3>

<p>On each major arc \\(\\mathfrak{M}(q,a)\\), substitute \\(\\alpha = a/q + \\beta\\) and approximate:</p>

\\[
f(a/q + \\beta) \\approx \\frac{S(q,a)}{q} \\cdot v(\\beta),
\\]

<p>where \\(S(q,a)\\) is the Gauss sum and \\(v(\\beta) = \\int_0^{n^{1/k}} e(t^k \\beta)\\, dt\\) is a smooth integral. Then</p>

\\[
\\int_{\\mathfrak{M}(q,a)} f^s\\, e(-n\\alpha)\\, d\\alpha \\approx \\frac{S(q,a)^s}{q^s}\\, e(-an/q) \\int_{-Q/n}^{Q/n} v(\\beta)^s\\, e(-n\\beta)\\, d\\beta.
\\]

<p>Summing over all major arcs and extending the \\(\\beta\\)-integral to \\((-\\infty, \\infty)\\) (with negligible error), we get</p>

\\[
\\int_{\\mathfrak{M}} f^s\\, e(-n\\alpha)\\, d\\alpha = \\mathfrak{S}(n) \\cdot \\mathfrak{J}(n) + \\text{error},
\\]

<p>where</p>

\\[
\\mathfrak{S}(n) = \\sum_{q=1}^{\\infty} \\sum_{\\substack{a=1 \\\\ (a,q)=1}}^{q} \\frac{S(q,a)^s}{q^s}\\, e(-an/q), \\qquad
\\mathfrak{J}(n) = \\int_{-\\infty}^{\\infty} v(\\beta)^s\\, e(-n\\beta)\\, d\\beta.
\\]

<h3>Step 3: Bound Minor Arcs</h3>

<p>The minor arc bound typically uses:</p>

\\[
\\left|\\int_{\\mathfrak{m}} f^s\\, e(-n\\alpha)\\, d\\alpha\\right| \\leq \\sup_{\\alpha \\in \\mathfrak{m}} |f(\\alpha)|^{s-2} \\cdot \\int_0^1 |f(\\alpha)|^2\\, d\\alpha.
\\]

<p>By Parseval's theorem (or direct counting), \\(\\int_0^1 |f|^2\\, d\\alpha\\) equals the number of elements in \\(\\mathcal{A}\\) up to \\(n\\), which is \\(\\sim n^{1/k}\\). The sup on minor arcs is bounded by Weyl/Vinogradov:</p>

\\[
\\sup_{\\mathfrak{m}} |f(\\alpha)| \\leq n^{1/k(1 - c_k + \\varepsilon)}.
\\]

<p>Combining, the minor arc contribution is</p>

\\[
\\ll n^{(1/k)(1-c_k+\\varepsilon)(s-2)} \\cdot n^{1/k},
\\]

<p>which is \\(o(n^{s/k - 1})\\) (the major arc order) when \\(s\\) is large enough.</p>

<h3>Step 4: Combine</h3>

<div class="env-block theorem">
    <div class="env-title">Theorem 15.4 (The Asymptotic Formula)</div>
    <div class="env-body">
        <p>For \\(s \\geq s_0(k)\\) sufficiently large,</p>
        \\[r_{s,k}(n) = \\mathfrak{S}(n) \\cdot \\mathfrak{J}(n) \\cdot (1 + o(1)).\\]
        <p>In particular, \\(r_{s,k}(n) > 0\\) for all large \\(n\\) satisfying \\(\\mathfrak{S}(n) > 0\\), proving that every such \\(n\\) is a sum of \\(s\\) positive \\(k\\)-th powers.</p>
    </div>
</div>

<h3>The Singular Integral</h3>

<p>The singular integral has an explicit evaluation:</p>

\\[
\\mathfrak{J}(n) = \\frac{\\Gamma(1 + 1/k)^s}{\\Gamma(s/k)} \\cdot n^{s/k - 1}.
\\]

<p>This is the "volume factor": the number of real \\(s\\)-tuples \\((t_1, \\ldots, t_s) \\in [0, n^{1/k}]^s\\) with \\(t_1^k + \\cdots + t_s^k = n\\), scaled appropriately.</p>

<h3>Modern Developments</h3>

<p>The biggest advance in recent decades is the resolution of the <strong>main conjecture in Vinogradov's mean value theorem</strong> by Bourgain, Demeter, and Guth (2016), using decoupling theory from harmonic analysis. This gives optimal bounds for</p>

\\[
\\int_0^1 |f(\\alpha)|^{2s}\\, d\\alpha,
\\]

<p>which in turn yields the best known bounds for \\(G(k)\\): for all \\(k \\geq 1\\),</p>

\\[
G(k) \\leq 2k^2 - 2k + O(1) \\quad \\text{(classical)}, \\qquad G(k) \\leq k(k+1)/2 + 1 \\quad \\text{(after BDG 2016)}.
\\]

<p>For \\(k = 3\\), the current best is \\(G(3) \\leq 7\\) (Vaughan, 1986).</p>

<div class="env-block remark">
    <div class="env-title">Beyond Number Theory</div>
    <div class="env-body">
        <p>The circle method has been applied far beyond its original domain: to counting lattice points on varieties, to problems in combinatorics (Roth's theorem on arithmetic progressions), and to function field analogues. Green and Tao's proof that the primes contain arbitrarily long arithmetic progressions uses a "transference principle" that can be viewed as a generalization of the circle method philosophy.</p>
    </div>
</div>
`,
            visualizations: [],
            exercises: [
                {
                    question: 'Compute the singular integral \\(\\mathfrak{J}(n)\\) for \\(k = 2\\), \\(s = 4\\). Show it equals \\(\\frac{\\pi^2}{2} n\\).',
                    hint: 'Use the substitution \\(t_i = \\sqrt{n}\\, u_i\\) to reduce to a standard integral over the surface \\(u_1^2 + \\cdots + u_4^2 = 1\\).',
                    solution: 'With \\(k=2\\), \\(s=4\\), \\(\\mathfrak{J}(n) = \\frac{\\Gamma(3/2)^4}{\\Gamma(2)} n^{2-1} = \\frac{(\\sqrt{\\pi}/2)^4}{1} n = \\frac{\\pi^2}{16} n\\). (The exact coefficient depends on normalization conventions; with the standard one used in the four-squares formula, adjusting for the factor \\(8\\) in the Gauss sum computation gives the classical result \\(r_4(n) = 8\\sum_{4 \\nmid d \\mid n} d\\).)'
                },
                {
                    question: 'Why is the condition \\(s \\geq s_0(k)\\) necessary? What goes wrong if \\(s\\) is too small?',
                    hint: 'Consider the minor arc bound versus the major arc main term.',
                    solution: 'When \\(s\\) is too small, the minor arc contribution is not negligible compared to the major arc term. Specifically, the bound \\(\\sup_{\\mathfrak{m}}|f|^{s-2} \\int |f|^2\\) must be \\(o(n^{s/k-1})\\). Since \\(\\int |f|^2 \\sim n^{1/k}\\), we need \\(n^{(1/k)(1-\\delta)(s-2)} \\cdot n^{1/k} = o(n^{s/k-1})\\), which simplifies to \\((s-2)\\delta > 0\\), i.e., \\(\\delta > 0\\) and \\(s \\geq 3\\). But the actual \\(\\delta\\) depends on \\(k\\) and is small, so \\(s\\) must be correspondingly large. The optimal threshold \\(s_0(k)\\) is the central question in Waring\'s problem.'
                }
            ]
        }
    ]
});
