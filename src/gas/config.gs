/**
 * ConfigシートからAPI設定情報を読み込む
 * @return {Object} 設定情報の連想配列
 */
function getConfig() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('Config');
  if (!sheet) {
    throw new Error('Configシートが見つかりません。');
  }

  const values = sheet.getDataRange().getValues();
  const config = {};
  
  // 1行目はヘッダーとし、2行目以降のキーと値を読み込む
  for (let i = 1; i < values.length; i++) {
    const key = values[i][0];
    const value = values[i][1];
    if (key) {
      config[key] = value;
    }
  }
  
  return config;
}
