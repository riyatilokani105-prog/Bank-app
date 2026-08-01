import { useEffect, useState } from "react";
import Layout from "../../components/layout/Layout";
import { FaUserCheck } from "react-icons/fa";

import {
  getDashboard,
  getStats,
} from "../../api/dashboardApi";

import "./Dashboard.css";

const Dashboard = () => {

  const [dashboard, setDashboard] = useState({});
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    loadDashboard();

  }, []);

 const loadDashboard = async () => {

  try {

    setLoading(true);

    const [
      dashboardRes,
      statsRes,
    ] = await Promise.all([
      getDashboard(),
      getStats(),
    ]);

    console.log("Dashboard =>", dashboardRes);
    console.log("Stats =>", statsRes);

    // Dashboard Data
    setDashboard(
      dashboardRes.dashboard ||
      dashboardRes.data ||
      dashboardRes ||
      {}
    );

    // Statistics
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

      <div className="page-title">
        <h1>Dashboard</h1>
        <p>Welcome Back Administrator</p>
      </div>

      <div className="stats-grid">

        <div className="stat-card">
          <h4>Total Customers</h4>
          <h2>{stats.totalCustomers ?? 0}</h2>
        </div>

        <div className="stat-card">
            <h4>Today's Customers</h4>
            <h2>{stats.todayCustomers ?? 0}</h2>
          </div>

        <div className="stat-card">
          <h4>Today's Collection</h4>
          <h2>₹ {stats.todayCollection ?? 0}</h2>
        </div>

        <div className="stat-card">
          <h4>Monthly Collection</h4>
          <h2>₹ {stats.monthCollection ?? 0}</h2>
        </div>

        <div className="stat-card">
          <h4>Pending Balance</h4>
          <h2>₹ {stats.pendingBalance ?? 0}</h2>
        </div>
         

        
      </div>

    </div>
  </Layout>
);

};

export default Dashboard;