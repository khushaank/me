import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useTheme } from '../contexts/ThemeContext';

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

const fragmentShader = `
  precision highp float;

  uniform float u_time;
  uniform vec2 u_res;
  uniform float u_scale;
  uniform float u_speed;
  uniform float u_warp;
  uniform float u_grid_width;
  uniform float u_color_w;
  uniform float u_dark_mode;

  vec4 permute(vec4 x) {
    return mod(x * x * 34.0 + x, 289.0);
  }

  float snoise(vec3 v) {
    const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

    vec3 i = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);

    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);

    vec3 x1 = x0 - i1 + 1.0 * C.xxx;
    vec3 x2 = x0 - i2 + 2.0 * C.xxx;
    vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;

    i = mod(i, 289.0);
    vec4 p = permute(permute(permute(
      i.z + vec4(0.0, i1.z, i2.z, 1.0))
      + i.y + vec4(0.0, i1.y, i2.y, 1.0))
      + i.x + vec4(0.0, i1.x, i2.x, 1.0));

    float n_ = 1.0 / 7.0;
    vec3 ns = n_ * D.wyz - D.xzx;

    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

    vec4 x_ = floor(j * ns.z);
    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = floor(j - 7.0 * x_) * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);

    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);

    vec4 s0 = floor(b0) * 2.0 + 1.0;
    vec4 s1 = floor(b1) * 2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));

    vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;

    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);

    vec4 norm = 1.79284291400159 - 0.85373472095314 * vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;

    vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
  }

  float fbm(vec3 p, float time, float warp) {
    float value = 0.0;
    float amplitude = 0.5;
    for (int i = 0; i < 6; i++) {
      float v = snoise(p + time) * warp;
      p += v;
      value += amplitude * snoise(p);
      p *= 2.0;
      amplitude *= 0.5;
    }
    return value;
  }

  void main() {
    vec2 aspect = vec2(u_res.x / u_res.y, 1.0);
    vec2 p = aspect * (gl_FragCoord.xy / u_res - 0.5) * u_scale;
    float time = u_time * u_speed;
    float warp = u_warp;

    vec2 q = vec2(
      fbm(vec3(p, 1.0), time, warp),
      fbm(vec3(p + 5.2, 1.0), time, warp)
    );

    vec2 r = vec2(
      fbm(vec3(p + 4.0 * q + vec2(1.7, 9.2), 1.0), time, warp),
      fbm(vec3(p + 4.0 * q + vec2(8.3, 2.8), 1.0), time, warp)
    );

    float f = fbm(vec3(p + 3.5 * r, 1.0), time, warp);

    // Light mode — matches CSS --bg-warm-white #F4F1EC and warm palette
    vec3 l_col1 = vec3(0.957, 0.945, 0.925);  // #F4F1EC warm white
    vec3 l_col2 = vec3(0.831, 0.863, 0.910);  // #D4DCE8 cool blue-grey
    vec3 l_col3 = vec3(0.478, 0.549, 0.627);  // #7A8CA0 slate blue-grey
    vec3 l_col4 = vec3(0.094, 0.094, 0.094);  // #181818 near black

    // Dark mode — visible contrast against #0D0D0D bg with cool blue-grey tones
    vec3 d_col1 = vec3(0.220, 0.230, 0.250);  // #383a40 light slate — bright veins
    vec3 d_col2 = vec3(0.165, 0.175, 0.200);  // #2a2c33 mid slate
    vec3 d_col3 = vec3(0.100, 0.110, 0.140);  // #191c24 deep slate
    vec3 d_col4 = vec3(0.040, 0.042, 0.055);  // #0a0b0e near-black

    // Mix between light and dark palettes
    vec3 col1 = mix(l_col1, d_col1, u_dark_mode);
    vec3 col2 = mix(l_col2, d_col2, u_dark_mode);
    vec3 col3 = mix(l_col3, d_col3, u_dark_mode);
    vec3 col4 = mix(l_col4, d_col4, u_dark_mode);

    vec3 color = mix(col1, col2, smoothstep(0.0, 0.25, f));
    color = mix(color, col3, smoothstep(0.25, 0.55, f));
    color = mix(color, col4, smoothstep(0.55, u_color_w, f));

    float grid = smoothstep(0.45, 0.5, abs(fract(f * 10.0) - 0.5)) * u_grid_width;
    float grid_line = smoothstep(0.3, 0.5, grid);
    vec3 finalColor = color - grid_line * 0.15;

    gl_FragColor = vec4(finalColor, 1.0);
  }
`;

export default function ShaderCanvas() {
  const { theme } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const uniformsRef = useRef<Record<string, THREE.IUniform> | null>(null);
  const frameRef = useRef<number>(0);
  const startTimeRef = useRef<number>(Date.now());

  // React to theme changes
  useEffect(() => {
    if (uniformsRef.current) {
      uniformsRef.current.u_dark_mode.value = theme === 'dark' ? 1.0 : 0.0;
    }
  }, [theme]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: false });

    const w = container.clientWidth;
    const h = container.clientHeight;
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const uniforms: Record<string, THREE.IUniform> = {
      u_time: { value: 0 },
      u_res: { value: new THREE.Vector2(w * Math.min(window.devicePixelRatio, 2), h * Math.min(window.devicePixelRatio, 2)) },
      u_scale: { value: 2.5 },
      u_speed: { value: 0.05 },
      u_warp: { value: 0.45 },
      u_grid_width: { value: 0.4 },
      u_color_w: { value: 0.8 },
      u_dark_mode: { value: theme === 'dark' ? 1.0 : 0.0 },
    };
    uniformsRef.current = uniforms;

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
    });

    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const animate = () => {
      uniforms.u_time.value = (Date.now() - startTimeRef.current) * 0.001;
      renderer.render(scene, camera);
      frameRef.current = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const nw = container.clientWidth;
      const nh = container.clientHeight;
      renderer.setSize(nw, nh);
      const dpr = Math.min(window.devicePixelRatio, 2);
      uniforms.u_res.value.set(nw * dpr, nh * dpr);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(frameRef.current);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
      }}
    />
  );
}
