# Memoteca de Receitas 🍜✨

## 🌟 Funcionalidades

* **Cadastro de Receitas:** Formulário completo para adicionar novas receitas, incluindo:
    * Título
    * Ingredientes
    * Modo de Preparo
    * História da Receita (opcional)
    * Autor (opcional)
    * Data da Criação/Memória
    * Upload de Imagem para a receita
* **Edição de Receitas:** Modifique receitas existentes.
* **Listagem de Receitas:** Visualize todas as receitas cadastradas em formato de cards.
* **Visualização de Detalhes:** Página dedicada para cada receita com todas as suas informações.
* **Exclusão de Receitas:** Remova receitas do catálogo (incluindo a imagem associada no servidor).
* **Navegação Intuitiva:** Uso do Angular Router para uma experiência de usuário fluida entre as páginas.
* **Componentização:** Código organizado em componentes reutilizáveis.
* **Backend Próprio:** API PHP para interação com banco de dados MySQL, gerenciado via XAMPP.

## 🛠️ Tecnologias Utilizadas

**Frontend:**
* [Angular](https://angular.io/) (utilizando componentes Standalone)
* HTML5
* CSS3 (estilização customizada)
* TypeScript

**Backend:**
* PHP
* MySQL (gerenciado pelo XAMPP)

**Ambiente de Desenvolvimento:**
* [XAMPP](https://www.apachefriends.org/) (Apache como servidor web, MySQL como banco de dados)
* [Angular CLI](https://cli.angular.io/)
* [Node.js](https://nodejs.org/)

## 🚀 Configuração e Instalação

Siga os passos abaixo para configurar e rodar o projeto em seu ambiente local.

### Pré-requisitos

* **XAMPP Instalado:** Faça o download e instale o [XAMPP](https://www.apachefriends.org/index.html).
* **Node.js e npm:** Faça o download e instale o [Node.js](https://nodejs.org/) (que inclui o npm).
* **Angular CLI:** Instale globalmente via npm: `npm install -g @angular/cli`

### 1. Configuração do Backend (API PHP e Banco de Dados)

a.  **Clone o Repositório:**
    ```bash
    git clone https://github.com/isnull-dev/DSWI-MEMOTECA.git
    cd DSWI-MEMOTECA
    ```

b.  **Copie a API para o `htdocs` do XAMPP:**
    * Localize a pasta da API no projeto clonado (vamos supor que ela se chama `memoteca_api` dentro do seu repositório, ou se estiver separada, copie a pasta `memoteca_api` que criamos).
    * Copie esta pasta `memoteca_api` para o diretório `htdocs` da sua instalação do XAMPP.
        * Exemplo no Windows: `C:\xampp\htdocs\memoteca_api`
        * Exemplo no macOS: `/Applications/XAMPP/htdocs/memoteca_api`

c.  **Inicie o Apache e o MySQL:**
    * Abra o painel de controle do XAMPP e inicie os módulos "Apache" e "MySQL".

d.  **Crie o Banco de Dados e a Tabela:**
    * Acesse `http://localhost/phpmyadmin/` em seu navegador.
    * Crie um novo banco de dados chamado `memoteca_db` (com codificação `utf8mb4_general_ci`).
    * Selecione o banco `memoteca_db` e vá para a aba "SQL". Execute o seguinte comando para criar a tabela `receitas`:
      ```sql
      CREATE TABLE receitas (
          id INT AUTO_INCREMENT PRIMARY KEY,
          titulo VARCHAR(255) NOT NULL,
          ingredientes TEXT NOT NULL,
          modo_preparo TEXT NOT NULL,
          historia TEXT,
          autor VARCHAR(100),
          data_criacao DATE,
          imagem_path VARCHAR(255) NULL
      );
      ```

e.  **Verifique a Conexão do Banco (opcional):**
    * O arquivo `memoteca_api/db.php` está configurado para as credenciais padrão do XAMPP (`root` sem senha). Se suas configurações do MySQL forem diferentes, ajuste este arquivo.

f.  **Crie a Pasta de Uploads:**
    * Dentro da pasta `memoteca_api` (que você copiou para `htdocs`), crie uma subpasta chamada `uploads`.
        * Exemplo: `C:\xampp\htdocs\memoteca_api\uploads\`
    * Certifique-se de que o servidor Apache/PHP tenha permissão para escrever nesta pasta. (No XAMPP para Windows, isso geralmente já funciona).

### 2. Configuração do Frontend (Aplicação Angular)

a.  **Navegue até a Pasta do Projeto Angular:**
    * Se a raiz do seu repositório clonado é o projeto Angular, você já deve estar nela. Caso contrário, navegue até a pasta que contém `angular.json` ou `project.json`.

b.  **Instale as Dependências:**
    ```bash
    npm install
    ```

c.  **Verifique a URL da API (opcional):**
    * O serviço Angular (`src/app/receita.service.ts`) está configurado para se comunicar com a API em `http://localhost/memoteca_api`. Se você configurou o backend em uma URL diferente, ajuste a propriedade `apiUrl` no serviço.

d.  **Execute a Aplicação Angular:**
    ```bash
    ng serve -o
    ```
    Isso compilará a aplicação e a abrirá automaticamente em seu navegador, geralmente em `http://localhost:4200/`.

## 📖 Como Usar

1.  Acesse a aplicação em `http://localhost:4200/`.
2.  Você verá a lista de receitas cadastradas.
3.  Clique em "Adicionar Nova Receita" para ir ao formulário de cadastro.
4.  Preencha os dados da receita, incluindo a seleção de uma imagem, e salve.
5.  A nova receita aparecerá na lista.
6.  Você pode clicar em "Detalhes" para ver a receita completa, "Editar" para modificá-la ou "Excluir" para removê-la.

## 🔩 Endpoints da API (PHP)

A API PHP reside em `http://localhost/memoteca_api/` e possui os seguintes endpoints:

* **`GET /listar_receitas.php`**: Retorna uma lista de todas as receitas.
* **`GET /obter_receita.php?id={id}`**: Retorna os detalhes de uma receita específica.
* **`POST /criar_receita.php`**: Cria uma nova receita. Espera dados no formato `multipart/form-data` (incluindo a imagem).
* **`POST /atualizar_receita.php`**: Atualiza uma receita existente. Espera dados no formato `multipart/form-data` (incluindo a imagem, se for alterada) e um campo `id` com o ID da receita.
* **`DELETE /excluir_receita.php?id={id}`**: Exclui uma receita específica e sua imagem associada do servidor.

## 🎨 Componentes Principais do Angular

* `HeaderComponent`: Cabeçalho da aplicação.
* `ReceitaCardComponent`: Card reutilizável para exibir um resumo da receita na lista.
* `ReceitaFormComponent`: Formulário para criar e editar receitas.
* `ReceitaListaComponent`: Exibe a lista de todas as receitas.
* `ReceitaDetalheComponent`: Exibe os detalhes completos de uma receita.

## 🔮 Possíveis Melhorias Futuras

* Paginação na lista de receitas.
* Funcionalidade de busca e filtro de receitas.
* Autenticação de usuários.
* Validação mais robusta no backend.
* Permitir múltiplas imagens por receita.
* Categorização de receitas (ex: doces, salgados, etc.).
* Melhorias na interface e experiência do usuário (UI/UX).

---

Feito com ❤️ e um toque de tempero!
