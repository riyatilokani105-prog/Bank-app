import { FaUserShield } from "react-icons/fa";

const AdminInfoCard = () => {

    const admin = JSON.parse(
        localStorage.getItem("user")
    );

    return (

        <div className="settings-card">

            <h2>Administrator</h2>

            <div className="admin-box">

                <div className="admin-avatar">

                    <FaUserShield size={70} />

                </div>

                <h3>
                    {admin?.name || "Administrator"}
                </h3>

                <p>
                    {admin?.email || "admin@gmail.com"}
                </p>

                <div className="admin-info">

                    <div className="admin-item">

                        <strong>Role</strong>

                        <span>Admin</span>

                    </div>

                    <div className="admin-item">

                        <strong>Status</strong>

                        <span className="active-status">
                            Active
                        </span>

                    </div>

                    <div className="admin-item">

                        <strong>Version</strong>

                        <span>v1.0</span>

                    </div>

                </div>

            </div>

        </div>

    );

};

export default AdminInfoCard;