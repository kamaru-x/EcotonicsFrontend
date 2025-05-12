'use client'

import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { useApi } from '@/app/context/ApiContext'
import { Category } from '@/app/types/categories';

interface CategoriesFormProps {
    fetchCategories: () => void;
    setCreate: (create: boolean) => void;
    editData: Category | null;
}

const CategoryForm = ({ fetchCategories, setCreate, editData }: CategoriesFormProps) => {
    const api = useApi();
    const [categoryData, setCategoryData] = useState({
        name: '',
        info: '',
    });

    useEffect(() => {
        if (editData) {
            setCategoryData({
                name: editData.name || '',
                info: editData.info || '',
            });
        } else {
            setCategoryData({ name: '', info: '' });
        }
    }, [editData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setCategoryData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const url = editData
                ? api.endpoints.categoryDetail(editData.slug)
                : api.endpoints.listCategories;
            const method = editData ? 'PUT' : 'POST';

            const response = await api.fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(categoryData),
            });

            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.message || 'Failed to save category');
            }
            toast.success(result.message || 'Category saved successfully');
            setCreate(false);
            fetchCategories();
        } catch (error) {
            console.error('Error saving category:', error);
            toast.error(error instanceof Error ? error.message : 'Failed to save category');
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Category Name</label>
                        <input
                            onChange={handleChange}
                            type="text"
                            id="name"
                            name="name"
                            value={categoryData.name}
                            className="form-input dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:placeholder-gray-400"
                            placeholder="Enter category name"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="info" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                        <textarea
                            onChange={handleChange}
                            id="info"
                            name="info"
                            value={categoryData.info}
                            className="form-input dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:placeholder-gray-400"
                            placeholder="Enter category description"
                            rows={3}
                        />
                    </div>
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                    <button
                        type="button"
                        onClick={() => setCreate(false)}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                    >
                        {editData ? 'Update' : 'Create'} Category
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CategoryForm;