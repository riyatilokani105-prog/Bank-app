import { FaSearch } from "react-icons/fa";
import "./CustomerSearch.css";

const CustomerSearch = ({ value, onChange }) => {
  return (
    <div className="customer-search">

      <div className="search-box">

        <FaSearch className="search-icon" />

        <input
          type="text"
          placeholder="Search by Name, Account No or Mobile"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />

      </div>

    </div>
  );
};

export default CustomerSearch;