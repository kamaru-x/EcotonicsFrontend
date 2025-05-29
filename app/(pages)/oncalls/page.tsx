'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useApi } from '@/app/context/ApiContext'
import { toast } from 'react-toastify'

import OverviewCard from '@/app/components/elements/OverviewCard'
import ThemeToggle from '@/app/components/ThemeToggle'
import { OnCall, Service } from '@/app/types/interface'
import OnCallsTable from '@/app/components/oncalls/OnCallsTable'
import OnCallsForm from '@/app/components/oncalls/OnCallsForm'
import ServicesTable from '@/app/components/service/ServicesTable'
import ServicesForm from '@/app/components/service/ServicesForm'

interface OnCallStats {
    total_on_calls: number;
    pending_on_calls: number;
    completed_on_calls: number;
}

const page = () => {
    const api = useApi()

    const [create, setCreate] = useState(false)
    const [editOnCall, setEditOnCall] = useState<OnCall | null>(null)
    const [onCalls, setOnCalls] = useState<OnCall[]>([])
    
    const [stats, setStats] = useState<OnCallStats>({
        total_on_calls: 0,
        pending_on_calls: 0,
        completed_on_calls: 0
    })

    const fetchOnCalls = useCallback(async () => {
        try {
            const response = await api.fetch(api.endpoints.listOnCalls);
            const result = await response.json();
            
            if (!response.ok) {
                throw new Error(result.message || 'Failed to fetch categories');
            }

            const data = result.data
            setOnCalls(data.on_calls)
            setStats({
                total_on_calls: data.total_on_calls,
                pending_on_calls: data.pending_on_calls,
                completed_on_calls: data.completed_on_calls
            })
        } catch (error) {
            console.error('Error fetching categories:', error)
            toast.error(error instanceof Error ? error.message : 'Failed to fetch categories')
        }
    }, [api])

    const handleEdit = (onCall: OnCall) => {
        setEditOnCall(onCall);
        setCreate(true);
    }

    const handleCreate = () => {
        setEditOnCall(null);
        setCreate(true);
    }

    const handleCancel = () => {
        setEditOnCall(null);
        setCreate(false);
    }

    useEffect(() => {
        fetchOnCalls()
    }, [fetchOnCalls])
    
    return (
        <div className="min-h-screen mx-5">
            <div className="w-full">
                <div className="grid md:grid-cols-3 gap-6 mt-8">
                    <OverviewCard 
                        color="bg-gradient-to-r from-blue-400 to-blue-500" 
                        icon="fas fa-gear" 
                        title="Total On Calls" 
                        value={stats.total_on_calls}
                    />
                    <OverviewCard 
                        color="bg-gradient-to-r from-blue-400 to-blue-500" 
                        icon="fas fa-check-circle" 
                        title="Pending On Calls" 
                        value={stats.pending_on_calls}
                    />
                    <OverviewCard 
                        color="bg-gradient-to-r from-blue-400 to-blue-500" 
                        icon="fas fa-times-circle" 
                        title="Completed On Calls" 
                        value={stats.completed_on_calls}
                    />
                </div>

                <div className='mt-8 pb-8'>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                            {create ? (editOnCall ? 'Edit On Call' : 'Create On Call') : 'On Calls'}
                        </h2>
                        {!create && (
                            <button 
                                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors duration-200"
                                onClick={handleCreate}
                            >
                                Add On Call
                            </button>
                        )}
                    </div>
                    {create ? (
                        <OnCallsForm 
                            fetchOnCalls={fetchOnCalls} 
                            setCreate={handleCancel} 
                            editData={editOnCall}
                        />
                    ) : (
                        <OnCallsTable 
                            onCalls={onCalls} 
                            fetchOnCalls={fetchOnCalls} 
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
