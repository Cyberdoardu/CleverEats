<?php
session_start();
include 'conexao.php';
include 'ztm.php';

// Verifique se os valores do POST estão presentes antes de usar
if (isset($_POST['food_id'], $_POST['nome'], $_POST['calorias'], $_POST['proteinas'], $_POST['gorduras'])) {
    $food_id = $_POST['food_id'];
    $nome = mysqli_real_escape_string($con, $_POST['nome']);
    $calorias = mysqli_real_escape_string($con, $_POST['calorias']);
    $proteinas = mysqli_real_escape_string($con, $_POST['proteinas']);
    $gorduras = mysqli_real_escape_string($con, $_POST['gorduras']);

    // Prepare a query para evitar SQL injection
    $query = $con->prepare("UPDATE food_info SET name = ?, calories_per_gram = ?, proteins_percentage = ?, fat_percentage = ? WHERE food_id = ? AND user_id = ?");
    $query->bind_param("sddiii", $nome, $calorias, $proteinas, $gorduras, $food_id, $user_id);

    if ($query->execute()) {
        echo "Sucesso";
    } else {
        echo "Erro ao atualizar alimento: " . $con->error;
    }
    $query->close();
} else {
    echo "Dados incompletos para atualização.";
}
$con->close();
?>
