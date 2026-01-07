import { db } from './db.js';
import { renderizarCifra } from './render.js';
import { alternarTela, limparEditor, obterDadosEditor, preencherEditor, aplicarTema, alternarTema } from './ui.js';
import { exportarDados, importarDados } from './backup.js';

let musicaAtualId = null;
let musicaAtualConteudo = "";
let tomAtual = 0;

function navegar(tela, adicionarAoHistorico = true) {
	alternarTela(tela);
	
	if (tela === 'lista') {
		const inputBusca = document.getElementById('input-busca');
		if(inputBusca) inputBusca.value = ''; 
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
			a.className = 'list-group-item list-group-item-action d-flex justify-content-between align-items-center';
			a.style.cursor = 'pointer';
			a.innerHTML = `<strong>${musica.titulo}</strong> <i class="bi bi-box-arrow-right"></i>`;
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
	renderizarCifra(document.getElementById('render-area'), musica.conteudo, tomAtual);
	
	atualizarDisplayTom();
	navegar('leitor');
}

function mudarTom(delta) {
	tomAtual += delta;
	renderizarCifra(document.getElementById('render-area'), musicaAtualConteudo, tomAtual);
	atualizarDisplayTom();
}

function atualizarDisplayTom() {
	const display = document.getElementById('display-tom');
	if (display) {
		const sinal = tomAtual > 0 ? '+' : '';
		display.innerText = tomAtual === 0 ? 'Original' : `${sinal}${tomAtual}`;
	}
}

async function salvar() {
	const dados = obterDadosEditor();
	if (!dados.titulo) return alert("Título obrigatório!");

	try {
		if (dados.id) {
			await db.musicas.update(parseInt(dados.id), { titulo: dados.titulo, conteudo: dados.conteudo });
		} else {
			await db.musicas.add({ titulo: dados.titulo, conteudo: dados.conteudo });
		}
		musicaAtualId = null;
		navegar('lista');
	} catch (e) {
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

function navigateToHome() { 
	musicaAtualId = null; 
	navegar('lista'); 
}
window.cancelarEdicao = navigateToHome;

window.onpopstate = function(event) {
	if (event.state && event.state.tela) {
		navegar(event.state.tela, false); 
	} else {
		navegar('lista', false);
	}
};

const temaSalvo = localStorage.getItem('tema');
const preferenciaSistema = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
aplicarTema(temaSalvo || preferenciaSistema);

// INICIALIZAÇÃO
document.getElementById('input-busca')?.addEventListener('input', (e) => carregarLista(e.target.value));
carregarLista();