<template>
  <section class="rounded-3xl border border-dashed border-zinc-600/15 px-4 py-5 lg:px-6">
    <h2 class="text-[17px] leading-6 text-zinc-950">Реквизиты покупателя</h2>
    <dl class="mt-3 space-y-3 text-[15px] leading-6">
      <div v-if="entity.name">
        <dt class="text-[13px] leading-4 text-zinc-500">Организация</dt>
        <dd class="mt-1 text-zinc-950">{{ entity.name }}</dd>
      </div>
      <div v-if="entity.inn" class="flex justify-between gap-4">
        <dt class="text-zinc-500">ИНН</dt>
        <dd class="font-medium text-zinc-950">{{ entity.inn }}</dd>
      </div>
      <div v-if="entity.kpp" class="flex justify-between gap-4">
        <dt class="text-zinc-500">КПП</dt>
        <dd class="font-medium text-zinc-950">{{ entity.kpp }}</dd>
      </div>
      <div v-if="entity.ogrn" class="flex justify-between gap-4">
        <dt class="text-zinc-500">ОГРН</dt>
        <dd class="font-medium text-zinc-950">{{ entity.ogrn }}</dd>
      </div>
      <div v-if="entity.address">
        <dt class="text-[13px] leading-4 text-zinc-500">Адрес</dt>
        <dd class="mt-1 text-zinc-600">{{ entity.address }}</dd>
      </div>
    </dl>
  </section>
</template>

<script setup lang="ts">
import type { LegalEntityResponse } from '~/repository/types/api/generatedApiGo';

defineProps<{
  entity: LegalEntityResponse;
}>();
</script>
