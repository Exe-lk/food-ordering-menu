'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import { Suspense, useState, useEffect } from 'react';

function Model({ modelName }: { modelName: string }) {
  const { scene } = useGLTF(`/foodItems/${modelName}.glb`);
  return <primitive object={scene} scale={1} position={[0, 0, 0]} />;
}

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-gray-600 text-sm sm:text-base">Loading 3D Model...</div>
    </div>
  );
}

export default function Model3D({ modelName }: { modelName: string }) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="w-full h-screen relative">
      <Canvas
        camera={{ 
          position: isMobile ? [0, 0, 8] : [0, 0, 5], 
          fov: isMobile ? 60 : 75 
        }}
        style={{ background: '#ffffff' }}
        dpr={[1, 2]} // Optimize pixel ratio for mobile
        gl={{ 
          antialias: true,
          alpha: false,
          powerPreference: "high-performance"
        }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <Suspense fallback={null}>
          <Model modelName={modelName} />
        </Suspense>
        <OrbitControls 
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          // Mobile-optimized controls
          touches={{
            ONE: 2, // Single finger for rotate
            TWO: 1  // Two fingers for pan and zoom
          }}
          mouseButtons={{
            LEFT: 2, // Left mouse for rotate
            MIDDLE: 1, // Middle mouse for pan
            RIGHT: 0 // Right mouse for zoom
          }}
          // Responsive damping
          dampingFactor={0.05}
          enableDamping={true}
          // Mobile-friendly limits
          minDistance={isMobile ? 3 : 2}
          maxDistance={isMobile ? 15 : 10}
          // Smooth zoom
          zoomSpeed={isMobile ? 0.8 : 1}
          // Rotation limits for better mobile experience
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI - Math.PI / 6}
        />
      </Canvas>
      
      {/* Mobile instructions overlay */}
      {isMobile && (
        <div className="absolute top-4 left-4 right-4 z-10 pointer-events-none">
          <div className="bg-black bg-opacity-50 text-white text-xs px-3 py-2 rounded-lg">
            <div className="text-center">
              <div>👆 One finger: Rotate</div>
              <div>✌️ Two fingers: Pan & Zoom</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

