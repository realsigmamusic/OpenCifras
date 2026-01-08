import { parseSong, renderSong } from 'https://cdn.jsdelivr.net/npm/chord-mark@0.17.0/+esm';

export function renderizarCifra(elementoDestino, conteudo, semitons = 0) {
	try {
		const valTransposicao = parseInt(semitons) || 0;

		const song = parseSong(conteudo);

		const html = renderSong(song, {
			alignBars: false,
			alignChordsWithLyrics: true,
			transposeValue: valTransposicao,
		});

		elementoDestino.innerHTML = html;

	} catch (error) {
		console.error("Erro no render:", error);
		elementoDestino.innerHTML = `<div class="alert alert-warning">${error.message}</div>`;
	}
}