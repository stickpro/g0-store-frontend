<template>
  <nav class="flex items-center gap-0 text-[13px] leading-4 text-zinc-950" aria-label="Навигация">
    <NuxtLink to="/" class="flex size-6 items-center justify-center rounded-full p-1">
      <img src="@/assets/icons/home.svg" alt="Главная" class="size-4">
    </NuxtLink>
    <img src="@/assets/icons/chevron_right.svg" alt="" class="size-4">
    <NuxtLink
        to="/category"
        class="rounded-full px-2 py-1 text-[13px] leading-4 text-zinc-950 hover:text-zinc-600"
    >
      Каталог
    </NuxtLink>
    <template v-for="(crumb, index) in displayBreadcrumbs" :key="crumb.id || crumb.slug || index">
      <img src="@/assets/icons/chevron_right.svg" alt="" class="size-4">
      <span
          v-if="crumb.current || index === displayBreadcrumbs.length - 1"
          class="rounded-full px-2 py-1 text-[13px] leading-4 text-zinc-950"
      >
        {{ crumb.title }}
      </span>
      <NuxtLink
          v-else
          :to="crumb.url"
          class="rounded-full px-2 py-1 text-[13px] leading-4 text-zinc-950 hover:text-zinc-600"
      >
        {{ crumb.title }}
      </NuxtLink>
    </template>
  </nav>
</template>

<script setup lang="ts">
import type {BreadcrumbResponse} from '~/repository/types/api/generatedApiGo';

interface BreadcrumbItem {
  id?: string;
  title: string;
  slug?: string;
  url: string;
  current?: boolean;
}

interface Props {
  // Для загрузки с API
  productSlug?: string;
  // Для прямой передачи данных
  items?: BreadcrumbItem[];
}

const props = defineProps<Props>();

// Используем композабл для загрузки с API
const {breadcrumbs: apiBreadcrumbs, load} = useBreadcrumbs();

// Загружаем данные с API если передан productSlug
if (props.productSlug) {
  onMounted(async () => {
    await load(props.productSlug!);
  });
}

const transformBreadcrumb = (crumb: BreadcrumbResponse): BreadcrumbItem => {
  return {
    id: crumb.id,
    title: crumb.name || crumb.slug || '',
    slug: crumb.slug,
    url: `/category/${crumb.slug}`
  };
};

const displayBreadcrumbs = computed<BreadcrumbItem[]>(() => {
  // Если переданы items напрямую - используем их
  if (props.items && props.items.length > 0) {
    return props.items;
  }

  // Если загружены с API - преобразуем их
  if (apiBreadcrumbs.value.length > 0) {
    return apiBreadcrumbs.value.map((crumb) => transformBreadcrumb(crumb));
  }

  // Fallback - пустой массив
  return [];
});
</script>
