'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useApi } from '@/app/context/ApiContext'
import { toast } from 'react-toastify'

import OverviewCard from '@/app/components/elements/OverviewCard'
import ThemeToggle from '@/app/components/ThemeToggle'
import { Service, Category } from '@/app/types/interface'
import ServicesTable from '@/app/components/service/ServicesTable'
import ServicesForm from '@/app/components/service/ServicesForm'

interface ServiceStats {
    total_services: number;
    active_services: number;
    inactive_services: number;
}

const page = () => {
    const api = useApi()

    const [create, setCreate] = useState(false)
    const [editService, setEditService] = useState<Service | null>(null)
    const [services, setServices] = useState<Service[]>([])
    
    const [stats, setStats] = useState<ServiceStats>({
        total_services: 0,
        active_services: 0,
        inactive_services: 0
    })

    const fetchServices = useCallback(async () => {
        try {
            const response = await api.fetch(api.endpoints.listServices);
            const result = await response.json();
            
            if (!response.ok) {
                throw new Error(result.message || 'Failed to fetch categories');
            }

            const data = result.data
            setServices(data.services)
            setStats({
                total_services: data.total_services,
                active_services: data.active_services,
                inactive_services: data.inactive_services
            })
        } catch (error) {
            console.error('Error fetching categories:', error)
            toast.error(error instanceof Error ? error.message : 'Failed to fetch categories')
        }
    }, [api])

    const handleEdit = (service: Service) => {
        setEditService(service);
        setCreate(true);
    }

    const handleCreate = () => {
        setEditService(null);
        setCreate(true);
    }

    const handleCancel = () => {
        setEditService(null);
        setCreate(false);
    }

    useEffect(() => {
        fetchServices()
    }, [fetchServices])
    
    return (
        <div className="min-h-screen mx-5">
            <div className="w-full">
                <div className="grid md:grid-cols-3 gap-6 mt-8">
                    <OverviewCard 
                        color="bg-gradient-to-r from-blue-400 to-blue-500" 
                        icon="fas fa-gear" 
                        title="Total Services" 
                        value={stats.total_services}
                    />
                    <OverviewCard 
                        color="bg-gradient-to-r from-blue-400 to-blue-500" 
                        icon="fas fa-check-circle" 
                        title="Active Services" 
                        value={stats.active_services}
                    />
                    <OverviewCard 
                        color="bg-gradient-to-r from-blue-400 to-blue-500" 
                        icon="fas fa-times-circle" 
                        title="Inactive Services" 
                        value={stats.inactive_services}
                    />
                </div>

                <div className='mt-8 pb-8'>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                            {create ? (editService ? 'Edit Service' : 'Create Service') : 'Services'}
                        </h2>
                        {!create && (
                            <button 
                                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors duration-200"
                                onClick={handleCreate}
                            >
                                Add Service
                            </button>
                        )}
                    </div>
                    {create ? (
                        <ServicesForm 
                            fetchServices={fetchServices} 
                            setCreate={handleCancel} 
                            editData={editService}
                        />
                    ) : (
                        <ServicesTable 
                            services={services} 
                            fetchServices={fetchServices} 
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
