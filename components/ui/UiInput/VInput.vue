<template>
  <div
      class="relative w-full"
      tabindex="-1"
      :class="[
      size,
      { 'is-focus': isFocus },
      { 'is-filled': filled },
      { 'is-disabled': disabled },
      { 'is-inside': inside },
      { 'not-empty': !!modelValue }
    ]"
      @click="onFocus"
  >
    <div v-if="$slots.prepend" ref="prependRef" class="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
      <slot name="prepend"/>
    </div>
    <div class="ui-input__inner" tabindex="-1">
      <span v-if="inside" class="ui-input__label">{{ placeholder }}</span>

      <input
          ref="inputRef"
          v-model.trim="modelValue"
          class="w-full h-12 bg-gray-100 rounded-full pl-12 pr-4 text-base placeholder-gray-400 focus:outline-none"          :type="showPassword ? (isShowPassword ? 'text' : 'password') : type"
          :placeholder="inside ? '' : placeholder"
          :disabled="disabled"
          @blur="onBlur"
          @focus="onFocus"
          @change="$emit('change')"
          @input="onInput"
          @keydown.esc="inputRef?.blur()"
          :readonly="readonly"
          :autofocus="autofocus"
          :tabindex="indexTab"
          :autocomplete="autocomplete"
          :name="name"
          :step="step"
      />
    </div>

    <div ref="appendRef" class="ui-input__append">
      <Transition v-if="clearable" name="fade">
      </Transition>
      <Transition v-if="showPassword" name="fade">
      </Transition>

      <slot name="append"/>
    </div>
  </div>
</template>

<script setup lang="ts">
import type {InputProps} from "./types";

const props = withDefaults(defineProps<InputProps>(), {
  size: "md",
  type: "text",
  indexTab: "0",
  autocomplete: "off",
  step: "any"
});

const emits = defineEmits<{
  change: [void];
  clear: [void];
  blur: [void];
  input: [string];
}>();
const modelValue = defineModel<string | null | number | undefined>("modelValue", {default: null});

const isFocus = ref(false);
const isShowPassword = ref(false);
const inputRef = ref();
const appendRef = ref();
const prependRef = ref();

function onBlur() {
  isFocus.value = false;
  inputRef.value?.blur();
  emits("blur");
}

function onClear() {
  modelValue.value = props.isEmptyValueNull ? null : "";
  emits("clear");
}

function onInput(e: Event) {
  if (props.isEmptyValueNull && (e.target as HTMLInputElement).value === "") {
    modelValue.value = null;
  }
  emits("input", (e.target as HTMLInputElement).value);
}

function onFocus() {
  if (props.disabled || props.readonly) return;
  isFocus.value = true;
  inputRef.value?.focus();
}

defineExpose({
  focus: () => inputRef.value?.focus()
});

onMounted(() => {
  if (appendRef.value && props.disabled) {
    appendRef.value.querySelectorAll("button").forEach((item: HTMLButtonElement) => (item.disabled = true));
  }
  if (prependRef.value && props.disabled) {
    prependRef.value.querySelectorAll("button").forEach((item: HTMLButtonElement) => (item.disabled = true));
  }
});
</script>

