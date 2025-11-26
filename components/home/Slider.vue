<script setup lang="ts">
// Create 10 slides
const containerRef = ref(null)

const swiper = useSwiper(containerRef, {
  loop: true,
  autoplay: {
    delay: 1,
    disableOnInteraction: true,
  },
})

onMounted(() => {
  // Access Swiper instance
  // Read more about Swiper instance: https://swiperjs.com/swiper-api#methods--properties
  console.log(swiper.instance)
})
</script>

<template>
  <ClientOnly>
    <swiper-container ref="containerRef" :loop="true" class="w-full max-w-full">
      <swiper-slide key="slide-1">
        <div class="relative w-full h-full rounded-3xl overflow-hidden">
          <div class="slider-bg-shape absolute inset-0 z-20"/>
          <div class="bg-orange-700 opacity-80 absolute inset-0 z-10"/>
          <div class="text-[43px] font-bold ml-10 text-zinc-50 absolute top-25 z-40">Удобная доставка</div>
          <div class="absolute space-y-4 top-25 right-12 text-right text-zinc-50 z-40 font-bold text-2xl">
            <div class="">Надежная многослойная упаковка</div>
            <div class="">Отслеживание по трек номеру</div>
            <div class="">Передаём ТК в день заказа</div>
            <div class="">Курьеры по СПб</div>
          </div>
          <img src="/images/slider/decor.svg" class="absolute top-35 z-40" alt="decor">
          <img src="/images/slider/box.png" alt="slider-box" class="relative z-0   object-cover">
        </div>
      </swiper-slide>
      <swiper-slide key="slide-2">
        <div class="relative w-full h-full rounded-3xl overflow-hidden">
          <div class="slider-bg-shape absolute inset-0 z-20"/>
          <div class="bg-orange-700 opacity-80 absolute inset-0 z-10"/>
          <div class="text-[43px] font-bold ml-10 text-zinc-50 absolute top-25 z-40">Удобная доставка</div>
          <div class="absolute space-y-4 top-25 right-12 text-right text-zinc-50 z-40 font-bold text-2xl">
            <div class="">Надежная многослойная упаковка</div>
            <div class="">Отслеживание по трек номеру</div>
            <div class="">Передаём ТК в день заказа</div>
            <div class="">Курьеры по СПб</div>
          </div>
          <img src="/images/slider/decor.svg" class="absolute top-35 z-40" alt="decor">
          <img src="/images/slider/box.png" alt="slider-box" class="relative z-0   object-cover">
        </div>
      </swiper-slide>
    </swiper-container>
  </ClientOnly>
</template>

<style lang="css">

.slider-bg-shape {
  opacity: 0.5;
  background: url('/images/slider/shape.png') lightgray repeat;
  mix-blend-mode: overlay;
}
</style>
