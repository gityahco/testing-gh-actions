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
  const [visitedCells, setVisitedCells] = useState([]);

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

  const handleOptionChange = useCallback((option) => {
    setSelectedOption(option);
  }, []);

  const handleCellClick = useCallback(
    (row, col) => {
      const cellPosition = generateClassName(row, col);
      const updatePositions = (prevPositions) => ({
        ...prevPositions,
        start:
          prevPositions.start === cellPosition ? null : prevPositions.start,
        finish:
          prevPositions.finish === cellPosition ? null : prevPositions.finish,
        wall: prevPositions.wall.filter(
          (position) => position !== cellPosition
        ),
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
              ? prevPositions.wall.filter(
                  (position) => position !== cellPosition
                )
              : [...prevPositions.wall, cellPosition],
          }));
          break;
        case "empty":
          setCellKind((prevPositions) => updatePositions(prevPositions));
          break;
        default:
          break;
      }
    },
    [generateClassName, selectedOption]
  );

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
          // visitedCells={visitedCells}
          handleCellClick={() => handleCellClick(row, col)}
        />
      );
    });
    return grid;
  }, [generateClassName, cellKind, /*visitedCells,*/handleCellClick]);

  // const dfs = useCallback((cellPosition) => {
  //   setVisitedCells((prevVisitedCells) => [...prevVisitedCells, cellPosition]);

  //   if (cellPosition === cellKind.finish) {
  //     // Found the finish point, stop the search
  //     return;
  //   }

  //   const [row, col] = cellPosition.split("-");
  //   const adjacentCells = [
  //     [Number(row) - 1, Number(col)], // Up
  //     [Number(row), Number(col) + 1], // Right
  //     [Number(row) + 1, Number(col)], // Down
  //     [Number(row), Number(col) - 1], // Left
  //   ];

  //   for (const [adjRow, adjCol] of adjacentCells) {
  //     // Skip if the adjacent cell is out of bounds or is a wall
  //     if (
  //       adjRow < 0 ||
  //       adjRow >= ROWS ||
  //       adjCol < 0 ||
  //       adjCol >= COLUMNS ||
  //       cellKind.wall.includes(`${adjRow}-${adjCol}`)
  //     ) {
  //       continue;
  //     }

  //     const adjacentCellPosition = `${adjRow}-${adjCol}`;

  //     // Skip if the adjacent cell has already been visited
  //     if (visitedCells.includes(adjacentCellPosition)) {
  //       continue;
  //     }

  //     dfs(adjacentCellPosition);
  //   }
  // }, [cellKind.finish, cellKind.wall, visitedCells]);

  // const handleAlgorithmStart = useCallback(() => {
  //   if (cellKind.start) {
  //     setVisitedCells([]);
  //     dfs(cellKind.start);
  //   }
  // }, [cellKind.start, dfs]);

  return (
    <div className="Grid">
      <Menu handleOptionChange={handleOptionChange} />
      <div className="grid-container">{renderGrid()}</div>
      {/* <button onClick={handleAlgorithmStart}>Start Algorithm</button> */}
    </div>
  );

}
