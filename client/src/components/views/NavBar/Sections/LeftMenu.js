import React from "react";
import { Menu } from "antd";

function LeftMenu(props) {
  return (
    <Menu
      mode={props.mode}
      items={[
        { key: "mail", label: <a href="/">Home</a> },
        {
          key: "subscription",
          label: <a href="/subscription">Subscription</a>,
        },
      ]}
    />
  );
}

export default LeftMenu;
