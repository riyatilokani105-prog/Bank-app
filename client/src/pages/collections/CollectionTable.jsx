import "./CollectionTable.css";

const CollectionTable = ({ collections = [] }) => {
  return (
    <div className="table-wrapper">
      <table>

        <thead>
          <tr>
            <th>Date</th>
            <th>Customer</th>
            <th>Account</th>
            <th>Amount</th>
          </tr>
        </thead>

        <tbody>

          {collections.length === 0 ? (

            <tr>
              <td colSpan="4">
                No Collections Found
              </td>
            </tr>

          ) : (

            collections.map((item) => (

              <tr key={item._id}>

                <td>
                  {new Date(item.createdAt).toLocaleDateString("en-IN")}
                </td>

                <td>
                  {item.customerName}
                </td>

                <td>
                  {item.accountNumber}
                </td>

                <td>
                  ₹ {Number(item.amount).toLocaleString("en-IN")}
                </td>

              </tr>

            ))

          )}

        </tbody>

      </table>
    </div>
  );
};

export default CollectionTable;