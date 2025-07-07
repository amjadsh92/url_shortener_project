/* eslint-disable */
import { useNavigate } from "react-router-dom";

import "./signupPage.scss";

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
import { useState } from "react";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";

function SignupPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const toLoginPage = () => {
    navigate("/login");
  };

  const toHomePage = () => {
    navigate("/");
  };


  const handleUsername = (e) => {
    setUsername(e.value);
    
  };



  const handlePassword = (e) => {
    setPassword(e.value);
    
  };



  const handleSubmit =  async (e) => {
    
    e.preventDefault();
    const baseURL = import.meta.env.VITE_BASE_URL;
    let credentials = {username, password}

    try {
        const response = await fetch(`${baseURL}/api/register`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(credentials),
        });
  
    }   catch(error){
             console.log("error")
   }
  }
  return (
    <div className="bg-hero w-full h-full p-1px">
      <div className="form-signup p-1px" onSubmit={handleSubmit}>
        <Card title="Create your account" className="mt-6 mb-6 mx-auto">
          <p className="sub-title text-center text-gray">
            Welcome to our URL shotener app
          </p>
          <form className="mt-4">
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
              
              toggleMask
              feedback={false}
              placeholder="Enter your password"
              onChange={handlePassword}
            />

            <Button
              className="mt-4 w-full"
              //   icon={`${!loading ? "pi pi-arrow-right" : "pi pi-spin pi-spinner"}`}
              //   iconPos={"right"}
              label={"Sign up"}
            />

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
          </form>
        </Card>
      </div>
    </div>
  );
}

export default SignupPage;
