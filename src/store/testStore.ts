import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

interface JungleStore {
  bears: number;
  addBear: () => void;
  fishes: number;
  addFish: () => void;
}

// Zustand 5 + middleware 存在类型兼容性问题，需要使用 @ts-expect-error
// 参考: https://github.com/pmndrs/zustand/issues/2587
export const useJungleStore = create<JungleStore>()(
  //   @ts-expect-error - Zustand 5 middleware 类型问题
  devtools(
    immer((set) => ({
      bears: 0,
      // 使用 immer 后，set 回调函数中的 state 就可以直接**可变地**修改了
      // Immer 会确保底层状态仍然是不可变的，它会生成一个新的状态副本。
      addBear: () =>
        set((state) => {
          state.bears += 1;
        }),
      fishes: 0,
      addFish: () =>
        set((state) => {
          state.fishes += 1;
        }),
    })),
    { name: "JungleStore", enabled: true }
  )
);
