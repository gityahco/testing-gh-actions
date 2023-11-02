import { useCallback } from "react";
import Cell from "./Cell";
import PropTypes from "prop-types";

export default function Grid({
  selectedCellType,
  ROWS,
  COLUMNS,
  cellType,
  setCellType,
  generateCellClassName,
}) {
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const renderGrid = useCallback(() => {
    const grid = Array.from({ length: ROWS * COLUMNS }, (_, index) => {
      const row = Math.floor(index / COLUMNS);
      const col = index % COLUMNS;
      const cellPosition = generateCellClassName(row, col);
      return (
        <Cell
          row={row}
          col={col}
          cellPosition={cellPosition}
          key={cellPosition}
          className={cellPosition}
          cellType={cellType}
          setCellType={setCellType}
          selectedCellType={selectedCellType}
          generateCellClassName={generateCellClassName}
        />
      );
    });
    return grid;
  }, [
    ROWS,
    COLUMNS,
    generateCellClassName,
    cellType,
    setCellType,
    selectedCellType,
  ]);

  const getNeighbors = useCallback(
    (row, col) => {
      const neighbors = [];

      // Check the top neighbor
      if (row > 0 && !cellType.wall.includes(`${row - 1}-${col}`)) {
        neighbors.push([row - 1, col]);
      }

      // Check the right neighbor
      if (col < COLUMNS - 1 && !cellType.wall.includes(`${row}-${col + 1}`)) {
        neighbors.push([row, col + 1]);
      }

      // Check the bottom neighbor
      if (row < ROWS - 1 && !cellType.wall.includes(`${row + 1}-${col}`)) {
        neighbors.push([row + 1, col]);
      }

      // Check the left neighbor
      if (col > 0 && !cellType.wall.includes(`${row}-${col - 1}`)) {
        neighbors.push([row, col - 1]);
      }

      return neighbors;
    },
    [COLUMNS, ROWS, cellType.wall]
  );
  const dijkstra = useCallback(async () => {
    const distances = [];
    for (let i = 0; i < ROWS; i++) {
      distances[i] = new Array(COLUMNS).fill(Infinity);
    }

    const [startRow, startCol] = cellType.start.split("-").map(Number);
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

    setCellType((prev) => ({
      ...prev,
      explored: [],
      path: [],
      uncovered: [],
    }));

    while (queue.length > 0) {
      await delay(10);
      const [currentRow, currentCol, distance] = queue.shift();
      setCellType((prev) => ({
        ...prev,
        explored: [...prev.explored, `${currentRow}-${currentCol}`],
      }));
      if (cellType.end === `${currentRow}-${currentCol}`) {
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
        setCellType((prev) => ({ ...prev, path: path }));
        return;
      }

      const neighbors = getNeighbors(currentRow, currentCol);
      for (const [neighborRow, neighborCol] of neighbors) {
        if (!cellType.explored.includes(`${neighborRow}-${neighborCol}`)) {
          setCellType((prev) => ({
            ...prev,
            uncovered: [...prev.uncovered, `${neighborRow}-${neighborCol}`],
          }));
        }
        const newDistance = distance + 1;

        if (newDistance < distances[neighborRow][neighborCol]) {
          distances[neighborRow][neighborCol] = newDistance;
          queue.push([neighborRow, neighborCol, newDistance]);
        }
      }

      visited.add(`${currentRow}-${currentCol}`);
    }
  }, [COLUMNS, ROWS, cellType.end, cellType.explored, cellType.start, getNeighbors, setCellType]);

  return (
    <div className="Grid">
      <button className="start-algo" onClick={dijkstra}>
        Start Algorithm
      </button>
      <div className="grid-container">{renderGrid()}</div>
    </div>
  );
}
Grid.propTypes = {
  selectedCellType: PropTypes.string,
  ROWS: PropTypes.number,
  COLUMNS: PropTypes.number,
  cellType: PropTypes.shape({
    start: PropTypes.string,
    end: PropTypes.string,
    wall: PropTypes.arrayOf(PropTypes.string),
    path: PropTypes.arrayOf(PropTypes.string),
    explored: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  setCellType: PropTypes.func,
  generateCellClassName: PropTypes.func,
};
