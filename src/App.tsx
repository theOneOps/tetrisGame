import { useState } from "react";
import Container from "./Components/Container";

export default function App() {
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, changeScore] = useState(0);
  const [countClick, setCountClick] = useState(0);
  return (
    <div className="flex justify-center items-center w-screen h-screen flex-col space-y-2">
      <h1 className="capitalize">
        {isGameOver && <span className="text-red-600">game is over !</span>}{" "}
        Score : {score}
      </h1>
      <div>
        <Container
          isGameOver={isGameOver}
          setIsGameOver={setIsGameOver}
          changeScore={changeScore}
          countClick={countClick}
        />
      </div>
      {isGameOver && (
        <button
          className="px-2 py-2 bg-black text-white text-center rounded cursor-pointer transition duration-100 hover:bg-gray-700"
          onClick={() => {
            setCountClick((preventCount) => preventCount + 1);
            setIsGameOver(false);
          }}>
          Restart
        </button>
      )}
    </div>
  );
}
