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
    if (selectedOption === 'start') {
      setStart(cellPosition)
    } else if (selectedOption === 'finish') {
      setFinish(cellPosition)
    } else if (selectedOption === 'wall') {
      setWall((prevWall) => [...prevWall, cellPosition])
    }
    // selectedOption === "start"
    //   ? setStart(cellPosition)
    //   : selectedOption === "finish"
    //   ? setFinish(cellPosition)
    //   : selectedOption === "wall"
    //   ? setWall((prevWall) => [...prevWall, cellPosition])

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
            : isWall
            ? "green"
            : isFinish
            ? "#636363"
            : "#d1d1d1",
        };
        grid.push(
          <div
            key={cellPosition}
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
