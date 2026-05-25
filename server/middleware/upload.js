import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Store uploaded photos in server/uploads/
const upload = multer({ dest: path.join(__dirname, '..', 'uploads') });

export default upload;
