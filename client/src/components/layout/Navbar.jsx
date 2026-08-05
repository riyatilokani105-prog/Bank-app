import "./Navbar.css";
import {
  FaBars,
  FaBell,
  FaSearch,
  FaUserCircle,
} from "react-icons/fa";

const Navbar = ({ toggleSidebar }) => {
  const profileImage = "/images/admin-profile.jpg"; // Replace with the actual path to your profile image


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
          <FaSearch className="search-icon" />

          <input
            type="text"
            placeholder="Search customer..."
          />
        </div>

      </div>

      <div className="navbar-right">


        {/* Profile */}

        <div
  className="admin-profile"
  onClick={() => navigate("/admin-profile")}
>
    <img src={profileImage} alt="Admin" />

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