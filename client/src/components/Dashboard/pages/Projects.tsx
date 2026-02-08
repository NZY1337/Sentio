import React, { useState } from 'react';
import { Box, Button, Typography, CircularProgress, Card, CardContent, CardActions, Chip, IconButton, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import { useProjects, useDeleteProject } from '../hooks/useProjects';
import ProjectForm from '../components/ProjectForm';

const Projects: React.FC = () => {
    const { data, isLoading, error } = useProjects();
    const deleteProjectMutation = useDeleteProject();
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingProject, setEditingProject] = useState<any>(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [projectToDelete, setProjectToDelete] = useState<string | null>(null);

    const handleEditClick = (project: any) => {
        setEditingProject(project);
        setIsFormOpen(true);
    };

    const handleDeleteClick = (projectId: string) => {
        setProjectToDelete(projectId);
        setDeleteDialogOpen(true);
    };

    const handleCloseForm = () => {
        setIsFormOpen(false);
        setEditingProject(null);
    };

    const handleDeleteConfirm = async () => {
        if (projectToDelete) {
            try {
                await deleteProjectMutation.mutateAsync(projectToDelete);
                setDeleteDialogOpen(false);
                setProjectToDelete(null);
            } catch (error) {
                console.error('Failed to delete project:', error);
            }
        }
    };

    const handleDeleteCancel = () => {
        setDeleteDialogOpen(false);
        setProjectToDelete(null);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    if (isLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box p={3}>
                <Typography color="error">
                    Error loading projects: {error.message}
                </Typography>
            </Box>
        );
    }

    const projects = data?.projects || [];

    return (
        <Box p={3}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4" component="h1">
                    Projects
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => setIsFormOpen(true)}
                >
                    New Project
                </Button>
            </Box>

            {projects.length === 0 ? (
                <Card>
                    <CardContent>
                        <Typography variant="body1" color="text.secondary" align="center">
                            No projects yet. Create your first project to get started!
                        </Typography>
                    </CardContent>
                </Card>
            ) : (
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 3 }}>
                    {projects.map((project: any) => (
                        <Card key={project.id}>
                            <CardContent>
                                <Typography variant="h6" gutterBottom noWrap>
                                    {project.prompt.substring(0, 50)}
                                    {project.prompt.length > 50 ? '...' : ''}
                                </Typography>
                                <Box mt={2} mb={2} display="flex" flexWrap="wrap" gap={1}>
                                    <Chip
                                        label={project.category}
                                        size="small"
                                        color="primary"
                                    />
                                    <Chip
                                        label={project.designTheme}
                                        size="small"
                                        variant="outlined"
                                    />
                                    <Chip
                                        label={project.spaceType}
                                        size="small"
                                        variant="outlined"
                                    />
                                </Box>
                                <Typography variant="body2" color="text.secondary">
                                    Quality: {project.quality}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Size: {project.size.replace('SIZE_', '')}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Images: {project.images?.length || 0}
                                </Typography>
                                <Typography variant="caption" color="text.secondary" display="block" mt={1}>
                                    Created: {formatDate(project.createdAt)}
                                </Typography>
                            </CardContent>
                            <CardActions sx={{ justifyContent: 'flex-end' }}>
                                <IconButton
                                    size="small"
                                    color="primary"
                                    onClick={() => handleEditClick(project)}
                                >
                                    <EditIcon />
                                </IconButton>
                                <IconButton
                                    size="small"
                                    color="error"
                                    onClick={() => handleDeleteClick(project.id)}
                                    disabled={deleteProjectMutation.isPending}
                                >
                                    <DeleteIcon />
                                </IconButton>
                            </CardActions>
                        </Card>
                    ))}
                </Box>
            )}

            <ProjectForm open={isFormOpen} onClose={handleCloseForm} project={editingProject} />

            <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this project? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDeleteCancel}>Cancel</Button>
                    <Button
                        onClick={handleDeleteConfirm}
                        color="error"
                        variant="contained"
                        disabled={deleteProjectMutation.isPending}
                    >
                        {deleteProjectMutation.isPending ? <CircularProgress size={24} /> : 'Delete'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Projects;
