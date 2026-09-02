<template>
  <div>
    <Header />
    <main class="relative">
      <div class="mx-auto flex max-w-[1552px]">
        <aside class="mr-6 w-76 min-w-76 min-h-screen flex-shrink-0 border-r border-dashed border-zinc-600/15">
          <CategoryFilters />
        </aside>
        <div class="min-w-0 w-full max-w-full flex-1 py-6">
          <slot />
        </div>
      </div>
    </main>
    <Footer />
    <GeoModal />
  </div>
</template>

<script setup lang="ts">
import Header from '~/components/layouts/header/Header.vue';
import Footer from '~/components/layouts/footer/Footer.vue';
import GeoModal from '~/components/geo/GeoModal.vue';
import CategoryFilters from '~/components/category/CategoryFilters.vue';
</script>
