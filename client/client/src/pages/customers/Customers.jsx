import { useEffect, useState } from "react";
import Layout from "../../components/layout/Layout";
import { getCustomers } from "../../api/customerApi";

import AddCustomer from "./AddCustomer";
import CustomerSearch from "./CustomerSearch";
import CustomerTable from "./CustomerTable";
import EditCustomer from "./EditCustomer";
import DeleteCustomer from "./DeleteCustomer";

import "./Customers.css";

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);

  const [editModal, setEditModal] = useState(false);

  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const [search, setSearch] = useState("");

  const [deleteModal,setDeleteModal]=useState(false);

  const deleteCustomerHandler=(customer)=>{

setSelectedCustomer(customer);

setDeleteModal(true);

};

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      setLoading(true);

      const res = await getCustomers();

      if (Array.isArray(res)) {
        setCustomers(res);
      } else if (Array.isArray(res.customers)) {
        setCustomers(res.customers);
      } else if (Array.isArray(res.data)) {
        setCustomers(res.data);
      } else {
        setCustomers([]);
      }
    } catch (error) {
      console.log(error);
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  };

  const editCustomer = (customer) => {
    setSelectedCustomer(customer);
    setEditModal(true);
  };

  const filteredCustomers = customers.filter((item) => {
    const query = search.toLowerCase();

    return (
      item.fullName?.toLowerCase().includes(query) ||
      item.accountNumber?.toString().includes(search) ||
      item.mobile?.includes(search)
    );
  });

  return (
    <Layout>
      <div className="customers">

        <div className="customer-header">
          <h1>Customer Management</h1>

          <button
            className="add-btn"
            onClick={() => setShowModal(true)}
          >
            + Add Customer
          </button>
        </div>

        {loading ? (
          <div className="loading-box">
            <h2>Loading Customers...</h2>
          </div>
        ) : (
          <>
            <CustomerSearch
              value={search}
              onChange={setSearch}
            />

            <CustomerTable

                customers={filteredCustomers}

                onView={(customer)=>console.log(customer)}

                onEdit={editCustomer}

                onDelete={deleteCustomerHandler}

                  />
          </>
        )}

        {showModal && (
          <AddCustomer
            closeModal={() => setShowModal(false)}
            refreshCustomers={loadCustomers}
          />
        )}

        {editModal && selectedCustomer && (
          <EditCustomer
            customer={selectedCustomer}
            closeModal={() => {
              setEditModal(false);
              setSelectedCustomer(null);
            }}
            refreshCustomers={loadCustomers}
          />
        )}


                {deleteModal && selectedCustomer && (

        <DeleteCustomer

        customer={selectedCustomer}

        closeModal={()=>{
        setDeleteModal(false);
        setSelectedCustomer(null);
        }}

        refreshCustomers={loadCustomers}

        />

        )}

      </div>
    </Layout>
  );
};

export default Customers;