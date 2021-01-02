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

export const createEnemysList = (number, startX) => {
  const enemysList = [];
  // const startX = 15;
  // const number = 10;
  for (let i = 0; i < number; i++) {
    let p = startX + 15;
    if (i !== 0) p = enemysList[i - 1].position.x + Math.random() * 10 + 15;

    enemysList.push({ position: { x: p, y: 1, z: 0 } });
  }
  return enemysList;
};

const Enemy = () => {
  return null;
};

/*
 * 接触するとgameover
 */
const EnemyData = ({ number }) => {
  // const positionCreate =
  const [groupA, setGroupA] = useState(createEnemysList(number, 15));
  // const [obj2, setObj2] = useState(
  //   createEnemysList(number, obj[obj.length - 1].position[0])
  // );
  // const? obj = createEnemysList(3, 1);
  // const [landing, setLanding] = useState(false);
  useFrame(() => {
    for (let i = 0; i < number * 2; i++) {
      if (i < number) {
        groupA[i].position.x -= speed;
      } else {
        // api.at(i).position.set(...obj2[i - number].position);
        // obj2[i - number].position[0] -= speed;
      }
    }

    if (groupA[groupA.length - 1].position.x < -14) {
      setGroupA(createEnemysList(number, 15));
    }

    // console.log(groupA[groupA.length - 1].position.x);
    // const p = obj[obj.length - 1].position[0];
    // if (p < -14)
    //   setObj(createEnemysList(number, obj2[obj2.length - 1].position[0]));
  });

  return null;
};
export default EnemyData;
