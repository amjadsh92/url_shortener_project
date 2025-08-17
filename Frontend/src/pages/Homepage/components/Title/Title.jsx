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


function Title(){

    return(
     
  <div className="title">
    <h1 className="first-title text-center text-white">
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
  
    )
  }


  export default Title;