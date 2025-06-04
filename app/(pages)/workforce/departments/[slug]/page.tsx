'use client'

import React, { useEffect } from 'react'
import { useParams } from 'next/navigation'
import { useApi } from '@/app/context/ApiContext'
import { useState } from 'react'
import { Designation, Staff, Department } from '@/app/types/interface'
import ThemeToggle from '@/app/components/ThemeToggle'
import OverviewCard from '@/app/components/elements/OverviewCard'
import { toast } from 'react-toastify'
import DesignationTable from '@/app/components/workforce/DesignationTable'
import StaffTable from '@/app/components/workforce/StaffTable'


const page = () => {
    const { slug } = useParams()
    const api = useApi()
    const [activeTab, setActiveTab] = useState<'DESIGNATIONS' | 'STAFFS'>('DESIGNATIONS')
    const [department, setDepartment] = useState<Department | null>(null)
    const [designations, setDesignations] = useState<Designation[]>([])
    const [staff, setStaff] = useState<Staff[]>([])
    const [editDesignation, setEditDesignation] = useState<Designation | null>(null)
    const [createDesignation, setCreateDesignation] = useState(false)
    const [editStaff, setEditStaff] = useState<Staff | null>(null)
    const [createStaff, setCreateStaff] = useState(false)

    const handleDesignationEdit = (designation: Designation) => {
        setEditDesignation(designation);
        setCreateDesignation(true);
    }

    const handleStaffEdit = (staff: Staff) => {
        setEditStaff(staff);
        setCreateStaff(true);
    }

    const fetchDepartment = async (slug: string) => {
        try {
            const response = await api.fetch(api.endpoints.departmentDetail(slug), { 
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            const result = await response.json()
            setDepartment(result.data)

        } catch (error) {
            console.error('Error deleting department:', error)
            toast.error('Failed to delete department. Please try again.')
        }
    }

    const fetchDesignations = async () => {
        try {
            const response = await api.fetch(`${api.endpoints.listDesignations}?department=${department?.id}`, { 
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            const result = await response.json()
            setDesignations(result.data.designations)

        } catch (error) {
            console.error('Error fetching designations:', error)
            toast.error('Failed to fetch designations. Please try again.')
        }
    }

    const fetchStaffs = async () => {
        try {
            const response = await api.fetch(`${api.endpoints.listStaffs}?department=${department?.id}`, { 
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            const result = await response.json()
            setStaff(result.data.staffs)

        } catch (error) {
            console.error('Error fetching staff:', error)
            toast.error('Failed to fetch staff. Please try again.')
        }
    }

    useEffect(() => {
        fetchDepartment(slug as string)
    }, [slug])
    
    useEffect(() => {
        if (department?.id) {
            fetchDesignations()
            fetchStaffs()
        }
    }, [department])

    return (
        <div className="min-h-screen mx-5">
            <div className="w-full">
                <div className="grid md:grid-cols-2 gap-6 mt-8">
                    <OverviewCard 
                        color="bg-gradient-to-r from-blue-400 to-blue-500" 
                        icon="fas fa-gear" 
                        title="Total Designations" 
                        value={designations.length}
                    />
                    <OverviewCard 
                        color="bg-gradient-to-r from-blue-400 to-blue-500" 
                        icon="fas fa-check-circle" 
                        title="Total Staffs" 
                        value={staff.length}
                    />
                </div>

                <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0 mt-8">
                    <button onClick={() => setActiveTab('DESIGNATIONS')} className={`tab-button w-full py-2 rounded-lg shadow-md focus:outline-none transition-colors duration-200
                        ${ activeTab === 'DESIGNATIONS' ? 'bg-gradient-to-r from-blue-400 to-blue-500 text-white': 'text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800'}`}> Designations
                    </button>

                    <button onClick={() => setActiveTab('STAFFS')} className={`tab-button w-full py-2 rounded-lg shadow-md focus:outline-none transition-colors duration-200
                        ${ activeTab === 'STAFFS' ? 'bg-gradient-to-r from-blue-400 to-blue-500 text-white': 'text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800'}`}> Staffs
                    </button>
                </div>
            </div>

            <div className='mt-8 pb-8'>
                {
                    activeTab === 'DESIGNATIONS' && (
                        <DesignationTable 
                            designations={designations} 
                            fetchDesignations={fetchDesignations}
                            onEdit={handleDesignationEdit}
                        />
                    )
                }
                {
                    activeTab === 'STAFFS' && (
                        <StaffTable 
                            staffs={staff} 
                            fetchStaffs={fetchStaffs} 
                            onEdit={handleStaffEdit}
                        />
                )}
            </div>

            <ThemeToggle />
        </div>
    )
}

export default page
