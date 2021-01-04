import React, { useRef, useState, useMemo } from "react";
import * as THREE from "three";
import { View, Text } from "react-native";
import {
  Canvas,
  useFrame,
  useThree,
  extend,
  useLoader
} from "react-three-fiber";
// import * as CANNON from "cannon";
// import { createGlobalState } from "react-hooks-global-state";
import { Physics, useBox, usePlane, useSphere } from "use-cannon";
import { useStore } from "../Global";
import { BoxBufferGeometry } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import littleCactus from "../assets/gltf/littleCactus.glb";
import { useGLTF, PerspectiveCamera } from "@react-three/drei";

const speed = 0.04;

const EnemyColider = ({ value, index }) => {
  // 物理演算させるボックスのサイズ
  const args = [1, 2, 1];
  const physicsBox = {
    type: "Static",
    fixedRotation: true,
    mass: 1,
    args: args,
    position: [value.positionX, 0, 0]
  };
  const [ref, api] = useBox(() => physicsBox);
  useFrame(() => {
    //ポジション修正要
    api.position.set(value.positionX, 0, 0);
  });
  return (
    <mesh ref={ref} key={index}>
      <boxBufferGeometry attach="geometry" args={args} />
      <meshStandardMaterial
        attach="material"
        color={"orange"}
        transparent
        opacity={0.3}
      />
    </mesh>
  );
};

export const createEnemysList = (number, startX, distance) => {
  const enemysList = [];
  // const startX = 15;
  // const number = 10;
  for (let i = 0; i < number; i++) {
    let p = startX;
    console.log("sttx", p);
    if (i !== 0) p = enemysList[i - 1].positionX + distance;

    enemysList.push({ positionX: p, type: TypesOfEnemies[0] });
  }
  console.log("enemysList", enemysList);
  return enemysList;
};

const TypesOfEnemies = [
  {
    obj: { position: { x: -2.5, y: -0.7 }, rotation: { x: 1.5 } }
  }
];

const EnemyObj = ({ value, index }) => {
  const { nodes, materials, animations } = useGLTF(littleCactus);
  const gltfRef = useRef();
  useFrame(() => {
    gltfRef.current.position.x = value.positionX + value.type.obj.position.x;
    gltfRef.current.rotation.x = value.type.obj.rotation.x;
    gltfRef.current.position.y = value.type.obj.position.y;
  });
  return (
    <group>
      <mesh
        ref={gltfRef}
        material={nodes.ObjObject.material}
        geometry={nodes.ObjObject.geometry}
      />
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
  const distance = 3;
  const [groupA] = useState(createEnemysList(number, startX, distance));
  console.log(groupA);
  useFrame(() => {
    groupA.map((p) => {
      if (p.positionX < returnX)
        p.positionX =
          Math.max.apply(
            null,
            groupA.map((o) => o.positionX)
          ) + distance;
      return (p.positionX -= speed);
    });
  });

  return (
    <group>
      {groupA.map((value, index) => (
        <EnemyColider value={value} key={index} />
      ))}
      {groupA.map((value, index) => (
        <EnemyObj value={value} key={index} />
      ))}
    </group>
  );
};
