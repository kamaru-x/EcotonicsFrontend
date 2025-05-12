interface Status {
    id: string;
    name: string;
}

export interface Category {
    id: number;
    slug: string;
    name: string;
    info: string;
    status: Status;
    services: number;
}

export interface Service {
    id: number;
    slug: string;
    name: string;
    info: string;
    status: Status;
    category: Category;
    category_name: string;
    category_id: string;
    on_calls: number;
}

export interface Department {
    id: number;
    slug: string;
    name: string;
    info: string;
    designations: number;
    staffs: number;
}

export interface Designation {
    id: number;
    slug: string;
    department: Department;
    department_name: string;
    department_id: string;
    staffs: number;
    name: string;
    info: string;
}