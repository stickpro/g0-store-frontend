<template>
  <!-- Sidebar -->
  <div
      :class="[
        'z-30 fixed inset-y-0 left-0 w-[384px] bg-white transform transition-transform duration-300 ease-in-out z-20 border-r-1 border-zinc-600/15 ',
        isOpen ? 'translate-x-0' : '-translate-x-full'
      ]"
  >
    <div class="max-w-md mx-auto bg-white rounded-lg">
      <!-- Header -->
      <div class="flex items-center justify-between mb-4">
        <div class="flex justify-between">
          <button class="p-3" @click="closeSidebar">
            <IconXmark/>
          </button>
          <button class="p-3">
            <IconSearch/>
          </button>
        </div>
        <div class="flex items-center ml-auto">
          <button class="text-gray-600 hover:text-gray-800 p-3">
            <IconCart/>
          </button>
          <button class="text-gray-600 hover:text-gray-800 p-3">
            <IconPhone/>
          </button>
          <button class="text-gray-600 hover:text-gray-800 p-3">
            <IconPerson/>
          </button>
        </div>
      </div>

      <div class="flex px-4 mt-6">
        <button
            class="flex justify-center space-x-4 rounded-full border border-zinc-600 bg-transparent px-4 py-2 w-full  hover:bg-gray-50">
          <IconCatalog/>
          <span class="font-sans font-semibold">Каталог</span>
        </button>
      </div>

      <!-- Action Button -->
      <Login />
      <!-- Store Sections -->
      <div class="space-x-1/2 px-4 pt-6 border-t border-dashed border-zinc-200">
        <!-- 3D Electronics -->
        <h3 class="h-10 flex items-center text-orange-500 font-semibold">Чат с 3D ELECTRONICS</h3>
        <Geo />
        <WorkingHours />
        <!-- Company Info -->
        <InfoCompany />
      </div>
    </div>
  </div>

  <!-- Overlay -->
  <div
      v-if="isOpen"
      class="fixed inset-0 backdrop-blur-xs bg-opacity-10 z-10"
      @click="closeSidebar"
  />

  <!-- Activator -->
  <button class="text-gray-600 hover:text-gray-800 p-3" @click="toggleSidebar">
    <IconNav/>
  </button>

</template>

<script setup lang="ts">

import IconNav from "~/components/icons/IconNav.vue";
import IconCart from "~/components/icons/IconCart.vue";
import IconSearch from "~/components/icons/IconSearch.vue";
import IconXmark from "~/components/icons/IconXmark.vue";
import IconPhone from "~/components/icons/IconPhone.vue";
import IconPerson from "~/components/icons/IconPerson.vue";
import IconCatalog from "~/components/icons/IconCatalog.vue";
import Login from "~/components/user/Login.vue";
import WorkingHours from "~/components/layouts/sidebar/WorkingHours.vue";
import InfoCompany from "~/components/company/InfoCompany.vue";

const isOpen = ref(false)

const toggleSidebar = () => {
  isOpen.value = !isOpen.value
}

const closeSidebar = () => {
  isOpen.value = false
}

</script>
