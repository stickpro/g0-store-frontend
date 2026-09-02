<template>
  <picture v-if="webpSrc || jpegSrc">
    <source v-if="webpSrc" type="image/webp" :srcset="webpSrc">
    <img
        :src="jpegSrc || webpSrc"
        :alt="altText"
        :width="image?.width"
        :height="image?.height"
        v-bind="$attrs"
    >
  </picture>
</template>

<script setup lang="ts">
import type { ImagePresetName, StoreImage } from '~/utils/media'
import { imageSrc } from '~/utils/media'

defineOptions({ inheritAttrs: false })

const props = defineProps<{
  image?: StoreImage | null
  preset: ImagePresetName
  alt?: string
}>()

const config = useRuntimeConfig()
const storageUrl = computed(() => String(config.public.storageUrl))

const jpegSrc = computed(() => imageSrc(storageUrl.value, props.image, props.preset, 'jpeg'))
const webpSrc = computed(() => imageSrc(storageUrl.value, props.image, props.preset, 'webp'))
const altText = computed(() => props.alt || props.image?.alt || '')
</script>
