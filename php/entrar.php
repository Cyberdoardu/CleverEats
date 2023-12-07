<?php

// Inicia a sessão PHP
include "conexao.php";
session_start();


// Verifica a conexão
if (mysqli_connect_errno()) {
    die("Falha na conexão: " . mysqli_connect_error());
}

// Verifica se os dados foram postados
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $email = strtolower(mysqli_real_escape_string($con, $_POST['email']));
    $password = mysqli_real_escape_string($con, $_POST['senhaHash']); // A senha já está em hash

    // Verifica se está realizando login ou cadastro
    if (isset($_POST['accountType'])) {
        // Processo de Cadastro
        if (isset($_POST['name']) && isset($_POST['sobrenome']) && isset($_POST['accountType']) && isset($_POST['email']) && isset($_POST['senhaHash'])) {
            $name = mysqli_real_escape_string($con, $_POST['name']);
            $sobrenome = mysqli_real_escape_string($con, $_POST['sobrenome']);
            $accountType = mysqli_real_escape_string($con, $_POST['accountType']);

            if ($accountType !== 'paciente' && $accountType !== 'nutricionista') {
                echo "Tipo de conta inválido.";
                exit();
            }

            // Verifica se o e-mail já existe
            $query = "SELECT user_id FROM `users` WHERE email = '$email'";
            $result = mysqli_query($con, $query);
            if (mysqli_num_rows($result) > 0) {
                echo "E-mail já cadastrado.";
            } else {
                // Insere os dados do usuário no banco de dados
                $insertQuery = "INSERT INTO `users` (`name`, `sobrenome`, `email`, `hash`, `role`) VALUES ('$name', '$sobrenome', '$email', '$password', '$accountType')";
                if (mysqli_query($con, $insertQuery)) {
                    // Cria a sessão do usuário

                    $_SESSION["name"] = $name;
                    $_SESSION["role"] = $accountType;
                    $_SESSION['LAST_ACTIVITY'] = time();
                    $_SESSION['email'] = $email;
                    $_SESSION['hash'] = $password;
                    // Redireciona para a página de início
                    echo ("Aprovado");

                    exit();
                } else {
                    echo "Erro: " . mysqli_error($con);
                }
            }
        } else {
            echo "Dados de cadastro incompletos.";
        }
    } else {
        // Processo de Login
            $email = mysqli_real_escape_string($con, $_POST['email']);
            $password = mysqli_real_escape_string($con, $_POST['senhaHash']);
        
            // Verifica se o e-mail e a senha correspondem aos dados no banco de dados
            $loginQuery = "SELECT email, role, hash FROM `users` WHERE email = '$email'";
            $result = mysqli_query($con, $loginQuery);
        
            if ($row = mysqli_fetch_assoc($result)) {
                if ($password == $row['hash']) {
                    // Cria a sessão do usuário
                    
                    // Usar cookies seguros
                    ini_set('session.cookie_httponly', 1);
                    ini_set('session.cookie_secure', 1);
                    ini_set('session.use_only_cookies', 1);

                    // Gerar um novo ID de sessão a cada login para evitar roubo de sessão
                    session_regenerate_id(true);

                    $_SESSION["name"] = $row["name"];
                    $_SESSION["role"] = $row["role"];
                    $_SESSION['LAST_ACTIVITY'] = time();
                    $_SESSION['email'] = $email;
                    $_SESSION['hash'] = $password;
                    // Redireciona para a página de início
                    echo ("Aprovado");
                    exit();
                } else {
                    echo "E-mail ou senha inválidos.";
                }
            } else {
                echo "E-mail ou senha inválidos.";
            }


        

    } 
}

// Fecha a conexão
mysqli_close($con);
?>
