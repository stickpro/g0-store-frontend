<template>
  <div class="sticky top-0 z-50">
    <header class="relative overflow-hidden border-b border-dashed border-zinc-600/15 bg-blue-50">
      <div class="mx-auto flex max-w-[1552px] items-center justify-between px-1 py-2 lg:justify-start lg:space-x-4 lg:px-0 lg:py-4">
        <div class="flex items-center">
          <button class="p-3 text-gray-600 hover:text-gray-800" type="button" aria-label="Меню" @click="toggleSidebar">
            <IconNav/>
          </button>
          <button
              class="p-3 text-gray-600 hover:text-gray-800 lg:hidden"
              type="button"
              aria-label="Поиск"
              @click="openMobileSearch"
          >
            <IconSearch/>
          </button>
          <NuxtLink to="/" class="p-3 lg:hidden" aria-label="Главная">
            <img src="@/assets/icons/home.svg" alt="" class="size-6">
          </NuxtLink>
          <NuxtLink to="/" class="z-20 hidden lg:block">
            <img src="~/assets/images/logo.svg" alt="3delectronics">
          </NuxtLink>
          <div class="relative hidden lg:block">
            <div
                class="pointer-events-none absolute inset-0 -top-30 -left-15 z-10 h-[260px] w-[260px] rounded-full bg-[#BFDBFE] blur-[50px]"/>
            <button
                class="relative z-20 mx-2 flex items-center space-x-2 rounded-full border border-zinc-600 px-3 py-3"
                :class="catalogOpen ? 'bg-zinc-600/5 backdrop-blur-md' : 'bg-transparent hover:bg-gray-50'"
                @click="toggleCatalog">
              <IconXmark v-if="catalogOpen"/>
              <IconCatalog v-else/>
              <span class="font-sans">Каталог</span>
            </button>
          </div>
        </div>
        <div class="z-20 mx-4 hidden max-w-3xl flex-1 lg:block">
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
                class="absolute top-1/2 right-0 -translate-y-1/2 transform rounded-full bg-blue-600 p-3 px-5 text-white hover:bg-blue-700">
              Искать
            </button>
          </form>
        </div>
        <div class="relative ml-auto flex items-center">
          <div
              class="pointer-events-none absolute inset-0 -top-0 -left-15 z-10 hidden h-[296px] w-[296px] rounded-full bg-[#BFDBFE] blur-[50px] lg:block"/>
          <div class="relative z-20 flex items-center">
            <button
                class="relative inline-flex p-3 text-gray-600 hover:text-gray-800"
                type="button"
                :aria-label="cartStore.itemCount ? `Корзина, ${cartStore.itemCount}` : 'Корзина'"
                @click="onToggleCart"
            >
              <IconCart/>
              <span
                  v-if="cartStore.itemCount > 0"
                  class="absolute top-1.5 right-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-orange-500 px-1 text-[10px] font-medium leading-none text-white"
              >
                {{ cartStore.itemCount > 99 ? '99+' : cartStore.itemCount }}
              </span>
            </button>
            <a
                href="tel:+78123176772"
                class="inline-flex p-3 text-gray-600 hover:text-gray-800"
                aria-label="Позвонить"
            >
              <IconPhone/>
            </a>
            <NuxtLink
                v-if="authStore.isAuthenticated"
                to="/account"
                class="inline-flex p-3 text-blue-600 hover:text-blue-700 lg:p-3"
                aria-label="Личный кабинет"
            >
              <span class="flex size-8 items-center justify-center rounded-full bg-gradient-to-br from-sky-400 via-violet-400 to-rose-400 lg:bg-none">
                <IconPersone class="lg:size-6"/>
              </span>
            </NuxtLink>
            <button
                v-else
                class="inline-flex p-2 text-gray-600 hover:text-gray-800 lg:p-3"
                type="button"
                aria-label="Войти"
                @click="authStore.openModal()"
            >
              <span class="flex size-8 items-center justify-center rounded-full bg-gradient-to-br from-sky-400 via-violet-400 to-rose-400 lg:bg-none">
                <IconPersone/>
              </span>
            </button>
          </div>
        </div>
      </div>
    </header>
    <CatalogDropdown :open="catalogOpen" @close="catalogOpen = false"/>
    <SearchDropdown :open="searchOpen" :query="searchQuery" @close="searchOpen = false"/>
    <CartDrawer :open="cartOpen" @close="closeCart"/>
    <CartToast/>
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
import IconSearch from "~/components/icons/IconSearch.vue";
import Sidebar from "~/components/layouts/sidebar/Sidebar.vue";
import IconNav from "~/components/icons/IconNav.vue";
import CartDrawer from "~/components/cart/CartDrawer.vue";
import CartToast from "~/components/cart/CartToast.vue";
import CatalogDropdown from "~/components/category/CatalogDropdown.vue";
import SearchDropdown from "~/components/search/SearchDropdown.vue";
import AuthModal from "~/components/user/AuthModal.vue";
import { useAuthStore } from "~/stores/auth";
import { useCartStore } from "~/stores/cart";

const route = useRoute();
const { toggleSidebar } = useSidebar();
const { isOpen: cartOpen, closeCart, toggleCart } = useCartDrawer();
const authStore = useAuthStore();
const cartStore = useCartStore();
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

onMounted(() => {
  cartStore.loadCart();
});

function submitSearch() {
  const q = searchQuery.value.trim();
  if (q.length < 2) return;
  openSearch();
}

function openMobileSearch() {
  catalogOpen.value = false;
  cartOpen.value = false;
  navigateTo('/search');
}
</script>

<style scoped>

</style>
