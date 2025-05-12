'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useApi } from '@/app/context/ApiContext'
import { toast } from 'react-toastify'

import OverviewCard from '@/app/components/elements/OverviewCard'
import ThemeToggle from '@/app/components/ThemeToggle'
import CategoriesTable from '@/app/components/service/CategoriesTable'
import CategoryForm from '@/app/components/service/CategoryForm'
import { Category } from '@/app/types/categories'

interface CategoryStats {
    total_categories: number;
    active_categories: number;
    inactive_categories: number;
}

const CategoriesPage = () => {
    const api = useApi()

    const [create, setCreate] = useState(false)
    const [editCategory, setEditCategory] = useState<Category | null>(null)
    const [categories, setCategories] = useState<Category[]>([])
    
    const [stats, setStats] = useState<CategoryStats>({
        total_categories: 0,
        active_categories: 0,
        inactive_categories: 0
    })

    const fetchCategories = useCallback(async () => {
        try {
            const response = await api.fetch(api.endpoints.listCategories);
            const result = await response.json();
            
            if (!response.ok) {
                throw new Error(result.message || 'Failed to fetch categories');
            }

            const data = result.data
            setCategories(data.categories)
            setStats({
                total_categories: data.total_categories,
                active_categories: data.active_categories,
                inactive_categories: data.inactive_categories
            })
        } catch (error) {
            console.error('Error fetching categories:', error)
            toast.error(error instanceof Error ? error.message : 'Failed to fetch categories')
        }
    }, [api])

    const handleEdit = (category: Category) => {
        setEditCategory(category);
        setCreate(true);
    }

    const handleCreate = () => {
        setEditCategory(null);
        setCreate(true);
    }

    const handleCancel = () => {
        setEditCategory(null);
        setCreate(false);
    }

    useEffect(() => {
        fetchCategories()
    }, [fetchCategories])

    return (
        <div className="min-h-screen mx-5">
            <div className="w-full">
                <div className="grid md:grid-cols-3 gap-6 mt-8">
                    <OverviewCard 
                        color="bg-gradient-to-r from-blue-400 to-blue-500" 
                        icon="fas fa-gear" 
                        title="Total Categories" 
                        value={stats.total_categories}
                    />
                    <OverviewCard 
                        color="bg-gradient-to-r from-green-400 to-green-500" 
                        icon="fas fa-check-circle" 
                        title="Active Categories" 
                        value={stats.active_categories}
                    />
                    <OverviewCard 
                        color="bg-gradient-to-r from-red-400 to-red-500" 
                        icon="fas fa-times-circle" 
                        title="Inactive Categories" 
                        value={stats.inactive_categories}
                    />
                </div>

                <div className='mt-8 pb-8'>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                            {create ? (editCategory ? 'Edit Category' : 'Create Category') : 'Service Categories'}
                        </h2>
                        {!create && (
                            <button 
                                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors duration-200"
                                onClick={handleCreate}
                            >
                                Add Category
                            </button>
                        )}
                    </div>
                    {create ? (
                        <CategoryForm 
                            fetchCategories={fetchCategories} 
                            setCreate={handleCancel} 
                            editData={editCategory}
                        />
                    ) : (
                        <CategoriesTable 
                            categories={categories} 
                            fetchCategories={fetchCategories} 
                            onEdit={handleEdit} 
                        />
                    )}
                </div>
            </div>

            <ThemeToggle />
        </div>
    )
}

export default CategoriesPage
