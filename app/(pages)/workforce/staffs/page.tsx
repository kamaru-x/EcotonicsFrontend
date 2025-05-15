'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useApi } from '@/app/context/ApiContext'
import { toast } from 'react-toastify'

import OverviewCard from '@/app/components/elements/OverviewCard'
import ThemeToggle from '@/app/components/ThemeToggle'
import StaffTable from '@/app/components/workforce/StaffTable'
import StaffForm from '@/app/components/workforce/StaffForm'
import { Staff } from '@/app/types/interface'

interface StaffStats {
    total_staffs: number;
    active_staffs: number;
    inactive_staffs: number;
}

const page = () => {
    const api = useApi()

    const [create, setCreate] = useState(false)
    const [editStaff, setEditStaff] = useState<Staff | null>(null)
    const [staffs, setStaffs] = useState<Staff[]>([])
    
    const [stats, setStats] = useState<StaffStats>({
        total_staffs: 0,
        active_staffs: 0,
        inactive_staffs: 0
    })

    const fetchStaffs = useCallback(async () => {
        try {
            const response = await api.fetch(api.endpoints.listStaffs);
            const result = await response.json();
            
            if (!response.ok) {
                throw new Error(result.message || 'Failed to fetch staffs');
            }

            const data = result.data
            setStaffs(data.staffs)
            setStats({
                total_staffs: data.total_staffs,
                active_staffs: data.active_staffs,
                inactive_staffs: data.inactive_staffs
            })
        } catch (error) {
            console.error('Error fetching staffs:', error)
            toast.error(error instanceof Error ? error.message : 'Failed to fetch staffs')
        }
    }, [api])

    const handleEdit = (staff: Staff) => {
        setEditStaff(staff);
        setCreate(true);
    }

    const handleCreate = () => {
        setEditStaff(null);
        setCreate(true);
    }

    const handleCancel = () => {
        setEditStaff(null);
        setCreate(false);
    }

    useEffect(() => {
        fetchStaffs()
    }, [fetchStaffs])

    return (
        <div className="min-h-screen mx-5">
            <div className="w-full">
                <div className="grid md:grid-cols-3 gap-6 mt-8">
                    <OverviewCard 
                        color="bg-gradient-to-r from-blue-400 to-blue-500" 
                        icon="fas fa-gear" 
                        title="Total Staffs" 
                        value={0}
                    />
                    <OverviewCard 
                        color="bg-gradient-to-r from-blue-400 to-blue-500" 
                        icon="fas fa-check-circle" 
                        title="Active Staffs" 
                        value={0}
                    />
                    <OverviewCard 
                        color="bg-gradient-to-r from-blue-400 to-blue-500" 
                        icon="fas fa-times-circle" 
                        title="Inactive Staffs" 
                        value={0}
                    />
                </div>

                <div className='mt-8 pb-8'>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                            {create ? (editStaff ? 'Edit Staff' : 'Create Staff') : 'Staffs'}
                        </h2>
                        {!create && (
                            <button 
                                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors duration-200"
                                onClick={handleCreate}
                            >
                                Add Staff
                            </button>
                        )}
                    </div>
                    {create ? (
                        <StaffForm 
                            fetchStaffs={fetchStaffs} 
                            setCreate={handleCancel} 
                            editData={editStaff}
                        />
                    ) : (
                        <StaffTable 
                            staffs={staffs} 
                            fetchStaffs={fetchStaffs} 
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
