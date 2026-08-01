import { useRef, useState } from "react";
import toast from "react-hot-toast";

import Layout from "../../components/layout/Layout";
import StatementSearch from "./StatementSearch";
import StatementHeader from "./StatementHeader";
import StatementInfo from "./StatementInfo";
import StatementSummary from "./StatementSummary";
import StatementTable from "./StatementTable";

import { getCustomerStatement } from "../../api/customerStatementApi";

import "./Statement.css";

const CustomerStatement = () => {
  const statementRef = useRef(null);

  const [search, setSearch] = useState("");

  const [customer, setCustomer] = useState(null);

  const [summary, setSummary] = useState({
    totalCollections: 0,
    totalAmount: 0,
    currentBalance: 0,
    lastCollection: null,
  });

  const [history, setHistory] = useState([]);

  const [loading, setLoading] = useState(false);

  const searchCustomer = async () => {
    if (!search.trim()) {
      return toast.error("Enter Account Number or Customer Name");
    }

    try {
      setLoading(true);

      setCustomer(null);
      setHistory([]);

      const res = await getCustomerStatement(search);

      setCustomer({
        ...res.customer,

        currentBalance:
          Number(
            res.customer?.currentBalance ??
              res.summary?.currentBalance ??
              res.customer?.openingBalance ??
              0
          ) || 0,
      });

      setSummary({
        totalCollections: Number(res.summary?.totalCollections || 0),
        totalAmount: Number(res.summary?.totalAmount || 0),
        currentBalance: Number(res.summary?.currentBalance || 0),
        lastCollection: res.summary?.lastCollection || null,
      });

      setHistory(res.history || []);
    } catch (err) {
      console.log(err);

      toast.error(
        err.response?.data?.message || "Customer not found"
      );

      setCustomer(null);

      setSummary({
        totalCollections: 0,
        totalAmount: 0,
        currentBalance: 0,
        lastCollection: null,
      });

      setHistory([]);
    } finally {
      setLoading(false);
    }
  };

  const printStatement = () => {
    window.print();
  };

  const downloadPDF = () => {
    window.open(
      `https://bank-app-6l8z.onrender.com/api/customer-statement/pdf?search=${search}`,
      "_blank"
    );
  };

  return (
    <Layout>
      <div className="statement-page">
        <h1>Customer Statement</h1>

        <StatementSearch
          value={search}
          onChange={setSearch}
          onSearch={searchCustomer}
        />

        {loading && (
          <div className="statement-loading">
            <h3>Loading Customer Statement...</h3>
          </div>
        )}

        {!loading && customer && (
          <div ref={statementRef}>
            <StatementHeader
              customer={customer}
              summary={summary}
              onPrint={printStatement}
              onPDF={downloadPDF}
            />

            <StatementInfo customer={customer} />

            <StatementSummary summary={summary} />

            <StatementTable history={history} />
          </div>
        )}
      </div>
    </Layout>
  );
};

export default CustomerStatement;