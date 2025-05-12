'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useApi } from '@/app/context/ApiContext'
import { toast } from 'react-toastify'

import OverviewCard from '@/app/components/elements/OverviewCard'
import ThemeToggle from '@/app/components/ThemeToggle'
import DepartmentsTable from '@/app/components/workforce/DepartmentTable'
import DepartmentForm from '@/app/components/workforce/DepartmentForm'
import { Department } from '@/app/types/interface'

interface DepartmentStats {
    total_departments: number;
    active_departments: number;
    inactive_departments: number;
}

const page = () => {
    const api = useApi()

    const [create, setCreate] = useState(false)
    const [editDepartment, setEditDepartment] = useState<Department | null>(null)
    const [departments, setDepartments] = useState<Department[]>([])
    
    const [stats, setStats] = useState<DepartmentStats>({
        total_departments: 0,
        active_departments: 0,
        inactive_departments: 0
    })

    const fetchDepartments = useCallback(async () => {
        try {
            const response = await api.fetch(api.endpoints.listDepartments);
            const result = await response.json();
            
            if (!response.ok) {
                throw new Error(result.message || 'Failed to fetch departments');
            }

            const data = result.data
            setDepartments(data.departments)
            setStats({
                total_departments: 0,
                active_departments: 0,
                inactive_departments: 0
            })
        } catch (error) {
            console.error('Error fetching departments:', error)
            toast.error(error instanceof Error ? error.message : 'Failed to fetch departments')
        }
    }, [api])

    const handleEdit = (department: Department) => {
        setEditDepartment(department);
        setCreate(true);
    }

    const handleCreate = () => {
        setEditDepartment(null);
        setCreate(true);
    }

    const handleCancel = () => {
        setEditDepartment(null);
        setCreate(false);
    }

    useEffect(() => {
        fetchDepartments()
    }, [fetchDepartments])
    
    return (
        <div className="min-h-screen mx-5">
            <div className="w-full">
                <div className="grid md:grid-cols-3 gap-6 mt-8">
                    <OverviewCard 
                        color="bg-gradient-to-r from-blue-400 to-blue-500" 
                        icon="fas fa-gear" 
                        title="Total Departments" 
                        value={0}
                    />
                    <OverviewCard 
                        color="bg-gradient-to-r from-blue-400 to-blue-500" 
                        icon="fas fa-check-circle" 
                        title="Active Departments" 
                        value={0}
                    />
                    <OverviewCard 
                        color="bg-gradient-to-r from-blue-400 to-blue-500" 
                        icon="fas fa-times-circle" 
                        title="Inactive Departments" 
                        value={0}
                    />
                </div>

                <div className='mt-8 pb-8'>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                            {create ? (editDepartment ? 'Edit Department' : 'Create Department') : 'Workforce Departments'}
                        </h2>
                        {!create && (
                            <button 
                                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors duration-200"
                                onClick={handleCreate}
                            >
                                Add Department
                            </button>
                        )}
                    </div>
                    {create ? (
                        <DepartmentForm 
                            fetchDepartments={fetchDepartments} 
                            setCreate={handleCancel} 
                            editData={editDepartment}
                        />
                    ) : (
                        <DepartmentsTable 
                            departments={departments} 
                            fetchDepartments={fetchDepartments} 
                            onEdit={handleEdit} 
                        />
                    )}
                </div>
            </div>

            <ThemeToggle />
        </div>
    )
}

export default page
