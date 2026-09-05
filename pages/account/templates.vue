<template>
  <AccountStub
      title="Шаблоны заказов"
      description="Здесь можно будет сохранять шаблоны повторных заказов. Раздел пока в разработке."
  />
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'account',
});

useSeoMeta({
  title: 'Шаблоны заказов',
  robots: 'noindex, nofollow',
});
</script>
