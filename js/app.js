import { db } from './db.js';
import { renderizarCifra, carregarModoVisualizacao, alterarModoVisualizacao } from './render.js';
import { alternarTela, limparEditor, obterDadosEditor, preencherEditor, aplicarTema, alternarTema, carregarTemaSalvo, exibirVersao, converterCifra } from './ui.js';
import { exportarDados, importarDados } from './backup.js';

const MUSICAS_EXEMPLO = [
	{
		id: 1,
		titulo: "Luar Do Sertão",
		artista: "Catulo da Paixão Cearense, João Pernambuco",
		conteudo: "key A\n4/4\n\n#i\nA Bm7\nE7 A\n\n#c\nA.. A7.. D.. B7..\nNão _há, ó _gente, ó, _não lu_ar\nE7.. E/D.. C#7\nComo _esse _do ser_tão\nA.. A7.. D.. B7..\nNão _há, ó _gente, ó, _não lu_ar\nE7 A.. E7..\nVomo _esse do ser_tão _\n\n#v\nA.. F#m7..\nOh que sau_dade do lu_ar\nBm7.. Dm7..\nDa minha terra_ Lá na _serra\nE7.. E/D.. A.. E7..\nBranque_jando folhas _secas pelo _chão _\nA.. F#m7..\nEste luar_ cá da ci_dade\nBm7.. Dm7..\nTão escuro_ não tem _aquela\nE7 A.. E7..\nsau_dade do luar lá do ser_tão _\n\n#c\n\n#v\nSe a lua _nasce por de_trás\nDa verde mata_ Mais pa_rece\nUm sol de _prata prate_ando a soli_dão _\nE a gente _pega na vi_ola\nQue ponte_ia E a can_ção\nÉ a lua _cheia a nos nascer do cora_ção _\n\n#c\n\nkey C\n#v\nCoisa mais _bela nesse _mundo\nNão e_xiste do que ou_vir\nUm galo _triste no ser_tão que faz _luar _\nParece at_é que a alma _da lua\nQue des_cansa escon_dida\nNa gar_ganta desse galo a solu_çar _\n\n#c\n\n#v\nAi quem me _dera se eu mor_resse\nLá na _serra abra_çado\nÀ minha _terra, e dor_mindo de uma _vez _\nSer enter_rado numa _grota\nPeque_nina onde à _tarde\nA suru_rina chora a sua viu_vez _\n\n#c x2\n\n#End\nC.. Bb.. C\n"
	}
]

// --- ESTADO GLOBAL ---
let musicaAtualId = null;
let musicaAtualConteudo = "";
let tomAtual = 0;
let tamanhoFonte = parseInt(localStorage.getItem('tamanhoFonte')) || 100;
let artistaSelecionado = null;

if ('launchQueue' in window) {
    window.launchQueue.setConsumer(async (launchParams) => {
        // console.log("Arquivo recebido!", launchParams); // DEBUG

        if (launchParams.files && launchParams.files.length > 0) {
            const fileHandle = launchParams.files[0];
            const file = await fileHandle.getFile();
            
            const tentarImportar = () => {
                if (window.importarDadosDireto) {
                    window.importarDadosDireto(file);
                } else {
                    setTimeout(tentarImportar, 100);
                }
            };
            tentarImportar();
        }
    });
}

// --- NAVEGAÇÃO ---
function navegar(tela, adicionarAoHistorico = true) {
	alternarTela(tela);

	if (tela === 'lista') {
		const inputBusca = document.getElementById('input-busca');
		if (inputBusca) inputBusca.value = '';

		carregarLista();
	}

	if (tela === 'editor' && !musicaAtualId) {
		limparEditor();
	}

	if (tela !== 'metronomo' && typeof window.pararMetronomo === 'function') {
		window.pararMetronomo();
	}

	if (adicionarAoHistorico) {
		window.history.pushState({ tela: tela }, null, `?tela=${tela}`);
	}
}

// --- LÓGICA DE LISTAGEM E FILTROS ---

// 1. Gera os botões (chips) de artistas
async function carregarFiltrosArtistas() {
	const container = document.getElementById('filtro-artistas');
	if (!container) return;

	try {
		const todasMusicas = await db.musicas.toArray();
		const artistasSet = new Set();

		todasMusicas.forEach(m => {
			if (m.artista) {
				// Separa por ", " OU por " / "
				const partes = m.artista.split(/, | \/ /);
				partes.forEach(p => {
					const nome = p.trim();
					if (nome) artistasSet.add(nome);
				});
			}
		});

		const artistas = Array.from(artistasSet).sort();

		container.innerHTML = '';
		container.appendChild(criarBotaoChip('Todos', null));

		artistas.forEach(artista => {
			container.appendChild(criarBotaoChip(artista, artista));
		});

	} catch (e) {
		console.error("Erro ao carregar filtros:", e);
	}
}

function criarBotaoChip(texto, valorArtista) {
	const btn = document.createElement('button');
	const ehAtivo = artistaSelecionado === valorArtista;

	// Estilo: Se ativo usa cor sólida, se não usa outline
	btn.className = `btn btn-sm rounded-pill ${ehAtivo ? 'btn-secondary' : 'btn-outline-secondary'}`;
	btn.style.whiteSpace = 'nowrap'; // Impede que o nome quebre linha
	btn.textContent = texto;
	btn.type = 'button';

	btn.onclick = () => {
		artistaSelecionado = valorArtista;

		// Recarrega os filtros para atualizar a cor do botão ativo
		carregarFiltrosArtistas();

		// Recarrega a lista aplicando o novo filtro
		const termo = document.getElementById('input-busca').value;
		carregarLista(termo);
	};

	return btn;
}

// 2. Carrega a lista combinando Artista + Busca
async function carregarLista(termoBusca = "") {
	const ul = document.getElementById('lista-musicas');
	ul.innerHTML = '<div class="text-center text-muted mt-5"><div class="spinner-border spinner-border-sm"></div> Carregando...</div>';

	try {
		// Passo A: Pega tudo do banco
		let musicas = await db.musicas.toArray();

		// Passo B: Filtra por Artista (Lógica para múltiplos artistas)
		if (artistaSelecionado) {
			musicas = musicas.filter(m => {
				if (!m.artista) return false;
				const listaArtistas = m.artista.split(/, | \/ /).map(a => a.trim());
				return listaArtistas.includes(artistaSelecionado);
			});
		}

		// Passo C: Filtra por Texto (Busca)
		if (termoBusca.trim().length > 0) {
			const termo = termoBusca.toLowerCase();
			musicas = musicas.filter(musica => {
				return musica.titulo.toLowerCase().includes(termo) ||
					musica.conteudo.toLowerCase().includes(termo) ||
					(musica.artista && musica.artista.toLowerCase().includes(termo));
			});
		}

		// Passo D: Ordena por Título
		musicas.sort((a, b) => a.titulo.localeCompare(b.titulo));

		// Passo E: Renderiza
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
                        <p class="small fst-italic text-secondary mb-0">${musica.artista || 'Desconhecido'}</p>
                    </div>
                    <i class="bi bi-chevron-right text-muted opacity-50"></i>
                </div>
            `;
			a.onclick = () => abrirMusica(musica);
			ul.appendChild(a);
		});
	} catch (error) {
		console.error(error);
		ul.innerHTML = '<div class="text-center text-danger">Erro ao carregar lista.</div>';
	}
	atualizarContador();
}

// --- PLAYER / LEITOR ---

function abrirMusica(musica) {
	// Guarda na variável global para o renderizador usar
	window.musicaAtualGlobal = musica;

	musicaAtualId = musica.id;
	musicaAtualConteudo = musica.conteudo;

	tomAtual = musica.tom || 0;

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

	if (musicaAtualId) {
		db.musicas.update(musicaAtualId, { tom: tomAtual });
	}
}

function resetarTom() {
	tomAtual = 0;
	renderizarCifra(document.getElementById('render-area'), musicaAtualConteudo, tomAtual);
	atualizarDisplayTom();

	if (musicaAtualId) {
		db.musicas.update(musicaAtualId, { tom: 0 });
	}
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

// --- CRUD (Salvar/Editar/Deletar) ---

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

		// Atualiza os filtros (pois pode ter surgido um novo artista)
		await carregarFiltrosArtistas();

		atualizarContador();

		abrirMusica(musicaAtualizada);

	} catch (e) {
		console.error(e);
		alert("Erro ao salvar: " + e.message);
	}
}

async function deletar() {
	if (!musicaAtualId) return;

	if (confirm("Tem certeza que deseja excluir esta música permanentemente?")) {
		try {
			await db.musicas.delete(musicaAtualId);
			// alert("Música excluída.");
			musicaAtualId = null;
			navegar('lista');
		} catch (e) {
			console.error(e);
			alert("Erro ao excluir.");
		}
	}

	atualizarContador();
}

async function editar() {
	if (!musicaAtualId) return;
	const musica = await db.musicas.get(musicaAtualId);
	preencherEditor(musica);
	navegar('editor');
}

// --- EXPORTAR FUNÇÕES PARA O HTML ---
window.navegar = navegar;
window.salvarMusica = salvar;
window.cancelarEdicao = () => confirm("Descartar?") ? navigateToHome() : null;
window.editarAtual = editar;
window.deletarAtual = deletar;
window.exportarDados = exportarDados;
window.importarDados = (el) => importarDados(el, () => {
	carregarLista();
	carregarFiltrosArtistas();
	atualizarContador();
});
window.filtrarLista = () => carregarLista(document.getElementById('input-busca').value);
window.mudarTom = mudarTom;
window.alternarTema = alternarTema;
window.mudarTamanhoFonte = mudarTamanhoFonte;
window.resetarFonte = resetarFonte;
window.resetarTom = resetarTom;
window.alterarModoVisualizacao = alterarModoVisualizacao;
window.converterCifra = converterCifra;

function navigateToHome() {
	musicaAtualId = null;
	navegar('lista');
}
window.cancelarEdicao = navigateToHome;

// --- EVENTOS E INICIALIZAÇÃO ---

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
			// console.log("Músicas de exemplo adicionadas!");
			// Se adicionou exemplos, recarrega filtros
			carregarFiltrosArtistas();
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
	exibirVersao();
	atualizarContador();
});

document.addEventListener('solicita-renderizacao', () => {
	const areaRender = document.getElementById('render-area');
	// Usa a variável global salva no abrirMusica()
	if (window.musicaAtualGlobal && areaRender) {
		renderizarCifra(areaRender, window.musicaAtualGlobal.conteudo, 0);
	}
});

async function atualizarContador() {
	try {
		const total = await db.musicas.count();

		const elemento = document.getElementById('contador-musicas');
		if (total > 1) {
			elemento.innerText = total + ' Músicas';
		} else {
			elemento.innerText = total + ' Música';
		}
	} catch (e) {
		console.error("Erro ao contar músicas:", e);
	}
}

// Inicialização da Busca e Listagem
document.getElementById('input-busca')?.addEventListener('input', (e) => carregarLista(e.target.value));

verificarExemplos().then(() => {
	carregarFiltrosArtistas();
	carregarLista();
});