<template>
  <div class="flex w-full min-h-[calc(100vh-5rem)]">
    <div class="min-w-0 flex-1 pt-6 pb-24">
      <h1 class="text-[28px] font-normal leading-[45px] text-zinc-950">Оформление заказа</h1>
      <h2 class="mt-3 text-[22px] font-normal leading-9 text-zinc-950">Корзина</h2>

      <div v-if="pending && cartStore.isEmpty" class="mt-6 text-[15px] text-zinc-500">
        Загрузка корзины...
      </div>

      <div v-else-if="cartStore.isEmpty" class="mt-6 rounded-3xl bg-orange-50 px-6 py-16 text-center text-orange-500">
        Корзина пуста
      </div>

      <div v-else class="mt-6 grid grid-cols-1 border-l border-dashed border-zinc-600/15 sm:grid-cols-2">
        <CartPageItem
            v-for="item in cartStore.items"
            :key="item.variant_id"
            :item="item"
            @remove="cartStore.removeItem(item.variant_id!)"
            @increase="increase(item.variant_id!)"
            @decrease="decrease(item.variant_id!)"
        />
      </div>
    </div>

    <aside class="flex w-[304px] shrink-0 flex-col border-l border-dashed border-zinc-600/15 bg-[#FFF3E9] min-h-[calc(100vh-5rem)]">
      <h3 class="px-6 pt-8 pb-4 text-[22px] font-normal leading-9 text-zinc-950">Итого</h3>

      <dl class="border-y border-dashed border-zinc-600/15 px-6 py-5 text-[15px] leading-6 text-zinc-950">
        <div class="flex items-center justify-between gap-4 py-1.5">
          <dt class="text-zinc-600">Кол-во товара</dt>
          <dd class="font-medium">{{ cartStore.itemCount }}</dd>
        </div>
        <div class="flex items-center justify-between gap-4 py-1.5">
          <dt class="text-zinc-600">Всего</dt>
          <dd class="font-medium">{{ formatMoney(cartStore.totalPrice) }}</dd>
        </div>
      </dl>

      <div class="border-b border-dashed border-zinc-600/15 px-6 py-6">
        <p class="text-[15px] leading-5 text-zinc-600">К оплате</p>
        <p class="mt-2 text-[28px] font-bold leading-9 text-zinc-950">
          {{ formatMoney(cartStore.totalPrice) }}
        </p>
      </div>

      <div class="flex flex-col gap-3 px-6 pt-6">
        <NuxtLink
            to="/checkout"
            class="flex h-12 w-full items-center justify-center rounded-full bg-orange-500 text-[15px] font-medium text-white hover:bg-orange-600"
            :class="cartStore.isEmpty ? 'pointer-events-none opacity-50' : ''"
        >
          Оформить заказ
        </NuxtLink>
        <button
            type="button"
            class="h-12 w-full rounded-full border-2 border-orange-500 bg-transparent text-[15px] font-medium text-orange-500 hover:bg-orange-500/10"
        >
          Быстрый заказ
        </button>
        <div class="space-y-1.5 pt-2 text-[12px] leading-4 text-zinc-500">
          <p>Подтверждая заказ, я принимаю условия:</p>
          <NuxtLink to="/privacy" class="block text-zinc-950 underline-offset-2 hover:underline">
            положения о сборе и защите персональных данных
          </NuxtLink>
          <NuxtLink to="/terms" class="block text-zinc-950 underline-offset-2 hover:underline">
            пользовательского соглашения
          </NuxtLink>
        </div>
      </div>
    </aside>
  </div>
</template>

<script setup lang="ts">
import CartPageItem from '~/components/cart/CartPageItem.vue';
import { useCartStore } from '~/stores/cart';
import { useCartQuantity } from '~/composables/useCartQuantity';
import { CURRENCY_CODE } from '~/utils/constants/currency';

definePageMeta({
  layout: 'cart',
});

const cartStore = useCartStore();
const { increase, decrease } = useCartQuantity();

const { pending } = await useAsyncData('cart-page', async () => {
  await cartStore.loadCart();
  return cartStore.items;
});

useSeoMeta({
  title: 'Корзина',
});

function formatMoney(price?: number) {
  if (price == null || !Number.isFinite(price)) return `0 ${CURRENCY_CODE}`;
  return `${price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} ${CURRENCY_CODE}`;
}
</script>
