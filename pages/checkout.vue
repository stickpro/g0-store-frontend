<template>
  <div
      v-if="cartPending && cartStore.isEmpty"
      class="relative flex min-h-[calc(100vh-5rem)] items-center justify-center overflow-hidden px-4 py-10"
  >
    <div class="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
      <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_#eff6ff_0%,_#ffffff_55%,_#fff7ed_100%)]"/>
    </div>
    <p class="text-[15px] leading-6 text-zinc-500">Загрузка корзины…</p>
  </div>

  <div
      v-else-if="cartStore.isEmpty"
      class="relative min-h-[calc(100vh-5rem)] overflow-hidden px-4 py-10 lg:px-6 lg:py-16"
  >
    <div class="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
      <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_#eff6ff_0%,_#ffffff_55%,_#fff7ed_100%)]"/>
      <div class="empty-orb empty-orb--blue absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-blue-500/15 blur-3xl"/>
      <div class="empty-orb empty-orb--orange absolute bottom-0 right-0 h-64 w-64 rounded-full bg-orange-400/20 blur-3xl"/>
    </div>

    <div class="mx-auto flex w-full max-w-xl flex-col items-center text-center">
      <div class="empty-mark relative mb-8 flex size-24 items-center justify-center">
        <span class="absolute inset-0 rounded-full bg-orange-500/10"/>
        <span class="absolute inset-2 rounded-full bg-orange-500/15"/>
        <span class="relative flex size-16 items-center justify-center rounded-full bg-orange-500 text-white shadow-[0_12px_40px_rgba(249,115,22,0.35)]">
          <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              class="size-8"
              aria-hidden="true"
          >
            <path
                d="M6.5 8h11l-.8 9.2a2 2 0 0 1-2 1.8H9.3a2 2 0 0 1-2-1.8L6.5 8Z"
                stroke="currentColor"
                stroke-width="1.8"
                stroke-linejoin="round"
            />
            <path
                d="M9 8V6.8A3 3 0 0 1 12 3.8v0a3 3 0 0 1 3 3V8"
                stroke="currentColor"
                stroke-width="1.8"
                stroke-linecap="round"
            />
            <path
                d="M9.5 12.5h5"
                stroke="currentColor"
                stroke-width="1.8"
                stroke-linecap="round"
            />
          </svg>
        </span>
      </div>

      <p class="text-[13px] uppercase tracking-[0.18em] text-orange-600/80">
        Корзина пуста
      </p>
      <h1 class="mt-3 text-[32px] font-normal leading-10 text-zinc-950 lg:text-[40px] lg:leading-[48px]">
        Нечего оформлять
      </h1>
      <p class="mt-4 max-w-md text-[15px] leading-6 text-zinc-600">
        В корзине нет товаров для оформления заказа. Добавьте что‑нибудь из каталога — и можно будет перейти к доставке и оплате.
      </p>

      <div class="mt-10 flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
        <NuxtLink
            to="/"
            class="inline-flex h-12 items-center justify-center rounded-full bg-blue-600 px-6 text-[15px] font-medium text-white hover:bg-blue-700"
        >
          К покупкам
        </NuxtLink>
        <NuxtLink
            to="/cart"
            class="inline-flex h-12 items-center justify-center rounded-full border border-zinc-600/20 bg-white/70 px-6 text-[15px] font-medium text-zinc-950 hover:bg-white"
        >
          Открыть корзину
        </NuxtLink>
      </div>
    </div>
  </div>

  <div v-else class="flex w-full min-h-[calc(100vh-5rem)]">
    <div class="min-w-0 flex-1 px-4 pt-4 pb-36 lg:px-0 lg:pt-6 lg:pr-6 lg:pb-24">
      <div class="flex items-center gap-6">
        <h1 class="min-w-0 flex-1 text-[28px] font-normal leading-[45px] text-zinc-950">
          Оформление заказа
        </h1>
        <NuxtLink
            to="/cart"
            class="flex shrink-0 items-center gap-2 text-[15px] leading-6 text-zinc-950"
        >
          <span>Корзина</span>
          <span class="flex size-10 items-center justify-center rounded-full border border-zinc-600">
            <IconEdit class="size-5"/>
          </span>
        </NuxtLink>
      </div>

      <div
          v-if="!authStore.isAuthenticated"
          class="mt-6 flex min-h-12 flex-col items-stretch gap-2 rounded-3xl bg-blue-600/5 px-4 py-2 sm:h-12 sm:flex-row sm:items-center sm:justify-between sm:rounded-full sm:py-0 sm:pr-1"
      >
        <p class="text-[15px] leading-6 text-blue-700">
          Войдите, чтобы быстрее оформить заказ
        </p>
        <button
            type="button"
            class="h-10 shrink-0 rounded-full bg-blue-600 px-6 text-[15px] font-medium text-white hover:bg-blue-700"
            @click="authStore.openModal()"
        >
          Войти
        </button>
      </div>

      <div class="mt-4 flex min-h-12 flex-col items-stretch gap-2 rounded-3xl bg-orange-500/5 px-4 py-2 sm:mt-6 sm:h-12 sm:flex-row sm:items-center sm:justify-between sm:rounded-full sm:py-0 sm:pr-1">
        <p class="text-[15px] leading-6 text-orange-600">
          Хотите заполнить форму по шаблону?
        </p>
        <button
            type="button"
            class="h-10 rounded-full bg-orange-500 px-6 text-[15px] font-medium text-zinc-50"
            disabled
        >
          Выбрать
        </button>
      </div>

      <div class="mt-6">
        <p class="flex h-12 items-center px-3 text-[15px] leading-6 text-zinc-950">
          Контактная информация
        </p>

        <div class="relative pt-2">
          <div class="pointer-events-none absolute top-7 bottom-7 left-[19px] w-px bg-orange-500"/>

          <div class="flex flex-col gap-12">
            <section class="grid grid-cols-[40px_minmax(0,1fr)] items-start gap-x-3 lg:grid-cols-[40px_minmax(0,1fr)_minmax(0,1fr)] lg:gap-x-6">
              <span class="relative z-10 flex size-10 items-center justify-center rounded-full border border-orange-500 bg-white text-[15px] text-orange-500">
                1
              </span>
              <h2 class="flex h-10 items-center text-[15px] leading-6 text-orange-600">
                Данные покупателя
              </h2>
              <div class="col-start-2 flex flex-col gap-6 lg:col-start-3">
                <div class="flex h-10 rounded-full bg-zinc-100 p-0.5">
                  <button
                      v-for="item in buyerTypes"
                      :key="item.id"
                      type="button"
                      class="h-9 flex-1 rounded-full text-[15px] leading-4 transition-colors"
                      :class="buyerType === item.id ? 'bg-zinc-50 text-zinc-950' : 'text-zinc-500'"
                      @click="buyerType = item.id"
                  >
                    {{ item.label }}
                  </button>
                </div>

                <div v-if="buyerType === 'legal'" class="flex flex-col gap-3">
                  <CheckoutField v-model="orgName" label="*Организация"/>
                  <CheckoutField v-model="inn" label="*ИНН"/>
                </div>

                <CheckoutField v-model="buyerName" label="*ФИО" autocomplete="name"/>
                <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <CheckoutField
                      v-model="phone"
                      label="*Телефон"
                      type="tel"
                      autocomplete="tel"
                      inputmode="tel"
                      mask="phone"
                      placeholder="+7 (___) ___-__-__"
                  />
                  <CheckoutField v-model="email" label="*Почта" type="email" autocomplete="email"/>
                </div>
              </div>
            </section>

            <section class="grid grid-cols-[40px_minmax(0,1fr)] items-start gap-x-3 lg:grid-cols-[40px_minmax(0,1fr)_minmax(0,1fr)] lg:gap-x-6">
              <span class="relative z-10 flex size-10 items-center justify-center rounded-full border border-orange-500 bg-white text-[15px] text-orange-500">
                2
              </span>
              <h2 class="flex h-10 items-center text-[15px] leading-6 text-orange-600">
                Данные грузополучателя
              </h2>
              <div class="col-start-2 flex flex-col gap-3 lg:col-start-3">
                <button
                    type="button"
                    class="flex h-10 w-full items-center justify-between rounded-full bg-zinc-600/5 px-4 text-left text-[15px] text-zinc-950"
                    @click="sameRecipient = !sameRecipient"
                >
                  <span>Как у получателя</span>
                  <span
                      class="flex size-5 items-center justify-center"
                      :class="sameRecipient ? 'text-green-600' : 'text-zinc-300'"
                      aria-hidden="true"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="10" viewBox="0 0 20 10" fill="none">
                      <rect width="20" height="10" rx="5" fill="currentColor"/>
                      <circle :cx="sameRecipient ? 15 : 5" cy="5" r="4" fill="white"/>
                    </svg>
                  </span>
                </button>
                <CheckoutField
                    v-if="!sameRecipient"
                    v-model="recipientName"
                    label="*ФИО грузополучателя"
                />
              </div>
            </section>

            <section class="flex flex-col gap-6">
              <div class="grid grid-cols-[40px_minmax(0,1fr)] items-start gap-x-3 lg:grid-cols-[40px_minmax(0,1fr)_minmax(0,1fr)] lg:gap-x-6">
                <span class="relative z-10 flex size-10 items-center justify-center rounded-full border border-orange-500 bg-white text-[15px] text-orange-500">
                  3
                </span>
                <h2 class="flex h-10 items-center text-[15px] leading-6 text-orange-600">
                  Выберите способ получения
                </h2>
                <div class="col-start-2 flex flex-wrap gap-2 lg:col-start-3">
                  <button
                      v-for="method in deliveryMethods"
                      :key="method.code"
                      type="button"
                      class="h-10 rounded-full px-4 text-[15px]"
                      :class="shippingMethod === method.code
                        ? 'bg-zinc-950 text-zinc-50'
                        : 'border border-zinc-600/15 text-zinc-950'"
                      @click="selectShipping(method.code!)"
                  >
                    {{ methodTitle(method) }}
                  </button>
                </div>
                <p
                    v-if="methodsError"
                    class="col-span-full mt-2 px-1 text-[13px] leading-4 text-orange-600 lg:col-start-2"
                >
                  {{ methodsError }}
                </p>
              </div>

              <div class="grid grid-cols-[40px_minmax(0,1fr)] gap-x-3 lg:gap-x-6">
                <div aria-hidden="true"/>
                <div class="min-w-0">
                  <template v-if="isSelfPickup">
                    <p class="mb-3 px-1 text-[15px] leading-6 text-zinc-950">
                      {{ STORE_PICKUP.address }}
                    </p>
                    <CheckoutPickupMap/>
                  </template>

                  <CheckoutDeliveryMap
                      v-else-if="pointsMapUi"
                      :key="pointsMapUi.provider"
                      v-model="selectedPoint"
                      :provider="pointsMapUi.provider"
                      :provider-label="pointsMapUi.label"
                      :icon-src="pointsMapUi.iconSrc"
                      :cluster-class="pointsMapUi.clusterClass"
                  />

                  <div v-else-if="isCourier" class="flex flex-col gap-3">
                    <CheckoutCitySelect/>
                    <CheckoutAddressSuggest v-model="courierAddress"/>
                  </div>

                  <p
                      v-if="deliveryEta"
                      class="mt-3 px-1 text-[15px] leading-6 text-zinc-600"
                  >
                    {{ deliveryEta }}
                  </p>
                  <p
                      v-if="quoteError"
                      class="mt-2 px-1 text-[13px] leading-4 text-orange-600"
                  >
                    {{ quoteError }}
                  </p>
                </div>
              </div>
            </section>

            <section class="grid grid-cols-[40px_minmax(0,1fr)] items-start gap-x-3 lg:grid-cols-[40px_minmax(0,1fr)_minmax(0,1fr)] lg:gap-x-6">
              <span class="relative z-10 flex size-10 items-center justify-center rounded-full border border-orange-500 bg-white text-[15px] text-orange-500">
                4
              </span>
              <h2 class="flex h-10 items-center text-[15px] leading-6 text-orange-600">
                Выберите способ оплаты
              </h2>
              <div class="col-start-2 flex flex-wrap justify-end gap-2 lg:col-start-3">
                <button
                    v-for="method in paymentMethods"
                    :key="method.id"
                    type="button"
                    class="h-10 rounded-full px-4 text-[15px]"
                    :class="paymentMethod === method.id
                      ? 'bg-zinc-950 text-zinc-50'
                      : 'border border-zinc-600/15 text-zinc-950'"
                    @click="paymentMethod = method.id"
                >
                  {{ method.label }}
                </button>
              </div>
              <p
                  v-if="!paymentMethod"
                  class="col-span-full mt-2 flex h-10 items-center rounded-full bg-orange-500/5 px-4 text-[15px] leading-6 text-orange-600 lg:col-start-2"
              >
                Пожалуйста, заполните все обязательные поля на предыдущих шагах!
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>

    <aside
        class="hidden min-h-[calc(100vh-5rem)] w-[304px] shrink-0 flex-col border-l border-dashed border-zinc-600/15 bg-[#eff6ff] lg:flex"
    >
      <OrderSummary
          layout="desktop"
          :item-count="summaryItemCount"
          :total="orderTotal"
          :delivery-label="deliveryLabel"
      >
        <template #actions>
          <button
              type="button"
              class="h-12 w-full rounded-full bg-blue-600 text-[15px] font-medium text-white hover:bg-blue-700 disabled:opacity-50"
              :disabled="submitting"
              @click="submitOrder"
          >
            {{ submitting ? 'Отправка…' : 'Заказ подтверждаю' }}
          </button>
          <p v-if="submitError" class="text-[13px] leading-4 text-orange-600">
            {{ submitError }}
          </p>
        </template>
        <template #legal>
          <div class="space-y-2 text-[13px] leading-[21px] text-zinc-950">
            <p>Подтверждая заказ, я принимаю условия:</p>
            <NuxtLink to="/privacy" class="block underline underline-offset-2">
              положения о сборе и защите персональных данных
            </NuxtLink>
            <NuxtLink to="/terms" class="block underline underline-offset-2">
              пользовательского соглашения
            </NuxtLink>
          </div>
        </template>
      </OrderSummary>
    </aside>

    <OrderSummarySheet
        v-model:expanded="sheetOpen"
        :total="orderTotal"
        panel-class="bg-[#eff6ff]"
    >
      <template #collapsed-action>
        <button
            type="button"
            class="flex h-12 shrink-0 items-center justify-center rounded-full bg-blue-600 px-5 text-[15px] font-medium text-white disabled:opacity-50"
            :disabled="submitting"
            @click="submitOrder"
        >
          {{ submitting ? 'Отправка…' : 'Подтвердить' }}
        </button>
      </template>
      <OrderSummary
          layout="sheet"
          :item-count="summaryItemCount"
          :total="orderTotal"
          :delivery-label="deliveryLabel"
      >
        <template #actions>
          <button
              type="button"
              class="h-12 w-full rounded-full bg-blue-600 text-[15px] font-medium text-white disabled:opacity-50"
              :disabled="submitting"
              @click="submitOrder"
          >
            {{ submitting ? 'Отправка…' : 'Заказ подтверждаю' }}
          </button>
          <p v-if="submitError" class="text-[13px] leading-4 text-orange-600">
            {{ submitError }}
          </p>
        </template>
        <template #legal>
          <div class="space-y-2 pb-2 text-[13px] leading-[21px] text-zinc-950">
            <p>Подтверждая заказ, я принимаю условия:</p>
            <NuxtLink to="/privacy" class="block underline underline-offset-2">
              положения о сборе и защите персональных данных
            </NuxtLink>
            <NuxtLink to="/terms" class="block underline underline-offset-2">
              пользовательского соглашения
            </NuxtLink>
          </div>
        </template>
      </OrderSummary>
    </OrderSummarySheet>
  </div>
</template>

<script setup lang="ts">
import IconEdit from '~/components/icons/IconEdit.vue';
import CheckoutField from '~/components/checkout/CheckoutField.vue';
import CheckoutCitySelect from '~/components/checkout/CheckoutCitySelect.vue';
import CheckoutAddressSuggest from '~/components/checkout/CheckoutAddressSuggest.vue';
import CheckoutPickupMap from '~/components/checkout/CheckoutPickupMap.vue';
import CheckoutDeliveryMap from '~/components/checkout/CheckoutDeliveryMap.vue';
import OrderSummary from '~/components/cart/OrderSummary.vue';
import OrderSummarySheet from '~/components/cart/OrderSummarySheet.vue';
import { STORE_PICKUP, isStorePickupCity } from '~/utils/constants/pickup';
import { useDebounceFn } from '@vueuse/core';
import type {
  CheckoutPreviewRequest,
  CheckoutPreviewResponse,
  CreateOrderRequest,
  DeliveryMethodResponse,
  DeliveryPointResponse,
  OrderResponse,
} from '~/repository/types/api/generatedApiGo';
import { useAuthStore } from '~/stores/auth';
import { useCartStore } from '~/stores/cart';
import { useGeoStore } from '~/stores/geo';
import { deliveryPointAddress } from '~/utils/deliveryPoint';
import { parseVariantPrice } from '~/utils/mappers/shortProduct';
import { formatOrderMoney, formatShippingEta, orderSuccessPath, shippingMethodLabel } from '~/utils/order';
import { isCompletePhoneRu } from '~/utils/phoneMask';
import { formatMoneyAmount } from '~/utils/shippingRate';

definePageMeta({
  layout: 'cart',
});

type ProviderMapUi = {
  provider: string;
  label: string;
  iconSrc: string;
  clusterClass: string;
  commentPrefix: string;
};

const PROVIDER_MAP_UI: Record<string, Omit<ProviderMapUi, 'provider'>> = {
  cdek: {
    label: 'СДЭК',
    iconSrc: '/icons/cdek_point.svg',
    clusterClass: 'bg-[#1AB248]',
    commentPrefix: 'СДЭК ПВЗ',
  },
  pochta: {
    label: 'Почты России',
    iconSrc: '/icons/pochta_point.svg',
    clusterClass: 'bg-[#1928DC]',
    commentPrefix: 'Почта России ПВЗ',
  },
  yandex_delivery: {
    label: 'Яндекс Доставки',
    iconSrc: '/icons/yandex_point.svg',
    clusterClass: 'bg-[#FC3F1D]',
    commentPrefix: 'Яндекс ПВЗ',
  },
};

const buyerTypes = [
  { id: 'person' as const, label: 'Физическое лицо' },
  { id: 'legal' as const, label: 'Юридическое лицо' },
];

const paymentMethods = [
  { id: 'card' as const, label: 'Банковская карта' },
  { id: 'invoice' as const, label: 'По счёту' },
  { id: 'cash' as const, label: 'При получении' },
];

const cartStore = useCartStore();
const authStore = useAuthStore();
const geoStore = useGeoStore();

const buyerType = ref<'person' | 'legal'>('person');
const buyerName = ref('');
const orgName = ref('');
const inn = ref('');
const phone = ref('');
const email = ref('');
const sameRecipient = ref(true);
const recipientName = ref('');
const shippingMethod = ref('');
const courierAddress = ref('');
const selectedPoint = ref<DeliveryPointResponse | null>(null);
const paymentMethod = ref('');
const submitting = ref(false);
const submitError = ref('');
const sheetOpen = ref(false);
const preview = ref<CheckoutPreviewResponse | null>(null);
const quoteLoading = ref(false);
const quoteError = ref('');
let quoteRequestId = 0;

const { data: checkoutInit, pending: cartPending } = await useAsyncData('checkout-init', async () => {
  const { $api } = useNuxtApp();
  await cartStore.loadCart();
  if (cartStore.isEmpty) {
    return {
      methods: [] as DeliveryMethodResponse[],
      methodsError: '',
    };
  }
  try {
    const methods = await $api.delivery.getMethods();
    return {
      methods: methods.filter((method) => Boolean(method.code) && method.enabled !== false),
      methodsError: '',
    };
  } catch {
    return {
      methods: [] as DeliveryMethodResponse[],
      methodsError: 'Не удалось загрузить способы доставки',
    };
  }
});

const deliveryMethods = computed(() => checkoutInit.value?.methods ?? []);
const methodsError = computed(() => checkoutInit.value?.methodsError || '');

const activeMethod = computed(() =>
    deliveryMethods.value.find((method) => method.code === shippingMethod.value) || null,
);

const isSelfPickup = computed(() => activeMethod.value?.kind === 'self_pickup');
const isCourier = computed(() => activeMethod.value?.kind === 'courier');
const needsPoints = computed(() => Boolean(activeMethod.value?.has_points));

const pointsMapUi = computed((): ProviderMapUi | null => {
  const method = activeMethod.value;
  if (!method?.has_points || !method.provider) return null;
  const ui = PROVIDER_MAP_UI[method.provider] || {
    label: methodTitle(method),
    iconSrc: '/icons/cdek_point.svg',
    clusterClass: 'bg-zinc-600',
    commentPrefix: 'ПВЗ',
  };
  return { provider: method.provider, ...ui };
});

const shipAddress = computed(() => {
  if (isSelfPickup.value) return STORE_PICKUP.address;
  if (isCourier.value) return courierAddress.value.trim();
  if (needsPoints.value) return pointShipAddress(selectedPoint.value);
  return '';
});

const shippingCost = computed(() => parseVariantPrice(preview.value?.shipping_total));

const orderTotal = computed(() => {
  return parseVariantPrice(preview.value?.grand_total) ?? cartStore.totalPrice;
});

const summaryItemCount = computed(() => {
  return preview.value?.item_count ?? cartStore.itemCount;
});

const deliveryEta = computed(() => {
  const shipping = preview.value?.shipping;
  return formatShippingEta(shipping?.min_days, shipping?.max_days);
});

if (!shippingMethod.value || !deliveryMethods.value.some((method) => method.code === shippingMethod.value)) {
  shippingMethod.value = pickDefaultMethod(deliveryMethods.value) || '';
}

function methodTitle(method: DeliveryMethodResponse) {
  return method.title?.trim() || shippingMethodLabel(method.code) || method.code || '';
}

function pickDefaultMethod(methods: DeliveryMethodResponse[]) {
  const pickupCity = isStorePickupCity(geoStore.geo.cityData)
      || (!geoStore.geo.cityData && /петербург/i.test(geoStore.geo.city));
  if (pickupCity) {
    const pickup = methods.find((method) => method.kind === 'self_pickup');
    if (pickup?.code) return pickup.code;
  }
  const withPoints = methods.find((method) => method.has_points);
  if (withPoints?.code) return withPoints.code;
  return methods[0]?.code || '';
}

function applyDefaultShippingForCity() {
  const next = pickDefaultMethod(deliveryMethods.value);
  if (!next) return;
  if (shippingMethod.value === next) return;
  const current = activeMethod.value;
  const pickupCity = isStorePickupCity(geoStore.geo.cityData)
      || (!geoStore.geo.cityData && /петербург/i.test(geoStore.geo.city));
  if (current?.kind === 'self_pickup' && !pickupCity) {
    selectShipping(next);
    return;
  }
  if (!current && next) selectShipping(next);
}

onMounted(async () => {
  await geoStore.loadGeo();
  applyDefaultShippingForCity();
  if (authStore.user?.email) {
    email.value = authStore.user.email;
  }
});

function citySelectionKey() {
  const city = geoStore.geo.cityData;
  return city?.id || city?.fias_id || city?.kladr_id || geoStore.geo.city;
}

watch(citySelectionKey, (key, prev) => {
  if (!key || key === prev) return;
  applyDefaultShippingForCity();
});

watch(() => authStore.user?.email, (value) => {
  if (value && !email.value) email.value = value;
});

function pointShipAddress(point: DeliveryPointResponse | null | undefined) {
  if (!point) return '';
  return deliveryPointAddress(point);
}

function clearQuote() {
  quoteRequestId += 1;
  preview.value = null;
  quoteLoading.value = false;
  quoteError.value = '';
}

function deliveryChoiceBody(): CheckoutPreviewRequest | null {
  const method = activeMethod.value;
  const code = method?.code?.trim();
  if (!code) return null;

  if (method.kind === 'self_pickup') {
    return { delivery_method_code: code };
  }

  if (method.kind === 'courier') {
    const body: CheckoutPreviewRequest = { delivery_method_code: code };
    const postcode = geoStore.geo.cityData?.postal_code?.trim();
    if (postcode) body.ship_postcode = postcode;
    return body;
  }

  if (method.has_points) {
    const pointCode = selectedPoint.value?.code?.trim();
    if (!pointCode) return null;
    return {
      delivery_method_code: code,
      ship_point_code: pointCode,
    };
  }

  return { delivery_method_code: code };
}

function httpStatus(error: unknown) {
  const err = error as { status?: number; statusCode?: number };
  return err.status ?? err.statusCode;
}

function errorMessages(error: unknown) {
  const err = error as {
    data?: {
      message?: string;
      errors?: { message?: string; code?: string }[];
      data?: { message?: string; errors?: { message?: string; code?: string }[] };
    };
    message?: string;
    statusMessage?: string;
  };
  const payload = err.data;
  return [
    payload?.message,
    payload?.data?.message,
    ...(payload?.errors || []).map((item) => item.message || item.code),
    ...(payload?.data?.errors || []).map((item) => item.message || item.code),
    err.message,
    err.statusMessage,
  ]
      .filter((item): item is string => Boolean(item))
      .map((item) => item.toLowerCase());
}

function isUnavailableError(error: unknown) {
  if (httpStatus(error) !== 422) return false;
  return errorMessages(error).some((message) =>
      message.includes('unavailable') || message.includes('недоступ'),
  );
}

function isPriceChangedError(error: unknown) {
  if (httpStatus(error) === 409) return true;
  return errorMessages(error).some((message) =>
      message.includes('price changed') || message.includes('цена измен'),
  );
}

function extractError(error: unknown, fallback = 'Не удалось оформить заказ') {
  if (isUnavailableError(error)) {
    return 'Выберите другой пункт или способ доставки';
  }
  if (isPriceChangedError(error)) {
    return 'Сумма заказа изменилась, пересчитайте доставку';
  }
  const err = error as {
    data?: { message?: string; errors?: { message?: string }[] };
    message?: string;
    statusMessage?: string;
  };
  const field = err.data?.errors?.map((item) => item.message).filter(Boolean).join('. ');
  return field || err.data?.message || err.statusMessage || err.message || fallback;
}

async function refreshQuote() {
  if (cartStore.isEmpty) {
    clearQuote();
    return;
  }

  const previewBody = deliveryChoiceBody();
  if (!previewBody) {
    clearQuote();
    return;
  }

  const requestId = ++quoteRequestId;
  quoteLoading.value = true;
  quoteError.value = '';
  preview.value = null;

  const { $api } = useNuxtApp();

  try {
    const nextPreview = await $api.order.preview(previewBody);
    if (requestId !== quoteRequestId) return;

    if (parseVariantPrice(nextPreview.grand_total) == null) {
      quoteError.value = 'Не удалось рассчитать заказ';
      return;
    }
    preview.value = nextPreview;
  } catch (error) {
    if (requestId !== quoteRequestId) return;
    if (isPriceChangedError(error)) {
      await cartStore.loadCart();
      if (requestId !== quoteRequestId) return;
      quoteError.value = extractError(error, 'Сумма заказа изменилась');
      return;
    }
    quoteError.value = extractError(error, 'Не удалось рассчитать заказ');
  } finally {
    if (requestId === quoteRequestId) {
      quoteLoading.value = false;
    }
  }
}

const scheduleQuoteRefresh = useDebounceFn(() => {
  void refreshQuote();
}, 250);

watch(
    [
      shippingMethod,
      () => selectedPoint.value?.code,
      citySelectionKey,
      () => cartStore.totalPrice,
      () => cartStore.itemCount,
    ],
    () => {
      scheduleQuoteRefresh();
    },
    { immediate: true },
);

const deliveryLabel = computed(() => {
  if (needsPoints.value && !selectedPoint.value?.code) return 'Выберите пункт';
  if (quoteLoading.value) return 'Считаем…';
  if (quoteError.value) return 'Не рассчитана';
  if (activeMethod.value?.free) return 'Бесплатно';
  if (activeMethod.value && activeMethod.value.has_rates === false) return 'Стоимость уточним';
  if (shippingCost.value == null) return 'Рассчитывается';
  if (shippingCost.value === 0) return 'Бесплатно';
  return formatMoney(shippingCost.value);
});

const shipRecipient = computed(() => {
  if (!sameRecipient.value && recipientName.value.trim()) {
    return recipientName.value.trim();
  }
  if (buyerType.value === 'legal' && orgName.value.trim()) {
    return orgName.value.trim();
  }
  return buyerName.value.trim();
});

function submitBlockReason() {
  if (cartStore.isEmpty) return 'Корзина пуста';
  if (!buyerName.value.trim()) return 'Укажите ФИО';
  if (!isCompletePhoneRu(phone.value)) return 'Укажите полный телефон';
  if (!email.value.trim()) return 'Укажите почту';
  if (buyerType.value === 'legal' && (!orgName.value.trim() || !inn.value.trim())) {
    return 'Укажите организацию и ИНН';
  }
  if (!sameRecipient.value && !recipientName.value.trim()) return 'Укажите ФИО грузополучателя';
  if (!activeMethod.value?.code) return 'Выберите способ доставки';
  if (needsPoints.value && !selectedPoint.value?.code) {
    return `Выберите пункт ${pointsMapUi.value?.label || 'доставки'}`;
  }
  if (isCourier.value) {
    if (!courierAddress.value.trim()) return 'Укажите улицу и дом';
  }
  if (quoteLoading.value) return 'Дождитесь расчёта заказа';
  if (quoteError.value || !preview.value || parseVariantPrice(preview.value.grand_total) == null) {
    return quoteError.value || 'Не удалось рассчитать заказ';
  }
  if (!shipAddress.value.trim()) return 'Укажите адрес';
  if (!geoStore.geo.city.trim()) return 'Выберите город';
  if (!paymentMethod.value) return 'Выберите способ оплаты';
  return '';
}

useSeoMeta({
  title: 'Оформление заказа',
});

function selectShipping(code: string) {
  shippingMethod.value = code;
  selectedPoint.value = null;
  courierAddress.value = '';
  clearQuote();
}

function formatMoney(price?: number | string) {
  return formatOrderMoney(price);
}

function orderComment() {
  const parts: string[] = [];
  if (buyerType.value === 'legal') {
    parts.push(`Юридическое лицо: ${orgName.value.trim()}, ИНН ${inn.value.trim()}`);
  }
  if (pointsMapUi.value && selectedPoint.value?.code) {
    parts.push(`${pointsMapUi.value.commentPrefix} ${selectedPoint.value.code}`);
  }
  return parts.length ? parts.join('. ') : undefined;
}

async function submitOrder() {
  if (submitting.value) return;

  const blocked = submitBlockReason();
  if (blocked) {
    submitError.value = blocked;
    return;
  }

  const methodCode = activeMethod.value?.code;
  const grandTotal = formatMoneyAmount(preview.value?.grand_total);
  if (!preview.value || !methodCode) {
    submitError.value = 'Не удалось рассчитать заказ';
    return;
  }

  submitError.value = '';
  submitting.value = true;

  const { $api } = useNuxtApp();
  const body: CreateOrderRequest = {
    payment_method: paymentMethod.value,
    ship_address: shipAddress.value.trim(),
    ship_city_name: (
      selectedPoint.value?.locality
      || geoStore.geo.city
    ).trim(),
    ship_recipient: shipRecipient.value,
    email: email.value.trim(),
    phone: phone.value.trim(),
    delivery_method_code: methodCode,
    expected_total: grandTotal,
  };

  if (needsPoints.value && selectedPoint.value?.code) {
    body.ship_point_code = selectedPoint.value.code;
  }

  const postcode = isCourier.value
      ? geoStore.geo.cityData?.postal_code?.trim()
      : selectedPoint.value?.postal_code?.trim();
  if (postcode) {
    body.ship_postcode = postcode;
  }

  const comment = orderComment();
  if (comment) body.comment = comment;

  try {
    const order = await $api.order.create(body, crypto.randomUUID());
    rememberOrderSuccess(order);
    await cartStore.loadCart();

    // Card/invoice payment gateway redirect will plug in here later.
    // Cash (and current non-gateway methods) go straight to the success page.
    await navigateTo(orderSuccessPath(order, {
      paid: order.payment_status === 'paid',
    }));
  } catch (error) {
    if (isPriceChangedError(error)) {
      await cartStore.loadCart();
      await refreshQuote();
      submitError.value = 'Сумма заказа изменилась, проверьте итог и подтвердите снова';
      return;
    }
    submitError.value = extractError(error);
  } finally {
    submitting.value = false;
  }
}

const ORDER_SUCCESS_STORAGE_KEY = 'orderSuccess';

function rememberOrderSuccess(order: OrderResponse) {
  if (!import.meta.client) return;
  sessionStorage.setItem(ORDER_SUCCESS_STORAGE_KEY, JSON.stringify({
    number: order.number,
    id: order.id,
    grand_total: order.grand_total,
    payment_method: order.payment_method || paymentMethod.value,
    payment_status: order.payment_status,
    status: order.status,
    source: order.source || 'checkout',
  }));
}

</script>

<style scoped>
.empty-mark {
  animation: empty-pop 0.7s cubic-bezier(0.22, 1, 0.36, 1) both;
}

.empty-orb--blue {
  animation: empty-orb-drift 8s ease-in-out infinite alternate;
}

.empty-orb--orange {
  animation: empty-orb-drift 10s ease-in-out infinite alternate-reverse;
}

@keyframes empty-pop {
  0% {
    opacity: 0;
    transform: scale(0.7);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes empty-orb-drift {
  from {
    transform: translate3d(0, 0, 0);
  }
  to {
    transform: translate3d(24px, -18px, 0);
  }
}
</style>
