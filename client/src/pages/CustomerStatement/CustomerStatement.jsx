import { useState } from "react";

import Layout from "../../components/layout/Layout";

import StatementSearch from "./StatementSearch";

import { getCustomerStatement } from "../../api/customerStatementApi";

import "./Statement.css";

import StatementInfo from "./StatementInfo";

import StatementSummary from "./StatementSummary";

import StatementTable from "./StatementTable";

import StatementHeader from "./StatementHeader";

import { useRef } from "react";

const CustomerStatement = () => {

  const [search,setSearch]=useState("");

  const [customer,setCustomer]=useState(null);

  const [summary,setSummary]=useState({});

  const [history,setHistory]=useState([]);

  const statementRef = useRef(null);

  const searchCustomer = async()=>{

    if(!search.trim()) return;

    try{

      const res=await getCustomerStatement(search);

      setCustomer(res.customer);

      setSummary(res.summary);

      setHistory(res.history);

    }

    catch(err){

      console.log(err);

      setCustomer(null);

      setSummary({});

      setHistory([]);

    }

  };

  const printStatement = () => {

  window.print();

};

const downloadPDF = () => {

  alert("PDF Download will be connected with backend.");

};

  return(

    <Layout>

      <div className="statement-page">

        <h1>Customer Statement</h1>

        <StatementSearch

        value={search}

        onChange={setSearch}

        onSearch={searchCustomer}

        />
        {customer && (

<div ref={statementRef}>
  
    <StatementHeader
customer={customer}
summary={summary}
onPrint={printStatement}
onPDF={downloadPDF}
/>

<StatementInfo customer={customer}/>

    <StatementSummary summary={summary} />

    <StatementTable history={history}/>

  </div>

)}

      </div>

    </Layout>

  );

};

export default CustomerStatement;