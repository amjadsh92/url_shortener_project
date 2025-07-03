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


function LoginPage(){

    return(

        <div className="bg-hero w-full h-full p-1px">

        <div className="form-login p-1px">
       <Card title="Welcome to our URL Shortener APP" className="mt-6 mb-6 mx-auto">
          <form>

          <p className="url font-semibold mb-2">Username</p>
            <AutoComplete
              
              field="label"
              optionGroupLabel="label"
              optionGroupChildren="items"
              placeholder= "Enter your username"
              required
            />

          <p className="url font-semibold mb-2">Password</p>
            <AutoComplete
              
              field="label"
              optionGroupLabel="label"
              optionGroupChildren="items"
              placeholder= "Enter your Password"
              required
            />

            <Button
              className="mt-4 w-full"
            //   icon={`${!loading ? "pi pi-arrow-right" : "pi pi-spin pi-spinner"}`}
            //   iconPos={"right"}
              label={"Log in"}
            />
        
            <div className="create-account flex gap-2 justify-content-center mt-2">
              <p className="text-gray">Don't have an account?</p> 
              <p className="text-primary font-semibold">Create account</p>
            </div>

            <p className="mt-4 text-center font-semibold">
                Back to Home
            </p>
          
           
          </form>

          
        </Card>
        </div>
        
        
        </div>
        
        
      

    )


}



export default LoginPage; 