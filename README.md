<p align="center"><img src="/public/img/logo.jpg" width="400" alt="Laravel Logo"></p>

## Documentação do aplicativo Feedback Canva

O Feedback Canva é uma aplicação desenvolvida com o propósito de simplificar, automatizar e aprimorar a agilidade e eficácia dos gestores ao conduzirem suas avaliações, oferecendo uma variedade de funcionalidades, tais como:
- Registro eficiente de novos colaboradores.
- Execução automática de feedbacks, com a geração do quadro Canva correspondente.
- Acesso fácil a feedbacks anteriores para análise da progressão ao longo do tempo.
- Elaboração de planos de ação para aprimorar o desempenho dos funcionários, com atualizações em tempo real.
- Notificação semanal automática de feedbacks pendentes no mês.

Com o Feedback Canva, a administração de feedbacks torna-se uma tarefa simplificada e eficiente, proporcionando aos gestores uma ferramenta abrangente para otimizar o processo de avaliação e desenvolvimento da equipe.

## Instalação
#### Requisitos do sistema.
Para utilizar o aplicativo, é necessário ter um navegador instalado em sua máquina.

#### Instalação (somente para desenvolvedores)
Para efetuar alterações no projeto e no código-fonte, siga as instruções abaixo:
- Clone o repositório Buffer-TI da Global Hitss no GitHub.
- Crie um novo branch para suas alterações: git checkout -b minha-branch
- No terminal, navegue até a pasta "SISTEMA FEEDBACK CANVA".
- Se ainda não tiver instalado, instale o PHP e o Laravel.
- Caso não tenha instalado, instale o Composer.
- Se ainda não tiver instalado, instale e ative o Xampp, ativando o Apache e o MySQL.
- Crie o arquivo .env na raiz do projeto com base no .env.example, garantindo a criação de três bancos de dados distintos e configurando cada um deles.
- No terminal, execute php artisan migrate.
- No arquivo .env, a configuração do serviço de e-mail está definida para o arquivo laravel.log; no entanto, o Mailtrap está pré-configurado, mas está comentado.
- No terminal, execute o comando composer install.
- No terminal, execute o comando npm install.
- Execute o comando npm run watch em um terminal separado para atualização do front-end (React).
- Em outro terminal, execute o comando php artisan serve.
- Se tudo ocorrer conforme esperado, o projeto estará em execução.


#### Tecnologias utilizadas
Este aplicativo foi desenvolvido utilizando as seguintes tecnologias e ferramentas:
- React: Para a construção da interface do usuário, proporcionando uma experiência interativa e responsiva.
- Laravel 10: Um framework PHP robusto e moderno, utilizado para o desenvolvimento do backend da aplicação.
- PHP 8.1: A linguagem de programação que serve como base para o Laravel, fornecendo funcionalidades poderosas e eficientes.
- Jetstream 4.1: Uma biblioteca para Laravel que facilita a implementação de recursos essenciais, como autenticação, perfis de usuário, e equipes.
- MySQL: Um sistema de gerenciamento de banco de dados relacional, utilizado para armazenar e gerenciar os dados da aplicação.
- Material UI: Uma biblioteca de componentes React baseada no design do Material Design, proporcionando uma estética moderna e consistente.
- Bootstrap: Um framework front-end que simplifica o desenvolvimento de páginas web responsivas e esteticamente agradáveis.
- React Chart.js: Uma biblioteca React para criar gráficos interativos, enriquecendo a apresentação visual dos dados.
- Validator: Uma ferramenta utilizada para validar dados e garantir a integridade das informações no aplicativo.
Essas tecnologias foram escolhidas para proporcionar uma base sólida, eficiente e moderna para o desenvolvimento do aplicativo, abrangendo desde a interface do usuário até o gerenciamento de dados nos bastidores.


## Guia do usuário

#### Registro/Login
Para o Login basta colocar o e-mail e senha do cadastro.
Para o registro faça os seguintes passos:
- Coloque os dados solicitados, lembrando que o e-mail só pode ser o da Global Hitss.
- Ao realizar o cadastro, visitar seu e-mail da Hitss e clicar no link de confirmação.
- Para redefinir a senha, simplesmente clique no link "Esqueceu sua senha?" e siga as instruções fornecidas.

#### Navegação e funcionalidades
Na parte superior direita, encontra-se um seletor contendo o nome do usuário, permitindo a troca de informações e a realização do logout.

À esquerda, estão listados todos os acessos às funcionalidades do aplicativo:
- Home: Disponibiliza um botão para adicionar observações referentes ao ano e mês selecionados, além de apresentar dados essenciais para a análise dos feedbacks.
- Cadastrar Funcionário: Permite o cadastro simplificado do funcionário, exigindo apenas o nome e o endereço de e-mail. Caso o funcionário já tenha se cadastrado no programa Feedback Canva para funcionários, essa etapa é realizada automaticamente.
- Feedback: Nesta seção, é possível selecionar o funcionário para realizar avaliações ou verificar o histórico de feedbacks.
- Plano de Ação: Oferece a possibilidade de criar planos de ação para aprimorar o desempenho do funcionário.
- Pendentes: Permite visualizar os feedbacks e planos de ação pendentes, tanto dos gestores quanto dos funcionários.

Para otimizar a utilização do programa, recomenda-se verificar seu e-mail semanalmente para acompanhar possíveis pendências.

## Segurança
Para assegurar a integridade das suas informações, é aconselhável ativar a autenticação de duas etapas no programa.

***Observação para desenvolvedores:*** Certifique-se de que o relógio do servidor esteja sincronizado com o horário oficial do Windows; do contrário, a autenticação de dois fatores não funcionará corretamente. Em situações de falha na autenticação dupla ou perda do dispositivo do usuário, como um celular, proceda à exclusão do registro correspondente no banco de dados. Em seguida, solicite que o usuário refaça o cadastro, fornecendo o mesmo nome, e-mail e, crucialmente, o setor, para recuperar automaticamente os dados.

*** Para ver vídeo do programa clique [aqui](https://1drv.ms/v/s!Ak7vvHm88zdfqCOckIXLx999JGWh?e=RPBtDu) ***



