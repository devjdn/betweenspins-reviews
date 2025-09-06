"use client";

import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useEffect, useState } from "react";
import ColorThief from "colorthief";

const GradientBackground = ({ imageSrc }: { imageSrc: string }) => {
    const materialRef = useRef<THREE.ShaderMaterial>(null);
    const [colors, setColors] = useState([
        new THREE.Color("#ff9eb5"),
        new THREE.Color("#9ecbff"),
        new THREE.Color("#ffd59e"),
    ]);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        if (!imageSrc) return;
        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.src = imageSrc;

        img.onload = () => {
            try {
                const colorThief = new ColorThief();
                const palette = colorThief.getPalette(img, 3);
                if (palette) {
                    setColors(
                        palette.map(
                            (rgb) => new THREE.Color(...rgb.map((c) => c / 255))
                        )
                    );
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoaded(true);
            }
        };
    }, [imageSrc]);

    const smoothstep = (edge0: number, edge1: number, x: number) => {
        const t = Math.min(Math.max((x - edge0) / (edge1 - edge0), 0), 1);
        return t * t * (3 - 2 * t);
    };

    useFrame(({ clock }) => {
        if (!materialRef.current) return;
        const elapsed = clock.getElapsedTime();

        materialRef.current.uniforms.uTime.value = elapsed;
        materialRef.current.uniforms.uOpacity.value = smoothstep(
            0,
            2.5,
            elapsed
        );
        materialRef.current.uniforms.color1.value = colors[0];
        materialRef.current.uniforms.color2.value = colors[1];
        materialRef.current.uniforms.color3.value = colors[2];
    });

    return (
        <>
            {loaded && (
                <mesh>
                    <planeGeometry args={[2, 2]} />
                    <shaderMaterial
                        ref={materialRef}
                        transparent
                        uniforms={{
                            uTime: { value: 0 },
                            uOpacity: { value: 0 },
                            color1: { value: colors[0] },
                            color2: { value: colors[1] },
                            color3: { value: colors[2] },
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
              varying vec2 vUv;

              float noise(vec2 p) { return sin(p.x) * cos(p.y); }

              void main() {
                vec2 uv = vUv * 3.0;
                float wave = sin(uv.x * 1.5 + uTime * 0.4) * 0.2
                           + cos(uv.y * 1.5 + uTime * 0.3) * 0.2;
                float n = noise(uv + uTime * 0.2 + wave);

                vec3 col = mix(color1, color2, n * 0.5 + 0.5);
                col = mix(col, color3, 0.5 + 0.5 * sin(uTime * 0.5 + uv.x));

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
            )}
        </>
    );
};

export default function ColorThiefBackground({
    imageSrc,
}: {
    imageSrc: string;
}) {
    return (
        <div className="fixed inset-0 h-screen -z-10">
            <Canvas>
                <GradientBackground imageSrc={imageSrc} />
            </Canvas>
        </div>
    );
}
