'use client'

import React, { useState, useEffect } from 'react'
import { useApi } from '@/app/context/ApiContext'
import { toast } from 'react-toastify'

import OverviewCard from '@/app/components/elements/OverviewCard'
import ThemeToggle from '@/app/components/ThemeToggle'
import CategoriesTable from '@/app/components/service/CategoriesTable'
import CategoryForm from '@/app/components/service/CategoryForm'
import { Category } from '@/app/types/categories'


const page = () => {
    const api = useApi()

    const [create, setCreate] = useState(false)
    const [editCategory, setEditCategory] = useState<Category | null>(null)
    const [categories, setCategories] = useState<Category[]>([])
    
    const [totalCategories, setTotalCategories] = useState(0)
    const [activeCategories, setActiveCategories] = useState(0)
    const [inactiveCategories, setInactiveCategories] = useState(0)

    const fetchCategories = async () => {
        try {
            const response = await api.fetch(api.endpoints.listCategories);
            const result = await response.json();
            const data = result.data
            setCategories(data.categories)
            setTotalCategories(data.total_categories)
            setActiveCategories(data.active_categories)
            setInactiveCategories(data.inactive_categories)
        } catch (error) {
            console.log('Error fetching categories:', error)
            toast.error('Failed to fetch categories')
        }
    }

    const handleEdit = (category: Category) => {
        setEditCategory(category);
        setCreate(true);
    }

    useEffect(() => {
        fetchCategories()
    }, [api])

    return (
        <div className="min-h-screen mx-5">
            <div className="w-full">
                <div className="grid md:grid-cols-3 gap-6 mt-8">
                    <OverviewCard 
                        color="bg-gradient-to-r from-blue-400 to-blue-500" 
                        icon="fas fa-gear" 
                        title="Total Categories" 
                        value={totalCategories}
                    />
                    <OverviewCard 
                        color="bg-gradient-to-r from-blue-400 to-blue-500" 
                        icon="fas fa-gear" 
                        title="Active Categories" 
                        value={activeCategories}
                    />
                    <OverviewCard 
                        color="bg-gradient-to-r from-blue-400 to-blue-500" 
                        icon="fas fa-gear" 
                        title="Inactive Categories" 
                        value={inactiveCategories}
                    />
                </div>

                <div className='mt-8 pb-8'>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-white"> {create ? 'Create Category' : 'Service Categories'}</h2>
                        {
                            !create && (
                                <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors duration-200" onClick={() => setCreate(!create)}>Add Category</button>
                            )
                        }
                    </div>
                    {
                        create ? <CategoryForm fetchCategories={fetchCategories} setCreate={setCreate} editData={editCategory}/> : <CategoriesTable categories={categories} fetchCategories={fetchCategories} onEdit={handleEdit} />
                    }
                </div>
            </div>

                <ThemeToggle />
            </div>
        )
    }

export default page
