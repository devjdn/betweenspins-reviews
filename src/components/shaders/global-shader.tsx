"use client";

import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useMemo, useEffect } from "react";
import { useTheme } from "next-themes";
import { useShaderStore } from "@/stores/shaderStore";

function GradientShader() {
    const materialRef = useRef<THREE.ShaderMaterial>(null);
    const startTimeRef = useRef<number | null>(null);
    const { resolvedTheme } = useTheme();

    // Subscribe to color from the zustand store
    const color = useShaderStore((s) => s.color);

    // Generate color based on theme
    const colorObject = useMemo(() => {
        // Parse RGB
        const match = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
        if (match) {
            const r = parseInt(match[1]) / 255;
            const g = parseInt(match[2]) / 255;
            const b = parseInt(match[3]) / 255;
            const threeColor = new THREE.Color(r, g, b);

            if (resolvedTheme === "light") {
                // Convert to HSL for easier manipulation
                const hsl = { h: 0, s: 0, l: 0 };
                threeColor.getHSL(hsl);

                // Reduce saturation significantly and increase lightness
                hsl.s *= 0.3; // Reduce saturation to 30% of original
                hsl.l = Math.min(0.95, hsl.l + 0.4); // Increase lightness, cap at 95%

                threeColor.setHSL(hsl.h, hsl.s, hsl.l);
            }

            return threeColor;
        }
        // Fallback
        return new THREE.Color(0.5, 0.5, 0.5);
    }, [color, resolvedTheme]);

    // Create a key from color and theme to force remount
    const colorKey = `${color}-${resolvedTheme}`;

    // Reset start time when color or theme changes
    useEffect(() => {
        startTimeRef.current = null;
    }, [colorKey]);

    useFrame(({ clock }) => {
        if (!materialRef.current) return;

        // Initialize start time on first frame
        if (startTimeRef.current === null) {
            startTimeRef.current = clock.getElapsedTime();
        }

        const t = clock.getElapsedTime() - startTimeRef.current;
        const fade = Math.min(1, t / 0.5); // 0.5s fade in

        // Update opacity for fade-in effect
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
                    color1: { value: colorObject },
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

varying vec2 vUv;

void main() {
    vec2 uv = vUv;

    // Define how far down the gradient extends at different x positions
    // Left side: extends down 0.2 units, Right side: extends down 0.4 units
    float dropAmount = mix(0.2, 0.4, uv.x);
    
    // Add smooth easing for organic curve
    float xEased = pow(uv.x, 0.7);
    float curveDrop = dropAmount * (1.0 - cos(xEased * 3.14159)) * 0.5;
    
    // Distance from top edge (1.0) adjusted by the curve
    float distFromTop = (1.0 - uv.y) - curveDrop;
    
    // Much softer, more gradual fade - increased the range significantly
    float intensity = smoothstep(0.25, -curveDrop, distFromTop);
    
    // Gentler fade at the very top edge
    intensity *= smoothstep(0.5, 0.0, 1.0 - uv.y);
    
    // Additional soft overall fade to eliminate hard edges
    intensity = pow(intensity, 1.3);
    
    vec3 col = color1 * intensity;
    float totalAlpha = intensity * uOpacity;

    gl_FragColor = vec4(col, totalAlpha);
}
`;
