"use client";
import React, { useCallback, useEffect, useState } from "react";
import { Category } from "@/app/types/interface";
import { useApi } from "@/app/context/ApiContext";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import OverviewCard from "@/app/components/elements/OverviewCard";
import CategoriesTable from "@/app/components/service/CategoriesTable";

function page() {
    const [categories, setCategories] = useState<Category[]>([]);
    const api = useApi();
    const router = useRouter();

    console.log(categories, "categories");

    const [stats, setStats] = useState({
        total_categories: 0,
        active_categories: 0,
        inactive_categories: 0,
    });

    const fetchCategories = useCallback(async () => {
        try {
            const response = await api.fetch(api.endpoints.listCategories);
            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || "Failed to fetch categories");
            }

            const data = result.data;
            setCategories(data.categories);
            setStats({
                total_categories: data.total_categories,
                active_categories: data.active_categories,
                inactive_categories: data.inactive_categories,
            });
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
        fetchCategories();
    }, [fetchCategories]);
    const handleEdit = (category: Category) => {
        router.push(`/services/categories/${category.slug}/edit/`);
    };

    return (
        <>
            <div className="mx-5">
                <div className="grid md:grid-cols-3 gap-6 mt-8">
                    <OverviewCard
                        color="bg-gradient-to-r from-blue-400 to-blue-500"
                        icon="fas fa-gear"
                        title="Total Categories"
                        value={stats.total_categories}
                    />
                    <OverviewCard
                        color="bg-gradient-to-r from-blue-400 to-blue-500"
                        icon="fas fa-check-circle"
                        title="Active Categories"
                        value={stats.active_categories}
                    />
                    <OverviewCard
                        color="bg-gradient-to-r from-blue-400 to-blue-500"
                        icon="fas fa-times-circle"
                        title="Inactive Categories"
                        value={stats.inactive_categories}
                    />
                </div>
                <div className="mt-8 pb-8">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                            Service Categories
                        </h2>

                        <button
                            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors duration-200"
                            onClick={() => {
                                router.push("/services/categories/create");
                            }}
                        >
                            Add Category
                        </button>
                    </div>
                    <CategoriesTable
                        categories={categories}
                        fetchCategories={fetchCategories}
                        onEdit={handleEdit}
                    />
                </div>
            </div>
        </>
    );
}

export default page;
