var CACHE_NAME = 'github-v001';

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      console.log("instal, CACHE_NAME -> " + CACHE_NAME);
      return cache.addAll(getArquivosOffline());
    })
  )
});

//fetch

  function isCacheable(request) {
    const url = new URL(request.url);
    let resposta =  !url.pathname.endsWith(".php") &&
                    !url.pathname.endsWith("relatorioOssEfotos.html") &&
                    !(url.pathname.indexOf("/osimg/") > -1);
    // console.log("resposta iscachable", resposta, url.pathname);
    return resposta;
  }

  async function cacheFirstWithRefresh(request) {
    if(navigator.onLine){
      const fetchResponsePromise = fetch(request).then(async (networkResponse) => {
        if (networkResponse.ok) {
          const cache = await caches.open(CACHE_NAME);
          cache.put(request, networkResponse.clone());
        }
        return networkResponse;
      });
      return (await caches.match(request)) || (await fetchResponsePromise);
    }else{
      return await caches.match(request);
    }
  }

  self.addEventListener("fetch", (event) => {
    if (isCacheable(event.request)) {
      event.respondWith(cacheFirstWithRefresh(event.request));
    }
  });

//end fetch


self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keyList) => {
      console.log("activate, CACHE_NAME -> " + CACHE_NAME);
      ativo = true;
      return Promise.all(
        keyList.map((key) => {
          if (key === CACHE_NAME) {
            return;
          }
          return caches.delete(key);
        }),
      );
    }),
  );
});

function getArquivosOffline(){
  return [
    'ico.png',
    'favicon.ico',
    'index.js',
    'index.html',
    // '/',
  ];
}

let log = (texto) => {
  console.log(texto);
}
