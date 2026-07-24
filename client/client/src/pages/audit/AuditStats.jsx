import {
  FaHistory,
  FaPlusCircle,
  FaEdit,
  FaTrashAlt,
} from "react-icons/fa";

import "./AuditStats.css";

const AuditStats = ({ logs }) => {

  const totalLogs = logs.length;

  const added = logs.filter(log =>
    log.action?.toLowerCase().includes("add")
  ).length;

  const updated = logs.filter(log =>
    log.action?.toLowerCase().includes("update")
  ).length;

  const deleted = logs.filter(log =>
    log.action?.toLowerCase().includes("delete")
  ).length;

  return (

    <div className="audit-cards">

      <div className="audit-card blue">

        <FaHistory />

        <div>

          <h3>{totalLogs}</h3>

          <p>Total Logs</p>

        </div>

      </div>

      <div className="audit-card green">

        <FaPlusCircle />

        <div>

          <h3>{added}</h3>

          <p>Added</p>

        </div>

      </div>

      <div className="audit-card orange">

        <FaEdit />

        <div>

          <h3>{updated}</h3>

          <p>Updated</p>

        </div>

      </div>

      <div className="audit-card red">

        <FaTrashAlt />

        <div>

          <h3>{deleted}</h3>

          <p>Deleted</p>

        </div>

      </div>

    </div>

  );

};

export default AuditStats;