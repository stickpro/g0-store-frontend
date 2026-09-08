<script setup lang="ts">
const containerRef = ref(null)

useSwiper(containerRef, {
  loop: true,
  autoplay: {
    delay: 1,
    disableOnInteraction: true,
  },
})

const slides = [
  {
    title: 'Удобная доставка',
    items: [
      'Надежная многослойная упаковка',
      'Отслеживание по трек номеру',
      'Передаём ТК в день заказа',
      'Курьеры по СПб',
    ],
  },
  {
    title: 'Удобная доставка',
    items: [
      'Надежная многослойная упаковка',
      'Отслеживание по трек номеру',
      'Передаём ТК в день заказа',
      'Курьеры по СПб',
    ],
  },
]
</script>

<template>
  <ClientOnly>
    <swiper-container ref="containerRef" :loop="true" class="w-full max-w-full overflow-hidden">
      <swiper-slide v-for="(slide, index) in slides" :key="index">
        <div class="relative overflow-hidden rounded-2xl lg:rounded-3xl">
          <div class="slider-bg-shape absolute inset-0 z-20"/>
          <div class="absolute inset-0 z-10 bg-orange-700 opacity-80"/>
          <div class="relative z-40 flex min-h-[220px] flex-col justify-center gap-3 p-5 lg:min-h-[360px] lg:p-0">
            <p class="text-[22px] font-bold text-zinc-50 lg:absolute lg:top-25 lg:ml-10 lg:text-[43px]">
              {{ slide.title }}
            </p>
            <ul class="space-y-1 text-sm font-semibold text-zinc-50 lg:absolute lg:top-25 lg:right-12 lg:space-y-4 lg:text-right lg:text-2xl">
              <li v-for="item in slide.items" :key="item">{{ item }}</li>
            </ul>
          </div>
          <img src="/images/slider/decor.svg" class="pointer-events-none absolute top-24 left-4 z-30 hidden w-40 lg:left-auto lg:top-35 lg:block lg:w-auto" alt="">
          <img src="/images/slider/box.png" alt="" class="pointer-events-none absolute right-0 bottom-0 z-0 hidden h-full max-h-[360px] object-contain object-right lg:block">
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
