import "./AdminProfile.css";
import Layout from "../../components/layout/Layout";
import {
  getAdminProfile,
} from "../../api/adminApi";

import {
  FaUserShield,
  FaUniversity,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaUserTie,
  FaIdBadge,
  FaBuilding,
  FaCalendarAlt,
  FaCircle,
} from "react-icons/fa";
import { useEffect, useState } from "react";

const AdminProfile = () => {
    const [admin, setAdmin] = useState({});
    

    useEffect(() => {

    loadAdmin();

}, []);

const loadAdmin = async () => {

    try{

        const res = await getAdminProfile();

        setAdmin(res.admin);

    }

    catch(err){

        console.log(err);

    }

};
  return (
    <Layout>
      <div className="admin-profile-page">

        {/* ================= HEADER ================= */}

        <div className="admin-header">

          <div className="admin-header-left">

            <div className="admin-avatar">

              <FaUserShield />

            </div>

            <div>

              <h1>Administrator Profile</h1>

              <p>
                Rajura Nagri Sahakari Path Sanstha Maryadit
              </p>

            </div>

          </div>

          <div className="admin-status">

            <FaCircle className="online-dot" />

            Online

          </div>

        </div>

        {/* ================= PROFILE CARD ================= */}

        <div className="profile-card">

          <div className="profile-left">

            <div className="profile-image">

              <FaUserShield />

            </div>

            <h4>{admin.name || "Administrator"}</h4>

            <span>System Administrator</span>

            <p>

              Full Access Permission

            </p>

          </div>

          <div className="profile-right">

            <div className="info-grid">

              <div className="info-card">

                <FaUserTie />

                <div>

                  <label>Full Name</label>

                  <h4>Administrator</h4>

                </div>

              </div>

              <div className="info-card">

                <FaEnvelope />

                <div>

                  <label>Email</label>

                  <h4>{admin.email || "-"}</h4>

                </div>

              </div>

              <div className="info-card">

                <FaPhone />

                <div>

                  <label>Mobile</label>

                 <h4>{admin.mobile || "-"}</h4>

                </div>

              </div>

              <div className="info-card">

                <FaMapMarkerAlt />

                <div>

                  <label>Address</label>

                 <h4>{admin.branch || "-"}</h4>

                </div>

              </div>

              <div className="info-card">

                <FaUniversity />

                <div>

                  <label>Branch</label>

                  <h4>Ballarpur Branch</h4>

                </div>

              </div>

              <div className="info-card">

                <FaBuilding />

                <div>

                  <label>Organization</label>

                  <h4>
                    Rajura Nagri Sahakari Path Sanstha
                  </h4>

                </div>

              </div>

              <div className="info-card">

                <FaIdBadge />

                <div>

                  <label>Employee ID</label>

                  <h4>ADM001</h4>

                </div>

              </div>

              <div className="info-card">

                <FaCalendarAlt />

                <div>

                  <label>Joining Date</label>

                  <h4>12 January 2026</h4>

                </div>

              </div>

            </div>

          </div>

        </div>



{/* ================= SYSTEM SUMMARY ================= */}

<div className="system-summary">

  <div className="summary-card">

    <h3>Bank Information</h3>

    <table>

      <tbody>

        <tr>

          <td>Bank Name</td>

          <td>Rajura Nagri Sahakari Path Sanstha Maryadit</td>

        </tr>

        <tr>

          <td>Branch</td>

          <td>Ballarpur</td>

        </tr>

        <tr>

          <td>System Version</td>

          <td>v2.0</td>

        </tr>

        <tr>

          <td>Database</td>

          <td>MongoDB Atlas</td>

        </tr>

        <tr>

          <td>Backend</td>

          <td>Node.js + Express</td>

        </tr>

        <tr>

          <td>Frontend</td>

          <td>React + Vite</td>

        </tr>

      </tbody>

    </table>

  </div>

  <div className="summary-card">

    <h3>Administrator Permissions</h3>

    <ul>

      <li>✔ Customer Management</li>

      <li>✔ Collection Management</li>

      <li>✔ Reports Access</li>

      <li>✔ Ledger Management</li>

      <li>✔ Database Backup</li>

      <li>✔ Audit Logs</li>

      <li>✔ User Management</li>

      <li>✔ Full System Control</li>

    </ul>

  </div>

</div>

{/* ==========================================================
                    ACCOUNT INFORMATION
========================================================== */}

<div className="profile-sections">

  {/* LEFT */}

  <div className="profile-section-card">

    <div className="card-header">

      <h2>Account Information</h2>

    </div>

    <div className="details-list">

      <div className="detail-row">
        <span>Role</span>
        <strong>System Administrator</strong>
      </div>

      <div className="detail-row">
        <span>Employee ID</span>
        <strong>ADM-001</strong>
      </div>

      <div className="detail-row">
        <span>Department</span>
        <strong>Administration</strong>
      </div>

      <div className="detail-row">
        <span>Branch</span>
        <strong>Ballarpur Branch</strong>
      </div>

      <div className="detail-row">
        <span>Working Since</span>
        <strong>5 August 2026</strong>
      </div>

      <div className="detail-row">
        <span>Status</span>

        <span className="active-status">

          ● Active

        </span>

      </div>

    </div>

  </div>



  {/* RIGHT */}

  <div className="profile-section-card">

    <div className="card-header">

      <h2>Security</h2>

    </div>

    <div className="security-grid">

      <div className="security-item">

        <h4>Password</h4>

        <p>Last changed 12 days ago</p>

      </div>

      <div className="security-item">

        <h4>Two Factor Authentication</h4>

        <p>Enabled</p>

      </div>

      <div className="security-item">

        <h4>Last Login</h4>

        <p>Today • 09:18 AM</p>

      </div>

      <div className="security-item">

        <h4>Current Device</h4>

        <p>Windows • Chrome</p>

      </div>

      <div className="security-item">

        <h4>IP Address</h4>

        <p>192.168.xxx.xxx</p>

      </div>

      <div className="security-item">

        <h4>Session Status</h4>

        <p className="online-text">

          Online

        </p>

      </div>

    </div>

  </div>

</div>


{/* ==========================================================
                    RECENT ACTIVITY
========================================================== */}

<div className="profile-section-card">

    <div className="card-header">

        <h2>Recent Activity</h2>

    </div>

    <div className="activity-list">

        <div className="activity-item">

            <div className="activity-dot"></div>

            <div>

                <h4>Logged into the system</h4>

                <p>Today • 09:18 AM</p>

            </div>

        </div>

        <div className="activity-item">

            <div className="activity-dot"></div>

            <div>

                <h4>Database Backup Created</h4>

                <p>Yesterday • 07:35 PM</p>

            </div>

        </div>

        <div className="activity-item">

            <div className="activity-dot"></div>

            <div>

                <h4>Monthly Report Downloaded</h4>

                <p>Yesterday • 04:20 PM</p>

            </div>

        </div>

        <div className="activity-item">

            <div className="activity-dot"></div>

            <div>

                <h4>Customer Added</h4>

                <p>Yesterday • 11:45 AM</p>

            </div>

        </div>

        <div className="activity-item">

            <div className="activity-dot"></div>

            <div>

                <h4>Password Updated</h4>

                <p>12 Days Ago</p>

            </div>

        </div>

    </div>

</div>


      </div>
    </Layout>
  );
};

export default AdminProfile;