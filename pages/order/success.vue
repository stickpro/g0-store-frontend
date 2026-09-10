<template>
  <div class="relative min-h-[calc(100vh-5rem)] overflow-hidden px-4 py-10 lg:px-6 lg:py-16">
    <div
        class="pointer-events-none absolute inset-0 -z-10"
        aria-hidden="true"
    >
      <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_#eff6ff_0%,_#ffffff_55%,_#fff7ed_100%)]"/>
      <div class="success-orb success-orb--blue absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-blue-500/15 blur-3xl"/>
      <div class="success-orb success-orb--orange absolute bottom-0 right-0 h-64 w-64 rounded-full bg-orange-400/20 blur-3xl"/>
    </div>

    <div class="mx-auto flex w-full max-w-xl flex-col items-center text-center">
      <div class="success-mark relative mb-8 flex size-24 items-center justify-center">
        <span class="absolute inset-0 rounded-full bg-blue-600/10"/>
        <span class="absolute inset-2 rounded-full bg-blue-600/15"/>
        <span class="relative flex size-16 items-center justify-center rounded-full bg-blue-600 text-white shadow-[0_12px_40px_rgba(37,99,235,0.35)]">
          <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              class="success-check size-8"
              aria-hidden="true"
          >
            <path
                d="M5 12.5 9.5 17 19 7.5"
                stroke="currentColor"
                stroke-width="2.4"
                stroke-linecap="round"
                stroke-linejoin="round"
            />
          </svg>
        </span>
      </div>

      <p class="text-[13px] uppercase tracking-[0.18em] text-blue-700/80">
        {{ eyebrow }}
      </p>
      <h1 class="mt-3 text-[32px] font-normal leading-10 text-zinc-950 lg:text-[40px] lg:leading-[48px]">
        {{ title }}
      </h1>
      <p class="mt-4 max-w-md text-[15px] leading-6 text-zinc-600">
        {{ description }}
      </p>

      <div
          v-if="displayNumber || displayTotal != null"
          class="mt-10 w-full overflow-hidden rounded-[28px] border border-zinc-600/10 bg-white/80 px-6 py-6 text-left shadow-[0_20px_60px_rgba(24,24,27,0.06)] backdrop-blur"
      >
        <dl class="space-y-4 text-[15px] leading-6">
          <div v-if="displayNumber" class="flex items-start justify-between gap-4">
            <dt class="text-zinc-500">Номер заказа</dt>
            <dd class="font-medium text-zinc-950">№{{ displayNumber }}</dd>
          </div>
          <div v-if="displayTotal != null" class="flex items-start justify-between gap-4">
            <dt class="text-zinc-500">Сумма</dt>
            <dd class="font-medium text-zinc-950">{{ formatOrderMoney(displayTotal) }}</dd>
          </div>
          <div v-if="paymentLabel" class="flex items-start justify-between gap-4">
            <dt class="text-zinc-500">Оплата</dt>
            <dd class="text-right font-medium text-zinc-950">{{ paymentLabel }}</dd>
          </div>
          <div v-if="statusLabel" class="flex items-start justify-between gap-4 border-t border-dashed border-zinc-600/15 pt-4">
            <dt class="text-zinc-500">Статус</dt>
            <dd class="font-medium text-orange-600">{{ statusLabel }}</dd>
          </div>
        </dl>
      </div>

      <p v-if="loading" class="mt-10 text-[15px] leading-6 text-zinc-500">
        Загружаем детали заказа…
      </p>
      <p v-else-if="loadError && !displayNumber" class="mt-10 text-[15px] leading-6 text-orange-600">
        {{ loadError }}
      </p>

      <div class="mt-10 flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
        <NuxtLink
            v-if="orderPath"
            :to="orderPath"
            class="inline-flex h-12 items-center justify-center rounded-full bg-blue-600 px-6 text-[15px] font-medium text-white hover:bg-blue-700"
        >
          Смотреть заказ
        </NuxtLink>
        <NuxtLink
            to="/"
            class="inline-flex h-12 items-center justify-center rounded-full border border-zinc-600/20 bg-white/70 px-6 text-[15px] font-medium text-zinc-950 hover:bg-white"
        >
          На главную
        </NuxtLink>
      </div>

      <p class="mt-8 text-[13px] leading-5 text-zinc-500">
        <template v-if="isQuick">
          Вопросы —
          <a href="tel:+78123176772" class="text-blue-600 hover:underline">8(812)317-67-72</a>
          или
          <a href="mailto:info@3Delectronics.ru" class="text-blue-600 hover:underline">info@3Delectronics.ru</a>
        </template>
        <template v-else>
          Подтверждение отправим на почту. Вопросы —
          <a href="mailto:info@3Delectronics.ru" class="text-blue-600 hover:underline">info@3Delectronics.ru</a>
        </template>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { OrderResponse } from '~/repository/types/api/generatedApiGo';
import { useAuthStore } from '~/stores/auth';
import {
  formatOrderMoney,
  orderDetailPath,
  orderNumber,
  orderStatusLabel,
  paymentMethodLabel,
  paymentStatusLabel,
} from '~/utils/order';

definePageMeta({
  layout: 'cart',
});

const SUCCESS_STORAGE_KEY = 'orderSuccess';

type SuccessSnapshot = {
  number?: number;
  id?: string;
  grand_total?: number | string;
  payment_method?: string;
  payment_status?: string;
  status?: string;
  source?: string;
};

const route = useRoute();
const order = ref<OrderResponse | null>(null);
const snapshot = ref<SuccessSnapshot | null>(null);
const loading = ref(false);
const loadError = ref('');

const queryNumber = computed(() => {
  const raw = route.query.number;
  const value = Array.isArray(raw) ? raw[0] : raw;
  return value ? String(value) : '';
});

const isPaidQuery = computed(() => {
  const raw = route.query.paid;
  const value = Array.isArray(raw) ? raw[0] : raw;
  return value === '1' || value === 'true';
});

const displayNumber = computed(() =>
    orderNumber(order.value || {}) || (snapshot.value?.number != null ? String(snapshot.value.number) : queryNumber.value),
);

const displayTotal = computed(() =>
    order.value?.grand_total ?? snapshot.value?.grand_total ?? null,
);

const paymentMethod = computed(() =>
    order.value?.payment_method || snapshot.value?.payment_method || '',
);

const paymentLabel = computed(() => {
  const method = paymentMethodLabel(paymentMethod.value);
  const status = paymentStatusLabel(order.value?.payment_status || snapshot.value?.payment_status);
  if (method && status) return `${method} · ${status}`;
  return method || status;
});

const statusLabel = computed(() => {
  const status = order.value?.status || snapshot.value?.status;
  return status ? orderStatusLabel(status) : '';
});

const authStore = useAuthStore();

const orderPath = computed(() => {
  if (!authStore.isAuthenticated) return '';
  const number = order.value?.number ?? snapshot.value?.number ?? Number(queryNumber.value);
  if (!Number.isFinite(number) || !number) return '/account/orders';
  return orderDetailPath({ number });
});

const isCash = computed(() => paymentMethod.value === 'cash');
const isQuick = computed(() =>
    (order.value?.source || snapshot.value?.source) === 'quick',
);

const eyebrow = computed(() => {
  if (isPaidQuery.value || order.value?.payment_status === 'paid') return 'Оплата прошла';
  if (isQuick.value) return 'Быстрый заказ';
  if (isCash.value) return 'Заказ принят';
  return 'Спасибо';
});

const title = computed(() => {
  if (isPaidQuery.value || order.value?.payment_status === 'paid') return 'Заказ оплачен';
  if (isQuick.value) return 'Заявка принята';
  return 'Заказ оформлен';
});

const description = computed(() => {
  if (isPaidQuery.value || order.value?.payment_status === 'paid') {
    return 'Мы уже начали готовить заказ к отправке. Статус можно отслеживать в личном кабинете.';
  }
  if (isQuick.value) {
    return 'Менеджер перезвонит по указанному телефону, уточнит адрес, доставку и способ оплаты. Сохраните номер заявки.';
  }
  if (isCash.value) {
    return 'Оплата при получении. Сохраните номер заказа — он понадобится при выдаче.';
  }
  if (paymentMethod.value === 'invoice') {
    return 'Счёт на оплату отправим на указанную почту. После оплаты заказ пойдёт в сборку.';
  }
  return 'Если оплата ещё не завершена, закончите её по ссылке из письма или вернитесь к заказу позже.';
});

function readSnapshot(): SuccessSnapshot | null {
  if (!import.meta.client) return null;
  try {
    const raw = sessionStorage.getItem(SUCCESS_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as SuccessSnapshot;
  } catch {
    return null;
  }
}

async function loadOrder() {
  snapshot.value = readSnapshot();
  const number = queryNumber.value || (snapshot.value?.number != null ? String(snapshot.value.number) : '');
  if (!number) {
    loadError.value = 'Не удалось определить заказ';
    return;
  }

  loading.value = true;
  loadError.value = '';
  const { $api } = useNuxtApp();
  try {
    order.value = await $api.order.getByNumber(number);
  } catch {
    if (!snapshot.value && !queryNumber.value) {
      loadError.value = 'Заказ не найден';
    }
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  void loadOrder();
});

watch(queryNumber, () => {
  void loadOrder();
});

useSeoMeta({
  title: 'Заказ оформлен',
});
</script>

<style scoped>
.success-mark {
  animation: success-pop 0.7s cubic-bezier(0.22, 1, 0.36, 1) both;
}

.success-check {
  stroke-dasharray: 28;
  stroke-dashoffset: 28;
  animation: success-draw 0.55s 0.25s ease forwards;
}

.success-orb--blue {
  animation: orb-drift 8s ease-in-out infinite alternate;
}

.success-orb--orange {
  animation: orb-drift 10s ease-in-out infinite alternate-reverse;
}

@keyframes success-pop {
  0% {
    opacity: 0;
    transform: scale(0.7);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes success-draw {
  to {
    stroke-dashoffset: 0;
  }
}

@keyframes orb-drift {
  from {
    transform: translate3d(0, 0, 0);
  }
  to {
    transform: translate3d(24px, -18px, 0);
  }
}
</style>
