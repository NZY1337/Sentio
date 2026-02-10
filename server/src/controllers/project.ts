import { Request, Response } from "express";
import { prismaClient } from "../services/prismaClient";
import { ProjectValidator } from "../validation/project";

// middleware
import {
    BadRequestException,
    ErrorCode,
    NotFoundException,
} from "../middlewares/errorMiddleware";

export const getProjects = async (req: Request, res: Response) => {
    const projects = await prismaClient.project.findMany({
        where: {
            userId: req.auth.userId,
        },
    });

    res.status(200).json({ projects });
};

export const getProjectById = async (req: Request, res: Response) => {
    const { userId } = req.auth;
    const { projectId } = req.params;

    const project = await prismaClient.project.findFirst({
        where: {
            id: projectId,
            userId,
        },
    });

    if (!project) {
        throw new NotFoundException(ErrorCode.NOT_FOUND, "Project not found");
    }

    res.status(200).json({ project });
};

export const createProject = async (req: Request, res: Response) => {
    const { userId } = req.auth;

    const validationResult = ProjectValidator.safeParse(req.body);

    if (!validationResult.success) {
        console.log("Validation errors:", validationResult.error.errors);
        throw new BadRequestException(ErrorCode.BAD_REQUEST, `Invalid request body: ${JSON.stringify(validationResult.error.errors)}`);
    }

    const { prompt, category, designTheme, spaceType, size, quality, outputFormat, n } = validationResult.data;

    const project = await prismaClient.project.create({
        data: {
            userId,
            prompt,
            category,
            designTheme,
            spaceType,
            size: size || 'SIZE_1024x1024',
            quality: quality || 'MEDIUM',
            outputFormat: outputFormat || 'PNG',
            n: n || 1,
        },
    });

    res.status(201).json({ project });
};

export const updateProject = async (req: Request, res: Response) => {
    const { userId } = req.auth;
    const { projectId } = req.params;

    const project = await prismaClient.project.findFirst({
        where: {
            id: projectId,
            userId,
        },
    });

    if (!project) {
        throw new NotFoundException(ErrorCode.NOT_FOUND, "Project not found");
    }

    const validationResult = ProjectValidator.partial().safeParse(req.body);

    if (!validationResult.success) {
        throw new BadRequestException(ErrorCode.BAD_REQUEST, `Invalid request body: ${JSON.stringify(validationResult.error.errors)}`);
    }

    const updatedProject = await prismaClient.project.update({
        where: {
            id: projectId,
        },
        data: validationResult.data,
    });

    res.status(200).json({ project: updatedProject });
};

export const deleteProject = async (req: Request, res: Response) => {
    const { userId } = req.auth;
    const { projectId } = req.params;

    const project = await prismaClient.project.findFirst({
        where: {
            id: projectId,
            userId,
        },
    });

    if (!project) {
        throw new NotFoundException(ErrorCode.NOT_FOUND, "Project not found");
    }

    await prismaClient.project.delete({
        where: {
            id: projectId,
        },
    });

    res.status(200).json({ message: "Project deleted successfully" });
};
