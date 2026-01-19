import { db } from './db.js';

export async function exportarDados() {
	try {
		const musicas = await db.musicas.toArray();
		const dadosBackup = {
			data: new Date().toISOString(),
			app: "OpenCifras",
			versao: 2,
			musicas: musicas
		};

		const blob = new Blob([JSON.stringify(dadosBackup, null, 2)], { type: "application/json" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');

		const dataHoje = new Date().toISOString().split('T')[0];
		a.href = url;
		a.download = `opencifras-${dataHoje}.json`;

		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);

		// alert('Backup baixado com sucesso!');
	} catch (error) {
		alert('Erro ao exportar: ' + error.message);
	}
}

export async function importarDados(origem, aoTerminar) {
	let arquivo;

	if (origem instanceof File) {
		arquivo = origem;
	}
	else if (origem.files && origem.files[0]) {
		arquivo = origem.files[0];
	}
	else {
		return; // Nada para importar
	}

	const leitor = new FileReader();
	leitor.onload = async (e) => {
		try {
			const json = JSON.parse(e.target.result);

			let listaMusicas = [];
			if (Array.isArray(json)) {
				listaMusicas = json;
			} else if (json.musicas && Array.isArray(json.musicas)) {
				listaMusicas = json.musicas;
			} else {
				listaMusicas = [json];
			}

			if (listaMusicas.length === 0) throw new Error("Arquivo vazio ou inválido.");

			if (!listaMusicas[0].titulo) throw new Error("Formato inválido.");

			const musicasNoBanco = await db.musicas.toArray();
			const titulosExistentes = new Set(musicasNoBanco.map(m => m.titulo.toLowerCase().trim()));

			const novasMusicas = listaMusicas.filter(m => {
				return !titulosExistentes.has(m.titulo.toLowerCase().trim());
			});

			if (novasMusicas.length === 0) {
				alert("As músicas deste arquivo já existem no seu banco.");
			} else if (confirm(`Encontradas ${novasMusicas.length} novas músicas. Importar?`)) {
				// Remove IDs para evitar conflito
				const paraSalvar = novasMusicas.map(({ id, ...resto }) => resto);
				await db.musicas.bulkAdd(paraSalvar);

				alert("Importação concluída!");
				if (aoTerminar) aoTerminar();
			}
		} catch (error) {
			alert('Erro ao importar: ' + error.message);
		}

		if (origem.value) origem.value = '';
	};
	leitor.readAsText(arquivo);
}