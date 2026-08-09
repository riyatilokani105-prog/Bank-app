import { useState } from "react";
import toast from "react-hot-toast";
import { updateCustomer } from "../../api/customerApi";
import "./EditCustomer.css";

const EditCustomer = ({
  customer,
  closeModal,
  refreshCustomers,
}) => {

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    fullName: customer.fullName || "",
    balance: customer.balance || 0,
    shift: customer.shift || ["Morning"],
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleShiftChange = (shift) => {
    let updatedShift = [...formData.shift];

    if (updatedShift.includes(shift)) {
      updatedShift = updatedShift.filter(
        (item) => item !== shift
      );
    } else {
      updatedShift.push(shift);
    }

    if (updatedShift.length === 0) {
      return toast.error(
        "Select at least one shift."
      );
    }

    setFormData({
      ...formData,
      shift: updatedShift,
    });
  };

  const submitHandler = async (e) => {

    e.preventDefault();

    try {

      setLoading(true);

      await updateCustomer(customer._id, {
        fullName: formData.fullName,
        balance: Number(formData.balance),
        shift: formData.shift,
      });

      await refreshCustomers?.();

      window.dispatchEvent(
        new Event("customerUpdated")
      );

      toast.success(
        "Customer Updated Successfully"
      );

      closeModal();

    } catch (error) {

      toast.error(
        error.response?.data?.message ||
        "Unable to Update Customer"
      );

    } finally {

      setLoading(false);

    }
  };

  return (
    <div className="edit-overlay">

      <div className="edit-modal">

        <div className="edit-header">

          <h2>Edit Customer</h2>

          <button
            type="button"
            onClick={closeModal}
          >
            ✕
          </button>

        </div>

        <form onSubmit={submitHandler}>

          <div className="edit-group">

            <label>Full Name</label>

            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
            />

          </div>

          <div className="edit-group">

            <label>Balance</label>

            <input
              type="number"
              name="balance"
              value={formData.balance}
              onChange={handleChange}
            />

          </div>

          {/* Shift Selection */}

          <div className="edit-group">

            <label>Collection Shift</label>

            <div className="shift-options">

              <label className="shift-box">

                <input
                  type="checkbox"
                  checked={formData.shift.includes("Morning")}
                  onChange={() =>
                    handleShiftChange("Morning")
                  }
                />

                Morning

              </label>

              <label className="shift-box">

                <input
                  type="checkbox"
                  checked={formData.shift.includes("Evening")}
                  onChange={() =>
                    handleShiftChange("Evening")
                  }
                />

                Evening

              </label>

            </div>

          </div>

          <button
            className="update-btn"
            disabled={loading}
          >
            {loading
              ? "Updating..."
              : "Update Customer"}
          </button>

        </form>

      </div>

    </div>
  );
};

export default EditCustomer;