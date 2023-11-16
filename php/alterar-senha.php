<?php
session_start();
include "conexao.php"; 


$email = mysqli_real_escape_string($con, $_SESSION['email']);
$password = mysqli_real_escape_string($con, $_SESSION['hash']);

// Verifica se o e-mail e a senha correspondem aos dados no banco de dados
$loginQuery = "SELECT user_id, email, role, hash FROM `users` WHERE email = '$email'";
$result = mysqli_query($con, $loginQuery);
$user_id = 0;
if ($row = mysqli_fetch_assoc($result)) {
    if ($password != $row['hash']) {
        echo "Senha incorreta";
        exit();
    }
}

$user_id = $row['user_id'];
$senhaHash = $_POST['passwordHash'];

// Atualiza a senha do usuário no banco de dados
$query = "UPDATE `users` SET `hash` = '$senhaHash' WHERE `user_id` = $user_id";
if (mysqli_query($con, $query)) {
    $_SESSION['hash'] = $senhaHash;
    echo "Senha alterada com sucesso";
} else {
    echo "Erro ao alterar a senha: " . mysqli_error($con);
}
?>


