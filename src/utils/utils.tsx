import { TetriminoType } from "./types";

export const blockSize = 35
export const Cols = 10
export const Rows = 20

const T: TetriminoType = {
  blocks: [
    [1, 1, 1],
    [0, 1, 0],
    [0, 0, 0],
  ],
  color: "yellow",
};

const L: TetriminoType = {
  blocks: [
    [1, 0, 0],
    [1, 1, 1],
    [0, 0, 0],
  ],
  color: "blue",
};

const I: TetriminoType = {
  blocks: [
    [1, 1, 1, 1],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ],
  color: "brown",
};

const S: TetriminoType = {
  blocks: [
    [0, 1, 1],
    [1, 1, 0],
    [0, 0, 0],
  ],
  color: "orange",
};

const Z: TetriminoType = {
  blocks: [
    [1, 1, 0],
    [0, 1, 1],
    [0, 0, 0],
  ],
  color: "purple",
};

const O: TetriminoType = {
  blocks: [
    [0, 1, 0],
    [1, 1, 1],
    [0, 0, 0],
  ],
  color: "green",
};


const J: TetriminoType = {
  blocks: [
    [0, 0, 0],
    [1, 1, 1],
    [0, 0, 1],
  ],
  color: "red",
};

export const allTetrinos = [T, S, Z, I, O, L, J]