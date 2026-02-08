import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import GenericDialog from '../../UtilityComponents/modals/GenericDialog';
import { DataGrid } from '@mui/x-data-grid/DataGrid';

// hooks
import { useState } from 'react';
import { useUsersManagement } from '../../../hooks/useUserManagement';

// types
import type { UserProps } from '../../../types';
import type { GridColDef } from '@mui/x-data-grid';


export const Users = () => {
    const [updatedRole, setUpdatedRole] = useState<{ [userId: string]: string }>({});
    const [open, setOpen] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

    const { users, isPending, error, updateUserRoleMutation, deleteUserMutation } = useUsersManagement({
        onUserDeleted: () => {
            setSelectedUserId(null);
            setOpen(false);
        },
        onDeleteModalClose: () => {
            setSelectedUserId(null);
            setOpen(false);
        }
    });

    const columns = [
        { field: 'username', headerName: 'Username', width: 130 },
        { field: 'email', headerName: 'Email', width: 250 },
        {
            field: 'role', headerName: 'Role', width: 150, sortable: false, renderCell: (params: { row: UserProps }) => {
                const selectedRole = updatedRole[params.row.id] || params.row.role;

                return (
                    <Box>
                        <Select
                            value={selectedRole}
                            onChange={(e) => handleRoleChange(params.row.id, e.target.value)}
                            size="small"
                        >
                            <MenuItem value="user">User</MenuItem>
                            <MenuItem value="admin">Admin</MenuItem>
                        </Select>
                    </Box>
                )
            }
        },
        {
            field: 'createdAt',
            headerName: 'Created At',
            width: 180,
            valueFormatter: (date: UserProps['createdAt']) => new Date(date).toLocaleString(),
        },
        {
            field: 'updatedAt',
            headerName: 'Updated At',
            width: 180,
            valueFormatter: (date: UserProps['updatedAt']) => new Date(date).toLocaleString(),
        },
        {
            field: 'actions', headerName: 'Actions', width: 200, sortable: false, renderCell: (params: UserProps) => {
                const user = params?.row as UserProps;
                const selectedRole = updatedRole[user.id] || user.role as UserProps['id'];

                return (
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', justifyContent: 'center' }}>
                        <Button
                            variant="text"
                            size="small"
                            onClick={() => updateUserRoleMutation.mutate({ userId: user.id, role: selectedRole })}
                            disabled={selectedRole === user.role}
                            sx={{ mr: 1, color: 'secondary' }}
                        >
                            Update Role
                        </Button>

                        <Button
                            variant="text"
                            size="small"
                            onClick={() => {
                                setOpen(true);
                                setSelectedUserId((params?.row as UserProps).id);
                            }}
                            sx={{ mr: 1 }}
                        >
                            Delete
                        </Button>
                    </Box>
                );
            },
        },
    ] as GridColDef[];

    const handleRoleChange = (userId: string, newRole: string) => {
        setUpdatedRole((prev) => ({
            ...prev,
            [userId]: newRole,
        }));
    };

    if (isPending) return <Container>'Loading...'</Container>

    if (error) return <Container>{`An error has occurred: ${error.message}`}</Container>

    return (
        <Container>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <DataGrid
                    sx={{
                        '& .MuiDataGrid-cell': {
                            display: 'flex', alignItems: 'center',
                        },
                    }}
                    columns={columns} rows={users || []} />
            </div>

            <GenericDialog open={open} onClose={() => setOpen(false)}>
                <>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                        Are you sure you want to delete this user?
                    </Typography>
                    <Stack direction="row" spacing={2}>
                        <Button variant="contained" color="error" onClick={() => deleteUserMutation.mutate(selectedUserId!)}>
                            Yes
                        </Button>
                        <Button variant="outlined" onClick={() => setOpen(false)}>
                            Cancel
                        </Button>
                    </Stack>
                </>
            </GenericDialog>
        </Container >
    )
}
