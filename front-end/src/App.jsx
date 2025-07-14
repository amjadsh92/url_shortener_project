/* eslint-disable */
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate
} from 'react-router-dom';

import { useState } from "react";

import HomePage from './pages/homePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/signupPage';


function App() {

  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [username, setUsername] = useState("")
  const [alertMessage, setAlertMessage]  = useState(false)

  return (
    <Router>
      
        <Routes>
          <Route
            path="/"
            element={
              <HomePage  isAuthenticated={isAuthenticated} setAuthentication ={setIsAuthenticated} username={username} usernameToLogin ={setUsername}  setAlertMessage={setAlertMessage}/>
            }
          />

        <Route path="/login" element={<LoginPage setAuthentication={setIsAuthenticated} usernameToLogin={setUsername} alertMessage={alertMessage} setAlertMessage={setAlertMessage} />} />
        <Route path="/signup" element={<SignupPage isAuthenticated={isAuthenticated} />} />
         
        </Routes>
      
    </Router>

  )
  
}




export default App;
