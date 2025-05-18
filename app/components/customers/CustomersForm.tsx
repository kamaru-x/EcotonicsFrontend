'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { toast } from 'react-toastify'
import { useApi } from '@/app/context/ApiContext'
import { Customer } from '@/app/types/interface';

interface CustomersFormProps {
    fetchCustomers: () => void;
    setCreate: (create: boolean) => void;
    editData: Customer | null;
}

const CustomersForm = ({ fetchCustomers, setCreate, editData }: CustomersFormProps) => {
    const api = useApi();
    const [customerData, setCustomerData] = useState({
        name: '',
        type: '',
        mobile: '',
        email: '',
        location: '',
    });

    useEffect(() => {
        if (editData) {
            setCustomerData({
                name: editData.name || '',
                type: editData.type.name || '',
                mobile: editData.mobile || '',
                email: editData.email || '',
                location: editData.location || '',
            });
        } else {
            setCustomerData({ name: '', type: '', mobile: '', email: '', location: '' });
        }
    }, [editData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setCustomerData(prev => ({ ...prev, [name]: value }));
    };

    const resetForm = () => {
        setCustomerData({ name: '', type: '', mobile: '', email: '', location: '' });
        setCreate(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const url = editData ? api.endpoints.customerDetail(editData.slug) : api.endpoints.listCustomers;
            const method = editData ? 'PUT' : 'POST';

            const response = await api.fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(customerData),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Failed to save customer');
            }

            toast.success(result.message || `${editData ? 'Updated' : 'Created'} customer successfully`);
            resetForm();
            fetchCustomers();
        } catch (error) {
            console.error('Error saving customer:', error);
            toast.error(error instanceof Error ? error.message : 'Failed to save customer. Please try again.');
        }

    };
    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                    <div className="grid grid-cols-12 gap-4">
                        <div className="col-span-12 md:col-span-6">
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Customer Name</label>
                            <input
                                onChange={handleChange}
                                type="text"
                                id="name"
                                name="name"
                                value={customerData.name}
                                className="form-input dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:placeholder-gray-400"
                                placeholder="Enter customer name"
                                required
                            />
                        </div>
                        <div className="col-span-12 md:col-span-6">
                            <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Select Customer Type</label>
                            <select
                                onChange={handleChange}
                                id="type"
                                name="type"
                                value={customerData.type}
                                className="form-select dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:placeholder-gray-400"
                                required
                            >
                                {editData ? (
                                    <option value={editData.type.id}>{editData.type.name}</option>
                                ) : (
                                    <option value="">Select customer type</option>
                                )}
                                <option value="individual">Individual</option>
                                <option value="enterprise">Enterprise</option>
                            </select>
                        </div>
                        <div className="col-span-12 md:col-span-6">
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Customer Mobile</label>
                            <input
                                onChange={handleChange}
                                type="text"
                                id="mobile"
                                name="mobile"
                                value={customerData.mobile}
                                className="form-input dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:placeholder-gray-400"
                                placeholder="Enter customer mobile"
                                required
                            />
                        </div>
                        <div className="col-span-12 md:col-span-6">
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Customer Email</label>
                            <input
                                onChange={handleChange}
                                type="email"
                                id="email"
                                name="email"
                                value={customerData.email}
                                className="form-input dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:placeholder-gray-400"
                                placeholder="Enter customer email"
                                required
                            />
                        </div>
                        <div className="col-span-12 md:col-span-6">
                            <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Customer Location</label>
                            <input
                                onChange={handleChange}
                                type="text"
                                id="location"
                                name="location"
                                value={customerData.location}
                                className="form-input dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:placeholder-gray-400"
                                placeholder="Enter customer location"
                                required
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
                        {editData ? 'Update' : 'Create'} Customer
                    </button>
                </div>
            </form>
        </div>
    )
}

export default CustomersForm