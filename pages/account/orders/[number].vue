<template>
  <div class="w-full">
    <div class="flex flex-col gap-3">
      <nav class="flex flex-wrap items-center gap-0 text-[13px] leading-4 text-zinc-950" aria-label="Навигация">
        <NuxtLink to="/" class="flex size-6 items-center justify-center rounded-full p-1">
          <img src="@/assets/icons/home.svg" alt="Главная" class="size-4">
        </NuxtLink>
        <img src="@/assets/icons/chevron_right.svg" alt="" class="size-4">
        <NuxtLink to="/account" class="rounded-full px-2 py-1 hover:bg-zinc-600/5">
          Аккаунт
        </NuxtLink>
        <img src="@/assets/icons/chevron_right.svg" alt="" class="size-4">
        <NuxtLink to="/account/orders" class="rounded-full px-2 py-1 hover:bg-zinc-600/5">
          Мои заказы
        </NuxtLink>
        <img src="@/assets/icons/chevron_right.svg" alt="" class="size-4">
        <span class="rounded-full px-2 py-1">
          Заказ №{{ headingNumber }}
        </span>
      </nav>

      <h1 class="text-[28px] font-normal leading-[45px] text-zinc-950">
        Заказ №{{ headingNumber }}
      </h1>
    </div>

    <p v-if="loading" class="mt-8 text-[15px] leading-6 text-zinc-500">
      Загрузка заказа…
    </p>

    <div v-else-if="error || order?.number == null" class="mt-8">
      <p class="text-[15px] leading-6 text-orange-600">Заказ не найден</p>
      <NuxtLink
          to="/account/orders"
          class="mt-6 inline-flex h-12 items-center rounded-full bg-orange-500 px-6 text-[15px] font-medium text-white hover:bg-orange-600"
      >
        К списку заказов
      </NuxtLink>
    </div>

    <div v-else class="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
      <div class="flex flex-col gap-6">
        <section class="rounded-3xl border border-dashed border-zinc-600/15 px-6 py-5">
          <div class="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p class="text-[13px] leading-4 text-zinc-500">Оформлен</p>
              <p class="mt-1 text-[15px] leading-6 text-zinc-950">
                {{ formatOrderDate(order.created_at) || '—' }}
              </p>
            </div>
            <p
                class="text-[15px] leading-6"
                :class="isCancelledOrder(order.status) ? 'text-zinc-500' : 'text-orange-600'"
            >
              {{ orderStatusLabel(order.status) }}
            </p>
          </div>
          <p v-if="order.paid_at" class="mt-3 text-[13px] leading-4 text-zinc-500">
            Оплачен {{ formatOrderDate(order.paid_at) }}
          </p>
          <p v-if="order.cancelled_at" class="mt-3 text-[13px] leading-4 text-zinc-500">
            Отменён {{ formatOrderDate(order.cancelled_at) }}
          </p>
        </section>

        <section class="rounded-3xl border border-dashed border-zinc-600/15">
          <h2 class="px-6 py-4 text-[17px] leading-6 text-zinc-950">Состав заказа</h2>
          <ul class="divide-y divide-dashed divide-zinc-600/15 border-t border-dashed border-zinc-600/15">
            <li
                v-for="item in order.items || []"
                :key="item.variant_id || item.product_id || item.name"
                class="flex items-start gap-4 px-6 py-4"
            >
              <div class="size-16 shrink-0 overflow-hidden rounded-2xl bg-zinc-100">
                <img
                    v-if="imageUrl(item.image_path)"
                    :src="imageUrl(item.image_path)"
                    :alt="item.name"
                    class="size-16 object-contain"
                >
              </div>
              <div class="min-w-0 flex-1">
                <NuxtLink
                    v-if="item.slug"
                    :to="`/product/${item.slug}`"
                    class="text-[15px] leading-6 text-zinc-950 hover:text-zinc-600"
                >
                  {{ item.name }}
                </NuxtLink>
                <p v-else class="text-[15px] leading-6 text-zinc-950">{{ item.name }}</p>
                <p v-if="item.sku" class="mt-1 text-[13px] leading-4 text-zinc-500">
                  Артикул {{ item.sku }}
                </p>
                <p class="mt-2 text-[13px] leading-4 text-zinc-500">
                  {{ item.quantity || 1 }} × {{ formatOrderMoney(item.unit_price) }}
                </p>
              </div>
              <p class="shrink-0 text-[15px] font-medium leading-6 text-zinc-950">
                {{ formatOrderMoney(item.line_total ?? (item.unit_price || 0) * (item.quantity || 1)) }}
              </p>
            </li>
          </ul>
        </section>
      </div>

      <aside class="flex flex-col gap-6">
        <section class="rounded-3xl border border-dashed border-zinc-600/15 px-6 py-5">
          <h2 class="text-[17px] leading-6 text-zinc-950">Доставка</h2>
          <p v-if="shippingMethodLabel(order.shipping?.method)" class="mt-3 text-[15px] leading-6 text-zinc-950">
            {{ shippingMethodLabel(order.shipping?.method) }}
          </p>
          <p v-if="order.shipping?.recipient" class="mt-2 text-[15px] leading-6 text-zinc-950">
            {{ order.shipping.recipient }}
          </p>
          <p class="mt-2 text-[15px] leading-6 text-zinc-600">
            {{ shippingAddress }}
          </p>
        </section>

        <section class="rounded-3xl border border-dashed border-zinc-600/15 px-6 py-5">
          <h2 class="text-[17px] leading-6 text-zinc-950">Оплата</h2>
          <p v-if="paymentMethodLabel(order.payment_method)" class="mt-3 text-[15px] leading-6 text-zinc-950">
            {{ paymentMethodLabel(order.payment_method) }}
          </p>
          <p v-if="paymentStatusLabel(order.payment_status)" class="mt-1 text-[13px] leading-4 text-zinc-500">
            {{ paymentStatusLabel(order.payment_status) }}
          </p>
          <p v-if="order.email" class="mt-3 text-[15px] leading-6 text-zinc-600">{{ order.email }}</p>
          <p v-if="order.phone" class="mt-1 text-[15px] leading-6 text-zinc-600">{{ order.phone }}</p>
        </section>

        <section v-if="order.comment" class="rounded-3xl border border-dashed border-zinc-600/15 px-6 py-5">
          <h2 class="text-[17px] leading-6 text-zinc-950">Комментарий</h2>
          <p class="mt-3 text-[15px] leading-6 text-zinc-600">{{ order.comment }}</p>
        </section>

        <section class="rounded-3xl bg-orange-50 px-6 py-5">
          <dl class="space-y-2 text-[15px] leading-6 text-zinc-950">
            <div class="flex justify-between gap-4">
              <dt class="text-zinc-600">Товары</dt>
              <dd>{{ formatOrderMoney(order.subtotal) }}</dd>
            </div>
            <div v-if="hasOrderMoney(order.shipping_total)" class="flex justify-between gap-4">
              <dt class="text-zinc-600">Доставка</dt>
              <dd>{{ formatOrderMoney(order.shipping_total) }}</dd>
            </div>
            <div v-if="hasOrderMoney(order.discount_total)" class="flex justify-between gap-4">
              <dt class="text-zinc-600">Скидка</dt>
              <dd>−{{ formatOrderMoney(order.discount_total) }}</dd>
            </div>
            <div v-if="hasOrderMoney(order.tax_total)" class="flex justify-between gap-4">
              <dt class="text-zinc-600">Налоги</dt>
              <dd>{{ formatOrderMoney(order.tax_total) }}</dd>
            </div>
          </dl>
          <p class="mt-4 text-[13px] leading-4 text-zinc-500">К оплате</p>
          <p class="mt-1 text-[28px] font-bold leading-9 text-zinc-950">
            {{ formatOrderMoney(order.grand_total) }}
          </p>
        </section>
      </aside>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  formatOrderDate,
  formatOrderMoney,
  hasOrderMoney,
  isCancelledOrder,
  orderNumber,
  orderStatusLabel,
  paymentMethodLabel,
  paymentStatusLabel,
  shippingMethodLabel,
} from '~/utils/order';
import { seoAbsoluteUrl } from '~/utils/seo';

definePageMeta({
  layout: 'account',
});

const route = useRoute();
const config = useRuntimeConfig();
const number = computed(() => String(route.params.number || ''));

const { data: order, pending, error, status } = await useAsyncData(
    () => `account-order-${number.value}`,
    async () => {
      const { $api } = useNuxtApp();
      return $api.order.getByNumber(number.value);
    },
    { server: false, watch: [number] },
);

const loading = computed(() => pending.value || status.value === 'idle' || status.value === 'pending');

const headingNumber = computed(() => orderNumber(order.value || {}));

const shippingAddress = computed(() => {
  const shipping = order.value?.shipping;
  return [shipping?.city_name, shipping?.address, shipping?.postcode].filter(Boolean).join(', ');
});

function imageUrl(path?: string) {
  return seoAbsoluteUrl(String(config.public.storageUrl), path);
}

useSeoMeta({
  title: computed(() => headingNumber.value ? `Заказ №${headingNumber.value}` : 'Заказ'),
  robots: 'noindex, nofollow',
});
</script>
