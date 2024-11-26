import express from 'express';
import multer from 'multer';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { getDatabase } from '../database/init.js';
import { authenticateToken, authorizeRoles } from '../middleware/auth.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, join(__dirname, '../uploads'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.originalname.split('.').pop());
  }
});

const upload = multer({ storage: storage });

// Get site settings
router.get('/', async (req, res) => {
  const db = getDatabase();
  try {
    const settings = db.prepare('SELECT * FROM site_settings LIMIT 1').get();
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener configuración' });
  } finally {
    db.close();
  }
});

// Update site settings
router.put('/', authenticateToken, authorizeRoles('admin'), upload.fields([
  { name: 'logo', maxCount: 1 },
  { name: 'favicon', maxCount: 1 }
]), async (req, res) => {
  const { institutionName, primaryColor, secondaryColor } = req.body;
  const db = getDatabase();

  try {
    const updateFields = [];
    const updateValues = [];

    if (institutionName) {
      updateFields.push('institution_name = ?');
      updateValues.push(institutionName);
    }

    if (primaryColor) {
      updateFields.push('primary_color = ?');
      updateValues.push(primaryColor);
    }

    if (secondaryColor) {
      updateFields.push('secondary_color = ?');
      updateValues.push(secondaryColor);
    }

    if (req.files?.logo) {
      updateFields.push('logo = ?');
      updateValues.push(req.files.logo[0].path);
    }

    if (req.files?.favicon) {
      updateFields.push('favicon = ?');
      updateValues.push(req.files.favicon[0].path);
    }

    if (updateFields.length > 0) {
      updateFields.push('updated_at = CURRENT_TIMESTAMP');
      const query = `
        UPDATE site_settings
        SET ${updateFields.join(', ')}
        WHERE id = 1
      `;
      
      db.prepare(query).run(...updateValues);
    }

    const updatedSettings = db.prepare('SELECT * FROM site_settings LIMIT 1').get();
    res.json(updatedSettings);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar configuración' });
  } finally {
    db.close();
  }
});

export default router;