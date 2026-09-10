<template>
  <Teleport to="body">
    <div
        v-if="open"
        class="fixed inset-0 z-[80] flex items-end justify-center px-4 pb-4 sm:items-center sm:pb-0"
    >
      <div class="absolute inset-0 bg-black/20 backdrop-blur-[2px]" @click="close"/>

      <div
          class="relative z-10 w-full max-w-[400px] rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="quick-order-title"
      >
        <div class="flex items-start justify-between gap-4">
          <div>
            <h2 id="quick-order-title" class="text-[22px] leading-8 text-zinc-950">
              Быстрый заказ
            </h2>
            <p class="mt-2 text-[13px] leading-5 text-zinc-500">
              Оставьте имя и телефон — менеджер перезвонит, уточнит доставку и оплату.
            </p>
          </div>
          <button
              type="button"
              class="flex size-8 shrink-0 items-center justify-center"
              aria-label="Закрыть"
              @click="close"
          >
            <IconXmark/>
          </button>
        </div>

        <form class="mt-6 flex flex-col gap-3" @submit.prevent="submit">
          <CheckoutField
              v-model="name"
              label="*ФИО"
              autocomplete="name"
          />
          <CheckoutField
              v-model="phone"
              label="*Телефон"
              type="tel"
              autocomplete="tel"
              inputmode="tel"
              mask="phone"
              placeholder="+7 (___) ___-__-__"
          />
          <CheckoutField
              v-model="email"
              label="Почта"
              type="email"
              autocomplete="email"
          />

          <p v-if="error" class="text-[13px] leading-4 text-orange-600">
            {{ error }}
          </p>

          <button
              type="submit"
              class="mt-2 h-12 w-full rounded-full bg-orange-500 text-[15px] font-medium text-white hover:bg-orange-600 disabled:opacity-50"
              :disabled="submitting || cartStore.isEmpty"
          >
            {{ submitting ? 'Отправка…' : 'Отправить заказ' }}
          </button>
        </form>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import IconXmark from '~/components/icons/IconXmark.vue';
import CheckoutField from '~/components/checkout/CheckoutField.vue';
import type { OrderResponse } from '~/repository/types/api/generatedApiGo';
import { useAuthStore } from '~/stores/auth';
import { useCartStore } from '~/stores/cart';
import { orderSuccessPath } from '~/utils/order';
import { isCompletePhoneRu } from '~/utils/phoneMask';

const open = defineModel<boolean>('open', { default: false });

const cartStore = useCartStore();
const authStore = useAuthStore();

const name = ref('');
const phone = ref('');
const email = ref('');
const submitting = ref(false);
const error = ref('');

watch(open, (isOpen) => {
  if (!isOpen) return;
  error.value = '';
  if (!email.value && authStore.user?.email) {
    email.value = authStore.user.email;
  }
});

function close() {
  if (submitting.value) return;
  open.value = false;
}

function extractError(caught: unknown, fallback = 'Не удалось оформить заказ') {
  const err = caught as {
    data?: { message?: string; errors?: { message?: string }[] };
    message?: string;
    statusMessage?: string;
  };
  const field = err.data?.errors?.map((item) => item.message).filter(Boolean).join('. ');
  return field || err.data?.message || err.statusMessage || err.message || fallback;
}

function rememberOrderSuccess(order: OrderResponse) {
  if (!import.meta.client) return;
  sessionStorage.setItem('orderSuccess', JSON.stringify({
    number: order.number,
    id: order.id,
    grand_total: order.grand_total,
    payment_method: order.payment_method,
    payment_status: order.payment_status,
    status: order.status,
    source: order.source || 'quick',
  }));
}

async function submit() {
  if (submitting.value) return;

  if (cartStore.isEmpty) {
    error.value = 'Корзина пуста';
    return;
  }
  if (!name.value.trim()) {
    error.value = 'Укажите ФИО';
    return;
  }
  if (!isCompletePhoneRu(phone.value)) {
    error.value = 'Укажите полный телефон';
    return;
  }

  error.value = '';
  submitting.value = true;

  const { $api } = useNuxtApp();
  try {
    const order = await $api.order.createQuick({
      name: name.value.trim(),
      phone: phone.value.trim(),
      ...(email.value.trim() ? { email: email.value.trim() } : {}),
    }, crypto.randomUUID());

    rememberOrderSuccess(order);
    await cartStore.loadCart();
    open.value = false;
    await navigateTo(orderSuccessPath(order));
  } catch (caught) {
    error.value = extractError(caught);
  } finally {
    submitting.value = false;
  }
}
</script>
