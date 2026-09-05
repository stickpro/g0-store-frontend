<template>
  <label class="block">
    <span class="mb-1 block px-4 text-[13px] leading-4 text-zinc-500">{{ label }}</span>
    <div class="relative">
      <input
          :value="modelValue"
          :type="type"
          :autocomplete="autocomplete"
          :inputmode="inputmode"
          :placeholder="placeholder"
          class="h-10 w-full rounded-full bg-zinc-600/5 px-4 pr-10 text-[15px] text-zinc-950 outline-none placeholder:text-zinc-400"
          @input="onInput"
      >
      <button
          v-if="modelValue"
          type="button"
          class="absolute right-2 top-1/2 flex size-6 -translate-y-1/2 items-center justify-center"
          aria-label="Очистить"
          @click="$emit('update:modelValue', '')"
      >
        <IconXmark class="size-4"/>
      </button>
    </div>
  </label>
</template>

<script setup lang="ts">
import IconXmark from '~/components/icons/IconXmark.vue';
import { formatPhoneRu } from '~/utils/phoneMask';

const props = withDefaults(defineProps<{
  modelValue: string;
  label: string;
  type?: string;
  autocomplete?: string;
  inputmode?: 'text' | 'numeric' | 'tel' | 'email';
  mask?: 'phone';
  placeholder?: string;
}>(), {
  type: 'text',
  autocomplete: 'off',
});

const emit = defineEmits<{
  'update:modelValue': [value: string];
}>();

function onInput(event: Event) {
  const raw = (event.target as HTMLInputElement).value;
  emit('update:modelValue', props.mask === 'phone' ? formatPhoneRu(raw) : raw);
}
</script>
