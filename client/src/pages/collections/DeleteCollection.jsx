import { useState } from "react";
import toast from "react-hot-toast";

import { deleteCollection } from "../../api/collectionApi";

import "./DeleteCollection.css";

const DeleteCollection = ({
  collection,
  closeModal,
  refreshCollections,
}) => {

  const [loading, setLoading] = useState(false);

  const deleteHandler = async () => {

    try {

      setLoading(true);

      const res = await deleteCollection(collection._id);

      toast.success(
        res.message || "Collection Deleted Successfully"
      );

      refreshCollections();

      closeModal();

    } catch (err) {

      toast.error(
        err.response?.data?.message ||
        "Unable to Delete Collection"
      );

    } finally {

      setLoading(false);

    }

  };

  return (

    <div className="delete-overlay">

      <div className="delete-modal">

        <div className="delete-icon">
          🗑️
        </div>

        <h2>Delete Collection</h2>

        <p>

          Delete this collection of

          <strong> ₹ {collection.amount}</strong>

          ?

        </p>

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

export default DeleteCollection;