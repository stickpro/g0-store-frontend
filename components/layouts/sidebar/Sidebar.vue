<template>
  <!-- Sidebar -->
  <div
      :class="[
        'fixed inset-y-0 left-0 z-30 flex w-[384px] max-w-full flex-col border-r border-zinc-600/15 bg-white transform transition-transform duration-300 ease-in-out overscroll-none',
        isOpen ? 'translate-x-0' : '-translate-x-full'
      ]"
  >
    <!-- Header -->
    <div class="flex shrink-0 items-center justify-between">
      <div class="flex justify-between">
        <button class="p-3" type="button" aria-label="Закрыть меню" @click="closeSidebar">
          <IconXmark/>
        </button>
        <button class="p-3" type="button" aria-label="Поиск">
          <IconSearch/>
        </button>
      </div>
      <div class="ml-auto flex items-center">
        <button
            class="p-3 text-gray-600 hover:text-gray-800"
            type="button"
            aria-label="Корзина"
            @click="openCartFromSidebar"
        >
          <IconCart/>
        </button>
        <button class="p-3 text-gray-600 hover:text-gray-800" type="button" aria-label="Позвонить">
          <IconPhone/>
        </button>
        <NuxtLink
            v-if="authStore.isAuthenticated"
            to="/account"
            class="inline-flex p-3 text-blue-600 hover:text-blue-700"
            aria-label="Личный кабинет"
            @click="closeSidebar"
        >
          <IconPerson/>
        </NuxtLink>
        <button
            v-else
            class="p-3 text-gray-600 hover:text-gray-800"
            type="button"
            aria-label="Войти"
            @click="openAuth"
        >
          <IconPerson/>
        </button>
      </div>
    </div>

    <div class="min-h-0 flex-1 overflow-y-auto overscroll-contain">
      <div class="mt-6 flex px-4">
        <NuxtLink
            to="/category"
            class="flex w-full justify-center space-x-4 rounded-full border border-zinc-600 bg-transparent px-4 py-2 hover:bg-gray-50"
            @click="closeSidebar"
        >
          <IconCatalog/>
          <span class="font-sans font-semibold">Каталог</span>
        </NuxtLink>
      </div>

      <Login/>

      <div class="space-x-1/2 border-t border-dashed border-zinc-200 px-4 pt-6">
        <h3 class="flex h-10 items-center font-semibold text-orange-500">Чат с 3D ELECTRONICS</h3>
        <Geo/>
        <WorkingHours/>
        <InfoCompany/>
      </div>
    </div>
  </div>

  <!-- Overlay -->
  <div
      v-if="isOpen"
      class="fixed inset-0 z-20 bg-black/20 backdrop-blur-sm overscroll-none"
      @click="closeSidebar"
      @wheel.prevent
      @touchmove.prevent
  />
</template>

<script setup lang="ts">
import IconCart from "~/components/icons/IconCart.vue";
import IconSearch from "~/components/icons/IconSearch.vue";
import IconXmark from "~/components/icons/IconXmark.vue";
import IconPhone from "~/components/icons/IconPhone.vue";
import IconPerson from "~/components/icons/IconPerson.vue";
import IconCatalog from "~/components/icons/IconCatalog.vue";
import Login from "~/components/user/Login.vue";
import WorkingHours from "~/components/layouts/sidebar/WorkingHours.vue";
import InfoCompany from "~/components/company/InfoCompany.vue";
import { useAuthStore } from "~/stores/auth";

const route = useRoute()
const {isOpen, closeSidebar} = useSidebar()
const { openCart } = useCartDrawer()
const { setBodyScrollLocked } = useBodyScrollLock()
const authStore = useAuthStore()

function openAuth() {
  closeSidebar()
  authStore.openModal()
}

function openCartFromSidebar() {
  openCart()
}

watch(() => route.fullPath, () => {
  if (isOpen.value) closeSidebar()
})

watch(isOpen, (open) => {
  setBodyScrollLocked(open)
}, { immediate: true })

onBeforeUnmount(() => {
  setBodyScrollLocked(false)
})
</script>
