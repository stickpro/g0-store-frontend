<template>
  <span class="relative inline-flex justify-center px-1">
    <span class="invisible whitespace-nowrap" aria-hidden="true">Добавляем…</span>
    <span class="absolute inset-0 flex items-center justify-center whitespace-nowrap">
      {{ adding ? 'Добавляем…' : added ? 'В корзине' : idle }}
    </span>
  </span>
</template>

<script setup lang="ts">
defineProps<{
  adding: boolean
  added: boolean
  idle: string
}>()
</script>
