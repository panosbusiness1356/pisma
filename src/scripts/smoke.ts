/**
 * Smoke — γκρίζος καπνός σκηνής σε WebGL (αίτημα χρήστριας 06/09/2026:
 * «φτιάξε τον εσύ τον καπνό, όχι βίντεο»). Fractal noise με domain warping
 * που κυλά αργά· μοιάζει με βίντεο καπνού, χωρίς αρχείο (0 KB media).
 *
 * Ζωγραφίζει σε κάθε <canvas class="stg-smoke"> (~85% ανάλυση, ~55% σε κινητό).
 * Σταματά εκτός οθόνης/κρυφής καρτέλας, παγώνει σε ένα καρέ με reduced motion,
 * αφαιρείται χωρίς WebGL (μένει ο CSS καπνός από κάτω).
 */
const VERT = `attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}`;
const FRAG = `precision mediump float;
uniform vec2 u_res;uniform float u_t;uniform float u_str;
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.,1.)),f.x),f.y);}
float fbm(vec2 p){float v=0.,a=.5;mat2 m=mat2(1.6,1.2,-1.2,1.6);
for(int i=0;i<5;i++){v+=a*noise(p);p=m*p;a*=.5;}return v;}
void main(){
vec2 uv=gl_FragCoord.xy/u_res;
vec2 p=uv*vec2(u_res.x/u_res.y,1.)*2.4;
float t=u_t*.05;
vec2 q=vec2(fbm(p+vec2(0.,t)),fbm(p+vec2(5.2,1.3)-t*.7));
vec2 r=vec2(fbm(p+3.5*q+vec2(1.7,9.2)+t*.45),fbm(p+3.5*q+vec2(8.3,2.8)-t*.3));
float f=fbm(p+3.5*r);
float s=smoothstep(.38,.98,f);
s*=mix(.25,1.,smoothstep(1.05,.1,uv.y));            /* πυκνός κάτω, αραιός πάνω */
s*=.45+.55*(smoothstep(0.,.3,uv.x)*smoothstep(1.,.7,uv.x)); /* πιο αχνός στις άκρες */
float c=s*u_str;
gl_FragColor=vec4(vec3(c*.92),c);                   /* premultiplied, ελαφρά γκρι */
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
  const uRes = gl.getUniformLocation(prog, 'u_res'), uT = gl.getUniformLocation(prog, 'u_t'), uStr = gl.getUniformLocation(prog, 'u_str');
  gl.enable(gl.BLEND); gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
  const strength = Number(canvas.dataset.strength || '.55');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  // Πλήρης-ish ανάλυση για καθαρό (όχι «pixel») καπνό — 5 οκτάβες μένουν φθηνές.
  const scale = () => (innerWidth < 720 ? .55 : .85);
  const fit = () => {
    const r = canvas.getBoundingClientRect(); const s = scale() * Math.min(devicePixelRatio, 1.5);
    canvas.width = Math.max(2, Math.round(r.width * s)); canvas.height = Math.max(2, Math.round(r.height * s));
    gl.viewport(0, 0, canvas.width, canvas.height); gl.uniform2f(uRes, canvas.width, canvas.height);
  };
  let visible = true, raf = 0; const t0 = performance.now();
  const frame = () => {
    raf = 0;
    gl.uniform1f(uT, (performance.now() - t0) / 1000); gl.uniform1f(uStr, strength);
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
