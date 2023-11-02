import { useCallback, useMemo, useState } from "react";
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
  const [path, setPath] = useState([]);
  const [exploredCells, setExploredCells] = useState([]);

  const [selectedOption, setSelectedOption] = useState(null);

  const generateClassName = useMemo(() => {
    const memoizedClassName = {};
    return function (row, col) {
      const position = `${row}-${col}`;
      if (!memoizedClassName[position]) {
        memoizedClassName[position] = position;
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

      if (selectedOption === "start") {
        setCellKind((prevPositions) => ({
          ...updatePositions(prevPositions),
          start: cellPosition,
        }));
      } else if (selectedOption === "finish") {
        setCellKind((prevPositions) => ({
          ...updatePositions(prevPositions),
          finish: cellPosition,
        }));
      } else if (selectedOption === "wall") {
        setCellKind((prevPositions) => ({
          ...updatePositions(prevPositions),
          wall: prevPositions.wall.includes(cellPosition)
            ? prevPositions.wall.filter((position) => position !== cellPosition)
            : [...prevPositions.wall, cellPosition],
        }));
      } else if (selectedOption === "empty") {
        setCellKind((prevPositions) => updatePositions(prevPositions));
      }
    },
    [generateClassName, selectedOption]
  );

  const renderGrid = useCallback(() => {
    const grid = Array.from({ length: ROWS * COLUMNS }, (_, index) => {
      const row = Math.floor(index / COLUMNS);
      const col = index % COLUMNS;
      const cellPosition = generateClassName(row, col);
      const isPath = path.includes(cellPosition);
      const isExplored = exploredCells.includes(cellPosition);
      return (
        <Cell
          cellPosition={cellPosition}
          key={cellPosition}
          className={cellPosition}
          cellKind={cellKind}
          isPath={isPath}
          isExplored={isExplored}
          handleCellClick={() => handleCellClick(row, col)}
        />
      );
    });
    return grid;
  }, [generateClassName, path, exploredCells, cellKind, handleCellClick]);

  const startDijkstra = () => {
    dijkstra();
  };
  function getNeighbors(row, col) {
    const neighbors = [];

    // Check the top neighbor
    if (row > 0 && !cellKind.wall.includes(`${row - 1}-${col}`)) {
      neighbors.push([row - 1, col]);
    }

    // Check the right neighbor
    if (col < COLUMNS - 1 && !cellKind.wall.includes(`${row}-${col + 1}`)) {
      neighbors.push([row, col + 1]);
    }

    // Check the bottom neighbor
    if (row < ROWS - 1 && !cellKind.wall.includes(`${row + 1}-${col}`)) {
      neighbors.push([row + 1, col]);
    }

    // Check the left neighbor
    if (col > 0 && !cellKind.wall.includes(`${row}-${col - 1}`)) {
      neighbors.push([row, col - 1]);
    }

    return neighbors;
  }

  function dijkstra() {
    const distances = [];
    for (let i = 0; i < ROWS; i++) {
      distances[i] = new Array(COLUMNS).fill(Infinity);
    }

    const [startRow, startCol] = cellKind.start.split("-").map(Number);
    if (
      startRow >= 0 &&
      startRow < ROWS &&
      startCol >= 0 &&
      startCol < COLUMNS
    ) {
      distances[startRow][startCol] = 0;
    } else {
      console.error("Invalid start position");
      return;
    }

    const queue = [[startRow, startCol, 0]];

    const visited = new Set();

    while (queue.length > 0) {
      const [currentRow, currentCol, distance] = queue.shift();
      setExploredCells((prevExplored) => [
        ...prevExplored,
        `${currentRow}-${currentCol}`,
      ]);
      if (cellKind.finish === `${currentRow}-${currentCol}`) {
        const path = [];
        let row = currentRow;
        let col = currentCol;

        while (!(row === startRow && col === startCol)) {
          path.unshift(`${row}-${col}`);
          const neighbors = getNeighbors(row, col);

          let minDistance = Infinity;
          let nextRow = row;
          let nextCol = col;
          for (const [neighborRow, neighborCol] of neighbors) {
            const distance = distances[neighborRow][neighborCol];
            if (distance < minDistance) {
              minDistance = distance;
              nextRow = neighborRow;
              nextCol = neighborCol;
            }
          }

          row = nextRow;
          col = nextCol;
        }

        setPath(path);
        return;
      }

      const neighbors = getNeighbors(currentRow, currentCol);
      for (const [neighborRow, neighborCol] of neighbors) {
        const newDistance = distance + 1;

        if (newDistance < distances[neighborRow][neighborCol]) {
          distances[neighborRow][neighborCol] = newDistance;
          queue.push([neighborRow, neighborCol, newDistance]);
        }
      }

      visited.add(`${currentRow}-${currentCol}`);
    }
  }
  return (
    <div className="Grid">
      <Menu handleOptionChange={handleOptionChange} />
      <button onClick={startDijkstra}>Start Algorithm</button>
      <div className="grid-container">{renderGrid()}</div>
    </div>
  );
}
