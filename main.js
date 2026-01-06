// CONFIGURAÇÃO DO BANCO DE DADOS
const db = new Dexie('OpenCifrasDB');
db.version(1).stores({
    musicas: '++id, titulo, conteudo'
});

let musicaAtualId = null;

// NAVEGAÇÃO ENTRE TELAS
function navegar(tela) {
    document.querySelectorAll('.tela').forEach(t => t.classList.remove('tela-ativa'));
    document.getElementById(`tela-${tela}`).classList.add('tela-ativa');

    if (tela === 'lista') {
        // Se vier do buscador, limpamos a busca ao voltar pra home
        const inputBusca = document.getElementById('input-busca');
        if(inputBusca) inputBusca.value = ''; 
        
        carregarLista();
        musicaAtualId = null;
    }

    if (tela === 'editor' && !musicaAtualId) {
        limparEditor();
    }
}

function limparEditor() {
    document.getElementById('editor-id').value = '';
    document.getElementById('editor-titulo').value = '';
    document.getElementById('editor-conteudo').value = '';
}

function cancelarEdicao() {
    if (confirm('Descartar alterações?')) {
        musicaAtualId = null;
        navegar('lista');
    }
}

// SALVAR MÚSICA (CREATE/UPDATE)
async function salvarMusica() {
    const id = document.getElementById('editor-id').value;
    const titulo = document.getElementById('editor-titulo').value.trim();
    const conteudo = document.getElementById('editor-conteudo').value;

    if (!titulo) {
        alert("Por favor, digite um título para a música!");
        return;
    }

    try {
        if (id) {
            await db.musicas.update(parseInt(id), { titulo, conteudo });
        } else {
            await db.musicas.add({ titulo, conteudo });
        }

        musicaAtualId = null;
        navegar('lista');
    } catch (error) {
        alert('Erro ao salvar: ' + error.message);
    }
}

// LISTAR MÚSICAS (COM BUSCA INTEGRADA)
async function carregarLista(termoBusca = "") {
    const ul = document.getElementById('lista-musicas');
    ul.innerHTML = '<div class="text-center text-muted">Carregando...</div>';

    try {
        let musicas;

        // SE TIVER TERMO DE BUSCA, FILTRA
        if (termoBusca.trim().length > 0) {
            const termo = termoBusca.toLowerCase(); // Transforma em minúsculo para facilitar
            
            // Filtra no banco (Título OU Conteúdo)
            musicas = await db.musicas.filter(musica => {
                const tituloOk = musica.titulo.toLowerCase().includes(termo);
                const conteudoOk = musica.conteudo.toLowerCase().includes(termo);
                return tituloOk || conteudoOk;
            }).toArray();
        } 
        // SE NÃO TIVER BUSCA, TRAZ TUDO
        else {
            musicas = await db.musicas.toArray();
            // Ordena alfabeticamente
            musicas.sort((a, b) => a.titulo.localeCompare(b.titulo));
        }

        // RENDERIZAÇÃO
        if (musicas.length === 0) {
            if (termoBusca) {
                ul.innerHTML = `<div class="text-center mt-5 text-muted">Nada encontrado para "<strong>${termoBusca}</strong>"</div>`;
            } else {
                ul.innerHTML = `
                        <div class="text-center mt-5">
                            <p class="text-muted">Nenhuma música cadastrada ainda.</p>
                            <button class="btn btn-primary" onclick="navegar('editor')">
                                ➕ Adicionar primeira música
                            </button>
                        </div>
                    `;
            }
            return;
        }

        ul.innerHTML = '';
        musicas.forEach(musica => {
            const li = document.createElement('a');
            li.className = 'list-group-item list-group-item-action d-flex justify-content-between align-items-center';
            li.style.cursor = 'pointer';
            
            // Se tiver buscando, destaca o título em negrito azul (opcional)
            const tituloHtml = termoBusca 
                ? `<span class="text-primary fw-bold">${musica.titulo}</span>` 
                : `<strong>${musica.titulo}</strong>`;

            li.innerHTML = `
                        <span>${tituloHtml}</span>
                        <small class="text-muted">Abrir →</small>
                    `;
            li.onclick = () => abrirMusica(musica);
            ul.appendChild(li);
        });
    } catch (error) {
        console.error(error);
        ul.innerHTML = `<div class="alert alert-danger">Erro ao carregar: ${error.message}</div>`;
    }
}

// VISUALIZAR MÚSICA
function abrirMusica(musica) {
    musicaAtualId = musica.id;
    document.getElementById('titulo-musica').textContent = musica.titulo;

    try {
        if (!window.chordMark) {
            throw new Error('ChordMark ainda não foi carregado. Aguarde um momento e tente novamente.');
        }

        const song = window.chordMark.parseSong(musica.conteudo);

        const html = window.chordMark.renderSong(song, {
            alignBars: false, 
            alignChordsWithLyrics: true
        });

        document.getElementById('render-area').innerHTML = html;
    } catch (error) {
        document.getElementById('render-area').innerHTML = `
                    <div class="alert alert-warning">
                        <strong>Erro ao renderizar:</strong> ${error.message}
                    </div>
                    <div class="">
                        <strong>Conteúdo original:</strong>
                        <pre class="text-white">${musica.conteudo}</pre>
                    </div>
                `;
    }

    navegar('leitor');
}

// EDITAR MÚSICA
async function editarAtual() {
    if (!musicaAtualId) return;

    try {
        const musica = await db.musicas.get(musicaAtualId);

        document.getElementById('editor-id').value = musica.id;
        document.getElementById('editor-titulo').value = musica.titulo;
        document.getElementById('editor-conteudo').value = musica.conteudo;

        navegar('editor');
    } catch (error) {
        alert('Erro ao carregar música: ' + error.message);
    }
}

// DELETAR MÚSICA
async function deletarAtual() {
    if (!musicaAtualId) return;

    if (confirm('Tem certeza que deseja excluir esta música? Esta ação não pode ser desfeita.')) {
        try {
            await db.musicas.delete(musicaAtualId);
            musicaAtualId = null;
            navegar('lista');
        } catch (error) {
            alert('Erro ao excluir: ' + error.message);
        }
    }
}

// --- EVENTOS GLOBAIS ---

// Ativa a busca enquanto digita
const inputBusca = document.getElementById('input-busca');
if (inputBusca) {
    inputBusca.addEventListener('input', (e) => {
        carregarLista(e.target.value);
    });
    
    // Evita recarregar a página se der ENTER no form de busca
    document.getElementById('form-busca')?.addEventListener('submit', (e) => {
        e.preventDefault();
    });
}

// Carrega a lista inicial
carregarLista();

// Expor funções para o HTML acessar (já que estamos usando type="module" ou scripts defer)
window.navegar = navegar;
window.salvarMusica = salvarMusica;
window.cancelarEdicao = cancelarEdicao;
window.editarAtual = editarAtual;
window.deletarAtual = deletarAtual;

// --- SISTEMA DE BACKUP ---

// 1. EXPORTAR (Baixar JSON)
async function exportarDados() {
    try {
        const musicas = await db.musicas.toArray();
        
        // Cria o objeto JSON
        const dadosBackup = {
            data: new Date().toISOString(),
            app: "OpenCifras",
            versao: 1,
            musicas: musicas
        };

        // Transforma em String
        const jsonString = JSON.stringify(dadosBackup, null, 2);
        
        // Cria um BLOB (arquivo virtual na memória)
        const blob = new Blob([jsonString], { type: "application/json" });
        
        // Cria link de download temporário
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        
        // Formata data para o nome do arquivo (ex: backup_2023-10-05.json)
        const dataHoje = new Date().toISOString().split('T')[0];
        a.href = url;
        a.download = `opencifras_backup_${dataHoje}.json`;
        
        // Clica e remove
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        alert('Backup baixado com sucesso! Guarde este arquivo em local seguro.');
        
    } catch (error) {
        alert('Erro ao exportar: ' + error.message);
    }
}

// 2. IMPORTAR (Ler JSON e Salvar)
async function importarDados(input) {
    const arquivo = input.files[0];
    if (!arquivo) return;

    const leitor = new FileReader();

    leitor.onload = async (e) => {
        try {
            const json = JSON.parse(e.target.result);

            if (!json.app || json.app !== "OpenCifras" || !Array.isArray(json.musicas)) {
                throw new Error("Arquivo inválido ou de outro programa.");
            }

            // 1. Pega todas as músicas que já estão no banco para comparar
            const musicasNoBanco = await db.musicas.toArray();
            
            // Cria uma lista (Set) só com os títulos existentes (em minúsculo para garantir)
            const titulosExistentes = new Set(musicasNoBanco.map(m => m.titulo.toLowerCase().trim()));

            // 2. Filtra o backup: só queremos o que NÃO está na lista acima
            const novasMusicas = json.musicas.filter(m => {
                const tituloBackup = m.titulo.toLowerCase().trim();
                return !titulosExistentes.has(tituloBackup);
            });

            // Lógica de feedback para o usuário
            const totalNoBackup = json.musicas.length;
            const totalDuplicadas = totalNoBackup - novasMusicas.length;

            if (novasMusicas.length === 0) {
                alert(`O backup tem ${totalNoBackup} músicas, mas você JÁ TEM todas elas cadastradas.\nNenhuma alteração foi feita.`);
                input.value = '';
                return;
            }

            let mensagem = `O backup contém ${totalNoBackup} músicas.\n`;
            if (totalDuplicadas > 0) {
                mensagem += `- ${totalDuplicadas} são repetidas (serão ignoradas)\n`;
                mensagem += `- ${novasMusicas.length} são novas\n`;
            }
            mensagem += `\nDeseja importar as ${novasMusicas.length} novas músicas?`;

            if(!confirm(mensagem)) {
                input.value = '';
                return;
            }

            // 3. Prepara para salvar (remove o ID antigo para gerar um novo)
            const paraSalvar = novasMusicas.map(m => {
                const { id, ...resto } = m; 
                return resto;
            });

            await db.musicas.bulkAdd(paraSalvar);
            
            alert(`Sucesso! ${paraSalvar.length} músicas importadas.`);
            carregarLista(); 
            
            // Fecha modal
            const modalEl = document.getElementById('modalBackup');
            const modalInstance = bootstrap.Modal.getInstance(modalEl);
            modalInstance.hide();

        } catch (error) {
            alert('Erro ao importar: ' + error.message);
        }
        
        input.value = ''; 
    };

    leitor.readAsText(arquivo);
}

// Expor globalmente
window.exportarDados = exportarDados;
window.importarDados = importarDados;