'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { User, LogOut, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface AccountMenuItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  divider?: boolean;
}

interface AccountMenuProps {
  user?: {
    name: string;
    email?: string;
    avatar?: string;
  };
  menuItems: AccountMenuItem[];
  onSignOut?: () => void;
  className?: string;
}

export function AccountMenu({
  user,
  menuItems,
  onSignOut,
  className,
}: Readonly<AccountMenuProps>) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleItemClick = (item: AccountMenuItem) => {
    if (item.onClick) {
      item.onClick();
    }
    setIsOpen(false);
  };

  return (
    <div
      ref={dropdownRef}
      data-component="AccountMenu"
      className={cn('relative', className)}
    >
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-full transition-colors"
        aria-label="Account menu"
        aria-expanded={isOpen}
      >
        {user?.avatar ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={user.avatar}
            alt={user.name}
            className="w-8 h-8 rounded-full object-cover"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
            <User className="w-5 h-5 text-gray-600" />
          </div>
        )}
        <ChevronDown
          className={cn(
            'w-4 h-4 text-gray-600 transition-transform hidden md:block',
            isOpen && 'rotate-180'
          )}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          data-component="AccountMenu.Dropdown"
          className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200"
        >
          {/* User Info */}
          {user && (
            <>
              <div className="px-4 py-3 border-b border-gray-200">
                <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                {user.email && (
                  <p className="text-xs text-gray-500 mt-0.5">{user.email}</p>
                )}
              </div>
            </>
          )}

          {/* Menu Items */}
          <div className="py-1">
            {menuItems.map((item, index) => {
              if (item.divider) {
                return (
                  <div
                    key={`divider-${index}`}
                    className="my-1 border-t border-gray-200"
                  />
                );
              }

              if (item.href) {
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </Link>
                );
              }

              return (
                <button
                  key={item.label}
                  onClick={() => handleItemClick(item)}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors text-left"
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              );
            })}

            {/* Sign Out */}
            {onSignOut && (
              <>
                <div className="my-1 border-t border-gray-200" />
                <button
                  onClick={() => {
                    onSignOut();
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors text-left"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign out</span>
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

