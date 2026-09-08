<template>
  <NuxtLink
    :to="`/product/${product.slug}`"
    class="product-card flex flex-col border-r border-dashed border-zinc-600/15 bg-white p-4 hover:shadow-md transition-shadow cursor-pointer lg:p-6"
  >
    <!-- Product Image -->
    <div class="relative mb-3 flex h-[148px] max-h-[148px] min-h-0 w-full shrink-0 items-center justify-center overflow-hidden bg-white lg:mb-4 lg:h-[190px] lg:max-h-[190px]">
      <ProductPicture
        v-if="hasCardImage"
        :image="product.image"
        preset="card"
        :alt="product.name"
        class="h-[148px] w-auto max-h-[148px] max-w-full object-contain lg:h-[190px] lg:max-h-[190px]"
      />
      <div v-else class="w-full h-full flex items-center justify-center text-gray-300">
        <svg class="w-20 h-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
    </div>

    <!-- Product Info -->
    <div class="flex flex-col flex-1">
      <!-- Product Name -->
      <h3 class="mb-3 line-clamp-2 text-sm font-normal text-zinc-950 lg:mb-4 lg:text-base">
        {{ product.name }}
      </h3>

      <!-- Price and Cart Button -->
      <div class="flex items-center justify-between mt-auto">
        <span class="text-sm font-bold text-zinc-950">{{ formatPrice(product.price_retail) }} {{ CURRENCY_CODE }}</span>

        <!-- Add to Cart Button -->
        <button
          class="flex size-10 shrink-0 items-center justify-center rounded-full text-white transition-colors disabled:cursor-not-allowed"
          :class="added ? 'bg-green-600' : 'bg-orange-500 hover:bg-orange-600 disabled:opacity-60'"
          :disabled="adding"
          :aria-label="added ? 'Товар в корзине' : 'В корзину'"
          @click.prevent="addToCart"
        >
          <svg v-if="adding" class="size-6 animate-spin" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <circle cx="10" cy="10" r="7" stroke="currentColor" stroke-opacity="0.3" stroke-width="2"/>
            <path d="M10 3a7 7 0 0 1 7 7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
          <svg v-else-if="added" class="size-6" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path d="M4.5 10.5 8 14l7.5-8" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <svg v-else class="size-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M13.1727 9.5C13.7227 9.5 14.1727 9.05 14.1727 8.5V6.5H16.1727C16.7227 6.5 17.1727 6.05 17.1727 5.5C17.1727 4.95 16.7227 4.5 16.1727 4.5H14.1727V2.5C14.1727 1.95 13.7227 1.5 13.1727 1.5C12.6227 1.5 12.1727 1.95 12.1727 2.5V4.5H10.1727C9.62267 4.5 9.17267 4.95 9.17267 5.5C9.17267 6.05 9.62267 6.5 10.1727 6.5H12.1727V8.5C12.1727 9.05 12.6227 9.5 13.1727 9.5ZM8.17267 18.5C7.07267 18.5 6.18267 19.4 6.18267 20.5C6.18267 21.6 7.07267 22.5 8.17267 22.5C9.27267 22.5 10.1727 21.6 10.1727 20.5C10.1727 19.4 9.27267 18.5 8.17267 18.5ZM18.1727 18.5C17.0727 18.5 16.1827 19.4 16.1827 20.5C16.1827 21.6 17.0727 22.5 18.1727 22.5C19.2727 22.5 20.1727 21.6 20.1727 20.5C20.1727 19.4 19.2727 18.5 18.1727 18.5ZM9.27267 13.5H16.7227C17.4727 13.5 18.1327 13.09 18.4727 12.47L21.7127 6.33C21.9627 5.85 21.7927 5.25 21.3127 4.99C20.8227 4.72 20.2127 4.91 19.9527 5.4L16.7227 11.5H9.70267L5.44267 2.5H3.17267C2.62267 2.5 2.17267 2.95 2.17267 3.5C2.17267 4.05 2.62267 4.5 3.17267 4.5H4.17267L7.77267 12.09L6.42267 14.53C5.69267 15.87 6.65267 17.5 8.1727 17.5H19.1727C19.7227 17.5 20.1727 17.05 20.1727 16.5C20.1727 15.95 19.7227 15.5 19.1727 15.5H8.17267L9.27267 13.5Z" fill="#FAFAFA"/>
          </svg>
        </button>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import type { VariantCardResponse } from '~/repository/types/api/generatedApiGo';
import ProductPicture from '~/components/product/ProductPicture.vue';
import { CURRENCY_CODE } from '~/utils/constants/currency';
import { useCartStore } from '~/stores/cart';
import { imageHasMedia } from '~/utils/media';

interface Props {
  product: VariantCardResponse;
  showStock?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  showStock: false
});

const cartStore = useCartStore();
const cartToast = useCartToast();
const adding = ref(false);
const added = ref(false);
let addedTimer: ReturnType<typeof setTimeout> | undefined;
const hasCardImage = computed(() => imageHasMedia(props.product.image, 'card'));


function formatPrice(price?: number | string): string {
  const n = typeof price === 'string' ? Number(price.replace(',', '.')) : price;
  if (n == null || !Number.isFinite(n)) return '0';

  const [integer, fraction] = n.toString().split('.');
  const grouped = integer.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  return fraction ? `${grouped}.${fraction}` : grouped;
}

async function addToCart() {
  if (adding.value || !props.product.product_id || !props.product.id) return;
  adding.value = true;
  try {
    await cartStore.addItem({
      product_id: props.product.product_id,
      variant_id: props.product.id,
      quantity: 1,
    });
    added.value = true;
    cartToast.added();
    if (addedTimer) clearTimeout(addedTimer);
    addedTimer = setTimeout(() => {
      added.value = false;
    }, 1800);
  } catch {
    cartToast.failed();
  } finally {
    adding.value = false;
  }
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
