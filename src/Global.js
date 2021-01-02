// import { createGlobalState } from "react-hooks-global-state";

import create from "zustand";
import createEnemysList from "./components/Enemy";

export const Scene = {
  Opning: 0,
  Playing: 1,
  GameOver: 2
};

export const useStore = create((set) => ({
  tap: false,
  tapTrue: () => set((state) => ({ tap: true })),
  tapFalse: () => set((state) => ({ tap: false })),
  speed: 0.08,
  enemyGroupA: createEnemysList,
  setEnemyGroupA: (x) => set((state) => ({ enemyGroupA: x }))
}));
