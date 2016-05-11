# Projeto Votação Paredão BBB
## Eduardo Dias da Costa

### Work Log

#### 15/05

 - Estudo do briefing do projeto
 - Análise dos requisitos de software
 - Preparação do ambiente de desenvolvimento
 - Criação de instância Amazon para teste/execução
 - Início da implantação do server NGINX
   - Melhor performance para arquivos estáticos
   - Não é necessário reinventar a roda com NodeJS
 
#### 16/05
 
- Implementação do FrontEnd
- Workflow sem interação com BackEnd completo
  - Transições
  - Layout
  -  Feedbacks
  - Recaptcha sem confirmação
  
#### 17/05
 
 - Implantação do NGINX
 - Início do script Makefile
 
#### 18/05
 
 - Implementação do manager de paredões
   - Criar Paredões
   - Visualizar os dados de paredões
 - Implementação do BackEnd nodejs
 
#### 19/05

 - Dia não trabalhado
 
#### 20/05

 - Finalização do manager de paredões
 - Finalização do webservice de criação e visualização de paredões
 - Finalização do sistema de votos sem validação do captcha
 - Finalização do layout da modal de votos com gráfico e relógio
 
#### 21/05

 - QA
 - Melhorias
 
#### 22/05

 - Dia não trabalhado
 
#### 23/05

 - QA
 - Melhorias
 - Manager agora exibe data de início do paredão e a data atual do servidor
 - Manager agora exibe o tempo restante do paredão
 - Adicionado unidade de dias no contador de tempo
 - Adicionado controle de duração da votação
 - Servidor agora cuida a data atual versus a duração e evita votos fora do tempo limite
 - Cliente notifica tempo esgotado
 - Cliente recebe o tempo restante e adapta o layout para dificultar votações fora do prazo
   - Mesmo que alguém manipule o javascript e vote, o servidor não processará o voto
  
#### 24/05

- Dia não trabalhado

#### 25/05

- Entrega do Projeto
