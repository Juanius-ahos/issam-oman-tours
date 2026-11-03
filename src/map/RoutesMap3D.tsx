/* 3D relief map of northern Oman with the four routes drawing themselves.
   Loaded with a dynamic import only on capable desktops (lib/viewport.ts
   canRender3D), so phones and Lighthouse never download three.js.

   Scroll drives it through a mutable ref (no React re-render per frame):
     progress.current = 0..1 across the section
   Rendering is on demand and stops once the camera has settled. */
import { useMemo, useRef, type MutableRefObject } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { tourSlugs, type TourSlug } from '../config';
import { tourGeo, type LngLat } from '../data/tours';
import { BOUNDS, elevation, project, sandWeight, W, H } from './geo';

const SCALE = 1 / 100; // SVG units to world units
const LIFT = 0.42; // km to world units
const css = (name: string) => {
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim().split(/\s+/).map(Number);
  // Tokens are sRGB; three works in linear space.
  return new THREE.Color().setRGB(v[0] / 255, v[1] / 255, v[2] / 255, THREE.SRGBColorSpace);
};

function toWorld(p: LngLat, extra = 0): THREE.Vector3 {
  const [x, y] = project(p);
  return new THREE.Vector3((x - W / 2) * SCALE, Math.max(elevation(p), 0) * LIFT + extra, (y - H / 2) * SCALE);
}

function Terrain() {
  const geom = useMemo(() => {
    const seg = [240, Math.round((240 * H) / W)];
    const g = new THREE.PlaneGeometry(W * SCALE, H * SCALE, seg[0], seg[1]);
    g.rotateX(-Math.PI / 2);
    const pos = g.attributes.position as THREE.BufferAttribute;
    const colors = new Float32Array(pos.count * 3);
    const sand = css('--sand');
    const ink = css('--ink');
    const amber = css('--amber');
    const deep = css('--accent-deep');
    const c = new THREE.Color();
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i) / SCALE + W / 2;
      const z = pos.getZ(i) / SCALE + H / 2;
      const lng = BOUNDS.west + (x / W) * (BOUNDS.east - BOUNDS.west);
      const lat = BOUNDS.north - (z / H) * (BOUNDS.north - BOUNDS.south);
      const h = elevation([lng, lat]);
      pos.setY(i, h * LIFT);
      if (h < 0) c.copy(deep).lerp(sand, 0.35);
      else c.copy(sand).lerp(amber, 0.12 + sandWeight([lng, lat]) * 0.45).lerp(ink, Math.min(0.62, 0.08 + h * 0.26));
      colors.set([c.r, c.g, c.b], i * 3);
    }
    g.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    g.computeVertexNormals();
    return g;
  }, []);
  return (
    <mesh geometry={geom} receiveShadow>
      <meshStandardMaterial vertexColors roughness={0.95} metalness={0} flatShading />
    </mesh>
  );
}

function Sea() {
  const color = useMemo(() => css('--accent'), []);
  return (
    <mesh rotation-x={-Math.PI / 2} position-y={-0.01}>
      <planeGeometry args={[W * SCALE * 3, H * SCALE * 3]} />
      <meshStandardMaterial color={color} transparent opacity={0.55} roughness={0.4} />
    </mesh>
  );
}

const hueVar: Record<string, string> = { accent: '--accent', deep: '--accent-deep', amber: '--amber', ink: '--ink' };

function Route({ slug, index, progress }: { slug: TourSlug; index: number; progress: MutableRefObject<number> }) {
  const g = tourGeo[slug];
  const { geometry, total, end } = useMemo(() => {
    // Sample a bowed path between stops and drape it over the terrain.
    const pts: THREE.Vector3[] = [];
    const ll = [g.start, ...g.stops];
    for (let i = 1; i < ll.length; i++) {
      const a = ll[i - 1];
      const b = ll[i];
      for (let t = 0; t < 1; t += 0.05) {
        const bow = Math.sin(t * Math.PI) * 0.06;
        const p: LngLat = [a[0] + (b[0] - a[0]) * t + (b[1] - a[1]) * bow, a[1] + (b[1] - a[1]) * t - (b[0] - a[0]) * bow];
        pts.push(toWorld(p, 0.05));
      }
    }
    pts.push(toWorld(ll[ll.length - 1], 0.05));
    const curve = new THREE.CatmullRomCurve3(pts);
    const geo = new THREE.TubeGeometry(curve, pts.length * 3, 0.028, 8, false);
    return { geometry: geo, total: geo.index!.count, end: pts[pts.length - 1] };
  }, [g]);
  const color = useMemo(() => css(hueVar[g.hue]), [g.hue]);
  const last = useRef(-1);
  const { invalidate } = useThree();

  useFrame(() => {
    const p = progress.current;
    const local = THREE.MathUtils.clamp((p - index / 4) * 4 * 1.25, 0, 1);
    if (Math.abs(local - last.current) > 0.001) {
      last.current = local;
      geometry.setDrawRange(0, Math.floor((total * local) / 3) * 3);
      invalidate();
    }
  });

  return (
    <group>
      <mesh geometry={geometry}>
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.35} roughness={0.5} />
      </mesh>
      {g.stops.map((s, i) => (
        <mesh key={i} position={toWorld(s, 0.06)}>
          <sphereGeometry args={[0.055, 16, 16]} />
          <meshStandardMaterial color="#fff" />
        </mesh>
      ))}
      <Label text={g.index} position={[end.x, end.y + 0.3, end.z]} />
    </group>
  );
}

/** Numbered tag as a sprite (canvas texture), so no HTML overlay library is needed. */
function Label({ text, position }: { text: string; position: [number, number, number] }) {
  const map = useMemo(() => {
    const c = document.createElement('canvas');
    c.width = 128;
    c.height = 88;
    const ctx = c.getContext('2d')!;
    ctx.fillStyle = '#1B1A18';
    ctx.beginPath();
    ctx.roundRect(4, 4, 120, 80, 22);
    ctx.fill();
    ctx.fillStyle = '#F3EADF';
    ctx.font = '900 44px "Archivo Variable", Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, 64, 46);
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, [text]);
  return (
    <sprite position={position} scale={[0.36, 0.25, 1]}>
      <spriteMaterial map={map} depthTest={false} />
    </sprite>
  );
}

const AIM_OFFSET = new THREE.Vector3(0, 0, 1.9);

/** Camera flies to the centre of the active tour. */
function Rig({ progress }: { progress: MutableRefObject<number> }) {
  const { camera, invalidate } = useThree();
  const targets = useMemo(
    () =>
      tourSlugs.map((slug) => {
        const pts = [tourGeo[slug].start, ...tourGeo[slug].stops].map((p) => toWorld(p));
        const c = pts.reduce((a, b) => a.add(b), new THREE.Vector3()).divideScalar(pts.length);
        return c;
      }),
    [],
  );
  const overview = useMemo(() => new THREE.Vector3(0.6, 0, 0.4), []);
  const look = useRef(overview.clone());
  const want = useMemo(() => new THREE.Vector3(), []);
  const pos = useMemo(() => new THREE.Vector3(), []);
  const aim = useMemo(() => new THREE.Vector3(), []);

  useFrame((_, dt) => {
    const p = progress.current;
    const f = THREE.MathUtils.clamp(p * 4 - 0.15, 0, 3.999);
    const i = Math.floor(f);
    const t = THREE.MathUtils.smoothstep(f - i, 0.55, 1);
    want.copy(targets[i]).lerp(targets[Math.min(i + 1, 3)], t);
    if (p < 0.04) want.lerp(overview, 1 - p / 0.04);
    const k = 1 - Math.exp(-dt * 3);
    look.current.lerp(want, k);
    // Looking at a point in front of the target lifts the route into the top
    // half of the frame, clear of the card strip.
    pos.set(look.current.x - 1.2, 7.6, look.current.z + 7.2);
    camera.position.lerp(pos, k);
    aim.copy(look.current).add(AIM_OFFSET);
    camera.lookAt(aim);
    if (camera.position.distanceTo(pos) > 0.002 || look.current.distanceTo(want) > 0.002) invalidate();
  });
  return null;
}

export default function RoutesMap3D({ progress, className = '' }: { progress: MutableRefObject<number>; className?: string }) {
  return (
    <Canvas
      className={className}
      frameloop="demand"
      dpr={[1, 1.5]}
      camera={{ fov: 38, position: [-1, 6, 6], near: 0.1, far: 100 }}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
      aria-hidden="true"
    >
      <hemisphereLight args={['#fff4e6', '#8a7a64', 0.9]} />
      <directionalLight position={[-5, 5, 2]} intensity={1.5} />
      <Terrain />
      <Sea />
      {tourSlugs.map((slug, i) => (
        <Route key={slug} slug={slug} index={i} progress={progress} />
      ))}
      <Rig progress={progress} />
    </Canvas>
  );
}
