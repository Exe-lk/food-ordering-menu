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
      <div className="text-white-600 text-sm sm:text-base">Loading 3D Model...</div>
    </div>
  );
}

export default function Model3D({ modelName }: { modelName: string }) {
  const [isMobile, setIsMobile] = useState(false);
  const [autoRotate, setAutoRotate] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="w-full h-screen relative touch-none">
      <Canvas
        camera={{ 
          position: isMobile ? [0, 0, 8] : [0, 0, 5], 
          fov: isMobile ? 60 : 75 
        }}
        style={{ background: '#ffffff', touchAction: 'none' }}
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
          // Auto-rotation - 360 degrees continuously
          autoRotate={autoRotate}
          autoRotateSpeed={isMobile ? 1.5 : 2}
          // Mobile-optimized controls - correct touch mapping
          touches={{
            ONE: 0, // Single finger for rotate/orbit
            TWO: 2  // Two fingers for pinch-to-zoom
          }}
          mouseButtons={{
            LEFT: 0, // Left mouse for rotate/orbit
            MIDDLE: 1, // Middle mouse for pan
            RIGHT: 2 // Right mouse disabled
          }}
          // Faster, more responsive rotation for touch
          rotateSpeed={isMobile ? 1.2 : 0.8}
          panSpeed={0.8}
          // Reduced damping for snappier touch response
          dampingFactor={isMobile ? 0.02 : 0.05}
          enableDamping={true}
          // Flexible zoom limits - can zoom in very close or out very far
          minDistance={0.1}
          maxDistance={50}
          // Enhanced zoom control
          zoomSpeed={isMobile ? 0.25 : 1}
          // Full 360-degree rotation in all angles - no limits
          minPolarAngle={0}
          maxPolarAngle={Math.PI}
          minAzimuthAngle={-Infinity}
          maxAzimuthAngle={Infinity}
          // Pause auto-rotation on interaction
          onStart={() => setAutoRotate(false)}
          onEnd={() => {
            // Resume auto-rotation after 3 seconds of inactivity
            setTimeout(() => setAutoRotate(true), 3000);
          }}
        />
      </Canvas>
      
      {/* Mobile instructions overlay */}
      {isMobile && (
        <div className="absolute bottom-4 left-4 right-4 z-10 pointer-events-none">
          <div className="bg-black bg-opacity-50 text-white text-xs px-3 py-2 rounded-lg">
            <div className="text-center">
              <div>🔄 Auto-rotating • Touch to control</div>
              <div className="mt-1 text-[10px] opacity-75">👆 One finger: Rotate • ✌️ Two fingers: Zoom/Pan</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

