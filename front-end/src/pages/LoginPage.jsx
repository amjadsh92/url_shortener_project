/* eslint-disable */
import {
    useNavigate
  } from 'react-router-dom';

import "./LoginPage.scss"  

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
import { Password } from 'primereact/password';

function LoginPage({setAuthentication, usernameToLogin, alertMessage, setAlertMessage }){

  function DialogContent({ message}) {

    
  
    return (
      <>
        <div className="mt-4 ml-6px">{message}</div>
      </>
    );

  }
  

    const navigate = useNavigate()
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [dialog, setDialog] = useState({
      visible: false,
      message: "",
    });
    const [goodResponse, setGoodResponse] = useState(false);

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
          credentials: 'include'
        });
  
        if (response.ok) {
          setGoodResponse(true);
          const result = await response.json();
          setAuthentication(true)
          usernameToLogin(username)
          navigate("/")
          // setDialog({
          //   visible: true,
          //   message: result.message,
          // });
          }
         else if (response.status === 401){
             
          setGoodResponse(false);
          // const result = await response.json();
  
          setDialog({
            visible: true,
            message: "Unvalid credentials!",
          });

         }

        else if (!response.ok) {
          setGoodResponse(false);
          const result = await response.json();
  
          setDialog({
            visible: true,
            message: result.error,
          });
        }
      } catch (error) {
        setGoodResponse(false);
        setDialog({
          visible: true,
          message: "The server is down.Try again later",
        });
      }
    };


    const toSignupPage = () => {

        setAlertMessage(false)
        navigate("/signup")
    }

    const toHomePage = () => {

        setAlertMessage(false)
        navigate("/")
    }

    return(

        <div className="bg-hero w-full h-full p-1px">

        <div className="form-login p-1px">
       <Card title="Welcome to our URL Shortener APP" className="mt-6 mb-6 mx-auto">
          <form onSubmit={handleSubmit}>
          {alertMessage ? (<p className="text-red-700 text-center mt-2 mb-6">You need to be Logged in to create your own short url</p>) : ""}
          <p className="url font-semibold mb-2">Username</p>
            <AutoComplete
              value={username}       
              field="label"
              optionGroupLabel="label"
              optionGroupChildren="items"
              placeholder= "Enter your username"
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

            <Button
              className="mt-4 w-full"
            //   icon={`${!loading ? "pi pi-arrow-right" : "pi pi-spin pi-spinner"}`}
            //   iconPos={"right"}
              label={"Log in"}
              type="submit"
            />
        
            <div className="create-account flex gap-3 justify-content-center mt-2">
              <p className="text-gray">Don't have an account?</p> 
              <p className="cursor-pointer text-primary font-semibold no-underline align-content-center" onClick={toSignupPage}>Create account</p>
            </div>

            <p className="cursor-pointer back-home-color mt-4 text-center font-semibold no-underline" onClick={toHomePage} >
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
                              goodResponse={goodResponse}
                            />
                          </Dialog>
                        </div>
          
           
          </form>

          
        </Card>
        </div>
        
        
        </div>
        
        
      

    )


}



export default LoginPage; 