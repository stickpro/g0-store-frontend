<template>
  <section :class="sectionClass">
    <h2 :class="titleClass">Счёт на оплату</h2>

    <p v-if="loading" class="mt-3 text-[15px] leading-6 text-zinc-500">
      Загружаем счёт…
    </p>
    <p v-else-if="error" class="mt-3 text-[15px] leading-6 text-orange-600">
      {{ error }}
    </p>
    <template v-else-if="invoice">
      <dl class="mt-3 space-y-3 text-[15px] leading-6">
        <div class="flex items-start justify-between gap-4">
          <dt class="text-zinc-500">Номер счёта</dt>
          <dd class="font-medium text-zinc-950">{{ invoice.number || '—' }}</dd>
        </div>
        <div class="flex items-start justify-between gap-4">
          <dt class="text-zinc-500">Сумма</dt>
          <dd class="font-medium text-zinc-950">{{ formatOrderMoney(invoice.amount) }}</dd>
        </div>
        <div v-if="invoice.due_at" class="flex items-start justify-between gap-4">
          <dt class="text-zinc-500">Срок оплаты</dt>
          <dd class="text-right font-medium text-zinc-950">{{ formatOrderDate(invoice.due_at) }}</dd>
        </div>
      </dl>

      <p class="mt-4 text-[13px] leading-5 text-zinc-600">
        При оплате укажите номер счёта
        <span v-if="invoice.number" class="font-medium text-zinc-950">{{ invoice.number }}</span>
        в назначении платежа.
      </p>

      <a
          v-if="pdfUrl"
          :href="pdfUrl"
          target="_blank"
          rel="noopener"
          class="mt-4 inline-flex h-12 w-full items-center justify-center rounded-full bg-blue-600 px-6 text-[15px] font-medium text-white hover:bg-blue-700"
      >
        Скачать счёт
      </a>
      <p class="mt-2 text-[13px] leading-5 text-zinc-500">
        Если файл не открывается, сервис временно недоступен — попробуйте позже.
      </p>
    </template>
  </section>
</template>

<script setup lang="ts">
import type { InvoiceResponse } from '~/repository/types/api/generatedApiGo';
import { formatOrderDate, formatOrderMoney, orderInvoicePdfUrl } from '~/utils/order';

const props = withDefaults(defineProps<{
  orderId: string;
  compact?: boolean;
}>(), {
  compact: false,
});

const config = useRuntimeConfig();
const invoice = ref<InvoiceResponse | null>(null);
const loading = ref(false);
const error = ref('');

const sectionClass = computed(() =>
    props.compact
        ? 'rounded-3xl border border-dashed border-zinc-600/15 px-4 py-5 lg:px-6'
        : 'mt-6 w-full overflow-hidden rounded-[28px] border border-blue-600/15 bg-blue-50/60 px-6 py-6 text-left shadow-[0_20px_60px_rgba(24,24,27,0.04)]',
);

const titleClass = computed(() =>
    props.compact
        ? 'text-[17px] leading-6 text-zinc-950'
        : 'text-[17px] font-medium leading-6 text-zinc-950',
);

const pdfUrl = computed(() => {
  if (!props.orderId) return '';
  return orderInvoicePdfUrl(String(config.public.apiUrl), props.orderId);
});

async function loadInvoice() {
  if (!props.orderId) {
    invoice.value = null;
    error.value = 'Не удалось определить заказ для счёта';
    return;
  }

  loading.value = true;
  error.value = '';
  const { $api } = useNuxtApp();
  try {
    invoice.value = await $api.order.getInvoice(props.orderId);
  } catch {
    invoice.value = null;
    error.value = 'Не удалось загрузить счёт. Обновите страницу или попробуйте позже.';
  } finally {
    loading.value = false;
  }
}

watch(
    () => props.orderId,
    () => {
      void loadInvoice();
    },
    { immediate: true },
);

defineExpose({ reload: loadInvoice });
</script>
