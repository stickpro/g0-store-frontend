<template>
  <div class="w-full">
    <div class="flex flex-col gap-3">
      <nav class="flex items-center gap-0 text-[13px] leading-4 text-zinc-950" aria-label="Навигация">
        <NuxtLink to="/" class="flex size-6 items-center justify-center rounded-full p-1">
          <img src="@/assets/icons/home.svg" alt="Главная" class="size-4">
        </NuxtLink>
        <img src="@/assets/icons/chevron_right.svg" alt="" class="size-4">
        <span class="rounded-full px-2 py-1 text-[13px] leading-4 text-zinc-950">
          Поиск
        </span>
      </nav>

      <div class="flex items-center justify-between gap-4">
        <h1 class="min-w-0 flex-1 text-[28px] font-normal leading-[45px] text-zinc-950">
          {{ heading }}
        </h1>
        <p v-if="totalCount !== null" class="shrink-0 text-[13px] leading-[21px] text-zinc-950">
          Найдено {{ totalCount }} товаров
        </p>
      </div>
    </div>

    <div class="mt-6 flex gap-6">
      <aside class="hidden w-76 shrink-0 border-r border-dashed border-zinc-600/15 md:block">
        <SearchFilters
            v-model:category-slugs="categorySlugs"
            v-model:hide-out-of-stock="hideOutOfStock"
            v-model:in-store="inStore"
        />
      </aside>

      <div class="min-w-0 flex-1">
        <div v-if="!query" class="py-20 text-center">
          <p class="text-zinc-500">Введите запрос, чтобы найти товары</p>
        </div>

        <div v-else-if="isLoading" class="py-20 text-center">
          <p class="text-zinc-500">Ищем товары...</p>
        </div>

        <div v-else-if="error" class="py-20 text-center">
          <p class="text-zinc-600">{{ error }}</p>
        </div>

        <div v-else-if="products.length === 0" class="py-20 text-center">
          <p class="text-zinc-500">Товары не найдены</p>
        </div>

        <div v-else>
          <div class="grid grid-cols-2 border-t border-dashed border-zinc-600/15 md:grid-cols-3 xl:grid-cols-4">
            <ProductCard
                v-for="product in products"
                :key="product.id"
                :product="product"
                class="border-b border-dashed border-zinc-600/15"
            />
          </div>

          <div v-if="hasMore" class="mt-8 text-center">
            <button
                class="rounded-full border-2 border-orange-500 px-8 py-3 font-medium text-orange-500 transition-colors hover:bg-orange-50 disabled:opacity-60"
                :disabled="loadingMore"
                @click="loadMore"
            >
              {{ loadingMore ? 'Загрузка...' : 'Загрузить ещё' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import ProductCard from '~/components/product/ProductCard.vue';
import SearchFilters from '~/components/search/SearchFilters.vue';
import type { VariantCardResponse } from '~/repository/types/api/generatedApiGo';
import { stockFlagsFromParam, stockStatusParam } from '~/utils/searchFilters';
import { buildBreadcrumbJsonLd, buildCollectionPageJsonLd } from '~/utils/seo';

const PAGE_SIZE = 15;
const route = useRoute();
const requestURL = useRequestURL();
const { $api } = useNuxtApp();

const query = computed(() => String(route.query.q || '').trim());
const heading = computed(() => query.value ? `Поиск: ${query.value}` : 'Поиск');
const error = ref('');
const page = ref(1);
const items = ref<VariantCardResponse[]>([]);
const totalCount = ref<number | null>(null);
const lastPage = ref(1);
const loadingMore = ref(false);

const categorySlugs = ref<string[]>(queryList('category'));
const initialFlags = stockFlagsFromParam(queryString('stock_status'));
const hideOutOfStock = ref(initialFlags.hideOutOfStock);
const inStore = ref(initialFlags.inStore);

const categoryParam = computed(() => categorySlugs.value.join(',') || undefined);
const stockStatus = computed(() => stockStatusParam(hideOutOfStock.value, inStore.value));
const filterKey = computed(() => `${categoryParam.value || ''}|${stockStatus.value || ''}`);

const products = computed(() => items.value);
const hasMore = computed(() => page.value < lastPage.value);

function queryString(key: string): string {
  const raw = route.query[key];
  if (Array.isArray(raw)) return String(raw[0] || '');
  return raw ? String(raw) : '';
}

function queryList(key: string): string[] {
  return queryString(key).split(',').filter(Boolean);
}

watch(
    () => [route.query.category, route.query.stock_status],
    () => {
      categorySlugs.value = queryList('category');
      const flags = stockFlagsFromParam(queryString('stock_status'));
      hideOutOfStock.value = flags.hideOutOfStock;
      inStore.value = flags.inStore;
    },
);

watch(
    [categorySlugs, hideOutOfStock, inStore],
    async () => {
      const nextCategory = categoryParam.value;
      const nextStock = stockStatus.value;
      if (queryString('category') === (nextCategory || '') && queryString('stock_status') === (nextStock || '')) {
        return;
      }

      const nextQuery = { ...route.query };
      if (nextCategory) nextQuery.category = nextCategory;
      else delete nextQuery.category;
      if (nextStock) nextQuery.stock_status = nextStock;
      else delete nextQuery.stock_status;

      await navigateTo({ path: route.path, query: nextQuery }, { replace: true });
    },
    { deep: true },
);

const { pending } = await useAsyncData(
    () => `search-${query.value}-${filterKey.value}`,
    async () => {
      error.value = '';
      page.value = 1;
      items.value = [];
      totalCount.value = null;
      lastPage.value = 1;

      if (!query.value) return true;

      try {
        const result = await $api.search.search({
          q: query.value,
          page: 1,
          page_size: PAGE_SIZE,
          category: categoryParam.value,
          stock_status: stockStatus.value,
        });
        items.value = result.items || [];
        totalCount.value = result.pagination?.total ?? items.value.length;
        lastPage.value = result.pagination?.last_page || 1;
      } catch {
        error.value = 'Не удалось выполнить поиск';
      }

      return true;
    },
    { watch: [query, filterKey] },
);

const isLoading = computed(() => pending.value);

async function loadMore() {
  if (!hasMore.value || loadingMore.value || !query.value) return;
  loadingMore.value = true;
  page.value += 1;

  try {
    const result = await $api.search.search({
      q: query.value,
      page: page.value,
      page_size: PAGE_SIZE,
      category: categoryParam.value,
      stock_status: stockStatus.value,
    });
    items.value = [...items.value, ...(result.items || [])];
    totalCount.value = result.pagination?.total ?? totalCount.value;
    lastPage.value = result.pagination?.last_page || lastPage.value;
  } catch {
    page.value -= 1;
  } finally {
    loadingMore.value = false;
  }
}

const pageUrl = computed(() => {
  const url = new URL('/search', requestURL.origin);
  if (query.value) url.searchParams.set('q', query.value);
  if (categoryParam.value) url.searchParams.set('category', categoryParam.value);
  if (stockStatus.value) url.searchParams.set('stock_status', stockStatus.value);
  return url.toString();
});

const jsonLd = computed(() => [
  buildCollectionPageJsonLd({
    name: heading.value,
    url: pageUrl.value,
    numberOfItems: totalCount.value ?? products.value.length,
    items: products.value.slice(0, PAGE_SIZE).map((item) => ({
      name: item.name || item.slug || '',
      url: `${requestURL.origin}/product/${item.slug}`,
    })),
  }),
  buildBreadcrumbJsonLd(requestURL.origin, [
    { title: 'Главная', url: '/' },
    { title: 'Поиск', url: '/search' },
  ]),
]);

useSeoMeta({
  title: heading,
  description: () => query.value ? `Результаты поиска по запросу ${query.value}` : 'Поиск товаров',
  ogTitle: heading,
  ogType: 'website',
  ogUrl: pageUrl,
  ogLocale: 'ru_RU',
  robots: 'index, follow',
});

useHead(() => ({
  title: heading.value,
  link: [
    { rel: 'canonical', href: pageUrl.value },
  ],
  script: jsonLd.value.map((schema) => ({
    type: 'application/ld+json',
    innerHTML: JSON.stringify(schema),
  })),
}));
</script>
