<template>
  <div class="collections-list">
    <h2 class="text-2xl font-bold mb-4">Коллекции</h2>

    <div v-if="loading" class="text-center py-8">
      <p>Загрузка...</p>
    </div>

    <div v-else-if="collections.length === 0" class="text-center py-8 text-gray-500">
      <p>Коллекций не найдено</p>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="collection in collections"
        :key="collection.id"
        class="border rounded-lg p-4 hover:shadow-lg transition-shadow cursor-pointer"
        @click="onCollectionClick(collection.slug || '')"
      >
        <h3 class="text-xl font-semibold mb-2">{{ collection.name }}</h3>
        <p v-if="collection.description" class="text-gray-600 text-sm">
          {{ collection.description }}
        </p>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="pagination && pagination.last_page > 1" class="mt-8 flex justify-center gap-2">
      <button
        v-for="page in pagination.last_page"
        :key="page"
        class="px-4 py-2 border rounded"
        :class="[
          pagination.page === page
            ? 'bg-orange-500 text-white'
            : 'hover:bg-gray-100'
        ]"
        @click="loadPage(page)"
      >
        {{ page }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCollectionStore } from "~/stores/collection";
import { storeToRefs } from "pinia";

const collectionStore = useCollectionStore();
const { collections, loading, pagination } = storeToRefs(collectionStore);

const emit = defineEmits<{
  collectionClick: [slug: string]
}>();

function onCollectionClick(slug: string) {
  emit('collectionClick', slug);
}

function loadPage(page: number) {
  collectionStore.loadCollections({ page });
}

onMounted(() => {
  collectionStore.loadCollections();
});
</script>
