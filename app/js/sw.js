const VERSION = "v1.1"
const CACHE_NAME = `take-off-${VERSION}`;

const APP_STATIC_RESOURCES = [
    "/toff-24/",
    "/toff-24/puzzle.html",
    "/toff-24/manifest.json",
    "/toff-24/fonts/Quicksand-Light.otf",
    "/toff-24/fonts/Quicksand-Regular.otf",
    "/toff-24/game.css",
    "/toff-24/js/PuzzleSolvedHandler.js",
    "/toff-24/js/canvasEngine.js",
    "/toff-24/js/PuzzlePlayer.js",
    "/toff-24/js/blocksEngine.js",
    "/toff-24/js/Vector.js",
    "/toff-24/js/Puzzle.js",
    "/toff-24/js/PuzzleDisplayConfig.js",
    "/toff-24/js/PuzzleTools.js",
    "/toff-24/js/SwipeHandler.js",
    "/toff-24/js/PuzzleRenderer.js",
    "/toff-24/js/MathemaAPI.js",
    "/toff-24/img/icon_replay.png",
    "/toff-24/img/takeoff_logo.png",
    "/toff-24/img/icon_back.png",
    "/toff-24/icons/statsReplayIcon.png",
    "/toff-24/icons/statsMainIcon.png",
    "/toff-24/icons/quadratis192.png",
    "/toff-24/intro.css",
    "/toff-24/index.html"
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
