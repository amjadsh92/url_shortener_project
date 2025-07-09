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




function DialogContent({ message, goodResponse, username, toLoginPage }) {
    if (!goodResponse) return (

        <div className="mt-4 ml-6px">{message}</div>


    );
  
    return (
      <>
        <div className="mt-4 ml-6px">{message}</div>
        <p className="ml-6px">
          Your username is <b>{username}</b>
        </p>
        <span className="ml-6px">You can log in </span>
        <span
          className="cursor-pointer text-primary font-semibold"
          onClick={toLoginPage}
        >
          here
        </span>
      </>
    );
  }




function SignupPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [dialog, setDialog] = useState({
    visible: false,
    message: "",
  });
  const [goodResponse, setGoodResponse] = useState(false)

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
    setPassword(e.target.value);
    
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
    
        if (response.ok){
            setGoodResponse(true)
            const result = await response.json();
         
            setDialog({
                visible: true,
                // message: `<p class="mt-4 ml-6px">${result.message} <p>
                // <p class="ml-6px">Your username is <b>${username}</b></p>
                // <span class="ml-6px">You can log in </span><span class="cursor-pointer text-primary font-semibold" onclick={toLoginPage}>here</span>`
                message:result.message
              });

        }

        else if (!response.ok){
            setGoodResponse(false)
            const result = await response.json();

            setDialog({
                visible: true,
                message: result.error
              });

        }
  
    }   catch(error){
        setGoodResponse(false)     
        setDialog({
            visible: true,
            message: "The server is down.Try again later" 
            
          });
   }
  }
  return (
    <div className="bg-hero w-full h-full p-1px">
      <div className="form-signup p-1px">
        <Card title="Create your account" className="mt-6 mb-6 mx-auto">
          <p className="sub-title text-center text-gray">
            Welcome to our URL shotener app
          </p>
          <form className="mt-4" onSubmit={handleSubmit}>
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
              required
            />

            <Button
              className="mt-4 w-full"
              //   icon={`${!loading ? "pi pi-arrow-right" : "pi pi-spin pi-spinner"}`}
              //   iconPos={"right"}
              label={"Sign up"}
              type= "submit"
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
        {/* <div dangerouslySetInnerHTML={{ __html: dialog.message }} /> */}
        <DialogContent message={dialog.message}  goodResponse = {goodResponse} username={username} toLoginPage={toLoginPage} />
        </Dialog>
        </div>

          </form>
        </Card>
      </div>
    </div>
  );
}

export default SignupPage;
