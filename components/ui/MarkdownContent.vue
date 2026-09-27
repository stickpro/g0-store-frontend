<!-- eslint-disable vue/no-v-html -- HTML is sanitized via DOMPurify in renderMarkdown -->
<template>
  <div
      class="markdown-content text-zinc-700 leading-relaxed break-words"
      v-html="html"
  />
</template>

<script setup lang="ts">
import { renderMarkdown } from '~/utils/markdown';

const props = defineProps<{
  source?: string | null;
}>();

const html = computed(() => renderMarkdown(props.source));
</script>

<style scoped>
.markdown-content :deep(p) {
  margin: 0 0 0.75em;
}

.markdown-content :deep(p:last-child) {
  margin-bottom: 0;
}

.markdown-content :deep(h1),
.markdown-content :deep(h2),
.markdown-content :deep(h3),
.markdown-content :deep(h4) {
  margin: 1.25em 0 0.5em;
  font-weight: 600;
  color: #09090b;
  line-height: 1.3;
}

.markdown-content :deep(h1) {
  font-size: 1.5rem;
}

.markdown-content :deep(h2) {
  font-size: 1.25rem;
}

.markdown-content :deep(h3),
.markdown-content :deep(h4) {
  font-size: 1.125rem;
}

.markdown-content :deep(ul),
.markdown-content :deep(ol) {
  margin: 0 0 0.75em;
  padding-left: 1.25em;
}

.markdown-content :deep(ul) {
  list-style: disc;
}

.markdown-content :deep(ol) {
  list-style: decimal;
}

.markdown-content :deep(li) {
  margin: 0.25em 0;
}

.markdown-content :deep(a) {
  color: #2563eb;
  text-decoration: underline;
  text-underline-offset: 2px;
}

.markdown-content :deep(a:hover) {
  color: #1d4ed8;
}

.markdown-content :deep(strong) {
  font-weight: 600;
  color: #09090b;
}

.markdown-content :deep(em) {
  font-style: italic;
}

.markdown-content :deep(blockquote) {
  margin: 0.75em 0;
  padding-left: 1em;
  border-left: 3px solid #e4e4e7;
  color: #52525b;
}

.markdown-content :deep(code) {
  padding: 0.1em 0.35em;
  border-radius: 0.25rem;
  background: #f4f4f5;
  font-size: 0.9em;
}

.markdown-content :deep(pre) {
  margin: 0.75em 0;
  padding: 0.75em 1em;
  overflow-x: auto;
  border-radius: 0.5rem;
  background: #f4f4f5;
}

.markdown-content :deep(pre code) {
  padding: 0;
  background: transparent;
}

.markdown-content :deep(hr) {
  margin: 1.25em 0;
  border: 0;
  border-top: 1px solid #e4e4e7;
}

.markdown-content :deep(img) {
  max-width: 100%;
  height: auto;
  border-radius: 0.5rem;
}

.markdown-content :deep(table) {
  width: 100%;
  margin: 0.75em 0;
  border-collapse: collapse;
}

.markdown-content :deep(th),
.markdown-content :deep(td) {
  padding: 0.5em 0.75em;
  border: 1px solid #e4e4e7;
  text-align: left;
}

.markdown-content :deep(th) {
  font-weight: 600;
  background: #fafafa;
}
</style>
