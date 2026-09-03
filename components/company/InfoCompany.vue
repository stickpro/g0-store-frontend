<template>
  <div class="text-zinc-950">
    <h4 class="h-10 flex items-center font-bold px-4">Информация о компании</h4>
    <ul class="space-y-1/2">
      <li>
        <nuxt-link :to="{name: 'contacts'}" class="h-10 flex items-center px-4" :class="{ 'bg-zinc-600/5' : $route.name === 'contacts' }" @click="closeSidebar">Контакты</nuxt-link>
      </li>
      <li>
        <nuxt-link to="/warranty" class="h-10 flex items-center px-4" :class="{ 'bg-zinc-600/5' : $route.path === '/warranty' }" @click="closeSidebar">Гарантия</nuxt-link>
      </li>
      <li>
        <nuxt-link to="/dostavka" class="h-10 flex items-center px-4" :class="{ 'bg-zinc-600/5' : $route.path === '/dostavka' }" @click="closeSidebar">Доставка и оплата</nuxt-link>
      </li>
      <li>
        <nuxt-link to="/warranty" class="h-10 flex items-center px-4" :class="{ 'bg-zinc-600/5' : $route.path === '/warranty' }" @click="closeSidebar">Возврат товара</nuxt-link>
      </li>
      <li class="h-10 flex items-center px-4">Поставщикам</li>
      <li class="h-10 flex items-center px-4">Партнёрская программа</li>
      <li class="h-10 flex items-center px-4">Условия использования сайта</li>
      <li class="h-10 flex items-center px-4">О нас</li>
    </ul>

  </div>
</template>

<script setup lang="ts">
const { closeSidebar } = useSidebar()
</script>

<style scoped>

</style>
