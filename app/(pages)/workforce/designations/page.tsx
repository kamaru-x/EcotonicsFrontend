'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useApi } from '@/app/context/ApiContext'
import { toast } from 'react-toastify'

import OverviewCard from '@/app/components/elements/OverviewCard'
import ThemeToggle from '@/app/components/ThemeToggle'
import { Category, Designation } from '@/app/types/interface'
import DesignationTable from '@/app/components/workforce/DesignationTable'
import DesignationForm from '@/app/components/workforce/DesignationForm'

interface DesignationStats {
    total_designations: number;
    active_designations: number;
    inactive_designations: number;
}

const page = () => {
    const api = useApi()

    const [create, setCreate] = useState(false)
    const [editDesignation, setEditDesignation] = useState<Designation | null>(null)
    const [designations, setDesignations] = useState<Designation[]>([])
    
    const [stats, setStats] = useState<DesignationStats>({
        total_designations: 0,
        active_designations: 0,
        inactive_designations: 0
    })

    const fetchDesignations = useCallback(async () => {
        try {
            const response = await api.fetch(api.endpoints.listDesignations);
            const result = await response.json();
            
            if (!response.ok) {
                throw new Error(result.message || 'Failed to fetch designations');
            }

            const data = result.data
            setDesignations(data.designations)
            setStats({
                total_designations: data.total_designations,
                active_designations: data.active_designations,
                inactive_designations: data.inactive_designations
            })
        } catch (error) {
            console.error('Error fetching designations:', error)
            toast.error(error instanceof Error ? error.message : 'Failed to fetch designations')
        }
    }, [api])

    const handleEdit = (designation: Designation) => {
        setEditDesignation(designation);
        setCreate(true);
    }

    const handleCreate = () => {
        setEditDesignation(null);
        setCreate(true);
    }

    const handleCancel = () => {
        setEditDesignation(null);
        setCreate(false);
    }

    useEffect(() => {
        fetchDesignations()
    }, [fetchDesignations])
    
    return (
        <div className="min-h-screen mx-5">
            <div className="w-full">
                <div className="grid md:grid-cols-3 gap-6 mt-8">
                    <OverviewCard 
                        color="bg-gradient-to-r from-blue-400 to-blue-500" 
                        icon="fas fa-gear" 
                        title="Total Designations" 
                        value={0}
                    />
                    <OverviewCard 
                        color="bg-gradient-to-r from-blue-400 to-blue-500" 
                        icon="fas fa-check-circle" 
                        title="Active Designations" 
                        value={0}
                    />
                    <OverviewCard 
                        color="bg-gradient-to-r from-blue-400 to-blue-500" 
                        icon="fas fa-times-circle" 
                        title="Inactive Designations" 
                        value={0}
                    />
                </div>

                <div className='mt-8 pb-8'>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                            {create ? (editDesignation ? 'Edit Designation' : 'Create Designation') : 'Workforce Designations'}
                        </h2>
                        {!create && (
                            <button 
                                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors duration-200"
                                onClick={handleCreate}
                            >
                                Add Designation
                            </button>
                        )}
                    </div>
                    {create ? (
                        <DesignationForm 
                            fetchDesignations={fetchDesignations} 
                            setCreate={handleCancel} 
                            editData={editDesignation}
                        />
                    ) : (
                        <DesignationTable 
                            designations={designations} 
                            fetchDesignations={fetchDesignations} 
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