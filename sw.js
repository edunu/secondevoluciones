const CACHE ='cache-1';
const CACHE_DINAMICO ='dinamico-1';
const CACHE_INMUTABLE ='inmutable-1';

self.addEventListener('install', evento=>{

    const promesa =caches.open(CACHE)
        .then(cache=>{
            return cache.addAll([
                '/',
                '/index.html',
                '/pages/offline.html',
                'css/bootstrap.min.css',
                'css/style.css',
                'css/responsive.css',
                'images/logo1.png',
                'css/jquery.mCustomScrollbar.min.css',
                'manifest.json',
                'images/box.gif',
                'images/search_icon.png',
                'images/banner.jpg',
                'images/banner2.jpg',
                'images/banner3.jpg',
                'images/about.png',
                'images/1.png',
                'images/2.png',
                'images/3.png',
                'images/4.png',
                'images/5.png',
                'images/6.png',
                'images/star.png',
                'icon/icon64.png',
                'icon/iconfb.png',
                'icon/iconig.png',
                'icon/icontt.png',
                'js/jquery.min.js',
                'js/popper.min.js',
                'js/bootstrap.bundle.min.js',
                'js/jquery-3.0.0.min.js',
                'js/plugin.js',
                'js/jquery.mCustomScrollbar.concat.min.js',
                'js/custom.js',
                'js/app.js'
            ]);
        });

    const cacheInmutable = caches.open(CACHE_INMUTABLE)
        .then(cache=>{
            cache.add('https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css');
        });
    evento.waitUntil(Promise.all([promesa, cacheInmutable]));
});

self.addEventListener('fetch', evento =>{

    const respuesta=caches.match(evento.request)
        .then(res=>{
            if (res) return res;
            console.log('No existe', evento.request.url);
            return fetch(evento.request)
                .then(resWeb=>{
                    caches.open(CACHE_DINAMICO)
                        .then(cache=>{
                            cache.put(evento.request,resWeb);
                            limpiarCache(CACHE_DINAMICO,50);
                        })
                    return resWeb.clone();
                });
        })
        .catch(err => {
            if(evento.request.headers.get('accept').includes('text/html')){
                return caches.match('/pages/offline.html');
            }
        });
     evento.respondWith(respuesta);
});

function limpiarCache(nombreCache, numeroItems){
    caches.open(nombreCache)
       .then(cache=>{
            return cache.keys()
                .then(keys=>{
                    if (keys.length>numeroItems){
                        cache.delete(keys[0])
                            .then(limpiarCache(nombreCache, numeroItems));
                        }
                    });
        });
}   