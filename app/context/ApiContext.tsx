'use client'

import { createContext, useContext } from 'react'

interface ApiEndpoints {
    login: string;
    tokenRefresh: string;

    listCategories: string;
    categoryDetail: (slug: string) => string;
}

interface Api {
    baseUrl: string;
    endpoints: ApiEndpoints;

    getHeaders: (withAuth?: boolean) => HeadersInit;
    fetch: (endpoint: string, options?: RequestInit & { withAuth?: boolean }) => Promise<Response>;
}

const api: Api = {
    // baseUrl: 'https://dearme.pythonanywhere.com/api',
    baseUrl: 'http://127.0.0.1:8000/api',

    endpoints: {
        login: '/auth/token/',
        tokenRefresh: '/auth/token/refresh/',

        listCategories: '/service/categories/',
        categoryDetail: (slug: string) => `/service/category/${slug}/`,
    },

    getHeaders: (withAuth: boolean = true): HeadersInit => {
        const headers: HeadersInit = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        };

        if (withAuth) {
            const token = document.cookie.split('token=')[1]?.split(';')[0];
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }
        }

        return headers;
    },

    fetch: async (endpoint: string, options: RequestInit & { withAuth?: boolean } = {}) => {
        const { withAuth = true, headers, ...rest } = options;
        return fetch(`${api.baseUrl}${endpoint}`, {
            headers: {
                ...api.getHeaders(withAuth),
                ...headers
            },
            ...rest
        });
    }
}

const ApiContext = createContext(api)

export const useApi = () => useContext(ApiContext)

export function ApiProvider({ children }: { children: React.ReactNode }) {
    return <ApiContext.Provider value={api}>{children}</ApiContext.Provider>
}
