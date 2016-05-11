##Globo.com: coding challenge
**Eduardo Dias da Costa**

====================
#### Considerações Gerais
Você deverá usar este repositório como o repo principal do projeto, i.e., todos os seus commits devem estar registrados aqui, pois queremos ver como você trabalha.

Esse problema tem 2 constraints:

a) Eu preciso conseguir rodar seu código em um Mac OS X OU no Ubuntu;

b) Eu executarei seu código com os seguintes comandos ou algo similar (dê-me as instruções):

    git clone seu-fork
    cd seu-fork
    ./configure
    make

Esses comandos tem que ser o suficiente para configurar meu Mac OS X ou Ubuntu e rodar seu programa.

Pode considerar que eu tenho instalado no meu sistema Java, Pyhton, Ruby ou Go. Qualquer outra dependência que eu precisar você tem que prover.

O problema que você tem que resolver é o problema da votação do paredão do BBB em versão WEB com HTML/CSS/Javascript + o backend usando a linguagem de programação/framework da sua preferência.

O repositório contém algumas imagens necessárias para implementação da parte Web: uma com o desenho da tela e outra com um sprite de imagens que você talvez deseje usar.

**Registre tudo**: testes que forem executados, ideias que gostaria de implementar se tivesse tempo (explique como você as resolveria, se houvesse tempo), decisões que forem tomadas e seus porquês, arquiteturas que forem testadas e os motivos de terem sido modificadas ou abandonadas. Crie um arquivo COMMENTS.md ou HISTORY.md no repositório para registrar essas reflexões e decisões.

=====================
#### O Problema

O paredão do BBB consiste em uma votação que confronta dois integrantes do programa BBB. A votação é apresentada em uma interface acessível pela WEB onde os usuários optam por votar em uma das opções apresentadas. Uma vez realizado o voto, o usuário recebe uma tela com o comprovante do sucesso do seu voto e um panorama percentual dos votos por candidato até aquele momento.

============================
#### Regras de negócio

1. Os usuário podem votar quantas vezes quiser independente da opção escolhida, entretanto, a produção do programa não gostaria de receber votos oriundos de uma máquina e sim votos de pessoas.
2. A votação é chamada em horário nobre, com isso, é esperado um volume elevado de votos. Para facilitar vamos trabalhar com 1000 votos/segundo.
3. A interface do produto é extremamente importante pois os organizadores são exigentes. Porém, você não tem muito tempo, então faça o melhor possível no tempo que tem.
4. A produção do programa gostaria de consultar numa URL, o total de geral votos, o total por participante e o total de votos por hora.


===============================================
#### O que será avaliado na sua solução?

1. Sua solução será submetida a uma bateria de testes de performance para garantir que atende a demanda de uma chamada em TV (performance e escalabilidade).
2. Seu código será observado por uma equipe de desenvolvedores que avaliarão a simplicidade e clareza da solução, a arquitetura, documentação, estilo de código, testes unitários, testes funcionais, nível de automação dos testes, o design da interface e a implementação do código.
3. A automação da infra-estrutura também é importante. Imagine que você precisará fazer deploy do seu código em múltiplos servidores, então não é interessante ter que ficar entrando máquina por máquina para fazer o deploy da aplicação.

=============
#### Dicas

- Use ferramentas e bibliotecas open source, mas documente as decisões e os porquês;
- Automatize o máximo possível;
- Em caso de dúvidas, pergunte.
