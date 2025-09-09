/* eslint-disable */
import "./homePage.scss";
import "primereact/resources/themes/lara-light-blue/theme.css";
import "primeflex/primeflex.css";
import "../../App.css";
import "../../styles/spaces.css";
import "../../styles/fonts.css";
import "../../styles/colors.css";
import "primeicons/primeicons.css";
import "primeicons/primeicons.css";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import ListOfURLs from "./components/ListOfURLs/ListOfURLs";
import Navbar from "./components/NavBar/NavBar";
import ShorteningURLForm from "./components/ShorteningURLForm/ShorteningURLForm";
import Title from "./components/Title/Title";

function HomePage({ setAuthorizationMessage, setPageLoading }) {
  const [showNavMenu, setShowNavMenu] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [listOfURLs, setListOfURLs] = useState([]);

  const baseURL = import.meta.env.VITE_BASE_URL;

  const navigate = useNavigate();
  const usernameRef = useRef(null);
  const listOfURLsRef = useRef(null);

  useEffect(() => {
    const fetchAuthentication = async () => {
      setAuthorizationMessage(false);

      try {
        const res = await fetch(`${baseURL}/api/authentication`, {
          credentials: "include",
        });
        const result = await res.json();

        if (result) {
          setIsAuthenticated(result.isAuthenticated);
          setUsername(result.username);
        }
        if (result.isAuthenticated) {
          await fetchURLs();
        }
      } catch (err) {
        setIsAuthenticated(false);
      } finally {
        setPageLoading(false);
      }
    };

    const fetchURLs = async () => {
      try {
        const res = await fetch(`${baseURL}/api/user?username=${username}`, {
          credentials: "include",
        });

        if (res.ok) {
          const result = await res.json();
          let listOfURLsResult = result.listOfURLs;
          if (listOfURLsResult) {
            listOfURLsResult.map(
              (url) => (url.short_url = `${baseURL}/${url.short_url}`)
            );
            setListOfURLs(listOfURLsResult);
          }
        }
        if (!res.ok) {
          console.log(res.error);
        }
      } catch (err) {
        console.log("can't fetch url");
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
  }, [isAuthenticated]);

  const toLoginPage = () => {
    setPageLoading(true);
    setTimeout(() => {
      navigate("/login");
    }, 500);
  };

  const hideMenu = () => {
    if (usernameRef.current && !usernameRef.current.contains(event.target)) {
      setShowNavMenu(false);
    }
  };

  const scrollToList = () => {
    listOfURLsRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="bg-hero-home w-full h-full p-1px">
      <Navbar
        hideMenu={hideMenu}
        toLoginPage={toLoginPage}
        isAuthenticated={isAuthenticated}
        setIsAuthenticated={setIsAuthenticated}
        username={username}
        usernameRef={usernameRef}
        setPageLoading={setPageLoading}
        showNavMenu={showNavMenu}
        setShowNavMenu={setShowNavMenu}
        toMyShortURLs={scrollToList}
      />
      <div className="home p-1px" onClick={hideMenu}>
        <Title />
        <ShorteningURLForm
          listOfURLs={listOfURLs}
          setListOfURLs={setListOfURLs}
          setAuthorizationMessage={setAuthorizationMessage}
          username={username}
          toLoginPage={toLoginPage}
        />

        {username ? (
          <ListOfURLs
            listOfURLs={listOfURLs}
            setListOfURLs={setListOfURLs}
            listOfURLsRef={listOfURLsRef}
          />
        ) : (
          ""
        )}
      </div>
      <div className="footer-home text-center text-white">
        &copy; 2025, Amjad Sharafeddine. All rights reserved.
      </div>
    </div>
  );
}

export default HomePage;
