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
import ProtectedRoute from './components/Protected/ProtectedRoute';
import { PublicThemeProvider } from './context/AppTheme';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<PublicThemeProvider><Home /></PublicThemeProvider>} />
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
                <Route path="*" element={<PublicThemeProvider><NotFoundPage /></PublicThemeProvider>} />
            </Routes>
        </Router>
    )
};

export default App;