import React from 'react';
import { Bell, Settings, LogOut } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-blue-900 text-white border-b border-blue-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-xl font-bold">Gestión de proyectos por necesidades docentes</h1>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button className="p-2 text-blue-100 hover:text-white">
              <Bell className="h-6 w-6" />
            </button>
            <button className="p-2 text-blue-100 hover:text-white">
              <Settings className="h-6 w-6" />
            </button>
            <div className="ml-3 relative flex items-center space-x-3">
              <div className="flex flex-col items-end">
                <span className="text-sm font-medium text-white">Ana García</span>
                <span className="text-xs text-blue-200">Administradora</span>
              </div>
              <img
                className="h-8 w-8 rounded-full border-2 border-blue-700"
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                alt="Avatar del usuario"
              />
              <button className="p-2 text-blue-100 hover:text-white">
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}