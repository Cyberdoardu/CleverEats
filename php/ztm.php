<?php

//session_start();

$email = mysqli_real_escape_string($con, $_SESSION['email']);
$password = mysqli_real_escape_string($con, $_SESSION['hash']);

// Verifica se o e-mail e a senha correspondem aos dados no banco de dados
$loginQuery = "SELECT * FROM `users` WHERE email = '$email'";
$result = mysqli_query($con, $loginQuery);

global $user_id;
$user_id = 0;
if ($row = mysqli_fetch_assoc($result)) {
    if ($password != $row['hash']) {
        echo "Senha incorreta";
        exit();
    }
    $user_id = $row['user_id'];
}



?>