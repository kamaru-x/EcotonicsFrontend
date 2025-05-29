'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useApi } from '@/app/context/ApiContext'
import { toast } from 'react-toastify'

import OverviewCard from '@/app/components/elements/OverviewCard'
import ThemeToggle from '@/app/components/ThemeToggle'
import { Customer } from '@/app/types/interface'
import CustomersTable from '@/app/components/customers/CustomersTable'
import CustomersForm from '@/app/components/customers/CustomersForm'

interface CustomerStats {
    total_customers: number;
    enterprise_customers: number;
    individual_customers: number;
}

const page = () => {
    const api = useApi()

    const [create, setCreate] = useState(false)
    const [activeTab, setActiveTab] = useState<'ENTERPRICE' | 'INDIVIDUAL'>('ENTERPRICE')
    const [editCustomer, setEditCustomer] = useState<Customer | null>(null)
    const [enterpriseCustomers, setEnterpriseCustomers] = useState<Customer[]>([])
    const [individualCustomers, setIndividualCustomers] = useState<Customer[]>([])
    
    const [stats, setStats] = useState<CustomerStats>({
        total_customers: 0,
        enterprise_customers: 0,
        individual_customers: 0
    })

    const fetchEnterpriseCustomers = useCallback(async () => {
        try {
            const response = await api.fetch(`${api.endpoints.listCustomers}?type=enterprise`);
            const result = await response.json();
            
            if (!response.ok) {
                throw new Error(result.message || 'Failed to fetch categories');
            }

            const data = result.data
            setEnterpriseCustomers(data.customers)
            setStats({
                total_customers: data.total_customers,
                enterprise_customers: data.enterprise_customers,
                individual_customers: data.individual_customers
            })
        } catch (error) {
            console.error('Error fetching customers:', error)
            toast.error(error instanceof Error ? error.message : 'Failed to fetch customers')
        }
    }, [api])

    const fetchIndividualCustomers = useCallback(async () => {
        try {
            const response = await api.fetch(`${api.endpoints.listCustomers}?type=individual`);
            const result = await response.json();
            
            if (!response.ok) {
                throw new Error(result.message || 'Failed to fetch categories');
            }

            const data = result.data
            setIndividualCustomers(data.customers)
            setStats({
                total_customers: data.total_customers,
                enterprise_customers: data.enterprise_customers,
                individual_customers: data.individual_customers
            })
        } catch (error) {
            console.error('Error fetching customers:', error)
            toast.error(error instanceof Error ? error.message : 'Failed to fetch customers')
        }
    }, [api])

    const handleEdit = (customer: Customer) => {
        setEditCustomer(customer);
        setCreate(true);
    }

    const handleCreate = () => {
        setEditCustomer(null);
        setCreate(true);
    }

    const handleCancel = () => {
        setEditCustomer(null);
        setCreate(false);
    }

    useEffect(() => {
        fetchEnterpriseCustomers()
        fetchIndividualCustomers()
    }, [fetchEnterpriseCustomers, fetchIndividualCustomers])
    
    
    return (
        <div className="min-h-screen mx-5">
            <div className="w-full">
                <div className="grid md:grid-cols-3 gap-6 mt-8">
                    <OverviewCard 
                        color="bg-gradient-to-r from-blue-400 to-blue-500" 
                        icon="fas fa-users" 
                        title="Total Customers" 
                        value={stats.total_customers}
                    />
                    <OverviewCard 
                        color="bg-gradient-to-r from-blue-400 to-blue-500" 
                        icon="fas fa-industry" 
                        title="Enterprise Customers" 
                        value={stats.enterprise_customers}
                    />
                    <OverviewCard 
                        color="bg-gradient-to-r from-blue-400 to-blue-500" 
                        icon="fas fa-user" 
                        title="Individual Customers" 
                        value={stats.individual_customers}
                    />
                </div>

                <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0 mt-8">
                    <button onClick={() => setActiveTab('ENTERPRICE')} className={`tab-button w-full py-2 rounded-lg shadow-md focus:outline-none transition-colors duration-200
                        ${ activeTab === 'ENTERPRICE' ? 'bg-gradient-to-r from-blue-400 to-blue-500 text-white': 'text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800'}`}> ENTERPRICE
                    </button>

                    <button onClick={() => setActiveTab('INDIVIDUAL')} className={`tab-button w-full py-2 rounded-lg shadow-md focus:outline-none transition-colors duration-200
                        ${ activeTab === 'INDIVIDUAL' ? 'bg-gradient-to-r from-blue-400 to-blue-500 text-white': 'text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800'}`}> INDIVIDUAL
                    </button>
                </div>

                <div className='mt-8 pb-8'>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                            {create ? (editCustomer ? 'Edit Customer' : 'Create Customer') : 'Customers'}
                        </h2>
                        {!create && (
                            <button 
                                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors duration-200"
                                onClick={handleCreate}
                            >
                                Add Customer
                            </button>
                        )}
                    </div>
                    {create ? (
                        <CustomersForm 
                            fetchCustomers={activeTab === 'ENTERPRICE' ? fetchEnterpriseCustomers : fetchIndividualCustomers} 
                            setCreate={handleCancel} 
                            editData={editCustomer}
                        />
                    ) : (
                        activeTab === 'ENTERPRICE' ? (
                            <CustomersTable 
                                customers={enterpriseCustomers} 
                                fetchCustomers={fetchEnterpriseCustomers} 
                                onEdit={handleEdit} 
                            />
                        ) : (
                            <CustomersTable 
                                customers={individualCustomers} 
                                fetchCustomers={fetchIndividualCustomers} 
                                onEdit={handleEdit} 
                            />
                        )
                    )}
                </div>
            </div>

            <ThemeToggle />
        </div>
    )
}

export default page
