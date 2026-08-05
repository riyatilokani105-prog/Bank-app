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
  FaUniversity,
  FaCalendarAlt,
  FaArrowRight,
  FaShieldAlt,
  FaBuilding,
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

      const [dashboardRes, statsRes] =
        await Promise.all([
          getDashboard(),
          getStats(),
        ]);

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

      console.log(err);

      setDashboard({});

      setStats({});

    } finally {

      setLoading(false);

    }

  };

  if (loading) {

    return (

      <Layout>

        <div className="dashboard-loading">

          <div className="loader-card">

            <FaUniversity className="loader-icon" />

            <h2>

              Rajura Nagri Sahakari Path Sanstha Maryadit

            </h2>

            <p>

              Ballarpur Branch

            </p>

            <div className="loader-spinner"></div>

            <span>

              Loading Dashboard...

            </span>

          </div>

        </div>

      </Layout>

    );

  }

  return (

    <Layout>

      <div className="dashboard">

              {/* ===========================================================
                          BANK HEADER
      =========================================================== */}

      <div className="dashboard-hero">

        <div className="hero-left">

          <div className="bank-logo">

            <FaUniversity />

          </div>

          <div className="bank-info">

            <span className="bank-tag">

              CO-OPERATIVE BANK MANAGEMENT SYSTEM

            </span>

            <h1>

              Rajura Nagri Sahakari Path Sanstha Maryadit

            </h1>

            <h2>

              Ballarpur Branch

            </h2>

            <h3>

              राजुरा नागरी सहकारी पतसंस्था मर्यादित

            </h3>

            <h4>

              बल्लारपूर शाखा

            </h4>

            <p>

              Daily Collection & Customer Management System

            </p>

          </div>

        </div>

        <div className="hero-right">

          <div className="date-card">

            <FaCalendarAlt className="date-icon"/>

            <div>

              <span>

                Today's Date

              </span>

              <h4>

                {new Date().toLocaleDateString("en-IN", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}

              </h4>

            </div>

          </div>

        </div>

      </div>

      {/* ===========================================================
                          WELCOME CARD
      =========================================================== */}

      <div className="welcome-card">

        <div className="welcome-left">

          <span className="welcome-badge">

            Welcome Admin

          </span>

          <h2>

            Banking Dashboard

          </h2>

          <p>

            Manage customers, collections, reports,
            customer statements and monthly backups
            securely from one place.

          </p>

        </div>

        <button

          className="welcome-btn"

          onClick={() => navigate("/collections")}

        >

          <FaMoneyBillWave />

          Add Today's Collection

          <FaArrowRight />

        </button>

      </div>

      {/* ===========================================================
                          SUMMARY BAR
      =========================================================== */}

      <div className="summary-grid">

        <div className="summary-card">

          <FaBuilding className="summary-icon"/>

          <div>

            <small>

              Institution

            </small>

            <h3>

              Rajura Nagri Sahakari

            </h3>

          </div>

        </div>

        <div className="summary-card">

          <FaUniversity className="summary-icon"/>

          <div>

            <small>

              Branch

            </small>

            <h3>

              Ballarpur

            </h3>

          </div>

        </div>

        <div className="summary-card">

          <FaShieldAlt className="summary-icon"/>

          <div>

            <small>

              System

            </small>

            <h3>

              Daily Collection

            </h3>

          </div>

        </div>

        <div className="summary-card">

          <div className="status-dot"></div>

          <div>

            <small>

              Server Status

            </small>

            <h3 className="online">

              Online

            </h3>

          </div>

        </div>

      </div>

      {/* ===========================================================
                          DASHBOARD OVERVIEW
      =========================================================== */}

      <div className="dashboard-overview">

        <div className="overview-card">

          <h3>

            Daily Collection Management

          </h3>

          <p>

            This dashboard provides complete control over
            customer records, daily collections, ledger,
            reports, customer statements and secure backup
            management for the bank.

          </p>

        </div>

      </div>

              {/* ===========================================================
                          STATISTICS
        =========================================================== */}

        <div className="stats-grid">

          <div className="stat-card blue">

            <div className="stat-top">

              <div className="stat-icon">

                <FaUsers />

              </div>

              <div className="stat-badge">

                LIVE

              </div>

            </div>

            <div className="stat-content">

              <span>Total Customers</span>

              <h2>

                {dashboard.totalCustomers ??
                  stats.totalCustomers ??
                  0}

              </h2>

              <small>

                Registered customer accounts

              </small>

            </div>

          </div>

          <div className="stat-card green">

            <div className="stat-top">

              <div className="stat-icon">

                <FaUserCheck />

              </div>

              <div className="stat-badge success">

                TODAY

              </div>

            </div>

            <div className="stat-content">

              <span>Today's Customers</span>

              <h2>

                {dashboard.todayCustomers ??
                  stats.todayCustomers ??
                  0}

              </h2>

              <small>

                Customers visited today

              </small>

            </div>

          </div>

          <div className="stat-card purple">

            <div className="stat-top">

              <div className="stat-icon">

                <FaMoneyBillWave />

              </div>

              <div className="stat-badge income">

                CASH

              </div>

            </div>

            <div className="stat-content">

              <span>Today's Collection</span>

              <h2>

                ₹{" "}

                {dashboard.todayCollection ??
                  stats.todayCollection ??
                  0}

              </h2>

              <small>

                Total amount collected today

              </small>

            </div>

          </div>

          <div className="stat-card orange">

            <div className="stat-top">

              <div className="stat-icon">

                <FaChartLine />

              </div>

              <div className="stat-badge month">

                MONTH

              </div>

            </div>

            <div className="stat-content">

              <span>Monthly Collection</span>

              <h2>

                ₹{" "}

                {dashboard.monthCollection ??
                  stats.monthCollection ??
                  0}

              </h2>

              <small>

                Current month's collection

              </small>

            </div>

          </div>

          <div className="stat-card red">

            <div className="stat-top">

              <div className="stat-icon">

                <FaWallet />

              </div>

              <div className="stat-badge pending">

                DUE

              </div>

            </div>

            <div className="stat-content">

              <span>Pending Balance</span>

              <h2>

                ₹{" "}

                {dashboard.pendingBalance ??
                  stats.pendingBalance ??
                  0}

              </h2>

              <small>

                Outstanding customer balance

              </small>

            </div>

          </div>

        </div>

                {/* ===========================================================
                          QUICK ACTIONS
        =========================================================== */}

        <div className="quick-actions-section">

          <div className="section-title">

            <div>

              <h2>Quick Actions</h2>

              <p>
                Frequently used banking operations
              </p>

            </div>

          </div>

          <div className="action-grid">

            <div
              className="action-card"
              onClick={() => navigate("/customers")}
            >

              <div className="action-icon blue">

                <FaUserPlus />

              </div>

              <div className="action-content">

                <h3>Add Customer</h3>

                <p>
                  Register a new customer account.
                </p>

              </div>

              <FaArrowRight className="action-arrow"/>

            </div>

            <div
              className="action-card"
              onClick={() => navigate("/collections")}
            >

              <div className="action-icon green">

                <FaMoneyBillWave />

              </div>

              <div className="action-content">

                <h3>Add Collection</h3>

                <p>
                  Record today's customer collections.
                </p>

              </div>

              <FaArrowRight className="action-arrow"/>

            </div>

            <div
              className="action-card"
              onClick={() => navigate("/customer-statement")}
            >

              <div className="action-icon purple">

                <FaFileInvoiceDollar />

              </div>

              <div className="action-content">

                <h3>Customer Statement</h3>

                <p>
                  View and print customer statements.
                </p>

              </div>

              <FaArrowRight className="action-arrow"/>

            </div>

            <div
              className="action-card"
              onClick={() => navigate("/reports")}
            >

              <div className="action-icon orange">

                <FaChartBar />

              </div>

              <div className="action-content">

                <h3>Reports</h3>

                <p>
                  Daily, monthly and yearly reports.
                </p>

              </div>

              <FaArrowRight className="action-arrow"/>

            </div>

            <div
              className="action-card"
              onClick={() => navigate("/backup")}
            >

              <div className="action-icon red">

                <FaDatabase />

              </div>

              <div className="action-content">

                <h3>Database Backup</h3>

                <p>
                  Secure backup and restore customer data.
                </p>

              </div>

              <FaArrowRight className="action-arrow"/>

            </div>

          </div>

        </div>

      </div>

    </Layout>

  );

};

export default Dashboard;
