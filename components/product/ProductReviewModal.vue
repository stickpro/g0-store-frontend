<template>
  <Teleport to="body">
    <div
        v-if="open"
        class="fixed inset-0 z-[80] flex items-start justify-center px-4 pt-[12vh] sm:items-center sm:pt-0"
    >
      <div class="absolute inset-0 bg-black/20 backdrop-blur-[2px]" @click="close"/>

      <div
          class="relative z-10 w-full max-w-[400px] rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="review-modal-title"
      >
        <div class="flex items-start justify-between gap-4">
          <h2 id="review-modal-title" class="text-[22px] leading-8 text-zinc-950">
            Написать отзыв
          </h2>
          <button
              type="button"
              class="flex size-8 shrink-0 items-center justify-center"
              aria-label="Закрыть"
              @click="close"
          >
            <IconXmark/>
          </button>
        </div>

        <ProductReviewForm
            ref="formRef"
            class="mt-4"
            :slug="slug"
            :variant-id="variantId"
            embedded
        />
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import IconXmark from '~/components/icons/IconXmark.vue';
import ProductReviewForm from '~/components/product/ProductReviewForm.vue';

defineProps<{
  slug: string;
  variantId?: string;
}>();

const open = defineModel<boolean>('open', { default: false });
const formRef = ref<{ resetForm: () => void } | null>(null);

function close() {
  open.value = false;
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape' && open.value) {
    close();
  }
}

watch(open, (isOpen) => {
  if (!import.meta.client) return;
  if (isOpen) {
    nextTick(() => formRef.value?.resetForm());
    document.addEventListener('keydown', onKeydown);
  } else {
    document.removeEventListener('keydown', onKeydown);
  }
});

onBeforeUnmount(() => {
  if (!import.meta.client) return;
  document.removeEventListener('keydown', onKeydown);
});
</script>
