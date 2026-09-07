const turnosModel = require("../model/turnos");
const { createParamController } = require("./paramCrudController");

module.exports = createParamController({
  model: turnosModel,
  listMethod: "getTurnos",
  view: "turnos",
  viewKey: "turnos",
  requestKey: "turnos",
  table: "params_turnos",
  redirectPath: "/turnos",
  columns: [
    "nome",
    "sigla",
    "horario_inicio",
    "horario_final",
    "status",
    "text",
  ],
  mapItem: (item) => {
    const nome = (item.nome || "").trim();
    return nome
      ? {
          id: item.id || null,
          nome,
          sigla: (item.sigla || "").trim(),
          horarioInicio: (item.horarioInicio || "").trim(),
          horarioFinal: (item.horarioFinal || "").trim(),
          status: item.status === "0" ? 0 : 1,
          text: (item.text || "").trim(),
        }
      : null;
  },
  buildParams: (item) => [
    item.nome,
    item.sigla,
    item.horarioInicio,
    item.horarioFinal,
    item.status,
    item.text,
  ],
});
