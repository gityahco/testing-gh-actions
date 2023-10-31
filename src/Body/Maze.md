
const handleGenerateMaze = () => {
    const newCellKind = {
      start: null,
      finish: null,
      wall: [],
    };

    // Create a grid representation of the maze
    const grid = [];
    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLUMNS; col++) {
        const cellPosition = generateClassName(row, col);
        grid.push(cellPosition);
      }
    }

    // Select a random starting cell
    const startingCell = grid[Math.floor(Math.random() * grid.length)];
    newCellKind.start = startingCell;

    // Create a set to keep track of visited cells
    const visited = new Set();
    visited.add(startingCell);

    // Create a stack to keep track of the current path
    const stack = [startingCell];

    while (stack.length > 0) {
      const currentCell = stack.pop();

      // Get the neighboring cells
      const neighbors = getNeighbors(currentCell);

      // Shuffle the neighbors randomly
      shuffleArray(neighbors);

      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);

          // Add the neighbor to the wall array
          newCellKind.wall.push(neighbor);

          // Add the neighbor to the stack to continue the path
          stack.push(neighbor);
        }
      }
    }

    // Select a random finish cell
    const finishCell = grid[Math.floor(Math.random() * grid.length)];
    newCellKind.finish = finishCell;

    setCellKind(newCellKind);
  };

  // Helper function to get the neighboring cells of a given cell
  const getNeighbors = (cell) => {
    const [row, col] = cell.split("-").slice(1).map(Number);
    const neighbors = [];

    if (row > 0) neighbors.push(generateClassName(row - 1, col));
    if (row < ROWS - 1) neighbors.push(generateClassName(row + 1, col));
    if (col > 0) neighbors.push(generateClassName(row, col - 1));
    if (col < COLUMNS - 1) neighbors.push(generateClassName(row, col + 1));

    return neighbors;
  };

  // Helper function to shuffle an array using Fisher-Yates algorithm
  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  };
