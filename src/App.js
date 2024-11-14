import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { useSelector } from 'react-redux';
import styles from './App.module.scss';
import ProfileInfo from './components/ProfileInfo/ProfileInfo';
import HardSkillsMap from './components/HardSkillsMap/HardSkillsMap';
import SoftSkillsMap from './components/SoftSkillsMap/SoftSkillsMap';
import WorkersListPage from './components/WorkersListPage/WorkersListPage';
import AllHardSkills from './components/AllHardSkillsMap/AllHardSkills';

import LoginPage from './components/LoginPage/LoginPage';
import RegistrationPage from './components/RegistrationPage/RegistrationPage';
import ProtectedRoute from './components/ProtectedRoute';
import AdminAllHardSkills from "./components/AdminAllHardSkills/AdminAllHardSkills";
import UnauthorizedPage from "./components/UnauthorizedPage/UnauthorizedPage";
import AdminHardSkillsManagement from "./components/AdminHardSkillsManagement/AdminHardSkillsManagement";
import AdminSoftSkillsManagement from "./components/AdminSoftSkillsManagement/AdminSoftSkillsManagement";
import HardSkillsAverageRatings from "./components/HardSkillsAverageRatings/HardSkillsAverageRatings";
import SoftSkillsAverageRatings from "./components/SoftSkillsAverageRatings/SoftSkillsAverageRatings";


const App = () => {
    const { accessToken } = useSelector((state) => state.auth);

    return (
        <div className="App">
            <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route
                    path="/admin-hard-skills"
                    element={
                        <ProtectedRoute isAuthenticated={!!accessToken} requiredRole="ROLE_ADMIN">
                            <AdminHardSkillsManagement />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/users/:id/soft-skills/average-ratings"
                    element={
                        <ProtectedRoute isAuthenticated={!!accessToken}>
                            <SoftSkillsAverageRatings />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/users/:id/hard-skills/average-ratings"
                    element={
                        <ProtectedRoute isAuthenticated={!!accessToken}>
                            <HardSkillsAverageRatings />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin-soft-skills"
                    element={
                        <ProtectedRoute isAuthenticated={!!accessToken} requiredRole="ROLE_ADMIN">
                            <AdminSoftSkillsManagement />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin-all-hard-skills"
                    element={
                        <ProtectedRoute isAuthenticated={!!accessToken} requiredRole="ROLE_ADMIN">
                            <AdminAllHardSkills />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/workers-list-page"
                    element={
                        <ProtectedRoute isAuthenticated={!!accessToken}>
                            <WorkersListPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/profile-info/:id"
                    element={
                        <ProtectedRoute isAuthenticated={!!accessToken}>
                            <ProfileInfo />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="users/:id/hard-skills/"
                    element={
                        <ProtectedRoute isAuthenticated={!!accessToken}>
                            <HardSkillsMap />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/soft-skills/:id"
                    element={
                        <ProtectedRoute isAuthenticated={!!accessToken}>
                            <SoftSkillsMap />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/all-hard-skills"
                    element={
                        <ProtectedRoute isAuthenticated={!!accessToken}>
                            <AllHardSkills />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/registration-page"
                    element={
                        <ProtectedRoute isAuthenticated={!!accessToken} requiredRole="ROLE_ADMIN">
                            <RegistrationPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin-all-hard-skills"
                    element={
                        <ProtectedRoute isAuthenticated={!!accessToken} requiredRole="ROLE_ADMIN">
                            <AdminAllHardSkills />
                        </ProtectedRoute>
                    }
                />
                <Route path="/unauthorized" element={<UnauthorizedPage />} />
            </Routes>
        </div>
    );
};

export default App;
