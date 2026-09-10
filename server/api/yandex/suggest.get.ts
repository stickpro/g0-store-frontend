import { getQuery } from 'h3';

type SuggestQuery = {
  text?: string;
  ll?: string;
  spn?: string;
  types?: string;
  results?: string;
};

export default defineEventHandler(async (event) => {
  const query = getQuery(event) as SuggestQuery;
  const text = String(query.text || '').trim();
  if (!text) {
    return { results: [] };
  }

  const config = useRuntimeConfig();
  const apikey = String(config.public.yandexMapsApiKey || '');
  if (!apikey) {
    throw createError({ statusCode: 500, statusMessage: 'Yandex Maps API key is not configured' });
  }

  const referer = String(config.public.siteUrl || 'http://localhost:3000').replace(/\/?$/, '/');

  try {
    return await $fetch('https://suggest-maps.yandex.ru/v1/suggest', {
      query: {
        apikey,
        text,
        lang: 'ru',
        types: query.types || 'street,house',
        print_address: 1,
        results: query.results || '7',
        ...(query.ll ? { ll: query.ll } : {}),
        ...(query.spn ? { spn: query.spn } : {}),
      },
      headers: {
        Referer: referer,
      },
    });
  } catch (error) {
    const err = error as { statusCode?: number; statusMessage?: string; message?: string };
    throw createError({
      statusCode: err.statusCode || 502,
      statusMessage: err.statusMessage || err.message || 'Yandex Suggest request failed',
    });
  }
});
