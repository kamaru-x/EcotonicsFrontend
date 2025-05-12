'use client'

import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { useApi } from '@/app/context/ApiContext'
import { Department } from '@/app/types/interface';

interface DepartmentsFormProps {
    fetchDepartments: () => void;
    setCreate: (create: boolean) => void;
    editData: Department | null;
}

const DepartmentForm = ({ fetchDepartments, setCreate, editData }: DepartmentsFormProps) => {
    const api = useApi();
    const [departmentData, setDepartmentData] = useState({
        name: '',
        info: '',
    });

    useEffect(() => {
        if (editData) {
            setDepartmentData({
                name: editData.name || '',
                info: editData.info || '',
            });
        } else {
            setDepartmentData({ name: '', info: '' });
        }
    }, [editData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setDepartmentData(prev => ({ ...prev, [name]: value }));
    };

    const resetForm = () => {
        setDepartmentData({ name: '', info: '' });
        setCreate(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const url = editData
                ? api.endpoints.departmentDetail(editData.slug)
                : api.endpoints.listDepartments;
            const method = editData ? 'PUT' : 'POST';

            const response = await api.fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(departmentData),
            });

            const result = await response.json();
            
            if (!response.ok) {
                throw new Error(result.message || 'Failed to save department');
            }

            toast.success(result.message || `${editData ? 'Updated' : 'Created'} department successfully`);
            resetForm();
            fetchDepartments();
        } catch (error) {
            console.error('Error saving department:', error);
            toast.error(error instanceof Error ? error.message : 'Failed to save department. Please try again.');
        }
    };
    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Department Name</label>
                        <input
                            onChange={handleChange}
                            type="text"
                            id="name"
                            name="name"
                            value={departmentData.name}
                            className="form-input dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:placeholder-gray-400"
                            placeholder="Enter department name"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="info" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                        <textarea
                            onChange={handleChange}
                            id="info"
                            name="info"
                            value={departmentData.info}
                            className="form-input dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:placeholder-gray-400"
                            placeholder="Enter department description"
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
                        {editData ? 'Update' : 'Create'} Department
                    </button>
                </div>
            </form>
        </div>
    )
}

export default DepartmentForm
