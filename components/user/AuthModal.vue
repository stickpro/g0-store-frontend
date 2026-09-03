<template>
  <Teleport to="body">
    <div
        v-if="authStore.isModalOpen"
        class="fixed inset-0 z-[80] flex items-start justify-center px-4 pt-[12vh] sm:items-center sm:pt-0"
    >
      <div class="absolute inset-0 bg-black/20 backdrop-blur-[2px]" @click="authStore.closeModal()"/>

      <div
          class="relative z-10 w-full max-w-[360px] rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm"
          role="dialog"
          aria-modal="true"
          :aria-label="authStore.isAuthenticated ? 'Профиль' : 'Авторизация'"
      >
        <button
            type="button"
            class="ml-auto flex size-8 shrink-0 items-center justify-center"
            aria-label="Закрыть"
            @click="authStore.closeModal()"
        >
          <IconXmark/>
        </button>

        <div v-if="authStore.isAuthenticated" class="pt-2">
          <p class="text-[13px] leading-4 text-zinc-500">Почта</p>
          <p class="mt-2 truncate text-[15px] text-zinc-950">{{ authStore.user?.email }}</p>
          <div class="mt-6 -mx-6 border-t border-zinc-200">
            <button
                type="button"
                class="flex h-12 w-full items-center justify-center text-[17px] text-blue-600"
                @click="authStore.logout()"
            >
              Выйти
            </button>
          </div>
        </div>

        <form v-else class="mt-4 flex flex-col" @submit.prevent="submit">
          <div class="flex h-10 rounded-full bg-zinc-100 p-0.5">
            <button
                v-for="item in tabs"
                :key="item.id"
                type="button"
                class="h-9 flex-1 rounded-full text-[15px] leading-4 transition-colors"
                :class="authStore.tab === item.id ? 'bg-zinc-50 text-zinc-950' : 'text-zinc-500'"
                @click="authStore.setTab(item.id)"
            >
              {{ item.label }}
            </button>
          </div>

          <p class="mt-3 mb-5 text-center text-[12px] leading-4 text-zinc-400">
            {{ hint }}
          </p>

          <label v-if="authStore.step === 'email'" class="block">
            <span class="mb-1.5 block px-1 text-[13px] leading-4 text-zinc-500">Почта</span>
            <input
                v-model="email"
                type="email"
                autocomplete="email"
                required
                placeholder="name@mail.ru"
                class="h-12 w-full rounded-full bg-zinc-600/5 px-5 text-[15px] text-zinc-950 outline-none placeholder:text-zinc-400"
            >
          </label>

          <div v-else>
            <span class="mb-1.5 block px-1 text-[13px] leading-4 text-zinc-500">Код</span>
            <div class="flex gap-1.5">
              <input
                  v-for="(digit, index) in digits"
                  :key="index"
                  :ref="(el) => setCodeRef(el, index)"
                  :value="digit"
                  type="text"
                  inputmode="numeric"
                  maxlength="1"
                  :autocomplete="index === 0 ? 'one-time-code' : 'off'"
                  :aria-label="`Цифра кода ${index + 1}`"
                  class="h-12 min-w-0 flex-1 rounded-2xl bg-zinc-600/5 text-center text-[20px] text-zinc-950 outline-none focus:bg-zinc-600/10"
                  @input="onDigitInput(index, $event)"
                  @keydown="onDigitKeydown(index, $event)"
                  @paste="onDigitPaste"
                  @focus="onDigitFocus(index, $event)"
              >
            </div>
            <div class="mt-2 flex items-center justify-between gap-3 px-1 text-[13px] leading-4">
              <button
                  type="button"
                  class="text-zinc-400 hover:text-zinc-950"
                  @click="changeEmail"
              >
                Изменить почту
              </button>
              <button
                  type="button"
                  class="text-blue-600 disabled:text-zinc-400"
                  :disabled="authStore.loading || resendIn > 0"
                  @click="resendCode"
              >
                {{ resendIn > 0 ? `Ещё раз через ${resendIn} с` : 'Отправить ещё раз' }}
              </button>
            </div>
          </div>

          <p v-if="authStore.error" class="mt-4 text-[13px] leading-4 text-red-600">
            {{ authStore.error }}
          </p>

          <div class="-mx-6 mt-5 border-t border-zinc-200">
            <button
                type="submit"
                class="flex h-12 w-full items-center justify-center text-[17px] text-blue-600 disabled:opacity-60"
                :disabled="authStore.loading || (authStore.step === 'code' && code.length < CODE_LENGTH)"
            >
              {{ submitLabel }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import IconXmark from '~/components/icons/IconXmark.vue';
import { useAuthStore } from '~/stores/auth';

const CODE_LENGTH = 6;
const RESEND_SECONDS = 60;

const authStore = useAuthStore();
const email = ref('');
const digits = ref<string[]>(Array.from({ length: CODE_LENGTH }, () => ''));
const codeInputs = ref<HTMLInputElement[]>([]);
const resendIn = ref(0);
let resendTimer: ReturnType<typeof setInterval> | null = null;

const code = computed(() => digits.value.join(''));

const tabs = [
  { id: 'login' as const, label: 'Вход' },
  { id: 'register' as const, label: 'Регистрация' },
];

const hint = computed(() => {
  if (authStore.step === 'code') {
    return authStore.tab === 'register'
      ? 'Осталось ввести код из письма'
      : 'Код уже в письме — введите его ниже';
  }

  return authStore.tab === 'register'
    ? 'Пришлём код и создадим аккаунт'
    : 'Войти можно по коду из письма';
});

const submitLabel = computed(() => {
  if (authStore.loading) return 'Подождите...';
  if (authStore.step === 'code') {
    return authStore.tab === 'register' ? 'Зарегистрироваться' : 'Войти';
  }
  return 'Получить код';
});

function startResendTimer() {
  resendIn.value = RESEND_SECONDS;
  if (resendTimer) clearInterval(resendTimer);
  resendTimer = setInterval(() => {
    resendIn.value -= 1;
    if (resendIn.value <= 0 && resendTimer) {
      clearInterval(resendTimer);
      resendTimer = null;
    }
  }, 1000);
}

function stopResendTimer() {
  if (resendTimer) {
    clearInterval(resendTimer);
    resendTimer = null;
  }
  resendIn.value = 0;
}

function resetCode() {
  digits.value = Array.from({ length: CODE_LENGTH }, () => '');
}

function setCodeRef(el: unknown, index: number) {
  if (el instanceof HTMLInputElement) {
    codeInputs.value[index] = el;
  }
}

function focusDigit(index: number) {
  const next = Math.min(Math.max(index, 0), CODE_LENGTH - 1);
  codeInputs.value[next]?.focus();
  codeInputs.value[next]?.select();
}

function fillCode(value: string) {
  const next = value.replace(/\D/g, '').slice(0, CODE_LENGTH).split('');
  digits.value = Array.from({ length: CODE_LENGTH }, (_, index) => next[index] || '');
}

function onDigitInput(index: number, event: Event) {
  const input = event.target as HTMLInputElement;
  const char = input.value.replace(/\D/g, '').slice(-1);
  const next = [...digits.value];
  next[index] = char;
  digits.value = next;
  input.value = char;
  if (char && index < CODE_LENGTH - 1) {
    focusDigit(index + 1);
  }
}

function onDigitKeydown(index: number, event: KeyboardEvent) {
  if (event.key === 'Backspace') {
    event.preventDefault();
    const next = [...digits.value];
    if (next[index]) {
      next[index] = '';
      digits.value = next;
      return;
    }
    if (index > 0) {
      next[index - 1] = '';
      digits.value = next;
      focusDigit(index - 1);
    }
    return;
  }

  if (event.key === 'ArrowLeft') {
    event.preventDefault();
    focusDigit(index - 1);
    return;
  }

  if (event.key === 'ArrowRight') {
    event.preventDefault();
    focusDigit(index + 1);
  }
}

function onDigitPaste(event: ClipboardEvent) {
  event.preventDefault();
  fillCode(event.clipboardData?.getData('text') || '');
  const filled = digits.value.filter(Boolean).length;
  focusDigit(Math.min(filled, CODE_LENGTH - 1));
}

function onDigitFocus(index: number, event: FocusEvent) {
  (event.target as HTMLInputElement).select();
  if (!digits.value[index]) {
    const firstEmpty = digits.value.findIndex((digit) => !digit);
    if (firstEmpty >= 0 && firstEmpty < index) {
      focusDigit(firstEmpty);
    }
  }
}

function changeEmail() {
  authStore.backToEmail();
  resetCode();
  stopResendTimer();
}

async function submit() {
  try {
    if (authStore.step === 'email') {
      await authStore.requestCode(email.value.trim());
      resetCode();
      startResendTimer();
      await nextTick();
      focusDigit(0);
      return;
    }

    if (code.value.length < CODE_LENGTH) return;
    await authStore.verifyCode(code.value);
  } catch {
    // сообщение уже в сторе
  }
}

async function resendCode() {
  if (resendIn.value > 0) return;
  try {
    await authStore.requestCode(email.value.trim());
    resetCode();
    startResendTimer();
    await nextTick();
    focusDigit(0);
  } catch {
    // сообщение уже в сторе
  }
}

watch(() => authStore.isModalOpen, (open) => {
  if (!open) {
    resetCode();
    stopResendTimer();
    return;
  }
  email.value = authStore.email;
});

watch(() => authStore.step, (step) => {
  if (step === 'email') {
    resetCode();
  }
});

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape' && authStore.isModalOpen) {
    authStore.closeModal();
  }
}

onMounted(() => {
  window.addEventListener('keydown', onKeydown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', onKeydown);
  stopResendTimer();
});
</script>
