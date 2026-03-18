// === VizEngine: Visualization toolkit for interactive math ===
class VizEngine {
    constructor(container, opts = {}) {
        // Responsive: use container width if available, but respect explicit opts
        const containerWidth = container.clientWidth ? container.clientWidth - 32 : 0;
        const defaultWidth = containerWidth > 560 ? Math.min(containerWidth, 900) : 560;
        this.width = opts.width || defaultWidth;
        this.height = opts.height || Math.round(this.width * 0.65);
        this.scale = opts.scale || 40;
        this.originX = opts.originX ?? this.width / 2;
        this.originY = opts.originY ?? this.height / 2;

        const dpr = window.devicePixelRatio || 1;
        this.canvas = document.createElement('canvas');
        this.canvas.width = this.width * dpr;
        this.canvas.height = this.height * dpr;
        this.canvas.style.width = this.width + 'px';
        this.canvas.style.height = this.height + 'px';
        this.ctx = this.canvas.getContext('2d');
        this.ctx.scale(dpr, dpr);
        container.appendChild(this.canvas);

        this.colors = {
            bg:'#0c0c20', grid:'#1a1a40', axis:'#4a4a7a', text:'#8b949e',
            white:'#f0f6fc', blue:'#58a6ff', teal:'#3fb9a0', orange:'#f0883e',
            green:'#3fb950', purple:'#bc8cff', red:'#f85149', yellow:'#d29922', pink:'#f778ba'
        };
        this.draggables = [];
        this.animationId = null;
        this._dragBound = false;
        this.dragState = null;
    }

    toScreen(x, y) { return [this.originX + x * this.scale, this.originY - y * this.scale]; }
    toMath(sx, sy) { return [(sx - this.originX) / this.scale, (this.originY - sy) / this.scale]; }

    clear() {
        this.ctx.fillStyle = this.colors.bg;
        this.ctx.fillRect(0, 0, this.width, this.height);
    }

    drawGrid(spacing = 1) {
        const ctx = this.ctx;
        const minX = Math.floor(-this.originX / this.scale / spacing) * spacing;
        const maxX = Math.ceil((this.width - this.originX) / this.scale / spacing) * spacing;
        const minY = Math.floor(-(this.height - this.originY) / this.scale / spacing) * spacing;
        const maxY = Math.ceil(this.originY / this.scale / spacing) * spacing;
        ctx.strokeStyle = this.colors.grid; ctx.lineWidth = 0.5;
        for (let x = minX; x <= maxX; x += spacing) {
            const [sx] = this.toScreen(x, 0);
            ctx.beginPath(); ctx.moveTo(sx, 0); ctx.lineTo(sx, this.height); ctx.stroke();
        }
        for (let y = minY; y <= maxY; y += spacing) {
            const [, sy] = this.toScreen(0, y);
            ctx.beginPath(); ctx.moveTo(0, sy); ctx.lineTo(this.width, sy); ctx.stroke();
        }
    }

    drawAxes() {
        const ctx = this.ctx;
        ctx.strokeStyle = this.colors.axis; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(0, this.originY); ctx.lineTo(this.width, this.originY); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(this.originX, 0); ctx.lineTo(this.originX, this.height); ctx.stroke();
        ctx.fillStyle = this.colors.text; ctx.font = '11px -apple-system,sans-serif';
        ctx.textAlign = 'center'; ctx.textBaseline = 'top';
        const minX = Math.ceil(-this.originX / this.scale), maxX = Math.floor((this.width - this.originX) / this.scale);
        for (let x = minX; x <= maxX; x++) { if (x === 0) continue; const [sx] = this.toScreen(x, 0); ctx.fillText(x, sx, this.originY + 4); }
        ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
        const minY = Math.ceil(-(this.height - this.originY) / this.scale), maxY = Math.floor(this.originY / this.scale);
        for (let y = minY; y <= maxY; y++) { if (y === 0) continue; const [, sy] = this.toScreen(0, y); ctx.fillText(y, this.originX - 6, sy); }
    }

    drawVector(x1, y1, x2, y2, color, label, lw = 2) {
        const ctx = this.ctx;
        const [sx1, sy1] = this.toScreen(x1, y1);
        const [sx2, sy2] = this.toScreen(x2, y2);
        const dx = sx2 - sx1, dy = sy2 - sy1, len = Math.sqrt(dx * dx + dy * dy);
        if (len < 1) return;
        const angle = Math.atan2(dy, dx);
        ctx.strokeStyle = color; ctx.lineWidth = lw;
        ctx.beginPath(); ctx.moveTo(sx1, sy1); ctx.lineTo(sx2 - Math.cos(angle) * 10, sy2 - Math.sin(angle) * 10); ctx.stroke();
        ctx.fillStyle = color; ctx.beginPath();
        ctx.moveTo(sx2, sy2);
        ctx.lineTo(sx2 - 12 * Math.cos(angle - Math.PI / 6), sy2 - 12 * Math.sin(angle - Math.PI / 6));
        ctx.lineTo(sx2 - 12 * Math.cos(angle + Math.PI / 6), sy2 - 12 * Math.sin(angle + Math.PI / 6));
        ctx.closePath(); ctx.fill();
        if (label) {
            const ux = -dy / len, uy = dx / len;
            ctx.fillStyle = color; ctx.font = 'bold 14px -apple-system,sans-serif';
            ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
            ctx.fillText(label, (sx1 + sx2) / 2 + ux * 16, (sy1 + sy2) / 2 + uy * 16);
        }
    }

    drawPoint(x, y, color, label, r = 5) {
        const ctx = this.ctx; const [sx, sy] = this.toScreen(x, y);
        ctx.fillStyle = color; ctx.beginPath(); ctx.arc(sx, sy, r, 0, Math.PI * 2); ctx.fill();
        if (label) { ctx.fillStyle = color; ctx.font = '12px -apple-system,sans-serif'; ctx.textAlign = 'left'; ctx.textBaseline = 'bottom'; ctx.fillText(label, sx + r + 4, sy - r); }
    }

    drawLine(x1, y1, x2, y2, color, lw = 1, dashed = false) {
        const ctx = this.ctx;
        const [sx1, sy1] = this.toScreen(x1, y1), [sx2, sy2] = this.toScreen(x2, y2);
        const dx = sx2 - sx1, dy = sy2 - sy1, len = Math.sqrt(dx * dx + dy * dy);
        if (len < 0.1) return;
        const ux = dx / len, uy = dy / len, ext = Math.max(this.width, this.height) * 2;
        ctx.strokeStyle = color; ctx.lineWidth = lw;
        if (dashed) ctx.setLineDash([6, 4]);
        ctx.beginPath(); ctx.moveTo(sx1 - ux * ext, sy1 - uy * ext); ctx.lineTo(sx2 + ux * ext, sy2 + uy * ext); ctx.stroke();
        if (dashed) ctx.setLineDash([]);
    }

    drawSegment(x1, y1, x2, y2, color, lw = 1, dashed = false) {
        const ctx = this.ctx;
        const [sx1, sy1] = this.toScreen(x1, y1), [sx2, sy2] = this.toScreen(x2, y2);
        ctx.strokeStyle = color; ctx.lineWidth = lw;
        if (dashed) ctx.setLineDash([6, 4]);
        ctx.beginPath(); ctx.moveTo(sx1, sy1); ctx.lineTo(sx2, sy2); ctx.stroke();
        if (dashed) ctx.setLineDash([]);
    }

    drawPolygon(points, fill, stroke, lw = 1) {
        const ctx = this.ctx; ctx.beginPath();
        points.forEach(([x, y], i) => { const [sx, sy] = this.toScreen(x, y); i === 0 ? ctx.moveTo(sx, sy) : ctx.lineTo(sx, sy); });
        ctx.closePath();
        if (fill) { ctx.fillStyle = fill; ctx.fill(); }
        if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw; ctx.stroke(); }
    }

    drawCircle(cx, cy, r, fill, stroke, lw = 1) {
        const ctx = this.ctx; const [sx, sy] = this.toScreen(cx, cy);
        ctx.beginPath(); ctx.arc(sx, sy, r * this.scale, 0, Math.PI * 2);
        if (fill) { ctx.fillStyle = fill; ctx.fill(); }
        if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw; ctx.stroke(); }
    }

    drawEllipse(cx, cy, rx, ry, angle, fill, stroke) {
        const ctx = this.ctx; const [sx, sy] = this.toScreen(cx, cy);
        ctx.save(); ctx.translate(sx, sy); ctx.rotate(-angle);
        ctx.beginPath(); ctx.ellipse(0, 0, rx * this.scale, ry * this.scale, 0, 0, Math.PI * 2);
        if (fill) { ctx.fillStyle = fill; ctx.fill(); }
        if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = 1.5; ctx.stroke(); }
        ctx.restore();
    }

    drawText(text, x, y, color, size = 14, align = 'center', baseline = 'middle') {
        const ctx = this.ctx; const [sx, sy] = this.toScreen(x, y);
        ctx.fillStyle = color || this.colors.white; ctx.font = size + 'px -apple-system,sans-serif';
        ctx.textAlign = align; ctx.textBaseline = baseline; ctx.fillText(text, sx, sy);
    }

    // Draw text at raw pixel coordinates (no coordinate transform)
    screenText(text, px, py, color, size = 14, align = 'center', baseline = 'middle') {
        const ctx = this.ctx;
        ctx.fillStyle = color || this.colors.white; ctx.font = size + 'px -apple-system,sans-serif';
        ctx.textAlign = align; ctx.textBaseline = baseline; ctx.fillText(text, px, py);
    }

    drawTransformedUnitSquare(M, fill, stroke, lw = 2) {
        const [[a, b], [c, d]] = M;
        this.drawPolygon([[0,0],[a,c],[a+b,c+d],[b,d]], fill, stroke, lw);
    }

    addDraggable(id, x, y, color, radius = 8, onDrag) {
        const d = { id, x, y, color, radius: radius || 8, onDrag };
        this.draggables.push(d);
        if (!this._dragBound) {
            this._dragBound = true;
            const getPos = (e) => {
                const r = this.canvas.getBoundingClientRect();
                const cx = (e.touches ? e.touches[0].clientX : e.clientX) - r.left;
                const cy = (e.touches ? e.touches[0].clientY : e.clientY) - r.top;
                return this.toMath(cx, cy);
            };
            const startDrag = (e) => {
                const [wx, wy] = getPos(e);
                for (const dr of this.draggables) {
                    if (Math.sqrt((wx - dr.x) ** 2 + (wy - dr.y) ** 2) < dr.radius / this.scale * 2.5) {
                        this.dragState = dr; e.preventDefault(); break;
                    }
                }
            };
            const moveDrag = (e) => {
                if (!this.dragState) return;
                e.preventDefault();
                const [wx, wy] = getPos(e);
                this.dragState.x = wx; this.dragState.y = wy;
                if (this.dragState.onDrag) this.dragState.onDrag(wx, wy);
            };
            const endDrag = () => { this.dragState = null; };
            this.canvas.addEventListener('mousedown', startDrag);
            this.canvas.addEventListener('mousemove', moveDrag);
            this.canvas.addEventListener('mouseup', endDrag);
            this.canvas.addEventListener('mouseleave', endDrag);
            this.canvas.addEventListener('touchstart', startDrag, { passive: false });
            this.canvas.addEventListener('touchmove', moveDrag, { passive: false });
            this.canvas.addEventListener('touchend', endDrag);
        }
        return d;
    }

    drawDraggables() {
        for (const d of this.draggables) {
            const [sx, sy] = this.toScreen(d.x, d.y);
            const ctx = this.ctx;
            ctx.fillStyle = d.color + '33'; ctx.beginPath(); ctx.arc(sx, sy, d.radius + 4, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = d.color; ctx.beginPath(); ctx.arc(sx, sy, d.radius, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = '#ffffff44'; ctx.beginPath(); ctx.arc(sx - 2, sy - 2, d.radius * 0.3, 0, Math.PI * 2); ctx.fill();
        }
    }

    animate(drawFrame) {
        const loop = (t) => { drawFrame(t); this.animationId = requestAnimationFrame(loop); };
        this.animationId = requestAnimationFrame(loop);
    }

    stopAnimation() { if (this.animationId) { cancelAnimationFrame(this.animationId); this.animationId = null; } }

    static createSlider(container, label, min, max, val, step, onChange) {
        const g = document.createElement('div'); g.className = 'viz-slider-group';
        const l = document.createElement('span'); l.className = 'viz-slider-label'; l.textContent = label;
        const s = document.createElement('input'); s.type = 'range'; s.className = 'viz-slider';
        s.min = min; s.max = max; s.value = val; s.step = step || 0.1;
        const v = document.createElement('span'); v.className = 'viz-slider-value'; v.textContent = parseFloat(val).toFixed(1);
        s.addEventListener('input', () => { v.textContent = parseFloat(s.value).toFixed(1); onChange(parseFloat(s.value)); });
        g.appendChild(l); g.appendChild(s); g.appendChild(v); container.appendChild(g);
        return s;
    }

    static createButton(container, label, onClick) {
        const b = document.createElement('button');
        b.style.cssText = 'padding:4px 12px;border:1px solid #30363d;border-radius:4px;background:#1a1a40;color:#c9d1d9;font-size:0.78rem;cursor:pointer;';
        b.textContent = label; b.addEventListener('click', onClick); container.appendChild(b); return b;
    }

    static matVec(M, v) { return [M[0][0]*v[0]+M[0][1]*v[1], M[1][0]*v[0]+M[1][1]*v[1]]; }
    static matMul(A, B) { return [[A[0][0]*B[0][0]+A[0][1]*B[1][0], A[0][0]*B[0][1]+A[0][1]*B[1][1]], [A[1][0]*B[0][0]+A[1][1]*B[1][0], A[1][0]*B[0][1]+A[1][1]*B[1][1]]]; }
    static det2(M) { return M[0][0]*M[1][1]-M[0][1]*M[1][0]; }
    static eigenvalues2(M) {
        const tr = M[0][0]+M[1][1], det = VizEngine.det2(M), disc = tr*tr-4*det;
        if (disc < 0) return null;
        const s = Math.sqrt(disc); return [(tr+s)/2, (tr-s)/2];
    }
    static eigenvector2(M, lam) {
        const a = M[0][0]-lam, b = M[0][1];
        if (Math.abs(b) > 1e-10) return VizEngine.normalize([1, -a/b]);
        if (Math.abs(a) > 1e-10) return [0, 1];
        const c = M[1][0], d = M[1][1]-lam;
        if (Math.abs(d) > 1e-10) return VizEngine.normalize([1, -c/d]);
        return [1, 0];
    }
    static normalize(v) { const l = Math.sqrt(v[0]*v[0]+v[1]*v[1]); return l < 1e-10 ? [0,0] : [v[0]/l, v[1]/l]; }
    static vecLen(v) { return Math.sqrt(v[0]*v[0]+v[1]*v[1]); }
    static dot(u, v) { return u[0]*v[0]+u[1]*v[1]; }
    static proj(u, v) { const d = VizEngine.dot(u,v)/VizEngine.dot(v,v); return [v[0]*d, v[1]*d]; }
    static lerp(a, b, t) { return a + (b - a) * t; }

    // === Analysis-specific helpers ===

    drawFunction(f, xMin, xMax, color, lw = 2, steps = 300) {
        const ctx = this.ctx;
        ctx.strokeStyle = color; ctx.lineWidth = lw;
        ctx.beginPath();
        let started = false;
        for (let i = 0; i <= steps; i++) {
            const x = xMin + (xMax - xMin) * i / steps;
            const y = f(x);
            if (!isFinite(y) || Math.abs(y) > 1e6) { started = false; continue; }
            const [sx, sy] = this.toScreen(x, y);
            if (!started) { ctx.moveTo(sx, sy); started = true; } else { ctx.lineTo(sx, sy); }
        }
        ctx.stroke();
    }

    drawEpsilonBand(L, epsilon, color) {
        const ctx = this.ctx;
        const [, sy1] = this.toScreen(0, L + epsilon);
        const [, sy2] = this.toScreen(0, L - epsilon);
        ctx.fillStyle = color + '22';
        ctx.fillRect(0, sy1, this.width, sy2 - sy1);
        ctx.strokeStyle = color; ctx.lineWidth = 1; ctx.setLineDash([4, 4]);
        ctx.beginPath(); ctx.moveTo(0, sy1); ctx.lineTo(this.width, sy1); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, sy2); ctx.lineTo(this.width, sy2); ctx.stroke();
        ctx.setLineDash([]);
    }

    drawDeltaBand(a, delta, color) {
        const ctx = this.ctx;
        const [sx1] = this.toScreen(a - delta, 0);
        const [sx2] = this.toScreen(a + delta, 0);
        ctx.fillStyle = color + '22';
        ctx.fillRect(sx1, 0, sx2 - sx1, this.height);
        ctx.strokeStyle = color; ctx.lineWidth = 1; ctx.setLineDash([4, 4]);
        ctx.beginPath(); ctx.moveTo(sx1, 0); ctx.lineTo(sx1, this.height); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(sx2, 0); ctx.lineTo(sx2, this.height); ctx.stroke();
        ctx.setLineDash([]);
    }

    shadeBetween(f1, f2, xMin, xMax, color, steps = 200) {
        const ctx = this.ctx;
        ctx.fillStyle = color;
        ctx.beginPath();
        for (let i = 0; i <= steps; i++) {
            const x = xMin + (xMax - xMin) * i / steps;
            const [sx, sy] = this.toScreen(x, f1(x));
            i === 0 ? ctx.moveTo(sx, sy) : ctx.lineTo(sx, sy);
        }
        for (let i = steps; i >= 0; i--) {
            const x = xMin + (xMax - xMin) * i / steps;
            const [sx, sy] = this.toScreen(x, f2(x));
            ctx.lineTo(sx, sy);
        }
        ctx.closePath(); ctx.fill();
    }

    drawRiemannSums(f, a, b, n, type, color) {
        const ctx = this.ctx;
        const dx = (b - a) / n;
        for (let i = 0; i < n; i++) {
            const xL = a + i * dx;
            let h;
            if (type === 'left') h = f(xL);
            else if (type === 'right') h = f(xL + dx);
            else if (type === 'mid') h = f(xL + dx / 2);
            else if (type === 'upper') { h = -Infinity; for (let s = 0; s <= 10; s++) { h = Math.max(h, f(xL + dx * s / 10)); } }
            else { h = Infinity; for (let s = 0; s <= 10; s++) { h = Math.min(h, f(xL + dx * s / 10)); } }
            if (!isFinite(h)) continue;
            const [sx1, sy1] = this.toScreen(xL, Math.max(h, 0));
            const [sx2, sy2] = this.toScreen(xL + dx, Math.min(h, 0));
            const [, syAxis] = this.toScreen(0, 0);
            ctx.fillStyle = color + '44';
            ctx.fillRect(sx1, Math.min(sy1, syAxis), sx2 - sx1, Math.abs(sy1 - syAxis));
            ctx.strokeStyle = color; ctx.lineWidth = 1;
            ctx.strokeRect(sx1, Math.min(sy1, syAxis), sx2 - sx1, Math.abs(sy1 - syAxis));
        }
    }

    drawSequence(seq, nMax, color, r = 3) {
        for (let n = 0; n <= nMax; n++) {
            const y = seq(n);
            if (!isFinite(y)) continue;
            this.drawPoint(n, y, color, null, r);
        }
    }

    drawOpenInterval(a, b, y, color, lw = 3) {
        const ctx = this.ctx;
        const [sx1, sy1] = this.toScreen(a, y);
        const [sx2] = this.toScreen(b, y);
        ctx.strokeStyle = color; ctx.lineWidth = lw;
        ctx.beginPath(); ctx.moveTo(sx1, sy1); ctx.lineTo(sx2, sy1); ctx.stroke();
        // open circles at endpoints
        ctx.beginPath(); ctx.arc(sx1, sy1, 4, 0, Math.PI * 2); ctx.strokeStyle = color; ctx.lineWidth = 2; ctx.stroke();
        ctx.beginPath(); ctx.arc(sx2, sy1, 4, 0, Math.PI * 2); ctx.stroke();
    }

    drawClosedInterval(a, b, y, color, lw = 3) {
        const ctx = this.ctx;
        const [sx1, sy1] = this.toScreen(a, y);
        const [sx2] = this.toScreen(b, y);
        ctx.strokeStyle = color; ctx.lineWidth = lw;
        ctx.beginPath(); ctx.moveTo(sx1, sy1); ctx.lineTo(sx2, sy1); ctx.stroke();
        // filled circles at endpoints
        ctx.fillStyle = color;
        ctx.beginPath(); ctx.arc(sx1, sy1, 4, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(sx2, sy1, 4, 0, Math.PI * 2); ctx.fill();
    }
    // === Domain Coloring: render f(z) as HSL-colored pixels ===
    // f: (re, im) => [re, im] (complex function)
    drawDomainColoring(f, xRange, yRange) {
        const ctx = this.ctx;
        const pw = this.canvas.width, ph = this.canvas.height;
        ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
        const imgData = ctx.createImageData(pw, ph);
        const data = imgData.data;
        for (let py = 0; py < ph; py++) {
            for (let px = 0; px < pw; px++) {
                const re = xRange[0] + (xRange[1] - xRange[0]) * px / pw;
                const im = yRange[1] - (yRange[1] - yRange[0]) * py / ph;
                let [u, v] = f(re, im);
                const arg = Math.atan2(v, u);
                const mag = Math.sqrt(u * u + v * v);
                const hue = (arg / Math.PI + 1) / 2;
                const sat = 0.8;
                const light = 1 - 1 / (1 + mag * 0.3);
                const [r, g, b] = VizEngine.hslToRgb(hue, sat, light);
                const idx = (py * pw + px) * 4;
                data[idx] = r; data[idx + 1] = g; data[idx + 2] = b; data[idx + 3] = 255;
            }
        }
        ctx.putImageData(imgData, 0, 0);
        ctx.restore();
    }

    // === Heatmap: render 2D scalar field as colored pixels ===
    // f: (x, y) => scalar, colorMap: 'viridis' | 'inferno' | 'coolwarm'
    drawHeatmap(f, xRange, yRange, colorMap) {
        const ctx = this.ctx;
        const pw = this.canvas.width, ph = this.canvas.height;
        ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
        let vMin = Infinity, vMax = -Infinity;
        const values = new Float64Array(pw * ph);
        for (let py = 0; py < ph; py++) {
            for (let px = 0; px < pw; px++) {
                const x = xRange[0] + (xRange[1] - xRange[0]) * px / pw;
                const y = yRange[1] - (yRange[1] - yRange[0]) * py / ph;
                const v = f(x, y);
                values[py * pw + px] = v;
                if (isFinite(v)) { vMin = Math.min(vMin, v); vMax = Math.max(vMax, v); }
            }
        }
        const imgData = ctx.createImageData(pw, ph);
        const data = imgData.data;
        const range = vMax - vMin || 1;
        for (let i = 0; i < pw * ph; i++) {
            const val = values[i];
            if (!isFinite(val)) { data[i*4]=0; data[i*4+1]=0; data[i*4+2]=0; data[i*4+3]=255; continue; }
            const t = Math.max(0, Math.min(1, (val - vMin) / range));
            const [r, g, b] = VizEngine.colormapSample(t, colorMap || 'viridis');
            data[i*4]=r; data[i*4+1]=g; data[i*4+2]=b; data[i*4+3]=255;
        }
        ctx.putImageData(imgData, 0, 0);
        ctx.restore();
    }

    // HSL to RGB (h, s, l all in 0-1)
    static hslToRgb(h, s, l) {
        let r, g, b;
        if (s === 0) { r = g = b = l; }
        else {
            const hue2rgb = (p, q, t) => {
                if (t < 0) t += 1; if (t > 1) t -= 1;
                if (t < 1/6) return p + (q - p) * 6 * t;
                if (t < 1/2) return q;
                if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
                return p;
            };
            const q2 = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p2 = 2 * l - q2;
            r = hue2rgb(p2, q2, h + 1/3);
            g = hue2rgb(p2, q2, h);
            b = hue2rgb(p2, q2, h - 1/3);
        }
        return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
    }

    // Colormap sampling (t in 0-1)
    static colormapSample(t, name) {
        if (name === 'inferno') {
            const r = Math.round(255 * Math.min(1, 1.1 * t + 0.15 * Math.sin(t * 3.14)));
            const g = Math.round(255 * Math.max(0, t * t));
            const b = Math.round(255 * Math.max(0, Math.sin(t * 1.57)));
            return [r, g, b];
        }
        if (name === 'coolwarm') {
            const r = Math.round(255 * Math.min(1, 0.3 + 0.7 * t));
            const g = Math.round(255 * (0.3 + 0.4 * Math.sin(t * 3.14)));
            const b = Math.round(255 * Math.min(1, 1 - 0.7 * t));
            return [r, g, b];
        }
        // viridis approximation
        const r = Math.round(255 * (0.267 + 0.004 * t + t * t * 0.329));
        const g = Math.round(255 * Math.min(1, 0.004 + t * 0.873));
        const b = Math.round(255 * Math.max(0, 0.329 + 0.42 * Math.sin(t * 2.5)));
        return [r, g, b];
    }

    // === Number theory helpers ===
    static sievePrimes(max) {
        const sieve = new Uint8Array(max + 1);
        const primes = [];
        for (let i = 2; i <= max; i++) {
            if (!sieve[i]) {
                primes.push(i);
                for (let j = i * i; j <= max; j += i) sieve[j] = 1;
            }
        }
        return primes;
    }

    // Draggable screen-coordinate point (no math transform)
    drawScreenPoint(sx, sy, color, r = 5) {
        const ctx = this.ctx;
        ctx.fillStyle = color; ctx.beginPath(); ctx.arc(sx, sy, r, 0, Math.PI * 2); ctx.fill();
    }

    // Draw a step function: pairs = [[x0,y0],[x1,y1],...]
    drawStepFunction(pairs, color, lw = 2) {
        if (pairs.length < 2) return;
        const ctx = this.ctx;
        ctx.strokeStyle = color; ctx.lineWidth = lw;
        ctx.beginPath();
        for (let i = 0; i < pairs.length - 1; i++) {
            const [sx1, sy1] = this.toScreen(pairs[i][0], pairs[i][1]);
            const [sx2] = this.toScreen(pairs[i+1][0], pairs[i+1][1]);
            if (i === 0) ctx.moveTo(sx1, sy1);
            ctx.lineTo(sx2, sy1);
            const [, sy2] = this.toScreen(pairs[i+1][0], pairs[i+1][1]);
            ctx.lineTo(sx2, sy2);
        }
        ctx.stroke();
    }

    // Bar chart at screen coordinates
    drawBar(x, yBase, yTop, width, color) {
        const ctx = this.ctx;
        const [sx, syBase] = this.toScreen(x, yBase);
        const [, syTop] = this.toScreen(x, yTop);
        ctx.fillStyle = color;
        ctx.fillRect(sx - width/2, Math.min(syBase, syTop), width, Math.abs(syTop - syBase));
    }
}
window.VizEngine = VizEngine;
