import { useEffect, useState } from "react";
import UserCard from "./UserCard";
import { useNavigate } from "react-router-dom";
import showAlert from "../Functions/Alert";

const Users = () => {
  const navigate = useNavigate();
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
    if(data.status === 200){
      setUsers(users);
    }
    else if (users.error && (users.error === "Enter the token" || users.error === "Please authenticate using a valid token")) {
      navigate("/login");
    }
    else{
      showAlert({
        title: users.error ? users.error : users ? users : "Internal server error",
        icon: "error",
      });
  }
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
