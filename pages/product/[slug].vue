<template>
  <div v-if="product" class="w-full">
    <Breadcrumbs :items="breadcrumbItems"/>
    <div class="sticky top-[83px] z-10 bg-white grid grid-cols-2 border-b border-b-zinc-600/15 my-6 pt-2">
      <div class="flex">
        <button
            class="p-3 text-base transition-colors"
            :class="activeTab === 'about' ? 'border-b-2 border-orange-500' : 'text-zinc-600 hover:text-zinc-950'"
            @click="activeTab = 'about'"
        >
          Все о товаре
        </button>
        <button
            class="p-3 text-base transition-colors text-zinc-950"
            :class="activeTab === 'specs' ? 'border-b-2 border-orange-500 ' : 'text-zinc-600 hover:text-zinc-950'"
            @click="activeTab = 'specs'"
        >
          Характеристики
        </button>
        <button
            class="p-3 text-base transition-colors"
            :class="activeTab === 'reviews' ? 'border-b-2 border-orange-500 ' : 'text-zinc-600 hover:text-zinc-950'"
            @click="activeTab = 'reviews'"
        >
          Отзывы
        </button>
      </div>
      <div class="flex justify-end gap-6 pb-2">
        <div class="flex flex-col text-right">
          <span class="text-orange-500 font-normal">{{ getStockStatusLabel(product?.stock_status) }}</span>
          <span class="font-bold">{{ formatPrice(product?.price_retail || 0) }}</span>
        </div>
        <button
            class="w-full lg:w-auto px-3 py-3 bg-orange-500 hover:bg-orange-600 text-white text-lg rounded-full flex items-center justify-center gap-2 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            :disabled="adding"
            @click="addToCart"
        >
          <img src="@/assets/icons/add_shopping_cart.svg" alt="add_cart">
          <span class="px-1">В Корзину</span>
        </button>
      </div>
    </div>
    <!-- Контент таба "Все о товаре" -->
    <Transition name="fade" mode="out-in">
      <div v-if="activeTab === 'about'" key="about">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          <!-- Левая колонка - Галерея изображений -->
          <div class="flex flex-row-reverse justify-end gap-6 min-w-[660px] max-h-[660px]">
            <!-- Основное изображение -->
            <div
                class="bg-white rounded-lg overflow-hidden cursor-zoom-in"
                @click="openGallery(selectedIndex)"
            >
              <ProductPicture
                  v-if="selectedImage"
                  :image="selectedImage"
                  preset="pdp"
                  :alt="selectedImage.alt || productTitle"
                  class="w-full h-auto object-contain"
              />
              <div v-else class="w-full flex items-center justify-center text-gray-300">
                <svg class="w-32 h-32" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
              </div>
            </div>

            <!-- Миниатюры -->
            <div v-if="galleryImages.length" class="flex flex-col gap-3 overflow-x-auto min-w-[80px]">
              <button
                  v-for="(img, index) in galleryImages"
                  :key="img.id || index"
                  :class="[
                'p-2 flex-shrink-0 w-20 h-20 rounded-lg border-1 overflow-hidden transition-all cursor-zoom-in',
                selectedIndex === index ? 'border-blue-600' : 'border-zinc-200 hover:border-zinc-300'
              ]"
                  @click="openGallery(index)"
                  @mouseenter="selectedIndex = index"
              >
                <ProductPicture
                    :image="img"
                    preset="thumb"
                    :alt="img.alt || `${productTitle} — фото ${index + 1}`"
                    class="w-full h-full object-cover"
                />
              </button>
            </div>
          </div>

          <!-- Правая колонка - Информация о товаре -->
          <div class="flex flex-col">
            <!-- Заголовок -->
            <h1 class="text-3xl lg:text-3xl font-normal text-zinc-950 mb-4">
              {{ productHeading }}
            </h1>

            <!-- Рейтинг и отзывы -->
            <div class="flex items-center gap-2 mb-4">
              <div class="flex items-center gap-1">
                <svg
                    v-for="star in 5"
                    :key="star"
                    class="w-5 h-5"
                    :class="star <= Math.round(averageRating) ? 'text-orange-500' : 'text-zinc-300'"
                    fill="currentColor" viewBox="0 0 20 20">
                  <path
                      d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
              </div>
              <span class="text-sm text-zinc-600">Отзывов: {{ reviews.length }}</span>
              <span v-if="product.sku" class="text-sm text-blue-600 ml-auto">Код товара: {{ product.sku }}</span>
            </div>

            <!-- Статус наличия -->
            <div class="mb-6">
              <span class="text-orange-500 font-normal">{{ getStockStatusLabel(product?.stock_status) }}</span>
            </div>

            <!-- Цена -->
            <div class="flex justify-between">
              <div class="text-4xl font-bold text-zinc-950 mb-8">
                {{ formatPrice(product?.price_retail || 0) }}
              </div>

              <!-- Кнопка купить -->
              <button
                  class="w-full lg:w-auto px-3 py-3 bg-orange-500 hover:bg-orange-600 text-white text-lg rounded-full flex items-center justify-center gap-2 transition-colors mb-8 disabled:opacity-60 disabled:cursor-not-allowed"
                  :disabled="adding"
                  @click="addToCart"
              >
                <img src="@/assets/icons/add_shopping_cart.svg" alt="add_cart">
                <span class="px-1">Купить</span>
              </button>
            </div>
            <!-- Информационные блоки -->
            <div class="space-y-1 p-3 mb-8 border-1  border-zinc-300 rounded-3xl">
              <!-- Гарантия -->
              <div class="flex items-center gap-3 px-4">
                <svg class="w-6 h-6 text-zinc-700 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                </svg>
                <span class="text-base text-zinc-700 font-medium">Гарантия</span>
              </div>

              <!-- Оплата -->
              <div class="flex items-center gap-3 px-4">
                <svg class="w-6 h-6 text-zinc-700 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/>
                </svg>
                <span class="text-base text-zinc-700 font-medium">Оплата</span>
              </div>
            </div>

            <!-- Доставка -->
            <div class="border border-zinc-300 rounded-3xl p-6">
              <div class="flex items-center gap-3 mb-4">
                <svg class="w-6 h-6 text-zinc-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"/>
                </svg>
                <h3 class="text-base text-zinc-950">Доставка</h3>
              </div>
              <div class="flex justify-between">
                <!-- Табы доставки -->
                <div
                    class="inline-flex rounded-3xl border-1 border-zinc-600/5 mb-4 transition-colors hover:bg-zinc-600/3">
                  <button
                      v-for="tab in deliveryTabs"
                      :key="tab"
                      class="px-4 py-2 text-base font-normal rounded-full transition-colors text-zinc-950"
                      :class="[
                    selectedDeliveryTab === tab
                      ? 'bg-zinc-600/5'
                      : ''
                  ]"
                      @click="selectedDeliveryTab = tab"
                  >
                    {{ tab }}
                  </button>
                </div>

                <!-- Город -->
                <div class="flex items-center justify-between mb-3 gap-4 text-base text-zinc-950 pr-2">
                  Ваш город:
                  <button
                      class="text-zinc-950/50 flex items-center gap-1 hover:text-orange-500"
                      @click="geoStore.openModal()"
                  >
                    {{ geoStore.geo.city }}
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/>
                    </svg>
                  </button>
                </div>
              </div>
              <!-- Варианты доставки -->
              <div class="flex gap-3">
                <div
                    v-for="option in deliveryOptions"
                    :key="option.name"
                    class="w-full flex flex-col items-center gap-3 p-3 rounded-lg border-1 border-zinc-600/15 transition-all text-left"
                    @click="selectedDelivery = option.name"

                >
                  <div class="flex items-center gap-2">
                    <img :src="`/icons/${option.icon}`" :alt="option.name" class="w-8 h-8 object-contain">
                    <div class=" text-zinc-950">{{ option.name }}</div>
                  </div>
                  <div class="flex gap-3">
                    <span class="text-sm text-zinc-600">{{ option.time }}</span>
                    /
                    <span class="font-bold text-zinc-950">{{ option.price }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- Связанные товары -->
        <ProductList
            v-if="!isLoading && relatedProducts.length > 0"
            title="С этим товаром покупают"
            :products="relatedProducts"
            :loading="isRelatedProductsLoading"
            class="mt-12"
        />
        <div class="grid grid-cols-2 gap-12 mt-12">
          <!-- Левая колонка: Описание и Характеристики -->
          <div>
            <!-- Описание товара -->
            <div v-if="product.variant?.description" class="prose max-w-none mb-12">
              <h2 class="text-2xl font-medium text-zinc-950 mb-4">Описание</h2>
              <div class="text-zinc-700 leading-relaxed whitespace-pre-line break-words">{{ product.variant?.description }}</div>
            </div>

            <!-- Характеристики товара -->
            <div v-if="attributes.length > 0">
              <h2 class="text-2xl font-medium text-zinc-950 mb-4">Характеристики</h2>
              <div v-for="group in attributes" :key="group.group_id" class="mb-6">
                <h3 v-if="group.group_name" class="text-lg font-medium text-zinc-800 mb-3">{{ group.group_name }}</h3>
                <table class="w-full">
                  <tbody>
                  <tr
                      v-for="attr in group.attributes?.slice(0, 5)"
                      :key="attr.id"
                      class="border-t border-b border-zinc-200"
                  >
                    <td class="p-4 border-r border-zinc-200 text-zinc-950 w-1/2">{{ attr.name }}</td>
                    <td class="p-4 text-zinc-950">
                    <span v-for="(value, idx) in attr.values" :key="value.id">
                      {{ value.value }}{{
                        attr.unit ? ` ${attr.unit}` : ''
                      }}{{ idx < (attr.values?.length || 0) - 1 ? ', ' : '' }}
                    </span>
                    </td>
                  </tr>
                  </tbody>
                </table>
              </div>
              <div class="flex justify-end mt-6">
                <button
                    class="px-6 py-2 border border-orange-500 text-orange-500 rounded-full hover:bg-orange-50 transition-colors"
                    @click="activeTab = 'specs'"
                >
                  Все характеристики
                </button>
              </div>
            </div>
            <div v-else-if="isAttributesLoading">
              <h2 class="text-2xl font-bold text-zinc-950 mb-6">Характеристики</h2>
              <p class="text-zinc-500">Загрузка характеристик...</p>
            </div>
          </div>

          <!-- Правая колонка: Отзывы -->
          <div>
            <h2 class="text-2xl font-medium text-zinc-950 mb-4">Отзывы</h2>

            <div v-if="reviews.length > 0" class="space-y-4">
              <div
                  v-for="review in reviews.slice(0, 3)"
                  :key="review.id"
                  class="border border-zinc-200 rounded-2xl p-4"
              >
                <div class="flex items-center gap-2 mb-2">
                  <div class="flex">
                    <svg
                        v-for="star in 5"
                        :key="star"
                        class="w-4 h-4"
                        :class="star <= (review.rating || 0) ? 'text-orange-500' : 'text-zinc-300'"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                    </svg>
                  </div>
                  <span v-if="review.created_at" class="text-sm text-zinc-500">
                    {{ new Date(review.created_at).toLocaleDateString('ru-RU') }}
                  </span>
                </div>
                <h3 v-if="review.title" class="font-medium text-zinc-950 mb-1">{{ review.title }}</h3>
                <p v-if="review.body" class="text-zinc-700 text-sm">{{ review.body }}</p>
              </div>
              <div v-if="reviews.length > 3" class="flex justify-end mt-4">
                <button
                    class="px-6 py-2 border border-orange-500 text-orange-500 rounded-full hover:bg-orange-50 transition-colors"
                    @click="activeTab = 'reviews'"
                >
                  Все отзывы ({{ reviews.length }})
                </button>
              </div>
            </div>
            <div v-else-if="isReviewsLoading">
              <p class="text-zinc-500">Загрузка отзывов...</p>
            </div>
            <div v-else>
              <p class="text-zinc-600">Отзывов пока нет</p>
            </div>
          </div>
        </div>

      </div>
    </Transition>
    <!-- Контент таба "Характеристики" -->
    <Transition name="fade" mode="out-in">
      <div v-if="activeTab === 'specs'" key="specs" class="py-8">
        <h2 class="text-2xl font-bold text-zinc-950 mb-6">Характеристики</h2>
        <div v-if="attributes.length > 0">
          <div v-for="group in attributes" :key="group.group_id" class="mb-8">
            <h3 v-if="group.group_name" class="text-lg font-medium text-zinc-800 mb-4">{{ group.group_name }}</h3>
            <table class="w-full">
              <tbody>
              <tr
                  v-for="attr in group.attributes"
                  :key="attr.id"
                  class="border-t border-zinc-200"
              >
                <td class="py-4 text-zinc-500 w-1/2">{{ attr.name }}</td>
                <td class="py-4 text-zinc-950">
                  <span v-for="(value, idx) in attr.values" :key="value.id">
                    {{ value.value }}{{
                      attr.unit ? ` ${attr.unit}` : ''
                    }}{{ idx < (attr.values?.length || 0) - 1 ? ', ' : '' }}
                  </span>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div v-else-if="isAttributesLoading">
          <p class="text-zinc-500">Загрузка характеристик...</p>
        </div>
        <div v-else>
          <p class="text-zinc-600">Характеристики отсутствуют</p>
        </div>
      </div>
    </Transition>

    <!-- Контент таба "Отзывы" -->
    <Transition name="fade" mode="out-in">
      <div v-if="activeTab === 'reviews'" key="reviews" class="py-8">
        <h2 class="text-2xl font-bold text-zinc-950 mb-6">Отзывы</h2>
        <div v-if="reviews.length > 0" class="space-y-4">
          <div
              v-for="review in reviews"
              :key="review.id"
              class="border border-zinc-200 rounded-2xl p-6"
          >
            <div class="flex items-center gap-2 mb-3">
              <div class="flex">
                <svg
                    v-for="star in 5"
                    :key="star"
                    class="w-5 h-5"
                    :class="star <= (review.rating || 0) ? 'text-orange-500' : 'text-zinc-300'"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
              </div>
              <span v-if="review.created_at" class="text-sm text-zinc-500">
                {{ new Date(review.created_at).toLocaleDateString('ru-RU') }}
              </span>
            </div>
            <h3 v-if="review.title" class="text-lg font-medium text-zinc-950 mb-2">{{ review.title }}</h3>
            <p v-if="review.body" class="text-zinc-700">{{ review.body }}</p>
          </div>
        </div>
        <div v-else-if="isReviewsLoading">
          <p class="text-zinc-500">Загрузка отзывов...</p>
        </div>
        <div v-else>
          <p class="text-zinc-600">Отзывов пока нет</p>
        </div>
      </div>
    </Transition>

    <div v-if="isLoading" class="flex items-center justify-center py-20">
      <p class="text-zinc-500">Загрузка...</p>
    </div>

    <!-- Галерея на весь экран -->
    <ImageGalleryModal
        :is-open="isGalleryOpen"
        :images="galleryImages"
        :initial-index="galleryInitialIndex"
        @close="closeGallery"
    />
  </div>


</template>

<script setup lang="ts">
import Breadcrumbs from '@/components/ui/Breadcrumbs.vue'
import ImageGalleryModal from '@/components/ui/ImageGalleryModal.vue'
import ProductPicture from '@/components/product/ProductPicture.vue'
import ProductList from '@/components/product/ProductList.vue'
import {useProductStore} from '@/stores/product/';
import {useCartStore} from '@/stores/cart';
import {useGeoStore} from '@/stores/geo';
import {formatPrice} from '@/utils/formatters/price';
import {getStockStatusLabel} from '~/utils/constants/stockStatus';
import {
  buildBreadcrumbJsonLd,
  buildProductJsonLd,
  seoAvailability,
  seoParsePrice,
  seoPlainText,
} from '~/utils/seo';
import { imageSrc } from '~/utils/media';

definePageMeta({
  layout: 'product',
})

const route = useRoute();
const productStore = useProductStore();
const cartStore = useCartStore();
const geoStore = useGeoStore();
const adding = ref(false);
const config = useRuntimeConfig();
const requestURL = useRequestURL();

const slug = computed(() => String(route.params.slug || ''));
const { $api } = useNuxtApp();

const { pending, data: productPageData } = await useAsyncData(
    () => `product-page-${slug.value}`,
    async () => {
      if (!slug.value) {
        throw createError({ statusCode: 404, message: 'Товар не найден', fatal: true });
      }

      const data = await $api.product.getBySlug(slug.value).catch(() => null);
      if (!data?.product) {
        throw createError({ statusCode: 404, message: 'Товар не найден', fatal: true });
      }

      const currentSlug = slug.value;
      productStore.products[currentSlug] = {
        data,
        timestamp: Date.now(),
      };
      productStore.updateAccessOrder(currentSlug);

      const [breadcrumbs, related, attributes, reviews] = await Promise.all([
        $api.product.getBreadcrumbsBySlug(currentSlug).catch(() => []),
        $api.product.getRelatedProductBySlug(currentSlug).catch(() => []),
        $api.product.getAttributesBySlug(currentSlug).catch(() => []),
        $api.product.getReviewsBySlug(currentSlug).catch(() => []),
      ]);

      productStore.breadcrumbs[currentSlug] = breadcrumbs || [];
      productStore.relatedProducts[currentSlug] = related || [];
      productStore.attributes[currentSlug] = attributes || [];
      productStore.reviews[currentSlug] = reviews || [];

      return {
        breadcrumbs: breadcrumbs || [],
      };
    },
    { watch: [slug] },
);

const productData = computed(() => productStore.getProductBySlug(slug.value));
const product = computed(() => productData.value?.product);
const galleryImages = computed(() => productData.value?.images || []);
const isLoading = computed(() => pending.value || productStore.isProductLoading(slug.value));

const relatedProducts = computed(() => productStore.getRelatedProducts(slug.value));
const isRelatedProductsLoading = computed(() => productStore.isRelatedProductsLoading(slug.value));

const attributes = computed(() => productStore.getAttributes(slug.value));
const isAttributesLoading = computed(() => productStore.isAttributesLoading(slug.value));

const reviews = computed(() => productStore.getReviews(slug.value));
const isReviewsLoading = computed(() => productStore.isReviewsLoading(slug.value));

const productTitle = computed(() =>
    product.value?.variant?.meta_title || product.value?.variant?.name || 'Товар',
);
const productHeading = computed(() =>
    product.value?.variant?.meta_h1 || product.value?.variant?.name || 'Товар',
);
const productDescription = computed(() =>
    seoPlainText(
        product.value?.variant?.meta_description || product.value?.variant?.description,
        160,
    ),
);

const averageRating = computed(() => {
  const rated = reviews.value.filter((item) => typeof item.rating === 'number' && item.rating > 0);
  if (!rated.length) return 0;
  return rated.reduce((sum, item) => sum + (item.rating || 0), 0) / rated.length;
});

const selectedIndex = ref(0);
const selectedImage = computed(() => galleryImages.value[selectedIndex.value] || galleryImages.value[0]);

watch(galleryImages, (images) => {
  if (selectedIndex.value >= images.length) selectedIndex.value = 0;
}, { immediate: true });

const pageUrl = computed(() => `${requestURL.origin}/product/${slug.value}`);
const imageUrls = computed(() =>
    galleryImages.value
        .map((image) => imageSrc(String(config.public.storageUrl), image, 'pdp', 'jpeg'))
        .filter(Boolean),
);

const breadcrumbItems = computed(() => {
  const crumbs = [...(productPageData.value?.breadcrumbs || [])];
  crumbs.sort((a, b) => (b.depth ?? 0) - (a.depth ?? 0));

  const items = crumbs.map((item) => ({
    id: item.id,
    title: item.name || item.slug || '',
    slug: item.slug,
    url: `/category/${item.slug}`,
  }));

  items.push({
    id: product.value?.id,
    title: product.value?.variant?.name || productHeading.value,
    slug: slug.value,
    url: `/product/${slug.value}`,
  });

  return items;
});

const jsonLd = computed(() => {
  const origin = requestURL.origin;
  const productSchema = buildProductJsonLd({
    name: productHeading.value,
    description: productDescription.value || undefined,
    url: pageUrl.value,
    images: imageUrls.value,
    sku: product.value?.sku,
    mpn: product.value?.mpn,
    ean: product.value?.ean,
    price: seoParsePrice(product.value?.price_retail),
    availability: seoAvailability(product.value?.stock_status),
    reviewCount: reviews.value.length,
    ratingValue: averageRating.value || undefined,
  });

  const breadcrumbSchema = buildBreadcrumbJsonLd(origin, [
    { title: 'Главная', url: '/' },
    { title: 'Каталог', url: '/category' },
    ...breadcrumbItems.value.map((item) => ({ title: item.title, url: item.url })),
  ]);

  return [productSchema, breadcrumbSchema];
});

useSeoMeta({
  title: () => productTitle.value,
  description: () => productDescription.value || undefined,
  ogTitle: () => productTitle.value,
  ogDescription: () => productDescription.value || undefined,
  ogType: 'website',
  ogUrl: () => pageUrl.value,
  ogImage: () => imageUrls.value[0],
  ogLocale: 'ru_RU',
  twitterCard: 'summary_large_image',
  twitterTitle: () => productTitle.value,
  twitterDescription: () => productDescription.value || undefined,
  twitterImage: () => imageUrls.value[0],
  robots: () => product.value?.is_enable === false ? 'noindex, nofollow' : 'index, follow',
});

useHead(() => ({
  title: productTitle.value,
  link: [
    { rel: 'canonical', href: pageUrl.value },
  ],
  script: jsonLd.value.map((schema) => ({
    type: 'application/ld+json',
    innerHTML: JSON.stringify(schema),
  })),
}));

const isGalleryOpen = ref(false);
const galleryInitialIndex = ref(0);

function openGallery(index: number) {
  galleryInitialIndex.value = index >= 0 ? index : 0;
  isGalleryOpen.value = true;
}

function closeGallery() {
  isGalleryOpen.value = false;
}

const activeTab = ref<'about' | 'specs' | 'reviews'>('about');

const deliveryTabs = ['До ПВЗ', 'Курьером'];
const selectedDeliveryTab = ref('До ПВЗ');
const selectedDelivery = ref('СДЭК');

const deliveryOptions = computed(() => {
  return [
    {
      name: 'СДЭК',
      time: '7 дней',
      price: '500 RUB',
      icon: 'cdek.svg'
    },
    {
      name: 'Почта России',
      time: '12 дней',
      price: '270 RUB',
      icon: 'pochta.svg'
    },
    {
      name: 'Яндекс Доставка',
      time: '5 дней',
      price: '300 RUB',
      icon: 'yandex.svg'
    }
  ];
});

async function addToCart() {
  const current = product.value;
  const variantId = current?.variant?.id;
  if (adding.value || !current?.id || !variantId) return;

  adding.value = true;
  try {
    await cartStore.addItem({
      product_id: current.id,
      variant_id: variantId,
      quantity: current.minimum && current.minimum > 0 ? current.minimum : 1,
    });
  } finally {
    adding.value = false;
  }
}
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.fade-enter-to,
.fade-leave-from {
  opacity: 1;
  transform: translateY(0);
}
</style>
