import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

import { bulkCollection } from "../../api/collectionApi";
import {
  getCustomers,
  addCustomer,
  deleteCustomer,
} from "../../api/customerApi";

import "./AddCollection.css";

const STORAGE_KEY = "dailyCollectionSheet";

const AddCollection = ({ closeModal, refreshCollections }) => {

  const [morningRows, setMorningRows] = useState([]);
  const [eveningRows, setEveningRows] = useState([]);

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(false);
  const [morningTotal, setMorningTotal] = useState(0);
  const [eveningTotal, setEveningTotal] = useState(0);

  const [showAddCustomer, setShowAddCustomer] = useState(false);

const [customerData, setCustomerData] = useState({
  accountNumber: "",
  fullName: "",
  balance: "",
  shift: ["Morning"],
});

const [customerLoading, setCustomerLoading] = useState(false);
const handleChange = (e) => {

  setCustomerData({
    ...customerData,
    [e.target.name]: e.target.value,
  });

};



const handleShiftChange = (shift) => {

  let updatedShift = [...customerData.shift];


  if(updatedShift.includes(shift)){

    updatedShift = updatedShift.filter(
      (s)=>s !== shift
    );

  }else{

    updatedShift.push(shift);

  }


  if(updatedShift.length === 0){

    return toast.error(
      "Select at least one shift."
    );

  }


  setCustomerData({
    ...customerData,
    shift: updatedShift,
  });

};



const handleAddCustomer = async(e)=>{

e.preventDefault();


if(
 !customerData.accountNumber ||
 !customerData.fullName
){

 return toast.error(
 "Please fill all required fields"
 );

}


try{

setCustomerLoading(true);


await addCustomer({

accountNumber:
customerData.accountNumber.trim(),

fullName:
customerData.fullName.trim(),

balance:
Number(customerData.balance) || 0,

shift:
customerData.shift,

});


await loadCustomers();


window.dispatchEvent(
new Event("customerUpdated")
);


toast.success(
"Customer Added Successfully"
);



setCustomerData({

accountNumber:"",
fullName:"",
balance:"",
shift:["Morning"],

});


setShowAddCustomer(false);



}catch(error){

toast.error(

error.response?.data?.message ||
"Failed to Add Customer"

);


}
finally{

setCustomerLoading(false);

}

};

const handleDeleteCustomer = async(id)=>{

  try{

    await deleteCustomer(id);

    toast.success("Customer Deleted");

    loadCustomers();

  }
  catch(err){

    toast.error("Unable to delete customer");

  }

};
  /* ===========================
        LOAD CUSTOMERS
  ============================ */

  useEffect(() => {

    loadCustomers();

    const refreshCustomerList = () => {
      loadCustomers();
    };

    window.addEventListener(
      "customerUpdated",
      refreshCustomerList
    );

    return () => {
      window.removeEventListener(
        "customerUpdated",
        refreshCustomerList
      );
    };

  }, []);

  /* ===========================
        TOTALS
  ============================ */

  useEffect(() => {

    const morning = morningRows.reduce(
      (sum, row) => sum + Number(row.amount || 0),
      0
    );

    const evening = eveningRows.reduce(
      (sum, row) => sum + Number(row.amount || 0),
      0
    );

    setMorningTotal(morning);
    setEveningTotal(evening);

  }, [morningRows, eveningRows]);

  const grandTotal = morningTotal + eveningTotal;

  /* ===========================
        LOAD CUSTOMERS
  ============================ */

  const loadCustomers = async () => {

    try {

      const res = await getCustomers();

      const list = Array.isArray(res.customers)
        ? res.customers
        : Array.isArray(res)
        ? res
        : [];

      const today = new Date().toDateString();

      const saved = JSON.parse(
        localStorage.getItem(STORAGE_KEY)
      );

      const oldMorning =
        saved && saved.date === today
          ? saved.morningRows || []
          : [];

      const oldEvening =
        saved && saved.date === today
          ? saved.eveningRows || []
          : [];


const morningList = list.filter(
(customer)=>
customer.shift?.includes("Morning")
);
const morning = morningList.map((customer,index)=>{

        const existing = oldMorning.find(
          (r) => r.customerId === customer._id
        );

        return {

          customerId: customer._id,

          fullName: customer.fullName,

          srNo: index + 1,

          amount: existing
            ? existing.amount
            : "",

        };

      });

      const eveningList = list.filter(
(customer)=>
customer.shift?.includes("Evening")
);
const evening = eveningList.map((customer,index)=>{

        const existing = oldEvening.find(
          (r) => r.customerId === customer._id
        );

        return {

          customerId: customer._id,

          fullName: customer.fullName,

          srNo: index + 1,

          amount: existing
            ? existing.amount
            : "",

        };

      });

      setMorningRows(morning);
      setEveningRows(evening);

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({

          date: today,

          morningRows: morning,

          eveningRows: evening,

        })
      );

    } catch (err) {

      console.log(err);

      toast.error("Unable to load customers");

    }

  };
    /* ==========================================
            SEARCH FILTER
  ========================================== */

  const filteredMorning = useMemo(() => {

    if (!search.trim()) return morningRows;

    return morningRows.filter((row) =>
      row.fullName
        .toLowerCase()
        .includes(search.toLowerCase())
    );

  }, [morningRows, search]);

  const filteredEvening = useMemo(() => {

    if (!search.trim()) return eveningRows;

    return eveningRows.filter((row) =>
      row.fullName
        .toLowerCase()
        .includes(search.toLowerCase())
    );

  }, [eveningRows, search]);



  /* ==========================================
            MORNING AMOUNT CHANGE
  ========================================== */

  const morningAmountChange = (customerId, value) => {

    const updated = morningRows.map((row) =>

      row.customerId === customerId

        ? {
            ...row,
            amount: value,
          }

        : row

    );

    setMorningRows(updated);

    localStorage.setItem(

      STORAGE_KEY,

      JSON.stringify({

        date: new Date().toDateString(),

        morningRows: updated,

        eveningRows,

      })

    );

  };



  /* ==========================================
            EVENING AMOUNT CHANGE
  ========================================== */

  const eveningAmountChange = (customerId, value) => {

    const updated = eveningRows.map((row) =>

      row.customerId === customerId

        ? {
            ...row,
            amount: value,
          }

        : row

    );

    setEveningRows(updated);

    localStorage.setItem(

      STORAGE_KEY,

      JSON.stringify({

        date: new Date().toDateString(),

        morningRows,

        eveningRows: updated,

      })

    );

  };



  /* ==========================================
            SAVE ALL COLLECTIONS
  ========================================== */

  const saveAllCollections = async () => {

    try {

      setLoading(true);

      const collections = [];



      // Morning Collections

      morningRows.forEach((row) => {

        if (Number(row.amount) > 0) {

          collections.push({

            customerId: row.customerId,

            amount: Number(row.amount),

          });

        }

      });



      // Evening Collections

      eveningRows.forEach((row) => {

        if (Number(row.amount) > 0) {

          collections.push({

            customerId: row.customerId,

            amount: Number(row.amount),

          });

        }

      });



      if (collections.length === 0) {

        toast.error("Please enter at least one amount.");

        return;

      }



      const res = await bulkCollection({

        collections,

      });



      toast.success(res.message);



      localStorage.removeItem(STORAGE_KEY);



      await refreshCollections?.();



      window.dispatchEvent(

        new Event("collectionUpdated")

      );



      closeModal();

    }

    catch (err) {

      console.log(err);

      toast.error(

        err.response?.data?.message ||

        "Unable to save collections."

      );

    }

    finally {

      setLoading(false);

    }

  };
  return (
  <div className="modal-overlay">

    <div className="collection-modal">

      {/* ================= HEADER ================= */}

      <div className="collection-topbar">

  <div className="collection-header">

    <h2>
      Daily Collection Sheet
    </h2>

  </div>


 


</div>
      {/* ================= SEARCH ================= */}

      <div className="collection-search">

        <input
          type="text"
          placeholder="Search Customer..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

      </div>

        {
showAddCustomer && (

<div className="customer-popup">


<div className="modal-header">

<h2>
Add Customer
</h2>


<button
type="button"
onClick={()=>setShowAddCustomer(false)}
>
✕
</button>


</div>



<form onSubmit={handleAddCustomer}>


<div className="form-group">

<label>
Account Number *
</label>


<input

type="text"

name="accountNumber"

placeholder="Enter Account Number"

value={customerData.accountNumber}

onChange={handleChange}

required

/>

</div>



<div className="form-group">

<label>
Full Name *
</label>


<input

type="text"

name="fullName"

placeholder="Enter Customer Name"

value={customerData.fullName}

onChange={handleChange}

required

/>

</div>




<div className="form-group">

<label>
Opening Balance
</label>


<input

type="number"

name="balance"

placeholder="Enter Opening Balance"

value={customerData.balance}

onChange={handleChange}

min="0"

/>

</div>





<div className="form-group">

<label>
Collection Shift *
</label>



<div className="shift-options">


<label className="shift-box">

<input

type="checkbox"

checked={
customerData.shift.includes("Morning")
}

onChange={()=>
handleShiftChange("Morning")
}

/>


Morning

</label>




<label className="shift-box">

<input

type="checkbox"

checked={
customerData.shift.includes("Evening")
}

onChange={()=>
handleShiftChange("Evening")
}

/>


Evening

</label>


</div>


</div>





<button

type="submit"

className="save-btn"

disabled={customerLoading}

>


{
customerLoading
?
"Saving..."
:
"Save Customer"
}


</button>



</form>


</div>

)
}

      <div className="collection-body">

        {/* ================= MORNING ================= */}

        <div className="collection-section">

          <h3 className="section-title">
            🌅 Morning Customers
          </h3>

          <div className="table-container">

            <table className="collection-table">

              <thead>

                <tr>

                  <th>Sr No</th>

                  <th>Account Holder Name</th>

                  <th>Deposit Amount</th>
                  <th>Action</th>

                </tr>

              </thead>

              <tbody>

                {filteredMorning.length === 0 ? (

                  <tr>

                    <td
                      colSpan="3"
                      style={{
                        textAlign: "center",
                        padding: "25px",
                      }}
                    >

                      No Customers Found

                    </td>

                  </tr>

                ) : (

                  filteredMorning.map((row) => (

                    <tr key={row.customerId}>

                      <td>{row.srNo}</td>

                      <td>{row.fullName}</td>

                      <td>

                        <input
                          type="number"
                          min="0"
                          placeholder="₹"
                          value={row.amount}
                          onChange={(e) =>
                            morningAmountChange(
                              row.customerId,
                              e.target.value
                            )
                          }
                        />

                      </td>
                            <td>

                            <button
                            className="delete-btn"
                            onClick={()=>handleDeleteCustomer(row.customerId)}
                            >
                            Delete
                            </button>

                            </td>
                    </tr>

                  ))

                )}

              </tbody>

            </table>

          </div>

          <div className="section-total">

            <h3>

              Morning Total :
              <span> ₹ {morningTotal}</span>

            </h3>

          </div>

        </div>
                {/* ================= EVENING ================= */}

        <div className="collection-section">

          <h3 className="section-title">
            🌇 Evening Customers
          </h3>

          <div className="table-container">

            <table className="collection-table">

              <thead>

                <tr>

                  <th>Sr No</th>

                  <th>Account Holder Name</th>

                  <th>Deposit Amount</th>
                  <th>Action</th>

                </tr>

              </thead>

              <tbody>

                {filteredEvening.length === 0 ? (

                  <tr>

                    <td
                      colSpan="3"
                      style={{
                        textAlign: "center",
                        padding: "25px",
                      }}
                    >
                      No Customers Found
                    </td>

                  </tr>

                ) : (

                  filteredEvening.map((row) => (

                    <tr key={row.customerId}>

                      <td>{row.srNo}</td>

                      <td>{row.fullName}</td>

                      <td>

                        <input
                          type="number"
                          min="0"
                          placeholder="₹"
                          value={row.amount}
                          onChange={(e) =>
                            eveningAmountChange(
                              row.customerId,
                              e.target.value
                            )
                          }
                        />

                      </td>
                            <td>

                          <button
                          className="delete-btn"
                          onClick={()=>handleDeleteCustomer(row.customerId)}
                          >
                          Delete
                          </button>

                          </td>
                    </tr>

                  ))

                )}

              </tbody>

            </table>

          </div>

          <div className="section-total">

            <h3>

              Evening Total :
              <span> ₹ {eveningTotal}</span>

            </h3>

          </div>

        </div>

      </div>

      {/* ================= FOOTER ================= */}

      <div className="collection-footer">

        <div className="collection-total">

          <h2>

            Grand Total :
            <span> ₹ {grandTotal}</span>

          </h2>

        </div>
                  
        <div className="collection-buttons">

          <button
            type="button"
            className="save-btn"
            onClick={saveAllCollections}
            disabled={loading}
          >

            {loading
              ? "Saving..."
              : "Save All Collections"}

          </button>

          <button
            type="button"
            className="cancel-btn"
            onClick={closeModal}
            disabled={loading}
          >

            Cancel

          </button>

        </div>

      </div>

    </div>

  </div>

);

};

export default AddCollection;