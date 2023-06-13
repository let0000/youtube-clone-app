import axios from "axios";
import React, { useEffect, useState } from "react";

function Subscribe(props) {
  const [SubscribeNumber, setSubscribeNumber] = useState(0);
  const [Subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    let variable = { userTo: props.userTo };

    axios.post("/api/subscribe/subscribeNumber", variable).then((response) => {
      if (response.data.success) {
        console.log(response.data.subscribeNumber);
        setSubscribeNumber(response.data.subscribeNumber);
      } else {
        alert("구독자 수 정보를 받아오지 못했습니다.");
      }
    });

    let subscibedVariable = {
      userTo: props.userTo,
      userFrom: localStorage.getItem("userId"),
    };

    axios
      .post("/api/subscribe/subscribed", subscibedVariable)
      .then((response) => {
        if (response.data.success) {
          console.log(response.data.subscribed);
          setSubscribed(response.data.subscribed);
        } else {
          alert("정보를 받아오지 못했습니다.");
        }
      });
  }, []);

  return (
    <div>
      <button
        style={{
          backgroundColor: `${Subscribed ? "#AAAAAA" : "#CC0000"}`,
          borderRadius: "4px",
          color: "white",
          padding: "10px 16px",
          fontWeight: "500",
          fontSize: "1rem",
          textTransform: "uppercase",
        }}
        onClick
      >
        {SubscribeNumber} {Subscribed ? "SUBSCRIBED" : "SUBSCRIBE"}
      </button>
    </div>
  );
}

export default Subscribe;
