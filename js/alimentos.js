var cardsInfo = {};
var currentCategoriaId = 1;

document.addEventListener('DOMContentLoaded', () => {

    // Verifica se o usuario está logado, senão redirect
    $.ajax({
        url: '../php/get-user-info.php',
        method: 'POST',
        dataType: 'json',
        success: function(user_info) {
            if (user_info && user_info.accountType !== "Tipo de conta não disponível") {
                if (user_info.accountType === 'nutricionista' || user_info.accountType === 'paciente') {
                    // Não fazer nada
                }
            } else {
                alert("Você não tem permissão para acessar esta página.");
                window.location.href = "../";
            }
        },
        error: function() {
            alert("Erro ao obter informações do usuário");
            window.location.href = "../";
        }
    });


    carregarLista(1);
    carregarCategorias();
});



function carregarCategorias() {
    $.ajax({
        url: '../php/carregarCategorias.php',
        method: 'GET',
        success: function(response) {
            var categorias = JSON.parse(response);
            $('#listaCategorias').empty();
            categorias.forEach(function(categoria) {
                $('#listaCategorias').append(`
                    <div onclick="carregarLista(${categoria.categoria_id})" class="flex justify-between items-center bg-gray-100 mt-2 py-2 px-2 rounded hover:bg-blue-100">
                        <button class="text-black">${categoria.categoria_nome}</button>
                        <button onclick="apagarCategoria(${categoria.categoria_id})" class="bg-red-400 text-white px-2 py-1 rounded hover:bg-red-700">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </div>
                `);
            });
        },
        error: function(jqXHR, textStatus, errorThrown) {
            alert("Erro ao carregar categorias: " + textStatus);
        }
    });
}

function apagarCategoria(categoriaId) {
    if (!confirm("Tem certeza que deseja apagar esta categoria?")) {
        return;
    }

    $.ajax({
        url: '../php/apagarCategoria.php',
        method: 'POST',
        data: { categoria_id: categoriaId },
        success: function(response) {
            if (response === "Categoria apagada com sucesso!") {
                alert("Categoria apagada com sucesso!");
                carregarCategorias(); // Recarregar as categorias
            } else {
                alert("Erro ao apagar categoria: " + response);
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            alert("Erro na requisição: " + textStatus);
        }
    });
}



function adicionarCategoria() {
    var categoriaNome = $('#novaCategoria').val();

    if (!categoriaNome) {
        alert("Por favor, insira o nome da categoria.");
        return;
    }

    $.ajax({
        url: '../php/novaCategoria.php',
        method: 'POST',
        data: { categoria_nome: categoriaNome },
        success: function(response) {
            var data = JSON.parse(response);
            if (data.success) {
                $('#listaCategorias').append(`
                <div onclick="carregarLista(${data.categoria_id})" class="flex justify-between items-center bg-gray-100 mt-2 py-2 px-2 rounded hover:bg-blue-100">
                <button class="text-black">${data.categoria_nome}</button>
                <button onclick="apagarCategoria(${data.categoria_id})" class="bg-red-400 text-white px-2 py-1 rounded hover:bg-red-700">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </div>                `);
                $('#novaCategoria').val(''); // Limpa o campo de entrada
            } else {
                alert("Erro ao adicionar categoria: " + data.error);
            }
        },
        error: function() {
            alert("Erro ao enviar solicitação.");
        }
    });
}


function carregarLista(categoriaId) {
    currentCategoriaId = categoriaId;
    console.log("Carregando alimentos da categoria " + categoriaId);
    // Limpa o grid de alimentos antes de carregar novos itens
    $('#gridAlimentos').empty();

    //Adiciona card para adição de novos cards
    $('#gridAlimentos').append(`

    <div class="rounded-lg shadow-lg p-4 border-2 border-dashed border-gray-400 bg-white bg-opacity-50">
        <h3 class="mb-2 text-lg font-bold text-gray-700">Adicionar Novo Alimento</h3>
        <input type="text" id="novoNomeAlimento" placeholder="Nome do Alimento" class="w-full mb-2 px-2 py-1 border border-gray-300 rounded shadow-sm">
        <input type="number" id="novaCaloriaAlimento" placeholder="Calorias" class="w-full mb-2 px-2 py-1 border border-gray-300 rounded shadow-sm">
        <input type="number" id="novaGorduraAlimento" placeholder="Gordura (%)" class="w-full mb-2 px-2 py-1 border border-gray-300 rounded shadow-sm">
        <input type="number" id="novaProteinaAlimento" placeholder="Proteínas (%)" class="w-full mb-2 px-2 py-1 border border-gray-300 rounded shadow-sm">
        <button onclick="adicionarAlimento()" class="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-opacity-50">Adicionar</button>
    </div>
    `);

    // Cria um objeto com os dados a serem enviados
    var dados = { categoria_id: categoriaId };

    // Realiza a requisição para o servidor utilizando jQuery AJAX
    $.ajax({
        url: '../php/carregarAlimentos.php',
        method: 'POST',
        data: dados,
        success: function(response) {
            var alimentos = JSON.parse(response);
            alimentos.forEach(function(alimento) {
                adicionarCardAoGrid(alimento.food_id, alimento.name, alimento.calories_per_gram, alimento.proteins_percentage, alimento.fat_percentage);
            });
        },
        error: function(jqXHR, textStatus, errorThrown) {
            alert("Erro ao carregar alimentos: " + textStatus);
        }
    });
}


function adicionarAlimento() {
    var nome = $('#novoNomeAlimento').val();
    var calorias = $('#novaCaloriaAlimento').val();
    var proteinas = $('#novaProteinaAlimento').val();
    var gorduras = $('#novaGorduraAlimento').val();

    // Validação básica
    if (!nome || !calorias || !proteinas || !gorduras) {
        alert("Preencha todos os campos do alimento.");
        return;
    }


    console.log("Adicionando alimento " + nome + " à categoria " + currentCategoriaId);

    // Cria um objeto com os dados a serem enviados
    var dados = {
        nome: nome,
        calorias: calorias,
        proteinas: proteinas,
        gorduras: gorduras,
        categoria: currentCategoriaId
    };

    // Realiza a requisição para o servidor utilizando jQuery AJAX
    $.ajax({
        url: '../php/adicionarAlimento.php',
        method: 'POST',
        data: dados,
        success: function(data) {
            if (data.includes("Alimento adicionado com sucesso!")) {
                // Se for bem sucedido, adiciona o card ao grid
                adicionarCardAoGrid(data.food_id, nome, calorias, proteinas, gorduras);
                //alert("Alimento adicionado com sucesso!");
                // Recarregar ou atualizar os elementos da página conforme necessário
            } else {
                // Se houver um erro, exibe uma mensagem
                alert("Erro ao adicionar alimento: " + data);
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            // Em caso de erro na requisição, exibe uma mensagem
            alert("Erro na requisição: " + textStatus);
        }
    });
}


function adicionarCardAoGrid(foodId, nome, calorias, proteinas, gorduras) {
    // Construa o ID do card
    var cardId = 'cardAlimento-' + foodId;

    // Crie o HTML do card
    var cardHTML = `
        <div class="bg-white rounded-lg shadow-lg p-4" id="${cardId}">
            <h3 class="nomeAlimento text-lg font-bold text-gray-700">${nome}</h3>
            <p class="caloriasAlimento">Calorias: ${calorias} cal/g</p>
            <p class="proteinasAlimento">Proteínas: ${proteinas} %</p>
            <p class="gordurasAlimento">Gorduras: ${gorduras} %</p>
            <div class="flex space-x-2 mt-4">
                <button onclick="editarCard('${cardId}')" class="bg-blue-500 rounded hover:bg-blue-700 text-white px-4 py-2 rounded"><i class="fas fa-edit"></i></button>
                <button onclick="deletarCard('${cardId}')" class="bg-red-500 rounded hover:bg-red-700 text-white px-4 py-2 rounded"><i class="fas fa-trash-alt"></i></button>
            </div>
        </div>
    `;

    // Adicione o card ao grid
    $('#gridAlimentos').append(cardHTML);

    // Atualize o objeto cardsInfo
    cardsInfo[cardId] = {
        nome: nome,
        calorias: calorias,
        proteinas: proteinas,
        gorduras: gorduras,
        categoria: currentCategoriaId
    };
}



function atualizarAlimento(foodId) {
    const dados = new URLSearchParams({
        food_id: foodId,
        nome: document.getElementById("nomeAlimento" + foodId).value,
        descricao: document.getElementById("descricaoAlimento" + foodId).value,
        calorias: document.getElementById("caloriasAlimento" + foodId).value,
        proteinas: document.getElementById("proteinasAlimento" + foodId).value,
        gorduras: document.getElementById("gordurasAlimento" + foodId).value,
        categoria: currentCategoriaId
    });

    fetch('../php/atualizarAlimento.php', {
        method: 'POST',
        body: dados
    }).then(response => response.text())
      .then(data => {
          alert(data);
          // Atualizar o card do alimento aqui
      }).catch(error => console.error('Erro:', error));
}



function deletarAlimento(foodId) {
    const dados = new URLSearchParams({
        food_id: foodId
    });

    fetch('../php/deletarAlimento.php', {
        method: 'POST',
        body: dados
    }).then(response => response.text())
      .then(data => {
          alert(data);
          // Remover o card do alimento aqui
      }).catch(error => console.error('Erro:', error));
}


async function salvarEdicao(cardId) {
    const card = document.getElementById(cardId);

    const foodId = cardId.split('-')[1];

    // Captura os valores editados
    const nomeAlimento = card.querySelector('.nomeAlimento').value;
    const caloriasAlimento = card.querySelector('.caloriasAlimento').value;
    const proteinasAlimento = card.querySelector('.proteinasAlimento').value;
    const gordurasAlimento = card.querySelector('.gordurasAlimento').value;

    // Prepara os dados para envio
    const dados = new FormData();
    dados.append('food_id', foodId);
    dados.append('nome', nomeAlimento);
    dados.append('calorias', caloriasAlimento);
    dados.append('proteinas', proteinasAlimento);
    dados.append('gorduras', gordurasAlimento);
    dados.append('categoria', currentCategoriaId);

    // Envia os dados para o servidor via AJAX
    try {
        const resposta = await fetch('../php/atualizarAlimento.php', {
            method: 'POST',
            body: dados
        });

        const retorno = await resposta.text();
        if (retorno === 'Sucesso') {
            transformarCardFixo(cardId);
        } else {
            alert('Erro ao salvar: ' + retorno);
        }
    } catch (erro) {
        alert('Erro ao enviar dados: ' + erro);
    }

    cardsInfo[cardId] = {
        nome: nomeAlimento,
        calorias: caloriasAlimento,
        proteinas: proteinasAlimento,
        gorduras: gordurasAlimento,
        categoria: currentCategoriaId
    };


    transformarCardFixo(cardId);

}



function cancelarEdicao(cardId) {
    transformarCardFixo(cardId);
}


function editarCard(cardId) {
    const card = document.getElementById(cardId);

    // Captura os valores atuais do card
    const nomeAlimento = card.querySelector('.nomeAlimento').innerText;
    const caloriasAlimento = card.querySelector('.caloriasAlimento').innerText.split(" ")[1];
    const proteinasAlimento = card.querySelector('.proteinasAlimento').innerText.split(" ")[1];
    const gordurasAlimento = card.querySelector('.gordurasAlimento').innerText.split(" ")[1];

    // Gera o HTML para o modo de edição
    const cardEditavelHTML = `
    <h3 class="mb-2 text-lg font-bold text-gray-700">${nomeAlimento}</h3>
    <input type="text" placeholder="Nome do Alimento" value="${nomeAlimento}" class="nomeAlimento w-full mb-2 px-2 py-1 border border-gray-300 rounded shadow-sm">
    <input type="number" placeholder="Calorias (${caloriasAlimento} cal/g)" value=${caloriasAlimento} class="caloriasAlimento w-full mb-2 px-2 py-1 border border-gray-300 rounded shadow-sm">
    <input type="number" placeholder="Gordura (${gordurasAlimento}%)" value=${gordurasAlimento} class="gordurasAlimento w-full mb-2 px-2 py-1 border border-gray-300 rounded shadow-sm">
    <input type="number" placeholder="Proteínas (${proteinasAlimento}%)" value=${proteinasAlimento} class="proteinasAlimento w-full mb-2 px-2 py-1 border border-gray-300 rounded shadow-sm">
    <div class="flex space-x-2 mt-4">
    <button onclick="salvarEdicao('${cardId}')" class="bg-blue-500 text-white px-4 py-2 rounded"><i class="fas fa-save"></i></button>
    <button onclick="cancelarEdicao('${cardId}')" class="bg-red-500 text-white px-4 py-2 rounded"><i class="fas fa-times"></i></button>
    <button onclick="deletarCard('${cardId}')" class="bg-red-500 text-white px-4 py-2 rounded"><i class="fas fa-trash-alt"></i></button>
    </div>

 
    `;

    // Atualiza o HTML do card
    card.innerHTML = cardEditavelHTML;
}


function transformarCardFixo(cardId) {
    const card = document.getElementById(cardId);

    // Verifica se as informações do card estão presentes no objeto cardsInfo
    if (cardsInfo[cardId]) {
        const nome = cardsInfo[cardId].nome;
        const calorias = cardsInfo[cardId].calorias;
        const proteinas = cardsInfo[cardId].proteinas;
        const gorduras = cardsInfo[cardId].gorduras;

        // Gera o HTML para o modo de visualização
        const cardFixoHTML = `
                <h3 class="nomeAlimento text-lg font-bold text-gray-700">${nome}</h3>
                <p class="caloriasAlimento">Calorias: ${calorias} cal/g</p>
                <p class="proteinasAlimento">Proteínas: ${proteinas} %</p>
                <p class="gordurasAlimento">Gorduras: ${gorduras} %</p>
                <div class="flex space-x-2 mt-4">
                    <button onclick="editarCard('${cardId}')" class="bg-blue-500 rounded hover:bg-blue-700 text-white px-4 py-2 rounded"><i class="fas fa-edit"></i></button>
                    <button onclick="deletarCard('${cardId}')" class="bg-red-500 rounded hover:bg-red-700 text-white px-4 py-2 rounded"><i class="fas fa-trash-alt"></i></button>
                </div>
        `;

        // Atualiza o HTML do card
        card.innerHTML = cardFixoHTML;
    } else {
        alert('Erro: Informações do card não encontradas.');
    }
}


function deletarCard(cardId) {

    const foodId = cardId.split('-')[1];

    // Confirmar com o usuário antes de excluir
    if (!confirm("Tem certeza que deseja deletar este alimento?")) {
        return;
    }

    // Cria um objeto com os dados a serem enviados
    var dados = { food_id: foodId };

    // Realiza a requisição para o servidor utilizando jQuery AJAX
    $.ajax({
        url: '../php/deletarAlimento.php',
        method: 'POST',
        data: dados,
        success: function(data) {
            if (data.includes("Alimento deletado com sucesso!")) {
                // Se for bem sucedido, remove o card do grid
                $('#cardAlimento-' + foodId).remove();
                alert("Alimento deletado com sucesso!");
            } else {
                // Se houver um erro, exibe uma mensagem
                alert("Erro ao deletar alimento: " + data);
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            // Em caso de erro na requisição, exibe uma mensagem
            alert("Erro na requisição: " + textStatus);
        }
    });
}

