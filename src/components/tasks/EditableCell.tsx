import React, { useState, useEffect, useRef } from 'react';

interface EditableCellProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
}

export function EditableCell({ 
  value, 
  onChange, 
  placeholder = '', 
  autoFocus = false 
}: EditableCellProps) {
  const [isEditing, setIsEditing] = useState(autoFocus);
  const [editValue, setEditValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select(); // Select the text instead of clearing it
    }
  }, [isEditing]);

  // Update editValue when value prop changes
  useEffect(() => {
    setEditValue(value);
  }, [value]);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
    const trimmedValue = editValue.trim();
    if (trimmedValue !== value) {
      onChange(trimmedValue);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleBlur();
    } else if (e.key === 'Escape') {
      setEditValue(value);
      setIsEditing(false);
    }
  };

  if (isEditing) {
    return (
      <input
        ref={inputRef}
        type="text"
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="w-full px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
    );
  }

  return (
    <div
      onDoubleClick={handleDoubleClick}
      onClick={() => setIsEditing(true)}
      className="cursor-text"
    >
      {value || <span className="text-gray-400">{placeholder}</span>}
    </div>
  );
}