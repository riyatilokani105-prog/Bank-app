import { useState } from "react";

import toast from "react-hot-toast";

import { deleteLedger } from "../../api/ledgerApi";

import "./DeleteLedger.css";

const DeleteLedger = ({
  ledger,
  closeModal,
  refreshLedger,
}) => {

  const [loading, setLoading] = useState(false);

  const deleteHandler = async () => {

    try {

      setLoading(true);

      const res = await deleteLedger(ledger._id);

      toast.success(
        res.message || "Ledger Deleted"
      );

      refreshLedger();

      closeModal();

    } catch (err) {

      toast.error(
        err.response?.data?.message ||
        "Unable to Delete"
      );

    } finally {

      setLoading(false);

    }

  };

  return (

    <div className="delete-overlay">

      <div className="delete-modal">

        <h2>Delete Ledger</h2>

        <p>

          Delete this ledger entry?

        </p>

        <h3>

          {ledger.customerName}

        </h3>

        <div className="delete-buttons">

          <button
            className="cancel-btn"
            onClick={closeModal}
          >
            Cancel
          </button>

          <button
            className="delete-btn"
            onClick={deleteHandler}
            disabled={loading}
          >
            {loading ? "Deleting..." : "Delete"}
          </button>

        </div>

      </div>

    </div>

  );

};

export default DeleteLedger;