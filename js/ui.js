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