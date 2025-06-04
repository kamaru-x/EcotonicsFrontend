'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

const Header = () => {
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Reset mobile menu state when pathname changes
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [pathname]);

    const toggleMobileMenu = () => {
        const newState = !isMobileMenuOpen;
        setIsMobileMenuOpen(newState);
        // Dispatch custom event for sidebar
        window.dispatchEvent(new CustomEvent('toggleMobileMenu', { detail: newState }));
    };

    // Generate breadcrumb items
    const generateBreadcrumbs = () => {
        const paths = pathname.split('/').filter(Boolean);
        const breadcrumbs = paths.map((path, index) => {
            const href = `/${paths.slice(0, index + 1).join('/')}`;
            let label = path.charAt(0).toUpperCase() + path.slice(1);
            
            // Customize labels for specific paths
            const labelMap: { [key: string]: string } = {
                'service': 'Services',
                'workforce': 'Workforce',
                'categories': 'Categories',
                'services': 'Service List',
                'departments': 'Departments',
                'designations': 'Designations',
                'staffs': 'Staff List',
                'customers': 'Customers',
                'oncalls': 'On Calls',
                'attendance': 'Attendance',
                'masters': 'Masters',
                'dashboard': 'Dashboard'
            };
            
            // Handle detail pages
            if (path === '[slug]' || path === '[id]') {
                label = 'Details';
            } else {
                label = labelMap[path] || label;
            }

            const isLast = index === paths.length - 1;
            return { href, label, isLast };
        });

        return breadcrumbs;
    };

    const breadcrumbs = generateBreadcrumbs();

    return (
        <nav className="bg-white dark:bg-gray-800 rounded-xl shadow-md fixed top-5 right-4 left-4 lg:right-5 lg:left-[calc(16rem+2.5rem)] z-[40]">
            <div className="flex items-center h-16 px-4 lg:px-6">
                {/* Left Section with Navigation */}
                <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
                    <button 
                        onClick={toggleMobileMenu}
                        className="lg:hidden p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                        <i className={`fas ${isMobileMenuOpen ? 'fa-times' : 'fa-bars'} text-lg`}></i>
                    </button>
                    <div className="hidden lg:flex items-center space-x-2">
                        <span className="text-gray-600 dark:text-gray-300">Dashboard</span>
                        {breadcrumbs.map((crumb, index) => (
                            <div key={index} className="flex items-center space-x-2">
                                <span className="text-gray-400 dark:text-gray-500">/</span>
                                <span className="text-gray-600 dark:text-gray-300">
                                    {crumb.label}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Section with Search and Icons */}
                <div className="ml-auto flex items-center space-x-4 lg:space-x-6 w-full lg:w-auto">
                    <div className="relative flex-1 lg:flex-none lg:w-64 mx-4 lg:mx-0">
                        <input
                            type="text"
                            placeholder="Search..."
                            className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-700/50 text-gray-600 dark:text-gray-300 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 border border-gray-200 dark:border-gray-700"
                        />
                        <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500"></i>
                    </div>
                    <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 hidden lg:block"></div>
                    <div className="flex items-center space-x-4 lg:space-x-6">
                        <button className="relative inline-flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 focus:outline-none transition-colors">
                            <i className="fas fa-bell text-xl"></i>
                            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">3</span>
                        </button>
                        <button className="inline-flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 focus:outline-none transition-colors">
                            <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                                <i className="fas fa-user text-sm"></i>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Header;
