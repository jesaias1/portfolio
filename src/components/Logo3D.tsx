'use client';

import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import {
  Clone,
  Environment,
  Lightformer,
  useGLTF,
} from '@react-three/drei';
import * as THREE from 'three';

const MODEL_PATH = '/logo3d.glb';
const BASE_Y_ROTATION = Math.PI / 2;
const DESKTOP_VISUAL_OFFSET: [number, number, number] = [0, 0.14, 0];
const MOBILE_VISUAL_OFFSET: [number, number, number] = [0, 0.15, 0];

useGLTF.preload(MODEL_PATH);

type MotionInput = React.RefObject<{ x: number; y: number; active: boolean }>;
type InteractionInput = React.RefObject<{ boost: number }>;
export type LogoDragControls = {
  rotationX: number;
  rotationY: number;
  spinVelocity: number;
  isDragging: boolean;
};
type DragInput = React.RefObject<LogoDragControls>;
type DragSync = (nextControls: LogoDragControls) => void;

function easeOutCubic(value: number) {
  return 1 - Math.pow(1 - value, 3);
}

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

function LogoMaterial({
  interaction,
  isLowEnd,
}: {
  interaction: InteractionInput;
  isLowEnd: boolean;
}) {
  const materialRef = useRef<THREE.MeshPhysicalMaterial>(null);
  const baseClearcoat = isLowEnd ? 0.9 : 0.92;
  const baseClearcoatRoughness = isLowEnd ? 0.07 : 0.035;
  const baseEnvMapIntensity = isLowEnd ? 2.2 : 3.35;
  const baseEmissiveIntensity = isLowEnd ? 0.025 : 0.04;
  const baseIridescence = isLowEnd ? 0.1 : 0.18;

  useFrame((_, delta) => {
    const material = materialRef.current;
    if (!material) return;

    const boost = interaction.current.boost;
    const response = 1 - Math.exp(-delta * 7);

    material.clearcoat = THREE.MathUtils.lerp(material.clearcoat, Math.min(1, baseClearcoat + boost * 0.1), response);
    material.clearcoatRoughness = THREE.MathUtils.lerp(
      material.clearcoatRoughness,
      Math.max(0.018, baseClearcoatRoughness - boost * 0.018),
      response
    );
    material.envMapIntensity = THREE.MathUtils.lerp(
      material.envMapIntensity,
      baseEnvMapIntensity + boost * 0.65,
      response
    );
    material.specularIntensity = THREE.MathUtils.lerp(material.specularIntensity, 1 + boost * 0.22, response);
    material.emissiveIntensity = THREE.MathUtils.lerp(
      material.emissiveIntensity,
      baseEmissiveIntensity + boost * 0.035,
      response
    );
    material.iridescence = THREE.MathUtils.lerp(material.iridescence, baseIridescence + boost * 0.06, response);
  });

  return (
    <meshPhysicalMaterial
      ref={materialRef}
      color={isLowEnd ? '#ccf7ff' : '#d8fbff'}
      roughness={isLowEnd ? 0.16 : 0.1}
      metalness={0}
      clearcoat={baseClearcoat}
      clearcoatRoughness={baseClearcoatRoughness}
      transmission={isLowEnd ? 0.52 : 0.58}
      iridescence={baseIridescence}
      iridescenceIOR={1.32}
      iridescenceThicknessRange={[150, 360]}
      transparent
      opacity={0.94}
      thickness={isLowEnd ? 0.72 : 0.86}
      ior={1.44}
      reflectivity={0.7}
      specularIntensity={1}
      specularColor="#dffbff"
      envMapIntensity={baseEnvMapIntensity}
      emissive="#0b252d"
      emissiveIntensity={baseEmissiveIntensity}
      attenuationColor="#a8f2ff"
      attenuationDistance={2.35}
      side={THREE.FrontSide}
    />
  );
}

function LogoRimMaterial({
  interaction,
  isLowEnd,
}: {
  interaction: InteractionInput;
  isLowEnd: boolean;
}) {
  const materialRef = useRef<THREE.MeshBasicMaterial>(null);
  const baseOpacity = isLowEnd ? 0.035 : 0.055;

  useFrame((_, delta) => {
    const material = materialRef.current;
    if (!material) return;

    const response = 1 - Math.exp(-delta * 7);
    material.opacity = THREE.MathUtils.lerp(material.opacity, baseOpacity + interaction.current.boost * 0.08, response);
  });

  return (
    <meshBasicMaterial
      ref={materialRef}
      color="#bff8ff"
      transparent
      opacity={baseOpacity}
      side={THREE.BackSide}
      blending={THREE.AdditiveBlending}
      depthWrite={false}
      toneMapped={false}
    />
  );
}

function LogoReflectionEnvironment({ isLowEnd }: { isLowEnd: boolean }) {
  return (
    <Environment resolution={isLowEnd ? 64 : 128} frames={1}>
      <Lightformer
        form="rect"
        color="#f4ffff"
        intensity={isLowEnd ? 2.2 : 3.5}
        position={[0, 3.2, -4.8]}
        rotation={[Math.PI / 3, 0, 0]}
        scale={[8, 0.45, 1]}
      />
      <Lightformer
        form="rect"
        color="#4ddbff"
        intensity={isLowEnd ? 1.6 : 2.7}
        position={[-4.5, 0.4, -3.2]}
        rotation={[0, Math.PI / 3, 0.25]}
        scale={[0.8, 5.5, 1]}
      />
      <Lightformer
        form="rect"
        color="#9fefff"
        intensity={isLowEnd ? 1.1 : 1.9}
        position={[4.6, -1.4, -2.8]}
        rotation={[0, -Math.PI / 3, -0.15]}
        scale={[0.7, 4.2, 1]}
      />
    </Environment>
  );
}

function CursorGlow({
  mousePos,
  prefersReducedMotion,
  isActive,
}: {
  mousePos: MotionInput;
  prefersReducedMotion: boolean;
  isActive: boolean;
}) {
  const spriteRef = useRef<THREE.Sprite>(null);
  const materialRef = useRef<THREE.SpriteMaterial>(null);

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

  useFrame(() => {
    if (!spriteRef.current || !materialRef.current) return;

    const distance = mousePos.current.active
      ? Math.hypot(mousePos.current.x * 0.85, mousePos.current.y * 1.15)
      : 1.4;
    const proximity = THREE.MathUtils.clamp(1 - distance / 1.15, 0, 1);
    const activeLift = isActive && !prefersReducedMotion ? 1 : 0;
    const targetOpacity = 0;
    const targetScale = 4.75 + proximity * 0.34 + activeLift * 0.08;

    materialRef.current.opacity = THREE.MathUtils.lerp(
      materialRef.current.opacity,
      targetOpacity,
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
    </>
  );
}

function LogoModel({
  mousePos,
  dragControls,
  onDragControlsSync,
  playIntroSwirl,
  isLowEnd,
  isMobile,
  prefersReducedMotion,
  isActive,
  pulseToken,
}: {
  mousePos: MotionInput;
  dragControls?: DragInput;
  onDragControlsSync?: DragSync;
  playIntroSwirl: boolean;
  isLowEnd: boolean;
  isMobile: boolean;
  prefersReducedMotion: boolean;
  isActive: boolean;
  pulseToken: number;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const pulse = useRef(0);
  const introElapsed = useRef<number | null>(playIntroSwirl && !prefersReducedMotion ? 0 : null);
  const dragIdleElapsed = useRef(0);
  const materialInteraction = useRef({ boost: 0 });
  const inertialDrag = useRef<LogoDragControls>({
    rotationX: 0,
    rotationY: 0,
    spinVelocity: 0,
    isDragging: false,
  });
  const { scene } = useGLTF(MODEL_PATH);

  useEffect(() => {
    if (pulseToken > 0 && !prefersReducedMotion) pulse.current = 1;
  }, [prefersReducedMotion, pulseToken]);

  useEffect(() => {
    if (!playIntroSwirl || prefersReducedMotion) return;
    introElapsed.current = 0;
    pulse.current = 1;
  }, [playIntroSwirl, prefersReducedMotion]);

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
    const drag = dragControls?.current;
    const dragState = inertialDrag.current;
    const introDuration = 3.1;
    let introRotationX = 0;
    let introRotationY = 0;
    let introRotationZ = 0;
    let introLift = 0;
    let introScale = 0;

    if (introElapsed.current !== null) {
      introElapsed.current += delta;
      const rawProgress = THREE.MathUtils.clamp(introElapsed.current / introDuration, 0, 1);
      const easedProgress = easeOutCubic(rawProgress);
      const remaining = 1 - easedProgress;
      const orbit = rawProgress * Math.PI * 2;

      introRotationY = remaining * Math.PI * 2.15;
      introRotationX = Math.sin(orbit * 1.15) * remaining * 0.46;
      introRotationZ = Math.sin(orbit * 0.85 + 0.55) * remaining * 0.16;
      introLift = Math.sin(rawProgress * Math.PI) * 0.22;
      introScale = Math.sin(rawProgress * Math.PI) * 0.035;

      if (rawProgress >= 1) {
        introElapsed.current = null;
      }
    }

    if (drag?.isDragging) {
      dragIdleElapsed.current = 0;
      dragState.rotationX = drag.rotationX;
      dragState.rotationY = drag.rotationY;
      dragState.spinVelocity = drag.spinVelocity;
      dragState.isDragging = true;
    } else {
      dragState.isDragging = false;
      dragIdleElapsed.current += delta;
      dragState.spinVelocity = THREE.MathUtils.damp(dragState.spinVelocity, 0, 2.8, delta);
      dragState.rotationY += dragState.spinVelocity * delta;
      dragState.rotationX = THREE.MathUtils.damp(dragState.rotationX, 0, 1.4, delta);

      if (dragIdleElapsed.current > 2.25 && Math.abs(dragState.spinVelocity) < 0.08) {
        dragState.rotationY = THREE.MathUtils.damp(dragState.rotationY, 0, 1.15, delta);
      }

      onDragControlsSync?.({
        rotationX: dragState.rotationX,
        rotationY: dragState.rotationY,
        spinVelocity: dragState.spinVelocity,
        isDragging: false,
      });
    }

    const dragRotationX = dragState.rotationX;
    const dragRotationY = dragState.rotationY;
    const dragLift = dragState.isDragging ? 0.018 : 0;
    const boostTarget = Math.max(
      dragState.isDragging ? 0.72 : 0,
      Math.min(0.5, Math.abs(dragState.spinVelocity) * 0.16),
      pulseArc * 0.74,
      introElapsed.current !== null ? 0.38 : 0
    );
    materialInteraction.current.boost = THREE.MathUtils.damp(
      materialInteraction.current.boost,
      boostTarget,
      boostTarget > materialInteraction.current.boost ? 7.5 : 3.4,
      delta
    );

    const pointerRotationY = mousePos.current.x * (isMobile ? 0.46 : 0.16);
    const pointerRotationX = isMobile ? mousePos.current.y * 0.18 : 0;
    const pointerRotationZ = isMobile ? -mousePos.current.x * 0.16 : 0;

    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      BASE_Y_ROTATION + pointerRotationY + dragRotationY + introRotationY + pulse.current * 0.08,
      introElapsed.current !== null ? 0.14 : dragState.isDragging ? 0.18 : 0.06
    );
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      pointerRotationX + dragRotationX + introRotationX,
      introElapsed.current !== null ? 0.14 : dragState.isDragging ? 0.18 : 0.06
    );
    groupRef.current.rotation.z = THREE.MathUtils.lerp(
      groupRef.current.rotation.z,
      pointerRotationZ + introRotationZ - pulseArc * 0.04,
      introElapsed.current !== null ? 0.14 : 0.09
    );
    groupRef.current.position.z = THREE.MathUtils.lerp(
      groupRef.current.position.z,
      introLift + pulseArc * 0.12,
      0.09
    );
    const targetScale = 1 + (isActive ? 0.008 : 0) + dragLift + introScale + pulseArc * 0.032;
    const nextScale = THREE.MathUtils.lerp(groupRef.current.scale.x, targetScale, 0.09);
    groupRef.current.scale.setScalar(nextScale);
  });

  const model = (
    // Outer group: rotation only — world-space center stays at origin regardless of rotation angle
    <group
      ref={groupRef}
      rotation={[0, BASE_Y_ROTATION, 0]}
      position={isMobile ? MOBILE_VISUAL_OFFSET : DESKTOP_VISUAL_OFFSET}
    >
      {/* Inner group: centering + scale — offsets cancel cleanly before rotation is applied */}
      <group
        scale={scaleFactor}
        position={[
          -center.x * scaleFactor,
          -center.y * scaleFactor,
          -center.z * scaleFactor,
        ]}
      >
        <group scale={1.012}>
          <Clone
            object={preparedScene}
            deep="geometriesOnly"
            inject={(object) =>
              object instanceof THREE.Mesh ? (
                <LogoRimMaterial interaction={materialInteraction} isLowEnd={isLowEnd} />
              ) : null
            }
          />
        </group>
        <Clone
          object={preparedScene}
          deep="geometriesOnly"
          castShadow
          receiveShadow
          inject={(object) =>
            object instanceof THREE.Mesh ? (
              <>
                <LogoMaterial interaction={materialInteraction} isLowEnd={isLowEnd} />
              </>
            ) : null
          }
        />
      </group>
    </group>
  );

  return model;
}

function LogoScene({
  mousePos,
  dragControls,
  onDragControlsSync,
  playIntroSwirl,
  isLowEnd,
  isMobile,
  prefersReducedMotion,
  isActive,
  pulseToken,
}: {
  mousePos: MotionInput;
  dragControls?: DragInput;
  onDragControlsSync?: DragSync;
  playIntroSwirl: boolean;
  isLowEnd: boolean;
  isMobile: boolean;
  prefersReducedMotion: boolean;
  isActive: boolean;
  pulseToken: number;
}) {
  return (
    <>
      <LogoReflectionEnvironment isLowEnd={isLowEnd} />
      <ambientLight intensity={0.12} color="#f6feff" />
      <directionalLight position={[4, 5, 5]} intensity={0.72} color="#ffffff" />
      <directionalLight position={[-4, 2, 3]} intensity={0.28} color="#d8f7ff" />
      <pointLight position={[0, 2.5, 3]} intensity={0.52} color="#ffffff" distance={12} />
      <pointLight position={[0, -3, 2]} intensity={0.18} color="#80eaff" distance={10} />

      <hemisphereLight args={['#ecfdff', '#050708', isLowEnd ? 0.56 : 0.72]} />
      <CursorGlow
        mousePos={mousePos}
        prefersReducedMotion={prefersReducedMotion}
        isActive={isActive}
      />

      <LogoModel
        mousePos={mousePos}
        dragControls={dragControls}
        onDragControlsSync={onDragControlsSync}
        playIntroSwirl={playIntroSwirl}
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
  dragControls,
  onDragControlsSync,
  playIntroSwirl = false,
}: {
  className?: string;
  isActive?: boolean;
  pulseToken?: number;
  dragControls?: DragInput;
  onDragControlsSync?: DragSync;
  playIntroSwirl?: boolean;
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

      mousePos.current.x = THREE.MathUtils.clamp(gammaDelta / 11, -1, 1);
      mousePos.current.y = THREE.MathUtils.clamp(-betaDelta / 14, -1, 1);
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
            dragControls={dragControls}
            onDragControlsSync={onDragControlsSync}
            playIntroSwirl={playIntroSwirl}
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
