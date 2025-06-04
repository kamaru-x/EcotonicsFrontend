"use client";

import React from "react";
import Header from "@/app/components/Header";
import Sidebar from "@/app/components/Sidebar";
import ThemeToggle from "../components/ThemeToggle";

export default function PagesLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen">
            <Sidebar />
            <div className="lg:ml-[calc(16rem+2.5rem)] px-4 lg:px-0">
                <Header />
                <main className="pt-20 lg:pt-20 -mx-4 lg:-ml-5 lg:mr-0">
                    {children}
                    <ThemeToggle />
                </main>
            </div>
        </div>
    );
}
