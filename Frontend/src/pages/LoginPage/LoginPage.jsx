/* eslint-disable */
import "./LoginPage.scss";
import "primereact/resources/themes/lara-light-blue/theme.css";
import "primeflex/primeflex.css";
import "../../App.css";
import "../../styles/spaces.css";
import "../../styles/fonts.css";
import "../../styles/colors.css";
import "primeicons/primeicons.css";
import "primeicons/primeicons.css";
import { useNavigate } from "react-router-dom";
import { AutoComplete } from "primereact/autocomplete";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { useState, useEffect } from "react";
import { Password } from "primereact/password";
import LoginResultModal from "./components/Login/LoginResultModal";

function LoginPage({
  authorizationMessage,
  setAuthorizationMessage,
  setPageLoading,
}) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [dialog, setDialog] = useState({
    visible: false,
    message: "",
  });

  const navigate = useNavigate();
  const baseURL = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    const fetchAuthentication = async () => {
      try {
        const res = await fetch(`${baseURL}/api/authentication`, {
          credentials: "include",
        });
        const result = await res.json();
        if (result.isAuthenticated) {
          navigate("/");
        }
      } catch (err) {
        console.log("error");
      } finally {
        setPageLoading(false);
      }
    };
    fetchAuthentication();

    const img = new Image();
    img.src = "5559852.jpg";

    img.onload = () => {
      const preloader = document.getElementById("preloader");
      if (preloader) {
        preloader.style.transition = "opacity 0.5s";
        preloader.style.opacity = "0";
        setTimeout(() => preloader.remove(), 500);
      }
    };
  }, []);

  const handleUsername = (e) => {
    setUsername(e.value);
  };

  const handlePassword = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoginLoading(true);
    const baseURL = import.meta.env.VITE_BASE_URL;
    let credentials = { username, password };

    try {
      const response = await fetch(`${baseURL}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
        credentials: "include",
      });

      if (response.ok) {
        setLoginLoading(false);
        setPageLoading(true);
        setTimeout(() => {
          navigate("/");
        }, 500);
      } else if (response.status === 401) {
        setLoginLoading(false);
        setDialog({
          visible: true,
          message: "Invalid credentials!",
        });
      } else if (!response.ok) {
        const result = await response.json();
        setLoginLoading(false);
        setDialog({
          visible: true,
          message: result.error,
        });
      }
    } catch (error) {
      setLoginLoading(false);
      setDialog({
        visible: true,
        message: "The server is down.Try again later.",
      });
    }
  };

  const toSignupPage = () => {
    setAuthorizationMessage(false);
    setPageLoading(true);
    setTimeout(() => {
      navigate("/signup");
    }, 500);
  };

  const toHomePage = () => {
    setAuthorizationMessage(false);
    navigate("/");
  };

  return (
    <div className="bg-hero w-full h-full p-1px align-content-center">
      <div className="form-login p-1px mt-6">
        <Card
          title="Welcome to our URL Shortener App"
          className="mt-6 mb-6 mx-auto"
        >
          <form onSubmit={handleSubmit}>
            {authorizationMessage ? (
              <p className="text-red-700 text-center mt-2 mb-6">
                You need to be logged in to create your custom short URL
              </p>
            ) : (
              ""
            )}
            <p className="url font-semibold mb-2">Username</p>
            <AutoComplete
              value={username}
              field="label"
              optionGroupLabel="label"
              optionGroupChildren="items"
              placeholder="Enter your username"
              onChange={handleUsername}
              required
            />

            <p className="url font-semibold mb-2">Password</p>
            <Password
              id="password"
              feedback={false}
              placeholder="Enter your password"
              onChange={handlePassword}
              required
            />

            <Button
              className="log-in-button mt-4 w-full"
              label={loginLoading ? "" : "Log in"}
              icon={`${loginLoading ? "pi pi-spin pi-spinner" : ""}`}
              type="submit"
            />

            <div className="create-account flex gap-3 justify-content-center mt-2">
              <p className="text-gray">Don't have an account?</p>
              <p
                className="cursor-pointer text-primary font-semibold no-underline align-content-center"
                onClick={toSignupPage}
              >
                Create account
              </p>
            </div>

            <p
              className="back-home cursor-pointer back-home-color mt-4 text-center font-semibold no-underline"
              onClick={toHomePage}
            >
              Back to Home
            </p>

            <LoginResultModal dialog={dialog} setDialog={setDialog} />
          </form>
        </Card>
      </div>
      <p className="footer text-center text-white mt-6 sm:text-sm">
        &copy; 2025, Amjad Sharafeddine. All rights reserved.
      </p>
    </div>
  );
}

export default LoginPage;
