<template>
  <div>
    <Header/>
    <main class="relative">
      <div class="mx-auto flex max-w-[1552px] flex-col lg:flex-row">
        <div class="lg:mr-6 lg:min-h-screen lg:w-76 lg:min-w-76 lg:shrink-0 lg:border-r lg:border-dashed lg:border-zinc-600/15">
          <SidebarAccount class="border-b border-dashed border-zinc-600/15"/>
          <div class="hidden border-b border-dashed border-zinc-600/15 px-4 py-6 lg:block">
            <h3 class="flex h-10 items-center font-semibold text-orange-500">Чат с 3D ELECTRONICS</h3>
            <Geo/>
            <WorkingHours/>
          </div>
          <div class="hidden border-b border-dashed border-zinc-600/15 lg:block">
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
import Header from '~/components/layouts/header/Header.vue';
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
