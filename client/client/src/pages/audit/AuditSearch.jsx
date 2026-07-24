import "./AuditSearch.css";

const AuditSearch = ({ value, onChange }) => {
  return (
    <div className="audit-search">
      <input
        type="text"
        placeholder="Search by Action or Description..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

export default AuditSearch;