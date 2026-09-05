<template>
  <AccountStub
      title="Организации"
      description="Здесь появятся реквизиты и организации для оформления заказов. Раздел пока в разработке."
  />
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'account',
});

useSeoMeta({
  title: 'Организации',
  robots: 'noindex, nofollow',
});
</script>
