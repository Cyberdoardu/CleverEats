document.addEventListener('DOMContentLoaded', () => {
    // Seleciona os formulários e os botões
    const loginForm = document.getElementById('form-login');
    const registerForm = document.getElementById('form-cadastro');
    const loginButton = document.getElementById('loginButton');
    const registerButton = document.getElementById('registerButton');
    document.getElementById('loginButton').classList.add('hidden');

    // Alternar entre formulários
    loginButton.addEventListener('click', () => {
        document.getElementById('loginForm').classList.remove('hidden');
        document.getElementById('registerButton').classList.remove('hidden');
        document.getElementById('registerForm').classList.add('hidden');
        document.getElementById('loginButton').classList.add('hidden');
    });

    registerButton.addEventListener('click', () => {
        document.getElementById('registerForm').classList.remove('hidden');
        document.getElementById('loginForm').classList.add('hidden');
        document.getElementById('loginButton').classList.remove('hidden');
        document.getElementById('registerButton').classList.add('hidden');


    });

    
        // Atualizar o hash da senha no evento de mudança
        document.getElementById("passwordLogin").addEventListener('input', async function() {
            const senhaHash = await sha512(this.value);
            document.getElementById("senha-hash").value = senhaHash;
        });

        document.getElementById("passwordRegister").addEventListener('input', async function() {
            const senhaHash = await sha512(this.value);
            document.getElementById("senha-cadastro").value = senhaHash;
        });
    });
    
    // Função para realizar o hash SHA-512
    async function sha512(str) {
        return crypto.subtle.digest("SHA-512", new TextEncoder("utf-8").encode(str)).then(buf => {
            return Array.prototype.map.call(new Uint8Array(buf), x => (('00' + x.toString(16)).slice(-2))).join('');
        });
    }
    
    // Função para cadastrar usuário
    function cadastrarUser() {
        var email = document.getElementById("emailRegister").value;
        var nome = document.getElementById("nameRegister").value;
        var sobrenome = document.getElementById("sobrenomeRegister").value;
        var hash = document.getElementById("senha-cadastro").value;
        var accountType = document.getElementById("accountType").value;
    
        var dados = new FormData();
        dados.append('email', email);
        dados.append('name', nome);
        dados.append('sobrenome', sobrenome);
        dados.append('senhaHash', hash);
        dados.append('accountType', accountType);
    
        $.ajax({
            url: '../php/entrar.php',
            method: 'POST',
            data: dados,
            processData: false,
            contentType: false,
            success: function(response) {
                if (response.trim() === "Aprovado") {
                    window.location.href = '../paginas/inicio';
                } else {
                    document.getElementById("error-message").innerText = response;
                }
            },
            error: function() {
                document.getElementById("error-message").innerText = "Erro ao realizar o cadastro";
            }
        });
    }
    
    
    // Função para logar usuário
    function logarUser() {
        var email = document.getElementById("emailLogin").value;
        var hash = document.getElementById("senha-hash").value; // Campo oculto para armazenar o hash da senha
    
        var dados = new FormData();
        dados.append('email', email);
        dados.append('senhaHash', hash);
    
        $.ajax({
            url: '../php/entrar.php',
            method: 'POST',
            data: dados,
            processData: false,
            contentType: false,
            success: function(response) {
                if (response.trim() === "Aprovado") {
                    window.location.href = '../paginas/inicio';
                } else {
                    document.getElementById("error-message").innerText = response;
                }
            },
            error: function() {
                document.getElementById("error-message").innerText = "Erro ao realizar login";
            }
        });
    }
        