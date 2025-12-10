<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
          v-if="isOpen"
          class="fixed inset-0 z-50 flex items-center justify-center bg-black/95"
          @click="close"
      >
        <button
            class="absolute top-4 right-4 z-10 p-2 text-white hover:text-gray-300 transition-colors"
            aria-label="Закрыть"
            @click="close"
        >
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>

        <div class="absolute top-4 left-4 z-10 text-white text-lg">
          {{ currentIndex + 1 }} / {{ images.length }}
        </div>

        <div class="relative w-full h-full flex items-center justify-center p-16" @click.stop>
          <img
              :src="config.public.storageUrl + images[currentIndex]"
              :alt="`Изображение ${currentIndex + 1}`"
              class="max-w-full max-h-full object-contain"
          >
        </div>

        <button
            v-if="images.length > 1"
            class="absolute left-4 top-1/2 -translate-y-1/2 p-3 text-white hover:text-gray-300 transition-colors"
            aria-label="Предыдущее изображение"
            @click.stop="previousImage"
        >
          <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
          </svg>
        </button>

        <button
            v-if="images.length > 1"
            class="absolute right-4 top-1/2 -translate-y-1/2 p-3 text-white hover:text-gray-300 transition-colors"
            aria-label="Следующее изображение"
            @click.stop="nextImage"
        >
          <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
          </svg>
        </button>

        <div
            v-if="images.length > 1"
            class="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 max-w-4xl overflow-x-auto px-4"
        >
          <button
              v-for="(image, index) in images"
              :key="index"
              :class="[
                'flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all',
                currentIndex === index ? 'border-orange-500' : 'border-white/30 hover:border-white/60'
              ]"
              @click.stop="currentIndex = index"
          >
            <img
                :src="config.public.storageUrl + image"
                :alt="`Миниатюра ${index + 1}`"
                class="w-full h-full object-cover"
            >
          </button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
const props = defineProps<{
  isOpen: boolean
  images: string[]
  initialIndex?: number
}>()

const emit = defineEmits<{
  close: []
}>()

const config = useRuntimeConfig()
const currentIndex = ref(props.initialIndex || 0)

// Навигация
const nextImage = () => {
  currentIndex.value = (currentIndex.value + 1) % props.images.length
}

const previousImage = () => {
  currentIndex.value = currentIndex.value === 0 ? props.images.length - 1 : currentIndex.value - 1
}

const close = () => {
  emit('close')
}

// Обработка клавиш
const handleKeydown = (e: KeyboardEvent) => {
  if (!props.isOpen) return

  switch (e.key) {
    case 'Escape':
      close()
      break
    case 'ArrowLeft':
      previousImage()
      break
    case 'ArrowRight':
      nextImage()
      break
  }
}

// Блокировка скролла body при открытой модалке
watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    document.body.style.overflow = 'hidden'
    currentIndex.value = props.initialIndex || 0
  } else {
    document.body.style.overflow = ''
  }
})

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
  document.body.style.overflow = ''
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
