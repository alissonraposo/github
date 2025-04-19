var CACHE_NAME = 'static-v013a29';
let dbName = "dbTeste";
let tbUsuario = "usuario";

var ativo = false;
setInterval(async () => {

  try {
    if(self.registration.active.state == 'activated'){
      self.registration.showNotification("actived", {body: "self.registration.active.state == 'activated'"});
      let usuarios = await getAllToArray(tbUsuario);
      let usuario = usuarios[0];
      getUsuarioPhp(usuario).then((res) => {
        self.registration.showNotification("resposta php", {body: res[0].nome});
        //console.log(self.registration);
      }).catch((erro) => {
        self.registration.showNotification("erro resposta php", {body: erro.message});
      });     
    }

  } catch (erro) {
    // ativo = false;
    console.log("NAO ESTA ATIVO",erro);
  }
  
}, 30000);

function getAllToArray(tabela){
  return new Promise((resolve, reject) => {
      abrirBancoTabelaIdb(tabela, (objectStore) => {
          let getRegistros = objectStore.getAll();
          getRegistros.onsuccess = (event) => {
              let registros = getRegistros.result;
              resolve(registros);
          };
      });                
  })
}

function abrirBancoTabelaIdb(tabela, funcao){
  let request = self.indexedDB.open(dbName,1);
  request.onerror = function (event) { console.log(`request.onerror -> ${tabela}`); };    
  request.onsuccess = function (event) {
      let db = event.target.result;
      let transaction = db.transaction([tabela], "readwrite");
      transaction.oncomplete = function (event) {            
          // console.log(`transaction.oncomplete -> ${tabela}`);   
      };
      transaction.onerror = function (event){
          log(`transaction.onerror -> ${tabela}`);
      };        
      let objectStore = transaction.objectStore(tabela);
      funcao(objectStore);
  };
}

async function getUsuarioPhp (usuario){    
  let url = "https://saaepenedo.criarsite.online/appos/dao/getUsuarioAtualizar.php"; 
  const conexao = await fetch(url,{
      method: "POST",
      headers: {
          "Content-type": "application/json"
      },
      body: JSON.stringify({
          usuario: {id: usuario.id, status: "A"},
          "id": usuario.id,
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
    self.registration.showNotification("notificacao do sync", {body: "periodicsync test"});
  }else{
    console.log("if false", event.tag);
  }
  if(event.tag === minhaTag2){
    console.log("if true 2");
    self.registration.showNotification("notificacao do sync2", {body: "periodicsync test2"});
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
