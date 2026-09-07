const { createCatalogController } = require("./catalogController");
module.exports = createCatalogController({
  table: "params_status_documentos",
  view: "statusDocumentos",
  listKey: "statusDocumentos",
  columns: ["text", "cor"],
  searchColumns: ["text"],
  redirectPath: "/statusDocumentos",
  mapItem: (raw) => {
    let text = String(raw.text || "")
      .replace(/^,+|,+$/g, "")
      .trim();
    let cor = String(raw.cor || "")
      .trim()
      .split(",")[0];
    if (!/^#([0-9a-fA-F]{6})$/.test(cor)) cor = "#000000";
    return text ? { id: Number(raw.id) || null, text, cor } : null;
  },
});
