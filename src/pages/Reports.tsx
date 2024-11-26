import React, { useState } from 'react';
import { FileSpreadsheet, Download, Eye } from 'lucide-react';

type Report = {
  id: string;
  projectName: string;
  type: 'trimestral' | 'final';
  period: string;
  status: 'pendiente' | 'entregado' | 'revisado';
  dueDate: Date;
  submittedDate?: Date;
};

const mockReports: Report[] = [
  {
    id: '1',
    projectName: 'Proyecto de Innovación Tecnológica',
    type: 'trimestral',
    period: '1º Trimestre 2024',
    status: 'entregado',
    dueDate: new Date('2024-03-31'),
    submittedDate: new Date('2024-03-15')
  },
  {
    id: '2',
    projectName: 'Taller de Teatro',
    type: 'trimestral',
    period: '1º Trimestre 2024',
    status: 'pendiente',
    dueDate: new Date('2024-03-31')
  }
];

export default function Reports() {
  const [selectedType, setSelectedType] = useState<'todos' | 'trimestral' | 'final'>('todos');

  const getStatusBadge = (status: Report['status']) => {
    const styles = {
      pendiente: 'bg-yellow-100 text-yellow-800',
      entregado: 'bg-blue-100 text-blue-800',
      revisado: 'bg-green-100 text-green-800'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Informes</h1>
        <div className="flex space-x-2">
          <select
            className="input"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value as typeof selectedType)}
          >
            <option value="todos">Todos los tipos</option>
            <option value="trimestral">Trimestral</option>
            <option value="final">Final</option>
          </select>
        </div>
      </div>

      <div className="grid gap-4">
        {mockReports.map((report) => (
          <div key={report.id} className="card hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center">
                  <FileSpreadsheet className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{report.projectName}</h3>
                  <p className="text-sm text-gray-500">
                    {report.type.charAt(0).toUpperCase() + report.type.slice(1)} - {report.period}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  {getStatusBadge(report.status)}
                  <p className="text-sm text-gray-500 mt-1">
                    Vence: {report.dueDate.toLocaleDateString()}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button className="btn btn-secondary p-2">
                    <Eye className="h-5 w-5" />
                  </button>
                  <button className="btn btn-secondary p-2">
                    <Download className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}