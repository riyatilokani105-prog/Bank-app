import { useEffect, useState } from "react";
import Layout from "../../components/layout/Layout";
import BackupStats from "./BackupStats";
import BackupTimeline from "./BackupTimeline";
import {
  checkBackup,
  createBackup,
  deleteBackupData,
  getBackupHistory,
} from "../../api/backupApi";

import BackupCard from "./BackupCard";
import BackupHistory from "./BackupHistory";

import toast from "react-hot-toast";

import "./Backup.css";

const Backup = () => {

  const [status,setStatus]=useState({});
  const [history,setHistory]=useState([]);
  const [loading,setLoading]=useState(true);

  useEffect(()=>{
      loadData();
  },[]);

  const loadData=async()=>{

      try{

          setLoading(true);

          const check=await checkBackup();
          const backups=await getBackupHistory();

          setStatus(check);
          setHistory(backups.backups||[]);

      }catch(err){

          console.log(err);

      }finally{

          setLoading(false);

      }

  }

  const createBackupHandler=async()=>{

      try{

          const res=await createBackup();

          toast.success(res.message);

          loadData();

      }catch(err){

          toast.error(err.response?.data?.message||"Unable to create backup");

      }

  }

  const deleteHandler=async()=>{

      if(!window.confirm("Delete previous month data?"))
      return;

      try{

          const res=await deleteMonthData();

          toast.success(res.message);

          loadData();

      }catch(err){

          toast.error(err.response?.data?.message);

      }

  }

  return(

      <Layout>

          <div className="backup-page">

              <h1>Backup Management</h1>
              <BackupStats history={history}/>
              <BackupCard

                  status={status}

                  loading={loading}

                  onCreate={createBackupHandler}

                  onDelete={deleteHandler}

              />

              <BackupHistory history={history}/>
              <BackupTimeline history={history}/>

          </div>

      </Layout>

  );

}

export default Backup;