import { db } from './db.js';

export async function exportarDados() {
	try {
		const musicas = await db.musicas.toArray();
		const dadosBackup = {
			data: new Date().toISOString(),
			app: "OpenCifras",
			versao: 3,
			musicas: musicas
		};

		const blob = new Blob([JSON.stringify(dadosBackup, null, 2)], { type: "application/json" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');

		const dataHoje = new Date().toISOString().split('T')[0];
		a.href = url;
		a.download = `OpenCifras-${dataHoje}.json`;

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