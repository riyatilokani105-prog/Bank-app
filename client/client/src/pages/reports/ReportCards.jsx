import {
  FaUsers,
  FaMoneyBillWave,
  FaCalendarDay,
  FaChartLine,
} from "react-icons/fa";

import "./ReportCards.css";

const ReportCards = ({ summary = {} }) => {
  return (
    <div className="report-cards">

      <div className="report-card">
        <div className="report-icon blue">
          <FaCalendarDay />
        </div>

        <div className="report-info">
          <h4>Today's Collection</h4>
          <h2>₹ {Number(summary.todayCollection || 0).toLocaleString()}</h2>
        </div>
      </div>

      <div className="report-card">
        <div className="report-icon green">
          <FaChartLine />
        </div>

        <div className="report-info">
          <h4>Total Collections</h4>
          <h2>{summary.totalCollections || 0}</h2>
        </div>
      </div>

      <div className="report-card">
        <div className="report-icon orange">
          <FaUsers />
        </div>

        <div className="report-info">
          <h4>Total Customers</h4>
          <h2>{summary.totalCustomers || 0}</h2>
        </div>
      </div>

      <div className="report-card">
        <div className="report-icon purple">
          <FaMoneyBillWave />
        </div>

        <div className="report-info">
          <h4>Total Amount</h4>
          <h2>₹ {Number(summary.totalAmount || 0).toLocaleString()}</h2>
        </div>
      </div>

    </div>
  );
};

export default ReportCards;