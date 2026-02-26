import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import './App.css';
import NotFoundPage from './components/NotFound/NotFoundPage';
import Home from './components/Homepage/Homepage';
import Dashboard from './components/Dashboard/components/Dashboard';
import DashboardMain from './components/Dashboard/pages/Dashboard';
import AllJournals from './components/Dashboard/components/AllJournals';
import Journal from './components/Dashboard/pages/Journal';
import EditJournal from './components/Dashboard/pages/EditJournal';
import Profile from './components/Dashboard/pages/Profile';
import { Users } from './components/Dashboard/pages/Users';
import { CssBaseline } from '@mui/material';
import ProtectedRoute from './components/Protected/ProtectedRoute';


function App() {
    return (
        <Router>
            <CssBaseline />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/" element={<ProtectedRoute />}>
                    <Route path="dashboard" element={<Dashboard />}>
                        <Route index element={<DashboardMain />} />
                        <Route path="journals" element={<AllJournals />} />
                        <Route path="journals/:id" element={<EditJournal />} />
                        <Route path="journal" element={<Journal />} />
                        <Route path="profile" element={<Profile />} />
                        <Route path="users" element={<Users />} />
                    </Route>
                </Route>
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </Router>
    )
};

export default App;