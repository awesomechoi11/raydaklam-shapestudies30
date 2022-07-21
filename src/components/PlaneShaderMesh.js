import React, { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';

const vertexShader = `
varying vec2 vUv;
void main() {
  gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
  vUv = uv;
}
`;
const fragmentShader = `
uniform float uThreshold;
varying vec2 vUv;

float circle(in vec2 _st, in vec2 pos, in float _radius){
  vec2 dist = _st-pos;
  return 1.-smoothstep(_radius-(_radius*0.01), _radius+(_radius*0.01), dot(dist,dist)*4.0);
}

void main() {

  vec3 col = 0.5 + 0.5 * cos(uThreshold + vUv.xyx + vec3(0, 2, 4));

  float circle1 = circle(vUv, vec2(0.5), 0.4);
  if(circle1 > 0.){
    col = vec3(0.);
  }

  gl_FragColor = vec4(col, 1.0);
}
`;

export default function PlaneShaderMesh() {
  const material = useRef();
  const ref = useRef();
  useFrame(({ clock }) => {
    if (!material?.current) return;

    material.current.uniforms.uThreshold.value =
      (Math.sin(clock.elapsedTime / 2) + 1) / 2;
  });

  const { viewport, camera } = useThree();
  const { width: vw, height: vh } = viewport.getCurrentViewport(
    camera,
    [0, 0, 0]
  );

  const desiredRatio = 1;

  return (
    <mesh ref={ref}>
      <planeBufferGeometry args={[vw, vh, 1, 1]} />
      <shaderMaterial
        uniforms={{
          uThreshold: 0,
          uVW: vw,
          uVH: vh,
          uDesiredRatio: desiredRatio,
        }}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
      />
    </mesh>
  );
}
