import { FaSearch } from "react-icons/fa";
import "./LedgerSearch.css";

const LedgerSearch = ({ value, onChange }) => {
  return (
    <div className="ledger-search">

      <FaSearch className="search-icon" />

      <input
        type="text"
        placeholder="Search Customer / Account Number..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />

    </div>
  );
};

export default LedgerSearch;