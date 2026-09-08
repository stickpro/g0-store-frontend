<template>
  <div>
    <Header/>
    <main class="relative">
      <div class="mx-auto flex max-w-[1552px]">
        <div class="mr-6 hidden min-h-screen w-76 min-w-76 shrink-0 border-r border-dashed border-zinc-600/15 lg:block">
          <SidebarCategory
              v-if="!isCatalogPage"
              class="border-b border-dashed border-zinc-600/15"
          />
          <div class="border-b border-dashed border-zinc-600/15">
            <Login/>
          </div>
          <div class="border-b border-dashed border-zinc-600/15 px-4 py-6">
            <h3 class="flex h-10 items-center px-0 text-orange-500 font-semibold">Чат с 3D ELECTRONICS</h3>
            <Geo/>
            <WorkingHours/>
          </div>
          <div class="border-b border-dashed border-zinc-600/15">
            <InfoCompany/>
          </div>
        </div>

        <div class="min-w-0 w-full max-w-full flex-1 px-4 py-4 lg:px-0 lg:py-6">
          <slot/>
        </div>
      </div>
    </main>

    <GeoModal/>
  </div>
</template>

<script setup lang="ts">
import Header from '~/components/layouts/header/Header.vue'
import SidebarCategory from "~/components/category/SidebarCategory.vue";
import Login from "~/components/user/Login.vue";
import WorkingHours from "~/components/layouts/sidebar/WorkingHours.vue";
import InfoCompany from "~/components/company/InfoCompany.vue";
import GeoModal from "~/components/geo/GeoModal.vue";

const route = useRoute();
const isCatalogPage = computed(() => route.path === '/category');
</script>

<style scoped>

</style>
