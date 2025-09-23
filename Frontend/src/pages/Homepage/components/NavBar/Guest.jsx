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

function Guest({ toLoginPage, toSignupPage }) {
  return (
    <div className="login">
      <span onClick={toLoginPage} className="cursor-pointer">
        Log in
      </span>
      <span>|</span>
      <span onClick={toSignupPage} className="cursor-pointer">
        Sign up
      </span>
    </div>
  );
}

export default Guest;
