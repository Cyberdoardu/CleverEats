<?php

session_start();

session_unset();
session_destroy();
echo "Deslogado";
header("Location: ../index.html");

?>