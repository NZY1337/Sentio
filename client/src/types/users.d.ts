export interface UserProps {
    id: string;
    createdAt: string;
    credits: number;
    freeCredits: number;
    email: string;
    username: string;
    role: string;
    updatedAt: string;
    [key: string]: unknown; // Allow additional properties
}