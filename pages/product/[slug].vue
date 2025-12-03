<template>
  <div v-if="product" class="px-4 lg:px-8">
    <Breadcrumbs :product-slug="slug" class="mb-6"/>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
      <!-- Левая колонка - Галерея изображений -->
      <div class="flex flex-row-reverse justify-end gap-6 min-w-[660px] max-h-[660px]">
        <!-- Основное изображение -->
        <div class="bg-white rounded-lg overflow-hidden">
          <img
              v-if="selectedImage || thumbnails[0] || product?.image"
              :src="config.public.storageUrl + (selectedImage || thumbnails[0] || product?.image)"
              :alt="product?.name || ''"
              class="w-full h-auto object-contain max-h-[500px]"
          />
          <div v-else class="w-full h-[500px] flex items-center justify-center text-gray-300">
            <svg class="w-32 h-32" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
          </div>
        </div>

        <!-- Миниатюры -->
        <div v-if="product" class="flex flex-col gap-3 overflow-x-auto">
          <button
              v-for="(img, index) in thumbnails"
              :key="index"
              @click="selectedImage = img"
              :class="[
              'p-2 flex-shrink-0 w-20 h-20 rounded-lg border-1 overflow-hidden transition-all',
              selectedImage === img ? 'border-blue-600' : 'border-zinc-200 hover:border-zinc-300'
            ]"
          >
            <img
                :src="config.public.storageUrl + img"
                :alt="`${product.name} - ${index + 1}`"
                class="w-full h-full object-cover"
            />
          </button>
        </div>
      </div>

      <!-- Правая колонка - Информация о товаре -->
      <div class="flex flex-col">
        <!-- Заголовок -->
        <h1 class="text-3xl lg:text-3xl font-normal text-zinc-950 mb-4">
          {{ product.name }}
        </h1>

        <!-- Рейтинг и отзывы -->
        <div class="flex items-center gap-2 mb-4">
          <div class="flex items-center gap-1">
            <svg v-for="star in 5" :key="star" class="w-5 h-5" :class="star <= 4 ? 'text-orange-500' : 'text-zinc-300'"
                 fill="currentColor" viewBox="0 0 20 20">
              <path
                  d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
            </svg>
          </div>
          <span class="text-sm text-zinc-600">Отзывов: 3</span>
          <span v-if="product.sku" class="text-sm text-blue-600 ml-auto">Код товара: {{ product.sku }}</span>
        </div>

        <!-- Статус наличия -->
        <div class="mb-6">
          <span class="text-orange-500 font-normal">{{ getStockStatusLabel(product?.stock_status) }}</span>
        </div>

        <!-- Цена -->
        <div class="flex justify-between">
          <div class="text-4xl font-bold text-zinc-950 mb-8">
            {{ formatPrice(product?.price || 0) }}
          </div>

          <!-- Кнопка купить -->
          <button
              @click="addToCart"
              class="w-full lg:w-auto px-3 py-3 bg-orange-500 hover:bg-orange-600 text-white text-lg rounded-full flex items-center justify-center gap-2 transition-colors mb-8"
          >
            <img src="@/assets/icons/add_shopping_cart.svg" alt="add_cart"/>
            <span class="px-1">Купить</span>
          </button>
        </div>
        <!-- Информационные блоки -->
        <div class="space-y-1 p-3 mb-8 border-1 border-zinc-300 rounded-3xl">
          <!-- Гарантия -->
          <div class="flex items-center px-4">
            <svg class="w-6 h-6 text-zinc-700 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
            </svg>
            <span class="text-sm text-zinc-700 font-medium">Гарантия</span>
          </div>

          <!-- Оплата -->
          <div class="flex items-center px-4">
            <svg class="w-6 h-6 text-zinc-700 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/>
            </svg>
            <span class="text-sm text-zinc-700 font-medium">Оплата</span>
          </div>
        </div>

        <!-- Доставка -->
        <div class="border border-zinc-300 rounded-3xl p-6">
          <div class="flex items-center gap-3 mb-4">
            <svg class="w-6 h-6 text-zinc-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"/>
            </svg>
            <h3 class="text-sm text-zinc-950">Доставка</h3>
          </div>
          <div class="flex justify-between">
            <!-- Табы доставки -->
            <div class="inline-flex rounded-3xl border-1 border-zinc-600/5 mb-4 transition-colors hover:bg-zinc-600/3">
              <button
                  v-for="tab in deliveryTabs"
                  :key="tab"
                  @click="selectedDeliveryTab = tab"
                  :class="[
                'px-6 py-3 text-base font-normal rounded-full transition-colors text-zinc-950',
                selectedDeliveryTab === tab
                  ? 'bg-zinc-600/5'
                  : ''
              ]"
              >
                {{ tab }}
              </button>
            </div>

            <!-- Город -->
            <div class="flex items-center justify-between mb-4 text-sm">
              <span class="text-zinc-600">Ваш город: </span>
              <button
                @click="geoStore.openModal()"
                class="text-zinc-950 font-medium flex items-center gap-1 hover:text-orange-500"
              >
                {{ geoStore.geo.city }}
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/>
                </svg>
              </button>
            </div>
          </div>
          <!-- Варианты доставки -->
          <div class="space-y-3">
            <button
                v-for="option in deliveryOptions"
                :key="option.name"
                @click="selectedDelivery = option.name"
                :class="[
                'w-full flex items-center gap-3 p-4 rounded-lg border-2 transition-all text-left',
                selectedDelivery === option.name
                  ? 'border-orange-500 bg-orange-50'
                  : 'border-zinc-200 hover:border-zinc-300'
              ]"
            >
              <img :src="option.icon" :alt="option.name" class="w-8 h-8 object-contain"/>
              <div class="flex-1">
                <div class="font-medium text-zinc-950">{{ option.name }}</div>
                <div class="text-sm text-zinc-600">{{ option.time }}</div>
              </div>
              <div class="font-bold text-zinc-950">{{ option.price }}</div>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Описание товара -->
    <div v-if="product.description" class="mt-12 prose max-w-none">
      <h2 class="text-2xl font-medium text-zinc-950 mb-4">Описание</h2>
      <div class="text-zinc-700 leading-relaxed" v-html="product.description"/>
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
import {useGeoStore} from '@/stores/geo';
import {formatPrice} from '@/utils/formatters/price';
import {getStockStatusLabel} from '~/utils/constants/stockStatus';

const route = useRoute();
const productStore = useProductStore();
const geoStore = useGeoStore();

const config = useRuntimeConfig();

// Получаем slug из параметров маршрута
const slug = route.params.slug as string;

// Загружаем товар через store
const productData = computed(() => productStore.getProductBySlug(slug));
const product = computed(() => productData.value?.product);
const medium = computed(() => productData.value?.medium || []);
const isLoading = computed(() => productStore.isProductLoading(slug));

// Галерея изображений
const selectedImage = ref<string>('');
const thumbnails = computed(() => {
  // Используем массив изображений из medium
  if (medium.value && medium.value.length > 0) {
    return medium.value.map(m => m.path || '').filter(Boolean);
  }
  // Если medium нет, используем основное изображение товара
  if (product.value?.image) {
    return [product.value.image];
  }
  return [];
});

// Доставка
const deliveryTabs = ['До ПВЗ', 'Курьером'];
const selectedDeliveryTab = ref('До ПВЗ');
const selectedDelivery = ref('СДЭК');

const deliveryOptions = computed(() => {
  return [
    {
      name: 'СДЭК',
      time: '7 дней',
      price: '500 RUB',
      icon: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHJ4PSI0IiBmaWxsPSIjMDBBRTRFIi8+PHBhdGggZD0iTTE2IDhMMjQgMTJWMjBMMTYgMjRMOCAyMFYxMkwxNiA4WiIgZmlsbD0id2hpdGUiLz48L3N2Zz4='
    },
    {
      name: 'Почта России',
      time: '12 дней',
      price: '270 RUB',
      icon: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHJ4PSI0IiBmaWxsPSIjMDA1QkI5Ii8+PHBhdGggZD0iTTggMTJIMjRWMjBIOFYxMloiIGZpbGw9IndoaXRlIi8+PC9zdmc+'
    },
    {
      name: 'Яндекс Доставка',
      time: '5 дней',
      price: '300 RUB',
      icon: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHJ4PSI0IiBmaWxsPSIjRkZEQjREIi8+PHBhdGggZD0iTTE2IDhMMjQgMjRIOEwxNiA4WiIgZmlsbD0iYmxhY2siLz48L3N2Zz4='
    }
  ];
});

// Добавление в корзину
function addToCart() {
  if (product.value) {
    // Здесь будет логика добавления в корзину
    console.log('Добавление товара в корзину:', product.value);
  }
}

definePageMeta({
  layout: 'product',
})

// Загружаем данные при монтировании
onMounted(async () => {
  try {
    await productStore.loadProductBySlug(slug);
    // Устанавливаем первое изображение из галереи как выбранное
    if (thumbnails.value.length > 0 && thumbnails.value[0]) {
      selectedImage.value = thumbnails.value[0];
    }
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
