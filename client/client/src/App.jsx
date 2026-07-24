import { Routes, Route } from "react-router-dom";

import Login from "./pages/auth/Login";
import Dashboard from "./pages/dashboard/Dashboard";
import Customers from "./pages/customers/Customers";
import Collections from "./pages/collections/Collections";
import Ledger from "./pages/ledger/Ledger";
import Reports from "./pages/reports/Reports";
import Backup from "./pages/backup/Backup";
import AuditLogs from "./pages/audit/AuditLogs";
import Settings from "./pages/settings/Settings";



import PrivateRoute from "./routes/PrivateRoute";

function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Login />} />

      {/* Protected */}
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />

      <Route
        path="/customers"
        element={
          <PrivateRoute>
            <Customers />
          </PrivateRoute>
        }
      />

      <Route
        path="/collections"
        element={
          <PrivateRoute>
            <Collections />
          </PrivateRoute>
        }
      />

      <Route
        path="/ledger"
        element={
          <PrivateRoute>
            <Ledger />
          </PrivateRoute>
        }
      />

      <Route
        path="/reports"
        element={
          <PrivateRoute>
            <Reports />
          </PrivateRoute>
        }
      />

      <Route
        path="/backup"
        element={
          <PrivateRoute>
            <Backup />
          </PrivateRoute>
        }
      />

     <Route path="/audit" element={<AuditLogs />} />

      <Route
        path="/settings"
        element={
          <PrivateRoute>
            <Settings />
          </PrivateRoute>
        }
      />
    
  
    </Routes>
  );
}

export default App;