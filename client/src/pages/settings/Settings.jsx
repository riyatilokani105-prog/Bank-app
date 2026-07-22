import Layout from "../../components/layout/Layout";

import ProfileCard from "./ProfileCard";
import ChangePassword from "./ChangePassword";
import ThemeSettings from "./ThemeSettings";
import SystemSettings from "./SystemSettings";
import BackupSettings from "./BackupSettings";
import AdminInfoCard from "./AdminInfoCard";

import "./Settings.css";

const Settings = () => {
  return (
    <Layout>
      <div className="settings-page">

        <div className="settings-header">
          <h1>Settings</h1>
          <p>
            Manage your account, system preferences and security.
          </p>
        </div>

        <div className="settings-grid">

          <AdminInfoCard />
          
          <ProfileCard />

          <ChangePassword />

          <ThemeSettings />

          <SystemSettings />

          <BackupSettings />

        </div>

      </div>
    </Layout>
  );
};

export default Settings;