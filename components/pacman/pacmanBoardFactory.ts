export type Direction = 'up' | 'down' | 'left' | 'right' | 'none';
export type CellType = 'wall' | 'empty' | 'pellet' | 'power';

export interface Point {
  x: number;
  y: number;
}

export interface Ghost extends Point {
  id: number;
  startX: number;
  startY: number;
  direction: Direction;
}

export interface BoardCell extends Point {
  key: string;
  type: CellType;
}

export interface RenderCell extends BoardCell {
  hasPacman: boolean;
  hasGhost: boolean;
  ghostClasses: string[];
}

export interface ParsedBoardState {
  mazeWidth: number;
  mazeHeight: number;
  cells: CellType[][];
  pacmanStart: Point;
  ghosts: Ghost[];
  remainingPellets: number;
}

export const MAZE_TEMPLATE = [
  '###################',
  '#o.....#...#.....o#',
  '#.###.#.#.#.#.###.#',
  '#.#...#.#.#.#...#.#',
  '#.#.###.#.#.###.#.#',
  '#.....#.....#.....#',
  '###.#.###.###.#.###',
  '#...#...#.#...#...#',
  '#.#####.#.#.#####.#',
  '#.......P.........#',
  '#.#####.#.#.#####.#',
  '#...#...#.#...#...#',
  '###.#.###.###.#.###',
  '#.....#G...G#.....#',
  '#.#.###.#.#.###.#.#',
  '#o#.....#.#.....#o#',
  '###################',
] as const;

export function createBoardState(): ParsedBoardState {
  const cells: CellType[][] = [];
  const ghostStarts: Point[] = [];
  let remainingPellets = 0;
  let pacmanStart: Point = { x: 1, y: 1 };

  for (let y = 0; y < MAZE_TEMPLATE.length; y += 1) {
    const row: CellType[] = [];
    const rawRow = MAZE_TEMPLATE[y];

    for (let x = 0; x < rawRow.length; x += 1) {
      const token = rawRow[x];
      if (token === '#') {
        row.push('wall');
        continue;
      }
      if (token === '.') {
        row.push('pellet');
        remainingPellets += 1;
        continue;
      }
      if (token === 'o') {
        row.push('power');
        remainingPellets += 1;
        continue;
      }
      if (token === 'P') {
        row.push('empty');
        pacmanStart = { x, y };
        continue;
      }
      if (token === 'G') {
        row.push('empty');
        ghostStarts.push({ x, y });
        continue;
      }
      row.push('empty');
    }

    cells.push(row);
  }

  const ghosts: Ghost[] = ghostStarts.map((point, index) => ({
    id: index,
    x: point.x,
    y: point.y,
    startX: point.x,
    startY: point.y,
    direction: index % 2 === 0 ? 'left' : 'right',
  }));

  return {
    mazeWidth: MAZE_TEMPLATE[0].length,
    mazeHeight: MAZE_TEMPLATE.length,
    cells,
    pacmanStart,
    ghosts,
    remainingPellets,
  };
}
