import "./Statement.css";

const StatementHeader = ({
customer,
summary,
onPrint,
onPDF,
}) => {

  if (!customer) return null;

  return (

    <div className="statement-header-card">

      <div className="statement-header-left">

        <h1>Daily Collection Bank</h1>

        <p>
          Customer Statement
        </p>

      </div>

      <div className="statement-header-right">

        <button
className="print-btn"
onClick={onPrint}
>

Print Statement

</button>

        <button
className="pdf-btn"
onClick={onPDF}
>

Download PDF

</button>

      </div>

      <div className="statement-details">

        <div>

          <span>Customer Name</span>

          <strong>
            {customer.fullName}
          </strong>

        </div>

        <div>

          <span>Account Number</span>

          <strong>
            {customer.accountNumber}
          </strong>

        </div>

        <div>

          <span>Opening Date</span>

          <strong>

            {new Date(
              customer.createdAt
            ).toLocaleDateString()}

          </strong>

        </div>

        <div>

          <span>Current Balance</span>

          <strong>

            ₹ {Number(
              customer.currentBalance
            ).toLocaleString()}

          </strong>

        </div>

      </div>

      <div className="statement-filter">

        <input type="date" />

        <input type="date" />

        <button>
          Filter
        </button>

      </div>

    </div>

  );

};

export default StatementHeader;