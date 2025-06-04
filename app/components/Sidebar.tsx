'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

const Sidebar = () => {
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isServicesOpen, setIsServicesOpen] = useState(false);
    const [isWorkforceOpen, setIsWorkforceOpen] = useState(false);

    // Handle mobile menu toggle
    useEffect(() => {
        const handleToggleMobileMenu = (event: CustomEvent) => {
            setIsMobileMenuOpen(event.detail);
        };

        window.addEventListener('toggleMobileMenu', handleToggleMobileMenu as EventListener);
        return () => {
            window.removeEventListener('toggleMobileMenu', handleToggleMobileMenu as EventListener);
        };
    }, []);

    // Reset mobile menu state when pathname changes
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [pathname]);

    // Auto-expand dropdowns based on current path
    useEffect(() => {
        setIsServicesOpen(pathname.startsWith('/service'));
        setIsWorkforceOpen(pathname.startsWith('/workforce'));
    }, [pathname]);

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
        window.dispatchEvent(new CustomEvent('toggleMobileMenu', { detail: false }));
    };

    const toggleServices = () => {
        setIsServicesOpen(!isServicesOpen);
    };

    const toggleWorkforce = () => {
        setIsWorkforceOpen(!isWorkforceOpen);
    };

    // Helper function to check if a path is active
    const isActive = (path: string, exact: boolean = false) => {
        if (exact) {
            return pathname === path;
        }
        // Handle detail pages
        if (pathname.includes('/[slug]') || pathname.includes('/[id]')) {
            return pathname.startsWith(path);
        }
        return pathname.startsWith(path);
    };

    // Helper function to get active classes
    const getActiveClasses = (path: string, exact: boolean = false) => {
        return isActive(path, exact)
            ? 'bg-blue-50 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400'
            : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50';
    };

    return (
        <>
            {/* Overlay for mobile */}
            <div 
                className={`lg:hidden fixed inset-0 bg-black transition-opacity duration-300 z-40 ${
                    isMobileMenuOpen ? 'opacity-50' : 'opacity-0 pointer-events-none'
                }`}
                onClick={closeMobileMenu}
            />

            {/* Sidebar */}
            <aside className={`fixed top-5 left-4 lg:left-5 p-4 w-[calc(100%-2rem)] lg:w-64 h-[calc(100vh-2.5rem)] bg-white dark:bg-gray-800 rounded-xl shadow-md z-50 transition-all duration-300 ease-in-out ${
                isMobileMenuOpen ? 'translate-x-0 opacity-100' : '-translate-x-full lg:translate-x-0 opacity-0 lg:opacity-100'
            }`}>
                <div className="flex flex-col h-full">
                    <div className="flex items-center justify-center mb-8">
                        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Ecotonics</h1>
                    </div>

                    <div className="flex-1 space-y-2">
                        <Link
                            href="/dashboard"
                            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${getActiveClasses('/dashboard', true)}`}
                            onClick={closeMobileMenu}
                        >
                            <i className="fas fa-chart-line w-5"></i>
                            <span>Dashboard</span>
                        </Link>

                        {/* Services Dropdown */}
                        <div className="relative">
                            <button
                                onClick={toggleServices}
                                className={`w-full flex items-center justify-between space-x-3 px-4 py-3 rounded-lg transition-colors ${getActiveClasses('/service')}`}
                            >
                                <div className="flex items-center space-x-3">
                                    <i className="fas fa-gears w-5"></i>
                                    <span>Services</span>
                                </div>
                                <i className={`fas fa-chevron-${isServicesOpen ? 'up' : 'down'} transition-transform duration-200`}></i>
                            </button>
                            
                            {/* Dropdown Menu */}
                            <div className={`pl-12 space-y-1 mt-1 transition-all duration-200 ${
                                isServicesOpen ? 'opacity-100 max-h-48' : 'opacity-0 max-h-0 overflow-hidden'
                            }`}>
                                <Link
                                    href="/service/categories"
                                    className={`flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors ${getActiveClasses('/service/categories')}`}
                                    onClick={closeMobileMenu}
                                >
                                    <i className="fas fa-tags w-5"></i>
                                    <span>Categories</span>
                                </Link>
                                <Link
                                    href="/service/services"
                                    className={`flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors ${getActiveClasses('/service/services')}`}
                                    onClick={closeMobileMenu}
                                >
                                    <i className="fas fa-list w-5"></i>
                                    <span>Services</span>
                                </Link>
                            </div>
                        </div>

                        {/* Workforce Dropdown */}
                        <div className="relative">
                            <button
                                onClick={toggleWorkforce}
                                className={`w-full flex items-center justify-between space-x-3 px-4 py-3 rounded-lg transition-colors ${getActiveClasses('/workforce')}`}
                            >
                                <div className="flex items-center space-x-3">
                                    <i className="fas fa-users w-5"></i>
                                    <span>Workforce</span>
                                </div>
                                <i className={`fas fa-chevron-${isWorkforceOpen ? 'up' : 'down'} transition-transform duration-200`}></i>
                            </button>
                            
                            {/* Dropdown Menu */}
                            <div className={`pl-12 space-y-1 mt-1 transition-all duration-200 ${
                                isWorkforceOpen ? 'opacity-100 max-h-48' : 'opacity-0 max-h-0 overflow-hidden'
                            }`}>
                                <Link
                                    href="/workforce/departments"
                                    className={`flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors ${getActiveClasses('/workforce/departments')}`}
                                    onClick={closeMobileMenu}
                                >
                                    <i className="fas fa-building w-5"></i>
                                    <span>Departments</span>
                                </Link>
                                <Link
                                    href="/workforce/designations"
                                    className={`flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors ${getActiveClasses('/workforce/designations')}`}
                                    onClick={closeMobileMenu}
                                >
                                    <i className="fas fa-list w-5"></i>
                                    <span>Designations</span>
                                </Link>
                                <Link
                                    href="/workforce/staffs"
                                    className={`flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors ${getActiveClasses('/workforce/staffs')}`}
                                    onClick={closeMobileMenu}
                                >
                                    <i className="fas fa-users w-5"></i>
                                    <span>Staffs</span>
                                </Link>
                            </div>
                        </div>

                        {/* Customers Link */}
                        <Link
                            href="/customers"
                            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${getActiveClasses('/customers')}`}
                            onClick={closeMobileMenu}
                        >
                            <i className="fas fa-users w-5"></i>
                            <span>Customers</span>
                        </Link>

                        {/* Oncalls Link */}
                        <Link
                            href="/oncalls"
                            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${getActiveClasses('/oncalls')}`}
                            onClick={closeMobileMenu}
                        >
                            <i className="fas fa-phone w-5"></i>
                            <span>On Calls</span>
                        </Link>

                        {/* Attendance Link */}
                        <Link
                            href="/attendance"
                            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${getActiveClasses('/attendance')}`}
                            onClick={closeMobileMenu}
                        >
                            <i className="fas fa-clock w-5"></i>
                            <span>Attendance</span>
                        </Link>

                        {/* Masters Link */}
                        <Link
                            href="/masters"
                            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${getActiveClasses('/masters')}`}
                            onClick={closeMobileMenu}
                        >
                            <i className="fas fa-gear w-5"></i>
                            <span>Masters</span>
                        </Link>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;