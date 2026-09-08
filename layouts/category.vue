<template>
  <div>
    <Header />
    <main class="relative">
      <div class="mx-auto flex max-w-[1552px]">
        <aside class="mr-6 hidden min-h-screen w-76 min-w-76 shrink-0 border-r border-dashed border-zinc-600/15 lg:block">
          <CategoryFilters />
        </aside>
        <div class="min-w-0 w-full max-w-full flex-1 px-4 py-4 lg:px-0 lg:py-6">
          <slot />
        </div>
      </div>
    </main>
    <GeoModal />

    <Teleport to="body">
      <div v-if="filtersOpen" class="fixed inset-0 z-[60] lg:hidden">
        <div class="absolute inset-0 bg-black/20 backdrop-blur-[2px]" @click="closeFilters"/>
        <div class="absolute inset-y-0 right-0 flex w-full max-w-[384px] flex-col bg-white shadow-xl">
          <div class="flex h-14 shrink-0 items-center justify-between border-b border-dashed border-zinc-600/15 px-3">
            <h2 class="px-1 text-[17px] font-medium text-zinc-950">Фильтры</h2>
            <button
                type="button"
                class="flex size-10 items-center justify-center rounded-full hover:bg-zinc-600/5"
                aria-label="Закрыть фильтры"
                @click="closeFilters"
            >
              <IconXmark/>
            </button>
          </div>
          <div class="min-h-0 flex-1 overflow-y-auto">
            <CategoryFilters />
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import Header from '~/components/layouts/header/Header.vue';
import GeoModal from '~/components/geo/GeoModal.vue';
import CategoryFilters from '~/components/category/CategoryFilters.vue';
import IconXmark from '~/components/icons/IconXmark.vue';

const route = useRoute();
const { isOpen: filtersOpen, closeFilters } = useCategoryFiltersDrawer();

watch(() => route.fullPath, () => {
  closeFilters();
});

watch(filtersOpen, (open) => {
  if (!import.meta.client) return;
  document.body.style.overflow = open ? 'hidden' : '';
});

onBeforeUnmount(() => {
  if (import.meta.client) document.body.style.overflow = '';
});
</script>
