import React from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { SortDirection } from './types';

interface SortIndicatorProps {
  direction?: SortDirection;
}

export function SortIndicator({ direction }: SortIndicatorProps) {
  if (!direction) return null;
  
  return direction === 'asc' ? (
    <ChevronUp className="w-4 h-4 ml-1" />
  ) : (
    <ChevronDown className="w-4 h-4 ml-1" />
  );
}