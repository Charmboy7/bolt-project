import React from 'react';
import { Menu } from '@headlessui/react';
import { Settings, Calendar, List } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export function SettingsMenu() {
  const { logout } = useAuth();

  const menuItems = [
    { to: '/settings/areas', icon: List, label: 'Areas' },
    { to: '/settings/calendar', icon: Calendar, label: 'Calendar Integration' }
  ];

  return (
    <Menu as="div" className="relative z-50">
      <Menu.Button className="flex items-center p-2 rounded-md hover:bg-gray-100">
        <Settings className="h-5 w-5" />
      </Menu.Button>
      <Menu.Items className="absolute right-0 w-56 mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
        <div className="px-1 py-1 bg-white">
          {menuItems.map(({ to, icon: Icon, label }) => (
            <Menu.Item key={to}>
              {({ active }) => (
                <Link
                  to={to}
                  className={`${
                    active ? 'bg-indigo-500 text-white' : 'text-gray-900'
                  } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                >
                  <Icon className="w-5 h-5 mr-2" />
                  {label}
                </Link>
              )}
            </Menu.Item>
          ))}
          <Menu.Item>
            {({ active }) => (
              <button
                onClick={logout}
                className={`${
                  active ? 'bg-red-500 text-white' : 'text-red-600'
                } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
              >
                <Settings className="w-5 h-5 mr-2" />
                Sign Out
              </button>
            )}
          </Menu.Item>
        </div>
      </Menu.Items>
    </Menu>
  );
}