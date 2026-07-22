import { useState } from "react";
import toast from "react-hot-toast";
import { addCustomer } from "../../api/customerApi";
import "./AddCustomer.css";

const AddCustomer = ({ closeModal, refreshCustomers }) => {
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    accountNumber: "",
    fullName: "",
    mobile: "",
    balance: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (
      !formData.accountNumber ||
      !formData.fullName ||
      !formData.mobile
    ) {
      return toast.error("Please fill all required fields");
    }

    try {
      setLoading(true);

      await addCustomer({
        accountNumber: formData.accountNumber,
        fullName: formData.fullName,
        mobile: formData.mobile,
        balance: Number(formData.balance) || 0,
      });

      toast.success("Customer Added Successfully");

      if (refreshCustomers) {
        refreshCustomers();
      }

      closeModal();

    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        "Failed to Add Customer"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="customer-modal">

        <div className="modal-header">
          <h2>Add Customer</h2>

          <button
            type="button"
            onClick={closeModal}
          >
            ✕
          </button>
        </div>

        <form onSubmit={submitHandler}>

          <div className="form-group">
            <label>Account Number *</label>

            <input
              type="text"
              name="accountNumber"
              placeholder="Enter Account Number"
              value={formData.accountNumber}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Full Name *</label>

            <input
              type="text"
              name="fullName"
              placeholder="Enter Customer Name"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Mobile Number *</label>

            <input
              type="tel"
              name="mobile"
              placeholder="Enter Mobile Number"
              value={formData.mobile}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Opening Balance</label>

            <input
              type="number"
              name="balance"
              placeholder="Enter Opening Balance"
              value={formData.balance}
              onChange={handleChange}
              min="0"
            />
          </div>

          <button
            type="submit"
            className="save-btn"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Customer"}
          </button>

        </form>

      </div>
    </div>
  );
};

export default AddCustomer;