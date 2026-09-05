<template>
  <nav class="py-6 text-zinc-950" aria-label="Меню кабинета">
    <ul class="space-y-1/2">
      <li v-for="item in items" :key="item.to">
        <NuxtLink
            :to="item.to"
            class="flex h-8 items-center rounded-lg px-3 text-[15px] leading-4 hover:bg-gray-50"
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
