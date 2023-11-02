import { useMemo } from "react";
import PropTypes from "prop-types";

export default function Cell({ cellPosition, cellKind, handleCellClick, isPath, isExplored}) {
    const isStart = cellPosition === cellKind.start;
    const isFinish = cellPosition === cellKind.finish;
    const isWall = cellKind.wall.includes(cellPosition);
    const cellStyle = useMemo(() => {
      return {
        backgroundColor: isStart
          ? "rgb(19, 107, 19)"
          : isFinish
          ? "hsl(357, 100%, 67%)"
          : isWall
          ? 'rgb(255, 187, 0)'
          : isPath
          ? 'hsl(219, 100%, 67%)'
          : isExplored
          ? 'blue'
          : 'hsl(50, 50%, 50%)'
      };
    }, [isStart, isFinish, isWall, isPath, isExplored]);
    return (
      <div
        key={cellPosition}
        className={cellPosition}
        style={cellStyle}
        onClick={handleCellClick}
      ></div>
    );
  }
  Cell.propTypes = {
    cellPosition: PropTypes.string.isRequired,
    cellKind: PropTypes.shape({
      start: PropTypes.string,
      finish: PropTypes.string,
      wall: PropTypes.arrayOf(PropTypes.string),
    }).isRequired,
    handleCellClick: PropTypes.func.isRequired,
    isPath: PropTypes.bool,
    isExplored: PropTypes.bool,
  };
