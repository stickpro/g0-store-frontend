<template>
  <div class="min-h-screen bg-white">
    <Header/>
    <div class="mx-auto w-full max-w-[1552px]">
      <slot/>
    </div>
  </div>
</template>

<script setup lang="ts">
import Header from '~/components/layouts/header/Header.vue';
</script>
