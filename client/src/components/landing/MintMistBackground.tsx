/**
 * @file client/src/components/landing/MintMistBackground.tsx
 * Mint Mist shader — soft mint clouds with subtle neon spotlight reaction.
 *
 * Verbatim port of the MINT_MIST fragment shader from the claude.ai/design
 * "Shader wallpapers" pack (variant Light). Different from CURVES :
 *   - CURVES draws horizontal lines that bend toward cursor
 *   - MINT_MIST paints diffuse mint/cyan clouds (FBM noise) with a soft
 *     emerald spotlight under the cursor
 *
 * Use case in the landing :
 *   - CURVES sits OUTSIDE the browser frame as the wallpaper extérieur
 *   - MINT_MIST sits INSIDE the browser frame, behind the hero copy, so
 *     the centre of the page glows softly mint-cyan rather than being flat
 *
 * Implementation :
 *   - WebGL1 (broad device support — same as CURVES sibling)
 *   - prefers-reduced-motion → static frame, no RAF
 *   - Page Visibility API → pauses on tab hidden
 *   - CSS radial gradient fallback if WebGL unavailable
 *   - aria-hidden + pointer-events-none → never blocks UI
 */

import { useEffect, useRef } from 'react';

const VERT = `
attribute vec2 a_position;
void main() { gl_Position = vec4(a_position, 0.0, 1.0); }
`;

// MINT_MIST — verbatim port from claude.design "Shader wallpapers" pack.
// Two FBM noise layers, paper base + mint clouds layer, with an emerald
// spotlight that follows the (smoothed) cursor.
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
  // Faster drift so the animation is unmistakably visible at first glance.
  vec2 p = uv*1.2 + vec2(u_time*0.06, -u_time*0.04);
  p += -d * exp(-r*1.8) * 0.30;

  float n = fbm(p*1.8);
  float n2 = fbm(p*3.5 + n*0.6);
  // Second layer that drifts in the opposite direction — gives the mist
  // a sense of depth (foreground / background clouds passing each other).
  float n3 = fbm(p*2.4 - vec2(u_time*0.04, u_time*0.03));

  vec3 paper   = vec3(0.985, 0.985, 0.972);
  vec3 mint    = vec3(0.580, 0.945, 0.985);   // brighter cyan-mint
  vec3 cyan    = vec3(0.380, 0.870, 0.965);   // electric cyan accent
  vec3 emerald = vec3(0.020, 0.980, 0.750);   // neon emerald

  vec3 col = paper;
  // Mint clouds (broader / more opaque so they read at a glance)
  col = mix(col, mint, smoothstep(0.30, 0.80, n2) * 0.85 * u_intensity);
  // Cyan accent on the second layer — only the brighter cells lift to neon
  col = mix(col, cyan, smoothstep(0.55, 0.90, n3) * 0.45 * u_intensity);
  // Emerald spotlight under cursor (brighter for the "neon fluo" the user asked)
  float spot = exp(-r*2.5);
  col = mix(col, emerald, spot * 0.35 * u_intensity);

  // Soft edge wash so the centre glows brightest.
  col *= 1.0 - 0.12 * length(uv);
  gl_FragColor = vec4(col, 1.0);
}
`;

interface Props {
  /** Visual saturation. 0.4 (whisper) to 1.0 (bold). Default 0.7. */
  intensity?: number;
  /** Extra Tailwind classes for the wrapper. */
  className?: string;
}

export default function MintMistBackground({ intensity = 0.7, className = '' }: Props) {
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
        console.warn('[MintMist] shader compile failed:', gl.getShaderInfoLog(shader));
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
      console.warn('[MintMist] program link failed:', gl.getProgramInfoLog(program));
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
        // CSS fallback for browsers without WebGL
        background:
          'radial-gradient(ellipse at 30% 40%, #B8E5CD 0%, transparent 55%), radial-gradient(ellipse at 70% 60%, #B8F5FF 0%, transparent 60%)',
      }}
    >
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
}
