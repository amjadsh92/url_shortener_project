/* eslint-disable */
import "./homePage.scss";
import "primereact/resources/themes/lara-light-blue/theme.css";
import "primeflex/primeflex.css";
import "../App.css";
import "../styles/spaces.css";
import "../styles/fonts.css";
import "../styles/colors.css";
import "primeicons/primeicons.css";
import "primeicons/primeicons.css";
import { AutoComplete } from "primereact/autocomplete";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { useState, useEffect, useRef } from "react";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { useNavigate } from "react-router-dom";

function HomePage({ setAlertMessage, setLoading, loading }) {
  let [originalURL, setOriginalURL] = useState("");
  let [shortURL, setShortURL] = useState("");
  let [shortSlug, setShortSlug] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const [label, setLabel] = useState("Copy");
  const [icon, setIcon] = useState("pi pi-copy");
  const [copied, setCopied] = useState(false);
  const [badRequest, setBadRequest] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [borderRedZone, setBorderRedZone] = useState({});
  const [shorturlLoading, setShorturlLoading] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const baseURL = import.meta.env.VITE_BASE_URL;

  const navigate = useNavigate();

  useEffect(() => {
    const fetchAuthentication = async () => {
      try {
        // setLoading(true)
        const res = await fetch(`${baseURL}/api/authentication`, {
          credentials: "include",
        });
        const result = await res.json();
        if(result){
        setIsAuthenticated(result.isAuthenticated);
        setUsername(result.username);
      
        }
      } catch (err) {
        setIsAuthenticated(false);
      }finally{
       
          const preloader = document.getElementById('preloader');
          if (preloader) preloader.remove();
       
      }
    };
    fetchAuthentication();
  }, [isAuthenticated]);

  

  const toSignupPage = () => {
    navigate("/signup");
  };

  const toLoginPage = () => {
    setLoading(true);
    setTimeout(() => {
      navigate("/login");
      setLoading(false);
    }, 2000);
    
  };

  const usernameRef = useRef(null);
  const logoutRef = useRef(null);

  const hideMenu = () => {
    if (
      (usernameRef.current && !usernameRef.current.contains(event.target)) ||
      (logoutRef.current && !logoutRef.current.contains(event.target))
    ) {
      setShowMenu(false);
    }
  };

  const toggleMenu = () => {
    setShowMenu((prev) => !prev);
  };

  const handleOriginalURLChange = (e) => {
    setOriginalURL(e.value);
    setBorderRedZone({});
  };

  const handleShortURLChange = (e) => {
    setShortSlug(e.value);
    setBorderRedZone({});
  };

  const handleLogout = async () => {
    try {
      const response = await fetch(`${baseURL}/api/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (response.ok) {
        const result = await response.json();
        setIsAuthenticated(false);
        navigate("/");
      } else {
        const result = await response.json();
        console.log(result.error);
      }
    } catch (error) {
      console.log("The server is down. Please Try again later.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setShorturlLoading(true);
    let url = { originalURL, shortSlug };

    try {
      const response = await fetch(`${baseURL}/api/short-url`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(url),
        credentials: "include",
      });

      if (response.ok) {
        setShorturlLoading(false);
        const result = await response.json();
        originalURL = result.original_url;
        setShortURL(result.short_url);
        setShowDialog(true);
        setErrorMessage("");
        setBadRequest(false);
        setBorderRedZone({});
      } else if (response.status === 401) {
        setAlertMessage(true);
        toLoginPage();
      } else {
        setShorturlLoading(false);
        const result = await response.json();
        setErrorMessage(result.error);
        setBadRequest(true);
        if (result.name === "long") {
          setBorderRedZone({ ...borderRedZone, long: true });
        } else if (result.name === "short") {
          setBorderRedZone({ ...borderRedZone, short: true });
        }
      }
    } catch (error) {
      setErrorMessage("The server is down. Please Try again later.");
      setShorturlLoading(false);
    }
  };

  // if(loading) {
  //   return null; 
  // }

  return (
    <div className="bg-hero w-full h-full p-1px">
      <div className="navbar" onClick={hideMenu}>
        <div className="navlinks">
          {!isAuthenticated ? (
            <div className="login">
              <span onClick={toLoginPage} className="cursor-pointer">
                Log In
              </span>
              <span>|</span>
              <span onClick={toSignupPage} className="cursor-pointer">
                Sign Up
              </span>
            </div>
          ) : (
            <div className="flex flex-column">
              <div className="username" onClick={toggleMenu} ref={usernameRef}>
                <span>Welcome, {username} </span>{" "}
                {showMenu ? (
                  <i
                    className="pi pi-sort-up-fill"
                    style={{ color: "white" }}
                  ></i>
                ) : (
                  <i
                    className="pi pi-sort-down-fill"
                    style={{ color: "white" }}
                  ></i>
                )}
              </div>{" "}
              {showMenu && (
                <div
                  className="menu flex justify-content-center gap-2 align-items-center cursor-pointer w-full"
                  ref={logoutRef}
                  onClick={handleLogout}
                >
                  <i className="pi pi-sign-out" style={{ color: "white" }}></i>{" "}
                  <span>Log out</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="home" onClick={hideMenu}>
        <div className="title">
          <h1 className="first-title text-center text-white mt-50px">
            URL Shortener App
          </h1>
          <h1 className="second-title text-center text-white mt-5 ">
            Build stronger digital connections
          </h1>
          <p className="text-center text-white text-xl font-normal font-helvetica mx-auto w-8 mt-5">
            Use our URL shortener to engage your audience and connect them to
            the right information.
          </p>
        </div>
        <div className="form-home p-1px">
          <Card title="Shorten a long link" className="mt-6 mb-6 mx-auto">
            <form onSubmit={handleSubmit}>
              <p className="url font-semibold mb-2">
                Paste your long link here
              </p>
              <AutoComplete
                className={`${borderRedZone?.long ? "border-red" : "border-grey"}`}
                value={originalURL}
                field="label"
                optionGroupLabel="label"
                optionGroupChildren="items"
                placeholder="https://www.example.com/my-long-url"
                onChange={handleOriginalURLChange}
                required
              />

              <p className="url font-semibold mb-2">
                Create your own slug (optional)
              </p>
              <AutoComplete
                value={shortSlug}
                className={`${borderRedZone?.short ? "border-red" : "border-grey"}`}
                field="label"
                optionGroupLabel="label"
                optionGroupChildren="items"
                placeholder="my-short-url"
                onChange={handleShortURLChange}
              />
              {badRequest && (
                <p className="text-red-700 text-sm ml-1 mb-3">{errorMessage}</p>
              )}
              <Button
                className="mt-4 min-w-183px"
                icon={`${!shorturlLoading ? "pi pi-arrow-right" : "pi pi-spin pi-spinner"}`}
                iconPos={"right"}
                label={"Get your link for free"}
              />
            </form>

            <Dialog
              header="Here is your short URL!"
              visible={showDialog}
              style={{ width: "60vw" }}
              onHide={() => {
                setShowDialog(false);
                setLabel("Copy");
                setIcon("pi pi-copy");
                setCopied(false);
              }}
              closable
            >
              <div className="dialog-input flex gap-3 mt-5 mb-2">
                <InputText value={shortURL} readOnly className="w-full" />
                <Button
                  className="min-w-max"
                  label={label}
                  icon={icon}
                  onClick={() => {
                    navigator.clipboard.writeText(shortURL);
                    setLabel("Copied");
                    setIcon("pi pi-check");
                    setCopied(true);
                  }}
                />
              </div>

              {copied && (
                <small className="text-green-600 font-medium ml-1 mb-3">
                  Link copied to clipboard!
                </small>
              )}
            </Dialog>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
