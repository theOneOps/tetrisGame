import { useEffect, useState } from "react";
import { blockSize, Cols, Rows, allTetrinos } from "../utils/utils";
import {
  canMoveDown,
  checkMoveIsPossible,
  getCellColor,
  handleTetrominoLanding,
  rotateTetromino,
  spawnNewTetromino,
  updateGrid,
} from "../utils/LogicFunctions";
import { blockColorType, positionType, TetriminoType } from "../utils/types";

type ContainerProps = {
  isGameOver: boolean;
  setIsGameOver: React.Dispatch<React.SetStateAction<boolean>>;
  changeScore: React.Dispatch<React.SetStateAction<number>>;
  countClick: number;
};

export default function Container({
  isGameOver,
  setIsGameOver,
  changeScore,
  countClick,
}: ContainerProps) {
  const [grids, setGrids] = useState<number[][]>(
    Array.from({ length: Rows }, () => Array.from({ length: Cols }, () => 0))
  );
  const [position, setPosition] = useState<positionType>({
    x: 4,
    y: 0,
  });
  const [currentTetromino, setCurrentTetromino] = useState<TetriminoType>();
  const [currentColor, setCurrentColor] = useState("");
  const [currentInterval, setCurrentInterval] = useState(0);
  const [blocksColors, setBlocksColors] = useState<blockColorType>({});
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isGameOver) {
      setGrids(
        Array.from({ length: Rows }, () =>
          Array.from({ length: Cols }, () => 0)
        )
      );
      if (!currentTetromino) {
        const randomTetromino =
          allTetrinos[Math.floor(Math.random() * allTetrinos.length)];
        setCurrentTetromino(randomTetromino);
        setCurrentColor(randomTetromino.color);
      }
    }
  }, []);

  function restartGame() {
    setGrids(Array.from({ length: Rows }, () => Array(Cols).fill(0)));
    const newTetro =
      allTetrinos[Math.floor(Math.random() * allTetrinos.length)];
    setCurrentTetromino(newTetro);
    changeScore(0);
    setCurrentColor(newTetro.color);
    setPosition({ x: 4, y: 0 });
    setBlocksColors({});
    if (currentInterval) {
      clearInterval(currentInterval);
      setCurrentInterval(0);
    }
  }

  useEffect(() => {
    restartGame();
  }, [countClick]);

  useEffect(() => {
    if (isGameOver) return;
    if (!currentTetromino) return;

    setGrids((prevGrid) => {
      const newGrid: (0 | -1 | 1 | number)[][] = Array.from(
        { length: Rows },
        (_, i) =>
          Array.from({ length: Cols }, (_, j) =>
            prevGrid[i][j] === -1 ? -1 : 0
          )
      );
      //update the newGrid
      updateGrid(newGrid, currentTetromino, position);

      let linesCleared = 0;
      for (let i = newGrid.length - 1; i >= 0; i--) {
        if (newGrid[i].every((cell) => cell !== 0)) {
          newGrid.splice(i, 1);
          linesCleared++;
          setCount(count + 1);
        }
      }

      for (let i = 0; i < linesCleared; i++) {
        newGrid.unshift(Array(Cols).fill(0));
      }
      return newGrid;
    });
  }, [position, currentTetromino, isGameOver, count]);

  useEffect(() => {
    if (count > 0) {
      changeScore((prev) => prev + count);
      setCount(0);
    }
  }, [changeScore, count]);

  useEffect(() => {
    if (isGameOver) return;

    if (currentInterval) {
      clearInterval(currentInterval);
    }

    window.addEventListener("keydown", changeBlockDirection);

    function changeBlockDirection(e: KeyboardEvent) {
      if (e.repeat) return;

      if (e.key === "ArrowLeft") {
        // checkMoveLeftIsPossible
        const moveLeft = checkMoveIsPossible(
          grids,
          currentTetromino!,
          position,
          true,
          -1
        );
        if (moveLeft)
          setPosition((prevPosition) => ({
            ...prevPosition,
            x: prevPosition.x - 1,
          }));
      } else if (e.key === "ArrowRight") {
        const moveRight = checkMoveIsPossible(
          grids,
          currentTetromino!,
          position,
          true,
          1
        );
        if (moveRight)
          setPosition((prevPosition) => ({
            ...prevPosition,
            x: prevPosition.x + 1,
          }));
      } else if (e.key === " ") {
        rotateTetromino(
          isGameOver,
          currentTetromino!,
          setCurrentTetromino,
          position,
          grids,
          setPosition
        );
      }
    }

    const intervalId = setInterval(() => {
      setPosition((currentPos) => {
        if (canMoveDown(isGameOver, currentTetromino!, position, grids)) {
          return { ...currentPos, y: currentPos.y + 1 };
        } else {
          clearInterval(intervalId);

          handleTetrominoLanding(
            currentTetromino!,
            position,
            setGrids,
            setBlocksColors,
            currentColor
          );

          spawnNewTetromino(
            allTetrinos,
            setCurrentTetromino,
            setCurrentColor,
            setPosition
          );

          return currentPos;
        }
      });

      if (grids[0].some((cell) => cell === -1)) {
        setIsGameOver(true);
        clearInterval(intervalId);
      }
    }, 100);

    setCurrentInterval(intervalId);

    return () => {
      if (intervalId) clearInterval(intervalId);
      window.removeEventListener("keydown", changeBlockDirection);
    };
  }, [position, currentTetromino, isGameOver]);

  return (
    <div
      className="flex border-black bg-gray-500 flex-col"
      style={{ width: blockSize * Cols, height: blockSize * Rows }}>
      {grids.map((rows, rowkey) => (
        <div key={rowkey} className="flex">
          {rows.map((cols, colsKey) => (
            <div
              key={colsKey}
              className="border border-black"
              style={{
                width: blockSize,
                height: blockSize,
                backgroundColor: getCellColor(
                  cols,
                  rowkey,
                  colsKey,
                  currentColor,
                  blocksColors
                ),
              }}></div>
          ))}
        </div>
      ))}
    </div>
  );
}
