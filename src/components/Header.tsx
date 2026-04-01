import React from 'react';
import { Link } from 'react-router-dom';
import { SettingsMenu } from './settings/SettingsMenu';

export function Header() {
  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-gray-900">
          Task Manager
        </Link>
        <SettingsMenu />
      </div>
    </header>
  );
}