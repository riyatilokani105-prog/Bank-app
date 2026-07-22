import "./ReportsTable.css";

const ReportsTable = ({ reports }) => {
  return (
    <div className="table-wrapper">
      <table>

        <thead>

          <tr>
            <th>Date</th>
            <th>Account</th>
            <th>Customer</th>
            <th>Collection</th>
            <th>Previous Balance</th>
            <th>Current Balance</th>
          </tr>

        </thead>

        <tbody>

          {reports.length === 0 ? (

            <tr>

              <td colSpan="6">
                No Reports Found
              </td>

            </tr>

          ) : (

            reports.map((item) => (

              <tr key={item._id}>

                <td>
                  {new Date(item.createdAt).toLocaleDateString()}
                </td>

                <td>{item.accountNumber}</td>

                <td>{item.customerName}</td>

                <td>₹ {item.amount}</td>

                <td>₹ {item.previousBalance}</td>

                <td>₹ {item.newBalance || item.currentBalance}</td>

              </tr>

            ))

          )}

        </tbody>

      </table>
    </div>
  );
};

export default ReportsTable;