let dias;
let ano;
let mes;

// Eventos carregados do servidor para o mês/ano selecionados
const eventos = Array.isArray(window.calendarioEventos)
    ? window.calendarioEventos
    : [];

// Datas vêm do servidor em ISO UTC; usar os componentes UTC evita que o fuso
// horário do navegador desloque o dia (ex: meia-noite UTC virando o dia anterior).
function paraDataLocalSemHora(str) {
    const d = new Date(str);
    return new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()).getTime();
}

function eventosDoDia(anoSelecionado, mesSelecionado, dia) {
    const dataAlvo = new Date(anoSelecionado, mesSelecionado, dia).getTime();

    return eventos.filter(ev => {
        const inicio = paraDataLocalSemHora(ev.data_inicio);
        const fim = ev.data_fim ? paraDataLocalSemHora(ev.data_fim) : inicio;
        return dataAlvo >= inicio && dataAlvo <= fim;
    });
}

function excluirEvento(id) {
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = `/calendario/excluir/${id}`;
    document.body.appendChild(form);
    form.submit();
}

function formatarData(str) {
    if (!str) return '-';
    const d = new Date(str);
    return new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()).toLocaleDateString('pt-BR');
}

function abrirDetalhesEvento(id) {
    const ev = eventos.find(e => e.id === id);
    if (!ev) return;

    document.getElementById('detalhes-titulo').textContent = ev.titulo;

    const tipoEl = document.getElementById('detalhes-tipo');
    tipoEl.textContent = ev.tipo;
    tipoEl.className = `evento evento-${ev.tipo}`;

    document.getElementById('detalhes-data-inicio').textContent = formatarData(ev.data_inicio);
    document.getElementById('detalhes-data-fim').textContent = formatarData(ev.data_fim);
    document.getElementById('detalhes-descricao').textContent = ev.descricao || '-';

    document.getElementById('detalhes-excluir').onclick = () => excluirEvento(ev.id);

    document.getElementById('modal-detalhes').classList.add('ativo');
}

function fecharDetalhesModal() {
    document.getElementById('modal-detalhes').classList.remove('ativo');
}

function gerarCalendario() {

    dias.innerHTML = '';

    const anoSelecionado = parseInt(ano.value);
    const mesSelecionado = parseInt(mes.value);

    const primeiroDia = new Date(
        anoSelecionado,
        mesSelecionado,
        1
    ).getDay();

    const quantidadeDias = new Date(
        anoSelecionado,
        mesSelecionado + 1,
        0
    ).getDate();

    // Espaços antes do primeiro dia
    for (let i = 0; i < primeiroDia; i++) {

        const vazio = document.createElement('div');

        vazio.classList.add('dia', 'vazio');

        dias.appendChild(vazio);
    }

    // Dias do mês
    for (let dia = 1; dia <= quantidadeDias; dia++) {

        const elemento = document.createElement('div');

        elemento.classList.add('dia');

        const eventosDia = eventosDoDia(anoSelecionado, mesSelecionado, dia);
        const eventosHtml = eventosDia.map(ev => {
            const eventoEl = document.createElement('div');
            eventoEl.className = `evento evento-${ev.tipo}`;
            eventoEl.title = ev.descricao || ev.titulo || '';
            eventoEl.onclick = () => abrirDetalhesEvento(ev.id);

            const tituloEl = document.createElement('span');
            tituloEl.textContent = ev.titulo || 'Evento sem título';
            eventoEl.appendChild(tituloEl);

            const excluirEl = document.createElement('button');
            excluirEl.type = 'button';
            excluirEl.setAttribute('aria-label', `Excluir ${ev.titulo || 'evento'}`);
            excluirEl.textContent = '×';
            excluirEl.onclick = event => {
                event.stopPropagation();
                excluirEvento(ev.id);
            };
            eventoEl.appendChild(excluirEl);

            return eventoEl;
        });

        const numeroEl = document.createElement('span');
        numeroEl.className = 'numero';
        numeroEl.textContent = dia;
        elemento.appendChild(numeroEl);
        eventosHtml.forEach(eventoEl => elemento.appendChild(eventoEl));

        dias.appendChild(elemento);
    }
}

function inicializarCalendario() {
    dias = document.getElementById('dias');
    ano = document.getElementById('ano');
    mes = document.getElementById('mes');

    if (!dias || !ano || !mes) return;

    ano.addEventListener('change', () => {
        window.location.href = `/calendario?ano=${ano.value}&mes=${mes.value}`;
    });
    mes.addEventListener('change', () => {
        window.location.href = `/calendario?ano=${ano.value}&mes=${mes.value}`;
    });

    gerarCalendario();
}

function abrirModal() {

    document.getElementById('modal')
        .classList.add('ativo');

}

function fecharModal() {

    document.getElementById('modal')
        .classList.remove('ativo');

}

document.addEventListener('DOMContentLoaded', inicializarCalendario);