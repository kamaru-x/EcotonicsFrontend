'use client'

import React, { useState, useEffect } from 'react'
import OverviewCard from '@/app/components/elements/OverviewCard'
import ThemeToggle from '@/app/components/ThemeToggle'
import { useApi } from '@/app/context/ApiContext'

const Page = () => {
    return (
        <div className="min-h-screen mx-5">
            <div className="w-full">
                <div className="grid md:grid-cols-3 gap-6 mt-8">
                    <OverviewCard 
                        color="bg-gradient-to-r from-blue-400 to-blue-500" 
                        icon="fas fa-indian-rupee-sign" 
                        title="This Month's Income" 
                        value={0}
                    />
                    <OverviewCard 
                        color="bg-gradient-to-r from-blue-400 to-blue-500" 
                        icon="fas fa-indian-rupee-sign" 
                        title="This Month's Expense" 
                        value={0}
                    />
                    <OverviewCard 
                        color="bg-gradient-to-r from-blue-400 to-blue-500" 
                        icon="fas fa-circle-check" 
                        title="Completed Todos" 
                        value={0}
                    />
                </div>
            </div>

            <ThemeToggle />
        </div>
    )
}

export default Page