import { useMemo, useState, useCallback } from "react";
import Grid from "./Grid";
import Menu from "./Menu";

const COLUMNS = 50;
const ROWS = 20;
function Index() {
  const [cellType, setCellType] = useState({
    start: null,
    end: null,
    wall: [],
    path: [],
    explored: [],
    uncovered: [],
  });
  const [selectedCellType, setSelectedCellType] = useState(null);

  const handleCellTypeChange = useCallback((option) => {
    setSelectedCellType(option);
  }, []);

  const generateCellClassName = useMemo(() => {
    const memoizedClassName = {};
    return function (row, col) {
      const position = `${row}-${col}`;
      if (!memoizedClassName[position]) {
        memoizedClassName[position] = position;
      }
      return memoizedClassName[position];
    };
  }, []);
  return (
    <>
      <Menu handleCellTypeChange={handleCellTypeChange} />
      <Grid
        selectedCellType={selectedCellType}
        ROWS={ROWS}
        COLUMNS={COLUMNS}
        cellType={cellType}
        setCellType={setCellType}
        generateCellClassName={generateCellClassName}
      />
    </>
  );
}

export default Index;
