let dbName = "dbTeste";
let tbUsuario = "usuario";

window.addEventListener("DOMContentLoaded", () => {
    inicio();
});

async function inicio(){
    let resposta = await criarDB();
    if(resposta){
        let registro = {id: 1, nome: "Alisson"};
        resposta = abrirBancoPutRegistro(tbUsuario, registro);
    }else{
        console.log("usuario nao foi adicionado. erro ao criar banco.");
    }
}

function abrirBancoPutRegistro(tabela, registro){
    return new Promise((resolve, reject) => {
        abrirBanco(tabela, (objectStore) => {
            if(registro != undefined && registro != null){
                let req = objectStore.put(registro);
                req.onsuccess = function (event) {
                    resolve(registro);
                }
                req.onerror = function (erro) {
                    reject(erro);
                }
            }else{
                reject();
            }
        });        
    })
}

function abrirBanco(tabela, funcao){
    let request = indexedDB.open(dbName,1);
    request.onerror = function (event) {
        log(`request.onerror -> ${tabela}`);
    };    
    request.onsuccess = function (event) {
        let db = event.target.result;
        let transaction = db.transaction([tabela], "readwrite");
        transaction.oncomplete = function (event) {            
            console.log(`transaction.oncomplete -> ${tabela}`);   
        };
        transaction.onerror = function (event){
            log(`transaction.onerror -> ${tabela}`);
        };        
        let objectStore = transaction.objectStore(tabela);
        funcao(objectStore);
    };
}

function criarDB(){
    return new Promise((resolve, reject) => {
        let request = indexedDB.open(dbName,1);
        request.onerror = function (event) {
            console.log("onerror, Erro em criarDB");
            funcao(false);
            reject(event);
        }
        request.onupgradeneeded = function (event) {
            let db = event.target.result;
            let objectStore = db.createObjectStore("usuario", {keyPath: "id"});//autoIncrement: true
            // objectStore.createIndex("fechada", "fechada", {unique: false});   
            // objectStore.createIndex("encanadorLocalidade", ["encanador","localidade"], {unique: false});   
            console.log("onupgradeneeded, banco de dados criado");
            resolve(true);
        }
        request.onsuccess = () => {
            console.log("onsuccess, banco de dados criado");
            resolve(true);
        };           
    });
}
