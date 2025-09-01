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

function Header({ toggleMenu, usernameRef, username, showNavMenu }) {
  return (
    <div className="username" onClick={toggleMenu} ref={usernameRef}>
      <span className="truncate-username" title={username}>Welcome, {username} </span>{" "}
      {showNavMenu ? (
        <i className="pi pi-sort-up-fill" style={{ color: "white" }}></i>
      ) : (
        <i className="pi pi-sort-down-fill" style={{ color: "white" }}></i>
      )}
    </div>
  );
}

export default Header;
