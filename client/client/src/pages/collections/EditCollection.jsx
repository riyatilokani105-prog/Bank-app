import { useState } from "react";
import toast from "react-hot-toast";
import { updateCollection } from "../../api/collectionApi";

import "./EditCollection.css";

const EditCollection = ({
  collection,
  closeModal,
  refreshCollections,
}) => {

  const [amount, setAmount] = useState(collection.amount);
  const [loading, setLoading] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();

    try {

      setLoading(true);

      await updateCollection(collection._id, {
        amount,
      });

      toast.success("Collection Updated Successfully");

      await refreshCollections();

      closeModal();

    } catch (err) {

      toast.error(
        err.response?.data?.message ||
        "Unable to Update Collection"
      );

    } finally {

      setLoading(false);

    }
  };

  return (
    <div className="modal-overlay">

      <div className="modal">

        <h2>Edit Collection</h2>

        <form onSubmit={submitHandler}>

          <input
            value={collection.customerName}
            disabled
          />

          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />

          <div className="modal-buttons">

            <button
              type="button"
              onClick={closeModal}
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
            >
              {loading ? "Updating..." : "Update"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
};

export default EditCollection;