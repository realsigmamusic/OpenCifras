import { db } from './db.js';
import { renderizarCifra } from './render.js';
import { alternarTela, limparEditor, obterDadosEditor, preencherEditor, aplicarTema, alternarTema } from './ui.js';
import { exportarDados, importarDados } from './backup.js';

const MUSICAS_EXEMPLO = [
	{
		titulo: "Primeiros passos no OpenCifras",
		artista: "Real Sigma Music",
		conteudo: "Bem-vindo ao OpenCifras!\nO OpenCifras é um editor no formato ChordMark. Você pode usá-lo para escrever rapidamente transcrições precisas de músicas compostas por acordes e letras.\n\nDm7.. G7.. CM7\n_Apenas es_creva a _sua letra. \n% \nE _veja como _fica: fan_tástico!\n\nPor onde começar? Você pode ler o guia do usuário em:\nhttps://chordmark.netlify.app/docs/getting-started\nDivirta-se!\n",
id: 1
	}
]

let musicaAtualId = null;
let musicaAtualConteudo = "";
let tomAtual = 0;
let tamanhoFonte = parseInt(localStorage.getItem('tamanhoFonte')) || 100;

function navegar(tela, adicionarAoHistorico = true) {
	alternarTela(tela);

	if (tela === 'lista') {
		const inputBusca = document.getElementById('input-busca');
		if (inputBusca) inputBusca.value = '';
		carregarLista();
		musicaAtualId = null;
	}

	if (tela === 'editor' && !musicaAtualId) {
		limparEditor();
	}

	if (adicionarAoHistorico) {
		window.history.pushState({ tela: tela }, null, `?tela=${tela}`);
	}
}

async function carregarLista(termoBusca = "") {
	const ul = document.getElementById('lista-musicas');
	ul.innerHTML = '<div class="text-center text-muted">Carregando...</div>';

	try {
		let musicas;
		if (termoBusca.trim().length > 0) {
			const termo = termoBusca.toLowerCase();
			musicas = await db.musicas.filter(musica => {
				return musica.titulo.toLowerCase().includes(termo) ||
					musica.conteudo.toLowerCase().includes(termo);
			}).toArray();
		} else {
			musicas = await db.musicas.orderBy('titulo').toArray();
		}

		if (musicas.length === 0) {
			ul.innerHTML = '<div class="text-center mt-5 text-muted">Nenhuma música encontrada.</div>';
			return;
		}

		ul.innerHTML = '';
		musicas.forEach(musica => {
			const a = document.createElement('a');
			a.className = 'list-group-item list-group-item-action d-flex';
			a.style.cursor = 'pointer';
			a.innerHTML = `
                <div class="d-flex w-100 justify-content-between align-items-center">
                    <div>
                        <h6 class="mb-0 fw-bold text-body">${musica.titulo}</h6>
                        <p class="small fst-italic text-secondary">${musica.artista}</p>
                    </div>
                    <i class="bi bi-chevron-right text-muted opacity-50"></i>
                </div>
            `;
			a.onclick = () => abrirMusica(musica);
			ul.appendChild(a);
		});
	} catch (error) {
		console.error(error);
	}
}

function abrirMusica(musica) {
	musicaAtualId = musica.id;
	musicaAtualConteudo = musica.conteudo;
	tomAtual = 0;

	document.getElementById('titulo-musica').textContent = musica.titulo;
	const detalhesEl = document.getElementById('detalhes-musica');
    if (musica.artista) {
        detalhesEl.innerHTML = `${musica.artista}`;
    } else {
        detalhesEl.innerHTML = '';
    }

	renderizarCifra(document.getElementById('render-area'), musica.conteudo, tomAtual);

	atualizarDisplayTom();
	navegar('leitor');
	aplicarFonte();
}

function mudarTom(delta) {
	tomAtual += delta;
	renderizarCifra(document.getElementById('render-area'), musicaAtualConteudo, tomAtual);
	atualizarDisplayTom();
}

function mudarTamanhoFonte(delta) {
	tamanhoFonte += delta;

	if (tamanhoFonte < 50) tamanhoFonte = 50;
	if (tamanhoFonte > 250) tamanhoFonte = 250;

	localStorage.setItem('tamanhoFonte', tamanhoFonte);
	aplicarFonte();
}

function resetarFonte() {
	tamanhoFonte = 100;
	localStorage.setItem('tamanhoFonte', tamanhoFonte);
	aplicarFonte();
}

function aplicarFonte() {
	const area = document.getElementById('render-area');
	if (area) {
		area.style.fontSize = `${tamanhoFonte}%`;
	}
}

function atualizarDisplayTom() {
	const display = document.getElementById('display-tom');
	if (display) {
		const sinal = tomAtual > 0 ? '+' : '';
		display.innerText = tomAtual === 0 ? 'Tom' : `${sinal}${tomAtual}`;
	}
}

async function salvar() {
	const dados = obterDadosEditor();
	if (!dados.titulo || !dados.conteudo) {
		alert("Preencha título e conteúdo!");
		return;
	}

	try {
		let idParaAbrir;

		if (musicaAtualId) {
			await db.musicas.update(musicaAtualId, {
				titulo: dados.titulo,
				conteudo: dados.conteudo,
				artista: dados.artista
			});
			idParaAbrir = musicaAtualId;
		} else {
			idParaAbrir = await db.musicas.add({
				titulo: dados.titulo,
				conteudo: dados.conteudo,
				artista: dados.artista
			});
		}

		const musicaAtualizada = await db.musicas.get(idParaAbrir);

		abrirMusica(musicaAtualizada);

	} catch (e) {
		console.error(e);
		alert("Erro ao salvar: " + e.message);
	}
}

async function deletar() {
	if (!musicaAtualId) return;
	if (confirm("Excluir música?")) {
		await db.musicas.delete(musicaAtualId);
		musicaAtualId = null;
		navegar('lista');
	}
}

async function editar() {
	if (!musicaAtualId) return;
	const musica = await db.musicas.get(musicaAtualId);
	preencherEditor(musica);
	navegar('editor');
}

window.navegar = navegar;
window.salvarMusica = salvar;
window.cancelarEdicao = () => confirm("Descartar?") ? navigateToHome() : null;
window.editarAtual = editar;
window.deletarAtual = deletar;
window.exportarDados = exportarDados;
window.importarDados = (el) => importarDados(el, carregarLista);
window.filtrarLista = () => carregarLista(document.getElementById('input-busca').value);
window.mudarTom = mudarTom;
window.alternarTema = alternarTema;
window.mudarTamanhoFonte = mudarTamanhoFonte;
window.resetarFonte = resetarFonte;

function navigateToHome() {
	musicaAtualId = null;
	navegar('lista');
}
window.cancelarEdicao = navigateToHome;

window.onpopstate = function (event) {
	if (event.state && event.state.tela) {
		navegar(event.state.tela, false);
	} else {
		navegar('lista', false);
	}
};

const temaSalvo = localStorage.getItem('tema');
const preferenciaSistema = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
aplicarTema(temaSalvo || preferenciaSistema);

async function verificarExemplos() {
    try {
        const quantidade = await db.musicas.count();
        if (quantidade === 0) {
            await db.musicas.bulkAdd(MUSICAS_EXEMPLO);
            console.log("Músicas de exemplo adicionadas!");
        }
    } catch (e) {
        console.error("Erro ao criar exemplos:", e);
    }
}

// INICIALIZAÇÃO
document.getElementById('input-busca')?.addEventListener('input', (e) => carregarLista(e.target.value));

verificarExemplos().then(() => {
    carregarLista();
});