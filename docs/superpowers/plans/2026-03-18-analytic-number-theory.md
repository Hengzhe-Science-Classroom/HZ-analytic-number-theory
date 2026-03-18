# Analytic Number Theory Interactive Course — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a 22-chapter interactive course on analytic number theory with ~140 Canvas visualizations, ~200 exercises, KaTeX math, and localStorage progress tracking.

**Architecture:** Pure frontend (HTML/CSS/JS), no build tools. Copy the proven 科学教室 scaffold from `intro-probability`, adapt for this course. Each chapter is a self-contained JS module that pushes to `window.CHAPTERS`. VizEngine extended with `drawDomainColoring` and `drawHeatmap` for pixel-level rendering.

**Tech Stack:** Vanilla JS, Canvas 2D API, KaTeX CDN, localStorage.

**Spec:** `docs/superpowers/specs/2026-03-18-analytic-number-theory-design.md`

**Reference course:** `/Users/hengzhezhao/Desktop/科学教室/intro-probability/` (copy scaffold files from here)

---

## File Structure

```
analytic-number-theory/
├── index.html                          # Course shell (adapt from intro-probability)
├── styles.css                          # Dark theme (copy from intro-probability)
├── app.js                              # App logic (adapt localStorage key + manifest)
├── viz-engine.js                       # VizEngine + new domain coloring/heatmap methods
├── chapters/
│   ├── ch00-drama-of-primes.js
│   ├── ch01-arithmetic-functions.js
│   ├── ch02-averages.js
│   ├── ch03-dirichlet-series.js
│   ├── ch04-riemann-zeta.js
│   ├── ch04-riemann-zeta-viz.js        # Domain coloring (pixel-heavy)
│   ├── ch05-analytic-continuation.js
│   ├── ch05-analytic-continuation-viz.js
│   ├── ch06-zero-free-regions.js
│   ├── ch06-zero-free-regions-viz.js
│   ├── ch07-prime-number-theorem.js
│   ├── ch08-explicit-formula.js
│   ├── ch09-dirichlet-characters.js
│   ├── ch09-dirichlet-characters-viz.js
│   ├── ch10-dirichlet-theorem.js
│   ├── ch11-combinatorial-sieves.js
│   ├── ch12-selberg-sieve.js
│   ├── ch13-large-sieve-bv.js
│   ├── ch14-exponential-sums.js
│   ├── ch15-circle-method.js
│   ├── ch16-zeros-of-l-functions.js
│   ├── ch16-zeros-of-l-functions-viz.js
│   ├── ch17-automorphic-forms.js
│   ├── ch17-automorphic-forms-viz.js   # Heatmap on upper half-plane
│   ├── ch18-short-intervals.js
│   ├── ch19-bounded-gaps.js
│   ├── ch20-computational-ant.js
│   └── ch21-open-problems.js
```

---

## Task 1: Scaffold — index.html, styles.css, app.js, viz-engine.js

**Files:**
- Create: `index.html` (adapt from `/Users/hengzhezhao/Desktop/科学教室/intro-probability/index.html`)
- Create: `styles.css` (copy from `/Users/hengzhezhao/Desktop/科学教室/intro-probability/styles.css`)
- Create: `app.js` (adapt from `/Users/hengzhezhao/Desktop/科学教室/intro-probability/app.js`)
- Create: `viz-engine.js` (copy from `/Users/hengzhezhao/Desktop/科学教室/intro-probability/viz-engine.js` + extend)
- Create: `chapters/` directory

### Steps

- [ ] **Step 1: Copy styles.css verbatim**

Copy `/Users/hengzhezhao/Desktop/科学教室/intro-probability/styles.css` to `styles.css`. No changes needed — the dark theme is shared across all courses.

- [ ] **Step 2: Create index.html**

Adapt from intro-probability. Changes:
- Title: `Analytic Number Theory — Interactive`
- Sidebar h1: `Analytic Number Theory`
- Author line: `Apostol / Davenport / Iwaniec & Kowalski`
- Welcome screen: course title `Analytic Number Theory`, subtitle `解析数论 · Interactive`, description about primes and zeta functions
- Roadmap: 7 parts (A through G) with all 22 chapters listed
- `window.CHAPTER_MANIFEST`: array of 22 entries with number, id, title, file fields matching the chapter file slugs:
  ```js
  {number:0,  id:'ch00', title:'The Drama of the Primes',                    file:'ch00-drama-of-primes'},
  {number:1,  id:'ch01', title:'Arithmetic Functions',                       file:'ch01-arithmetic-functions'},
  {number:2,  id:'ch02', title:'Averages of Arithmetic Functions',           file:'ch02-averages'},
  {number:3,  id:'ch03', title:'Dirichlet Series & Euler Products',          file:'ch03-dirichlet-series'},
  {number:4,  id:'ch04', title:'The Riemann Zeta Function',                  file:'ch04-riemann-zeta'},
  {number:5,  id:'ch05', title:'Analytic Continuation & Functional Equation',file:'ch05-analytic-continuation'},
  {number:6,  id:'ch06', title:'Zero-Free Regions',                          file:'ch06-zero-free-regions'},
  {number:7,  id:'ch07', title:'The Prime Number Theorem',                   file:'ch07-prime-number-theorem'},
  {number:8,  id:'ch08', title:'The Explicit Formula & the Error Term',      file:'ch08-explicit-formula'},
  {number:9,  id:'ch09', title:'Dirichlet Characters & L-Functions',         file:'ch09-dirichlet-characters'},
  {number:10, id:'ch10', title:'Dirichlet\'s Theorem & the L(1,χ) Problem',  file:'ch10-dirichlet-theorem'},
  {number:11, id:'ch11', title:'Sieve Methods I: Combinatorial Sieves',      file:'ch11-combinatorial-sieves'},
  {number:12, id:'ch12', title:'Sieve Methods II: Selberg & Modern Sieves',  file:'ch12-selberg-sieve'},
  {number:13, id:'ch13', title:'The Large Sieve & Bombieri-Vinogradov',      file:'ch13-large-sieve-bv'},
  {number:14, id:'ch14', title:'Exponential Sums',                           file:'ch14-exponential-sums'},
  {number:15, id:'ch15', title:'The Circle Method',                          file:'ch15-circle-method'},
  {number:16, id:'ch16', title:'Zeros of L-Functions',                       file:'ch16-zeros-of-l-functions'},
  {number:17, id:'ch17', title:'Automorphic Forms: A First Look',            file:'ch17-automorphic-forms'},
  {number:18, id:'ch18', title:'Primes in Short Intervals',                  file:'ch18-short-intervals'},
  {number:19, id:'ch19', title:'Bounded Gaps Between Primes',                file:'ch19-bounded-gaps'},
  {number:20, id:'ch20', title:'Computational Analytic Number Theory',       file:'ch20-computational-ant'},
  {number:21, id:'ch21', title:'Open Problems & the Road Ahead',             file:'ch21-open-problems'},
  ```
- Copyright: `© 2026 Hengzhe Zhao · AGPL-3.0 & Commercial`

- [ ] **Step 3: Create app.js**

Copy from intro-probability. Change only:
- localStorage key: `'intro-probability-progress'` → `'analytic-number-theory-progress'`

Everything else (lazy loading, progress tracking, sidebar, navigation, exercises, math rendering) is identical.

**Note for `-viz.js` companion files:** The app.js `ensureChapterLoaded` method automatically tries to load `chapters/<file>-viz.js` after loading the main chapter file. Companion viz files must register their visualizations via `window.EXTRA_VIZ[chapterId] = { sectionId: [vizArray] }` so the app picks them up when rendering sections. See `app.js` line ~199 for the EXTRA_VIZ consumption pattern.

- [ ] **Step 4: Extend viz-engine.js**

Copy from intro-probability, then add these new methods to the VizEngine class:

```js
// Domain coloring: renders f(z) as HSL-colored pixels over a rectangle
// f: (re, im) => [re, im] — complex function
// xRange: [xMin, xMax], yRange: [yMin, yMax]
drawDomainColoring(f, xRange, yRange) {
    const ctx = this.ctx;
    // Use physical (DPR-scaled) canvas dimensions for pixel-level rendering
    const pw = this.canvas.width, ph = this.canvas.height;
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); // reset DPR scaling
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

// Heatmap: renders a 2D scalar field as colored pixels
// f: (x, y) => scalar value
// xRange: [xMin, xMax], yRange: [yMin, yMax]
// colorMap: 'viridis' | 'inferno' | 'coolwarm' (default 'viridis')
drawHeatmap(f, xRange, yRange, colorMap) {
    const ctx = this.ctx;
    // Use physical (DPR-scaled) canvas dimensions for pixel-level rendering
    const pw = this.canvas.width, ph = this.canvas.height;
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); // reset DPR scaling
    // First pass: find min/max for normalization
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
    // Second pass: render (NaN/Infinity values render as black)
    const imgData = ctx.createImageData(pw, ph);
    const data = imgData.data;
    const range = vMax - vMin || 1;
    for (let i = 0; i < pw * ph; i++) {
        const val = values[i];
        if (!isFinite(val)) { data[i*4] = 0; data[i*4+1] = 0; data[i*4+2] = 0; data[i*4+3] = 255; continue; }
        const t = Math.max(0, Math.min(1, (val - vMin) / range));
        const [r, g, b] = VizEngine.colormapSample(t, colorMap || 'viridis');
        data[i * 4] = r; data[i * 4 + 1] = g; data[i * 4 + 2] = b; data[i * 4 + 3] = 255;
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
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }
    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

// Colormap sampling (t in 0-1)
static colormapSample(t, name) {
    // Simplified colormaps
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
```

- [ ] **Step 5: Create chapters/ directory**

```bash
mkdir -p chapters
```

- [ ] **Step 6: Verify scaffold works**

Open `index.html` in a browser. Confirm:
- Welcome screen renders with title, roadmap, all 22 chapters listed
- Sidebar shows all 22 chapters with "0/? sections" placeholders
- Progress bar shows 0%
- No console errors

- [ ] **Step 7: Commit scaffold**

```bash
git add index.html styles.css app.js viz-engine.js
git commit -m "feat: scaffold course shell with extended VizEngine"
```

---

## Task 2: Ch 0 — The Drama of the Primes

**Files:**
- Create: `chapters/ch00-drama-of-primes.js`

**Sections (6):**
1. `sec-why-primes` — "Why Primes?" — Opening puzzle, fundamental theorem of arithmetic, primes as atoms
2. `sec-irregularity` — "The Irregular Staircase" — pi(x) staircase, prime gaps, unpredictability, tables of primes
3. `sec-euler-connection` — "Euler's Bridge to Analysis" — Euler product, sum 1/p diverges, first hint that analysis enters
4. `sec-gauss-conjecture` — "The Gauss-Legendre Conjecture" — x/ln(x) approximation, Li(x), empirical evidence
5. `sec-riemann-revolution` — "Riemann's Revolution" — 1859 paper, zeta function enters, zeros control primes
6. `sec-roadmap` — "What Lies Ahead" — Course roadmap, bridge to Ch 1

**Visualizations (6):**
- `viz-prime-staircase`: pi(x) staircase vs x/ln(x) vs Li(x). Slider for x range (100 to 10000). Step function in blue, smooth curves in teal/orange. Show numerical difference.
- `viz-prime-gaps`: gap_n = p_{n+1} - p_n scatter plot. Animated: dots appear one by one. Slider for max n. Highlight record gaps.
- `viz-ulam-spiral`: Ulam spiral up to N (slider, max 10000). Primes colored blue on integer grid. Pan by dragging.
- `viz-euler-product`: Build product_p (1-p^{-s})^{-1} one prime at a time. Slider for s (real, s>1). Show partial product converging to zeta(s). Bar chart showing each factor's contribution.
- `viz-prime-race`: pi(x;4,1) vs pi(x;4,3). Two colored curves racing. Animated x sweep. Show lead changes. Extend to general q with dropdown.
- `viz-pi-vs-approx`: Animated comparison: pi(x), x/ln(x), Li(x), R(x) all plotted. Slider for x range. Show relative errors.

**Exercises (8):** Mix of computation (find pi(100), compute Euler product for s=2 up to p=7) and conceptual (why sum 1/p diverges implies infinitely many primes, explain Bertrand's postulate).

- [ ] **Step 1:** Create `chapters/ch00-drama-of-primes.js` with all 6 sections, 6 visualizations, 8 exercises following the pattern in intro-probability's chapters. Use `window.CHAPTERS.push({...})`. All math in `\\(` / `\\)` (inline) and `\\[` / `\\]` (display) KaTeX delimiters. HTML content in template literals.

Helper functions needed inside this file:
- `sievePrimes(max)` — Sieve of Eratosthenes returning array of primes up to max
- `primeCount(x, primes)` — count primes <= x
- `Li(x)` — logarithmic integral (numerical integration)

- [ ] **Step 2:** Open in browser, verify all sections load, visualizations render, exercises toggle.

- [ ] **Step 3:** Commit.

```bash
git add chapters/ch00-drama-of-primes.js
git commit -m "feat: ch00 The Drama of the Primes — 6 sections, 6 viz, 8 exercises"
```

---

## Task 3: Ch 1 — Arithmetic Functions

**Files:**
- Create: `chapters/ch01-arithmetic-functions.js`

**Sections (7):**
1. `sec-motivation` — "From Primes to Multiplicative Structure" — Motivation, why arithmetic functions
2. `sec-basic-functions` — "The Cast of Characters" — phi(n), mu(n), d(n), sigma(n), Lambda(n), Liouville lambda(n)
3. `sec-multiplicative` — "Multiplicative Functions" — Definition, completely multiplicative, values at prime powers determine everything
4. `sec-dirichlet-convolution` — "Dirichlet Convolution" — Definition, ring structure, identity element epsilon, convolution inverses
5. `sec-mobius-inversion` — "Mobius Inversion" — The formula, proof, applications (phi = mu * id, Lambda = -mu' * 1)
6. `sec-mangoldt` — "The von Mangoldt Function" — Definition, Lambda(n) = log p if n=p^k, its role in PNT, connection to -zeta'/zeta
7. `sec-bridge` — "From Functions to Averages" — Bridge to Ch 2, preview of summatory functions

**Visualizations (6):**
- `viz-function-scatter`: Scatter plot of f(n)/n for f = phi, d, sigma. Dropdown to select function. Running average overlaid in teal. Slider for max n.
- `viz-convolution-anim`: Animate (f*g)(n) = sum_{d|n} f(d)g(n/d). Pick f and g from presets. Show divisors of n, each term f(d)g(n/d) as colored bar. Sum accumulates.
- `viz-mobius-inversion`: Divisor lattice of n (Hasse diagram). Forward sum: F(n) = sum_{d|n} f(d) shown as upward flow. Inversion: f(n) = sum_{d|n} mu(d)F(n/d) as signed flow. Slider for n.
- `viz-mangoldt-spikes`: Plot Lambda(n) for n=1..200. Spikes at prime powers. Color by prime: all powers of 2 in blue, powers of 3 in teal, etc.
- `viz-mult-builder`: "Build your own multiplicative function." User sets f(2), f(3), f(5), f(7) via sliders. Function auto-extends to all n<=100 via multiplicativity. Show resulting scatter plot.
- `viz-convolution-table`: Dirichlet convolution table: rows = f values, cols = g values, highlighted cells show which pairs contribute to (f*g)(n).

**Exercises (10):** Compute mu(360), show phi is multiplicative, prove mu * 1 = epsilon, find Lambda for first 20 integers, show sum_{d|n} mu(d) = [n=1].

- [ ] **Step 1:** Create the file with all sections, visualizations, exercises.
- [ ] **Step 2:** Browser verify.
- [ ] **Step 3:** Commit.

---

## Task 4: Ch 2 — Averages of Arithmetic Functions

**Files:**
- Create: `chapters/ch02-averages.js`

**Sections (6):**
1. `sec-motivation` — "Why Averages?" — Individual values chaotic, averages reveal structure
2. `sec-summatory` — "Summatory Functions" — D(x)=sum d(n), Phi(x)=sum phi(n), Psi(x)=sum Lambda(n)
3. `sec-abel` — "Abel Summation" — The formula, geometric interpretation, applications to Dirichlet series convergence
4. `sec-euler-maclaurin` — "Euler-Maclaurin Formula" — Statement, Bernoulli numbers, applications
5. `sec-hyperbola` — "Dirichlet's Hyperbola Method" — sum_{n<=x} d(n) = 2 sum_{n<=sqrt(x)} [x/n] - [sqrt(x)]^2, proof, generalizations
6. `sec-bridge` — "From Sums to Series" — Preview: Dirichlet series encode summatory functions, bridge to Ch 3

**Visualizations (6):**
- `viz-hyperbola-lattice`: Lattice points under hyperbola xy=N. Animated: as N grows, points appear. Show Dirichlet's split into two regions.
- `viz-abel-summation`: Geometric proof of Abel summation. Step function a(n), smooth function f(x). Colored rectangles show the integration by parts.
- `viz-running-averages`: (1/x) sum_{n<=x} f(n) for f = d, phi/id, sigma/id. Three curves converging to their average orders (log x, 6/pi^2, pi^2/6).
- `viz-error-oscillation`: D(x) - x log x - (2gamma-1)x plotted. Show the oscillating error term. Slider for x range.
- `viz-euler-maclaurin`: sum_{n=1}^N 1/n vs ln(N) + gamma. Show trapezoidal approximation, correction terms appearing one by one. Animated.
- `viz-psi-chebyshev`: Psi(x) = sum_{n<=x} Lambda(n) vs x. The proto-PNT: Psi(x)/x hovering near 1.

**Exercises (10):** Use Abel summation to show sum 1/p ~ log log x. Compute D(100). Apply hyperbola method. Derive average order of phi(n).

- [ ] **Step 1:** Create the file.
- [ ] **Step 2:** Browser verify.
- [ ] **Step 3:** Commit.

---

## Task 5: Ch 3 — Dirichlet Series & Euler Products

**Files:**
- Create: `chapters/ch03-dirichlet-series.js`

**Sections (6):**
1. `sec-motivation` — "Encoding Arithmetic in Analysis" — Why package a(n) into sum a(n) n^{-s}
2. `sec-convergence` — "Convergence" — Abscissa of convergence sigma_c, absolute convergence sigma_a, uniform convergence, examples
3. `sec-euler-product` — "Euler Products" — Formal identity, proof for absolutely convergent series, examples
4. `sec-formal-properties` — "Algebraic Properties" — Multiplication = Dirichlet convolution, division, logarithmic derivative
5. `sec-uniqueness` — "Uniqueness Theorem" — If sum a(n)n^{-s} = 0 in a half-plane, then a(n) = 0 for all n
6. `sec-bridge` — "Enter zeta(s)" — The most important Dirichlet series, bridge to Ch 4

**Visualizations (6):**
- `viz-convergence-halfplane`: Complex s-plane. Shade convergence region. Slider for series (zeta, L-functions, Ramanujan tau). Vertical line at sigma_c moves.
- `viz-euler-product-assembly`: Multiply (1-p^{-s})^{-1} factors one prime at a time. Show partial product value (real s > 1). Bar chart: each prime's contribution. Converges to zeta(s).
- `viz-spiral-partial-sums`: Partial sums of sum n^{-s} in the complex plane for s = sigma + it. Points trace a spiral. Slider for sigma and t.
- `viz-abscissa-wall`: Animated vertical "wall" at sigma_c. To its right, series converges (green). To its left, diverges (red). Show example partial sums on both sides.
- `viz-series-comparison`: Side-by-side comparison: zeta(s), L(s, chi_4), sum tau(n) n^{-s}. Different convergence abscissae. Toggle between them.
- `viz-log-derivative`: Plot -zeta'(s)/zeta(s) = sum Lambda(n) n^{-s}. Show connection: log derivative of Euler product = sum over prime powers.

**Exercises (8):** Find sigma_c for specific series. Prove Euler product for zeta. Show product over primes diverges (another proof of infinitely many primes). Verify uniqueness for a simple example.

- [ ] **Step 1:** Create the file.
- [ ] **Step 2:** Browser verify.
- [ ] **Step 3:** Commit.

---

## Task 6: Ch 4 — The Riemann Zeta Function

**Files:**
- Create: `chapters/ch04-riemann-zeta.js`
- Create: `chapters/ch04-riemann-zeta-viz.js` (domain coloring, pixel-heavy)

**Sections (7):**
1. `sec-motivation` — "The Master Key" — zeta controls primes, overview of what this chapter establishes
2. `sec-half-plane` — "zeta(s) for Re(s) > 1" — Definition, basic properties, growth, Euler product
3. `sec-continuation-strip` — "Extending to Re(s) > 0" — The eta function trick: zeta(s) = (1-2^{1-s})^{-1} eta(s), meromorphic in Re(s)>0
4. `sec-pole` — "The Pole at s = 1" — Residue, connection to PNT heuristic, Laurent expansion
5. `sec-special-values` — "Special Values" — zeta(2) = pi^2/6 (Basel problem), zeta(2k), zeta at negative integers, trivial zeros
6. `sec-gamma-xi` — "Gamma Function and the xi Function" — Gamma(s), its properties, xi(s) = s(s-1)/2 * pi^{-s/2} * Gamma(s/2) * zeta(s), functional equation preview
7. `sec-bridge` — "The Functional Equation Awaits" — Bridge to Ch 5

**Visualizations (7):**
- `viz-zeta-domain-coloring` (in -viz.js): Domain coloring of zeta(s) in the region [-6,6] x [-30,30]. Use `drawDomainColoring`. Show pole at s=1, trivial zeros at s=-2,-4,... Pan/zoom via sliders for center and scale.
- `viz-zeta-real-line`: zeta(s) for real s in (-6, 6). Show pole at s=1, trivial zeros, special values marked. Animated trace along the curve.
- `viz-eta-alternating`: eta(s) = sum (-1)^{n+1} n^{-s}. Partial sums converging for Re(s)>0. Show how eta "fixes" zeta's divergence in the critical strip.
- `viz-gamma-function`: Gamma(x) for real x. Animated: connect n! dots by the smooth curve. Show poles at 0, -1, -2, ...
- `viz-critical-line`: |zeta(1/2 + it)| for t in [0, 50]. Animated trace. Zeros visible where graph touches zero. Slider for t range.
- `viz-xi-symmetry` (in -viz.js): Domain coloring of xi(s). The s <-> 1-s symmetry visible as left-right symmetry about Re(s)=1/2.
- `viz-special-values`: Interactive table: click on zeta(2), zeta(4), ..., zeta(20) to see the closed-form value, Basel-problem-style proof sketch for zeta(2).

**Exercises (10):** Derive zeta(2)=pi^2/6 via Fourier series. Show eta(1)=ln(2). Compute residue of zeta at s=1. Verify functional equation numerically for specific s values. Show zeta has no zeros for Re(s)>1.

- [ ] **Step 1:** Create `chapters/ch04-riemann-zeta.js` with all sections, non-pixel visualizations, exercises.
- [ ] **Step 2:** Create `chapters/ch04-riemann-zeta-viz.js` with `viz-zeta-domain-coloring` and `viz-xi-symmetry` using `drawDomainColoring`. Must include numerical zeta evaluation: use the Dirichlet eta series (alternating) with acceleration (Euler transform or Borwein's method) for convergence in the critical strip.
- [ ] **Step 3:** Browser verify all 7 visualizations render.
- [ ] **Step 4:** Commit.

---

## Task 7: Ch 5 — Analytic Continuation & Functional Equation

**Files:**
- Create: `chapters/ch05-analytic-continuation.js`
- Create: `chapters/ch05-analytic-continuation-viz.js`

**Sections (7):**
1. `sec-motivation` — "Beyond the Half-Plane" — Why we need zeta everywhere, s <-> 1-s symmetry
2. `sec-theta` — "Jacobi Theta Function" — theta(t) = sum exp(-pi n^2 t), modular relation theta(1/t) = sqrt(t) theta(t)
3. `sec-mellin` — "The Mellin Transform" — Definition, connection to zeta, pi^{-s/2} Gamma(s/2) zeta(s) = Mellin transform of theta
4. `sec-functional-eq` — "The Functional Equation" — Proof via theta function, statement of xi(s) = xi(1-s)
5. `sec-hurwitz` — "Hurwitz Zeta Function" — zeta(s,a) definition, analytic continuation, functional equation, connection to L(s,chi)
6. `sec-perron` — "Perron's Formula" — Statement, proof sketch, the bridge between Dirichlet series and summatory functions (key tool for Ch 7)
7. `sec-bridge` — "Where Are the Zeros?" — Bridge to Ch 6

**Visualizations (6):**
- `viz-theta-modular` (in -viz.js): theta(t) plotted for t in (0, 5). Show modular transformation: theta(1/t) = sqrt(t) * theta(t). Slider for t, show both sides match. Animated: as t crosses 1, the two expressions swap roles.
- `viz-poisson-duality`: Sum of Gaussians in time domain vs frequency domain. Animated: adding more terms, watch convergence on both sides. The Poisson summation formula in action.
- `viz-mellin-bridge`: Diagram: f(t) on left, Mellin transform M(s) on right, zeta in the middle. Animated arrows showing the transform chain.
- `viz-contour-hankel`: Hankel contour integral proof. Animated: the contour wraps around the negative real axis. Show how deforming the contour yields the functional equation.
- `viz-hurwitz-family` (in -viz.js): Domain coloring of zeta(s, a) for different a (slider: a from 0.1 to 1). At a=1, recovers zeta(s). Show how zeros move with a.
- `viz-perron-contour`: Perron's formula: the vertical contour integral. Animated: show how the contour at Re(s)=c captures sum_{n<=x} a(n). Moving x shows the step function emerging.

**Exercises (10):** Verify theta modular relation numerically. Derive functional equation from theta. Show zeta(-1) = -1/12 using functional equation. Compute zeta(s, 1/2) in terms of zeta. Apply Perron's formula to sum_{n<=x} 1.

- [ ] **Step 1:** Create main chapter file.
- [ ] **Step 2:** Create viz file with domain coloring visualizations.
- [ ] **Step 3:** Browser verify.
- [ ] **Step 4:** Commit.

---

## Task 8: Ch 6 — Zero-Free Regions

**Files:**
- Create: `chapters/ch06-zero-free-regions.js`
- Create: `chapters/ch06-zero-free-regions-viz.js`

**Sections (6):**
1. `sec-motivation` — "Why Zeros Matter" — PNT <=> no zeros on Re(s)=1, the strategy
2. `sec-no-zeros-line` — "No Zeros on Re(s) = 1" — The 3-4-1 inequality: 3 + 4cos(theta) + cos(2theta) >= 0, proof that zeta(1+it) != 0
3. `sec-classical-region` — "The Classical Zero-Free Region" — sigma > 1 - c/log(t), de la Vallee-Poussin's argument
4. `sec-vinogradov-korobov` — "Vinogradov-Korobov Improvement" — sigma > 1 - c/(log t)^{2/3}, statement without full proof
5. `sec-zero-landscape` — "The Zero Landscape" — What we know: all non-trivial zeros in 0 < Re(s) < 1, symmetry, RH preview
6. `sec-bridge` — "Armed for PNT" — Bridge to Ch 7

**Visualizations (6):**
- `viz-341-trick`: Animated: plot 3 + 4cos(theta) + cos(2theta) for theta in [0, 2pi]. Show it's always >= 0. Then show how this forces zeta to be non-zero on Re(s)=1.
- `viz-zero-free-region` (in -viz.js): Critical strip heatmap of |zeta(s)|. Overlay the classical zero-free region boundary. The Vinogradov-Korobov boundary as a second curve. Zeros marked as dots.
- `viz-zero-free-evolution`: Historical timeline of zero-free region improvements. Animated: the boundary curve moves closer to Re(s)=1/2 over time (de la VP 1896, Vinogradov 1958, ...).
- `viz-phase-portrait` (in -viz.js): Phase portrait of zeta near Re(s)=1. Arrows show the direction of zeta(s) in the complex plane. No fixed points = no zeros.
- `viz-contradiction-game`: Interactive: user places a hypothetical zero at sigma + it with sigma > 1 - c/log(t). Watch the 3-4-1 inequality produce a contradiction. Draggable zero point.
- `viz-zero-count`: N(T) = number of zeros with 0 < Im(rho) < T. Step function vs smooth approximation T/(2pi) log(T/(2pi e)). Animated.

**Exercises (8):** Prove 3+4cos+cos2 >= 0. Show zeta(1+it) != 0 implies PNT. Compute N(T) for small T numerically. Verify classical zero-free region for specific t values.

- [ ] **Step 1:** Create main chapter file.
- [ ] **Step 2:** Create viz file with heatmap/phase portrait visualizations.
- [ ] **Step 3:** Browser verify.
- [ ] **Step 4:** Commit.

---

## Task 9: Ch 7 — The Prime Number Theorem

**Files:**
- Create: `chapters/ch07-prime-number-theorem.js`

**Sections (7):**
1. `sec-motivation` — "The Climax" — PNT statement, historical significance, plan of proof
2. `sec-chebyshev` — "Chebyshev Functions" — psi(x), theta(x), equivalences between PNT forms
3. `sec-chebyshev-bounds` — "Chebyshev's Bounds" — c1 * x/log x < pi(x) < c2 * x/log x, elementary proof
4. `sec-perron-applied` — "Applying Perron's Formula" — psi(x) as contour integral of -zeta'/zeta
5. `sec-contour-proof` — "Shifting the Contour" — Moving the contour left, picking up residue at s=1, the zero-free region controls the error
6. `sec-error-term` — "The Error Term" — psi(x) = x + O(x exp(-c sqrt(log x))), what this means for pi(x)
7. `sec-bridge` — "Beyond the Leading Term" — Bridge to Ch 8 (explicit formula)

**Visualizations (7):**
- `viz-psi-convergence`: psi(x)/x animated, converging to 1. Running value display. Slider for x range (100 to 100000).
- `viz-chebyshev-sandwich`: pi(x) sandwiched between c1 * x/log x and c2 * x/log x. The bounds tighten as x grows. Animated.
- `viz-perron-integral`: Contour integral on the complex plane. Vertical line at Re(s) = c. Animated: the integrand -zeta'/zeta * x^s / s traced along the contour.
- `viz-contour-shift`: The key step: shift contour left. Animated: vertical line moves from c to 1-epsilon. Pole at s=1 gets "captured," contributing the main term x.
- `viz-three-approximations`: pi(x), x/ln(x), Li(x) all plotted together. Show relative errors. Li(x) is dramatically better. Slider for x range.
- `viz-error-shrinking`: |psi(x) - x| / x plotted. Show it shrinks but oscillates. Compare classical error exp(-c sqrt(log x)) envelope.
- `viz-pnt-history`: Timeline of PNT: Legendre/Gauss conjecture, Chebyshev bounds, Riemann's paper, de la VP/Hadamard proof, subsequent improvements.

**Exercises (10):** Show theta(x) ~ x implies pi(x) ~ x/log x. Compute psi(100) by hand. Verify Chebyshev's constants. Estimate the error in pi(10^6) ~ Li(10^6).

- [ ] **Step 1:** Create the file.
- [ ] **Step 2:** Browser verify.
- [ ] **Step 3:** Commit.

---

## Task 10: Ch 8 — The Explicit Formula & the Error Term

**Files:**
- Create: `chapters/ch08-explicit-formula.js`

**Sections (6):**
1. `sec-motivation` — "Zeros as Frequencies" — Each zero contributes a wave to the prime-counting function
2. `sec-von-mangoldt` — "Von Mangoldt's Explicit Formula" — psi(x) = x - sum_rho x^rho/rho - log(2pi) - (1/2)log(1-x^{-2}), proof outline
3. `sec-individual-zeros` — "Each Zero's Contribution" — x^rho / rho as oscillating term, amplitude and frequency
4. `sec-riemann-explicit` — "Riemann's Formula for pi(x)" — pi(x) via Mobius inversion of the explicit formula
5. `sec-rh-error` — "The Error Term Under RH" — If RH holds, psi(x) = x + O(x^{1/2} log^2 x), implications for pi(x)
6. `sec-bridge` — "From zeta to L-functions" — Bridge to Ch 9

**Visualizations (7):**
- `viz-zero-superposition` (STAR): The star visualization. Start with flat line. Add contribution of first zero: a smooth wave appears. Add second zero: interference. Slider: number of zeros included (1 to 200). Watch psi(x) staircase emerge from smooth waves. This is the centerpiece of the course.
- `viz-single-zero-wave`: Pick a single zero rho_n. Show Re(x^{rho_n} / rho_n) as a function of x. Amplitude decays as 1/|rho_n|, frequency is Im(rho_n).
- `viz-cumulative-zeros`: Show |psi(x) - x + sum_{first N zeros}| as N increases. The residual shrinks. Animated.
- `viz-rh-vs-classical`: Side-by-side: error term under classical bound vs under RH. Dramatic difference at large x.
- `viz-sound-analogy`: Zeros as "harmonics." Plot the individual waves and their sum. Each zero is a different color showing its frequency. Optional: add Web Audio API playback (tone for each zero frequency); degrade gracefully to visual-only oscillation plot if AudioContext unavailable.
- `viz-explicit-formula-anatomy`: Diagram: psi(x) = [main term x] - [sum over zeros] - [trivial zeros contribution] - [constant]. Each piece labeled and colored.
- `viz-skewes`: Li(x) - pi(x) > 0 for all known x, but the explicit formula implies it eventually changes sign. Show the slow oscillation. Skewes number context.

**Exercises (10):** Compute first zero's contribution at x=100. Verify explicit formula numerically for small x. Show how RH would improve the error. Estimate when Li(x) - pi(x) first changes sign.

- [ ] **Step 1:** Create the file.
- [ ] **Step 2:** Browser verify — especially the star visualization.
- [ ] **Step 3:** Commit.

---

## Task 11: Ch 9 — Dirichlet Characters & L-Functions

**Files:**
- Create: `chapters/ch09-dirichlet-characters.js`
- Create: `chapters/ch09-dirichlet-characters-viz.js`

**Sections (7):**
1. `sec-motivation` — "Filtering Primes by Residue Class" — Why we need characters: to separate primes mod q
2. `sec-characters` — "Dirichlet Characters" — Definition, group structure, principal character, examples for small q
3. `sec-orthogonality` — "Orthogonality Relations" — First and second orthogonality, extracting residue classes
4. `sec-gauss-sums` — "Gauss Sums" — Definition, |G(chi)| = sqrt(q), connection to functional equation
5. `sec-l-functions` — "L-Functions" — L(s,chi) definition, Euler product, analytic continuation, functional equation
6. `sec-l-function-properties` — "Properties of L-Functions" — Non-vanishing on Re(s)=1, zeros in the critical strip
7. `sec-bridge` — "Proving Dirichlet's Theorem" — Bridge to Ch 10

**Visualizations (6):**
- `viz-character-table`: Interactive character table for mod q (dropdown: q = 3,4,5,7,8). Highlight orthogonality: click a row, see dot products with other rows are 0.
- `viz-character-filter`: Characters as masks. Show integers 1..30. Apply chi_{q,a}: non-zero entries highlighted, zero entries dimmed. Animated: different characters filter different residue classes.
- `viz-l-function-gallery` (in -viz.js): Domain coloring of L(s, chi) for all chi mod 5. Gallery of 4 panels. Each chi gives a different coloring pattern. Zeros visible as black points.
- `viz-gauss-sum-circle`: Gauss sum sum chi(a) * e(a/q) plotted on the unit circle. Points are roots of unity weighted by chi. The sum is the vector sum. Animated for different chi.
- `viz-euler-product-l`: L-function Euler product assembly for L(s, chi_4) (the simplest non-trivial case). Compare with zeta assembly from Ch 3.
- `viz-orthogonality-demo`: Visual proof of orthogonality: sum_{a mod q} chi(a) bar{chi'(a)} as adding colored vectors. When chi != chi', they cancel.

**Exercises (10):** Compute character table mod 8. Verify orthogonality. Compute L(1, chi_4) = pi/4. Show L(s, chi_0) has a pole iff chi_0 is principal.

- [ ] **Step 1:** Create main chapter file.
- [ ] **Step 2:** Create viz file with L-function domain coloring.
- [ ] **Step 3:** Browser verify.
- [ ] **Step 4:** Commit.

---

## Task 12: Ch 10 — Dirichlet's Theorem & the L(1,chi) Problem

**Files:**
- Create: `chapters/ch10-dirichlet-theorem.js`

**Sections (7):**
1. `sec-motivation` — "Primes in Every Lane" — Dirichlet's theorem statement, significance
2. `sec-proof-setup` — "Proof Setup" — log L(s, chi) and sum over primes, orthogonality extracts primes in a fixed class
3. `sec-complex-chi` — "L(1, chi) != 0 for Complex chi" — The easy case, product formula argument
4. `sec-real-chi` — "L(1, chi) != 0 for Real chi" — The hard case, class number formula connection
5. `sec-quantitative` — "PNT for Arithmetic Progressions" — pi(x; q, a) ~ Li(x)/phi(q), Page's theorem
6. `sec-siegel` — "Siegel Zeros" — What if L(1, chi) is very small? Siegel's theorem, the "ineffective" constant
7. `sec-bridge` — "Beyond Zeta Methods" — Bridge to sieve methods (Ch 11)

**Visualizations (6):**
- `viz-prime-race-general`: Prime race: pi(x; q, a) for all a coprime to q. Dropdown for q = 3,4,5,7,8,12. Animated x sweep. Colors per residue class. Show convergence to 1/phi(q) share.
- `viz-l1-values`: Plot L(1, chi) for all non-principal chi mod q. Bar chart. None touch zero. Slider for q.
- `viz-siegel-near-miss`: Hypothetical: what if L(1, chi) = epsilon (very small)? Show how the error term in PNT for progressions would blow up. Interactive epsilon slider.
- `viz-equidistribution`: pi(x; q, a) / pi(x) for all a. Watch them converge to 1/phi(q). Animated with x slider.
- `viz-class-number`: Connection between L(1, chi) for real chi and class numbers of quadratic fields. Visual: lattice points in quadratic forms.
- `viz-chebyshev-bias`: Chebyshev bias: pi(x; 4, 3) > pi(x; 4, 1) most of the time. Plot the lead and show log-log density of the bias.

**Exercises (8):** Prove L(1, chi) != 0 for complex chi. Compute pi(1000; 5, a) for all a. Verify equidistribution numerically. Explain Chebyshev's bias heuristically.

- [ ] **Step 1:** Create the file.
- [ ] **Step 2:** Browser verify.
- [ ] **Step 3:** Commit.

---

## Task 13: Ch 11 — Sieve Methods I: Combinatorial Sieves

**Files:**
- Create: `chapters/ch11-combinatorial-sieves.js`

**Sections (7):**
1. `sec-motivation` — "Beyond L-Functions" — Why sieves: twin primes, Goldbach, problems zeta methods can't touch
2. `sec-eratosthenes` — "Sieve of Eratosthenes" — The algorithm, Legendre's formula, exact but impractical
3. `sec-inclusion-exclusion` — "The Inclusion-Exclusion Explosion" — sum mu(d) [x/d], the error terms accumulate, why truncation is needed
4. `sec-brun` — "Brun's Sieve" — Truncated inclusion-exclusion, upper and lower bounds
5. `sec-brun-theorem` — "Brun's Theorem" — sum 1/p (twin primes) converges, Brun's constant B_2 ~ 1.902
6. `sec-applications` — "Applications" — Upper bound on twin primes up to x, almost-primes
7. `sec-bridge` — "The Limits of Combinatorial Sieves" — Bridge to Selberg's sieve (Ch 12)

**Visualizations (7):**
- `viz-eratosthenes-grid`: Numbers 1..N on a grid. Animated: p=2 crosses out evens (red), p=3 crosses out multiples (orange), etc. Primes remain (blue). Slider for N.
- `viz-inclusion-exclusion`: Over/under counting oscillation. Bar chart: after 1 prime, overcount. After 2 primes, undercount. Alternating. Show it's not converging well.
- `viz-brun-truncation`: Same as above but stop after k terms. Upper bound (even k) and lower bound (odd k). Show the bounds tighten.
- `viz-twin-primes`: Number line with twin prime pairs highlighted. Animated search. Counter shows pairs found.
- `viz-brun-constant`: Partial sums of 1/p + 1/(p+2) over twin primes. Watch it converge to B_2 ~ 1.902. Compare with sum 1/p which diverges.
- `viz-sieve-function`: S(A, P, z) = |{a in A : gcd(a, P(z)) = 1}|. Animated: as z increases, fewer elements survive. Slider for z.
- `viz-almost-primes`: P_2 numbers (products of at most 2 primes) in [1, N]. Colored by type: primes (blue), semiprimes (teal), rest (dim). Show density.

**Exercises (10):** Implement Eratosthenes. Count twin primes up to 10^4. Prove Brun's constant converges. Apply Legendre's formula to count primes in [1, 100].

- [ ] **Step 1:** Create the file.
- [ ] **Step 2:** Browser verify.
- [ ] **Step 3:** Commit.

---

## Task 14: Ch 12 — Sieve Methods II: Selberg & Modern Sieves

**Files:**
- Create: `chapters/ch12-selberg-sieve.js`

**Sections (6):**
1. `sec-motivation` — "Optimization over Combinatorics" — Selberg's key idea: choose weights to minimize the upper bound
2. `sec-selberg-upper` — "Selberg's Upper Bound Sieve" — Lambda^2 method, the optimization problem, solution via Lagrange multipliers
3. `sec-sieve-dimension` — "Sieve Dimension & Sieve Limit" — kappa (dimension), beta (limit), what fraction of primes the sieve can "see"
4. `sec-lower-bounds` — "Lower Bound Sieves" — Rosser-Iwaniec, the beta sieve, achieving lower bounds
5. `sec-parity` — "The Parity Problem" — Why no sieve can distinguish primes from products of 2 primes, Selberg's parity barrier
6. `sec-bridge` — "A Different Kind of Sieve" — Bridge to Ch 13 (large sieve)

**Visualizations (6):**
- `viz-selberg-weights`: lambda_d weights as bar chart. Slider for sieve level D. Watch how weights change with D.
- `viz-sieve-limit`: Plot: sieve dimension kappa (x-axis) vs maximum fraction of primes detectable (y-axis). The sieve limit curve. Different sieves marked as points.
- `viz-parity-barrier`: Animated demonstration. Two sequences: primes and products of 2 primes. The sieve treats them identically. Show why: both have the same local structure modulo any set of primes.
- `viz-upper-lower-bounds`: Upper sieve bound and lower sieve bound for pi(x). The gap between them. As sieve level increases, both converge but never meet exactly.
- `viz-sieve-comparison`: Apply Brun, Selberg, beta sieve to the same problem (twin primes up to x). Compare the upper bounds obtained. Selberg wins.
- `viz-optimization-landscape`: The Selberg optimization: minimize sum lambda_d^2 / g(d) subject to lambda_1 = 1. Visualize the quadratic form (for small sieve dimension, show as 2D contour plot).

**Exercises (8):** Derive Selberg's upper bound for primes up to x. Explain the parity problem in your own words. Compare Brun and Selberg bounds for twin primes up to 10^6.

- [ ] **Step 1:** Create the file.
- [ ] **Step 2:** Browser verify.
- [ ] **Step 3:** Commit.

---

## Task 15: Ch 13 — The Large Sieve & Bombieri-Vinogradov

**Files:**
- Create: `chapters/ch13-large-sieve-bv.js`

**Sections (6):**
1. `sec-motivation` — "GRH on Average" — The large sieve is analytic, not combinatorial. BV gives GRH-quality results "on average over q."
2. `sec-large-sieve` — "The Large Sieve Inequality" — Additive form: sum |sum a_n e(n alpha_r)|^2 <= (N + Q^2) sum |a_n|^2. Proof idea via duality.
3. `sec-multiplicative-ls` — "Multiplicative Large Sieve" — Sum over characters: sum_chi |sum a_n chi(n)|^2 <= (N + Q^2) sum |a_n|^2. Connection to distribution in progressions.
4. `sec-bv-theorem` — "Bombieri-Vinogradov Theorem" — Statement: sum_{q<=Q} max_a |pi(x;q,a) - Li(x)/phi(q)| << x / log^A x for Q = x^{1/2} / log^B x. Proof sketch.
5. `sec-applications` — "Applications" — Chen's theorem setup, twin primes, short intervals
6. `sec-bridge` — "Exponential Sums" — Bridge to Ch 14

**Visualizations (6):**
- `viz-farey-circle`: Farey fractions of order Q on the unit circle. Animated: as Q increases, points fill in. Show well-spacing property.
- `viz-large-sieve-energy`: "Energy" cannot concentrate: sum of |S(alpha_r)|^2 bounded. Visual: bars at each alpha_r, total area bounded.
- `viz-bv-histogram`: For fixed x, compute |pi(x;q,a) - Li(x)/phi(q)| for many q. Histogram: most errors are small. The BV bound controls the sum.
- `viz-bv-vs-grh`: What GRH gives for individual q vs what BV gives on average. Side-by-side comparison.
- `viz-chen-setup`: Chen's theorem: every large even number = p + p2 (prime or product of 2 primes). Visual: combine sieve upper bound + BV to get the result.
- `viz-well-spacing`: Why well-spaced points matter. Put points too close: the inequality weakens. Drag points on the circle, watch the bound change.

**Exercises (8):** Prove the additive large sieve for 2 points. Verify BV numerically for x = 10000. Show how BV implies infinitely many primes in short intervals.

- [ ] **Step 1:** Create the file.
- [ ] **Step 2:** Browser verify.
- [ ] **Step 3:** Commit.

---

## Task 16: Ch 14 — Exponential Sums

**Files:**
- Create: `chapters/ch14-exponential-sums.js`

**Sections (7):**
1. `sec-motivation` — "Measuring Cancellation" — Exponential sums measure pseudorandomness. Full cancellation = random-like behavior.
2. `sec-weyl` — "Weyl Sums" — sum e(alpha n^k). Weyl's inequality. Weyl's equidistribution criterion.
3. `sec-van-der-corput` — "Van der Corput's Method" — A-process (differencing), B-process (Poisson summation). Iterate to improve bounds.
4. `sec-vinogradov` — "Vinogradov's Method" — The method of exponential pairs. Vinogradov's bound on sum e(alpha n).
5. `sec-gauss-kloosterman` — "Gauss & Kloosterman Sums" — Gauss sums revisited, Kloosterman sums S(m,n;c), the Weil bound |S| <= 2sqrt(c) (stated).
6. `sec-applications` — "Applications" — Bounds on zeta, lattice point problems, equidistribution
7. `sec-bridge` — "Engine of the Circle Method" — Bridge to Ch 15

**Visualizations (7):**
- `viz-weyl-spiral`: Plot cumulative sum S_N = sum_{n=1}^N e(alpha n^k) in the complex plane. Slider for alpha. Rational alpha: spiral closes (coherence). Irrational alpha: random walk (cancellation).
- `viz-cancellation-slider`: Alpha slider: as alpha sweeps from 0 to 1, |sum e(alpha n)| oscillates wildly. Show the dramatic difference between alpha near 0 and alpha irrational.
- `viz-van-der-corput-a`: A-process visualized: differencing turns S into S' with smaller terms. Animated: original sum → differenced sum.
- `viz-van-der-corput-b`: B-process: Poisson summation. Animated: switch from n-sum to integral + dual sum.
- `viz-kloosterman-path`: Kloosterman sum S(m, n; c) = sum e((ma + n bar{a})/c) traced in the complex plane. Slider for m, n, c. Beautiful curves.
- `viz-weil-bound`: |S(m,n;c)| <= 2 sqrt(c). Plot |S| for many (m,n) pairs, all inside the Weil circle. Animated scatter.
- `viz-equidistribution`: n*alpha mod 1 for irrational alpha. Points on [0,1). Animated: they fill in uniformly. Weyl's criterion in action.

**Exercises (8):** Compute Gauss sum for p=7. Show Weyl's inequality for k=2. Verify equidistribution of n*sqrt(2) mod 1 computationally.

- [ ] **Step 1:** Create the file.
- [ ] **Step 2:** Browser verify.
- [ ] **Step 3:** Commit.

---

## Task 17: Ch 15 — The Circle Method

**Files:**
- Create: `chapters/ch15-circle-method.js`

**Sections (7):**
1. `sec-motivation` — "Additive Problems" — Can every integer be written as a sum of primes? Of squares? The circle method attacks these.
2. `sec-setup` — "Setting Up the Integral" — r(n) = integral_0^1 f(alpha)^k e(-n alpha) d alpha. The key: analyze f(alpha) = sum e(alpha m^k).
3. `sec-major-minor` — "Major and Minor Arcs" — Partition [0,1) into arcs around rationals (major) and the rest (minor). Major arcs: approximate f(alpha).
4. `sec-waring` — "Waring's Problem" — g(k) and G(k). Hilbert's proof, Hardy-Littlewood asymptotic.
5. `sec-goldbach` — "Vinogradov's Theorem" — Every sufficiently large odd number is the sum of 3 primes. Proof outline via circle method.
6. `sec-singular-series` — "The Singular Series" — Product of local densities. When does the local-global principle hold?
7. `sec-bridge` — "The Distribution of Zeros" — Bridge to Ch 16

**Visualizations (6):**
- `viz-arc-partition`: Unit circle partitioned into major arcs (around a/q for small q, colored) and minor arcs (gray). Slider for Q: as Q increases, major arcs shrink, minor arcs dominate.
- `viz-major-arc-peak`: f(alpha) near a rational a/q. The function peaks sharply. Animated: zoom into a major arc, see the Gaussian-like shape.
- `viz-minor-arc-cancel`: f(alpha) on a minor arc: random walk behavior, small |f(alpha)|. Animated trace.
- `viz-goldbach-counting`: r(2n) = number of representations of 2n as sum of two primes. Bar chart for 2n = 4, 6, ..., 200. Grows roughly linearly.
- `viz-waring-decompose`: Decompose integers into sums of k-th powers. Interactive: pick k (2, 3, 4), pick n. Show all representations.
- `viz-singular-series`: S(n) = product of local factors p-adic density. For each prime p, show the local factor. The product converges. Bar chart of factors.

**Exercises (8):** Show 4 squares suffice for all n <= 100. Compute Goldbach representations for small even numbers. Explain why the singular series is a product over primes.

- [ ] **Step 1:** Create the file.
- [ ] **Step 2:** Browser verify.
- [ ] **Step 3:** Commit.

---

## Task 18: Ch 16 — Zeros of L-Functions

**Files:**
- Create: `chapters/ch16-zeros-of-l-functions.js`
- Create: `chapters/ch16-zeros-of-l-functions-viz.js`

**Sections (7):**
1. `sec-motivation` — "The Fine Structure of Zero Distribution" — Beyond counting zeros: how are they spaced?
2. `sec-rvmf` — "Riemann-von Mangoldt Formula" — N(T) = T/(2pi) log(T/(2pi e)) + O(log T). Proof outline.
3. `sec-zero-density` — "Zero Density Estimates" — N(sigma, T) = |{rho : Re(rho) >= sigma, |Im(rho)| <= T}|. Ingham's estimate.
4. `sec-density-hypothesis` — "The Density Hypothesis" — N(sigma, T) << T^{2(1-sigma)+epsilon}. Implications for primes.
5. `sec-pair-correlation` — "Montgomery's Pair Correlation" — The conjecture, connection to GUE random matrices.
6. `sec-random-matrices` — "Random Matrix Theory" — GUE, eigenvalue spacing, uncanny agreement with zeta zeros.
7. `sec-bridge` — "The Automorphic Perspective" — Bridge to Ch 17

**Visualizations (7):**
- `viz-nt-staircase`: N(T) staircase vs smooth approximation. Animated T sweep. Each step = a new zero found.
- `viz-zero-spacing`: Normalized gaps (gamma_{n+1} - gamma_n) * log(gamma_n) / (2pi) histogram. Compare with GUE prediction. Animated: add more zeros, histogram stabilizes.
- `viz-pair-correlation` (in -viz.js): Montgomery's pair correlation function. Plot r_2(x) = 1 - (sin(pi x) / (pi x))^2. Overlay empirical data from first 10^4 zeros.
- `viz-zero-density-heatmap` (in -viz.js): Heatmap of N(sigma, T) in the (sigma, T) plane. Colormap shows density. Use drawHeatmap.
- `viz-random-matrix`: Eigenvalue spacing of random GUE matrices. Generate a random matrix, compute eigenvalues, plot spacings. Compare with zeta zeros.
- `viz-gue-comparison`: Side-by-side: zeta zero spacings vs GUE eigenvalue spacings. Overlay histograms. The match is remarkable.
- `viz-density-bounds`: Plot of N(sigma, T) / T for various sigma. The density hypothesis line vs Ingham's result vs trivial bound.

**Exercises (8):** Compute N(T) for T = 50. Generate eigenvalues of a 10x10 GUE matrix. Verify the pair correlation conjecture numerically for first 100 zeros.

- [ ] **Step 1:** Create main chapter file.
- [ ] **Step 2:** Create viz file with heatmap and pair correlation.
- [ ] **Step 3:** Browser verify.
- [ ] **Step 4:** Commit.

---

## Task 19: Ch 17 — Automorphic Forms: A First Look

**Files:**
- Create: `chapters/ch17-automorphic-forms.js`
- Create: `chapters/ch17-automorphic-forms-viz.js` (heatmap on upper half-plane)

**Sections (6):**
1. `sec-motivation` — "The Unifying Framework" — Why modular forms: every L-function we've met arises from one.
2. `sec-modular-forms` — "Modular Forms" — Definition, weight, examples (Eisenstein series, Delta function), space M_k.
3. `sec-fundamental-domain` — "The Fundamental Domain" — SL(2,Z) action on H, fundamental domain, cusps.
4. `sec-hecke` — "Hecke Operators & Eigenforms" — T_p operators, eigenforms, Euler product for L(s, f).
5. `sec-ramanujan` — "Ramanujan & Langlands" — Ramanujan conjecture (now theorem for holomorphic forms), Langlands program as grand unification. Stated, not proved.
6. `sec-bridge` — "From Theory to the Frontier" — Bridge to Ch 18

**Visualizations (6):**
- `viz-fundamental-domain`: Upper half-plane with fundamental domain of SL(2,Z). Animated: apply S, T, ST generators, watch copies tile the plane.
- `viz-modular-form-heatmap` (in -viz.js): |f(z)| for f = Eisenstein E_4, E_6, Delta plotted as contour heatmap on H. Dropdown to select form. Uses drawHeatmap adapted to the half-plane coordinates.
- `viz-hecke-lattice`: Hecke operator T_p: geometric action on lattices. Show sublattices of index p. Animated.
- `viz-l-function-gallery`: L-functions from modular forms. Plot |L(1/2+it, f)| for f = Delta, E_4, etc. Compare zero spacings.
- `viz-langlands-map`: The web of functoriality. Nodes: Dirichlet characters, modular forms, Maass forms, GL(n) representations. Edges: known functorial lifts. Click a node to see examples.
- `viz-ramanujan-tau`: tau(n) for n = 1..100. Scatter plot. The Ramanujan conjecture: |tau(p)| <= 2 p^{11/2}. Show the bound as envelope.

**Exercises (8):** Compute first few Fourier coefficients of E_4. Verify tau(p) bound for small primes. Show Delta = (E_4^3 - E_6^2)/1728.

- [ ] **Step 1:** Create main chapter file.
- [ ] **Step 2:** Create viz file with heatmap on upper half-plane.
- [ ] **Step 3:** Browser verify.
- [ ] **Step 4:** Commit.

---

## Task 20: Ch 18 — Primes in Short Intervals

**Files:**
- Create: `chapters/ch18-short-intervals.js`

**Sections (6):**
1. `sec-motivation` — "How Short Is Short Enough?" — Does [x, x+x^theta] always contain a prime? For what theta?
2. `sec-hoheisel` — "Hoheisel and Beyond" — First result: theta < 1 is possible. Ingham, Huxley improvements.
3. `sec-bhp` — "Baker-Harman-Pintz" — Current unconditional record: theta = 0.525.
4. `sec-conditional` — "Conditional Results" — Under RH: theta = 1/2 + epsilon. Under Lindelof: even better.
5. `sec-cramer` — "Cramer's Conjecture" — Random model for primes. Maximal gaps ~ (log x)^2. Evidence and counterevidence.
6. `sec-bridge` — "From Gaps to Bounded Gaps" — Bridge to Ch 19

**Visualizations (6):**
- `viz-short-interval`: Interval [x, x + x^theta]. Slider for theta (0.3 to 1.0). Show primes in the interval for random x. Color: green if contains a prime, red if not.
- `viz-theta-timeline`: Historical progress: theta shrinking over decades. Animated timeline from Hoheisel (1930) to BHP (2001).
- `viz-cramer-model`: Random model: each integer n is "prime" with probability 1/log(n). Generate random primes, compare gap distribution with actual.
- `viz-maximal-gaps`: Record prime gaps vs Cramer's prediction (log p)^2. Scatter plot with prediction curve.
- `viz-interval-density`: For x = 10^k, plot fraction of intervals [x, x+x^theta] that contain a prime. Different theta values.
- `viz-conditional-comparison`: theta required for guaranteed prime: unconditional vs RH vs Lindelof vs Cramer. Bar chart comparison.

**Exercises (8):** Find the largest prime gap below 10^6. Verify BHP bound for specific x. Simulate Cramer's model.

- [ ] **Step 1:** Create the file.
- [ ] **Step 2:** Browser verify.
- [ ] **Step 3:** Commit.

---

## Task 21: Ch 19 — Bounded Gaps Between Primes

**Files:**
- Create: `chapters/ch19-bounded-gaps.js`

**Sections (6):**
1. `sec-motivation` — "The Twin Prime Dream" — Infinitely many primes differing by 2? We can't prove it, but...
2. `sec-gpy` — "The GPY Method" — Goldston-Pintz-Yildirim: under EH, bounded gaps. The shifted sieve.
3. `sec-zhang` — "Zhang's Breakthrough" — 2013: unconditional proof of H <= 70,000,000. Key ideas.
4. `sec-maynard-tao` — "Maynard-Tao" — Multidimensional sieve weights. H <= 600, then Polymath 8b to H <= 246.
5. `sec-k-tuples` — "Admissible k-Tuples" — Hardy-Littlewood conjecture, admissibility, the Maynard-Tao result for k-tuples.
6. `sec-bridge` — "Computation Meets Theory" — Bridge to Ch 20

**Visualizations (6):**
- `viz-bounded-gap-timeline`: H_1 bound over time: infinity → 70,000,000 → 600 → 246. Animated.
- `viz-gpy-weights`: The GPY sieve weight function. 2D contour plot of the optimal weight on the simplex.
- `viz-admissible-tuples`: Admissible k-tuples: {0, 2, 6, 8, ...}. Show which sets are admissible (no residue class mod p is fully covered). Interactive: user proposes a tuple, system checks admissibility.
- `viz-maynard-simplex`: Maynard's weight function on the k-dimensional simplex (projected to 2D for k=3). Contour plot showing where the weight concentrates.
- `viz-prime-constellations`: Prime k-tuples up to N. For each pattern (twin, cousin, sexy, triplet, ...), count occurrences. Bar chart.
- `viz-polymath-collaboration`: Polymath 8 timeline: how crowdsourced improvements reduced H_1 from 4680 to 246. Interactive timeline with contributor annotations.

**Exercises (8):** Verify {0,2,6} is admissible. Show {0,2,4} is not admissible. Count twin primes up to 10^5. Explain why Maynard-Tao doesn't prove the twin prime conjecture.

- [ ] **Step 1:** Create the file.
- [ ] **Step 2:** Browser verify.
- [ ] **Step 3:** Commit.

---

## Task 22: Ch 20 — Computational Analytic Number Theory

**Files:**
- Create: `chapters/ch20-computational-ant.js`

**Sections (6):**
1. `sec-motivation` — "Theory Meets Machine" — Computation as both verification and discovery tool.
2. `sec-riemann-siegel` — "The Riemann-Siegel Formula" — Z(t), the real function whose sign changes locate zeros. Fast evaluation.
3. `sec-zero-verification` — "Verifying RH" — Turing's method, the Odlyzko-Schonhage algorithm, current records (10^13 zeros verified).
4. `sec-computing-pi` — "Computing pi(x)" — Meissel-Lehmer-Lagarias-Miller-Odlyzko. Exact counts for x up to 10^{28}.
5. `sec-primality` — "Primality Testing" — Miller-Rabin, AKS, connections to analytic number theory.
6. `sec-bridge` — "What Remains Open" — Bridge to Ch 21

**Visualizations (6):**
- `viz-riemann-siegel-z`: Plot Z(t) for t in [0, 50]. Sign changes = zeros on the critical line. Animated trace. Slider for t range.
- `viz-zero-verification`: Turing's method step by step. For an interval [T, T+H]: count sign changes of Z(t), compare with N(T+H)-N(T). Animated.
- `viz-meissel-lehmer`: Tree diagram of the Meissel-Lehmer computation. Show how pi(x) is recursively decomposed.
- `viz-record-timeline`: Timeline of computational records: zeros verified, pi(x) computed, largest known primes. Interactive.
- `viz-z-interactive`: User enters a t value, compute Z(t) using the Riemann-Siegel formula (simplified). Show the computation.
- `viz-miller-rabin`: Miller-Rabin primality test animated: pick base a, compute a^d mod n, check witnesses. Show how composites get caught.

**Exercises (8):** Implement Riemann-Siegel Z(t) for small t. Find zeros of Z(t) in [0, 30]. Use Miller-Rabin to test specific numbers.

- [ ] **Step 1:** Create the file.
- [ ] **Step 2:** Browser verify.
- [ ] **Step 3:** Commit.

---

## Task 23: Ch 21 — Open Problems & the Road Ahead

**Files:**
- Create: `chapters/ch21-open-problems.js`

**Sections (6):**
1. `sec-motivation` — "What We Know, What We Dream" — Synthesis of the entire course.
2. `sec-rh` — "The Riemann Hypothesis" — Statement, evidence, equivalent forms, million-dollar prize.
3. `sec-landau` — "Landau's Four Problems" — Twin primes, Goldbach, n^2+1 primes, prime gaps. Current status.
4. `sec-langlands` — "The Langlands Program" — What it would mean for number theory. Known cases. Future directions.
5. `sec-recent` — "Recent Breakthroughs" — Zhang-Maynard-Tao, Helfgott (ternary Goldbach for all N), Matomaki-Radziwill.
6. `sec-coda` — "The Unfinished Symphony" — What makes analytic number theory beautiful. An invitation to research.

**Visualizations (6):**
- `viz-conjecture-web`: Grand diagram: nodes = major conjectures (RH, GRH, twin primes, Goldbach, Lindelof, density hypothesis). Edges = implications. Click to see details.
- `viz-rh-implications`: "If RH then..." cascade. Interactive: click RH, watch consequences light up.
- `viz-progress-timeline`: Major results in analytic number theory from 1737 (Euler) to 2025. Interactive scrollable timeline.
- `viz-gue-final`: Final comparison: first 10^4 zeta zero spacings vs GUE prediction. The capstone visualization.
- `viz-landau-status`: Landau's 4 problems. For each: best known result, visualized. Traffic light status (red/yellow/green).
- `viz-open-gallery`: Gallery of unsolved problems, each with a visual "signature" (e.g., twin primes → gap distribution, Goldbach → representation counts).

**Exercises (8):** Essay-style: which open problem would you attack? Why? Verify RH numerically for first 50 zeros. List 5 consequences of RH.

- [ ] **Step 1:** Create the file.
- [ ] **Step 2:** Browser verify.
- [ ] **Step 3:** Commit.

---

## Task 24: Integration & Final Verification

**Files:**
- All chapter files and scaffold files

### Steps

- [ ] **Step 1: Full navigation test**

Open `index.html`. Click through all 22 chapters. Verify:
- Every chapter loads (no console errors)
- All section tabs work
- All visualizations render and are interactive
- All exercises show/hide properly
- Progress tracking works (sections mark as complete)
- Search filters chapters correctly

- [ ] **Step 2: Cross-chapter consistency check**

Verify:
- All chapters use consistent KaTeX notation (\\zeta, \\pi, \\psi, etc.)
- All motivation blocks use `<div class="env-block intuition">`
- All bridges use `<div class="env-block remark">`
- All theorems/definitions/proofs use correct CSS classes

- [ ] **Step 3: Responsive test**

Resize browser to mobile width (< 768px). Verify sidebar toggle works, content is readable, visualizations resize gracefully.

- [ ] **Step 4: Final commit**

```bash
git add -A
git commit -m "feat: complete analytic number theory course — 22 chapters, ~140 viz, ~200 exercises"
```
