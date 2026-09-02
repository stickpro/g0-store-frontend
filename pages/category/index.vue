<template>
  <div class="w-full">
    <div class="flex flex-col gap-3">
      <Breadcrumbs />

      <h1 class="text-[28px] font-normal leading-[45px] text-zinc-950">
        Все категории
      </h1>

      <form class="relative w-full" @submit.prevent>
        <input
            v-model="searchQuery"
            type="text"
            placeholder="Я ищу..."
            class="h-10 w-full rounded-full bg-zinc-600/5 py-0 pr-28 pl-4 text-[17px] leading-6 text-zinc-950 placeholder:text-zinc-950/50 focus:outline-none"
        >
        <button
            type="submit"
            class="absolute top-0 right-0 h-10 rounded-full bg-blue-600 px-4 text-[17px] leading-6 text-zinc-50 hover:bg-blue-700"
        >
          Искать
        </button>
      </form>
    </div>

    <div v-if="isLoading" class="flex items-center justify-center py-20">
      <p class="text-zinc-500">Загрузка категорий...</p>
    </div>

    <div v-else-if="visibleCategories.length > 0" class="mt-6 flex flex-col gap-6">
      <section
          v-for="rootCategory in visibleCategories"
          :key="rootCategory.id"
      >
        <NuxtLink
            :to="`/category/${rootCategory.slug}`"
            class="mb-4 block text-[22px] leading-9 text-blue-600 hover:text-blue-700"
        >
          {{ rootCategory.name }}
        </NuxtLink>

        <div
            v-if="rootCategory.children?.length"
            class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
        >
          <div
              v-for="subCategory in rootCategory.children"
              :key="subCategory.id"
              class="flex flex-col gap-0.5 border-r border-b border-dashed border-zinc-600/15 py-4"
          >
            <NuxtLink
                :to="`/category/${subCategory.slug}`"
                class="flex h-8 items-center px-3 text-[15px] font-bold leading-6 text-zinc-950 hover:bg-zinc-600/5"
            >
              {{ subCategory.name }}
            </NuxtLink>

            <ul v-if="subCategory.children?.length" class="flex flex-col gap-0.5">
              <li v-for="child in subCategory.children" :key="child.id">
                <NuxtLink
                    :to="`/category/${child.slug}`"
                    class="flex h-8 items-center px-3 text-[15px] leading-4 text-blue-600 hover:bg-zinc-600/5"
                >
                  {{ child.name }}
                </NuxtLink>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>

    <div v-else class="py-20 text-center">
      <p class="text-zinc-600">Категории не найдены</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import Breadcrumbs from '~/components/ui/Breadcrumbs.vue';
import { useCategoryStore } from '@/stores/category';
import type { CategoryTreeDTO } from '~/repository/types/api/generatedApiGo';
import { buildBreadcrumbJsonLd, buildCollectionPageJsonLd } from '~/utils/seo';

const categoryStore = useCategoryStore();
const requestURL = useRequestURL();
const { $api } = useNuxtApp();

const { pending } = await useAsyncData('category-index', async () => {
  const tree = await $api.category.getTree().catch(() => []);
  categoryStore.tree = tree;
  categoryStore.loaded = true;
  return tree;
});

const categories = computed(() => categoryStore.getTree);
const isLoading = computed(() => pending.value || categoryStore.isLoading);
const searchQuery = ref('');

function matchesQuery(name: string | undefined, query: string) {
  return (name ?? '').toLowerCase().includes(query);
}

function filterCategory(category: CategoryTreeDTO, query: string): CategoryTreeDTO | null {
  const children = (category.children ?? [])
      .map((child) => filterCategory(child, query))
      .filter((child): child is CategoryTreeDTO => child !== null);

  if (matchesQuery(category.name, query) || children.length > 0) {
    return { ...category, children };
  }

  return null;
}

const visibleCategories = computed(() => {
  const query = searchQuery.value.trim().toLowerCase();
  if (!query) return categories.value;

  return categories.value
      .map((category) => filterCategory(category, query))
      .filter((category): category is CategoryTreeDTO => category !== null);
});

const pageUrl = computed(() => `${requestURL.origin}/category`);
const pageTitle = 'Все категории';
const pageDescription = 'Каталог товаров — все категории интернет-магазина';

const jsonLd = computed(() => {
  const origin = requestURL.origin;
  const collection = buildCollectionPageJsonLd({
    name: pageTitle,
    description: pageDescription,
    url: pageUrl.value,
    items: categories.value.map((item) => ({
      name: item.name || item.slug || '',
      url: `${origin}/category/${item.slug}`,
    })),
  });

  const breadcrumbs = buildBreadcrumbJsonLd(origin, [
    { title: 'Главная', url: '/' },
    { title: 'Каталог', url: '/category' },
  ]);

  return [collection, breadcrumbs];
});

useSeoMeta({
  title: pageTitle,
  description: pageDescription,
  ogTitle: pageTitle,
  ogDescription: pageDescription,
  ogType: 'website',
  ogUrl: pageUrl.value,
  ogLocale: 'ru_RU',
  twitterCard: 'summary',
  twitterTitle: pageTitle,
  twitterDescription: pageDescription,
  robots: 'index, follow',
});

useHead(() => ({
  title: pageTitle,
  link: [
    { rel: 'canonical', href: pageUrl.value },
  ],
  script: jsonLd.value.map((schema) => ({
    type: 'application/ld+json',
    innerHTML: JSON.stringify(schema),
  })),
}));
</script>
