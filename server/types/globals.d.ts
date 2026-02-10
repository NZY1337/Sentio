import { Role } from "@prisma/client";

export { };

declare global {
    namespace Express {
        export interface Request {
            auth: {
                userId: string;
            }
            userRoles?: Role[];
        }
    }
}
