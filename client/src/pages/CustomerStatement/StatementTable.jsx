import "./Statement.css";

const StatementTable = ({ history = [] }) => {

  if (history.length === 0) {

    return (

      <div className="statement-table-card">

        <h2>Collection History</h2>

        <div className="no-records">

          No Collection History Found

        </div>

      </div>

    );

  }

  return (

    <div className="statement-table-card">

      <h2>Collection History</h2>

      <div className="statement-table-wrapper">

        <table className="statement-table">

          <thead>

            <tr>

              <th>#</th>

              <th>Date</th>

              <th>Collection</th>

              <th>Running Balance</th>

            </tr>

          </thead>

          <tbody>

            {history.map((item,index)=>(

              <tr key={item._id}>

                <td>{index+1}</td>

                <td>

                  {new Date(item.date).toLocaleDateString()}

                </td>

                <td>

                  ₹ {Number(item.amount).toLocaleString()}

                </td>

                <td>

                  ₹ {Number(item.runningBalance).toLocaleString()}

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>

  );

};

export default StatementTable;