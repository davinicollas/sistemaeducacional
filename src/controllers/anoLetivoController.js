const anosModel = require("../model/anosLetivos");
const { createParamController } = require("./paramCrudController");

module.exports = createParamController({
  model: anosModel,
  listMethod: "getAnosLetivos",
  view: "anosLetivos",
  viewKey: "anos",
  requestKey: "anos",
  table: "params_anos_letivos",
  redirectPath: "/anos-letivos",
  columns: ["ano_letivo", "data_inicio", "data_fim", "status", "atual", "text"],
  mapItem: (item) => {
    const anoLetivo = (item.anoLetivo || "").trim();
    return anoLetivo
      ? {
          id: item.id || null,
          anoLetivo,
          dataInicio: (item.dataInicio || "").trim(),
          dataFim: (item.dataFim || "").trim(),
          status: item.status === "0" ? 0 : 1,
          atual: item.atual === "1" ? 1 : 0,
          text: (item.text || "").trim(),
        }
      : null;
  },
  buildParams: (item) => [
    item.anoLetivo,
    item.dataInicio,
    item.dataFim,
    item.status,
    item.atual,
    item.text,
  ],
});
