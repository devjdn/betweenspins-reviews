"use client";

import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";

const GradientBackground = () => {
    const materialRef = useRef<THREE.ShaderMaterial>(null);

    const smoothstep = (edge0: number, edge1: number, x: number) => {
        const t = Math.min(Math.max((x - edge0) / (edge1 - edge0), 0.0), 1.0);
        return t * t * (3.0 - 2.0 * t);
    };

    useFrame(({ clock }) => {
        if (materialRef.current) {
            const elapsed = clock.getElapsedTime();
            materialRef.current.uniforms.uTime.value = elapsed;
            const t = smoothstep(0, 2.5, elapsed);
            materialRef.current.uniforms.uOpacity.value = t;
        }
    });

    return (
        <mesh>
            <planeGeometry args={[2, 2]} />
            <shaderMaterial
                ref={materialRef}
                transparent
                uniforms={{
                    uTime: { value: 0 },
                    uOpacity: { value: 0 },
                    color1: { value: new THREE.Color("#F4A6FF") },
                    color2: { value: new THREE.Color("#9ecbff") },
                    color3: { value: new THREE.Color("#ffd59e") },
                }}
                fragmentShader={`
uniform float uTime;
uniform float uOpacity;
uniform vec3 color1;
uniform vec3 color2;
uniform vec3 color3;

varying vec2 vUv;

// Simple pseudo-random noise function
float noise(vec2 p){
  return sin(p.x*12.9898 + p.y*78.233)*43758.5453 - floor(sin(p.x*12.9898 + p.y*78.233)*43758.5453);
}

void main(){
  vec2 uv = vUv * 3.0;

  // Multiple layered waves with different speeds/amplitudes
  float wave1 = sin(uv.x*1.5 + uTime*0.4) * 0.25;
  float wave2 = cos(uv.x*2.3 - uTime*0.35) * 0.18;
  float wave3 = sin(uv.x*3.7 + uTime*0.6) * 0.12;
  float wave4 = cos(uv.x*5.5 - uTime*0.25) * 0.08;

  float wave = wave1 + wave2 + wave3 + wave4;

  // Extra sporadic noise
  float n = noise(uv + uTime * 0.3) * 0.15;

  vec3 col = mix(color1, color2, wave*0.5 + 0.5 + n);
  col = mix(col, color3, 0.5 + 0.5*sin(uTime*0.5 + uv.x*1.3));

  // Organic fade mask
  float waveEdge = vUv.y 
    + 0.2*sin(vUv.x*2.5 + uTime*0.25)
    + 0.12*cos(vUv.x*1.3 - uTime*0.18)
    + 0.07*sin(vUv.x*4.5 + uTime*0.4)
    + 0.04*cos(vUv.x*7.0 - uTime*0.33)
    + 0.02*sin(vUv.x*11.0 + uTime*0.5);

  // Extra sporadic variation
  waveEdge += sin((vUv.x + uTime*0.09)*17.0)*0.02;
  waveEdge += cos((vUv.y - uTime*0.05)*13.0)*0.015;

  float fadeTop = smoothstep(0.65, 0.3, waveEdge);

  // Slight desaturation for softness
  float gray = dot(col, vec3(0.299,0.587,0.114));
  col = mix(col, vec3(gray), 0.25);

  gl_FragColor = vec4(col, fadeTop * uOpacity);
}
        `}
                vertexShader={`
varying vec2 vUv;
void main(){
  vUv = uv;
  gl_Position = vec4(position, 1.0);
}
        `}
            />
        </mesh>
    );
};

export default function Background() {
    return (
        <div className="absolute w-full inset-0 -z-10">
            <Canvas>
                <GradientBackground />
            </Canvas>
        </div>
    );
}
