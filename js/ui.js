export function alternarTela(nomeTela) {
    document.querySelectorAll('.tela').forEach(t => t.classList.remove('tela-ativa'));
    const tela = document.getElementById(`tela-${nomeTela}`);
    if (tela) tela.classList.add('tela-ativa');
}

export function limparEditor() {
    document.getElementById('editor-id').value = '';
    document.getElementById('editor-titulo').value = '';
    document.getElementById('editor-conteudo').value = '';
}

export function obterDadosEditor() {
    return {
        id: document.getElementById('editor-id').value,
        titulo: document.getElementById('editor-titulo').value.trim(),
        conteudo: document.getElementById('editor-conteudo').value
    };
}

export function preencherEditor(musica) {
    document.getElementById('editor-id').value = musica.id;
    document.getElementById('editor-titulo').value = musica.titulo;
    document.getElementById('editor-conteudo').value = musica.conteudo;
}

export function aplicarTema(tema) {
    document.documentElement.setAttribute('data-bs-theme', tema);

    localStorage.setItem('tema', tema);

    const icone = document.getElementById('icone-tema');
    if (icone) {
        if (tema === 'dark') {
            icone.className = 'bi bi-sun-fill';
        } else {
            icone.className = 'bi bi-moon-stars-fill';
        }
    }
}

export function alternarTema() {
    const temaAtual = document.documentElement.getAttribute('data-bs-theme');
    const novoTema = temaAtual === 'dark' ? 'light' : 'dark';
    aplicarTema(novoTema);
}