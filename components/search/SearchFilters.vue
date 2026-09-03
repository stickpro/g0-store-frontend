<template>
  <div class="w-full text-[15px] text-zinc-950">
    <section class="flex flex-col gap-0.5 border-b border-dashed border-zinc-600/15 px-3 py-6">
      <VCheckbox v-model="hideOutOfStock">
        Скрыть «Не в наличии»
      </VCheckbox>
      <VCheckbox v-model="inStore">
        В наличии в магазине
      </VCheckbox>
    </section>

    <section class="py-6">
      <h2 class="flex h-8 items-center px-3 text-[15px] font-bold leading-6">Категория</h2>

      <div class="px-3 py-2">
        <div class="relative">
          <span class="pointer-events-none absolute top-0 left-0 flex size-8 items-center justify-center">
            <IconSearch class="size-4" />
          </span>
          <input
              v-model="categoryQuery"
              type="text"
              placeholder="Категория"
              class="h-8 w-full rounded-full bg-zinc-600/5 py-0 pr-8 pl-8 text-[15px] leading-6 outline-none placeholder:text-zinc-500"
          >
          <button
              v-if="categoryQuery"
              type="button"
              class="absolute top-0 right-0 flex size-8 items-center justify-center"
              aria-label="Очистить поиск категорий"
              @click="categoryQuery = ''"
          >
            <IconXmark class="size-4" />
          </button>
        </div>
      </div>

      <ul class="flex flex-col gap-0.5 px-3">
        <li v-for="category in visibleCategories" :key="category.id || category.slug">
          <VCheckbox
              :model-value="isCategorySelected(category.slug)"
              @update:model-value="toggleCategory(category.slug)"
          >
            {{ category.name }}
          </VCheckbox>
        </li>
      </ul>
    </section>
  </div>
</template>

<script setup lang="ts">
import IconSearch from '~/components/icons/IconSearch.vue';
import IconXmark from '~/components/icons/IconXmark.vue';
import VCheckbox from '~/components/ui/UiCheckbox/VCheckbox.vue';
import { useCategoryStore } from '~/stores/category';

const categorySlugs = defineModel<string[]>('categorySlugs', { default: () => [] });
const hideOutOfStock = defineModel<boolean>('hideOutOfStock', { default: false });
const inStore = defineModel<boolean>('inStore', { default: false });

const categoryStore = useCategoryStore();
const categoryQuery = ref('');

onMounted(() => {
  categoryStore.loadTree();
});

const rootCategories = computed(() =>
    (categoryStore.getTree || []).filter((item) => item.slug && item.name),
);

const visibleCategories = computed(() => {
  const query = categoryQuery.value.trim().toLowerCase();
  if (!query) return rootCategories.value;
  return rootCategories.value.filter((item) =>
      (item.name || '').toLowerCase().includes(query),
  );
});

function isCategorySelected(slug?: string) {
  if (!slug) return false;
  return categorySlugs.value.includes(slug);
}

function toggleCategory(slug?: string) {
  if (!slug) return;
  if (categorySlugs.value.includes(slug)) {
    categorySlugs.value = categorySlugs.value.filter((item) => item !== slug);
    return;
  }
  categorySlugs.value = [...categorySlugs.value, slug];
}
</script>
