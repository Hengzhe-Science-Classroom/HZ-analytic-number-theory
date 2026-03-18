window.CHAPTERS = window.CHAPTERS || [];
window.CHAPTERS.push({
    id: 'ch21',
    number: 21,
    title: 'Open Problems & the Road Ahead',
    subtitle: 'The unfinished symphony',
    sections: [

        // ================================================================
        // SECTION 1: What We Know, What We Dream
        // ================================================================
        {
            id: 'sec-motivation',
            title: 'What We Know, What We Dream',
            content: `
<h2>What We Know, What We Dream</h2>

<div class="env-block intuition">
    <div class="env-title">The End Is a Beginning</div>
    <div class="env-body">
        <p>You have now traveled through 21 chapters: from arithmetic functions and Dirichlet series, through the Prime Number Theorem and its explicit formula, past sieves and exponential sums and automorphic forms, to the recent breakthroughs on bounded prime gaps. You have seen the central spine of analytic number theory.</p>
        <p>And yet, the deepest questions remain unanswered. This final chapter is not a summary. It is a door.</p>
    </div>
</div>

<p>Analytic number theory sits at an unusual intersection. Its questions are often elementary to <em>state</em> — "Are there infinitely many twin primes?" — but fiendishly difficult to answer. The tools required to make progress span complex analysis, spectral theory, algebraic geometry, and representation theory. The subject rewards both the specialist who masters one powerful technique and the generalist who sees connections across the whole.</p>

<h3>The Landscape of Knowledge</h3>

<p>Let us orient ourselves. What do we know?</p>
<ul>
  <li><strong>The Prime Number Theorem</strong> (Hadamard, de la Vallee Poussin, 1896): \\(\\pi(x) \\sim x/\\log x\\).</li>
  <li><strong>Dirichlet's Theorem</strong> (1837): primes are equidistributed in arithmetic progressions.</li>
  <li><strong>Bombieri-Vinogradov</strong> (1965): GRH on average for primes in progressions.</li>
  <li><strong>Zhang-Maynard-Tao</strong> (2013--2014): bounded gaps between primes; infinitely many pairs \\((p, p')\\) with \\(p' - p \\le 246\\).</li>
  <li><strong>Helfgott</strong> (2013): every odd integer \\(\\ge 7\\) is the sum of three primes (weak Goldbach, fully verified).</li>
  <li><strong>Matom\u00e4ki-Radziwi\u0142\u0142</strong> (2015): the Liouville function has equal proportion of \\(+1\\) and \\(-1\\) on almost all short intervals.</li>
</ul>

<p>What do we dream?</p>
<ul>
  <li>The Riemann Hypothesis: all nontrivial zeros lie on \\(\\Re(s) = 1/2\\).</li>
  <li>Twin Prime Conjecture: infinitely many primes \\(p\\) with \\(p + 2\\) also prime.</li>
  <li>Goldbach's Conjecture (strong form): every even integer \\(\\ge 4\\) is a sum of two primes.</li>
  <li>The Langlands Program: a grand unification of number theory, representation theory, and geometry.</li>
</ul>

<div class="env-block remark">
    <div class="env-title">A Guiding Principle</div>
    <div class="env-body">
        <p>In analytic number theory, the gap between what is known and what is believed is often enormous. We conjecture with precision (exact constants, power-saving error terms), yet proofs lag decades or centuries behind. The subject is simultaneously one of the most successful and one of the most humbling in all of mathematics.</p>
    </div>
</div>

<p>The visualizations in this chapter give you an interactive map: the web of conjectures and their dependencies, the timeline of breakthroughs, and the capstone picture of zeta zeros behaving like eigenvalues of a random matrix. By the end, you will see not only where the subject stands but why the open problems have such depth.</p>
`,
            visualizations: [
                {
                    id: 'viz-conjecture-web',
                    title: 'The Web of Conjectures',
                    description: 'Interactive graph of major conjectures and their logical implications. Click a node to highlight its consequences. Drag nodes to rearrange the web.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, { width: 680, height: 440 });
                        var ctx = viz.ctx;
                        var W = viz.width, H = viz.height;

                        // Nodes: id, label, x, y, color, tier
                        var nodes = [
                            { id: 'RH',      label: 'Riemann\nHypothesis',     x: W/2,        y: 60,  color: '#f85149', tier: 0 },
                            { id: 'GRH',     label: 'Generalized\nRH',          x: W/2 + 160,  y: 130, color: '#f0883e', tier: 1 },
                            { id: 'PNT',     label: 'Prime\nNumber Thm',        x: W/2 - 160,  y: 130, color: '#3fb950', tier: 1, proven: true },
                            { id: 'GRC',     label: 'Goldbach\nConjecture',      x: 120,        y: 240, color: '#58a6ff', tier: 2 },
                            { id: 'TPC',     label: 'Twin Prime\nConj.',         x: 280,        y: 240, color: '#58a6ff', tier: 2 },
                            { id: 'Lang',    label: 'Langlands\nProgram',        x: W/2 + 20,   y: 250, color: '#bc8cff', tier: 2 },
                            { id: 'ABC',     label: 'abc\nConjecture',           x: W - 150,    y: 200, color: '#f778ba', tier: 2 },
                            { id: 'BSD',     label: 'Birch &\nSwinnerton-Dyer',  x: W - 120,    y: 310, color: '#d29922', tier: 3 },
                            { id: 'BV',      label: 'Bombieri-\nVinogradov',     x: 140,        y: 350, color: '#3fb9a0', tier: 3, proven: true },
                            { id: 'Zhang',   label: 'Bounded\nGaps (Zhang)',     x: 320,        y: 370, color: '#3fb950', tier: 3, proven: true },
                            { id: 'Weak3',   label: 'Weak\nGoldbach (Proved)',   x: 530,        y: 380, color: '#3fb950', tier: 3, proven: true },
                        ];

                        // Edges: [from, to]
                        var edges = [
                            ['RH', 'PNT'],
                            ['RH', 'GRH'],
                            ['GRH', 'TPC'],
                            ['GRH', 'Lang'],
                            ['RH', 'BV'],
                            ['GRH', 'Weak3'],
                            ['ABC', 'GRC'],
                            ['Lang', 'BSD'],
                            ['TPC', 'Zhang'],
                            ['BV', 'Zhang'],
                        ];

                        // Draggable state
                        var dragging = null;
                        var hovering = null;
                        var selected = null;

                        var nodeR = 28;

                        function nodeAt(mx, my) {
                            for (var i = 0; i < nodes.length; i++) {
                                var n = nodes[i];
                                var dx = mx - n.x, dy = my - n.y;
                                if (dx*dx + dy*dy < nodeR*nodeR) return n;
                            }
                            return null;
                        }

                        function isHighlighted(n) {
                            if (!selected) return false;
                            if (n.id === selected.id) return true;
                            for (var i = 0; i < edges.length; i++) {
                                var e = edges[i];
                                if (e[0] === selected.id && e[1] === n.id) return true;
                                if (e[1] === selected.id && e[0] === n.id) return true;
                            }
                            return false;
                        }

                        function draw() {
                            ctx.fillStyle = viz.colors.bg;
                            ctx.fillRect(0, 0, W, H);

                            // Title
                            ctx.fillStyle = viz.colors.white;
                            ctx.font = 'bold 14px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText('Web of Open Problems & Implications', W/2, 26);

                            // Edges
                            for (var i = 0; i < edges.length; i++) {
                                var e = edges[i];
                                var a = nodes.find(function(n) { return n.id === e[0]; });
                                var b = nodes.find(function(n) { return n.id === e[1]; });
                                if (!a || !b) continue;
                                var highlight = selected && (e[0] === selected.id || e[1] === selected.id);
                                ctx.strokeStyle = highlight ? selected.color : '#2a2a5a';
                                ctx.lineWidth = highlight ? 2.5 : 1;
                                ctx.beginPath();
                                ctx.moveTo(a.x, a.y);
                                ctx.lineTo(b.x, b.y);
                                ctx.stroke();
                                // Arrow
                                var dx = b.x - a.x, dy = b.y - a.y;
                                var len = Math.sqrt(dx*dx + dy*dy);
                                if (len < 1) continue;
                                var ux = dx/len, uy = dy/len;
                                var tx = b.x - ux*nodeR, ty = b.y - uy*nodeR;
                                ctx.fillStyle = highlight ? selected.color : '#3a3a6a';
                                ctx.beginPath();
                                ctx.moveTo(tx, ty);
                                ctx.lineTo(tx - 10*ux + 5*uy, ty - 10*uy - 5*ux);
                                ctx.lineTo(tx - 10*ux - 5*uy, ty - 10*uy + 5*ux);
                                ctx.closePath();
                                ctx.fill();
                            }

                            // Nodes
                            for (var j = 0; j < nodes.length; j++) {
                                var nd = nodes[j];
                                var hi = isHighlighted(nd);
                                var isSelected = selected && nd.id === selected.id;
                                var alpha = selected && !hi ? '44' : 'ff';

                                // Glow for selected
                                if (isSelected) {
                                    ctx.shadowColor = nd.color;
                                    ctx.shadowBlur = 18;
                                }
                                ctx.fillStyle = (hi ? nd.color : nd.color) + (selected && !hi ? '44' : '22');
                                ctx.beginPath();
                                ctx.arc(nd.x, nd.y, nodeR, 0, Math.PI*2);
                                ctx.fill();
                                ctx.shadowBlur = 0;

                                ctx.strokeStyle = nd.color + (selected && !hi ? '44' : 'ff');
                                ctx.lineWidth = isSelected ? 3 : (nd.proven ? 2 : 1.5);
                                if (nd.proven) ctx.setLineDash([]);
                                else ctx.setLineDash([4, 3]);
                                ctx.beginPath();
                                ctx.arc(nd.x, nd.y, nodeR, 0, Math.PI*2);
                                ctx.stroke();
                                ctx.setLineDash([]);

                                // Label (split at \n)
                                var lines = nd.label.split('\n');
                                ctx.fillStyle = nd.color + (selected && !hi ? '55' : 'ff');
                                ctx.font = 'bold 9.5px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.textBaseline = 'middle';
                                var lineH = 11;
                                var startY = nd.y - (lines.length - 1) * lineH / 2;
                                for (var k = 0; k < lines.length; k++) {
                                    ctx.fillText(lines[k], nd.x, startY + k * lineH);
                                }

                                // Proved badge
                                if (nd.proven) {
                                    ctx.font = '8px -apple-system,sans-serif';
                                    ctx.fillStyle = '#3fb95099';
                                    ctx.fillText('PROVED', nd.x, nd.y + nodeR + 10);
                                }
                            }

                            // Legend
                            ctx.font = '11px -apple-system,sans-serif';
                            ctx.textAlign = 'left';
                            ctx.textBaseline = 'middle';
                            ctx.fillStyle = viz.colors.text;
                            ctx.fillText('Click a node to see connections', 10, H - 20);

                            // Solid vs dashed legend
                            ctx.strokeStyle = '#8b949e';
                            ctx.lineWidth = 2;
                            ctx.setLineDash([]);
                            ctx.beginPath(); ctx.moveTo(W - 200, H - 28); ctx.lineTo(W - 180, H - 28); ctx.stroke();
                            ctx.fillStyle = viz.colors.text;
                            ctx.fillText('Proved', W - 176, H - 28);
                            ctx.setLineDash([4,3]);
                            ctx.beginPath(); ctx.moveTo(W - 200, H - 12); ctx.lineTo(W - 180, H - 12); ctx.stroke();
                            ctx.setLineDash([]);
                            ctx.fillText('Open conjecture', W - 176, H - 12);
                        }

                        draw();

                        viz.canvas.addEventListener('mousedown', function(e) {
                            var r = viz.canvas.getBoundingClientRect();
                            var mx = e.clientX - r.left, my = e.clientY - r.top;
                            var n = nodeAt(mx, my);
                            if (n) { dragging = n; selected = n; }
                            else { selected = null; dragging = null; }
                            draw();
                        });
                        viz.canvas.addEventListener('mousemove', function(e) {
                            var r = viz.canvas.getBoundingClientRect();
                            var mx = e.clientX - r.left, my = e.clientY - r.top;
                            if (dragging) {
                                dragging.x = mx; dragging.y = my;
                                draw();
                            } else {
                                var h = nodeAt(mx, my);
                                viz.canvas.style.cursor = h ? 'pointer' : 'default';
                            }
                        });
                        viz.canvas.addEventListener('mouseup', function() { dragging = null; });
                        viz.canvas.addEventListener('mouseleave', function() { dragging = null; });

                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Which open problem do you find most compelling, and why? Consider: clarity of statement, depth of expected tools, and impact on mathematics if solved.',
                    hint: 'There is no single right answer. Think about what kind of mathematics excites you most.',
                    solution: 'A thoughtful answer should engage with at least two criteria: the problem\'s statement and what its resolution would imply. For example, RH implies sharp error terms throughout number theory. Twin prime conjecture would confirm that prime gaps reset infinitely often. Goldbach would connect additive and multiplicative structure of integers.'
                }
            ]
        },

        // ================================================================
        // SECTION 2: The Riemann Hypothesis
        // ================================================================
        {
            id: 'sec-rh',
            title: 'The Riemann Hypothesis',
            content: `
<h2>The Riemann Hypothesis</h2>

<div class="env-block intuition">
    <div class="env-title">One Million Dollars and a Century of Waiting</div>
    <div class="env-body">
        <p>In 1859, Riemann stated a hypothesis almost in passing, buried in an eight-page paper on the distribution of primes. In 1900, Hilbert listed it as one of the great problems for the coming century. In 2000, the Clay Mathematics Institute made it one of the seven Millennium Prize Problems, each carrying a prize of one million US dollars. The hypothesis remains unresolved today.</p>
    </div>
</div>

<h3>Statement</h3>

<div class="env-block theorem">
    <div class="env-title">The Riemann Hypothesis (1859)</div>
    <div class="env-body">
        <p>All nontrivial zeros of the Riemann zeta function \\(\\zeta(s)\\) lie on the critical line \\(\\Re(s) = \\tfrac{1}{2}\\). That is, every \\(\\rho\\) with \\(\\zeta(\\rho) = 0\\) and \\(0 < \\Re(\\rho) < 1\\) satisfies \\(\\rho = \\tfrac{1}{2} + it\\) for some real \\(t\\).</p>
    </div>
</div>

<p>Recall from Chapter 4 that \\(\\zeta(s) = \\sum_{n=1}^\\infty n^{-s}\\) for \\(\\Re(s) > 1\\), extended by analytic continuation to \\(\\mathbb{C} \\setminus \\{1\\}\\). The nontrivial zeros lie in the critical strip \\(0 < \\Re(s) < 1\\), and from the functional equation they are symmetric about both \\(\\Re(s) = 1/2\\) and \\(\\Im(s) = 0\\). Trivial zeros occur at \\(s = -2, -4, -6, \\ldots\\).</p>

<h3>Evidence</h3>

<p>We do not have a proof, but the evidence is overwhelming:</p>
<ul>
  <li><strong>Computational:</strong> The first \\(10^{13}\\) nontrivial zeros all lie on the critical line (verified by Odlyzko, Gourdon, and others).</li>
  <li><strong>Statistical:</strong> The distribution of zero spacings matches the Gaussian Unitary Ensemble (GUE) from random matrix theory with extraordinary precision (Odlyzko, 1987 onward). This is not what one would expect from a distribution not confined to one line.</li>
  <li><strong>Theoretical:</strong> RH holds for all Dirichlet L-functions \\(L(s, \\chi)\\) of real characters in all known special cases. It holds for function field analogues (Weil, 1948; Deligne, 1974).</li>
</ul>

<h3>Equivalences</h3>

<p>RH is equivalent to many statements across number theory. A selection:</p>

<div class="env-block theorem">
    <div class="env-title">Theorem (Equivalences of RH)</div>
    <div class="env-body">
        <p>The Riemann Hypothesis is equivalent to each of the following:</p>
        <ol>
          <li><strong>(Prime counting error):</strong> \\(|\\pi(x) - \\mathrm{Li}(x)| = O(\\sqrt{x} \\log x)\\) for all \\(x \\ge 2\\).</li>
          <li><strong>(Chebyshev function):</strong> \\(|\\psi(x) - x| = O(\\sqrt{x} \\log^2 x)\\) for all \\(x \\ge 2\\).</li>
          <li><strong>(Robin's inequality):</strong> \\(\\sigma(n) < e^\\gamma n \\log \\log n\\) for all \\(n > 5040\\), where \\(\\sigma(n)\\) is the sum of divisors and \\(\\gamma\\) is the Euler-Mascheroni constant.</li>
          <li><strong>(Mertens function):</strong> \\(M(x) = \\sum_{n \\le x} \\mu(n) = O(x^{1/2 + \\varepsilon})\\) for every \\(\\varepsilon > 0\\).</li>
        </ol>
    </div>
</div>

<div class="env-block remark">
    <div class="env-title">The Prize Condition</div>
    <div class="env-body">
        <p>The Clay Millennium Prize requires a proof (or disproof) published in a peer-reviewed journal and surviving two years of scrutiny by the mathematical community. A disproof would require finding a zero off the critical line. No such zero has been found despite enormous computational effort. Most experts believe RH is true.</p>
    </div>
</div>

<p>We will now see, interactively, what the "if RH then" cascade looks like: each consequence lighting up as we assume the hypothesis.</p>
`,
            visualizations: [
                {
                    id: 'viz-rh-implications',
                    title: 'If RH Then... (Implication Cascade)',
                    description: 'Click "Assume RH" to light up the cascade of theorems that follow. Each block shows a consequence. Hover for detail.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, { width: 680, height: 400 });
                        var ctx = viz.ctx;
                        var W = viz.width, H = viz.height;
                        var rhOn = false;
                        var hovered = -1;

                        var cards = [
                            { label: 'RH', sub: 'All zeros on Re(s)=1/2', x: W/2, y: 50, w: 160, h: 50, color: '#f85149', root: true },
                            { label: 'Sharp PNT', sub: '|pi(x)-Li(x)| = O(sqrt(x) log x)', x: 120, y: 145, w: 160, h: 50, color: '#58a6ff' },
                            { label: 'Psi error bound', sub: 'psi(x) = x + O(sqrt(x) log^2 x)', x: 320, y: 145, w: 175, h: 50, color: '#3fb9a0' },
                            { label: 'Mertens bound', sub: 'M(x) = O(x^{1/2+eps})', x: 520, y: 145, w: 155, h: 50, color: '#bc8cff' },
                            { label: 'Gaps ~ log p', sub: 'p_{n+1}-p_n = O(sqrt(p_n) log p_n)', x: 80, y: 255, w: 175, h: 50, color: '#f0883e' },
                            { label: 'Robin\'s ineq.', sub: 'sigma(n) < e^gamma n log log n', x: 270, y: 255, w: 170, h: 50, color: '#d29922' },
                            { label: 'GRH (plausible)', sub: 'Zeros of all L(s,chi) on 1/2', x: 480, y: 255, w: 170, h: 50, color: '#f778ba' },
                            { label: 'Optimal Bombieri-V.', sub: 'Error = O(x^{1/2} log^A x)', x: 175, y: 350, w: 185, h: 50, color: '#3fb950' },
                            { label: 'Artin conj. (partial)', sub: 'Primitive roots for most primes', x: 450, y: 350, w: 185, h: 50, color: '#58a6ff' },
                        ];

                        var arrows = [
                            [0, 1], [0, 2], [0, 3],
                            [1, 4], [2, 5], [3, 6],
                            [1, 7], [6, 8]
                        ];

                        var tooltips = [
                            'The central hypothesis: zeta zeros confined to Re(s) = 1/2',
                            'The logarithmic integral Li(x) approximates pi(x) with square-root error',
                            'Chebyshev\'s psi(x) = sum_{p^k <= x} log p tracks prime power weights',
                            'Mertens function M(x) = sum mu(n); bounds measure cancellation in mu',
                            'Under RH, gaps between consecutive primes are O(sqrt(p) log p)',
                            'Robin (1984): sum-of-divisors inequality equivalent to RH for n > 5040',
                            'GRH extends RH to all Dirichlet L-functions; believed but unproved',
                            'Bombieri-Vinogradov reaches this strength; RH would confirm it sharp',
                            'Hooley (1967): Artin\'s primitive root conjecture follows from GRH',
                        ];

                        function cardHit(mx, my, c) {
                            return mx >= c.x - c.w/2 && mx <= c.x + c.w/2 && my >= c.y - c.h/2 && my <= c.y + c.h/2;
                        }

                        function draw() {
                            ctx.fillStyle = viz.colors.bg;
                            ctx.fillRect(0, 0, W, H);

                            ctx.fillStyle = viz.colors.white;
                            ctx.font = 'bold 13px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText('Consequences of the Riemann Hypothesis', W/2, 20);

                            // Arrows
                            for (var i = 0; i < arrows.length; i++) {
                                var a = arrows[i];
                                var src = cards[a[0]], dst = cards[a[1]];
                                var lit = rhOn || a[0] === 0;
                                ctx.strokeStyle = rhOn ? src.color + 'aa' : '#2a2a4a';
                                ctx.lineWidth = rhOn ? 1.5 : 1;
                                ctx.beginPath();
                                ctx.moveTo(src.x, src.y + src.h/2);
                                ctx.lineTo(dst.x, dst.y - dst.h/2 - 5);
                                ctx.stroke();
                                // Arrowhead
                                var dx = dst.x - src.x, dy = (dst.y - dst.h/2) - (src.y + src.h/2);
                                var len = Math.sqrt(dx*dx + dy*dy);
                                if (len > 1) {
                                    var ux = dx/len, uy = dy/len;
                                    var tx = dst.x - ux*3, ty = dst.y - dst.h/2 - 3;
                                    ctx.fillStyle = rhOn ? src.color + 'aa' : '#3a3a5a';
                                    ctx.beginPath();
                                    ctx.moveTo(tx, ty);
                                    ctx.lineTo(tx - 8*ux + 4*uy, ty - 8*uy - 4*ux);
                                    ctx.lineTo(tx - 8*ux - 4*uy, ty - 8*uy + 4*ux);
                                    ctx.closePath(); ctx.fill();
                                }
                            }

                            // Cards
                            for (var j = 0; j < cards.length; j++) {
                                var c = cards[j];
                                var lit2 = rhOn || c.root;
                                var isHov = hovered === j;
                                var alpha = lit2 ? 'cc' : '33';
                                var strokeA = lit2 ? 'ff' : '44';

                                ctx.fillStyle = c.color + (isHov ? 'dd' : (lit2 ? '33' : '11'));
                                ctx.strokeStyle = c.color + strokeA;
                                ctx.lineWidth = lit2 ? 2 : 1;
                                ctx.beginPath();
                                ctx.roundRect ? ctx.roundRect(c.x - c.w/2, c.y - c.h/2, c.w, c.h, 8) : ctx.rect(c.x - c.w/2, c.y - c.h/2, c.w, c.h);
                                ctx.fill(); ctx.stroke();

                                ctx.fillStyle = c.color + (lit2 ? 'ff' : '55');
                                ctx.font = 'bold 11px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.textBaseline = 'middle';
                                ctx.fillText(c.label, c.x, c.y - 8);

                                ctx.font = '9px -apple-system,sans-serif';
                                ctx.fillStyle = viz.colors.text + (lit2 ? 'ff' : '55');
                                ctx.fillText(c.sub, c.x, c.y + 9);
                            }

                            // Tooltip
                            if (hovered >= 0) {
                                var tip = tooltips[hovered];
                                var cx2 = cards[hovered].x, cy2 = cards[hovered].y;
                                ctx.fillStyle = '#1a1a3a';
                                ctx.strokeStyle = cards[hovered].color;
                                ctx.lineWidth = 1;
                                var tw = Math.min(tip.length * 6.5 + 20, 300);
                                var tx2 = Math.min(Math.max(cx2 - tw/2, 5), W - tw - 5);
                                var ty2 = cy2 + cards[hovered].h/2 + 6;
                                if (ty2 + 36 > H) ty2 = cy2 - cards[hovered].h/2 - 40;
                                ctx.fillRect(tx2, ty2, tw, 30);
                                ctx.strokeRect(tx2, ty2, tw, 30);
                                ctx.fillStyle = viz.colors.white;
                                ctx.font = '10px -apple-system,sans-serif';
                                ctx.textAlign = 'left';
                                ctx.fillText(tip, tx2 + 8, ty2 + 15);
                            }
                        }

                        VizEngine.createButton(controls, rhOn ? 'Revoke RH' : 'Assume RH', function() {
                            rhOn = !rhOn;
                            this.textContent = rhOn ? 'Revoke RH' : 'Assume RH';
                            draw();
                        });

                        viz.canvas.addEventListener('mousemove', function(e) {
                            var r = viz.canvas.getBoundingClientRect();
                            var mx = e.clientX - r.left, my = e.clientY - r.top;
                            hovered = -1;
                            for (var i = 0; i < cards.length; i++) {
                                if (cardHit(mx, my, cards[i])) { hovered = i; break; }
                            }
                            draw();
                        });
                        viz.canvas.addEventListener('mouseleave', function() { hovered = -1; draw(); });

                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Using the Euler product and the functional equation (from Chapters 4-5), verify that the nontrivial zeros come in pairs: if \\(\\rho\\) is a zero, so are \\(\\bar{\\rho}\\), \\(1 - \\rho\\), and \\(1 - \\bar{\\rho}\\). What symmetry does RH impose on this quadruple?',
                    hint: 'Apply complex conjugation and the functional equation \\(\\xi(s) = \\xi(1-s)\\) where \\(\\xi\\) is the completed zeta function.',
                    solution: 'The real coefficients of the Dirichlet series imply \\(\\overline{\\zeta(s)} = \\zeta(\\bar s)\\), so if \\(\\zeta(\\rho)=0\\) then \\(\\zeta(\\bar\\rho)=0\\). The functional equation \\(\\xi(s)=\\xi(1-s)\\) forces \\(\\zeta(1-\\rho)=0\\) as well. So zeros come in quadruples \\(\\{\\rho, \\bar\\rho, 1-\\rho, 1-\\bar\\rho\\}\\). RH forces \\(\\rho = 1/2+it\\), collapsing each quadruple to a conjugate pair \\(\\{1/2+it, 1/2-it\\}\\) on the critical line.'
                },
                {
                    question: 'The first few nontrivial zeros of \\(\\zeta(s)\\) have imaginary part approximately \\(14.135, 21.022, 25.011, 30.425, 32.935, \\ldots\\). For each, verify Robin\'s criterion \\(\\sigma(n) < e^\\gamma n \\log \\log n\\) by computing the left and right sides for \\(n = 2, 6, 12, 60, 360\\). (Use \\(\\gamma \\approx 0.5772\\).)',
                    hint: 'The highly composite numbers and colossally abundant numbers are the ones that come closest to violating Robin\'s inequality. Compute sigma(n) = product over prime powers in factorization.',
                    solution: 'For n=12: sigma(12)=28, e^gamma * 12 * log(log(12)) approx 1.781 * 12 * 0.9002 approx 19.23. Wait, 28 > 19.23? Recall Robin\'s criterion only applies for n > 5040. For n <= 5040, there are known exceptions (n=5040 itself is the critical case). For n > 5040, numerical checks confirm the inequality holds, consistent with RH.'
                }
            ]
        },

        // ================================================================
        // SECTION 3: Landau's Four Problems
        // ================================================================
        {
            id: 'sec-landau',
            title: "Landau's Four Problems",
            content: `
<h2>Landau's Four Problems</h2>

<div class="env-block intuition">
    <div class="env-title">1912: Four Unsolved Problems</div>
    <div class="env-body">
        <p>At the 1912 International Congress of Mathematicians in Cambridge, Edmund Landau listed four specific problems about primes that he considered "unattackable with present methods." Over a century later, all four remain open in their original form.</p>
    </div>
</div>

<p>The four problems are:</p>
<ol>
  <li><strong>Goldbach's Conjecture:</strong> Every even integer greater than 2 is the sum of two primes.</li>
  <li><strong>Twin Prime Conjecture:</strong> There are infinitely many primes \\(p\\) such that \\(p + 2\\) is also prime.</li>
  <li><strong>Legendre's Conjecture:</strong> For every positive integer \\(n\\), there is at least one prime between \\(n^2\\) and \\((n+1)^2\\).</li>
  <li><strong>Near-square primes:</strong> There are infinitely many primes of the form \\(n^2 + 1\\).</li>
</ol>

<h3>Progress on Goldbach</h3>

<div class="env-block theorem">
    <div class="env-title">Theorem (Helfgott, 2013 — Weak Goldbach)</div>
    <div class="env-body">
        <p>Every odd integer greater than 5 is the sum of three primes.</p>
    </div>
</div>

<p>This "weak" (ternary) form was first established for sufficiently large integers by Vinogradov (1937) using the circle method. Helfgott's breakthrough was making "sufficiently large" explicit and verifiable by computer for all remaining cases. The strong (binary) Goldbach conjecture remains open. The best unconditional result is that every sufficiently large even integer is the sum of a prime and a number with at most two prime factors (Chen, 1973).</p>

<h3>Progress on Twin Primes</h3>

<p>As we saw in Chapter 19, the situation changed dramatically in 2013:</p>
<ul>
  <li><strong>Brun (1919):</strong> \\(\\sum_{p,p+2 \\text{ twin primes}} 1/p\\) converges (Brun's constant \\(\\approx 1.9022\\)).</li>
  <li><strong>Zhang (2013):</strong> There exist infinitely many pairs of primes differing by at most 70,000,000.</li>
  <li><strong>Maynard, Tao (2014):</strong> The bound is reduced to 246. Under Elliott-Halberstam, it drops to 6.</li>
  <li><strong>Remaining gap:</strong> A gap of 2 (the twin prime conjecture proper) is still out of reach.</li>
</ul>

<h3>Legendre and Near-Square Primes</h3>

<p>On Legendre's conjecture, the best result uses sieve methods: there is always a prime between \\(n^2\\) and \\(n^2 + n^{1.05}\\) for large \\(n\\) (Ingham-type bounds via the zeta function). Assuming RH, the gap is \\(O(n \\log n)\\). But \\(O(n)\\) remains open.</p>

<p>For \\(n^2 + 1\\): Iwaniec (1978) showed, using the sieve, that \\(n^2 + 1\\) has a prime factor exceeding \\(n^{6/5}\\) for infinitely many \\(n\\). This falls far short of showing \\(n^2 + 1\\) itself is prime infinitely often.</p>

<div class="env-block remark">
    <div class="env-title">The Parity Barrier</div>
    <div class="env-body">
        <p>All four of Landau's problems (and many others in additive prime theory) run into the so-called <em>parity problem</em>: sieve methods cannot distinguish numbers with an odd number of prime factors from numbers with an even number of prime factors. This obstruction was made precise by Selberg. No purely sieve-theoretic argument can prove that \\(n^2 + 1\\) is prime; additional input (such as the circle method or L-function zeros) is needed.</p>
    </div>
</div>
`,
            visualizations: [
                {
                    id: 'viz-landau-status',
                    title: "Landau's Four Problems: Status Board",
                    description: 'Traffic-light status for each of Landau\'s four problems. Green = fully resolved, yellow = substantial progress, red = wide open.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, { width: 680, height: 320 });
                        var ctx = viz.ctx;
                        var W = viz.width, H = viz.height;

                        var problems = [
                            {
                                name: "Goldbach (binary)",
                                status: "yellow",
                                statement: "Every even n >= 4 is sum of two primes",
                                best: "Chen (1973): p + P2 always works. Helfgott (2013): ternary proved.",
                                detail: "Strong form remains open. Best partial: every even n = p + (product of <= 2 primes). EH conjecture would give exceptional set of size O(x^{1/2+eps}).",
                            },
                            {
                                name: "Twin Primes",
                                status: "yellow",
                                statement: "Infinitely many p with p+2 prime",
                                best: "Zhang-Maynard (2013-14): gap <= 246 infinitely often.",
                                detail: "Gaps of exactly 2 remain open. GPY sieve + Zhang/Maynard handles fixed bounded gaps. Parity problem blocks the final step to gap = 2.",
                            },
                            {
                                name: "Legendre's Conjecture",
                                status: "red",
                                statement: "Prime in (n^2, (n+1)^2) for every n",
                                best: "Conditional on RH: prime in (n^2, n^2 + n log n). Unconditional: O(n^{1.05}).",
                                detail: "Ingham (1937): gap after p is O(p^{5/8}). RH gives O(p^{1/2} log p). Full Legendre requires showing the gap is <= 2n.",
                            },
                            {
                                name: "n\u00b2+1 Primes",
                                status: "red",
                                statement: "Infinitely many primes of form n\u00b2+1",
                                best: "Iwaniec (1978): n\u00b2+1 has large prime factor (> n^{6/5}) infinitely often.",
                                detail: "Dirichlet density of n^2+1 being prime is predicted by Bateman-Horn. Sieve parity barrier prevents confirming this. No unconditional progress beyond Iwaniec.",
                            },
                        ];

                        var colW = (W - 40) / 4;
                        var hovered = -1;

                        var statusColors = { green: '#3fb950', yellow: '#d29922', red: '#f85149' };
                        var statusText = { green: 'SOLVED', yellow: 'PARTIAL', red: 'OPEN' };

                        function draw() {
                            ctx.fillStyle = viz.colors.bg;
                            ctx.fillRect(0, 0, W, H);

                            ctx.fillStyle = viz.colors.white;
                            ctx.font = 'bold 14px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText("Landau's Four Problems — Status Board", W/2, 22);

                            for (var i = 0; i < problems.length; i++) {
                                var p = problems[i];
                                var x0 = 20 + i * colW;
                                var col = statusColors[p.status];
                                var isHov = hovered === i;

                                // Card background
                                ctx.fillStyle = col + (isHov ? '22' : '0e');
                                ctx.strokeStyle = col + (isHov ? 'ff' : '88');
                                ctx.lineWidth = isHov ? 2 : 1;
                                var cw = colW - 8, ch = isHov ? 220 : 200;
                                var cy = 42;
                                ctx.beginPath();
                                if (ctx.roundRect) ctx.roundRect(x0, cy, cw, ch, 8);
                                else ctx.rect(x0, cy, cw, ch);
                                ctx.fill(); ctx.stroke();

                                // Traffic light
                                var lx = x0 + cw/2, ly = cy + 28;
                                ctx.fillStyle = col;
                                ctx.shadowColor = col;
                                ctx.shadowBlur = isHov ? 18 : 8;
                                ctx.beginPath(); ctx.arc(lx, ly, 14, 0, Math.PI*2); ctx.fill();
                                ctx.shadowBlur = 0;

                                ctx.fillStyle = col;
                                ctx.font = 'bold 9px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.fillText(statusText[p.status], lx, ly + 5);

                                // Problem name
                                ctx.fillStyle = viz.colors.white;
                                ctx.font = 'bold 11px -apple-system,sans-serif';
                                ctx.fillText(p.name, lx, cy + 62);

                                // Statement
                                ctx.fillStyle = viz.colors.text;
                                ctx.font = '9px -apple-system,sans-serif';
                                var words = p.statement.split(' ');
                                var line = '', lineY = cy + 78;
                                for (var w = 0; w < words.length; w++) {
                                    var test = line ? line + ' ' + words[w] : words[w];
                                    var meas = ctx.measureText(test);
                                    if (meas.width > cw - 8 && line) {
                                        ctx.fillText(line, lx, lineY);
                                        line = words[w]; lineY += 13;
                                    } else { line = test; }
                                }
                                if (line) { ctx.fillText(line, lx, lineY); lineY += 13; }

                                // Best result
                                ctx.fillStyle = col + 'cc';
                                ctx.font = 'bold 8.5px -apple-system,sans-serif';
                                ctx.fillText('Best result:', lx, lineY + 4);
                                lineY += 17;
                                ctx.font = '8px -apple-system,sans-serif';
                                ctx.fillStyle = viz.colors.text;
                                var bestWords = p.best.split(' ');
                                var bestLine = '';
                                for (var bw = 0; bw < bestWords.length; bw++) {
                                    var bTest = bestLine ? bestLine + ' ' + bestWords[bw] : bestWords[bw];
                                    var bMeas = ctx.measureText(bTest);
                                    if (bMeas.width > cw - 8 && bestLine) {
                                        ctx.fillText(bestLine, lx, lineY);
                                        bestLine = bestWords[bw]; lineY += 12;
                                    } else { bestLine = bTest; }
                                }
                                if (bestLine) ctx.fillText(bestLine, lx, lineY);
                            }

                            // Footer
                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '10px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText('Hover for details', W/2, H - 8);
                        }

                        viz.canvas.addEventListener('mousemove', function(e) {
                            var r = viz.canvas.getBoundingClientRect();
                            var mx = e.clientX - r.left;
                            hovered = -1;
                            for (var i = 0; i < 4; i++) {
                                var x0 = 20 + i * colW;
                                if (mx >= x0 && mx <= x0 + colW - 8) { hovered = i; break; }
                            }
                            draw();
                        });
                        viz.canvas.addEventListener('mouseleave', function() { hovered = -1; draw(); });

                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Goldbach\'s conjecture has been verified computationally for all even numbers up to \\(4 \\times 10^{18}\\). Explain why computational verification, no matter how extensive, cannot constitute a proof. What would a counterexample look like?',
                    hint: 'Think about what a proof requires: it must cover all cases, not just finitely many. A counterexample would be an even integer with no Goldbach decomposition.',
                    solution: 'A proof must establish the truth for infinitely many cases simultaneously, not case by case. Computation verifies finitely many instances; the conjecture asserts something about all even integers. A counterexample would be a specific even integer n such that for every prime p <= n/2, the number n-p is composite. Such an n, if it existed, would likely be astronomically large (though no heuristic suggests one exists).'
                },
                {
                    question: 'Chen\'s Theorem states that every sufficiently large even integer \\(n\\) can be written as \\(n = p + q\\) where \\(p\\) is prime and \\(q\\) is either prime or a product of two primes (a \\(P_2\\)-number). Why does the parity obstruction not prevent Chen\'s result, but does prevent extending it to \\(q\\) prime always?',
                    hint: 'The parity barrier specifically prevents sieve methods from distinguishing semiprimes from primes. Chen\'s result allows q to be semiprime, sidestepping the barrier.',
                    solution: 'Chen\'s proof uses Selberg\'s sieve plus weighted estimates, allowing q to have at most 2 prime factors. This sidesteps the parity problem because the sieve CAN detect "at most k prime factors." It cannot guarantee q is prime (exactly 1 factor) because distinguishing 1-factor from 2-factor numbers requires parity sensitivity that sieve weights cannot provide. Extending to q always prime would require new ideas beyond sieves.'
                }
            ]
        },

        // ================================================================
        // SECTION 4: The Langlands Program
        // ================================================================
        {
            id: 'sec-langlands',
            title: 'The Langlands Program',
            content: `
<h2>The Langlands Program</h2>

<div class="env-block intuition">
    <div class="env-title">A Grand Unification</div>
    <div class="env-body">
        <p>In 1967, Robert Langlands wrote a letter to Andre Weil sketching a network of conjectures that, if true, would unify vast swaths of mathematics: number theory, representation theory, and harmonic analysis. Langlands called it "a bit reckless." Fifty years later, the program has organized the work of hundreds of mathematicians and produced some of the deepest theorems in mathematics.</p>
    </div>
</div>

<h3>The Basic Idea</h3>

<p>The central vision: there should be a deep correspondence between</p>
<ul>
  <li><strong>Galois representations:</strong> homomorphisms \\(\\rho: \\mathrm{Gal}(\\bar{\\mathbb{Q}}/\\mathbb{Q}) \\to GL_n(\\mathbb{C})\\), encoding arithmetic symmetries, and</li>
  <li><strong>Automorphic representations:</strong> irreducible representations of \\(GL_n(\\mathbb{A})\\) (\\(\\mathbb{A}\\) = adele ring) with specific analytic properties.</li>
</ul>

<p>Each side has an attached family of L-functions. The conjecture: these L-functions should agree. This is what "functoriality" and "reciprocity" mean in the Langlands sense.</p>

<h3>Why It Matters for Primes</h3>

<p>Many of the deepest results about L-functions and primes reduce to special cases of Langlands. Wiles's proof of Fermat's Last Theorem (1995) crucially used the modularity theorem (a Langlands reciprocity for \\(GL_2\\)): every elliptic curve over \\(\\mathbb{Q}\\) corresponds to a modular form. The Sato-Tate conjecture (equidistribution of \\(a_p(E)\\) for an elliptic curve \\(E\\), proved by Taylor et al. 2006-2008) is a consequence of symmetric power L-function properties, itself a Langlands lifting.</p>

<h3>Known Cases</h3>

<div class="env-block theorem">
    <div class="env-title">Known Instances of Langlands Reciprocity</div>
    <div class="env-body">
        <ul>
          <li><strong>\\(GL_1\\) (Class field theory):</strong> Fully proved. Artin-Tate and the main theorems of global class field theory. Dirichlet characters correspond to Hecke Grossencharacters.</li>
          <li><strong>\\(GL_2\\) (Modularity):</strong> Wiles-Taylor (1995) for semistable elliptic curves; Breuil-Conrad-Diamond-Taylor (2001) for all elliptic curves over \\(\\mathbb{Q}\\). Extended to totally real fields by Kisin.</li>
          <li><strong>Sato-Tate (proved 2006-2008):</strong> For non-CM elliptic curves, \\(a_p(E)/2\\sqrt{p}\\) equidistributes with respect to the semicircle measure.</li>
          <li><strong>Functoriality (partial):</strong> Langlands-Shahidi method, Converse theorems, and recent work of Vincent Lafforgue for function fields.</li>
        </ul>
    </div>
</div>

<div class="env-block remark">
    <div class="env-title">Geometric Langlands</div>
    <div class="env-body">
        <p>A geometric analogue exists over algebraic curves over finite fields. The geometric Langlands conjecture (for \\(GL_n\\)) was proved in full by Fargues-Scholze (2021) using perfectoid geometry and the "Fargues-Fontaine curve" — a landmark of 21st-century mathematics. The relationship to classical Langlands is deep but still being worked out.</p>
    </div>
</div>

<h3>Connection to Analytic Number Theory</h3>

<p>From the perspective of this course: the Langlands program predicts that all "motivic" L-functions are entire and satisfy functional equations. This would generalize the Riemann zeta function and Dirichlet L-functions to a vast class of arithmetically defined L-functions. Controlling their zeros (a generalized GRH) would unlock the distribution of primes in increasingly subtle arithmetic sets.</p>

<p>Concretely: Automorphic forms generalize the characters in Dirichlet's theorem. Automorphic L-functions of degree \\(n\\) encode data about degree-\\(n\\) number fields. Understanding their zeros gives equidistribution of "Frobenius" elements in Galois groups, hence prime distribution in number fields.</p>
`,
            visualizations: [
                {
                    id: 'viz-open-gallery',
                    title: 'Gallery of Open Problems: Visual Signatures',
                    description: 'Visualizing the "gap signatures" of major conjectures. Each panel shows the pattern that would be implied by or related to a major open problem.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, { width: 680, height: 380 });
                        var ctx = viz.ctx;
                        var W = viz.width, H = viz.height;

                        var primes = VizEngine.sievePrimes(5000);

                        var panels = [
                            {
                                title: 'Twin Prime Gaps',
                                subtitle: 'Gaps of size 2 (twin primes to 5000)',
                                color: '#58a6ff',
                                draw: function(x0, y0, pw, ph) {
                                    var twinGaps = [];
                                    for (var i = 0; i < primes.length - 1; i++) {
                                        if (primes[i+1] - primes[i] === 2) twinGaps.push(primes[i]);
                                    }
                                    // Plot positions of twin primes along x axis
                                    var maxP = primes[primes.length - 1];
                                    var count = 0;
                                    for (var j = 0; j < twinGaps.length; j++) {
                                        var px2 = x0 + (twinGaps[j] / maxP) * pw;
                                        count++;
                                        var py2 = y0 + ph - 8 - (count / twinGaps.length) * (ph - 20);
                                        ctx.fillStyle = '#58a6ff88';
                                        ctx.fillRect(px2, y0 + ph - 14, 2, 10);
                                    }
                                    ctx.fillStyle = '#58a6ff';
                                    ctx.font = '9px -apple-system,sans-serif';
                                    ctx.textAlign = 'left';
                                    ctx.fillText(twinGaps.length + ' twin pairs up to 5000', x0 + 4, y0 + ph - 3);
                                }
                            },
                            {
                                title: 'Goldbach Representations',
                                subtitle: 'Count of ways to write 2n = p+q',
                                color: '#3fb950',
                                draw: function(x0, y0, pw, ph) {
                                    var primeSet = new Set(primes);
                                    var maxN = 200;
                                    var maxCount = 0;
                                    var counts = [];
                                    for (var n = 2; n <= maxN; n += 2) {
                                        var c = 0;
                                        for (var ii = 0; ii < primes.length && primes[ii] <= n; ii++) {
                                            if (primeSet.has(n - primes[ii])) c++;
                                        }
                                        counts.push({ n: n, c: Math.floor(c/2) });
                                        if (c/2 > maxCount) maxCount = c/2;
                                    }
                                    for (var k = 0; k < counts.length; k++) {
                                        var bx = x0 + (k / counts.length) * pw;
                                        var bh2 = counts[k].c / maxCount * (ph - 20);
                                        ctx.fillStyle = '#3fb95066';
                                        ctx.fillRect(bx, y0 + ph - 10 - bh2, pw / counts.length - 1, bh2);
                                    }
                                    ctx.fillStyle = '#3fb950';
                                    ctx.font = '9px -apple-system,sans-serif';
                                    ctx.textAlign = 'left';
                                    ctx.fillText('Goldbach ways for even n up to 200', x0 + 4, y0 + ph - 2);
                                }
                            },
                            {
                                title: 'Primes ~ n\u00b2',
                                subtitle: 'Primes of form n\u00b2+k for small k',
                                color: '#bc8cff',
                                draw: function(x0, y0, pw, ph) {
                                    var primeSet = new Set(primes);
                                    var hits = [];
                                    for (var n = 1; n*n < 5000; n++) {
                                        if (primeSet.has(n*n + 1)) hits.push({ n: n, k: 1 });
                                        if (primeSet.has(n*n + 2)) hits.push({ n: n, k: 2 });
                                    }
                                    var maxN2 = 70;
                                    for (var h = 0; h < hits.length; h++) {
                                        if (hits[h].n > maxN2) continue;
                                        var hx = x0 + (hits[h].n / maxN2) * pw;
                                        var hy = y0 + (hits[h].k === 1 ? ph * 0.35 : ph * 0.65);
                                        ctx.fillStyle = hits[h].k === 1 ? '#bc8cffcc' : '#f778bacc';
                                        ctx.beginPath(); ctx.arc(hx, hy, 3, 0, Math.PI*2); ctx.fill();
                                    }
                                    ctx.fillStyle = '#bc8cff';
                                    ctx.font = '9px -apple-system,sans-serif';
                                    ctx.textAlign = 'left';
                                    ctx.fillText('Purple: n\u00b2+1 prime. Pink: n\u00b2+2 prime.', x0 + 4, y0 + ph - 2);
                                }
                            },
                        ];

                        var margin = 12, panelW = (W - margin * (panels.length + 1)) / panels.length;
                        var panelH = H - 60;

                        function draw() {
                            ctx.fillStyle = viz.colors.bg;
                            ctx.fillRect(0, 0, W, H);

                            ctx.fillStyle = viz.colors.white;
                            ctx.font = 'bold 14px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText('Visual Signatures of Landau\'s Problems', W/2, 20);

                            for (var i = 0; i < panels.length; i++) {
                                var pan = panels[i];
                                var x0 = margin + i * (panelW + margin);
                                var y0 = 38;

                                // Panel border
                                ctx.fillStyle = pan.color + '0a';
                                ctx.strokeStyle = pan.color + '88';
                                ctx.lineWidth = 1;
                                ctx.beginPath();
                                if (ctx.roundRect) ctx.roundRect(x0, y0, panelW, panelH, 6);
                                else ctx.rect(x0, y0, panelW, panelH);
                                ctx.fill(); ctx.stroke();

                                // Title
                                ctx.fillStyle = pan.color;
                                ctx.font = 'bold 10px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.fillText(pan.title, x0 + panelW/2, y0 + 14);
                                ctx.fillStyle = viz.colors.text;
                                ctx.font = '8.5px -apple-system,sans-serif';
                                ctx.fillText(pan.subtitle, x0 + panelW/2, y0 + 26);

                                // Panel content
                                pan.draw(x0 + 4, y0 + 32, panelW - 8, panelH - 38);
                            }
                        }

                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'The modularity theorem (proved by Wiles-Taylor) states that every elliptic curve over \\(\\mathbb{Q}\\) is modular. What does "modular" mean here? Explain the L-function connection: why does modularity imply that the L-function of an elliptic curve has an analytic continuation and functional equation?',
                    hint: 'A modular form has a Mellin transform that is an L-function. The elliptic curve being modular means its Hasse-Weil L-function matches a modular form L-function.',
                    solution: 'An elliptic curve E/Q has a Hasse-Weil L-function L(E,s) = prod_p L_p(E,s) encoding the number of points #E(F_p) via a_p = p+1-#E(F_p). "Modular" means there exists a weight-2 newform f of level N (the conductor of E) whose Fourier coefficients match: a_n(f) = a_n(E). Since modular form L-functions have analytic continuation and functional equation (via the Mellin transform and Atkin-Lehner involution), L(E,s) inherits these properties. This was the missing piece needed to apply the analytic machinery of the course to Diophantine problems.'
                }
            ]
        },

        // ================================================================
        // SECTION 5: Recent Breakthroughs
        // ================================================================
        {
            id: 'sec-recent',
            title: 'Recent Breakthroughs',
            content: `
<h2>Recent Breakthroughs</h2>

<div class="env-block intuition">
    <div class="env-title">The Subject Is Not Dead</div>
    <div class="env-body">
        <p>A common misconception: the classical problems are so hard that progress has stalled. In fact, the past fifteen years have seen multiple fundamental breakthroughs, some achieved by researchers early in their careers. This section surveys the most important recent advances.</p>
    </div>
</div>

<h3>Zhang, Maynard, and Tao: Bounded Prime Gaps (2013--2014)</h3>

<p>We covered this in detail in Chapter 19. The key points in brief:</p>
<ul>
  <li>Zhang (2013): The first finite upper bound on the liminf of \\(p_{n+1} - p_n\\). His bound \\(7 \\times 10^7\\) came from a variant of the GPY sieve combined with a new result on primes in arithmetic progressions beyond the Bombieri-Vinogradov range (a "level of distribution" above \\(1/2\\)).</li>
  <li>The Polymath8 project (Tao, et al., 2013): Reduced Zhang's bound from \\(7 \\times 10^7\\) to 4,680.</li>
  <li>Maynard (2014), independently Tao: Introduced a new sieve weight (multi-dimensional) yielding gap \\(\\le 600\\), soon improved to \\(246\\) under GEH. Under Elliott-Halberstam, gap \\(\\le 6\\).</li>
</ul>

<div class="env-block theorem">
    <div class="env-title">Theorem (Maynard 2014)</div>
    <div class="env-body">
        <p>For any \\(m \\ge 1\\), there are infinitely many integers \\(n\\) such that the interval \\([n, n + C_m]\\) contains at least \\(m\\) primes, where \\(C_m\\) depends only on \\(m\\). In particular, \\(\\liminf_{n \\to \\infty}(p_{n+1} - p_n) \\le 246\\).</p>
    </div>
</div>

<h3>Helfgott: Weak Goldbach (2013)</h3>

<p>Vinogradov proved in 1937 that every sufficiently large odd integer is the sum of three primes, using exponential sums (the circle method). "Sufficiently large" was then \\(\\exp(10^{6.9})\\), wildly beyond computational reach.</p>

<p>Helfgott's 2013 work (expanded in 2019) sharpened all the bounds in Vinogradov's argument to make the threshold effective: every odd integer greater than 5 is the sum of three primes. Key tools:</p>
<ul>
  <li>Rigorous numerical verification for integers below a manageable threshold (using verified computations of exponential sums).</li>
  <li>Refined major and minor arc estimates, with explicit constants throughout.</li>
  <li>A new bound on the minor arc contribution using large sieve inequalities and precise zero-free regions.</li>
</ul>

<h3>Matom\u00e4ki and Radziwi\u0142\u0142: Short Intervals (2015)</h3>

<p>One of the most surprising recent breakthroughs concerns the Liouville function \\(\\lambda(n) = (-1)^{\\Omega(n)}\\) (where \\(\\Omega(n)\\) = number of prime factors with multiplicity).</p>

<div class="env-block theorem">
    <div class="env-title">Theorem (Matom\u00e4ki-Radziwi\u0142\u0142, 2015)</div>
    <div class="env-body">
        <p>For any \\(\\varepsilon > 0\\), for almost all intervals \\([x, x + h]\\) with \\(h \\ge x^\\varepsilon\\),</p>
        \\[\\frac{1}{h} \\sum_{x < n \\le x+h} \\lambda(n) = o(1).\\]
        <p>That is, the Liouville function has mean zero on almost all short intervals, with \\(h\\) as small as \\(x^\\varepsilon\\) for any \\(\\varepsilon > 0\\) (much shorter than was previously accessible).</p>
    </div>
</div>

<p>The key innovation was a new method for handling multiplicative functions in short intervals, bypassing the need for zero-free regions for \\(\\zeta(s)\\) in a strip \\(\\Re(s) \\ge 1 - \\delta\\). This opened a new toolkit and has since been applied by Matom\u00e4ki, Radziwi\u0142\u0142, Tao, and others to resolve several long-standing problems about multiplicative functions and primes in short intervals.</p>

<h3>The Impact</h3>

<p>These three breakthroughs share a structural feature: they each introduced a genuinely new idea that unlocked a problem that had resisted all previous approaches. Zhang's level-of-distribution result, Maynard's multi-dimensional sieve weights, Helfgott's effective minor arc bounds, and Matom\u00e4ki-Radziwi\u0142\u0142's short-interval multiplicative function technique are all now standard tools in the field.</p>

<p>The lesson: in analytic number theory, progress often comes not from marginal improvements to existing methods, but from introducing a new idea that changes the structure of the problem.</p>
`,
            visualizations: [
                {
                    id: 'viz-progress-timeline',
                    title: 'Timeline of Analytic Number Theory (1737 -- 2025)',
                    description: 'Scrollable timeline of major milestones. Drag horizontally to navigate from Euler\'s product formula to Maynard\'s theorem.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, { width: 680, height: 340 });
                        var ctx = viz.ctx;
                        var W = viz.width, H = viz.height;

                        var events = [
                            { year: 1737, label: "Euler: Product formula", color: '#58a6ff', y: 0.3 },
                            { year: 1798, label: "Legendre: pi(x) ~ x/log x (conj.)", color: '#3fb9a0', y: 0.6 },
                            { year: 1837, label: "Dirichlet: Primes in progressions", color: '#3fb950', y: 0.25 },
                            { year: 1848, label: "Chebyshev: psi, theta estimates", color: '#bc8cff', y: 0.55 },
                            { year: 1859, label: "Riemann: Zeta zeros paper", color: '#f85149', y: 0.2 },
                            { year: 1896, label: "Hadamard & de la VP: PNT proved", color: '#3fb950', y: 0.7 },
                            { year: 1900, label: "Hilbert's 8th problem (RH)", color: '#f85149', y: 0.35 },
                            { year: 1912, label: "Landau: Four unsolved problems", color: '#d29922', y: 0.65 },
                            { year: 1919, label: "Brun: Brun's constant", color: '#f0883e', y: 0.3 },
                            { year: 1930, label: "Vinogradov sieve; Selberg", color: '#bc8cff', y: 0.55 },
                            { year: 1937, label: "Vinogradov: Ternary Goldbach (large n)", color: '#3fb9a0', y: 0.2 },
                            { year: 1948, label: "Selberg, Erdos: Elementary PNT", color: '#58a6ff', y: 0.65 },
                            { year: 1965, label: "Bombieri-Vinogradov", color: '#3fb950', y: 0.35 },
                            { year: 1973, label: "Chen: p + P2 theorem", color: '#f0883e', y: 0.6 },
                            { year: 1978, label: "Iwaniec: n^2+1 large prime factor", color: '#bc8cff', y: 0.28 },
                            { year: 1987, label: "Odlyzko: GUE zeros statistics", color: '#f85149', y: 0.55 },
                            { year: 1995, label: "Wiles-Taylor: Fermat's Last Theorem", color: '#d29922', y: 0.22 },
                            { year: 2005, label: "Goldston-Pintz-Yildirim (GPY)", color: '#58a6ff', y: 0.62 },
                            { year: 2013, label: "Zhang: Bounded prime gaps", color: '#3fb950', y: 0.3 },
                            { year: 2013, label: "Helfgott: Weak Goldbach proved", color: '#3fb9a0', y: 0.55 },
                            { year: 2014, label: "Maynard: Gap <= 600", color: '#3fb950', y: 0.2 },
                            { year: 2015, label: "Matomaki-Radziwill: Short intervals", color: '#bc8cff', y: 0.68 },
                            { year: 2021, label: "Fargues-Scholze: Geometric Langlands", color: '#f778ba', y: 0.38 },
                        ];

                        var minYear = 1730, maxYear = 2030;
                        var offsetX = 0;
                        var draggingTL = false;
                        var lastMX = 0;
                        var pixelsPerYear = W * 1.6 / (maxYear - minYear);

                        function yearToX(y) {
                            return offsetX + (y - minYear) * pixelsPerYear;
                        }

                        function draw() {
                            ctx.fillStyle = viz.colors.bg;
                            ctx.fillRect(0, 0, W, H);

                            ctx.fillStyle = viz.colors.white;
                            ctx.font = 'bold 14px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText('Analytic Number Theory: 290 Years of Progress', W/2, 22);

                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '10px -apple-system,sans-serif';
                            ctx.fillText('Drag to scroll through history', W/2, 36);

                            // Clip to canvas
                            ctx.save();
                            ctx.rect(0, 44, W, H - 44);
                            ctx.clip();

                            // Timeline axis
                            var axisY = H * 0.5 + 20;
                            ctx.strokeStyle = '#2a2a5a';
                            ctx.lineWidth = 2;
                            ctx.beginPath(); ctx.moveTo(0, axisY); ctx.lineTo(W, axisY); ctx.stroke();

                            // Year ticks
                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '10px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            for (var yr = Math.ceil(minYear / 25) * 25; yr <= maxYear; yr += 25) {
                                var tx = yearToX(yr);
                                if (tx < -10 || tx > W + 10) continue;
                                ctx.strokeStyle = '#2a2a5a';
                                ctx.lineWidth = 1;
                                ctx.beginPath(); ctx.moveTo(tx, axisY - 5); ctx.lineTo(tx, axisY + 5); ctx.stroke();
                                ctx.fillText(yr.toString(), tx, axisY + 18);
                            }

                            // Events
                            for (var i = 0; i < events.length; i++) {
                                var ev = events[i];
                                var ex = yearToX(ev.year);
                                if (ex < -200 || ex > W + 200) continue;
                                var ey = 50 + ev.y * (H - 100);
                                var above = ey < axisY;

                                // Stem
                                ctx.strokeStyle = ev.color + '88';
                                ctx.lineWidth = 1;
                                ctx.setLineDash([3, 3]);
                                ctx.beginPath(); ctx.moveTo(ex, axisY); ctx.lineTo(ex, ey); ctx.stroke();
                                ctx.setLineDash([]);

                                // Dot on axis
                                ctx.fillStyle = ev.color;
                                ctx.beginPath(); ctx.arc(ex, axisY, 4, 0, Math.PI*2); ctx.fill();

                                // Label box
                                ctx.font = '9px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                var lw = ctx.measureText(ev.label).width + 12;
                                ctx.fillStyle = '#0c0c20ee';
                                ctx.strokeStyle = ev.color + 'cc';
                                ctx.lineWidth = 1;
                                var lh = 20;
                                var lx2 = ex - lw/2, ly2 = above ? ey - lh - 2 : ey + 2;
                                ctx.fillRect(lx2, ly2, lw, lh);
                                ctx.strokeRect(lx2, ly2, lw, lh);
                                ctx.fillStyle = ev.color;
                                ctx.fillText(ev.label, ex, ly2 + 11);

                                // Year label
                                ctx.fillStyle = viz.colors.text;
                                ctx.font = '8px -apple-system,sans-serif';
                                ctx.fillText(ev.year.toString(), ex, above ? ey + 12 : ey - 5);
                            }

                            ctx.restore();
                        }

                        viz.canvas.addEventListener('mousedown', function(e) {
                            draggingTL = true;
                            lastMX = e.clientX;
                        });
                        viz.canvas.addEventListener('mousemove', function(e) {
                            if (!draggingTL) return;
                            var dx = e.clientX - lastMX;
                            lastMX = e.clientX;
                            offsetX += dx;
                            var maxOffset = 60, minOffset = -(pixelsPerYear * (maxYear - minYear) - W + 60);
                            offsetX = Math.max(minOffset, Math.min(maxOffset, offsetX));
                            draw();
                        });
                        viz.canvas.addEventListener('mouseup', function() { draggingTL = false; });
                        viz.canvas.addEventListener('mouseleave', function() { draggingTL = false; });

                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Zhang\'s breakthrough required a level-of-distribution result beyond \\(1/2\\): primes in arithmetic progressions to moduli up to \\(x^{1/2+\\delta}\\) for a specific \\(\\delta > 0\\), for smooth moduli. Explain why the Bombieri-Vinogradov theorem at level \\(1/2\\) is not sufficient for the GPY argument to give a finite bound, and what new input Zhang provided.',
                    hint: 'GPY showed that if you could increase the level of distribution from 1/2 to 1/2 + delta, you would get bounded gaps. Zhang provided this increase for a restricted class of moduli.',
                    solution: 'GPY showed that if primes have level of distribution theta > 1/2, then liminf(p_{n+1}-p_n) < infinity. But Bombieri-Vinogradov gives exactly theta = 1/2, and GPY\'s argument needed strictly more. Zhang proved a Bombieri-Vinogradov-type estimate for "smooth and squarefree" moduli up to x^{1/2 + 1/584}, using a combination of Fourier analysis and equidistribution of primes in arithmetic progressions with structured moduli (exploiting Deligne\'s work on exponential sums via the Weil conjectures). This small gain in the exponent was enough to close the GPY argument.'
                },
                {
                    question: 'The Matom\u00e4ki-Radziwi\u0142\u0142 theorem says that \\(\\lambda(n)\\) has mean zero on almost all intervals of length \\(h \\ge x^\\varepsilon\\). Before their work, what was the best known result, and why was the problem hard for short intervals?',
                    hint: 'Previously, one needed h to be nearly as large as x to control the mean of lambda. The difficulty is that lambda is not well-approximated by any character, and zero-free regions of zeta(s) give estimates only down to h = exp(c sqrt(log x)).',
                    solution: 'Before Matomaki-Radziwill, the best unconditional result required h >= exp(c sqrt(log x)) (from the classical zero-free region for zeta). For shorter intervals, no unconditional result was known. The difficulty: controlling sum_{n in [x,x+h]} lambda(n) requires bounding the Dirichlet polynomial sum_{n} lambda(n)/n^s; for short h, the corresponding range of s is in the "wide" strip where zero-free regions are weak. MR bypassed this by working with averages over x (rather than fixing x) and using a multiplicative structure of lambda (specifically, Halasz\'s theorem and pretentious number theory techniques). This "almost-all" averaging was the key innovation.'
                }
            ]
        },

        // ================================================================
        // SECTION 6: The Unfinished Symphony
        // ================================================================
        {
            id: 'sec-coda',
            title: 'The Unfinished Symphony',
            content: `
<h2>The Unfinished Symphony</h2>

<div class="env-block intuition">
    <div class="env-title">What Makes This Subject Beautiful</div>
    <div class="env-body">
        <p>Schubert's Eighth Symphony was left with only two movements. Musicologists debate whether this was accidental or deliberate. But no one doubts its beauty. Analytic number theory is, in a precise sense, an unfinished symphony: its deepest themes are fully developed, its structure is magnificent, and yet the final resolution remains, tantalizingly, out of reach.</p>
    </div>
</div>

<h3>The Deep Unity</h3>

<p>Looking back across all 21 chapters, three themes recur:</p>

<ol>
  <li><strong>Primes as eigenvalues.</strong> The nontrivial zeros of \\(\\zeta(s)\\) act like "frequencies" in the explicit formula. The prime counting function \\(\\psi(x)\\) is a superposition of oscillations \\(x^\\rho/\\rho\\) indexed by zeros. In random matrix theory, the zeros behave like eigenvalues of a large unitary matrix (GUE). This is not a metaphor; it is a precise statistical match, discovered by Montgomery and Dyson in 1972 and confirmed by Odlyzko's computations.</li>
  <li><strong>L-functions as the common language.</strong> Dirichlet series, Euler products, analytic continuation, and functional equations appear in every context: zeta, Dirichlet L-functions, automorphic L-functions, Hasse-Weil L-functions of elliptic curves. The Langlands program says they all belong to one family. The invariants are the zeros.</li>
  <li><strong>Approximate equidistribution.</strong> Primes are, in a deep sense, "random" once you condition on not being divisible by small primes. This intuition is made precise by the Chebotarev density theorem, by the Bateman-Horn conjecture, by the Hardy-Littlewood conjecture. The randomness lives in the phase structure of the zeros.</li>
</ol>

<h3>An Invitation to Research</h3>

<p>If you want to contribute to this field, here is what the current frontier looks like:</p>

<ul>
  <li><strong>Short route to the frontier:</strong> The tools introduced by Maynard (multi-dimensional sieves), Matom\u00e4ki-Radziwi\u0142\u0142 (short-interval multiplicative functions), and Tao (entropy decrement arguments) are now teachable and form a new subfield. A graduate student today can get to the research frontier in prime gaps or multiplicative functions within 2-3 years.</li>
  <li><strong>Computational approaches:</strong> High-precision numerical computation of zeta zeros, explicit bounds in zero-free regions, and verified computations (as in Helfgott's work) are increasingly valued and publishable. You do not need to prove a new qualitative theorem to make a lasting contribution.</li>
  <li><strong>Connections to geometry:</strong> The geometric Langlands program, work on Fargues-Fontaine curves, and the p-adic and perfectoid methods of Scholze are reshaping what "arithmetic" means. Analytic number theorists who learn these tools have extraordinary research opportunities.</li>
</ul>

<div class="env-block remark">
    <div class="env-title">Why the Riemann Hypothesis Is Still Hard</div>
    <div class="env-body">
        <p>A natural question: with 160+ years of effort, why has RH not been proved? The honest answer: we do not know how to prove it. More precisely, every approach that has been tried (spectral theory, trace formulas, random matrix theory, motivic cohomology) has given deep insight but has stopped short. This is not for lack of effort; it is because a genuinely new idea seems to be needed. That new idea may come from any corner of mathematics.</p>
        <p>Alain Connes has proposed a spectral interpretation: RH would follow if one could construct a self-adjoint operator whose eigenvalues are the imaginary parts of the zeros. The corresponding "space" would be a non-commutative geometry object. This is a precise conjecture with deep connections to physics (the Hilbert-Polya conjecture), but the construction remains elusive.</p>
    </div>
</div>

<h3>What You Have Learned</h3>

<p>In these 21 chapters you have seen:</p>
<ul>
  <li>The arithmetic of multiplicative functions and their Dirichlet series (Chapters 1-3).</li>
  <li>The Riemann zeta function: its zeros, functional equation, and domain coloring (Chapters 4-5).</li>
  <li>The Prime Number Theorem, its proof, and the explicit formula connecting primes to zeros (Chapters 6-8).</li>
  <li>Dirichlet L-functions and the proof that primes distribute in progressions (Chapters 9-10).</li>
  <li>Three generations of sieves: combinatorial, Selberg, large sieve (Chapters 11-13).</li>
  <li>Exponential sums, the circle method, and Goldbach-type problems (Chapters 14-15).</li>
  <li>Zero density theorems and automorphic forms (Chapters 16-17).</li>
  <li>Primes in short intervals and bounded prime gaps (Chapters 18-19).</li>
  <li>Computational methods for analytic number theory (Chapter 20).</li>
</ul>

<p>This is a complete first course. The references below point toward the research literature. The best of luck on the road ahead.</p>

<div class="env-block theorem">
    <div class="env-title">Coda</div>
    <div class="env-body">
        <p>Mathematics is a conversation across centuries. When you work on these problems, you are speaking with Euler, Riemann, Dirichlet, Hadamard, Hardy, Littlewood, Selberg, Bombieri, and the graduate students proving theorems next year. There is no subject that more sharply illustrates both the power and the humility of the human mind.</p>
        <p>The primes are still there, distributed along the integers, infinite and patient. Go find them.</p>
    </div>
</div>
`,
            visualizations: [
                {
                    id: 'viz-gue-final',
                    title: 'Capstone: Zeta Zeros vs. GUE Eigenvalues',
                    description: 'The statistical distribution of zeta zero spacings compared to the GUE (Gaussian Unitary Ensemble) prediction. Adjust the number of zeros to see how the match improves.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, { width: 680, height: 380 });
                        var ctx = viz.ctx;
                        var W = viz.width, H = viz.height;

                        // Known imaginary parts of zeta zeros (first 80, to 3 decimal places)
                        var zetaZerosRaw = [
                            14.135, 21.022, 25.011, 30.425, 32.935,
                            37.586, 40.919, 43.327, 48.005, 49.774,
                            52.970, 56.446, 59.347, 60.832, 65.113,
                            67.080, 69.546, 72.067, 75.705, 77.145,
                            79.337, 82.910, 84.735, 87.426, 88.809,
                            92.492, 94.651, 95.871, 98.831, 101.318,
                            103.726, 105.447, 107.169, 111.030, 111.875,
                            114.320, 116.227, 118.791, 121.370, 122.947,
                            124.257, 127.517, 129.579, 131.088, 133.498,
                            134.757, 138.116, 139.736, 141.124, 143.112,
                            146.001, 147.423, 150.054, 150.925, 153.025,
                            156.113, 157.598, 158.850, 161.189, 163.031,
                            165.537, 167.184, 169.095, 169.912, 173.412,
                            174.755, 176.441, 178.377, 179.916, 182.207,
                            184.874, 185.599, 187.229, 189.416, 192.027,
                            193.080, 195.265, 196.876, 198.015, 201.265
                        ];

                        var nZeros = 60;
                        var selectedMode = 'spacing';

                        VizEngine.createSlider(controls, 'Zeros', 20, 80, nZeros, 1, function(v) {
                            nZeros = Math.round(v);
                            draw();
                        });

                        // GUE pair correlation (Dyson sine kernel)
                        function gueSpacingPDF(s) {
                            // Wigner surmise approximation for GUE
                            return (32 / (Math.PI * Math.PI)) * s * s * Math.exp(-4 * s * s / Math.PI);
                        }

                        // Unfold zeros: normalize so mean spacing = 1
                        function unfoldZeros(zeros) {
                            var n = zeros.length;
                            // log density of zeros at height T is log(T/(2*pi))/(2*pi)
                            var unfolded = [];
                            for (var i = 0; i < n; i++) {
                                var T = zeros[i];
                                unfolded.push(T * Math.log(T / (2 * Math.PI)) / (2 * Math.PI));
                            }
                            return unfolded;
                        }

                        function draw() {
                            ctx.fillStyle = viz.colors.bg;
                            ctx.fillRect(0, 0, W, H);

                            ctx.fillStyle = viz.colors.white;
                            ctx.font = 'bold 14px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText('Zeta Zeros vs. GUE: Spacing Distribution', W/2, 22);

                            var zeros = zetaZerosRaw.slice(0, nZeros);
                            var unfolded = unfoldZeros(zeros);

                            // Compute spacings
                            var spacings = [];
                            for (var i = 0; i < unfolded.length - 1; i++) {
                                spacings.push(unfolded[i+1] - unfolded[i]);
                            }

                            // Histogram
                            var nbins = 14;
                            var maxS = 3.5;
                            var bins = new Array(nbins).fill(0);
                            for (var j = 0; j < spacings.length; j++) {
                                var bi = Math.floor(spacings[j] / maxS * nbins);
                                if (bi >= 0 && bi < nbins) bins[bi]++;
                            }
                            var maxBin = Math.max.apply(null, bins);

                            var margin = { l: 60, r: 30, t: 46, b: 60 };
                            var plotW = W - margin.l - margin.r;
                            var plotH = H - margin.t - margin.b;
                            var x0 = margin.l, y0 = margin.t;

                            // Axes
                            ctx.strokeStyle = viz.colors.axis;
                            ctx.lineWidth = 1.5;
                            ctx.beginPath();
                            ctx.moveTo(x0, y0); ctx.lineTo(x0, y0 + plotH); ctx.lineTo(x0 + plotW, y0 + plotH);
                            ctx.stroke();

                            // Axis labels
                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '11px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText('Normalized spacing s', x0 + plotW/2, y0 + plotH + 42);
                            ctx.save(); ctx.translate(16, y0 + plotH/2); ctx.rotate(-Math.PI/2);
                            ctx.fillText('Density', 0, 0);
                            ctx.restore();

                            // X ticks
                            for (var xt = 0; xt <= 3; xt++) {
                                var px = x0 + (xt / maxS) * plotW;
                                ctx.fillStyle = viz.colors.text;
                                ctx.font = '10px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.fillText(xt.toString(), px, y0 + plotH + 16);
                                ctx.strokeStyle = viz.colors.grid;
                                ctx.lineWidth = 0.5;
                                ctx.beginPath(); ctx.moveTo(px, y0); ctx.lineTo(px, y0 + plotH); ctx.stroke();
                            }

                            // Y ticks
                            var maxDensity = gueSpacingPDF(Math.sqrt(Math.PI / 8)) * 1.15;
                            for (var yt = 0; yt <= 4; yt++) {
                                var py = y0 + plotH - (yt / 4) * plotH;
                                var yval = (yt / 4) * maxDensity;
                                ctx.fillStyle = viz.colors.text;
                                ctx.font = '9px -apple-system,sans-serif';
                                ctx.textAlign = 'right';
                                ctx.fillText(yval.toFixed(2), x0 - 5, py + 3);
                                ctx.strokeStyle = viz.colors.grid;
                                ctx.lineWidth = 0.5;
                                ctx.beginPath(); ctx.moveTo(x0, py); ctx.lineTo(x0 + plotW, py); ctx.stroke();
                            }

                            // Histogram bars (zeta zeros)
                            var binWidth = maxS / nbins;
                            var totalSpacings = spacings.length;
                            for (var b = 0; b < nbins; b++) {
                                var bxL = x0 + (b * binWidth / maxS) * plotW;
                                var bxR = x0 + ((b + 1) * binWidth / maxS) * plotW;
                                var density = (bins[b] / totalSpacings) / binWidth;
                                var bh = (density / maxDensity) * plotH;
                                ctx.fillStyle = '#58a6ff44';
                                ctx.strokeStyle = '#58a6ff';
                                ctx.lineWidth = 1;
                                ctx.fillRect(bxL, y0 + plotH - bh, bxR - bxL - 1, bh);
                                ctx.strokeRect(bxL, y0 + plotH - bh, bxR - bxL - 1, bh);
                            }

                            // GUE curve
                            ctx.strokeStyle = '#f85149';
                            ctx.lineWidth = 2.5;
                            ctx.beginPath();
                            var started = false;
                            for (var ss = 0; ss <= 300; ss++) {
                                var s = ss / 300 * maxS;
                                var d = gueSpacingPDF(s);
                                var gx = x0 + (s / maxS) * plotW;
                                var gy = y0 + plotH - (d / maxDensity) * plotH;
                                if (!started) { ctx.moveTo(gx, gy); started = true; }
                                else ctx.lineTo(gx, gy);
                            }
                            ctx.stroke();

                            // Poisson curve (for comparison)
                            ctx.strokeStyle = '#d2992266';
                            ctx.lineWidth = 1.5;
                            ctx.setLineDash([4, 4]);
                            ctx.beginPath();
                            started = false;
                            for (var sp = 0; sp <= 300; sp++) {
                                var sv = sp / 300 * maxS;
                                var dp = Math.exp(-sv);
                                var gpx = x0 + (sv / maxS) * plotW;
                                var gpy = y0 + plotH - (dp / maxDensity) * plotH;
                                if (!started) { ctx.moveTo(gpx, gpy); started = true; }
                                else ctx.lineTo(gpx, gpy);
                            }
                            ctx.stroke();
                            ctx.setLineDash([]);

                            // Legend
                            var legX = x0 + plotW - 200, legY = y0 + 10;
                            ctx.font = '11px -apple-system,sans-serif';
                            ctx.textAlign = 'left';

                            ctx.fillStyle = '#58a6ff66';
                            ctx.fillRect(legX, legY, 18, 12);
                            ctx.strokeStyle = '#58a6ff';
                            ctx.lineWidth = 1;
                            ctx.strokeRect(legX, legY, 18, 12);
                            ctx.fillStyle = viz.colors.text;
                            ctx.fillText('Zeta zeros (n=' + nZeros + ')', legX + 22, legY + 10);

                            ctx.strokeStyle = '#f85149';
                            ctx.lineWidth = 2.5;
                            ctx.beginPath(); ctx.moveTo(legX, legY + 24); ctx.lineTo(legX + 18, legY + 24); ctx.stroke();
                            ctx.fillStyle = viz.colors.text;
                            ctx.fillText('GUE (Wigner surmise)', legX + 22, legY + 27);

                            ctx.strokeStyle = '#d2992266';
                            ctx.lineWidth = 1.5;
                            ctx.setLineDash([4,4]);
                            ctx.beginPath(); ctx.moveTo(legX, legY + 40); ctx.lineTo(legX + 18, legY + 40); ctx.stroke();
                            ctx.setLineDash([]);
                            ctx.fillStyle = viz.colors.text;
                            ctx.fillText('Poisson (uncorrelated)', legX + 22, legY + 43);

                            // Caption
                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '10px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText('The histogram of normalized zero spacings matches GUE (not Poisson), suggesting deep structure.', W/2, y0 + plotH + 56);
                        }

                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'The Montgomery-Dyson observation (1972) connects zeta zeros to random matrix theory. Montgomery computed the pair correlation function of zeta zeros and found it matches the GUE pair correlation. Freeman Dyson recognized the formula at a tea party. Write down the Montgomery pair correlation conjecture formally: what is \\(F(\\alpha)\\), and what does it predict for the number of pairs of zeros \\((\\gamma, \\gamma\')\\) with \\(\\gamma - \\gamma\' \\in [\\alpha, \\beta] \\cdot 2\\pi/\\log T\\)?',
                    hint: 'Montgomery\'s conjecture states that the pair correlation function r(u) = 1 - (sin(pi u)/(pi u))^2 for u not equal to 0.',
                    solution: 'Montgomery conjecture: the pair correlation of normalized zeros is r(u) = 1 - (sin(pi*u)/(pi*u))^2. More precisely, for 0 < alpha < beta, the number of pairs (gamma, gamma\') of distinct zeros with (gamma-gamma\') log(T)/(2*pi) in [alpha,beta] is asymptotically (T log T / (2*pi)) * integral_{alpha}^{beta} r(u) du. The function r(u) = 1-(sinc(u))^2 is exactly the pair correlation function of eigenvalues of a random N x N unitary matrix as N -> infinity (GUE). The Poisson prediction would give r(u) = 1 (no repulsion). The zeros are repelled from each other, matching random matrix statistics.'
                },
                {
                    question: 'List five consequences of the Riemann Hypothesis that would be immediately proved if RH were established tomorrow. For each, state what is currently known unconditionally and what gap RH would close.',
                    hint: 'Think about error terms in the PNT, gaps between primes, distribution of the Liouville function, and Robin\'s inequality.',
                    solution: '(1) |pi(x) - Li(x)| = O(sqrt(x) log x): Unconditionally, the error is O(x exp(-c sqrt(log x))); RH gives the square-root bound. (2) p_{n+1} - p_n = O(sqrt(p_n) log p_n): Unconditionally, gaps are O(p_n^{0.525}) (Baker-Harman-Pintz). (3) sigma(n) < e^gamma n log log n for all n > 5040: This is equivalent to RH (Robin 1984). (4) M(x) = O(x^{1/2+eps}): Unconditionally M(x) = O(x exp(-c sqrt(log x))). (5) The least prime in an arithmetic progression a mod q is O(q^2 log^2 q): Unconditionally it\'s O(q^{5.5+eps}) (Heath-Brown).'
                },
                {
                    question: 'Suppose you could only work on one open problem in analytic number theory for the next ten years. Which would you choose, and what approach would you try? Your answer should include: (a) what makes the problem attractive, (b) the main obstacle, (c) one new idea that might help, and (d) what a partial result would look like.',
                    hint: 'There is no single right answer. Consider the Riemann Hypothesis, twin primes, Goldbach, the Langlands program, short interval problems, or something from Ch 20.',
                    solution: 'An ideal answer identifies a specific problem, explains why existing methods fall short (e.g., parity problem for twin primes, lack of operator spectral interpretation for RH), proposes one concrete new direction (e.g., for RH: constructing a noncommutative space via Connes\'s approach; for twin primes: extending Maynard\'s multidimensional sieve with a new level-of-distribution result), and describes what a "5% of the way there" result would be (e.g., for Goldbach: showing every even n is a sum of p + q where q has at most 1.5 prime factors in some averaged sense).'
                }
            ]
        }
    ] // end sections
}); // end chapter push
