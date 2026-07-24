import { FaEye } from "react-icons/fa";
import "./AuditTable.css";

const AuditTable = ({
  logs,
  onView,
}) => {
  return (
    <div className="table-wrapper">

      <table>

        <thead>

          <tr>

            <th>Date</th>
            <th>Action</th>
            <th>Description</th>
            <th>IP</th>
            <th>View</th>

          </tr>

        </thead>

        <tbody>

          {logs.length === 0 ? (

            <tr>

              <td colSpan="5">

                No Audit Logs Found

              </td>

            </tr>

          ) : (

            logs.map((log) => (

              <tr key={log._id}>

                <td>
                  {new Date(log.createdAt).toLocaleString()}
                </td>

                <td>{log.action}</td>

                <td>{log.description}</td>

                <td>{log.ipAddress}</td>

                <td>

                  <button
                    className="view-btn"
                    onClick={() => onView(log)}
                  >
                    <FaEye />
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

export default AuditTable;