const salasModel = require("../model/salas");
const { createParamController } = require("./paramCrudController");

module.exports = createParamController({
  model: salasModel,
  listMethod: "getSalas",
  view: "salas",
  viewKey: "salas",
  requestKey: "salas",
  table: "params_salas",
  redirectPath: "/salas",
  columns: [
    "nome",
    "codigo",
    "tipo",
    "capacidade",
    "bloco",
    "andar",
    "recursos",
    "status",
    "text",
  ],
  mapItem: (item) => {
    const nome = (item.nome || "").trim();
    return nome
      ? {
          id: item.id || null,
          nome,
          codigo: (item.codigo || "").trim(),
          tipo: (item.tipo || "").trim(),
          capacidade: item.capacidade ? Number(item.capacidade) : null,
          bloco: (item.bloco || "").trim(),
          andar: (item.andar || "").trim(),
          recursos: (item.recursos || "").trim(),
          status: item.status === "0" ? 0 : 1,
          text: (item.text || "").trim(),
        }
      : null;
  },
  buildParams: (item) => [
    item.nome,
    item.codigo,
    item.tipo,
    item.capacidade,
    item.bloco,
    item.andar,
    item.recursos,
    item.status,
    item.text,
  ],
});
