<?php
session_start();
include 'conexao.php';
include 'ztm.php';

if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_POST['categoria_nome'])) {
    $categoria_nome = mysqli_real_escape_string($con, $_POST['categoria_nome']);

    $query = $con->prepare("INSERT INTO food_categories (user_id, categoria_nome) VALUES (?, ?)");
    $query->bind_param("is", $user_id, $categoria_nome);

    if ($query->execute()) {
        echo json_encode(["success" => true, "categoria_id" => $con->insert_id, "categoria_nome" => $categoria_nome]);
    } else {
        echo json_encode(["success" => false, "error" => $con->error]);
    }

    $query->close();
} else {
    echo json_encode(["success" => false, "error" => "Dados insuficientes"]);
}

$con->close();
?>
