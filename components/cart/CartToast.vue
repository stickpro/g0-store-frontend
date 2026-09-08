<template>
  <Teleport to="body">
    <Transition name="cart-toast">
      <div
          v-if="visible && message"
          class="pointer-events-none fixed inset-x-0 bottom-24 z-[70] flex justify-center px-4 lg:bottom-8 lg:justify-end"
          role="status"
      >
        <div
            class="pointer-events-auto flex max-w-[420px] items-center gap-3 rounded-full px-4 py-2 shadow-lg"
            :class="kind === 'error' ? 'bg-zinc-950 text-white' : 'bg-zinc-950 text-white'"
        >
          <span
              class="flex size-8 shrink-0 items-center justify-center rounded-full"
              :class="kind === 'error' ? 'bg-orange-500/20 text-orange-400' : 'bg-orange-500 text-white'"
          >
            <svg v-if="kind === 'success'" class="size-4" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M3.5 8.5 6.5 11.5 12.5 4.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <svg v-else class="size-4" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M8 4.5v4M8 11.5h.01" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
            </svg>
          </span>
          <p class="min-w-0 flex-1 text-[14px] leading-5">{{ message }}</p>
          <button
              v-if="kind === 'success'"
              type="button"
              class="shrink-0 rounded-full bg-white px-3 py-1.5 text-[13px] font-medium text-zinc-950 hover:bg-zinc-100"
              @click="openFromToast"
          >
            Открыть
          </button>
          <button
              type="button"
              class="flex size-8 shrink-0 items-center justify-center rounded-full text-white/70 hover:text-white"
              aria-label="Закрыть"
              @click="dismiss"
          >
            <svg class="size-4" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
          </button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
const { message, kind, visible, dismiss } = useCartToast();
const { openCart } = useCartDrawer();
const route = useRoute();

function openFromToast() {
  dismiss();
  if (route.path === '/cart' || route.path.startsWith('/checkout')) return;
  openCart();
}
</script>

<style>
.cart-toast-enter-active,
.cart-toast-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.cart-toast-enter-from,
.cart-toast-leave-to {
  opacity: 0;
  transform: translateY(8px);
}
</style>
