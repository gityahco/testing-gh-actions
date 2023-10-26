import { useState } from "react";
import Menu from "./Menu";

export default function Grid() {
  const COLUMNS = 50;
  const ROWS = 20;

  const [start, setStart] = useState(null);
  const [finish, setFinish] = useState(null);
  const [wall, setWall] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const generateClassName = function (row, col) {
    return `cell-${row}-${col}`;
  };

  const handleCellClick = function (row, col) {
    const cellPosition = generateClassName(row, col);

    selectedOption === "start"
      ? setStart(cellPosition)
      : selectedOption === "finish"
      ? setFinish(cellPosition)
      : selectedOption === "wall"
      ? setWall((prevWall) => [...prevWall, cellPosition])
      : null;
  };

  const handleOptionChange = function (option) {
    setSelectedOption(option);
  };

  const renderGrid = function () {
    const grid = [];
    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLUMNS; col++) {
        const cellPosition = generateClassName(row, col);
        const isStart = cellPosition === start;
        const isFinish = cellPosition === finish;
        const isWall = cellPosition === wall.includes(cellPosition);

        const cellStyle = {
          backgroundColor: isStart
            ? "red"
            : isFinish
            ? "green"
            : isWall
            ? "gray"
            : 'white',
        };
        grid.push(
          <div
            className={cellPosition}
            style={cellStyle}
            onClick={() => handleCellClick(row, col)}
          ></div>
        );
      }
    }
    return grid;
  };

  return (
    <div className="App">
      <Menu handleOptionChange={handleOptionChange} />
      <div className="grid-container">{renderGrid()}</div>
    </div>
  );
}
