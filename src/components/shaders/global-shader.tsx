"use client";

import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useMemo, useEffect } from "react";
import { useShaderStore } from "@/stores/shaderStore";

function GradientShader() {
    const materialRef = useRef<THREE.ShaderMaterial>(null);
    const startTimeRef = useRef<number | null>(null);

    // Subscribe to color from the zustand store
    const color = useShaderStore((s) => s.color);

    // Parse rgb() string → THREE.Color
    const colorObject = useMemo(() => {
        const match = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);

        if (!match) return new THREE.Color(0.5, 0.5, 0.5);

        return new THREE.Color(
            parseInt(match[1]) / 255,
            parseInt(match[2]) / 255,
            parseInt(match[3]) / 255
        );
    }, [color]);

    // Reset fade when colour changes
    useEffect(() => {
        startTimeRef.current = null;
    }, [color]);

    useFrame(({ clock }) => {
        if (!materialRef.current) return;

        if (startTimeRef.current === null) {
            startTimeRef.current = clock.getElapsedTime();
        }

        const t = clock.getElapsedTime() - startTimeRef.current;
        materialRef.current.uniforms.uOpacity.value = Math.min(1, t / 0.5);
    });

    return (
        <mesh key={color}>
            <planeGeometry args={[2, 2]} />
            <shaderMaterial
                ref={materialRef}
                transparent
                uniforms={{
                    uOpacity: { value: 0 },
                    color1: { value: colorObject },
                }}
                vertexShader={vertexShader}
                fragmentShader={fragmentShader}
            />
        </mesh>
    );
}

export default function ShaderBackground() {
    return (
        <div className="absolute inset-0 -z-10 w-full h-screen">
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
varying vec2 vUv;
void main() {
    vec2 uv = vUv;
    // Sharp drape: barely visible left, pronounced right
    // Much steeper gradient from left to right
    float dropAmount = mix(0.002, 0.12, pow(uv.x, 2.5));
    // Aggressive curve for sharp draping effect
    float xEased = pow(uv.x, 0.5);
    float curveDrop = dropAmount * pow(xEased, 3.0);
    // Distance from top edge adjusted by the draping curve
    float distFromTop = (1.0 - uv.y) - curveDrop;
    // Tight fade that follows the drape
    float intensity = smoothstep(0.18, -0.08, distFromTop);
    // Sharp fade at top edge with more aggressive left-to-right variation
    float topFade = mix(0.12, 0.25, pow(uv.x, 2.0));
    intensity *= smoothstep(topFade, 0.0, 1.0 - uv.y);
    // Sharp overall fade
    intensity = pow(intensity, 1.4);
    // Keep the color at full brightness, only fade the alpha
    vec3 col = color1;
    float totalAlpha = intensity * uOpacity;
    gl_FragColor = vec4(col, totalAlpha);
}
`;