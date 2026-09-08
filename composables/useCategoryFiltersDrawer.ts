export const useCategoryFiltersDrawer = () => {
  const isOpen = useState('category-filters-open', () => false);

  const openFilters = () => {
    isOpen.value = true;
  };

  const closeFilters = () => {
    isOpen.value = false;
  };

  const toggleFilters = () => {
    isOpen.value = !isOpen.value;
  };

  return {
    isOpen,
    openFilters,
    closeFilters,
    toggleFilters,
  };
};
