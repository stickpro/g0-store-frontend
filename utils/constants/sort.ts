export const PRODUCT_SORT_OPTIONS = [
    { value: '', label: 'По умолчанию' },
    { value: 'popular', label: 'По популярности' },
    { value: 'new', label: 'Сначала новые' },
    { value: 'price_asc', label: 'Сначала дешёвые' },
    { value: 'price_desc', label: 'Сначала дорогие' },
    { value: 'name', label: 'По названию' },
] as const;
