'use client';

import { useEffect, useRef } from 'react';

// ─── Shader source ──────────────────────────────────────────────
const VERT = `#version 300 es
precision highp float;
in vec2 aPosition;
void main() {
  gl_Position = vec4(aPosition, 0.0, 1.0);
}`;

const FRAG = `#version 300 es
precision highp float;

uniform vec2 uResolution;
uniform float uTime;
out vec4 fragColor;

// ── Simplex-ish hash for domain warping ──
vec2 hash(vec2 p) {
  p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
  return -1.0 + 2.0 * fract(sin(p) * 43758.5453);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);

  return mix(mix(dot(hash(i + vec2(0.0, 0.0)), f - vec2(0.0, 0.0)),
                 dot(hash(i + vec2(1.0, 0.0)), f - vec2(1.0, 0.0)), u.x),
             mix(dot(hash(i + vec2(0.0, 1.0)), f - vec2(0.0, 1.0)),
                 dot(hash(i + vec2(1.0, 1.0)), f - vec2(1.0, 1.0)), u.x), u.y);
}

// ── Soft radial blob ──
float blob(vec2 uv, vec2 center, float radius) {
  float d = length(uv - center);
  return smoothstep(radius, 0.0, d);
}

void main() {
  float aspect = uResolution.x / uResolution.y;
  vec2 uv = gl_FragCoord.xy / uResolution.xy;
  uv.x *= aspect;

  float t = uTime;

  // ── Domain warp: distort UV with low-freq noise for organic feel ──
  float warpStrength = 0.12;
  vec2 warp = vec2(
    noise(uv * 1.2 + t * 0.02),
    noise(uv * 1.2 + vec2(5.2, 1.3) + t * 0.018)
  ) * warpStrength;
  vec2 wuv = uv + warp;

  // ── Base: near-black dark navy ──
  vec3 col = vec3(0.039, 0.039, 0.059);

  // ── Blob positions — slow sinusoidal drift ──
  float cx = 0.5 * aspect; // center x accounting for aspect

  vec2 p1 = vec2(
    cx * 0.55 + 0.2 * sin(t * 0.07),
    0.4 + 0.15 * cos(t * 0.09)
  );
  vec2 p2 = vec2(
    cx * 1.3 + 0.18 * cos(t * 0.05),
    0.6 + 0.2 * sin(t * 0.06)
  );
  vec2 p3 = vec2(
    cx + 0.25 * sin(t * 0.04),
    0.35 + 0.12 * cos(t * 0.08)
  );
  vec2 p4 = vec2(
    cx * 0.4 + 0.15 * cos(t * 0.065),
    0.78 + 0.18 * sin(t * 0.055)
  );
  vec2 p5 = vec2(
    cx * 1.1 + 0.2 * sin(t * 0.045),
    0.2 + 0.14 * cos(t * 0.075)
  );

  // ── Blob colors — dark, desaturated palette ──
  // Indigo / royal purple
  col += blob(wuv, p1, 0.50) * vec3(0.13, 0.08, 0.24);
  // Petrol / muted teal
  col += blob(wuv, p2, 0.55) * vec3(0.03, 0.17, 0.23);
  // Warm ember (amber echo — desaturated)
  col += blob(wuv, p3, 0.45) * vec3(0.19, 0.10, 0.05);
  // Deep magenta / wine
  col += blob(wuv, p4, 0.50) * vec3(0.18, 0.05, 0.14);
  // Subtle deep blue fill
  col += blob(wuv, p5, 0.45) * vec3(0.05, 0.06, 0.16);

  // ── Vignette — darken edges ──
  vec2 vigCenter = vec2(cx, 0.5);
  float vig = smoothstep(1.5, 0.4, length(wuv - vigCenter));
  col *= mix(0.6, 1.0, vig);

  // ── Gentle dithering to kill 8-bit banding (NON-NEGOTIABLE) ──
  float dither = (fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453) - 0.5) / 255.0;
  col += dither;

  fragColor = vec4(col, 1.0);
}`;

// ─── CSS fallback gradient for no-WebGL2 ────────────────────────
const CSS_FALLBACK_STYLE: React.CSSProperties = {
  position: 'fixed',
  inset: 0,
  width: '100vw',
  height: '100vh',
  zIndex: -1,
  pointerEvents: 'none' as const,
  background: `
    radial-gradient(ellipse 80% 60% at 30% 40%, rgba(42,26,74,0.7) 0%, transparent 70%),
    radial-gradient(ellipse 70% 50% at 70% 60%, rgba(10,58,74,0.6) 0%, transparent 70%),
    radial-gradient(ellipse 60% 50% at 50% 35%, rgba(58,32,16,0.5) 0%, transparent 65%),
    radial-gradient(ellipse 70% 55% at 25% 75%, rgba(58,16,48,0.5) 0%, transparent 70%),
    #0a0a0f
  `,
};

// ─── Component ──────────────────────────────────────────────────
export default function GradientBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const glRef = useRef<WebGL2RenderingContext | null>(null);
  const rafRef = useRef<number>(0);
  const programRef = useRef<WebGLProgram | null>(null);
  const startTimeRef = useRef<number>(0);
  const supportsWebGL2 = useRef<boolean | null>(null);
  const reducedMotionRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // ── Detect reduced motion ──
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    reducedMotionRef.current = motionQuery.matches;

    // ── Acquire WebGL2 context ──
    const gl = canvas.getContext('webgl2', {
      antialias: false,
      alpha: false,
      powerPreference: 'low-power',
      preserveDrawingBuffer: false,
    });

    if (!gl) {
      supportsWebGL2.current = false;
      return;
    }

    supportsWebGL2.current = true;
    glRef.current = gl;

    // ── Compile shaders ──
    function compileShader(src: string, type: number): WebGLShader | null {
      const s = gl!.createShader(type);
      if (!s) return null;
      gl!.shaderSource(s, src);
      gl!.compileShader(s);
      if (!gl!.getShaderParameter(s, gl!.COMPILE_STATUS)) {
        console.error('Shader compile error:', gl!.getShaderInfoLog(s));
        gl!.deleteShader(s);
        return null;
      }
      return s;
    }

    const vs = compileShader(VERT, gl.VERTEX_SHADER);
    const fs = compileShader(FRAG, gl.FRAGMENT_SHADER);
    if (!vs || !fs) return;

    const program = gl.createProgram()!;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Program link error:', gl.getProgramInfoLog(program));
      return;
    }

    programRef.current = program;
    gl.useProgram(program);

    // ── Fullscreen quad (triangle strip) ──
    const quad = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, quad, gl.STATIC_DRAW);

    const aPos = gl.getAttribLocation(program, 'aPosition');
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    // ── Uniform locations ──
    const uTimeLoc = gl.getUniformLocation(program, 'uTime');
    const uResLoc = gl.getUniformLocation(program, 'uResolution');

    // ── Resize handler (debounced) ──
    let resizeTimer: ReturnType<typeof setTimeout>;
    const dpr = Math.min(window.devicePixelRatio, 1.5);

    function resize() {
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas!.width = Math.round(w * dpr);
      canvas!.height = Math.round(h * dpr);
      canvas!.style.width = w + 'px';
      canvas!.style.height = h + 'px';
      gl!.viewport(0, 0, canvas!.width, canvas!.height);
    }

    resize();

    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resize, 100);
    };
    window.addEventListener('resize', handleResize, { passive: true });

    // ── Visibility change — pause when tab hidden ──
    let tabHidden = false;
    const handleVisibility = () => {
      tabHidden = document.hidden;
      if (!tabHidden && !reducedMotionRef.current) {
        rafRef.current = requestAnimationFrame(render);
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    // ── Reduced motion listener ──
    const handleMotionChange = (e: MediaQueryListEvent) => {
      reducedMotionRef.current = e.matches;
      if (e.matches) {
        // Render one static frame
        gl!.uniform1f(uTimeLoc, 0);
        gl!.uniform2f(uResLoc, canvas!.width, canvas!.height);
        gl!.drawArrays(gl!.TRIANGLE_STRIP, 0, 4);
        cancelAnimationFrame(rafRef.current);
      } else {
        startTimeRef.current = performance.now();
        rafRef.current = requestAnimationFrame(render);
      }
    };
    motionQuery.addEventListener('change', handleMotionChange);

    // ── Render loop ──
    startTimeRef.current = performance.now();

    const render = () => {
      if (tabHidden) return;

      const t = (performance.now() - startTimeRef.current) / 1000;
      gl!.uniform1f(uTimeLoc, t);
      gl!.uniform2f(uResLoc, canvas!.width, canvas!.height);
      gl!.drawArrays(gl!.TRIANGLE_STRIP, 0, 4);

      rafRef.current = requestAnimationFrame(render);
    };

    if (reducedMotionRef.current) {
      // Static frame only
      gl.uniform1f(uTimeLoc, 0);
      gl.uniform2f(uResLoc, canvas.width, canvas.height);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    } else {
      rafRef.current = requestAnimationFrame(render);
    }

    // ── Cleanup ──
    return () => {
      cancelAnimationFrame(rafRef.current);
      clearTimeout(resizeTimer);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibility);
      motionQuery.removeEventListener('change', handleMotionChange);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteBuffer(buf);
    };
  }, []);

  // If WebGL2 was explicitly detected as unsupported, show CSS fallback
  if (supportsWebGL2.current === false) {
    return <div style={CSS_FALLBACK_STYLE} aria-hidden="true" />;
  }

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        zIndex: -1,
        pointerEvents: 'none',
        display: 'block',
      }}
    />
  );
}
