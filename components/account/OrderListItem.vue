<template>
  <NuxtLink
      :to="orderDetailPath(order)"
      class="block rounded-3xl border border-dashed border-zinc-600/15 px-6 py-5 transition-colors hover:bg-zinc-600/5"
  >
    <div class="flex flex-wrap items-start justify-between gap-3">
      <div>
        <p class="text-[17px] leading-6 text-zinc-950">
          Заказ №{{ orderNumber(order) }}
        </p>
        <p v-if="formatOrderDate(order.created_at)" class="mt-1 text-[13px] leading-4 text-zinc-500">
          {{ formatOrderDate(order.created_at) }}
        </p>
      </div>
      <div class="text-right">
        <p class="text-[17px] font-medium leading-6 text-zinc-950">
          {{ formatOrderMoney(order.grand_total) }}
        </p>
        <p
            class="mt-1 text-[13px] leading-4"
            :class="isCancelledOrder(order.status) ? 'text-zinc-500' : 'text-orange-600'"
        >
          {{ orderStatusLabel(order.status) }}
        </p>
      </div>
    </div>

    <div v-if="order.items?.length" class="mt-4 flex items-center gap-2">
      <div
          v-for="item in previewItems"
          :key="item.variant_id || item.product_id || item.name"
          class="size-12 overflow-hidden rounded-xl bg-zinc-100"
      >
        <img
            v-if="imageUrl(item.image_path)"
            :src="imageUrl(item.image_path)"
            :alt="item.name"
            class="size-12 object-contain"
        >
      </div>
      <p v-if="extraCount > 0" class="pl-1 text-[13px] leading-4 text-zinc-500">
        +{{ extraCount }}
      </p>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import type { OrderResponse } from '~/repository/types/api/generatedApiGo';
import { seoAbsoluteUrl } from '~/utils/seo';
import {
  formatOrderDate,
  formatOrderMoney,
  isCancelledOrder,
  orderNumber,
  orderStatusLabel,
  orderDetailPath,
} from '~/utils/order';

const props = defineProps<{
  order: OrderResponse;
}>();

const config = useRuntimeConfig();

const previewItems = computed(() => (props.order.items || []).slice(0, 4));
const extraCount = computed(() => Math.max(0, (props.order.items?.length || 0) - previewItems.value.length));

function imageUrl(path?: string) {
  return seoAbsoluteUrl(String(config.public.storageUrl), path);
}
</script>
