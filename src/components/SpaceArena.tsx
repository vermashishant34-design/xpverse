import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars, Float, PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";

function FloatingCubes() {
  const cubesRef = useRef<THREE.Mesh[]>([]);

  useFrame((state, delta) => {
    cubesRef.current.forEach((cube, i) => {
      if (cube) {
        cube.rotation.x += delta * (0.2 + i * 0.05);
        cube.rotation.y += delta * (0.3 + i * 0.05);
        cube.position.y = Math.sin(state.clock.elapsedTime + i) * 0.3;
      }
    });
  });

  const cubes = [];
  for (let i = 0; i < 12; i++) {
    const angle = (i / 12) * Math.PI * 2;
    const radius = 4.5;
    cubes.push(
      <Float key={i} speed={2} rotationIntensity={0.5} floatIntensity={1}>
        <mesh
          ref={(el) => {
            if (el) cubesRef.current[i] = el;
          }}
          position={[Math.cos(angle) * radius, 0, Math.sin(angle) * radius]}
        >
          <boxGeometry args={[0.6, 0.6, 0.6]} />
          <meshStandardMaterial
            color={i % 2 === 0 ? "#06b6d4" : "#a855f7"}
            emissive={i % 2 === 0 ? "#06b6d4" : "#a855f7"}
            emissiveIntensity={0.3}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
      </Float>
    );
  }
  return <>{cubes}</>;
}

function CentralCore() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.5;
      meshRef.current.rotation.x += delta * 0.2;
    }
  });

  return (
    <Float speed={3} rotationIntensity={0.3} floatIntensity={0.5}>
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[2, 1]} />
        <meshStandardMaterial
          color="#f0f9ff"
          emissive="#60a5fa"
          emissiveIntensity={0.8}
          wireframe
        />
      </mesh>
    </Float>
  );
}

function Scene() {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 12]} fov={60} />
      <OrbitControls enablePan={false} enableZoom={false} autoRotate autoRotateSpeed={0.5} />
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#06b6d4" />
      <pointLight position={[-10, -10, -10]} intensity={1} color="#a855f7" />
      <CentralCore />
      <FloatingCubes />
    </>
  );
}

export function SpaceArena() {
  return (
    <div className="absolute inset-0 z-[1]">
      <Canvas dpr={[1, 2]}>
        <Scene />
      </Canvas>
    </div>
  );
}
