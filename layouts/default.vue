<template>
  <div>
    <Header/>
    <main class="relative">
      <div class="flex items-center mx-auto max-w-[1552px]">
        <!-- Sidebar -->
        <div class="w-76 border-r-1 border-dashed border-zinc-600/15 min-h-screen">
            <SidebarCategory class="border-b-1 border-dashed border-zinc-600/15" />
          <div class="border-b-1 border-dashed border-zinc-600/15">
            <Login />
          </div>
          <div class="border-b-1 border-dashed border-zinc-600/15 px-4 py-6">
            <Geo />
          </div>
        </div>

        <!-- Main Content -->
        <div class="flex-1 p-6">
          <slot/>
        </div>
      </div>

    </main>
  </div>
</template>

<script setup lang="ts">
import Header from '~/components/layouts/header/Header.vue'
import SidebarCategory from "~/components/category/SidebarCategory.vue";
import Login from "~/components/user/Login.vue";
</script>

<style scoped>

</style>
