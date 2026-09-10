<template>
  <div ref="rootRef" class="relative block">
    <label class="block">
      <span class="mb-1 block px-4 text-[13px] leading-4 text-zinc-500">{{ label }}</span>
      <div class="relative">
        <input
            ref="inputRef"
            :value="modelValue"
            type="text"
            autocomplete="off"
            :placeholder="placeholder"
            class="h-10 w-full rounded-full bg-zinc-600/5 px-4 pr-10 text-[15px] text-zinc-950 outline-none placeholder:text-zinc-400"
            @input="onInput"
            @focus="onFocus"
            @keydown.down.prevent="moveHighlight(1)"
            @keydown.up.prevent="moveHighlight(-1)"
            @keydown.enter.prevent="selectHighlighted"
            @keydown.esc.prevent="close"
        >
        <button
            v-if="modelValue"
            type="button"
            class="absolute right-2 top-1/2 flex size-6 -translate-y-1/2 items-center justify-center"
            aria-label="Очистить"
            @click="clear"
        >
          <IconXmark class="size-4"/>
        </button>
      </div>
    </label>

    <ul
        v-if="open"
        class="absolute z-30 mt-1 max-h-64 w-full overflow-y-auto rounded-3xl border border-zinc-200 bg-white py-1 shadow-sm"
        role="listbox"
    >
      <li v-if="loading" class="px-4 py-3 text-[13px] leading-4 text-zinc-500">
        Загрузка…
      </li>
      <li
          v-else-if="!suggestions.length"
          class="px-4 py-3 text-[13px] leading-4 text-zinc-500"
      >
        {{ modelValue.trim().length >= 2 ? 'Адрес не найден' : 'Начните вводить улицу' }}
      </li>
      <li
          v-for="(item, index) in suggestions"
          :key="itemKey(item, index)"
          role="option"
          class="cursor-pointer px-4 py-2 text-left hover:bg-zinc-600/5"
          :class="{ 'bg-zinc-600/5': index === highlightedIndex }"
          @mousedown.prevent="select(item)"
          @mouseenter="highlightedIndex = index"
      >
        <span class="block text-[15px] leading-6 text-zinc-950">
          {{ itemTitle(item) }}
        </span>
        <span
            v-if="itemSubtitle(item)"
            class="block text-[13px] leading-4 text-zinc-500"
        >
          {{ itemSubtitle(item) }}
        </span>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { onClickOutside, useDebounceFn } from '@vueuse/core';
import IconXmark from '~/components/icons/IconXmark.vue';
import { useGeoStore } from '~/stores/geo';

type SuggestAddressComponent = {
  name?: string;
  kind?: string[];
};

type SuggestResult = {
  title?: { text?: string };
  subtitle?: { text?: string };
  tags?: string[];
  address?: {
    formatted_address?: string;
    component?: SuggestAddressComponent[];
  };
  uri?: string;
};

type SuggestResponse = {
  results?: SuggestResult[];
};

withDefaults(defineProps<{
  label?: string;
  placeholder?: string;
}>(), {
  label: '*Улица, дом',
  placeholder: 'Невский проспект, 1',
});

const modelValue = defineModel<string>({ default: '' });
const emit = defineEmits<{
  select: [payload: { address: string; result: SuggestResult }];
}>();

const geoStore = useGeoStore();
const rootRef = ref<HTMLElement | null>(null);
const inputRef = ref<HTMLInputElement | null>(null);
const open = ref(false);
const loading = ref(false);
const suggestions = ref<SuggestResult[]>([]);
const highlightedIndex = ref(0);
let loadSeq = 0;

onClickOutside(rootRef, () => close());

function hasKind(component: SuggestAddressComponent, kind: string) {
  return (component.kind || []).some((item) => item.toLowerCase() === kind);
}

function componentName(result: SuggestResult, kind: string) {
  return result.address?.component?.find((item) => hasKind(item, kind))?.name?.trim() || '';
}

function formatStreetAddress(result: SuggestResult) {
  const street = componentName(result, 'street');
  const house = componentName(result, 'house');
  if (street && house) return `${street}, ${house}`;
  if (street) return street;
  return result.title?.text?.trim()
      || result.address?.formatted_address?.trim()
      || '';
}

function itemTitle(result: SuggestResult) {
  return formatStreetAddress(result) || result.title?.text || 'Адрес';
}

function itemSubtitle(result: SuggestResult) {
  return result.subtitle?.text
      || result.address?.formatted_address
      || '';
}

function itemKey(result: SuggestResult, index: number) {
  return result.uri || `${itemTitle(result)}-${index}`;
}

async function loadSuggestions(text: string) {
  const query = text.trim();
  if (query.length < 2) {
    suggestions.value = [];
    loading.value = false;
    return;
  }

  const seq = ++loadSeq;
  loading.value = true;

  const [lon, lat] = geoStore.cityCoordinates;
  const city = geoStore.geo.city?.replace(/^г\.\s*/i, '').trim();
  const suggestText = city && !query.toLowerCase().includes(city.toLowerCase())
      ? `${city}, ${query}`
      : query;

  try {
    const data = await $fetch<SuggestResponse>('/api/yandex/suggest', {
      query: {
        text: suggestText,
        types: 'street,house',
        results: '7',
        ll: `${lon},${lat}`,
        spn: '0.35,0.35',
      },
    });
    if (seq !== loadSeq) return;
    suggestions.value = data.results || [];
    highlightedIndex.value = 0;
  } catch {
    if (seq !== loadSeq) return;
    suggestions.value = [];
  } finally {
    if (seq === loadSeq) loading.value = false;
  }
}

const scheduleSearch = useDebounceFn((text: string) => {
  void loadSuggestions(text);
}, 300);

function onInput(event: Event) {
  const value = (event.target as HTMLInputElement).value;
  modelValue.value = value;
  open.value = true;
  scheduleSearch(value);
}

function onFocus() {
  open.value = true;
  if (modelValue.value.trim().length >= 2) {
    scheduleSearch(modelValue.value);
  }
}

function close() {
  open.value = false;
}

function clear() {
  modelValue.value = '';
  suggestions.value = [];
  open.value = false;
  inputRef.value?.focus();
}

function moveHighlight(delta: number) {
  if (!suggestions.value.length) return;
  const next = highlightedIndex.value + delta;
  highlightedIndex.value = (next + suggestions.value.length) % suggestions.value.length;
}

function selectHighlighted() {
  const item = suggestions.value[highlightedIndex.value];
  if (item) select(item);
}

function select(result: SuggestResult) {
  const address = formatStreetAddress(result);
  if (!address) return;
  modelValue.value = address;
  emit('select', { address, result });
  close();
}
</script>
