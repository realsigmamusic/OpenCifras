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

// LISTAR MÚSICAS
async function carregarLista() {
    const ul = document.getElementById('lista-musicas');
    ul.innerHTML = '<div class="text-center text-muted">Carregando...</div>';

    try {
        const musicas = await db.musicas.toArray();

        if (musicas.length === 0) {
            ul.innerHTML = `
                        <div class="text-center mt-5">
                            <p class="text-muted">Nenhuma música cadastrada ainda.</p>
                            <button class="btn btn-primary" onclick="navegar('editor')">
                                ➕ Adicionar primeira música
                            </button>
                        </div>
                    `;
            return;
        }

        ul.innerHTML = '';
        musicas.forEach(musica => {
            const li = document.createElement('a');
            li.className = 'list-group-item list-group-item-action d-flex justify-content-between align-items-center';
            li.style.cursor = 'pointer';
            li.innerHTML = `
                        <span><strong>${musica.titulo}</strong></span>
                        <small class="text-muted">Abrir →</small>
                    `;
            li.onclick = () => abrirMusica(musica);
            ul.appendChild(li);
        });
    } catch (error) {
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
                    <div class="mt-3">
                        <strong>Conteúdo original:</strong>
                        <pre class="text-white mt-2">${musica.conteudo}</pre>
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