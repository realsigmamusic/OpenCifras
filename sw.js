const CACHE_NAME = '26.01.15';
const ASSETS = [
	'./',
	'./index.html',
	'./style.css',
	'./manifest.json',
	'./js/app.js',
	'./js/db.js',
	'./js/ui.js',
	'./js/render.js',
	'./js/backup.js',
	'./music-note-list.svg',
	'./maskable_icon_x512.png',
	'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css',
	'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css',
	'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js',
	'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css',
	'https://cdn.jsdelivr.net/npm/chord-mark@0.17.0/+esm',
    'https://cdn.jsdelivr.net/npm/chord-mark-converters@0.17.0/+esm',
	'https://cdn.jsdelivr.net/npm/tonal@latest/browser/tonal.min.js'
];

self.addEventListener('install', (e) => {
	e.waitUntil(
		caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
	);
	self.skipWaiting();
});

self.addEventListener('activate', (e) => {
	e.waitUntil(
		caches.keys().then((keyList) => {
			return Promise.all(
				keyList.map((key) => {
					if (key !== CACHE_NAME) return caches.delete(key);
				})
			);
		})
	);
	self.clients.claim();
});

self.addEventListener('fetch', (e) => {
	e.respondWith(
		caches.match(e.request).then((cachedResponse) => {
			const fetchPromise = fetch(e.request).then((networkResponse) => {
				caches.open(CACHE_NAME).then((cache) => {
					cache.put(e.request, networkResponse.clone());
				});
				return networkResponse;
			});

			return cachedResponse || fetchPromise;
		})
	);
});