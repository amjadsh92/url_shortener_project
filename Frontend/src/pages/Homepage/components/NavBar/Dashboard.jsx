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
import Header from "./Header";
import NavMenu from "./NavMenu";

function Dashboard({
    toggleMenu,
    usernameRef,
    username,
    showNavMenu,
    handleLogout,
    toMyShortURLs
  }) {
    return (
      <div className="flex flex-column">
        <Header
          toggleMenu={toggleMenu}
          usernameRef={usernameRef}
          username={username}
          showNavMenu={showNavMenu}
        />
        {showNavMenu && <NavMenu handleLogout={handleLogout} toMyShortURLs={toMyShortURLs} />}
      </div>
    );
  }
  

  export default Dashboard;