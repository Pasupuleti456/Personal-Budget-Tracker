import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

const Navigation = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("loggedInUser");
        localStorage.removeItem("role");
        navigate("/");  // Redirect to Home after logout
    };

    const isHome = location.pathname === "/" || location.pathname === "/home";
    const isDashboard = location.pathname === "/expenses" || location.pathname === "/admin";

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-brand">
                    <span className="logo-icon">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="2" y="6" width="20" height="14" rx="4" fill="#5B21B6"/>
                            <path d="M18 11C18 10.4477 17.5523 10 17 10C16.4477 10 16 10.4477 16 11V13C16 13.5523 16.4477 14 17 14C17.5523 14 18 13.5523 18 13V11Z" fill="#F3E8FF"/>
                            <path d="M5 6V4C5 2.89543 5.89543 2 7 2H17C18.1046 2 19 2.89543 19 4V6" stroke="#5B21B6" strokeWidth="2"/>
                        </svg>
                    </span>
                    <span className="logo-text">BudgetTracker</span>
                </Link>
                <div className="navbar-links">
                    <Link to="/" className={`nav-link ${isHome ? 'active-pill' : ''}`}>Home</Link>
                    {!token ? (
                        <>
                            <Link to="/login" className={`nav-link ${location.pathname === '/login' ? 'active-pill' : ''}`}>Login</Link>
                            <Link to="/signup" className={`nav-link nav-btn-primary ${location.pathname === '/signup' ? 'active-pill' : ''}`}>Signup</Link>
                        </>
                    ) : (
                        <>
                            <Link to={role === "admin" ? "/admin" : "/expenses"} className={`nav-link ${isDashboard ? 'active-pill' : ''}`}>Dashboard</Link>
                            <button onClick={handleLogout} className="logout-btn">
                                Logout <span className="logout-icon">➔</span>
                            </button>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navigation;
