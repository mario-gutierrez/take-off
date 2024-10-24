const VERSION = "v1.1.1"
const CACHE_NAME = `take-off-${VERSION}`;

const APP_STATIC_RESOURCES = [
    "/",
    "/puzzle.html",
    "/manifest.json",
    "/fonts/Quicksand-Light.otf",
    "/fonts/Quicksand-Regular.otf",
    "/game.css",
    "/js/PuzzleSolvedHandler.js",
    "/js/canvasEngine.js",
    "/js/PuzzlePlayer.js",
    "/js/blocksEngine.js",
    "/js/Vector.js",
    "/js/Puzzle.js",
    "/js/PuzzleDisplayConfig.js",
    "/js/PuzzleTools.js",
    "/js/SwipeHandler.js",
    "/js/PuzzleRenderer.js",
    "/js/MathemaAPI.js",
    "/img/icon_replay.png",
    "/img/takeoff_logo.png",
    "/img/icon_back.png",
    "/icons/statsReplayIcon.png",
    "/icons/statsMainIcon.png",
    "/icons/quadratis192.png",
    "/intro.css",
    "/index.html"
];

// When the service worker is installing, open the cache and add the precache resources to it
self.addEventListener('install', (event) => {
    console.log('Service worker install event!');
    event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_STATIC_RESOURCES)));
});

self.addEventListener('activate', (event) => {
    console.log('Service worker activate event!');
    console.log('Claiming control');
    return self.clients.claim();
});

// When there's an incoming fetch request, try and respond with a precached resource, otherwise fall back to the network
self.addEventListener('fetch', (event) => {
    console.log('Fetch intercepted for:', event.request.url);
    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) {
                return cachedResponse;
            }
            return fetch(event.request);
        }),
    );
});

// self.addEventListener("install", (event) => {
//     event.waitUntil(
//         (async () => {
//             const cache = await caches.open(CACHE_NAME);
//             cache.addAll(APP_STATIC_RESOURCES);
//         })(),
//     );
// });

// self.addEventListener("activate", (event) => {
//     event.waitUntil(
//         (async () => {
//             const names = await caches.keys();
//             await Promise.all(
//                 names.map((name) => {
//                     if (name !== CACHE_NAME) {
//                         return caches.delete(name);
//                     }
//                 }),
//             );
//             await clients.claim();
//         })(),
//     );
// });

// self.addEventListener("fetch", (event) => {
//     // when seeking an HTML page
//     if (event.request.mode === "navigate") {
//         // Return to the index.html page
//         event.respondWith(caches.match("/toff-24/"));
//         return;
//     }

//     // For every other request type
//     event.respondWith(
//         (async () => {
//             const cache = await caches.open(CACHE_NAME);
//             console.log("request: " + event.request.url);
//             const cachedResponse = await cache.match(event.request.url);
//             if (cachedResponse) {
//                 // Return the cached response if it's available.
//                 return cachedResponse;
//             }
//             // Respond with a HTTP 404 response status.
//             return new Response(null, { status: 404 });
//         })(),
//     );
// });
