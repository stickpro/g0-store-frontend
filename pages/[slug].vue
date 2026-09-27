<template>
  <NuxtLayout :name="layoutName">
    <CategorySlugPage v-if="showCategory" />
    <ProductSlugPage v-else-if="showProduct" />
  </NuxtLayout>
</template>

<script setup lang="ts">
import CategorySlugPage from '~/components/category/CategorySlugPage.vue';
import ProductSlugPage from '~/components/product/ProductSlugPage.vue';
import { useCategoryStore } from '~/stores/category';
import { useProductStore } from '~/stores/product';
import type { ResolvedSlug } from '~/repository/modules/resolve';

definePageMeta({
  layout: false,
});

const route = useRoute();
const { $api } = useNuxtApp();
const categoryStore = useCategoryStore();
const productStore = useProductStore();
const catalogEntity = useCatalogEntity();

const slug = computed(() => String(route.params.slug || ''));

const showCategory = computed(() =>
    catalogEntity.value?.type === 'category' && catalogEntity.value.slug === slug.value,
);
const showProduct = computed(() =>
    catalogEntity.value?.type === 'product' && catalogEntity.value.slug === slug.value,
);

const layoutName = computed(() => {
  if (showProduct.value) return 'product';
  if (showCategory.value) return 'category';
  return 'default';
});

watch(slug, (next, prev) => {
  if (next !== prev) catalogEntity.value = null;
});

function seedFromResolved(result: ResolvedSlug) {
  catalogEntity.value = { type: result.type, slug: slug.value };

  if (result.type === 'category') {
    categoryStore.details[slug.value] = result.data;
    return;
  }

  productStore.products[slug.value] = {
    data: result.data,
    timestamp: Date.now(),
  };
  productStore.updateAccessOrder(slug.value);
}

const { data: resolved, error: resolveError } = await useAsyncData(
    () => `resolve-${slug.value}`,
    async () => {
      if (!slug.value) {
        throw createError({ statusCode: 404, message: 'Страница не найдена', fatal: true });
      }

      const result = await $api.resolve.bySlug(slug.value).catch(() => null);
      if (!result) {
        throw createError({ statusCode: 404, message: 'Страница не найдена', fatal: true });
      }

      return result;
    },
    { watch: [slug] },
);

if (resolveError.value) {
  throw resolveError.value;
}

if (resolved.value) {
  seedFromResolved(resolved.value);
}

watch(resolved, (value) => {
  if (value) seedFromResolved(value);
});
</script>
