import React from "react";
import { Menu } from "antd";
import { useSelector } from "react-redux";
import axios from "axios";
import { USER_SERVER } from "../../../Config";
import { useNavigate } from "react-router-dom";

function RightMenu(props) {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);

  const logoutHandler = () => {
    axios.get(`${USER_SERVER}/logout`).then((response) => {
      if (response.status === 200) {
        navigate("/login");
      } else {
        alert("로그아웃에 실패했습니다.");
      }
    });
  };

  if (user.userData && !user.userData.isAuth) {
    return (
      <Menu
        mode={props.mode}
        items={[
          { key: "mail", label: <a href="/login">Sign in</a> },
          { key: "app", label: <a href="/register">Sign up</a> },
        ]}
      />
    );
  } else {
    return (
      <Menu
        mode={props.mode}
        items={[
          { key: "upload", label: <a href="/video/upload">Video</a> },
          { key: "logout", label: <a onClick={logoutHandler}>Logout</a> },
        ]}
      />
    );
  }
}

export default RightMenu;
