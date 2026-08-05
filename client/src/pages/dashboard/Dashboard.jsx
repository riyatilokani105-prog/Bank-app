import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Layout from "../../components/layout/Layout";

import {
  FaUsers,
  FaUserCheck,
  FaMoneyBillWave,
  FaChartLine,
  FaWallet,
  FaUserPlus,
  FaFileInvoiceDollar,
  FaChartBar,
  FaDatabase,
} from "react-icons/fa";

import {
  getDashboard,
  getStats,
} from "../../api/dashboardApi";

import "./Dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();

  const [dashboard, setDashboard] = useState({});
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {

  loadDashboard();

  const refreshDashboard = () => {
    loadDashboard();
  };

  window.addEventListener(
    "customerUpdated",
    refreshDashboard
  );

  window.addEventListener(
    "collectionUpdated",
    refreshDashboard
  );

  return () => {
    window.removeEventListener(
      "customerUpdated",
      refreshDashboard
    );

    window.removeEventListener(
      "collectionUpdated",
      refreshDashboard
    );
  };

}, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);

      const [dashboardRes, statsRes] = await Promise.all([
        getDashboard(),
        getStats(),
      ]);

      console.log("Dashboard =>", dashboardRes);
      console.log("Stats =>", statsRes);

      setDashboard(
        dashboardRes.dashboard ||
          dashboardRes.summary ||
          dashboardRes.data ||
          dashboardRes ||
          {}
      );

      setStats(
        statsRes.stats ||
          statsRes.data ||
          statsRes ||
          {}
      );
    } catch (err) {
      console.error(err);

      setDashboard({});
      setStats({});
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="dashboard">
          <h2>Loading Dashboard...</h2>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="dashboard">

        {/* Header */}

        <div className="dashboard-header">

          <div>

            <h1>Dashboard</h1>

           
          </div>

          <div className="dashboard-date">
            {new Date().toLocaleDateString("en-IN", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </div>

        </div>

        {/* Statistics */}

        <div className="stats-grid">

          <div className="stat-card blue">
            <div className="stat-icon">
              <FaUsers />
            </div>

            <div>
              <h4>Total Customers</h4>
              <h2>
                {dashboard.totalCustomers ??
                  stats.totalCustomers ??
                  0}
              </h2>
            </div>
          </div>

          <div className="stat-card green">
            <div className="stat-icon">
              <FaUserCheck />
            </div>

            <div>
              <h4>Today's Customers</h4>
              <h2>
                {dashboard.todayCustomers ??
                  stats.todayCustomers ??
                  0}
              </h2>
            </div>
          </div>

          <div className="stat-card purple">
            <div className="stat-icon">
              <FaMoneyBillWave />
            </div>

            <div>
              <h4>Today's Collection</h4>
              <h2>
                ₹{" "}
                {dashboard.todayCollection ??
                  stats.todayCollection ??
                  0}
              </h2>
            </div>
          </div>

          <div className="stat-card orange">
            <div className="stat-icon">
              <FaChartLine />
            </div>

            <div>
              <h4>Monthly Collection</h4>
              <h2>
                ₹{" "}
                {dashboard.monthCollection ??
                  stats.monthCollection ??
                  0}
              </h2>
            </div>
          </div>

          <div className="stat-card red">
            <div className="stat-icon">
              <FaWallet />
            </div>

            <div>
              <h4>Pending Balance</h4>
              <h2>
                ₹{" "}
                {dashboard.pendingBalance ??
                  stats.pendingBalance ??
                  0}
              </h2>
            </div>
          </div>

        </div>

        {/* Quick Actions */}

        <div className="quick-actions">

          <h2>Quick Actions</h2>

          <div className="action-grid">

            <div
              className="action-card"
              onClick={() => navigate("/customers")}
            >
              <FaUserPlus />
              <span>Add Customer</span>
            </div>

            <div
              className="action-card"
              onClick={() => navigate("/collections")}
            >
              <FaMoneyBillWave />
              <span>Add Collection</span>
            </div>

            <div
              className="action-card"
              onClick={() => navigate("/customer-statement")}
            >
              <FaFileInvoiceDollar />
              <span>Customer Statement</span>
            </div>

            <div
              className="action-card"
              onClick={() => navigate("/reports")}
            >
              <FaChartBar />
              <span>Reports</span>
            </div>

            <div
              className="action-card"
              onClick={() => navigate("/backup")}
            >
              <FaDatabase />
              <span>Backup</span>
            </div>

          </div>

        </div>

      </div>
    </Layout>
  );
};

export default Dashboard;