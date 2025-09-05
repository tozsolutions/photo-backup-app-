if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js', { scope: '/' })
      // eslint-disable-next-line no-console
      console.log('Service worker registered', registration.scope)
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Service worker registration failed', error)
    }
  })
}