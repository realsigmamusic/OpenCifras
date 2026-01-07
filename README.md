# [OpenCifras](https://realsigmamusic.github.io/OpenCifras/)

O **OpenCifras** é uma Aplicação Web Progressiva **(PWA)** de código aberto desenvolvida para músicos e estudantes. O objetivo do projeto é oferecer uma ferramenta simples, leve e funcional para criar, organizar e visualizar cifras e letras de músicas, funcionando totalmente offline.
O aplicativo utiliza o formato ChordMark para renderização de cifras, permitindo transposição automática e formatação inteligente.

## Funcionalidades Principais
 * Gerenciamento de Repertório: Criação, leitura, edição e exclusão de músicas (CRUD).
 * Banco de Dados Local: Todas as músicas são salvas no navegador do usuário utilizando IndexedDB, garantindo privacidade e acesso offline.
 * Renderização Inteligente: Utiliza a biblioteca ChordMark para formatar cifras e letras automaticamente.
 * Transposição: Alteração do tom da música em tempo real com recálculo automático dos acordes.
 * Acessibilidade e Visualização:
   * Controle de tamanho da fonte (Zoom).
   * Temas Claro e Escuro (Dark Mode).
 * Metadados: Suporte para inclusão de Artista nas músicas.
 * Busca: Filtro em tempo real por título ou conteúdo da cifra.
 * Backup e Restauração: Possibilidade de exportar todo o banco de dados para um arquivo JSON e importar posteriormente.
 * Instalação (PWA): Pode ser instalado como um aplicativo nativo em dispositivos móveis e desktop.
 
## Tecnologias Utilizadas
O projeto foi construído utilizando tecnologias web modernas, sem a necessidade de frameworks pesados ou processos de build complexos:
 * **HTML5**, **CSS3** e **JavaScript** (ES6 Modules)
 * **Bootstrap 5.3**: Para estilização responsiva e componentes de interface.
 * **Dexie.js**: Wrapper para facilitar a manipulação do **IndexedDB**.
 * **ChordMark**: Biblioteca para parsing e renderização de cifras.
 * **Bootstrap Icons**: Biblioteca de ícones.

## Como Executar o Projeto
Como o OpenCifras é uma aplicação estática (client-side), não é necessário configurar um servidor backend (Node.js, PHP, Python, etc.).
Execução Local
 * Clone este repositório ou baixe os arquivos.
 * Abra o arquivo index.html em seu navegador.
   * Nota: Para que o Service Worker (PWA) e os Módulos ES6 funcionem corretamente, recomenda-se servir os arquivos através de um servidor HTTP local (como o Live Server do VS Code ou python -m http.server), em vez de abrir diretamente pelo sistema de arquivos (file://).

## Hospedagem
O projeto pode ser hospedado gratuitamente em qualquer serviço de hospedagem de páginas estáticas, como:
 * GitHub Pages
 * Vercel
 * Netlify
 * Cloudflare Pages

## Estrutura de Arquivos
 * index.html: Estrutura principal e layout da aplicação.
 * style.css: Estilizações personalizadas e ajustes de tema.
 * sw.js: Service Worker responsável pelo cache e funcionamento offline.
 * manifest.json: Configurações de instalação do PWA.
 * js/: Pasta contendo a lógica da aplicação modularizada.
   * app.js: Lógica principal, controle de rotas e eventos globais.
   * db.js: Configuração do banco de dados Dexie.js.
   * ui.js: Manipulação do DOM e elementos de interface.
   * render.js: Integração com a biblioteca ChordMark.
   * backup.js: Lógica de exportação e importação de dados.

## Licença
Este projeto está licenciado sob a licença **MIT**. Consulte o arquivo LICENSE para obter mais informações.

- https://www.flaticon.com/
- https://maskable.app/editor?hl=pt-BR