/**
 * @file client/src/components/landing/ShaderBackground.tsx
 * Paper-fold green shader for the landing hero background.
 *
 * Inspired by the claude.ai/design "Shader wallpapers" project — rebuilt
 * here as a self-contained React + WebGL2 component.
 *
 * Implementation notes :
 *   - Fragment shader uses layered simplex-style noise + cosine palette
 *     to evoke folded paper waves in a soft mint/emerald gradient.
 *   - Honours prefers-reduced-motion (renders a single static frame).
 *   - Pauses when the tab is hidden (Page Visibility API) to spare battery.
 *   - Falls back to a CSS radial gradient when WebGL2 is unavailable.
 *   - Position absolute + pointer-events-none so it never blocks UI.
 *
 * Usage :
 *   <section className="relative">
 *     <ShaderBackground intensity={0.45} />
 *     // ...content...
 *   </section>
 */

import { useEffect, useRef } from 'react';

const VERT = `#version 300 es
precision highp float;
in vec2 a_position;
out vec2 v_uv;
void main() {
  v_uv = a_position * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}`;

// Paper-fold green wallpaper.
// - Two layers of fractal-ish noise displaced by time.
// - Cosine palette in the emerald range produces soft mint highlights and
//   a darker green shadow, evoking folded paper under glancing light.
// - INTENSITY uniform lets the host control how saturated the effect is.
const FRAG = `#version 300 es
precision highp float;
in vec2 v_uv;
out vec4 fragColor;
uniform float u_time;
uniform vec2 u_resolution;
uniform float u_intensity;

// Hash + value noise — small, fast, works on every WebGL2 device.
float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}
float fbm(vec2 p) {
  float v = 0.0;
  float amp = 0.5;
  for (int i = 0; i < 4; i++) {
    v += amp * noise(p);
    p *= 2.05;
    amp *= 0.5;
  }
  return v;
}

// Cosine palette tuned for soft mint -> emerald with a hint of cream.
// https://iquilezles.org/articles/palettes/
vec3 palette(float t) {
  vec3 a = vec3(0.85, 0.95, 0.90);  // base
  vec3 b = vec3(0.15, 0.25, 0.20);  // amplitude
  vec3 c = vec3(1.0, 1.0, 1.0);     // freq
  vec3 d = vec3(0.62, 0.45, 0.35);  // phase — leans green/yellow
  return a + b * cos(6.2831853 * (c * t + d));
}

void main() {
  vec2 uv = v_uv;
  // Aspect-correct so the pattern doesn't squash on wide viewports.
  uv.x *= u_resolution.x / u_resolution.y;

  float t = u_time * 0.06;
  // Two layers to evoke folded paper depth.
  float n1 = fbm(uv * 2.4 + vec2(t, -t * 0.7));
  float n2 = fbm(uv * 4.0 - vec2(t * 0.4, t));
  float fold = mix(n1, n2, 0.5) + 0.18 * sin(uv.y * 6.0 + n1 * 4.0);

  vec3 col = palette(fold * 0.6 + 0.3);

  // Soft vignette so the centre stays bright and edges drop off.
  float vign = smoothstep(1.05, 0.45, length(uv - vec2(uv.x * 0.5, 0.5)));
  col = mix(vec3(1.0), col, vign * u_intensity);

  fragColor = vec4(col, 1.0);
}`;

interface Props {
  intensity?: number;
  className?: string;
}

export default function ShaderBackground({ intensity = 0.45, className = '' }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrapper = wrapperRef.current;
    if (!canvas || !wrapper) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const gl = canvas.getContext('webgl2', { antialias: false, alpha: false, premultipliedAlpha: false });
    if (!gl) return; // CSS fallback below handles unsupported browsers

    // ── Compile shaders ───────────────────────────────────────────────
    const compile = (type: number, source: string): WebGLShader | null => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
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
    const uIntensity = gl.getUniformLocation(program, 'u_intensity');
    gl.uniform1f(uIntensity, intensity);

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

    const onVisibility = () => {
      visible = !document.hidden;
      if (visible) {
        // Resync time so animation continues smoothly after pause.
        start = performance.now() - elapsed * 1000;
        raf = requestAnimationFrame(loop);
      }
    };
    let elapsed = 0;
    const loop = (now: number) => {
      elapsed = (now - start) / 1000;
      gl.uniform1f(uTime, elapsed);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      if (!reduced && visible) raf = requestAnimationFrame(loop);
    };

    if (reduced) {
      // Render a single frame — gives the texture without animation.
      gl.uniform1f(uTime, 0);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    } else {
      raf = requestAnimationFrame(loop);
      document.addEventListener('visibilitychange', onVisibility);
    }

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
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
      className={`absolute inset-0 pointer-events-none overflow-hidden -z-10 ${className}`}
      style={{
        // CSS fallback so the section is never visually empty even if WebGL2 fails.
        background:
          'radial-gradient(ellipse at 30% 30%, #ECFDF5 0%, transparent 50%), radial-gradient(ellipse at 70% 70%, #DCFCE7 0%, transparent 60%)',
      }}
    >
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
}
