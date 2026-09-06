/**
 * Smoke — γκρίζος καπνός σκηνής σε WebGL (αίτημα χρήστριας 06/09/2026:
 * «φτιάξε τον εσύ τον καπνό, όχι βίντεο»). Fractal noise με domain warping
 * που κυλά αργά· μοιάζει με βίντεο καπνού, χωρίς αρχείο (0 KB media).
 *
 * Ζωγραφίζει σε κάθε <canvas class="stg-smoke">. Παραλλαγές με data-attributes (όλα προαιρετικά):
 *   data-strength  ένταση (0–1, default .75)
 *   data-scale     μέγεθος σχηματισμών (μικρό = μεγάλα σύννεφα, default 2.4)
 *   data-speed     ταχύτητα (default 1)
 *   data-warp      πόσο «στρίβει» (0–6, default 3.5)
 *   data-lo/hi     κατώφλια πυκνότητας (default .38 / .98 — μικρότερο lo = πιο πυκνός)
 *   data-bottom    πόσο πιο πυκνός κάτω (0–1, default .75)
 *   data-rise      άνοδος προς τα πάνω (0–1, default .15)
 *   data-rays      ακτίνες προβολέων μέσα στον καπνό (0/1, default 0)
 *   data-glow      φως/«αύρα» πίσω από το κέντρο που φωτίζει τον καπνό (0–1.5, default .9)
 *   data-glowy     ύψος του φωτός 0–1 (default .5), data-glowr σφίξιμο (default 2.8, μικρότερο = πιο απλωμένο)
 *
 * Απόδοση (07/09/2026 — «να τρέχει τέλεια και στην πιο αδύναμη συσκευή»):
 *  • Τρεις βαθμίδες ποιότητας, αυτόματα ανά συσκευή. Σε desktop η εικόνα μένει ΙΔΙΑ με την επιλογή
 *    της χρήστριας (6 οκτάβες, 3 στρώματα φωτισμού):
 *      full  — ποντίκι/trackpad, ≥8 threads: πλήρης shader, ανάλυση .65× (ο καπνός είναι θολός — δεν φαίνεται)
 *      lite  — κινητό/tablet ή αδύναμη CPU/GPU: 4 οκτάβες, φωτισμός από παραγώγους οθόνης (0 έξτρα
 *              στρώματα → ~3× φθηνότερο ανά pixel), ανάλυση .45×, ~30 fps (ο καπνός κινείται αργά)
 *      still — save-data, ≤2 GB RAM / ≤2 threads ή reduced motion: ένα καρέ, καμία κίνηση
 *  • Ξεκινά ΜΕΤΑ το load κι όταν ο browser αδειάσει (requestIdleCallback): η μεταγλώττιση του
 *    shader δεν μπλοκάρει την πρώτη ζωγραφιά. KHR_parallel_shader_compile όπου υπάρχει.
 *  • Ζωγραφίζει μόνο όσο ο καμβάς είναι στην οθόνη και η καρτέλα ορατή. Ο καμβάς ξεθωριάζει
 *    μέσα (κλάση .is-on) πάνω από τον CSS καπνό, που μένει και χωρίς WebGL.
 */
const VERT = `attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}`;

type Tier = 'full' | 'lite' | 'still';
const mq = (q: string) => matchMedia(q).matches;
const pickTier = (): Tier => {
  const n = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };
  const mem = n.deviceMemory ?? 8;
  const cores = n.hardwareConcurrency ?? 8;
  if (mq('(prefers-reduced-motion: reduce)') || n.connection?.saveData || mem <= 2 || cores <= 2) return 'still';
  const touch = mq('(pointer: coarse)') || !mq('(hover: hover)');
  if (touch || innerWidth < 900 || mem <= 4 || cores <= 4) return 'lite';
  return 'full';
};
let TIER = pickTier();

/** Software WebGL (SwiftShader/llvmpipe — VM, remote desktop, blocklisted GPU): κάθε καρέ κοστίζει
 *  εκατοντάδες ms στη CPU και μπλοκάρει τη σελίδα → μόνο ένα στατικό καρέ. */
const isSoftwareGL = (gl: WebGLRenderingContext): boolean => {
  if (/[?&]gl=1/.test(location.search)) return false; // δοκιμές: ?gl=1 = τρέξε τον καπνό και σε software GL
  try {
    const ext = gl.getExtension('WEBGL_debug_renderer_info') as { UNMASKED_RENDERER_WEBGL: number } | null;
    const r = String(ext ? gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER));
    return /swiftshader|llvmpipe|softpipe|software|mesa offscreen|basic render/i.test(r);
  } catch { return false; }
};

/** Πηγή του fragment shader ανά βαθμίδα. deriv = υπάρχει OES_standard_derivatives (φθηνός φωτισμός της lite). */
const fragSrc = (tier: Tier, deriv: boolean, highp: boolean): string => {
  const full = tier === 'full';
  const oct = full ? 6 : 4;
  /* φωτισμός από ψηλά: διαφορά πυκνότητας προς την κατεύθυνση του φωτός → όγκος.
     full: ξαναδειγματίζει τα 3 στρώματα λίγο πιο πάνω/δεξιά (ακριβές, ακριβό).
     lite: η ίδια διαφορά από τις παραγώγους οθόνης της πυκνότητας — 0 έξτρα δείγματα. */
  const shade = full
    ? `vec2 L=vec2(.006,.012)*u_scale;
float fl=layer(p2+7.1+L*3.,t,u_warp)*.35+layer(p1+L*2.,t*.6,u_warp)*.45+layer(p3+13.7+L*4.,t*1.5,u_warp*.8)*.2;
float shade=clamp(.5+(fl-f)*9.,0.,1.);`
    : deriv
      ? `float shade=clamp(.5+(dFdx(f)*.018+dFdy(f)*.036)*u_res.y*9.,0.,1.);`
      : `float shade=.7;`;
  return `${!full && deriv ? '#extension GL_OES_standard_derivatives : enable\n' : ''}precision ${highp ? 'highp' : 'mediump'} float;
uniform vec2 u_res;uniform float u_t,u_str,u_scale,u_warp,u_lo,u_hi,u_bottom,u_rise,u_rays,u_glow,u_gy,u_gr;
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.,1.)),f.x),f.y);}
/* ${oct} οκτάβες, με περιστροφή ανά οκτάβα — πιο «οργανική» υφή */
float fbm(vec2 p){float v=0.,a=.5;mat2 m=mat2(1.6,1.2,-1.2,1.6);
for(int i=0;i<${oct};i++){v+=a*noise(p);p=m*p;a*=.5;}return v;}
/* πυκνότητα ενός στρώματος καπνού στο σημείο p, χρόνος t */
float layer(vec2 p,float t,float warp){
  vec2 q=vec2(fbm(p+vec2(0.,t)),fbm(p+vec2(5.2,1.3)-t*.7));
  vec2 r=vec2(fbm(p+warp*q+vec2(1.7,9.2)+t*.45),fbm(p+warp*q+vec2(8.3,2.8)-t*.3));
  return fbm(p+warp*r);
}
void main(){
vec2 uv=gl_FragCoord.xy/u_res;
float asp=u_res.x/u_res.y;
vec2 base=uv*vec2(asp,1.)*u_scale;
float t=u_t*.05;
/* τρία στρώματα: μακρινό (μεγάλο, αργό), μεσαίο, κοντινό (μικρό, γρήγορο) */
vec2 p1=base*.6-vec2(0.,t*u_rise*1.5);
vec2 p2=base*1.0-vec2(t*.15,t*u_rise*3.);
vec2 p3=base*1.7+vec2(t*.25,-t*u_rise*4.5);
float f1=layer(p1,t*.6,u_warp);
float f2=layer(p2+7.1,t,u_warp);
float f3=layer(p3+13.7,t*1.5,u_warp*.8);
float f=f1*.45+f2*.35+f3*.2;
${shade}
float d=smoothstep(u_lo,u_hi,f);
d=pow(d,1.05);
d*=mix(1.-u_bottom,1.,smoothstep(1.05,.1,uv.y));
d*=.45+.55*(smoothstep(0.,.3,uv.x)*smoothstep(1.,.7,uv.x));
if(u_rays>.5){
  float ang=(uv.x-.5)*1.4;
  float rays=0.;
  for(int i=0;i<5;i++){float fi=float(i);float c=-.6+fi*.3+sin(t*2.+fi)*.03;rays+=smoothstep(.06,.0,abs(ang-c))*(.5+.5*noise(vec2(fi*7.,t*3.)));}
  d+=rays*smoothstep(0.,.9,uv.y)*.35*(.4+.6*f);
}
/* «αύρα»: απαλό φως πίσω από το κέντρο (τα γράμματα) που φωτίζει τον καπνό γύρω του */
vec2 cc=uv-vec2(.5,u_gy);cc.x*=asp;
float glow=exp(-dot(cc,cc)*u_gr)*u_glow;
float a=clamp(d+glow*.12*(.3+f),0.,1.)*u_str;
/* γκρι με σκίαση: φωτισμένες κορυφές πιο ανοιχτές, «κοιλιές» πιο σκούρες· πιο φωτεινός κοντά στο φως */
float g=mix(.6,1.,shade)*(.8+.55*glow);
gl_FragColor=vec4(vec3(min(a*g,1.)),a);
}`;
};

function setup(canvas: HTMLCanvasElement) {
  canvas.dataset.smoke = '1';
  const gl = canvas.getContext('webgl', { alpha: true, premultipliedAlpha: true, antialias: false, depth: false, stencil: false, powerPreference: 'low-power' });
  if (!gl) { canvas.remove(); return; }
  if (TIER !== 'still' && isSoftwareGL(gl)) { TIER = 'still'; document.documentElement.classList.add('gpu-soft'); } // και ο Ντοτ σταματά (Mascot.astro)
  // highp όπου υπάρχει: σε GPU κινητών το mediump (fp16) «σπάει» τον θόρυβο μετά από λίγα λεπτά (μεγάλο t).
  const highp = (gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.HIGH_FLOAT)?.precision ?? 0) > 0;
  const deriv = TIER !== 'full' && !!gl.getExtension('OES_standard_derivatives');
  const par = gl.getExtension('KHR_parallel_shader_compile') as { COMPLETION_STATUS_KHR: number } | null;
  const mk = (t: number, src: string) => { const s = gl.createShader(t)!; gl.shaderSource(s, src); gl.compileShader(s); return s; };
  const prog = gl.createProgram()!;
  gl.attachShader(prog, mk(gl.VERTEX_SHADER, VERT)); gl.attachShader(prog, mk(gl.FRAGMENT_SHADER, fragSrc(TIER, deriv, highp))); gl.linkProgram(prog);

  const start = () => {
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) { canvas.remove(); return; }
    gl.useProgram(prog);
    const buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const a = gl.getAttribLocation(prog, 'a'); gl.enableVertexAttribArray(a); gl.vertexAttribPointer(a, 2, gl.FLOAT, false, 0, 0);
    const U = (n: string) => gl.getUniformLocation(prog, n);
    const uRes = U('u_res'), uT = U('u_t');
    const d = canvas.dataset;
    const num = (k: string, def: number) => { const v = Number(d[k]); return Number.isFinite(v) && d[k] !== undefined ? v : def; };
    gl.uniform1f(U('u_str'), num('strength', .75));
    gl.uniform1f(U('u_scale'), num('scale', 2.4));
    gl.uniform1f(U('u_warp'), num('warp', 3.5));
    gl.uniform1f(U('u_lo'), num('lo', .38));
    gl.uniform1f(U('u_hi'), num('hi', .98));
    gl.uniform1f(U('u_bottom'), num('bottom', .75));
    gl.uniform1f(U('u_rise'), num('rise', .15));
    gl.uniform1f(U('u_rays'), num('rays', 0));
    gl.uniform1f(U('u_glow'), num('glow', .9));
    gl.uniform1f(U('u_gy'), num('glowy', .5));   // ύψος του φωτός (0 κάτω – 1 πάνω)
    gl.uniform1f(U('u_gr'), num('glowr', 2.8));  // πόσο «σφιχτό» είναι το φως (μεγάλο = μικρότερος κύκλος)
    const speed = num('speed', 1);
    gl.enable(gl.BLEND); gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    // Ανάλυση ανά βαθμίδα: ο καπνός είναι θολός από τη φύση του — η μικρότερη ανάλυση δεν φαίνεται.
    const dpr = devicePixelRatio || 1;
    const scale = () => (TIER === 'lite' ? .45 * Math.min(dpr, 1) : TIER === 'still' ? .6 * Math.min(dpr, 1.5) : .65 * Math.min(dpr, 1.2));
    const fit = () => {
      const r = canvas.getBoundingClientRect(); const s = scale();
      canvas.width = Math.max(2, Math.round(r.width * s)); canvas.height = Math.max(2, Math.round(r.height * s));
      gl.viewport(0, 0, canvas.width, canvas.height); gl.uniform2f(uRes, canvas.width, canvas.height);
    };
    const minDt = TIER === 'lite' ? 31 : 0; // ~30 fps στο κινητό
    let visible = true, raf = 0, last = -1e9; const t0 = performance.now();
    const frame = (now: number) => {
      raf = 0;
      if (now - last < minDt) { raf = requestAnimationFrame(frame); return; }
      last = now;
      gl.uniform1f(uT, ((now - t0) / 1000) * speed + 40);
      gl.clear(gl.COLOR_BUFFER_BIT); gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      if (TIER !== 'still' && visible && !document.hidden) raf = requestAnimationFrame(frame);
    };
    const kick = () => { if (!raf) raf = requestAnimationFrame(frame); };
    fit(); kick();
    if ('ResizeObserver' in window) new ResizeObserver(() => { fit(); kick(); }).observe(canvas); else addEventListener('resize', () => { fit(); kick(); });
    if ('IntersectionObserver' in window) new IntersectionObserver((es) => { visible = es[0].isIntersecting; if (visible) kick(); }, { threshold: 0 }).observe(canvas);
    document.addEventListener('visibilitychange', () => { if (!document.hidden) kick(); });
    canvas.classList.add('is-on');
  };

  // Μεταγλώττιση στο παρασκήνιο όπου υποστηρίζεται — περιμένουμε χωρίς να μπλοκάρουμε το main thread.
  if (par) {
    const poll = () => { if (gl.getProgramParameter(prog, par.COMPLETION_STATUS_KHR)) start(); else requestAnimationFrame(poll); };
    poll();
  } else start();
}

// Ξεκίνημα μετά το load κι όταν ο browser αδειάσει — ο καπνός δεν παλεύει με την πρώτη ζωγραφιά.
//  • Οθόνες αφής: 1,6 s μετά το load, όταν έχουν τελειώσει οι είσοδοι του hero — σε GPU κινητού χωρίς
//    KHR_parallel_shader_compile η μεταγλώττιση μπλοκάρει το main thread ~50-100 ms· καλύτερα σε ήσυχη στιγμή.
//  • Κάθε καμβάς στήνεται μόνο όταν πλησιάσει στην οθόνη (IntersectionObserver, ±60 %): ο δεύτερος καμβάς
//    της σελίδας (CTA στο τέλος) δεν κοστίζει τίποτα στο φόρτωμα.
const boot = () => {
  const run = () => {
    const list = document.querySelectorAll<HTMLCanvasElement>('canvas.stg-smoke:not([data-smoke])');
    if (!('IntersectionObserver' in window)) { list.forEach(setup); return; }
    const io = new IntersectionObserver((es) => {
      for (const e of es) if (e.isIntersecting) { io.unobserve(e.target); if (!(e.target as HTMLCanvasElement).dataset.smoke) setup(e.target as HTMLCanvasElement); }
    }, { rootMargin: '60% 0px' });
    // Όσο παίζει το intro ο καπνός του hero είναι display:none (δεν «τέμνει» ποτέ) — στήνεται τώρα, κάτω από το
    // πέπλο, ώστε η μεταγλώττιση να μη συμπέσει με το άνοιγμα και τις εισόδους.
    const introOn = document.documentElement.hasAttribute('data-intro-run');
    list.forEach((c) => { if (introOn && getComputedStyle(c).display === 'none') setup(c); else io.observe(c); });
  };
  const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number };
  const idle = () => { if (w.requestIdleCallback) w.requestIdleCallback(run, { timeout: 1500 }); else setTimeout(run, 250); };
  if (mq('(pointer: coarse)')) setTimeout(idle, 1600); else idle();
};
if (document.readyState === 'complete') boot(); else addEventListener('load', boot, { once: true });
