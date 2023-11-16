document.addEventListener('DOMContentLoaded', () => {
    atualizarCabecalho();
});

function atualizarCabecalho() {
    const pathname = window.location.pathname;
    const rootPath = pathname.includes('/paginas/') ? '../' : ''; // Ajusta o caminho baseado na localização atual

    $.ajax({
        url: `${rootPath}php/get-user-info.php`, // Caminho dinâmico para o script PHP
        method: 'GET',
        dataType: 'json',
        success: function(user_info) {
            const headerNav = document.getElementById('header-nav');
            let navContent = '';

            if (user_info && user_info.accountType !== "Tipo de conta não disponível") {
                navContent = `
                    <a href="${rootPath}#sobre" class="mx-2 hover:text-blue-500">Sobre</a>
                    <a href="${rootPath}#features" class="mx-2 hover:text-blue-500">Recursos</a>
                    <a href="${rootPath}#contato" class="mx-2 hover:text-blue-500">Contato</a>
                    <a href="${rootPath}paginas/alimentos" class="mx-2 hover:text-blue-500">Alimentos</a>
                    <a href="${rootPath}paginas/minhas-receitas" class="mx-2 hover:text-blue-500">Minhas Receitas</a>
                    <a href="${rootPath}paginas/perfil" class="mx-2 hover:text-blue-500">Perfil</a>
                    <a href="${rootPath}php/logout.php" class="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">Sair</a>
                `;

                if (user_info.accountType === 'paciente') {
                    navContent += `<a href="${rootPath}paginas/consultar" class="mx-2 hover:text-blue-500">Consultar</a>`;
                } else if (user_info.accountType === 'nutricionista') {
                    navContent += `<a href="${rootPath}paginas/atender" class="mx-2 hover:text-blue-500">Atender</a>`;
                }
            } else {
                navContent = `
                    <a href="${rootPath}#sobre" class="mx-2 hover:text-blue-500">Sobre</a>
                    <a href="${rootPath}#features" class="mx-2 hover:text-blue-500">Recursos</a>
                    <a href="${rootPath}#contato" class="mx-2 hover:text-blue-500">Contato</a>
                    <a href="${rootPath}paginas/entrar" class="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">Entrar</a>
                `;
            }

            headerNav.innerHTML = navContent;
        },
        error: function() {
            console.log("Erro ao obter informações do usuário");
        }
    });








    //Implementar footer padronizado em todas as páginas
    
}
