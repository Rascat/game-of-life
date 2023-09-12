const width = 600;
const height = 600;
const scale = 20;
const numCols = width / scale;
const numRows = height / scale;
const fr = 60;
const borderWidth = 0;
const ts = 20;
let deltaInMilliseconds = 200;

const createGrid = (numCols, numRows) =>
  new Array(numCols).fill(null).map(() => new Array(numRows).fill(0));

const randomizeGrid = (grid) => {
  return grid.map((col) => col.map((_) => Math.floor(Math.random() * 2)));
};

const countLivingNeighbors = (grid, x, y) => {
  let sum = 0;
  const numCols = grid.length;
  const numRows = grid[0].length;

  for (let i = -1; i < 2; i++) {
    for (let j = -1; j < 2; j++)
      sum += grid[(x + i + numCols) % numCols][(y + j + numRows) % numRows];
  }
  sum -= grid[x][y];
  return sum;
};

const computeNextGrid = (grid) => {
  const nextGrid = createGrid(grid.length, grid[0].length);

  for (let x = 0; x < numCols; x++) {
    for (let y = 0; y < numRows; y++) {
      const livingNeighbours = countLivingNeighbors(grid, x, y);
      const cell = grid[x][y];

      if (cell === 0 && livingNeighbours === 3) {
        nextGrid[x][y] = 1;
      } else if (cell === 1 && (livingNeighbours < 2 || livingNeighbours > 3)) {
        nextGrid[x][y] = 0;
      } else {
        nextGrid[x][y] = cell;
      }
    }
  }
  return nextGrid;
};

const mouseGridPosition = () => {
  let x = Math.floor(mouseX / scale);
  let y = Math.floor(mouseY / scale);

  if (x < 0 || x > numRows - 1 || y < 0 || y > numCols - 1) {
    return [null, null];
  }

  return [x, y];
};

function mouseClicked() {
  let [x, y] = mouseGridPosition();
  if (x !== null && y !== null) {
    grid[x][y] = grid[x][y] === 1 ? 0 : 1;
  }

  return false;
}

// scale update delta
function mouseWheel(event) {
  const step = 10;
  const deltaMax = 1000;
  const deltaMin = 10;
  if (event.delta > 0) {
    if (deltaInMilliseconds <= deltaMax - step) deltaInMilliseconds += step;
  } else {
    if (deltaInMilliseconds >= deltaMin) deltaInMilliseconds -= step;
  }

  return false;
}

function doubleClicked() {
  runGame = !runGame;
}

function update() {
  grid = computeNextGrid(grid);
}

function setup() {
  createCanvas(width, height);
  frameRate(fr);
}

let grid = createGrid(numCols, numRows);
// grid = randomizeGrid(grid);
let runGame = false;
let lastUpdate = 0;

function draw() {
  background("white");

  // draw grid
  for (let x = 0; x < numCols; x++) {
    for (let y = 0; y < numRows; y++) {
      if (grid[x][y] === 1) {
        fill("black");
      } else {
        fill("white");
      }
      square(x * scale, y * scale, scale - borderWidth);
    }
  }

  if (runGame) {
    if (millis() - lastUpdate > deltaInMilliseconds) {
      update();
      lastUpdate = millis();
    }
  }
}
