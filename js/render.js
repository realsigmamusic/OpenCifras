import { parseSong, renderSong } from 'https://cdn.jsdelivr.net/npm/chord-mark@0.17.0/+esm';

export function renderizarCifra(elementoDestino, conteudo, semitons = 0) {
	try {
		if (!parseSong || !renderSong) {
			throw new Error("Biblioteca ChordMark não carregou.");
		}

		const song = parseSong(conteudo);
		
		const html = renderSong(song, {
			alignBars: false, 
			alignChordsWithLyrics: true,
			transposeValue: semitons 
		});
		
		elementoDestino.innerHTML = html;
		
	} catch (error) {
		console.error("Erro no render:", error);
		elementoDestino.innerHTML = `
			<div class="alert alert-warning">
				<strong>Erro ao renderizar:</strong> ${error.message}
			</div>
			<pre class="text-white">${conteudo}</pre>
		`;
	}
}