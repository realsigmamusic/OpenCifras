//import { parseSong, renderSong } from 'https://cdn.jsdelivr.net/npm/chord-mark@0.17.0/+esm';
const { parseSong, renderSong } = window["chord-mark"];

export function renderizarCifra(elementoDestino, conteudo, semitons = 0) {
	try {
		const valTransposicao = parseInt(semitons) || 0;

		const song = parseSong(conteudo);

		let html;
		let tempDiv = document.createElement('div');

		switch (document.getElementById('select-view').value) {
			case 'opencifras':
				html = renderSong(song, {
					alignBars: false,
					alignChordsWithLyrics: true,
					transposeValue: valTransposicao,
					printBarSeparators: 'always',
					printChordsDuration: 'always',
					printSubBeatDelimiters: true
				});
				break;
			case 'minimalist':
				html = renderSong(song, {
					alignBars: false,
					alignChordsWithLyrics: true,
					transposeValue: valTransposicao,
					printBarSeparators: 'never',
					printChordsDuration: 'never',
					printSubBeatDelimiters: false
				});
				html = html.replace(/%/g, ' ');
				break;
			case 'lyric':
				html = renderSong(song, {
					alignBars: false,
					alignChordsWithLyrics: false,
					printBarSeparators: 'never',
					printChordsDuration: 'never',
					printSubBeatDelimiters: false
				});

				tempDiv.innerHTML = html;
				tempDiv.querySelectorAll('.cmChordLine').forEach(el => el.remove());
				tempDiv.querySelectorAll('.cmKeyDeclaration, .cmTimeSignature').forEach(el => el.remove());
				html = tempDiv.innerHTML;
				break;
			case 'chords':
				html = renderSong(song, {
					alignBars: true,
					alignChordsWithLyrics: false,
					transposeValue: valTransposicao,
					printBarSeparators: 'always',
					printChordsDuration: 'always',
					printSubBeatDelimiters: true
				});

				tempDiv.innerHTML = html;
				tempDiv.querySelectorAll('.cmLyricLine').forEach(el => el.remove());
				html = tempDiv.innerHTML;
				break;
		}

		elementoDestino.innerHTML = html;

	} catch (error) {
		console.error("Erro no render:", error);
		elementoDestino.innerHTML = `<div class="alert alert-warning">${error.message}</div>`;
	}
}

export function alterarModoVisualizacao() {
	const select = document.getElementById('select-view');
	if (select) {
		localStorage.setItem('pref_viewMode', select.value);
		document.dispatchEvent(new Event('solicita-renderizacao'));
	}
}

export function carregarModoVisualizacao() {
	const select = document.getElementById('select-view');
	const modoSalvo = localStorage.getItem('pref_viewMode');

	if (select && modoSalvo) {
		select.value = modoSalvo;
	}
}