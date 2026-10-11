import { useRef, useMemo, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

interface Hero3DSceneProps {
  imagePaths: string[];
  activeIndex: number;
  isHovered: boolean;
}

const vertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = `
uniform sampler2D tDiffuse0;
uniform sampler2D tDiffuse1;
uniform sampler2D tDiffuse2;
uniform float uProgress01;
uniform float uProgress12;
uniform float uProgress20;
uniform float uReveal;
varying vec2 vUv;

void main() {
  vec4 c0 = texture2D(tDiffuse0, vUv);
  vec4 c1 = texture2D(tDiffuse1, vUv);
  vec4 c2 = texture2D(tDiffuse2, vUv);
  
  // Blend between the three images based on progress
  vec4 color = c0;
  if (uProgress01 > 0.0) color = mix(c0, c1, uProgress01);
  else if (uProgress12 > 0.0) color = mix(c1, c2, uProgress12);
  else if (uProgress20 > 0.0) color = mix(c2, c0, uProgress20);
  
  // Base "unfinished" state: desaturated and slightly darker
  float luminance = dot(color.rgb, vec3(0.299, 0.587, 0.114));
  vec3 fadedColor = mix(vec3(luminance), color.rgb, 0.5); 
  fadedColor *= 0.6; // Slightly darker than before to make the reveal pop more
  
  // Sweeping reveal from top to bottom for the ENTIRE image
  float sweepPos = 1.0 - vUv.y;
  
  float reveal = smoothstep(sweepPos, sweepPos + 0.1, uReveal * 1.2);
  
  float edge = smoothstep(sweepPos - 0.05, sweepPos, uReveal * 1.2) * (1.0 - smoothstep(sweepPos, sweepPos + 0.02, uReveal * 1.2));
  
  vec3 finalColor = mix(fadedColor, color.rgb, reveal);
  
  // Add intense pink glow on the stitching line
  finalColor += vec3(0.95, 0.4, 0.55) * edge * 1.5; 
  
  gl_FragColor = vec4(finalColor, 1.0);
}
`;

export default function Hero3DScene({ imagePaths, activeIndex, isHovered }: Hero3DSceneProps) {
  const mesh = useRef<THREE.Mesh>(null);
  const { viewport } = useThree();
  const textures = useTexture(imagePaths);

  const uniforms = useMemo(
    () => ({
      tDiffuse0: { value: textures[0] },
      tDiffuse1: { value: textures[1] },
      tDiffuse2: { value: textures[2] },
      uProgress01: { value: 0.0 },
      uProgress12: { value: 0.0 },
      uProgress20: { value: 0.0 },
      uReveal: { value: 0.0 },
    }),
    [textures]
  );

  const currentTransition = useRef({ p01: 0, p12: 0, p20: 0 });

  useEffect(() => {
    if (activeIndex === 0) currentTransition.current = { p01: 0, p12: 0, p20: 1 };
    if (activeIndex === 1) currentTransition.current = { p01: 1, p12: 0, p20: 0 };
    if (activeIndex === 2) currentTransition.current = { p01: 0, p12: 1, p20: 0 };
  }, [activeIndex]);

  useFrame(() => {
    if (mesh.current) {
      const material = mesh.current.material as THREE.ShaderMaterial;
      const targetReveal = isHovered ? 1.0 : 0.0;
      material.uniforms.uReveal.value += (targetReveal - material.uniforms.uReveal.value) * 0.03;
      
      material.uniforms.uProgress01.value += (currentTransition.current.p01 - material.uniforms.uProgress01.value) * 0.02;
      material.uniforms.uProgress12.value += (currentTransition.current.p12 - material.uniforms.uProgress12.value) * 0.02;
      material.uniforms.uProgress20.value += (currentTransition.current.p20 - material.uniforms.uProgress20.value) * 0.02;
    }
  });

  const aspect = (textures[0].image as HTMLImageElement).width / (textures[0].image as HTMLImageElement).height;
  const viewportAspect = viewport.width / viewport.height;
  
  let scaleX = viewport.width;
  let scaleY = viewport.height;
  
  if (aspect > viewportAspect) {
    scaleX = viewport.height * aspect;
  } else {
    scaleY = viewport.width / aspect;
  }

  return (
    <mesh ref={mesh} scale={[scaleX, scaleY, 1]}>
      <planeGeometry args={[1, 1, 1, 1]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </mesh>
  );
}
