import React from 'react';
import { useAreas } from '../../hooks/useAreas';

interface AreaSelectProps {
  value: string | null;
  onChange: (areaId: string | null) => void;
}

export function AreaSelect({ value, onChange }: AreaSelectProps) {
  const { areas } = useAreas();

  return (
    <select
      value={value || ''}
      onChange={(e) => onChange(e.target.value || null)}
      className="w-full px-2 py-1 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
    >
      <option value="">No Area</option>
      {areas.map((area) => (
        <option key={area.id} value={area.id}>
          {area.name}
        </option>
      ))}
    </select>
  );
}