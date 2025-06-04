import { Navigate } from "react-router-dom";
import { useContext } from "react";
import PropTypes from "prop-types";
import { getAppToken } from "../configs/token";
import { UserContext } from "../Contexts/UserContext";

export default function ProtectedRoute({ children, requiredRoles = [] }) {
    const { user } = useContext(UserContext);
    const tokenApp = getAppToken()
    const isLoggedIn = !!user?.roles?.[0] || tokenApp?.roles?.[0]

    if (!isLoggedIn) {
        return <Navigate to="/Login" replace />;
    }

    if (requiredRoles?.length > 0 && !requiredRoles.some(role => user.roles.includes('Customer'))) {
        return <Navigate to="/" replace />;
    }
    if (requiredRoles.length > 0 && user?.roles?.includes('Admin'))
        return <Navigate to="/admin" replace />;

    return children;
}

ProtectedRoute.propTypes = {
    children: PropTypes.node.isRequired,
    requiredRoles: PropTypes.arrayOf(PropTypes.string),
};



