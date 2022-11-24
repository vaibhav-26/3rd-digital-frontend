import React from "react";
import { Layout } from "antd";
const { Footer: Foot } = Layout;

function Footer() {
  return (
    <Foot style={{ textAlign: "center" }}>
      Student Portal {new Date().getFullYear()} Created by Vaibhav
    </Foot>
  );
}

export default Footer;
