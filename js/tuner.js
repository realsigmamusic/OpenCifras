let audioContext = null;
let analyser = null;
let mediaStreamSource = null;
let isRunning = false;
let animationFrameId = null;

// Frequências exatas das cordas do violão (Afinação Standard A440)
const FREQUENCIAS_ALVO = {
    'E2': 82.41,
    'A2': 110.00,
    'D3': 146.83,
    'G3': 196.00,
    'B3': 246.94,
    'E4': 329.63
};

let cordaAlvo = null; // Qual corda o usuário quer afinar?

// --- CONTROLE DA UI ---

window.alternarAfinador = async function() {
    const btn = document.getElementById('btn-power-tuner');
    const ui = document.getElementById('tuner-interface');

    if (!isRunning) {
        // LIGAR
        try {
            await iniciarAudio();
            isRunning = true;
            btn.classList.replace('btn-outline-success', 'btn-danger');
            btn.innerHTML = '<i class="bi bi-power"></i> Desligar';
            ui.classList.remove('d-none');
            
            // Seleciona a primeira corda por padrão se não tiver nenhuma
            if(!cordaAlvo) selecionarCorda('E2', document.querySelector('.btn-corda'));
            
            atualizarLoop();
        } catch (e) {
            alert("Erro ao acessar microfone: " + e.message);
        }
    } else {
        // DESLIGAR
        pararAudio();
        isRunning = false;
        btn.classList.replace('btn-danger', 'btn-outline-success');
        btn.innerHTML = '<i class="bi bi-power"></i> Ligar Afinador';
        ui.classList.add('d-none');
    }
}

window.selecionarCorda = function(nota, btnElement) {
    cordaAlvo = FREQUENCIAS_ALVO[nota];
    
    // Atualiza visual dos botões
    document.querySelectorAll('.btn-corda').forEach(b => {
        b.classList.remove('btn-primary', 'text-white');
        b.classList.add('btn-outline-secondary');
    });
    btnElement.classList.remove('btn-outline-secondary');
    btnElement.classList.add('btn-primary', 'text-white');

    // Atualiza texto
    document.getElementById('display-nota').innerText = nota.replace(/[0-9]/g, ''); // Remove o número da oitava pro usuário ver só "E"
    document.getElementById('display-status').innerText = "Toque a corda...";
    document.getElementById('display-status').className = "text-muted";
}

// --- LÓGICA DE ÁUDIO ---

async function iniciarAudio() {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    
    mediaStreamSource = audioContext.createMediaStreamSource(stream);
    analyser = audioContext.createAnalyser();
    analyser.fftSize = 2048;
    mediaStreamSource.connect(analyser);
}

function pararAudio() {
    if (animationFrameId) cancelAnimationFrame(animationFrameId);
    if (mediaStreamSource) {
        mediaStreamSource.mediaStream.getTracks().forEach(t => t.stop());
    }
    if (audioContext) audioContext.close();
}

// Buffer para a autocorrelação
const bufferLength = 2048;
const dataArray = new Float32Array(bufferLength);

function atualizarLoop() {
    if (!isRunning) return;

    analyser.getFloatTimeDomainData(dataArray);
    
    // 1. Detecta a frequência atual tocada
    const frequenciaDetectada = autoCorrelate(dataArray, audioContext.sampleRate);
    
    const displayFreq = document.getElementById('display-freq');
    const bar = document.getElementById('tuner-bar');
    const status = document.getElementById('display-status');

    // Se detectou som e temos uma corda alvo selecionada
    if (frequenciaDetectada !== -1 && cordaAlvo) {
        
        displayFreq.innerText = Math.round(frequenciaDetectada) + " Hz";

        // 2. Calcula a distância em "Cents" (Centésimos de semitom)
        // Fórmula: 1200 * log2(f1 / f2)
        const diferencaCents = 1200 * Math.log2(frequenciaDetectada / cordaAlvo);

        // 3. Atualiza a Barra (Bootstrap Progress)
        // O centro (afinado) é 50%. 
        // Vamos definir que +/- 50 cents enche a barra para um lado ou outro.
        let porcentagem = 50 + diferencaCents; 

        // Limites visuais da barra (0 a 100)
        if (porcentagem < 5) porcentagem = 5;
        if (porcentagem > 95) porcentagem = 95;

        bar.style.width = `${porcentagem}%`;

        // 4. Feedback de Cores e Texto
        if (Math.abs(diferencaCents) < 5) {
            // AFINADO (Margem de 5 cents)
            bar.className = "progress-bar bg-success";
            status.innerText = "PERFEITO!";
            status.className = "text-success fw-bold";
        } else if (diferencaCents < 0) {
            // MUITO BAIXO (Barra na esquerda)
            bar.className = "progress-bar bg-warning"; 
            status.innerText = "Muito Baixo (Aperte)";
            status.className = "text-warning fw-bold";
        } else {
            // MUITO ALTO (Barra na direita)
            bar.className = "progress-bar bg-danger";
            status.innerText = "Muito Alto (Folgue)";
            status.className = "text-danger fw-bold";
        }

    } else {
        // Silêncio
        // Não reseta a barra imediatamente para evitar "flicker", 
        // mas pode colocar um contador para resetar se ficar silêncio por 2s
    }

    animationFrameId = requestAnimationFrame(atualizarLoop);
}

// --- ALGORITMO MATEMÁTICO (Autocorrelação) ---
// (Mantive o mesmo algoritmo robusto de antes)
function autoCorrelate(buf, sampleRate) {
    let SIZE = buf.length;
    let rms = 0;
    for (let i = 0; i < SIZE; i++) { let val = buf[i]; rms += val * val; }
    rms = Math.sqrt(rms / SIZE);
    if (rms < 0.01) return -1; // Muito baixo (ruído)

    let r1 = 0, r2 = SIZE - 1, thres = 0.2;
    for (let i = 0; i < SIZE / 2; i++) if (Math.abs(buf[i]) < thres) { r1 = i; break; }
    for (let i = 1; i < SIZE / 2; i++) if (Math.abs(buf[SIZE - i]) < thres) { r2 = SIZE - i; break; }

    buf = buf.slice(r1, r2);
    SIZE = buf.length;

    let c = new Array(SIZE).fill(0);
    for (let i = 0; i < SIZE; i++)
        for (let j = 0; j < SIZE - i; j++)
            c[i] = c[i] + buf[j] * buf[j + i];

    let d = 0; while (c[d] > c[d + 1]) d++;
    let maxval = -1, maxpos = -1;
    for (let i = d; i < SIZE; i++) {
        if (c[i] > maxval) { maxval = c[i]; maxpos = i; }
    }
    let T0 = maxpos;
    let x1 = c[T0 - 1], x2 = c[T0], x3 = c[T0 + 1];
    let a = (x1 + x3 - 2 * x2) / 2;
    let b = (x3 - x1) / 2;
    if (a) T0 = T0 - b / (2 * a);

    return sampleRate / T0;
}