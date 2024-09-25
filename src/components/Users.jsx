import { useEffect, useState } from "react";
import UserCard from "./UserCard";

const Users = () => {
  const [users, setUsers] = useState([]);
  const token = localStorage.getItem("auth-token") || "";

  const getallusers = async () => {
    const data = await fetch("http://localhost:5000/api/v1/auth/getallusers", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "auth-header": token,
      },
    });
    const users = await data.json();
    setUsers(users);
  };
  useEffect(() => {
    getallusers();
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        margin: "10px 10px",
        padding: "10px 10px",
      }}
    >
      <h3>Users</h3>
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          flexWrap: "wrap",
        }}
      >
        {users.map((user) => {
          return <UserCard key={user._id} user={user}  />;
        })}
      </div>
    </div>
  );
};

export default Users;
