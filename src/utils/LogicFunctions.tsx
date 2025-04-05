import { blockColorType, positionType, TetriminoType } from "./types";
import { Rows, Cols } from "./utils";

export function isValidPosition(
  blocks: number[][],
  posX: number,
  posY: number,
  grids: number[][]
): boolean {
  for (let i = 0; i < blocks.length; i++) {
    for (let j = 0; j < blocks[i].length; j++) {
      if (blocks[i][j]) {
        const newPosX = posX + j;
        const newPosY = posY + i;

        if (newPosX < 0 || newPosX >= Cols || newPosY < 0 || newPosY >= Rows) {
          return false;
        }

        if (
          newPosY >= 0 &&
          newPosY < Rows &&
          newPosX >= 0 &&
          newPosX < Cols &&
          grids[newPosY][newPosX] === -1
        ) {
          return false;
        }
      }
    }
  }
  return true;
}

export const canMoveDown = (
  isGameOver: boolean,
  currentTetromino: TetriminoType,
  position: positionType,
  grids: number[][]
) => {
  if (isGameOver) return false;
  if (!currentTetromino) return false;

  for (let i = 0; i < currentTetromino.blocks.length; i++) {
    for (let j = 0; j < currentTetromino.blocks[i].length; j++) {
      if (currentTetromino.blocks[i][j]) {
        const newPosY = position.y + i + 1;
        const newPosX = position.x + j;
        if (newPosY == Rows || grids[newPosY][newPosX] === -1) {
          return false;
        }
      }
    }
  }

  return true;
};

export const getCellColor = (
  value: number,
  rowIdx: number,
  colIdx: number,
  currentColor: string,
  blocksColors: blockColorType
): string => {
  if (value === 1) {
    return currentColor;
  } else if (value === -1) {
    const posKey = `${rowIdx}-${colIdx}`;
    return blocksColors[posKey] || "gray";
  }
  return "transparent";
};

export const updateGrid = (
  newGrid: number[][],
  currentTetromino: TetriminoType,
  position: positionType
) => {
  currentTetromino!.blocks.forEach((rows: number[], i: number) => {
    rows.forEach((cell: number, j: number) => {
      if (cell) {
        const newPosX = position.x + j;
        const newPosY = position.y + i;

        if (newPosY >= 0 && newPosY < Rows && newPosX >= 0 && newPosX < Cols) {
          newGrid[newPosY][newPosX] = 1;
        }
      }
    });
  });
};

export const checkMoveIsPossible = (
  grids: number[][],
  currentTetromino: TetriminoType,
  position: positionType,
  move: boolean,
  direction: number
) => {
  for (let i = 0; i < currentTetromino!.blocks.length; i++) {
    for (let j = 0; j < currentTetromino!.blocks[i].length; j++) {
      if (currentTetromino!.blocks[i][j]) {
        const newPosX = position.x + j + direction;
        const newPosY = position.y + i;

        if (newPosX >= Cols) {
          move = false;
          break;
        }

        if (
          newPosX < 0 ||
          (newPosY >= 0 &&
            newPosY < Rows &&
            newPosX >= 0 &&
            newPosX < Cols &&
            grids[newPosY][newPosX] === -1)
        ) {
          move = false;
          break;
        }
      }
    }
    if (!move) break;
  }

  return move;
};

export function handleTetrominoLanding(
  currentTetromino: TetriminoType,
  position: positionType,
  setGrids: React.Dispatch<React.SetStateAction<number[][]>>,
  setBlocksColors: React.Dispatch<React.SetStateAction<blockColorType>>,
  currentColor: string
) {
  setGrids((prevGrid) => {
    const newGrid = Array.from({ length: Rows }, (_, i) =>
      Array.from({ length: Cols }, (_, j) => (prevGrid[i][j] === -1 ? -1 : 0))
    );

    currentTetromino.blocks.forEach((rows, i) => {
      rows.forEach((cell, j) => {
        if (cell) {
          const newPosX = position.x + j;
          const newPosY = position.y + i;

          newGrid[newPosY][newPosX] = -1;

          const posKey = `${newPosY}-${newPosX}`;
          setBlocksColors((prev) => ({
            ...prev,
            [posKey]: currentColor,
          }));
        }
      });
    });

    return newGrid;
  });
}

export function spawnNewTetromino(
  allTetrinos: TetriminoType[],
  setCurrentTetromino: React.Dispatch<
    React.SetStateAction<TetriminoType | undefined>
  >,
  setCurrentColor: React.Dispatch<React.SetStateAction<string>>,
  setPosition: React.Dispatch<React.SetStateAction<positionType>>
) {
  const random = allTetrinos[Math.floor(Math.random() * allTetrinos.length)];
  setCurrentTetromino(random);
  setCurrentColor(random.color);
  setPosition({ x: 4, y: 0 });
}

export function getRotatedBlocks(blocks: number[][]): number[][] {
  const n = blocks.length;
  const rotated = Array.from({ length: n }, () => Array(n).fill(0));

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      rotated[j][n - 1 - i] = blocks[i][j];
    }
  }

  return rotated;
}

export function tryApplyRotation(
  rotated: number[][],
  position: positionType,
  grids: number[][],
  setPosition: React.Dispatch<React.SetStateAction<positionType>>,
  setCurrentTetromino: React.Dispatch<
    React.SetStateAction<TetriminoType | undefined>
  >,
  currentTetromino: TetriminoType
) {
  const kicks = [0, -1, 1]; // positions à essayer : current, gauche, droite

  for (const dx of kicks) {
    const newX = position.x + dx;
    if (isValidPosition(rotated, newX, position.y, grids)) {
      if (dx !== 0) setPosition((prev) => ({ ...prev, x: newX }));
      setCurrentTetromino({ ...currentTetromino, blocks: rotated });
      break;
    }
  }
}

export function rotateTetromino(
  isGameOver: boolean,
  currentTetromino: TetriminoType,
  setCurrentTetromino: React.Dispatch<
    React.SetStateAction<TetriminoType | undefined>
  >,
  position: positionType,
  grids: number[][],
  setPosition: React.Dispatch<React.SetStateAction<positionType>>
) {
  if (isGameOver || !currentTetromino) return;

  const rotated = getRotatedBlocks(currentTetromino.blocks);

  tryApplyRotation(
    rotated,
    position,
    grids,
    setPosition,
    setCurrentTetromino,
    currentTetromino
  );
}
