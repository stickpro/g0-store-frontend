<template>
  <header class="bg-blue-50">
    <div class="flex items-center space-x-4 mx-auto max-w-[1552px] py-4">
      <button class="text-gray-600 hover:text-gray-800 p-3">
        <IconNav/>
      </button>
      <nuxt-link to="/">
        <img src="~/assets/images/logo.svg" alt="3delectronics">
      </nuxt-link>
      <button
          class="flex items-center space-x-2 rounded-full border border-zinc-600 bg-transparent px-4 py-3 mx-2 rounded-full hover:bg-gray-50">
        <IconCatalog/>
        <span class="font-sans font-semibold">Каталог</span>
      </button>
      <div class="flex-1 mx-4 max-w-3xl">
        <div class="relative">
          <input type="text" placeholder="Я ищу..."
                 class="w-full bg-white rounded-full px-5 py-3">
          <button
              class="absolute right-0 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white p-3 px-5 rounded-full hover:bg-blue-700">
            Искать
          </button>
        </div>
      </div>
      <div class="flex items-center ml-auto">
        <button class="text-gray-600 hover:text-gray-800 p-3">
          <IconCart/>
        </button>
        <button class="text-gray-600 hover:text-gray-800 p-3">
          <IconPhone/>
        </button>
        <button class="text-gray-600 hover:text-gray-800 p-3">
          <IconPersone/>
        </button>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import IconNav from "~/components/icons/IconNav.vue";
import IconCatalog from "~/components/icons/IconCatalog.vue";
import IconCart from "~/components/icons/IconCart.vue";
import IconPhone from "~/components/icons/IconPhone.vue";
import IconPersone from "~/components/icons/IconPersone.vue";
</script>

<style scoped>

</style>
