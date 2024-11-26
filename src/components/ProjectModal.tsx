import React, { useState } from 'react';
import { X, Plus, Trash2, Upload } from 'lucide-react';
import type { Project } from '../types';

type ProjectModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (project: FormData) => void;
};

export default function ProjectModal({ isOpen, onClose, onSubmit }: ProjectModalProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    objectives: [''],
    resources: [''],
    status: 'borrador' as Project['status'],
  });
  const [files, setFiles] = useState<File[]>([]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newFiles = Array.from(event.target.files);
      setFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const formDataToSend = new FormData();
    formDataToSend.append('title', formData.title);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('objectives', JSON.stringify(formData.objectives.filter(Boolean)));
    formDataToSend.append('resources', JSON.stringify(formData.resources.filter(Boolean)));
    formDataToSend.append('status', formData.status);

    files.forEach(file => {
      formDataToSend.append('attachments', file);
    });

    onSubmit(formDataToSend);
    onClose();
    setStep(1);
    setFormData({
      title: '',
      description: '',
      objectives: [''],
      resources: [''],
      status: 'borrador',
    });
    setFiles([]);
  };

  const addField = (field: 'objectives' | 'resources') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], ''],
    }));
  };

  const removeField = (field: 'objectives' | 'resources', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const updateField = (field: 'objectives' | 'resources', index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => (i === index ? value : item)),
    }));
  };

  if (!isOpen) return null;

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <div>
              <label className="label" htmlFor="title">
                Título del proyecto
              </label>
              <input
                id="title"
                type="text"
                className="input"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Ej: Innovación en el aula digital"
              />
            </div>
            <div>
              <label className="label" htmlFor="description">
                Descripción
              </label>
              <textarea
                id="description"
                className="input min-h-[100px]"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe brevemente el proyecto..."
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div>
              <label className="label">Objetivos</label>
              {formData.objectives.map((objective, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    className="input flex-1"
                    value={objective}
                    onChange={(e) => updateField('objectives', index, e.target.value)}
                    placeholder="Añade un objetivo..."
                  />
                  {formData.objectives.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeField('objectives', index)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-md"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => addField('objectives')}
                className="btn btn-secondary mt-2"
              >
                <Plus className="h-4 w-4 mr-2" />
                Añadir objetivo
              </button>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div>
              <label className="label">Recursos necesarios</label>
              {formData.resources.map((resource, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    className="input flex-1"
                    value={resource}
                    onChange={(e) => updateField('resources', index, e.target.value)}
                    placeholder="Añade un recurso..."
                  />
                  {formData.resources.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeField('resources', index)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-md"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => addField('resources')}
                className="btn btn-secondary mt-2"
              >
                <Plus className="h-4 w-4 mr-2" />
                Añadir recurso
              </button>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <div>
              <label className="label">Documentos adjuntos</label>
              <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-blue-500 border-gray-300">
                <input
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-upload"
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600">
                    Haz clic para seleccionar archivos
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    PDF, Word, Excel e imágenes (máx. 10MB por archivo)
                  </p>
                </label>
              </div>

              {files.length > 0 && (
                <div className="mt-4 space-y-2">
                  {files.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-600">{file.name}</span>
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Nuevo Proyecto</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-6">
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <div className="flex space-x-4">
                  {[1, 2, 3, 4].map((stepNumber) => (
                    <div
                      key={stepNumber}
                      className={`flex items-center ${
                        stepNumber < 4 ? 'flex-1' : ''
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center border-2 
                        ${
                          step >= stepNumber
                            ? 'border-blue-600 bg-blue-600 text-white'
                            : 'border-gray-300 text-gray-500'
                        }`}
                      >
                        {stepNumber}
                      </div>
                      {stepNumber < 4 && (
                        <div
                          className={`h-1 w-12 mx-2 ${
                            step > stepNumber
                              ? 'bg-blue-600'
                              : 'bg-gray-200'
                          }`}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {renderStep()}
          </div>

          <div className="flex items-center justify-between p-6 border-t bg-gray-50">
            <button
              type="button"
              onClick={() => setStep(prev => prev - 1)}
              className="btn btn-secondary"
              disabled={step === 1}
            >
              Anterior
            </button>
            {step < 4 ? (
              <button
                type="button"
                onClick={() => setStep(prev => prev + 1)}
                className="btn btn-primary"
                disabled={
                  (step === 1 && (!formData.title || !formData.description)) ||
                  (step === 2 && !formData.objectives.some(Boolean)) ||
                  (step === 3 && !formData.resources.some(Boolean))
                }
              >
                Siguiente
              </button>
            ) : (
              <button
                type="submit"
                className="btn btn-primary"
              >
                Crear Proyecto
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}