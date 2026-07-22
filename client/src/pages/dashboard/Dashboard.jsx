import { useEffect, useState } from "react";
import Layout from "../../components/layout/Layout";

import {
  getDashboard,
  getStats,
  getRecentCollections,
  getTopCustomers,
} from "../../api/dashboardApi";

import "./Dashboard.css";

const Dashboard = () => {
  const [dashboard, setDashboard] = useState({});
  const [stats, setStats] = useState({});
  const [recentCollections, setRecentCollections] = useState([]);
  const [topCustomers, setTopCustomers] = useState([]);
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
        recentRes,
        topRes,
      ] = await Promise.all([
        getDashboard(),
        getStats(),
        getRecentCollections(),
        getTopCustomers(),
      ]);

      console.log("Dashboard =>", dashboardRes);
      console.log("Stats =>", statsRes);
      console.log("Recent =>", recentRes);
      console.log("Top =>", topRes);

      // Dashboard
      setDashboard(
        dashboardRes.dashboard ||
          dashboardRes.data ||
          dashboardRes ||
          {}
      );

      // Stats
      setStats(
        statsRes.stats ||
          statsRes.data ||
          statsRes ||
          {}
      );

      // Recent Collections
      setRecentCollections(
        recentRes.recentCollections ||
          recentRes.collections ||
          recentRes.data ||
          recentRes ||
          []
      );

      // Top Customers
      setTopCustomers(
        topRes.topCustomers ||
          topRes.customers ||
          topRes.data ||
          topRes ||
          []
      );
    } catch (err) {
      console.error(err);

      setDashboard({});
      setStats({});
      setRecentCollections([]);
      setTopCustomers([]);
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

        {/* Stats */}

        <div className="stats-grid">

          <div className="stat-card">
            <h4>Total Customers</h4>
            <h2>{stats.totalCustomers ?? 0}</h2>
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

        {/* Tables */}

        <div className="dashboard-row">

          {/* Recent Collections */}

          <div className="dashboard-card">

            <h3>Recent Collections</h3>

            <table>

              <thead>

                <tr>
                  <th>Customer</th>
                  <th>Amount</th>
                  <th>Date</th>
                </tr>

              </thead>

              <tbody>

                {recentCollections.length === 0 ? (

                  <tr>

                    <td colSpan="3">
                      No Collections Found
                    </td>

                  </tr>

                ) : (

                  recentCollections.map((item) => (

                    <tr key={item._id}>

                      <td>
                        {item.customer?.fullName ||
                          item.customerId?.fullName ||
                          item.customerName ||
                          "-"}
                      </td>

                      <td>
                        ₹ {item.amount}
                      </td>

                      <td>
                        {item.createdAt
                          ? new Date(
                              item.createdAt
                            ).toLocaleDateString()
                          : "-"}
                      </td>

                    </tr>

                  ))

                )}

              </tbody>

            </table>

          </div>

          {/* Top Customers */}

          <div className="dashboard-card">

            <h3>Top Customers</h3>

            <table>

              <thead>

                <tr>
                  <th>Name</th>
                  <th>Balance</th>
                </tr>

              </thead>

              <tbody>

                {topCustomers.length === 0 ? (

                  <tr>

                    <td colSpan="2">
                      No Customers Found
                    </td>

                  </tr>

                ) : (

                  topCustomers.map((item) => (

                    <tr key={item._id}>

                      <td>
                        {item.fullName ||
                          item.customerName ||
                          "-"}
                      </td>

                      <td>
                        ₹ {item.balance || item.total || 0}
                      </td>

                    </tr>

                  ))

                )}

              </tbody>

            </table>

          </div>

        </div>

      </div>
    </Layout>
  );
};

export default Dashboard;