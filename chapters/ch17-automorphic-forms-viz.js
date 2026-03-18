window.EXTRA_VIZ = window.EXTRA_VIZ || {};
window.EXTRA_VIZ['ch17'] = {

    // ====================================================================
    // viz-modular-form-heatmap
    // |Delta(z)| on the upper half-plane using drawHeatmap
    // ====================================================================
    'viz-modular-form-heatmap': {
        title: 'Modular Form |Delta(z)| on the Upper Half-Plane',
        description: 'Heatmap of |Delta(z)| = |q prod(1-q^n)^24| on the upper half-plane, z = x+iy. Brighter colors indicate larger |Delta|. Observe: |Delta| -> 0 as Im(z) -> infinity (q -> 0), and the SL(2,Z) symmetry: |Delta(z+1)| = |Delta(z)| and |Delta(-1/z)| = |z|^12 |Delta(z)|.',
        setup: function(body, controls) {
            var viz = new VizEngine(body, {
                width: 560, height: 400,
                originX: 280, originY: 360, scale: 120
            });

            var colorMap = 'inferno';
            var truncN = 20; // number of terms in the product

            // Compute |Delta(z)| = |q| * prod |1 - q^n|^24
            // q = exp(2*pi*i*z), |q| = exp(-2*pi*y)
            function deltaAbs(x, y) {
                if (y <= 0.02) return 0;
                var qAbs = Math.exp(-2 * Math.PI * y);
                if (qAbs > 0.999) return 0; // avoid near-overflow
                var logVal = Math.log(qAbs); // log|q|
                // |Delta| = |q| * prod_{n=1}^infty |1 - q^n|^24
                // log|Delta| = log|q| + 24 * sum log|1 - q^n * e^{2pi i n x}|
                var logDelta = logVal;
                for (var n = 1; n <= truncN; n++) {
                    var qnAbs = Math.pow(qAbs, n);
                    if (qnAbs < 1e-10) break;
                    // |1 - q^n * e^{2pi i n x}|^2 = 1 - 2*q^n*cos(2pi*n*x) + q^{2n}
                    var angle = 2 * Math.PI * n * x;
                    var re = 1 - qnAbs * Math.cos(angle);
                    var im = -qnAbs * Math.sin(angle);
                    var modSq = re * re + im * im;
                    if (modSq < 1e-30) continue;
                    logDelta += 24 * 0.5 * Math.log(modSq);
                }
                var result = Math.exp(logDelta);
                return isFinite(result) ? result : 0;
            }

            var xRange = [-1.5, 1.5];
            var yRange = [0.02, 2.5];

            function draw() {
                viz.clear();
                // Render heatmap
                viz.drawHeatmap(function(x, y) {
                    return deltaAbs(x, y);
                }, xRange, yRange, colorMap);

                // Overlay: fundamental domain boundary
                var ctx = viz.ctx;
                // Convert from heatmap coords to screen
                function hmToScreen(x, y) {
                    var px = (x - xRange[0]) / (xRange[1] - xRange[0]) * viz.canvas.width / (window.devicePixelRatio||1);
                    var py = (1 - (y - yRange[0]) / (yRange[1] - yRange[0])) * viz.canvas.height / (window.devicePixelRatio||1);
                    return [px, py];
                }

                // Draw fundamental domain boundary
                ctx.strokeStyle = '#ffffff88';
                ctx.lineWidth = 2;

                // Left edge x = -0.5
                var steps = 60;
                ctx.beginPath();
                var [lx0, ly0] = hmToScreen(-0.5, Math.sqrt(3)/2);
                var [lx1, ly1] = hmToScreen(-0.5, yRange[1]);
                ctx.moveTo(lx0, ly0); ctx.lineTo(lx1, ly1); ctx.stroke();

                // Right edge x = 0.5
                ctx.beginPath();
                var [rx0, ry0] = hmToScreen(0.5, Math.sqrt(3)/2);
                var [rx1, ry1] = hmToScreen(0.5, yRange[1]);
                ctx.moveTo(rx0, ry0); ctx.lineTo(rx1, ry1); ctx.stroke();

                // Arc |z|=1, theta in [pi/3, 2pi/3]
                ctx.beginPath();
                for (var i = 0; i <= steps; i++) {
                    var theta = Math.PI/3 + (i/steps) * Math.PI/3;
                    var ax = Math.cos(theta), ay = Math.sin(theta);
                    var [asx, asy] = hmToScreen(ax, ay);
                    if (i === 0) ctx.moveTo(asx, asy); else ctx.lineTo(asx, asy);
                }
                ctx.stroke();

                // Labels
                ctx.fillStyle = '#ffffff';
                ctx.font = '12px -apple-system,sans-serif';
                ctx.textAlign = 'center';
                ctx.fillText('|\u0394(z)| on upper half-plane (truncated product, N=' + truncN + ')', viz.width/2, 18);
                ctx.fillText('|z|=1 arc', hmToScreen(0, 1.05)[0], hmToScreen(0, 1.05)[1]);
                ctx.fillStyle = '#cccccc';
                ctx.font = '11px sans-serif';
                ctx.textAlign = 'left';
                ctx.fillText('Re(z)', viz.width - 50, hmToScreen(0, yRange[0])[1] - 5);
                ctx.textAlign = 'center';
                ctx.fillText('Im(z)', hmToScreen(0, 2.3)[0] + 20, hmToScreen(0, 2.3)[1]);

                // y-axis tick labels
                ctx.fillStyle = '#aaaaaa';
                ctx.font = '10px sans-serif';
                ctx.textAlign = 'left';
                for (var y = 0.5; y <= 2.0; y += 0.5) {
                    var [, ysy] = hmToScreen(xRange[0], y);
                    ctx.fillText('y=' + y.toFixed(1), 4, ysy + 4);
                }
                // x-axis tick labels
                ctx.textAlign = 'center';
                for (var x = -1; x <= 1; x++) {
                    var [xsx] = hmToScreen(x, yRange[0]);
                    ctx.fillText(x, xsx, viz.height - 5);
                }
            }

            draw();

            var maps = ['inferno', 'viridis', 'coolwarm'];
            var btnRow = document.createElement('div');
            btnRow.style.cssText = 'display:flex;gap:8px;margin-top:4px;';
            controls.appendChild(btnRow);
            maps.forEach(function(m) {
                VizEngine.createButton(btnRow, m, function() {
                    colorMap = m;
                    draw();
                });
            });

            var truncSlider = VizEngine.createSlider(controls, 'Product terms N', 5, 40, truncN, 5, function(v) {
                truncN = Math.round(v);
                draw();
            });

            return viz;
        }
    },

    // ====================================================================
    // viz-langlands-map
    // Interactive node graph: objects in the Langlands correspondence
    // ====================================================================
    'viz-langlands-map': {
        title: 'The Langlands Correspondence: An Interactive Map',
        description: 'Drag nodes to explore the web of correspondences in the Langlands program. Click any node to see its description. Edges represent known or conjectured correspondences.',
        setup: function(body, controls) {
            var viz = new VizEngine(body, {
                width: 580, height: 430,
                originX: 290, originY: 215, scale: 1
            });

            // Nodes: { id, label, x, y, color, desc }
            var nodes = [
                { id: 'gl1-auto', label: 'GL\u2081 Automorphic\n(Hecke chars)', x: 100, y: 100,
                  color: '#58a6ff', desc: 'GL\u2081 automorphic representations = Hecke characters = Dirichlet characters (for Q). These are the simplest automorphic objects. L-function: Dirichlet L-function L(s, \u03c7).' },
                { id: 'gl2-holo', label: 'GL\u2082 Holomorphic\n(Modular forms)', x: 100, y: 215,
                  color: '#3fb9a0', desc: 'Holomorphic cuspidal automorphic representations of GL\u2082(A_Q) correspond to classical modular forms f of weight k \u2265 1. L-function: L(s, f) with Euler product.' },
                { id: 'gl2-maass', label: 'GL\u2082 Maass forms', x: 100, y: 330,
                  color: '#f0883e', desc: 'Non-holomorphic automorphic forms: smooth eigenfunctions of the Laplace-Beltrami operator on SL(2,Z)\u2005\\\u2005H. L-function has the same shape as holomorphic case but with different \u0393-factors.' },
                { id: 'gal-1', label: '1-dim Galois rep\n(\u03c1: Gal \u2192 C*)', x: 480, y: 100,
                  color: '#bc8cff', desc: '1-dimensional Galois representations factor through finite abelian groups (by Kronecker-Weber). They correspond exactly to Dirichlet characters. This is classical class field theory (proved).' },
                { id: 'gal-2', label: '2-dim Galois rep\n(\u03c1: Gal \u2192 GL\u2082(C))', x: 480, y: 215,
                  color: '#f85149', desc: '2-dimensional complex Galois representations conjecturally correspond to GL\u2082 automorphic forms. Proved for elliptic curves (Wiles-Taylor 1995) and many other cases. Open in full generality.' },
                { id: 'elliptic', label: 'Elliptic curves E/Q', x: 290, y: 330,
                  color: '#d29922', desc: 'Every elliptic curve E/Q has an L-function L(s, E). Modularity theorem (Wiles-Taylor-BCDT) says L(s,E) = L(s, f_E) for a weight-2 newform f_E. Key to BSD conjecture.' },
                { id: 'gln-auto', label: 'GL_n Automorphic\n(general)', x: 290, y: 100,
                  color: '#f778ba', desc: 'For general n, cuspidal automorphic representations of GL_n(A_Q) are the central objects of the Langlands program. Their L-functions are conjectured to equal all "motivic" L-functions via Langlands reciprocity.' },
                { id: 'mot', label: 'Motives / \u2113-adic\ncohomology', x: 480, y: 330,
                  color: '#3fb950', desc: 'Motives are a conjectural universal cohomology theory. \u2113-adic cohomology groups of algebraic varieties (e.g. elliptic curves) carry Galois representations. The Langlands program predicts all motivic L-functions are automorphic.' }
            ];

            // Edges: { from, to, label, status } status: 'proved'|'conjectural'|'partial'
            var edges = [
                { from: 'gl1-auto', to: 'gal-1', label: 'CFT', status: 'proved' },
                { from: 'gl2-holo', to: 'gal-2', label: 'Wiles-Taylor', status: 'partial' },
                { from: 'elliptic', to: 'gl2-holo', label: 'Modularity', status: 'proved' },
                { from: 'elliptic', to: 'gal-2', label: '\u2113-adic T_\u2113(E)', status: 'proved' },
                { from: 'gal-2', to: 'gl2-maass', label: 'Maass lift', status: 'conjectural' },
                { from: 'gln-auto', to: 'gl1-auto', label: 'n=1', status: 'proved' },
                { from: 'gln-auto', to: 'gl2-holo', label: 'n=2', status: 'partial' },
                { from: 'mot', to: 'gln-auto', label: 'Langlands', status: 'conjectural' },
                { from: 'mot', to: 'elliptic', label: 'H\xb9(E)', status: 'proved' }
            ];

            var selectedNode = null;
            var draggingNode = null;
            var dragOffX = 0, dragOffY = 0;

            function findNodeAt(mx, my) {
                for (var i = nodes.length - 1; i >= 0; i--) {
                    var n = nodes[i];
                    var dx = mx - n.x, dy = my - n.y;
                    if (Math.sqrt(dx*dx + dy*dy) < 38) return n;
                }
                return null;
            }

            function draw() {
                viz.clear();
                var ctx = viz.ctx;

                // Draw edges
                for (var i = 0; i < edges.length; i++) {
                    var e = edges[i];
                    var fn = nodes.find(function(n) { return n.id === e.from; });
                    var tn = nodes.find(function(n) { return n.id === e.to; });
                    if (!fn || !tn) continue;

                    ctx.strokeStyle = e.status === 'proved' ? '#3fb950' :
                                      e.status === 'partial' ? '#d29922' : '#555577';
                    ctx.lineWidth = e.status === 'proved' ? 2 : 1.5;
                    if (e.status === 'conjectural') ctx.setLineDash([5, 4]);
                    ctx.beginPath();
                    ctx.moveTo(fn.x, fn.y); ctx.lineTo(tn.x, tn.y);
                    ctx.stroke();
                    ctx.setLineDash([]);

                    // Edge label
                    var mx = (fn.x + tn.x)/2, my = (fn.y + tn.y)/2;
                    ctx.fillStyle = ctx.strokeStyle;
                    ctx.font = '9px -apple-system,sans-serif';
                    ctx.textAlign = 'center';
                    ctx.fillText(e.label, mx, my - 6);
                }

                // Draw nodes
                for (var j = 0; j < nodes.length; j++) {
                    var nd = nodes[j];
                    var isSelected = nd === selectedNode;

                    // Glow for selected
                    if (isSelected) {
                        ctx.shadowColor = nd.color;
                        ctx.shadowBlur = 18;
                    }

                    ctx.beginPath();
                    ctx.arc(nd.x, nd.y, 34, 0, Math.PI * 2);
                    ctx.fillStyle = nd.color + (isSelected ? 'cc' : '44');
                    ctx.fill();
                    ctx.strokeStyle = nd.color;
                    ctx.lineWidth = isSelected ? 2.5 : 1.5;
                    ctx.stroke();
                    ctx.shadowBlur = 0;

                    // Label (multi-line)
                    ctx.fillStyle = isSelected ? '#ffffff' : nd.color;
                    ctx.font = '10px -apple-system,sans-serif';
                    ctx.textAlign = 'center';
                    var lines = nd.label.split('\n');
                    var lineH = 13;
                    var startY = nd.y - (lines.length - 1) * lineH / 2;
                    for (var li = 0; li < lines.length; li++) {
                        ctx.fillText(lines[li], nd.x, startY + li * lineH);
                    }
                }

                // Description panel
                if (selectedNode) {
                    var panelY = 5, panelH = 55;
                    ctx.fillStyle = '#0c0c2099';
                    ctx.fillRect(0, panelY, viz.width, panelH);
                    ctx.strokeStyle = selectedNode.color;
                    ctx.lineWidth = 1;
                    ctx.strokeRect(0, panelY, viz.width, panelH);
                    ctx.fillStyle = selectedNode.color;
                    ctx.font = 'bold 11px -apple-system,sans-serif';
                    ctx.textAlign = 'left';
                    ctx.fillText(selectedNode.label.replace('\n', ' '), 8, panelY + 16);
                    ctx.fillStyle = '#c9d1d9';
                    ctx.font = '10px -apple-system,sans-serif';
                    // Wrap text
                    var words = selectedNode.desc.split(' ');
                    var line2 = '', lineArr = [];
                    for (var wi = 0; wi < words.length; wi++) {
                        var test = line2 + (line2 ? ' ' : '') + words[wi];
                        if (ctx.measureText(test).width > viz.width - 16) {
                            lineArr.push(line2); line2 = words[wi];
                        } else { line2 = test; }
                    }
                    if (line2) lineArr.push(line2);
                    for (var li2 = 0; li2 < Math.min(lineArr.length, 3); li2++) {
                        ctx.fillText(lineArr[li2], 8, panelY + 30 + li2 * 13);
                    }
                }

                // Legend
                var legY = viz.height - 22;
                ctx.font = '10px sans-serif'; ctx.textAlign = 'left';
                [[viz.colors.green, 'proved'], ['#d29922', 'partial'], ['#555577', 'conjectural']].forEach(function(item, i) {
                    ctx.strokeStyle = item[0]; ctx.lineWidth = 2;
                    if (i === 2) ctx.setLineDash([5,4]);
                    ctx.beginPath(); ctx.moveTo(10 + i * 130, legY); ctx.lineTo(36 + i * 130, legY); ctx.stroke();
                    ctx.setLineDash([]);
                    ctx.fillStyle = item[0];
                    ctx.fillText(item[1], 40 + i * 130, legY + 4);
                });
            }

            draw();

            // Mouse interactions
            var canvas = viz.canvas;
            canvas.addEventListener('mousedown', function(e) {
                var r = canvas.getBoundingClientRect();
                var mx = e.clientX - r.left, my = e.clientY - r.top;
                var nd = findNodeAt(mx, my);
                if (nd) {
                    selectedNode = nd;
                    draggingNode = nd;
                    dragOffX = mx - nd.x;
                    dragOffY = my - nd.y;
                } else {
                    selectedNode = null;
                }
                draw();
            });
            canvas.addEventListener('mousemove', function(e) {
                if (!draggingNode) return;
                var r = canvas.getBoundingClientRect();
                draggingNode.x = Math.max(40, Math.min(viz.width - 40, e.clientX - r.left - dragOffX));
                draggingNode.y = Math.max(40, Math.min(viz.height - 30, e.clientY - r.top - dragOffY));
                draw();
            });
            canvas.addEventListener('mouseup', function() { draggingNode = null; });
            canvas.addEventListener('mouseleave', function() { draggingNode = null; });

            // Touch
            canvas.addEventListener('touchstart', function(e) {
                var r = canvas.getBoundingClientRect();
                var mx = e.touches[0].clientX - r.left, my = e.touches[0].clientY - r.top;
                var nd = findNodeAt(mx, my);
                if (nd) { selectedNode = nd; draggingNode = nd; dragOffX = mx - nd.x; dragOffY = my - nd.y; }
                else selectedNode = null;
                draw(); e.preventDefault();
            }, { passive: false });
            canvas.addEventListener('touchmove', function(e) {
                if (!draggingNode) return;
                var r = canvas.getBoundingClientRect();
                draggingNode.x = Math.max(40, Math.min(viz.width - 40, e.touches[0].clientX - r.left - dragOffX));
                draggingNode.y = Math.max(40, Math.min(viz.height - 30, e.touches[0].clientY - r.top - dragOffY));
                draw(); e.preventDefault();
            }, { passive: false });
            canvas.addEventListener('touchend', function() { draggingNode = null; });

            // Reset button
            VizEngine.createButton(controls, 'Reset layout', function() {
                var defaults = [
                    { id: 'gl1-auto', x: 100, y: 100 }, { id: 'gl2-holo', x: 100, y: 215 },
                    { id: 'gl2-maass', x: 100, y: 330 }, { id: 'gal-1', x: 480, y: 100 },
                    { id: 'gal-2', x: 480, y: 215 }, { id: 'elliptic', x: 290, y: 330 },
                    { id: 'gln-auto', x: 290, y: 100 }, { id: 'mot', x: 480, y: 330 }
                ];
                defaults.forEach(function(d) {
                    var nd = nodes.find(function(n) { return n.id === d.id; });
                    if (nd) { nd.x = d.x; nd.y = d.y; }
                });
                selectedNode = null;
                draw();
            });

            return viz;
        }
    }

};
