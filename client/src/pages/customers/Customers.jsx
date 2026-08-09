import { useEffect, useMemo, useState } from "react";
import Layout from "../../components/layout/Layout";
import toast from "react-hot-toast";

import {
  getCustomers,
  deleteCustomer,
} from "../../api/customerApi";

import AddCustomer from "./AddCustomer";
import EditCustomer from "./EditCustomer";

import "./Customers.css";

const Customers = () => {
  const [customers, setCustomers] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [showAddModal, setShowAddModal] = useState(false);

  const [showEditModal, setShowEditModal] = useState(false);

  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const [deletingId, setDeletingId] = useState(null);

  // DELETE CONFIRMATION MODAL
  const [customerToDelete, setCustomerToDelete] =
    useState(null);

  // =====================================================
  // LOAD CUSTOMERS FROM BACKEND
  // =====================================================

  useEffect(() => {
    loadCustomers();

    const handleCustomerUpdated = () => {
      loadCustomers();
    };

    window.addEventListener(
      "customerUpdated",
      handleCustomerUpdated
    );

    return () => {
      window.removeEventListener(
        "customerUpdated",
        handleCustomerUpdated
      );
    };
  }, []);

  // =====================================================
  // GET CUSTOMERS
  // =====================================================

  const loadCustomers = async () => {
    try {
      setLoading(true);

      const response = await getCustomers();

      console.log(
        "CUSTOMERS API RESPONSE:",
        response
      );

      const customerList = Array.isArray(
        response?.customers
      )
        ? response.customers
        : Array.isArray(response)
        ? response
        : [];

      // DEBUG CUSTOMER SHIFTS
      console.log("ALL CUSTOMER SHIFTS:");

      customerList.forEach((customer) => {
        console.log(
          "Account:",
          customer.accountNumber,
          "| Name:",
          customer.fullName,
          "| Shift:",
          customer.shift
        );
      });

      setCustomers(customerList);
    } catch (error) {
      console.error(
        "GET CUSTOMERS ERROR:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Unable to load customers"
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // SEARCH
  // =====================================================

  const filteredCustomers = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return customers;
    }

    return customers.filter((customer) => {
      const accountNumber =
        customer.accountNumber
          ?.toString()
          .toLowerCase() || "";

      const fullName =
        customer.fullName
          ?.toLowerCase() || "";

      const mobile =
        customer.mobile
          ?.toString()
          .toLowerCase() || "";

      return (
        accountNumber.includes(query) ||
        fullName.includes(query) ||
        mobile.includes(query)
      );
    });
  }, [customers, search]);

  // =====================================================
  // MORNING CUSTOMERS
  // =====================================================

  const morningCustomers = useMemo(() => {
    return filteredCustomers.filter((customer) => {
      const shifts = Array.isArray(customer.shift)
        ? customer.shift
        : customer.shift
        ? [customer.shift]
        : ["Morning"];

      return shifts.includes("Morning");
    });
  }, [filteredCustomers]);

  // =====================================================
  // EVENING CUSTOMERS
  // =====================================================

  const eveningCustomers = useMemo(() => {
    return filteredCustomers.filter((customer) => {
      const shifts = Array.isArray(customer.shift)
        ? customer.shift
        : customer.shift
        ? [customer.shift]
        : [];

      return shifts.includes("Evening");
    });
  }, [filteredCustomers]);

  // =====================================================
  // EDIT CUSTOMER
  // =====================================================

  const handleEdit = (customer) => {
    setSelectedCustomer(customer);
    setShowEditModal(true);
  };

  // =====================================================
  // CLOSE EDIT
  // =====================================================

  const closeEditModal = () => {
    setShowEditModal(false);
    setSelectedCustomer(null);
  };

  // =====================================================
  // DELETE CUSTOMER
  // =====================================================

  const handleDelete = async (customer) => {
    if (!customer?._id) {
      toast.error("Customer ID not found");
      return;
    }

    try {
      setDeletingId(customer._id);

      const response = await deleteCustomer(
        customer._id
      );

      toast.success(
        response?.message ||
          "Customer deleted successfully"
      );

      // Reload customers
      await loadCustomers();

      // Notify other pages
      window.dispatchEvent(
        new Event("customerUpdated")
      );
    } catch (error) {
      console.error(
        "DELETE CUSTOMER ERROR:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Unable to delete customer"
      );
    } finally {
      setDeletingId(null);

      // Close confirmation modal
      setCustomerToDelete(null);
    }
  };

  // =====================================================
  // CUSTOMER TABLE
  // =====================================================

  const renderCustomerTable = (
    customerList,
    shiftName
  ) => {
    return (
      <div className="customer-table-wrapper">
        <table className="customer-table">
          <thead>
            <tr>
              <th>Sr. No.</th>
              <th>Account No.</th>
              <th>Customer Name</th>
              <th>Balance</th>
              <th>Shift</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {customerList.length === 0 ? (
              <tr>
                <td
                  colSpan="7"
                  className="empty-row"
                >
                  No {shiftName} Customers Found
                </td>
              </tr>
            ) : (
              customerList.map(
                (customer, index) => (
                  <tr
                    key={customer._id}
                  >
                    <td>
                      {index + 1}
                    </td>

                    <td>
                      {customer.accountNumber}
                    </td>

                    <td className="customer-name">
                      {customer.fullName}
                    </td>


                    <td>
                      ₹{" "}
                      {Number(
                        customer.balance || 0
                      ).toLocaleString(
                        "en-IN"
                      )}
                    </td>

                    <td>
                      <span
                        className={
                          shiftName === "Morning"
                            ? "shift-badge morning-badge"
                            : "shift-badge evening-badge"
                        }
                      >
                        {shiftName}
                      </span>
                    </td>

                    <td>
                      <div className="customer-actions">
                        {/* EDIT */}
                        <button
                          type="button"
                          className="edit-btn"
                          onClick={() =>
                            handleEdit(
                              customer
                            )
                          }
                        >
                          Edit
                        </button>

                        {/* DELETE */}
                        <button
                          type="button"
                          className="delete-btn"
                          onClick={() =>
                            setCustomerToDelete(
                              customer
                            )
                          }
                          disabled={
                            deletingId ===
                            customer._id
                          }
                        >
                          {deletingId ===
                          customer._id
                            ? "Deleting..."
                            : "Delete"}
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              )
            )}
          </tbody>
        </table>
      </div>
    );
  };

  // =====================================================
  // JSX
  // =====================================================

  return (
    <Layout>
      <div className="customers-page">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="page-header">
          <div>
            <h1>Customers</h1>

            <p>
              Manage Morning and Evening
              customers
            </p>
          </div>

          <button
            type="button"
            className="add-btn"
            onClick={() =>
              setShowAddModal(true)
            }
          >
            + Add Customer
          </button>
        </div>

        {/* =================================================
            SEARCH
        ================================================= */}

        <div className="customer-search">
          <input
            type="text"
            placeholder="Search by Account Number, Name or Mobile..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />
        </div>

        {/* =================================================
            LOADING
        ================================================= */}

        {loading ? (
          <div className="loading-box">
            <h2>
              Loading Customers...
            </h2>
          </div>
        ) : (
          <>
            {/* =============================================
                MORNING
            ============================================== */}

            <section className="shift-section">
              <div className="shift-section-header morning-header">
                <div>
                  <h2>
                    🌅 Morning Customers
                  </h2>

                  <p>
                    Customers assigned to
                    Morning shift
                  </p>
                </div>

                <span className="customer-count">
                  {morningCustomers.length}
                </span>
              </div>

              {renderCustomerTable(
                morningCustomers,
                "Morning"
              )}
            </section>

            {/* =============================================
                EVENING
            ============================================== */}

            <section className="shift-section">
              <div className="shift-section-header evening-header">
                <div>
                  <h2>
                    🌇 Evening Customers
                  </h2>

                  <p>
                    Customers assigned to
                    Evening shift
                  </p>
                </div>

                <span className="customer-count">
                  {eveningCustomers.length}
                </span>
              </div>

              {renderCustomerTable(
                eveningCustomers,
                "Evening"
              )}
            </section>
          </>
        )}

        {/* =================================================
            ADD CUSTOMER
        ================================================= */}

        {showAddModal && (
          <AddCustomer
            closeModal={() =>
              setShowAddModal(false)
            }
            refreshCustomers={
              loadCustomers
            }
          />
        )}

        {/* =================================================
            EDIT CUSTOMER
        ================================================= */}

        {showEditModal &&
          selectedCustomer && (
            <EditCustomer
              customer={
                selectedCustomer
              }
              closeModal={
                closeEditModal
              }
              refreshCustomers={
                loadCustomers
              }
            />
          )}

        {/* =================================================
            DELETE CONFIRMATION MODAL
        ================================================= */}

        {customerToDelete && (
          <div className="delete-modal-overlay">
            <div className="delete-modal">

              {/* ICON */}
              <div className="delete-modal-icon">
                ⚠
              </div>

              {/* TITLE */}
              <h2>
                Delete Customer?
              </h2>

              {/* MESSAGE */}
              <p>
                Are you sure you want to
                delete{" "}
                <strong>
                  {
                    customerToDelete.fullName
                  }
                </strong>
                ?
              </p>

              <p className="delete-warning">
                This action cannot be
                undone.
              </p>

              {/* BUTTONS */}
              <div className="delete-modal-actions">

                {/* CANCEL */}
                <button
                  type="button"
                  className="cancel-delete-btn"
                  onClick={() =>
                    setCustomerToDelete(
                      null
                    )
                  }
                  disabled={
                    deletingId !== null
                  }
                >
                  Cancel
                </button>

                {/* CONFIRM DELETE */}
                <button
                  type="button"
                  className="confirm-delete-btn"
                  onClick={() =>
                    handleDelete(
                      customerToDelete
                    )
                  }
                  disabled={
                    deletingId ===
                    customerToDelete._id
                  }
                >
                  {deletingId ===
                  customerToDelete._id
                    ? "Deleting..."
                    : "Delete Customer"}
                </button>

              </div>
            </div>
          </div>
        )}

      </div>
    </Layout>
  );
};

export default Customers;