function checkAccessLevel(value, requiredAction) {
  if (!value) return false;
  if (requiredAction === "visualizar")
    return value === "view" || value === "full";
  // inserir, editar, excluir require full
  return value === "full";
}

function buildCandidates(resource, action) {
  const r = resource || "";
  const a = action || "";
  return [
    `${r}.${a}`,
    `${r}_${a}`,
    `${a}.${r}`,
    `${a}_${r}`,
    `${r} ${a}`,
    `${a} ${r}`,
    a,
    r,
  ];
}

function requirePermission(resource, action) {
  return (req, res, next) => {
    if (!req.session || !req.session.usuario) {
      return res.redirect("/login");
    }

    if (Number(req.session.usuario.id_tipo_usuario) === 1) {
      return next();
    }

    const permissoes = req.session.permissoes || {};
    const candidates = buildCandidates(resource, action);

    for (const cand of candidates) {
      if (!cand) continue;
      const val = permissoes[cand];
      if (val && checkAccessLevel(val, action)) return next();
    }

    // Sem permissão: responder 403
    // Sem permissão: para requisições AJAX/JSON retorna 403 JSON,
    // para requisições HTML redireciona para a página de acesso negado.
    if (
      req.xhr ||
      (req.headers.accept && req.headers.accept.indexOf("json") !== -1)
    ) {
      return res.status(403).json({ erro: "Acesso negado" });
    }
    return res.redirect("/acesso-negado");
  };
}

module.exports = requirePermission;
