<template>
  <div class="w-full py-8">
    <h1 class="text-3xl font-bold text-zinc-950 mb-8">Каталог</h1>

    <div v-if="isLoading" class="flex items-center justify-center py-20">
      <p class="text-zinc-500">Загрузка категорий...</p>
    </div>

    <div v-else-if="categories.length > 0" class="space-y-12">
      <!-- Root categories -->
      <div v-for="rootCategory in categories" :key="rootCategory.id" class="mb-12">
        <!-- Root category title -->
        <NuxtLink
            :to="`/category/${rootCategory.slug}`"
            class="text-2xl font-medium text-blue-600 hover:text-blue-700 mb-6 block"
        >
          {{ rootCategory.name }}
        </NuxtLink>

        <!-- Subcategories grid -->
        <div
            v-if="rootCategory.children && rootCategory.children.length > 0"
            class="grid lg:grid-cols-4 gap-8"
        >
          <div v-for="subCategory in rootCategory.children" :key="subCategory.id">
            <!-- Subcategory title -->
            <h3 class="font-medium text-zinc-950 mb-3">{{ subCategory.name }}</h3>

            <!-- Subcategory children links -->
            <ul v-if="subCategory.children && subCategory.children.length > 0" class="space-y-2">
              <li v-for="child in subCategory.children" :key="child.id">
                <NuxtLink
                    :to="`/category/${child.slug}`"
                    class="text-blue-600 hover:text-blue-700 text-sm"
                >
                  {{ child.name }}
                </NuxtLink>
              </li>
            </ul>

            <!-- If no children, link to subcategory itself -->
            <NuxtLink
                v-else
                :to="`/category/${subCategory.slug}`"
                class="text-blue-600 hover:text-blue-700 text-sm"
            >
              Смотреть все
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="text-center py-20">
      <p class="text-zinc-600">Категории не найдены</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCategoryStore } from '@/stores/category';

const categoryStore = useCategoryStore();

// Get categories from store
const categories = computed(() => categoryStore.getTree);
const isLoading = computed(() => categoryStore.isLoading);

// Load categories on mount
onMounted(async () => {
  await categoryStore.loadTree();
});

// SEO
useHead({
  title: 'Каталог товаров',
  meta: [
    { name: 'description', content: 'Каталог товаров - все категории' },
  ],
});
</script>
