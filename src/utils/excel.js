const ExcelJS = require('exceljs');
const multer = require('multer');

async function exportarExcel({
    res,
    nomeArquivo,
    nomePlanilha = 'Dados',
    colunas,
    dados
}) {
    const workbook = new ExcelJS.Workbook();

    const worksheet = workbook.addWorksheet(nomePlanilha);

    worksheet.columns = colunas;

    dados.forEach((item) => {
        worksheet.addRow(item);
    });

    // Cabeçalho
    worksheet.getRow(1).font = {
        bold: true
    };

    worksheet.getRow(1).alignment = {
        vertical: 'middle'
    };

    // Ajusta largura das colunas
    worksheet.columns.forEach((column) => {
        let maxLength = column.header?.length || 10;

        column.eachCell({ includeEmpty: true }, (cell) => {
            const valor = cell.value ? String(cell.value) : '';

            if (valor.length > maxLength) {
                maxLength = valor.length;
            }
        });

        column.width = Math.min(maxLength + 2, 50);
    });

    res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );

    res.setHeader(
        'Content-Disposition',
        `attachment; filename="${nomeArquivo}.xlsx"`
    );

    await workbook.xlsx.write(res);

    res.end();
}


const upload = multer({
    storage: multer.memoryStorage(), limits: {
        fileSize: 10 * 1024 * 1024 // 10 MB 
    }, fileFilter: (req, file, cb) => {
        const extensoesPermitidas = ["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/vnd.ms-excel"];
        if (extensoesPermitidas.includes(file.mimetype)) { cb(null, true); } else { cb(new Error("Arquivo inválido. Envie um arquivo Excel.")); }
    }
});
module.exports = {
    exportarExcel,
    upload
};