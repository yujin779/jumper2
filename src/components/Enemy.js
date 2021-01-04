import React, { useRef, useState, useMemo } from "react";
import * as THREE from "three";
import { View, Text } from "react-native";
import { Canvas, useFrame, useThree, extend } from "react-three-fiber";
// import * as CANNON from "cannon";
// import { createGlobalState } from "react-hooks-global-state";
import { Physics, useBox, usePlane, useSphere } from "use-cannon";
import { useGlobalState } from "../Global";
import { useStore } from "../Global";
import { BoxBufferGeometry } from "three";

const speed = 0.04;

export const createEnemysList = (number, startX) => {
  const enemysList = [];
  // const startX = 15;
  // const number = 10;
  for (let i = 0; i < number; i++) {
    let p = startX;
    console.log("sttx", p);
    if (i !== 0) p = enemysList[i - 1].position.x + 5;

    enemysList.push({ position: { x: p, y: 0, z: 0 } });
  }
  console.log("enemysList", enemysList);
  return enemysList;
};

const Enemy2 = ({ value, index }) => {
  // console.log("group", value);
  // 物理演算させるボックスのサイズ
  const args = [1, 2, 1];
  const physicsBox = {
    type: "Static",
    fixedRotation: true,
    mass: 1,
    args: args,
    position: [value.position.x, value.position.y, value.position.z]
  };
  const [ref, api] = useBox(() => physicsBox);
  useFrame(() => {
    api.position.set(value.position.x, value.position.y, value.position.z);
  });
  return (
    <group>
      <mesh
        ref={ref}
        position={[value.position.x, value.position.y, value.position.z]}
        key={index}
      >
        <boxBufferGeometry attach="geometry" args={args} />
        <meshStandardMaterial
          attach="material"
          color={"orange"}
          transparent
          opacity={0.3}
        />
      </mesh>
    </group>
  );
};

/*
 * 接触するとgameover
 */
export const EnemyData = ({ number }) => {
  // この値になったら位置を再設定
  const returnX = 0;
  const startX = 10;
  // const positionCreate =
  const [groupA] = useState(createEnemysList(number, startX));

  useFrame(() => {
    groupA.map((p) => {
      if (p.position.x < returnX)
        p.position.x =
          Math.max.apply(
            null,
            groupA.map((o) => o.position.x)
          ) + 5;
      return (p.position.x -= speed);
    });
  });

  return (
    <group>
      {groupA.map((value, index) => (
        <Enemy2 value={value} key={index} />
      ))}
    </group>
  );
};
// export default EnemyData;
