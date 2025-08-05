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


function NavMenu({ handleLogout }) {
    return (
      <div
        className="menu flex justify-content-center gap-2 align-items-center cursor-pointer w-full"
        onClick={handleLogout}
      >
        <i className="pi pi-sign-out" style={{ color: "white" }}></i>{" "}
        <span>Log out</span>
      </div>
    );
  }


 export default NavMenu 