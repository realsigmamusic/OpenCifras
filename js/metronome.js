let audioCtx = null;
let isPlaying = false;
let timerID = null;
let nextNoteTime = 0.0;
let current16thNote = 0;
let bpm = 120;
let beatsPerBar = 4;
let lookahead = 25.0;
let scheduleAheadTime = 0.1;

// Elementos da UI
const bpmDisplay = document.getElementById('bpm-display');
const bpmSlider = document.getElementById('bpm-slider');
const visualBeat = document.getElementById('visual-beat');
const btnPlay = document.getElementById('btn-play-stop');

// --- CONTROLES EXPOSTOS ---
window.alternarMetronomo = function() {
    if (isPlaying) {
        stop();
    } else {
        start();
    }
};

window.ajustarBpm = function(delta) {
    let novoBpm = parseInt(bpm) + delta;
    if (novoBpm < 40) novoBpm = 40;
    if (novoBpm > 280) novoBpm = 280;
    definirBpm(novoBpm);
};

window.definirBpm = function(valor) {
    bpm = parseInt(valor);
    bpmDisplay.innerText = bpm;
    bpmSlider.value = bpm;
};

window.mudarCompasso = function(tempos) {
    beatsPerBar = tempos;
    current16thNote = 0;
};

// --- MOTOR DE ÁUDIO ---
function nextNote() {
    const secondsPerBeat = 60.0 / bpm;
    nextNoteTime += secondsPerBeat; // semínima

    current16thNote++; 
    if (current16thNote >= beatsPerBar) {
        current16thNote = 0;
    }
}

function scheduleNote(beatNumber, time) {
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    // Cabeça do compasso (1760Hz), o resto (880Hz)
    if (beatNumber === 0) {
        osc.frequency.value = 1760; 
    } else {
        osc.frequency.value = 880; 
    }

    // Envelope de som curto (Bip!)
    gainNode.gain.setValueAtTime(1, time);
    gainNode.gain.exponentialRampToValueAtTime(0.001, time + 0.05);

    osc.start(time);
    osc.stop(time + 0.1);

    // setTimeout para alterar a cor no momento exato
    const timeToVisual = (time - audioCtx.currentTime) * 1000;
    
    setTimeout(() => {
        if (!isPlaying) return;
        
        // Piscar
        if (beatNumber === 0) {
            visualBeat.style.backgroundColor = 'var(--bs-primary)';
            visualBeat.classList.add('text-white');
        } else {
            visualBeat.style.backgroundColor = 'var(--bs-secondary-bg-subtle)';
        }
        
        // Voltar ao normal rápido
        setTimeout(() => {
            visualBeat.style.backgroundColor = 'transparent';
            visualBeat.classList.remove('text-white');
        }, 100);

    }, timeToVisual);
}

function scheduler() {
    // Enquanto houver notas para tocar antes do próximo intervalo
    while (nextNoteTime < audioCtx.currentTime + scheduleAheadTime) {
        scheduleNote(current16thNote, nextNoteTime);
        nextNote();
    }
    timerID = window.setTimeout(scheduler, lookahead);
}

function start() {
    if (isPlaying) return;

    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }

    // Retomar contexto se estiver suspenso (comum em navegadores mobile)
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }

    current16thNote = 0;
    nextNoteTime = audioCtx.currentTime + 0.05;
    
    isPlaying = true;
    scheduler();

    // UI Update
    btnPlay.classList.replace('btn-success', 'btn-danger');
    btnPlay.innerHTML = '<i class="bi bi-stop-fill fs-1"></i>';
}

function stop() {
    isPlaying = false;
    window.clearTimeout(timerID);
    
    // UI Update
    btnPlay.classList.replace('btn-danger', 'btn-success');
    btnPlay.innerHTML = '<i class="bi bi-play-fill fs-1"></i>';
    visualBeat.style.backgroundColor = 'transparent';
}

// Exportar para usar no app.js se precisar parar ao sair da tela
window.pararMetronomo = stop;