import { useEffect, useState } from "react";

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

  useEffect(() => {
    loadLedger();
  }, []);

  const loadLedger = async () => {

    try {

      setLoading(true);

      const res = await getLedger();

      const data =
        res.ledger ||
        res.ledgers ||
        res.data ||
        [];

      setLedger(Array.isArray(data) ? data : []);

    } catch (err) {

      console.log(err);

      setLedger([]);

    } finally {

      setLoading(false);

    }

  };

  const filteredLedger = ledger.filter((item) => {

    const query = search.toLowerCase();

    return (

      item.customerName
        ?.toLowerCase()
        .includes(query) ||

      item.accountNumber
        ?.toString()
        .includes(search)

    );

  });

  const viewLedger = (ledger) => {

    setSelectedLedger(ledger);

    setViewModal(true);

};

const removeLedger = (ledger) => {

    setSelectedLedger(ledger);

    setDeleteModal(true);

};

  return (

    <Layout>

      <div className="ledger-page">

        <div className="page-header">

          <div>

            <h1>Ledger</h1>

            <p>

              Customer Collection History

            </p>

          </div>

        </div>

        <LedgerSearch
          value={search}
          onChange={setSearch}
        />

        {loading ? (

          <div className="loading-box">

            <h2>

              Loading Ledger...

            </h2>

          </div>

        ) : (

          <LedgerTable
            ledger={filteredLedger}
            refreshLedger={loadLedger}
          />

        )}

      </div>
        {viewModal && (

<ViewLedger

    ledger={selectedLedger}

    closeModal={() => {

        setViewModal(false);

        setSelectedLedger(null);

    }}

/>

)}

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