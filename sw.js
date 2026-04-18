self.addEventListener('install', event => {
    self.skipWaiting();
});

self.addEventListener('activate', event => {
    event.waitUntil(clients.claim());
});

self.addEventListener('fetch', event => {
    const url = new URL(event.request.url);

    // Tangkap file gambar dari menu "Bagikan" Android
    if (event.request.method === 'POST' && url.pathname.includes('share-target')) {
        event.respondWith((async () => {
            try {
                const formData = await event.request.formData();
                const image = formData.get('image');

                if (image) {
                    // Simpan gambar ke memori sementara (Cache)
                    const cache = await caches.open('shared-image-cache');
                    await cache.put('shared-image', new Response(image));
                }
            } catch (err) {
                console.error('Gagal menangkap gambar share:', err);
            }
            
            // Buka aplikasi Cetak Nota
            return Response.redirect('./', 303);
        })());
    }
});
