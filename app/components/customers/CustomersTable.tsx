import React from 'react'
import { useApi } from '@/app/context/ApiContext'
import { toast } from 'react-toastify'
import { useDeleteModal } from '@/app/context/DeleteModalContext'
import { Customer } from '@/app/types/interface';

interface CustomersTableProps {
    customers: Customer[];
    fetchCustomers: () => void;
    onEdit: (customer: Customer) => void;
}

const CustomersTable = ({ customers, fetchCustomers, onEdit }: CustomersTableProps) => {
    const api = useApi()
    const { showDeleteModal } = useDeleteModal()

    const deleteCustomer = async (slug: string) => {
        try {
            const response = await api.fetch(api.endpoints.customerDetail(slug), { 
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            const result = await response.json()

            if (response.ok) {
                toast.success(result.message || 'Customer deleted successfully')
                fetchCustomers()
            } else {
                toast.error(result.message || 'Failed to delete customer')
            }
        } catch (error) {
            console.error('Error deleting customer:', error)
            toast.error('Failed to delete customer. Please try again.')
        }
    }

    const handleDeleteClick = (itemType: string, slug: string, deleteFunction: () => void) => {
        showDeleteModal(itemType, deleteFunction);
    };

    return (
        <div className="w-full">
            {customers && customers.length > 0 ? (
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
                                    Type
                                </th>
                                <th scope="col" className="px-6 py-6 text-center font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Mobile
                                </th>
                                <th scope="col" className="px-6 py-6 text-center font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Email
                                </th>
                                <th scope="col" className="px-6 py-6 text-center font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Location
                                </th>
                                <th scope="col" className="px-6 py-6 text-center font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {customers.map((customer: Customer, index: number) => (
                                <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150">
                                    <td className="px-6 py-6 text-center whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                                        {index + 1}
                                    </td>
                                    <td className="px-6 py-6 text-center whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                                        {customer.name}
                                    </td>
                                    <td className="px-6 py-6 text-center whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                                        {customer.type.name}
                                    </td>
                                    <td className="px-6 py-6 text-center whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                                        {customer.mobile}
                                    </td>
                                    <td className="px-6 py-6 text-center whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                                        {customer.email}
                                    </td>
                                    <td className="px-6 py-6 text-center whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                                        {customer.location}
                                    </td>
                                    <td className="px-6 py-6 text-center whitespace-nowrap text-sm font-medium">
                                        <button
                                            className="text-green-600 hover:text-green-900 dark:text-green-500 dark:hover:text-green-400 transition-colors duration-150 mx-4"
                                            title="View category"
                                        >
                                            <i className="fas fa-eye"></i>
                                        </button>
                                        <button
                                            onClick={() => onEdit(customer)}
                                            className="text-blue-600 hover:text-blue-900 dark:text-blue-500 dark:hover:text-blue-400 transition-colors duration-150 mx-4"
                                            title="Edit category"
                                        >
                                            <i className="fas fa-edit"></i>
                                        </button>
                                        <button
                                            onClick={() => handleDeleteClick('customer', customer.slug, () => deleteCustomer(customer.slug))}
                                            className="text-red-600 hover:text-red-900 dark:text-red-500 dark:hover:text-red-400 transition-colors duration-150 mx-4"
                                            title="Delete customer"
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

export default CustomersTable