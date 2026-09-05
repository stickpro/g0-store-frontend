<template>
  <div class="sticky top-0 z-50">
    <header class="bg-blue-50 overflow-hidden border-b-1 border-dashed border-zinc-600/15">
      <div class="flex items-center space-x-4 mx-auto max-w-[1552px] py-4">
        <!-- SideBar Activator -->
        <button class="text-gray-600 hover:text-gray-800 p-3" @click="toggleSidebar">
          <IconNav/>
        </button>
        <nuxt-link to="/" class="z-20">
          <img src="~/assets/images/logo.svg" alt="3delectronics">
        </nuxt-link>
        <div class="relative">
          <!-- Фон под кнопкой -->
          <div
              class="absolute z-10 inset-0 -left-15 -top-30 w-[260px] h-[260px] rounded-full bg-[#BFDBFE] blur-[50px] pointer-events-none"/>

          <!-- Кнопка Каталог -->
          <button
              class="relative z-20 flex items-center space-x-2 rounded-full border border-zinc-600 px-3 py-3 mx-2"
              :class="catalogOpen ? 'bg-zinc-600/5 backdrop-blur-md' : 'bg-transparent hover:bg-gray-50'"
              @click="toggleCatalog">
            <IconXmark v-if="catalogOpen"/>
            <IconCatalog v-else/>
            <span class="font-sans">Каталог</span>
          </button>
        </div>
        <div class="flex-1 mx-4 max-w-3xl z-20">
          <form class="relative" @submit.prevent="submitSearch">
            <input
                v-model="searchQuery"
                type="text"
                placeholder="Я ищу..."
                class="w-full rounded-full bg-white px-5 py-3 outline-none"
                @focus="onSearchFocus"
                @input="onSearchInput"
            >
            <button
                type="submit"
                class="absolute right-0 top-1/2 -translate-y-1/2 transform rounded-full bg-blue-600 p-3 px-5 text-white hover:bg-blue-700">
              Искать
            </button>
          </form>
        </div>
        <div class="flex items-center ml-auto">
          <div class="relative">
            <div
                class="absolute z-10 inset-0 -left-15 -top-0 w-[296px] h-[296px] rounded-full bg-[#BFDBFE] blur-[50px] pointer-events-none"/>
            <div class="relative z-20 flex items-center">
              <button
                  class="inline-flex text-gray-600 hover:text-gray-800 p-3"
                  type="button"
                  aria-label="Корзина"
                  @click="onToggleCart"
              >
                <IconCart/>
              </button>
              <button class="inline-flex text-gray-600 hover:text-gray-800 p-3">
                <IconPhone/>
              </button>
              <NuxtLink
                  v-if="authStore.isAuthenticated"
                  to="/account"
                  class="inline-flex text-blue-600 hover:text-blue-700 p-3"
                  aria-label="Личный кабинет"
              >
                <IconPersone/>
              </NuxtLink>
              <button
                  v-else
                  class="inline-flex text-gray-600 hover:text-gray-800 p-3"
                  type="button"
                  aria-label="Войти"
                  @click="authStore.openModal()"
              >
                <IconPersone/>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
    <CatalogDropdown :open="catalogOpen" @close="catalogOpen = false"/>
    <SearchDropdown :open="searchOpen" :query="searchQuery" @close="searchOpen = false"/>
    <CartDrawer :open="cartOpen" @close="closeCart"/>
    <Sidebar/>
    <AuthModal />
  </div>
</template>

<script setup lang="ts">
import IconCatalog from "~/components/icons/IconCatalog.vue";
import IconXmark from "~/components/icons/IconXmark.vue";
import IconCart from "~/components/icons/IconCart.vue";
import IconPhone from "~/components/icons/IconPhone.vue";
import IconPersone from "~/components/icons/IconPerson.vue";
import Sidebar from "~/components/layouts/sidebar/Sidebar.vue";
import IconNav from "~/components/icons/IconNav.vue";
import CartDrawer from "~/components/cart/CartDrawer.vue";
import CatalogDropdown from "~/components/category/CatalogDropdown.vue";
import SearchDropdown from "~/components/search/SearchDropdown.vue";
import AuthModal from "~/components/user/AuthModal.vue";
import { useAuthStore } from "~/stores/auth";

const route = useRoute();
const { toggleSidebar } = useSidebar();
const { isOpen: cartOpen, closeCart, toggleCart } = useCartDrawer();
const authStore = useAuthStore();
const catalogOpen = ref(false);
const searchOpen = ref(false);
const searchQuery = ref(typeof route.query.q === 'string' ? route.query.q : '');

watch(() => route.query.q, (q) => {
  if (typeof q === 'string') searchQuery.value = q;
});

function openSearch() {
  if (searchQuery.value.trim().length < 2) return;
  searchOpen.value = true;
  catalogOpen.value = false;
  cartOpen.value = false;
}

function onSearchFocus() {
  openSearch();
}

function onSearchInput() {
  if (searchQuery.value.trim().length < 2) {
    searchOpen.value = false;
    return;
  }
  openSearch();
}

function toggleCatalog() {
  catalogOpen.value = !catalogOpen.value;
  if (catalogOpen.value) {
    searchOpen.value = false;
    cartOpen.value = false;
  }
}

function onToggleCart() {
  toggleCart();
  if (cartOpen.value) {
    catalogOpen.value = false;
    searchOpen.value = false;
  }
}

watch(() => route.fullPath, () => {
  closeCart();
});

function submitSearch() {
  const q = searchQuery.value.trim();
  if (q.length < 2) return;
  openSearch();
}
</script>

<style scoped>

</style>
