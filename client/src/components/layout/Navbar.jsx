import "./Navbar.css";
import {
  FaBars,
  FaBell,
  FaSearch,
  FaUserCircle,
} from "react-icons/fa";

const Navbar = ({ toggleSidebar }) => {
  return (
    <header className="navbar">

      <div className="navbar-left">

        <button
          className="menu-btn"
          onClick={toggleSidebar}
        >
          <FaBars />
        </button>

        <div className="search-box">

          <FaSearch className="search-icon" />

          <input
            type="text"
            placeholder="Search customer..."
          />

        </div>

      </div>

      <div className="navbar-right">

        <button className="icon-btn">
          <FaBell />
          <span className="notification">3</span>
        </button>

        <div className="profile">

          <FaUserCircle className="profile-icon" />

          <div>

            <h4>Administrator</h4>

            <p>Admin</p>

          </div>

        </div>

      </div>

    </header>
  );
};

export default Navbar;