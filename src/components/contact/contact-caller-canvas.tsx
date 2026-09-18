"use client";

import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, Environment, Float } from "@react-three/drei";
import type { Group } from "three";
import * as THREE from "three";

function CameraRig() {
  const { camera } = useThree();
  useMemo(() => {
    camera.position.set(0, 0.95, 4.6);
    camera.lookAt(0, 0.75, 0);
    camera.updateProjectionMatrix();
  }, [camera]);
  return null;
}

function CallerFigure() {
  const root = useRef<Group>(null);
  const arm = useRef<Group>(null);
  const head = useRef<Group>(null);
  const mouth = useRef<THREE.Mesh>(null);
  const phoneGlow = useRef<THREE.Mesh>(null);

  const skin = useMemo(() => "#f0c9a0", []);
  const shirt = useMemo(() => "#5a2e1b", []);
  const pants = useMemo(() => "#3b1d12", []);
  const phone = useMemo(() => "#1a1a1a", []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (root.current) {
      root.current.position.y = -0.15 + Math.sin(t * 1.4) * 0.04;
      root.current.rotation.y = Math.sin(t * 0.45) * 0.1;
    }
    if (arm.current) {
      arm.current.rotation.z = -0.55 + Math.sin(t * 2.2) * 0.07;
      arm.current.rotation.x = 0.25 + Math.sin(t * 1.8) * 0.05;
    }
    if (head.current) {
      head.current.rotation.y = Math.sin(t * 1.1) * 0.1;
      head.current.rotation.z = Math.sin(t * 0.9) * 0.03;
    }
    if (mouth.current) {
      const talk = (Math.sin(t * 8) + 1) * 0.5;
      mouth.current.scale.y = 0.35 + talk * 0.75;
    }
    if (phoneGlow.current) {
      const mat = phoneGlow.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 0.35 + (Math.sin(t * 3) + 1) * 0.25;
    }
  });

  return (
    <group ref={root} position={[0, -0.15, 0]} scale={0.78}>
      <mesh position={[-0.18, 0.35, 0]} castShadow>
        <capsuleGeometry args={[0.12, 0.45, 6, 12]} />
        <meshStandardMaterial color={pants} roughness={0.7} />
      </mesh>
      <mesh position={[0.18, 0.35, 0]} castShadow>
        <capsuleGeometry args={[0.12, 0.45, 6, 12]} />
        <meshStandardMaterial color={pants} roughness={0.7} />
      </mesh>

      <mesh position={[-0.18, 0.05, 0.06]} castShadow>
        <boxGeometry args={[0.22, 0.1, 0.32]} />
        <meshStandardMaterial color="#2a1810" roughness={0.55} />
      </mesh>
      <mesh position={[0.18, 0.05, 0.06]} castShadow>
        <boxGeometry args={[0.22, 0.1, 0.32]} />
        <meshStandardMaterial color="#2a1810" roughness={0.55} />
      </mesh>

      <mesh position={[0, 1.05, 0]} castShadow>
        <capsuleGeometry args={[0.34, 0.55, 8, 16]} />
        <meshStandardMaterial color={shirt} roughness={0.55} metalness={0.05} />
      </mesh>

      <mesh position={[0.18, 1.28, 0.28]}>
        <sphereGeometry args={[0.05, 12, 12]} />
        <meshStandardMaterial
          color="#e4b85c"
          emissive="#c58a32"
          emissiveIntensity={0.35}
          metalness={0.7}
          roughness={0.25}
        />
      </mesh>

      <group position={[-0.42, 1.25, 0]} rotation={[0.2, 0, 0.45]}>
        <mesh position={[0, -0.28, 0]} castShadow>
          <capsuleGeometry args={[0.09, 0.42, 6, 12]} />
          <meshStandardMaterial color={shirt} roughness={0.55} />
        </mesh>
        <mesh position={[0, -0.58, 0.02]} castShadow>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial color={skin} roughness={0.65} />
        </mesh>
      </group>

      <group
        ref={arm}
        position={[0.38, 1.32, 0.08]}
        rotation={[0.35, 0.35, -0.55]}
      >
        <mesh position={[0.08, -0.05, 0.12]} castShadow>
          <capsuleGeometry args={[0.09, 0.38, 6, 12]} />
          <meshStandardMaterial color={shirt} roughness={0.55} />
        </mesh>
        <mesh position={[0.22, 0.2, 0.32]} castShadow>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial color={skin} roughness={0.65} />
        </mesh>

        <group position={[0.32, 0.42, 0.42]} rotation={[0.15, 0.85, 0.2]}>
          <mesh castShadow>
            <boxGeometry args={[0.14, 0.28, 0.04]} />
            <meshStandardMaterial color={phone} roughness={0.35} metalness={0.4} />
          </mesh>
          <mesh ref={phoneGlow} position={[0, 0.02, 0.025]}>
            <planeGeometry args={[0.1, 0.2]} />
            <meshStandardMaterial
              color="#5eead4"
              emissive="#14b8a6"
              emissiveIntensity={0.5}
              roughness={0.3}
            />
          </mesh>
        </group>
      </group>

      <group ref={head} position={[0, 1.72, 0]}>
        <mesh castShadow>
          <sphereGeometry args={[0.28, 28, 28]} />
          <meshStandardMaterial color={skin} roughness={0.55} />
        </mesh>

        <mesh position={[0, 0.14, -0.02]}>
          <sphereGeometry args={[0.29, 24, 24]} />
          <meshStandardMaterial color="#2b1a12" roughness={0.8} />
        </mesh>
        <mesh position={[0, 0.02, -0.16]}>
          <sphereGeometry args={[0.22, 16, 16]} />
          <meshStandardMaterial color="#2b1a12" roughness={0.8} />
        </mesh>

        <mesh position={[-0.09, 0.04, 0.24]}>
          <sphereGeometry args={[0.035, 12, 12]} />
          <meshStandardMaterial color="#1f120c" />
        </mesh>
        <mesh position={[0.09, 0.04, 0.24]}>
          <sphereGeometry args={[0.035, 12, 12]} />
          <meshStandardMaterial color="#1f120c" />
        </mesh>

        <mesh position={[-0.16, -0.02, 0.2]}>
          <sphereGeometry args={[0.04, 10, 10]} />
          <meshStandardMaterial color="#e8a090" transparent opacity={0.55} />
        </mesh>
        <mesh position={[0.16, -0.02, 0.2]}>
          <sphereGeometry args={[0.04, 10, 10]} />
          <meshStandardMaterial color="#e8a090" transparent opacity={0.55} />
        </mesh>

        <mesh ref={mouth} position={[0, -0.1, 0.25]}>
          <capsuleGeometry args={[0.03, 0.04, 4, 8]} />
          <meshStandardMaterial color="#8b3a2f" roughness={0.5} />
        </mesh>
      </group>

      <SoundRings />
    </group>
  );
}

function SoundRings() {
  const a = useRef<THREE.Mesh>(null);
  const b = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    for (const [mesh, offset] of [
      [a.current, 0],
      [b.current, 1.1],
    ] as const) {
      if (!mesh) continue;
      const p = ((t * 1.4 + offset) % 2) / 2;
      mesh.scale.setScalar(0.7 + p * 1.4);
      const mat = mesh.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.45 * (1 - p);
    }
  });

  return (
    <group position={[0.55, 1.85, 0.55]}>
      <mesh ref={a} rotation={[Math.PI / 2, 0, 0.4]}>
        <torusGeometry args={[0.12, 0.01, 8, 32]} />
        <meshBasicMaterial color="#e4b85c" transparent opacity={0.4} />
      </mesh>
      <mesh ref={b} rotation={[Math.PI / 2, 0, 0.4]}>
        <torusGeometry args={[0.12, 0.01, 8, 32]} />
        <meshBasicMaterial color="#c58a32" transparent opacity={0.35} />
      </mesh>
    </group>
  );
}

function Scene() {
  return (
    <>
      <CameraRig />
      <ambientLight intensity={0.85} />
      <directionalLight
        castShadow
        position={[3, 5, 2]}
        intensity={1.4}
        shadow-mapSize={[1024, 1024]}
      />
      <pointLight position={[-2, 2.2, 2]} intensity={0.5} color="#e4b85c" />
      <Float speed={1.1} rotationIntensity={0.12} floatIntensity={0.22}>
        <CallerFigure />
      </Float>
      <ContactShadows
        position={[0, -0.95, 0]}
        opacity={0.32}
        scale={7}
        blur={2.6}
        far={4}
      />
      <Environment preset="warehouse" environmentIntensity={0.3} />
    </>
  );
}

export function ContactCallerCanvas() {
  return (
    <div className="relative h-[300px] w-full overflow-hidden rounded-2xl sm:h-[360px] lg:h-[400px]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_28%,rgba(228,184,92,0.3),transparent_60%)]" />
      <Canvas
        camera={{ position: [0, 0.95, 4.6], fov: 36, near: 0.1, far: 40 }}
        dpr={[1, 1.75]}
        gl={{ antialias: true, alpha: true }}
        className="h-full w-full touch-none"
        style={{ width: "100%", height: "100%" }}
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
      <p className="pointer-events-none absolute bottom-3 left-3 right-3 text-center text-[11px] font-medium text-caramel sm:text-xs">
        We’re on the line — tell us what you need
      </p>
    </div>
  );
}
