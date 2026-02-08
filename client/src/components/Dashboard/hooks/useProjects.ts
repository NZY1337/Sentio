import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { projectService } from '../../../services/projects';
import type { CreateProjectDto, UpdateProjectDto } from '../../../services/projects';
import { useAuth } from '@clerk/clerk-react';

export const useProjects = () => {
    const { getToken } = useAuth();

    return useQuery({
        queryKey: ['projects'],
        queryFn: async () => {
            const token = await getToken();
            if (!token) throw new Error('No authentication token');
            return projectService.getProjects(token);
        },
    });
};

export const useProject = (projectId: string) => {
    const { getToken } = useAuth();

    return useQuery({
        queryKey: ['project', projectId],
        queryFn: async () => {
            const token = await getToken();
            if (!token) throw new Error('No authentication token');
            return projectService.getProjectById(projectId, token);
        },
        enabled: !!projectId,
    });
};

export const useCreateProject = () => {
    const queryClient = useQueryClient();
    const { getToken } = useAuth();

    return useMutation({
        mutationFn: async (data: CreateProjectDto) => {
            const token = await getToken();
            if (!token) throw new Error('No authentication token');
            return projectService.createProject(data, token);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['projects'] });
        },
    });
};

export const useUpdateProject = () => {
    const queryClient = useQueryClient();
    const { getToken } = useAuth();

    return useMutation({
        mutationFn: async ({ projectId, data }: { projectId: string; data: UpdateProjectDto }) => {
            const token = await getToken();
            if (!token) throw new Error('No authentication token');
            return projectService.updateProject(projectId, data, token);
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['projects'] });
            queryClient.invalidateQueries({ queryKey: ['project', variables.projectId] });
        },
    });
};

export const useDeleteProject = () => {
    const queryClient = useQueryClient();
    const { getToken } = useAuth();

    return useMutation({
        mutationFn: async (projectId: string) => {
            const token = await getToken();
            if (!token) throw new Error('No authentication token');
            return projectService.deleteProject(projectId, token);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['projects'] });
        },
    });
};
