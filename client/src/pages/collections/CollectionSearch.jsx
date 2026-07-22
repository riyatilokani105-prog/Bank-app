import { FaSearch } from "react-icons/fa";
import "./CollectionSearch.css";

const CollectionSearch = ({
  value,
  onChange,
}) => {
  return (
    <div className="collection-search">
      <FaSearch className="search-icon" />

      <input
        type="text"
        placeholder="Search by Customer Name or Account Number..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

export default CollectionSearch;