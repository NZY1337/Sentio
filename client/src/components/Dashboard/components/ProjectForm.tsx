import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Box,
    CircularProgress,
} from '@mui/material';
import { useCreateProject, useUpdateProject } from '../hooks/useProjects';
import type { CreateProjectDto } from '../../../services/projects';

interface ProjectFormProps {
    open: boolean;
    onClose: () => void;
    project?: any;
}

const CATEGORIES = ['DESIGN_GENERATOR', 'DESIGN_EDITOR'];
const SPACE_TYPES = [
    'LIVING_ROOM',
    'BEDROOM',
    'KITCHEN',
    'BATHROOM',
    'DINING_ROOM',
    'HOME_OFFICE',
    'KIDS_ROOM',
    'HALLWAY_CORRIDOR',
    'BALCONY_TERRACE',
    'GAME_ROOM',
    'STUDY',
];
const DESIGN_THEMES = [
    'MODERN',
    'CONTEMPORARY',
    'MINIMALIST',
    'SCANDINAVIAN',
    'INDUSTRIAL',
    'MID_CENTURY_MODERN',
    'TRADITIONAL',
    'CLASSIC',
    'BAROQUE',
    'JAPANESE_ZEN',
    'WABI_SABI',
    'FARMHOUSE',
    'RUSTIC',
    'BOHEMIAN',
    'ART_DECO',
    'VICTORIAN',
    'COASTAL',
    'TROPICAL',
    'URBAN',
    'MAXIMALIST',
    'FUTURISTIC',
];
const SIZES = ['SIZE_1024x1024', 'SIZE_1024x1536', 'SIZE_1536x1024', 'AUTO'];
const QUALITIES = ['HIGH', 'MEDIUM', 'LOW'];
const OUTPUT_FORMATS = ['PNG', 'JPEG', 'WEBP'];

const ProjectForm: React.FC<ProjectFormProps> = ({ open, onClose, project }) => {
    const createProjectMutation = useCreateProject();
    const updateProjectMutation = useUpdateProject();
    const isEditMode = !!project;

    const [formData, setFormData] = useState<CreateProjectDto>({
        prompt: '',
        category: 'DESIGN_GENERATOR',
        designTheme: 'MODERN',
        spaceType: 'LIVING_ROOM',
        size: 'SIZE_1024x1024',
        quality: 'MEDIUM',
        background: 'auto',
        outputFormat: 'PNG',
        n: 1,
    });

    useEffect(() => {
        if (project) {
            setFormData({
                prompt: project.prompt || '',
                category: project.category || 'DESIGN_GENERATOR',
                designTheme: project.designTheme || 'MODERN',
                spaceType: project.spaceType || 'LIVING_ROOM',
                size: project.size || 'SIZE_1024x1024',
                quality: project.quality || 'MEDIUM',
                background: project.background || 'auto',
                outputFormat: project.outputFormat || 'PNG',
                n: project.n || 1,
            });
        } else {
            setFormData({
                prompt: '',
                category: 'DESIGN_GENERATOR',
                designTheme: 'MODERN',
                spaceType: 'LIVING_ROOM',
                size: 'SIZE_1024x1024',
                quality: 'MEDIUM',
                background: 'auto',
                outputFormat: 'PNG',
                n: 1,
            });
        }
    }, [project]);

    const handleChange = (field: keyof CreateProjectDto) => (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | { target: { value: unknown } }
    ) => {
        const value = e.target.value;
        setFormData((prev) => ({
            ...prev,
            [field]: field === 'n' ? Number(value) : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (isEditMode && project?.id) {
                await updateProjectMutation.mutateAsync({
                    projectId: project.id,
                    data: formData,
                });
            } else {
                await createProjectMutation.mutateAsync(formData);
            }
            onClose();
        } catch (error) {
            console.error(`Failed to ${isEditMode ? 'update' : 'create'} project:`, error);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>{isEditMode ? 'Edit Project' : 'Create New Project'}</DialogTitle>
            <form onSubmit={handleSubmit}>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <TextField
                            label="Prompt"
                            multiline
                            rows={4}
                            value={formData.prompt}
                            onChange={handleChange('prompt')}
                            required
                            fullWidth
                        />

                        <FormControl fullWidth required>
                            <InputLabel>Category</InputLabel>
                            <Select
                                value={formData.category}
                                label="Category"
                                onChange={handleChange('category')}
                            >
                                {CATEGORIES.map((cat) => (
                                    <MenuItem key={cat} value={cat}>
                                        {cat.replace('_', ' ')}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl fullWidth required>
                            <InputLabel>Design Theme</InputLabel>
                            <Select
                                value={formData.designTheme}
                                label="Design Theme"
                                onChange={handleChange('designTheme')}
                            >
                                {DESIGN_THEMES.map((theme) => (
                                    <MenuItem key={theme} value={theme}>
                                        {theme.replace(/_/g, ' ')}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl fullWidth required>
                            <InputLabel>Space Type</InputLabel>
                            <Select
                                value={formData.spaceType}
                                label="Space Type"
                                onChange={handleChange('spaceType')}
                            >
                                {SPACE_TYPES.map((space) => (
                                    <MenuItem key={space} value={space}>
                                        {space.replace(/_/g, ' ')}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl fullWidth>
                            <InputLabel>Size</InputLabel>
                            <Select
                                value={formData.size}
                                label="Size"
                                onChange={handleChange('size')}
                            >
                                {SIZES.map((size) => (
                                    <MenuItem key={size} value={size}>
                                        {size.replace('SIZE_', '')}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl fullWidth>
                            <InputLabel>Quality</InputLabel>
                            <Select
                                value={formData.quality}
                                label="Quality"
                                onChange={handleChange('quality')}
                            >
                                {QUALITIES.map((qual) => (
                                    <MenuItem key={qual} value={qual}>
                                        {qual}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl fullWidth>
                            <InputLabel>Output Format</InputLabel>
                            <Select
                                value={formData.outputFormat}
                                label="Output Format"
                                onChange={handleChange('outputFormat')}
                            >
                                {OUTPUT_FORMATS.map((format) => (
                                    <MenuItem key={format} value={format}>
                                        {format}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <TextField
                            label="Number of Images"
                            type="number"
                            value={formData.n}
                            onChange={handleChange('n')}
                            inputProps={{ min: 1, max: 10 }}
                            fullWidth
                        />

                        <TextField
                            label="Background"
                            value={formData.background}
                            onChange={handleChange('background')}
                            fullWidth
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>Cancel</Button>
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={createProjectMutation.isPending || updateProjectMutation.isPending}
                    >
                        {(createProjectMutation.isPending || updateProjectMutation.isPending) ? (
                            <CircularProgress size={24} />
                        ) : (
                            isEditMode ? 'Update Project' : 'Create Project'
                        )}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default ProjectForm;
