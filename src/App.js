import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { useSelector } from 'react-redux';
import styles from './App.module.scss';
import ProfileInfo from './components/ProfileInfo/ProfileInfo';
import HardSkillsMap from './components/HardSkillsMap/HardSkillsMap';
import SoftSkillsMap from './components/SoftSkillsMap/SoftSkillsMap';
import WorkersListPage from './components/HelloPage/WorkersListPage';
import AllHardSkills from './components/AllHardSkillsMap/AllHardSkills';
import HardSkillNoRate from './components/HardSkillNoRate/HardSkillNoRate';
import LoginPage from './components/LoginPage/LoginPage';
import RegistrationPage from './components/RegistrationPage/RegistrationPage';
import ProtectedRoute from './components/ProtectedRoute';

const App = () => {
    const { accessToken } = useSelector((state) => state.auth);

    return (
        <div className="App">
            <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/registration-page" element={<RegistrationPage />} />
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
                    path="/hard-skills/:id"
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
                    path="/category/:category"
                    element={
                        <ProtectedRoute isAuthenticated={!!accessToken}>
                            <HardSkillNoRate />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </div>
    );
};

export default App;
