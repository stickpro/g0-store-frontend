<template>
  <div>
    <Header/>
    <main>
      <slot/>
    </main>
  </div>
</template>

<script setup lang="ts">
import Header from '~/components/layouts/header/Header.vue'
</script>

<style scoped>

</style>
