<?php
session_start();
include 'conexao.php';
include 'ztm.php';



// Prepare a consulta SQL
$query = $con->prepare("SELECT * FROM food_categories WHERE user_id = ?");
// Vincule as variáveis user_id e categoria_id à consulta
$query->bind_param("i", $user_id);

if ($query->execute()) {
    $result = $query->get_result();
    $categorias = $result->fetch_all(MYSQLI_ASSOC);
    echo json_encode($categorias);
} else {
    echo "Erro ao carregar categorias: " . $con->error;
}
$query->close();


$con->close();
?>



