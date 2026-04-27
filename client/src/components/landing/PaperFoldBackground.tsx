/**
 * @file client/src/components/landing/PaperFoldBackground.tsx
 * Paper Fold shader — folded paper texture with neon emerald creases.
 *
 * Verbatim port of the PAPER_FOLD fragment shader (variant 1) from the
 * claude.ai/design "Shader wallpapers" pack (variant Light).
 *
 * What you see:
 *   - A soft folded-paper texture (two paper tones blended through fbm noise)
 *   - Sharp ink creases where the folds bend hardest
 *   - A subtle emerald "neon" accent that lights the creases nearest the cursor
 *
 * Difference from MINT_MIST :
 *   - PAPER_FOLD has visible paper folds (sin(n1*8 + n2*3)) → strong texture
 *   - MINT_MIST is just diffuse mint clouds → much softer
 *
 * Implementation : WebGL1 (broad device support), prefers-reduced-motion
 * fallback, Page Visibility pause, ResizeObserver, CSS gradient fallback.
 */

import { useEffect, useRef } from 'react';

const VERT = `
attribute vec2 a_position;
void main() { gl_Position = vec4(a_position, 0.0, 1.0); }
`;

const FRAG = `
precision highp float;
uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;
uniform float u_intensity;

float hash(vec2 p){ return fract(sin(dot(p, vec2(41.3,289.1)))*45758.5); }
float noise(vec2 p){
  vec2 i=floor(p), f=fract(p);
  float a=hash(i), b=hash(i+vec2(1,0));
  float c=hash(i+vec2(0,1)), d=hash(i+vec2(1,1));
  vec2 u=f*f*(3.-2.*f);
  return mix(mix(a,b,u.x), mix(c,d,u.x), u.y);
}
float fbm(vec2 p){ float v=0., a=0.5; for(int i=0;i<5;i++){ v+=a*noise(p); p*=2.0; a*=0.5; } return v; }

void main(){
  vec2 uv = (gl_FragCoord.xy - 0.5*u_resolution)/u_resolution.y;
  vec2 m = (u_mouse - 0.5)*vec2(u_resolution.x/u_resolution.y, 1.0);

  vec2 d = uv - m;
  float r = length(d);
  // Paper bends toward cursor — local warp.
  vec2 p = uv + (-d * exp(-r*2.5) * 0.18);

  float t = u_time*0.05;
  float n1 = fbm(p*1.5 + t);
  float n2 = fbm(p*4.0 - t*0.5 + n1);
  // Folds : sine of layered noise creates wavefront-like crease pattern.
  float folds = sin(n1*8.0 + n2*3.0);

  vec3 paper   = vec3(0.985, 0.978, 0.955);   // top sheet
  vec3 paper2  = vec3(0.945, 0.940, 0.915);   // shadowed under-fold
  vec3 ink     = vec3(0.078, 0.125, 0.102);   // dark crease ink
  vec3 emerald = vec3(0.000, 1.000, 0.785);   // neon accent

  vec3 col = mix(paper, paper2, smoothstep(-0.2, 0.6, folds));

  // Sharp dark creases
  float crease = smoothstep(0.92, 0.99, abs(folds));
  col = mix(col, ink, crease * 0.10 * u_intensity);

  // Emerald accent on creases close to cursor — that's the "neon" the user
  // asked for in light mode.
  float emCrease = smoothstep(0.85, 0.99, folds) * smoothstep(0.4, 0.0, r);
  col = mix(col, emerald, emCrease * 0.55 * u_intensity);

  // Soft vignette
  col *= 1.0 - 0.12 * length(uv);
  gl_FragColor = vec4(col, 1.0);
}
`;

interface Props {
  /** Visual saturation. 0.4 (whisper) to 1.0 (bold). Default 1.0. */
  intensity?: number;
  /** Extra Tailwind classes. */
  className?: string;
}

export default function PaperFoldBackground({ intensity = 1.0, className = '' }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrapper = wrapperRef.current;
    if (!canvas || !wrapper) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const gl = canvas.getContext('webgl', { antialias: false, premultipliedAlpha: false });
    if (!gl) return;

    const compile = (type: number, source: string): WebGLShader | null => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        // eslint-disable-next-line no-console
        console.warn('[PaperFold] shader compile failed:', gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vert = compile(gl.VERTEX_SHADER, VERT);
    const frag = compile(gl.FRAGMENT_SHADER, FRAG);
    if (!vert || !frag) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vert);
    gl.attachShader(program, frag);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      // eslint-disable-next-line no-console
      console.warn('[PaperFold] program link failed:', gl.getProgramInfoLog(program));
      return;
    }
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );
    const aPos = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(program, 'u_time');
    const uRes = gl.getUniformLocation(program, 'u_resolution');
    const uMouse = gl.getUniformLocation(program, 'u_mouse');
    const uIntensity = gl.getUniformLocation(program, 'u_intensity');
    gl.uniform1f(uIntensity, intensity);

    const mouse = { x: 0.5, y: 0.5 };
    const target = { x: 0.5, y: 0.5 };
    const onMove = (e: PointerEvent) => {
      const rect = wrapper.getBoundingClientRect();
      target.x = (e.clientX - rect.left) / rect.width;
      target.y = 1.0 - (e.clientY - rect.top) / rect.height;
    };
    window.addEventListener('pointermove', onMove, { passive: true });

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const resize = () => {
      const w = wrapper.clientWidth;
      const h = wrapper.clientHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uRes, canvas.width, canvas.height);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrapper);

    let raf = 0;
    let start = performance.now();
    let visible = true;
    let elapsed = 0;

    const onVisibility = () => {
      visible = !document.hidden;
      if (visible) {
        start = performance.now() - elapsed * 1000;
        raf = requestAnimationFrame(loop);
      }
    };
    const loop = (now: number) => {
      elapsed = (now - start) / 1000;
      mouse.x += (target.x - mouse.x) * 0.08;
      mouse.y += (target.y - mouse.y) * 0.08;
      gl.uniform1f(uTime, elapsed);
      gl.uniform2f(uMouse, mouse.x, mouse.y);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      if (!reduced && visible) raf = requestAnimationFrame(loop);
    };

    if (reduced) {
      gl.uniform1f(uTime, 0);
      gl.uniform2f(uMouse, 0.5, 0.5);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    } else {
      raf = requestAnimationFrame(loop);
      document.addEventListener('visibilitychange', onVisibility);
    }

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('visibilitychange', onVisibility);
      gl.deleteProgram(program);
      gl.deleteShader(vert);
      gl.deleteShader(frag);
      gl.deleteBuffer(buffer);
    };
  }, [intensity]);

  return (
    <div
      ref={wrapperRef}
      aria-hidden="true"
      className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}
      style={{
        // CSS fallback
        background:
          'radial-gradient(ellipse at 30% 40%, #F5F2EC 0%, transparent 55%), radial-gradient(ellipse at 70% 60%, #ECF7F1 0%, transparent 60%)',
      }}
    >
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
}
