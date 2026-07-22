import "./ViewLedger.css";

const ViewLedger = ({
  ledger,
  closeModal,
}) => {

  if (!ledger) return null;

  return (

    <div className="modal-overlay">

      <div className="view-modal">

        <h2>Ledger Details</h2>

        <div className="detail-row">
          <span>Customer</span>
          <strong>{ledger.customerName}</strong>
        </div>

        <div className="detail-row">
          <span>Account Number</span>
          <strong>{ledger.accountNumber}</strong>
        </div>

        <div className="detail-row">
          <span>Previous Balance</span>
          <strong>₹ {ledger.previousBalance}</strong>
        </div>

        <div className="detail-row">
          <span>Collected Amount</span>
          <strong>₹ {ledger.amount}</strong>
        </div>

        <div className="detail-row">
          <span>Current Balance</span>
          <strong>₹ {ledger.currentBalance}</strong>
        </div>

        <div className="detail-row">
          <span>Date</span>
          <strong>
            {new Date(ledger.createdAt).toLocaleString()}
          </strong>
        </div>

        <button
          className="close-btn"
          onClick={closeModal}
        >
          Close
        </button>

      </div>

    </div>

  );

};

export default ViewLedger;