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

      <div className="switch-row">

        <span>Notifications</span>

        <input
          type="checkbox"
          checked={settings.notifications}
          onChange={() => toggle("notifications")}
        />

      </div>

      <div className="switch-row">

        <span>Auto Logout</span>

        <input
          type="checkbox"
          checked={settings.autoLogout}
          onChange={() => toggle("autoLogout")}
        />

      </div>

      <div className="switch-row">

        <span>Receipt Printing</span>

        <input
          type="checkbox"
          checked={settings.receiptPrint}
          onChange={() => toggle("receiptPrint")}
        />

      </div>

      <div className="switch-row">

        <span>Backup Reminder</span>

        <input
          type="checkbox"
          checked={settings.backupReminder}
          onChange={() => toggle("backupReminder")}
        />

      </div>

      <button
        className="save-btn"
        onClick={saveSettings}
      >
        Save Settings
      </button>

    </div>

  );

};

export default SystemSettings;