<template>
  <div ref="rootRef" class="relative min-w-[180px]">
    <button
        type="button"
        class="flex h-8 w-full items-center justify-between gap-1 rounded-full bg-zinc-600/5 py-0 pr-2 pl-3 text-left text-[15px] leading-6 text-zinc-950 outline-none hover:bg-zinc-600/10"
        :class="{ 'bg-zinc-600/10': open }"
        :disabled="disabled"
        :aria-expanded="open"
        :aria-label="ariaLabel"
        aria-haspopup="listbox"
        @click="toggle"
        @keydown="onTriggerKeydown"
    >
      <span class="min-w-0 truncate">{{ selectedLabel }}</span>
      <span
          class="flex size-6 shrink-0 items-center justify-center transition-transform"
          :class="{ 'rotate-180': open }"
      >
        <IconChevron />
      </span>
    </button>

    <ul
        v-if="open"
        class="absolute right-0 z-30 mt-1 min-w-full overflow-hidden rounded-2xl border border-zinc-200 bg-white py-1"
        role="listbox"
    >
      <li
          v-for="(option, index) in options"
          :key="`${option.value}-${option.label}`"
          role="option"
          :aria-selected="isSelected(option)"
          class="flex h-8 cursor-pointer items-center px-3 text-[15px] leading-4 text-zinc-950 hover:bg-zinc-600/5"
          :class="{ 'bg-zinc-600/5': highlightedIndex === index || isSelected(option) }"
          @mousedown.prevent="select(option)"
          @mouseenter="highlightedIndex = index"
      >
        {{ option.label }}
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { onClickOutside } from '@vueuse/core';
import IconChevron from '~/components/icons/IconChevron.vue';
import type { SelectOption } from './types';

const props = withDefaults(defineProps<{
  options: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
  ariaLabel?: string;
}>(), {
  placeholder: '',
  disabled: false,
  ariaLabel: undefined,
});

const modelValue = defineModel<string>({ default: '' });

const rootRef = ref<HTMLElement | null>(null);
const open = ref(false);
const highlightedIndex = ref(0);

const selectedOption = computed(() =>
    props.options.find((option) => option.value === modelValue.value),
);

const selectedLabel = computed(() =>
    selectedOption.value?.label || props.placeholder || props.options[0]?.label || '',
);

function isSelected(option: SelectOption) {
  return option.value === modelValue.value;
}

function close() {
  open.value = false;
}

function openList() {
  if (props.disabled) return;
  open.value = true;
  highlightedIndex.value = Math.max(
      0,
      props.options.findIndex((option) => option.value === modelValue.value),
  );
}

function toggle() {
  if (open.value) close();
  else openList();
}

function select(option: SelectOption) {
  modelValue.value = option.value;
  close();
}

function onTriggerKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    close();
    return;
  }

  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    if (!open.value) {
      openList();
      return;
    }
    const option = props.options[highlightedIndex.value];
    if (option) select(option);
    return;
  }

  if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
    event.preventDefault();
    if (!open.value) {
      openList();
      return;
    }
    const delta = event.key === 'ArrowDown' ? 1 : -1;
    const next = highlightedIndex.value + delta;
    highlightedIndex.value = Math.min(props.options.length - 1, Math.max(0, next));
  }
}

onClickOutside(rootRef, close);
</script>
