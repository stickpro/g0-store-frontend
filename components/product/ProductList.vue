<template>
  <section class="product-list py-6 lg:py-8">
    <div class="mb-4 flex items-center justify-between lg:mb-6">
      <h2 class="text-[22px] font-normal text-zinc-950">{{ title }}</h2>
    </div>

    <div v-if="loading" class="py-12 text-center">
      <p class="text-zinc-500">Загрузка...</p>
    </div>

    <div v-else-if="products.length === 0" class="py-12 text-center">
      <p class="text-zinc-500">Товары не найдены</p>
    </div>

    <div
      v-else
      class="-mx-4 overflow-x-auto border-b border-dashed border-zinc-600/15 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:mx-0"
    >
      <div class="flex min-w-max px-4 lg:px-0">
        <ProductCard
          v-for="product in displayedProducts"
          :key="product.id"
          :product="product"
          :show-stock="showStock"
          class="w-[200px] shrink-0 lg:w-[280px]"
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
import type { VariantCardResponse } from '~/repository/types/api/generatedApiGo';
import ProductCard from '~/components/product/ProductCard.vue';

interface Props {
  title: string;
  products?: VariantCardResponse[];
  loading?: boolean;
  showLoadMore?: boolean;
  showStock?: boolean;
  limit?: number;
}

const props = withDefaults(defineProps<Props>(), {
  products: () => [],
  loading: false,
  showLoadMore: false,
  showStock: false,
  limit: 0
});

const emit = defineEmits<{
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
