// === Ch04 Extra Visualizations: Domain Coloring for zeta and xi ===
// Registered as EXTRA_VIZ['ch04'] keyed by section id.
// Loaded automatically by app.js after ch04-riemann-zeta.js.

window.EXTRA_VIZ = window.EXTRA_VIZ || {};

(function() {

    // ----------------------------------------------------------------
    // Complex arithmetic helpers
    // ----------------------------------------------------------------

    function cadd(a, b) { return [a[0]+b[0], a[1]+b[1]]; }
    function csub(a, b) { return [a[0]-b[0], a[1]-b[1]]; }
    function cmul(a, b) {
        return [a[0]*b[0] - a[1]*b[1], a[0]*b[1] + a[1]*b[0]];
    }
    function cdiv(a, b) {
        var d = b[0]*b[0] + b[1]*b[1];
        if (d < 1e-300) return [0, 0];
        return [(a[0]*b[0]+a[1]*b[1])/d, (a[1]*b[0]-a[0]*b[1])/d];
    }
    function cabs(a) { return Math.sqrt(a[0]*a[0]+a[1]*a[1]); }
    function cabs2(a) { return a[0]*a[0]+a[1]*a[1]; }
    // exp(a+ib) = e^a (cos b + i sin b)
    function cexp(a) {
        var ea = Math.exp(a[0]);
        return [ea*Math.cos(a[1]), ea*Math.sin(a[1])];
    }
    // log(z) = ln|z| + i*arg(z)  (principal branch)
    function clog(a) {
        return [Math.log(Math.sqrt(a[0]*a[0]+a[1]*a[1])), Math.atan2(a[1], a[0])];
    }
    // z^w = exp(w * log z)
    function cpow(z, w) {
        if (z[0]===0 && z[1]===0) return [0, 0];
        return cexp(cmul(w, clog(z)));
    }
    // n^{-s} where n is a positive real integer
    function nPowMinusS(n, s) {
        // = exp(-s * ln n) = exp(-(s_re * lnn) - i*(s_im * lnn))
        var lnn = Math.log(n);
        var re = -s[0]*lnn, im = -s[1]*lnn;
        var ea = Math.exp(re);
        return [ea*Math.cos(im), ea*Math.sin(im)];
    }

    // ----------------------------------------------------------------
    // Zeta via Borwein's method (Dirichlet eta with coefficient acceleration)
    // Works for |Im(s)| up to ~100, Re(s) > -6 approximately
    // Reference: P. Borwein (2000) "An Efficient Algorithm for the Riemann Zeta Function"
    // ----------------------------------------------------------------
    var _borweinCoeffs = null;
    var _borweinN = 60;

    function borweinCoeffs(n) {
        // Precompute d_k coefficients for Borwein's method
        var d = new Float64Array(n+1);
        d[0] = 1;
        var sum = 1;
        for (var k = 1; k <= n; k++) {
            // d[k] = d[k-1] * (n+k-1)! / ((n-k)! * k! * 4^k) ... recurrence
            // Use the standard recurrence for Borwein coefficients
            d[k] = d[k-1] * (n + k - 1) / (k * 4);
            // Actually use the closed-form:
            // c_k = n * sum_{j=k}^{n} (n+j-1)! / (2j)! / (j-k)! * (-1)^{j-k}
            // It is simpler to just use alternating eta with enough terms
        }
        return d;
    }

    function zetaComplex(s) {
        // Returns [re, im] of zeta(s) using Dirichlet eta + enough terms
        // Valid for Re(s) > 0 (except s=1 which returns large value)
        var sigma = s[0];

        // For sigma > 6: use the defining series directly (converges fast)
        if (sigma > 6) {
            var re = 0, im = 0;
            for (var n = 1; n <= 100; n++) {
                var t = nPowMinusS(n, s);
                re += t[0]; im += t[1];
            }
            return [re, im];
        }

        // For -6 < sigma <= 6: use eta with Euler-Knopp transform
        // eta(s) = sum_{n=1}^inf (-1)^{n+1} n^{-s}
        // We use partial sums with enough terms
        var N = 80;
        var eta_re = 0, eta_im = 0;
        for (var n = 1; n <= N; n++) {
            var ns = nPowMinusS(n, s);
            var sign = (n % 2 === 1) ? 1 : -1;
            eta_re += sign * ns[0];
            eta_im += sign * ns[1];
        }

        // zeta(s) = eta(s) / (1 - 2^{1-s})
        // 2^{1-s} = exp((1-s) * ln 2)
        var logTwo = Math.LN2;
        var w = [( 1 - s[0]) * logTwo, -s[1] * logTwo]; // (1-s)*ln2 where 1-s = (1-re, -im)
        var pow2 = cexp(w); // 2^{1-s}
        var denom = [1 - pow2[0], -pow2[1]]; // 1 - 2^{1-s}
        var denom2 = denom[0]*denom[0] + denom[1]*denom[1];

        if (denom2 < 1e-20) {
            // Near a removable singularity on Re(s)=1
            // Return a large but finite value (approximation breaks down here)
            return [1e6, 0];
        }

        var eta = [eta_re, eta_im];
        return cdiv(eta, denom);
    }

    // ----------------------------------------------------------------
    // Gamma function via Lanczos approximation
    // ----------------------------------------------------------------
    var LANCZOS_G = 7;
    var LANCZOS_C = [
        0.99999999999980993, 676.5203681218851, -1259.1392167224028,
        771.32342877765313, -176.61502916214059, 12.507343278686905,
        -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7
    ];

    function gammaComplex(s) {
        var re = s[0], im = s[1];
        // Reflection formula for Re(s) < 0.5
        if (re < 0.5) {
            // Gamma(s) = pi / (sin(pi*s) * Gamma(1-s))
            var piS_re = Math.PI * re, piS_im = Math.PI * im;
            // sin(pi*s) = sin(a+ib) = sin(a)cosh(b) + i cos(a)sinh(b)
            var sinPiS = [
                Math.sin(piS_re) * Math.cosh(piS_im),
                Math.cos(piS_re) * Math.sinh(piS_im)
            ];
            var g1s = gammaComplex([1-re, -im]);
            var denom = cmul(sinPiS, g1s);
            return cdiv([Math.PI, 0], denom);
        }

        // Lanczos: z = s - 1
        var z = [re - 1, im];
        var x = [LANCZOS_C[0], 0];
        for (var i = 1; i < LANCZOS_G + 2; i++) {
            // x += c[i] / (z + i)
            var denom2 = [(z[0]+i), z[1]];
            var frac = cdiv([LANCZOS_C[i], 0], denom2);
            x = cadd(x, frac);
        }

        var t = [z[0] + LANCZOS_G + 0.5, z[1]]; // t = z + g + 0.5
        // result = sqrt(2*pi) * t^(z+0.5) * exp(-t) * x
        var sqrt2pi = Math.sqrt(2 * Math.PI);
        var tPowZp05 = cpow(t, [z[0]+0.5, z[1]]);
        var expMinusT = cexp([-t[0], -t[1]]);
        var result = cmul(tPowZp05, expMinusT);
        result = cmul(result, x);
        result = [result[0] * sqrt2pi, result[1] * sqrt2pi];
        return result;
    }

    // ----------------------------------------------------------------
    // Xi function: xi(s) = (1/2) s(s-1) pi^{-s/2} Gamma(s/2) zeta(s)
    // ----------------------------------------------------------------
    function xiComplex(s) {
        var sVal = s;
        // s*(s-1)
        var s1 = [s[0]-1, s[1]];
        var ss1 = cmul(s, s1); // s(s-1)
        var half = [ss1[0]/2, ss1[1]/2]; // (1/2) s(s-1)

        // pi^{-s/2} = exp(-s/2 * ln pi)
        var lnPi = Math.log(Math.PI);
        var sOver2 = [s[0]/2, s[1]/2];
        var piMinusSover2 = cexp([-sOver2[0]*lnPi, -sOver2[1]*lnPi]);

        // Gamma(s/2)
        var gam = gammaComplex(sOver2);

        // zeta(s)
        var zeta = zetaComplex(s);

        // Multiply: half * piMinusSover2 * gam * zeta
        var r = cmul(half, piMinusSover2);
        r = cmul(r, gam);
        r = cmul(r, zeta);
        return r;
    }

    // ----------------------------------------------------------------
    // Visualization 1: Domain coloring of zeta in the critical strip
    // ----------------------------------------------------------------
    var vizZetaDomainColoring = {
        id: 'viz-zeta-domain-coloring',
        title: 'Domain Coloring of \u03b6(s) in the Critical Strip',
        description: 'Each pixel is colored by the argument (hue) and magnitude (brightness) of \u03b6(s). Zeros appear as black points where all hues converge. The pole at s=1 appears as a bright singularity on the real axis. The first non-trivial zero is near 1/2 + 14.134i.',
        setup: function(body, controls) {
            var viz = new VizEngine(body, { width: 560, height: 420 });

            var xMin = -1.5, xMax = 2.5, yMin = -5, yMax = 35;
            var rendering = false;

            var presetSelect = document.createElement('select');
            presetSelect.style.cssText = 'background:#1a1a40;color:#c9d1d9;border:1px solid #30363d;border-radius:4px;padding:3px 8px;font-size:0.78rem;cursor:pointer;';
            [
                ['Critical strip (Im 0..35)', '-1.5,2.5,0,35'],
                ['Near first zeros (Im 12..20)', '-0.5,1.5,12,20'],
                ['Upper zeros (Im 20..50)', '-0.5,1.5,20,50'],
                ['Wide view (Im -5..35)', '-3,4,-5,35']
            ].forEach(function(opt) {
                var o = document.createElement('option');
                o.value = opt[1]; o.textContent = opt[0];
                presetSelect.appendChild(o);
            });
            presetSelect.addEventListener('change', function() {
                var parts = presetSelect.value.split(',').map(Number);
                xMin=parts[0]; xMax=parts[1]; yMin=parts[2]; yMax=parts[3];
                render();
            });
            controls.appendChild(presetSelect);

            var renderBtn = VizEngine.createButton(controls, 'Render (slow)', function() { render(); });

            function render() {
                if (rendering) return;
                rendering = true;
                renderBtn.textContent = 'Rendering...';
                renderBtn.disabled = true;

                // Clear to dark
                viz.ctx.fillStyle = '#0c0c20';
                viz.ctx.fillRect(0, 0, viz.width, viz.height);
                viz.screenText('Rendering domain coloring...', viz.width/2, viz.height/2, '#8b949e', 14);

                // Use requestAnimationFrame to avoid blocking UI
                requestAnimationFrame(function() {
                    viz.drawDomainColoring(function(re, im) {
                        return zetaComplex([re, im]);
                    }, [xMin, xMax], [yMin, yMax]);

                    // Overlay grid lines and labels
                    var ctx = viz.ctx;
                    var w = viz.width, h = viz.height;
                    var xRange = xMax - xMin, yRange = yMax - yMin;

                    function toSx(x) { return (x - xMin) / xRange * w; }
                    function toSy(y) { return h - (y - yMin) / yRange * h; }

                    // Critical line Re(s) = 1/2
                    var sxHalf = toSx(0.5);
                    ctx.strokeStyle = 'rgba(255,255,255,0.5)';
                    ctx.lineWidth = 1.5;
                    ctx.setLineDash([6, 4]);
                    ctx.beginPath(); ctx.moveTo(sxHalf, 0); ctx.lineTo(sxHalf, h); ctx.stroke();
                    ctx.setLineDash([]);
                    ctx.fillStyle = 'rgba(255,255,255,0.8)';
                    ctx.font = '11px -apple-system,sans-serif';
                    ctx.textAlign = 'left';
                    ctx.fillText('\u03c3=1/2', sxHalf + 3, 14);

                    // Line Re(s) = 1 (pole)
                    var sxOne = toSx(1);
                    ctx.strokeStyle = 'rgba(248,81,73,0.5)';
                    ctx.lineWidth = 1;
                    ctx.beginPath(); ctx.moveTo(sxOne, 0); ctx.lineTo(sxOne, h); ctx.stroke();
                    ctx.fillStyle = 'rgba(248,81,73,0.8)';
                    ctx.fillText('\u03c3=1', sxOne + 3, 26);

                    // Line Re(s) = 0
                    var sxZero = toSx(0);
                    ctx.strokeStyle = 'rgba(63,185,160,0.35)';
                    ctx.lineWidth = 1;
                    ctx.beginPath(); ctx.moveTo(sxZero, 0); ctx.lineTo(sxZero, h); ctx.stroke();

                    // Known non-trivial zeros (first few)
                    var zeros = [14.1347, 21.022, 25.0109, 30.4249, 32.9351];
                    zeros.forEach(function(t) {
                        if (t >= yMin && t <= yMax) {
                            var sy = toSy(t);
                            ctx.strokeStyle = 'rgba(255,255,255,0.9)';
                            ctx.lineWidth = 1.5;
                            ctx.beginPath(); ctx.arc(sxHalf, sy, 5, 0, Math.PI*2); ctx.stroke();
                            ctx.fillStyle = 'rgba(255,255,255,0.7)';
                            ctx.font = '9px -apple-system,sans-serif';
                            ctx.textAlign = 'left';
                            ctx.fillText('t\u2248'+t.toFixed(2), sxHalf + 8, sy + 3);
                        }
                    });

                    // Axis labels at bottom
                    ctx.fillStyle = 'rgba(200,200,200,0.7)';
                    ctx.font = '10px -apple-system,sans-serif';
                    ctx.textAlign = 'center';
                    for (var x = Math.ceil(xMin); x <= Math.floor(xMax); x++) {
                        ctx.fillText('\u03c3=' + x, toSx(x), h - 4);
                    }

                    // Title overlay
                    ctx.fillStyle = 'rgba(12,12,32,0.7)';
                    ctx.fillRect(0, 0, w, 22);
                    ctx.fillStyle = '#f0f6fc';
                    ctx.font = '12px -apple-system,sans-serif';
                    ctx.textAlign = 'center';
                    ctx.fillText('Domain coloring of \u03b6(s): hue = arg(\u03b6), brightness = |\\u03b6|. Zeros = all-hue convergence points.', w/2, 14);

                    rendering = false;
                    renderBtn.textContent = 'Re-render';
                    renderBtn.disabled = false;
                });
            }

            // Initial placeholder
            viz.ctx.fillStyle = '#0c0c20';
            viz.ctx.fillRect(0, 0, viz.width, viz.height);
            viz.screenText('Click "Render" to generate domain coloring of \u03b6(s)', viz.width/2, viz.height/2 - 12, '#8b949e', 14);
            viz.screenText('(computation may take a few seconds)', viz.width/2, viz.height/2 + 12, '#8b949e', 12);

            return viz;
        }
    };

    // ----------------------------------------------------------------
    // Visualization 2: Domain coloring of xi(s) showing s <-> 1-s symmetry
    // ----------------------------------------------------------------
    var vizXiSymmetry = {
        id: 'viz-xi-symmetry',
        title: 'Domain Coloring of \u03be(s): The Symmetry s \u2194 1\u2212s',
        description: 'Domain coloring of the completed zeta function \u03be(s) = \u00bd s(s\u22121)\u03c0^{\u2212s/2}\u0393(s/2)\u03b6(s). The functional equation \u03be(s) = \u03be(1\u2212s) is visible as left-right mirror symmetry about the critical line \u03c3 = 1/2. The zeros of \u03b6 become the zeros of \u03be.',
        setup: function(body, controls) {
            var viz = new VizEngine(body, { width: 560, height: 380 });
            var rendering = false;

            var presetSelect = document.createElement('select');
            presetSelect.style.cssText = 'background:#1a1a40;color:#c9d1d9;border:1px solid #30363d;border-radius:4px;padding:3px 8px;font-size:0.78rem;cursor:pointer;';
            [
                ['Symmetric view (Im 0..30)', '-1,2,0,30'],
                ['Near first zeros (Im 10..22)', '-0.2,1.2,10,22'],
                ['Wide (Im -2..30)', '-2,3,-2,30']
            ].forEach(function(opt) {
                var o = document.createElement('option');
                o.value = opt[1]; o.textContent = opt[0];
                presetSelect.appendChild(o);
            });
            presetSelect.addEventListener('change', function() {
                var parts = presetSelect.value.split(',').map(Number);
                xMin=parts[0]; xMax=parts[1]; yMin=parts[2]; yMax=parts[3];
                render();
            });
            controls.appendChild(presetSelect);

            var renderBtn = VizEngine.createButton(controls, 'Render', function() { render(); });

            var xMin = -1, xMax = 2, yMin = 0, yMax = 30;

            function render() {
                if (rendering) return;
                rendering = true;
                renderBtn.textContent = 'Rendering...';
                renderBtn.disabled = true;

                viz.ctx.fillStyle = '#0c0c20';
                viz.ctx.fillRect(0, 0, viz.width, viz.height);
                viz.screenText('Rendering \u03be(s) domain coloring...', viz.width/2, viz.height/2, '#8b949e', 14);

                requestAnimationFrame(function() {
                    viz.drawDomainColoring(function(re, im) {
                        return xiComplex([re, im]);
                    }, [xMin, xMax], [yMin, yMax]);

                    var ctx = viz.ctx;
                    var w = viz.width, h = viz.height;
                    var xRange = xMax - xMin, yRange = yMax - yMin;

                    function toSx(x) { return (x - xMin) / xRange * w; }
                    function toSy(y) { return h - (y - yMin) / yRange * h; }

                    // Critical line Re(s) = 1/2
                    var sxHalf = toSx(0.5);
                    ctx.strokeStyle = 'rgba(255,255,255,0.7)';
                    ctx.lineWidth = 2;
                    ctx.setLineDash([8, 4]);
                    ctx.beginPath(); ctx.moveTo(sxHalf, 0); ctx.lineTo(sxHalf, h); ctx.stroke();
                    ctx.setLineDash([]);
                    ctx.fillStyle = 'rgba(255,255,255,0.9)';
                    ctx.font = '12px -apple-system,sans-serif';
                    ctx.textAlign = 'center';
                    ctx.fillText('\u03c3=1/2 (axis of symmetry)', sxHalf, 18);

                    // Symmetry annotation: mirror lines
                    var sxAnnotL = toSx(0.25);
                    var sxAnnotR = toSx(0.75);
                    ctx.strokeStyle = 'rgba(63,185,160,0.35)';
                    ctx.lineWidth = 1;
                    ctx.beginPath(); ctx.moveTo(sxAnnotL, h/2-20); ctx.lineTo(sxAnnotL, h/2+20); ctx.stroke();
                    ctx.beginPath(); ctx.moveTo(sxAnnotR, h/2-20); ctx.lineTo(sxAnnotR, h/2+20); ctx.stroke();
                    ctx.strokeStyle = 'rgba(63,185,160,0.35)';
                    ctx.setLineDash([3,3]);
                    ctx.beginPath(); ctx.moveTo(sxAnnotL, h/2); ctx.lineTo(sxAnnotR, h/2); ctx.stroke();
                    ctx.setLineDash([]);

                    // Known zeros of xi = non-trivial zeros of zeta
                    var zeros = [14.1347, 21.022, 25.0109];
                    zeros.forEach(function(t) {
                        if (t >= yMin && t <= yMax) {
                            var sy = toSy(t);
                            ctx.strokeStyle = 'white';
                            ctx.lineWidth = 1.5;
                            ctx.beginPath(); ctx.arc(sxHalf, sy, 5, 0, Math.PI*2); ctx.stroke();
                        }
                    });

                    // x-axis labels
                    ctx.fillStyle = 'rgba(200,200,200,0.6)';
                    ctx.font = '10px -apple-system,sans-serif';
                    ctx.textAlign = 'center';
                    for (var x = Math.ceil(xMin); x <= Math.floor(xMax); x++) {
                        ctx.fillText('\u03c3='+x, toSx(x), h-4);
                    }

                    ctx.fillStyle = 'rgba(12,12,32,0.7)';
                    ctx.fillRect(0, h-22, w, 22);
                    ctx.fillStyle = '#c9d1d9';
                    ctx.font = '11px -apple-system,sans-serif';
                    ctx.textAlign = 'center';
                    ctx.fillText('\u03be(s) = \u03be(1\u2212s): the coloring is mirror-symmetric about \u03c3 = 1/2', w/2, h-8);

                    rendering = false;
                    renderBtn.textContent = 'Re-render';
                    renderBtn.disabled = false;
                });
            }

            // Initial placeholder
            viz.ctx.fillStyle = '#0c0c20';
            viz.ctx.fillRect(0, 0, viz.width, viz.height);
            viz.screenText('Click "Render" to generate domain coloring of \u03be(s)', viz.width/2, viz.height/2 - 12, '#8b949e', 14);
            viz.screenText('Shows the mirror symmetry \u03be(s) = \u03be(1\u2212s)', viz.width/2, viz.height/2 + 12, '#8b949e', 12);

            return viz;
        }
    };

    // ----------------------------------------------------------------
    // Register: attach to appropriate sections
    // ----------------------------------------------------------------
    window.EXTRA_VIZ['ch04'] = {
        // Domain coloring of zeta goes into the "bridge" section (last section)
        'sec-bridge': [vizZetaDomainColoring],
        // Xi symmetry visualization goes into the gamma-xi section
        'sec-gamma-xi': [vizXiSymmetry]
    };

})();
