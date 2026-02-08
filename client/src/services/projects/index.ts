import { BACKEND_URL } from '../../helpers/constants';

export type CreateProjectDto = {
    prompt: string;
    category: string;
    designTheme: string;
    spaceType: string;
    size?: string;
    quality?: string;
    background?: string;
    outputFormat?: string;
    n?: number;
}

export type UpdateProjectDto = {
    prompt?: string;
    category?: string;
    designTheme?: string;
    spaceType?: string;
    size?: string;
    quality?: string;
    background?: string;
    outputFormat?: string;
    n?: number;
}

const getProjects = async (token: string) => {
    const response = await fetch(`${BACKEND_URL}/project`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch projects');
    }

    return response.json();
};

const getProjectById = async (projectId: string, token: string) => {
    const response = await fetch(`${BACKEND_URL}/project/${projectId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch project');
    }

    return response.json();
};

const createProject = async (data: CreateProjectDto, token: string) => {
    const response = await fetch(`${BACKEND_URL}/project`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create project');
    }

    return response.json();
};

const updateProject = async (projectId: string, data: UpdateProjectDto, token: string) => {
    const response = await fetch(`${BACKEND_URL}/project/${projectId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update project');
    }

    return response.json();
};

const deleteProject = async (projectId: string, token: string) => {
    const response = await fetch(`${BACKEND_URL}/project/${projectId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete project');
    }

    return response.json();
};

export const projectService = {
    getProjects,
    getProjectById,
    createProject,
    updateProject,
    deleteProject,
};
