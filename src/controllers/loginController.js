const bcrypt = require("bcrypt");
const Usuario = require("../model/usuario");
const permissaoModel = require("../model/usuarioPermissoes");

function index(req, res) {
  res.render("login");
}
async function login(req, res) {
  const email = String(req.body.email || "").trim();
  const senha = String(req.body.senha || "");
  try {
    const usuario = await Usuario.getUsuario(email);
    if (!usuario || !(await bcrypt.compare(senha, usuario.senha)))
      return res.render("login", { erro: "Email ou senha inválidos." });
    await new Promise((resolve, reject) => {
      req.session.regenerate((error) => (error ? reject(error) : resolve()));
    });
    req.session.usuario = {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      id_tipo_usuario: usuario.id_tipo_usuario
        ? String(usuario.id_tipo_usuario).trim()
        : null,
      id_aluno: usuario.id_aluno || null,
      id_professor: usuario.id_professor || null,
    };
    // Carrega permissões do papel do usuário e armazena na sessão
    try {
      const matrix = await permissaoModel.getMatrix();
      // Prefer mapping by numeric id (1=ADMIN,2=PROFESSOR,3=ALUNO,4=ALL)
      const roleId = usuario.id_tipo_usuario ? Number(usuario.id_tipo_usuario) : null;
      const roleIdMap = {
        1: "Administradores",
        2: "Professores",
        3: "Alunos",
        4: "ALL",
      };
      let roleName = roleIdMap[roleId] || null;
      if (!roleName) {
        try {
          const roles = await permissaoModel.getRoles();
          const found = roles.find((r) => Number(r.id) === roleId || String(r.name).toLowerCase() === String(usuario.id_tipo_usuario).toLowerCase());
          roleName = found ? found.name : null;
        } catch (err) {
          roleName = null;
        }
      }

      function slugRole(s) {
        return String(s || "")
          .normalize("NFD")
          .replace(/\p{Diacritic}/gu, "")
          .replace(/[^a-zA-Z0-9]/g, "")
          .trim()
          .toLowerCase();
      }

      // Mapeamento entre `tipo_usuario` (enum) e nomes de papel no DB
      const roleNameMap = {
        ADMIN: "Administradores",
        PROFESSOR: "Professores",
        ALUNO: "Alunos",
        ALL: "ALL",
      };

      let rolePerms = {};
      const roleNameUpper = roleName
        ? String(roleName).trim().toUpperCase()
        : "";
      if (matrix && roleNameUpper) {
        const mapped = roleNameMap[roleNameUpper] || roleNameUpper;
        if (matrix[mapped]) {
          rolePerms = matrix[mapped];
        } else {
          const target = slugRole(mapped);
          for (const k of Object.keys(matrix)) {
            if (slugRole(k) === target) {
              rolePerms = matrix[k];
              break;
            }
          }
        }
      }

      // Normaliza permissões: cria chaves canônicas além do nome original
      const permissoes = {};

      function slug(s) {
        return String(s || "")
          .normalize("NFD")
          .replace(/\p{Diacritic}/gu, "")
          .replace(/[^a-zA-Z0-9 ]/g, "")
          .trim()
          .toLowerCase();
      }

      function addPerm(key, access) {
        if (!key) return;
        // prefer 'full' | 'view' | 'none'
        const v = access === "view" ? "view" : access ? "full" : "none";
        permissoes[key] = v;
      }

      const mappedForAll = roleNameMap[roleNameUpper] || roleNameUpper || "";
      if (
        String(mappedForAll).toUpperCase() === "ALL" ||
        roleNameUpper === "ALL"
      ) {
        // Atribui todas as permissões como 'full' quando tipo_usuario === 'ALL'
        const allPermRows = await permissaoModel.getPermissions();
        for (const p of allPermRows) {
          addPerm(p.name, true);
        }
      } else {
        for (const [permName, val] of Object.entries(rolePerms)) {
          const access = val === "view" ? "view" : val ? "full" : "none";
          // chave original (nome da permissão no DB)
          if (permName) addPerm(permName, access);

          const s = slug(permName);
          // heurísticas: 'ver alunos', 'criar alunos', 'editar alunos', 'excluir alunos'
          const mVer = s.match(/^ver\s+(.+)$/);
          const mCriar = s.match(/^(criar|adicionar|novo)s?\s+(.+)$/);
          const mEditar = s.match(/^(editar|alterar)\s+(.+)$/);
          const mExcluir = s.match(/^(excluir|remover)\s+(.+)$/);

          if (mVer) {
            const resource = mVer[1].replace(/\s+/g, "_");
            addPerm(`${resource}.visualizar`, access);
            addPerm(`${resource}_visualizar`, access);
            addPerm(`${resource}`, access);
            addPerm(`visualizar.${resource}`, access);
          } else if (mCriar) {
            const resource = (mCriar[2] || mCriar[1]).replace(/\s+/g, "_");
            addPerm(`${resource}.inserir`, access);
            addPerm(`${resource}_inserir`, access);
            addPerm(`${resource}`, access);
            addPerm(`inserir.${resource}`, access);
          } else if (mEditar) {
            const resource = mEditar[2].replace(/\s+/g, "_");
            addPerm(`${resource}.editar`, access);
            addPerm(`${resource}_editar`, access);
            addPerm(`${resource}`, access);
            addPerm(`editar.${resource}`, access);
          } else if (mExcluir) {
            const resource = mExcluir[2].replace(/\s+/g, "_");
            addPerm(`${resource}.excluir`, access);
            addPerm(`${resource}_excluir`, access);
            addPerm(`${resource}`, access);
            addPerm(`excluir.${resource}`, access);
          } else if (s) {
            // fallback: use slug as resource with visualizar
            const resource = s.replace(/\s+/g, "_");
            addPerm(`${resource}.visualizar`, access);
            addPerm(`${resource}`, access);
          }
        }
      }

      req.session.permissoes = permissoes;
    } catch (err) {
      console.error("Erro ao carregar permissões:", err);
      req.session.permissoes = {};
    }
    return res.redirect("/dashboard");
  } catch (error) {
    console.error(error);
    return res.render("login", { erro: "Não foi possível realizar o login." });
  }
}
function logout(req, res) {
  req.session.destroy(() => {
    res.clearCookie(process.env.SESSION_NAME || "sistema_session");
    res.redirect("/login");
  });
}
module.exports = { index, login, logout };
