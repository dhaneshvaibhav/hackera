import React, { useState } from "react";
import { Link } from "react-router-dom";

function Navbar() {
  const [active, setActive] = useState("/");

  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "15px 50px",
        background: "#fff",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* Logo */}
      <div
        style={{
          fontSize: "24px",
          fontWeight: "bold",
          color: "#ff2e63",
          marginRight: "50px", // Adjusted margin to increase gap
        }}
      >
        virtual room
      </div>

      {/* Menu Items */}
      <div style={{ display: "flex", gap: "30px", fontSize: "18px" }}>
        {[
          { name: "home", path: "/" },
          { name: "login ", path: "/login"},
          { name: "signin", path: "/signin" },
       
        ].map((item) => (
          <Link
            key={item.path}
            to={item.path}
            onClick={() => setActive(item.path)}
            style={{
              color: active === item.path ? "#ff2e63" : "#333",
              textDecoration: "none",
              fontWeight: active === item.path ? "bold" : "normal",
              transition: "color 0.3s ease",
            }}
          >
            {item.name}
          </Link>
        ))}
      </div>

      {/* Search Bar */}
    </nav>
  );
}

export default Navbar;
