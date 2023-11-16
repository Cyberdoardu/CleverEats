<?php
    session_start();


    if (isset($_SESSION['LAST_ACTIVITY']) && (time() - $_SESSION['LAST_ACTIVITY'] > 3600)) {
        // Última atividade foi há mais de 1 hora
        session_unset();     // Esvaziar a sessão
        session_destroy();   // Destruir a sessão
    } else {
        $_SESSION['LAST_ACTIVITY'] = time(); // Atualizar o timestamp da última atividade
    }


    $user_info = array();

    if (isset($_SESSION["nome"])) {
        $user_info["nome"] = $_SESSION["name"];
    } else {
        $user_info["nome"] = "Nome não disponível";
    }

    if (isset($_SESSION["email"])) {
        $user_info["email"] = $_SESSION["email"];
    } else {
        $user_info["email"] = "E-mail não disponível";
    }

    if (isset($_SESSION["role"])) {
        $user_info["accountType"] = $_SESSION["role"];
    } else {
        $user_info["accountType"] = "Tipo de conta não disponível";
    }



    echo json_encode($user_info);

?>