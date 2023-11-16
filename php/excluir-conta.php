<?php
session_start();
include 'conexao.php'; 

$email = mysqli_real_escape_string($con, $_SESSION['email']);
$password = mysqli_real_escape_string($con, $_SESSION['hash']);

// Verifica se o e-mail e a senha correspondem aos dados no banco de dados
$loginQuery = "SELECT user_id, email, role, hash FROM `users` WHERE email = '$email'";
$result = mysqli_query($con, $loginQuery);
$user_id = 0;
if ($row = mysqli_fetch_assoc($result)) {
    if ($password != $row['hash']) {
        echo "Senha incorreta";
        echo $password;
        echo "-------";
        echo $row['hash'];
        exit();
    }
}

$user_id = $row['user_id'];


// Exclui informações do usuário das tabelas associadas TIRAR COMENTÁRIOS DEPOIS QUE FICAR PRONTO
//mysqli_query($con, "DELETE FROM `food_log` WHERE `user_id` = $user_id");
//mysqli_query($con, "DELETE FROM `food_info` WHERE `user_id` = $user_id");

// Exclui o usuário
$query = "DELETE FROM `users` WHERE `user_id` = $user_id";
if (mysqli_query($con, $query)) {
    // Encerra a sessão e redireciona para a página inicial
    session_unset();
    session_destroy();
    echo "Conta excluída com sucesso";
} else {
    echo "Erro ao excluir conta: " . mysqli_error($con);
}
?>
