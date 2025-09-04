"use client";

import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";

const GradientBackground = () => {
    const materialRef = useRef<THREE.ShaderMaterial>(null);

    // JS smoothstep function
    const smoothstep = (edge0: number, edge1: number, x: number) => {
        const t = Math.min(Math.max((x - edge0) / (edge1 - edge0), 0.0), 1.0);
        return t * t * (3.0 - 2.0 * t);
    };

    useFrame(({ clock }) => {
        if (materialRef.current) {
            const elapsed = clock.getElapsedTime();
            materialRef.current.uniforms.uTime.value = elapsed;

            // Fade opacity in over 2.5 seconds with smoothstep easing
            const t = smoothstep(0, 2.5, elapsed);
            materialRef.current.uniforms.uOpacity.value = t;
        }
    });

    return (
        <mesh>
            <planeGeometry args={[2, 2]} />
            <shaderMaterial
                ref={materialRef}
                transparent={true}
                uniforms={{
                    uTime: { value: 0 },
                    uOpacity: { value: 0 }, // eased fade-in opacity
                    color1: { value: new THREE.Color("#ff9eb5") }, // soft pink
                    color2: { value: new THREE.Color("#9ecbff") }, // soft blue
                    color3: { value: new THREE.Color("#ffd59e") }, // soft peach
                }}
                fragmentShader={`
          uniform float uTime;
uniform float uOpacity;
uniform vec3 color1;
uniform vec3 color2;
uniform vec3 color3;

varying vec2 vUv;

float noise(vec2 p) {
  return sin(p.x) * cos(p.y);
}

void main() {
  vec2 uv = vUv * 3.0;

  // Animate waves
  float wave = sin(uv.x * 1.5 + uTime * 0.4) * 0.2 
             + cos(uv.y * 1.5 + uTime * 0.3) * 0.2;

  float n = noise(uv + uTime * 0.2 + wave);

  vec3 col = mix(color1, color2, n * 0.5 + 0.5);
  col = mix(col, color3, 0.5 + 0.5 * sin(uTime * 0.5 + uv.x));

  // Wavy fade mask (organic, less predictable)
float waveEdge = vUv.y 
  + 0.15 * sin(vUv.x * 2.5 + uTime * 0.25)   // medium wave
  + 0.10 * cos(vUv.x * 1.3 - uTime * 0.18)   // slower, offset wave
  + 0.06 * sin(vUv.x * 4.5 + uTime * 0.4)    // slightly faster ripples
  + 0.03 * cos(vUv.x * 7.0 - uTime * 0.33);  // fine variation

// Add some pseudo-random noise based on UV + time
float noise = sin((vUv.x + uTime * 0.07) * 12.0) * 0.015;
waveEdge += noise;

// Keep the fade controlled
float fadeTop = smoothstep(0.65, 0.3, waveEdge);

  // Desaturate slightly for softness
  float gray = dot(col, vec3(0.299, 0.587, 0.114));
  col = mix(col, vec3(gray), 0.25);

  // Final with fade + opacity
  gl_FragColor = vec4(col, fadeTop * uOpacity);
}

        `}
                vertexShader={`
          varying vec2 vUv;
          void main() {
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
        <div className="fixed h-screen inset-0 -z-10">
            <Canvas>
                <GradientBackground />
            </Canvas>
        </div>
    );
}
