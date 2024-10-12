import { useEffect, useState } from "react";
import UserCard from "./UserCard";
import { useNavigate } from "react-router-dom";
import showAlert from "../Functions/Alert";
import { useSelector } from "react-redux";

const Users = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const token = useSelector((state) => state.Token);
  const [pageId, setPageId] = useState(0);
  const [totalPages, setTotalPages] = useState([]);
  const pageSize = 5;

  const getallusers = async () => {
    const data = await fetch(`http://localhost:5000/api/v1/auth/getallusers/${pageId}/${pageSize}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "auth-header": token,
      }
    });
    const users = await data.json();
    if (data.status === 200) {
      setUsers(users);
    }
    else if (users.error && (users.error === "Enter the token" || users.error === "Please authenticate using a valid token")) {
      navigate("/login");
    }
    else {
      showAlert({
        title: users.error ? users.error : users ? users : "Internal server error",
        icon: "error",
      });
    }
  };

  const getAllUsersLength = async () => {
    const data = await fetch(`http://localhost:5000/api/v1/auth/getallusersLength`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "auth-header": token,
      },
    });
    const Userslength = await data.json();
    if (data.status === 200) {
      let length = Math.ceil(Userslength / pageSize);
      for (let i = 1; i <= length; i++) {
        setTotalPages((old) => [...old, i]);
      }
    }
    else if (users.error && (users.error === "Enter the token" || users.error === "Please authenticate using a valid token")) {
      navigate("/login");
    }
    else {
      showAlert({
        title: users.error ? users.error : users ? users : "Internal server error",
        icon: "error",
      });
    }
  }
  useEffect(() => {
    getAllUsersLength();
  }, []);

  useEffect(() => {
    getallusers();
  }, [pageId]);

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
          return <UserCard key={user._id} user={user} />;
        })}
      </div>
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
        <button disabled={pageId === 0} onClick={() => setPageId(pageId - 1)} style={{ margin: "10px" }}>Previous</button>
        <h4>{pageId+1} of {totalPages.length}</h4>
        <button disabled={pageId === totalPages.length-1} onClick={() => setPageId(pageId + 1)} style={{ margin: "10px" }}>Next</button>
      </div>
    </div>
  );
};

export default Users;
