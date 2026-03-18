window.CHAPTERS = window.CHAPTERS || [];
window.CHAPTERS.push({
    id: 'ch17',
    number: 17,
    title: 'Automorphic Forms: A First Look',
    subtitle: 'The unifying framework behind every L-function',
    sections: [
        // ================================================================
        // SECTION 1: Motivation — Why Automorphic Forms?
        // ================================================================
        {
            id: 'sec-motivation',
            title: 'Motivation',
            content: `
<h2>Why Automorphic Forms?</h2>

<div class="env-block intuition">
    <div class="env-title">The Recurring Pattern</div>
    <div class="env-body">
        <p>Throughout this course, every major result has followed the same script: take an arithmetic function, encode it as a Dirichlet series, prove the series has analytic continuation with a functional equation, and extract number-theoretic information from the analytic properties. The Riemann zeta function \\(\\zeta(s)\\), Dirichlet \\(L\\)-functions \\(L(s,\\chi)\\), and the \\(L\\)-functions attached to Hecke characters all fit this template.</p>
        <p>Automorphic forms provide the <em>reason</em> this template works. They are the natural functions whose Fourier coefficients generate well-behaved \\(L\\)-functions. Once you see this, the functional equations stop being miracles and start being consequences of symmetry.</p>
    </div>
</div>

<p>This chapter is a <strong>roadmap</strong>: we state the central definitions and theorems with motivation, but do not prove everything in full. The goal is to show you the landscape and explain why automorphic forms sit at the center of modern analytic number theory.</p>

<h3>The Organizing Principle</h3>

<p>Recall that the functional equation of \\(\\zeta(s)\\) relates \\(\\zeta(s)\\) to \\(\\zeta(1-s)\\). Where does this symmetry come from? The answer is that \\(\\zeta(s)\\) is the Mellin transform of a <em>theta function</em>,</p>

\\[
\\theta(t) = \\sum_{n=-\\infty}^{\\infty} e^{-\\pi n^2 t},
\\]

<p>which satisfies \\(\\theta(1/t) = \\sqrt{t}\\,\\theta(t)\\) by the Poisson summation formula. This transformation law under \\(t \\mapsto 1/t\\) is the prototype of <strong>modularity</strong>.</p>

<p>Automorphic forms generalize this idea: they are functions on the upper half-plane \\(\\mathbb{H} = \\{z \\in \\mathbb{C} : \\operatorname{Im}(z) > 0\\}\\) that transform in a controlled way under the action of a discrete group \\(\\Gamma \\leq \\mathrm{SL}_2(\\mathbb{Z})\\). Their Fourier expansions produce \\(L\\)-functions, and their transformation laws yield functional equations.</p>

<h3>What We Will Cover</h3>

<ol>
    <li><strong>Modular forms</strong>: the classical objects (Eisenstein series, the discriminant \\(\\Delta\\))</li>
    <li><strong>The fundamental domain</strong>: geometry of \\(\\mathrm{SL}_2(\\mathbb{Z}) \\backslash \\mathbb{H}\\)</li>
    <li><strong>Hecke operators</strong>: the algebra that connects modular forms to \\(L\\)-functions</li>
    <li><strong>The Ramanujan conjecture</strong>: optimal bounds on Fourier coefficients</li>
    <li><strong>The Langlands program</strong>: the grand unification</li>
</ol>

<div class="env-block remark">
    <div class="env-title">Scope</div>
    <div class="env-body">
        <p>A full treatment of automorphic forms requires representation theory, adelic analysis, and algebraic geometry. This chapter stays close to the analytic-number-theoretic core: modular forms for \\(\\mathrm{SL}_2(\\mathbb{Z})\\), their \\(L\\)-functions, and connections to classical problems about primes.</p>
    </div>
</div>
`,
            visualizations: [
                {
                    id: 'viz-l-function-gallery',
                    title: 'Gallery of L-Functions',
                    description: 'Every L-function we have encountered arises from an automorphic form. This gallery shows several L-functions and the automorphic objects they come from. Click to highlight each family.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 400,
                            originX: 0, originY: 0, scale: 1
                        });

                        var families = [
                            { name: 'Riemann \\u03B6(s)', source: 'Eisenstein series E\u2082', color: viz.colors.blue, desc: 'Encodes prime distribution' },
                            { name: 'Dirichlet L(s,\\u03C7)', source: 'Twisted Eisenstein', color: viz.colors.teal, desc: 'Primes in progressions' },
                            { name: 'L(s,\\u0394)', source: 'Ramanujan \\u0394', color: viz.colors.orange, desc: 'Weight 12 cusp form' },
                            { name: 'L(s,E)', source: 'Elliptic curve E', color: viz.colors.purple, desc: 'Modularity theorem' },
                            { name: 'Symmetric powers', source: 'Sym^k \\u0394', color: viz.colors.green, desc: 'Higher automorphic forms' },
                            { name: 'Rankin-Selberg', source: 'f \\u2297 g', color: viz.colors.pink, desc: 'Product L-functions' }
                        ];
                        var selected = -1;

                        // Draw buttons
                        var btnContainer = document.createElement('div');
                        btnContainer.style.cssText = 'display:flex;flex-wrap:wrap;gap:4px;margin-bottom:4px;';
                        families.forEach(function(fam, i) {
                            var btn = document.createElement('button');
                            btn.style.cssText = 'padding:3px 8px;border:1px solid ' + fam.color + ';border-radius:4px;background:transparent;color:' + fam.color + ';font-size:0.72rem;cursor:pointer;';
                            btn.textContent = fam.name;
                            btn.addEventListener('click', function() {
                                selected = (selected === i) ? -1 : i;
                                draw();
                            });
                            btnContainer.appendChild(btn);
                        });
                        controls.appendChild(btnContainer);

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            viz.screenText('L-Functions and Their Automorphic Sources', viz.width / 2, 22, viz.colors.white, 15);

                            var centerX = viz.width / 2;
                            var centerY = viz.height / 2 + 10;
                            var radius = 130;

                            // Central hub
                            ctx.fillStyle = viz.colors.white + '22';
                            ctx.beginPath();
                            ctx.arc(centerX, centerY, 40, 0, Math.PI * 2);
                            ctx.fill();
                            ctx.strokeStyle = viz.colors.white + '66';
                            ctx.lineWidth = 1.5;
                            ctx.stroke();
                            viz.screenText('Automorphic', centerX, centerY - 8, viz.colors.white, 11);
                            viz.screenText('Forms', centerX, centerY + 8, viz.colors.white, 11);

                            // Nodes around
                            for (var i = 0; i < families.length; i++) {
                                var angle = -Math.PI / 2 + (2 * Math.PI * i) / families.length;
                                var nx = centerX + radius * Math.cos(angle);
                                var ny = centerY + radius * Math.sin(angle);
                                var fam = families[i];
                                var isSelected = (selected === i);
                                var alpha = (selected === -1 || isSelected) ? 1.0 : 0.25;

                                // Connection line
                                ctx.strokeStyle = fam.color + (isSelected ? 'cc' : '44');
                                ctx.lineWidth = isSelected ? 2.5 : 1;
                                ctx.beginPath();
                                ctx.moveTo(centerX, centerY);
                                ctx.lineTo(nx, ny);
                                ctx.stroke();

                                // Node
                                var nodeR = isSelected ? 32 : 26;
                                ctx.fillStyle = fam.color + (isSelected ? '44' : '22');
                                ctx.beginPath();
                                ctx.arc(nx, ny, nodeR, 0, Math.PI * 2);
                                ctx.fill();
                                ctx.strokeStyle = fam.color;
                                ctx.lineWidth = isSelected ? 2 : 1;
                                ctx.stroke();

                                ctx.globalAlpha = alpha;
                                viz.screenText(fam.name, nx, ny - 6, fam.color, isSelected ? 11 : 10);
                                viz.screenText(fam.source, nx, ny + 8, viz.colors.text, 9);
                                ctx.globalAlpha = 1.0;
                            }

                            // Description of selected
                            if (selected >= 0) {
                                var sf = families[selected];
                                viz.screenText(sf.desc, viz.width / 2, viz.height - 25, sf.color, 13);
                            } else {
                                viz.screenText('Click a node to learn more', viz.width / 2, viz.height - 25, viz.colors.text, 12);
                            }
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: []
        },

        // ================================================================
        // SECTION 2: Modular Forms — Eisenstein Series and Delta
        // ================================================================
        {
            id: 'sec-modular-forms',
            title: 'Modular Forms',
            content: `
<h2>Modular Forms: Eisenstein Series and \\(\\Delta\\)</h2>

<h3>The Upper Half-Plane and Its Symmetries</h3>

<p>The upper half-plane \\(\\mathbb{H} = \\{z = x + iy : y > 0\\}\\) carries a natural action of \\(\\mathrm{SL}_2(\\mathbb{R})\\):</p>

\\[
\\gamma \\cdot z = \\frac{az + b}{cz + d}, \\qquad \\gamma = \\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix} \\in \\mathrm{SL}_2(\\mathbb{R}).
\\]

<p>This is a Mobius transformation. The key subgroup is the <strong>modular group</strong> \\(\\mathrm{SL}_2(\\mathbb{Z})\\), consisting of integer matrices with determinant 1.</p>

<div class="env-block definition">
    <div class="env-title">Definition 17.1 (Modular Form)</div>
    <div class="env-body">
        <p>A <strong>modular form</strong> of weight \\(k\\) for \\(\\mathrm{SL}_2(\\mathbb{Z})\\) is a holomorphic function \\(f: \\mathbb{H} \\to \\mathbb{C}\\) satisfying:</p>
        <ol>
            <li><strong>Transformation law:</strong> For all \\(\\gamma = \\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix} \\in \\mathrm{SL}_2(\\mathbb{Z})\\),
            \\[f\\!\\left(\\frac{az+b}{cz+d}\\right) = (cz+d)^k f(z).\\]</li>
            <li><strong>Holomorphy at \\(\\infty\\):</strong> \\(f\\) has a Fourier expansion \\(f(z) = \\sum_{n=0}^{\\infty} a(n) q^n\\) where \\(q = e^{2\\pi i z}\\), with no negative powers of \\(q\\).</li>
        </ol>
        <p>If additionally \\(a(0) = 0\\), then \\(f\\) is a <strong>cusp form</strong>.</p>
    </div>
</div>

<div class="env-block remark">
    <div class="env-title">Why Weight \\(k\\)?</div>
    <div class="env-body">
        <p>The factor \\((cz+d)^k\\) is a "cocycle": it encodes how differentials transform. A modular form of weight \\(k\\) should be thought of as a section of \\((\\Omega^1)^{k/2}\\), a tensor power of the cotangent bundle on the modular curve \\(X_0(1)\\). The weight must be a non-negative even integer for \\(\\mathrm{SL}_2(\\mathbb{Z})\\) (since \\(-I \\in \\mathrm{SL}_2(\\mathbb{Z})\\) forces \\((-1)^k = 1\\)).</p>
    </div>
</div>

<h3>Eisenstein Series</h3>

<p>The simplest modular forms are the <strong>Eisenstein series</strong>. For even \\(k \\geq 4\\):</p>

\\[
G_k(z) = \\sum_{(c,d) \\in \\mathbb{Z}^2 \\setminus (0,0)} \\frac{1}{(cz + d)^k}.
\\]

<p>This converges absolutely for \\(k \\geq 4\\) and defines a modular form of weight \\(k\\). The normalized version is</p>

\\[
E_k(z) = \\frac{G_k(z)}{2\\zeta(k)} = 1 - \\frac{2k}{B_k} \\sum_{n=1}^{\\infty} \\sigma_{k-1}(n)\\,q^n,
\\]

<p>where \\(B_k\\) is the \\(k\\)-th Bernoulli number and \\(\\sigma_{k-1}(n) = \\sum_{d|n} d^{k-1}\\) is the divisor sum. Notice that the Fourier coefficients of Eisenstein series are <em>arithmetic functions we already know</em>.</p>

<div class="env-block example">
    <div class="env-title">Example: \\(E_4\\) and \\(E_6\\)</div>
    <div class="env-body">
        <p>The two fundamental Eisenstein series are:</p>
        \\[E_4(z) = 1 + 240\\sum_{n=1}^{\\infty} \\sigma_3(n)\\,q^n = 1 + 240q + 2160q^2 + 6720q^3 + \\cdots\\]
        \\[E_6(z) = 1 - 504\\sum_{n=1}^{\\infty} \\sigma_5(n)\\,q^n = 1 - 504q - 16632q^2 - 122976q^3 - \\cdots\\]
        <p>Every modular form for \\(\\mathrm{SL}_2(\\mathbb{Z})\\) is a polynomial in \\(E_4\\) and \\(E_6\\). The space \\(M_k\\) of modular forms of weight \\(k\\) has dimension \\(\\lfloor k/12 \\rfloor + \\epsilon\\) where \\(\\epsilon\\) depends on \\(k \\bmod 12\\).</p>
    </div>
</div>

<h3>The Discriminant Form \\(\\Delta\\)</h3>

<p>The most important cusp form is the <strong>Ramanujan delta function</strong>:</p>

\\[
\\Delta(z) = \\frac{E_4(z)^3 - E_6(z)^2}{1728} = q \\prod_{n=1}^{\\infty}(1 - q^n)^{24} = \\sum_{n=1}^{\\infty} \\tau(n)\\,q^n.
\\]

<p>Here \\(\\tau(n)\\) is the <strong>Ramanujan tau function</strong>. This is a cusp form of weight 12, and it is the unique normalized cusp form in \\(S_{12}\\). The first few values are:</p>

\\[
\\tau(1) = 1,\\; \\tau(2) = -24,\\; \\tau(3) = 252,\\; \\tau(4) = -1472,\\; \\tau(5) = 4830.
\\]

<p>Despite the simple definition, the function \\(\\tau(n)\\) encodes deep arithmetic: it is multiplicative (\\(\\tau(mn) = \\tau(m)\\tau(n)\\) when \\(\\gcd(m,n) = 1\\)) and satisfies the Ramanujan conjecture \\(|\\tau(p)| \\leq 2p^{11/2}\\) for all primes \\(p\\).</p>

<div class="viz-placeholder" data-viz="viz-ramanujan-tau"></div>
`,
            visualizations: [
                {
                    id: 'viz-ramanujan-tau',
                    title: 'Ramanujan Tau Function and the Deligne Bound',
                    description: 'The scatter plot shows \\(\\tau(p)/p^{11/2}\\) for primes \\(p\\). The Ramanujan conjecture (proved by Deligne, 1974) asserts that these normalized values lie in \\([-2, 2]\\). Adjust the range to see more primes.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 380,
                            originX: 60, originY: 190, scale: 1
                        });

                        // Compute tau(n) for small n using the product formula
                        var maxN = 500;
                        var tau = new Float64Array(maxN + 1);

                        function computeTau(N) {
                            // Use q-expansion of Delta = q * prod (1 - q^n)^24
                            var coeffs = new Float64Array(N + 1);
                            coeffs[0] = 1; // start with 1
                            // Multiply by (1 - q^n)^24 for each n
                            for (var n = 1; n <= N; n++) {
                                // (1 - q^n)^24: use binomial expansion truncated
                                // More efficient: iterative convolution
                                // We multiply the running series by (1 - q^n)^24
                                // Use repeated squaring: (1-q^n)^24 = ((1-q^n)^2)^4 * (1-q^n)^4 * ...
                                // Simpler: apply (1-q^n) 24 times
                                for (var rep = 0; rep < 24; rep++) {
                                    for (var j = N; j >= n; j--) {
                                        coeffs[j] -= coeffs[j - n];
                                    }
                                }
                            }
                            // Delta = q * series, so tau(n) = coeffs[n-1]
                            for (var m = 1; m <= N; m++) {
                                tau[m] = coeffs[m - 1];
                            }
                        }
                        computeTau(maxN);

                        var primes = VizEngine.sievePrimes(maxN);
                        var pMax = 200;

                        VizEngine.createSlider(controls, 'Max prime', 50, maxN, pMax, 50, function(v) {
                            pMax = Math.round(v);
                            draw();
                        });

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            var plotL = 60, plotR = viz.width - 30;
                            var plotT = 40, plotB = viz.height - 50;
                            var plotW = plotR - plotL, plotH = plotB - plotT;

                            viz.screenText('\u03C4(p) / p^{11/2} for primes p', viz.width / 2, 18, viz.colors.white, 14);

                            // Axes
                            ctx.strokeStyle = viz.colors.axis;
                            ctx.lineWidth = 1;
                            ctx.beginPath();
                            ctx.moveTo(plotL, plotT); ctx.lineTo(plotL, plotB); ctx.lineTo(plotR, plotB);
                            ctx.stroke();

                            // y-axis: -2 to 2
                            var yMin = -2.5, yMax = 2.5;
                            function toSy(val) { return plotT + (yMax - val) / (yMax - yMin) * plotH; }
                            function toSx(p) { return plotL + (p / pMax) * plotW; }

                            // Deligne bound lines at +2 and -2
                            ctx.strokeStyle = viz.colors.red + '88';
                            ctx.lineWidth = 2;
                            ctx.setLineDash([6, 4]);
                            ctx.beginPath();
                            ctx.moveTo(plotL, toSy(2)); ctx.lineTo(plotR, toSy(2));
                            ctx.stroke();
                            ctx.beginPath();
                            ctx.moveTo(plotL, toSy(-2)); ctx.lineTo(plotR, toSy(-2));
                            ctx.stroke();
                            ctx.setLineDash([]);

                            // Band
                            ctx.fillStyle = viz.colors.red + '11';
                            ctx.fillRect(plotL, toSy(2), plotW, toSy(-2) - toSy(2));

                            // Zero line
                            ctx.strokeStyle = viz.colors.axis + '66';
                            ctx.lineWidth = 0.5;
                            ctx.beginPath();
                            ctx.moveTo(plotL, toSy(0)); ctx.lineTo(plotR, toSy(0));
                            ctx.stroke();

                            // Labels
                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '10px -apple-system,sans-serif';
                            ctx.textAlign = 'right';
                            ctx.textBaseline = 'middle';
                            for (var yv = -2; yv <= 2; yv++) {
                                ctx.fillText(yv.toString(), plotL - 6, toSy(yv));
                            }
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'top';
                            for (var xv = 0; xv <= pMax; xv += Math.max(50, Math.round(pMax / 5))) {
                                if (xv === 0) continue;
                                ctx.fillText(xv.toString(), toSx(xv), plotB + 4);
                            }

                            viz.screenText('Deligne bound: |x| \u2264 2', plotR - 60, toSy(2) - 12, viz.colors.red, 10);

                            // Plot points
                            for (var i = 0; i < primes.length; i++) {
                                var p = primes[i];
                                if (p > pMax) break;
                                var normalized = tau[p] / Math.pow(p, 5.5);
                                if (!isFinite(normalized)) continue;
                                var sx = toSx(p);
                                var sy = toSy(normalized);

                                ctx.fillStyle = (Math.abs(normalized) <= 2) ? viz.colors.blue : viz.colors.red;
                                ctx.beginPath();
                                ctx.arc(sx, sy, 3, 0, Math.PI * 2);
                                ctx.fill();
                            }

                            viz.screenText('p', viz.width / 2, plotB + 20, viz.colors.text, 11);

                            // Count
                            var visiblePrimes = primes.filter(function(p) { return p <= pMax; });
                            viz.screenText(visiblePrimes.length + ' primes shown', viz.width / 2, viz.height - 10, viz.colors.text, 10);
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Show that if \\(f\\) is a modular form of weight \\(k\\) for \\(\\mathrm{SL}_2(\\mathbb{Z})\\) and \\(k\\) is odd, then \\(f \\equiv 0\\). (Hint: consider the matrix \\(-I\\).)',
                    hint: 'Apply the transformation law with \\(\\gamma = \\begin{pmatrix} -1 & 0 \\\\ 0 & -1 \\end{pmatrix}\\). Since \\(-I \\in \\mathrm{SL}_2(\\mathbb{Z})\\), we get \\(f(z) = (-1)^k f(z)\\).',
                    solution: 'With \\(\\gamma = -I\\), the Mobius transformation gives \\(\\gamma \\cdot z = z\\), while \\((cz+d)^k = (-1)^k\\). So \\(f(z) = (-1)^k f(z)\\). If \\(k\\) is odd, \\(f(z) = -f(z)\\), hence \\(f \\equiv 0\\). This is why we only consider even weights for \\(\\mathrm{SL}_2(\\mathbb{Z})\\).'
                },
                {
                    question: 'Verify that \\(\\sigma_3(n)\\) is multiplicative and compute \\(\\sigma_3(12)\\). Check your answer against the coefficient of \\(q^{12}\\) in the expansion of \\(E_4\\).',
                    hint: 'Use \\(\\sigma_3(p^a) = 1 + p^3 + p^6 + \\cdots + p^{3a}\\) and \\(12 = 2^2 \\cdot 3\\).',
                    solution: '\\(\\sigma_3(4) = 1 + 2^3 + 2^6 = 1 + 8 + 64 = 73\\). \\(\\sigma_3(3) = 1 + 3^3 = 28\\). By multiplicativity, \\(\\sigma_3(12) = 73 \\cdot 28 = 2044\\). The coefficient of \\(q^{12}\\) in \\(E_4\\) is \\(240 \\cdot 2044 = 490560\\), plus the constant term contribution, giving \\(a(12) = 240 \\cdot \\sigma_3(12) = 490560\\).'
                }
            ]
        },

        // ================================================================
        // SECTION 3: The Fundamental Domain
        // ================================================================
        {
            id: 'sec-fundamental-domain',
            title: 'The Fundamental Domain',
            content: `
<h2>The Fundamental Domain of \\(\\mathrm{SL}_2(\\mathbb{Z})\\)</h2>

<p>The modular group \\(\\mathrm{SL}_2(\\mathbb{Z})\\) acts on \\(\\mathbb{H}\\) by Mobius transformations. Two points \\(z, w \\in \\mathbb{H}\\) are <strong>equivalent</strong> under \\(\\mathrm{SL}_2(\\mathbb{Z})\\) if \\(w = \\gamma \\cdot z\\) for some \\(\\gamma \\in \\mathrm{SL}_2(\\mathbb{Z})\\). A <strong>fundamental domain</strong> is a region that contains exactly one representative from each equivalence class (up to boundary identifications).</p>

<div class="env-block theorem">
    <div class="env-title">Theorem 17.2 (Standard Fundamental Domain)</div>
    <div class="env-body">
        <p>A fundamental domain for \\(\\mathrm{SL}_2(\\mathbb{Z})\\) acting on \\(\\mathbb{H}\\) is</p>
        \\[
        \\mathcal{F} = \\left\\{ z \\in \\mathbb{H} : |z| \\geq 1,\\; -\\tfrac{1}{2} \\leq \\operatorname{Re}(z) \\leq \\tfrac{1}{2} \\right\\},
        \\]
        <p>with boundary identifications: the left edge \\(\\operatorname{Re}(z) = -1/2\\) is identified with \\(\\operatorname{Re}(z) = 1/2\\) via \\(T: z \\mapsto z+1\\), and the left arc of \\(|z| = 1\\) is identified with the right arc via \\(S: z \\mapsto -1/z\\).</p>
    </div>
</div>

<h3>Generators of the Modular Group</h3>

<p>\\(\\mathrm{SL}_2(\\mathbb{Z})\\) is generated by two matrices:</p>

\\[
T = \\begin{pmatrix} 1 & 1 \\\\ 0 & 1 \\end{pmatrix}, \\qquad S = \\begin{pmatrix} 0 & -1 \\\\ 1 & 0 \\end{pmatrix}.
\\]

<p>Here \\(T\\) acts as \\(z \\mapsto z + 1\\) (translation) and \\(S\\) acts as \\(z \\mapsto -1/z\\) (inversion). They satisfy \\(S^2 = -I\\) and \\((ST)^3 = -I\\).</p>

<div class="env-block intuition">
    <div class="env-title">Geometry of the Fundamental Domain</div>
    <div class="env-body">
        <p>The fundamental domain \\(\\mathcal{F}\\) looks like a "keyhole": a vertical strip \\(-1/2 \\leq x \\leq 1/2\\) with the interior of the unit disk removed. The cusp at \\(i\\infty\\) corresponds to the "point at infinity" where the two vertical edges meet. The quotient \\(\\mathrm{SL}_2(\\mathbb{Z}) \\backslash \\mathbb{H}\\) is topologically a sphere with one puncture (the cusp).</p>
    </div>
</div>

<p>The visualization below shows the fundamental domain and its images under various elements of \\(\\mathrm{SL}_2(\\mathbb{Z})\\). The tiling of \\(\\mathbb{H}\\) by these images is one of the most beautiful pictures in mathematics.</p>

<div class="viz-placeholder" data-viz="viz-fundamental-domain"></div>

<h3>Special Points</h3>

<p>The fundamental domain has two <strong>elliptic points</strong>:</p>
<ul>
    <li>\\(z = i\\): fixed by \\(S\\), with stabilizer \\(\\{\\pm I, \\pm S\\}\\) of order 2.</li>
    <li>\\(z = e^{2\\pi i/3} = \\rho\\): fixed by \\(ST\\), with stabilizer of order 3.</li>
</ul>

<p>These points become orbifold points on the modular curve. The <strong>cusp</strong> at \\(i\\infty\\) (equivalently \\(\\mathbb{Q} \\cup \\{\\infty\\}\\)) is where modular forms have their \\(q\\)-expansions.</p>

<div class="env-block remark">
    <div class="env-title">Dimension Formula</div>
    <div class="env-body">
        <p>The Riemann-Roch theorem on the modular curve gives the dimension of the space of modular forms of weight \\(k\\):</p>
        \\[
        \\dim M_k(\\mathrm{SL}_2(\\mathbb{Z})) = \\begin{cases} \\lfloor k/12 \\rfloor & \\text{if } k \\equiv 2 \\pmod{12}, \\\\ \\lfloor k/12 \\rfloor + 1 & \\text{otherwise}, \\end{cases}
        \\]
        <p>for even \\(k \\geq 2\\), and \\(\\dim S_k = \\dim M_k - 1\\) for \\(k \\geq 4\\) (subtracting the Eisenstein series). So \\(S_{12}\\) is one-dimensional, spanned by \\(\\Delta\\).</p>
    </div>
</div>
`,
            visualizations: [
                {
                    id: 'viz-fundamental-domain',
                    title: 'Fundamental Domain and Tiling of the Upper Half-Plane',
                    description: 'The shaded region is the standard fundamental domain for SL(2,Z). Click "Tile" to see copies under T, S, and their compositions fill the upper half-plane. The animation applies the generators one at a time.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 400,
                            originX: 280, originY: 370, scale: 140
                        });

                        var tileDepth = 0;
                        var animFrame = 0;
                        var animating = false;

                        VizEngine.createButton(controls, 'Tile', function() {
                            if (animating) return;
                            animating = true;
                            tileDepth = 0;
                            function step() {
                                tileDepth++;
                                draw();
                                if (tileDepth < 6) {
                                    setTimeout(step, 500);
                                } else {
                                    animating = false;
                                }
                            }
                            step();
                        });

                        VizEngine.createButton(controls, 'Reset', function() {
                            tileDepth = 0;
                            animating = false;
                            draw();
                        });

                        // Mobius transformations
                        function mobiusT(z) { return [z[0] + 1, z[1]]; }
                        function mobiusTinv(z) { return [z[0] - 1, z[1]]; }
                        function mobiusS(z) {
                            var x = z[0], y = z[1];
                            var d = x * x + y * y;
                            if (d < 1e-10) return [0, 1e6];
                            return [-x / d, y / d];
                        }

                        function drawFundDomain(ctx, alpha) {
                            var steps = 60;
                            ctx.beginPath();
                            // Left edge from rho up
                            var [sx, sy] = viz.toScreen(-0.5, 3.5);
                            ctx.moveTo(sx, sy);
                            [sx, sy] = viz.toScreen(-0.5, Math.sqrt(3) / 2);
                            ctx.lineTo(sx, sy);
                            // Arc from -1/2+i*sqrt(3)/2 to 1/2+i*sqrt(3)/2
                            for (var t = 0; t <= steps; t++) {
                                var angle = 2 * Math.PI / 3 - t * (Math.PI / 3) / steps;
                                var px = Math.cos(angle);
                                var py = Math.sin(angle);
                                [sx, sy] = viz.toScreen(px, py);
                                ctx.lineTo(sx, sy);
                            }
                            // Right edge up
                            [sx, sy] = viz.toScreen(0.5, 3.5);
                            ctx.lineTo(sx, sy);
                            ctx.closePath();
                            ctx.fillStyle = viz.colors.blue + (alpha || '33');
                            ctx.fill();
                            ctx.strokeStyle = viz.colors.blue + 'aa';
                            ctx.lineWidth = 1.5;
                            ctx.stroke();
                        }

                        function drawTransformedDomain(ctx, transform, color, alpha) {
                            var steps = 40;
                            var points = [];

                            // Left edge
                            for (var t = 0; t <= 10; t++) {
                                var y = Math.sqrt(3) / 2 + (3.5 - Math.sqrt(3) / 2) * t / 10;
                                points.push(transform([-0.5, y]));
                            }
                            // Arc
                            for (var t = 0; t <= steps; t++) {
                                var angle = 2 * Math.PI / 3 - t * (Math.PI / 3) / steps;
                                points.push(transform([Math.cos(angle), Math.sin(angle)]));
                            }
                            // Right edge up
                            for (var t = 0; t <= 10; t++) {
                                var y = Math.sqrt(3) / 2 + (3.5 - Math.sqrt(3) / 2) * t / 10;
                                points.push(transform([0.5, y]));
                            }

                            ctx.beginPath();
                            for (var i = 0; i < points.length; i++) {
                                var [sx, sy] = viz.toScreen(points[i][0], points[i][1]);
                                if (sy < -100 || sy > viz.height + 100 || sx < -200 || sx > viz.width + 200) continue;
                                if (i === 0) ctx.moveTo(sx, sy);
                                else ctx.lineTo(sx, sy);
                            }
                            ctx.closePath();
                            ctx.fillStyle = color + (alpha || '22');
                            ctx.fill();
                            ctx.strokeStyle = color + '66';
                            ctx.lineWidth = 0.8;
                            ctx.stroke();
                        }

                        // Generate transformations at a given depth
                        function getTransforms(depth) {
                            if (depth === 0) return [];
                            var generators = [mobiusT, mobiusTinv, mobiusS];
                            var transforms = [];
                            var queue = generators.map(function(g) { return { fn: g, depth: 1 }; });

                            for (var i = 0; i < queue.length && i < 80; i++) {
                                var item = queue[i];
                                transforms.push(item.fn);
                                if (item.depth < depth) {
                                    for (var j = 0; j < generators.length; j++) {
                                        var g = generators[j];
                                        var composed = (function(outer, inner) {
                                            return function(z) { return outer(inner(z)); };
                                        })(g, item.fn);
                                        queue.push({ fn: composed, depth: item.depth + 1 });
                                    }
                                }
                            }
                            return transforms;
                        }

                        var tileColors = [viz.colors.teal, viz.colors.orange, viz.colors.purple, viz.colors.green, viz.colors.pink, viz.colors.yellow];

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            // Draw unit circle for reference
                            var [cx, cy] = viz.toScreen(0, 0);
                            ctx.strokeStyle = viz.colors.grid;
                            ctx.lineWidth = 0.5;
                            ctx.beginPath();
                            ctx.arc(cx, cy, viz.scale, 0, Math.PI * 2);
                            ctx.stroke();

                            // Real axis
                            ctx.strokeStyle = viz.colors.axis;
                            ctx.lineWidth = 1;
                            ctx.beginPath();
                            ctx.moveTo(0, viz.originY);
                            ctx.lineTo(viz.width, viz.originY);
                            ctx.stroke();

                            // Tiled copies
                            if (tileDepth > 0) {
                                var transforms = getTransforms(tileDepth);
                                for (var i = 0; i < transforms.length; i++) {
                                    drawTransformedDomain(ctx, transforms[i], tileColors[i % tileColors.length], '18');
                                }
                            }

                            // Main fundamental domain on top
                            drawFundDomain(ctx, '44');

                            // Special points
                            viz.drawPoint(0, 1, viz.colors.orange, 'i', 4);
                            viz.drawPoint(-0.5, Math.sqrt(3) / 2, viz.colors.teal, '\u03C1', 4);
                            viz.drawPoint(0.5, Math.sqrt(3) / 2, viz.colors.teal, '\u03C1\u0304', 4);

                            // Labels
                            viz.screenText('Fundamental Domain of SL\u2082(\u2124)', viz.width / 2, 18, viz.colors.white, 14);
                            viz.screenText('\u2131', viz.width / 2, viz.height / 2 - 40, viz.colors.blue, 18);

                            if (tileDepth > 0) {
                                viz.screenText('Depth ' + tileDepth + ' tiling (' + getTransforms(tileDepth).length + ' copies)', viz.width / 2, viz.height - 12, viz.colors.text, 10);
                            }
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Show that every \\(z \\in \\mathbb{H}\\) is equivalent under \\(\\mathrm{SL}_2(\\mathbb{Z})\\) to some point in \\(\\mathcal{F}\\). (Hint: use \\(T\\) to put \\(|\\operatorname{Re}(z)| \\leq 1/2\\), then \\(S\\) if \\(|z| < 1\\), and argue that \\(\\operatorname{Im}(\\gamma z)\\) cannot increase indefinitely.)',
                    hint: 'The key observation is that \\(\\operatorname{Im}(\\gamma z) = \\operatorname{Im}(z) / |cz+d|^2\\). If \\(|z| < 1\\) and we apply \\(S\\), the imaginary part increases. This process must terminate because there are only finitely many \\((c,d)\\) with \\(|cz+d| < 1\\).',
                    solution: 'First apply powers of \\(T\\) to ensure \\(|\\operatorname{Re}(z)| \\leq 1/2\\). If \\(|z| \\geq 1\\), we are in \\(\\mathcal{F}\\). If \\(|z| < 1\\), apply \\(S: z \\mapsto -1/z\\). Then \\(\\operatorname{Im}(-1/z) = \\operatorname{Im}(z)/|z|^2 > \\operatorname{Im}(z)\\). Re-center with \\(T\\) and repeat. Since \\(\\operatorname{Im}(\\gamma z) = y/|cz+d|^2\\) and there are only finitely many \\((c,d)\\) with \\(|cz+d|^2 < 1\\), the imaginary part strictly increases at each step and the algorithm terminates in \\(\\mathcal{F}\\).'
                },
                {
                    question: 'The element \\(ST\\) has order 3 in \\(\\mathrm{PSL}_2(\\mathbb{Z})\\). Verify this by computing \\((ST)^3\\).',
                    hint: 'Multiply the matrices \\(S = \\begin{pmatrix} 0 & -1 \\\\ 1 & 0 \\end{pmatrix}\\) and \\(T = \\begin{pmatrix} 1 & 1 \\\\ 0 & 1 \\end{pmatrix}\\).',
                    solution: '\\(ST = \\begin{pmatrix} 0 & -1 \\\\ 1 & 1 \\end{pmatrix}\\). Then \\((ST)^2 = \\begin{pmatrix} -1 & -1 \\\\ 1 & 0 \\end{pmatrix}\\) and \\((ST)^3 = \\begin{pmatrix} -1 & 0 \\\\ 0 & -1 \\end{pmatrix} = -I\\). In \\(\\mathrm{PSL}_2(\\mathbb{Z}) = \\mathrm{SL}_2(\\mathbb{Z})/\\{\\pm I\\}\\), this is the identity. So \\(ST\\) has order 3, and the stabilizer of \\(\\rho = e^{2\\pi i/3}\\) is cyclic of order 3.'
                }
            ]
        },

        // ================================================================
        // SECTION 4: Hecke Operators
        // ================================================================
        {
            id: 'sec-hecke',
            title: 'Hecke Operators',
            content: `
<h2>Hecke Operators: The Bridge to \\(L\\)-Functions</h2>

<div class="env-block intuition">
    <div class="env-title">Why Hecke Operators Matter</div>
    <div class="env-body">
        <p>Modular forms have Fourier coefficients \\(a(n)\\). To build an \\(L\\)-function \\(L(s,f) = \\sum a(n)n^{-s}\\) with an Euler product, we need the coefficients to be multiplicative. Hecke operators are the tool that makes this happen: they are a commuting family of linear operators on the space of modular forms, and their simultaneous eigenfunctions (called <em>eigenforms</em>) automatically have multiplicative Fourier coefficients.</p>
    </div>
</div>

<h3>Definition of Hecke Operators</h3>

<div class="env-block definition">
    <div class="env-title">Definition 17.3 (Hecke Operator \\(T_n\\))</div>
    <div class="env-body">
        <p>For a modular form \\(f\\) of weight \\(k\\) and a positive integer \\(n\\), the <strong>Hecke operator</strong> \\(T_n\\) is defined by</p>
        \\[
        (T_n f)(z) = n^{k-1} \\sum_{ad = n} \\sum_{b=0}^{d-1} d^{-k} f\\!\\left(\\frac{az + b}{d}\\right).
        \\]
        <p>Equivalently, if \\(f(z) = \\sum a(m)q^m\\), then</p>
        \\[
        (T_n f)(z) = \\sum_{m=0}^{\\infty} \\left(\\sum_{d | \\gcd(m,n)} d^{k-1} a(mn/d^2)\\right) q^m.
        \\]
    </div>
</div>

<p>For a prime \\(p\\), the formula simplifies:</p>

\\[
(T_p f)(z) = \\sum_{m=0}^{\\infty} \\left(a(mp) + p^{k-1} a(m/p)\\right) q^m,
\\]

<p>where \\(a(m/p) = 0\\) if \\(p \\nmid m\\).</p>

<h3>Key Properties</h3>

<div class="env-block theorem">
    <div class="env-title">Theorem 17.4 (Hecke Algebra)</div>
    <div class="env-body">
        <p>The Hecke operators satisfy:</p>
        <ol>
            <li>\\(T_n\\) maps \\(M_k \\to M_k\\) and \\(S_k \\to S_k\\) (preserves the space and the cuspidal subspace).</li>
            <li>\\(T_m T_n = T_{mn}\\) when \\(\\gcd(m,n) = 1\\).</li>
            <li>\\(T_{p^{r+1}} = T_p T_{p^r} - p^{k-1} T_{p^{r-1}}\\) (recurrence at prime powers).</li>
            <li>The \\(T_n\\) are self-adjoint with respect to the Petersson inner product, hence simultaneously diagonalizable on \\(S_k\\).</li>
        </ol>
    </div>
</div>

<div class="env-block definition">
    <div class="env-title">Definition 17.5 (Hecke Eigenform)</div>
    <div class="env-body">
        <p>A modular form \\(f\\) is a <strong>Hecke eigenform</strong> if \\(T_n f = \\lambda(n) f\\) for all \\(n\\). If \\(f\\) is normalized (\\(a(1) = 1\\)), then \\(\\lambda(n) = a(n)\\): the eigenvalue equals the Fourier coefficient.</p>
    </div>
</div>

<p>This is the crucial fact: for a normalized Hecke eigenform, \\(a(n)\\) is multiplicative and satisfies the recurrence \\(a(p^{r+1}) = a(p)a(p^r) - p^{k-1}a(p^{r-1})\\). The associated \\(L\\)-function</p>

\\[
L(s, f) = \\sum_{n=1}^{\\infty} a(n)n^{-s} = \\prod_{p} \\frac{1}{1 - a(p)p^{-s} + p^{k-1-2s}}
\\]

<p>has an Euler product of degree 2.</p>

<div class="viz-placeholder" data-viz="viz-hecke-lattice"></div>

<div class="env-block example">
    <div class="env-title">Example: \\(\\Delta\\) as Hecke Eigenform</div>
    <div class="env-body">
        <p>Since \\(S_{12}\\) is one-dimensional, \\(\\Delta\\) is automatically a Hecke eigenform. Its \\(L\\)-function is</p>
        \\[L(s, \\Delta) = \\sum_{n=1}^{\\infty} \\tau(n)n^{-s} = \\prod_p \\frac{1}{1 - \\tau(p)p^{-s} + p^{11-2s}}.\\]
        <p>This converges for \\(\\operatorname{Re}(s) > 7\\) (by the trivial bound \\(|\\tau(n)| \\ll n^{11/2+\\varepsilon}\\)), extends to an entire function, and satisfies a functional equation relating \\(s\\) and \\(12 - s\\).</p>
    </div>
</div>
`,
            visualizations: [
                {
                    id: 'viz-hecke-lattice',
                    title: 'Hecke Operators as Lattice Averaging',
                    description: 'The Hecke operator \\(T_p\\) averages a modular form over sublattices of index \\(p\\). For a prime \\(p\\), there are \\(p+1\\) such sublattices. This visualization shows the sublattices of \\(\\mathbb{Z}^2\\) of index \\(p\\) for small primes.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 400,
                            originX: 280, originY: 200, scale: 40
                        });

                        var p = 2;
                        var primeList = [2, 3, 5, 7];

                        VizEngine.createSlider(controls, 'p', 0, 3, 0, 1, function(v) {
                            p = primeList[Math.round(v)];
                            draw();
                        });

                        function getSublattices(p) {
                            // Sublattices of Z^2 with index p:
                            // (a,b; 0,d) with ad = p, 0 <= b < d
                            var sublattices = [];
                            // a=1, d=p: b = 0,1,...,p-1
                            for (var b = 0; b < p; b++) {
                                sublattices.push({ a: 1, b: b, d: p });
                            }
                            // a=p, d=1: b=0
                            sublattices.push({ a: p, b: 0, d: 1 });
                            return sublattices;
                        }

                        var subColors = [viz.colors.blue, viz.colors.teal, viz.colors.orange, viz.colors.purple, viz.colors.green, viz.colors.pink, viz.colors.yellow, viz.colors.red];

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            viz.screenText('Sublattices of Z\u00B2 with index p = ' + p, viz.width / 2, 18, viz.colors.white, 14);
                            viz.screenText('(' + (p + 1) + ' sublattices, each shown with distinct markers)', viz.width / 2, 36, viz.colors.text, 11);

                            // Draw Z^2 lattice points
                            var range = 4;
                            for (var x = -range; x <= range; x++) {
                                for (var y = -range; y <= range; y++) {
                                    viz.drawPoint(x, y, viz.colors.grid + '44', null, 2);
                                }
                            }

                            // Draw sublattices
                            var sublattices = getSublattices(p);
                            var spacing = (viz.width - 40) / sublattices.length;

                            for (var si = 0; si < sublattices.length; si++) {
                                var sl = sublattices[si];
                                var col = subColors[si % subColors.length];

                                // Sublattice generated by (a, 0) and (b, d)
                                // Points: m*(a,0) + n*(b,d) = (ma + nb, nd)
                                for (var m = -range; m <= range; m++) {
                                    for (var n = -range; n <= range; n++) {
                                        var px = m * sl.a + n * sl.b;
                                        var py = n * sl.d;
                                        if (Math.abs(px) > range || Math.abs(py) > range) continue;
                                        viz.drawPoint(px, py, col, null, 3.5);
                                    }
                                }

                                // Basis vectors
                                viz.drawVector(0, 0, sl.a, 0, col + '88', null, 1.5);
                                viz.drawVector(0, 0, sl.b, sl.d, col + '88', null, 1.5);

                                // Label at bottom
                                viz.screenText('(' + sl.a + ',' + sl.b + ';' + sl.d + ')', 30 + si * spacing + spacing / 2, viz.height - 20, col, 10);
                            }

                            viz.screenText('T_' + p + ' averages f over these ' + sublattices.length + ' sublattices', viz.width / 2, viz.height - 40, viz.colors.teal, 11);
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Let \\(f(z) = \\sum a(n)q^n\\) be a normalized Hecke eigenform of weight \\(k\\). Show that \\(a(p^2) = a(p)^2 - p^{k-1}\\) for any prime \\(p\\).',
                    hint: 'Use the Hecke recurrence \\(T_{p^2} = T_p^2 - p^{k-1} T_1\\). For a normalized eigenform, \\(T_n f = a(n) f\\) and \\(T_1 = \\mathrm{Id}\\).',
                    solution: 'Since \\(f\\) is an eigenform with \\(T_n f = a(n)f\\), and \\(T_{p^2} = T_p^2 - p^{k-1}\\), we get \\(a(p^2) = a(p)^2 - p^{k-1}\\). For \\(\\Delta\\) (weight 12): \\(\\tau(4) = \\tau(2)^2 - 2^{11} = 576 - 2048 = -1472\\). Check: \\(\\tau(4) = -1472\\). Verified!'
                },
                {
                    question: 'Explain why the Euler product for \\(L(s,f)\\) has degree 2 (i.e., each local factor is \\(1/(1 - a(p)p^{-s} + p^{k-1-2s})\\)), while the Euler product for \\(\\zeta(s)\\) has degree 1. What does this say about the "complexity" of \\(f\\) versus the trivial representation?',
                    hint: 'The Riemann zeta function comes from the trivial automorphic form (the constant function 1). Its local factor \\(1/(1 - p^{-s})\\) reflects a one-dimensional Galois representation.',
                    solution: 'The degree of the Euler product equals the dimension of the underlying Galois representation (or automorphic representation). \\(\\zeta(s)\\) corresponds to the trivial one-dimensional representation, giving degree-1 factors. A weight-\\(k\\) Hecke eigenform corresponds to a two-dimensional \\(\\ell\\)-adic Galois representation (Deligne), giving degree-2 factors. Higher-rank automorphic forms on \\(\\mathrm{GL}_n\\) produce degree-\\(n\\) Euler products. The Langlands program predicts that <em>all</em> motivic \\(L\\)-functions arise this way.'
                }
            ]
        },

        // ================================================================
        // SECTION 5: The Ramanujan Conjecture and Langlands
        // ================================================================
        {
            id: 'sec-ramanujan',
            title: 'Ramanujan & Langlands',
            content: `
<h2>The Ramanujan Conjecture and the Langlands Program</h2>

<h3>The Ramanujan Conjecture</h3>

<p>Ramanujan (1916) conjectured that the coefficients of \\(\\Delta\\) satisfy:</p>

<div class="env-block theorem">
    <div class="env-title">Conjecture / Theorem 17.6 (Ramanujan-Petersson)</div>
    <div class="env-body">
        <p>Let \\(f \\in S_k(\\mathrm{SL}_2(\\mathbb{Z}))\\) be a normalized Hecke eigenform with Fourier coefficients \\(a(n)\\). Then for all primes \\(p\\),</p>
        \\[
        |a(p)| \\leq 2p^{(k-1)/2}.
        \\]
        <p>Equivalently, if we write \\(a(p) = p^{(k-1)/2}(\\alpha_p + \\alpha_p^{-1})\\) for some \\(\\alpha_p \\in \\mathbb{C}\\), then \\(|\\alpha_p| = 1\\) (the local roots lie on the unit circle).</p>
    </div>
</div>

<p>For \\(\\Delta\\) specifically, this says \\(|\\tau(p)| \\leq 2p^{11/2}\\). This was proved by <strong>Deligne (1974)</strong> as a consequence of his proof of the Weil conjectures. The proof uses the etale cohomology of algebraic varieties over finite fields; it is one of the deepest results in 20th-century mathematics.</p>

<div class="env-block remark">
    <div class="env-title">Connection to the Riemann Hypothesis</div>
    <div class="env-body">
        <p>The Ramanujan conjecture is equivalent to the statement that \\(L(s, f)\\) satisfies the <strong>generalized Riemann hypothesis</strong> in a specific sense: the local factor \\(1 - a(p)p^{-s} + p^{k-1-2s}\\) has its roots at \\(\\operatorname{Re}(s) = (k-1)/2\\). This is the "Ramanujan-Petersson conjecture at the finite places," and it is a local analogue of the Riemann hypothesis for \\(L(s,f)\\).</p>
    </div>
</div>

<h3>The Langlands Program</h3>

<p>The Langlands program, initiated by Robert Langlands in 1967, is the most ambitious organizing framework in modern number theory. At its core is a stunning prediction:</p>

<div class="env-block theorem">
    <div class="env-title">Langlands Philosophy (Informal Statement)</div>
    <div class="env-body">
        <p>There is a natural bijection between:</p>
        <ul>
            <li><strong>Automorphic representations</strong> of \\(\\mathrm{GL}_n\\) over \\(\\mathbb{Q}\\) (the "analytic" side)</li>
            <li><strong>\\(n\\)-dimensional \\(\\ell\\)-adic Galois representations</strong> of \\(\\mathrm{Gal}(\\overline{\\mathbb{Q}}/\\mathbb{Q})\\) (the "algebraic" side)</li>
        </ul>
        <p>This bijection matches \\(L\\)-functions on both sides: the automorphic \\(L\\)-function equals the Artin/motivic \\(L\\)-function.</p>
    </div>
</div>

<p>Some landmark results within (or inspired by) the Langlands program:</p>

<table style="width:100%;border-collapse:collapse;margin:1em 0;">
<tr style="border-bottom:1px solid #30363d;">
    <th style="text-align:left;padding:6px;color:#c9d1d9;">Result</th>
    <th style="text-align:left;padding:6px;color:#c9d1d9;">Year</th>
    <th style="text-align:left;padding:6px;color:#c9d1d9;">Significance</th>
</tr>
<tr style="border-bottom:1px solid #1a1a40;">
    <td style="padding:6px;">Ramanujan-Petersson (Deligne)</td>
    <td style="padding:6px;">1974</td>
    <td style="padding:6px;">Optimal coefficient bounds via Weil conjectures</td>
</tr>
<tr style="border-bottom:1px solid #1a1a40;">
    <td style="padding:6px;">Modularity theorem</td>
    <td style="padding:6px;">1995-2001</td>
    <td style="padding:6px;">Every elliptic curve over \\(\\mathbb{Q}\\) is modular (Wiles, Taylor, Breuil, Conrad, Diamond)</td>
</tr>
<tr style="border-bottom:1px solid #1a1a40;">
    <td style="padding:6px;">Sato-Tate conjecture</td>
    <td style="padding:6px;">2011</td>
    <td style="padding:6px;">Distribution of \\(a(p)/2p^{(k-1)/2}\\) follows \\(\\frac{2}{\\pi}\\sqrt{1-t^2}\\,dt\\)</td>
</tr>
<tr style="border-bottom:1px solid #1a1a40;">
    <td style="padding:6px;">Functoriality for \\(\\mathrm{GL}_2\\)</td>
    <td style="padding:6px;">Various</td>
    <td style="padding:6px;">Symmetric powers, Rankin-Selberg convolutions</td>
</tr>
</table>

<h3>The Sato-Tate Distribution</h3>

<p>For a normalized Hecke eigenform \\(f\\) of weight \\(k\\), the Ramanujan conjecture says \\(a(p) = 2p^{(k-1)/2}\\cos\\theta_p\\) for some angle \\(\\theta_p \\in [0, \\pi]\\). The Sato-Tate conjecture (now a theorem for \\(\\mathrm{GL}_2\\) eigenforms without CM) predicts that the angles \\(\\theta_p\\) are equidistributed with respect to the measure</p>

\\[
\\mu_{\\mathrm{ST}} = \\frac{2}{\\pi} \\sin^2\\theta\\,d\\theta.
\\]

<p>This means the normalized coefficients cluster near 0 (where \\(\\sin^2\\theta\\) is largest), with the density vanishing at \\(\\pm 1\\) (where \\(\\cos\\theta = \\pm 1\\)).</p>
`,
            visualizations: [],
            exercises: [
                {
                    question: 'The Ramanujan bound says \\(|\\tau(p)| \\leq 2p^{11/2}\\). Compute the ratio \\(\\tau(p)/(2p^{11/2})\\) for \\(p = 2, 3, 5, 7, 11\\). Which prime comes closest to saturating the bound?',
                    hint: 'The values are \\(\\tau(2) = -24\\), \\(\\tau(3) = 252\\), \\(\\tau(5) = 4830\\), \\(\\tau(7) = -16744\\), \\(\\tau(11) = 534612\\).',
                    solution: 'The ratios \\(\\tau(p)/(2p^{11/2})\\) are: \\(p=2\\): \\(-24/90.5 \\approx -0.265\\); \\(p=3\\): \\(252/280.6 \\approx 0.898\\); \\(p=5\\): \\(4830/5590.2 \\approx 0.864\\); \\(p=7\\): \\(-16744/25942 \\approx -0.645\\); \\(p=11\\): \\(534612/88286 \\approx 0.605\\) (using \\(2 \\cdot 11^{11/2} \\approx 88286\\)). The prime \\(p = 3\\) comes closest to the bound at about \\(0.898\\). None saturate it, consistent with the Sato-Tate distribution favoring values near 0.'
                }
            ]
        },

        // ================================================================
        // SECTION 6: The Bridge — From Classical to Modern
        // ================================================================
        {
            id: 'sec-bridge',
            title: 'The Bridge to Modern Theory',
            content: `
<h2>The Bridge: From Classical to Modern</h2>

<div class="env-block intuition">
    <div class="env-title">Everything Connects</div>
    <div class="env-body">
        <p>This chapter has traced a path from the functional equation of \\(\\zeta(s)\\) (Chapter 5) to the Langlands program. Let us now make explicit how each topic in this course fits into the automorphic framework.</p>
    </div>
</div>

<h3>The Dictionary</h3>

<table style="width:100%;border-collapse:collapse;margin:1em 0;">
<tr style="border-bottom:1px solid #30363d;">
    <th style="text-align:left;padding:6px;color:#c9d1d9;">Classical Object</th>
    <th style="text-align:left;padding:6px;color:#c9d1d9;">Automorphic Incarnation</th>
    <th style="text-align:left;padding:6px;color:#c9d1d9;">Chapter</th>
</tr>
<tr style="border-bottom:1px solid #1a1a40;">
    <td style="padding:6px;">\\(\\zeta(s)\\)</td>
    <td style="padding:6px;">Eisenstein series \\(E_s\\) on \\(\\mathrm{GL}_1\\)</td>
    <td style="padding:6px;">Ch 4-5</td>
</tr>
<tr style="border-bottom:1px solid #1a1a40;">
    <td style="padding:6px;">\\(L(s, \\chi)\\)</td>
    <td style="padding:6px;">Hecke character / automorphic form on \\(\\mathrm{GL}_1\\)</td>
    <td style="padding:6px;">Ch 9-10</td>
</tr>
<tr style="border-bottom:1px solid #1a1a40;">
    <td style="padding:6px;">\\(\\theta(z) = \\sum e^{\\pi i n^2 z}\\)</td>
    <td style="padding:6px;">Automorphic form of weight 1/2</td>
    <td style="padding:6px;">Ch 5</td>
</tr>
<tr style="border-bottom:1px solid #1a1a40;">
    <td style="padding:6px;">\\(L(s, f)\\) for eigenform \\(f\\)</td>
    <td style="padding:6px;">Standard \\(L\\)-function on \\(\\mathrm{GL}_2\\)</td>
    <td style="padding:6px;">This chapter</td>
</tr>
<tr style="border-bottom:1px solid #1a1a40;">
    <td style="padding:6px;">Bombieri-Vinogradov</td>
    <td style="padding:6px;">Equidistribution of automorphic \\(L\\)-functions</td>
    <td style="padding:6px;">Ch 13</td>
</tr>
<tr style="border-bottom:1px solid #1a1a40;">
    <td style="padding:6px;">GRH (all \\(L\\)-functions)</td>
    <td style="padding:6px;">Generalized Ramanujan conjecture</td>
    <td style="padding:6px;">Ch 16</td>
</tr>
</table>

<h3>Why the Automorphic Viewpoint Wins</h3>

<p>Three reasons to adopt the automorphic perspective, even if your primary interest is in primes:</p>

<ol>
    <li><strong>Unified proofs.</strong> The analytic continuation and functional equation of \\(L(s,f)\\) follow from a single argument (the Rankin-Selberg method or the Langlands-Shahidi method), rather than ad hoc theta-function tricks for each \\(L\\)-function.</li>

    <li><strong>Stronger results.</strong> Many problems in analytic number theory reduce to subconvexity bounds for \\(L\\)-functions (e.g., equidistribution of lattice points on spheres). The automorphic framework provides the natural tools (amplification, spectral decomposition) for proving these bounds.</li>

    <li><strong>New phenomena.</strong> Automorphic forms reveal structure invisible from the classical viewpoint. The Selberg eigenvalue conjecture (\\(\\lambda_1 \\geq 1/4\\) for Maass forms) has no classical analogue but controls error terms in counting problems. The Langlands functoriality transfers information between different groups, yielding results about primes that cannot be obtained by elementary or classical analytic methods.</li>
</ol>

<h3>What Comes Next</h3>

<p>The remaining chapters of this course (Chapters 18-21) explore problems where the automorphic viewpoint, while not always explicit, provides the organizing principle:</p>

<ul>
    <li><strong>Primes in short intervals</strong> (Ch 18): controlled by zero-density estimates, which are sharpened by the spectral theory of automorphic forms.</li>
    <li><strong>Bounded gaps between primes</strong> (Ch 19): the Maynard-Tao sieve uses the Bombieri-Vinogradov theorem, which in its sharpest forms is an equidistribution result for automorphic \\(L\\)-functions.</li>
    <li><strong>Computational methods</strong> (Ch 20): algorithms for computing \\(L(s,f)\\) and verifying the Riemann hypothesis numerically rely on the modular structure.</li>
    <li><strong>Open problems</strong> (Ch 21): GRH, the Ramanujan conjecture for Maass forms, and Langlands functoriality remain among the deepest unsolved problems in mathematics.</li>
</ul>

<div class="env-block remark">
    <div class="env-title">Further Reading</div>
    <div class="env-body">
        <p>For a rigorous development: Iwaniec, <em>Topics in Classical Automorphic Forms</em> (AMS, 1997). For the Langlands program: Gelbart, <em>An Elementary Introduction to the Langlands Program</em> (Bull. AMS, 1984). For Deligne's proof: the original paper in Publ. Math. IHES 43 (1974), or the exposition by Katz in <em>Sommes Exponentielles</em>.</p>
    </div>
</div>
`,
            visualizations: [],
            exercises: [
                {
                    question: 'The Modularity Theorem says that every elliptic curve \\(E/\\mathbb{Q}\\) of conductor \\(N\\) corresponds to a weight-2 newform \\(f \\in S_2(\\Gamma_0(N))\\). What does the Ramanujan conjecture for \\(f\\) tell you about the number of points on \\(E\\) modulo \\(p\\)?',
                    hint: 'If \\(a_p(E) = p + 1 - \\#E(\\mathbb{F}_p)\\), then \\(a_p(E) = a_p(f)\\) by modularity. The Ramanujan bound for weight 2 gives \\(|a_p| \\leq 2\\sqrt{p}\\).',
                    solution: 'By modularity, \\(a_p(E) = a_p(f)\\). The Ramanujan conjecture for weight 2 gives \\(|a_p(f)| \\leq 2p^{1/2}\\), so \\(|p + 1 - \\#E(\\mathbb{F}_p)| \\leq 2\\sqrt{p}\\), i.e., \\(\\#E(\\mathbb{F}_p) = p + 1 + O(\\sqrt{p})\\). This is precisely the <strong>Hasse bound</strong>, proved by Hasse in 1933 by purely algebraic methods. The modularity theorem gives a second, deeper proof via automorphic forms.'
                },
                {
                    question: '(Computational) Using the product formula \\(\\Delta(z) = q \\prod_{n=1}^{\\infty}(1-q^n)^{24}\\), compute \\(\\tau(6)\\) and verify that \\(\\tau(6) = \\tau(2)\\tau(3)\\) (multiplicativity for coprime arguments).',
                    hint: 'Expand the product to get the coefficient of \\(q^6\\). Alternatively, use the known values \\(\\tau(2) = -24\\), \\(\\tau(3) = 252\\).',
                    solution: 'From the \\(q\\)-expansion: \\(\\tau(6) = -6048\\). Checking multiplicativity: \\(\\tau(2)\\tau(3) = (-24)(252) = -6048\\). It works! This is a consequence of \\(\\Delta\\) being a Hecke eigenform. For non-coprime products, we need the Hecke recurrence: e.g., \\(\\tau(4) = \\tau(2)^2 - 2^{11} = 576 - 2048 = -1472\\).'
                }
            ]
        }
    ]
});
