<template>
  <label class="flex items-center gap-2 text-[13px] leading-[21px] text-zinc-950">
    <span class="shrink-0 text-zinc-950/70">Сортировка</span>
    <VSelect
        :model-value="currentSort"
        :options="sortOptions"
        aria-label="Сортировка"
        @update:model-value="apply"
    />
  </label>
</template>

<script setup lang="ts">
import VSelect from '~/components/ui/UiSelect/VSelect.vue';
import { PRODUCT_SORT_OPTIONS } from '~/utils/constants/sort';

const route = useRoute();
const sortOptions = [...PRODUCT_SORT_OPTIONS];

const currentSort = computed(() => {
  const raw = route.query.sort;
  return Array.isArray(raw) ? String(raw[0] || '') : String(raw || '');
});

async function apply(value: string) {
  const query = { ...route.query };

  if (value) query.sort = value;
  else delete query.sort;

  await navigateTo({ path: route.path, query }, { replace: true });
}
</script>
