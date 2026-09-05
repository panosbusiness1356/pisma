/**
 * Smoke — γκρίζος καπνός σκηνής σε WebGL (αίτημα χρήστριας 06/09/2026:
 * «φτιάξε τον εσύ τον καπνό, όχι βίντεο»). Fractal noise με domain warping
 * που κυλά αργά· μοιάζει με βίντεο καπνού, χωρίς αρχείο (0 KB media).
 *
 * Ζωγραφίζει σε κάθε <canvas class="stg-smoke"> (~85% ανάλυση, ~55% σε κινητό).
 * Παραλλαγές με data-attributes (όλα προαιρετικά):
 *   data-strength  ένταση (0–1, default .6)
 *   data-scale     μέγεθος σχηματισμών (μικρό = μεγάλα σύννεφα, default 2.4)
 *   data-speed     ταχύτητα (default 1)
 *   data-warp      πόσο «στρίβει» (0–6, default 3.5)
 *   data-lo/hi     κατώφλια πυκνότητας (default .38 / .98 — μικρότερο lo = πιο πυκνός)
 *   data-bottom    πόσο πιο πυκνός κάτω (0–1, default .75)
 *   data-rise      άνοδος προς τα πάνω (0–1, default .15)
 *   data-rays      ακτίνες προβολέων μέσα στον καπνό (0/1, default 0)
 * Σταματά εκτός οθόνης/κρυφής καρτέλας, παγώνει σε ένα καρέ με reduced motion,
 * αφαιρείται χωρίς WebGL (μένει ο CSS καπνός από κάτω).
 */
const VERT = `attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}`;
const FRAG = `precision mediump float;
uniform vec2 u_res;uniform float u_t,u_str,u_scale,u_warp,u_lo,u_hi,u_bottom,u_rise,u_rays;
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.,1.)),f.x),f.y);}
float fbm(vec2 p){float v=0.,a=.5;mat2 m=mat2(1.6,1.2,-1.2,1.6);
for(int i=0;i<5;i++){v+=a*noise(p);p=m*p;a*=.5;}return v;}
void main(){
vec2 uv=gl_FragCoord.xy/u_res;
vec2 p=uv*vec2(u_res.x/u_res.y,1.)*u_scale;
float t=u_t*.05;
p.y-=t*u_rise*3.;
vec2 q=vec2(fbm(p+vec2(0.,t)),fbm(p+vec2(5.2,1.3)-t*.7));
vec2 r=vec2(fbm(p+u_warp*q+vec2(1.7,9.2)+t*.45),fbm(p+u_warp*q+vec2(8.3,2.8)-t*.3));
float f=fbm(p+u_warp*r);
float s=smoothstep(u_lo,u_hi,f);
s*=mix(1.-u_bottom,1.,smoothstep(1.05,.1,uv.y));
s*=.45+.55*(smoothstep(0.,.3,uv.x)*smoothstep(1.,.7,uv.x));
if(u_rays>.5){
  float ang=(uv.x-.5)*1.4-(uv.y-1.2)*.0;
  float rays=0.;
  for(int i=0;i<5;i++){float fi=float(i);float c=-.6+fi*.3+sin(t*2.+fi)*.03;rays+=smoothstep(.06,.0,abs(ang-c))*(.5+.5*noise(vec2(fi*7.,t*3.)));}
  s+=rays*smoothstep(0.,.9,uv.y)*.35*(.4+.6*f);
}
float c=clamp(s,0.,1.)*u_str;
gl_FragColor=vec4(vec3(c*.92),c);
}`;

function setup(canvas: HTMLCanvasElement) {
  const gl = canvas.getContext('webgl', { alpha: true, premultipliedAlpha: true, antialias: false, powerPreference: 'low-power' });
  if (!gl) { canvas.remove(); return; }
  const mk = (t: number, src: string) => { const s = gl.createShader(t)!; gl.shaderSource(s, src); gl.compileShader(s); return s; };
  const prog = gl.createProgram()!;
  gl.attachShader(prog, mk(gl.VERTEX_SHADER, VERT)); gl.attachShader(prog, mk(gl.FRAGMENT_SHADER, FRAG)); gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) { canvas.remove(); return; }
  gl.useProgram(prog);
  const buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  const a = gl.getAttribLocation(prog, 'a'); gl.enableVertexAttribArray(a); gl.vertexAttribPointer(a, 2, gl.FLOAT, false, 0, 0);
  const U = (n: string) => gl.getUniformLocation(prog, n);
  const uRes = U('u_res'), uT = U('u_t');
  const d = canvas.dataset;
  const num = (k: string, def: number) => { const v = Number(d[k]); return Number.isFinite(v) && d[k] !== undefined ? v : def; };
  gl.uniform1f(U('u_str'), num('strength', .6));
  gl.uniform1f(U('u_scale'), num('scale', 2.4));
  gl.uniform1f(U('u_warp'), num('warp', 3.5));
  gl.uniform1f(U('u_lo'), num('lo', .38));
  gl.uniform1f(U('u_hi'), num('hi', .98));
  gl.uniform1f(U('u_bottom'), num('bottom', .75));
  gl.uniform1f(U('u_rise'), num('rise', .15));
  gl.uniform1f(U('u_rays'), num('rays', 0));
  const speed = num('speed', 1);
  gl.enable(gl.BLEND); gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const scale = () => (innerWidth < 720 ? .55 : .85);
  const fit = () => {
    const r = canvas.getBoundingClientRect(); const s = scale() * Math.min(devicePixelRatio, 1.5);
    canvas.width = Math.max(2, Math.round(r.width * s)); canvas.height = Math.max(2, Math.round(r.height * s));
    gl.viewport(0, 0, canvas.width, canvas.height); gl.uniform2f(uRes, canvas.width, canvas.height);
  };
  let visible = true, raf = 0; const t0 = performance.now();
  const frame = () => {
    raf = 0;
    gl.uniform1f(uT, ((performance.now() - t0) / 1000) * speed + 40);
    gl.clear(gl.COLOR_BUFFER_BIT); gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    if (!reduce && visible && !document.hidden) raf = requestAnimationFrame(frame);
  };
  const kick = () => { if (!raf) raf = requestAnimationFrame(frame); };
  fit(); kick();
  if ('ResizeObserver' in window) new ResizeObserver(() => { fit(); kick(); }).observe(canvas); else addEventListener('resize', () => { fit(); kick(); });
  if ('IntersectionObserver' in window) new IntersectionObserver((es) => { visible = es[0].isIntersecting; if (visible) kick(); }, { threshold: 0 }).observe(canvas);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) kick(); });
  canvas.classList.add('is-on');
}

document.querySelectorAll<HTMLCanvasElement>('canvas.stg-smoke').forEach(setup);
