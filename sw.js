var CACHE_NAME = 'static-v013a5';
var ativo = false;

setInterval(async () => {

  try {
    if(ativo){
      self.registration.showNotification("titulo1", {body: "teste1"});
    }
  } catch (erro) {
    
  }

}, 30000);


//setInterval(async () => {
  //const result = await checkOnlineStatus();
  // const statusDisplay = document.getElementById("statusOnline");
  // statusDisplay.innerHTML = result ? "Online" : "OFFline";
  // statusDisplay.innerHTML = result ? "" : "Trabalhando offline";
  //console.log("interval check", result);
  //var notification = new Notification("Minha notificacao. status online="+result);
//}, 30000);

//const checkOnlineStatus = async () => {
  //try {
      //let url = urlServidor + "/appos/dao/checkIfOnline.php";
      //const online = await fetch(url);
      //return online.status >= 200 && online.status < 300; // true ou false
  //} catch (err) {
      //return false; // definitivamente off-line
  //}
//};


//fetch
function isCacheable(request) {
  const url = new URL(request.url);
  return  !url.pathname.endsWith(".php") &&
          !url.pathname.endsWith("relatorioOssEfotos.html");
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

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      console.log("instal, CACHE_NAME -> " + CACHE_NAME);
      return cache.addAll([
        'github/ico.png',
        'github/favicon.ico',
        'github/index.html',
        '/',
      ]);
    })
  )
});

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

let log = (texto) => {
  console.log(texto);
}


// self.addEventListener("fetch", (event) => {
//     event.respondWith(
//       fetch(event.request).catch(async function(error) { 
//         log("catch fetch -> " + error);
//           return caches.open(CACHE_NAME).then(function(cache) {
//             log("fetch retorno off -> " + event.request);
//             log("event.request.headers.method" + event.request.headers.method);
//             let metodo = event.request.headers.method;
//             if(metodo != "POST" && metodo != undefined && metodo != null){
//               log("metodo nao é POST");
//               //return cache.match('index.html');
//             }else{
//               log("metodo POST");
//               // const init = {
//                 // 'status': 200, 
//                 // method: "POST",
//                 // headers: {
//                 //     "Content-type": "application/json"
//                 // },
//                 // "Content-type": "application/json",
//                 // 'status': 200,
//                 // 'statusText': 'Simulacao de resposta'
//               // };
//               // let respostaSimulada = new Response(JSON.stringify({status:"offline"}), init);
//               // return respostaSimulada;
//               gbStatusOnline = false;
//               // window.location.href = "https://saaepenedo.criarsite.online/index.html";
//               return JSON.stringify({ "off": "line" });
//               // return JSON.stringify('{"off":"line"}');
//               // return '{"off":"line"}';
//             }
//         });
//       })
//     );
// });
