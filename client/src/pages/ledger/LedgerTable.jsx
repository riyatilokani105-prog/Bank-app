import {
  FaTrash,
} from "react-icons/fa";

import "./LedgerTable.css";

const LedgerTable = ({
  ledger,
  onView,
  onDelete,
}) => {

  // =====================================================
  // ONLY ACTUAL COLLECTION RECORDS
  // =====================================================

  const collectionRecords = Array.isArray(ledger)
    ? ledger.filter(
        (item) => !item.isCustomerOnly
      )
    : [];


  // =====================================================
  // GROUP COLLECTIONS BY DATE
  // =====================================================

  const groupedByDate = collectionRecords.reduce(
    (groups, item) => {

      const date = item.createdAt
        ? new Date(item.createdAt)
            .toLocaleDateString("en-IN")
        : "Unknown Date";

      if (!groups[date]) {
        groups[date] = [];
      }

      groups[date].push(item);

      return groups;

    },
    {}
  );


  // =====================================================
  // SORT DATES - LATEST FIRST
  // =====================================================

  const sortedDates = Object.keys(
    groupedByDate
  ).sort((dateA, dateB) => {

    if (
      dateA === "Unknown Date" ||
      dateB === "Unknown Date"
    ) {
      return 0;
    }

    const [dayA, monthA, yearA] =
      dateA.split("/").map(Number);

    const [dayB, monthB, yearB] =
      dateB.split("/").map(Number);

    const dateObjA = new Date(
      yearA,
      monthA - 1,
      dayA
    );

    const dateObjB = new Date(
      yearB,
      monthB - 1,
      dayB
    );

    return dateObjB - dateObjA;
  });


  // =====================================================
  // SORT ACCOUNT NUMBERS LOWEST → HIGHEST
  // =====================================================

  sortedDates.forEach((date) => {

    groupedByDate[date].sort(
      (a, b) => {

        const accountA =
          Number(a.accountNumber);

        const accountB =
          Number(b.accountNumber);

        return accountA - accountB;
      }
    );

  });


  // =====================================================
  // EMPTY STATE
  // =====================================================

  if (collectionRecords.length === 0) {

    return (
      <div className="table-wrapper">

        <div className="ledger-empty">

          <h3>
            No Collections Found
          </h3>

          <p>
            There are no collection records
            available in the ledger.
          </p>

        </div>

      </div>
    );
  }


  // =====================================================
  // TABLE
  // =====================================================

  return (

    <div className="table-wrapper">

      {sortedDates.map((date) => {

        const dateCollections =
          groupedByDate[date];


        // =================================================
        // TOTAL COLLECTION FOR THIS DATE
        // =================================================

        const dailyTotal =
          dateCollections.reduce(
            (total, item) =>
              total +
              Number(item.amount || 0),
            0
          );


        return (

          <div
            className="ledger-date-section"
            key={date}
          >

            {/* ==========================================
                DATE HEADER
            ========================================== */}

            <div className="ledger-date-header">

              <div className="ledger-date-info">

                <h3>
                  {date}
                </h3>

                <span>
                  {dateCollections.length}{" "}
                  Collection
                  {dateCollections.length !== 1
                    ? "s"
                    : ""}
                </span>

              </div>


              <div className="ledger-date-total">

                <small>
                  Daily Collection
                </small>

                <strong>
                  ₹{" "}
                  {dailyTotal.toLocaleString(
                    "en-IN"
                  )}
                </strong>

              </div>

            </div>


            {/* ==========================================
                DATE TABLE
            ========================================== */}

            <div className="ledger-table-scroll">

              <table>

                <thead>

                  <tr>

                    <th>
                      Account
                    </th>

                    <th>
                      Customer
                    </th>

                    <th>
                      Previous
                    </th>

                    <th>
                      Amount
                    </th>

                    <th>
                      Balance
                    </th>

                    <th>
                      Action
                    </th>

                  </tr>

                </thead>


                <tbody>

                  {dateCollections.map(
                    (item, index) => (

                      <tr
                        key={
                          item._id ||
                          `ledger-${date}-${index}`
                        }
                      >

                        {/* ACCOUNT */}

                        <td className="account-number">

                          {item.accountNumber ||
                            "-"}

                        </td>


                        {/* CUSTOMER */}

                        <td className="customer-name">

                          {item.customerName ||
                            "-"}

                        </td>


                        {/* PREVIOUS BALANCE */}

                        <td>

                          ₹{" "}

                          {Number(
                            item.previousBalance ||
                              0
                          ).toLocaleString(
                            "en-IN"
                          )}

                        </td>


                        {/* COLLECTION AMOUNT */}

                        <td className="collection-amount">

                          ₹{" "}

                          {Number(
                            item.amount || 0
                          ).toLocaleString(
                            "en-IN"
                          )}

                        </td>


                        {/* CURRENT BALANCE */}

                        <td className="current-balance">

                          ₹{" "}

                          {Number(
                            item.currentBalance ||
                              0
                          ).toLocaleString(
                            "en-IN"
                          )}

                        </td>


                        {/* ACTION */}

                        <td className="action-buttons">

                          <button
                            type="button"
                            className="delete-btn"
                            title="Delete Collection"
                            onClick={() => {

                              if (onDelete) {
                                onDelete(item);
                              }

                            }}
                          >

                            <FaTrash />

                          </button>

                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            </div>

          </div>

        );

      })}

    </div>
  );
};


export default LedgerTable;