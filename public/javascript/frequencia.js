document.addEventListener("DOMContentLoaded", function () {
  "use strict";

  const STATUS_LABELS = {
    presente: "Presente",
    falta: "Falta",
    falta_justificada: "Falta Justificada",
  };
  const STATUS_LIST = Array.isArray(window.FREQUENCIA_STATUS) && window.FREQUENCIA_STATUS.length
    ? window.FREQUENCIA_STATUS
    : Object.keys(STATUS_LABELS);

  const selAnoLetivo = document.getElementById("filtro-ano-letivo");
  const selTurma = document.getElementById("filtro-turma");
  const selDisciplina = document.getElementById("filtro-disciplina");
  const inputData = document.getElementById("filtro-data");
  const tbody = document.getElementById("frequencia-tbody");
  const btnSalvar = document.getElementById("btn-salvar-frequencia");
  const alerta = document.getElementById("frequencia-alerta");

  const modalMotivoEl = document.getElementById("modalMotivoAlteracao");
  const modalMotivo = window.bootstrap ? new window.bootstrap.Modal(modalMotivoEl) : null;
  const textareaMotivo = document.getElementById("motivo-alteracao");
  const btnConfirmarMotivo = document.getElementById("btn-confirmar-motivo");

  const modalHistoricoEl = document.getElementById("modalHistoricoFrequencia");
  const modalHistorico = window.bootstrap ? new window.bootstrap.Modal(modalHistoricoEl) : null;
  const historicoConteudo = document.getElementById("historico-frequencia-conteudo");

  let pendingChange = null;

  function mostrarAlerta(mensagem, tipo) {
    alerta.textContent = mensagem;
    alerta.className = `alert alert-${tipo || "info"}`;
  }

  function limparAlerta() {
    alerta.textContent = "";
    alerta.className = "alert d-none";
  }

  function optionsStatus(selecionado) {
    return STATUS_LIST.map(
      (valor) =>
        `<option value="${valor}" ${valor === selecionado ? "selected" : ""}>${STATUS_LABELS[valor] || valor}</option>`,
    ).join("");
  }

  function renderLinhas(alunos) {
    if (!alunos.length) {
      tbody.innerHTML =
        '<tr id="frequencia-vazio"><td colspan="4" class="text-center text-muted py-4">Nenhum aluno vinculado a esta turma.</td></tr>';
      btnSalvar.disabled = true;
      return;
    }

    tbody.innerHTML = alunos
      .map((aluno) => {
        const idFrequencia = aluno.id_frequencia || "";
        return `
        <tr data-id-aluno="${aluno.id_aluno}" data-id-frequencia="${idFrequencia}" data-status-original="${aluno.status}">
          <td>${escapeHtml(aluno.nome)}<small class="d-block text-muted">${escapeHtml(aluno.matricula || "Sem matrícula")}</small></td>
          <td>
            <select class="form-select form-select-sm frequencia-status-select status-${aluno.status}" data-campo="status">
              ${optionsStatus(aluno.status)}
            </select>
          </td>
          <td><input type="text" class="form-control form-control-sm" data-campo="observacao" maxlength="500" value="${escapeAttr(aluno.observacao || "")}"></td>
          <td>
            ${idFrequencia ? '<button type="button" class="btn btn-sm btn-outline-secondary btn-ver-historico" title="Ver histórico" aria-label="Ver histórico"><i class="bi bi-clock-history"></i></button>' : ""}
          </td>
        </tr>`;
      })
      .join("");

    btnSalvar.disabled = false;
    atualizarResumo();
  }

  function escapeHtml(texto) {
    const div = document.createElement("div");
    div.textContent = texto == null ? "" : String(texto);
    return div.innerHTML;
  }

  function escapeAttr(texto) {
    return escapeHtml(texto).replace(/"/g, "&quot;");
  }

  function atualizarResumo() {
    const linhas = Array.from(tbody.querySelectorAll("tr[data-id-aluno]"));
    const total = linhas.length;
    let presentes = 0;
    let faltas = 0;
    let justificadas = 0;
    linhas.forEach((linha) => {
      const status = linha.querySelector('[data-campo="status"]').value;
      if (status === "presente") presentes += 1;
      else if (status === "falta") faltas += 1;
      else if (status === "falta_justificada") justificadas += 1;
    });
    const percentual = total ? Math.round((presentes / total) * 100) : 0;
    document.getElementById("resumo-total").textContent = total;
    document.getElementById("resumo-presentes").textContent = presentes;
    document.getElementById("resumo-faltas").textContent = faltas;
    document.getElementById("resumo-justificadas").textContent = justificadas;
    document.getElementById("resumo-percentual").textContent = `${percentual}%`;
  }

  async function carregarTurmas() {
    selTurma.innerHTML = '<option value="">Carregando...</option>';
    selTurma.disabled = true;
    if (!selAnoLetivo.value) {
      selTurma.innerHTML = '<option value="">Selecione o ano letivo</option>';
      return;
    }
    try {
      const resposta = await fetch(`/frequencia/turmas?id_ano_letivo=${encodeURIComponent(selAnoLetivo.value)}`);
      const dados = await resposta.json();
      const turmas = dados.turmas || [];
      selTurma.innerHTML =
        '<option value="">Selecione</option>' +
        turmas.map((turma) => `<option value="${turma.id}">${escapeHtml(turma.text)}</option>`).join("");
      selTurma.disabled = false;
    } catch (error) {
      selTurma.innerHTML = '<option value="">Erro ao carregar turmas</option>';
    }
  }

  async function carregarFrequencia() {
    limparAlerta();
    if (!selTurma.value || !inputData.value) {
      tbody.innerHTML =
        '<tr id="frequencia-vazio"><td colspan="4" class="text-center text-muted py-4">Selecione a turma, a disciplina e a data para carregar os alunos.</td></tr>';
      btnSalvar.disabled = true;
      atualizarResumo();
      return;
    }
    const parametros = new URLSearchParams({
      id_turma: selTurma.value,
      data: inputData.value,
    });
    if (selDisciplina.value) parametros.set("id_disciplina", selDisciplina.value);

    tbody.innerHTML =
      '<tr><td colspan="4" class="text-center text-muted py-4">Carregando alunos...</td></tr>';
    try {
      const resposta = await fetch(`/frequencia/registro?${parametros.toString()}`);
      const dados = await resposta.json();
      if (!dados.sucesso) {
        mostrarAlerta(dados.mensagem || "Erro ao carregar frequência.", "danger");
        tbody.innerHTML = '<tr><td colspan="4" class="text-center text-muted py-4">-</td></tr>';
        return;
      }
      renderLinhas(dados.alunos || []);
    } catch (error) {
      mostrarAlerta("Erro ao carregar frequência.", "danger");
    }
  }

  function abrirModalMotivo(select, statusAnterior, statusNovo) {
    pendingChange = { select, statusAnterior, statusNovo };
    textareaMotivo.value = "";
    btnConfirmarMotivo.disabled = true;
    select.dataset.motivo = "";
    if (modalMotivo) modalMotivo.show();
  }

  function onStatusChange(event) {
    const select = event.target;
    const linha = select.closest("tr");
    const statusOriginal = linha.dataset.statusOriginal;
    const idFrequencia = linha.dataset.idFrequencia;
    const novoStatus = select.value;

    select.className = `form-select form-select-sm frequencia-status-select status-${novoStatus}`;

    if (idFrequencia && novoStatus !== statusOriginal) {
      abrirModalMotivo(select, statusOriginal, novoStatus);
    } else {
      select.dataset.motivo = "";
    }
    atualizarResumo();
  }

  textareaMotivo?.addEventListener("input", () => {
    btnConfirmarMotivo.disabled = !textareaMotivo.value.trim();
  });

  btnConfirmarMotivo?.addEventListener("click", () => {
    if (!pendingChange) return;
    pendingChange.select.dataset.motivo = textareaMotivo.value.trim();
    pendingChange = null;
    if (modalMotivo) modalMotivo.hide();
  });

  modalMotivoEl?.addEventListener("hidden.bs.modal", () => {
    if (pendingChange) {
      pendingChange.select.value = pendingChange.statusAnterior;
      pendingChange.select.className = `form-select form-select-sm frequencia-status-select status-${pendingChange.statusAnterior}`;
      pendingChange = null;
      atualizarResumo();
    }
  });

  async function verHistorico(idFrequencia) {
    historicoConteudo.innerHTML = '<p class="text-muted mb-0">Carregando...</p>';
    if (modalHistorico) modalHistorico.show();
    try {
      const resposta = await fetch(`/frequencia/${idFrequencia}/historico`);
      const dados = await resposta.json();
      const historico = dados.historico || [];
      if (!historico.length) {
        historicoConteudo.innerHTML = '<p class="text-muted mb-0">Nenhuma alteração registrada.</p>';
        return;
      }
      historicoConteudo.innerHTML = historico
        .map((item) => {
          const data = new Date(item.criado_em).toLocaleString("pt-BR");
          return `
          <div class="border-bottom pb-2 mb-2">
            <small class="text-muted d-block">${data}</small>
            <strong>${STATUS_LABELS[item.status_anterior] || item.status_anterior} → ${STATUS_LABELS[item.status_novo] || item.status_novo}</strong>
            <p class="mb-1">Motivo: ${escapeHtml(item.motivo)}</p>
            <small class="text-muted">Alterado por: ${escapeHtml(item.usuario_nome || "Usuário do sistema")}</small>
          </div>`;
        })
        .join("");
    } catch (error) {
      historicoConteudo.innerHTML = '<p class="text-danger mb-0">Erro ao carregar histórico.</p>';
    }
  }

  tbody.addEventListener("change", (event) => {
    if (event.target.matches('[data-campo="status"]')) onStatusChange(event);
  });

  tbody.addEventListener("click", (event) => {
    const botao = event.target.closest(".btn-ver-historico");
    if (!botao) return;
    const linha = botao.closest("tr");
    verHistorico(linha.dataset.idFrequencia);
  });

  selAnoLetivo?.addEventListener("change", () => {
    carregarTurmas();
    tbody.innerHTML =
      '<tr id="frequencia-vazio"><td colspan="4" class="text-center text-muted py-4">Selecione a turma, a disciplina e a data para carregar os alunos.</td></tr>';
    btnSalvar.disabled = true;
    atualizarResumo();
  });
  selTurma?.addEventListener("change", carregarFrequencia);
  selDisciplina?.addEventListener("change", carregarFrequencia);
  inputData?.addEventListener("change", carregarFrequencia);

  btnSalvar?.addEventListener("click", async () => {
    limparAlerta();
    const linhas = Array.from(tbody.querySelectorAll("tr[data-id-aluno]"));
    const registros = linhas.map((linha) => ({
      id_aluno: linha.dataset.idAluno,
      status: linha.querySelector('[data-campo="status"]').value,
      observacao: linha.querySelector('[data-campo="observacao"]').value,
      motivo: linha.querySelector('[data-campo="status"]').dataset.motivo || "",
    }));

    if (!registros.length) return;

    btnSalvar.disabled = true;
    try {
      const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content || "";
      const resposta = await fetch("/frequencia", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-csrf-token": csrfToken },
        body: JSON.stringify({
          id_turma: selTurma.value,
          id_disciplina: selDisciplina.value || null,
          data: inputData.value,
          registros,
        }),
      });
      const dados = await resposta.json();
      if (!dados.sucesso) {
        mostrarAlerta(dados.mensagem || "Erro ao salvar frequência.", "danger");
        return;
      }
      mostrarAlerta("✓ Frequência salva com sucesso.", "success");
      carregarFrequencia();
    } catch (error) {
      mostrarAlerta("Erro ao salvar frequência.", "danger");
    } finally {
      btnSalvar.disabled = false;
    }
  });
});
