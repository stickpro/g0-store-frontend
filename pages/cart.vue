<template>
  <div class="flex w-full min-h-[calc(100vh-5rem)]">
    <div class="min-w-0 flex-1 px-4 pt-4 pb-36 lg:px-0 lg:pt-6 lg:pb-24">
      <h1 class="text-[24px] font-normal leading-9 text-zinc-950 lg:text-[28px] lg:leading-[45px]">
        Оформление заказа
      </h1>
      <h2 class="mt-2 text-[20px] font-normal leading-8 text-zinc-950 lg:mt-3 lg:text-[22px] lg:leading-9">
        Корзина
      </h2>

      <div v-if="pending && cartStore.isEmpty" class="mt-6 text-[15px] text-zinc-500">
        Загрузка корзины...
      </div>

      <div v-else-if="cartStore.isEmpty" class="mt-6 rounded-3xl bg-orange-50 px-6 py-16 text-center text-orange-500">
        Корзина пуста
      </div>

      <div v-else class="mt-6 grid grid-cols-1 border-dashed border-zinc-600/15 lg:grid-cols-2 lg:border-l">
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

    <aside class="hidden w-[304px] shrink-0 flex-col border-l border-dashed border-zinc-600/15 bg-[#FFF3E9] min-h-[calc(100vh-5rem)] lg:flex">
      <OrderSummary
          layout="desktop"
          :item-count="cartStore.itemCount"
          :total="cartStore.totalPrice"
      >
        <template #actions>
          <NuxtLink
              to="/checkout"
              class="flex h-12 w-full items-center justify-center rounded-full bg-orange-500 text-[15px] font-medium text-white hover:bg-orange-600"
              :class="cartStore.isEmpty ? 'pointer-events-none opacity-50' : ''"
          >
            Оформить заказ
          </NuxtLink>
          <button
              type="button"
              class="h-12 w-full rounded-full border-2 border-orange-500 bg-transparent text-[15px] font-medium text-orange-500 hover:bg-orange-500/10 disabled:opacity-50"
              :disabled="cartStore.isEmpty"
              @click="openQuickOrder"
          >
            Быстрый заказ
          </button>
        </template>
        <template #legal>
          <CartLegalNotes/>
        </template>
      </OrderSummary>
    </aside>

    <OrderSummarySheet
        v-model:expanded="sheetOpen"
        :total="cartStore.totalPrice"
        panel-class="bg-[#FFF3E9]"
    >
      <template #collapsed-action>
        <NuxtLink
            to="/checkout"
            class="flex h-12 shrink-0 items-center justify-center rounded-full bg-orange-500 px-5 text-[15px] font-medium text-white"
            :class="cartStore.isEmpty ? 'pointer-events-none opacity-50' : ''"
        >
          Оформить заказ
        </NuxtLink>
      </template>
      <OrderSummary
          layout="sheet"
          :item-count="cartStore.itemCount"
          :total="cartStore.totalPrice"
      >
        <template #actions>
          <NuxtLink
              to="/checkout"
              class="flex h-12 w-full items-center justify-center rounded-full bg-orange-500 text-[15px] font-medium text-white"
              :class="cartStore.isEmpty ? 'pointer-events-none opacity-50' : ''"
              @click="sheetOpen = false"
          >
            Оформить заказ
          </NuxtLink>
          <button
              type="button"
              class="h-12 w-full rounded-full border-2 border-orange-500 bg-transparent text-[15px] font-medium text-orange-500 disabled:opacity-50"
              :disabled="cartStore.isEmpty"
              @click="openQuickOrder"
          >
            Быстрый заказ
          </button>
        </template>
        <template #legal>
          <CartLegalNotes/>
        </template>
      </OrderSummary>
    </OrderSummarySheet>

    <CartQuickOrderModal v-model:open="quickOrderOpen"/>
  </div>
</template>

<script setup lang="ts">
import CartPageItem from '~/components/cart/CartPageItem.vue';
import CartLegalNotes from '~/components/cart/CartLegalNotes.vue';
import CartQuickOrderModal from '~/components/cart/CartQuickOrderModal.vue';
import OrderSummary from '~/components/cart/OrderSummary.vue';
import OrderSummarySheet from '~/components/cart/OrderSummarySheet.vue';
import { useCartStore } from '~/stores/cart';
import { useCartQuantity } from '~/composables/useCartQuantity';

definePageMeta({
  layout: 'cart',
});

const cartStore = useCartStore();
const { increase, decrease } = useCartQuantity();
const sheetOpen = ref(false);
const quickOrderOpen = ref(false);

function openQuickOrder() {
  if (cartStore.isEmpty) return;
  sheetOpen.value = false;
  quickOrderOpen.value = true;
}

const { pending } = await useAsyncData('cart-page', async () => {
  await cartStore.loadCart();
  return cartStore.items;
});

useSeoMeta({
  title: 'Корзина',
});
</script>
