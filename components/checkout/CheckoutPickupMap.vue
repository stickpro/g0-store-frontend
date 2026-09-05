<template>
  <div class="overflow-hidden rounded-3xl">
    <ClientOnly>
      <yandex-map
          :settings="{
            location: {
              center: STORE_PICKUP.coordinates,
              zoom: 16,
            },
          }"
          width="100%"
          height="420px"
      >
        <yandex-map-default-scheme-layer/>
        <yandex-map-default-features-layer/>
        <yandex-map-popup-marker :settings="{ coordinates: STORE_PICKUP.coordinates }">
          {{ STORE_PICKUP.title }}
        </yandex-map-popup-marker>
      </yandex-map>
      <template #fallback>
          <div class="flex h-[420px] items-center justify-center bg-zinc-600/5 text-[15px] text-zinc-500">
          Карта загружается…
        </div>
      </template>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import {
  YandexMap,
  YandexMapDefaultFeaturesLayer,
  YandexMapDefaultSchemeLayer,
  YandexMapPopupMarker,
} from 'vue-yandex-maps';
import { STORE_PICKUP } from '~/utils/constants/pickup';
</script>
