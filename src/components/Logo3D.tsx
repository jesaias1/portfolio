'use client';

import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import {
  Clone,
  Environment,
  Float,
  useGLTF,
  useTexture,
} from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { Leva, useControls } from 'leva';
import * as THREE from 'three';

const MODEL_PATH = '/logo3d.glb';
const BASE_Y_ROTATION = Math.PI / 2;
const ENABLE_LEVA_PANEL = false;


const BLOOM_DEFAULTS = {
  intensity: 0.6,
  luminanceThreshold: 0.2,
  luminanceSmoothing: 0.9,
};

useGLTF.preload(MODEL_PATH);

type MotionInput = React.RefObject<{ x: number; y: number }>;

function useInteractionProfile() {
  const [profile, setProfile] = useState(() => {
    if (typeof window === 'undefined') {
      return { isLowEnd: false, isMobile: false, prefersReducedMotion: false, showLeva: false };
    }
    const isMobileUA = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const isMobileSize = window.innerWidth <= 768;
    const isMobile = isMobileUA || isMobileSize;
    const hw = navigator.hardwareConcurrency || 8;
    return {
      isLowEnd: isMobile || hw <= 4,
      isMobile,
      prefersReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
      showLeva: false,
    };
  });

  useEffect(() => {
    const mobileQuery = window.matchMedia('(max-width: 768px)');
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const isMobileUA = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    const update = () => {
      const isMobile = isMobileUA || mobileQuery.matches;
      const hw = navigator.hardwareConcurrency || 8;
      const params = new URLSearchParams(window.location.search);
      setProfile({
        isLowEnd: isMobile || hw <= 4,
        isMobile,
        prefersReducedMotion: motionQuery.matches,
        showLeva: ENABLE_LEVA_PANEL && process.env.NODE_ENV === 'development' && params.has('debug'),
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
  if (isLowEnd) {
    return (
      <meshPhysicalMaterial
        color="#4ec8f0"
        roughness={0.1}
        metalness={0}
        clearcoat={1}
        clearcoatRoughness={0.08}
        transmission={0.25}
        thickness={1.2}
        ior={1.45}
        envMapIntensity={2}
        attenuationColor="#1878b8"
        attenuationDistance={4}
        side={THREE.FrontSide}
      />
    );
  }

  return (
    <meshPhysicalMaterial
      color="#4ec8f0"
      roughness={0}
      metalness={0}
      clearcoat={1}
      clearcoatRoughness={0}
      transmission={0.15}
      thickness={1.2}
      ior={1.5}
      envMapIntensity={5}
      attenuationColor="#1070c0"
      attenuationDistance={3}
      side={THREE.FrontSide}
    />
  );
}

function LogoModel({
  mousePos,
  isLowEnd,
  isMobile,
  prefersReducedMotion,
}: {
  mousePos: MotionInput;
  isLowEnd: boolean;
  isMobile: boolean;
  prefersReducedMotion: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF(MODEL_PATH);

  const { center, scaleFactor } = useMemo(() => {
    const box = new THREE.Box3().setFromObject(scene);
    const size = box.getSize(new THREE.Vector3());
    const c = box.getCenter(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    // Smaller scale on mobile so logo fits within narrow viewports
    return { center: c, scaleFactor: (isMobile ? 2.8 : 4.2) / maxDim };
  }, [scene, isMobile]);

  useFrame(() => {
    if (!groupRef.current || prefersReducedMotion) return;

    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      BASE_Y_ROTATION + mousePos.current.x * 0.3,
      0.05
    );
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      mousePos.current.y * 0.2,
      0.05
    );
  });

  const model = (
    // Outer group: rotation only — world-space center stays at origin regardless of rotation angle
    <group ref={groupRef} rotation={[0, BASE_Y_ROTATION, 0]}>
      {/* Inner group: centering + scale — offsets cancel cleanly before rotation is applied */}
      <group
        scale={scaleFactor}
        position={[
          -center.x * scaleFactor,
          (-center.y * scaleFactor) + 0.25,
          -center.z * scaleFactor,
        ]}
      >
        <Clone
          object={scene}
          deep="geometriesOnly"
          castShadow
          receiveShadow
          inject={(object) =>
            object instanceof THREE.Mesh ? (
              <LogoMaterial isLowEnd={isLowEnd} />
            ) : null
          }
        />
      </group>
    </group>
  );

  if (prefersReducedMotion) return model;

  return (
    <Float
      speed={1.5}
      rotationIntensity={isLowEnd ? 0.2 : 0.4}
      floatIntensity={isLowEnd ? 0.3 : 0.6}
      floatingRange={isLowEnd ? [-0.015, 0.015] : [-0.03, 0.03]}
    >
      {model}
    </Float>
  );
}

function PostProcessing({
  isLowEnd,
  bloomProps,
}: {
  isLowEnd: boolean;
  bloomProps: typeof BLOOM_DEFAULTS;
}) {
  if (isLowEnd) return null;

  return (
    <EffectComposer multisampling={0} enableNormalPass={false} autoClear={false}>
      <Bloom
        intensity={bloomProps.intensity}
        luminanceThreshold={bloomProps.luminanceThreshold}
        luminanceSmoothing={bloomProps.luminanceSmoothing}
        mipmapBlur
      />
    </EffectComposer>
  );
}

// PMREM-processes the PNG for correct IBL specular reflections.
// Clones the texture first so the mapping change doesn't affect the background sphere.
function ImageEnvironment() {
  const { scene, gl } = useThree();
  const texture = useTexture('/bg-environment.png');

  useEffect(() => {
    const pmrem = new THREE.PMREMGenerator(gl);
    pmrem.compileEquirectangularShader();
    const clone = texture.clone();
    clone.mapping = THREE.EquirectangularReflectionMapping;
    clone.needsUpdate = true;
    const envMap = pmrem.fromEquirectangular(clone).texture;
    scene.environment = envMap;
    pmrem.dispose();
    clone.dispose();
    return () => {
      scene.environment = null;
      envMap.dispose();
    };
  }, [texture, scene, gl]);

  return null;
}


function SceneEnvironment({ isLowEnd }: { isLowEnd: boolean }) {
  if (isLowEnd) return <Environment preset="night" environmentIntensity={1.5} />;
  return <ImageEnvironment />;
}

function LogoScene({
  mousePos,
  isLowEnd,
  isMobile,
  prefersReducedMotion,
  bloomProps = BLOOM_DEFAULTS,
}: {
  mousePos: MotionInput;
  isLowEnd: boolean;
  isMobile: boolean;
  prefersReducedMotion: boolean;
  bloomProps?: typeof BLOOM_DEFAULTS;
}) {
  return (
    <>
      <ambientLight intensity={0.3} color="#cceeff" />
      <directionalLight position={[5, 5, 5]} intensity={2.2} color="#dffbff" />
      <directionalLight position={[-3, 2, 4]} intensity={0.8} color="#ffffff" />
      <pointLight position={[0, 2, 3]} intensity={1.8} color="#a8e8ff" distance={12} />
      <pointLight position={[0, -3, 2]} intensity={0.5} color="#0d6b8a" distance={10} />

      <SceneEnvironment isLowEnd={isLowEnd} />

      <LogoModel
        mousePos={mousePos}
        isLowEnd={isLowEnd}
        isMobile={isMobile}
        prefersReducedMotion={prefersReducedMotion}
      />
      <PostProcessing isLowEnd={isLowEnd} bloomProps={bloomProps} />
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

export default function Logo3D({ className = '' }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mousePos = useRef({ x: 0, y: 0 });
  const { isLowEnd, isMobile, prefersReducedMotion, showLeva } = useInteractionProfile();

  const bloomControls = useControls('Bloom', {
    intensity: { value: BLOOM_DEFAULTS.intensity, min: 0, max: 3, step: 0.05 },
    luminanceThreshold: {
      value: BLOOM_DEFAULTS.luminanceThreshold,
      min: 0,
      max: 1,
      step: 0.01,
    },
  });

  const bloomProps = { ...BLOOM_DEFAULTS, ...bloomControls };

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
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) return;

    const handleMouseMove = (e: MouseEvent) => updatePointer(e.clientX, e.clientY);
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches[0]) updatePointer(e.touches[0].clientX, e.touches[0].clientY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    // Gyroscope: map device tilt to logo rotation
    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (e.gamma === null || e.beta === null) return;
      mousePos.current.x = THREE.MathUtils.clamp(e.gamma / 45, -1, 1);
      mousePos.current.y = THREE.MathUtils.clamp((e.beta - 45) / 45, -1, 1);
    };

    // iOS 13+ requires explicit permission from a user gesture; Android is automatic
    const tryGyro = () => {
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

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('deviceorientation', handleOrientation);
      window.removeEventListener('touchstart', tryGyro);
    };
  }, [prefersReducedMotion, updatePointer]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 20 }}
    >
      <Leva hidden={!showLeva} collapsed />
      <Canvas
        camera={{ position: [0, 0, 5.5], fov: 45 }}
        dpr={isMobile ? 1 : [1, 1.5]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: isMobile ? 'low-power' : 'high-performance',
        }}
        style={{ background: 'transparent', mixBlendMode: 'screen', pointerEvents: 'none' }}
      >
        <Suspense fallback={<LoadingFallback prefersReducedMotion={prefersReducedMotion} />}>
          <LogoScene
            mousePos={mousePos}
            isLowEnd={isLowEnd}
            isMobile={isMobile}
            prefersReducedMotion={prefersReducedMotion}
            bloomProps={bloomProps}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
