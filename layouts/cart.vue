<template>
  <div class="min-h-screen bg-white">
    <header class="h-20 border-b-1 border-dashed border-zinc-600/15 bg-white/90 backdrop-blur-[24px]">
      <div class="mx-auto flex h-full w-full max-w-[1552px] items-center">
        <NuxtLink to="/" class="flex items-center">
          <img src="~/assets/images/logo.svg" alt="3delectronics" class="h-[22px] w-[234px]">
        </NuxtLink>
      </div>
    </header>

    <div class="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-[1552px]">
      <slot/>
    </div>

    <AuthModal/>
    <GeoModal/>
  </div>
</template>

<script setup lang="ts">
import AuthModal from '~/components/user/AuthModal.vue';
import GeoModal from '~/components/geo/GeoModal.vue';
</script>
