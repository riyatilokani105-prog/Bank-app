import "./Statement.css";

const StatementInfo = ({ customer }) => {

  if (!customer) return null;

  return (

    <div className="statement-card">

      <h2>Customer Information</h2>

      <div className="statement-info-grid">

        <div className="info-box">
          <span>Customer Name</span>
          <strong>{customer.fullName}</strong>
        </div>

        <div className="info-box">
          <span>Account Number</span>
          <strong>{customer.accountNumber}</strong>
        </div>

        <div className="info-box">
          <span>Opening Date</span>
          <strong>
            {new Date(customer.createdAt).toLocaleDateString()}
          </strong>
        </div>

        <div className="info-box">
          <span>Current Balance</span>
          <strong>
            ₹ {Number(customer.currentBalance).toLocaleString()}
          </strong>
        </div>

      </div>

    </div>

  );

};

export default StatementInfo;