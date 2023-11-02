import { useCallback, useMemo } from "react";
import PropTypes from "prop-types";

export default function Cell({
  cellPosition,
  row,
  col,
  cellType,
  setCellType,
  selectedCellType,
  generateCellClassName
}) {

  const handleCellClick = useCallback(
    (row, col) => {
      const cellPosition = generateCellClassName(row, col);
      const updatePositions = (prevPositions) => ({
        ...prevPositions,
        start:
          prevPositions.start === cellPosition ? null : prevPositions.start,
        end: prevPositions.end === cellPosition ? null : prevPositions.end,
        wall: prevPositions.wall.filter(
          (position) => position !== cellPosition
        ),
      });

      if (selectedCellType === "start") {
        setCellType((prevPositions) => ({
          ...updatePositions(prevPositions),
          start: cellPosition,
        }));
      } else if (selectedCellType === "end") {
        setCellType((prevPositions) => ({
          ...updatePositions(prevPositions),
          end: cellPosition,
        }));
      } else if (selectedCellType === "wall") {
        setCellType((prevPositions) => ({
          ...updatePositions(prevPositions),
          wall: prevPositions.wall.includes(cellPosition)
            ? prevPositions.wall.filter((position) => position !== cellPosition)
            : [...prevPositions.wall, cellPosition],
        }));
      } else if (selectedCellType === "empty") {
        setCellType((prevPositions) => updatePositions(prevPositions));
      }
    },
    [generateCellClassName, selectedCellType, setCellType]
  );
  const cellStyle = useMemo(() => {
    const isStart = cellPosition === cellType.start;
    const isEnd = cellPosition === cellType.end;
    const isWall = cellType.wall.includes(cellPosition);
    const isPath = cellType.path.includes(cellPosition);
    const isExplored = cellType.explored.includes(cellPosition);
    const isUncovered = cellType.uncovered.includes(cellPosition)
    return {
      backgroundColor: isStart
        ? "rgb(19, 107, 19)"
        : isEnd
        ? "hsl(357, 100%, 67%)"
        : isWall
        ? "rgb(255, 187, 0)"
        : isPath
        ? "hsl(219, 100%, 67%)"
        : isExplored
        ? "rgb(0, 100, 100)"
        : isUncovered
        ? 'rgb(169, 51, 8)'
        : "hsl(50, 50%, 50%)",
    };
  }, [cellPosition, cellType.start, cellType.end, cellType.wall, cellType.path, cellType.explored, cellType.uncovered]);
  return (
    <div
      key={cellPosition}
      className={cellPosition}
      style={cellStyle}
      onClick={() => handleCellClick(row, col)}
    ></div>
  );
}
Cell.propTypes = {
  row: PropTypes.number.isRequired,
  col: PropTypes.number.isRequired,
  selectedCellType: PropTypes.string,
  generateCellClassName: PropTypes.func,
  cellPosition: PropTypes.string.isRequired,
  cellType: PropTypes.shape({
    start: PropTypes.string,
    end: PropTypes.string,
    wall: PropTypes.arrayOf(PropTypes.string),
    path: PropTypes.arrayOf(PropTypes.string),
    explored: PropTypes.arrayOf(PropTypes.string),
    uncovered: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  setCellType: PropTypes.func,
  isPath: PropTypes.bool,
  isExplored: PropTypes.bool,
};
