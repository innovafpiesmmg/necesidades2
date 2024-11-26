import React, { useState, useEffect } from 'react';
import { 
  FileCheck2, 
  Clock, 
  AlertCircle,
  TrendingUp,
  Calendar,
  BookOpen
} from 'lucide-react';
import { format } from 'date-fns';
import type { Project, Period } from '../types';
import { useAuth } from '../contexts/AuthContext';

export default function Dashboard() {
  const [activePeriod, setActivePeriod] = useState<Period | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      if (!token) return;

      try {
        setIsLoading(true);
        setError(null);

        const [periodResponse, projectsResponse] = await Promise.all([
          fetch('http://localhost:3000/api/periods/active', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }),
          fetch('http://localhost:3000/api/projects', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          })
        ]);

        if (!periodResponse.ok || !projectsResponse.ok) {
          throw new Error('Error fetching data');
        }

        const [periodData, projectsData] = await Promise.all([
          periodResponse.json(),
          projectsResponse.json()
        ]);

        setActivePeriod(periodData);
        setProjects(projectsData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError('Error al cargar los datos del panel');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [token]);

  // Rest of the component remains the same...
}