<template>
  <div class="text-zinc-950">
    <h4 class="h-10 flex items-center font-semibold">Справочный центр</h4>
    <div class="h-10 flex items-center justify-between">
      <div class="flex items-center">Ваш город:</div>
      <button class="py-2 flex items-center cursor-pointer" @click="geoStore.openModal()">
        <IconEdit/>
      </button>
    </div>
    <p class="h-10 flex items-center justify-end text-zinc-950/50">{{ geo.city }}</p>
  </div>
</template>

<script setup lang="ts">
import IconEdit from "~/components/icons/IconEdit.vue";
import {useGeoStore} from "~/stores/geo";
import {storeToRefs} from 'pinia';

const geoStore = useGeoStore()
const {geo} = storeToRefs(geoStore)

</script>
