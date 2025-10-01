"use client";

import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useMemo } from "react";
import { useArtistColors } from "@/hooks/use-artist-colours";

const GradientBackground = ({ imageSrcs }: { imageSrcs: string[] }) => {
    const materialRef = useRef<THREE.ShaderMaterial>(null);

    // Grab dominant colors (1 per artist image)
    const colors = useArtistColors(imageSrcs);

    // Lock in up to 5 colors only once
    const topColors = useMemo(() => colors.slice(0, 5), [colors]);

    const smoothstep = (edge0: number, edge1: number, x: number) => {
        const t = Math.min(Math.max((x - edge0) / (edge1 - edge0), 0), 1);
        return t * t * (3 - 2 * t);
    };

    useFrame(({ clock }) => {
        if (!materialRef.current || topColors.length === 0) return;

        const elapsed = clock.getElapsedTime();
        materialRef.current.uniforms.uTime.value = elapsed;
        materialRef.current.uniforms.uOpacity.value = smoothstep(
            0,
            2.5,
            elapsed
        );

        // Set uniforms for up to 5 colors
        topColors.forEach((c, i) => {
            materialRef.current!.uniforms[`color${i + 1}`].value =
                new THREE.Color(
                    ...(c.map((c) => c / 255) as [number, number, number])
                );
        });
    });

    if (topColors.length < 1) return null;

    return (
        <mesh>
            <planeGeometry args={[2, 2]} />
            <shaderMaterial
                ref={materialRef}
                transparent
                uniforms={{
                    uTime: { value: 0 },
                    uOpacity: { value: 0 },
                    color1: { value: new THREE.Color("#ff9eb5") },
                    color2: { value: new THREE.Color("#9ecbff") },
                    color3: { value: new THREE.Color("#ffd59e") },
                    color4: { value: new THREE.Color("#baffc9") },
                    color5: { value: new THREE.Color("#ffffba") },
                }}
                vertexShader={`
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = vec4(position, 1.0);
          }
        `}
                fragmentShader={`
          uniform float uTime;
          uniform float uOpacity;
          uniform vec3 color1;
          uniform vec3 color2;
          uniform vec3 color3;
          uniform vec3 color4;
          uniform vec3 color5;
          varying vec2 vUv;

          float noise(vec2 p) { return sin(p.x) * cos(p.y); }

          void main() {
            vec2 uv = vUv * 3.0;
            float wave = sin(uv.x * 1.5 + uTime * 0.4) * 0.2
                       + cos(uv.y * 1.5 + uTime * 0.3) * 0.2;
            float n = noise(uv + uTime * 0.2 + wave);

            // Blend smoothly between 5 fixed colors
            vec3 col = mix(color1, color2, n * 0.5 + 0.5);
            col = mix(col, color3, 0.5 + 0.5 * sin(uTime * 0.3));
            col = mix(col, color4, 0.5 + 0.5 * cos(uTime * 0.2));
            col = mix(col, color5, 0.5 + 0.5 * sin(uTime * 0.15 + uv.x));

            float waveEdge = vUv.y
              + 0.15 * sin(vUv.x * 2.5 + uTime * 0.25)
              + 0.10 * cos(vUv.x * 1.3 - uTime * 0.18)
              + 0.06 * sin(vUv.x * 4.5 + uTime * 0.4)
              + 0.03 * cos(vUv.x * 7.0 - uTime * 0.33);

            float noiseVal = sin((vUv.x + uTime * 0.07) * 12.0) * 0.015;
            waveEdge += noiseVal;

            float fadeTop = smoothstep(0.65, 0.3, waveEdge);
            float gray = dot(col, vec3(0.299, 0.587, 0.114));
            col = mix(col, vec3(gray), 0.25);

            gl_FragColor = vec4(col, fadeTop * uOpacity);
          }
        `}
            />
        </mesh>
    );
};

export default function ArtistColorsBackground({
    imageSrcs,
}: {
    imageSrcs: string[];
}) {
    return (
        <div className="fixed inset-0 h-screen -z-10">
            <Canvas>
                <GradientBackground imageSrcs={imageSrcs} />
            </Canvas>
        </div>
    );
}
