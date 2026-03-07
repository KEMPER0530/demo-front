import type { CellType, Direction, Ghost, Point } from '@/components/pacman/pacmanBoardFactory';
import {
  OPPOSITE_DIRECTION,
  availableDirections,
  nextPoint,
} from '@/components/pacman/pacmanMovement';

function distanceFromPacman(from: Point, pacman: Point): number {
  return Math.abs(pacman.x - from.x) + Math.abs(pacman.y - from.y);
}

function pickGhostDirection(
  ghost: Ghost,
  candidates: Array<Exclude<Direction, 'none'>>,
  pacman: Point,
  frightened: boolean,
): Exclude<Direction, 'none'> {
  let bestDirection = candidates[0];
  let bestScore = -Infinity;

  for (let i = 0; i < candidates.length; i += 1) {
    const direction = candidates[i];
    const point = nextPoint(ghost, direction);
    const distance = distanceFromPacman(point, pacman);
    const trend = frightened ? distance : -distance;
    const randomNoise = Math.random() * 0.45;
    const score = trend + randomNoise;

    if (score > bestScore) {
      bestScore = score;
      bestDirection = direction;
    }
  }

  return bestDirection;
}

export function moveGhostsByAI(
  ghosts: Ghost[],
  pacman: Point,
  cells: CellType[][],
  mazeWidth: number,
  mazeHeight: number,
  frightened: boolean,
): Ghost[] {
  return ghosts.map((ghost) => {
    const options = availableDirections(cells, ghost.x, ghost.y, mazeWidth, mazeHeight);
    if (!options.length) {
      return ghost;
    }

    let candidates = options;
    if (ghost.direction !== 'none') {
      const opposite = OPPOSITE_DIRECTION[ghost.direction as Exclude<Direction, 'none'>];
      const filtered = options.filter((direction) => direction !== opposite);
      if (filtered.length > 0) {
        candidates = filtered;
      }
    }

    const direction = pickGhostDirection(ghost, candidates, pacman, frightened);
    const point = nextPoint(ghost, direction);

    return {
      ...ghost,
      x: point.x,
      y: point.y,
      direction,
    };
  });
}
