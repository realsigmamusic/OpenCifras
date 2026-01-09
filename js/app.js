import { db } from './db.js';
import { renderizarCifra, carregarModoVisualizacao, alterarModoVisualizacao } from './render.js';
import { alternarTela, limparEditor, obterDadosEditor, preencherEditor, aplicarTema, alternarTema, carregarTemaSalvo } from './ui.js';
import { exportarDados, importarDados } from './backup.js';

const MUSICAS_EXEMPLO = [
	{
		titulo: "Luar do sertão",
		artista: "Catulo da Paixão Cearense / João Pernambuco",
		conteudo: "key A\n4/4\n\n#i\nA Bm7 E7 A\n\n#c\nA.. A7.. D.. B7..\nNão _há, ó _gente, ó, _não lu_ar\nE7.. E/D.. C#7\nComo _esse _do ser_tão\nA.. A7.. D.. B7..\nNão _há, ó _gente, ó, _não lu_ar\nE7 A.. E7..\nVomo _esse do ser_tão _\n\n#v\nA.. F#m7..\nOh que sau_dade do lu_ar\nBm7.. Dm7..\nDa minha terra_ Lá na _serra\nE7.. E/D.. A.. E7..\nBranque_jando folhas _secas pelo _chão _\nA.. F#m7..\nEste luar_ cá da ci_dade\nBm7.. Dm7..\nTão escuro_ não tem _aquela\nE7 A.. E7..\nsau_dade do luar lá do ser_tão _\n\n#c\n\n#v\nSe a lua _nasce por de_trás\nDa verde mata_ Mais pa_rece\nUm sol de _prata prate_ando a soli_dão _\nE a gente _pega na vi_ola\nQue ponte_ia E a can_ção\nÉ a lua _cheia a nos nascer do cora_ção _\n\n#c\n\nkey C\n#v\nCoisa mais _bela nesse _mundo\nNão e_xiste do que ou_vir\nUm galo _triste no ser_tão que faz _luar _\nParece at_é que a alma _da lua\nQue des_cansa escon_dida\nNa gar_ganta desse galo a solu_çar _\n\n#c\n\n#v\nAi quem me _dera se eu mor_resse\nLá na _serra abra_çado\nÀ minha _terra, e dor_mindo de uma _vez _\nSer enter_rado numa _grota\nPeque_nina onde à _tarde\nA suru_rina chora a sua viu_vez _\n\n#c x2\n\n#End\nC.. Bb.. C\n"
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

function resetarTom() {
	tomAtual = 0;
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

const selectModoLimpo = document.getElementById('select-view');
if (selectModoLimpo) {
    selectModoLimpo.addEventListener('change', () => {
        if (musicaAtualId) {
            renderizarCifra(document.getElementById('render-area'), musicaAtualConteudo, tomAtual);
        }
    });
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
window.resetarTom = resetarTom;
window.alterarModoVisualizacao = alterarModoVisualizacao;

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

const renderArea = document.getElementById('render-area');

if (renderArea) {
	renderArea.addEventListener('click', (e) => {
		if (e.target.classList.contains('cmChordSymbol')) {
			const nomeAcorde = e.target.textContent;
			mostrarInfoAcorde(nomeAcorde);
		}
	});
}

function mostrarInfoAcorde(acordeStr) {
	if (typeof Tonal === 'undefined') {
		console.error("Tonal.js não carregado!");
		return;
	}

	const acordeLimpo = acordeStr.replace(/[\s().]+/g, '');

	const info = Tonal.Chord.get(acordeLimpo);

	if (info.empty) {
		console.warn('Acorde não reconhecido:', acordeLimpo);
		return;
	}

	document.getElementById('titulo-acorde').textContent = info.symbol || acordeLimpo;

	const acordeNomes = info.aliases && info.aliases.length ? info.aliases.join(', ') : '...';
	document.getElementById('aliases-acorde').textContent = acordeNomes;

	const notas = info.notes && info.notes.length ? info.notes.join(', ') : '...';
	document.getElementById('notas-acorde').textContent = notas;

	const intervalos = info.intervals && info.intervals.length ? info.intervals.join(' - ') : '...';
	document.getElementById('intervalos-acorde').textContent = intervalos;

	const modalElement = document.getElementById('modalAcorde');
	const modal = new bootstrap.Modal(modalElement);
	modal.show();
}

window.addEventListener('load', () => {
    if (typeof carregarTemaSalvo === 'function') carregarTemaSalvo();

    carregarModoVisualizacao();
});

document.addEventListener('solicita-renderizacao', () => {
    const areaRender = document.getElementById('render-area');
    if (window.musicaAtualGlobal && areaRender) {
        renderizarCifra(areaRender, window.musicaAtualGlobal.conteudo, 0); 
    }
});

// INICIALIZAÇÃO
document.getElementById('input-busca')?.addEventListener('input', (e) => carregarLista(e.target.value));

verificarExemplos().then(() => {
	carregarLista();
});