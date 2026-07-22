import "./ReportsFilter.css";

const ReportsFilter = ({
  fromDate,
  toDate,
  setFromDate,
  setToDate,
}) => {
  return (
    <div className="report-filter">

      <input
        type="date"
        value={fromDate}
        onChange={(e) =>
          setFromDate(e.target.value)
        }
      />

      <input
        type="date"
        value={toDate}
        onChange={(e) =>
          setToDate(e.target.value)
        }
      />

    </div>
  );
};

export default ReportsFilter;