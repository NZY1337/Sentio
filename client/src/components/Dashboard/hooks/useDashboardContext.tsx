import { useContext, } from 'react';
import { DashboardContext } from '../context/dashboardContext';

export const useDashboardContext = () => {
    const context = useContext(DashboardContext);
    if (!context) throw new Error('useDashboardContext must be used within DashboardProvider');
    return context;
};