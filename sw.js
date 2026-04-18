self.addEventListener('install', event => {
    // Memaksa Service Worker baru untuk langsung aktif
    self.skipWaiting();
});

self.addEventListener('activate', event => {
    event.waitUntil(clients.claim());
});

self.addEventListener('fetch', event => {
    const url = new URL(event.request.url);

    // Tangkap request POST HANYA jika menuju ke URL aplikasi kita (Share Target Android).
    // JANGAN tangkap POST ke API luar seperti Gemini AI atau Google Apps Script.
    if (event.request.method === 'POST' && url.origin === location.origin) {
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
        // Biarkan request API Gemini, Google Script, CSS, dan gambar lewat dengan normal
        event.respondWith(fetch(event.request));
    }
});
