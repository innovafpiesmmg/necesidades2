import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  Mail, 
  Shield, 
  Database,
  Save,
  FileSpreadsheet,
  Palette,
  Globe,
  Plus,
  Trash2,
  Copy
} from 'lucide-react';

// ... (previous imports and type definitions)

export default function Settings() {
  // ... (previous state)

  const [authSettings, setAuthSettings] = useState({
    registrationEnabled: false,
    requireAuthCode: true
  });

  const [authCodes, setAuthCodes] = useState<Array<{
    id: number;
    code: string;
    role: string;
    used: boolean;
    used_by_name?: string;
    created_at: string;
    expires_at?: string;
  }>>([]);

  const [newCode, setNewCode] = useState({
    role: 'profesor',
    expiresIn: '30' // days
  });

  useEffect(() => {
    fetchAuthSettings();
    fetchAuthCodes();
  }, []);

  const fetchAuthSettings = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/auth/settings', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setAuthSettings(data);
      }
    } catch (error) {
      console.error('Error fetching auth settings:', error);
    }
  };

  const fetchAuthCodes = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/auth/codes', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setAuthCodes(data);
      }
    } catch (error) {
      console.error('Error fetching auth codes:', error);
    }
  };

  const handleAuthSettingsChange = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/auth/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(authSettings)
      });
      if (response.ok) {
        // Show success message
      }
    } catch (error) {
      console.error('Error updating auth settings:', error);
    }
  };

  const generateAuthCode = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/auth/codes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(newCode)
      });
      if (response.ok) {
        const data = await response.json();
        setAuthCodes(prev => [data, ...prev]);
      }
    } catch (error) {
      console.error('Error generating auth code:', error);
    }
  };

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    // Show success message
  };

  // Add registration section to renderTabContent
  const renderTabContent = () => {
    switch (activeTab) {
      // ... (previous cases)

      case 'security':
        return (
          <div className="space-y-6">
            <div className="card">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Registro de usuarios</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Permitir registro</p>
                    <p className="text-sm text-gray-500">Habilitar el registro de nuevos usuarios</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={authSettings.registrationEnabled}
                      onChange={(e) => setAuthSettings(prev => ({
                        ...prev,
                        registrationEnabled: e.target.checked
                      }))}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Requerir código de autorización</p>
                    <p className="text-sm text-gray-500">Los usuarios necesitarán un código para registrarse</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={authSettings.requireAuthCode}
                      onChange={(e) => setAuthSettings(prev => ({
                        ...prev,
                        requireAuthCode: e.target.checked
                      }))}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <button
                  onClick={handleAuthSettingsChange}
                  className="btn btn-primary"
                >
                  Guardar configuración
                </button>
              </div>
            </div>

            <div className="card">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Códigos de autorización</h3>
                <button
                  onClick={generateAuthCode}
                  className="btn btn-primary flex items-center space-x-2"
                >
                  <Plus className="h-5 w-5" />
                  <span>Generar código</span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="label" htmlFor="role">Rol</label>
                  <select
                    id="role"
                    className="input"
                    value={newCode.role}
                    onChange={(e) => setNewCode(prev => ({ ...prev, role: e.target.value }))}
                  >
                    <option value="profesor">Profesor</option>
                    <option value="director">Director</option>
                    <option value="admin">Administrador</option>
                  </select>
                </div>
                <div>
                  <label className="label" htmlFor="expiresIn">Expira en (días)</label>
                  <input
                    type="number"
                    id="expiresIn"
                    className="input"
                    value={newCode.expiresIn}
                    onChange={(e) => setNewCode(prev => ({ ...prev, expiresIn: e.target.value }))}
                    min="1"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Código
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Rol
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Estado
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Expira
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {authCodes.map((code) => (
                      <tr key={code.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <code className="bg-gray-100 px-2 py-1 rounded">{code.code}</code>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="capitalize">{code.role}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {code.used ? (
                            <span className="text-gray-500">
                              Usado por {code.used_by_name}
                            </span>
                          ) : (
                            <span className="text-green-600">Disponible</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {code.expires_at ? (
                            new Date(code.expires_at).toLocaleDateString()
                          ) : (
                            'Nunca'
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {!code.used && (
                            <button
                              onClick={() => copyToClipboard(code.code)}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              <Copy className="h-5 w-5" />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      // ... (rest of the cases)
    }
  };

  // ... (rest of the component)
}