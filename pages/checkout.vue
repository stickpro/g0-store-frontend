<template>
  <div class="flex w-full min-h-[calc(100vh-5rem)]">
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
          v-if="!authStore.isAuthenticated && !createdOrder"
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

      <div v-if="createdOrder" class="mt-6 rounded-3xl bg-white px-6 py-10">
        <p class="text-[22px] leading-9 text-zinc-950">Заказ оформлен</p>
        <p class="mt-2 text-[15px] leading-6 text-zinc-600">
          Номер заказа
          <span class="font-medium text-zinc-950">{{ createdOrder.number ?? createdOrder.id }}</span>
        </p>
        <NuxtLink
            :to="createdOrder.number != null ? `/account/orders/${createdOrder.number}` : '/account/orders'"
            class="mt-6 inline-flex h-12 items-center rounded-full bg-blue-600 px-6 text-[15px] font-medium text-white hover:bg-blue-700"
        >
          Мои заказы
        </NuxtLink>
      </div>

      <div v-else class="mt-6">
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
                      v-for="method in shippingMethods"
                      :key="method.id"
                      type="button"
                      class="h-10 rounded-full px-4 text-[15px]"
                      :class="shippingMethod === method.id
                        ? 'bg-zinc-950 text-zinc-50'
                        : 'border border-zinc-600/15 text-zinc-950'"
                      @click="selectShipping(method.id)"
                  >
                    {{ method.label }}
                  </button>
                </div>
              </div>

              <div class="grid grid-cols-[40px_minmax(0,1fr)] gap-x-3 lg:gap-x-6">
                <div aria-hidden="true"/>
                <div class="min-w-0">
                  <p
                      v-if="shippingMethod === 'pickup'"
                      class="mb-3 px-1 text-[15px] leading-6 text-zinc-950"
                  >
                    {{ STORE_PICKUP.address }}
                  </p>
                  <CheckoutPickupMap v-if="shippingMethod === 'pickup'"/>
                  <CheckoutDeliveryMap
                      v-else-if="activeDeliveryMap"
                      :key="activeDeliveryMap.provider"
                      v-model="selectedPoint"
                      :provider="activeDeliveryMap.provider"
                      :provider-label="activeDeliveryMap.label"
                      :icon-src="activeDeliveryMap.iconSrc"
                      :cluster-class="activeDeliveryMap.clusterClass"
                  />
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

    <aside class="hidden min-h-[calc(100vh-5rem)] w-[304px] shrink-0 flex-col border-l border-dashed border-zinc-600/15 bg-[#eff6ff] lg:flex">
      <OrderSummary
          layout="desktop"
          :item-count="cartStore.itemCount"
          :total="cartStore.totalPrice"
          :delivery-label="deliveryLabel"
      >
        <template #actions>
          <button
              type="button"
              class="h-12 w-full rounded-full bg-blue-600 text-[15px] font-medium text-white hover:bg-blue-700 disabled:opacity-50"
              :disabled="submitting || Boolean(createdOrder)"
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
        :total="cartStore.totalPrice"
        panel-class="bg-[#eff6ff]"
    >
      <template #collapsed-action>
        <button
            type="button"
            class="flex h-12 shrink-0 items-center justify-center rounded-full bg-blue-600 px-5 text-[15px] font-medium text-white disabled:opacity-50"
            :disabled="submitting || Boolean(createdOrder)"
            @click="submitOrder"
        >
          {{ submitting ? 'Отправка…' : 'Подтвердить' }}
        </button>
      </template>
      <OrderSummary
          layout="sheet"
          :item-count="cartStore.itemCount"
          :total="cartStore.totalPrice"
          :delivery-label="deliveryLabel"
      >
        <template #actions>
          <button
              type="button"
              class="h-12 w-full rounded-full bg-blue-600 text-[15px] font-medium text-white disabled:opacity-50"
              :disabled="submitting || Boolean(createdOrder)"
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
import CheckoutPickupMap from '~/components/checkout/CheckoutPickupMap.vue';
import CheckoutDeliveryMap from '~/components/checkout/CheckoutDeliveryMap.vue';
import OrderSummary from '~/components/cart/OrderSummary.vue';
import OrderSummarySheet from '~/components/cart/OrderSummarySheet.vue';
import { STORE_PICKUP, isStorePickupCity } from '~/utils/constants/pickup';
import type {
  CreateOrderRequest,
  DeliveryPointResponse,
  OrderResponse,
} from '~/repository/types/api/generatedApiGo';
import type { DeliveryProviderCode } from '~/repository/modules/delivery';
import { useAuthStore } from '~/stores/auth';
import { useCartStore } from '~/stores/cart';
import { useGeoStore } from '~/stores/geo';
import { CURRENCY_CODE } from '~/utils/constants/currency';
import { deliveryPointAddress } from '~/utils/deliveryPoint';
import { isCompletePhoneRu } from '~/utils/phoneMask';

definePageMeta({
  layout: 'cart',
});

type ShippingMethodId = 'pickup' | 'cdek' | 'post' | 'yandex';

type DeliveryMapConfig = {
  provider: DeliveryProviderCode;
  label: string;
  iconSrc: string;
  clusterClass: string;
  commentPrefix: string;
};

const buyerTypes = [
  { id: 'person' as const, label: 'Физическое лицо' },
  { id: 'legal' as const, label: 'Юридическое лицо' },
];

const shippingMethods: { id: ShippingMethodId; label: string }[] = [
  { id: 'pickup', label: 'Самовывоз' },
  { id: 'cdek', label: 'СДЭК' },
  { id: 'post', label: 'Почта России' },
  { id: 'yandex', label: 'Яндекс Доставка' },
];

const deliveryMaps: Record<Exclude<ShippingMethodId, 'pickup'>, DeliveryMapConfig> = {
  cdek: {
    provider: 'cdek',
    label: 'СДЭК',
    iconSrc: '/icons/cdek_point.svg',
    clusterClass: 'bg-[#1AB248]',
    commentPrefix: 'СДЭК ПВЗ',
  },
  post: {
    provider: 'pochta',
    label: 'Почты России',
    iconSrc: '/icons/pochta_point.svg',
    clusterClass: 'bg-[#1928DC]',
    commentPrefix: 'Почта России ПВЗ',
  },
  yandex: {
    provider: 'yandex_delivery',
    label: 'Яндекс Доставки',
    iconSrc: '/icons/yandex_point.svg',
    clusterClass: 'bg-[#FC3F1D]',
    commentPrefix: 'Яндекс ПВЗ',
  },
};

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
const shippingMethod = ref<ShippingMethodId>(
    isStorePickupCity(geoStore.geo.cityData) || !geoStore.geo.cityData ? 'pickup' : 'cdek',
);
const shipAddress = ref(
    shippingMethod.value === 'pickup' ? STORE_PICKUP.address : '',
);
const selectedPoint = ref<DeliveryPointResponse | null>(null);
const paymentMethod = ref('');
const submitting = ref(false);
const submitError = ref('');
const createdOrder = ref<OrderResponse | null>(null);
const sheetOpen = ref(false);

const activeDeliveryMap = computed(() => {
  if (shippingMethod.value === 'pickup') return null;
  return deliveryMaps[shippingMethod.value];
});

await useAsyncData('checkout-cart', async () => {
  await cartStore.loadCart();
  return cartStore.items;
});

function applyDefaultShippingForCity() {
  const pickupCity = isStorePickupCity(geoStore.geo.cityData)
      || (!geoStore.geo.cityData && /петербург/i.test(geoStore.geo.city));
  if (pickupCity) {
    if (shippingMethod.value !== 'pickup') selectShipping('pickup');
    return;
  }
  if (shippingMethod.value === 'pickup') selectShipping('cdek');
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

watch(selectedPoint, (point) => {
  if (!activeDeliveryMap.value) return;
  shipAddress.value = pointShipAddress(point);
});

const deliveryLabel = computed(() =>
    shippingMethod.value === 'pickup' ? 'Бесплатно' : 'Рассчитывается',
);

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
  if (activeDeliveryMap.value && !selectedPoint.value?.code) {
    return `Выберите пункт ${activeDeliveryMap.value.label}`;
  }
  if (!shipAddress.value.trim()) return 'Укажите адрес';
  if (!geoStore.geo.city.trim()) return 'Выберите город';
  if (!paymentMethod.value) return 'Выберите способ оплаты';
  return '';
}

useSeoMeta({
  title: 'Оформление заказа',
});

function selectShipping(id: ShippingMethodId) {
  shippingMethod.value = id;
  selectedPoint.value = null;
  if (id === 'pickup') {
    shipAddress.value = STORE_PICKUP.address;
  } else {
    shipAddress.value = '';
  }
}

function formatMoney(price?: number) {
  if (price == null || !Number.isFinite(price)) return `0 ${CURRENCY_CODE}`;
  return `${price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} ${CURRENCY_CODE}`;
}

function formatExpectedTotal(price: number) {
  return price.toFixed(2);
}

function orderComment() {
  const parts: string[] = [];
  if (buyerType.value === 'legal') {
    parts.push(`Юридическое лицо: ${orgName.value.trim()}, ИНН ${inn.value.trim()}`);
  }
  if (activeDeliveryMap.value && selectedPoint.value?.code) {
    parts.push(`${activeDeliveryMap.value.commentPrefix} ${selectedPoint.value.code}`);
  }
  return parts.length ? parts.join('. ') : undefined;
}

function extractError(error: unknown) {
  const err = error as {
    data?: { message?: string; errors?: { message?: string }[] };
    message?: string;
    statusMessage?: string;
  };
  const field = err.data?.errors?.map((item) => item.message).filter(Boolean).join('. ');
  return field || err.data?.message || err.statusMessage || 'Не удалось оформить заказ';
}

async function submitOrder() {
  if (submitting.value || createdOrder.value) return;

  const blocked = submitBlockReason();
  if (blocked) {
    submitError.value = blocked;
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
    shipping_method: shippingMethod.value,
    expected_total: formatExpectedTotal(cartStore.totalPrice),
  };

  const postcode = selectedPoint.value?.postal_code;
  if (postcode) {
    body.ship_postcode = postcode;
  }

  const comment = orderComment();
  if (comment) body.comment = comment;

  try {
    createdOrder.value = await $api.order.create(body, crypto.randomUUID());
    await cartStore.loadCart();
  } catch (error) {
    submitError.value = extractError(error);
  } finally {
    submitting.value = false;
  }
}
</script>
