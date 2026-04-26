/**
 * @file client/src/components/landing/ShaderBackground.tsx
 * Curves shader wallpaper for the landing page background.
 *
 * Ported verbatim from the claude.ai/design "Shader wallpapers" project
 * (CURVES variant) — six emerald price-curve lines drifting horizontally,
 * gently bending toward the cursor on desktop. The cursor reaction is
 * decorative; default mouse position keeps the curves animated even when
 * the user doesn't move the pointer.
 *
 * Implementation notes:
 *   - WebGL1 (most permissive — older devices, iOS Safari, etc.).
 *   - Honours prefers-reduced-motion (renders one static frame, no RAF).
 *   - Pauses when the tab is hidden (Page Visibility API) → no battery drain.
 *   - Falls back to a CSS radial gradient when WebGL is unavailable.
 *   - Position absolute + pointer-events-none so it never blocks UI.
 *
 * Usage:
 *   <ShaderBackground intensity={0.6} />
 */

import { useEffect, useRef } from 'react';

const VERT = `
attribute vec2 a_position;
void main() { gl_Position = vec4(a_position, 0.0, 1.0); }
`;

// Curves shader — verbatim port of the claude.design "curves" wallpaper,
// minus u_click (we don't render ripples on click in this background variant).
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
float fbm(vec2 p){ float v=0., a=0.5; for(int i=0;i<4;i++){ v+=a*noise(p); p*=2.0; a*=0.5; } return v; }

void main(){
  vec2 uv = gl_FragCoord.xy / u_resolution;
  vec2 suv = (gl_FragCoord.xy - 0.5*u_resolution) / u_resolution.y;
  vec2 m = u_mouse;

  vec3 paper   = vec3(0.985, 0.982, 0.962);
  vec3 emerald = vec3(0.000, 1.000, 0.785);
  vec3 emLight = vec3(0.000, 0.880, 1.000);

  vec3 col = paper;

  for(int i = 0; i < 6; i++){
    float fi = float(i);
    float yBase = 0.18 + fi * 0.13;
    float w = fbm(vec2(uv.x * 2.5 + u_time * 0.06 + fi * 4.0, fi));
    float dx = uv.x - m.x;
    float bend = (m.y - yBase) * exp(-dx * dx * 5.0) * 0.5;
    float y = yBase + w * 0.04 + bend;
    float dy = abs(uv.y - y);

    float thickness = 0.0015 + fi * 0.0004;
    float line = smoothstep(thickness * 1.5, 0.0, dy);
    vec3 c = mix(emLight, emerald, fi / 5.0);
    col = mix(col, c, line * 0.7 * u_intensity);

    // Soft halo so curves feel airy, not pixel-thin.
    col = mix(col, c, smoothstep(0.04, 0.0, dy) * 0.06 * u_intensity);
  }

  // Subtle vignette — keeps the centre brighter than the edges.
  col *= 1.0 - 0.10 * length(suv);
  gl_FragColor = vec4(col, 1.0);
}
`;

interface Props {
  /** Visual saturation of the curves. 0.4 (subtle) to 1.0 (bold). Default 0.7. */
  intensity?: number;
  /** Extra Tailwind classes for the wrapper. */
  className?: string;
}

export default function ShaderBackground({ intensity = 0.7, className = '' }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrapper = wrapperRef.current;
    if (!canvas || !wrapper) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const gl = canvas.getContext('webgl', { antialias: false, premultipliedAlpha: false });
    if (!gl) return; // CSS fallback below handles unsupported browsers

    // ── Compile shaders ───────────────────────────────────────────────
    const compile = (type: number, source: string): WebGLShader | null => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        // eslint-disable-next-line no-console
        console.warn('Shader compile failed:', gl.getShaderInfoLog(shader));
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
      console.warn('Program link failed:', gl.getProgramInfoLog(program));
      return;
    }
    gl.useProgram(program);

    // ── Fullscreen quad ───────────────────────────────────────────────
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

    // ── Mouse handling (smoothed) ─────────────────────────────────────
    const mouse = { x: 0.5, y: 0.5 };
    const target = { x: 0.5, y: 0.5 };
    const onMove = (e: PointerEvent) => {
      target.x = e.clientX / window.innerWidth;
      target.y = 1.0 - e.clientY / window.innerHeight;
    };
    window.addEventListener('pointermove', onMove, { passive: true });

    // ── Resize handling ───────────────────────────────────────────────
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

    // ── Render loop ───────────────────────────────────────────────────
    let raf = 0;
    let start = performance.now();
    let visible = true;
    let elapsed = 0;

    const onVisibility = () => {
      visible = !document.hidden;
      if (visible) {
        // Resync time so animation continues smoothly after pause.
        start = performance.now() - elapsed * 1000;
        raf = requestAnimationFrame(loop);
      }
    };
    const loop = (now: number) => {
      elapsed = (now - start) / 1000;
      // Smooth mouse for that lazy lerp feel from the original demo.
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
        // CSS fallback so the section is never visually empty even if WebGL fails.
        background:
          'radial-gradient(ellipse at 30% 30%, #ECFDF5 0%, transparent 50%), radial-gradient(ellipse at 70% 70%, #DCFCE7 0%, transparent 60%)',
      }}
    >
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
}
