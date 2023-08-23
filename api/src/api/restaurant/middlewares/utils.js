const { google } = require('googleapis');

const createGoogleSheetClient = async ({
  keyFile,
  sheetId,
  tabName,
  range,
}) => {
  async function getGoogleSheetClient() {
    const auth = new google.auth.GoogleAuth({
      keyFile,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
    const authClient = await auth.getClient();
    return google.sheets({
      version: 'v4',
      auth: authClient,
    });
  }

  const googleSheetClient = await getGoogleSheetClient();

  const writeGoogleSheet = async (data) => {
    googleSheetClient.spreadsheets.values.append({
      spreadsheetId: sheetId,
      range: `${tabName}!${range}`,
      valueInputOption: 'USER_ENTERED',
      insertDataOption: 'INSERT_ROWS',
      resource: {
        majorDimension: 'ROWS',
        values: data,
      },
    });
  };

  const updateoogleSheet = async (cell, data) => {
    googleSheetClient.spreadsheets.values.update({
      spreadsheetId: sheetId,
      range: `${tabName}!${cell}`,
      valueInputOption: 'USER_ENTERED',
      resource: {
        majorDimension: 'ROWS',
        values: data,
      },
    });
  };

  const readGoogleSheet = async () => {
    const res = await googleSheetClient.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: `${tabName}!${range}`,
    });

    return res.data.values;
  };

  return {
    writeGoogleSheet,
    updateoogleSheet,
    readGoogleSheet,
  };
};

module.exports = {
  createGoogleSheetClient,
};
