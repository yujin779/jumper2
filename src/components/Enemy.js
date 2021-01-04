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

const EnemyColider = ({ value, index }) => {
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

const EnemyObj = ({ value, index }) => {
  const { nodes, materials, animations } = useGLTF(littleCactus);
  const gltfRef = useRef();
  // nodes.ObjObject.rotateX.x = 180;
  // console.log("rx", gltfRef.current.rotation.x);
  // console.log("gltfRef", gltfRef);
  // const dummy = useMemo(() => new THREE.Object3D(), []);
  useFrame(() => {
    gltfRef.current.position.x = value.position.x;
    gltfRef.current.rotation.x = 1.5;
    // console.log("rx",gltfRef.current.rotation.x);
    // nodes.ObjObject.rotateX.x += 0.1;
    // gltfRef.current
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
  const distance = 5;
  const [groupA] = useState(createEnemysList(number, startX));

  useFrame(() => {
    groupA.map((p) => {
      if (p.position.x < returnX)
        p.position.x =
          Math.max.apply(
            null,
            groupA.map((o) => o.position.x)
          ) + distance;
      return (p.position.x -= speed);
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
