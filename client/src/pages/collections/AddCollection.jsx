import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

import {
  bulkCollection,
  getCollections,
} from "../../api/collectionApi";
import {
  getCustomers,
  addCustomer,
  deleteCustomer,
} from "../../api/customerApi";

import "./AddCollection.css";

const STORAGE_KEY = "dailyCollectionSheet";

const AddCollection = ({ closeModal, refreshCollections }) => {
  // =====================================================
  // STATES
  // =====================================================

  const [morningRows, setMorningRows] = useState([]);
  const [eveningRows, setEveningRows] = useState([]);

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(false);

  const [morningTotal, setMorningTotal] = useState(0);
  const [eveningTotal, setEveningTotal] = useState(0);

  const [showAddCustomer, setShowAddCustomer] = useState(false);

  const [customerData, setCustomerData] = useState({
    accountNumber: "",
    fullName: "",
    balance: "",
    shift: ["Morning"],
  });

  const [customerLoading, setCustomerLoading] = useState(false);

  // =====================================================
  // HANDLE CUSTOMER FORM CHANGE
  // =====================================================

  const handleChange = (e) => {
    setCustomerData({
      ...customerData,
      [e.target.name]: e.target.value,
    });
  };

  // =====================================================
  // HANDLE SHIFT CHANGE
  // =====================================================

  const handleShiftChange = (shift) => {
    let updatedShift = [...customerData.shift];

    if (updatedShift.includes(shift)) {
      updatedShift = updatedShift.filter(
        (item) => item !== shift
      );
    } else {
      updatedShift.push(shift);
    }

    if (updatedShift.length === 0) {
      return toast.error("Select at least one shift.");
    }

    setCustomerData({
      ...customerData,
      shift: updatedShift,
    });
  };

  // =====================================================
  // LOAD CUSTOMERS
  // =====================================================

  const loadCustomers = async () => {
  try {
    const res = await getCustomers();

    const list = Array.isArray(res?.customers)
      ? res.customers
      : Array.isArray(res)
      ? res
      : [];

    // =====================================================
    // CHECK SAVED COLLECTIONS FROM BACKEND
    // =====================================================

    let latestCollectionDate = null;

    try {
      const collectionRes = await getCollections();

      const savedCollections = Array.isArray(
        collectionRes?.collections
      )
        ? collectionRes.collections
        : Array.isArray(collectionRes)
        ? collectionRes
        : [];

      savedCollections.forEach((collection) => {
        if (!collection?.createdAt) {
          return;
        }

        const date = new Date(
          collection.createdAt
        );

        if (
          !Number.isNaN(date.getTime()) &&
          (!latestCollectionDate ||
            date > latestCollectionDate)
        ) {
          latestCollectionDate = date;
        }
      });
    } catch (collectionError) {
      console.error(
        "GET SAVED COLLECTIONS ERROR:",
        collectionError
      );
    }

    // =====================================================
    // READ LOCAL DRAFT
    // =====================================================

    let saved = null;

    try {
      const stored =
        localStorage.getItem(STORAGE_KEY);

      if (stored) {
        saved = JSON.parse(stored);
      }
    } catch (error) {
      console.error(
        "Unable to read collection draft:",
        error
      );

      localStorage.removeItem(STORAGE_KEY);
    }

    // =====================================================
    // CHECK WHETHER LOCAL DRAFT IS OLD
    // =====================================================

    let draftIsValid = true;

    if (saved) {
      const draftUpdatedAt = saved.updatedAt
        ? new Date(saved.updatedAt)
        : null;

      // ---------------------------------------------------
      // If this mobile/browser has an old draft without
      // updatedAt and backend already has collections,
      // don't restore that old amount.
      // ---------------------------------------------------

      if (
        !draftUpdatedAt ||
        Number.isNaN(
          draftUpdatedAt.getTime()
        )
      ) {
        if (latestCollectionDate) {
          draftIsValid = false;
        }
      }

      // ---------------------------------------------------
      // If backend collection is newer than local draft,
      // the local draft is old.
      // ---------------------------------------------------

      else if (
        latestCollectionDate &&
        latestCollectionDate > draftUpdatedAt
      ) {
        draftIsValid = false;
      }
    }

    // =====================================================
    // REMOVE OLD MOBILE DRAFT
    // =====================================================

    if (!draftIsValid) {
      localStorage.removeItem(STORAGE_KEY);
      saved = null;
    }

    // =====================================================
    // OLD MORNING / EVENING DATA
    // =====================================================

    const oldMorning =
      saved?.morningRows || [];

    const oldEvening =
      saved?.eveningRows || [];

    // =====================================================
    // MORNING CUSTOMERS
    // =====================================================

    const morningList = list.filter(
      (customer) =>
        Array.isArray(customer.shift)
          ? customer.shift.includes("Morning")
          : customer.shift === "Morning"
    );

    const morning = morningList.map(
      (customer, index) => {
        const existing = oldMorning.find(
          (row) =>
            row.customerId === customer._id
        );

        return {
          customerId: customer._id,
          fullName: customer.fullName,
          accountNumber:
            customer.accountNumber,
          srNo: index + 1,

          amount: existing
            ? existing.amount
            : "",
        };
      }
    );

    // =====================================================
    // EVENING CUSTOMERS
    // =====================================================

    const eveningList = list.filter(
      (customer) =>
        Array.isArray(customer.shift)
          ? customer.shift.includes("Evening")
          : customer.shift === "Evening"
    );

    const evening = eveningList.map(
      (customer, index) => {
        const existing = oldEvening.find(
          (row) =>
            row.customerId === customer._id
        );

        return {
          customerId: customer._id,
          fullName: customer.fullName,
          accountNumber:
            customer.accountNumber,
          srNo: index + 1,

          amount: existing
            ? existing.amount
            : "",
        };
      }
    );

    // =====================================================
    // UPDATE STATE
    // =====================================================

    setMorningRows(morning);
    setEveningRows(evening);

  } catch (err) {
    console.error(
      "LOAD CUSTOMERS ERROR:",
      err
    );

    toast.error(
      "Unable to load customers"
    );
  }
};

  // =====================================================
  // INITIAL LOAD + EVENTS
  // =====================================================

  useEffect(() => {
    // Initial customer load
    loadCustomers();

    // =================================================
    // CUSTOMER UPDATED
    // =================================================

    const handleCustomerUpdated = () => {
      loadCustomers();
    };

    // =================================================
    // COLLECTION UPDATED
    // =================================================

    const handleCollectionUpdated = () => {
      // Clear old unsaved draft
      localStorage.removeItem(STORAGE_KEY);

      // Clear Morning amounts
      setMorningRows((rows) =>
        rows.map((row) => ({
          ...row,
          amount: "",
        }))
      );

      // Clear Evening amounts
      setEveningRows((rows) =>
        rows.map((row) => ({
          ...row,
          amount: "",
        }))
      );

      // Reset totals
      setMorningTotal(0);
      setEveningTotal(0);
    };

    // =================================================
    // EVENT LISTENERS
    // =================================================

    window.addEventListener(
      "customerUpdated",
      handleCustomerUpdated
    );

    window.addEventListener(
      "collectionUpdated",
      handleCollectionUpdated
    );

    // =================================================
    // CLEANUP
    // =================================================

    return () => {
      window.removeEventListener(
        "customerUpdated",
        handleCustomerUpdated
      );

      window.removeEventListener(
        "collectionUpdated",
        handleCollectionUpdated
      );
    };
  }, []);

  // =====================================================
  // ADD CUSTOMER
  // =====================================================

  const handleAddCustomer = async (e) => {
    e.preventDefault();

    if (
      !customerData.accountNumber ||
      !customerData.fullName
    ) {
      return toast.error(
        "Please fill all required fields"
      );
    }

    try {
      setCustomerLoading(true);

      await addCustomer({
        accountNumber:
          customerData.accountNumber.trim(),

        fullName:
          customerData.fullName.trim(),

        balance:
          Number(customerData.balance) || 0,

        shift: customerData.shift,
      });

      // Event listener will reload customers
      window.dispatchEvent(
        new Event("customerUpdated")
      );

      toast.success(
        "Customer Added Successfully"
      );

      // Reset form
      setCustomerData({
        accountNumber: "",
        fullName: "",
        balance: "",
        shift: ["Morning"],
      });

      setShowAddCustomer(false);
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Failed to Add Customer"
      );
    } finally {
      setCustomerLoading(false);
    }
  };

  // =====================================================
  // DELETE CUSTOMER
  // =====================================================

  const handleDeleteCustomer = async (id) => {
    try {
      await deleteCustomer(id);

      toast.success("Customer Deleted");

      await loadCustomers();
    } catch (err) {
      console.error(
        "DELETE CUSTOMER ERROR:",
        err
      );

      toast.error(
        "Unable to delete customer"
      );
    }
  };

  // =====================================================
  // TOTALS
  // =====================================================

  useEffect(() => {
    const morning = morningRows.reduce(
      (sum, row) =>
        sum + Number(row.amount || 0),
      0
    );

    const evening = eveningRows.reduce(
      (sum, row) =>
        sum + Number(row.amount || 0),
      0
    );

    setMorningTotal(morning);
    setEveningTotal(evening);
  }, [morningRows, eveningRows]);

  const grandTotal =
    morningTotal + eveningTotal;

  // =====================================================
  // SEARCH - MORNING
  // =====================================================

  const filteredMorning = useMemo(() => {
    const query = search
      .trim()
      .toLowerCase();

    if (!query) {
      return morningRows;
    }

    return morningRows.filter((row) =>
      row.fullName
        ?.toLowerCase()
        .includes(query)
    );
  }, [morningRows, search]);

  // =====================================================
  // SEARCH - EVENING
  // =====================================================

  const filteredEvening = useMemo(() => {
    const query = search
      .trim()
      .toLowerCase();

    if (!query) {
      return eveningRows;
    }

    return eveningRows.filter((row) =>
      row.fullName
        ?.toLowerCase()
        .includes(query)
    );
  }, [eveningRows, search]);

  // =====================================================
  // MORNING AMOUNT CHANGE
  // =====================================================

 const morningAmountChange = (
  customerId,
  value
) => {
  const updated = morningRows.map(
    (row) =>
      row.customerId === customerId
        ? {
            ...row,
            amount: value,
          }
        : row
  );

  setMorningRows(updated);

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      morningRows: updated,
      eveningRows,
      updatedAt: new Date().toISOString(),
    })
  );
};

  // =====================================================
  // EVENING AMOUNT CHANGE
  // =====================================================

  const eveningAmountChange = (
  customerId,
  value
) => {
  const updated = eveningRows.map(
    (row) =>
      row.customerId === customerId
        ? {
            ...row,
            amount: value,
          }
        : row
  );

  setEveningRows(updated);

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      morningRows,
      eveningRows: updated,
      updatedAt: new Date().toISOString(),
    })
  );
};

  // =====================================================
  // SAVE ALL COLLECTIONS
  // =====================================================

  const saveAllCollections = async () => {
    try {
      setLoading(true);

      const collections = [];

      // =================================================
      // MORNING COLLECTIONS
      // =================================================

      morningRows.forEach((row) => {
        if (Number(row.amount) > 0) {
          collections.push({
            customerId: row.customerId,
            amount: Number(row.amount),
            session: "Morning",
          });
        }
      });

      // =================================================
      // EVENING COLLECTIONS
      // =================================================

      eveningRows.forEach((row) => {
        if (Number(row.amount) > 0) {
          collections.push({
            customerId: row.customerId,
            amount: Number(row.amount),
            session: "Evening",
          });
        }
      });

      // =================================================
      // VALIDATION
      // =================================================

      if (collections.length === 0) {
        toast.error(
          "Please enter at least one amount."
        );

        return;
      }

      console.log(
        "Saving collections:",
        collections
      );

      // =================================================
      // SAVE TO BACKEND
      // =================================================

      const res = await bulkCollection({
        collections,
        forceSave: true,
      });

      console.log(
        "BULK COLLECTION SAVE RESPONSE:",
        res
      );

      // =================================================
      // SUCCESS MESSAGE
      // =================================================

      toast.success(
        res?.message ||
          "Collections saved successfully"
      );

      // =================================================
      // CLEAR LOCAL STORAGE
      // =================================================

      localStorage.removeItem(STORAGE_KEY);

      // =================================================
      // CLEAR MORNING AMOUNTS
      // =================================================

      setMorningRows((rows) =>
        rows.map((row) => ({
          ...row,
          amount: "",
        }))
      );

      // =================================================
      // CLEAR EVENING AMOUNTS
      // =================================================

      setEveningRows((rows) =>
        rows.map((row) => ({
          ...row,
          amount: "",
        }))
      );

      // =================================================
      // RESET TOTALS
      // =================================================

      setMorningTotal(0);
      setEveningTotal(0);

      // =================================================
      // REFRESH COLLECTION PAGE
      // =================================================

      if (refreshCollections) {
        await refreshCollections();
      }

      // =================================================
      // NOTIFY OTHER COMPONENTS
      // =================================================

      window.dispatchEvent(
        new Event("collectionUpdated")
      );

      // =================================================
      // CLOSE MODAL
      // =================================================

      closeModal();
    } catch (err) {
      console.error(
        "SAVE COLLECTION ERROR:",
        err
      );

      toast.error(
        err?.response?.data?.message ||
          "Unable to save collections."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // JSX
  // =====================================================

  return (
    <div className="modal-overlay">
      <div className="collection-modal">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="collection-topbar">
          <div className="collection-header">
            <h2>
              Daily Collection Sheet
            </h2>
          </div>
        </div>

        {/* =================================================
            SEARCH
        ================================================= */}

        <div className="collection-search">
          <input
            type="text"
            placeholder="Search Customer..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />
        </div>

        {/* =================================================
            ADD CUSTOMER POPUP
        ================================================= */}

        {showAddCustomer && (
          <div className="customer-popup">

            <div className="modal-header">
              <h2>
                Add Customer
              </h2>

              <button
                type="button"
                onClick={() =>
                  setShowAddCustomer(false)
                }
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={handleAddCustomer}
            >

              {/* ACCOUNT NUMBER */}

              <div className="form-group">
                <label>
                  Account Number *
                </label>

                <input
                  type="text"
                  name="accountNumber"
                  placeholder="Enter Account Number"
                  value={
                    customerData.accountNumber
                  }
                  onChange={handleChange}
                  required
                />
              </div>

              {/* FULL NAME */}

              <div className="form-group">
                <label>
                  Full Name *
                </label>

                <input
                  type="text"
                  name="fullName"
                  placeholder="Enter Customer Name"
                  value={
                    customerData.fullName
                  }
                  onChange={handleChange}
                  required
                />
              </div>

              {/* OPENING BALANCE */}

              <div className="form-group">
                <label>
                  Opening Balance
                </label>

                <input
                  type="number"
                  name="balance"
                  placeholder="Enter Opening Balance"
                  value={
                    customerData.balance
                  }
                  onChange={handleChange}
                  min="0"
                />
              </div>

              {/* SHIFT */}

              <div className="form-group">
                <label>
                  Collection Shift *
                </label>

                <div className="shift-options">

                  <label className="shift-box">
                    <input
                      type="checkbox"
                      checked={customerData.shift.includes(
                        "Morning"
                      )}
                      onChange={() =>
                        handleShiftChange(
                          "Morning"
                        )
                      }
                    />

                    Morning
                  </label>

                  <label className="shift-box">
                    <input
                      type="checkbox"
                      checked={customerData.shift.includes(
                        "Evening"
                      )}
                      onChange={() =>
                        handleShiftChange(
                          "Evening"
                        )
                      }
                    />

                    Evening
                  </label>

                </div>
              </div>

              {/* SAVE CUSTOMER */}

              <button
                type="submit"
                className="save-btn"
                disabled={customerLoading}
              >
                {customerLoading
                  ? "Saving..."
                  : "Save Customer"}
              </button>

            </form>
          </div>
        )}

        {/* =================================================
            COLLECTION BODY
        ================================================= */}

        <div className="collection-body">

          {/* =================================================
              MORNING
          ================================================= */}

          <div className="collection-section">

            <h3 className="section-title">
              🌅 Morning Customers
            </h3>

            <div className="table-container">

              <table className="collection-table">

                <thead>
                  <tr>
                    <th>Sr No</th>
                    <th>Account Holder Name</th>
                    <th>Deposit Amount</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>

                  {filteredMorning.length === 0 ? (
                    <tr>
                      <td
                        colSpan="4"
                        style={{
                          textAlign: "center",
                          padding: "25px",
                        }}
                      >
                        No Customers Found
                      </td>
                    </tr>
                  ) : (
                    filteredMorning.map(
                      (row) => (
                        <tr
                          key={
                            row.customerId
                          }
                        >

                          <td>
                            {row.srNo}
                          </td>

                          <td>
                            {row.fullName}
                          </td>

                          <td>
                            <input
                              type="number"
                              min="0"
                              placeholder="₹"
                              value={
                                row.amount
                              }
                              onChange={(e) =>
                                morningAmountChange(
                                  row.customerId,
                                  e.target.value
                                )
                              }
                            />
                          </td>

                          <td>
                            <button
                              type="button"
                              className="delete-btn"
                              onClick={() =>
                                handleDeleteCustomer(
                                  row.customerId
                                )
                              }
                            >
                              Delete
                            </button>
                          </td>

                        </tr>
                      )
                    )
                  )}

                </tbody>

              </table>

            </div>

            <div className="section-total">
              <h3>
                Morning Total :
                <span>
                  {" "}
                  ₹ {morningTotal}
                </span>
              </h3>
            </div>

          </div>

          {/* =================================================
              EVENING
          ================================================= */}

          <div className="collection-section">

            <h3 className="section-title">
              🌇 Evening Customers
            </h3>

            <div className="table-container">

              <table className="collection-table">

                <thead>
                  <tr>
                    <th>Sr No</th>
                    <th>Account Holder Name</th>
                    <th>Deposit Amount</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>

                  {filteredEvening.length === 0 ? (
                    <tr>
                      <td
                        colSpan="4"
                        style={{
                          textAlign: "center",
                          padding: "25px",
                        }}
                      >
                        No Customers Found
                      </td>
                    </tr>
                  ) : (
                    filteredEvening.map(
                      (row) => (
                        <tr
                          key={
                            row.customerId
                          }
                        >

                          <td>
                            {row.srNo}
                          </td>

                          <td>
                            {row.fullName}
                          </td>

                          <td>
                            <input
                              type="number"
                              min="0"
                              placeholder="₹"
                              value={
                                row.amount
                              }
                              onChange={(e) =>
                                eveningAmountChange(
                                  row.customerId,
                                  e.target.value
                                )
                              }
                            />
                          </td>

                          <td>
                            <button
                              type="button"
                              className="delete-btn"
                              onClick={() =>
                                handleDeleteCustomer(
                                  row.customerId
                                )
                              }
                            >
                              Delete
                            </button>
                          </td>

                        </tr>
                      )
                    )
                  )}

                </tbody>

              </table>

            </div>

            <div className="section-total">
              <h3>
                Evening Total :
                <span>
                  {" "}
                  ₹ {eveningTotal}
                </span>
              </h3>
            </div>

          </div>

        </div>

        {/* =================================================
            FOOTER
        ================================================= */}

        <div className="collection-footer">

          <div className="collection-total">
            <h2>
              Grand Total :
              <span>
                {" "}
                ₹ {grandTotal}
              </span>
            </h2>
          </div>

          <div className="collection-buttons">

            <button
              type="button"
              className="save-btn"
              onClick={saveAllCollections}
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

      </div>
    </div>
  );
};

export default AddCollection;