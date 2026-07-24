import {
  FaEdit,
  FaTrash,
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

            <th>Account No.</th>

            <th>Customer Name</th>

            <th>Mobile Number</th>

            <th>Balance</th>

            <th align="center">Actions</th>

          </tr>

        </thead>

        <tbody>

          {customers.length === 0 ? (

            <tr>

              <td
                colSpan="5"
                className="no-data"
              >
                No Customers Found
              </td>

            </tr>

          ) : (

            customers.map((customer) => (

              <tr key={customer._id}>

                <td>

                  {customer.accountNumber}

                </td>

                <td>

                  {customer.fullName}

                </td>

                <td>

                  {customer.mobile}

                </td>

                <td>

                  ₹{" "}

                  {Number(
                    customer.balance || 0
                  ).toLocaleString()}

                </td>

                <td>

                  <div className="action-buttons">

                    <button

                      className="edit-btn"

                      title="Edit Customer"

                      onClick={() =>
                        onEdit &&
                        onEdit(customer)
                      }

                    >

                      <FaEdit />

                    </button>

                    <button

                      className="delete-btn"

                      title="Delete Customer"

                      onClick={() =>
                        onDelete &&
                        onDelete(customer)
                      }

                    >

                      <FaTrash />

                    </button>

                  </div>

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