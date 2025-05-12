import React from 'react'
import { useApi } from '@/app/context/ApiContext'
import { toast } from 'react-toastify'
import { useDeleteModal } from '@/app/context/DeleteModalContext'
import { Category } from '@/app/types/categories'

interface CategoriesTableProps {
    categories: Category[];
    fetchCategories: () => void;
}

const CategoriesTable = ({ categories, fetchCategories }: CategoriesTableProps) => {
    const api = useApi()
    const { showDeleteModal } = useDeleteModal()

    const deleteCategory = async (slug: string) => {
        try {
            const response = await api.fetch(api.endpoints.categoryDetail(slug), { method: 'DELETE' })
            const result = await response.json()

            if (response.ok) {
                fetchCategories()
                toast.success(result.message)
            } else {
                toast.error(result.message)
            }
        } catch (error) {
            console.log('Error deleting category:', error)
            toast.error('Failed to delete category')
        }
    }

    const handleDeleteClick = (itemType: string, slug: string, deleteFunction: () => void) => {
        showDeleteModal(itemType, deleteFunction);
    };

    return (
        <div className="w-full">
            {categories && categories.length > 0 ? (
                <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-700/50">
                            <tr>
                                <th scope="col" className="px-6 py-6 text-center font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    No.
                                </th>
                                <th scope="col" className="px-6 py-6 text-center font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Name
                                </th>
                                <th scope="col" className="px-6 py-6 text-center font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Services
                                </th>
                                <th scope="col" className="px-6 py-6 text-center font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Status
                                </th>
                                <th scope="col" className="px-6 py-6 text-center font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {categories.map((category: Category, index: number) => (
                                <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150">
                                    <td className="px-6 py-6 text-center whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                                        {index + 1}
                                    </td>
                                    <td className="px-6 py-6 text-center whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                                        {category.name}
                                    </td>
                                    <td className="px-6 py-6 text-center whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                                        {category.services} {category.services === 1 ? 'Service' : 'Services'}
                                    </td>
                                    <td className="px-6 py-6 text-center whitespace-nowrap text-sm text-center">
                                        <span className={`${
                                            category.status.id === 'active' 
                                                ? 'text-green-600 dark:text-green-400' 
                                                : 'text-red-600 dark:text-red-400'
                                        }`}>
                                            {category.status.name}
                                        </span>
                                    </td>
                                    <td className="px-6 py-6 text-center whitespace-nowrap text-sm font-medium">
                                        <button
                                            onClick={() => handleDeleteClick('category', category.slug, () => deleteCategory(category.slug))}
                                            className="text-red-600 hover:text-red-900 dark:text-red-500 dark:hover:text-red-400 transition-colors duration-150 mx-4"
                                            title="Delete category"
                                        >
                                            <i className="fas fa-trash-alt"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center p-8 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                    <p className="text-gray-600 dark:text-gray-400 text-lg">No categories available</p>
                </div>
            )}
        </div>
    )
}

export default CategoriesTable
