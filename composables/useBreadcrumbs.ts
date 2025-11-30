import type { BreadcrumbDTO } from '~/repository/types/api/generatedApiGo';

/**
 * Композабл для работы с хлебными крошками товара
 * Загружает хлебные крошки с бекенда и кэширует их
 *
 * @example
 * const { breadcrumbs, loading, error, load } = useBreadcrumbs();
 * await load('iphone-15-pro');
 */
export const useBreadcrumbs = () => {
  const { $api } = useNuxtApp();

  const breadcrumbs = ref<BreadcrumbDTO[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  /**
   * Загрузить хлебные крошки для товара
   * @param slug - slug товара
   */
  const load = async (slug: string) => {
    if (!slug) {
      error.value = 'Slug не указан';
      return;
    }

    loading.value = true;
    error.value = null;

    try {
      breadcrumbs.value = await $api.product.getBreadcrumbsBySlug(slug);
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Ошибка загрузки хлебных крошек';
      console.error('Ошибка загрузки хлебных крошек:', e);
    } finally {
      loading.value = false;
    }
  };

  /**
   * Очистить хлебные крошки
   */
  const clear = () => {
    breadcrumbs.value = [];
    error.value = null;
  };

  /**
   * Построить URL из хлебной крошки
   * @param crumb - хлебная крошка
   * @param index - индекс крошки в массиве
   */
  const buildUrl = (crumb: BreadcrumbDTO, index: number): string => {
    // Если это первая крошка (обычно "Главная")
    if (index === 0) {
      return '/';
    }

    // Строим URL из slug
    return crumb.slug ? `/product/${crumb.slug}` : '#';
  };

  /**
   * Получить название для отображения
   * @param crumb - хлебная крошка
   */
  const getTitle = (crumb: BreadcrumbDTO): string => {
    return crumb.meta_title || crumb.name || crumb.slug || '';
  };

  return {
    breadcrumbs: readonly(breadcrumbs),
    loading: readonly(loading),
    error: readonly(error),
    load,
    clear,
    buildUrl,
    getTitle,
  };
};
