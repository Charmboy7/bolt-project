import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Area } from '../../../types/area';
import { AreaList } from './AreaList';
import { AreaForm } from './AreaForm';
import { Button } from '../../Button';
import { useAreas } from '../../../hooks/useAreas';

export function AreasManager() {
  const { areas, createArea, updateArea, deleteArea, isLoading } = useAreas();
  const [editingArea, setEditingArea] = useState<Area | null>(null);
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = async (data: { name: string; color: string }) => {
    try {
      if (editingArea) {
        await updateArea(editingArea.id, data);
      } else {
        await createArea(data.name, data.color);
      }
      setShowForm(false);
      setEditingArea(null);
    } catch (err) {
      console.error('Error saving area:', err);
    }
  };

  const handleDelete = async (area: Area) => {
    try {
      await deleteArea(area.id);
    } catch (err) {
      console.error('Error deleting area:', err);
      alert(err instanceof Error ? err.message : 'Error deleting area');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-900">Areas</h2>
        <button
          onClick={() => {
            setEditingArea(null);
            setShowForm(true);
          }}
          className="inline-flex items-center px-1.5 py-0.5 text-xs font-medium rounded bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <Plus size={10} className="mr-0.5" />
          Add
        </button>
      </div>

      {showForm ? (
        <div className="bg-white p-4 rounded-lg shadow">
          <AreaForm
            area={editingArea ?? undefined}
            onSubmit={handleSubmit}
            onCancel={() => {
              setShowForm(false);
              setEditingArea(null);
            }}
            isLoading={isLoading}
          />
        </div>
      ) : (
        <AreaList
          areas={areas}
          onEdit={(area) => {
            setEditingArea(area);
            setShowForm(true);
          }}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}