export function useBodyScrollLock() {
  function setBodyScrollLocked(locked: boolean) {
    if (!import.meta.client) return

    if (locked) {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
      document.documentElement.style.overflow = 'hidden'
      document.body.style.overflow = 'hidden'
      document.body.style.paddingRight = scrollbarWidth > 0 ? `${scrollbarWidth}px` : ''
    } else {
      document.documentElement.style.overflow = ''
      document.body.style.overflow = ''
      document.body.style.paddingRight = ''
    }
  }

  return { setBodyScrollLocked }
}
