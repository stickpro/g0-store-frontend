<script setup lang="ts">
import ProductPicture from '~/components/product/ProductPicture.vue';
import SearchFilters from '~/components/search/SearchFilters.vue';
import IconXmark from '~/components/icons/IconXmark.vue';
import { useDebounce } from '@vueuse/core';
import { CURRENCY_CODE } from '~/utils/constants/currency';
import { STOCK_STATUS } from '~/utils/constants/stockStatus';
import { imageHasMedia } from '~/utils/media';
import { parseVariantPrice } from '~/utils/mappers/shortProduct';
import { stockStatusParam } from '~/utils/searchFilters';
import type { VariantCardResponse } from '~/repository/types/api/generatedApiGo';

const props = defineProps<{
  open: boolean;
  query: string;
}>();

const emit = defineEmits<{
  close: [];
}>();

const { $api } = useNuxtApp();
const items = ref<VariantCardResponse[]>([]);
const total = ref(0);
const loading = ref(false);
const error = ref('');
const categorySlugs = ref<string[]>([]);
const hideOutOfStock = ref(false);
const inStore = ref(false);

const debouncedQuery = useDebounce(computed(() => props.query.trim()), 300);
const stockStatus = computed(() => stockStatusParam(hideOutOfStock.value, inStore.value));
const categoryParam = computed(() => categorySlugs.value.join(',') || undefined);

function formatPrice(price?: number) {
  if (price == null || !Number.isFinite(price)) return `0 ${CURRENCY_CODE}`;
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' ' + CURRENCY_CODE;
}

function stockLabel(status?: string) {
  if (status === STOCK_STATUS.IN_STOCK) return 'В наличии в магазине';
  if (status === STOCK_STATUS.PRE_ORDER) return 'Под заказ';
  if (status === STOCK_STATUS.OUT_OF_STOCK) return 'Нет в наличии';
  return '';
}

async function loadResults(q: string) {
  if (!props.open || q.length < 2) {
    items.value = [];
    total.value = 0;
    error.value = '';
    return;
  }

  loading.value = true;
  error.value = '';

  try {
    const result = await $api.search.search({
      q,
      page: 1,
      page_size: 12,
      category: categoryParam.value,
      stock_status: stockStatus.value,
    });
    items.value = result.items || [];
    total.value = result.pagination?.total ?? items.value.length;
  } catch {
    error.value = 'Не удалось выполнить поиск';
    items.value = [];
    total.value = 0;
  } finally {
    loading.value = false;
  }
}

watch(
    [() => props.open, debouncedQuery, categorySlugs, hideOutOfStock, inStore],
    ([isOpen, q]) => {
      if (!isOpen) return;
      loadResults(q);
    },
    { immediate: true, deep: true },
);

function close() {
  emit('close');
}

function onResultClick() {
  close();
}

onMounted(() => {
  if (!import.meta.client) return;
  window.addEventListener('keydown', onEscape);
});

onUnmounted(() => {
  if (!import.meta.client) return;
  window.removeEventListener('keydown', onEscape);
});

function onEscape(event: KeyboardEvent) {
  if (event.key === 'Escape' && props.open) close();
}
</script>

<template>
  <Transition name="fade">
    <div v-if="open" class="absolute top-full left-0 right-0 z-40">
      <div
          class="fixed inset-0 top-20 bg-white/80 backdrop-blur-[4px]"
          @click="close"
      />

      <div class="relative z-10 mx-auto flex max-h-[calc(100vh-7rem)] max-w-[1552px] flex-col overflow-hidden rounded-3xl border border-zinc-200 bg-white">
        <div class="flex shrink-0 items-center justify-between border-b border-zinc-600/15 px-6 py-4">
          <h2 class="text-[22px] leading-9 text-zinc-950">Результаты поиска</h2>
          <button type="button" class="p-1" aria-label="Закрыть поиск" @click="close">
            <IconXmark />
          </button>
        </div>

        <div class="flex min-h-0 flex-1">
          <aside class="hidden w-76 shrink-0 overflow-y-auto border-r border-zinc-600/15 md:block">
            <SearchFilters
                v-model:category-slugs="categorySlugs"
                v-model:hide-out-of-stock="hideOutOfStock"
                v-model:in-store="inStore"
            />
          </aside>

          <div class="min-w-0 flex-1 overflow-y-auto px-6 py-4">
            <p class="mb-4 text-[15px] leading-6 text-zinc-950/70">
              <template v-if="query.trim().length < 2">Введите минимум 2 символа</template>
              <template v-else-if="loading">Ищем товары…</template>
              <template v-else-if="error">{{ error }}</template>
              <template v-else>Найдено {{ total }} товаров</template>
            </p>

            <div
                v-if="!loading && !error && items.length === 0 && query.trim().length >= 2"
                class="flex flex-col items-center justify-center rounded-xl bg-orange-50 py-10"
            >
              <span class="font-medium text-orange-500">Товары не найдены</span>
            </div>

            <div v-else-if="items.length" class="grid grid-cols-1 lg:grid-cols-2">
              <NuxtLink
                  v-for="(item, index) in items"
                  :key="item.id || item.slug"
                  :to="`/product/${item.slug}`"
                  class="flex items-start gap-4 border-b border-dashed border-zinc-600/15 py-4 hover:bg-zinc-600/5"
                  :class="index % 2 === 1 ? 'lg:border-l lg:pl-8' : 'lg:pr-8'"
                  @click="onResultClick"
              >
                <ProductPicture
                    v-if="imageHasMedia(item.image, 'thumb')"
                    :image="item.image"
                    preset="thumb"
                    :alt="item.name"
                    class="h-16 w-16 flex-shrink-0 object-contain"
                />
                <div v-else class="h-16 w-16 flex-shrink-0 rounded bg-zinc-100" />

                <div class="flex min-w-0 flex-1 flex-col gap-1">
                  <span class="text-sm leading-snug text-zinc-800">{{ item.name }}</span>
                  <span
                      v-if="stockLabel(item.stock_status)"
                      class="flex items-center gap-1 text-[13px] leading-4"
                      :class="item.stock_status === STOCK_STATUS.OUT_OF_STOCK ? 'text-zinc-500' : 'text-green-600'"
                  >
                    <span v-if="item.stock_status !== STOCK_STATUS.OUT_OF_STOCK" aria-hidden="true">✓</span>
                    {{ stockLabel(item.stock_status) }}
                  </span>
                  <span class="mt-1 font-semibold text-zinc-950">
                    {{ formatPrice(parseVariantPrice(item.price_retail)) }}
                  </span>
                </div>
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
