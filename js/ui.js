export function alternarTela(nomeTela) {
	document.querySelectorAll('.tela').forEach(t => t.classList.remove('tela-ativa'));
	const tela = document.getElementById(`tela-${nomeTela}`);
	if (tela) tela.classList.add('tela-ativa');
}

export function limparEditor() {
	document.getElementById('editor-id').value = '';
	document.getElementById('editor-titulo').value = '';
	document.getElementById('editor-artista').value = '';
	document.getElementById('editor-conteudo').value = '';
}

export function obterDadosEditor() {
	return {
		id: document.getElementById('editor-id').value,
		titulo: document.getElementById('editor-titulo').value.trim(),
		artista: document.getElementById('editor-artista').value.trim(),
		conteudo: document.getElementById('editor-conteudo').value
	};
}

export function preencherEditor(musica) {
	document.getElementById('editor-id').value = musica.id;
	document.getElementById('editor-titulo').value = musica.titulo;
	document.getElementById('editor-artista').value = musica.artista || '';
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
			icone.className = 'bi bi-moon-fill';
		}
	}
	
	const metaThemeColor = document.querySelector('meta[name="theme-color"]');
	if (metaThemeColor) {
		// .bg-body-secondary (dark = #343a40 light = #e9ecef)
		metaThemeColor.setAttribute('content', tema === 'dark' ? '#343a40' : '#e9ecef');
	}
}

export function alternarTema() {
	const temaAtual = document.documentElement.getAttribute('data-bs-theme');
	const novoTema = temaAtual === 'dark' ? 'light' : 'dark';
	aplicarTema(novoTema);
}