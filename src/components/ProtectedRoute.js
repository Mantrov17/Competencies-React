import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ isAuthenticated, requiredRole, children }) => {
    const roleType = useSelector((state) => state.auth.roleType);

    console.log('Роль пользователя в ProtectedRoute:', roleType);

    if (!isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    if (requiredRole && roleType !== requiredRole) {
        return <Navigate to="/unauthorized" replace />;
    }

    return children;
};

export default ProtectedRoute;
