# Projeto Votação Paredão BBB
## Eduardo Dias da Costa

### Briefing

#### Front End

Janela modal que oferece a interface para o público brasileiro votar no participante que deve permanecer na casa. 
Esse formato de interface permite que ela seja sobreposta à página atual oferecendo uma forma rápida do usuário votar sem ter que navegar até uma página específica. Um botão de chamada pode ser adicionado no header das páginas da globo.com permitindo acesso imediato.  

Para a primeira entrega, porém, a mesma será apresentada apenas como uma página.  

Ela deve apresentar as seguintes telas:
 - Votação
   - Fotos dos 2 participantes
   - Botões para escolha de 1 deles e confirmação de voto
   - Informações para voto via Telefone ou SMS
   - Sistema de Captcha (ex: reCaptcha)
     - Permite apenas votos "humanos"
 - Confirmação
   - Fotos dos 2 participantes
   - Mensagem de Sucesso
   - Porcentagem atual de votos
   - Tempo até o fim da votação
 - Manager
   - Página para análise do andamento da votação
    - URL exclusiva
   - Apenas para acesso interno da globo
   - Devem constar os seguintes dados:
    - Total Geral de Votos
    - Total de Votos por Participante
    - Total de Votos por Hora

![Mockup da interface modal](https://dl.dropboxusercontent.com/u/20655747/globo/briefing-projeto-paredao-00.jpg)

#### BackEnd

O sistema de backend deve ser desenvolvido visando o deploy/update com apenas 1 comando para cada. Na máquina alvo, o admin deverá apenas executar:  
1. Clone do repositório  
2. Comandos `make`:  
  - `make`
    - Limpa o ambiente do servidor
    - Instala dependências
    - Inicia o(s) `daemon(s)` colocando o servidor no ar
  - `make update`
    - Executa o update do repositório com melhorias na página e scripts
    - Reinicia o(s) `daemon(s)` com modificações do backend
      
Após instalado, o sistema deve prover os seguintes serviços:  
- Requisições da página
  - HTML, JS, CSS, Imagens,...
- Processamento de Votos
  - Checagem do Captcha
  - Armazenamento dos votos
  - Analytics do processo de votação
    - Total Geral
    - Total por Participante
    - Votos / Hora    

O processo de votação poderá atingir picos de **1000 votos/s**.  
A solução backend deve estar preparada para esse cenário. Uma possível alternativa seria:  

- Iniciar multiplas instâncias do serviço com o seguinte layout de portas:
  - `80` = Conteúdo da página
  - `9000-900x` = Instâncias para processamento de votos
    - Ao iniciar a página um número randômico sorteia qual porta entre `[9000,900x]` será usada ou uma chamada ajax recebe qual porta usar
  - Caso apenas a porta 80 deve ser utilizada, a API `cluster` do nodejs pode fornecer um balanceamento das requisições
    - https://nodejs.org/api/cluster.html

### Tecnologia

- IDE
  - Flash Develop

#### Front End
- HTML5
- Haxe [http://www.haxe.org]
  - Linguagem de geração de JS (similar ao Dart e Typescript)
- JS
  - Bowser [https://github.com/ded/bowser]
  - JQuery
  - reCaptcha [https://www.google.com/recaptcha/intro/index.html]
- CSS / Sass
  - Modernizr [http://modernizr.com/]
  - MaterializeCSS [http://materializecss.com/]
    - Mais fácil o uso e efeitos mais bonitos
  

#### Back End
- NGINX
  - Prover o conteúdo HTML, JS, CSS,...
- NodeJS
  - `forever` (permite rodar o serviço node como um daemon e controlar seu inicio e fim)
  - `nodews` (permite melhor modelagem de serviços usando as features do Haxe)
   - https://github.com/haxorplatform/nodews  
- MongoDB
- reCaptcha

