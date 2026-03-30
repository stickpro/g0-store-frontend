<script setup lang="ts">
import ProductList from '~/components/product/ProductList.vue';
import { useCartStore } from '~/stores/cart';
import { CURRENCY_CODE } from '~/utils/constants/currency';

defineProps<{
  open: boolean;
}>();

const emit = defineEmits<{
  close: [];
}>();

const cartStore = useCartStore();

onMounted(() => {
  cartStore.loadCart();
});

function formatPrice(price?: number) {
  if (!price) return `0 ${CURRENCY_CODE}`;
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' ' + CURRENCY_CODE;
}

async function decrease(variantId: string, quantity: number) {
  if (quantity <= 1) {
    await cartStore.removeItem(variantId);
  } else {
    await cartStore.updateItem(variantId, quantity - 1);
  }
}

async function increase(variantId: string, quantity: number, max?: number) {
  if (max && quantity >= max) return;
  await cartStore.updateItem(variantId, quantity + 1);
}
</script>

<template>
  <Transition name="fade">
    <div v-if="open" class="absolute top-full left-0 right-0 z-40">
      <!-- Backdrop -->
      <div
        class="fixed inset-0 top-20 bg-white/80 backdrop-blur-[4px]"
        @click="emit('close')"
      />

      <!-- Panel -->
      <div class="relative z-10 mx-auto max-w-[1552px] bg-white border rounded-3xl border-zinc-200 px-6 py-6">
        <h2 class="text-center text-lg font-semibold text-zinc-950 mb-6">Корзина</h2>

        <!-- Empty state -->
        <div
          v-if="cartStore.isEmpty"
          class="flex flex-col items-center justify-center py-10 rounded-xl bg-orange-50"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" class="mb-3">
            <path d="M7.99634 18C6.89634 18 6.00634 18.9 6.00634 20C6.00634 21.1 6.89634 22 7.99634 22C9.09634 22 9.99634 21.1 9.99634 20C9.99634 18.9 9.09634 18 7.99634 18ZM1.99634 3C1.99634 3.55 2.44634 4 2.99634 4H3.99634L7.59634 11.59L6.24634 14.03C5.51634 15.37 6.47634 17 7.99634 17H18.9963C19.5463 17 19.9963 16.55 19.9963 16C19.9963 15.45 19.5463 15 18.9963 15H7.99634L9.09634 13H16.5463C17.2963 13 17.9563 12.59 18.2963 11.97L21.8763 5.48C22.2463 4.82 21.7663 4 21.0063 4H6.20634L5.53634 2.57C5.37634 2.22 5.01634 2 4.63634 2H2.99634C2.44634 2 1.99634 2.45 1.99634 3ZM17.9963 18C16.8963 18 16.0063 18.9 16.0063 20C16.0063 21.1 16.8963 22 17.9963 22C19.0963 22 19.9963 21.1 19.9963 20C19.9963 18.9 19.0963 18 17.9963 18Z" fill="#F97316"/>
          </svg>
          <span class="text-orange-500 font-medium">Корзина пуста</span>
        </div>

        <!-- Cart items grid -->
        <template v-else>
          <div class="grid grid-cols-2">
            <div
              v-for="(item, index) in cartStore.items"
              :key="item.variant_id"
              class="flex items-start gap-4 py-4 border-b border-dashed border-zinc-600/15"
              :class="index % 2 === 1 ? 'pl-8 border-l border-dashed border-zinc-600/15' : 'pr-8'"
            >
              <img
                v-if="item.image_url"
                :src="item.image_url"
                :alt="item.name"
                class="w-16 h-16 object-contain flex-shrink-0"
              >
              <div v-else class="w-16 h-16 bg-zinc-100 rounded flex-shrink-0" />

              <div class="flex flex-col gap-1 flex-1 min-w-0">
                <span class="text-sm text-zinc-800 leading-snug">{{ item.name }}</span>
                <span class="font-semibold text-zinc-950 mt-1">{{ formatPrice(item.price) }}</span>

                <!-- Quantity controls + delete -->
                <div class="flex items-center gap-3 mt-2">
                  <div class="flex items-center border border-zinc-200 rounded-full overflow-hidden">
                    <button
                      class="w-8 h-8 flex items-center justify-center text-zinc-600 hover:bg-zinc-100 transition-colors"
                      @click="decrease(item.variant_id!, item.quantity!)"
                    >
                      <svg width="12" height="2" viewBox="0 0 12 2" fill="none"><path d="M1 1H11" stroke="#09090B" stroke-width="1.5" stroke-linecap="round"/></svg>
                    </button>
                    <span class="w-8 text-center text-sm font-medium text-zinc-950">{{ item.quantity }}</span>
                    <button
                      class="w-8 h-8 flex items-center justify-center text-zinc-600 hover:bg-zinc-100 transition-colors"
                      :disabled="!!item.max_quantity && item.quantity! >= item.max_quantity"
                      @click="increase(item.variant_id!, item.quantity!, item.max_quantity)"
                    >
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 1V11M1 6H11" stroke="#09090B" stroke-width="1.5" stroke-linecap="round"/></svg>
                    </button>
                  </div>

                  <button
                    class="w-8 h-8 flex items-center justify-center text-zinc-400 hover:text-red-500 transition-colors"
                    @click="cartStore.removeItem(item.variant_id!)"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M3 6H5H21M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6L18.1185 19.1501C18.0515 20.1728 17.2149 21 16.1895 21H7.8105C6.78514 21 5.9485 20.1728 5.8815 19.1501L5 6M10 11V17M14 11V17" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Footer: total + checkout -->
          <div class="flex items-center justify-end gap-6 pt-4">
            <span class="text-xl font-semibold text-zinc-950">{{ formatPrice(cartStore.totalPrice) }}</span>
            <button class="bg-orange-500 hover:bg-orange-600 text-white font-medium px-8 py-3 rounded-full transition-colors">
              Оформить заказ
            </button>
          </div>
        </template>

        <!-- Просмотренные (заглушка) -->
        <ProductList title="Просмотренные" :products="[]" />
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
