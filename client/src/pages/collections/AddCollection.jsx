import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

import { bulkCollection } from "../../api/collectionApi";
import { getCustomers } from "../../api/customerApi";

import "./AddCollection.css";

const AddCollection = ({ closeModal, refreshCollections }) => {

  const [customers, setCustomers] = useState([]);
  const [rows, setRows] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);
  const STORAGE_KEY = "dailyCollectionSheet";

  useEffect(() => {
    loadCustomers();
  }, []);

  useEffect(() => {

    let total = 0;

    rows.forEach((row) => {
      total += Number(row.amount || 0);
    });

    setTotalAmount(total);

  }, [rows]);

  const loadCustomers = async () => {
  try {
    const res = await getCustomers();

    const list = Array.isArray(res.customers)
      ? res.customers
      : Array.isArray(res)
      ? res
      : [];

    setCustomers(list);

    const today = new Date().toDateString();

    const saved = JSON.parse(
      localStorage.getItem("dailyCollectionSheet")
    );

    if (saved && saved.date === today) {
      setRows(saved.rows);
    } else {
      const newRows = list.map((customer) => ({
        customerId: customer._id,
        accountNumber: customer.accountNumber,
        fullName: customer.fullName,
        amount: "",
      }));

      setRows(newRows);

      localStorage.setItem(
        "dailyCollectionSheet",
        JSON.stringify({
          date: today,
          rows: newRows,
        })
      );
    }
  } catch (err) {
    console.log(err);
    toast.error("Unable to load customers");
  }
};
 

    const filteredRows = useMemo(() => {

    if (!search.trim()) return rows;

    const query = search.toLowerCase();

    return rows.filter((row) => {

      return (
        row.accountNumber?.toString().includes(query) ||
        row.fullName?.toLowerCase().includes(query)
      );

    });

  }, [rows, search]);

  const amountChangeHandler = (customerId, value) => {
  setRows((prev) => {
    const updatedRows = prev.map((row) =>
      row.customerId === customerId
        ? {
            ...row,
            amount: value,
          }
        : row
    );

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        date: new Date().toDateString(),
        rows: updatedRows,
      })
    );

    return updatedRows;
  });
};

const saveAllCollections = async (forceSave = false) => {
  try {
    setLoading(true);

    const collections = rows
      .filter((row) => Number(row.amount) > 0)
      .map((row) => ({
        customerId: row.customerId,
        amount: Number(row.amount),
      }));

    console.log("Collections to send:", collections);

    if (collections.length === 0) {
      toast.error("Please enter at least one amount.");
      return;
    }

const res = await bulkCollection({
  collections,
  forceSave,
});

    toast.success(res.message);
    localStorage.removeItem(STORAGE_KEY);

    refreshCollections && (await refreshCollections());

    closeModal();

  } catch (err) {
    console.log(err.response?.data);

    toast.error(
      err.response?.data?.message || "Unable to save collections."
    );
  } finally {
    setLoading(false);
  }
};

  const submitHandler = (e) => {

    e.preventDefault();

    saveAllCollections(false);

  };

    return (
    <div className="modal-overlay">

      <div className="collection-modal">

        <div className="collection-header">

          <h2>Daily Collection Sheet</h2>

        

        </div>

        <div className="collection-search">

          <input
            type="text"
            placeholder="Search by Account Number or Customer Name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

        </div>

        <form onSubmit={submitHandler}>

          <div className="table-container">

            <table className="collection-table">

              <thead>

                <tr>
                  <th>Sr.</th>
                  <th>Account No.</th>
                  <th>Customer Name</th>
                  <th>Today's Collection</th>
                </tr>

              </thead>

              <tbody>

                {filteredRows.length === 0 ? (

                  <tr>

                    <td
                      colSpan="4"
                      style={{
                        textAlign: "center",
                        padding: "30px",
                      }}
                    >
                      No Customer Found
                    </td>

                  </tr>

                ) : (

                  filteredRows.map((row, index) => (

                    <tr key={row.customerId}>

                      <td>{index + 1}</td>

                      <td>{row.accountNumber}</td>

                      <td>{row.fullName}</td>

                      <td>

                        <input
                          type="number"
                          min="0"
                          step="1"
                          placeholder="0"
                          value={row.amount}
                          onChange={(e) =>
                            amountChangeHandler(
                              row.customerId,
                              e.target.value
                            )
                          }
                        />

                      </td>

                    </tr>

                  ))

                )}

              </tbody>

            </table>

          </div>

                    <div className="collection-footer">

            <div className="collection-total">
              <h3>
                Total Collection :
                <span> ₹ {totalAmount}</span>
              </h3>
            </div>

            <div className="collection-buttons">

              <button
                type="submit"
                className="save-btn"
                disabled={loading}
              >
                {loading
                  ? "Saving..."
                  : "Save All Collections"}
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

          </div>

        </form>

      </div>

    </div>
  );
};

export default AddCollection;