import { useEffect, useState } from "react";

const QuesCard = (props) => {
  const { ques } = props;
  const { user, question, alreadyKnew, rewardPrice, tags, views, date } = ques;
  const [name, setName] = useState("Anonymous");

  const getAskedTime = (date) => {
    const currentDate = new Date();
    const askDate = new Date(date);
    console.log(askDate);
    let diffTime = currentDate - askDate;

    const yrs = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 365));
    if (yrs > 0) {
      return `${yrs} years ago`;
    }
    diffTime -= yrs * (1000 * 60 * 60 * 24 * 365);
    const months = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 30));
    if (months > 0) {
      return `${months} months ago`;
    }
    diffTime -= months * (1000 * 60 * 60 * 24 * 30);

    const days = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    if (days > 0) {
      return `${days} days ago`;
    }
    diffTime -= days * (1000 * 60 * 60 * 24);
    const hours = Math.floor(diffTime / (1000 * 60 * 60));
    if (hours > 0) {
      return `${hours} hours ago`;
    }

    diffTime -= hours * (1000 * 60 * 60);
    const minutes = Math.floor(diffTime / (1000 * 60));
    if (minutes > 0) {
      return `${minutes} minutes ago`;
    }
    diffTime -= minutes * (1000 * 60);
    const seconds = Math.ceil(diffTime / 1000);
    return `${seconds} seconds ago`;
  };

  const getUserName = async () => {
    const data = await fetch(
      `http://localhost:5000/api/v1/auth/getuserbyid/${user}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "auth-header":
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjY5NTJkZDlhNjU0N2NmMmExMDRiNTllIn0sImlhdCI6MTcyMTI2ODAyMH0.HzFCj14g8v48JSx3zetJpccBCgP5R_4vRJV8uslWvgw",
        },
      }
    );
    const res = await data.json();
    setName(res.name);
  };

  useEffect(() => {
    getUserName();
    getAskedTime();
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        width: "100%",
        margin: "5px",
        border: "2px solid red",
        padding: "5px",
        borderRadius: "20px",
        justifyContent: "space-between",
      }}
    >
      <div style={{ width: "20%", padding: "5px", minWidth: "80px" }}>
        <div>Reward price: {rewardPrice}</div>
        {/* Todo to remove condition */}
        <div>Views: {views && views.length}</div>
      </div>

      <div style={{ width: "78%", padding: "5px" }}>
        <div style={{ fontSize: "1.5rem" }}>{question}</div>
        <div style={{ fontSize: "1rem" }}>{alreadyKnew}</div>
        <div style={{ fontSize: "1rem" }}>Tags: {tags.join(", ")}</div>
        <div style={{ fontSize: "1rem", justifyContent:"space-between", display:"flex", flexDirection:"row"}}>
          <div >Asked by: {name}</div>
          <div style={{marginLeft:"10px"}}>{getAskedTime(date)}</div>
        </div>
      </div>
    </div>
  );
};

export default QuesCard;
