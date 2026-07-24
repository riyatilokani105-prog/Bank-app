import { useState } from "react";
import toast from "react-hot-toast";

import { updateTheme } from "../../api/settingsApi";

const ThemeSettings = () => {

  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "light"
  );

  const saveTheme = async () => {

    try {

      await updateTheme({ theme });

      localStorage.setItem("theme", theme);

      document.body.setAttribute("data-theme", theme);

      toast.success("Theme Updated");

    } catch (err) {

      toast.error(
        err.response?.data?.message ||
        "Unable to Update Theme"
      );

    }

  };

  return (

    <div className="settings-card">

      <h2>Appearance</h2>

      <div className="theme-options">

        <label className="theme-option">

          <input
            type="radio"
            checked={theme === "light"}
            onChange={() => setTheme("light")}
          />

          <span>Light</span>

        </label>

        <label className="theme-option">

          <input
            type="radio"
            checked={theme === "dark"}
            onChange={() => setTheme("dark")}
          />

          <span>Dark</span>

        </label>

        <label className="theme-option">

          <input
            type="radio"
            checked={theme === "blue"}
            onChange={() => setTheme("blue")}
          />

          <span>Blue</span>

        </label>

      </div>

      <button
        className="settings-btn"
        onClick={saveTheme}
      >
        Save Theme
      </button>

    </div>

  );

};

export default ThemeSettings;