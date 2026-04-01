import React from 'react';
import { Area } from '../../../types/area';
import { AreaListItem } from './AreaListItem';

interface AreaListProps {
  areas: Area[];
  onEdit: (area: Area) => void;
  onDelete: (area: Area) => void;
}

export function AreaList({ areas, onEdit, onDelete }: AreaListProps) {
  return (
    <div className="space-y-2">
      {areas.map((area) => (
        <AreaListItem
          key={area.id}
          area={area}
          onEdit={() => onEdit(area)}
          onDelete={() => onDelete(area)}
        />
      ))}
    </div>
  );
}