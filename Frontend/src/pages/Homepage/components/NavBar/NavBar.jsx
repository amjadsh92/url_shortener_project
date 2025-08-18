/* eslint-disable */
import "../../homePage.scss";
import "primereact/resources/themes/lara-light-blue/theme.css";
import "primeflex/primeflex.css";
import "../../../../App.css";
import "../../../../styles/spaces.css";
import "../../../../styles/fonts.css";
import "../../../../styles/colors.css";
import "primeicons/primeicons.css";
import "primeicons/primeicons.css";
import { useNavigate } from "react-router-dom";
import Dashboard from "./Dashboard";
import Guest from "./Guest";


function Navbar({
  hideMenu,
  toLoginPage,
  isAuthenticated,
  setIsAuthenticated,
  usernameRef,
  username,
  setPageLoading,
  showNavMenu,
  setShowNavMenu,
  toMyShortURLs
}) {
  const navigate = useNavigate();
  const baseURL = import.meta.env.VITE_BASE_URL;

  const toggleMenu = () => {
    setShowNavMenu((prev) => !prev);
  };

  const toSignupPage = () => {
    setPageLoading(true);
    setTimeout(() => {
      navigate("/signup");
    }, 500);
  };

  const handleLogout = async () => {
    setPageLoading(true);
    try {
      const response = await fetch(`${baseURL}/api/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (response.ok) {
        await response.json();
        sessionStorage.removeItem("originalURL")
        sessionStorage.removeItem("shortSlug");
        setTimeout(() => {
          setIsAuthenticated(false);
        }, 1000);
      } else {
        const result = await response.json();
        console.log(result.error);
      }
    } catch (error) {
      console.log("The server is down. Please Try again later.");
    }
  };

  return (
    <div className="navbar" onClick={hideMenu}>
      <div className={`${isAuthenticated ? 'navlink-auth' : 'navlink'}`}>
        {!isAuthenticated ? (
          <Guest toLoginPage={toLoginPage} toSignupPage={toSignupPage} />
        ) : (
          <Dashboard
            toggleMenu={toggleMenu}
            usernameRef={usernameRef}
            username={username}
            showNavMenu={showNavMenu}
            handleLogout={handleLogout}
            toMyShortURLs={toMyShortURLs}
          />
        )}
      </div>
    </div>
  );
}

export default Navbar;

