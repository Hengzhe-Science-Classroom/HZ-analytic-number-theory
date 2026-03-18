window.CHAPTERS = window.CHAPTERS || [];
window.CHAPTERS.push({
    id: 'ch06',
    number: 6,
    title: 'Zero-Free Regions',
    subtitle: 'Why primes obey the Prime Number Theorem',
    sections: [
        // ================================================================
        // SECTION 1: Why Zeros Matter
        // ================================================================
        {
            id: 'sec-motivation',
            title: 'Why Zeros Matter',
            content: `
<h2>Why Zeros Matter</h2>

<div class="env-block intuition">
    <div class="env-title">The Grand Strategy</div>
    <div class="env-body">
        <p>The Prime Number Theorem (PNT) states that \\(\\pi(x) \\sim x/\\log x\\). By 1896, when de la Vall&eacute;e-Poussin and Hadamard independently proved it, the entire argument boiled down to one statement: <strong>\\(\\zeta(s)\\) has no zeros on the line \\(\\operatorname{Re}(s) = 1\\)</strong>.</p>
        <p>This chapter establishes that fact and extends it to a full <em>zero-free region</em> inside the critical strip, which controls the error term in the PNT.</p>
    </div>
</div>

<p>Recall from Chapter 5 that the Riemann zeta function \\(\\zeta(s)\\) extends meromorphically to all of \\(\\mathbb{C}\\), with a single simple pole at \\(s = 1\\). The functional equation relates \\(\\zeta(s)\\) to \\(\\zeta(1-s)\\), showing that the "interesting" zeros (the non-trivial ones) all lie in the critical strip \\(0 < \\operatorname{Re}(s) < 1\\).</p>

<h3>The Equivalence: PNT \\(\\Longleftrightarrow\\) No Zeros on \\(\\operatorname{Re}(s)=1\\)</h3>

<p>The connection between \\(\\zeta(s)\\) and primes runs through the logarithmic derivative:</p>
\\[
-\\frac{\\zeta'(s)}{\\zeta(s)} = \\sum_{n=1}^{\\infty} \\frac{\\Lambda(n)}{n^s}, \\quad \\operatorname{Re}(s) > 1,
\\]
<p>where \\(\\Lambda(n)\\) is the von Mangoldt function. By Perron's formula, the Chebyshev function \\(\\psi(x) = \\sum_{n \\le x} \\Lambda(n)\\) can be recovered as a contour integral:</p>
\\[
\\psi(x) = \\frac{1}{2\\pi i} \\int_{c-i\\infty}^{c+i\\infty} \\left(-\\frac{\\zeta'(s)}{\\zeta(s)}\\right) \\frac{x^s}{s} \\, ds, \\quad c > 1.
\\]

<p>When we shift the contour to the left, every zero \\(\\rho = \\beta + i\\gamma\\) of \\(\\zeta(s)\\) in the critical strip contributes a term proportional to \\(x^{\\rho}/\\rho\\) to \\(\\psi(x)\\). The PNT (in the form \\(\\psi(x) \\sim x\\)) holds if and only if these contributions do not dominate:</p>

<div class="env-block theorem">
    <div class="env-title">Theorem 6.1 (PNT Equivalence)</div>
    <div class="env-body">
        <p>The following are equivalent:</p>
        <ol>
            <li>\\(\\psi(x) \\sim x\\) as \\(x \\to \\infty\\) (equivalently, \\(\\pi(x) \\sim x/\\log x\\)).</li>
            <li>\\(\\zeta(1 + it) \\neq 0\\) for all \\(t \\in \\mathbb{R}\\).</li>
        </ol>
    </div>
</div>

<p>The implication \\((2) \\Rightarrow (1)\\) is the direction we will prove in this chapter and the next. The converse \\((1) \\Rightarrow (2)\\) follows from the explicit formula (Chapter 8): a zero at \\(1 + it_0\\) would produce an oscillating term of size \\(x^1\\) in \\(\\psi(x)\\), contradicting \\(\\psi(x) \\sim x\\).</p>

<div class="env-block remark">
    <div class="env-title">Why Not \\(\\operatorname{Re}(s) = 1/2\\)?</div>
    <div class="env-body">
        <p>The Riemann Hypothesis asserts that all non-trivial zeros satisfy \\(\\operatorname{Re}(s) = 1/2\\). If true, the error term in the PNT would shrink to \\(O(\\sqrt{x} \\log^2 x)\\). But even proving that zeros stay <em>slightly</em> away from the line \\(\\operatorname{Re}(s) = 1\\) suffices for the PNT. That is what a zero-free region provides.</p>
    </div>
</div>

<h3>A Map of the Argument</h3>

<p>The logical chain in Chapters 6 and 7 is:</p>
<ol>
    <li><strong>This chapter:</strong> Prove \\(\\zeta(1+it) \\neq 0\\) using the "3-4-1 trick," then extend to a zero-free region \\(\\sigma > 1 - c/\\log t\\).</li>
    <li><strong>Chapter 7:</strong> Use Perron's formula + the zero-free region to prove \\(\\psi(x) = x + O(x e^{-c\\sqrt{\\log x}})\\), which is the PNT with an error term.</li>
</ol>
`,
            visualizations: [],
            exercises: []
        },

        // ================================================================
        // SECTION 2: No Zeros on Re(s) = 1
        // ================================================================
        {
            id: 'sec-no-zeros-line',
            title: 'No Zeros on Re(s) = 1',
            content: `
<h2>No Zeros on \\(\\operatorname{Re}(s) = 1\\): The 3-4-1 Inequality</h2>

<div class="env-block intuition">
    <div class="env-title">The Key Idea</div>
    <div class="env-body">
        <p>The proof that \\(\\zeta(1+it) \\neq 0\\) relies on a single trigonometric identity. It is one of the most elegant "tricks" in all of analytic number theory: the fact that
        \\[3 + 4\\cos\\theta + \\cos 2\\theta \\geq 0\\]
        for all real \\(\\theta\\) is the engine that drives the Prime Number Theorem.</p>
    </div>
</div>

<h3>The Trigonometric Identity</h3>

<div class="env-block theorem">
    <div class="env-title">Lemma 6.2 (The 3-4-1 Inequality)</div>
    <div class="env-body">
        <p>For all \\(\\theta \\in \\mathbb{R}\\),</p>
        \\[3 + 4\\cos\\theta + \\cos 2\\theta \\geq 0.\\]
    </div>
</div>

<div class="env-block proof">
    <div class="env-title">Proof</div>
    <div class="env-body">
        <p>Using the double-angle formula \\(\\cos 2\\theta = 2\\cos^2\\theta - 1\\):</p>
        \\[3 + 4\\cos\\theta + \\cos 2\\theta = 3 + 4\\cos\\theta + 2\\cos^2\\theta - 1 = 2(1 + \\cos\\theta)^2 \\geq 0.\\]
        <p>Equality holds only when \\(\\cos\\theta = -1\\), i.e., \\(\\theta = \\pi + 2k\\pi\\).</p>
    </div>
    <div class="qed">&marker;</div>
</div>

<h3>Applying the Identity to \\(\\zeta\\)</h3>

<p>For \\(\\sigma > 1\\), the Euler product gives:</p>
\\[
\\log|\\zeta(\\sigma + it)| = -\\sum_p \\log|1 - p^{-\\sigma - it}| = \\sum_p \\sum_{k=1}^{\\infty} \\frac{\\cos(kt \\log p)}{k p^{k\\sigma}}.
\\]

<p>Applying the 3-4-1 inequality with \\(\\theta = t \\log p\\) and summing:</p>
\\[
3\\log|\\zeta(\\sigma)| + 4\\log|\\zeta(\\sigma + it)| + \\log|\\zeta(\\sigma + 2it)| \\geq 0.
\\]

<p>In multiplicative form:</p>

<div class="env-block theorem">
    <div class="env-title">Lemma 6.3 (Mertens' Inequality)</div>
    <div class="env-body">
        <p>For \\(\\sigma > 1\\) and \\(t \\in \\mathbb{R}\\),</p>
        \\[|\\zeta(\\sigma)|^3 \\cdot |\\zeta(\\sigma + it)|^4 \\cdot |\\zeta(\\sigma + 2it)| \\geq 1.\\]
    </div>
</div>

<h3>The Proof: \\(\\zeta(1+it) \\neq 0\\)</h3>

<div class="env-block theorem">
    <div class="env-title">Theorem 6.4</div>
    <div class="env-body">
        <p>\\(\\zeta(1 + it) \\neq 0\\) for all \\(t \\neq 0\\).</p>
    </div>
</div>

<div class="env-block proof">
    <div class="env-title">Proof (by contradiction)</div>
    <div class="env-body">
        <p>Suppose \\(\\zeta(1 + it_0) = 0\\) for some \\(t_0 \\neq 0\\). Consider the behavior as \\(\\sigma \\to 1^+\\):</p>
        <ul>
            <li>\\(\\zeta(\\sigma)\\) has a simple pole at \\(\\sigma = 1\\), so \\(|\\zeta(\\sigma)| \\sim C/(\\sigma - 1)\\) for some constant \\(C > 0\\). Thus \\(|\\zeta(\\sigma)|^3 \\sim C^3/(\\sigma-1)^3\\).</li>
            <li>If \\(\\zeta(1+it_0) = 0\\), then \\(|\\zeta(\\sigma + it_0)| = O(\\sigma - 1)\\) as \\(\\sigma \\to 1^+\\) (at least a simple zero). So \\(|\\zeta(\\sigma+it_0)|^4 = O((\\sigma-1)^4)\\).</li>
            <li>\\(|\\zeta(\\sigma + 2it_0)|\\) remains bounded as \\(\\sigma \\to 1^+\\) (\\(\\zeta\\) is analytic at \\(1 + 2it_0\\) since \\(2t_0 \\neq 0\\)).</li>
        </ul>
        <p>Putting these together:</p>
        \\[|\\zeta(\\sigma)|^3 \\cdot |\\zeta(\\sigma+it_0)|^4 \\cdot |\\zeta(\\sigma+2it_0)| = O\\left(\\frac{1}{(\\sigma-1)^3} \\cdot (\\sigma-1)^4 \\cdot 1\\right) = O(\\sigma-1) \\to 0\\]
        <p>as \\(\\sigma \\to 1^+\\). But Mertens' inequality says this product is \\(\\geq 1\\). Contradiction.</p>
    </div>
    <div class="qed">&marker;</div>
</div>

<div class="env-block remark">
    <div class="env-title">The Power of 3-4-1</div>
    <div class="env-body">
        <p>The exponents 3, 4, 1 are not arbitrary. They are the unique positive integers such that \\(3 + 4\\cos\\theta + \\cos 2\\theta \\geq 0\\) and the pole at \\(s = 1\\) (order 1, raised to power 3 giving order 3) is beaten by the zero (order \\(\\geq 1\\), raised to power 4 giving order \\(\\geq 4\\)). The "margin of victory" is \\(4 - 3 = 1\\), which is just barely enough.</p>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-341-trick"></div>
`,
            visualizations: [
                {
                    id: 'viz-341-trick',
                    title: 'The 3-4-1 Trigonometric Inequality',
                    description: 'The function 3 + 4cos(theta) + cos(2theta) = 2(1+cos(theta))^2 is always non-negative. This innocent-looking inequality is the engine behind the PNT. Drag the theta marker to see the value.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 380,
                            originX: 80, originY: 280, scale: 70
                        });

                        var thetaMarker = viz.addDraggable('theta', Math.PI / 3, 0, viz.colors.orange, 8);

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            // Draw axes manually
                            ctx.strokeStyle = viz.colors.axis; ctx.lineWidth = 1.5;
                            ctx.beginPath(); ctx.moveTo(60, 280); ctx.lineTo(540, 280); ctx.stroke();
                            ctx.beginPath(); ctx.moveTo(80, 20); ctx.lineTo(80, 350); ctx.stroke();

                            // X-axis labels
                            ctx.fillStyle = viz.colors.text; ctx.font = '11px -apple-system,sans-serif';
                            ctx.textAlign = 'center'; ctx.textBaseline = 'top';
                            var xLabels = [
                                [0, '0'], [Math.PI/2, '\u03C0/2'], [Math.PI, '\u03C0'],
                                [3*Math.PI/2, '3\u03C0/2'], [2*Math.PI, '2\u03C0']
                            ];
                            for (var i = 0; i < xLabels.length; i++) {
                                var sx = 80 + xLabels[i][0] * 70;
                                ctx.fillText(xLabels[i][1], sx, 284);
                            }

                            // Y-axis labels
                            ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
                            for (var y = 0; y <= 8; y += 2) {
                                var sy = 280 - y * 70 / 2.5;
                                ctx.fillText(y.toString(), 74, sy);
                                if (y > 0) {
                                    ctx.strokeStyle = viz.colors.grid; ctx.lineWidth = 0.5;
                                    ctx.beginPath(); ctx.moveTo(80, sy); ctx.lineTo(540, sy); ctx.stroke();
                                }
                            }

                            // Draw zero line
                            ctx.strokeStyle = viz.colors.red + '44'; ctx.lineWidth = 1;
                            ctx.setLineDash([4, 4]);
                            ctx.beginPath(); ctx.moveTo(80, 280); ctx.lineTo(540, 280); ctx.stroke();
                            ctx.setLineDash([]);

                            // Draw the three components
                            var funcs = [
                                { fn: function(t) { return 3; }, color: viz.colors.text + '66', label: '3' },
                                { fn: function(t) { return 4 * Math.cos(t); }, color: viz.colors.blue + '66', label: '4cos\u03B8' },
                                { fn: function(t) { return Math.cos(2 * t); }, color: viz.colors.teal + '66', label: 'cos 2\u03B8' }
                            ];

                            // Draw individual components lightly
                            for (var f = 0; f < funcs.length; f++) {
                                ctx.strokeStyle = funcs[f].color; ctx.lineWidth = 1;
                                ctx.beginPath();
                                for (var px = 0; px <= 460; px++) {
                                    var theta = px / 460 * 2 * Math.PI;
                                    var val = funcs[f].fn(theta);
                                    var sx2 = 80 + px;
                                    var sy2 = 280 - val * 70 / 2.5;
                                    if (px === 0) ctx.moveTo(sx2, sy2); else ctx.lineTo(sx2, sy2);
                                }
                                ctx.stroke();
                            }

                            // Draw the sum: 3 + 4cos + cos2
                            ctx.strokeStyle = viz.colors.orange; ctx.lineWidth = 3;
                            ctx.beginPath();
                            for (var px2 = 0; px2 <= 460; px2++) {
                                var t2 = px2 / 460 * 2 * Math.PI;
                                var val2 = 3 + 4 * Math.cos(t2) + Math.cos(2 * t2);
                                var sx3 = 80 + px2;
                                var sy3 = 280 - val2 * 70 / 2.5;
                                if (px2 === 0) ctx.moveTo(sx3, sy3); else ctx.lineTo(sx3, sy3);
                            }
                            ctx.stroke();

                            // Fill area under curve
                            ctx.fillStyle = viz.colors.orange + '15';
                            ctx.beginPath();
                            ctx.moveTo(80, 280);
                            for (var px3 = 0; px3 <= 460; px3++) {
                                var t3 = px3 / 460 * 2 * Math.PI;
                                var val3 = 3 + 4 * Math.cos(t3) + Math.cos(2 * t3);
                                ctx.lineTo(80 + px3, 280 - val3 * 70 / 2.5);
                            }
                            ctx.lineTo(540, 280);
                            ctx.closePath(); ctx.fill();

                            // Draggable theta marker
                            var th = thetaMarker.x;
                            if (th < 0) th = 0;
                            if (th > 2 * Math.PI) th = 2 * Math.PI;
                            thetaMarker.x = th;
                            thetaMarker.y = 0;

                            var markerSx = 80 + th * 70;
                            var markerVal = 3 + 4 * Math.cos(th) + Math.cos(2 * th);
                            var markerSy = 280 - markerVal * 70 / 2.5;

                            // Vertical line at theta
                            ctx.strokeStyle = viz.colors.orange + '88'; ctx.lineWidth = 1;
                            ctx.setLineDash([3, 3]);
                            ctx.beginPath(); ctx.moveTo(markerSx, 280); ctx.lineTo(markerSx, markerSy); ctx.stroke();
                            ctx.setLineDash([]);

                            // Marker dot
                            ctx.fillStyle = viz.colors.orange;
                            ctx.beginPath(); ctx.arc(markerSx, markerSy, 6, 0, Math.PI * 2); ctx.fill();

                            // Value display
                            viz.screenText(
                                '\u03B8 = ' + th.toFixed(2) + '    f(\u03B8) = ' + markerVal.toFixed(3),
                                viz.width / 2, 20, viz.colors.white, 14
                            );
                            viz.screenText(
                                '= 2(1 + cos\u03B8)\u00B2 = 2(' + (1 + Math.cos(th)).toFixed(3) + ')\u00B2',
                                viz.width / 2, 40, viz.colors.teal, 12
                            );

                            // Legend
                            viz.screenText('3 + 4cos\u03B8 + cos 2\u03B8', viz.width / 2, 360, viz.colors.orange, 13);
                        }

                        viz.animate(function() { draw(); });
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Prove that \\(3 + 4\\cos\\theta + \\cos 2\\theta \\geq 0\\) by completing the square. At what value(s) of \\(\\theta\\) does equality hold?',
                    hint: 'Use \\(\\cos 2\\theta = 2\\cos^2\\theta - 1\\) and factor the result.',
                    solution: '\\(3 + 4\\cos\\theta + \\cos 2\\theta = 3 + 4\\cos\\theta + 2\\cos^2\\theta - 1 = 2\\cos^2\\theta + 4\\cos\\theta + 2 = 2(\\cos\\theta + 1)^2 \\geq 0\\). Equality when \\(\\cos\\theta = -1\\), i.e. \\(\\theta = (2k+1)\\pi\\).'
                },
                {
                    question: 'Show that if \\(\\zeta(1 + it_0) = 0\\) for some \\(t_0 \\neq 0\\), then the zero has order exactly 1 (i.e., it cannot be a multiple zero).',
                    hint: 'If the zero had order \\(m \\geq 2\\), the exponent 4 in Mertens\' inequality would give \\(|\\zeta(\\sigma+it_0)|^4 = O((\\sigma-1)^{4m})\\), strengthening the contradiction.',
                    solution: 'The proof of Theorem 6.4 shows that even a simple zero (order 1) leads to a contradiction, since \\(|\\zeta(\\sigma)|^3 \\sim C^3/(\\sigma-1)^3\\) while \\(|\\zeta(\\sigma+it_0)|^4 = O((\\sigma-1)^4)\\). A zero of order \\(m \\geq 2\\) would give \\(O((\\sigma-1)^{4m-3})\\) with \\(4m - 3 \\geq 5 > 0\\), an even faster approach to 0. So no zero of any order is possible on \\(\\operatorname{Re}(s) = 1\\).'
                }
            ]
        },

        // ================================================================
        // SECTION 3: The Classical Zero-Free Region
        // ================================================================
        {
            id: 'sec-classical-region',
            title: 'The Classical Zero-Free Region',
            content: `
<h2>The Classical Zero-Free Region</h2>

<div class="env-block intuition">
    <div class="env-title">From a Line to a Region</div>
    <div class="env-body">
        <p>Knowing \\(\\zeta(1+it) \\neq 0\\) proves the PNT, but tells us nothing about the error term. To get a quantitative bound on \\(\\psi(x) - x\\), we need zeros to stay a <em>quantifiable distance</em> from the line \\(\\operatorname{Re}(s) = 1\\). The classical argument of de la Vall&eacute;e-Poussin (1899) shows that all zeros satisfy</p>
        \\[\\sigma < 1 - \\frac{c}{\\log |t|}\\]
        <p>for some absolute constant \\(c > 0\\). This is the <strong>classical zero-free region</strong>.</p>
    </div>
</div>

<h3>Quantifying Mertens' Inequality</h3>

<p>We revisit Mertens' inequality more carefully. For \\(\\sigma > 1\\):</p>
\\[
|\\zeta(\\sigma)|^3 |\\zeta(\\sigma + it)|^4 |\\zeta(\\sigma + 2it)| \\geq 1.
\\]

<p>We need <em>upper bounds</em> on \\(|\\zeta(\\sigma)|\\) near \\(s = 1\\) and \\(|\\zeta(\\sigma + 2it)|\\), and a <em>lower bound</em> on \\(|\\zeta(\\sigma + it)|\\) near a hypothetical zero.</p>

<div class="env-block theorem">
    <div class="env-title">Lemma 6.5 (Growth Estimates)</div>
    <div class="env-body">
        <p>For \\(\\sigma \\geq 1\\) and \\(|t| \\geq 2\\):</p>
        <ol>
            <li>\\(|\\zeta(\\sigma + it)| \\ll |t|^{A}\\) for some constant \\(A > 0\\) (convexity bound).</li>
            <li>\\(\\zeta(\\sigma) \\leq \\frac{1}{\\sigma - 1} + O(1)\\) for \\(\\sigma > 1\\).</li>
            <li>\\(\\frac{\\zeta'}{\\zeta}(\\sigma + it) = \\sum_{|\\gamma - t| < 1} \\frac{1}{\\sigma + it - \\rho} + O(\\log |t|)\\), where the sum is over zeros \\(\\rho = \\beta + i\\gamma\\) near \\(\\sigma + it\\).</li>
        </ol>
    </div>
</div>

<h3>De la Vall&eacute;e-Poussin's Argument</h3>

<p>Suppose \\(\\zeta(\\beta + i\\gamma) = 0\\) with \\(\\beta\\) close to 1 and \\(|\\gamma| \\geq 2\\). Taking \\(\\sigma = 1 + 1/\\log|\\gamma|\\) and applying Mertens' inequality with the growth estimates:</p>

<ul>
    <li>\\(|\\zeta(\\sigma)|^3 \\ll 1/(\\sigma - 1)^3 = (\\log|\\gamma|)^3\\)</li>
    <li>\\(|\\zeta(\\sigma + 2i\\gamma)| \\ll \\log|\\gamma|\\)</li>
    <li>These give an <em>upper bound</em> of \\(O((\\log|\\gamma|)^4)\\) for the product.</li>
</ul>

<p>If \\(\\beta\\) were too close to 1, the factor \\(|\\zeta(\\sigma + i\\gamma)|^4\\) would be too small (since \\(\\sigma + i\\gamma\\) is close to the zero), violating \\(\\geq 1\\). The precise computation yields:</p>

<div class="env-block theorem">
    <div class="env-title">Theorem 6.6 (Classical Zero-Free Region)</div>
    <div class="env-body">
        <p>There exists an absolute constant \\(c > 0\\) such that \\(\\zeta(\\sigma + it) \\neq 0\\) whenever</p>
        \\[\\sigma \\geq 1 - \\frac{c}{\\log(|t| + 2)}.\\]
    </div>
</div>

<p>The shape of this region is a curve that approaches the line \\(\\operatorname{Re}(s) = 1\\) as \\(|t| \\to \\infty\\), but never reaches it. It looks like a narrow "chimney" opening to the right in the critical strip.</p>

<div class="env-block remark">
    <div class="env-title">The Constant \\(c\\)</div>
    <div class="env-body">
        <p>The value of \\(c\\) matters for effective computations. The classical proof gives \\(c\\) in terms of the implicit constants in the growth estimates. Modern values of \\(c\\) have been refined (e.g., Kadiri 2005 showed \\(c \\geq 1/5.70\\) is admissible), but the qualitative shape \\(1 - c/\\log|t|\\) has remained unchanged since 1899.</p>
    </div>
</div>

<h3>Consequence for the PNT Error Term</h3>

<p>The classical zero-free region feeds directly into the PNT with error term (Chapter 7):</p>
\\[
\\psi(x) = x + O\\left(x \\exp(-c_1 \\sqrt{\\log x})\\right)
\\]
<p>for some \\(c_1 > 0\\). The wider the zero-free region, the smaller the error. This is why improving zero-free regions has been a central goal of analytic number theory.</p>

<div class="viz-placeholder" data-viz="viz-contradiction-game"></div>
`,
            visualizations: [
                {
                    id: 'viz-contradiction-game',
                    title: 'The Contradiction Game',
                    description: 'Place a hypothetical zero of zeta at a point sigma + it near Re(s) = 1. Watch the 3-4-1 inequality produce a contradiction. Drag the orange point to move the hypothetical zero.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 400,
                            originX: 280, originY: 200, scale: 200
                        });

                        var zeroPt = viz.addDraggable('zero', 0.92, 0.5, viz.colors.orange, 8);

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            // Critical strip
                            var [sx0] = viz.toScreen(0, 0);
                            var [sx1] = viz.toScreen(1, 0);
                            ctx.fillStyle = viz.colors.purple + '15';
                            ctx.fillRect(sx0, 0, sx1 - sx0, viz.height);

                            viz.drawGrid(0.5);
                            viz.drawAxes();

                            // Re(s) = 1 line
                            var [lineX] = viz.toScreen(1, 0);
                            ctx.strokeStyle = viz.colors.red; ctx.lineWidth = 2;
                            ctx.beginPath(); ctx.moveTo(lineX, 0); ctx.lineTo(lineX, viz.height); ctx.stroke();

                            // Re(s) = 1/2 line (RH line)
                            var [halfX] = viz.toScreen(0.5, 0);
                            ctx.strokeStyle = viz.colors.teal + '44'; ctx.lineWidth = 1;
                            ctx.setLineDash([4, 4]);
                            ctx.beginPath(); ctx.moveTo(halfX, 0); ctx.lineTo(halfX, viz.height); ctx.stroke();
                            ctx.setLineDash([]);

                            // Classical zero-free region boundary
                            var c = 0.05;
                            ctx.strokeStyle = viz.colors.green; ctx.lineWidth = 2;
                            ctx.beginPath();
                            for (var py = 0; py < viz.height; py++) {
                                var im = (viz.originY - py) / viz.scale;
                                var tAbs = Math.abs(im);
                                var boundary = 1 - c / (Math.log(Math.max(tAbs, 2) + 2));
                                var bsx = viz.originX + boundary * viz.scale;
                                if (py === 0) ctx.moveTo(bsx, py); else ctx.lineTo(bsx, py);
                            }
                            ctx.stroke();

                            // Hypothetical zero
                            var sigma = Math.max(0.5, Math.min(0.999, zeroPt.x));
                            var t = zeroPt.y;
                            zeroPt.x = sigma;
                            var sigmaTest = 1 + 0.01;

                            // Compute the three factors (schematically)
                            var poleOrder = 3;
                            var poleFactor = Math.pow(1 / (sigmaTest - 1), poleOrder);
                            var zeroOrder = 4;
                            var distToZero = Math.sqrt((sigmaTest - sigma) * (sigmaTest - sigma) + 0);
                            var zeroFactor = Math.pow(distToZero, zeroOrder);
                            var boundedFactor = 10;
                            var product = poleFactor * zeroFactor * boundedFactor;
                            var ratio = zeroOrder * Math.log10(distToZero) + poleOrder * Math.log10(1 / (sigmaTest - 1));

                            // Draw the zero point
                            viz.drawPoint(sigma, t, viz.colors.orange, null, 8);

                            // Draw the three evaluation points
                            viz.drawPoint(sigmaTest, 0, viz.colors.red, '\u03B6(\u03C3)', 5);
                            viz.drawPoint(sigmaTest, t, viz.colors.blue, '\u03B6(\u03C3+it)', 5);
                            viz.drawPoint(sigmaTest, 2 * t, viz.colors.teal, '\u03B6(\u03C3+2it)', 5);

                            // Lines connecting
                            ctx.strokeStyle = viz.colors.blue + '44'; ctx.lineWidth = 1;
                            var [osx, osy] = viz.toScreen(sigma, t);
                            var [esx, esy] = viz.toScreen(sigmaTest, t);
                            ctx.beginPath(); ctx.moveTo(osx, osy); ctx.lineTo(esx, esy); ctx.stroke();

                            // Contradiction indicator
                            var isContradiction = sigma > 1 - c / Math.log(Math.max(Math.abs(t), 2) + 2);
                            var statusColor = isContradiction ? viz.colors.red : viz.colors.green;
                            var statusText = isContradiction ? 'CONTRADICTION! Zero in zero-free region' : 'OK: Zero outside zero-free region';

                            viz.screenText(statusText, viz.width / 2, 20, statusColor, 13);
                            viz.screenText(
                                'Hypothetical zero at \u03C3 = ' + sigma.toFixed(3) + ', t = ' + t.toFixed(2),
                                viz.width / 2, 380, viz.colors.white, 12
                            );

                            // Labels
                            viz.screenText('Re(s)=1', lineX + 15, 15, viz.colors.red, 10, 'left');
                            viz.screenText('Re(s)=\u00BD', halfX + 5, 15, viz.colors.teal, 10, 'left');

                            viz.drawDraggables();
                        }

                        viz.animate(function() { draw(); });
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Verify that \\(\\sigma = 1 + 1/\\log|\\gamma|\\) is the optimal choice for the test point in de la Vall&eacute;e-Poussin\'s argument. What happens if you choose \\(\\sigma = 1 + 1/|\\gamma|\\) instead?',
                    hint: 'The choice balances the pole contribution \\(1/(\\sigma-1)^3 = (\\log|\\gamma|)^3\\) against the growth bound \\(|\\zeta(\\sigma + 2it)| \\ll \\log|\\gamma|\\).',
                    solution: 'With \\(\\sigma = 1 + 1/\\log|\\gamma|\\), the pole gives \\((\\log|\\gamma|)^3\\) and the bounded term \\(O(\\log|\\gamma|)\\), yielding a total upper bound of \\(O((\\log|\\gamma|)^4)\\). This optimally balances against the zero. With \\(\\sigma = 1 + 1/|\\gamma|\\), the pole gives \\(|\\gamma|^3\\) while the bounded term is \\(O(\\log|\\gamma|)\\), so the product grows polynomially, giving a much weaker zero-free region \\(\\sigma \\geq 1 - c/|t|\\).'
                },
                {
                    question: 'The classical zero-free region is \\(\\sigma > 1 - c/\\log|t|\\). Show that this implies \\(\\pi(x) = \\operatorname{Li}(x) + O(x e^{-c\'\\sqrt{\\log x}})\\) for some constant \\(c\' > 0\\). (You may assume the contour-shifting argument from Chapter 7.)',
                    hint: 'The key step is that the zero-free region ensures the contour can be shifted to \\(\\sigma = 1 - c/\\log T\\) with \\(T \\approx x\\), and the contribution from the shifted contour is \\(O(x e^{-c\\log x / \\log T})\\). Optimize \\(T\\).',
                    solution: 'Shifting the contour to \\(\\sigma = 1 - c/\\log T\\), the integrand contributes \\(O(x^{1-c/\\log T} \\cdot T)\\). With \\(T = e^{\\sqrt{\\log x}}\\), this becomes \\(O(x \\cdot e^{-c\\sqrt{\\log x}} \\cdot e^{\\sqrt{\\log x}}) = O(x e^{-(c-1)\\sqrt{\\log x}})\\). Choosing \\(c\' = c - 1 > 0\\) (for large enough \\(c\\)) gives the result.'
                }
            ]
        },

        // ================================================================
        // SECTION 4: The Vinogradov-Korobov Region
        // ================================================================
        {
            id: 'sec-vinogradov-korobov',
            title: 'The Vinogradov-Korobov Region',
            content: `
<h2>The Vinogradov-Korobov Zero-Free Region</h2>

<div class="env-block intuition">
    <div class="env-title">Beyond the Classical</div>
    <div class="env-body">
        <p>The classical region \\(\\sigma > 1 - c/\\log|t|\\) stood for over half a century as the best known. In 1958, Vinogradov and Korobov independently proved a substantially stronger result, pushing the zero-free boundary further from the line \\(\\operatorname{Re}(s) = 1\\).</p>
    </div>
</div>

<div class="env-block theorem">
    <div class="env-title">Theorem 6.7 (Vinogradov-Korobov Zero-Free Region)</div>
    <div class="env-body">
        <p>There exists an absolute constant \\(c > 0\\) such that \\(\\zeta(\\sigma + it) \\neq 0\\) whenever</p>
        \\[
        \\sigma \\geq 1 - \\frac{c}{(\\log|t|)^{2/3}(\\log\\log|t|)^{1/3}}, \\quad |t| \\geq 3.
        \\]
    </div>
</div>

<p>The key innovation is replacing \\(1/\\log|t|\\) with \\(1/(\\log|t|)^{2/3}(\\log\\log|t|)^{1/3}\\). For large \\(|t|\\), this is significantly wider. For instance:</p>

<div class="env-block example">
    <div class="env-title">Comparison at \\(|t| = 10^{100}\\)</div>
    <div class="env-body">
        <p>At \\(|t| = 10^{100}\\), with \\(\\log|t| \\approx 230\\):</p>
        <ul>
            <li>Classical: \\(c/\\log|t| \\approx c/230\\)</li>
            <li>Vinogradov-Korobov: \\(c/(230)^{2/3}(\\log 230)^{1/3} \\approx c/37 \\cdot 1/1.7 \\approx c/63\\)</li>
        </ul>
        <p>The Vinogradov-Korobov region is about 3.6 times wider.</p>
    </div>
</div>

<h3>The Method: Exponential Sum Estimates</h3>

<p>The proof uses fundamentally different techniques from the 3-4-1 method:</p>
<ol>
    <li><strong>Exponential sums:</strong> Bounds on \\(\\sum_{n \\leq N} n^{-it}\\) via Vinogradov's method of exponential sums (Chapter 14).</li>
    <li><strong>Mean-value estimates:</strong> Bounds on \\(\\int_0^T |\\zeta(\\sigma + it)|^{2k} \\, dt\\) via Vinogradov's mean-value theorem.</li>
    <li><strong>Zero-density estimates:</strong> Bounds on the number of zeros in a rectangle, which indirectly force zeros away from \\(\\operatorname{Re}(s) = 1\\).</li>
</ol>

<p>The full proof is beyond our scope, but we will encounter the exponential sum techniques in Chapter 14.</p>

<div class="env-block remark">
    <div class="env-title">Current State of the Art</div>
    <div class="env-body">
        <p>The Vinogradov-Korobov shape \\((\\log|t|)^{-2/3}(\\log\\log|t|)^{-1/3}\\) has not been improved since 1958, only the constant \\(c\\). This is remarkable: despite enormous progress in many areas of number theory, the <em>exponent</em> 2/3 has resisted all attacks for over 60 years. Any improvement would have profound consequences for prime number estimates.</p>
    </div>
</div>

<h3>Impact on the PNT Error Term</h3>

<p>The Vinogradov-Korobov region improves the PNT error to:</p>
\\[
\\psi(x) = x + O\\left(x \\exp\\left(-c(\\log x)^{3/5}(\\log\\log x)^{-1/5}\\right)\\right).
\\]

<p>This is the best unconditional error term known for the PNT. Under the Riemann Hypothesis, one would get \\(O(\\sqrt{x}\\log^2 x)\\), an astronomically better bound.</p>

<div class="viz-placeholder" data-viz="viz-zero-free-evolution"></div>
`,
            visualizations: [
                {
                    id: 'viz-zero-free-evolution',
                    title: 'Evolution of Zero-Free Regions',
                    description: 'Watch the zero-free region boundary evolve through history: from the qualitative result of 1896 to the Vinogradov-Korobov region of 1958. Use the slider to travel through time.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 400,
                            originX: 0, originY: 0, scale: 1
                        });

                        var era = 0;
                        var eras = [
                            { year: '1896', name: 'Hadamard / de la VP', type: 'qualitative', desc: 'Re(s)=1 only (no quantitative region)' },
                            { year: '1899', name: 'de la Vall\u00e9e-Poussin', type: 'classical', desc: '\u03C3 > 1 - c/log|t|' },
                            { year: '1922', name: 'Littlewood', type: 'classical-improved', desc: 'Better constant c' },
                            { year: '1958', name: 'Vinogradov-Korobov', type: 'VK', desc: '\u03C3 > 1 - c/(log|t|)^{2/3}' },
                            { year: 'RH?', name: 'Riemann Hypothesis', type: 'RH', desc: 'Re(s) = 1/2 (conjectured)' }
                        ];

                        VizEngine.createSlider(controls, 'Era', 0, eras.length - 1, 0, 1, function(v) {
                            era = Math.round(v);
                            draw();
                        });

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var e = eras[era];

                            // Draw critical strip
                            var stripLeft = 100;
                            var stripRight = 400;
                            var stripWidth = stripRight - stripLeft;
                            var halfLine = (stripLeft + stripRight) / 2;
                            var oneLine = stripRight;

                            // Background strip
                            ctx.fillStyle = viz.colors.purple + '10';
                            ctx.fillRect(stripLeft, 30, stripWidth, 320);

                            // Grid lines for sigma = 0, 1/2, 1
                            ctx.strokeStyle = viz.colors.grid; ctx.lineWidth = 0.5;
                            ctx.beginPath(); ctx.moveTo(stripLeft, 30); ctx.lineTo(stripLeft, 350); ctx.stroke();
                            ctx.strokeStyle = viz.colors.teal + '44'; ctx.lineWidth = 1;
                            ctx.setLineDash([4, 4]);
                            ctx.beginPath(); ctx.moveTo(halfLine, 30); ctx.lineTo(halfLine, 350); ctx.stroke();
                            ctx.setLineDash([]);
                            ctx.strokeStyle = viz.colors.red; ctx.lineWidth = 1.5;
                            ctx.beginPath(); ctx.moveTo(oneLine, 30); ctx.lineTo(oneLine, 350); ctx.stroke();

                            // Labels
                            ctx.fillStyle = viz.colors.text; ctx.font = '10px -apple-system,sans-serif';
                            ctx.textAlign = 'center'; ctx.textBaseline = 'top';
                            ctx.fillText('\u03C3=0', stripLeft, 354);
                            ctx.fillText('\u03C3=\u00BD', halfLine, 354);
                            ctx.fillText('\u03C3=1', oneLine, 354);

                            // Draw zero-free region (shaded area to the right of boundary)
                            if (e.type !== 'qualitative') {
                                ctx.fillStyle = viz.colors.green + '20';
                                ctx.strokeStyle = viz.colors.green; ctx.lineWidth = 2.5;
                                ctx.beginPath();

                                var centerY = 190;
                                var tMax = 160;

                                // Draw boundary curve
                                ctx.moveTo(oneLine, centerY - tMax);
                                for (var py = -tMax; py <= tMax; py++) {
                                    var tAbs = Math.abs(py) * 0.5 + 2;
                                    var offset;
                                    if (e.type === 'RH') {
                                        offset = stripWidth / 2;
                                    } else if (e.type === 'VK') {
                                        var logT = Math.log(tAbs + 2);
                                        offset = stripWidth * 0.15 / (Math.pow(logT, 2/3) * Math.pow(Math.log(logT + 1), 1/3));
                                        offset = Math.min(offset, stripWidth * 0.12) * 3;
                                    } else {
                                        var logT2 = Math.log(tAbs + 2);
                                        offset = stripWidth * 0.08 / logT2;
                                        offset = Math.min(offset, stripWidth * 0.06) * 3;
                                        if (e.type === 'classical-improved') offset *= 1.3;
                                    }
                                    var bx = oneLine - offset;
                                    bx = Math.max(bx, stripLeft);
                                    ctx.lineTo(bx, centerY + py);
                                }
                                ctx.lineTo(oneLine, centerY + tMax);
                                ctx.closePath();
                                ctx.fill();

                                // Redraw boundary as solid line
                                ctx.beginPath();
                                for (var py2 = -tMax; py2 <= tMax; py2++) {
                                    var tAbs2 = Math.abs(py2) * 0.5 + 2;
                                    var offset2;
                                    if (e.type === 'RH') {
                                        offset2 = stripWidth / 2;
                                    } else if (e.type === 'VK') {
                                        var logT3 = Math.log(tAbs2 + 2);
                                        offset2 = stripWidth * 0.15 / (Math.pow(logT3, 2/3) * Math.pow(Math.log(logT3 + 1), 1/3));
                                        offset2 = Math.min(offset2, stripWidth * 0.12) * 3;
                                    } else {
                                        var logT4 = Math.log(tAbs2 + 2);
                                        offset2 = stripWidth * 0.08 / logT4;
                                        offset2 = Math.min(offset2, stripWidth * 0.06) * 3;
                                        if (e.type === 'classical-improved') offset2 *= 1.3;
                                    }
                                    var bx2 = oneLine - offset2;
                                    bx2 = Math.max(bx2, stripLeft);
                                    if (py2 === -tMax) ctx.moveTo(bx2, centerY + py2);
                                    else ctx.lineTo(bx2, centerY + py2);
                                }
                                ctx.stroke();
                            }

                            // Draw some known zeros on the critical line
                            var knownZeros = [14.13, 21.02, 25.01, 30.42, 32.94, 37.59, 40.92, 43.33, 48.01, 49.77];
                            var tScale = 3.2;
                            for (var z = 0; z < knownZeros.length; z++) {
                                var zy = 190 - knownZeros[z] * tScale;
                                if (zy < 35 || zy > 345) continue;
                                ctx.fillStyle = viz.colors.yellow;
                                ctx.beginPath(); ctx.arc(halfLine, zy, 3, 0, Math.PI * 2); ctx.fill();
                                // Symmetric zero
                                var zy2 = 190 + knownZeros[z] * tScale;
                                if (zy2 > 35 && zy2 < 345) {
                                    ctx.beginPath(); ctx.arc(halfLine, zy2, 3, 0, Math.PI * 2); ctx.fill();
                                }
                            }

                            // Title and info
                            viz.screenText(e.year + ': ' + e.name, viz.width / 2, 12, viz.colors.white, 15);
                            viz.screenText(e.desc, viz.width / 2, 380, viz.colors.teal, 12);

                            // Im(s) axis label
                            ctx.save();
                            ctx.translate(25, 190);
                            ctx.rotate(-Math.PI / 2);
                            ctx.fillStyle = viz.colors.text; ctx.font = '11px -apple-system,sans-serif';
                            ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                            ctx.fillText('Im(s)', 0, 0);
                            ctx.restore();

                            // Legend
                            ctx.fillStyle = viz.colors.yellow;
                            ctx.beginPath(); ctx.arc(460, 50, 3, 0, Math.PI * 2); ctx.fill();
                            ctx.fillStyle = viz.colors.text; ctx.font = '10px -apple-system,sans-serif';
                            ctx.textAlign = 'left'; ctx.fillText('Known zeros', 468, 53);

                            ctx.fillStyle = viz.colors.green + '40';
                            ctx.fillRect(455, 65, 12, 12);
                            ctx.fillStyle = viz.colors.text; ctx.fillText('Zero-free', 472, 75);
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Why does the Vinogradov-Korobov method require exponential sum estimates rather than the 3-4-1 trick? What is the fundamental limitation of the 3-4-1 approach?',
                    hint: 'The 3-4-1 trick uses \\(\\zeta(\\sigma)\\) at \\(\\sigma \\to 1^+\\), which has a pole. This pole limits how close to \\(\\operatorname{Re}(s) = 1\\) we can push the zero-free region.',
                    solution: 'The 3-4-1 trick is inherently limited by the pole of \\(\\zeta(s)\\) at \\(s = 1\\). The argument compares the order of the pole (power 3) against the order of a hypothetical zero (power 4). The margin of 1 constrains the zero-free region to \\(c/\\log|t|\\) because the growth estimates for \\(\\zeta\\) near the line \\(\\operatorname{Re}(s) = 1\\) are at best \\(O(\\log|t|)\\). The VK method bypasses this by using exponential sums to directly bound \\(\\zeta(s)\\) in the critical strip, achieving subconvexity estimates that give a wider region.'
                }
            ]
        },

        // ================================================================
        // SECTION 5: The Zero Landscape
        // ================================================================
        {
            id: 'sec-zero-landscape',
            title: 'The Zero Landscape',
            content: `
<h2>The Zero Landscape</h2>

<div class="env-block intuition">
    <div class="env-title">A Census of Zeros</div>
    <div class="env-body">
        <p>We have established that \\(\\zeta(s)\\) has no zeros near the line \\(\\operatorname{Re}(s) = 1\\). But what about the rest of the critical strip? How many zeros are there, and where do they cluster? These questions lead to some of the deepest results in number theory.</p>
    </div>
</div>

<h3>Trivial and Non-Trivial Zeros</h3>

<p>The zeros of \\(\\zeta(s)\\) come in two families:</p>
<ul>
    <li><strong>Trivial zeros:</strong> \\(s = -2, -4, -6, \\ldots\\) (the negative even integers). These arise from the \\(\\Gamma\\) factor in the functional equation and are well understood.</li>
    <li><strong>Non-trivial zeros:</strong> \\(\\rho = \\beta + i\\gamma\\) with \\(0 < \\beta < 1\\). These are the zeros that control prime distribution.</li>
</ul>

<h3>Symmetries</h3>

<p>The non-trivial zeros enjoy two symmetries:</p>
<ol>
    <li><strong>Conjugate symmetry:</strong> If \\(\\rho\\) is a zero, so is \\(\\bar{\\rho}\\) (since \\(\\zeta(\\bar{s}) = \\overline{\\zeta(s)}\\) for real coefficients).</li>
    <li><strong>Functional equation symmetry:</strong> If \\(\\rho\\) is a zero, so is \\(1 - \\rho\\) (from \\(\\zeta(s) = \\chi(s)\\zeta(1-s)\\)).</li>
</ol>

<p>Together, the zeros come in quadruples: \\(\\rho, \\bar{\\rho}, 1-\\rho, 1-\\bar{\\rho}\\) (or pairs if \\(\\rho\\) is on the critical line \\(\\operatorname{Re}(s) = 1/2\\)).</p>

<h3>Counting Zeros: The Riemann-von Mangoldt Formula</h3>

<div class="env-block theorem">
    <div class="env-title">Theorem 6.8 (Riemann-von Mangoldt Formula)</div>
    <div class="env-body">
        <p>Let \\(N(T)\\) denote the number of non-trivial zeros \\(\\rho = \\beta + i\\gamma\\) of \\(\\zeta(s)\\) with \\(0 < \\gamma \\leq T\\). Then</p>
        \\[
        N(T) = \\frac{T}{2\\pi} \\log \\frac{T}{2\\pi e} + O(\\log T).
        \\]
    </div>
</div>

<p>This remarkable formula tells us:</p>
<ul>
    <li>Zeros grow roughly as \\((T \\log T)/(2\\pi)\\).</li>
    <li>The average spacing between consecutive zeros near height \\(T\\) is \\(\\sim 2\\pi/\\log T\\), which shrinks logarithmically.</li>
    <li>By \\(T = 100\\), there are about \\(N(100) \\approx 29\\) zeros. By \\(T = 10^6\\), about \\(N(10^6) \\approx 10^6\\).</li>
</ul>

<div class="env-block proof">
    <div class="env-title">Sketch of Proof</div>
    <div class="env-body">
        <p>The argument counting formula relates \\(N(T)\\) to a contour integral of \\(\\zeta'/\\zeta\\) around the rectangle \\([0, 1] \\times [0, T]\\). The main contribution comes from the \\(\\Gamma\\) factor in the functional equation (via Stirling's approximation), giving the \\((T/2\\pi)\\log(T/2\\pi e)\\) term. The \\(O(\\log T)\\) error comes from bounding \\(\\arg \\zeta(1/2 + iT)\\).</p>
    </div>
</div>

<h3>The Riemann Hypothesis</h3>

<div class="env-block theorem">
    <div class="env-title">Conjecture (Riemann Hypothesis, 1859)</div>
    <div class="env-body">
        <p>All non-trivial zeros of \\(\\zeta(s)\\) satisfy \\(\\operatorname{Re}(s) = 1/2\\).</p>
    </div>
</div>

<p>The first few non-trivial zeros (those with smallest positive imaginary part) are:</p>
\\[
\\rho_1 = \\tfrac{1}{2} + 14.1347\\ldots i, \\quad
\\rho_2 = \\tfrac{1}{2} + 21.0220\\ldots i, \\quad
\\rho_3 = \\tfrac{1}{2} + 25.0109\\ldots i, \\quad \\ldots
\\]

<p>More than \\(10^{13}\\) zeros have been computed, and all lie on the critical line. The Riemann Hypothesis remains one of the seven Clay Millennium Prize problems.</p>

<div class="env-block remark">
    <div class="env-title">What RH Would Give Us</div>
    <div class="env-body">
        <p>If RH is true, the zero-free region extends to \\(\\operatorname{Re}(s) > 1/2\\), the PNT error term becomes \\(O(\\sqrt{x}\\log^2 x)\\), and many conditional results in number theory become unconditional. The Hardy-Littlewood conjectures, the distribution of primes in short intervals, and the behavior of \\(L\\)-functions would all be settled or dramatically clarified.</p>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-zero-count"></div>
`,
            visualizations: [
                {
                    id: 'viz-zero-count',
                    title: 'N(T): Counting Zeros',
                    description: 'The staircase function N(T) counts non-trivial zeros with imaginary part up to T. The smooth curve is the Riemann-von Mangoldt asymptotic. Each step corresponds to a zero on the critical line.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 400,
                            originX: 70, originY: 360, scale: 1
                        });

                        var TMax = 60;
                        VizEngine.createSlider(controls, 'T max', 30, 100, TMax, 5, function(v) {
                            TMax = Math.round(v);
                            draw();
                        });

                        // Known zeros (imaginary parts)
                        var zeros = [
                            14.1347, 21.0220, 25.0109, 30.4249, 32.9351,
                            37.5862, 40.9187, 43.3271, 48.0052, 49.7738,
                            52.9703, 56.4462, 59.3470, 60.8318, 65.1125,
                            67.0798, 69.5464, 72.0672, 75.7047, 77.1448,
                            79.3374, 82.9104, 84.7355, 87.4253, 88.8091,
                            92.4919, 94.6514, 95.8706, 98.8312, 101.318
                        ];

                        function smoothN(T) {
                            if (T <= 0) return 0;
                            return (T / (2 * Math.PI)) * Math.log(T / (2 * Math.PI * Math.E));
                        }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            var plotW = 460;
                            var plotH = 310;
                            var plotL = 80;
                            var plotB = 350;
                            var plotT = 40;

                            // Axes
                            ctx.strokeStyle = viz.colors.axis; ctx.lineWidth = 1.5;
                            ctx.beginPath(); ctx.moveTo(plotL, plotB); ctx.lineTo(plotL + plotW, plotB); ctx.stroke();
                            ctx.beginPath(); ctx.moveTo(plotL, plotB); ctx.lineTo(plotL, plotT); ctx.stroke();

                            // Determine y-scale
                            var nMax = 0;
                            for (var z = 0; z < zeros.length; z++) {
                                if (zeros[z] <= TMax) nMax = z + 1;
                            }
                            nMax = Math.max(nMax, Math.ceil(smoothN(TMax)));
                            var yScale = plotH / (nMax + 2);
                            var xScale = plotW / TMax;

                            // X-axis labels
                            ctx.fillStyle = viz.colors.text; ctx.font = '10px -apple-system,sans-serif';
                            ctx.textAlign = 'center'; ctx.textBaseline = 'top';
                            var xStep = TMax <= 50 ? 10 : 20;
                            for (var x = 0; x <= TMax; x += xStep) {
                                var sx = plotL + x * xScale;
                                ctx.fillText(x.toString(), sx, plotB + 5);
                                ctx.strokeStyle = viz.colors.grid; ctx.lineWidth = 0.5;
                                ctx.beginPath(); ctx.moveTo(sx, plotB); ctx.lineTo(sx, plotT); ctx.stroke();
                            }

                            // Y-axis labels
                            ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
                            var yStep = nMax <= 10 ? 1 : (nMax <= 20 ? 2 : 5);
                            for (var y = 0; y <= nMax; y += yStep) {
                                var sy = plotB - y * yScale;
                                ctx.fillStyle = viz.colors.text;
                                ctx.fillText(y.toString(), plotL - 8, sy);
                                ctx.strokeStyle = viz.colors.grid; ctx.lineWidth = 0.5;
                                ctx.beginPath(); ctx.moveTo(plotL, sy); ctx.lineTo(plotL + plotW, sy); ctx.stroke();
                            }

                            // Draw smooth approximation
                            ctx.strokeStyle = viz.colors.teal; ctx.lineWidth = 2;
                            ctx.beginPath();
                            var started = false;
                            for (var px = 0; px <= plotW; px++) {
                                var tt = px / plotW * TMax;
                                var nSmooth = smoothN(tt);
                                if (nSmooth < 0) continue;
                                var sy2 = plotB - nSmooth * yScale;
                                if (!started) { ctx.moveTo(plotL + px, sy2); started = true; }
                                else ctx.lineTo(plotL + px, sy2);
                            }
                            ctx.stroke();

                            // Draw staircase N(T)
                            ctx.strokeStyle = viz.colors.orange; ctx.lineWidth = 2.5;
                            ctx.beginPath();
                            ctx.moveTo(plotL, plotB);
                            var count = 0;
                            for (var z2 = 0; z2 < zeros.length; z2++) {
                                if (zeros[z2] > TMax) break;
                                var zx = plotL + zeros[z2] * xScale;
                                var zy1 = plotB - count * yScale;
                                ctx.lineTo(zx, zy1);
                                count++;
                                var zy2b = plotB - count * yScale;
                                ctx.lineTo(zx, zy2b);

                                // Mark the zero
                                ctx.fillStyle = viz.colors.yellow;
                                ctx.save();
                                ctx.beginPath(); ctx.arc(zx, zy2b, 3, 0, Math.PI * 2); ctx.fill();
                                ctx.restore();
                            }
                            // Extend to TMax
                            ctx.lineTo(plotL + TMax * xScale, plotB - count * yScale);
                            ctx.stroke();

                            // Title
                            viz.screenText('N(T) vs T/(2\u03C0) log(T/(2\u03C0e))', viz.width / 2, 15, viz.colors.white, 14);

                            // Legend
                            ctx.strokeStyle = viz.colors.orange; ctx.lineWidth = 2.5;
                            ctx.beginPath(); ctx.moveTo(plotL + plotW - 160, 30); ctx.lineTo(plotL + plotW - 140, 30); ctx.stroke();
                            ctx.fillStyle = viz.colors.text; ctx.font = '11px -apple-system,sans-serif'; ctx.textAlign = 'left';
                            ctx.fillText('N(T) exact', plotL + plotW - 135, 33);

                            ctx.strokeStyle = viz.colors.teal; ctx.lineWidth = 2;
                            ctx.beginPath(); ctx.moveTo(plotL + plotW - 160, 50); ctx.lineTo(plotL + plotW - 140, 50); ctx.stroke();
                            ctx.fillStyle = viz.colors.text;
                            ctx.fillText('Asymptotic', plotL + plotW - 135, 53);

                            // Axis labels
                            viz.screenText('T', plotL + plotW / 2, plotB + 22, viz.colors.text, 12);
                            ctx.save();
                            ctx.translate(20, plotT + plotH / 2);
                            ctx.rotate(-Math.PI / 2);
                            ctx.fillStyle = viz.colors.text; ctx.font = '12px -apple-system,sans-serif';
                            ctx.textAlign = 'center'; ctx.fillText('N(T)', 0, 0);
                            ctx.restore();
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Use the Riemann-von Mangoldt formula to estimate \\(N(100)\\), \\(N(1000)\\), and \\(N(10^6)\\). Compare with the known exact values: \\(N(100) = 29\\), \\(N(1000) = 649\\).',
                    hint: 'Plug into \\(N(T) \\approx (T/2\\pi)\\log(T/2\\pi e)\\). Recall that \\(2\\pi e \\approx 17.08\\).',
                    solution: '\\(N(100) \\approx (100/6.28)\\log(100/17.08) \\approx 15.92 \\times 1.766 \\approx 28.1\\). Exact: 29. \\(N(1000) \\approx (1000/6.28)\\log(1000/17.08) \\approx 159.2 \\times 4.07 \\approx 648\\). Exact: 649. \\(N(10^6) \\approx (10^6/6.28)\\log(10^6/17.08) \\approx 159{,}236 \\times 10.98 \\approx 1{,}748{,}432\\).'
                },
                {
                    question: 'The average gap between consecutive zeros near height \\(T\\) is \\(\\delta(T) \\sim 2\\pi/\\log T\\). Compute \\(\\delta(T)\\) for \\(T = 14, 50, 1000\\). Compare with the actual gaps between the first few zeros.',
                    hint: 'The first few zeros are at \\(14.13, 21.02, 25.01, 30.42, 32.94\\). Compute the gaps and compare with \\(2\\pi/\\log T\\).',
                    solution: 'Average gap prediction: \\(\\delta(14) \\approx 2\\pi/2.64 \\approx 2.38\\), \\(\\delta(50) \\approx 2\\pi/3.91 \\approx 1.61\\), \\(\\delta(1000) \\approx 2\\pi/6.91 \\approx 0.91\\). Actual gaps between first zeros: \\(21.02 - 14.13 = 6.89\\), \\(25.01 - 21.02 = 3.99\\), \\(30.42 - 25.01 = 5.41\\), \\(32.94 - 30.42 = 2.52\\). The early zeros have larger gaps than average because the density increases with \\(T\\).'
                }
            ]
        },

        // ================================================================
        // SECTION 6: Bridge — Armed for PNT
        // ================================================================
        {
            id: 'sec-bridge',
            title: 'Armed for PNT',
            content: `
<h2>Armed for the Prime Number Theorem</h2>

<h3>What We Have Achieved</h3>

<p>This chapter established the critical ingredients for proving the Prime Number Theorem:</p>

<ol>
    <li><strong>The 3-4-1 inequality</strong> (Lemma 6.2): the trigonometric identity \\(3 + 4\\cos\\theta + \\cos 2\\theta = 2(1+\\cos\\theta)^2 \\geq 0\\).</li>
    <li><strong>Mertens' inequality</strong> (Lemma 6.3): \\(|\\zeta(\\sigma)|^3|\\zeta(\\sigma+it)|^4|\\zeta(\\sigma+2it)| \\geq 1\\) for \\(\\sigma > 1\\).</li>
    <li><strong>No zeros on \\(\\operatorname{Re}(s) = 1\\)</strong> (Theorem 6.4): a pole-zero competition argument.</li>
    <li><strong>The classical zero-free region</strong> (Theorem 6.6): \\(\\sigma > 1 - c/\\log|t|\\).</li>
    <li><strong>The Riemann-von Mangoldt formula</strong> (Theorem 6.8): \\(N(T) \\sim (T/2\\pi)\\log(T/2\\pi e)\\).</li>
</ol>

<h3>The Road to PNT</h3>

<p>In Chapter 7, we will use these tools in the following sequence:</p>

<div class="env-block theorem">
    <div class="env-title">Strategy for Proving the PNT</div>
    <div class="env-body">
        <ol>
            <li>Write \\(\\psi(x)\\) as a contour integral of \\(-\\zeta'/\\zeta \\cdot x^s/s\\) via Perron's formula.</li>
            <li>Shift the contour to the left of \\(\\operatorname{Re}(s) = 1\\), picking up the residue at \\(s = 1\\) (which gives the main term \\(x\\)).</li>
            <li>Use the zero-free region to bound the shifted contour: the integrand is small because \\(|x^s| = x^\\sigma\\) with \\(\\sigma < 1\\), and \\(\\zeta'/\\zeta\\) has no poles in the zero-free region.</li>
            <li>Conclude \\(\\psi(x) = x + O(x e^{-c\\sqrt{\\log x}})\\).</li>
        </ol>
    </div>
</div>

<p>The zero-free region is the <em>bottleneck</em> of the argument. A wider region gives a smaller error term. This is why the Vinogradov-Korobov region, despite being a "mere" improvement of the exponent from 1 to 2/3, improves the PNT error from \\(O(e^{-c\\sqrt{\\log x}})\\) to \\(O(e^{-c(\\log x)^{3/5}(\\log\\log x)^{-1/5}})\\).</p>

<div class="env-block remark">
    <div class="env-title">Looking Forward</div>
    <div class="env-body">
        <p>The zero-free region will appear again in Chapter 10 (for Dirichlet \\(L\\)-functions, proving primes in arithmetic progressions), Chapter 16 (where we study zeros of general \\(L\\)-functions), and Chapter 18 (primes in short intervals, where the quality of the zero-free region directly controls the interval length).</p>
    </div>
</div>

<h3>Key Formulas Summary</h3>

<table>
    <tr><th>Result</th><th>Formula</th><th>Consequence</th></tr>
    <tr><td>3-4-1 inequality</td><td>\\(3 + 4\\cos\\theta + \\cos 2\\theta \\geq 0\\)</td><td>Mertens' inequality</td></tr>
    <tr><td>No zeros on Re=1</td><td>\\(\\zeta(1+it) \\neq 0\\)</td><td>PNT: \\(\\pi(x) \\sim x/\\log x\\)</td></tr>
    <tr><td>Classical ZFR</td><td>\\(\\sigma > 1 - c/\\log|t|\\)</td><td>\\(\\psi(x) = x + O(xe^{-c\\sqrt{\\log x}})\\)</td></tr>
    <tr><td>VK ZFR</td><td>\\(\\sigma > 1 - c(\\log|t|)^{-2/3}\\cdots\\)</td><td>\\(\\psi(x) = x + O(xe^{-c(\\log x)^{3/5}\\cdots})\\)</td></tr>
    <tr><td>Riemann-von Mangoldt</td><td>\\(N(T) \\sim \\frac{T}{2\\pi}\\log\\frac{T}{2\\pi e}\\)</td><td>Zero density grows as \\(T\\log T\\)</td></tr>
</table>
`,
            visualizations: [],
            exercises: [
                {
                    question: 'The "margin" in the 3-4-1 trick is that the pole contributes order 3 while the zero contributes order \\(\\geq 4\\). Could we use \\(2 + 3\\cos\\theta + \\cos 2\\theta\\) instead? Check whether this expression is non-negative.',
                    hint: 'Compute \\(2 + 3\\cos\\theta + \\cos 2\\theta\\) and see if it factors as a perfect square.',
                    solution: '\\(2 + 3\\cos\\theta + \\cos 2\\theta = 2 + 3\\cos\\theta + 2\\cos^2\\theta - 1 = 2\\cos^2\\theta + 3\\cos\\theta + 1 = (2\\cos\\theta + 1)(\\cos\\theta + 1)\\). At \\(\\theta = 2\\pi/3\\), \\(\\cos\\theta = -1/2\\), so the first factor is 0 and the expression equals 0. At \\(\\theta\\) slightly beyond \\(2\\pi/3\\), \\((2\\cos\\theta + 1) < 0\\) while \\((\\cos\\theta + 1) > 0\\), so the product is <em>negative</em>. The expression is NOT always non-negative, so it cannot replace the 3-4-1 inequality.'
                }
            ]
        }
    ]
});
