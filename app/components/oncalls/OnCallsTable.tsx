import React from 'react'
import { useApi } from '@/app/context/ApiContext'
import { toast } from 'react-toastify'
import { useDeleteModal } from '@/app/context/DeleteModalContext'
import { OnCall } from '@/app/types/interface';

interface OnCallsTableProps {
    onCalls: OnCall[];
    fetchOnCalls: () => void;
    onEdit: (onCall: OnCall) => void;
}

const OnCallsTable = ({ onCalls, fetchOnCalls, onEdit }: OnCallsTableProps) => {
    const api = useApi()
    const { showDeleteModal } = useDeleteModal()

    const deleteOnCall = async (slug: string) => {
        try {
            const response = await api.fetch(api.endpoints.onCallDetail(slug), { 
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            const result = await response.json()

            if (response.ok) {
                toast.success(result.message || 'On Call deleted successfully')
                fetchOnCalls()
            } else {
                toast.error(result.message || 'Failed to delete on call')
            }
        } catch (error) {
            console.error('Error deleting on call:', error)
            toast.error('Failed to delete on call. Please try again.')
        }
    }

    const handleDeleteClick = (itemType: string, slug: string, deleteFunction: () => void) => {
        showDeleteModal(itemType, deleteFunction);
    };

    return (
        <div className="w-full">
            {onCalls && onCalls.length > 0 ? (
                <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-700/50">
                            <tr>
                                <th scope="col" className="px-6 py-6 text-center font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    No.
                                </th>
                                <th scope="col" className="px-6 py-6 text-center font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Site
                                </th>
                                <th scope="col" className="px-6 py-6 text-center font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Date
                                </th>
                                <th scope="col" className="px-6 py-6 text-center font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Customer
                                </th>
                                <th scope="col" className="px-6 py-6 text-center font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Service
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
                            {onCalls.map((onCall: OnCall, index: number) => (
                                <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150">
                                    <td className="px-6 py-6 text-center whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                                        {index + 1}
                                    </td>
                                    <td className="px-6 py-6 text-center whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                                        {onCall.site_name}
                                    </td>
                                    <td className="px-6 py-6 text-center whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                                        {onCall.date}
                                    </td>
                                    <td className="px-6 py-6 text-center whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                                        <div className=''>
                                            <p className=''>{onCall.customer_data.name}</p>
                                            <p className='text-gray-500 dark:text-gray-400 pt-2 text-sm'>{onCall.customer_data.mobile} / {onCall.customer_data.email || 'N/A'}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-6 text-center whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                                        <div className=''>
                                            <p className=''>{onCall.service_data.name}</p>
                                            <p className='text-gray-500 dark:text-gray-400 pt-2 text-sm'>{onCall.category_data.name}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-6 text-center whitespace-nowrap text-sm">
                                        <span className={`${
                                            onCall.status.id === 'active' 
                                                ? 'text-green-600 dark:text-green-400' 
                                                : 'text-red-600 dark:text-red-400'
                                        }`}>
                                            {onCall.status.name}
                                        </span>
                                    </td>
                                    <td className="px-6 py-6 text-center whitespace-nowrap text-sm font-medium">
                                        <button
                                            className="text-green-600 hover:text-green-900 dark:text-green-500 dark:hover:text-green-400 transition-colors duration-150 mx-4"
                                            title="View category"
                                        >
                                            <i className="fas fa-eye"></i>
                                        </button>
                                        <button
                                            onClick={() => onEdit(onCall)}
                                            className="text-blue-600 hover:text-blue-900 dark:text-blue-500 dark:hover:text-blue-400 transition-colors duration-150 mx-4"
                                            title="Edit category"
                                        >
                                            <i className="fas fa-edit"></i>
                                        </button>
                                        <button
                                            onClick={() => handleDeleteClick('onCall', onCall.slug, () => deleteOnCall(onCall.slug))}
                                            className="text-red-600 hover:text-red-900 dark:text-red-500 dark:hover:text-red-400 transition-colors duration-150 mx-4"
                                            title="Delete on call"
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

export default OnCallsTable
