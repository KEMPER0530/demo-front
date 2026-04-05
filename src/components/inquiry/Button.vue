<template>
  <button
    class="inquiry-button"
    :type="type"
    :disabled="disabled"
    @click="handleClick"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    disabled?: boolean;
    type?: 'button' | 'submit' | 'reset';
  }>(),
  {
    disabled: false,
    type: 'button',
  },
);

const emit = defineEmits<{
  (event: 'click', payload: MouseEvent): void;
}>();

const handleClick = (event: MouseEvent) => {
  if (props.disabled) {
    event.preventDefault();
    return;
  }
  emit('click', event);
};
</script>

<style scoped>
.inquiry-button {
  width: 100%;
  padding: 0.8rem 1rem;
  border: none;
  border-radius: 12px;
  font-weight: 700;
  color: #ffffff;
  letter-spacing: 0.04em;
  background: linear-gradient(110deg, #00b996 0%, #1682ff 100%);
  box-shadow: 0 12px 24px rgba(22, 130, 255, 0.3);
  transition: transform 0.25s ease, box-shadow 0.25s ease, filter 0.25s ease;
}

.inquiry-button:hover:not(:disabled) {
  transform: translateY(-2px);
  filter: saturate(1.08);
}

.inquiry-button:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(132, 222, 255, 0.3), 0 12px 24px rgba(22, 130, 255, 0.3);
}

.inquiry-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
