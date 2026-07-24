import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import "./Layout.css";

const Layout = ({ children }) => {

  const [collapsed, setCollapsed] = useState(false);

  const [mobileOpen, setMobileOpen] = useState(false);

  // Close sidebar automatically when screen becomes desktop
  useEffect(() => {

    const handleResize = () => {

      if (window.innerWidth > 992) {

        setMobileOpen(false);

      }

    };

    window.addEventListener("resize", handleResize);

    return () =>
      window.removeEventListener("resize", handleResize);

  }, []);

  const toggleSidebar = () => {

    if (window.innerWidth <= 992) {

      setMobileOpen(!mobileOpen);

    } else {

      setCollapsed(!collapsed);

    }

  };

  return (

    <div className="layout">

      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      <div
        className={
          collapsed
            ? "layout-content expand"
            : "layout-content"
        }
      >

        <Navbar toggleSidebar={toggleSidebar} />

        <main>

          {children}

        </main>

      </div>

    </div>

  );

};

export default Layout;