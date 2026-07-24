import { useState } from "react";
import toast from "react-hot-toast";

import { deleteCustomer } from "../../api/customerApi";

import "./DeleteCustomer.css";

const DeleteCustomer = ({
  customer,
  closeModal,
  refreshCustomers,
}) => {
  const [loading, setLoading] = useState(false);

  const deleteHandler = async () => {
    try {
      setLoading(true);

      console.log("Deleting Customer:");
      console.log(customer);

      const res = await deleteCustomer(customer._id);

      toast.success(
        res.message || "Customer Deleted Successfully"
      );

      await refreshCustomers();

      closeModal();

    } catch (error) {
      console.log(error);

      toast.error(
        error.response?.data?.message ||
        "Unable to Delete Customer"
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

        <h2>Delete Customer</h2>

        <p>
          Are you sure you want to delete
          <strong> {customer.fullName}</strong> ?
        </p>

        <div className="delete-buttons">

          <button
            className="cancel-btn"
            onClick={closeModal}
            disabled={loading}
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

export default DeleteCustomer;