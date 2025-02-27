import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "../componentcss/Navbar.css";

function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activePath, setActivePath] = useState("/");
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    setIsLoggedIn(!!token); // Update login state based on token existence
    setActivePath(location.pathname); // Update active path
  }, [location]);

  // Define navigation items based on login status
  const navItems = isLoggedIn
    ? [
        { name: "Home", path: "/" },
        { name: "Profile", path: "/profile" },
        {name:"Explore",path:"/explore"}
      ]
    : [
        { name: "Login", path: "/login" },
        { name: "Sign In", path: "/signin" },
      ];

  return (
    <nav className="navbar">
      <div className="logo">Virtual Room</div>
      <div className="menu">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`menu-item ${activePath === item.path ? "active" : ""}`}
          >
            {item.name}
          </Link>
        ))}
      </div>
    </nav>
  );
}

export default Navbar;
