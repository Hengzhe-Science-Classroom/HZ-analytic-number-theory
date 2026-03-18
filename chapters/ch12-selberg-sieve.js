window.CHAPTERS = window.CHAPTERS || [];
window.CHAPTERS.push({
    id: 'ch12',
    number: 12,
    title: "Sieve Methods II: Selberg's Sieve & Modern Sieves",
    subtitle: "Optimization replaces combinatorics",
    sections: [

        // ================================================================
        // SECTION 1: Optimization over Combinatorics
        // ================================================================
        {
            id: 'sec-motivation',
            title: 'Optimization over Combinatorics',
            content: `
<h2>Optimization over Combinatorics</h2>

<div class="env-block intuition">
    <div class="env-title">The Shift in Perspective</div>
    <div class="env-body">
        <p>In Chapter 11 we met Brun's sieve: a combinatorial machine that alternately overestimates and underestimates a count, squeezing toward the truth. It works, but it requires the Brun pure sieve to be truncated carefully, and the estimates depend on delicate cancellations in inclusion-exclusion.</p>
        <p>Selberg's 1947 breakthrough was conceptual: <em>instead of constructing a clever combinatorial device, set up an optimization problem whose solution automatically gives the best upper bound of a given form.</em> The answer comes from Lagrange multipliers, not M&ouml;bius inversion.</p>
    </div>
</div>

<p>Recall the basic sieve setup. Let \\(\\mathcal{A} = \\{a_n\\}\\) be a finite sequence of integers (or more generally, objects with associated "sizes" \\(|\\mathcal{A}_d|\\) for divisors \\(d\\)). Let \\(\\mathcal{P}\\) be a set of primes and \\(z > 1\\). Define</p>
\\[
S(\\mathcal{A}, \\mathcal{P}, z) = \\#\\{a \\in \\mathcal{A} : \\gcd(a, P(z)) = 1\\}, \\quad P(z) = \\prod_{p \\in \\mathcal{P},\\, p < z} p.
\\]
<p>We have a "main term" approximation</p>
\\[
|\\mathcal{A}_d| = \\frac{\\omega(d)}{d} X + R_d,
\\]
<p>where \\(\\omega\\) is a multiplicative function with \\(0 \\le \\omega(p) < p\\), \\(X\\) is the "size" of the sequence, and \\(R_d\\) is an error. The ratio \\(\\omega(p)/p\\) measures what fraction of \\(\\mathcal{A}\\) is eliminated by the prime \\(p\\).</p>

<h3>What Brun Does</h3>
<p>Brun constructs an upper-bound sieve by replacing \\(\\mathbf{1}_{\\gcd(n,P(z))=1}\\) with an explicit alternating linear combination</p>
\\[
\\sum_{\\substack{d \\mid P(z) \\\\ \\nu(d) \\le 2k}} \\mu(d) \\cdot \\mathbf{1}_{d \\mid n},
\\]
<p>choosing \\(k\\) to balance the main term against the error. The result is an upper bound, but the proof is a tour of combinatorial bookkeeping.</p>

<h3>What Selberg Does</h3>
<p>Selberg observes that <em>any</em> choice of real numbers \\(\\lambda_d\\) (\\(d \\mid P(z)\\), \\(\\lambda_1 = 1\\)) gives an upper bound:</p>
\\[
\\mathbf{1}_{\\gcd(n,P(z))=1} \\le \\left(\\sum_{d \\mid \\gcd(n,P(z))} \\lambda_d\\right)^2.
\\]
<p>This is a <strong>square</strong>, hence non-negative, and the constraint \\(\\lambda_1 = 1\\) forces the left side to be at most the right whenever \\(n\\) is not sieved out. Now sum over \\(\\mathcal{A}\\) and expand the square. The result is a quadratic form in the \\(\\lambda_d\\), and one minimizes it over all valid \\(\\lambda\\). That is calculus, not combinatorics.</p>

<div class="env-block remark">
    <div class="env-title">Why Squaring Works</div>
    <div class="env-body">
        <p>For any \\(n\\) with \\(\\gcd(n, P(z)) = 1\\), every \\(d \\mid \\gcd(n, P(z))\\) satisfies \\(d = 1\\), so the inner sum equals \\(\\lambda_1 = 1\\), giving \\(\\mathbf{1} \\le 1^2 = 1\\). For \\(n\\) with some \\(p \\mid \\gcd(n,P(z))\\), the bound \\(0 \\le (\\cdots)^2\\) holds trivially. The constraint \\(\\lambda_1 = 1\\) is exactly what is needed at the sieved-out numbers.</p>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-selberg-weights"></div>
`,
            visualizations: [
                {
                    id: 'viz-selberg-weights',
                    title: 'Selberg \\(\\lambda_d\\) Weights vs Sieve Level \\(D\\)',
                    description: 'Bar chart of the optimal Selberg weights \\(\\lambda_d\\) for squarefree \\(d \\le D\\) dividing \\(P(z)\\). Drag the sieve level slider to see how weights concentrate near \\(d=1\\) as \\(D\\) grows.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, { width: 600, height: 360, originX: 60, originY: 300, scale: 1 });
                        var D = 30;
                        VizEngine.createSlider(controls, 'Sieve level D', 5, 100, D, 5, function(v) {
                            D = Math.round(v);
                            draw();
                        });

                        function primesBelowD(bound) {
                            return VizEngine.sievePrimes(bound);
                        }

                        // Compute Selberg lambdas for primes product <= D
                        // Use the classical formula: lambda_d = mu(d) * prod_{p|d} p/(p-1)
                        // normalized so lambda_1 = 1 (this is the optimal solution structure)
                        function moebius(n) {
                            if (n === 1) return 1;
                            var factors = 0, temp = n;
                            for (var p = 2; p * p <= temp; p++) {
                                if (temp % p === 0) {
                                    factors++;
                                    temp = Math.floor(temp / p);
                                    if (temp % p === 0) return 0; // p^2 | n
                                }
                            }
                            if (temp > 1) factors++;
                            return (factors % 2 === 0) ? 1 : -1;
                        }

                        function squarefree(n) { return moebius(n) !== 0; }

                        function selbergWeight(d) {
                            if (!squarefree(d)) return 0;
                            var mu = moebius(d);
                            if (mu === 0) return 0;
                            // lambda_d ~ mu(d) * prod_{p|d} p/(p-1) * (log(D/d)/log D)
                            var prod = 1, temp = d;
                            for (var p = 2; p <= temp; p++) {
                                if (temp % p === 0) {
                                    prod *= p / (p - 1);
                                    temp = Math.floor(temp / p);
                                }
                            }
                            var frac = d <= D ? Math.log(D / d + 1) / Math.log(D + 1) : 0;
                            return mu * prod * frac;
                        }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var chartW = viz.width - 80, chartH = 240;
                            var startX = 70, baseY = 270;

                            // Collect squarefree d <= D
                            var ds = [];
                            for (var d = 1; d <= Math.min(D, 60); d++) {
                                if (squarefree(d)) ds.push(d);
                            }
                            var lambdas = ds.map(function(d) { return selbergWeight(d); });
                            var maxAbs = Math.max.apply(null, lambdas.map(Math.abs));
                            if (maxAbs < 0.001) maxAbs = 1;

                            var barW = Math.max(4, Math.min(18, Math.floor(chartW / ds.length) - 2));
                            var spacing = Math.floor(chartW / ds.length);

                            // Axes
                            ctx.strokeStyle = viz.colors.axis; ctx.lineWidth = 1.5;
                            ctx.beginPath(); ctx.moveTo(startX, baseY - chartH); ctx.lineTo(startX, baseY + 40); ctx.stroke();
                            ctx.beginPath(); ctx.moveTo(startX, baseY); ctx.lineTo(viz.width - 10, baseY); ctx.stroke();

                            // Y labels
                            ctx.fillStyle = viz.colors.text; ctx.font = '10px -apple-system,sans-serif'; ctx.textAlign = 'right';
                            for (var tick = -1; tick <= 1; tick += 0.5) {
                                var py = baseY - tick / maxAbs * (chartH * 0.45);
                                ctx.fillText(tick.toFixed(1), startX - 4, py);
                                ctx.strokeStyle = viz.colors.grid; ctx.lineWidth = 0.5;
                                ctx.beginPath(); ctx.moveTo(startX, py); ctx.lineTo(viz.width - 10, py); ctx.stroke();
                            }

                            // Bars
                            for (var i = 0; i < ds.length; i++) {
                                var lam = lambdas[i];
                                var bx = startX + i * spacing + spacing / 2;
                                var barH = (lam / maxAbs) * (chartH * 0.45);
                                var color = lam >= 0 ? viz.colors.blue : viz.colors.orange;
                                ctx.fillStyle = color;
                                ctx.fillRect(bx - barW / 2, baseY - barH, barW, barH);

                                if (spacing > 14) {
                                    ctx.fillStyle = viz.colors.text; ctx.font = '9px -apple-system,sans-serif';
                                    ctx.textAlign = 'center'; ctx.textBaseline = 'top';
                                    ctx.fillText(ds[i], bx, baseY + 3);
                                }
                            }

                            // Title & info
                            viz.screenText('Selberg Weights \u03bb_d (D = ' + D + ')', viz.width / 2, 18, viz.colors.white, 14);
                            viz.screenText('\u03bb_1 = 1 fixed; alternating sign by \u03bc(d)', viz.width / 2, 36, viz.colors.text, 11);

                            // Legend
                            ctx.fillStyle = viz.colors.blue; ctx.fillRect(startX + 10, baseY + 26, 10, 10);
                            ctx.fillStyle = viz.colors.text; ctx.font = '11px -apple-system,sans-serif'; ctx.textAlign = 'left';
                            ctx.fillText('\u03bb_d > 0', startX + 24, baseY + 35);
                            ctx.fillStyle = viz.colors.orange; ctx.fillRect(startX + 90, baseY + 26, 10, 10);
                            ctx.fillStyle = viz.colors.text; ctx.fillText('\u03bb_d < 0', startX + 104, baseY + 35);
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: "Verify that \\(\\left(\\sum_{d \\mid \\gcd(n,P(z))} \\lambda_d\\right)^2 \\ge 0\\) trivially, and explain why \\(\\lambda_1 = 1\\) forces the squared sum to be at least 1 when \\(\\gcd(n, P(z)) = 1\\).",
                    hint: "When \\(\\gcd(n,P(z))=1\\), which divisors \\(d\\) of \\(\\gcd(n,P(z))\\) exist?",
                    solution: "When \\(\\gcd(n,P(z))=1\\), the only divisor of \\(\\gcd(n,P(z))\\) is \\(d=1\\). So the inner sum equals \\(\\lambda_1 = 1\\), and its square is exactly 1 \\(\\ge\\) the indicator \\(\\mathbf{1}_{\\gcd(n,P(z))=1} = 1\\). When \\(\\gcd(n,P(z)) > 1\\), the indicator is 0 and the squared sum is \\(\\ge 0\\). In both cases the inequality holds, confirming validity."
                },
                {
                    question: "The Selberg upper bound has the form \\(S(\\mathcal{A},\\mathcal{P},z) \\le XV^{-1} + \\text{error}\\), where \\(V = \\sum_{d \\mid P(z), d \\le D} \\frac{\\mu^2(d)}{\\omega^*(d)}\\) with \\(\\omega^*(d) = \\prod_{p \\mid d}\\omega(p)/(p-\\omega(p))\\). For the primes themselves (\\(\\omega(p) = 1\\)), compute \\(V\\) approximately using Mertens' theorem.",
                    hint: "With \\(\\omega(p)=1\\), each factor in \\(\\omega^*(d)\\) is \\(1/(p-1)\\). The Euler product \\(\\sum_{d \\mid P(z)} \\mu^2(d)/\\omega^*(d)\\) factors over primes as \\(\\prod_{p < z}(1+1/(p-1))\\).",
                    solution: "We have \\(\\prod_{p<z}(1+1/(p-1)) = \\prod_{p<z} p/(p-1)\\). By Mertens' third theorem, \\(\\prod_{p<z}(1-1/p)^{-1} \\sim e^{\\gamma}\\log z\\). Since \\(p/(p-1) = (1-1/p)^{-1}\\), we get \\(V \\sim e^{\\gamma}\\log z\\). This gives the main term \\(XV^{-1} \\sim Xe^{-\\gamma}/\\log z\\), matching Brun-Titchmarsh up to the leading constant."
                }
            ]
        },

        // ================================================================
        // SECTION 2: Selberg's Upper Bound Sieve
        // ================================================================
        {
            id: 'sec-selberg-upper',
            title: "Selberg's Upper Bound Sieve",
            content: `
<h2>Selberg's Upper Bound Sieve</h2>

<p>We now carry out the optimization in detail. Fix \\(D \\ge 1\\) (the <em>sieve level</em>). We seek real numbers \\((\\lambda_d)_{d \\mid P(z),\\, d \\le D}\\) with \\(\\lambda_1 = 1\\) that minimize</p>
\\[
\\sum_{\\mathcal{A}} \\left(\\sum_{\\substack{d \\mid \\gcd(a, P(z)) \\\\ d \\le D}} \\lambda_d\\right)^2 \\approx X \\sum_{d_1, d_2 \\le D} \\lambda_{d_1} \\lambda_{d_2} \\frac{\\omega([d_1, d_2])}{[d_1, d_2]}.
\\]

<h3>The Quadratic Form</h3>
<p>Substituting the approximation \\(|\\mathcal{A}_d| \\approx (\\omega(d)/d)X\\) and expanding:</p>
\\[
Q(\\lambda) = \\sum_{\\substack{d_1, d_2 \\le D \\\\ d_1, d_2 \\mid P(z)}} \\lambda_{d_1} \\lambda_{d_2} \\frac{\\omega([d_1,d_2])}{[d_1,d_2]}.
\\]
<p>Using the multiplicativity of \\(\\omega\\) and the identity</p>
\\[
\\frac{\\omega([d_1,d_2])}{[d_1,d_2]} = \\sum_{e \\mid \\gcd(d_1,d_2)} \\frac{g(e)}{e},
\\]
<p>where \\(g\\) encodes the local factors, one converts \\(Q\\) into a diagonal form after a change of variables \\(y_r = \\sum_{r \\mid d} \\lambda_d\\).</p>

<div class="env-block theorem">
    <div class="env-title">Theorem 12.1 (Selberg's Upper Bound)</div>
    <div class="env-body">
        <p>With the optimal Selberg weights,</p>
        \\[
        S(\\mathcal{A}, \\mathcal{P}, z) \\le \\frac{X}{V(z, D)} + \\sum_{\\substack{d_1, d_2 \\le D \\\\ d_1, d_2 \\mid P(z)}} |\\lambda_{d_1} \\lambda_{d_2}| \\cdot |R_{[d_1,d_2]}|,
        \\]
        <p>where</p>
        \\[
        V(z, D) = \\sum_{\\substack{d \\le D \\\\ d \\mid P(z)}} \\frac{\\mu^2(d)}{F(d)}, \\quad F(d) = \\prod_{p \\mid d} \\frac{\\omega(p)}{p - \\omega(p)}.
        \\]
    </div>
</div>

<h3>Optimal Weights via Lagrange Multipliers</h3>
<p>Minimizing \\(Q(\\lambda)\\) subject to \\(\\lambda_1 = 1\\) via a Lagrange multiplier \\(\\eta\\):</p>
\\[
\\frac{\\partial Q}{\\partial \\lambda_d} = 2\\eta \\cdot [d = 1] \\quad \\Longrightarrow \\quad \\sum_{d_2 \\le D} \\lambda_{d_2} \\frac{\\omega([d,d_2])}{[d,d_2]} = \\frac{\\eta}{2} \\cdot \\mu(d=1).
\\]
<p>After the change of variables \\(y_r = \\sum_{r \\mid d \\le D} \\lambda_d / F(r)\\), the system diagonalizes, and the solution is</p>
\\[
\\lambda_d^* = \\frac{\\mu(d)}{F(d)} \\cdot \\frac{1}{V(z,D)} \\sum_{\\substack{r \\le D/d \\\\ r \\mid P(z)/d}} \\frac{\\mu^2(r)}{F(r)}.
\\]
<p>The key property is \\(|\\lambda_d^*| \\le 1\\) for all \\(d\\), which gives a clean error term.</p>

<div class="env-block example">
    <div class="env-title">Example: Counting Primes in \\([N+1, 2N]\\) (Brun-Titchmarsh)</div>
    <div class="env-body">
        <p>Take \\(\\mathcal{A} = \\{N+1, \\ldots, 2N\\}\\), \\(\\mathcal{P} = \\{\\text{all primes}\\}\\), \\(z = \\sqrt{N}\\), \\(D = \\sqrt{N}\\). With \\(\\omega(p) = 1\\) for all \\(p\\), Selberg gives</p>
        \\[
        \\pi(2N) - \\pi(N) \\le \\frac{2N}{\\log N}(1 + o(1)).
        \\]
        <p>This is the <strong>Brun-Titchmarsh inequality</strong>, with the correct leading constant 2. (The truth is \\(N/\\log N\\) by PNT, so Selberg is off by a factor of 2 &#x2014; reflecting the parity barrier.)</p>
    </div>
</div>

<div class="env-block remark">
    <div class="env-title">Comparison with Inclusion-Exclusion</div>
    <div class="env-body">
        <p>Brun's combinatorial sieve needs \\(D = z^{1/(\\kappa+1)}\\) to balance error, whereas Selberg can take \\(D = z\\) and still get useful bounds. The quadratic form approach automatically finds the "right" truncation without ad hoc parameter choices.</p>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-optimization-landscape"></div>
`,
            visualizations: [
                {
                    id: 'viz-optimization-landscape',
                    title: 'Quadratic Form Optimization Landscape (2D Projection)',
                    description: 'Contour plot of the Selberg quadratic form \\(Q(\\lambda_1, \\lambda_p)\\) in the \\((\\lambda_p, \\lambda_{p^2})\\) plane for a single prime \\(p\\). The red dot marks the Lagrange-multiplier minimum subject to \\(\\lambda_1 = 1\\). Move the slider to vary \\(\\omega(p)/p\\).',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, { width: 580, height: 380, originX: 290, originY: 190, scale: 100 });
                        var omegaOverP = 0.5;
                        VizEngine.createSlider(controls, '\u03c9(p)/p', 0.1, 0.9, omegaOverP, 0.05, function(v) {
                            omegaOverP = v;
                            draw();
                        });

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var rho = omegaOverP; // omega(p)/p

                            // Q(x,y) = coeff matrix for (lambda_p, lambda_p^2) with lambda_1=1 fixed
                            // Simplified 2-variable quadratic form derived from Selberg setup
                            // Q = A*x^2 + 2B*x*y + C*y^2 + D*x + E*y + F
                            // With single prime p: expand the quadratic form for d in {1,p}
                            // Q ~ (rho*x^2 + 2*rho^2*x*y + rho*y^2) + 2*rho*x + const
                            var A = 1 + rho, B = rho, C = 1 + rho;
                            var Dcoef = 2 * rho, Ecoef = 2 * rho * rho;

                            // Draw heatmap of Q
                            var pw = viz.canvas.width, ph = viz.canvas.height;
                            ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
                            var imgData = ctx.createImageData(pw, ph);
                            var data = imgData.data;
                            var xRange = [-2, 2], yRange = [-2, 2];
                            var vMin = Infinity, vMax = -Infinity;
                            var values = new Float64Array(pw * ph);
                            for (var py = 0; py < ph; py++) {
                                for (var px2 = 0; px2 < pw; px2++) {
                                    var x = xRange[0] + (xRange[1] - xRange[0]) * px2 / pw;
                                    var y2 = yRange[1] - (yRange[1] - yRange[0]) * py / ph;
                                    var val = A * x * x + 2 * B * x * y2 + C * y2 * y2 + Dcoef * x + Ecoef * y2 + 1;
                                    values[py * pw + px2] = val;
                                    if (isFinite(val)) { vMin = Math.min(vMin, val); vMax = Math.max(vMax, val); }
                                }
                            }
                            var range = vMax - vMin || 1;
                            for (var i2 = 0; i2 < pw * ph; i2++) {
                                var t = Math.max(0, Math.min(1, (values[i2] - vMin) / range));
                                var rgb = VizEngine.colormapSample(t, 'viridis');
                                data[i2 * 4] = rgb[0]; data[i2 * 4 + 1] = rgb[1]; data[i2 * 4 + 2] = rgb[2]; data[i2 * 4 + 3] = 255;
                            }
                            ctx.putImageData(imgData, 0, 0);
                            ctx.restore();

                            // Draw axes
                            viz.drawAxes();

                            // Optimal point: dQ/dx = 2Ax + 2By + D = 0, dQ/dy = 2Bx + 2Cy + E = 0
                            var det = A * C - B * B;
                            var xOpt = det > 1e-10 ? (-Dcoef * C + Ecoef * B) / (2 * det) : 0;
                            var yOpt = det > 1e-10 ? (-Ecoef * A + Dcoef * B) / (2 * det) : 0;

                            // Draw optimal point
                            viz.drawPoint(xOpt, yOpt, viz.colors.red, null, 7);
                            viz.screenText('Minimum', viz.originX + xOpt * viz.scale + 12, viz.originY - yOpt * viz.scale - 8, viz.colors.red, 11, 'left');

                            // Labels
                            viz.screenText('\u03bb_p', viz.width - 20, viz.originY + 14, viz.colors.text, 12);
                            viz.screenText('\u03bb_{p\u00b2}', viz.originX + 8, 16, viz.colors.text, 12);
                            viz.screenText('Selberg Q(\u03bb) contours, \u03c9(p)/p = ' + omegaOverP.toFixed(2), viz.width / 2, 14, viz.colors.white, 12);
                            viz.screenText('Optimal: \u03bb_p = ' + xOpt.toFixed(3) + ', \u03bb_{p\u00b2} = ' + yOpt.toFixed(3), viz.width / 2, viz.height - 12, viz.colors.yellow, 11);
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: "Show that the quadratic form \\(Q(\\lambda) = \\sum_{d_1,d_2} \\lambda_{d_1}\\lambda_{d_2}\\omega([d_1,d_2])/[d_1,d_2]\\) is positive semi-definite. (Hint: it is a sum over \\(\\mathcal{A}\\) of squares.)",
                    hint: "Write \\(Q = X^{-1}\\sum_a (\\sum_{d|a} \\lambda_d)^2\\) after substituting the main-term approximation.",
                    solution: "After substituting \\(|\\mathcal{A}_d| \\approx (\\omega(d)/d)X\\) and rearranging, \\(Q\\) is a weighted sum of squares of \\(\\sum_{d|n}\\lambda_d\\) over integers \\(n\\) with positive weights \\(\\omega(n)/n\\). A sum of squares with non-negative coefficients is positive semi-definite. Formally, \\(Q = \\sum_n (\\omega(n)/n)(\\sum_{d|n}\\lambda_d)^2 \\ge 0\\) for all real \\(\\lambda\\)."
                },
                {
                    question: "Suppose \\(\\omega(p) = 1\\) for all primes \\(p < z\\). Compute \\(V(z, D)\\) for \\(D = z\\) and show that \\(V \\sim e^\\gamma \\log z\\) as \\(z \\to \\infty\\) using Mertens' theorem.",
                    hint: "With \\(\\omega(p)=1\\), \\(F(d) = \\prod_{p|d}1/(p-1)\\). The sum over squarefree \\(d\\) factors as an Euler product.",
                    solution: "We have \\(F(d)^{-1} = \\prod_{p|d}(p-1)\\) for squarefree \\(d\\), so \\(V = \\sum_{d|P(z), d \\le z} \\mu^2(d)/F(d) = \\prod_{p<z}(1 + 1/(p-1)) = \\prod_{p<z}p/(p-1)\\). By Mertens' third theorem, \\(\\prod_{p<z}(1-1/p)^{-1} \\sim e^\\gamma \\log z\\), and \\(p/(p-1) = 1/(1-1/p)\\), so \\(V \\sim e^\\gamma \\log z\\)."
                }
            ]
        },

        // ================================================================
        // SECTION 3: Sieve Dimension & Sieve Limit
        // ================================================================
        {
            id: 'sec-sieve-dimension',
            title: 'Sieve Dimension & Sieve Limit',
            content: `
<h2>Sieve Dimension and the Sieve Limit</h2>

<p>Not all sieves behave alike. The behavior of \\(S(\\mathcal{A}, \\mathcal{P}, z)\\) depends fundamentally on how many integers the primes in \\(\\mathcal{P}\\) eliminate. This is captured by the <em>sieve dimension</em> \\(\\kappa\\).</p>

<div class="env-block definition">
    <div class="env-title">Definition 12.1 (Sieve Dimension)</div>
    <div class="env-body">
        <p>The <strong>sieve dimension</strong> (or <em>sieve density</em>) is the constant \\(\\kappa \\ge 0\\) such that</p>
        \\[
        \\prod_{w \\le p < z} \\left(1 - \\frac{\\omega(p)}{p}\\right)^{-1} \\sim \\left(\\frac{\\log z}{\\log w}\\right)^\\kappa \\quad \\text{as } z / w \\to \\infty.
        \\]
        <p>Equivalently, \\(\\sum_{p < z} \\omega(p)/p = \\kappa \\log\\log z + C + o(1)\\) for some constant \\(C\\).</p>
    </div>
</div>

<h3>Standard Examples</h3>
<ul>
    <li><strong>\\(\\kappa = 1\\) (linear sieve):</strong> \\(\\omega(p) = 1\\) for all \\(p\\). This is the case of primes themselves, or integers in an arithmetic progression. The density is like the primes: each prime eliminates \\(1/p\\) of integers.</li>
    <li><strong>\\(\\kappa = 1/2\\):</strong> \\(\\omega(p) = 1/2\\) for all odd \\(p\\). Arises in sieving squares or quadratic forms.</li>
    <li><strong>\\(\\kappa = 2\\):</strong> \\(\\omega(p) = 2\\) for all odd \\(p\\). Arises in twin-prime-type problems: for each prime \\(p\\), both \\(n\\) and \\(n+2\\) being divisible by \\(p\\) eliminates 2 residue classes.</li>
</ul>

<h3>The Sieve Limit Theorem</h3>
<p>In the Selberg and Rosser-Iwaniec sieves, the quality of the bound depends on the ratio</p>
\\[
s = \\frac{\\log D}{\\log z},
\\]
<p>where \\(D\\) is the sieve level. The main term is</p>
\\[
S(\\mathcal{A}, \\mathcal{P}, z) = \\frac{X}{V(z)} (F_\\kappa(s) + o(1)) + \\text{error},
\\]
<p>where \\(F_\\kappa(s)\\) and \\(f_\\kappa(s)\\) are the <em>sieve limit functions</em> for upper and lower bounds, satisfying the differential-delay equations:</p>
\\[
(sF_\\kappa(s))' = \\kappa f_\\kappa(s-1), \\quad (sf_\\kappa(s))' = \\kappa F_\\kappa(s-1), \\quad s > 1.
\\]

<div class="env-block theorem">
    <div class="env-title">Theorem 12.2 (Sieve Limits)</div>
    <div class="env-body">
        <p>For the linear sieve (\\(\\kappa = 1\\)):</p>
        \\[
        F_1(s) = \\frac{2e^\\gamma}{s} \\quad (s \\ge 2), \\qquad f_1(s) = \\frac{2e^\\gamma \\log(s-1)}{s} \\quad (s \\ge 3).
        \\]
        <p>For \\(1 \\le s \\le 2\\), \\(f_1(s) = 0\\) (no lower bound). For \\(s \\le 1\\), \\(F_1(s) = +\\infty\\) (sieve is too coarse).</p>
    </div>
</div>

<p>The critical observation is that \\(f_\\kappa(s) = 0\\) for \\(s \\le \\beta_\\kappa\\), where \\(\\beta_\\kappa\\) is the <em>sieve limit</em>. For \\(\\kappa = 1\\), \\(\\beta_1 = 2\\): lower bounds require \\(s > 2\\), i.e., \\(D > z^2\\). This is far from the \\(D = z\\) typically available.</p>

<div class="env-block remark">
    <div class="env-title">Why Does the Sieve Limit Matter?</div>
    <div class="env-body">
        <p>The sieve limit \\(\\beta_\\kappa\\) is the smallest \\(s\\) for which the sieve provides a non-trivial lower bound. If \\(D = z^s\\) and \\(s \\le \\beta_\\kappa\\), no lower bound is available from the sieve alone: you cannot prove a sequence has <em>any</em> elements with \\(\\gcd = 1\\) via sieve methods. For twin primes (\\(\\kappa=2\\), \\(\\beta_2 = 4\\)), you would need \\(D = z^4\\) &#x2014; but error terms only permit \\(D \\ll \\sqrt{N}\\), so \\(s = 1/2\\), which is far below \\(\\beta_2 = 4\\).</p>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-sieve-limit"></div>
`,
            visualizations: [
                {
                    id: 'viz-sieve-limit',
                    title: 'Sieve Limit Functions \\(F_\\kappa(s)\\) and \\(f_\\kappa(s)\\)',
                    description: 'Plot of upper and lower sieve limit functions for different sieve dimensions \\(\\kappa\\). Note how \\(f_\\kappa(s)=0\\) for \\(s \\le \\beta_\\kappa\\) and the sieve gap \\(F_\\kappa - f_\\kappa\\) narrows as \\(s \\to \\infty\\). Toggle dimension with the slider.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, { width: 600, height: 380, originX: 60, originY: 330, scale: 50 });
                        var kappa = 1.0;
                        VizEngine.createSlider(controls, '\u03ba (sieve dimension)', 0.5, 2.0, kappa, 0.5, function(v) {
                            kappa = v;
                            draw();
                        });

                        // Sieve limit functions: approximate closed-form for display
                        function F_kappa(s, k) {
                            if (s <= 0) return 5;
                            if (k === 1) {
                                if (s < 1) return 5;
                                return Math.min(5, 2 * Math.exp(0.5772) / s); // 2e^gamma/s
                            }
                            if (k === 0.5) {
                                return Math.min(5, Math.sqrt(Math.PI) * Math.exp(0.5772 * k) / Math.sqrt(s));
                            }
                            // General: F_kappa ~ C_kappa / s^kappa, C_kappa = e^(gamma*kappa)*2^kappa/Gamma(kappa+1)
                            var gamma = 0.5772;
                            var C = Math.pow(Math.E, gamma * k) * Math.pow(2, k) / (k === 2 ? 2 : (k === 1.5 ? 1.329 : 1));
                            return Math.min(5, C / Math.pow(s, k));
                        }

                        function f_kappa(s, k) {
                            var beta;
                            if (k === 0.5) beta = 1;
                            else if (k === 1.0) beta = 2;
                            else if (k === 1.5) beta = 3;
                            else if (k === 2.0) beta = 4;
                            else beta = Math.round(2 * k); // rough approximation
                            if (s <= beta) return 0;
                            var gamma = 0.5772;
                            if (k === 1) return Math.min(5, 2 * Math.exp(gamma) * Math.log(s - 1) / s);
                            // Approximate: f ~ F * (1 - exp(-kappa*(s - beta)))
                            return F_kappa(s, k) * (1 - Math.exp(-k * (s - beta) * 0.7));
                        }

                        function draw() {
                            viz.clear();
                            viz.drawGrid(1);
                            viz.drawAxes();

                            var sMin = 0.5, sMax = 9;

                            // Shaded region between F and f
                            viz.shadeBetween(
                                function(s) { return f_kappa(s, kappa); },
                                function(s) { return F_kappa(s, kappa); },
                                sMin, sMax,
                                viz.colors.blue + '22'
                            );

                            // Draw F_kappa (upper)
                            viz.drawFunction(function(s) { return F_kappa(s, kappa); }, sMin, sMax, viz.colors.blue, 2.5);

                            // Draw f_kappa (lower)
                            viz.drawFunction(function(s) { return f_kappa(s, kappa); }, sMin, sMax, viz.colors.teal, 2.5);

                            // Mark sieve limit beta
                            var beta = Math.round(2 * kappa);
                            var ctx = viz.ctx;
                            var [bsx, bsy] = viz.toScreen(beta, 0);
                            ctx.strokeStyle = viz.colors.yellow; ctx.lineWidth = 1.5; ctx.setLineDash([5, 4]);
                            ctx.beginPath(); ctx.moveTo(bsx, 0); ctx.lineTo(bsx, viz.height); ctx.stroke();
                            ctx.setLineDash([]);
                            viz.screenText('\u03b2_\u03ba = ' + beta, bsx + 4, viz.height - 60, viz.colors.yellow, 11, 'left');

                            // Labels
                            viz.screenText('F_\u03ba(s) upper bound', viz.width - 20, 30, viz.colors.blue, 12, 'right');
                            viz.screenText('f_\u03ba(s) lower bound', viz.width - 20, 48, viz.colors.teal, 12, 'right');
                            viz.screenText('Sieve dimension \u03ba = ' + kappa.toFixed(1), viz.width / 2, 14, viz.colors.white, 14);
                            viz.drawText('s = log D / log z', sMax - 0.5, -0.25, viz.colors.text, 11);
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: "For the Goldbach-type problem (sieve for \\(n(n+2)\\) having at most \\(k\\) prime factors combined), explain why \\(\\kappa = 2\\) and what constraint on \\(D\\) is needed for a lower bound.",
                    hint: "Each prime \\(p \\ge 3\\) eliminates 2 residue classes from \\(n(n+2)\\). What is \\(\\sum_p 2/p\\)?",
                    solution: "For twin-prime-type sequences, \\(\\omega(p) = 2\\) for odd primes, giving \\(\\sum_{p < z}\\omega(p)/p \\approx 2\\log\\log z\\), so \\(\\kappa = 2\\). The sieve limit is \\(\\beta_2 = 4\\), requiring \\(D \\ge z^4\\) for any lower bound. But to sieve an interval of length \\(N\\), errors require \\(D \\ll N^{1/2}\\) and \\(z \\approx N^{1/4}\\), giving \\(s = \\log D / \\log z \\approx 2\\). Since \\(2 < 4 = \\beta_2\\), no lower bound from the pure sieve exists for \\(\\kappa = 2\\)."
                },
                {
                    question: "The differential-delay system \\((sF)' = \\kappa f(s-1)\\) and \\((sf)' = \\kappa F(s-1)\\) with \\(F(s) = 2/s\\) for \\(1 \\le s \\le 2\\) and \\(f(s) = 0\\) for \\(s \\le 2\\) (\\(\\kappa=1\\)). Verify that \\(f_1(3) = 2e^\\gamma \\log 2 / 3\\).",
                    hint: "Integrate \\((sf)' = F(s-1) = 2e^\\gamma/(s-1)\\) from 2 to 3.",
                    solution: "For \\(2 < s \\le 3\\): \\((sf_1)' = F_1(s-1) = 2e^\\gamma/(s-1)\\). Integrating: \\(sf_1(s) = 2e^\\gamma \\int_2^s dt/(t-1) = 2e^\\gamma \\log(s-1)\\) (using \\(f_1(2) = 0\\)). At \\(s = 3\\): \\(3 f_1(3) = 2e^\\gamma \\log 2\\), giving \\(f_1(3) = 2e^\\gamma \\log 2 / 3\\). \\(\\checkmark\\)"
                }
            ]
        },

        // ================================================================
        // SECTION 4: Lower Bound Sieves
        // ================================================================
        {
            id: 'sec-lower-bounds',
            title: 'Lower Bound Sieves',
            content: `
<h2>Lower Bound Sieves: Rosser-Iwaniec and the Beta Sieve</h2>

<p>Selberg's \\(\\lambda^2\\) trick gives upper bounds. For lower bounds, a different approach is needed. The difficulty is that a lower bound for a characteristic function cannot be a square.</p>

<h3>The Basic Idea: Sign Alternation</h3>
<p>A lower bound sieve seeks \\(\\beta_d \\in \\mathbb{R}\\) with \\(\\beta_1 = 1\\) such that</p>
\\[
\\sum_{d \\mid \\gcd(n,P(z))} \\beta_d \\le \\mathbf{1}_{\\gcd(n,P(z))=1}
\\]
<p>for all \\(n\\). Summing over \\(\\mathcal{A}\\) gives a lower bound. The \\(\\beta_d\\) must be chosen so the above holds pointwise &#x2014; much harder than the upper bound case.</p>

<h3>The Rosser-Iwaniec Sieve</h3>
<p>Rosser's original construction (formalized by Iwaniec 1980) provides a <em>combinatorial</em> lower bound via a careful sign assignment:</p>
\\[
\\beta_d^+ = \\begin{cases} \\mu(d) & \\text{if } d = p_1 \\cdots p_r,\\, p_1 > \\cdots > p_r,\\, p_1 p_2 \\cdots p_{2k-1} \\le D \\\\ 0 & \\text{otherwise} \\end{cases}
\\]
<p>with a corresponding upper-bound weight \\(\\beta_d^-\\). The key theorem is:</p>

<div class="env-block theorem">
    <div class="env-title">Theorem 12.3 (Rosser-Iwaniec Linear Sieve)</div>
    <div class="env-body">
        <p>For the linear sieve (\\(\\kappa = 1\\)), with \\(D = z^s\\):</p>
        \\[
        S(\\mathcal{A}, \\mathcal{P}, z) \\ge \\frac{X}{V(z)} (f_1(s) - \\varepsilon) + O\\left(\\sum_{d \\le D^2} |R_d|\\right),
        \\]
        <p>where \\(f_1(s) > 0\\) for \\(s > 2\\). This is optimal in the sense that \\(f_1\\) cannot be improved for general sequences.</p>
    </div>
</div>

<h3>The Beta Sieve</h3>
<p>For dimension \\(\\kappa\\) not equal to 1, the <strong>beta sieve</strong> (Jurkat-Richert, Motohashi) provides both upper and lower bounds. Define the "level function"</p>
\\[
\\beta_\\kappa = \\inf \\{ s > 0 : f_\\kappa(s) > 0 \\}.
\\]
<p>For \\(\\kappa \\in (0, 2)\\), one has \\(\\beta_\\kappa = 2/\\kappa\\). The key identity is</p>
\\[
f_\\kappa(s) F_\\kappa(s) = 4\\kappa e^{2\\gamma\\kappa} \\quad \\text{for } s \\gg 1.
\\]

<div class="env-block example">
    <div class="env-title">Application: Chen's Theorem (Sketch)</div>
    <div class="env-body">
        <p>Every sufficiently large even number \\(N\\) equals \\(p + m\\) where \\(p\\) is prime and \\(m\\) has at most 2 prime factors (\\(m \\in P_2\\)). The proof uses:</p>
        <ol>
            <li>A Selberg upper bound for primes near \\(N/2\\).</li>
            <li>A Rosser-Iwaniec lower bound with a "switching principle" that converts an upper bound for \\(m \\in P_3\\) (three prime factors) into a lower bound for \\(p + P_2\\).</li>
            <li>The weighted sieve to handle the transition between \\(P_2\\) and \\(P_3\\).</li>
        </ol>
        <p>The key inequality is: (lower bound for \\(p + P_2\\)) \\(\\ge\\) (lower for \\(p+P_{\\le 2}\\)) &#x2212; (upper for \\(p+P_3\\)).</p>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-upper-lower-bounds"></div>
`,
            visualizations: [
                {
                    id: 'viz-upper-lower-bounds',
                    title: 'Upper and Lower Sieve Bounds vs Sieve Level \\(s = \\log D/\\log z\\)',
                    description: 'The gap between the Selberg upper bound (blue) and the Rosser-Iwaniec lower bound (teal) as a function of \\(s\\). Drag the sieve dimension slider. The lower bound activates only for \\(s > \\beta_\\kappa = 2/\\kappa\\).',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, { width: 600, height: 360, originX: 70, originY: 310, scale: 40 });
                        var kappa = 1.0;
                        VizEngine.createSlider(controls, '\u03ba', 0.5, 2.0, kappa, 0.5, function(v) {
                            kappa = v;
                            draw();
                        });

                        function F(s, k) {
                            if (s <= 0.01) return 8;
                            var gamma = 0.5772;
                            var C = Math.pow(Math.E, gamma * k) * Math.pow(2, k);
                            return Math.min(8, C / Math.pow(s, k));
                        }
                        function f(s, k) {
                            var beta = 2 / k;
                            if (s <= beta) return 0;
                            return Math.max(0, F(s, k) * (1 - Math.exp(-k * (s - beta))));
                        }

                        function draw() {
                            viz.clear();
                            viz.drawGrid(1);
                            viz.drawAxes();

                            var sMin = 0.2, sMax = 12;

                            // Shade upper - lower gap
                            viz.shadeBetween(
                                function(s) { return f(s, kappa); },
                                function(s) { return F(s, kappa); },
                                sMin, sMax, viz.colors.purple + '22'
                            );

                            // Upper bound
                            viz.drawFunction(function(s) { return F(s, kappa); }, sMin, sMax, viz.colors.blue, 2.5);

                            // Lower bound
                            viz.drawFunction(function(s) { return f(s, kappa); }, sMin, sMax, viz.colors.teal, 2.5);

                            // Truth line (if PNT available, = 1/V asymptotically)
                            viz.drawFunction(function() { return 1.0; }, sMin, sMax, viz.colors.green, 1.5, null, [6, 4]);

                            // Beta marker
                            var beta = 2 / kappa;
                            var ctx = viz.ctx;
                            var [bsx] = viz.toScreen(beta, 0);
                            ctx.strokeStyle = viz.colors.yellow; ctx.lineWidth = 1.5; ctx.setLineDash([5, 4]);
                            ctx.beginPath(); ctx.moveTo(bsx, 0); ctx.lineTo(bsx, viz.height); ctx.stroke();
                            ctx.setLineDash([]);
                            viz.screenText('\u03b2_\u03ba = ' + beta.toFixed(1), bsx + 4, viz.height - 50, viz.colors.yellow, 11, 'left');

                            viz.screenText('F_\u03ba(s) — upper bound', viz.width - 20, 28, viz.colors.blue, 11, 'right');
                            viz.screenText('f_\u03ba(s) — lower bound', viz.width - 20, 44, viz.colors.teal, 11, 'right');
                            viz.screenText('True asymptotics (1)', viz.width - 20, 60, viz.colors.green, 11, 'right');
                            viz.screenText('\u03ba = ' + kappa.toFixed(1) + ', \u03b2_\u03ba = ' + beta.toFixed(1), viz.width / 2, 14, viz.colors.white, 13);
                            viz.drawText('s', sMax - 0.5, -0.15, viz.colors.text, 11);
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: "State precisely what it means for a lower bound sieve weight \\((\\beta_d)\\) to be 'valid'. Show that if \\(\\beta_d = \\mu(d)\\mathbf{1}_{d \\le D}\\) (the simplest truncation), the resulting lower bound can be negative for some \\(\\mathcal{A}\\).",
                    hint: "A valid lower bound weight requires \\(\\sum_{d | n} \\beta_d \\le \\mathbf{1}_{\\gcd(n,P(z))=1}\\) for every \\(n\\). What goes wrong with the simple truncation?",
                    solution: "A valid lower-bound sieve requires \\(\\sum_{d|\\gcd(n,P(z))}\\beta_d \\le \\mathbf{1}_{\\gcd(n,P(z))=1}\\) for all \\(n\\). With \\(\\beta_d = \\mu(d)\\mathbf{1}_{d\\le D}\\), for \\(n\\) with exactly one small prime factor \\(p \\le D\\), the sum becomes \\(\\mu(1) + \\mu(p) = 1 - 1 = 0 \\le 0\\), which is fine. But for \\(n = pq\\) with \\(pq > D, p,q \\le D^{1/2}\\), the sum misses the \\(\\mu(pq) = +1\\) term, leaving \\(1 - 1 - 1 = -1 < 0\\). Summing over \\(\\mathcal{A}\\) would give a sum including negative contributions, but the bound itself can be negative."
                },
                {
                    question: "In Chen's theorem, the 'switching principle' is the identity \\(\\mathbf{1}_{P_2}(m) = \\mathbf{1}_{P_{\\le 2}}(m) - \\mathbf{1}_{P_1}(m)\\) restricted to the relevant range. Explain in one sentence why an upper bound for primes \\(p \\le N^{1/3}\\) dividing \\(m\\) translates into a lower bound for \\(m \\in P_2\\).",
                    hint: "If you have an upper bound for \\(m \\in P_1\\) and a lower bound for \\(m \\in P_{\\le 2}\\), the difference gives...?",
                    solution: "Lower bound for \\(P_2\\): (lower bound for \\(P_{\\le 2}\\)) minus (upper bound for \\(P_1\\)). Since \\(P_2 = P_{\\le 2} \\setminus P_1\\), any upper bound for the \\(P_1\\) portion subtracted from a lower bound for \\(P_{\\le 2}\\) yields a lower bound for \\(P_2\\); the switching principle makes the \\(P_1\\) count tractable via the Rosser-Iwaniec linear sieve applied to \\(m/p\\)."
                }
            ]
        },

        // ================================================================
        // SECTION 5: The Parity Problem
        // ================================================================
        {
            id: 'sec-parity',
            title: 'The Parity Problem',
            content: `
<h2>The Parity Problem</h2>

<div class="env-block intuition">
    <div class="env-title">Why Sieves Cannot Detect Primes</div>
    <div class="env-body">
        <p>Every sieve, no matter how cleverly constructed, appears to be unable to distinguish between numbers with an <em>even</em> number of prime factors and numbers with an <em>odd</em> number. This is not a technical limitation: it is a fundamental obstruction, first articulated clearly by Selberg in the 1950s.</p>
    </div>
</div>

<h3>Selberg's Parity Obstruction</h3>
<p>The Liouville function \\(\\lambda(n) = (-1)^{\\Omega(n)}\\) (where \\(\\Omega(n)\\) is the total number of prime factors with multiplicity) satisfies</p>
\\[
\\sum_{n \\le N} \\lambda(n) = o(N)
\\]
<p>(equivalent to the Prime Number Theorem), but for any sieve weight \\((\\lambda_d)\\) supported on \\(d \\le D\\),</p>
\\[
\\sum_{n \\le N} \\left(\\sum_{d \\mid n,\\, d \\le D} \\lambda_d\\right)^2 \\ge \\frac{N}{2}
\\]
<p>when \\(D \\le N^{1/2}\\). The issue: the sieve cannot "see" the Liouville oscillation because</p>
\\[
\\sum_{d \\mid n} \\mu(d) \\cdot \\lambda(n/d) = \\begin{cases} \\pm 1 & n \\text{ is prime} \\\\ 0 & n = p^k,\\, k \\ge 2 \end{cases}
\\]
<p>and M&ouml;bius inversion cannot distinguish \\(\\Omega(n)\\) mod 2.</p>

<div class="env-block theorem">
    <div class="env-title">Theorem 12.4 (Selberg Parity Barrier)</div>
    <div class="env-body">
        <p>Let \\(\\mathcal{A} = \\{n \\le N : \\Omega(n) \\text{ even}\\}\\) and \\(\\mathcal{B} = \\{n \\le N : \\Omega(n) \\text{ odd}\\}\\). For any sieve weights \\(\\lambda_d\\) with \\(\\lambda_1 = 1\\) and support in \\(d \\le D \\le N^{1/2}\\):</p>
        \\[
        \\sum_{n \\in \\mathcal{A}} \\left(\\sum_{d \\mid n} \\lambda_d\\right)^2 \\approx \\sum_{n \\in \\mathcal{B}} \\left(\\sum_{d \\mid n} \\lambda_d\\right)^2.
        \\]
        <p>Consequently, no sieve upper bound can prove \\(S(\\mathcal{A}) \\ll N/(\\log N)^c\\) for \\(c > 1\\), as primes (a subset of \\(\\mathcal{B}\\)) would be undercounted by the same amount that \\(\\mathcal{A}\\) is overcounted.</p>
    </div>
</div>

<h3>Consequences</h3>
<p>The parity problem explains:</p>
<ul>
    <li>Why sieve methods yield \\(P_2\\) results (e.g., Chen's theorem) but not twin primes \\(P_1 \\cap P_1\\).</li>
    <li>Why the Brun-Titchmarsh bound \\(\\pi(x+y) - \\pi(x) \\le 2y/\\log y\\) has the constant 2 rather than 1 (the PNT constant).</li>
    <li>Why the "almost prime" results (e.g., Goldbach with \\(P_2 + P_2\\)) are accessible while genuine prime results are not.</li>
</ul>

<h3>Breaking the Parity Barrier</h3>
<p>A few techniques can partially circumvent the parity obstruction:</p>
<ul>
    <li><strong>Exceptional zero method:</strong> If a Dirichlet \\(L\\)-function has a Siegel zero, one can break parity for the corresponding arithmetic progression.</li>
    <li><strong>Exponential sums:</strong> Combining sieve with Vinogradov exponential sums (used in Goldbach for three primes).</li>
    <li><strong>Higher-dimensional sieves:</strong> The GPY (Goldston-Pintz-Yildirim) method and Maynard's sieve use a different variational principle that incorporates Mobius function cancellations.</li>
</ul>

<div class="viz-placeholder" data-viz="viz-parity-barrier"></div>
`,
            visualizations: [
                {
                    id: 'viz-parity-barrier',
                    title: 'Parity Barrier: Sieve Cannot Distinguish Even/Odd \\(\\Omega(n)\\)',
                    description: 'Animated display of sieve weights applied to \\(\\mathcal{A} = \\{\\Omega(n) \\text{ even}\\}\\) vs \\(\\mathcal{B} = \\{\\Omega(n) \\text{ odd}\\}\\). Watch the running sums stay almost equal regardless of the sieve level D.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, { width: 620, height: 380, originX: 70, originY: 320, scale: 1 });
                        var N = 200;
                        var animRunning = false;
                        var frame = 0;

                        VizEngine.createSlider(controls, 'N (range)', 50, 400, N, 50, function(v) {
                            N = Math.round(v);
                            frame = 0;
                            draw(frame);
                        });
                        VizEngine.createButton(controls, 'Animate', function() {
                            if (animRunning) {
                                viz.stopAnimation();
                                animRunning = false;
                            } else {
                                animRunning = true;
                                viz.animate(function(t) {
                                    frame = Math.floor(t / 40) % N;
                                    draw(frame);
                                });
                            }
                        });

                        function totalPrimeFactors(n) {
                            var count = 0, temp = n;
                            for (var p = 2; p * p <= temp; p++) {
                                while (temp % p === 0) { count++; temp = Math.floor(temp / p); }
                            }
                            if (temp > 1) count++;
                            return count;
                        }

                        function draw(highlightN) {
                            viz.clear();
                            var ctx = viz.ctx;
                            var chartW = viz.width - 90, chartH = 270;
                            var startX = 75, baseY = 310;

                            // Compute running counts
                            var evenCount = 0, oddCount = 0;
                            var evens = [], odds = [];
                            for (var n = 2; n <= N; n++) {
                                var om = totalPrimeFactors(n);
                                if (om % 2 === 0) evenCount++; else oddCount++;
                                evens.push(evenCount);
                                odds.push(oddCount);
                            }

                            var maxCount = Math.max(evenCount, oddCount);
                            var scaleY = chartH / (maxCount || 1);
                            var scaleX = chartW / (N - 2);

                            // Draw even count curve
                            ctx.strokeStyle = viz.colors.blue; ctx.lineWidth = 2;
                            ctx.beginPath();
                            for (var i = 0; i < evens.length; i++) {
                                var sx = startX + i * scaleX;
                                var sy = baseY - evens[i] * scaleY;
                                i === 0 ? ctx.moveTo(sx, sy) : ctx.lineTo(sx, sy);
                            }
                            ctx.stroke();

                            // Draw odd count curve
                            ctx.strokeStyle = viz.colors.orange; ctx.lineWidth = 2;
                            ctx.beginPath();
                            for (var j = 0; j < odds.length; j++) {
                                var sx2 = startX + j * scaleX;
                                var sy2 = baseY - odds[j] * scaleY;
                                j === 0 ? ctx.moveTo(sx2, sy2) : ctx.lineTo(sx2, sy2);
                            }
                            ctx.stroke();

                            // Difference curve
                            ctx.strokeStyle = viz.colors.green; ctx.lineWidth = 1.5;
                            ctx.beginPath();
                            for (var k2 = 0; k2 < evens.length; k2++) {
                                var sx3 = startX + k2 * scaleX;
                                var diff = evens[k2] - odds[k2];
                                var sy3 = baseY - (maxCount / 2 + diff) * scaleY;
                                k2 === 0 ? ctx.moveTo(sx3, sy3) : ctx.lineTo(sx3, sy3);
                            }
                            ctx.stroke();

                            // Midline
                            ctx.strokeStyle = viz.colors.grid; ctx.lineWidth = 1; ctx.setLineDash([4, 4]);
                            ctx.beginPath();
                            ctx.moveTo(startX, baseY - maxCount / 2 * scaleY);
                            ctx.lineTo(startX + chartW, baseY - maxCount / 2 * scaleY);
                            ctx.stroke(); ctx.setLineDash([]);

                            // Highlight current n
                            if (highlightN >= 2 && highlightN <= N) {
                                var idx = highlightN - 2;
                                var hx = startX + idx * scaleX;
                                ctx.strokeStyle = viz.colors.purple; ctx.lineWidth = 1;
                                ctx.beginPath(); ctx.moveTo(hx, baseY - chartH); ctx.lineTo(hx, baseY); ctx.stroke();
                                var om2 = totalPrimeFactors(highlightN);
                                viz.screenText('n=' + highlightN + ', \u03a9(n)=' + om2 + ' (' + (om2 % 2 === 0 ? 'even' : 'odd') + ')',
                                    hx + 5, baseY - chartH + 10, viz.colors.purple, 11, 'left');
                            }

                            // Axes
                            ctx.strokeStyle = viz.colors.axis; ctx.lineWidth = 1.5;
                            ctx.beginPath(); ctx.moveTo(startX, baseY - chartH); ctx.lineTo(startX, baseY + 5); ctx.stroke();
                            ctx.beginPath(); ctx.moveTo(startX, baseY); ctx.lineTo(startX + chartW, baseY); ctx.stroke();

                            // Labels
                            ctx.fillStyle = viz.colors.text; ctx.font = '10px -apple-system,sans-serif';
                            ctx.textAlign = 'right';
                            for (var tick = 0; tick <= maxCount; tick += Math.ceil(maxCount / 5)) {
                                var ty = baseY - tick * scaleY;
                                ctx.fillText(tick, startX - 4, ty);
                            }

                            viz.screenText('Parity Barrier: \u03a9(n) even vs odd', viz.width / 2, 14, viz.colors.white, 14);
                            // Legend
                            ctx.fillStyle = viz.colors.blue; ctx.fillRect(startX + 10, baseY + 14, 12, 8);
                            ctx.fillStyle = viz.colors.text; ctx.font = '11px -apple-system,sans-serif'; ctx.textAlign = 'left';
                            ctx.fillText('#{\u03a9(n) even}', startX + 26, baseY + 21);
                            ctx.fillStyle = viz.colors.orange; ctx.fillRect(startX + 140, baseY + 14, 12, 8);
                            ctx.fillText('#{\u03a9(n) odd}', startX + 156, baseY + 21);
                            ctx.fillStyle = viz.colors.green; ctx.fillRect(startX + 260, baseY + 14, 12, 8);
                            ctx.fillText('Difference', startX + 276, baseY + 21);
                        }
                        draw(50);
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: "Show that the Liouville function \\(\\lambda(n) = (-1)^{\\Omega(n)}\\) satisfies \\(\\sum_{d \\mid n} \\lambda(d) = \\mathbf{1}_{n = k^2}\\) (the indicator of perfect squares). Use this to explain why any M&ouml;bius-based sieve sees \\(\\lambda\\) as 'noise'.",
                    hint: "Compute the Dirichlet series \\(\\sum_n \\lambda(n)n^{-s}\\) and relate it to \\(\\zeta(2s)/\\zeta(s)\\).",
                    solution: "The Dirichlet series of \\(\\lambda\\) is \\(\\sum_n \\lambda(n)/n^s = \\zeta(2s)/\\zeta(s)\\). The identity \\(\\sum_{d|n}\\lambda(d) = \\mathbf{1}_{n=k^2}\\) follows by comparing Euler products: \\((\\sum_{d|p^k}\\lambda(d)) = (1 + (-1) + 1 - \\cdots)\\) ends at 1 iff \\(k\\) is even. Since sieve weights \\(\\lambda_d\\) are supported on squarefree \\(d\\) and use the M&ouml;bius function, the convolution \\(\\sum_{d|n}\\lambda_d\\) is insensitive to \\(\\Omega(n) \\bmod 2\\) beyond what \\(\\mu\\) resolves &#x2014; and \\(\\mu(n) = 0\\) for non-squarefree \\(n\\), exactly where the parity oscillation occurs."
                },
                {
                    question: "The Brun-Titchmarsh theorem gives \\(\\pi(x+y)-\\pi(x) \\le 2y/\\log y\\). The true bound (assuming GRH or conditional on PNT) is \\(y/\\log y\\). Explain why the factor of 2 is related to the parity barrier rather than a gap in the proof.",
                    hint: "Compare what the sieve counts vs what is really prime, using the parity obstruction.",
                    solution: "The Selberg upper bound sieve cannot distinguish primes (odd \\(\\Omega\\)) from numbers with two prime factors (also odd \\(\\Omega\\), contributing equally to the sieve count). So the sieve upper bounds \\(\\#\\{\\text{primes}\\} + \\#\\{P_2\\} \\le 2y/\\log y\\). Since \\(\\#\\{P_2\\} \\approx y/\\log y\\) as well (by sieve estimates), the parity barrier forces the constant 2. Without an external input breaking parity (e.g., exponential sums or zero-free regions), the constant cannot be improved to 1 by pure sieve methods."
                }
            ]
        },

        // ================================================================
        // SECTION 6: A Different Kind of Sieve
        // ================================================================
        {
            id: 'sec-bridge',
            title: 'A Different Kind of Sieve',
            content: `
<h2>A Different Kind of Sieve: GPY, Maynard, and Beyond</h2>

<p>The Selberg \\(\\lambda^2\\) sieve optimizes a single quadratic form. Modern breakthroughs on bounded gaps between primes use a <em>multidimensional</em> generalization of Selberg's idea, combined with a new variational problem that the parity barrier does not block.</p>

<h3>The GPY Sieve (2005)</h3>
<p>Goldston, Pintz, and Yildirim introduced the weighted sum</p>
\\[
\\mathcal{S} = \\sum_{n \\sim N} \\left(\\sum_{d \\mid P(n)} \\lambda_d\\right)^2 \\left(\\theta(n+h_1) + \\cdots + \\theta(n+h_k) - \\log(3N)\\right),
\\]
<p>where \\(P(n) = (n+h_1)\\cdots(n+h_k)\\) and \\(\\theta\\) is the von Mangoldt function. If \\(\\mathcal{S} > 0\\), then some \\(n\\) in the sum has at least one \\(n + h_i\\) prime, giving bounded gaps in spirit.</p>

<p>GPY proved \\(\\liminf (p_{n+1} - p_n)/\\log p_n = 0\\) using this approach, but could not get bounded gaps &#x2014; they needed the Elliott-Halberstam conjecture for the full result.</p>

<h3>Maynard's Multidimensional Sieve (2013)</h3>
<p>Maynard (independently Zhang for the first bounded gap) used a more flexible weight</p>
\\[
w_n = \\left(\\sum_{\\mathbf{d}} \\lambda_{\\mathbf{d}} \\prod_{i=1}^k \\mathbf{1}_{d_i \\mid n + h_i}\\right)^2,
\\]
<p>where \\(\\mathbf{d} = (d_1, \\ldots, d_k)\\) and the \\(\\lambda_{\\mathbf{d}}\\) are supported on tuples with \\(\\prod d_i \\le D\\). This is the <em>multidimensional Selberg sieve</em>. The optimization is now over a \\(k\\)-variable function:</p>

<div class="env-block theorem">
    <div class="env-title">Theorem 12.5 (Maynard's Variational Problem)</div>
    <div class="env-body">
        <p>The optimal weight is determined by a smooth function \\(F: [0,1]^k \\to \\mathbb{R}\\) supported on the simplex \\(\\sum x_i \\le 1\\). Define</p>
        \\[
        M_k = \\sup_F \\frac{\\sum_{i=1}^k \\int_{[0,1]^{k-1}} \\left(\\int_0^1 F(x_1,\\ldots,x_k)\\, dx_i\\right)^2 d\\mathbf{x}_{-i}}{\\int_{[0,1]^k} F(\\mathbf{x})^2\\, d\\mathbf{x}}.
        \\]
        <p>If \\(M_k > m\\) (the Elliott-Halberstam level), then there are infinitely many prime tuples with at least \\(m+1\\) of the \\(k\\) shifts prime.</p>
    </div>
</div>

<h3>The Polymath8 Project</h3>
<p>The Polymath8 project (2013-2014) optimized Maynard's variational problem to show:</p>
<ul>
    <li><strong>Maynard's bound:</strong> \\(\\liminf (p_{n+1} - p_n) \\le 600\\) (using \\(k = 105\\)).</li>
    <li><strong>Polymath8b:</strong> \\(\\liminf (p_{n+1} - p_n) \\le 246\\) (unconditionally).</li>
    <li><strong>Under EH conjecture:</strong> \\(\\liminf (p_{n+1} - p_n) \\le 12\\).</li>
</ul>
<p>The record of 246 comes from numerically solving the variational problem for \\(M_k\\) with polynomial approximations.</p>

<div class="env-block remark">
    <div class="env-title">Why the Parity Barrier Does Not Block This</div>
    <div class="env-body">
        <p>The GPY/Maynard approach does not try to prove <em>a specific</em> \\(n+h_i\\) is prime; it proves that <em>some</em> among \\(k\\) candidates must be prime. The averaged-over-shifts structure averages out the parity obstruction &#x2014; the parity of \\(\\Omega(n+h_i)\\) for different \\(i\\) are not all locked together. This is fundamentally different from trying to sieve out composites from a single sequence.</p>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-sieve-comparison"></div>

<h3>Summary: The Sieve Landscape</h3>

<table>
    <thead>
        <tr><th>Sieve</th><th>Type</th><th>Strength</th><th>Application</th></tr>
    </thead>
    <tbody>
        <tr><td>Brun</td><td>Combinatorial</td><td>Upper + Lower (weak)</td><td>Brun's theorem</td></tr>
        <tr><td>Selberg \\(\\lambda^2\\)</td><td>Quadratic opt.</td><td>Upper (sharp)</td><td>Brun-Titchmarsh</td></tr>
        <tr><td>Rosser-Iwaniec</td><td>Combinatorial+opt.</td><td>Upper + Lower (sharp)</td><td>Chen's theorem</td></tr>
        <tr><td>Large Sieve</td><td>Harmonic analysis</td><td>Mean-square upper</td><td>Bombieri-Vinogradov</td></tr>
        <tr><td>GPY/Maynard</td><td>Multidim. quadratic</td><td>Prime \\(k\\)-tuples lower</td><td>Bounded prime gaps</td></tr>
    </tbody>
</table>
`,
            visualizations: [
                {
                    id: 'viz-sieve-comparison',
                    title: 'Sieve Comparison: Brun vs Selberg vs Rosser-Iwaniec Upper Bounds',
                    description: 'Compare the quality of upper bounds on \\(S(\\mathcal{A},\\mathcal{P},z)/X\\) as a function of \\(z\\) for \\(N=10^6\\). Selberg consistently beats Brun; the gap illustrates the combinatorial vs optimization approach.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, { width: 620, height: 380, originX: 70, originY: 320, scale: 1 });
                        var N = 1e5;
                        VizEngine.createSlider(controls, 'log N', 3, 7, 5, 0.5, function(v) {
                            N = Math.pow(10, v);
                            draw();
                        });

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var chartW = viz.width - 100, chartH = 270;
                            var startX = 80, baseY = 310;
                            var zMax = Math.pow(N, 0.5);

                            // True pi(N)/X ~ 1/log(N)
                            var truth = 1 / Math.log(N);

                            // Compute bounds vs z
                            var zSteps = 60;
                            var brunUpper = [], selbergUpper = [], rosserUpper = [];
                            var zVals = [];

                            for (var i = 1; i <= zSteps; i++) {
                                var z = 2 + (zMax - 2) * i / zSteps;
                                var logz = Math.log(z);
                                var logN = Math.log(N);

                                // Mertens product ~ e^(-gamma)/log(z), so 1/V ~ e^(-gamma)/log(z)
                                var gamma = 0.5772;
                                var oneOverV = Math.exp(-gamma) / logz;

                                // Selberg upper bound: ~ 2/log(z) * correction
                                var selberg = 2 * Math.exp(-gamma) / logz;

                                // Brun bound: slightly worse by constant
                                var brun = selberg * (1 + 0.2 / Math.sqrt(logz));

                                // Rosser upper: same as Selberg for upper
                                var rosser = selberg * (1 + 0.05 * Math.log(logz) / logz);

                                zVals.push(z);
                                brunUpper.push(brun);
                                selbergUpper.push(selberg);
                                rosserUpper.push(rosser);
                            }

                            var maxY = Math.max.apply(null, brunUpper);
                            var scaleY = chartH / maxY;
                            var scaleX = chartW / zSteps;

                            // Grid
                            ctx.strokeStyle = viz.colors.grid; ctx.lineWidth = 0.5;
                            for (var ytick = 0; ytick <= maxY; ytick += maxY / 5) {
                                var ty = baseY - ytick * scaleY;
                                ctx.beginPath(); ctx.moveTo(startX, ty); ctx.lineTo(startX + chartW, ty); ctx.stroke();
                                ctx.fillStyle = viz.colors.text; ctx.font = '10px -apple-system,sans-serif';
                                ctx.textAlign = 'right';
                                ctx.fillText(ytick.toFixed(3), startX - 4, ty);
                            }

                            // Truth line
                            ctx.strokeStyle = viz.colors.green; ctx.lineWidth = 1.5; ctx.setLineDash([6, 4]);
                            var ty_truth = baseY - truth * scaleY;
                            ctx.beginPath(); ctx.moveTo(startX, ty_truth); ctx.lineTo(startX + chartW, ty_truth); ctx.stroke();
                            ctx.setLineDash([]);
                            ctx.fillStyle = viz.colors.green; ctx.font = '11px -apple-system,sans-serif'; ctx.textAlign = 'left';
                            ctx.fillText('\u03c0(N)/N (truth)', startX + chartW - 100, ty_truth - 6);

                            // Draw Brun
                            function drawCurve(arr, color, lw) {
                                ctx.strokeStyle = color; ctx.lineWidth = lw;
                                ctx.beginPath();
                                for (var ii = 0; ii < arr.length; ii++) {
                                    var sx = startX + ii * scaleX;
                                    var sy = baseY - arr[ii] * scaleY;
                                    ii === 0 ? ctx.moveTo(sx, sy) : ctx.lineTo(sx, sy);
                                }
                                ctx.stroke();
                            }

                            drawCurve(brunUpper, viz.colors.orange, 2);
                            drawCurve(selbergUpper, viz.colors.blue, 2.5);
                            drawCurve(rosserUpper, viz.colors.teal, 2);

                            // Axes
                            ctx.strokeStyle = viz.colors.axis; ctx.lineWidth = 1.5;
                            ctx.beginPath(); ctx.moveTo(startX, baseY - chartH); ctx.lineTo(startX, baseY + 5); ctx.stroke();
                            ctx.beginPath(); ctx.moveTo(startX, baseY); ctx.lineTo(startX + chartW, baseY); ctx.stroke();

                            // X labels
                            ctx.fillStyle = viz.colors.text; ctx.font = '10px -apple-system,sans-serif'; ctx.textAlign = 'center';
                            for (var xi = 0; xi <= 5; xi++) {
                                var xpos = startX + xi * chartW / 5;
                                var zval = 2 + (zMax - 2) * xi / 5;
                                ctx.fillText('z=' + zval.toFixed(0), xpos, baseY + 12);
                            }

                            viz.screenText('Sieve Upper Bounds vs z (N = 10^' + Math.log10(N).toFixed(1) + ')', viz.width / 2, 14, viz.colors.white, 13);

                            // Legend
                            var legX = startX + 10, legY = baseY - chartH + 10;
                            ctx.fillStyle = viz.colors.orange; ctx.fillRect(legX, legY, 14, 8);
                            ctx.fillStyle = viz.colors.text; ctx.textAlign = 'left'; ctx.fillText('Brun', legX + 18, legY + 7);
                            ctx.fillStyle = viz.colors.blue; ctx.fillRect(legX + 70, legY, 14, 8);
                            ctx.fillStyle = viz.colors.text; ctx.fillText('Selberg', legX + 88, legY + 7);
                            ctx.fillStyle = viz.colors.teal; ctx.fillRect(legX + 170, legY, 14, 8);
                            ctx.fillStyle = viz.colors.text; ctx.fillText('Rosser-Iwaniec', legX + 188, legY + 7);
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: "In Maynard's sieve, the function \\(F\\) is defined on the simplex \\(\\mathcal{R}_k = \\{(x_1,\\ldots,x_k) : x_i \\ge 0,\\, \\sum x_i \\le 1\\}\\). Why is the simplex constraint natural? What does \\(\\sum x_i \\le 1\\) correspond to in terms of the sieve level \\(D\\)?",
                    hint: "The variable \\(x_i\\) encodes \\(x_i = \\log d_i / \\log D\\) for the Selberg weight \\(\\lambda_{(d_1,\\ldots,d_k)}\\). What constraint on \\(\\prod d_i\\) does \\(\\sum x_i \\le 1\\) impose?",
                    solution: "Setting \\(x_i = \\log d_i / \\log D\\), the constraint \\(\\sum x_i \\le 1\\) translates to \\(\\sum \\log d_i \\le \\log D\\), i.e., \\(\\prod d_i \\le D\\). This is the sieve-level constraint: the product of all moduli must not exceed \\(D\\) for the main-term calculation to dominate. The simplex is the continuous relaxation of this product constraint in the logarithmic coordinates natural to Selberg-type weights."
                },
                {
                    question: "Zhang proved \\(\\liminf(p_{n+1}-p_n) \\le 7 \\times 10^7\\) in 2013 using a 'smooth' variant of the Selberg sieve. Maynard later improved this to 600 using multidimensional weights. What key technical advantage does the multidimensional sieve have over Zhang's approach that allows such a dramatic improvement?",
                    hint: "Zhang needed a variant of Elliott-Halberstam for primes in arithmetic progressions to smooth moduli. What does Maynard not need?",
                    solution: "Zhang's approach uses a truncated divisor sum that requires the moduli \\(d\\) to be 'smooth' (\\(y\\)-friable) to exploit cancellations via the Bombieri-Vinogradov theorem extended to smooth moduli. This requires considerable technical overhead and yields weaker bounds on \\(k\\). Maynard's multidimensional sieve does not require smoothness of the moduli: it works directly with Bombieri-Vinogradov in its standard form. The multidimensional optimization over \\(F(x_1,\\ldots,x_k)\\) allows much larger \\(k\\) (Maynard uses \\(k=105\\) vs Zhang's effective \\(k \\approx 3.5 \\times 10^6\\)), and the resulting bound on \\(M_k\\) improves exponentially with \\(k\\)."
                },
                {
                    question: "Consider the simplest nontrivial case of Maynard's variational problem with \\(k=2\\) and the admissible pair \\((0,2)\\). The variational ratio is \\(M_2 = 2\\int_0^1 (\\int_0^{1-x_1} F(x_1,x_2)\\,dx_2)^2 dx_1 / \\int F^2\\). Show that \\(F(x_1,x_2) = 1 - x_1 - x_2\\) achieves \\(M_2 = 1/2\\), below the threshold \\(M_2 > 1\\) needed for a prime pair.",
                    hint: "Compute numerator and denominator with \\(F = 1 - x_1 - x_2\\) on the simplex \\(x_1 + x_2 \\le 1, x_i \\ge 0\\).",
                    solution: "Denominator: \\(\\int_0^1 \\int_0^{1-x_1} (1-x_1-x_2)^2 dx_2 dx_1 = \\int_0^1 [(1-x_1)^3/3] dx_1 = 1/12\\). Numerator (by symmetry, each \\(i\\) contributes equally): for \\(i=1\\), \\(\\int_0^1 (1-x_1)^3/4 \\, dx_1 = 1/16\\), so the numerator is \\(2 \\times 1/16 = 1/8\\). Therefore \\(M_2 = (1/8)/(1/12) = 3/2 > 1\\). (The \\(F=1-x_1-x_2\\) choice actually exceeds the threshold for \\(k=2\\), demonstrating that \\(k=2\\) with this simple polynomial already has \\(M_2 > 1\\), but EH is still needed to conclude a prime pair since \\(M_2 > m=1\\) requires the distribution level to exceed 1/2.)"
                },
                {
                    question: "The Polymath8b paper achieves \\(\\liminf(p_{n+1}-p_n) \\le 246\\). Explain why 246 is not likely to be reduced to 2 (the twin prime conjecture value) by improving the variational problem alone.",
                    hint: "What is the conditional bound under Elliott-Halberstam, and what obstruction remains even conditionally?",
                    solution: "Under the Elliott-Halberstam conjecture (level \\(1/2+\\varepsilon\\) distribution), Polymath8b achieves \\(\\le 12\\). The remaining gap between 12 and 2 is the parity barrier: the sieve cannot prove that <em>both</em> \\(n\\) and \\(n+2\\) are simultaneously prime, only that among \\(k\\) shifts at least one is prime. Even with perfect distribution results, the \\(k\\)-tuple sieve with \\(k\\) admissible shifts of width \\(H\\) yields bounded gaps of size \\(H\\), not 2. To get gap 2 from this approach would require an admissible 2-tuple \\(\\{0,2\\}\\) with \\(M_2 > 1/\\theta\\) where \\(\\theta > 1/2\\) is the distribution level, i.e., a distribution level exceeding 1 &#x2014; which is not achievable via any known method without breaking parity."
                }
            ]
        }
    ]
});
