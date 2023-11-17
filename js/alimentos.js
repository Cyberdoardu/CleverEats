var cardsInfo = {};

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

    // Cria um objeto com os dados a serem enviados
    var dados = {
        nome: nome,
        calorias: calorias,
        proteinas: proteinas,
        gorduras: gorduras
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
                alert("Alimento adicionado com sucesso!");
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
                <button onclick="editarCard('${cardId}')" class="bg-blue-500 text-white px-4 py-2 rounded"><i class="fas fa-edit"></i></button>
                <button onclick="deletarCard('${cardId}')" class="bg-red-500 text-white px-4 py-2 rounded"><i class="fas fa-trash-alt"></i></button>
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
        gorduras: gorduras
    };
}



function atualizarAlimento(foodId) {
    const dados = new URLSearchParams({
        food_id: foodId,
        nome: document.getElementById("nomeAlimento" + foodId).value,
        descricao: document.getElementById("descricaoAlimento" + foodId).value,
        calorias: document.getElementById("caloriasAlimento" + foodId).value,
        proteinas: document.getElementById("proteinasAlimento" + foodId).value,
        gorduras: document.getElementById("gordurasAlimento" + foodId).value
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
    const descricaoAlimento = card.querySelector('.descricaoAlimento').value;
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

    // Envia os dados para o servidor via AJAX
    try {
        const resposta = await fetch('../php/atualizarAlimento.php', {
            method: 'POST',
            body: dados
        });

        const retorno = await resposta.text();
        if (retorno === 'Sucesso') {
            transformarCardFixo(cardId, nomeAlimento, descricaoAlimento, caloriasAlimento, proteinasAlimento, gordurasAlimento);
        } else {
            alert('Erro ao salvar: ' + retorno);
        }
    } catch (erro) {
        alert('Erro ao enviar dados: ' + erro);
    }
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


function transformarCardFixo(cardId, nome, calorias, proteinas, gorduras) {
    const card = document.getElementById(cardId);

    const cardFixoHTML = `
    <div class="bg-white rounded-lg shadow-lg p-4" id="${cardId}">
    <h3 class="nomeAlimento text-lg font-bold text-gray-700">${nome}</h3>
    <p class="caloriasAlimento">Calorias: ${calorias} cal/g</p>
    <p class="proteinasAlimento">Proteínas: ${proteinas} %</p>
    <p class="gordurasAlimento">Gorduras: ${gorduras} %</p>
    <div class="flex space-x-2 mt-4">
        <button onclick="editarCard('${cardId}')" class="bg-blue-500 text-white px-4 py-2 rounded"><i class="fas fa-edit"></i></button>
        <button onclick="deletarCard('${cardId}')" class="bg-red-500 text-white px-4 py-2 rounded"><i class="fas fa-trash-alt"></i></button>
    </div>
    </div>

    `;




    card.innerHTML = cardFixoHTML;
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

