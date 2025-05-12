'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { toast } from 'react-toastify'
import { useApi } from '@/app/context/ApiContext'
import { Service, Category } from '@/app/types/interface';

interface ServicesFormProps {
    fetchServices: () => void;
    setCreate: (create: boolean) => void;
    editData: Service | null;
}

const ServicesForm = ({ fetchServices, setCreate, editData }: ServicesFormProps) => {
    const api = useApi();
    const [categories, setCategories] = useState<Category[]>([])
    const [serviceData, setServiceData] = useState({
        name: '',
        category: '',
        info: '',
    });

    const fetchCategories = useCallback(async () => {
        try {
            const response = await api.fetch(api.endpoints.listCategories);
            const result = await response.json();
            
            if (!response.ok) {
                throw new Error(result.message || 'Failed to fetch categories');
            }

            const data = result.data
            setCategories(data.categories)
        } catch (error) {
            console.error('Error fetching categories:', error)
            toast.error(error instanceof Error ? error.message : 'Failed to fetch categories')
        }
    }, [api])

    useEffect(() => {
        if (editData) {
            setServiceData({
                name: editData.name || '',
                category: editData.category_id || '',
                info: editData.info || '',
            });
        } else {
            setServiceData({ name: '', category: '', info: '' });
        }
    }, [editData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setServiceData(prev => ({ ...prev, [name]: value }));
    };

    const resetForm = () => {
        setServiceData({ name: '', category: '', info: '' });
        setCreate(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const url = editData ? api.endpoints.serviceDetail(editData.slug) : api.endpoints.listServices;
            const method = editData ? 'PUT' : 'POST';

            const response = await api.fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(serviceData),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Failed to save service');
            }

            toast.success(result.message || `${editData ? 'Updated' : 'Created'} service successfully`);
            resetForm();
            fetchServices();
        } catch (error) {
            console.error('Error saving service:', error);
            toast.error(error instanceof Error ? error.message : 'Failed to save service. Please try again.');
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
                        <div className="col-span-12 md:col-span-6">
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Service Name</label>
                            <input
                                onChange={handleChange}
                                type="text"
                                id="name"
                                name="name"
                                value={serviceData.name}
                                className="form-input dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:placeholder-gray-400"
                                placeholder="Enter service name"
                                required
                            />
                        </div>
                        <div className="col-span-12 md:col-span-6">
                            <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Select Category</label>
                            <select
                                onChange={handleChange}
                                id="category"
                                name="category"
                                value={serviceData.category}
                                className="form-select dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:placeholder-gray-400"
                                required
                            >
                                {editData ? (
                                    <option value={editData.category.id}>{editData.category_name}</option>
                                ) : (
                                    <option value="">Select category</option>
                                )}
                                {categories.map((category) => (
                                    <option key={category.id} value={category.id}>{category.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="col-span-12 md:col-span-6">
                        <label htmlFor="info" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                        <textarea
                            onChange={handleChange}
                            id="info"
                            name="info"
                            value={serviceData.info}
                            className="form-input dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:placeholder-gray-400"
                            placeholder="Enter service description"
                            rows={3}
                        />
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
                        {editData ? 'Update' : 'Create'} Service
                    </button>
                </div>
            </form>
        </div>
    )
}

export default ServicesForm
