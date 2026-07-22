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
    mobile: customer.mobile || "",
    balance: customer.balance || 0,
  });

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

  };

  const submitHandler = async (e) => {

    e.preventDefault();

    try {

      setLoading(true);

      await updateCustomer(customer._id, formData);

      toast.success("Customer Updated Successfully");

      refreshCustomers();

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

          <button onClick={closeModal}>
            ✕

          </button>

        </div>

        <form onSubmit={submitHandler}>

          <div className="edit-group">

            <label>Full Name</label>

            <input
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
            />

          </div>

          <div className="edit-group">

            <label>Mobile</label>

            <input
              name="mobile"
              value={formData.mobile}
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

          <button
            className="update-btn"
            disabled={loading}
          >

            {loading ? "Updating..." : "Update Customer"}

          </button>

        </form>

      </div>

    </div>

  );

};

export default EditCustomer;