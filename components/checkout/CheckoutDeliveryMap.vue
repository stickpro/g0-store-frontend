<template>
  <div class="flex w-full min-w-0 flex-col gap-3">
    <div class="w-full overflow-hidden rounded-3xl">
      <ClientOnly>
        <yandex-map
            v-if="mapCenter"
            v-model="map"
            cursor-grab
            :settings="mapSettings"
            readonly-settings
            width="100%"
            height="420px"
        >
          <yandex-map-default-scheme-layer/>
          <yandex-map-default-features-layer/>
          <yandex-map-controls :settings="{ position: 'right', orientation: 'vertical' }">
            <yandex-map-zoom-control/>
          </yandex-map-controls>
          <yandex-map-listener :settings="listenerSettings"/>
          <CheckoutDeliveryCluster
              :points="points"
              :icon-src="iconSrc"
              :cluster-class="clusterClass"
              @select="selectPoint"
              @updated-bounds="loadFromViewport"
          />
          <yandex-map-marker
              v-if="selectedMarkerSettings"
              :settings="selectedMarkerSettings"
              position="top left-center"
              :zero-sizes="false"
          >
            <img
                :src="iconSrc"
                width="28"
                height="36"
                alt=""
                class="block h-9 w-7 max-w-none scale-110 drop-shadow-md"
            >
          </yandex-map-marker>
        </yandex-map>
        <template #fallback>
          <div class="flex h-[420px] items-center justify-center bg-zinc-600/5 text-[15px] text-zinc-500">
            Карта загружается…
          </div>
        </template>
      </ClientOnly>
    </div>

    <p v-if="loading" class="px-1 text-[13px] leading-4 text-zinc-500">
      Загрузка пунктов {{ providerLabel }}…
    </p>
    <p v-else-if="loadError" class="px-1 text-[13px] leading-4 text-orange-600">
      {{ loadError }}
    </p>
    <p v-else-if="!points.length" class="px-1 text-[13px] leading-4 text-zinc-500">
      Пункты {{ providerLabel }} не найдены.
    </p>

    <div v-if="modelValue" class="rounded-3xl bg-zinc-600/5 px-4 py-3 text-[15px] leading-6 text-zinc-950">
      <p class="font-medium">{{ modelValue.name || modelValue.code }}</p>
      <p v-if="selectedAddress" class="mt-1 text-zinc-600">{{ selectedAddress }}</p>
      <p v-if="workTimeLabel" class="mt-1 text-[13px] leading-4 text-zinc-500">
        {{ workTimeLabel }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  YandexMap,
  YandexMapControls,
  YandexMapDefaultFeaturesLayer,
  YandexMapDefaultSchemeLayer,
  YandexMapListener,
  YandexMapMarker,
  YandexMapZoomControl,
} from 'vue-yandex-maps';
import type { YandexMapListenerSettings } from 'vue-yandex-maps';
import { useDebounceFn } from '@vueuse/core';
import type { DeliveryPointResponse } from '~/repository/types/api/generatedApiGo';
import type { DeliveryPointsQuery, DeliveryProviderCode } from '~/repository/modules/delivery';
import { useGeoStore } from '~/stores/geo';
import CheckoutDeliveryCluster from '~/components/checkout/CheckoutDeliveryCluster.vue';
import {
  deliveryPointAddress,
  deliveryPointLat,
  deliveryPointLon,
} from '~/utils/deliveryPoint';

const CITY_ZOOM = 11;
const CENTER_PAD = 0.35;

const props = defineProps<{
  provider: DeliveryProviderCode;
  providerLabel: string;
  iconSrc: string;
  clusterClass: string;
}>();

const modelValue = defineModel<DeliveryPointResponse | null>({ default: null });
const geoStore = useGeoStore();

const map = ref<any>(null);
const points = shallowRef<DeliveryPointResponse[]>([]);
const loading = ref(false);
const loadError = ref('');
const ready = ref(false);
let loadSeq = 0;
let lastQueryKey = '';

const mapCenter = computed(() => geoStore.cityCoordinates);

const mapSettings = computed(() => ({
  location: {
    center: mapCenter.value!,
    zoom: CITY_ZOOM,
  },
}));

const workTimeLabel = computed(() =>
    (modelValue.value?.work_time || []).filter(Boolean).join('; '),
);

const selectedAddress = computed(() =>
    modelValue.value ? deliveryPointAddress(modelValue.value) : '',
);

function boundsQuery(
    minLon: number,
    minLat: number,
    maxLon: number,
    maxLat: number,
): DeliveryPointsQuery {
  return {
    min_lat: Math.min(minLat, maxLat),
    max_lat: Math.max(minLat, maxLat),
    min_lon: Math.min(minLon, maxLon),
    max_lon: Math.max(minLon, maxLon),
  };
}

function isUsableQuery(query: DeliveryPointsQuery | null): query is DeliveryPointsQuery {
  if (!query) return false;
  if (query.min_lat == null || query.max_lat == null || query.min_lon == null || query.max_lon == null) {
    return false;
  }
  const dLat = query.max_lat - query.min_lat;
  const dLon = query.max_lon - query.min_lon;
  if (dLat < 0.01 || dLon < 0.01) return false;
  if (dLat > 4 || dLon > 4) return false;
  return query.min_lat >= -90 && query.max_lat <= 90 && query.min_lon >= -180 && query.max_lon <= 180;
}

function queryFromBounds(bounds: unknown): DeliveryPointsQuery | null {
  if (!Array.isArray(bounds) || !Array.isArray(bounds[0]) || !Array.isArray(bounds[1])) return null;
  const lon1 = Number(bounds[0][0]);
  const lat1 = Number(bounds[0][1]);
  const lon2 = Number(bounds[1][0]);
  const lat2 = Number(bounds[1][1]);
  if (![lon1, lat1, lon2, lat2].every(Number.isFinite)) return null;
  const padLon = Math.abs(lon2 - lon1) * 0.08 || 0.02;
  const padLat = Math.abs(lat2 - lat1) * 0.08 || 0.02;
  return boundsQuery(lon1 - padLon, lat1 - padLat, lon2 + padLon, lat2 + padLat);
}

function queryKey(query: DeliveryPointsQuery) {
  return [
    props.provider,
    query.min_lat?.toFixed(4),
    query.max_lat?.toFixed(4),
    query.min_lon?.toFixed(4),
    query.max_lon?.toFixed(4),
  ].join(':');
}

async function loadPoints(query: DeliveryPointsQuery | null, force = false) {
  if (!isUsableQuery(query)) return;

  const key = queryKey(query);
  if (!force && key === lastQueryKey) return;

  const { $api } = useNuxtApp();
  const seq = ++loadSeq;
  loading.value = true;
  loadError.value = '';

  try {
    const data = await $api.delivery.getDeliveryPoints(props.provider, query);
    if (seq !== loadSeq) return;
    lastQueryKey = key;
    const usable = data.filter((point) =>
        Number.isFinite(deliveryPointLat(point)) && Number.isFinite(deliveryPointLon(point)),
    );
    points.value = usable;
  } catch {
    if (seq !== loadSeq) return;
    loadError.value = `Не удалось загрузить пункты ${props.providerLabel}`;
    points.value = [];
  } finally {
    if (seq === loadSeq) loading.value = false;
  }
}

function queryFromCenter(): DeliveryPointsQuery | null {
  const coords = mapCenter.value;
  if (!coords) return null;
  const [lon, lat] = coords;
  return boundsQuery(lon - CENTER_PAD, lat - CENTER_PAD, lon + CENTER_PAD, lat + CENTER_PAD);
}

function currentQuery(): DeliveryPointsQuery | null {
  const fromMap = queryFromBounds(map.value?.bounds);
  if (isUsableQuery(fromMap)) return fromMap;
  return queryFromCenter();
}

async function loadFromMap() {
  await loadPoints(currentQuery(), true);
}

async function goToCity() {
  const coords = mapCenter.value;
  if (!coords) return;
  if (map.value) {
    map.value.setLocation({ center: coords, zoom: CITY_ZOOM, duration: 0 });
    await nextTick();
  }
  await loadFromMap();
}

function cityFilterKey() {
  const city = geoStore.geo.cityData;
  return city?.id || city?.fias_id || [city?.geo_lat, city?.geo_lon, city?.postal_code].join(':');
}

const loadFromViewport = useDebounceFn((bounds?: unknown) => {
  const query = queryFromBounds(bounds);
  if (!isUsableQuery(query)) return;
  loadPoints(query);
}, 300);

function selectPoint(point: DeliveryClusterPointLike) {
  const code = point.code;
  const found = code
      ? points.value.find((item) => item.code === code)
      : null;
  modelValue.value = found || null;
}

type DeliveryClusterPointLike = {
  code?: string;
  latitude?: number;
  longitude?: number;
};

const selectedMarkerSettings = computed(() => {
  const point = modelValue.value;
  if (!point) return null;
  const lat = deliveryPointLat(point);
  const lon = deliveryPointLon(point);
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) return null;
  return {
    id: `selected-${point.code || `${lat}-${lon}`}`,
    coordinates: [lon, lat] as [number, number],
    zIndex: 1000,
  };
});

const VIEWPORT_ACTIONS = new Set(['drag', 'scrollZoom', 'pinchZoom']);

const listenerSettings: YandexMapListenerSettings = {
  onActionEnd: (event) => {
    if (!VIEWPORT_ACTIONS.has(event.type)) return;
    loadFromViewport(event.location.bounds);
  },
};

onMounted(async () => {
  await geoStore.loadGeo();
  ready.value = true;
  await loadFromMap();
});

watch(() => props.provider, () => {
  if (!ready.value) return;
  modelValue.value = null;
  lastQueryKey = '';
  points.value = [];
  loadFromMap();
});

watch(cityFilterKey, () => {
  if (!ready.value) return;
  modelValue.value = null;
  goToCity();
});

watch(map, async (instance) => {
  if (!instance) return;
  await nextTick();
  await loadFromMap();
});
</script>
