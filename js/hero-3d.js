/* hero-3d.js — family "hero-siden": the hero's moving visual as a zero-asset
 * WebGL scene (MC 12373). A slowly flowing curtain of hair/silk strands: 24
 * depth layers of ridge-noise fibres lit by a Kajiya-Kay style anisotropic
 * band, so the highlight travels ALONG the fibres, not across them. Every
 * colour is read from the declared tokens in css/tokens.css — this file names
 * no colour literal (C1 holds outside CSS too).
 * Mechanics proven by the bench 21-sdf-hjalten (read-only for mechanics):
 * full-screen triangle, dpr cap 2 + pixel cap, pointer easing, Intersection-
 * Observer pause-offscreen, prefers-reduced-motion = ONE static frame, silent
 * fallback when WebGL is unavailable. The first draw waits for the browser's
 * RECORDED first contentful paint — the hero paints from HTML+CSS alone.
 * Enhancement only: without JS or WebGL
 * the canvas never exists and the static photo hero underneath is exactly the
 * hero that shipped before this module (zero layout jump — the canvas is
 * absolute). The class .scen--siden (which hides the photo) is added only
 * AFTER the first real draw and only when motion is allowed — the photo is
 * never covered by an empty canvas, and under reduced motion it stays
 * un-hidden (the static canvas simply covers it).
 * Concern: this hero scene only. */
(function () {
  "use strict";

  var hero = document.querySelector(".scen--top");
  var media = hero ? hero.querySelector(".scen__media") : null;
  if (!hero || !media) return;

  /* — colours: the token block is the one source (C1). No tokens => no scene. — */
  var CS = getComputedStyle(document.documentElement);
  function tok(name) {
    var m = /^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(
      CS.getPropertyValue(name).trim());
    return m ? [parseInt(m[1], 16) / 255, parseInt(m[2], 16) / 255,
      parseInt(m[3], 16) / 255] : null;
  }
  var cInk = tok("--scene-tint"), cSpruce = tok("--spruce-deep"),
      cCopper = tok("--copper"), cBrass = tok("--brass"), cCream = tok("--paper");
  if (!cInk || !cSpruce || !cCopper || !cBrass || !cCream) return;

  var cv = null, gl = null, raf = 0;

  function dead() {                       /* silent retreat: the photo hero stays */
    if (raf) { cancelAnimationFrame(raf); raf = 0; }
    if (cv && cv.parentNode) cv.parentNode.removeChild(cv);
    hero.classList.remove("scen--siden");
  }

  /* boot on load: NOTHING here (context, shaders, canvas) runs before the
     first paint — the photo hero paints from HTML+CSS alone. */
  if (document.readyState === "complete") boot();
  else window.addEventListener("load", boot);

  function boot() {
  try {
    var reduced = window.matchMedia &&
      matchMedia("(prefers-reduced-motion: reduce)").matches;

    cv = document.createElement("canvas");
    cv.className = "scen__siden";
    cv.setAttribute("aria-hidden", "true");
    hero.insertBefore(cv, media.nextSibling);

    gl = cv.getContext("webgl", { alpha: false, antialias: false,
      depth: false, stencil: false });
    if (!gl) { dead(); return; }

    var VS = "attribute vec2 aPos; void main(){ gl_Position=vec4(aPos,0.0,1.0); }";
    var FS = [
      "#ifdef GL_FRAGMENT_PRECISION_HIGH",
      "precision highp float;",
      "#else",
      "precision mediump float;",
      "#endif",
      "uniform vec2 uRes; uniform float uTime; uniform vec2 uPtr;",
      "uniform vec3 uInk, uSpruce, uCopper, uBrass, uCream;",
      "float hash21(vec2 p){ vec3 p3=fract(vec3(p.xyx)*0.1031);",
      " p3+=dot(p3,p3.yzx+33.33); return fract((p3.x+p3.y)*p3.z); }",
      "float vn(vec2 p){ vec2 i=floor(p), f=fract(p); f=f*f*(3.0-2.0*f);",
      " return mix(mix(hash21(i),hash21(i+vec2(1.0,0.0)),f.x),",
      "            mix(hash21(i+vec2(0.0,1.0)),hash21(i+vec2(1.0,1.0)),f.x),f.y); }",
      "float fbm3(vec2 p){ return vn(p)*0.5+vn(p*2.03+7.1)*0.275+vn(p*4.07+3.7)*0.125; }",
      "/* one depth layer of the curtain; sl = the fibres' screen-space slope */",
      "float layerS(vec2 q, float lt, out float sl){",
      " float fy=q.y*0.55;",
      " float f1=fbm3(vec2(fy,lt)), f2=fbm3(vec2(fy+0.08,lt));",
      " float bend=(f1-0.5)*1.05+sin(q.y*1.15+lt*1.2)*0.07;",
      " sl=((f2-f1)*1.05/0.08+cos(q.y*1.15+lt*1.2)*0.081)/3.2;",
      " float lane=(q.x+bend)*3.2, id=floor(lane), x=fract(lane)-0.5;",
      " float alive=step(0.30,hash21(vec2(id,17.3)));",
      " float thick=0.13+0.11*hash21(vec2(id,91.7));",
      " float core=smoothstep(thick,0.0,abs(x));",
      " float fibers=0.70+0.30*vn(vec2(lane*8.0,q.y*2.4-lt*1.8));",
      " float damp=smoothstep(0.0,0.55,fbm3(vec2(id*3.3+11.0,q.y*0.33-lt*0.8)));",
      " return core*core*fibers*alive*damp; }",
      "void main(){",
      " vec2 uv=(gl_FragCoord.xy-0.5*uRes)/uRes.y;",
      " vec2 par=uPtr-0.5; float t=uTime;",
      " vec3 col=mix(uInk,uSpruce,smoothstep(-0.7,0.8,",
      "   uv.y+(fbm3(uv*1.4+3.0)-0.5)*0.3));",
      " vec3 glow=vec3(0.0); float mass=0.0;",
      " for(int i=0;i<24;i++){",
      "  float z=float(i)/23.0;",
      "  vec2 q=uv*(1.0+0.5*z)+par*(0.010+0.050*z);",
      "  q.y+=t*(0.03+0.05*z);",
      "  float sl;",
      "  float d=layerS(q,t*0.09+z*0.7,sl);",
      "  if(d>0.004){",
      "   vec2 T=normalize(vec2(sl/(1.0+0.5*z),1.0));",
      "   vec2 L=normalize(vec2(-0.5+par.x*0.8,0.86+par.y*0.5));",
      "   float spec=pow(1.0-abs(dot(T,L)),22.0);",
      "   vec3 sheen=mix(uBrass,uCream,smoothstep(0.15,0.7,spec*1.6));",
      "   glow+=mix(uCopper*0.32,sheen,0.30+1.15*spec)*d*(0.10-0.04*z);",
      "   mass+=d*0.014;",
      "  }",
      " }",
      " /* text-safe column: the hero copy's ground stays dark under the tint */",
      " glow*=1.0-0.6*exp(-3.2*uv.x*uv.x)*exp(-2.4*uv.y*uv.y);",
      " glow=min(glow,vec3(0.34,0.32,0.27));",
      " col=col*(1.0-min(mass,0.3))+glow;",
      " col*=1.0-0.4*pow(clamp(length(uv*vec2(0.92,1.02))/1.45,0.0,1.0),2.0);",
      " col+=(hash21(gl_FragCoord.xy)-0.5)*0.012;",
      " gl_FragColor=vec4(clamp(col,0.0,1.0),1.0); }"
    ].join("\n");

    function sh(type, src) {
      var s = gl.createShader(type);
      gl.shaderSource(s, src); gl.compileShader(s);
      return s;
    }
    var vs = sh(gl.VERTEX_SHADER, VS), fs = sh(gl.FRAGMENT_SHADER, FS);
    if (!gl.getShaderParameter(vs, gl.COMPILE_STATUS) ||
        !gl.getShaderParameter(fs, gl.COMPILE_STATUS)) { dead(); return; }
    var prg = gl.createProgram();
    gl.attachShader(prg, vs); gl.attachShader(prg, fs); gl.linkProgram(prg);
    if (!gl.getProgramParameter(prg, gl.LINK_STATUS)) { dead(); return; }
    gl.useProgram(prg);

    var buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW);
    var loc = gl.getAttribLocation(prg, "aPos");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    var uRes = gl.getUniformLocation(prg, "uRes"),
        uTime = gl.getUniformLocation(prg, "uTime"),
        uPtr = gl.getUniformLocation(prg, "uPtr");
    /* the token colours are static — upload them once, not per frame */
    gl.uniform3fv(gl.getUniformLocation(prg, "uInk"), new Float32Array(cInk));
    gl.uniform3fv(gl.getUniformLocation(prg, "uSpruce"), new Float32Array(cSpruce));
    gl.uniform3fv(gl.getUniformLocation(prg, "uCopper"), new Float32Array(cCopper));
    gl.uniform3fv(gl.getUniformLocation(prg, "uBrass"), new Float32Array(cBrass));
    gl.uniform3fv(gl.getUniformLocation(prg, "uCream"), new Float32Array(cCream));

    var W = 1, H = 1, first = false;
    function resize() {
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      var w = Math.max(1, Math.round(cv.clientWidth * dpr));
      var h = Math.max(1, Math.round(cv.clientHeight * dpr));
      var cap = 900000, s = w * h > cap ? Math.sqrt(cap / (w * h)) : 1;
      W = Math.max(1, Math.round(w * s)); H = Math.max(1, Math.round(h * s));
      cv.width = W; cv.height = H;
      gl.viewport(0, 0, W, H);
    }
    var px = [0.5, 0.5], pt = [0.5, 0.5];
    function render(ms) {
      px[0] += (pt[0] - px[0]) * 0.06; px[1] += (pt[1] - px[1]) * 0.06;
      gl.uniform2f(uRes, W, H);
      gl.uniform1f(uTime, ms / 1000);
      gl.uniform2f(uPtr, px[0], px[1]);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      if (!first) {
        first = true;
        cv.dataset.silk = reduced ? "static" : "live";   /* the one data-* hook */
        /* Hide the photo layer only when motion is allowed: under reduced
           motion the static canvas already covers it opaquely, and a
           visibility:hidden IMG at load is exactly what the reduced-motion
           contract forbids (quality gate "reduced" row). */
        if (!reduced) hero.classList.add("scen--siden");
      }
    }
    resize();
    cv.addEventListener("webglcontextlost", function (e) {
      e.preventDefault(); dead();
    });

    /* setTimeout poll for the recorded first paint (bounded 2 s): rAF starts
       after paint, never before — and nothing here blocks the first paint. */
    function afterPaint(then) {
      var tries = 0;
      (function poll() {
        var seen = !(window.performance && performance.getEntriesByType) ||
          performance.getEntriesByType("paint").some(function (e) {
            return e.name === "first-contentful-paint"; });
        if (seen || tries++ > 80) then();
        else setTimeout(poll, 25);
      })();
    }

    if (reduced) {
      /* ONE static frame — and this path touches no rAF at all (the paint
         gate below polls with setTimeout only). */
      afterPaint(function () { render(0); });
    } else {
      window.addEventListener("pointermove", function (e) {
        pt[0] = e.clientX / innerWidth; pt[1] = e.clientY / innerHeight;
      }, { passive: true });
      /* The FIRST draw waits for the RECORDED first contentful paint — the
         hero's own text/photo paints fully before any WebGL frame is drawn.
         The loop then runs only while the hero is on screen (IO pause). */
      var painted = false, visible = false;
      function start() { if (!raf && painted && visible) raf = requestAnimationFrame(tick); }
      function stop() { if (raf) { cancelAnimationFrame(raf); raf = 0; } }
      function tick(ms) { raf = requestAnimationFrame(tick); render(ms); }
      afterPaint(function () { painted = true; start(); });
      if ("IntersectionObserver" in window) {
        new IntersectionObserver(function (es) {
          es.forEach(function (e) {
            visible = e.isIntersecting;
            if (visible) start(); else stop();
          });
        }).observe(hero);
      } else { visible = true; start(); }
    }

    var rsz;
    window.addEventListener("resize", function () {
      clearTimeout(rsz);
      rsz = setTimeout(function () { resize(); if (reduced) render(0); }, 150);
    });
  } catch (e) { dead(); }
  }
})();
