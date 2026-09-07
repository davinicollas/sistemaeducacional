const { createCatalogController } = require("./catalogController");
module.exports = createCatalogController({
  table: "params_tipos_documentos",
  view: "tiposDocumentos",
  listKey: "tiposDocumentos",
  columns: ["text"],
  searchColumns: ["text"],
  redirectPath: "/tiposDocumentos",
  mapItem: (raw) => {
    const text = String(raw.text || "").trim();
    return text ? { id: Number(raw.id) || null, text } : null;
  },
});
