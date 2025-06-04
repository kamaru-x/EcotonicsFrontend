"use client";

import React, { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { useApi } from "@/app/context/ApiContext";
import { useParams, useRouter } from "next/navigation";

const CategoryForm = () => {
    const api = useApi();
    const router = useRouter();
    const param = useParams();
    const slug = Array.isArray(param.slug) ? param.slug[0] : param.slug ?? "";
    // categoryDetail

    const [categoryData, setCategoryData] = useState({
        name: "",
        info: "",
    });

    const fetchCategories = useCallback(async () => {
        try {
            const response = await api.fetch(
                api.endpoints.categoryDetail(slug)
            );
            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || "Failed to fetch categories");
            }

            const data = result.data;
            console.log(data, "data");
            setCategoryData(data);
        } catch (error) {
            console.error("Error fetching categories:", error);
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Failed to fetch categories"
            );
        }
    }, [api]);

    useEffect(() => {
        if (slug) {
            fetchCategories();
        }
    }, [slug]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setCategoryData((prev) => ({ ...prev, [name]: value }));
    };

    const resetForm = () => {
        setCategoryData({ name: "", info: "" });
        router.back();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const url = slug
                ? api.endpoints.categoryDetail(slug)
                : api.endpoints.listCategories;
            const method = slug ? "PUT" : "POST";

            const response = await api.fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(categoryData),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || "Failed to save category");
            }

            toast.success(
                result.message ||
                    `${slug ? "Updated" : "Created"} category successfully`
            );
            resetForm();
        } catch (error) {
            console.error("Error saving category:", error);
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Failed to save category. Please try again."
            );
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                    <div>
                        <label
                            htmlFor="name"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                            Category Name
                        </label>
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
                        <label
                            htmlFor="info"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                            Description
                        </label>
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
                        onClick={resetForm}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                    >
                        {slug ? "Update Category" : "Create Category"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CategoryForm;
