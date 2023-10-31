import { useMemo } from "react";
import PropTypes from "prop-types";

export default function Cell({ cellPosition, cellKind, handleCellClick, isPath}) {
    const isStart = cellPosition === cellKind.start;
    const isFinish = cellPosition === cellKind.finish;
    const isWall = cellKind.wall.includes(cellPosition);
    const cellStyle = useMemo(() => {
      return {
        backgroundColor: isStart
          ? "red"
          : isFinish
          ? "green"
          : isWall
          ? 'blue'
          : isPath
          ? 'yellow'
          : "#d1d1d1",
      };
    }, [isStart, isFinish, isWall, isPath]);
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
    isPath: PropTypes.bool
  };
