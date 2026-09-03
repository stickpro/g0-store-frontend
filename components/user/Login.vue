<template>
  <div class="bg-blue-50 border-1 border-blue-600/15 rounded-3xl mx-4 my-6">
    <h2 class="text-sm text-center leading-7 p-3">
      {{ authStore.isAuthenticated ? authStore.user?.email : 'Войдите для быстрого оформления заказа' }}
    </h2>
    <hr class="h-px bg-blue-600/15 border-0">
    <button
        class="w-full text-blue-600 p-3 text-lg font-medium rounded-b-3xl hover:bg-blue-100"
        type="button"
        @click="onClick"
    >
      {{ authStore.isAuthenticated ? 'Личный кабинет' : 'Войти' }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth';

const authStore = useAuthStore();

function onClick() {
  if (authStore.isAuthenticated) {
    return navigateTo('/account');
  }
  authStore.openModal();
}
</script>
