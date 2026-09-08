<script setup lang="ts">
import Slider from "~/components/home/Slider.vue";
import ProductList from "~/components/product/ProductList.vue";
import { useCollectionStore } from "~/stores/collection";
import { imageSrc } from '~/utils/media';
import {
  buildBreadcrumbJsonLd,
  buildCollectionPageJsonLd,
  buildOrganizationJsonLd,
  buildWebSiteJsonLd,
} from '~/utils/seo';

const collectionStore = useCollectionStore();
const { $api } = useNuxtApp();
const requestURL = useRequestURL();
const config = useRuntimeConfig();

const POPULAR_SLUG = 'popular';
const SITE_NAME = '3Delectronics.ru';
const pageTitle = 'Запчасти для ноутбуков, планшетов и телефонов — 3Delectronics.ru';
const pageHeading = 'Запчасти для ноутбуков, планшетов и телефонов';
const pageDescription = 'Интернет-магазин запчастей и комплектующих для ноутбуков, планшетов и телефонов в Санкт-Петербурге. Оригинальные детали, гарантия и доставка по России.';

const { data: popularCollection, pending } = await useAsyncData(`collection-${POPULAR_SLUG}`, async () => {
  if (collectionStore.collectionsWithProducts[POPULAR_SLUG]) {
    return collectionStore.collectionsWithProducts[POPULAR_SLUG];
  }

  const collection = await $api.collection.getBySlug(POPULAR_SLUG);
  collectionStore.collectionsWithProducts[POPULAR_SLUG] = collection;
  return collection;
});

const popularProducts = computed(() => popularCollection.value?.products || []);
const pageUrl = computed(() => `${requestURL.origin}/`);
const ogImage = computed(() => {
  const image = popularProducts.value[0]?.image;
  return imageSrc(String(config.public.storageUrl), image, 'card', 'jpeg') || undefined;
});

const jsonLd = computed(() => {
  const origin = requestURL.origin;
  const website = buildWebSiteJsonLd({
    name: SITE_NAME,
    url: pageUrl.value,
    description: pageDescription,
    searchUrlTemplate: `${origin}/search?q={search_term_string}`,
  });
  const organization = buildOrganizationJsonLd({
    name: SITE_NAME,
    url: pageUrl.value,
    telephone: '+7-812-317-67-72',
    email: 'info@3delectronics.ru',
    address: {
      streetAddress: 'Владимирский проспект, дом 15, офис 31',
      addressLocality: 'Санкт-Петербург',
      addressCountry: 'RU',
    },
  });
  const collection = buildCollectionPageJsonLd({
    name: pageHeading,
    description: pageDescription,
    url: pageUrl.value,
    image: ogImage.value,
    items: popularProducts.value.map((item) => ({
      name: item.name || item.slug || '',
      url: `${origin}/product/${item.slug}`,
    })),
  });
  const breadcrumbs = buildBreadcrumbJsonLd(origin, [
    { title: 'Главная', url: '/' },
  ]);

  return [website, organization, collection, breadcrumbs];
});

useSeoMeta({
  title: pageTitle,
  description: pageDescription,
  ogTitle: pageTitle,
  ogDescription: pageDescription,
  ogType: 'website',
  ogUrl: pageUrl,
  ogImage: () => ogImage.value,
  ogLocale: 'ru_RU',
  ogSiteName: SITE_NAME,
  twitterCard: 'summary_large_image',
  twitterTitle: pageTitle,
  twitterDescription: pageDescription,
  twitterImage: () => ogImage.value,
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

<template>
  <div>
    <h1 class="mb-4 text-[28px] font-normal leading-[45px] text-zinc-950 lg:mb-6">
      {{ pageHeading }}
    </h1>
    <Slider/>
    <ProductList
        title="Популярные запчасти"
        :products="popularProducts"
        :loading="pending"
    />
    <article class="mt-4 grid gap-4 text-sm leading-6 text-zinc-700 lg:mt-0 lg:gap-6">
      <p>Ноутбуки и планшеты – незаменимые гаджеты практически для каждого человека. Несмотря на то, что подобные
        устройства сегодня отличаются повышенной надежностью, даже они иногда выходят из строя. Чаще всего потеря
        работоспособности обусловлена поломкой электронных элементов.</p>
      <p>В этом случае потребуется установить новые детали и комплектующие. Однако при поиске нужных элементов нередко
        возникают проблемы: особенно, если модель Вашего гаджета является редкой. Мы можем предложить решение этой
        непростой проблемы – приобрести все требуемые детали Вы сможете в нашем интернет-магазине «3Delectronics.ru» в
        Санкт-Петербурге. Мы занимаемся продажей запчастей и комплектующих для ноутбуков, планшетов и телефонов.</p>
      <h2 class="text-lg font-normal text-zinc-950 lg:text-xl">Ассортимент «3Delectronics.ru»</h2>
      <p>Наш магазин уже более 8 лет занимается поставкой деталей для ноутбуков. За это время мы завоевали доверие у
        многих покупателей.</p>
      <p>Мы предлагаем различные типы чипов, микросхем, разъемов, матриц, клавиатур, зарядок и блоков питания для
        ноутбуков и планшетов. Также у нас представлен широкий выбор различных аксессуаров: автоадаптеров, внешних
        аккумуляторов, кабелей и переходников. Смотрите полный
        <NuxtLink to="/category" class="text-blue-600 hover:text-blue-700">каталог категорий</NuxtLink>.</p>
      <p>Наши товары подойдут для гаджетов различных марок: Apple, Asus, Acer, HP, Lenovo, Sony, Samsung и др. В
        описании каждого товара представлены подробные характеристики и фото, благодаря чему Вы сможете самостоятельно
        подобрать комплектующие для своего ноутбука или планшета. А если у Вас возникнут вопросы, то наш менеджер всегда
        поможет с выбором.</p>
      <h2 class="text-lg font-normal text-zinc-950 lg:text-xl">Почему стоит купить детали у нас?</h2>
      <ul class="list-disc pl-6 space-y-2">
        <li>
          Мы обеспечиваем быструю и надежную
          <NuxtLink to="/dostavka" class="text-blue-600 hover:text-blue-700">доставку</NuxtLink>
          всех товаров, так как сотрудничаем с поставщиками напрямую.
        </li>
        <li>В каталоге представлены только оригинальные запчасти, которые отличаются высоким качеством и надежностью.
        </li>
        <li>
          На все изделия предоставляется
          <NuxtLink to="/warranty" class="text-blue-600 hover:text-blue-700">гарантия</NuxtLink>
          сроком от 3 до 6 месяцев. При обнаружении брака мы обменяем товар или вернем Вам деньги.
        </li>
        <li>Оплата заказа может быть осуществлена любым удобным для Вас способом.</li>
        <li>Наш ассортимент постоянно пополняется новыми деталями и аксессуарами. Мы отслеживаем новые модели телефонов,
          планшетов и ноутбуков. Поэтому в нашем каталоге Вы непременно найдете комплектующие даже для недавно вышедшего
          гаджета.
        </li>
        <li>Для постоянных покупателей у нас действуют разнообразные скидки и акции.</li>
        <li>Если в нашем каталоге не найдется нужной детали, то мы поможем ее найти и организуем доставку.</li>
      </ul>
      <h2 class="text-lg font-normal text-zinc-950 lg:text-xl">Низкие цены на комплектующие</h2>
      <p>Мы уверены, что стоимость наших товаров непременно порадует Вас, ведь мы работаем с производителями напрямую.
        Это позволяет существенно снизить цены на все комплектующие для ноутбуков и планшетов.</p>
    </article>
  </div>
</template>
