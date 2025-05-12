interface Status {
    id: string;
    name: string;
}

export interface Category {
    id: number;
    name: string;
    info: string;
    status: Status;
    services: number;
    slug: string;
}