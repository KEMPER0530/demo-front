import type { BoardCell, CellType, Direction, Ghost, Point, RenderCell } from '@/components/pacman/pacmanBoardFactory';
import { createBoardState } from '@/components/pacman/pacmanBoardFactory';
import { canMoveFrom, cellTypeAt, nextPoint } from '@/components/pacman/pacmanMovement';
import { moveGhostsByAI } from '@/components/pacman/pacmanGhostAI';

type GameState = 'idle' | 'running' | 'paused' | 'won' | 'gameover';
type MoveDirection = Exclude<Direction, 'none'>;

export function usePacmanGame() {
  const board = createBoardState();

  const mazeWidth = ref(board.mazeWidth);
  const mazeHeight = ref(board.mazeHeight);
  const cells = ref<CellType[][]>([]);
  const remainingPellets = ref(0);

  const pacman = ref<Point>({ x: 0, y: 0 });
  const pacmanStart = ref<Point>({ x: 0, y: 0 });
  const direction = ref<Direction>('left');
  const nextDirection = ref<Direction>('left');
  const lastDirection = ref<MoveDirection>('left');

  const ghosts = ref<Ghost[]>([]);
  const frightenedTicks = ref(0);
  const gameState = ref<GameState>('idle');

  const score = ref(0);
  const bestScore = ref(0);
  const level = ref(1);
  const lives = ref(3);
  const levelSetting = ref(1);
  const livesSetting = ref(3);
  const speedMs = ref(180);

  const loopId = ref<number | null>(null);

  const tickIntervalMs = computed(() => speedMs.value);

  const keyFor = (x: number, y: number): string => `${x},${y}`;

  const boardCells = computed<BoardCell[]>(() => {
    const value: BoardCell[] = [];
    for (let y = 0; y < mazeHeight.value; y += 1) {
      const row = cells.value[y] || [];
      for (let x = 0; x < mazeWidth.value; x += 1) {
        value.push({
          x,
          y,
          key: `${x}-${y}`,
          type: (row[x] || 'wall') as CellType,
        });
      }
    }
    return value;
  });

  const ghostByKey = computed<Record<string, Ghost>>(() => {
    const map: Record<string, Ghost> = {};
    for (let i = 0; i < ghosts.value.length; i += 1) {
      const ghost = ghosts.value[i];
      map[keyFor(ghost.x, ghost.y)] = ghost;
    }
    return map;
  });

  const renderCells = computed<RenderCell[]>(() => {
    return boardCells.value.map((cell) => {
      const ghost = ghostByKey.value[keyFor(cell.x, cell.y)];
      const ghostClasses: string[] = [];

      if (ghost) {
        ghostClasses.push(`ghost-${ghost.id % 4}`);
        if (frightenedTicks.value > 0) {
          ghostClasses.push('frightened');
        }
      }

      return {
        ...cell,
        hasPacman: pacman.value.x === cell.x && pacman.value.y === cell.y,
        hasGhost: Boolean(ghost),
        ghostClasses,
      };
    });
  });

  const overlayMessage = computed(() => {
    if (gameState.value === 'gameover') {
      return 'GAME OVER';
    }
    if (gameState.value === 'won') {
      return `LEVEL ${level.value} CLEAR`;
    }
    if (gameState.value === 'paused') {
      return 'PAUSED';
    }
    if (lives.value < livesSetting.value) {
      return 'MISS... READY?';
    }
    return 'PRESS SPACE';
  });

  const overlaySubMessage = computed(() => {
    if (gameState.value === 'won') {
      return 'SPACEで次のレベルへ';
    }
    if (gameState.value === 'gameover') {
      return 'SPACEでリトライ';
    }
    if (gameState.value === 'paused') {
      return 'SPACEで再開';
    }
    return 'クリックでも開始できます';
  });

  const renderDirection = computed<MoveDirection>(() => {
    return direction.value === 'none' ? lastDirection.value : direction.value;
  });

  const clampLevel = (value: number): number => Math.min(20, Math.max(1, value));
  const clampLives = (value: number): number => Math.min(9, Math.max(1, value));
  const clampSpeed = (value: number): number => Math.min(280, Math.max(80, value));

  const loadBestScore = () => {
    if (typeof window === 'undefined') {
      return;
    }
    const saved = window.localStorage.getItem('pac_dot_rush_best');
    bestScore.value = saved ? Number(saved) : 0;
  };

  const persistBestScore = () => {
    if (typeof window === 'undefined') {
      return;
    }
    window.localStorage.setItem('pac_dot_rush_best', String(bestScore.value));
  };

  const addScore = (points: number) => {
    score.value += points;
    if (score.value > bestScore.value) {
      bestScore.value = score.value;
      persistBestScore();
    }
  };

  const resetActors = () => {
    pacman.value = { x: pacmanStart.value.x, y: pacmanStart.value.y };
    ghosts.value = ghosts.value.map((ghost, index) => ({
      ...ghost,
      x: ghost.startX,
      y: ghost.startY,
      direction: index % 2 === 0 ? 'left' : 'right',
    }));
  };

  const setupLevel = () => {
    const parsed = createBoardState();
    mazeWidth.value = parsed.mazeWidth;
    mazeHeight.value = parsed.mazeHeight;
    cells.value = parsed.cells;
    pacmanStart.value = { x: parsed.pacmanStart.x, y: parsed.pacmanStart.y };
    ghosts.value = parsed.ghosts;
    remainingPellets.value = parsed.remainingPellets;

    resetActors();
    frightenedTicks.value = 0;
    nextDirection.value = 'left';
    direction.value = 'left';
    lastDirection.value = 'left';
    gameState.value = 'idle';
  };

  const startNewRun = () => {
    stopGameLoop();
    level.value = clampLevel(levelSetting.value);
    lives.value = clampLives(livesSetting.value);
    score.value = 0;
    setupLevel();
  };

  const startNextLevel = () => {
    stopGameLoop();
    level.value = clampLevel(level.value + 1);
    levelSetting.value = level.value;
    setupLevel();
  };

  const stopGameLoop = () => {
    if (typeof window === 'undefined') {
      return;
    }
    if (loopId.value !== null) {
      window.clearInterval(loopId.value);
      loopId.value = null;
    }
  };

  const tick = () => {
    if (gameState.value !== 'running') {
      return;
    }

    movePacman();
    checkGhostCollision();
    if (gameState.value !== 'running') {
      return;
    }

    moveGhosts();
    checkGhostCollision();
    if (gameState.value !== 'running') {
      return;
    }

    if (frightenedTicks.value > 0) {
      frightenedTicks.value -= 1;
    }

    if (remainingPellets.value <= 0) {
      onLevelClear();
    }
  };

  const startGameLoop = () => {
    if (typeof window === 'undefined') {
      return;
    }
    stopGameLoop();
    loopId.value = window.setInterval(() => {
      tick();
    }, tickIntervalMs.value);
  };

  const setDirection = (next: MoveDirection) => {
    nextDirection.value = next;
  };

  const setWantedDirectionFromKey = (code: string): boolean => {
    if (code === 'ArrowUp' || code === 'KeyW') {
      setDirection('up');
      return true;
    }
    if (code === 'ArrowDown' || code === 'KeyS') {
      setDirection('down');
      return true;
    }
    if (code === 'ArrowLeft' || code === 'KeyA') {
      setDirection('left');
      return true;
    }
    if (code === 'ArrowRight' || code === 'KeyD') {
      setDirection('right');
      return true;
    }
    return false;
  };

  const handleSpaceAction = () => {
    if (gameState.value === 'running') {
      return;
    }

    if (gameState.value === 'gameover') {
      startNewRun();
    } else if (gameState.value === 'won') {
      startNextLevel();
    }

    gameState.value = 'running';
    startGameLoop();
  };

  const togglePause = () => {
    if (gameState.value === 'running') {
      gameState.value = 'paused';
      stopGameLoop();
      return;
    }
    if (gameState.value === 'paused') {
      gameState.value = 'running';
      startGameLoop();
    }
  };

  const handlePanelClick = () => {
    if (gameState.value !== 'running') {
      handleSpaceAction();
    }
  };

  const setCellType = (x: number, y: number, cellType: CellType) => {
    const row = cells.value[y];
    if (!row) {
      return;
    }
    row[x] = cellType;
  };

  const consumeCurrentCell = () => {
    const currentType = cellTypeAt(cells.value, pacman.value.x, pacman.value.y, mazeWidth.value, mazeHeight.value);
    if (currentType === 'pellet') {
      setCellType(pacman.value.x, pacman.value.y, 'empty');
      remainingPellets.value -= 1;
      addScore(10);
      return;
    }

    if (currentType === 'power') {
      setCellType(pacman.value.x, pacman.value.y, 'empty');
      remainingPellets.value -= 1;
      frightenedTicks.value = 40;
      addScore(50);
    }
  };

  const movePacman = () => {
    if (
      nextDirection.value !== 'none'
      && canMoveFrom(cells.value, pacman.value.x, pacman.value.y, nextDirection.value, mazeWidth.value, mazeHeight.value)
    ) {
      direction.value = nextDirection.value;
    }

    if (!canMoveFrom(cells.value, pacman.value.x, pacman.value.y, direction.value, mazeWidth.value, mazeHeight.value)) {
      direction.value = 'none';
      return;
    }

    const next = nextPoint(pacman.value, direction.value as MoveDirection);
    pacman.value = { x: next.x, y: next.y };
    lastDirection.value = direction.value as MoveDirection;
    consumeCurrentCell();
  };

  const moveGhosts = () => {
    ghosts.value = moveGhostsByAI(
      ghosts.value,
      pacman.value,
      cells.value,
      mazeWidth.value,
      mazeHeight.value,
      frightenedTicks.value > 0,
    );
  };

  const onPacmanHit = () => {
    stopGameLoop();
    frightenedTicks.value = 0;
    lives.value -= 1;

    if (lives.value <= 0) {
      gameState.value = 'gameover';
      return;
    }

    gameState.value = 'idle';
    resetActors();
    direction.value = 'left';
    nextDirection.value = 'left';
    lastDirection.value = 'left';
  };

  const checkGhostCollision = () => {
    for (let i = 0; i < ghosts.value.length; i += 1) {
      const ghost = ghosts.value[i];
      const collided = ghost.x === pacman.value.x && ghost.y === pacman.value.y;
      if (!collided) {
        continue;
      }

      if (frightenedTicks.value > 0) {
        addScore(200);
        ghosts.value.splice(i, 1, {
          ...ghost,
          x: ghost.startX,
          y: ghost.startY,
          direction: 'left',
        });
        continue;
      }

      onPacmanHit();
      return;
    }
  };

  const onLevelClear = () => {
    stopGameLoop();
    gameState.value = 'won';
    frightenedTicks.value = 0;
  };

  const onKeyDown = (event: KeyboardEvent) => {
    const directionUpdated = setWantedDirectionFromKey(event.code);
    if (directionUpdated) {
      event.preventDefault();
    }

    if (event.code === 'Space') {
      event.preventDefault();
      handleSpaceAction();
    }

    if (event.code === 'KeyP') {
      togglePause();
    }
  };

  const updateLevelSetting = (delta: number) => {
    levelSetting.value = clampLevel(levelSetting.value + delta);
    level.value = levelSetting.value;
    if (gameState.value !== 'running') {
      setupLevel();
    }
  };

  const updateLivesSetting = (delta: number) => {
    livesSetting.value = clampLives(livesSetting.value + delta);
    lives.value = livesSetting.value;
  };

  const updateSpeedSetting = (delta: number) => {
    speedMs.value = clampSpeed(speedMs.value + delta);
    if (gameState.value === 'running') {
      startGameLoop();
    }
  };

  const setSpeedFromValue = (value: number) => {
    speedMs.value = clampSpeed(Number.isNaN(value) ? speedMs.value : value);
    if (gameState.value === 'running') {
      startGameLoop();
    }
  };

  onMounted(() => {
    loadBestScore();
    setupLevel();
    if (typeof window !== 'undefined') {
      window.addEventListener('keydown', onKeyDown);
    }
  });

  onBeforeUnmount(() => {
    stopGameLoop();
    if (typeof window !== 'undefined') {
      window.removeEventListener('keydown', onKeyDown);
    }
  });

  return {
    mazeWidth,
    mazeHeight,
    gameState,
    score,
    bestScore,
    level,
    lives,
    tickIntervalMs,
    levelSetting,
    livesSetting,
    speedMs,
    renderCells,
    renderDirection,
    overlayMessage,
    overlaySubMessage,
    updateLevelSetting,
    updateLivesSetting,
    updateSpeedSetting,
    setSpeedFromValue,
    setDirection,
    handleSpaceAction,
    togglePause,
    handlePanelClick,
  };
}
