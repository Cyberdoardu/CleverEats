function checkAuthentication() {
    fetch('../php/get-user-info.php')
      .then((response) => response.json())
      .then((data) => {
        if (data.nome === 'Nome não disponível' || data.email === 'E-mail não disponível') {
          window.location.href = '../paginas/entrar';
        }
      })
      .catch((error) => {
        console.error('Erro ao verificar a autenticação:', error);
      });
  }

  
checkAuthentication();