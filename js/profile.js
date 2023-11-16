document.addEventListener('DOMContentLoaded', () => {
    carregarInformacoesUsuario();
    configurarEventosSenha();
});

function carregarInformacoesUsuario() {
    $.ajax({
        url: '../php/get-user-info.php',
        method: 'GET',
        dataType: 'json',
        success: function(user_info) {
            if (user_info) {
                document.getElementById('userName').innerText = user_info.email || "Usuário";
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

function configurarEventosSenha() {
    document.getElementById("newPassword").addEventListener('input', async function() {
        const senhaHash = await sha512(this.value);
        document.getElementById("passwordHash").value = senhaHash;
    });

    document.getElementById("confirmPassword").addEventListener('input', async function() {
        const senhaHash = await sha512(this.value);
        document.getElementById("passwordHash").value = senhaHash; // Atualizar o hash da senha confirmada
    });
}

function alterarSenha() {
    const novaSenha = document.getElementById("newPassword").value;
    const confirmarSenha = document.getElementById("confirmPassword").value;
    const senhaHash = document.getElementById("passwordHash").value;

    if (novaSenha !== confirmarSenha) {
        alert("As senhas não coincidem.");
        return;
    }

    $.ajax({
        url: '../php/alterar-senha.php',
        method: 'POST',
        data: { passwordHash: senhaHash },
        success: function(response) {
            alert(response);
        },
        error: function() {
            alert("Erro ao alterar a senha.");
        }
    });
}

function confirmarExclusaoConta() {
    const confirmacao = prompt("Digite 'APAGAR' para confirmar a exclusão da conta");
    if (confirmacao === "APAGAR") {
        $.ajax({
            url: '../php/excluir-conta.php',
            method: 'POST',
            success: function(response) {
                alert(response);
                window.location.href = '../index.html'; // Redireciona para a página inicial
            },
            error: function() {
                alert("Erro ao excluir a conta.");
            }
        });
    }
}


// Função para realizar o hash SHA-512
async function sha512(str) {
    return crypto.subtle.digest("SHA-512", new TextEncoder("utf-8").encode(str)).then(buf => {
        return Array.prototype.map.call(new Uint8Array(buf), x => (('00' + x.toString(16)).slice(-2))).join('');
    });
}
