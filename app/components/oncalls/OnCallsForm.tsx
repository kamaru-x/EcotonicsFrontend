'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { toast } from 'react-toastify'
import { useApi } from '@/app/context/ApiContext'
import { OnCall, Service, Category, Customer } from '@/app/types/interface';

interface OnCallsFormProps {
    fetchOnCalls: () => void;
    setCreate: (create: boolean) => void;
    editData: OnCall | null;
}

const OnCallsForm = ({ fetchOnCalls, setCreate, editData }: OnCallsFormProps) => {
    const api = useApi();
    const [categories, setCategories] = useState<Category[]>([])
    const [customers, setCustomers] = useState<Customer[]>([])
    const [services, setServices] = useState<Service[]>([])
    const [onCallData, setOnCallData] = useState({
        site_name: '',
        category: '',
        customer_type: 'existing' as 'new' | 'existing' | '',
        type: '' as 'individual' | 'enterprise' | '',
        name: '',
        mobile: '',
        email: '',
        location: '',
        customer: '',
        service: '',
        info: ''
    });

    const fetchCategories = useCallback(async () => {
        try {
            const response = await api.fetch(api.endpoints.listCategories);
            const result = await response.json();
            
            if (!response.ok) {
                throw new Error(result.message || 'Failed to fetch categories');
            }

            setCategories(result.data.categories)
        } catch (error) {
            console.error('Error fetching categories:', error)
            toast.error(error instanceof Error ? error.message : 'Failed to fetch categories')
        }
    }, [api])

    const fetchCustomers = useCallback(async (workType: string) => {
        try {
            const response = await api.fetch(`${api.endpoints.listCustomers}?type=${workType}`);
            const result = await response.json();
            
            if (!response.ok) {
                throw new Error(result.message || 'Failed to fetch customers');
            }

            setCustomers(result.data.customers)
        } catch (error) {
            console.error('Error fetching customers:', error)
            toast.error(error instanceof Error ? error.message : 'Failed to fetch customers')
        }
    }, [api])

    const fetchServices = useCallback(async (categoryId: string) => {
        try {
            const response = await api.fetch(`${api.endpoints.listServices}?category=${categoryId}`);
            const result = await response.json();
            
            if (!response.ok) {
                throw new Error(result.message || 'Failed to fetch services');
            }

            setServices(result.data.services)
        } catch (error) {
            console.error('Error fetching services:', error)
            toast.error(error instanceof Error ? error.message : 'Failed to fetch services')
        }
    }, [api])

    useEffect(() => {
        if (editData) {
            const customerType = editData.type?.name?.toLowerCase() as 'new' | 'existing' | '';
            const workType = editData.type?.id as 'individual' | 'enterprise' | '';
            setOnCallData({
                site_name: editData.site_name || '',
                category: editData.category || '',
                customer_type: customerType || 'existing',
                type: workType || '',
                name: editData.name || '',
                mobile: editData.mobile || '',
                email: editData.email || '',
                location: editData.location || '',
                customer: editData.customer || '',
                service: editData.service || '',
                info: editData.info || ''
            });
            if (editData.category) {
                fetchServices(editData.category);
            }
            if (workType) {
                fetchCustomers(workType);
            }
        }
    }, [editData, fetchServices, fetchCustomers]);

    useEffect(() => {
        if (onCallData.customer_type === 'existing' && onCallData.type) {
            fetchCustomers(onCallData.type);
        }
    }, [onCallData.customer_type, onCallData.type, fetchCustomers]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setOnCallData(prev => {
            const newData = { ...prev, [name]: value };
            
            if (name === 'category') {
                newData.service = ''; // Reset service when category changes
                if (value) {
                    fetchServices(value);
                } else {
                    setServices([]);
                }
            } else if (name === 'type' && newData.customer_type === 'existing') {
                // Reset customer when type changes
                newData.customer = '';
                if (value) {
                    fetchCustomers(value);
                } else {
                    setCustomers([]);
                }
            }
            
            return newData;
        });
    };

    const resetForm = () => {
        setOnCallData({
            site_name: '',
            category: '',
            customer_type: 'existing',
            type: '',
            name: '',
            mobile: '',
            email: '',
            location: '',
            customer: '',
            service: '',
            info: ''
        });
        setCreate(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const url = editData ? api.endpoints.onCallDetail(editData.slug) : api.endpoints.listOnCalls;
            const method = editData ? 'PUT' : 'POST';

            // Transform the data to match the backend model
            const submitData = {
                ...onCallData,
                work_type: onCallData.type // Map type to work_type for the backend
            };

            const response = await api.fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(submitData),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Failed to save on call');
            }

            toast.success(result.message || `${editData ? 'Updated' : 'Created'} on call successfully`);
            resetForm();
            fetchOnCalls();
        } catch (error) {
            console.error('Error saving on call:', error);
            toast.error(error instanceof Error ? error.message : 'Failed to save on call. Please try again.');
        }
    };

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                    <div className="grid grid-cols-12 gap-4">
                        {!editData && (
                            <div className="col-span-12 md:col-span-6">
                                <label htmlFor="customer_type" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Customer Type</label>
                                <select
                                    onChange={handleChange}
                                    id="customer_type"
                                    name="customer_type"
                                    value={onCallData.customer_type}
                                    className="form-select dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:placeholder-gray-400"
                                    required
                                >
                                    <option value="existing">Existing Customer</option>
                                    <option value="new">New Customer</option>
                                </select>
                            </div>
                        )}

                        <div className="col-span-12 md:col-span-6">
                            <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Work Type</label>
                            <select
                                onChange={handleChange}
                                id="type"
                                name="type"
                                value={onCallData.type}
                                className="form-select dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:placeholder-gray-400"
                                required
                                disabled={!!editData}
                            >
                                <option value="">Select work type</option>
                                <option value="individual">Individual</option>
                                <option value="enterprise">Enterprise</option>
                            </select>
                        </div>

                        <div className={`col-span-12 ${editData ? 'md:col-span-6' : 'md:col-span-12'}`}>
                            <label htmlFor="site_name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Site Name</label>
                            <input
                                onChange={handleChange}
                                type="text"
                                id="site_name"
                                name="site_name"
                                value={onCallData.site_name}
                                className="form-input dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:placeholder-gray-400"
                                placeholder="Enter site name"
                                required
                            />
                        </div>

                        {!editData && onCallData.customer_type === 'new' && (
                            <>
                                <div className="col-span-12 md:col-span-12 py-5 border-t border-b border-gray-200 dark:border-gray-700">
                                    <h1 className="text-lg font-bold text-gray-700 dark:text-gray-300 text-center">Customer Details</h1>
                                </div>
                                <div className="col-span-12 md:col-span-6">
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Customer Name</label>
                                    <input
                                        onChange={handleChange}
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={onCallData.name}
                                        className="form-input dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:placeholder-gray-400"
                                        placeholder="Enter customer name"
                                        required
                                    />
                                </div>
                                <div className="col-span-12 md:col-span-6">
                                    <label htmlFor="mobile" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Mobile Number</label>
                                    <input
                                        onChange={handleChange}
                                        type="tel"
                                        id="mobile"
                                        name="mobile"
                                        value={onCallData.mobile}
                                        className="form-input dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:placeholder-gray-400"
                                        placeholder="Enter mobile number"
                                        required
                                    />
                                </div>
                                <div className="col-span-12 md:col-span-6">
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
                                    <input
                                        onChange={handleChange}
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={onCallData.email}
                                        className="form-input dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:placeholder-gray-400"
                                        placeholder="Enter email address"
                                        required
                                    />
                                </div>
                                <div className="col-span-12 md:col-span-6">
                                    <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Location</label>
                                    <input
                                        onChange={handleChange}
                                        type="text"
                                        id="location"
                                        name="location"
                                        value={onCallData.location}
                                        className="form-input dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:placeholder-gray-400"
                                        placeholder="Enter location"
                                        required
                                    />
                                </div>
                            </>
                        )}

                        {(!editData && onCallData.customer_type === 'existing') && (
                            <div className="col-span-12 md:col-span-6">
                                <label htmlFor="customer" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Select Customer</label>
                                <select
                                    onChange={handleChange}
                                    id="customer"
                                    name="customer"
                                    value={onCallData.customer}
                                    className="form-select dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:placeholder-gray-400"
                                    required
                                >
                                    <option value="">Select customer</option>
                                    {customers.map((customer) => (
                                        <option key={customer.id} value={customer.id}>
                                            {customer.name} - {customer.mobile}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        {editData && (
                            <div className="col-span-12 md:col-span-6">
                                <label htmlFor="customer" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Select Customer</label>
                                <select
                                    onChange={handleChange}
                                    id="customer"
                                    name="customer"
                                    value={onCallData.customer}
                                    className="form-select dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:placeholder-gray-400"
                                    required
                                    disabled={true}
                                >
                                    <option value={editData.customer}>{editData.customer_data.name} - {editData.customer_data.mobile}</option>
                                </select>
                            </div>
                        )}

                        <div className="col-span-12 md:col-span-12 py-5 border-t border-b border-gray-200 dark:border-gray-700">
                            <h1 className="text-lg font-bold text-gray-700 dark:text-gray-300 text-center">Service Details</h1>
                        </div>

                        <div className="col-span-12 md:col-span-6">
                            <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Select Category</label>
                            <select
                                onChange={handleChange}
                                id="category"
                                name="category"
                                value={onCallData.category}
                                className="form-select dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:placeholder-gray-400"
                                required
                            >
                                <option value="">Select category</option>
                                {categories.map((category) => (
                                    <option key={category.id} value={category.id}>{category.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="col-span-12 md:col-span-6">
                            <label htmlFor="service" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Select Service</label>
                            <select
                                onChange={handleChange}
                                id="service"
                                name="service"
                                value={onCallData.service}
                                className="form-select dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:placeholder-gray-400"
                                required
                            >
                                <option value="">Select service</option>
                                {services.map((service) => (
                                    <option key={service.id} value={service.id}>{service.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="col-span-12">
                            <label htmlFor="info" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                            <textarea
                                onChange={handleChange}
                                id="info"
                                name="info"
                                value={onCallData.info}
                                className="form-input dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:placeholder-gray-400 w-full"
                                placeholder="Enter service description"
                                rows={3}
                            />
                        </div>
                    </div>
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                    <button
                        type="button"
                        onClick={resetForm}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                    >
                        {editData ? 'Update' : 'Create'} On Call
                    </button>
                </div>
            </form>
        </div>
    )
}

export default OnCallsForm
