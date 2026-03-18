# Analytic Number Theory -- Interactive Course Design

**Tier:** 5 (Research Frontier)
**References:** Apostol, *Introduction to Analytic Number Theory*; Davenport, *Multiplicative Number Theory*; Iwaniec & Kowalski, *Analytic Number Theory*
**Audience:** Assumes mastery of real analysis, complex analysis, and elementary number theory
**Organization:** Classical textbook order with strong motivation/bridging between chapters

## Architecture

Follows existing 科学教室 pattern:
- `index.html` -- shell with KaTeX, sidebar, welcome screen, chapter manifest
- `styles.css` -- dark theme, math environments, viz containers, responsive layout
- `app.js` -- lazy-loading chapters, localStorage progress (`analytic-number-theory-progress`), section tabs, exercises, navigation
- `viz-engine.js` -- Canvas-based VizEngine class with grid/axes/vectors/points/draggables/sliders/animation. **Extensions needed for this course:** `drawDomainColoring(f, xRange, yRange)` for per-pixel complex function visualization, `drawHeatmap(data, colorMap)` for density plots. Both use `ctx.createImageData`/`putImageData`.
- `chapters/chNN-<slug>.js` -- chapter content modules (22 files)
- `chapters/chNN-<slug>-viz.js` -- optional companion files for heavy visualizations (domain coloring, pixel-level rendering). Loaded automatically by app.js if present.

### Chapter File Names

```
ch00-drama-of-primes.js          ch11-combinatorial-sieves.js
ch01-arithmetic-functions.js     ch12-selberg-sieve.js
ch02-averages.js                 ch13-large-sieve-bv.js
ch03-dirichlet-series.js         ch14-exponential-sums.js
ch04-riemann-zeta.js             ch15-circle-method.js
ch05-analytic-continuation.js    ch16-zeros-of-l-functions.js
ch06-zero-free-regions.js        ch17-automorphic-forms.js
ch07-prime-number-theorem.js     ch18-short-intervals.js
ch08-explicit-formula.js         ch19-bounded-gaps.js
ch09-dirichlet-characters.js     ch20-computational-ant.js
ch10-dirichlet-theorem.js        ch21-open-problems.js
```

## Chapter Outline (22 chapters)

### Part A: Foundations (Ch 0-2)

**Ch 0: The Drama of the Primes**
- Motivation: The entire course in one picture -- why are primes distributed the way they are?
- Content: Irregularity of primes, pi(x) staircase, historical arc from Euclid to Riemann, Euler's proof of infinite primes via zeta, Legendre/Gauss conjectures
- Visualizations:
  - Animated pi(x) staircase vs x/ln(x) and Li(x)
  - Prime gap oscillations (gap_n vs n, animated)
  - Ulam spiral (interactive zoom, capped at 10000 to avoid performance issues)
  - Euler product animated: removing composite contributions one prime at a time
  - Prime race: pi(x;4,1) vs pi(x;4,3)
- Bridge: To count primes, we need to understand arithmetic functions and their averages.

**Ch 1: Arithmetic Functions**
- Motivation: Primes hide inside multiplicative structure; arithmetic functions are the language for extracting them.
- Content: Euler phi, Mobius mu, divisor functions d(n) and sigma(n), Liouville lambda, von Mangoldt Lambda, Dirichlet convolution, Mobius inversion, multiplicative vs completely multiplicative
- Visualizations:
  - Scatter plots of phi(n)/n, d(n), sigma(n) with running averages
  - Dirichlet convolution as animated "summation over divisors"
  - Mobius inversion: visual proof (inclusion-exclusion on divisor lattice)
  - Von Mangoldt function as a "spike detector" for prime powers
  - Multiplicative function builder: pick f(p), watch f propagate to all n
- Bridge: Knowing individual values is not enough; we need their averages to understand primes statistically.

**Ch 2: Averages of Arithmetic Functions**
- Motivation: The average order of an arithmetic function reveals its large-scale behavior, smoothing out local chaos.
- Content: Summatory functions, Abel summation, Euler-Maclaurin formula, Dirichlet hyperbola method, average orders of d(n), sigma(n), phi(n), Lambda(n)
- Visualizations:
  - Hyperbola method: animated lattice point counting under xy=n
  - Abel summation: geometric interpretation (area under step function)
  - Running averages of d(n), phi(n)/n with theoretical curves overlaid
  - Error term visualization: summatory function minus main term, showing oscillations
  - Euler-Maclaurin: trapezoidal approximation vs integral, animated correction terms
- Bridge: Dirichlet series package these averages into a single analytic object, unlocking complex analysis.

### Part B: Dirichlet Series & the Zeta Function (Ch 3-5)

**Ch 3: Dirichlet Series & Euler Products**
- Motivation: Encoding arithmetic in analysis -- every multiplicative function becomes a product over primes.
- Content: Convergence (absolute, conditional), abscissa of convergence, Euler product formula, formal and analytic properties, uniqueness theorem, examples (zeta, L-functions, Ramanujan tau)
- Visualizations:
  - Complex plane: convergence half-plane boundary, colored by |sum - partial sum|
  - Euler product assembly: multiplying factors (1-p^{-s})^{-1} one prime at a time, watching the product converge
  - Partial sums of zeta(s) on the complex plane as spiraling sums
  - Abscissa of convergence as a moving vertical wall
  - Comparison: different Dirichlet series and their convergence regions
- Bridge: The most important Dirichlet series is zeta(s). What are its properties beyond Re(s)>1?

**Ch 4: The Riemann Zeta Function**
- Motivation: zeta(s) is the master key -- its analytic properties encode the distribution of primes.
- Content: zeta in Re(s)>1, meromorphic continuation to Re(s)>0 (via 1-2^{1-s} trick), the pole at s=1, special values zeta(2k), Gamma function and its properties, xi function, functional equation statement
- Visualizations:
  - Domain coloring of zeta(s) in the critical strip (interactive pan/zoom)
  - zeta on the real line: pole at s=1, trivial zeros at -2,-4,..., special values
  - Gamma function: animated interpolation of factorials
  - |zeta(1/2+it)| as t varies -- the "landscape" on the critical line
  - Xi function symmetry: xi(s) = xi(1-s) shown via domain coloring
- Bridge: We stated the functional equation; now let's prove it and understand the deeper structure.

**Ch 5: Analytic Continuation & Functional Equation**
- Motivation: Extending zeta to the whole complex plane reveals the hidden symmetry s <-> 1-s.
- Content: Riemann's original proof via theta function, Poisson summation, Mellin transform, Jacobi theta function and modular relation, three proofs of the functional equation (theta, contour integral, Hurwitz zeta). Hurwitz zeta zeta(s,a) developed as a standalone object here (not just a proof device), as it is the bridge to L-functions in Ch 9 via L(s,chi) = q^{-s} sum chi(a) zeta(s, a/q). Also introduces Perron's formula as the key tool connecting Dirichlet series to summatory functions (used in Ch 7).
- Visualizations:
  - Theta function: modular transformation theta(1/t) = sqrt(t) theta(t) animated
  - Poisson summation: time domain vs frequency domain, animated duality
  - Mellin transform as a "bridge" diagram connecting f, F, and zeta
  - Contour deformation: Hankel contour integral proof animated step by step
  - s <-> 1-s symmetry: domain coloring with reflection axis highlighted
- Bridge: With zeta extended everywhere, the critical question is: where are its zeros?

### Part C: The Prime Number Theorem (Ch 6-8)

**Ch 6: Zero-Free Regions**
- Motivation: PNT is equivalent to "no zeros on Re(s)=1." How do we push the zero-free region into the strip?
- Content: zeta has no zeros on Re(s)=1 (de la Vallee-Poussin), the 3-4-1 inequality, classical zero-free region sigma > 1 - c/log(t), Vinogradov-Korobov improvements
- Visualizations:
  - Critical strip heatmap: known zero-free region boundary overlaid on |zeta| coloring
  - The 3-4-1 trick: animated inequality Re(3+4cos(theta)+cos(2theta)) >= 0
  - Zero-free region evolution: how the boundary has improved historically (animated timeline)
  - Phase portrait of zeta near Re(s)=1 showing why zeros cannot exist there
  - Interactive: place a hypothetical zero and watch the contradiction develop
- Bridge: No zeros on Re(s)=1 is the key input. Now we extract PNT via contour integration.

**Ch 7: The Prime Number Theorem**
- Motivation: The climax -- pi(x) ~ x/ln(x), proved via complex analysis.
- Content: Chebyshev functions psi(x) and theta(x), equivalence of PNT forms, Perron's formula, contour integral proof (shifting the contour left), PNT with classical error term
- Visualizations:
  - psi(x)/x converging to 1 (animated, with running value)
  - Perron's formula: contour integral on the complex plane, animated path
  - Contour shift: moving the vertical line left, picking up the pole at s=1
  - pi(x) vs Li(x) vs x/ln(x) -- three approximations compared dynamically
  - Error term |psi(x)-x|/x -- shrinking but oscillating
  - Chebyshev's bounds: the "sandwich" tightening over time
- Bridge: PNT gives the leading term. The explicit formula shows exactly how zeros control the error.

**Ch 8: The Explicit Formula & the Error Term**
- Motivation: Each zeta zero creates a wave in the prime-counting function. The explicit formula is the exact decomposition.
- Content: von Mangoldt explicit formula, Riemann's explicit formula for pi(x), contribution of each zero rho, error term under RH
- Visualizations:
  - **Star visualization**: adding zero contributions one by one to psi(x), watching the step function emerge from smooth waves
  - Individual zero's wave: x^rho / rho as an oscillating correction
  - Cumulative: first 10, 50, 200 zeros -- convergence to psi(x)
  - RH error vs classical error: side-by-side comparison
  - Sound analogy: zeros as "frequencies," primes as the "signal" (optional Web Audio API extension; degrade gracefully to visual-only oscillation plot if audio unavailable)
- Bridge: The same machinery works for primes in arithmetic progressions, using L-functions.

### Part D: L-Functions & Primes in Progressions (Ch 9-10)

**Ch 9: Dirichlet Characters & L-Functions**
- Motivation: To separate primes by residue class, we need "frequency filters" -- Dirichlet characters.
- Content: Group of characters mod q, orthogonality relations, Gauss sums, L(s,chi) definition, Euler product, analytic continuation, functional equation for L-functions
- Visualizations:
  - Character table for small q (interactive, highlight orthogonality)
  - Characters as "masks" filtering integers by residue class (animated)
  - Domain coloring gallery: L(s,chi) for various chi mod 5, 7, 8
  - Gauss sum on the unit circle: roots of unity weighted by chi
  - L-function Euler product assembly (parallel to Ch 3 but with character twist)
- Bridge: With L-functions in hand, Dirichlet's theorem follows -- but L(1,chi) != 0 is the crux.

**Ch 10: Dirichlet's Theorem & the L(1,chi) Problem**
- Motivation: Every arithmetic progression a, a+q, a+2q, ... with gcd(a,q)=1 contains infinitely many primes.
- Content: Proof of Dirichlet's theorem, L(1,chi) != 0 for complex chi (easy) and real chi (hard), class number formula, quantitative form (PNT for progressions), Siegel zeros
- Visualizations:
  - Prime race: pi(x;q,a) for all reduced residues mod q, animated
  - L(1,chi) values on the real line for various chi -- none touching zero
  - Siegel zero: what would happen if L(1,chi) were very small (near-miss scenario)
  - Equidistribution: primes mod q converging to 1/phi(q) share
  - Class number connection: lattice points in quadratic forms
- Bridge: We now have PNT for progressions. The remaining chapters develop advanced tools and frontiers.

### Part E: Sieve Methods (Ch 11-13)

**Ch 11: Sieve Methods I: Combinatorial Sieves**
- Motivation: Sieves attack problems (twin primes, Goldbach) that zeta-function methods cannot reach alone.
- Content: Sieve of Eratosthenes, Legendre's formula, inclusion-exclusion explosion, Brun's sieve, Brun's theorem (twin prime sum converges), Brun-Hooley sieve
- Visualizations:
  - Eratosthenes sieve: numbers on a grid, colored as each prime sifts them out (animated)
  - Inclusion-exclusion oscillation: over-count / under-count with increasing terms
  - Brun's sieve: truncated inclusion-exclusion, upper/lower bounds converging
  - Twin prime pairs highlighted on the number line (animated search)
  - Brun's constant: partial sums of 1/p + 1/(p+2) converging
- Bridge: Combinatorial sieves have inherent limits. Selberg's idea overcomes them with optimization.

**Ch 12: Sieve Methods II: Selberg's Sieve & Modern Sieves**
- Motivation: Selberg's Lambda^2 method transforms sieving into an optimization problem.
- Content: Selberg's upper bound sieve, Lambda^2 weights, sieve dimension/limit, lower bound sieves (Rosser-Iwaniec), beta sieve, parity problem
- Visualizations:
  - Selberg weights lambda_d as a function of d (bar chart, interactive sieve level)
  - Sieve limit: what fraction of primes can the sieve "see" as a function of sieve dimension
  - Parity barrier: animated demonstration of why sieves cannot distinguish primes from products of 2 primes
  - Upper vs lower sieve bounds: the gap narrowing with sieve level
  - Comparison: Brun vs Selberg vs beta sieve on the same problem
- Bridge: The large sieve operates in a completely different way -- via analytic inequalities on exponential sums.

**Ch 13: The Large Sieve & Bombieri-Vinogradov**
- Motivation: The large sieve inequality is a tool of stunning generality; Bombieri-Vinogradov gives "GRH on average."
- Content: Large sieve inequality (additive and multiplicative forms), Farey arcs, proof sketch, Bombieri-Vinogradov theorem, applications to twin primes and short intervals
- Visualizations:
  - Farey sequence on the unit circle (animated construction for increasing Q)
  - Large sieve: well-spaced points on the circle, "energy" cannot concentrate
  - Bombieri-Vinogradov: error terms E(x;q,a) for many q, most are small (animated histogram)
  - BV vs individual GRH: what we know vs what we'd like to know
  - Application: Chen's theorem setup (combining sieve + BV)
- Bridge: Beyond classical primes, exponential sums give fine-grained control over arithmetic sums.

### Part F: Advanced Methods (Ch 14-17)

**Ch 14: Exponential Sums**
- Motivation: Exponential sums measure the "randomness" of sequences -- cancellation means pseudorandomness.
- Content: Weyl sums, van der Corput method (A/B processes), Vinogradov's method, Gauss sums revisited, Kloosterman sums, Weil bound (stated without proof; the proof requires algebraic geometry over finite fields, beyond our prerequisites)
- Visualizations:
  - Weyl sum trajectory: e(alpha * n^k) plotted as cumulative sum in C, showing spiral/random walk
  - Cancellation vs coherence: slider for alpha (rational vs irrational), dramatic behavior change
  - Van der Corput: animated A-process (differencing) and B-process (Poisson)
  - Kloosterman sum paths in the complex plane for varying parameters
  - Weil bound: |S| <= 2sqrt(p) as a circle containing the sum
- Bridge: Exponential sums are the engine of the circle method, which tackles additive problems.

**Ch 15: The Circle Method**
- Motivation: Waring's problem and Goldbach -- can every integer be represented as a sum of primes or powers?
- Content: Hardy-Littlewood circle method, major and minor arcs, Waring's problem, ternary Goldbach (Vinogradov's theorem), singular series, local-global principle
- Visualizations:
  - Unit circle partitioned into major and minor arcs (animated, increasing Q)
  - Major arc contribution: each rational a/q contributes a "peak" (animated)
  - Minor arc: exponential sum cancellation shown via random walk
  - Goldbach counting function: number of representations of 2n as p+p' (bar chart)
  - Waring's problem: g(k) and G(k) values, visual decomposition of integers into k-th powers
- Bridge: Modern number theory views L-functions through the lens of automorphic forms.

**Ch 16: Zeros of L-Functions**
- Motivation: Understanding the vertical distribution of zeros gives deeper control over arithmetic.
- Content: Riemann-von Mangoldt formula for N(T), zero density estimates, Ingham's theorem, density hypothesis, pair correlation (Montgomery), GUE connection
- Visualizations:
  - N(T) staircase vs smooth approximation (T/2pi log T/2pi e)
  - Zero spacing histogram: normalized gaps between zeros vs GUE prediction
  - Montgomery pair correlation: the "repulsion" of nearby zeros
  - Zero density N(sigma, T): heatmap in the (sigma, T) plane
  - Random matrix comparison: eigenvalue spacings of random unitary matrices
- Bridge: The deepest modern perspective unifies all these L-functions through automorphic forms.

**Ch 17: Automorphic Forms: A First Look**
- Motivation: Modular forms are the "right" framework -- every classical L-function arises from one.
- Note: This is a roadmap chapter. Results are stated with motivation and examples, not proved in full. The goal is to show how the classical theory of Parts A-F fits into the modern framework.
- Content: Modular forms definition and examples, fundamental domain of SL(2,Z), Hecke operators and eigenforms, L-functions attached to modular forms, Ramanujan conjecture (stated), Langlands program overview (stated, with examples of known cases)
- Visualizations:
  - Upper half-plane: fundamental domain tiled by SL(2,Z) action (animated)
  - Modular form |f(z)| as contour heatmap on H (using drawHeatmap, not 3D)
  - Hecke operator T_p: geometric action on lattices
  - L-function gallery: Ramanujan tau, elliptic curve L-functions, symmetric power L-functions
  - Langlands diagram: nodes = types of automorphic objects (Dirichlet characters, modular forms, Maass forms, GL(n) automorphic representations), edges = known functorial lifts; click node to see examples and associated L-functions
- Bridge: We now survey the frontiers where all these tools converge.

### Part G: Frontiers (Ch 18-21)

**Ch 18: Primes in Short Intervals**
- Motivation: How short can an interval [x, x+y] be while still guaranteed to contain a prime?
- Content: Huxley's theorem, Hoheisel's result, Baker-Harman-Pintz, conditional results under RH, Cramer's conjecture
- Visualizations:
  - Interval [x, x+x^theta]: slider for theta, showing which intervals contain primes
  - Historical progress: theta shrinking over time (animated timeline)
  - Cramer's model: random vs actual prime gaps comparison
  - Maximal gaps: record gaps plotted against Cramer's prediction
  - Density of primes in [x, x+x^0.525] for large x
- Bridge: From gaps to bounded gaps -- the explosive recent progress.

**Ch 19: Bounded Gaps Between Primes**
- Motivation: Zhang's 2013 breakthrough -- infinitely many prime pairs within a bounded distance.
- Content: GPY sieve method, Zhang's theorem, Maynard-Tao improvement, Polymath 8, current records, the method of multidimensional sieves
- Visualizations:
  - GPY sieve weights: the multidimensional optimization landscape
  - Bounded gap timeline: from Zhang's 70,000,000 to Polymath's 246 (animated)
  - k-tuples: admissible sets and their density
  - Maynard's sieve: weight function on k-dimensional simplex
  - Prime constellations: known patterns and their counts up to x
- Bridge: Beyond individual problems, computational methods verify and extend theory.

**Ch 20: Computational Analytic Number Theory**
- Motivation: Computation is both a testing ground and a discovery tool for number theory.
- Content: Computing zeta zeros (Riemann-Siegel formula, Odlyzko-Schonhage), verifying RH up to height T, computing pi(x) for large x (Meissel-Lehmer), primality testing connections
- Visualizations:
  - Riemann-Siegel Z(t): the real function whose sign changes locate zeros (animated)
  - Zero verification: Turing's method illustrated step by step
  - Pi(x) computation: Meissel-Lehmer formula tree of contributions
  - Record computations timeline: billions of zeros verified
  - Interactive: compute Z(t) for user-chosen t values
- Bridge: Computation reveals patterns and suggests conjectures. The final chapter surveys what remains open.

**Ch 21: Open Problems & the Road Ahead**
- Motivation: Synthesis -- where does the subject stand, and where is it going?
- Content: RH status, twin prime conjecture, Goldbach, Landau's problems, Langlands program, random matrix connections, quantum chaos, recent breakthroughs summary
- Visualizations:
  - Grand unified diagram: connections between major conjectures
  - Progress timeline: major results in analytic number theory (interactive)
  - Random matrix / zeta zero comparison (GUE conjecture)
  - The "web" of implications: if RH then X, if GRH then Y
  - Unsolved problems gallery: each with a visual "signature"

## Visualization Strategy

- **Target:** 5-8 interactive visualizations per chapter, ~130-160 total
- **All Canvas-based** via VizEngine class (no external viz libraries)
- **Types:**
  - Domain coloring (zeta, L-functions, modular forms)
  - Step-by-step construction animations (sieve, Euler product, zero contributions)
  - Race/comparison animations (prime races, approximation convergence)
  - Spiral/trajectory plots (exponential sums, partial sums of Dirichlet series)
  - Lattice/grid animations (hyperbola method, Farey fractions, fundamental domain)
  - Slider-driven parameter exploration (sieve level, number of zeros, modulus q)
  - Heatmaps (zero density, zero-free regions, convergence speed)
- **Design principles:**
  - Every theorem gets at least one visualization
  - Motivation sections use "big picture" visualizations
  - Proof sections use step-by-step animated constructions
  - All interactive: sliders, drag, click to reveal
  - Smooth animations with requestAnimationFrame

## Exercise Strategy

- ~8-12 exercises per chapter, ~200 total
- Mix of computational ("compute mu(360)") and proof-based ("show that ...")
- Each has hint + full solution
- Graduated difficulty within each chapter

## Technical Specifications

- localStorage key: `analytic-number-theory-progress`
- Author line: Apostol / Davenport / Iwaniec & Kowalski
- Copyright: 2026 Hengzhe Zhao, AGPL-3.0 & Commercial
- No external dependencies beyond KaTeX CDN
- Responsive design (mobile sidebar toggle)

## Topics Not Covered

The following topics from Iwaniec & Kowalski are deliberately omitted to keep scope manageable:
- Halasz's theorem and mean value estimates for Dirichlet polynomials
- Large values of Dirichlet polynomials
- Subconvexity bounds for L-functions
- Spectral theory of automorphic forms (beyond the roadmap in Ch 17)
- Kloosterman sum applications to the Linnik problem

These are natural candidates for a future "Analytic Number Theory II" course.

## Cross-References

- Abel summation (Ch 2) is reused in Ch 3 (Dirichlet series convergence) and Ch 7 (Perron's formula). Chapters reference back rather than re-derive.
- Hurwitz zeta (Ch 5) is the bridge to L-functions (Ch 9) via L(s,chi) = q^{-s} sum chi(a) zeta(s, a/q).
- Perron's formula (Ch 5) is the key tool for the PNT proof (Ch 7).
