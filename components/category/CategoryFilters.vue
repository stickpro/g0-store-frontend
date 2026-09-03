<template>
  <div class="w-full text-[15px] text-zinc-950">
    <section v-if="filters?.price" class="border-b border-dashed border-zinc-600/15 py-6">
      <h2 class="flex h-8 items-center px-3 text-[15px] font-bold leading-6">
        Цена ({{ CURRENCY_CODE }})
      </h2>
      <div class="flex items-center gap-2 px-3 py-2">
        <input
            v-model="priceFrom"
            type="text"
            inputmode="decimal"
            class="h-8 min-w-0 flex-1 rounded-full bg-zinc-600/5 px-3 text-[15px] leading-6 text-zinc-950 outline-none"
            :placeholder="formatBound(filters.price.min) || 'От'"
        >
        <span class="size-4 shrink-0 text-center leading-4 text-zinc-500">–</span>
        <input
            v-model="priceTo"
            type="text"
            inputmode="decimal"
            class="h-8 min-w-0 flex-1 rounded-full bg-zinc-600/5 px-3 text-[15px] leading-6 text-zinc-950 outline-none"
            :placeholder="formatBound(filters.price.max) || 'До'"
        >
        <button
            type="button"
            class="flex size-8 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white hover:bg-blue-700"
            aria-label="Применить цену"
            @click="applyPrice"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M6.4 10.6 3.8 8l-.933.933L6.4 12.467l8-8-.933-.934L6.4 10.6Z" fill="currentColor"/>
          </svg>
        </button>
      </div>
    </section>

    <section
        v-if="stockStatuses.length"
        class="flex flex-col gap-0.5 border-b border-dashed border-zinc-600/15 px-3 py-6"
    >
      <VCheckbox
          v-for="status in stockStatuses"
          :key="status.value"
          :model-value="isSelected('stock_status', status.value)"
          @update:model-value="toggleValue('stock_status', status.value)"
      >
        {{ stockLabel(status) }}
      </VCheckbox>
    </section>

    <section v-if="manufacturers.length" class="border-b border-dashed border-zinc-600/15 py-6">
      <h2 class="flex h-8 items-center px-3 text-[15px] font-bold leading-6">Бренд</h2>

      <div class="px-3 py-2">
        <div
            v-if="selectedManufacturers.length"
            class="flex h-8 items-center justify-between rounded-full bg-zinc-600/5"
        >
          <span class="truncate px-3 text-[15px] leading-6">{{ manufacturerChipLabel }}</span>
          <button
              type="button"
              class="flex size-8 shrink-0 items-center justify-center rounded-full"
              aria-label="Сбросить бренд"
              @click="clearKey('manufacturer_id')"
          >
            <IconXmark class="size-4" />
          </button>
        </div>
        <input
            v-else
            v-model="manufacturerQuery"
            type="text"
            placeholder="Бренд"
            class="h-8 w-full rounded-full bg-zinc-600/5 px-3 text-[15px] leading-6 outline-none placeholder:text-zinc-500"
        >
      </div>

      <ul class="flex flex-col gap-0.5 px-3">
        <li v-for="brand in visibleManufacturers" :key="brand.value">
          <VCheckbox
              :model-value="isSelected('manufacturer_id', brand.value)"
              @update:model-value="toggleValue('manufacturer_id', brand.value)"
          >
            {{ brand.label || brand.value }}
          </VCheckbox>
        </li>
      </ul>
    </section>

    <section
        v-for="attribute in attributes"
        :key="attribute.slug"
        class="border-b border-dashed border-zinc-600/15 py-6 last:border-b-0"
    >
      <template v-if="attribute.type === 'number'">
        <h2 class="flex h-8 items-center px-3 text-[15px] font-bold leading-6">
          {{ attributeTitle(attribute) }}
        </h2>
        <div class="flex items-center gap-2 px-3 py-2">
          <input
              v-model="ensureNumberDraft(attribute.slug!).from"
              type="text"
              inputmode="decimal"
              class="h-8 min-w-0 flex-1 rounded-full bg-zinc-600/5 px-3 text-[15px] leading-6 outline-none"
              :placeholder="formatBound(attribute.min) || 'От'"
          >
          <span class="size-4 shrink-0 text-center leading-4 text-zinc-500">–</span>
          <input
              v-model="ensureNumberDraft(attribute.slug!).to"
              type="text"
              inputmode="decimal"
              class="h-8 min-w-0 flex-1 rounded-full bg-zinc-600/5 px-3 text-[15px] leading-6 outline-none"
              :placeholder="formatBound(attribute.max) || 'До'"
          >
          <button
              type="button"
              class="flex size-8 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white hover:bg-blue-700"
              :aria-label="`Применить ${attribute.name}`"
              @click="applyNumber(attribute.slug!)"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M6.4 10.6 3.8 8l-.933.933L6.4 12.467l8-8-.933-.934L6.4 10.6Z" fill="currentColor"/>
            </svg>
          </button>
        </div>
      </template>

      <template v-else-if="attribute.type === 'boolean'">
        <VCheckbox
            class="px-3"
            :model-value="isSelected(attrKey(attribute.slug!), 'true')"
            @update:model-value="toggleValue(attrKey(attribute.slug!), 'true')"
        >
          {{ attribute.name }}
        </VCheckbox>
      </template>

      <template v-else>
        <h2 class="flex h-8 items-center px-3 text-[15px] font-bold leading-6">
          {{ attributeTitle(attribute) }}
        </h2>

        <div class="px-3 py-2">
          <div
              v-if="selectedValues(attrKey(attribute.slug!)).length"
              class="flex h-8 items-center justify-between rounded-full bg-zinc-600/5"
          >
            <span class="truncate px-3 text-[15px] leading-6">
              {{ optionLabel(attribute, selectedValues(attrKey(attribute.slug!))[0]) }}
            </span>
            <button
                type="button"
                class="flex size-8 shrink-0 items-center justify-center rounded-full"
                :aria-label="`Сбросить ${attribute.name}`"
                @click="clearKey(attrKey(attribute.slug!))"
            >
              <IconXmark class="size-4" />
            </button>
          </div>
          <input
              v-else
              v-model="optionQuery[attribute.slug!]"
              type="text"
              :placeholder="attribute.name"
              class="h-8 w-full rounded-full bg-zinc-600/5 px-3 text-[15px] leading-6 outline-none placeholder:text-zinc-500"
          >
        </div>

        <ul class="flex flex-col gap-0.5 px-3">
          <li v-for="option in visibleOptions(attribute)" :key="option.value">
            <VCheckbox
                :model-value="isSelected(attrKey(attribute.slug!), option.value)"
                @update:model-value="toggleValue(attrKey(attribute.slug!), option.value)"
            >
              {{ option.label || option.value }}
            </VCheckbox>
          </li>
        </ul>
      </template>
    </section>
  </div>
</template>

<script setup lang="ts">
import IconXmark from '~/components/icons/IconXmark.vue';
import VCheckbox from '~/components/ui/UiCheckbox/VCheckbox.vue';
import { useCategoryStore } from '~/stores/category';
import { CURRENCY_CODE } from '~/utils/constants/currency';
import { getStockStatusLabel } from '~/utils/constants/stockStatus';
import type {
    CategoryAttributeFilterResponse,
    CategoryFilterOptionResponse,
} from '~/repository/types/api/generatedApiGo';

const route = useRoute();
const categoryStore = useCategoryStore();

const slug = computed(() => String(route.params.slug || ''));
const filters = computed(() => categoryStore.getFilters(slug.value));

await useAsyncData(
    () => `category-filters-${slug.value}`,
    async () => {
      if (!slug.value) return null;
      return categoryStore.loadFilters(slug.value);
    },
    { watch: [slug] },
);

const manufacturers = computed(() => filters.value?.manufacturers || []);
const stockStatuses = computed(() => filters.value?.stock_statuses || []);
const attributes = computed(() =>
    (filters.value?.attributes || []).filter((item) => {
      if (!item.slug) return false;
      if (item.type === 'select' || item.type === 'text') return (item.options || []).length > 0;
      return true;
    }),
);

const priceFrom = ref('');
const priceTo = ref('');
const manufacturerQuery = ref('');
const optionQuery = reactive<Record<string, string>>({});
const numberDraft = reactive<Record<string, { from: string; to: string }>>({});

const selectedManufacturers = computed(() => selectedValues('manufacturer_id'));
const manufacturerChipLabel = computed(() => {
  const value = selectedManufacturers.value[0];
  const option = manufacturers.value.find((item) => item.value === value);
  return option?.label || value || '';
});

const visibleManufacturers = computed(() => {
  const query = manufacturerQuery.value.trim().toLowerCase();
  if (!query) return manufacturers.value;
  return manufacturers.value.filter((item) =>
      (item.label || item.value || '').toLowerCase().includes(query),
  );
});

watch(
    () => [route.query.price_min, route.query.price_max],
    () => {
      priceFrom.value = queryString('price_min');
      priceTo.value = queryString('price_max');
    },
    { immediate: true },
);

watch(
    attributes,
    (items) => {
      for (const attribute of items) {
        const key = attribute.slug!;
        if (attribute.type === 'number' && !numberDraft[key]) {
          numberDraft[key] = {
            from: queryString(attrKey(key) + '.min'),
            to: queryString(attrKey(key) + '.max'),
          };
        }
        if (!optionQuery[key]) optionQuery[key] = '';
      }
    },
    { immediate: true },
);

function attrKey(slug: string) {
  return `attr.${slug}`;
}

function ensureNumberDraft(slug: string) {
  if (!numberDraft[slug]) {
    numberDraft[slug] = {
      from: queryString(`${attrKey(slug)}.min`),
      to: queryString(`${attrKey(slug)}.max`),
    };
  }
  return numberDraft[slug];
}

function queryString(key: string): string {
  const raw = route.query[key];
  if (Array.isArray(raw)) return String(raw[0] || '');
  return raw ? String(raw) : '';
}

function selectedValues(key: string): string[] {
  const raw = route.query[key];
  const value = Array.isArray(raw) ? raw.filter(Boolean).join(',') : raw;
  if (!value) return [];
  return String(value).split(',').filter(Boolean);
}

function isSelected(key: string, value?: string) {
  if (!value) return false;
  return selectedValues(key).includes(value);
}

function formatBound(value?: number) {
  if (value == null || !Number.isFinite(value)) return '';
  return String(value);
}

function attributeTitle(attribute: CategoryAttributeFilterResponse) {
  if (attribute.unit) return `${attribute.name} (${attribute.unit})`;
  return attribute.name || attribute.slug || '';
}

function stockLabel(status: CategoryFilterOptionResponse) {
  return getStockStatusLabel(status.value) !== status.value
      ? getStockStatusLabel(status.value)
      : (status.label || status.value || '');
}

function optionLabel(
    attribute: CategoryAttributeFilterResponse,
    value?: string,
) {
  const option = (attribute.options || []).find((item) => item.value === value);
  return option?.label || value || '';
}

function visibleOptions(attribute: CategoryAttributeFilterResponse) {
  const options = attribute.options || [];
  const query = (optionQuery[attribute.slug!] || '').trim().toLowerCase();
  if (!query) return options;
  return options.filter((item) =>
      (item.label || item.value || '').toLowerCase().includes(query),
  );
}

async function patchQuery(patch: Record<string, string | undefined>) {
  const query = { ...route.query };
  for (const [key, value] of Object.entries(patch)) {
    if (!value) delete query[key];
    else query[key] = value;
  }
  await navigateTo({ path: route.path, query }, { replace: true });
}

function clearKey(key: string) {
  return patchQuery({ [key]: undefined });
}

function toggleValue(key: string, value?: string) {
  if (!value) return;
  const next = selectedValues(key).includes(value)
      ? selectedValues(key).filter((item) => item !== value)
      : [...selectedValues(key), value];
  return patchQuery({ [key]: next.join(',') || undefined });
}

function applyPrice() {
  return patchQuery({
    price_min: priceFrom.value.trim() || undefined,
    price_max: priceTo.value.trim() || undefined,
  });
}

function applyNumber(slug: string) {
  const draft = numberDraft[slug];
  return patchQuery({
    [`${attrKey(slug)}.min`]: draft?.from.trim() || undefined,
    [`${attrKey(slug)}.max`]: draft?.to.trim() || undefined,
  });
}
</script>
