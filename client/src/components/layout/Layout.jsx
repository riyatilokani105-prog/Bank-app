import { useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import "./Layout.css";

const Layout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="layout">
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />

      <div
        className={
          collapsed
            ? "layout-content expand"
            : "layout-content"
        }
      >
        <Navbar
          toggleSidebar={() =>
            setCollapsed(!collapsed)
          }
        />

        <main>{children}</main>
      </div>
    </div>
  );
};

export default Layout;