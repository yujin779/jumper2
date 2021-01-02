import React, { useRef, useState, useMemo } from "react";
import * as THREE from "three";
import { View, Text } from "react-native";
import { Canvas, useFrame, useThree, extend } from "react-three-fiber";
// import * as CANNON from "cannon";
// import { createGlobalState } from "react-hooks-global-state";
import { Physics, useBox, usePlane, useSphere } from "use-cannon";
import { useGlobalState } from "../Global";
import { useStore } from "../Global";

const speed = 0.1;

const createEnemysList = (number, startX) => {
  const enemysList = [];
  // const startX = 15;
  // const number = 10;
  for (let i = 0; i < number; i++) {
    let p = startX + 15;
    if (i !== 0) p = enemysList[i - 1].position[0] + Math.random() * 10 + 15;

    enemysList.push({ position: [p, 1, 0] });
  }
  return enemysList;
};

/*
 * 接触するとgameover
 */
const Enemy = ({ number }) => {
  const args = [1, 1, 1];
  const [ref, api] = useBox(() => ({
    type: "Static",
    mass: 1,
    args: args,
    position: [Math.random() - 0.5, -5, Math.random() - 0.5]
  }));
  // const positionCreate =
  const [obj, setObj] = useState(createEnemysList(number, 15));
  const [obj2, setObj2] = useState(
    createEnemysList(number, obj[obj.length - 1].position[0])
  );
  // const? obj = createEnemysList(3, 1);
  const colors = useMemo(() => {
    const array = new Float32Array(number * 3);
    const color = new THREE.Color();
    for (let i = 0; i < number * 2; i++)
      color
        .set("green")
        .convertSRGBToLinear()
        .toArray(array, i * 3);
    return array;
  }, [number]);
  useFrame(() => {
    for (let i = 0; i < number * 2; i++) {
      if (i < number) {
        api.at(i).position.set(...obj[i].position);
        obj[i].position[0] -= speed;
      } else {
        api.at(i).position.set(...obj2[i - number].position);
        obj2[i - number].position[0] -= speed;
      }
      // if(i==0) console.log(obj[i].position.x);
      // api.at(i).position.set(0, 1, 0);
    }

    const p = obj[obj.length - 1].position[0];
    if (p < -14)
      setObj(createEnemysList(number, obj2[obj2.length - 1].position[0]));
    const p2 = obj2[obj2.length - 1].position[0];
    if (p2 < -14)
      setObj2(createEnemysList(number, obj[obj2.length - 1].position[0]));
    // console.log(p);
  });

  return (
    <instancedMesh
      receiveShadow
      castShadow
      ref={ref}
      args={[null, null, number * 2]}
      name={"enemy"}
    >
      <boxBufferGeometry attach="geometry" args={args}>
        <instancedBufferAttribute
          attachObject={["attributes", "color"]}
          args={[colors, 3]}
        />
        {/* <mesh>
          <boxBufferGeometry attach="geometry" args={(2, 2, 2)} />
        </mesh> */}
      </boxBufferGeometry>

      <meshLambertMaterial
        attach="material"
        vertexColors={THREE.VertexColors}
      />
    </instancedMesh>
  );
};
export default Enemy;
