import React from 'react';

interface ResizeHandleProps {
  onResizeStart: (e: React.MouseEvent) => void;
  isResizing: boolean;
}

export function ResizeHandle({ onResizeStart, isResizing }: ResizeHandleProps) {
  return (
    <div
      className={`
        absolute right-0 top-0 bottom-0 
        w-px cursor-col-resize
        group-hover:bg-gray-300
        ${isResizing ? 'bg-gray-400' : 'bg-gray-200'}
      `}
      onMouseDown={onResizeStart}
      onClick={(e) => e.stopPropagation()}
    />
  );
}