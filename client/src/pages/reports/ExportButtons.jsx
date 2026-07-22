import {
  exportExcel,
  exportPDF,
} from "../../api/reportApi";

import toast from "react-hot-toast";

import "./ExportButtons.css";

const ExportButtons = () => {

  const downloadExcel = async () => {

    try {

      const res = await exportExcel();

      const url = window.URL.createObjectURL(
        new Blob([res.data])
      );

      const link = document.createElement("a");

      link.href = url;

      link.download = "Report.xlsx";

      link.click();

    } catch {

      toast.error("Unable to Download Excel");

    }

  };

  const downloadPDF = async () => {

    try {

      const res = await exportPDF();

      const url = window.URL.createObjectURL(
        new Blob([res.data])
      );

      const link = document.createElement("a");

      link.href = url;

      link.download = "Report.pdf";

      link.click();

    } catch {

      toast.error("Unable to Download PDF");

    }

  };

  return (

    <div className="export-buttons">

      <button
        className="excel-btn"
        onClick={downloadExcel}
      >
        Export Excel
      </button>

      <button
        className="pdf-btn"
        onClick={downloadPDF}
      >
        Export PDF
      </button>

    </div>

  );

};

export default ExportButtons;