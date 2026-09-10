<template>
  <div class="lg:hidden">
    <div
        v-if="expanded"
        class="fixed inset-0 z-40 bg-black/20"
        @click="expanded = false"
    />
    <div
        class="fixed inset-x-0 bottom-0 z-50 rounded-t-[28px] shadow-[0_-8px_30px_rgba(0,0,0,0.08)]"
        :class="panelClass"
    >
      <button
          type="button"
          class="flex w-full flex-col items-center pt-3 pb-2"
          :aria-expanded="expanded"
          aria-label="Детали заказа"
          @click="expanded = !expanded"
      >
        <span class="h-1 w-10 rounded-full bg-zinc-300"/>
      </button>

      <div v-if="!expanded" class="flex items-center gap-3 px-4 pb-4">
        <div class="min-w-0 flex-1">
          <p class="text-[13px] leading-4 text-zinc-600">К оплате</p>
          <p class="truncate text-[20px] font-bold leading-7 text-zinc-950">
            {{ formatMoney(total) }}
          </p>
        </div>
        <slot name="collapsed-action"/>
      </div>

      <div v-else class="max-h-[70vh] overflow-y-auto pb-6">
        <slot/>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { formatOrderMoney } from '~/utils/order';

defineProps<{
  total: number;
  panelClass?: string;
}>();

const expanded = defineModel<boolean>('expanded', { default: false });

function formatMoney(price?: number) {
  return formatOrderMoney(price);
}
</script>
