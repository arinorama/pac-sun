'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { useCartStore } from '@/store/useCartStore';
import { useUIStore } from '@/store/useUIStore';
import { LanguageSwitcher } from '@/components/molecules/LanguageSwitcher';
import { CurrencySwitcher } from '@/components/molecules/CurrencySwitcher';
import { Button } from '@/components/atoms/Button';
import { ShoppingCart, Menu, User, Search, Camera, Heart } from 'lucide-react';
import type { Entry, Asset } from 'contentful';

// Types for Contentful header data
interface NavigationMenuItemFields {
  label: string;
  link: string;
  description?: string;
  icon?: string;
  isLeadSection?: boolean;
  subItems?: Entry<NavigationMenuItemFields>[];
  order?: number;
  isActive?: boolean;
}

interface NavigationMenuFields {
  label: string;
  slug: string;
  link?: string;
  hasDropdown?: boolean;
  dropdownItems?: Entry<NavigationMenuItemFields>[];
  highlightColor?: string;
  order?: number;
  isActive?: boolean;
}

interface SiteHeaderFields {
  title: string;
  logo?: Asset;
  logoAlt?: string;
  navigationMenus?: Entry<NavigationMenuFields>[];
}

interface HeaderProps {
  headerData?: Entry<SiteHeaderFields>;
}

export function Header({ headerData }: HeaderProps) {
  const { totalItems } = useCartStore();
  const { openCart, toggleMobileMenu } = useUIStore();
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  const handleClick = (menu: string) => {
    setActiveDropdown(activeDropdown === menu ? null : menu);
  };

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };

    if (activeDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [activeDropdown]);

  // Extract header fields
  const logo = headerData?.fields?.logo;
  const logoUrl = logo?.fields?.file?.url ? `https:${logo.fields.file.url}` : '/pacsun-logo.svg';
  const logoAlt = headerData?.fields?.logoAlt || 'PacSun Logo';
  const navigationMenus = headerData?.fields?.navigationMenus || [];

  // Sort menus by order
  const sortedMenus = [...navigationMenus].sort((a, b) => {
    const orderA = a.fields?.order || 0;
    const orderB = b.fields?.order || 0;
    return orderA - orderB;
  });

  return (
    <header
      ref={headerRef}
      data-component="Header"
      className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white"
    >
      <nav className="bg-white">
        <div className="container-fluid px-4">
          <div className="grid grid-cols-12 items-center h-16">
            {/* Left Section: Menu Button + Navigation */}
            <div className="col-span-5 flex items-center h-full">
              <div className="flex items-center h-full">
                <button
                  data-component="Header.MobileMenuButton"
                  className="xl:hidden px-2 md:px-4"
                  onClick={toggleMobileMenu}
                  aria-label="Toggle navigation"
                  type="button"
                >
                  <svg
                    className="w-5 h-4"
                    width="20"
                    height="15"
                    viewBox="0 0 20 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M1 7.49999H19.0952"
                      stroke="#111111"
                      strokeWidth="1.1"
                      strokeLinecap="round"
                    />
                    <path
                      d="M1 14.3182H19.0952"
                      stroke="#111111"
                      strokeWidth="1.1"
                      strokeLinecap="round"
                    />
                    <path
                      d="M1 0.681818H19.0952"
                      stroke="#111111"
                      strokeWidth="1.1"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>

                {/* Desktop Navigation */}
                <nav
                  data-component="Header.Nav"
                  className="hidden xl:flex items-center ml-4"
                >
                  <ul className="flex items-center gap-0" role="menu">
                    {sortedMenus.map((menu) => {
                      const menuFields = menu.fields;
                      if (!menuFields?.isActive) return null;

                      const slug = menuFields.slug;
                      const label = menuFields.label;
                      const link = menuFields.link;
                      const hasDropdown = menuFields.hasDropdown;
                      const dropdownItems = menuFields.dropdownItems || [];
                      const highlightColor = menuFields.highlightColor;

                      // Determine text color based on highlight
                      const textColorClass =
                        highlightColor === 'red'
                          ? 'text-red-600 hover:text-red-700'
                          : 'text-gray-900 hover:text-gray-600';

                      if (hasDropdown && dropdownItems.length > 0) {
                        // Dropdown menu
                        return (
                          <li key={slug} className="nav-item">
                            <button
                              className={`px-2.5 py-2 text-[0.75vw] font-medium ${textColorClass} transition-colors tracking-wide`}
                              role="button"
                              aria-haspopup="true"
                              aria-expanded={activeDropdown === slug}
                              onClick={() => handleClick(slug)}
                            >
                              {label}
                            </button>
                            {activeDropdown === slug && (
                              <div className="absolute left-0 right-0 top-full bg-white border-t border-gray-200 shadow-lg z-50">
                                <div className="container-fluid px-8 py-8 max-w-7xl mx-auto">
                                  <ul className="space-y-3">
                                    {dropdownItems
                                      .sort((a, b) => {
                                        const orderA = a.fields?.order || 0;
                                        const orderB = b.fields?.order || 0;
                                        return orderA - orderB;
                                      })
                                      .map((item) => {
                                        if (!item.fields?.isActive) return null;
                                        return (
                                          <li key={item.sys.id}>
                                            <Link
                                              href={item.fields.link || '#'}
                                              className="text-[clamp(1rem,2.5vw,3rem)] font-medium text-gray-900 hover:text-gray-600 leading-tight block transition-colors"
                                              style={{ letterSpacing: '-0.75px' }}
                                            >
                                              {item.fields.label}
                                            </Link>
                                          </li>
                                        );
                                      })}
                                  </ul>
                                </div>
                              </div>
                            )}
                          </li>
                        );
                      } else {
                        // Simple link
                        return (
                          <li key={slug} className="nav-item">
                            <Link
                              href={link || '#'}
                              className={`px-2.5 py-2 text-[0.75vw] font-medium ${textColorClass} transition-colors tracking-wide block`}
                            >
                              {label}
                            </Link>
                          </li>
                        );
                      }
                    })}
                  </ul>
                </nav>
              </div>
            </div>

            {/* Center Section: Logo */}
            <div className="col-span-2 flex justify-center items-center h-full">
              <Link
                data-component="Header.Logo"
                href="/"
                className="logo-home flex items-center"
                title={logoAlt}
              >
                <img
                  src={logoUrl}
                  alt={logoAlt}
                  className="h-8 w-auto"
                />
              </Link>
            </div>

            {/* Right Section: Search + Icons */}
            <div className="col-span-5 flex justify-end items-center h-full gap-2">
              {/* Desktop Search */}
              <div className="hidden md:flex items-center">
                <div className="relative w-[200px]">
                  <input
                    type="text"
                    placeholder="Search"
                    className="w-full px-4 py-2 text-sm border-0 bg-gray-100 rounded-full focus:outline-none focus:ring-0 placeholder:text-gray-500"
                    aria-label="Search"
                  />
                  <button
                    type="submit"
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-200 rounded-full"
                    aria-label="Submit search"
                  >
                    <Search className="w-4 h-4 text-gray-900" />
                  </button>
                </div>
              </div>

              {/* Mobile Search Button */}
              <button
                className="md:hidden p-2 hover:bg-gray-100 rounded"
                onClick={() => setSearchOpen(!searchOpen)}
                aria-label="Toggle search"
              >
                <Search className="w-5 h-5 text-gray-900" />
              </button>

              {/* Camera/Photo */}
              <button
                className="hidden lg:flex p-2 hover:bg-gray-100 rounded items-center justify-center"
                aria-label="Photo"
              >
                <Camera className="w-5 h-5 text-gray-900" />
              </button>

              {/* Account */}
              <button
                className="hidden lg:flex p-2 hover:bg-gray-100 rounded items-center justify-center"
                aria-label="Account"
              >
                <User className="w-5 h-5 text-gray-900" />
              </button>

              {/* My Likes */}
              <button
                className="hidden lg:flex p-2 hover:bg-gray-100 rounded items-center justify-center"
                aria-label="My Likes"
              >
                <Heart className="w-5 h-5 text-gray-900" />
              </button>

              {/* Cart */}
              <Button
                data-component="Header.CartButton"
                variant="ghost"
                size="icon"
                onClick={openCart}
                aria-label="Shopping cart"
                className="relative hover:bg-gray-100"
              >
                <ShoppingCart className="h-5 w-5 text-gray-900" />
                {totalItems > 0 && (
                  <span
                    data-component="Header.CartCount"
                    className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
                  >
                    {totalItems}
                  </span>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {searchOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white px-4 py-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Search"
                className="w-full px-4 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-900"
                aria-label="Search"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1"
                aria-label="Submit search"
              >
                <Search className="w-4 h-4 text-gray-900" />
              </button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
