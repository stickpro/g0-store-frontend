<template>
  <div class="flex flex-col">
    <template v-if="layout === 'desktop'">
      <h3 class="px-6 pt-8 pb-4 text-[22px] font-normal leading-9 text-zinc-950">Итого</h3>
      <dl class="border-y border-dashed border-zinc-600/15 px-6 py-5 text-[15px] leading-6 text-zinc-950">
        <div class="flex items-center justify-between gap-4 py-1.5">
          <dt class="text-zinc-600">Кол-во товара</dt>
          <dd class="font-medium">{{ itemCount }}</dd>
        </div>
        <div v-if="deliveryLabel" class="flex items-center justify-between gap-4 py-1.5">
          <dt class="text-zinc-600">Доставка</dt>
          <dd class="font-medium">{{ deliveryLabel }}</dd>
        </div>
        <div class="flex items-center justify-between gap-4 py-1.5">
          <dt class="text-zinc-600">Всего</dt>
          <dd class="font-medium">{{ formatMoney(total) }}</dd>
        </div>
      </dl>
      <div class="border-b border-dashed border-zinc-600/15 px-6 py-6">
        <p class="text-[15px] leading-5 text-zinc-600">К оплате</p>
        <p class="mt-2 text-[28px] font-bold leading-9 text-zinc-950">
          {{ formatMoney(total) }}
        </p>
      </div>
      <div class="flex flex-col gap-3 px-6 pt-6">
        <slot name="actions"/>
        <slot name="legal"/>
      </div>
    </template>

    <template v-else>
      <div class="flex flex-col gap-3 px-4 pb-2">
        <slot name="actions"/>
        <slot name="legal"/>
      </div>
      <div class="border-t border-dashed border-zinc-600/15 px-4 py-5">
        <p class="text-[15px] leading-5 text-zinc-600">К оплате</p>
        <p class="mt-2 text-[28px] font-bold leading-9 text-zinc-950">
          {{ formatMoney(total) }}
        </p>
      </div>
      <div class="border-t border-dashed border-zinc-600/15 px-4 py-5">
        <p class="text-[22px] leading-9 text-zinc-950">Итого</p>
        <dl class="mt-3 space-y-2 text-[15px] leading-6 text-zinc-950">
          <div class="flex items-center justify-between gap-4">
            <dt class="text-zinc-600">Кол-во товара</dt>
            <dd>{{ itemCount }}</dd>
          </div>
          <div v-if="deliveryLabel" class="flex items-center justify-between gap-4">
            <dt class="text-zinc-600">Доставка</dt>
            <dd>{{ deliveryLabel }}</dd>
          </div>
          <div class="flex items-center justify-between gap-4">
            <dt class="text-zinc-600">Всего</dt>
            <dd>{{ formatMoney(total) }}</dd>
          </div>
        </dl>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { formatOrderMoney } from '~/utils/order';

defineProps<{
  itemCount: number;
  total: number;
  deliveryLabel?: string;
  layout: 'desktop' | 'sheet';
}>();

function formatMoney(price?: number) {
  return formatOrderMoney(price);
}
</script>
