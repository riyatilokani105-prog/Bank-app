import { useState } from "react";
import toast from "react-hot-toast";

import { updateSystemSettings } from "../../api/settingsApi";

const SystemSettings = () => {

  const [settings, setSettings] = useState({

    notifications: true,
    autoLogout: false,
    receiptPrint: true,
    backupReminder: true,

  });

  const toggle = (name) => {

    setSettings({

      ...settings,

      [name]: !settings[name],

    });

  };

  const saveSettings = async () => {

    try {

      await updateSystemSettings(settings);

      toast.success("System Settings Saved");

    } catch (err) {

      toast.error(

        err.response?.data?.message ||

        "Unable to Save"

      );

    }

  };

  return (

    <div className="settings-card">

      <h2>System Settings</h2>

      <div className="settings-options">

        <label className="settings-option">

          <span>Notifications</span>

          <input
            type="checkbox"
            checked={settings.notifications}
            onChange={() => toggle("notifications")}
          />

        </label>

        <label className="settings-option">

          <span>Auto Logout</span>

          <input
            type="checkbox"
            checked={settings.autoLogout}
            onChange={() => toggle("autoLogout")}
          />

        </label>

        <label className="settings-option">

          <span>Receipt Printing</span>

          <input
            type="checkbox"
            checked={settings.receiptPrint}
            onChange={() => toggle("receiptPrint")}
          />

        </label>

        <label className="settings-option">

          <span>Backup Reminder</span>

          <input
            type="checkbox"
            checked={settings.backupReminder}
            onChange={() => toggle("backupReminder")}
          />

        </label>

      </div>

      <button
        className="settings-btn"
        onClick={saveSettings}
      >
        Save Settings
      </button>

    </div>

  );

};

export default SystemSettings;