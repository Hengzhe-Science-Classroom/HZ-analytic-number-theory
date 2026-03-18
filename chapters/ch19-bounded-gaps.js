window.CHAPTERS = window.CHAPTERS || [];
window.CHAPTERS.push({
    id: 'ch19',
    number: 19,
    title: 'Bounded Gaps Between Primes',
    subtitle: 'From infinity to 246: the Zhang-Maynard-Tao revolution',
    sections: [

        // ================================================================
        // SECTION 1: The Twin Prime Dream
        // ================================================================
        {
            id: 'sec-motivation',
            title: 'The Twin Prime Dream',
            content: `
<h2>The Twin Prime Dream</h2>

<div class="env-block intuition">
    <div class="env-title">A Question from Antiquity</div>
    <div class="env-body">
        <p>Are there infinitely many prime pairs \\((p, p+2)\\) — twin primes? The question is more than 2000 years old, yet as of today it remains open. What <em>has</em> been proved — and recently — is something nearly as profound: there exist infinitely many pairs of primes whose gap is <strong>at most 246</strong>.</p>
    </div>
</div>

<p>The prime number theorem tells us that primes near \\(N\\) have average spacing \\(\\log N\\). As \\(N \\to \\infty\\), this spacing grows without bound. For a century, the folk wisdom was: primes thin out, so large gaps dominate, and pairs with fixed gap \\(h\\) should become rarer and rarer — perhaps finite in number.</p>

<p>This intuition is spectacularly wrong. The Hardy-Littlewood conjecture from 1923 predicts that for any even \\(h\\),</p>

\\[
\\#\\{p \\le X : p + h \\text{ prime}\\} \\sim \\mathfrak{S}(h) \\frac{X}{(\\log X)^2},
\\]

<p>where \\(\\mathfrak{S}(h) > 0\\) is an explicit singular series encoding local arithmetic obstructions. In particular, <em>every even gap occurs infinitely often</em>. The gap-2 case is the twin prime conjecture.</p>

<h3>The Gap Distribution</h3>

<p>Define the <strong>prime gap</strong> \\(g_n = p_{n+1} - p_n\\). The sequence begins:</p>

\\[
1, 2, 2, 4, 2, 4, 2, 4, 6, 2, 6, 4, 2, 4, 6, 6, 2, 6, 4, 2, 6, 4, 6, 8, \\ldots
\\]

<p>Computationally, gaps of size 2, 4, 6 are overwhelmingly common. But large gaps also occur: Bertrand's postulate guarantees \\(g_n < p_n\\), so the gaps grow no faster than linearly. Cramér's model predicts \\(\\limsup g_n / (\\log p_n)^2 = 1\\).</p>

<p>The key dichotomy:</p>

<ul>
    <li><strong>Large gaps:</strong> How large can \\(g_n\\) be? This is the domain of Chapter 18.</li>
    <li><strong>Small gaps:</strong> Can \\(\\liminf g_n < \\infty\\)? This is the domain of Chapter 19.</li>
</ul>

<div class="env-block definition">
    <div class="env-title">Definition (Bounded Gaps)</div>
    <div class="env-body">
        <p>We say <strong>bounded gaps</strong> hold with constant \\(H\\) if</p>
        \\[\\liminf_{n \\to \\infty} (p_{n+1} - p_n) \\le H.\\]
        <p>Equivalently, there are infinitely many \\(n\\) with \\(p_{n+1} - p_n \\le H\\).</p>
        <p>The twin prime conjecture asserts bounded gaps hold with \\(H = 2\\). Zhang (2013) proved \\(H \\le 70{,}000{,}000\\). The Polymath8b project and Maynard-Tao (2014) together reduced this to \\(H \\le 246\\).</p>
    </div>
</div>

<h3>Why 246?</h3>

<p>The number 246 is not arbitrary — it is a consequence of the precise sieve machinery and a specific admissible 5-tuple. Under the assumption of the Elliott-Halberstam conjecture (a stronger equidistribution hypothesis), the bound drops to 12. Under the full generalized Elliott-Halberstam conjecture, it drops to 6. The gap between 6 and 2 (the twin prime conjecture) remains unbridged by current methods.</p>

<div class="env-block remark">
    <div class="env-title">The Polymath Collaboration</div>
    <div class="env-body">
        <p>Immediately after Zhang's May 2013 announcement, Terence Tao launched Polymath8, an open collaborative project to improve the bound. Within eight months, the gap was reduced from 70 million to 4,680. James Maynard's independent approach (late 2013) brought it to 600, and Polymath8b eventually reached 246 — an extraordinary example of open-science mathematics.</p>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-bounded-gap-timeline"></div>
`,
            visualizations: [
                {
                    id: 'viz-bounded-gap-timeline',
                    title: 'The Race to Bounded Gaps: Timeline of Progress',
                    description: 'Animated history of the bounded gaps result. Each milestone reduces the bound. Watch the logarithmic compression as 70 million collapses toward 246.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, { width: 700, height: 380 });
                        var milestones = [
                            { year: 2005, bound: Infinity,       label: 'GPY: liminf = 0',        color: '#8b949e', desc: 'Goldston-Pintz-Yildirim: gaps are o(log p)' },
                            { year: 2013.4, bound: 70000000,    label: 'Zhang: 70M',             color: '#f85149', desc: 'Zhang Yitang: first finite bound' },
                            { year: 2013.5, bound: 4680,        label: 'Polymath8a: 4,680',      color: '#f0883e', desc: 'Polymath8a collaborative refinement' },
                            { year: 2013.9, bound: 600,         label: 'Maynard: 600',           color: '#d29922', desc: 'James Maynard: new sieve method' },
                            { year: 2014.1, bound: 252,         label: 'Polymath8b: 252',        color: '#3fb950', desc: 'Polymath8b optimization' },
                            { year: 2014.3, bound: 246,         label: 'Polymath8b: 246',        color: '#58a6ff', desc: 'Current best unconditional bound' },
                        ];

                        var animPhase = 0;
                        var showIdx = 0;
                        var hovered = -1;

                        function logBound(b) {
                            if (!isFinite(b)) return 0;
                            return Math.log10(b + 1);
                        }

                        var maxLog = Math.log10(70000001);

                        function draw(t) {
                            viz.clear();
                            var ctx = viz.ctx;
                            var W = viz.width, H = viz.height;
                            var pad = { l: 60, r: 30, t: 50, b: 70 };
                            var cw = W - pad.l - pad.r;
                            var ch = H - pad.t - pad.b;

                            // Title
                            ctx.fillStyle = viz.colors.white;
                            ctx.font = 'bold 14px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText('Upper Bound on lim inf(p_{n+1} - p_n)', W / 2, 22);

                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '11px -apple-system,sans-serif';
                            ctx.fillText('(log\u2081\u2080 scale)', W / 2, 38);

                            // Y axis: log scale from 0 to maxLog
                            ctx.strokeStyle = viz.colors.axis;
                            ctx.lineWidth = 1.5;
                            ctx.beginPath();
                            ctx.moveTo(pad.l, pad.t);
                            ctx.lineTo(pad.l, pad.t + ch);
                            ctx.stroke();

                            // Y grid lines and labels
                            var yTicks = [0, 1, 2, 3, 4, 5, 6, 7];
                            yTicks.forEach(function(p) {
                                if (p > maxLog + 0.5) return;
                                var yy = pad.t + ch - (p / maxLog) * ch;
                                ctx.strokeStyle = viz.colors.grid;
                                ctx.lineWidth = 0.5;
                                ctx.beginPath(); ctx.moveTo(pad.l, yy); ctx.lineTo(pad.l + cw, yy); ctx.stroke();
                                ctx.fillStyle = viz.colors.text;
                                ctx.font = '10px -apple-system,sans-serif';
                                ctx.textAlign = 'right';
                                ctx.fillText('10^' + p, pad.l - 6, yy + 3);
                            });

                            // X axis (years)
                            ctx.strokeStyle = viz.colors.axis;
                            ctx.lineWidth = 1.5;
                            ctx.beginPath();
                            ctx.moveTo(pad.l, pad.t + ch);
                            ctx.lineTo(pad.l + cw, pad.t + ch);
                            ctx.stroke();

                            var xMin = 2004.5, xMax = 2015;
                            function xPos(yr) { return pad.l + (yr - xMin) / (xMax - xMin) * cw; }
                            function yPos(b) {
                                if (!isFinite(b)) return pad.t + ch * 0.05;
                                return pad.t + ch - (logBound(b) / maxLog) * ch;
                            }

                            // Year ticks
                            for (var yr = 2005; yr <= 2014; yr++) {
                                var xx = xPos(yr);
                                ctx.strokeStyle = viz.colors.grid;
                                ctx.lineWidth = 0.5;
                                ctx.beginPath(); ctx.moveTo(xx, pad.t); ctx.lineTo(xx, pad.t + ch); ctx.stroke();
                                ctx.fillStyle = viz.colors.text;
                                ctx.font = '10px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.fillText(yr, xx, pad.t + ch + 14);
                            }

                            // Animate reveal
                            animPhase = Math.min(animPhase + 0.012, 1);
                            var visibleCount = Math.ceil(animPhase * milestones.length);

                            // Draw connecting line
                            if (visibleCount >= 2) {
                                ctx.strokeStyle = '#30363d';
                                ctx.lineWidth = 2;
                                ctx.beginPath();
                                for (var i = 0; i < visibleCount; i++) {
                                    var m = milestones[i];
                                    var px = xPos(m.year), py = yPos(m.bound);
                                    if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
                                }
                                ctx.stroke();
                            }

                            // Draw milestone dots
                            milestones.forEach(function(m, i) {
                                if (i >= visibleCount) return;
                                var px = xPos(m.year), py = yPos(m.bound);
                                var r = (i === hovered) ? 10 : 7;

                                ctx.fillStyle = m.color + '33';
                                ctx.beginPath(); ctx.arc(px, py, r + 4, 0, Math.PI * 2); ctx.fill();

                                ctx.fillStyle = m.color;
                                ctx.beginPath(); ctx.arc(px, py, r, 0, Math.PI * 2); ctx.fill();

                                // Label above
                                ctx.fillStyle = m.color;
                                ctx.font = 'bold 10px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                var labelY = py - 14;
                                if (labelY < pad.t + 12) labelY = py + 18;
                                ctx.fillText(m.label, px, labelY);
                            });

                            // Hover tooltip
                            if (hovered >= 0 && hovered < milestones.length) {
                                var m = milestones[hovered];
                                var px = xPos(m.year);
                                var py = yPos(m.bound);
                                var tw = 220, th = 40;
                                var tx = Math.min(px + 12, W - tw - 8);
                                var ty = Math.max(py - th - 8, pad.t);
                                ctx.fillStyle = '#1a1a40';
                                ctx.strokeStyle = m.color;
                                ctx.lineWidth = 1;
                                ctx.beginPath();
                                ctx.roundRect(tx, ty, tw, th, 4);
                                ctx.fill(); ctx.stroke();
                                ctx.fillStyle = viz.colors.white;
                                ctx.font = 'bold 11px -apple-system,sans-serif';
                                ctx.textAlign = 'left';
                                ctx.fillText(m.desc, tx + 8, ty + 14);
                                ctx.fillStyle = viz.colors.text;
                                ctx.font = '10px -apple-system,sans-serif';
                                var bStr = isFinite(m.bound) ? m.bound.toLocaleString() : '\u221e (o(log p))';
                                ctx.fillText('Bound: ' + bStr + '  |  Year: ' + m.year, tx + 8, ty + 30);
                            }

                            // Zhang special annotation
                            if (visibleCount >= 2) {
                                var zhangX = xPos(2013.4);
                                ctx.fillStyle = '#f8514966';
                                ctx.font = 'italic 10px -apple-system,sans-serif';
                                ctx.textAlign = 'left';
                                ctx.fillText('First finite bound!', zhangX + 10, yPos(70000000) + 24);
                            }

                            // Twin prime line
                            var tpY = yPos(2);
                            ctx.strokeStyle = '#bc8cff44';
                            ctx.lineWidth = 1;
                            ctx.setLineDash([4, 4]);
                            ctx.beginPath(); ctx.moveTo(pad.l, tpY); ctx.lineTo(pad.l + cw, tpY); ctx.stroke();
                            ctx.setLineDash([]);
                            ctx.fillStyle = '#bc8cff';
                            ctx.font = '10px -apple-system,sans-serif';
                            ctx.textAlign = 'left';
                            ctx.fillText('Twin prime conjecture (H=2)', pad.l + 4, tpY - 4);
                        }

                        viz.canvas.addEventListener('mousemove', function(e) {
                            var r = viz.canvas.getBoundingClientRect();
                            var mx = (e.clientX - r.left), my = (e.clientY - r.top);
                            var xMin = 2004.5, xMax = 2015;
                            var pad = { l: 60, r: 30, t: 50, b: 70 };
                            var cw = viz.width - pad.l - pad.r, ch = viz.height - pad.t - pad.b;
                            function xPos(yr) { return pad.l + (yr - xMin) / (xMax - xMin) * cw; }
                            function yPos(b) {
                                if (!isFinite(b)) return pad.t + ch * 0.05;
                                return pad.t + ch - (Math.log10(b + 1) / Math.log10(70000001)) * ch;
                            }
                            hovered = -1;
                            milestones.forEach(function(m, i) {
                                var px = xPos(m.year), py = yPos(m.bound);
                                if (Math.sqrt((mx - px) ** 2 + (my - py) ** 2) < 14) hovered = i;
                            });
                        });

                        VizEngine.createButton(controls, 'Replay', function() { animPhase = 0; });

                        viz.animate(draw);
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Let \\(g_n = p_{n+1} - p_n\\). Show that \\(\\liminf_{n\\to\\infty} g_n \\ge 1\\) (trivially), and explain why proving \\(\\liminf g_n \\le 246\\) is a nontrivial theorem.',
                    hint: 'The primes are a set of density zero in the integers. Why does that make bounded gaps non-obvious?',
                    solution: 'Since all primes beyond 2 are odd, consecutive prime gaps are at least 1 (in fact at least 2 for \\(p_n > 2\\)). The non-triviality of \\(\\liminf g_n \\le C < \\infty\\) is that primes have density zero: \\(\\pi(X) / X \\to 0\\), so the average gap \\(g_n / \\log p_n \\to 1\\) grows to infinity. A priori, the gaps could all tend to infinity; the bounded-gaps theorem says this cannot happen, i.e., infinitely many gaps stay bounded regardless of how large \\(p_n\\) is.'
                }
            ]
        },

        // ================================================================
        // SECTION 2: The GPY Method
        // ================================================================
        {
            id: 'sec-gpy',
            title: 'The GPY Method',
            content: `
<h2>The GPY Method</h2>

<div class="env-block intuition">
    <div class="env-title">The Core Idea</div>
    <div class="env-body">
        <p>Goldston, Pintz, and Yildirim (2005) proved that \\(\\liminf_n g_n / \\log p_n = 0\\): prime gaps are infinitely often much smaller than average. Their tool is a <em>weighted sieve</em> — a cleverly chosen non-negative function that concentrates mass near primes, allowing comparison of "how many primes fall near the weights" with a lower bound.</p>
    </div>
</div>

<h3>The Setup</h3>

<p>Fix an integer \\(k \\ge 2\\) and a tuple \\(\\mathcal{H} = (h_1, \\ldots, h_k)\\) of distinct non-negative integers. Consider the \\(k\\)-dimensional polynomial</p>

\\[
\\Lambda_R(n) = \\sum_{\\substack{d_1 | (n+h_1),\\, \\ldots,\\, d_k | (n+h_k) \\\\ d_1 \\cdots d_k \\le R}} \\mu(d_1 \\cdots d_k) \\prod_{i=1}^k \\log\\frac{R}{d_i}.
\\]

<p>The key quantity is the <strong>sieve sum</strong></p>

\\[
S(X; \\mathcal{H}) = \\sum_{n \\le X} \\Lambda_R(n)^2 \\left(\\sum_{i=1}^k \\mathbf{1}[n + h_i \\text{ prime}] - \\rho\\right),
\\]

<p>where \\(\\rho < k\\) is chosen so that, if \\(S(X; \\mathcal{H}) > 0\\), then some \\(n \\le X\\) must have at least one \\(n + h_i\\) prime. GPY is more subtle: they show \\(S > 0\\) forces two primes among \\(n + h_1, \\ldots, n + h_k\\) for infinitely many \\(n\\).</p>

<h3>The Bombieri-Vinogradov Input</h3>

<p>The main terms of the sums are controlled by the prime number theorem in arithmetic progressions. The critical ingredient is the <strong>Bombieri-Vinogradov theorem</strong> (see Chapter 13):</p>

\\[
\\sum_{q \\le Q} \\max_{(a,q)=1} \\left| \\psi(X; q, a) - \\frac{X}{\\phi(q)} \\right| \\ll X (\\log X)^{-A}
\\]

<p>for any \\(A > 0\\), with \\(Q = X^{1/2} (\\log X)^{-B}\\). This acts as an <em>averaged</em> version of GRH, valid unconditionally.</p>

<div class="env-block theorem">
    <div class="env-title">Theorem (Goldston-Pintz-Yildirim, 2005)</div>
    <div class="env-body">
        <p>\\[\\liminf_{n \\to \\infty} \\frac{p_{n+1} - p_n}{\\log p_n} = 0.\\]</p>
        <p>Moreover, if the <strong>Elliott-Halberstam conjecture</strong> holds (which posits Bombieri-Vinogradov with \\(Q = X^{1-\\varepsilon}\\)), then \\(\\liminf(p_{n+1} - p_n) \\le 16\\).</p>
    </div>
</div>

<p>The frustrating near-miss: GPY proved that, assuming EH, infinitely many gaps are \\(\\le 16\\). Unconditionally, their method only gives gaps tending to zero <em>relative to \\(\\log p\\)</em>, not absolutely bounded. The missing ingredient was a way to boost the weights.</p>

<h3>The Weight Function Geometry</h3>

<p>The GPY weights are essentially \\(\\Lambda_R(n) \\approx (\\log R)^k \\cdot F(n/R)\\) where \\(F\\) is a smooth function on the simplex \\(\\{\\mathbf{t} : t_i \\ge 0,\\ \\sum t_i \\le 1\\}\\). The optimization problem is: choose \\(F\\) on the simplex to maximize the ratio of "prime detections" to "total weight." GPY used a rank-1 approximation; Maynard-Tao use arbitrary smooth functions on the simplex, dramatically increasing the power.</p>

<div class="viz-placeholder" data-viz="viz-gpy-weights"></div>
`,
            visualizations: [
                {
                    id: 'viz-gpy-weights',
                    title: 'GPY Weight Function on the Simplex',
                    description: 'The GPY sieve weight lives on a 2-simplex (for k=2). Brighter regions indicate larger weight. Drag the slider to change the \\(\\delta\\) parameter that controls the support.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, { width: 600, height: 380 });
                        var deltaVal = 0.5;

                        VizEngine.createSlider(controls, '\u03b4', 0.1, 1.0, deltaVal, 0.01, function(v) {
                            deltaVal = v;
                            drawFrame();
                        });

                        function drawFrame() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var W = viz.width, H = viz.height;

                            // Draw simplex heatmap
                            var cx = W * 0.42, cy = H * 0.82;
                            var side = Math.min(W * 0.65, H * 0.75);
                            // Vertices of simplex: (0,0), (1,0), (0.5, sqrt(3)/2) in barycentric
                            var v0 = [cx, cy];
                            var v1 = [cx + side, cy];
                            var v2 = [cx + side * 0.5, cy - side * Math.sqrt(3) / 2];

                            // Rasterize
                            var imgData = ctx.createImageData(W, H);
                            var data = imgData.data;

                            for (var py = 0; py < H; py++) {
                                for (var px = 0; px < W; px++) {
                                    // Convert to barycentric coordinates
                                    var dx = px - v0[0], dy = py - v0[1];
                                    var e1x = v1[0] - v0[0], e1y = v1[1] - v0[1];
                                    var e2x = v2[0] - v0[0], e2y = v2[1] - v0[1];
                                    var denom = e1x * e2y - e1y * e2x;
                                    if (Math.abs(denom) < 1e-10) continue;
                                    var s = (dx * e2y - dy * e2x) / denom;
                                    var t = (e1x * dy - e1y * dx) / denom;
                                    var u = 1 - s - t;
                                    if (s < 0 || t < 0 || u < 0 || s > 1 || t > 1 || u > 1) continue;

                                    // GPY weight function on simplex: F(s,t) = (1 - s/delta)_+ * (1 - t/delta)_+
                                    var fs = Math.max(0, 1 - s / deltaVal);
                                    var ft = Math.max(0, 1 - t / deltaVal);
                                    var val = fs * ft;

                                    var intensity = Math.min(1, val * 2.5);
                                    var r = Math.round(88 * intensity + 30);
                                    var g = Math.round(166 * intensity + 20);
                                    var b = Math.round(255 * intensity + 20);
                                    var idx = (py * W + px) * 4;
                                    data[idx] = Math.min(255, r);
                                    data[idx + 1] = Math.min(255, g);
                                    data[idx + 2] = Math.min(255, b);
                                    data[idx + 3] = 200;
                                }
                            }
                            ctx.putImageData(imgData, 0, 0);

                            // Simplex outline
                            ctx.strokeStyle = viz.colors.blue;
                            ctx.lineWidth = 2;
                            ctx.beginPath();
                            ctx.moveTo(v0[0], v0[1]);
                            ctx.lineTo(v1[0], v1[1]);
                            ctx.lineTo(v2[0], v2[1]);
                            ctx.closePath();
                            ctx.stroke();

                            // Vertex labels
                            ctx.fillStyle = viz.colors.white;
                            ctx.font = 'bold 13px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText('(0,0)', v0[0] - 18, v0[1] + 14);
                            ctx.fillText('(1,0)', v1[0] + 20, v1[1] + 14);
                            ctx.fillText('(1/2, \u221a3/2)', v2[0], v2[1] - 10);

                            // Axis labels
                            ctx.fillStyle = viz.colors.teal;
                            ctx.font = '12px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText('t\u2081 \u2192', (v0[0] + v1[0]) / 2, v0[1] + 20);
                            ctx.textAlign = 'right';
                            ctx.fillText('t\u2082', (v0[0] + v2[0]) / 2 - 10, (v0[1] + v2[1]) / 2);

                            // Title and formula
                            ctx.fillStyle = viz.colors.white;
                            ctx.font = 'bold 14px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText('GPY Weight: F(t\u2081, t\u2082) = (1 \u2212 t\u2081/\u03b4)\u208a \u00b7 (1 \u2212 t\u2082/\u03b4)\u208a', W / 2, 24);

                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '11px -apple-system,sans-serif';
                            ctx.fillText('\u03b4 = ' + deltaVal.toFixed(2) + '  |  Support: t\u2081 \u2264 \u03b4, t\u2082 \u2264 \u03b4', W / 2, 42);

                            // Color legend
                            var legX = W * 0.78, legY = H * 0.25;
                            ctx.font = '10px -apple-system,sans-serif';
                            ctx.textAlign = 'left';
                            for (var li = 0; li <= 5; li++) {
                                var frac = li / 5;
                                var intensity = frac;
                                var lr = Math.round(88 * intensity + 30);
                                var lg = Math.round(166 * intensity + 20);
                                var lb = Math.round(255 * intensity + 20);
                                ctx.fillStyle = 'rgb(' + Math.min(255,lr) + ',' + Math.min(255,lg) + ',' + Math.min(255,lb) + ')';
                                ctx.fillRect(legX, legY + li * 18, 14, 14);
                                ctx.fillStyle = viz.colors.text;
                                ctx.fillText((1 - frac / 2).toFixed(1), legX + 18, legY + li * 18 + 10);
                            }
                            ctx.fillStyle = viz.colors.text;
                            ctx.fillText('F value', legX, legY - 8);
                        }

                        drawFrame();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'The GPY argument requires \\(\\sum_{n \\le X} \\Lambda_R(n)^2 \\approx C \\cdot X (\\log R)^{2k}\\). Explain at a high level why the Bombieri-Vinogradov theorem (rather than GRH) suffices to evaluate this sum with \\(R = X^{\\theta}\\) for \\(\\theta < 1/2\\).',
                    hint: 'Think about which moduli \\(q\\) appear in the expansion of \\(\\Lambda_R(n)^2\\), and what bound on \\(q\\) is needed.',
                    solution: 'Expanding \\(\\Lambda_R^2\\), the cross-terms involve \\(\\sum_{n \\le X} \\mathbf{1}[n \\equiv a \\pmod{q}]\\) for \\(q = d_1 d_2 \\le R^2 = X^{2\\theta}\\). Bombieri-Vinogradov controls the error in such sums for \\(q \\le X^{1/2-\\varepsilon}\\), which is satisfied when \\(2\\theta < 1\\), i.e., \\(\\theta < 1/2\\). GRH would allow \\(\\theta < 1\\), and EH would extend to \\(\\theta < 1\\) on average — that is the source of the GPY conditional improvement.'
                }
            ]
        },

        // ================================================================
        // SECTION 3: Zhang's Breakthrough
        // ================================================================
        {
            id: 'sec-zhang',
            title: "Zhang's Breakthrough",
            content: `
<h2>Zhang's Breakthrough (2013)</h2>

<div class="env-block intuition">
    <div class="env-title">The Key Observation</div>
    <div class="env-body">
        <p>GPY needed the Elliott-Halberstam conjecture (EH), which says primes are well-distributed in arithmetic progressions to moduli up to \\(X^{1-\\varepsilon}\\). EH is open. Zhang's insight: you don't need EH in full generality. A much more specialized distribution result — one that exploits the structure of the moduli that actually appear in the GPY argument — can be proved unconditionally.</p>
    </div>
</div>

<h3>The Admissible Tuple</h3>

<p>Zhang works with a fixed admissible \\(k\\)-tuple \\(\\mathcal{H}\\) (see Section 5). He needs to find many \\(n \\le X\\) such that at least two elements of \\(\\{n + h_i\\}\\) are prime. His argument requires \\(k = 3.5 \\times 10^6\\) elements (an enormous number chosen for technical reasons).</p>

<h3>Level of Distribution Beyond 1/2</h3>

<p>The critical new ingredient is a <strong>partially smoothed level of distribution</strong>. Define</p>

\\[
E(X; q, a) = \\sum_{\\substack{n \\le X \\\\ n \\equiv a \\pmod{q}}} \\Lambda(n) - \\frac{X}{\\phi(q)}.
\\]

<p>Bombieri-Vinogradov says \\(\\sum_{q \\le X^{1/2}} \\max_{a} |E(X; q, a)| \\ll X (\\log X)^{-A}\\). Zhang proves a variant: for moduli \\(q\\) that are <em>smooth</em> (all prime factors \\(\\le X^\\delta\\) for some small \\(\\delta\\)) and <em>square-free</em>, one has equidistribution up to level \\(X^{1/2 + 1/584}\\) — a tiny, but crucial, improvement beyond \\(1/2\\).</p>

<div class="env-block theorem">
    <div class="env-title">Theorem (Zhang, 2013)</div>
    <div class="env-body">
        <p>There exists an absolute constant \\(H_0\\) such that</p>
        \\[\\liminf_{n \\to \\infty}(p_{n+1} - p_n) \\le H_0.\\]
        <p>The original paper gives \\(H_0 = 70{,}000{,}000\\). The proof proceeds by showing that for any admissible \\(k\\)-tuple \\(\\mathcal{H}\\) with \\(k\\) large enough, there are infinitely many \\(n\\) for which at least two elements of \\(n + \\mathcal{H}\\) are prime.</p>
    </div>
</div>

<h3>The Exponential Sum Argument</h3>

<p>Zhang's proof of level \\(1/2 + \\delta\\) for smooth squarefree moduli uses ideas from the Bombieri-Iwaniec method (exponential sum estimates via Weil's theorem and Deligne's work on the Weil conjectures for character sums over finite fields). Specifically, he shows that certain complete character sums \\(\\sum_{x \\pmod p} e(f(x)/p)\\) satisfy non-trivial cancellation, enabling him to sum the distribution error over smooth moduli beyond the \\(\\sqrt{X}\\) barrier.</p>

<div class="env-block remark">
    <div class="env-title">Why Zhang's Approach Worked</div>
    <div class="env-body">
        <p>Zhang submitted his paper "Bounded gaps between primes" to the Annals of Mathematics in April 2013. Referee reports came back within three weeks — extraordinarily fast. The reason: the paper was correct, complete, and clever. Zhang, then 58 and largely unknown, had worked on the problem alone for years. The mathematical community's rapid acceptance was a testament to the clarity of the ideas.</p>
    </div>
</div>

<div class="env-block definition">
    <div class="env-title">Definition (Smooth and Squarefree Moduli)</div>
    <div class="env-body">
        <p>A positive integer \\(q\\) is <strong>\\(y\\)-smooth</strong> if every prime factor \\(p | q\\) satisfies \\(p \\le y\\). It is <strong>squarefree</strong> if \\(p^2 \\nmid q\\) for all primes \\(p\\).</p>
        <p>Zhang restricts to moduli \\(q \\le X^{1/2+\\delta}\\) that are \\(X^\\delta\\)-smooth and squarefree. These moduli are "structured" enough that Weil-type bounds apply, yet general enough to include the moduli arising in the GPY weights.</p>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-admissible-tuples"></div>
`,
            visualizations: [
                {
                    id: 'viz-admissible-tuples',
                    title: 'Admissible k-Tuple Checker',
                    description: 'An integer tuple \\(\\mathcal{H} = (h_1,\\ldots,h_k)\\) is admissible if for every prime \\(p\\), the set \\(\\{h_i \\pmod p\\}\\) does not cover all residues \\(\\pmod p\\). Enter offsets (comma-separated) to check admissibility up to a bound.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, { width: 660, height: 360 });
                        var inputEl = document.createElement('input');
                        inputEl.type = 'text';
                        inputEl.value = '0, 2, 6, 8, 12';
                        inputEl.style.cssText = 'background:#0c0c20;color:#f0f6fc;border:1px solid #30363d;border-radius:4px;padding:3px 8px;font-size:0.82rem;width:200px;margin-right:8px;';
                        controls.appendChild(inputEl);

                        var checkBtn = document.createElement('button');
                        checkBtn.textContent = 'Check';
                        checkBtn.style.cssText = 'padding:4px 12px;border:1px solid #30363d;border-radius:4px;background:#1a1a40;color:#c9d1d9;font-size:0.78rem;cursor:pointer;';
                        controls.appendChild(checkBtn);

                        var result = { H: [], admissible: null, witness: null, blockedPrime: -1 };

                        function sievePrimesSmall(max) {
                            var sieve = new Uint8Array(max + 1);
                            var primes = [];
                            for (var i = 2; i <= max; i++) {
                                if (!sieve[i]) {
                                    primes.push(i);
                                    for (var j = i * i; j <= max; j += i) sieve[j] = 1;
                                }
                            }
                            return primes;
                        }

                        var smallPrimes = sievePrimesSmall(100);

                        function checkAdmissible(H) {
                            for (var pi = 0; pi < smallPrimes.length; pi++) {
                                var p = smallPrimes[pi];
                                if (p > H.length + 1) break;
                                var residues = new Set();
                                for (var i = 0; i < H.length; i++) {
                                    residues.add(((H[i] % p) + p) % p);
                                }
                                if (residues.size === p) {
                                    return { admissible: false, blockedPrime: p };
                                }
                            }
                            return { admissible: true, blockedPrime: -1 };
                        }

                        function runCheck() {
                            var parts = inputEl.value.split(',').map(function(s) { return parseInt(s.trim(), 10); });
                            parts = parts.filter(function(x) { return !isNaN(x); });
                            var unique = Array.from(new Set(parts)).sort(function(a, b) { return a - b; });
                            var check = checkAdmissible(unique);
                            result.H = unique;
                            result.admissible = check.admissible;
                            result.blockedPrime = check.blockedPrime;
                            draw();
                        }

                        checkBtn.addEventListener('click', runCheck);
                        inputEl.addEventListener('keydown', function(e) { if (e.key === 'Enter') runCheck(); });

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var W = viz.width, H_h = viz.height;
                            var H = result.H;

                            if (H.length === 0) {
                                ctx.fillStyle = viz.colors.text;
                                ctx.font = '13px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.fillText('Enter offsets above and click Check', W / 2, H_h / 2);
                                return;
                            }

                            // Header
                            ctx.fillStyle = viz.colors.white;
                            ctx.font = 'bold 14px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            var tupStr = '{' + H.join(', ') + '}';
                            ctx.fillText('Tuple: ' + tupStr, W / 2, 24);

                            var statusColor = result.admissible ? viz.colors.green : viz.colors.red;
                            var statusText = result.admissible
                                ? 'ADMISSIBLE (no prime blocks it)'
                                : 'NOT ADMISSIBLE (blocked at p = ' + result.blockedPrime + ')';
                            ctx.fillStyle = statusColor;
                            ctx.font = 'bold 13px -apple-system,sans-serif';
                            ctx.fillText(statusText, W / 2, 44);

                            // Show residue table for small primes
                            var primes = smallPrimes.filter(function(p) { return p <= Math.max(H[H.length - 1] + 2, 13); }).slice(0, 8);
                            var colW = Math.min(65, (W - 80) / (primes.length + 1));
                            var rowH = 30;
                            var tableTop = 68;
                            var tableLeft = 40;

                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '11px -apple-system,sans-serif';
                            ctx.textAlign = 'center';

                            // Header row: primes
                            ctx.fillStyle = viz.colors.text;
                            ctx.fillText('p =', tableLeft + colW * 0.5, tableTop + 10);
                            primes.forEach(function(p, j) {
                                ctx.fillStyle = (p === result.blockedPrime) ? viz.colors.red : viz.colors.blue;
                                ctx.font = 'bold 12px -apple-system,sans-serif';
                                ctx.fillText(p, tableLeft + (j + 1) * colW + colW / 2, tableTop + 10);
                            });

                            // For each element of H, show its residues
                            H.forEach(function(h, i) {
                                var rowY = tableTop + (i + 1) * rowH;
                                ctx.fillStyle = viz.colors.white;
                                ctx.font = '12px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                var subscriptDigits = ['\u2080','\u2081','\u2082','\u2083','\u2084','\u2085','\u2086','\u2087','\u2088','\u2089'];
                                var subIdx = (i < 10) ? subscriptDigits[i] : String(i);
                                ctx.fillText('h' + subIdx + ' = ' + h, tableLeft + colW * 0.5, rowY + 10);
                                primes.forEach(function(p, j) {
                                    var res = ((h % p) + p) % p;
                                    var col = tableLeft + (j + 1) * colW;
                                    // Check if this residue collides with another
                                    var collisionCount = H.filter(function(h2) { return ((h2 % p) + p) % p === res; }).length;
                                    var blocked = (p === result.blockedPrime);

                                    // Background
                                    if (blocked) {
                                        ctx.fillStyle = viz.colors.red + '22';
                                        ctx.fillRect(col, rowY - 2, colW - 2, rowH - 4);
                                    }
                                    ctx.fillStyle = blocked ? viz.colors.red : (collisionCount > 1 ? viz.colors.yellow : viz.colors.teal);
                                    ctx.font = '12px -apple-system,sans-serif';
                                    ctx.fillText(res, col + colW / 2, rowY + 10);
                                });
                            });

                            // Show residue coverage for each prime
                            var coverY = tableTop + (H.length + 1.5) * rowH;
                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '10px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText('# distinct residues:', tableLeft + colW * 0.5, coverY + 8);
                            primes.forEach(function(p, j) {
                                var residues = new Set(H.map(function(h) { return ((h % p) + p) % p; }));
                                var covers = (residues.size === p);
                                ctx.fillStyle = covers ? viz.colors.red : viz.colors.green;
                                ctx.font = 'bold 11px -apple-system,sans-serif';
                                ctx.fillText(residues.size + '/' + p, tableLeft + (j + 1) * colW + colW / 2, coverY + 8);
                            });

                            // Diameter
                            if (H.length >= 2) {
                                var diam = H[H.length - 1] - H[0];
                                ctx.fillStyle = viz.colors.text;
                                ctx.font = '11px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.fillText('Diameter: ' + diam + '  |  k = ' + H.length, W / 2, H_h - 12);
                            }
                        }

                        runCheck();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Show that the tuple \\(\\{0, 2, 4\\}\\) is not admissible. Find a related admissible 3-tuple with all elements even.',
                    hint: 'Check what residues \\(\\{0,2,4\\}\\) cover modulo 3.',
                    solution: 'Modulo 3: \\(0 \\equiv 0\\), \\(2 \\equiv 2\\), \\(4 \\equiv 1\\). The residues \\(\\{0,1,2\\}\\) cover all classes mod 3, so the tuple is NOT admissible. An admissible even triple: \\(\\{0, 6, 12\\}\\) — modulo 3 these give \\(\\{0, 0, 0\\}\\), so residue 1 and 2 are missing; modulo 5: \\(\\{0, 1, 2\\}\\), missing 3 and 4; modulo 7: \\(\\{0, 6, 5\\}\\), missing 1,2,3,4. Admissible.'
                },
                {
                    question: 'Explain why a \\(k\\)-tuple \\((h_1,\\ldots,h_k)\\) with \\(k > p\\) must satisfy special conditions modulo any prime \\(p < k\\). What does admissibility say about such primes?',
                    hint: 'By pigeonhole, once \\(k > p\\), at least two elements share a residue mod \\(p\\). Does that help or hurt admissibility?',
                    solution: 'For a prime \\(p\\), admissibility requires the residues \\(\\{h_i \\bmod p\\}\\) to NOT cover all \\(p\\) residues. If \\(k > p\\), by pigeonhole two elements share a residue mod \\(p\\), so the set of distinct residues has size at most \\(k - 1\\). But we need it to have size at most \\(p - 1\\). This means: for primes \\(p \\le k\\), admissibility is a genuine constraint — the residues must miss at least one class. For primes \\(p > k\\), the residues can have at most \\(k < p\\) distinct values, so they automatically miss some class. Thus admissibility is only a constraint at primes \\(p \\le k\\).'
                }
            ]
        },

        // ================================================================
        // SECTION 4: Maynard-Tao
        // ================================================================
        {
            id: 'sec-maynard-tao',
            title: 'Maynard-Tao: H ≤ 246',
            content: `
<h2>The Maynard-Tao Method (2013-2014)</h2>

<div class="env-block intuition">
    <div class="env-title">A Different Sieve</div>
    <div class="env-body">
        <p>Zhang boosted the level of distribution for smooth moduli. Maynard and Tao (independently) took a completely different route: they redesigned the sieve weights to be <em>multidimensional</em>, allowing separate tuning for each element \\(n + h_i\\). This turns out to be far more efficient — it reduces the required \\(k\\) from millions to dozens, and gives finite bounds unconditionally without any new distribution input.</p>
    </div>
</div>

<h3>Multidimensional Sieve Weights</h3>

<p>Maynard-Tao replaces the rank-1 GPY weight with a general weight of the form</p>

\\[
w(n) = \\left(\\sum_{\\substack{d_i | (n+h_i) \\\\ d_i \\le R}} \\lambda_{d_1,\\ldots,d_k}\\right)^2,
\\]

<p>where \\(\\lambda_{d_1,\\ldots,d_k}\\) are free coefficients. After standard manipulations (using the Bombieri-Vinogradov theorem at level \\(1/2\\)), the optimization reduces to:</p>

\\[
\\text{Maximize} \\quad M_k(F) := \\frac{\\sum_{m=1}^{k} J_m(F)}{I(F)},
\\]

<p>where \\(F : [0,1]^k \\to \\mathbb{R}\\) is a smooth function, and</p>

\\[
I(F) = \\int_{[0,1]^k} F(t_1,\\ldots,t_k)^2 \\, dt_1 \\cdots dt_k,
\\]
\\[
J_m(F) = \\int_{[0,1]^{k-1}} \\left(\\int_0^1 F(t_1,\\ldots,t_k) \\, dt_m\\right)^2 dt_1 \\cdots \\widehat{dt_m} \\cdots dt_k.
\\]

<p>If \\(M_k(F) > 2\\), then infinitely many \\(n\\) have at least two elements of \\(n + \\mathcal{H}\\) prime (for any admissible \\(\\mathcal{H}\\)).</p>

<div class="env-block theorem">
    <div class="env-title">Theorem (Maynard, 2013; Tao, independently)</div>
    <div class="env-body">
        <p>For any admissible \\(k\\)-tuple \\(\\mathcal{H}\\), if \\(k \\ge 5\\), there exists \\(F\\) with \\(M_k(F) > 2\\). Consequently,</p>
        \\[\\liminf_{n \\to \\infty}(p_{n+1} - p_n) \\le 600.\\]
        <p>The Polymath8b collaboration further optimized the function \\(F\\) and the admissible tuple to obtain</p>
        \\[\\liminf_{n \\to \\infty}(p_{n+1} - p_n) \\le 246.\\]
        <p>Conditionally on Elliott-Halberstam: \\(\\liminf \\le 12\\). On the generalized Elliott-Halberstam conjecture: \\(\\liminf \\le 6\\).</p>
    </div>
</div>

<h3>The Optimization Problem</h3>

<p>The key insight is that \\(M_k\\) is a ratio of quadratic functionals in \\(F\\), so its maximization over functions supported on the simplex \\(\\{\\mathbf{t} : t_i \\ge 0, \\sum t_i \\le 1\\}\\) is a <em>variational eigenvalue problem</em>. Writing</p>

\\[
F(t_1,\\ldots,t_k) = \\sum_{\\mathbf{j}} a_{\\mathbf{j}} \\prod_{i=1}^k P_{j_i}(t_i),
\\]

<p>where \\(P_{j_i}\\) are Legendre polynomials, one obtains a finite-dimensional symmetric eigenvalue problem. The largest eigenvalue gives \\(\\sup_F M_k(F)\\).</p>

<p>For \\(k = 5\\), numerical optimization gives \\(M_5 \\approx 2.00558 > 2\\) — barely above the threshold. For \\(k = 105\\) (used in the \\(H \\le 246\\) proof), \\(M_{105}\\) is well above 2, allowing a 5-tuple argument that pins down the diameter to 246.</p>

<div class="viz-placeholder" data-viz="viz-maynard-simplex"></div>
`,
            visualizations: [
                {
                    id: 'viz-maynard-simplex',
                    title: 'Maynard-Tao Weight Function on the 2-Simplex',
                    description: 'For k=2, the optimal Maynard-Tao weight \\(F(t_1, t_2)\\) lives on the simplex \\(t_1 + t_2 \\le 1\\). Adjust the polynomial degree to see how the optimized \\(F\\) concentrates mass near the boundary.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, { width: 620, height: 380 });
                        var degVal = 2;
                        var modeVal = 0; // 0: optimal-like, 1: uniform

                        VizEngine.createSlider(controls, 'Degree', 1, 6, degVal, 1, function(v) {
                            degVal = Math.round(v);
                            drawFrame();
                        });

                        var modeBtn = VizEngine.createButton(controls, 'Toggle Mode', function() {
                            modeVal = 1 - modeVal;
                            drawFrame();
                        });

                        // Legendre polynomial evaluation (shifted to [0,1])
                        function legendre(n, x) {
                            // P_n on [0,1] via recursion
                            var t = 2 * x - 1;
                            if (n === 0) return 1;
                            if (n === 1) return t;
                            var p0 = 1, p1 = t, pk = 0;
                            for (var k = 2; k <= n; k++) {
                                pk = ((2 * k - 1) * t * p1 - (k - 1) * p0) / k;
                                p0 = p1; p1 = pk;
                            }
                            return p1;
                        }

                        function maynardF(t1, t2, deg) {
                            if (t1 + t2 > 1 || t1 < 0 || t2 < 0) return 0;
                            if (modeVal === 1) return (t1 + t2 < 1) ? 1 : 0;
                            // Approximate optimal: concentrate mass near edges of simplex
                            var s = t1 + t2;
                            if (s > 1) return 0;
                            var marginal1 = legendre(deg, t1);
                            var marginal2 = legendre(deg, t2);
                            return Math.abs(marginal1 * marginal2) * (1 - s);
                        }

                        function drawFrame() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var W = viz.width, Hv = viz.height;

                            var cx = W * 0.38, cy = Hv * 0.84;
                            var side = Math.min(W * 0.58, Hv * 0.72);
                            var v0 = [cx, cy];
                            var v1 = [cx + side, cy];
                            var v2 = [cx + side * 0.5, cy - side * Math.sqrt(3) / 2];

                            // Compute normalization
                            var maxVal = 0;
                            var samples = 60;
                            for (var pi = 0; pi <= samples; pi++) {
                                for (var qi = 0; qi <= samples - pi; qi++) {
                                    var t1 = pi / samples, t2 = qi / samples;
                                    var v = maynardF(t1, t2, degVal);
                                    if (v > maxVal) maxVal = v;
                                }
                            }
                            if (maxVal < 1e-10) maxVal = 1;

                            // Rasterize simplex
                            var imgData = ctx.createImageData(W, Hv);
                            var data = imgData.data;

                            for (var py = 0; py < Hv; py++) {
                                for (var px = 0; px < W; px++) {
                                    var dx = px - v0[0], dy = py - v0[1];
                                    var e1x = v1[0] - v0[0], e1y = v1[1] - v0[1];
                                    var e2x = v2[0] - v0[0], e2y = v2[1] - v0[1];
                                    var denom = e1x * e2y - e1y * e2x;
                                    if (Math.abs(denom) < 1e-10) continue;
                                    var s = (dx * e2y - dy * e2x) / denom;
                                    var t = (e1x * dy - e1y * dx) / denom;
                                    var u = 1 - s - t;
                                    if (s < -0.01 || t < -0.01 || u < -0.01) continue;

                                    var val = maynardF(s, t, degVal) / maxVal;
                                    var intensity = Math.min(1, Math.max(0, val));

                                    // Purple-blue-yellow colormap
                                    var r2, g2, b2;
                                    if (intensity < 0.5) {
                                        r2 = Math.round(188 * (1 - intensity * 2));
                                        g2 = Math.round(140 * (1 - intensity * 2));
                                        b2 = Math.round(255);
                                    } else {
                                        r2 = Math.round(255 * (intensity * 2 - 1));
                                        g2 = Math.round(220 * (intensity * 2 - 1));
                                        b2 = Math.round(255 * (1 - (intensity * 2 - 1)));
                                    }
                                    var idx = (py * W + px) * 4;
                                    data[idx] = r2; data[idx + 1] = g2; data[idx + 2] = b2; data[idx + 3] = 220;
                                }
                            }
                            ctx.putImageData(imgData, 0, 0);

                            // Simplex outline
                            ctx.strokeStyle = viz.colors.white;
                            ctx.lineWidth = 2;
                            ctx.beginPath();
                            ctx.moveTo(v0[0], v0[1]);
                            ctx.lineTo(v1[0], v1[1]);
                            ctx.lineTo(v2[0], v2[1]);
                            ctx.closePath();
                            ctx.stroke();

                            // Labels
                            ctx.fillStyle = viz.colors.white;
                            ctx.font = 'bold 12px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText('(0,0)', v0[0] - 20, v0[1] + 16);
                            ctx.fillText('(1,0)', v1[0] + 22, v1[1] + 16);
                            ctx.fillText('(0,1)', v2[0], v2[1] - 12);

                            ctx.fillStyle = viz.colors.teal;
                            ctx.fillText('t\u2081', (v0[0] + v1[0]) / 2, v0[1] + 22);
                            ctx.textAlign = 'right';
                            ctx.fillText('t\u2082', (v0[0] + v2[0]) / 2 - 12, (v0[1] + v2[1]) / 2);

                            // Compute M_k approximation
                            var I = 0, J = 0;
                            var N = 40;
                            for (var a = 0; a <= N; a++) {
                                for (var b2s = 0; b2s <= N - a; b2s++) {
                                    var t1s = a / N, t2s = b2s / N;
                                    var fval = maynardF(t1s, t2s, degVal);
                                    I += fval * fval;
                                    // J_1: integrate over t1, square, integrate over t2
                                }
                            }
                            I /= (N * N);

                            // Title
                            ctx.fillStyle = viz.colors.white;
                            ctx.font = 'bold 13px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText('Maynard-Tao F(t\u2081, t\u2082) on 2-simplex', W / 2, 22);
                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '11px -apple-system,sans-serif';
                            ctx.fillText('Mode: ' + (modeVal === 0 ? 'Degree-' + degVal + ' polynomial' : 'Uniform'), W / 2, 40);

                            // Legend bar
                            var legX = W * 0.76, legY0 = Hv * 0.25, legH = Hv * 0.45;
                            var grad = ctx.createLinearGradient(0, legY0, 0, legY0 + legH);
                            grad.addColorStop(0, 'rgb(255,220,0)');
                            grad.addColorStop(0.5, 'rgb(188,140,255)');
                            grad.addColorStop(1, 'rgb(0,20,80)');
                            ctx.fillStyle = grad;
                            ctx.fillRect(legX, legY0, 14, legH);
                            ctx.strokeStyle = '#30363d';
                            ctx.lineWidth = 1;
                            ctx.strokeRect(legX, legY0, 14, legH);
                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '10px -apple-system,sans-serif';
                            ctx.textAlign = 'left';
                            ctx.fillText('max', legX + 16, legY0 + 6);
                            ctx.fillText('0', legX + 16, legY0 + legH);
                        }

                        drawFrame();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'In the Maynard-Tao framework, the threshold is \\(M_k(F) > 2\\). Show that if \\(F(t_1,\\ldots,t_k) = \\prod_{i=1}^k g(t_i)\\) is a tensor product function, then \\(M_k(F)\\) simplifies to a one-dimensional ratio, and identify when it exceeds 2.',
                    hint: 'Use the fact that integrals of product functions factorize. Let \\(\\alpha = \\int_0^1 g^2\\) and \\(\\beta = (\\int_0^1 g)^2\\).',
                    solution: 'With \\(F = \\prod g(t_i)\\): \\(I(F) = \\alpha^k\\) where \\(\\alpha = \\int_0^1 g(t)^2 dt\\). For \\(J_m(F)\\): integrating out \\(t_m\\) gives \\(\\int_0^1 g(t_m) dt_m \\cdot \\prod_{i \\ne m} g(t_i)\\). Squaring and integrating: \\(J_m = \\beta \\cdot \\alpha^{k-1}\\) where \\(\\beta = (\\int_0^1 g(t) dt)^2\\). So \\(M_k(F) = k \\beta / \\alpha\\). This exceeds 2 when \\(k (\\int g)^2 / \\int g^2 > 2\\), i.e., when the Cauchy-Schwarz ratio \\((\\int g)^2 / \\int g^2\\) is large enough. For \\(g = 1_{[0,1]}\\): ratio = 1, need \\(k > 2\\); for \\(k = 3\\), \\(M_3 = 3 > 2\\). The tensor-product case was GPY\'s starting point; Maynard used non-tensor-product \\(F\\) to push \\(M_5 > 2\\) on the simplex.'
                }
            ]
        },

        // ================================================================
        // SECTION 5: Admissible k-Tuples
        // ================================================================
        {
            id: 'sec-k-tuples',
            title: 'Admissible k-Tuples',
            content: `
<h2>Admissible k-Tuples and Prime Constellations</h2>

<div class="env-block definition">
    <div class="env-title">Definition (Admissible Tuple)</div>
    <div class="env-body">
        <p>A finite set \\(\\mathcal{H} = \\{h_1, \\ldots, h_k\\} \\subset \\mathbb{Z}_{\\ge 0}\\) is <strong>admissible</strong> if for every prime \\(p\\), the reduction \\(\\mathcal{H} \\pmod{p}\\) does not cover all residues modulo \\(p\\). Equivalently, there exists a residue \\(r_p\\) such that \\(n \\equiv r_p \\pmod{p}\\) implies \\(n + h_i\\) is divisible by \\(p\\) for no \\(i\\).</p>
    </div>
</div>

<p>Admissibility is a necessary condition for the tuple to contain infinitely many prime constellations: if some prime \\(p\\) blocks the tuple, then for any \\(n\\), at least one of \\(n + h_1, \\ldots, n + h_k\\) is divisible by \\(p\\) (and hence not prime for large \\(n\\)).</p>

<h3>The Diameter Problem</h3>

<p>For fixed \\(k\\), what is the smallest diameter \\(D(k) = \\max_i h_i - \\min_i h_i\\) of an admissible \\(k\\)-tuple? Finding admissible tuples of small diameter is equivalent to the problem of finding small prime gaps: if the Maynard-Tao method proves bounded gaps for all admissible \\(k\\)-tuples (for \\(k\\) large enough), the bound depends on \\(D(k)\\).</p>

<p>For \\(k = 5\\), the smallest known admissible diameter is \\(D(5) = 12\\), achieved by \\(\\{0, 4, 6, 10, 12\\}\\). Under EH, this gives \\(\\liminf g_n \\le 12\\).</p>

<p>For \\(k = 105\\), the smallest known admissible 105-tuple has diameter 246, giving the current unconditional bound.</p>

<div class="env-block theorem">
    <div class="env-title">Theorem (Hardy-Littlewood Conjecture k-Tuple)</div>
    <div class="env-body">
        <p>For any admissible \\(k\\)-tuple \\(\\mathcal{H}\\), as \\(X \\to \\infty\\):</p>
        \\[
        \\#\\{n \\le X : n+h_1, \\ldots, n+h_k \\text{ all prime}\\} \\sim \\mathfrak{S}(\\mathcal{H}) \\frac{X}{(\\log X)^k},
        \\]
        <p>where the singular series is</p>
        \\[
        \\mathfrak{S}(\\mathcal{H}) = \\prod_{p} \\frac{1 - \\nu_p(\\mathcal{H})/p}{(1 - 1/p)^k}.
        \\]
        <p>Here \\(\\nu_p(\\mathcal{H}) = |\\mathcal{H} \\bmod p|\\) is the number of distinct residues of \\(\\mathcal{H}\\) modulo \\(p\\). The product converges absolutely for admissible \\(\\mathcal{H}\\) (where \\(\\nu_p < p\\) for all \\(p\\)).</p>
    </div>
</div>

<h3>Examples of Admissible Tuples</h3>

<table style="border-collapse:collapse;width:100%;margin:1em 0;">
    <thead>
        <tr style="border-bottom:1px solid #30363d;">
            <th style="text-align:left;padding:6px 12px;color:#8b949e;">k</th>
            <th style="text-align:left;padding:6px 12px;color:#8b949e;">Tuple</th>
            <th style="text-align:left;padding:6px 12px;color:#8b949e;">Diameter</th>
            <th style="text-align:left;padding:6px 12px;color:#8b949e;">Name</th>
        </tr>
    </thead>
    <tbody>
        <tr style="border-bottom:1px solid #1a1a40;">
            <td style="padding:6px 12px;">2</td>
            <td style="padding:6px 12px;">\\{0, 2\\}</td>
            <td style="padding:6px 12px;">2</td>
            <td style="padding:6px 12px;">Twin primes</td>
        </tr>
        <tr style="border-bottom:1px solid #1a1a40;">
            <td style="padding:6px 12px;">2</td>
            <td style="padding:6px 12px;">\\{0, 4\\}</td>
            <td style="padding:6px 12px;">4</td>
            <td style="padding:6px 12px;">Cousin primes</td>
        </tr>
        <tr style="border-bottom:1px solid #1a1a40;">
            <td style="padding:6px 12px;">3</td>
            <td style="padding:6px 12px;">\\{0, 2, 6\\}</td>
            <td style="padding:6px 12px;">6</td>
            <td style="padding:6px 12px;">Prime triplet</td>
        </tr>
        <tr style="border-bottom:1px solid #1a1a40;">
            <td style="padding:6px 12px;">4</td>
            <td style="padding:6px 12px;">\\{0, 6, 12, 18\\}</td>
            <td style="padding:6px 12px;">18</td>
            <td style="padding:6px 12px;">Arithmetic progression</td>
        </tr>
        <tr style="border-bottom:1px solid #1a1a40;">
            <td style="padding:6px 12px;">5</td>
            <td style="padding:6px 12px;">\\{0, 4, 6, 10, 12\\}</td>
            <td style="padding:6px 12px;">12</td>
            <td style="padding:6px 12px;">Optimal 5-tuple</td>
        </tr>
    </tbody>
</table>

<div class="viz-placeholder" data-viz="viz-prime-constellations"></div>
`,
            visualizations: [
                {
                    id: 'viz-prime-constellations',
                    title: 'Prime Constellations: Counting Patterns',
                    description: 'Count how many times each admissible pattern \\((p, p+h_1, \\ldots, p+h_k)\\) occurs among primes up to \\(N\\). Observe how the counts match the Hardy-Littlewood prediction.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, { width: 680, height: 360 });
                        var Nmax = 5000;
                        var selectedPattern = 0;

                        var patterns = [
                            { name: 'Twin (0,2)',          H: [0, 2],        color: '#58a6ff' },
                            { name: 'Cousin (0,4)',        H: [0, 4],        color: '#3fb9a0' },
                            { name: 'Sexy (0,6)',          H: [0, 6],        color: '#f0883e' },
                            { name: 'Triplet (0,2,6)',     H: [0, 2, 6],     color: '#bc8cff' },
                            { name: 'Triplet (0,4,6)',     H: [0, 4, 6],     color: '#d29922' },
                            { name: 'Quad (0,2,6,8)',      H: [0, 2, 6, 8],  color: '#3fb950' },
                            { name: 'Opt-5 (0,4,6,10,12)',H: [0,4,6,10,12], color: '#f778ba' },
                        ];

                        // Sieve primes
                        var sieve = new Uint8Array(Nmax + 20);
                        var isPrime = new Uint8Array(Nmax + 20);
                        for (var i = 2; i < sieve.length; i++) {
                            if (!sieve[i]) {
                                isPrime[i] = 1;
                                for (var j = i * i; j < sieve.length; j += i) sieve[j] = 1;
                            }
                        }

                        // Count pattern occurrences up to each N
                        function countPattern(H, limit) {
                            var counts = new Array(limit + 1).fill(0);
                            var cum = 0;
                            for (var n = 2; n <= limit; n++) {
                                var allPrime = true;
                                for (var i = 0; i < H.length; i++) {
                                    if (n + H[i] >= isPrime.length || !isPrime[n + H[i]]) { allPrime = false; break; }
                                }
                                if (allPrime) cum++;
                                counts[n] = cum;
                            }
                            return counts;
                        }

                        // Hardy-Littlewood singular series (crude estimate)
                        function singularSeries(H) {
                            var primes = VizEngine.sievePrimes(200);
                            var prod = 1;
                            for (var pi = 0; pi < primes.length; pi++) {
                                var p = primes[pi];
                                var residues = new Set(H.map(function(h) { return ((h % p) + p) % p; }));
                                var nu = residues.size;
                                var factor = (1 - nu / p) / Math.pow(1 - 1 / p, H.length);
                                prod *= factor;
                            }
                            return Math.max(0, prod);
                        }

                        // Precompute counts
                        var allCounts = patterns.map(function(pat) { return countPattern(pat.H, Nmax); });
                        var allSS = patterns.map(function(pat) { return singularSeries(pat.H); });

                        var NSlider = VizEngine.createSlider(controls, 'N', 100, Nmax, 2000, 50, function(v) {
                            Nmax = v;
                            draw();
                        });

                        // Pattern selector buttons
                        patterns.forEach(function(pat, idx) {
                            var btn = document.createElement('button');
                            btn.textContent = pat.name;
                            btn.style.cssText = 'padding:2px 8px;margin:2px;border:1px solid ' + pat.color + ';border-radius:4px;background:' + (idx === selectedPattern ? pat.color + '44' : '#1a1a40') + ';color:' + pat.color + ';font-size:0.72rem;cursor:pointer;';
                            btn.addEventListener('click', function() {
                                selectedPattern = idx;
                                draw();
                                // Update button styles
                                controls.querySelectorAll('button[data-pat]').forEach(function(b, i) {
                                    b.style.background = (i === selectedPattern) ? patterns[i].color + '44' : '#1a1a40';
                                });
                            });
                            btn.setAttribute('data-pat', idx);
                            controls.appendChild(btn);
                        });

                        var showAll = false;
                        VizEngine.createButton(controls, 'Toggle All', function() { showAll = !showAll; draw(); });

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var W = viz.width, Hv = viz.height;
                            var pad = { l: 58, r: 20, t: 40, b: 50 };
                            var cw = W - pad.l - pad.r, ch = Hv - pad.t - pad.b;

                            var N = parseInt(NSlider.value, 10) || 2000;

                            ctx.fillStyle = viz.colors.white;
                            ctx.font = 'bold 13px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText('Prime Constellation Counts up to N = ' + N.toLocaleString(), W / 2, 22);

                            // Axes
                            ctx.strokeStyle = viz.colors.axis;
                            ctx.lineWidth = 1.5;
                            ctx.beginPath(); ctx.moveTo(pad.l, pad.t); ctx.lineTo(pad.l, pad.t + ch); ctx.stroke();
                            ctx.beginPath(); ctx.moveTo(pad.l, pad.t + ch); ctx.lineTo(pad.l + cw, pad.t + ch); ctx.stroke();

                            var maxCount = 0;
                            var toShow = showAll ? patterns.map(function(_, i) { return i; }) : [selectedPattern];
                            toShow.forEach(function(idx) {
                                var c = allCounts[idx][Math.min(N, allCounts[idx].length - 1)];
                                if (c > maxCount) maxCount = c;
                            });
                            if (maxCount < 5) maxCount = 5;

                            // Grid
                            var nSteps = 5, ySteps = 4;
                            for (var yi = 0; yi <= ySteps; yi++) {
                                var val = maxCount * yi / ySteps;
                                var yy = pad.t + ch - (val / maxCount) * ch;
                                ctx.strokeStyle = viz.colors.grid; ctx.lineWidth = 0.5;
                                ctx.beginPath(); ctx.moveTo(pad.l, yy); ctx.lineTo(pad.l + cw, yy); ctx.stroke();
                                ctx.fillStyle = viz.colors.text; ctx.font = '10px -apple-system,sans-serif';
                                ctx.textAlign = 'right';
                                ctx.fillText(Math.round(val), pad.l - 4, yy + 3);
                            }
                            for (var xi = 0; xi <= nSteps; xi++) {
                                var xN = Math.round(N * xi / nSteps);
                                var xx = pad.l + (xN / N) * cw;
                                ctx.strokeStyle = viz.colors.grid; ctx.lineWidth = 0.5;
                                ctx.beginPath(); ctx.moveTo(xx, pad.t); ctx.lineTo(xx, pad.t + ch); ctx.stroke();
                                ctx.fillStyle = viz.colors.text; ctx.font = '10px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.fillText(xN.toLocaleString(), xx, pad.t + ch + 14);
                            }

                            // Draw count curves
                            toShow.forEach(function(idx) {
                                var pat = patterns[idx];
                                var counts = allCounts[idx];
                                var ss = allSS[idx];

                                // Actual count
                                ctx.strokeStyle = pat.color;
                                ctx.lineWidth = 2;
                                ctx.beginPath();
                                var step = Math.max(1, Math.floor(N / 200));
                                for (var n2 = 2; n2 <= N; n2 += step) {
                                    var c2 = counts[Math.min(n2, counts.length - 1)];
                                    var xp = pad.l + (n2 / N) * cw;
                                    var yp = pad.t + ch - (c2 / maxCount) * ch;
                                    if (n2 === 2) ctx.moveTo(xp, yp); else ctx.lineTo(xp, yp);
                                }
                                ctx.stroke();

                                // HL prediction: ss * N / (log N)^k
                                if (ss > 0) {
                                    ctx.strokeStyle = pat.color + '66';
                                    ctx.lineWidth = 1.5;
                                    ctx.setLineDash([5, 3]);
                                    ctx.beginPath();
                                    var k = pat.H.length;
                                    for (var n3 = 10; n3 <= N; n3 += step) {
                                        var pred = ss * n3 / Math.pow(Math.log(n3), k);
                                        var xp2 = pad.l + (n3 / N) * cw;
                                        var yp2 = pad.t + ch - (pred / maxCount) * ch;
                                        if (n3 === 10) ctx.moveTo(xp2, yp2); else ctx.lineTo(xp2, yp2);
                                    }
                                    ctx.stroke();
                                    ctx.setLineDash([]);
                                }

                                // Label
                                var finalCount = counts[Math.min(N, counts.length - 1)];
                                var finalX = pad.l + cw;
                                var finalY = pad.t + ch - (finalCount / maxCount) * ch;
                                ctx.fillStyle = pat.color;
                                ctx.font = '10px -apple-system,sans-serif';
                                ctx.textAlign = 'right';
                                ctx.fillText(pat.name + ': ' + finalCount, finalX - 2, finalY - 4);
                            });

                            // Legend
                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '10px -apple-system,sans-serif';
                            ctx.textAlign = 'left';
                            ctx.fillText('solid = actual, dashed = HL prediction', pad.l + 4, pad.t + ch + 36);
                        }

                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Compute \\(\\mathfrak{S}(\\{0,2\\})\\) explicitly, the Hardy-Littlewood constant for twin primes. Show that the product over primes converges absolutely.',
                    hint: 'For \\(p = 2\\): the residues \\(\\{0, 2\\} \\pmod{2} = \\{0, 0\\}\\) so \\(\\nu_2 = 1\\). For odd \\(p\\): \\(\\nu_p = 2\\) (since \\(0 \\not\\equiv 2 \\pmod{p}\\) for \\(p > 2\\)).',
                    solution: 'For the twin prime tuple \\(\\{0,2\\}\\): At \\(p=2\\): residues \\(\\{0,0\\}\\) give \\(\\nu_2 = 1\\), factor \\(= (1-1/2)/(1-1/2)^2 = 2\\). At odd \\(p\\): \\(\\nu_p = 2\\), factor \\(= (1-2/p)/(1-1/p)^2 = p(p-2)/(p-1)^2\\). So \\(\\mathfrak{S}(\\{0,2\\}) = 2\\prod_{p\\ge 3} p(p-2)/(p-1)^2 \\approx 1.3203\\). The product converges absolutely because \\(p(p-2)/(p-1)^2 = 1 - 1/(p-1)^2\\), and \\(\\sum_p 1/(p-1)^2 < \\infty\\).'
                },
                {
                    question: 'Among the tuples \\(\\{0,2\\}\\), \\(\\{0,4\\}\\), \\(\\{0,6\\}\\), \\(\\{0,2,6\\}\\), which are admissible? For any non-admissible ones, identify the blocking prime.',
                    hint: 'Check each prime \\(p \\le k+1\\) (primes larger than \\(k\\) cannot block a \\(k\\)-element set).',
                    solution: '\\(\\{0,2\\}\\): mod 2: residues \\(\\{0\\}\\) (only 1 class), not blocking; mod 3: \\{0,2\\}, missing 1. Admissible. \\(\\{0,4\\}\\): mod 2: \\{0\\}; mod 3: \\{0,1\\}, missing 2. Admissible. \\(\\{0,6\\}\\): mod 2: \\{0\\}; mod 3: \\{0,0\\} = \\{0\\}, missing 1,2. Admissible (but note the same residue mod 3 means local obstructions are mild). \\(\\{0,2,6\\}\\): mod 2: \\{0\\}; mod 3: \\{0,2,0\\} = \\{0,2\\}, missing 1. Admissible.'
                }
            ]
        },

        // ================================================================
        // SECTION 6: Computation Meets Theory
        // ================================================================
        {
            id: 'sec-bridge',
            title: 'Computation Meets Theory',
            content: `
<h2>Computation Meets Theory: The Polymath Collaboration</h2>

<div class="env-block intuition">
    <div class="env-title">Open Mathematics in Real Time</div>
    <div class="env-body">
        <p>Polymath8, launched by Tao in June 2013, was a massively collaborative effort to reduce Zhang's 70-million bound. It involved hundreds of mathematicians, operated entirely in public via blog posts and wiki pages, and produced two papers (Polymath8a and 8b) that collectively reduced the bound from 70M to 246. It is one of the most successful examples of open collaborative mathematics.</p>
    </div>
</div>

<h3>The Two Phases</h3>

<p><strong>Polymath8a</strong> (June-November 2013): Improved Zhang's argument by sharpening the exponential sum bounds and optimizing the choice of smooth moduli. The bound moved from 70,000,000 to 4,680. The key technical improvement was a better treatment of the "Type II" sums in Zhang's argument using Deligne's bound on Kloosterman-type exponential sums.</p>

<p><strong>Polymath8b</strong> (November 2013-June 2014): Incorporated Maynard's new sieve framework. This replaced Zhang's large-\\(k\\) approach with the multidimensional sieve, reduced the required \\(k\\) to about 105, and required finding admissible 105-tuples of small diameter. The combination gave \\(H \\le 246\\).</p>

<h3>The Diameter Problem as a Computation</h3>

<p>Finding a small admissible \\(k\\)-tuple is a combinatorial optimization problem: given \\(k\\), minimize the diameter \\(D = h_k - h_1\\) subject to admissibility. For \\(k = 105\\), this requires</p>

<ul>
    <li>Checking admissibility at all primes \\(p \\le k = 105\\) (only these can block).</li>
    <li>The number of residues \\(\\nu_p \\le \\min(k, p-1)\\), so for large primes \\(p > k\\) the constraint is automatic.</li>
    <li>For primes \\(p \\le k\\): we need to arrange 105 offsets so they do not cover all \\(p\\) residues. A greedy construction using arithmetic progressions works.</li>
</ul>

<p>The \\(H \\le 246\\) bound comes from an admissible 105-tuple with diameter 246. The explicit tuple was found computationally.</p>

<h3>Conditional Improvements</h3>

<div class="env-block theorem">
    <div class="env-title">Theorem (Polymath8b, under Elliott-Halberstam)</div>
    <div class="env-body">
        <p>Assume the Elliott-Halberstam conjecture: for all \\(A > 0\\) and all \\(\\varepsilon > 0\\),</p>
        \\[\\sum_{q \\le X^{1-\\varepsilon}} \\max_{(a,q)=1} \\left|\\psi(X; q, a) - \\frac{X}{\\phi(q)}\\right| \\ll_A X (\\log X)^{-A}.\\]
        <p>Then \\(\\liminf(p_{n+1} - p_n) \\le 12\\), achieved by the admissible 5-tuple \\(\\{0, 4, 6, 10, 12\\}\\).</p>
        <p>Under the <em>generalized</em> Elliott-Halberstam conjecture (allowing correlations between primes in progressions), the bound drops to \\(\\le 6\\), corresponding to the admissible pair \\(\\{0, 6\\}\\).</p>
    </div>
</div>

<h3>What Remains</h3>

<p>The gap between \\(H \\le 246\\) and the twin prime conjecture (\\(H = 2\\)) remains. Current methods hit a fundamental barrier: the Maynard-Tao sieve cannot prove \\(M_k > m\\) for \\(m \\ge k\\) with fixed \\(k\\), due to parity obstructions (Selberg's parity barrier). To prove twin primes, new ideas beyond sieve theory are needed.</p>

<div class="env-block remark">
    <div class="env-title">Selberg's Parity Barrier</div>
    <div class="env-body">
        <p>The parity barrier, discovered by Atle Selberg, says that sieve methods cannot distinguish between numbers with an even and an odd number of prime factors. Specifically, if \\(\\lambda\\) is a sieve weight with support on products of at most \\(k\\) primes, then \\(\\sum_{n \\le X} \\lambda(n) \\mathbf{1}[n \\text{ prime}]\\) is difficult to make positive unless supplemented with non-sieve input. The twin prime conjecture requires telling apart \\((p, p+2)\\) from \\((p, p+2)\\) where one of the pair is a product of two primes — exactly the parity distinction that sieves cannot make.</p>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-polymath-collaboration"></div>
`,
            visualizations: [
                {
                    id: 'viz-polymath-collaboration',
                    title: 'Polymath8 Progress: Interactive Timeline',
                    description: 'Click on each phase to see the mathematical technique responsible for each reduction. Hover over nodes for contributor details.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, { width: 700, height: 400 });

                        var events = [
                            {
                                date: 'May 2013',
                                bound: 70000000,
                                title: 'Zhang\'s Paper',
                                who: 'Zhang Yitang',
                                technique: 'Equidistribution for smooth squarefree moduli beyond level 1/2; exponential sum bounds via Weil/Deligne',
                                color: '#f85149',
                                phase: 'Zhang'
                            },
                            {
                                date: 'Jun 2013',
                                bound: 59874594,
                                title: 'First Polymath Reduction',
                                who: 'Polymath8a',
                                technique: 'Optimization of admissible tuple; tighter bounds on Type I/II sums',
                                color: '#f0883e',
                                phase: '8a'
                            },
                            {
                                date: 'Jul 2013',
                                bound: 4680,
                                title: 'Polymath8a Final',
                                who: 'Polymath8a',
                                technique: 'Kloosterman sums; Deligne\'s bounds; optimal GPY parameters',
                                color: '#d29922',
                                phase: '8a'
                            },
                            {
                                date: 'Nov 2013',
                                bound: 600,
                                title: 'Maynard\'s Method',
                                who: 'James Maynard (& Tao independently)',
                                technique: 'Multidimensional sieve weights; variational eigenvalue problem; k=5 suffices',
                                color: '#3fb950',
                                phase: 'Maynard'
                            },
                            {
                                date: 'Feb 2014',
                                bound: 252,
                                title: 'Polymath8b',
                                who: 'Polymath8b',
                                technique: 'Optimal 5-tuple {0,4,6,10,12} under EH gives 12; numerical optimization of M_k; k=105 tuple search',
                                color: '#58a6ff',
                                phase: '8b'
                            },
                            {
                                date: 'Apr 2014',
                                bound: 246,
                                title: 'Current Best',
                                who: 'Polymath8b',
                                technique: 'Admissible 105-tuple with diameter 246; sharper M_k optimization',
                                color: '#bc8cff',
                                phase: '8b'
                            }
                        ];

                        var selected = -1;

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var W = viz.width, Hv = viz.height;

                            // Timeline
                            var pad = { l: 70, r: 30, t: 50, b: 140 };
                            var cw = W - pad.l - pad.r;
                            var timeY = pad.t + (Hv - pad.t - pad.b) * 0.5;

                            ctx.fillStyle = viz.colors.white;
                            ctx.font = 'bold 14px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText('Polymath8 Collaboration Timeline', W / 2, 24);

                            // Timeline line
                            ctx.strokeStyle = viz.colors.axis;
                            ctx.lineWidth = 2;
                            ctx.beginPath();
                            ctx.moveTo(pad.l, timeY);
                            ctx.lineTo(pad.l + cw, timeY);
                            ctx.stroke();

                            // Scale
                            var logMax = Math.log10(70000001);
                            function nodeX(i) { return pad.l + (i / (events.length - 1)) * cw; }

                            events.forEach(function(ev, i) {
                                var x = nodeX(i);
                                var logB = Math.log10(ev.bound + 1);
                                // Node position: y = timeY - scaled by log
                                var yOff = (logB / logMax) * (Hv - pad.t - pad.b - 80) * 0.5;
                                var y = timeY - yOff;

                                // Vertical stem
                                ctx.strokeStyle = ev.color + '66';
                                ctx.lineWidth = 1;
                                ctx.setLineDash([3, 3]);
                                ctx.beginPath(); ctx.moveTo(x, timeY); ctx.lineTo(x, y); ctx.stroke();
                                ctx.setLineDash([]);

                                // Node
                                var r = (i === selected) ? 12 : 8;
                                ctx.fillStyle = ev.color + '33';
                                ctx.beginPath(); ctx.arc(x, y, r + 4, 0, Math.PI * 2); ctx.fill();
                                ctx.fillStyle = ev.color;
                                ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();

                                // Date label
                                ctx.fillStyle = ev.color;
                                ctx.font = 'bold 9px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.fillText(ev.date, x, timeY + 16);

                                // Bound label near node
                                ctx.fillStyle = viz.colors.white;
                                ctx.font = 'bold 9px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                var bStr = ev.bound >= 1000000 ? (ev.bound / 1000000).toFixed(0) + 'M' : ev.bound.toLocaleString();
                                var labelY = y - r - 6;
                                if (i % 2 === 1) labelY = y + r + 14;
                                ctx.fillText(bStr, x, labelY);
                            });

                            // Detail panel for selected
                            if (selected >= 0) {
                                var ev = events[selected];
                                var panelX = 10, panelY = Hv - 128, panelW = W - 20, panelH = 118;
                                ctx.fillStyle = '#0c0c20';
                                ctx.strokeStyle = ev.color;
                                ctx.lineWidth = 1.5;
                                ctx.beginPath(); ctx.roundRect(panelX, panelY, panelW, panelH, 6); ctx.fill(); ctx.stroke();

                                ctx.fillStyle = ev.color;
                                ctx.font = 'bold 13px -apple-system,sans-serif';
                                ctx.textAlign = 'left';
                                ctx.fillText(ev.title + ' (' + ev.date + ')', panelX + 10, panelY + 20);

                                ctx.fillStyle = viz.colors.text;
                                ctx.font = '11px -apple-system,sans-serif';
                                ctx.fillText('By: ' + ev.who, panelX + 10, panelY + 38);

                                ctx.fillStyle = viz.colors.white;
                                ctx.font = '11px -apple-system,sans-serif';
                                var words = ev.technique.split(' ');
                                var lines = [], line = '';
                                words.forEach(function(w) {
                                    if ((line + w).length > 85) { lines.push(line.trim()); line = ''; }
                                    line += w + ' ';
                                });
                                if (line.trim()) lines.push(line.trim());
                                lines.slice(0, 3).forEach(function(l, li) {
                                    ctx.fillText(l, panelX + 10, panelY + 58 + li * 18);
                                });

                                ctx.fillStyle = ev.color;
                                ctx.font = 'bold 14px -apple-system,sans-serif';
                                ctx.textAlign = 'right';
                                ctx.fillText('H \u2264 ' + ev.bound.toLocaleString(), panelX + panelW - 10, panelY + 20);
                            } else {
                                ctx.fillStyle = viz.colors.text;
                                ctx.font = '11px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.fillText('Click a node to see the mathematical technique behind each breakthrough', W / 2, Hv - 70);
                            }
                        }

                        viz.canvas.addEventListener('click', function(e) {
                            var r = viz.canvas.getBoundingClientRect();
                            var mx = e.clientX - r.left, my = e.clientY - r.top;
                            var pad = { l: 70, r: 30, t: 50, b: 140 };
                            var cw = viz.width - pad.l - pad.r;
                            var timeY = pad.t + (viz.height - pad.t - pad.b) * 0.5;
                            var logMax = Math.log10(70000001);
                            function nodeX(i) { return pad.l + (i / (events.length - 1)) * cw; }

                            selected = -1;
                            events.forEach(function(ev, i) {
                                var x = nodeX(i);
                                var logB = Math.log10(ev.bound + 1);
                                var yOff = (logB / logMax) * (viz.height - pad.t - pad.b - 80) * 0.5;
                                var y = timeY - yOff;
                                if (Math.sqrt((mx - x) ** 2 + (my - y) ** 2) < 16) selected = i;
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
                    question: 'The Elliott-Halberstam conjecture (EH) states that primes are equidistributed in progressions up to level \\(Q = X^{1-\\varepsilon}\\). Under EH, the Maynard-Tao method gives \\(\\liminf g_n \\le 12\\). Explain why this uses \\(k = 5\\) rather than \\(k = 105\\), and why the admissible 5-tuple \\(\\{0,4,6,10,12\\}\\) has diameter 12.',
                    hint: 'Under EH, the sieve weight can be extended to level \\(R = X^{1/2 - \\varepsilon}\\) in one factor and \\(X^{\\varepsilon}\\) in another, effectively using level \\(R = X^{1/2}\\) in the cross terms. This makes \\(M_k > 2\\) achievable for smaller \\(k\\).',
                    solution: 'Under Bombieri-Vinogradov (level \\(1/2\\)), \\(M_k > 2\\) requires \\(k \\ge 5\\) (barely satisfied at \\(k=5\\) with \\(M_5 \\approx 2.006\\)). Under EH (effective level \\(1 - \\varepsilon\\) instead of \\(1/2\\)), the weights can be taken with \\(R = X^{1/2+\\delta}\\) for some \\(\\delta > 0\\), and this improves the ratio \\(M_k\\) for all \\(k\\). Specifically, \\(M_k^{\\text{EH}} > 2\\) is achievable even for \\(k = 5\\). The admissible 5-tuple \\(\\{0,4,6,10,12\\}\\): check mod 2: all even, so \\(\\nu_2 = 1\\) (admissible); mod 3: \\{0,1,0,1,0\\} = \\{0,1\\}, \\(\\nu_3 = 2 < 3\\) (admissible); mod 5: \\{0,4,1,0,2\\} = \\{0,1,2,4\\}, \\(\\nu_5 = 4 < 5\\) (admissible). Diameter = 12 - 0 = 12.'
                },
                {
                    question: 'Selberg\'s parity barrier says that sieve methods cannot distinguish \\(\\Omega(n) \\equiv 0 \\pmod{2}\\) from \\(\\Omega(n) \\equiv 1 \\pmod{2}\\), where \\(\\Omega(n)\\) is the number of prime factors counted with multiplicity. Why does this barrier prevent proving the twin prime conjecture from current sieve methods alone?',
                    hint: 'Consider the two cases: \\(n+2\\) prime (odd number of prime factors) versus \\(n+2 = p \\cdot q\\) for two primes \\(p, q\\) (even number of prime factors).',
                    solution: 'The twin prime conjecture requires showing that \\(n+2\\) is prime — i.e., \\(\\Omega(n+2) = 1\\), which is an odd count. Sieve methods naturally produce weights \\(\\lambda\\) that are multiplicative-in-structure; the Liouville function \\(\\lambda(n) = (-1)^{\\Omega(n)}\\) is orthogonal to any such sieve weight in an averaged sense. Concretely: if we try to show \\(\\sum_{n \\le X} w(n) \\mathbf{1}[n+2 \\text{ prime}] > 0\\), the sieve cannot rule out a "parity-biased" conspiracy where \\(w(n)\\) concentrates on \\(n+2 = p_1 p_2\\) (two-prime products, contributing the opposite sign in Liouville) rather than on \\(n+2\\) prime. Breaking the parity barrier requires arithmetic information beyond equidistribution in progressions, such as correlations between \\(\\Lambda(n)\\) and \\(\\Lambda(n+2)\\) (the twin prime correlation) — which is precisely what we want to prove.'
                }
            ]
        }
    ]
});
