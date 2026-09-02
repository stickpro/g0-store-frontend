<template>
  <Transition name="fade">
    <div
        v-if="open"
        class="fixed inset-x-0 bottom-0 top-20 z-40 border-t border-zinc-600/15 bg-white"
    >
      <div class="mx-auto flex h-full min-h-0 max-w-[1552px]">
        <div v-if="isLoading" class="flex flex-1 items-center justify-center">
          <p class="text-zinc-500">Загрузка категорий...</p>
        </div>

        <div v-else-if="categories.length > 0" class="flex h-full min-w-0 flex-1">
          <ul
              class="flex h-full w-[304px] shrink-0 flex-col gap-0.5 overflow-y-auto border-r border-zinc-600/15 py-6 catalog-scroll"
              @mouseleave="clearHoverTimer"
          >
            <li v-for="(category, index) in categories" :key="category.id">
              <NuxtLink
                  :to="`/category/${category.slug}`"
                  class="flex h-8 items-center px-3 text-[15px] leading-4 text-zinc-950"
                  :class="selectedIndex === index ? 'bg-zinc-600/5' : 'hover:bg-zinc-600/5'"
                  @mouseenter="scheduleSelect(index)"
                  @click="close"
              >
                {{ category.name }}
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                  to="/category"
                  class="flex h-8 items-center justify-between px-3 text-[15px] leading-4 text-zinc-950 hover:bg-zinc-600/5"
                  @mouseenter="clearHoverTimer"
                  @click="close"
              >
                Все категории
                <span class="flex size-4 shrink-0 items-center justify-center">
                  <IconChevron />
                </span>
              </NuxtLink>
            </li>
          </ul>

          <div
              v-if="selectedCategory?.children?.length"
              class="grid h-full min-w-0 flex-1 grid-cols-3"
              @mouseenter="clearHoverTimer"
          >
            <div
                v-for="(column, columnIndex) in groupColumns"
                :key="columnIndex"
                class="h-full min-h-0 min-w-0 overflow-y-auto border-r border-zinc-600/15 py-6 catalog-scroll last:border-r-0"
            >
              <div
                  v-for="group in column"
                  :key="group.id"
                  class="flex flex-col gap-0.5"
              >
                <NuxtLink
                    :to="`/category/${group.slug}`"
                    class="flex h-8 shrink-0 items-center px-3 text-[15px] font-bold leading-6 text-zinc-950 hover:bg-zinc-600/5"
                    @click="close"
                >
                  {{ group.name }}
                </NuxtLink>

                <ul v-if="group.children?.length" class="flex flex-col gap-0.5">
                  <li v-for="child in group.children" :key="child.id">
                    <NuxtLink
                        :to="`/category/${child.slug}`"
                        class="flex h-8 items-center px-3 text-[15px] leading-4 text-zinc-950 hover:bg-zinc-600/5"
                        @click="close"
                    >
                      {{ child.name }}
                    </NuxtLink>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="flex flex-1 items-center justify-center">
          <p class="text-zinc-600">Категории не найдены</p>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { useCategoryStore } from '~/stores/category';
import type { CategoryTreeDTO } from '~/repository/types/api/generatedApiGo';
import IconChevron from '~/components/icons/IconChevron.vue';

const props = defineProps<{
  open: boolean;
}>();

const emit = defineEmits<{
  close: [];
}>();

const categoryStore = useCategoryStore();
const categories = computed(() => categoryStore.getTree);
const isLoading = computed(() => categoryStore.isLoading);

const COLUMN_COUNT = 3;
const HOVER_DELAY_MS = 220;
const selectedIndex = ref(0);
const selectedCategory = computed(() => categories.value[selectedIndex.value]);

let hoverTimer: ReturnType<typeof setTimeout> | null = null;

function clearHoverTimer() {
  if (!hoverTimer) return;
  clearTimeout(hoverTimer);
  hoverTimer = null;
}

function scheduleSelect(index: number) {
  if (index === selectedIndex.value) {
    clearHoverTimer();
    return;
  }

  clearHoverTimer();
  hoverTimer = setTimeout(() => {
    selectedIndex.value = index;
    hoverTimer = null;
  }, HOVER_DELAY_MS);
}

const groupColumns = computed(() => {
  const groups = selectedCategory.value?.children ?? [];
  const columns: CategoryTreeDTO[][] = Array.from({ length: COLUMN_COUNT }, () => []);
  const weights = Array(COLUMN_COUNT).fill(0);

  for (const group of groups) {
    const index = weights.indexOf(Math.min(...weights));
    columns[index].push(group);
    weights[index] += 1 + (group.children?.length ?? 0);
  }

  return columns;
});

function close() {
  emit('close');
}

function lockBodyScroll(lock: boolean) {
  if (!import.meta.client) return;
  document.body.style.overflow = lock ? 'hidden' : '';
}

watch(
    () => props.open,
    (isOpen) => {
      lockBodyScroll(isOpen);
      if (isOpen) {
        clearHoverTimer();
        selectedIndex.value = 0;
        categoryStore.loadTree();
      }
    },
    { immediate: true },
);

onUnmounted(() => {
  clearHoverTimer();
  lockBodyScroll(false);
});
</script>

<style scoped>
.catalog-scroll {
  scrollbar-width: thin;
  scrollbar-color: rgb(82 82 91 / 0.15) transparent;
}

.catalog-scroll::-webkit-scrollbar {
  width: 4px;
}

.catalog-scroll::-webkit-scrollbar-track {
  background: transparent;
}

.catalog-scroll::-webkit-scrollbar-thumb {
  background: rgb(82 82 91 / 0.15);
  border-radius: 9999px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
