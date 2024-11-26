// ... (previous imports)
import { notifyProjectStatusChange } from '../services/notifications.js';

// ... (previous code)

// Update project status
router.patch('/:id/status', authenticateToken, authorizeRoles('admin', 'director'), async (req, res) => {
  const { id } = req.params;
  const { status, comments } = req.body;
  const db = getDatabase();

  try {
    const result = db.prepare(`
      UPDATE projects
      SET status = ?, comments = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(status, comments, id);

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Proyecto no encontrado' });
    }

    // Send WhatsApp notification
    await notifyProjectStatusChange(id, status);

    // Create in-app notification
    db.prepare(`
      INSERT INTO notifications (user_id, title, message, type)
      SELECT 
        p.teacher_id,
        CASE 
          WHEN ? = 'aprobado' THEN '¡Proyecto aprobado!'
          WHEN ? = 'rechazado' THEN 'Proyecto rechazado'
          ELSE 'Proyecto en revisión'
        END,
        CASE 
          WHEN ? = 'aprobado' THEN 'Tu proyecto ha sido aprobado.'
          WHEN ? = 'rechazado' THEN 'Tu proyecto ha sido rechazado. Revisa los comentarios.'
          ELSE 'Tu proyecto está siendo revisado.'
        END,
        'project'
      FROM projects p
      WHERE p.id = ?
    `).run(status, status, status, status, id);

    res.json({ id, status, comments });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar estado del proyecto' });
  }
});