'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

const Header = () => {
    const pathname = usePathname();
    const currentPage = pathname.split('/')[1] || 'dashboard';
    const pageTitle = currentPage.charAt(0).toUpperCase() + currentPage.slice(1);
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
                        <Link href="/dashboard" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                            Application
                        </Link>
                        <span className="text-gray-400 dark:text-gray-500">/</span>
                        <span className="font-medium text-gray-800 dark:text-gray-200">{pageTitle}</span>
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
