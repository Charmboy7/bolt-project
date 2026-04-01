import React, { useState, useEffect } from 'react';
import { Area } from '../../../types/area';
import { Input } from '../../Input';
import { Button } from '../../Button';

interface AreaFormProps {
  area?: Area;
  onSubmit: (data: { name: string; color: string }) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function AreaForm({ area, onSubmit, onCancel, isLoading }: AreaFormProps) {
  const [name, setName] = useState(area?.name ?? '');
  const [color, setColor] = useState(area?.color ?? '#E5E7EB');

  useEffect(() => {
    if (area) {
      setName(area.name);
      setColor(area.color);
    }
  }, [area]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ name, color });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex gap-4 items-start">
        <div className="flex-1">
          <Input
            label="Area Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Color
          </label>
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="h-10 w-10 p-0 border rounded cursor-pointer"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          isLoading={isLoading}
        >
          {area ? 'Update' : 'Create'} Area
        </Button>
      </div>
    </form>
  );
}