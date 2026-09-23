(function () {
  // notas.js - manages UI interactions for /notas
  const selAnoLetivo = document.getElementById("filtro-ano-letivo");
  const selTurma = document.getElementById("filtro-turma");
  const selDisciplina = document.getElementById("filtro-disciplina");
  const selPeriodo = document.getElementById("filtro-periodo");
  const tbody = document.getElementById("notas-tbody");
  const thead = document.getElementById("notas-head");
  const btnSalvar = document.getElementById("btn-salvar-notas");
  const alerta = document.getElementById("notas-alerta");

  function mostrarAlerta(msg, tipo = "info") {
    alerta.className = `alert alert-${tipo}`;
    alerta.textContent = msg;
    alerta.classList.remove("d-none");
    setTimeout(() => alerta.classList.add("d-none"), 5000);
  }

  async function carregarFiltros() {
    if (!selAnoLetivo.value) return;
    selTurma.disabled = true;
    selTurma.innerHTML = '<option>Carregando...</option>';
    try {
      const res = await fetch(`/notas/dados?id_ano_letivo=${encodeURIComponent(selAnoLetivo.value)}`);
      const dados = await res.json();
      if (!dados.sucesso) return mostrarAlerta(dados.mensagem || 'Erro', 'danger');
      selTurma.innerHTML = '<option value="">Selecione</option>' + (dados.turmas || []).map(t => `<option value="${t.id}">${t.text}</option>`).join('');
      selDisciplina.innerHTML = '<option value="">Geral / Não se aplica</option>' + (dados.disciplinas || []).map(d => `<option value="${d.id}">${d.text}</option>`).join('');
      selTurma.disabled = false;
    } catch (err) {
      console.error(err);
      mostrarAlerta('Erro ao carregar filtros.', 'danger');
    }
  }

  async function carregarAlunos() {
    const idTurma = selTurma.value;
    const idDisciplina = selDisciplina.value || null;
    const idPeriodo = selPeriodo.value;
    if (!idTurma || !idPeriodo) {
      tbody.innerHTML = '<tr id="notas-vazio"><td colspan="6" class="text-center text-muted py-4">Selecione a turma e o período para carregar os alunos.</td></tr>';
      return;
    }

    try {
      const params = new URLSearchParams();
      params.set('id_turma', idTurma);
      if (idDisciplina) params.set('id_disciplina', idDisciplina);
      if (idPeriodo) params.set('id_periodo', idPeriodo);
      const res = await fetch(`/notas/registro?${params.toString()}`);
      const dados = await res.json();
      if (!dados.sucesso) return mostrarAlerta(dados.mensagem || 'Erro', 'danger');
      const alunos = dados.alunos || [];

      // load tipos avaliacao for header
      const tipos = window.NOTAS_TIPOS_AVALIACAO || [];
      // rebuild header
      let headHtml = '<th>Aluno</th>' + tipos.map(t=>`<th>${t.nome}</th>`).join('') + '<th>Média</th><th>Situação</th><th></th>';
      thead.innerHTML = headHtml;

      if (!alunos.length) {
        tbody.innerHTML = '<tr id="notas-vazio"><td colspan="6" class="text-center text-muted py-4">Nenhum aluno vinculado a esta turma.</td></tr>';
        return;
      }

      const usuario = window.NOTAS_USUARIO || {};
      const isAluno = !!usuario.id_aluno;

      tbody.innerHTML = alunos
        .map((aluno) => {
          const nome = aluno.nome_social || aluno.nome;
          const notasMapa = aluno.notas || {};

          const inputs = tipos
            .map((t) => {
              const valorExistente = notasMapa[t.id] ? notasMapa[t.id].valor : "";
              const inputAttrs = isAluno ? "readonly" : "";
              return `<td><input value="${valorExistente !== null ? valorExistente : ""}" class="form-control form-control-sm nota-campo" data-tipo="${t.id}" data-id-aluno="${aluno.id}" ${inputAttrs} /></td>`;
            })
            .join("");

          const btnHistorico = `<button class="btn btn-sm btn-outline-secondary btn-historico" data-id-aluno="${aluno.id}" title="Ver histórico"><i class="bi bi-clock-history"></i></button>`;

          return `<tr data-id-aluno="${aluno.id}"><td>${nome}</td>${inputs}<td class="nota-media">-</td><td class="nota-situacao">-</td><td>${btnHistorico}</td></tr>`;
        })
        .join("");

      // Only enable save for non-students with permission
      btnSalvar.disabled = !!(window.NOTAS_USUARIO && window.NOTAS_USUARIO.id_aluno);
    } catch (err) {
      console.error(err);
      mostrarAlerta('Erro ao carregar alunos.', 'danger');
    }
  }

  selAnoLetivo?.addEventListener('change', carregarFiltros);
  selTurma?.addEventListener('change', carregarAlunos);
  selDisciplina?.addEventListener('change', carregarAlunos);
  selPeriodo?.addEventListener('change', carregarAlunos);

  btnSalvar?.addEventListener('click', async () => {
    const registros = Array.from(document.querySelectorAll('.nota-campo')).map(input => ({ id_aluno: input.dataset.idAluno, id_tipo_avaliacao: input.dataset.tipo, valor: input.value }));
    const payload = { id_turma: selTurma.value, id_disciplina: selDisciplina.value || null, id_periodo: selPeriodo.value, registros };
    try {
      const res = await fetch('/notas', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const data = await res.json();
      if (!data.sucesso) return mostrarAlerta(data.mensagem || 'Erro ao salvar notas', 'danger');
      mostrarAlerta('Notas salvas com sucesso.', 'success');
    } catch (err) {
      console.error(err);
      mostrarAlerta('Erro ao salvar notas.', 'danger');
    }
  });

  document.addEventListener('click', (e)=>{
    const btn = e.target.closest('.btn-historico');
    if (!btn) return;
    const idAluno = btn.dataset.idAluno;
    // abrir modal de histórico -- simplificado
    alert('Histórico de notas do aluno: ' + idAluno);
  });

})();
