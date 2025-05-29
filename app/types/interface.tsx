interface Status {
    id: string;
    name: string;
}

export interface CustomerType {
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

export interface User {
    id: number;
    first_name: string;
    mobile: string;
    email: string;
    username: string;
    photo: string;
}

export interface Staff {
    id: number;
    slug: string;
    status: Status;
    user_data: User;
    department: string;
    designation: string;
    department_data: Department;
    designation_data: Designation;
    location: string;
    aadhar: string;
    blood: string;
    contact_name: string;
    contact_number: string;
    relation: string;
    address: string;
    staff_wage: number;
    username: string;
    password: string;
}

export interface Customer {
    id: number;
    slug: string;
    status: Status;
    type: CustomerType;
    name: string;
    location: string;
    mobile: string;
    email: string;
}

export interface OnCall {
    id: number;
    slug: string;
    status: Status;
    date: string;
    type: CustomerType;
    work_type: 'individual' | 'enterprise';
    site_name: string;
    customer: string;
    customer_data: Customer;
    category: string;
    category_data: Category;
    service: string;
    service_data: Service;
    name?: string;
    mobile?: string;
    email?: string;
    location?: string;
    info: string;
}