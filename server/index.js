import 'dotenv/config';
import express from 'express';
import fs from 'fs/promises';
import fsSync from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';
import nodemailer from 'nodemailer';
import { google } from 'googleapis';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

const app        = express();
const PORT       = process.env.PORT || 5174;
const dataDir    = path.join(__dirname, '..', 'data');
const tempDir    = path.join(dataDir, 'temp');
const ordersFile = path.join(dataDir, 'orders.jsonl');
const authFile   = path.join(dataDir, 'auth.json');

// ── Ensure dirs exist ─────────────────────────────────────
await fs.mkdir(tempDir, { recursive: true });

// ── Multer — temp storage ─────────────────────────────────
const upload = multer({
  dest: tempDir,
  limits: { fileSize: 50 * 1024 * 1024, files: 200 },
  fileFilter(_req, file, cb) {
    cb(null, /^image\//i.test(file.mimetype) || /^video\//i.test(file.mimetype));
  },
});

// ── OAuth2 helpers ────────────────────────────────────────
function makeOAuthClient() {
  return new google.auth.OAuth2(
    process.env.OAUTH_CLIENT_ID,
    process.env.OAUTH_CLIENT_SECRET,
    process.env.OAUTH_REDIRECT_URI,
  );
}

function loadRefreshToken() {
  if (process.env.OAUTH_REFRESH_TOKEN) return process.env.OAUTH_REFRESH_TOKEN;
  try {
    return JSON.parse(fsSync.readFileSync(authFile, 'utf8')).refresh_token || null;
  } catch { return null; }
}

function makeDriveClient() {
  const auth = makeOAuthClient();
  auth.setCredentials({ refresh_token: loadRefreshToken() });
  return google.drive({ version: 'v3', auth });
}

// ── Google Drive upload (photos) ──────────────────────────
async function uploadFilesToDrive(files, folderName) {
  const drive = makeDriveClient();

  const { data: folder } = await drive.files.create({
    requestBody: {
      name: folderName,
      mimeType: 'application/vnd.google-apps.folder',
      parents: [process.env.DRIVE_PARENT_FOLDER_ID],
    },
    fields: 'id,webViewLink',
  });

  await drive.permissions.create({
    fileId: folder.id,
    requestBody: { role: 'reader', type: 'anyone' },
  });

  await Promise.all(
    files.map(f =>
      drive.files.create({
        requestBody: { name: f.originalname, parents: [folder.id] },
        media: { mimeType: f.mimetype, body: fsSync.createReadStream(f.path) },
      }),
    ),
  );

  return folder.webViewLink;
}

// ── Drive orders persistence ──────────────────────────────
let _driveOrdersFileId = null;

async function getDriveOrdersFileId(drive) {
  if (_driveOrdersFileId) return _driveOrdersFileId;

  const { data } = await drive.files.list({
    q: `name='orders.jsonl' and '${process.env.DRIVE_PARENT_FOLDER_ID}' in parents and trashed=false`,
    fields: 'files(id)',
    spaces: 'drive',
  });

  if (data.files.length > 0) {
    _driveOrdersFileId = data.files[0].id;
    return _driveOrdersFileId;
  }

  const { data: created } = await drive.files.create({
    requestBody: {
      name: 'orders.jsonl',
      mimeType: 'text/plain',
      parents: [process.env.DRIVE_PARENT_FOLDER_ID],
    },
    media: { mimeType: 'text/plain', body: '' },
    fields: 'id',
  });

  _driveOrdersFileId = created.id;
  return _driveOrdersFileId;
}

function streamToString(stream) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    stream.on('data', c => chunks.push(Buffer.from(c)));
    stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    stream.on('error', reject);
  });
}

async function driveReadOrdersContent() {
  const drive = makeDriveClient();
  const fileId = await getDriveOrdersFileId(drive);
  const res = await drive.files.get(
    { fileId, alt: 'media' },
    { responseType: 'stream' },
  );
  return streamToString(res.data);
}

async function driveAppendOrder(orderJson) {
  const drive = makeDriveClient();
  const fileId = await getDriveOrdersFileId(drive);

  let existing = '';
  try {
    const res = await drive.files.get(
      { fileId, alt: 'media' },
      { responseType: 'stream' },
    );
    existing = await streamToString(res.data);
  } catch { /* file is empty or unreadable — start fresh */ }

  await drive.files.update({
    fileId,
    media: { mimeType: 'text/plain', body: existing + orderJson + '\n' },
  });
}

// On startup: if local orders file is missing, restore it from Drive
async function bootstrapOrdersFromDrive() {
  if (!loadRefreshToken() || !process.env.DRIVE_PARENT_FOLDER_ID) return;
  if (fsSync.existsSync(ordersFile)) return;
  try {
    const content = await driveReadOrdersContent();
    if (content.trim()) {
      await fs.mkdir(dataDir, { recursive: true });
      await fs.writeFile(ordersFile, content);
      console.log('Orders restored from Google Drive.');
    }
  } catch (err) {
    console.error('Drive bootstrap error:', err.message);
  }
}

await bootstrapOrdersFromDrive();

// ── Gmail ─────────────────────────────────────────────────
const mailer = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_PASS },
});

async function sendOrderEmail(order, driveFolderUrl) {
  const photosCell = driveFolderUrl
    ? `<a href="${driveFolderUrl}">View ${order.photoCount} photo(s) in Drive →</a>`
    : 'Not provided';

  await mailer.sendMail({
    from: `"4K Digital Press Orders" <${process.env.GMAIL_USER}>`,
    to: process.env.OWNER_EMAIL,
    subject: `New Order #${order.id} — ${order.name} | ${order.productCategory}`,
    html: `
      <h2 style="color:#B8860B">New Order Received</h2>
      <p><b>Order ID:</b> ${order.id}</p>
      <p><b>Time:</b> ${new Date(order.createdAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</p>
      <table border="1" cellpadding="10" cellspacing="0"
             style="border-collapse:collapse;font-family:sans-serif;font-size:14px">
        <tr><td><b>Name</b></td><td>${order.name}</td></tr>
        <tr><td><b>Phone</b></td><td>${order.phone}</td></tr>
        <tr><td><b>Email</b></td><td>${order.email}</td></tr>
        <tr><td><b>Product Category</b></td><td>${order.productCategory}</td></tr>
        <tr><td><b>Album Size</b></td><td>${order.albumSize || '—'}</td></tr>
        <tr><td><b>Occasion</b></td><td>${order.occasion || '—'}</td></tr>
        <tr><td><b>Design Code</b></td><td>${order.designCode || '—'}</td></tr>
        <tr><td><b>Names / Custom Text</b></td><td>${order.customText || '—'}</td></tr>
        <tr><td><b>Additional Notes</b></td><td>${order.notes || '—'}</td></tr>
        <tr><td><b>Photos</b></td><td>${photosCell}</td></tr>
      </table>`,
  });
}

// ── Middleware ────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── OAuth routes (one-time setup) ─────────────────────────
app.get('/auth/setup', (_req, res) => {
  try {
    const url = makeOAuthClient().generateAuthUrl({
      access_type: 'offline',
      prompt: 'consent',
      scope: ['https://www.googleapis.com/auth/drive'],
    });
    res.redirect(url);
  } catch (err) {
    res.status(500).send('Auth error: ' + err.message);
  }
});

app.get('/auth/callback', async (req, res) => {
  try {
    const { tokens } = await makeOAuthClient().getToken(req.query.code);
    await fs.mkdir(dataDir, { recursive: true });
    await fs.writeFile(authFile, JSON.stringify(tokens, null, 2));
    res.send(`
      <h2 style="color:green">✅ Google Drive connected!</h2>
      <p>Copy the <b>refresh_token</b> from <code>data/auth.json</code>
         into your <code>OAUTH_REFRESH_TOKEN</code> environment variable.</p>
      <pre>${JSON.stringify(tokens, null, 2)}</pre>`);
  } catch (err) {
    res.status(500).send('OAuth error: ' + err.message);
  }
});

// ── Order submission ──────────────────────────────────────
app.post('/api/orders', upload.array('photos', 200), async (req, res) => {
  const tempFiles = req.files || [];
  try {
    const {
      'Your Name': name,
      'Phone Number': phone,
      'Your Email Address': email,
      productCategory,
      albumSize,
      occasion,
      'Design Code': designCode,
      'Names / Custom Text': customText,
      'Additional Notes': notes,
    } = req.body;

    if (!name || !phone || !email || !productCategory) {
      return res.status(400).json({ error: 'Name, phone, email and product are required.' });
    }

    const order = {
      id:              `ord_${Date.now()}`,
      createdAt:       new Date().toISOString(),
      name:            name.trim(),
      phone:           phone.trim(),
      email:           email.trim(),
      productCategory: productCategory.trim(),
      albumSize:       (albumSize || '').trim(),
      occasion:        (occasion || '').trim(),
      designCode:      (designCode || '').trim(),
      customText:      (customText || '').trim(),
      notes:           (notes || '').trim(),
      photoCount:      tempFiles.length,
    };

    // Upload photos to Drive
    let driveFolderUrl = null;
    if (tempFiles.length > 0 && process.env.DRIVE_PARENT_FOLDER_ID && loadRefreshToken()) {
      const folderName = `${order.id} — ${order.name} — ${order.phone}`;
      driveFolderUrl = await uploadFilesToDrive(tempFiles, folderName);
      order.driveFolderUrl = driveFolderUrl;
    }

    // Save to local orders.jsonl
    await fs.mkdir(dataDir, { recursive: true });
    await fs.appendFile(ordersFile, JSON.stringify(order) + '\n');

    // Sync to Drive orders.jsonl (non-blocking — local write already succeeded)
    if (process.env.DRIVE_PARENT_FOLDER_ID && loadRefreshToken()) {
      driveAppendOrder(JSON.stringify(order)).catch(err =>
        console.error('Drive orders sync error:', err.message),
      );
    }

    // Send email (non-blocking)
    if (process.env.GMAIL_USER && process.env.GMAIL_PASS && process.env.OWNER_EMAIL) {
      sendOrderEmail(order, driveFolderUrl).catch(err =>
        console.error('Email error:', err.message),
      );
    }

    res.status(201).json({ ok: true, orderId: order.id, driveFolderUrl });
  } catch (err) {
    console.error('Order error:', err);
    res.status(500).json({ error: 'Server error. Please try again.' });
  } finally {
    for (const f of tempFiles) {
      fs.unlink(f.path).catch(() => {});
    }
  }
});

// ── My Orders — lookup by email ───────────────────────────
app.get('/api/orders/lookup', async (req, res) => {
  const email = String(req.query.email || '').trim().toLowerCase();
  if (!email) return res.status(400).json({ error: 'Email required.' });
  try {
    const raw = await fs.readFile(ordersFile, 'utf8').catch(() => '');
    const orders = raw.trim().split('\n').filter(Boolean).map(JSON.parse)
      .filter(o => String(o.email || '').toLowerCase() === email)
      .reverse();
    res.json({ orders });
  } catch {
    res.json({ orders: [] });
  }
});

// ── Admin — all orders (Firebase token required) ──────────
app.get('/api/orders/admin', async (req, res) => {
  const token = String(req.headers.authorization || '').replace('Bearer ', '').trim();
  if (!token) return res.status(401).json({ error: 'Unauthorized.' });

  try {
    const fbRes = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${process.env.VITE_FIREBASE_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken: token }),
      },
    );
    const fbData = await fbRes.json();
    if (!fbRes.ok || !fbData.users?.[0])
      return res.status(401).json({ error: 'Invalid token.' });

    const callerEmail = String(fbData.users[0].email || '').toLowerCase();
    if (callerEmail !== String(process.env.OWNER_EMAIL || '').toLowerCase())
      return res.status(403).json({ error: 'Access denied.' });

    const raw = await fs.readFile(ordersFile, 'utf8').catch(() => '');
    const orders = raw.trim().split('\n').filter(Boolean).map(JSON.parse).reverse();
    res.json({ orders });
  } catch (err) {
    console.error('Admin auth error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

// ── Read all orders (unauthenticated) ─────────────────────
app.get('/api/orders', async (_req, res) => {
  try {
    const raw = await fs.readFile(ordersFile, 'utf8').catch(() => '');
    const orders = raw.trim().split('\n').filter(Boolean).map(JSON.parse).reverse();
    res.json(orders);
  } catch {
    res.json([]);
  }
});

// ── Static files + SPA fallback (must be last) ───────────
app.use(express.static(path.join(__dirname, '..', 'dist')));
app.get('/{*splat}', (_req, res) =>
  res.sendFile(path.join(__dirname, '..', 'dist', 'index.html')),
);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
