<?php

namespace github;

use PDO;
use PDOException;

class ConMySql{

    private static $instancia;

    private static $serverName = "localhost";
    private static $port = "3306";
    private static $charset = "latin1";
    // private static $charset = "utf8";
        
    private static $dbName = "dbars";
    private static $userName = "alisson";
    private static $password = "123";
    
    // private static $dbName = "netmktaj_dbars";
    // private static $userName = "netmktaj_dbars";
    // private static $password = "wpCN6HQbk7mthzZ2vrxs";
    
    public static function getInstancia():PDO {
        if(empty(self::$instancia)){
            try{                
                $strConn = "mysql:host=" . self::$serverName . ";port=" . self::$port . ";dbname=" . self::$dbName . ";charset=" . self::$charset;
                self::$instancia = new PDO(
                    $strConn, 
                    self::$userName, 
                    self::$password, 
                    [
                        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_OBJ,
                        PDO::ATTR_CASE => PDO::CASE_NATURAL
                    ]
                );
            }catch(PDOException $e){
                die("Erro de conexão: {$e->getMessage()}");
            }
        }
        return self::$instancia;
    }

        
        // public function desConectar(){
        //     if (!$this->conn->connect_error) {
        //         mysqli_close($this->conn);
        //         // printf("<script>console.log(%s);</script>", "'Desconexao com sucesso'");
        //         return;
        //     }
        //     die("Falha ao desconectar" . $this->conn->connect_error);
        // }

        /*
        Banco de dados criado

        Aqui estão os detalhes da conexão para o novo banco de dados. Os detalhes da conexão devem ser armazenados em um local seguro ou na configuração do site, pois são exibidos apenas essa vez.
        Nome do host:
        localhost
        Banco de dados:
        netmktaj_dbars
        Nome de usuário:
        netmktaj_dbars
        Senha:
        wpCN6HQbk7mthzZ2vrxs
    */
}
?>