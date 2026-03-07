<template>
  <div class="touch-controls">
    <div class="dpad">
      <button type="button" class="touch-btn up" @click.stop="emitDirection('up')">↑</button>
      <button type="button" class="touch-btn left" @click.stop="emitDirection('left')">←</button>
      <button type="button" class="touch-btn down" @click.stop="emitDirection('down')">↓</button>
      <button type="button" class="touch-btn right" @click.stop="emitDirection('right')">→</button>
    </div>

    <div class="touch-actions">
      <button type="button" class="touch-action" @click.stop="emitStart">
        START
      </button>
      <button type="button" class="touch-action" @click.stop="emitTogglePause">
        {{ gameState === 'paused' ? 'RESUME' : 'PAUSE' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
type Direction = 'up' | 'down' | 'left' | 'right';

defineProps<{ gameState: string }>();

const emit = defineEmits<{
  (event: 'direction', value: Direction): void;
  (event: 'start'): void;
  (event: 'toggle-pause'): void;
}>();

const emitDirection = (direction: Direction) => {
  emit('direction', direction);
};

const emitStart = () => {
  emit('start');
};

const emitTogglePause = () => {
  emit('toggle-pause');
};
</script>

<style scoped>
.touch-controls {
  display: none;
  margin-top: 0.7rem;
  gap: 0.65rem;
  align-items: start;
  grid-template-columns: auto 1fr;
}

.dpad {
  display: grid;
  grid-template-columns: repeat(3, minmax(52px, 56px));
  grid-template-rows: repeat(2, minmax(52px, 56px));
  gap: 0.35rem;
}

.touch-btn {
  border: 1px solid rgba(160, 210, 255, 0.34);
  background: linear-gradient(160deg, rgba(25, 71, 132, 0.78), rgba(15, 29, 66, 0.9));
  color: #f5fbff;
  border-radius: 10px;
  font-size: 1.12rem;
  font-weight: 700;
}

.touch-btn.up {
  grid-column: 2;
  grid-row: 1;
}

.touch-btn.left {
  grid-column: 1;
  grid-row: 2;
}

.touch-btn.down {
  grid-column: 2;
  grid-row: 2;
}

.touch-btn.right {
  grid-column: 3;
  grid-row: 2;
}

.touch-actions {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.45rem;
}

.touch-action {
  border: 1px solid rgba(160, 210, 255, 0.34);
  background: linear-gradient(160deg, rgba(22, 65, 124, 0.76), rgba(13, 24, 56, 0.9));
  color: #f5fbff;
  border-radius: 10px;
  padding: 0.7rem 0.42rem;
  font-size: 0.82rem;
  font-weight: 700;
  letter-spacing: 0.04em;
}

@media (max-width: 900px), (hover: none) and (pointer: coarse) {
  .touch-controls {
    display: grid;
  }
}

@media (max-width: 560px) {
  .touch-controls {
    grid-template-columns: 1fr;
  }

  .dpad {
    justify-content: center;
  }
}
</style>
