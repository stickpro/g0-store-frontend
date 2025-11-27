<template>
  <div class="text-zinc-950">
    <h4 class="h-10 flex items-center font-semibold">Справочный центр</h4>
    <div class="h-10 flex items-center justify-between">
      <div class="flex items-center">Ваш город:</div>
      <button class="py-2 flex items-center cursor-pointer" @click="isOpen = true">
        <IconEdit/>
      </button>
    </div>
    <p class="h-10 flex items-center justify-end text-zinc-950/50">{{ geo.city }}</p>
  </div>

  <!-- Modal -->
  <div v-if="isOpen" class="fixed w-[384px] inset-0 left-0 top-0 z-50 flex items-start justify-center h-full bg-white">
    <div class="bg-white w-full">
      <!-- Header -->
      <button class="p-3" @click="isOpen = false">
        <IconXmark/>
      </button>
      <div class="flex items-center justify-between p-4">
        <h2 class="text-3xl font-normal">Ваш город</h2>
      </div>
      <!-- Search -->
      <div class="p-4">
        <div class="relative">
          <VInput v-model="searchQuery" placeholder="Искать...">
            <template #prepend>
              <IconSearch class="fill-red-600"/>
            </template>
          </VInput>

        </div>
      </div>

      <!-- Cities List -->
      <div class="px-4 pb-6">
        <!-- Federal Cities -->
        <div v-if="geo.popularCity.length > 0" class="mb-6 p-3">
          <template v-for="city in geo.popularCity" :key="city.id">
            <button class="flex w-full py-1 px-2 rounded-lg flex-col items-start hover:bg-gray-50"
                    @click="selectCity(city.address || '')">
              <span :class="[ geo.city === city.address ? 'text-orange-500' : '']">{{
                  city.city ? city.city : city.address
                }}</span>
              <p v-if="city.city" class="text-xs">{{ city.region }} {{ city.region_type }}</p>
            </button>
          </template>
        </div>
        <div v-else class="mb-6 p-3 text-center text-gray-500">
          <p v-if="searchQuery.length >= 3">Городов не найдено</p>
          <p v-else>Загрузка...</p>
        </div>
      </div>
    </div>
  </div>
  <div
      v-if="isOpen"
      class="fixed inset-0 backdrop-blur-xs bg-opacity-10 z-10"
      @click="isOpen = false"
  />
</template>

<script setup lang="ts">
import {ref} from 'vue';
import IconEdit from "~/components/icons/IconEdit.vue";
import IconXmark from "~/components/icons/IconXmark.vue";
import IconSearch from "~/components/icons/IconSearch.vue";
import VInput from "~/components/ui/UiInput/VInput.vue";
import {useGeoStore} from "~/stores/geo";
import {useDebounce} from "@vueuse/core";

const isOpen = ref(false);
const searchQuery = ref('');

const {loadPopularCities, geo, setCity, findCity, loadGeo } = useGeoStore()

function selectCity(city: string) {
  setCity(city)
  isOpen.value = false
}

const debouncedQuery = useDebounce(searchQuery, 300)
const hasLoadedPopularCities = ref(false)

watch(debouncedQuery, async (newQuery) => {
  if (newQuery.length >= 3) {
    await findCity(newQuery)
  }
  if (newQuery.length == 0) {
    await loadPopularCities()
  }
})

watch(isOpen, async (newVal) => {
  if (newVal && !hasLoadedPopularCities.value) {
    await loadPopularCities()
    hasLoadedPopularCities.value = true
  }
})

onMounted(() => {
  loadGeo()
})

</script>
