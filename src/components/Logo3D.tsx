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
import {
  EffectComposer,
  Bloom,
  ChromaticAberration,
  Vignette,
  Noise,
} from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import { Leva, useControls } from 'leva';
import * as THREE from 'three';

const MODEL_PATH = '/logo3d.glb';
const BASE_Y_ROTATION = Math.PI / 2;
const ENABLE_LEVA_PANEL = false;

const GLASS_DEFAULTS = {
  samples: 8,
  thickness: 0.25,
  roughness: 0,
  ior: 1.55,
  chromaticAberration: 0.07,
  anisotropicBlur: 0,
  distortion: 0.2,
  distortionScale: 0.25,
  temporalDistortion: 0.02,
};

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
      isLowEnd: isMobile || hw < 4,
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
        isLowEnd: isMobile || hw < 4,
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

function LogoMaterial({
  isLowEnd,
  glassProps,
}: {
  isLowEnd: boolean;
  glassProps: typeof GLASS_DEFAULTS;
}) {
  return (
    <meshPhysicalMaterial
      color="#4ec8f0"
      roughness={isLowEnd ? 0.1 : glassProps.roughness}
      metalness={0}
      clearcoat={1}
      clearcoatRoughness={isLowEnd ? 0.08 : 0}
      transmission={isLowEnd ? 0.2 : 0.35}
      thickness={isLowEnd ? 1.0 : glassProps.thickness * 6}
      ior={glassProps.ior}
      envMapIntensity={isLowEnd ? 2 : 4.5}
      attenuationColor="#1878b8"
      attenuationDistance={4}
      side={THREE.FrontSide}
    />
  );
}

function LogoModel({
  mousePos,
  isLowEnd,
  isMobile,
  prefersReducedMotion,
  glassProps,
}: {
  mousePos: MotionInput;
  isLowEnd: boolean;
  isMobile: boolean;
  prefersReducedMotion: boolean;
  glassProps: typeof GLASS_DEFAULTS;
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
              <LogoMaterial isLowEnd={isLowEnd} glassProps={glassProps} />
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
      <ChromaticAberration
        offset={[0.0008, 0.0008]}
        radialModulation={false}
        modulationOffset={0}
      />
      <Vignette eskil={false} offset={0.1} darkness={0.7} />
      <Noise opacity={0.025} blendFunction={BlendFunction.OVERLAY} />
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
  glassProps = GLASS_DEFAULTS,
  bloomProps = BLOOM_DEFAULTS,
}: {
  mousePos: MotionInput;
  isLowEnd: boolean;
  isMobile: boolean;
  prefersReducedMotion: boolean;
  glassProps?: typeof GLASS_DEFAULTS;
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
        glassProps={{
          ...glassProps,
          samples: isLowEnd ? 4 : glassProps.samples,
        }}
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

  const glassControls = useControls('Glass', {
    thickness: { value: GLASS_DEFAULTS.thickness, min: 0, max: 3, step: 0.01 },
    roughness: { value: GLASS_DEFAULTS.roughness, min: 0, max: 1, step: 0.01 },
    ior: { value: GLASS_DEFAULTS.ior, min: 1, max: 2.5, step: 0.01 },
    chromaticAberration: {
      value: GLASS_DEFAULTS.chromaticAberration,
      min: 0,
      max: 1,
      step: 0.01,
    },
    distortion: { value: GLASS_DEFAULTS.distortion, min: 0, max: 1, step: 0.01 },
  });

  const bloomControls = useControls('Bloom', {
    intensity: { value: BLOOM_DEFAULTS.intensity, min: 0, max: 3, step: 0.05 },
    luminanceThreshold: {
      value: BLOOM_DEFAULTS.luminanceThreshold,
      min: 0,
      max: 1,
      step: 0.01,
    },
  });

  const glassProps = { ...GLASS_DEFAULTS, ...glassControls };
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

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
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
        dpr={isMobile ? 1 : [1, 2]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: isMobile ? 'low-power' : 'high-performance',
        }}
        style={{ background: 'transparent', mixBlendMode: 'screen', pointerEvents: 'auto' }}
      >
        <Suspense fallback={<LoadingFallback prefersReducedMotion={prefersReducedMotion} />}>
          <LogoScene
            mousePos={mousePos}
            isLowEnd={isLowEnd}
            isMobile={isMobile}
            prefersReducedMotion={prefersReducedMotion}
            glassProps={glassProps}
            bloomProps={bloomProps}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
