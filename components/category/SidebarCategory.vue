<template>
  <div class="py-6 text-zinc-950">
    <p v-if="pending && !categories.length" class="px-3 text-[15px] leading-4 text-zinc-500">
      Загрузка категорий...
    </p>

    <ul v-else class="space-y-1/2">
      <li v-for="category in categories" :key="category.id || category.slug">
        <NuxtLink
            :to="`/category/${category.slug}`"
            class="flex h-8 items-center rounded-lg px-3 text-[15px] leading-4 hover:bg-gray-50"
            :class="{ 'bg-zinc-600/5': isActive(category.slug) }"
        >
          {{ category.name }}
        </NuxtLink>
      </li>
      <li>
        <NuxtLink
            to="/category"
            class="flex h-8 items-center justify-between rounded-lg px-3 text-[15px] leading-4 hover:bg-gray-50"
            :class="{ 'bg-zinc-600/5': isCatalogIndex }"
        >
          Все категории
          <span class="flex size-4 shrink-0 items-center justify-center">
            <IconChevron />
          </span>
        </NuxtLink>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import IconChevron from '~/components/icons/IconChevron.vue';
import { useCategoryStore } from '~/stores/category';

const route = useRoute();
const { $api } = useNuxtApp();
const categoryStore = useCategoryStore();

const { pending } = await useAsyncData('category-tree', async () => {
  if (categoryStore.loaded) return categoryStore.tree;

  const tree = await $api.category.getTree().catch(() => []);
  categoryStore.tree = tree;
  categoryStore.loaded = true;
  return tree;
});

const categories = computed(() =>
    (categoryStore.getTree || []).filter((item) => item.slug && item.name),
);

const isCatalogIndex = computed(() => route.path === '/category');

function isActive(slug?: string) {
  if (!slug) return false;
  return route.path === `/category/${slug}`;
}
</script>
