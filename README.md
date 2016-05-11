## Globo.com: coding challenge
**Eduardo Dias da Costa**

### Instalação

- Executar `git clone https://github.com/SelecaoGlobocom/EduardoDias.git`
- Rodar o comando `make` que irá executar:
 - Criação dos diretórios
 - Instalação do nodejs, mongodb, nginx e outras dependências
 - Executar os daemons
  
### Atualização

- Executar o comando `make update`
- Ele irá fazer o `pull`do repositório e reiniciar os serviços

### Configuração

- Usar a página do manager para criação de paredões
  - http://ec2-52-24-71-71.us-west-2.compute.amazonaws.com/manager.html  
- Arquivo `server/deploy/config.json` contém dados do servidor
```
{	
	"port": xxxx,										//porta de conexão do servidor
	"mongoURL": "mongodb://path/to/db"					//caminho de conexão do DB mongo
}
```
 
### Demo
 
- Uma versão com o último build está rodando no link abaixo:
  - http://ec2-52-24-71-71.us-west-2.compute.amazonaws.com/manager.html  
  - Selecionar a aba `Lista` e seguir o link de um dos paredões
  
### Observação

- Versão testada em servidor Ubuntu 14
  

### Melhorias Futuras

- Adicionar a API de Geolocalização do HTML5 e mapear votos por localização
- Refinar análise da lista de votos
  - Traçar um gráfico de votos/h mais detalhado e não a média
  - Exibir localização no mapa
  - Dias de maior número de votos
  - Integrar com Google Analytics para um detalhamento mais profissional  
- Upload de fotos e outras mídias dos participantes
- Ajuste do código do cliente para ele ser "embedável" em blogs parceiros ou sites de outros usuários
 - Permite que propagandas em forma de banners possam ser exibidas juntamente com a modal de votação
 - Monetização durante o processo do paredão
 - Mesmo que os blogs modifiquem a API e chamem os métodos de votação o reCaptcha vai impedir fraude
 