/* eslint-disable */
import "./signupPage.scss";
import "primereact/resources/themes/lara-light-blue/theme.css";
import "primeflex/primeflex.css";
import "../App.css";
import "../styles/spaces.css";
import "../styles/fonts.css";
import "../styles/colors.css";
import "primeicons/primeicons.css";
import "primeicons/primeicons.css";
import * as yup from "yup";
import { AutoComplete } from "primereact/autocomplete";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { useState, useEffect } from "react";
import { Dialog } from "primereact/dialog";
import { Password } from "primereact/password";
import { useNavigate } from "react-router-dom";

function SignupPage({ setLoading }) {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [dialog, setDialog] = useState({
    visible: false,
    message: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [borderRedZone, setBorderRedZone] = useState({});
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
        console.log("failed to know authentication state");
      } finally {
        setLoading(false);
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

  const toLoginPage = () => {
    setLoading(true);
    setTimeout(() => {
      navigate("/login");
    }, 1000);
  };

  const toHomePage = () => {
    navigate("/");
  };

  const handleUsername = (e) => {
    setErrorMessage("");
    setBorderRedZone({});
    setUsername(e.value);
  };

  const handlePassword = (e) => {
    setErrorMessage("");
    setBorderRedZone({});
    setPassword(e.target.value);
  };

  const handleConfirmPassword = (e) => {
    setErrorMessage("");
    setBorderRedZone({});
    setConfirmPassword(e.target.value);
  };

  const schema = yup.object().shape({
    username: yup
      .string()
      .min(4, "Username must be at least 4 characters long")
      .max(20, "Username must be at most 20 characters long")
      .matches(/^[a-zA-Z0-9]+$/, "Username must be alphanumeric")
      .required("Username is required"),

    password: yup
      .string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters long")
      .matches(/[A-Z]/, "At least one uppercase letter required")
      .matches(/[a-z]/, "At least one lowercase letter required")
      .matches(/[0-9]/, "At least one number required")
      .matches(/[@$!%*?&]/, "At least one special character required"),

    confirmPassword: yup
      .string()
      .required("Confirm your password")
      .oneOf([yup.ref("password"), null], "Passwords must match"),
  });

  const validCredentialFormat = async (data) => {
    let path;
    let message;

    try {
      await schema.validate(data, { abortEarly: false });

      return "valid";
    } catch (err) {
      if (err.inner) {
        path = err.inner[0].path;
        message = err.inner[0].message;
        return { path, message };
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setBorderRedZone({});
    const baseURL = import.meta.env.VITE_BASE_URL;
    let credentials = { username, password, confirmPassword };
    let credentialsFormat = await validCredentialFormat(credentials);

    if (credentialsFormat !== "valid") {
      setErrorMessage(credentialsFormat.message);

      if (credentialsFormat.path === "username") {
        setBorderRedZone({ ...borderRedZone, usernameField: true });
      } else if (credentialsFormat.path === "password") {
        setBorderRedZone({ ...borderRedZone, passwordField: true });
      } else if (credentialsFormat.path === "confirmPassword") {
        setBorderRedZone({ ...borderRedZone, confirmPasswordField: true });
      }

      return;
    }

    try {
      const response = await fetch(`${baseURL}/api/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      if (response.ok) {
        const result = await response.json();

        setDialog({
          visible: true,
          message: result.message,
        });
      } else if (!response.ok) {
        const result = await response.json();

        setErrorMessage(result.error);
        if (result.path === "username") {
          setBorderRedZone({ ...borderRedZone, usernameField: true });
        }
      }
    } catch (error) {
      setDialog({
        visible: true,
        message: "The server is down.Try again later",
      });
    }
  };
  return (
    <div className="bg-hero align-content-center w-full h-full p-1px">
      <div className="form-signup  p-1px">
        <Card title="Create your account" className="mt-6 mb-6 mx-auto">
          <p className="sub-title text-center text-gray">
            Welcome to our URL shotener app
          </p>

          <form className="mt-4" onSubmit={handleSubmit}>
            <div className="mb-4">
              <p className="url font-semibold mb-2">Username</p>
              <AutoComplete
                className={`${borderRedZone?.usernameField ? "border-red borderRedZone" : ""}`}
                value={username}
                field="label"
                optionGroupLabel="label"
                optionGroupChildren="items"
                placeholder="Enter your username"
                onChange={handleUsername}
                required
              />
            </div>
            <div className="mb-4">
              <p className="url font-semibold mb-2">Password</p>
              <Password
                id="password"
                toggleMask
                feedback={false}
                className={`${borderRedZone?.passwordField ? "border-red borderRedZone" : ""}`}
                placeholder="Enter your password"
                onChange={handlePassword}
                required
              />
            </div>
            <p className="url font-semibold mb-2">Confirm Password</p>
            <Password
              toggleMask
              feedback={false}
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={handleConfirmPassword}
              className={`${borderRedZone?.confirmPasswordField ? "border-red borderRedZone" : ""}`}
              required
            />

            <p className="text-red-700 text-sm ml-1 mt-4">{errorMessage}</p>

            <Button className="mt-3 w-full" label={"Sign up"} type="submit" />

            <div className="login flex gap-3 justify-content-center mt-2">
              <p className="text-gray">Already have an account?</p>
              <p
                className="cursor-pointer text-primary font-semibold no-underline align-content-center"
                onClick={toLoginPage}
              >
                Login
              </p>
            </div>

            <p
              className="cursor-pointer back-home-color mt-4 text-center font-semibold no-underline"
              onClick={toHomePage}
            >
              Back to Home
            </p>
            <div className="form-signup">
              <Dialog
                header="Your registration"
                visible={dialog.visible}
                className="dialog-signup"
                style={{ width: "150px", wordBreak: "break-word" }}
                breakpoints={{ "400px": "300px", "338px": "250px" }}
                onHide={() => setDialog({ ...dialog, visible: false })}
                footer={
                  <div>
                    <Button
                      label="OK"
                      icon="pi pi-check"
                      onClick={() => setDialog({ ...dialog, visible: false })}
                      autoFocus
                    />
                  </div>
                }
              >
                <DialogContent
                  message={dialog.message}
                  username={username}
                  toLoginPage={toLoginPage}
                  closeDialog={() => setDialog({ ...dialog, visible: false })}
                />
              </Dialog>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}

function DialogContent({ message, username, toLoginPage, closeDialog }) {
  const handleClick = () => {
    closeDialog();
    toLoginPage();
  };

  return (
    <>
      <div className="mt-4 ml-6px">{message}</div>
      <p className="ml-6px">
        Your username is <b>{username}</b>
      </p>
      <span className="ml-6px">You can log in </span>
      <span
        className="cursor-pointer text-primary font-semibold"
        onClick={handleClick}
      >
        here
      </span>
    </>
  );
}

export default SignupPage;
