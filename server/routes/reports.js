import express from 'express';
import { getDatabase } from '../database/init.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get all reports for a project
router.get('/project/:projectId', authenticateToken, (req, res) => {
  const { projectId } = req.params;
  const db = getDatabase();

  try {
    const reports = db.prepare(`
      SELECT r.*, p.title as project_title, u.name as teacher_name
      FROM reports r
      JOIN projects p ON r.project_id = p.id
      JOIN users u ON p.teacher_id = u.id
      WHERE r.project_id = ?
      ORDER BY r.created_at DESC
    `).all(projectId);

    res.json(reports);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener informes' });
  } finally {
    db.close();
  }
});

// Create new report
router.post('/', authenticateToken, (req, res) => {
  const { projectId, type, content } = req.body;
  const db = getDatabase();

  try {
    // Verify project ownership or admin/director role
    const project = db.prepare(`
      SELECT teacher_id FROM projects WHERE id = ?
    `).get(projectId);

    if (!project) {
      return res.status(404).json({ error: 'Proyecto no encontrado' });
    }

    if (req.user.role === 'profesor' && project.teacher_id !== req.user.id) {
      return res.status(403).json({ error: 'No autorizado' });
    }

    const result = db.prepare(`
      INSERT INTO reports (project_id, type, content, status, submitted_at)
      VALUES (?, ?, ?, 'entregado', CURRENT_TIMESTAMP)
    `).run(projectId, type, content);

    res.status(201).json({
      id: result.lastInsertRowid,
      projectId,
      type,
      content,
      status: 'entregado',
      submitted_at: new Date()
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear informe' });
  } finally {
    db.close();
  }
});

// Update report status
router.patch('/:id/status', authenticateToken, (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const db = getDatabase();

  try {
    const result = db.prepare(`
      UPDATE reports
      SET status = ?
      WHERE id = ?
    `).run(status, id);

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Informe no encontrado' });
    }

    res.json({ id, status });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar estado del informe' });
  } finally {
    db.close();
  }
});

export default router;