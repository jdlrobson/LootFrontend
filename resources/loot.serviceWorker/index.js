var shell ='/w/index.php/Special:BlankPage',
	cacheHandler = toolbox.fastest,
	router = toolbox.router,
	staticAssets = [
		shell
	];

staticAssets.forEach( (asset) => router.get( asset, cacheHandler ) );

// Cache wikipedia images
router.get('/(.*)', cacheHandler, {
  name: 'images',
  maxEntries: 100,
  origin: /upload\.wikimedia\.org$/
})


self.oninstall = function(event) {
  event.waitUntil(self.skipWaiting());
};

self.onactivate = function(event) {
  event.waitUntil(self.clients.claim());
};
