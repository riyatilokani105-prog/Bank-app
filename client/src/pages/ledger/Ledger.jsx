import { useEffect, useMemo, useState } from "react";

import Layout from "../../components/layout/Layout";

import { getLedger } from "../../api/ledgerApi";

import LedgerSearch from "./LedgerSearch";
import LedgerTable from "./LedgerTable";
import ViewLedger from "./ViewLedger";
import DeleteLedger from "./DeleteLedger";

import "./Ledger.css";

const Ledger = () => {
  const [ledger, setLedger] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedLedger, setSelectedLedger] = useState(null);

  const [viewModal, setViewModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);

  const [search, setSearch] = useState("");

  // Stores which dates are currently open
  const [openDates, setOpenDates] = useState({});

  // =====================================================
  // LOAD LEDGER
  // =====================================================

  useEffect(() => {
    loadLedger();

    const refreshLedgerPage = () => {
      loadLedger();
    };

    window.addEventListener(
      "customerUpdated",
      refreshLedgerPage
    );

    window.addEventListener(
      "collectionUpdated",
      refreshLedgerPage
    );

    return () => {
      window.removeEventListener(
        "customerUpdated",
        refreshLedgerPage
      );

      window.removeEventListener(
        "collectionUpdated",
        refreshLedgerPage
      );
    };
  }, []);

  // =====================================================
  // GET LEDGER
  // =====================================================

  const loadLedger = async () => {
    try {
      setLoading(true);

      const res = await getLedger();

      const data =
        res?.ledger ||
        res?.ledgers ||
        res?.data ||
        [];

      // =================================================
      // SORT ACCOUNT NUMBERS LOWEST TO HIGHEST
      // =================================================

      const sortedData = Array.isArray(data)
        ? [...data].sort((a, b) => {
            const accountA = Number(a.accountNumber);
            const accountB = Number(b.accountNumber);

            return accountA - accountB;
          })
        : [];

      setLedger(sortedData);
    } catch (err) {
      console.log("Ledger Error:", err);

      setLedger([]);
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // SEARCH
  // =====================================================

  const filteredLedger = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return ledger;
    }

    return ledger.filter((item) => {
      const customerName =
        item.customerName
          ?.toString()
          .toLowerCase() || "";

      const accountNumber =
        item.accountNumber
          ?.toString()
          .toLowerCase() || "";

      return (
        customerName.includes(query) ||
        accountNumber.includes(query)
      );
    });
  }, [ledger, search]);

  // =====================================================
  // GROUP LEDGER BY DATE
  // =====================================================

  const groupedLedger = useMemo(() => {
    const groups = {};

    filteredLedger.forEach((item) => {
      let dateKey = "Unknown Date";

      if (item.createdAt) {
        const date = new Date(item.createdAt);

        if (!isNaN(date.getTime())) {
          dateKey = date.toLocaleDateString(
            "en-CA"
          );
        }
      }

      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }

      groups[dateKey].push(item);
    });

    // Sort dates newest first
    const sortedDates = Object.keys(groups).sort(
      (a, b) => {
        if (
          a === "Unknown Date" ||
          b === "Unknown Date"
        ) {
          return 0;
        }

        return (
          new Date(b) - new Date(a)
        );
      }
    );

    return sortedDates.map((date) => ({
      date,
      items: groups[date],
    }));
  }, [filteredLedger]);

  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate = (dateString) => {
    if (
      !dateString ||
      dateString === "Unknown Date"
    ) {
      return "Unknown Date";
    }

    const date = new Date(
      `${dateString}T00:00:00`
    );

    if (isNaN(date.getTime())) {
      return dateString;
    }

    return date.toLocaleDateString(
      "en-IN",
      {
        day: "numeric",
        month: "long",
        year: "numeric",
      }
    );
  };

  // =====================================================
  // TOGGLE DATE DROPDOWN
  // =====================================================

  const toggleDate = (date) => {
    setOpenDates((prev) => ({
      ...prev,
      [date]: !prev[date],
    }));
  };

  // =====================================================
  // VIEW LEDGER
  // =====================================================

  const viewLedger = (ledgerItem) => {
    setSelectedLedger(ledgerItem);
    setViewModal(true);
  };

  // =====================================================
  // DELETE LEDGER
  // =====================================================

  const removeLedger = (ledgerItem) => {
    setSelectedLedger(ledgerItem);
    setDeleteModal(true);
  };

  // =====================================================
  // OPEN FIRST DATE AUTOMATICALLY
  // =====================================================

  useEffect(() => {
    if (
      groupedLedger.length > 0 &&
      Object.keys(openDates).length === 0
    ) {
      setOpenDates({
        [groupedLedger[0].date]: true,
      });
    }
  }, [groupedLedger, openDates]);

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <Layout>

      <div className="ledger-page">

        {/* ============================================
            PAGE HEADER
        ============================================ */}

        <div className="ledger-page-header">

          <div>
            <h1>Ledger</h1>

            <p>
              Customer Collection History
            </p>
          </div>

          <div className="ledger-total-box">
            <span>Total Records</span>

            <strong>
              {filteredLedger.length}
            </strong>
          </div>

        </div>

        {/* ============================================
            SEARCH
        ============================================ */}

        <LedgerSearch
          value={search}
          onChange={setSearch}
        />

        {/* ============================================
            LOADING
        ============================================ */}

        {loading ? (

          <div className="loading-box">

            <div className="ledger-loading-spinner"></div>

            <h2>
              Loading Ledger...
            </h2>

            <p>
              Please wait while ledger records
              are loading.
            </p>

          </div>

        ) : filteredLedger.length === 0 ? (

          /* ==========================================
             EMPTY
          ========================================== */

          <div className="ledger-empty">

            <div className="ledger-empty-icon">
              📋
            </div>

            <h2>
              No Ledger Records Found
            </h2>

            <p>
              There are no ledger records matching
              your search.
            </p>

          </div>

        ) : (

          /* ==========================================
             DATE GROUPS
          ========================================== */

          <div className="ledger-date-groups">

            {groupedLedger.map(
              (group) => {

                const isOpen =
                  !!openDates[group.date];

                return (

                  <div
                    className={`ledger-date-card ${
                      isOpen
                        ? "ledger-date-card-open"
                        : ""
                    }`}
                    key={group.date}
                  >

                    {/* =================================
                        DATE HEADER
                    ================================= */}

                    <button
                      type="button"
                      className="ledger-date-header"
                      onClick={() =>
                        toggleDate(
                          group.date
                        )
                      }
                    >

                      <div className="ledger-date-left">

                        <div className="ledger-calendar-icon">
                          📅
                        </div>

                        <div>

                          <h2>
                            {formatDate(
                              group.date
                            )}
                          </h2>

                          <p>
                            Customer Collection
                            History
                          </p>

                        </div>

                      </div>

                      <div className="ledger-date-right">

                        <span className="ledger-record-count">
                          {group.items.length}{" "}
                          {group.items.length === 1
                            ? "Collection"
                            : "Collections"}
                        </span>

                        <span
                          className={`ledger-dropdown-icon ${
                            isOpen
                              ? "rotate"
                              : ""
                          }`}
                        >
                          ▼
                        </span>

                      </div>

                    </button>

                    {/* =================================
                        DATE CONTENT
                    ================================= */}

                    {isOpen && (

                      <div className="ledger-date-content">

                        <LedgerTable
                          ledger={group.items}
                          onView={viewLedger}
                          onDelete={removeLedger}
                        />

                      </div>

                    )}

                  </div>
                );
              }
            )}

          </div>

        )}

      </div>

      {/* ==============================================
          VIEW MODAL
      ============================================== */}

      {viewModal && (

        <ViewLedger
          ledger={selectedLedger}
          closeModal={() => {
            setViewModal(false);
            setSelectedLedger(null);
          }}
        />

      )}

      {/* ==============================================
          DELETE MODAL
      ============================================== */}

      {deleteModal && (

        <DeleteLedger
          ledger={selectedLedger}
          refreshLedger={loadLedger}
          closeModal={() => {
            setDeleteModal(false);
            setSelectedLedger(null);
          }}
        />

      )}

    </Layout>
  );
};

export default Ledger;