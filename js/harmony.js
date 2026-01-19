window.gerarCampoHarmonico = function () {
    const tonica = document.getElementById('tonica').value;
    const tabela = document.getElementById('tabela');
    const acordes = document.getElementById('acordes');

    if (!tonica) return;

    // OBTER DADOS
    let major = Tonal.Key.majorKey(tonica);
    let minor = Tonal.Key.minorKey(tonica);

    let html = "";

    for (let i = 0; i < 7; i++) {
        let acordeMelodica = formatarAcorde(minor.melodic.chords[i]);
        if (i === 6) {
            acordeMelodica = acordeMelodica.replace('m7(b5)', '7alt');
        }
        html += `
            <tr>
                <td class="bg-body-tertiary small" style="width: 5%;">${major.grades[i]}</td>
                <td class="text-primary fw-bold small">${formatarAcorde(major.chords[i])}</td>
                <td class="text-info fw-bold small">${formatarAcorde(minor.natural.chords[i])}</td>
                <td class="text-warning fw-bold small">${formatarAcorde(minor.harmonic.chords[i])}</td>
                <td class="text-danger fw-bold small">${acordeMelodica}</td>
            </tr>
        `;
    }

    acordes.innerHTML = html;

    tabela.classList.remove('d-none');
};

function copiarCampoHarmonico() {
    const mensagem = `Campo harmônico`;

    navigator.clipboard.writeText(mensagem).then(() => {
        alert(`Copiado para a área de transferência`);
    }).catch(err => {
        console.error('Erro ao copiar: ', err);
    });
}

function formatarAcorde(nomeAcorde) {
    if (!nomeAcorde) return "";

    return nomeAcorde
        .replace('maj7', 'M7')
        .replace('mMaj7', 'mM7')
        .replace('m6', 'mM7')
        .replace('+M7', 'M7(#5)')
        .replace('m7b5', 'm7(b5)')
        .replace('o7', 'º7');
}

gerarCampoHarmonico()