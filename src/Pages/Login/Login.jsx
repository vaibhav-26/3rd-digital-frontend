import React, { useEffect } from "react";
import Layout from "../../Layouts/index";
import { Row, Col } from "antd";
import { useNavigate } from "react-router-dom";
import { postRequest } from "../../api";
import { useAuth } from "../../components/Auth";
import { useDispatch } from "react-redux";
import { store } from "../../features/authTokenSlice";
import "./login.scss";
import FacebookLogin from "react-facebook-login";

function Login() {
  const navigate = useNavigate();
  const auth = useAuth();
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/dashboard");
    }
  }, []);

  const responseFacebook = async (response) => {
    console.log(response);
    await postRequest("facebook/login", {
      accessToken: response.accessToken,
      userID: response.userID,
    }).then(({ data }) => {
      auth.login(data.token);
      dispatch(store({ token: data.token, user: JSON.stringify(data.user) }));
      navigate("/dashboard", { replace: true });
    });
  };

  return (
    <Layout>
      <Row justify="center" className="login_layout">
        <Col xs={24} sm={24} md={8} lg={8} xl={6} className="login_box">
          <div className="login_header">
            <div className="bold_text ">
              <h2>Welcome Back!</h2>
            </div>
            <div>
              <p>Login to continue</p>
            </div>
          </div>
          <FacebookLogin
            appId="1620286848387152"
            autoLoad={false}
            callback={responseFacebook}
            icon="fa-facebook"
          />
        </Col>
      </Row>
    </Layout>
  );
}

export default Login;
