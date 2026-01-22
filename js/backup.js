import { db } from './db.js';

export async function exportarDados() {
	try {
		const musicas = await db.musicas.toArray();
		const dadosBackup = {
			data: new Date().toLocaleString(),
			app: "OpenCifras",
			versao: 3,
			musicas: musicas
		};

		const blob = new Blob([JSON.stringify(dadosBackup, null, 2)], { type: "application/json" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');

		const dataHoje = new Date().toLocaleString().replaceAll('/', '-').replaceAll(':', '-').replaceAll(',', '');
		a.href = url;
		a.download = `OpenCifras ${dataHoje}.json`;

		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);

	} catch (error) {
		alert('Erro ao exportar: ' + error.message);
	}
}

export async function importarDados(input, aoTerminar) {
	const arquivo = input.files[0];
	if (!arquivo) return;

	const leitor = new FileReader();
	leitor.onload = async (e) => {
		try {
			const json = JSON.parse(e.target.result);
			if (!json.app || json.app !== "OpenCifras") throw new Error("Arquivo inválido.");

			const musicasNoBanco = await db.musicas.toArray();
			const titulosExistentes = new Set(musicasNoBanco.map(m => m.titulo.toLowerCase().trim()));

			const novasMusicas = json.musicas.filter(m => {
				return !titulosExistentes.has(m.titulo.toLowerCase().trim());
			});

			if (novasMusicas.length === 0) {
				alert("Todas as músicas do backup já existem no seu banco.");
			} else if (confirm(`Importar ${novasMusicas.length} novas músicas?`)) {
				const paraSalvar = novasMusicas.map(({ id, ...resto }) => resto);
				await db.musicas.bulkAdd(paraSalvar);
				alert("Importação concluída!");
				if (aoTerminar) aoTerminar(); // Atualiza a lista
			}
		} catch (error) {
			alert('Erro ao importar: ' + error.message);
		}
		input.value = '';
	};
	leitor.readAsText(arquivo);
}

export function copiarLinkMusica(musica) {
	if (!musica) return;

	try {
		const dados = {
			titulo: musica.titulo,
			artista: musica.artista,
			tom: musica.tom,
			conteudo: musica.conteudo
		};

		const stringJson = JSON.stringify(dados);
		const comprimido = LZString.compressToEncodedURIComponent(stringJson);

		const urlBase = window.location.origin + window.location.pathname;
		const linkFinal = `${urlBase}?cifra=${comprimido}`;

		navigator.clipboard.writeText(linkFinal).then(() => {
			alert('Link copiado para a área de transferência.');
		}).catch(err => {
			prompt("Copie o link abaixo:", linkFinal);
		});

	} catch (e) {
		console.error(e);
		alert("Erro ao gerar link.");
	}
}

export function copiarTextoWhatsapp(musica, tom = 0) {
	if (!musica) return;

	const cm = window['chord-mark'];
	if (!cm) {
		alert("Erro: Biblioteca ChordMark não carregada.");
		return;
	}

	try {
		const parsed = cm.parseSong(musica.conteudo);
		const rendered = cm.renderSong(parsed, {
			transposeValue: tom,
			alignChordsWithLyrics: true,
			alignBars: false,
			customRenderer: whatsappCustomRenderer
		});

		navigator.clipboard.writeText(rendered).then(() => {
			alert('Cifra copiada para o WhatsApp!');
		}).catch(err => {
			console.error("Clipboard API failed:", err);
			// Fallback para navegadores que bloqueiam a API Clipboard ou não estão em HTTPS
			const textArea = document.createElement("textarea");
			textArea.value = rendered;
			textArea.style.position = "fixed";
			textArea.style.left = "-9999px";
			textArea.style.top = "0";
			document.body.appendChild(textArea);
			textArea.focus();
			textArea.select();
			try {
				const successful = document.execCommand('copy');
				if (successful) {
					alert('Cifra copiada para o WhatsApp!');
				} else {
					alert("Erro ao copiar. Tente selecionar e copiar manualmente.");
				}
			} catch (err) {
				alert("Erro ao copiar.");
			}
			document.body.removeChild(textArea);
		});

	} catch (e) {
		console.error(e);
		alert("Erro ao gerar texto para WhatsApp.");
	}
}

function whatsappCustomRenderer(allLines) {
	let output = [];
	let inCodeBlock = false;

	allLines.forEach(line => {
		const isBlockContent = line.type === 'chord' || line.type === 'lyric';

		if (!isBlockContent && inCodeBlock) {
			output.push('```');
			inCodeBlock = false;
		}

		if (line.type === 'sectionLabel') {
			if (output.length > 0 && output[output.length - 1] !== '') output.push('');
			output.push(`*${line.model.rendered.label}*`);
		} else if (line.type === 'keyDeclaration') {
			output.push(`*Tom: ${line.symbol}*`);
		} else if (line.type === 'timeSignature') {
			output.push(`*${line.model.string}*`);
		} else if (line.type === 'emptyLine') {
			if (output.length > 0 && output[output.length - 1] !== '') output.push('');
		} else {
			if (!inCodeBlock) {
				output.push('```');
				inCodeBlock = true;
			}

			if (line.type === 'chord') {
				let lineStr = '';
				if (line.model.offset && line.model.offset > 0) {
					lineStr += ' '.repeat(line.model.offset);
				}
				lineStr += ' '; // antes era '|'
				line.model.allBars.forEach(bar => {
					bar.allChords.forEach(chord => {
						lineStr += chord.symbol || '';
						if (chord.spacesWithin > 0) lineStr += ' '.repeat(chord.spacesWithin);
						if (chord.spacesAfter > 0) lineStr += ' '.repeat(chord.spacesAfter);
					});
					lineStr += ' '; // antes era '|'
				});
				output.push(lineStr);
			} else if (line.type === 'lyric') {
				output.push(line.model.lyrics);
			}
		}
	});

	if (inCodeBlock) {
		output.push('```');
	}

	return output.join('\n').trim();
}