/* eslint-disable */
import {
  BrowserRouter as Router,
  Routes,
  Route
} from 'react-router-dom';

import { useState } from "react";
import { ProgressSpinner } from "primereact/progressspinner";
import HomePage from './pages/Homepage/homePage'
import LoginPage from './pages/LoginPage/LoginPage';
import SignupPage from './pages/SignupPage/SignupPage';


function App() {

  const [authorizationMessage, setAuthorizationMessage]  = useState(false)
  const [pageLoading, setPageLoading] = useState(false);
  return (
    <Router>

      {pageLoading && (
          <div className="overlay">
          <ProgressSpinner style={{ width: '100px', height: '100px' }} />
          </div>
        
      )}
      
        <Routes>
          <Route
            path="/"
            element={
              <HomePage setAuthorizationMessage={setAuthorizationMessage} setPageLoading={setPageLoading} pageLoading={pageLoading}/>
            }
          />

        <Route path="/login" element={  <LoginPage authorizationMessage={authorizationMessage} setAuthorizationMessage={setAuthorizationMessage} setPageLoading={setPageLoading} />} />
        <Route path="/signup" element={ <SignupPage setPageLoading={setPageLoading} />} />
         
        </Routes>
      
    </Router>

  )
  
}




export default App;
