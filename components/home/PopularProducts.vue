<template>
  <section class="popular-products py-8">
    <!-- Section Title -->
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-[22px] font-normal text-zinc-950">{{ title }}</h2>
      <nuxt-link
        v-if="showViewAll"
        to="/products"
        class="text-orange-500 hover:text-orange-600 font-medium flex items-center gap-2 transition-colors"
      >
        Смотреть все
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </nuxt-link>
    </div>

    <!-- Products Grid -->
    <div v-if="loading" class="text-center py-12">
      <p class="text-zinc-500">Загрузка...</p>
    </div>

    <div v-else-if="products.length === 0" class="text-center py-12">
      <p class="text-zinc-500">Товары не найдены</p>
    </div>

    <div
      v-else
      class="overflow-x-auto scrollbar-hide border-b-1 border-dashed border-zinc-600/15"
    >
      <div class="flex">
        <ProductCard
          v-for="product in displayedProducts"
          :key="product.id"
          :product="product"
          :show-stock="showStock"
          class="flex-shrink-0 w-[280px]"
          @add-to-cart="handleAddToCart"
        />
      </div>
    </div>

    <!-- Load More Button (optional) -->
    <div v-if="showLoadMore && hasMore" class="text-center mt-8">
      <button
        class="px-8 py-3 bg-white border-2 border-orange-500 text-orange-500 rounded-full font-medium hover:bg-orange-50 transition-colors"
        @click="loadMore"
      >
        Загрузить ещё
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
import ProductCard from '~/components/product/ProductCard.vue';

interface Product {
  id?: string;
  name?: string;
  article?: string;
  price?: number;
  old_price?: number;
  image?: string;
  stock_status?: 'in_stock' | 'out_of_stock' | 'on_order';
}

interface Props {
  title?: string;
  products?: Product[];
  loading?: boolean;
  showViewAll?: boolean;
  showLoadMore?: boolean;
  showStock?: boolean;
  limit?: number;
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Популярные',
  products: () => [],
  loading: false,
  showViewAll: true,
  showLoadMore: false,
  showStock: false,
  limit: 0
});

const emit = defineEmits<{
  addToCart: [product: Product];
  loadMore: [];
}>();

const displayedProducts = computed(() => {
  if (props.limit && props.limit > 0) {
    return props.products.slice(0, props.limit);
  }
  return props.products;
});

const hasMore = computed(() => {
  if (!props.limit) return false;
  return props.products.length > props.limit;
});

function handleAddToCart(product: Product) {
  emit('addToCart', product);
}

function loadMore() {
  emit('loadMore');
}
</script>

<style scoped>
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
</style>
