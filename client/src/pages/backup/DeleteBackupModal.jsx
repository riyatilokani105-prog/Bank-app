import "./DeleteBackupModal.css";

const DeleteBackupModal=({

onCancel,

onDelete,

loading

})=>{

return(

<div className="delete-overlay">

<div className="delete-modal">

<h2>

Delete Previous Month Data

</h2>

<p>

This action cannot be undone.

</p>

<div className="delete-actions">

<button

className="cancel-btn"

onClick={onCancel}

>

Cancel

</button>

<button

className="delete-btn"

onClick={onDelete}

disabled={loading}

>

{loading?"Deleting...":"Delete"}

</button>

</div>

</div>

</div>

)

}

export default DeleteBackupModal;