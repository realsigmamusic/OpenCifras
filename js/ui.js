import { convert2ChordMark } from 'https://cdn.jsdelivr.net/npm/chord-mark-converters@0.17.0/+esm'

export function alternarTela(nomeTela) {
	document.querySelectorAll('.tela').forEach(t => t.classList.remove('tela-ativa'));
	const tela = document.getElementById(`tela-${nomeTela}`);
	if (tela) tela.classList.add('tela-ativa');

	if (nomeTela === 'leitor') {
		document.body.classList.add('bloquear-refresh');
		document.documentElement.classList.add('bloquear-refresh');
	} else {
		document.body.classList.remove('bloquear-refresh');
		document.documentElement.classList.remove('bloquear-refresh');
	}

	window.scrollTo(0, 0);
}

export function converterCifra(formatoEntrada) {
	const editor = document.getElementById('editor-conteudo');
	if (!editor) return;

	const textoSujo = editor.value;

	if (!textoSujo.trim()) {
		alert("O editor está vazio. Cole uma cifra primeiro.");
		return;
	}

	let mensagem = 'Isso substituirá o texto atual pela versão formatada. Continuar?';
	if (formatoEntrada === 'chordPro') {
		mensagem = 'Converter formato ChordPro (com colchetes) para ChordMark? ' + mensagem;
	} else {
		mensagem = 'Tentar alinhar e formatar cifra da internet? ' + mensagem;
	}

	if (confirm(mensagem)) {
		try {
			const textoLimpo = convert2ChordMark(textoSujo, {
				inputFormat: formatoEntrada
			});

			editor.value = textoLimpo;

			alert('Formatado com sucesso!'); 

		} catch (err) {
			console.error("Erro na conversão:", err);
			alert('Não foi possível converter. Verifique se o formato selecionado corresponde ao texto colado.');
		}
	}
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
		icone.className = tema === 'dark'
			? 'bi bi-sun-fill'
			: 'bi bi-moon-fill';
	}

	const metaThemeColor = document.querySelector('meta[name="theme-color"]');
	if (metaThemeColor) {
		metaThemeColor.setAttribute(
			'content',
			tema === 'dark' ? '#343a40' : '#e9ecef'
		);
	}
}

export function alternarTema() {
	const novoTema = document.getElementById('tema').value;
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

export function carregarTemaSalvo() {
	const temaSalvo = localStorage.getItem('tema') || 'light';

	const select = document.getElementById('tema');
	if (select) {
		select.value = temaSalvo;
	}

	aplicarTema(temaSalvo);
}

export async function exibirVersao() {
	try {
		// Lê o arquivo sw.js como texto puro
		const response = await fetch('./sw.js');
		const texto = await response.text();

		// Procura pela linha: const CACHE_NAME = 'valor';
		const match = texto.match(/const\s+CACHE_NAME\s*=\s*['"](.*?)['"]/);

		if (match && match[1]) {

			const el = document.getElementById('app-version');
			if (el) el.textContent = match[1];
		}
	} catch (erro) {
		console.error('Não foi possível ler a versão do SW:', erro);
	}
}