'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { toast } from 'react-toastify'
import { useApi } from '@/app/context/ApiContext'
import { Designation, Department } from '@/app/types/interface';

interface DesignationFormProps {
    fetchDesignations: () => void;
    setCreate: (create: boolean) => void;
    editData: Designation | null;
}

const DesignationForm = ({ fetchDesignations, setCreate, editData }: DesignationFormProps) => {
    const api = useApi();
    const [departments, setDepartments] = useState<Department[]>([])
    const [designationData, setDesignationData] = useState({
        name: '',
        department: '',
        info: '',
    });

    const fetchDepartments = useCallback(async () => {
        try {
            const response = await api.fetch(api.endpoints.listDepartments);
            const result = await response.json();
            
            if (!response.ok) {
                throw new Error(result.message || 'Failed to fetch departments');
            }

            const data = result.data
            setDepartments(data.departments)
        } catch (error) {
            console.error('Error fetching departments:', error)
            toast.error(error instanceof Error ? error.message : 'Failed to fetch departments')
        }
    }, [api])

    useEffect(() => {
        if (editData) {
            setDesignationData({
                name: editData.name || '',
                department: editData.department_id || '',
                info: editData.info || '',
            });
        } else {
            setDesignationData({ name: '', department: '', info: '' });
        }
    }, [editData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setDesignationData(prev => ({ ...prev, [name]: value }));
    };

    const resetForm = () => {
        setDesignationData({ name: '', department: '', info: '' });
        setCreate(false);
    };

    useEffect(() => {
        fetchDepartments();
    }, [fetchDepartments]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const url = editData
                ? api.endpoints.designationDetail(editData.slug)
                : api.endpoints.listDesignations;
            const method = editData ? 'PUT' : 'POST';

            const response = await api.fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(designationData),
            });

            const result = await response.json();
            
            if (!response.ok) {
                throw new Error(result.message || 'Failed to save designation');
            }

            toast.success(result.message || `${editData ? 'Updated' : 'Created'} designation successfully`);
            resetForm();
            fetchDesignations();
        } catch (error) {
            console.error('Error saving designation:', error);
            toast.error(error instanceof Error ? error.message : 'Failed to save designation. Please try again.');
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                    <div className="grid grid-cols-12 gap-4">
                        <div className="col-span-12 md:col-span-6">
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Designation Name</label>
                            <input
                                onChange={handleChange}
                                type="text"
                                id="name"
                                name="name"
                                value={designationData.name}
                                className="form-input dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:placeholder-gray-400"
                                placeholder="Enter designation name"
                                required
                            />
                        </div>
                        <div className="col-span-12 md:col-span-6">
                            <label htmlFor="department" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Select Department</label>
                            <select
                                onChange={handleChange}
                                id="department"
                                name="department"
                                value={designationData.department}
                                className="form-select dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:placeholder-gray-400"
                                required
                            >
                                {editData ? (
                                    <option value={editData.department.id}>{editData.department_name}</option>
                                ) : (
                                    <option value="">Select department</option>
                                )}
                                {departments.map((department) => (
                                    <option key={department.id} value={department.id}>{department.name}</option>
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
                            value={designationData.info}
                            className="form-input dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:placeholder-gray-400"
                            placeholder="Enter designation description"
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
                        {editData ? 'Update' : 'Create'} Designation
                    </button>
                </div>
            </form>
        </div>
    )
}

export default DesignationForm
