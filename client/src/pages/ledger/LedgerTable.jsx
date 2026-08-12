import {
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

            ledger.map((item, index) => (

              <tr
                key={
                  item._id ||
                  item.customerId ||
                  `ledger-${index}`
                }
              >

                {/* DATE */}
                <td>
                  {item.isCustomerOnly
                    ? "-"
                    : item.createdAt
                    ? new Date(
                        item.createdAt
                      ).toLocaleDateString()
                    : "-"}
                </td>

                {/* ACCOUNT NUMBER */}
                <td>
                  {item.accountNumber || "-"}
                </td>

                {/* CUSTOMER NAME */}
                <td>
                  {item.customerName || "-"}
                </td>

                {/* PREVIOUS BALANCE */}
                <td>
                  {item.isCustomerOnly
                    ? "-"
                    : `₹ ${
                        item.previousBalance ?? 0
                      }`}
                </td>

                {/* COLLECTION AMOUNT */}
                <td>
                  {item.isCustomerOnly
                    ? "-"
                    : `₹ ${
                        item.amount ?? 0
                      }`}
                </td>

                {/* CURRENT BALANCE */}
                <td>
                  {item.isCustomerOnly
                    ? `₹ ${
                        item.balance ?? 0
                      }`
                    : `₹ ${
                        item.currentBalance ?? 0
                      }`}
                </td>

                {/* ACTION */}
                <td className="action-buttons">

                  {item.isCustomerOnly ? (

                    <span className="no-collection">
                      No Collection
                    </span>

                  ) : (

                    <button
                      className="delete-btn"
                      onClick={() =>
                        onDelete &&
                        onDelete(item)
                      }
                    >
                      <FaTrash />
                    </button>

                  )}

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