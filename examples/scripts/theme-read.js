;(() => {
  const STORAGE_KEY = 'theme'

  function main() {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) document.documentElement.dataset.theme = stored

    window.addEventListener('storage', event => {
      if (event.key !== STORAGE_KEY) return
      if (event.newValue) {
        document.documentElement.dataset.theme = event.newValue
      } else {
        delete document.documentElement.dataset.theme
      }
    })
  }

  // Initialize on DOMContentLoaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', main)
  } else {
    main()
  }
})()
