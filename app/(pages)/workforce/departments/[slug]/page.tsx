'use client'

import React from 'react'
import { useParams } from 'next/navigation'
import { useApi } from '@/app/context/ApiContext'
import { useState } from 'react'
import { Designation, Staff } from '@/app/types/interface'
import ThemeToggle from '@/app/components/ThemeToggle'
import OverviewCard from '@/app/components/elements/OverviewCard'

const page = () => {
    const { slug } = useParams()
    const api = useApi()
    const [activeTab, setActiveTab] = useState<'DESIGNATIONS' | 'STAFFS'>('DESIGNATIONS')
    const [designations, setDesignations] = useState<Designation[]>([])
    const [staff, setStaff] = useState<Staff[]>([])

    

    return (
        <div className="min-h-screen mx-5">
            <div className="w-full">
                <div className="grid md:grid-cols-2 gap-6 mt-8">
                    <OverviewCard 
                        color="bg-gradient-to-r from-blue-400 to-blue-500" 
                        icon="fas fa-gear" 
                        title="Total Designations" 
                        value={0}
                    />
                    <OverviewCard 
                        color="bg-gradient-to-r from-blue-400 to-blue-500" 
                        icon="fas fa-check-circle" 
                        title="Total Staffs" 
                        value={0}
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

            <ThemeToggle />
        </div>
    )
}

export default page
