<template>
  <div v-if="product">
    <Breadcrumbs :product-slug="slug" class="mb-4"/>

    <h1 class="text-2xl text-zinc-950 mb-4">{{ product.name }}</h1>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Изображение товара -->
      <div v-if="product.image" class="rounded-3xl overflow-hidden bg-gray-100">
        <img :src="product.image" :alt="product.name" class="w-full h-auto object-cover"/>
      </div>

      <!-- Информация о товаре -->
      <div class="flex flex-col gap-4">
        <div v-if="product.price" class="text-3xl font-bold text-zinc-950">
          {{ formatPrice(product.price) }}
        </div>

        <div v-if="product.description" class="text-zinc-700" v-html="product.description"/>

        <div class="flex flex-col gap-2 border-t border-zinc-200 pt-4">
          <div v-if="product.sku" class="flex justify-between">
            <span class="text-zinc-600">Артикул:</span>
            <span class="text-zinc-950">{{ product.sku }}</span>
          </div>

          <div v-if="product.stock_status" class="flex justify-between">
            <span class="text-zinc-600">Наличие:</span>
            <span class="text-zinc-950">{{ product.stock_status }}</span>
          </div>

          <div v-if="product.quantity !== undefined" class="flex justify-between">
            <span class="text-zinc-600">Количество:</span>
            <span class="text-zinc-950">{{ product.quantity }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div v-else-if="isLoading" class="flex items-center justify-center py-20">
    <p class="text-zinc-500">Загрузка...</p>
  </div>

  <div v-else class="flex items-center justify-center py-20">
    <p class="text-zinc-500">Товар не найден</p>
  </div>
</template>

<script setup lang="ts">
import Breadcrumbs from '@/components/ui/Breadcrumbs.vue'
import {useProductStore} from '@/stores/product/';
import {formatPrice} from '@/utils/formatters/price';

const route = useRoute();
const productStore = useProductStore();

// Получаем slug из параметров маршрута
const slug = route.params.slug as string;

// Загружаем товар через store
const product = computed(() => productStore.getProductBySlug(slug));
const isLoading = computed(() => productStore.isProductLoading(slug));

// Загружаем данные при монтировании
onMounted(async () => {
  try {
    await productStore.loadProductBySlug(slug);
  } catch (error) {
    console.error('Ошибка загрузки товара:', error);
  }
});

// SEO meta tags
useHead(() => ({
  title: product.value?.meta_title || product.value?.name || 'Товар',
  meta: [
    {name: 'description', content: product.value?.meta_description || product.value?.description || ''},
    {name: 'keywords', content: product.value?.meta_keyword || ''},
  ],
}));
</script>

<style scoped>

</style>
