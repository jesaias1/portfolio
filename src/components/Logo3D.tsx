'use client';

import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import {
  Clone,
  Edges,
  Float,
  useGLTF,
} from '@react-three/drei';
import type { EdgesRef } from '@react-three/drei';
import * as THREE from 'three';

const MODEL_PATH = '/logo3d.glb';
const BASE_Y_ROTATION = Math.PI / 2;

useGLTF.preload(MODEL_PATH);

type MotionInput = React.RefObject<{ x: number; y: number; active: boolean }>;

function useInteractionProfile() {
  const [profile, setProfile] = useState(() => {
    if (typeof window === 'undefined') {
      return { isLowEnd: false, isMobile: false, prefersReducedMotion: false };
    }
    const isMobileUA = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const isMobileSize = window.innerWidth <= 768;
    const isMobile = isMobileUA || isMobileSize;
    const hw = navigator.hardwareConcurrency || 8;
    return {
      isLowEnd: isMobile || hw <= 4,
      isMobile,
      prefersReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    };
  });

  useEffect(() => {
    const mobileQuery = window.matchMedia('(max-width: 768px)');
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const isMobileUA = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    const update = () => {
      const isMobile = isMobileUA || mobileQuery.matches;
      const hw = navigator.hardwareConcurrency || 8;
      setProfile({
        isLowEnd: isMobile || hw <= 4,
        isMobile,
        prefersReducedMotion: motionQuery.matches,
      });
    };

    mobileQuery.addEventListener('change', update);
    motionQuery.addEventListener('change', update);
    return () => {
      mobileQuery.removeEventListener('change', update);
      motionQuery.removeEventListener('change', update);
    };
  }, []);

  return profile;
}

function LogoMaterial({ isLowEnd }: { isLowEnd: boolean }) {
  return (
    <meshPhysicalMaterial
      color={isLowEnd ? '#c9f7ff' : '#d2fbff'}
      roughness={isLowEnd ? 0.18 : 0.13}
      metalness={0}
      clearcoat={1}
      clearcoatRoughness={isLowEnd ? 0.08 : 0.05}
      transmission={isLowEnd ? 0.52 : 0.58}
      transparent
      opacity={0.94}
      thickness={isLowEnd ? 0.72 : 0.86}
      ior={1.44}
      reflectivity={0.58}
      specularIntensity={0.85}
      specularColor="#dffbff"
      envMapIntensity={isLowEnd ? 1.55 : 2}
      attenuationColor="#a8f2ff"
      attenuationDistance={2.35}
      side={THREE.FrontSide}
    />
  );
}

function LogoEdgeChase({ pulseToken }: { pulseToken: number }) {
  const edgeRef = useRef<EdgesRef>(null);
  const pulse = useRef(0);

  useEffect(() => {
    if (pulseToken <= 0) return;
    pulse.current = 1;
    if (!edgeRef.current) return;
    edgeRef.current.visible = true;
    edgeRef.current.material.dashOffset = 0;
  }, [pulseToken]);

  useFrame((_, delta) => {
    if (pulse.current <= 0) return;

    pulse.current = Math.max(0, pulse.current - delta * 0.72);
    const progress = 1 - pulse.current;
    const envelope = Math.sin(progress * Math.PI);
    const edge = edgeRef.current;

    if (!edge) return;
    edge.material.opacity = envelope * 0.88;
    edge.material.dashOffset = -progress * 6.2;
    edge.material.linewidth = 1.1 + envelope * 0.75;
    edge.visible = pulse.current > 0;
  });

  return (
    <Edges
      ref={edgeRef}
      threshold={18}
      color="#b9f5ff"
      lineWidth={1.1}
      dashed
      dashScale={4.5}
      dashSize={0.16}
      gapSize={0.92}
      transparent
      opacity={0}
      depthTest={false}
      toneMapped={false}
      renderOrder={40}
    />
  );
}

function CursorGlow({
  mousePos,
  isLowEnd,
  prefersReducedMotion,
  isActive,
  pulseToken,
}: {
  mousePos: MotionInput;
  isLowEnd: boolean;
  prefersReducedMotion: boolean;
  isActive: boolean;
  pulseToken: number;
}) {
  const spriteRef = useRef<THREE.Sprite>(null);
  const materialRef = useRef<THREE.SpriteMaterial>(null);
  const lightRef = useRef<THREE.PointLight>(null);
  const pulse = useRef(0);

  useEffect(() => {
    if (pulseToken > 0 && !prefersReducedMotion) pulse.current = 1;
  }, [prefersReducedMotion, pulseToken]);

  const glowTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const context = canvas.getContext('2d');

    if (context) {
      const gradient = context.createRadialGradient(128, 128, 0, 128, 128, 128);
      gradient.addColorStop(0, 'rgba(77, 219, 255, 0.95)');
      gradient.addColorStop(0.18, 'rgba(77, 219, 255, 0.38)');
      gradient.addColorStop(0.55, 'rgba(77, 219, 255, 0.12)');
      gradient.addColorStop(1, 'rgba(77, 219, 255, 0)');
      context.fillStyle = gradient;
      context.fillRect(0, 0, 256, 256);
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }, []);

  useEffect(() => {
    return () => glowTexture.dispose();
  }, [glowTexture]);

  useFrame((_, delta) => {
    if (!spriteRef.current || !materialRef.current || !lightRef.current) return;

    pulse.current = Math.max(0, pulse.current - delta * 1.15);

    const distance = mousePos.current.active
      ? Math.hypot(mousePos.current.x * 0.85, mousePos.current.y * 1.15)
      : 1.4;
    const proximity = THREE.MathUtils.clamp(1 - distance / 1.15, 0, 1);
    const motionScale = prefersReducedMotion ? 0 : 1;

    const activeLift = isActive && !prefersReducedMotion ? 1 : 0;
    const targetOpacity = 0.12 + proximity * (isLowEnd ? 0.14 : 0.28) * motionScale + activeLift * 0.05 + pulse.current * 0.26;
    const targetLight = 0.35 + proximity * (isLowEnd ? 0.95 : 1.65) * motionScale + activeLift * 0.35 + pulse.current * 2.05;
    const targetScale = 4.85 + proximity * 0.7 + activeLift * 0.14 + pulse.current * 0.82;

    materialRef.current.opacity = THREE.MathUtils.lerp(
      materialRef.current.opacity,
      targetOpacity,
      0.08
    );
    lightRef.current.intensity = THREE.MathUtils.lerp(
      lightRef.current.intensity,
      targetLight,
      0.08
    );
    spriteRef.current.scale.x = THREE.MathUtils.lerp(
      spriteRef.current.scale.x,
      targetScale,
      0.08
    );
    spriteRef.current.scale.y = THREE.MathUtils.lerp(
      spriteRef.current.scale.y,
      targetScale * 0.48,
      0.08
    );
  });

  return (
    <>
      <sprite ref={spriteRef} position={[0, 0.02, -0.7]} scale={[4.85, 2.32, 1]}>
        <spriteMaterial
          ref={materialRef}
          map={glowTexture}
          color="#4ddbff"
          transparent
          opacity={0.12}
          depthWrite={false}
          depthTest={false}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </sprite>
      <pointLight
        ref={lightRef}
        position={[0.25, 0.2, 2.4]}
        color="#4ddbff"
        intensity={0.35}
        distance={6}
        decay={2}
      />
    </>
  );
}

function LogoModel({
  mousePos,
  isLowEnd,
  isMobile,
  prefersReducedMotion,
  isActive,
  pulseToken,
}: {
  mousePos: MotionInput;
  isLowEnd: boolean;
  isMobile: boolean;
  prefersReducedMotion: boolean;
  isActive: boolean;
  pulseToken: number;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const pulse = useRef(0);
  const { scene } = useGLTF(MODEL_PATH);

  useEffect(() => {
    if (pulseToken > 0 && !prefersReducedMotion) pulse.current = 1;
  }, [prefersReducedMotion, pulseToken]);

  const preparedScene = useMemo(() => {
    const clone = scene.clone(true);

    clone.traverse((object) => {
      if (!(object instanceof THREE.Mesh)) return;

      object.geometry = object.geometry.clone();
      object.geometry.computeVertexNormals();
      object.castShadow = true;
      object.receiveShadow = true;
    });

    return clone;
  }, [scene]);

  const { center, scaleFactor } = useMemo(() => {
    const box = new THREE.Box3().setFromObject(preparedScene);
    const size = box.getSize(new THREE.Vector3());
    const c = box.getCenter(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    // Smaller scale on mobile so logo fits within narrow viewports
    return { center: c, scaleFactor: (isMobile ? 1.72 : 3.2) / maxDim };
  }, [preparedScene, isMobile]);

  useFrame((_, delta) => {
    if (!groupRef.current || prefersReducedMotion) return;

    pulse.current = Math.max(0, pulse.current - delta * 1.35);
    const pulseArc = Math.sin((1 - pulse.current) * Math.PI);

    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      BASE_Y_ROTATION + mousePos.current.x * 0.3 + pulse.current * 0.11,
      0.05
    );
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      mousePos.current.y * 0.2,
      0.05
    );
    groupRef.current.rotation.z = THREE.MathUtils.lerp(
      groupRef.current.rotation.z,
      -pulseArc * 0.04,
      0.09
    );
    groupRef.current.position.z = THREE.MathUtils.lerp(
      groupRef.current.position.z,
      pulseArc * 0.12,
      0.09
    );
    const targetScale = 1 + (isActive ? 0.008 : 0) + pulse.current * 0.045;
    const nextScale = THREE.MathUtils.lerp(groupRef.current.scale.x, targetScale, 0.09);
    groupRef.current.scale.setScalar(nextScale);
  });

  const model = (
    // Outer group: rotation only — world-space center stays at origin regardless of rotation angle
    <group ref={groupRef} rotation={[0, BASE_Y_ROTATION, 0]}>
      {/* Inner group: centering + scale — offsets cancel cleanly before rotation is applied */}
      <group
        scale={scaleFactor}
        position={[
          -center.x * scaleFactor,
          (-center.y * scaleFactor) + (isMobile ? 0.08 : 0),
          -center.z * scaleFactor,
        ]}
      >
        <Clone
          object={preparedScene}
          deep="geometriesOnly"
          castShadow
          receiveShadow
          inject={(object) =>
            object instanceof THREE.Mesh ? (
              <>
                <LogoMaterial isLowEnd={isLowEnd} />
                {pulseToken > 0 && !prefersReducedMotion ? (
                  <LogoEdgeChase pulseToken={pulseToken} />
                ) : null}
              </>
            ) : null
          }
        />
      </group>
    </group>
  );

  if (prefersReducedMotion) return model;

  return (
    <Float
      speed={1.05}
      rotationIntensity={isLowEnd ? 0.1 : 0.18}
      floatIntensity={isLowEnd ? 0.14 : 0.28}
      floatingRange={isLowEnd ? [-0.008, 0.008] : [-0.018, 0.018]}
    >
      {model}
    </Float>
  );
}

function LogoScene({
  mousePos,
  isLowEnd,
  isMobile,
  prefersReducedMotion,
  isActive,
  pulseToken,
}: {
  mousePos: MotionInput;
  isLowEnd: boolean;
  isMobile: boolean;
  prefersReducedMotion: boolean;
  isActive: boolean;
  pulseToken: number;
}) {
  return (
    <>
      <ambientLight intensity={0.12} color="#f6feff" />
      <directionalLight position={[4, 5, 5]} intensity={0.72} color="#ffffff" />
      <directionalLight position={[-4, 2, 3]} intensity={0.28} color="#d8f7ff" />
      <pointLight position={[0, 2.5, 3]} intensity={0.52} color="#ffffff" distance={12} />
      <pointLight position={[0, -3, 2]} intensity={0.18} color="#80eaff" distance={10} />

      <hemisphereLight args={['#ecfdff', '#050708', isLowEnd ? 0.56 : 0.72]} />
      <CursorGlow
        mousePos={mousePos}
        isLowEnd={isLowEnd}
        prefersReducedMotion={prefersReducedMotion}
        isActive={isActive}
        pulseToken={pulseToken}
      />

      <LogoModel
        mousePos={mousePos}
        isLowEnd={isLowEnd}
        isMobile={isMobile}
        prefersReducedMotion={prefersReducedMotion}
        isActive={isActive}
        pulseToken={pulseToken}
      />
    </>
  );
}

function LoadingFallback({ prefersReducedMotion }: { prefersReducedMotion: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (meshRef.current && !prefersReducedMotion) {
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

export default function Logo3D({
  className = '',
  isActive = false,
  pulseToken = 0,
}: {
  className?: string;
  isActive?: boolean;
  pulseToken?: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mousePos = useRef({ x: 0, y: 0, active: false });
  const orientationBase = useRef<{ beta: number; gamma: number } | null>(null);
  const orientationPermissionRequested = useRef(false);
  const [isCanvasActive, setIsCanvasActive] = useState(true);
  const { isLowEnd, isMobile, prefersReducedMotion } = useInteractionProfile();

  const updatePointer = useCallback((clientX: number, clientY: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    mousePos.current.x = THREE.MathUtils.clamp(
      ((clientX - rect.left) / rect.width - 0.5) * 2,
      -1,
      1
    );
    mousePos.current.y = THREE.MathUtils.clamp(
      -((clientY - rect.top) / rect.height - 0.5) * 2,
      -1,
      1
    );
    mousePos.current.active = true;
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let isIntersecting = true;
    const sync = () => setIsCanvasActive(isIntersecting && !document.hidden);
    const observer = new IntersectionObserver(
      ([entry]) => {
        isIntersecting = entry.isIntersecting;
        sync();
      },
      { rootMargin: '120px' }
    );

    observer.observe(container);
    document.addEventListener('visibilitychange', sync);
    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', sync);
    };
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) return;

    const handleMouseMove = (e: MouseEvent) => updatePointer(e.clientX, e.clientY);
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches[0]) updatePointer(e.touches[0].clientX, e.touches[0].clientY);
    };
    const handleMouseLeave = () => {
      mousePos.current.active = false;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseout', handleMouseLeave);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    // Gyroscope: map device tilt to logo rotation
    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (e.gamma === null || e.beta === null) return;
      if (!orientationBase.current) {
        orientationBase.current = { beta: e.beta, gamma: e.gamma };
      }

      const gammaDelta = e.gamma - orientationBase.current.gamma;
      const betaDelta = e.beta - orientationBase.current.beta;

      mousePos.current.x = THREE.MathUtils.clamp(gammaDelta / 28, -1, 1);
      mousePos.current.y = THREE.MathUtils.clamp(-betaDelta / 28, -1, 1);
      mousePos.current.active = true;
    };

    const resetOrientationBase = () => {
      orientationBase.current = null;
    };

    // iOS 13+ requires explicit permission from a user gesture; Android is automatic
    const tryGyro = () => {
      if (orientationPermissionRequested.current) return;
      orientationPermissionRequested.current = true;

      const DOE = DeviceOrientationEvent as unknown as { requestPermission?: () => Promise<string> };
      if (typeof DOE.requestPermission === 'function') {
        DOE.requestPermission()
          .then((state) => {
            if (state === 'granted') window.addEventListener('deviceorientation', handleOrientation);
          })
          .catch(() => {});
      } else {
        window.addEventListener('deviceorientation', handleOrientation);
      }
    };

    window.addEventListener('touchstart', tryGyro, { once: true });
    window.addEventListener('orientationchange', resetOrientationBase);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseout', handleMouseLeave);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('deviceorientation', handleOrientation);
      window.removeEventListener('touchstart', tryGyro);
      window.removeEventListener('orientationchange', resetOrientationBase);
    };
  }, [prefersReducedMotion, updatePointer]);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={className}
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 20,
        contain: 'layout paint size',
        willChange: 'transform, opacity',
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 5.8], fov: 42 }}
        frameloop={isCanvasActive ? 'always' : 'never'}
        dpr={isMobile ? [1.25, 1.5] : [1.5, 2]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: isMobile ? 'low-power' : 'high-performance',
        }}
        onCreated={({ gl }) => {
          gl.outputColorSpace = THREE.SRGBColorSpace;
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.08;
        }}
        style={{ background: 'transparent', pointerEvents: 'none' }}
      >
        <Suspense fallback={<LoadingFallback prefersReducedMotion={prefersReducedMotion} />}>
          <LogoScene
            mousePos={mousePos}
            isLowEnd={isLowEnd}
            isMobile={isMobile}
            prefersReducedMotion={prefersReducedMotion}
            isActive={isActive}
            pulseToken={pulseToken}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
