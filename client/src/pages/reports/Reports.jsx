import { useEffect, useState } from "react";
import Layout from "../../components/layout/Layout";

import {
  getReport,
  getReportSummary,
} from "../../api/reportApi";

import ReportsFilter from "./ReportsFilter";
import ReportsTable from "./ReportsTable";
import ReportCards from "./ReportCards";
import ExportButtons from "./ExportButtons";

import "./Reports.css";

const Reports = () => {

  const [reports, setReports] = useState([]);
  const [summary, setSummary] = useState({});
  const [loading, setLoading] = useState(true);

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  useEffect(() => {
    loadData();
  }, [fromDate, toDate]);

  const loadData = async () => {

    try {

      setLoading(true);

      // Reports
      const reportRes = await getReport();

      let data = reportRes.reports || [];

      // Frontend Date Filter
      if (fromDate && toDate) {

        const from = new Date(fromDate);
        const to = new Date(toDate);

        to.setHours(23,59,59,999);

        data = data.filter((item)=>{

          const date = new Date(item.createdAt);

          return date >= from && date <= to;

        });

      }

      setReports(data);

      // Summary
      const summaryRes = await getReportSummary();

      setSummary(summaryRes.summary || {});

    } catch (err) {

      console.log(err);

    } finally {

      setLoading(false);

    }

  };

  return (

    <Layout>

      <div className="reports-page">

        <div className="page-header">

          <div>

            <h1>Reports</h1>

            <p>Daily Collection Reports</p>

          </div>

        </div>

        <ReportCards summary={summary} />

        <ExportButtons />

        <ReportsFilter
          fromDate={fromDate}
          toDate={toDate}
          setFromDate={setFromDate}
          setToDate={setToDate}
        />

        {loading ? (

          <div className="loading-box">
            Loading Reports...
          </div>

        ) : (

          <ReportsTable reports={reports} />

        )}

      </div>

    </Layout>

  );

};

export default Reports;