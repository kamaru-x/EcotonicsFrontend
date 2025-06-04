import CategoryForm from "@/app/components/service/CategoryForm";
import React from "react";

function page() {
    return (
        <>
            <div className="mx-5 mt-8 pb-8">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                        Create Service Category
                    </h2>
                </div>
                <CategoryForm />
            </div>
        </>
    );
}

export default page;
