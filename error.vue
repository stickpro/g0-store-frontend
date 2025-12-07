<script setup lang="ts">
import type {NuxtError} from '#app'

const props = defineProps({
  error: Object as () => NuxtError
})

const handleError = () => clearError({redirect: '/'})

const is404 = computed(() => props.error?.statusCode === 404)
const errorMessage = computed(() => {
  if (is404.value) {
    return 'Страница не найдена'
  }
  return props.error?.message || 'Произошла ошибка'
})

const errorDescription = computed(() => {
  if (is404.value) {
    return 'Извините, мы не смогли найти нужную вам страницу.'
  }
  return 'Попробуйте вернуться на главную страницу'
})
</script>

<template>
  <NuxtLayout name="empty">
    <div class="w-full">
      <div class="min-h-[60vh] flex items-center justify-center px-4 py-16">
        <div class="max-w-2xl w-full text-center error-container">
          <div class="error-code">
            {{ error?.statusCode || 500 }}
          </div>

          <h1 class="text-3xl font-bold text-zinc-800 mb-4">
            {{ errorMessage }}
          </h1>

          <p class="text-lg text-zinc-600 mb-8">
            {{ errorDescription }}
          </p>

          <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
                @click="handleError"
                class="bg-blue-600 text-white p-3 px-5 rounded-full hover:bg-blue-700 transition-colors"
            >
              Вернуться на главную
            </button>
          </div>

          <div v-if="!is404 && error?.message" class="mt-8 p-4 bg-red-50 border border-red-200 rounded-lg text-left">
            <p class="text-sm text-red-800 font-mono break-words">
              {{ error.message }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<style>

.error-code {
  font-size: clamp(6rem, 15vw, 12rem);
  font-weight: 900;
  background: linear-gradient(135deg, #EA580C 0%, #fa600c 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1;
  margin-bottom: 1rem;
  animation: glitch 3s infinite;
  position: relative;
}

@keyframes fadeInUp {
  0% {
    opacity: 0;
    transform: translateY(30px) scale(0.95);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes glitch {
  0%, 100% {
    transform: translateX(0);
  }
  20% {
    transform: translateX(-2px);
  }
  40% {
    transform: translateX(2px);
  }
  60% {
    transform: translateX(-2px);
  }
  80% {
    transform: translateX(2px);
  }
}
</style>
