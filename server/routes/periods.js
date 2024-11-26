import express from 'express';
import { getDatabase } from '../database/init.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get active period
router.get('/active', authenticateToken, (req, res) => {
  const db = getDatabase();
  try {
    const period = db.prepare(`
      SELECT p.*, GROUP_CONCAT(prd.deadline_date) as report_deadlines
      FROM periods p
      LEFT JOIN period_report_deadlines prd ON p.id = prd.period_id
      WHERE p.is_active = 1
      GROUP BY p.id
    `).get();

    if (!period) {
      return res.json(null);
    }

    const periodWithDeadlines = {
      ...period,
      reportDeadlines: period.report_deadlines
        ? period.report_deadlines.split(',').map(date => new Date(date))
        : []
    };

    res.json(periodWithDeadlines);
  } catch (error) {
    console.error('Error fetching active period:', error);
    res.status(500).json({ error: 'Error al obtener período activo' });
  }
});

// Get all periods
router.get('/', authenticateToken, (req, res) => {
  const db = getDatabase();
  try {
    const periods = db.prepare(`
      SELECT p.*, GROUP_CONCAT(prd.deadline_date) as report_deadlines
      FROM periods p
      LEFT JOIN period_report_deadlines prd ON p.id = prd.period_id
      GROUP BY p.id
      ORDER BY p.created_at DESC
    `).all();

    const periodsWithDeadlines = periods.map(period => ({
      ...period,
      reportDeadlines: period.report_deadlines
        ? period.report_deadlines.split(',').map(date => new Date(date))
        : []
    }));

    res.json(periodsWithDeadlines);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener períodos' });
  }
});

// Create new period
router.post('/', authenticateToken, (req, res) => {
  const { name, startDate, endDate, submissionDeadline, reportDeadlines } = req.body;
  const db = getDatabase();

  try {
    db.exec('BEGIN TRANSACTION');

    // Deactivate current active period if exists
    db.prepare(`
      UPDATE periods SET is_active = 0 WHERE is_active = 1
    `).run();

    // Create new period
    const result = db.prepare(`
      INSERT INTO periods (name, start_date, end_date, submission_deadline, is_active)
      VALUES (?, ?, ?, ?, 1)
    `).run(name, startDate, endDate, submissionDeadline);

    const periodId = result.lastInsertRowid;

    // Insert report deadlines
    const insertDeadline = db.prepare(`
      INSERT INTO period_report_deadlines (period_id, deadline_date, report_type)
      VALUES (?, ?, ?)
    `);

    reportDeadlines.forEach((deadline, index) => {
      insertDeadline.run(
        periodId,
        deadline,
        index === reportDeadlines.length - 1 ? 'final' : 'trimestral'
      );
    });

    db.exec('COMMIT');

    res.status(201).json({
      id: periodId,
      name,
      startDate,
      endDate,
      submissionDeadline,
      reportDeadlines,
      isActive: true
    });
  } catch (error) {
    db.exec('ROLLBACK');
    res.status(500).json({ error: 'Error al crear período' });
  }
});

export default router;