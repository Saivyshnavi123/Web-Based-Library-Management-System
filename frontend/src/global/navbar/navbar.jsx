import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserCircle, FaChevronDown, FaShoppingCart } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CartDrawer from "../../components/admin/admin-dashboard/rightDarwers/CartDrawer";
import UpdatePasswordDrawer from "../../components/admin/admin-dashboard/rightDarwers/UpdatePasswordDrawer";

export default function Navbar({ username, role, onBooksUpdate }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate();
  const [updateDrawerOpen, setUpdateDrawerOpen] = useState(false);

  useEffect(() => {
    const updateCartCount = () => {
      const cart = JSON.parse(sessionStorage.getItem("studentCart") || "[]");
      setCartCount(cart.length);
    };
    updateCartCount();
    window.addEventListener("cartUpdated", updateCartCount);
    return () => window.removeEventListener("cartUpdated", updateCartCount);
  }, []);

  const handleDropdown = () => setDropdownOpen((open) => !open);

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("username");
    sessionStorage.removeItem("userid");
    sessionStorage.removeItem("role");
    setDropdownOpen(false);
    toast.success("Logged out successfully!");
    setTimeout(() => {
      navigate("/", { replace: true });
    }, 1200);
  };

  return (
    <nav className="navbar">
      <ToastContainer position="top-center" />
      <div className="navbar-container">
        <h1 className="navbar-title">Library Management</h1>
        <div className="navbar-user">
          <div className="navbar-user-actions">
            {role === "student" && (
              <button
                className="cart-btn"
                onClick={() => setCartOpen(true)}
                title="View Cart"
              >
                <FaShoppingCart size={22} />
                {cartCount > 0 && (
                  <span className="cart-badge">{cartCount}</span>
                )}
              </button>
            )}
            <button className="user-btn" onClick={handleDropdown}>
              <FaUserCircle size={28} className="user-icon" />
              <span className="username">{username}</span>
              <FaChevronDown />
            </button>
          </div>
          {dropdownOpen && (
            <div className="dropdown-card">
              <div className="dropdown-header">
                <FaUserCircle size={40} className="dropdown-user-icon" />
                <div style={{ marginLeft: "0.5rem" }}>
                  <div className="dropdown-username">{username}</div>
                  <div className="dropdown-role">{role}</div>
                </div>
              </div>
              <div className="dropdown-actions">
                <button
                  className="dropdown-action"
                  onClick={() => setUpdateDrawerOpen(true)}
                  style={{ marginBottom: 8 }}
                >
                  Update
                </button>
                <button className="dropdown-action" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <UpdatePasswordDrawer
        open={updateDrawerOpen}
        onClose={() => setUpdateDrawerOpen(false)}
        userId={sessionStorage.getItem("userid")}
        username={username}
        onSuccess={() => setDropdownOpen(false)}
      />
      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        onBooksUpdate={onBooksUpdate}
      />
    </nav>
  );
}
