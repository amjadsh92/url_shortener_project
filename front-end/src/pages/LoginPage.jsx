/* eslint-disable */
import "./LoginPage.scss";
import "primereact/resources/themes/lara-light-blue/theme.css";
import "primeflex/primeflex.css";
import "../App.css";
import "../styles/spaces.css";
import "../styles/fonts.css";
import "../styles/colors.css";
import "primeicons/primeicons.css";
import "primeicons/primeicons.css";
import { useNavigate } from "react-router-dom";
import { AutoComplete } from "primereact/autocomplete";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { useState, useEffect } from "react";
import { Dialog } from "primereact/dialog";
import { Password } from "primereact/password";

function LoginPage({ alertMessage, setAlertMessage, setLoading  }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [dialog, setDialog] = useState({
    visible: false,
    message: "",
  });
  
  const navigate = useNavigate();
  const baseURL = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    const navigationEntries = performance.getEntriesByType("navigation");
    const navigationType = navigationEntries[0]?.type;

    const fetchAuthentication = async () => {
      try {
        const res = await fetch(`${baseURL}/api/authentication`, {
          credentials: "include",
        });
        const result = await res.json();
        if (result.isAuthenticated) {
          navigate("/");
        } else if (navigationType === "navigation") {
          setAlertMessage(false);
        }
      } catch (err) {
        console.log("error");
      }finally{
        setLoading(false)
      }
    };
    fetchAuthentication();

    const img = new Image();
    img.src = '5559852.jpg'; 

    img.onload = () => {
      const preloader = document.getElementById('preloader');
      if (preloader) {
        preloader.style.transition = 'opacity 0.5s';
        preloader.style.opacity = '0';
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
        
        setLoading(true);
        setTimeout(() => {
          navigate("/");
        }, 1000);
        
      } else if (response.status === 401) {
        
        setDialog({
          visible: true,
          message: "Unvalid credentials!",
        });
      } else if (!response.ok) {
        
        const result = await response.json();

        setDialog({
          visible: true,
          message: result.error,
        });
      }
    } catch (error) {
      
      setDialog({
        visible: true,
        message: "The server is down.Try again later",
      });
    }
  };

  const toSignupPage = () => {
    setAlertMessage(false);
    setLoading(true);
    setTimeout(() => {
      navigate("/signup");
    }, 1000);
  };

  const toHomePage = () => {
    setAlertMessage(false);
    navigate("/")
  };

  return (
    <div className="bg-hero w-full h-full p-1px align-content-center">
      <div className="form-login p-1px">
        <Card
          title="Welcome to our URL Shortener APP"
          className="mt-6 mb-6 mx-auto"
        >
          <form onSubmit={handleSubmit}>
            {alertMessage ? (
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
            />

            <Button className="mt-4 w-full" label={"Log in"} type="submit" />

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
                  
                />
              </Dialog>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}

function DialogContent({ message }) {
  return (
    <>
      <div className="mt-4 ml-6px">{message}</div>
    </>
  );
}

export default LoginPage;
