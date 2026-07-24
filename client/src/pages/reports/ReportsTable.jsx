import "./ReportsTable.css";

const ReportsTable = ({ reports }) => {
  return (

<div className="table-wrapper">

<table>

<thead>

<tr>

<th>Date</th>

<th>Customer</th>

<th>Account</th>

<th>Collection</th>

<th>Balance</th>

</tr>

</thead>

<tbody>

{reports.length===0?(

<tr>

<td
colSpan="5"
className="no-data"
>

No Report Found

</td>

</tr>

):(

reports.map((item)=>(

<tr key={item._id}>

<td>

{new Date(item.createdAt).toLocaleDateString()}

</td>

<td>

{item.customer?.fullName}

</td>

<td>

{item.customer?.accountNumber}

</td>

<td>

₹ {Number(item.amount).toLocaleString()}

</td>

<td>

₹ {Number(item.balance).toLocaleString()}

</td>

</tr>

))

)}

</tbody>

</table>

</div>

);
};

export default ReportsTable;