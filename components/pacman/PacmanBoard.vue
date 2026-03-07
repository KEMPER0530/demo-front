<template>
  <div class="board-wrap">
    <div
      class="pacman-board"
      :style="{
        gridTemplateColumns: `repeat(${mazeWidth}, 1fr)`,
        gridTemplateRows: `repeat(${mazeHeight}, 1fr)`
      }"
    >
      <div
        v-for="cell in cells"
        :key="cell.key"
        :class="['cell', `cell-${cell.type}`]"
      >
        <span v-if="cell.type === 'pellet'" class="pellet" />
        <span v-else-if="cell.type === 'power'" class="power-pellet" />

        <span
          v-if="cell.hasPacman"
          class="pacman"
          :class="`dir-${renderDirection}`"
        />

        <span
          v-if="cell.hasGhost"
          class="ghost"
          :class="cell.ghostClasses"
        >
          <span class="ghost-eye left" />
          <span class="ghost-eye right" />
        </span>
      </div>
    </div>

    <div v-if="gameState !== 'running'" class="game-overlay">
      <p>{{ overlayMessage }}</p>
      <small>{{ overlaySubMessage }}</small>
    </div>
  </div>
</template>

<script setup lang="ts">
type CellType = 'wall' | 'empty' | 'pellet' | 'power';

interface RenderCell {
  key: string;
  type: CellType;
  hasPacman: boolean;
  hasGhost: boolean;
  ghostClasses: string[];
}

defineProps<{
  mazeWidth: number;
  mazeHeight: number;
  cells: RenderCell[];
  renderDirection: string;
  gameState: string;
  overlayMessage: string;
  overlaySubMessage: string;
}>();
</script>

<style scoped>
.board-wrap {
  position: relative;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.pacman-board {
  display: grid;
  gap: clamp(1px, 0.35vw, 2px);
  width: 100%;
  max-width: min(860px, 100%);
  margin: 0 auto;
  padding: clamp(0.42rem, 1.2vw, 0.62rem);
  border-radius: 14px;
  background: radial-gradient(circle at 20% 10%, #131f3d, #05070e 62%);
  border: 1px solid rgba(98, 150, 255, 0.26);
  box-shadow: inset 0 0 0 1px rgba(40, 74, 136, 0.2);
  aspect-ratio: 19 / 17;
}

.cell {
  position: relative;
  border-radius: 3px;
  background: rgba(8, 16, 31, 0.9);
}

.cell-wall {
  background:
    linear-gradient(160deg, rgba(126, 189, 255, 0.4), rgba(28, 84, 191, 0.6)),
    linear-gradient(145deg, #163777, #102247);
  box-shadow: inset 0 0 0 1px rgba(142, 205, 255, 0.34);
}

.pellet,
.power-pellet {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  border-radius: 50%;
}

.pellet {
  width: 24%;
  height: 24%;
  background: #ffe9a4;
  box-shadow: 0 0 5px rgba(255, 236, 174, 0.75);
}

.power-pellet {
  width: 44%;
  height: 44%;
  background: #ffe26d;
  box-shadow: 0 0 10px rgba(255, 218, 86, 0.95);
  animation: pulse 0.88s ease-in-out infinite;
}

.pacman {
  position: absolute;
  inset: 12%;
  border-radius: 50%;
  background: conic-gradient(from 36deg, #ffd84c 0deg 300deg, transparent 300deg 360deg);
  filter: drop-shadow(0 0 6px rgba(255, 219, 95, 0.55));
  animation: chomp 0.24s steps(2, end) infinite;
  transform: rotate(0deg);
}

.pacman.dir-up {
  transform: rotate(-90deg);
}

.pacman.dir-down {
  transform: rotate(90deg);
}

.pacman.dir-left {
  transform: rotate(180deg);
}

.pacman.dir-right {
  transform: rotate(0deg);
}

.ghost {
  position: absolute;
  inset: 12%;
  border-radius: 48% 48% 38% 38%;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.28);
}

.ghost::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: -15%;
  height: 30%;
  background: inherit;
  clip-path: polygon(0% 0%, 16% 90%, 33% 0%, 50% 90%, 66% 0%, 83% 90%, 100% 0%, 100% 100%, 0% 100%);
}

.ghost-0 {
  background: linear-gradient(160deg, #ff9db4, #ff4f83 72%);
}

.ghost-1 {
  background: linear-gradient(160deg, #7ccaff, #2c8cf5 72%);
}

.ghost-2 {
  background: linear-gradient(160deg, #ffc88f, #ff7d1a 72%);
}

.ghost-3 {
  background: linear-gradient(160deg, #8be6c2, #2fb88a 72%);
}

.ghost.frightened {
  background: linear-gradient(160deg, #9ed2ff, #4a67ff 72%);
}

.ghost-eye {
  position: absolute;
  top: 30%;
  width: 24%;
  height: 24%;
  border-radius: 50%;
  background: #f9fbff;
}

.ghost-eye::after {
  content: '';
  position: absolute;
  width: 44%;
  height: 44%;
  right: 15%;
  bottom: 18%;
  border-radius: 50%;
  background: #1a2a58;
}

.ghost-eye.left {
  left: 20%;
}

.ghost-eye.right {
  right: 20%;
}

.game-overlay {
  position: absolute;
  inset: 0.6rem;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(3, 7, 16, 0.62);
  backdrop-filter: blur(2px);
  pointer-events: none;
  text-align: center;
}

.game-overlay p {
  margin: 0;
  color: #f7fdff;
  font-size: clamp(1rem, 2.8vw, 1.3rem);
  font-weight: 700;
  letter-spacing: 0.06em;
}

.game-overlay small {
  margin-top: 0.35rem;
  color: rgba(217, 235, 255, 0.92);
}

@keyframes chomp {
  0% {
    background: conic-gradient(from 28deg, #ffd84c 0deg 312deg, transparent 312deg 360deg);
  }
  100% {
    background: conic-gradient(from 48deg, #ffd84c 0deg 286deg, transparent 286deg 360deg);
  }
}

@keyframes pulse {
  0%,
  100% {
    transform: translate(-50%, -50%) scale(0.88);
  }
  50% {
    transform: translate(-50%, -50%) scale(1.08);
  }
}

@media (max-width: 740px) {
  .game-overlay {
    inset: 0.42rem;
  }
}
</style>
