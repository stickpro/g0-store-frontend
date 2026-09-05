<template>
  <div class="w-full">
    <div class="flex flex-col gap-3">
      <nav class="flex items-center gap-0 text-[13px] leading-4 text-zinc-950" aria-label="Навигация">
        <NuxtLink to="/" class="flex size-6 items-center justify-center rounded-full p-1">
          <img src="@/assets/icons/home.svg" alt="Главная" class="size-4">
        </NuxtLink>
        <img src="@/assets/icons/chevron_right.svg" alt="" class="size-4">
        <NuxtLink to="/account" class="rounded-full px-2 py-1 text-[13px] leading-4 text-zinc-950 hover:bg-zinc-600/5">
          Аккаунт
        </NuxtLink>
        <img src="@/assets/icons/chevron_right.svg" alt="" class="size-4">
        <span class="rounded-full px-2 py-1 text-[13px] leading-4 text-zinc-950">
          Мои заказы
        </span>
      </nav>

      <h1 class="text-[28px] font-normal leading-[45px] text-zinc-950">
        Мои заказы
      </h1>
    </div>

    <p v-if="loading" class="mt-8 text-[15px] leading-6 text-zinc-500">
      Загрузка заказов…
    </p>

    <p v-else-if="error" class="mt-8 text-[15px] leading-6 text-orange-600">
      Не удалось загрузить заказы
    </p>

    <p v-else-if="!orders.length" class="mt-8 max-w-[560px] rounded-3xl bg-orange-50 px-6 py-10 text-[15px] leading-6 text-orange-600">
      У вас пока нет заказов
    </p>

    <div v-else class="mt-8 flex flex-col gap-3">
      <OrderListItem
          v-for="order in orders"
          :key="order.id || String(order.number)"
          :order="order"
      />
    </div>

    <div v-if="lastPage > 1" class="mt-8 flex flex-wrap gap-2">
      <NuxtLink
          v-for="item in lastPage"
          :key="item"
          :to="{ query: item === 1 ? {} : { page: item } }"
          class="flex size-10 items-center justify-center rounded-full text-[15px]"
          :class="page === item ? 'bg-orange-500 text-white' : 'border border-zinc-600/20 text-zinc-950 hover:bg-zinc-600/5'"
      >
        {{ item }}
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import OrderListItem from '~/components/account/OrderListItem.vue';

definePageMeta({
  layout: 'account',
});

const PAGE_SIZE = 10;
const route = useRoute();
const page = computed(() => {
  const value = Number(route.query.page);
  return Number.isFinite(value) && value > 0 ? value : 1;
});

const { data, pending, error, status } = await useAsyncData(
    () => `account-orders-${page.value}`,
    async () => {
      const { $api } = useNuxtApp();
      return $api.order.list({ page: page.value, page_size: PAGE_SIZE });
    },
    { server: false, watch: [page] },
);

const loading = computed(() => pending.value || status.value === 'idle' || status.value === 'pending');
const orders = computed(() => data.value?.items || []);
const lastPage = computed(() => data.value?.pagination?.last_page || 1);

useSeoMeta({
  title: 'Мои заказы',
  robots: 'noindex, nofollow',
});
</script>
