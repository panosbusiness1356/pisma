/**
 * Μετάξι (Silk) — WebGL shader «πτυχές υφάσματος» που κυματίζουν αργά με μια
 * απαλή γυαλάδα στο accent. Δύο χρήσεις:
 *   1. <canvas data-silk="hero|soft|band"> από το Silk.astro (hero σελίδων, CTA band)
 *   2. Λωρίδες μεταξιού ανάμεσα στις ενότητες: εισάγονται εδώ αυτόματα σε κάθε
 *      section/article που ακολουθεί άλλο (ο χώρος τους είναι ήδη κρατημένος
 *      από το CSS με margin-top, άρα καμία μετατόπιση layout).
 *
 * Διαφανές (premultiplied), χρώματα ζωντανά από τις CSS μεταβλητές, μισή
 * ανάλυση, παύση εκτός οθόνης/κρυφής καρτέλας, παγωμένο καρέ με reduced-motion,
 * αφαίρεση χωρίς WebGL.
 */
const FRAG = `
precision highp float;
uniform vec2 u_res; uniform float u_time; uniform float u_dark; uniform float u_str;
uniform float u_edge; uniform vec2 u_stretch;
uniform vec3 u_bg, u_ink, u_acc, u_lite;
float hash(vec2 p){ p = fract(p*vec2(123.34,456.21)); p += dot(p,p+45.32); return fract(p.x*p.y); }
float noise(vec2 p){ vec2 i=floor(p), f=fract(p); f=f*f*(3.-2.*f);
  float a=hash(i), b=hash(i+vec2(1,0)), c=hash(i+vec2(0,1)), d=hash(i+vec2(1,1));
  return mix(mix(a,b,f.x), mix(c,d,f.x), f.y); }
float fbm(vec2 p){ float v=0., a=.5; mat2 r=mat2(.8,.6,-.6,.8);
  for(int i=0;i<6;i++){ v+=a*noise(p); p=r*p*2.03+.7; a*=.5; } return v; }
void main(){
  vec2 uv = gl_FragCoord.xy/u_res;
  vec2 p = (gl_FragCoord.xy - .5*u_res)/u_res.y;
  float t = u_time;
  vec2 sp = p * u_stretch;
  float f = fbm(sp + vec2(t*.05, 0.) + fbm(sp*1.3 - t*.03)*.9);
  float fold = sin(f*9. + p.y*3. + t*.25);
  float sheen = pow(fold*.5+.5, 4.);
  float shade = f*.55 + sheen*.6;
  float mask = smoothstep(0., u_edge, uv.y) * smoothstep(1., 1.-u_edge, uv.y);
  vec3 silk = mix(u_bg, u_ink, .5);
  vec3 warmSheen = mix(silk, mix(u_acc, u_lite, .6), .4);
  float amt = (u_dark > .5 ? .34 : .22) * u_str;
  float alpha = clamp(shade * mask * amt, 0., 1.);
  gl_FragColor = vec4(mix(silk, warmSheen, sheen) * alpha, alpha);
}`;
const VERT = 'attribute vec2 a; void main(){ gl_Position = vec4(a, 0., 1.); }';

type Variant = 'hero' | 'soft' | 'band' | 'ribbon';
const PRESET: Record<Variant, { str: number; edge: number; stretch: [number, number] }> = {
  hero: { str: 0.9, edge: 0.2, stretch: [0.45, 1.6] },
  soft: { str: 0.62, edge: 0.2, stretch: [0.45, 1.6] },
  band: { str: 0.8, edge: 0.2, stretch: [0.45, 1.6] },
  ribbon: { str: 1.5, edge: 0.4, stretch: [0.35, 1.4] },
};

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const rootStyle = () => getComputedStyle(document.documentElement);
const parseColor = (v: string): [number, number, number] => {
  const s = v.trim();
  if (s.startsWith('#')) {
    const h = s.length === 4 ? s.slice(1).split('').map((c) => c + c).join('') : s.slice(1, 7);
    return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255) as [number, number, number];
  }
  const m = s.match(/[\d.]+/g);
  if (m && m.length >= 3) return [+m[0] / 255, +m[1] / 255, +m[2] / 255];
  return [0.09, 0.08, 0.08];
};
const readTheme = (bgVar: string) => {
  const c = rootStyle();
  const bg = parseColor(c.getPropertyValue(bgVar) || c.getPropertyValue('--bg'));
  const lum = 0.2126 * bg[0] + 0.7152 * bg[1] + 0.0722 * bg[2];
  return {
    bg,
    ink: parseColor(c.getPropertyValue('--navy') || '#F4F0EC'),
    acc: parseColor(c.getPropertyValue('--cta-deep') || '#D63E1B'),
    lite: parseColor(c.getPropertyValue('--cta-lite') || '#FF8A3D'),
    dark: lum < 0.5,
  };
};

function mount(canvas: HTMLCanvasElement) {
  const gl = canvas.getContext('webgl', { antialias: false, alpha: true, premultipliedAlpha: true, depth: false, stencil: false, powerPreference: 'low-power' });
  if (!gl) { canvas.remove(); return false; }
  const parent = canvas.parentElement;
  const variant = (canvas.dataset.silk as Variant) || 'hero';
  const preset = PRESET[variant] ?? PRESET.hero;
  const strength = canvas.dataset.strength ? parseFloat(canvas.dataset.strength) : preset.str;
  const bgVar = canvas.dataset.bg || '--bg';

  const sh = (type: number, src: string) => {
    const s = gl.createShader(type)!;
    gl.shaderSource(s, src); gl.compileShader(s);
    return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null;
  };
  const vs = sh(gl.VERTEX_SHADER, VERT), fs = sh(gl.FRAGMENT_SHADER, FRAG);
  if (!vs || !fs) { canvas.remove(); return false; }
  const prog = gl.createProgram()!;
  gl.attachShader(prog, vs); gl.attachShader(prog, fs); gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) { canvas.remove(); return false; }
  gl.useProgram(prog);
  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  const a = gl.getAttribLocation(prog, 'a');
  gl.enableVertexAttribArray(a); gl.vertexAttribPointer(a, 2, gl.FLOAT, false, 0, 0);
  const U = (n: string) => gl.getUniformLocation(prog, n);
  const uRes = U('u_res'), uTime = U('u_time'), uDark = U('u_dark');
  const uBg = U('u_bg'), uInk = U('u_ink'), uAcc = U('u_acc'), uLite = U('u_lite');
  gl.uniform1f(U('u_str'), strength);
  gl.uniform1f(U('u_edge'), preset.edge);
  gl.uniform2f(U('u_stretch'), preset.stretch[0], preset.stretch[1]);

  parent?.classList.add('silk-on');
  let visible = false, raf = 0, lost = false;
  const t0 = performance.now() - Math.random() * 90000; // κάθε canvas ξεκινά από άλλο σημείο της κίνησης

  // Μισή ανάλυση (τρίτο στο κινητό) — ο θόρυβος είναι θολός έτσι κι αλλιώς.
  const scale = () => (window.innerWidth < 768 ? 0.34 : 0.5);
  const resize = () => {
    const w = Math.max(1, Math.min(1100, Math.floor(canvas.clientWidth * scale())));
    const h = Math.max(1, Math.floor(canvas.clientHeight * scale()));
    if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; gl.viewport(0, 0, w, h); }
  };
  let theme = readTheme(bgVar), themeAt = 0;
  const frame = () => {
    if (lost) return;
    resize();
    const now = performance.now();
    if (now - themeAt > 1000) { theme = readTheme(bgVar); themeAt = now; }
    gl.uniform2f(uRes, canvas.width, canvas.height);
    gl.uniform1f(uTime, reduced ? 20 : (now - t0) / 1000);
    gl.uniform1f(uDark, theme.dark ? 1 : 0);
    gl.uniform3fv(uBg, theme.bg); gl.uniform3fv(uInk, theme.ink); gl.uniform3fv(uAcc, theme.acc); gl.uniform3fv(uLite, theme.lite);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    canvas.classList.add('is-ready');
    if (visible && !reduced) raf = requestAnimationFrame(frame);
  };
  const io = new IntersectionObserver(([e]) => {
    visible = e.isIntersecting;
    cancelAnimationFrame(raf);
    if (visible) frame();
  }, { rootMargin: '120px' });
  io.observe(canvas);
  // Δίχτυ ασφαλείας: αν ο observer αργήσει (π.χ. scroll restoration στο κινητό),
  // ξεκίνα αμέσως όταν το canvas είναι ήδη μέσα στην οθόνη.
  const r = canvas.getBoundingClientRect();
  if (r.bottom > -120 && r.top < window.innerHeight + 120 && r.width > 0) { visible = true; frame(); }
  // Κρυφή καρτέλα: μην καίμε CPU.
  document.addEventListener('visibilitychange', () => {
    cancelAnimationFrame(raf);
    if (document.visibilityState === 'visible' && visible) frame();
  });
  canvas.addEventListener('webglcontextlost', (e) => { e.preventDefault(); lost = true; cancelAnimationFrame(raf); canvas.classList.remove('is-ready'); parent?.classList.remove('silk-on'); });
  return true;
}

// 1. Canvases από το Silk.astro
document.querySelectorAll<HTMLCanvasElement>('canvas[data-silk]').forEach(mount);

// 2. Λωρίδες ανάμεσα στις ενότητες — μόνο όπου το CSS έχει κρατήσει τον χώρο (.silk-gap)
{
  document.querySelectorAll<HTMLElement>('main > :is(section, article) + :is(section, article)').forEach((sec) => {
    const wrap = document.createElement('div');
    wrap.className = 'silk-ribbon';
    wrap.setAttribute('aria-hidden', 'true');
    const canvas = document.createElement('canvas');
    canvas.className = 'silk';
    canvas.dataset.silk = 'ribbon';
    const thread = document.createElement('span');
    thread.className = 'silk-thread';
    wrap.append(canvas, thread);
    sec.prepend(wrap);
    if (!mount(canvas)) wrap.remove();
  });
}
