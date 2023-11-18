

function carregarNome() {
    $.ajax({
        url: '../php/get-user-info.php',
        method: 'GET',
        dataType: 'json',
        success: function(user_info) {
            if (user_info) {
                document.getElementById('bem-vindo').innerText = user_info.nome || "Usuário";
                // Outras informações do usuário podem ser carregadas aqui
            } else {
                console.log("Erro ao carregar informações do usuário");
            }
        },
        error: function() {
            console.log("Erro ao obter informações do usuário");
        }
    });
}

carregarNome();