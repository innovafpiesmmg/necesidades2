import React, { useState } from 'react';
import { Search, UserPlus } from 'lucide-react';
import type { User } from '../types';
import UserModal from '../components/UserModal';

const mockUsers: User[] = [
  {
    id: '1',
    name: 'Ana García',
    email: 'ana.garcia@escuela.edu',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330'
  },
  {
    id: '2',
    name: 'Carlos Ruiz',
    email: 'carlos.ruiz@escuela.edu',
    role: 'profesor',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e'
  }
];

export default function Users() {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<User['role'] | 'todos'>('todos');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [users, setUsers] = useState(mockUsers);

  const handleCreateUser = (userData: Omit<User, 'id'>) => {
    const newUser = {
      ...userData,
      id: (users.length + 1).toString()
    };
    setUsers([...users, newUser]);
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'todos' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const getRoleBadge = (role: User['role']) => {
    const styles = {
      admin: 'bg-purple-100 text-purple-800',
      director: 'bg-blue-100 text-blue-800',
      profesor: 'bg-green-100 text-green-800'
    };

    const labels = {
      admin: 'Administrador',
      director: 'Director',
      profesor: 'Profesor'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[role]}`}>
        {labels[role]}
      </span>
    );
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">Usuarios</h1>
          <button 
            className="btn btn-primary flex items-center space-x-2"
            onClick={() => setIsModalOpen(true)}
          >
            <UserPlus className="h-5 w-5" />
            <span>Nuevo Usuario</span>
          </button>
        </div>

        <div className="flex space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Buscar usuarios..."
              className="pl-10 input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="input"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value as User['role'] | 'todos')}
          >
            <option value="todos">Todos los roles</option>
            <option value="admin">Administrador</option>
            <option value="director">Director</option>
            <option value="profesor">Profesor</option>
          </select>
        </div>

        <div className="grid gap-4">
          {filteredUsers.map((user) => (
            <div key={user.id} className="card hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <img
                    src={`${user.avatar}?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80`}
                    alt={user.name}
                    className="h-12 w-12 rounded-full"
                  />
                  <div>
                    <h3 className="font-medium text-gray-900">{user.name}</h3>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  {getRoleBadge(user.role)}
                  <button className="btn btn-secondary">
                    Editar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <UserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateUser}
      />
    </>
  );
}