<template>
  <div class="bg-blue-50 border-1 border-blue-600/15 rounded-3xl mx-4 my-6">
    <h2 class="text-sm text-center leading-7 p-3">
      {{ authStore.isAuthenticated ? (authStore.user?.email || 'Вы вошли') : 'Войдите для быстрого оформления заказа' }}
    </h2>
    <hr class="h-px bg-blue-600/15 border-0">
    <NuxtLink
        v-if="authStore.isAuthenticated"
        to="/account"
        class="flex w-full items-center justify-center text-blue-600 p-3 text-lg font-medium rounded-b-3xl hover:bg-blue-100"
    >
      Личный кабинет
    </NuxtLink>
    <button
        v-else
        class="w-full text-blue-600 p-3 text-lg font-medium rounded-b-3xl hover:bg-blue-100"
        type="button"
        @click="authStore.openModal()"
    >
      Войти
    </button>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth';

const authStore = useAuthStore();
</script>
