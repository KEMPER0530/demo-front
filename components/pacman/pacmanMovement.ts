import type { CellType, Direction, Point } from '@/components/pacman/pacmanBoardFactory';

export const DIRECTION_LIST: Array<Exclude<Direction, 'none'>> = ['up', 'down', 'left', 'right'];

export const DIRECTION_VECTORS: Record<Exclude<Direction, 'none'>, Point> = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};

export const OPPOSITE_DIRECTION: Record<Exclude<Direction, 'none'>, Exclude<Direction, 'none'>> = {
  up: 'down',
  down: 'up',
  left: 'right',
  right: 'left',
};

export function isInside(x: number, y: number, mazeWidth: number, mazeHeight: number): boolean {
  return x >= 0 && x < mazeWidth && y >= 0 && y < mazeHeight;
}

export function cellTypeAt(cells: CellType[][], x: number, y: number, mazeWidth: number, mazeHeight: number): CellType {
  if (!isInside(x, y, mazeWidth, mazeHeight)) {
    return 'wall';
  }
  const row = cells[y];
  if (!row) {
    return 'wall';
  }
  return (row[x] || 'wall') as CellType;
}

export function isWall(cells: CellType[][], x: number, y: number, mazeWidth: number, mazeHeight: number): boolean {
  return cellTypeAt(cells, x, y, mazeWidth, mazeHeight) === 'wall';
}

export function canMoveFrom(
  cells: CellType[][],
  x: number,
  y: number,
  direction: Direction,
  mazeWidth: number,
  mazeHeight: number,
): boolean {
  if (direction === 'none') {
    return false;
  }

  const vector = DIRECTION_VECTORS[direction];
  const nextX = x + vector.x;
  const nextY = y + vector.y;
  return isInside(nextX, nextY, mazeWidth, mazeHeight)
    && !isWall(cells, nextX, nextY, mazeWidth, mazeHeight);
}

export function nextPoint(point: Point, direction: Exclude<Direction, 'none'>): Point {
  const vector = DIRECTION_VECTORS[direction];
  return {
    x: point.x + vector.x,
    y: point.y + vector.y,
  };
}

export function availableDirections(
  cells: CellType[][],
  x: number,
  y: number,
  mazeWidth: number,
  mazeHeight: number,
): Array<Exclude<Direction, 'none'>> {
  const options: Array<Exclude<Direction, 'none'>> = [];
  for (let i = 0; i < DIRECTION_LIST.length; i += 1) {
    const direction = DIRECTION_LIST[i];
    if (canMoveFrom(cells, x, y, direction, mazeWidth, mazeHeight)) {
      options.push(direction);
    }
  }
  return options;
}
