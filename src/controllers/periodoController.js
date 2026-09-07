const db = require("../../database/mysql");
const periodosModel = require("../model/periodos");
const anosModel = require("../model/anosLetivos");
const { createParamController } = require("./paramCrudController");

module.exports = createParamController({
  model: periodosModel,
  listMethod: "getPeriodos",
  view: "periodos",
  viewKey: "periodos",
  requestKey: "periodos",
  table: "params_periodos",
  redirectPath: "/periodos",
  getExtraData: async () => ({ anos: await anosModel.getAnosLetivos() }),
  columns: [
    "nome",
    "abreviacao",
    "ano_letivo",
    "data_inicio",
    "data_fim",
    "ordem",
    "tipo",
    "status",
    "text",
  ],
  mapItem: (item) => {
    const nome = (item.nome || "").trim();
    return nome
      ? {
          id: item.id || null,
          nome,
          abreviacao: (item.abreviacao || "").trim(),
          anoLetivo: (item.anoLetivo || "").trim(),
          dataInicio: (item.dataInicio || "").trim(),
          dataFim: (item.dataFim || "").trim(),
          ordem: item.ordem ? Number(item.ordem) : null,
          tipo: (item.tipo || "").trim(),
          status: item.status === "0" ? 0 : 1,
          text: (item.text || "").trim(),
        }
      : null;
  },
  buildParams: (item) => [
    item.nome,
    item.abreviacao,
    item.anoLetivo,
    item.dataInicio,
    item.dataFim,
    item.ordem,
    item.tipo,
    item.status,
    item.text,
  ],
});
