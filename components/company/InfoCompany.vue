<template>
  <div class="text-zinc-950">
    <h4 class="h-10 flex items-center font-bold px-4">Информация о компании</h4>
    <ul class="space-y-1/2">
      <li>
        <nuxt-link :to="{name: 'contacts'}" class="h-10 flex items-center px-4" :class="{ 'bg-zinc-600/5' : $route.name === 'contacts' }">Контакты</nuxt-link>
      </li>
      <li class="h-10 flex items-center px-4">Гарантия</li>
      <li class="h-10 flex items-center px-4">Доставка и оплата</li>
      <li class="h-10 flex items-center px-4">Возврат товара</li>
      <li class="h-10 flex items-center px-4">Поставщикам</li>
      <li class="h-10 flex items-center px-4">Партнёрская программа</li>
      <li class="h-10 flex items-center px-4">Условия использования сайта</li>
      <li class="h-10 flex items-center px-4">О нас</li>
    </ul>

  </div>
</template>

<script setup lang="ts">

</script>

<style scoped>

</style>
