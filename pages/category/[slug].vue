<template>
  <div class="w-full">
    <div class="flex flex-col gap-3">
      <Breadcrumbs :items="breadcrumbItems" />

      <div class="flex items-center justify-between gap-4">
        <h1 class="min-w-0 flex-1 text-[28px] font-normal leading-[45px] text-zinc-950">
          {{ categoryHeading }}
        </h1>
        <p v-if="totalCount !== null" class="shrink-0 text-[13px] leading-[21px] text-zinc-950">
          Найдено {{ totalCount }} товаров
        </p>
      </div>
    </div>

    <nav
        v-if="popularChildCategories.length || groupedChildCategories.length"
        class="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
        aria-label="Подкатегории"
    >
      <div
          v-if="popularChildCategories.length"
          class="flex flex-col gap-0.5 border-r border-b border-dashed border-zinc-600/15 py-4"
      >
        <p class="flex h-8 items-center px-3 text-[15px] font-bold leading-6 text-zinc-950">
          Популярные подкатегории
        </p>
        <ul class="flex flex-col gap-0.5">
          <li v-for="child in popularChildCategories" :key="child.id || child.slug">
            <NuxtLink
                :to="`/category/${child.slug}`"
                class="flex h-8 items-center px-3 text-[15px] leading-4 text-blue-600 hover:bg-zinc-600/5"
            >
              {{ child.name }}
            </NuxtLink>
          </li>
        </ul>
      </div>

      <div
          v-for="group in groupedChildCategories"
          :key="group.id || group.slug"
          class="flex flex-col gap-0.5 border-r border-b border-dashed border-zinc-600/15 py-4"
      >
        <NuxtLink
            :to="`/category/${group.slug}`"
            class="flex h-8 items-center px-3 text-[15px] font-bold leading-6 text-zinc-950 hover:bg-zinc-600/5"
        >
          {{ group.name }}
        </NuxtLink>
        <ul class="flex flex-col gap-0.5">
          <li v-for="child in group.children" :key="child.id || child.slug">
            <NuxtLink
                :to="`/category/${child.slug}`"
                class="flex h-8 items-center px-3 text-[15px] leading-4 text-blue-600 hover:bg-zinc-600/5"
            >
              {{ child.name }}
            </NuxtLink>
          </li>
        </ul>
      </div>
    </nav>

    <div v-if="isLoading" class="py-20 text-center">
      <p class="text-zinc-500">Загрузка товаров...</p>
    </div>

    <div v-else-if="error" class="py-20 text-center">
      <p class="text-zinc-600">{{ error }}</p>
    </div>

    <div v-else-if="products.length === 0" class="py-20 text-center">
      <p class="text-zinc-500">Товары не найдены</p>
    </div>

    <div v-else class="mt-6">
      <div class="grid grid-cols-2 border-t border-dashed border-zinc-600/15 md:grid-cols-3 xl:grid-cols-5">
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

    <p v-if="category?.description" class="mt-10 text-sm leading-6 text-zinc-700">
      {{ category.description }}
    </p>
  </div>
</template>

<script setup lang="ts">
import Breadcrumbs from '~/components/ui/Breadcrumbs.vue';
import ProductCard from '~/components/product/ProductCard.vue';
import { useCategoryStore } from '~/stores/category';
import { categoryFilterQueryKey, categoryProductsParamsFromQuery } from '~/composables/useCategoryProductQuery';
import type {
    CategoryTreeDTO,
    ShortProduct,
    GithubComStickproGoStoreInternalDtoEnrichedVariantDTO,
} from '~/repository/types/api/generatedApiGo';
import {
    buildBreadcrumbJsonLd,
    buildCollectionPageJsonLd,
    seoAbsoluteUrl,
    seoPlainText,
} from '~/utils/seo';

definePageMeta({
  layout: 'category',
});

const PAGE_SIZE = 15;
const route = useRoute();
const categoryStore = useCategoryStore();
const config = useRuntimeConfig();
const requestURL = useRequestURL();
const { $api } = useNuxtApp();

const slug = computed(() => String(route.params.slug || ''));
const productFilters = computed(() => categoryProductsParamsFromQuery(route.query));
const filterQueryKey = computed(() => categoryFilterQueryKey(route.query));
const page = ref(1);
const error = ref('');
const loadingMore = ref(false);

const category = computed(() => categoryStore.getBySlug(slug.value));
const categoryHeading = computed(() => category.value?.meta_h1 || category.value?.name || 'Категория');
const categoryTitle = computed(() => category.value?.meta_title || category.value?.name || categoryHeading.value);
const categoryDescription = computed(() =>
    seoPlainText(category.value?.meta_description || category.value?.description || categoryHeading.value, 160),
);
const variantItems = computed(() => categoryStore.getProducts(slug.value));
const pagination = computed(() => categoryStore.getProductsPagination(slug.value));
const totalCount = computed(() => pagination.value?.total ?? null);
const hasMore = computed(() => {
  const lastPage = pagination.value?.last_page || 1;
  return page.value < lastPage;
});

const products = computed<ShortProduct[]>(() =>
    variantItems.value.map(toShortProduct),
);

function parsePrice(value: unknown): number | undefined {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string' && value.trim()) {
    const parsed = Number(value.replace(',', '.'));
    return Number.isFinite(parsed) ? parsed : undefined;
  }
  return undefined;
}

function toShortProduct(variant: GithubComStickproGoStoreInternalDtoEnrichedVariantDTO): ShortProduct {
  return {
    id: variant.id,
    product_id: variant.product_id,
    name: variant.name,
    slug: variant.slug,
    model: variant.model,
    is_enable: variant.is_enable,
    price: parsePrice(variant.price_retail),
    image: variant.image,
  };
}

const { pending, data: categoryPageData } = await useAsyncData(
    () => `category-page-${slug.value}-${filterQueryKey.value}`,
    async () => {
      if (!slug.value) {
        throw createError({ statusCode: 404, message: 'Категория не найдена', fatal: true });
      }

      const currentSlug = slug.value;
      error.value = '';
      page.value = 1;

      const details = await $api.category.getBySlug(currentSlug).catch(() => null);
      if (!details?.id && !details?.slug && !details?.name) {
        throw createError({ statusCode: 404, message: 'Категория не найдена', fatal: true });
      }

      categoryStore.details[currentSlug] = details;

      if (!categoryStore.loaded) {
        const tree = await $api.category.getTree().catch(() => []);
        categoryStore.tree = tree;
        categoryStore.loaded = true;
      }

      const [breadcrumbs, filters, productsResult] = await Promise.all([
        $api.category.getBreadcrumbs(currentSlug).catch(() => []),
        $api.category.getFilters(currentSlug).catch(() => ({})),
        $api.category.getProducts(currentSlug, {
          ...productFilters.value,
          page: 1,
          page_size: PAGE_SIZE,
        }).catch(() => null),
      ]);

      categoryStore.breadcrumbs[currentSlug] = breadcrumbs || [];
      categoryStore.filters[currentSlug] = filters || {};
      categoryStore.products[currentSlug] = {
        items: productsResult?.items || [],
        pagination: productsResult?.pagination || null,
      };

      if (!productsResult) {
        error.value = 'Не удалось загрузить категорию';
      }

      return {
        breadcrumbs: breadcrumbs || [],
      };
    },
    { watch: [slug, filterQueryKey] },
);

function findCategoryNode(nodes: CategoryTreeDTO[], targetSlug: string): CategoryTreeDTO | null {
  for (const node of nodes) {
    if (node.slug === targetSlug) return node;
    if (node.children?.length) {
      const found = findCategoryNode(node.children, targetSlug);
      if (found) return found;
    }
  }
  return null;
}

const childCategories = computed(() => {
  const node = findCategoryNode(categoryStore.getTree, slug.value);
  return (node?.children || []).filter((item) => item.slug);
});

const popularChildCategories = computed(() =>
    childCategories.value.filter((item) => !item.children?.length),
);

const groupedChildCategories = computed(() =>
    childCategories.value.filter((item) => (item.children?.length || 0) > 0),
);

const breadcrumbItems = computed(() => {
  const crumbs = [...(categoryPageData.value?.breadcrumbs || categoryStore.getBreadcrumbs(slug.value) || [])];
  crumbs.sort((a, b) => (b.depth ?? 0) - (a.depth ?? 0));

  return crumbs.map((item) => ({
    id: item.id,
    title: item.name || item.meta_h1 || item.slug || '',
    slug: item.slug,
    url: `/category/${item.slug}`,
  }));
});

async function loadMore() {
  if (!hasMore.value || loadingMore.value) return;

  loadingMore.value = true;
  page.value += 1;

  try {
    const response = await $api.category.getProducts(slug.value, {
      ...productFilters.value,
      page: page.value,
      page_size: PAGE_SIZE,
    });
    const previous = categoryStore.products[slug.value]?.items || [];
    categoryStore.products[slug.value] = {
      items: [...previous, ...(response.items || [])],
      pagination: response.pagination || null,
    };
  } catch {
    page.value -= 1;
  } finally {
    loadingMore.value = false;
  }
}

const isLoading = computed(() =>
    pending.value
    || categoryStore.isDetailsLoading(slug.value)
    || categoryStore.isProductsLoading(slug.value),
);

const pageUrl = computed(() => `${requestURL.origin}/category/${slug.value}`);
const ogImage = computed(() =>
    seoAbsoluteUrl(String(config.public.storageUrl), category.value?.image_path) || undefined,
);

const jsonLd = computed(() => {
  const origin = requestURL.origin;
  const collection = buildCollectionPageJsonLd({
    name: categoryHeading.value,
    description: categoryDescription.value || undefined,
    url: pageUrl.value,
    image: ogImage.value,
    numberOfItems: totalCount.value ?? products.value.length,
    items: products.value.slice(0, PAGE_SIZE).map((item) => ({
      name: item.name || item.slug || '',
      url: `${origin}/product/${item.slug}`,
    })),
  });

  const breadcrumbs = buildBreadcrumbJsonLd(origin, [
    { title: 'Главная', url: '/' },
    { title: 'Каталог', url: '/category' },
    ...breadcrumbItems.value.map((item) => ({ title: item.title, url: item.url })),
  ]);

  return [collection, breadcrumbs];
});

useSeoMeta({
  title: () => categoryTitle.value,
  description: () => categoryDescription.value || undefined,
  ogTitle: () => categoryTitle.value,
  ogDescription: () => categoryDescription.value || undefined,
  ogType: 'website',
  ogUrl: () => pageUrl.value,
  ogImage: () => ogImage.value,
  ogLocale: 'ru_RU',
  twitterCard: 'summary_large_image',
  twitterTitle: () => categoryTitle.value,
  twitterDescription: () => categoryDescription.value || undefined,
  twitterImage: () => ogImage.value,
  robots: () => category.value?.is_enabled === false ? 'noindex, nofollow' : 'index, follow',
});

useHead(() => ({
  title: categoryTitle.value,
  link: [
    { rel: 'canonical', href: pageUrl.value },
  ],
  script: jsonLd.value.map((schema) => ({
    type: 'application/ld+json',
    innerHTML: JSON.stringify(schema),
  })),
}));
</script>
