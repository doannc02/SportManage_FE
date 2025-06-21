import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "./DashBoardLayout.css";
import SidebarMenu from "./SlidebarMenu";
import { getAppToken } from "../../configs/token";
import { Outlet } from "react-router-dom";

function DashboardLayout({ children, title }) {
    const [collapsed, setCollapsed] = useState(false);
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const tokenApp = getAppToken();

    // Check if device is mobile
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        checkMobile();
        window.addEventListener("resize", checkMobile);

        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    // Close mobile menu when screen becomes desktop size
    useEffect(() => {
        if (!isMobile && isMobileMenuOpen) {
            setMobileMenuOpen(false);
        }
    }, [isMobile, isMobileMenuOpen]);

    // Prevent body scroll when mobile menu is open
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }

        // Cleanup on unmount
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isMobileMenuOpen]);

    const toggleCollapsed = () => {
        if (!isMobile) {
            setCollapsed(!collapsed);
        }
    };

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!isMobileMenuOpen);
    };

    const closeMobileMenu = () => {
        setMobileMenuOpen(false);
    };

    // Handle overlay click to close mobile menu
    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            closeMobileMenu();
        }
    };

    // Handle escape key to close mobile menu
    useEffect(() => {
        const handleEscapeKey = (e) => {
            if (e.key === "Escape" && isMobileMenuOpen) {
                closeMobileMenu();
            }
        };

        document.addEventListener("keydown", handleEscapeKey);
        return () => document.removeEventListener("keydown", handleEscapeKey);
    }, [isMobileMenuOpen]);

    const roleName = tokenApp?.roles?.includes("Admin")
        ? "ADMIN"
        : tokenApp?.roles?.includes("Shipper")
            ? "SHIPPER"
            : tokenApp?.role?.includes("USER")
                ? "USER"
                : "GUEST";

    return (
        <div className="admin-layout">
            {/* Mobile Overlay */}
            <div
                className={`mobile-overlay ${isMobileMenuOpen ? "active" : ""}`}
                onClick={handleOverlayClick}
                aria-hidden="true"
            />

            {/* Sidebar */}
            <div
                className={`sidebar ${collapsed && !isMobile ? "collapsed" : ""} ${isMobileMenuOpen ? "mobile-open" : ""
                    }`}
                role="navigation"
                aria-label="Main navigation"
            >
                <div className="sidebar-header">
                    <h2>{collapsed && !isMobile ? "M" : "Manager Admin"}</h2>

                    {/* Desktop toggle button */}
                    {!isMobile && (
                        <button
                            onClick={toggleCollapsed}
                            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                        >
                            {collapsed ? "→" : "←"}
                        </button>
                    )}

                    {/* Mobile close button */}
                    <button
                        className="mobile-close-btn"
                        onClick={closeMobileMenu}
                        aria-label="Close mobile menu"
                    >
                        ×
                    </button>
                </div>

                <SidebarMenu
                    roleName={roleName}
                    collapsed={collapsed && !isMobile}
                    onMenuClick={isMobile ? closeMobileMenu : undefined}
                />
            </div>

            {/* Content Area */}
            <div className="content-area">
                <div className="content-header">
                    <div style={{ display: "flex", alignItems: "center" }}>
                        {/* Mobile menu button */}
                        <button
                            className="mobile-menu-btn"
                            onClick={toggleMobileMenu}
                            aria-label="Open mobile menu"
                            aria-expanded={isMobileMenuOpen}
                        >
                            ☰
                        </button>
                        <h1>{title}</h1>
                    </div>

                    <div className="user-info">
                        <span>Account: {tokenApp?.username ?? "Guest"}</span>
                    </div>
                </div>

                <main className="main-content" role="main">
                    {children ?? <Outlet />}
                </main>
            </div>
        </div>
    );
}

DashboardLayout.propTypes = {
    children: PropTypes.node,
    title: PropTypes.string.isRequired,
};

export default DashboardLayout;
