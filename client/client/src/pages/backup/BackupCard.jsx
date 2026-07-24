import "./BackupCard.css";

const BackupCard=({

status,

loading,

onCreate,

onDelete

})=>{

return(

<div className="backup-card">

<h2>Previous Month Backup</h2>

{loading?

<p>Loading...</p>

:

<>

<p>

Need Backup :

<strong>

{status.needBackup?" Yes":" No"}

</strong>

</p>

<p>

Month :

<strong>

{status.month}

</strong>

</p>

<p>

Year :

<strong>

{status.year}

</strong>

</p>

<p>

Records :

<strong>

{status.totalRecords}

</strong>

</p>

<div className="backup-buttons">

<button
className="backup-btn"
onClick={onCreate}
>

Create Backup

</button>

<button
className="delete-btn"
onClick={onDelete}
>

Delete Month Data

</button>

</div>

</>

}

</div>

)

}

export default BackupCard;