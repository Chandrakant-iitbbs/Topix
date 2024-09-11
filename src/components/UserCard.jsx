const UserCard = (props) => {
  const { user } = props;
  let { name, interestedTopics, dp } = user;
  if (interestedTopics.length > 3) {
    interestedTopics = interestedTopics.slice(0, 3);
  }
  const getStar = (n) => {
    let stars = "";
    for (let i = 0; i < n; i++) {
      stars += "⭐";
    }
    return stars;
  };

  return (
    <div
      style={{
        minWidth: "300px",
        width: "21rem",
        margin: "10px 10px",
        padding: "10px 10px",
        textWrap: "wrap",
        display: "flex",
        flexDirection: "row",
        border: "1.4px solid gray",
        borderRadius: "5px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          width: "90px",
        }}
      >
        <img
          src={`data:image/jpeg;base64,${dp}`}
          alt=""
          width="70px"
          height="70px"
        />
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <span style={{ fontSize: "20px" }}>{name}</span>
        <span>{getStar(3)}</span>
        <span>{interestedTopics.map((topic) => topic).join(", ")}</span>
      </div>
    </div>
  );
};

export default UserCard;
