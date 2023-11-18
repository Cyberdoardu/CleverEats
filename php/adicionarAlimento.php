<?php
session_start();
include 'conexao.php';
include 'ztm.php';

// Verificar se existe a categoria "Geral" para o usuário
$categoriaQuery = "SELECT categoria_id FROM `food_categories` WHERE user_id = '$user_id' AND categoria_nome = 'Geral'";
$result = mysqli_query($con, $categoriaQuery);

if ($row = mysqli_fetch_assoc($result)) {
    // Categoria "Geral" já existe, usar seu categoria_id
    //$categoria_id = $row['categoria_id'];
    $categoria_id = $_POST['categoria'];
} else {
    // Categoria "Geral" não existe, criar uma nova
    $insertCategoriaQuery = "INSERT INTO `food_categories` (user_id, categoria_nome) VALUES ('$user_id', 'Geral')";
    if (mysqli_query($con, $insertCategoriaQuery)) {
        // Pegar o ID da categoria recém-criada
        $categoria_id = mysqli_insert_id($con);
    } else {
        echo "Erro ao criar categoria: " . mysqli_error($con);
        exit;
    }
}

// Pegar os valores do alimento do POST
$nome = mysqli_real_escape_string($con, $_POST['nome']);
$calorias = mysqli_real_escape_string($con, $_POST['calorias']);
$proteinas = mysqli_real_escape_string($con, $_POST['proteinas']);
$gorduras = mysqli_real_escape_string($con, $_POST['gorduras']);

// Inserir os dados do alimento na tabela `food_info`
$query = "INSERT INTO `food_info` (user_id, name, calories_per_gram, proteins_percentage, fat_percentage, categoria_id) VALUES ('$user_id', '$nome', '$calorias', '$proteinas', '$gorduras', '$categoria_id')";
if (mysqli_query($con, $query)) {
    echo "Alimento adicionado com sucesso!";
} else {
    echo "Erro ao adicionar alimento: " . mysqli_error($con);
}
?>
