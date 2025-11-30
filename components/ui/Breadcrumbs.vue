<template>
  <nav v-if="displayBreadcrumbs.length > 0" class="flex items-center gap-2 text-sm">
    <NuxtLink
        to="/"
        class="flex items-center gap-2"
    >
      <img src="@/assets/icons/home.svg" alt="Главная"/>
    </NuxtLink>
    <img src="@/assets/icons/chevron_right.svg" alt="arrow"/>
    <NuxtLink
        to="/catalog"
        class="flex items-center gap-2"
    >
      <span
          class="text-zinc-950 font-medium"
      >
        Каталог
      </span>
    </NuxtLink>
    <img src="@/assets/icons/chevron_right.svg" alt="arrow"/>
    <NuxtLink
        v-for="(crumb, index) in displayBreadcrumbs"
        :key="crumb.id || crumb.slug || index"
        :to="crumb.url"
        class="flex items-center gap-2"
    >
      <span
          class="text-zinc-950 font-medium hover:text-zinc-600"
      >
        {{ crumb.title }}
      </span>
      <span
          v-if="index < displayBreadcrumbs.length - 1"
          class="text-zinc-400"
      >
        <img src="@/assets/icons/chevron_right.svg" alt="arrow"/>
      </span>
    </NuxtLink>
  </nav>

  <div v-else-if="loading" class="text-sm text-zinc-400">
    Загрузка...
  </div>
</template>

<script setup lang="ts">
import type {BreadcrumbDTO} from '~/repository/types/api/generatedApiGo';

interface BreadcrumbItem {
  id?: string;
  title: string;
  slug?: string;
  url: string;
}

interface Props {
  // Для загрузки с API
  productSlug?: string;
  // Для прямой передачи данных
  items?: BreadcrumbItem[];
}

const props = defineProps<Props>();

// Используем композабл для загрузки с API
const {breadcrumbs: apiBreadcrumbs, loading, load, getTitle} = useBreadcrumbs();

// Загружаем данные с API если передан productSlug
if (props.productSlug) {
  onMounted(async () => {
    await load(props.productSlug!);
  });
}

// Преобразование BreadcrumbDTO в BreadcrumbItem
const transformBreadcrumb = (crumb: BreadcrumbDTO, index: number): BreadcrumbItem => {
  return {
    id: crumb.id,
    title: crumb.meta_title || crumb.name || crumb.slug || '',
    slug: crumb.slug,
    url: `/catalog/${crumb.slug}`
  };
};

const displayBreadcrumbs = computed<BreadcrumbItem[]>(() => {
  // Если переданы items напрямую - используем их
  if (props.items && props.items.length > 0) {
    return props.items;
  }

  // Если загружены с API - преобразуем их
  if (apiBreadcrumbs.value.length > 0) {
    return apiBreadcrumbs.value.map((crumb, index) => transformBreadcrumb(crumb, index));
  }

  // Fallback - пустой массив
  return [];
});
</script>
