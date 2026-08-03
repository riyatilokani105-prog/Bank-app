import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

import { addCollection } from "../../api/collectionApi";
import { getCustomers } from "../../api/customerApi";

import "./AddCollection.css";

const AddCollection = ({ closeModal, refreshCollections }) => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");

  const [formData, setFormData] = useState({
    customerId: "",
    amount: "",
  });

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      const res = await getCustomers();

      if (Array.isArray(res.customers)) {
        setCustomers(res.customers);
      } else if (Array.isArray(res)) {
        setCustomers(res);
      } else {
        setCustomers([]);
      }
    } catch (err) {
      console.log(err);
      toast.error("Unable to load customers");
    }
  };

  const filteredCustomers = useMemo(() => {
    if (!search.trim()) return customers;

    const query = search.toLowerCase();

    return customers.filter((customer) => {
      return (
        customer.fullName?.toLowerCase().includes(query) ||
        customer.accountNumber?.toString().includes(query)
      );
    });
  }, [customers, search]);

  const changeHandler = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const saveCollection = async (forceSave = false) => {
    try {
      setLoading(true);

      const payload = {
        ...formData,
        forceSave,
      };

      const res = await addCollection(payload);

      toast.success(res.message);

      if (refreshCollections) {
        await refreshCollections();
      }

      closeModal();

    } catch (err) {

      if (err.response?.status === 409) {

        const confirmSave = window.confirm(
          "Collection for this account has already been added today.\n\nDo you want to add another collection for the same account?"
        );

        if (confirmSave) {
          return saveCollection(true);
        }

        return;
      }

      toast.error(
        err.response?.data?.message ||
          "Unable to Add Collection"
      );

    } finally {
      setLoading(false);
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!formData.customerId) {
      return toast.error("Please select customer");
    }

    if (!formData.amount || Number(formData.amount) <= 0) {
      return toast.error("Enter valid amount");
    }

    saveCollection(false);
  };

  return (
    <div className="modal-overlay">
      <div className="modal">

        <h2>Add Daily Collection</h2>

        <form onSubmit={submitHandler}>

          <div className="customer-search-box">
            <input
              type="text"
              placeholder="Search by Account Number or Customer Name"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select
            name="customerId"
            value={formData.customerId}
            onChange={changeHandler}
            required
          >
            <option value="">Select Customer</option>

            {filteredCustomers.map((customer) => (
              <option
                key={customer._id}
                value={customer._id}
              >
                {customer.accountNumber} - {customer.fullName}
              </option>
            ))}
          </select>

          <input
            type="number"
            name="amount"
            placeholder="Collection Amount"
            value={formData.amount}
            onChange={changeHandler}
            required
          />

          <div className="modal-actions">

            <button
              type="submit"
              className="save-btn"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Collection"}
            </button>

            <button
              type="button"
              className="cancel-btn"
              onClick={closeModal}
              disabled={loading}
            >
              Cancel
            </button>

          </div>

        </form>

      </div>
    </div>
  );
};

export default AddCollection;