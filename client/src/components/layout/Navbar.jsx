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

        {/* Mobile Menu Button */}
        <button
          className="menu-btn"
          onClick={toggleSidebar}
        >
          <FaBars />
        </button>

        {/* Search */}
        <div className="search-box">
         

          <input
            type="text"
            placeholder="Search customer..."
          />
        </div>

      </div>

      <div className="navbar-right">


        {/* Profile */}

        <div className="profile">

          <FaUserCircle className="profile-icon" />

          <div className="profile-info">
            <h4>Administrator</h4>
            <p>Admin</p>
          </div>

        </div>

      </div>
    </header>
  );
};

export default Navbar;