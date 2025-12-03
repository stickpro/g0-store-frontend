<template>
  <NuxtLink
    :to="`/product/${product.slug}`"
    class="product-card bg-white border-r-1 border-dashed border-zinc-600/15 p-6 flex flex-col hover:shadow-md transition-shadow cursor-pointer"
  >
    <!-- Product Image -->
    <div class="relative w-full h-[190px] bg-white flex items-center justify-center mb-4">
      <img
        v-if="productImage"
        :src="config.public.storageUrl + productImage"
        :alt="product.name"
        class="w-full h-full object-contain"
      >
      <div v-else class="w-full h-full flex items-center justify-center text-gray-300">
        <svg class="w-20 h-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
    </div>

    <!-- Product Info -->
    <div class="flex flex-col flex-1">
      <!-- Product Name -->
      <h3 class="text-base font-normal text-zinc-950 mb-4 line-clamp-2">
        {{ product.name }}
      </h3>

      <!-- Price and Cart Button -->
      <div class="flex items-center justify-between mt-auto">
        <span class="text-sm font-bold text-zinc-950">{{ formatPrice(product.price) }} {{ CURRENCY_CODE }}</span>

        <!-- Add to Cart Button -->
        <button
          class="w-10 h-10 rounded-full bg-orange-500 hover:bg-orange-600 flex items-center justify-center text-white transition-colors flex-shrink-0"
          @click.prevent="addToCart"
        >
          <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M13.1727 9.5C13.7227 9.5 14.1727 9.05 14.1727 8.5V6.5H16.1727C16.7227 6.5 17.1727 6.05 17.1727 5.5C17.1727 4.95 16.7227 4.5 16.1727 4.5H14.1727V2.5C14.1727 1.95 13.7227 1.5 13.1727 1.5C12.6227 1.5 12.1727 1.95 12.1727 2.5V4.5H10.1727C9.62267 4.5 9.17267 4.95 9.17267 5.5C9.17267 6.05 9.62267 6.5 10.1727 6.5H12.1727V8.5C12.1727 9.05 12.6227 9.5 13.1727 9.5ZM8.17267 18.5C7.07267 18.5 6.18267 19.4 6.18267 20.5C6.18267 21.6 7.07267 22.5 8.17267 22.5C9.27267 22.5 10.1727 21.6 10.1727 20.5C10.1727 19.4 9.27267 18.5 8.17267 18.5ZM18.1727 18.5C17.0727 18.5 16.1827 19.4 16.1827 20.5C16.1827 21.6 17.0727 22.5 18.1727 22.5C19.2727 22.5 20.1727 21.6 20.1727 20.5C20.1727 19.4 19.2727 18.5 18.1727 18.5ZM9.27267 13.5H16.7227C17.4727 13.5 18.1327 13.09 18.4727 12.47L21.7127 6.33C21.9627 5.85 21.7927 5.25 21.3127 4.99C20.8227 4.72 20.2127 4.91 19.9527 5.4L16.7227 11.5H9.70267L5.44267 2.5H3.17267C2.62267 2.5 2.17267 2.95 2.17267 3.5C2.17267 4.05 2.62267 4.5 3.17267 4.5H4.17267L7.77267 12.09L6.42267 14.53C5.69267 15.87 6.65267 17.5 8.17267 17.5H19.1727C19.7227 17.5 20.1727 17.05 20.1727 16.5C20.1727 15.95 19.7227 15.5 19.1727 15.5H8.17267L9.27267 13.5Z" fill="#FAFAFA"/>
          </svg>
        </button>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import type { ShortProduct } from '@repository/types/api/generatedApiGo';
import { CURRENCY_CODE } from '~/utils/constants/currency';

interface Props {
  product: ShortProduct;
  showStock?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  showStock: false
});

const emit = defineEmits<{
  addToCart: [product: ShortProduct]
}>();

const productImage = computed(() => {
  if (typeof props.product.image === 'string') {
    return props.product.image;
  }
  return props.product.image?.string || '';
});

const config = useRuntimeConfig();


function formatPrice(price?: number): string {
  if (!price) return '0';
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

function addToCart() {
  emit('addToCart', props.product);
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
