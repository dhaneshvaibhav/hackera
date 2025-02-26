import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../componentcss/Navbar.css";

function Navbar() {
  const [active, setActive] = useState("/");

  return (
    <nav className="navbar">
      {/* Logo */}
      <div className="logo">virtual room</div>

      {/* Menu Items */}
      <div className="menu">
        {[
          { name: "home", path: "/" },
          { name: "login", path: "/login" },
          { name: "signin", path: "/signin" },
        ].map((item) => (
          <Link
            key={item.path}
            to={item.path}
            onClick={() => setActive(item.path)}
            className={`menu-item ${active === item.path ? "active" : ""}`}
          >
            {item.name}
          </Link>
        ))}
      </div>
    </nav>
  );
}

export default Navbar;
