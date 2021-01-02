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

const speed = 0.1;

export const createEnemysList = (number, startX) => {
  const enemysList = [];
  // const startX = 15;
  // const number = 10;
  for (let i = 0; i < number; i++) {
    let p = startX;
    if (i !== 0) p = enemysList[i - 1].position.x + 5;

    enemysList.push({ position: { x: p, y: 1, z: 0 } });
  }
  console.log("enemysList", enemysList);
  return enemysList;
};

const Enemy = ({ value }) => {
  // console.log("group", value);
  // 物理演算させるボックスのサイズ
  const args = [2, 2, 1];
  const physicsBox = {
    type: "Static",
    fixedRotation: true,
    mass: 1,
    args: args
  };
  const [ref, api] = useBox(() => physicsBox);
  useFrame(() => {
    api.position.set(value[0].position.x, 0, 0);
  });
  return (
    <group ref={ref}>
      {value.map((value, index) => (
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
      ))}
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
  const [groupA, setGroupA] = useState(createEnemysList(number, startX));
  console.log("gp", groupA[groupA.length - 1].position.x);
  const [groupB, setGroupB] = useState(
    createEnemysList(number, groupA[groupA.length - 1].position.x)
  );
  const [jikkou, setJikkou] = useState(true);
  // const [obj2, setObj2] = useState(
  //   createEnemysList(number, obj[obj.length - 1].position[0])
  // );
  // const? obj = createEnemysList(3, 1);
  // const [landing, setLanding] = useState(false);
  useFrame(() => {
    if (jikkou) groupA.map((p) => (p.position.x -= speed));
    if (jikkou) groupB.map((p) => (p.position.x -= speed));

    if (groupA[groupA.length - 1].position.x < returnX) {
      console.log("b", groupB[groupB.length - 1].position.x);
      setGroupA(createEnemysList(number, groupB[groupB.length - 1].position.x));
      console.log("a", groupA[0].position.x);
      setJikkou(false);
    }
    // if (groupB[groupB.length - 1].position.x < returnX) {
    //   setGroupB(createEnemysList(number, groupA[groupA.length - 1].position.x));
    // }

    // console.log(groupA[groupA.length - 1].position.x);
    // const p = obj[obj.length - 1].position[0];
    // if (p < -14)
    //   setObj(createEnemysList(number, obj2[obj2.length - 1].position[0]));
  });

  return (
    <group>
      <Enemy value={groupA} />
      <Enemy value={groupB} />
    </group>
  );
};
// export default EnemyData;
