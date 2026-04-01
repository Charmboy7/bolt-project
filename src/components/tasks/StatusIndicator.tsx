import React from 'react';

interface StatusIndicatorProps {
  isCompleted: boolean;
  dueDate: string | null;
}

export function StatusIndicator({ isCompleted, dueDate }: StatusIndicatorProps) {
  if (isCompleted) {
    return <div className="w-3 h-3 rounded-full bg-green-500" />;
  }

  if (!dueDate) {
    return <div className="w-3 h-3 rounded-full bg-gray-300" />;
  }

  const now = new Date();
  const due = new Date(dueDate);
  const diffDays = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return <div className="w-3 h-3 rounded-full bg-red-500" />;
  }

  if (diffDays <= 2) {
    return <div className="w-3 h-3 rounded-full bg-yellow-500" />;
  }

  return <div className="w-3 h-3 rounded-full bg-green-500" />;
}