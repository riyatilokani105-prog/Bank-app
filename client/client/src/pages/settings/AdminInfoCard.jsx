import { FaUserShield } from "react-icons/fa";

const AdminInfoCard = () => {

    const admin = JSON.parse(
        localStorage.getItem("user")
    );

    return (

        <div className="settings-card">

            <h2>Administrator</h2>

            <div className="admin-box">

                <FaUserShield
                    size={65}
                    color="#2563eb"
                />

                <h3>{admin?.name || "Administrator"}</h3>

                <p>{admin?.email}</p>

                <div className="admin-info">

                    <div>

                        <strong>Role</strong>

                        <p>Admin</p>

                    </div>

                    <div>

                        <strong>Status</strong>

                        <p>Active</p>

                    </div>

                    <div>

                        <strong>Version</strong>

                        <p>v1.0</p>

                    </div>

                </div>

            </div>

        </div>

    );

};

export default AdminInfoCard;