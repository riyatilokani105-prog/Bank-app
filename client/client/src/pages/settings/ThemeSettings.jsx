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

        <label>

          <input
            type="radio"
            checked={theme === "light"}
            onChange={() => setTheme("light")}
          />

          Light

        </label>

        <label>

          <input
            type="radio"
            checked={theme === "dark"}
            onChange={() => setTheme("dark")}
          />

          Dark

        </label>

        <label>

          <input
            type="radio"
            checked={theme === "blue"}
            onChange={() => setTheme("blue")}
          />

          Blue

        </label>

      </div>

      <button
        className="save-btn"
        onClick={saveTheme}
      >
        Save Theme
      </button>

    </div>

  );

};

export default ThemeSettings;