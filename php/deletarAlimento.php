<?php
session_start();
include 'conexao.php';
include 'ztm.php';


if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $food_id = $_POST['food_id'];

    $query = "DELETE FROM food_info WHERE food_id = $food_id AND user_id = $user_id";
    if (mysqli_query($con, $query)) {
        echo "Alimento deletado com sucesso!";
    } else {
        //echo "Alimento deletado com sucesso!";
        echo "Erro: " . mysqli_error($con);
    }
}
?>
