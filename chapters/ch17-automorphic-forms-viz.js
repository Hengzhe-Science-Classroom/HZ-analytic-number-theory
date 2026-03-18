// === Ch17 Automorphic Forms: Extra Visualizations ===
window.EXTRA_VIZ = window.EXTRA_VIZ || {};
window.EXTRA_VIZ['ch17'] = {
    // ================================================================
    // sec-modular-forms: Heatmap of a modular form on H
    // ================================================================
    'sec-modular-forms': [
        {
            id: 'viz-modular-form-heatmap',
            title: 'Modular Form Heatmap on the Upper Half-Plane',
            description: 'Visualize |f(z)| for Eisenstein series and the Delta function on a region of the upper half-plane. Bright regions indicate large values. The cusp form Delta vanishes at the cusp (large y), while Eisenstein series approach 1.',
            setup: function(body, controls) {
                var viz = new VizEngine(body, {
                    width: 560, height: 380,
                    originX: 0, originY: 0, scale: 1
                });

                var formChoice = 0; // 0 = |E_4|, 1 = |Delta|
                var yMaxVal = 2.0;

                VizEngine.createButton(controls, 'E\u2084', function() {
                    formChoice = 0;
                    draw();
                });
                VizEngine.createButton(controls, '\u0394', function() {
                    formChoice = 1;
                    draw();
                });
                VizEngine.createSlider(controls, 'y-range', 0.5, 3.0, yMaxVal, 0.5, function(v) {
                    yMaxVal = v;
                    draw();
                });

                // Compute E_4 approximation using q-expansion
                // E_4(z) = 1 + 240 * sum sigma_3(n) q^n
                function sigma3(n) {
                    var s = 0;
                    for (var d = 1; d * d <= n; d++) {
                        if (n % d === 0) {
                            s += d * d * d;
                            if (d !== n / d) s += (n / d) * (n / d) * (n / d);
                        }
                    }
                    return s;
                }

                // Precompute sigma3
                var maxTerms = 30;
                var sig3 = new Float64Array(maxTerms + 1);
                for (var n = 1; n <= maxTerms; n++) {
                    sig3[n] = sigma3(n);
                }

                function evalE4(x, y) {
                    // q = e^{2 pi i z} = e^{2 pi i x} * e^{-2 pi y}
                    var qabs = Math.exp(-2 * Math.PI * y);
                    if (qabs > 0.99) return NaN; // too close to real axis
                    var re = 1, im = 0;
                    for (var n = 1; n <= maxTerms; n++) {
                        var qn = Math.pow(qabs, n);
                        if (qn < 1e-15) break;
                        var angle = 2 * Math.PI * n * x;
                        re += 240 * sig3[n] * qn * Math.cos(angle);
                        im += 240 * sig3[n] * qn * Math.sin(angle);
                    }
                    return Math.sqrt(re * re + im * im);
                }

                // Delta via tau coefficients (precomputed small)
                var tauVals = [0, 1, -24, 252, -1472, 4830, -6048, -16744, 84480, -113643, -115920,
                    534612, -370944, -577738, 401856, 1217160, 987136, -6905934,
                    2727432, 10661420, -7109760, -4219488, -12830688, 18643272,
                    21288960, -25499225, 13865712, -73279080, 24647168, 128406630];

                function evalDelta(x, y) {
                    var qabs = Math.exp(-2 * Math.PI * y);
                    if (qabs > 0.99) return NaN;
                    var re = 0, im = 0;
                    var limit = Math.min(tauVals.length, maxTerms);
                    for (var n = 1; n < limit; n++) {
                        var qn = Math.pow(qabs, n);
                        if (qn < 1e-15) break;
                        var angle = 2 * Math.PI * n * x;
                        re += tauVals[n] * qn * Math.cos(angle);
                        im += tauVals[n] * qn * Math.sin(angle);
                    }
                    return Math.sqrt(re * re + im * im);
                }

                function draw() {
                    var ctx = viz.ctx;
                    var pw = viz.canvas.width, ph = viz.canvas.height;
                    var dpr = window.devicePixelRatio || 1;

                    var xRange = [-1.5, 1.5];
                    var yRange = [0.05, yMaxVal];

                    var evalFn = (formChoice === 0) ? evalE4 : evalDelta;

                    // Sample at lower resolution for performance
                    var step = 2;
                    var vMin = Infinity, vMax = -Infinity;
                    var values = [];

                    for (var py = 0; py < ph; py += step) {
                        for (var px = 0; px < pw; px += step) {
                            var xv = xRange[0] + (xRange[1] - xRange[0]) * px / pw;
                            var yv = yRange[1] - (yRange[1] - yRange[0]) * py / ph;
                            if (yv <= 0.02) { values.push(NaN); continue; }
                            var v = evalFn(xv, yv);
                            values.push(v);
                            if (isFinite(v)) {
                                vMin = Math.min(vMin, v);
                                vMax = Math.max(vMax, v);
                            }
                        }
                    }

                    // Use log scale for better visibility
                    var logMin = Math.log(Math.max(vMin, 1e-20));
                    var logMax = Math.log(Math.max(vMax, 1e-10));
                    var logRange = logMax - logMin || 1;

                    ctx.save();
                    ctx.setTransform(1, 0, 0, 1, 0, 0);
                    var imgData = ctx.createImageData(pw, ph);
                    var data = imgData.data;

                    var cols = Math.ceil(pw / step);
                    for (var py = 0; py < ph; py++) {
                        for (var px = 0; px < pw; px++) {
                            var si = Math.floor(py / step) * cols + Math.floor(px / step);
                            var val = values[si];
                            var idx = (py * pw + px) * 4;
                            if (!isFinite(val) || val <= 0) {
                                data[idx] = 12; data[idx + 1] = 12; data[idx + 2] = 32; data[idx + 3] = 255;
                                continue;
                            }
                            var t = Math.max(0, Math.min(1, (Math.log(val) - logMin) / logRange));
                            var rgb = VizEngine.colormapSample(t, 'inferno');
                            data[idx] = rgb[0]; data[idx + 1] = rgb[1]; data[idx + 2] = rgb[2]; data[idx + 3] = 255;
                        }
                    }
                    ctx.putImageData(imgData, 0, 0);
                    ctx.restore();

                    // Overlay: fundamental domain outline
                    var toSx = function(x) { return (x - xRange[0]) / (xRange[1] - xRange[0]) * (pw / dpr); };
                    var toSy = function(y) { return (yRange[1] - y) / (yRange[1] - yRange[0]) * (ph / dpr); };

                    ctx.strokeStyle = '#ffffff88';
                    ctx.lineWidth = 1.5;
                    ctx.setLineDash([4, 3]);

                    // Vertical edges
                    ctx.beginPath();
                    ctx.moveTo(toSx(-0.5), toSy(yMaxVal));
                    ctx.lineTo(toSx(-0.5), toSy(Math.sqrt(3) / 2));
                    ctx.stroke();
                    ctx.beginPath();
                    ctx.moveTo(toSx(0.5), toSy(yMaxVal));
                    ctx.lineTo(toSx(0.5), toSy(Math.sqrt(3) / 2));
                    ctx.stroke();

                    // Arc
                    ctx.beginPath();
                    var arcSteps = 60;
                    for (var t = 0; t <= arcSteps; t++) {
                        var angle = 2 * Math.PI / 3 - t * (Math.PI / 3) / arcSteps;
                        var ax = Math.cos(angle);
                        var ay = Math.sin(angle);
                        var sax = toSx(ax), say = toSy(ay);
                        if (t === 0) ctx.moveTo(sax, say);
                        else ctx.lineTo(sax, say);
                    }
                    ctx.stroke();
                    ctx.setLineDash([]);

                    // Labels
                    var formName = (formChoice === 0) ? '|E\u2084(z)|' : '|\u0394(z)|';
                    viz.screenText(formName + ' on \u210D', viz.width / 2, 16, '#ffffffcc', 14);
                    viz.screenText('Re(z)', viz.width / 2, viz.height - 8, '#ffffff88', 10);
                    viz.screenText('Im(z)', 14, viz.height / 2, '#ffffff88', 10);

                    // Axis ticks
                    ctx.fillStyle = '#ffffff88';
                    ctx.font = '9px -apple-system,sans-serif';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'top';
                    for (var xt = -1; xt <= 1; xt++) {
                        ctx.fillText(xt.toString(), toSx(xt), toSy(yRange[0]) + 2);
                    }
                    ctx.textAlign = 'right';
                    ctx.textBaseline = 'middle';
                    for (var yt = 0.5; yt <= yMaxVal; yt += 0.5) {
                        ctx.fillText(yt.toFixed(1), toSx(xRange[0]) - 2, toSy(yt));
                    }
                }
                draw();
                return viz;
            }
        }
    ],

    // ================================================================
    // sec-ramanujan: Interactive Langlands map
    // ================================================================
    'sec-ramanujan': [
        {
            id: 'viz-langlands-map',
            title: 'The Langlands Correspondence: An Interactive Map',
            description: 'The Langlands program connects automorphic representations (left) to Galois representations (right). Click nodes to see the correspondence and which theorems establish the link.',
            setup: function(body, controls) {
                var viz = new VizEngine(body, {
                    width: 560, height: 420,
                    originX: 0, originY: 0, scale: 1
                });

                var nodes = {
                    auto: [
                        { id: 'gl1-auto', label: 'GL\u2081 automorphic', x: 100, y: 80, desc: 'Hecke characters / Dirichlet characters' },
                        { id: 'gl2-eis', label: 'GL\u2082 Eisenstein', x: 60, y: 160, desc: 'Eisenstein series E_k, encode \u03B6(s)' },
                        { id: 'gl2-cusp', label: 'GL\u2082 cuspidal', x: 140, y: 160, desc: 'Cusp forms like \u0394, weight k eigenforms' },
                        { id: 'gl2-maass', label: 'GL\u2082 Maass', x: 100, y: 240, desc: 'Non-holomorphic eigenforms, \u0394f = \u03BBf' },
                        { id: 'gln-auto', label: 'GL_n auto', x: 100, y: 320, desc: 'Higher-rank automorphic forms' }
                    ],
                    galois: [
                        { id: 'gl1-galois', label: '1-dim Galois', x: 460, y: 80, desc: 'Abelian characters, class field theory' },
                        { id: 'gl2-galois-mod', label: '2-dim modular', x: 460, y: 160, desc: '\u2113-adic reps from elliptic curves & eigenforms' },
                        { id: 'gl2-galois-artin', label: '2-dim Artin', x: 460, y: 240, desc: 'Finite-image reps, Artin L-functions' },
                        { id: 'gln-galois', label: 'n-dim motivic', x: 460, y: 320, desc: 'Galois reps from algebraic geometry' }
                    ]
                };

                var links = [
                    { from: 'gl1-auto', to: 'gl1-galois', theorem: 'Class field theory (Artin, Tate)', proved: true },
                    { from: 'gl2-cusp', to: 'gl2-galois-mod', theorem: 'Modularity / Deligne (1974, 1995)', proved: true },
                    { from: 'gl2-maass', to: 'gl2-galois-artin', theorem: 'Partial: Langlands-Tunnell', proved: false },
                    { from: 'gl2-eis', to: 'gl1-galois', theorem: 'Reducible representation', proved: true },
                    { from: 'gln-auto', to: 'gln-galois', theorem: 'Langlands reciprocity (open)', proved: false }
                ];

                var selectedNode = null;

                body.style.cursor = 'pointer';
                body.addEventListener('click', function(e) {
                    var rect = viz.canvas.getBoundingClientRect();
                    var mx = e.clientX - rect.left;
                    var my = e.clientY - rect.top;

                    selectedNode = null;
                    var allNodes = nodes.auto.concat(nodes.galois);
                    for (var i = 0; i < allNodes.length; i++) {
                        var nd = allNodes[i];
                        var dx = mx - nd.x, dy = my - nd.y;
                        if (dx * dx + dy * dy < 900) {
                            selectedNode = nd.id;
                            break;
                        }
                    }
                    draw();
                });

                function draw() {
                    viz.clear();
                    var ctx = viz.ctx;

                    // Headers
                    viz.screenText('Automorphic Side', 100, 30, viz.colors.blue, 14);
                    viz.screenText('Galois Side', 460, 30, viz.colors.orange, 14);

                    // Divider
                    ctx.strokeStyle = viz.colors.grid;
                    ctx.lineWidth = 1;
                    ctx.setLineDash([4, 4]);
                    ctx.beginPath();
                    ctx.moveTo(280, 50);
                    ctx.lineTo(280, 380);
                    ctx.stroke();
                    ctx.setLineDash([]);

                    viz.screenText('\u2194', 280, 46, viz.colors.white, 16);
                    viz.screenText('Langlands', 280, 395, viz.colors.text, 10);

                    // Draw links
                    for (var li = 0; li < links.length; li++) {
                        var link = links[li];
                        var fromNode = nodes.auto.concat(nodes.galois).find(function(n) { return n.id === link.from; });
                        var toNode = nodes.auto.concat(nodes.galois).find(function(n) { return n.id === link.to; });
                        if (!fromNode || !toNode) continue;

                        var isActive = (selectedNode === link.from || selectedNode === link.to);
                        var col = link.proved ? viz.colors.green : viz.colors.yellow;
                        ctx.strokeStyle = isActive ? col : col + '44';
                        ctx.lineWidth = isActive ? 2.5 : 1;
                        if (!link.proved) ctx.setLineDash([6, 4]);

                        ctx.beginPath();
                        ctx.moveTo(fromNode.x + 30, fromNode.y);
                        ctx.bezierCurveTo(280, fromNode.y, 280, toNode.y, toNode.x - 30, toNode.y);
                        ctx.stroke();
                        ctx.setLineDash([]);

                        if (isActive) {
                            var midY = (fromNode.y + toNode.y) / 2;
                            viz.screenText(link.theorem, 280, midY - 10, col, 9);
                            viz.screenText(link.proved ? '(proved)' : '(open/partial)', 280, midY + 4, col, 8);
                        }
                    }

                    // Draw nodes
                    function drawNode(nd, sideColor) {
                        var isSelected = (selectedNode === nd.id);
                        var r = 25;

                        ctx.fillStyle = isSelected ? sideColor + '44' : sideColor + '18';
                        ctx.beginPath();
                        ctx.arc(nd.x, nd.y, r, 0, Math.PI * 2);
                        ctx.fill();
                        ctx.strokeStyle = isSelected ? sideColor : sideColor + '66';
                        ctx.lineWidth = isSelected ? 2 : 1;
                        ctx.stroke();

                        viz.screenText(nd.label, nd.x, nd.y, isSelected ? viz.colors.white : sideColor, isSelected ? 10 : 9);

                        if (isSelected) {
                            viz.screenText(nd.desc, viz.width / 2, viz.height - 15, viz.colors.white, 11);
                        }
                    }

                    for (var i = 0; i < nodes.auto.length; i++) {
                        drawNode(nodes.auto[i], viz.colors.blue);
                    }
                    for (var j = 0; j < nodes.galois.length; j++) {
                        drawNode(nodes.galois[j], viz.colors.orange);
                    }

                    // Legend
                    ctx.fillStyle = viz.colors.green;
                    ctx.fillRect(20, viz.height - 35, 10, 2);
                    viz.screenText('proved', 55, viz.height - 34, viz.colors.green, 9);

                    ctx.strokeStyle = viz.colors.yellow;
                    ctx.lineWidth = 1;
                    ctx.setLineDash([4, 3]);
                    ctx.beginPath();
                    ctx.moveTo(90, viz.height - 35);
                    ctx.lineTo(110, viz.height - 35);
                    ctx.stroke();
                    ctx.setLineDash([]);
                    viz.screenText('open', 130, viz.height - 34, viz.colors.yellow, 9);

                    if (!selectedNode) {
                        viz.screenText('Click a node to explore the correspondence', viz.width / 2, viz.height - 15, viz.colors.text, 11);
                    }
                }
                draw();
                return viz;
            }
        }
    ]
};
