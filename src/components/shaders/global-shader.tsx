"use client";

import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useMemo, useEffect } from "react";
import { useShaderStore } from "@/stores/shaderStore";

function GradientShader() {
    const materialRef = useRef<THREE.ShaderMaterial>(null);
    const startTimeRef = useRef<number | null>(null);

    // Subcribing colors to the zustand store
    const colors = useShaderStore((s) => s.colors);
    const { color1, color2, color3 } = colors;

    // Create a key from colors to force remount
    const colorKey = `${color1}-${color2}-${color3}`;

    // Log when Zustand values change
    useEffect(() => {
        console.log("1. GradientShader: Zustand colors changed:", {
            color1,
            color2,
            color3,
        });
    }, [color1, color2, color3]);

    // Create new Color objects whenever colors change
    const colorObjects = useMemo(() => {
        console.log(
            "2. GradientShader: useMemo creating new THREE.Color objects:",
            { color1, color2, color3 }
        );
        return {
            color1: new THREE.Color(color1),
            color2: new THREE.Color(color2),
            color3: new THREE.Color(color3),
        };
    }, [color1, color2, color3]);

    useFrame(({ clock }) => {
        if (!materialRef.current) return;

        // Initialize start time on first frame
        if (startTimeRef.current === null) {
            startTimeRef.current = clock.getElapsedTime();
        }

        const t = clock.getElapsedTime() - startTimeRef.current;
        const fade = Math.min(1, t / 0.5); // 0.5s fade in (faster than before)
        materialRef.current.uniforms.uOpacity.value = fade;
    });

    return (
        <mesh key={colorKey}>
            <planeGeometry args={[2, 2]} />
            <shaderMaterial
                ref={materialRef}
                transparent
                uniforms={{
                    uOpacity: { value: 0 },
                    color1: { value: colorObjects.color1 },
                    color2: { value: colorObjects.color2 },
                    color3: { value: colorObjects.color3 },
                }}
                fragmentShader={fragmentShader}
                vertexShader={vertexShader}
            />
        </mesh>
    );
}

export default function ShaderBackground() {
    return (
        <div className="absolute inset-0 -z-10">
            <Canvas>
                <GradientShader />
            </Canvas>
        </div>
    );
}

/* -------------------------
   Shaders kept clean below
-------------------------- */

const vertexShader = `
varying vec2 vUv;
void main(){
  vUv = uv;
  gl_Position = vec4(position, 1.0);
}
`;

const fragmentShader = `
uniform float uOpacity;
uniform vec3 color1;
uniform vec3 color2;
uniform vec3 color3;

varying vec2 vUv;

void main() {
    vec2 uv = vUv;

    // Top-left corner - sharp and close to edge
    float d1 = smoothstep(0.6, 0.0, distance(uv, vec2(-0.05, 1.05))); 
    
    // Top-right corner - extends more into the page, rounded inward
    float d2 = smoothstep(0.85, 0.0, distance(uv, vec2(1.15, 1.1))); 
    
    // Additional top emphasis - spreads across the top
    float d3 = smoothstep(0.5, 0.0, distance(uv, vec2(0.5, 1.15)));

    // Blend the colors
    vec3 col = 
        d1 * color1 * 0.8 +
        d2 * color2 * 0.75 +
        d3 * color3 * 0.7;

    // Calculate total opacity - fades to transparent in center and bottom
    float totalAlpha = (d1 + d2 + d3) * uOpacity;

    gl_FragColor = vec4(col, totalAlpha);
}

`;
