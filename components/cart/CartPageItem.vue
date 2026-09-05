<template>
  <article class="flex flex-col gap-3 border-b border-r border-dashed border-zinc-600/15 p-3">
    <div class="flex items-start gap-3">
      <NuxtLink
          v-if="item.slug"
          :to="`/product/${item.slug}`"
          class="flex size-20 shrink-0 items-center justify-center"
      >
        <ProductPicture
            v-if="hasImage"
            :image="item.image"
            preset="thumb"
            :alt="item.name"
            class="size-20 object-contain"
        />
        <div v-else class="size-20 bg-zinc-100"/>
      </NuxtLink>
      <div v-else class="flex size-20 shrink-0 items-center justify-center">
        <ProductPicture
            v-if="hasImage"
            :image="item.image"
            preset="thumb"
            :alt="item.name"
            class="size-20 object-contain"
        />
        <div v-else class="size-20 bg-zinc-100"/>
      </div>

      <div class="min-w-0 flex-1">
        <div class="flex items-start justify-between gap-2">
          <NuxtLink
              v-if="item.slug"
              :to="`/product/${item.slug}`"
              class="text-[15px] leading-6 text-zinc-950 hover:text-zinc-600"
          >
            {{ item.name }}
          </NuxtLink>
          <p v-else class="text-[15px] leading-6 text-zinc-950">{{ item.name }}</p>

          <button
              type="button"
              class="flex size-10 shrink-0 items-center justify-center text-zinc-950 hover:text-zinc-600"
              aria-label="Удалить товар"
              @click="emit('remove')"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M3 6H21M8 6V4C8 3.45 8.45 3 9 3H15C15.55 3 16 3.45 16 4V6M19 6L18.2 19.2C18.09 20.22 17.24 21 16.21 21H7.79C6.76 21 5.91 20.22 5.8 19.2L5 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>

        <p class="mt-2 text-[15px] font-bold leading-4 text-zinc-950">
          {{ formatPrice(item.price) }}
        </p>
      </div>
    </div>

    <div class="flex h-10 items-center justify-between rounded-full bg-zinc-600/5">
      <span class="pl-4 text-[15px] leading-6 text-zinc-950">Кол-во: {{ item.quantity || 1 }}</span>
      <div class="flex items-center">
        <button
            type="button"
            class="flex size-10 items-center justify-center text-zinc-950 hover:opacity-70"
            aria-label="Удалить"
            @click="emit('remove')"
        >
          <IconXmark class="size-5"/>
        </button>
        <button
            type="button"
            class="flex size-10 items-center justify-center text-zinc-950 hover:opacity-70"
            aria-label="Уменьшить количество"
            @click="emit('decrease')"
        >
          <svg width="14" height="2" viewBox="0 0 12 2" fill="none">
            <path d="M1 1H11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
        </button>
        <button
            type="button"
            class="flex size-10 items-center justify-center text-zinc-950 hover:opacity-70 disabled:opacity-40"
            aria-label="Увеличить количество"
            :disabled="atMax"
            @click="emit('increase')"
        >
          <svg width="14" height="14" viewBox="0 0 12 12" fill="none">
            <path d="M6 1V11M1 6H11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
        </button>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import IconXmark from '~/components/icons/IconXmark.vue';
import ProductPicture from '~/components/product/ProductPicture.vue';
import type { CartItemResponse } from '~/repository/types/api/generatedApiGo';
import { CURRENCY_CODE } from '~/utils/constants/currency';
import { imageHasMedia } from '~/utils/media';

const props = defineProps<{
  item: CartItemResponse;
}>();

const emit = defineEmits<{
  remove: [];
  increase: [];
  decrease: [];
}>();

const hasImage = computed(() => imageHasMedia(props.item.image, 'thumb'));
const atMax = computed(() =>
    Boolean(props.item.max_quantity && (props.item.quantity || 0) >= props.item.max_quantity),
);

function formatPrice(price?: number | string) {
  const n = typeof price === 'string' ? Number(price.replace(',', '.')) : price;
  if (n == null || !Number.isFinite(n)) return `0 ${CURRENCY_CODE}`;
  return `${n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} ${CURRENCY_CODE}`;
}
</script>
