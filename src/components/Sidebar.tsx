import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderKanban,
  FileSpreadsheet,
  Users,
  Settings,
  Calendar,
  PlusCircle
} from 'lucide-react';
import ProjectModal from './ProjectModal';
import type { Project } from '../types';

const navigation = [
  { name: 'Panel Principal', href: '/', icon: LayoutDashboard },
  { name: 'Proyectos', href: '/projects', icon: FolderKanban },
  { name: 'Informes', href: '/reports', icon: FileSpreadsheet },
  { name: 'Usuarios', href: '/users', icon: Users },
  { name: 'Períodos', href: '/periods', icon: Calendar },
  { name: 'Configuración', href: '/settings', icon: Settings },
];

export default function Sidebar() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCreateProject = (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => {
    // Aquí se implementaría la lógica para crear el proyecto
    console.log('Nuevo proyecto:', project);
  };

  return (
    <>
      <div className="w-64 bg-blue-50 border-r border-blue-100 min-h-[calc(100vh-4rem)]">
        <div className="p-4">
          <button 
            className="w-full btn btn-primary flex items-center justify-center space-x-2"
            onClick={() => setIsModalOpen(true)}
          >
            <PlusCircle className="h-5 w-5" />
            <span>Nuevo Proyecto</span>
          </button>
        </div>
        <nav className="px-4 space-y-1">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                `flex items-center px-4 py-3 text-sm font-medium rounded-lg ${
                  isActive
                    ? 'bg-blue-100 text-blue-900'
                    : 'text-blue-900 hover:bg-blue-100'
                }`
              }
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.name}
            </NavLink>
          ))}
        </nav>
      </div>

      <ProjectModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateProject}
      />
    </>
  );
}