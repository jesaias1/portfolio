'use client';

import { Suspense, useRef, useMemo, useCallback, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import {
  useGLTF,
  Environment,
  Float,
} from '@react-three/drei';
import * as THREE from 'three';

/* ─── constants ─── */
const MODEL_PATH = '/logo3d.glb';

/* ─── preload the model so it's ready instantly ─── */
useGLTF.preload(MODEL_PATH);

/* ─── the actual 3D mesh with glass material ─── */
function LogoModel({ mousePos }: { mousePos: React.RefObject<{ x: number; y: number }> }) {
  const groupRef = useRef<THREE.Group>(null!);
  const { scene } = useGLTF(MODEL_PATH);

  // Clone the scene and apply glass material
  const clonedScene = useMemo(() => {
    const clone = scene.clone(true);

    // Create the glass material
    const glassMaterial = new THREE.MeshPhysicalMaterial({
      transmission: 0.92,
      roughness: 0.08,
      thickness: 1.5,
      ior: 1.45,
      color: new THREE.Color('#8eeaff'),
      emissive: new THREE.Color('#0d3d4d'),
      emissiveIntensity: 0.2,
      transparent: true,
      opacity: 0.95,
      side: THREE.DoubleSide,
      envMapIntensity: 1.5,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
      metalness: 0.0,
      attenuationColor: new THREE.Color('#4ddbff'),
      attenuationDistance: 2.0,
    });

    // Apply to all meshes in the scene
    clone.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.material = glassMaterial;
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

    return clone;
  }, [scene]);

  // Compute bounding box to center + scale the model
  const { center, scaleFactor } = useMemo(() => {
    const box = new THREE.Box3().setFromObject(clonedScene);
    const size = box.getSize(new THREE.Vector3());
    const c = box.getCenter(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    // Scale to fit roughly 5.5 units wide to make it appear larger
    const sf = 5.5 / maxDim;
    return { center: c, scaleFactor: sf };
  }, [clonedScene]);

  // Smooth rotation tracking — base rotation faces logo toward camera
  const BASE_Y_ROTATION = Math.PI / 2; // 90° to face the flat side at camera
  const currentRotation = useRef({ x: 0, y: BASE_Y_ROTATION });

  useFrame((_, delta) => {
    if (!groupRef.current || !mousePos.current) return;

    // Target rotation based on mouse or gyro (increased ranges for more noticeable effect)
    const targetX = mousePos.current.y * 0.4; // Up/down tilt
    const targetY = BASE_Y_ROTATION + mousePos.current.x * 0.6; // Left/right tilt

    // Smooth lerp
    const lerpFactor = 1 - Math.pow(0.05, delta);
    currentRotation.current.x += (targetX - currentRotation.current.x) * lerpFactor;
    currentRotation.current.y += (targetY - currentRotation.current.y) * lerpFactor;

    groupRef.current.rotation.x = currentRotation.current.x;
    groupRef.current.rotation.y = currentRotation.current.y;
  });

  return (
    <Float
      speed={1.5}
      rotationIntensity={0.3}
      floatIntensity={0.5}
      floatingRange={[-0.05, 0.05]}
    >
      <group
        ref={groupRef}
        scale={scaleFactor}
        position={[
          -center.x * scaleFactor,
          -center.y * scaleFactor,
          -center.z * scaleFactor,
        ]}
        rotation={[0, BASE_Y_ROTATION, 0]}
      >
        <primitive object={clonedScene} />
      </group>
    </Float>
  );
}

/* ─── Scene setup with lights + environment ─── */
function LogoScene({ mousePos }: { mousePos: React.RefObject<{ x: number; y: number }> }) {
  return (
    <>
      {/* Ambient base light */}
      <ambientLight intensity={0.4} color="#ffffff" />

      {/* Key light — cyan accent from top-right */}
      <directionalLight
        position={[5, 5, 5]}
        intensity={2}
        color="#4ddbff"
      />

      {/* Fill light from left */}
      <directionalLight
        position={[-3, 2, 4]}
        intensity={0.8}
        color="#ffffff"
      />

      {/* Rim light from behind */}
      <pointLight
        position={[0, 0, -5]}
        intensity={1.2}
        color="#4ddbff"
        distance={15}
      />

      {/* Bottom accent glow */}
      <pointLight
        position={[0, -3, 2]}
        intensity={0.6}
        color="#0d6b8a"
        distance={10}
      />

      {/* Environment for realistic glass reflections */}
      <Environment preset="city" environmentIntensity={0.5} />

      {/* The 3D logo */}
      <LogoModel mousePos={mousePos} />
    </>
  );
}

/* ─── Loading fallback (shown while GLB loads) ─── */
function LoadingFallback() {
  const meshRef = useRef<THREE.Mesh>(null!);
  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 2;
    }
  });
  return (
    <mesh ref={meshRef}>
      <octahedronGeometry args={[0.5, 0]} />
      <meshStandardMaterial color="#4ddbff" wireframe transparent opacity={0.4} />
    </mesh>
  );
}

/* ─── Main exported component ─── */
export default function Logo3D({ className = '' }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mousePos = useRef({ x: 0, y: 0 });

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    mousePos.current.x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    mousePos.current.y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
  }, []);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!containerRef.current || !e.touches[0]) return;
    const rect = containerRef.current.getBoundingClientRect();
    mousePos.current.x = ((e.touches[0].clientX - rect.left) / rect.width - 0.5) * 2;
    mousePos.current.y = ((e.touches[0].clientY - rect.top) / rect.height - 0.5) * 2;
  }, []);

  // Device orientation for mobile tilt effect
  const handleOrientation = useCallback((e: DeviceOrientationEvent) => {
    // Decrease the divisor to make smaller physical tilts result in larger model rotations
    // e.gamma is -90 to 90 (left/right). e.beta is -180 to 180 (front/back).
    const gamma = (e.gamma || 0) / 20; // 20 degrees = full rotation limits
    const beta = ((e.beta || 0) - 45) / 20; // Offset 45 degrees for standard holding angle
    mousePos.current.x = Math.max(-1, Math.min(1, gamma));
    mousePos.current.y = Math.max(-1, Math.min(1, beta));
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('deviceorientation', handleOrientation);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, [handleMouseMove, handleTouchMove, handleOrientation]);

  return (
    <div
      ref={containerRef}
      className={`relative ${className}`}
      style={{ width: '100%', height: '100%' }}
    >
      <Canvas
        camera={{ position: [0, 0, 5.5], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={<LoadingFallback />}>
          <LogoScene mousePos={mousePos} />
        </Suspense>
      </Canvas>

      {/* Glow overlay effect */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(77, 219, 255, 0.06) 0%, transparent 70%)',
        }}
      />
    </div>
  );
}
