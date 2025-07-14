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

  return (
    <Router>
      
        <Routes>
          <Route
            path="/"
            element={
              <HomePage  isAuthenticated={isAuthenticated} setAuthentication ={setIsAuthenticated}/>
            }
          />

        <Route path="/login" element={<LoginPage isAuthenticated={isAuthenticated} setAuthentication={setIsAuthenticated} />} />
        <Route path="/signup" element={<SignupPage isAuthenticated={isAuthenticated} />} />
         
        </Routes>
      
    </Router>

  )
  
}




export default App;
