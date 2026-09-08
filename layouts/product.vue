<template>
  <div>
    <Header/>
    <main class="relative">
      <div class="mx-auto flex max-w-[1552px] px-4 py-4 lg:px-0 lg:py-6">
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
