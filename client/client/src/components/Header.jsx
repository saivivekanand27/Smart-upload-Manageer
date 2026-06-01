import { logout } from "../utils/auth";
import { getUser } from "../utils/user";
import { useNavigate } from "react-router-dom";

function Header() {
  const navigate = useNavigate();

  const user = getUser();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="header">
      <div>
        <h1>
          Welcome, {user?.name}
        </h1>

        <p>{user?.email}</p>
      </div>

      <button
        className="logout-btn"
        onClick={handleLogout}
      >
        Logout
      </button>
    </div>
  );
}

export default Header;