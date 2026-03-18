// === Chapter 4: The Riemann Zeta Function - Extra Visualizations ===
// Domain coloring and symmetry visualizations (pixel-heavy, separate file)
window.EXTRA_VIZ = window.EXTRA_VIZ || {};
window.EXTRA_VIZ['ch04'] = window.EXTRA_VIZ['ch04'] || {};

// === Complex arithmetic helpers ===
(function() {
    var CX = {
        add: function(a, b) { return [a[0]+b[0], a[1]+b[1]]; },
        sub: function(a, b) { return [a[0]-b[0], a[1]-b[1]]; },
        mul: function(a, b) { return [a[0]*b[0]-a[1]*b[1], a[0]*b[1]+a[1]*b[0]]; },
        div: function(a, b) { var d=b[0]*b[0]+b[1]*b[1]; return [(a[0]*b[0]+a[1]*b[1])/d, (a[1]*b[0]-a[0]*b[1])/d]; },
        exp: function(a) { var r=Math.exp(a[0]); return [r*Math.cos(a[1]), r*Math.sin(a[1])]; },
        log: function(a) { return [0.5*Math.log(a[0]*a[0]+a[1]*a[1]), Math.atan2(a[1], a[0])]; },
        pow: function(base, s) {
            // base > 0 real: base^s = exp(s * ln(base))
            var lb = Math.log(base);
            return CX.exp([s[0]*lb, s[1]*lb]);
        },
        cpow: function(a, b) {
            // a^b = exp(b * log(a))
            var la = CX.log(a);
            return CX.exp(CX.mul(b, la));
        },
        abs: function(a) { return Math.sqrt(a[0]*a[0]+a[1]*a[1]); },
        neg: function(a) { return [-a[0], -a[1]]; },
        scale: function(a, r) { return [a[0]*r, a[1]*r]; },
        conj: function(a) { return [a[0], -a[1]]; }
    };

    // Borwein coefficients for eta acceleration
    function borweinCoeffs(n) {
        var d = new Array(n + 1);
        d[0] = 1; // C(n,0) = 1
        var binom = 1;
        for (var j = 1; j <= n; j++) {
            binom = binom * (n - j + 1) / j;
            d[j] = d[j-1] + binom;
        }
        return d;
    }

    // Accelerated eta function (Borwein method) for complex s
    function etaBorwein(sr, si, order) {
        var n = order || 18;
        var d = borweinCoeffs(n);
        var dn = d[n];
        var sumR = 0, sumI = 0;
        for (var k = 0; k < n; k++) {
            var sign = (k % 2 === 0) ? 1 : -1;
            var coeff = sign * (d[k] - dn);
            var term = CX.pow(k + 1, [sr, si]);
            var inv = CX.div([1, 0], term);
            sumR += coeff * inv[0];
            sumI += coeff * inv[1];
        }
        return [-sumR / dn, -sumI / dn];
    }

    // Zeta via eta for Re(s) > 0, s != 1
    function zetaComplex(sr, si) {
        // Handle Re(s) > 1 with direct sum if far from critical strip (faster)
        if (sr > 6) {
            var sumR = 0, sumI = 0;
            for (var n = 1; n <= 100; n++) {
                var t = CX.pow(n, [sr, si]);
                var inv = CX.div([1, 0], t);
                sumR += inv[0]; sumI += inv[1];
            }
            return [sumR, sumI];
        }

        var eta = etaBorwein(sr, si, 20);
        var pow2 = CX.pow(2, [1 - sr, -si]);
        var denom = [1 - pow2[0], -pow2[1]];
        // Near s=1, denom -> 0; cap it
        var denomMag = CX.abs(denom);
        if (denomMag < 1e-12) return [1e6, 0]; // pole
        return CX.div(eta, denom);
    }

    // Gamma function for complex argument (Lanczos approximation)
    function gammaComplex(zr, zi) {
        // Reflection formula for Re(z) < 0.5
        if (zr < 0.5) {
            // Gamma(z) = pi / (sin(pi*z) * Gamma(1-z))
            var sinPiZ = CX.exp(CX.mul([0, Math.PI], [zr, zi]));
            var sinPiZn = CX.exp(CX.mul([0, -Math.PI], [zr, zi]));
            var sinVal = CX.scale(CX.sub(sinPiZ, sinPiZn), 0.5 / 1); // sin = (e^ix - e^-ix)/(2i)
            sinVal = CX.div(CX.sub(sinPiZ, sinPiZn), [0, 2]);
            var g1mz = gammaComplex(1 - zr, -zi);
            var prod = CX.mul(sinVal, g1mz);
            return CX.div([Math.PI, 0], prod);
        }
        // Lanczos with g=7
        var g = 7;
        var c = [
            0.99999999999980993,
            676.5203681218851,
            -1259.1392167224028,
            771.32342877765313,
            -176.61502916214059,
            12.507343278686905,
            -0.13857109526572012,
            9.9843695780195716e-6,
            1.5056327351493116e-7
        ];
        var z = [zr - 1, zi];
        var t = CX.add(z, [g + 0.5, 0]);
        var sum = [c[0], 0];
        for (var i = 1; i < g + 2; i++) {
            sum = CX.add(sum, CX.div([c[i], 0], CX.add(z, [i, 0])));
        }
        // Gamma(z+1) = sqrt(2pi) * t^(z+0.5) * exp(-t) * sum
        var half = [0.5, 0];
        var zpHalf = CX.add(z, half);
        var tPow = CX.cpow(t, zpHalf);
        var expNegT = CX.exp(CX.neg(t));
        var result = CX.scale(CX.mul(CX.mul(tPow, expNegT), sum), Math.sqrt(2 * Math.PI));
        return result;
    }

    // Xi function: xi(s) = 0.5 * s*(s-1) * pi^(-s/2) * Gamma(s/2) * zeta(s)
    function xiComplex(sr, si) {
        var s = [sr, si];
        var halfS = [sr/2, si/2];
        var sMinus1 = [sr - 1, si];
        var factor = CX.scale(CX.mul(s, sMinus1), 0.5);
        var piPow = CX.pow(Math.PI, [-sr/2, -si/2]);
        var gamma = gammaComplex(sr/2, si/2);
        var zeta = zetaComplex(sr, si);
        return CX.mul(CX.mul(CX.mul(factor, piPow), gamma), zeta);
    }

    // ================================================================
    // VIZ 1: Domain coloring of zeta in the critical strip
    // ================================================================
    window.EXTRA_VIZ['ch04']['sec-bridge'] = [
        {
            id: 'viz-zeta-domain-coloring',
            title: 'Domain Coloring of zeta(s) in the Critical Strip',
            description: 'Each pixel (sigma, t) is colored by the phase (hue) and magnitude (brightness) of zeta(sigma + it). The critical line Re(s) = 1/2 is shown in white. Non-trivial zeros appear as dark spots where all colors meet. The pole at s = 1 glows bright.',
            setup: function(container, controls) {
                var W = 480, H = 480;
                var viz = new VizEngine(container, { width: W, height: H, scale: 1, originX: 0, originY: 0 });
                var xMin = -2, xMax = 4, yMin = -30, yMax = 30;

                VizEngine.createSlider(controls, 'Im range', 10, 60, 30, 5, function(v) {
                    yMin = -v; yMax = v;
                    render();
                });

                function render() {
                    viz.drawDomainColoring(function(re, im) {
                        return zetaComplex(re, im);
                    }, [xMin, xMax], [yMin, yMax]);

                    var ctx = viz.ctx;

                    // Draw critical line Re(s) = 1/2
                    var cx = (0.5 - xMin) / (xMax - xMin) * W;
                    ctx.strokeStyle = 'rgba(255,255,255,0.5)'; ctx.lineWidth = 1;
                    ctx.setLineDash([4, 4]);
                    ctx.beginPath(); ctx.moveTo(cx, 0); ctx.lineTo(cx, H); ctx.stroke();
                    ctx.setLineDash([]);

                    // Draw Re(s) = 0 and Re(s) = 1 lines
                    var x0 = (0 - xMin) / (xMax - xMin) * W;
                    var x1 = (1 - xMin) / (xMax - xMin) * W;
                    ctx.strokeStyle = 'rgba(255,255,255,0.2)'; ctx.lineWidth = 1;
                    ctx.beginPath(); ctx.moveTo(x0, 0); ctx.lineTo(x0, H); ctx.stroke();
                    ctx.beginPath(); ctx.moveTo(x1, 0); ctx.lineTo(x1, H); ctx.stroke();

                    // Draw real axis
                    var yAxis = (0 - yMin) / (yMax - yMin);
                    var yPx = H * (1 - yAxis);
                    ctx.strokeStyle = 'rgba(255,255,255,0.3)'; ctx.lineWidth = 1;
                    ctx.beginPath(); ctx.moveTo(0, yPx); ctx.lineTo(W, yPx); ctx.stroke();

                    // Labels
                    ctx.fillStyle = '#fff'; ctx.font = '11px -apple-system,sans-serif';
                    ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
                    ctx.fillText('Re(s)=1/2', cx, 15);
                    ctx.fillText('Re(s)=0', x0, 30);
                    ctx.fillText('Re(s)=1', x1, 30);

                    // Mark a few known zeros
                    var zeros = [14.134, 21.022, 25.011];
                    for (var i = 0; i < zeros.length; i++) {
                        var zy1 = H * (1 - (zeros[i] - yMin) / (yMax - yMin));
                        var zy2 = H * (1 - (-zeros[i] - yMin) / (yMax - yMin));
                        if (zy1 > 0 && zy1 < H) {
                            ctx.strokeStyle = '#fff'; ctx.lineWidth = 1;
                            ctx.beginPath(); ctx.arc(cx, zy1, 6, 0, Math.PI * 2); ctx.stroke();
                        }
                        if (zy2 > 0 && zy2 < H) {
                            ctx.strokeStyle = '#fff'; ctx.lineWidth = 1;
                            ctx.beginPath(); ctx.arc(cx, zy2, 6, 0, Math.PI * 2); ctx.stroke();
                        }
                    }

                    viz.screenText('zeta(s) domain coloring', W / 2, H - 10, '#fff', 12);
                }
                render();
                return viz;
            }
        },
        {
            id: 'viz-xi-symmetry',
            title: 'Domain Coloring of xi(s): The Symmetry s <-> 1-s',
            description: 'The xi function xi(s) = (1/2)s(s-1) pi^(-s/2) Gamma(s/2) zeta(s) satisfies xi(s) = xi(1-s). This domain coloring shows the perfect symmetry about the line Re(s) = 1/2. Compare with the zeta coloring above: the pole at s = 1 and trivial zeros are gone.',
            setup: function(container, controls) {
                var W = 480, H = 480;
                var viz = new VizEngine(container, { width: W, height: H, scale: 1, originX: 0, originY: 0 });
                var xMin = -3, xMax = 4, yMin = -25, yMax = 25;

                VizEngine.createSlider(controls, 'Im range', 10, 50, 25, 5, function(v) {
                    yMin = -v; yMax = v;
                    render();
                });

                function render() {
                    viz.drawDomainColoring(function(re, im) {
                        var result = xiComplex(re, im);
                        if (!isFinite(result[0]) || !isFinite(result[1])) return [0, 0];
                        return result;
                    }, [xMin, xMax], [yMin, yMax]);

                    var ctx = viz.ctx;

                    // Draw critical line Re(s) = 1/2
                    var cx = (0.5 - xMin) / (xMax - xMin) * W;
                    ctx.strokeStyle = 'rgba(255,255,255,0.6)'; ctx.lineWidth = 1.5;
                    ctx.setLineDash([4, 4]);
                    ctx.beginPath(); ctx.moveTo(cx, 0); ctx.lineTo(cx, H); ctx.stroke();
                    ctx.setLineDash([]);

                    // Draw real axis
                    var yAxis = (0 - yMin) / (yMax - yMin);
                    var yPx = H * (1 - yAxis);
                    ctx.strokeStyle = 'rgba(255,255,255,0.3)'; ctx.lineWidth = 1;
                    ctx.beginPath(); ctx.moveTo(0, yPx); ctx.lineTo(W, yPx); ctx.stroke();

                    ctx.fillStyle = '#fff'; ctx.font = '12px -apple-system,sans-serif';
                    ctx.textAlign = 'center';
                    ctx.fillText('xi(s) = xi(1-s)', W / 2, 18);
                    ctx.fillText('axis of symmetry: Re(s) = 1/2', cx, 35);
                    viz.screenText('xi(s) domain coloring', W / 2, H - 10, '#fff', 12);
                }
                render();
                return viz;
            }
        }
    ];

})();
