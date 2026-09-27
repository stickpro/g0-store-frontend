<template>
  <CategorySlugPage v-if="resolved?.type === 'category'" />
  <ProductSlugPage v-else-if="resolved?.type === 'product'" />
</template>

<script setup lang="ts">
import CategorySlugPage from '~/components/category/CategorySlugPage.vue';
import ProductSlugPage from '~/components/product/ProductSlugPage.vue';
import { useCategoryStore } from '~/stores/category';
import { useProductStore } from '~/stores/product';

const route = useRoute();
const { $api } = useNuxtApp();
const categoryStore = useCategoryStore();
const productStore = useProductStore();

const slug = computed(() => String(route.params.slug || ''));

const { data: resolved } = await useAsyncData(
    () => `resolve-${slug.value}`,
    async () => {
      if (!slug.value) {
        throw createError({ statusCode: 404, message: 'Страница не найдена', fatal: true });
      }

      const result = await $api.resolve.bySlug(slug.value).catch(() => null);
      if (!result) {
        throw createError({ statusCode: 404, message: 'Страница не найдена', fatal: true });
      }

      if (result.type === 'category') {
        categoryStore.details[slug.value] = result.data;
        setPageLayout('category');
      } else {
        productStore.products[slug.value] = {
          data: result.data,
          timestamp: Date.now(),
        };
        productStore.updateAccessOrder(slug.value);
        setPageLayout('product');
      }

      return result;
    },
    { watch: [slug] },
);

watch(
    resolved,
    (value) => {
      if (value?.type === 'category') setPageLayout('category');
      else if (value?.type === 'product') setPageLayout('product');
    },
    { immediate: true },
);
</script>
