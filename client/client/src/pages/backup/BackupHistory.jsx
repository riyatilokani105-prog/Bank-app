import "./BackupHistory.css";

const BackupHistory = ({ history }) => {

  return (

    <div className="backup-history">

      <h2>Backup History</h2>

      <table>

        <thead>

          <tr>

            <th>Date</th>
            <th>Month</th>
            <th>Year</th>
            <th>Transactions</th>
            <th>Total Collection</th>

          </tr>

        </thead>

        <tbody>

          {history.length===0? (

            <tr>

              <td colSpan="5">

                No Backup History Found

              </td>

            </tr>

          ): (

            history.map((backup)=>(

              <tr key={backup._id}>

                <td>

                  {new Date(
                    backup.createdAt
                  ).toLocaleDateString()}

                </td>

                <td>{backup.month}</td>

                <td>{backup.year}</td>

                <td>{backup.totalTransactions}</td>

                <td>

                  ₹ {backup.totalCollection}

                </td>

              </tr>

            ))

          )}

        </tbody>

      </table>

    </div>

  );

};

export default BackupHistory;