var CACHE_NAME = 'static-v013a24';

var ativo = false;
setInterval(async () => {

  try {
    getUsuarioPhp().then((res) => {
      if(self.registration.active.state == 'activated'){
        self.registration.showNotification("titulo1", {body: res[0].nome});
        //console.log(self.registration);
      }
    });     

  } catch (erro) {
    // ativo = false;
    console.log("NAO ESTA ATIVO",erro);
  }
  
}, 30000);

async function getUsuarioPhp (){    
  let url = "https://saaepenedo.criarsite.online/appos/dao/getUsuarioAtualizar.php"; 
  const conexao = await fetch(url,{
      method: "POST",
      headers: {
          "Content-type": "application/json"
      },
      body: JSON.stringify({
          usuario: {id: 11, status: "A"},
          "id": 11
      })
  });
  resposta = await conexao.json();
  // console.log("id ", id);
  // console.log("resposta ", resposta);
  return resposta;
}

  self.addEventListener("notificationclick", (event) => {
    console.log("On notification click: ", event.notification.tag);
    event.notification.close();
  
    // This looks to see if the current is already open and
    // focuses if it is
    // event.waitUntil(
    //   clients
    //     .matchAll({
    //       type: "window",
    //     })
    //     .then((clientList) => {
    //       for (const client of clientList) {
    //         if (client.url === "/" && "focus" in client) return client.focus();
    //       }
    //       if (clients.openWindow) return clients.openWindow("/");
    //     }),
    // );
  });

self.addEventListener("periodicsync", (event) => {
  let minhaTag = "minha-tag";
  let minhaTag2 = "minha-tag2";
  if(event.tag === minhaTag){
    console.log("if true");
    self.registration.showNotification("titulo2", {body: "teste2"});
  }else{
    console.log("if false", event.tag);
  }
  if(event.tag === minhaTag2){
    console.log("if true 2");
    self.registration.showNotification("titulo2-2", {body: "teste2-2"});
  }else{
    console.log("if false 2", event.tag);
  }
});

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      console.log("instal, CACHE_NAME -> " + CACHE_NAME);
      return cache.addAll([
        'ico.png',
        'favicon.ico',
        'index.js',
        'index.html',
        // '/',
      ]);
    })
  )
});

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


self.addEventListener("activate", (e) => {
  self.registration.showNotification("titulo1", {body: "teste1ativo"});
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
