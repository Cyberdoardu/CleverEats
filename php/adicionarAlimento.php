<?php
session_start();
include 'conexao.php';
include 'ztm.php';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $nome = $_POST['nome'];
    $calorias = $_POST['calorias'];
    $proteinas = $_POST['proteinas'];
    $gorduras = $_POST['gorduras'];

    $query = "INSERT INTO food_info (user_id, name, calories_per_gram, proteins_percentage, fat_percentage) VALUES ($user_id, '$nome', $calorias, $proteinas, $gorduras)";
    if (mysqli_query($con, $query)) {
        echo "Alimento adicionado com sucesso!";
    } else {
        echo "Erro: " . mysqli_error($con);
    }
}
?>
