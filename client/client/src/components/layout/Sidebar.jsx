import { NavLink, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaUsers,
  FaMoneyBillWave,
  FaBook,
  FaChartBar,
  FaDatabase,
  FaCog,
  FaSignOutAlt,
  FaChevronLeft,
  FaChevronRight,
  FaHistory,
} from "react-icons/fa";

import "./Sidebar.css";

const Sidebar = ({
  collapsed,
  setCollapsed,
  mobileOpen,
  setMobileOpen,
}) => {
  const navigate = useNavigate();

  const menuItems = [
    {
      title: "Dashboard",
      icon: <FaHome />,
      path: "/dashboard",
    },
    {
      title: "Customers",
      icon: <FaUsers />,
      path: "/customers",
    },
    {
      title: "Collections",
      icon: <FaMoneyBillWave />,
      path: "/collections",
    },
    {
      title: "Ledger",
      icon: <FaBook />,
      path: "/ledger",
    },
    {
      title: "Reports",
      icon: <FaChartBar />,
      path: "/reports",
    },
    {
      title: "Backup",
      icon: <FaDatabase />,
      path: "/backup",
    },
    {
      title: "Audit Logs",
      icon: <FaHistory />,
      path: "/audit",
    },
    {
      title: "Settings",
      icon: <FaCog />,
      path: "/settings",
    },
  ];

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const closeMobileSidebar = () => {
    if (window.innerWidth <= 992) {
      setMobileOpen(false);
    }
  };

  return (
    <>
      {/* Overlay */}

      <div
        className={`sidebar-overlay ${mobileOpen ? "show" : ""}`}
        onClick={() => setMobileOpen(false)}
      ></div>

      <aside
        className={`sidebar
          ${collapsed ? "collapsed" : ""}
          ${mobileOpen ? "show" : ""}
        `}
      >
        <div className="sidebar-top">
          <div className="logo-area">
            <div className="logo-circle">DC</div>

            {!collapsed && (
              <div>
                <h2>Daily Collection</h2>
                <p>Management System</p>
              </div>
            )}
          </div>

          <button
            className="collapse-btn"
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? <FaChevronRight /> : <FaChevronLeft />}
          </button>
        </div>

        <div className="sidebar-menu">
          {menuItems.map((item) => (
            <NavLink
              key={item.title}
              to={item.path}
              onClick={closeMobileSidebar}
              className={({ isActive }) =>
                isActive ? "menu-item active" : "menu-item"
              }
            >
              <span className="menu-icon">{item.icon}</span>

              {!collapsed && (
                <span className="menu-title">
                  {item.title}
                </span>
              )}
            </NavLink>
          ))}
        </div>

        <div className="sidebar-bottom">
          <button
            className="logout-btn"
            onClick={logout}
          >
            <FaSignOutAlt />

            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;