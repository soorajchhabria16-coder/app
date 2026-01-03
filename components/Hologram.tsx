import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, MeshDistortMaterial, Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

interface HologramProps {
  type: 'hero' | 'preview' | 'scan';
  color?: string;
}

const ParticleSphere = ({ color = "#8b5cf6" }: { color?: string }) => {
  const ref = useRef<THREE.Points>(null);
  const [sphere] = useState(() => {
    const temp = new Float32Array(3000 * 3);
    for (let i = 0; i < 3000; i++) {
      const theta = THREE.MathUtils.randFloatSpread(360); 
      const phi = THREE.MathUtils.randFloatSpread(360); 
      
      const x = 2 * Math.sin(theta) * Math.cos(phi);
      const y = 2 * Math.sin(theta) * Math.sin(phi);
      const z = 2 * Math.cos(theta);
      
      temp[i * 3] = x;
      temp[i * 3 + 1] = y;
      temp[i * 3 + 2] = z;
    }
    return temp;
  });

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta / 10;
      ref.current.rotation.y -= delta / 15;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color={color}
          size={0.03}
          sizeAttenuation={true}
          depthWrite={false}
          opacity={0.6}
        />
      </Points>
    </group>
  );
};

const AnimatedMesh = ({ color = "#8b5cf6", scale = 1, animate = true }: { color?: string; scale?: number; animate?: boolean }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current && animate) {
      meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.2;
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.3;
    }
  });

  return (
    <Sphere args={[1, 64, 64]} scale={scale} ref={meshRef}>
      <MeshDistortMaterial
        color={color}
        attach="material"
        distort={0.4}
        speed={2}
        roughness={0.2}
        metalness={0.9}
        wireframe
      />
    </Sphere>
  );
};

const ScanEffect = () => {
  const groupRef = useRef<THREE.Group>(null);
  useFrame((state) => {
    if(groupRef.current) {
      groupRef.current.rotation.y += 0.05;
    }
  });

  return (
    <group ref={groupRef}>
       <mesh>
        <icosahedronGeometry args={[1.5, 2]} />
        <meshStandardMaterial color="#10b981" wireframe transparent opacity={0.3} />
       </mesh>
       <mesh scale={[0.8, 0.8, 0.8]}>
         <icosahedronGeometry args={[1.5, 1]} />
         <meshBasicMaterial color="#34d399" wireframe transparent opacity={0.1} />
       </mesh>
    </group>
  );
}

export const Hologram: React.FC<HologramProps> = ({ type, color }) => {
  return (
    <div className="w-full h-full">
      <Canvas camera={{ position: [0, 0, 4] }} gl={{ alpha: true }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        
        {type === 'hero' && (
          <>
            <ParticleSphere color={color} />
            <AnimatedMesh color={color || "#6366f1"} scale={1.2} />
            <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
          </>
        )}

        {type === 'preview' && (
          <>
            <AnimatedMesh color={color || "#a78bfa"} scale={1.8} animate={false} />
            <OrbitControls enableZoom={true} enablePan={false} minDistance={2} maxDistance={6} />
          </>
        )}

        {type === 'scan' && (
          <>
            <ScanEffect />
            <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={5} />
          </>
        )}
      </Canvas>
    </div>
  );
};