import React, { useState } from 'react';
import { Clock, Calendar, Plus } from 'lucide-react';
import type { Period } from '../types';

export default function Periods() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPeriod, setEditingPeriod] = useState<Period | null>(null);
  const [periods, setPeriods] = useState<Period[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    startDate: '',
    endDate: '',
    submissionDeadline: '',
    reportDeadlines: ['', '', ''] // Two trimestral reports and final report
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Implementation for submitting period data
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Períodos</h1>
        <button 
          className="btn btn-primary flex items-center space-x-2"
          onClick={() => setIsModalOpen(true)}
        >
          <Plus className="h-5 w-5" />
          <span>Nuevo Período</span>
        </button>
      </div>

      {/* Period Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4">
            <form onSubmit={handleSubmit} className="p-6">
              <h2 className="text-xl font-semibold mb-6">
                {editingPeriod ? 'Editar Período' : 'Nuevo Período'}
              </h2>

              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="label" htmlFor="name">Nombre del curso</label>
                  <input
                    type="text"
                    id="name"
                    className="input"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Ej: Curso 2024-2025"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-6 mb-6">
                <div>
                  <label className="label" htmlFor="startDate">Fecha de inicio</label>
                  <input
                    type="date"
                    id="startDate"
                    className="input"
                    value={formData.startDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <label className="label" htmlFor="endDate">Fecha de fin</label>
                  <input
                    type="date"
                    id="endDate"
                    className="input"
                    value={formData.endDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <label className="label" htmlFor="submissionDeadline">
                    Plazo de presentación
                  </label>
                  <input
                    type="date"
                    id="submissionDeadline"
                    className="input"
                    value={formData.submissionDeadline}
                    onChange={(e) => setFormData(prev => ({ ...prev, submissionDeadline: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Plazos de informes</h3>
                <div className="grid grid-cols-3 gap-6">
                  <div>
                    <label className="label" htmlFor="firstReport">1º Informe trimestral</label>
                    <input
                      type="date"
                      id="firstReport"
                      className="input"
                      value={formData.reportDeadlines[0]}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        reportDeadlines: [
                          e.target.value,
                          prev.reportDeadlines[1],
                          prev.reportDeadlines[2]
                        ]
                      }))}
                      required
                    />
                  </div>
                  <div>
                    <label className="label" htmlFor="secondReport">2º Informe trimestral</label>
                    <input
                      type="date"
                      id="secondReport"
                      className="input"
                      value={formData.reportDeadlines[1]}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        reportDeadlines: [
                          prev.reportDeadlines[0],
                          e.target.value,
                          prev.reportDeadlines[2]
                        ]
                      }))}
                      required
                    />
                  </div>
                  <div>
                    <label className="label" htmlFor="finalReport">Informe final</label>
                    <input
                      type="date"
                      id="finalReport"
                      className="input"
                      value={formData.reportDeadlines[2]}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        reportDeadlines: [
                          prev.reportDeadlines[0],
                          prev.reportDeadlines[1],
                          e.target.value
                        ]
                      }))}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingPeriod ? 'Guardar cambios' : 'Crear período'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Periods List */}
      <div className="grid gap-6">
        {periods.map((period) => (
          <div key={period.id} className="card">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900">{period.name}</h3>
                <p className="text-sm text-gray-500">
                  {new Date(period.startDate).toLocaleDateString()} - {new Date(period.endDate).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                {period.isActive && (
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                    Activo
                  </span>
                )}
                <button
                  className="btn btn-secondary"
                  onClick={() => {
                    setEditingPeriod(period);
                    setIsModalOpen(true);
                  }}
                >
                  Editar
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <div className="flex items-center space-x-1 bg-blue-50 text-blue-700 px-2 py-1 rounded-md text-sm">
                <Calendar className="h-4 w-4" />
                <span>Presentación hasta: {new Date(period.submissionDeadline).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center space-x-1 bg-blue-50 text-blue-700 px-2 py-1 rounded-md text-sm">
                <Clock className="h-4 w-4" />
                <span>1º Trimestre: {new Date(period.reportDeadlines[0]).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center space-x-1 bg-blue-50 text-blue-700 px-2 py-1 rounded-md text-sm">
                <Clock className="h-4 w-4" />
                <span>2º Trimestre: {new Date(period.reportDeadlines[1]).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center space-x-1 bg-blue-50 text-blue-700 px-2 py-1 rounded-md text-sm">
                <Clock className="h-4 w-4" />
                <span>Final: {new Date(period.reportDeadlines[2]).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}