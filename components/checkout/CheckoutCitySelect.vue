<template>
  <div ref="rootRef" class="relative block">
    <span class="mb-1 block px-4 text-[13px] leading-4 text-zinc-500">Город</span>
    <button
        type="button"
        class="flex h-10 w-full items-center justify-between rounded-full bg-zinc-600/5 px-4 text-left text-[15px] text-zinc-950 outline-none"
        :aria-expanded="open"
        aria-haspopup="listbox"
        @click="toggle"
    >
      <span class="min-w-0 truncate">{{ selectedLabel }}</span>
      <span
          class="flex size-6 shrink-0 items-center justify-center text-zinc-500 transition-transform"
          :class="{ 'rotate-180': open }"
      >
        <IconChevron class="size-4"/>
      </span>
    </button>

    <div
        v-if="open"
        class="absolute z-30 mt-1 w-full overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm"
    >
      <div class="border-b border-zinc-600/10 p-2">
        <input
            ref="searchRef"
            v-model="searchQuery"
            type="search"
            autocomplete="off"
            placeholder="Поиск города"
            class="h-10 w-full rounded-full bg-zinc-600/5 px-4 text-[15px] text-zinc-950 outline-none placeholder:text-zinc-400"
            @keydown.esc.prevent="close"
        >
      </div>

      <ul class="max-h-64 overflow-y-auto py-1" role="listbox">
        <li v-if="loading" class="px-4 py-3 text-[13px] leading-4 text-zinc-500">
          Загрузка…
        </li>
        <li
            v-else-if="!cities.length"
            class="px-4 py-3 text-[13px] leading-4 text-zinc-500"
        >
          {{ searchQuery.trim().length >= 2 ? 'Городов не найдено' : 'Начните вводить название' }}
        </li>
        <li
            v-for="city in cities"
            :key="cityKey(city)"
            role="option"
            :aria-selected="isSelected(city)"
            class="cursor-pointer px-4 py-2 text-left hover:bg-zinc-600/5"
            :class="{ 'bg-zinc-600/5': isSelected(city) }"
            @mousedown.prevent="select(city)"
        >
          <span class="block text-[15px] leading-6 text-zinc-950">
            {{ city.city || city.settlement || city.address || 'Город' }}
          </span>
          <span
              v-if="city.region"
              class="block text-[13px] leading-4 text-zinc-500"
          >
            {{ city.region }}{{ city.region_type ? ` ${city.region_type}` : '' }}
          </span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onClickOutside, useDebounceFn } from '@vueuse/core';
import IconChevron from '~/components/icons/IconChevron.vue';
import type { CityResponse } from '~/repository/types/api/generatedApiGo';
import { cityLabel, useGeoStore } from '~/stores/geo';

const geoStore = useGeoStore();

const rootRef = ref<HTMLElement | null>(null);
const searchRef = ref<HTMLInputElement | null>(null);
const open = ref(false);
const searchQuery = ref('');
const cities = ref<CityResponse[]>([]);
const loading = ref(false);
let loadSeq = 0;

const selectedLabel = computed(() => geoStore.geo.city || 'Выберите город');

onClickOutside(rootRef, () => close());

function cityKey(city: CityResponse) {
  return city.id || city.fias_id || city.kladr_id || `${city.city}-${city.region}-${city.postal_code}`;
}

function isSelected(city: CityResponse) {
  const current = geoStore.geo.cityData;
  if (current?.id && city.id) return current.id === city.id;
  if (current?.fias_id && city.fias_id) return current.fias_id === city.fias_id;
  return cityLabel(current) === cityLabel(city);
}

async function loadPopular() {
  const { $api } = useNuxtApp();
  const seq = ++loadSeq;
  loading.value = true;
  try {
    const data = await $api.geo.getPopularCity();
    if (seq !== loadSeq) return;
    cities.value = data;
  } catch {
    if (seq !== loadSeq) return;
    cities.value = [];
  } finally {
    if (seq === loadSeq) loading.value = false;
  }
}

async function searchCities(query: string) {
  const { $api } = useNuxtApp();
  const seq = ++loadSeq;
  loading.value = true;
  try {
    const data = await $api.geo.findCity(query);
    if (seq !== loadSeq) return;
    cities.value = data;
  } catch {
    if (seq !== loadSeq) return;
    cities.value = [];
  } finally {
    if (seq === loadSeq) loading.value = false;
  }
}

const scheduleSearch = useDebounceFn((query: string) => {
  void searchCities(query);
}, 300);

watch(searchQuery, (value) => {
  if (!open.value) return;
  const query = value.trim();
  if (query.length >= 2) {
    scheduleSearch(query);
    return;
  }
  void loadPopular();
});

async function openDropdown() {
  open.value = true;
  searchQuery.value = '';
  await loadPopular();
  await nextTick();
  searchRef.value?.focus();
}

function close() {
  open.value = false;
  searchQuery.value = '';
}

function toggle() {
  if (open.value) {
    close();
    return;
  }
  void openDropdown();
}

function select(city: CityResponse) {
  geoStore.setCity(city);
  close();
}
</script>
