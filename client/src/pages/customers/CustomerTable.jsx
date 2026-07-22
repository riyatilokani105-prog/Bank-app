import {
  FaEdit,
  FaTrash,
  FaEye,
} from "react-icons/fa";

import "./CustomerTable.css";

const CustomerTable = ({
  customers = [],
  onView,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>Account</th>
            <th>Name</th>
            <th>Mobile</th>
            <th>Balance</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {customers.length === 0 ? (
            <tr>
              <td colSpan="5" className="no-data">
                No Customers Found
              </td>
            </tr>
          ) : (
            customers.map((customer) => (
              <tr key={customer._id}>
                <td>{customer.accountNumber}</td>

                <td>{customer.fullName}</td>

                <td>{customer.mobile}</td>

                <td>₹ {customer.balance}</td>

                <td className="action-buttons">

                  <button
                    className="edit-btn"
                    onClick={() => onEdit && onEdit(customer)}
                    title="Edit"
                  >
                    <FaEdit />
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() => onDelete && onDelete(customer)}
                    title="Delete"
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

export default CustomerTable;