<template>
  <div>
    <h1 class="text-2xl text-zinc-950">Контакты</h1>

    <div class="grid grid-cols-1 gap-8">
      <div class="rounded-3xl overflow-hidden mt-6">
        <ClientOnly>
          <yandex-map
              :settings="{
                  location: {
                    center: [30.347328, 59.929316],
                    zoom: 16,
                  },
                }"
              width="100%"
              height="400px"
          >
            <yandex-map-default-scheme-layer/>
            <yandex-map-default-features-layer/>
            <yandex-map-controls :settings="{ position: 'bottom left', orientation: 'vertical' }">
              <yandex-map-geolocation-control/>
              <yandex-map-open-maps-button/>

            </yandex-map-controls>
            <yandex-map-popup-marker :settings="{ coordinates: [30.347328, 59.929316] }">
              ПВЗ 3delectronics
            </yandex-map-popup-marker>
          </yandex-map>
        </ClientOnly>
      </div>

      <!-- Контактная информация -->
      <div class="flex flex-col w-full">
        <!-- Телефон -->
        <div class="flex flex-col w-full">
          <div class="h-10 border-b border-zinc-600/15 flex items-center">
            <p class="px-4 text-[17px] text-zinc-950">Телефон</p>
          </div>
          <div class="h-10 border-b border-zinc-600/15 flex items-center">
            <a href="tel:+78123176772" class="px-4 text-[17px] text-blue-600">8(812)317-67-72</a>
          </div>
        </div>

        <!-- Почта -->
        <div class="flex flex-col w-full">
          <div class="h-10 border-b border-zinc-600/15 flex items-center">
            <p class="px-4 text-[17px] text-zinc-950">Почта</p>
          </div>
          <div class="h-10 border-b border-zinc-600/15 flex items-center">
            <a href="mailto:info@3Delectronics.ru" class="px-4 text-[17px] text-blue-600">info@3Delectronics.ru</a>
          </div>
        </div>

        <!-- Телеграм -->
        <div class="flex flex-col w-full">
          <div class="h-10 border-b border-zinc-600/15 flex items-center">
            <p class="px-4 text-[17px] text-zinc-950">Телеграм</p>
          </div>
          <div class="h-10 border-b border-zinc-600/15 flex items-center">
            <a href="https://t.me/@3Delectronics" target="_blank" class="px-4 text-[17px] text-blue-600">@3Delectronics.ru</a>
          </div>
        </div>

        <!-- Адрес -->
        <div class="flex flex-col w-full">
          <div class="h-10 flex items-center justify-between">
            <p class="px-4 text-[17px] text-zinc-950">Адрес</p>
          </div>
          <div class="flex items-center py-2">
            <p class="px-4 text-[17px] text-zinc-950 leading-6">
              г.Санкт-Петербург, Владимирский проспект, дом 15, офис 31. (ст.м. Владимирская/Достоевская, вход со
              стороны проспекта,<br>
              2 этаж. Крыльцо слева от пирогов "Штолле", на домофоне набирайте 31В (В - кнопка Вызов))
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  YandexMap,
  YandexMapControls,
  YandexMapDefaultFeaturesLayer,
  YandexMapDefaultSchemeLayer,
  YandexMapGeolocationControl,
  YandexMapOpenMapsButton,
  YandexMapPopupMarker,
} from 'vue-yandex-maps';

</script>

<style scoped>

</style>
