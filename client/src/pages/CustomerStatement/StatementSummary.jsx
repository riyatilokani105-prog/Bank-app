import "./Statement.css";

const StatementSummary = ({ summary }) => {

  if (!summary) return null;

  return (

    <div className="summary-grid">

      <div className="summary-card">

        <h4>Total Collections</h4>

        <h2>
          {summary.totalCollections || 0}
        </h2>

      </div>

      <div className="summary-card">

        <h4>Total Amount</h4>

        <h2>
          ₹ {Number(summary.totalAmount || 0).toLocaleString()}
        </h2>

      </div>

      <div className="summary-card">

        <h4>Last Collection</h4>

        <h2>

          {summary.lastCollection
            ? new Date(summary.lastCollection).toLocaleDateString()
            : "-"}

        </h2>

      </div>

    </div>

  );

};

export default StatementSummary;