<template>
  <nav class="px-4 py-3 text-zinc-950 lg:px-0 lg:py-6" aria-label="Меню кабинета">
    <ul class="-mx-4 flex gap-1 overflow-x-auto px-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:mx-0 lg:flex-col lg:gap-0 lg:overflow-visible lg:px-0">
      <li v-for="item in items" :key="item.to" class="shrink-0">
        <NuxtLink
            :to="item.to"
            class="flex h-10 items-center rounded-full px-4 text-[15px] leading-4 whitespace-nowrap hover:bg-gray-50 lg:h-8 lg:rounded-lg lg:px-3"
            :class="{ 'bg-zinc-600/5': isActive(item) }"
        >
          {{ item.label }}
        </NuxtLink>
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
const route = useRoute();

const items = [
  { to: '/account', label: 'Аккаунт', exact: true },
  { to: '/account/orders', label: 'Мои заказы' },
  { to: '/account/templates', label: 'Шаблоны заказов' },
  { to: '/account/organizations', label: 'Организации' },
];

function isActive(item: { to: string; exact?: boolean }) {
  if (item.exact) return route.path === item.to;
  return route.path === item.to || route.path.startsWith(`${item.to}/`);
}
</script>
