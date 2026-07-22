require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const customerRoutes = require("./routes/customerRoutes");
const collectionRoutes = require("./routes/collectionRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const backupRoutes = require("./routes/backupRoutes");
const ledgerRoutes = require("./routes/ledgerRoutes");
const reportRoutes = require("./routes/reportRoutes");
const statRoutes = require("./routes/statRoutes");
const excelRoutes = require("./routes/excelRoutes");
const auditRoutes = require("./routes/auditRoutes");
const receiptRoutes = require("./routes/receiptRoutes");
const settingsRoutes = require("./routes/settingsRoutes");




const app = express();

connectDB();

app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Daily Collection Bank API Running",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/collections", collectionRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/backup", backupRoutes);
app.use("/api/ledger", ledgerRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/stats", statRoutes);
app.use("/api/excel", excelRoutes);
app.use("/api/audit", auditRoutes);
app.use("/api/receipt", receiptRoutes);
app.use("/api/settings", settingsRoutes);



const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});