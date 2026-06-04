const grid = document.getElementById("grid");
const hsDisp = document.getElementById("highscore");
const menu = document.getElementById("menu");
const presets = {
  board: {
    s: { s: [9, 9], m: [13, 13], l: [17, 17] },
    r: { s: [13, 8], m: [19, 11], l: [21, 13] },
  },
  speed: { s: 200, m: 125, f: 50 },
};
const saveData = JSON.parse(localStorage.getItem("snakesave"));

const keyMap = {
  w: [-1, 0],
  ArrowUp: [-1, 0],
  a: [0, -1],
  ArrowLeft: [0, -1],
  s: [1, 0],
  ArrowDown: [1, 0],
  d: [0, 1],
  ArrowRight: [0, 1],
};

let save = {
  shape: saveData?.shape ?? "s",
  size: saveData?.size ?? "m",
  speed: saveData?.speed ?? "m",
  theme: saveData?.theme ?? "g",
  hs: saveData?.hs ?? 0,
};

let gridStuff = [];

let hs = save.hs;
let dir = [0, 1];
let board,
  tickTime,
  snake,
  score,
  gameLoop,
  w,
  boardSize,
  gameSpeed,
  boardShape,
  audioCtx,
  nextDirs;
let gameOver = false;
let settingsOpen = false;

const inside = ([r, c]) =>
  r >= 0 && r < boardSize[1] && c >= 0 && c < boardSize[0];
const makeBoard = () =>
  Array.from({ length: boardSize[1] }, () => Array(boardSize[0]).fill(" "));

const makeSnake = () => {
  const cy = Math.floor(boardSize[1] / 2);
  return [
    [cy, 2],
    [cy, 1],
    [cy, 0],
  ];
};

const getCell = (b, [r, c]) => b[r][c];
const setCell = (b, [r, c], v) => (b[r][c] = v);

function spawnFruit() {
  let valid = [];
  const [cols, rows] = boardSize;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (board[r][c] === " ") valid.push([r, c]);
    }
  }

  if (valid.length === 0) return false;

  const [r, c] = valid[Math.floor(Math.random() * valid.length)];
  board[r][c] = "*";
  return true;
}

function endGame() {
  gameOver = true;
  let i = 1;
  const intId = setInterval(() => {
    const size = `calc(${w}px - ${i * 0.2}em)`;
    Array.from(grid.querySelectorAll(".cell.snake span")).forEach((span) => {
      span.style.width = size;
      span.style.height = size;
    });
    i++;
    if (i > 4) clearInterval(intId);
  }, 200);

  Array.from(grid.querySelectorAll(".cell.fruit span")).forEach((span) => {
    span.textContent = "";
  });

  setTimeout(() => {
    document.querySelector("#menu span").textContent =
      snake.length === boardSize[0] * boardSize[1] ? "YOU WON!" : "GAME OVER";
    const p = document.querySelector("#menu .pla p");
    // p.style.transform = "translateY(-4px)";
    p.textContent = "↻";
    menu.style.opacity = 1;
  }, 800);
}

function tick() {
  if (gameOver) return;
  if (nextDirs.length > 0) dir = nextDirs.shift();
  const head = snake[0];
  const newHead = [head[0] + dir[0], head[1] + dir[1]];
  if (!inside(newHead)) {
    // dieSound()
    endGame();
    return;
  }

  const target = getCell(board, newHead);
  const eatingFruit = target === "*";
  const tail = snake[snake.length - 1];

  const body = eatingFruit ? snake.slice(0, -1) : snake;

  const toTail =
    !eatingFruit && tail[0] === newHead[0] && tail[1] === newHead[1];

  const hit = body.some(([r, c]) => r === newHead[0] && c === newHead[1]);

  if (hit) {
    // dieSound()
    endGame();
    return;
  }
  snake.unshift(newHead);
  if (getCell(board, newHead) === "*") {
    // make sound somehow
    updateScore();
    if (snake.length === boardSize[0] * boardSize[1]) return endGame();
    spawnFruit();
  } else {
    setCell(board, tail, " ");
    snake.pop();
  }
  setCell(board, newHead, "██");
  renderGrid();
  clearTimeout(tickTime);
  tickTime = setTimeout(() => {
    gameLoop = requestAnimationFrame(tick);
  }, gameSpeed);
}

function saveSave() {
  localStorage.setItem("snakesave", JSON.stringify(save));
}

function updateScore() {
  score++;
  if (score > save.hs) {
    save.hs = score;
    saveSave();
    hsDisp.textContent = `High: ${save.hs}`;
  }
  document.getElementById("score").textContent = `Score: ${score}`;
}

function toggleSettings() {
  settingsOpen = !settingsOpen;
  menu.style.opacity = settingsOpen ? "0" : "1";
  document.getElementById("settings").className = settingsOpen ? "active" : "";
}

function setSetting(el) {
  Array.from(el.parentNode.children).forEach((child) =>
    child.classList.remove("active"),
  );
  el.classList.add("active");
  const type = el.value.slice(0, 2);
  const val = el.value.slice(2, 3);

  if (type === "sh") save.shape = val;
  else if (type === "si") save.size = val;
  else if (type === "sp") save.speed = val;
  else save.theme = val;
  saveSave();
  updateState();
  createGrid();
  resize();
}

function resize() {
  w = Math.ceil(grid.clientHeight / boardSize[1]);
  grid.style.width = `${w * boardSize[0]}px`;
  grid.style.fontSize = `${1.4 * w}px`;
}

function updateState() {
  boardShape = save.shape;
  boardSize = presets.board[boardShape][save.size];
  gameSpeed = presets.speed[save.speed];
  document.getElementById("game-container").className = save.theme;
}
function newGame() {
  dir = [0, 1];
  nextDirs = [dir];
  gameOver = false;
  board = makeBoard();
  snake = makeSnake();
  score = 0;
  menu.style.opacity = 0;
  for (let i = 0; i < snake.length; i++) {
    const [r, c] = snake[i];
    board[r][c] = "██";
  }
  spawnFruit();
  renderGrid();
  gameLoop = requestAnimationFrame(tick);
}

function createGrid() {
  const [cols, rows] = boardSize;
  grid.innerHTML = "";
  grid.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
  grid.style.gridTemplateRows = `repeat(${rows}, 1fr)`;

  for (let r = 0; r < rows; r++) {
    gridStuff[r] = [];
    for (let c = 0; c < cols; c++) {
      const div = document.createElement("div");
      const span = document.createElement("span");
      div.classList.add(`c${r}-${c}`);
      div.appendChild(span);
      grid.appendChild(div);
      gridStuff[r][c] = {
        div,
        span,
      };
    }
  }
}

function renderGrid() {
  const [cols, rows] = boardSize;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const { div, span } = gridStuff[r][c];
      const cell = board[r][c];
      const text = cell === "██" ? "snake" : cell === "*" ? "fruit" : "";
      span.textContent = cell;
      div.className = `cell ${text} c${r}-${c}`;
    }
  }
}

window.onload = () => {
  updateState();
  resize();
  board = makeBoard();
  createGrid();
  hsDisp.textContent = `High: ${save.hs}`;
  document
    .querySelector(`.container.shape .${save.shape}`)
    .classList.add("active");
  document
    .querySelector(`.container.size .${save.size}`)
    .classList.add("active");
  document
    .querySelector(`.container.speed .${save.speed}`)
    .classList.add("active");
  document
    .querySelector(`.container.theme .${save.theme}`)
    .classList.add("active");
};

window.onresize = () => resize();
window.onkeydown = (key) => {
  if (nextDirs.length > 2) nextDirs.shift();
  const lastDir = nextDirs.length ? nextDirs[nextDirs.length - 1] : dir;
  const next = keyMap[key.key];
  if (!next) return;
  if (next[0] === -lastDir[0] && next[1] === -lastDir[1]) return;
  nextDirs.push(next);
};
