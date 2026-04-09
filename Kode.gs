/**
 * SIMPAN KODE INI DI GOOGLE APPS SCRIPT (code.gs)
 * -----------------------------------------------
 * 1. Klik "Deploy" > "New Deployment".
 * 2. Pilih type: "Web App".
 * 3. Execute as: "Me".
 * 4. Who has access: "Anyone" (PENTING).
 * 5. Salin URL Web App (akhirannya /exec) untuk dipasang di index.html GitHub.
 */

function doGet(e) {
  // Mengambil data riwayat untuk ditampilkan di web GitHub
  const data = getHistory();
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  // Menerima data transaksi dari web GitHub
  try {
    const params = JSON.parse(e.postData.contents);
    const result = saveToSheet(params.nama, params.tipe);
    
    return ContentService.createTextOutput(JSON.stringify({ status: "success", data: result }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function saveToSheet(nama, tipe) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName("History") || ss.insertSheet("History");
  const date = Utilities.formatDate(new Date(), "GMT+7", "dd-MM-yyyy HH:mm:ss");
  const id = "TRX-" + Math.random().toString(36).substr(2, 6).toUpperCase();
  
  sheet.appendRow([id, nama, date, tipe]);
  return { id, nama, date, tipe };
}

function getHistory() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName("History");
  if (!sheet) return [];
  
  const values = sheet.getDataRange().getValues();
  if (values.length <= 1) return [];
  
  // Ambil 10 data terakhir
  return values.slice(1).reverse().slice(0, 10).map(row => ({
    id: row[0],
    nama: row[1],
    waktu: row[2],
    tipe: row[3]
  }));
}