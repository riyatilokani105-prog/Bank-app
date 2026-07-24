import {
  FaEye,
  FaTrash,
} from "react-icons/fa";

import "./LedgerTable.css";

const LedgerTable = ({
  ledger,
  onView,
  onDelete,
}) => {
  return (

<div className="table-wrapper">

<table>

<thead>

<tr>

<th>Date</th>

<th>Customer</th>

<th>Account No.</th>

<th>Collection</th>

<th>Balance</th>

<th>Remark</th>

</tr>

</thead>

<tbody>

{ledger.length===0?(

<tr>

<td
colSpan="6"
className="no-data"
>

No Ledger Records Found

</td>

</tr>

):(

ledger.map((item)=>(

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

<td>

{item.remark||"-"}

</td>

</tr>

))

)}

</tbody>

</table>

</div>

);
};

export default LedgerTable;