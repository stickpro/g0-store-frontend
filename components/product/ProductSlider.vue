<script setup lang="ts">
import type {ProductResponse} from "~/repository/types/api/generatedApiGo";

defineProps({
  title: {
    type: String,
    default: 'Просмотренные',
  },
  products: {
    type: Array as PropType<ProductResponse[]>,
    required: true,
  },
});
</script>

<template>
  <div class="container mx-auto py-6">
    <!-- Заголовок -->
    <h2 class="text-2xl text-shadow-zinc-950 text-left mb-6">{{ title }}</h2>

    <!-- Контейнер для товаров -->
    <div class="flex justify-center gap-6 overflow-x-auto pb-4">
      <div
          v-for="product in products"
          :key="product.id"
          class="min-w-[200px] bg-white border border-gray-200 rounded-lg shadow-md p-4 flex-shrink-0"
      >
        <!-- Изображение -->
        <div class="w-full h-40 bg-gray-200 flex items-center justify-center mb-4">
          <img :src="product.image" alt="Product Image" class="max-h-full max-w-full object-contain">
        </div>

        <!-- Название товара -->
        <h3 class="text-sm font-medium text-gray-700 mb-2 line-clamp-2">{{ product.name }}</h3>

        <!-- Цена -->
        <p class="text-lg font-bold text-orange-600 mb-4">{{ product.price }} RUB</p>

        <!-- Кнопка "Купить" -->
        <button class="w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600 transition-colors">
          <svg class="w-5 h-5 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h18M3 7h18M3 12h18m-6 5h6"></path>
          </svg>
          Купить
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
