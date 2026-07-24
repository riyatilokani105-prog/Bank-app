import {
  FaDatabase,
  FaFolderOpen,
  FaHistory,
} from "react-icons/fa";

import "./BackupStats.css";

const BackupStats = ({ history }) => {

  const totalBackups = history.length;

  const totalTransactions = history.reduce(
    (sum, item) => sum + item.totalTransactions,
    0
  );

  const totalCollection = history.reduce(
    (sum, item) => sum + item.totalCollection,
    0
  );

  const latest =
    history.length > 0
      ? new Date(history[0].createdAt).toLocaleDateString()
      : "-";

  return (

    <div className="backup-stats">

      <div className="stat-card">

        <FaDatabase className="icon"/>

        <h2>{totalBackups}</h2>

        <p>Total Backups</p>

      </div>

      <div className="stat-card">

        <FaFolderOpen className="icon"/>

        <h2>{totalTransactions}</h2>

        <p>Total Transactions</p>

      </div>

      <div className="stat-card">

        <FaHistory className="icon"/>

        <h2>

          ₹ {totalCollection.toLocaleString()}

        </h2>

        <p>Total Collection</p>

      </div>

      <div className="stat-card">

        <FaDatabase className="icon"/>

        <h2>{latest}</h2>

        <p>Last Backup</p>

      </div>

    </div>

  );

};

export default BackupStats;