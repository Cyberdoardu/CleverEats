<?php
session_start();
include 'conexao.php';
include 'ztm.php';

// Verifica se o ID da categoria foi passado
if (isset($_POST['categoria_id'])) {
    $categoria_id = $_POST['categoria_id'];

    // Inicia uma transação para garantir a integridade dos dados
    $con->begin_transaction();

    try {
        // Primeiro, apaga todos os alimentos dessa categoria
        $query = $con->prepare("DELETE FROM food_info WHERE user_id = ? AND categoria_id = ?");
        $query->bind_param("ii", $user_id, $categoria_id);
        $query->execute();
        $query->close();

        // Em seguida, apaga a categoria em si
        $query = $con->prepare("DELETE FROM food_categories WHERE user_id = ? AND categoria_id = ?");
        $query->bind_param("ii", $user_id, $categoria_id);
        $query->execute();
        $query->close();

        // Se tudo ocorrer bem, commita as alterações
        $con->commit();
        echo "Categoria apagada com sucesso!";
    } catch (Exception $e) {
        // Se ocorrer algum erro, faz rollback e mostra mensagem de erro
        $con->rollback();
        echo "Erro ao apagar categoria: " . $e->getMessage();
    }

    $con->close();
} else {
    echo "Categoria não especificada.";
}
?>
