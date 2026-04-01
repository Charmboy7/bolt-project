import { useState, useEffect } from 'react';
import { Area } from '../types/area';
import * as areasApi from '../lib/areas';

export function useAreas() {
  const [areas, setAreas] = useState<Area[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadAreas = async () => {
    try {
      setIsLoading(true);
      const data = await areasApi.getAreas();
      setAreas(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load areas');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAreas();
  }, []);

  const createArea = async (name: string, description?: string) => {
    try {
      setIsLoading(true);
      const newArea = await areasApi.createArea(name, description);
      setAreas(prev => [...prev, newArea]);
      return newArea;
    } catch (err) {
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateArea = async (id: string, updates: Partial<Area>) => {
    try {
      setIsLoading(true);
      const updatedArea = await areasApi.updateArea(id, updates);
      setAreas(prev => prev.map(area => 
        area.id === id ? updatedArea : area
      ));
      return updatedArea;
    } catch (err) {
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteArea = async (id: string) => {
    try {
      setIsLoading(true);
      await areasApi.deleteArea(id);
      setAreas(prev => prev.filter(area => area.id !== id));
    } catch (err) {
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    areas,
    isLoading,
    error,
    createArea,
    updateArea,
    deleteArea,
  };
}