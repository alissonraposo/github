<?php
namespace github;
require "./ConMySql.php";
use \github\ConMySql;

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");

if($_SERVER["REQUEST_METHOD"] == "POST"){
    if(isset($_POST["request"])){
        $request = $_POST["request"];
        $executor = new Executor();
        if($request == "executores"){
            if(isset($_POST["usuario"])){
                $usuario = json_decode($_POST["usuario"]);
                echo $executor->getExecutores($usuario);
            }else{
                echo json_encode(["erro" => "usuario null"]);
            }
        }else{
            echo json_encode(["erro" => "request invalido"]);            
        }
    }else{
        echo json_encode(["erro" => "request ausente"]);
    }
}else{
    echo json_encode(["erro" => "post null"]);
}


class Executor{

    public function getExecutores($usuario):string{
        if($usuario->status == "A"){
            $conn = ConMySql::getInstancia();
            $sql = '
                SELECT 
                    `id`, `nome`
                FROM `usuario` 
                WHERE executar = :executar
                ORDER BY nome';
            
            $stmt = $conn->prepare($sql);              
            $executar = 1;
            $stmt->bindParam(':executar', $executar, $conn::PARAM_INT);
            $stmt->execute();
            $results = $stmt->fetchAll();

            if(count($results) > 0){
                return json_encode($results);
            }else{
                return json_encode([]);
            }

        }else{
            return json_encode(["erro" => "usuario inativo"]);
        }
    }

}

// require './ConMySql.php';

// header('Cache-Control: no-cache, must-revalidate');    
// header("Content-Type: application/json; charser=UTF-8");
// header("HTTP/1.1 200 OK");

// $requestJson = file_get_contents("php://input");
// $request = json_decode($requestJson);
// $usuario = $request->usuario;

// if($request->request == 'executores' && $usuario->status == "A"){
//     $sql = '
//         SELECT 
//             `id`, `nome`
//         FROM `usuario` 
//         WHERE executar = ?';

//     $con = new ConMySql();
//     $con->conectar();
//     $stmt = $con->conn->prepare($sql);  
    
//     $executar = 1;
//     $stmt->bind_param('i', $executar);

//     $stmt->execute();
//     $result = $stmt->get_result();
//     $lista = $result->fetch_all(MYSQLI_ASSOC);
    
//     $con->desconectar();
    
//     echo json_encode($lista); 
// }    

?>