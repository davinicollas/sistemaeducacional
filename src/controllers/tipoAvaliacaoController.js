const tiposModel = require("../model/tiposAvaliacao");
const { createParamController } = require("./paramCrudController");

module.exports = createParamController({
  model: tiposModel,
  listMethod: "getTiposAvaliacao",
  view: "tiposAvaliacao",
  viewKey: "tipos",
  requestKey: "tipos",
  table: "params_tipos_avaliacao",
  redirectPath: "/tipos-avaliacao",
  columns: ["nome", "sigla", "nota_maxima", "status", "text"],
  mapItem: (item) => {
    const nome = (item.nome || "").trim();
    return nome
      ? {
          id: item.id || null,
          nome,
          sigla: (item.sigla || "").trim(),
          notaMaxima: item.notaMaxima ? Number(item.notaMaxima) : null,
          status: item.status === "0" ? 0 : 1,
          text: (item.text || "").trim(),
        }
      : null;
  },
  buildParams: (item) => [
    item.nome,
    item.sigla,
    item.notaMaxima,
    item.status,
    item.text,
  ],
});
