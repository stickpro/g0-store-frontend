<template>
  <label class="flex h-8 cursor-pointer items-center gap-2">
    <input
        :checked="modelValue"
        type="checkbox"
        class="filter-check"
        :disabled="disabled"
        @change="onChange"
    >
    <span v-if="$slots.default" class="px-1.5 leading-4">
      <slot />
    </span>
  </label>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  disabled?: boolean;
}>(), {
  disabled: false,
});

const modelValue = defineModel<boolean>({ default: false });

function onChange(event: Event) {
  modelValue.value = (event.target as HTMLInputElement).checked;
}
</script>

<style scoped>
.filter-check {
  appearance: none;
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  border: 1.5px solid #09090b;
  border-radius: 2px;
  background: transparent;
}

.filter-check:checked {
  background: #09090b;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath fill='%23fff' d='M6.4 10.6 3.8 8l-.933.933L6.4 12.467l8-8-.933-.934L6.4 10.6Z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: center;
  border-color: #09090b;
}

.filter-check:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
</style>
