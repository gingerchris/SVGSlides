importScripts(
  "https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js"
);

if (workbox) {
  workbox.routing.registerRoute(/\.js$/, new workbox.strategies.NetworkFirst());
  workbox.routing.registerRoute(
    /\.(?:png|jpg|jpeg|svg|gif|mp4|css|html)$/,
    new workbox.strategies.CacheFirst({
      cacheName: "asset-cache"
    })
  );
  workbox.routing.registerRoute(
    /logos\/(.*)/,
    new workbox.strategies.CacheFirst({
      cacheName: "logo-cache"
    })
  );
  workbox.routing.registerRoute(
    /slides\/425\/busts\/(.*)/,
    new workbox.strategies.CacheFirst({
      cacheName: "bust-cache"
    })
  );
} else {
  console.log(`Boo! Workbox didn't load 😬`);
}
