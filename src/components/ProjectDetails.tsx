import React from 'react';
import { FileText, Download, CheckCircle, XCircle } from 'lucide-react';
import type { Project } from '../types';

type ProjectDetailsProps = {
  project: Project;
  onStatusChange?: (status: Project['status'], comments: string) => void;
  canReview: boolean;
};

export default function ProjectDetails({ project, onStatusChange, canReview }: ProjectDetailsProps) {
  const [comments, setComments] = React.useState('');
  const [showReviewForm, setShowReviewForm] = React.useState(false);

  const handleStatusChange = (status: Project['status']) => {
    if (onStatusChange) {
      onStatusChange(status, comments);
      setShowReviewForm(false);
      setComments('');
    }
  };

  const getStatusBadge = (status: Project['status']) => {
    const styles = {
      borrador: 'bg-gray-100 text-gray-800',
      revision: 'bg-yellow-100 text-yellow-800',
      aprobado: 'bg-green-100 text-green-800',
      rechazado: 'bg-red-100 text-red-800'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{project.title}</h2>
          <div className="flex items-center space-x-4">
            {getStatusBadge(project.status)}
            <span className="text-sm text-gray-500">
              Creado: {new Date(project.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
        {canReview && project.status === 'revision' && (
          <div className="flex space-x-2">
            <button
              onClick={() => setShowReviewForm(true)}
              className="btn btn-primary"
            >
              Revisar proyecto
            </button>
          </div>
        )}
      </div>

      {showReviewForm && (
        <div className="mb-6 p-4 border rounded-lg bg-gray-50">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Revisar proyecto</h3>
          <div className="space-y-4">
            <div>
              <label className="label" htmlFor="comments">
                Comentarios
              </label>
              <textarea
                id="comments"
                className="input min-h-[100px]"
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder="Añade comentarios sobre el proyecto..."
              />
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handleStatusChange('aprobado')}
                className="btn btn-primary flex items-center space-x-2"
              >
                <CheckCircle className="h-5 w-5" />
                <span>Aprobar</span>
              </button>
              <button
                onClick={() => handleStatusChange('rechazado')}
                className="btn btn-secondary flex items-center space-x-2 bg-red-50 text-red-700 hover:bg-red-100"
              >
                <XCircle className="h-5 w-5" />
                <span>Rechazar</span>
              </button>
              <button
                onClick={() => setShowReviewForm(false)}
                className="btn btn-secondary"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="prose max-w-none mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Descripción</h3>
        <p className="text-gray-600">{project.description}</p>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Objetivos</h3>
          <ul className="list-disc list-inside space-y-1 text-gray-600">
            {project.objectives.map((objective, index) => (
              <li key={index}>{objective}</li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Recursos necesarios</h3>
          <ul className="list-disc list-inside space-y-1 text-gray-600">
            {project.resources.map((resource, index) => (
              <li key={index}>{resource}</li>
            ))}
          </ul>
        </div>
      </div>

      {project.attachments && project.attachments.length > 0 && (
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Documentos adjuntos</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {project.attachments.map((attachment, index) => (
              <div
                key={index}
                className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <FileText className="h-6 w-6 text-blue-600 mr-3" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {attachment.fileName}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(attachment.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <a
                  href={`/api/projects/download/${attachment.id}`}
                  download
                  className="ml-2 text-blue-600 hover:text-blue-800"
                >
                  <Download className="h-5 w-5" />
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {project.comments && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Comentarios de revisión</h3>
          <p className="text-gray-600">{project.comments}</p>
        </div>
      )}
    </div>
  );
}