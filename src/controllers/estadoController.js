const { createCatalogController } = require("./catalogController");
module.exports = createCatalogController({
  table: "params_estados",
  view: "estados",
  listKey: "estados",
  columns: ["text", "uf"],
  searchColumns: ["text", "uf"],
  redirectPath: "/estados",
  mapItem: (raw) => {
    const text = String(raw.text || "").trim();
    const uf = String(raw.uf || "").trim();
    return text || uf ? { id: Number(raw.id) || null, text, uf } : null;
  },
});
