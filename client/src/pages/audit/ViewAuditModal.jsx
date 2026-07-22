import "./ViewAuditModal.css";

const ViewAuditModal = ({ log, closeModal }) => {
  if (!log) return null;

  return (
    <div className="audit-modal-overlay">

      <div className="audit-modal">

        <div className="audit-modal-header">

          <h2>Audit Log Details</h2>

          <button onClick={closeModal}>
            ✖
          </button>

        </div>

        <div className="audit-body">

          <div className="audit-item">
            <label>Action</label>
            <span>{log.action}</span>
          </div>

          <div className="audit-item">
            <label>Description</label>
            <span>{log.description}</span>
          </div>

          <div className="audit-item">
            <label>Admin</label>
            <span>
              {log.admin?.name || "Unknown"}
            </span>
          </div>

          <div className="audit-item">
            <label>IP Address</label>
            <span>{log.ipAddress}</span>
          </div>

          <div className="audit-item">
            <label>Date</label>
            <span>
              {new Date(log.createdAt).toLocaleString()}
            </span>
          </div>

        </div>

        <button
          className="close-btn"
          onClick={closeModal}
        >
          Close
        </button>

      </div>

    </div>
  );
};

export default ViewAuditModal;