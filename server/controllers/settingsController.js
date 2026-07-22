// Update Theme
exports.updateTheme = async (req, res) => {
  try {
    const { theme } = req.body;

    res.json({
      success: true,
      message: "Theme updated successfully",
      theme,
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      message: err.message,
    });

  }
};

// Update System Settings
exports.updateSystemSettings = async (req, res) => {
  try {

    res.json({
      success: true,
      message: "System settings updated successfully",
      settings: req.body,
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      message: err.message,
    });

  }
};