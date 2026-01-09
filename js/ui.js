import { convert2ChordMark } from 'https://cdn.jsdelivr.net/npm/chord-mark-converters@0.17.0/+esm'

export function alternarTela(nomeTela) {
	document.querySelectorAll('.tela').forEach(t => t.classList.remove('tela-ativa'));
	const tela = document.getElementById(`tela-${nomeTela}`);
	if (tela) tela.classList.add('tela-ativa');
}

const btnLimpar = document.getElementById('btn-importar-cifra');

if (btnLimpar) {
	btnLimpar.addEventListener('click', () => {
		const editor = document.getElementById('editor-conteudo');
		const textoSujo = editor.value;

		if (!textoSujo.trim()) return;

		if (confirm('Deseja formatar e alinhar a cifra automaticamente?')) {
			try {
				const textoLimpo = convert2ChordMark(textoSujo, {
					inputFormat: 'chordsOverLyrics'
				});

				editor.value = textoLimpo;

			} catch (err) {
				console.error("Erro na conversão:", err);
				alert('Não foi possível formatar. Verifique se os acordes estão alinhados sobre a letra.');
			}
		}
	});
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

const botoesInserir = document.querySelectorAll('.btn-inserir');
const editor = document.getElementById('editor-conteudo');

botoesInserir.forEach(botao => {
    botao.addEventListener('click', (e) => {
        const charParaInserir = botao.getAttribute('data-char');
        inserirNoCursor(charParaInserir);
    });
});

function inserirNoCursor(texto) {
    if (!editor) return;

    const inicioSelecao = editor.selectionStart;
    const fimSelecao = editor.selectionEnd;
    const textoAtual = editor.value;

    editor.value = textoAtual.substring(0, inicioSelecao) + texto + textoAtual.substring(fimSelecao);

    editor.focus();

    const novaPosicao = inicioSelecao + texto.length;
    editor.setSelectionRange(novaPosicao, novaPosicao);

    editor.dispatchEvent(new Event('input'));
}