<template>
  <div class="w-full">
    <div class="flex flex-col gap-3">
      <nav class="flex items-center gap-0 text-[13px] leading-4 text-zinc-950" aria-label="Навигация">
        <NuxtLink to="/" class="flex size-6 items-center justify-center rounded-full p-1">
          <img src="@/assets/icons/home.svg" alt="Главная" class="size-4">
        </NuxtLink>
        <img src="@/assets/icons/chevron_right.svg" alt="" class="size-4">
        <span class="rounded-full px-2 py-1 text-[13px] leading-4 text-zinc-950">
          Доставка
        </span>
      </nav>

      <h1 class="text-[28px] font-normal leading-[45px] text-zinc-950">
        Способы доставки заказов
      </h1>
    </div>

    <div class="mt-6 flex flex-col gap-10 text-[17px] leading-6 text-zinc-950">
      <section class="flex max-w-[920px] flex-col gap-4">
        <p>
          Выберите регион и удобный способ получения. Стоимость, сроки и доступность вариантов рассчитываются автоматически при оформлении заказа.
        </p>
        <p class="text-zinc-950/70">
          Сроки доставки, указанные на сайте, предоставлены транспортными компаниями и являются ориентировочными. При несоблюдении сроков доставки транспортными компаниями просьба обращаться в выбранную ТК.
        </p>

        <ul class="flex flex-wrap gap-2">
          <li
              v-for="method in methods"
              :key="method"
              class="rounded-full border border-zinc-600/15 px-4 py-2 text-[15px] leading-4"
          >
            {{ method }}
          </li>
        </ul>
      </section>

      <section class="grid grid-cols-1 gap-px overflow-hidden rounded-3xl bg-zinc-600/15 md:grid-cols-2">
        <div class="bg-white px-6 py-5">
          <p class="text-[15px] font-bold leading-6">Что важно учесть</p>
          <p class="mt-2 text-[15px] leading-6 text-zinc-950/70">
            Для отправки транспортными компаниями требуется предоплата. Самовывоз в Санкт-Петербурге доступен после подтверждения готовности заказа.
          </p>
        </div>
        <div class="bg-orange-50 px-6 py-5">
          <p class="text-[15px] font-bold leading-6 text-orange-500">Яндекс Доставка и аккумуляторы</p>
          <p class="mt-2 text-[15px] leading-6 text-zinc-950">
            Яндекс Доставка не возит аккумуляторы. Если в заказе есть АКБ, этот способ будет недоступен.
          </p>
        </div>
      </section>

      <nav class="flex flex-wrap gap-2" aria-label="Разделы доставки">
        <a
            v-for="group in groups"
            :key="group.id"
            :href="`#${group.id}`"
            class="rounded-full bg-zinc-600/5 px-4 py-2 text-[15px] leading-4 text-zinc-950 hover:bg-zinc-600/10"
        >
          {{ group.title }}
        </a>
      </nav>

      <section
          v-for="group in groups"
          :id="group.id"
          :key="group.id"
          class="flex scroll-mt-28 flex-col gap-4"
      >
        <h2 class="text-[22px] leading-9 text-blue-600">
          {{ group.title }}
        </h2>

        <div
            class="grid grid-cols-1 border-t border-dashed border-zinc-600/15"
            :class="group.regions.length > 1 ? 'lg:grid-cols-2' : ''"
        >
          <article
              v-for="region in group.regions"
              :key="region.name"
              class="flex flex-col border-b border-dashed border-zinc-600/15 py-6"
              :class="group.regions.length > 1 ? 'lg:border-r lg:odd:pr-8 lg:even:border-r-0 lg:even:pl-8' : ''"
          >
            <h3 class="text-[22px] leading-9 text-zinc-950">
              {{ region.name }}
            </h3>

            <div class="mt-4 flex flex-col">
              <div
                  v-for="option in region.options"
                  :key="option.title"
                  class="border-b border-dashed border-zinc-600/15 py-4 last:border-b-0 last:pb-0 first:pt-0"
              >
                <p class="text-[15px] font-bold leading-6">
                  {{ option.title }}
                </p>
                <ul class="mt-2 flex flex-col gap-1 text-[15px] leading-6 text-zinc-950/70">
                  <li v-for="item in option.items" :key="item">
                    {{ item }}
                  </li>
                  <li v-if="option.officeLink">
                    <NuxtLink to="/contacts" class="text-blue-600 hover:text-blue-700">
                      Офис в Санкт-Петербурге
                    </NuxtLink>
                  </li>
                </ul>
              </div>
            </div>
          </article>
        </div>
      </section>

      <section class="flex flex-col gap-4">
        <h2 class="text-[22px] leading-9 text-blue-600">
          Часто задаваемые вопросы
        </h2>

        <div class="flex flex-col border-t border-dashed border-zinc-600/15">
          <div
              v-for="faq in faqs"
              :key="faq.question"
              class="border-b border-dashed border-zinc-600/15 py-5"
          >
            <h3 class="text-[17px] font-bold leading-6">
              {{ faq.question }}
            </h3>
            <ul class="mt-2 flex flex-col gap-1 text-[15px] leading-6 text-zinc-950/70">
              <li v-for="answer in faq.answers" :key="answer">
                {{ answer }}
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { buildBreadcrumbJsonLd } from '~/utils/seo';

const methods = ['Самовывоз', 'СДЭК', 'Почта России', 'Яндекс Доставка'] as const;

const carrierNote = [
  'Сроки и стоимость рассчитываются при оформлении заказа',
  'Требуется предоплата',
];

const groups = [
  {
    id: 'cities',
    title: 'Города',
    regions: [
      {
        name: 'Санкт-Петербург',
        options: [
          {
            title: 'Самовывоз',
            items: [
              'После оформления заказа дождитесь уведомления на email или в Max',
              'На неоплаченные заказы резерв действует 2 дня',
            ],
            officeLink: true,
          },
          {
            title: 'Пункты выдачи и курьер СДЭК',
            items: carrierNote,
          },
          {
            title: 'Пункты выдачи Яндекс Доставка',
            items: carrierNote,
          },
        ],
      },
      {
        name: 'Москва',
        options: [
          {
            title: 'Пункты выдачи и курьер СДЭК',
            items: carrierNote,
          },
          {
            title: 'Пункты выдачи Яндекс Доставка',
            items: carrierNote,
          },
          {
            title: 'Почта России',
            items: carrierNote,
          },
        ],
      },
    ],
  },
  {
    id: 'regions',
    title: 'Регионы России',
    regions: [
      {
        name: 'Вся Россия',
        options: [
          {
            title: 'Пункты выдачи и курьер СДЭК',
            items: carrierNote,
          },
          {
            title: 'Пункты выдачи Яндекс Доставка',
            items: carrierNote,
          },
          {
            title: 'Почта России',
            items: carrierNote,
          },
        ],
      },
    ],
  },
  {
    id: 'countries',
    title: 'Другие страны',
    regions: [
      {
        name: 'Казахстан',
        options: [
          {
            title: 'Пункты выдачи СДЭК',
            items: [
              ...carrierNote,
              'Населённые пункты, куда возможна доставка, представлены в списке при оформлении',
            ],
          },
        ],
      },
      {
        name: 'Беларусь',
        options: [
          {
            title: 'Пункты выдачи СДЭК',
            items: [
              ...carrierNote,
              'Населённые пункты, куда возможна доставка, представлены в списке при оформлении',
            ],
          },
        ],
      },
    ],
  },
];

const faqs = [
  {
    question: 'Когда будет отправлен мой заказ?',
    answers: [
      'Отправка СДЭК и Яндекс Доставкой — ежедневно. Почта России отправляется только по рабочим дням. В праздники график может измениться.',
    ],
  },
  {
    question: 'Как отследить заказ?',
    answers: [
      'На сайтах транспортных компаний есть отслеживание по трек-номеру.',
    ],
  },
  {
    question: 'Как узнать статус заказа?',
    answers: [
      'Актуальный статус можно посмотреть в личном кабинете, кроме заказов через «Быстрый заказ».',
      'Мы также отправляем письма на email, указанный при оформлении.',
      'Можно подписаться на уведомления в Max: Telegram и WhatsApp работают нестабильно.',
    ],
  },
];

const requestURL = useRequestURL();
const pageTitle = 'Доставка';
const pageDescription = 'Способы получения заказа в магазине 3Delectronics.ru. Самовывоз, СДЭК, Почта России и Яндекс Доставка.';
const pageUrl = computed(() => `${requestURL.origin}/dostavka`);

const jsonLd = computed(() => [
  {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: pageTitle,
    description: pageDescription,
    url: pageUrl.value,
  },
  buildBreadcrumbJsonLd(requestURL.origin, [
    { title: 'Главная', url: '/' },
    { title: pageTitle, url: '/dostavka' },
  ]),
]);

useSeoMeta({
  title: pageTitle,
  description: pageDescription,
  ogTitle: pageTitle,
  ogDescription: pageDescription,
  ogType: 'website',
  ogUrl: pageUrl,
  ogLocale: 'ru_RU',
  twitterCard: 'summary',
  twitterTitle: pageTitle,
  twitterDescription: pageDescription,
  robots: 'index, follow',
});

useHead(() => ({
  title: pageTitle,
  link: [
    { rel: 'canonical', href: pageUrl.value },
  ],
  script: jsonLd.value.map((schema) => ({
    type: 'application/ld+json',
    innerHTML: JSON.stringify(schema),
  })),
}));
</script>
