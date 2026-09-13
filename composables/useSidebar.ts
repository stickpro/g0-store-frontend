export const useSidebar = () => {
  const isOpen = useState('sidebar-open', () => false)

  const closeSidebar = () => {
    isOpen.value = false
  }

  const openSidebar = () => {
    const { closeCart } = useCartDrawer()
    closeCart()
    isOpen.value = true
  }

  const toggleSidebar = () => {
    if (isOpen.value) {
      closeSidebar()
    } else {
      openSidebar()
    }
  }

  return {
    isOpen,
    toggleSidebar,
    closeSidebar,
    openSidebar
  }
}
