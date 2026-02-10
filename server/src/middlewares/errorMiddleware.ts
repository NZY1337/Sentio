import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from "http-status-codes";
import { Prisma } from "@prisma/client";
import { ZodError } from "zod";

export enum ErrorCode {
    NOT_FOUND = StatusCodes.NOT_FOUND,
    BAD_REQUEST = StatusCodes.BAD_REQUEST,
    USER_ALREADY_EXISTS = StatusCodes.CONFLICT,
    INCORRECT_PASSWORD = StatusCodes.BAD_REQUEST,
    UNPROCESSABLE_ENTITY = StatusCodes.UNPROCESSABLE_ENTITY,
    INTERNAL_EXCEPTION = StatusCodes.INTERNAL_SERVER_ERROR,
    UNAUTHORIZED = StatusCodes.UNAUTHORIZED,
    CONFLICT = StatusCodes.CONFLICT,
    INSUFFICIENT_CREDITS = StatusCodes.PAYMENT_REQUIRED,
}

export const errorMiddleware = (err: any, req: Request, res: Response, next: NextFunction) => {
    const statusCode = err.status || 500;
    const message = err.message || 'Internal Server Error';

    res.status(statusCode).json({
        success: false,
        status: statusCode,
        error: message,
    });
};

export class HttpException extends Error {
    status: number;
    message: string;

    constructor(status: number, message: string) {
        super(message);
        this.status = status;
        this.message = message;
    }
}

export class NotFoundException extends HttpException {
    constructor(status: ErrorCode, message: string,) {
        super(status, message);
    }
}

export class BadRequestException extends HttpException {
    constructor(status: ErrorCode, message: string,) {
        super(status, message);
    }
}

export class InternalException extends HttpException {
    constructor(status: ErrorCode, message: string,) {
        super(status, message);
    }
}

export class UnauthorizedException extends HttpException {
    constructor(status: ErrorCode, message: string,) {
        super(status, message);
    }
}

export class UnprocessableEntity extends HttpException {
    constructor(status: ErrorCode, message: string,) {
        super(status, message);
    }
}

export const errorHandler = (method: Function) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await method(req, res, next);
        } catch (error: any) {
            console.log(error)
            let exception: HttpException;
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
                const modelName = error?.meta?.modelName || "Resource"; // Product, User, Comment, etc...
                exception = new NotFoundException(ErrorCode.NOT_FOUND, `${modelName} not found`);
            } else if (error instanceof HttpException) {
                exception = error;
            } else if (error instanceof ZodError) {
                exception = new BadRequestException(ErrorCode.UNPROCESSABLE_ENTITY, "Unprocessed Entity - Validation Error");
            } else {
                exception = new InternalException(ErrorCode.INTERNAL_EXCEPTION, "Something went wrong!",);
            }

            next(exception);
        }
    };
};