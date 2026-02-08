// src/components/Dashboard/DashboardContext.tsx
import { createContext, useState, type Dispatch, type ReactNode, type SetStateAction } from 'react';

// types
import type { ProjectProps, GridCell, } from '../../../types';

type DashboardContextType = {
    value: string;
    project: ProjectProps | null;
    grid: GridCell[];
    setValue: (val: string) => void;
    setProject: Dispatch<SetStateAction<ProjectProps | null>>
    setGrid: Dispatch<SetStateAction<GridCell[]>>;
};

export const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export const DashboardProvider = ({ children }: { children: ReactNode }) => {
    const [value, setValue] = useState<string>('');
    const [project, setProject] = useState<ProjectProps | null>(null);
    const [grid, setGrid] = useState<GridCell[]>(Array(18).fill(null));

    return (
        <DashboardContext.Provider
            value={{
                value,
                project,
                grid,
                setValue,
                setProject,
                setGrid
            }}>
            {children}
        </DashboardContext.Provider>
    );
};

