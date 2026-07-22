const Collection = require("../models/Collection");
const Customer = require("../models/Customer");


// Today's Report
exports.todayReport = async (req, res) => {
  try {
    const today = new Date();

    const start = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );

    const end = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + 1
    );

    const collections = await Collection.find({
      date: {
        $gte: start,
        $lt: end,
      },
    }).sort({ createdAt: -1 });

    const total = collections.reduce(
      (sum, item) => sum + item.amount,
      0
    );

    res.json({
      success: true,
      totalCollection: total,
      totalTransactions: collections.length,
      collections,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Monthly Report
exports.monthReport = async (req, res) => {
  try {
    const today = new Date();

    const month = today.getMonth() + 1;
    const year = today.getFullYear();

    const collections = await Collection.find({
      month,
      year,
    }).sort({ createdAt: -1 });

    const total = collections.reduce(
      (sum, item) => sum + item.amount,
      0
    );

    res.json({
      success: true,
      month,
      year,
      totalCollection: total,
      totalTransactions: collections.length,
      collections,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Yearly Report
exports.yearReport = async (req, res) => {
  try {
    const year = new Date().getFullYear();

    const collections = await Collection.find({
      year,
    }).sort({ createdAt: -1 });

    const total = collections.reduce(
      (sum, item) => sum + item.amount,
      0
    );

    res.json({
      success: true,
      year,
      totalCollection: total,
      totalTransactions: collections.length,
      collections,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Customer Report
exports.customerReport = async (req, res) => {
  try {
    const collections = await Collection.find({
      customer: req.params.id,
    }).sort({ createdAt: -1 });

    const total = collections.reduce(
      (sum, item) => sum + item.amount,
      0
    );

    res.json({
      success: true,
      totalCollection: total,
      totalTransactions: collections.length,
      collections,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Date Range Report
exports.dateRangeReport = async (req, res) => {
  try {
    const { from, to } = req.query;

    const collections = await Collection.find({
      date: {
        $gte: new Date(from),
        $lte: new Date(to),
      },
    }).sort({ createdAt: -1 });

    const total = collections.reduce(
      (sum, item) => sum + item.amount,
      0
    );

    res.json({
      success: true,
      totalCollection: total,
      totalTransactions: collections.length,
      collections,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.getReports = async (req, res) => {

    try {

        const reports = await Collection.find()
            .populate("customer")
            .sort({createdAt:-1});


        res.json({
            success:true,
            count:reports.length,
            reports
        });


    } catch(error){

        res.status(500).json({
            success:false,
            message:error.message
        });

    }

};



// ===============================
// REPORT SUMMARY
// ===============================
exports.getReportSummary = async (req, res) => {
  try {

    const today = new Date();

    const startOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      0, 0, 0, 0
    );

    const endOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      23, 59, 59, 999
    );

    // Today's Collections
    const todayCollections = await Collection.find({
      createdAt: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    });

    const todayCollection = todayCollections.reduce(
      (sum, item) => sum + Number(item.amount),
      0
    );

    // Total Collections
    const totalCollections = await Collection.countDocuments();

    // Total Customers
    const totalCustomers = await Customer.countDocuments();

    // Total Amount
    const amountResult = await Collection.aggregate([
      {
        $group: {
          _id: null,
          total: {
            $sum: "$amount",
          },
        },
      },
    ]);

    const totalAmount =
      amountResult.length > 0
        ? amountResult[0].total
        : 0;

    res.json({
      success: true,
      summary: {
        todayCollection,
        totalCollections,
        totalCustomers,
        totalAmount,
      },
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      message: err.message,
    });

  }
};

// ===============================
// EXPORT PDF
// ===============================
exports.exportPDF = async(req,res)=>{


    try{

        const PDFDocument=require("pdfkit");


        const collections =
            await Collection.find()
            .populate("customer");


        const doc=new PDFDocument();


        res.setHeader(
            "Content-Type",
            "application/pdf"
        );


        res.setHeader(
            "Content-Disposition",
            "attachment; filename=report.pdf"
        );


        doc.pipe(res);



        doc.fontSize(20)
        .text("Daily Collection Report");


        doc.moveDown();



        collections.forEach((item,index)=>{


            doc.fontSize(12)
            .text(
`${index+1}. 
Customer: ${item.customer?.name || "N/A"}
Amount: ₹${item.amount}
Date: ${item.createdAt.toDateString()}
`
            );


        });



        doc.end();



    }catch(error){

        res.status(500).json({
            success:false,
            message:error.message
        });

    }

};




// ===============================
// EXPORT EXCEL
// ===============================
exports.exportExcel = async(req,res)=>{


    try{


        const XLSX=require("xlsx");


        const collections =
            await Collection.find()
            .populate("customer");



        const data =
        collections.map(item=>({

            Customer:
            item.customer?.name || "",

            Amount:
            item.amount,

            Date:
            item.createdAt

        }));



        const workbook =
        XLSX.utils.book_new();



        const sheet =
        XLSX.utils.json_to_sheet(data);



        XLSX.utils.book_append_sheet(
            workbook,
            sheet,
            "Reports"
        );



        const buffer =
        XLSX.write(
            workbook,
            {
                type:"buffer",
                bookType:"xlsx"
            }
        );



        res.setHeader(
            "Content-Disposition",
            "attachment; filename=reports.xlsx"
        );


        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );


        res.send(buffer);



    }catch(error){


        res.status(500).json({
            success:false,
            message:error.message
        });


    }


};