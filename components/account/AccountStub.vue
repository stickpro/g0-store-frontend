<template>
  <div class="w-full">
    <div class="flex flex-col gap-3">
      <nav class="flex items-center gap-0 text-[13px] leading-4 text-zinc-950" aria-label="Навигация">
        <NuxtLink to="/" class="flex size-6 items-center justify-center rounded-full p-1">
          <img src="@/assets/icons/home.svg" alt="Главная" class="size-4">
        </NuxtLink>
        <img src="@/assets/icons/chevron_right.svg" alt="" class="size-4">
        <span class="rounded-full px-2 py-1 text-[13px] leading-4 text-zinc-950">
          {{ title }}
        </span>
      </nav>

      <h1 class="text-[28px] font-normal leading-[45px] text-zinc-950">
        {{ title }}
      </h1>
    </div>

    <p class="mt-8 max-w-[560px] text-[15px] leading-6 text-zinc-500">
      {{ description }}
    </p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
  description: string;
}>();
</script>
