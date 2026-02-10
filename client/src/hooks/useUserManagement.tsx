import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUsers, updateUserRole, deleteUser } from '../services/users'; // adjust import path
import { useNotifications } from '@toolpad/core';
import { useAuth } from '@clerk/clerk-react';

import type { UserProps } from '../types'; // adjust import path

export const useUsersManagement = ({
    onUserDeleted = () => { },
    onDeleteModalClose = () => { },
}: {
    onUserDeleted?: () => void;
    onDeleteModalClose?: () => void;
} = {}) => {
    const queryClient = useQueryClient();
    const notifications = useNotifications();
    const { getToken } = useAuth();

    const { isPending, error, data: users, } = useQuery({
        queryKey: ['users'],
        queryFn: async () => {
            const token = await getToken();
            if (!token) throw new Error('No authentication token');
            return getUsers(token);
        },
    });

    const updateUserRoleMutation = useMutation({
        mutationFn: async ({ userId, role }: { userId: UserProps['id']; role: UserProps['role'] }) => {
            const token = await getToken();
            if (!token) throw new Error('No authentication token');
            return updateUserRole(userId, role, token);
        },

        onMutate: async ({ userId, role }) => {
            await queryClient.cancelQueries({ queryKey: ['users'] });

            const previousUsers = queryClient.getQueryData<UserProps[]>(['users']);

            queryClient.setQueryData(['users'], (old: UserProps[]) =>
                old.map((user: UserProps) =>
                    user.id === userId ? { ...user, role } : user
                ) || []
            );

            return { previousUsers };
        },

        onSuccess: (_data, variables) => {
            // toast('Role changed to ' + variables.role);
            notifications.show('Role changed to ' + variables.role, {
                severity: 'success',
                autoHideDuration: 3000
            })
        },
    });

    const deleteUserMutation = useMutation({
        mutationFn: async (userId: string) => {
            const token = await getToken();
            if (!token) throw new Error('No authentication token');
            return deleteUser(userId, token);
        },

        onMutate: async (userId: string) => {
            await queryClient.cancelQueries({ queryKey: ['users'] });

            const previousUsers = queryClient.getQueryData<UserProps[]>(['users']);

            queryClient.setQueryData(['users'], (old: UserProps[]) =>
                old.filter((user: UserProps) => user.id !== userId)
            );

            return { previousUsers: previousUsers || [] };
        },

        onError: (error, _, context?: { previousUsers: UserProps[] }) => {
            if (context && context.previousUsers) {
                queryClient.setQueryData(['users'], context.previousUsers);
            }
            onDeleteModalClose();
            notifications.show(error.message, {
                severity: 'error',
                autoHideDuration: 3000
            })
        },

        onSuccess: () => {
            onUserDeleted();
            onDeleteModalClose();
            notifications.show('User deleted successfully. ', {
                severity: 'success',
                autoHideDuration: 3000
            })
        },
    });

    return {
        users,
        isPending,
        error,
        updateUserRoleMutation,
        deleteUserMutation,
    };
};
