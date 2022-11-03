// Set a name for the current cache
var cacheName = 'kd606'; 

// Default files to always cache

	var cacheFiles = [

		'./',
		'/manifest.json',
		'/index.html',

		'/js/app.js',

		'/modules/buttons.js',
		'/modules/db_load.js',
		'/modules/db_save.js',
		'/modules/db.js',
		'/modules/idb-src.js',
		'/modules/lib.js',
		'/modules/main.js',
		'/modules/service-aktiv.js',
		'/modules/sounds.js',
		'/modules/tempo-worker.js',

		'/css/style.css',
		'/css/db_style.css',
		'/fonts/ds-digit.ttf',
		'/images/space.jpg',

		'/data/cr78.json',
		'/data/linndrum.json',
		'/data/tr606.json',
		'/data/tr707.json',
		'/data/tr808.json',
		'/data/db-loader.html',
		'/data/db-saver.html',

		'audio/cr78/bd.mp3',
		'audio/cr78/sd.mp3',
		'audio/cr78/lo-conga.mp3',
		'audio/cr78/lo-bongo.mp3',
		'audio/cr78/hi-bongo.mp3',
		'audio/cr78/cowbell.mp3',
		'audio/cr78/cymbal.mp3',
		'audio/cr78/hihat.mp3',

		'audio/linndrum/bd.mp3',
		'audio/linndrum/sd.mp3',
		'audio/linndrum/loconga.mp3',
		'audio/linndrum/hiconga.mp3',
		'audio/linndrum/clap.mp3',
		'audio/linndrum/ride.mp3',
		'audio/linndrum/ohh.mp3',
		'audio/linndrum/chh.mp3',

		'audio/tr606/bd.mp3',
		'audio/tr606/sd.mp3',
		'audio/tr606/lt.mp3',
		'audio/tr606/ht.mp3',
		'audio/tr606/cp.mp3',
		'audio/tr606/cy.mp3',
		'audio/tr606/oh.mp3',
		'audio/tr606/ch.mp3',

		'audio/tr707/707_bd.mp3',
		'audio/tr707/707_sd.mp3',
		'audio/tr707/707_ht.mp3',
		'audio/tr707/707_cb.mp3',
		'audio/tr707/707_clap.mp3',
		'audio/tr707/707_rs.mp3',
		'audio/tr707/707_hho.mp3',
		'audio/tr707/707_hhc.mp3',

		'audio/tr808/bd.mp3',
		'audio/tr808/sd.mp3',
		'audio/tr808/lt.mp3',
		'audio/tr808/ht.mp3',
		'audio/tr808/clap.mp3',
		'audio/tr808/rimshot.mp3',
		'audio/tr808/ohh.mp3',
		'audio/tr808/chh.mp3'
		
	];



self.addEventListener('install', function(e) {
    console.log('[ServiceWorker] Installed');

    // e.waitUntil Delays the event until the Promise is resolved
    e.waitUntil(

    	// Open the cache
	    caches.open(cacheName).then(function(cache) {

	    	// Add all the default files to the cache
			console.log('[ServiceWorker] Caching cacheFiles');
			return cache.addAll(cacheFiles);
	    })
	); // end e.waitUntil
});


self.addEventListener('activate', function(e) {
    console.log('[ServiceWorker] Activated');

    e.waitUntil(

    	// Get all the cache keys (cacheName)
		caches.keys().then(function(cacheNames) {
			return Promise.all(cacheNames.map(function(thisCacheName) {

				// If a cached item is saved under a previous cacheName
				if (thisCacheName !== cacheName) {

					// Delete that cached file
					console.log('[ServiceWorker] Removing Cached Files from Cache - ', thisCacheName);
					return caches.delete(thisCacheName);
				}
			}));
		})
	); // end e.waitUntil

});


self.addEventListener('fetch', function(e) {
	console.log('[ServiceWorker] Fetch', e.request.url);

	// e.respondWidth Responds to the fetch event
	e.respondWith(

		// Check in cache for the request being made
		caches.match(e.request)


			.then(function(response) {

				// If the request is in the cache
				if ( response ) {
					console.log('[ServiceWorker] Found in Cache', e.request.url, response);
					// Return the cached version
					return response;
				}

				// If the request is NOT in the cache, fetch and cache

				var requestClone = e.request.clone();
				return fetch(requestClone)
					.then(function(response) {

						if ( !response ) {
							console.log('[ServiceWorker] No response from fetch ')
							return response;
						}

						var responseClone = response.clone();

						//  Open the cache
						caches.open(cacheName).then(function(cache) {

							// Put the fetched response in the cache
							cache.put(e.request, responseClone);
							console.log('[ServiceWorker] New Data Cached', e.request.url);

							// Return the response
							return response;
			
				        }); // end caches.open

					})
					.catch(function(err) {
						console.log('[ServiceWorker] Error Fetching & Caching New Data', err);
					});


			}) // end caches.match(e.request)
	); // end e.respondWith
});