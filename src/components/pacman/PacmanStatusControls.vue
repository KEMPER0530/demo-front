<template>
  <div>
    <div class="game-head">
      <h2>Pac Dot Rush</h2>
      <p class="score-board">SCORE {{ score }} / BEST {{ bestScore }}</p>
    </div>

    <div class="status-row">
      <span>LEVEL {{ level }}</span>
      <span>LIFE {{ lives }}</span>
      <span>SPEED {{ tickIntervalMs }}ms</span>
    </div>

    <div class="manual-controls">
      <div class="manual-item">
        <span class="manual-label">LEVEL</span>
        <div class="stepper">
          <button type="button" class="step-btn" @click.stop="emitUpdateLevel(-1)">
            -
          </button>
          <span>{{ levelSetting }}</span>
          <button type="button" class="step-btn" @click.stop="emitUpdateLevel(1)">
            +
          </button>
        </div>
      </div>

      <div class="manual-item">
        <span class="manual-label">LIFE</span>
        <div class="stepper">
          <button type="button" class="step-btn" @click.stop="emitUpdateLives(-1)">
            -
          </button>
          <span>{{ livesSetting }}</span>
          <button type="button" class="step-btn" @click.stop="emitUpdateLives(1)">
            +
          </button>
        </div>
      </div>

      <div class="manual-item manual-speed">
        <span class="manual-label">SPEED (ms)</span>
        <div class="speed-control">
          <button type="button" class="step-btn speed-btn" @click.stop="emitUpdateSpeed(10)">
            SLOW
          </button>
          <input
            type="number"
            min="80"
            max="280"
            step="10"
            :value="speedMs"
            class="speed-input"
            @click.stop
            @change="onSpeedChange"
          >
          <button type="button" class="step-btn speed-btn" @click.stop="emitUpdateSpeed(-10)">
            FAST
          </button>
        </div>
      </div>
    </div>

    <p class="control-hint">Arrow / WASD で移動 ・ SPACE 開始 ・ P 一時停止</p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  score: number;
  bestScore: number;
  level: number;
  lives: number;
  tickIntervalMs: number;
  levelSetting: number;
  livesSetting: number;
  speedMs: number;
}>();

const emit = defineEmits<{
  (event: 'update-level', value: number): void;
  (event: 'update-lives', value: number): void;
  (event: 'update-speed', value: number): void;
  (event: 'set-speed', value: number): void;
}>();

const emitUpdateLevel = (delta: number) => {
  emit('update-level', delta);
};

const emitUpdateLives = (delta: number) => {
  emit('update-lives', delta);
};

const emitUpdateSpeed = (delta: number) => {
  emit('update-speed', delta);
};

const onSpeedChange = (event: Event) => {
  const target = event.target as HTMLInputElement | null;
  if (!target) {
    return;
  }
  emit('set-speed', Number(target.value));
};
</script>

<style scoped>
.game-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.4rem;
}

.game-head h2 {
  margin: 0;
  font-size: 1.08rem;
}

.score-board {
  margin: 0;
  color: #f8d089;
  font-weight: 700;
  letter-spacing: 0.04em;
}

.status-row {
  display: flex;
  gap: 0.85rem;
  margin-bottom: 0.45rem;
  color: rgba(217, 236, 255, 0.88);
  font-size: 0.82rem;
}

.manual-controls {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.55rem;
  margin-bottom: 0.55rem;
}

.manual-item {
  border: 1px solid rgba(160, 208, 255, 0.24);
  border-radius: 11px;
  background: rgba(7, 18, 36, 0.66);
  padding: 0.42rem 0.5rem;
}

.manual-label {
  display: inline-block;
  font-size: 0.68rem;
  letter-spacing: 0.08em;
  color: rgba(186, 221, 255, 0.88);
  margin-bottom: 0.28rem;
}

.stepper {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.35rem;
}

.stepper span {
  min-width: 2.1rem;
  text-align: center;
  font-weight: 700;
  color: #f4fbff;
}

.step-btn {
  border: 1px solid rgba(171, 215, 255, 0.36);
  background: linear-gradient(160deg, rgba(23, 62, 116, 0.68), rgba(18, 30, 63, 0.88));
  color: #f2f9ff;
  border-radius: 9px;
  padding: 0.16rem 0.52rem;
  cursor: pointer;
  font-size: 0.82rem;
  font-weight: 700;
}

.speed-control {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 0.35rem;
  align-items: center;
}

.speed-btn {
  font-size: 0.66rem;
  letter-spacing: 0.05em;
  padding: 0.22rem 0.38rem;
}

.speed-input {
  width: 100%;
  border-radius: 8px;
  border: 1px solid rgba(171, 215, 255, 0.3);
  background: rgba(9, 20, 41, 0.88);
  color: #f5fbff;
  text-align: center;
  font-weight: 700;
  font-size: 16px;
  padding: 0.24rem;
}

.speed-input:focus {
  outline: 1px solid rgba(122, 197, 255, 0.85);
}

.control-hint {
  margin: 0 0 0.65rem;
  font-size: 0.8rem;
  color: rgba(206, 226, 251, 0.9);
  letter-spacing: 0.05em;
}

@media (max-width: 740px) {
  .status-row {
    flex-wrap: wrap;
    gap: 0.4rem 0.8rem;
  }

  .manual-controls {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .manual-speed {
    grid-column: 1 / -1;
  }

  .control-hint {
    font-size: 0.74rem;
  }
}

@media (max-width: 560px) {
  .manual-controls {
    grid-template-columns: 1fr;
  }
}
</style>
