import { useMemo, useState, useCallback } from "react";
import Cell from "./Cell";
import Menu from "./Menu";

const COLUMNS = 50;
const ROWS = 20;

export default function Grid() {
  const [cellKind, setCellKind] = useState({
    start: null,
    finish: null,
    wall: [],
  });

  const [selectedOption, setSelectedOption] = useState(null);
  const [mazeGenerated, setMazeGenerated] = useState(false);
  const generateClassName = useMemo(() => {
    const memoizedClassName = {};
    return function (row, col) {
      const position = `${row}-${col}`;
      if (!memoizedClassName[position]) {
        memoizedClassName[position] = `cell-${position}`;
      }
      return memoizedClassName[position];
    };
  }, []);

  const generateMaze = useCallback(() => {
    const start = `${Math.floor(Math.random() * ROWS)}-${Math.floor(Math.random() * COLUMNS)}`;
    const finish = `${Math.floor(Math.random() * ROWS)}-${Math.floor(Math.random() * COLUMNS)}`;

    const visited = Array.from({ length: ROWS }, () => Array.from({ length: COLUMNS }, () => false));
    const walls = [];

    const dfs = (row, col) => {
      visited[row][col] = true;

      const directions = [
        [row - 2, col],
        [row + 2, col],
        [row, col - 2],
        [row, col + 2],
      ];

      directions.forEach(([nextRow, nextCol]) => {
        if (nextRow >= 0 && nextRow < ROWS && nextCol >= 0 && nextCol < COLUMNS && !visited[nextRow][nextCol]) {
          walls.push(`${row + (nextRow - row) / 2}-${col + (nextCol - col) / 2}`);
          dfs(nextRow, nextCol);
        }
      });
    };

    dfs(Math.floor(Math.random() * ROWS), Math.floor(Math.random() * COLUMNS));

    const randomMaze = {
      start,
      finish,
      wall: walls,
    };

    setCellKind(randomMaze);
    setMazeGenerated(true);
  }, []);


  const handleCellClick = useCallback((row, col) => {
    const cellPosition = generateClassName(row, col);

    const updatePositions = (prevPositions) => ({
      ...prevPositions,
      start: prevPositions.start === cellPosition ? null : prevPositions.start,
      finish: prevPositions.finish === cellPosition ? null : prevPositions.finish,
      wall: prevPositions.wall.filter((position) => position !== cellPosition),
    });

    switch (selectedOption) {
      case "start":
        setCellKind((prevPositions) => ({
          ...updatePositions(prevPositions),
          start: cellPosition,
        }));
        break;
      case "finish":
        setCellKind((prevPositions) => ({
          ...updatePositions(prevPositions),
          finish: cellPosition,
        }));
        break;
      case "wall":
        setCellKind((prevPositions) => ({
          ...updatePositions(prevPositions),
          wall: prevPositions.wall.includes(cellPosition)
            ? prevPositions.wall.filter((position) => position !== cellPosition)
            : [...prevPositions.wall, cellPosition],
        }));
        break;
      case "empty":
        setCellKind((prevPositions) => updatePositions(prevPositions));
        break;
      default:
        break;
    }
  }, [generateClassName, selectedOption]);

  const handleOptionChange = useCallback((option) => {
    setSelectedOption(option);
  }, []);

  const renderGrid = useCallback(() => {
    const grid = Array.from({ length: ROWS * COLUMNS }, (_, index) => {
      const row = Math.floor(index / COLUMNS);
      const col = index % COLUMNS;
      const cellPosition = generateClassName(row, col);
      return (
        <Cell
          cellPosition={cellPosition}
          key={cellPosition}
          className={cellPosition}
          cellKind={cellKind}
          handleCellClick={() => handleCellClick(row, col)}
        />
      );
    });
    return grid;
  }, [generateClassName, cellKind, handleCellClick]);

  return (
    <div className="Grid">
      <Menu handleOptionChange={handleOptionChange} generateMaze={generateMaze} mazeGenerated={mazeGenerated}/>
      <div className="grid-container">{renderGrid()}</div>
    </div>
  );
}
