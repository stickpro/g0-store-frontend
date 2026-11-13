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

      <button
          type="button"
          class="mt-4 inline-flex h-12 w-full items-center justify-center rounded-full bg-blue-600 px-6 text-[15px] font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          :disabled="downloading || !orderId"
          @click="downloadPdf"
      >
        {{ downloading ? 'Скачиваем…' : 'Скачать счёт' }}
      </button>
      <p v-if="downloadError" class="mt-2 text-[13px] leading-5 text-orange-600">
        {{ downloadError }}
      </p>
      <p v-else class="mt-2 text-[13px] leading-5 text-zinc-500">
        Если файл не открывается, сервис временно недоступен — попробуйте позже.
      </p>
    </template>
  </section>
</template>

<script setup lang="ts">
import type { InvoiceResponse } from '~/repository/types/api/generatedApiGo';
import {
  filenameFromContentDisposition,
  formatOrderDate,
  formatOrderMoney,
  invoiceAccessErrorMessage,
  readApiErrorFromBlob,
  saveBlobAsFile,
} from '~/utils/order';

const props = withDefaults(defineProps<{
  orderId: string;
  compact?: boolean;
}>(), {
  compact: false,
});

const invoice = ref<InvoiceResponse | null>(null);
const loading = ref(false);
const error = ref('');
const downloading = ref(false);
const downloadError = ref('');

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

function httpStatus(caught: unknown) {
  const err = caught as { status?: number; statusCode?: number };
  return err.status ?? err.statusCode;
}

async function loadInvoice() {
  if (!props.orderId) {
    invoice.value = null;
    error.value = 'Не удалось определить заказ для счёта';
    return;
  }

  loading.value = true;
  error.value = '';
  downloadError.value = '';
  const { $api } = useNuxtApp();
  try {
    invoice.value = await $api.order.getInvoice(props.orderId);
  } catch (caught) {
    invoice.value = null;
    error.value = invoiceAccessErrorMessage(httpStatus(caught));
  } finally {
    loading.value = false;
  }
}

async function downloadPdf() {
  if (!props.orderId || downloading.value) return;

  downloading.value = true;
  downloadError.value = '';
  const { $api } = useNuxtApp();
  try {
    const res = await $api.order.downloadInvoicePdf(props.orderId);
    if (!res.ok) {
      const payload = await readApiErrorFromBlob(res.blob);
      downloadError.value = invoiceAccessErrorMessage(payload?.code || res.status);
      return;
    }

    const fromHeader = filenameFromContentDisposition(res.headers.get('content-disposition'));
    const fallback = invoice.value?.number
        ? `invoice-${invoice.value.number}.pdf`
        : `invoice-${props.orderId}.pdf`;
    saveBlobAsFile(res.blob, fromHeader || fallback);
  } catch (caught) {
    downloadError.value = invoiceAccessErrorMessage(httpStatus(caught));
  } finally {
    downloading.value = false;
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
