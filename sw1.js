const cacheName = "Student Restaurants";
const filesToCache = ["/", "index.html", "main.css", "build/bundle.js"];

/* Start the service worker and cache all of the app's content */
self.addEventListener("install", (e) => {
  e.waitUntil(
    (async () => {
      const cache = await caches.open(cacheName);
      try {
        await cache.addAll(filesToCache);
      } catch (error) {
        console.error("Cache addAll error:", error);
      }
    })()
  );
});

/* Serve cached content when offline */
self.addEventListener("fetch", (e) => {
  e.respondWith(
    (async () => {
      try {
        const response = await caches.match(e.request);
        return response || fetch(e.request);
      } catch (error) {
        console.error("Fetch error:", error);
        return fetch(e.request);
      }
    })()
  );
});
