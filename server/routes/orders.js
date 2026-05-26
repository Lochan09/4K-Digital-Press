import { Router } from 'express';
import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';
import upload from '../middleware/upload.js';

const router = Router();

// ── Google auth (service account) ────────────────────────
function getAuth() {
  const keyPath = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
  if (!keyPath || !fs.existsSync(keyPath)) return null;

  const key = JSON.parse(fs.readFileSync(keyPath, 'utf8'));
  return new google.auth.GoogleAuth({
    credentials: key,
    scopes: [
      'https://www.googleapis.com/auth/drive',
      'https://www.googleapis.com/auth/spreadsheets',
    ],
  });
}

// ── Upload a file buffer to a Drive folder ────────────────
async function uploadFileToDrive(drive, folderId, filePath, filename, mimetype) {
  const res = await drive.files.create({
    requestBody: { name: filename, parents: [folderId] },
    media: { mimeType: mimetype || 'application/octet-stream', body: fs.createReadStream(filePath) },
    fields: 'id, name',
  });
  return res.data;
}

// ── Append a row to the Google Sheet ─────────────────────
async function appendToSheet(sheets, spreadsheetId, rowData) {
  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: 'Sheet1!A1',
    valueInputOption: 'USER_ENTERED',
    insertDataOption: 'INSERT_ROWS',
    requestBody: { values: [rowData] },
  });
}

// ── Ensure header row exists ──────────────────────────────
async function ensureHeader(sheets, spreadsheetId) {
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: 'Sheet1!A1:Z1',
  });
  const firstRow = res.data.values?.[0] ?? [];
  if (firstRow[0] !== 'Order ID') {
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: 'Sheet1!A1',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [[
          'Order ID', 'Timestamp', 'Name', 'Phone', 'Email',
          'Product Category', 'Album Size', 'Occasion',
          'Design Code', 'Names / Custom Text', 'Additional Notes',
          'Photos Drive Folder',
        ]],
      },
    });
  }
}

// ── In-memory fallback ────────────────────────────────────
let localOrders = [];

router.post('/', upload.array('photos', 12), async (req, res) => {
  const data = req.body;
  const files = req.files || [];
  const orderId = Date.now();
  const timestamp = new Date().toISOString();

  // Always store locally
  const order = { id: orderId, data, files: files.map(f => f.path), createdAt: timestamp };
  localOrders.push(order);

  // Try Google Drive / Sheets
  const auth = getAuth();
  const driveFolderId = process.env.GOOGLE_DRIVE_FOLDER_ID;
  const sheetId = process.env.GOOGLE_SHEET_ID;

  let photosFolderLink = '';

  if (auth && driveFolderId) {
    try {
      const authClient = await auth.getClient();
      const drive = google.drive({ version: 'v3', auth: authClient });
      const sheets = google.sheets({ version: 'v4', auth: authClient });

      // Create a sub-folder named after the customer + order ID
      const customerName = data['Your Name'] || 'Unknown';
      const folderRes = await drive.files.create({
        requestBody: {
          name: `Order-${orderId} — ${customerName}`,
          mimeType: 'application/vnd.google-apps.folder',
          parents: [driveFolderId],
        },
        fields: 'id, webViewLink',
      });
      const subFolderId = folderRes.data.id;
      photosFolderLink = folderRes.data.webViewLink || '';

      // Upload each photo into the sub-folder
      for (const file of files) {
        await uploadFileToDrive(
          drive,
          subFolderId,
          file.path,
          file.originalname,
          file.mimetype,
        );
      }

      // Append to Google Sheet
      if (sheetId) {
        await ensureHeader(sheets, sheetId);
        await appendToSheet(sheets, sheetId, [
          String(orderId),
          timestamp,
          data['Your Name'] || '',
          data['Phone Number'] || '',
          data['Your Email Address'] || '',
          data['productCategory'] || '',
          data['albumSize'] || '',
          data['occasion'] || '',
          data['Design Code'] || '',
          data['Names / Custom Text'] || '',
          data['Additional Notes'] || '',
          photosFolderLink,
        ]);
      }

      console.log(`Order ${orderId} saved to Drive folder: ${photosFolderLink}`);
    } catch (err) {
      console.error('Google Drive/Sheets error:', err.message);
      // Don't fail the request — order is still saved locally
    }
  } else {
    console.warn('Google Drive not configured — order saved locally only.');
  }

  res.status(201).json({ ok: true, orderId });
});

router.get('/', (req, res) => {
  res.json(localOrders.slice().reverse());
});

export default router;
