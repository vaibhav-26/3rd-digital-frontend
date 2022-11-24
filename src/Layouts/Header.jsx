import React, { useEffect, useState } from "react";
import { Button, Menu } from "antd";
import { useNavigate } from "react-router-dom";
import { LogoutOutlined, RobotFilled } from "@ant-design/icons";
import { useAuth } from "../components/Auth";
import { useDispatch } from "react-redux";
import { remove } from "../features/authTokenSlice";

function Header() {
  const [path, setPath] = useState("/");

  const auth = useAuth();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    setPath(window.location.pathname);
  }, []);

  const handleLogout = async () => {
    dispatch(remove());
    auth.logout();
    navigate("/");
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "end",
          alignItems: "center",
          padding: "10px",
          width: "100%",
          borderBottom: "1px solid lightgrey",
        }}
        className="header"
      >
        <Menu
          mode="horizontal"
          defaultSelectedKeys={[path]}
          selectedKeys={[path]}
          style={{
            width: "100%",
            border: "none",
          }}
          className="header"
        >
          <RobotFilled
            style={{ fontSize: "24px", fontWeight: "bold", color: "#6534da" }}
          />
        </Menu>

        {auth.user ? (
          <>
            <Button
              style={{
                height: "37px",
                width: "11px 0px",
              }}
              className="button"
              type="primary"
              icon={<LogoutOutlined />}
              onClick={() => handleLogout()}
            >
              LogOut
            </Button>
          </>
        ) : null}
      </div>
    </>
  );
}

export default Header;
