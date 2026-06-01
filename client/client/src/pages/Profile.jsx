import { getUser } from "../utils/user";

function Profile() {
  const user = getUser();

  return (
    <div className="container">
      <h1>
        User Profile
      </h1>

      <div className="card">
        <h3>
          Name:
        </h3>

        <p>
          {user?.name}
        </p>

        <h3>
          Email:
        </h3>

        <p>
          {user?.email}
        </p>
      </div>
    </div>
  );
}

export default Profile;