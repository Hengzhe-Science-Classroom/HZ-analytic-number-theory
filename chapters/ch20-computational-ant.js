window.CHAPTERS = window.CHAPTERS || [];
window.CHAPTERS.push({
    id: 'ch20',
    number: 20,
    title: 'Computational Analytic Number Theory',
    subtitle: 'Theory meets machine',
    sections: [
        // ================================================================
        // SECTION 1: Theory Meets Machine
        // ================================================================
        {
            id: 'sec-motivation',
            title: 'Theory Meets Machine',
            content: `
<h2>Theory Meets Machine</h2>

<div class="env-block intuition">
    <div class="env-title">Why Computation Changed Everything</div>
    <div class="env-body">
        <p>In 1936, Alan Turing proved that the Entscheidungsproblem is undecidable. Three years later, he used pencil-and-paper computation to verify the first 1,041 non-trivial zeros of the Riemann zeta function. In 2004, Xavier Gourdon and Patrick Demichel verified the first 10<sup>13</sup> zeros. The journey from 1,041 to ten trillion zeros is not just a story about faster computers. It is a story about new mathematics developed in service of computation.</p>
        <p>Computational analytic number theory asks: how do you actually <em>evaluate</em> the objects of analytic number theory, and what do those evaluations tell us?</p>
    </div>
</div>

<h3>The Two Directions</h3>

<p>The interplay between theory and computation in analytic number theory runs in two directions:</p>

<ul>
    <li><strong>Theory enabling computation.</strong> The Riemann-Siegel formula replaced a slowly converging Euler product with an expression computable in \\(O(t^{1/2})\\) operations at height \\(t\\). Meissel and Lehmer turned the prime counting function from a sieve problem into a combinatorial recursion. AKS turned primality from a probabilistic matter into a deterministic polynomial-time algorithm.</li>
    <li><strong>Computation enabling theory.</strong> Numerical exploration of zeros suggested the GUE (random matrix) connection before any theoretical explanation existed. Computational searches have bounded exceptional zeros, located large prime gaps, and produced data that drives conjectures.</li>
</ul>

<h3>Complexity in Number Theory</h3>

<p>A recurring theme is the tension between the <em>size</em> of an arithmetic object (typically \\(\\log N\\) bits for an integer \\(N\\)) and the <em>cost</em> of a computation. Primality testing requires \\(O((\\log N)^k)\\) operations for various \\(k\\); factoring requires exponential time in \\(\\log N\\) under current algorithms. Computing \\(\\pi(x)\\) naively requires sieving up to \\(x\\), but analytic methods reduce this to \\(O(x^{2/3})\\).</p>

<div class="env-block remark">
    <div class="env-title">What This Chapter Covers</div>
    <div class="env-body">
        <p>We tour four major computations at the heart of modern analytic number theory:</p>
        <ol>
            <li>The <strong>Riemann-Siegel formula</strong> for evaluating \\(\\zeta(1/2 + it)\\).</li>
            <li><strong>Turing's method</strong> for verifying the Riemann Hypothesis up to a height \\(T\\).</li>
            <li>The <strong>Meissel-Lehmer algorithm</strong> for computing \\(\\pi(x)\\) efficiently.</li>
            <li><strong>Miller-Rabin and AKS</strong> for primality testing.</li>
        </ol>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-record-timeline"></div>
`,
            visualizations: [
                {
                    id: 'viz-record-timeline',
                    title: 'Computational Records in Analytic Number Theory',
                    description: 'A timeline of major computational milestones: verified zeros of zeta, largest known primes, and pi(x) computations. Click a dot to see details.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, { width: 680, height: 360, originX: 80, originY: 300, scale: 1 });

                        var records = [
                            { year: 1903, label: 'Gram: 15 zeros', value: Math.log10(15), category: 'zeros', detail: 'J.-P. Gram verified 15 zeros by hand calculation.' },
                            { year: 1936, label: 'Titchmarsh: 1041 zeros', value: Math.log10(1041), category: 'zeros', detail: 'E.C. Titchmarsh used a differential analyzer, 1,041 zeros.' },
                            { year: 1956, label: 'Lehmer: ~25000 zeros', value: Math.log10(25000), category: 'zeros', detail: 'D.H. Lehmer used early computers, ~25,000 zeros.' },
                            { year: 1968, label: 'Rosser et al.: 3.5M zeros', value: Math.log10(3500000), category: 'zeros', detail: 'Rosser, Yohe, Schoenfeld: 3.5 million zeros.' },
                            { year: 1986, label: 'Van de Lune et al.: 1.5B zeros', value: Math.log10(1.5e9), category: 'zeros', detail: 'van de Lune, te Riele, Winter: 1.5 billion zeros.' },
                            { year: 2004, label: 'Gourdon: 10\u00B3 zeros', value: 13, category: 'zeros', detail: 'Xavier Gourdon & Patrick Demichel: 10\u00B9\u00B3 zeros verified.' },
                            { year: 1951, label: '\u03C0(10\u2076)', value: 6, category: 'pi', detail: 'Mapes computed \u03C0(10\u2076) = 78,498.' },
                            { year: 1985, label: '\u03C0(4\u00D710\u00B9\u00B6)', value: 16.6, category: 'pi', detail: 'Lagarias & Odlyzko analytic method, O(x^(1/2+\u03B5)).' },
                            { year: 2007, label: '\u03C0(10\u00B2\u00B4)', value: 24, category: 'pi', detail: 'Oliveira e Silva: \u03C0(10\u00B2\u00B4) computed.' },
                        ];

                        var minYear = 1895, maxYear = 2015;
                        var minVal = 0, maxVal = 25;
                        var padL = 80, padR = 30, padT = 40, padB = 50;
                        var W = viz.width - padL - padR;
                        var H = viz.height - padT - padB;

                        function xPx(year) { return padL + (year - minYear) / (maxYear - minYear) * W; }
                        function yPx(val) { return padT + H - (val / maxVal) * H; }

                        var selected = null;

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            // Axes
                            ctx.strokeStyle = viz.colors.axis; ctx.lineWidth = 1.5;
                            ctx.beginPath(); ctx.moveTo(padL, padT); ctx.lineTo(padL, padT + H); ctx.lineTo(padL + W, padT + H); ctx.stroke();

                            // Y-axis labels (log10 scale)
                            ctx.fillStyle = viz.colors.text; ctx.font = '10px -apple-system,sans-serif';
                            ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
                            for (var v = 0; v <= 24; v += 4) {
                                var yy = yPx(v);
                                ctx.fillText('10\u207F'.replace('n', v), padL - 6, yy);
                                ctx.strokeStyle = viz.colors.grid; ctx.lineWidth = 0.5;
                                ctx.beginPath(); ctx.moveTo(padL, yy); ctx.lineTo(padL + W, yy); ctx.stroke();
                            }

                            // X-axis labels
                            ctx.fillStyle = viz.colors.text; ctx.textAlign = 'center'; ctx.textBaseline = 'top';
                            for (var yr = 1910; yr <= 2010; yr += 20) {
                                var xx = xPx(yr);
                                ctx.fillText(yr, xx, padT + H + 6);
                                ctx.strokeStyle = viz.colors.grid; ctx.lineWidth = 0.5;
                                ctx.beginPath(); ctx.moveTo(xx, padT); ctx.lineTo(xx, padT + H); ctx.stroke();
                            }

                            // Axis labels
                            ctx.fillStyle = viz.colors.white; ctx.font = '12px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText('Year', padL + W / 2, padT + H + 30);
                            ctx.save(); ctx.translate(18, padT + H / 2); ctx.rotate(-Math.PI / 2);
                            ctx.fillText('log\u2081\u2080(count)', 0, 0); ctx.restore();

                            // Title
                            viz.screenText('Computational Records in Analytic Number Theory', viz.width / 2, 16, viz.colors.white, 13);

                            // Legend
                            ctx.font = '11px -apple-system,sans-serif'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
                            ctx.fillStyle = viz.colors.blue;
                            ctx.beginPath(); ctx.arc(padL + W - 130, padT + 12, 5, 0, Math.PI * 2); ctx.fill();
                            ctx.fillText('Zeros verified', padL + W - 120, padT + 12);
                            ctx.fillStyle = viz.colors.orange;
                            ctx.beginPath(); ctx.arc(padL + W - 130, padT + 28, 5, 0, Math.PI * 2); ctx.fill();
                            ctx.fillText('\u03C0(x) computed', padL + W - 120, padT + 28);

                            // Points
                            records.forEach(function(r, i) {
                                var rx = xPx(r.year);
                                var ry = yPx(r.value);
                                var col = r.category === 'zeros' ? viz.colors.blue : viz.colors.orange;
                                var radius = selected === i ? 9 : 6;
                                ctx.beginPath(); ctx.arc(rx, ry, radius, 0, Math.PI * 2);
                                ctx.fillStyle = col; ctx.fill();
                                if (selected === i) {
                                    ctx.strokeStyle = viz.colors.white; ctx.lineWidth = 2; ctx.stroke();
                                }
                            });

                            // Detail box for selected
                            if (selected !== null) {
                                var r = records[selected];
                                var bx = padL + 10, by = padT + 10, bw = 300, bh = 52;
                                ctx.fillStyle = '#1a1a40ee';
                                ctx.fillRect(bx, by, bw, bh);
                                ctx.strokeStyle = viz.colors.blue; ctx.lineWidth = 1;
                                ctx.strokeRect(bx, by, bw, bh);
                                ctx.fillStyle = viz.colors.white; ctx.font = 'bold 12px -apple-system,sans-serif';
                                ctx.textAlign = 'left'; ctx.textBaseline = 'top';
                                ctx.fillText(r.year + ': ' + r.label, bx + 8, by + 8);
                                ctx.fillStyle = viz.colors.text; ctx.font = '11px -apple-system,sans-serif';
                                ctx.fillText(r.detail, bx + 8, by + 28);
                            }
                        }

                        viz.canvas.addEventListener('click', function(e) {
                            var rect = viz.canvas.getBoundingClientRect();
                            var mx = e.clientX - rect.left, my = e.clientY - rect.top;
                            selected = null;
                            records.forEach(function(r, i) {
                                var rx = xPx(r.year), ry = yPx(r.value);
                                if (Math.sqrt((mx - rx) * (mx - rx) + (my - ry) * (my - ry)) < 12) selected = i;
                            });
                            draw();
                        });

                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Computing \\(\\zeta(1/2 + it)\\) naively by truncating the Dirichlet series at \\(N\\) terms requires \\(N \\approx t/(2\\pi)\\) terms for accuracy. The Riemann-Siegel formula uses \\(N \\approx \\sqrt{t/(2\\pi)}\\) terms. How much faster is this when \\(t = 10^6\\)?',
                    hint: 'Compute the ratio \\(N_{\\text{naive}} / N_{\\text{RS}}\\).',
                    solution: 'With \\(t = 10^6\\), \\(N_{\\text{naive}} \\approx 10^6/(2\\pi) \\approx 159{,}155\\) while \\(N_{\\text{RS}} \\approx \\sqrt{10^6/(2\\pi)} \\approx 399\\). The ratio is about 399, so the Riemann-Siegel formula is roughly 400 times faster at this height. At \\(t = 10^{13}\\), the ratio is \\(\\sqrt{t/(2\\pi)} \\approx 1.26 \\times 10^6\\).'
                }
            ]
        },

        // ================================================================
        // SECTION 2: The Riemann-Siegel Formula
        // ================================================================
        {
            id: 'sec-riemann-siegel',
            title: 'The Riemann-Siegel Formula',
            content: `
<h2>The Riemann-Siegel Formula</h2>

<p>To verify the Riemann Hypothesis computationally, we need to evaluate \\(\\zeta(1/2 + it)\\) for real \\(t\\). The Dirichlet series converges only for \\(\\text{Re}(s) > 1\\), so on the critical line we need a different representation.</p>

<h3>The Hardy Z-Function</h3>

<p>It is convenient to work with a real-valued function. Define</p>
\\[
Z(t) = e^{i\\theta(t)} \\zeta\\!\\left(\\tfrac{1}{2} + it\\right),
\\]
<p>where \\(\\theta(t)\\) is chosen so that \\(Z(t)\\) is real. The phase is</p>
\\[
\\theta(t) = \\arg \\Gamma\\!\\left(\\tfrac{1}{4} + \\tfrac{it}{2}\\right) - \\frac{t}{2} \\ln \\pi.
\\]
<p>The functional equation for \\(\\zeta\\) implies \\(Z(t) \\in \\mathbb{R}\\) and \\(|Z(t)| = |\\zeta(1/2+it)|\\). Zeros of \\(\\zeta\\) on the critical line correspond exactly to sign changes of \\(Z(t)\\).</p>

<div class="env-block theorem">
    <div class="env-title">Theorem (Riemann-Siegel Formula)</div>
    <div class="env-body">
        <p>For \\(t > 0\\), let \\(N = \\lfloor\\sqrt{t/(2\\pi)}\\rfloor\\) and \\(u = \\sqrt{t/(2\\pi)} - N\\). Then</p>
        \\[
        Z(t) = 2\\sum_{n=1}^{N} \\frac{\\cos(\\theta(t) - t\\ln n)}{\\sqrt{n}} + R(t),
        \\]
        <p>where the remainder \\(R(t) = O(t^{-1/4})\\) and can be expressed as an asymptotic series in powers of \\(t^{-1/2}\\) involving the function \\(\\Psi(u) = \\cos(2\\pi(u^2 - u - 1/16))/\\cos(2\\pi u)\\).</p>
    </div>
</div>

<p>The Stirling approximation gives a practical formula for \\(\\theta(t)\\):</p>
\\[
\\theta(t) \\approx \\frac{t}{2}\\ln\\frac{t}{2\\pi e} - \\frac{\\pi}{8} + \\frac{1}{48t} + \\cdots
\\]

<h3>Gram Points</h3>

<p>Gram points are the values \\(g_n\\) defined by \\(\\theta(g_n) = n\\pi\\). Between consecutive Gram points \\(g_n\\) and \\(g_{n+1}\\), the factor \\(e^{i\\theta(t)}\\) rotates by \\(\\pi\\), so \\(Z(t)\\) changes sign pattern predictably. <em>Gram's law</em> states that \\((-1)^n Z(g_n) > 0\\), which holds for most but not all \\(n\\) (Gram violations occur but are sparse).</p>

<div class="env-block definition">
    <div class="env-title">Definition (Gram Block)</div>
    <div class="env-body">
        <p>A <em>Gram block</em> \\([g_n, g_{n+m})\\) is a union of consecutive Gram intervals \\([g_j, g_{j+1})\\) that begins and ends where \\((-1)^j Z(g_j) > 0\\). A Gram block of length \\(m\\) is said to be <em>good</em> if it contains exactly \\(m\\) zeros. Turing's method uses good Gram blocks to certify zero counts.</p>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-riemann-siegel-z"></div>
`,
            visualizations: [
                {
                    id: 'viz-riemann-siegel-z',
                    title: 'Hardy Z-Function: Z(t) for t in [0, 50]',
                    description: 'Animated plot of Z(t) computed via the Riemann-Siegel formula. Watch it sweep, then use the slider to zoom to any t. Sign changes mark zeros of zeta on the critical line.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, { width: 680, height: 340, originX: 60, originY: 170, scale: 1 });

                        var tMin = 0, tMax = 50;
                        var animating = false;
                        var animT = 0;
                        var steps = 600;

                        function theta(t) {
                            if (t <= 0) return 0;
                            return t / 2 * Math.log(t / (2 * Math.PI * Math.E)) - Math.PI / 8;
                        }

                        function computeZ(t) {
                            if (t <= 0) return 0;
                            var N = Math.floor(Math.sqrt(t / (2 * Math.PI)));
                            if (N < 1) N = 1;
                            var th = theta(t);
                            var sum = 0;
                            for (var n = 1; n <= N; n++) {
                                sum += Math.cos(th - t * Math.log(n)) / Math.sqrt(n);
                            }
                            return 2 * sum;
                        }

                        var tSlider = VizEngine.createSlider(controls, 't range start', 0, 200, 0, 1, function(v) {
                            tMin = v;
                            tMax = v + 50;
                            if (!animating) draw(1);
                        });

                        var animBtn = VizEngine.createButton(controls, 'Animate sweep', function() {
                            if (animating) {
                                viz.stopAnimation();
                                animating = false;
                                animBtn.textContent = 'Animate sweep';
                            } else {
                                animating = true;
                                animBtn.textContent = 'Stop';
                                animT = 0;
                                viz.animate(function() {
                                    animT = (animT + 0.5) % steps;
                                    draw(animT / steps);
                                });
                            }
                        });

                        function draw(progress) {
                            viz.clear();
                            var ctx = viz.ctx;
                            var padL = 60, padR = 20, padT = 30, padB = 40;
                            var W = viz.width - padL - padR;
                            var H = viz.height - padT - padB;

                            // Axis
                            ctx.strokeStyle = viz.colors.axis; ctx.lineWidth = 1.5;
                            ctx.beginPath();
                            ctx.moveTo(padL, padT + H / 2);
                            ctx.lineTo(padL + W, padT + H / 2);
                            ctx.stroke();
                            ctx.beginPath();
                            ctx.moveTo(padL, padT);
                            ctx.lineTo(padL, padT + H);
                            ctx.stroke();

                            // Y labels
                            ctx.fillStyle = viz.colors.text; ctx.font = '10px -apple-system,sans-serif';
                            ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
                            var yScale = 3;
                            for (var yv = -6; yv <= 6; yv += 2) {
                                var yy = padT + H / 2 - yv * yScale * H / 12;
                                ctx.fillText(yv, padL - 4, yy);
                                ctx.strokeStyle = viz.colors.grid; ctx.lineWidth = 0.4;
                                ctx.beginPath(); ctx.moveTo(padL, yy); ctx.lineTo(padL + W, yy); ctx.stroke();
                            }

                            // X labels
                            ctx.textAlign = 'center'; ctx.textBaseline = 'top'; ctx.fillStyle = viz.colors.text;
                            for (var tv = tMin; tv <= tMax; tv += 10) {
                                var xx = padL + (tv - tMin) / (tMax - tMin) * W;
                                ctx.fillText(tv.toFixed(0), xx, padT + H + 4);
                                ctx.strokeStyle = viz.colors.grid; ctx.lineWidth = 0.4;
                                ctx.beginPath(); ctx.moveTo(xx, padT); ctx.lineTo(xx, padT + H); ctx.stroke();
                            }

                            // Title
                            viz.screenText('Hardy Z-Function: Z(t) via Riemann-Siegel', viz.width / 2, 12, viz.colors.white, 13);
                            viz.screenText('t', padL + W + 8, padT + H / 2, viz.colors.text, 11);
                            viz.screenText('Z(t)', padL - 50, padT + 8, viz.colors.text, 11);

                            // Compute and draw curve up to progress
                            var n = Math.round(progress * steps);
                            var prevX = null, prevY = null;
                            var zeroMarked = false;
                            var prevZ = null;

                            ctx.strokeStyle = viz.colors.blue; ctx.lineWidth = 2;
                            ctx.beginPath();
                            for (var i = 0; i <= n && i <= steps; i++) {
                                var t = tMin + (tMax - tMin) * i / steps;
                                var z = computeZ(t);
                                var cx = padL + (t - tMin) / (tMax - tMin) * W;
                                var cy = padT + H / 2 - z * (H / 12) * yScale;
                                cy = Math.max(padT, Math.min(padT + H, cy));

                                if (i === 0) {
                                    ctx.moveTo(cx, cy);
                                } else {
                                    ctx.lineTo(cx, cy);
                                    // Mark sign change (zero)
                                    if (prevZ !== null && prevZ * z < 0) {
                                        // draw tick at axis crossing
                                        ctx.stroke();
                                        ctx.beginPath();
                                        var zeroX = prevX + (cx - prevX) * Math.abs(prevZ) / (Math.abs(prevZ) + Math.abs(z));
                                        ctx.strokeStyle = viz.colors.orange; ctx.lineWidth = 1.5;
                                        ctx.moveTo(zeroX, padT + H / 2 - 8);
                                        ctx.lineTo(zeroX, padT + H / 2 + 8);
                                        ctx.stroke();
                                        ctx.strokeStyle = viz.colors.blue; ctx.lineWidth = 2;
                                        ctx.beginPath(); ctx.moveTo(cx, cy);
                                    }
                                }
                                prevX = cx; prevY = cy; prevZ = z;
                            }
                            ctx.stroke();

                            // Legend
                            ctx.font = '11px -apple-system,sans-serif'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
                            ctx.fillStyle = viz.colors.blue;
                            ctx.fillRect(padL + W - 160, padT + 4, 18, 3);
                            ctx.fillText('Z(t)', padL + W - 138, padT + 6);
                            ctx.fillStyle = viz.colors.orange;
                            ctx.beginPath(); ctx.arc(padL + W - 149, padT + 18, 4, 0, Math.PI * 2); ctx.fill();
                            ctx.fillStyle = viz.colors.orange;
                            ctx.fillText('zero of \u03B6(1/2+it)', padL + W - 138, padT + 18);
                        }

                        draw(1);
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'At \\(t = 14.134725\\ldots\\), the function \\(Z(t)\\) changes sign. This corresponds to the first non-trivial zero of \\(\\zeta(s)\\) on the critical line. Using the approximation \\(\\theta(t) \\approx \\frac{t}{2}\\ln\\frac{t}{2\\pi e} - \\frac{\\pi}{8}\\), compute \\(\\theta(14.135)\\) and verify that it is near 0.',
                    hint: 'Plug \\(t = 14.135\\) directly into the formula. The answer should be close to \\(-\\pi/8\\).',
                    solution: '\\(\\theta(14.135) \\approx \\frac{14.135}{2}\\ln\\frac{14.135}{2\\pi e} - \\frac{\\pi}{8} \\approx 7.068 \\times \\ln(0.824) - 0.393 \\approx 7.068 \\times (-0.194) - 0.393 \\approx -1.37 - 0.393 \\approx -1.76 \\approx -\\pi/2\\) (approximately). The exact value is \\(\\theta(14.1347) \\approx -\\pi/2 + \\pi = \\pi/2\\) up to the choice of branch, which is consistent with a zero at this \\(t\\).'
                },
                {
                    question: 'How many terms does the Riemann-Siegel sum need at height \\(t = 10^4\\)? At \\(t = 10^{10}\\)?',
                    hint: 'The number of terms is \\(N = \\lfloor\\sqrt{t/(2\\pi)}\\rfloor\\).',
                    solution: 'At \\(t = 10^4\\): \\(N = \\lfloor\\sqrt{10^4/(2\\pi)}\\rfloor = \\lfloor\\sqrt{1591.5}\\rfloor = \\lfloor 39.9 \\rfloor = 39\\). At \\(t = 10^{10}\\): \\(N = \\lfloor\\sqrt{10^{10}/(2\\pi)}\\rfloor \\approx \\lfloor 39894 \\rfloor = 39894\\). The number of terms grows as \\(t^{1/2}\\), versus \\(t\\) for the naive Dirichlet truncation.'
                }
            ]
        },

        // ================================================================
        // SECTION 3: Verifying RH (Turing's Method)
        // ================================================================
        {
            id: 'sec-zero-verification',
            title: 'Verifying RH to Height T',
            content: `
<h2>Verifying the Riemann Hypothesis to Height T</h2>

<p>No counterexample to the Riemann Hypothesis has ever been found computationally, but this is not an accident of luck. Turing devised a rigorous method to verify, with mathematical certainty, that all zeros up to some height \\(T\\) lie on the critical line.</p>

<h3>Counting Zeros: The Argument Principle</h3>

<p>The key tool is the <em>argument principle</em>. Define</p>
\\[
N(T) = \\#\\{\\rho = \\sigma + i\\gamma : \\zeta(\\rho) = 0,\\; 0 < \\gamma \\leq T\\}.
\\]
<p>Using the argument principle on a rectangle with corners at \\(2\\), \\(2+iT\\), \\(-1+iT\\), \\(-1\\), one derives the exact formula:</p>

<div class="env-block theorem">
    <div class="env-title">Theorem (Backlund, 1914)</div>
    <div class="env-body">
        \\[N(T) = \\frac{\\theta(T)}{\\pi} + 1 + S(T),\\]
        <p>where \\(S(T) = \\frac{1}{\\pi}\\arg\\zeta\\!\\left(\\tfrac{1}{2} + iT\\right)\\) (the argument increment along the critical segment). The term \\(\\theta(T)/\\pi + 1\\) can be computed from Stirling's formula; \\(S(T)\\) is bounded on average but can be \\(O(\\log T / \\log\\log T)\\) in the worst case.</p>
    </div>
</div>

<h3>Turing's Method</h3>

<p>To certify that all zeros up to \\(T\\) are simple and on the critical line, Turing (1953) observed:</p>

<ol>
    <li><strong>Gram blocks.</strong> Partition the imaginary axis into Gram blocks \\([g_n, g_{n+m})\\). Within a <em>good</em> Gram block, the number of sign changes of \\(Z(t)\\) equals the number of zeros (by the intermediate value theorem and analyticity).</li>
    <li><strong>Counting sign changes.</strong> Evaluate \\(Z(t)\\) at enough points to detect all sign changes in each good Gram block. If the total number of detected sign changes from \\(0\\) to \\(T\\) equals the theoretical count \\(N(T)\\), then all zeros are accounted for.</li>
    <li><strong>Backlund's formula as a check.</strong> Since \\(N(T)\\) is known exactly from the argument principle, any missing zeros would leave a discrepancy. No discrepancy has ever been found.</li>
</ol>

<div class="env-block remark">
    <div class="env-title">What "Verifying RH" Means</div>
    <div class="env-body">
        <p>The computational verification does not prove RH for all \\(T\\). What it proves is: every zero \\(\\rho\\) with \\(0 < \\text{Im}(\\rho) \\leq T\\) satisfies \\(\\text{Re}(\\rho) = 1/2\\). The current record (Platt and Trudgian, 2021) is \\(T \\approx 3 \\times 10^{12}\\), covering the first \\(1.2 \\times 10^{13}\\) zeros.</p>
    </div>
</div>

<div class="env-block theorem">
    <div class="env-title">Theorem (Turing 1953; Lehmer 1956)</div>
    <div class="env-body">
        <p>The algorithm terminates in \\(O(T^{3/2+\\varepsilon})\\) operations (using the Riemann-Siegel formula) and certifies RH up to height \\(T\\) with mathematical rigor, assuming exact arithmetic in the final sign checks.</p>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-zero-verification"></div>
`,
            visualizations: [
                {
                    id: 'viz-zero-verification',
                    title: "Turing's Method: Step by Step",
                    description: 'Watch how Gram blocks and sign changes of Z(t) are used to verify that all zeros lie on the critical line. Click Next Step to advance through the algorithm.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, { width: 680, height: 340, originX: 60, originY: 170, scale: 1 });

                        var step = 0;
                        var maxSteps = 5;

                        // Gram points for t near 14 (first few zeros)
                        // g_n: theta(g_n) = n*pi
                        // Approximate: g_0 ~ 0, g_1 ~ 9.7, g_2 ~ 17.8, g_3 ~ 23.2, g_4 ~ 28, g_5 ~ 32.9
                        var gramPts = [0, 9.72, 17.84, 23.17, 27.96, 32.92, 37.59, 42.13, 46.56];

                        function theta(t) {
                            if (t <= 0) return 0;
                            return t / 2 * Math.log(t / (2 * Math.PI * Math.E)) - Math.PI / 8;
                        }
                        function computeZ(t) {
                            if (t <= 0) return 0;
                            var N = Math.max(1, Math.floor(Math.sqrt(t / (2 * Math.PI))));
                            var th = theta(t);
                            var sum = 0;
                            for (var n = 1; n <= N; n++) sum += Math.cos(th - t * Math.log(n)) / Math.sqrt(n);
                            return 2 * sum;
                        }

                        var tMin = 0, tMax = 50;
                        var padL = 60, padR = 20, padT = 40, padB = 40;
                        var W = viz.width - padL - padR;
                        var H = viz.height - padT - padB;

                        function txPx(t) { return padL + (t - tMin) / (tMax - tMin) * W; }
                        function zyPx(z) { return padT + H / 2 - z * H / 16; }

                        var stepLabels = [
                            'Step 1: Plot Z(t) and identify sign changes (zeros)',
                            'Step 2: Mark Gram points where \u03B8(g\u2099) = n\u03C0',
                            'Step 3: Form Gram blocks (intervals between Gram points)',
                            'Step 4: Count sign changes of Z(t) in each Gram block',
                            'Step 5: Compare count with N(T) from the argument principle. If equal: RH verified to this height!'
                        ];

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            // Axes
                            ctx.strokeStyle = viz.colors.axis; ctx.lineWidth = 1.5;
                            ctx.beginPath(); ctx.moveTo(padL, padT + H / 2); ctx.lineTo(padL + W, padT + H / 2); ctx.stroke();
                            ctx.beginPath(); ctx.moveTo(padL, padT); ctx.lineTo(padL, padT + H); ctx.stroke();

                            // X labels
                            ctx.fillStyle = viz.colors.text; ctx.font = '10px -apple-system,sans-serif';
                            ctx.textAlign = 'center'; ctx.textBaseline = 'top';
                            for (var tv = 0; tv <= 50; tv += 10) {
                                var xx = txPx(tv);
                                ctx.fillText(tv, xx, padT + H + 4);
                            }

                            // Step label
                            viz.screenText(stepLabels[step] || '', viz.width / 2, 16, viz.colors.yellow, 12);

                            // Always draw Z(t) curve (step >= 0)
                            ctx.strokeStyle = viz.colors.blue; ctx.lineWidth = 1.5;
                            ctx.beginPath();
                            var prevZ = null;
                            for (var i = 0; i <= 500; i++) {
                                var t = tMin + (tMax - tMin) * i / 500;
                                var z = computeZ(t);
                                var cx = txPx(t);
                                var cy = Math.max(padT, Math.min(padT + H, zyPx(z)));
                                i === 0 ? ctx.moveTo(cx, cy) : ctx.lineTo(cx, cy);
                                if (step >= 0 && prevZ !== null && prevZ * z < 0) {
                                    // mark zero crossing
                                    ctx.stroke();
                                    var zeroX = txPx(t - (tMax - tMin) / 500 * Math.abs(prevZ) / (Math.abs(prevZ) + Math.abs(z)));
                                    ctx.strokeStyle = viz.colors.orange; ctx.lineWidth = 2;
                                    ctx.beginPath(); ctx.moveTo(zeroX, padT + H / 2 - 7); ctx.lineTo(zeroX, padT + H / 2 + 7); ctx.stroke();
                                    ctx.strokeStyle = viz.colors.blue; ctx.lineWidth = 1.5;
                                    ctx.beginPath(); ctx.moveTo(cx, cy);
                                }
                                prevZ = z;
                            }
                            ctx.stroke();

                            // Step 2+: Mark Gram points
                            if (step >= 1) {
                                gramPts.forEach(function(g, idx) {
                                    if (g > tMax) return;
                                    var gx = txPx(g);
                                    ctx.strokeStyle = viz.colors.purple; ctx.lineWidth = 1; ctx.setLineDash([3, 3]);
                                    ctx.beginPath(); ctx.moveTo(gx, padT); ctx.lineTo(gx, padT + H); ctx.stroke();
                                    ctx.setLineDash([]);
                                    ctx.fillStyle = viz.colors.purple; ctx.font = '9px -apple-system,sans-serif';
                                    ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
                                    ctx.fillText('g\u2080'.replace('0', idx), gx, padT - 2);
                                });
                            }

                            // Step 3+: Shade Gram blocks alternately
                            if (step >= 2) {
                                for (var k = 0; k + 1 < gramPts.length; k++) {
                                    var g0 = gramPts[k], g1 = gramPts[k + 1];
                                    if (g1 > tMax) break;
                                    ctx.fillStyle = k % 2 === 0 ? viz.colors.teal + '18' : viz.colors.purple + '18';
                                    ctx.fillRect(txPx(g0), padT, txPx(g1) - txPx(g0), H);
                                }
                            }

                            // Step 4+: Count sign changes per Gram block
                            if (step >= 3) {
                                for (var k = 0; k + 1 < gramPts.length; k++) {
                                    var g0 = gramPts[k], g1 = Math.min(gramPts[k + 1], tMax);
                                    var crosses = 0;
                                    var pz = computeZ(g0);
                                    var nSub = 40;
                                    for (var j = 1; j <= nSub; j++) {
                                        var tt = g0 + (g1 - g0) * j / nSub;
                                        var zz = computeZ(tt);
                                        if (pz * zz < 0) crosses++;
                                        pz = zz;
                                    }
                                    var midX = (txPx(g0) + txPx(gramPts[Math.min(k+1, gramPts.length-1)])) / 2;
                                    ctx.fillStyle = viz.colors.white; ctx.font = 'bold 12px -apple-system,sans-serif';
                                    ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
                                    ctx.fillText(crosses, midX, padT + H / 2 - 10);
                                }
                            }

                            // Step 5: Show match summary
                            if (step >= 4) {
                                var totalCrosses = 0;
                                for (var k = 0; k + 1 < gramPts.length; k++) {
                                    var g0 = gramPts[k], g1 = Math.min(gramPts[k + 1], tMax);
                                    var pz = computeZ(g0);
                                    var nSub = 40;
                                    for (var j = 1; j <= nSub; j++) {
                                        var tt = g0 + (g1 - g0) * j / nSub;
                                        var zz = computeZ(tt);
                                        if (pz * zz < 0) totalCrosses++;
                                        pz = zz;
                                    }
                                }
                                var NT = Math.round(theta(tMax) / Math.PI + 1);
                                ctx.fillStyle = '#1a1a40ee';
                                ctx.fillRect(padL + W - 220, padT + 4, 214, 58);
                                ctx.strokeStyle = viz.colors.green; ctx.lineWidth = 1;
                                ctx.strokeRect(padL + W - 220, padT + 4, 214, 58);
                                ctx.fillStyle = viz.colors.white; ctx.font = '11px -apple-system,sans-serif';
                                ctx.textAlign = 'left'; ctx.textBaseline = 'top';
                                ctx.fillText('Detected sign changes: ' + totalCrosses, padL + W - 214, padT + 10);
                                ctx.fillText('N(T) from Backlund: ~' + NT, padL + W - 214, padT + 26);
                                ctx.fillStyle = totalCrosses >= NT - 1 ? viz.colors.green : viz.colors.red;
                                ctx.font = 'bold 12px -apple-system,sans-serif';
                                ctx.fillText(totalCrosses >= NT - 1 ? 'RH verified to T = 50!' : 'Discrepancy -- check!', padL + W - 214, padT + 44);
                            }

                            // Step indicator
                            ctx.fillStyle = viz.colors.text; ctx.font = '11px -apple-system,sans-serif';
                            ctx.textAlign = 'right'; ctx.textBaseline = 'bottom';
                            ctx.fillText('Step ' + (step + 1) + ' / ' + maxSteps, viz.width - padR, viz.height - 4);
                        }

                        VizEngine.createButton(controls, 'Next Step', function() {
                            step = Math.min(step + 1, maxSteps - 1);
                            draw();
                        });
                        VizEngine.createButton(controls, 'Reset', function() {
                            step = 0;
                            draw();
                        });

                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'The Backlund formula gives \\(N(T) = \\theta(T)/\\pi + 1 + S(T)\\). Using \\(\\theta(T) \\approx \\frac{T}{2}\\ln\\frac{T}{2\\pi e} - \\frac{\\pi}{8}\\) and \\(S(T) \\approx 0\\) on average, estimate \\(N(100)\\).',
                    hint: 'Plug \\(T = 100\\) into the approximate Stirling formula for \\(\\theta\\).',
                    solution: '\\(\\theta(100) \\approx 50\\ln(100/(2\\pi e)) - \\pi/8 \\approx 50\\ln(5.854) - 0.393 \\approx 50 \\times 1.767 - 0.393 \\approx 87.9 - 0.393 \\approx 87.5\\). Then \\(N(100) \\approx 87.5/\\pi + 1 \\approx 27.8 + 1 \\approx 29\\). The actual count is 29, confirming the formula.'
                },
                {
                    question: 'Explain why it is not sufficient to observe that \\(Z(t)\\) has 29 sign changes in \\([0, 100]\\) to conclude that all 29 zeros lie on the critical line.',
                    hint: 'Think about what happens if a zero is off the critical line but \\(Z(t)\\) still changes sign nearby for a different reason.',
                    solution: 'A sign change of \\(Z(t)\\) corresponds to a zero of \\(\\zeta(1/2+it)\\) only when the zero is simple and on the critical line. If there were a pair of zeros symmetrically placed off the line (say at \\(\\sigma \\pm it\\) with \\(\\sigma \\neq 1/2\\)), the function \\(Z(t)\\) would not necessarily change sign at those heights. Conversely, \\(Z(t)\\) could change sign an even number of times near a zero off the critical line without that zero being on the line. Turing\'s method closes this gap by using the exact count \\(N(T)\\) from the argument principle: if the number of sign changes of \\(Z(t)\\) equals \\(N(T)\\), then there can be no missing zeros (which would increase \\(N(T)\\)) and no off-line zeros (which would not be counted by the sign changes).'
                }
            ]
        },

        // ================================================================
        // SECTION 4: Computing pi(x) — Meissel-Lehmer
        // ================================================================
        {
            id: 'sec-computing-pi',
            title: 'Computing π(x): Meissel-Lehmer',
            content: `
<h2>Computing \\(\\pi(x)\\): The Meissel-Lehmer Algorithm</h2>

<p>The prime counting function \\(\\pi(x) = \\#\\{p \\leq x : p \\text{ prime}\\}\\) is central to analytic number theory, but actually computing it is a nontrivial problem. The sieve of Eratosthenes computes \\(\\pi(x)\\) in \\(O(x)\\) time and \\(O(x)\\) memory, which is feasible for \\(x \\leq 10^8\\) but impractical for \\(x = 10^{24}\\).</p>

<h3>Legendre's Formula</h3>

<p>The starting point is Legendre's sieve. Define \\(\\phi(x, a)\\) as the count of integers in \\([1, x]\\) not divisible by any of the first \\(a\\) primes \\(p_1, p_2, \\ldots, p_a\\). Then</p>
\\[
\\pi(x) = \\phi(x, \\pi(\\sqrt{x})) + \\pi(\\sqrt{x}) - 1,
\\]
<p>and \\(\\phi\\) satisfies the recursion \\(\\phi(x, a) = \\phi(x, a-1) - \\phi(x/p_a, a-1)\\), which allows computation without listing all primes.</p>

<h3>The Meissel-Lehmer Improvement</h3>

<p>Lehmer (1959) refined the approach by decomposing \\(\\phi(x, a)\\) into three pieces based on the number of prime factors of the integers counted:</p>

<div class="env-block theorem">
    <div class="env-title">Meissel-Lehmer Decomposition</div>
    <div class="env-body">
        \\[
        \\pi(x) = \\phi(x, a) + a - 1 - \\frac{1}{2}(P_2(x, a) + 1)(P_2(x, a) - 2) - P_3(x, a),
        \\]
        <p>where \\(a = \\pi(x^{1/4})\\), \\(P_2(x, a)\\) counts integers \\(\\leq x\\) with exactly 2 prime factors both \\(> p_a\\), and \\(P_3(x, a)\\) counts those with exactly 3 such prime factors.</p>
    </div>
</div>

<p>The key terms can be evaluated as sums over primes up to \\(x^{1/2}\\) or \\(x^{1/3}\\), so the dominant term is a sum over roughly \\(x^{1/2}/\\ln x\\) primes, each requiring a call to \\(\\phi\\). The \\(\\phi\\) values can be computed via a sieve up to \\(x^{1/3}\\). The overall complexity is \\(O(x^{2/3}/(\\log x)^2)\\) with careful implementation.</p>

<div class="env-block remark">
    <div class="env-title">Modern Variants</div>
    <div class="env-body">
        <p>The Lucy-Hedgehog algorithm (posted on Project Euler forums, 2012) achieves \\(O(x^{2/3})\\) time and \\(O(x^{1/3})\\) space using a radically different approach: it maintains a table of \\(\\phi\\)-values at all "smooth points" \\(\\lfloor x/k \\rfloor\\) and updates them in a single pass. Kim Walisch's <tt>primecount</tt> library implements this and extensions, and has computed \\(\\pi(10^{28})\\).</p>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-meissel-lehmer"></div>
`,
            visualizations: [
                {
                    id: 'viz-meissel-lehmer',
                    title: 'Meissel-Lehmer: Decomposition Tree',
                    description: 'The Legendre-Meissel-Lehmer algorithm decomposes pi(x) into phi(x/p, a) subproblems. Explore the recursion tree and see how it avoids listing all primes.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, { width: 680, height: 380, originX: 340, originY: 20, scale: 1 });

                        var xVal = 100;
                        var nodes = [];
                        var edges = [];

                        function buildTree(x, a, depth, parentId) {
                            if (depth > 3 || nodes.length > 40) return;
                            var id = nodes.length;
                            nodes.push({ id: id, x: x, a: a, depth: depth, px: 0, py: 0 });
                            if (parentId !== null) edges.push({ from: parentId, to: id });
                            if (a <= 0 || x < 2 || depth >= 3) return;
                            // phi(x, a) = phi(x, a-1) - phi(x/pa, a-1)
                            var pa = VizEngine.sievePrimes(50)[a - 1] || a + 1;
                            buildTree(x, a - 1, depth + 1, id);
                            buildTree(Math.floor(x / pa), a - 1, depth + 1, id);
                        }

                        function rebuild() {
                            nodes = []; edges = [];
                            var a = VizEngine.sievePrimes(Math.floor(Math.sqrt(xVal))).length;
                            a = Math.min(a, 4);
                            buildTree(xVal, a, 0, null);
                        }

                        function layoutNodes() {
                            // BFS layout by depth
                            var byDepth = {};
                            nodes.forEach(function(n) {
                                if (!byDepth[n.depth]) byDepth[n.depth] = [];
                                byDepth[n.depth].push(n);
                            });
                            var maxDepth = 0;
                            nodes.forEach(function(n) { maxDepth = Math.max(maxDepth, n.depth); });
                            var padT = 50, padL = 40, padR = 40;
                            var W = viz.width - padL - padR;
                            var levelH = (viz.height - padT - 40) / (maxDepth + 1);
                            for (var d = 0; d <= maxDepth; d++) {
                                var level = byDepth[d] || [];
                                var n = level.length;
                                level.forEach(function(node, i) {
                                    node.px = padL + (n === 1 ? W / 2 : W * i / (n - 1));
                                    node.py = padT + d * levelH;
                                });
                            }
                        }

                        function draw() {
                            rebuild();
                            layoutNodes();
                            viz.clear();
                            var ctx = viz.ctx;

                            viz.screenText('Legendre Recursion Tree for \u03C6(' + xVal + ', a)', viz.width / 2, 16, viz.colors.white, 13);
                            viz.screenText('\u03C6(x, a) = \u03C6(x, a-1) \u2212 \u03C6(x/p_a, a-1)', viz.width / 2, 32, viz.colors.text, 11);

                            // Edges
                            edges.forEach(function(e) {
                                var from = nodes[e.from], to = nodes[e.to];
                                ctx.strokeStyle = viz.colors.grid; ctx.lineWidth = 1;
                                ctx.beginPath(); ctx.moveTo(from.px, from.py); ctx.lineTo(to.px, to.py); ctx.stroke();
                            });

                            // Nodes
                            nodes.forEach(function(n) {
                                var col = [viz.colors.blue, viz.colors.teal, viz.colors.orange, viz.colors.purple][n.depth % 4];
                                ctx.fillStyle = col + '33';
                                ctx.beginPath(); ctx.arc(n.px, n.py, 22, 0, Math.PI * 2); ctx.fill();
                                ctx.strokeStyle = col; ctx.lineWidth = 1.5;
                                ctx.beginPath(); ctx.arc(n.px, n.py, 22, 0, Math.PI * 2); ctx.stroke();
                                ctx.fillStyle = viz.colors.white; ctx.font = '10px -apple-system,sans-serif';
                                ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                                ctx.fillText('\u03C6(' + n.x + ',' + n.a + ')', n.px, n.py);
                            });

                            // Legend
                            ctx.fillStyle = viz.colors.text; ctx.font = '10px -apple-system,sans-serif';
                            ctx.textAlign = 'left'; ctx.textBaseline = 'top';
                            var legend = ['Depth 0: \u03C6(x,a)', 'Depth 1', 'Depth 2', 'Depth 3 (leaf)'];
                            var cols = [viz.colors.blue, viz.colors.teal, viz.colors.orange, viz.colors.purple];
                            legend.forEach(function(l, i) {
                                ctx.fillStyle = cols[i];
                                ctx.fillRect(8, viz.height - 80 + i * 16, 10, 10);
                                ctx.fillStyle = viz.colors.text;
                                ctx.fillText(l, 22, viz.height - 80 + i * 16);
                            });
                        }

                        VizEngine.createSlider(controls, 'x', 20, 300, xVal, 10, function(v) {
                            xVal = Math.round(v);
                            draw();
                        });

                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: "Compute \\(\\phi(12, 2)\\) by hand using the recursion \\(\\phi(x, a) = \\phi(x, a-1) - \\phi(\\lfloor x/p_a\\rfloor, a-1)\\), where \\(p_1 = 2, p_2 = 3\\).",
                    hint: 'Start with \\(\\phi(12, 1)\\), which counts integers in \\([1,12]\\) not divisible by 2.',
                    solution: '\\(\\phi(12, 1)\\) = integers in [1,12] not divisible by 2 = {1,3,5,7,9,11} = 6. Then \\(\\phi(12, 2) = \\phi(12, 1) - \\phi(\\lfloor 12/3\\rfloor, 1) = \\phi(12, 1) - \\phi(4, 1)\\). \\(\\phi(4,1)\\) = integers in [1,4] not divisible by 2 = {1,3} = 2. So \\(\\phi(12,2) = 6 - 2 = 4\\). These are {1,5,7,11}: integers in [1,12] not divisible by 2 or 3.'
                },
                {
                    question: 'The naive sieve computes \\(\\pi(x)\\) in \\(O(x \\log\\log x)\\) time. The Meissel-Lehmer algorithm achieves \\(O(x^{2/3} / (\\log x)^2)\\). At what value of \\(x\\) do the two cross over (i.e., when does ML become faster)? Give a rough estimate.',
                    hint: 'Set \\(x \\log\\log x \\approx x^{2/3}/(\\log x)^2\\) and solve for \\(x\\).',
                    solution: 'We want \\(x^{1/3} \\approx \\log x \\cdot \\log\\log x / (\\log x)^2 \\cdot (\\log x)^2 = (\\log x)^2 \\log\\log x\\) roughly, i.e., \\(x^{1/3} \\approx (\\log x)^3\\). Taking both sides to the third power: \\(x \\approx (\\log x)^9\\). For \\(x = 10^6\\): \\((\\log 10^6)^9 = (6 \\ln 10)^9 \\approx 13.8^9 \\approx 10^{10}\\). So the crossover is roughly around \\(x \\approx 10^{10}\\) to \\(10^{12}\\), where the ML algorithm clearly wins.'
                }
            ]
        },

        // ================================================================
        // SECTION 5: Primality Testing
        // ================================================================
        {
            id: 'sec-primality',
            title: 'Primality Testing',
            content: `
<h2>Primality Testing: From Probabilistic to Deterministic</h2>

<p>Given an \\(n\\)-bit integer \\(N\\), how quickly can we decide if \\(N\\) is prime? Trial division requires \\(O(N^{1/2}) = O(2^{n/2})\\) time, exponential in the bit size. Modern methods do far better.</p>

<h3>Fermat's Little Theorem and Witnesses</h3>

<p>If \\(p\\) is prime, Fermat's little theorem gives \\(a^{p-1} \\equiv 1 \\pmod{p}\\) for all \\(a \\not\\equiv 0\\). If \\(N\\) is composite, most choices of \\(a\\) will violate this. This suggests a probabilistic test: pick random \\(a\\) and check \\(a^{N-1} \\pmod{N}\\). The trouble is Carmichael numbers, composites satisfying Fermat for all \\(a\\) coprime to \\(N\\). The Miller-Rabin test fixes this.</p>

<h3>Miller-Rabin</h3>

<p>Write \\(N - 1 = 2^s \\cdot d\\) with \\(d\\) odd. A <em>Miller-Rabin witness</em> for the compositeness of \\(N\\) is an \\(a\\) such that</p>
\\[
a^d \\not\\equiv 1 \\pmod{N} \\quad\\text{and}\\quad a^{2^r d} \\not\\equiv -1 \\pmod{N} \\text{ for all } r = 0, 1, \\ldots, s-1.
\\]

<div class="env-block theorem">
    <div class="env-title">Theorem (Miller, Rabin)</div>
    <div class="env-body">
        <p>If \\(N\\) is composite, at least \\(3/4\\) of all bases \\(a \\in \\{2, \\ldots, N-2\\}\\) are Miller-Rabin witnesses. Therefore, after \\(k\\) random trials with no witness found, the probability of \\(N\\) being composite is at most \\(4^{-k}\\).</p>
        <p>Moreover, under GRH, testing only bases \\(a \\leq 2(\\ln N)^2\\) is sufficient to decide primality deterministically.</p>
    </div>
</div>

<p>For practical use, testing the bases \\(\\{2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37\\}\\) is sufficient to certify all \\(N < 3.3 \\times 10^{24}\\) unconditionally (Bach & Sorenson 1993, Pomerance et al.).</p>

<h3>AKS: The First Polynomial-Time Deterministic Test</h3>

<p>In 2002, Agrawal, Kayal, and Saxena proved:</p>

<div class="env-block theorem">
    <div class="env-title">Theorem (AKS, 2002)</div>
    <div class="env-body">
        <p>There exists a deterministic primality test running in \\(O((\\log N)^{12})\\) time (later improved to \\(O((\\log N)^{6})\\) by Lenstra and Pomerance). The algorithm tests: for a suitable \\(r\\) and all \\(a \\leq \\lfloor\\sqrt{\\phi(r)}\\log N\\rfloor\\),</p>
        \\[(X + a)^N \\equiv X^N + a \\pmod{X^r - 1, N}.\\]
        <p>\\(N\\) is prime if and only if all these congruences hold (and \\(N\\) is not a perfect power and has no small prime factor).</p>
    </div>
</div>

<div class="env-block remark">
    <div class="env-title">AKS in Practice</div>
    <div class="env-body">
        <p>AKS was a theoretical breakthrough (PRIMES is in P), but in practice Miller-Rabin with fixed witnesses is faster by many orders of magnitude. AKS requires polynomial arithmetic modulo \\(X^r - 1\\) for \\(r = O((\\log N)^2)\\), which is much more expensive than the modular exponentiations in Miller-Rabin.</p>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-miller-rabin"></div>
`,
            visualizations: [
                {
                    id: 'viz-miller-rabin',
                    title: 'Miller-Rabin Test: Animated',
                    description: 'Step through the Miller-Rabin primality test for a candidate N with chosen base a. Watch how the squaring sequence either certifies primality or exposes a witness to compositeness.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, { width: 680, height: 360, originX: 340, originY: 20, scale: 1 });

                        var N = 561; // Carmichael number for interesting demo
                        var a = 2;
                        var stepIdx = 0;
                        var sequence = [];
                        var result = '';

                        function modPow(base, exp, mod) {
                            var result = 1n;
                            base = base % mod;
                            while (exp > 0n) {
                                if (exp % 2n === 1n) result = (result * base) % mod;
                                exp = exp / 2n;
                                base = (base * base) % mod;
                            }
                            return result;
                        }

                        function runMillerRabin(N, a) {
                            var BN = BigInt(N), Ba = BigInt(a);
                            var d = BN - 1n, s = 0;
                            while (d % 2n === 0n) { d /= 2n; s++; }

                            var steps = [];
                            steps.push({ label: 'Start: N=' + N + ', write N-1 = 2^' + s + ' * ' + d, type: 'info', value: null });

                            var x = modPow(Ba, d, BN);
                            steps.push({ label: 'Compute a^d mod N = ' + a + '^' + d + ' mod ' + N + ' = ' + x, type: 'compute', value: Number(x) });

                            if (x === 1n || x === BN - 1n) {
                                steps.push({ label: 'x = ' + x + ' is \u00B11 mod N. N is probably prime (no witness found yet)', type: 'pass', value: null });
                                return { steps: steps, result: 'probably prime' };
                            }

                            for (var r = 0; r < s - 1; r++) {
                                x = (x * x) % BN;
                                steps.push({ label: 'Square: x = x\u00B2 mod N = ' + x + ' (r=' + r + ')', type: 'compute', value: Number(x) });
                                if (x === BN - 1n) {
                                    steps.push({ label: 'x = N-1 found. N is probably prime with this base.', type: 'pass', value: null });
                                    return { steps: steps, result: 'probably prime' };
                                }
                            }
                            steps.push({ label: 'No -1 found. a=' + a + ' is a WITNESS: N=' + N + ' is COMPOSITE!', type: 'fail', value: null });
                            return { steps: steps, result: 'composite' };
                        }

                        function rebuild() {
                            var res = runMillerRabin(N, a);
                            sequence = res.steps;
                            result = res.result;
                            stepIdx = 0;
                        }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var padL = 30, padT = 50;

                            viz.screenText('Miller-Rabin Primality Test', viz.width / 2, 16, viz.colors.white, 14);
                            viz.screenText('N = ' + N + ', base a = ' + a, viz.width / 2, 34, viz.colors.text, 12);

                            var visible = sequence.slice(0, stepIdx + 1);
                            var yStart = padT + 20;
                            var lineH = 36;

                            visible.forEach(function(s, i) {
                                var y = yStart + i * lineH;
                                var col = s.type === 'fail' ? viz.colors.red :
                                          s.type === 'pass' ? viz.colors.green :
                                          s.type === 'info' ? viz.colors.yellow : viz.colors.blue;

                                // Box
                                ctx.fillStyle = col + '22';
                                ctx.fillRect(padL, y, viz.width - 2 * padL, lineH - 4);
                                ctx.strokeStyle = col; ctx.lineWidth = 1;
                                ctx.strokeRect(padL, y, viz.width - 2 * padL, lineH - 4);

                                // Text
                                ctx.fillStyle = col; ctx.font = '12px -apple-system,sans-serif';
                                ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
                                ctx.fillText('\u2192 ' + s.label, padL + 10, y + (lineH - 4) / 2);
                            });

                            // Result
                            if (stepIdx === sequence.length - 1) {
                                var col = result === 'composite' ? viz.colors.red : viz.colors.green;
                                viz.screenText('Result: N = ' + N + ' is ' + result.toUpperCase(), viz.width / 2, viz.height - 20, col, 14);
                            }
                        }

                        rebuild();

                        var NInput = document.createElement('input');
                        NInput.type = 'number'; NInput.value = N; NInput.min = 3; NInput.max = 99999;
                        NInput.style.cssText = 'width:90px;padding:3px 6px;border:1px solid #30363d;border-radius:4px;background:#0c0c20;color:#c9d1d9;font-size:0.78rem;';
                        var aInput = document.createElement('input');
                        aInput.type = 'number'; aInput.value = a; aInput.min = 2; aInput.max = 99;
                        aInput.style.cssText = 'width:60px;padding:3px 6px;border:1px solid #30363d;border-radius:4px;background:#0c0c20;color:#c9d1d9;font-size:0.78rem;margin-left:8px;';
                        var span = document.createElement('span');
                        span.style.cssText = 'font-size:0.78rem;color:#8b949e;';
                        span.textContent = ' N: ';
                        var span2 = document.createElement('span');
                        span2.style.cssText = 'font-size:0.78rem;color:#8b949e;margin-left:8px;';
                        span2.textContent = ' a: ';
                        controls.appendChild(span); controls.appendChild(NInput);
                        controls.appendChild(span2); controls.appendChild(aInput);

                        VizEngine.createButton(controls, 'Set', function() {
                            var nv = parseInt(NInput.value);
                            var av = parseInt(aInput.value);
                            if (nv >= 3 && av >= 2 && av < nv) {
                                N = nv; a = av;
                                rebuild(); draw();
                            }
                        });

                        VizEngine.createButton(controls, 'Next Step', function() {
                            if (stepIdx < sequence.length - 1) { stepIdx++; draw(); }
                        });
                        VizEngine.createButton(controls, 'Reset', function() {
                            stepIdx = 0; draw();
                        });

                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Show that \\(N = 341 = 11 \\times 31\\) passes the Fermat test to base 2 (i.e., \\(2^{340} \\equiv 1 \\pmod{341}\\)) but fails the Miller-Rabin test to base 2.',
                    hint: 'Write \\(340 = 4 \\times 85\\). Compute \\(2^{85} \\pmod{341}\\), then square repeatedly.',
                    solution: 'Since \\(2^{10} = 1024 = 3 \\times 341 + 1\\), we have \\(2^{10} \\equiv 1 \\pmod{341}\\). Then \\(2^{340} = (2^{10})^{34} \\equiv 1 \\pmod{341}\\), so 341 passes Fermat. For Miller-Rabin: \\(340 = 2^2 \\times 85\\). Compute \\(2^{85} \\pmod{341}\\): \\(85 = 64 + 16 + 4 + 1\\), so \\(2^{85} = 2^{64} \\cdot 2^{16} \\cdot 2^4 \\cdot 2\\). Since \\(2^{10} \\equiv 1\\), \\(2^{16} \\equiv 2^6 = 64\\), \\(2^{64} \\equiv 2^4 = 16\\), \\(2^{85} \\equiv 16 \\cdot 64 \\cdot 16 \\cdot 2 = 32768 \\equiv 32768 - 96\\times341 = 32768 - 32736 = 32 \\pmod{341}\\). Since \\(32 \\neq \\pm 1 \\pmod{341}\\), we square: \\(32^2 = 1024 \\equiv 1 \\pmod{341}\\). We got \\(1\\) without passing through \\(-1\\), so 2 is a Miller-Rabin witness and 341 is exposed as composite.'
                },
                {
                    question: 'The AKS algorithm runs in \\(O((\\log N)^6)\\) time. If checking a 1000-bit number takes 1 second, estimate how long it would take for a 10000-bit number.',
                    hint: 'The ratio of times is \\((\\log N_2 / \\log N_1)^6\\).',
                    solution: 'The ratio of log-sizes is \\(10000/1000 = 10\\). The time ratio is \\(10^6\\). So the 10000-bit number takes \\(10^6\\) seconds \\(\\approx 11.6\\) days. In contrast, Miller-Rabin with \\(k\\) rounds runs in \\(O(k (\\log N)^2 \\log\\log N)\\) time (for each modular exponentiation), so the same ratio is about \\(100\\times\\) slower, taking roughly 100 seconds. This illustrates why Miller-Rabin dominates in practice.'
                }
            ]
        },

        // ================================================================
        // SECTION 6: What Remains Open
        // ================================================================
        {
            id: 'sec-bridge',
            title: 'What Remains Open',
            content: `
<h2>What Remains Open: The Bridge Between Machine and Proof</h2>

<p>Computation has verified the Riemann Hypothesis for the first \\(10^{13}\\) zeros, established the twin prime conjecture for all primes up to \\(10^{15}\\) (in the weak sense of gaps), and computed \\(\\pi(x)\\) for \\(x\\) up to \\(10^{28}\\). Yet none of these computations constitutes a proof. What is the relationship between what machines can do and what we can prove?</p>

<h3>Three Open Problems at the Interface</h3>

<p><strong>1. The Riemann Hypothesis.</strong> Computational evidence is overwhelming: no counterexample has been found among the first \\(10^{13}\\) zeros, the zeros show the predicted GUE spacing statistics, and every analytic number theory theorem with an RH-conditional form has been numerically confirmed. Yet the problem remains open. The computational evidence changes our beliefs but not the mathematical status.</p>

<p><strong>2. Factoring and the P vs. NP Question.</strong> The best known factoring algorithm (the Number Field Sieve) runs in \\(L(1/3, c) = \\exp(c(\\log N)^{1/3}(\\log\\log N)^{2/3})\\) time, subexponential but not polynomial. Whether integer factorization is in P is unknown. The security of RSA encryption depends on factoring being hard. Shor's quantum algorithm factors in polynomial time on a quantum computer, but building a large-scale quantum computer is an engineering problem not yet solved.</p>

<p><strong>3. The Integer Factorization of \\(\\pi(x)\\) Formula.</strong> Computing \\(\\pi(10^{28})\\) requires algorithms whose correctness rests on the output of sieves that are themselves not rigorously certified. The Lucy-Hedgehog method and Deleglise-Rivat algorithm have been verified to \\(10^{23}\\) with independent checks, but formal verification (in the sense of a proof assistant like Lean or Coq) has not been achieved.</p>

<h3>Computational Complexity as Analytic Number Theory</h3>

<p>A deep theme: many complexity questions in number theory reduce to the distribution of primes. The Generalized Riemann Hypothesis implies deterministic Miller-Rabin (in \\(O((\\log N)^4)\\) with \\(O((\\log N)^2)\\) witnesses). The prime number theorem for arithmetic progressions controls the runtime of sieving algorithms. The Bateman-Horn conjecture predicts the density of prime values of polynomials, which would determine the expected running time of certain randomized algorithms. Analytic number theory and computational complexity are not separate disciplines.</p>

<div class="env-block remark">
    <div class="env-title">A Challenge for the Reader</div>
    <div class="env-body">
        <p>The function \\(Z(t)\\) has been observed to have very small values (near-misses with zero) at points not on the critical line. These are called "near-zeros" and their distribution tells us about the spacing of zeta zeros. Write a program to evaluate \\(Z(t)\\) via the Riemann-Siegel formula for \\(t \\in [0, 200]\\) and find all local minima of \\(|Z(t)|\\). How many zeros do you find? Do any look anomalous?</p>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-z-interactive"></div>
`,
            visualizations: [
                {
                    id: 'viz-z-interactive',
                    title: 'Interactive Z(t) Explorer',
                    description: 'Type any value of t and compute Z(t) using the Riemann-Siegel formula. The panel shows the partial sums, the Gram index, and whether the point is near a zero.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, { width: 680, height: 360, originX: 340, originY: 20, scale: 1 });

                        var tVal = 14.134725;

                        function theta(t) {
                            if (t <= 0) return 0;
                            return t / 2 * Math.log(t / (2 * Math.PI * Math.E)) - Math.PI / 8;
                        }

                        function computeZDetailed(t) {
                            if (t <= 0) return { z: 0, N: 0, terms: [], theta: 0 };
                            var N = Math.max(1, Math.floor(Math.sqrt(t / (2 * Math.PI))));
                            var th = theta(t);
                            var sum = 0;
                            var terms = [];
                            for (var n = 1; n <= N; n++) {
                                var term = Math.cos(th - t * Math.log(n)) / Math.sqrt(n);
                                sum += term;
                                terms.push({ n: n, term: term, partial: 2 * sum });
                            }
                            return { z: 2 * sum, N: N, terms: terms, theta: th };
                        }

                        function gramIndex(t) {
                            var th = theta(t);
                            return Math.floor(th / Math.PI);
                        }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var info = computeZDetailed(tVal);
                            var padL = 60, padR = 30, padT = 45, padB = 50;
                            var W = viz.width - padL - padR;
                            var H = viz.height - padT - padB;

                            viz.screenText('Z(t) Interactive Explorer', viz.width / 2, 14, viz.colors.white, 14);

                            // Draw partial sum convergence
                            var termH = H * 0.6;
                            var termW = W;
                            var maxAbs = 1;
                            info.terms.forEach(function(t) { maxAbs = Math.max(maxAbs, Math.abs(t.partial)); });
                            maxAbs *= 1.2;

                            // Partial sum axis
                            ctx.strokeStyle = viz.colors.axis; ctx.lineWidth = 1.5;
                            ctx.beginPath(); ctx.moveTo(padL, padT + termH / 2); ctx.lineTo(padL + termW, padT + termH / 2); ctx.stroke();
                            ctx.beginPath(); ctx.moveTo(padL, padT); ctx.lineTo(padL, padT + termH); ctx.stroke();

                            // Y grid
                            ctx.fillStyle = viz.colors.text; ctx.font = '10px -apple-system,sans-serif';
                            ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
                            var gridVals = [-Math.round(maxAbs), 0, Math.round(maxAbs)];
                            gridVals.forEach(function(v) {
                                var yy = padT + termH / 2 - v / maxAbs * termH / 2;
                                ctx.fillText(v.toFixed(1), padL - 4, yy);
                                ctx.strokeStyle = viz.colors.grid; ctx.lineWidth = 0.4;
                                ctx.beginPath(); ctx.moveTo(padL, yy); ctx.lineTo(padL + termW, yy); ctx.stroke();
                            });

                            // Partial sum line
                            if (info.terms.length > 0) {
                                ctx.strokeStyle = viz.colors.blue; ctx.lineWidth = 2;
                                ctx.beginPath();
                                info.terms.forEach(function(pt, i) {
                                    var cx = padL + (i + 1) / info.N * termW;
                                    var cy = padT + termH / 2 - pt.partial / maxAbs * termH / 2;
                                    cy = Math.max(padT, Math.min(padT + termH, cy));
                                    i === 0 ? ctx.moveTo(cx, cy) : ctx.lineTo(cx, cy);
                                });
                                ctx.stroke();

                                // Final value dot
                                var finalX = padL + termW;
                                var finalY = padT + termH / 2 - info.z / maxAbs * termH / 2;
                                finalY = Math.max(padT, Math.min(padT + termH, finalY));
                                ctx.fillStyle = viz.colors.orange;
                                ctx.beginPath(); ctx.arc(finalX - 4, finalY, 6, 0, Math.PI * 2); ctx.fill();
                            }

                            // X label
                            ctx.fillStyle = viz.colors.text; ctx.font = '10px -apple-system,sans-serif';
                            ctx.textAlign = 'center'; ctx.textBaseline = 'top';
                            ctx.fillText('term index n (1 to N=' + info.N + ')', padL + termW / 2, padT + termH + 6);

                            // Info panel
                            var infoY = padT + termH + 28;
                            var items = [
                                { label: 't =', val: tVal.toFixed(6) },
                                { label: '\u03B8(t) =', val: info.theta.toFixed(4) },
                                { label: 'N = \u230Asqrt(t/2\u03C0)\u230B =', val: info.N },
                                { label: 'Z(t) =', val: info.z.toFixed(6) },
                                { label: 'Gram index =', val: gramIndex(tVal) },
                                { label: '|Z(t)| =', val: Math.abs(info.z).toFixed(6) }
                            ];

                            var col = Math.abs(info.z) < 0.5 ? viz.colors.orange : (Math.abs(info.z) < 0.01 ? viz.colors.red : viz.colors.green);
                            var colLabel = Math.abs(info.z) < 0.01 ? 'ZERO' : Math.abs(info.z) < 0.5 ? 'near zero' : 'non-zero';

                            var ix = padL;
                            var iw = (W - 20) / 3;
                            items.forEach(function(item, i) {
                                var col2 = i >= 4 ? viz.colors.teal : viz.colors.text;
                                ctx.fillStyle = '#1a1a40';
                                ctx.fillRect(ix + (i % 3) * (iw + 10), infoY + Math.floor(i / 3) * 28, iw, 22);
                                ctx.strokeStyle = viz.colors.grid; ctx.lineWidth = 0.5;
                                ctx.strokeRect(ix + (i % 3) * (iw + 10), infoY + Math.floor(i / 3) * 28, iw, 22);
                                ctx.fillStyle = col2; ctx.font = '11px -apple-system,sans-serif';
                                ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
                                ctx.fillText(item.label + ' ' + item.val, ix + (i % 3) * (iw + 10) + 6, infoY + Math.floor(i / 3) * 28 + 11);
                            });

                            // Status badge
                            ctx.fillStyle = col;
                            ctx.font = 'bold 12px -apple-system,sans-serif';
                            ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                            viz.screenText(colLabel, padL + W - 50, infoY + 22, col, 12);

                            // Title for partial sum
                            viz.screenText('Partial sums of Riemann-Siegel formula (building Z(t))', viz.width / 2, padT - 6, viz.colors.text, 11);
                        }

                        var tInput = document.createElement('input');
                        tInput.type = 'number'; tInput.value = tVal; tInput.step = 0.1; tInput.min = 1; tInput.max = 1000;
                        tInput.style.cssText = 'width:120px;padding:3px 8px;border:1px solid #30363d;border-radius:4px;background:#0c0c20;color:#c9d1d9;font-size:0.78rem;';
                        var span = document.createElement('span');
                        span.style.cssText = 'font-size:0.78rem;color:#8b949e;margin-right:6px;';
                        span.textContent = 't = ';
                        controls.appendChild(span); controls.appendChild(tInput);

                        VizEngine.createButton(controls, 'Compute Z(t)', function() {
                            var v = parseFloat(tInput.value);
                            if (v > 0) { tVal = v; draw(); }
                        });

                        // Quick-jump buttons for known zeros
                        var knownZeros = [14.135, 21.022, 25.011, 30.425, 32.935];
                        var quickDiv = document.createElement('span');
                        quickDiv.style.cssText = 'font-size:0.75rem;color:#8b949e;margin-left:10px;';
                        quickDiv.textContent = 'Zeros: ';
                        controls.appendChild(quickDiv);
                        knownZeros.forEach(function(z) {
                            var btn = document.createElement('button');
                            btn.textContent = z.toFixed(3);
                            btn.style.cssText = 'margin:0 2px;padding:2px 6px;font-size:0.72rem;border:1px solid #30363d;border-radius:3px;background:#0c0c20;color:#58a6ff;cursor:pointer;';
                            btn.addEventListener('click', function() {
                                tVal = z; tInput.value = z; draw();
                            });
                            controls.appendChild(btn);
                        });

                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'The first zero of \\(\\zeta(s)\\) on the critical line is at \\(t_1 \\approx 14.134725\\). Use the formula \\(N(T) \\approx \\frac{T}{2\\pi}\\ln\\frac{T}{2\\pi e} + 7/8\\) to estimate how many zeros have imaginary part less than \\(T = 1000\\).',
                    hint: 'Plug \\(T = 1000\\) into the formula.',
                    solution: '\\(N(1000) \\approx \\frac{1000}{2\\pi}\\ln\\frac{1000}{2\\pi e} + \\frac{7}{8} \\approx 159.15 \\times \\ln(58.7) + 0.875 \\approx 159.15 \\times 4.073 + 0.875 \\approx 648.4 + 0.875 \\approx 649\\). The actual count is 649, so the formula is remarkably accurate even at this modest height.'
                },
                {
                    question: "The Number Field Sieve factors an \\(n\\)-bit integer in time \\(\\exp(O(n^{1/3}(\\log n)^{2/3}))\\). For a 2048-bit RSA modulus, this is roughly \\(\\exp(2^{11} \\cdot 7.3) \\approx \\exp(1490)\\) operations. If a computer performs \\(10^{15}\\) operations per second, how long would this take?",
                    hint: 'Convert operations to seconds: time = operations / speed.',
                    solution: '\\(\\exp(1490)\\) operations at \\(10^{15}\\) per second takes \\(\\exp(1490) / 10^{15}\\) seconds. Converting: \\(\\exp(1490) = 10^{1490/\\ln 10} = 10^{647}\\). So time \\(= 10^{647-15} = 10^{632}\\) seconds. The age of the universe is roughly \\(4 \\times 10^{17}\\) seconds, so this is \\(10^{614}\\) times the age of the universe. This is why 2048-bit RSA is considered secure against classical computers. A quantum computer running Shor\'s algorithm would factor the same number in polynomial time (roughly \\(O((2048)^3) \\approx 10^{10}\\) operations), taking about 10 seconds.'
                },
                {
                    question: 'Explain in plain terms why verifying RH for the first \\(10^{13}\\) zeros is not sufficient to prove it for all zeros.',
                    hint: 'Think about the structure of the set of all zeros.',
                    solution: 'The zeros of \\(\\zeta(s)\\) form a countably infinite set with imaginary parts growing without bound. Verifying RH for the first \\(10^{13}\\) zeros establishes that \\(\\text{Re}(\\rho) = 1/2\\) for all \\(\\rho\\) with \\(0 < \\text{Im}(\\rho) \\leq T_0\\) for some \\(T_0 \\approx 3 \\times 10^{12}\\). But a counterexample could lie at any height \\(t > T_0\\). There are infinitely many zeros yet to check, and no pattern argument currently available allows extrapolation: the distribution of zeros could conceivably change character at some very large height. In fact, zeros grow harder to compute as \\(t \\to \\infty\\) (the Riemann-Siegel formula requires more terms), and the density of zeros grows as \\(\\frac{1}{2\\pi}\\log t\\), so each unit interval contains more zeros at larger heights.'
                }
            ]
        }
    ]
});
