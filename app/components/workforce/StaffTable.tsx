import React from 'react'
import { useApi } from '@/app/context/ApiContext'
import { Staff } from '@/app/types/interface'

interface StaffTableProps {
    staffs: Staff[];
    fetchStaffs: () => void;
    onEdit: (staff: Staff) => void;
}

const StaffTable = ({ staffs, fetchStaffs, onEdit }: StaffTableProps) => {
    const api = useApi()

    return (
        <div className="w-full">
            {staffs && staffs.length > 0 ? (
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
                                    Photo
                                </th>
                                <th scope="col" className="px-6 py-6 text-center font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Contact
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
                            {staffs.map((staff: Staff, index: number) => (
                                <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150">
                                    <td className="px-6 py-6 text-center whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                                        {index + 1}
                                    </td>
                                    <td className="px-6 py-6 text-center whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                                        <div className=''>
                                            <p className=''>{staff.user_data.first_name}</p>
                                            <p className='text-gray-500 dark:text-gray-400 pt-2'>{staff.department_data.name} / {staff.designation_data.name}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-6 text-center whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                                        <div className='flex items-center justify-center'>
                                            <img src={staff.user_data.photo} alt={staff.user_data.first_name} className="w-14 h-14 rounded-full object-cover" />
                                        </div>
                                    </td>
                                    <td className="px-6 py-6 text-center whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                                        <div className=''>
                                            <p className=''>{staff.user_data.mobile}</p>
                                            <p className='text-gray-500 dark:text-gray-400 pt-2'>{staff.user_data.email}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-6 text-center whitespace-nowrap text-sm text-center">
                                        <span className={`${
                                            staff.status.name === 'active' 
                                                ? 'text-green-600 dark:text-green-400' 
                                                : 'text-red-600 dark:text-red-400'
                                        }`}>
                                            {staff.status.name}
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
                                            onClick={() => onEdit(staff)}
                                            className="text-blue-600 hover:text-blue-900 dark:text-blue-500 dark:hover:text-blue-400 transition-colors duration-150 mx-4"
                                            title="Edit staff"
                                        >
                                            <i className="fas fa-edit"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center p-8 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                    <p className="text-gray-600 dark:text-gray-400 text-lg">No staffs available</p>
                </div>
            )}
        </div>
    )
}

export default StaffTable
