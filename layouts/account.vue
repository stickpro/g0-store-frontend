<template>
  <div>
    <Header/>
    <main class="relative">
      <div class="mx-auto flex max-w-[1552px]">
        <div class="w-76 min-w-76 mr-6 flex-shrink-0 border-r-1 border-dashed border-zinc-600/15 min-h-screen">
          <SidebarAccount class="border-b-1 border-dashed border-zinc-600/15"/>
          <div class="border-b-1 border-dashed border-zinc-600/15 px-4 py-6">
            <h3 class="h-10 flex items-center text-orange-500 font-semibold">Чат с 3D ELECTRONICS</h3>
            <Geo/>
            <WorkingHours/>
          </div>
          <div class="border-b-1 border-dashed border-zinc-600/15">
            <InfoCompany/>
          </div>
        </div>

        <div class="flex-1 py-6 w-full min-w-0 max-w-full">
          <slot/>
        </div>
      </div>
    </main>

    <Footer/>
    <GeoModal/>
  </div>
</template>

<script setup lang="ts">
import Header from '~/components/layouts/header/Header.vue';
import Footer from '~/components/layouts/footer/Footer.vue';
import SidebarAccount from '~/components/account/SidebarAccount.vue';
import WorkingHours from '~/components/layouts/sidebar/WorkingHours.vue';
import InfoCompany from '~/components/company/InfoCompany.vue';
import GeoModal from '~/components/geo/GeoModal.vue';
import { useAuthStore } from '~/stores/auth';

const authStore = useAuthStore();

if (!authStore.user) {
  await authStore.fetchUser();
}

if (!authStore.isAuthenticated) {
  await navigateTo('/');
  authStore.openModal();
}
</script>
