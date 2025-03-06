import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";
import { FaOpencart } from "react-icons/fa";
import "../styles/HamburgerMenu.css";

const HamburgerMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);
  const [showBurger, setShowBurger] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      if (window.scrollY > 100) {
        setShowBurger(true);
        setShowNavbar(false);
      } else {
        setShowNavbar(true);
        setShowBurger(false);
      }
      lastScrollY = window.scrollY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div>
      {/* Full-width navbar */}
      <nav className={`navbar ${showNavbar ? "visible" : "hidden"}`}>
        <div className="nav-content">
          <h1>Feasto</h1>
          <div className="nav-links">
            <Link to="/">Food Items</Link>
            <Link to="/create-item">Create Item</Link>
            <Link to="/cart">Cart <span className="react-icons"><FaOpencart/></span></Link>
            <button className="logout-btn" onClick={handleLogout}>
              Logout <span className="react-icons"><FiLogOut size={20} /></span>
            </button>
          </div>
        </div>
      </nav>

      {/* Hamburger button appears after scrolling */}
      {showBurger && (
        <div className="hamburger-menu">
          <button
            type="button"
            className={`burger ${isOpen ? "burger--open" : ""}`}
            title="Menu"
            onClick={() => setIsOpen(!isOpen)}
          >
            <span className="burger__bun"></span>
            <span className="burger__meat"></span>
            <span className="burger__bun"></span>
          </button>

          {isOpen && (
            <div className="menu-dropdown">
              <Link to="/" onClick={() => setIsOpen(false)}>Food Items</Link>
              <Link to="/create-item" onClick={() => setIsOpen(false)}>Create Item</Link>
              <Link to="/cart">Cart <span className="react-icons"><FaOpencart/></span></Link>
              <button onClick={handleLogout}>Logout</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default HamburgerMenu;
