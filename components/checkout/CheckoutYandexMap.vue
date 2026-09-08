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
              icon-src="/icons/yandex_point.svg"
              cluster-class="bg-[#FC3F1D]"
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
                src="/icons/yandex_point.svg"
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
      Загрузка пунктов Яндекс Доставки…
    </p>
    <p v-else-if="loadError" class="px-1 text-[13px] leading-4 text-orange-600">
      {{ loadError }}
    </p>
    <p v-else-if="!points.length" class="px-1 text-[13px] leading-4 text-zinc-500">
      Пункты Яндекс Доставки не найдены.
    </p>

    <div v-if="modelValue" class="rounded-3xl bg-zinc-600/5 px-4 py-3 text-[15px] leading-6 text-zinc-950">
      <p class="font-medium">{{ modelValue.name || modelValue.code }}</p>
      <p class="mt-1 text-zinc-600">{{ modelValue.full_address || pointShortAddress(modelValue) }}</p>
      <p v-if="selectedSchedule" class="mt-1 text-[13px] leading-4 text-zinc-500">
        {{ selectedSchedule }}
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
import type { YandexDeliveryPointResponse } from '~/repository/types/api/generatedApiGo';
import { useGeoStore } from '~/stores/geo';
import type { YandexDeliveryPointsQuery } from '~/repository/modules/yandexDelivery';
import CheckoutDeliveryCluster from '~/components/checkout/CheckoutDeliveryCluster.vue';

const CITY_ZOOM = 11;
const DAY_NAMES: Record<number, string> = {
  1: 'Пн',
  2: 'Вт',
  3: 'Ср',
  4: 'Чт',
  5: 'Пт',
  6: 'Сб',
  7: 'Вс',
};

const modelValue = defineModel<YandexDeliveryPointResponse | null>({ default: null });
const geoStore = useGeoStore();

const map = ref<any>(null);
const points = shallowRef<YandexDeliveryPointResponse[]>([]);
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

function pointLat(point: YandexDeliveryPointResponse) {
  return Number(point.latitude);
}

function pointLon(point: YandexDeliveryPointResponse) {
  return Number(point.longitude);
}

function pointShortAddress(point: YandexDeliveryPointResponse) {
  return [point.street, point.house].filter(Boolean).join(', ');
}

function formatDayRange(days: number[]) {
  const unique = [...new Set(days.filter((day) => DAY_NAMES[day]))].sort((a, b) => a - b);
  if (!unique.length) return '';

  const ranges: string[] = [];
  let start = unique[0];
  let prev = unique[0];

  for (let i = 1; i <= unique.length; i++) {
    const day = unique[i];
    if (day === prev + 1) {
      prev = day;
      continue;
    }
    ranges.push(start === prev ? DAY_NAMES[start] : `${DAY_NAMES[start]}–${DAY_NAMES[prev]}`);
    start = day;
    prev = day;
  }

  return ranges.join(', ');
}

function scheduleLabel(point: YandexDeliveryPointResponse) {
  const byTime = new Map<string, number[]>();

  for (const item of point.schedule || []) {
    const time = [item.time_from, item.time_to].filter(Boolean).join('–');
    if (!time) continue;
    const days = byTime.get(time) || [];
    days.push(...(item.days || []));
    byTime.set(time, days);
  }

  return [...byTime.entries()]
      .map(([time, days]) => {
        const dayLabel = formatDayRange(days);
        return dayLabel ? `${dayLabel} ${time}` : time;
      })
      .filter(Boolean)
      .join('; ');
}

const selectedSchedule = computed(() =>
    modelValue.value ? scheduleLabel(modelValue.value) : '',
);

function boundsQuery(
    minLon: number,
    minLat: number,
    maxLon: number,
    maxLat: number,
): YandexDeliveryPointsQuery {
  return {
    min_lat: Math.min(minLat, maxLat),
    max_lat: Math.max(minLat, maxLat),
    min_lon: Math.min(minLon, maxLon),
    max_lon: Math.max(minLon, maxLon),
  };
}

function isUsableQuery(query: YandexDeliveryPointsQuery | null): query is YandexDeliveryPointsQuery {
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

function queryFromBounds(bounds: unknown): YandexDeliveryPointsQuery | null {
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

function queryKey(query: YandexDeliveryPointsQuery) {
  return [
    query.min_lat?.toFixed(4),
    query.max_lat?.toFixed(4),
    query.min_lon?.toFixed(4),
    query.max_lon?.toFixed(4),
  ].join(':');
}

async function loadPoints(query: YandexDeliveryPointsQuery | null, force = false) {
  if (!isUsableQuery(query)) return;

  const key = queryKey(query);
  if (!force && key === lastQueryKey) return;

  const { $api } = useNuxtApp();
  const seq = ++loadSeq;
  loading.value = true;
  loadError.value = '';

  try {
    const data = await $api.yandexDelivery.getDeliveryPoints(query);
    if (seq !== loadSeq) return;
    lastQueryKey = key;
    points.value = data.filter((point) =>
        Number.isFinite(pointLat(point)) && Number.isFinite(pointLon(point)),
    );
  } catch {
    if (seq !== loadSeq) return;
    loadError.value = 'Не удалось загрузить пункты Яндекс Доставки';
    points.value = [];
  } finally {
    if (seq === loadSeq) loading.value = false;
  }
}

function queryFromCenter(): YandexDeliveryPointsQuery | null {
  const coords = mapCenter.value;
  if (!coords) return null;
  const [lon, lat] = coords;
  const pad = 0.35;
  return boundsQuery(lon - pad, lat - pad, lon + pad, lat + pad);
}

function currentQuery(): YandexDeliveryPointsQuery | null {
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

function selectPoint(point: YandexDeliveryPointResponse) {
  modelValue.value = point;
}

const selectedMarkerSettings = computed(() => {
  const point = modelValue.value;
  if (!point) return null;
  const lat = pointLat(point);
  const lon = pointLon(point);
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
  if (!geoStore.cityCoordinates) {
    await geoStore.loadGeo();
  }
  ready.value = true;
  await loadFromMap();
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
