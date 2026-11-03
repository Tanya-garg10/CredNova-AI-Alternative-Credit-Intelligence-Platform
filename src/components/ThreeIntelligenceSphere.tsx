import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface ThreeIntelligenceSphereProps {
  score?: number;
  interactive?: boolean;
  onNodeClick?: (nodeName: string) => void;
}

export const ThreeIntelligenceSphere: React.FC<ThreeIntelligenceSphereProps> = ({
  score = 784,
  interactive = true,
  onNodeClick
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [activeNodeName, setActiveNodeName] = useState<string | null>('Utility Vector');
  const [isHovered, setIsHovered] = useState(false);
  const [webGlSupported, setWebGlSupported] = useState(true);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Detect WebGL availability
    const testCanvas = document.createElement('canvas');
    const gl = testCanvas.getContext('webgl2') || testCanvas.getContext('webgl');
    if (!gl) {
      setWebGlSupported(false);
      return;
    }

    // Software WebGL check
    const isSoftwareGl = (() => {
      try {
        const ext = gl.getExtension('WEBGL_debug_renderer_info');
        const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
        const gpu = String(gl.getParameter(param));
        return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
      } catch {
        return false;
      }
    })();

    // Scene setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x080D18, 0.05);

    const width = container.clientWidth || 500;
    const height = container.clientHeight || 500;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 7.5);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    // Root Group
    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // Color definitions
    const emeraldColor = new THREE.Color(0x10D6A0);
    const cyanColor = new THREE.Color(0x35C8FF);
    const darkNavyColor = new THREE.Color(0x101B2D);

    // 1. Procedural Central Core Sphere (Solid with emissive facets)
    const coreGeo = new THREE.IcosahedronGeometry(1.6, 2);
    const coreMat = new THREE.MeshPhysicalMaterial({
      color: 0x0A1628,
      emissive: 0x052B20,
      emissiveIntensity: 0.8,
      roughness: 0.25,
      metalness: 0.85,
      wireframe: false,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    rootGroup.add(coreMesh);

    // 2. Outer Wireframe Geodesic Lattice (Data Mesh)
    const wireGeo = new THREE.IcosahedronGeometry(1.9, 1);
    const wireMat = new THREE.MeshBasicMaterial({
      color: emeraldColor,
      wireframe: true,
      transparent: true,
      opacity: 0.35
    });
    const wireMesh = new THREE.Mesh(wireGeo, wireMat);
    rootGroup.add(wireMesh);

    // 3. Orbital Concentric Ring 1 (Horizontal tilt)
    const ring1Geo = new THREE.TorusGeometry(2.5, 0.025, 16, 100);
    const ring1Mat = new THREE.MeshStandardMaterial({
      color: emeraldColor,
      emissive: 0x10D6A0,
      emissiveIntensity: 0.9,
      roughness: 0.3,
      metalness: 0.8
    });
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    ring1.rotation.x = Math.PI / 3;
    ring1.rotation.y = Math.PI / 6;
    rootGroup.add(ring1);

    // 4. Orbital Concentric Ring 2 (Counter tilt)
    const ring2Geo = new THREE.TorusGeometry(2.9, 0.02, 16, 100);
    const ring2Mat = new THREE.MeshStandardMaterial({
      color: cyanColor,
      emissive: 0x35C8FF,
      emissiveIntensity: 0.8,
      roughness: 0.3,
      metalness: 0.8
    });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.x = -Math.PI / 4;
    ring2.rotation.z = Math.PI / 5;
    rootGroup.add(ring2);

    // 5. Orbital Concentric Ring 3 (Equatorial Ring with dashed appearance)
    const ring3Geo = new THREE.TorusGeometry(3.3, 0.015, 12, 120);
    const ring3Mat = new THREE.MeshBasicMaterial({
      color: 0x64748B,
      transparent: true,
      opacity: 0.45
    });
    const ring3 = new THREE.Mesh(ring3Geo, ring3Mat);
    ring3.rotation.y = Math.PI / 4;
    rootGroup.add(ring3);

    // 6. Orbital Satellite Nodes (Alternative Credit Indicators)
    const nodeNames = [
      'Utility Payment Consistency',
      'UPI Cashflow Velocity',
      'Platform Seniority',
      'Emergency Savings Cushion',
      'Community SHG Repayment',
      'Debt-to-Income Discipline'
    ];

    const nodesGroup = new THREE.Group();
    rootGroup.add(nodesGroup);

    const nodeMeshes: THREE.Mesh[] = [];
    const nodeCount = 6;
    for (let i = 0; i < nodeCount; i++) {
      const angle = (i / nodeCount) * Math.PI * 2;
      const radius = i % 2 === 0 ? 2.5 : 2.9;
      
      const nodeGeo = new THREE.SphereGeometry(0.12, 16, 16);
      const nodeMat = new THREE.MeshStandardMaterial({
        color: i % 2 === 0 ? emeraldColor : cyanColor,
        emissive: i % 2 === 0 ? emeraldColor : cyanColor,
        emissiveIntensity: 1.5,
        roughness: 0.1,
        metalness: 0.9
      });
      const nodeMesh = new THREE.Mesh(nodeGeo, nodeMat);
      nodeMesh.userData = { name: nodeNames[i], initialAngle: angle, radius, speed: 0.5 + (i * 0.1) };
      nodesGroup.add(nodeMesh);
      nodeMeshes.push(nodeMesh);
    }

    // 7. Background Data Particle Constellation
    const particleCount = isSoftwareGl ? 80 : 350;
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const r = 3.5 + Math.random() * 3.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() * 2) - 1);

      particlePositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      particlePositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      particlePositions[i * 3 + 2] = r * Math.cos(phi);

      const isEmerald = Math.random() > 0.4;
      const col = isEmerald ? emeraldColor : cyanColor;
      particleColors[i * 3] = col.r;
      particleColors[i * 3 + 1] = col.g;
      particleColors[i * 3 + 2] = col.b;
    }

    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.05,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending
    });
    const particleSystem = new THREE.Points(particleGeo, particleMat);
    scene.add(particleSystem);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x0A1628, 1.2);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x10D6A0, 2.5);
    dirLight1.position.set(5, 5, 5);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x35C8FF, 2.0);
    dirLight2.position.set(-5, -3, 3);
    scene.add(dirLight2);

    const pointLight = new THREE.PointLight(0x10D6A0, 3.0, 10);
    pointLight.position.set(0, 0, 0);
    scene.add(pointLight);

    // Mouse Tracking & Parallax
    let targetRotationX = 0;
    let targetRotationY = 0;
    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mouseX = x;
      mouseY = y;
      targetRotationY = x * 0.7;
      targetRotationX = -y * 0.5;
    };

    container.addEventListener('mousemove', handleMouseMove);

    // Raycaster for Node Clicks
    const raycaster = new THREE.Raycaster();
    const mouseVector = new THREE.Vector2();

    const handleClick = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseVector.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseVector.y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);

      raycaster.setFromCamera(mouseVector, camera);
      const intersects = raycaster.intersectObjects(nodeMeshes);

      if (intersects.length > 0) {
        const clicked = intersects[0].object as THREE.Mesh;
        const name = clicked.userData.name;
        setActiveNodeName(name);
        if (onNodeClick) onNodeClick(name);

        // Visual click reaction: temporarily expand node
        clicked.scale.set(1.8, 1.8, 1.8);
        setTimeout(() => {
          clicked.scale.set(1.0, 1.0, 1.0);
        }, 400);
      }
    };

    container.addEventListener('click', handleClick);

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    // Animation Loop with Three.Clock
    const clock = new THREE.Clock();
    let animationFrameId = 0;

    const animate = () => {
      const delta = clock.getDelta();
      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse rotation damping
      rootGroup.rotation.y = THREE.MathUtils.damp(rootGroup.rotation.y, targetRotationY + elapsedTime * 0.15, 3, delta);
      rootGroup.rotation.x = THREE.MathUtils.damp(rootGroup.rotation.x, targetRotationX, 3, delta);

      // Core rotation
      coreMesh.rotation.y -= delta * 0.2;
      coreMesh.rotation.x += delta * 0.1;

      // Outer wire lattice counter rotation
      wireMesh.rotation.y += delta * 0.3;
      wireMesh.rotation.z -= delta * 0.15;

      // Rings spin
      ring1.rotation.z += delta * 0.25;
      ring2.rotation.z -= delta * 0.3;
      ring3.rotation.x += delta * 0.15;

      // Orbiting satellite nodes
      nodeMeshes.forEach((mesh) => {
        const { radius, initialAngle, speed } = mesh.userData;
        const currentAngle = initialAngle + elapsedTime * speed * 0.4;
        mesh.position.x = Math.cos(currentAngle) * radius;
        mesh.position.y = Math.sin(currentAngle * 1.5) * 0.8;
        mesh.position.z = Math.sin(currentAngle) * radius;
      });

      // Particle halo slow drift
      particleSystem.rotation.y -= delta * 0.05;
      particleSystem.rotation.x += delta * 0.02;

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('click', handleClick);
      window.removeEventListener('resize', handleResize);

      // Dispose Three.js objects
      coreGeo.dispose();
      coreMat.dispose();
      wireGeo.dispose();
      wireMat.dispose();
      ring1Geo.dispose();
      ring1Mat.dispose();
      ring2Geo.dispose();
      ring2Mat.dispose();
      ring3Geo.dispose();
      ring3Mat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      nodeMeshes.forEach(m => {
        m.geometry.dispose();
        if (Array.isArray(m.material)) m.material.forEach(mat => mat.dispose());
        else m.material.dispose();
      });

      renderer.dispose();
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, [onNodeClick]);

  if (!webGlSupported) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-slate-900/60 rounded-3xl border border-slate-800">
        <div className="w-48 h-48 rounded-full border-4 border-emerald-500/30 flex items-center justify-center bg-emerald-500/10">
          <span className="text-4xl font-extrabold font-mono text-emerald-400">{score}</span>
        </div>
        <p className="text-xs text-slate-400 mt-4">Hardware 3D Fallback Mode Active</p>
      </div>
    );
  }

  return (
    <div 
      className="relative w-full h-full min-h-[440px] flex items-center justify-center select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 3D Canvas Mount */}
      <div ref={mountRef} className="w-full h-full absolute inset-0 cursor-grab active:cursor-grabbing" />

      {/* Floating Center Score Indicator inside the sphere */}
      <div className="pointer-events-none z-10 flex flex-col items-center justify-center text-center">
        <span className="text-[10px] uppercase font-mono tracking-widest text-emerald-400/90 font-semibold px-2 py-0.5 rounded-full bg-slate-950/70 border border-emerald-500/20 backdrop-blur-md">
          Neural Core Active
        </span>
        <div className="text-5xl md:text-6xl font-black font-mono tracking-tight text-white drop-shadow-[0_0_25px_rgba(16,214,160,0.6)] mt-1">
          {score}
        </div>
        <span className="text-xs font-semibold text-slate-300 font-mono tracking-wider">
          PRIME RISK VECTOR
        </span>
      </div>

      {/* Interactive Node Tooltip Overlay */}
      {activeNodeName && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
          <div className="px-3.5 py-1.5 rounded-full bg-slate-950/80 border border-slate-700/80 text-[11px] font-mono text-slate-300 flex items-center space-x-2 shadow-2xl backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
            <span>Telemetry: <strong className="text-emerald-400">{activeNodeName}</strong></span>
            <span className="text-slate-500">• Click nodes to inspect</span>
          </div>
        </div>
      )}
    </div>
  );
};
