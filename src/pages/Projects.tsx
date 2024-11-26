import React, { useState, useEffect } from 'react';
import { 
  Search,
  Filter,
  FileCheck2,
  Clock,
  AlertCircle,
  PlusCircle,
  Eye,
  Loader2
} from 'lucide-react';
import type { Project } from '../types';
import ProjectModal from '../components/ProjectModal';
import ProjectDetails from '../components/ProjectDetails';

export default function Projects() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<Project['status'] | 'todos'>('todos');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [userRole, setUserRole] = useState<'admin' | 'director' | 'profesor'>('profesor');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProjects();
    // Get user role from context/auth
    // This is a placeholder
    setUserRole('admin');
  }, []);

  const fetchProjects = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch('http://localhost:3000/api/projects', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}` // Add token if you have authentication
        }
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      const data = await response.json();
      setProjects(data);
    } catch (error) {
      console.error('Error fetching projects:', error);
      setError('No se pudieron cargar los proyectos. Por favor, intente más tarde.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateProject = async (formData: FormData) => {
    try {
      setError(null);
      const response = await fetch('http://localhost:3000/api/projects', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const newProject = await response.json();
      setProjects(prev => [newProject, ...prev]);
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error creating project:', error);
      setError('No se pudo crear el proyecto. Por favor, intente más tarde.');
    }
  };

  const handleStatusChange = async (projectId: string, status: Project['status'], comments: string) => {
    try {
      setError(null);
      const response = await fetch(`http://localhost:3000/api/projects/${projectId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ status, comments }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      setProjects(prev =>
        prev.map(project =>
          project.id === projectId
            ? { ...project, status, comments }
            : project
        )
      );
      setSelectedProject(null);
    } catch (error) {
      console.error('Error updating project status:', error);
      setError('No se pudo actualizar el estado del proyecto. Por favor, intente más tarde.');
    }
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'todos' || project.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusIcon = (status: Project['status']) => {
    switch (status) {
      case 'aprobado':
        return <FileCheck2 className="text-green-500" />;
      case 'revision':
        return <Clock className="text-yellow-500" />;
      case 'rechazado':
        return <AlertCircle className="text-red-500" />;
      default:
        return <Clock className="text-gray-500" />;
    }
  };

  const getStatusBadge = (status: Project['status']) => {
    const styles = {
      aprobado: 'bg-green-100 text-green-800',
      revision: 'bg-yellow-100 text-yellow-800',
      rechazado: 'bg-red-100 text-red-800',
      borrador: 'bg-gray-100 text-gray-800'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (selectedProject) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setSelectedProject(null)}
            className="btn btn-secondary"
          >
            Volver a la lista
          </button>
        </div>
        <ProjectDetails
          project={selectedProject}
          onStatusChange={
            (userRole === 'admin' || userRole === 'director')
              ? (status, comments) => handleStatusChange(selectedProject.id, status, comments)
              : undefined
          }
          canReview={['admin', 'director'].includes(userRole)}
        />
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">Proyectos</h1>
          {userRole === 'profesor' && (
            <button 
              className="btn btn-primary flex items-center space-x-2"
              onClick={() => setIsModalOpen(true)}
            >
              <PlusCircle className="h-5 w-5" />
              <span>Nuevo Proyecto</span>
            </button>
          )}
        </div>

        <div className="flex space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Buscar proyectos..."
              className="pl-10 input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <select
              className="pl-10 input appearance-none pr-8"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as Project['status'] | 'todos')}
            >
              <option value="todos">Todos los estados</option>
              <option value="borrador">Borrador</option>
              <option value="revision">En Revisión</option>
              <option value="aprobado">Aprobado</option>
              <option value="rechazado">Rechazado</option>
            </select>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
            {error}
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredProjects.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <p className="text-gray-500">No se encontraron proyectos</p>
              </div>
            ) : (
              filteredProjects.map((project) => (
                <div key={project.id} className="card hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(project.status)}
                        <h3 className="text-lg font-medium text-gray-900">{project.title}</h3>
                      </div>
                      <p className="text-gray-600">{project.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {project.objectives.map((objective, index) => (
                          <span key={index} className="bg-blue-50 text-blue-700 px-2 py-1 rounded-md text-sm">
                            {objective}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                      {getStatusBadge(project.status)}
                      <span className="text-sm text-gray-500">
                        Actualizado: {new Date(project.updatedAt).toLocaleDateString()}
                      </span>
                      <button
                        onClick={() => setSelectedProject(project)}
                        className="btn btn-secondary flex items-center space-x-2"
                      >
                        <Eye className="h-4 w-4" />
                        <span>Ver detalles</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      <ProjectModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateProject}
      />
    </>
  );
}