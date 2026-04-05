<template>
  <textarea
    rows="5"
    :placeholder="placeholder"
    :value="modelValue"
    class="inquiry-input inquiry-textarea"
    @input="handleInput"
    @blur="emit('blur')"
  />
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    modelValue?: string;
    placeholder?: string;
  }>(),
  {
    modelValue: '',
    placeholder: '',
  },
);

const emit = defineEmits<{
  (event: 'update:modelValue', value: string): void;
  (event: 'blur'): void;
}>();

const handleInput = (event: Event) => {
  const target = event.target as HTMLTextAreaElement | null;
  emit('update:modelValue', target?.value ?? '');
};
</script>

<style scoped>
.inquiry-input {
  display: block;
  width: 100%;
  min-height: 170px;
  border: 1px solid rgba(151, 205, 255, 0.35);
  border-radius: 12px;
  padding: 10px 12px;
  color: #eef7ff;
  background: rgba(11, 21, 40, 0.74);
  resize: vertical;
  transition: border-color 0.22s ease, box-shadow 0.22s ease, transform 0.22s ease;
}

.inquiry-input::placeholder {
  color: rgba(187, 212, 243, 0.72);
}

.inquiry-input:focus {
  outline: none;
  border-color: rgba(123, 223, 255, 0.95);
  box-shadow: 0 0 0 3px rgba(96, 175, 255, 0.24);
  transform: translateY(-1px);
}
</style>
