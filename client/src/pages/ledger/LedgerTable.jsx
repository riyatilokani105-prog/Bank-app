import {
  FaEye,
  FaTrash,
} from "react-icons/fa";

import "./LedgerTable.css";

const LedgerTable = ({
  ledger,
  onView,
  onDelete,
}) => {
  return (
    <div className="table-wrapper">

      <table>

        <thead>

          <tr>

            <th>Date</th>
            <th>Account</th>
            <th>Customer</th>
            <th>Previous</th>
            <th>Amount</th>
            <th>Balance</th>
            <th>Action</th>

          </tr>

        </thead>

        <tbody>

          {ledger.length === 0 ? (

            <tr>

              <td colSpan="7">

                No Ledger Found

              </td>

            </tr>

          ) : (

            ledger.map((item) => (

              <tr key={item._id}>

                <td>
                  {new Date(item.createdAt).toLocaleDateString()}
                </td>

                <td>
                  {item.accountNumber}
                </td>

                <td>
                  {item.customerName}
                </td>

                <td>
                  ₹ {item.previousBalance}
                </td>

                <td>
                  ₹ {item.amount}
                </td>

                <td>
                  ₹ {item.currentBalance}
                </td>

                <td className="action-buttons">

                
                  <button
                    className="delete-btn"
                    onClick={() => onDelete && onDelete(item)}
                  >
                    <FaTrash />
                  </button>

                </td>

              </tr>

            ))

          )}

        </tbody>

      </table>

    </div>
  );
};

export default LedgerTable;