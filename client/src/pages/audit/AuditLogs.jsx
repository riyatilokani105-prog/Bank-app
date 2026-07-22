import { useEffect, useState } from "react";
import Layout from "../../components/layout/Layout";

import { getAuditLogs } from "../../api/auditApi";

import AuditSearch from "./AuditSearch";
import AuditStats from "./AuditStats";
import AuditTable from "./AuditTable";
import ViewAuditModal from "./ViewAuditModal";

import "./AuditLogs.css";

const AuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [viewModal, setViewModal] = useState(false);
  const [selectedLog, setSelectedLog] = useState(null);

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    try {
      setLoading(true);

      const res = await getAuditLogs();

      setLogs(res.logs || []);
    } catch (err) {
      console.log(err);
      setLogs([]);
    } finally {
      setLoading(false);
    }
  };

  const openView = (log) => {
    setSelectedLog(log);
    setViewModal(true);
  };

  const closeView = () => {
    setViewModal(false);
    setSelectedLog(null);
  };

  const filteredLogs = logs.filter((log) => {
    const query = search.toLowerCase();

    return (
      log.action?.toLowerCase().includes(query) ||
      log.description?.toLowerCase().includes(query)
    );
  });

  return (
    <Layout>
      <div className="audit-page">
        <div className="audit-header">
          <div>
            <h1>Audit Logs</h1>
            <p>System Activity History</p>
          </div>
        </div>

        <AuditStats logs={logs} />

        <AuditSearch
          value={search}
          onChange={setSearch}
        />

        {loading ? (
          <div className="loading-box">
            <h2>Loading Audit Logs...</h2>
          </div>
        ) : (
          <AuditTable
            logs={filteredLogs}
            onView={openView}
          />
        )}

        {viewModal && (
          <ViewAuditModal
            log={selectedLog}
            closeModal={closeView}
          />
        )}
      </div>
    </Layout>
  );
};

export default AuditLogs;