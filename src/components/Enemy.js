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
  const args = [5, 2, 1];
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
    <group ref={ref}>
      <mesh
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
  const args = [2, 2, 1];
  const physicsBox = {
    type: "Static",
    fixedRotation: true,
    mass: 1,
    args: args,
    name: "end",
position: [-2,0,0],
    onCollide: (obj) => {
      // if (obj.body.name === "floor") setLanding(true);
      // if (obj.body.name === "enemy") {
      //   console.log("gameover");
      console.log("end");
    }
  };
  const [ref, api] = useBox(() => physicsBox);
  // この値になったら位置を再設定
  const returnX = 0;
  const startX = 10;
  // const positionCreate =
  const [groupA] = useState(createEnemysList(number, startX));

  useFrame(() => {
    // if (jikkou)
    groupA.map((p) => (p.position.x -= speed));
    // for (let i = 0; i < groupA.length; i++) {
    //   if (groupA[i].position.x < returnX) groupA[i].position.x = 50;
    // }
  });

  return (
    <group>
      {groupA.map((value, index) => (
        <Enemy2 value={value} key={index} />
      ))}
      <mesh name="end" ref={ref}>
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
// export default EnemyData;
