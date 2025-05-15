'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { toast } from 'react-toastify'
import { useApi } from '@/app/context/ApiContext'
import { Department, Designation, Staff } from '@/app/types/interface';

interface StaffFormProps {
    fetchStaffs: () => void;
    setCreate: (create: boolean) => void;
    editData: Staff | null;
}

const StaffForm = ({ fetchStaffs, setCreate, editData }: StaffFormProps) => {
    const api = useApi();
    const [departments, setDepartments] = useState<Department[]>([]);
    const [designations, setDesignations] = useState<Designation[]>([]);
    const [staffData, setStaffData] = useState({
        first_name: '',
        mobile: '',
        email: '',
        photo: null,
        department: '',
        designation: '',
        location: '',
        aadhar: '',
        blood: '',
        contact_name: '',
        contact_number: '',
        relation: '',
        address: '',
        staff_wage: 0,
        username: '',
        password: '',
    });

    useEffect(() => {
        if (editData) {
            setStaffData({
                first_name: editData.user_data.first_name || '',
                mobile: editData.user_data.mobile || '',
                email: editData.user_data.email || '',
                photo: null,
                department: editData.department || '',
                designation: editData.designation || '',
                location: editData.location || '',
                aadhar: editData.aadhar || '',
                blood: editData.blood || '',
                contact_name: editData.contact_name || '',
                contact_number: editData.contact_number || '',
                relation: editData.relation || '',
                address: editData.address || '',
                staff_wage: editData.staff_wage || 0,
                username: editData.username || '',
                password: editData.password || '',
            });
        } else {
            setStaffData({ first_name: '', mobile: '', email: '', photo: null, department: '', designation: '', location: '', aadhar: '', blood: '', contact_name: '', contact_number: '', relation: '', address: '', staff_wage: 0, username: '', password: '' });
        }
    }, [editData]);

    const handleChange = async (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target as HTMLInputElement;
        if (type === 'file') {
            const file = (e.target as HTMLInputElement).files?.[0] || null;
            setStaffData(prev => ({ ...prev, [name]: file }));
        } else {
            setStaffData(prev => ({ ...prev, [name]: value }));

            if (name === 'department') {
                try {
                    const response = await api.fetch(`${api.endpoints.listDesignations}?department=${value}`);
                    const result = await response.json();
                    if (response.ok) {
                        setDesignations(result.data.designations);
                    } else {
                        setDesignations([]);
                    }
                } catch {
                    setDesignations([]);
                }
                setStaffData(prev => ({ ...prev, designation: '' }));
            }
        }
    };

    const resetForm = () => {
        setStaffData({ first_name: '', mobile: '', email: '', photo: null, department: '', designation: '', location: '', aadhar: '', blood: '', contact_name: '', contact_number: '', relation: '', address: '', staff_wage: 0, username: '', password: '' });
        setCreate(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const url = editData
                ? api.endpoints.staffDetail(editData.slug)
                : api.endpoints.listStaffs;
            const method = editData ? 'PUT' : 'POST';

            const formData = new FormData();
            Object.entries(staffData).forEach(([key, value]) => {
                if (key === 'photo') {
                    if (value && typeof value === 'object') {
                        formData.append(key, value as File);
                    }
                } else if (value !== undefined && value !== null && value !== '') {
                    formData.append(key, String(value));
                }
            });

            const response = await api.fetch(url, {
                method,
                body: formData,
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Failed to save staff');
            }

            toast.success(result.message || (editData ? 'Updated staff successfully' : 'Created staff successfully'));
            resetForm();
            fetchStaffs();
        } catch (error) {
            console.error('Error saving staff:', error);
            toast.error(error instanceof Error ? error.message : 'Failed to save staff. Please try again.');
        }
    };

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
        fetchDepartments()
    }, [fetchDepartments])

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <form onSubmit={handleSubmit} encType='multipart/form-data'>
                <div className="space-y-4">
                    <div className="grid grid-cols-12 gap-4">

                        <div className="col-span-12 md:col-span-6">
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Staff Name</label>
                            <input
                            onChange={handleChange}
                            type="text"
                            id="first_name"
                            name="first_name"
                            value={staffData.first_name}
                            className="form-input dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:placeholder-gray-400"
                            placeholder="Enter staff name"
                            required
                            />
                        </div>

                        <div className="col-span-12 md:col-span-6">
                            <label htmlFor="photo" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Staff Photo</label>
                            <input
                            onChange={handleChange}
                            type="file"
                            id="photo"
                            name="photo"
                            className="form-file dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:placeholder-gray-400"
                            />
                        </div>

                        <div className="col-span-12 md:col-span-6">
                            <label htmlFor="mobile" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Staff Mobile</label>
                            <input
                            onChange={handleChange}
                            type="text"
                            id="mobile"
                            name="mobile"
                            value={staffData.mobile}
                            className="form-input dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:placeholder-gray-400"
                            placeholder="Enter staff mobile"
                            required
                            />
                        </div>

                        <div className="col-span-12 md:col-span-6">
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Staff Email</label>
                            <input
                            onChange={handleChange}
                            type="email"
                            id="email"
                            name="email"
                            value={staffData.email}
                            className="form-input dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:placeholder-gray-400"
                            placeholder="Enter staff email"
                            required
                            />
                        </div>

                        <div className="col-span-12 md:col-span-4">
                            <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Staff Location</label>
                            <input
                            onChange={handleChange}
                            type="text"
                            id="location"
                            name="location"
                            value={staffData.location}
                            className="form-input dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:placeholder-gray-400"
                            placeholder="Enter staff location"
                            required
                            />
                        </div>

                        <div className="col-span-12 md:col-span-4">
                            <label htmlFor="aadhar" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Staff Aadhar</label>
                            <input
                            onChange={handleChange}
                            type="text"
                            id="aadhar"
                            name="aadhar"
                            value={staffData.aadhar}
                            className="form-input dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:placeholder-gray-400"
                            placeholder="Enter staff aadhar"
                            required
                            />
                        </div>

                        <div className="col-span-12 md:col-span-4">
                            <label htmlFor="blood" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Staff Blood Group</label>
                            <input
                            onChange={handleChange}
                            type="text"
                            id="blood"
                            name="blood"
                            value={staffData.blood}
                            className="form-input dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:placeholder-gray-400"
                            placeholder="Enter staff blood group"
                            required
                            />
                        </div>

                        <div className="col-span-12 md:col-span-4">
                            <label htmlFor="department" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Staff Department</label>
                            <select
                                onChange={handleChange}
                                id="department"
                                name="department"
                                value={staffData.department}
                                className="form-select dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:placeholder-gray-400"
                                required
                            >
                                <option value="">Select department</option>
                                {departments.map((department) => (
                                    <option key={department.id} value={department.id}>{department.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="col-span-12 md:col-span-4">
                            <label htmlFor="designation" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Staff Designation</label>
                            <select
                                onChange={handleChange}
                                id="designation"
                                name="designation"
                                value={staffData.designation}
                                className="form-select dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:placeholder-gray-400"
                                required
                            >
                                <option value="">Select designation</option>
                                {designations.map((designation) => (
                                    <option key={designation.id} value={designation.id}>{designation.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="col-span-12 md:col-span-4">
                            <label htmlFor="staff_wage" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Staff Wage</label>
                            <input
                            onChange={handleChange}
                            type="number"
                            id="staff_wage"
                            name="staff_wage"
                            value={staffData.staff_wage}
                            className="form-input dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:placeholder-gray-400"
                            placeholder="Enter staff wage"
                            required
                            />
                        </div>

                        <div className="col-span-12 md:col-span-12 py-5 border-t border-b border-gray-200 dark:border-gray-700">
                            <h1 className="text-lg font-bold text-gray-700 dark:text-gray-300 text-center">Emergency Contact Details</h1>
                        </div>

                        <div className="col-span-12 md:col-span-6">
                            <label htmlFor="contact_name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Contact Name</label>
                            <input
                            onChange={handleChange}
                            type="text"
                            id="contact_name"
                            name="contact_name"
                            value={staffData.contact_name}
                            className="form-input dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:placeholder-gray-400"
                            placeholder="Enter contact name"
                            required
                            />
                        </div>

                        <div className="col-span-12 md:col-span-6">
                            <label htmlFor="relation" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Relation</label>
                            <input
                            onChange={handleChange}
                            type="text"
                            id="relation"
                            name="relation"
                            value={staffData.relation}
                            className="form-input dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:placeholder-gray-400"
                            placeholder="Enter relation"
                            required
                            />
                        </div>

                        <div className="col-span-12 md:col-span-6">
                            <label htmlFor="contact_number" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Contact Number</label>
                            <input
                            onChange={handleChange}
                            type="text"
                            id="contact_number"
                            name="contact_number"
                            value={staffData.contact_number}
                            className="form-input dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:placeholder-gray-400"
                            placeholder="Enter contact number"
                            required
                            />
                        </div>
                        
                        <div className="col-span-12 md:col-span-6">
                            <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Contact Address</label>
                            <input
                            onChange={handleChange}
                            type="text"
                            id="address"
                            name="address"
                            value={staffData.address}
                            className="form-input dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:placeholder-gray-400"
                            placeholder="Enter contact address"
                            required
                            />
                        </div>

                        {/* Username and Password fields only for create */}
                        {!editData && (
                            <>
                                <div className="col-span-12 md:col-span-12">
                                    <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Username</label>
                                    <input
                                    onChange={handleChange}
                                    type="text"
                                    id="username"
                                    name="username"
                                    value={staffData.username}
                                    className="form-input dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:placeholder-gray-400"
                                    placeholder="Enter username"
                                    required
                                    />
                                </div>

                                <div className="col-span-12 md:col-span-12">
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
                                    <input
                                    onChange={handleChange}
                                    type="password"
                                    id="password"
                                    name="password"
                                    value={staffData.password}
                                    className="form-input dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:placeholder-gray-400"
                                    placeholder="Enter password"
                                    required
                                    />
                                </div>
                            </>
                        )}

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
                        {editData ? 'Update Staff' : 'Create Staff'}
                    </button>
                </div>
            </form>
        </div>
    )
}

export default StaffForm
