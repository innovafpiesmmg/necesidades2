import twilio from 'twilio';
import { getDatabase } from '../database/init.js';

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export async function sendWhatsAppNotification(to, message) {
  try {
    await client.messages.create({
      body: message,
      from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
      to: `whatsapp:${to}`
    });
    return true;
  } catch (error) {
    console.error('Error sending WhatsApp notification:', error);
    return false;
  }
}

export async function notifyProjectStatusChange(projectId, status) {
  const db = getDatabase();
  try {
    const project = db.prepare(`
      SELECT p.*, u.name as teacher_name, u.phone_number
      FROM projects p
      JOIN users u ON p.teacher_id = u.id
      WHERE p.id = ?
    `).get(projectId);

    if (!project || !project.phone_number) return;

    const statusMessages = {
      aprobado: '¡Felicidades! Tu proyecto ha sido aprobado.',
      rechazado: 'Tu proyecto ha sido rechazado. Por favor, revisa los comentarios.',
      revision: 'Tu proyecto está en revisión.'
    };

    const message = `
      Hola ${project.teacher_name},
      
      ${statusMessages[status]}
      
      Proyecto: ${project.title}
      
      Accede a la plataforma para más detalles.
    `;

    await sendWhatsAppNotification(project.phone_number, message);
  } catch (error) {
    console.error('Error notifying project status change:', error);
  }
}

export async function notifyDeadlineApproaching(days = 7) {
  const db = getDatabase();
  try {
    // Get active period deadlines
    const deadlines = db.prepare(`
      SELECT p.name as period_name, p.submission_deadline,
             prd.deadline_date, prd.report_type,
             u.name as teacher_name, u.phone_number,
             pr.title as project_title
      FROM periods p
      JOIN period_report_deadlines prd ON p.id = prd.period_id
      JOIN projects pr ON pr.status = 'aprobado'
      JOIN users u ON pr.teacher_id = u.id
      WHERE p.is_active = 1
        AND (
          (julianday(p.submission_deadline) - julianday('now')) <= ?
          OR (julianday(prd.deadline_date) - julianday('now')) <= ?
        )
        AND (julianday(p.submission_deadline) - julianday('now')) > 0
        AND (julianday(prd.deadline_date) - julianday('now')) > 0
    `).all(days, days);

    for (const deadline of deadlines) {
      if (!deadline.phone_number) continue;

      const message = `
        Hola ${deadline.teacher_name},
        
        Recordatorio: Tienes plazos próximos a vencer
        
        ${deadline.submission_deadline ? `
        - Presentación de proyectos: ${new Date(deadline.submission_deadline).toLocaleDateString()}` : ''}
        ${deadline.deadline_date ? `
        - Informe ${deadline.report_type}: ${new Date(deadline.deadline_date).toLocaleDateString()}
          Proyecto: ${deadline.project_title}` : ''}
        
        Por favor, asegúrate de cumplir con los plazos establecidos.
      `;

      await sendWhatsAppNotification(deadline.phone_number, message);
    }
  } catch (error) {
    console.error('Error notifying deadlines:', error);
  }
}