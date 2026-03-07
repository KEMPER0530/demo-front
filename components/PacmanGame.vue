<template>
  <section class="game-panel pacman-panel" tabindex="0" @click="handlePanelClick">
    <PacmanStatusControls
      :score="score"
      :best-score="bestScore"
      :level="level"
      :lives="lives"
      :tick-interval-ms="tickIntervalMs"
      :level-setting="levelSetting"
      :lives-setting="livesSetting"
      :speed-ms="speedMs"
      @update-level="updateLevelSetting"
      @update-lives="updateLivesSetting"
      @update-speed="updateSpeedSetting"
      @set-speed="setSpeedFromValue"
    />

    <PacmanBoard
      :maze-width="mazeWidth"
      :maze-height="mazeHeight"
      :cells="renderCells"
      :render-direction="renderDirection"
      :game-state="gameState"
      :overlay-message="overlayMessage"
      :overlay-sub-message="overlaySubMessage"
    />

    <PacmanTouchControls
      :game-state="gameState"
      @direction="setDirection"
      @start="handleSpaceAction"
      @toggle-pause="togglePause"
    />
  </section>
</template>

<script setup lang="ts">
import PacmanBoard from '@/components/pacman/PacmanBoard.vue';
import PacmanStatusControls from '@/components/pacman/PacmanStatusControls.vue';
import PacmanTouchControls from '@/components/pacman/PacmanTouchControls.vue';
import { usePacmanGame } from '@/components/pacman/pacmanGameMixin';

const {
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
} = usePacmanGame();
</script>

<style scoped>
.game-panel {
  position: relative;
  border-radius: 20px;
  border: 1px solid rgba(158, 210, 255, 0.24);
  background: linear-gradient(145deg, rgba(8, 26, 57, 0.74), rgba(15, 18, 26, 0.8));
  box-shadow: 0 14px 28px rgba(0, 0, 0, 0.3);
  padding: 0.9rem;
}

@media (max-width: 740px) {
  .game-panel {
    padding: 0.72rem;
  }
}
</style>
