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
        html += `
            <tr>
                <td class="bg-body-tertiary small" style="width: 10%;">${major.grades[i]}</td>
                <td class="text-primary fw-bold">${formatarAcorde(major.chords[i])}</td>
                <td class="text-info fw-bold">${formatarAcorde(minor.natural.chords[i])}</td>
                <td class="text-warning fw-bold">${formatarAcorde(minor.harmonic.chords[i])}</td>
                <td class="text-danger fw-bold">${formatarAcorde(minor.melodic.chords[i])}</td>
            </tr>
        `;
    }

    acordes.innerHTML = html;

    tabela.classList.remove('d-none');
};

function formatarAcorde(nomeAcorde) {
    if (!nomeAcorde) return "";
    
    return nomeAcorde
        .replace('maj7', 'M7')
        .replace('mMaj7', 'mM7')
        .replace('+M7', 'M7(#5)')
        .replace('m7b5', 'm7(b5)')
        .replace('o7', 'º7');
}

gerarCampoHarmonico()