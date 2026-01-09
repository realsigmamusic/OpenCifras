import { parseSong, renderSong } from 'https://cdn.jsdelivr.net/npm/chord-mark@0.17.0/+esm';

export function renderizarCifra(elementoDestino, conteudo, semitons = 0) {
	try {
		const valTransposicao = parseInt(semitons) || 0;

		const song = parseSong(conteudo);

		let html;

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
				break;
		}

		elementoDestino.innerHTML = html;

	} catch (error) {
		console.error("Erro no render:", error);
		elementoDestino.innerHTML = `<div class="alert alert-warning">${error.message}</div>`;
	}
}