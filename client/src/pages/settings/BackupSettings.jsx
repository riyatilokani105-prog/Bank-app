import { useState } from "react";
import toast from "react-hot-toast";

import {
  checkBackup,
  createBackup,
  deleteBackupData,
} from "../../api/backupApi";

const BackupSettings = () => {

  const [loading, setLoading] = useState(false);

  const check = async () => {

    try {

      const res = await checkBackup();

      if (res.needBackup) {

        toast.success(
          `${res.totalRecords} records available for backup`
        );

      } else {

        toast("No backup required");

      }

    } catch (err) {

      toast.error("Unable to Check Backup");

    }

  };

  const backup = async () => {

    try {

      setLoading(true);

      const res = await createBackup();

      toast.success(res.message);

    } catch (err) {

      toast.error(

        err.response?.data?.message ||

        "Backup Failed"

      );

    } finally {

      setLoading(false);

    }

  };

  const remove = async () => {

    if (!window.confirm("Delete previous month data?"))
      return;

    try {

      const res = await deleteBackupData();

      toast.success(res.message);

    } catch (err) {

      toast.error(

        err.response?.data?.message ||

        "Delete Failed"

      );

    }

  };

  return (

    <div className="settings-card">

      <h2>Backup Management</h2>

      <div className="backup-actions">

        <button
          className="settings-btn"
          onClick={check}
        >
          Check Previous Month
        </button>

        <button
          className="settings-btn"
          onClick={backup}
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Backup"}
        </button>

        <button
          className="danger-btn"
          onClick={remove}
        >
          Delete Previous Month Data
        </button>

      </div>

    </div>

  );

};

export default BackupSettings;