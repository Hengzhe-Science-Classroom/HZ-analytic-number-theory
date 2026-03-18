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
    <div class="env-title">The View from the Summit</div>
    <div class="env-body">
        <p>Over the preceding twenty chapters we have climbed from Euclid's proof of infinitely many primes to the deepest reaches of analytic number theory: the Prime Number Theorem, zero-free regions, sieve methods, exponential sums, automorphic forms, bounded gaps, and computational verification. It is time to look outward, at the peaks that remain unconquered.</p>
    </div>
</div>

<p>Analytic number theory is unusual among mathematical disciplines in that its most famous open problems are simple to state, yet have resisted proof for centuries. The Riemann Hypothesis, the twin prime conjecture, Goldbach's conjecture, and the existence of infinitely many primes of special forms all fit on an index card, yet behind each lies an entire universe of structural insight.</p>

<p>This chapter surveys the central open problems, the progress made toward them, and the broader research program that connects them. Our goal is threefold:</p>
<ol>
    <li><strong>State precisely</strong> what remains unknown, distinguishing firm conjecture from vague hope.</li>
    <li><strong>Map the connections</strong> between problems: how the Riemann Hypothesis implies results about gaps between primes, how the Langlands program reframes classical questions, how random matrix theory provides astonishing numerical predictions.</li>
    <li><strong>Celebrate the recent advances</strong> that have brought us closer than ever: Zhang's bounded gaps, Helfgott's ternary Goldbach, and the Matomaki-Radziwill revolution in multiplicative functions.</li>
</ol>

<h3>A Web of Conjectures</h3>

<p>The open problems of analytic number theory do not stand in isolation. They form a densely connected web: progress on one often implies or is implied by progress on others. The Riemann Hypothesis implies the strongest known error term in the Prime Number Theorem. The Generalized Riemann Hypothesis (GRH) for Dirichlet \\(L\\)-functions implies the least quadratic non-residue is \\(O(\\log^2 p)\\). The Langlands program, if fully realized, would subsume the Artin conjecture and provide analytic continuation for a vast family of \\(L\\)-functions.</p>

<p>The visualization below shows this web of implications. Click on any node to highlight the conjectures it connects to.</p>

<div class="viz-placeholder" data-viz="viz-conjecture-web"></div>

<div class="env-block remark">
    <div class="env-title">What Does "Open" Mean?</div>
    <div class="env-body">
        <p>An open problem is one for which no proof or disproof is known. But the confidence levels vary enormously. The Riemann Hypothesis is supported by trillions of verified zeros and deep structural reasons; most experts believe it true. Goldbach's conjecture has been verified to \\(4 \\times 10^{18}\\) and has strong heuristic backing. By contrast, some problems (like the exact distribution of primes in very short intervals) remain genuinely uncertain in either direction.</p>
    </div>
</div>
`,
            visualizations: [
                {
                    id: 'viz-conjecture-web',
                    title: 'The Web of Conjectures',
                    description: 'An interactive graph showing how the major open problems and theorems of analytic number theory connect. Click a node to highlight its neighbors and the implications flowing from it.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 700, height: 480,
                            originX: 0, originY: 0, scale: 1
                        });

                        // Nodes: conjectures and major theorems
                        var nodes = [
                            {id: 'RH', label: 'Riemann\nHypothesis', x: 350, y: 100, color: viz.colors.red, r: 22},
                            {id: 'GRH', label: 'GRH', x: 520, y: 80, color: viz.colors.orange, r: 18},
                            {id: 'PNT', label: 'PNT\n(proved)', x: 180, y: 160, color: viz.colors.green, r: 16},
                            {id: 'Twin', label: 'Twin Prime\nConj.', x: 140, y: 300, color: viz.colors.blue, r: 18},
                            {id: 'Gold', label: "Goldbach's\nConj.", x: 300, y: 350, color: viz.colors.blue, r: 18},
                            {id: 'BG', label: 'Bounded\nGaps', x: 80, y: 220, color: viz.colors.teal, r: 16},
                            {id: 'Lang', label: 'Langlands\nProgram', x: 600, y: 200, color: viz.colors.purple, r: 20},
                            {id: 'Artin', label: 'Artin\nConj.', x: 620, y: 340, color: viz.colors.purple, r: 16},
                            {id: 'BSD', label: 'BSD\nConj.', x: 500, y: 400, color: viz.colors.pink, r: 16},
                            {id: 'RMT', label: 'Random\nMatrix', x: 450, y: 220, color: viz.colors.yellow, r: 16},
                            {id: 'LandP', label: "Landau's\nProblems", x: 220, y: 420, color: viz.colors.blue, r: 16},
                            {id: 'Vin', label: 'Vinogradov\n(proved)', x: 400, y: 420, color: viz.colors.green, r: 14},
                            {id: 'BV', label: 'Bombieri-\nVinogradov', x: 200, y: 80, color: viz.colors.teal, r: 14},
                            {id: 'EH', label: 'Elliott-\nHalberstam', x: 80, y: 120, color: viz.colors.orange, r: 14}
                        ];

                        // Edges: implications and connections
                        var edges = [
                            {from: 'RH', to: 'PNT', label: 'implies best error'},
                            {from: 'RH', to: 'Twin', label: ''},
                            {from: 'RH', to: 'Gold', label: ''},
                            {from: 'RH', to: 'RMT', label: 'GUE prediction'},
                            {from: 'GRH', to: 'RH', label: 'generalizes'},
                            {from: 'GRH', to: 'BV', label: 'implies'},
                            {from: 'Lang', to: 'Artin', label: 'subsumes'},
                            {from: 'Lang', to: 'GRH', label: 'motivates'},
                            {from: 'Lang', to: 'BSD', label: 'connects'},
                            {from: 'BG', to: 'Twin', label: 'toward'},
                            {from: 'EH', to: 'BG', label: 'strengthens'},
                            {from: 'Gold', to: 'Vin', label: 'odd case'},
                            {from: 'Gold', to: 'LandP', label: ''},
                            {from: 'Twin', to: 'LandP', label: ''},
                            {from: 'BV', to: 'BG', label: 'used in'}
                        ];

                        var selectedNode = null;

                        var nodeMap = {};
                        nodes.forEach(function(n) { nodeMap[n.id] = n; });

                        viz.canvas.addEventListener('click', function(e) {
                            var rect = viz.canvas.getBoundingClientRect();
                            var mx = e.clientX - rect.left;
                            var my = e.clientY - rect.top;
                            selectedNode = null;
                            for (var i = 0; i < nodes.length; i++) {
                                var n = nodes[i];
                                var dx = mx - n.x, dy = my - n.y;
                                if (dx * dx + dy * dy < (n.r + 8) * (n.r + 8)) {
                                    selectedNode = n.id;
                                    break;
                                }
                            }
                            draw();
                        });

                        function isConnected(nodeId) {
                            if (!selectedNode) return true;
                            if (nodeId === selectedNode) return true;
                            for (var i = 0; i < edges.length; i++) {
                                if ((edges[i].from === selectedNode && edges[i].to === nodeId) ||
                                    (edges[i].to === selectedNode && edges[i].from === nodeId)) return true;
                            }
                            return false;
                        }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            viz.screenText('The Web of Conjectures in Analytic Number Theory', viz.width / 2, 20, viz.colors.white, 14);

                            // Draw edges
                            for (var i = 0; i < edges.length; i++) {
                                var e = edges[i];
                                var a = nodeMap[e.from], b = nodeMap[e.to];
                                var active = !selectedNode || (e.from === selectedNode || e.to === selectedNode);
                                ctx.strokeStyle = active ? viz.colors.text : viz.colors.grid;
                                ctx.lineWidth = active ? 2 : 0.8;
                                ctx.beginPath();
                                ctx.moveTo(a.x, a.y);
                                ctx.lineTo(b.x, b.y);
                                ctx.stroke();
                                // Arrow head
                                if (active) {
                                    var dx = b.x - a.x, dy = b.y - a.y;
                                    var len = Math.sqrt(dx * dx + dy * dy);
                                    if (len > 0) {
                                        var ux = dx / len, uy = dy / len;
                                        var tx = b.x - ux * b.r, ty = b.y - uy * b.r;
                                        var angle = Math.atan2(dy, dx);
                                        ctx.fillStyle = viz.colors.text;
                                        ctx.beginPath();
                                        ctx.moveTo(tx, ty);
                                        ctx.lineTo(tx - 8 * Math.cos(angle - 0.4), ty - 8 * Math.sin(angle - 0.4));
                                        ctx.lineTo(tx - 8 * Math.cos(angle + 0.4), ty - 8 * Math.sin(angle + 0.4));
                                        ctx.closePath();
                                        ctx.fill();
                                    }
                                }
                                // Edge label
                                if (active && e.label) {
                                    var mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
                                    ctx.fillStyle = viz.colors.text;
                                    ctx.font = '9px -apple-system,sans-serif';
                                    ctx.textAlign = 'center';
                                    ctx.textBaseline = 'bottom';
                                    ctx.fillText(e.label, mx, my - 4);
                                }
                            }

                            // Draw nodes
                            for (var j = 0; j < nodes.length; j++) {
                                var n = nodes[j];
                                var connected = isConnected(n.id);
                                var alpha = connected ? 1 : 0.25;
                                ctx.globalAlpha = alpha;

                                // Glow for selected
                                if (n.id === selectedNode) {
                                    ctx.fillStyle = n.color + '44';
                                    ctx.beginPath();
                                    ctx.arc(n.x, n.y, n.r + 6, 0, Math.PI * 2);
                                    ctx.fill();
                                }

                                ctx.fillStyle = n.color;
                                ctx.beginPath();
                                ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
                                ctx.fill();

                                // Label
                                ctx.fillStyle = viz.colors.white;
                                ctx.font = 'bold 9px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.textBaseline = 'middle';
                                var lines = n.label.split('\n');
                                for (var l = 0; l < lines.length; l++) {
                                    ctx.fillText(lines[l], n.x, n.y + (l - (lines.length - 1) / 2) * 11);
                                }
                                ctx.globalAlpha = 1;
                            }

                            // Legend
                            var ly = viz.height - 20;
                            ctx.font = '10px -apple-system,sans-serif';
                            ctx.textAlign = 'left';
                            ctx.fillStyle = viz.colors.green;
                            ctx.fillRect(20, ly - 8, 10, 10);
                            ctx.fillText('Proved', 34, ly);
                            ctx.fillStyle = viz.colors.blue;
                            ctx.fillRect(90, ly - 8, 10, 10);
                            ctx.fillText('Conjecture', 104, ly);
                            ctx.fillStyle = viz.colors.purple;
                            ctx.fillRect(180, ly - 8, 10, 10);
                            ctx.fillText('Program', 194, ly);
                            ctx.fillStyle = viz.colors.text;
                            ctx.fillText('Click a node to highlight connections', 500, ly);
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Name three open problems in analytic number theory that can be stated without any notation beyond elementary arithmetic. For each, state the problem precisely and indicate the current status.',
                    hint: 'Think about Goldbach, twin primes, and primes of the form \\(n^2 + 1\\). All three involve only addition, multiplication, and the notion of primality.',
                    solution: '(1) <strong>Goldbach\'s conjecture:</strong> every even integer \\(n \\geq 4\\) is the sum of two primes. Verified to \\(4 \\times 10^{18}\\); the ternary version (odd \\(\\geq 7\\)) was proved by Helfgott (2013). (2) <strong>Twin prime conjecture:</strong> there are infinitely many primes \\(p\\) such that \\(p+2\\) is also prime. Zhang (2013) proved bounded gaps; the best known gap is 246 (Maynard-Tao polymath). (3) <strong>Are there infinitely many primes of the form \\(n^2 + 1\\)?</strong> Completely open; Iwaniec (1978) showed infinitely many \\(n^2+1\\) with at most two prime factors.'
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
    <div class="env-title">The Most Important Unsolved Problem</div>
    <div class="env-body">
        <p>If you had to bet on which single theorem, once proved, would most transform number theory, the answer would almost certainly be the Riemann Hypothesis. It stands as a Clay Millennium Problem, carries a \\$1 million prize, and has resisted 160+ years of sustained attack by the world's best mathematicians.</p>
    </div>
</div>

<h3>Statement</h3>

<div class="env-block theorem">
    <div class="env-title">Conjecture (Riemann Hypothesis, 1859)</div>
    <div class="env-body">
        <p>All non-trivial zeros of the Riemann zeta function \\(\\zeta(s)\\) lie on the critical line \\(\\operatorname{Re}(s) = \\tfrac{1}{2}\\).</p>
    </div>
</div>

<p>Recall from Chapters 4-5 that the Riemann zeta function \\(\\zeta(s) = \\sum_{n=1}^{\\infty} n^{-s}\\) for \\(\\operatorname{Re}(s) > 1\\) extends to a meromorphic function on all of \\(\\mathbb{C}\\) with a single simple pole at \\(s = 1\\). The <em>trivial zeros</em> are at \\(s = -2, -4, -6, \\ldots\\), arising from the functional equation. All other zeros (the non-trivial ones) are known to lie in the critical strip \\(0 < \\operatorname{Re}(s) < 1\\). The RH asserts they all satisfy \\(\\operatorname{Re}(s) = \\frac{1}{2}\\).</p>

<h3>Evidence</h3>

<p>The evidence for RH is overwhelming, though not a proof:</p>
<ul>
    <li><strong>Computational:</strong> Over \\(10^{13}\\) non-trivial zeros have been verified to lie on the critical line (Platt, 2021). Not a single counterexample has been found.</li>
    <li><strong>Hardy's theorem (1914):</strong> Infinitely many zeros lie on the critical line.</li>
    <li><strong>Selberg (1942):</strong> A positive proportion of zeros lie on the critical line.</li>
    <li><strong>Levinson (1974):</strong> At least \\(1/3\\) of zeros are on the line.</li>
    <li><strong>Conrey (1989):</strong> At least \\(2/5\\) of zeros are on the line.</li>
    <li><strong>Function field analogue:</strong> The RH is <em>proved</em> for zeta functions over finite fields (Weil, 1948; Deligne, 1974).</li>
</ul>

<h3>Equivalences</h3>

<p>The RH is equivalent to surprisingly many statements across mathematics:</p>

<div class="env-block theorem">
    <div class="env-title">Theorem 21.1 (Selected Equivalences of RH)</div>
    <div class="env-body">
        <p>The following are equivalent to the Riemann Hypothesis:</p>
        <ol>
            <li><strong>Prime counting:</strong> \\(\\pi(x) = \\operatorname{Li}(x) + O(\\sqrt{x}\\log x)\\).</li>
            <li><strong>Chebyshev's \\(\\psi\\):</strong> \\(\\psi(x) = x + O(\\sqrt{x}\\log^2 x)\\).</li>
            <li><strong>Mobius function:</strong> \\(\\sum_{n \\leq x} \\mu(n) = O(x^{1/2+\\varepsilon})\\) for every \\(\\varepsilon > 0\\).</li>
            <li><strong>Robin's inequality (1984):</strong> \\(\\sigma(n) < e^\\gamma n \\log\\log n\\) for all \\(n \\geq 5041\\), where \\(\\sigma(n) = \\sum_{d|n} d\\).</li>
            <li><strong>Lagarias (2002):</strong> \\(\\sigma(n) \\leq H_n + e^{H_n} \\log H_n\\) for all \\(n \\geq 1\\), where \\(H_n = \\sum_{k=1}^n 1/k\\).</li>
        </ol>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-rh-implications"></div>

<h3>The Generalized Riemann Hypothesis</h3>

<p>The GRH extends the assertion to all Dirichlet \\(L\\)-functions \\(L(s, \\chi)\\): their non-trivial zeros also lie on \\(\\operatorname{Re}(s) = \\frac{1}{2}\\). The GRH implies, among other things:</p>
<ul>
    <li>The least quadratic non-residue mod \\(p\\) is \\(O(\\log^2 p)\\).</li>
    <li>Miller's deterministic primality test runs in polynomial time.</li>
    <li>Strong forms of the Goldbach conjecture and Artin's conjecture on primitive roots.</li>
</ul>

<div class="env-block remark">
    <div class="env-title">Why Is It So Hard?</div>
    <div class="env-body">
        <p>The fundamental difficulty is that we have no method for controlling the real parts of zeros. The functional equation relates \\(\\zeta(s)\\) to \\(\\zeta(1-s)\\), giving the critical strip its symmetry about \\(\\operatorname{Re}(s) = 1/2\\). But symmetry alone does not force all zeros onto the line. The zero-free regions we established in Chapter 6 push the boundary slightly inward, but the gap between "no zeros with \\(\\operatorname{Re}(s) \\geq 1 - c/\\log t\\)" and "all zeros at \\(\\operatorname{Re}(s) = 1/2\\)" remains enormous.</p>
    </div>
</div>
`,
            visualizations: [
                {
                    id: 'viz-rh-implications',
                    title: 'The Cascade of RH Implications',
                    description: 'If the Riemann Hypothesis is true, a cascade of consequences follows. Click on any implication to see its statement.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 700, height: 440,
                            originX: 0, originY: 0, scale: 1
                        });

                        var items = [
                            {label: 'Riemann Hypothesis', x: 350, y: 40, w: 180, color: viz.colors.red,
                             desc: 'All non-trivial zeros of zeta(s) have Re(s) = 1/2'},
                            {label: 'Best PNT Error', x: 120, y: 120, w: 150, color: viz.colors.blue,
                             desc: 'pi(x) = Li(x) + O(sqrt(x) log x)'},
                            {label: 'Mobius Cancellation', x: 350, y: 120, w: 160, color: viz.colors.blue,
                             desc: 'Sum mu(n) for n<=x is O(x^(1/2+eps))'},
                            {label: 'Lindelof Hypothesis', x: 570, y: 120, w: 140, color: viz.colors.teal,
                             desc: 'zeta(1/2+it) = O(t^eps) for all eps>0'},
                            {label: 'Sharp Prime Gaps', x: 60, y: 220, w: 130, color: viz.colors.purple,
                             desc: 'Gaps: p_{n+1}-p_n = O(p_n^(1/2) log p_n)'},
                            {label: 'Robin\'s Inequality', x: 240, y: 220, w: 140, color: viz.colors.orange,
                             desc: 'sigma(n) < e^gamma n log log n for n >= 5041'},
                            {label: 'Explicit Formula\nPrecision', x: 440, y: 220, w: 140, color: viz.colors.blue,
                             desc: 'psi(x) = x - sum over zeros + small error'},
                            {label: 'Miller Primality\n(det. poly-time)', x: 620, y: 220, w: 130, color: viz.colors.teal,
                             desc: 'Deterministic primality in O(log^4 n)'},
                            {label: 'Optimal Sieve\nLimits', x: 150, y: 320, w: 130, color: viz.colors.purple,
                             desc: 'Sieve methods reach their theoretical limits'},
                            {label: 'Cryptographic\nBounds', x: 380, y: 320, w: 130, color: viz.colors.orange,
                             desc: 'Worst-case bounds for factoring and discrete log'},
                            {label: 'Distribution in\nArith. Progr.', x: 580, y: 320, w: 140, color: viz.colors.green,
                             desc: 'GRH: pi(x;q,a) ~ Li(x)/phi(q) with sqrt error'}
                        ];

                        var arrows = [
                            [0,1],[0,2],[0,3],[0,6],
                            [1,4],[2,5],[6,8],[3,7],
                            [6,9],[0,10]
                        ];

                        var selectedItem = -1;

                        viz.canvas.addEventListener('click', function(e) {
                            var rect = viz.canvas.getBoundingClientRect();
                            var mx = e.clientX - rect.left;
                            var my = e.clientY - rect.top;
                            selectedItem = -1;
                            for (var i = 0; i < items.length; i++) {
                                var it = items[i];
                                if (Math.abs(mx - it.x) < it.w / 2 + 5 && Math.abs(my - it.y) < 22) {
                                    selectedItem = i;
                                    break;
                                }
                            }
                            draw();
                        });

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            // Draw arrows
                            for (var i = 0; i < arrows.length; i++) {
                                var a = items[arrows[i][0]], b = items[arrows[i][1]];
                                var active = selectedItem < 0 || arrows[i][0] === selectedItem || arrows[i][1] === selectedItem;
                                ctx.strokeStyle = active ? viz.colors.text + 'aa' : viz.colors.grid;
                                ctx.lineWidth = active ? 1.5 : 0.7;
                                ctx.beginPath();
                                ctx.moveTo(a.x, a.y + 16);
                                ctx.lineTo(b.x, b.y - 16);
                                ctx.stroke();
                                // Arrowhead
                                if (active) {
                                    var dx = b.x - a.x, dy = (b.y - 16) - (a.y + 16);
                                    var ang = Math.atan2(dy, dx);
                                    var tx = b.x, ty = b.y - 16;
                                    ctx.fillStyle = viz.colors.text + 'aa';
                                    ctx.beginPath();
                                    ctx.moveTo(tx, ty);
                                    ctx.lineTo(tx - 7 * Math.cos(ang - 0.4), ty - 7 * Math.sin(ang - 0.4));
                                    ctx.lineTo(tx - 7 * Math.cos(ang + 0.4), ty - 7 * Math.sin(ang + 0.4));
                                    ctx.closePath();
                                    ctx.fill();
                                }
                            }

                            // Draw boxes
                            for (var j = 0; j < items.length; j++) {
                                var it = items[j];
                                var sel = (j === selectedItem);
                                var connected = selectedItem < 0 || j === selectedItem;
                                if (!connected) {
                                    for (var k = 0; k < arrows.length; k++) {
                                        if ((arrows[k][0] === selectedItem && arrows[k][1] === j) ||
                                            (arrows[k][1] === selectedItem && arrows[k][0] === j)) {
                                            connected = true; break;
                                        }
                                    }
                                }
                                ctx.globalAlpha = connected ? 1 : 0.3;
                                ctx.fillStyle = it.color + (sel ? '66' : '33');
                                ctx.strokeStyle = it.color;
                                ctx.lineWidth = sel ? 2 : 1;
                                var bx = it.x - it.w / 2, by = it.y - 14;
                                ctx.beginPath();
                                ctx.roundRect(bx, by, it.w, 28, 6);
                                ctx.fill();
                                ctx.stroke();

                                ctx.fillStyle = viz.colors.white;
                                ctx.font = (sel ? 'bold ' : '') + '10px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.textBaseline = 'middle';
                                var lines = it.label.split('\n');
                                for (var l = 0; l < lines.length; l++) {
                                    ctx.fillText(lines[l], it.x, it.y + (l - (lines.length - 1) / 2) * 12);
                                }
                                ctx.globalAlpha = 1;
                            }

                            // Description of selected
                            if (selectedItem >= 0) {
                                ctx.fillStyle = viz.colors.yellow;
                                ctx.font = '12px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.textBaseline = 'top';
                                ctx.fillText(items[selectedItem].desc, viz.width / 2, viz.height - 40);
                            } else {
                                ctx.fillStyle = viz.colors.text;
                                ctx.font = '11px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.fillText('Click any box to see its statement', viz.width / 2, viz.height - 30);
                            }
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Show that the Riemann Hypothesis implies \\(|\\pi(x) - \\operatorname{Li}(x)| \\leq C\\sqrt{x}\\log x\\) for some constant \\(C\\) and all \\(x \\geq 2\\). Start from the explicit formula \\(\\psi(x) = x - \\sum_{\\rho} x^\\rho / \\rho + O(\\log^2 x)\\).',
                    hint: 'If all \\(\\rho\\) satisfy \\(\\operatorname{Re}(\\rho) = 1/2\\), then \\(|x^\\rho| = x^{1/2}\\). Sum over \\(|1/\\rho|\\) using the density of zeros \\(N(T) \\sim T\\log T / (2\\pi)\\).',
                    solution: 'Under RH, each term \\(x^\\rho/\\rho\\) in the explicit formula satisfies \\(|x^\\rho/\\rho| \\leq x^{1/2}/|\\gamma|\\) where \\(\\rho = 1/2 + i\\gamma\\). The sum \\(\\sum_{|\\gamma| \\leq T} 1/|\\gamma| = O(\\log^2 T)\\) by partial summation and \\(N(T) = O(T \\log T)\\). Taking \\(T = x\\) and bounding the tail gives \\(\\psi(x) = x + O(x^{1/2} \\log^2 x)\\). The passage from \\(\\psi\\) to \\(\\pi\\) via partial summation introduces at most an extra \\(\\log x\\) factor, giving \\(\\pi(x) = \\operatorname{Li}(x) + O(\\sqrt{x}\\log x)\\).'
                },
                {
                    question: 'Verify Robin\'s inequality \\(\\sigma(n) < e^\\gamma n \\log\\log n\\) for \\(n = 5040\\) and \\(n = 5041\\). Why is 5040 the boundary?',
                    hint: 'Compute \\(\\sigma(5040)\\) by factoring \\(5040 = 2^4 \\cdot 3^2 \\cdot 5 \\cdot 7\\). The number 5040 is a "colossally abundant number" that maximizes \\(\\sigma(n)/(n \\log\\log n)\\).',
                    solution: '\\(5040 = 2^4 \\cdot 3^2 \\cdot 5 \\cdot 7\\), so \\(\\sigma(5040) = (1+2+4+8+16)(1+3+9)(1+5)(1+7) = 31 \\cdot 13 \\cdot 6 \\cdot 8 = 19344\\). We have \\(e^\\gamma \\cdot 5040 \\cdot \\log\\log 5040 \\approx 1.7811 \\cdot 5040 \\cdot 2.054 \\approx 18434\\). Since \\(19344 > 18434\\), Robin\'s inequality <em>fails</em> for \\(n = 5040\\). For \\(n = 5041\\) (which is prime), \\(\\sigma(5041) = 5042\\) and \\(e^\\gamma \\cdot 5041 \\cdot \\log\\log 5041 \\approx 18438\\), so the inequality holds. Robin proved (1984) that the inequality holds for all \\(n \\geq 5041\\) if and only if RH is true.'
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
    <div class="env-title">The 1912 Challenge</div>
    <div class="env-body">
        <p>At the 1912 International Congress of Mathematicians in Cambridge, Edmund Landau listed four problems about primes that he considered "unattackable at the present state of science." Over a century later, all four remain open. They concern the most basic questions about where primes appear among the integers.</p>
    </div>
</div>

<h3>The Four Problems</h3>

<div class="env-block definition">
    <div class="env-title">Landau's Problems (1912)</div>
    <div class="env-body">
        <ol>
            <li><strong>Goldbach's conjecture:</strong> Every even integer \\(n \\geq 4\\) is the sum of two primes.</li>
            <li><strong>Twin prime conjecture:</strong> There are infinitely many primes \\(p\\) such that \\(p + 2\\) is also prime.</li>
            <li><strong>Legendre's conjecture:</strong> There is always a prime between \\(n^2\\) and \\((n+1)^2\\).</li>
            <li><strong>Near-square primes:</strong> There are infinitely many primes of the form \\(n^2 + 1\\).</li>
        </ol>
    </div>
</div>

<h3>Current Status</h3>

<p>Although none of the four are solved, substantial progress has been made on each:</p>

<h4>1. Goldbach's Conjecture</h4>
<ul>
    <li><strong>Ternary Goldbach (Helfgott, 2013):</strong> Every odd integer \\(\\geq 7\\) is the sum of three primes. This was the last missing piece after Vinogradov's 1937 proof for sufficiently large odd integers.</li>
    <li><strong>Binary (even) Goldbach:</strong> Verified computationally to \\(4 \\times 10^{18}\\) (Oliveira e Silva, 2013). Chen's theorem (1966) shows every sufficiently large even number is \\(p + q\\) where \\(q\\) has at most 2 prime factors.</li>
    <li><strong>Density results:</strong> The set of even numbers not representable as two primes (if any exist) has density 0 (Montgomery-Vaughan, 1975).</li>
</ul>

<h4>2. Twin Prime Conjecture</h4>
<ul>
    <li><strong>Zhang (2013):</strong> There are infinitely many pairs of primes differing by at most \\(7 \\times 10^7\\).</li>
    <li><strong>Polymath8/Maynard-Tao (2014):</strong> The bound was reduced to 246. Under the Elliott-Halberstam conjecture, the bound drops to 6.</li>
    <li><strong>Brun (1919):</strong> The sum \\(\\sum_{p,p+2 \\text{ twin}} 1/p\\) converges (Brun's constant \\(\\approx 1.902\\)), so twin primes, if infinite, are sparse.</li>
</ul>

<h4>3. Legendre's Conjecture</h4>
<ul>
    <li><strong>Best unconditional result:</strong> There is a prime in \\([x, x + x^{0.525}]\\) for large \\(x\\) (Baker-Harman-Pintz, 2001). This is far from the \\([n^2, (n+1)^2]\\) interval of width \\(\\sim 2n\\).</li>
    <li><strong>Under RH:</strong> There is a prime in \\([x, x + C\\sqrt{x}\\log x]\\), which would suffice since \\((n+1)^2 - n^2 = 2n+1 \\sim 2\\sqrt{x}\\).</li>
</ul>

<h4>4. Primes of the Form \\(n^2 + 1\\)</h4>
<ul>
    <li><strong>Iwaniec (1978):</strong> There are infinitely many \\(n\\) such that \\(n^2 + 1\\) is the product of at most 2 primes.</li>
    <li><strong>Friedlander-Iwaniec (1998):</strong> There are infinitely many primes of the form \\(a^2 + b^4\\), a related but different problem.</li>
    <li>The fundamental obstruction is that sieve methods cannot distinguish primes from products of two primes (the "parity problem").</li>
</ul>

<div class="viz-placeholder" data-viz="viz-landau-status"></div>

<div class="env-block remark">
    <div class="env-title">The Parity Problem</div>
    <div class="env-body">
        <p>A recurring theme in the status of Landau's problems is the <strong>parity problem</strong> of sieve theory (Selberg, 1950s): combinatorial sieves cannot distinguish integers with an even number of prime factors from those with an odd number. This is why Chen's "\\(p + P_2\\)" result is close to the frontier of current methods but cannot be pushed to "\\(p + p\\)." Breaking the parity barrier is one of the deepest methodological challenges in analytic number theory.</p>
    </div>
</div>
`,
            visualizations: [
                {
                    id: 'viz-landau-status',
                    title: "Landau's Four Problems: Status Dashboard",
                    description: 'A traffic-light display showing the current status of each of Landau\'s four problems. Green = solved, yellow = substantial partial progress, red = wide open.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 700, height: 380,
                            originX: 0, originY: 0, scale: 1
                        });

                        var problems = [
                            {
                                name: "Goldbach's Conjecture",
                                status: 'yellow',
                                year: 1742,
                                best: 'Ternary case proved (Helfgott 2013)\nBinary: verified to 4x10^18\nChen: p + P2',
                                pct: 70
                            },
                            {
                                name: 'Twin Prime Conjecture',
                                status: 'yellow',
                                year: 1846,
                                best: 'Bounded gaps: 246 (Maynard-Tao 2014)\nGap=2 still open\nBrun: sum 1/p converges',
                                pct: 55
                            },
                            {
                                name: "Legendre's Conjecture",
                                status: 'red',
                                year: 1798,
                                best: 'Best: prime in [x, x+x^0.525]\n(Baker-Harman-Pintz 2001)\nNeed: [n^2, (n+1)^2]',
                                pct: 25
                            },
                            {
                                name: 'Primes n^2 + 1',
                                status: 'red',
                                year: 1912,
                                best: 'Iwaniec 1978: n^2+1 has <= 2 factors\nFriedlander-Iwaniec: primes a^2+b^4\nParity barrier blocks further progress',
                                pct: 20
                            }
                        ];

                        var statusColors = {green: viz.colors.green, yellow: viz.colors.yellow, red: viz.colors.red};

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var boxW = 150, boxH = 280;
                            var gap = 18;
                            var startX = (viz.width - (4 * boxW + 3 * gap)) / 2;
                            var startY = 50;

                            viz.screenText("Landau's Four Problems (1912): Status", viz.width / 2, 25, viz.colors.white, 15);

                            for (var i = 0; i < 4; i++) {
                                var p = problems[i];
                                var x = startX + i * (boxW + gap);
                                var y = startY;
                                var col = statusColors[p.status];

                                // Box background
                                ctx.fillStyle = '#151530';
                                ctx.strokeStyle = col;
                                ctx.lineWidth = 2;
                                ctx.beginPath();
                                ctx.roundRect(x, y, boxW, boxH, 8);
                                ctx.fill();
                                ctx.stroke();

                                // Traffic light
                                var lightR = 12;
                                var lightX = x + boxW / 2;
                                var lightY = y + 30;
                                // Red
                                ctx.fillStyle = p.status === 'red' ? viz.colors.red : '#331111';
                                ctx.beginPath(); ctx.arc(lightX - 28, lightY, lightR, 0, Math.PI * 2); ctx.fill();
                                // Yellow
                                ctx.fillStyle = p.status === 'yellow' ? viz.colors.yellow : '#332211';
                                ctx.beginPath(); ctx.arc(lightX, lightY, lightR, 0, Math.PI * 2); ctx.fill();
                                // Green
                                ctx.fillStyle = p.status === 'green' ? viz.colors.green : '#113311';
                                ctx.beginPath(); ctx.arc(lightX + 28, lightY, lightR, 0, Math.PI * 2); ctx.fill();

                                // Name
                                ctx.fillStyle = viz.colors.white;
                                ctx.font = 'bold 11px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.textBaseline = 'top';
                                var nameLines = p.name.split('\n');
                                for (var nl = 0; nl < nameLines.length; nl++) {
                                    ctx.fillText(nameLines[nl], x + boxW / 2, y + 55 + nl * 14);
                                }

                                // Year
                                ctx.fillStyle = viz.colors.text;
                                ctx.font = '10px -apple-system,sans-serif';
                                ctx.fillText('Since ' + p.year, x + boxW / 2, y + 80);

                                // Progress bar
                                var barY = y + 100;
                                var barW = boxW - 20;
                                ctx.fillStyle = '#1a1a40';
                                ctx.fillRect(x + 10, barY, barW, 10);
                                ctx.fillStyle = col + 'aa';
                                ctx.fillRect(x + 10, barY, barW * p.pct / 100, 10);
                                ctx.fillStyle = viz.colors.text;
                                ctx.font = '9px -apple-system,sans-serif';
                                ctx.fillText(p.pct + '% toward resolution', x + boxW / 2, barY + 22);

                                // Best results
                                ctx.fillStyle = viz.colors.text;
                                ctx.font = '9px -apple-system,sans-serif';
                                ctx.textAlign = 'left';
                                var bestLines = p.best.split('\n');
                                for (var bl = 0; bl < bestLines.length; bl++) {
                                    ctx.fillText(bestLines[bl], x + 8, barY + 42 + bl * 14);
                                }
                                ctx.textAlign = 'center';
                            }
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Verify Goldbach\'s conjecture for all even numbers from 4 to 30 by exhibiting explicit prime decompositions.',
                    hint: 'Just find one pair of primes summing to each even number. For example, \\(4 = 2 + 2\\).',
                    solution: '\\(4=2+2\\), \\(6=3+3\\), \\(8=3+5\\), \\(10=3+7=5+5\\), \\(12=5+7\\), \\(14=3+11=7+7\\), \\(16=3+13=5+11\\), \\(18=5+13=7+11\\), \\(20=3+17=7+13\\), \\(22=3+19=5+17\\), \\(24=5+19=7+17=11+13\\), \\(26=3+23=7+19\\), \\(28=5+23=11+17\\), \\(30=7+23=11+19=13+17\\).'
                },
                {
                    question: 'Explain why the parity problem prevents sieve methods from proving the twin prime conjecture. What property of the sieve weights causes this?',
                    hint: 'Consider the Selberg sieve: the weights \\(\\lambda_d\\) depend on the factorization structure but cannot detect whether the total number of prime factors is even or odd.',
                    solution: 'Sieve weights \\(\\lambda_d\\) are constructed to bound the sum \\(\\sum a_n S(n)\\) where \\(S\\) detects integers with no small prime factors. However, these weights satisfy a "dimension" constraint: in sieve dimension 1, upper and lower bounds differ by a factor roughly \\(e^{2\\gamma}/(2e^{2\\gamma}-1) \\approx 0.56\\). The sieve cannot distinguish \\(n\\) with an even number of prime factors from \\(n\\) with an odd number, because \\(\\mu(n)\\) (which encodes parity) has mean value 0 and the sieve weights cannot capture its oscillation. For twin primes, we need to detect that both \\(n\\) and \\(n+2\\) are prime (odd number of factors = 1), but the sieve treats "1 factor" and "2 factors" equally. This is Selberg\'s parity phenomenon.'
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
    <div class="env-title">A Grand Unified Theory</div>
    <div class="env-body">
        <p>If individual conjectures like RH are the peaks of analytic number theory, the Langlands program is the mountain range. Proposed by Robert Langlands in a 1967 letter to Andre Weil, it envisions a vast web of connections between number theory, representation theory, and geometry. It is sometimes called a "grand unified theory of mathematics."</p>
    </div>
</div>

<h3>The Core Idea</h3>

<p>At its heart, the Langlands program posits a correspondence between two seemingly unrelated worlds:</p>

<div class="env-block definition">
    <div class="env-title">The Langlands Correspondence (Informal)</div>
    <div class="env-body">
        <p><strong>Automorphic side:</strong> Automorphic representations of reductive groups over number fields (generalizing modular forms and Maass forms from Chapter 17).</p>
        <p><strong>Galois side:</strong> Representations of Galois groups (or more precisely, the conjectural Langlands group) of number fields.</p>
        <p>The correspondence asserts that to every Galois representation, there corresponds an automorphic representation with the same \\(L\\)-function, and vice versa.</p>
    </div>
</div>

<p>The \\(L\\)-function is the bridge: both sides produce Dirichlet series with Euler products, and the conjecture says these series match.</p>

<h3>Known Cases</h3>

<p>The full Langlands program is far from proved, but several landmark cases are established:</p>

<div class="env-block theorem">
    <div class="env-title">Theorem 21.2 (Selected Proved Cases)</div>
    <div class="env-body">
        <ol>
            <li><strong>GL(1) case:</strong> Class field theory (Artin, Takagi, 1920s). This is the abelian case of the Langlands correspondence.</li>
            <li><strong>GL(2) over \\(\\mathbb{Q}\\):</strong> The modularity theorem (Wiles 1995, Breuil-Conrad-Diamond-Taylor 2001): every elliptic curve over \\(\\mathbb{Q}\\) is modular. This famously implied Fermat's Last Theorem.</li>
            <li><strong>Function field case:</strong> The geometric Langlands correspondence for GL(n) over function fields (Drinfeld for GL(2), Lafforgue for GL(n), 2002 Fields Medal).</li>
            <li><strong>Sato-Tate conjecture:</strong> Proved for elliptic curves over \\(\\mathbb{Q}\\) with non-CM (Barnet-Lamb, Geraghty, Harris, Taylor, 2011).</li>
        </ol>
    </div>
</div>

<h3>Implications for Analytic Number Theory</h3>

<p>Why should a student of analytic number theory care about the Langlands program?</p>
<ul>
    <li><strong>Analytic continuation of \\(L\\)-functions:</strong> The program predicts that all "motivic" \\(L\\)-functions have analytic continuation and functional equation. This is prerequisite to even stating a GRH for them.</li>
    <li><strong>Artin's conjecture:</strong> The Langlands program for GL(n) implies that all Artin \\(L\\)-functions are entire (the Artin conjecture), which in turn has consequences for the distribution of primes in number fields.</li>
    <li><strong>Functoriality:</strong> Langlands functoriality would give new cases of the Ramanujan conjecture, new subconvexity bounds, and new equidistribution results.</li>
    <li><strong>Reciprocity and primes:</strong> At the deepest level, the program explains <em>why</em> primes behave the way they do in arithmetic progressions, in number fields, and in polynomial values.</li>
</ul>

<div class="env-block remark">
    <div class="env-title">Frenkel's Rosetta Stone</div>
    <div class="env-body">
        <p>Edward Frenkel's metaphor of a "Rosetta Stone" captures the program well: just as the Rosetta Stone allowed translation between three scripts, the Langlands program provides a dictionary between number theory, geometry, and mathematical physics. Results proved in one column can be translated to make predictions in another.</p>
    </div>
</div>
`,
            visualizations: [],
            exercises: [
                {
                    question: 'Explain how the modularity theorem (Wiles 1995) is a special case of the Langlands correspondence, and how it implies Fermat\'s Last Theorem.',
                    hint: 'The modularity theorem says every elliptic curve over \\(\\mathbb{Q}\\) is associated to a weight-2 newform. Ribet (1986) showed that a counterexample to FLT would give a non-modular elliptic curve.',
                    solution: 'An elliptic curve \\(E/\\mathbb{Q}\\) has a Galois representation \\(\\rho_E: \\mathrm{Gal}(\\overline{\\mathbb{Q}}/\\mathbb{Q}) \\to \\mathrm{GL}_2(\\mathbb{Z}_\\ell)\\) on its Tate module. The Langlands correspondence for \\(\\mathrm{GL}(2)\\) over \\(\\mathbb{Q}\\) predicts this representation corresponds to an automorphic form of weight 2 and level \\(N\\) (the conductor of \\(E\\)). This is exactly the modularity theorem. Frey (1986) observed that a solution \\(a^p + b^p = c^p\\) would produce the curve \\(y^2 = x(x-a^p)(x+b^p)\\) with strange properties (semistable, conductor involving extreme prime powers). Ribet proved this curve cannot be modular. Therefore, modularity + Ribet = no counterexample to FLT.'
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
    <div class="env-title">A Golden Age</div>
    <div class="env-body">
        <p>The period from 2013 to the present has been one of the most productive in the history of analytic number theory. Several problems that had been stuck for decades (or centuries) saw dramatic progress. We survey the three most important breakthroughs.</p>
    </div>
</div>

<h3>1. Zhang, Maynard, and Tao: Bounded Gaps Between Primes</h3>

<p>In May 2013, Yitang Zhang proved that there are infinitely many pairs of primes differing by at most \\(7 \\times 10^7\\). This was the first finite bound on gaps between primes, resolving a question open since at least de Polignac (1849).</p>

<p>Zhang's proof combined three ingredients:</p>
<ol>
    <li>The Goldston-Pintz-Yildirim (GPY) method from Chapter 19, which reduces bounded gaps to establishing sufficient equidistribution of primes in arithmetic progressions.</li>
    <li>A modification of the Bombieri-Vinogradov theorem (Chapter 13) that establishes equidistribution for "smooth" moduli beyond the \\(\\sqrt{x}\\) barrier.</li>
    <li>Deligne's proof of the Riemann Hypothesis for varieties over finite fields, used to bound incomplete exponential sums.</li>
</ol>

<p>Within months, James Maynard (independently) and Terence Tao (via the Polymath8 project) gave a simpler proof using a different sieve weight, reducing the gap to <strong>246</strong>. Maynard's method also showed: for any \\(m\\), there are infinitely many clusters of \\(m\\) primes within a bounded interval.</p>

<div class="viz-placeholder" data-viz="viz-progress-timeline"></div>

<h3>2. Helfgott: The Ternary Goldbach Conjecture</h3>

<p>In 2013, Harald Helfgott proved that every odd integer \\(\\geq 7\\) is the sum of three primes. Vinogradov (1937) had proved this for all sufficiently large odd integers; the remaining gap required a massive computational verification combined with refined exponential sum estimates.</p>

<p>Helfgott's proof combined:</p>
<ul>
    <li>Sharper bounds on exponential sums over primes (improving on Vinogradov's estimates).</li>
    <li>A careful computational verification of the result for odd integers up to \\(\\sim 10^{30}\\).</li>
    <li>An explicit version of the circle method (Chapter 15) with fully effective error terms.</li>
</ul>

<h3>3. Matomaki and Radziwill: Multiplicative Functions in Short Intervals</h3>

<p>In 2016, Kaisa Matomaki and Maksym Radziwill proved that multiplicative functions (like \\(\\mu(n)\\) and \\(\\lambda(n)\\)) exhibit cancellation in almost all short intervals. This breakthrough, entirely unexpected before their work, resolved a conjecture of Sarnak and opened new avenues in multiplicative number theory.</p>

<div class="env-block theorem">
    <div class="env-title">Theorem 21.3 (Matomaki-Radziwill, 2016)</div>
    <div class="env-body">
        <p>Let \\(f:\\mathbb{N} \\to [-1,1]\\) be a multiplicative function. Then for any \\(H = H(X) \\to \\infty\\) (however slowly),</p>
        \\[\\frac{1}{X} \\int_X^{2X} \\left| \\frac{1}{H} \\sum_{x < n \\leq x+H} f(n) \\right|^2 \\, dx = o(1).\\]
        <p>In words: in almost all intervals \\([x, x+H]\\), the partial sums of \\(f\\) exhibit cancellation.</p>
    </div>
</div>

<p>The Matomaki-Radziwill theorem has been applied to:</p>
<ul>
    <li>Prove the Erdos discrepancy conjecture (Tao, 2016, using Matomaki-Radziwill as a key ingredient).</li>
    <li>Establish Chowla's conjecture on average (Tao, 2016).</li>
    <li>Prove new results on sign changes of \\(\\mu(n)\\) and \\(\\lambda(n)\\) in short intervals.</li>
</ul>

<div class="viz-placeholder" data-viz="viz-gue-final"></div>
`,
            visualizations: [
                {
                    id: 'viz-progress-timeline',
                    title: 'Timeline of Major Results (1737 - 2025)',
                    description: 'An interactive timeline showing the major milestones in analytic number theory, from Euler\'s product formula to the latest breakthroughs. Hover over an event to see details.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 700, height: 420,
                            originX: 0, originY: 0, scale: 1
                        });

                        var events = [
                            {year: 1737, label: 'Euler product', desc: 'Euler proves product formula for zeta', color: viz.colors.blue},
                            {year: 1798, label: 'Legendre PNT conj.', desc: 'Legendre conjectures pi(x) ~ x/ln(x)', color: viz.colors.teal},
                            {year: 1837, label: 'Dirichlet', desc: 'Primes in arithmetic progressions', color: viz.colors.blue},
                            {year: 1859, label: 'Riemann memoir', desc: 'Analytic continuation, functional eqn, RH', color: viz.colors.red},
                            {year: 1896, label: 'PNT proved', desc: 'Hadamard & de la Vallee Poussin', color: viz.colors.green},
                            {year: 1914, label: 'Hardy', desc: 'Infinitely many zeros on critical line', color: viz.colors.orange},
                            {year: 1919, label: 'Brun', desc: 'Brun sieve; sum 1/p_twin converges', color: viz.colors.teal},
                            {year: 1937, label: 'Vinogradov', desc: 'Ternary Goldbach for large odd numbers', color: viz.colors.purple},
                            {year: 1948, label: 'Weil (RH for curves)', desc: 'RH proved for zeta over finite fields', color: viz.colors.green},
                            {year: 1949, label: 'Selberg-Erdos', desc: 'Elementary proof of PNT', color: viz.colors.blue},
                            {year: 1965, label: 'Bombieri-Vinogradov', desc: 'Primes well-distributed on average', color: viz.colors.teal},
                            {year: 1966, label: 'Chen', desc: 'Every large even = p + P2', color: viz.colors.orange},
                            {year: 1974, label: 'Deligne', desc: 'Weil conjectures (RH for varieties)', color: viz.colors.green},
                            {year: 1989, label: 'Conrey', desc: '40% of zeta zeros on critical line', color: viz.colors.orange},
                            {year: 1995, label: 'Wiles', desc: 'Modularity theorem, Fermat proved', color: viz.colors.green},
                            {year: 2004, label: 'Green-Tao', desc: 'Primes contain arb. long arith. progr.', color: viz.colors.green},
                            {year: 2013, label: 'Zhang', desc: 'Bounded gaps between primes', color: viz.colors.green},
                            {year: 2013, label: 'Helfgott', desc: 'Ternary Goldbach fully proved', color: viz.colors.green},
                            {year: 2014, label: 'Maynard-Tao', desc: 'Gap reduced to 246', color: viz.colors.green},
                            {year: 2016, label: 'Matomaki-Radziwill', desc: 'Mult. functions in short intervals', color: viz.colors.green},
                            {year: 2019, label: 'Koymans-Pagano', desc: 'Density results on class groups', color: viz.colors.teal}
                        ];

                        var hoveredIdx = -1;
                        var scrollOffset = 0;

                        VizEngine.createSlider(controls, 'Scroll', 0, 100, 0, 1, function(v) {
                            scrollOffset = v / 100;
                            draw();
                        });

                        viz.canvas.addEventListener('mousemove', function(e) {
                            var rect = viz.canvas.getBoundingClientRect();
                            var mx = e.clientX - rect.left;
                            var my = e.clientY - rect.top;
                            hoveredIdx = -1;
                            for (var i = 0; i < events.length; i++) {
                                var ev = events[i];
                                if (ev._sx !== undefined && Math.abs(mx - ev._sx) < 20 && Math.abs(my - ev._sy) < 12) {
                                    hoveredIdx = i;
                                    break;
                                }
                            }
                            draw();
                        });

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            var timelineY = 200;
                            var minYear = 1730, maxYear = 2030;
                            var viewSpan = 300;
                            var viewStart = minYear + scrollOffset * (maxYear - minYear - viewSpan);
                            var viewEnd = viewStart + viewSpan;

                            // Timeline axis
                            ctx.strokeStyle = viz.colors.axis;
                            ctx.lineWidth = 2;
                            ctx.beginPath();
                            ctx.moveTo(40, timelineY);
                            ctx.lineTo(viz.width - 40, timelineY);
                            ctx.stroke();

                            // Year ticks
                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '10px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'top';
                            var tickStep = viewSpan > 200 ? 50 : 25;
                            for (var yr = Math.ceil(viewStart / tickStep) * tickStep; yr <= viewEnd; yr += tickStep) {
                                var tx = 40 + (yr - viewStart) / (viewEnd - viewStart) * (viz.width - 80);
                                ctx.strokeStyle = viz.colors.grid;
                                ctx.lineWidth = 0.5;
                                ctx.beginPath();
                                ctx.moveTo(tx, timelineY - 5);
                                ctx.lineTo(tx, timelineY + 5);
                                ctx.stroke();
                                ctx.fillText(yr.toString(), tx, timelineY + 8);
                            }

                            // Events
                            var placed = [];
                            for (var i = 0; i < events.length; i++) {
                                var ev = events[i];
                                if (ev.year < viewStart - 5 || ev.year > viewEnd + 5) {
                                    ev._sx = -100; ev._sy = -100;
                                    continue;
                                }
                                var sx = 40 + (ev.year - viewStart) / (viewEnd - viewStart) * (viz.width - 80);
                                // Alternate above/below, with stacking to avoid overlap
                                var above = (i % 2 === 0);
                                var baseY = above ? timelineY - 30 : timelineY + 30;
                                // Offset if too close to previous
                                for (var j = 0; j < placed.length; j++) {
                                    if (Math.abs(sx - placed[j].x) < 55 && Math.abs(baseY - placed[j].y) < 25) {
                                        baseY += above ? -25 : 25;
                                    }
                                }
                                placed.push({x: sx, y: baseY});
                                ev._sx = sx;
                                ev._sy = baseY;

                                // Stem
                                ctx.strokeStyle = ev.color + '88';
                                ctx.lineWidth = 1;
                                ctx.beginPath();
                                ctx.moveTo(sx, timelineY);
                                ctx.lineTo(sx, baseY);
                                ctx.stroke();

                                // Dot
                                var isHovered = (i === hoveredIdx);
                                ctx.fillStyle = ev.color;
                                ctx.beginPath();
                                ctx.arc(sx, baseY, isHovered ? 7 : 5, 0, Math.PI * 2);
                                ctx.fill();

                                // Label
                                ctx.fillStyle = isHovered ? viz.colors.white : ev.color;
                                ctx.font = (isHovered ? 'bold ' : '') + '9px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.textBaseline = above ? 'bottom' : 'top';
                                ctx.fillText(ev.label, sx, baseY + (above ? -8 : 8));
                                ctx.fillStyle = viz.colors.text;
                                ctx.font = '8px -apple-system,sans-serif';
                                ctx.fillText(ev.year.toString(), sx, baseY + (above ? -20 : 20));
                            }

                            // Hover detail
                            if (hoveredIdx >= 0) {
                                var he = events[hoveredIdx];
                                ctx.fillStyle = '#151530ee';
                                var descW = ctx.measureText(he.desc).width + 20;
                                var descX = Math.max(10, Math.min(viz.width - descW - 10, he._sx - descW / 2));
                                ctx.fillRect(descX, viz.height - 60, descW, 30);
                                ctx.strokeStyle = he.color;
                                ctx.lineWidth = 1;
                                ctx.strokeRect(descX, viz.height - 60, descW, 30);
                                ctx.fillStyle = viz.colors.white;
                                ctx.font = '11px -apple-system,sans-serif';
                                ctx.textAlign = 'left';
                                ctx.textBaseline = 'middle';
                                ctx.fillText(he.desc, descX + 10, viz.height - 45);
                            }

                            viz.screenText('Major Results in Analytic Number Theory', viz.width / 2, 15, viz.colors.white, 14);
                        }
                        draw();
                        return viz;
                    }
                },
                {
                    id: 'viz-gue-final',
                    title: 'Capstone: Zeta Zeros vs. GUE Random Matrices',
                    description: 'The grand mystery: the spacings between zeros of the Riemann zeta function on the critical line match the eigenvalue spacings of large random unitary matrices (GUE). This visualization compares the two distributions.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 700, height: 420,
                            originX: 70, originY: 360, scale: 1
                        });

                        // GUE surmise: p(s) = (32/pi^2) s^2 exp(-4 s^2/pi)
                        function gueSpacing(s) {
                            return (32 / (Math.PI * Math.PI)) * s * s * Math.exp(-4 * s * s / Math.PI);
                        }

                        // Poisson for comparison: p(s) = exp(-s)
                        function poissonSpacing(s) {
                            return Math.exp(-s);
                        }

                        // Simulated zero spacing data (normalized, based on known distributions)
                        // These approximate the histogram of actual zeta zero spacings
                        var nBins = 40;
                        var binW = 0.1;
                        var zetaHist = [];
                        // Generate from GUE with small noise to simulate zeta data
                        function generateZetaHist() {
                            zetaHist = [];
                            var rng = function(seed) {
                                return function() {
                                    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
                                    return seed / 0x7fffffff;
                                };
                            };
                            var rand = rng(42);
                            // Rejection sampling from GUE + small perturbation
                            var samples = [];
                            var maxP = 0.7;
                            while (samples.length < 5000) {
                                var s = rand() * 4;
                                var p = gueSpacing(s);
                                if (rand() * maxP < p) {
                                    samples.push(s + (rand() - 0.5) * 0.02);
                                }
                            }
                            for (var b = 0; b < nBins; b++) {
                                var lo = b * binW, hi = (b + 1) * binW;
                                var count = 0;
                                for (var j = 0; j < samples.length; j++) {
                                    if (samples[j] >= lo && samples[j] < hi) count++;
                                }
                                zetaHist.push(count / samples.length / binW);
                            }
                        }
                        generateZetaHist();

                        var showPoisson = false;
                        VizEngine.createButton(controls, 'Toggle Poisson', function() {
                            showPoisson = !showPoisson;
                            draw();
                        });

                        VizEngine.createButton(controls, 'Resample', function() {
                            generateZetaHist();
                            draw();
                        });

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var w = viz.width, h = viz.height;
                            var plotL = 70, plotR = w - 30, plotT = 50, plotB = 360;
                            var plotW = plotR - plotL, plotH = plotB - plotT;

                            viz.screenText('Zeta Zero Spacings vs. GUE Prediction', w / 2, 20, viz.colors.white, 14);

                            // Axes
                            ctx.strokeStyle = viz.colors.axis;
                            ctx.lineWidth = 1.5;
                            ctx.beginPath();
                            ctx.moveTo(plotL, plotB);
                            ctx.lineTo(plotR, plotB);
                            ctx.stroke();
                            ctx.beginPath();
                            ctx.moveTo(plotL, plotB);
                            ctx.lineTo(plotL, plotT);
                            ctx.stroke();

                            // Axis labels
                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '11px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'top';
                            ctx.fillText('Normalized spacing s', (plotL + plotR) / 2, plotB + 15);
                            ctx.save();
                            ctx.translate(15, (plotT + plotB) / 2);
                            ctx.rotate(-Math.PI / 2);
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'middle';
                            ctx.fillText('Density p(s)', 0, 0);
                            ctx.restore();

                            var maxS = 4;
                            var maxY = 0.75;

                            // X ticks
                            for (var xt = 0; xt <= maxS; xt += 0.5) {
                                var xx = plotL + (xt / maxS) * plotW;
                                ctx.strokeStyle = viz.colors.grid;
                                ctx.lineWidth = 0.5;
                                ctx.beginPath();
                                ctx.moveTo(xx, plotB);
                                ctx.lineTo(xx, plotT);
                                ctx.stroke();
                                ctx.fillStyle = viz.colors.text;
                                ctx.font = '9px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.textBaseline = 'top';
                                ctx.fillText(xt.toFixed(1), xx, plotB + 3);
                            }

                            // Y ticks
                            for (var yt = 0; yt <= maxY; yt += 0.1) {
                                var yy = plotB - (yt / maxY) * plotH;
                                ctx.strokeStyle = viz.colors.grid;
                                ctx.lineWidth = 0.5;
                                ctx.beginPath();
                                ctx.moveTo(plotL, yy);
                                ctx.lineTo(plotR, yy);
                                ctx.stroke();
                                ctx.fillStyle = viz.colors.text;
                                ctx.font = '9px -apple-system,sans-serif';
                                ctx.textAlign = 'right';
                                ctx.textBaseline = 'middle';
                                ctx.fillText(yt.toFixed(1), plotL - 5, yy);
                            }

                            // Histogram (zeta zero data)
                            for (var b = 0; b < nBins; b++) {
                                var s0 = b * binW;
                                var val = zetaHist[b];
                                var bx = plotL + (s0 / maxS) * plotW;
                                var bw = (binW / maxS) * plotW;
                                var bh = Math.min((val / maxY) * plotH, plotH);
                                ctx.fillStyle = viz.colors.blue + '66';
                                ctx.fillRect(bx, plotB - bh, bw, bh);
                                ctx.strokeStyle = viz.colors.blue;
                                ctx.lineWidth = 0.5;
                                ctx.strokeRect(bx, plotB - bh, bw, bh);
                            }

                            // GUE curve
                            ctx.strokeStyle = viz.colors.red;
                            ctx.lineWidth = 2.5;
                            ctx.beginPath();
                            for (var i = 0; i <= 200; i++) {
                                var s = (i / 200) * maxS;
                                var px = plotL + (s / maxS) * plotW;
                                var py = plotB - (gueSpacing(s) / maxY) * plotH;
                                if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
                            }
                            ctx.stroke();

                            // Poisson curve
                            if (showPoisson) {
                                ctx.strokeStyle = viz.colors.yellow;
                                ctx.lineWidth = 2;
                                ctx.setLineDash([6, 4]);
                                ctx.beginPath();
                                for (var i2 = 0; i2 <= 200; i2++) {
                                    var s2 = (i2 / 200) * maxS;
                                    var px2 = plotL + (s2 / maxS) * plotW;
                                    var py2 = plotB - (poissonSpacing(s2) / maxY) * plotH;
                                    if (i2 === 0) ctx.moveTo(px2, py2); else ctx.lineTo(px2, py2);
                                }
                                ctx.stroke();
                                ctx.setLineDash([]);
                            }

                            // Legend
                            var legY = plotT + 10;
                            ctx.font = '10px -apple-system,sans-serif';
                            ctx.textAlign = 'left';
                            ctx.fillStyle = viz.colors.blue;
                            ctx.fillRect(plotR - 180, legY, 12, 12);
                            ctx.fillText('Zeta zero spacings', plotR - 164, legY + 10);
                            ctx.fillStyle = viz.colors.red;
                            ctx.fillRect(plotR - 180, legY + 18, 12, 12);
                            ctx.fillText('GUE prediction', plotR - 164, legY + 28);
                            if (showPoisson) {
                                ctx.fillStyle = viz.colors.yellow;
                                ctx.fillRect(plotR - 180, legY + 36, 12, 12);
                                ctx.fillText('Poisson (random)', plotR - 164, legY + 46);
                            }

                            // Annotation
                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '10px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText('The agreement is extraordinary and unexplained.', w / 2, plotB + 40);
                            ctx.fillText('Montgomery (1973), Odlyzko (1987)', w / 2, plotB + 54);
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Zhang\'s theorem states \\(\\liminf_{n \\to \\infty} (p_{n+1} - p_n) \\leq 7 \\times 10^7\\). The current best bound is 246. Explain why the twin prime conjecture is equivalent to \\(\\liminf_{n \\to \\infty} (p_{n+1} - p_n) = 2\\). What would it take to reduce 246 to 2?',
                    hint: 'The gap 246 comes from an admissible \\(k\\)-tuple. To reach gap 2, one needs \\(\\{0, 2\\}\\) which is admissible, but the method needs the moduli to reach \\(x^{1/2+\\varepsilon}\\) in the equidistribution theorem.',
                    solution: 'The twin prime conjecture says \\(p_{n+1} - p_n = 2\\) infinitely often, which is exactly \\(\\liminf(p_{n+1}-p_n) \\leq 2\\). Since consecutive primes differ by at least 2 (except the pair 2,3), this gives equality at 2. The Maynard-Tao method selects a "dense" admissible tuple \\(\\mathcal{H} = \\{h_1, \\ldots, h_k\\}\\) and proves \\(\\geq 2\\) of \\(n + h_i\\) are simultaneously prime for infinitely many \\(n\\). The gap achieved is \\(\\max(\\mathcal{H}) - \\min(\\mathcal{H})\\). The smallest admissible tuple with \\(k = 105\\) elements (needed for the sieve to work) has diameter 246. To reach gap 2, one needs \\(k = 2\\) with \\(\\{0, 2\\}\\), which requires the Elliott-Halberstam conjecture at level \\(\\theta > 1/2\\) (full EH gives gap 6 with \\(\\{0, 2, 6\\}\\) or \\(\\{0, 4, 6\\}\\); gap 2 needs an even stronger input).'
                },
                {
                    question: 'The GUE distribution predicts level repulsion: the probability of finding two zeros very close together is proportional to \\(s^2\\) for small \\(s\\). How does this compare to Poisson (random, independent) spacings? What does this tell us about the structure of the primes?',
                    hint: 'For Poisson, \\(p(s) = e^{-s}\\), so \\(p(0) = 1\\). For GUE, \\(p(0) = 0\\). The zeros "repel" each other, just like eigenvalues of a random matrix.',
                    solution: 'Poisson spacings have \\(p(s) = e^{-s}\\), with \\(p(0) = 1\\): zero-distance events are the most likely. This describes uncorrelated points. GUE spacings have \\(p(s) \\sim (32/\\pi^2) s^2\\) near \\(s = 0\\): small spacings are suppressed quadratically. This "level repulsion" means the zeros behave as if they interact, pushing each other apart. Since the zeros of \\(\\zeta(s)\\) encode the distribution of primes via the explicit formula, this repulsion translates to regularities in prime distribution. The primes are "more regular" than random, precisely because the zeros exhibit GUE statistics rather than Poisson.'
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
    <div class="env-title">Coda</div>
    <div class="env-body">
        <p>We have reached the end of this course, but not the end of the story. Analytic number theory is, and always has been, an unfinished symphony: each new theorem reveals new questions, each solved problem opens doors to deeper mysteries.</p>
    </div>
</div>

<h3>What Makes Analytic Number Theory Beautiful</h3>

<p>At the start of this course (Chapter 0), we witnessed the drama of the primes: their irregular distribution, their refusal to follow simple patterns, their deep connections to analysis. Twenty-one chapters later, we can articulate more precisely what makes this subject extraordinary:</p>

<ol>
    <li><strong>The unreasonable effectiveness of analysis.</strong> The primes are discrete objects, yet the most powerful tools for understanding them are continuous: complex analysis, Fourier analysis, probability. The zeta function, a creature of the complex plane, encodes the primes through its zeros. This bridge between the discrete and the continuous is one of the deepest ideas in mathematics.</li>

    <li><strong>The universality of \\(L\\)-functions.</strong> From Riemann's \\(\\zeta(s)\\) to Dirichlet's \\(L(s,\\chi)\\) to the \\(L\\)-functions attached to modular forms, elliptic curves, and automorphic representations, the same analytic structure recurs. Euler products, functional equations, zero distributions, explicit formulas: these are the recurring motifs of the symphony.</li>

    <li><strong>The dialogue between computation and theory.</strong> Analytic number theory has always been a subject where computation and proof interact deeply. Riemann computed zeros of \\(\\zeta(s)\\) by hand. Odlyzko computed millions of zeros to discover GUE statistics. Helfgott combined explicit estimates with massive computation to close the ternary Goldbach problem. The computational and theoretical strands are inseparable.</li>

    <li><strong>The human story.</strong> From Euler and Gauss, through Riemann and Hadamard, to Selberg, Bombieri, Zhang, and Matomaki, the subject has been shaped by individuals of extraordinary insight. Zhang's story, in particular, of a mathematician working in obscurity for decades before producing a breakthrough, is one of the most inspiring in modern mathematics.</li>
</ol>

<div class="viz-placeholder" data-viz="viz-open-gallery"></div>

<h3>An Invitation to Research</h3>

<p>The problems surveyed in this chapter are not merely historical curiosities. They are active research directions where progress is being made right now. A student finishing this course has the background to engage with current literature on:</p>

<ul>
    <li><strong>Sieve methods:</strong> New sieve weights and combinatorial identities continue to push the boundaries of what can be proved about primes.</li>
    <li><strong>Automorphic forms:</strong> The Langlands program is advancing rapidly, with new cases of functoriality and reciprocity being proved each year.</li>
    <li><strong>Computational number theory:</strong> Algorithms for verifying RH, computing \\(L\\)-function values, and testing conjectures are becoming ever more powerful.</li>
    <li><strong>Probabilistic methods:</strong> The connection between random matrix theory and \\(L\\)-functions remains largely conjectural, wide open for new ideas.</li>
    <li><strong>Additive combinatorics:</strong> The Green-Tao theorem and its extensions connect additive combinatorics to prime distribution in ways that are still being explored.</li>
</ul>

<div class="env-block remark">
    <div class="env-title">A Final Thought</div>
    <div class="env-body">
        <p>David Hilbert reportedly said, "If I were to awaken after having slept for a thousand years, my first question would be: Has the Riemann Hypothesis been proved?" The fact that this question remains open, after more than 160 years, is not a failure but an invitation. The deepest truths about the primes are still waiting to be discovered. The symphony plays on.</p>
    </div>
</div>
`,
            visualizations: [
                {
                    id: 'viz-open-gallery',
                    title: 'Gallery of Open Problems',
                    description: 'Browse the major open problems of analytic number theory. Click on any problem to see its precise statement, current status, and connections to other areas.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 700, height: 450,
                            originX: 0, originY: 0, scale: 1
                        });

                        var problems = [
                            {
                                name: 'Riemann Hypothesis',
                                status: 'Open since 1859',
                                statement: 'All non-trivial zeros of zeta(s) have Re(s) = 1/2',
                                progress: 'Over 10^13 zeros verified; 40%+ proved on line',
                                color: viz.colors.red
                            },
                            {
                                name: 'Goldbach (Binary)',
                                status: 'Open since 1742',
                                statement: 'Every even n >= 4 is a sum of two primes',
                                progress: 'Verified to 4x10^18; ternary case proved',
                                color: viz.colors.orange
                            },
                            {
                                name: 'Twin Primes',
                                status: 'Open since antiquity',
                                statement: 'Infinitely many p with p+2 prime',
                                progress: 'Bounded gaps: gap <= 246 (Maynard-Tao)',
                                color: viz.colors.blue
                            },
                            {
                                name: 'Lindelof Hypothesis',
                                status: 'Open (implied by RH)',
                                statement: 'zeta(1/2 + it) = O(t^epsilon) for all epsilon > 0',
                                progress: 'Best: O(t^{13/84}) by Bourgain (2017)',
                                color: viz.colors.teal
                            },
                            {
                                name: 'Artin Conjecture',
                                status: 'Open since 1927',
                                statement: 'Any non-trivial Artin L-function is entire',
                                progress: 'Known for GL(1), some GL(2) cases via Langlands',
                                color: viz.colors.purple
                            },
                            {
                                name: 'Chowla Conjecture',
                                status: 'Open since 1965',
                                statement: 'lambda(n)lambda(n+1) has mean 0',
                                progress: 'Proved on average (Tao); logarithmic version proved',
                                color: viz.colors.yellow
                            },
                            {
                                name: 'Primes n^2 + 1',
                                status: 'Open since 1912',
                                statement: 'Infinitely many primes of the form n^2 + 1',
                                progress: 'n^2+1 has at most 2 prime factors (Iwaniec)',
                                color: viz.colors.pink
                            },
                            {
                                name: 'Katz-Sarnak Symmetry',
                                status: 'Conjectural',
                                statement: 'L-function zero stats match random matrix ensembles',
                                progress: 'Proved for function fields; number field evidence strong',
                                color: viz.colors.green
                            }
                        ];

                        var selectedIdx = -1;

                        viz.canvas.addEventListener('click', function(e) {
                            var rect = viz.canvas.getBoundingClientRect();
                            var mx = e.clientX - rect.left;
                            var my = e.clientY - rect.top;
                            selectedIdx = -1;
                            for (var i = 0; i < problems.length; i++) {
                                var p = problems[i];
                                if (p._bx !== undefined &&
                                    mx >= p._bx && mx <= p._bx + p._bw &&
                                    my >= p._by && my <= p._by + p._bh) {
                                    selectedIdx = i;
                                    break;
                                }
                            }
                            draw();
                        });

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            viz.screenText('Gallery of Open Problems', viz.width / 2, 20, viz.colors.white, 15);

                            // Grid layout: 4x2
                            var cols = 4, rows = 2;
                            var cardW = 155, cardH = 90;
                            var gapX = 12, gapY = 12;
                            var gridW = cols * cardW + (cols - 1) * gapX;
                            var gridStartX = (viz.width - gridW) / 2;
                            var gridStartY = 45;

                            for (var i = 0; i < problems.length; i++) {
                                var p = problems[i];
                                var col = i % cols, row = Math.floor(i / cols);
                                var cx = gridStartX + col * (cardW + gapX);
                                var cy = gridStartY + row * (cardH + gapY);
                                p._bx = cx; p._by = cy; p._bw = cardW; p._bh = cardH;

                                var sel = (i === selectedIdx);

                                // Card
                                ctx.fillStyle = sel ? p.color + '33' : '#151530';
                                ctx.strokeStyle = p.color;
                                ctx.lineWidth = sel ? 2.5 : 1;
                                ctx.beginPath();
                                ctx.roundRect(cx, cy, cardW, cardH, 6);
                                ctx.fill();
                                ctx.stroke();

                                // Color bar
                                ctx.fillStyle = p.color;
                                ctx.fillRect(cx, cy, 4, cardH);

                                // Name
                                ctx.fillStyle = viz.colors.white;
                                ctx.font = 'bold 10px -apple-system,sans-serif';
                                ctx.textAlign = 'left';
                                ctx.textBaseline = 'top';
                                ctx.fillText(p.name, cx + 10, cy + 8);

                                // Status
                                ctx.fillStyle = p.color;
                                ctx.font = '8px -apple-system,sans-serif';
                                ctx.fillText(p.status, cx + 10, cy + 24);

                                // Brief statement
                                ctx.fillStyle = viz.colors.text;
                                ctx.font = '8px -apple-system,sans-serif';
                                var words = p.statement.split(' ');
                                var line = '', lineY = cy + 42;
                                for (var w = 0; w < words.length; w++) {
                                    var test = line + (line ? ' ' : '') + words[w];
                                    if (ctx.measureText(test).width > cardW - 16) {
                                        ctx.fillText(line, cx + 10, lineY);
                                        lineY += 12;
                                        line = words[w];
                                    } else {
                                        line = test;
                                    }
                                }
                                if (line) ctx.fillText(line, cx + 10, lineY);
                            }

                            // Detail panel for selected
                            if (selectedIdx >= 0) {
                                var sp = problems[selectedIdx];
                                var panelY = gridStartY + rows * (cardH + gapY) + 15;
                                ctx.fillStyle = '#151530';
                                ctx.strokeStyle = sp.color;
                                ctx.lineWidth = 1.5;
                                ctx.beginPath();
                                ctx.roundRect(gridStartX, panelY, gridW, 130, 8);
                                ctx.fill();
                                ctx.stroke();

                                ctx.fillStyle = sp.color;
                                ctx.font = 'bold 13px -apple-system,sans-serif';
                                ctx.textAlign = 'left';
                                ctx.textBaseline = 'top';
                                ctx.fillText(sp.name, gridStartX + 15, panelY + 10);

                                ctx.fillStyle = viz.colors.white;
                                ctx.font = '11px -apple-system,sans-serif';
                                ctx.fillText('Statement: ' + sp.statement, gridStartX + 15, panelY + 35);

                                ctx.fillStyle = viz.colors.teal;
                                ctx.fillText('Progress: ' + sp.progress, gridStartX + 15, panelY + 58);

                                ctx.fillStyle = viz.colors.text;
                                ctx.fillText(sp.status, gridStartX + 15, panelY + 80);
                            } else {
                                var hintY = gridStartY + rows * (cardH + gapY) + 20;
                                ctx.fillStyle = viz.colors.text;
                                ctx.font = '11px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.fillText('Click a problem card to see details', viz.width / 2, hintY);
                            }
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'List the chapters of this course that are most relevant to each of the following open problems: (a) the Riemann Hypothesis, (b) bounded gaps between primes, (c) the Langlands program. For each, describe one specific tool from that chapter that is used.',
                    hint: 'Think about which chapters developed the specific machinery used in each problem area.',
                    solution: '(a) <strong>RH:</strong> Ch 4 (Riemann zeta function, Euler product), Ch 5 (analytic continuation, functional equation), Ch 6 (zero-free regions, de la Vallee Poussin), Ch 8 (explicit formula connecting zeros to primes). Tool: the explicit formula \\(\\psi(x) = x - \\sum_\\rho x^\\rho/\\rho\\). (b) <strong>Bounded gaps:</strong> Ch 12 (Selberg sieve), Ch 13 (Bombieri-Vinogradov equidistribution), Ch 19 (GPY method, Maynard-Tao sieve weights). Tool: the Bombieri-Vinogradov theorem providing equidistribution of primes in progressions on average. (c) <strong>Langlands program:</strong> Ch 9 (Dirichlet characters as GL(1) case), Ch 10 (L(1,chi) and non-vanishing), Ch 17 (automorphic forms, Hecke theory). Tool: the theory of newforms and their L-functions from Ch 17.'
                },
                {
                    question: '(Essay) Choose one open problem from this chapter and write a 500-word essay explaining: (1) why the problem is important, (2) what the main obstacle to solving it is, and (3) what approach you find most promising. You may draw on any material from the course.',
                    hint: 'There is no single correct answer. The goal is to synthesize material from multiple chapters and articulate a coherent perspective.',
                    solution: 'This is an open-ended essay question. A strong response will (1) clearly state the chosen problem with precise mathematical formulation, (2) connect the obstacle to specific tools and limitations covered in the course (e.g., the parity problem for twin primes, the lack of a spectral interpretation for RH, the functoriality conjecture for Langlands), and (3) articulate why a specific approach (random matrix theory, new sieve methods, automorphic techniques, computational methods) might lead to progress, with reference to recent results discussed in this chapter.'
                },
                {
                    question: 'The Montgomery-Odlyzko law says the pair correlation of zeta zeros matches GUE. State the pair correlation conjecture precisely and explain its implications for gaps between primes.',
                    hint: 'The pair correlation function \\(R_2(\\alpha) = 1 - (\\sin \\pi \\alpha / \\pi \\alpha)^2\\) predicts how often two zeros are found at a given distance apart.',
                    solution: 'Montgomery (1973) conjectured that for the normalized zeros \\(\\tilde{\\gamma}_n\\) of \\(\\zeta(s)\\) (normalized to have mean spacing 1), the pair correlation function is \\(R_2(\\alpha) = 1 - \\left(\\frac{\\sin \\pi \\alpha}{\\pi \\alpha}\\right)^2\\), which is exactly the GUE pair correlation. This means: (1) Level repulsion: \\(R_2(0) = 0\\), so nearby zeros repel. (2) For the primes: via the explicit formula, the zeros control the oscillations in \\(\\pi(x)\\). Repulsion between zeros means their contributions to \\(\\psi(x) - x\\) tend to cancel rather than constructively interfere, which implies the prime counting function is "smoother" than a random model would predict. (3) Quantitatively, the pair correlation controls the variance of \\(\\pi(x)\\) in short intervals and implies strong results on the distribution of primes in intervals \\([x, x+h]\\).'
                }
            ]
        }
    ]
});
