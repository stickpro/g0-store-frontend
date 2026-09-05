<template>
  <div class="w-full">
    <div class="flex flex-col gap-3">
      <nav class="flex items-center gap-0 text-[13px] leading-4 text-zinc-950" aria-label="Навигация">
        <NuxtLink to="/" class="flex size-6 items-center justify-center rounded-full p-1">
          <img src="@/assets/icons/home.svg" alt="Главная" class="size-4">
        </NuxtLink>
        <img src="@/assets/icons/chevron_right.svg" alt="" class="size-4">
        <span class="rounded-full px-2 py-1 text-[13px] leading-4 text-zinc-950">
          Аккаунт
        </span>
      </nav>

      <h1 class="text-[28px] font-normal leading-[45px] text-zinc-950">
        Аккаунт
      </h1>
    </div>

    <div class="mt-8 max-w-[560px] rounded-3xl border border-dashed border-zinc-600/15 p-6">
      <p class="text-[13px] leading-4 text-zinc-500">Почта</p>
      <p class="mt-2 text-[17px] text-zinc-950">{{ user.email }}</p>

      <div class="mt-6 grid gap-5">
        <div v-if="user.location">
          <p class="text-[13px] leading-4 text-zinc-500">Город</p>
          <p class="mt-1 text-[15px] text-zinc-950">{{ user.location }}</p>
        </div>
        <div v-if="createdAt">
          <p class="text-[13px] leading-4 text-zinc-500">Дата регистрации</p>
          <p class="mt-1 text-[15px] text-zinc-950">{{ createdAt }}</p>
        </div>
      </div>

      <button
          type="button"
          class="mt-8 h-12 rounded-full border border-zinc-600/20 px-6 text-[15px] text-zinc-950 hover:bg-zinc-600/5"
          @click="logout"
      >
        Выйти
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth';

definePageMeta({
  layout: 'account',
});

const authStore = useAuthStore();
const user = computed(() => authStore.user || { email: '', location: '' });

const createdAt = computed(() => {
  if (!authStore.user?.created_at) return '';
  const date = new Date(authStore.user.created_at);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString('ru-RU');
});

useSeoMeta({
  title: 'Аккаунт',
  robots: 'noindex, nofollow',
});

async function logout() {
  authStore.logout();
  await navigateTo('/');
}
</script>
