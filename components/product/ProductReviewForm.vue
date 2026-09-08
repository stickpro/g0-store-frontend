<template>
  <div class="rounded-2xl border border-zinc-200 p-4 lg:p-6">
    <h3 class="text-lg font-medium text-zinc-950">Написать отзыв</h3>

    <div
        v-if="!authStore.isAuthenticated"
        class="mt-4 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between"
    >
      <p class="text-sm leading-6 text-zinc-600">
        Войдите, чтобы оставить отзыв о товаре
      </p>
      <button
          type="button"
          class="h-10 shrink-0 rounded-full bg-blue-600 px-6 text-[15px] font-medium text-white hover:bg-blue-700"
          @click="authStore.openModal()"
      >
        Войти
      </button>
    </div>

    <p v-else-if="submitted" class="mt-4 text-sm leading-6 text-zinc-600">
      {{ successMessage }}
    </p>

    <form v-else class="mt-4 flex flex-col gap-4" @submit.prevent="submit">
      <fieldset>
        <legend class="mb-2 text-[13px] leading-4 text-zinc-500">Оценка</legend>
        <div class="flex items-center gap-1">
          <button
              v-for="star in 5"
              :key="star"
              type="button"
              class="rounded-md p-0.5"
              :aria-label="`Оценка ${star}`"
              @click="rating = star"
              @mouseenter="hoveredRating = star"
              @mouseleave="hoveredRating = 0"
          >
            <svg
                class="h-7 w-7"
                :class="star <= displayedRating ? 'text-orange-500' : 'text-zinc-300'"
                fill="currentColor"
                viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
            </svg>
          </button>
        </div>
      </fieldset>

      <label class="block">
        <span class="mb-1.5 block text-[13px] leading-4 text-zinc-500">Заголовок</span>
        <input
            v-model="title"
            type="text"
            maxlength="120"
            placeholder="Кратко о товаре"
            class="h-12 w-full rounded-full bg-zinc-600/5 px-5 text-[15px] text-zinc-950 outline-none placeholder:text-zinc-400"
        >
      </label>

      <label class="block">
        <span class="mb-1.5 block text-[13px] leading-4 text-zinc-500">Отзыв</span>
        <textarea
            v-model="body"
            required
            rows="4"
            maxlength="4000"
            placeholder="Расскажите о качестве, совместимости и впечатлении"
            class="min-h-28 w-full resize-y rounded-3xl bg-zinc-600/5 px-5 py-3 text-[15px] leading-6 text-zinc-950 outline-none placeholder:text-zinc-400"
        />
      </label>

      <p v-if="error" class="text-[13px] leading-4 text-red-600">{{ error }}</p>

      <button
          type="submit"
          class="h-12 w-full rounded-full bg-orange-500 px-6 text-[15px] font-medium text-white hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          :disabled="submitting || !canSubmit"
      >
        {{ submitting ? 'Отправка...' : 'Отправить отзыв' }}
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth';
import { useProductStore } from '~/stores/product';

const props = defineProps<{
  slug: string;
  variantId?: string;
}>();

const authStore = useAuthStore();
const productStore = useProductStore();

const rating = ref(0);
const hoveredRating = ref(0);
const title = ref('');
const body = ref('');
const submitting = ref(false);
const submitted = ref(false);
const error = ref('');
const successMessage = ref('');

const displayedRating = computed(() => hoveredRating.value || rating.value);
const canSubmit = computed(() => Boolean(props.variantId && rating.value >= 1 && body.value.trim()));

const REVIEW_ERROR_MESSAGES: Record<string, string> = {
  'review: variant was not purchased by this user':
    'Отзыв можно оставить только после покупки этого товара',
};

function translateReviewMessage(message?: string) {
  if (!message) return '';
  const normalized = message.trim().toLowerCase();
  return REVIEW_ERROR_MESSAGES[normalized]
    || Object.entries(REVIEW_ERROR_MESSAGES).find(([key]) => normalized.includes(key))?.[1]
    || message;
}

function extractError(caught: unknown) {
  const err = caught as {
    status?: number;
    statusCode?: number;
    data?: { message?: string; errors?: { message?: string }[] };
    message?: string;
    statusMessage?: string;
  };
  const status = err.status || err.statusCode;
  const field = err.data?.errors?.map((item) => item.message).filter(Boolean).join('. ');
  const message = translateReviewMessage(field || err.data?.message || err.statusMessage);

  if (status === 401) return 'Войдите, чтобы оставить отзыв';
  if (status === 403) return message || 'Нельзя оставить отзыв на этот товар';
  return message || 'Не удалось отправить отзыв';
}

async function submit() {
  if (!authStore.isAuthenticated) {
    authStore.openModal();
    return;
  }
  if (!canSubmit.value || submitting.value) return;

  error.value = '';
  submitting.value = true;

  try {
    const review = await productStore.createReview(props.slug, {
      variant_id: props.variantId,
      rating: rating.value,
      title: title.value.trim() || undefined,
      body: body.value.trim(),
    });

    submitted.value = true;
    successMessage.value = review.status === 'APPROVED'
      ? 'Спасибо, ваш отзыв опубликован'
      : 'Спасибо, отзыв отправлен на модерацию';
  } catch (caught) {
    const status = (caught as { status?: number; statusCode?: number }).status
      || (caught as { statusCode?: number }).statusCode;
    if (status === 401) {
      authStore.openModal();
    }
    error.value = extractError(caught);
  } finally {
    submitting.value = false;
  }
}
</script>
