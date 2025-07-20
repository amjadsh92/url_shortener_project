/* eslint-disable */
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate
} from 'react-router-dom';

import { useState } from "react";
import { ProgressSpinner } from "primereact/progressspinner";
import HomePage from './pages/homePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/signupPage';


function App() {

  const [alertMessage, setAlertMessage]  = useState(false)
  const [loading, setLoading] = useState(false);
  return (
    <Router>

      {loading && (
          <div className="overlay">
          <ProgressSpinner style={{ width: '100px', height: '100px' }} />
          </div>
        
      )}
      
        <Routes>
          <Route
            path="/"
            element={
              <HomePage setAlertMessage={setAlertMessage} setLoading={setLoading} loading={loading}/>
            }
          />

        <Route path="/login" element={  <LoginPage alertMessage={alertMessage} setAlertMessage={setAlertMessage} setLoading={setLoading} />} />
        <Route path="/signup" element={ <SignupPage setLoading={setLoading} />} />
         
        </Routes>
      
    </Router>

  )
  
}




export default App;
