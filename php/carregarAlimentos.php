<?php
session_start();
include 'conexao.php';
include 'ztm.php';


if (isset($_POST['categoria_id'])) {
    $categoria_id = $_POST['categoria_id'];

    // Prepare a consulta SQL
    $query = $con->prepare("SELECT * FROM food_info WHERE user_id = ? AND categoria_id = ?");
    // Vincule as variáveis user_id e categoria_id à consulta
    $query->bind_param("ii", $user_id, $categoria_id);

    if ($query->execute()) {
        $result = $query->get_result();
        $alimentos = $result->fetch_all(MYSQLI_ASSOC);
        echo json_encode($alimentos);
    } else {
        echo "Erro ao carregar alimentos: " . $con->error;
    }
    $query->close();
} else {
    echo "Categoria não especificada.";
}

$con->close();
?>
