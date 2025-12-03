<template>
  <div>
    <Header/>
    <main class="relative">
      <div class="mx-auto py-6 flex max-w-[1552px]">
        <slot/>
      </div>
    </main>
    <GeoModal/>
  </div>
</template>

<script setup lang="ts">

import Header from "~/components/layouts/header/Header.vue";
import GeoModal from "~/components/geo/GeoModal.vue";
</script>

<style scoped>

</style>
