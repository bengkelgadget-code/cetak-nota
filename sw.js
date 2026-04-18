self.addEventListener('install', event => {
    // Memaksa Service Worker baru untuk langsung aktif
    self.skipWaiting();
});

self.addEventListener('activate', event => {
    event.waitUntil(clients.claim());
});

self.addEventListener('fetch', event => {
    // Tangkap request POST dari fitur "Bagikan" (Share Target Android)
    if (event.request.method === 'POST') {
        event.respondWith((async () => {
            try {
                const formData = await event.request.formData();
                const file = formData.get('image');
                
                if (file) {
                    // Simpan file ke cache browser agar bisa dibaca oleh index.html
                    const cache = await caches.open('shared-image-cache');
                    await cache.put('shared-image', new Response(file));
                }
            } catch (e) {
                console.error('Share Target Error:', e);
            }
            
            // Arahkan kembali ke aplikasi agar memproses gambarnya
            return Response.redirect('index.html', 303);
        })());
    } else {
        // Biarkan request biasa (CSS, gambar, dll) lewat dengan normal
        event.respondWith(fetch(event.request));
    }
});
