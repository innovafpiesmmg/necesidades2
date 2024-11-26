import express from 'express';
import bcrypt from 'bcryptjs';
import { getDatabase } from '../database/init.js';
import { authenticateToken, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

// Get all users
router.get('/', authenticateToken, authorizeRoles('admin'), (req, res) => {
  const db = getDatabase();
  try {
    const users = db.prepare(`
      SELECT id, name, email, role, avatar, created_at
      FROM users
    `).all();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener usuarios' });
  } finally {
    db.close();
  }
});

// Create new user
router.post('/', authenticateToken, authorizeRoles('admin'), (req, res) => {
  const { name, email, password, role, avatar } = req.body;
  const db = getDatabase();

  try {
    const hashedPassword = bcrypt.hashSync(password, 10);
    const result = db.prepare(`
      INSERT INTO users (name, email, password, role, avatar)
      VALUES (?, ?, ?, ?, ?)
    `).run(name, email, hashedPassword, role, avatar);

    res.status(201).json({
      id: result.lastInsertRowid,
      name,
      email,
      role,
      avatar
    });
  } catch (error) {
    if (error.code === 'SQLITE_CONSTRAINT') {
      res.status(400).json({ error: 'El email ya está registrado' });
    } else {
      res.status(500).json({ error: 'Error al crear usuario' });
    }
  } finally {
    db.close();
  }
});

// Update user
router.put('/:id', authenticateToken, authorizeRoles('admin'), (req, res) => {
  const { id } = req.params;
  const { name, email, role, avatar } = req.body;
  const db = getDatabase();

  try {
    const result = db.prepare(`
      UPDATE users
      SET name = ?, email = ?, role = ?, avatar = ?
      WHERE id = ?
    `).run(name, email, role, avatar, id);

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json({ id, name, email, role, avatar });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar usuario' });
  } finally {
    db.close();
  }
});

export default router;