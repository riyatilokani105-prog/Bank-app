const Customer = require("../models/Customer");
const Collection = require("../models/Collection");

exports.getDashboard = async (req, res) => {
  try {

    const today = new Date();

    const startToday = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );

    const endToday = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + 1
    );

    const startMonth = new Date(
      today.getFullYear(),
      today.getMonth(),
      1
    );

    // Today's Collection

    const todayCollection = await Collection.aggregate([
      {
        $match: {
          date: {
            $gte: startToday,
            $lt: endToday
          }
        }
      },
      {
        $group: {
          _id: null,
          total: {
            $sum: "$amount"
          },
          transactions: {
            $sum: 1
          }
        }
      }
    ]);

    // Monthly Collection

    const monthCollection = await Collection.aggregate([
      {
        $match: {
          date: {
            $gte: startMonth
          }
        }
      },
      {
        $group: {
          _id: null,
          total: {
            $sum: "$amount"
          }
        }
      }
    ]);

    // Grand Balance

    const balance = await Customer.aggregate([
      {
        $group: {
          _id: null,
          total: {
            $sum: "$balance"
          }
        }
      }
    ]);

    // Customer Count

    const customers = await Customer.countDocuments();

    res.json({

      success: true,

      dashboard: {

        todayCollection:
          todayCollection[0]?.total || 0,

        todayTransactions:
          todayCollection[0]?.transactions || 0,

        monthCollection:
          monthCollection[0]?.total || 0,

        grandBalance:
          balance[0]?.total || 0,

        totalCustomers: customers

      }

    });

  } catch (err) {

    res.status(500).json({

      success: false,
      message: err.message

    });

  }
};

exports.recentCollections = async (req, res) => {

    try{

        const collections = await Collection
        .find()
        .sort({createdAt:-1})
        .limit(10);

        res.json({

            success:true,

            collections

        });

    }catch(err){

        res.status(500).json({

            success:false,

            message:err.message

        });

    }

};

exports.topCustomers = async (req,res)=>{

try{

const customers = await Customer
.find()
.sort({balance:-1})
.limit(10);

res.json({

success:true,

customers

});

}catch(err){

res.status(500).json({

success:false,

message:err.message

});

}

};