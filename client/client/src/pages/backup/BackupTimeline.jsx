import "./BackupTimeline.css";

const BackupTimeline = ({ history }) => {

  return (

    <div className="timeline-card">

      <h2>Backup Timeline</h2>

      <div className="timeline">

        {history.length === 0 ? (

          <p>No Backup History</p>

        ) : (

          history.map((backup) => (

            <div
              className="timeline-item"
              key={backup._id}
            >

              <div className="circle"></div>

              <div className="content">

                <h4>

                  {backup.month}/{backup.year}

                </h4>

                <p>

                  {backup.totalTransactions} Transactions

                </p>

                <small>

                  ₹ {backup.totalCollection}

                </small>

              </div>

            </div>

          ))

        )}

      </div>

    </div>

  );

};

export default BackupTimeline;