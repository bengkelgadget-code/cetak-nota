/**
 * ZettBOT - Google Sheet Apps Script Assistant
 * Project: TRFBT - Cetak Bukti Transaksi
 */

const SHEET_NAME = 'History';
const TIMEZONE = 'Asia/Jakarta';

function doGet() {
  return HtmlService.createTemplateFromFile('index')
    .evaluate()
    .setTitle('TRFBT - Cetak Bukti')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/**
 * Mendapatkan data riwayat dari Google Sheets
 */
function getHistoryData() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(SHEET_NAME);
    
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
      sheet.appendRow(['ID', 'Nama', 'Waktu', 'Tipe']);
    }
    
    const data = sheet.getDataRange().getValues();
    if (data.length <= 1) return [];
    
    // Ambil data tanpa header, balik urutan (terbaru di atas)
    const rows = data.slice(1).reverse();
    
    return rows.map(row => ({
      id: row[0],
      nama: row[1],
      waktu: row[2],
      tipe: row[3]
    }));
  } catch (error) {
    console.error('Error getHistoryData:', error);
    return [];
  }
}

/**
 * Menyimpan transaksi baru ke riwayat
 */
function saveTransaction(nama, tipe) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(SHEET_NAME);
    const timestamp = Utilities.formatDate(new Date(), TIMEZONE, 'yyyy-MM-dd HH:mm:ss');
    const id = 'TRX-' + Math.random().toString(36).substr(2, 9).toUpperCase();
    
    // Batch processing
    sheet.appendRow([id, nama, timestamp, tipe]);
    
    // Anti-Delay Synchronization
    SpreadsheetApp.flush();
    
    return { success: true, message: 'Transaksi berhasil disimpan' };
  } catch (error) {
    console.error('Error saveTransaction:', error);
    return { success: false, message: error.toString() };
  }
}