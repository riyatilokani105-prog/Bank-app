import "./Statement.css";

const StatementSearch = ({
  value,
  onChange,
  onSearch,
}) => {

  return (

    <div className="statement-search">

      <input
        type="text"
        placeholder="Search by Account Number or Customer Name"
        value={value}
        onChange={(e)=>onChange(e.target.value)}
      />

      <button onClick={onSearch}>
        Search
      </button>

    </div>

  );

};

export default StatementSearch;