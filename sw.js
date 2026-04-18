self.addEventListener('fetch', event => {
    if (event.request.method === 'POST' && event.request.url.includes('share-target')) {
        event.respondWith((async () => {
            const formData = await event.request.formData();
            const file = formData.get('image');
            const cache = await caches.open('shared-image-cache');
            await cache.put('shared-image', new Response(file));
            return Response.redirect('./', 303);
        })());
    }
});
